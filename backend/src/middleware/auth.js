import { createClient } from "@supabase/supabase-js";

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    : null;

export const ADMIN_EMAIL = "manumila88@gmail.com";

// In-memory login attempt tracker (per IP)
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 10;

export function trackLoginAttempt(ip, success) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { attempts: 0, windowStart: now, locked: false };

  // Reset window if expired
  if (now - entry.windowStart > LOGIN_WINDOW_MS) {
    entry.attempts = 0;
    entry.windowStart = now;
    entry.locked = false;
  }

  if (success) {
    entry.attempts = 0;
    entry.locked = false;
  } else {
    entry.attempts += 1;
    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) entry.locked = true;
  }
  loginAttempts.set(ip, entry);
  return entry;
}

export function isLoginLocked(ip) {
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.windowStart > LOGIN_WINDOW_MS) return false;
  return entry.locked;
}

function extractToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export async function requireAuth(req, res, next) {
  if (!supabase) return next();

  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = data.user;
    req.user.is_admin = data.user.email === ADMIN_EMAIL;
    next();
  } catch {
    res.status(401).json({ error: "Token validation failed" });
  }
}

export async function requireAdmin(req, res, next) {
  if (!supabase) return next(); // dev bypass

  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid or expired token" });
    if (data.user.email !== ADMIN_EMAIL) return res.status(403).json({ error: "Admin access required" });
    req.user = data.user;
    req.user.is_admin = true;
    next();
  } catch {
    res.status(401).json({ error: "Token validation failed" });
  }
}

export async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token || !supabase) return next();

  try {
    const { data } = await supabase.auth.getUser(token);
    if (data?.user) {
      req.user = data.user;
      req.user.is_admin = data.user.email === ADMIN_EMAIL;
    }
  } catch {}
  next();
}

// Checks subscription or admin bypass for course access
export async function checkCourseAccess(userEmail, courseLevel, pool) {
  if (!userEmail) return false;
  if (userEmail === ADMIN_EMAIL) return true;
  if (!pool) return false;

  try {
    const result = await pool.query(
      `SELECT plan, active FROM subscriptions WHERE user_email = $1 AND active = true`,
      [userEmail]
    );
    if (!result.rows.length) return false;
    const plan = result.rows[0].plan;
    if (courseLevel === "investor") return ["investor", "bundle", "pro", "professional"].includes(plan);
    if (courseLevel === "professional") return ["pro", "professional", "bundle"].includes(plan);
    return false;
  } catch {
    return false;
  }
}
