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
      (req.query.q || "")
        .toString()
        .toLowerCase()
        .trim();

    if (!query) {

      return res.json({

        query,

        totalResults: 0,

        results: []

      });

    }

    const results =
      allWines

        .filter(wine => {

          const searchable = `
            ${wine.name}
            ${wine.producer}
            ${wine.region}
            ${wine.country}
            ${wine.vintage}
          `
            .toLowerCase()
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            );

          const normalizedQuery =
            query
              .normalize("NFD")
              .replace(
                /[\u0300-\u036f]/g,
                ""
              );

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
      (req.query.q || "")
        .toString()
        .toLowerCase();

    const results =
      allWines

        .filter(wine => {

          const searchable = `
            ${wine.name}
            ${wine.producer}
            ${wine.region}
            ${wine.country}
          `
            .toLowerCase()
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            );

          const normalizedQuery =
            query
              .normalize("NFD")
              .replace(
                /[\u0300-\u036f]/g,
                ""
              );

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
            markets.length > 0

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

    let selected;

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
          (
            a,
            b
          ) =>
            b.investmentScore -
            a.investmentScore
        )
        .slice(0, 3);

    const allocation =
      top.map(
        (
          wine,
          index
        ) => {

          const percentages =
            [0.45, 0.35, 0.2];

          const allocatedAmount =
            Math.round(
              budget *
              percentages[
                index
              ]
            );

          const estimatedBottles =
            Math.max(
              1,
              Math.floor(
                allocatedAmount /
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
              "Buy",

            aiScore:
              (
                wine.criticScore +
                wine.investmentScore
              ) / 2,

            allocatedAmount,

            currentPrice:
              wine.currentPrice,

            estimatedBottles,

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

    const expectedValue =
      budget +
      expectedProfit;

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

      expectedValue,

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

    const order = {

      id: Date.now(),

      wineId:
        req.body.wineId,

      quantity:
        req.body.quantity || 1,

      createdAt:
        new Date()
          .toISOString()

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