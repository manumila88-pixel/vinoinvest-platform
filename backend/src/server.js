import express from "express";
import cors from "cors";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const wines =
  JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "data",
        "wines.json"
      ),
      "utf-8"
    )
  );

const externalWines =
  JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "data",
        "externalWines.json"
      ),
      "utf-8"
    )
  );

const priceHistory =
  JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "data",
        "price-history.json"
      ),
      "utf-8"
    )
  );

const allWines = [
  ...wines,
  ...externalWines
];

const marketplaceData = [

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
    wineId: "opus-one-2018",
    platform: "Liv-ex",
    price: 552,
    availability: 12,
    trust: 99,
    spread: 1.4,
    location: "London"
  },

  {
    wineId: "romanee-conti-2015",
    platform: "Sotheby's",
    price: 28900,
    availability: 2,
    trust: 98,
    spread: 4.8,
    location: "Hong Kong"
  },

  {
    wineId: "lafite-2018",
    platform: "Bordeaux Index",
    price: 828,
    availability: 18,
    trust: 97,
    spread: 1.9,
    location: "Bordeaux"
  }

];

let orders = [];

function getMarketMultiplier(wine) {
  const vintage = wine.vintage || 2018;
  const age = 2026 - vintage;
  const score = wine.criticScore || wine.investmentScore || 90;
  const region = (wine.region || "").toLowerCase();
  let base = 1.0;
  if (age > 10) base += 0.015 * (age - 10);
  if (score >= 98) base += 0.12;
  else if (score >= 95) base += 0.08;
  else if (score >= 92) base += 0.05;
  if (region.includes("bordeaux") || region.includes("burgundy") || region.includes("borgogna")) base += 0.06;
  else if (region.includes("toscana") || region.includes("tuscany") || region.includes("piemonte")) base += 0.04;
  const noise = (Math.random() - 0.3) * 0.04;
  return Math.max(1.0, base + noise);
}

function normalize(text) {

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}

app.get("/", (req, res) => {

  res.json({

    status: "online",

    service:
      "vinoinvest-backend"

  });

});

app.get(
  "/api/market/wines",
  (req, res) => {

    res.json(allWines);

  }
);

app.get(
  "/api/global-search",
  (req, res) => {

    const query =
      (
        req.query.q || ""
      )
        .toString()
        .trim();

    if (!query) {

      return res.json({

        query,

        totalResults: 0,

        results: []

      });

    }

    const normalizedQuery =
      normalize(query);

    const results =
      allWines

        .filter(wine => {

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

        })

        .map(wine => {

          const aiScore =
            (
              wine.criticScore +
              wine.investmentScore
            ) / 2;

          return {

            ...wine,

            estimatedReturn:
              Math.round(
                wine.currentPrice *
                0.35
              ),

            analysis: {

              aiScore,

              signal:
                aiScore >= 97
                  ? "Strong Buy"
                  : aiScore >= 93
                  ? "Buy"
                  : "Watch",

              trustLevel:
                wine.risk ===
                "Basso"
                  ? "High"
                  : wine.risk ===
                    "Medio"
                  ? "Medium"
                  : "Speculative",

              recommendation:
                wine.marketTrend ===
                "Bullish"
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

  }
);

app.get(
  "/api/marketplace-search",
  (req, res) => {

    const query =
      (
        req.query.q || ""
      )
        .toString()
        .trim();

    const normalizedQuery =
      normalize(query);

    const results =
      allWines

        .filter(wine => {

          const searchable =
            normalize(`
              ${wine.name}
              ${wine.producer}
              ${wine.region}
              ${wine.country}
            `);

          return searchable.includes(
            normalizedQuery
          );

        })

        .map(wine => {

          const markets =
            marketplaceData.filter(
              item =>
                item.wineId ===
                wine.id
            );

          const bestPrice =
            markets.length

              ? Math.min(
                  ...markets.map(
                    m => m.price
                  )
                )

              : wine.currentPrice;

          return {

            wine,

            bestPrice,

            totalMarkets:
              markets.length,

            totalAvailability:
              markets.reduce(
                (sum, m) =>
                  sum +
                  m.availability,
                0
              ),

            markets

          };

        });

    res.json({

      query,

      results

    });

  }
);

app.get(
  "/api/price-history/:wineId",
  (req, res) => {

    const wineId =
      req.params.wineId;

    const history =
      priceHistory[wineId];

    if (!history) {

      return res
        .status(404)
        .json({

          error:
            "History not found"

        });

    }

    const first =
      history[0].price;

    const last =
      history[
        history.length - 1
      ].price;

    const growth =
      (
        (
          last - first
        ) / first
      ) * 100;

    res.json({

      wineId,

      growth:
        growth.toFixed(2),

      points:
        history

    });

  }
);

app.post(
  "/api/portfolio-builder",
  (req, res) => {

    const {

      budget = 10000,

      risk = "medio",

      horizonYears = 5

    } = req.body;

    let selected = [];

    if (risk === "basso") {

      selected =
        allWines.filter(
          wine =>
            wine.risk ===
            "Basso"
        );

    } else if (
      risk === "alto"
    ) {

      selected =
        allWines.filter(
          wine =>
            wine.risk ===
            "Alto"
        );

    } else {

      selected =
        allWines.filter(
          wine =>
            wine.risk ===
              "Medio" ||
            wine.risk ===
              "Basso"
        );

    }

    const top =
      selected
        .sort(
          (a, b) =>
            b.investmentScore -
            a.investmentScore
        )
        .slice(0, 3);

    const percentages =
      [0.45, 0.35, 0.2];

    const allocation =
      top.map(
        (wine, index) => {

          const allocatedAmount =
            Math.round(
              budget *
              percentages[
                index
              ]
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
              "Buy",

            aiScore:
              (
                wine.criticScore +
                wine.investmentScore
              ) / 2,

            allocatedAmount,

            currentPrice:
              wine.currentPrice,

            estimatedBottles:
              Math.max(
                1,
                Math.floor(
                  allocatedAmount /
                  wine.currentPrice
                )
              ),

            estimatedReturn:
              Math.round(
                allocatedAmount *
                0.35
              )

          };

        }
      );

    const expectedProfit =
      Math.round(
        budget * 0.35
      );

    res.json({

      input: {

        budget,

        risk,

        horizonYears

      },

      summary:
        "Portfolio generato su dati demo e score AI.",

      totalAllocated:
        budget,

      expectedValue:
        budget +
        expectedProfit,

      expectedProfit,

      expectedROI: 35,

      allocation

    });

  }
);

app.get(
  "/api/orders",
  (req, res) => {

    res.json(orders);

  }
);

app.post(
  "/api/orders",
  (req, res) => {

    const wine =
      allWines.find(
        w =>
          w.id ===
          req.body.wineId
      );

    if (!wine) {

      return res
        .status(404)
        .json({

          success: false,

          error:
            "Wine not found"

        });

    }

   const purchasePrice = Number(req.body.purchasePrice) || Number(wine.currentPrice) || 0;
const multiplier = getMarketMultiplier(wine);
const currentMarketPrice = Math.round(purchasePrice * multiplier);

const order = {
  id: Date.now(),
  wineId: req.body.wineId,
  wine_id: req.body.wineId,
  quantity: Number(req.body.quantity) || 1,
  purchasePrice,
  currentMarketPrice,
  purchaseDate: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

orders.push(order);

res.json({
  success: true,
  order
});

  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});