/**
 * Image Service — real bottle images from Open Food Facts + Wikipedia Commons.
 * No API key required. Cache 24h.
 */
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400 });
const UA = "VinoInvest/1.0 (manumila88@gmail.com; https://vinoinvest-platform.vercel.app)";

async function fetchWithTimeout(url, opts = {}) {
  return fetch(url, {
    headers: { "User-Agent": UA, ...opts.headers },
    signal: AbortSignal.timeout(opts.timeout || 6000),
    ...opts,
  });
}

// --- Open Food Facts ---
async function searchOFF(wineName) {
  const encoded = encodeURIComponent(wineName);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encoded}&search_simple=1&json=1&fields=product_name,image_front_url&page_size=5`;
  try {
    const r = await fetchWithTimeout(url);
    if (!r.ok) return null;
    const data = await r.json();
    for (const p of data.products || []) {
      if (p.image_front_url?.startsWith("http")) return p.image_front_url;
    }
  } catch { /* skip */ }
  return null;
}

// --- Wikipedia page thumbnail ---
async function searchWikiThumbnail(query) {
  const encoded = encodeURIComponent(query.replace(/ /g, "_"));
  try {
    const r = await fetchWithTimeout(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    );
    if (!r.ok) return null;
    const data = await r.json();
    if (data.type === "disambiguation") return null;
    return data.thumbnail?.source || data.originalimage?.source || null;
  } catch { /* skip */ }
  return null;
}

// --- Wikipedia Commons image search ---
async function searchWikiCommons(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*`;
  try {
    const r = await fetchWithTimeout(url, { timeout: 5000 });
    if (!r.ok) return null;
    const data = await r.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      const imgUrl = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
      if (imgUrl?.startsWith("http")) return imgUrl;
    }
  } catch { /* skip */ }
  return null;
}

/**
 * Resolve a real image for a wine.
 * Returns URL string or null.
 */
export async function getWineImage(wineId, wineName, producerName = "") {
  const cacheKey = `wimg_${wineId || slugify(wineName)}`;
  const hit = cache.get(cacheKey);
  if (hit !== undefined) return hit;

  const candidates = [
    () => searchWikiThumbnail(wineName),
    () => searchOFF(wineName),
    () => searchWikiCommons(`${wineName} wine bottle`),
    () => searchWikiThumbnail(producerName),
    () => searchWikiCommons(producerName),
  ].filter((_, i) => i === 0 || (i === 1) || (i >= 2)); // all sources

  for (const fn of candidates) {
    try {
      const img = await fn();
      if (img && img.startsWith("http")) {
        cache.set(cacheKey, img);
        return img;
      }
    } catch { /* next */ }
  }

  cache.set(cacheKey, null);
  return null;
}

/**
 * Batch resolve images for up to 200 wines, 300ms rate-limit between requests.
 * Returns { wineId: imageUrl } map.
 */
export async function batchResolveImages(wines) {
  const results = {};
  const toResolve = wines.filter(w => !w.image_url).slice(0, 200);

  for (const wine of toResolve) {
    const img = await getWineImage(wine.id, wine.name, wine.producer || "");
    if (img) results[wine.id] = img;
    await sleep(300);
  }
  return results;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 50);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
