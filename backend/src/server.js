import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import wines from "./data/wines.json" assert { type: "json" };
import priceHistory from "./data/price-history.json" assert { type: "json" };
import { getLivexMarketData } from "./connectors/livex.js";
import { placeOrder } from "./connectors/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function estimateCagr(points) {
  if (!points || points.length < 2) return null;
  const first = points[0];
  const last = points[points.length - 1];
  const years = (new Date(last.date) - new Date(first.date)) / (365.25 * 24 * 60 * 60 * 1000);
  if (years <= 0 || first.price <= 0) return null;
  return Math.pow(last.price / first.price, 1 / years) - 1;
}

function forecast(points, years = 5) {
  const cagr = estimateCagr(points);
  if (cagr === null) return [];
  const last = points[points.length - 1];
  const output = [];
  for (let i = 1; i <= years; i++) {
    output.push({
      year: new Date(last.date).getFullYear() + i,
      estimatedPrice: Math.round(last.price * Math.pow(1 + cagr, i)),
      cagr: Number((cagr * 100).toFixed(2))
    });
  }
  return output;
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "vinoinvest-backend" });
});

app.get("/api/market/wines", (req, res) => {
  res.json(wines);
});

app.get("/api/market/wines/:id", async (req, res) => {
  const wine = wines.find(w => w.id === req.params.id);
  if (!wine) return res.status(404).json({ error: "Wine not found" });

  const history = priceHistory[wine.id] || [];
  const livex = await getLivexMarketData(wine.lwin);

  res.json({
    ...wine,
    history,
    forecast: forecast(history, 7),
    livex
  });
});

app.post("/api/analyze", async (req, res) => {
  const { budget = 25000, horizonYears = 7, risk = "medio" } = req.body || {};

  const ranked = wines.map(w => {
    const points = priceHistory[w.id] || [];
    const cagr = estimateCagr(points);
    return {
      ...w,
      cagr: cagr ? Number((cagr * 100).toFixed(2)) : null,
      forecast: forecast(points, horizonYears)
    };
  }).sort((a, b) => (b.cagr || 0) - (a.cagr || 0));

  res.json({
    input: { budget, horizonYears, risk },
    summary: "Analisi basata su storico demo. Collegando Liv-ex/API partner userà dati reali.",
    suggestedAllocation: [
      { category: "Bordeaux liquidi", weight: 35 },
      { category: "Italia premium", weight: 30 },
      { category: "Champagne", weight: 20 },
      { category: "Borgogna selettiva", weight: 15 }
    ],
    topWines: ranked
  });
});

app.post("/api/orders", async (req, res) => {
  try {
    const result = await placeOrder(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`VinoInvest backend running on port ${PORT}`);
});
