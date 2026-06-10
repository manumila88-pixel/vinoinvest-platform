import express from "express";

const router = express.Router();
let pool = null;
let tableReady = false;

export function setWatchlistPool(p) { pool = p; }

async function ensureTable() {
  if (!pool || tableReady) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_watchlists (
        user_id TEXT NOT NULL,
        wine_id TEXT NOT NULL,
        wine_name TEXT,
        added_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, wine_id)
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_watchlists_user ON user_watchlists(user_id)`);
    tableReady = true;
  } catch (e) {
    console.warn("[watchlist] Table init failed:", e.message);
  }
}

// GET /api/watchlist/:userId
router.get("/:userId", async (req, res) => {
  await ensureTable();
  if (!pool) return res.json([]);
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, added_at FROM user_watchlists WHERE user_id = $1 ORDER BY added_at DESC`,
      [req.params.userId]
    );
    res.json(rows.map(r => r.wine_id));
  } catch (e) {
    console.error("[watchlist] Get error:", e.message);
    res.json([]);
  }
});

// POST /api/watchlist
router.post("/", async (req, res) => {
  const { userId, wineId, wineName } = req.body;
  if (!userId || !wineId) return res.status(400).json({ error: "userId and wineId required" });
  await ensureTable();
  if (!pool) return res.status(503).json({ error: "Database unavailable" });
  try {
    await pool.query(
      `INSERT INTO user_watchlists (user_id, wine_id, wine_name) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, wine_id) DO NOTHING`,
      [userId, wineId, wineName || wineId]
    );
    res.json({ success: true });
  } catch (e) {
    console.error("[watchlist] Add error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/watchlist/:userId/:wineId
router.delete("/:userId/:wineId", async (req, res) => {
  if (!pool) return res.status(503).json({ error: "Database unavailable" });
  try {
    await pool.query(
      `DELETE FROM user_watchlists WHERE user_id = $1 AND wine_id = $2`,
      [req.params.userId, req.params.wineId]
    );
    res.json({ success: true });
  } catch (e) {
    console.error("[watchlist] Remove error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
