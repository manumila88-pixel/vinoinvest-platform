import express from "express";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();
let pool;
export const setFeedbackPool = (p) => { pool = p; };

// POST /api/feedback — submit feedback
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { type, content_id, rating, comment } = req.body;
    const userId = req.user?.id || null;

    if (!type) return res.status(400).json({ error: "type required" });

    if (pool) {
      await pool.query(
        "INSERT INTO user_feedback (user_id, type, content_id, rating, comment) VALUES ($1,$2,$3,$4,$5)",
        [userId, type, content_id || null, rating || null, comment || null]
      ).catch(() => {});
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/feedback/stats (admin)
router.get("/stats", async (_req, res) => {
  try {
    if (!pool) return res.json({ stats: [] });

    const { rows } = await pool.query(`
      SELECT type, content_id, AVG(rating) as avg_rating, COUNT(*) as count
      FROM user_feedback
      GROUP BY type, content_id
      ORDER BY count DESC
      LIMIT 50
    `).catch(() => ({ rows: [] }));

    res.json({ stats: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
