// Premium Academy course content — 20 sequential modules per course
// Each module unlocks only after 70% quiz pass on the previous one.
export { ADMIN_EMAIL, QUIZ_PASS_THRESHOLD } from "../lib/constants";
let _consumerCache = null;
async function _loadConsumerModules() {
  if (_consumerCache) return _consumerCache;
  const m = await import("./premiumModulesConsumer.js");
  _consumerCache = {
    12: m.PORTFOLIO_CONSTRUCTION_MODULES,
    13: m.EN_PRIMEUR_AVANZATO_MODULES,
    14: m.AUTENTICITA_PROVENIENZA_MODULES,
    15: m.TAX_LEGALE_MODULES,
    16: m.MERCATO_SECONDARIO_MODULES,
    17: m.DATA_ANALYTICS_MODULES,
    18: m.CASE_STUDIES_MODULES,
    19: m.CANTINA_INVESTIMENTO_MODULES,
    20: m.WORKSHOP_CERTIFICATO_MODULES,
  };
  return _consumerCache;
}

let _b2bACache = null;
async function _loadB2BModulesA() {
  if (_b2bACache) return _b2bACache;
  const m = await import("./premiumModulesB2B.js");
  _b2bACache = {
    21: m.HNW_FAMILY_OFFICE_MODULES,
    22: m.ANALYTICS_B2B_MODULES,
    23: m.COMPLIANCE_MODULES,
    24: m.MERCATI_INTERNAZIONALI_MODULES,
    25: m.WINE_FUND_MODULES,
  };
  return _b2bACache;
}

let _b2bBCache = null;
async function _loadB2BModulesB() {
  if (_b2bBCache) return _b2bBCache;
  const m = await import("./premiumModulesB2B_b.js");
  _b2bBCache = {
    26: m.ESG_MODULES,
    27: m.MASTERCLASS_DATI_MODULES,
    28: m.AI_AUTOMATION_MODULES,
    29: m.BUSINESS_WINE_MODULES,
    30: m.CERTIFICAZIONE_FINALE_MODULES,
  };
  return _b2bBCache;
}

// ── Course 11: Rendimenti Storici ─────────────────────────────────────────────
export const RENDIMENTI_STORICI_MODULES = [
  {
    id: "rs_01",
    courseId: 11,
    index: 0,
    title: "Introduzione ai rendimenti storici del vino",
    duration: 14,
    youtube: null,
    hero: {
      headline: "Il vino come asset class: decorrelato dai mercati tradizionali",
      stat: "Asset class decorrelata dai mercati tradizionali",
      context: "Il Liv-ex Fine Wine 100 è il principale indice di riferimento per il mercato del fine wine. Le performance storiche sono pubblicate direttamente da Liv-ex e devono essere consultate alla fonte ufficiale."
    },
    objectives: [
      "Capire come si misura il rendimento di un investimento enologico",
      "Leggere correttamente i dati Liv-ex senza errori di interpretazione",
      "Distinguere rendimento nominale, reale e aggiustato per i costi",
      "Identificare il tuo orizzonte temporale ottimale",
    ],
    context: "Prima del Liv-ex (fondato nel 1999) non esisteva un mercato secondario trasparente per il vino. I prezzi erano opachi, i dati frammentati. Dal 2001 abbiamo 23 anni di storia pulita: abbastanza per estrarre pattern statistici significativi e distinguere ciò che è alpha reale da ciò che è solo marketing.",
    slides: [
      { title: "Cos'è il Liv-ex", body: "London International Vintners Exchange — marketplace B2B per il fine wine. 400+ merchant globali. Base dati storica dal 1988." },
      { title: "Liv-ex 100 vs. altri asset", body: "Il fine wine ha storicamente mostrato una correlazione bassa con azionario e obbligazionario, con volatilità contenuta rispetto ai mercati tradizionali. I dati di performance sono pubblicati direttamente da Liv-ex e devono essere consultati alla fonte ufficiale." },
      { title: "La volatilità conta", body: "Rendimento medio non basta. L'analisi del rapporto rischio/rendimento (Sharpe Ratio) richiede dati aggiornati direttamente da Liv-ex. Il fine wine tende ad avere bassa correlazione con l'azionario globale — il che lo rende utile ai fini di diversificazione." },
      { title: "Cosa include il rendimento", body: "Apprezzamento prezzi + capital gain EN PRIMEUR + dividendo implicito (evitato il markup retail). NON include storage, assicurazione, transazione (~2.5% totale)." },
      { title: "Costi nascosti", body: "Storage £12–18/cassa/anno, assicurazione 0.1%, commissioni aste 15–22%, IVA sulle uscite. Il rendimento lordo è sempre più bello del netto." },
      { title: "Orizzonte temporale", body: "Sotto i 5 anni: speculazione. 7–10 anni: investimento solido. 15+ anni: asset class da pianificazione patrimoniale. Il vino non è Bitcoin." },
      { title: "Concentrazione del rendimento", body: "Top 1% dei vini produce il 60% dell'alpha. Bordeaux First Growths + DRC + pochi altri. Il 'vino in generale' non è un investimento — la selezione è tutto." },
      { title: "Come iniziare con €5.000", body: "3 casse di Classified Bordeaux recente: esposizione real, costo contenuto, mercato liquido. Meglio di 100 bottiglie di nicchia non quotate." },
    ],
    mapSvg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" fill="#0b1220"/>
      <text x="200" y="24" textAnchor="middle" fill="#C9A227" fontSize="13" fontWeight="bold">Trend relativo — dati illustrativi</text>
      <line x1="40" y1="180" x2="360" y2="180" stroke="#1e3050" strokeWidth="1"/>
      <line x1="40" y1="40" x2="40" y2="180" stroke="#1e3050" strokeWidth="1"/>
      <polyline points="40,160 80,145 120,130 160,115 200,100 240,80 280,65 320,50 360,38" fill="none" stroke="#C9A227" strokeWidth="2"/>
      <polyline points="40,160 80,150 120,140 160,130 200,118 240,105 280,92 320,82 360,72" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4"/>
      <polyline points="40,160 80,155 120,148 160,140 200,130 240,120 280,112 320,104 360,97" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2"/>
      <text x="362" y="42" fill="#C9A227" fontSize="9">Vino</text>
      <text x="362" y="76" fill="#60a5fa" fontSize="9">Oro</text>
      <text x="362" y="101" fill="#94a3b8" fontSize="9">S&amp;P500</text>
      <text x="40" y="196" fill="#475569" fontSize="8">2001</text>
      <text x="350" y="196" fill="#475569" fontSize="8">2024</text>
      <text x="200" y="212" textAnchor="middle" fill="#475569" fontSize="7">Schema illustrativo — dati reali disponibili su liv-ex.com</text>
    </svg>`,
    deepDive: `Il vino come asset class è ancora sottocompreso dai gestori patrimoniali tradizionali. La letteratura accademica ha studiato il fine wine come investimento almeno dagli anni 2000, con contributi pubblicati su riviste come il Journal of Financial Economics e la Journal of Wine Economics.

La chiave è la liquidità frammentata. A differenza delle azioni, dove un'informazione pubblica viene prezzata in millisecondi, il mercato del vino assorbe l'informazione lentamente. I punteggi dei critici escono con mesi di anticipo rispetto all'asta, i report Liv-ex non sono letti da tutti. Questo può creare finestre di opportunità per chi sa dove guardare.

Ma attenzione: il vino non è una asset class uniforme. I dati aggregati nascondono una dispersione enorme. Bordeaux First Growths hanno un mercato liquido (una cassa si vende in tempi rapidi su Liv-ex), i vini di nicchia no. La liquidità è premium: Mouton Rothschild 2010 si vende sempre. Un Barolo Monfortino Riserva 2006 si vende, ma il mercato è più sottile. Uno Château Musar 1987 è un asset illiquido a tutti gli effetti.

Il secondo concetto critico è il costo del carry. Il costo totale di possesso — storage in bonded warehouse + assicurazione + un'eventuale uscita tramite asta — erode significativamente il rendimento lordo. La quantificazione esatta dipende dal canale e dall'orizzonte temporale, ma è un fattore strutturale da includere in qualsiasi piano di investimento.

La terza dinamica è la concentrazione geografica del volume. Il Bordeaux rappresenta la quota dominante degli scambi su Liv-ex, con la Borgogna al secondo posto. Questo non significa che il Bordeaux sia meglio: significa che il mercato secondario più liquido è quello bordolese. Per orizzonti brevi (3–5 anni) la liquidità conta più del potenziale di apprezzamento.`,
    caseStudies: [
      { wine: "Château Pétrus 2000", buy: null, sell: null, year_buy: 2002, year_sell: 2019, roi: "Esempio illustrativo", note: "Comprato al momento del rilascio, venduto in anticipo rispetto al picco. Illustra il timing imperfetto ma comunque positivo — i prezzi aggiornati di Pétrus sono disponibili su Sotheby's Wine e Liv-ex." },
      { wine: "Romanée-Conti 1990", buy: null, sell: null, year_buy: 2005, year_sell: 2018, roi: "Esempio illustrativo", note: "Annata 1990 sottovalutata al momento dell'acquisto. Parker la rivalutò in una retrospettiva nel 2014. Apprezzamento molto significativo — prezzi aggiornati su Sotheby's." },
    ],
    techniques: [
      "Usa il Liv-ex Market Data come riferimento prezzi primario — non Wine-Searcher che mostra prezzi retail",
      "Calcola sempre il rendimento annualizzato (CAGR) non il rendimento totale per confrontare asset diversi",
      "Tieni conto del costo opportunity: se il capitale è in vino, non è in T-bills al 5%",
      "Diversifica su 3 annate consecutive dello stesso vino — riduce il rischio annata senza ridurre l'esposizione al produttore",
    ],
    exercise: {
      title: "Calcola il CAGR del tuo portfolio ipotetico",
      steps: [
        "Scegli 3 vini del catalogo VinoInvest con price history disponibile",
        "Calcola il CAGR per ciascuno usando la formula: (Prezzo finale / Prezzo iniziale)^(1/anni) - 1",
        "Sottrai il costo annuo di carry stimato (2.5% lordo)",
        "Confronta il CAGR netto con il rendimento del BTP 10y dello stesso periodo",
        "Decidi quale vino ha il miglior risk-adjusted return nel tuo orizzonte",
      ]
    },
    keyPoints: [
      "Il Liv-ex Fine Wine 100 è il principale indice di riferimento del mercato: consulta Liv-ex per le performance aggiornate",
      "Il costo di carry (storage, assicurazione, transazione) erode il rendimento lordo — calcolarlo sempre ex-ante",
      "La selezione dei vini batte l'esposizione generica: pochi produttori generano la maggior parte della performance",
      "Orizzonte minimo raccomandato: 7 anni per assorbire la volatilità short-term",
      "Liquidità ≠ rendimento: il mercato più liquido (Bordeaux) non è necessariamente quello con il maggior potenziale",
    ],
    quiz: [
      { q: "Dove si trovano i dati aggiornati sulle performance del Liv-ex Fine Wine 100?", options: ["Inventati dagli analisti", "Sul sito ufficiale Liv-ex (liv-ex.com)", "Solo su abbonamento Bloomberg", "Parker Wine Advocate"], correct: 1 },
      { q: "Perché il costo di carry riduce il rendimento lordo del fine wine?", options: ["È una tassa governativa", "Comprende storage, assicurazione e commissioni di transazione che si accumulano nel tempo", "È un costo solo per il mercato UK", "Non è significativo su orizzonti lunghi"], correct: 1 },
      { q: "Perché il fine wine ha generalmente bassa correlazione con l'azionario?", options: ["Per legge i due mercati non possono muoversi insieme", "I compratori di fine wine non subiscono margin calls e non esistono ETF che forzino vendite automatiche", "Il fine wine è garantito dallo stato", "Non è vero: la correlazione è alta"], correct: 1 },
      { q: "Quale mercato ha storicamente il maggiore volume di scambi su Liv-ex?", options: ["Borgogna", "Italia", "Bordeaux", "Champagne"], correct: 2 },
      { q: "Quale orizzonte minimo è raccomandato per un investimento enologico 'solido'?", options: ["2 anni", "5 anni", "7 anni", "15 anni"], correct: 2 },
    ],
  },
  {
    id: "rs_02",
    courseId: 11,
    index: 1,
    title: "Bordeaux First Growths: 50 anni di dati",
    duration: 16,
    youtube: null,
    hero: {
      headline: "I 5 First Growths: il benchmark del fine wine investing",
      stat: "Lafite, Margaux, Latour, Mouton e Haut-Brion: i più scambiati su Liv-ex",
      context: "Château Lafite, Margaux, Latour, Mouton Rothschild e Haut-Brion rappresentano la quota dominante del volume Liv-ex. Il loro comportamento storico è il benchmark di riferimento per qualsiasi portafoglio fine wine."
    },
    objectives: [
      "Conoscere la storia di prezzo dei 5 First Growths negli ultimi 50 anni",
      "Capire perché le annate 82, 90, 2000, 2009, 2010 sono i benchmark globali",
      "Identificare la divergenza di performance tra i cinque châteaux",
      "Valutare l'entry point ottimale usando il rapporto prezzo/punteggio",
    ],
    context: "Il sistema di classificazione 1855 è immutato (tranne la promozione di Mouton nel 1973). I 5 First Growths godono di un premium di liquidità e riconoscibilità che nessun altro vino al mondo ha. Questo li rende sia il porto sicuro del fine wine investing che il benchmark contro cui misurare qualsiasi altra scelta.",
    slides: [
      { title: "La classificazione 1855", body: "Commissione imperiale di Napoleone III. Basata su prezzo medio di vendita storico, non su terroir. Immutata da 169 anni — unica eccezione: Mouton Rothschild promosso nel 1973 dopo una campagna di 50 anni del Baron Philippe." },
      { title: "Lafite Rothschild — il re liquido", body: "Volume Liv-ex più alto di qualsiasi altro singolo vino. Lafite 1982 = prima bottiglia a superare £1.000 in asta (Christie's 2010). Domanda asiatica (Cina) ha triplicato i prezzi 2005–2011." },
      { title: "Latour — il player ultra-long", body: "Uscita dal mercato en primeur nel 2012. Vende solo quando ritiene i vini 'pronti'. Conseguenza: scarsità percepita, premium in asta rispetto al momento pre-annuncio. Il mercato ha reagito positivamente alla decisione strategica." },
      { title: "Margaux — il beauty premium", body: "Etichetta più fotografata del mondo (Andy Warhol, 1975). Volatilità più alta rispetto agli altri First Growth — risponde di più alle mode e ai critici. 2009 e 2015 sono considerate tra le annate bandiera." },
      { title: "Mouton Rothschild — l'arte collector", body: "Dal 1945 ogni annata ha un'etichetta di un artista diverso (Dalí, Warhol, Freud, Hirst). L'etichetta artistica crea un premium aggiuntivo sulle annate più iconiche, anche se la quantificazione precisa varia." },
      { title: "Haut-Brion — il value play", body: "Scambia storicamente a sconto rispetto ai peer su Liv-ex pur avendo punteggi simili. Questo è attribuito alla posizione geografica a Pessac, nell'area oggi urbanizzata. Per chi vuole esposizione First Growth con valuation più ragionevole, è considerata la scelta più difensiva." },
      { title: "Le grandi annate: le benchmark riconosciute", body: "Le annate 1982, 1990, 2000, 2009, 2010 sono riconosciute come benchmark dai principali critici internazionali. Le annate 2015 e 2016 sono ancora in fase di maturazione e apprezzamento. I prezzi esatti variano per produttore e canale." },
      { title: "Entry point: prezzo/punteggio", body: "Il rapporto prezzo/punteggio critico è uno strumento per confrontare l'entry point relativo tra First Growths e annate. Haut-Brion storicamente presenta il rapporto più favorevole. I valori esatti cambiano continuamente — consultare Liv-ex per i dati correnti." },
    ],
    mapSvg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" fill="#0b1220"/>
      <text x="200" y="22" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">First Growths — Prezzo medio cassa (2000–2024)</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke="#1e3050" strokeWidth="1"/>
      <line x1="40" y1="40" x2="40" y2="180" stroke="#1e3050" strokeWidth="1"/>
      <polyline points="40,165 90,155 140,130 190,105 240,88 290,72 340,58 370,50" fill="none" stroke="#C9A227" strokeWidth="2"/>
      <polyline points="40,168 90,158 140,135 190,112 240,95 290,78 340,62 370,54" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
      <polyline points="40,170 90,162 140,142 190,122 240,108 290,95 340,82 370,75" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="372" y="54" fill="#C9A227" fontSize="8">Lafite</text>
      <text x="372" y="58" fill="#60a5fa" fontSize="8" dy="10">Latour</text>
      <text x="372" y="79" fill="#4ade80" fontSize="8">HB</text>
      <text x="40" y="196" fill="#475569" fontSize="8">2000</text>
      <text x="355" y="196" fill="#475569" fontSize="8">2024</text>
    </svg>`,
    deepDive: `Il mercato bordolese è governato da due meccanismi che la maggior parte degli investitori non coglie: la domanda cinese come amplificatore ciclico e la politica di rilascio en primeur come segnale di posizionamento.

La Cina ha scoperto Lafite Rothschild nei primi anni 2000, consacrandolo come simbolo di status nelle guanxi business. Dal 2005 al 2011 il prezzo en primeur del Lafite è quintuplicato — non per ragioni qualitative, ma perché i nuovi ricchi cinesi acquistavano casse per regalarle, non per berle. Quando la campagna anti-corruzione di Xi Jinping ha compresso questo mercato nel 2013, i prezzi di Lafite sono tornati ai livelli del 2007. Chi aveva comprato nel 2011 al picco, ha perso il 40%. Chi aveva comprato nel 2005, era comunque in gain del 180%.

La lezione? Non comprare quando tutti parlano di vino nei giornali finanziari. Le storie di "il vino è il nuovo oro" sono quasi sempre segnali di picco ciclic.

Latour ha fatto una mossa strategica brillante nel 2012: ha abbandonato l'en primeur, dichiarando che venderà solo quando i vini saranno pronti a bere (almeno 10–15 anni dopo la vendemmia). Questo ha creato scarsità, aumentato la percezione di esclusività e ridotto la speculazione a breve termine. La conseguenza sul prezzo: +22% nel giro di 18 mesi dall'annuncio, stabilizzazione poi su valori superiori del 15–20% rispetto a prima. Per gli investitori che avevano già Latour in magazzino era un regalo. Per chi voleva comprare en primeur, una porta chiusa.

Haut-Brion è la sorpresa statistica. Ogni analisi risk-adjusted su 20+ anni mostra che Haut-Brion ha prodotto il rendimento per unità di rischio più alto tra i Five. Il motivo: tratta a sconto percettivo (non è sulla riva sinistra 'classica', sta a Pessac nell'area oggi urbanizzata) ma i punteggi sono equivalenti. Per chi ha un budget di €5.000 e vuole esposizione First Growth 'pura', 3 casse di Haut-Brion recente è la scelta più difensiva.`,
    caseStudies: [
      { wine: "Château Lafite 1982", buy: null, sell: null, year_buy: 1984, year_sell: 2014, roi: "Esempio illustrativo", note: "La bottiglia che ha definito l'era moderna del fine wine investing. Parker 100. Apprezzamento eccezionale in 30 anni — prezzi aggiornati su Sotheby's e Christie's." },
      { wine: "Château Latour 2010", buy: null, sell: null, year_buy: 2011, year_sell: 2023, roi: "Esempio illustrativo", note: "En primeur release. L'uscita di Latour dall'EP nel 2012 ha creato scarsità percepita e accelerato l'apprezzamento sul mercato secondario — prezzi aggiornati su Liv-ex." },
    ],
    techniques: [
      "Calcola il rapporto €/punto Parker per confrontare First Growths su base oggettiva",
      "Monitora le spedizioni export dai châteaux — segnale leading del sentiment 6 mesi prima",
      "Compra annate sottovalutate (Parker <97) di First Growths: rischio/rendimento spesso migliore delle 100pt",
      "Haut-Brion offre esposizione First Growth con valuation storicamente più favorevole",
    ],
    exercise: {
      title: "Costruisci un mini-portfolio First Growths con €10.000",
      steps: [
        "Cerca i prezzi attuali delle 5 annate benchmark più recenti (2018–2022) per ogni First Growth",
        "Calcola il rapporto €/punto Parker per ciascuna annata/château",
        "Identifica i 3 con il rapporto più basso (più sottovalutati su base storica)",
        "Alloca: 50% al più sottovalutato, 30% al secondo, 20% al terzo",
        "Stima il rendimento atteso a 10 anni usando il CAGR storico del produttore",
      ]
    },
    keyPoints: [
      "Lafite 1982 è considerato il benchmark dell'era moderna del fine wine investing — il mercato asiatico ne ha amplificato il valore",
      "Latour ha abbandonato en primeur nel 2012 — la scarsità percepita ha creato un premium strutturale",
      "Haut-Brion è storicamente il First Growth con il value play più favorevole su base prezzo/punteggio",
      "Domanda cinese: amplificatore ciclico — i picchi guidati da narrativa mediatica tendono a correggersi",
      "Rapporto prezzo/punto critico: metrica utile per confrontare entry point tra First Growths — dati aggiornati su Liv-ex",
    ],
    quiz: [
      { q: "Quale First Growth ha il volume di scambi più alto su Liv-ex?", options: ["Château Latour", "Château Margaux", "Château Lafite Rothschild", "Château Haut-Brion"], correct: 2 },
      { q: "In quale anno Latour ha abbandonato il mercato en primeur?", options: ["2008", "2010", "2012", "2015"], correct: 2 },
      { q: "Quale evento ha causato la forte correzione del prezzo di Lafite nel 2013?", options: ["Annata deludente", "Uscita di un competitor", "Campagna anti-corruzione in Cina", "Crisi finanziaria europea"], correct: 2 },
      { q: "Quale First Growth è considerato storicamente il value play su base prezzo/punteggio?", options: ["Lafite Rothschild", "Latour", "Mouton Rothschild", "Haut-Brion"], correct: 3 },
      { q: "Perché la domanda cinese è considerata un 'amplificatore ciclico' per il Bordeaux?", options: ["La Cina produce anche First Growth", "Il mercato cinese ha comprato per status e regalo, non solo per consumo — sensibile a variabili politiche", "La Cina ha la maggiore superficie vitata del mondo", "I consumatori cinesi preferiscono i vini dolci"], correct: 1 },
    ],
  },
  // ── Module 3: Borgogna ────────────────────────────────────────────────────────
  {
    id: "rs_03", courseId: 11, index: 2,
    title: "Borgogna: Romanée-Conti vs. Masseto — il duello del decennio",
    duration: 15,
    youtube: null,
    hero: { headline: "Borgogna: scarsità strutturale e domanda globale crescente", stat: "Il Liv-ex Burgundy 150 ha sovraperformato il Bordeaux 500 nell'ultimo decennio", context: "La Borgogna ha superato il Bordeaux come segmento più performante del fine wine negli ultimi 10 anni. Ma il mercato è sottile, i vini scarsi, e comprare al momento sbagliato può costare caro. I dati precisi sono pubblicati da Liv-ex." },
    objectives: ["Capire perché la Borgogna è l'asset class più scarsa al mondo", "Distinguere i Premier Cru dai Grand Cru in termini di rendimento atteso", "Analizzare la struttura del mercato DRC e dei suoi concorrenti", "Identificare i produttori emergenti con il miglior rapporto qualità/prezzo"],
    context: "La Borgogna è definita dalla scarsità assoluta: il Grand Cru Romanée-Conti produce circa 5.000 bottiglie all'anno — meno di qualsiasi singola nave cisterna di vino industriale. Questa scarsità non è marketing: è geologica, climatica e regolamentare.",
    slides: [
      { title: "La gerarchia borgognona", body: "Village → Premier Cru → Grand Cru. 33 Grand Cru in tutta la Côte d'Or. Chablis Grand Cru a parte. Il 2% della superficie produce il 95% del valore d'investimento." },
      { title: "DRC: monopolio e monologo", body: "Domaine de la Romanée-Conti possiede 7 Grand Cru in monopolio o quasi. La Romanée-Conti (1.8 ettari, ~5.500 bt/anno) è il vino più costoso al mondo: €18.000–€40.000/bottiglia al dettaglio." },
      { title: "Il Burgundy 150 Liv-ex", body: "L'indice Liv-ex Burgundy 150 ha sovraperformato il Bordeaux 500 nell'ultimo decennio. Il differenziale è guidato da domanda crescente e offerta strutturalmente limitata. Per i dati aggiornati, consultare liv-ex.com." },
      { title: "Masseto: il Bordeaux borgognone", body: "Masseto (Bolgheri, Italia) è spesso paragonato alla Borgogna per la sua struttura Merlot cru. Il prezzo è cresciuto significativamente nell'ultimo decennio. Capitalizzazione Liv-ex tra le prime 50 etichette mondiali." },
      { title: "I produttori emergenti", body: "Leroux, Dujac, Rossignol-Trapet, Méo-Camuzet: nomi meno noti ma qualità Grand Cru a prezzi Premier Cru. Finestra di acquisto 2–3 anni prima che i critici li scoprano." },
      { title: "Il problema della liquidità", body: "Un Grand Cru Borgogna si vende, ma il mercato è più sottile del Bordeaux. Offerta a distanza: Christie's e Acker hanno aste mensili, ma bid-ask può essere 15–20%. Patience is mandatory." },
      { title: "Clima e cambiamento: il problema e l'opportunità", body: "Le annate 2015, 2017, 2019, 2022 sono eccezionali grazie al riscaldamento globale. Ma il rischio grandine e gelo si è intensificato: 2016 e 2021 hanno visto perdite di produzione del 30–50% in alcune parcelle." },
      { title: "Come comprare Borgogna: le liste en primeur", body: "I negociants (Maison Louis Jadot, Drouhin) rilasciano liste en primeur. I domaines vendono direttamente a clienti fidelizzati. Senza relazioni, si compra al mercato secondario — con premium." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Borgogna vs Bordeaux (Liv-ex 2014–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,150 100,135 160,115 220,90 280,65 340,45 370,38" fill="none" stroke="#C9A227" strokeWidth="2.5"/><polyline points="40,150 100,142 160,132 220,118 280,108 340,100 370,95" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="42" fill="#C9A227" fontSize="9">Borgogna</text><text x="372" y="99" fill="#60a5fa" fontSize="9">Bordeaux</text><text x="40" y="188" fill="#475569" fontSize="8">2014</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `La Borgogna è l'anomalia del mercato del vino: un terroir millenario con offerta fisica impossibile da aumentare, in uno dei contesti di domanda più in crescita al mondo.

Il Grand Cru Romanée-Conti misura 1.813 ettari (meno di 2 ettari). In un'annata normale produce circa 5.500 bottiglie. La matematica è semplice: la domanda cresce strutturalmente, l'offerta non può crescere. Questo è il caso d'investimento da scarsità nella sua forma più pura.

L'indice Liv-ex Burgundy 150 ha significativamente sovraperformato il Bordeaux 500 nell'ultimo decennio. Il differenziale non è casuale: è il prodotto di tre fattori. Primo, il mercato borgognono era sottovalutato rispetto al Bordeaux fino al 2012 — i critici americani storicamente favorivano il Cabernet Sauvignon bordolese. La riabilitazione del Pinot Noir come vino d'investimento è avvenuta lentamente. Secondo, la scoperta della Borgogna da parte dei mercati asiatici (Taiwan, Hong Kong, Singapore) è arrivata in ritardo rispetto al Bordeaux — rappresentando un secondo ciclo di apprezzamento. Terzo, i produttori borgognoni sono stati più lenti nell'aumentare i prezzi en primeur rispetto ai bordolesi — creando un ritardo tra qualità percepita e prezzo di mercato che il mercato secondario ha poi corretto.

Masseto rappresenta un caso studio interessante di come un vino non borgognone possa beneficiare della stessa narrativa. Prodotto nell'azienda Ornellaia di Bolgheri, è un Merlot in purezza invecchiato in barrique — strutturalmente simile a un Pomerol. Il mercato lo ha riconosciuto, e le sue quotazioni Liv-ex sono cresciute significativamente nell'ultimo decennio.

Il rischio principale del segmento borgognone è la liquidità. Il Bordeaux si compra e si vende su Liv-ex in ore. Certi Grand Cru borgognoni hanno bid-ask spread del 15–20%: occorrono settimane per chiudere una transazione a prezzo ottimale. Per chi ha orizzonti brevi (<5 anni) o potrebbe aver bisogno di liquidare rapidamente, questo è un rischio concreto da quantificare nel piano di investimento.`,
    caseStudies: [
      { wine: "DRC La Tâche 2015", buy: null, sell: null, year_buy: 2018, year_sell: 2024, roi: "Esempio illustrativo", note: "Comprata al rilascio, rivalutata in seguito alla critica unanime (Parker 99, Burghound 100). I prezzi esatti variano per canale e condizione — consultare Liv-ex per valori correnti." },
      { wine: "Masseto 2010", buy: null, sell: null, year_buy: 2012, year_sell: 2022, roi: "Esempio illustrativo", note: "Annata iconica di Bolgheri. I prezzi sono aumentati significativamente nell'ultimo decennio. Dati aggiornati disponibili su Liv-ex e Wine-Searcher." },
    ],
    techniques: [
      "Usa l'indice Liv-ex Burgundy 150 come benchmark — non i prezzi retail che sono sempre gonfiati",
      "Prioritizza i domaines piccoli con produzioni <10.000 bt: maggiore scarsità = maggiore potenziale",
      "Per la liquidità: preferisci Chambolle-Musigny e Gevrey-Chambertin dei grandi domaines rispetto a micro-produzioni",
      "Tieni traccia delle allocazioni en primeur — i negociants vendono a lista chiusa e le relazioni contano",
    ],
    exercise: {
      title: "Analizza il rapporto prezzo/scarsità dei Grand Cru",
      steps: [
        "Elenca 5 Grand Cru borgognoni con la produzione annua (in bottiglie) dal sito del produttore",
        "Recupera il prezzo attuale su Liv-ex Market Data o Wine-Searcher",
        "Calcola il rapporto prezzo/produzione (€ per 1.000 bottiglie prodotte)",
        "Confronta con il CAGR 5 anni di ciascun vino su Liv-ex",
        "Identifica quale ha il miglior rendimento/scarsità: il vero 'value in Burgundy'",
      ]
    },
    keyPoints: [
      "Il Liv-ex Burgundy 150 ha sovraperformato il Bordeaux 500 nell'ultimo decennio — i dati aggiornati sono disponibili su liv-ex.com",
      "DRC Romanée-Conti: ~5.500 bt/anno. Domanda globale in crescita strutturale. Offerta fisicamente immutabile",
      "Liquidità più bassa del Bordeaux: bid-ask spread 15–20% su certi Grand Cru",
      "Masseto: proxy borgognono italiano — beneficia della stessa narrativa scarsità/qualità",
      "Produttori emergenti (Leroux, Dujac): finestra di acquisto potenziale 2–3 anni prima della scoperta critica",
    ],
    quiz: [
      { q: "Di quanti ettari è la vigna Grand Cru Romanée-Conti?", options: ["0.85 ha", "1.81 ha", "3.5 ha", "8.2 ha"], correct: 1 },
      { q: "Quale indice Liv-ex monitora le performance del segmento borgognone?", options: ["Bordeaux 500", "Burgundy 150", "Italy 100", "Fine Wine 100"], correct: 1 },
      { q: "Qual è il principale rischio di liquidità della Borgogna?", options: ["Prezzi troppo bassi", "Bid-ask spread 15–20% sul mercato secondario", "Nessuna quotazione Liv-ex", "Produzione eccessiva"], correct: 1 },
      { q: "Masseto è prodotto con quale vitigno?", options: ["Cabernet Sauvignon", "Sangiovese", "Merlot", "Nebbiolo"], correct: 2 },
      { q: "Cosa distingue un domaine da un negociant in Borgogna?", options: ["Il domaine non vende en primeur", "Il negociant acquista uve o vino da terzi e lo commercializza", "Il domaine produce solo rosso", "Non c'è differenza legale"], correct: 1 },
    ],
  },
  // ── Module 4: Italia ──────────────────────────────────────────────────────────
  {
    id: "rs_04", courseId: 11, index: 3,
    title: "Italia: Barolo, Brunello, Sassicaia — il rinascimento dei prezzi",
    duration: 14,
    youtube: null,
    hero: { headline: "Sassicaia 1985: il primo vino italiano a 100pt Parker — un turning point storico", stat: "L'Italy 100 Liv-ex ha registrato una forte crescita nell'ultimo decennio — i dati aggiornati sono su liv-ex.com", context: "L'Italia è passata da 'curiosità regionale' a pilastro del fine wine investing. Tre categorie dominano: Barolo/Barbaresco (Piemonte), Brunello di Montalcino (Toscana), e i Super Tuscans (Sassicaia, Ornellaia, Masseto)." },
    objectives: ["Distinguere i tre macro-segmenti del fine wine italiano per profilo rischio/rendimento", "Analizzare il ruolo dei produttori storici vs. nuovi interpreti", "Capire perché il Brunello 2010 è considerato l'annata del secolo", "Valutare il potenziale della 'prossima generazione' italiana"],
    context: "Il mercato italiano è stato storicamente sottovalutato rispetto a Bordeaux e Borgogna. Il Liv-ex Italy 100 ha registrato una delle performance più forti tra tutti gli indici regionali nell'ultimo decennio. Il catalizzatore: riconoscimento critico internazionale (Parker, Suckling) + domanda asiatica in crescita + scarsità strutturale dei cru storici.",
    slides: [
      { title: "Barolo DOCG: il 'Re dei Vini'", body: "Nebbiolo dalle Langhe, Piemonte. 11 comuni, 2.200 ha totali. I MGA (Mention Geografica Aggiuntiva): Cannubi, Brunate, Rocche dell'Annunziata. Produzione media: 9M bottiglie/anno — piccola rispetto alla domanda crescente." },
      { title: "Le annate chiave del Barolo", body: "1996, 1999, 2001, 2004, 2010, 2016: le 'sei stelle'. 2010 = consenso universale: Parker 99+, Suckling 100, Gambero Rosso 3R. Le annate top hanno visto apprezzamenti significativi — i prezzi aggiornati sono disponibili su Liv-ex e Wine-Searcher." },
      { title: "Brunello di Montalcino", body: "Sangiovese Grosso, 100% varietale. 3.500 ha, ~10M bt/anno. La 'Brunello-gate' del 2008 (aggiunta di altri vitigni) ha temporaneamente depresso i prezzi — poi il rimbalzo. Biondi-Santi Riserva 1955: £74.000/bt a Christie's 2018." },
      { title: "Brunello 2010 — l'annata del secolo", body: "Temperatura ideale, precipitazioni perfette, vendemmia tardiva. Parker ha assegnato 100pt a Soldera, Biondi-Santi Riserva, Ciacci Piccolomini. L'annata 2010 ha visto un apprezzamento molto significativo rispetto ai prezzi di rilascio — i valori aggiornati sono disponibili su Liv-ex." },
      { title: "Sassicaia: il pioniere", body: "Primo vino italiano a 100pt Parker (annata 1985, punteggio assegnato nel 1994). DOC propria: Bolgheri Sassicaia. Cabernet Sauvignon 85% + Cab. Franc 15%. Tra i top-50 Liv-ex per volume di scambi." },
      { title: "Ornellaia e Masseto", body: "Ornellaia: blend bordolese, prezzi più accessibili rispetto a Masseto. Masseto: Merlot in purezza, prezzi nella fascia alta borgognona. Entrambi di proprietà Frescobaldi. Ornellaia Vendemmia d'Artista: etichette di artisti come Mouton — crea un premium sulle edizioni speciali." },
      { title: "I nuovi interpreti: Toscana e Piemonte", body: "Montevertine Le Pergole Torte: Sangiovese puro, apprezzamento significativo nell'ultimo decennio. Bartolo Mascarello Barolo: produzione minuta, liste d'attesa pluriennali. La prossima generazione ha valuation ancora contenuta ma trend critico positivo." },
      { title: "Dove comprare vino italiano", body: "En primeur disponibile per Barolo (Rare Wine Co., BBR), Brunello (Tannico, MWH), Super Tuscans (Millésima). Sul secondario: Liv-ex per le etichette più liquide, Sotheby's per Brunello vintage." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Italy 100 vs Bordeaux 500 (2014–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,155 90,145 150,128 210,108 270,82 330,58 370,44" fill="none" stroke="#4ade80" strokeWidth="2.5"/><polyline points="40,155 90,148 150,137 210,122 270,108 330,98 370,94" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="48" fill="#4ade80" fontSize="9">Italy</text><text x="372" y="98" fill="#60a5fa" fontSize="9">Bord.</text><text x="40" y="188" fill="#475569" fontSize="8">2014</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `Il fine wine italiano ha attraversato una trasformazione radicale negli ultimi vent'anni. Fino ai primi anni 2000, il mercato era dominato dai collezionisti europei con una visione regionale. Il Barolo era apprezzato, ma non trattato come asset class. Il Brunello, nonostante la Brunello-gate del 2008, era poco liquido sul mercato secondario.

Il cambiamento è arrivato da tre direzioni simultanée. Prima: i punteggi Parker e Suckling hanno internazionalizzato la reputazione dei produttori storici, rendendoli riconoscibili da Tokyo a New York. Gaja, Biondi-Santi, Sassicaia sono oggi nomi globali. Secondo: la piattaforma Liv-ex ha creato un mercato secondario trasparente anche per i vini italiani — il Liv-ex Italy 100, lanciato nel 2010, ha dato visibilità quantitativa alla performance. Terzo: la domanda asiatica ha scoperto l'Italia come alternativa al Bordeaux — con il vantaggio di prezzi più accessibili e una narrativa culturale (arte, gastronomia, moda) già profondamente radicata.

Il Brunello 2010 merita un paragrafo separato. Le condizioni climatiche di quell'annata — estate calda ma non torrida, escursione termica autunnale perfetta — hanno prodotto vini di straordinaria concentrazione e freschezza. Tre produttori hanno ricevuto 100 punti su scala internazionale. Il prezzo medio dei Brunello 2010 di primo livello sul mercato secondario è aumentato del 285% tra il 2012 e il 2024. Chi aveva acquistato en primeur ha realizzato ritorni da primo piano. Chi ha aspettato il rilascio in bottiglia ha comunque fatto un ottimo investimento.

La prossima frontiera è la 'nuova generazione': produttori come Montevertine, Fuligni, Lisini stanno ricevendo punteggi sempre più alti con prezzi ancora relativamente contenuti. Questa è la finestra di opportunità: comprare prima che il mercato scopra quello che i critici già sanno.`,
    caseStudies: [
      { wine: "Gaja Sperss Barolo 2010", buy: null, sell: null, year_buy: 2013, year_sell: 2024, roi: "Esempio illustrativo", note: "Comprato al rilascio. Parker 99pt. Annata 2010 rivalutata progressivamente — apprezzamento molto significativo. Prezzi aggiornati su Liv-ex." },
      { wine: "Biondi-Santi Brunello Riserva 1990", buy: null, sell: null, year_buy: 2005, year_sell: 2020, roi: "Esempio illustrativo", note: "Annata 1990 rivalutata da Suckling (100pt nel 2018). Catalizzatore: retrorating — apprezzamento forte. Prezzi aggiornati su Sotheby's e Christie's." },
    ],
    techniques: [
      "Prioritizza le annate 1996, 2001, 2004, 2010, 2016 per Barolo — consenso critico unanime",
      "Per Brunello: compra solo i 'magnifici sei' (Biondi-Santi, Soldera, Ciacci, Poggio di Sotto, Cerbaiona, Casanova di Neri) su annate top",
      "Verifica sempre la catena di custodia (provenance) per Brunello — il mercato è più opaco del Bordeaux",
      "Usa il Liv-ex Italy 100 come benchmark — non i prezzi delle enoteche che includono markup retail",
    ],
    exercise: {
      title: "Costruisci un mini-portfolio italiano da €8.000",
      steps: [
        "Identifica le 3 annate Barolo top degli ultimi 10 anni consultando Liv-ex Market Data",
        "Per ogni annata, confronta prezzi en primeur vs. secondario per Gaja, Conterno, Mascarello",
        "Calcola il CAGR effettivo per chi ha comprato en primeur vs. al rilascio",
        "Alloca il budget: 50% Barolo (2 produttori), 30% Brunello, 20% Super Tuscans",
        "Stima il rendimento atteso a 8 anni usando trend Liv-ex Italy 100",
      ]
    },
    keyPoints: [
      "L'Italy 100 Liv-ex è tra gli indici regionali più performanti dell'ultimo decennio — i dati aggiornati sono su liv-ex.com",
      "Il Brunello 2010 è considerato 'l'annata del secolo' con punteggi perfetti da più critici — apprezzamento molto significativo",
      "Sassicaia è il primo vino italiano a 100pt Parker (annata 1985) — tra i top per volume su Liv-ex",
      "Nuovi interpreti (Montevertine, Fuligni): potenziale finestra di acquisto prima della piena scoperta critica",
      "Verifica sempre la provenance: mercato meno trasparente di Bordeaux/Borgogna",
    ],
    quiz: [
      { q: "Quale annata del Brunello è considerata 'del secolo' per il consenso critico?", options: ["2004", "2007", "2010", "2015"], correct: 2 },
      { q: "Il Sassicaia ha quale DOC propria?", options: ["Chianti Classico DOC", "Bolgheri Sassicaia DOC", "Toscana IGT", "Vino Nobile di Montepulciano"], correct: 1 },
      { q: "Quale vitigno caratterizza il Sassicaia?", options: ["Sangiovese", "Cabernet Sauvignon (con Cab. Franc)", "Merlot", "Nebbiolo"], correct: 1 },
      { q: "Cosa ha causato la 'Brunello-gate' del 2008?", options: ["Annata pessima", "Sospetti di aggiunta di vitigni non autorizzati", "Fallimento di produttori", "Normativa EU restrittiva"], correct: 1 },
      { q: "Quale vitigno è Masseto?", options: ["Sangiovese", "Cabernet Sauvignon", "Merlot", "Syrah"], correct: 2 },
    ],
  },
  // ── Module 5: Champagne ────────────────────────────────────────────────────────
  {
    id: "rs_05", courseId: 11, index: 4,
    title: "Champagne come asset class — il caso Cristal e Krug",
    duration: 13,
    youtube: null,
    hero: { headline: "Il Champagne di prestige: da consumo di lusso ad asset quotato su Liv-ex", stat: "Il Champagne 50 Liv-ex monitora i millesimi di prestige — i dati aggiornati sono su liv-ex.com", context: "Il Champagne è entrato nell'orbita del fine wine investing solo negli ultimi 10 anni. Prima era 'consumo di lusso'. Oggi Cristal, Krug, Dom Pérignon P2 e Salon sono asset quotati su Liv-ex." },
    objectives: ["Capire perché il Champagne è diventato asset class solo di recente", "Analizzare i driver di prezzo per le cuvée di prestige", "Identificare le annate e i formati con il miglior potenziale", "Valutare i rischi specifici: corretta conservazione, mercato degli NV"],
    context: "Il Champagne ha una struttura di mercato unica: il 95% della produzione è Non-Vintage (NV), mescolato da centinaia di annate. Solo le cuvée di prestige millesimate (Cristal, Dom Pérignon, Krug Vintage, Salon, Belle Époque) sono asset investibili. La scarsità è estrema: Salon produce solo in annate eccezionali — 37 millesimi in 100 anni.",
    slides: [
      { title: "Il mercato del Champagne: struttura", body: "NV (Non-Vintage): 85% della produzione, non investibile. Vintage: 10%, investibile per le grandi maisons. Prestige Cuvée: 5%, core del fine wine Champagne. Solo 8–10 etichette hanno mercato Liv-ex liquido." },
      { title: "Cristal Louis Roederer", body: "Creato nel 1876 per lo Zar Alessandro II (bottiglia trasparente anti-bomba). Oggi la cuvée di prestige più quotata per volume Liv-ex. I prezzi delle annate top hanno mostrato forte apprezzamento sul mercato secondario — valori aggiornati disponibili su Liv-ex." },
      { title: "Krug: il 'Grande Marque' degli intenditori", body: "Krug Grande Cuvée: NV, ma invecchiato 6+ anni. Krug Vintage: solo in grandi annate. Krug 1996: considerato il vertice del decennio per struttura e longevità. I prezzi sul mercato secondario variano — consultare Wine-Searcher per i valori correnti." },
      { title: "Dom Pérignon e le edizioni P2/P3", body: "DP standard: buono ma poco liquido per investimento. DP P2 (seconda plenitude, 15+ anni): mercato collezionisti attivo con prezzi significativamente superiori al DP standard. DP P3 (25+ anni): estremamente raro, prezzi da Borgogna." },
      { title: "Salon Le Mesnil — la rarità assoluta", body: "Solo Blanc de Blancs (Chardonnay 100%). Solo annate eccezionali: 37 rilasci in 100 anni. Ultimo millesimo rilasciato: 2012. Produzione: ~60.000 bt per annata. Le annate top hanno mostrato apprezzamento tra i più forti del segmento Champagne." },
      { title: "Formati: i Magnum come premium", body: "Magnum (150cl) matura più lentamente — vino migliore e mercato collezionisti attivo. Il premium di prezzo del Magnum su Liv-ex: mediamente +35–45% vs. bt standard. Jeroboam e Mathusalem: mercato più sottile." },
      { title: "Annate chiave del Champagne", body: "1996: teso, acido, minerale — il vertice critico del decennio. 2002: rotondo, complesso — il preferito dei collezionisti. 2004: tardivo ma eccellente. 2008: strutturato, alta acidità — perfetto per invecchiamento. 2012: caldo, opulento." },
      { title: "Il rischio della conservazione", body: "Il Champagne è più delicato del vino rosso: luce, temperatura e vibrazioni lo degradano rapidamente. Comprare solo da wine merchants certificati o direttamente dalla maison. Le bottiglie mal conservate perdono il 40–60% del valore." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Champagne 50 Liv-ex (2019–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,150 100,138 160,120 220,98 280,72 330,52 370,42" fill="none" stroke="#f9a8d4" strokeWidth="2.5"/><text x="372" y="46" fill="#f9a8d4" fontSize="9">Champ</text><text x="40" y="188" fill="#475569" fontSize="8">2019</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `La storia del Champagne come asset class è recente e interessante. Fino al 2018, i sommelier e i collezionisti consideravano il Champagne un prodotto di consumo — anche quello di prestige. L'idea di comprare Cristal per rivenderlo era insolita. Poi sono successe tre cose.

Primo: Liv-ex ha introdotto l'indice Champagne 50 nel 2019, dando visibilità quantitativa a un mercato che esisteva ma era informale. Secondo: la pandemia ha accelerato l'interesse per gli asset alternativi — i prezzi dei grandi vini fermi erano già alti, e il Champagne di prestige sembrava undervalued. Terzo: i mercati asiatici (Singapore, Hong Kong, Giappone) hanno scoperto il Champagne come status symbol aggiuntivo rispetto al Bordeaux.

Il risultato: l'indice Champagne 50 ha registrato una performance molto forte nei primi anni dalla sua introduzione, superando in certi periodi sia il Bordeaux 500 sia il Burgundy 150. Tuttavia questo confronto è parzialmente fuorviante: il punto di partenza era basso, e la volatilità è stata alta. I dati aggiornati sono disponibili su liv-ex.com.

Il mercato del Champagne ha struttura diversa da quello del vino fermo. Le cuvée di prestige hanno quantità prodotte significativamente maggiori di un Grand Cru borgognone: Cristal produce circa 300.000 bottiglie per annata, Salon solo circa 60.000. Questo significa che la liquidità è buona per Cristal, accettabile per Krug, sottile per Salon. Il bid-ask su Liv-ex per il Champagne è mediamente più alto che per i First Growth bordolesi — dato rilevante per chi pianifica orizzonti brevi.

Salon Le Mesnil rimane il caso più estremo: 37 annate in 100 anni, nessuna di "convenienza". La scarsità è assoluta, la domanda crescente. Tra tutti i Champagne quotati su Liv-ex, Salon ha mostrato storicamente tra le performance più alte — consultare i dati Liv-ex per i valori aggiornati.`,
    caseStudies: [
      { wine: "Cristal Louis Roederer 2002", buy: null, sell: null, year_buy: 2005, year_sell: 2020, roi: "Esempio illustrativo", note: "Annata 2002: consenso critico unanime. Il mercato asiatico ha amplificato la domanda. Apprezzamento molto significativo — prezzi aggiornati su Liv-ex e Wine-Searcher." },
      { wine: "Salon Le Mesnil 1996", buy: null, sell: null, year_buy: 2010, year_sell: 2024, roi: "Esempio illustrativo", note: "Scarsità estrema: circa 60.000 bt prodotte. Tra le performance più forti del segmento Champagne — dati aggiornati su Liv-ex." },
    ],
    techniques: [
      "Compra solo cuvée millesimate di prestige: Cristal, Krug Vintage, Salon, Dom Pérignon P2",
      "Privilegia i Magnum: +35–45% di premium su Liv-ex rispetto alla bottiglia standard",
      "Le annate 1996, 2002, 2008, 2012 sono i benchmark — compra solo quelle per investimento",
      "Verifica la conservazione: il Champagne degradato perde il 50% del valore. Compra solo da merchants certificati",
    ],
    exercise: {
      title: "Confronto rendimento Champagne vs. Bordeaux equivalente",
      steps: [
        "Cerca il prezzo attuale di Cristal 2008 e Château Margaux 2008 su Liv-ex o Wine-Searcher",
        "Calcola il CAGR di entrambi dal prezzo en primeur al prezzo corrente",
        "Analizza la liquidità: quante transazioni/mese registra ciascuno su Liv-ex?",
        "Stima il costo di carry differenziale (lo Champagne richiede stoccaggio a temperatura costante)",
        "Concludi: quale ha il miglior risk-adjusted return per un orizzonte 5 anni?",
      ]
    },
    keyPoints: [
      "Il Champagne 50 Liv-ex ha registrato performance forti dal 2019 — i dati aggiornati sono su liv-ex.com",
      "Solo 8–10 etichette millesimate di prestige hanno mercato Liv-ex liquido",
      "Salon Le Mesnil: 37 annate in 100 anni, scarsità assoluta — tra le performance più forti del segmento",
      "Il formato Magnum matura più lentamente e ottiene generalmente un premium rispetto alla bottiglia standard",
      "Rischio conservazione: Champagne mal stoccato perde una quota significativa del valore",
    ],
    quiz: [
      { q: "Quante annate ha prodotto Salon Le Mesnil nei suoi 100 anni di storia?", options: ["22", "37", "56", "68"], correct: 1 },
      { q: "Quale indice Liv-ex copre il mercato del Champagne?", options: ["Bordeaux 500", "Champagne 50", "Sparkling 100", "Fine Wine 1000"], correct: 1 },
      { q: "Perché il formato Magnum è preferito per il fine wine da investimento?", options: ["Costa meno", "Matura più lentamente e ottiene un premium sul mercato secondario", "È più facile da stoccare", "Ha meno bollicine"], correct: 1 },
      { q: "Quale Champagne è stato creato originariamente per lo Zar di Russia?", options: ["Krug Grande Cuvée", "Dom Pérignon", "Cristal Louis Roederer", "Belle Époque Perrier-Jouët"], correct: 2 },
      { q: "Dom Pérignon P2 differisce dal DP standard per:", options: ["Vitigno diverso", "Invecchiamento aggiuntivo di 15+ anni (seconda plenitude)", "Maggiore dosage", "Produzione limitata a 1.000 bt"], correct: 1 },
    ],
  },
  // ── Module 6: Vini dolci ───────────────────────────────────────────────────────
  {
    id: "rs_06", courseId: 11, index: 5,
    title: "Vini dolci: Château d'Yquem e Tokaj Eszencia",
    duration: 12,
    youtube: null,
    hero: { headline: "Yquem 1811: battuto a Sotheby's per un prezzo record nel 2011. La longevità è valore", stat: "Château d'Yquem: unico Premier Cru Supérieur in Sauternes — categoria creata appositamente per esso", context: "I grandi vini dolci sono il segmento più longevo del fine wine: Yquem 1811 è ancora bevibile e collezionato. La scarsità è creata dalla produzione: una bottiglia per vite (Yquem) nelle migliori annate." },
    objectives: ["Capire la struttura produttiva unica di Yquem e Tokaj", "Analizzare perché la longevità è un vantaggio competitivo in questo segmento", "Identificare le annate d'investimento vs. le annate di consumo", "Valutare il mercato dei Tokaj Eszencia come opportunità emergente"],
    context: "Château d'Yquem è l'unico Premier Cru Supérieur nella classificazione del 1855 — una categoria creata appositamente per esso. Il Tokaj Eszencia ungherese è il vino più denso al mondo: 600–900 g/litro di zucchero residuo. Entrambi invecchiano per secoli, non decenni.",
    slides: [
      { title: "Château d'Yquem: il più raro dei rari", body: "152 ha in Sauternes. La botrytis cinerea (muffa nobile) concentra gli zuccheri. Vendemmia: passo per passo, solo gli acini perfetti. In anni ordinari: 1 bt per vite. Anni difficili: produzione zero (1992, 2012)." },
      { title: "Le grandi annate di Yquem", body: "1811 (il 'miracolo'), 1921, 1937, 1967, 1976, 1986, 1988, 1989, 1990, 2001, 2009. Yquem 2001 ha ricevuto 100 punti da Parker. Le annate storiche raggiungono prezzi molto elevati in asta — consultare Sotheby's Wine e Christie's per i valori di mercato aggiornati." },
      { title: "Il meccanismo di prezzo di Yquem", body: "Produzione limitata (75.000 bt/anno in buone annate). Nessun secondo vino per gli annate dichiarate 'insufficienti'. Il brand è intoccabile: LVMH proprietario dal 1999, investimento di €25M in cantina." },
      { title: "Tokaj Eszencia: densità liquida", body: "Solo Ungheria, solo Tokaj-Hegyalja. 600–900 g/l di zucchero residuo — non si fermenta quasi per nulla. Alcool 2–4%. Invecchia 200+ anni. Royal Tokay 6-puttonyos e Eszencia: mercato collezionisti mondiale." },
      { title: "Tokaj come opportunità di investimento", body: "Prezzi significativamente più bassi di Yquem con qualità paragonabile nelle annate top (1993, 2000, 2007, 2013). La penetrazione nei mercati Asia e USA è ancora limitata — finestra di arbitraggio geografico." },
      { title: "Sauternes beyond Yquem", body: "Premiers Crus: Rieussec, Suduiraut, Guiraud, Climens (Barsac). Prezzi 30–50% sotto Yquem, qualità eccellente nelle top annate. Rieussec 2001: €90/bt — vs. €600/bt per Yquem 2001." },
      { title: "Il mercato secondario dei dolci", body: "Più sottile di Bordeaux secco. Principali canali: Sotheby's e Christie's Wine Auctions. Liv-ex ha poca liquidità per i dolci. Pre-asta: stima e vendita richiedono 3–6 mesi. Formati grandi (75cl, 375ml) con dinamiche diverse." },
      { title: "Storage dei vini dolci", body: "Temperature basse (10–12°C), umidità alta (70–80%), buio assoluto. I tappi dei dolci degradano più lentamente per via dello zucchero. Bottiglie da 375ml (mezza bottiglia) invecchiano più velocemente — preferirebbe il formato 75cl." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Yquem prezzi per annata (2001–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><circle cx="80" cy="155" r="3" fill="#C9A227"/><circle cx="120" cy="148" r="3" fill="#C9A227"/><circle cx="160" cy="100" r="5" fill="#C9A227"/><circle cx="200" cy="130" r="3" fill="#C9A227"/><circle cx="240" cy="115" r="4" fill="#C9A227"/><circle cx="280" cy="88" r="4" fill="#C9A227"/><circle cx="320" cy="68" r="3" fill="#C9A227"/><circle cx="360" cy="55" r="4" fill="#C9A227"/><text x="155" y="95" fill="#C9A227" fontSize="8">2001★</text><text x="40" y="188" fill="#475569" fontSize="8">2001</text><text x="350" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `I vini dolci rappresentano l'estremo opposto del mercato fine wine: massima longevità, minima liquidità, massima rarità nelle top annate. Comprendere questo segmento richiede un cambio di paradigma rispetto ai vini secchi.

Château d'Yquem è il caso più studiato. L'unico Premier Cru Supérieur del 1855 — una classificazione creata appositamente da Napoleone III perché Yquem non aveva eguali. La sua produzione è determinata dalla natura: anni di grandine, pioggia o freddo eccessivo portano al rilascio di un "Yquem Y" (il suo vino bianco secco) o, nelle annate peggiori, nulla. Il 1992 e il 2012 non esistono come Yquem Sauternes.

Questa unpredictability crea scarsità non gestita, che è più potente della scarsità strategica. Non si può aumentare la produzione acquistando più vigneti — la botrytis richiede condizioni micrometeorologiche specifiche della parcella. Il Sauternes è una delle due AOC al mondo (con la Borgogna) dove la geologia e il microclima sono non replicabili.

Il Tokaj Eszencia merita attenzione speciale. Si tratta del vino più denso fisicamente al mondo: la sua concentrazione zuccherina è così alta che il processo di fermentazione si arresta naturalmente con un alcool di 2–4%. Storicamente consumato dalla nobiltà europea come farmaco e simbolo di status (Voltaire lo chiamava il 're dei vini'). Il Royal Tokay 6-puttonyos Aszú e le Eszencia delle annate 1993, 2000, 2007 sono stati rivalutati dalla critica internazionale ma il mercato secondario è ancora sottosviluppato — un'opportunità per chi ha pazienza e un orizzonte di 15+ anni.`,
    caseStudies: [
      { wine: "Château d'Yquem 2001", buy: null, sell: null, year_buy: 2003, year_sell: 2022, roi: "Esempio illustrativo", note: "Parker 100pt. L'annata del millennio per Sauternes. Apprezzamento molto significativo rispetto al prezzo di rilascio. Prezzi aggiornati su Sotheby's Wine e Christie's." },
      { wine: "Royal Tokay Aszú 6 Puttonyos 1993", buy: null, sell: null, year_buy: 2000, year_sell: 2021, roi: "Esempio illustrativo", note: "Annata 1993 rivalutata. Mercato sottile ma in crescita in Asia. Il Tokaj è ancora un mercato emergente — opportunità per chi ha pazienza." },
    ],
    techniques: [
      "Per Yquem: compra solo annate con Parker ≥96 — la dispersione tra annate è enorme",
      "Il formato 75cl supera il 375ml per longevità e valore di rivendita",
      "Tokaj Eszencia: acquista direttamente dai produttori (Royal Tokay, Oremus) — mercato secondario quasi inesistente",
      "Prioritizza la conservazione: i vini dolci sono molto sensibili alle variazioni termiche",
    ],
    exercise: {
      title: "Analisi rendimento Yquem per annata",
      steps: [
        "Recupera i prezzi di rilascio en primeur di Yquem 1996, 2001, 2009 da fonti storiche (Decanter archive)",
        "Confronta con i prezzi attuali su Sotheby's Wine Estimate o Liv-ex",
        "Calcola il CAGR per ciascuna annata",
        "Identifica quale annata ha il maggior potenziale residuo basandoti sulle comparables storiche",
        "Valuta se il costo di carry a 20 anni giustifica il rendimento atteso",
      ]
    },
    keyPoints: [
      "Yquem: unico Premier Cru Supérieur — categoria creata appositamente per esso nel 1855",
      "Yquem 2001 Parker 100: apprezzamento molto significativo rispetto al prezzo di rilascio en primeur",
      "Tokaj Eszencia: 600–900 g/l zucchero residuo, invecchia 200+ anni, mercato ancora sottosviluppato",
      "Formato 75cl superiore al 375ml per rivendita e conservazione",
      "Liquidità limitata: canale principale sono le aste (Sotheby's, Christie's), non Liv-ex",
    ],
    quiz: [
      { q: "Quante bottiglie produce Château d'Yquem per ettaro nelle annate normali?", options: ["Una bottiglia per vite", "100 bottiglie per ettaro", "500 bottiglie per ettaro", "1.000 bottiglie per ettaro"], correct: 0 },
      { q: "Cosa è il Tokaj Eszencia?", options: ["Un Champagne ungherese", "Il vino con la più alta concentrazione zuccherina al mondo (600–900 g/l)", "Un vino rosso da dessert", "Un distillato di grappa"], correct: 1 },
      { q: "Perché Yquem 1811 è considerato un caso straordinario nella storia del fine wine?", options: ["Fu il primo vino en primeur", "Stabilì un record d'asta per un vino del XIX secolo e dimostrò l'eccezionale longevità di Yquem", "Fu il primo 100 punti Parker", "È il vino più prodotto in assoluto"], correct: 1 },
      { q: "Cosa è la botrytis cinerea?", options: ["Un insetto parassita della vite", "La muffa nobile che concentra gli zuccheri nell'uva", "Una malattia batterica", "Un tipo di lievito indigeno"], correct: 1 },
      { q: "In quali anni Château d'Yquem NON ha prodotto Sauternes?", options: ["1989 e 1990", "1992 e 2012", "2000 e 2001", "2005 e 2008"], correct: 1 },
    ],
  },
  // ── Module 7: Rhône Valley ─────────────────────────────────────────────────────
  {
    id: "rs_07", courseId: 11, index: 6,
    title: "Rhône Valley: Hermitage e Châteauneuf-du-Pape — il dormiente svegliato",
    duration: 13,
    youtube: null,
    hero: { headline: "Il Rodano: da 'terzo mercato' a asset class emergente nel fine wine francese", stat: "I vini del Rodano Nord come Hermitage invecchiano 40+ anni — la longevità è un vantaggio strutturale", context: "La Valle del Rodano è stata storicamente il 'terzo' mercato del fine wine francese, dopo Bordeaux e Borgogna. Ma i suoi vini longevi e sottovalutati hanno attirato l'attenzione degli investitori dal 2010." },
    objectives: ["Distinguere Rodano Nord (Syrah) da Rodano Sud (Grenache blend) come asset class", "Analizzare il ruolo di Robert Parker nel creare valore per l'Hermitage", "Identificare i produttori chiave di entrambe le zone", "Capire perché il Châteauneuf-du-Pape è il 'value play' del Rodano"],
    context: "Il Rodano Nord produce alcune delle Syrah più longeve al mondo: Hermitage e Côte-Rôtie invecchiano 30–50 anni. Il Rodano Sud è dominato dal Grenache: il Châteauneuf-du-Pape ha 13 vitigni autorizzati ma i top produttori usano 1–3. Scarsità strutturale: Hermitage è solo 136 ettari totali.",
    slides: [
      { title: "Hermitage: 136 ha di Syrah leggendaria", body: "La collina di Hermitage sovrasta Tain l'Hermitage. 136 ha totali di vigna. I 'lieux-dits': Bessards, Meal, Greffieux, Les Diognières. Chapoutier, Chave, Paul Jaboulet sono i produttori di riferimento. Longeva: 40+ anni nelle grandi annate." },
      { title: "Jean-Louis Chave: il benchmark", body: "Hermitage Rouge di Chave: 15.000–25.000 bt/anno (tutte le parcelle blended). Il vino ha registrato apprezzamenti molto significativi nell'ultimo decennio. Il blanc di Chave: ancora più raro e apprezzato dai collezionisti." },
      { title: "Chapoutier Le Pavillon", body: "Hermitage Le Pavillon: monoparcel (Bessards), 100% Syrah. Parker lo ha punteggiato 100 due volte: nel 1990 e nel 2010. Ogni retrorating ha prodotto apprezzamento significativo nel mercato secondario nei mesi successivi." },
      { title: "Côte-Rôtie: Syrah con eleganza", body: "Côte Brune + Côte Blonde: diversità di terroir in una piccola AOC. E. Guigal La Landonne, La Mouline, La Turque: le 'tre La'. Parker ha assegnato punteggi perfetti per molte annate consecutive. Le 'tre La' hanno mostrato apprezzamenti molto forti nel mercato secondario." },
      { title: "Châteauneuf-du-Pape: il gigante del Sud", body: "3.200 ha, 13 vitigni autorizzati. Grenache dominante. I top: Rayas (leggendario, produzione minuta), Pegaü, Vieux Télégraphe, Beaucastel. Il gap tra prezzo en primeur e mercato secondario è tra i più alti del fine wine per Rayas." },
      { title: "Château Rayas: la leggenda schiva", body: "Emmanuel Reynaud: il produttore più reticente del Rodano. Solo Grenache, 30% di resa. Rayas è una delle cuvée con il maggiore gap tra prezzo en primeur e mercato secondario: 500–700% di apprezzamento nelle grandi annate." },
      { title: "Le annate chiave", body: "Rodano Nord: 1990, 1999, 2003, 2009, 2010, 2017. Rodano Sud: 1989, 1990, 1998, 2007, 2010, 2016. Le annate calde favoriscono il Grenache (Châteauneuf), le annate fresche la Syrah (Hermitage, Côte-Rôtie)." },
      { title: "Mercato secondario del Rodano", body: "Più sottile di Bordeaux e Borgogna. Principali canali: Liv-ex per Guigal 'tre La' e Chave, aste per Rayas e Bonneau. Liquidità buona per le etichette Parker-certified, sottile per i produttori minori." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Rhône fine wine prezzi 2010–2024</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,155 90,148 150,135 210,112 270,85 330,62 370,50" fill="none" stroke="#f97316" strokeWidth="2.5"/><polyline points="40,158 90,150 150,140 210,122 270,100 330,80 370,68" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="54" fill="#f97316" fontSize="9">N.Rhône</text><text x="372" y="72" fill="#94a3b8" fontSize="9">S.Rhône</text><text x="40" y="188" fill="#475569" fontSize="8">2010</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `Il Rodano rappresenta uno dei casi più interessanti di rivalutazione nel mercato del fine wine: un'intera regione che è passata da "buon rapporto qualità/prezzo" a "asset class emergente" nel giro di 15 anni, guidata quasi interamente dall'influenza di un singolo critico.

Robert Parker ha "scoperto" il Rodano in due momenti distinti. La prima volta negli anni '80, quando ha assegnato punteggi straordinari all'Hermitage 1990 di Chave e al Châteauneuf-du-Pape Rayas. La seconda volta nel 2010–2012, quando ha rivalutato un'intera serie di annate precedenti che aveva sottovalutato nella sua prima analisi. Ogni retrorating di Parker ha prodotto un aumento immediato e sostanziale dei prezzi nel mercato secondario.

Questo fenomeno "retrorating" è peculiare del mercato del vino e non ha equivalenti in altri mercati finanziari. La letteratura accademica ha quantificato l'effetto Parker: un aumento nel punteggio critico corrisponde mediamente a un aumento del prezzo d'asta, con un effetto non-lineare sopra una certa soglia. Per chi monitora le retrorating, si crea una finestra di acquisto anticipatorio nei mesi precedenti alla pubblicazione.

La Valle del Rodano ha un vantaggio strutturale rispetto alla Borgogna: i suoi vini longevi (Hermitage invecchia 40+ anni) hanno un "valore residuo" molto alto anche dopo 20 anni dalla vendemmia. Un Hermitage di grande annata degli anni '80 è ancora vivissimo oggi — e il suo prezzo continua a crescere perché le bottiglie in circolazione diminuiscono mentre la domanda da collezione aumenta.`,
    caseStudies: [
      { wine: "Chapoutier Hermitage Le Pavillon 2010", buy: null, sell: null, year_buy: 2012, year_sell: 2024, roi: "Esempio illustrativo", note: "Parker 100pt. La retrorating nel 2012 ha catalizzato un apprezzamento molto significativo. Prezzi aggiornati su Liv-ex e Wine-Searcher." },
      { wine: "Château Rayas Châteauneuf-du-Pape 1998", buy: null, sell: null, year_buy: 2003, year_sell: 2022, roi: "Esempio illustrativo", note: "Annata 1998 considerata tra le migliori del decennio per Grenache. Produzione minuta — tra i gap en primeur/secondario più alti nel fine wine. Prezzi aggiornati in asta." },
    ],
    techniques: [
      "Segui le retrorating dei critici principali: ogni aumento sopra 95 punti produce mediamente un apprezzamento significativo nel mercato secondario",
      "Per il Rodano Nord: Chave e Chapoutier sono i riferimenti Liv-ex — alta liquidità relativa",
      "Per Châteauneuf-du-Pape: Rayas, Pegaü Cuvée Réservée, Vieux Télégraphe La Crau",
      "Le annate calde (2003, 2009, 2016) favoriscono il Grenache — le fresche (1999, 2010) la Syrah",
    ],
    exercise: {
      title: "Analisi Parker effect sul prezzo Rodano",
      steps: [
        "Identifica 3 vini del Rodano che hanno ricevuto retrorating Parker tra 2010 e 2020",
        "Confronta il prezzo pre- e post-retrorating usando Liv-ex o Wine-Searcher storico",
        "Calcola la percentuale di apprezzamento nei 12 mesi successivi alla retrorating",
        "Verifica se il trend si è mantenuto o è stato seguito da una correzione",
        "Concludi: esiste una finestra di acquisto ottimale prima/dopo la pubblicazione di una retrorating?",
      ]
    },
    keyPoints: [
      "Hermitage: 136 ha totali — una delle AOC più piccole di Francia con mercato globale",
      "Chapoutier Le Pavillon 2010: apprezzamento molto significativo dopo il 100pt Parker — esempio di effetto retrorating",
      "Rayas Châteauneuf-du-Pape: gap en primeur/secondario tra i più alti nel fine wine",
      "Le retrorating dei critici principali sono segnali d'acquisto anticipatori — il mercato tende a reagire nei mesi successivi",
      "Liquidità: buona per Guigal 'tre La' su Liv-ex; sottile per Rayas e Bonneau (aste)",
    ],
    quiz: [
      { q: "Quanti ettari totali ha l'AOC Hermitage?", options: ["48 ha", "136 ha", "380 ha", "1.200 ha"], correct: 1 },
      { q: "Quante volte Parker ha assegnato 100 punti a Chapoutier Hermitage Le Pavillon?", options: ["Mai", "Una volta (1990)", "Due volte (1990 e 2010)", "Tre volte"], correct: 2 },
      { q: "Quale vitigno domina la produzione di Rayas Châteauneuf-du-Pape?", options: ["Syrah", "Mourvèdre", "Grenache", "Cinsault"], correct: 2 },
      { q: "L'AOC Châteauneuf-du-Pape autorizza quanti vitigni?", options: ["3", "7", "13", "18"], correct: 2 },
      { q: "In quale periodo climatico le annate fredde favoriscono la Syrah del Rodano Nord?", options: ["Non esiste differenza", "Le annate fresche favoriscono la Syrah (Hermitage, Côte-Rôtie)", "Le annate calde favoriscono la Syrah", "Solo l'esposizione conta, non la temperatura"], correct: 1 },
    ],
  },
  // ── Module 8: Nuovi Mondi ─────────────────────────────────────────────────────
  {
    id: "rs_08", courseId: 11, index: 7,
    title: "Nuovi Mondi: Napa, Mendoza, Barossa — dove il potenziale è più alto",
    duration: 14,
    youtube: null,
    hero: { headline: "Screaming Eagle 1992: uno dei record d'asta più clamorosi della storia di Napa Valley", stat: "Napa Valley è oggi il terzo mercato per volumi Liv-ex dopo Bordeaux e Borgogna", context: "I 'Nuovi Mondi' del fine wine hanno sfidato il dominio europeo negli ultimi 30 anni. Napa Valley è oggi il terzo mercato per volumi Liv-ex dopo Bordeaux e Borgogna. Mendoza e Barossa seguono." },
    objectives: ["Analizzare il profilo rischio/rendimento dei top producer californiani", "Capire il meccanismo delle mailing list per i cult wines di Napa", "Identificare le opportunità emergenti in Argentina e Australia", "Confrontare la liquidità New World vs. Europa su Liv-ex"],
    context: "Il mercato fine wine californiano è strutturalmente diverso dall'Europa: niente classificazioni storiche, ma mailing list, allocazioni e liste d'attesa pluriennali. I Cult Cabernets di Napa (Screaming Eagle, Harlan, Bryant Family) hanno creato un mercato parallel system dove chi non è sulla lista paga il doppio sul secondario.",
    slides: [
      { title: "Napa Valley: la struttura del mercato", body: "AVA: Oakville, Rutherford, Stags Leap, Howell Mountain. Cab. Sauvignon dominante. Il 'Judgment of Paris' 1976 ha legittimato Napa. Oggi: 450+ produttori, ma solo ~30 hanno mercato secondario liquido." },
      { title: "I Cult Cabernets: Screaming Eagle, Harlan, Bryant", body: "Screaming Eagle: 6.000 bt/anno, lista d'attesa 6 anni. Harlan Estate: 2.000 casse. Bryant Family: chiuso in esclusiva. Sul secondario: prezzi 3–5x rispetto alla mailing list price." },
      { title: "Opus One: il ponte tra Mouton e Mondavi", body: "Joint venture Rothschild + Mondavi dal 1979. 30.000 casse/anno — molto più liquido dei cult wines. Mercato Liv-ex con buona profondità. Meno premium dei cult ma accessibile a un pubblico più ampio." },
      { title: "Ridge Monte Bello: il benchmark del valore", body: "Cabernet Sauvignon da Monte Bello (Santa Cruz Mountains). Invecchiamento 25+ anni. Al 'Paris Tasting 2006' (30° anniversario) ha vinto. Prezzo contenuto (€60–100) vs. qualità: gap da sfruttare." },
      { title: "Mendoza (Argentina): Malbec come investimento", body: "Achaval Ferrer Finca Bella Vista: il Malbec più quotato su Liv-ex. Catena de Cruce de los Andes: collaborazione Cheval Blanc + Terrazas. Prezzi bassi, qualità alta, mercato secondario nascente — finestra aperta." },
      { title: "Barossa Valley (Australia): Shiraz longeva", body: "Penfolds Grange: il grande classico australiano. Parker 100 ripetute. Ha mostrato apprezzamento molto significativo negli ultimi 15 anni. Henschke Hill of Grace: produzione 3.000 bt, premium sempre crescente." },
      { title: "Cile emergente: Colchagua e Apalta", body: "Almaviva (Mouton + Concha y Toro): il più liquido su Liv-ex. Don Melchor Cabernet Sauvignon ha ricevuto punteggi crescenti da Suckling. Prezzi ancora contenuti rispetto agli equivalenti europei — il 'momento Sassicaia' del Cile è una possibilità." },
      { title: "Liquidità New World su Liv-ex", body: "Napa: buona per Screaming Eagle, Harlan, Opus One. Australia: Penfolds Grange ha il mercato più liquido fuori Europa. Argentina/Cile: mercati in sviluppo — spread bid/ask ancora ampi. Strategia: compra per hold, non per flip a breve." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">New World fine wine performance (2014–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,152 90,143 150,128 210,108 270,86 330,64 370,52" fill="none" stroke="#ef4444" strokeWidth="2.5"/><polyline points="40,156 90,149 150,137 210,124 270,108 330,95 370,88" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="56" fill="#ef4444" fontSize="9">Napa</text><text x="372" y="92" fill="#22d3ee" fontSize="9">Barossa</text></svg>`,
    deepDive: `Il mercato del fine wine del Nuovo Mondo ha attraversato una legittimazione accelerata negli ultimi 30 anni, guidata da tre eventi storici: il Judgment of Paris del 1976, le retrorating di Parker negli anni '90 e la crescita del mercato asiatico che ha cercato alternative ai prezzi sempre più alti di Bordeaux e Borgogna.

Il caso Napa è il più strutturato. I Cult Cabernets — Screaming Eagle, Harlan Estate, Bryant Family, Colgin — hanno creato un sistema economico parallelo basato sulle mailing list. Il meccanismo è semplice ma potente: sei anni di attesa per essere aggiunti alla lista, poi accesso annuale a un'allocazione limitata a prezzi "corretti". Sul mercato secondario, le stesse bottiglie valgono immediatamente 3–5x il prezzo della mailing list.

Per Screaming Eagle, questo significa: il prezzo mailing list è circa $350/bottiglia per l'annata recente. Sul secondario, la stessa bottiglia vale $1.200–2.000 al momento del rilascio. Non c'è nessun mercato europeo con un gap simile tra prezzo di emissione e prezzo secondario immediato.

Il Cile merita attenzione speciale. Il mercato fine wine cileno è oggi dove era l'Italia nel 2005: qualità riconosciuta dalla critica internazionale (Almaviva, Don Melchor, Clos Apalta ricevono punteggi crescenti), prezzi ancora non allineati, distribuzione globale ancora incompleta. Quando il mercato asiatico "scoprirà" il Cile come ha scoperto l'Italia, i prezzi si adegueranno rapidamente. La finestra di acquisto a prezzi correnti è ancora aperta.`,
    caseStudies: [
      { wine: "Penfolds Grange Shiraz 2008", buy: null, sell: null, year_buy: 2012, year_sell: 2024, roi: "Esempio illustrativo", note: "Parker 99pt. L'australiano più consistente su Liv-ex — apprezzamento molto significativo nell'ultimo decennio. Prezzi aggiornati su Liv-ex." },
      { wine: "Almaviva Cabernet Sauvignon 2013", buy: null, sell: null, year_buy: 2015, year_sell: 2024, roi: "Esempio illustrativo", note: "Joint venture Mouton Rothschild. Il cileno più liquido su Liv-ex — apprezzamento significativo rispetto al prezzo di rilascio. Prezzi aggiornati su Wine-Searcher." },
    ],
    techniques: [
      "Per Napa Cult: iscriviti alle mailing list (Screaming Eagle, Harlan) — l'unico modo di comprare a prezzo equo",
      "Penfolds Grange: acquistalo al rilascio in Australia (A$700–800) prima della distribuzione europea (€1.200+)",
      "Cile: Almaviva e Don Melchor hanno la migliore liquidità su Liv-ex per il Nuovo Mondo Sud America",
      "Evita il flip a breve per il New World: spread bid/ask su Liv-ex ancora ampi per la maggior parte dei vini",
    ],
    exercise: {
      title: "Analisi mailing list vs. secondario Napa Valley",
      steps: [
        "Verifica il prezzo corrente di Screaming Eagle su Wine-Searcher (secondario)",
        "Stima il prezzo mailing list basandoti su fonti pubbliche (Wine Spectator, Decanter)",
        "Calcola il premium secondario immediato in percentuale",
        "Confronta con il premium secondario dei First Growth bordolesi en primeur vs. secondario",
        "Concludi: la struttura mailing list crea valore unico vs. il sistema en primeur europeo?",
      ]
    },
    keyPoints: [
      "Screaming Eagle: 6.000 bt/anno, lista d'attesa pluriennale, secondario 3–5x mailing list",
      "Penfolds Grange: il benchmark australiano su Liv-ex — forte apprezzamento negli ultimi 15 anni",
      "Don Melchor (Cile): punteggi critici crescenti, prezzi ancora contenuti rispetto ai comparabili europei",
      "Ridge Monte Bello: gap qualità/prezzo potenzialmente estremo — ancora relativamente sottovalutato vs. Napa cult",
      "New World spread bid/ask su Liv-ex ancora ampio: strategia hold, non flip",
    ],
    quiz: [
      { q: "Screaming Eagle produce circa quante bottiglie per annata?", options: ["600 bt", "6.000 bt", "60.000 bt", "600.000 bt"], correct: 1 },
      { q: "Chi ha fondato Opus One?", options: ["Robert Mondavi e Gallo", "Mouton Rothschild e Mondavi", "Screaming Eagle e Caymus", "Harlan e Bryant"], correct: 1 },
      { q: "Cosa è il 'Judgment of Paris' del 1976?", options: ["Una classifica Liv-ex storica", "Un tasting cieco dove i vini californiani hanno battuto i francesi", "Il primo vintage di Opus One", "Una sentenza EU sui vini di Napa"], correct: 1 },
      { q: "Penfolds Grange è prodotto in quale regione australiana?", options: ["Hunter Valley", "Barossa Valley e McLaren Vale", "Margaret River", "Yarra Valley"], correct: 1 },
      { q: "Quale cileno è il più liquido su Liv-ex?", options: ["Montes Alpha M", "Almaviva", "Clos Apalta", "Casa Lapostolle"], correct: 1 },
    ],
  },
  // ── Module 9: En Primeur ───────────────────────────────────────────────────────
  {
    id: "rs_09", courseId: 11, index: 8,
    title: "En Primeur: come funziona il mercato futures del vino",
    duration: 16,
    youtube: null,
    hero: { headline: "2009 Bordeaux EP: uno dei momenti più profittevoli nella storia del fine wine investing", stat: "2005 Bordeaux: riconosciuto come il miglior EP dell'era moderna. Lafite 2005 ha visto un apprezzamento eccezionale", context: "L'En Primeur è il sistema di pre-vendita del vino ancora in botte, tipicamente 18–24 mesi prima del rilascio in bottiglia. Nato a Bordeaux, si è esteso a Borgogna, Rodano e alcune regioni italiane." },
    objectives: ["Capire la meccanica completa del sistema En Primeur bordolese", "Analizzare quando il EP è conveniente vs. quando è una trappola", "Identificare le annate EP migliori degli ultimi 30 anni", "Calcolare il rendimento aggiustato per i costi di carry e il rischio di controparte"],
    context: "Il sistema EP di Bordeaux funziona attraverso una catena: produttore → négociant (les grandes maisons come CVBG, Millésima) → wine merchant → consumatore finale. I produttori rilasciano le loro allocazioni a prezzi 'EP' che possono essere molto sotto il prezzo futuro di mercato, oppure sopra di esso.",
    slides: [
      { title: "Come funziona l'En Primeur", body: "Aprile/Maggio: i 'primeurs' — degustazione dei vini da botte. Giugno: le châteaux rilasciano il prezzo EP. 12–18 mesi dopo: i wine merchants comprano. 3 anni dopo il millesimo: il vino arriva in bottiglia. L'investitore compra in step 2, riceve in step 4." },
      { title: "La catena di distribuzione", body: "Négociants (Millésima, CVBG, Joanne, Duclot): intermediari chiave. Wine merchants (BBR, Justerini & Brooks, Farr Vintners): vendono ai consumatori finali. Il gap tra prezzo négociant e wine merchant: tipicamente 15–25%." },
      { title: "Le annate EP leggendarie", body: "2000: millennio, Parker entusiasta. 2005: qualità universalmente riconosciuta — la migliore EP moderna. 2009 e 2010: due vintage eccezionali consecutivi, un caso unico. 2016: il 'secondo 2009'. Non tutti i millesimi meritano l'EP." },
      { title: "Quando l'EP è conveniente", body: "Solo quando: 1) l'annata è oggettivamente eccezionale (Parker ≥96 su +80% dei châteaux). 2) il prezzo EP è sotto il mercato secondario delle annate precedenti simili. 3) hai liquidità immobilizzata per 4–5 anni. Anni mediocri a prezzi aggressivi: trappola." },
      { title: "Il caso 2011–2014: la trappola EP", body: "Annate buone ma non eccezionali, con prezzi EP gonfiati dal successo del 2009–2010. Chi ha comprato EP 2011 Lafite a €300/bt ha visto il secondario scendere a €180. La lezione: il prezzo EP non è mai garantito in guadagno." },
      { title: "Calcolare il rendimento EP reale", body: "Prezzo EP (bottiglia) + 20% merchant fee + duty + VAT + storage (£14.40/cassa/anno x 3 anni) = costo reale. Il guadagno si calcola su questo totale, non sul solo prezzo EP. Un EP a €100/bt diventa €140+ di costo reale dopo tutti i costi." },
      { title: "En Primeur Borgogna e Rodano", body: "Borgogna EP: meno strutturato, solo alcuni négociants (Jadot, Bouchard) offrono futures. Il vantaggio è minore — le produzioni piccole rendono i prezzi EP solo leggermente sotto il secondario. Rodano EP: disponibile per Chapoutier, Guigal, Jaboulet — conveniente per le grandi annate." },
      { title: "Rischio di controparte", body: "Il merchant EP potrebbe fallire prima della consegna — il vino è ancora 'in botte' al produttore. Soluzioni: scegli merchants con bond account (fondi segregati), preferisci i 'big names' (BBR, Justerini). Chiedi sempre: 'Is this purchased in bond?'" },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">EP price vs. secondary market — Lafite millesimi</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><rect x="60" y="140" width="20" height="30" fill="#3b82f6" opacity="0.8"/><rect x="83" y="100" width="20" height="70" fill="#4ade80" opacity="0.8"/><rect x="120" y="130" width="20" height="40" fill="#3b82f6" opacity="0.8"/><rect x="143" y="108" width="20" height="62" fill="#4ade80" opacity="0.8"/><rect x="180" y="60" width="20" height="110" fill="#3b82f6" opacity="0.8"/><rect x="203" y="44" width="20" height="126" fill="#4ade80" opacity="0.8"/><rect x="240" y="80" width="20" height="90" fill="#3b82f6" opacity="0.8"/><rect x="263" y="70" width="20" height="100" fill="#4ade80" opacity="0.8"/><text x="70" y="188" fill="#475569" fontSize="8">2005</text><text x="130" y="188" fill="#475569" fontSize="8">2009</text><text x="190" y="188" fill="#475569" fontSize="8">2010</text><text x="250" y="188" fill="#475569" fontSize="8">2016</text><text x="320" y="155" fill="#3b82f6" fontSize="8">■ EP price</text><text x="320" y="167" fill="#4ade80" fontSize="8">■ Secondary</text></svg>`,
    deepDive: `L'En Primeur è probabilmente il meccanismo più frainteso nel fine wine investing. È contemporaneamente il modo più efficace per acquistare grandi vini a prezzi equi nelle annate eccezionali, e una delle trappole più pericolose nei millesimi medi.

La logica dell'EP è semplice: il produttore rilascia il vino prima che sia pronto, a un prezzo che riflette la liquidità immediata e il rischio dell'acquirente. In buone annate, questo prezzo è inferiore a quello che il vino varrà una volta imbottigliato e distribuito. In annate ordinarie, il produttore può fissare prezzi ambiziosi sperando che la reputazione dell'annata precedente trascini le vendite.

Il 2009 è il caso paradigmatico. Lafite Rothschild 2009 è stato rilasciato in EP a un prezzo che, nel giro di 18 mesi, era già significativamente superato dal mercato secondario — prima ancora che il vino fosse imbottigliato. Chi ha comprato EP e rivenduto alla consegna ha realizzato un rendimento lordo molto significativo in meno di due anni. I dati precisi variano per canale e timing.

Ma il 2011 ha insegnato la lezione opposta. Annata buona ma non eccezionale, prezzi EP fissati a livelli aggressivi sull'onda del successo del 2009. Il secondario è poi sceso significativamente rispetto al prezzo EP. Perdita netta per chi aveva acquistato. Il meccanismo EP non è mai un investimento sicuro: è una scommessa condizionata alla qualità dell'annata, alla disciplina del produttore sui prezzi, e all'evoluzione del sentiment di mercato.`,
    caseStudies: [
      { wine: "Pétrus En Primeur 2009", buy: null, sell: null, year_buy: 2010, year_sell: 2014, roi: "Esempio illustrativo", note: "EP al rilascio. Venduto all'imbottigliamento. Rendimento netto molto significativo — il 2009 EP è il caso paradigmatico del sistema En Primeur che funziona. Prezzi aggiornati su Liv-ex." },
      { wine: "Lafite Rothschild En Primeur 2011", buy: null, sell: null, year_buy: 2012, year_sell: 2016, roi: "Perdita netta", note: "Annata sopravvalutata, prezzi EP aggressivi. Il mercato secondario è sceso sotto il prezzo EP. Lezione classica della trappola EP." },
    ],
    techniques: [
      "Compra EP solo in annate con Parker ≥96 su +80% dei châteaux — le annate mediocri a prezzi aggressivi sono trappole",
      "Calcola sempre il costo reale: prezzo EP + merchant fee 20% + storage 3 anni + duty/VAT",
      "Privilegia i merchants con bond account segregato — protezione da rischio fallimento",
      "Le annate 2005, 2009, 2010, 2016, 2022 sono le EP dell'era moderna — benchmark di confronto",
    ],
    exercise: {
      title: "Calcola il rendimento reale di un EP Bordeaux 2016",
      steps: [
        "Trova il prezzo EP 2016 di Léoville Barton (disponibile su Decanter archive o Liv-ex)",
        "Aggiungi: merchant fee 18%, duty UK (£10/bottiglia per wine >9% abv), VAT 20% se applicabile",
        "Aggiungi il costo di storage: £14.40/cassa/anno x 4 anni (2016–2020)",
        "Confronta con il prezzo secondario attuale su Liv-ex o Wine-Searcher",
        "Calcola l'IRR (Internal Rate of Return) dell'investimento EP",
      ]
    },
    keyPoints: [
      "EP conviene solo in annate eccezionali (consenso critico unanime) — le annate mediocri a prezzi aggressivi sono trappole",
      "Costo reale EP = prezzo + merchant fee + duty + VAT + storage per gli anni di attesa",
      "2009 Bordeaux: il caso paradigmatico dell'EP che funziona — rendimento netto molto significativo per chi ha venduto alla consegna",
      "2011 Bordeaux: esempio classico di trappola EP — prezzi aggressivi su annata non eccezionale, perdita netta",
      "Rischio controparte: scegli merchants con bond account — il vino è 'tuo' ma ancora in botte",
    ],
    quiz: [
      { q: "Cosa significa acquistare un vino 'En Primeur'?", options: ["Comprare direttamente in cantina", "Comprare il vino ancora in botte, prima dell'imbottigliamento", "Comprare solo vini premium", "Comprare in anticipo per festività"], correct: 1 },
      { q: "Quale annata EP è considerata la migliore dell'era moderna?", options: ["2000", "2005", "2009", "2010"], correct: 1 },
      { q: "Qual è il costo di storage in bonded warehouse a Londra per cassa/anno?", options: ["£5.40", "£10.20", "£14.40", "£22.00"], correct: 2 },
      { q: "La catena EP Bordeaux passa attraverso quale figura chiave?", options: ["Il sommelier", "Il négociant", "Il critico Parker", "Il broker Liv-ex"], correct: 1 },
      { q: "Cosa è il 'bond account' in un wine merchant EP?", options: ["Un conto in valuta estera per vini importati", "Fondi segregati che proteggono l'acquirente da fallimento del merchant", "Un deposito cauzionale per aste online", "Un'assicurazione obbligatoria sul vino"], correct: 1 },
    ],
  },
  // ── Module 10: Aste internazionali ────────────────────────────────────────────
  {
    id: "rs_10", courseId: 11, index: 9,
    title: "Aste internazionali: Christie's, Sotheby's, Acker — meccanismi e arbitraggi",
    duration: 15,
    youtube: null,
    hero: { headline: "Il gap geografico tra aste: stesso vino, prezzi diversi a Londra, Hong Kong e New York", stat: "Le principali case d'asta: Sotheby's, Christie's, Acker, Hart Davis Hart — ognuna con specializzazione geografica", context: "Le aste internazionali di fine wine sono il canale principale per bottiglie rare e grandi formati. Capire la struttura dei costi e i meccanismi delle aste è essenziale per massimizzare il rendimento in vendita." },
    objectives: ["Analizzare la struttura delle commissioni nei principali auction house", "Capire quando vendere in asta vs. sul mercato Liv-ex", "Identificare gli arbitraggi tra diverse piazze d'asta (Londra, New York, Hong Kong)", "Valutare il rischio di provenance e come mitigarlo"],
    context: "Le case d'asta applicano buyer's premium (12–25% sul hammer price) e seller's commission (5–15%). La geografia conta: vini francesi vendono meglio a Londra e Hong Kong, vini californiani a New York, vini italiani a Milano e Londra. Il gap geografico crea opportunità di arbitraggio.",
    slides: [
      { title: "Le principali case d'asta", body: "Sotheby's Wine: la più antica (1970). Christie's Wine: fondata nel 1766. Acker Merrall: specializzata Borgogna. Hart Davis Hart (Chicago): Bordeaux. Spectrum (New York): California. WineBid: online-only, commissioni più basse." },
      { title: "Struttura delle commissioni", body: "Buyer's premium: 20–25% sul hammer price (Sotheby's: 22.5%). Seller's commission: 10–15% sul hammer price. Total friction: 30–40%. Implicazione: compra in asta solo se rivendi entro 5 anni con apprezzamento >40% netto." },
      { title: "Il processo d'asta", body: "Consignment: 2–3 mesi prima dell'asta. Stima: the house valuta le bottiglie. Reserve: il prezzo minimo segreto del venditore. Hammer price: l'offerta vincente. La vendita si formalizza 7 giorni dopo. Pagamento: 30–45 giorni." },
      { title: "Arbitraggio geografico", body: "Romanée-Conti e Borgogna top: prezzi più alti a Hong Kong (+8–15% vs. Londra). Napa Cult Cabernets: prezzi più alti a New York. Barolo e Super Tuscans: Londra e Milano. Comprare sul mercato più basso, vendere su quello più alto: l'arbitraggio base." },
      { title: "Provenance: il rischio più alto", body: "Bottiglie senza provenance documentata perdono il 20–40% del valore in asta. Fill level, capsule intatta, etichetta pulita: i tre check visuali. La casa d'asta non garantisce l'autenticità — fa 'reasonable checks'. La responsabilità è del compratore." },
      { title: "Grandi formati: Magnum, Jeroboam, Imperiale", body: "Magnum (1.5L): +30–50% vs. 2 bottiglie standard. Jeroboam (3L): premium variabile. Imperiale (6L): mercato molto sottile, vendite lente. Il premio di formato scende con le dimensioni oltre il Magnum." },
      { title: "WineBid e le aste online", body: "WineBid.com: la principale asta online USA. Commissioni: 12–18% buyer, 10% seller. Vantaggio: accesso a venditori privati USA con stock importanti. Svantaggio: meno verifiche sulla provenance vs. Christie's/Sotheby's." },
      { title: "Come partecipare a un'asta", body: "1. Registrati online (fotocopia ID, carta di credito). 2. Richiedi il catalogo e stima. 3. Visita il pre-auction preview (fondamentale per Sotheby's Londra). 4. Fai offerta online, telefonica o in sala. 5. Pagamento entro 7 giorni dal hammer." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Commissioni asta: buyer + seller (totale friction)</text><rect x="60" y="80" width="60" height="80" fill="#ef4444" opacity="0.8" rx="4"/><rect x="150" y="90" width="60" height="70" fill="#f97316" opacity="0.8" rx="4"/><rect x="240" y="100" width="60" height="60" fill="#eab308" opacity="0.8" rx="4"/><rect x="330" y="70" width="40" height="90" fill="#ef4444" opacity="0.7" rx="4"/><text x="90" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle">Sotheby's</text><text x="180" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle">Christie's</text><text x="270" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle">WineBid</text><text x="350" y="178" fill="#94a3b8" fontSize="9" textAnchor="middle">Acker</text><text x="90" y="74" fill="#e2e8f0" fontSize="9" textAnchor="middle">~38%</text><text x="180" y="84" fill="#e2e8f0" fontSize="9" textAnchor="middle">~35%</text><text x="270" y="94" fill="#e2e8f0" fontSize="9" textAnchor="middle">~28%</text><text x="350" y="64" fill="#e2e8f0" fontSize="9" textAnchor="middle">~40%</text></svg>`,
    deepDive: `Le aste di fine wine sono il mercato più trasparente per i vini rari, ma anche quello con i costi di transazione più alti. Capire la struttura delle commissioni è prerequisito per qualsiasi calcolo di rendimento.

Il meccanismo è questo: quando un vino viene battuto all'asta a €1.000, il compratore paga €1.225 (€1.000 + 22.5% buyer's premium, come da struttura Sotheby's London 2024). Il venditore riceve €870 (€1.000 - 13% seller's commission). Il gap tra quanto paga il compratore e quanto riceve il venditore è €355 — un terzo del prezzo di transazione va alla casa d'asta. Questo è il motivo per cui le aste sono efficienti solo per vini rari con domanda competitiva e per vendite di valore alto.

Il confronto con Liv-ex è rilevante. Su Liv-ex, un venditore paga una commissione annuale di membership (circa £300–500) e poi una transazione fee di circa 1–2% per trade. Per chi ha grandi volumi o vini liquidi, Liv-ex è molto più efficiente. Per chi ha vini rari (Romanée-Conti, Screaming Eagle) che non hanno abbastanza offerte quotidiane su Liv-ex, l'asta è l'unico venue con abbastanza domanda competitiva.

L'arbitraggio geografico è uno dei concetti meno discussi ma più rilevanti. Il DRC La Tâche vende a prezzi consistentemente più alti (+12–15%) a Hong Kong rispetto a Londra, perché la domanda asiatica per la Borgogna è più competitiva. I Napa Cult Cabernets valgono più a New York che a Londra, perché il collezionismo californiano è concentrato negli USA. Chi ha accesso a più piazze può comprare a Londra e vendere a Hong Kong, catturando lo spread geografico.`,
    caseStudies: [
      { wine: "DRC Romanée-Conti 2015 OWC 6bt", buy: null, sell: null, year_buy: 2018, year_sell: 2023, roi: "Esempio illustrativo", note: "Comprato Christie's Londra, venduto Sotheby's Hong Kong. Esempio di arbitraggio geografico: la DRC ottiene prezzi più alti a Hong Kong rispetto a Londra per effetto della domanda asiatica." },
      { wine: "Pétrus 1982 (3 bottiglie)", buy: null, sell: null, year_buy: 2005, year_sell: 2022, roi: "Esempio illustrativo", note: "Provenance documentata: cantina privata originale. Il premium per provenance documentata è stato stimato dagli esperti d'asta nel range 20–25% vs. bottiglie senza storia verificabile." },
    ],
    techniques: [
      "Calcola sempre il break-even con la friction totale (~35–40%): il vino deve apprezzare di almeno il 40% per coprire i costi",
      "Partecipa al pre-auction preview: fondamentale per verificare fill level e provenance prima di fare offerta",
      "Confronta il prezzo hammer + buyer's premium con Liv-ex bid: spesso Liv-ex è più efficiente per vini liquidi",
      "Arbitraggio geografico: studia i prezzi comparativi per la tua categoria tra Londra, Hong Kong e New York",
    ],
    exercise: {
      title: "Simulazione acquisto e rivendita in asta",
      steps: [
        "Scegli un vino quotato su Sotheby's prossima asta (usa il catalogo online sothebys.com/wine)",
        "Calcola il prezzo totale = hammer price stimato + 22.5% buyer's premium",
        "Confronta con il prezzo bid attuale su Liv-ex per lo stesso vino",
        "Se decidi di comprare, pianifica il canale di rivendita ottimale tra 3–5 anni",
        "Calcola il rendimento necessario per coprire tutti i costi (buyer + seller + storage)",
      ]
    },
    keyPoints: [
      "Friction totale aste: 35–40% — break-even richiede apprezzamento di almeno il 40% netto",
      "Arbitraggio geografico: DRC +12–15% a Hong Kong vs. Londra; Napa Cult +10–18% a New York",
      "Provenance documentata: premium del 20–25% in asta vs. bottiglie senza storia",
      "Grandi formati: Magnum vale +30–50% vs. 2 bt standard — il miglior formato per asta",
      "Pre-auction preview: partecipare fisicamente è fondamentale per verificare la provenance",
    ],
    quiz: [
      { q: "Se un vino viene battuto a €1.000, quanto paga il compratore da Sotheby's (22.5% buyer's premium)?", options: ["€1.000", "€1.100", "€1.225", "€1.400"], correct: 2 },
      { q: "Quale categoria di vini ottiene prezzi significativamente più alti a Hong Kong?", options: ["Napa Valley Cab", "Borgogna DRC e Premier Cru", "Champagne NV", "Brunello di Montalcino"], correct: 1 },
      { q: "Cosa è il 'hammer price' in un'asta?", options: ["Il prezzo di partenza", "L'offerta vincente (prima dei premium)", "Il prezzo finale incluse le commissioni", "La stima pre-asta"], correct: 1 },
      { q: "Perché la 'provenance' è così importante nelle aste?", options: ["Solo per motivi legali", "Le bottiglie con storia documentata valgono il 20–25% in più", "È richiesta dalla legge", "Determina il vintage"], correct: 1 },
      { q: "Qual è il formato che ottiene il premium proporzionale più alto in asta?", options: ["375ml (mezza bottiglia)", "1.5L (Magnum)", "3L (Jeroboam)", "6L (Imperiale)"], correct: 1 },
    ],
  },
  // ── Module 11: Indici Liv-ex ──────────────────────────────────────────────────
  {
    id: "rs_11", courseId: 11, index: 10,
    title: "Leggere gli indici Liv-ex: Bordeaux 500, Burgundy 150, Italy 100",
    duration: 13,
    youtube: null,
    hero: { headline: "Italy 100 ha sovraperformato il Bordeaux 500 per 4 anni consecutivi (2020–2024)", stat: "Liv-ex Fine Wine 1000: l'indice principale. 1000 vini, 24 regioni, massima liquidità", context: "Il London International Vintners Exchange (Liv-ex) è il principale marketplace B2B del fine wine. I suoi indici sono il benchmark universale per misurare la performance del mercato, come il FTSE o l'S&P 500." },
    objectives: ["Capire la struttura e la metodologia degli indici Liv-ex principali", "Analizzare la composizione del Bordeaux 500, Burgundy 150, Italy 100", "Usare gli indici come benchmark per il proprio portfolio", "Identificare divergenze tra indici come segnale di rotazione settoriale"],
    context: "Liv-ex pubblica oltre 20 indici diversi. I principali: Fine Wine 100 (100 vini più liquidi), Fine Wine 1000 (benchmark ampio), Bordeaux 500, Burgundy 150, Italy 100, Champagne 50, Power 100 (i più influenti per volume). Gli indici sono calcolati sul prezzo medio ponderato dei trade reali — non stime.",
    slides: [
      { title: "Fine Wine 100: il benchmark principale", body: "100 vini con maggiore liquidità su Liv-ex. Dominato da Bordeaux (70%), con Borgogna e Champagne. Calcolato su prezzi di trade reali, non stime. Il '100' è spesso citato come proxy del mercato fine wine globale." },
      { title: "Fine Wine 1000: la visione ampia", body: "1000 vini da 24 regioni. Il più diversificato. Pubblicato mensilmente. Componenti: Bordeaux 500 (50%), Burgundy 150 (15%), Champagne 50 (5%), Italy 100 (10%), altre regioni (20%). Il benchmark per chi investe in più categorie." },
      { title: "Bordeaux 500: il cuore del mercato", body: "500 vini bordolesi: i 5 First Growth per 20 vintage + classificati storici. Ponderato per volume di trade. Il Bordeaux 500 ha subito una significativa correzione tra 2011 e 2014 (la 'correzione asiatica') — la maggiore drawdown dell'era moderna." },
      { title: "Burgundy 150: il mercato più volatile", body: "150 vini borgognoni: DRC, Leroy, Rousseau, Raveneau, altri top. Alta volatilità rispetto agli altri indici. La bassa liquidità amplifica i movimenti — sia al rialzo che al ribasso. Dati aggiornati su liv-ex.com." },
      { title: "Italy 100: il segmento con il trend più forte", body: "100 vini italiani: Barolo, Brunello, Super Tuscans. Creato nel 2010. Ha sovraperformato il Bordeaux 500 per anni consecutivi di recente. La crescita strutturale è guidata da riconoscimento critico + domanda asiatica." },
      { title: "Champagne 50: il newcomer", body: "50 Champagne di prestige. Creato nel 2019. Ha registrato forte performance nei primi anni. Volatilità: media. Il segmento più 'giovane' degli indici Liv-ex — dati storici limitati, interpretare con cautela." },
      { title: "Come leggere un indice Liv-ex", body: "Baseline: 100 al 2004 per la maggior parte degli indici. Un indice a 450 = +350% dalla baseline. Check mensili: confronta la performance del tuo portfolio vs. l'indice di riferimento. Se sei sotto, analizza il perché." },
      { title: "Rotazione settoriale: quando gli indici divergono", body: "Quando Italy 100 sale e Bordeaux 500 scende: il mercato sta 'ruotando' verso l'Italia. Segnale per il portfolio: aumenta l'esposizione al segmento in outperformance. Come per i settori azionari, ma più lento e meno volatile." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Indici Liv-ex comparati (2010 = 100)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,130 90,115 140,90 180,105 230,85 280,68 330,52 370,44" fill="none" stroke="#a78bfa" strokeWidth="2.5"/><polyline points="40,130 90,118 140,100 180,112 230,98 280,88 330,78 370,72" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6 2"/><polyline points="40,130 90,122 140,110 180,108 230,92 280,76 330,60 370,50" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 4"/><text x="372" y="48" fill="#a78bfa" fontSize="8">Burg150</text><text x="372" y="76" fill="#60a5fa" fontSize="8">Bord500</text><text x="372" y="54" fill="#4ade80" fontSize="8">Ita100</text></svg>`,
    deepDive: `Gli indici Liv-ex sono lo strumento di misurazione più accurato disponibile per il mercato fine wine. A differenza delle stime delle case d'asta o dei listini dei wine merchants, gli indici Liv-ex sono calcolati su prezzi di trade reali — ogni transazione che avviene sulla piattaforma aggiorna il calcolo.

La comprensione degli indici parte dalla loro metodologia. Il Fine Wine 1000 include 1000 vini da 24 regioni, ponderati per volume di trade. Questo significa che i vini più liquidi (Lafite, Mouton, Romanée-Conti DRC) hanno un peso maggiore nell'indice. Un movimento del DRC La Tâche influenza il Burgundy 150 molto più di un piccolo Bourgogne Rouge.

La divergenza tra indici è il segnale più utile per un investitore attivo. Quando il Burgundy 150 sovraperforma il Bordeaux 500, il mercato sta allocando più capitale verso la Borgogna — segnale che il prezzo della Borgogna è in fase di apprezzamento relativo. Se possiedi sia Bordeaux che Borgogna, puoi ribilanciare il portfolio in risposta a questi segnali.

L'Italy 100 ha dimostrato una forte crescita strutturale negli anni recenti, sovraperformando il Bordeaux 500 per periodi consecutivi. Questo non è casuale: riflette il crescente riconoscimento critico dei vini italiani, la domanda asiatica emergente e la percezione di sottovalutazione relativa rispetto a Borgogna e Bordeaux. I dati aggiornati sono disponibili su liv-ex.com.`,
    caseStudies: [
      { wine: "Portfolio diversificato Bordeaux/Borgogna 2016", buy: null, sell: null, year_buy: 2016, year_sell: 2023, roi: "Esempio illustrativo", note: "Ribilanciamento basato su segnali di divergenza indici. Sovrappeso Italy 100 dal 2020 — ha contribuito a sovraperformare il solo Bordeaux." },
      { wine: "Solo Bordeaux 500 portfolio 2011–2014", buy: null, sell: null, year_buy: 2011, year_sell: 2014, roi: "Perdita significativa", note: "Il Bordeaux 500 ha subito una forte correzione in questo periodo. La diversificazione avrebbe mitigato la perdita." },
    ],
    techniques: [
      "Usa il Fine Wine 1000 come benchmark mensile del tuo portfolio — se underperformi per 6 mesi, rivedi l'allocazione",
      "Monitora le divergenze tra Italy 100 e Bordeaux 500 — segnale di rotazione settoriale",
      "Il Burgundy 150 è ad alta volatilità: usa stop-loss concettuale se la concentrazione supera il 40% del portfolio",
      "Liv-ex pubblica i dati gratuitamente in forma aggregata mensile — iscriviti alla newsletter liv-ex.com",
    ],
    exercise: {
      title: "Costruisci il tuo indice portfolio personalizzato",
      steps: [
        "Lista tutti i vini nel tuo portfolio (o in quello simulato del modulo 15)",
        "Assegna a ciascuno l'indice Liv-ex di riferimento (Italy 100, Bordeaux 500, ecc.)",
        "Scarica l'andamento mensile degli indici da liv-ex.com (dati pubblici)",
        "Confronta la performance del tuo portfolio con la composizione pesata degli indici",
        "Identifica dove sei in outperformance e dove sei in ritardo — decidi se agire",
      ]
    },
    keyPoints: [
      "L'Italy 100 ha mostrato forte outperformance vs. Bordeaux 500 negli anni recenti — dati aggiornati su liv-ex.com",
      "Il Burgundy 150 è il più volatile degli indici regionali — massima performance potenziale ma massimo rischio",
      "Il Fine Wine 1000 è il benchmark ampio (24 regioni) — usarlo come riferimento per portfolio diversificati",
      "La divergenza tra indici è un segnale di rotazione settoriale — come per i settori azionari",
      "I dati Liv-ex sono basati su trade reali, non stime — la fonte più affidabile del mercato",
    ],
    quiz: [
      { q: "Quanti vini compone il Fine Wine 1000 di Liv-ex?", options: ["100", "500", "1000", "2000"], correct: 2 },
      { q: "Quale indice Liv-ex è il più volatile?", options: ["Bordeaux 500", "Italy 100", "Burgundy 150", "Champagne 50"], correct: 2 },
      { q: "Dove vengono pubblicati i dati mensili aggregati di Liv-ex?", options: ["Solo su abbonamento premium", "liv-ex.com (forma aggregata gratuita)", "Christie's wine report", "Decanter magazine"], correct: 1 },
      { q: "Il Bordeaux 500 ha subito la sua maggiore correzione in quale periodo?", options: ["2008–2009 (crisi finanziaria)", "2011–2014 (correzione asiatica)", "2016–2017 (Brexit)", "2020 (COVID)"], correct: 1 },
      { q: "Quando Italy 100 sale e Bordeaux 500 scende, cosa indica?", options: ["Il mercato complessivo è in calo", "Una rotazione settoriale verso l'Italia", "La crisi del fine wine europeo", "Un problema con i dati Liv-ex"], correct: 1 },
    ],
  },
  // ── Module 12: Correlazione vino/azionario ────────────────────────────────────
  {
    id: "rs_12", courseId: 11, index: 11,
    title: "Correlazione vino/azionario: come funziona in una crisi",
    duration: 14,
    youtube: null,
    hero: { headline: "Durante il crash COVID (marzo 2020) il Liv-ex 100 ha mostrato una resilienza eccezionale rispetto all'S&P 500", stat: "La correlazione tra fine wine e azionario è storicamente bassa — il meccanismo è strutturale, non casuale", context: "Il fine wine è uno degli asset con la più bassa correlazione agli indici azionari. Questa caratteristica lo rende un potente strumento di diversificazione di portfolio — specialmente in periodi di stress di mercato." },
    objectives: ["Quantificare la correlazione storica tra fine wine e mercati azionari", "Analizzare il comportamento del fine wine durante le principali crisi (2008, 2020)", "Capire perché la bassa correlazione esiste e se è strutturale o ciclica", "Costruire un portfolio multi-asset ottimale includendo il fine wine"],
    context: "La correlazione è la misura statistica di quanto due asset si muovono insieme. 1.0 = perfettamente correlati. 0 = nessuna correlazione. -1.0 = perfettamente anticorrelati. Il fine wine ha mostrato storicamente una correlazione bassa con l'S&P 500 — i dati precisi variano per periodo e metodologia, consultare la letteratura accademica.",
    slides: [
      { title: "Cos'è la correlazione e perché conta", body: "Un portfolio diversificato non è uno con molti asset — è uno con asset a bassa correlazione tra loro. Se tutti i tuoi asset cadono insieme in una crisi, la diversificazione è illusoria. Il fine wine riduce la correlazione media del portfolio." },
      { title: "La correlazione storica vino/azionario", body: "Il fine wine ha mostrato storicamente bassa correlazione con S&P 500, FTSE 100 e immobiliare. È tra gli asset con la più bassa correlazione agli equity — i dati precisi variano per periodo e metodologia. Consultare la letteratura accademica (Masset, Henderson, Sanning) per i valori." },
      { title: "La crisi del 2008", body: "S&P 500: -38% da luglio 2008 a marzo 2009. Il Liv-ex Fine Wine 100 ha corretto molto meno nello stesso periodo. La borsa ha impiegato anni per recuperare; il fine wine ha recuperato molto prima. La bassa correlazione ha protetto i portfolio che includevano fine wine." },
      { title: "Il crash COVID marzo 2020", body: "S&P 500: -34% in 33 giorni (la correzione più rapida della storia). Il Liv-ex 100 è sceso marginalmente. Il fine wine era quasi 'immune' perché i compratori non erano sotto margin call e la domanda dei collezionisti è inelastica al breve termine." },
      { title: "Perché la bassa correlazione è strutturale", body: "I compratori di fine wine non sono margin-call driven. Non esistono ETF su fine wine che forzino vendite automatiche. La liquidità è limitata — impossibile vendere milioni in un giorno. Questi fattori strutturali mantengono bassa la correlazione." },
      { title: "I limiti: correlazione in crisi profonde", body: "Crisi protratte (es. crisi asiatica 1997–1998): la correlazione con il lusso globale è aumentata. In recessioni profonde con riduzione del reddito disponibile, anche il fine wine può correggere. La correlazione bassa vale per crisi brevi e panico di mercato." },
      { title: "Ottimizzazione portfolio con fine wine", body: "Modern Portfolio Theory: aggiungere un asset a bassa correlazione aumenta il Sharpe Ratio del portfolio. La letteratura accademica (Masset & Henderson, 2010) documenta che includere fine wine migliora il profilo rischio/rendimento di un portfolio diversificato." },
      { title: "Allocazione ottimale: quanto fine wine?", body: "Consensus degli studi accademici: 5–15% del portfolio. Sotto il 5%: impatto marginale sulla diversificazione. Oltre il 15%: liquidità troppo ridotta, rischio concentrazione. Il 10% è considerato il punto ottimale." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Fine wine vs. S&P 500 durante le crisi</text><line x1="40" y1="110" x2="370" y2="110" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><text x="32" y="114" fill="#475569" fontSize="8" textAnchor="end">0%</text><polyline points="40,110 80,110 120,130 160,155 200,170 240,155 280,130 330,108 370,100" fill="none" stroke="#ef4444" strokeWidth="2"/><polyline points="40,110 80,110 120,115 160,120 200,123 240,120 280,116 330,112 370,108" fill="none" stroke="#4ade80" strokeWidth="2"/><text x="372" y="104" fill="#4ade80" fontSize="8">Fine Wine</text><text x="372" y="174" fill="#ef4444" fontSize="8">S&P 500</text><text x="200" y="188" fill="#475569" fontSize="8">Crisi 2008</text></svg>`,
    deepDive: `La bassa correlazione del fine wine con i mercati azionari è uno dei suoi attributi più studiati e più fraintesi. È reale — ma ha condizioni e limiti che è essenziale comprendere prima di costruire un portfolio su questa premessa.

Il meccanismo è semplice: il mercato del fine wine è guidato da compratori che non subiscono margin calls. Un collezionista di DRC Romanée-Conti che vede l'S&P 500 scendere del 30% non è costretto a vendere la sua wine collection — la sua situazione finanziaria può deteriorarsi, ma non c'è un meccanismo automatico che forzi la vendita come accade con le azioni in margin account.

Questo crea una asimmetria temporale. In una crisi breve e violenta (come il COVID nel 2020), il fine wine è praticamente immune perché il mercato non ha liquidità sufficiente per assorbire vendite forzate — e non ci sono vendite forzate. L'indice Liv-ex 100 ha mostrato una resilienza eccezionale nello stesso periodo in cui l'S&P 500 crollava.

Ma in una crisi protratta — dove la ricchezza delle famiglie ad alto reddito erode nel tempo — il quadro cambia. La crisi asiatica del 1997–1998, che aveva una componente di riduzione strutturale del reddito disponibile nei collezionisti HK/Singapore, ha visto il mercato fine wine correggere in 18 mesi. Non una catastrofe, ma una correlazione superiore allo zero.

La letteratura accademica (Masset & Henderson, 2010; Sanning, Shaffer & Sharratt, 2008) converge su una conclusione: il fine wine migliora il profilo rischio/rendimento di un portfolio diversificato. L'entità dell'effetto dipende dal periodo e dalla metodologia — i dati precisi sono disponibili nelle pubblicazioni accademiche citate.`,
    caseStudies: [
      { wine: "Portfolio 60/40 + 10% Fine Wine durante COVID", buy: null, sell: null, year_buy: 2020, year_sell: 2020, roi: "Esempio illustrativo", note: "Simulazione concettuale: la bassa correlazione del fine wine ha attenuato le perdite di un portfolio diversificato durante il crollo di marzo 2020. Il fine wine ha perso marginalmente mentre l'equity perdeva oltre il 30%." },
      { wine: "Portfolio Fine Wine durante crisi 2008", buy: null, sell: null, year_buy: 2008, year_sell: 2009, roi: "Outperformance significativa vs. S&P", note: "Il Liv-ex Fine Wine 100 ha corretto molto meno dell'S&P 500 nella crisi del 2008. Il recupero del fine wine è stato più rapido rispetto all'equity." },
    ],
    techniques: [
      "Target 10% di allocazione fine wine nel portfolio complessivo — il punto ottimale per diversificazione",
      "In periodi di stress di mercato breve (panic selling), non vendere il fine wine: la bassa liquidità ti protegge",
      "Monitora il rapporto Liv-ex 100 / S&P 500: quando divergono fortemente, è segnale di opportunità",
      "In recessioni profonde (>18 mesi), riduci l'esposizione ai vini meno liquidi prima che il mercato si deteriori",
    ],
    exercise: {
      title: "Ottimizzazione portfolio con Modern Portfolio Theory",
      steps: [
        "Dati storici: prendi i rendimenti mensili 2014–2024 del Liv-ex 100 (dal sito liv-ex.com)",
        "Confronta con i rendimenti S&P 500 e un indice obbligazionario (es. Barclays Aggregate)",
        "Calcola la correlazione tra Liv-ex 100 e S&P 500 usando Excel (funzione CORREL)",
        "Simula 3 portfolio: 60/40, 50/40/10 (con fine wine), 50/30/20 (con fine wine)",
        "Confronta lo Sharpe Ratio dei tre portfolio — verifica se il fine wine migliora il profilo rischio/rendimento",
      ]
    },
    keyPoints: [
      "La correlazione tra Liv-ex Fine Wine 100 e S&P 500 è storicamente bassa — i dati precisi sono disponibili sulla letteratura accademica",
      "COVID marzo 2020: il Liv-ex 100 ha mostrato resilienza eccezionale rispetto al crollo dell'S&P 500",
      "La bassa correlazione è strutturale: no margin calls, no ETF forzati, liquidità limitata",
      "Allocazione ottimale: il consenso accademico è 5–15% del portfolio, con 10% come punto di riferimento",
      "In recessioni protratte la correlazione aumenta — il fine wine non è un hedge perfetto",
    ],
    quiz: [
      { q: "Perché il fine wine ha generalmente bassa correlazione con l'azionario?", options: ["Per legge i due mercati non possono muoversi insieme", "I compratori non subiscono margin calls e non esistono ETF su fine wine che forzino vendite automatiche", "Il fine wine è garantito dallo stato", "Non è vero: la correlazione è alta"], correct: 1 },
      { q: "In quale scenario il fine wine ha mostrato la massima resilienza rispetto all'azionario?", options: ["Recessioni protratte (18+ mesi)", "Crisi brevi e violente come il COVID marzo 2020", "Periodi di inflazione alta", "Mercati azionari in forte crescita"], correct: 1 },
      { q: "Perché il fine wine non subisce vendite forzate come le azioni?", options: ["È un asset illiquido senza margine", "I compratori non subiscono margin calls e non esistono ETF su fine wine", "La normativa lo vieta", "Il mercato è chiuso durante le crisi"], correct: 1 },
      { q: "Quale allocazione fine wine è considerata ottimale per un portfolio diversificato?", options: ["1–3%", "5–10%", "10% (consensus accademico 5–15%)", "25–30%"], correct: 2 },
      { q: "In quale scenario la bassa correlazione del fine wine tende a deteriorarsi?", options: ["Crisi brevi e violente (panic selling)", "Recessioni profonde e protratte che erodono il reddito disponibile", "Periodi di inflazione alta", "Mercati azionari in forte crescita"], correct: 1 },
    ],
  },
  // ── Module 13: Stagionalità ───────────────────────────────────────────────────
  {
    id: "rs_13", courseId: 11, index: 12,
    title: "Stagionalità: quando comprare e quando vendere nel corso dell'anno",
    duration: 12,
    youtube: null,
    hero: { headline: "Il mercato del fine wine segue un ciclo stagionale ricorrente — sapere quando comprare e vendere vale qualche punto percentuale di rendimento", stat: "Dati storici Liv-ex mostrano pattern stagionali ricorrenti: autunno alto, estate basso", context: "Il mercato del fine wine ha pattern stagionali ricorrenti legati a cicli di domanda (gifting natalizio, aste autunnali) e offerta (rilascio EP primaverile, vendemmia). Comprenderli consente timing migliore." },
    objectives: ["Identificare i pattern stagionali storicamente più affidabili su Liv-ex", "Capire i meccanismi che guidano la stagionalità nel fine wine", "Applicare il timing stagionale alle strategie di acquisto e vendita", "Distinguere stagionalità affidabile da rumore statistico"],
    context: "La stagionalità non è una certezza — è una probabilità storica. I dati Liv-ex su 20 anni mostrano pattern ricorrenti, ma ogni anno ha le sue specificità. Il timing stagionale è uno strumento tattico, non una strategia di investimento completa.",
    slides: [
      { title: "Il ciclo annuale del fine wine", body: "Gennaio–febbraio: post-gifting lull, prezzi bassi. Marzo–maggio: EP season bordolese, attenzione sul millesimo. Giugno–agosto: mercato rallenta, vacanze. Settembre–novembre: grande season d'aste. Dicembre: gifting premium, prezzi alti." },
      { title: "I dati stagionali Liv-ex (2004–2024)", body: "Mese tendenzialmente migliore per comprare: agosto (prezzi sotto la media annua). Mese tendenzialmente peggiore per comprare: ottobre–novembre (prezzi sopra la media per effetto delle aste). Mese migliore per vendere: ottobre–novembre. Il pattern è statisticamente ricorrente ma con variabilità annuale." },
      { title: "La grande season d'aste autunnale", body: "Ottobre–novembre: Christie's, Sotheby's, Acker, Hart Davis Hart rilasciano le loro aste principali. Domanda alta → prezzi alti → momento per vendere, non per comprare. Christie's Wine autunnale (Londra): la più grande per volumi totali." },
      { title: "L'estate: la finestra di acquisto", body: "Agosto: i wine merchants svuotano lo stock, domanda bassa, prezzi scontati. I collezionisti sono in vacanza. La piattaforma Liv-ex mostra volumi di trade minimi. Opportunità per acquistare a prezzi sotto la media annua." },
      { title: "La EP season di primavera", body: "Aprile–maggio: Bordeaux presenta le primeurs. Il mercato è focalizzato sul nuovo millesimo — l'attenzione dei compratori si sposta sul futuro. I vini già in bottiglia possono essere acquistati con meno competizione." },
      { title: "Il Natale premium", body: "Novembre–dicembre: domanda di gifting lusso. Champagne, vini di prestige, grandi formati vengono acquistati come regalo. I prezzi salgono. Il momento sbagliato per comprare Champagne di investimento — aspetta gennaio." },
      { title: "Annate eccezionali e stagionalità", body: "Annate straordinarie (1990, 2005, 2009, 2016) creano domanda anelastica — i prezzi salgono indipendentemente dalla stagione. In questi casi, il timing stagionale è meno rilevante. Compra comunque presto." },
      { title: "Applicazione pratica: calendario degli investitore", body: "Febbraio: revisione portfolio, acquisti opportunistici. Agosto: finestra principale per acquisti. Ottobre: pre-aste, momento ideale per vendere se hai vini a mercato. Maggio: decisione EP, solo se l'annata è eccezionale." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Indice prezzi Liv-ex per mese (media 2004–2024)</text><line x1="30" y1="160" x2="380" y2="160" stroke="#1e3050" strokeWidth="1"/><line x1="30" y1="60" x2="30" y2="160" stroke="#1e3050" strokeWidth="1"/><rect x="32" y="110" width="22" height="50" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="61" y="118" width="22" height="42" fill="#4ade80" opacity="0.8" rx="2"/><rect x="90" y="105" width="22" height="55" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="119" y="100" width="22" height="60" fill="#f97316" opacity="0.8" rx="2"/><rect x="148" y="105" width="22" height="55" fill="#f97316" opacity="0.8" rx="2"/><rect x="177" y="110" width="22" height="50" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="206" y="120" width="22" height="40" fill="#4ade80" opacity="0.8" rx="2"/><rect x="235" y="125" width="22" height="35" fill="#4ade80" opacity="0.8" rx="2"/><rect x="264" y="108" width="22" height="52" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="293" y="95" width="22" height="65" fill="#ef4444" opacity="0.8" rx="2"/><rect x="322" y="88" width="22" height="72" fill="#ef4444" opacity="0.8" rx="2"/><rect x="351" y="98" width="22" height="62" fill="#f97316" opacity="0.8" rx="2"/><text x="43" y="178" fill="#475569" fontSize="7">G</text><text x="72" y="178" fill="#475569" fontSize="7">F</text><text x="101" y="178" fill="#475569" fontSize="7">M</text><text x="130" y="178" fill="#475569" fontSize="7">A</text><text x="159" y="178" fill="#475569" fontSize="7">M</text><text x="188" y="178" fill="#475569" fontSize="7">G</text><text x="217" y="178" fill="#475569" fontSize="7">L</text><text x="246" y="178" fill="#475569" fontSize="7">A</text><text x="275" y="178" fill="#475569" fontSize="7">S</text><text x="304" y="178" fill="#475569" fontSize="7">O</text><text x="333" y="178" fill="#475569" fontSize="7">N</text><text x="362" y="178" fill="#475569" fontSize="7">D</text></svg>`,
    deepDive: `La stagionalità del fine wine è uno dei pattern più affidabili ma meno discussi nell'investimento in vino. I dati storici di Liv-ex mostrano un ciclo ricorrente con deviazioni dalla media annua che si sono ripetute per decenni.

Il mese tendenzialmente peggiore per comprare è ottobre–novembre: i prezzi medi su Liv-ex tendono a essere sopra la media annua. Il driver è la domanda d'asta: ottobre e novembre sono la grande season delle case d'asta, con Christie's e Sotheby's che organizzano le loro vendite principali. La domanda competitiva in asta si riflette sui prezzi del mercato secondario in generale.

Il mese tendenzialmente migliore per comprare è agosto: prezzi storicamente sotto la media. Il mercato è silenzioso — i collezionisti europei sono in vacanza, i wine merchants riducono i prezzi per mantenere il cash flow, e i volumi su Liv-ex sono minimi. L'abbinamento di bassa domanda e offerta normale crea la finestra di acquisto più interessante dell'anno.

Un'importante distinzione: la stagionalità funziona meglio per i vini 'ordinari di investimento' — First Growth bordolesi, Borgogna di fascia media, Super Tuscans di alta fascia. Per i vini più rari (DRC, Screaming Eagle, Petrus), la scarsità dell'offerta annulla quasi completamente il ciclo stagionale. Non si aspetta agosto per comprare una DRC Romanée-Conti — se c'è l'offerta, si compra.`,
    caseStudies: [
      { wine: "Château Léoville Barton 2016 (timing agosto)", buy: null, sell: null, year_buy: 2019, year_sell: 2022, roi: "Esempio illustrativo", note: "Acquistato in agosto (prezzo tendenzialmente sotto media). Venduto in novembre. Il timing stagionale ha contribuito positivamente al rendimento totale." },
      { wine: "Dom Pérignon 2004 (timing natalizio errato)", buy: null, sell: null, year_buy: 2014, year_sell: 2015, roi: "Esempio illustrativo — perdita netta", note: "Acquistato a dicembre (prezzo gonfiato dal gifting premium). Venduto a febbraio. Il timing errato ha penalizzato il rendimento rispetto all'acquisto in agosto dello stesso anno." },
    ],
    techniques: [
      "Acquista in agosto–settembre: finestra di prezzi tendenzialmente più bassi dell'anno — il mercato è silenzioso e la domanda ridotta",
      "Vendi in ottobre–novembre: grande season d'aste, domanda massima",
      "Non acquistare Champagne d'investimento in novembre–dicembre: prezzi gonfiati dal gifting",
      "Annate eccezionali sono eccezioni: non aspettare agosto per comprare un 2016 o 2010 top — la domanda è sempre alta",
    ],
    exercise: {
      title: "Analisi stagionalità su un vino specifico",
      steps: [
        "Scegli un vino liquido su Liv-ex (es. Château Pichon Baron, annata 2016)",
        "Scarica i prezzi mensili degli ultimi 5 anni da Wine-Searcher storico",
        "Calcola il prezzo medio mensile e identifica i mesi sopra/sotto media",
        "Verifica se il pattern corrisponde ai dati storici Liv-ex (agosto basso, novembre alto)",
        "Stima il vantaggio di rendimento applicando il timing ottimale vs. acquisto casuale",
      ]
    },
    keyPoints: [
      "Mese tendenzialmente migliore per comprare: agosto — mercato silenzioso, bassa domanda, prezzi sotto la media",
      "Mese tendenzialmente peggiore per comprare: ottobre–novembre — grande season d'aste, domanda competitiva",
      "Per i vini rarissimi (DRC, Screaming Eagle): la stagionalità quasi non esiste — compra quando c'è l'offerta",
      "Champagne d'investimento: evita novembre–dicembre (gifting premium gonfia i prezzi)",
      "Calendario investitore: febbraio (revisione), agosto (acquisti), ottobre (vendite), maggio (EP decision)",
    ],
    quiz: [
      { q: "Quale mese è storicamente il più favorevole per acquistare su Liv-ex in base ai pattern stagionali?", options: ["Gennaio", "Aprile", "Agosto", "Novembre"], correct: 2 },
      { q: "Perché i prezzi salgono in ottobre–novembre?", options: ["È la stagione della vendemmia", "È la grande season delle case d'asta con alta domanda competitiva", "I produttori aumentano i prezzi", "Effetto della stagione natalizia anticipata"], correct: 1 },
      { q: "La stagionalità è meno rilevante per:", options: ["First Growth bordolesi", "Borgogna Premier Cru", "DRC Romanée-Conti e vini rarissimi", "Super Tuscans"], correct: 2 },
      { q: "L'EP season di primavera riguarda principalmente:", options: ["La Borgogna", "Il Bordeaux", "Il Champagne", "L'Italia"], correct: 1 },
      { q: "Quale affermazione sulla stagionalità è corretta?", options: ["È una legge del mercato garantita", "È una probabilità storica — utile come strumento tattico, non strategia completa", "Vale solo per i mercati asiatici", "È stata eliminata dall'avvento di Liv-ex"], correct: 1 },
    ],
  },
  // ── Module 14: Storage e costi nascosti ───────────────────────────────────────
  {
    id: "rs_14", courseId: 11, index: 13,
    title: "Storage e costi nascosti: tutto ciò che non è nel prezzo di acquisto",
    duration: 13,
    youtube: null,
    hero: { headline: "Costo storage London bonded warehouse: £14.40/cassa/anno (2024). Non negoziabile", stat: "Il costo totale di carry su 10 anni può raggiungere il 25–35% del capitale investito", context: "La maggior parte degli investitori calcola solo il prezzo di acquisto. Il costo reale di possedere fine wine include storage, assicurazione, duty, VAT e costi di transazione — che possono erodere il 30%+ del rendimento lordo." },
    objectives: ["Calcolare il costo totale di carry su un investimento fine wine", "Confrontare i diversi tipi di storage: bonded warehouse, casa, self-storage", "Quantificare l'impatto del duty e VAT sulla fiscalità wine investing", "Costruire un modello di break-even che include tutti i costi reali"],
    context: "Il 'costo di carry' è il costo totale di mantenere un investimento nel tempo. Per il fine wine: storage + assicurazione + (duty + VAT se rivenduto UK out-of-bond) + fees di gestione. Su 10 anni, questi costi composti possono superare il 30% del capitale.",
    slides: [
      { title: "Bonded Warehouse: lo standard professionale", body: "London City Bond (LCB), Berry Bros & Rudd, Octavian: i principali. Costo: £12–17/cassa/anno (varia per dimensione cassa). 'In bond': il duty non è ancora pagato. Il vino è al riparo dai creditori se il merchant fallisce." },
      { title: "Costi di storage: la tabella completa", body: "London bonded warehouse: £14.40/cassa/anno (media 2024). Temperatura controllata privata: €2–4/cassa/anno (solo portfolio piccoli). USA storage: $18–24/cassa/anno. HK Free Port: HK$80–120/cassa/anno." },
      { title: "Assicurazione: obbligatoria per investimento", body: "Copertura standard su valore di mercato. Costo tipico: 0.25–0.35% del valore assicurato annuo. Portfolio da £50.000: £150–175/anno. I bonded warehouse includono assicurazione base — verifica sempre il massimale." },
      { title: "Duty e VAT nel UK", body: "Vino 'in bond': nessun duty/VAT pagato. Per portarlo out-of-bond: duty £2.23/bt + VAT 20% sul valore. Per rivendere sul mercato secondario UK: puoi mantenere in bond e trasferire — nessun duty pagato." },
      { title: "Costi di transazione", body: "Liv-ex membership: £300–500/anno + 1–2% per trade. Aste: 10–15% seller commission + 20–25% buyer premium. Merchant markup: 20–30% sul prezzo Liv-ex. Queste percentuali si sommano al costo di carry." },
      { title: "Il modello di break-even", body: "Formula: prezzo acquisto × (1 + carry rate)^anni = break-even. Con carry rate 3%/anno su 5 anni: 1,159. Su 8 anni: 1,267. Il vino deve apprezzare almeno del 27% in 8 anni solo per coprire i costi." },
      { title: "Storage a casa: i rischi", body: "Temperatura instabile accelera invecchiamento, luce e vibrazioni degradano il vino. Una bottiglia mal conservata perde il 30–60% del valore. Per investimento: bonded warehouse sempre." },
      { title: "Come ridurre i costi di carry", body: "1. Negozia tariffe con il warehouse (volumi alti). 2. Riduci i formati piccoli. 3. Monitora ogni 6 mesi: vendi i vini che non crescono abbastanza. 4. Compra 12-pack: costo/bottiglia inferiore vs. loose." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Erosione rendimento da costi carry (10 anni)</text><line x1="40" y1="160" x2="370" y2="160" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="160" stroke="#1e3050" strokeWidth="1"/><polyline points="40,60 100,72 160,84 220,96 280,110 340,124 370,130" fill="none" stroke="#ef4444" strokeWidth="2.5"/><polyline points="40,60 100,64 160,68 220,72 280,78 340,84 370,88" fill="none" stroke="#4ade80" strokeWidth="2"/><text x="372" y="134" fill="#ef4444" fontSize="8">Lordo</text><text x="372" y="92" fill="#4ade80" fontSize="8">Netto</text></svg>`,
    deepDive: `Il costo di carry è la voce che più frequentemente sorprende i nuovi investitori in fine wine. Il prezzo di acquisto è solo l'inizio del costo totale.

Prendiamo un esempio concreto. Acquisti 3 casse di Château Lynch-Bages 2016 a £3.600 totali. Le stoccate in un bonded warehouse londinese.

Anno 1: storage £43.20 (3 casse × £14.40) + assicurazione £9 (0.25% su £3.600) = £52.20. Anno 5: hai speso £261. Anno 10: hai speso £522. Cioè il 14.5% del capitale investito è già andato in costi di mantenimento.

Aggiungi le fees di transazione. Su £4.500 di valore stimato, il merchant prende £450–675.

Totale costi su 10 anni: £522 (carry) + £562 (transazione) = £1.084, cioè il 30% del capitale iniziale. Il Lynch-Bages deve apprezzare del 30% solo per essere al break-even.

Questo calcolo è fondamentale per capire perché il fine wine richiede un orizzonte lungo (7–12 anni) e perché le annate mediocri a prezzi aggressivi sono sempre trappole.`,
    caseStudies: [
      { wine: "Château Léoville Las Cases 2010 — costo carry 12 anni", buy: null, sell: null, year_buy: 2012, year_sell: 2024, roi: "Rendimento lordo significativo / netto ridotto dai costi", note: "Esempio del meccanismo di erosione: storage (3 casse × £14.40 × 12 anni), assicurazione (0.25% annuo), costi di transazione. Il rendimento netto è sempre inferiore al lordo — calcolarlo ex-ante è fondamentale." },
      { wine: "Brunello Ciacci Piccolomini 2010 — break-even mancato", buy: null, sell: null, year_buy: 2015, year_sell: 2020, roi: "Perdita netta — apprezzamento insufficiente a coprire i costi", note: "Apprezzamento troppo contenuto. I costi di carry e transazione hanno superato il guadagno lordo. Illustra perché il vino deve crescere di almeno il 3%+ annuo per giustificare i costi." },
    ],
    techniques: [
      "Formula break-even: prezzo acquisto × 1.30 = prezzo minimo di vendita su 10 anni",
      "Monitora ogni 6 mesi: se un vino non cresce del 3%+ annuo, vendilo",
      "Stocca in casse da 12: costo per bottiglia inferiore vs. sciolte",
      "Usa bonded warehouse sempre per investimento — mai storage casalingo per importi >£2.000",
    ],
    exercise: {
      title: "Calcola il rendimento netto reale di un investimento",
      steps: [
        "Prendi un vino che vorresti acquistare (es. Barolo 2016, 6 bottiglie, €1.200 totali)",
        "Calcola i costi annui: storage (£14.40/cassa), assicurazione (0.3% valore)",
        "Proietta su 8 anni: costo carry totale",
        "Aggiungi i costi di transazione stimati per la vendita (10–15%)",
        "Calcola il rendimento lordo necessario per ottenere un rendimento netto del 5%/anno",
      ]
    },
    keyPoints: [
      "Storage bonded warehouse Londra: £14.40/cassa/anno — costo fisso non negoziabile",
      "Costo carry totale 10 anni: 25–35% del capitale investito",
      "Break-even formula: prezzo acquisto × 1.30 = minimo di vendita su 10 anni",
      "Bonded warehouse: nessun duty/VAT finché in bond — fondamentale per il mercato UK",
      "Monitora ogni 6 mesi: vini con crescita <3%/anno non coprono i costi",
    ],
    quiz: [
      { q: "Qual è il costo di storage in un London bonded warehouse per cassa nel 2024?", options: ["£5.40", "£10.20", "£14.40", "£22.00"], correct: 2 },
      { q: "Cosa significa stoccare il vino 'in bond'?", options: ["Il vino è assicurato contro il furto", "Duty e VAT non sono ancora stati pagati — si pagano solo all'uscita", "Il vino è bloccato per 5 anni", "Il vino è certificato autentico"], correct: 1 },
      { q: "Il costo di carry su 10 anni è tipicamente:", options: ["3–5%", "8–12%", "25–35%", "50%+"], correct: 2 },
      { q: "Qual è il rischio principale dello storage casalingo?", options: ["Costo troppo alto", "Temperatura instabile e luce degradano il vino (perdita 30–60% valore)", "Problemi assicurativi", "Non è legalmente 'in bond'"], correct: 1 },
      { q: "Perché stoccare in casse da 12 è preferibile?", options: ["I vini invecchiano meglio in cassa", "Il costo per bottiglia del warehouse è inferiore", "La dogana lo richiede", "È lo standard Liv-ex"], correct: 1 },
    ],
  },
  // ── Module 15: Exit strategy ──────────────────────────────────────────────────
  {
    id: "rs_15", courseId: 11, index: 14,
    title: "Exit strategy: quando vendere, dove vendere, come massimizzare il prezzo",
    duration: 15,
    youtube: null,
    hero: { headline: "La exit strategy vale quanto la selezione dei vini — vendere nel momento e nel canale sbagliato costa rendimento", stat: "Il timing di vendita e la scelta del canale possono fare la differenza tra il rendimento potenziale e quello realizzato", context: "Decidere quando e dove vendere è la competenza più sottovalutata nel fine wine investing. La maggior parte degli investitori sa comprare bene ma vende male — perdendo una quota significativa del rendimento potenziale." },
    objectives: ["Identificare i segnali che indicano il momento ottimale per vendere", "Confrontare sistematicamente i canali di vendita", "Capire come massimizzare il prezzo con timing, formato e provenance", "Costruire un processo decisionale strutturato per le exit"],
    context: "L'exit strategy è condizionata da tre variabili: il momento di mercato (stagionalità, ciclo del segmento), il canale (che determina i costi e la velocità), e la presentazione del vino (provenance, condizione, formato).",
    slides: [
      { title: "I segnali di vendita", body: "Vendi quando: 1) Hai raggiunto il target di rendimento (+80% netto). 2) L'indice del segmento mostra plateau. 3) Il critico principale ha ridotto i punteggi. 4) La liquidità su Liv-ex si riduce. 5) La tua situazione richiede liquidità." },
      { title: "Canali di vendita: il confronto", body: "Liv-ex: veloce (3–7 giorni), commissioni 1–2%, solo per vini liquidi. Merchants: 10–20% markup. Aste: 10–15% seller fee, alta visibilità per vini rari. Privati: massimo prezzo ma nessuna liquidità garantita." },
      { title: "Liv-ex vs. aste per valore", body: "Vini sotto un certo valore: meglio Liv-ex per velocità e costi ridotti. Vini di alto valore e rarità: spesso le aste danno prezzi più alti per effetto della domanda competitiva. La soglia varia per ogni vino — analisi caso per caso." },
      { title: "Il timing stagionale per le exit", body: "Ottobre–novembre: massima domanda, aste principali → ideale per exit. Agosto: prezzi bassi, evita. Dicembre: buono per Champagne. Febbraio: da evitare per il lusso." },
      { title: "Come presentare il vino", body: "Provenance documentata: fino a +25% in asta. Etichette intatte, capsule non danneggiate, livello di riempimento alto. OWC (cassa originale legno): +8–15% premium. Lotto completo (12bt): +15–20% vs. sciolte." },
      { title: "La vendita parziale", body: "Portfolio da 12bt: vendi 6 quando hai raggiunto +100% → hai recuperato il capitale totale. Le 6 rimanenti sono 'rendimento puro'. Trailing stop: vendi quando il vino scende del 15% dal massimo." },
      { title: "Vendere a merchants vs. Liv-ex", body: "Merchant: prezzo immediato detratto del 15–25%. Liv-ex: richiede membership ma riconosce il prezzo pieno. Per chi vende di rado: merchant. Per vendite frequenti: Liv-ex membership si ripaga." },
      { title: "La exit checklist", body: "1. Verifica prezzo Liv-ex. 2. Controlla la stagionalità. 3. Scegli il canale ottimale. 4. Prepara la documentazione. 5. Imposta prezzo minimo. 6. Esegui in modo disciplinato." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Canali di vendita: prezzo ottenuto netto</text><rect x="50" y="70" width="55" height="80" fill="#4ade80" opacity="0.8" rx="4"/><rect x="125" y="85" width="55" height="65" fill="#60a5fa" opacity="0.8" rx="4"/><rect x="200" y="90" width="55" height="60" fill="#f97316" opacity="0.8" rx="4"/><rect x="275" y="75" width="55" height="75" fill="#a78bfa" opacity="0.8" rx="4"/><text x="77" y="165" fill="#94a3b8" fontSize="9" textAnchor="middle">Privati</text><text x="152" y="165" fill="#94a3b8" fontSize="9" textAnchor="middle">Aste</text><text x="227" y="165" fill="#94a3b8" fontSize="9" textAnchor="middle">Merchant</text><text x="302" y="165" fill="#94a3b8" fontSize="9" textAnchor="middle">Liv-ex</text><text x="77" y="64" fill="#e2e8f0" fontSize="8" textAnchor="middle">100%</text><text x="152" y="79" fill="#e2e8f0" fontSize="8" textAnchor="middle">88%</text><text x="227" y="84" fill="#e2e8f0" fontSize="8" textAnchor="middle">80%</text><text x="302" y="69" fill="#e2e8f0" fontSize="8" textAnchor="middle">98%</text></svg>`,
    deepDive: `La decisione di uscita è ciò che trasforma un buon investimento in un ottimo risultato. La maggior parte degli investitori si concentra sull'acquisto, trascurando che l'exit è altrettanto determinante.

Il timing è il primo fattore. Un Barolo 2010 comprato a €200 nel 2013 valeva €380 nel settembre 2021, e €310 nel luglio 2022. Chi ha venduto a settembre 2021 ha ottenuto il 90% di rendimento; chi ha aspettato fino all'estate 2022 ha ottenuto il 55%. La stessa bottiglia, un delta di 35 punti percentuali — solo per il timing.

Il canale è il secondo fattore. Liv-ex è ottimale per vini liquidi: si ottiene il prezzo bid del mercato, meno 1–2% di commissione. Per vini rari con poca liquidità su Liv-ex (Rayas, Salon Le Mesnil), l'asta è superiore: la domanda competitiva può far salire il prezzo del 10–15% sopra la stima.

La presentazione è il terzo fattore. Un Petrus 1990 con OWC originale e provenance documentata può valere il 20–25% in più dello stesso vino senza documentazione. L'investitore che conserva le proprie fatture è sistematicamente avvantaggiato.`,
    caseStudies: [
      { wine: "Rayas Châteauneuf-du-Pape 2007 — exit ottimizzata", buy: null, sell: null, year_buy: 2012, year_sell: 2021, roi: "Esempio illustrativo", note: "Venduto in asta autunnale con OWC originale. Il premium per provenance e formato originale ha contribuito significativamente al prezzo finale rispetto alla stima iniziale." },
      { wine: "Barolo Conterno Monfortino 2013 — exit subottimale", buy: null, sell: null, year_buy: 2018, year_sell: 2022, roi: "Esempio illustrativo", note: "Venduto ad agosto a un merchant. L'asta autunnale avrebbe probabilmente realizzato un prezzo significativamente più alto per effetto della stagionalità e della domanda competitiva." },
    ],
    techniques: [
      "Usa Liv-ex per vini con >5 offerte attive — commissioni minime, prezzo pieno",
      "Usa aste (ottobre–novembre) per vini rari (<5 offerte su Liv-ex) con OWC originale",
      "Vendita parziale a +100%: cristallizza il guadagno, il resto è 'profitto puro'",
      "Conserva sempre le fatture: provenance documentata vale il 20–25% in più in asta",
    ],
    exercise: {
      title: "Costruisci la tua exit strategy",
      steps: [
        "Prendi 5 vini del tuo portfolio (o simulato)",
        "Per ciascuno, determina il canale ottimale basandoti su valore e liquidità Liv-ex",
        "Identifica il timing stagionale ottimale per ciascuno",
        "Calcola il rendimento atteso usando il canale e timing ottimali",
        "Confronta con il rendimento se vendessi tutti oggi tramite un merchant unico",
      ]
    },
    keyPoints: [
      "Il timing di vendita e la scelta del canale hanno un impatto significativo sul rendimento finale realizzato",
      "Vini rari con poca liquidità su Liv-ex: le aste in autunno tendono a realizzare prezzi superiori",
      "Provenance documentata + OWC originale: premium significativo in asta rispetto a bottiglie senza storia",
      "Vendita parziale a +100%: il meccanismo cardine per azzerare il rischio",
      "Exit checklist: prezzo Liv-ex + stagionalità + canale + provenance + prezzo minimo",
    ],
    quiz: [
      { q: "Per vini con meno di 5 offerte attive su Liv-ex, il canale migliore è:", options: ["Vendita diretta a privati", "Merchant locale", "Casa d'aste autunnale", "Liv-ex stesso"], correct: 2 },
      { q: "Perché la provenance documentata aumenta il prezzo in asta?", options: ["È richiesta dalla legge", "Riduce il rischio percepito per l'acquirente e aumenta la fiducia nell'autenticità", "Permette di evitare il buyer's premium", "Garantisce la stima pre-asta"], correct: 1 },
      { q: "La strategia di 'vendita parziale a +100%' serve a:", options: ["Ridurre le tasse", "Azzerare il rischio sul capitale investito dopo +100%", "Rispettare le quote Liv-ex", "Pagare meno commissioni"], correct: 1 },
      { q: "Perché il timing di vendita è considerato cruciale per il rendimento?", options: ["Non è importante — il prezzo è uguale tutto l'anno", "La stagionalità e i cicli di domanda creano divergenze di prezzo che possono valere diversi punti percentuali", "Solo per i vini molto rari", "Solo per il Bordeaux"], correct: 1 },
      { q: "Il momento stagionale ottimale per vendere fine wine è:", options: ["Agosto", "Gennaio", "Ottobre–novembre (grande season aste)", "Aprile (EP season)"], correct: 2 },
    ],
  },
  // ── Module 16: Fiscalità ──────────────────────────────────────────────────────
  {
    id: "rs_16", courseId: 11, index: 15,
    title: "Fiscalità: regime plusvalenze in Italia, UK, USA, Svizzera",
    duration: 14,
    youtube: null,
    hero: { headline: "Italia: vino = bene mobile, plusvalenze >5 anni spesso non tassate. UK: CGT 28% su gain", stat: "La struttura fiscale può valere il 15–28% del rendimento lordo — la variabile più impattante", context: "La fiscalità del fine wine investing varia enormemente tra paesi. Comprendere il regime applicabile può trasformare un rendimento del 50% lordo in un 30–45% netto, o in un 50% netto se strutturato correttamente." },
    objectives: ["Analizzare il regime fiscale in Italia, UK, USA e Svizzera", "Capire la differenza tra bene mobile, asset alternativo e CGT", "Identificare strutture legali che ottimizzano la fiscalità", "Valutare l'impatto fiscale nella costruzione della strategia"],
    context: "Il fine wine è classificato diversamente in diversi paesi: in Italia come 'bene mobile', in UK come 'chattels' soggetti a CGT, negli USA come 'collectible' con CGT al 28%. La Svizzera non ha CGT sulle plusvalenze private.",
    slides: [
      { title: "Italia: il regime più favorevole?", body: "In Italia il vino è 'bene mobile'. Le plusvalenze non sono tassate se posseduto per oltre 5 anni (nella maggior parte dei casi). L'AdE non ha ancora una posizione univoca sull'investimento sistematico. Consultare un fiscalista specializzato è obbligatorio." },
      { title: "UK: Capital Gains Tax", body: "In UK il vino è 'wasting asset chattel'. I vini longevi (vita >50 anni) → soggetti a CGT. CGT rates 2024: 18% (basic) o 28% (higher rate). Annual exemption: £3.000 (ridotta dal 2024)." },
      { title: "USA: collectibles al 28%", body: "In USA il vino è classificato come 'collectible' dal IRS. Plusvalenze long-term (>1 anno): 28% (vs. 20% equity). Short-term: tassate come reddito ordinario (fino al 37%)." },
      { title: "Svizzera: nessuna CGT privata", body: "La Svizzera non applica CGT sulle plusvalenze da investimenti privati. Eccezione: attività sistematica considerata 'professionale' → tassata come reddito. Soglia: meno di 12 transazioni/anno." },
      { title: "Hong Kong e Singapore: no CGT", body: "Nessuna CGT in entrambi i principali mercati asiatici. Il motivo per cui HK e Singapore dominano il fine wine investing: fiscalità favorevole per collezionisti istituzionali e privati." },
      { title: "Strutture di ottimizzazione", body: "Holding company: plusvalenze tassate come corporate income (spesso inferiore alla CGT personale). Trust: struttura per grandi patrimoni. UK: il corporate tax (19%) batte il CGT (28%) per portfolio >£50.000." },
      { title: "IVA e duty", body: "UK duty: £2.23/bt. VAT: 20% solo out-of-bond. Italia: IVA 22% sull'acquisto. Strategia ottimale: compra in bond UK/HK, vendi in bond → nessun VAT pagato sull'intero ciclo." },
      { title: "La checklist fiscale", body: "1. Verifica classificazione nel tuo paese. 2. Consulta un fiscalista. 3. Mantieni documentazione completa. 4. Considera la holding per volumi >€100.000. 5. Tieni traccia del periodo di possesso — supera i 5 anni dove possibile." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">CGT comparata: fine wine per paese</text><rect x="40" y="120" width="50" height="40" fill="#4ade80" opacity="0.8" rx="4"/><rect x="110" y="80" width="50" height="80" fill="#ef4444" opacity="0.8" rx="4"/><rect x="180" y="60" width="50" height="100" fill="#f97316" opacity="0.8" rx="4"/><rect x="250" y="140" width="50" height="20" fill="#4ade80" opacity="0.9" rx="4"/><rect x="320" y="140" width="50" height="20" fill="#4ade80" opacity="0.9" rx="4"/><text x="65" y="175" fill="#94a3b8" fontSize="9" textAnchor="middle">Italia</text><text x="135" y="175" fill="#94a3b8" fontSize="9" textAnchor="middle">UK</text><text x="205" y="175" fill="#94a3b8" fontSize="9" textAnchor="middle">USA</text><text x="275" y="175" fill="#94a3b8" fontSize="9" textAnchor="middle">CH</text><text x="345" y="175" fill="#94a3b8" fontSize="9" textAnchor="middle">HK/SG</text><text x="65" y="115" fill="#e2e8f0" fontSize="8" textAnchor="middle">0%*</text><text x="135" y="75" fill="#e2e8f0" fontSize="8" textAnchor="middle">28%</text><text x="205" y="55" fill="#e2e8f0" fontSize="8" textAnchor="middle">28%+</text><text x="275" y="135" fill="#e2e8f0" fontSize="8" textAnchor="middle">0%</text><text x="345" y="135" fill="#e2e8f0" fontSize="8" textAnchor="middle">0%</text></svg>`,
    deepDive: `La fiscalità del fine wine è uno dei temi più sottovalutati dagli investitori italiani e più strategici per chi opera a livello internazionale. La differenza tra un'ottimizzazione fiscale ben strutturata e una gestione casuale può valere il 15–28% del rendimento lordo.

L'Italia ha il regime più ambiguo. Il vino è classificato come 'bene mobile' e le plusvalenze da cessione possedute per oltre 5 anni non sono tassate nella maggior parte dei casi. Tuttavia, se l'attività di acquisto/vendita è sistematica, potrebbe essere classificata diversamente. La soglia tra "collezionista" e "commerciante" non è chiaramente definita — la consulenza di un fiscalista specializzato è imprescindibile.

Il UK è il mercato più trasparente ma con il trattamento fiscale meno favorevole: il CGT al 28% erode significativamente i rendimenti. La struttura più efficiente è detenere il vino tramite una holding con corporate tax al 19%.

La Svizzera e Hong Kong sono i paradisi fiscali del fine wine: nessuna CGT privata. Non a caso Ginevra e Hong Kong sono i principali hub del mercato secondario globale.`,
    caseStudies: [
      { wine: "Investitore italiano — bene mobile >5 anni", buy: null, sell: null, year_buy: 2015, year_sell: 2024, roi: "Scenario illustrativo — regime bene mobile favorevole", note: "9 anni di possesso come bene mobile. In Italia, le plusvalenze da vino posseduto oltre 5 anni sono spesso non tassate — ma il regime esatto dipende dalla struttura dell'attività. Consultare un fiscalista specializzato." },
      { wine: "Investitore UK — CGT 28% higher rate", buy: null, sell: null, year_buy: 2015, year_sell: 2024, roi: "Scenario illustrativo — CGT erode significativamente il rendimento netto", note: "Il CGT al 28% (higher rate taxpayer) erode una quota significativa del rendimento lordo. La struttura holding con corporate tax 19% è spesso più efficiente per portfolio >£50.000 — verificare con un fiscalista UK." },
    ],
    techniques: [
      "In Italia: tieni il vino >5 anni — la soglia è critica per il regime favorevole",
      "In UK: holding company per portfolio >£50.000 — corporate tax 19% batte CGT 28%",
      "Compra e vendi in bond: eviti VAT su tutta la catena",
      "Documenta tutto: fatture, inventario con date, catena di custodia",
    ],
    exercise: {
      title: "Calcolo CGT investitore UK vs. italiano",
      steps: [
        "Scenario: acquisto €30.000 Bordeaux nel 2018, vendita €65.000 nel 2025",
        "Plusvalenza: €35.000",
        "UK: applica CGT 28% su (€35.000 - £3.000 exemption). Qual è l'imposta?",
        "Italia: possesso 7 anni — qual è l'imposta potenziale?",
        "Confronta il rendimento netto nei due scenari",
      ]
    },
    keyPoints: [
      "Italia: bene mobile — plusvalenze spesso non tassate dopo 5 anni (consulta fiscalista)",
      "UK: CGT 28% (higher rate) — annual exemption ora solo £3.000",
      "USA: collectibles 28% long-term — regime meno favorevole degli equity",
      "Svizzera e HK: nessuna CGT privata — hub principali del fine wine investing",
      "UK holding company: corporate tax 19% batte CGT 28% per portfolio >£50.000",
    ],
    quiz: [
      { q: "In USA, come è classificato il vino d'investimento secondo l'IRS?", options: ["Equity alternativo", "Real estate", "Collectible (tassato al 28%)", "Commodity"], correct: 2 },
      { q: "Qual è la CGT rate per 'higher rate taxpayer' UK 2024 sul fine wine?", options: ["10%", "18%", "28%", "40%"], correct: 2 },
      { q: "In quale paese non esiste CGT sulle plusvalenze private da fine wine?", options: ["Italia", "Germania", "Francia", "Svizzera"], correct: 3 },
      { q: "Cosa significa comprare vino 'in bond' fiscalmente?", options: ["Esente da tutte le tasse", "VAT e duty non pagati — si pagano solo all'uscita", "Esente da CGT", "Detenuto in trust fiscale"], correct: 1 },
      { q: "Per ottimizzare la fiscalità UK >£50.000, quale struttura è consigliata?", options: ["Trust offshore", "Holding company (corporate tax 19% vs. CGT 28%)", "ISA stocks & shares", "SIPPS pension"], correct: 1 },
    ],
  },
  // ── Module 17: Portfolio simulato ─────────────────────────────────────────────
  {
    id: "rs_17", courseId: 11, index: 16,
    title: "Portfolio simulato 2010–2024: costruzione e gestione step by step",
    duration: 18,
    youtube: null,
    hero: { headline: "Portfolio simulato 2010–2024: costruzione e gestione step by step con strategia buy-and-hold selettivo", stat: "Questo modulo mostra come si costruisce e gestisce un portfolio fine wine nel tempo — decisioni, errori e principi estratti", context: "Questo modulo costruisce un portfolio simulato dal 2010 al 2024. Ogni decisione di acquisto/vendita è giustificata con i dati di mercato disponibili al momento. I numeri specifici sono illustrativi — i principi sono reali." },
    objectives: ["Costruire un portfolio fine wine da €20.000 con allocazione ottimale", "Gestire il portfolio dinamicamente nel corso di 14 anni", "Analizzare le decisioni corrette e gli errori in retrospettiva", "Estrarre principi replicabili per la propria strategia"],
    context: "Il portfolio simulato applica i principi dei moduli precedenti a un caso concreto. I prezzi specifici sono illustrativi — i principi di diversificazione, ribilanciamento e timing sono quelli che un investitore informato avrebbe potuto applicare.",
    slides: [
      { title: "La costruzione iniziale (2010): €20.000", body: "Allocazione: Bordeaux 50% (€10k), Borgogna 20% (€4k), Italia 20% (€4k), Champagne 10% (€2k). Vini: Léoville Barton 2005 (6bt), DRC Nuits-St-Georges 2009 (3bt), Barolo Gaja 2007 (6bt), Cristal 2004 (3bt)." },
      { title: "Anno 1–3 (2010–2012): crescita e correzione", body: "Il portfolio cresce nel 2011. Nel 2012: il Bordeaux corregge significativamente. Azione: riduzione Bordeaux al 35%, aumento Italia al 30%. Decisione giustificata dai segnali di divergenza degli indici Liv-ex." },
      { title: "Anno 4–6 (2013–2015): divergenza Italia-Bordeaux", body: "Il Bordeaux continua a sottoperformare dal 2011. L'Italia accelera. Azione 2013: vendita parziale del Bordeaux in utile, acquisto Brunello Ciacci 2010 EP. La rotazione tempestiva evita perdite maggiori." },
      { title: "Anno 7–9 (2016–2018): rally Borgogna", body: "Il Burgundy 150 registra forte apprezzamento in 3 anni. La posizione DRC è cresciuta molto dal prezzo di acquisto. Decisione: vendita parziale a oltre +100% di profitto, mantenendo l'esposizione residua." },
      { title: "Anno 10–12 (2019–2021): Champagne e ribilanciamento", body: "Il Champagne 50 decolla come indice. La posizione Cristal ha moltiplicato il valore dall'acquisto iniziale. Metà venduta in novembre 2021 in grande season d'aste. Portfolio in forte crescita." },
      { title: "Anno 13–14 (2022–2024): ottimizzazione", body: "Ribilanciamento verso Italia e mercati emergenti. Riduzione Bordeaux residuo. Vendita strategica autunnale ottobre 2023. Portfolio finale con rendimento molto superiore al Liv-ex Fine Wine 1000 nello stesso periodo." },
      { title: "Analisi degli errori", body: "Errore 1: Bordeaux mantenuto troppo a lungo (2012–2014) — costo opportunità significativo. Errore 2: Champagne comprato in ritardo rispetto ai segnali Liv-ex. Errore 3: timing stagionale non sfruttato sistematicamente." },
      { title: "I principi estratti", body: "1. Ribilancia ogni 2–3 anni seguendo Liv-ex. 2. Vendi parzialmente a +100%. 3. Max 50% su una sola regione. 4. Il timing stagionale aggiunge valore. 5. La provenance vale un premium significativo in vendita." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Portfolio simulato 2010–2024 — schema illustrativo</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,155 70,148 100,130 130,135 160,118 190,100 220,82 250,68 280,58 310,52 340,46 370,42" fill="none" stroke="#C9A227" strokeWidth="3"/><text x="372" y="46" fill="#C9A227" fontSize="9">↑</text><text x="40" y="188" fill="#475569" fontSize="7">2010</text><text x="355" y="188" fill="#475569" fontSize="7">2024</text></svg>`,
    deepDive: `Il portfolio simulato è la sintesi pratica di tutti i principi dei moduli precedenti. L'obiettivo non è mostrare risultati straordinari — ma documentare come un investitore informato, che ha applicato disciplinatamente i principi di diversificazione, timing e ribilanciamento, avrebbe outperformato il benchmark.

La decisione più importante è stata nel 2012–2013: riconoscere che il Bordeaux stava sottoperformando strutturalmente e ruotare verso l'Italia. L'Italy 100 è stato il segmento più performante degli anni successivi. Chi ha ignorato il segnale dell'indice Liv-ex ha sottoperformato significativamente nel periodo 2012–2018.

Il secondo errore evitato è stato quello di non vendere in modo disciplinato. La vendita parziale DRC a oltre +100% nel 2018 ha fornito liquidità per entrare nel Champagne nel 2019, che ha ulteriormente performato.

Il valore aggiunto dell'asset selection attiva, del timing e del ribilanciamento si misura nel delta tra il rendimento del portfolio simulato e il rendimento del Liv-ex Fine Wine 1000 nello stesso periodo. I numeri specifici sono illustrativi — il principio è documentato dalla letteratura accademica sul fine wine investing.`,
    caseStudies: [
      { wine: "Portfolio €20.000 — risultato 2010–2024", buy: 20000, sell: null, year_buy: 2010, year_sell: 2024, roi: "Forte outperformance vs. Liv-ex Fine Wine 1000", note: "14 anni, circa 22 transazioni, 4 ribilanciamenti. La diversificazione ha limitato il max drawdown — i numeri esatti sono illustrativi." },
      { wine: "Sottoperiodo migliore: 2019–2021", buy: null, sell: null, year_buy: 2019, year_sell: 2021, roi: "Forte crescita in 2 anni", note: "Rally Champagne + Italy 100. Il ribilanciamento preventivo ha massimizzato l'esposizione ai segmenti in outperformance." },
    ],
    techniques: [
      "Ribilancia ogni 2–3 anni: segui i segnali Liv-ex, non le emozioni",
      "Vendita parziale a +100%: cristallizza il guadagno, mantieni l'esposizione residua",
      "Max 50% su un solo segmento: mai concentrare oltre quella soglia",
      "Documenta ogni transazione: la provenance chain si accumula nel tempo",
    ],
    exercise: {
      title: "Costruisci il tuo portfolio da €10.000",
      steps: [
        "Definisci l'allocazione regionale (Bordeaux %, Borgogna %, Italia %, Champagne %)",
        "Per ciascuna categoria, scegli 2–3 vini con annata, produttore e prezzo attuale",
        "Verifica la liquidità di ciascun vino su Liv-ex o Wine-Searcher",
        "Stima il rendimento atteso a 8 anni con i CAGR storici Liv-ex",
        "Pianifica i ribilanciamenti: quando cambieresti l'allocazione se Italy 100 sovraperforma del 20%?",
      ]
    },
    keyPoints: [
      "Portfolio simulato da €20k con forte outperformance vs. Liv-ex Fine Wine 1000 — replicabile con disciplina",
      "La rotazione Bordeaux → Italia nel 2012–2013 è la decisione più impattante dell'intero periodo",
      "Vendita parziale a +100%: il principio cardine per azzerare il rischio",
      "Il ribilanciamento ogni 2–3 anni è il fattore che ha prodotto il maggiore delta vs. buy-and-hold puro",
      "La diversificazione ha contenuto il max drawdown vs. Bordeaux puro durante la correzione 2012–2014",
    ],
    quiz: [
      { q: "Qual è la decisione più impattante nel portfolio simulato 2010–2024?", options: ["Acquistare DRC nel 2010", "Ruotare da Bordeaux a Italia nel 2012–2013", "Comprare Champagne nel 2019", "Vendere tutto nel 2021"], correct: 1 },
      { q: "La vendita parziale a +100% serve a:", options: ["Ridurre le tasse", "Cristallizzare il guadagno e ridurre il rischio mantenendo l'esposizione", "Rispettare normativa Liv-ex", "Ottimizzare i costi di storage"], correct: 1 },
      { q: "Come ha contenuto le perdite la diversificazione durante la correzione 2012–2014?", options: ["Non ha fatto differenza", "Riducendo l'esposizione al solo Bordeaux, che ha corretto significativamente", "Aumentando la liquidità disponibile", "Grazie al timing mensile"], correct: 1 },
      { q: "Perché il ribilanciamento ogni 2–3 anni è considerato il fattore più importante?", options: ["Riduce i costi di storage", "Permette di ruotare verso i segmenti in outperformance seguendo i segnali Liv-ex", "È richiesto dalla normativa", "Ottimizza i tempi di pagamento delle commissioni"], correct: 1 },
      { q: "Il valore aggiunto dell'asset selection attiva rispetto all'indice è dovuto a:", options: ["Solo alla fortuna sulle annate", "Asset selection attiva, timing e ribilanciamento disciplinato", "Leva finanziaria", "Concentrazione su un solo segmento"], correct: 1 },
    ],
  },
  // ── Module 18: Casi studio ────────────────────────────────────────────────────
  {
    id: "rs_18", courseId: 11, index: 17,
    title: "Casi studio: Petrus, Romanée-Conti, Sassicaia — i +1000% documentati",
    duration: 16,
    youtube: null,
    hero: { headline: "I vini che hanno fatto +1000%: cosa li accomuna e come riconoscere i pattern in anticipo", stat: "Petrus 1982, DRC Romanée-Conti 1990, Sassicaia 1985: i casi più documentati di rendimento straordinario nel fine wine", context: "Questo modulo analizza i casi studio di vini che hanno superato rendimenti eccezionali nel lungo periodo. L'obiettivo è identificare i 4 pattern comuni. I prezzi specifici variano per fonte e condizione — i principi sono reali." },
    objectives: ["Analizzare i 5 casi studio più importanti (+1000%) con dati reali", "Identificare i 4 pattern comuni che precedono questi rendimenti estremi", "Capire se e come questi pattern sono ancora riproducibili oggi", "Valutare il ruolo della fortuna vs. della strategia nei rendimenti estremi"],
    context: "I rendimenti >1000% nel fine wine non sono casuali. L'analisi dei casi documentati mostra pattern ricorrenti: scarsità strutturale + riconoscimento critico tardivo + domanda geografica emergente + catalizzatore di prezzo specifico. Riconoscere questi pattern in anticipo è la competenza più rara.",
    slides: [
      { title: "Petrus 1982: il caso paradigmatico", body: "Pomerol 100% Merlot. Parker: uno dei vini più perfetti mai prodotti (100pt assegnati nel 1995). Il prezzo è cresciuto in modo straordinario dalla metà degli anni '90 ad oggi. Cause: annata 1982 rivalutata continuamente, domanda asiatica, scarsità assoluta (~5.000 casse totali). Prezzi aggiornati su Sotheby's Wine e Christie's." },
      { title: "Romanée-Conti Grand Cru 1990", body: "DRC La Romanée-Conti: 1.8 ha, ~6.000 bt/anno. 1990 Parker 99pt. Il prezzo ha raggiunto livelli straordinari nelle aste internazionali. Causa: scarsità fisica assoluta + domanda globale illimitata. I valori correnti variano per annata e condizione — consultare Sotheby's per le stime aggiornate." },
      { title: "Sassicaia 1985: il '100 parker' italiano", body: "Il primo vino italiano a 100pt Parker (assegnati nel 1994). Il prezzo si è moltiplicato molte volte rispetto ai valori degli anni '90. Cause: riconoscimento critico tardivo, pioniere del Super Tuscan, icona culturale italiana. Prezzi aggiornati su Liv-ex e Wine-Searcher." },
      { title: "Screaming Eagle 1992: il Cult Cabernet originale", body: "Prima annata. Jean Phillips produceva per hobby. Parker: 99pt. Partito dalla mailing list, ha raggiunto valori d'asta straordinari nel corso degli anni. Causa: scarsità estrema (circa 600 casse), 99pt Parker, primo cult wine della storia moderna." },
      { title: "Penfolds Grange 1971: il primo grande australiano", body: "Considerato il Petrus australiano. Max Schubert lo produsse in segreto dopo che la direzione aveva ordinato di smettere. Ha registrato apprezzamenti enormi dalla prima commercializzazione agli anni più recenti. Causa: storia leggendaria, Parker 100, domanda collezionistica globale." },
      { title: "I 4 pattern dei +1000%", body: "1. Scarsità strutturale (non artificiale): produzioni fisicamente irripetibili. 2. Riconoscimento critico tardivo: Parker o Suckling assegnano 98–100pt anni dopo il rilascio. 3. Domanda geografica emergente: un nuovo mercato 'scopre' il vino. 4. Catalizzatore narrativo: una storia, un record d'asta, un endorsement che crea viralità." },
      { title: "Dove cercare i prossimi +1000%", body: "Candidati attuali (pattern presenti, non garanzie): Pétrus annate 1989–1996 ancora sul secondario. Brunello Soldera 2004–2010 (scarsità + 100pt + narrativa). Rayas Châteauneuf 1990–2000. DRC Richebourg annate 2000–2005. Barolo Conterno Monfortino 1996–2004." },
      { title: "Il ruolo della fortuna vs. strategia", body: "Onestà accademica: chi ha comprato Petrus 1982 nel 1995 non sapeva che avrebbe prodotto un apprezzamento eccezionale. Ma ha applicato un framework valido: vino iconico, annata leggendaria, prezzo ancora ragionevole. La strategia ha aumentato le probabilità. Il risultato straordinario ha richiesto anche 29 anni di pazienza." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Casi studio: apprezzamento relativo (illustrativo)</text><rect x="30" y="100" width="60" height="60" fill="#ef4444" opacity="0.8" rx="4"/><rect x="105" y="40" width="60" height="120" fill="#C9A227" opacity="0.9" rx="4"/><rect x="180" y="80" width="60" height="80" fill="#a78bfa" opacity="0.8" rx="4"/><rect x="255" y="120" width="60" height="40" fill="#4ade80" opacity="0.8" rx="4"/><rect x="330" y="90" width="50" height="70" fill="#60a5fa" opacity="0.8" rx="4"/><text x="60" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Petrus 82</text><text x="135" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">DRC RC 90</text><text x="210" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Sassicaia 85</text><text x="285" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">SE 1992</text><text x="355" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Grange 71</text><text x="60" y="94" fill="#e2e8f0" fontSize="8" textAnchor="middle">↑↑↑</text><text x="135" y="34" fill="#e2e8f0" fontSize="8" textAnchor="middle">↑↑↑</text><text x="210" y="74" fill="#e2e8f0" fontSize="8" textAnchor="middle">↑↑↑</text><text x="285" y="114" fill="#e2e8f0" fontSize="8" textAnchor="middle">↑↑↑</text><text x="355" y="84" fill="#e2e8f0" fontSize="8" textAnchor="middle">↑↑↑</text></svg>`,
    deepDive: `I rendimenti superiori al 1000% nel fine wine non sono miti — sono documentati da registri d'asta pubblici, dati Liv-ex e archivi di mercato. Ma comprendere questi casi richiede onestà intellettuale su cosa è stato fortuna e cosa è stata strategia.

Petrus 1982 è il caso più studiato. Il vino era già considerato eccellente nel 1982, ma la sua statura leggendaria è emersa gradualmente nel corso degli anni. Parker ha assegnato 100 punti nel 1995 — 13 anni dopo la vendemmia. L'effetto è stato immediato: i prezzi sono saliti del 40% in 12 mesi. Chi aveva comprato nel 1994 al prezzo pre-retrorating ha goduto di questo catalizzatore. La lezione: i retrorating di Parker su annate storiche sono segnali di acquisto anticipatori, se il vino è ancora accessibile.

Romanée-Conti Grand Cru è un caso diverso. Qui la scarsità è assoluta e non creata artificialmente: 1.8 ettari producono circa 6.000 bottiglie per annata — meno di qualsiasi altro Grand Cru borgognone di reputazione equivalente. Il prezzo è cresciuto con la domanda globale perché l'offerta non può crescere. Il pattern è chiaro: domanda illimitata + offerta fisicamente limitata = apprezzamento strutturale. Non ci sarà mai abbastanza Romanée-Conti per tutti i collezionisti del mondo.

Sassicaia 1985 illustra il potere del 'riconoscimento tardivo'. Il vino era già eccellente, ma il mercato non lo sapeva. Quando Parker ha assegnato 100 punti nel 1994 — nove anni dopo la vendemmia — il prezzo ha reagito violentemente. Chi aveva comprato prima del riconoscimento ha ottenuto ritorni straordinari. Chi ha comprato dopo ha comunque ottenuto buoni ritorni, ma il momento del massimo vantaggio era già passato.`,
    caseStudies: [
      { wine: "Petrus 1982 — apprezzamento documentato", buy: null, sell: null, year_buy: 1995, year_sell: 2024, roi: "Rendimento >1000% nel periodo documentato", note: "Parker 100pt assegnati nel 1995, 13 anni dopo la vendemmia. La retrorating è stata il catalizzatore principale. Prezzi aggiornati su Sotheby's Wine e Christie's." },
      { wine: "Sassicaia 1985 — il 100pt italiano", buy: null, sell: null, year_buy: 1990, year_sell: 2024, roi: "Rendimento >1000% nel periodo documentato", note: "Primo 100pt Parker per un vino italiano (riconoscimento nel 1994). Il riconoscimento tardivo ha prodotto un turning point netto nei prezzi." },
    ],
    techniques: [
      "Retrorating Parker su vini storici: segnale di acquisto se il vino è ancora accessibile",
      "Scarsità fisica assoluta (DRC, Petrus): comprare e dimenticare — l'apprezzamento è strutturale",
      "Identifica i 4 pattern (scarsità + critica tardiva + domanda geografica + catalizzatore) nei vini giovani",
      "La pazienza è la competenza più rara: i rendimenti >1000% richiedono 20–30 anni di hold",
    ],
    exercise: {
      title: "Analisi dei 4 pattern su vini attuali",
      steps: [
        "Scegli 3 vini con prezzi attuali <€200/bt che ritieni sottovalutati",
        "Per ciascuno, verifica la presenza dei 4 pattern: scarsità strutturale, punteggi in crescita, domanda geografica, catalizzatore narrativo",
        "Quanti dei 4 pattern sono presenti per ciascun vino?",
        "Stima il potenziale di apprezzamento a 15 anni se tutti i pattern si concretizzassero",
        "Confronta con il rendimento del Liv-ex Italy 100 atteso — quale offre il miglior risk/reward?",
      ]
    },
    keyPoints: [
      "Petrus 1982: catalizzatore principale fu la retrorating Parker 100pt nel 1995 — 13 anni dopo la vendemmia",
      "DRC Romanée-Conti: scarsità fisica assoluta (1.8 ha, ~6.000 bt) = apprezzamento strutturale impossibile da replicare",
      "I 4 pattern: scarsità + riconoscimento tardivo + domanda geografica emergente + catalizzatore narrativo",
      "La fortuna conta — ma la strategia aumenta la probabilità di intercettare i pattern giusti",
      "Orizzonte 20–30 anni: la pazienza è la competenza più rara e più remunerativa nel fine wine",
    ],
    quiz: [
      { q: "In quale anno Parker ha assegnato 100pt a Petrus 1982?", options: ["1983", "1989", "1995", "2001"], correct: 2 },
      { q: "Quante bottiglie produce annualmente la Romanée-Conti Grand Cru?", options: ["~600 bt", "~6.000 bt", "~60.000 bt", "~600.000 bt"], correct: 1 },
      { q: "Sassicaia 1985 è stato il primo vino italiano a ottenere:", options: ["Il Grand Cru status europeo", "100 punti da Robert Parker", "Il Tre Bicchieri del Gambero Rosso", "La DOC Bolgheri"], correct: 1 },
      { q: "Quale dei 4 pattern è il più potente combinato con la scarsità strutturale?", options: ["La storia del produttore", "Il riconoscimento critico tardivo (retrorating) che catalizza un turning point nei prezzi", "La domanda geografica emergente", "Il catalizzatore narrativo da media"], correct: 1 },
      { q: "Perché i rendimenti >1000% nel fine wine richiedono un orizzonte di 20-30 anni?", options: ["È una norma fiscale", "Il mercato del fine wine assorbe l'informazione lentamente e la domanda cresce gradualmente", "I vini non si possono vendere prima", "È un requisito Liv-ex"], correct: 1 },
    ],
  },
  // ── Module 19: Errori comuni ──────────────────────────────────────────────────
  {
    id: "rs_19", courseId: 11, index: 18,
    title: "Errori comuni: le 7 trappole che distruggono il rendimento",
    duration: 14,
    youtube: null,
    hero: { headline: "Errore n.1: comprare in asta senza calcolare il buyer's premium. Errore n.2: non calcolare il costo carry", stat: "La maggioranza degli investitori retail sottoperforma gli indici Liv-ex — non per scelte di vini sbagliate, ma per errori strutturali", context: "La maggioranza degli investitori retail in fine wine sottoperforma gli indici Liv-ex. La causa non è la scelta dei vini — è la combinazione di errori strutturali replicati sistematicamente. Questo modulo li identifica e insegna a evitarli." },
    objectives: ["Identificare i 7 errori più comuni e quantificare il loro impatto sul rendimento", "Capire i bias cognitivi che portano a questi errori", "Costruire un processo decisionale che li previene strutturalmente", "Imparare dai fallimenti reali documentati"],
    context: "Gli errori nel fine wine investing hanno caratteristiche comuni con quelli nel mercato azionario: eccessiva fiducia, bias di conferma, avversione alle perdite, effetto gregge. Ma ci sono anche errori specifici al settore che derivano dalla sua opacità e dalla mancanza di informazioni standardizzate.",
    slides: [
      { title: "Errore 1: Comprare in asta senza calcolare il buyer's premium", body: "Il buyer's premium (20–25%) è il costo più frainteso. Un vino a €1.000 hammer price costa realmente €1.225. Molti investitori confrontano il hammer price con il Liv-ex bid — errore. Il break-even reale è molto più alto di quanto percepito al momento dell'acquisto." },
      { title: "Errore 2: Ignorare il costo di carry", body: "Il costo di storage + assicurazione su 10 anni supera il 15% del capitale. Chi non lo calcola ex-ante crede di guadagnare il 50% e in realtà guadagna il 35%. Il rendimento lordo non è mai uguale al rendimento netto." },
      { title: "Errore 3: Concentrarsi su un solo segmento", body: "Il Bordeaux è il segmento più conosciuto — ma ha sottoperformato tutti gli altri indici tra 2011 e 2018. Chi aveva il 100% in Bordeaux ha perso il rally Italia, Borgogna, Champagne. La diversificazione regionale non è opzionale." },
      { title: "Errore 4: Comprare in anni mediocri al prezzo delle annate eccezionali", body: "Il 2011, 2012, 2013 Bordeaux erano 'buone annate' con prezzi EP aggressivi. Chi ha comprato en primeur a prezzi simili al 2009 ha visto il secondario scendere del 20–35%. Compra solo se l'annata è oggettivamente eccezionale." },
      { title: "Errore 5: Non verificare la provenance", body: "Un vino senza provenance documentata vale il 20–40% in meno in asta. L'errore classico: acquistare da venditori privati senza storia di custodia, poi scoprire che il valore di rivendita è molto inferiore alle aspettative." },
      { title: "Errore 6: Vendere al momento sbagliato", body: "Vendere in agosto (prezzi -1.8%) invece di ottobre–novembre (+2.8%) sembra marginale — ma su un portfolio da €50.000 equivale a €2.300 di rendimento perso. La stagionalità della vendita è sistematicamente ignorata dagli investitori retail." },
      { title: "Errore 7: Aspettarsi liquidità immediata", body: "Il fine wine NON è un asset liquido. Una vendita tramite asta richiede 3–6 mesi. Una vendita su Liv-ex per vini non liquidi può richiedere settimane. Chi ha bisogno di liquidità a breve non dovrebbe investire in fine wine — o dovrebbe allocare solo una quota del portfolio che può immobilizzare per 7–12 anni." },
      { title: "Il meta-errore: sottovalutare la propria ignoranza", body: "Il fine wine ha una curva di apprendimento lunga. I collezionisti con 20 anni di esperienza hanno informazioni e network che un investitore retail non ha. Il modo migliore per mitigare questo gap: partire con volumi piccoli, imparare dai primi errori senza distruggersi, aumentare gradualmente la posizione." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Impatto dei 7 errori sul rendimento netto</text><line x1="30" y1="40" x2="30" y2="160" stroke="#1e3050" strokeWidth="1"/><line x1="30" y1="160" x2="370" y2="160" stroke="#1e3050" strokeWidth="1"/>${[12,15,10,20,8,5,15].map((v,i)=>`<rect x="${35+i*48}" y="${160-v*3}" width="35" height="${v*3}" fill="#ef4444" opacity="${0.6+i*0.04}" rx="3"/><text x="${52+i*48}" y="${175}" fill="#475569" fontSize="7" textAnchor="middle">E${i+1}</text><text x="${52+i*48}" y="${160-v*3-4}" fill="#ef4444" fontSize="7" textAnchor="middle">-${v}%</text>`).join("")}</svg>`,
    deepDive: `La maggioranza degli investitori retail in fine wine tende a sottoperformare gli indici Liv-ex. Il fine wine, come asset class, ha performato bene storicamente. Ma molti investitori non riescono a catturare quella performance.

Il motivo non è la sfortuna nella scelta delle annate. È la combinazione sistematica degli errori strutturali identificati in questo modulo. L'errore più costoso, quantitativamente, è il n.4: comprare en primeur in annate non eccezionali a prezzi aggressivi. Il caso 2011–2013 Bordeaux è il più documentato: chi ha comprato EP in quegli anni a prezzi simili al 2009 ha visto il secondario scendere significativamente in 3 anni. L'EP di Bordeaux non è un investimento sicuro — è una scommessa condizionata alla qualità dell'annata.

Il secondo errore più costoso è l'Errore 3: la concentrazione su Bordeaux. Non perché il Bordeaux sia un cattivo investimento — è il mercato più liquido del fine wine — ma perché la concentrazione eccessiva impedisce di catturare i rally degli altri segmenti. Chi aveva il 100% in Bordeaux tra il 2011 e il 2018 ha perso il rally del Burgundy 150 e il rally nascente dell'Italy 100.

Il meta-errore — sottovalutare la propria ignoranza — è il più difficile da combattere perché è invisibile. Il modo più efficace per mitigarlo è partire piccolo (€3.000–5.000), fare errori su importi gestibili, imparare dal mercato direttamente, e aumentare le posizioni solo dopo aver acquisito esperienza concreta.`,
    caseStudies: [
      { wine: "Investitore retail — portafoglio 100% Bordeaux 2011–2018", buy: null, sell: null, year_buy: 2011, year_sell: 2018, roi: "Perdita significativa vs. indice Liv-ex nello stesso periodo", note: "Concentrazione su un solo segmento + acquisto EP in annata non eccezionale. Errori 3 e 4 combinati — il Bordeaux ha corretto significativamente tra 2011 e 2014." },
      { wine: "Stesso investitore — senza costo carry", buy: null, sell: null, year_buy: 2018, year_sell: 2024, roi: "Recupero lordo quasi azzerato dai costi netti", note: "Recupero nel 2018–2024, ma costi carry e transazione hanno eroso quasi completamente il guadagno lordo. Errore 2 — il costo di carry va sempre calcolato ex-ante." },
    ],
    techniques: [
      "Calcola SEMPRE il costo di carry prima di qualsiasi acquisto — usa la formula: prezzo × 1.30 = break-even 10y",
      "Mai comprare EP in anni con Parker <96 su meno dell'80% dei châteaux — le annate mediocri sono trappole",
      "Diversifica: max 50% su un solo segmento, mai 100% Bordeaux",
      "Compra solo da fonti con provenance documentata — il risparmio su vini 'senza storia' non vale il rischio di rivendita",
    ],
    exercise: {
      title: "Audit del tuo approccio: quanti errori stai facendo?",
      steps: [
        "Per ciascuno dei 7 errori, valuta onestamente se lo stai facendo nel tuo portfolio (attuale o pianificato)",
        "Quantifica l'impatto stimato di ciascun errore sul tuo rendimento atteso",
        "Identifica l'errore con il maggiore impatto e costruisci un piano specifico per eliminarlo",
        "Scrivi 3 regole personali di investimento che prevengano i tuoi errori specifici",
        "Rivedi queste regole tra 12 mesi: hai rispettato le tue stesse regole?",
      ]
    },
    keyPoints: [
      "La maggioranza degli investitori retail sottoperforma il Liv-ex 100 — la causa è sistematica, non casuale",
      "Errore più costoso: comprare EP in annate mediocri a prezzi aggressivi — il secondario scende significativamente",
      "Errore più sottovalutato: ignorare il costo carry (supera il 15% del capitale su 10 anni)",
      "Meta-errore: sottovalutare la propria ignoranza — inizia piccolo, impara, poi scala",
      "La diversificazione regionale non è opzionale: max 50% su un solo segmento",
    ],
    quiz: [
      { q: "Perché la maggioranza degli investitori retail sottoperforma il Liv-ex 100?", options: ["Scelgono vini sbagliati", "Combinano sistematicamente errori strutturali: costo carry ignorato, concentrazione eccessiva, EP in annate mediocre", "Hanno budget troppo piccolo", "Non usano Liv-ex"], correct: 1 },
      { q: "L'errore più costoso quantitativamente è:", options: ["Ignorare il buyer's premium", "Non verificare la provenance", "Comprare EP in annate mediocri a prezzi aggressivi", "Vendere in agosto"], correct: 2 },
      { q: "Il costo di carry su 10 anni supera tipicamente:", options: ["3% del capitale", "8% del capitale", "15% del capitale", "40% del capitale"], correct: 2 },
      { q: "Quale regola previene l'Errore 4 (annate mediocri)?", options: ["Compra solo First Growth", "Compra EP solo in annate con consenso critico unanime — evita le annate 'buone ma non eccezionali' a prezzi aggressivi", "Non comprare mai EP", "Compra solo vini italiani"], correct: 1 },
      { q: "Il fine wine richiede un orizzonte di investimento minimo di:", options: ["1–2 anni", "3–5 anni", "7–12 anni", "20+ anni obbligatori"], correct: 2 },
    ],
  },
  // ── Module 20: Piano d'azione personale ───────────────────────────────────────
  {
    id: "rs_20", courseId: 11, index: 19,
    title: "Piano d'azione personale: costruisci il tuo primo portfolio",
    duration: 20,
    youtube: null,
    hero: { headline: "Framework in 5 passi per un portfolio da €5.000 a €50.000 con orizzonte 10 anni", stat: "I principi di questo framework sono quelli dei moduli precedenti — applicati in modo disciplinato e personalizzato", context: "Questo è il modulo finale del corso. L'obiettivo è trasformare i 19 moduli di conoscenza in un piano d'azione concreto, personalizzato e immediatamente implementabile. Nessuna teoria aggiuntiva — solo azione." },
    objectives: ["Costruire il proprio portfolio fine wine in base al capitale e al profilo di rischio", "Definire la strategia di acquisto, gestione e vendita per i prossimi 10 anni", "Creare un sistema di monitoraggio e ribilanciamento personalizzato", "Identificare le prossime risorse e la community per continuare a crescere"],
    context: "Il piano d'azione è personale: dipende dal tuo capitale disponibile, dal tuo orizzonte temporale, dalla tua tolleranza al rischio e dal tempo che vuoi dedicare alla gestione attiva. Questo modulo offre un framework adattabile, non una soluzione unica.",
    slides: [
      { title: "Passo 1: Definisci il tuo profilo", body: "Capitale disponibile: da €3.000 (entry level) a €100.000+ (professionista). Orizzonte: minimo 7 anni, ottimale 10–15. Tolleranza al rischio: conservativo (Bordeaux First Growth, poca volatilità) vs. aggressivo (emerging markets, cult wines). Tempo: passive (2h/mese) vs. attiva (4–8h/mese)." },
      { title: "Passo 2: L'allocazione iniziale per fascia", body: "€3k–10k: 1–2 regioni, max 4 vini, focus qualità non quantità. €10k–30k: 3 regioni, 6–10 vini, primo ribilanciamento dopo 2 anni. €30k–100k: 4+ regioni, 15–25 vini, gestione semi-attiva. >€100k: diversificazione completa, potenziale struttura holding." },
      { title: "Passo 3: I primi 3 acquisti", body: "Primo acquisto: vino liquido su Liv-ex, annata top, produttore riconosciuto (es. Léoville Barton 2016, Lynch-Bages 2018, Barolo Gaja 2016). Secondo acquisto: stessa logica, regione diversa. Terzo acquisto: più rischioso, candidato emergente. Impara progressivamente." },
      { title: "Passo 4: Il sistema di monitoraggio", body: "Mensile: controlla i prezzi Liv-ex dei tuoi vini (15 minuti). Trimestrale: confronta performance vs. indice di riferimento. Annuale: valutazione completa portfolio, decisione di ribilanciamento. Strumenti: liv-ex.com, Wine-Searcher, CellarTracker (gratuiti)." },
      { title: "Passo 5: Quando (e come) uscire", body: "Target di rendimento: definisci ex-ante (+60% netto, +80% netto). Quando raggiungi il target: vendi il 50%, mantieni il resto. Stop-loss concettuale: se un vino perde il 20% dal prezzo di acquisto dopo 3 anni, rivaluta. Documenta ogni decisione di exit — imparai più dalle uscite che dagli acquisti." },
      { title: "Il portafoglio €5.000 — esempio concreto", body: "50% Bordeaux (€2.500): Léoville Barton 2016 (6bt a €420). 25% Italia (€1.250): Barolo Mascarello 2016 (3bt a €420). 15% Borgogna (€750): Gevrey-Chambertin Rousseau 2017 (1bt a €750). 10% Champagne (€500): Cristal 2014 (1bt a €500). Totale: €2.390 reale + €2.610 di riserva." },
      { title: "Le risorse per continuare", body: "Informazione gratuita: liv-ex.com (dati mensili), Decanter.com (news e punteggi), Wine-Searcher.com (prezzi). Comunità: Liv-ex forum, Reddit r/wine (sezione investment), Discord VinoInvest (link nel profilo). Formazione avanzata: Weinakademie WSET, Wine MBA dei collezionisti." },
      { title: "Il manifesto dell'investitore in vino", body: "1. Compra solo quello che capisci. 2. Calcola sempre il rendimento netto, non lordo. 3. La pazienza è la competenza più remunerativa. 4. Diversifica: il tuo ego non è una strategia. 5. Impara dagli errori — ne farai. 6. Il fine wine è un viaggio, non una transazione. Goditi anche il vino." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Portfolio €5.000 — allocazione iniziale</text><circle cx="200" cy="110" r="70" fill="none" stroke="#1e3050" strokeWidth="1"/><path d="M200 110 L200 40 A70 70 0 0 1 270 145 Z" fill="#3b82f6" opacity="0.8"/><path d="M200 110 L270 145 A70 70 0 0 1 165 178 Z" fill="#4ade80" opacity="0.8"/><path d="M200 110 L165 178 A70 70 0 0 1 132 65 Z" fill="#a78bfa" opacity="0.8"/><path d="M200 110 L132 65 A70 70 0 0 1 200 40 Z" fill="#f9a8d4" opacity="0.8"/><text x="240" y="90" fill="#e2e8f0" fontSize="9">Bordeaux 50%</text><text x="235" y="165" fill="#e2e8f0" fontSize="9">Italia 25%</text><text x="110" y="145" fill="#e2e8f0" fontSize="9">Borgogna 15%</text><text x="148" y="55" fill="#e2e8f0" fontSize="9">Champagne 10%</text></svg>`,
    deepDive: `Questo è il momento in cui la conoscenza si trasforma in azione. Hai completato 19 moduli che coprono ogni aspetto del fine wine investing — dai mercati regionali alla fiscalità, dalla stagionalità alla costruzione del portfolio. Il rischio a questo punto non è la mancanza di conoscenza — è la paralisi da analisi.

Il principio fondamentale del piano d'azione è la progressività. Non iniziare con tutto il capitale disponibile. Inizia con il 20–30% del budget che hai deciso di allocare al fine wine, fai i tuoi primi acquisti con questi fondi, impara dal mercato direttamente, e aggiungi capitale solo dopo aver acquisito confidenza con il processo.

Il primo acquisto è il più importante — non per il rendimento che genererà, ma per quello che ti insegnerà. Scegliere un vino, trovare un merchant, completare la transazione, impostare il monitoraggio: questi processi pratici valgono più di qualsiasi teoria aggiuntiva.

Il sistema di monitoraggio è l'infrastruttura della tua strategia. Quindici minuti al mese su Liv-ex e Wine-Searcher sono sufficienti per tenere traccia di un portfolio piccolo. Trenta minuti al trimestre per il confronto con gli indici. Una giornata all'anno per la revisione completa e le decisioni di ribilanciamento. Non di più — il fine wine è un asset di lungo periodo, non un'attività di trading quotidiano.

Il manifesto finale non è retorica. "La pazienza è la competenza più remunerativa" è un dato empirico documentato dai rendimenti a lungo termine del mercato. I rendimenti del fine wine emergono su orizzonti di 7–15 anni, non di 7–15 mesi. Chi ha quella pazienza, abbinata alla disciplina di un processo strutturato, ha tutte le condizioni per ottenere rendimenti superiori agli indici di riferimento.`,
    caseStudies: [
      { wine: "Portfolio entry-level €5.000 — simulazione 10 anni", buy: 5000, sell: null, year_buy: 2024, year_sell: 2034, roi: "Rendimento atteso variabile — dipende da annate scelte, timing e ribilanciamento", note: "Allocazione diversificata 4 regioni. I rendimenti passati del Liv-ex non garantiscono rendimenti futuri — la disciplina nel processo è il fattore più controllabile." },
      { wine: "Investitore disciplinato — applicazione framework completo", buy: null, sell: null, year_buy: 2015, year_sell: 2024, roi: "Forte outperformance vs. indice", note: "Caso illustrativo. Applica ribilanciamento, timing stagionale, exit disciplinata — i principi di questo corso applicati con coerenza nel tempo." },
    ],
    techniques: [
      "Inizia con il 20–30% del budget totale — impara prima di scalare",
      "I primi 3 acquisti: vino liquido Liv-ex + produttore riconosciuto + annata top",
      "Sistema di monitoraggio: 15min/mese (prezzi), 30min/trimestre (performance), 1 giorno/anno (ribilanciamento)",
      "Scrivi il tuo manifesto personale: 5 regole che riflettono la TUA strategia e i TUOI obiettivi",
    ],
    exercise: {
      title: "Il tuo piano d'azione personale in 5 passi",
      steps: [
        "Completa il profilo investitore: capitale (€), orizzonte (anni), tolleranza rischio (1–10), ore/mese disponibili",
        "Definisci l'allocazione regionale iniziale per il tuo capitale (usa le linee guida del modulo)",
        "Scegli i tuoi primi 3 vini specifici: produttore, annata, prezzo attuale, canale di acquisto",
        "Scrivi il tuo piano di monitoraggio: quando guardi i prezzi, quando ribilanci, quando esci",
        "Fissa la prima azione concreta: 'entro 30 giorni farò ___'",
      ]
    },
    keyPoints: [
      "Inizia con il 20–30% del budget — la progressività è la strategia più sicura",
      "Il primo acquisto insegna più di qualsiasi teoria — scegli un vino liquido, produttore riconosciuto, annata top",
      "Sistema di monitoraggio: 15min/mese + 30min/trimestre + 1 giorno/anno",
      "La pazienza è la competenza più remunerativa — i rendimenti emergono su 7–15 anni",
      "Goditi anche il vino: il fine wine è un viaggio, non solo una transazione finanziaria",
    ],
    quiz: [
      { q: "Quale percentuale del budget è consigliata per i primi acquisti?", options: ["100% (entra subito al massimo)", "50%", "20–30% (impara prima di scalare)", "5% (troppo piccolo per avere impatto)"], correct: 2 },
      { q: "Per un portfolio €5.000, quante regioni è consigliato coprire inizialmente?", options: ["1 (massima concentrazione)", "1–2 (entry level)", "5–6 (massima diversificazione)", "Solo Bordeaux per il primo anno"], correct: 1 },
      { q: "Il sistema di monitoraggio mensile richiede circa:", options: ["1 minuto", "15 minuti", "2–3 ore", "Monitoraggio quotidiano"], correct: 1 },
      { q: "L'orizzonte ottimale per il fine wine investing è:", options: ["1–2 anni", "3–5 anni", "7–15 anni", "30+ anni obbligatori"], correct: 2 },
      { q: "Cosa deve contenere un 'manifesto dell'investitore in vino' personalizzato?", options: ["Solo i vini da comprare", "Le proprie regole personali di investimento basate sulla propria strategia e obiettivi", "Una copia del framework Liv-ex", "Una lista di errori da evitare (sufficiente)"], correct: 1 },
    ],
  },
];

// Template for other premium courses — same 20-module structure
export function buildPremiumCourse(courseId, courseTitle, modules20) {
  return modules20.map((m, i) => ({
    id: `c${courseId}_${String(i + 1).padStart(2, "0")}`,
    courseId,
    index: i,
    title: m.title,
    duration: m.duration || 14,
    youtube: null,
    hero: { headline: m.title, stat: m.stat || "", context: `${courseTitle} — Modulo ${i + 1} di 20` },
    objectives: m.objectives || ["Analizzare i dati", "Applicare le tecniche", "Costruire la strategia", "Misurare i risultati"],
    context: m.context || `Modulo ${i + 1}: ${m.title}`,
    slides: m.slides || Array.from({ length: 8 }, (_, s) => ({ title: `Slide ${s + 1}`, body: `Contenuto slide ${s + 1}` })),
    mapSvg: m.mapSvg || `<svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="180" fill="#0b1220"/><text x="200" y="90" textAnchor="middle" fill="#C9A227" fontSize="12">Modulo ${i + 1}</text></svg>`,
    deepDive: m.deepDive || `Approfondimento modulo ${i + 1}: ${m.title}.`,
    caseStudies: m.caseStudies || [],
    techniques: m.techniques || [],
    exercise: m.exercise || { title: "Esercizio", steps: [] },
    keyPoints: m.keyPoints || [],
    quiz: m.quiz || Array.from({ length: 5 }, (_, q) => ({ q: `Domanda ${q + 1}`, options: ["A", "B", "C", "D"], correct: 0 })),
  }));
}

export async function getModulesForCourse(courseId) {
  if (courseId === 11) return RENDIMENTI_STORICI_MODULES;
  if (courseId <= 20) {
    const m = await _loadConsumerModules();
    return m[courseId] || [];
  }
  if (courseId <= 25) {
    const m = await _loadB2BModulesA();
    return m[courseId] || [];
  }
  const m = await _loadB2BModulesB();
  return m[courseId] || [];
}

export async function getModuleById(moduleId) {
  if (moduleId.startsWith("rs_")) {
    return RENDIMENTI_STORICI_MODULES.find(m => m.id === moduleId) || null;
  }
  const courseId = parseInt(moduleId.slice(1).split("_")[0]);
  const modules = await getModulesForCourse(courseId);
  return modules.find(m => m.id === moduleId) || null;
}
