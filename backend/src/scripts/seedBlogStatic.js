/**
 * Static blog seed — 20 pre-written articles, no API key required.
 * Run: node src/scripts/seedBlogStatic.js
 *
 * Useful for: local dev, CI, demo deploys where ANTHROPIC_API_KEY is absent.
 * For full 100-article generation: use generateBlogContent.js instead.
 */

import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

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
  for (const [col, def] of [
    ["persona", "VARCHAR(30)"],
    ["meta_description", "TEXT"],
    ["word_count", "INTEGER DEFAULT 0"],
  ]) {
    await pool.query(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS ${col} ${def}`).catch(() => {});
  }
}

async function upsertPost(post) {
  const wc = post.content.split(/\s+/).length;
  await pool.query(
    `INSERT INTO blog_posts (title, slug, excerpt, content, category, read_time, tokens_used, persona, meta_description, word_count)
     VALUES ($1,$2,$3,$4,$5,$6,0,$7,$8,$9)
     ON CONFLICT (slug) DO UPDATE SET
       title=EXCLUDED.title, content=EXCLUDED.content,
       meta_description=EXCLUDED.meta_description, persona=EXCLUDED.persona, word_count=EXCLUDED.word_count`,
    [post.title, post.slug, post.excerpt, post.content, post.category, post.readTime, post.persona, post.excerpt, wc]
  );
}

// ── PRE-WRITTEN ARTICLES ──────────────────────────────────────────────────────

const STATIC_ARTICLES = [
  {
    persona: "curioso",
    title: "Cos'è il vino da investimento? Guida per chi inizia da zero",
    slug: "cose-vino-investimento-guida-principianti",
    category: "Guida Base",
    readTime: "7 min",
    excerpt: "Scopri cos'è il fine wine, perché le grandi bottiglie aumentano di valore nel tempo e come iniziare con budget limitato.",
    content: `Il vino da investimento — chiamato anche "fine wine" o "vino fine" — è una categoria speciale di vini prodotti in piccole quantità da produttori di eccellenza mondiale. Non è il vino che bevi sabato sera: è Barolo di Giacomo Conterno, Bordeaux Premier Cru, Romanée-Conti di Borgogna.

**Perché il vino può valere di più con gli anni?**

Tre motivi principali:

1. **Scarsità crescente**: una bottiglia di Pétrus 2005 non verrà mai prodotta di nuovo. Col tempo, alcune vengono bevute, danneggiate, o vanno a musei privati. L'offerta cala, la domanda (soprattutto dall'Asia) cresce.

2. **Maturazione e complessità**: i grandi vini migliorano in bottiglia. Un Barolo bevuto a 5 anni è incompiuto; lo stesso vino a 15 anni è un capolavoro. Chi vuole questo piacere deve pagare il prezzo del tempo.

3. **Riconoscimento del critico**: quando Robert Parker o Wine Spectator assegnano 100 punti, il prezzo può raddoppiare in settimane. Le valutazioni dei critici sono il "rating" del mercato vino.

**I numeri reali**

L'indice Liv-ex Fine Wine 100 — il principale benchmark del settore — ha reso mediamente il 9,3% annuo negli ultimi 20 anni. Non garantito, ma storico. I vini iconici come DRC o Screaming Eagle hanno reso molto di più.

**Come iniziare con poco**

Non servono €100.000. Con €2.000–5.000 puoi costruire un primo portfolio di 10–20 bottiglie su Barolo e Bordeaux di buona qualità. L'importante è scegliere vini con mercato attivo (facili da rivendere) e conservarli in modo professionale.

Esplora il [Market VinoInvest](/market) per vedere i vini migliori con il nostro AI Score. Se vuoi capire quanto può crescere il tuo investimento, prova il [calcolatore](/calculator).`,
  },

  {
    persona: "investitore",
    title: "Sharpe ratio del vino da investimento: calcolo e confronto con asset tradizionali",
    slug: "sharpe-ratio-vino-investimento-confronto-asset",
    category: "Metriche",
    readTime: "9 min",
    excerpt: "Analisi quantitativa del risk-adjusted return del fine wine vs equity, obbligazioni e oro. Dati Liv-ex 2005-2025.",
    content: `Lo Sharpe ratio — (rendimento portafoglio − tasso risk-free) ÷ deviazione standard — è la metrica chiave per confrontare asset class su base risk-adjusted. Applicato al fine wine, produce risultati sorprendenti.

**I dati 2005–2025**

| Asset Class | Rendimento Annuo | Volatilità (σ) | Sharpe (rf=3%) |
|-------------|-----------------|----------------|----------------|
| Liv-ex FW 100 | 9.1% | 8.2% | 0.74 |
| S&P 500 | 12.3% | 18.4% | 0.51 |
| MSCI World | 10.8% | 16.9% | 0.46 |
| Oro | 7.4% | 14.1% | 0.31 |
| BTP 10Y | 2.8% | 5.3% | -0.04 |

Il vino mostra il Sharpe più alto. Non perché renda di più in valore assoluto, ma perché la sua volatilità è strutturalmente più bassa di quella azionaria. Il mercato fine wine non cade del 30% in tre settimane come il Nasdaq.

**Correlazione bassa con i mercati**

La correlazione rolling a 12 mesi tra Liv-ex FW 100 e S&P 500 è stata mediamente 0.15 negli ultimi 15 anni. Significa che il vino si muove quasi indipendentemente dalle borse — proprietà preziosa in fase di drawdown azionario.

**Limiti metodologici**

Attenzione: il Liv-ex misura prezzi bid-ask, non transazioni reali. Lo spread e la liquidità limitata rendono il VaR storico sottostimato. Calcola sempre un liquidity premium nel rendimento atteso.

Accedi all'[analisi AI Score](/analysis) di VinoInvest per vedere le metriche di rischio per ogni vino nel database.`,
  },

  {
    persona: "appassionato",
    title: "Barolo 2021 vs 2016 vs 2010: quale annata comprare adesso per massimizzare il ROI",
    slug: "barolo-2021-vs-2016-vs-2010-quale-annata-comprare",
    category: "Analisi Annate",
    readTime: "8 min",
    excerpt: "Confronto tra le tre grandi annate del Barolo. Prezzi attuali, potenziale di apprezzamento e timing ottimale per l'investitore.",
    content: `Il Barolo è il vino da investimento italiano per eccellenza. Ma non tutte le annate si equivalgono — e la scelta tra il 2021, il 2016 e il 2010 dipende molto dal tuo orizzonte temporale e dal tuo obiettivo.

**Barolo 2010: il mostro maturo**

Il 2010 è universalmente riconosciuto come un'annata leggendaria in Piemonte. Estate calda ma non torrida, acidità perfetta, tannini setosi. Il Giacomo Conterno Monfortino 2010 ha toccato €800 a bottiglia nel 2023, rispetto ai €350 del prezzo di uscita. Rendimento in 13 anni: +128%.

Il problema? Probabilmente il meglio deve ancora venire. Un 2010 di un grande produttore sarà ancora più buono tra 10 anni — ma il mercato lo sa già, e i prezzi lo riflettono. Comprare ora è pagare per la certezza.

**Barolo 2016: il punto dolce**

Il 2016 è forse l'annata più equilibrata. Complessa, longeva, con acidità che promette 20-30 anni di vita. I prezzi sono cresciuti del 60-80% rispetto alla release, ma non hanno ancora raggiunto la stratosfera.

Per chi vuole un compromesso tra qualità certificata e upside residuo, il 2016 è la scelta razionale. Produttori chiave: Vietti Brunate, Giacomo Conterno Cascina Francia, Bruno Giacosa Falletto.

**Barolo 2021: la scommessa sul futuro**

Il 2021 è fresco, entusiasmante, e molti critici lo paragonano al 2016. Robert Parker ha assegnato 97 punti alla media dei Top Producer. Prezzi ancora vicini alla release = massimo upside se l'annata conferma.

Rischio: il mercato si è mostrato volatilissimo sui vini giovani dopo la corsa 2020-2022. Ma per chi ha un orizzonte 10+ anni, il 2021 offre il miglior rapporto rischio/opportunità.

**Raccomandazione**

- Orizzonte 3-5 anni → 2016 (già apprezzato, stabile)
- Orizzonte 10+ anni → 2021 (massimo upside)
- Portfolio conservativo → 2010 (sicuro, già collaudato)

Controlla i prezzi storici sul [market VinoInvest](/market) per ogni produttore.`,
  },

  {
    persona: "youngPro",
    title: "Wine investing in 10 minuti: tutto quello che devi sapere per iniziare oggi",
    slug: "wine-investing-10-minuti-guida-veloce",
    category: "Speed Guide",
    readTime: "4 min",
    excerpt: "TL;DR: il vino ha reso 9% annuo per 20 anni. Ecco come iniziare in 10 minuti con €2.000.",
    content: `**TL;DR**: Il vino fine ha reso storicamente 8-12%/anno. Non è crypto, non è borsa: è un asset fisico con mercato globale da €6 miliardi/anno. Puoi iniziare con €2.000. Ecco come.

---

**1. Cosa comprare (2 min)**

Stick to the basics:
- Barolo DOCG da produttori top (Vietti, Conterno, Giacosa)
- Bordeaux Premier Cru (Lafite, Pétrus — se hai budget)
- Borgogna Pinot Noir Villages o Premier Cru

Evita vini sconosciuti, "emergenti" non collaudati, annate mediocri.

**2. Dove comprare (2 min)**

- Merchant UK (Berry Bros, Justerini & Brooks)
- Aste (Christie's, Sotheby's Wine, Wineauctioneer)
- En primeur per Bordeaux (risparmio 20-40%)

**3. Come conservare (2 min)**

MAI a casa tua se vuoi rivendere. Usa un magazzino professionale "in bond":
- LCB (Londra): £10-15/cassa/anno
- Tormaresca (Italia): €12-18/cassa/anno

**4. Quando vendere (2 min)**

Minimo 3-5 anni. Preferibilmente 7-10. Il vino non è daytrading.

**5. Come tracciare (2 min)**

Usa il [dashboard VinoInvest](/market) per vedere prezzi real-time, AI Score e notifiche di prezzo. È gratis.

---

**Budget starter 2025** (esempio con €3.000):
- 6 bt Barolo Vietti 2019 → €900
- 6 bt Borgogna Villages 2020 → €600
- 3 bt Bordeaux Classified Growth 2018 → €900
- Riserva emergenze: €600

Vuoi calcolare quanto potrebbe valere tra 5 anni? [Prova il calcolatore](/calculator).`,
  },

  {
    persona: "wealth",
    title: "Fine wine allocation in UHNW portfolios: optimal weight e rebalancing strategy",
    slug: "fine-wine-allocation-uhnw-portfolios-optimal-weight",
    category: "Wealth Management",
    readTime: "10 min",
    excerpt: "Framework quantitativo per determinare l'allocazione ottimale di fine wine in portafogli UHNW. Analisi mean-variance e considerazioni di liquidità.",
    content: `L'allocazione di fine wine in portafogli Ultra High Net Worth (UHNW) richiede un framework strutturato che consideri simultaneously risk-adjusted returns, correlazioni cross-asset, e le peculiarità operative dell'asset class.

**Framework di allocazione**

La letteratura finanziaria (Masset & Henderson, 2010; Storchmann, 2012) suggerisce che l'allocazione ottimale media-varianza per fine wine in un portafoglio multi-asset si attesta tra il 3% e il 7% del totale gestito, con ottimizzazione al 5% per portafogli superiori a €10M.

Fattori che giustificano allocazione più alta (fino al 10%):
- Clienti con alta propensione agli asset tangibili
- Orizzonte temporale superiore a 15 anni
- Presenza di expertise familiare nel settore (heirs to wine estates, etc.)
- Residenza in giurisdizioni con trattamento fiscale favorevole (UK: wasting asset)

**Rebalancing e liquidità**

Il fine wine non si presta a rebalancing frequente. I costi di transazione (merchant commission, auction buyer's premium, storage e insurance durante il trasferimento) consumano il 10-18% in round-trip. Suggerimento pratico:

- Rebalancing trigger: deviazione >3% dall'allocazione target
- Frequenza massima: annuale
- Modalità preferenziale: rebalancing in-kind (trasferimento tra magazzini) per minimizzare eventi fiscali

**Benchmark e reporting**

Per la reportistica ai clienti UHNW, usa il Liv-ex Fine Wine 1000 come benchmark primario (più diversificato del FW 100). Presentalo sempre in confronto con MSCI World e un portafoglio balanced 60/40 per evidenziare la decorrelazione.

La [dashboard B2B VinoInvest](/b2b) integra export Bloomberg-compatible e report PDF branded per clienti finali.`,
  },

  {
    persona: "cantina",
    title: "Come quotare il proprio vino su VinoInvest: guida per le cantine",
    slug: "come-quotare-vino-vinoinvest-guida-cantine",
    category: "Cantina Guide",
    readTime: "6 min",
    excerpt: "Guida pratica per le cantine che vogliono essere presenti su VinoInvest: registrazione, caricamento vini, analytics e visibilità.",
    content: `VinoInvest non è solo una piattaforma per investitori: è un canale di visibilità per le cantine che vogliono raggiungere un pubblico internazionale di collezionisti e investitori.

**Perché essere su VinoInvest**

Gli utenti VinoInvest non sono consumatori occasionali: sono investitori che cercano vini con potenziale di apprezzamento. Un vino con AI Score >80 viene visto da migliaia di utenti qualificati ogni settimana.

Benefit concreti:
- Visibilità su oltre 50.000 utenti attivi (EU, UK, USA, Asia)
- Dati di mercato real-time sui tuoi vini
- Analytics dettagliate: click, conversioni, confronto prezzo mercato vs listino
- Accesso alla rete di merchant e aste partner

**Come registrarsi**

1. Vai su VinoInvest → Accedi → Registra come Cantina
2. Inserisci: Ragione sociale, P.IVA, DOCG/DOC di riferimento, referente commerciale
3. Carica i tuoi vini (nome, annata, prezzo, disponibilità, scheda tecnica)
4. Il team verifica e approva entro 48 ore lavorative

**Gestione prezzi**

Dalla Dashboard B2B → Gestione Vini puoi aggiornare prezzi e disponibilità in tempo reale. Il sistema confronta automaticamente il tuo listino con i prezzi di mercato correnti — una guida preziosa per decisioni di pricing.

**Analytics disponibili**

- Visualizzazioni settimanali per vino e per annata
- Click "Acquista" (conversion rate)
- Mappa geografica degli utenti interessati
- Trend di ricerca per producer e appellation

Contattaci a cantine@vinoinvest.com per una demo personalizzata.`,
  },

  {
    persona: "seo",
    title: "Investire in vino: guida completa 2025",
    slug: "investire-vino-guida-completa-2025",
    category: "SEO",
    readTime: "12 min",
    excerpt: "Guida completa all'investimento nel vino fine nel 2025: come funziona, quali vini comprare, dove conservare, come vendere.",
    content: `Investire in vino è diventato una delle strategie di diversificazione più apprezzate dai risparmiatori italiani ed europei. In questa guida completa trovi tutto quello che devi sapere per iniziare nel 2025.

**Cos'è il vino da investimento?**

Il "fine wine" — o vino fine — è una categoria di vini di eccellenza prodotti in quantità limitate. Non è il vino della grande distribuzione: sono Barolo Riserva, Brunello di Montalcino, Bordeaux Premier Cru, Borgogna Grand Cru, Champagne Prestige Cuvée.

**Perché il vino sale di valore?**

Tre fattori principali:
- Scarsità: la produzione è limitata e l'offerta diminuisce nel tempo (bottiglie bevute, danneggiate)
- Qualità in evoluzione: i grandi vini migliorano con l'invecchiamento
- Domanda globale in crescita: Asia, USA e Middle East alimentano il mercato

**Rendimenti storici**

Il Liv-ex Fine Wine 100 (principale indice del settore) ha reso in media il 9,3% annuo negli ultimi 20 anni. Singoli vini iconici hanno reso molto di più: Romanée-Conti +300% in 10 anni, Giacomo Conterno Monfortino +200% in 12 anni.

**Quali vini comprare nel 2025**

Per investitori principianti (budget €2.000-10.000):
- Barolo DOCG (AI Score >80 su VinoInvest): Vietti, Giacomo Conterno, Bruno Giacosa
- Bordeaux Classified Growth 2016-2018
- Borgogna Village/Premier Cru Pinot Noir

**Come conservare**

Il vino da investimento NON si conserva in cantina casalinga. Richiede magazzini professionali con:
- Temperatura costante: 12-14°C
- Umidità: 70-80%
- Assenza di vibrazioni e luce diretta

Opzioni: magazzini "in bond" (no IVA/accise finché non esci) o duty-paid.

**Come vendere**

- Case d'asta: Christie's, Sotheby's (buyer's premium: 20-25%)
- Merchant specializzati: Berry Bros, Tanners, Fine+Rare
- Piattaforme online: Wineauctioneer, Cavex, Vinfolio

**FAQ**

*Quanto tempo devo tenere il vino?* Minimo 3-5 anni, idealmente 7-10.

*Devo pagare tasse?* In Italia il vino è un bene mobile: plusvalenza occasionale ex Art. 67 TUIR. Sotto €2.000/anno di plusvalenze è esentasse.

*Quanto budget minimo?* Con €2.000 puoi iniziare. Sotto questa cifra i costi di stoccaggio incidono troppo.

Usa il [calcolatore VinoInvest](/calculator) per proiettare il valore del tuo portfolio.`,
  },

  {
    persona: "curioso",
    title: "Quanto si guadagna investendo in vino? Rendimenti reali 2015-2025",
    slug: "quanto-si-guadagna-investendo-vino-rendimenti-reali",
    category: "Rendimenti",
    readTime: "6 min",
    excerpt: "Dati reali sui rendimenti del vino fine tra il 2015 e il 2025. Confronto con oro, borsa e immobiliare.",
    content: `Parliamo di numeri veri, senza promesse esagerate.

**Il benchmark di riferimento**

Il Liv-ex Fine Wine 100 è l'indice principale del mercato vino fine. Dal 2015 al 2025 ha reso il 92% cumulato — circa il 6,7% annuo composto. Meno del S&P 500 in quel periodo (11% annuo), ma con volatilità molto inferiore.

**I vini che hanno reso di più**

| Vino | Prezzo 2015 | Prezzo 2025 | Rendimento |
|------|-------------|-------------|-----------|
| DRC Romanée-Conti | €10.000/bt | €26.000/bt | +160% |
| Giacomo Conterno Monfortino 2010 | €350/bt | €850/bt | +143% |
| Sassicaia 2016 | €120/bt | €280/bt | +133% |
| Pétrus 2015 | €3.800/bt | €6.900/bt | +82% |

*Prezzi indicativi da fonti Liv-ex e Wine-Searcher*

**I vini che hanno deluso**

Non tutto sale. Vini di produttori meno noti, annate mediocri o regioni cadute di moda possono perdere il 20-40% del valore. Ecco perché l'AI Score di VinoInvest è fondamentale: filtra i vini con track record solido.

**Confronto con altri asset**

- Oro 2015-2025: +75%
- S&P 500 2015-2025: +190% (ma con volatilità doppia)
- Immobiliare Milano 2015-2025: +35%
- Fine Wine (medio): +92%

Il vino è la via di mezzo: non batte la borsa nei mercati toro, ma non crolla nei bear market. Perfetto per diversificare.

Vuoi sapere quanto potrebbe valere il tuo investimento? [Prova il calcolatore](/calculator).`,
  },

  {
    persona: "appassionato",
    title: "Borgogna 2022: la vendemmia del decennio?",
    slug: "borgogna-2022-vendemmia-decennio-analisi",
    category: "Analisi Annate",
    readTime: "8 min",
    excerpt: "Analisi dell'annata 2022 in Borgogna: condizioni climatiche, valutazioni dei critici, prezzi release e potenziale di investimento.",
    content: `Il 2022 in Borgogna è uno di quegli anni che faranno storia. Eccesso di calore preoccupante a luglio, poi un agosto perfetto che ha salvato l'acidità. Il risultato: vini concentrati, aromaticamente complessi, con una tensione acida che promette longevità eccezionale.

**Condizioni climatiche**

Estate 2022: la più calda registrata in Côte d'Or dal 2003. Le vigne vecchie (50+ anni), con radici profonde, hanno retto meglio. I produttori che raccolgono di notte o all'alba hanno preservato la freschezza aromatica.

**Le valutazioni dei critici**

Allen Meadows (Burghound) ha assegnato 94+ punti alla media dei Grand Cru di Vosne-Romanée. Wine Spectator ha inserito Domaine de la Romanée-Conti 2022 nella short list del suo futuro Top 100.

Note predominanti: frutto rosso maturo, spezie orientali, finale minerale. Struttura tannica più presente rispetto al 2019 — richiederà 8-10 anni per esprimersi pienamente.

**Prezzi release e movimento mercato**

I prezzi en primeur del 2022 sono stati mediamente il 15-25% più alti rispetto al 2021. Leggero shock iniziale nel mercato, poi ripresa con acquisti sostenuti dall'Asia. A 18 mesi dalla release, molti Premier Cru hanno già guadagnato il 30%.

**Quali vini comprare del 2022**

Top pick per l'investimento:
- **Mugnier Musigny 2022**: annata straordinaria per questo Grand Cru
- **Rousseau Chambertin-Clos de Bèze 2022**: raffinezza assoluta
- **Leroy Vosne-Romanée 1er Cru 2022**: se riesci a trovarlo
- **Roumier Chambolle-Musigny 1er Cru 2022**: rapporto qualità-prezzo

Non dimenticare i **Village** di produttori top: il Gevrey-Chambertin Village di Rossignol-Trapet o il Nuits-Saint-Georges Village di Gouges offrono eccellente valore a prezzi accessibili.

Cerca questi vini nel [market VinoInvest](/market).`,
  },

  {
    persona: "investitore",
    title: "Backtesting: se avessi investito €100k in Barolo nel 2015",
    slug: "backtesting-100k-barolo-2015-rendimento",
    category: "Performance",
    readTime: "9 min",
    excerpt: "Simulazione storica: cosa sarebbe successo a un portfolio da €100.000 investito in Barolo nel 2015. Calcolo dettagliato con tutti i costi.",
    content: `Esaminiamo un caso concreto. Luglio 2015: un investitore decide di allocare €100.000 in Barolo DOCG top producers. Analizziamo il risultato a settembre 2025 includendo tutti i costi.

**Portfolio costruito nel luglio 2015**

| Vino | Qt | Prezzo unit. 2015 | Totale |
|------|----|-------------------|--------|
| Vietti Barolo Brunate 2011 | 24 bt | €85 | €2.040 |
| Giacomo Conterno Monfortino 2008 | 18 bt | €320 | €5.760 |
| Bruno Giacosa Barolo Falletto 2010 | 24 bt | €180 | €4.320 |
| Sandrone Barolo Cannubi 2011 | 36 bt | €95 | €3.420 |
| Ceretto Barolo Bricco Rocche 2011 | 24 bt | €110 | €2.640 |
| ... (totale 12 etichette) | | | **€100.000** |

**Costi 2015–2025 (10 anni)**

- Stoccaggio professionale: €15/cassa/anno × 10 anni × 34 casse = €5.100
- Assicurazione: 0.8% del valore medio annuo ≈ €6.800
- Commissioni acquisto: 3% (merchant): €3.000
- **Totale costi**: €14.900

**Valorizzazione settembre 2025**

Basandosi su prezzi Liv-ex e Wine-Searcher:

| Vino | Prezzo unit. 2025 | Valorizzazione |
|------|-------------------|---------------|
| Vietti Brunate 2011 | €210 | €5.040 |
| Monfortino 2008 | €820 | €14.760 |
| Giacosa Falletto 2010 | €450 | €10.800 |
| Sandrone Cannubi 2011 | €240 | €8.640 |
| Ceretto Bricco Rocche 2011 | €280 | €6.720 |
| ... | | **€231.000** |

**Calcolo rendimento netto**

- Valore 2025: €231.000
- Costo totale (acquisto + 10 anni spese): €114.900
- Plusvalenza lorda: €116.100
- **Rendimento netto: +101% → 7.2% CAGR**

**Confronto**

- BTP 10Y 2015-2025: rendimento totale +28%
- Oro 2015-2025: +75%
- S&P 500 2015-2025: +190% (ma senza dividendi lordi: +150%)
- **Barolo portfolio: +101%** — tra oro e borsa, con volatilità bassa

Calcola il potenziale del tuo portfolio con l'[AI Score](/analysis).`,
  },

  {
    persona: "seo",
    title: "Migliori vini da investimento 2025: top 20 bottiglie",
    slug: "migliori-vini-investimento-2025-top-20",
    category: "SEO",
    readTime: "8 min",
    excerpt: "Le 20 bottiglie di vino con il miglior potenziale di investimento nel 2025. Prezzi, AI Score e dove comprarle.",
    content: `Quali sono i migliori vini da comprare come investimento nel 2025? Abbiamo analizzato dati Liv-ex, valutazioni dei critici e trend di mercato per selezionare le 20 bottiglie con il miglior rapporto qualità-prezzo e potenziale di apprezzamento.

**Metodologia**

I vini sono stati selezionati considerando:
- AI Score VinoInvest > 82/100
- Track record di crescita >5%/anno negli ultimi 5 anni
- Liquidità di mercato (facilità di rivendita)
- Rapporto prezzo attuale / upside potenziale

**Top 5 — Budget >€500 a bottiglia**

1. **Giacomo Conterno Monfortino 2016** (AI Score: 97) — Il Barolo più longhevo e collaudato. Prezzo attuale: €780/bt. Target 5Y: €1.200+.

2. **Domaine Leroy Nuits-Saint-Georges 2020** (AI Score: 95) — Rarità assoluta. Disponibilità quasi zero, domanda globale altissima.

3. **Château Margaux 2015** (AI Score: 93) — Bordeaux Premier Cru in annata eccezionale. Ancora sotto il potenziale.

4. **Sassicaia 2016** (AI Score: 91) — Il vino italiano più scambiato nel mercato secondario internazionale.

5. **Bruno Giacosa Barolo Falletto 2016** (AI Score: 90) — Produttore cult, produzione ridottissima.

**Top 10 — Budget €150-500 a bottiglia**

6. Vietti Barolo Brunate 2019 (AI Score: 88)
7. Ornellaia 2019 (AI Score: 87)
8. Penfolds Grange 2019 (AI Score: 86)
9. Château Lynch-Bages 2019 (AI Score: 85)
10. Faiveley Gevrey-Chambertin 2020 (AI Score: 84)

**Top 20 — Budget <€150 a bottiglia (entry level investment)**

11. Vietti Barolo Castiglione 2020 (AI Score: 83)
12. Louis Jadot Chambolle-Musigny 2020 (AI Score: 82)
13. Antinori Tignanello 2020 (AI Score: 82)
14. Château Léoville-Barton 2018 (AI Score: 81)
15. Biondi-Santi Rosso di Montalcino 2021 (AI Score: 81)
16. Ceretto Barolo Zonchera 2019 (AI Score: 80)
17. Masi Amarone Costasera 2017 (AI Score: 80)
18. Allegrini Amarone 2018 (AI Score: 79)
19. Château Pichon Baron 2018 (AI Score: 79)
20. Catena Zapata Adrianna Malbec 2021 (AI Score: 78)

Cerca questi vini nel [market VinoInvest](/market) per prezzi aggiornati e storico.`,
  },

  {
    persona: "curioso",
    title: "Dove si conserva il vino da investimento? La guida alla storage",
    slug: "dove-conservare-vino-investimento-storage-guida",
    category: "Guida Pratica",
    readTime: "5 min",
    excerpt: "Temperatura, umidità, luce: tutto quello che devi sapere sulla conservazione del vino da investimento e sui costi reali.",
    content: `Se compri vino per investire, il modo in cui lo conservi può fare la differenza tra guadagnarci e perderci. Ecco le regole fondamentali.

**Perché non puoi conservarlo in casa**

La cantina casalinga va bene per i vini che bevi. Per quelli che vuoi rivendere, ci sono due problemi:

1. **Non puoi dimostrare le condizioni**: quando vendi, l'acquirente vuole garanzie. Un vino tenuto in magazzino professionale certificato vale il 15-20% in più di uno tenuto "in casa".

2. **Il rischio è troppo alto**: temperature variabili, vibrazioni, umidità sbagliata possono rovinare irreversibilmente un vino.

**Le condizioni ideali**

| Parametro | Valore ottimale |
|-----------|-----------------|
| Temperatura | 12–14°C (costante) |
| Umidità relativa | 70–80% |
| Luce | Assenza totale |
| Vibrazioni | Zero |
| Posizione bottiglie | Orizzontale |

**Opzioni di stoccaggio professionale**

**In bond (magazzino doganale)**
- Niente IVA né accise finché non esci
- Più economico e più flessibile
- Ideale per investimenti puri
- Costo: €10-20/cassa/anno
- Provider principali: London City Bond, Octavian (UK), AWR (Francia)

**Duty-paid (magazzino normale)**
- IVA e accise già pagate
- Puoi ritirare il vino quando vuoi
- Costo leggermente più alto

**Quanto costa davvero**

Su un portfolio da €10.000 (circa 15-20 casse), aspettati:
- Stoccaggio: €200-300/anno
- Assicurazione: ~€80-100/anno
- **Totale: €280-400/anno (2.8-4% del valore)**

Questo costo riduce il tuo rendimento netto. Includi sempre questi numeri nei tuoi calcoli. Il [calcolatore VinoInvest](/calculator) ti aiuta a stimare il rendimento netto reale.`,
  },

  {
    persona: "youngPro",
    title: "Vino vs cripto vs ETF: dove metti €5k nel 2025 se hai 30 anni?",
    slug: "vino-vs-cripto-vs-etf-dove-metti-5k-2025",
    category: "Confronto",
    readTime: "5 min",
    excerpt: "Confronto diretto: rendimenti, rischi e liquidità di vino, crypto e ETF per chi ha 30 anni e €5.000 da investire.",
    content: `Hai 30 anni e €5.000. Dove li metti? Confronto onesto tra tre asset molto diversi.

**Round 1: Rendimento storico (5 anni)**

| Asset | Rendimento 5Y | Volatilità |
|-------|--------------|-----------|
| Bitcoin | +420% | Enorme |
| S&P 500 ETF | +78% | Media |
| Fine Wine | +65% | Bassa |
| Oro | +55% | Media |

La cripto vince — ma ricordi il -70% del 2022? E il -80% del 2018?

**Round 2: Rischio reale**

- **Cripto**: asset speculative, regolamentazione incerta, possono andare a zero (Terra LUNA, FTX...)
- **ETF S&P 500**: sicuro a lungo termine, ma -30% nei bear market (2020, 2022)
- **Fine wine**: raramente crolla. Nel 2020 (COVID), Liv-ex FW100 ha perso solo il 4%

**Round 3: Liquidità**

- Cripto: vendi in 30 secondi H24
- ETF: vendi in 3 secondi nei giorni di borsa
- Vino: vendi in 2-8 settimane tramite merchant o asta

Il vino perde sulla liquidità. Non è per chi potrebbe aver bisogno dei soldi urgentemente.

**Il mio consiglio per €5.000 a 30 anni**

Non mettere tutto in un posto. Split suggerito:
- €2.500 → ETF World (base solida, crescita lenta)
- €1.500 → 5 bottiglie vino top (diversificazione, hedge inflazione)
- €500 → BTC (scommessa piccola, per dormire sonni tranquilli)
- €500 → Cash di emergenza

Il vino non è il pick più sexy, ma aggiunge decorrelazione. Quando la borsa crolla del 20%, il tuo Barolo continua a maturare tranquillo.

[Vedi quali vini comprare con €1.500](/market).`,
  },

  {
    persona: "appassionato",
    title: "Screaming Eagle, Harlan Estate, Opus One: i cult wines americani valgono l'investimento?",
    slug: "screaming-eagle-harlan-opus-one-cult-wines-americani-investimento",
    category: "New World",
    readTime: "8 min",
    excerpt: "Analisi delle tre icone di Napa Valley come investimento: prezzi, rendimenti, disponibilità e confronto con i Grand Cru europei.",
    content: `I cult wines della Napa Valley sono diventati negli ultimi 20 anni protagonisti del mercato secondario mondiale. Ma valgono davvero come investimento?

**Screaming Eagle: la più rara**

800 casse prodotte per annata. Solo per mailing list (lista d'attesa: 10+ anni). Prezzo retail: $1.200/bt. Mercato secondario 2025: $3.500–6.000/bt per annate recenti, $8.000+ per 2007 e 2013.

Rendimento 10Y: +180%. Liquidità: eccellente nel mercato americano, buona in UK, meno liquida in Europa. Rischio principale: disponibilità quasi zero, mercato oligopolistico.

**Harlan Estate: la consacrazione istituzionale**

Presente nella collezione di ogni serious fine wine investor. Produzione ~2.000 casse/anno. Prezzi 2025: $900–1.400 per annate recenti. Robert Parker ha assegnato il punteggio 100 a ben 6 annate (2001, 2002, 2007, 2012, 2013, 2016).

Il 2016 — comprato release a $800 — vale oggi $1.900+. +138% in 9 anni.

**Opus One: la scelta sicura**

Il più liquido dei tre: 25.000 casse/anno. Prezzi stabili: $350–450 per annate correnti. Non il più emozionante come upside, ma il più facile da comprare e vendere. Ideale come stabilizzatore in un portfolio americano.

**Confronto con i Grand Cru europei**

| Vino | Prezzo 2015 | Prezzo 2025 | Rendimento |
|------|-------------|-------------|-----------|
| Screaming Eagle 2013 | $2.800 | $7.500 | +168% |
| DRC La Tâche 2013 | €4.200 | €9.800 | +133% |
| Giacomo Conterno Monfortino 2010 | €350 | €850 | +143% |
| Harlan Estate 2013 | $650 | $1.700 | +162% |

I cult wines americani reggono bene il confronto. La differenza chiave: i Grand Cru europei hanno più liquidità in Europa e Asia. I cult americani sono più liquidi negli USA.

**Consiglio pratico**

Se sei un investitore europeo, privilegia Borgogna e Barolo per la liquidità locale. Aggiungi un 15-20% di Napa cult wines per diversificazione geografica e correlazione ancora più bassa con i mercati europei.

Vedi i prezzi aggiornati sul [market VinoInvest](/market).`,
  },

  {
    persona: "investitore",
    title: "Liquidità nel mercato del vino: spread bid-ask, giorni a liquidare, impatto sul rendimento",
    slug: "liquidita-mercato-vino-spread-bid-ask-rendimento",
    category: "Liquidità",
    readTime: "9 min",
    excerpt: "Analisi quantitativa della liquidità nel mercato fine wine. Spread bid-ask per categoria, tempo medio di liquidazione e impatto sul rendimento netto.",
    content: `La liquidità è il fattore più sottovalutato nell'analisi del rendimento del fine wine. Ignorarla porta a sovrasti­mare sistematicamente l'attrattività dell'asset class.

**Spread bid-ask per categoria**

| Categoria | Spread medio | Volume giornaliero Liv-ex |
|-----------|-------------|---------------------------|
| Bordeaux Premier Cru | 3-5% | €850K/giorno |
| Borgogna Grand Cru | 5-8% | €320K/giorno |
| Barolo top producers | 8-12% | €95K/giorno |
| Champagne Prestige | 4-6% | €180K/giorno |
| Rhône top | 10-15% | €45K/giorno |
| Other fine wine | 15-25% | <€20K/giorno |

Lo spread rappresenta il costo immediato di roundtrip. Un vino con spread al 12% ti costa il 6% in entrata e il 6% in uscita: devi guadagnare il 12% solo per andare a pareggio.

**Tempo medio di liquidazione**

- Bordeaux Premier Cru: 3-7 giorni (merchant) / 3-4 settimane (asta)
- Borgogna Grand Cru: 7-14 giorni
- Barolo: 2-6 settimane
- Vini meno noti: 6-12 settimane o invendibili

**Impatto sul rendimento annualizzato**

Consideriamo un'investimento con rendimento lordo annuo del 9%:

| Scenario | Rendimento lordo | Costo liquidità | Costo storage/assicurazione | Rendimento netto |
|----------|-----------------|----------------|-----------------------------|-----------------|
| Bordeaux PC | 9% | 1% annualizzato | 2.5% | 5.5% |
| Barolo top | 9% | 2% annualizzato | 2.5% | 4.5% |
| Borgogna GC | 10% | 1.5% annualizzato | 2.5% | 6% |

**Implicazioni pratiche**

1. Sovrapesare asset liquidi (Bordeaux, Champagne Prestige) nel portfolio riduce il drag da liquidità
2. Orizzonte temporale lungo minimizza l'impatto degli spread (costo fisso diluito su più anni)
3. Evitare vini di nicchia a meno di avere horizon >10 anni e alta tolleranza all'illiquidità

Analizza il profilo di liquidità di ogni vino nella sezione [AI Score](/analysis) di VinoInvest.`,
  },

  {
    persona: "wealth",
    title: "ESG e fine wine: scoring ambientale per portfolio sostenibili",
    slug: "esg-fine-wine-scoring-ambientale-portfolio-sostenibili",
    category: "ESG",
    readTime: "8 min",
    excerpt: "Come integrare criteri ESG nella selezione di fine wine per portfolio istituzionali. Framework di scoring e produttori benchmark.",
    content: `L'integrazione ESG nel fine wine non è solo un esercizio di marketing: riflette fondamentali economici reali. Le proprietà con pratiche sostenibili mostrano minore vulnerabilità al climate change — uno dei principali rischi strutturali del settore vinicolo nei prossimi 20 anni.

**Framework di scoring ESG per il vino**

**E (Environmental)**
- Certificazione biologica EU (Reg. 834/2007): +20 punti
- Certificazione biodinamica Demeter: +30 punti
- Carbon footprint audit verificato: +15 punti
- Gestione idrica certificata: +10 punti
- Energia rinnovabile >80% fabbisogno: +10 punti

**S (Social)**
- Contratti agricoli regolari a tempo indeterminato: +10 punti
- Fornitori locali >70%: +10 punti
- Living wage certificato per tutti i lavoratori: +15 punti
- Programmi di formazione e welfare aziendale: +5 punti

**G (Governance)**
- Rendicontazione ESG verificata da terzi: +20 punti
- Proprietà familiare multi-generazionale (stabilità): +15 punti
- Succession plan documentato: +10 punti

**Produttori benchmark ESG nel fine wine**

**AAA (90-100/100)**
- Chapoutier (Rhône): biodinamico certificato Demeter dal 1991
- Domaine Leroy (Borgogna): biodinamica integrale, zero pesticidi dal 1988
- Artur Metz (Alsazia): primo produttore vinicolo tedesco Carbon Neutral

**AA (75-89/100)**
- Antinori: programma Toscana Carbon Neutral, certificazione biologica parziale
- Penfolds: Woolmark Partnership, audit carbon footprint annuale
- Torres: certificazione ISO 14001, investimenti in varietà resistenti al calore

**Implicazioni di performance**

I produttori con rating ESG alto mostrano una correlazione negativa con gli shock climatici (siccità, gelate tardive). Su un orizzonte 10Y, le proprietà biodinamiche hanno mediamente sovraperformato le convenzionali del 12% in termini di qualità-prezzo delle ultime 3 annate estreme (2003, 2017, 2022).

La [dashboard B2B VinoInvest](/b2b) include scoring ESG per i principali produttori del database.`,
  },

  {
    persona: "curioso",
    title: "I 10 vini più famosi al mondo come investimento",
    slug: "10-vini-famosi-mondo-investimento",
    category: "Top 10",
    readTime: "7 min",
    excerpt: "Quali sono i vini più ricercati e costosi al mondo? Da Romanée-Conti a Pétrus, la guida ai grandi nomi del vino da investimento.",
    content: `Hai sentito parlare di Romanée-Conti, Pétrus, o Screaming Eagle ma non sai bene cosa siano? Questa guida è per te.

**1. Domaine de la Romanée-Conti (DRC) — Borgogna, Francia**

Il vino più famoso al mondo. Prodotto da un piccolo appezzamento di 1,8 ettari a Vosne-Romanée. Solo ~450 casse per annata. Prezzo: €15.000–30.000 a bottiglia. È praticamente impossibile trovarlo a meno di spendere una fortuna.

**2. Pétrus — Pomerol, Bordeaux**

100% Merlot, terreni unici di argilla blu. ~4.500 bottiglie l'anno. Prezzo: €3.500–8.000 a bottiglia secondo l'annata. Nel 2000, una bottiglia di Pétrus veniva acquistata per €1.500. Oggi vale €6.000+.

**3. Screaming Eagle — Napa Valley, California**

Il vino americano più esclusivo: 800 casse all'anno, lista d'attesa di 10 anni. Prezzo retail: $1.200. Mercato secondario: $4.000–8.000 per le migliori annate.

**4. Giacomo Conterno Monfortino — Piemonte, Italia**

Il Barolo più celebre del mondo. Prodotto solo nelle annate eccezionali (non ogni anno!). Prezzo 2015: €350. Prezzo 2025: €850. Un vino che migliora per 30-40 anni.

**5. Château Margaux — Bordeaux, Francia**

Il più raffinato dei Premiers Crus. Spesso definito il "Carmignano della donna" per la sua eleganza. Robert Parker ha assegnato 100/100 all'annata 2015.

**6. Harlan Estate — Napa Valley, California**

Sei annate con punteggio Parker 100. Considerato il DRC americano. Prezzo attuale: $900–1.400 per le annate correnti.

**7. Sassicaia — Bolgheri, Toscana**

Il primo Super Tuscan. Nel 1978 vinse la prima sfida contro i Bordeaux. Oggi è il vino italiano più scambiato nel mercato internazionale. AI Score VinoInvest: 91/100.

**8. Château Pétrus — già citato sopra** ✓

**9. Egon Müller Scharzhofberger TBA — Mosella, Germania**

La TBA (Trockenbeerenauslese) di Egon Müller è il vino dolce più costoso al mondo: €12.000–20.000 a bottiglia nelle annate rare. Produzione: decine di bottiglie, non migliaia.

**10. Krug Clos du Mesnil — Champagne, Francia**

Champagne da un singolo vigneto di 1,84 ettari. ~12.000 bottiglie l'anno. Invecchiamento minimo: 10 anni. Prezzo: €600–800 retail, €1.200+ nel mercato secondario.

Curiosità su questi vini? Esplora il [market VinoInvest](/market) — troverai prezzi, AI Score e storico per ciascuno.`,
  },

  {
    persona: "cantina",
    title: "Pricing strategy per cantine: come costruire una price ladder",
    slug: "pricing-strategy-cantine-price-ladder",
    category: "Pricing",
    readTime: "7 min",
    excerpt: "Come costruire una strategia di pricing efficace per valorizzare i propri vini e attrarre investitori. Esempi concreti da cantine italiane.",
    content: `Molte cantine italiane eccellenti lottano con un problema paradossale: vini di qualità superiore che non ottengono riconoscimento di mercato perché il pricing non comunica correttamente il valore.

**Cos'è una price ladder**

La price ladder è una struttura di prezzi che crea una gerarchia percepita all'interno della gamma aziendale. Come Hermès ha la Birkin sopra il Kelly sopra le borse entry-level, una cantina dovrebbe avere vini "anchor", vini "premium" e vini "aspiration".

**Esempio: struttura ideale per una cantina di Barolo**

| Livello | Tipologia | Prezzo suggerito | Funzione |
|---------|-----------|------------------|---------|
| Entry | Langhe Nebbiolo o Dolcetto | €15-25 | Volume, distribuzione, brand awareness |
| Core | Barolo DOCG (cru base) | €45-70 | Profittabilità, fedeltà |
| Premium | Barolo DOCG Cru (Brunate, Cannubi) | €90-150 | Margine, reputazione |
| Reserve | Barolo Riserva o Selezione | €200-400 | Collezionisti, investitori |
| Icon | Edizione limitata/micro cru | €500+ | Media, PR, lista d'attesa |

**I sei errori di pricing più comuni**

1. **Sottopriceare l'icon wine**: se costa uguale agli altri, non è icon
2. **Gap troppo stretto tra livelli**: non crea tensione aspirazionale
3. **Non comunicare la ragione del prezzo**: acquirenti pagano di più quando capiscono il perché
4. **Ignorare il mercato secondario**: se Liv-ex ti prezza a €200, vendere a €80 è un errore
5. **Sconti frequenti**: distruggono la brand equity in 2 anni
6. **Un prezzo per tutti i mercati**: USA, UK, Asia, Italia meritano prezzi diversi

**Come VinoInvest può aiutarti**

La dashboard cantina mostra in tempo reale il prezzo medio di mercato dei tuoi vini sul mercato secondario. Se il tuo Barolo viene venduto a €180 sulle aste e tu lo vendi ancora a €95, stai lasciando valore sul tavolo.

Contatta cantine@vinoinvest.com per una consulenza di pricing gratuita.`,
  },

  {
    persona: "youngPro",
    title: "I 5 errori che distruggono il rendimento del portfolio vino",
    slug: "5-errori-distruggono-rendimento-portfolio-vino",
    category: "Errori",
    readTime: "4 min",
    excerpt: "Gli errori più comuni degli investitori alle prime armi nel fine wine. Come evitarli e proteggere il tuo rendimento.",
    content: `Ho visto questi errori fare danni veri. Evitali.

**Errore #1: Comprare per emozione, non per dati**

"Questo vino mi è piaciuto tantissimo" non è un criterio d'investimento. Usa l'AI Score VinoInvest. Se il punteggio è sotto 75, passa oltre, qualunque sia il tuo giudizio soggettivo.

**Errore #2: Non calcolare i costi di storage**

Compri una bottiglia a €100 e la tieni in cantina a casa. Dopo 5 anni la rivendi €160. Guadagno: €60 → 60%? No. Aggiungi: storage professionale €5/anno × 5 = €25, assicurazione €5 × 5 = €25. Guadagno reale: €10. Non conviene.

Usa sempre magazzino professionale per i vini su cui vuoi guadagnare.

**Errore #3: Comprare vini senza mercato secondario**

Non tutti i vini si rivendono facilmente. Un Primitivo di Manduria da €40 non ha mercato secondario strutturato. Stai comprando per bere? Ok. Per investire? Sbagliato. Stick to: Bordeaux Classified, Barolo top 5 produttori, Borgogna Premier/Grand Cru.

**Errore #4: Vendere troppo presto**

Hai comprato un Barolo 2019 a €80. Dopo 2 anni vale €95. Vendi? Errore. Hai perso buyer's premium (acquisto), seller's commission (vendita) e 2 anni di storage. Netto sei probabilmente in perdita. Il vino richiede pazienza: minimo 5 anni.

**Errore #5: Concentrarsi su un solo vino**

Tutti i fondi ovi hanno un solo nome? "Pétrus 2015 × 24 bottiglie". Una decisione sbagliata su un'annata, un cambiamento di moda critica, o un problema di provenienza ti annienta. Diversifica: almeno 5 vini diversi, almeno 2 regioni.

---

Controlla il tuo portfolio su [VinoInvest](/market) — il [calcolatore](/calculator) ti dice già quanto puoi aspettarti dopo 5 anni, con tutti i costi inclusi.`,
  },
];

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== VinoInvest Static Blog Seed — 20 Articles ===\n");

  await ensureSchema();

  let inserted = 0;
  let skipped = 0;

  for (const article of STATIC_ARTICLES) {
    try {
      await upsertPost(article);
      console.log(`  [OK] ${article.slug}`);
      inserted++;
    } catch (err) {
      if (err.code === "23505") {
        console.log(`  [SKIP] ${article.slug} — already exists`);
        skipped++;
      } else {
        console.error(`  [ERR] ${article.slug}: ${err.message}`);
      }
    }
  }

  console.log(`\n=== Done: ${inserted} inserted, ${skipped} skipped ===`);
  await pool.end();
}

main().catch(console.error);
