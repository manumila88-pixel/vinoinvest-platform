import { pool } from "./pool.js";

export async function initDatabase() {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS wines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      region TEXT,
      current_price NUMERIC,
      risk TEXT,
      source TEXT DEFAULT 'demo'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      wine_id TEXT,
      quantity NUMERIC,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    INSERT INTO wines (
      id,
      name,
      region,
      current_price,
      risk,
      source
    )
    VALUES
    (
      'sassicaia-2016',
      'Sassicaia 2016',
      'Toscana',
      500,
      'medio',
      'demo'
    )
    ON CONFLICT (id) DO NOTHING;
  `);

}