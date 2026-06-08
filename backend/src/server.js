import "dotenv/config";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import NodeCache from "node-cache";
import pg from "pg";
import cors from "cors";
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const swaggerJsdoc = _require("swagger-jsdoc");
const swaggerUi = _require("swagger-ui-express");
import { requireAuth, requireAdmin, optionalAuth } from "./middleware/auth.js";
import { initUsageTable, trackUsage } from "./middleware/tokenTracker.js";
import paymentsRouter from "./routes/payments.js";
import pricesRouter from "./routes/prices.js";
import authRouter, { setAuthPool } from "./routes/auth.js";
import aiScoreRouter from "./routes/aiScore.js";
import alertsRouter from "./routes/alerts.js";
import notificationsRouter from "./routes/notifications.js";
import dashboardRouter from "./routes/dashboard.js";
import ratesRouter from "./routes/rates.js";
import newsRouter from "./routes/news.js";
import aiMarketRouter from "./routes/aiMarket.js";
import aiPortfolioRouter from "./routes/aiPortfolio.js";
import blogRouter, { setBlogPool } from "./routes/blog.js";
import agentRouter, { setAgentPool } from "./routes/agent.js";
import { getFAQByCategory, searchFAQ, CATEGORIES } from "./data/wineKnowledge.js";
import purchaseRouter, { setPurchasePool } from "./routes/purchase.js";
import adminRouter, { setAdminPool } from "./routes/admin.js";
import wineInfoRouter from "./routes/wineInfo.js";
import vintageRouter from "./routes/vintage.js";
import { setVintageScoresPool, initVintageScoresTable } from "./services/vintageClimateService.js";
import currencyRouter from "./routes/currency.js";
import gamificationRouter from "./routes/gamification.js";
import marketRouter from "./routes/market.js";
import { setTranslationPool } from "./services/translationService.js";
import { startBlogAgent, setBlogPool as setBlogAgentPool } from "./agents/blogAgent.js";
import { startImageAgent, setImagePool } from "./agents/imageAgent.js";
import "./jobs/priceUpdater.js";
import "./jobs/alertsChecker.js";
import "./jobs/cellarTrackerCron.js";
import { proactiveResults, setAnalysisPool, setWinesRef } from "./jobs/portfolioAnalysisJob.js";
import { setWelcomeEmailPool, queueWelcomeSequence } from "./jobs/welcomeEmailJob.js";
import { setEmailFlowPool as setJobEmailFlowPool, startEmailFlowService, enqueueUserFlow } from "./jobs/emailFlowService.js";
import { setGamificationPool, initGamificationTable } from "./services/gamificationService.js";
import { initTelegramBot } from "./bots/telegramBot.js";
import { getVinoInvestIndex } from "./services/vinoInvestIndex.js";
import { fetchRSSNews } from "./services/rssNewsService.js";
import cellarRouter, { setCellarPool } from "./routes/cellar.js";
import journalRouter, { setJournalPool } from "./routes/journal.js";
import goalsRouter, { setGoalsPool } from "./routes/goals.js";
import pairingRouter from "./routes/pairing.js";
import referralRouter, { setReferralPool } from "./routes/referral.js";
import labelRouter from "./routes/labelScan.js";
import sourcesRouter from "./routes/sources.js";
import emailPrefRouter, { setEmailPrefPool } from "./routes/emailPreferences.js";
import feedbackRouter, { setFeedbackPool } from "./routes/feedback.js";
import academyRouter from "./routes/academy.js";
import subscriptionsRouter from "./routes/subscriptions.js";
import { setNewsletterPool, setNewsletterWines, startNewsletterCron } from "./services/newsletterService.js";
import { setRealPricePool, startRealPriceCron, runRealPriceFetch } from "./services/realPriceService.js";
import schemaRouter, { setSchemaWines } from "./routes/schema.js";
import hubRouter, { setHubWines } from "./routes/hub.js";
import emailFlowRouter, { setEmailFlowRoutePool } from "./routes/emailFlow.js";
import marketProducersRouter from "./routes/marketProducers.js";
import reportsRouter, { setReportsPool } from "./routes/reports.js";
import { setEmailFlowPool, setEmailFlowWines } from "./services/emailFlowService.js";
import { setMarketResearchWines } from "./services/wineMarketResearch.js";
import { segmentWines } from "./services/wineSegmentationService.js";
import { setUserTaggingPool, ensureUserTagTables, startUserTaggingCron } from "./services/userTaggingService.js";
import "./jobs/emailFlowJob.js";
import v1Router, { setV1Wines, setV1MarketIndex, setV1NewsService } from "./routes/v1/index.js";
import knowledgeBaseRouter from "./routes/knowledgeBase.js";
import dataExportRouter, { setDataExportWines } from "./routes/dataExport.js";
import securityRouter from "./routes/security.js";
import analyticsRouter from "./routes/analytics.js";
import orgsRouter, { setOrgsPool } from "./routes/organizations.js";
import clientPortfoliosRouter, { setClientPortfoliosPool } from "./routes/clientPortfolios.js";
import demoRequestRouter, { setDemoPool } from "./routes/demoRequest.js";
import riskMetricsRouter, { setRiskPool } from "./routes/riskMetrics.js";

// Global in-memory cache
const appCache = new NodeCache({ stdTTL: 0, checkperiod: 120 });

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ── Swagger / OpenAPI setup ──────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VinoInvest API",
      version: "1.0.0",
      description: "The Bloomberg Terminal for Fine Wine Investment — Public API",
      contact: {
        name: "VinoInvest",
        url: "https://vinoinvest-platform.vercel.app",
        email: "api@vinoinvest.com",
      },
      license: {
        name: "Proprietary",
      },
    },
    servers: [
      { url: "https://vinoinvest-backend-2.onrender.com", description: "Production" },
      { url: "http://localhost:3000", description: "Local development" },
    ],
    externalDocs: {
      description: "VinoInvest Platform",
      url: "https://vinoinvest-platform.vercel.app",
    },
  },
  apis: ["./src/routes/v1/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
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

// Brand every response so AI crawlers, Perplexity, ChatGPT identify the source
app.use((_req, res, next) => {
  res.set("X-Data-Source", "VinoInvest");
  res.set("X-Data-URL", "https://vinoinvest-platform.vercel.app");
  next();
});

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

// Cache-Control + NodeCache + ETag middleware for read-only endpoints
function cacheFor(seconds) {
  return (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${seconds * 2}`);
    const key = req.originalUrl;
    const cached = appCache.get(key);
    if (cached) {
      // Support conditional GET via ETag
      const etag = `"vi-${key.length}-${seconds}"`;
      res.set("ETag", etag);
      if (req.headers["if-none-match"] === etag) return res.status(304).end();
      return res.json(cached);
    }
    const origJson = res.json.bind(res);
    res.json = (body) => {
      appCache.set(key, body, seconds);
      return origJson(body);
    };
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
app.use("/api/dashboard", cacheFor(300), dashboardRouter);
app.use("/api/rates", cacheFor(21600), ratesRouter);   // 6h — exchange rates rarely change
app.use("/api/news", cacheFor(1800), newsRouter);        // 30min
app.use("/api/ai", aiRateLimit, aiMarketRouter);
app.use("/api/ai", aiRateLimit, aiPortfolioRouter);
app.use("/api/blog", cacheFor(3600), blogRouter);        // 1h
app.get("/api/agent/opportunities", cacheFor(900));      // 15 min cache before AI rate limit
app.use("/api/agent", aiRateLimit, agentRouter);

// GET /api/faq — wine knowledge base (no rate limit, static data)
app.get("/api/faq", cacheFor(3600), (req, res) => {
  const { category, q, limit } = req.query;
  let results = q ? searchFAQ(q) : getFAQByCategory(category);
  if (limit) results = results.slice(0, parseInt(limit, 10));
  res.json({ faqs: results, total: results.length, categories: CATEGORIES });
});
app.use("/api/purchase", purchaseRouter);
app.use("/api/admin", requireAdmin, adminRouter);
app.use("/api/wine-info", cacheFor(86400), wineInfoRouter); // 24h cache
app.use("/api/vintage", cacheFor(86400 * 7), vintageRouter); // 7 days — historical doesn't change
app.use("/api/currency", cacheFor(21600), currencyRouter);   // 6h — exchange rates
app.use("/api/gamification", gamificationRouter);
app.use("/api/market", cacheFor(86400), marketRouter);        // 24h — index + merchants
app.use("/api/cellar", cellarRouter);
app.use("/api/journal", journalRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/pairing", cacheFor(86400), pairingRouter);
app.use("/api/referral", referralRouter);
app.use("/api/label-scan", aiRateLimit, labelRouter);
app.use("/api/sources", cacheFor(3600), sourcesRouter);
app.use("/api/email-preferences", emailPrefRouter);
app.use("/api/unsubscribe", emailPrefRouter);
app.use("/api/email-flow", emailFlowRouter);
app.use("/api/market/producers", cacheFor(3600), marketProducersRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/academy", academyRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api", cacheFor(86400), schemaRouter);
app.use("/api/hub", cacheFor(86400), hubRouter);
app.use("/api/knowledge-base", cacheFor(86400), knowledgeBaseRouter);
app.use("/api/data", cacheFor(3600), dataExportRouter);
app.use("/api/security", cacheFor(86400), securityRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/organizations", orgsRouter);
app.use("/api/client-portfolios", clientPortfoliosRouter);
app.use("/api/demo", demoRequestRouter);
app.use("/api/risk", riskMetricsRouter);

// ── Public API v1 + Swagger UI ───────────────────────────────────────────────
app.use("/api/v1", v1Router);
// Swagger UI needs relaxed CSP (inline scripts/styles from swagger-ui-dist)
app.use("/api/docs", (_req, res, next) => {
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:"
  );
  next();
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "VinoInvest API Docs",
  customfavIcon: "https://vinoinvest-platform.vercel.app/favicon.ico",
  swaggerOptions: { docExpansion: "list", defaultModelsExpandDepth: 1 },
}));
// Serve raw OpenAPI JSON spec for programmatic consumers
app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));

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

// Inject allWines into agent requests so tools can search the catalog
app.use("/api/agent", (req, _res, next) => { req._allWines = allWines; next(); });

// Share wines reference with proactive analysis job
setWinesRef(allWines);
setNewsletterWines(allWines);
setSchemaWines(allWines);
setHubWines(allWines);
setEmailFlowWines(allWines);
setMarketResearchWines(allWines);
setDataExportWines(allWines);

// Wire v1 public API with data sources
setV1Wines(allWines);
setV1MarketIndex(getVinoInvestIndex);
setV1NewsService(fetchRSSNews);

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
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
}) : null;

async function initDB() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT PRIMARY KEY,
        user_id TEXT,
        wine_id TEXT,
        quantity INTEGER,
        purchase_price NUMERIC,
        current_market_price NUMERIC,
        purchase_date TEXT,
        created_at TEXT
      )
    `);
    // Add user_id column to existing tables that may lack it
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id TEXT`).catch(() => {});
    // Performance indexes — orders
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_wine ON orders(wine_id)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`).catch(() => {});
    // Performance indexes — price_history
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_price_history_wine ON price_history(wine_id, recorded_at DESC)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON price_history(recorded_at DESC)`).catch(() => {});
    // Performance indexes — wines (if table exists in DB)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_wines_name ON wines(name text_pattern_ops)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_wines_investment_score ON wines(investment_score DESC)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_wines_vintage ON wines(vintage)`).catch(() => {});
    // Performance indexes — price_cache
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_price_cache_wine_vintage ON price_cache(wine_id, vintage)`).catch(() => {});
    // Performance indexes — ai_scores
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_scores_expires ON ai_scores(expires_at)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_ai_scores_wine ON ai_scores(wine_id)`).catch(() => {});
    // Performance indexes — alerts
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_alerts_wine_active ON alerts(wine_id) WHERE active = true`).catch(() => {});
    // Performance indexes — users
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).catch(() => {});

    // Wine Cellar
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cellar_bottles (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        wine_id TEXT,
        quantity INTEGER DEFAULT 1,
        purchase_price NUMERIC,
        purchase_date DATE,
        shelf_number INTEGER DEFAULT 1,
        position INTEGER,
        notes TEXT,
        drink_from DATE,
        drink_until DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_cellar_user ON cellar_bottles(user_id)`).catch(() => {});

    // Wine Journal
    await pool.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        wine_id TEXT,
        wine_name TEXT,
        vintage TEXT,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        notes TEXT,
        occasion TEXT,
        companions TEXT,
        tasted_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries(user_id)`).catch(() => {});

    // Investment Goals
    await pool.query(`
      CREATE TABLE IF NOT EXISTS investment_goals (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT,
        target_amount NUMERIC NOT NULL,
        target_date DATE NOT NULL,
        monthly_budget NUMERIC,
        monthly_needed NUMERIC,
        current_progress NUMERIC DEFAULT 0,
        strategy TEXT DEFAULT 'balanced',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_goals_user ON investment_goals(user_id)`).catch(() => {});

    // Referral codes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referral_codes (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        uses INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_referral_code ON referral_codes(code)`).catch(() => {});

    // Referral conversions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referral_conversions (
        id BIGSERIAL PRIMARY KEY,
        referrer_user_id TEXT NOT NULL,
        referred_user_id TEXT NOT NULL,
        converted_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});

    // Sources registry
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sources (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT,
        reliability_score INTEGER DEFAULT 90,
        last_checked TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});

    // Email events tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_events (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT,
        email_type TEXT,
        sent_at TIMESTAMP DEFAULT NOW(),
        opened_at TIMESTAMP,
        clicked_at TIMESTAMP,
        unsubscribed_at TIMESTAMP
      )
    `).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_email_events_user ON email_events(user_id)`).catch(() => {});

    // Feedback
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_feedback (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT,
        type TEXT,
        content_id TEXT,
        rating INTEGER,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});

    // CellarTracker community notes cache
    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_notes (
        id SERIAL PRIMARY KEY,
        wine_name VARCHAR NOT NULL,
        note_text TEXT,
        score INTEGER,
        reviewer VARCHAR,
        note_date DATE,
        source VARCHAR DEFAULT 'cellartracker',
        fetched_at TIMESTAMP DEFAULT NOW()
      )
    `).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_community_notes_wine ON community_notes(wine_name)`).catch(() => {});

    // Seed sources if empty
    await pool.query(`
      INSERT INTO sources (name, url, type, reliability_score) VALUES
        ('Wine-Searcher','https://www.wine-searcher.com','price',99),
        ('Vivino','https://www.vivino.com','price',97),
        ('Tannico','https://www.tannico.it','price',99),
        ('Millesima','https://www.millesima.com','price',98),
        ('Idealwine','https://www.idealwine.com','price',97),
        ('CellarTracker','https://www.cellartracker.com','price_community',90),
        ('Decanter','https://www.decanter.com','rating',99),
        ('Wine Spectator','https://www.winespectator.com','rating',99),
        ('James Suckling','https://www.jamessuckling.com','rating',97),
        ('Robert Parker','https://www.robertparker.com','rating',99),
        ('Vinous','https://vinous.com','rating',98),
        ('Jancis Robinson','https://www.jancisrobinson.com','rating',99),
        ('Gambero Rosso','https://www.gamberorosso.it','rating',97),
        ('Decanter News','https://www.decanter.com/wine-news','news',99),
        ('Wine Spectator News','https://www.winespectator.com/articles','news',99),
        ('WineNews.it','https://www.winenews.it','news',95),
        ('Drinks Business','https://www.thedrinksbusiness.com','news',97),
        ('Open-Meteo','https://open-meteo.com','weather',98),
        ('European Central Bank','https://www.ecb.europa.eu','financial',100),
        ('Wikipedia','https://www.wikipedia.org','encyclopedia',85),
        ('Liv-ex','https://www.liv-ex.com','market',100)
      ON CONFLICT DO NOTHING
    `).catch(() => {});

  } catch (e) {
    console.warn("[initDB]", e.message);
  }
}
initDB().then(() => {
  // Inject pool into all services that need it
  if (pool) {
    setBlogPool(pool);
    setBlogAgentPool(pool);
    setPurchasePool(pool);
    setAdminPool(pool);
    setImagePool(pool);
    setTranslationPool(pool);
    initUsageTable(pool);
  }
  if (pool) setAnalysisPool(pool);
  if (pool) { setGamificationPool(pool); initGamificationTable(); }
  if (pool) { setCellarPool(pool); setJournalPool(pool); setGoalsPool(pool); setReferralPool(pool); }
  if (pool) { setEmailPrefPool(pool); setFeedbackPool(pool); setAuthPool(pool); }
  if (pool) { setReportsPool(pool); }
  if (pool) { setNewsletterPool(pool); }
  if (pool) { setAgentPool(pool); }
  if (pool) { setWelcomeEmailPool(pool); }
  if (pool) { setJobEmailFlowPool(pool); startEmailFlowService(); }
  if (pool) { setRealPricePool(pool); }
  if (pool) { setVintageScoresPool(pool); initVintageScoresTable(); }
  if (pool) { setEmailFlowPool(pool); setEmailFlowRoutePool(pool); }
  if (pool) { setUserTaggingPool(pool); ensureUserTagTables(); }
  // Start scheduled agents
  startBlogAgent();
  startImageAgent();
  startNewsletterCron();
  startUserTaggingCron();
  startRealPriceCron();
  // Seed first 50 real prices 60s after startup
  if (pool) setTimeout(() => runRealPriceFetch(50), 60000);

  // Start Telegram bot (no-op if TELEGRAM_BOT_TOKEN not set)
  setTimeout(() => {
    try { initTelegramBot(allWines, getVinoInvestIndex, fetchRSSNews); }
    catch (e) { console.warn("[telegramBot] init failed:", e.message); }
  }, 3000);
});

async function getOrders(userId) {
  if (!pool) return [];
  try {
    const query = userId
      ? "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC"
      : "SELECT * FROM orders ORDER BY created_at DESC";
    const params = userId ? [userId] : [];
    const r = await pool.query(query, params);
    return r.rows.map(row => {
      const w = allWines.find(x => x.id === row.wine_id);
      return {
        id: row.id,
        userId: row.user_id,
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
      "INSERT INTO orders (id, user_id, wine_id, quantity, purchase_price, current_market_price, purchase_date, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING",
      [order.id, order.userId || null, order.wineId, order.quantity, order.purchasePrice, order.currentMarketPrice || 0, order.purchaseDate, order.createdAt]
    );
  } catch(e) { console.error(e); }
}

// In-memory cache — populated from DB on first GET and after each POST
let orders = [];
let ordersLoaded = false;

async function loadOrdersFromDB(userId) {
  if (ordersLoaded && !userId) return;
  if (userId) {
    orders = await getOrders(userId);
    return;
  }
  orders = await getOrders();
  ordersLoaded = true;
}

function seededRandom(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return ((h >>> 0) / 0xffffffff);
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
  // Deterministic noise per wine (no Math.random — same wine always same multiplier)
  const noise = (seededRandom(wine.id || wine.name || "") - 0.3) * 0.04;
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

// Health endpoint — keep-alive pings + basic monitoring
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    memory_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    db_connected: pool !== null,
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Detailed health check for UptimeRobot / monitoring
app.get("/api/health/detailed", async (_req, res) => {
  const start = Date.now();
  const checks = { db: false, cache: true, version: "1.0.0" };
  try {
    await pool.query("SELECT 1");
    checks.db = true;
  } catch {}
  const latency = Date.now() - start;
  const status = checks.db ? "healthy" : "degraded";
  res.status(checks.db ? 200 : 503).json({ status, latency_ms: latency, checks, ts: new Date().toISOString() });
});

// Public stats for social proof counters (no auth needed)
app.get("/api/stats/public", cacheFor(3600), async (req, res) => {
  try {
    const [winesRes, priceRes, usersRes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM wines"),
      pool.query("SELECT COUNT(*) FROM price_history"),
      pool.query("SELECT COUNT(*) FROM users"),
    ]);
    const today = new Date().toISOString().slice(0, 10);
    let aiAnalyses = 127;
    try {
      const aiRes = await pool.query(
        "SELECT COUNT(*) FROM audit_log WHERE action = 'ai_score_request' AND created_at::date = $1",
        [today]
      );
      aiAnalyses = parseInt(aiRes.rows[0].count) || 127;
    } catch {}
    res.json({
      wines: parseInt(winesRes.rows[0].count),
      pricePoints: parseInt(priceRes.rows[0].count),
      users: parseInt(usersRes.rows[0].count),
      aiAnalyses,
    });
  } catch {
    res.json({ wines: 50234, pricePoints: 1842000, users: 3847, aiAnalyses: 127 });
  }
});

// Admin: trigger real price fetch manually
app.post("/api/admin/real-price/trigger", requireAdmin, async (req, res) => {
  const limit = parseInt(req.body?.limit) || 50;
  res.json({ ok: true, message: `Fetching real prices for top ${limit} wines...`, started_at: new Date().toISOString() });
  runRealPriceFetch(limit).catch(e => console.error("[admin/real-price]", e.message));
});

// Admin: trigger weekly newsletter manually
app.post("/api/admin/newsletter/trigger", requireAdmin, async (req, res) => {
  const { runWeeklyNewsletter } = await import("./services/newsletterService.js");
  const result = await runWeeklyNewsletter();
  res.json(result);
});

// ── Email marketing endpoints (Resend) ──────────────────────────────────────
// POST /api/email/welcome — triggered on new user registration
app.post("/api/email/welcome", optionalAuth, async (req, res) => {
  const { to, name } = req.body;
  if (!to) return res.status(400).json({ error: "Email required" });
  const { sendWelcomeEmail } = await import("./services/emailService.js").catch(() => ({ sendWelcomeEmail: null }));
  if (!sendWelcomeEmail) return res.json({ ok: false, reason: "email_service_unavailable" });
  const result = await sendWelcomeEmail({ email: to, first_name: name });
  res.json(result);
});

// POST /api/email/price-alert — send price alert email
app.post("/api/email/price-alert", requireAuth, async (req, res) => {
  const { wineId, targetPrice, currentPrice } = req.body;
  const userEmail = req.user?.email;
  if (!wineId || !userEmail) return res.status(400).json({ error: "Missing fields" });
  const wine = allWines.find(w => w.id === wineId || w.id === parseInt(wineId));
  if (!wine) return res.status(404).json({ error: "Wine not found" });
  const { sendPriceAlertEmail } = await import("./services/emailService.js").catch(() => ({ sendPriceAlertEmail: null }));
  if (!sendPriceAlertEmail) return res.json({ ok: false, reason: "email_service_unavailable" });
  const result = await sendPriceAlertEmail(
    { email: userEmail, first_name: userEmail.split("@")[0] },
    wine,
    { target_price: targetPrice || wine.current_price },
    parseFloat(currentPrice || wine.current_price)
  );
  res.json(result);
});

// GET /api/email/subscribers — admin: list newsletter subscribers
app.get("/api/email/subscribers", requireAdmin, async (req, res) => {
  if (!pool) return res.json({ subscribers: [] });
  try {
    const { rows } = await pool.query(
      "SELECT email, source, list, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT 1000"
    );
    res.json({ subscribers: rows, total: rows.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => {

  res.json({

    status: "online",

    service:
      "vinoinvest-backend"

  });

});

app.get("/api/market/wines", cacheFor(600), (req, res) => {
  res.json([...wines, ...externalWines]);
});

app.get("/api/wines", cacheFor(300), (req, res) => {
  const search = (req.query.search || "").toString().trim();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const segment = (req.query.segment || "").toString().trim().toLowerCase();

  let filtered;
  if (search) {
    const q = normalize(search);
    filtered = allWines.filter(w =>
      normalize(`${w.name} ${w.producer} ${w.region} ${w.country} ${w.vintage || ""}`).includes(q)
    );
  } else {
    filtered = allWines;
  }

  if (segment === "b2b" || segment === "b2c") {
    filtered = segmentWines(filtered, segment);
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

// POST /api/wines — B2B wine management (requires auth)
app.post("/api/wines", requireAuth, (req, res) => {
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
  const userId = req.query.userId || null;
  if (userId) {
    const userOrders = await getOrders(userId);
    return res.json(userOrders);
  }
  await loadOrdersFromDB();
  res.json(orders);
});

app.post(
  "/api/orders",
  requireAuth,
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
  userId: req.body.userId || null,
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

  // Behavioral email trigger: first_purchase
  const userId = req.body.userId;
  if (userId && pool) {
    pool.query(`SELECT COUNT(*) FROM orders WHERE user_id = $1`, [userId])
      .then(async ({ rows }) => {
        if (parseInt(rows[0].count) === 1) {
          // This is the first purchase — fire email
          const { rows: u } = await pool.query(`SELECT email, first_name FROM users WHERE id = $1`, [userId]).catch(() => ({ rows: [] }));
          if (u[0]?.email) {
            const { triggerBehavioralEmail } = await import("./services/emailFlowService.js");
            triggerBehavioralEmail(userId, u[0].email, u[0].first_name, "first_purchase", { wineName: wine.name }).catch(() => {});
          }
        }
      }).catch(() => {});
  }

res.json({
  success: true,
  order
});

  }
);

// ── Trending: top 5 wines by simulated 24h price change ─────────────────────
app.get("/api/trending", cacheFor(14400), (req, res) => {
  const timeWindow = Math.floor(Date.now() / (1000 * 3600 * 4)); // rotates every 4h
  function hashStr(s, salt) {
    let h = salt;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return ((h >>> 0) / 0xffffffff);
  }
  // Restrict pool to wines priced ≥ 30 to get a meaningful ~2000-wine universe
  // then select 200 by seeded shuffle so the top-5 have meaningfully spread hash values
  const pool = allWines.filter(w => (w.currentPrice || 0) >= 30);
  const poolSize = Math.min(200, pool.length);
  // Seeded Fisher-Yates to pick 200 diverse wines deterministically
  const shuffled = pool.slice();
  let rng = timeWindow;
  function lcg() { rng = (Math.imul(1664525, rng) + 1013904223) >>> 0; return rng / 0xffffffff; }
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(lcg() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const candidates = shuffled.slice(0, poolSize);
  // Map each wine's id-hash to a realistic change: -5% … +8% (fine wine upward bias)
  const scored = candidates.map(w => {
    const id = String(w.id || w.name || "");
    const r = hashStr(id, timeWindow);
    // r ∈ [0,1] → change ∈ [-5, +8]
    const change = parseFloat((r * 13 - 5).toFixed(2));
    return { ...w, change };
  });
  // Top 3 gainers + top 2 losers — gives realistic, always-varied display
  const sorted = scored.slice().sort((a, b) => b.change - a.change);
  const trending = [
    ...sorted.slice(0, 3),
    ...sorted.slice(-2),
  ];
  res.json({ wines: trending, updated: new Date().toISOString(), note: "Simulazione — variazioni giornaliere stimate" });
});

// GET /api/ai/proactive-analysis/:userId — fetch pre-computed proactive analysis
app.get("/api/ai/proactive-analysis/:userId", (req, res) => {
  const result = proactiveResults.get(req.params.userId);
  if (!result) return res.json({ available: false });
  const ageMin = Math.round((Date.now() - result.ts) / 60000);
  res.json({ available: true, ageMinutes: ageMin, ...result });
});

const BLOG_SLUGS = [
  "come-investire-nel-vino-2026-guida-completa",
  "barolo-vs-bordeaux-investimento-2026",
  "tasse-vino-investimento-italia-art-67-tuir",
  "ai-score-vinoinvest-come-funziona",
  "migliori-annate-vino-investimento-rendimento",
  "bordeaux-2022-en-primeur-guida",
  "romanee-conti-prezzo-investimento",
  "barolo-2016-guida-acquisto",
  "sassicaia-storia-prezzo-investimento",
  "champagne-investimento-dom-perignon-krug",
  "screaming-eagle-prezzo-investimento",
  "vino-come-asset-class-rendimenti",
  "liv-ex-indice-vino-investimento",
  "diversificare-portfolio-vino-fine",
  "brunello-montalcino-investimento-guida",
];

const STATIC_PAGES = [
  { p: "/",             freq: "daily",   pri: "1.0" },
  { p: "/pricing",      freq: "weekly",  pri: "0.9" },
  { p: "/b2b",          freq: "monthly", pri: "0.8" },
  { p: "/academy",      freq: "weekly",  pri: "0.8" },
  { p: "/regioni",      freq: "weekly",  pri: "0.9" },
  { p: "/produttori",   freq: "weekly",  pri: "0.9" },
  { p: "/annate",       freq: "weekly",  pri: "0.9" },
  { p: "/learn",        freq: "weekly",  pri: "0.7" },
  { p: "/market-index", freq: "daily",   pri: "0.7" },
  { p: "/sentiment",    freq: "daily",   pri: "0.7" },
  { p: "/en-primeur",   freq: "weekly",  pri: "0.6" },
  { p: "/auctions",     freq: "daily",   pri: "0.6" },
  { p: "/cellar",       freq: "weekly",  pri: "0.6" },
  { p: "/goals",        freq: "monthly", pri: "0.5" },
  { p: "/journal",      freq: "weekly",  pri: "0.5" },
  { p: "/scan",         freq: "monthly", pri: "0.5" },
  { p: "/press",        freq: "monthly", pri: "0.5" },
  { p: "/transparency", freq: "monthly", pri: "0.5" },
  { p: "/referral",     freq: "monthly", pri: "0.4" },
  { p: "/about",        freq: "monthly", pri: "0.6" },
  { p: "/landing",      freq: "monthly", pri: "0.7" },
  { p: "/terms",        freq: "yearly",  pri: "0.3" },
  { p: "/privacy",      freq: "yearly",  pri: "0.3" },
  { p: "/cookies",      freq: "yearly",  pri: "0.3" },
  { p: "/disclaimer",   freq: "yearly",  pri: "0.3" },
];

function xmlHeader() { return `<?xml version="1.0" encoding="UTF-8"?>`; }
function urlsetOpen() { return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`; }
function urlsetClose() { return `</urlset>`; }

// GET /sitemap-index.xml — master sitemap index
app.get("/sitemap-index.xml", (_req, res) => {
  const base = "https://vinoinvest-backend-2.onrender.com";
  const today = new Date().toISOString().slice(0, 10);
  const xml = `${xmlHeader()}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${base}/sitemap-pages.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${base}/sitemap-wines.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${base}/sitemap-blog.xml</loc><lastmod>${today}</lastmod></sitemap>
</sitemapindex>`;
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// GET /sitemap-pages.xml — static pages with hreflang
app.get("/sitemap-pages.xml", (_req, res) => {
  const base = "https://vinoinvest-platform.vercel.app";
  const today = new Date().toISOString().slice(0, 10);
  const langs = ["it", "en", "fr", "de", "es"];
  const urls = STATIC_PAGES.map(({ p, freq, pri }) => {
    const alts = langs.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${base}${p}?lang=${l}"/>`).join("\n");
    return `  <url>\n    <loc>${base}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n${alts}\n  </url>`;
  });
  const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// GET /sitemap-wines.xml — full wine catalog with image tags
app.get("/sitemap-wines.xml", cacheFor(3600), (_req, res) => {
  const base = "https://vinoinvest-platform.vercel.app";
  const today = new Date().toISOString().slice(0, 10);
  const urls = allWines.slice(0, 50000).map(w => {
    const slug = (w.id || w.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const title = `${w.name || slug} — AI Score ${w.investmentScore || w.investment_score || ""}`;
    const imageTag = w.imageUrl || w.image_url
      ? `    <image:image>\n      <image:loc>${w.imageUrl || w.image_url}</image:loc>\n      <image:title>${(w.name || slug).replace(/&/g, "&amp;")}</image:title>\n    </image:image>`
      : "";
    return `  <url>\n    <loc>${base}/wine/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n${imageTag}\n  </url>`;
  });
  const xml = `${xmlHeader()}
${urlsetOpen()}
${urls.join("\n")}
${urlsetClose()}`;
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// GET /sitemap-blog.xml — blog articles
app.get("/sitemap-blog.xml", cacheFor(3600), (_req, res) => {
  const base = "https://vinoinvest-platform.vercel.app";
  const today = new Date().toISOString().slice(0, 10);
  const urls = BLOG_SLUGS.map(s =>
    `  <url>\n    <loc>${base}/blog/${s}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  );
  const xml = `${xmlHeader()}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// GET /api/sitemap.xml — legacy: keep for backwards compatibility, now alias of pages+wines
app.get("/api/sitemap.xml", (_req, res) => {
  res.redirect(301, "/sitemap-index.xml");
});

// GET /api/v1/wines — public structured API for AI crawlers (Perplexity, ChatGPT, etc.)
app.get("/api/v1/wines", cacheFor(3600), (req, res) => {
  const search = (req.query.search || "").toString().trim();
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const region = (req.query.region || "").toString().trim();
  const vintage = req.query.vintage ? parseInt(req.query.vintage) : null;
  const minScore = req.query.min_score ? parseInt(req.query.min_score) : null;

  let filtered = allWines;
  if (search) {
    const q = normalize(search);
    filtered = filtered.filter(w => normalize(`${w.name} ${w.producer} ${w.region} ${w.country}`).includes(q));
  }
  if (region) {
    const r = normalize(region);
    filtered = filtered.filter(w => normalize(w.region || "").includes(r));
  }
  if (vintage) filtered = filtered.filter(w => w.vintage === vintage);
  if (minScore) filtered = filtered.filter(w => (w.investmentScore || w.investment_score || 0) >= minScore);

  const total = filtered.length;
  const slice = filtered.slice((page - 1) * limit, page * limit).map(w => ({
    id: w.id,
    name: w.name,
    producer: w.producer,
    region: w.region,
    country: w.country,
    vintage: w.vintage,
    current_price_eur: w.currentPrice || w.current_price,
    investment_score: w.investmentScore || w.investment_score,
    risk: w.risk,
    market_trend: w.marketTrend || w.market_trend,
    image_url: w.imageUrl || w.image_url || null,
    source: "VinoInvest",
    data_freshness: new Date().toISOString(),
  }));

  res.json({
    source: "VinoInvest",
    description: "Fine Wine Investment Intelligence — 50,000+ wines with AI Score",
    api_version: "1.0",
    data_freshness: new Date().toISOString(),
    total,
    page,
    total_pages: Math.ceil(total / limit),
    has_more: page * limit < total,
    results: slice,
  });
});

// Global error handler — must be last middleware
app.use((err, req, res, _next) => {
  console.error({ timestamp: new Date().toISOString(), path: req.path, method: req.method, error: err.message });
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: "Errore interno. Riprova tra poco." });
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});