import cron from "node-cron";

let pool = null;
let notifTableReady = false;

async function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    try { const m = await import("../db/pool.js"); pool = m.pool; } catch {}
  }
  return pool;
}

async function ensureNotifTable(db) {
  if (notifTableReady) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id TEXT NOT NULL,
        wine_id TEXT,
        wine_name TEXT,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id)`);
    notifTableReady = true;
  } catch (e) {
    console.warn("[alertsChecker] Notif table init:", e.message);
  }
}

async function checkAlerts() {
  const db = await getPool();
  if (!db) return;
  await ensureNotifTable(db);

  try {
    const { rows: alerts } = await db.query(`
      SELECT pa.*, pc.price_avg AS current_price
      FROM price_alerts pa
      LEFT JOIN price_cache pc ON pc.wine_id = pa.wine_id
      WHERE pa.active = true AND pc.price_avg IS NOT NULL
    `);

    let triggered = 0;
    for (const alert of alerts) {
      const cur = Number(alert.current_price);
      const tgt = Number(alert.target_price);
      const hit = alert.direction === "below" ? cur <= tgt : cur >= tgt;
      if (!hit) continue;

      const dir = alert.direction === "below" ? "≤" : "≥";
      const msg = `🔔 ${alert.wine_name}: prezzo attuale €${cur.toFixed(0)} ${dir} target €${tgt.toFixed(0)}`;

      await db.query(
        `INSERT INTO notifications (user_id, wine_id, wine_name, message) VALUES ($1,$2,$3,$4)`,
        [alert.user_id, alert.wine_id, alert.wine_name, msg]
      );
      await db.query(`UPDATE price_alerts SET active = false WHERE id = $1`, [alert.id]);
      triggered++;
    }

    if (triggered > 0) console.log(`[alertsChecker] ${triggered} alert/i scattati.`);
  } catch (e) {
    console.error("[alertsChecker] Error:", e.message);
  }
}

// Every hour
cron.schedule("0 * * * *", checkAlerts);

// Expose table init for the notifications route
export { ensureNotifTable, getPool as getAlertPool };

console.log("[alertsChecker] Cron job registrato (ogni ora).");
