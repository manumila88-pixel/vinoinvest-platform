/**
 * Price Estimate Route — Agent F §2
 * Exposes the algorithmic price estimation engine.
 * Every response is labelled STIMA — never a real market price.
 *
 * Mount in server.js:
 *   import priceEstimateRouter, { setEstimateRoutePool } from "./routes/priceEstimate.js";
 *   app.use("/api/price-estimate", priceEstimateRouter);
 *   // and in the pool-ready callback:
 *   setEstimateRoutePool(pool);
 */

import { Router } from "express";
import { estimateWinePrice, estimateWinePriceBatch, setPriceEstimatePool } from "../services/priceEstimateService.js";

const router = Router();

export function setEstimateRoutePool(pool) {
  setPriceEstimatePool(pool);
}

/**
 * POST /api/price-estimate
 * Body: wine object or array of wines
 * Returns: estimate (or array of estimates) — always labelled STIMA
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body) return res.status(400).json({ error: "Request body required" });

    if (Array.isArray(body)) {
      if (body.length > 20) return res.status(400).json({ error: "Max 20 wines per batch request" });
      const results = await estimateWinePriceBatch(body);
      return res.json({ is_batch: true, count: results.length, estimates: results });
    }

    if (!body.id && !body.name) {
      return res.status(400).json({ error: "wine.id or wine.name is required" });
    }
    const result = await estimateWinePrice(body);
    res.json(result);
  } catch (e) {
    console.error("[priceEstimate] POST error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/price-estimate/:wineId
 * Query params: name, producer, vintage, region, current_price, market_trend, risk
 * Returns: estimate — labelled STIMA
 */
router.get("/:wineId", async (req, res) => {
  try {
    const { name, producer, vintage, region, current_price, market_trend, risk } = req.query;
    const wine = {
      id: req.params.wineId,
      name: name || req.params.wineId,
      producer: producer || null,
      vintage: vintage || null,
      region: region || null,
      current_price: current_price ? parseFloat(current_price) : 0,
      market_trend: market_trend || null,
      risk: risk || null,
    };
    const result = await estimateWinePrice(wine);
    res.json(result);
  } catch (e) {
    console.error("[priceEstimate] GET error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
