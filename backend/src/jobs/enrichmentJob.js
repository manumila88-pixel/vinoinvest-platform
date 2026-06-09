/**
 * Enrichment cron job — nightly background enrichment of wine records.
 * Runs at 03:15 daily (off-peak, after price updater at 00:00).
 * Enriches 100 wines per run (rate-limited to ~2.5 min).
 * To activate: add `import "./jobs/enrichmentJob.js";` in server.js
 */
import cron from "node-cron";
import {
  setEnrichmentPool,
  initEnrichmentTable,
  enrichBatch,
  getEnrichmentStats,
} from "../services/enrichmentService.js";
import { setVintageScoresPool } from "../services/vintageClimateService.js";

let initialised = false;

async function init() {
  if (initialised) return;
  initialised = true;

  let pool = null;
  try {
    const mod = await import("../db/pool.js");
    pool = mod.pool;
  } catch {
    console.warn("[enrichmentJob] No DB pool available — job disabled.");
    return;
  }

  if (!pool || !process.env.DATABASE_URL) {
    console.warn("[enrichmentJob] DATABASE_URL absent — job disabled.");
    return;
  }

  setEnrichmentPool(pool);
  setVintageScoresPool(pool);
  await initEnrichmentTable();

  console.log("[enrichmentJob] Cron registered (daily 03:15).");
}

// Daily at 03:15 — gentler on external APIs than midnight
cron.schedule("15 3 * * *", async () => {
  console.log("[enrichmentJob] Starting nightly enrichment…");
  try {
    await init();
    const result = await enrichBatch(100);
    const stats = await getEnrichmentStats();
    console.log("[enrichmentJob] Done:", result);
    if (stats) {
      console.log(
        `[enrichmentJob] DB stats — enriched: ${stats.enriched}, ` +
        `unenriched: ${stats.unenriched}, with_vintage_score: ${stats.with_vintage_score}`
      );
    }
  } catch (e) {
    console.error("[enrichmentJob] Unhandled error:", e.message);
  }
});

// Run init on startup (creates table, validates pool)
init().catch(e => console.warn("[enrichmentJob] init error:", e.message));
