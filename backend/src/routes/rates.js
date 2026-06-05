import express from "express";

const router = express.Router();

let cache = null;
let cacheTime = 0;
const TTL = 6 * 3600 * 1000;

// GET /api/rates — EUR/USD/GBP from exchangerate-api (free, no key)
router.get("/", async (req, res) => {
  if (cache && Date.now() - cacheTime < TTL) return res.json(cache);

  try {
    const r = await fetch("https://open.er-api.com/v6/latest/EUR", { signal: AbortSignal.timeout(5000) });
    if (!r.ok) throw new Error("rates API error");
    const data = await r.json();
    cache = {
      base: "EUR",
      rates: { USD: data.rates.USD, GBP: data.rates.GBP, CHF: data.rates.CHF, JPY: data.rates.JPY },
      updated: new Date().toISOString(),
    };
    cacheTime = Date.now();
    res.json(cache);
  } catch (e) {
    // Fallback to approximate rates if API fails
    if (cache) return res.json(cache);
    res.json({ base: "EUR", rates: { USD: 1.08, GBP: 0.86, CHF: 0.96, JPY: 162 }, updated: null, fallback: true });
  }
});

export default router;
