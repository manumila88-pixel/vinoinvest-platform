/**
 * Welcome Email Sequence — 5-email drip campaign via Resend
 * Day 0: Welcome (sent immediately on registration via auth route)
 * Day 3: First wine discovery
 * Day 7: Portfolio builder intro
 * Day 14: Market insights & alerts
 * Day 30: Upgrade to Pro offer
 */
import cron from "node-cron";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "VinoInvest <noreply@vinoinvest.com>";
const BASE_URL = "https://vinoinvest-platform.vercel.app";

let _pool = null;
export function setWelcomeEmailPool(p) { _pool = p; }

async function ensureTable() {
  if (!_pool) return;
  await _pool.query(`
    CREATE TABLE IF NOT EXISTS welcome_email_queue (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_email TEXT NOT NULL,
      first_name TEXT,
      day_num INTEGER NOT NULL,
      send_after TIMESTAMPTZ NOT NULL,
      sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_email, day_num)
    )
  `).catch(() => {});
}

function layout(content, email) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>body{margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;color:#1a1a2e}.w{max-width:600px;margin:0 auto;background:#fff}.h{background:#020617;padding:24px 32px}.logo{font-family:Georgia,serif;font-size:26px;font-weight:900;color:#fff}.logo span{color:#C9A227}.b{padding:32px}.btn{display:inline-block;padding:12px 24px;background:#C9A227;color:#020617!important;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px}.s{margin:24px 0;padding:20px;background:#f8f9fa;border-radius:10px}.disc{font-size:11px;color:#aaa;margin-top:16px;padding:12px;background:#f8f4ef;border-radius:6px}.f{background:#f8f4ef;padding:20px 32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #e5e7eb}a{color:#C9A227}</style>
</head><body><div class="w"><div class="h"><div class="logo">Vino<span>Invest</span></div><div style="font-size:12px;color:#64748b;margin-top:4px">Fine Wine Intelligence Platform</div></div>
<div class="b">${content}<div class="disc">⚠️ Informational only. Not financial advice. Wine investment carries risk.</div></div>
<div class="f"><p>You're registered on VinoInvest.</p><p><a href="${BASE_URL}/settings/notifications">Manage preferences</a> · <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p><p>VinoInvest · Milan, Italy · © ${new Date().getFullYear()}</p></div>
</div></body></html>`;
}

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) return { ok: false };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html, text: html.replace(/<[^>]+>/g, " ") }),
  });
  return res.ok ? { ok: true } : { ok: false };
}

function getTemplate(dayNum, firstName) {
  const name = firstName || "Wine enthusiast";
  switch (dayNum) {
    case 3:
      return {
        subject: `${name}, discover your first investment-grade wine 🍷`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Your First Wine Discovery 🍷</h2>
<p>Hi ${name}, you joined VinoInvest 3 days ago. Let's find your first great investment.</p>
<div class="s">
  <p><strong>🏆 Editor's Pick This Week:</strong> Château Lynch-Bages 2019</p>
  <p>📍 Pauillac, Bordeaux · AI Score: <strong>89/100</strong></p>
  <p>💰 Current price: <strong>€185/bottle</strong> · Market trend: <span style="color:#16a34a">📈 +12% YoY</span></p>
  <p>Risk level: <strong>Low-Medium</strong> · Recommended hold: 5–10 years</p>
</div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/?search=lynch-bages" class="btn">Explore This Wine →</a></p>
<p>Or use our <a href="${BASE_URL}/?section=portfolio">AI Portfolio Builder</a> to find wines matching your exact budget and risk tolerance.</p>`,
      };
    case 7:
      return {
        subject: `Build your wine portfolio in 5 minutes — here's how`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Build Your Portfolio in 5 Minutes 📊</h2>
<p>Hi ${name}, week one down — time to start tracking your investments.</p>
<div class="s">
  <p><strong>How it works:</strong></p>
  <p>1. 🔍 Search for a wine in the <a href="${BASE_URL}">marketplace</a></p>
  <p>2. 👆 Click "Add to Portfolio" on any wine card</p>
  <p>3. 📈 Watch your returns tracked in real time</p>
  <p>4. 🤖 Get AI analysis of your full portfolio</p>
</div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/?section=myportfolio" class="btn">Open My Portfolio →</a></p>
<p style="font-size:12px;color:#888">Pro tip: The AI Portfolio tab generates a fully optimized allocation for your budget — set it up in 60 seconds.</p>`,
      };
    case 14:
      return {
        subject: `Wine market this week: what smart investors are watching`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Market Insights — Week 2 📰</h2>
<p>Hi ${name}, here's what's moving in the fine wine market right now.</p>
<div class="s">
  <p><strong>🔥 Trending Regions:</strong> Burgundy (+8% avg), Barolo (+6%), Champagne (+4%)</p>
  <p><strong>📉 Under Watch:</strong> Some 2020 Bordeaux futures trading below issue price</p>
  <p><strong>💎 Best Value Right Now:</strong> Ribera del Duero — AI score 82, avg price €45</p>
</div>
<p>Set a <strong>price alert</strong> for any wine — we'll notify you instantly when the price hits your target.</p>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/?section=alerts" class="btn">Set Price Alerts →</a></p>
<p>Also explore our <a href="${BASE_URL}/market-index">Market Index</a> — real-time composite of the 100 most-traded investment wines.</p>`,
      };
    case 30:
      return {
        subject: `One month on VinoInvest — unlock the full platform 🔓`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">You've Been With Us a Month! 🎉</h2>
<p>Hi ${name}, 30 days ago you joined VinoInvest. Here's what you could unlock with a Pro plan:</p>
<div class="s">
  <p>✅ <strong>Unlimited AI portfolio analysis</strong> — real-time Claude AI insights</p>
  <p>✅ <strong>Cellar management</strong> — track drink windows, storage costs, insurance value</p>
  <p>✅ <strong>En Primeur tracker</strong> — futures pricing from Bordeaux châteaux</p>
  <p>✅ <strong>Liv-ex market data</strong> — institutional-grade price benchmarks</p>
  <p>✅ <strong>Priority price alerts</strong> — instant notifications, no delay</p>
</div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/pricing" class="btn">See Plans & Pricing →</a></p>
<p style="font-size:12px;color:#888">Questions? Reply to this email — our team responds within 24h.</p>`,
      };
    default:
      return null;
  }
}

export async function queueWelcomeSequence(userEmail, firstName) {
  if (!_pool) return;
  await ensureTable();
  const now = new Date();
  const schedule = [
    { day: 3,  offset: 3 * 24 * 60 * 60 * 1000 },
    { day: 7,  offset: 7 * 24 * 60 * 60 * 1000 },
    { day: 14, offset: 14 * 24 * 60 * 60 * 1000 },
    { day: 30, offset: 30 * 24 * 60 * 60 * 1000 },
  ];
  for (const { day, offset } of schedule) {
    const sendAfter = new Date(now.getTime() + offset);
    await _pool.query(
      `INSERT INTO welcome_email_queue (user_email, first_name, day_num, send_after)
       VALUES ($1, $2, $3, $4) ON CONFLICT (user_email, day_num) DO NOTHING`,
      [userEmail, firstName || userEmail.split("@")[0], day, sendAfter]
    ).catch(() => {});
  }
}

async function processPendingEmails() {
  if (!_pool) return;
  await ensureTable();
  try {
    const { rows } = await _pool.query(`
      SELECT * FROM welcome_email_queue
      WHERE sent_at IS NULL AND send_after <= NOW()
      ORDER BY send_after ASC
      LIMIT 50
    `);
    for (const row of rows) {
      const tpl = getTemplate(row.day_num, row.first_name);
      if (!tpl) continue;
      const html = layout(tpl.html, row.user_email);
      const result = await sendEmail(row.user_email, tpl.subject, html);
      if (result.ok) {
        await _pool.query(`UPDATE welcome_email_queue SET sent_at = NOW() WHERE id = $1`, [row.id]);
        console.log(`[welcomeEmailJob] Sent day-${row.day_num} email to ${row.user_email}`);
      }
    }
  } catch (e) {
    console.error("[welcomeEmailJob] Error:", e.message);
  }
}

// Check every hour for pending emails
cron.schedule("0 * * * *", processPendingEmails);

console.log("[welcomeEmailJob] Registered — hourly check for pending welcome emails.");

export { processPendingEmails };
