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

const liveMarkets = [

  {
    wineId: "romanee-conti-2015",
    platform: "Liv-ex",
    price: 28750,
    availability: 2,
    trust: 99,
    spread: 1.2,
    location: "London"
  },

  {
    wineId: "romanee-conti-2015",
    platform: "Sotheby's",
    price: 29100,
    availability: 1,
    trust: 98,
    spread: 1.8,
    location: "New York"
  },

  {
    wineId: "opus-one-2018",
    platform: "Wine Searcher",
    price: 548,
    availability: 34,
    trust: 95,
    spread: 2.1,
    location: "California"
  },

  {
    wineId: "penfolds-grange-2016",
    platform: "Liv-ex",
    price: 940,
    availability: 11,
    trust: 99,
    spread: 1.4,
    location: "Singapore"
  },

  {
    wineId: "vega-sicilia-unico-2012",
    platform: "Bordeaux Index",
    price: 689,
    availability: 7,
    trust: 97,
    spread: 1.7,
    location: "Madrid"
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

function getAiScore(wine) {

  return (
    wine.investmentScore +
    wine.criticScore
  ) / 2;

}

function getSignal(wine) {

  const aiScore =
    getAiScore(wine);

  if (
    aiScore >= 98 &&
    wine.marketTrend === "Bullish"
  ) {

    return "Strong Buy";

  }

  if (aiScore >= 94) {

    return "Buy";

  }

  return "Hold";

}

function enrichWine(wine) {

  return {

    ...wine,

    estimatedReturn:
      Math.round(
        wine.currentPrice * 0.35
      ),

    analysis: {

      aiScore:
        getAiScore(wine),

      signal:
        getSignal(wine),

      trustLevel:
        "High",

      recommendation:
        wine.marketTrend === "Bullish"
          ? "Interesting"
          : "Monitor"

    }

  };

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
      .map(enrichWine);

  res.json({

    query,

    totalResults:
      results.length,

    results

  });

});

app.get("/api/live-market", (req, res) => {

  const query =
    (req.query.q || "")
      .toString()
      .toLowerCase();

  const matchedWines =
    wines.filter(wine => {

      const searchable = `
        ${wine.name}
        ${wine.producer}
      `.toLowerCase();

      return searchable.includes(query);

    });

  const results =
    matchedWines.map(wine => {

      const markets =
        liveMarkets.filter(
          market =>
            market.wineId === wine.id
        );

      const bestPrice =
        Math.min(
          ...markets.map(
            m => m.price
          )
        );

      return {

        wine,

        bestPrice,

        totalMarkets:
          markets.length,

        totalAvailability:
          markets.reduce(
            (sum, m) =>
              sum + m.availability,
            0
          ),

        markets

      };

    });

  res.json({

    query,

    results

  });

});

app.post("/api/portfolio-builder", (req, res) => {

  const budget =
    Number(req.body.budget || 10000);

  const risk =
    (
      req.body.risk || "medio"
    )
      .toString()
      .toLowerCase();

  const horizonYears =
    Number(
      req.body.horizonYears || 5
    );

  let filteredWines = wines;

  if (risk === "basso") {

    filteredWines =
      wines.filter(
        wine =>
          wine.risk === "Basso"
      );

  }

  if (risk === "medio") {

    filteredWines =
      wines.filter(
        wine =>
          wine.risk === "Basso" ||
          wine.risk === "Medio"
      );

  }

  if (
    filteredWines.length === 0
  ) {

    filteredWines = wines;

  }

  const ranked =
    filteredWines
      .map(wine => ({

        ...wine,

        aiScore:
          getAiScore(wine),

        signal:
          getSignal(wine)

      }))
      .sort(
        (a, b) =>
          b.aiScore - a.aiScore
      )
      .slice(0, 3);

  const allocation =
    ranked.map((wine, index) => {

      const weights =
        [0.45, 0.35, 0.2];

      const amount =
        Math.round(
          budget * weights[index]
        );

      const bottles =
        Math.max(
          1,
          Math.floor(
            amount /
            wine.currentPrice
          )
        );

      return {

        wineId:
          wine.id,

        wineName:
          wine.name,

        region:
          wine.region,

        risk:
          wine.risk,

        signal:
          wine.signal,

        aiScore:
          wine.aiScore,

        allocatedAmount:
          amount,

        currentPrice:
          wine.currentPrice,

        estimatedBottles:
          bottles,

        estimatedReturn:
          Math.round(
            amount * 0.35
          )

      };

    });

  const totalAllocated =
    allocation.reduce(
      (sum, item) =>
        sum +
        item.allocatedAmount,
      0
    );

  const expectedProfit =
    allocation.reduce(
      (sum, item) =>
        sum +
        item.estimatedReturn,
      0
    );

  res.json({

    input: {

      budget,

      risk,

      horizonYears

    },

    summary:
      "Portfolio generato su dati demo e score AI.",

    totalAllocated,

    expectedValue:
      totalAllocated +
      expectedProfit,

    expectedProfit,

    expectedROI:
      Number(
        (
          (
            expectedProfit /
            totalAllocated
          ) * 100
        ).toFixed(2)
      ),

    allocation

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
