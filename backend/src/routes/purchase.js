import { Router } from "express";

const router = Router();

let pool = null;
export function setPurchasePool(p) { pool = p; }

function buildPlatforms(wine) {
  const name = encodeURIComponent(wine.name || "");
  const nameRaw = wine.name || "";
  const vintage = wine.vintage ? `/${wine.vintage}` : "";
  const q = encodeURIComponent(`${nameRaw} ${wine.vintage || ""}`.trim());

  return [
    {
      id: "wine-searcher",
      name: "Wine-Searcher",
      logo: "https://www.wine-searcher.com/favicon.ico",
      url: `https://www.wine-searcher.com/find/${name}${vintage}`,
      description: "Più di 20M listini da 80 paesi",
      affiliate: true,
    },
    {
      id: "vivino",
      name: "Vivino",
      logo: "https://www.vivino.com/favicon.ico",
      url: `https://www.vivino.com/search/wines?q=${q}`,
      description: "50M+ utenti, community mondiale",
      affiliate: true,
    },
    {
      id: "millesima",
      name: "Millésima",
      logo: "https://www.millesima.com/favicon.ico",
      url: `https://www.millesima.com/search/?q=${q}`,
      description: "Specialisti Bordeaux e grandi annate",
      affiliate: true,
    },
    {
      id: "tannico",
      name: "Tannico",
      logo: "https://www.tannico.it/favicon.ico",
      url: `https://www.tannico.it/catalogsearch/result/?q=${q}`,
      description: "Leader italiano ecommerce vino",
      affiliate: true,
    },
    {
      id: "idealwine",
      name: "iDealwine",
      logo: "https://www.idealwine.com/favicon.ico",
      url: `https://www.idealwine.com/n/search.jsp?q=${q}`,
      description: "Aste vini pregiati, fonte di prezzi reali",
      affiliate: true,
    },
    {
      id: "callmewine",
      name: "Callmewine",
      logo: "https://www.callmewine.com/favicon.ico",
      url: `https://www.callmewine.com/ricerca.html?q=${q}`,
      description: "Vini italiani e internazionali",
      affiliate: true,
    },
    {
      id: "wine-com",
      name: "Wine.com",
      logo: "https://www.wine.com/favicon.ico",
      url: `https://www.wine.com/search/${name}/0`,
      description: "Il più grande enoteca online USA",
      affiliate: true,
    },
  ];
}

// GET /api/purchase/options/:wineId
router.get("/options/:wineId", async (req, res) => {
  const { wineId } = req.params;

  let wine = { name: wineId, vintage: null };
  if (pool) {
    try {
      const r = await pool.query("SELECT name, vintage, current_price, type FROM wines WHERE id = $1 LIMIT 1", [wineId]);
      if (r.rows.length) wine = r.rows[0];
    } catch (_) {}
  }

  const platforms = buildPlatforms({ ...wine, id: wineId });
  res.json({ wineId, wine, platforms });
});

// POST /api/purchase/track — track affiliate clicks
router.post("/track", async (req, res) => {
  const { userId, wineId, platform } = req.body;
  if (!wineId || !platform) return res.status(400).json({ error: "wineId and platform required" });

  if (pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS purchase_clicks (
          id SERIAL PRIMARY KEY,
          user_id TEXT,
          wine_id TEXT,
          platform TEXT,
          clicked_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query(
        "INSERT INTO purchase_clicks (user_id, wine_id, platform) VALUES ($1, $2, $3)",
        [userId || null, wineId, platform]
      );
    } catch (_) {}
  }

  res.json({ tracked: true });
});

// POST /api/purchase/import — import external purchase into portfolio
router.post("/import", async (req, res) => {
  const { userId, wineId, platform, price, quantity, purchaseDate } = req.body;
  if (!userId || !wineId || !price || !quantity) {
    return res.status(400).json({ error: "userId, wineId, price, quantity required" });
  }

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO orders (id, user_id, wine_id, quantity, purchase_price, purchase_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [Date.now(), userId, wineId, Number(quantity), Number(price), purchaseDate || new Date().toISOString().slice(0, 10), new Date().toISOString()]
      );
    } catch (e) {
      console.error("[purchase]", e.message);
      return res.status(500).json({ error: "Errore interno. Riprova." });
    }
  }

  res.json({ imported: true, wineId, quantity: Number(quantity), price: Number(price), source: platform || "external" });
});

export default router;
