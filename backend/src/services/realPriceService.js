/**
 * Real price fetcher — replaces CellarTracker with free public sources:
 *   1. Wine-Searcher public pages   → price data  (source = "wine-searcher-public")
 *   2. Open Food Facts JSON API     → bottle images when missing
 *   3. Wikipedia REST summary API   → producer descriptions (once per producer)
 *
 * Writes results to price_history, price_cache, and updates wines.real_data flag.
 * Cron: daily at 03:00. Also callable via admin endpoint for manual runs.
 */

import axios from "axios";
import * as cheerio from "cheerio";
import cron from "node-cron";

let pool = null;
export const setRealPricePool = (p) => { pool = p; };

const DELAY_MS = 3000;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Wine-Searcher scraping ───────────────────────────────────────────────────

async function scrapeWineSearcher(wineName, vintage) {
  const slug = wineName.replace(/\s+/g, "+");
  const vintageStr = vintage ? `/${vintage}` : "";
  const url = `https://www.wine-searcher.com/find/${encodeURIComponent(slug)}${vintageStr}`;

  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const $ = cheerio.load(html);
    const prices = [];

    $("[data-cy='price'], .offer-price, .price-block__price, .price").each((_, el) => {
      const raw = $(el).text().replace(/[^\d.,]/g, "").replace(",", ".");
      const val = parseFloat(raw);
      if (val > 1 && val < 500000) prices.push(val);
    });

    // Fallback: scan for €NNN patterns
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

    if (prices.length === 0) return null;

    const sorted = [...new Set(prices)].sort((a, b) => a - b);
    const avg = sorted.reduce((s, p) => s + p, 0) / sorted.length;

    return {
      price_min: sorted[0],
      price_max: sorted[sorted.length - 1],
      price_avg: Math.round(avg * 100) / 100,
      merchant_count: sorted.length,
      source: "wine-searcher-public",
    };
  } catch {
    return null;
  }
}

// ── Open Food Facts image ────────────────────────────────────────────────────

async function fetchOpenFoodFactsImage(wineName) {
  try {
    const q = encodeURIComponent(wineName);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1&page_size=5`;
    const { data } = await axios.get(url, { timeout: 8000 });
    for (const p of data?.products || []) {
      if (p.image_url && p.image_url.startsWith("https://")) return p.image_url;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Wikipedia producer description ──────────────────────────────────────────

async function fetchWikipediaDescription(producerName) {
  try {
    const slug = producerName.trim().replace(/\s+/g, "_");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
    const { data } = await axios.get(url, { timeout: 8000 });
    if (data?.extract && data.extract.length > 50) return data.extract.slice(0, 500);
    return null;
  } catch {
    return null;
  }
}

// ── DB helpers ───────────────────────────────────────────────────────────────

async function ensureColumns() {
  if (!pool) return;
  await pool.query(`ALTER TABLE wines ADD COLUMN IF NOT EXISTS real_data BOOLEAN DEFAULT FALSE`).catch(() => {});
  await pool.query(`ALTER TABLE wines ADD COLUMN IF NOT EXISTS producer_description TEXT`).catch(() => {});
}

async function savePriceData(wineId, vintage, priceData) {
  await pool.query(
    `INSERT INTO price_history (wine_id, price, currency, source, recorded_at) VALUES ($1, $2, 'EUR', $3, NOW())`,
    [wineId, priceData.price_avg, priceData.source]
  ).catch(() => {});

  await pool.query(
    `INSERT INTO price_cache (wine_id, vintage, price_avg, updated_at) VALUES ($1, $2, $3, NOW())
     ON CONFLICT (wine_id, vintage) DO UPDATE SET price_avg = $3, updated_at = NOW()`,
    [wineId, vintage || 0, priceData.price_avg]
  ).catch(() => {});

  await pool.query(`UPDATE wines SET real_data = TRUE WHERE id = $1`, [wineId]).catch(() => {});
}

// ── Main fetch ───────────────────────────────────────────────────────────────

export async function runRealPriceFetch(limit = 200) {
  if (!pool) {
    console.log("[realPriceService] No DB connection, skipping.");
    return { updated: 0, failed: 0, images: 0, descriptions: 0 };
  }

  await ensureColumns();
  console.log(`[realPriceService] Starting fetch for top ${limit} wines...`);

  let topWines;
  try {
    const result = await pool.query(
      `SELECT id, name, producer, vintage, current_price, image_url
       FROM wines
       WHERE investment_score IS NOT NULL
       ORDER BY investment_score DESC NULLS LAST, current_price DESC NULLS LAST
       LIMIT $1`,
      [limit]
    );
    topWines = result.rows;
  } catch (e) {
    console.error("[realPriceService] Failed to query wines:", e.message);
    return { updated: 0, failed: 0, images: 0, descriptions: 0 };
  }

  let updated = 0, failed = 0, images = 0, descriptions = 0;
  const producersSeen = new Set();

  for (const wine of topWines) {
    try {
      // 1. Wine-Searcher price
      const priceData = await scrapeWineSearcher(wine.name, wine.vintage);
      if (priceData) {
        await savePriceData(wine.id, wine.vintage, priceData);
        updated++;
      } else {
        failed++;
      }

      // 2. Open Food Facts image (only if missing)
      if (!wine.image_url) {
        const imgUrl = await fetchOpenFoodFactsImage(wine.name);
        if (imgUrl) {
          await pool.query(`UPDATE wines SET image_url = $1 WHERE id = $2 AND (image_url IS NULL OR image_url = '')`, [imgUrl, wine.id]).catch(() => {});
          images++;
        }
      }

      // 3. Wikipedia description (once per producer)
      if (wine.producer && !producersSeen.has(wine.producer)) {
        producersSeen.add(wine.producer);
        const desc = await fetchWikipediaDescription(wine.producer);
        if (desc) {
          await pool.query(
            `UPDATE wines SET producer_description = $1 WHERE producer = $2 AND (producer_description IS NULL OR producer_description = '')`,
            [desc, wine.producer]
          ).catch(() => {});
          descriptions++;
        }
      }

      await sleep(DELAY_MS);
    } catch (e) {
      console.warn(`[realPriceService] Error for ${wine.name}: ${e.message}`);
      failed++;
      await sleep(1000);
    }
  }

  const summary = { updated, failed, images, descriptions };
  console.log(`[realPriceService] Done. Updated: ${updated}, Failed: ${failed}, Images: ${images}, Descriptions: ${descriptions}`);

  // Log run to price_update_log if table exists
  await pool.query(
    `INSERT INTO price_update_log (source, wines_updated, wines_failed, ran_at) VALUES ('real-price-cron', $1, $2, NOW()) ON CONFLICT DO NOTHING`,
    [updated, failed]
  ).catch(() => {});

  return summary;
}

// ── Cron: daily at 03:00 ─────────────────────────────────────────────────────

export function startRealPriceCron() {
  cron.schedule("0 3 * * *", async () => {
    console.log("[realPriceService] Daily cron starting (03:00)...");
    await runRealPriceFetch(200);
  });
  console.log("[realPriceService] Cron registered (daily at 03:00) — top-200 wines.");
}
