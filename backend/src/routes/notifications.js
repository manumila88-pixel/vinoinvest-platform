import express from "express";
import { ensureNotifTable, getAlertPool } from "../jobs/alertsChecker.js";

const router = express.Router();

// PUT /read-all/:userId — MUST be before /:id/read to avoid Express route conflict
router.put("/read-all/:userId", async (req, res) => {
  const db = await getAlertPool();
  if (!db) return res.json({ success: true });
  try {
    await db.query(`UPDATE notifications SET read = true WHERE user_id = $1`, [req.params.userId]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /:userId
router.get("/:userId", async (req, res) => {
  const db = await getAlertPool();
  if (!db) return res.json([]);
  await ensureNotifTable(db);
  try {
    const { rows } = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /:id/read
router.put("/:id/read", async (req, res) => {
  const db = await getAlertPool();
  if (!db) return res.json({ success: true });
  try {
    await db.query(`UPDATE notifications SET read = true WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
