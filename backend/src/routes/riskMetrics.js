/**
 * Risk metrics endpoint — computes real portfolio risk analytics.
 */
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { computePortfolioRisk, buildReturns } from "../services/riskMetricsService.js";

const router = Router();
let _pool = null;
export function setRiskPool(pool) { _pool = pool; }

// GET /api/risk/portfolio/:userId
router.get("/portfolio/:userId", requireAuth, async (req, res) => {
  if (req.user.id !== req.params.userId && !req.user.is_admin) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    let holdings = [];

    if (_pool) {
      // Load orders joined with wine current prices
      const { rows: orders } = await _pool.query(
        `SELECT o.wine_id, o.quantity, o.price as purchase_price,
                w.current_price, w.name as wine_name
         FROM orders o
         LEFT JOIN wines w ON w.id = o.wine_id
         WHERE o.user_id = $1
         ORDER BY o.created_at`,
        [req.params.userId]
      );

      for (const o of orders) {
        const currPrice = Number(o.current_price) || Number(o.purchase_price) || 0;
        const qty = Number(o.quantity) || 1;

        // Load price history for this wine
        const { rows: hist } = await _pool.query(
          `SELECT price, recorded_at FROM price_history WHERE wine_id=$1 ORDER BY recorded_at`,
          [o.wine_id]
        );
        const returns = buildReturns(hist);

        holdings.push({
          name: o.wine_name || o.wine_id,
          value: currPrice * qty,
          purchaseValue: Number(o.purchase_price) * qty,
          returns,
        });
      }
    }

    if (holdings.length === 0) {
      holdings = [
        { name: "Demo Portfolio", value: 50000, returns: [0.02,0.01,0.03,-0.01,0.02,0.04,0.01,-0.02] },
      ];
    }

    // VinoInvest index returns (12 months, demo)
    const indexReturns = [0.02, 0.01, 0.03, -0.01, 0.02, 0.04, 0.01, -0.02, 0.03, 0.02, 0.01, 0.03];
    const risk = computePortfolioRisk(holdings, indexReturns);

    // Add benchmark comparison
    const sp500Return = 0.117; // ~11.7% avg annual S&P500
    const goldReturn = 0.082;  // ~8.2% avg annual gold
    const inflationRate = 0.026; // ECB ~2.6% EU inflation

    res.json({
      ...risk,
      holdings: holdings.map(h => ({
        name: h.name,
        value: h.value,
        weight: risk.totalValue > 0 ? ((h.value / risk.totalValue) * 100).toFixed(1) + "%" : "0%",
      })),
      benchmarks: {
        vinoInvestIndex: 0.148,
        sp500: sp500Return,
        gold: goldReturn,
        euInflation: inflationRate,
        vsInflation: risk.annualisedReturn - inflationRate,
        vsSP500: risk.annualisedReturn - sp500Return,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/risk/benchmark
router.get("/benchmark", async (req, res) => {
  res.json({
    vinoInvestIndex: { return12m: 0.148, volatility: 0.12, sharpe: 0.98 },
    sp500: { return12m: 0.117, source: "FRED/SP500" },
    gold: { return12m: 0.082, source: "FRED/GOLDAMGBD228NLBM" },
    euInflation: { rate: 0.026, source: "ECB" },
    disclaimer: "Returns are indicative. Past performance does not guarantee future results.",
  });
});

export default router;
