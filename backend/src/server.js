import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

function readJson(fileName) {
  const filePath = path.join(__dirname, "data", fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const wines = readJson("wines.json");
const priceHistory = readJson("price-history.json");

function estimateCagr(points) {
  if (!points || points.length < 2) return null;

  const first = points[0];
  const last = points[points.length - 1];

  const years =
    (new Date(last.date) - new Date(first.date)) /
    (365.25 * 24 * 60 * 60 * 1000);

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

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "VinoInvest backend online"
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/market/wines", (req, res) => {
  res.json(wines);
});

app.get("/api/market/wines/:id", (req, res) => {
  const wine = wines.find(w => w.id === req.params.id);

  if (!wine) {
    return res.status(404).json({ error: "Wine not found" });
  }

  const history = priceHistory[wine.id] || [];

  res.json({
    ...wine,
    history,
    forecast: forecast(history, 7),
    livex: {
      source: "demo",
      message: "Liv-ex API non ancora configurata"
    }
  });
});

app.post("/api/analyze", (req, res) => {
  const { budget = 25000, horizonYears = 7, risk = "medio" } = req.body || {};

  const ranked = wines
    .map(w => {
      const points = priceHistory[w.id] || [];
      const cagr = estimateCagr(points);

      return {
        ...w,
        cagr: cagr ? Number((cagr * 100).toFixed(2)) : null,
        forecast: forecast(points, horizonYears)
      };
    })
    .sort((a, b) => (b.cagr || 0) - (a.cagr || 0));

  res.json({
    input: { budget, horizonYears, risk },
    summary:
      "Analisi basata su storico demo. Quando colleghi API reali userà dati reali.",
    suggestedAllocation: [
      { category: "Bordeaux liquidi", weight: 35 },
      { category: "Italia premium", weight: 30 },
      { category: "Champagne", weight: 20 },
      { category: "Borgogna selettiva", weight: 15 }
    ],
    topWines: ranked
  });
});

app.post("/api/orders", (req, res) => {
  res.json({
    mode: "simulation",
    status: "created",
    message: "Ordine simulato creato. Ordini reali disattivati.",
    order: req.body
  });
});

app.listen(PORT, () => {
  console.log(`VinoInvest backend running on port ${PORT}`);
});