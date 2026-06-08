import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
let pool;
export const setEmailPrefPool = (p) => { pool = p; };

// GET /api/email-preferences
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT email_subscribed, notification_frequency, preferred_regions, preferred_types FROM users WHERE id = $1",
      [req.user.id]
    ).catch(() => ({ rows: [] }));

    res.json(rows[0] || {
      email_subscribed: true,
      notification_frequency: "weekly",
      preferred_regions: [],
      preferred_types: [],
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/email-preferences
router.patch("/", requireAuth, async (req, res) => {
  try {
    const { email_subscribed, notification_frequency, preferred_regions, preferred_types, price_range_min, price_range_max, risk_tolerance, investment_horizon } = req.body;

    await pool.query(`
      UPDATE users SET
        email_subscribed = COALESCE($1, email_subscribed),
        notification_frequency = COALESCE($2, notification_frequency),
        preferred_regions = COALESCE($3, preferred_regions),
        preferred_types = COALESCE($4, preferred_types),
        price_range_min = COALESCE($5, price_range_min),
        price_range_max = COALESCE($6, price_range_max),
        risk_tolerance = COALESCE($7, risk_tolerance),
        investment_horizon = COALESCE($8, investment_horizon)
      WHERE id = $9
    `, [email_subscribed, notification_frequency, preferred_regions, preferred_types, price_range_min, price_range_max, risk_tolerance, investment_horizon, req.user.id]).catch(() => {});

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/email-preferences/test — send test email
router.post("/test", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]).catch(() => ({ rows: [] }));
    const user = rows[0] || { email: req.user.email };

    const { sendWelcomeEmail } = await import("../services/emailService.js");
    const result = await sendWelcomeEmail(user);

    res.json({ ok: result.ok, id: result.id, error: result.error });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/email-preferences/subscribe (no auth — exit intent, landing)
router.post("/subscribe", async (req, res) => {
  try {
    const { email, source = "website", list = "newsletter" } = req.body;
    if (!email || !email.includes("@")) return res.status(400).json({ error: "valid email required" });

    if (!pool) return res.json({ ok: true, message: "Stored" });

    // Upsert into newsletter_subscribers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        email TEXT PRIMARY KEY,
        source TEXT DEFAULT 'website',
        list TEXT DEFAULT 'newsletter',
        subscribed_at TIMESTAMPTZ DEFAULT NOW(),
        unsubscribed_at TIMESTAMPTZ
      )
    `).catch(() => {});

    await pool.query(`
      INSERT INTO newsletter_subscribers (email, source, list)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET source = EXCLUDED.source, list = EXCLUDED.list
    `, [email.toLowerCase().trim(), source, list]).catch(() => {});

    // Also mark subscribed in users table if they already have an account
    await pool.query("UPDATE users SET email_subscribed = true WHERE email = $1", [email.toLowerCase().trim()]).catch(() => {});

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/email-preferences/unsubscribe (no auth — from email link)
router.post("/unsubscribe", async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email) return res.status(400).json({ error: "email required" });

    await pool.query("UPDATE users SET email_subscribed = false WHERE email = $1", [email]).catch(() => {});

    res.json({ ok: true, message: "You have been unsubscribed." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
