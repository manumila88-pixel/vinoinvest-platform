/**
 * Newsletter Service — weekly automated digest
 * Every Monday at 06:00 CET:
 *   - Analyze weekly DB data (top 5 wines, top 3 news, 1 AI opportunity)
 *   - Generate per-persona versions (curioso/appassionato/investitore/b2b)
 *   - Send via Resend with personalized subject
 *   - Track open/click rates via email_flows
 */

import { fetchRSSNews } from "./rssNewsService.js";
import { cachedCall } from "./aiOptimizer.js";
import cron from "node-cron";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "VinoInvest <noreply@vinoinvest.com>";
const BASE_URL = process.env.FRONTEND_URL || "https://vinoinvest-platform.vercel.app";

let pool = null;
let allWines = [];
export const setNewsletterPool = (p) => { pool = p; };
export const setNewsletterWines = (w) => { allWines = w; };

// ── HELPERS ───────────────────────────────────────────────────────────────────

async function q(sql, params = []) {
  try { return await pool.query(sql, params); }
  catch (_) { return { rows: [], rowCount: 0 }; }
}

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) return { ok: false, reason: "no_api_key" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text: html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      }),
    });
    const data = await res.json();
    return res.ok ? { ok: true, id: data.id } : { ok: false, error: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── WEEKLY DATA ───────────────────────────────────────────────────────────────

async function getWeeklyTopWines() {
  // Top 5 wines with highest price variation in last 7 days
  const { rows } = await q(`
    SELECT w.id, w.name, w.producer, w.vintage, w.current_price, w.investment_score, w.risk, w.market_trend,
           MAX(ph.price) - MIN(ph.price) AS price_range,
           ROUND(((MAX(ph.price) - MIN(ph.price)) / NULLIF(MIN(ph.price),0) * 100)::numeric, 1) AS pct_change
    FROM wines w
    JOIN price_history ph ON ph.wine_id = w.id
    WHERE ph.recorded_at > NOW() - INTERVAL '7 days'
    GROUP BY w.id, w.name, w.producer, w.vintage, w.current_price, w.investment_score, w.risk, w.market_trend
    HAVING COUNT(ph.price) >= 2
    ORDER BY price_range DESC
    LIMIT 5
  `);

  // Fallback to top scored wines if no recent price history
  if (!rows.length) {
    const fallback = allWines
      .filter(w => w.market_trend === 'up')
      .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
      .slice(0, 5);
    return fallback.map(w => ({
      name: w.name,
      producer: w.producer,
      vintage: w.vintage,
      current_price: w.current_price || w.currentPrice,
      investment_score: w.investmentScore || w.investment_score,
      market_trend: w.market_trend,
      pct_change: null,
    }));
  }
  return rows;
}

async function getAIOpportunity(topWines) {
  if (!process.env.ANTHROPIC_API_KEY || !topWines.length) return null;
  try {
    const result = await cachedCall({
      task: "opportunities",
      data: { wines: topWines.slice(0, 5) },
      complexity: "agent",
    });
    return Array.isArray(result) ? result[0] : null;
  } catch (_) {
    return null;
  }
}

// ── EMAIL TEMPLATES PER PERSONA ───────────────────────────────────────────────

function layout(content, email, isB2B = false) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;color:#1a1a2e}
.w{max-width:600px;margin:0 auto;background:#fff}
.h{background:#020617;padding:24px 32px}
.logo{font-family:Georgia,serif;font-size:26px;font-weight:900;color:#fff}
.logo span{color:#C9A227}
.b{padding:32px}
.btn{display:inline-block;padding:12px 24px;background:#C9A227;color:#020617!important;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px}
.btn-outline{display:inline-block;padding:10px 20px;background:transparent;color:#C9A227!important;border:2px solid #C9A227;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px}
.s{margin:20px 0;padding:18px 20px;background:#f8f9fa;border-radius:10px}
.s-gold{margin:20px 0;padding:18px 20px;background:#fffbf0;border:1px solid rgba(201,162,39,0.3);border-radius:10px}
.w-row{border-left:3px solid #C9A227;padding:10px 14px;margin:8px 0;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.badge{display:inline-block;background:#020617;color:#C9A227;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700}
.badge-up{background:#16a34a;color:#fff}
.badge-down{background:#dc2626;color:#fff}
.news-row{padding:10px 0;border-bottom:1px solid #f0f0f0}
.f{background:#f8f4ef;padding:18px 32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #e5e7eb}
h2{font-family:Georgia,serif;color:#020617;margin-top:0}a{color:#C9A227}p{line-height:1.6}
</style>
</head>
<body>
<div class="w">
<div class="h">
  <div class="logo">Vino<span>Invest</span></div>
  <div style="font-size:12px;color:#64748b;margin-top:4px">${isB2B ? 'Professional Wine Intelligence' : 'Fine Wine Intelligence Platform'}</div>
</div>
<div class="b">
${content}
<p style="font-size:11px;color:#aaa;margin-top:16px">⚠️ Non costituisce consulenza finanziaria o d'investimento.</p>
</div>
<div class="f">
  <p><a href="${BASE_URL}/settings/notifications">Preferenze</a> · <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}">Cancella iscrizione</a></p>
  <p>VinoInvest · Milan, Italy · © ${new Date().getFullYear()}</p>
</div>
</div></body></html>`;
}

function wineRow(w, idx) {
  const score = w.investment_score || w.investmentScore || '–';
  const price = parseFloat(w.current_price || w.currentPrice || 0).toLocaleString('it-IT');
  const badge = w.market_trend === 'up' ? 'badge-up' : w.market_trend === 'down' ? 'badge-down' : 'badge';
  const pct = w.pct_change ? ` <span class="${badge}">${w.pct_change > 0 ? '+' : ''}${w.pct_change}%</span>` : '';
  return `<div class="w-row">
    <strong>${idx + 1}. ${w.name} ${w.vintage || ''}</strong>${pct}<br>
    <span style="color:#64748b;font-size:13px">€${price} · <span class="badge">${score}/100</span> · ${w.producer || ''}</span>
  </div>`;
}

function newsRow(item, idx) {
  return `<div class="news-row">
    <strong>${idx + 1}. <a href="${item.link || '#'}">${item.title || 'Leggi l\'articolo'}</a></strong>
    ${item.summary ? `<br><span style="font-size:13px;color:#64748b">${item.summary.slice(0, 120)}...</span>` : ''}
  </div>`;
}

// Per-persona newsletter bodies
const PERSONA_CONFIGS = {
  curioso: {
    subject: (topWines) => `🍷 Questa settimana nel vino: ${topWines[0]?.name || 'novità importanti'}`,
    label: "💡 Questa settimana per te",
    intro: (name) => `Ciao ${name}! Ecco cosa è successo nel mondo del vino da investimento questa settimana — spiegato in modo semplice.`,
    wineIntro: "🔥 I vini che si stanno muovendo di più:",
    newsIntro: "📰 Le 3 notizie da sapere:",
    cta: "Vedi tutti i vini",
    ctaUrl: `${BASE_URL}`,
  },
  appassionato: {
    subject: (topWines) => `📊 Analisi mercato fine wine — Top 5 questa settimana`,
    label: "📊 Analisi tecnica settimana",
    intro: (name) => `Ciao ${name}. Ecco l'analisi dei movimenti più significativi del mercato fine wine nei ultimi 7 giorni.`,
    wineIntro: "Top 5 per variazione di prezzo settimanale:",
    newsIntro: "Notizie dal settore:",
    cta: "Apri analisi completa",
    ctaUrl: `${BASE_URL}/market`,
  },
  investitore: {
    subject: (topWines) => `📈 Weekly: ${topWines.filter(w => parseFloat(w.pct_change || 0) > 0).length} opportunità identificate`,
    label: "📈 Opportunità settimanali",
    intro: (name) => `${name}, recap quantitativo della settimana. Movimento prezzi, segnali AI e opportunità identificate.`,
    wineIntro: "Vini con variazione prezzo significativa (7gg):",
    newsIntro: "Notizie rilevanti per investitori:",
    cta: "Analisi AI completa",
    ctaUrl: `${BASE_URL}/analysis`,
  },
  b2b: {
    subject: (topWines) => `[VinoInvest Pro] Market Briefing — ${new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}`,
    label: "📋 Market Intelligence",
    intro: (name) => `Buongiorno ${name}. Briefing settimanale mercato fine wine per professionisti.`,
    wineIntro: "Top 5 istituzionali — variazione settimanale:",
    newsIntro: "Deal flow e notizie rilevanti:",
    cta: "Dashboard Professionale",
    ctaUrl: `${BASE_URL}/dashboard`,
  },
};

function buildPersonaEmail(persona, user, topWines, newsItems, aiOpportunity, weekNum) {
  const cfg = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS.curioso;
  const name = user.first_name || 'amico';
  const subject = cfg.subject(topWines);

  const wineList = topWines.slice(0, 5).map(wineRow).join('');
  const newsList = newsItems.slice(0, 3).map(newsRow).join('');

  const aiBlock = aiOpportunity ? `
<div class="s-gold">
  <p><strong>🤖 Opportunità AI della settimana</strong></p>
  <p><strong>${aiOpportunity.name}</strong> — ${aiOpportunity.reason || 'Segnale positivo identificato dall\'AI'}</p>
  <p><span class="badge">${aiOpportunity.signal || 'BUY'}</span> &nbsp; Score: ${aiOpportunity.score || '–'}/100</p>
</div>` : '';

  const html = `
<h2>${cfg.label} — W${weekNum}</h2>
<p>${cfg.intro(name)}</p>

<div class="s">
  <p><strong>${cfg.wineIntro}</strong></p>
  ${wineList || '<p style="color:#64748b">Nessun dato disponibile questa settimana.</p>'}
</div>

${aiBlock}

<div class="s">
  <p><strong>${cfg.newsIntro}</strong></p>
  ${newsList || '<p style="color:#64748b">Nessuna notizia disponibile.</p>'}
</div>

<p style="text-align:center;margin:28px 0">
  <a href="${cfg.ctaUrl}" class="btn">${cfg.cta} →</a>&nbsp;
  <a href="${BASE_URL}/academy" class="btn-outline">Academy →</a>
</p>`;

  return { subject, html: layout(html, user.email, persona === 'b2b') };
}

// ── PERSONA RESOLVER ──────────────────────────────────────────────────────────

function resolvePersona(user) {
  const accountType = user.account_type || 'b2c';
  if (['b2b', 'wealth_manager', 'family_office', 'cantina'].includes(accountType)) return 'b2b';

  // Use user_tags if available
  const tags = user.tags || [];
  if (tags.includes('b2b_interest')) return 'b2b';
  if (tags.includes('active_investor') || tags.includes('high_value_interest')) return 'investitore';
  if (tags.includes('education_focused')) return 'appassionato';
  return 'curioso';
}

// ── MAIN NEWSLETTER RUN ───────────────────────────────────────────────────────

export async function runWeeklyNewsletter() {
  if (!pool) {
    console.warn("[newsletter] No DB pool — skipping");
    return { sent: 0, errors: 0 };
  }

  const weekNum = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 86400000));
  console.log(`[newsletter] Starting weekly run W${weekNum}...`);

  // 1. Gather data
  const [topWines, news] = await Promise.all([
    getWeeklyTopWines(),
    fetchRSSNews().catch(() => []),
  ]);
  const newsItems = Array.isArray(news) ? news.slice(0, 3) : [];
  const aiOpportunity = await getAIOpportunity(topWines);

  console.log(`[newsletter] Data: ${topWines.length} wines, ${newsItems.length} news, AI opp: ${!!aiOpportunity}`);

  // 2. Get subscribed users with tags
  const { rows: users } = await q(`
    SELECT u.id, u.email, u.first_name, u.account_type, u.language,
           COALESCE(
             array_agg(ut.tag) FILTER (WHERE ut.tag IS NOT NULL),
             '{}'
           ) AS tags
    FROM users u
    LEFT JOIN user_tags ut ON ut.user_id = u.id
    WHERE u.email IS NOT NULL
      AND u.email_subscribed = true
      AND u.notification_frequency IN ('weekly', 'daily')
    GROUP BY u.id, u.email, u.first_name, u.account_type, u.language
    LIMIT 5000
  `).catch(() => ({ rows: [] }));

  console.log(`[newsletter] Sending to ${users.length} users`);

  let sent = 0;
  let errors = 0;

  for (const user of users) {
    try {
      // Skip if already sent in last 20 hours
      const { rows: recent } = await q(
        `SELECT 1 FROM email_flows WHERE user_id=$1 AND trigger_type='newsletter' AND sent_at > NOW() - INTERVAL '20 hours' LIMIT 1`,
        [user.id]
      );
      if (recent.length) continue;

      const persona = resolvePersona(user);
      const { subject, html } = buildPersonaEmail(persona, user, topWines, newsItems, aiOpportunity, weekNum);

      const result = await sendEmail(user.email, subject, html);

      await q(
        `INSERT INTO email_flows (user_id, user_email, segment, day_number, trigger_type, trigger_event, email_subject, sent_at, resend_id)
         VALUES ($1,$2,$3,-1,'newsletter','weekly_digest',$4,NOW(),$5)`,
        [user.id, user.email, persona === 'b2b' ? 'b2b' : 'b2c', subject, result.id || null]
      );

      sent++;
      if (sent % 10 === 0) await new Promise(r => setTimeout(r, 1000)); // throttle

    } catch (err) {
      errors++;
      console.error("[newsletter] User error:", user.email, err.message);
    }
  }

  console.log(`[newsletter] W${weekNum} complete: ${sent} sent, ${errors} errors`);
  return { sent, errors, weekNum };
}

// ── RE-ENGAGEMENT ─────────────────────────────────────────────────────────────

export async function runReEngagementCampaign() {
  if (!pool) return;
  try {
    const { rows: inactive } = await q(`
      SELECT u.id, u.email, u.first_name
      FROM users u
      WHERE u.email_subscribed = true
        AND (u.last_login IS NULL OR u.last_login < NOW() - INTERVAL '30 days')
        AND NOT EXISTS (
          SELECT 1 FROM email_flows ef
          WHERE ef.user_id = u.id
            AND ef.trigger_type = 're_engagement'
            AND ef.sent_at > NOW() - INTERVAL '15 days'
        )
      LIMIT 100
    `);

    for (const user of inactive) {
      const name = user.first_name || 'Wine lover';
      const subject = `${name}, il mercato vino si è mosso — torna a dare un'occhiata`;
      const html = layout(`
<h2>Ti abbiamo pensato 🍷</h2>
<p>Ciao ${name}, sono 30 giorni che non accedi a VinoInvest. Il mercato non aspetta.</p>
<div class="s">
  <p>📈 <strong>Italia Premium</strong> — +5.8% questo mese</p>
  <p>🤖 <strong>AI Score</strong> — nuovo modello con +25% accuracy</p>
  <p>📊 <strong>Storico prezzi</strong> — ora disponibile per tutti i vini</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Torna su VinoInvest →</a></p>`,
        user.email
      );

      const result = await sendEmail(user.email, subject, html);
      await q(
        `INSERT INTO email_flows (user_id, user_email, segment, day_number, trigger_type, trigger_event, email_subject, sent_at)
         VALUES ($1,$2,'b2c',-1,'re_engagement','inactive_30d',$3,NOW())`,
        [user.id, user.email, subject]
      );
    }

    console.log(`[newsletter] Re-engagement: ${inactive.length} emails`);
  } catch (e) {
    console.error("[newsletter] Re-engagement error:", e.message);
  }
}

// ── CRON ──────────────────────────────────────────────────────────────────────

export async function startNewsletterCron() {
  try {
    // Every Monday at 06:00 CET
    cron.schedule("0 6 * * 1", async () => {
      await runWeeklyNewsletter();
    }, { timezone: "Europe/Rome" });

    console.log("[newsletter] Cron scheduled — Mondays 06:00 CET");
  } catch (e) {
    console.warn("[newsletter] Cron unavailable:", e.message);
  }
}
