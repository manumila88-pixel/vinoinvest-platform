import axios from "axios";
import * as cheerio from "cheerio";

let pool = null;
let tablesReady = false;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    import("../db/pool.js").then(m => { pool = m.pool; }).catch(() => {});
  }
  return pool;
}

async function ensureTables() {
  const db = getPool();
  if (!db || tablesReady) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS price_cache (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        wine_id TEXT NOT NULL,
        wine_name TEXT NOT NULL,
        vintage INTEGER,
        price_min NUMERIC(10,2),
        price_max NUMERIC(10,2),
        price_avg NUMERIC(10,2),
        currency TEXT DEFAULT 'EUR',
        source TEXT DEFAULT 'wine-searcher',
        merchant_count INTEGER,
        last_updated TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(wine_id, vintage)
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS price_history (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        wine_id TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        currency TEXT DEFAULT 'EUR',
        source TEXT,
        recorded_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    tablesReady = true;
  } catch (e) {
    console.warn("[priceService] Table init failed:", e.message);
  }
}

async function getCached(wineId, vintage) {
  const db = getPool();
  if (!db) return null;
  try {
    const { rows } = await db.query(
      `SELECT * FROM price_cache
       WHERE wine_id = $1
         AND (vintage = $2 OR ($2 IS NULL AND vintage IS NULL))
         AND last_updated > NOW() - INTERVAL '24 hours'
       LIMIT 1`,
      [wineId, vintage || null]
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function upsertCache(entry) {
  const db = getPool();
  if (!db) return;
  try {
    await db.query(
      `INSERT INTO price_cache
         (wine_id, wine_name, vintage, price_min, price_max, price_avg, currency, source, merchant_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (wine_id, vintage) DO UPDATE SET
         price_min      = EXCLUDED.price_min,
         price_max      = EXCLUDED.price_max,
         price_avg      = EXCLUDED.price_avg,
         source         = EXCLUDED.source,
         merchant_count = EXCLUDED.merchant_count,
         last_updated   = NOW()`,
      [
        entry.wine_id, entry.wine_name, entry.vintage ?? null,
        entry.price_min, entry.price_max, entry.price_avg,
        entry.currency ?? "EUR", entry.source ?? "wine-searcher",
        entry.merchant_count ?? 0,
      ]
    );
    await db.query(
      `INSERT INTO price_history (wine_id, price, currency, source)
       VALUES ($1,$2,$3,$4)`,
      [entry.wine_id, entry.price_avg, entry.currency ?? "EUR", entry.source]
    );
  } catch (e) {
    console.warn("[priceService] Cache write error:", e.message);
  }
}

async function scrapeWineSearcher(wineName, vintage) {
  const slug = wineName.replace(/\s+/g, "+");
  const vintageStr = vintage ? `/${vintage}` : "";
  const url = `https://www.wine-searcher.com/find/${encodeURIComponent(slug)}${vintageStr}`;

  const { data: html } = await axios.get(url, {
    timeout: 9000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  const $ = cheerio.load(html);
  const prices = [];

  // Primary selectors used by Wine-Searcher
  $("[data-cy='price'], .offer-price, .price-block__price, .price").each((_, el) => {
    const raw = $(el).text().replace(/[^\d.,]/g, "").replace(",", ".");
    const val = parseFloat(raw);
    if (val > 1 && val < 500000) prices.push(val);
  });

  // Broad fallback: scan for €NNN patterns
  if (prices.length === 0) {
    $("span, td, div").each((_, el) => {
      const text = $(el).text().trim();
      const m = text.match(/^€\s*(\d{1,6}(?:[.,]\d{0,2})?)$/);
      if (m) {
        const val = parseFloat(m[1].replace(",", "."));
        if (val > 1 && val < 500000) prices.push(val);
      }
    });
  }

  if (prices.length === 0) throw new Error("No prices found on page");

  const sorted = [...new Set(prices)].sort((a, b) => a - b);
  const avg = sorted.reduce((s, p) => s + p, 0) / sorted.length;

  return {
    price_min: sorted[0],
    price_max: sorted[sorted.length - 1],
    price_avg: Math.round(avg * 100) / 100,
    merchant_count: sorted.length,
    source: "wine-searcher",
  };
}

function estimateFallback(criticScore = 90) {
  const base = Math.round(criticScore * 0.8);
  const spread = Math.round(base * 0.15);
  return {
    price_min: Math.max(1, base - spread),
    price_max: base + spread,
    price_avg: base,
    merchant_count: 0,
    source: "estimated",
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getPrices(wineId, wineName, vintage, criticScore = 90) {
  await ensureTables();

  const cached = await getCached(wineId, vintage);
  if (cached) {
    return {
      wine_id: cached.wine_id,
      wine_name: cached.wine_name,
      vintage: cached.vintage,
      price_min: Number(cached.price_min),
      price_max: Number(cached.price_max),
      price_avg: Number(cached.price_avg),
      currency: cached.currency,
      source: cached.source,
      merchant_count: cached.merchant_count,
      from_cache: true,
    };
  }

  let result;
  try {
    result = await scrapeWineSearcher(wineName, vintage);
  } catch (e) {
    console.warn(`[priceService] Scraping failed for "${wineName}": ${e.message}`);
    result = estimateFallback(criticScore);
  }

  const entry = {
    wine_id: wineId,
    wine_name: wineName,
    vintage: vintage ?? null,
    currency: "EUR",
    ...result,
  };

  await upsertCache(entry);
  return { ...entry, from_cache: false };
}

const TIMEFRAME_MONTHS = { "1w": 0.25, "1m": 1, "3m": 3, "6m": 6, "1y": 12, "3y": 36, "5y": 60, "10y": 120, "max": 9999 };

function seededVal(seed, range) {
  let h = seed;
  h = ((h >> 16) ^ h) * 0x45d9f3b | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b | 0;
  h = (h >> 16) ^ h;
  return ((h >>> 0) / 0xffffffff) * range;
}

async function generateAndSeedHistory(wineId, currentPrice, monthsBack = 12) {
  const db = getPool();
  const records = [];
  const now = new Date();
  const clampedMonths = Math.min(monthsBack, 120);
  let price = currentPrice * Math.pow(0.985, clampedMonths); // reverse growth to get past price

  const monthsBetweenPoints = clampedMonths > 36 ? 3 : clampedMonths > 12 ? 2 : 1;
  const daysPerPoint = [5, 15, 25];

  for (let mo = clampedMonths; mo >= 0; mo -= monthsBetweenPoints) {
    for (const day of (monthsBetweenPoints === 1 ? daysPerPoint : [15])) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - mo);
      date.setDate(day);
      const seed = (wineId + date.toISOString().slice(0, 7)).split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
      const noise = 1 + (seededVal(seed, 0.10) - 0.05);
      records.push({
        price: Math.round(price * noise * 100) / 100,
        currency: "EUR",
        source: "estimated",
        recorded_at: date.toISOString(),
      });
    }
    price = price * (1 + 0.01 + seededVal((wineId + mo).split("").reduce((a, c) => a + c.charCodeAt(0), 0), 0.02));
  }

  if (db) {
    try {
      for (const rec of records) {
        await db.query(
          `INSERT INTO price_history (wine_id, price, currency, source, recorded_at)
           VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`,
          [wineId, rec.price, rec.currency, rec.source, rec.recorded_at]
        ).catch(() => {});
      }
    } catch (e) {
      console.warn("[priceService] Failed to persist estimated history:", e.message);
    }
  }

  return records;
}

export async function getPriceHistory(wineId, currentPrice = null, timeframe = "1y") {
  await ensureTables();
  const db = getPool();

  const monthsBack = TIMEFRAME_MONTHS[timeframe] ?? 12;
  const interval = monthsBack >= 9999 ? "100 years" : `${Math.ceil(monthsBack)} months`;

  // No DB — return synthetic data
  if (!db) {
    const basePrice = currentPrice || 100;
    const synth = await generateAndSeedHistory(wineId, basePrice, Math.min(monthsBack, 120));
    return { history: synth, source: "estimated", availability: Object.fromEntries(Object.keys(TIMEFRAME_MONTHS).map(k => [k, true])) };
  }

  try {
    const producer = wineId.replace(/-\d{4}$/, "");
    const pattern = producer + "%";

    // Check what range is actually available
    const { rows: rangeRows } = await db.query(
      `SELECT MIN(recorded_at) AS oldest, MAX(recorded_at) AS newest, COUNT(*) AS cnt FROM price_history WHERE wine_id LIKE $1`,
      [pattern]
    );
    const oldest = rangeRows[0]?.oldest ? new Date(rangeRows[0].oldest) : null;
    const totalMonths = oldest ? Math.floor((Date.now() - oldest.getTime()) / (30 * 24 * 3600 * 1000)) : 0;

    // Compute availability for each timeframe
    const availability = {};
    for (const [tf, mo] of Object.entries(TIMEFRAME_MONTHS)) {
      availability[tf] = mo >= 9999 ? totalMonths > 0 : totalMonths >= mo * 0.7;
    }

    const { rows } = await db.query(
      `SELECT price, currency, source, recorded_at
       FROM price_history
       WHERE wine_id LIKE $1
         AND recorded_at > NOW() - INTERVAL '${interval}'
       ORDER BY recorded_at`,
      [pattern]
    );

    if (rows.length > 0) return { history: rows, source: "db", availability };

    // No history — generate and seed
    let basePrice = currentPrice;
    if (!basePrice) {
      const { rows: cached } = await db.query(
        `SELECT price_avg FROM price_cache WHERE wine_id LIKE $1 LIMIT 1`,
        [pattern]
      );
      basePrice = cached[0] ? Number(cached[0].price_avg) : null;
    }
    if (!basePrice) basePrice = 100;

    const synth = await generateAndSeedHistory(wineId, basePrice, Math.min(monthsBack, 120));
    const synthAvail = Object.fromEntries(Object.keys(TIMEFRAME_MONTHS).map(k => [k, TIMEFRAME_MONTHS[k] <= 120]));
    return { history: synth, source: "estimated", availability: synthAvail };
  } catch (e) {
    console.error("[priceService] getPriceHistory error:", e.message);
    return { history: [], source: "error", availability: {} };
  }
}

export async function refreshPrice(wineId, wineName, vintage, criticScore = 90) {
  const db = getPool();
  if (db) {
    await db
      .query(
        `DELETE FROM price_cache WHERE wine_id = $1 AND (vintage = $2 OR ($2 IS NULL AND vintage IS NULL))`,
        [wineId, vintage ?? null]
      )
      .catch(() => {});
  }
  return getPrices(wineId, wineName, vintage, criticScore);
}
