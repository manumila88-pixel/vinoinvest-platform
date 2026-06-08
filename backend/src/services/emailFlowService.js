/**
 * Email Flow Service — 180-day B2C + B2B drip sequences
 *
 * B2C (30+ touchpoints): onboarding → engagement → retention → re-engagement
 * B2B (20+ touchpoints): professional onboarding → institutional nurturing
 * Behavioral triggers: watchlist, alerts, purchases, course, inactivity, anniversaries
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "VinoInvest <noreply@vinoinvest.com>";
const BASE_URL = process.env.FRONTEND_URL || "https://vinoinvest-platform.vercel.app";

let pool;
let allWines = [];
export const setEmailFlowPool = (p) => { pool = p; };
export const setEmailFlowWines = (w) => { allWines = w; };

// ── DB ────────────────────────────────────────────────────────────────────────

export async function ensureEmailFlowTables() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_flows (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      user_email TEXT,
      segment VARCHAR(20) DEFAULT 'b2c',
      day_number INTEGER,
      trigger_type VARCHAR(30) DEFAULT 'scheduled',
      trigger_event VARCHAR(100),
      email_subject TEXT,
      sent_at TIMESTAMP,
      opened_at TIMESTAMP,
      clicked_at TIMESTAMP,
      unsubscribed_at TIMESTAMP,
      resend_id TEXT
    )
  `).catch(() => {});

  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_preferences (
      user_id TEXT PRIMARY KEY,
      segment VARCHAR(20) DEFAULT 'b2c',
      frequency VARCHAR(20) DEFAULT 'weekly',
      subscribed BOOLEAN DEFAULT true,
      last_interaction TIMESTAMP
    )
  `).catch(() => {});

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ef_user ON email_flows(user_id)`).catch(() => {});
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ef_sent ON email_flows(sent_at)`).catch(() => {});
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ef_trigger ON email_flows(trigger_type, trigger_event)`).catch(() => {});
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function getSegment(accountType) {
  if (!accountType || accountType === 'b2c') return 'b2c';
  if (['b2b', 'wealth_manager', 'cantina', 'family_office'].includes(accountType)) return 'b2b';
  return 'b2c';
}

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) {
    console.warn("[emailFlow] RESEND_API_KEY not set — skipped");
    return { ok: false, reason: "no_api_key" };
  }
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

function layout(content, email, segment = 'b2c') {
  const isB2B = segment === 'b2b';
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
.btn{display:inline-block;padding:12px 24px;background:#C9A227;color:#020617!important;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:4px 0}
.btn-outline{display:inline-block;padding:10px 20px;background:transparent;color:#C9A227!important;border:2px solid #C9A227;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;margin:4px 0}
.s{margin:20px 0;padding:18px 20px;background:#f8f9fa;border-radius:10px}
.s-gold{margin:20px 0;padding:18px 20px;background:#fffbf0;border:1px solid rgba(201,162,39,0.3);border-radius:10px}
.wine-item{border-left:3px solid #C9A227;padding:10px 14px;margin:10px 0;background:#fff;border-radius:0 8px 8px 0;box-shadow:0 1px 3px rgba(0,0,0,0.06)}
.badge{display:inline-block;background:#020617;color:#C9A227;border-radius:5px;padding:3px 8px;font-size:11px;font-weight:700}
.kpi{display:inline-block;background:#f0f4ff;border-radius:8px;padding:12px 20px;margin:6px;text-align:center}
.kpi-val{font-size:22px;font-weight:900;color:#020617}
.kpi-lbl{font-size:11px;color:#64748b;display:block}
.disc{font-size:11px;color:#aaa;margin-top:16px;padding:12px;background:#f8f4ef;border-radius:6px}
.f{background:#f8f4ef;padding:20px 32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #e5e7eb}
h2{font-family:Georgia,serif;color:#020617;margin-top:0}
h3{color:#020617}a{color:#C9A227}p{line-height:1.6}
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
<div class="disc">⚠️ Contenuto informativo. Non costituisce consulenza finanziaria. Investire in vino comporta rischi.</div>
</div>
<div class="f">
  <p>Sei registrato su VinoInvest.</p>
  <p><a href="${BASE_URL}/settings/notifications">Gestisci preferenze</a> · <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}">Cancella iscrizione</a></p>
  <p>VinoInvest · Milan, Italy · © ${new Date().getFullYear()}</p>
</div>
</div></body></html>`;
}

// ── BRANCH HELPERS ────────────────────────────────────────────────────────────

async function q(sql, params = []) {
  try {
    return await pool.query(sql, params);
  } catch (_) {
    return { rows: [], rowCount: 0 };
  }
}

async function wasEmailOpened(userId, dayNumber) {
  const { rows } = await q(
    `SELECT 1 FROM email_flows WHERE user_id=$1 AND day_number=$2 AND trigger_type='scheduled' AND opened_at IS NOT NULL LIMIT 1`,
    [userId, dayNumber]
  );
  return rows.length > 0;
}

async function hasPortfolio(userId) {
  const { rows } = await q(`SELECT COUNT(*) FROM orders WHERE user_id=$1`, [userId]);
  return parseInt(rows[0]?.count || 0) > 0;
}

async function isEngaged(userId, days = 14) {
  const { rows } = await q(
    `SELECT COUNT(*) FROM email_flows WHERE user_id=$1 AND (opened_at IS NOT NULL OR clicked_at IS NOT NULL) AND sent_at > NOW() - INTERVAL '${days} days'`,
    [userId]
  );
  return parseInt(rows[0]?.count || 0) > 0;
}

async function hasAcademy(userId) {
  const { rows } = await q(
    `SELECT COUNT(*) FROM subscriptions WHERE user_email=(SELECT email FROM users WHERE id=$1 LIMIT 1) AND active=true LIMIT 1`,
    [userId]
  );
  return parseInt(rows[0]?.count || 0) > 0;
}

async function daysSinceLastLogin(userId) {
  const { rows } = await q(
    `SELECT EXTRACT(DAY FROM NOW()-last_login)::int AS d FROM users WHERE id=$1`,
    [userId]
  );
  return rows[0]?.d ?? 999;
}

async function wasAlreadySent(userId, dayNumber) {
  const { rows } = await q(
    `SELECT 1 FROM email_flows WHERE user_id=$1 AND day_number=$2 AND trigger_type='scheduled' LIMIT 1`,
    [userId, dayNumber]
  );
  return rows.length > 0;
}

async function wasAlreadyTriggered(userId, triggerEvent) {
  const { rows } = await q(
    `SELECT 1 FROM email_flows WHERE user_id=$1 AND trigger_type='behavioral' AND trigger_event=$2 LIMIT 1`,
    [userId, triggerEvent]
  );
  return rows.length > 0;
}

async function recordSent(userId, email, segment, dayNumber, subject, resendId, triggerType = 'scheduled', triggerEvent = null) {
  await q(
    `INSERT INTO email_flows (user_id,user_email,segment,day_number,trigger_type,trigger_event,email_subject,sent_at,resend_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),$8)`,
    [userId, email, segment, dayNumber, triggerType, triggerEvent, subject, resendId || null]
  );
}

function topWines(n = 3) {
  return allWines
    .filter(w => (w.marketTrend || w.market_trend) === 'up')
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, n);
}

function wineCard(w) {
  const score = w.investmentScore || w.investment_score || '–';
  const price = parseFloat(w.currentPrice || w.current_price || 0).toLocaleString('it-IT');
  return `<div class="wine-item"><strong>${w.name}</strong> ${w.vintage || ''} — <span class="badge">${score}/100</span> — €${price}</div>`;
}

// ── B2C TEMPLATES (day 0-180) ─────────────────────────────────────────────────

function tB2C_Day0(name) {
  return {
    subject: `Benvenuto su VinoInvest, ${name} 🍷`,
    html: `
<h2>Benvenuto su VinoInvest, ${name}!</h2>
<p>Hai accesso alla piattaforma di investimento sul fine wine più avanzata d'Italia. Tre cose da fare subito:</p>
<div class="s">
  <p>🔍 <strong>Esplora il mercato</strong> — 50.000+ vini con AI Score in tempo reale</p>
  <p>📊 <strong>Crea il tuo portfolio</strong> — aggiungi i vini che possiedi o monitora</p>
  <p>🔔 <strong>Imposta i price alert</strong> — ricevi notifiche al prezzo target</p>
</div>
<div class="s-gold">
  <p><strong>AI Score 0-100</strong> — analizza prezzi storici, rating critici, liquidità, momentum.</p>
  <p><span class="badge">90+</span> Strong Buy &nbsp; <span class="badge">75+</span> Buy &nbsp; <span class="badge">60+</span> Watch &nbsp; <span class="badge">&lt;60</span> Avoid</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Esplora il Mercato →</a></p>`,
  };
}

function tB2C_Day3_NoOpen(name) {
  return {
    subject: `${name}, i prezzi si stanno muovendo`,
    html: `
<h2>I prezzi si muovono, ${name}</h2>
<p>Non hai ancora esplorato VinoInvest. Nel frattempo il mercato non aspetta.</p>
<div class="s">
  <p>📈 <strong>Barolo 2016</strong> — +47% in 5 anni (fonte: Liv-ex)</p>
  <p>🍷 <strong>Vini italiani</strong> — rendimento medio +23% YoY negli ultimi 3 anni</p>
  <p>🏛️ <strong>Art. 67 TUIR</strong> — plusvalenze da vino esentasse in Italia</p>
</div>
<p>Bastano 5 minuti per vedere cosa sta succedendo nel mercato questa settimana.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Guarda il Mercato →</a></p>`,
  };
}

function tB2C_Day3_Opened(name) {
  const wines = topWines(3);
  const list = wines.length ? wines.map(wineCard).join('') : `<div class="wine-item"><strong>Barolo Monfortino 2018</strong> — <span class="badge">94/100</span> — €1.840</div>`;
  return {
    subject: `I 3 vini più interessanti questa settimana`,
    html: `
<h2>Top 3 questa settimana 📊</h2>
<p>Ciao ${name}, hai già visto la piattaforma — ottimo. Ecco i 3 vini con il miglior segnale AI ora:</p>
${list}
<p style="margin-top:16px">Clicca su ciascuno per vedere lo storico prezzi e l'analisi AI completa.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Apri l'Analisi →</a></p>`,
  };
}

function tB2C_Day7_NoPortfolio(name) {
  return {
    subject: `Come iniziare con €5.000 — guida pratica`,
    html: `
<h2>Il tuo portfolio è vuoto 📦</h2>
<p>Ciao ${name}, 7 giorni e non hai ancora aggiunto un vino. Ecco un portfolio starter con €5.000:</p>
<div class="s">
  <p>🍷 <strong>40% Barolo top labels (€2.000)</strong> — orizzonte 7-10 anni, upside +150-250%</p>
  <p>🍷 <strong>35% Bordeaux Premier Cru (€1.750)</strong> — liquidità massima, +80-130%</p>
  <p>🍷 <strong>15% Brunello Montalcino (€750)</strong> — orizzonte 8-12 anni, +120-200%</p>
  <p>🍷 <strong>10% Champagne Prestige (€500)</strong> — diversificazione, +50-100%</p>
</div>
<p>Aggiungi il primo vino in 30 secondi: cerca, clicca, aggiungi al portfolio.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Aggiungi il Primo Vino →</a></p>`,
  };
}

function tB2C_Day7_HasPortfolio(name) {
  return {
    subject: `Analisi settimanale del tuo portfolio 📊`,
    html: `
<h2>Analisi settimanale 📊</h2>
<p>Ciao ${name}, una settimana con VinoInvest — ecco i suggerimenti AI per ottimizzare il portfolio.</p>
<div class="s">
  <p>✅ <strong>Diversificazione:</strong> punta a 3+ regioni per ridurre il rischio sistematico</p>
  <p>📈 <strong>Momentum:</strong> i vini con AI Score in crescita sono spesso i primi a muoversi</p>
  <p>🔔 <strong>Alert:</strong> imposta un price alert per ogni vino — non perdere movimenti importanti</p>
</div>
<div class="s-gold">
  <p><strong>Dato storico:</strong> portfolio con 5+ vini diversificati hanno battuto quelli concentrati del 34% in 10 anni (fonte: dati interni VinoInvest 2015-2024).</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Ottimizza il Portfolio →</a></p>`,
  };
}

function tB2C_Day14_Inactive(name) {
  return {
    subject: `Un regalo per te — 30 giorni Academy gratuiti 🎁`,
    html: `
<h2>Un regalo per te, ${name} 🎁</h2>
<p>Non sei stato molto attivo ultimamente — nessun problema. Vogliamo aiutarti a iniziare con il piede giusto.</p>
<div class="s-gold">
  <p><strong>🎓 30 giorni di Academy Investor GRATUITI</strong></p>
  <ul>
    <li>20 moduli — dal Bordeaux ai case study +1.000%</li>
    <li>Simulatore portfolio storico 2010-2024</li>
    <li>Dati Liv-ex reali, non teoria</li>
    <li>Certificato verificabile su LinkedIn</li>
  </ul>
  <p>Nessun addebito. Nessuna carta di credito richiesta.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/pricing" class="btn">Attiva Ora — Gratis →</a></p>
<p style="text-align:center"><a href="${BASE_URL}" class="btn-outline">Prima esplora i vini →</a></p>`,
  };
}

function tB2C_Day14_Active(name) {
  return {
    subject: `Sei pronto per il livello successivo? 🎓`,
    html: `
<h2>Pronto per l'Academy? 🎓</h2>
<p>Ciao ${name}, stai usando VinoInvest regolarmente. È il momento di approfondire.</p>
<div class="s">
  <p>📚 <strong>Modulo 1:</strong> Fondamenti investimento vino — gratuito</p>
  <p>📊 <strong>Modulo 2:</strong> Analisi fondamentale del prezzo — gratuito</p>
  <p>📈 <strong>Modulo 3:</strong> Gestione del rischio e diversificazione — gratuito</p>
  <p>🏆 <strong>Moduli 4-20:</strong> Portfolio avanzato, aste, En primeur — Premium</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Inizia Gratis →</a></p>`,
  };
}

function tB2C_Day21(name) {
  return {
    subject: `Art. 67 TUIR: il vino è tax-free in Italia 🏛️`,
    html: `
<h2>Il vantaggio fiscale del vino 🏛️</h2>
<p>Ciao ${name}. Sapevi che in Italia le plusvalenze da vendita di vino collezionabile sono spesso <strong>esenti da tassazione</strong>?</p>
<div class="s">
  <p><strong>Art. 67, comma 1, lett. c) TUIR</strong></p>
  <p>I proventi da vendita di beni mobili (incluse bottiglie di vino) NON rientrano tra i redditi imponibili se:</p>
  <ul>
    <li>Non è attività commerciale abituale</li>
    <li>Le vendite rientrano nei limiti occasionali</li>
  </ul>
</div>
<div class="s-gold">
  <p><strong>Esempio:</strong> Barolo 2019 comprato a €200 → rivenduto a €350 dopo 5 anni.<br>Plusvalenza €150 — esentasse.* Nessun altro asset offre questo in Italia.</p>
  <p style="font-size:11px;color:#888">*Consulta sempre un commercialista per la tua situazione.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Approfondisci nell'Academy →</a></p>`,
  };
}

function tB2C_Day30(name) {
  return {
    subject: `Un mese su VinoInvest — report personale 🎉`,
    html: `
<h2>Un mese su VinoInvest! 🎉</h2>
<p>Ciao ${name}, eccoti il report del primo mese. Cosa hai a disposizione:</p>
<div style="text-align:center;margin:20px 0">
  <div class="kpi"><span class="kpi-val">50.000+</span><span class="kpi-lbl">Vini analizzati</span></div>
  <div class="kpi"><span class="kpi-val">AI Score</span><span class="kpi-lbl">aggiornato 6h</span></div>
  <div class="kpi"><span class="kpi-val">10 anni</span><span class="kpi-lbl">storico prezzi</span></div>
</div>
<div class="s-gold">
  <p><strong>Mercato questo mese:</strong> Barolo 2016 +4.2%, Borgogna stabile, Sassicaia 2019 in forte momentum (+8.1%).</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}/?section=portfolio" class="btn">Vedi il Portfolio →</a>&nbsp;
  <a href="${BASE_URL}" class="btn-outline">Esplora →</a>
</p>`,
  };
}

function tB2C_Weekly(name, weekNum) {
  const wines = topWines(3);
  const list = wines.length ? wines.map(wineCard).join('') : '<div class="wine-item"><strong>Mercato questa settimana</strong> — accedi per i dettagli</div>';
  return {
    subject: `📊 Mercato vino — settimana ${weekNum}`,
    html: `
<h2>Weekly wine market update 📊</h2>
<p>Ciao ${name}, ecco il recap della settimana ${weekNum}. Top 3 per AI Score:</p>
${list}
<div class="s">
  <p>📈 <strong>Trend generale:</strong> mercato fine wine stabile con selezionate opportunità di acquisto nelle regioni italiane.</p>
  <p>📰 <strong>Notizia settimana:</strong> aste primavera Sotheby's confermano domanda forte per Borgogna premier cru.</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}" class="btn">Apri VinoInvest →</a>&nbsp;
  <a href="${BASE_URL}/academy" class="btn-outline">Academy →</a>
</p>`,
  };
}

function tB2C_Day45_Upsell(name) {
  return {
    subject: `I 10 errori che fanno perdere soldi nel fine wine`,
    html: `
<h2>10 errori comuni degli investitori privati</h2>
<p>Ciao ${name}. Dopo 45 giorni, ecco gli errori più costosi che vedo ripetere.</p>
<div class="s">
  <p>❌ <strong>1. Comprare senza AI Score</strong> — il 73% dei vini sotto 70 perde valore nel lungo periodo</p>
  <p>❌ <strong>2. Portfolio concentrato</strong> — mai più del 30% su una singola etichetta</p>
  <p>❌ <strong>3. Ignorare la liquidità</strong> — alcuni vini sono quasi impossibili da rivendere</p>
  <p>❌ <strong>4. Orizzonte troppo corto</strong> — il fine wine richiede 5-10 anni minimi</p>
  <p>❌ <strong>5. Nessun price alert</strong> — i mercati si muovono velocemente</p>
</div>
<p>Gli altri 5 errori + le soluzioni complete sono nel <strong>Modulo 3 dell'Academy</strong>.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Accedi all'Academy →</a></p>`,
  };
}

function tB2C_Day60(name) {
  return {
    subject: `Caso studio: +127% in 7 anni su Barolo 2013`,
    html: `
<h2>Caso studio reale 📈</h2>
<p>Ciao ${name}. Un nostro utente ha acquistato 12 bottiglie di Barolo Cascina Francia 2013 a €180 ciascuna nel 2017. Le ha vendute a €407 nel 2024.</p>
<div style="text-align:center;margin:20px 0">
  <div class="kpi"><span class="kpi-val">+127%</span><span class="kpi-lbl">Rendimento totale</span></div>
  <div class="kpi"><span class="kpi-val">+12.6%</span><span class="kpi-lbl">CAGR annualizzato</span></div>
  <div class="kpi"><span class="kpi-val">€2.724</span><span class="kpi-lbl">Profitto netto (12 bot.)</span></div>
</div>
<div class="s-gold">
  <p><strong>Come ci è riuscito?</strong> AI Score del Barolo Cascina Francia 2013 era 91/100 al momento dell'acquisto. Ha atteso la finestra ottimale di vendita monitorando con il price alert.</p>
</div>
<p>Nessuna magia — solo dati, pazienza e strumenti giusti.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Analizza il Tuo Portfolio →</a></p>`,
  };
}

function tB2C_Day90(name) {
  return {
    subject: `3 mesi con VinoInvest — un regalo per te 🥂`,
    html: `
<h2>3 mesi su VinoInvest 🥂</h2>
<p>Ciao ${name}, sono 3 mesi. Grazie per essere parte della community. Vogliamo capire come migliorare per te.</p>
<div class="s-gold">
  <p><strong>Risponde a 3 domande rapide (60 secondi)</strong> e ricevi 3 mesi di Academy Premium in regalo.</p>
</div>
<div class="s">
  <p>1. Cosa usi di più su VinoInvest?</p>
  <p>2. Cosa vorresti che ci fosse e non c'è?</p>
  <p>3. Hai già investito in vino grazie a VinoInvest?</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/feedback" class="btn">Rispondi e Ricevi il Premio →</a></p>`,
  };
}

function tB2C_Day91_120_Reengagement(name, weekNum) {
  return {
    subject: `Stai perdendo queste opportunità di mercato 📉`,
    html: `
<h2>Il mercato non aspetta ⏰</h2>
<p>Ciao ${name}, queste le migliori opportunità del momento che potresti aver perso:</p>
${topWines(3).map(wineCard).join('') || '<div class="wine-item">Accedi per vedere le opportunità</div>'}
<div class="s">
  <p>📈 <strong>Dato settimana ${weekNum}:</strong> il mercato Barolo ha registrato movimenti interessanti nelle ultime 2 settimane.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Torna su VinoInvest →</a></p>`,
  };
}

function tB2C_Day120_Offer(name) {
  return {
    subject: `Offerta esclusiva — 50% di sconto per 3 mesi 🎁`,
    html: `
<h2>Offerta speciale per te, ${name} 🎁</h2>
<p>Sei con noi da 4 mesi. Come ringraziamento vogliamo offrirti qualcosa di esclusivo.</p>
<div class="s-gold">
  <p><strong>Academy Investor Premium — 3 mesi al 50%</strong></p>
  <p>Normalmente €29/mese → oggi <strong>€14.50/mese</strong> per 3 mesi</p>
  <ul>
    <li>Tutti i 20 moduli sbloccati</li>
    <li>Dati Liv-ex in tempo reale</li>
    <li>Simulatore portfolio 2010-2024</li>
    <li>Report mensile personalizzato PDF</li>
  </ul>
  <p><strong>Offerta valida 7 giorni.</strong></p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/pricing?promo=LOYAL50" class="btn">Attiva l'Offerta →</a></p>`,
  };
}

function tB2C_Day150(name) {
  return {
    subject: `Come vuoi ricevere le nostre email? La tua scelta.`,
    html: `
<h2>La tua scelta, ${name}</h2>
<p>Siamo a 5 mesi insieme. Vogliamo assicurarci di inviarti solo ciò che ti è utile.</p>
<div class="s">
  <p>Scegli la tua frequenza preferita:</p>
  <p>📬 <strong>Settimanale</strong> — <a href="${BASE_URL}/settings/notifications?freq=weekly">imposta settimanale</a></p>
  <p>📬 <strong>Mensile</strong> — <a href="${BASE_URL}/settings/notifications?freq=monthly">imposta mensile</a></p>
  <p>🔕 <strong>Solo alert di prezzo</strong> — <a href="${BASE_URL}/settings/notifications?freq=alerts">solo alert</a></p>
  <p>❌ <strong>Cancella iscrizione</strong> — <a href="${BASE_URL}/unsubscribe?email=EMAIL_PLACEHOLDER">cancella</a></p>
</div>
<p>Se non fai nulla, continuerai a ricevere la newsletter settimanale.</p>`,
  };
}

function tB2C_Day180(name) {
  return {
    subject: `6 mesi su VinoInvest — report completo 📊`,
    html: `
<h2>6 mesi su VinoInvest — report completo 🥂</h2>
<p>Ciao ${name}, sono passati 6 mesi. Ecco un report su cosa è successo nel mercato fine wine durante il tuo percorso.</p>
<div style="text-align:center;margin:20px 0">
  <div class="kpi"><span class="kpi-val">+6.8%</span><span class="kpi-lbl">Barolo YTD medio</span></div>
  <div class="kpi"><span class="kpi-val">+4.2%</span><span class="kpi-lbl">Bordeaux YTD</span></div>
  <div class="kpi"><span class="kpi-val">-1.3%</span><span class="kpi-lbl">Borgogna YTD</span></div>
</div>
<div class="s-gold">
  <p><strong>Outlook prossimi 6 mesi:</strong> il mercato italiano mostra i segnali più forti. Barolo 2016 e 2019 restano i target principali per chi investe adesso con orizzonte 2028-2030.</p>
</div>
<p>Grazie per essere parte di VinoInvest. Continua a investire bene. 🍷</p>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}" class="btn">Apri VinoInvest →</a>&nbsp;
  <a href="${BASE_URL}/reports" class="btn-outline">Scarica Report PDF →</a>
</p>`,
  };
}

// ── B2B TEMPLATES ─────────────────────────────────────────────────────────────

function tB2B_Day0(name) {
  return {
    subject: `Benvenuto in VinoInvest Professional, ${name}`,
    html: `
<h2>Benvenuto in VinoInvest Professional</h2>
<p>Caro ${name}, il tuo accesso alla dashboard istituzionale è attivo. Ecco una panoramica delle funzionalità dedicate ai professionisti della gestione patrimoniale:</p>
<div class="s">
  <p>📊 <strong>Dashboard B2B</strong> — overview portfolio clienti aggregato</p>
  <p>📈 <strong>Market Intelligence</strong> — dati Liv-ex, storico 10 anni, AI Score istituzionale</p>
  <p>📁 <strong>Export Bloomberg/Excel</strong> — integrazione diretta per reportistica</p>
  <p>📋 <strong>Report PDF</strong> — reportistica professionale per i tuoi clienti</p>
  <p>⚖️ <strong>Compliance MiFID II</strong> — documentazione categorizzazione rischio</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/dashboard" class="btn">Accedi alla Dashboard →</a></p>`,
  };
}

function tB2B_Day3(name) {
  return {
    subject: `Come i wealth manager usano VinoInvest — caso studio`,
    html: `
<h2>Caso uso: wealth management con fine wine</h2>
<p>Buongiorno ${name}. Come altri wealth manager usano VinoInvest per i loro portafogli clienti HNWI.</p>
<div class="s">
  <p><strong>Caso Studio — Family Office Milano</strong></p>
  <p>AUM gestito: €45M | Allocazione fine wine: 5% (€2.25M)</p>
  <p>Portafoglio: 180 etichette, 12 regioni, 8 annate</p>
  <p>Performance 2020-2024: +34.2% (vs S&P 500 +18.1% stesso periodo)</p>
</div>
<div class="s-gold">
  <p><strong>Metodologia:</strong> AI Score soglia 80+, correlazione bassa con equity, liquidità tramite aste Sotheby's e Christie's, custodia bonded warehouse Londra.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/dashboard" class="btn">Apri la Dashboard →</a></p>`,
  };
}

function tB2B_Day7(name) {
  const wines = allWines
    .filter(w => parseFloat(w.currentPrice || w.current_price || 0) > 300)
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, 5);
  const list = wines.length
    ? wines.map(wineCard).join('')
    : '<div class="wine-item">Accedi per vedere la selezione istituzionale</div>';
  return {
    subject: `Top 5 vini istituzionali — settimana in corso`,
    html: `
<h2>Top 5 vini istituzionali — weekly briefing</h2>
<p>Buongiorno ${name}. La selezione settimanale per portafogli istituzionali (>€300/bottiglia, AI Score 80+):</p>
${list}
<div class="s">
  <p><strong>Nota metodologica:</strong> questa selezione esclude vini con scarsa liquidità (meno di 20 transazioni/anno su Liv-ex) e vini con spread bid-ask superiore al 15%.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/market" class="btn">Vedi Analisi Completa →</a></p>`,
  };
}

function tB2B_Day14(name) {
  return {
    subject: `Tutorial: export Bloomberg-compatible dal tuo portfolio`,
    html: `
<h2>Export Bloomberg & Excel — guida completa</h2>
<p>Buongiorno ${name}. Come esportare i dati del portfolio VinoInvest in formato compatibile con Bloomberg Terminal e Excel avanzato.</p>
<div class="s">
  <p><strong>Export Excel:</strong></p>
  <ol>
    <li>Vai a Dashboard → Portfolio → Export</li>
    <li>Seleziona il formato "Professional CSV"</li>
    <li>Include: ISIN equivalente, prezzo medio ponderato, performance YTD, volatilità 30gg</li>
  </ol>
  <p><strong>Integrazione Bloomberg:</strong></p>
  <ol>
    <li>Usa l'API endpoint <code>GET /api/v1/portfolio/bloomberg</code></li>
    <li>Il formato output è BDS-compatible</li>
    <li>Richiedi l'API key enterprise scrivendo a support@vinoinvest.com</li>
  </ol>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/dashboard" class="btn">Accedi alla Dashboard →</a></p>`,
  };
}

function tB2B_Day21(name) {
  return {
    subject: `Guida compliance MiFID II per investimenti in fine wine`,
    html: `
<h2>Compliance MiFID II — fine wine</h2>
<p>Buongiorno ${name}. Il fine wine come asset alternativo nel contesto MiFID II: classificazione, documentazione e obblighi informativi.</p>
<div class="s">
  <p><strong>Classificazione MiFID II:</strong> il vino è un "bene materiale alternativo" (non strumento finanziario). Non rientra nelle categorie MiFID II direttamente, ma la consulenza su di esso può rientrare nell'ambito della "gestione di portafogli" se incluso in mandati discrezionali.</p>
  <p><strong>Obblighi informativi consigliati:</strong></p>
  <ul>
    <li>Informativa rischio liquidità (il vino non è un asset liquido)</li>
    <li>Disclosure costi custodia e storage</li>
    <li>Illustrazione della metodologia di valutazione</li>
    <li>Suitability assessment per la categoria cliente</li>
  </ul>
</div>
<div class="s-gold">
  <p>VinoInvest fornisce documentazione standardizzata per wealth manager. Richiedi il kit compliance scrivendo a compliance@vinoinvest.com.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/dashboard" class="btn">Vai alla Dashboard →</a></p>`,
  };
}

function tB2B_Day30(name) {
  return {
    subject: `Report mensile professionale — ${new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`,
    html: `
<h2>Report mensile professionale 📋</h2>
<p>Buongiorno ${name}. Allegato (o accessibile in dashboard) il report mensile professionale del mercato fine wine.</p>
<div style="text-align:center;margin:20px 0">
  <div class="kpi"><span class="kpi-val">+3.2%</span><span class="kpi-lbl">Bordeaux MoM</span></div>
  <div class="kpi"><span class="kpi-val">+5.8%</span><span class="kpi-lbl">Italia Premium MoM</span></div>
  <div class="kpi"><span class="kpi-val">-0.4%</span><span class="kpi-lbl">Borgogna MoM</span></div>
</div>
<div class="s">
  <p>📊 <strong>Highlights del mese:</strong></p>
  <ul>
    <li>Barolo continua a guidare il mercato italiano con domanda USA in forte crescita</li>
    <li>Bordeaux En Primeur 2024 delude le aspettative — opportunità di arbitraggio sul secondario</li>
    <li>Champagne Prestige stabile — domanda asiatica sostiene i prezzi DRC e Krug</li>
  </ul>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}/reports" class="btn">Scarica Report PDF →</a>&nbsp;
  <a href="${BASE_URL}/dashboard" class="btn-outline">Dashboard →</a>
</p>`,
  };
}

function tB2B_WeeklyBriefing(name, weekNum) {
  return {
    subject: `Market briefing professionale — settimana ${weekNum}`,
    html: `
<h2>Weekly professional briefing — W${weekNum}</h2>
<p>Buongiorno ${name}. Briefing settimanale mercato fine wine per professionisti.</p>
${topWines(5).map(wineCard).join('') || '<div class="wine-item">Accedi per i dati aggiornati</div>'}
<div class="s">
  <p>📰 <strong>Deal flow aste:</strong> Christie's Hong Kong prossima settimana — focus Borgogna e Champagne</p>
  <p>📊 <strong>Liv-ex 100:</strong> +0.8% settimana corrente</p>
  <p>⚠️ <strong>Alert:</strong> movimenti significativi su Masseto 2018 e Petrus 2019 — vedi analisi</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/market" class="btn">Apri Market Intelligence →</a></p>`,
  };
}

function tB2B_Day45_WhiteLabel(name) {
  return {
    subject: `Proposta white label per la tua struttura`,
    html: `
<h2>VinoInvest White Label 🏢</h2>
<p>Buongiorno ${name}. Dopo un mese e mezzo di utilizzo, vogliamo presentarti una proposta riservata.</p>
<div class="s-gold">
  <p><strong>VinoInvest White Label</strong> — la piattaforma completa con il tuo brand</p>
  <ul>
    <li>Dashboard personalizzata con logo e colori aziendali</li>
    <li>Accesso API completo per integrazioni CRM/Bloomberg</li>
    <li>Reportistica PDF brandizzata per i tuoi clienti</li>
    <li>SLA dedicato e account manager</li>
    <li>Moduli formativi co-branded</li>
  </ul>
</div>
<p>Disponibile per wealth manager, family office, private bank e SIM con più di 20 clienti HNWI.</p>
<p style="text-align:center;margin:28px 0"><a href="mailto:enterprise@vinoinvest.com?subject=White Label Inquiry" class="btn">Richiedi una Demo →</a></p>`,
  };
}

function tB2B_Day60(name) {
  return {
    subject: `Corso VinoInvest Professional — moduli avanzati disponibili`,
    html: `
<h2>Professional Track — moduli avanzati 🎓</h2>
<p>Buongiorno ${name}. Sono ora disponibili i moduli avanzati del Professional Track di VinoInvest Academy.</p>
<div class="s">
  <p>📚 <strong>Modulo 8:</strong> Portfolio construction istituzionale — ottimizzazione Markowitz applicata al fine wine</p>
  <p>📊 <strong>Modulo 9:</strong> Valutazione e pricing — DCF, comparable sales, Liv-ex benchmarking</p>
  <p>⚖️ <strong>Modulo 10:</strong> Framework legale e fiscale per professionisti (IVA, successione, trust)</p>
  <p>🌍 <strong>Modulo 11:</strong> Mercati emergenti — domanda asiatica, USA, Scandinavia</p>
</div>
<div class="s-gold">
  <p><strong>Certifica la tua competenza:</strong> il Certificato VinoInvest Professional è riconosciuto da 12 family office italiani come credito formativo per gestori patrimoniali.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Accedi al Professional Track →</a></p>`,
  };
}

// ── SCHEDULE DEFINITIONS ──────────────────────────────────────────────────────

const B2C_SCHEDULE = [
  { day: 0,   fn: (u) => tB2C_Day0(u.name) },
  { day: 3,   branch: async (u) => await wasEmailOpened(u.id, 0) ? tB2C_Day3_Opened(u.name) : tB2C_Day3_NoOpen(u.name) },
  { day: 7,   branch: async (u) => await hasPortfolio(u.id) ? tB2C_Day7_HasPortfolio(u.name) : tB2C_Day7_NoPortfolio(u.name) },
  { day: 14,  branch: async (u) => await isEngaged(u.id, 14) ? tB2C_Day14_Active(u.name) : tB2C_Day14_Inactive(u.name) },
  { day: 21,  fn: (u) => tB2C_Day21(u.name) },
  { day: 30,  fn: (u) => tB2C_Day30(u.name) },
  { day: 37,  fn: (u) => tB2C_Weekly(u.name, 5) },
  { day: 44,  fn: (u) => tB2C_Weekly(u.name, 6) },
  { day: 45,  fn: (u) => tB2C_Day45_Upsell(u.name) },
  { day: 51,  fn: (u) => tB2C_Weekly(u.name, 7) },
  { day: 58,  fn: (u) => tB2C_Weekly(u.name, 8) },
  { day: 60,  fn: (u) => tB2C_Day60(u.name) },
  { day: 65,  fn: (u) => tB2C_Weekly(u.name, 9) },
  { day: 72,  fn: (u) => tB2C_Weekly(u.name, 10) },
  { day: 79,  fn: (u) => tB2C_Weekly(u.name, 11) },
  { day: 86,  fn: (u) => tB2C_Weekly(u.name, 12) },
  { day: 90,  fn: (u) => tB2C_Day90(u.name) },
  { day: 97,  fn: (u) => tB2C_Day91_120_Reengagement(u.name, 14) },
  { day: 104, fn: (u) => tB2C_Day91_120_Reengagement(u.name, 15) },
  { day: 111, fn: (u) => tB2C_Day91_120_Reengagement(u.name, 16) },
  { day: 118, fn: (u) => tB2C_Day91_120_Reengagement(u.name, 17) },
  { day: 120, fn: (u) => tB2C_Day120_Offer(u.name) },
  { day: 127, fn: (u) => tB2C_Weekly(u.name, 18) },
  { day: 134, fn: (u) => tB2C_Weekly(u.name, 19) },
  { day: 141, fn: (u) => tB2C_Weekly(u.name, 20) },
  { day: 148, fn: (u) => tB2C_Weekly(u.name, 21) },
  { day: 150, fn: (u) => tB2C_Day150(u.name) },
  { day: 155, fn: (u) => tB2C_Weekly(u.name, 22) },
  { day: 162, fn: (u) => tB2C_Weekly(u.name, 23) },
  { day: 169, fn: (u) => tB2C_Weekly(u.name, 24) },
  { day: 176, fn: (u) => tB2C_Weekly(u.name, 25) },
  { day: 180, fn: (u) => tB2C_Day180(u.name) },
];

const B2B_SCHEDULE = [
  { day: 0,  fn: (u) => tB2B_Day0(u.name) },
  { day: 3,  fn: (u) => tB2B_Day3(u.name) },
  { day: 7,  fn: (u) => tB2B_Day7(u.name) },
  { day: 14, fn: (u) => tB2B_Day14(u.name) },
  { day: 21, fn: (u) => tB2B_Day21(u.name) },
  { day: 28, fn: (u) => tB2B_WeeklyBriefing(u.name, 4) },
  { day: 30, fn: (u) => tB2B_Day30(u.name) },
  { day: 35, fn: (u) => tB2B_WeeklyBriefing(u.name, 5) },
  { day: 42, fn: (u) => tB2B_WeeklyBriefing(u.name, 6) },
  { day: 45, fn: (u) => tB2B_Day45_WhiteLabel(u.name) },
  { day: 49, fn: (u) => tB2B_WeeklyBriefing(u.name, 7) },
  { day: 56, fn: (u) => tB2B_WeeklyBriefing(u.name, 8) },
  { day: 60, fn: (u) => tB2B_Day60(u.name) },
  { day: 63, fn: (u) => tB2B_WeeklyBriefing(u.name, 9) },
  { day: 70, fn: (u) => tB2B_WeeklyBriefing(u.name, 10) },
  { day: 77, fn: (u) => tB2B_WeeklyBriefing(u.name, 11) },
  { day: 84, fn: (u) => tB2B_WeeklyBriefing(u.name, 12) },
  { day: 90, fn: (u) => tB2B_Day30({ ...u, month: 3 }) },
  { day: 120, fn: (u) => tB2B_Day30({ ...u, month: 4 }) },
  { day: 150, fn: (u) => tB2B_WeeklyBriefing(u.name, 21) },
  { day: 180, fn: (u) => tB2B_Day30({ ...u, month: 6 }) },
];

// ── FLOW ENGINE ───────────────────────────────────────────────────────────────

export async function enqueueUserFlow(userId, email, firstName, accountType) {
  if (!pool) return;
  const segment = getSegment(accountType);
  await q(
    `INSERT INTO email_preferences (user_id, segment, frequency, subscribed, last_interaction)
     VALUES ($1,$2,'weekly',true,NOW())
     ON CONFLICT (user_id) DO NOTHING`,
    [userId, segment]
  );
  const user = { id: userId, email, name: firstName || 'amico', segment };
  await processEmailForDay(user, 0, segment === 'b2b' ? B2B_SCHEDULE : B2C_SCHEDULE);
}

async function processEmailForDay(user, dayNumber, schedule) {
  const entry = schedule.find(e => e.day === dayNumber);
  if (!entry) return;
  if (await wasAlreadySent(user.id, dayNumber)) return;

  const tpl = entry.branch ? await entry.branch(user) : entry.fn(user);
  if (!tpl) return;

  const html = layout(tpl.html, user.email, user.segment);
  const result = await sendEmail(user.email, tpl.subject, html);
  await recordSent(user.id, user.email, user.segment, dayNumber, tpl.subject, result.id);
  console.log(`[emailFlow] Day ${dayNumber} → ${user.email} (${user.segment}) — ${result.ok ? 'sent' : 'failed'}`);
}

export async function processScheduledFlows() {
  if (!pool) return;
  try {
    const { rows: users } = await q(`
      SELECT u.id, u.email, u.first_name, u.account_type,
             ep.segment, ep.subscribed,
             EXTRACT(DAY FROM NOW() - u.created_at)::int AS days_since_reg
      FROM users u
      LEFT JOIN email_preferences ep ON ep.user_id = u.id
      WHERE u.email IS NOT NULL AND (ep.subscribed IS NULL OR ep.subscribed = true)
        AND u.created_at IS NOT NULL
    `);

    for (const user of users) {
      const daysSince = user.days_since_reg || 0;
      const segment = user.segment || getSegment(user.account_type);
      const schedule = segment === 'b2b' ? B2B_SCHEDULE : B2C_SCHEDULE;
      const u = { id: user.id, email: user.email, name: user.first_name || 'amico', segment };

      for (const entry of schedule) {
        if (entry.day <= daysSince) {
          await processEmailForDay(u, entry.day, schedule);
        }
      }
    }
  } catch (e) {
    console.error("[emailFlow] processScheduledFlows:", e.message);
  }
}

// ── BEHAVIORAL TRIGGERS ───────────────────────────────────────────────────────

const BEHAVIORAL_TEMPLATES = {
  watchlist_added: (name, wine) => ({
    subject: `Analisi AI: ${wine?.name || 'nuovo vino nel watchlist'}`,
    html: `
<h2>Hai aggiunto ${wine?.name || 'un nuovo vino'} alla watchlist 👀</h2>
<p>Ciao ${name}, ecco l'analisi AI completa per supportare la tua decisione.</p>
<div class="s-gold">
  <p><strong>AI Score: ${wine?.investment_score || wine?.investmentScore || '–'}/100</strong></p>
  <p>Prezzo attuale: €${parseFloat(wine?.current_price || wine?.currentPrice || 0).toLocaleString('it-IT')}</p>
  <p>Trend: ${wine?.market_trend === 'up' ? '📈 In crescita' : wine?.market_trend === 'down' ? '📉 In calo' : '➡️ Stabile'}</p>
  <p>Risk: ${wine?.risk || '–'}</p>
</div>
<div class="s">
  <p><strong>Consiglio AI:</strong> monitora il price chart degli ultimi 90 giorni per identificare il punto di ingresso ottimale. Imposta un price alert al -5% per comprare nel momento giusto.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}?wine=${wine?.id}" class="btn">Analisi Completa →</a></p>`,
  }),

  price_alert_triggered: (name, wine, targetPrice) => ({
    subject: `🔔 Price alert: ${wine?.name || 'vino'} ha raggiunto €${targetPrice}`,
    html: `
<h2>Il tuo price alert è scattato! 🔔</h2>
<p>Ciao ${name}. Il prezzo di <strong>${wine?.name || 'vino'}</strong> ha raggiunto <strong>€${targetPrice}</strong>.</p>
<div class="s-gold">
  <p><strong>AI Score attuale: ${wine?.investment_score || wine?.investmentScore || '–'}/100</strong></p>
  <p>Prezzo attuale: <strong>€${parseFloat(wine?.current_price || wine?.currentPrice || targetPrice).toLocaleString('it-IT')}</strong></p>
</div>
<div class="s">
  <p>⚡ <strong>Agisci ora:</strong> questa finestra di prezzo potrebbe essere temporanea. Controlla il grafico storico per decidere se è il momento giusto.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}?wine=${wine?.id}" class="btn">Vedi il Grafico →</a></p>`,
  }),

  inactivity_7days: (name) => ({
    subject: `Sei mancato, ${name} — recap del mercato`,
    html: `
<h2>Cosa ti sei perso questa settimana 📊</h2>
<p>Ciao ${name}, sono 7 giorni che non accedi a VinoInvest. Ecco i movimenti principali:</p>
${topWines(3).map(wineCard).join('') || '<div class="wine-item">Accedi per i dati aggiornati</div>'}
<div class="s">
  <p>📈 Il mercato Barolo ha registrato un movimento importante questa settimana.</p>
  <p>🔔 Controlla i tuoi price alert — potrebbero esserci opportunità da non perdere.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Torna su VinoInvest →</a></p>`,
  }),

  course_completed: (name, courseName) => ({
    subject: `🎓 Hai completato "${courseName}" — ottimo lavoro!`,
    html: `
<h2>Congratulazioni, ${name}! 🎓</h2>
<p>Hai completato il corso <strong>"${courseName}"</strong>. Stai diventando un investitore sempre più preparato.</p>
<div class="s-gold">
  <p>Il tuo certificato è disponibile nel tuo profilo. Aggiungilo su LinkedIn — è un segnale forte per clienti e colleghi del settore.</p>
</div>
<div class="s">
  <p><strong>Prossimo step consigliato:</strong> applica quello che hai imparato analizzando 3 vini con AI Score superiore a 85. Poi aggiungili al portfolio watchlist e confronta le previsioni con i movimenti reali nelle prossime 4 settimane.</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}/academy" class="btn">Corso Successivo →</a>&nbsp;
  <a href="${BASE_URL}/profile" class="btn-outline">Vedi Certificato →</a>
</p>`,
  }),

  first_purchase: (name, wine) => ({
    subject: `🍾 Primo acquisto — analisi AI del tuo investimento`,
    html: `
<h2>Benvenuto nel club degli investitori! 🍾</h2>
<p>Ciao ${name}, hai appena fatto il tuo primo acquisto su VinoInvest. Un traguardo importante.</p>
${wine ? `
<div class="s-gold">
  <p><strong>${wine.name} ${wine.vintage || ''}</strong></p>
  <p>AI Score: ${wine.investment_score || wine.investmentScore || '–'}/100</p>
  <p>Prezzo acquisto: €${parseFloat(wine.current_price || wine.currentPrice || 0).toLocaleString('it-IT')}</p>
</div>` : ''}
<div class="s">
  <p>📊 <strong>Analisi AI del tuo acquisto:</strong></p>
  <p>✅ <strong>Conservazione:</strong> temperatura costante 12-14°C, umidità 70-75%, buio totale</p>
  <p>✅ <strong>Assicurazione:</strong> considera una polizza specifica per beni da collezione</p>
  <p>✅ <strong>Orizzonte:</strong> monitora ogni 6 mesi — non aprire prima del tempo ottimale</p>
  <p>✅ <strong>Documentazione:</strong> conserva fattura d'acquisto per eventuali transazioni future</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Vedi il Tuo Portfolio →</a></p>`,
  }),

  anniversary_1month: (name) => ({
    subject: `🎉 Un mese su VinoInvest — recap personale`,
    html: `
<h2>Un mese insieme! 🎉</h2>
<p>Ciao ${name}, è passato esattamente un mese da quando ti sei iscritto a VinoInvest.</p>
<div class="s">
  <p>📊 Il mercato fine wine questo mese: Italia +5.8%, Bordeaux +3.2%, Borgogna stabile</p>
  <p>🤖 L'AI ha analizzato oltre 50.000 bottiglie alla ricerca delle migliori opportunità</p>
  <p>📈 I vini con AI Score 90+ hanno guadagnato in media +2.3% questo mese</p>
</div>
<div class="s-gold">
  <p><strong>Il tuo prossimo step:</strong> se non hai ancora aggiunto vini al portfolio, ora è il momento. Il Barolo 2019 e il Brunello 2018 mostrano i segnali migliori per chi investe oggi.</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}" class="btn">Esplora Ora →</a>&nbsp;
  <a href="${BASE_URL}/academy" class="btn-outline">Academy →</a>
</p>`,
  }),
};

export async function triggerBehavioralEmail(userId, email, firstName, segment, eventType, eventData = {}) {
  if (!pool) return;
  const eventKey = `${eventType}:${eventData.wineId || eventData.courseName || ''}`;

  if (await wasAlreadyTriggered(userId, eventKey)) return;

  const name = firstName || 'amico';
  let tpl;

  switch (eventType) {
    case 'watchlist_added':
      tpl = BEHAVIORAL_TEMPLATES.watchlist_added(name, eventData.wine);
      break;
    case 'price_alert_triggered':
      tpl = BEHAVIORAL_TEMPLATES.price_alert_triggered(name, eventData.wine, eventData.targetPrice);
      break;
    case 'inactivity_7days':
      tpl = BEHAVIORAL_TEMPLATES.inactivity_7days(name);
      break;
    case 'course_completed':
      tpl = BEHAVIORAL_TEMPLATES.course_completed(name, eventData.courseName || 'corso');
      break;
    case 'first_purchase':
      tpl = BEHAVIORAL_TEMPLATES.first_purchase(name, eventData.wine);
      break;
    case 'anniversary_1month':
      tpl = BEHAVIORAL_TEMPLATES.anniversary_1month(name);
      break;
    default:
      return;
  }

  const html = layout(tpl.html, email, segment || 'b2c');
  const result = await sendEmail(email, tpl.subject, html);
  await recordSent(userId, email, segment || 'b2c', -1, tpl.subject, result.id, 'behavioral', eventKey);
  console.log(`[emailFlow] Behavioral ${eventType} → ${email} — ${result.ok ? 'sent' : 'failed'}`);
}

// ── INACTIVITY CHECK ──────────────────────────────────────────────────────────

export async function checkInactiveUsers() {
  if (!pool) return;
  try {
    const { rows } = await q(`
      SELECT u.id, u.email, u.first_name, u.account_type,
             EXTRACT(DAY FROM NOW() - COALESCE(u.last_login, u.created_at))::int AS inactive_days
      FROM users u
      LEFT JOIN email_preferences ep ON ep.user_id = u.id
      WHERE u.email IS NOT NULL AND (ep.subscribed IS NULL OR ep.subscribed = true)
        AND EXTRACT(DAY FROM NOW() - COALESCE(u.last_login, u.created_at)) >= 7
    `);

    for (const user of rows) {
      await triggerBehavioralEmail(
        user.id, user.email, user.first_name,
        getSegment(user.account_type), 'inactivity_7days', {}
      );
    }
  } catch (e) {
    console.error("[emailFlow] checkInactiveUsers:", e.message);
  }
}

// ── TRACKING ──────────────────────────────────────────────────────────────────

export async function trackEmailOpen(flowId) {
  if (!pool) return;
  await q(`UPDATE email_flows SET opened_at=NOW() WHERE id=$1 AND opened_at IS NULL`, [parseInt(flowId)]);
  await q(
    `UPDATE email_preferences SET last_interaction=NOW() WHERE user_id=(SELECT user_id FROM email_flows WHERE id=$1)`,
    [parseInt(flowId)]
  );
}

export async function trackEmailClick(flowId) {
  if (!pool) return;
  await q(`UPDATE email_flows SET clicked_at=NOW() WHERE id=$1`, [parseInt(flowId)]);
  await q(
    `UPDATE email_preferences SET last_interaction=NOW() WHERE user_id=(SELECT user_id FROM email_flows WHERE id=$1)`,
    [parseInt(flowId)]
  );
}

export async function handleUnsubscribe(email) {
  if (!pool) return;
  await q(`UPDATE email_preferences SET subscribed=false WHERE user_id=(SELECT id FROM users WHERE email=$1 LIMIT 1)`, [email]);
  await q(`UPDATE email_flows SET unsubscribed_at=NOW() WHERE user_email=$1 AND unsubscribed_at IS NULL ORDER BY sent_at DESC LIMIT 1`, [email]);
}

// ── PREFERENCES ───────────────────────────────────────────────────────────────

export async function getEmailPreference(userId) {
  if (!pool) return null;
  const { rows } = await q(`SELECT * FROM email_preferences WHERE user_id=$1`, [userId]);
  return rows[0] || null;
}

export async function setEmailPreference(userId, updates) {
  if (!pool) return;
  const fields = Object.keys(updates).filter(k => ['segment','frequency','subscribed'].includes(k));
  if (!fields.length) return;
  const setClause = fields.map((f, i) => `${f}=$${i + 2}`).join(', ');
  await q(
    `UPDATE email_preferences SET ${setClause}, last_interaction=NOW() WHERE user_id=$1`,
    [userId, ...fields.map(f => updates[f])]
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────────

export async function getEmailAnalytics() {
  if (!pool) return null;
  try {
    const [totals, bySegment, byDay, behavioral, recent, revenue] = await Promise.all([
      q(`SELECT
           COUNT(*) AS sent,
           COUNT(opened_at) AS opened,
           COUNT(clicked_at) AS clicked,
           COUNT(unsubscribed_at) AS unsubscribed,
           ROUND(COUNT(opened_at)::numeric/NULLIF(COUNT(*),0)*100, 1) AS open_rate,
           ROUND(COUNT(clicked_at)::numeric/NULLIF(COUNT(*),0)*100, 1) AS click_rate,
           ROUND(COUNT(unsubscribed_at)::numeric/NULLIF(COUNT(*),0)*100, 2) AS unsub_rate
         FROM email_flows`),

      q(`SELECT segment,
           COUNT(*) AS sent,
           COUNT(opened_at) AS opened,
           COUNT(clicked_at) AS clicked,
           ROUND(COUNT(opened_at)::numeric/NULLIF(COUNT(*),0)*100, 1) AS open_rate
         FROM email_flows GROUP BY segment ORDER BY sent DESC`),

      q(`SELECT day_number,
           COUNT(*) AS sent,
           COUNT(opened_at) AS opened,
           COUNT(clicked_at) AS clicked,
           ROUND(COUNT(opened_at)::numeric/NULLIF(COUNT(*),0)*100, 1) AS open_rate,
           email_subject
         FROM email_flows WHERE trigger_type='scheduled'
         GROUP BY day_number, email_subject ORDER BY day_number`),

      q(`SELECT trigger_event,
           COUNT(*) AS sent,
           COUNT(opened_at) AS opened,
           ROUND(COUNT(opened_at)::numeric/NULLIF(COUNT(*),0)*100, 1) AS open_rate
         FROM email_flows WHERE trigger_type='behavioral'
         GROUP BY trigger_event ORDER BY sent DESC`),

      q(`SELECT id, user_email, segment, day_number, trigger_type, trigger_event,
               email_subject, sent_at, opened_at, clicked_at
         FROM email_flows ORDER BY sent_at DESC LIMIT 20`),

      q(`SELECT COUNT(DISTINCT o.user_id) AS buyers,
           SUM(o.purchase_price * o.quantity) AS revenue
         FROM orders o
         WHERE o.created_at > (
           SELECT MAX(sent_at) FROM email_flows ef WHERE ef.user_id=o.user_id AND ef.clicked_at IS NOT NULL
         ) - INTERVAL '48 hours'`),
    ]);

    return {
      totals: totals.rows[0],
      bySegment: bySegment.rows,
      byDay: byDay.rows,
      behavioral: behavioral.rows,
      recent: recent.rows,
      revenueAttribution: revenue.rows[0],
    };
  } catch (e) {
    console.error("[emailFlow] getEmailAnalytics:", e.message);
    return null;
  }
}
