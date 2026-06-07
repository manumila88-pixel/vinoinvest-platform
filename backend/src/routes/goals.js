import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
let pool;
export const setGoalsPool = (p) => { pool = p; };

// GET /api/goals
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      "SELECT * FROM investment_goals WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json({ goals: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/goals
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, target_amount, target_date, monthly_budget, strategy } = req.body;

    if (!target_amount || !target_date) {
      return res.status(400).json({ error: "target_amount and target_date are required" });
    }

    // Calculate monthly investment needed
    const months = Math.max(1, Math.ceil((new Date(target_date) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
    const avg_annual_return = 0.08; // 8% wine market average
    const monthly_needed = target_amount / (((Math.pow(1 + avg_annual_return / 12, months) - 1) / (avg_annual_return / 12)));

    const { rows } = await pool.query(
      `INSERT INTO investment_goals (user_id, title, target_amount, target_date, monthly_budget, monthly_needed, strategy, current_progress)
       VALUES ($1,$2,$3,$4,$5,$6,$7,0)
       RETURNING *`,
      [userId, title || "Investment Goal", target_amount, target_date, monthly_budget || monthly_needed, monthly_needed, strategy || "balanced"]
    );
    res.status(201).json({ goal: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/goals/:id — update progress
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { current_progress, title, monthly_budget } = req.body;

    const { rows } = await pool.query(
      `UPDATE investment_goals
       SET current_progress = COALESCE($1, current_progress),
           title = COALESCE($2, title),
           monthly_budget = COALESCE($3, monthly_budget)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [current_progress, title, monthly_budget, id, userId]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ goal: rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/goals/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await pool.query("DELETE FROM investment_goals WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
