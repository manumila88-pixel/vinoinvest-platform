/**
 * Email Flow Routes
 * Behavioral triggers, open/click tracking, preferences, analytics
 */
import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  triggerBehavioralEmail,
  trackEmailOpen,
  trackEmailClick,
  getEmailAnalytics,
  ensureEmailFlowTables,
} from "../services/emailFlowService.js";
import { SITE_URL } from "../config/site.js";

const router = express.Router();
let pool;
export const setEmailFlowRoutePool = (p) => { pool = p; };

// POST /api/email-flow/trigger — fire a behavioral email (internal or from authenticated user actions)
router.post("/trigger", requireAuth, async (req, res) => {
  try {
    const { event, wineName, currentPrice, courseName, months } = req.body;
    if (!event) return res.status(400).json({ error: "event required" });

    const result = await triggerBehavioralEmail(
      req.user.id,
      req.user.email,
      req.user.first_name || null,
      req.body.segment || "b2c",
      event,
      { wineName, currentPrice, courseName, months }
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/email-flow/track/open/:flowId — tracking pixel for email opens
// Called via <img src="/api/email-flow/track/open/123"> in email body
router.get("/track/open/:flowId", async (req, res) => {
  const { flowId } = req.params;
  if (flowId && !isNaN(flowId)) {
    trackEmailOpen(parseInt(flowId)).catch(() => {});
  }
  // Return 1x1 transparent GIF
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  res.set({ "Content-Type": "image/gif", "Cache-Control": "no-store" });
  res.end(pixel);
});

// GET /api/email-flow/track/click/:flowId — tracked redirect for email clicks
router.get("/track/click/:flowId", async (req, res) => {
  const { flowId } = req.params;
  const { url } = req.query;
  if (flowId && !isNaN(flowId)) {
    trackEmailClick(parseInt(flowId)).catch(() => {});
  }
  const safeUrl = url && url.startsWith("https://vinoinvest") ? url : SITE_URL;
  res.redirect(302, safeUrl);
});

// POST /api/email-flow/webhook — Resend webhook for open/click events
router.post("/webhook", async (req, res) => {
  try {
    const { type, data } = req.body || {};
    if (!pool || !type) return res.json({ ok: true });

    if (type === "email.opened" && data?.email_id) {
      await pool.query(
        `UPDATE email_flows SET opened_at = COALESCE(opened_at, NOW()) WHERE resend_id = $1`,
        [data.email_id]
      ).catch(() => {});
    }
    if (type === "email.clicked" && data?.email_id) {
      await pool.query(
        `UPDATE email_flows SET clicked_at = COALESCE(clicked_at, NOW()), opened_at = COALESCE(opened_at, NOW()) WHERE resend_id = $1`,
        [data.email_id]
      ).catch(() => {});
    }
    if (type === "email.bounced" && data?.to) {
      await pool.query(
        `UPDATE users SET email_subscribed = false WHERE email = $1`,
        [data.to]
      ).catch(() => {});
    }
    if (type === "email.complained" && data?.to) {
      await pool.query(
        `UPDATE users SET email_subscribed = false WHERE email = $1`,
        [data.to]
      ).catch(() => {});
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/email-flow/preferences — user's email flow preferences
router.get("/preferences", requireAuth, async (req, res) => {
  if (!pool) return res.json({});
  try {
    await ensureEmailFlowTables();
    const { rows } = await pool.query(
      `SELECT * FROM email_preferences WHERE user_id = $1`,
      [req.user.id]
    ).catch(() => ({ rows: [] }));
    res.json(rows[0] || { user_id: req.user.id, segment: 'b2c', frequency: 'weekly', subscribed: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/email-flow/preferences — update preferences
router.patch("/preferences", requireAuth, async (req, res) => {
  if (!pool) return res.json({ ok: true });
  try {
    const { segment, frequency, subscribed } = req.body;
    await pool.query(`
      INSERT INTO email_preferences (user_id, segment, frequency, subscribed, last_interaction)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        segment = COALESCE($2, email_preferences.segment),
        frequency = COALESCE($3, email_preferences.frequency),
        subscribed = COALESCE($4, email_preferences.subscribed),
        last_interaction = NOW()
    `, [req.user.id, segment, frequency, subscribed]).catch(() => {});
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/email-flow/analytics — admin: full analytics
router.get("/analytics", requireAdmin, async (_req, res) => {
  try {
    const data = await getEmailAnalytics();
    if (!data) return res.json({ error: "No data available" });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/email-flow/frequency — update frequency via email link (no auth)
router.post("/frequency", async (req, res) => {
  const { email, freq } = req.query;
  if (!email || !freq || !pool) return res.json({ ok: true });
  const allowed = ['weekly', 'monthly', 'daily'];
  if (!allowed.includes(freq)) return res.status(400).json({ error: "invalid frequency" });
  await pool.query(
    `UPDATE users SET notification_frequency = $1 WHERE email = $2`,
    [freq, email]
  ).catch(() => {});
  res.redirect(302, `${SITE_URL}/?msg=preferences_updated`);
});

export default router;
