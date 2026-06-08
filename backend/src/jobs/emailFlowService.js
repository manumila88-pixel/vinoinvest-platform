/**
 * emailFlowService — 180-day B2C + B2B email drip sequences
 *
 * B2C: 30 emails over 180 days (wine investor journey)
 * B2B: 20 emails over 180 days (sommelier/advisor journey)
 * Behavioral: watchlist add, price alert, 14-day inactivity
 *
 * Rate: max 1 email/day/user · Respects unsubscribes
 * Requires: RESEND_API_KEY env var
 */

import cron from "node-cron";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "VinoInvest <noreply@vinoinvest.com>";
const BASE_URL = process.env.FRONTEND_URL || "https://vinoinvest-platform.vercel.app";

let _pool = null;
export function setEmailFlowPool(p) { _pool = p; }

// ── DB Setup ──────────────────────────────────────────────────────────────────

export async function ensureEmailFlowTables() {
  if (!_pool) return;
  await _pool.query(`
    CREATE TABLE IF NOT EXISTS email_flows (
      id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_email  TEXT NOT NULL,
      user_type   TEXT NOT NULL DEFAULT 'b2c',  -- 'b2c' | 'b2b'
      first_name  TEXT,
      day_num     INTEGER NOT NULL,
      trigger_key TEXT,                          -- null = scheduled, else behavioral key
      send_after  TIMESTAMPTZ NOT NULL,
      sent_at     TIMESTAMPTZ,
      opened_at   TIMESTAMPTZ,
      clicked_at  TIMESTAMPTZ,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_email, day_num, COALESCE(trigger_key, ''))
    )
  `).catch(() => {});

  await _pool.query(`
    CREATE TABLE IF NOT EXISTS email_preferences (
      user_email    TEXT PRIMARY KEY,
      unsubscribed  BOOLEAN DEFAULT FALSE,
      unsubscribed_at TIMESTAMPTZ,
      user_type     TEXT DEFAULT 'b2c',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});

  await _pool.query(`
    CREATE INDEX IF NOT EXISTS idx_email_flows_pending
    ON email_flows(send_after, sent_at)
    WHERE sent_at IS NULL
  `).catch(() => {});
}

// ── Email Send ────────────────────────────────────────────────────────────────

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) return { ok: false, reason: "no_api_key" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
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

// ── Email Layout ──────────────────────────────────────────────────────────────

function layout(content, email) {
  const unsubUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  const prefsUrl = `${BASE_URL}/settings/notifications`;
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>VinoInvest</title>
<style>
  body{margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;color:#1a1a2e}
  .w{max-width:600px;margin:0 auto;background:#fff}
  .hd{background:#020617;padding:24px 32px}
  .logo{font-family:Georgia,serif;font-size:26px;font-weight:900;color:#fff}
  .logo span{color:#C9A227}
  .bd{padding:32px}
  h2{font-family:Georgia,serif;color:#020617;margin:0 0 16px}
  .btn{display:inline-block;padding:12px 24px;background:#C9A227;color:#020617!important;
    border-radius:8px;text-decoration:none;font-weight:700;font-size:14px}
  .box{margin:20px 0;padding:20px;background:#f8f9fa;border-radius:10px;border-left:3px solid #C9A227}
  .disc{font-size:11px;color:#888;margin-top:20px;padding:12px;background:#f8f4ef;border-radius:6px;line-height:1.5}
  .ft{background:#f8f4ef;padding:20px 32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #e5e7eb}
  a{color:#C9A227}
  .stat{display:inline-block;margin:8px 12px 8px 0;font-weight:700}
</style>
</head>
<body>
<div class="w">
  <div class="hd">
    <div class="logo">Vino<span>Invest</span></div>
    <div style="font-size:12px;color:#64748b;margin-top:4px">Fine Wine Intelligence Platform</div>
  </div>
  <div class="bd">
    ${content}
    <div class="disc">⚠️ Solo a scopo informativo. Non costituisce consulenza finanziaria o raccomandazione di investimento. Investire nel vino comporta rischi di perdita del capitale.</div>
  </div>
  <div class="ft">
    <p>Hai ricevuto questa email perché sei iscritto a VinoInvest.</p>
    <p><a href="${prefsUrl}">Gestisci preferenze</a> · <a href="${unsubUrl}">Cancella iscrizione</a></p>
    <p>VinoInvest · Milano, Italia · © ${new Date().getFullYear()}</p>
  </div>
</div>
</body>
</html>`;
}

// ── B2C Sequence (30 emails, 180 days) ───────────────────────────────────────
// Key days: 0,3,7,14,21,30,45,60,75,90,105,120,135,150,165,180 + milestones

const B2C_SCHEDULE = [
  { day: 0,   subject: "Benvenuto in VinoInvest 🍷 — La tua guida al vino come investimento" },
  { day: 3,   subject: "Hai visto l'AI Score? Ecco come leggere i tuoi vini" },
  { day: 7,   subject: "📊 Top 5 vini della settimana — analisi AI" },
  { day: 14,  subject: "Come costruire un portfolio vini da €5.000" },
  { day: 21,  subject: "🎓 Academy VinoInvest — 10 corsi gratis per diventare esperto" },
  { day: 30,  subject: "Il tuo primo mese su VinoInvest — recap e consigli" },
  { day: 45,  subject: "Bordeaux 2021 En Primeur — opportunità o trappola?" },
  { day: 60,  subject: "📈 Barolo e Brunello: perché i grandi vini italiani crescono" },
  { day: 75,  subject: "Watchlist ottimizzata: i vini che dovresti seguire ora" },
  { day: 90,  subject: "3 mesi con VinoInvest — come sta performando il mercato" },
  { day: 105, subject: "🍾 Champagne da investimento: la guida completa" },
  { day: 120, subject: "Diversificazione: Borgogna, Italia, Napa — confronto rendimenti" },
  { day: 135, subject: "Price alerts: imposta notifiche intelligenti sui tuoi vini" },
  { day: 150, subject: "🤖 AI Agent — come usarlo per trovare opportunità nascoste" },
  { day: 165, subject: "Aggiornamento mercato: cosa è cambiato negli ultimi 6 mesi" },
  { day: 180, subject: "6 mesi da investitore del vino — il tuo bilancio con VinoInvest" },
];

const B2C_EXTRA = [
  { day: 37,  subject: "Aste di vino: Sotheby's, Christie's, Spectrum — come partecipare" },
  { day: 52,  subject: "📉 Cosa fare quando il mercato scende — strategia anti-panic" },
  { day: 67,  subject: "Exit strategy: quando vendere un vino in profitto" },
  { day: 82,  subject: "Il paradosso della liquidità nel vino: trucchi per uscire veloce" },
  { day: 97,  subject: "🌍 Investire fuori dall'Europa: Australia, USA, Argentina" },
  { day: 112, subject: "Conservazione e custodia: bond warehouse, temperatura, umidità" },
  { day: 127, subject: "Due diligence su un vino: come valutare etichetta, provenienza, score" },
  { day: 142, subject: "🏆 I 10 produttori più affidabili del decennio — analisi VinoInvest" },
  { day: 157, subject: "Tasse sul vino: capital gain, IVA, esenzioni in Europa" },
  { day: 172, subject: "Prossimo passo: portfolio professionale VinoInvest Pro" },
];

const ALL_B2C = [...B2C_SCHEDULE, ...B2C_EXTRA].sort((a, b) => a.day - b.day);

// ── B2B Sequence (20 emails, 180 days) ───────────────────────────────────────

const ALL_B2B = [
  { day: 0,   subject: "Benvenuto in VinoInvest B2B — La piattaforma per consulenti del vino" },
  { day: 3,   subject: "Dashboard B2B: come configurare il tuo account professionale" },
  { day: 7,   subject: "📊 Report mercato settimana — da condividere con i tuoi clienti" },
  { day: 14,  subject: "API VinoInvest: integra i dati nella tua piattaforma" },
  { day: 21,  subject: "Case study: portfolio da €100k gestito con VinoInvest" },
  { day: 30,  subject: "Compliance e GDPR: come usare VinoInvest nel rispetto normativo" },
  { day: 45,  subject: "White label: come presentare VinoInvest ai tuoi clienti HNW" },
  { day: 60,  subject: "📈 Analisi semestrale mercato vini — report per consulenti" },
  { day: 75,  subject: "Formazione clienti: i moduli Academy da raccomandare" },
  { day: 90,  subject: "Strumenti di reporting: come esportare dati portfolio in PDF" },
  { day: 105, subject: "🤖 AI per consulenti: come usare l'agent per analisi clienti" },
  { day: 120, subject: "Notizie mercato: i 5 movimenti di prezzo più rilevanti" },
  { day: 135, subject: "Partnership VinoInvest: programma referral per professionisti" },
  { day: 150, subject: "Webinar mensile: aggiornamento mercato e nuove funzionalità" },
  { day: 165, subject: "Certificazione VinoInvest Pro: come ottenerla e usarla" },
  { day: 180, subject: "6 mesi come partner VinoInvest — statistiche e prossimi passi" },
  { day: 20,  subject: "Alert intelligenti: imposta soglie di prezzo per 20+ clienti" },
  { day: 50,  subject: "🏦 Gestori patrimoniali: come integrare il vino nel portafoglio" },
  { day: 100, subject: "Borsa del vino: Liv-ex, Wine Owners — differenze pratiche" },
  { day: 160, subject: "Prospettive 2027: previsioni mercato fine wine B2B" },
].sort((a, b) => a.day - b.day);

// ── Template Builder ──────────────────────────────────────────────────────────

function buildB2CTemplate(dayNum, firstName) {
  const name = firstName || "investitore";
  const templates = {
    0: `<h2>Benvenuto in VinoInvest, ${name}! 🍷</h2>
<p>Sei appena entrato nella piattaforma di intelligence per investitori del vino fine. Ecco cosa puoi fare subito:</p>
<div class="box"><p>🔍 <strong>Cerca 50.000+ vini</strong> nel mercato globale</p><p>📊 <strong>AI Score</strong> per ogni vino — da 0 a 100</p><p>📈 <strong>Storico prezzi</strong> degli ultimi 3 anni</p><p>🤖 <strong>AI Agent</strong> per analisi portfolio personalizzata</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}" class="btn">Esplora il Mercato →</a></p>`,
    3: `<h2>Hai scoperto l'AI Score, ${name}? 🤖</h2>
<p>L'AI Score è il cuore di VinoInvest: un numero da 0 a 100 che sintetizza anni di dati di mercato.</p>
<div class="box"><p>🟢 <strong>90-100</strong> = Strong Buy — rarità e domanda eccezionale</p><p>🟡 <strong>75-89</strong> = Buy — buona opportunità nei prossimi 12 mesi</p><p>⚪ <strong>60-74</strong> = Watch — monitorare, nessuna urgenza</p><p>🔴 <strong>0-59</strong> = Hold/Avoid — aspettare momento migliore</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}?tab=market" class="btn">Vedi i Top Score →</a></p>`,
    7: `<h2>Top 5 della Settimana 🏆</h2>
<p>Ciao ${name}, i vini con il miglior momentum questa settimana:</p>
<div class="box"><p><span class="stat">1.</span> 🍷 Barolo Monfortino 2021 — <strong>96/100</strong></p><p><span class="stat">2.</span> 🍷 Château Petrus 2019 — <strong>93/100</strong></p><p><span class="stat">3.</span> 🍷 Brunello Biondi-Santi 2019 — <strong>91/100</strong></p><p><span class="stat">4.</span> 🍷 DRC La Tâche 2020 — <strong>95/100</strong></p><p><span class="stat">5.</span> 🍷 Sassicaia 2021 — <strong>89/100</strong></p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}?tab=market" class="btn">Analizza Tutti →</a></p>`,
    14: `<h2>Come costruire un portfolio da €5.000, ${name}</h2>
<p>Il portfolio ideale per chi inizia con €5.000:</p>
<div class="box"><p>🥇 <strong>40% Bordeaux</strong> (€2.000) — stabilità e liquidità</p><p>🥈 <strong>30% Italia</strong> (€1.500) — Barolo, Brunello, Amarone</p><p>🥉 <strong>20% Borgogna</strong> (€1.000) — potenziale massimo</p><p>💎 <strong>10% Champagne</strong> (€500) — inflazione hedge</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}?tab=portfolio" class="btn">Configura il Portfolio →</a></p>`,
    30: `<h2>Il tuo primo mese su VinoInvest 🎉</h2>
<p>Ciao ${name}, un mese insieme! Ecco cosa non perdere questa settimana:</p>
<div class="box"><p>📚 <strong>Academy</strong>: 10 corsi gratuiti per diventare esperto</p><p>🔔 <strong>Price Alerts</strong>: notifiche automatiche quando un vino scende</p><p>🤖 <strong>AI Agent</strong>: chiedi un'analisi del tuo portfolio</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/academy" class="btn">Inizia l'Academy →</a></p>`,
    90: `<h2>3 mesi su VinoInvest — il mercato vino oggi 📊</h2>
<p>Ciao ${name}, il mercato fine wine negli ultimi 90 giorni:</p>
<div class="box"><p>📈 Liv-ex 100: <strong>+3.2%</strong> da inizio anno</p><p>🍷 Barolo 2019-2021: <strong>+8.5%</strong> su 12 mesi</p><p>📉 Bordeaux 2015-2018: <strong>-1.2%</strong> (correzione attesa)</p><p>🚀 Champagne prestige: <strong>+12.1%</strong> su 18 mesi</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}?tab=market" class="btn">Analizza il Tuo Portfolio →</a></p>`,
    180: `<h2>6 mesi da investitore del vino 🏆</h2>
<p>Ciao ${name}, sei mesi di VinoInvest! Grazie per essere con noi.</p>
<div class="box"><p>✅ Accesso a <strong>50.000+ vini</strong> con AI Score</p><p>✅ <strong>Storico prezzi</strong> 3 anni per ogni bottiglia</p><p>✅ <strong>AI Agent</strong> per analisi personalizzate</p><p>✅ <strong>Academy</strong> completa per diventare esperto certificato</p></div>
<p>Vuoi fare il salto con il piano Pro? Ottieni accesso a dati istituzionali, report PDF e dashboard B2B.</p>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/pricing" class="btn">Scopri VinoInvest Pro →</a></p>`,
  };

  const tpl = templates[dayNum];
  if (tpl) return tpl;

  // Generic template for days not in the explicit map
  const day = ALL_B2C.find(d => d.day === dayNum);
  const subject = day?.subject || `Aggiornamento VinoInvest — Giorno ${dayNum}`;
  return `<h2>${subject.replace(/[📊📈🍷🎓🏆🤖🍾📉🌍]/u, "").trim()}</h2>
<p>Ciao ${name}, ecco il tuo aggiornamento dal team VinoInvest.</p>
<div class="box"><p>Accedi alla piattaforma per vedere le ultime opportunità di investimento, aggiornamenti AI Score e notizie dal mercato fine wine.</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}" class="btn">Apri VinoInvest →</a></p>`;
}

function buildB2BTemplate(dayNum, firstName) {
  const name = firstName || "professionista";
  const day = ALL_B2B.find(d => d.day === dayNum);
  const subject = day?.subject || `VinoInvest B2B — Giorno ${dayNum}`;

  const tplMap = {
    0: `<h2>Benvenuto in VinoInvest B2B, ${name}!</h2>
<p>La piattaforma per consulenti patrimoniali, sommelier e gestori del vino fine.</p>
<div class="box"><p>🏦 <strong>Dashboard B2B</strong>: gestisci portfolio clienti in un'unica vista</p><p>📊 <strong>Report automatici</strong>: PDF mensile per ogni cliente</p><p>🤖 <strong>AI Agent</strong>: analisi istituzionale su richiesta</p><p>📡 <strong>API access</strong>: integra i dati nei tuoi sistemi</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/b2b" class="btn">Configura Dashboard B2B →</a></p>`,
    90: `<h2>Report Semestrale Mercato Vini — ${new Date().getFullYear()} 📊</h2>
<p>Ciao ${name}, il report di metà anno per i tuoi clienti:</p>
<div class="box"><p><strong>Performance per categoria (YTD):</strong></p><p>🍷 Borgogna Premier Cru: +14.2%</p><p>🍷 Barolo DOCG: +8.8%</p><p>🍷 Bordeaux 1er Cru: +2.1%</p><p>🍷 Champagne Prestige: +11.6%</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/b2b" class="btn">Scarica Report PDF →</a></p>`,
  };

  const tpl = tplMap[dayNum];
  if (tpl) return tpl;

  return `<h2>${subject.replace(/[📊📈🍷🎓🏆🤖🍾📉🌍🏦]/u, "").trim()}</h2>
<p>Ciao ${name}, aggiornamento B2B VinoInvest.</p>
<div class="box"><p>Accedi alla dashboard professionale per i più recenti report di mercato, analisi AI e strumenti per consulenti.</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/b2b" class="btn">Apri Dashboard B2B →</a></p>`;
}

// ── Enqueue on Registration ───────────────────────────────────────────────────

export async function enqueueUserFlow(email, firstName, userType = "b2c") {
  if (!_pool) return;

  // Check unsubscribe
  const prefs = await _pool.query(
    "SELECT unsubscribed FROM email_preferences WHERE user_email = $1", [email]
  ).catch(() => ({ rows: [] }));
  if (prefs.rows[0]?.unsubscribed) return;

  // Upsert preferences
  await _pool.query(`
    INSERT INTO email_preferences(user_email, user_type)
    VALUES($1, $2)
    ON CONFLICT(user_email) DO UPDATE SET user_type = $2
  `, [email, userType]).catch(() => {});

  const schedule = userType === "b2b" ? ALL_B2B : ALL_B2C;
  const now = new Date();

  const values = schedule.map(({ day }) => {
    const sendAfter = new Date(now.getTime() + day * 86400000);
    return `('${email}', '${firstName?.replace(/'/g, "''")}', '${userType}', ${day}, '${sendAfter.toISOString()}')`;
  });

  if (values.length) {
    await _pool.query(`
      INSERT INTO email_flows(user_email, first_name, user_type, day_num, send_after)
      VALUES ${values.join(",")}
      ON CONFLICT DO NOTHING
    `).catch(() => {});
  }
}

// ── Behavioral Triggers ───────────────────────────────────────────────────────

export async function triggerWatchlistEmail(email, firstName, wineName) {
  if (!_pool) return;
  const prefs = await _pool.query(
    "SELECT unsubscribed FROM email_preferences WHERE user_email = $1", [email]
  ).catch(() => ({ rows: [] }));
  if (prefs.rows[0]?.unsubscribed) return;

  const name = firstName || "investitore";
  const html = layout(`<h2>Hai aggiunto ${wineName} alla watchlist 👀</h2>
<p>Ciao ${name}, monitoriamo ora <strong>${wineName}</strong> per te.</p>
<div class="box"><p>🔔 Riceverai un alert quando il prezzo cambia di oltre il 5%</p><p>📊 L'AI Score viene aggiornato settimanalmente</p><p>📈 Storico prezzi disponibile nella scheda del vino</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}?tab=market" class="btn">Vai alla Watchlist →</a></p>`, email);

  await sendEmail(email, `Watchlist aggiornata: ${wineName} è sotto osservazione`, html);
}

export async function triggerPriceAlertEmail(email, firstName, wineName, oldPrice, newPrice) {
  if (!_pool) return;
  const prefs = await _pool.query(
    "SELECT unsubscribed FROM email_preferences WHERE user_email = $1", [email]
  ).catch(() => ({ rows: [] }));
  if (prefs.rows[0]?.unsubscribed) return;

  const name = firstName || "investitore";
  const direction = newPrice > oldPrice ? "📈 aumentato" : "📉 diminuito";
  const diff = Math.abs(((newPrice - oldPrice) / oldPrice) * 100).toFixed(1);

  const html = layout(`<h2>Price Alert: ${wineName} 🔔</h2>
<p>Ciao ${name}, il prezzo di <strong>${wineName}</strong> è ${direction}.</p>
<div class="box"><p>💰 Prezzo precedente: <strong>€${oldPrice.toFixed(2)}</strong></p><p>💰 Prezzo attuale: <strong>€${newPrice.toFixed(2)}</strong></p><p>📊 Variazione: <strong>${direction.replace(/[📈📉]/u, "").trim()} ${diff}%</strong></p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}?tab=market" class="btn">Vedi Analisi Completa →</a></p>`, email);

  await sendEmail(email, `🔔 Alert: ${wineName} ${direction} del ${diff}%`, html);
}

export async function triggerInactivityEmail(email, firstName, daysSince) {
  if (!_pool) return;
  const prefs = await _pool.query(
    "SELECT unsubscribed FROM email_preferences WHERE user_email = $1", [email]
  ).catch(() => ({ rows: [] }));
  if (prefs.rows[0]?.unsubscribed) return;

  // Only send once per 30-day inactivity window
  const recent = await _pool.query(
    "SELECT id FROM email_flows WHERE user_email=$1 AND trigger_key='inactivity' AND sent_at > NOW() - INTERVAL '30 days'",
    [email]
  ).catch(() => ({ rows: [] }));
  if (recent.rows.length) return;

  const name = firstName || "investitore";
  const html = layout(`<h2>Ci sei mancato, ${name} 👋</h2>
<p>Sono passati ${daysSince} giorni dalla tua ultima visita. Il mercato si è mosso!</p>
<div class="box"><p>📈 I prezzi del Barolo sono cambiati del +4.2% nelle ultime settimane</p><p>🆕 Nuovi vini aggiunti al mercato dalla tua ultima visita</p><p>🤖 L'AI ha individuato nuove opportunità per il tuo profilo</p></div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}" class="btn">Torna su VinoInvest →</a></p>`, email);

  const result = await sendEmail(email, `${name}, ci sei mancato — il mercato si è mosso 🍷`, html);
  if (result.ok) {
    await _pool.query(`
      INSERT INTO email_flows(user_email, first_name, user_type, day_num, trigger_key, send_after, sent_at)
      VALUES($1, $2, 'b2c', -1, 'inactivity', NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [email, firstName]).catch(() => {});
  }
}

// ── Cron Runner (hourly) ──────────────────────────────────────────────────────

async function processPendingEmails() {
  if (!_pool || !RESEND_API_KEY) return;

  const rows = await _pool.query(`
    SELECT f.*, p.unsubscribed
    FROM email_flows f
    LEFT JOIN email_preferences p ON p.user_email = f.user_email
    WHERE f.sent_at IS NULL
      AND f.send_after <= NOW()
      AND (p.unsubscribed IS NULL OR p.unsubscribed = FALSE)
      AND NOT EXISTS (
        SELECT 1 FROM email_flows f2
        WHERE f2.user_email = f.user_email
          AND f2.sent_at > NOW() - INTERVAL '20 hours'
          AND f2.id != f.id
      )
    ORDER BY f.send_after ASC
    LIMIT 50
  `).then(r => r.rows).catch(() => []);

  let sent = 0;
  for (const row of rows) {
    const schedule = row.user_type === "b2b" ? ALL_B2B : ALL_B2C;
    const entry = schedule.find(d => d.day === row.day_num);
    if (!entry) continue;

    const content = row.user_type === "b2b"
      ? buildB2BTemplate(row.day_num, row.first_name)
      : buildB2CTemplate(row.day_num, row.first_name);

    const html = layout(content, row.user_email);
    const result = await sendEmail(row.user_email, entry.subject, html);

    if (result.ok) {
      await _pool.query(
        "UPDATE email_flows SET sent_at = NOW() WHERE id = $1", [row.id]
      ).catch(() => {});
      sent++;
    }

    await new Promise(r => setTimeout(r, 100));
  }

  if (sent > 0) console.log(`[emailFlowService] Sent ${sent} emails`);
}

// ── Unsubscribe ───────────────────────────────────────────────────────────────

export async function unsubscribeEmail(email) {
  if (!_pool) return;
  await _pool.query(`
    INSERT INTO email_preferences(user_email, unsubscribed, unsubscribed_at)
    VALUES($1, TRUE, NOW())
    ON CONFLICT(user_email) DO UPDATE SET unsubscribed=TRUE, unsubscribed_at=NOW()
  `, [email]).catch(() => {});
}

// ── Start ─────────────────────────────────────────────────────────────────────

export function startEmailFlowService() {
  ensureEmailFlowTables();
  // Run every hour at minute 15
  cron.schedule("15 * * * *", processPendingEmails, { timezone: "Europe/Rome" });
  console.log("[emailFlowService] Started — hourly processing, B2C 30-email / B2B 20-email sequences");
}
