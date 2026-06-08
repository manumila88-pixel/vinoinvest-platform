import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

// ── Config ────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const DEMO_EMAIL = "demo@vinoinvest.com";
const DEMO_PASSWORD = "Demo2026!";

// ── Wines ─────────────────────────────────────────────────────────────────────

const WINES = [
  { id: "petrus-2010",             name: "Pétrus 2010",                    producer: "Pétrus",                   vintage: 2010, current_price: 3200, ai_score: 96, risk: "Basso", market_trend: "rising"  },
  { id: "barolo-monfortino-2016",  name: "Barolo Monfortino 2016",         producer: "Giacomo Conterno",         vintage: 2016, current_price: 420,  ai_score: 94, risk: "Basso", market_trend: "stable"  },
  { id: "sassicaia-2019",          name: "Sassicaia 2019",                 producer: "Tenuta San Guido",         vintage: 2019, current_price: 180,  ai_score: 90, risk: "Medio", market_trend: "rising"  },
  { id: "dom-perignon-2013",       name: "Dom Pérignon 2013",              producer: "Moët & Chandon",           vintage: 2013, current_price: 220,  ai_score: 91, risk: "Basso", market_trend: "stable"  },
  { id: "romanee-conti-2018",      name: "Romanée-Conti 2018",            producer: "DRC",                      vintage: 2018, current_price: 8500, ai_score: 99, risk: "Basso", market_trend: "rising"  },
  { id: "chateau-margaux-2015",    name: "Chateau Margaux 2015",          producer: "Château Margaux",          vintage: 2015, current_price: 890,  ai_score: 95, risk: "Basso", market_trend: "rising"  },
  { id: "opus-one-2019",           name: "Opus One 2019",                 producer: "Opus One Winery",         vintage: 2019, current_price: 340,  ai_score: 89, risk: "Medio", market_trend: "stable"  },
  { id: "krug-grande-cuvee",       name: "Krug Grande Cuvée",             producer: "Krug",                    vintage: 2010, current_price: 180,  ai_score: 92, risk: "Basso", market_trend: "stable"  },
  { id: "barolo-monprivato-2016",  name: "Barolo Riserva Monprivato 2016", producer: "Giuseppe Mascarello",    vintage: 2016, current_price: 180,  ai_score: 88, risk: "Medio", market_trend: "stable"  },
  { id: "brunello-biondi-santi-2016", name: "Brunello Biondi Santi 2016", producer: "Biondi-Santi",           vintage: 2016, current_price: 350,  ai_score: 93, risk: "Basso", market_trend: "rising"  },
  { id: "amarone-quintarelli-2015", name: "Amarone Quintarelli 2015",     producer: "Giuseppe Quintarelli",    vintage: 2015, current_price: 280,  ai_score: 91, risk: "Basso", market_trend: "stable"  },
  { id: "champagne-salon-2012",    name: "Champagne Salon 2012",          producer: "Salon",                   vintage: 2012, current_price: 450,  ai_score: 94, risk: "Basso", market_trend: "rising"  },
  { id: "ridge-monte-bello-2018",  name: "Ridge Monte Bello 2018",        producer: "Ridge Vineyards",         vintage: 2018, current_price: 95,   ai_score: 85, risk: "Medio", market_trend: "stable"  },
  { id: "penfolds-grange-2018",    name: "Penfolds Grange 2018",          producer: "Penfolds",                vintage: 2018, current_price: 380,  ai_score: 90, risk: "Medio", market_trend: "rising"  },
  { id: "vega-sicilia-unico-2012", name: "Vega Sicilia Unico 2012",       producer: "Vega Sicilia",            vintage: 2012, current_price: 320,  ai_score: 92, risk: "Basso", market_trend: "stable"  },
];

// Holdings: [wine_id, quantity, buy_price, months_ago_bought]
const HOLDINGS = [
  ["petrus-2010",             2,  2800, 18],
  ["barolo-monfortino-2016",  5,  380,  12],
  ["sassicaia-2019",          10, 155,  8],
  ["dom-perignon-2013",       8,  190,  14],
  ["romanee-conti-2018",      1,  7200, 24],
  ["chateau-margaux-2015",    3,  760,  16],
  ["opus-one-2019",           6,  290,  10],
  ["krug-grande-cuvee",       12, 150,  6],
  ["barolo-monprivato-2016",  4,  155,  9],
  ["brunello-biondi-santi-2016", 5, 300, 11],
  ["amarone-quintarelli-2015", 4, 240, 7],
  ["champagne-salon-2012",    3,  380,  20],
  ["ridge-monte-bello-2018",  8,  80,   5],
  ["penfolds-grange-2018",    4,  320,  13],
  ["vega-sicilia-unico-2012", 6,  270,  15],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("❌  DATABASE_URL not set");
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("❌  SUPABASE_URL or SUPABASE_ANON_KEY not set");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // ── Step 1: Create or retrieve Supabase user ──────────────────────────────

  console.log("\n── Step 1: Supabase user ────────────────────────────────────");
  let demoUserId = null;

  const signUpRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      data: { account_type: "wealth_manager", full_name: "Demo Advisor" },
    }),
  });

  const signUpData = await signUpRes.json();

  if (signUpData?.user?.id) {
    demoUserId = signUpData.user.id;
    console.log(`✓  Created Supabase user: ${demoUserId}`);
  } else {
    // User already exists — sign in to get the ID
    const errMsg = signUpData?.msg || signUpData?.error_description || signUpData?.message || JSON.stringify(signUpData);
    console.log(`   Signup response: ${errMsg} — trying sign-in…`);

    const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
    });

    const signInData = await signInRes.json();

    if (signInData?.user?.id) {
      demoUserId = signInData.user.id;
      console.log(`✓  Retrieved existing Supabase user: ${demoUserId}`);
    } else {
      console.error("❌  Could not obtain demo user ID:", JSON.stringify(signInData));
      process.exit(1);
    }
  }

  // ── Step 2: Ensure wines table + columns ─────────────────────────────────

  console.log("\n── Step 2: wines table columns ──────────────────────────────");

  // Create wines table first if it doesn't exist (mirrors init.js baseline)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT,
      current_price NUMERIC,
      risk TEXT,
      source TEXT DEFAULT 'demo'
    )
  `);
  console.log("✓  Table wines ensured");

  const wineColumns = [
    ["producer",         "TEXT"],
    ["vintage",          "INTEGER"],
    ["investment_score", "NUMERIC"],
    ["risk",             "TEXT"],
    ["market_trend",     "TEXT"],
    ["image_url",        "TEXT"],
    ["ai_score",         "NUMERIC"],
  ];

  for (const [col, type] of wineColumns) {
    try {
      await pool.query(`ALTER TABLE wines ADD COLUMN IF NOT EXISTS ${col} ${type}`);
      console.log(`✓  Column wines.${col} ensured`);
    } catch (err) {
      console.log(`   Column wines.${col}: ${err.message}`);
    }
  }

  // ── Step 3: Upsert 15 premium wines ──────────────────────────────────────

  console.log("\n── Step 3: Insert 15 premium wines ─────────────────────────");

  for (const w of WINES) {
    await pool.query(
      `INSERT INTO wines (id, name, producer, vintage, current_price, investment_score, ai_score, risk, market_trend)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         producer = EXCLUDED.producer,
         vintage = EXCLUDED.vintage,
         current_price = EXCLUDED.current_price,
         investment_score = EXCLUDED.investment_score,
         ai_score = EXCLUDED.ai_score,
         risk = EXCLUDED.risk,
         market_trend = EXCLUDED.market_trend`,
      [w.id, w.name, w.producer, w.vintage, w.current_price, w.ai_score, w.ai_score, w.risk, w.market_trend]
    );
    console.log(`✓  Wine: ${w.id}`);
  }

  // ── Step 4: Create demo_portfolio_holdings and insert ────────────────────

  console.log("\n── Step 4: demo_portfolio_holdings ──────────────────────────");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS demo_portfolio_holdings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      wine_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      buy_price NUMERIC NOT NULL,
      bought_at TIMESTAMPTZ NOT NULL,
      notes TEXT,
      UNIQUE(user_id, wine_id)
    )
  `);
  console.log("✓  Table demo_portfolio_holdings ensured");

  const now = new Date();

  for (const [wineId, quantity, buyPrice, monthsAgo] of HOLDINGS) {
    const boughtAt = new Date(now);
    boughtAt.setMonth(boughtAt.getMonth() - monthsAgo);

    await pool.query(
      `INSERT INTO demo_portfolio_holdings (user_id, wine_id, quantity, buy_price, bought_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, wine_id) DO UPDATE SET
         quantity = EXCLUDED.quantity,
         buy_price = EXCLUDED.buy_price,
         bought_at = EXCLUDED.bought_at`,
      [demoUserId, wineId, quantity, buyPrice, boughtAt.toISOString()]
    );
    console.log(`✓  Holding: ${wineId} × ${quantity} @ €${buyPrice}`);
  }

  // ── Step 5: Org tables + demo org + 3 clients ─────────────────────────────

  console.log("\n── Step 5: Organizations + client portfolios ─────────────────");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      type TEXT DEFAULT 'wealth_manager',
      plan TEXT DEFAULT 'starter',
      seats INTEGER DEFAULT 3,
      logo_url TEXT,
      brand_color TEXT DEFAULT '#2563eb',
      custom_domain TEXT,
      owner_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS org_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      user_email TEXT,
      role TEXT DEFAULT 'analyst',
      permissions JSONB DEFAULT '{}',
      invited_at TIMESTAMPTZ DEFAULT NOW(),
      accepted_at TIMESTAMPTZ,
      UNIQUE(org_id, user_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS client_portfolios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      client_email TEXT,
      advisor_id TEXT,
      aum_wine NUMERIC DEFAULT 0,
      notes TEXT,
      last_contact TIMESTAMPTZ,
      next_review TIMESTAMPTZ,
      kyc_status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  console.log("✓  Org tables ensured");

  // Create demo org (owner_id must be unique-ish — use DO NOTHING to avoid dup)
  const { rows: orgRows } = await pool.query(
    `INSERT INTO organizations (name, type, plan, owner_id)
     VALUES ('Demo Wealth Advisory', 'wealth_manager', 'professional', $1)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [demoUserId]
  );

  let orgId;
  if (orgRows.length > 0) {
    orgId = orgRows[0].id;
    console.log(`✓  Created org: Demo Wealth Advisory (${orgId})`);

    // Add owner as org member
    await pool.query(
      `INSERT INTO org_members (org_id, user_id, user_email, role)
       VALUES ($1, $2, $3, 'owner')
       ON CONFLICT (org_id, user_id) DO NOTHING`,
      [orgId, demoUserId, DEMO_EMAIL]
    );
    console.log("✓  Demo user added as org owner");
  } else {
    // Org already exists — look it up
    const { rows: existing } = await pool.query(
      `SELECT id FROM organizations WHERE owner_id = $1 LIMIT 1`,
      [demoUserId]
    );
    orgId = existing[0]?.id;
    console.log(`✓  Existing org found: ${orgId}`);
  }

  // Insert 3 clients
  const clients = [
    { name: "Andrea Rossi",   email: "andrea.rossi@example.com",  aum: 450000 },
    { name: "Sofia Bianchi",  email: "sofia.bianchi@example.com", aum: 280000 },
    { name: "Marco Ferrari",  email: "marco.ferrari@example.com", aum: 185000 },
  ];

  for (const c of clients) {
    await pool.query(
      `INSERT INTO client_portfolios (org_id, client_name, client_email, advisor_id, aum_wine, kyc_status)
       VALUES ($1, $2, $3, $4, $5, 'approved')
       ON CONFLICT DO NOTHING`,
      [orgId, c.name, c.email, demoUserId, c.aum]
    );
    console.log(`✓  Client: ${c.name} (AUM €${c.aum.toLocaleString()})`);
  }

  // ── Step 6: Generate 24-month price history ───────────────────────────────

  console.log("\n── Step 6: 24-month price history ───────────────────────────");

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

  let totalInserted = 0;

  for (const wine of WINES) {
    const monthlyTrend = wine.market_trend === "rising" ? 0.022 : 0.008;
    let price = wine.current_price * 0.65; // start lower 24 months ago

    const records = [];

    for (let monthsAgo = 23; monthsAgo >= 0; monthsAgo--) {
      for (const dayOffset of [1, 10, 20]) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - monthsAgo);
        date.setDate(dayOffset);

        const seed = wine.current_price + monthsAgo * 100 + dayOffset;
        const variation = 1 + (seededRand(seed) - 0.5) * 0.14; // ±7%
        const actualPrice = Math.round(price * variation * 100) / 100;

        records.push([wine.id, actualPrice, "EUR", "demo_seed", date.toISOString()]);
      }
      price = price * (1 + monthlyTrend);
    }

    // Batch insert using unnest for performance
    const wineIds   = records.map(r => r[0]);
    const prices    = records.map(r => r[1]);
    const currencies = records.map(r => r[2]);
    const sources   = records.map(r => r[3]);
    const dates     = records.map(r => r[4]);

    await pool.query(
      `INSERT INTO price_history (wine_id, price, currency, source, recorded_at)
       SELECT * FROM unnest($1::text[], $2::numeric[], $3::text[], $4::text[], $5::timestamptz[])`,
      [wineIds, prices, currencies, sources, dates]
    );

    totalInserted += records.length;
    console.log(`✓  ${wine.id}  (${records.length} records)`);
  }

  await pool.end();

  console.log(`\n✅  Demo account setup complete!`);
  console.log(`   User ID    : ${demoUserId}`);
  console.log(`   Email      : ${DEMO_EMAIL}`);
  console.log(`   Password   : ${DEMO_PASSWORD}`);
  console.log(`   Org ID     : ${orgId}`);
  console.log(`   Wines      : ${WINES.length}`);
  console.log(`   Holdings   : ${HOLDINGS.length}`);
  console.log(`   Clients    : ${clients.length}`);
  console.log(`   Price rows : ${totalInserted}`);
}

run().catch(err => {
  console.error("❌  Script failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
