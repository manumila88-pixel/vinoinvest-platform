import cron from "node-cron";
import { refreshPrice } from "../services/priceService.js";

const DELAY_MS = 1200; // pausa tra richieste per non sovraccaricare Wine-Searcher

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Ogni 6 ore: aggiorna prezzi dei top-100 vini più visti in portfolio
cron.schedule("0 */6 * * *", async () => {
  console.log("[priceUpdater] Avvio aggiornamento prezzi schedulato...");

  let pool = null;
  try {
    const mod = await import("../db/pool.js");
    pool = mod.pool;
  } catch {
    console.log("[priceUpdater] Nessuna connessione DB, salto.");
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.log("[priceUpdater] DATABASE_URL assente, salto.");
    return;
  }

  try {
    // Top 100 vini per numero di ordini
    const { rows: topWines } = await pool.query(`
      SELECT o.wine_id, pc.wine_name, pc.vintage
      FROM (
        SELECT wine_id, COUNT(*) AS cnt
        FROM orders
        GROUP BY wine_id
        ORDER BY cnt DESC
        LIMIT 100
      ) o
      LEFT JOIN price_cache pc ON pc.wine_id = o.wine_id
    `);

    let updated = 0;
    let failed = 0;

    for (const row of topWines) {
      if (!row.wine_name) continue; // nessun dato in cache, salta
      try {
        await refreshPrice(row.wine_id, row.wine_name, row.vintage, 90);
        updated++;
      } catch (e) {
        console.warn(`[priceUpdater] Fallito ${row.wine_id}: ${e.message}`);
        failed++;
      }
      await sleep(DELAY_MS);
    }

    console.log(`[priceUpdater] Completato. Aggiornati: ${updated}, Falliti: ${failed}`);
  } catch (e) {
    console.error("[priceUpdater] Errore generale:", e.message);
  }
});

console.log("[priceUpdater] Cron job registrato (ogni 6 ore).");
