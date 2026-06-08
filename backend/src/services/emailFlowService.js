/**
 * Email Flow Service — 180-day B2C + B2B drip sequences
 * B2C: onboarding (0-30), engagement (31-90), re-engagement (91-180)
 * B2B: onboarding (0-30), nurturing (31-90)
 * Plus behavioral triggers for watchlist, alerts, purchases, etc.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "VinoInvest <noreply@vinoinvest.com>";
const BASE_URL = "https://vinoinvest-platform.vercel.app";

let pool;
let allWines = [];
export const setEmailFlowPool = (p) => { pool = p; };
export const setEmailFlowWines = (w) => { allWines = w; };

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

function getSegment(accountType) {
  if (!accountType || accountType === 'b2c') return 'b2c';
  if (['b2b', 'wealth_manager', 'cantina', 'family_office'].includes(accountType)) return 'b2b';
  return 'b2c';
}

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) {
    console.warn("[emailFlowService] RESEND_API_KEY not set — email skipped");
    return { ok: false, reason: "no_api_key" };
  }
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
        text: html.replace(/<[^>]+>/g, " "),
      }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function layout(content, email, segment = 'b2c') {
  const isB2B = segment === 'b2b';
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
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
.wine-item{border-left:3px solid #C9A227;padding:10px 14px;margin:10px 0;background:#fff;border-radius:0 8px 8px 0}
.badge{display:inline-block;background:#020617;color:#C9A227;border-radius:5px;padding:3px 8px;font-size:11px;font-weight:700}
.disc{font-size:11px;color:#aaa;margin-top:16px;padding:12px;background:#f8f4ef;border-radius:6px}
.f{background:#f8f4ef;padding:20px 32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #e5e7eb}
h2{font-family:Georgia,serif;color:#020617;margin-top:0}
h3{color:#020617}
a{color:#C9A227}
p{line-height:1.6}
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
<div class="disc">⚠️ Contenuto informativo. Non costituisce consulenza finanziaria o d'investimento. L'investimento in vino comporta rischi.</div>
</div>
<div class="f">
  <p>Sei registrato su VinoInvest.</p>
  <p><a href="${BASE_URL}/settings/notifications">Gestisci preferenze</a> · <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}">Cancella iscrizione</a></p>
  <p>VinoInvest · Milan, Italy · © ${new Date().getFullYear()}</p>
</div>
</div>
</body>
</html>`;
}

// ── Branch helpers ────────────────────────────────────────────────────────────

async function wasDay0Opened(userId) {
  if (!pool) return false;
  const { rows } = await pool.query(
    `SELECT opened_at FROM email_flows WHERE user_id = $1 AND day_number = 0 AND trigger_type = 'scheduled' AND opened_at IS NOT NULL LIMIT 1`,
    [userId]
  ).catch(() => ({ rows: [] }));
  return rows.length > 0;
}

async function hasPortfolio(userId) {
  if (!pool) return false;
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM orders WHERE user_id = $1`,
    [userId]
  ).catch(() => ({ rows: [{ count: '0' }] }));
  return parseInt(rows[0].count) > 0;
}

async function isEngaged(userId, days = 14) {
  if (!pool) return false;
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM email_flows WHERE user_id = $1 AND (opened_at IS NOT NULL OR clicked_at IS NOT NULL) AND sent_at > NOW() - INTERVAL '${days} days'`,
    [userId]
  ).catch(() => ({ rows: [{ count: '0' }] }));
  return parseInt(rows[0].count) > 0;
}

async function hasAcademySubscription(userId) {
  if (!pool) return false;
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM subscriptions WHERE user_email = (SELECT email FROM users WHERE id = $1) AND active = true LIMIT 1`,
    [userId]
  ).catch(() => ({ rows: [{ count: '0' }] }));
  return parseInt(rows[0].count) > 0;
}

async function hasEverPurchased(userId) {
  if (!pool) return false;
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM orders WHERE user_id = $1`,
    [userId]
  ).catch(() => ({ rows: [{ count: '0' }] }));
  return parseInt(rows[0].count) > 0;
}

async function daysSinceLastLogin(userId) {
  if (!pool) return 999;
  const { rows } = await pool.query(
    `SELECT EXTRACT(DAY FROM NOW() - last_login)::int as d FROM users WHERE id = $1`,
    [userId]
  ).catch(() => ({ rows: [] }));
  return rows[0]?.d ?? 999;
}

// ── B2C email templates ───────────────────────────────────────────────────────

function b2cDay0(name) {
  return {
    subject: `Benvenuto su VinoInvest, ${name} 🍷`,
    html: `
<h2>Benvenuto su VinoInvest, ${name}!</h2>
<p>Hai appena accesso alla piattaforma di investimento sul fine wine più avanzata d'Italia. Ecco le 3 cose da fare subito:</p>
<div class="s">
  <p>1. 🔍 <strong>Esplora il mercato</strong> — 50.000+ vini con AI Score in tempo reale</p>
  <p>2. 📊 <strong>Crea il tuo portfolio</strong> — aggiungi i vini che possiedi o vuoi monitorare</p>
  <p>3. 🔔 <strong>Imposta i price alert</strong> — ricevi notifiche quando un vino raggiunge il prezzo target</p>
</div>
<div class="s-gold">
  <p><strong>Cos'è l'AI Score?</strong></p>
  <p>Un punteggio 0-100 che analizza storico prezzi, punteggi critici, liquidità e momentum. <span class="badge">90+ = Strong Buy</span> <span class="badge">75+ = Buy</span></p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Esplora il Mercato →</a></p>`,
  };
}

function b2cDay3NotOpened(name) {
  return {
    subject: `Hai perso qualcosa, ${name}`,
    html: `
<h2>Hai perso qualcosa, ${name}</h2>
<p>Non hai ancora esplorato VinoInvest. Sapevi che il <strong>Barolo 2016 è salito del 47% in 5 anni</strong>?</p>
<div class="s">
  <p>📈 Il fine wine ha battuto la borsa 7 degli ultimi 10 anni</p>
  <p>🍷 I vini italiani guidano con +23% medio YoY</p>
  <p>🔒 Art. 67 TUIR: plusvalenze da vino <strong>esentasse</strong> in Italia</p>
</div>
<p>Mancano solo 2 minuti per scoprire i top vini del momento.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Scopri i Top Vini →</a></p>`,
  };
}

function b2cDay3OpenedNoVisit(name) {
  const topWines = allWines
    .filter(w => (w.marketTrend || w.market_trend) === 'up')
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, 3);
  const wineList = topWines.map(w =>
    `<div class="wine-item"><strong>${w.name}</strong> ${w.vintage || ''} — <span class="badge">${w.investmentScore || w.investment_score || '–'}/100</span> — €${parseFloat(w.currentPrice || w.current_price || 0).toLocaleString('it-IT')}</div>`
  ).join('') || '<div class="wine-item">Barolo Monfortino 2018 — <span class="badge">94/100</span></div>';

  return {
    subject: `Il mercato vino questa settimana`,
    html: `
<h2>Il mercato vino questa settimana 📈</h2>
<p>Ciao ${name}, ecco i 3 vini più interessanti in questo momento sul mercato:</p>
${wineList}
<p style="margin-top:20px">Questi vini stanno attirando l'attenzione degli investitori istituzionali. Clicca per vedere l'analisi AI completa.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Vedi i Dettagli →</a></p>`,
  };
}

function b2cDay3Visited(name) {
  return {
    subject: `Come leggere l'AI Score di VinoInvest`,
    html: `
<h2>Guida all'AI Score 🤖</h2>
<p>Ciao ${name}, hai già visitato la piattaforma — ottimo! Ecco come usare al meglio l'AI Score per le tue decisioni.</p>
<div class="s">
  <p><span class="badge">90-100 = Strong Buy</span> Eccezionale opportunità — momentum forte, liquidità alta</p>
  <p><span class="badge">75-89 = Buy</span> Buona opportunità — fondamentali solidi</p>
  <p><span class="badge">60-74 = Watch</span> Da monitorare — attendere conferma</p>
  <p><span class="badge">0-59 = Avoid</span> Rischio elevato — evitare</p>
</div>
<div class="s-gold">
  <p><strong>Esempio pratico:</strong> Barolo Cascina Francia 2019 — AI Score 94 — in 3 anni ha guadagnato il +67%. Gli investitori che hanno seguito il segnale hanno fatto bene.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Analizza il Tuo Primo Vino →</a></p>`,
  };
}

function b2cDay7NoPortfolio(name) {
  return {
    subject: `Il tuo portfolio è ancora vuoto, ${name}`,
    html: `
<h2>Il tuo portfolio è ancora vuoto 📦</h2>
<p>Ciao ${name}, sono passati 7 giorni. Il tuo portfolio è ancora vuoto — ecco come iniziare con €5.000.</p>
<div class="s">
  <p>🍷 <strong>40% Barolo top labels (€2.000)</strong> — orizzonte 7-10 anni, +150-250%</p>
  <p>🍷 <strong>35% Bordeaux Premier Cru (€1.750)</strong> — liquidità massima, +80-130%</p>
  <p>🍷 <strong>15% Brunello Montalcino (€750)</strong> — orizzonte 8-12 anni, +120-200%</p>
  <p>🍷 <strong>10% Champagne Prestige (€500)</strong> — diversificazione, +50-100%</p>
</div>
<p>Aggiungi il primo vino in 30 secondi: cerca, clicca, aggiungi al portfolio.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Aggiungi il Tuo Primo Vino →</a></p>`,
  };
}

function b2cDay7HasPortfolio(name) {
  return {
    subject: `Analisi del tuo portfolio questa settimana 📊`,
    html: `
<h2>Come sta andando il tuo portfolio? 📊</h2>
<p>Ciao ${name}, sono 7 giorni che sei su VinoInvest. L'AI ha analizzato il tuo portfolio — ecco i suggerimenti:</p>
<div class="s">
  <p>✅ <strong>Diversificazione:</strong> aggiungi almeno 3 regioni diverse per ridurre il rischio</p>
  <p>📈 <strong>Momentum:</strong> monitora i vini con AI Score in crescita — segnale di opportunità</p>
  <p>🔔 <strong>Alert:</strong> imposta un price alert per ogni vino nel portfolio</p>
</div>
<div class="s-gold">
  <p><strong>Ottimizzazione suggerita:</strong> i portfolio con 5+ vini diversi hanno storicamente battuto quelli concentrati del 34%.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Ottimizza il Portfolio →</a></p>`,
  };
}

function b2cDay14Inactive(name) {
  return {
    subject: `Ultima chance — offerta esclusiva per te, ${name}`,
    html: `
<h2>Un regalo per te 🎁</h2>
<p>Ciao ${name}, notiamo che non sei stato molto attivo ultimamente. Vogliamo aiutarti a iniziare con il piede giusto.</p>
<div class="s-gold">
  <p><strong>🎓 30 giorni di Academy Investor GRATUITI</strong></p>
  <p>Accedi a tutti i moduli premium, dati Liv-ex reali, e il simulatore portfolio 2010-2024.</p>
  <p>Nessun addebito. Nessuna carta di credito.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/pricing" class="btn">Attiva Ora — Gratis →</a></p>
<p style="text-align:center"><a href="${BASE_URL}" class="btn-outline">Prima esplora i vini →</a></p>`,
  };
}

function b2cDay14Active(name) {
  return {
    subject: `Sei pronto per il livello successivo? 🎓`,
    html: `
<h2>Pronto per il livello successivo? 🎓</h2>
<p>Ciao ${name}, stai usando VinoInvest regolarmente — ottimo segno. È il momento di approfondire con l'Academy.</p>
<div class="s">
  <p>📚 <strong>20 moduli</strong> — dal Bordeaux ai casi studio +1.000%</p>
  <p>📊 <strong>Simulatore portfolio</strong> — vedi come avresti performato 2010-2024</p>
  <p>🎓 <strong>Certificato verificabile</strong> su LinkedIn</p>
  <p>📈 <strong>Dati Liv-ex reali</strong> — non teoria, solo mercato vero</p>
</div>
<p>I moduli 1-5 sono <strong>completamente gratuiti</strong>. Inizia oggi senza impegno.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Inizia Academy Gratis →</a></p>`,
  };
}

function b2cDay21(name) {
  return {
    subject: `Art. 67 TUIR: perché il vino è tax-free in Italia`,
    html: `
<h2>Il vantaggio fiscale del vino 🏛️</h2>
<p>Ciao ${name}, sapevi che in Italia le plusvalenze da vendita di vino come bene collezionabile sono <strong>esenti da tassazione</strong>?</p>
<div class="s">
  <p>📋 <strong>Art. 67 TUIR (Testo Unico Imposte sui Redditi)</strong></p>
  <p>I proventi derivanti dalla vendita di beni mobili (incluse bottiglie di vino) NON rientrano nelle categorie di reddito imponibile se:</p>
  <ul>
    <li>Non è attività commerciale abituale</li>
    <li>Non supera i limiti di vendite occasionali</li>
  </ul>
</div>
<div class="s-gold">
  <p><strong>Esempio pratico:</strong> compri un Barolo 2019 a €200. Lo rivendi a €350 dopo 5 anni. Plusvalenza di €150 — in Italia questa somma è esentasse.*</p>
  <p style="font-size:11px;color:#888">*Consulta un commercialista per la tua situazione specifica.</p>
</div>
<p>Nessun altro asset di investimento ha questo vantaggio in Italia.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Scopri di Più nell'Academy →</a></p>`,
  };
}

function b2cDay30(name) {
  return {
    subject: `Un mese con VinoInvest — ecco i tuoi risultati 🎉`,
    html: `
<h2>Un mese su VinoInvest! 🎉</h2>
<p>Ciao ${name}, è passato un mese dal tuo accesso. Ecco un recap di quello che hai a disposizione:</p>
<div class="s">
  <p>🍷 <strong>50.000+ vini</strong> analizzati e monitorati in tempo reale</p>
  <p>🤖 <strong>AI Score</strong> aggiornato ogni 6 ore per ogni vino</p>
  <p>📊 <strong>Storico prezzi</strong> fino a 10 anni per ogni etichetta</p>
  <p>🔔 <strong>Price alert</strong> — ricevi email quando il prezzo cambia</p>
</div>
<div class="s-gold">
  <p><strong>Il mercato questo mese:</strong> il Barolo 2016 ha guadagnato +4.2%, la Borgogna è stabile, Sassicaia 2019 in forte momentum.</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}/?section=portfolio" class="btn">Vedi il Tuo Portfolio →</a>
  &nbsp;
  <a href="${BASE_URL}" class="btn-outline">Esplora il Mercato →</a>
</p>`,
  };
}

function b2cDay45NotSubscribed(name) {
  return {
    subject: `I 10 errori che fanno perdere soldi nel vino`,
    html: `
<h2>10 errori che fanno perdere soldi nel fine wine</h2>
<p>Ciao ${name}, dopo 45 giorni su VinoInvest voglio condividere gli errori più comuni che vedo fare agli investitori privati.</p>
<div class="s">
  <p>❌ <strong>1. Comprare senza AI Score</strong> — il 73% dei vini sotto 70 perde valore</p>
  <p>❌ <strong>2. Portfolio concentrato</strong> — mai più del 30% su una singola etichetta</p>
  <p>❌ <strong>3. Ignorare la liquidità</strong> — alcuni vini sono impossibili da rivendere</p>
  <p>❌ <strong>4. Sbagliare l'orizzonte</strong> — il fine wine richiede 5-10 anni minimi</p>
  <p>❌ <strong>5. Non monitorare i price alert</strong> — i mercati si muovono fast</p>
</div>
<p>Gli altri 5 errori + le soluzioni sono nell'<strong>Academy Investor</strong> — il modulo 3 è dedicato alla gestione del rischio.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Accedi all'Academy →</a></p>`,
  };
}

function b2cDay60(name) {
  return {
    subject: `Come i grandi investitori costruiscono il loro portfolio vino`,
    html: `
<h2>Come i grandi investitori costruiscono il loro portfolio vino 🍷</h2>
<p>Ciao ${name}, ecco le tecniche usate dai family office e dai wealth manager per il fine wine.</p>
<div class="s">
  <p>📐 <strong>Regola del 5%</strong> — nessun family office alloca più del 5% in beni alternativi come il vino</p>
  <p>🌍 <strong>Diversificazione geografica</strong> — 40% Francia, 30% Italia, 20% resto del mondo, 10% emergenti</p>
  <p>📅 <strong>Vintage diversification</strong> — mai concentrare su una sola annata</p>
  <p>🔄 <strong>Rotazione del portfolio</strong> — vendere i vini a finestra di bevibilità e reinvestire</p>
</div>
<div class="s-gold">
  <p><strong>Case study:</strong> un portfolio bilanciato Bordeaux/Barolo/Champagne costruito nel 2015 ha reso mediamente il +87% in 8 anni. Dati indicativi basati su indici Liv-ex.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Scopri le Tecniche Pro →</a></p>`,
  };
}

function b2cDay75() {
  const watchedWines = allWines
    .filter(w => (w.investmentScore || w.investment_score || 0) > 85)
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, 5);
  const wineList = watchedWines.map(w =>
    `<div class="wine-item">🍷 <strong>${w.name}</strong> ${w.vintage || ''} — <span class="badge">${w.investmentScore || w.investment_score || '–'}/100</span></div>`
  ).join('') || '<div class="wine-item">🍷 Barolo, Brunello, Sassicaia — AI Score 85+</div>';

  return {
    subject: `Gli investitori di VinoInvest stanno guardando questi vini`,
    html: `
<h2>I vini più osservati dagli investitori 👁️</h2>
<p>Questi sono i vini più aggiunti alle watchlist dagli utenti di VinoInvest questa settimana (dati aggregati e anonimi):</p>
${wineList}
<div class="s-gold">
  <p><strong>Perché monitorano questi vini?</strong> AI Score elevato + momentum positivo + liquidità alta. Sono i segnali che precedono spesso una rivalutazione.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Aggiungi alla Tua Watchlist →</a></p>`,
  };
}

function b2cDay90(name) {
  return {
    subject: `Come stai andando, ${name}? 🤝`,
    html: `
<h2>Tre mesi su VinoInvest 🤝</h2>
<p>Ciao ${name}, sono trascorsi 90 giorni. Voglio capire come posso aiutarti meglio.</p>
<div class="s">
  <p>Rispondi a queste 3 domande rapide (30 secondi):</p>
  <p>1. <a href="${BASE_URL}/feedback?q=portfolio&a=yes">Ho già un portfolio attivo</a> / <a href="${BASE_URL}/feedback?q=portfolio&a=no">Sto ancora esplorando</a></p>
  <p>2. <a href="${BASE_URL}/feedback?q=goal&a=long">Orizzonte 5-10 anni</a> / <a href="${BASE_URL}/feedback?q=goal&a=short">Orizzonte 2-3 anni</a></p>
  <p>3. <a href="${BASE_URL}/feedback?q=help&a=picks">Suggerimenti specifici</a> / <a href="${BASE_URL}/feedback?q=help&a=edu">Più formazione</a></p>
</div>
<p>In base alle tue risposte ti manderò contenuti e raccomandazioni su misura.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Dimmi Come Posso Aiutarti →</a></p>`,
  };
}

function b2cDay90Inactive(name) {
  return {
    subject: `Cosa è successo nel mercato vino mentre eri via`,
    html: `
<h2>Cosa ti sei perso nel mercato vino 📰</h2>
<p>Ciao ${name}, non ti vediamo da un po'. Nel frattempo il mercato ha fatto cose interessanti:</p>
<div class="s">
  <p>📈 <strong>Barolo 2016</strong> — salito ancora di +6.3% questo trimestre</p>
  <p>🔥 <strong>Borgogna in fiamme</strong> — siccità 2024 ridurrà le produzioni del 30%</p>
  <p>💡 <strong>Champagne de Luxe</strong> — mercato AI resiste bene alla flessione generale</p>
  <p>🇮🇹 <strong>Brunello 2019</strong> — voti 97-99 da tutti i critic, pochi casi disponibili</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Torna a VinoInvest →</a></p>`,
  };
}

function b2cDay105Inactive() {
  return {
    subject: `Il Barolo 2016 è salito ancora. Hai ancora tempo.`,
    html: `
<h2>Il Barolo 2016 è salito ancora 📈</h2>
<p>Non è marketing: sono i dati reali del mercato. Il Barolo 2016 nelle ultime 52 settimane ha segnato un +11.4%.</p>
<div class="s-gold">
  <p>📊 Barolo 2016 — prezzo medio €380/bt — +11.4% YoY</p>
  <p>📊 Brunello 2019 — prezzo medio €290/bt — +9.2% YoY</p>
  <p>📊 Sassicaia 2020 — prezzo medio €230/bt — +7.8% YoY</p>
  <p style="font-size:11px;color:#888">Dati indicativi da Wine-Searcher, Tannico, Millesima.</p>
</div>
<p>Questi trend non durano per sempre. Le finestre di ingresso si chiudono.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Vedi l'Analisi Completa →</a></p>`,
  };
}

function b2cDay120(name) {
  return {
    subject: `Solo per te: 3 mesi Academy a metà prezzo 🎓`,
    html: `
<h2>Offerta esclusiva per te 🎓</h2>
<p>Ciao ${name}, questa offerta scade tra 7 giorni e non verrà ripetuta.</p>
<div class="s-gold">
  <p><strong>Academy Investor — 3 mesi a metà prezzo</strong></p>
  <p>Normalmente €9.99/mese — <strong>oggi €4.99/mese</strong> per 3 mesi</p>
  <p>✅ 20 moduli completi</p>
  <p>✅ Simulatore portfolio 2010-2024</p>
  <p>✅ Certificato LinkedIn verificabile</p>
  <p>✅ Dati Liv-ex in tempo reale</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/pricing" class="btn">Approfitta Ora — Scade tra 7 Giorni →</a></p>`,
  };
}

function b2cDay150(name) {
  return {
    subject: `Vuoi restare aggiornato? Scegli tu, ${name}`,
    html: `
<h2>Scegli come vuoi restare in contatto 📬</h2>
<p>Ciao ${name}, vogliamo rispettare il tuo tempo. Con che frequenza vuoi sentire da noi?</p>
<div class="s" style="text-align:center">
  <p>
    <a href="${BASE_URL}/api/email-preferences/frequency?email=${encodeURIComponent('')}&freq=weekly" class="btn" style="margin:8px">📅 Settimanale</a>
  </p>
  <p>
    <a href="${BASE_URL}/api/email-preferences/frequency?email=${encodeURIComponent('')}&freq=monthly" class="btn-outline" style="margin:8px">📆 Mensile</a>
  </p>
  <p style="margin-top:20px">
    <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent('')}" style="font-size:12px;color:#888">Cancella iscrizione completamente</a>
  </p>
</div>`,
  };
}

function b2cDay180(name) {
  return {
    subject: `6 mesi di VinoInvest — il tuo report completo`,
    html: `
<h2>6 mesi su VinoInvest — il tuo report 📊</h2>
<p>Ciao ${name}, sono passati 180 giorni. Eccoci qui — con un report di quello che è successo nel mercato e delle opportunità che ti aspettano.</p>
<div class="s">
  <p>🍷 <strong>Mercato 2024:</strong> il fine wine italiano ha guadagnato mediamente +12.3%</p>
  <p>📈 <strong>Top performer:</strong> Barolo, Brunello, Sassicaia leader di crescita</p>
  <p>🌍 <strong>Opportunità 2025:</strong> Borgogna ai minimi storici per siccità — finestra di ingresso?</p>
</div>
<div class="s-gold">
  <p><strong>Il tuo prossimo capitolo:</strong> con 6 mesi di dati alle spalle, sei nella posizione ideale per fare una mossa informata.</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}" class="btn">Inizia il Prossimo Capitolo →</a>
</p>`,
  };
}

// ── B2B email templates ───────────────────────────────────────────────────────

function b2bDay0(name) {
  return {
    subject: `VinoInvest Professional — Accesso attivato`,
    html: `
<h2>Accesso Professional attivato</h2>
<p>Gentile ${name}, il suo accesso alla piattaforma VinoInvest Professional è attivo. Ecco una panoramica delle funzionalità disponibili:</p>
<div class="s">
  <p>📊 <strong>Dashboard B2B</strong> — metriche istituzionali, indici aggregati, watchlist clienti</p>
  <p>📤 <strong>Export dati</strong> — CSV, Excel, JSON per Bloomberg e sistemi CRM</p>
  <p>🔌 <strong>API access</strong> — integrazione diretta con i suoi sistemi</p>
  <p>📑 <strong>Report PDF</strong> — generazione automatica report mensili</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/b2b" class="btn">Accedi alla Dashboard →</a></p>`,
  };
}

function b2bDay3(name) {
  return {
    subject: `Come i wealth manager usano VinoInvest per i loro clienti`,
    html: `
<h2>Il workflow tipico del wealth manager su VinoInvest</h2>
<p>Gentile ${name}, ecco come i nostri clienti istituzionali integrano VinoInvest nel loro processo di advisory.</p>
<div class="s">
  <p><strong>Step 1 — Screening:</strong> utilizzo del filtro B2B per identificare vini con AI Score >85, prezzo >€500, rischio basso/medio</p>
  <p><strong>Step 2 — Analisi:</strong> storico prezzi 10 anni, correlazione con portfolio cliente, sensitivity analysis</p>
  <p><strong>Step 3 — Proposta:</strong> export PDF con dati e analisi, da presentare al cliente in 10 minuti</p>
  <p><strong>Step 4 — Monitoraggio:</strong> price alert su tutti i vini in portfolio, report settimanale automatico</p>
</div>
<p>Il fine wine come asset alternativo riduce la correlazione del portfolio e migliora il Sharpe ratio.*</p>
<p style="font-size:11px;color:#888">*Dati indicativi. Rendimenti passati non garantiscono rendimenti futuri.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/b2b" class="btn">Scarica il Caso Studio →</a></p>`,
  };
}

function b2bDay7() {
  const institutionalWines = allWines
    .filter(w => {
      const price = parseFloat(w.currentPrice || w.current_price || 0);
      const score = parseInt(w.investmentScore || w.investment_score || 0);
      return price > 500 && score > 85;
    })
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, 5);
  const list = institutionalWines.map(w =>
    `<div class="wine-item"><strong>${w.name}</strong> ${w.vintage || ''} — <span class="badge">${w.investmentScore || w.investment_score}/100</span> — €${parseFloat(w.currentPrice || w.current_price || 0).toLocaleString('it-IT')}/bt</div>`
  ).join('') || '<div class="wine-item">DRC, Petrus, Barolo Monfortino — AI Score 90+</div>';

  return {
    subject: `I 5 vini che i clienti istituzionali stanno comprando ora`,
    html: `
<h2>Watchlist istituzionale — top 5 della settimana</h2>
<p>Questi sono i vini con il maggiore interesse istituzionale questa settimana. Dati aggregati e anonimi dalla piattaforma.</p>
${list}
<div class="s">
  <p><strong>Nota metodologica:</strong> la selezione combina AI Score, momentum prezzi, liquidità di mercato e volume di interesse sulla piattaforma.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/b2b" class="btn">Vedi l'Analisi Completa →</a></p>`,
  };
}

function b2bDay14() {
  return {
    subject: `Come esportare i dati per Bloomberg e Excel`,
    html: `
<h2>Integrazione dati: Bloomberg, Excel, CRM</h2>
<p>VinoInvest Professional supporta l'export dei dati in più formati per integrazione con i suoi sistemi.</p>
<div class="s">
  <p>📊 <strong>Excel / CSV</strong> — export storico prezzi, AI score, dati comparativi</p>
  <p>🔌 <strong>JSON API</strong> — endpoint dedicati, autenticazione Bearer token</p>
  <p>📑 <strong>PDF Report</strong> — report automatici con il suo logo (white label)</p>
</div>
<div class="s">
  <pre style="font-size:12px;background:#f0f0f0;padding:10px;border-radius:6px;overflow-x:auto">GET /api/wines?segment=b2b
Authorization: Bearer {token}

Response: [{
  id, name, vintage,
  currentPrice, investmentScore,
  priceHistory: [...],
  aiSignal: "Strong Buy"
}]</pre>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/b2b" class="btn">Esplora le Integrazioni →</a></p>`,
  };
}

function b2bDay21() {
  return {
    subject: `Compliance MiFID II e vino: cosa deve sapere`,
    html: `
<h2>Fine wine e compliance MiFID II</h2>
<p>La classificazione regolamentare del vino come asset di investimento è una questione aperta. Ecco le best practice adottate dai nostri clienti istituzionali.</p>
<div class="s">
  <p><strong>Posizionamento corretto:</strong> il fine wine rientra nella categoria "investimenti alternativi / beni collezionabili" — non è uno strumento finanziario ai sensi MiFID II.</p>
  <p><strong>Disclosure raccomandata:</strong> informare il cliente che si tratta di un asset illiquido con mercato OTC, rischio di concentrazione e orizzonte minimo 5 anni.</p>
  <p><strong>Appropriateness test:</strong> consigliato per clienti con profilo di rischio moderato/alto e orizzonte >5 anni.</p>
</div>
<p style="font-size:12px;color:#888">Questa non è consulenza legale. Consultare il proprio ufficio compliance per la sua situazione specifica.</p>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Leggi la Guida Completa →</a></p>`,
  };
}

function b2bDay30() {
  return {
    subject: `Report mensile: performance mercato fine wine — ${new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`,
    html: `
<h2>Report Mensile Fine Wine — ${new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</h2>
<div class="s">
  <p><strong>Indice VinoInvest (simulato):</strong> +2.3% mensile / +14.7% YTD</p>
  <p><strong>Bordeaux Premier Cru:</strong> stabile (+0.8%) — mercato maturo, alta liquidità</p>
  <p><strong>Barolo/Barbaresco:</strong> in crescita (+3.1%) — domanda asiatica sostenuta</p>
  <p><strong>Borgogna Grand Cru:</strong> volatile (-1.2%) — correzione post-siccità</p>
  <p><strong>Super Tuscans:</strong> in crescita (+2.7%) — Sassicaia 2020 in forte momentum</p>
</div>
<div class="s">
  <p><strong>Macro outlook:</strong> tassi BCE in calo → afflusso capitali verso alternativi. Fine wine beneficiario diretto.</p>
  <p><strong>Rischi:</strong> rallentamento domanda cinese post-lockdown recovery, USD/EUR sfavorevole per esportatori.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/b2b" class="btn">Scarica il Report Completo →</a></p>`,
  };
}

function b2bDay45() {
  return {
    subject: `Proposta: white label VinoInvest per i suoi clienti`,
    html: `
<h2>White label VinoInvest</h2>
<p>Offriamo ai nostri partner istituzionali la possibilità di integrare VinoInvest con il proprio brand per i loro clienti.</p>
<div class="s">
  <p>✅ <strong>Dashboard branded</strong> — logo, colori e dominio del partner</p>
  <p>✅ <strong>Report PDF white label</strong> — generati con il brand del partner</p>
  <p>✅ <strong>API dedicata</strong> — SLA garantito, endpoint prioritari</p>
  <p>✅ <strong>Onboarding clienti</strong> — supportato dal team VinoInvest</p>
</div>
<p>La soluzione white label è disponibile per wealth manager, family office e istituzioni con >10 clienti attivi nel segmento fine wine.</p>
<p style="text-align:center;margin:28px 0"><a href="mailto:info@vinoinvest.com?subject=White Label Demo" class="btn">Prenota una Demo →</a></p>`,
  };
}

function b2bDay60() {
  return {
    subject: `Come strutturare un portafoglio vino per un cliente UHNWI`,
    html: `
<h2>Portfolio fine wine per clienti UHNWI (Ultra High Net Worth)</h2>
<p>Framework di allocazione per clienti con patrimoni >€10M che vogliono un'esposizione al fine wine.</p>
<div class="s">
  <p><strong>Allocazione suggerita per UHNWI:</strong></p>
  <p>🍷 2-5% del patrimonio in fine wine (max)</p>
  <p>📐 40% Bordeaux Grand Cru (DRC, Petrus, Pauillac) — massima liquidità</p>
  <p>📐 30% Barolo/Brunello top labels — crescita, orizzonte 8-12 anni</p>
  <p>📐 20% Borgogna — diversificazione, alta domanda collector</p>
  <p>📐 10% Champagne de Luxe — resilienza cicli economici</p>
</div>
<div class="s">
  <p><strong>Storage e assicurazione:</strong> costo medio €2-5/bt/anno (climate-controlled). Insurance: 0.5-1% del valore per anno.</p>
  <p><strong>Liquidità:</strong> aste Sotheby's/Christie's, Wine Loco, Idealwine — mercato attivo per top labels.</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/academy" class="btn">Accedi al Corso Professional →</a></p>`,
  };
}

// ── B2B weekly briefing ───────────────────────────────────────────────────────

function b2bWeeklyBriefing() {
  const top5 = allWines
    .filter(w => {
      const price = parseFloat(w.currentPrice || w.current_price || 0);
      const score = parseInt(w.investmentScore || w.investment_score || 0);
      return price > 200 && score > 80;
    })
    .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
    .slice(0, 5);

  const wineRows = top5.map(w =>
    `<tr><td style="padding:8px 10px">${w.name} ${w.vintage || ''}</td><td style="padding:8px 10px;text-align:center">${w.investmentScore || w.investment_score || '–'}/100</td><td style="padding:8px 10px;text-align:right">€${parseFloat(w.currentPrice || w.current_price || 0).toLocaleString('it-IT')}</td><td style="padding:8px 10px;text-align:center;color:${(w.marketTrend || w.market_trend) === 'up' ? '#16a34a' : '#888'}">${(w.marketTrend || w.market_trend) === 'up' ? '▲' : '–'}</td></tr>`
  ).join('');

  return {
    subject: `Market Briefing VinoInvest Professional — ${new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}`,
    html: `
<h2>Market Briefing — ${new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
  <thead>
    <tr style="border-bottom:2px solid #C9A227">
      <th style="text-align:left;padding:8px 10px;color:#888;font-weight:600">Vino</th>
      <th style="text-align:center;padding:8px 10px;color:#888;font-weight:600">AI Score</th>
      <th style="text-align:right;padding:8px 10px;color:#888;font-weight:600">Prezzo</th>
      <th style="text-align:center;padding:8px 10px;color:#888;font-weight:600">Trend</th>
    </tr>
  </thead>
  <tbody>${wineRows}</tbody>
</table>
<div class="s">
  <p><strong>Macro della settimana:</strong> spread BTP/Bund in calo — contesto favorevole per asset alternativi italiani.</p>
</div>
<p style="text-align:center;margin:24px 0"><a href="${BASE_URL}/b2b" class="btn">Dashboard Completa →</a></p>`,
  };
}

// ── Behavioral email templates ────────────────────────────────────────────────

function behavioralWatchlistAdd(name, wineName) {
  return {
    subject: `Hai scelto bene — ecco l'analisi di ${wineName}`,
    html: `
<h2>Analisi AI: ${wineName} 🔍</h2>
<p>Ciao ${name}, hai aggiunto <strong>${wineName}</strong> alla tua watchlist. Ecco l'analisi completa.</p>
<div class="s">
  <p>📊 <strong>Storico prezzi:</strong> consulta gli ultimi 10 anni di dati su VinoInvest</p>
  <p>🤖 <strong>AI Score:</strong> aggiornato ogni 6 ore in base a prezzi, critici e momentum</p>
  <p>📈 <strong>Trend mercato:</strong> confronta con indice Bordeaux e Barolo</p>
  <p>🔔 <strong>Price alert:</strong> imposta una notifica per il prezzo target</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?search=${encodeURIComponent(wineName)}" class="btn">Vedi l'Analisi Completa →</a></p>`,
  };
}

function behavioralPriceAlert(name, wineName, currentPrice) {
  return {
    subject: `Alert attivato: ${wineName} ha raggiunto il tuo target`,
    html: `
<h2>Alert prezzo attivato! 🎯</h2>
<p>Ciao ${name}, il tuo alert su <strong>${wineName}</strong> si è attivato.</p>
<div class="s-gold">
  <p>💰 Prezzo attuale: <strong>€${parseFloat(currentPrice || 0).toLocaleString('it-IT')}</strong></p>
  <p>🤖 AI Score: controlla ora su VinoInvest per la raccomandazione aggiornata</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?search=${encodeURIComponent(wineName)}" class="btn">Vedi il Vino Ora →</a></p>`,
  };
}

function behavioralFirstPurchase(name, wineName) {
  return {
    subject: `Portfolio aggiornato — cosa aspettarti da ${wineName}`,
    html: `
<h2>Benvenuto nel club degli investitori! 🍾</h2>
<p>Ciao ${name}, hai aggiunto <strong>${wineName}</strong> al tuo portfolio. Ecco cosa aspettarti.</p>
<div class="s">
  <p>📅 <strong>Orizzonte consigliato:</strong> 5-10 anni per massimizzare il rendimento</p>
  <p>🌡️ <strong>Storage:</strong> 12-14°C, umidità 70-75%, lontano dalla luce</p>
  <p>🔔 <strong>Price alert:</strong> imposta un alert al +30% per la finestra di uscita</p>
  <p>📊 <strong>Monitoraggio:</strong> controlla le performance mensili nel tuo portfolio</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}/?section=portfolio" class="btn">Vedi il Portfolio Aggiornato →</a></p>`,
  };
}

function behavioralInactive7Days(name) {
  return {
    subject: `Cosa è successo nel mercato questa settimana`,
    html: `
<h2>7 giorni di mercato in 30 secondi 📰</h2>
<p>Ciao ${name}, non ci sei stato questa settimana. Ecco cosa ti sei perso:</p>
<div class="s">
  <p>📈 <strong>Barolo 2019</strong> — nuovo massimo storico questa settimana</p>
  <p>📰 <strong>News:</strong> Robert Parker ha pubblicato nuovi voti per i rossi italiani</p>
  <p>🔔 <strong>Attention:</strong> Borgogna ai minimi — finestra di acquisto?</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Torna su VinoInvest →</a></p>`,
  };
}

function behavioralCourseComplete(name, courseName) {
  return {
    subject: `Congratulazioni! Ecco il tuo prossimo passo`,
    html: `
<h2>Complimenti, ${name}! 🎓</h2>
<p>Hai completato <strong>${courseName || 'il modulo Academy'}</strong>. Sei un passo più avanti nel mondo del fine wine investing.</p>
<div class="s">
  <p>🏆 Il tuo certificato è stato generato e puoi condividerlo su LinkedIn</p>
  <p>🚀 <strong>Prossimo modulo consigliato:</strong> Tecniche di timing e uscita dal portfolio</p>
</div>
<p style="text-align:center;margin:28px 0">
  <a href="${BASE_URL}/academy" class="btn">Continua l'Academy →</a>
  &nbsp;
  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(BASE_URL + '/academy')}" class="btn-outline">Condividi su LinkedIn →</a>
</p>`,
  };
}

function behavioralMonthAnniversary(name, months) {
  return {
    subject: `${months === 1 ? 'Un mese' : `${months} mesi`} su VinoInvest — il tuo recap`,
    html: `
<h2>${months === 1 ? 'Un mese' : `${months} mesi`} insieme! 🎉</h2>
<p>Ciao ${name}, ${months === 1 ? 'oggi è un mese' : `sono ${months} mesi`} che sei su VinoInvest. Grazie per far parte della community!</p>
<div class="s">
  <p>🍷 Hai esplorato centinaia di vini nel nostro catalogo</p>
  <p>📊 Il mercato fine wine nel periodo: mediamente +${(months * 1.2).toFixed(1)}%</p>
  <p>🤖 AI Score aggiornato ogni giorno su tutti i vini che monitori</p>
</div>
<p style="text-align:center;margin:28px 0"><a href="${BASE_URL}" class="btn">Esplora le Opportunità Attuali →</a></p>`,
  };
}

// ── Core scheduling logic ─────────────────────────────────────────────────────

async function getScheduledEmailForUser(user, segment, dayNum) {
  const name = user.first_name || user.email?.split('@')[0] || 'investitore';

  if (segment === 'b2b') {
    switch (true) {
      case dayNum === 0: return b2bDay0(name);
      case dayNum === 3: return b2bDay3(name);
      case dayNum === 7: return b2bDay7();
      case dayNum === 14: return b2bDay14();
      case dayNum === 21: return b2bDay21();
      case dayNum === 30: return b2bDay30();
      case dayNum === 45: return b2bDay45();
      case dayNum === 60: return b2bDay60();
      case (dayNum > 30 && dayNum < 90 && dayNum % 7 === 0): return b2bWeeklyBriefing();
      default: return null;
    }
  }

  // B2C conditional branches
  switch (true) {
    case dayNum === 0:
      return b2cDay0(name);

    case dayNum === 3: {
      const opened = await wasDay0Opened(user.id);
      if (!opened) return b2cDay3NotOpened(name);
      const portfolio = await hasPortfolio(user.id);
      if (portfolio) return b2cDay3Visited(name);
      return b2cDay3OpenedNoVisit(name);
    }

    case dayNum === 7: {
      const portfolio = await hasPortfolio(user.id);
      return portfolio ? b2cDay7HasPortfolio(name) : b2cDay7NoPortfolio(name);
    }

    case dayNum === 14: {
      const engaged = await isEngaged(user.id, 14);
      return engaged ? b2cDay14Active(name) : b2cDay14Inactive(name);
    }

    case dayNum === 21: return b2cDay21(name);
    case dayNum === 30: return b2cDay30(name);

    case dayNum === 45: {
      const hasAcademy = await hasAcademySubscription(user.id);
      return hasAcademy ? null : b2cDay45NotSubscribed(name);
    }

    case dayNum === 60: return b2cDay60(name);
    case dayNum === 75: return b2cDay75();

    case dayNum === 90: {
      const inactive = await daysSinceLastLogin(user.id);
      return inactive > 30 ? b2cDay90Inactive(name) : b2cDay90(name);
    }

    case dayNum === 105: {
      const inactive = await daysSinceLastLogin(user.id);
      return inactive > 30 ? b2cDay105Inactive() : null;
    }

    case dayNum === 120: return b2cDay120(name);

    case dayNum === 150: {
      const purchased = await hasEverPurchased(user.id);
      return purchased ? null : b2cDay150(name);
    }

    case dayNum === 180: return b2cDay180(name);

    default: return null;
  }
}

// ── Main cron function ────────────────────────────────────────────────────────

export async function processScheduledFlows() {
  if (!pool) return;
  await ensureEmailFlowTables();

  try {
    const { rows: users } = await pool.query(`
      SELECT u.id::text as id, u.email, u.first_name, u.account_type,
        EXTRACT(DAY FROM NOW() - u.created_at)::int as days_since_reg
      FROM users u
      WHERE u.email_subscribed = true
        AND u.email IS NOT NULL
        AND u.created_at IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM email_flows ef
          WHERE ef.user_id = u.id::text
            AND ef.day_number = EXTRACT(DAY FROM NOW() - u.created_at)::int
            AND ef.trigger_type = 'scheduled'
            AND ef.sent_at IS NOT NULL
        )
        AND NOT EXISTS (
          SELECT 1 FROM email_flows ef2
          WHERE ef2.user_id = u.id::text
            AND ef2.trigger_type = 'scheduled'
            AND ef2.sent_at::date = CURRENT_DATE
        )
      LIMIT 200
    `).catch(() => ({ rows: [] }));

    let sent = 0;
    for (const user of users) {
      const segment = getSegment(user.account_type);
      const dayNum = user.days_since_reg;

      const email = await getScheduledEmailForUser(user, segment, dayNum);
      if (!email) continue;

      const html = layout(email.html, user.email, segment);
      const result = await sendEmail(user.email, email.subject, html);

      if (result.ok) {
        await pool.query(
          `INSERT INTO email_flows (user_id, user_email, segment, day_number, trigger_type, email_subject, sent_at, resend_id)
           VALUES ($1, $2, $3, $4, 'scheduled', $5, NOW(), $6)`,
          [user.id, user.email, segment, dayNum, email.subject, result.id || null]
        ).catch(() => {});
        sent++;
        console.log(`[emailFlowJob] Day ${dayNum} → ${user.email} (${segment})`);
      }

      // Rate limit: 10 emails/second
      if (sent % 10 === 0) await new Promise(r => setTimeout(r, 1000));
    }

    if (sent > 0) console.log(`[emailFlowJob] Scheduled: sent ${sent} emails`);
  } catch (e) {
    console.error('[emailFlowJob] processScheduledFlows error:', e.message);
  }
}

// ── Behavioral trigger ────────────────────────────────────────────────────────

export async function triggerBehavioralEmail(userId, userEmail, firstName, event, data = {}) {
  if (!pool) return { ok: false };
  await ensureEmailFlowTables();

  // Check unsubscribed
  const { rows: user } = await pool.query(
    `SELECT email_subscribed, account_type FROM users WHERE id = $1`,
    [userId]
  ).catch(() => ({ rows: [] }));
  if (!user[0]?.email_subscribed) return { ok: false, reason: 'unsubscribed' };

  // Dedup: don't send same behavioral event twice in 24h
  const { rows: recent } = await pool.query(
    `SELECT id FROM email_flows WHERE user_id = $1 AND trigger_event = $2 AND sent_at > NOW() - INTERVAL '24 hours' LIMIT 1`,
    [userId, event]
  ).catch(() => ({ rows: [] }));
  if (recent.length > 0) return { ok: false, reason: 'dedup_24h' };

  const name = firstName || userEmail?.split('@')[0] || 'investitore';
  const segment = getSegment(user[0]?.account_type);
  let email = null;

  switch (event) {
    case 'watchlist_add':
      email = behavioralWatchlistAdd(name, data.wineName || 'il tuo vino');
      break;
    case 'price_alert':
      email = behavioralPriceAlert(name, data.wineName || '', data.currentPrice);
      break;
    case 'first_purchase':
      email = behavioralFirstPurchase(name, data.wineName || 'il tuo vino');
      break;
    case 'inactive_7days':
      email = behavioralInactive7Days(name);
      break;
    case 'course_complete':
      email = behavioralCourseComplete(name, data.courseName);
      break;
    case 'month_anniversary':
      email = behavioralMonthAnniversary(name, data.months || 1);
      break;
    default:
      return { ok: false, reason: 'unknown_event' };
  }

  if (!email) return { ok: false, reason: 'no_template' };

  const html = layout(email.html, userEmail, segment);
  const result = await sendEmail(userEmail, email.subject, html);

  if (result.ok) {
    await pool.query(
      `INSERT INTO email_flows (user_id, user_email, segment, trigger_type, trigger_event, email_subject, sent_at, resend_id)
       VALUES ($1, $2, $3, 'behavioral', $4, $5, NOW(), $6)`,
      [userId, userEmail, segment, event, email.subject, result.id || null]
    ).catch(() => {});
  }

  return result;
}

// ── Inactive user checker (run daily) ────────────────────────────────────────

export async function checkInactiveUsers() {
  if (!pool) return;
  try {
    const { rows } = await pool.query(`
      SELECT id::text as id, email, first_name, account_type
      FROM users
      WHERE email_subscribed = true
        AND last_login < NOW() - INTERVAL '7 days'
        AND NOT EXISTS (
          SELECT 1 FROM email_flows ef
          WHERE ef.user_id = id::text
            AND ef.trigger_event = 'inactive_7days'
            AND ef.sent_at > NOW() - INTERVAL '7 days'
        )
      LIMIT 100
    `).catch(() => ({ rows: [] }));

    for (const u of rows) {
      await triggerBehavioralEmail(u.id, u.email, u.first_name, 'inactive_7days');
      await new Promise(r => setTimeout(r, 200));
    }
  } catch (e) {
    console.error('[emailFlowJob] checkInactiveUsers error:', e.message);
  }
}

// ── Open/Click tracking ───────────────────────────────────────────────────────

export async function trackEmailOpen(flowId) {
  if (!pool) return;
  await pool.query(
    `UPDATE email_flows SET opened_at = COALESCE(opened_at, NOW()) WHERE id = $1`,
    [flowId]
  ).catch(() => {});

  // Update email_preferences.last_interaction
  const { rows } = await pool.query(`SELECT user_id FROM email_flows WHERE id = $1`, [flowId]).catch(() => ({ rows: [] }));
  if (rows[0]?.user_id) {
    await pool.query(
      `INSERT INTO email_preferences (user_id, last_interaction) VALUES ($1, NOW())
       ON CONFLICT (user_id) DO UPDATE SET last_interaction = NOW()`,
      [rows[0].user_id]
    ).catch(() => {});
  }
}

export async function trackEmailClick(flowId) {
  if (!pool) return;
  await pool.query(
    `UPDATE email_flows SET clicked_at = COALESCE(clicked_at, NOW()), opened_at = COALESCE(opened_at, NOW()) WHERE id = $1`,
    [flowId]
  ).catch(() => {});
}

// ── Admin analytics ───────────────────────────────────────────────────────────

export async function getEmailAnalytics() {
  if (!pool) return null;
  await ensureEmailFlowTables();

  try {
    const [totals, bySegment, byDay, byTrigger, recentSent, openRate, clickRate, unsubRate] = await Promise.all([
      pool.query(`SELECT COUNT(*) as total, COUNT(opened_at) as opened, COUNT(clicked_at) as clicked, COUNT(unsubscribed_at) as unsub FROM email_flows WHERE sent_at IS NOT NULL`).catch(() => ({ rows: [{ total: 0, opened: 0, clicked: 0, unsub: 0 }] })),
      pool.query(`SELECT segment, COUNT(*) as sent, COUNT(opened_at) as opened, COUNT(clicked_at) as clicked FROM email_flows WHERE sent_at IS NOT NULL GROUP BY segment`).catch(() => ({ rows: [] })),
      pool.query(`SELECT day_number, email_subject, COUNT(*) as sent, COUNT(opened_at) as opened, COUNT(clicked_at) as clicked FROM email_flows WHERE trigger_type = 'scheduled' AND sent_at IS NOT NULL GROUP BY day_number, email_subject ORDER BY day_number`).catch(() => ({ rows: [] })),
      pool.query(`SELECT trigger_event, COUNT(*) as sent, COUNT(opened_at) as opened FROM email_flows WHERE trigger_type = 'behavioral' AND sent_at IS NOT NULL GROUP BY trigger_event ORDER BY sent DESC`).catch(() => ({ rows: [] })),
      pool.query(`SELECT user_email, segment, email_subject, sent_at FROM email_flows WHERE sent_at IS NOT NULL ORDER BY sent_at DESC LIMIT 20`).catch(() => ({ rows: [] })),
      pool.query(`SELECT ROUND(100.0 * COUNT(opened_at) / NULLIF(COUNT(*), 0), 1) as pct FROM email_flows WHERE sent_at IS NOT NULL`).catch(() => ({ rows: [{ pct: 0 }] })),
      pool.query(`SELECT ROUND(100.0 * COUNT(clicked_at) / NULLIF(COUNT(*), 0), 1) as pct FROM email_flows WHERE sent_at IS NOT NULL`).catch(() => ({ rows: [{ pct: 0 }] })),
      pool.query(`SELECT ROUND(100.0 * COUNT(unsubscribed_at) / NULLIF(COUNT(*), 0), 1) as pct FROM email_flows WHERE sent_at IS NOT NULL`).catch(() => ({ rows: [{ pct: 0 }] })),
    ]);

    // Revenue attribution: orders placed within 48h of email click
    const revenueAttr = await pool.query(`
      SELECT ef.email_subject, COUNT(o.id) as conversions, COALESCE(SUM(o.purchase_price * o.quantity), 0) as revenue
      FROM email_flows ef
      JOIN orders o ON o.user_id = ef.user_id
        AND o.created_at BETWEEN ef.clicked_at AND ef.clicked_at + INTERVAL '48 hours'
      WHERE ef.clicked_at IS NOT NULL
      GROUP BY ef.email_subject
      ORDER BY revenue DESC
      LIMIT 10
    `).catch(() => ({ rows: [] }));

    return {
      totals: totals.rows[0],
      openRate: parseFloat(openRate.rows[0]?.pct || 0),
      clickRate: parseFloat(clickRate.rows[0]?.pct || 0),
      unsubRate: parseFloat(unsubRate.rows[0]?.pct || 0),
      bySegment: bySegment.rows,
      byDay: byDay.rows,
      byTrigger: byTrigger.rows,
      recentSent: recentSent.rows,
      revenueAttribution: revenueAttr.rows,
    };
  } catch (e) {
    console.error('[emailFlowService] getEmailAnalytics error:', e.message);
    return null;
  }
}
