import express from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, trackLoginAttempt, isLoginLocked, ADMIN_EMAIL } from "../middleware/auth.js";
import { enqueueUserFlow } from "../jobs/emailFlowService.js";

const router = express.Router();

// 5 login attempts per 15 min per IP — enforced at HTTP layer before business logic
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { locked: true, error: "Troppi tentativi. Attendi 15 minuti." },
});

let pool = null;
export function setAuthPool(p) { pool = p; }

async function logSecurityEvent(type, ip, email, details) {
  if (!pool) return;
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS security_events (id SERIAL PRIMARY KEY, event_type TEXT NOT NULL, ip TEXT, user_email TEXT, details JSONB, created_at TIMESTAMPTZ DEFAULT NOW())`,
    );
    await pool.query(
      `INSERT INTO security_events (event_type, ip, user_email, details) VALUES ($1,$2,$3,$4)`,
      [type, ip, email, JSON.stringify(details || {})]
    );
  } catch {}
}

// POST /api/auth/login-check — rate limit check before Supabase login attempt
// Frontend calls this first; if locked, shows lockout message without hitting Supabase
router.post("/login-check", loginRateLimit, (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  if (isLoginLocked(ip)) {
    logSecurityEvent("login_locked", ip, req.body?.email, { reason: "max_attempts_exceeded" });
    return res.status(429).json({ locked: true, error: "Troppi tentativi. Attendi 15 minuti." });
  }
  res.json({ locked: false });
});

// POST /api/auth/login-result — called after Supabase login to track success/failure
router.post("/login-result", loginRateLimit, (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const { success, email, firstName, userType, isNew } = req.body;
  const entry = trackLoginAttempt(ip, success === true);
  if (!success) {
    logSecurityEvent("login_failure", ip, email, { attempts: entry.attempts });
    if (entry.locked) logSecurityEvent("login_locked", ip, email, { attempts: entry.attempts });
  }
  // On first registration, start the 180-day email flow
  if (success && isNew && email) {
    enqueueUserFlow(email, firstName || null, userType || "b2c").catch(() => {});
  }
  res.json({ ok: true, locked: entry.locked, attempts: entry.attempts });
});

// GET /api/auth/me — returns authenticated user info from Supabase JWT
router.get("/me", requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    is_admin: req.user.email === ADMIN_EMAIL,
    created_at: req.user.created_at,
    account_type: req.user.user_metadata?.account_type || "b2c",
  });
});

export default router;
