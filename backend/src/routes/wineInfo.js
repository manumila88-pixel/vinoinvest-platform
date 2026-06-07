import { Router } from "express";
import { fetchCellarTrackerPrice, fetchCellarTrackerNotes } from "../connectors/cellarTracker.js";

const router = Router();

// In-memory cache: 24h TTL
const wikiCache = new Map();
const offCache = new Map();
const ctCache = new Map();
const WIKI_TTL = 24 * 60 * 60 * 1000;

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

// Wikipedia REST API — free, no auth needed
async function fetchWikiSummary(query) {
  const encoded = encodeURIComponent(query.replace(/ /g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
  const r = await fetch(url, {
    headers: { "User-Agent": "VinoInvest/1.0 (manumila88@gmail.com)" },
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error(`Wikipedia ${r.status}`);
  const data = await r.json();
  if (data.type === "disambiguation") throw new Error("disambiguation");
  return {
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail?.source || null,
    url: data.content_urls?.desktop?.page || null,
  };
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

  const cacheKey = slugify(query);
  const cached = wikiCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < WIKI_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  // Try exact query first, then simplified (first word = producer)
  const attempts = [query, query.split(" ").slice(0, 3).join(" "), query.split(" ")[0]];

  for (const attempt of attempts) {
    try {
      const data = await fetchWikiSummary(attempt);
      wikiCache.set(cacheKey, { data, ts: Date.now() });
      return res.json(data);
    } catch (_) {}
  }

  res.json({ title: query, extract: null, thumbnail: null, url: null, source: "not_found" });
});

// GET /api/wine-info/image?q=Château+Lafite+Rothschild
router.get("/image", async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  if (!query) return res.status(400).json({ error: "q required" });

  const cacheKey = slugify(query);
  const cached = offCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < WIKI_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  try {
    const imageUrl = await fetchOFFImage(query);
    const result = { imageUrl, source: "openfoodfacts" };
    offCache.set(cacheKey, { data: result, ts: Date.now() });
    return res.json(result);
  } catch (_) {
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
  if (cached && Date.now() - cached.ts < WIKI_TTL) {
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
  } catch (err) {
    return res.json({ notes: [], source: "cellartracker" });
  }
});

export default router;
