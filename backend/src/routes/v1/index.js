import { Router } from "express";

// allWines, getVinoInvestIndex, fetchRSSNews are injected at server startup
let _allWines = [];
let _getVinoInvestIndex = null;
let _fetchRSSNews = null;

export function setV1Wines(wines) { _allWines = wines; }
export function setV1MarketIndex(fn) { _getVinoInvestIndex = fn; }
export function setV1NewsService(fn) { _fetchRSSNews = fn; }

const router = Router();

function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * @swagger
 * tags:
 *   - name: Wines
 *     description: Fine wine catalog — 50,000+ investment-grade wines with AI scoring
 *   - name: Prices
 *     description: Historical price data for individual wines
 *   - name: Market
 *     description: VinoInvest proprietary market index and analytics
 *   - name: News
 *     description: Latest fine wine investment news
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Wine:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: lafite-2018
 *         name:
 *           type: string
 *           example: Château Lafite Rothschild
 *         producer:
 *           type: string
 *           example: Château Lafite Rothschild
 *         region:
 *           type: string
 *           example: Pauillac, Bordeaux
 *         country:
 *           type: string
 *           example: France
 *         vintage:
 *           type: integer
 *           example: 2018
 *         current_price_eur:
 *           type: number
 *           format: float
 *           example: 828.00
 *         investment_score:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 96
 *         risk:
 *           type: string
 *           enum: [Basso, Medio, Alto]
 *           example: Basso
 *         market_trend:
 *           type: string
 *           enum: [Bullish, Stable, Bearish]
 *           example: Bullish
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: https://cdn.vinoinvest.com/wines/lafite-2018.jpg
 *         source:
 *           type: string
 *           example: VinoInvest
 *         data_freshness:
 *           type: string
 *           format: date-time
 *     PricePoint:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-06-01"
 *         price:
 *           type: number
 *           format: float
 *           example: 820.00
 *     MarketIndex:
 *       type: object
 *       properties:
 *         value:
 *           type: number
 *           format: float
 *           example: 1247.3
 *         change_pct:
 *           type: number
 *           format: float
 *           example: 2.4
 *         updated_at:
 *           type: string
 *           format: date-time
 *     NewsItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Liv-ex Fine Wine 100 Index Rises 2.3%
 *         description:
 *           type: string
 *         source:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Liv-ex
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         url:
 *           type: string
 *         category:
 *           type: string
 *           example: market
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Wine not found
 */

/**
 * @swagger
 * /api/v1/wines:
 *   get:
 *     summary: List fine wines
 *     description: >
 *       Returns a paginated list of investment-grade fine wines from the VinoInvest catalog
 *       (50,000+ wines). Supports full-text search and filtering by region, vintage, and
 *       minimum investment score.
 *     tags: [Wines]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search across name, producer, region, country
 *         example: Barolo
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region (partial match, accent-insensitive)
 *         example: Bordeaux
 *       - in: query
 *         name: vintage
 *         schema:
 *           type: integer
 *         description: Filter by exact vintage year
 *         example: 2018
 *       - in: query
 *         name: min_score
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *         description: Minimum investment score (0–100)
 *         example: 90
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of results per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number (1-based)
 *     responses:
 *       200:
 *         description: Paginated wine list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                   example: VinoInvest
 *                 description:
 *                   type: string
 *                 api_version:
 *                   type: string
 *                   example: "1.0"
 *                 data_freshness:
 *                   type: string
 *                   format: date-time
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 total_pages:
 *                   type: integer
 *                 has_more:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wine'
 */
router.get("/wines", (req, res) => {
  const search = (req.query.search || "").toString().trim();
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const region = (req.query.region || "").toString().trim();
  const vintage = req.query.vintage ? parseInt(req.query.vintage) : null;
  const minScore = req.query.min_score ? parseInt(req.query.min_score) : null;

  let filtered = _allWines;
  if (search) {
    const q = normalize(search);
    filtered = filtered.filter(w =>
      normalize(`${w.name} ${w.producer} ${w.region} ${w.country}`).includes(q)
    );
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

/**
 * @swagger
 * /api/v1/wines/{id}:
 *   get:
 *     summary: Get wine by ID
 *     description: Returns full details for a single wine identified by its slug ID.
 *     tags: [Wines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wine slug ID
 *         example: lafite-2018
 *     responses:
 *       200:
 *         description: Wine object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wine'
 *       404:
 *         description: Wine not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/wines/:id", (req, res) => {
  const id = req.params.id;
  const wine = _allWines.find(
    w => String(w.id) === id || normalize(w.name) === normalize(id)
  );
  if (!wine) return res.status(404).json({ error: "Wine not found" });
  res.json({
    id: wine.id,
    name: wine.name,
    producer: wine.producer,
    region: wine.region,
    country: wine.country,
    vintage: wine.vintage,
    current_price_eur: wine.currentPrice || wine.current_price,
    investment_score: wine.investmentScore || wine.investment_score,
    risk: wine.risk,
    market_trend: wine.marketTrend || wine.market_trend,
    image_url: wine.imageUrl || wine.image_url || null,
    source: "VinoInvest",
    data_freshness: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/v1/prices/{id}/history:
 *   get:
 *     summary: Get price history for a wine
 *     description: >
 *       Returns historical price data points for the specified wine.
 *       Proxies to the internal `/api/prices/:wineId/history` endpoint.
 *     tags: [Prices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wine slug ID
 *         example: lafite-2018
 *       - in: query
 *         name: currentPrice
 *         schema:
 *           type: number
 *         description: Override current price for history generation
 *         example: 850
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [1m, 3m, 6m, 1y, 3y, 5y, all]
 *           default: 1y
 *         description: Timeframe of history to return
 *     responses:
 *       200:
 *         description: Price history with growth metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wineId:
 *                   type: string
 *                 wine_name:
 *                   type: string
 *                 current_price_eur:
 *                   type: number
 *                 growth_pct:
 *                   type: number
 *                   description: Total growth percentage over the returned timeframe
 *                 points:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PricePoint'
 *                 source:
 *                   type: string
 *                   example: VinoInvest
 *       404:
 *         description: Wine not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/prices/:id/history", async (req, res) => {
  const { id } = req.params;
  const { currentPrice, timeframe } = req.query;

  // Forward to the internal prices router
  const qs = new URLSearchParams();
  if (currentPrice) qs.set("currentPrice", currentPrice);
  if (timeframe) qs.set("timeframe", timeframe);

  try {
    // Use the internal service directly to avoid HTTP round-trip
    const { getPriceHistory } = await import("../../services/priceService.js");
    const wine = _allWines.find(w => String(w.id) === id);
    if (!wine) return res.status(404).json({ error: "Wine not found" });

    const price = parseFloat(currentPrice) || wine.currentPrice || wine.current_price || 100;
    const history = await getPriceHistory(id, price, timeframe || "1y");

    res.json({
      wineId: id,
      wine_name: wine.name,
      current_price_eur: price,
      growth_pct: history.growth || null,
      points: history.points || history,
      source: "VinoInvest",
      data_freshness: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/v1/market/index:
 *   get:
 *     summary: VinoInvest Market Index
 *     description: >
 *       Returns the VinoInvest proprietary fine wine market index — the equivalent
 *       of Liv-ex 100 but powered by AI scoring across 50,000+ wines.
 *     tags: [Market]
 *     responses:
 *       200:
 *         description: Current market index value and composition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarketIndex'
 */
router.get("/market/index", (req, res) => {
  if (!_getVinoInvestIndex) {
    return res.status(503).json({ error: "Market index service unavailable" });
  }
  try {
    const index = _getVinoInvestIndex();
    res.json({ ...index, source: "VinoInvest", data_freshness: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Latest fine wine investment news
 *     description: >
 *       Returns the latest fine wine and investment news aggregated from top sources
 *       (Decanter, Wine Spectator, Liv-ex, Vinous, Financial Times, and more).
 *       Defaults to the 3 most recent items.
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *           minimum: 1
 *           maximum: 20
 *         description: Number of news items to return
 *     responses:
 *       200:
 *         description: Array of news items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                   example: VinoInvest
 *                 count:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NewsItem'
 */
router.get("/news", async (req, res) => {
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 3));
  try {
    let news = [];
    if (_fetchRSSNews) {
      news = await _fetchRSSNews();
    }
    const items = (Array.isArray(news) ? news : news?.articles || news?.items || []).slice(0, limit);
    res.json({
      source: "VinoInvest",
      count: items.length,
      items,
      data_freshness: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
