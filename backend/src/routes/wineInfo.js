import { Router } from "express";
import { fetchCellarTrackerPrice, fetchCellarTrackerNotes } from "../connectors/cellarTracker.js";
import { getWikiSummary, getWikidataWine, getECBInflation, getAuctionIndexData } from "../services/freeDataService.js";
import { getWineImage } from "../services/imageService.js";

const router = Router();

const offCache = new Map();
const ctCache = new Map();
const TTL_24H = 24 * 60 * 60 * 1000;

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

// Open Food Facts — free, no auth needed
async function fetchOFFImage(wineName) {
  const encoded = encodeURIComponent(wineName);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&json=1&fields=product_name,image_front_url&page_size=1`;
  const r = await fetch(url, {
    headers: { "User-Agent": "VinoInvest/1.0 (manumila88@gmail.com)" },
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error(`OFF ${r.status}`);
  const data = await r.json();
  const product = data.products?.[0];
  if (!product?.image_front_url) throw new Error("no image");
  return product.image_front_url;
}

// GET /api/wine-info/wiki?q=Château+Lafite+Rothschild
router.get("/wiki", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  if (!query || query.length < 2) return res.status(400).json({ error: "q required" });

  try {
    // Try full name, then producer-only (first 3 words), then single word
    const attempts = [query, query.split(" ").slice(0, 3).join(" "), query.split(" ")[0]];
    for (const attempt of attempts) {
      const data = await getWikiSummary(attempt);
      if (data?.extract) return res.json(data);
    }
    res.json({ title: query, extract: null, thumbnail: null, url: null, source: "not_found" });
  } catch (err) {
    res.json({ title: query, extract: null, source: "error", error: err.message });
  }
});

// GET /api/wine-info/image?q=Château+Lafite+Rothschild&id=123
router.get("/image", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  const id = req.query.id || null;
  if (!query) return res.status(400).json({ error: "q required" });

  const cacheKey = slugify(id ? `id_${id}` : query);
  const cached = offCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL_24H) {
    return res.json({ ...cached.data, cached: true });
  }

  // Try imageService (multi-source) first, then OFF directly
  try {
    const imgUrl = await getWineImage(id, query);
    if (imgUrl) {
      const result = { imageUrl: imgUrl, source: "multi" };
      offCache.set(cacheKey, { data: result, ts: Date.now() });
      return res.json(result);
    }
  } catch { /* fallthrough */ }

  try {
    const imageUrl = await fetchOFFImage(query);
    const result = { imageUrl, source: "openfoodfacts" };
    offCache.set(cacheKey, { data: result, ts: Date.now() });
    return res.json(result);
  } catch {
    return res.json({ imageUrl: null, source: "not_found" });
  }
});

// GET /api/wine-info/price?q=Château+Lafite+Rothschild&vintage=2018
router.get("/price", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  const vintage = req.query.vintage ? parseInt(req.query.vintage) : null;
  if (!query) return res.status(400).json({ error: "q required" });

  const cacheKey = slugify(`${query}_${vintage || "any"}`);
  const cached = ctCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL_24H) {
    return res.json({ ...cached.data, cached: true });
  }

  try {
    const data = await fetchCellarTrackerPrice(query, vintage);
    ctCache.set(cacheKey, { data, ts: Date.now() });
    return res.json(data);
  } catch (err) {
    return res.json({ price_avg: null, source: "cellartracker", error: err.message });
  }
});

// GET /api/wine-info/notes?q=Château+Lafite+Rothschild&vintage=2018
router.get("/notes", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  const vintage = req.query.vintage ? parseInt(req.query.vintage) : null;
  if (!query) return res.status(400).json({ error: "q required" });

  try {
    const data = await fetchCellarTrackerNotes(query, vintage);
    return res.json(data);
  } catch {
    return res.json({ notes: [], source: "cellartracker" });
  }
});

// GET /api/wine-info/wikidata?q=Barolo
router.get("/wikidata", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  if (!query) return res.status(400).json({ error: "q required" });

  const data = await getWikidataWine(query);
  res.json(data || { region: null, grape: null, country: null, inception: null, source: "not_found" });
});

// GET /api/wine-info/inflation — ECB Euro Area HICP
router.get("/inflation", async (_req, res) => {
  const data = await getECBInflation();
  if (!data) return res.status(503).json({ error: "ECB data unavailable" });
  res.json(data);
});

// GET /api/wine-info/market-index — Auction/market index estimates
router.get("/market-index", async (_req, res) => {
  const data = await getAuctionIndexData();
  res.json(data || { livex100_ytd: null, source: "unavailable" });
});

export default router;
