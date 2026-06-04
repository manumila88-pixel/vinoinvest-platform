import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const WINES = [
  { wine_id: "lafite-2015",            wine_name: "Château Lafite Rothschild 2015", base_price: 820,   monthly_trend: 0.025 },
  { wine_id: "petrus-2010",            wine_name: "Pétrus 2010",                    base_price: 4200,  monthly_trend: 0.032 },
  { wine_id: "romanee-conti-2018",     wine_name: "Romanée-Conti 2018",             base_price: 22000, monthly_trend: 0.040 },
  { wine_id: "barolo-monfortino-2016", wine_name: "Barolo Monfortino 2016",         base_price: 380,   monthly_trend: 0.018 },
  { wine_id: "sassicaia-2019",         wine_name: "Sassicaia 2019",                 base_price: 195,   monthly_trend: 0.022 },
];

// Deterministic pseudo-random based on seed value
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("❌  DATABASE_URL is not set in backend/.env — configure it first.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_cache (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      wine_id TEXT NOT NULL,
      wine_name TEXT NOT NULL,
      vintage INTEGER,
      price_min NUMERIC(10,2),
      price_max NUMERIC(10,2),
      price_avg NUMERIC(10,2),
      currency TEXT DEFAULT 'EUR',
      source TEXT DEFAULT 'seed',
      merchant_count INTEGER DEFAULT 0,
      last_updated TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(wine_id, vintage)
    )
  `);

  const now = new Date();
  let totalInserted = 0;

  for (const wine of WINES) {
    // 3 price records per month (beginning, mid, end) for 12 months
    const records = [];
    let price = wine.base_price;

    for (let monthsAgo = 11; monthsAgo >= 0; monthsAgo--) {
      for (let dayOffset of [1, 10, 20]) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - monthsAgo);
        date.setDate(dayOffset);

        const seed = wine.base_price + monthsAgo * 100 + dayOffset;
        const variation = 1 + (seededRand(seed) - 0.5) * 0.16; // ±8%
        const actualPrice = Math.round(price * variation * 100) / 100;

        records.push([wine.wine_id, actualPrice, "EUR", "seed", date.toISOString()]);
      }
      // Apply monthly trend at end of month
      price = price * (1 + wine.monthly_trend);
    }

    for (const rec of records) {
      await pool.query(
        `INSERT INTO price_history (wine_id, price, currency, source, recorded_at) VALUES ($1,$2,$3,$4,$5)`,
        rec
      );
    }

    // Also upsert into price_cache so /api/prices/:id returns data immediately
    const latestPrice = records[records.length - 1][1];
    const allPrices = records.map(r => Number(r[1]));
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const avgP = Math.round(allPrices.reduce((s, p) => s + p, 0) / allPrices.length * 100) / 100;

    await pool.query(
      `INSERT INTO price_cache (wine_id, wine_name, vintage, price_min, price_max, price_avg, currency, source, merchant_count, last_updated)
       VALUES ($1,$2,NULL,$3,$4,$5,'EUR','seed',5,NOW())
       ON CONFLICT (wine_id, vintage) DO UPDATE SET
         price_min=EXCLUDED.price_min, price_max=EXCLUDED.price_max,
         price_avg=EXCLUDED.price_avg, last_updated=NOW()`,
      [wine.wine_id, wine.wine_name, minP, maxP, avgP]
    );

    totalInserted += records.length;
    console.log(`✓  ${wine.wine_id}  (${records.length} records, avg € ${avgP})`);
  }

  await pool.end();
  console.log(`\n✅  Done — ${totalInserted} price_history rows + ${WINES.length} cache entries inserted.`);
}

run().catch(err => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
