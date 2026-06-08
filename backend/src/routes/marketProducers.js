/**
 * Market Producers Route — /api/market/producers
 * Top producers by performance, segmented B2B/B2C/emerging + news
 */
import express from "express";
import { getMarketProducers, getProducerDetail } from "../services/wineMarketResearch.js";

const router = express.Router();

// GET /api/market/producers
router.get("/", async (_req, res) => {
  try {
    const data = await getMarketProducers();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/market/producers/:name
router.get("/:name", async (req, res) => {
  try {
    const data = await getProducerDetail(decodeURIComponent(req.params.name));
    if (!data) return res.status(404).json({ error: "Producer not found" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
