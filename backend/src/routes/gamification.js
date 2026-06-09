import { Router } from "express";
import { awardPoints, getUserStats, getLeaderboard, getAllBadges } from "../services/gamificationService.js";

const router = Router();

// GET /api/gamification/stats/:userId
router.get("/stats/:userId", async (req, res) => {
  try {
    const stats = await getUserStats(req.params.userId);
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/gamification/event — award points for an event
router.post("/event", async (req, res) => {
  try {
    const { userId, event } = req.body;
    if (!userId || !event) return res.status(400).json({ error: "userId and event required" });
    const result = await awardPoints(userId, event);
    if (!result) return res.status(400).json({ error: "unknown event" });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/gamification/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const board = await getLeaderboard(limit);
    res.json({ leaderboard: board });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/gamification/badges — all possible badges
router.get("/badges", (_req, res) => {
  res.json(getAllBadges());
});

export default router;
