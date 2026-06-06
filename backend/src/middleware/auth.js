import { createClient } from "@supabase/supabase-js";

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    : null;

function extractToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export async function requireAuth(req, res, next) {
  // If Supabase not configured (local dev), skip auth check
  if (!supabase) return next();

  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = data.user;
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
    if (data?.user) req.user = data.user;
  } catch {}
  next();
}
