import express from "express";
import { createRequire } from "module";
import { ensureNotifTable, getAlertPool } from "../jobs/alertsChecker.js";

const require = createRequire(import.meta.url);
const webpush = require("web-push");

const router = express.Router();

// ── VAPID setup (only when both keys are present) ─────────────────────────────
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:contact@vinoinvest.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// ── push_subscriptions table creation ────────────────────────────────────────
let pushTableReady = false;

async function ensurePushTable(db) {
  if (pushTableReady) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        endpoint TEXT UNIQUE NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_id UUID,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id)`);
    pushTableReady = true;
  } catch (e) {
    console.warn("[notifications] push_subscriptions table init:", e.message);
  }
}

// ── Utility: send push to all subscriptions of a user ────────────────────────
export async function sendPushToUser(userId, title, body, url = "/") {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  const db = await getAlertPool();
  if (!db) return;
  try {
    const { rows } = await db.query(
      `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1`,
      [userId]
    );
    await Promise.allSettled(
      rows.map(row =>
        webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          JSON.stringify({ title, body, url })
        )
      )
    );
  } catch (e) {
    console.error("[notifications] sendPushToUser error:", e.message);
  }
}

// ── GET /vapid-public-key ─────────────────────────────────────────────────────
router.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
});

// ── POST /subscribe ───────────────────────────────────────────────────────────
router.post("/subscribe", async (req, res) => {
  const { subscription, userId } = req.body;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: "Invalid subscription object" });
  }
  const db = await getAlertPool();
  if (!db) return res.json({ success: true });
  await ensurePushTable(db);
  try {
    await db.query(
      `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE SET p256dh = $2, auth = $3, user_id = COALESCE($4, push_subscriptions.user_id)`,
      [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, userId || null]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /unsubscribe ─────────────────────────────────────────────────────────
router.post("/unsubscribe", async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ error: "endpoint required" });
  const db = await getAlertPool();
  if (!db) return res.json({ success: true });
  try {
    await db.query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [endpoint]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT /read-all/:userId — MUST be before /:id/read ────────────────────────
router.put("/read-all/:userId", async (req, res) => {
  const db = await getAlertPool();
  if (!db) return res.json({ success: true });
  try {
    await db.query(`UPDATE notifications SET read = true WHERE user_id = $1`, [req.params.userId]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET /:userId ──────────────────────────────────────────────────────────────
router.get("/:userId", async (req, res) => {
  const db = await getAlertPool();
  if (!db) return res.json([]);
  await ensureNotifTable(db);
  try {
    const { rows } = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT /:id/read ─────────────────────────────────────────────────────────────
router.put("/:id/read", async (req, res) => {
  const db = await getAlertPool();
  if (!db) return res.json({ success: true });
  try {
    await db.query(`UPDATE notifications SET read = true WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
