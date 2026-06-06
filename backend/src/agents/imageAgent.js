import cron from "node-cron";
import axios from "axios";

let pool = null;
export function setImagePool(p) { pool = p; }

const UNSPLASH_FALLBACKS = {
  rosso: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80&fm=webp",
  bianco: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&fm=webp",
  rose: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=80&fm=webp",
  champagne: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=300&q=80&fm=webp",
  default: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=80&fm=webp",
};

function wineTypeKey(wine) {
  const name = (wine.name + " " + (wine.type || "")).toLowerCase();
  if (/champagne|prosecco|cava|bollicine|sparkling/.test(name)) return "champagne";
  if (/ros[eé]|rosato/.test(name)) return "rose";
  if (/bianco|chardonnay|sauvignon|blanc|white|pinot grigio/.test(name)) return "bianco";
  return "rosso";
}

function buildVivinoSlug(wine) {
  return (wine.producer || wine.name)
    .toLowerCase()
    .replace(/château|chateau/g, "chateau")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

async function headCheck(url) {
  try {
    const r = await axios.head(url, { timeout: 5000, validateStatus: s => s === 200 });
    return r.status === 200;
  } catch (_) { return false; }
}

async function fetchOFFImage(wineName) {
  const encoded = encodeURIComponent(wineName);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&json=1&fields=product_name,image_front_url&page_size=1`;
  const r = await fetch(url, {
    headers: { "User-Agent": "VinoInvest/1.0" },
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error(`OFF ${r.status}`);
  const data = await r.json();
  const img = data.products?.[0]?.image_front_url;
  if (!img) throw new Error("no image");
  return img;
}

async function findImage(wine) {
  // 1. Try Vivino CDN slug
  const slug = buildVivinoSlug(wine);
  const vivinoUrl = `https://images.vivino.com/thumbs/${slug}_pb_x300.png`;
  if (await headCheck(vivinoUrl)) return { url: vivinoUrl, source: "vivino" };

  // 2. Try Open Food Facts (free, no auth needed)
  try {
    const offUrl = await fetchOFFImage(wine.name);
    if (offUrl) return { url: offUrl, source: "openfoodfacts" };
  } catch (_) {}

  // 3. Fallback by wine type (Unsplash)
  const typeKey = wineTypeKey(wine);
  return { url: UNSPLASH_FALLBACKS[typeKey] || UNSPLASH_FALLBACKS.default, source: "unsplash" };
}

async function updateImages() {
  if (!pool) { console.warn("[imageAgent] No DB pool"); return; }

  let found = 0, fallback = 0, processed = 0;

  try {
    // Get wines missing real images (batch of 100)
    const r = await pool.query(`
      SELECT id, name, producer, type, vintage
      FROM wines
      WHERE image_url IS NULL
         OR image_url = ''
         OR image_url LIKE '%placeholder%'
      LIMIT 100
    `);

    for (const wine of r.rows) {
      const { url, source } = await findImage(wine);
      await pool.query("UPDATE wines SET image_url = $1 WHERE id = $2", [url, wine.id]);
      source === "vivino" ? found++ : fallback++;
      processed++;
      await new Promise(res => setTimeout(res, 150)); // gentle throttle
    }

    console.log(`[imageAgent] Processed ${processed}: ${found} vivino, ${fallback} unsplash`);
  } catch (e) {
    console.error("[imageAgent]", e.message);
  }
}

// Run every night at 02:00
export function startImageAgent() {
  cron.schedule("0 2 * * *", updateImages, { timezone: "Europe/Rome" });
  console.log("[imageAgent] Scheduled — daily 02:00 Rome");
}

export { updateImages };
