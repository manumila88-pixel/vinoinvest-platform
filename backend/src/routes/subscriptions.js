import express from "express";
import pg from "pg";
import { ADMIN_EMAIL, optionalAuth } from "../middleware/auth.js";

const router = express.Router();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// GET /api/subscriptions/status?email=
// Con Bearer token valido l'email viene dal token; ?email= resta come fallback
// per compatibilità col frontend attuale.
router.get("/status", optionalAuth, async (req, res) => {
  const email = req.user?.email || req.query.email;
  if (!email) return res.json({ active: false, plan: null });

  if (email === ADMIN_EMAIL) {
    return res.json({ active: true, plan: "admin", isAdmin: true, features: ["all"] });
  }

  try {
    const r = await pool.query(
      `SELECT plan, active, created_at, updated_at FROM subscriptions WHERE user_email = $1`,
      [email]
    );
    if (!r.rows.length) return res.json({ active: false, plan: null });
    const sub = r.rows[0];
    const features = [];
    if (sub.active) {
      features.push("academy_investor");
      if (["pro", "professional", "bundle"].includes(sub.plan)) features.push("academy_pro");
      if (sub.plan === "bundle") features.push("alerts_premium", "ai_signals");
    }
    res.json({ active: sub.active, plan: sub.plan, features, since: sub.created_at });
  } catch (e) {
    res.json({ active: false, plan: null });
  }
});

export default router;
