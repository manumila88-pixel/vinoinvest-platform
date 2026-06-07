/**
 * CellarTracker free data connector.
 * Uses the public CSV endpoint — no API key required.
 * Endpoint: https://www.cellartracker.com/list.asp?Table=List&iUserOverride=0&szSearch=<name>
 * Returns pricing from community valuations and auction results.
 */

const BASE_URL = "https://www.cellartracker.com";
const TTL_MS = 6 * 60 * 60 * 1000; // 6h cache

const cache = new Map(); // key → { data, ts }

function cacheGet(key) {
  const e = cache.get(key);
  if (e && Date.now() - e.ts < TTL_MS) return e.data;
  return null;
}
function cacheSet(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.split("\t").map(v => v.trim().replace(/^"|"$/g, ""));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj;
  });
}

/**
 * Search CellarTracker for a wine by name/vintage.
 * Returns { price_avg, price_min, price_max, community_score, bottles_found, source }
 */
export async function fetchCellarTrackerPrice(wineName, vintage) {
  const query = vintage ? `${wineName} ${vintage}` : wineName;
  const key = query.toLowerCase().replace(/\s+/g, "_");

  const cached = cacheGet(key);
  if (cached) return { ...cached, cached: true };

  const url = `${BASE_URL}/list.asp?Table=List&iUserOverride=0&szSearch=${encodeURIComponent(query)}&f=1`;

  const resp = await fetch(url, {
    headers: {
      "User-Agent": "VinoInvest/1.0 (manumila88@gmail.com)",
      Accept: "text/plain, text/html",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!resp.ok) throw new Error(`CellarTracker HTTP ${resp.status}`);

  const text = await resp.text();

  // CSV format: iWine, Vintage, Wine, Locale, Country, Region, SubRegion, Appellation,
  // Producer, Type, Color, Category, Varietal, MasterVarietal, Designation, Vineyard,
  // Country, Region, SubRegion, Appellation, BeginConsume, EndConsume, CT, MyScore,
  // MyCost, Valuation, Bottles, PendingOrder, ...
  const rows = parseCSV(text);
  if (!rows.length) throw new Error("No results from CellarTracker");

  // Collect valuations and community scores
  const prices = [];
  let totalScore = 0, scoredCount = 0;

  for (const row of rows) {
    const val = parseFloat(row["Valuation"] || row["MyCost"] || "");
    const score = parseFloat(row["CT"] || "");
    if (val > 0 && val < 100000) prices.push(val);
    if (score > 0 && score <= 100) { totalScore += score; scoredCount++; }
  }

  if (!prices.length && !scoredCount) throw new Error("No price data found");

  prices.sort((a, b) => a - b);
  const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;

  const result = {
    price_avg: avg > 0 ? Math.round(avg * 100) / 100 : null,
    price_min: prices.length ? prices[0] : null,
    price_max: prices.length ? prices[prices.length - 1] : null,
    community_score: scoredCount > 0 ? Math.round((totalScore / scoredCount) * 10) / 10 : null,
    bottles_found: rows.length,
    source: "cellartracker",
  };

  cacheSet(key, result);
  return result;
}

/**
 * Get CellarTracker community tasting notes for a wine.
 */
export async function fetchCellarTrackerNotes(wineName, vintage) {
  const query = vintage ? `${wineName} ${vintage}` : wineName;
  const key = `notes_${query.toLowerCase().replace(/\s+/g, "_")}`;

  const cached = cacheGet(key);
  if (cached) return { ...cached, cached: true };

  const url = `${BASE_URL}/list.asp?Table=NotesByWine&iUserOverride=0&szSearch=${encodeURIComponent(query)}&f=1`;

  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "VinoInvest/1.0 (manumila88@gmail.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return { notes: [], source: "cellartracker" };

    const text = await resp.text();
    const rows = parseCSV(text);

    const notes = rows
      .filter(r => r["Note"] && r["Note"].length > 20)
      .slice(0, 5)
      .map(r => ({
        note: r["Note"]?.slice(0, 500),
        score: parseFloat(r["Score"] || "") || null,
        reviewer: r["Drinker"] || "Community",
        date: r["Date"] || null,
      }));

    const result = { notes, source: "cellartracker" };
    cacheSet(key, result);
    return result;
  } catch {
    return { notes: [], source: "cellartracker" };
  }
}
