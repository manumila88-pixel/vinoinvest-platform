/**
 * Welcome Email Sequence — 5-email drip campaign via Resend
 * Day 0: Welcome (sent immediately on registration via auth route)
 * Day 3: AI Score discovery (IT)
 * Day 7: Top 5 wines this week (IT)
 * Day 14: Portfolio guide €5.000 (IT)
 * Day 21: Academy upgrade (IT)
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
  const name = firstName || "investitore";
  switch (dayNum) {
    case 3:
      return {
        subject: `Hai scoperto l'AI Score? Ecco come usarlo`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Hai scoperto l'AI Score? 🤖</h2>
<p>Ciao ${name}, sono passati 3 giorni da quando ti sei unito a VinoInvest. Hai già visto l'AI Score?</p>
<div class="s">
  <p><strong>Cos'è l'AI Score:</strong> un punteggio 0-100 che analizza storico prezzi, punteggi critici, liquidità e momentum per ogni vino.</p>
  <p>🟢 <strong>90-100 = Strong Buy</strong> — eccezionale opportunità</p>
  <p>🟡 <strong>75-89 = Buy</strong> — buona opportunità</p>
  <p>⚪ <strong>60-74 = Watch</strong> — monitorare</p>
</div>
<p><strong>I top vini questa settimana:</strong></p>
<div class="s">
  <p>1. 🍷 Barolo Monfortino 2021 — Score <strong>96/100</strong> — Strong Buy</p>
  <p>2. 🍷 Château Petrus 2019 — Score <strong>93/100</strong> — Strong Buy</p>
  <p>3. 🍷 Brunello di Montalcino 2019 — Score <strong>91/100</strong> — Buy</p>
</div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}" class="btn">Esplora i Top Score →</a></p>`,
      };
    case 7:
      return {
        subject: `I 5 vini più interessanti questa settimana`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Top 5 della Settimana 🏆</h2>
<p>Ciao ${name}, ecco i 5 vini con il miglior potenziale di apprezzamento questa settimana secondo l'AI di VinoInvest.</p>
<div class="s">
  <p>1. <strong>Barolo Cascina Francia 2019</strong> — Score 94 — €320/bt — +18% YoY</p>
  <p>2. <strong>Château Lynch-Bages 2019</strong> — Score 89 — €185/bt — +12% YoY</p>
  <p>3. <strong>Sassicaia 2020</strong> — Score 88 — €230/bt — +9% YoY</p>
  <p>4. <strong>Ornellaia 2019</strong> — Score 86 — €190/bt — +11% YoY</p>
  <p>5. <strong>Champagne Salon 2013</strong> — Score 92 — €780/bt — +22% YoY</p>
</div>
<p>Clicca su qualsiasi vino per vedere lo storico prezzi completo e l'analisi AI dettagliata.</p>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}" class="btn">Vedi Tutti i Vini →</a></p>`,
      };
    case 14:
      return {
        subject: `Come costruire un portfolio da €5.000 in fine wine`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Portfolio da €5.000: Guida Pratica 💼</h2>
<p>Ciao ${name}, ecco come costruire il tuo primo portfolio di fine wine con €5.000.</p>
<div class="s">
  <p><strong>Allocazione raccomandata:</strong></p>
  <p>🍷 <strong>40% — Barolo top labels (€2.000)</strong><br>6 bottiglie annata 2019/2021. Orizzonte: 7-10 anni. Potenziale: +150-250%</p>
  <p>🍷 <strong>35% — Bordeaux Premier Cru (€1.750)</strong><br>3 bottiglie Pauillac/Saint-Julien. Liquidità massima. Potenziale: +80-130%</p>
  <p>🍷 <strong>15% — Brunello di Montalcino (€750)</strong><br>2 bottiglie annata eccezionale. Orizzonte: 8-12 anni. Potenziale: +120-200%</p>
  <p>🍷 <strong>10% — Champagne Prestige (€500)</strong><br>1 bottiglia Dom Pérignon/Krug. Diversificazione. Potenziale: +50-100%</p>
</div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Crea il Mio Portfolio →</a></p>`,
      };
    case 21:
      return {
        subject: `Sei pronto per il livello successivo? 🎓`,
        html: `<h2 style="font-family:Georgia,serif;color:#020617">Pronto per l'Academy? 🎓</h2>
<p>Ciao ${name}, sono 3 settimane che usi VinoInvest. È il momento di approfondire con la nostra Academy.</p>
<div class="s">
  <p>📚 <strong>20 moduli completi</strong> — dal Bordeaux ai casi studio +1000%</p>
  <p>📊 <strong>Portfolio simulato 2010-2024</strong> — vedi come avresti performato</p>
  <p>🎓 <strong>Certificato verificabile</strong> — mostralo su LinkedIn</p>
  <p>📈 <strong>Dati Liv-ex reali</strong> — non teoria, solo mercato vero</p>
  <p>🤖 <strong>Quiz e esercizi pratici</strong> — impara facendo</p>
</div>
<p>I moduli 1-5 sono <strong>completamente gratuiti</strong>. Inizia oggi senza impegno.</p>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/academy" class="btn">Accedi all'Academy →</a></p>
<p style="font-size:12px;color:#888">Vuoi il piano completo? Vedi i <a href="${BASE_URL}/pricing">piani e prezzi</a> — da €9/mese.</p>`,
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
    { day: 3,  offset: 3  * 24 * 60 * 60 * 1000 },
    { day: 7,  offset: 7  * 24 * 60 * 60 * 1000 },
    { day: 14, offset: 14 * 24 * 60 * 60 * 1000 },
    { day: 21, offset: 21 * 24 * 60 * 60 * 1000 },
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
