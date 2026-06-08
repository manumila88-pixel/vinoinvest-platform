/**
 * Client portfolio management for B2B organizations.
 * Each org can manage multiple client portfolios (wealth manager → HNW clients).
 */
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { computePortfolioRisk, buildReturns } from "../services/riskMetricsService.js";
import { ensureOrgTables, logAudit } from "./organizations.js";

const router = Router();
let _pool = null;
export function setClientPortfoliosPool(pool) { _pool = pool; }

async function assertMember(pool, orgId, userId) {
  const { rows } = await pool.query(
    `SELECT role FROM org_members WHERE org_id=$1 AND user_id=$2`,
    [orgId, userId]
  );
  if (!rows.length) throw Object.assign(new Error("Not a member"), { status: 403 });
  return rows[0].role;
}

// ── Client Portfolio CRUD ─────────────────────────────────────────────────────

router.get("/", requireAuth, async (req, res) => {
  const { orgId } = req.query;
  if (!orgId) return res.status(400).json({ error: "orgId required" });
  try {
    await ensureOrgTables(_pool);
    await assertMember(_pool, orgId, req.user.id);
    const { rows } = await _pool.query(
      `SELECT cp.*,
        (SELECT COUNT(*) FROM client_interactions ci WHERE ci.client_portfolio_id = cp.id) AS interaction_count
       FROM client_portfolios cp WHERE cp.org_id=$1 ORDER BY cp.updated_at DESC`,
      [orgId]
    );
    res.json(rows);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { orgId } = req.query;
  if (!orgId) return res.status(400).json({ error: "orgId required" });
  try {
    await ensureOrgTables(_pool);
    await assertMember(_pool, orgId, req.user.id);
    const { client_name, client_email, aum_wine, notes, next_review } = req.body;
    if (!client_name) return res.status(400).json({ error: "client_name required" });
    const { rows } = await _pool.query(
      `INSERT INTO client_portfolios(org_id,client_name,client_email,advisor_id,aum_wine,notes,next_review)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [orgId, client_name, client_email, req.user.id, aum_wine || 0, notes, next_review || null]
    );
    await logAudit(_pool, { orgId, userId: req.user.id, action: "client.create", resource: "client_portfolio", resourceId: rows[0].id });
    res.json(rows[0]);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.get("/:clientId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(
      `SELECT cp.* FROM client_portfolios cp WHERE cp.id=$1`,
      [req.params.clientId]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, rows[0].org_id, req.user.id);
    res.json(rows[0]);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.patch("/:clientId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows: existing } = await _pool.query(
      `SELECT * FROM client_portfolios WHERE id=$1`, [req.params.clientId]
    );
    if (!existing.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, existing[0].org_id, req.user.id);
    const { client_name, client_email, aum_wine, notes, next_review, kyc_status } = req.body;
    const { rows } = await _pool.query(
      `UPDATE client_portfolios SET
        client_name=COALESCE($2,client_name),
        client_email=COALESCE($3,client_email),
        aum_wine=COALESCE($4,aum_wine),
        notes=COALESCE($5,notes),
        next_review=COALESCE($6,next_review),
        kyc_status=COALESCE($7,kyc_status),
        last_contact=NOW(), updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.clientId, client_name, client_email, aum_wine, notes, next_review, kyc_status]
    );
    await logAudit(_pool, { orgId: existing[0].org_id, userId: req.user.id, action: "client.update", resource: "client_portfolio", resourceId: req.params.clientId });
    res.json(rows[0]);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.delete("/:clientId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(`SELECT * FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const role = await assertMember(_pool, rows[0].org_id, req.user.id);
    if (!["owner", "admin"].includes(role)) return res.status(403).json({ error: "Insufficient permissions" });
    await _pool.query(`DELETE FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── Interactions / CRM Timeline ───────────────────────────────────────────────

router.get("/:clientId/interactions", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows: cp } = await _pool.query(`SELECT org_id FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    if (!cp.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, cp[0].org_id, req.user.id);
    const { rows } = await _pool.query(
      `SELECT * FROM client_interactions WHERE client_portfolio_id=$1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.clientId]
    );
    res.json(rows);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.post("/:clientId/interactions", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows: cp } = await _pool.query(`SELECT org_id FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    if (!cp.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, cp[0].org_id, req.user.id);
    const { type = "note", content } = req.body;
    const { rows } = await _pool.query(
      `INSERT INTO client_interactions(client_portfolio_id,type,content,advisor_id) VALUES($1,$2,$3,$4) RETURNING *`,
      [req.params.clientId, type, content, req.user.id]
    );
    await logAudit(_pool, { orgId: cp[0].org_id, userId: req.user.id, action: "interaction.create", resource: "client_interaction", resourceId: req.params.clientId });
    res.json(rows[0]);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── Suitability Assessment ────────────────────────────────────────────────────

router.post("/:clientId/suitability", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows: cp } = await _pool.query(`SELECT org_id FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    if (!cp.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, cp[0].org_id, req.user.id);
    const { risk_tolerance, investment_horizon, aum_total, wine_allocation_pct, experience_level, signature_data } = req.body;
    const { rows } = await _pool.query(
      `INSERT INTO suitability_assessments(org_id,client_portfolio_id,advisor_id,risk_tolerance,investment_horizon,
        aum_total,wine_allocation_pct,experience_level,signed_at,signature_data)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9) RETURNING *`,
      [cp[0].org_id, req.params.clientId, req.user.id, risk_tolerance, investment_horizon,
       aum_total, wine_allocation_pct, experience_level, signature_data]
    );
    await logAudit(_pool, { orgId: cp[0].org_id, userId: req.user.id, action: "suitability.sign", resource: "suitability", resourceId: req.params.clientId });
    res.json(rows[0]);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

router.get("/:clientId/suitability", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows: cp } = await _pool.query(`SELECT org_id FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    if (!cp.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, cp[0].org_id, req.user.id);
    const { rows } = await _pool.query(
      `SELECT * FROM suitability_assessments WHERE client_portfolio_id=$1 ORDER BY created_at DESC LIMIT 5`,
      [req.params.clientId]
    );
    res.json(rows);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── Risk Analytics ────────────────────────────────────────────────────────────

router.get("/:clientId/risk", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows: cp } = await _pool.query(`SELECT * FROM client_portfolios WHERE id=$1`, [req.params.clientId]);
    if (!cp.length) return res.status(404).json({ error: "Not found" });
    await assertMember(_pool, cp[0].org_id, req.user.id);

    // Get orders for this client — keyed by client email in orders table
    const { rows: orders } = await _pool.query(
      `SELECT o.wine_id, o.quantity, o.price as purchase_price,
              w.current_price, w.name as wine_name
       FROM orders o
       LEFT JOIN wines w ON w.id = o.wine_id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC LIMIT 50`,
      [cp[0].client_email || "none"]
    );

    const holdings = orders.map(o => ({
      name: o.wine_name || o.wine_id,
      value: (o.current_price || o.purchase_price || 0) * (o.quantity || 1),
      returns: [], // Would be populated with price history in production
    }));

    if (!holdings.length) {
      holdings.push({ name: "Demo Wine Portfolio", value: cp[0].aum_wine || 50000, returns: [] });
    }

    // Default index returns (monthly, last 12 months)
    const indexReturns = [0.02, 0.01, 0.03, -0.01, 0.02, 0.04, 0.01, -0.02, 0.03, 0.02, 0.01, 0.03];
    const risk = computePortfolioRisk(holdings, indexReturns);

    res.json({ clientId: req.params.clientId, clientName: cp[0].client_name, ...risk });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

export default router;
