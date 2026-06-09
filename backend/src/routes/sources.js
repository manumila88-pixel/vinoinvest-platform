import express from "express";

const router = express.Router();

const STATIC_SOURCES = [
  { id: 1, name: "Wine-Searcher", url: "https://www.wine-searcher.com", type: "price", reliability_score: 99 },
  { id: 2, name: "Vivino", url: "https://www.vivino.com", type: "price", reliability_score: 97 },
  { id: 3, name: "Tannico", url: "https://www.tannico.it", type: "price", reliability_score: 99 },
  { id: 4, name: "Millesima", url: "https://www.millesima.com", type: "price", reliability_score: 98 },
  { id: 5, name: "Idealwine", url: "https://www.idealwine.com", type: "price", reliability_score: 97 },
  { id: 6, name: "CellarTracker", url: "https://www.cellartracker.com", type: "price_community", reliability_score: 90 },
  { id: 7, name: "Decanter", url: "https://www.decanter.com", type: "rating", reliability_score: 99 },
  { id: 8, name: "Wine Spectator", url: "https://www.winespectator.com", type: "rating", reliability_score: 99 },
  { id: 9, name: "James Suckling", url: "https://www.jamessuckling.com", type: "rating", reliability_score: 97 },
  { id: 10, name: "Robert Parker", url: "https://www.robertparker.com", type: "rating", reliability_score: 99 },
  { id: 11, name: "Vinous", url: "https://vinous.com", type: "rating", reliability_score: 98 },
  { id: 12, name: "Jancis Robinson", url: "https://www.jancisrobinson.com", type: "rating", reliability_score: 99 },
  { id: 13, name: "Gambero Rosso", url: "https://www.gamberorosso.it", type: "rating", reliability_score: 97 },
  { id: 14, name: "Sotheby's Wine", url: "https://www.sothebys.com/en/departments/wine", type: "auction", reliability_score: 99 },
  { id: 15, name: "Christie's Wine", url: "https://www.christies.com/departments/wine", type: "auction", reliability_score: 99 },
  { id: 16, name: "Acker Wine", url: "https://www.ackerwinebid.com", type: "auction", reliability_score: 98 },
  { id: 17, name: "WineNews.it", url: "https://www.winenews.it", type: "news", reliability_score: 95 },
  { id: 18, name: "Drinks Business", url: "https://www.thedrinksbusiness.com", type: "news", reliability_score: 97 },
  { id: 19, name: "Open-Meteo", url: "https://open-meteo.com", type: "weather", reliability_score: 98 },
  { id: 20, name: "European Central Bank", url: "https://www.ecb.europa.eu", type: "financial", reliability_score: 100 },
  { id: 21, name: "Wikipedia", url: "https://www.wikipedia.org", type: "encyclopedia", reliability_score: 85 },
  { id: 22, name: "Liv-ex", url: "https://www.liv-ex.com", type: "market", reliability_score: 100 },
  { id: 23, name: "Open Food Facts", url: "https://world.openfoodfacts.org", type: "product", reliability_score: 80 },
  { id: 24, name: "Intravino", url: "https://www.intravino.com", type: "news", reliability_score: 93 },
];

// GET /api/sources — all sources
router.get("/", async (_req, res) => {
  try {
    res.json({ sources: STATIC_SOURCES });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/sources/wine-urls?name=barolo&vintage=2016
router.get("/wine-urls", async (req, res) => {
  try {
    const { name = "", vintage = "" } = req.query;
    const slug = encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
    const q = encodeURIComponent(`${name} ${vintage}`.trim());

    res.json({
      wine_searcher: `https://www.wine-searcher.com/find/${slug}/${vintage}`,
      vivino: `https://www.vivino.com/search/wines?q=${q}`,
      tannico: `https://www.tannico.it/catalogsearch/result/?q=${q}`,
      cellar_tracker: `https://www.cellartracker.com/list.asp?Table=List&szSearch=${q}`,
      decanter: `https://www.decanter.com/search/?q=${q}`,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
