/**
 * EnrichmentService — orchestrates free/legal data enrichment for wine records.
 * Sources: Wikipedia, Wikidata SPARQL, Open Food Facts (CC0), Open-Meteo, ECB.
 * No paid APIs. No scraping. Idempotent (safe to re-run).
 * Stores results in wine_enrichment table (1:1 with wines).
 */
import { getWikiSummary, getWikidataWine, getBottleImage, getWikimediaImage } from "./freeDataService.js";
import { getProducerFromWikidata } from "./wikidataService.js";
import { getVintageScore } from "./vintageClimateService.js";

let pool = null;
export function setEnrichmentPool(p) { pool = p; }

// ── DB setup ─────────────────────────────────────────────────────────────────

export async function initEnrichmentTable() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wine_enrichment (
        wine_id         INTEGER PRIMARY KEY,
        producer_summary TEXT,
        producer_wiki_url TEXT,
        producer_image_url TEXT,
        region          TEXT,
        grape_variety   TEXT,
        country         TEXT,
        founding_year   INTEGER,
        wiki_lang       VARCHAR(5),
        bottle_image_url TEXT,
        vintage_score   INTEGER,
        vintage_label   TEXT,
        vintage_climate_region TEXT,
        enriched_at     TIMESTAMP DEFAULT NOW(),
        enrichment_version INTEGER DEFAULT 1
      )
    `);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_wine_enrichment_enriched ON wine_enrichment(enriched_at)`
    ).catch(() => {});
    console.log("[enrichmentService] wine_enrichment table ready.");
  } catch (e) {
    console.warn("[enrichmentService] initEnrichmentTable:", e.message);
  }
}

// ── Region inference from wine name / producer ───────────────────────────────

const REGION_PATTERNS = [
  [/barolo|barbaresco|dolcetto|langhe|piedmont|piemonte|gaja|giacomo/i, "barolo"],
  [/brunello|montalcino|chianti|sassicaia|tignanello|solaia|ornellaia|masseto|bolgheri|antinori|frescobaldi|biondi/i, "tuscany"],
  [/bordeaux|pomerol|margaux|p[eé]trus|pichon|latour|l[eé]oville|haut-brion|lafite|mouton|rothschild|ch[âa]teau/i, "bordeaux"],
  [/burgundy|bourgogne|chambolle|gevrey|nuits|vosne|clos|roman[eé]e|richebourg|montrachet|leroy|drc|rousseau/i, "burgundy"],
  [/champagne|mo[eë]t|krug|bollinger|roederer|pol roger|veuve clicquot|salon|taittinger/i, "champagne"],
  [/rioja|vega sicilia|ribera del duero|priorat|tempranillo/i, "rioja"],
  [/douro|port wine|quinta|taylor|graham|fonseca|ramos pinto/i, "douro"],
  [/napa|sonoma|california|opus one|screaming eagle|ridge|harlan|caymus/i, "napa"],
  [/mendoza|argentina|malbec|catena|achaval/i, "mendoza"],
  [/mosel|riesling|rhein|germany|egon m|jj pr[üu]m|loosen|selbach/i, "mosel"],
  [/priorat|garnacha|spain|rioja|ribera/i, "priorat"],
];

function inferRegion(wineName = "", producer = "") {
  const text = `${wineName} ${producer}`;
  for (const [pattern, region] of REGION_PATTERNS) {
    if (pattern.test(text)) return region;
  }
  return null;
}

// ── Single wine enrichment ────────────────────────────────────────────────────

export async function enrichWine(wineId, wineName, producer, vintage) {
  if (!pool) return null;

  const results = {
    wineId,
    producerSummary: null,
    producerWikiUrl: null,
    producerImageUrl: null,
    region: null,
    grapeVariety: null,
    country: null,
    foundingYear: null,
    wikiLang: null,
    bottleImageUrl: null,
    vintageScore: null,
    vintageLabel: null,
    vintageClimateRegion: null,
  };

  // 1. Producer info from Wikidata + Wikipedia
  if (producer) {
    const [wdData, wikiData] = await Promise.allSettled([
      getProducerFromWikidata(producer),
      getWikiSummary(producer),
    ]);

    if (wdData.status === "fulfilled" && wdData.value) {
      const wd = wdData.value;
      results.country = wd.country || null;
      results.foundingYear = wd.foundingYear || null;
      results.producerSummary = wd.description || null;
    }

    if (wikiData.status === "fulfilled" && wikiData.value) {
      const wiki = wikiData.value;
      results.producerSummary = results.producerSummary || wiki.extract?.slice(0, 600) || null;
      results.producerWikiUrl = wiki.url || null;
      results.wikiLang = wiki.lang || "en";
      // Use Wikipedia thumbnail as producer image if available
      results.producerImageUrl = wiki.thumbnail || null;
    }

    // Wikimedia Commons fallback for producer image
    if (!results.producerImageUrl) {
      const wmImg = await getWikimediaImage(producer).catch(() => null);
      results.producerImageUrl = wmImg || null;
    }
  }

  // 2. Wikidata wine data (region, grape)
  const wdWine = await getWikidataWine(wineName).catch(() => null);
  if (wdWine) {
    results.region = results.region || wdWine.region || null;
    results.grapeVariety = wdWine.grape || null;
    results.country = results.country || wdWine.country || null;
  }

  // 3. Bottle image — Open Food Facts (CC0)
  const bottleImg = await getBottleImage(wineName, producer).catch(() => null);
  results.bottleImageUrl = bottleImg || null;

  // 4. Vintage climate score — Open-Meteo
  const inferredRegion = inferRegion(wineName, producer);
  if (inferredRegion && vintage && vintage >= 2000) {
    const vintageYear = parseInt(vintage);
    const currentYear = new Date().getFullYear();
    if (vintageYear >= 2000 && vintageYear < currentYear) {
      const vs = await getVintageScore(inferredRegion, vintageYear).catch(() => null);
      if (vs) {
        results.vintageScore = vs.score;
        results.vintageLabel = vs.label;
        results.vintageClimateRegion = vs.region;
      }
    }
  }
  if (inferredRegion) results.region = results.region || inferredRegion;

  // Persist to DB
  try {
    await pool.query(
      `INSERT INTO wine_enrichment
         (wine_id, producer_summary, producer_wiki_url, producer_image_url,
          region, grape_variety, country, founding_year, wiki_lang,
          bottle_image_url, vintage_score, vintage_label, vintage_climate_region,
          enriched_at, enrichment_version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),1)
       ON CONFLICT (wine_id) DO UPDATE SET
         producer_summary = EXCLUDED.producer_summary,
         producer_wiki_url = EXCLUDED.producer_wiki_url,
         producer_image_url = EXCLUDED.producer_image_url,
         region = EXCLUDED.region,
         grape_variety = EXCLUDED.grape_variety,
         country = EXCLUDED.country,
         founding_year = EXCLUDED.founding_year,
         wiki_lang = EXCLUDED.wiki_lang,
         bottle_image_url = EXCLUDED.bottle_image_url,
         vintage_score = EXCLUDED.vintage_score,
         vintage_label = EXCLUDED.vintage_label,
         vintage_climate_region = EXCLUDED.vintage_climate_region,
         enriched_at = NOW(),
         enrichment_version = wine_enrichment.enrichment_version + 1`,
      [
        wineId,
        results.producerSummary,
        results.producerWikiUrl,
        results.producerImageUrl,
        results.region,
        results.grapeVariety,
        results.country,
        results.foundingYear,
        results.wikiLang,
        results.bottleImageUrl,
        results.vintageScore,
        results.vintageLabel,
        results.vintageClimateRegion,
      ]
    );
  } catch (e) {
    console.warn(`[enrichmentService] persist wine ${wineId}:`, e.message);
  }

  return results;
}

// ── Batch enrichment ──────────────────────────────────────────────────────────

const BATCH_DELAY_MS = 1500; // polite rate limit toward external APIs

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Enrich up to `limit` wines not yet enriched (or enriched >30 days ago).
 * Returns { enriched, skipped, failed }.
 */
export async function enrichBatch(limit = 50) {
  if (!pool) return { enriched: 0, skipped: 0, failed: 0, reason: "no pool" };

  let wines;
  try {
    const { rows } = await pool.query(
      `SELECT w.id, w.name, w.producer, w.vintage
       FROM wines w
       LEFT JOIN wine_enrichment we ON we.wine_id = w.id
       WHERE we.wine_id IS NULL
          OR we.enriched_at < NOW() - INTERVAL '30 days'
       ORDER BY w.id
       LIMIT $1`,
      [limit]
    );
    wines = rows;
  } catch (e) {
    console.error("[enrichmentService] enrichBatch query:", e.message);
    return { enriched: 0, skipped: 0, failed: 0, error: e.message };
  }

  if (!wines.length) return { enriched: 0, skipped: wines.length, failed: 0 };

  let enriched = 0;
  let failed = 0;

  for (const wine of wines) {
    try {
      await enrichWine(wine.id, wine.name, wine.producer, wine.vintage);
      enriched++;
    } catch (e) {
      console.warn(`[enrichmentService] enrichWine ${wine.id} (${wine.name}):`, e.message);
      failed++;
    }
    await sleep(BATCH_DELAY_MS);
  }

  console.log(`[enrichmentService] Batch done — enriched: ${enriched}, failed: ${failed}`);
  return { enriched, skipped: 0, failed };
}

// ── Query helpers ─────────────────────────────────────────────────────────────

export async function getEnrichment(wineId) {
  if (!pool) return null;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM wine_enrichment WHERE wine_id = $1`,
      [wineId]
    );
    return rows[0] || null;
  } catch { return null; }
}

export async function getEnrichedWine(wineId) {
  if (!pool) return null;
  try {
    const { rows } = await pool.query(
      `SELECT w.*, we.producer_summary, we.producer_wiki_url, we.producer_image_url,
              we.region, we.grape_variety, we.country, we.founding_year,
              we.bottle_image_url, we.vintage_score, we.vintage_label,
              we.vintage_climate_region, we.enriched_at
       FROM wines w
       LEFT JOIN wine_enrichment we ON we.wine_id = w.id
       WHERE w.id = $1`,
      [wineId]
    );
    return rows[0] || null;
  } catch { return null; }
}

export async function getEnrichmentStats() {
  if (!pool) return null;
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE we.wine_id IS NOT NULL) AS enriched,
        COUNT(*) FILTER (WHERE we.wine_id IS NULL)     AS unenriched,
        COUNT(*) FILTER (WHERE we.vintage_score IS NOT NULL) AS with_vintage_score,
        COUNT(*) FILTER (WHERE we.bottle_image_url IS NOT NULL) AS with_bottle_image,
        COUNT(*) FILTER (WHERE we.producer_summary IS NOT NULL) AS with_producer_info
      FROM wines w
      LEFT JOIN wine_enrichment we ON we.wine_id = w.id
    `);
    return rows[0];
  } catch { return null; }
}
