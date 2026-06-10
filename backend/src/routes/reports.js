import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generatePortfolioReport, generateClientReport, generateOrgReport } from "../services/pdfReportService.js";
import { computePortfolioRisk, buildReturns } from "../services/riskMetricsService.js";
import { getBenchmarkData } from "../services/fredService.js";
import { ensureOrgTables, logAudit } from "./organizations.js";

const router = Router();
let _pool = null;
export function setReportsPool(pool) { _pool = pool; }

// ── Helpers ───────────────────────────────────────────────────────────────────

async function assertOrgMember(pool, orgId, userId) {
  const { rows } = await pool.query(
    `SELECT role FROM org_members WHERE org_id=$1 AND user_id=$2`,
    [orgId, userId]
  );
  if (!rows.length) throw Object.assign(new Error("Not a member of this organization"), { status: 403 });
  return rows[0].role;
}

function pdfResponse(res, buffer, filename) {
  res.set("Content-Type", "application/pdf");
  res.set("Content-Disposition", `attachment; filename="${filename}"`);
  res.set("Content-Length", buffer.length);
  res.send(buffer);
}

// ── GET /api/reports/portfolio/:userId/pdf (original, backward-compat) ────────

/**
 * @deprecated Use /api/reports/client/:clientId/pdf for B2B reports.
 */
router.get("/portfolio/:userId/pdf", requireAuth, async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== userId && !req.user.is_admin) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    let holdings = [];
    let totalValue = 0;
    let roi = 0;

    if (_pool) {
      try {
        const { rows } = await _pool.query(
          `SELECT o.wine_id, o.quantity, o.purchase_price, o.current_market_price, w.name AS wine_name, w.vintage
           FROM orders o LEFT JOIN wines w ON w.id::text = o.wine_id::text
           WHERE o.user_id = $1 ORDER BY o.created_at DESC LIMIT 50`,
          [userId]
        );
        holdings = rows.map(r => ({
          wine_name:     r.wine_name || r.wine_id,
          vintage:       r.vintage || null,
          quantity:      Number(r.quantity) || 1,
          buy_price:     Number(r.purchase_price) || 0,
          current_price: Number(r.current_market_price) || 0,
        }));
        if (holdings.length > 0) {
          const cost = holdings.reduce((s, h) => s + h.buy_price * h.quantity, 0);
          totalValue = holdings.reduce((s, h) => s + h.current_price * h.quantity, 0);
          roi = cost > 0 ? ((totalValue - cost) / cost) * 100 : 0;
        }
      } catch (e) {
        console.warn("[reports] DB error:", e.message);
      }
    }

    if (holdings.length === 0) {
      holdings = [
        { wine_name: "Château Pétrus 2015",      vintage: 2015, quantity: 3,  buy_price: 3200, current_price: 4100 },
        { wine_name: "Barolo Monfortino 2016",    vintage: 2016, quantity: 6,  buy_price: 480,  current_price: 610  },
        { wine_name: "Sassicaia 2019",            vintage: 2019, quantity: 12, buy_price: 220,  current_price: 285  },
        { wine_name: "Opus One 2018",             vintage: 2018, quantity: 6,  buy_price: 350,  current_price: 420  },
        { wine_name: "Domaine Leroy Chambolle 2017", vintage: 2017, quantity: 2, buy_price: 1800, current_price: 2250 },
      ];
      const cost = holdings.reduce((s, h) => s + h.buy_price * h.quantity, 0);
      totalValue = holdings.reduce((s, h) => s + h.current_price * h.quantity, 0);
      roi = cost > 0 ? ((totalValue - cost) / cost) * 100 : 0;
    }

    const buffer = await generatePortfolioReport(userId, { userId, holdings, totalValue, roi, generatedAt: new Date().toISOString() });
    pdfResponse(res, buffer, `vinoinvest-portfolio-${userId.slice(0, 8)}.pdf`);
  } catch (err) {
    console.error("[reports/portfolio/pdf]", err);
    res.status(500).json({ error: "PDF generation failed", detail: err.message });
  }
});

// ── GET /api/reports/client/:clientId/pdf ─────────────────────────────────────

/**
 * Professional B2B client report:
 * - Cover page with org white-label (brand_color, org name)
 * - Executive summary + holdings table with sparklines
 * - Risk analytics (Volatility, Sharpe, Max Drawdown, VaR 95%, Beta)
 * - Benchmark vs S&P500 + Gold (FRED API, live)
 * - Compliance: suitability, recommendation log, audit trail
 */
router.get("/client/:clientId/pdf", requireAuth, async (req, res) => {
  if (!_pool) return res.status(503).json({ error: "Database unavailable" });

  try {
    await ensureOrgTables(_pool);

    // Load client portfolio
    const { rows: cpRows } = await _pool.query(
      `SELECT cp.*, o.name AS org_name, o.brand_color, o.logo_url AS org_logo
       FROM client_portfolios cp
       JOIN organizations o ON o.id = cp.org_id
       WHERE cp.id = $1`,
      [req.params.clientId]
    );
    if (!cpRows.length) return res.status(404).json({ error: "Client not found" });

    const cp = cpRows[0];
    await assertOrgMember(_pool, cp.org_id, req.user.id);

    // Load holdings (orders linked by client_email)
    const { rows: orderRows } = await _pool.query(
      `SELECT o.wine_id, o.quantity, o.purchase_price AS buy_price,
              o.current_market_price AS current_price,
              w.name AS wine_name, w.vintage, w.investment_score AS ai_score
       FROM orders o
       LEFT JOIN wines w ON w.id::text = o.wine_id::text
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC LIMIT 50`,
      [cp.client_email || "none"]
    );

    // Build holdings with price history sparklines
    const holdings = await Promise.all(
      orderRows.map(async (o) => {
        const { rows: hist } = await _pool.query(
          `SELECT price FROM price_history WHERE wine_id=$1 ORDER BY recorded_at LIMIT 24`,
          [o.wine_id]
        ).catch(() => ({ rows: [] }));

        const histReturns = buildReturns(
          hist.map((h, i) => ({ price: h.price, recorded_at: new Date(Date.now() - (hist.length - i) * 30 * 86400000).toISOString() }))
        );

        return {
          wine_name:     o.wine_name || o.wine_id || "Unknown",
          vintage:       o.vintage || null,
          quantity:      Number(o.quantity) || 1,
          buy_price:     Number(o.buy_price) || 0,
          current_price: Number(o.current_price) || 0,
          price_history: hist.length >= 2 ? hist.map(h => Number(h.price)) : null,
          returns:       histReturns,
          ai_score:      o.ai_score || null,
        };
      })
    );

    // Demo holdings if empty
    const finalHoldings = holdings.length > 0 ? holdings : [
      { wine_name: "Château Pétrus 2015",   vintage: 2015, quantity: 3,  buy_price: 3200, current_price: 4100, price_history: [3200,3350,3480,3600,3750,3900,4100], returns: [], ai_score: 96 },
      { wine_name: "Barolo Monfortino 2016", vintage: 2016, quantity: 6,  buy_price: 480,  current_price: 610,  price_history: [480,500,520,545,570,590,610], returns: [], ai_score: 91 },
      { wine_name: "Sassicaia 2019",         vintage: 2019, quantity: 12, buy_price: 220,  current_price: 285,  price_history: [220,228,235,248,260,272,285], returns: [], ai_score: 88 },
      { wine_name: "Opus One 2018",          vintage: 2018, quantity: 6,  buy_price: 350,  current_price: 420,  price_history: [350,358,368,380,394,408,420], returns: [], ai_score: 90 },
    ];

    // Compute risk metrics
    const holdingsForRisk = finalHoldings.map(h => ({
      name:  h.wine_name,
      value: (h.current_price || 0) * (h.quantity || 1),
      returns: h.returns || [],
    }));
    const indexReturns = [0.02,0.01,0.03,-0.01,0.02,0.04,0.01,-0.02,0.03,0.02,0.01,0.03];
    const risk = computePortfolioRisk(holdingsForRisk, indexReturns);

    // FRED benchmarks (live + cached)
    const benchmarks = await getBenchmarkData().catch(() => ({
      sp500Return12m: 0.117, goldReturn12m: 0.082, euInflation: 0.026, vinoInvestIndex: 0.148, source: "fallback",
    }));

    // Load compliance data
    const [suitRows, auditRows, noteRows] = await Promise.all([
      _pool.query(
        `SELECT * FROM suitability_assessments WHERE client_portfolio_id=$1 ORDER BY created_at DESC LIMIT 1`,
        [req.params.clientId]
      ).catch(() => ({ rows: [] })),
      _pool.query(
        `SELECT * FROM audit_log WHERE resource_id=$1 OR resource=$2 ORDER BY ts DESC LIMIT 20`,
        [req.params.clientId, "client_portfolio"]
      ).catch(() => ({ rows: [] })),
      _pool.query(
        `SELECT * FROM advisor_notes WHERE portfolio_id=$1 ORDER BY created_at DESC LIMIT 10`,
        [req.params.clientId]
      ).catch(() => ({ rows: [] })),
    ]);

    // Load advisor name
    const advisorId = cp.advisor_id;
    let advisorName = null;
    if (advisorId && _pool) {
      const { rows: uRows } = await _pool.query(
        `SELECT first_name, email FROM users WHERE id=$1 LIMIT 1`, [advisorId]
      ).catch(() => ({ rows: [] }));
      advisorName = uRows[0]?.first_name || uRows[0]?.email?.split("@")[0] || null;
    }

    // Log audit
    await logAudit(_pool, {
      orgId: cp.org_id,
      userId: req.user.id,
      action: "report.client.pdf",
      resource: "client_portfolio",
      resourceId: req.params.clientId,
      details: { clientName: cp.client_name },
      ip: req.ip,
    }).catch(() => {});

    const buffer = await generateClientReport({
      client: {
        name:       cp.client_name,
        email:      cp.client_email,
        kyc_status: cp.kyc_status,
        notes:      cp.notes,
      },
      org: {
        name:        cp.org_name,
        brand_color: cp.brand_color,
        logo_url:    cp.org_logo,
      },
      advisorName,
      holdings: finalHoldings,
      risk,
      benchmarks,
      compliance: {
        suitability:  suitRows.rows[0] || null,
        auditLog:     auditRows.rows,
        advisorNotes: noteRows.rows,
      },
    });

    const safeName = (cp.client_name || "client").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const date = new Date().toISOString().slice(0, 10);
    pdfResponse(res, buffer, `vinoinvest-${safeName}-${date}.pdf`);

  } catch (err) {
    console.error("[reports/client/pdf]", err);
    res.status(err.status || 500).json({ error: "PDF generation failed", detail: err.message });
  }
});

// ── GET /api/reports/org/:orgId/aggregate/pdf ─────────────────────────────────

/**
 * Aggregate org-level report:
 * - All clients with AUM summary
 * - Benchmark comparison (FRED live)
 * - Full org audit trail
 * - White-label cover with org brand_color
 */
router.get("/org/:orgId/aggregate/pdf", requireAuth, async (req, res) => {
  if (!_pool) return res.status(503).json({ error: "Database unavailable" });

  try {
    await ensureOrgTables(_pool);

    const role = await assertOrgMember(_pool, req.params.orgId, req.user.id);
    if (!["owner", "admin"].includes(role)) {
      return res.status(403).json({ error: "Owner or admin role required for aggregate report" });
    }

    const { rows: orgRows } = await _pool.query(
      `SELECT * FROM organizations WHERE id=$1`, [req.params.orgId]
    );
    if (!orgRows.length) return res.status(404).json({ error: "Organization not found" });
    const org = orgRows[0];

    const { rows: clients } = await _pool.query(
      `SELECT * FROM client_portfolios WHERE org_id=$1 ORDER BY aum_wine DESC`,
      [req.params.orgId]
    );

    const { rows: auditLog } = await _pool.query(
      `SELECT * FROM audit_log WHERE org_id=$1 ORDER BY ts DESC LIMIT 50`,
      [req.params.orgId]
    ).catch(() => ({ rows: [] }));

    const benchmarks = await getBenchmarkData().catch(() => ({
      sp500Return12m: 0.117, goldReturn12m: 0.082, euInflation: 0.026, vinoInvestIndex: 0.148, source: "fallback",
    }));

    await logAudit(_pool, {
      orgId: req.params.orgId,
      userId: req.user.id,
      action: "report.org.aggregate.pdf",
      resource: "organization",
      resourceId: req.params.orgId,
      details: { clientCount: clients.length },
      ip: req.ip,
    }).catch(() => {});

    const buffer = await generateOrgReport({
      org: {
        name:        org.name,
        brand_color: org.brand_color,
        logo_url:    org.logo_url,
      },
      clients,
      benchmarks,
      auditLog,
    });

    const safeName = org.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const date = new Date().toISOString().slice(0, 10);
    pdfResponse(res, buffer, `vinoinvest-org-${safeName}-${date}.pdf`);

  } catch (err) {
    console.error("[reports/org/pdf]", err);
    res.status(err.status || 500).json({ error: "PDF generation failed", detail: err.message });
  }
});

export default router;
