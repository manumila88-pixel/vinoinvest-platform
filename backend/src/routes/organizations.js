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

export default router;
export { ensureOrgTables, logAudit };
