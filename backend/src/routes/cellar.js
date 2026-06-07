import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
let pool;
export const setCellarPool = (p) => { pool = p; };

// GET /api/cellar — list user's cellar bottles
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT cb.*, w.name, w.producer, w.vintage, w.current_price, w.investment_score, w.image_url
       FROM cellar_bottles cb
       JOIN wines w ON w.id = cb.wine_id
       WHERE cb.user_id = $1
       ORDER BY cb.shelf_number, cb.position`,
      [userId]
    );
    res.json({ bottles: rows });
  } catch (e) {
    console.error("cellar GET", e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/cellar — add bottle to cellar
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { wine_id, quantity = 1, purchase_price, purchase_date, shelf_number = 1, position, notes, drink_from, drink_until } = req.body;

    if (!wine_id) return res.status(400).json({ error: "wine_id required" });

    const { rows } = await pool.query(
      `INSERT INTO cellar_bottles (user_id, wine_id, quantity, purchase_price, purchase_date, shelf_number, position, notes, drink_from, drink_until)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [userId, wine_id, quantity, purchase_price || null, purchase_date || null, shelf_number, position || null, notes || null, drink_from || null, drink_until || null]
    );
    res.status(201).json({ bottle: rows[0] });
  } catch (e) {
    console.error("cellar POST", e);
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/cellar/:id — update bottle
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { shelf_number, position, notes, drink_from, drink_until, quantity } = req.body;

    const { rows } = await pool.query(
      `UPDATE cellar_bottles
       SET shelf_number = COALESCE($1, shelf_number),
           position = COALESCE($2, position),
           notes = COALESCE($3, notes),
           drink_from = COALESCE($4, drink_from),
           drink_until = COALESCE($5, drink_until),
           quantity = COALESCE($6, quantity)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [shelf_number, position, notes, drink_from, drink_until, quantity, id, userId]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ bottle: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/cellar/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM cellar_bottles WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/cellar/stats — cellar statistics
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT
         COUNT(DISTINCT cb.id) as total_bottles,
         SUM(cb.quantity) as total_quantity,
         SUM(cb.purchase_price * cb.quantity) as total_invested,
         SUM(w.current_price * cb.quantity) as current_value,
         COUNT(DISTINCT cb.wine_id) as unique_wines,
         COUNT(CASE WHEN cb.drink_until < NOW() THEN 1 END) as past_peak,
         COUNT(CASE WHEN cb.drink_from <= NOW() AND cb.drink_until >= NOW() THEN 1 END) as in_window,
         COUNT(CASE WHEN cb.drink_from > NOW() THEN 1 END) as too_young
       FROM cellar_bottles cb
       JOIN wines w ON w.id = cb.wine_id
       WHERE cb.user_id = $1`,
      [userId]
    );
    res.json(rows[0] || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
