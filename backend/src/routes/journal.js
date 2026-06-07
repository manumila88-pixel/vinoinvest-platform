import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
let pool;
export const setJournalPool = (p) => { pool = p; };

// GET /api/journal
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT je.*, w.name, w.producer, w.vintage, w.image_url
       FROM journal_entries je
       LEFT JOIN wines w ON w.id = je.wine_id
       WHERE je.user_id = $1
       ORDER BY je.tasted_at DESC`,
      [userId]
    );
    res.json({ entries: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/journal
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { wine_id, wine_name, vintage, rating, notes, occasion, companions, tasted_at } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO journal_entries (user_id, wine_id, wine_name, vintage, rating, notes, occasion, companions, tasted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [userId, wine_id || null, wine_name || null, vintage || null, rating || null, notes || null, occasion || null, companions || null, tasted_at || new Date()]
    );
    res.status(201).json({ entry: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/journal/:id
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, notes, occasion, companions } = req.body;

    const { rows } = await pool.query(
      `UPDATE journal_entries
       SET rating = COALESCE($1, rating),
           notes = COALESCE($2, notes),
           occasion = COALESCE($3, occasion),
           companions = COALESCE($4, companions)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [rating, notes, occasion, companions, id, userId]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ entry: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/journal/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM journal_entries WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
