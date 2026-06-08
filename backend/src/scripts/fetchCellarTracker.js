import "dotenv/config";
import pg from "pg";
import { createRequire } from "module";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const _require = createRequire(import.meta.url);
const wines = [
  ..._require("../data/wines.json"),
  ..._require("../data/externalWines.json"),
  ..._require("../data/bigWines.json"),
];

const CT_BASE = "https://www.cellartracker.com/api.asp";

async function fetchCTPrice(wineName, vintage) {
  const name = encodeURIComponent(`${wineName} ${vintage || ""}`.trim());
  const url = `${CT_BASE}?User=api&Password=api&Format=json&Type=list&Wine=${name}&Vintage=${vintage || ""}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      if (res.status === 403) console.warn(`[CT] 403 blocked by CloudFront — API key or credentials required for ${name}`);
      return null;
    }
    const text = await res.text();
    if (!text.startsWith("[") && !text.startsWith("{")) return null;
    const data = JSON.parse(text);
    const list = Array.isArray(data) ? data : data?.wines || [];
    if (!list.length) return null;
    const match =
      list.find((w) => {
        const wName = (w.Wine || w.name || "").toLowerCase();
        const wYear = String(w.Vintage || w.vintage || "");
        return (
          wName.includes(wineName.toLowerCase().slice(0, 10)) &&
          (!vintage || wYear === String(vintage))
        );
      }) || list[0];
    const price = parseFloat(match?.Price || match?.price || 0);
    const currency = match?.Currency || "USD";
    return price > 0 ? { price, currency } : null;
  } catch {
    return null;
  }
}

async function run() {
  // Top 500 by investmentScore
  const top500 = wines
    .slice()
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, 500);

  console.log(`[fetchCellarTracker] Processing ${top500.length} wines...`);
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < top500.length; i += 5) {
    const batch = top500.slice(i, i + 5);
    await Promise.all(
      batch.map(async (wine) => {
        const name = wine.name || wine.wineName || "";
        const vintage = wine.vintage || null;
        try {
          const result = await fetchCTPrice(name, vintage);
          if (!result) { failed++; return; }

          let priceEur = result.price;
          if (result.currency === "USD") priceEur = result.price * 0.92;
          else if (result.currency === "GBP") priceEur = result.price * 1.17;

          await pool.query(
            `INSERT INTO price_history (wine_id, price, currency, source, recorded_at)
             VALUES ($1, $2, 'EUR', 'cellartracker', NOW())
             ON CONFLICT DO NOTHING`,
            [wine.id, priceEur]
          );

          await pool.query(
            `INSERT INTO price_cache (wine_id, vintage, price_avg, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (wine_id, vintage) DO UPDATE
               SET price_avg = $3, updated_at = NOW()`,
            [wine.id, vintage || 0, priceEur]
          );

          updated++;
        } catch (e) {
          console.warn(`[fetchCellarTracker] Failed ${name}: ${e.message}`);
          failed++;
        }
      })
    );

    if (i + 5 < top500.length) await new Promise((r) => setTimeout(r, 600));

    if ((i + 5) % 50 === 0) {
      console.log(`  Progress: ${Math.min(i + 5, top500.length)}/${top500.length} — updated: ${updated}, failed: ${failed}`);
    }
  }

  console.log(`[fetchCellarTracker] Done. Updated: ${updated}, Failed: ${failed}`);
  await pool.end();
}

run().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
