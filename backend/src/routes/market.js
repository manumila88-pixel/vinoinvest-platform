import { Router } from "express";
import { getVinoInvestIndex, getIndexComposition } from "../services/vinoInvestIndex.js";
import { buildMerchantOptions, getPriceStats, estimateInvestmentReturn } from "../services/priceAggregator.js";

const router = Router();

// GET /api/market/index — VinoInvest proprietary index
router.get("/index", (_req, res) => {
  const index = getVinoInvestIndex();
  res.json(index);
});

// GET /api/market/index/composition
router.get("/index/composition", (_req, res) => {
  res.json(getIndexComposition());
});

// GET /api/market/merchants?wineId=lafite-2019&name=Château+Lafite&vintage=2019&price=850
router.get("/merchants", (req, res) => {
  const wine = {
    id: req.query.wineId || "",
    name: req.query.name || "",
    vintage: req.query.vintage ? parseInt(req.query.vintage) : null,
    currentPrice: parseFloat(req.query.price) || 100,
    investmentScore: parseInt(req.query.score) || 75,
  };
  const options = buildMerchantOptions(wine);
  const stats = getPriceStats(wine);
  const investment = estimateInvestmentReturn(wine);
  res.json({ merchants: options, priceStats: stats, investment });
});

// GET /api/market/investment-estimate?price=500&score=88&vintage=2018
router.get("/investment-estimate", (req, res) => {
  const wine = {
    currentPrice: parseFloat(req.query.price) || 100,
    investmentScore: parseInt(req.query.score) || 75,
    vintage: parseInt(req.query.vintage) || 2018,
  };
  res.json(estimateInvestmentReturn(wine));
});

export default router;
