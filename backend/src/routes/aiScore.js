import express from "express";
import { getAIScore } from "../services/aiScoreService.js";

const router = express.Router();

// GET /api/ai-score/:wineId?name=&producer=&vintage=&region=&criticScore=&marketTrend=&risk=
router.get("/:wineId", async (req, res) => {
  try {
    const { wineId } = req.params;
    const wine = {
      id: wineId,
      name: req.query.name || wineId,
      producer: req.query.producer || "",
      vintage: req.query.vintage || "2018",
      region: req.query.region || "",
      criticScore: parseFloat(req.query.criticScore) || 90,
      marketTrend: req.query.marketTrend || "Stable",
      risk: req.query.risk || "Medio",
      currentPrice: parseFloat(req.query.currentPrice) || 100,
    };
    const result = await getAIScore(wine);
    res.json(result);
  } catch (e) {
    console.error("[aiScore] GET Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

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
