/**
 * CellarTracker price cron — fetches community price data from CellarTracker public API.
 * API docs: https://www.cellartracker.com/api.asp
 * Free, no API key required for public wine lookup.
 * Runs every 6 hours. Updates price_cache and price_history with source="cellartracker".
 */

import NodeCache from "node-cache";

let pool = null;
export const setCellarTrackerPool = (p) => { pool = p; };

const CT_BASE = "https://www.cellartracker.com/api.asp";
const CACHE_TTL_HOURS = 6;

// Notes cache: 24h TTL
const notesCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

/**
 * Parse tab-separated CellarTracker response into array of objects.
 * First line contains column headers.
 */
function parseTSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = line.split("\t");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || "").trim(); });
    return obj;
  });
}

/**
 * Fetch CellarTracker community tasting notes for a wine by name.
 * Returns top 3 notes sorted by score desc. Returns [] on any error.
 */
export async function getCellarTrackerNotes(wineName) {
  if (!wineName) return [];

  const cacheKey = `ct_notes:${wineName.toLowerCase()}`;
  const cached = notesCache.get(cacheKey);
  if (cached !== undefined) return cached;

  try {
    // Step 1: Search for wine to get iWine ID
    const searchUrl = `${CT_BASE}?q=list&type=List&User=wine&Password=wine&szSearch=${encodeURIComponent(wineName)}&format=tab`;
    const searchRes = await fetch(searchUrl, {
      headers: { "Accept": "text/plain" },
      signal: AbortSignal.timeout(8000),
    });
    if (!searchRes.ok) { notesCache.set(cacheKey, []); return []; }

    const searchText = await searchRes.text();
    const searchRows = parseTSV(searchText);
    if (!searchRows.length) { notesCache.set(cacheKey, []); return []; }

    // Find best match — prefer exact name match, fall back to first result
    const nameLower = wineName.toLowerCase();
    const match = searchRows.find(r =>
      (r.Wine || r.iWine || "").toLowerCase().includes(nameLower.slice(0, 10))
    ) || searchRows[0];

    const iWineId = match.iWine || match.wine_id || match.WineId;
    if (!iWineId) { notesCache.set(cacheKey, []); return []; }

    // Step 2: Fetch notes for that iWine
    const notesUrl = `${CT_BASE}?q=list&type=Notes&User=wine&Password=wine&iWine=${encodeURIComponent(iWineId)}&format=tab`;
    const notesRes = await fetch(notesUrl, {
      headers: { "Accept": "text/plain" },
      signal: AbortSignal.timeout(8000),
    });
    if (!notesRes.ok) { notesCache.set(cacheKey, []); return []; }

    const notesText = await notesRes.text();
    const noteRows = parseTSV(notesText);
    if (!noteRows.length) { notesCache.set(cacheKey, []); return []; }

    // Step 3: Parse into standardized objects
    const notes = noteRows
      .map(row => {
        const rawScore = parseInt(row.Score || row.score || row.Rating || "0", 10);
        return {
          noteText: (row.Note || row.note || row.Notes || "").trim(),
          score: isNaN(rawScore) ? 0 : rawScore,
          reviewer: (row.Reviewer || row.reviewer || row.Author || row.User || "").trim(),
          noteDate: (row.NoteDate || row.note_date || row.Date || "").trim(),
        };
      })
      .filter(n => n.noteText.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    notesCache.set(cacheKey, notes);
    return notes;
  } catch (err) {
    console.warn("[cellarTracker] getCellarTrackerNotes error:", err.message);
    notesCache.set(cacheKey, []);
    return [];
  }
}

async function fetchCTPrice(wineName, vintage) {
  const name = encodeURIComponent(`${wineName} ${vintage || ""}`.trim());
  const url = `${CT_BASE}?User=api&Password=api&Format=json&Type=list&Wine=${name}&Vintage=${vintage || ""}`;

  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const text = await res.text();
    // CellarTracker returns CSV or JSON — detect
    if (text.startsWith("[") || text.startsWith("{")) {
      const data = JSON.parse(text);
      const wines = Array.isArray(data) ? data : data?.wines || [];
      if (!wines.length) return null;
      // Find best match
      const match = wines.find(w => {
        const wName = (w.Wine || w.name || "").toLowerCase();
        const wYear = String(w.Vintage || w.vintage || "");
        return wName.includes(wineName.toLowerCase().slice(0, 10)) &&
               (!vintage || wYear === String(vintage));
      }) || wines[0];
      const price = parseFloat(match?.Price || match?.price || 0);
      const currency = match?.Currency || "USD";
      return price > 0 ? { price, currency, source: "cellartracker" } : null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function runCellarTrackerCron() {
  if (!pool) return;

  console.log("[cellarTracker] Starting price update cron...");
  let updated = 0;
  let failed = 0;

  try {
    // Get all wines that haven't been updated in 6h from CellarTracker
    const { rows: wines } = await pool.query(`
      SELECT DISTINCT w.id, w.name, w.vintage, w.current_price
      FROM wines w
      LEFT JOIN price_cache pc ON pc.wine_id = w.id
      WHERE pc.wine_id IS NULL
         OR pc.updated_at < NOW() - INTERVAL '6 hours'
      ORDER BY w.investment_score DESC NULLS LAST
      LIMIT 50
    `);

    if (!wines.length) {
      console.log("[cellarTracker] No wines to update.");
      return;
    }

    console.log(`[cellarTracker] Fetching prices for ${wines.length} wines...`);

    // Process in batches of 5 to avoid rate limiting
    for (let i = 0; i < wines.length; i += 5) {
      const batch = wines.slice(i, i + 5);
      await Promise.all(batch.map(async (wine) => {
        try {
          const result = await fetchCTPrice(wine.name, wine.vintage);
          if (!result) { failed++; return; }

          // Convert to EUR if needed (rough conversion)
          let priceEur = result.price;
          if (result.currency === "USD") priceEur = result.price * 0.92;
          else if (result.currency === "GBP") priceEur = result.price * 1.17;

          // Insert into price_history
          await pool.query(`
            INSERT INTO price_history (wine_id, price, currency, source, recorded_at)
            VALUES ($1, $2, 'EUR', $3, NOW())
            ON CONFLICT DO NOTHING
          `, [wine.id, priceEur, result.source]);

          // Update price_cache
          await pool.query(`
            INSERT INTO price_cache (wine_id, vintage, price_avg, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (wine_id, vintage) DO UPDATE
              SET price_avg = $3, updated_at = NOW()
          `, [wine.id, wine.vintage || 0, priceEur]);

          updated++;
        } catch (e) {
          console.warn(`[cellarTracker] Failed for ${wine.name}:`, e.message);
          failed++;
        }
      }));

      // Rate limit: 500ms between batches
      if (i + 5 < wines.length) await new Promise(r => setTimeout(r, 500));
    }

    console.log(`[cellarTracker] Done. Updated: ${updated}, Failed: ${failed}`);
  } catch (e) {
    console.error("[cellarTracker] Cron error:", e.message);
  }
}

let cronInterval = null;

export function startCellarTrackerCron() {
  if (cronInterval) return;
  // First run after 30s startup delay
  setTimeout(runCellarTrackerCron, 30000);
  // Then every 6 hours
  cronInterval = setInterval(runCellarTrackerCron, 6 * 60 * 60 * 1000);
  console.log("[cellarTracker] Cron scheduled every 6 hours.");
}
