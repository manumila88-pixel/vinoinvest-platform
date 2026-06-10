/**
 * Multi-tenant organization management.
 * Tables: organizations, org_members, api_keys, audit_log
 */
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import crypto from "crypto";

const router = Router();
let _pool = null;
export function setOrgsPool(pool) { _pool = pool; }

async function ensureOrgTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      type TEXT DEFAULT 'wealth_manager',
      plan TEXT DEFAULT 'starter',
      seats INTEGER DEFAULT 3,
      logo_url TEXT,
      brand_color TEXT DEFAULT '#2563eb',
      custom_domain TEXT,
      owner_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS org_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      user_email TEXT,
      role TEXT DEFAULT 'analyst',
      permissions JSONB DEFAULT '{}',
      invited_at TIMESTAMPTZ DEFAULT NOW(),
      accepted_at TIMESTAMPTZ,
      UNIQUE(org_id, user_id)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS client_portfolios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      client_email TEXT,
      advisor_id TEXT,
      aum_wine NUMERIC DEFAULT 0,
      notes TEXT,
      last_contact TIMESTAMPTZ,
      next_review TIMESTAMPTZ,
      kyc_status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      key_hash TEXT NOT NULL UNIQUE,
      key_prefix TEXT NOT NULL,
      label TEXT,
      daily_limit INTEGER DEFAULT 10000,
      requests_today INTEGER DEFAULT 0,
      last_used TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      active BOOLEAN DEFAULT TRUE
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id BIGSERIAL PRIMARY KEY,
      org_id UUID,
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT,
      resource_id TEXT,
      details JSONB DEFAULT '{}',
      ip TEXT,
      ts TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS audit_log_org_idx ON audit_log(org_id, ts DESC);
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suitability_assessments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID,
      client_portfolio_id UUID REFERENCES client_portfolios(id) ON DELETE CASCADE,
      advisor_id TEXT,
      risk_tolerance TEXT,
      investment_horizon INTEGER,
      aum_total NUMERIC,
      wine_allocation_pct NUMERIC,
      experience_level TEXT,
      signed_at TIMESTAMPTZ,
      signature_data TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS client_interactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_portfolio_id UUID REFERENCES client_portfolios(id) ON DELETE CASCADE,
      type TEXT DEFAULT 'note',
      content TEXT,
      advisor_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS advisor_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      portfolio_id UUID REFERENCES client_portfolios(id) ON DELETE CASCADE,
      advisor_id TEXT NOT NULL,
      note TEXT NOT NULL,
      is_private BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_advisor_notes_portfolio ON advisor_notes(portfolio_id, created_at DESC);
  `);
}

async function logAudit(pool, { orgId, userId, action, resource, resourceId, details, ip }) {
  try {
    await pool.query(
      `INSERT INTO audit_log(org_id,user_id,action,resource,resource_id,details,ip)
       VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [orgId, userId, action, resource, resourceId, JSON.stringify(details || {}), ip]
    );
  } catch (_) {}
}

// ── Organization CRUD ─────────────────────────────────────────────────────────

router.post("/", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { name, type = "wealth_manager", plan = "starter" } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const { rows } = await _pool.query(
      `INSERT INTO organizations(name,type,plan,owner_id) VALUES($1,$2,$3,$4) RETURNING *`,
      [name, type, plan, req.user.id]
    );
    await _pool.query(
      `INSERT INTO org_members(org_id,user_id,user_email,role) VALUES($1,$2,$3,'owner')`,
      [rows[0].id, req.user.id, req.user.email]
    );
    await logAudit(_pool, { orgId: rows[0].id, userId: req.user.id, action: "org.create", resource: "organization", resourceId: rows[0].id });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/my", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(
      `SELECT o.*, m.role FROM organizations o
       JOIN org_members m ON m.org_id = o.id
       WHERE m.user_id = $1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:orgId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(
      `SELECT o.*, m.role, m.permissions FROM organizations o
       JOIN org_members m ON m.org_id = o.id AND m.user_id = $2
       WHERE o.id = $1`,
      [req.params.orgId, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ error: "Not a member" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:orgId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { name, logo_url, brand_color, custom_domain } = req.body;
    const { rows: mem } = await _pool.query(
      `SELECT role FROM org_members WHERE org_id=$1 AND user_id=$2`,
      [req.params.orgId, req.user.id]
    );
    if (!mem.length || !["owner", "admin"].includes(mem[0].role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    const { rows } = await _pool.query(
      `UPDATE organizations SET name=COALESCE($2,name), logo_url=COALESCE($3,logo_url),
       brand_color=COALESCE($4,brand_color), custom_domain=COALESCE($5,custom_domain),
       updated_at=NOW() WHERE id=$1 RETURNING *`,
      [req.params.orgId, name, logo_url, brand_color, custom_domain]
    );
    await logAudit(_pool, { orgId: req.params.orgId, userId: req.user.id, action: "org.update", resource: "organization", resourceId: req.params.orgId });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Members ───────────────────────────────────────────────────────────────────

router.get("/:orgId/members", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(
      `SELECT m.* FROM org_members m
       JOIN org_members me ON me.org_id = m.org_id AND me.user_id = $2
       WHERE m.org_id = $1 ORDER BY m.invited_at`,
      [req.params.orgId, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ error: "Not a member" });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:orgId/members", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { user_email, role = "analyst" } = req.body;
    const { rows } = await _pool.query(
      `INSERT INTO org_members(org_id,user_id,user_email,role) VALUES($1,$2,$3,$4)
       ON CONFLICT(org_id,user_id) DO UPDATE SET role=$4 RETURNING *`,
      [req.params.orgId, `pending:${user_email}`, user_email, role]
    );
    await logAudit(_pool, { orgId: req.params.orgId, userId: req.user.id, action: "member.invite", resource: "org_member", resourceId: user_email });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── API Keys ──────────────────────────────────────────────────────────────────

router.post("/:orgId/api-keys", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { label } = req.body;
    const rawKey = `vi_${crypto.randomBytes(24).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.substring(0, 10);
    await _pool.query(
      `INSERT INTO api_keys(org_id,key_hash,key_prefix,label) VALUES($1,$2,$3,$4)`,
      [req.params.orgId, keyHash, keyPrefix, label || "Default"]
    );
    await logAudit(_pool, { orgId: req.params.orgId, userId: req.user.id, action: "apikey.create" });
    res.json({ key: rawKey, prefix: keyPrefix, label, warning: "Save this key — it will not be shown again." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:orgId/api-keys", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(
      `SELECT id, key_prefix, label, daily_limit, requests_today, last_used, created_at, active
       FROM api_keys WHERE org_id=$1 ORDER BY created_at DESC`,
      [req.params.orgId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Audit Log ─────────────────────────────────────────────────────────────────

router.get("/:orgId/audit", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const { rows } = await _pool.query(
      `SELECT * FROM audit_log WHERE org_id=$1 ORDER BY ts DESC LIMIT $2`,
      [req.params.orgId, limit]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:orgId/audit/export.csv", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { rows } = await _pool.query(
      `SELECT id,user_id,action,resource,resource_id,details,ip,ts FROM audit_log
       WHERE org_id=$1 ORDER BY ts DESC LIMIT 10000`,
      [req.params.orgId]
    );
    const header = "id,user_id,action,resource,resource_id,details,ip,timestamp\n";
    const csv = rows.map(r =>
      `"${r.id}","${r.user_id}","${r.action}","${r.resource || ""}","${r.resource_id || ""}","${JSON.stringify(r.details || {})}","${r.ip || ""}","${r.ts}"`
    ).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="audit-log-${req.params.orgId}.csv"`);
    res.send(header + csv);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function assertMember(pool, orgId, userId) {
  const { rows } = await pool.query(
    `SELECT role FROM org_members WHERE org_id=$1 AND user_id=$2`,
    [orgId, userId]
  );
  if (!rows.length) {
    const err = new Error("Not a member of this organization");
    err.status = 403;
    throw err;
  }
  return rows[0];
}

// ── Client Invite ─────────────────────────────────────────────────────────────

router.post("/invite-client", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { advisor_id, client_name, client_email, org_id } = req.body;
    if (!client_name || !client_email || !org_id) {
      return res.status(400).json({ error: "client_name, client_email and org_id are required" });
    }

    const tempPassword = `TempPass_${Math.random().toString(36).slice(2, 10)}!`;

    const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({
        email: client_email,
        password: tempPassword,
        data: { account_type: "client", full_name: client_name, advisor_id: advisor_id || req.user.id },
      }),
    });
    const supaData = await resp.json();
    const clientUserId = supaData.user?.id || supaData.id || null;

    const { rows: orgRows } = await _pool.query(`SELECT name FROM organizations WHERE id=$1`, [org_id]);
    const orgName = orgRows[0]?.name || "VinoInvest B2B";

    const { rows } = await _pool.query(
      `INSERT INTO client_portfolios(org_id, client_name, client_email, advisor_id, notes)
       VALUES($1, $2, $3, $4, 'Portfolio inizializzato dall''advisor')
       ON CONFLICT DO NOTHING RETURNING id`,
      [org_id, client_name, client_email, advisor_id || req.user.id]
    );
    const portfolio_id = rows[0]?.id || null;

    await logAudit(_pool, {
      orgId: org_id, userId: req.user.id, action: "client.invite",
      resource: "client_portfolio", resourceId: portfolio_id,
      details: { client_email, clientUserId },
    });

    // Send welcome email — graceful fallback if email service unavailable
    try {
      const { sendClientInviteEmail } = await import("../services/emailService.js");
      await sendClientInviteEmail({
        clientEmail: client_email, clientName: client_name,
        advisorEmail: req.user.email, tempPassword, orgName,
      });
    } catch (_) {}

    res.json({ success: true, client_email, temp_password: tempPassword, portfolio_id, email_sent: true, message: "Invito creato e email inviata" });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── Demo Seed ─────────────────────────────────────────────────────────────────

router.post("/demo-seed", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);

    const { rows: orgRows } = await _pool.query(
      `INSERT INTO organizations(name, type, plan, owner_id)
       VALUES('Family Office Demo', 'family_office', 'professional', $1) RETURNING *`,
      [req.user.id]
    );
    const org = orgRows[0];
    await _pool.query(
      `INSERT INTO org_members(org_id, user_id, user_email, role) VALUES($1,$2,$3,'owner')`,
      [org.id, req.user.id, req.user.email]
    );

    const demoClients = [
      { name: "Marchese Benedetto Ricci",    email: "benedetto.ricci@demo.vi",    aum: 2450000, kyc: "approved", rev: 14  },
      { name: "Sofia Castellani",            email: "sofia.castellani@demo.vi",   aum: 890000,  kyc: "approved", rev: 21  },
      { name: "Famiglia Monteverdi SpA",     email: "monteverdi@demo.vi",         aum: 3200000, kyc: "approved", rev: -5  },
      { name: "Dr. Marco Pallavicini",       email: "m.pallavicini@demo.vi",      aum: 650000,  kyc: "pending",  rev: 45  },
      { name: "Caterina Borromeo",           email: "c.borromeo@demo.vi",         aum: 1750000, kyc: "approved", rev: 7   },
      { name: "Visconti Family Trust",       email: "visconti.trust@demo.vi",     aum: 5600000, kyc: "approved", rev: 30  },
      { name: "Ing. Roberto Ferretti",       email: "r.ferretti@demo.vi",         aum: 320000,  kyc: "pending",  rev: 60  },
      { name: "Contessa Lucia Farnese",      email: "l.farnese@demo.vi",          aum: 1100000, kyc: "approved", rev: 10  },
      { name: "Studio Zanetti & Partners",   email: "zanetti@demo.vi",            aum: 780000,  kyc: "review",   rev: 3   },
      { name: "Alberto Grimaldi",            email: "a.grimaldi@demo.vi",         aum: 450000,  kyc: "approved", rev: 90  },
      { name: "Famiglia Savoia-Este",        email: "savoia.este@demo.vi",        aum: 8900000, kyc: "approved", rev: 25  },
      { name: "Dr. Elena Marconi",           email: "e.marconi@demo.vi",          aum: 290000,  kyc: "pending",  rev: 35  },
      { name: "Palazzo Doria Capital",       email: "doria.capital@demo.vi",      aum: 2100000, kyc: "approved", rev: 18  },
      { name: "Francesco d'Este",            email: "f.deste@demo.vi",            aum: 670000,  kyc: "approved", rev: 52  },
      { name: "Principessa Alessandra M.",   email: "a.principessa@demo.vi",      aum: 1350000, kyc: "review",   rev: 8   },
    ];

    const interactionPool = [
      { type: "call",    content: "Review trimestrale completata. Performance +18% YTD discussa. Cliente soddisfatto." },
      { type: "meeting", content: "Meeting annuale in presenza. Presentato report portfolio. Interesse per en primeur Bordeaux 2025." },
      { type: "note",    content: "Suitability assessment aggiornato. Risk tolerance: moderato-alto. Orizzonte 7+ anni confermato." },
      { type: "call",    content: "Follow-up proposta Barolo collection. Due diligence Giacomo Conterno 2016 richiesta." },
      { type: "email",   content: "Inviato report mensile. Performance +2.3% MoM vs benchmark +1.8%." },
      { type: "meeting", content: "Presentazione nuovo prodotto wine futures. Cliente interessato. Follow-up settimana prossima." },
    ];

    // Fetch top wines for demo orders
    const { rows: topWines } = await _pool.query(
      `SELECT id, name, current_price FROM wines WHERE current_price > 300 ORDER BY investment_score DESC NULLS LAST LIMIT 45`
    );

    const portfolioIds = [];
    for (let i = 0; i < demoClients.length; i++) {
      const c = demoClients[i];
      const nextReview = new Date(); nextReview.setDate(nextReview.getDate() + c.rev);
      const lastContact = new Date(); lastContact.setDate(lastContact.getDate() - Math.floor(Math.random() * 25 + 3));
      const { rows: pRows } = await _pool.query(
        `INSERT INTO client_portfolios(org_id,client_name,client_email,advisor_id,aum_wine,kyc_status,next_review,last_contact,notes)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [org.id, c.name, c.email, req.user.id, c.aum, c.kyc,
         nextReview.toISOString(), lastContact.toISOString(),
         `Portfolio wine fine: selezione ${c.aum > 2000000 ? "ultra-premium" : c.aum > 1000000 ? "premium" : "curated"}.`]
      );
      portfolioIds.push(pRows[0].id);

      const numInt = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numInt; j++) {
        const t = interactionPool[(i + j) % interactionPool.length];
        await _pool.query(
          `INSERT INTO client_interactions(client_portfolio_id,type,content,advisor_id) VALUES($1,$2,$3,$4)`,
          [pRows[0].id, t.type, t.content, req.user.id]
        );
      }

      // Seed real wine orders (user_id = client_email for risk analytics lookup)
      if (topWines.length >= 3) {
        for (let w = 0; w < 3; w++) {
          const wine = topWines[(i * 3 + w) % topWines.length];
          const qty = Math.ceil(Math.random() * 6) + 1;
          await _pool.query(
            `INSERT INTO orders(user_id,wine_id,quantity,price,status) VALUES($1,$2,$3,$4,'completed')`,
            [c.email, wine.id, qty, wine.current_price]
          );
        }
      }
    }

    await logAudit(_pool, {
      orgId: org.id, userId: req.user.id, action: "demo.seed",
      resource: "organization", resourceId: org.id,
      details: { clients: demoClients.length },
    });

    res.json({ success: true, org_id: org.id, clients_created: demoClients.length });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// ── Advisor Notes ─────────────────────────────────────────────────────────────

// GET /api/organizations/:orgId/notes/:portfolioId
router.get("/:orgId/notes/:portfolioId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    await assertMember(_pool, req.params.orgId, req.user.id);
    const { rows } = await _pool.query(
      `SELECT * FROM advisor_notes WHERE portfolio_id=$1 ORDER BY created_at DESC`,
      [req.params.portfolioId]
    );
    res.json(rows);
  } catch (e) { res.status(e.status || 500).json({ error: e.message }); }
});

// POST /api/organizations/:orgId/notes/:portfolioId
router.post("/:orgId/notes/:portfolioId", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    await assertMember(_pool, req.params.orgId, req.user.id);
    const { note, is_private = false } = req.body;
    if (!note) return res.status(400).json({ error: "note required" });
    const { rows } = await _pool.query(
      `INSERT INTO advisor_notes(portfolio_id,advisor_id,note,is_private) VALUES($1,$2,$3,$4) RETURNING *`,
      [req.params.portfolioId, req.user.id, note, is_private]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(e.status || 500).json({ error: e.message }); }
});

// PATCH /api/organizations/:orgId/notes/:noteId/edit
router.patch("/:orgId/notes/:noteId/edit", requireAuth, async (req, res) => {
  try {
    await ensureOrgTables(_pool);
    const { note, is_private } = req.body;
    const { rows } = await _pool.query(
      `UPDATE advisor_notes SET note=COALESCE($1,note), is_private=COALESCE($2,is_private), updated_at=NOW()
       WHERE id=$3 AND advisor_id=$4 RETURNING *`,
      [note, is_private, req.params.noteId, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(e.status || 500).json({ error: e.message }); }
});

export default router;
export { ensureOrgTables, logAudit, assertMember };
