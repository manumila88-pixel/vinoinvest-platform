import { Router } from "express";
import { ADMIN_EMAIL } from "../middleware/auth.js";

const router = Router();
let pool = null;
export function setAdminPool(p) { pool = p; }

async function ensureAuditTable() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id SERIAL PRIMARY KEY,
      admin_email TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      details JSONB,
      ip TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS security_events (
      id SERIAL PRIMARY KEY,
      event_type TEXT NOT NULL,
      ip TEXT,
      user_email TEXT,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

async function logAudit(adminEmail, action, target, details, ip) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO audit_log (admin_email, action, target, details, ip) VALUES ($1,$2,$3,$4,$5)`,
      [adminEmail, action, target, JSON.stringify(details || {}), ip]
    );
  } catch {}
}

// GET /api/admin/stats — complete platform stats
router.get("/stats", async (req, res) => {
  if (!pool) return res.json({ error: "DB not configured" });

  try {
    await ensureAuditTable();

    const [
      usersTotal,
      usersActiveToday,
      subsActive,
      subsRevenue,
      ordersRevenue,
      academyProgress,
      academyCerts,
      apiUsage,
      aiTokensToday,
      topWines,
      recentAudit,
      securityEvents,
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM users`).catch(() => ({ rows: [{ total: 0 }] })),
      pool.query(`SELECT COUNT(DISTINCT user_id) AS active FROM audit_log WHERE created_at::date = CURRENT_DATE`).catch(() => ({ rows: [{ active: 0 }] })),
      pool.query(`SELECT plan, COUNT(*) AS count FROM subscriptions WHERE active = true GROUP BY plan`).catch(() => ({ rows: [] })),
      pool.query(`SELECT SUM(CASE WHEN plan='investor' THEN 9.99 WHEN plan='pro' OR plan='professional' THEN 19.99 WHEN plan='bundle' THEN 24.99 ELSE 0 END) AS mrr FROM subscriptions WHERE active = true`).catch(() => ({ rows: [{ mrr: 0 }] })),
      pool.query(`SELECT COALESCE(SUM(purchase_price * quantity), 0) AS total_revenue FROM orders WHERE status != 'cancelled'`).catch(() => ({ rows: [{ total_revenue: 0 }] })),
      pool.query(`SELECT COUNT(DISTINCT user_id) AS learners, COUNT(*) AS completions FROM academy_progress WHERE done = true`).catch(() => ({ rows: [{ learners: 0, completions: 0 }] })),
      pool.query(`SELECT COUNT(*) AS certs FROM academy_certificates`).catch(() => ({ rows: [{ certs: 0 }] })),
      pool.query(`SELECT endpoint, COUNT(*) AS calls, COALESCE(SUM(cost_usd),0) AS cost FROM api_usage WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY endpoint ORDER BY cost DESC LIMIT 10`).catch(() => ({ rows: [] })),
      pool.query(`SELECT COALESCE(SUM(tokens_input + tokens_output), 0) AS tokens, COALESCE(SUM(cost_usd), 0) AS cost FROM api_usage WHERE created_at::date = CURRENT_DATE`).catch(() => ({ rows: [{ tokens: 0, cost: 0 }] })),
      pool.query(`SELECT target AS wine_id, COUNT(*) AS searches FROM audit_log WHERE action LIKE '%search%' AND created_at > NOW() - INTERVAL '7 days' GROUP BY target ORDER BY searches DESC LIMIT 10`).catch(() => ({ rows: [] })),
      pool.query(`SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 20`).catch(() => ({ rows: [] })),
      pool.query(`SELECT event_type, COUNT(*) AS count FROM security_events WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY event_type`).catch(() => ({ rows: [] })),
    ]);

    const planBreakdown = {};
    subsActive.rows.forEach(r => { planBreakdown[r.plan] = parseInt(r.count); });

    await logAudit(req.user?.email || ADMIN_EMAIL, "VIEW_STATS", "/admin/stats", {}, req.ip);

    res.json({
      users: {
        total: parseInt(usersTotal.rows[0]?.total || 0),
        active_today: parseInt(usersActiveToday.rows[0]?.active || 0),
      },
      subscriptions: {
        byPlan: planBreakdown,
        total: Object.values(planBreakdown).reduce((a, b) => a + b, 0),
        mrr: parseFloat(subsRevenue.rows[0]?.mrr || 0).toFixed(2),
      },
      revenue: {
        orders_total: parseFloat(ordersRevenue.rows[0]?.total_revenue || 0).toFixed(2),
      },
      academy: {
        learners: parseInt(academyProgress.rows[0]?.learners || 0),
        completions: parseInt(academyProgress.rows[0]?.completions || 0),
        certificates: parseInt(academyCerts.rows[0]?.certs || 0),
      },
      api: {
        topEndpoints: apiUsage.rows.map(r => ({
          endpoint: r.endpoint,
          calls: parseInt(r.calls),
          cost: parseFloat(r.cost),
        })),
        ai_tokens_today: parseInt(aiTokensToday.rows[0]?.tokens || 0),
        ai_cost_today_usd: parseFloat(aiTokensToday.rows[0]?.cost || 0).toFixed(4),
      },
      top_wines_searched: topWines.rows.map(r => ({ wine_id: r.wine_id, searches: parseInt(r.searches) })),
      system: {
        uptime_seconds: Math.floor(process.uptime()),
        uptime_human: (() => {
          const s = Math.floor(process.uptime());
          const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
          return `${h}h ${m}m`;
        })(),
        memory_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      },
      auditLog: recentAudit.rows,
      securityEvents: securityEvents.rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/users — list all users with subscription status
router.get("/users", async (req, res) => {
  if (!pool) return res.json([]);
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.account_type, u.created_at,
             s.plan, s.active AS sub_active, s.created_at AS sub_since
      FROM users u
      LEFT JOIN subscriptions s ON s.user_email = u.email
      ORDER BY u.created_at DESC
      LIMIT 200
    `);
    await logAudit(req.user?.email || ADMIN_EMAIL, "LIST_USERS", "/admin/users", { count: result.rows.length }, req.ip);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/subscriptions — all active subscriptions
router.get("/subscriptions", async (req, res) => {
  if (!pool) return res.json([]);
  try {
    const result = await pool.query(`
      SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 200
    `);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/grant-access — manually grant subscription to a user
router.post("/grant-access", async (req, res) => {
  if (!pool) return res.status(503).json({ error: "DB not configured" });
  const { email, plan } = req.body;
  if (!email || !plan) return res.status(400).json({ error: "email and plan required" });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        user_email TEXT PRIMARY KEY,
        plan TEXT NOT NULL,
        stripe_customer_id TEXT,
        stripe_session_id TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query(
      `INSERT INTO subscriptions (user_email, plan, active)
       VALUES ($1,$2,true)
       ON CONFLICT (user_email) DO UPDATE SET plan=$2, active=true, updated_at=NOW()`,
      [email, plan]
    );
    await logAudit(req.user?.email || ADMIN_EMAIL, "GRANT_ACCESS", email, { plan }, req.ip);
    res.json({ ok: true, email, plan });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/revoke-access — revoke subscription
router.post("/revoke-access", async (req, res) => {
  if (!pool) return res.status(503).json({ error: "DB not configured" });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    await pool.query(`UPDATE subscriptions SET active=false, updated_at=NOW() WHERE user_email=$1`, [email]);
    await logAudit(req.user?.email || ADMIN_EMAIL, "REVOKE_ACCESS", email, {}, req.ip);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/costs — token usage (legacy kept)
router.get("/costs", async (req, res) => {
  if (!pool) return res.json({ error: "DB not configured", today: 0, week: 0, month: 0 });
  try {
    const [today, week, month, byEndpoint] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(cost_usd),0) AS total, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '1 day'`),
      pool.query(`SELECT COALESCE(SUM(cost_usd),0) AS total, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '7 days'`),
      pool.query(`SELECT COALESCE(SUM(cost_usd),0) AS total, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '30 days'`),
      pool.query(`SELECT endpoint, COUNT(*) AS calls, COALESCE(SUM(cost_usd),0) AS cost, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY endpoint ORDER BY cost DESC LIMIT 20`),
    ]);
    res.json({
      today: { cost: parseFloat(today.rows[0].total), tokens: parseInt(today.rows[0].tokens) },
      week: { cost: parseFloat(week.rows[0].total), tokens: parseInt(week.rows[0].tokens) },
      month: { cost: parseFloat(month.rows[0].total), tokens: parseInt(month.rows[0].tokens) },
      projectedMonthly: (parseFloat(month.rows[0].total) / new Date().getDate()) * 30,
      byEndpoint: byEndpoint.rows.map(r => ({
        endpoint: r.endpoint, calls: parseInt(r.calls), cost: parseFloat(r.cost), tokens: parseInt(r.tokens),
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/security-events
router.get("/security-events", async (req, res) => {
  if (!pool) return res.json([]);
  try {
    await ensureAuditTable();
    const result = await pool.query(`SELECT * FROM security_events ORDER BY created_at DESC LIMIT 100`);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
