import express from "express";
import { getAIScore } from "../services/aiScoreService.js";

const router = express.Router();

// POST /api/ai-score
// Body: { id, name, producer, vintage, region, criticScore, marketTrend, risk, currentPrice }
// Returns: { wineId, score, breakdown, signal, reasoning, cached }
router.post("/", async (req, res) => {
  try {
    const wine = req.body;
    if (!wine.id) return res.status(400).json({ error: "wine.id is required" });
    const result = await getAIScore(wine);
    res.json(result);
  } catch (e) {
    console.error("[aiScore] Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
