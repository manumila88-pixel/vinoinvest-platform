import express from "express";

const router = express.Router();

let pool = null;
let tableReady = false;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    import("../db/pool.js").then(m => { pool = m.pool; }).catch(() => {});
  }
  return pool;
}

async function ensureTable() {
  const db = getPool();
  if (!db || tableReady) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id TEXT NOT NULL,
        wine_id TEXT NOT NULL,
        wine_name TEXT,
        target_price NUMERIC(10,2) NOT NULL,
        direction TEXT DEFAULT 'below',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id)`);
    tableReady = true;
  } catch (e) {
    console.warn("[alerts] Table init failed:", e.message);
  }
}

// POST /api/alerts — create alert
router.post("/", async (req, res) => {
  const { userId, wineId, wineName, targetPrice, direction = "below" } = req.body;
  if (!userId || !wineId || !targetPrice) {
    return res.status(400).json({ error: "userId, wineId e targetPrice sono obbligatori" });
  }
  await ensureTable();
  const db = getPool();
  if (!db) return res.status(503).json({ error: "Database non disponibile" });
  try {
    const { rows } = await db.query(
      `INSERT INTO price_alerts (user_id, wine_id, wine_name, target_price, direction)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, wineId, wineName || wineId, parseFloat(targetPrice), direction]
    );

    // Behavioral email trigger: watchlist_add (fire async, don't block response)
    db.query(`SELECT id, email, first_name FROM users WHERE email = $1 OR id::text = $1`, [userId])
      .then(async ({ rows: u }) => {
        if (u[0]?.email) {
          const { triggerBehavioralEmail } = await import("../services/emailFlowService.js");
          // 2h delay via setTimeout
          setTimeout(() => {
            triggerBehavioralEmail(u[0].id || userId, u[0].email, u[0].first_name, "b2c", "watchlist_added", { wine: { name: wineName || wineId } }).catch(() => {});
          }, 2 * 60 * 60 * 1000);
        }
      }).catch(() => {});

    res.json({ success: true, alert: rows[0] });
  } catch (e) {
    console.error("[alerts] Create error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/alerts/:userId — list user alerts
router.get("/:userId", async (req, res) => {
  await ensureTable();
  const db = getPool();
  if (!db) return res.json([]);
  try {
    const { rows } = await db.query(
      `SELECT * FROM price_alerts WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    console.error("[alerts] List error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/alerts/:alertId — remove alert
router.delete("/:alertId", async (req, res) => {
  const db = getPool();
  if (!db) return res.status(503).json({ error: "Database non disponibile" });
  try {
    await db.query(`DELETE FROM price_alerts WHERE id = $1`, [req.params.alertId]);
    res.json({ success: true });
  } catch (e) {
    console.error("[alerts] Delete error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
