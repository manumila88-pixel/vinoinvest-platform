/**
 * Bulk blog content generator — 100 articles via Claude Haiku
 * Run: node src/scripts/generateBlogContent.js
 *
 * Persona breakdown:
 *  15 IL CURIOSO       — linguaggio semplice, concetti base
 *  20 L'APPASSIONATO   — approfondimento tecnico/storico
 *  15 L'INVESTITORE    — quantitativo, dati, rendimenti
 *  10 IL YOUNG PRO     — veloce, bullet points, visuale
 *  20 WEALTH/FAMILY    — istituzionale, compliance, ROI
 *  10 CANTINA          — B2B cantina, distribuzione, pricing
 *  10 SEO GENERALE     — keyword-rich, top-of-funnel
 */

import Anthropic from "@anthropic-ai/sdk";
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ── DB ──────────────────────────────────────────────────────────────────────

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT,
      slug TEXT UNIQUE,
      excerpt TEXT,
      content TEXT,
      category TEXT,
      author TEXT DEFAULT 'VinoInvest AI',
      read_time TEXT,
      tokens_used INTEGER DEFAULT 0,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      persona VARCHAR(30),
      meta_description TEXT,
      word_count INTEGER DEFAULT 0
    )
  `);

  // Add new columns if table existed without them
  for (const [col, def] of [
    ["persona", "VARCHAR(30)"],
    ["meta_description", "TEXT"],
    ["word_count", "INTEGER DEFAULT 0"],
  ]) {
    await pool.query(
      `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS ${col} ${def}`
    ).catch(() => {});
  }
  console.log("[schema] blog_posts ready with persona/meta_description/word_count");
}

async function slugExists(slug) {
  const r = await pool.query("SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1", [slug]);
  return r.rowCount > 0;
}

async function savePost(post) {
  await pool.query(
    `INSERT INTO blog_posts
       (title, slug, excerpt, content, category, read_time, tokens_used, persona, meta_description, word_count)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (slug) DO UPDATE SET
       title=EXCLUDED.title, content=EXCLUDED.content, meta_description=EXCLUDED.meta_description,
       persona=EXCLUDED.persona, word_count=EXCLUDED.word_count`,
    [
      post.title,
      post.slug,
      post.excerpt,
      post.content,
      post.category || "Analisi",
      post.readTime || "6 min",
      post.tokensUsed || 0,
      post.persona,
      post.metaDescription,
      post.wordCount || 0,
    ]
  );
}

// ── ARTICLE TOPICS ───────────────────────────────────────────────────────────

const TOPICS = {
  curioso: [
    { title: "Cos'è il vino da investimento? Guida per chi inizia da zero", category: "Guida Base" },
    { title: "Perché il vino vale più dell'oro? 5 motivi sorprendenti", category: "Educazione" },
    { title: "Quanto si guadagna investendo in vino? Rendimenti reali 2015-2025", category: "Rendimenti" },
    { title: "Barolo, Bordeaux, Borgogna: le differenze per chi non sa niente di vino", category: "Guida Base" },
    { title: "Come comprare vino da investimento senza sbagliare: 7 regole per principianti", category: "Guida Base" },
    { title: "Il vino batte la borsa? Confronto storico con S&P 500 e oro", category: "Confronto" },
    { title: "Quanto devo spendere per iniziare a investire in vino? Budget minimo reale", category: "Guida Base" },
    { title: "Dove si conserva il vino da investimento? Temperature, umidità, luce", category: "Guida Pratica" },
    { title: "Come si vende il vino da investimento? Guide alle aste e ai merchant", category: "Guida Pratica" },
    { title: "I 10 vini più famosi come investimento e perché valgono così tanto", category: "Top 10" },
    { title: "Pétrus, DRC, Sassicaia: i brand del vino da investimento spiegati facile", category: "Educazione" },
    { title: "Cosa significa 'annata eccezionale'? Come si riconosce un vino da comprare", category: "Educazione" },
    { title: "L'AI Score di VinoInvest: come un algoritmo sceglie i vini migliori per te", category: "Strumenti" },
    { title: "Rischi reali dell'investimento in vino: cosa può andare storto", category: "Rischi" },
    { title: "Primo portfolio vino: come costruirlo con €5.000 step by step", category: "Guida Base" },
  ],

  appassionato: [
    { title: "Barolo 2021 vs 2016 vs 2010: quale annata comprare adesso per massimizzare il ROI", category: "Analisi Annate" },
    { title: "Giacomo Conterno Monfortino: storia, quotazioni 2010-2025 e potenziale di crescita", category: "Producer Spotlight" },
    { title: "La Romanée-Conti: anatomia di un investimento da €20.000 a bottiglia", category: "Producer Spotlight" },
    { title: "Champagne come investimento: Dom Pérignon, Krug, Cristal — rendimenti e liquidità", category: "Champagne" },
    { title: "Supertoscani 2025: Sassicaia, Ornellaia, Masseto — quale punta più in alto", category: "Supertoscani" },
    { title: "Liv-ex Fine Wine 100: come leggere l'indice e usarlo per le tue decisioni", category: "Mercato" },
    { title: "Come il punteggio Robert Parker muove il mercato: analisi storica e implicazioni", category: "Critici" },
    { title: "Borgogna 2022 vs 2019 vs 2015: guida completa all'acquisto per collezionisti", category: "Analisi Annate" },
    { title: "I vini italiani emergenti che batteranno i Grand Cru francesi nel 2030", category: "Emergenti" },
    { title: "Mercato secondario del vino: come funzionano Sotheby's, Christie's e Wineauctioneer", category: "Aste" },
    { title: "En primeur Bordeaux 2024: comprare adesso o aspettare la messa in commercio?", category: "Bordeaux" },
    { title: "Terroir e valore: perché certi vigneti valgono 10 volte gli altri", category: "Approfondimento" },
    { title: "Cult wines americani: Screaming Eagle, Opus One, Harlan — vale la pena investire?", category: "New World" },
    { title: "Il mercato del vino cinese: impatto sulle quotazioni europee 2020-2025", category: "Mercato Globale" },
    { title: "Biodynamic wines: il biologico premia gli investitori? Dati e performance", category: "Trend" },
    { title: "Come leggere una scheda tecnica di vino da investimento: guida completa", category: "Strumenti" },
    { title: "Verticali di vino: cos'è e perché una collezione verticale vale più della somma", category: "Collezione" },
    { title: "Climate change e vino: nuove regioni emergenti dove investire ora", category: "Tendenze" },
    { title: "Cru Classés di Bordeaux 2025: classifica aggiornata e implicazioni per i prezzi", category: "Bordeaux" },
    { title: "Whisky vs Vino: quale batte l'altro come investimento nel 2025?", category: "Confronto" },
  ],

  investitore: [
    { title: "Analisi quantitativa: correlazione vino-equity nei mercati bear 2000-2025", category: "Quantitativo" },
    { title: "Sharpe ratio del vino da investimento: calcolo e confronto con asset class tradizionali", category: "Metriche" },
    { title: "Modello DCF applicato al vino: come prezzare l'upside potenziale di un'annata", category: "Modelli" },
    { title: "Volatilità del mercato fine wine: VaR, CVaR e stress test del tuo portfolio", category: "Rischio" },
    { title: "Backtesting: se avessi investito €100k in Barolo nel 2015, quanto avresti oggi?", category: "Performance" },
    { title: "Diversificazione ottimale del portfolio vino: regioni, annate, stili — analisi Markowitz", category: "Portfolio" },
    { title: "Liquidità nel mercato del vino: spread bid-ask, giorni a liquidare, impatto sul rendimento netto", category: "Liquidità" },
    { title: "Tax-efficient wine investing: strutture fiscali per massimizzare il rendimento netto in Italia", category: "Fiscalità" },
    { title: "Previsione prezzi ML: come l'algoritmo VinoInvest costruisce modelli predittivi", category: "AI" },
    { title: "Inflazione e vino: studio storico su 25 anni di prezzi fine wine vs CPI europeo", category: "Macroeconomia" },
    { title: "Due diligence su un vino da investimento: checklist completa per l'investitore serio", category: "Processo" },
    { title: "Return attribution: quanto pesa l'annata vs il produttore vs la regione nel rendimento?", category: "Analisi" },
    { title: "Confronto fee: merchant, aste, piattaforme digitali — total cost of ownership", category: "Costi" },
    { title: "Allocazione ottimale fine wine in un wealth portfolio da €500k: case study", category: "Case Study" },
    { title: "Momentum e mean-reversion nel mercato Liv-ex: strategie quantitative testate", category: "Strategie" },
  ],

  youngPro: [
    { title: "🍷 3 vini da comprare adesso sotto €200 che valgono il doppio in 5 anni", category: "Quick Tips" },
    { title: "Il metodo 80/20 per investire in vino: massimo rendimento, minimo sforzo", category: "Strategia" },
    { title: "Wine investing in 10 minuti: tutto quello che devi sapere per iniziare oggi", category: "Speed Guide" },
    { title: "Portfolio vino per millennial: 5 bottiglie, €2.000, 3 anni. Funziona?", category: "Case Study" },
    { title: "App, dashboard, alert: strumenti tech per tracciare il tuo portfolio vino come un pro", category: "Tech" },
    { title: "I 5 errori che distruggono il rendimento del portfolio vino (e come evitarli)", category: "Errori" },
    { title: "Side hustle con il vino: come guadagnare €500-2000/anno come wine investor part-time", category: "Side Hustle" },
    { title: "Investire in vino a 25 anni: strategia completa per chi inizia giovane", category: "Giovani" },
    { title: "Vino vs cripto vs ETF: dove metti €5k nel 2025 se hai 30 anni?", category: "Confronto" },
    { title: "Come costruire un portfolio vino da zero con un budget universitario", category: "Budget" },
  ],

  wealth: [
    { title: "Fine wine allocation in UHNW portfolios: optimal weight e rebalancing strategy", category: "Wealth Management" },
    { title: "MiFID II compliance e investimenti in vino: framework per wealth manager", category: "Compliance" },
    { title: "Family office e fine wine: strutture di detenzione, custodia e successione", category: "Family Office" },
    { title: "Reportistica Bloomberg-compatible per portfolio fine wine: export e integrazione", category: "Reporting" },
    { title: "Vino come asset alternativo: presentazione per CIO e investment committee", category: "Istituzionale" },
    { title: "Risk-adjusted returns fine wine 2010-2025: confronto con PE, hedge fund, real estate", category: "Performance" },
    { title: "Auction house due diligence: come valutare Christie's, Sotheby's, Acker per un family office", category: "Aste" },
    { title: "Wine storage a livello istituzionale: bonded warehouse, assicurazione, custodia terza", category: "Operativo" },
    { title: "ESG e fine wine: scoring ambientale e sociale dei produttori per portfolio sostenibili", category: "ESG" },
    { title: "Private banking e vino pregiato: come strutturare la consulenza per clienti HNWI", category: "Private Banking" },
    { title: "Succession planning con fine wine: IHT planning, trust e strutture internazionali", category: "Successione" },
    { title: "Tokenizzazione del vino: opportunità istituzionali e rischi regolatori 2025", category: "Fintech" },
    { title: "Benchmark di performance fine wine per gestori patrimoniali: metodologia e KPI", category: "Benchmark" },
    { title: "Due diligence su fondi fine wine: Cult Wines, WineCap, VinoInvest — confronto strutture", category: "Fondi" },
    { title: "Correlazione fine wine con real estate di lusso: portfolio construction insights", category: "Asset Allocation" },
    { title: "Wine financing: usare il portfolio vino come collaterale per credito", category: "Finanza" },
    { title: "Reporting ESG per investimenti in vino: framework e metrica per gestori istituzionali", category: "ESG" },
    { title: "Gestione del rischio reputazionale nei portfolio wine istituzionali", category: "Risk Management" },
    { title: "Alternative investments allocation 2025: vino vs art vs classic cars per UHNW", category: "Alternative" },
    { title: "Wine investment funds: fee structure, liquidity windows, performance fees — guida completa", category: "Fondi" },
  ],

  cantina: [
    { title: "Come quotare il proprio vino su VinoInvest: guida per le cantine", category: "Cantina Guide" },
    { title: "Pricing strategy per cantine: come costruire una price ladder che massimizza il valore", category: "Pricing" },
    { title: "Direct-to-collector: come le cantine eliminano il distributore e aumentano i margini", category: "DTC" },
    { title: "Export Japan, USA, China: pricing e posizionamento per cantine italiane", category: "Export" },
    { title: "Come costruire un waiting list per i tuoi vini allocati: case study Gaja e altri", category: "Marketing" },
    { title: "Cantina e investitori: come attrarre capital paziente e valorizzare il brand", category: "Investitori" },
    { title: "Data analytics per cantine: come usare i dati di mercato per decisioni di pricing", category: "Analytics" },
    { title: "Piattaforme digitali per vendita vino: confronto marketplace B2B 2025", category: "Digitale" },
    { title: "Wine tourism e investimento: come il turismo aumenta il valore percepito e le quotazioni", category: "Tourism" },
    { title: "Certificazioni DOCG, biologico, biodinamico: impatto reale sul prezzo di mercato", category: "Certificazioni" },
  ],

  seo: [
    { title: "Investire in vino: guida completa 2025 — tutto quello che devi sapere", category: "SEO" },
    { title: "Migliori vini da investimento 2025: top 20 bottiglie con rendimento garantito", category: "SEO" },
    { title: "Vino come investimento: rendimenti, rischi e come iniziare in Italia", category: "SEO" },
    { title: "Wine investment Italy: best wines to buy in 2025 for long-term returns", category: "SEO EN" },
    { title: "Prezzo vino investimento: come si forma il valore e come prevederlo", category: "SEO" },
    { title: "Portfolio vino: costruire un investimento diversificato step by step", category: "SEO" },
    { title: "Vino fine: cos'è, perché vale e come acquistarlo legalmente in Italia", category: "SEO" },
    { title: "Alternative investments 2025: perché il vino supera oro, cripto e obbligazioni", category: "SEO" },
    { title: "Aste vino online: come partecipare, prezzi, garanzie e rischi", category: "SEO" },
    { title: "Tasse sul vino da investimento in Italia: Art. 67 TUIR e guida fiscale 2025", category: "Fiscalità SEO" },
  ],
};

// ── PROMPTS PER PERSONA ───────────────────────────────────────────────────────

function buildPrompt(topic, persona) {
  const personaInstructions = {
    curioso: `Scrivi per IL CURIOSO: persona che sa poco di vino e investimenti. Usa linguaggio semplice, analogie quotidiane, evita termini tecnici senza spiegarli. Tono amichevole e incoraggiante. Aggiungi una CTA finale che invita a esplorare VinoInvest.`,

    appassionato: `Scrivi per L'APPASSIONATO: ama il vino, conosce i produttori, vuole approfondire l'investimento. Usa termini tecnici come 'terroir', 'tanini', 'crianza'. Includi dati storici su prezzi e annate. CTA verso il price history chart su VinoInvest.`,

    investitore: `Scrivi per L'INVESTITORE SERIO: profilo quantitativo, vuole dati e metriche. Usa percentuali, rendimenti annualizzati, correlazioni, rischio/rendimento. Cita fonti come Liv-ex, Wine-Searcher, Robert Parker. CTA verso l'AI Score e portfolio analytics.`,

    youngPro: `Scrivi per IL YOUNG PRO: 25-35 anni, poca pazienza per testi lunghi. Usa bullet points, paragrafi brevi, numeri evidenti. Tono energico e diretto. Includi un TL;DR in apertura. CTA verso il calculatore di investimento.`,

    wealth: `Scrivi per WEALTH MANAGER / FAMILY OFFICE: professionisti della gestione patrimoniale. Usa terminologia finanziaria istituzionale: Sharpe ratio, VaR, AUM, MiFID II. Tono formale e data-driven. CTA verso la dashboard B2B di VinoInvest.`,

    cantina: `Scrivi per CANTINA: produttori vitivinicoli che vogliono capire il mercato secondario. Usa terminologia vinicola e commerciale. Spiega come la loro cantina beneficia di una piattaforma di investimento. CTA verso il portale cantina di VinoInvest.`,

    seo: `Scrivi per il pubblico generale SEO: massima leggibilità, keyword naturali, risposte dirette alle domande frequenti. Usa struttura H2/H3 nel testo. Include FAQ in fondo. CTA verso VinoInvest.`,
  };

  return `Sei un esperto di investimento nel vino. Scrivi un articolo professionale in italiano.

TITOLO: "${topic.title}"
CATEGORIA: ${topic.category}
PERSONA TARGET: ${personaInstructions[persona]}

REQUISITI TECNICI:
- 800-1200 parole nel content
- Scrivi in italiano fluente e naturale
- Includi dati reali: cita fonti (Liv-ex, Wine-Searcher, Robert Parker, Christie's, Sotheby's, IWSR) con numeri plausibili
- Includi 2-3 internal link nel formato [testo link](/wines o /market o /analysis)
- Termina con una CTA personalizzata per la persona target

SCHEMA.ORG: includi nel JSON il campo schemaMarkup con Article markup minimale

Rispondi SOLO con JSON valido, zero markdown:
{
  "title": "titolo articolo",
  "slug": "slug-seo-friendly-max-80-chars",
  "excerpt": "meta description 150-155 caratteri ottimizzata per SEO",
  "content": "contenuto completo 800-1200 parole, paragrafi separati da \\n\\n",
  "category": "${topic.category}",
  "readTime": "X min",
  "metaDescription": "meta description 155 caratteri esatti",
  "schemaMarkup": {"@type":"Article","name":"titolo","description":"excerpt"}
}`;
}

// ── GENERATION ENGINE ────────────────────────────────────────────────────────

async function generateArticle(topic, persona, retries = 2) {
  const prompt = buildPrompt(topic, persona);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        system: "Wine investment blog writer. Return ONLY valid JSON. No markdown. No preamble.",
        messages: [{ role: "user", content: prompt }],
      });

      const text = msg.content[0]?.text?.trim() || "";
      const s = text.indexOf("{");
      const e = text.lastIndexOf("}") + 1;
      if (s < 0) throw new Error("No JSON found");

      const parsed = JSON.parse(text.slice(s, e));
      if (!parsed.title || !parsed.content) throw new Error("Missing fields");

      const wordCount = parsed.content.split(/\s+/).length;
      return {
        ...parsed,
        persona,
        wordCount,
        tokensUsed: msg.usage?.output_tokens || 0,
      };
    } catch (err) {
      if (attempt === retries) {
        console.error(`  [ERR] ${topic.title}: ${err.message}`);
        return null;
      }
      await delay(2000);
    }
  }
  return null;
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== VinoInvest Blog Generator — 100 Articles ===\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY not set in .env");
    process.exit(1);
  }

  await ensureSchema();

  const plan = [
    { persona: "curioso",    topics: TOPICS.curioso },
    { persona: "appassionato", topics: TOPICS.appassionato },
    { persona: "investitore", topics: TOPICS.investitore },
    { persona: "youngPro",   topics: TOPICS.youngPro },
    { persona: "wealth",     topics: TOPICS.wealth },
    { persona: "cantina",    topics: TOPICS.cantina },
    { persona: "seo",        topics: TOPICS.seo },
  ];

  let generated = 0;
  let skipped = 0;
  let failed = 0;
  const total = plan.reduce((s, p) => s + p.topics.length, 0);

  console.log(`Total target: ${total} articles\n`);

  for (const { persona, topics } of plan) {
    console.log(`\n── Persona: ${persona.toUpperCase()} (${topics.length} articles) ──`);

    for (const topic of topics) {
      const slug = makeSlug(topic.title);

      if (await slugExists(slug)) {
        console.log(`  [SKIP] ${topic.title.slice(0, 60)}`);
        skipped++;
        generated++;
        if (generated % 10 === 0) printProgress(generated, total, skipped, failed);
        continue;
      }

      process.stdout.write(`  [GEN]  ${topic.title.slice(0, 60)}... `);
      const article = await generateArticle(topic, persona);

      if (article) {
        article.slug = article.slug || slug;
        // Ensure slug is safe
        article.slug = makeSlug(article.slug);
        await savePost(article);
        generated++;
        console.log(`OK (${article.wordCount}w, ${article.tokensUsed} tokens)`);
      } else {
        failed++;
        generated++;
        console.log("FAILED — skipped");
      }

      if (generated % 10 === 0) printProgress(generated, total, skipped, failed);

      // Rate limiting: 1 req/s to stay within Haiku limits
      await delay(1100);
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`DONE: ${generated - failed - skipped} new articles generated`);
  console.log(`      ${skipped} skipped (already exist)`);
  console.log(`      ${failed} failed`);
  console.log("═══════════════════════════════════════\n");

  await pool.end();
}

function printProgress(done, total, skipped, failed) {
  const pct = Math.round((done / total) * 100);
  console.log(`\n  ▸ Progress: ${done}/${total} (${pct}%) — skipped:${skipped} failed:${failed}\n`);
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
