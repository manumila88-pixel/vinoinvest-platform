import "dotenv/config";
import pkg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

function loadWines() {
  const base = join(__dirname, "../src/data");
  const a = JSON.parse(readFileSync(join(base, "wines.json"), "utf-8"));
  const b = JSON.parse(readFileSync(join(base, "externalWines.json"), "utf-8"));
  const c = JSON.parse(readFileSync(join(base, "bigWines.json"), "utf-8"));
  return [...a, ...b, ...c];
}

function getGrowthParams(region = "", country = "") {
  const r = (region + " " + country).toLowerCase();
  if (/bordeaux|france|french|médoc|pomerol|saint.?[eé]milion/.test(r)) return { annualGrowth: 0.08, volatility: 0.15 };
  if (/burgundy|bourgogne|côte|cote|beaune|nuits|chambolle|gevrey|vosne/.test(r)) return { annualGrowth: 0.12, volatility: 0.20 };
  if (/italy|italia|toscana|piemonte|etna|barolo|brunello|chianti|amarone|veneto/.test(r)) return { annualGrowth: 0.06, volatility: 0.12 };
  if (/champagne/.test(r)) return { annualGrowth: 0.05, volatility: 0.08 };
  return { annualGrowth: 0.04, volatility: 0.10 };
}

function seededRandom(seed) {
  let h = seed | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b | 0;
  h = (h >> 16) ^ h;
  return (h >>> 0) / 0xffffffff;
}

function generateHistory(wineId, basePrice, region, country) {
  const { annualGrowth, volatility } = getGrowthParams(region, country);
  const monthlyGrowth = annualGrowth / 12;
  const monthlyVol = volatility / 12;

  const now = new Date();
  const records = [];
  let price = basePrice / Math.pow(1 + monthlyGrowth, 36);
  if (price < 1) price = 1;

  for (let mo = 36; mo >= 1; mo--) {
    const date = new Date(now);
    date.setDate(1);
    date.setMonth(date.getMonth() - mo);
    date.setHours(12, 0, 0, 0);
    date.setMinutes(0, 0, 0);

    const seedStr = wineId + date.toISOString().slice(0, 7);
    const seedNum = seedStr.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
    const noise = (seededRandom(seedNum) - 0.5) * 2 * monthlyVol;

    price = price * (1 + monthlyGrowth) * (1 + noise);
    if (price < 1) price = 1;

    records.push({
      wineId,
      price: Math.round(price * 100) / 100,
      recorded_at: date.toISOString(),
    });
  }

  return records;
}

async function main() {
  console.log("Loading wines...");
  const wines = loadWines();
  console.log(`Loaded ${wines.length} wines`);

  // Ensure price_history table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_history (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      wine_id TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      currency TEXT DEFAULT 'EUR',
      source TEXT,
      recorded_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const BATCH = 100; // 100 wines per DB round-trip
  let processed = 0;
  let seeded = 0;

  for (let i = 0; i < wines.length; i += BATCH) {
    const batch = wines.slice(i, i + BATCH);
    const ids = batch.map(w => w.id);

    // Single query: which wines in this batch have < 36 estimated points
    const { rows: counts } = await pool.query(
      `SELECT wine_id, COUNT(*) as cnt
       FROM price_history
       WHERE wine_id = ANY($1)
         AND recorded_at > NOW() - INTERVAL '37 months'
         AND source = 'estimated'
       GROUP BY wine_id`,
      [ids]
    );
    const countMap = {};
    for (const r of counts) countMap[r.wine_id] = parseInt(r.cnt);

    // Determine which wines need seeding
    const toSeed = batch.filter(w => (countMap[w.id] || 0) < 36);

    if (toSeed.length > 0) {
      const toSeedIds = toSeed.map(w => w.id);

      // Single bulk DELETE for all wines needing seeding
      await pool.query(
        `DELETE FROM price_history
         WHERE wine_id = ANY($1)
           AND source = 'estimated'
           AND recorded_at > NOW() - INTERVAL '37 months'`,
        [toSeedIds]
      );

      // Generate all records for all wines needing seeding
      const allRecords = [];
      for (const wine of toSeed) {
        const basePrice = Number(wine.currentPrice || wine.current_price || 100);
        const recs = generateHistory(wine.id, basePrice, wine.region || "", wine.country || "");
        allRecords.push(...recs);
      }

      // Bulk INSERT in sub-batches of 500 rows to stay within param limits (1500 params)
      const ROW_BATCH = 500;
      for (let j = 0; j < allRecords.length; j += ROW_BATCH) {
        const chunk = allRecords.slice(j, j + ROW_BATCH);
        const placeholders = chunk.map((_, idx) =>
          `($${idx * 3 + 1}, $${idx * 3 + 2}, 'EUR', 'estimated', $${idx * 3 + 3})`
        ).join(", ");
        const params = chunk.flatMap(r => [r.wineId, r.price, r.recorded_at]);
        await pool.query(
          `INSERT INTO price_history (wine_id, price, currency, source, recorded_at)
           VALUES ${placeholders}`,
          params
        );
      }

      seeded += toSeed.length;
    }

    processed += batch.length;

    if (processed % 1000 === 0 || processed >= wines.length) {
      console.log(`Processed ${processed}/${wines.length} wines, seeded ${seeded}`);
    }

    // Small pause to avoid overwhelming the DB
    await new Promise(r => setTimeout(r, 50));
  }

  // Verify: spot-check 5 random wines
  console.log("\nVerifying random sample...");
  const sample = wines.filter((_, i) => [100, 1000, 5000, 25000, 49000].includes(i));
  for (const wine of sample) {
    const { rows } = await pool.query(
      `SELECT COUNT(*) as cnt FROM price_history WHERE wine_id = $1 AND source = 'estimated'`,
      [wine.id]
    );
    console.log(`  ${wine.id}: ${rows[0].cnt} points`);
  }

  console.log(`\nDone! Processed ${processed} wines, seeded history for ${seeded} wines.`);
  await pool.end();
}

main().catch(e => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
