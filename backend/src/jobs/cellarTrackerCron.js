import cron from "node-cron";
import { refreshPrice } from "../services/priceService.js";

const DELAY_MS = 800;
const BATCH_SIZE = 500;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runCellarTrackerUpdate() {
  console.log("[cellarTrackerCron] Starting top-500 price update...");

  let pool;
  try {
    const mod = await import("../db/pool.js");
    pool = mod.pool;
  } catch {
    console.log("[cellarTrackerCron] No DB connection, skipping.");
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.log("[cellarTrackerCron] DATABASE_URL missing, skipping.");
    return;
  }

  try {
    const { rows: topWines } = await pool.query(`
      SELECT id AS wine_id, name AS wine_name, vintage
      FROM wines
      WHERE investment_score IS NOT NULL
      ORDER BY investment_score DESC NULLS LAST, current_price DESC NULLS LAST
      LIMIT $1
    `, [BATCH_SIZE]);

    let updated = 0;
    let failed = 0;

    for (const row of topWines) {
      try {
        await refreshPrice(row.wine_id, row.wine_name, row.vintage, 90);
        updated++;
      } catch (e) {
        failed++;
        if (failed <= 5) console.warn(`[cellarTrackerCron] Failed ${row.wine_id}: ${e.message}`);
      }
      await sleep(DELAY_MS);
    }

    console.log(`[cellarTrackerCron] Done. Updated: ${updated}, Failed: ${failed}`);

    await pool.query(`
      INSERT INTO price_update_log (source, wines_updated, wines_failed, ran_at)
      VALUES ('cellartracker-cron', $1, $2, NOW())
      ON CONFLICT DO NOTHING
    `, [updated, failed]).catch(() => {});
  } catch (e) {
    console.error("[cellarTrackerCron] Fatal error:", e.message);
  }
}

// Run daily at 02:00
cron.schedule("0 2 * * *", runCellarTrackerUpdate);

console.log("[cellarTrackerCron] Registered (daily at 02:00) — top-500 wines by investment score.");

export { runCellarTrackerUpdate };
