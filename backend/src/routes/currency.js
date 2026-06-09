import { Router } from "express";
import { getRates, convertAll, getCurrencyList } from "../services/currencyService.js";

const router = Router();

// GET /api/currency/rates
router.get("/rates", async (_req, res) => {
  try {
    const rates = await getRates();
    res.json({ base: "EUR", rates, updated: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/currency/list
router.get("/list", (_req, res) => {
  res.json(getCurrencyList());
});

// GET /api/currency/convert?amount=500&from=EUR&to=USD
router.get("/convert", async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount || 0);
    const to = req.query.to || "USD";
    const rates = await getRates();
    const rate = rates[to] || 1;
    res.json({ amount, from: "EUR", to, converted: +(amount * rate).toFixed(2), rate, symbol: getCurrencyList().find(c => c.code === to)?.symbol || to });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/currency/price/:amount — returns price in all currencies
router.get("/price/:amount", async (req, res) => {
  try {
    const amount = parseFloat(req.params.amount);
    if (isNaN(amount)) return res.status(400).json({ error: "invalid amount" });
    const all = await convertAll(amount);
    res.json({ baseEUR: amount, currencies: all });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
