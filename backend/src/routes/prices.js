import express from "express";
import { getPrices, getPriceHistory, refreshPrice } from "../services/priceService.js";

const router = express.Router();

// GET /api/prices/:wineId?wineName=...&vintage=...&criticScore=...
router.get("/:wineId", async (req, res) => {
  try {
    const { wineId } = req.params;
    const { wineName, vintage, criticScore } = req.query;

    if (!wineName) {
      return res.status(400).json({ error: "wineName is required" });
    }

    const data = await getPrices(
      wineId,
      wineName,
      vintage ? parseInt(vintage, 10) : null,
      criticScore ? parseFloat(criticScore) : 90
    );
    res.json(data);
  } catch (err) {
    console.error("GET /api/prices/:wineId error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prices/:wineId/history?currentPrice=X — storico ultimi 12 mesi
router.get("/:wineId/history", async (req, res) => {
  try {
    const currentPrice = req.query.currentPrice ? parseFloat(req.query.currentPrice) : null;
    const history = await getPriceHistory(req.params.wineId, currentPrice);
    res.json({ wineId: req.params.wineId, history });
  } catch (err) {
    console.error("GET /api/prices/:wineId/history error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/prices/refresh — forza aggiornamento (admin)
router.post("/refresh", async (req, res) => {
  try {
    const { wineId, wineName, vintage, criticScore } = req.body;

    if (!wineId || !wineName) {
      return res.status(400).json({ error: "wineId e wineName sono obbligatori" });
    }

    const result = await refreshPrice(
      wineId,
      wineName,
      vintage ? parseInt(vintage, 10) : null,
      criticScore ? parseFloat(criticScore) : 90
    );
    res.json(result);
  } catch (err) {
    console.error("POST /api/prices/refresh error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
