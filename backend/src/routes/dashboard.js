import express from "express";

const router = express.Router();

let pool = null;

async function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    try { const m = await import("../db/pool.js"); pool = m.pool; } catch {}
  }
  return pool;
}

// GET /api/dashboard/analytics
router.get("/analytics", async (req, res) => {
  const db = await getPool();
  if (!db) {
    return res.json({
      topWines: [], avgRoi: 0, totalVolume: 0, totalOrders: 0, activeAlerts: 0
    });
  }
  try {
    const [topWinesRes, roiRes, volumeRes, alertsRes] = await Promise.all([
      db.query(`
        SELECT wine_id, wine_name, COUNT(*) AS order_count,
               SUM(quantity * purchase_price) AS volume,
               AVG(CASE WHEN purchase_price > 0
                   THEN (current_market_price - purchase_price) / purchase_price * 100
                   ELSE 0 END) AS avg_roi
        FROM orders
        GROUP BY wine_id, wine_name
        ORDER BY order_count DESC
        LIMIT 10
      `).catch(() => ({ rows: [] })),

      db.query(`
        SELECT AVG(CASE WHEN purchase_price > 0
                   THEN (current_market_price - purchase_price) / purchase_price * 100
                   ELSE 0 END) AS avg_roi,
               COUNT(*) AS total_orders
        FROM orders
        WHERE purchase_price > 0
      `).catch(() => ({ rows: [{}] })),

      db.query(`
        SELECT COALESCE(SUM(quantity * purchase_price), 0) AS total_volume FROM orders
      `).catch(() => ({ rows: [{ total_volume: 0 }] })),

      db.query(`
        SELECT COUNT(*) AS cnt FROM price_alerts WHERE active = true
      `).catch(() => ({ rows: [{ cnt: 0 }] })),
    ]);

    res.json({
      topWines: topWinesRes.rows.map(r => ({
        wineId: r.wine_id,
        wineName: r.wine_name,
        orders: Number(r.order_count),
        volume: Math.round(Number(r.volume) || 0),
        avgRoi: Math.round(Number(r.avg_roi) || 0),
      })),
      avgRoi: Math.round(Number(roiRes.rows[0]?.avg_roi) || 0),
      totalOrders: Number(roiRes.rows[0]?.total_orders) || 0,
      totalVolume: Math.round(Number(volumeRes.rows[0]?.total_volume) || 0),
      activeAlerts: Number(alertsRes.rows[0]?.cnt) || 0,
    });
  } catch (e) {
    console.error("[dashboard] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
