import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const wines = [

  {
    id: "romanee-conti-2015",
    name: "Romanée-Conti Grand Cru 2015",
    producer: "Domaine de la Romanée-Conti",
    region: "Burgundy",
    country: "France",
    vintage: 2015,
    criticScore: 100,
    investmentScore: 100,
    currentPrice: 28500,
    risk: "Alto",
    liquidity: "Alta",
    marketTrend: "Bullish",
    source: "external-market"
  },

  {
    id: "opus-one-2018",
    name: "Opus One 2018",
    producer: "Opus One Winery",
    region: "Napa Valley",
    country: "USA",
    vintage: 2018,
    criticScore: 97,
    investmentScore: 92,
    currentPrice: 540,
    risk: "Medio",
    liquidity: "Alta",
    marketTrend: "Bullish",
    source: "external-market"
  },

  {
    id: "penfolds-grange-2016",
    name: "Penfolds Grange 2016",
    producer: "Penfolds",
    region: "South Australia",
    country: "Australia",
    vintage: 2016,
    criticScore: 99,
    investmentScore: 95,
    currentPrice: 930,
    risk: "Medio",
    liquidity: "Media",
    marketTrend: "Bullish",
    source: "external-market"
  },

  {
    id: "vega-sicilia-unico-2012",
    name: "Vega Sicilia Unico 2012",
    producer: "Vega Sicilia",
    region: "Ribera del Duero",
    country: "Spain",
    vintage: 2012,
    criticScore: 98,
    investmentScore: 94,
    currentPrice: 670,
    risk: "Basso",
    liquidity: "Alta",
    marketTrend: "Stable",
    source: "external-market"
  }

];

let orders = [];

function normalize(text) {

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}

function searchWines(query) {

  const normalizedQuery =
    normalize(query || "");

  return wines.filter(wine => {

    const searchable =
      normalize(`
        ${wine.name}
        ${wine.producer}
        ${wine.region}
        ${wine.country}
        ${wine.vintage}
      `);

    return searchable.includes(
      normalizedQuery
    );

  });

}

app.get("/", (req, res) => {

  res.json({
    status: "online",
    service: "vinoinvest-backend"
  });

});

app.get("/api/market/wines", (req, res) => {

  res.json(wines);

});

app.get("/api/global-search", (req, res) => {

  const query =
    req.query.q || "";

  const results =
    searchWines(query)
      .map(wine => {

        const aiScore =
          (
            wine.investmentScore +
            wine.criticScore
          ) / 2;

        let signal = "Hold";

        if (
          aiScore >= 98 &&
          wine.marketTrend === "Bullish"
        ) {

          signal = "Strong Buy";

        } else if (
          aiScore >= 94
        ) {

          signal = "Buy";

        }

        return {

          ...wine,

          estimatedReturn:
            Math.round(
              wine.currentPrice * 0.35
            ),

          analysis: {

            aiScore,

            signal,

            trustLevel:
              "High",

            recommendation:
              wine.marketTrend === "Bullish"
                ? "Interesting"
                : "Monitor"

          }

        };

      });

  res.json({

    query,

    totalResults:
      results.length,

    results

  });

});

app.get("/api/orders", (req, res) => {

  res.json(orders);

});

app.post("/api/orders", (req, res) => {

  const order = {

    id: Date.now(),

    wineId:
      req.body.wineId,

    quantity:
      req.body.quantity || 1,

    createdAt:
      new Date().toISOString()

  };

  orders.push(order);

  res.json({

    success: true,

    order

  });

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});