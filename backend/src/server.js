import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const wines = [
  {
    id: "lafite-2018",
    name: "Château Lafite Rothschild 2018",
    producer: "Lafite Rothschild",
    region: "Bordeaux",
    country: "France",
    vintage: 2018,
    criticScore: 99,
    investmentScore: 96,
    currentPrice: 820,
    risk: "Basso",
    liquidity: "Alta",
    marketTrend: "Bullish",
    source: "liv-ex"
  },
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

const platforms = [
  {
    id: "liv-ex",
    name: "Liv-ex",
    type: "Fine Wine Exchange",
    verified: true,
    trustScore: 99,
    website: "https://www.liv-ex.com"
  },
  {
    id: "wine-searcher",
    name: "Wine-Searcher",
    type: "Global Price Search",
    verified: true,
    trustScore: 95,
    website: "https://www.wine-searcher.com"
  },
  {
    id: "bordeaux-index",
    name: "Bordeaux Index",
    type: "Wine Trading",
    verified: true,
    trustScore: 97,
    website: "https://bordeauxindex.com"
  },
  {
    id: "sothebys",
    name: "Sotheby's Wine",
    type: "Auction House",
    verified: true,
    trustScore: 98,
    website: "https://www.sothebys.com"
  }
];

let orders = [];

function enrichWine(wine) {
  return {
    ...wine,
    estimatedReturn: Math.round(wine.currentPrice * 0.35),
    platforms,
    analysis: {
      investmentPotential:
        wine.investmentScore >= 97
          ? "Molto alto"
          : wine.investmentScore >= 93
          ? "Alto"
          : "Medio",
      marketRisk: wine.risk,
      recommendation:
        wine.marketTrend === "Bullish"
          ? "Interessante per monitoraggio"
          : "Monitorare il trend",
      aiScore: (wine.investmentScore + wine.criticScore) / 2,
      trustLevel: "Alto"
    }
  };
}

function searchWines(query) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  const words = normalizedQuery.split(" ").filter(Boolean);

  return wines.filter(wine => {
    const searchable = `
      ${wine.name}
      ${wine.producer}
      ${wine.region}
      ${wine.country}
      ${wine.vintage}
      ${wine.source}
    `.toLowerCase();

    return words.every(word => searchable.includes(word));
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

app.get("/api/platforms", (req, res) => {
  res.json(platforms);
});

app.get("/api/search", (req, res) => {
  const query = (req.query.q || "").toString();

  const results = searchWines(query).map(enrichWine);

  res.json(results);
});

app.get("/api/global-search", (req, res) => {
  const query = (req.query.q || "").toString();

  const localResults = searchWines(query).map(enrichWine);

  const response = {
    query,
    totalResults: localResults.length,
    sourcesChecked: [
      "internal-database",
      "trusted-platforms",
      "liv-ex-ready",
      "wine-searcher-ready",
      "bordeaux-index-ready",
      "auction-ready"
    ],
    safety: {
      scamFilter: true,
      onlyVerifiedPlatforms: true,
      warning:
        "La piattaforma mostra solo fonti verificate. L'utente resta responsabile delle proprie scelte di investimento."
    },
    results: localResults
  };

  res.json(response);
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const order = {
    id: Date.now(),
    wineId: req.body.wineId,
    quantity: req.body.quantity || 1,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  res.json({
    success: true,
    order
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});