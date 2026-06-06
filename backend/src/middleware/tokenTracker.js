// Tracks Anthropic API usage and cost in api_usage table
let pool = null;

export function setPool(p) { pool = p; }

export async function trackUsage({ model, tokens_input, tokens_output, cost_usd, endpoint }) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO api_usage (model, tokens_input, tokens_output, cost_usd, endpoint, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [model, tokens_input || 0, tokens_output || 0, cost_usd || 0, endpoint || "unknown"]
    );
  } catch (_) {}
}

export async function initUsageTable(p) {
  pool = p;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_usage (
        id SERIAL PRIMARY KEY,
        model TEXT,
        tokens_input INTEGER DEFAULT 0,
        tokens_output INTEGER DEFAULT 0,
        cost_usd NUMERIC(10,6) DEFAULT 0,
        endpoint TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at DESC)`).catch(() => {});
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint)`).catch(() => {});
  } catch (e) {
    console.warn("[tokenTracker] init:", e.message);
  }
}
