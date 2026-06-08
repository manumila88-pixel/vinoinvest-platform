/**
 * CellarTracker price cron — fetches community price data from CellarTracker public API.
 * API docs: https://www.cellartracker.com/api.asp
 * Free, no API key required for public wine lookup.
 * Runs every 6 hours. Updates price_cache and price_history with source="cellartracker".
 */

let pool = null;
export const setCellarTrackerPool = (p) => { pool = p; };

const CT_BASE = "https://www.cellartracker.com/api.asp";
const CACHE_TTL_HOURS = 6;

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
