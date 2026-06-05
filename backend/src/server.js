import "dotenv/config";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pg from "pg";
import cors from "cors";
import paymentsRouter from "./routes/payments.js";
import pricesRouter from "./routes/prices.js";
import authRouter from "./routes/auth.js";
import aiScoreRouter from "./routes/aiScore.js";
import alertsRouter from "./routes/alerts.js";
import notificationsRouter from "./routes/notifications.js";
import dashboardRouter from "./routes/dashboard.js";
import ratesRouter from "./routes/rates.js";
import newsRouter from "./routes/news.js";
import aiMarketRouter from "./routes/aiMarket.js";
import aiPortfolioRouter from "./routes/aiPortfolio.js";
import blogRouter from "./routes/blog.js";
import "./jobs/priceUpdater.js";
import "./jobs/alertsChecker.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));
app.use(compression());

// CORS — only allow known origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://vinoinvest-platform.vercel.app",
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Global rate limit: 200 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
}));

// Stricter limit for AI endpoints (Claude API has costs)
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "AI score rate limit exceeded." },
});

// Cache-Control middleware for read-only endpoints
function cacheFor(seconds) {
  return (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`);
    next();
  };
}

// Stripe webhook needs raw body — must be registered before express.json()
app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/payments", paymentsRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/auth", authRouter);
app.use("/api/ai-score", aiRateLimit, aiScoreRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/rates", cacheFor(300), ratesRouter);
app.use("/api/news", cacheFor(1800), newsRouter);
app.use("/api/ai", aiRateLimit, aiMarketRouter);
app.use("/api/ai", aiRateLimit, aiPortfolioRouter);
app.use("/api/blog", cacheFor(3600), blogRouter);

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

const bigWines =
  JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "data", "bigWines.json"),
      "utf-8"
    )
  );

const allWines = [
  ...wines,
  ...externalWines,
  ...bigWines
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

const { Pool } = pg;

const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}) : null;

async function initDB() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT PRIMARY KEY,
        wine_id TEXT,
        quantity INTEGER,
        purchase_price NUMERIC,
        current_market_price NUMERIC,
        purchase_date TEXT,
        created_at TEXT
      )
    `);
    // Performance indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_wine ON orders(wine_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_price_history_wine ON price_history(wine_id, recorded_at DESC) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='price_history')`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_scores_expires ON ai_scores(expires_at) WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ai_scores')`).catch(() => {});
  } catch (e) {
    console.warn("[initDB]", e.message);
  }
}
initDB();

async function getOrders() {
  if (!pool) return [];
  try {
    const r = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return r.rows.map(row => {
      const w = allWines.find(x => x.id === row.wine_id);
      return {
        id: row.id,
        wineId: row.wine_id,
        wine_id: row.wine_id,
        wineName: w?.name || row.wine_id,
        quantity: row.quantity,
        purchasePrice: Number(row.purchase_price),
        currentMarketPrice: Number(row.current_market_price),
        purchaseDate: row.purchase_date,
        createdAt: row.created_at
      };
    });
  } catch(e) { console.error(e); return []; }
}

async function saveOrder(order) {
  if (!pool) return;
  try {
    await pool.query(
      "INSERT INTO orders (id, wine_id, quantity, purchase_price, current_market_price, purchase_date, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING",
      [order.id, order.wineId, order.quantity, order.purchasePrice, order.currentMarketPrice || 0, order.purchaseDate, order.createdAt]
    );
  } catch(e) { console.error(e); }
}

// In-memory cache — populated from DB on first GET and after each POST
let orders = [];
let ordersLoaded = false;

async function loadOrdersFromDB() {
  if (ordersLoaded) return;
  orders = await getOrders();
  ordersLoaded = true;
}

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

// Health endpoint for keep-alive pings (Render free tier)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: Date.now() });
});

app.get("/", (req, res) => {

  res.json({

    status: "online",

    service:
      "vinoinvest-backend"

  });

});

app.get("/api/market/wines", cacheFor(300), (req, res) => {
  res.json([...wines, ...externalWines]);
});

app.get("/api/wines", cacheFor(120), (req, res) => {
  const search = (req.query.search || "").toString().trim();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));

  let filtered;
  if (search) {
    const q = normalize(search);
    filtered = allWines.filter(w =>
      normalize(`${w.name} ${w.producer} ${w.region} ${w.country} ${w.vintage || ""}`).includes(q)
    );
  } else {
    filtered = allWines;
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const slice = filtered.slice(offset, offset + limit);

  res.json({
    results: slice,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: offset + slice.length < total,
  });
});

// POST /api/wines — B2B wine management (adds to in-memory bigWines only in this process)
app.post("/api/wines", (req, res) => {
  const { name, producer, vintage, region, current_price, type } = req.body;
  if (!name || !current_price) return res.status(400).json({ error: "name and current_price required" });
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") + (vintage ? `-${vintage}` : "");
  const wine = { id, name, producer: producer || "", vintage: vintage || null, region: region || "", current_price: Number(current_price), investment_score: 70, risk: "Medio", market_trend: "Stable", type: type || "Rosso" };
  bigWines.push(wine);
  allWines.push(wine);
  res.status(201).json({ success: true, wine });
});

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

            },

            platforms: [
              {
                name: "Vivino",
                logo: "🍇",
                price: Math.round(wine.currentPrice * 1.05),
                url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wine.name)}`
              },
              {
                name: "Wine-Searcher",
                logo: "🔍",
                price: Math.round(wine.currentPrice * 0.98),
                url: `https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}`
              },
              {
                name: "Millesima",
                logo: "🍾",
                price: Math.round(wine.currentPrice * 1.02),
                url: `https://www.millesima.com/recherche.html?q=${encodeURIComponent(wine.name)}`
              }
            ]

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

app.get("/api/orders", async (req, res) => {
  await loadOrdersFromDB();
  res.json(orders);
});

app.post(
  "/api/orders",
  async (req, res) => {

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
  wineName: wine.name,
  quantity: Number(req.body.quantity) || 1,
  purchasePrice,
  currentMarketPrice,
  purchaseDate: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

orders.push(order);
  await saveOrder(order);

res.json({
  success: true,
  order
});

  }
);

// ── Trending: top 5 wines by simulated 24h price change ─────────────────────
app.get("/api/trending", (req, res) => {
  const seed = Math.floor(Date.now() / (1000 * 3600 * 4)); // changes every 4h
  const seededRandom = (wineId, offset = 0) => {
    const x = Math.sin(seed + wineId.charCodeAt(0) + offset) * 10000;
    return x - Math.floor(x);
  };
  const trending = allWines
    .filter(w => w.currentPrice > 0)
    .map(w => {
      const r = seededRandom(w.id || w.name || "x");
      const change = ((r - 0.42) * 18).toFixed(2);
      return { ...w, change: Number(change), absChange: Math.abs(Number(change)) };
    })
    .sort((a, b) => b.absChange - a.absChange)
    .slice(0, 5)
    .map(({ absChange: _, ...w }) => w);
  res.json({ wines: trending, updated: new Date().toISOString() });
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});