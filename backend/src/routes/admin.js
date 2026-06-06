import { Router } from "express";

const router = Router();
let pool = null;
export function setAdminPool(p) { pool = p; }

// GET /api/admin/costs — token usage dashboard
router.get("/costs", async (req, res) => {
  if (!pool) return res.json({ error: "DB not configured", today: 0, week: 0, month: 0 });

  try {
    const [today, week, month, byEndpoint] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(cost_usd),0) AS total, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '1 day'`),
      pool.query(`SELECT COALESCE(SUM(cost_usd),0) AS total, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '7 days'`),
      pool.query(`SELECT COALESCE(SUM(cost_usd),0) AS total, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '30 days'`),
      pool.query(`SELECT endpoint, COUNT(*) AS calls, COALESCE(SUM(cost_usd),0) AS cost, COALESCE(SUM(tokens_input+tokens_output),0) AS tokens FROM api_usage WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY endpoint ORDER BY cost DESC LIMIT 20`),
    ]);

    const todayCost = parseFloat(today.rows[0].total);
    const monthCost = parseFloat(month.rows[0].total);

    res.json({
      today: { cost: todayCost, tokens: parseInt(today.rows[0].tokens) },
      week: { cost: parseFloat(week.rows[0].total), tokens: parseInt(week.rows[0].tokens) },
      month: { cost: monthCost, tokens: parseInt(month.rows[0].tokens) },
      projectedMonthly: (monthCost / new Date().getDate()) * 30,
      alert: todayCost > 5,
      byEndpoint: byEndpoint.rows.map(r => ({
        endpoint: r.endpoint,
        calls: parseInt(r.calls),
        cost: parseFloat(r.cost),
        tokens: parseInt(r.tokens),
      })),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
