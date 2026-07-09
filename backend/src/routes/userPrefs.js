import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
let pool;
export const setUserPrefsPool = (p) => { pool = p; };

async function ensureTable() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id       TEXT PRIMARY KEY,
      display_prefs JSONB NOT NULL DEFAULT '{}',
      wine_notes    JSONB NOT NULL DEFAULT '{}',
      saved_filters JSONB NOT NULL DEFAULT '[]',
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).catch(() => {});
}

// GET /api/user-prefs
router.get("/", requireAuth, async (req, res) => {
  try {
    await ensureTable();
    const { rows } = await pool.query(
      "SELECT display_prefs, wine_notes, saved_filters FROM user_preferences WHERE user_id = $1",
      [req.user.id]
    );
    if (!rows.length) return res.json({ display_prefs: {}, wine_notes: {}, saved_filters: [] });
    res.json(rows[0]);
  } catch (e) {
    console.error("[userPrefs]", e.message);
    res.status(500).json({ error: "Errore interno. Riprova." });
  }
});

// POST /api/user-prefs — upsert, merges only the fields sent
router.post("/", requireAuth, async (req, res) => {
  try {
    await ensureTable();
    const userId = req.user.id;
    const { display_prefs, wine_notes, saved_filters } = req.body;

    // Read current row so we can merge
    const { rows } = await pool.query(
      "SELECT display_prefs, wine_notes, saved_filters FROM user_preferences WHERE user_id = $1",
      [userId]
    );
    const cur = rows[0] || { display_prefs: {}, wine_notes: {}, saved_filters: [] };

    const merged = {
      display_prefs: display_prefs !== undefined ? display_prefs : cur.display_prefs,
      wine_notes:    wine_notes    !== undefined ? wine_notes    : cur.wine_notes,
      saved_filters: saved_filters !== undefined ? saved_filters : cur.saved_filters,
    };

    await pool.query(
      `INSERT INTO user_preferences (user_id, display_prefs, wine_notes, saved_filters, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET display_prefs = $2, wine_notes = $3, saved_filters = $4, updated_at = NOW()`,
      [userId, merged.display_prefs, merged.wine_notes, merged.saved_filters]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error("[userPrefs]", e.message);
    res.status(500).json({ error: "Errore interno. Riprova." });
  }
});

export default router;
