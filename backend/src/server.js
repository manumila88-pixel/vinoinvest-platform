import express from "express";
import cors from "cors";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wines = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data", "wines.json"),
    "utf-8"
  )
);

const platforms = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data", "platforms.json"),
    "utf-8"
  )
);

let orders = [];

app.get("/", (req, res) => {

  res.json({
    status: "online",
    service: "vinoinvest-backend"
  });

});

app.get("/api/market/wines", (req, res) => {

  res.json(wines);

});

app.get("/api/platforms", (req, res) => {

  res.json(platforms);

});

app.get("/api/search", (req, res) => {

  const query =
    (req.query.q || "")
      .toString()
      .toLowerCase()
      .trim();

  if (!query) {

    return res.json([]);

  }

  const results = wines.filter(wine => {

    const searchable = `
      ${wine.name}
      ${wine.producer}
      ${wine.region}
      ${wine.country}
    `
      .toLowerCase();

    return searchable.includes(query);

  });

  const enrichedResults = results.map(wine => {

    const matchingPlatforms =
      platforms.filter(
        platform => platform.verified
      );

    return {

      ...wine,

      platforms: matchingPlatforms,

      analysis: {

        investmentPotential:
          wine.investmentScore >= 97
            ? "Molto alto"
            : wine.investmentScore >= 93
            ? "Alto"
            : "Moderato",

        marketRisk: wine.risk,

        recommendation:
          wine.marketTrend === "Bullish"
            ? "Interessante per monitoraggio"
            : "Monitorare il trend"

      }

    };

  });

  res.json(enrichedResults);

});

app.get("/api/orders", (req, res) => {

  res.json(orders);

});

app.post("/api/orders", (req, res) => {

  const order = {
    id: Date.now(),
    wineId: req.body.wineId,
    quantity: req.body.quantity || 1
  };

  orders.push(order);

  res.json({
    success: true,
    order
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});