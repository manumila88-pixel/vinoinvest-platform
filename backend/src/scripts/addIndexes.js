import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function addIndexes() {
  const indexes = [
    {
      name: "idx_price_history_wine_date",
      sql: "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_price_history_wine_date ON price_history(wine_id, recorded_at DESC)",
    },
    {
      name: "idx_wines_region_type",
      sql: "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wines_region_type ON wines(region, type, current_price)",
    },
    {
      name: "idx_orders_user",
      sql: "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user ON orders(user_id, created_at DESC)",
    },
    {
      name: "idx_notifications_user",
      sql: "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC)",
    },
  ];

  for (const idx of indexes) {
    try {
      await pool.query(idx.sql);
      console.log(`[OK] ${idx.name}`);
    } catch (e) {
      console.warn(`[SKIP] ${idx.name}: ${e.message}`);
    }
  }

  console.log("Indici creati");
  await pool.end();
}

addIndexes().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
