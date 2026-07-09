import cron from "node-cron";
import { SITE_URL } from "../config/site.js";

let pool = null;
export function setImagePool(p) { pool = p; }

const UA = `VinoInvest/1.0 (manumila88@gmail.com; ${SITE_URL})`;

async function fetchJson(url, timeout = 6000) {
  const r = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(timeout),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// Wikipedia page thumbnail — free, reliable for famous estates
async function fetchWikiThumbnail(query) {
  const enc = encodeURIComponent(query.replace(/ /g, "_"));
  const data = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`);
  if (data.type === "disambiguation") return null;
  return data.thumbnail?.source || data.originalimage?.source || null;
}

// Open Food Facts — occasionally has wine label photos
async function fetchOFFImage(wineName) {
  const enc = encodeURIComponent(wineName);
  const data = await fetchJson(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${enc}&search_simple=1&json=1&fields=product_name,image_front_url&page_size=3`
  );
  return data.products?.find(p => p.image_front_url)?.image_front_url || null;
}

// Returns { url, source } or null if nothing found
async function findRealImage(wine) {
  const queries = [
    { fn: () => fetchWikiThumbnail(wine.name), source: "wikipedia" },
    { fn: () => fetchOFFImage(wine.name), source: "openfoodfacts" },
    { fn: () => fetchWikiThumbnail(wine.producer || wine.name), source: "wikipedia_producer" },
  ];

  for (const { fn, source } of queries) {
    try {
      const url = await fn();
      if (url?.startsWith("http")) return { url, source };
    } catch (_) {}
    await new Promise(r => setTimeout(r, 500));
  }
  return null;
}

async function updateImages() {
  if (!pool) { console.warn("[imageAgent] No DB pool"); return; }

  let found = 0, skipped = 0;

  try {
    // Prioritise wines with no image or broken Vivino URLs (403 hotlink-blocked)
    const r = await pool.query(`
      SELECT id, name, producer, type, vintage
      FROM wines
      WHERE image_url IS NULL
         OR image_url = ''
         OR image_url LIKE '%vivino.com%'
         OR image_url LIKE '%placeholder%'
      ORDER BY investment_score DESC NULLS LAST
      LIMIT 100
    `);

    for (const wine of r.rows) {
      const result = await findRealImage(wine);
      if (result) {
        await pool.query("UPDATE wines SET image_url = $1 WHERE id = $2", [result.url, wine.id]);
        found++;
      } else {
        // Set to empty string so we don't retry every night until next cycle
        await pool.query("UPDATE wines SET image_url = '' WHERE id = $1 AND (image_url LIKE '%vivino.com%' OR image_url IS NULL)", [wine.id]);
        skipped++;
      }
      await new Promise(res => setTimeout(res, 600));
    }

    console.log(`[imageAgent] Done: ${found} real images found, ${skipped} skipped (no source)`);
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
