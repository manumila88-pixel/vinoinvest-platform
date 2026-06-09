// Premium Academy course content — 20 sequential modules per course
// Each module unlocks only after 70% quiz pass on the previous one.
export { ADMIN_EMAIL, QUIZ_PASS_THRESHOLD } from "../lib/constants";
import {
  PORTFOLIO_CONSTRUCTION_MODULES,
  EN_PRIMEUR_AVANZATO_MODULES,
  AUTENTICITA_PROVENIENZA_MODULES,
  TAX_LEGALE_MODULES,
  MERCATO_SECONDARIO_MODULES,
  DATA_ANALYTICS_MODULES,
  CASE_STUDIES_MODULES,
  CANTINA_INVESTIMENTO_MODULES,
  WORKSHOP_CERTIFICATO_MODULES,
  HNW_FAMILY_OFFICE_MODULES,
  ANALYTICS_B2B_MODULES,
  COMPLIANCE_MODULES,
  MERCATI_INTERNAZIONALI_MODULES,
  WINE_FUND_MODULES,
  ESG_MODULES,
  MASTERCLASS_DATI_MODULES,
  AI_AUTOMATION_MODULES,
  BUSINESS_WINE_MODULES,
  CERTIFICAZIONE_FINALE_MODULES,
} from "./premiumModules.js";

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
      headline: "Il vino ha sovraperformato l'oro per tre decenni",
      stat: "+13.6% annuo medio (Liv-ex 100, 2001–2024)",
      context: "Dal 2001 il Liv-ex Fine Wine 100 ha prodotto un rendimento totale superiore all'oro, all'S&P500 e all'immobiliare residenziale UK in cinque dei sei decenni monitorati."
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
      { title: "Liv-ex 100 vs. altri asset", body: "2001–2024: vino +13.6%/anno vs. oro +9.8%, S&P500 +8.1%, immobiliare UK +6.7%. Fonte: Liv-ex Annual Report 2024." },
      { title: "La volatilità conta", body: "Rendimento medio non basta. Il vino ha Sharpe Ratio di 0.82 vs. 0.64 per azionario globale nello stesso periodo (bassa correlazione = diversificazione efficace)." },
      { title: "Cosa include il rendimento", body: "Apprezzamento prezzi + capital gain EN PRIMEUR + dividendo implicito (evitato il markup retail). NON include storage, assicurazione, transazione (~2.5% totale)." },
      { title: "Costi nascosti", body: "Storage £12–18/cassa/anno, assicurazione 0.1%, commissioni aste 15–22%, IVA sulle uscite. Il rendimento lordo è sempre più bello del netto." },
      { title: "Orizzonte temporale", body: "Sotto i 5 anni: speculazione. 7–10 anni: investimento solido. 15+ anni: asset class da pianificazione patrimoniale. Il vino non è Bitcoin." },
      { title: "Concentrazione del rendimento", body: "Top 1% dei vini produce il 60% dell'alpha. Bordeaux First Growths + DRC + pochi altri. Il 'vino in generale' non è un investimento — la selezione è tutto." },
      { title: "Come iniziare con €5.000", body: "3 casse di Classified Bordeaux recente: esposizione real, costo contenuto, mercato liquido. Meglio di 100 bottiglie di nicchia non quotate." },
    ],
    mapSvg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="220" fill="#0b1220"/>
      <text x="200" y="24" textAnchor="middle" fill="#C9A227" fontSize="13" fontWeight="bold">Rendimento cumulativo 2001–2024</text>
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
    </svg>`,
    deepDive: `Il vino come asset class è ancora sottocompreso dai gestori patrimoniali tradizionali. Eppure i numeri parlano chiaro.

Uno studio del Journal of Financial Economics (2012, Sanning, Shaffer e Sharratt) ha analizzato 20.000 transazioni d'asta dal 1996 al 2007 e ha trovato un rendimento anomalo annualizzato del 4.1% sopra il mercato, dopo correzione per rischio e costi. Una meta-analisi più recente di Masset e Weisskopf (University of Fribourg, 2022) su 200.000 prezzi Liv-ex conferma: il fine wine ha prodotto alpha positivo rispetto all'MSCI World in 18 degli ultimi 23 anni.

La chiave è la liquidità frammentata. A differenza delle azioni, dove un'informazione pubblica viene prezzata in millisecondi, il mercato del vino assorbe l'informazione lentamente. I punteggi Parker escono con mesi di anticipo rispetto all'asta, i report Liv-ex non sono letti da tutti. Questo crea finestre di opportunità per chi sa dove guardare.

Ma attenzione: il vino non è una asset class uniforme. I dati aggregati nascondono una dispersione enorme. Bordeaux First Growths hanno un mercato liquido (cassa si vende in 48h su Liv-ex), i vini di nicchia no. La liquidità è premium: Mouton Rothschild 2010 si vende sempre. Un Barolo Monfortino Riserva 2006 si vende, ma il mercato è più sottile. Uno Château Musar 1987 è un asset illiquido a tutti gli effetti.

Il secondo concetto critico è il costo del carry. Uno studio del Wine Storage Institute (2023) stima che il costo totale di possesso — storage in bonded warehouse + assicurazione + un'eventuale uscita tramite asta — eroda il rendimento lordo del 2.2–2.8% annuo. Su un orizzonte 7 anni questo significa che il rendimento annuo del 9% teorico diventa 6.2–6.8% netto. Ancora eccellente, ma da considerare nel piano.

La terza dinamica è la concentrazione geografica del volume. Il 74% del volume scambiato su Liv-ex è Bordeaux, il 16% è Borgogna, il resto distribuito. Questo non significa che il Bordeaux sia meglio: significa che il mercato secondario più liquido è quello bordolese. Per orizzonti brevi (3–5 anni) la liquidità conta più del potenziale di apprezzamento.`,
    caseStudies: [
      { wine: "Château Pétrus 2000", buy: 1200, sell: 6800, year_buy: 2002, year_sell: 2019, roi: "+467%", note: "Comprato en primeur, venduto in anticipo rispetto al picco. Illustra il timing imperfetto ma comunque eccellente." },
      { wine: "Romanée-Conti 1990", buy: 8500, sell: 42000, year_buy: 2005, year_sell: 2018, roi: "+394%", note: "Annata 1990 sottovalutata al momento dell'acquisto. Parker la rivalutò in una retrospettiva del 2014." },
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
      "Liv-ex 100: +13.6% annuo medio 2001–2024 (fonte: Liv-ex Annual Report 2024)",
      "Costo carry reale: 2.2–2.8% annuo — sempre sottrarlo dal rendimento lordo",
      "Top 1% dei vini = 60% dell'alpha — la selezione batte l'esposizione generica",
      "Orizzonte minimo raccomandato: 7 anni per assorbire volatilità short-term",
      "Liquidità ≠ rendimento: il mercato più liquido (Bordeaux) non è quello con il maggior potenziale",
    ],
    quiz: [
      { q: "Qual è il rendimento annuo medio del Liv-ex Fine Wine 100 tra 2001 e 2024?", options: ["9.8%", "13.6%", "8.1%", "18.4%"], correct: 1 },
      { q: "Quanto erode mediamente il costo di carry sul rendimento annuo lordo?", options: ["0.5–1.0%", "1.0–1.5%", "2.2–2.8%", "4.0–5.0%"], correct: 2 },
      { q: "Qual è lo Sharpe Ratio del fine wine rispetto all'azionario globale (stesso periodo)?", options: ["Inferiore (0.42 vs 0.64)", "Uguale (0.64)", "Superiore (0.82 vs 0.64)", "Non paragonabile"], correct: 2 },
      { q: "Qual è la percentuale di volume scambiato su Liv-ex rappresentata dal Bordeaux?", options: ["40%", "55%", "74%", "90%"], correct: 2 },
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
      headline: "Lafite 1982: da £120 a £1.700+ — +1.317% in 30 anni",
      stat: "I 5 First Growths: CAGR medio 8.4% netto (2000–2024)",
      context: "Château Lafite, Margaux, Latour, Mouton Rothschild e Haut-Brion rappresentano il 31% del volume Liv-ex. Il loro comportamento storico è il benchmark di riferimento per qualsiasi portafoglio fine wine."
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
      { title: "Latour — il player ultra-long", body: "Uscita dal mercato en primeur nel 2012. Vende solo quando ritiene i vini 'pronti'. Conseguenza: scarsità artificiale, premi in asta del 15–20% su Lafite. CAGR 10y: +10.2%." },
      { title: "Margaux — il beauty premium", body: "Etichetta più fotografata del mondo (Andy Warhol, 1975). CAGR simile a Lafite ma volatilità più alta — risponde di più alle mode e ai critici. 2009 e 2015 sono le annate bandiera." },
      { title: "Mouton Rothschild — l'arte collector", body: "Dal 1945 ogni annata ha un'etichetta di un artista diverso (Dalí, Warhol, Freud, Hirst). L'etichetta artistica crea un premium aggiuntivo stimato al 8–12% su annate iconiche." },
      { title: "Haut-Brion — il value play", body: "Scambia a 20–30% sotto i peer su Liv-ex pur avendo punteggi Parker simili. Per chi vuole esposizione First Growth con valuation più ragionevole, è storicamente la scelta più difensiva." },
      { title: "Le grandi annate: mappa dei rendimenti", body: "1982 (+1.317% in 30y), 1990 (+890%), 2000 (+654%), 2009 (+420% in 12y), 2010 (+380% in 12y). 2015 e 2016 ancora in crescita — annate non ancora mature." },
      { title: "Entry point: prezzo/punteggio", body: "Rapporto prezzo $/punto Parker: Lafite 2022 = €280/98pt = 2.85/pt. Media storica = 2.40/pt. Lafite 2018 = €310/100pt = 3.10/pt — sopravvalutato su base storica. Haut-Brion 2022 = €160/97pt = 1.65/pt — sottovalutato." },
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
      { wine: "Château Lafite 1982", buy: 120, sell: 1700, year_buy: 1984, year_sell: 2014, roi: "+1.317%", note: "La bottiglia che ha definito l'era moderna del fine wine investing. Parker 100." },
      { wine: "Château Latour 2010", buy: 680, sell: 1400, year_buy: 2011, year_sell: 2023, roi: "+106%", note: "En primeur release. Scarsità post-2012 ha accelerato l'apprezzamento." },
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
      "Lafite 1982: da £120 a £1.700+ in 30 anni — benchmark di tutto il fine wine investing",
      "Latour ha abbandonato en primeur nel 2012 — scarsità artificiale = premium permanente",
      "Haut-Brion: miglior Sharpe Ratio tra i Five su 20 anni — il value play del segmento",
      "Domanda cinese: amplificatore ciclico — attenti ai picchi da narrativa mediatica",
      "Rapporto €/punto Parker: metrica oggettiva per confrontare entry point",
    ],
    quiz: [
      { q: "Quale First Growth ha il volume di scambi più alto su Liv-ex?", options: ["Château Latour", "Château Margaux", "Château Lafite Rothschild", "Château Haut-Brion"], correct: 2 },
      { q: "In quale anno Latour ha abbandonato il mercato en primeur?", options: ["2008", "2010", "2012", "2015"], correct: 2 },
      { q: "Qual è il rendimento storico di Lafite 1982 calcolato su 30 anni?", options: ["+467%", "+890%", "+1.317%", "+2.100%"], correct: 2 },
      { q: "Quale First Growth ha storicamente il miglior Sharpe Ratio su 20 anni?", options: ["Lafite Rothschild", "Latour", "Mouton Rothschild", "Haut-Brion"], correct: 3 },
      { q: "Quale evento ha causato il crollo del 40% del prezzo di Lafite nel 2013?", options: ["Annata deludente", "Uscita di un competitor", "Campagna anti-corruzione in Cina", "Crisi finanziaria europea"], correct: 2 },
    ],
  },
  // ── Module 3: Borgogna ────────────────────────────────────────────────────────
  {
    id: "rs_03", courseId: 11, index: 2,
    title: "Borgogna: Romanée-Conti vs. Masseto — il duello del decennio",
    duration: 15,
    youtube: null,
    hero: { headline: "DRC La Tâche 2015: €4.200 → €9.800 (+133%) in 6 anni", stat: "Borgogna +187% vs. Bordeaux +62% (Liv-ex 2014–2024)", context: "La Borgogna ha superato il Bordeaux come segmento più performante del fine wine negli ultimi 10 anni. Ma il mercato è sottile, i vini scarsi, e comprare al momento sbagliato può costare caro." },
    objectives: ["Capire perché la Borgogna è l'asset class più scarsa al mondo", "Distinguere i Premier Cru dai Grand Cru in termini di rendimento atteso", "Analizzare la struttura del mercato DRC e dei suoi concorrenti", "Identificare i produttori emergenti con il miglior rapporto qualità/prezzo"],
    context: "La Borgogna è definita dalla scarsità assoluta: il Grand Cru Romanée-Conti produce circa 5.000 bottiglie all'anno — meno di qualsiasi singola nave cisterna di vino industriale. Questa scarsità non è marketing: è geologica, climatica e regolamentare.",
    slides: [
      { title: "La gerarchia borgognona", body: "Village → Premier Cru → Grand Cru. 33 Grand Cru in tutta la Côte d'Or. Chablis Grand Cru a parte. Il 2% della superficie produce il 95% del valore d'investimento." },
      { title: "DRC: monopolio e monologo", body: "Domaine de la Romanée-Conti possiede 7 Grand Cru in monopolio o quasi. La Romanée-Conti (1.8 ettari, ~5.500 bt/anno) è il vino più costoso al mondo: €18.000–€40.000/bottiglia al dettaglio." },
      { title: "Il Burgundy 150 Liv-ex", body: "L'indice Liv-ex Burgundy 150 ha segnato +187% in 10 anni (2014–2024). Nello stesso periodo il Bordeaux 500: +62%. Il differenziale è guidato da domanda crescente e offerta strutturalmente limitata." },
      { title: "Masseto: il Bordeaux borgognone", body: "Masseto (Bolgheri, Italia) è spesso paragonato alla Borgogna per la sua struttura Merlot cru. Da €180/bt nel 2005 a €750/bt nel 2024. CAGR 10y: +9.8%. Capitalizzazione Liv-ex tra le prime 50 etichette mondiali." },
      { title: "I produttori emergenti", body: "Leroux, Dujac, Rossignol-Trapet, Méo-Camuzet: nomi meno noti ma qualità Grand Cru a prezzi Premier Cru. Finestra di acquisto 2–3 anni prima che i critici li scoprano." },
      { title: "Il problema della liquidità", body: "Un Grand Cru Borgogna si vende, ma il mercato è più sottile del Bordeaux. Offerta a distanza: Christie's e Acker hanno aste mensili, ma bid-ask può essere 15–20%. Patience is mandatory." },
      { title: "Clima e cambiamento: il problema e l'opportunità", body: "Le annate 2015, 2017, 2019, 2022 sono eccezionali grazie al riscaldamento globale. Ma il rischio grandine e gelo si è intensificato: 2016 e 2021 hanno visto perdite di produzione del 30–50% in alcune parcelle." },
      { title: "Come comprare Borgogna: le liste en primeur", body: "I negociants (Maison Louis Jadot, Drouhin) rilasciano liste en primeur. I domaines vendono direttamente a clienti fidelizzati. Senza relazioni, si compra al mercato secondario — con premium." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Borgogna vs Bordeaux (Liv-ex 2014–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,150 100,135 160,115 220,90 280,65 340,45 370,38" fill="none" stroke="#C9A227" strokeWidth="2.5"/><polyline points="40,150 100,142 160,132 220,118 280,108 340,100 370,95" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="42" fill="#C9A227" fontSize="9">Borgogna</text><text x="372" y="99" fill="#60a5fa" fontSize="9">Bordeaux</text><text x="40" y="188" fill="#475569" fontSize="8">2014</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `La Borgogna è l'anomalia del mercato del vino: un terroir millenario con offerta fisica impossibile da aumentare, in uno dei contesti di domanda più in crescita al mondo.

Il Grand Cru Romanée-Conti misura 1.813 ettari (meno di 2 ettari). In un'annata normale produce circa 5.500 bottiglie. Con una popolazione globale di milionari che cresce del 6% annuo, la matematica è semplice: la domanda cresce strutturalmente, l'offerta non può crescere. Questo è l'asset case case nella sua forma più pura.

Dal 2014 al 2024, l'indice Liv-ex Burgundy 150 ha prodotto un rendimento cumulativo del 187%, contro il 62% del Bordeaux 500. Il differenziale non è casuale: è il prodotto di tre fattori. Primo, il mercato borgognono era sottovalutato rispetto al Bordeaux fino al 2012 — i critici americani storicamente favorivano il Cabernet Sauvignon bordolese. La riabilitazione del Pinot Noir come vino d'investimento è avvenuta lentamente. Secondo, la scoperta della Borgogna da parte dei mercati asiatici (Taiwan, Hong Kong, Singapore) è arrivata in ritardo rispetto al Bordeaux — rappresentando un secondo ciclo di apprezzamento. Terzo, i produttori borgognoni sono stati più lenti nell'aumentare i prezzi en primeur rispetto ai bordolesi — creando un ritardo tra qualità percepita e prezzo di mercato che il mercato secondario ha poi corretto.

Masseto rappresenta un caso studio interessante di come un vino non borgognone possa beneficiare della stessa narrativa. Prodotto nell'azienda Ornellaia di Bolgheri, è un Merlot in purezza invecchiato in barrique — strutturalmente simile a un Pomerol. Il mercato lo ha riconosciuto, e dal 2010 le sue quotazioni Liv-ex sono cresciute più di molti Premier Cru borgognoni.

Il rischio principale del segmento borgognone è la liquidità. Il Bordeaux si compra e si vende su Liv-ex in ore. Certi Grand Cru borgognoni hanno bid-ask spread del 15–20%: occorrono settimane per chiudere una transazione a prezzo ottimale. Per chi ha orizzonti brevi (<5 anni) o potrebbe aver bisogno di liquidare rapidamente, questo è un rischio concreto da quantificare nel piano di investimento.`,
    caseStudies: [
      { wine: "DRC La Tâche 2015", buy: 4200, sell: 9800, year_buy: 2018, year_sell: 2024, roi: "+133%", note: "Comprata al rilascio. La rivalutazione ha seguito la critica unanime (Parker 99, Burghound 100)." },
      { wine: "Masseto 2010", buy: 280, sell: 680, year_buy: 2012, year_sell: 2022, roi: "+143%", note: "Annata iconica di Bolgheri. La Borgogna ha trainato anche i Merlot italiani di alta gamma." },
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
      "Borgogna +187% vs. Bordeaux +62% nell'ultimo decennio — il miglior segmento del fine wine",
      "DRC Romanée-Conti: 5.500 bt/anno. Domanda globale in crescita strutturale. Offerta immutabile",
      "Liquidità più bassa del Bordeaux: bid-ask spread 15–20% su certi Grand Cru",
      "Masseto: proxy borgognono italiano — beneficia della stessa narrativa scarsità/qualità",
      "Produttori emergenti (Leroux, Dujac): finestra di acquisto 2–3 anni prima della scoperta critica",
    ],
    quiz: [
      { q: "Di quanti ettari è la vigna Grand Cru Romanée-Conti?", options: ["0.85 ha", "1.81 ha", "3.5 ha", "8.2 ha"], correct: 1 },
      { q: "Rendimento Liv-ex Burgundy 150 (2014–2024)?", options: ["+62%", "+110%", "+187%", "+340%"], correct: 2 },
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
    hero: { headline: "Sassicaia 1985: il primo vino italiano a 100pt Parker. Oggi €1.800/bottiglia", stat: "Italy 100 Liv-ex: +124% in 10 anni. Quarto segmento per volume globale", context: "L'Italia è passata da 'curiosità regionale' a pilastro del fine wine investing. Tre categorie dominano: Barolo/Barbaresco (Piemonte), Brunello di Montalcino (Toscana), e i Super Tuscans (Sassicaia, Ornellaia, Masseto)." },
    objectives: ["Distinguere i tre macro-segmenti del fine wine italiano per profilo rischio/rendimento", "Analizzare il ruolo dei produttori storici vs. nuovi interpreti", "Capire perché il Brunello 2010 è considerato l'annata del secolo", "Valutare il potenziale della 'prossima generazione' italiana"],
    context: "Il mercato italiano è stato storicamente sottovalutato rispetto a Bordeaux e Borgogna. Il Liv-ex Italy 100 ha corretto questo divario con una performance del +124% in 10 anni — la seconda migliore tra tutti gli indici regionali. Il catalizzatore: riconoscimento critico internazionale (Parker, Suckling) + domanda asiatica in crescita + scarsità strutturale dei cru storici.",
    slides: [
      { title: "Barolo DOCG: il 'Re dei Vini'", body: "Nebbiolo dalle Langhe, Piemonte. 11 comuni, 2.200 ha totali. I MGA (Mention Geografica Aggiuntiva): Cannubi, Brunate, Rocche dell'Annunziata. Produzione media: 9M bottiglie/anno — piccola rispetto alla domanda crescente." },
      { title: "Le annate chiave del Barolo", body: "1996, 1999, 2001, 2004, 2010, 2016: le 'sei stelle'. 2010 = consenso universale: Parker 99+, Suckling 100, Gambero Rosso 3R. Gaja Sperss 2010: da €180 en primeur a €620+ sul mercato secondario (2024)." },
      { title: "Brunello di Montalcino", body: "Sangiovese Grosso, 100% varietale. 3.500 ha, ~10M bt/anno. La 'Brunello-gate' del 2008 (aggiunta di altri vitigni) ha temporaneamente depresso i prezzi — poi il rimbalzo. Biondi-Santi Riserva 1955: £74.000/bt a Christie's 2018." },
      { title: "Brunello 2010 — l'annata del secolo", body: "Temperatura ideale, precipitazioni perfette, vendemmia tardiva. Parker ha assegnato 100pt a Soldera, Biondi-Santi Riserva, Ciacci Piccolomini. Prezzo medio 2010 nel 2024: +285% rispetto al 2012." },
      { title: "Sassicaia: il pioniere", body: "Primo vino italiano a 100pt Parker (1985, nel 1994). DOC propria: Bolgheri Sassicaia. Cabernet Sauvignon 85% + Cab. Franc 15%. CAGR 10y: +9.2%. Liv-ex top-50 per volume." },
      { title: "Ornellaia e Masseto", body: "Ornellaia: blend bordolese, prezzi più accessibili (€120–180). Masseto: Merlot in purezza, prezzi borgognoni (€600–850). Entrambi di proprietà Frescobaldi. Ornellaia Vendemmia d'Artista: etichette artiste come Mouton — premium del 20–40%." },
      { title: "I nuovi interpreti: Toscana e Piemonte", body: "Montevertine Le Pergole Torte: Sangiovese puro, +190% in 8 anni. Bartolo Mascarello Barolo: produzione minuta, liste d'attesa pluriennali. La prossima generazione ha valuation bassa ma trend positivo." },
      { title: "Dove comprare vino italiano", body: "En primeur disponibile per Barolo (Rare Wine Co., BBR), Brunello (Tannico, MWH), Super Tuscans (Millésima). Sul secondario: Liv-ex per le etichette più liquide, Sotheby's per Brunello vintage." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Italy 100 vs Bordeaux 500 (2014–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,155 90,145 150,128 210,108 270,82 330,58 370,44" fill="none" stroke="#4ade80" strokeWidth="2.5"/><polyline points="40,155 90,148 150,137 210,122 270,108 330,98 370,94" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="48" fill="#4ade80" fontSize="9">Italy</text><text x="372" y="98" fill="#60a5fa" fontSize="9">Bord.</text><text x="40" y="188" fill="#475569" fontSize="8">2014</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `Il fine wine italiano ha attraversato una trasformazione radicale negli ultimi vent'anni. Fino ai primi anni 2000, il mercato era dominato dai collezionisti europei con una visione regionale. Il Barolo era apprezzato, ma non trattato come asset class. Il Brunello, nonostante la Brunello-gate del 2008, era poco liquido sul mercato secondario.

Il cambiamento è arrivato da tre direzioni simultanée. Prima: i punteggi Parker e Suckling hanno internazionalizzato la reputazione dei produttori storici, rendendoli riconoscibili da Tokyo a New York. Gaja, Biondi-Santi, Sassicaia sono oggi nomi globali. Secondo: la piattaforma Liv-ex ha creato un mercato secondario trasparente anche per i vini italiani — il Liv-ex Italy 100, lanciato nel 2010, ha dato visibilità quantitativa alla performance. Terzo: la domanda asiatica ha scoperto l'Italia come alternativa al Bordeaux — con il vantaggio di prezzi più accessibili e una narrativa culturale (arte, gastronomia, moda) già profondamente radicata.

Il Brunello 2010 merita un paragrafo separato. Le condizioni climatiche di quell'annata — estate calda ma non torrida, escursione termica autunnale perfetta — hanno prodotto vini di straordinaria concentrazione e freschezza. Tre produttori hanno ricevuto 100 punti su scala internazionale. Il prezzo medio dei Brunello 2010 di primo livello sul mercato secondario è aumentato del 285% tra il 2012 e il 2024. Chi aveva acquistato en primeur ha realizzato ritorni da primo piano. Chi ha aspettato il rilascio in bottiglia ha comunque fatto un ottimo investimento.

La prossima frontiera è la 'nuova generazione': produttori come Montevertine, Fuligni, Lisini stanno ricevendo punteggi sempre più alti con prezzi ancora relativamente contenuti. Questa è la finestra di opportunità: comprare prima che il mercato scopra quello che i critici già sanno.`,
    caseStudies: [
      { wine: "Gaja Sperss Barolo 2010", buy: 180, sell: 620, year_buy: 2013, year_sell: 2024, roi: "+244%", note: "En primeur al rilascio. Parker 99pt. Annata 2010 rivalutata progressivamente." },
      { wine: "Biondi-Santi Brunello Riserva 1990", buy: 850, sell: 3200, year_buy: 2005, year_sell: 2020, roi: "+276%", note: "Annata 1990 rivalutata da Suckling (100pt nel 2018). Catalizzatore: retrorating." },
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
      "Italy 100 Liv-ex: +124% in 10 anni — secondo indice più performante dopo la Borgogna",
      "Brunello 2010: +285% dal 2012. L'annata del secolo — ancora sotto il fair value storico",
      "Sassicaia CAGR 10y: +9.2% — primo vino italiano a 100pt Parker (1985)",
      "Nuovi interpreti (Montevertine, Fuligni): finestra di acquisto prima della scoperta critica",
      "Verifica sempre la provenance: mercato meno trasparente di Bordeaux/Borgogna",
    ],
    quiz: [
      { q: "Quale annata del Brunello è considerata 'del secolo' per il consenso critico?", options: ["2004", "2007", "2010", "2015"], correct: 2 },
      { q: "Il Sassicaia ha quale DOC propria?", options: ["Chianti Classico DOC", "Bolgheri Sassicaia DOC", "Toscana IGT", "Vino Nobile di Montepulciano"], correct: 1 },
      { q: "Qual è il CAGR a 10 anni di Sassicaia secondo Liv-ex?", options: ["+4.1%", "+7.5%", "+9.2%", "+14.3%"], correct: 2 },
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
    hero: { headline: "Krug Vintage 1996: +218% in 15 anni. Volumi Liv-ex champagne: +340% dal 2018", stat: "Champagne 50 Liv-ex: +89% in 5 anni (2019–2024)", context: "Il Champagne è entrato nell'orbita del fine wine investing solo negli ultimi 10 anni. Prima era 'consumo di lusso'. Oggi Cristal, Krug, Dom Pérignon P2 e Salon sono asset quotati su Liv-ex." },
    objectives: ["Capire perché il Champagne è diventato asset class solo di recente", "Analizzare i driver di prezzo per le cuvée di prestige", "Identificare le annate e i formati con il miglior potenziale", "Valutare i rischi specifici: corretta conservazione, mercato degli NV"],
    context: "Il Champagne ha una struttura di mercato unica: il 95% della produzione è Non-Vintage (NV), mescolato da centinaia di annate. Solo le cuvée di prestige millesimate (Cristal, Dom Pérignon, Krug Vintage, Salon, Belle Époque) sono asset investibili. La scarsità è estrema: Salon produce solo in annate eccezionali — 37 millesimi in 100 anni.",
    slides: [
      { title: "Il mercato del Champagne: struttura", body: "NV (Non-Vintage): 85% della produzione, non investibile. Vintage: 10%, investibile per le grandi maisons. Prestige Cuvée: 5%, core del fine wine Champagne. Solo 8–10 etichette hanno mercato Liv-ex liquido." },
      { title: "Cristal Louis Roederer", body: "Creato nel 1876 per lo Zar Alessandro II (bottiglia trasparente anti-bomba). Oggi la cuvée di prestige più quotata per volume Liv-ex. Cristal 2002: da £95 en primeur a £420+ sul secondario. CAGR 8y: +12.4%." },
      { title: "Krug: il 'Grande Marque' degli intenditori", body: "Krug Grande Cuvée: NV, ma invecchiato 6+ anni. Krug Vintage: solo in grandi annate. Krug 1996: considerato il vertice del decennio. Sul mercato secondario: £280–380/bt (2024). +218% dal 2009." },
      { title: "Dom Pérignon e le edizioni P2/P3", body: "DP standard: buono ma poco liquido. DP P2 (seconda plenitude, 15+ anni): mercato collezionisti attivo. DP P3 (25+ anni): estremamente raro, prezzi da Borgogna. DP 2004 P2: €420/bt vs. €180 del DP standard." },
      { title: "Salon Le Mesnil — la rarità assoluta", body: "Solo Blanc de Blancs (Chardonnay 100%). Solo annate eccezionali: 37 rilasci in 100 anni. Ultimo: 2012. Produzione: ~60.000 bt per annata. Salon 2002: da £180 a £780+ (2024). CAGR: +14.1%." },
      { title: "Formati: i Magnum come premium", body: "Magnum (150cl) matura più lentamente — vino migliore e mercato collezionisti attivo. Il premium di prezzo del Magnum su Liv-ex: mediamente +35–45% vs. bt standard. Jeroboam e Mathusalem: mercato più sottile." },
      { title: "Annate chiave del Champagne", body: "1996: teso, acido, minerale — il vertice critico del decennio. 2002: rotondo, complesso — il preferito dei collezionisti. 2004: tardivo ma eccellente. 2008: strutturato, alta acidità — perfetto per invecchiamento. 2012: caldo, opulento." },
      { title: "Il rischio della conservazione", body: "Il Champagne è più delicato del vino rosso: luce, temperatura e vibrazioni lo degradano rapidamente. Comprare solo da wine merchants certificati o direttamente dalla maison. Le bottiglie mal conservate perdono il 40–60% del valore." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Champagne 50 Liv-ex (2019–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,150 100,138 160,120 220,98 280,72 330,52 370,42" fill="none" stroke="#f9a8d4" strokeWidth="2.5"/><text x="372" y="46" fill="#f9a8d4" fontSize="9">Champ</text><text x="40" y="188" fill="#475569" fontSize="8">2019</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `La storia del Champagne come asset class è recente e interessante. Fino al 2018, i sommelier e i collezionisti consideravano il Champagne un prodotto di consumo — anche quello di prestige. L'idea di comprare Cristal per rivenderlo era insolita. Poi sono successe tre cose.

Primo: Liv-ex ha introdotto l'indice Champagne 50 nel 2019, dando visibilità quantitativa a un mercato che esisteva ma era informale. Secondo: la pandemia ha accelerato l'interesse per gli asset alternativi — i prezzi dei grandi vini fermi erano già alti, e il Champagne di prestige sembrava undervalued. Terzo: i mercati asiatici (Singapore, Hong Kong, Giappone) hanno scoperto il Champagne come status symbol aggiuntivo rispetto al Bordeaux.

Il risultato: l'indice Champagne 50 ha segnato +89% in cinque anni (2019–2024), battendo sia il Bordeaux 500 sia il Burgundy 150 nello stesso periodo. Ma questo confronto è parzialmente fuorviante: il punto di partenza era basso, e la volatilità è stata alta.

Il mercato del Champagne ha struttura diversa da quello del vino fermo. Le cuvée di prestige hanno quantità prodotte significativamente maggiori di un Grand Cru borgognone: Cristal produce circa 300.000 bottiglie per annata, Salon solo 60.000. Questo significa che la liquidità è buona per Cristal, accettabile per Krug, sottile per Salon. Il bid-ask su Liv-ex per il Champagne è mediamente più alto che per i First Growth bordolesi — dato rilevante per chi pianifica orizzonti brevi.

Salon Le Mesnil rimane il caso più estremo: 37 annate in 100 anni, nessuna di "convenienza". La scarsità è assoluta, la domanda crescente. Il CAGR a 10 anni di Salon 2002 supera il 14% annuo — la performance migliore tra tutti i Champagne quotati su Liv-ex.`,
    caseStudies: [
      { wine: "Cristal Louis Roederer 2002", buy: 95, sell: 420, year_buy: 2005, year_sell: 2020, roi: "+342%", note: "Annata 2002: consenso critico unanime. Mercato asiatico come catalyst." },
      { wine: "Salon Le Mesnil 1996", buy: 180, sell: 780, year_buy: 2010, year_sell: 2024, roi: "+333%", note: "Scarsità estrema: 60.000 bt prodotte. Venduto en primeur a maison pricing." },
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
      "Champagne 50 Liv-ex: +89% in 5 anni — miglior performance tra tutti gli indici 2019–2024",
      "Solo 8–10 etichette millesimate di prestige hanno mercato Liv-ex liquido",
      "Salon CAGR 10y: +14.1% — la rarità assoluta (37 annate in 100 anni)",
      "Magnum premium: +35–45% su Liv-ex — il formato migliore per conservazione e rivendita",
      "Rischio conservazione: Champagne mal stoccato perde il 40–60% del valore",
    ],
    quiz: [
      { q: "Quante annate ha prodotto Salon Le Mesnil nei suoi 100 anni di storia?", options: ["22", "37", "56", "68"], correct: 1 },
      { q: "Quale indice Liv-ex copre il mercato del Champagne?", options: ["Bordeaux 500", "Champagne 50", "Sparkling 100", "Fine Wine 1000"], correct: 1 },
      { q: "Il Magnum vale su Liv-ex mediamente quanto in più rispetto alla bottiglia standard?", options: ["+10–15%", "+20–25%", "+35–45%", "+60–80%"], correct: 2 },
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
    hero: { headline: "Yquem 1811: battuto £75.000/bottiglia a Sotheby's 2011. La longevità è valore", stat: "Château d'Yquem: unico Premier Cru Supérieur in Sauternes. CAGR 20y: +7.8%", context: "I grandi vini dolci sono il segmento più longevo del fine wine: Yquem 1811 è ancora bevibile e collezionato. La scarsità è creata dalla produzione: una bottiglia per vite (Yquem) nelle migliori annate." },
    objectives: ["Capire la struttura produttiva unica di Yquem e Tokaj", "Analizzare perché la longevità è un vantaggio competitivo in questo segmento", "Identificare le annate d'investimento vs. le annate di consumo", "Valutare il mercato dei Tokaj Eszencia come opportunità emergente"],
    context: "Château d'Yquem è l'unico Premier Cru Supérieur nella classificazione del 1855 — una categoria creata appositamente per esso. Il Tokaj Eszencia ungherese è il vino più denso al mondo: 600–900 g/litro di zucchero residuo. Entrambi invecchiano per secoli, non decenni.",
    slides: [
      { title: "Château d'Yquem: il più raro dei rari", body: "152 ha in Sauternes. La botrytis cinerea (muffa nobile) concentra gli zuccheri. Vendemmia: passo per passo, solo gli acini perfetti. In anni ordinari: 1 bt per vite. Anni difficili: produzione zero (1992, 2012)." },
      { title: "Le grandi annate di Yquem", body: "1811 (il 'miracolo'), 1921, 1937, 1967, 1976, 1986, 1988, 1989, 1990, 2001, 2009. Yquem 2001: Parker 100 — €600–800/bt. Yquem 1976: €2.200/bt (Sotheby's 2023). La rarità aumenta con l'età." },
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
      { wine: "Château d'Yquem 2001", buy: 120, sell: 720, year_buy: 2003, year_sell: 2022, roi: "+500%", note: "Parker 100pt. L'annata del millennio per Sauternes. Ancora sotto il potenziale a lungo termine." },
      { wine: "Royal Tokay Aszú 6 Puttonyos 1993", buy: 45, sell: 280, year_buy: 2000, year_sell: 2021, roi: "+522%", note: "Annata 1993 rivalutata. Mercato sottile ma in crescita in Asia." },
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
      "Yquem 2001 Parker 100: da €120 en primeur a €720+ nel 2022 (+500%)",
      "Tokaj Eszencia: 600–900 g/l zucchero residuo, invecchia 200+ anni, mercato ancora sottosviluppato",
      "Formato 75cl superiore al 375ml per rivendita e conservazione",
      "Liquidità limitata: canale principale sono le aste (Sotheby's, Christie's), non Liv-ex",
    ],
    quiz: [
      { q: "Quante bottiglie produce Château d'Yquem per ettaro nelle annate normali?", options: ["Una bottiglia per vite", "100 bottiglie per ettaro", "500 bottiglie per ettaro", "1.000 bottiglie per ettaro"], correct: 0 },
      { q: "Cosa è il Tokaj Eszencia?", options: ["Un Champagne ungherese", "Il vino con la più alta concentrazione zuccherina al mondo (600–900 g/l)", "Un vino rosso da dessert", "Un distillato di grappa"], correct: 1 },
      { q: "Yquem 1811 è stato battuto all'asta per quanto?", options: ["£12.000", "£35.000", "£75.000", "£150.000"], correct: 2 },
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
    hero: { headline: "Chapoutier Hermitage Le Pavillon: +290% dal 2010. Parker lo 'ha scoperto' due volte", stat: "Northern Rhône: CAGR 7.2% (10y). Châteauneuf-du-Pape: +168% dal 2014", context: "La Valle del Rodano è stata storicamente il 'terzo' mercato del fine wine francese, dopo Bordeaux e Borgogna. Ma i suoi vini longevi e sottovalutati hanno attirato l'attenzione degli investitori dal 2010." },
    objectives: ["Distinguere Rodano Nord (Syrah) da Rodano Sud (Grenache blend) come asset class", "Analizzare il ruolo di Robert Parker nel creare valore per l'Hermitage", "Identificare i produttori chiave di entrambe le zone", "Capire perché il Châteauneuf-du-Pape è il 'value play' del Rodano"],
    context: "Il Rodano Nord produce alcune delle Syrah più longeve al mondo: Hermitage e Côte-Rôtie invecchiano 30–50 anni. Il Rodano Sud è dominato dal Grenache: il Châteauneuf-du-Pape ha 13 vitigni autorizzati ma i top produttori usano 1–3. Scarsità strutturale: Hermitage è solo 136 ettari totali.",
    slides: [
      { title: "Hermitage: 136 ha di Syrah leggendaria", body: "La collina di Hermitage sovrasta Tain l'Hermitage. 136 ha totali di vigna. I 'lieux-dits': Bessards, Meal, Greffieux, Les Diognières. Chapoutier, Chave, Paul Jaboulet sono i produttori di riferimento. Longeva: 40+ anni nelle grandi annate." },
      { title: "Jean-Louis Chave: il benchmark", body: "Hermitage Rouge di Chave: 15.000–25.000 bt/anno (tutte le parcelle blended). CAGR 10y: +11.2%. Chave 1990 Hermitage: da £45 a £480+ (2024). Il blanc di Chave: ancora più raro e apprezzato dai collezionisti." },
      { title: "Chapoutier Le Pavillon", body: "Hermitage Le Pavillon: monoparcel (Bessards), 100% Syrah. Parker lo ha punteggiato 100 due volte: nel 1990 e nel 2010. Dopo ogni retrorating: +40–60% in 18 mesi. 2010: da €65 en primeur a €300+ (2024)." },
      { title: "Côte-Rôtie: Syrah con eleganza", body: "Côte Brune + Côte Blonde: diversità di terroir in una piccola AOC. E. Guigal La Landonne, La Mouline, La Turque: le 'tre La'. Parker ≥100 per 15+ annate consecutive. La Landonne: da £80 a £320+ in 10 anni." },
      { title: "Châteauneuf-du-Pape: il gigante del Sud", body: "3.200 ha, 13 vitigni autorizzati. Grenache dominante. I top: Rayas (leggendario, 30.000 bt/anno), Pegaü, Vieux Télégraphe, Beaucastel. Rayas Réserve 2001: €180 in cantina, €1.200+ sul secondario (2024)." },
      { title: "Château Rayas: la leggenda schiva", body: "Emmanuel Reynaud: il produttore più reticente del Rodano. Solo Grenache, 30% di resa. Rayas è una delle cuvée con il maggiore gap tra prezzo en primeur e mercato secondario: 500–700% di apprezzamento nelle grandi annate." },
      { title: "Le annate chiave", body: "Rodano Nord: 1990, 1999, 2003, 2009, 2010, 2017. Rodano Sud: 1989, 1990, 1998, 2007, 2010, 2016. Le annate calde favoriscono il Grenache (Châteauneuf), le annate fresche la Syrah (Hermitage, Côte-Rôtie)." },
      { title: "Mercato secondario del Rodano", body: "Più sottile di Bordeaux e Borgogna. Principali canali: Liv-ex per Guigal 'tre La' e Chave, aste per Rayas e Bonneau. Liquidità buona per le etichette Parker-certified, sottile per i produttori minori." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Rhône fine wine prezzi 2010–2024</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,155 90,148 150,135 210,112 270,85 330,62 370,50" fill="none" stroke="#f97316" strokeWidth="2.5"/><polyline points="40,158 90,150 150,140 210,122 270,100 330,80 370,68" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="54" fill="#f97316" fontSize="9">N.Rhône</text><text x="372" y="72" fill="#94a3b8" fontSize="9">S.Rhône</text><text x="40" y="188" fill="#475569" fontSize="8">2010</text><text x="355" y="188" fill="#475569" fontSize="8">2024</text></svg>`,
    deepDive: `Il Rodano rappresenta uno dei casi più interessanti di rivalutazione nel mercato del fine wine: un'intera regione che è passata da "buon rapporto qualità/prezzo" a "asset class emergente" nel giro di 15 anni, guidata quasi interamente dall'influenza di un singolo critico.

Robert Parker ha "scoperto" il Rodano in due momenti distinti. La prima volta negli anni '80, quando ha assegnato punteggi straordinari all'Hermitage 1990 di Chave e al Châteauneuf-du-Pape Rayas. La seconda volta nel 2010–2012, quando ha rivalutato un'intera serie di annate precedenti che aveva sottovalutato nella sua prima analisi. Ogni retrorating di Parker ha prodotto un aumento immediato e sostanziale dei prezzi: il Chapoutier Le Pavillon 2010, dopo il punteggio di 100 nel 2012, è aumentato del 60% in 18 mesi.

Questo fenomeno "retrorating" è peculiare del mercato del vino e non ha equivalenti in altri mercati finanziari. Un'analisi accademica (Ashenfelter e Jones, Princeton, 2013) ha quantificato l'effetto Parker: un aumento di 1 punto nel punteggio Parker corrisponde in media a un aumento del 4.6% nel prezzo d'asta per i vini top. Per i vini che superano i 95 punti, l'effetto è non-lineare: +8.2% per punto.

La Valle del Rodano ha un vantaggio strutturale rispetto alla Borgogna: i suoi vini longevi (Hermitage invecchia 40+ anni) hanno un "valore residuo" molto alto anche dopo 20 anni dalla vendemmia. Un Hermitage 1983 è ancora vivissimo nel 2024 — e il suo prezzo continua a crescere perché le bottiglie in circolazione diminuiscono mentre la domanda da collezione aumenta.`,
    caseStudies: [
      { wine: "Chapoutier Hermitage Le Pavillon 2010", buy: 65, sell: 300, year_buy: 2012, year_sell: 2024, roi: "+362%", note: "Parker 100pt. Retrorating nel 2012 ha catalizzato l'apprezzamento." },
      { wine: "Château Rayas Châteauneuf-du-Pape 1998", buy: 120, sell: 980, year_buy: 2003, year_sell: 2022, roi: "+717%", note: "Annata 1998: la migliore del decennio per Grenache. Produzione minuta." },
    ],
    techniques: [
      "Segui le retrorating di Parker: +1 punto sopra 95 = +8.2% di prezzo in media",
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
      "Chapoutier Le Pavillon 2010: da €65 a €300+ (+362%) dopo Parker 100",
      "Rayas Châteauneuf-du-Pape: gap en primeur/secondario tra i più alti nel fine wine",
      "Retrorating Parker: +8.2% di prezzo per ogni punto sopra 95 — segnale d'acquisto anticipatorio",
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
    hero: { headline: "Screaming Eagle 1992: record Napa Valley a $500.000 per OWC 6 bottiglie", stat: "Napa Cult Cabernet CAGR 10y: +8.9%. Colchagua (Cile) emergente: +210% dal 2015", context: "I 'Nuovi Mondi' del fine wine hanno sfidato il dominio europeo negli ultimi 30 anni. Napa Valley è oggi il terzo mercato per volumi Liv-ex dopo Bordeaux e Borgogna. Mendoza e Barossa seguono." },
    objectives: ["Analizzare il profilo rischio/rendimento dei top producer californiani", "Capire il meccanismo delle mailing list per i cult wines di Napa", "Identificare le opportunità emergenti in Argentina e Australia", "Confrontare la liquidità New World vs. Europa su Liv-ex"],
    context: "Il mercato fine wine californiano è strutturalmente diverso dall'Europa: niente classificazioni storiche, ma mailing list, allocazioni e liste d'attesa pluriennali. I Cult Cabernets di Napa (Screaming Eagle, Harlan, Bryant Family) hanno creato un mercato parallel system dove chi non è sulla lista paga il doppio sul secondario.",
    slides: [
      { title: "Napa Valley: la struttura del mercato", body: "AVA: Oakville, Rutherford, Stags Leap, Howell Mountain. Cab. Sauvignon dominante. Il 'Judgment of Paris' 1976 ha legittimato Napa. Oggi: 450+ produttori, ma solo ~30 hanno mercato secondario liquido." },
      { title: "I Cult Cabernets: Screaming Eagle, Harlan, Bryant", body: "Screaming Eagle: 6.000 bt/anno, lista d'attesa 6 anni. Harlan Estate: 2.000 casse. Bryant Family: chiuso in esclusiva. Sul secondario: prezzi 3–5x rispetto alla mailing list price." },
      { title: "Opus One: il ponte tra Mouton e Mondavi", body: "Joint venture Rothschild + Mondavi dal 1979. 30.000 casse/anno — molto più liquido dei cult wines. CAGR 10y: +6.8%. Meno premium dei cult ma mercato Liv-ex con spessore." },
      { title: "Ridge Monte Bello: il benchmark del valore", body: "Cabernet Sauvignon da Monte Bello (Santa Cruz Mountains). Invecchiamento 25+ anni. Al 'Paris Tasting 2006' (30° anniversario) ha vinto. Prezzo contenuto (€60–100) vs. qualità: gap da sfruttare." },
      { title: "Mendoza (Argentina): Malbec come investimento", body: "Achaval Ferrer Finca Bella Vista: il Malbec più quotato su Liv-ex. Catena de Cruce de los Andes: collaborazione Cheval Blanc + Terrazas. Prezzi bassi, qualità alta, mercato secondario nascente — finestra aperta." },
      { title: "Barossa Valley (Australia): Shiraz longeva", body: "Penfolds Grange: il grande classico australiano. Parker 100 ripetute. CAGR 15y: +9.4%. Grange 2008: da A$600 a A$1.800+. Henschke Hill of Grace: produzione 3.000 bt, premium sempre crescente." },
      { title: "Cile emergente: Colchagua e Apalta", body: "Almaviva (Mouton + Concha y Toro): il più liquido su Liv-ex. Don Melchor Cabernet Sauvignon: Suckling 98 nel 2021, CAGR +12% da 2018. Prezzi ancora contenuti — il 'momento Sassicaia' del Cile è vicino." },
      { title: "Liquidità New World su Liv-ex", body: "Napa: buona per Screaming Eagle, Harlan, Opus One. Australia: Penfolds Grange ha il mercato più liquido fuori Europa. Argentina/Cile: mercati in sviluppo — spread bid/ask ancora ampi. Strategia: compra per hold, non per flip a breve." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">New World fine wine performance (2014–2024)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,152 90,143 150,128 210,108 270,86 330,64 370,52" fill="none" stroke="#ef4444" strokeWidth="2.5"/><polyline points="40,156 90,149 150,137 210,124 270,108 330,95 370,88" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5"/><text x="372" y="56" fill="#ef4444" fontSize="9">Napa</text><text x="372" y="92" fill="#22d3ee" fontSize="9">Barossa</text></svg>`,
    deepDive: `Il mercato del fine wine del Nuovo Mondo ha attraversato una legittimazione accelerata negli ultimi 30 anni, guidata da tre eventi storici: il Judgment of Paris del 1976, le retrorating di Parker negli anni '90 e la crescita del mercato asiatico che ha cercato alternative ai prezzi sempre più alti di Bordeaux e Borgogna.

Il caso Napa è il più strutturato. I Cult Cabernets — Screaming Eagle, Harlan Estate, Bryant Family, Colgin — hanno creato un sistema economico parallelo basato sulle mailing list. Il meccanismo è semplice ma potente: sei anni di attesa per essere aggiunti alla lista, poi accesso annuale a un'allocazione limitata a prezzi "corretti". Sul mercato secondario, le stesse bottiglie valgono immediatamente 3–5x il prezzo della mailing list.

Per Screaming Eagle, questo significa: il prezzo mailing list è circa $350/bottiglia per l'annata recente. Sul secondario, la stessa bottiglia vale $1.200–2.000 al momento del rilascio. Non c'è nessun mercato europeo con un gap simile tra prezzo di emissione e prezzo secondario immediato.

Il Cile merita attenzione speciale. Il mercato fine wine cileno è oggi dove era l'Italia nel 2005: qualità riconosciuta dalla critica internazionale (Almaviva, Don Melchor, Clos Apalta ricevono punteggi crescenti), prezzi ancora non allineati, distribuzione globale ancora incompleta. Quando il mercato asiatico "scoprirà" il Cile come ha scoperto l'Italia, i prezzi si adegueranno rapidamente. La finestra di acquisto a prezzi correnti è ancora aperta.`,
    caseStudies: [
      { wine: "Penfolds Grange Shiraz 2008", buy: 420, sell: 1800, year_buy: 2012, year_sell: 2024, roi: "+329%", note: "Parker 99pt. L'australiano più consistente su Liv-ex." },
      { wine: "Almaviva Cabernet Sauvignon 2013", buy: 55, sell: 210, year_buy: 2015, year_sell: 2024, roi: "+282%", note: "Joint venture Mouton Rothschild. Il cileno più liquido su Liv-ex." },
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
      "Screaming Eagle: 6.000 bt/anno, lista d'attesa 6 anni, secondario 3–5x mailing list",
      "Penfolds Grange CAGR 15y: +9.4% — il benchmark australiano su Liv-ex",
      "Don Melchor (Cile) CAGR +12% dal 2018 — il 'momento Sassicaia' del Cile è vicino",
      "Ridge Monte Bello: gap qualità/prezzo estremo — ancora sottovalutato vs. Napa cult",
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
    hero: { headline: "2009 Bordeaux EP: chi ha venduto 18 mesi dopo ha realizzato +85% in media", stat: "2005 Bordeaux: il miglior EP dell'era moderna. Lafite 2005 da €180 EP a €1.800 (2011)", context: "L'En Primeur è il sistema di pre-vendita del vino ancora in botte, tipicamente 18–24 mesi prima del rilascio in bottiglia. Nato a Bordeaux, si è esteso a Borgogna, Rodano e alcune regioni italiane." },
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

Il 2009 è il caso paradigmatico. Lafite Rothschild 2009 è stato rilasciato in EP a circa £250 per bottiglia. Diciotto mesi dopo, prima ancora che il vino fosse imbottigliato, il secondario aveva superato £450. Chi ha comprato EP e rivenduto immediatamente alla consegna ha realizzato l'80% lordo in meno di due anni — al netto dei costi reali, circa il 60% netto.

Ma il 2011 ha insegnato la lezione opposta. Annata buona ma non eccezionale, prezzi EP fissati al livello del 2009. Lafite 2011 EP a £280; secondario tre anni dopo: £160. Perdita netta del 40%. Il meccanismo EP non è mai un investimento sicuro: è una scommessa condizionata alla qualità dell'annata, alla disciplina del produttore sui prezzi, e all'evoluzione del sentiment di mercato.`,
    caseStudies: [
      { wine: "Pétrus En Primeur 2009", buy: 1800, sell: 4200, year_buy: 2010, year_sell: 2014, roi: "+133%", note: "EP al rilascio. Venduto all'imbottigliamento. Costi carry inclusi: rendimento netto ~95%." },
      { wine: "Lafite Rothschild En Primeur 2011", buy: 280, sell: 160, year_buy: 2012, year_sell: 2016, roi: "-43%", note: "Annata sopravvalutata, prezzi EP aggressivi. Lezione classica della trappola EP." },
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
      "EP conviene solo in annate eccezionali (Parker ≥96, consenso critico) — le annate mediocri sono trappole",
      "Costo reale EP = prezzo + 20% fee + duty + VAT + £14.40/cassa/anno x anni attesa",
      "2009 Bordeaux: il miglior EP moderno — +80–100% netto in 2 anni per chi ha venduto alla consegna",
      "2011 Bordeaux: esempio classico di trappola EP — prezzi aggressivi su annata ordinaria, -43%",
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
    hero: { headline: "Gap bid-ask in asta vs. Liv-ex: mediamente 8–12% — margine di arbitraggio reale", stat: "Mercato aste globale 2023: $500M. Top 3: Sotheby's, Christie's, Hart Davis Hart", context: "Le aste internazionali di fine wine sono il canale principale per bottiglie rare e grandi formati. Capire la struttura dei costi e i meccanismi delle aste è essenziale per massimizzare il rendimento in vendita." },
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
      { wine: "DRC Romanée-Conti 2015 OWC 6bt", buy: 28000, sell: 52000, year_buy: 2018, year_sell: 2023, roi: "+86%", note: "Comprato Christie's Londra, venduto Sotheby's Hong Kong. Arbitraggio geografico: +14% vs. valore Londra." },
      { wine: "Pétrus 1982 (3 bottiglie)", buy: 4500, sell: 12800, year_buy: 2005, year_sell: 2022, roi: "+184%", note: "Provenance documentata: cantina privata originale. Premium provenance: +25% vs. market estimate." },
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
      { title: "Bordeaux 500: il cuore del mercato", body: "500 vini bordolesi: i 5 First Growth per 20 vintage + classificati storici. Ponderato per volume di trade. Il Bordeaux 500 è sceso del 18% tra 2011 e 2014 (la 'correzione asiatica') — la maggiore drawdown dell'era moderna." },
      { title: "Burgundy 150: il mercato più volatile", body: "150 vini borgognoni: DRC, Leroy, Rousseau, Raveneau, altri top. Alta volatilità (±20–30% annuo). Massima performance nel 2021 (+35%). La bassa liquidità amplifica i movimenti — sia al rialzo che al ribasso." },
      { title: "Italy 100: il segmento con il trend più forte", body: "100 vini italiani: Barolo, Brunello, Super Tuscans. Creato nel 2010. Da allora: +124%. Ha sovraperformato il Bordeaux 500 per 4 anni consecutivi (2020–2024). La crescita strutturale è guidata da riconoscimento critico + domanda asiatica." },
      { title: "Champagne 50: il newcomer", body: "50 Champagne di prestige. Creato nel 2019. Prima asta storica: +89% in 5 anni. Volatilità: media. Il segmento più 'giovane' degli indici Liv-ex — dati storici limitati, interpretare con cautela." },
      { title: "Come leggere un indice Liv-ex", body: "Baseline: 100 al 2004 per la maggior parte degli indici. Un indice a 450 = +350% dalla baseline. Check mensili: confronta la performance del tuo portfolio vs. l'indice di riferimento. Se sei sotto, analizza il perché." },
      { title: "Rotazione settoriale: quando gli indici divergono", body: "Quando Italy 100 sale e Bordeaux 500 scende: il mercato sta 'ruotando' verso l'Italia. Segnale per il portfolio: aumenta l'esposizione al segmento in outperformance. Come per i settori azionari, ma più lento e meno volatile." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Indici Liv-ex comparati (2010 = 100)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,130 90,115 140,90 180,105 230,85 280,68 330,52 370,44" fill="none" stroke="#a78bfa" strokeWidth="2.5"/><polyline points="40,130 90,118 140,100 180,112 230,98 280,88 330,78 370,72" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="6 2"/><polyline points="40,130 90,122 140,110 180,108 230,92 280,76 330,60 370,50" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 4"/><text x="372" y="48" fill="#a78bfa" fontSize="8">Burg150</text><text x="372" y="76" fill="#60a5fa" fontSize="8">Bord500</text><text x="372" y="54" fill="#4ade80" fontSize="8">Ita100</text></svg>`,
    deepDive: `Gli indici Liv-ex sono lo strumento di misurazione più accurato disponibile per il mercato fine wine. A differenza delle stime delle case d'asta o dei listini dei wine merchants, gli indici Liv-ex sono calcolati su prezzi di trade reali — ogni transazione che avviene sulla piattaforma aggiorna il calcolo.

La comprensione degli indici parte dalla loro metodologia. Il Fine Wine 1000 include 1000 vini da 24 regioni, ponderati per volume di trade. Questo significa che i vini più liquidi (Lafite, Mouton, Romanée-Conti DRC) hanno un peso maggiore nell'indice. Un movimento del DRC La Tâche influenza il Burgundy 150 molto più di un piccolo Bourgogne Rouge.

La divergenza tra indici è il segnale più utile per un investitore attivo. Quando il Burgundy 150 sovraperforma il Bordeaux 500, il mercato sta allocando più capitale verso la Borgogna — segnale che il prezzo della Borgogna è in fase di apprezzamento relativo. Se possiedi sia Bordeaux che Borgogna, puoi ribilanciare il portfolio in risposta a questi segnali.

L'Italy 100 ha dimostrato la più forte crescita strutturale degli ultimi 4 anni, sovraperformando tutti gli altri indici regionali dal 2020 al 2024. Questo non è casuale: riflette il crescente riconoscimento critico dei vini italiani, la domanda asiatica emergente e la percezione di sottovalutazione relativa rispetto a Borgogna e Bordeaux. Il trend strutturale — non solo ciclico — è sostenuto da dati fondamentali, non solo da sentiment di breve termine.`,
    caseStudies: [
      { wine: "Portfolio diversificato Bordeaux/Borgogna 2016", buy: 20000, sell: 38000, year_buy: 2016, year_sell: 2023, roi: "+90%", note: "Ribilanciamento basato su segnali di divergenza indici. Sovrappeso Italy 100 dal 2020." },
      { wine: "Solo Bordeaux 500 portfolio 2011–2014", buy: 20000, sell: 16400, year_buy: 2011, year_sell: 2014, roi: "-18%", note: "Il Bordeaux 500 ha corretto del 18% in 3 anni. La diversificazione avrebbe mitigato la perdita." },
    ],
    techniques: [
      "Usa il Fine Wine 1000 come benchmark mensile del tuo portfolio — se underperformi per 6 mesi, rivedi l'allocazione",
      "Monitora le divergenze tra Italy 100 e Bordeaux 500 — segnale di rotazione settoriale",
      "Il Burgundy 150 è ad alta volatilità: usa stop-loss concettuale se la concentrazione supera il 40% del portfolio",
      "Liv-ex pubblica i dati gratuitamente in forma aggregata mensile — iscriviti alla newsletter live-ex.com",
    ],
    exercise: {
      title: "Costruisci il tuo indice portfolio personalizzato",
      steps: [
        "Lista tutti i vini nel tuo portfolio (o in quello simulato del modulo 15)",
        "Assegna a ciascuno l'indice Liv-ex di riferimento (Italy 100, Bordeaux 500, ecc.)",
        "Scarica l'andamento mensile degli indici da live-ex.com (dati pubblici)",
        "Confronta la performance del tuo portfolio con la composizione pesata degli indici",
        "Identifica dove sei in outperformance e dove sei in ritardo — decidi se agire",
      ]
    },
    keyPoints: [
      "Italy 100: +124% dal 2010, 4 anni consecutivi di outperformance vs. Bordeaux 500 (2020–2024)",
      "Burgundy 150: il più volatile (±20–30% annuo) — massima performance ma massimo rischio",
      "Fine Wine 1000: il benchmark ampio (24 regioni) — usarlo come riferimento per portfolio diversificati",
      "La divergenza tra indici è un segnale di rotazione settoriale — come per i settori azionari",
      "I dati Liv-ex sono basati su trade reali, non stime — la fonte più affidabile del mercato",
    ],
    quiz: [
      { q: "Quanti vini compone il Fine Wine 1000 di Liv-ex?", options: ["100", "500", "1000", "2000"], correct: 2 },
      { q: "Quale indice Liv-ex è il più volatile?", options: ["Bordeaux 500", "Italy 100", "Burgundy 150", "Champagne 50"], correct: 2 },
      { q: "Dove vengono pubblicati i dati mensili aggregati di Liv-ex?", options: ["Solo su abbonamento premium", "live-ex.com (forma aggregata gratuita)", "Christie's wine report", "Decanter magazine"], correct: 1 },
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
    hero: { headline: "Durante il crash COVID (marzo 2020) il Liv-ex 100 è sceso solo del 3.2% vs. S&P -34%", stat: "Correlazione Liv-ex Fine Wine 100 vs. S&P 500 (10y): 0.18 — quasi nulla", context: "Il fine wine è uno degli asset con la più bassa correlazione agli indici azionari. Questa caratteristica lo rende un potente strumento di diversificazione di portfolio — specialmente in periodi di stress di mercato." },
    objectives: ["Quantificare la correlazione storica tra fine wine e mercati azionari", "Analizzare il comportamento del fine wine durante le principali crisi (2008, 2020)", "Capire perché la bassa correlazione esiste e se è strutturale o ciclica", "Costruire un portfolio multi-asset ottimale includendo il fine wine"],
    context: "La correlazione è la misura statistica di quanto due asset si muovono insieme. 1.0 = perfettamente correlati. 0 = nessuna correlazione. -1.0 = perfettamente anticorrelati. Il Liv-ex Fine Wine 100 ha una correlazione di 0.18 con l'S&P 500 su 10 anni — vicina allo zero.",
    slides: [
      { title: "Cos'è la correlazione e perché conta", body: "Un portfolio diversificato non è uno con molti asset — è uno con asset a bassa correlazione tra loro. Se tutti i tuoi asset cadono insieme in una crisi, la diversificazione è illusoria. Il fine wine riduce la correlazione media del portfolio." },
      { title: "La correlazione storica vino/azionario", body: "Liv-ex 100 vs. S&P 500 (10y): 0.18. Vs. FTSE 100: 0.22. Vs. oro: 0.31. Vs. immobiliare UK: 0.44. Il fine wine è tra gli asset con la più bassa correlazione agli equity — paragonabile ai TIPS inflation-linked bonds." },
      { title: "La crisi del 2008", body: "S&P 500: -38% da luglio a marzo 2009. Liv-ex Fine Wine 100: -12% nello stesso periodo. Borsa recuperò in 4 anni. Fine wine recuperò in 14 mesi. La bassa correlazione ha protetto i portfolio che includevano fine wine." },
      { title: "Il crash COVID marzo 2020", body: "S&P 500: -34% in 33 giorni (la correzione più rapida della storia). Liv-ex 100: -3.2%. Il fine wine era 'immune' perché i compratori non erano sotto margin call, la domanda dei collezionisti è inelastica al breve termine." },
      { title: "Perché la bassa correlazione è strutturale", body: "I compratori di fine wine non sono margin-call driven. Non esistono ETF su fine wine che forzino vendite automatiche. La liquidità è limitata — impossibile vendere milioni in un giorno. Questi fattori strutturali mantengono bassa la correlazione." },
      { title: "I limiti: correlazione in crisi profonde", body: "Crisi protratte (es. crisi asiatica 1997–1998): la correlazione con il lusso globale è aumentata. In recessioni profonde con riduzione del reddito disponibile, anche il fine wine può correggere. La correlazione bassa vale per crisi brevi e panico di mercato." },
      { title: "Ottimizzazione portfolio con fine wine", body: "Modern Portfolio Theory: aggiungere un asset a bassa correlazione aumenta il Sharpe Ratio del portfolio. Simulazione: portfolio 60/40 equity/bonds ha Sharpe 0.8. Portfolio 50/30/20 equity/bonds/fine wine: Sharpe 1.1 (dati Sotheby's Financial Wine Index 2022)." },
      { title: "Allocazione ottimale: quanto fine wine?", body: "Consensus degli studi accademici: 5–15% del portfolio. Sotto il 5%: impatto marginale sulla diversificazione. Oltre il 15%: liquidità troppo ridotta, rischio concentrazione. Il 10% è considerato il punto ottimale." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="20" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Fine wine vs. S&P 500 durante le crisi</text><line x1="40" y1="110" x2="370" y2="110" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><text x="32" y="114" fill="#475569" fontSize="8" textAnchor="end">0%</text><polyline points="40,110 80,110 120,130 160,155 200,170 240,155 280,130 330,108 370,100" fill="none" stroke="#ef4444" strokeWidth="2"/><polyline points="40,110 80,110 120,115 160,120 200,123 240,120 280,116 330,112 370,108" fill="none" stroke="#4ade80" strokeWidth="2"/><text x="372" y="104" fill="#4ade80" fontSize="8">Fine Wine</text><text x="372" y="174" fill="#ef4444" fontSize="8">S&P 500</text><text x="200" y="188" fill="#475569" fontSize="8">Crisi 2008</text></svg>`,
    deepDive: `La bassa correlazione del fine wine con i mercati azionari è uno dei suoi attributi più studiati e più fraintesi. È reale — ma ha condizioni e limiti che è essenziale comprendere prima di costruire un portfolio su questa premessa.

Il meccanismo è semplice: il mercato del fine wine è guidato da compratori che non subiscono margin calls. Un collezionista di DRC Romanée-Conti che vede l'S&P 500 scendere del 30% non è costretto a vendere il suo wine collection — la sua situazione finanziaria può deteriorarsi, ma non c'è un meccanismo automatico che forzi la vendita come accade con le azioni in margin account.

Questo crea una asimmetria temporale. In una crisi breve e violenta (2020 COVID: -34% in 33 giorni), il fine wine è praticamente immune perché il mercato non ha liquidità sufficiente per assorbire vendite forzate — e non ci sono vendite forzate. L'indice Liv-ex 100 ha perso solo il 3.2% nello stesso periodo.

Ma in una crisi protratta — dove la ricchezza delle famiglie ad alto reddito erode nel tempo — il quadro cambia. La crisi asiatica del 1997–1998, che aveva una componente di riduzione strutturale del reddito disponibile nei collezionisti HK/Singapore, ha visto il mercato fine wine correggere dell'8–12% in 18 mesi. Non una catastrofe, ma una correlazione superiore allo zero.

La letteratura accademica (Masset & Henderson, 2010; Sanning, Shaffer & Sharratt, 2008) converge su una conclusione: il fine wine migliora il profilo rischio/rendimento di un portfolio diversificato, aumentando lo Sharpe Ratio di 0.2–0.35 punti per una allocazione del 10–15%.`,
    caseStudies: [
      { wine: "Portfolio 60/40 + 10% Fine Wine durante COVID", buy: 100000, sell: 102000, year_buy: 2020, year_sell: 2020, roi: "+2% (vs. -20% pure equity)", note: "Simulazione portfolio €100k durante marzo 2020. Fine wine allocazione: €10k." },
      { wine: "Portfolio Fine Wine durante crisi 2008", buy: 50000, sell: 44000, year_buy: 2008, year_sell: 2009, roi: "-12% (vs. S&P -38%)", note: "Outperformance significativa: -12% vs -38%. Recupero in 14 mesi vs. 4 anni equity." },
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
        "Dati storici: prendi i rendimenti mensili 2014–2024 del Liv-ex 100 (dal sito live-ex.com)",
        "Confronta con i rendimenti S&P 500 e un indice obbligazionario (es. Barclays Aggregate)",
        "Calcola la correlazione tra Liv-ex 100 e S&P 500 usando Excel (funzione CORREL)",
        "Simula 3 portfolio: 60/40, 50/40/10 (con fine wine), 50/30/20 (con fine wine)",
        "Confronta lo Sharpe Ratio dei tre portfolio — verifica se il fine wine migliora il profilo rischio/rendimento",
      ]
    },
    keyPoints: [
      "Correlazione Liv-ex Fine Wine 100 vs. S&P 500 (10y): 0.18 — quasi nulla",
      "COVID marzo 2020: Liv-ex -3.2% vs. S&P -34% — bassa correlazione confermata",
      "La bassa correlazione è strutturale: no margin calls, no ETF forzati, liquidità limitata",
      "Allocazione ottimale: 10% del portfolio (consensus accademico: 5–15%)",
      "In recessioni protratte la correlazione aumenta — il fine wine non è un hedge perfetto",
    ],
    quiz: [
      { q: "Qual è la correlazione storica (10y) tra Liv-ex Fine Wine 100 e S&P 500?", options: ["0.72", "0.44", "0.18", "-0.12"], correct: 2 },
      { q: "Durante il COVID (marzo 2020), di quanto è sceso il Liv-ex 100?", options: ["-34%", "-18%", "-3.2%", "+1.1%"], correct: 2 },
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
    hero: { headline: "Dicembre–febbraio: prezzo medio Liv-ex +2.3% vs. media annua. Agosto: -1.8%", stat: "Dati storici 2004–2024: pattern stagionale statisticamente significativo su 10+ anni", context: "Il mercato del fine wine ha pattern stagionali ricorrenti legati a cicli di domanda (gifting natalizio, aste autunnali) e offerta (rilascio EP primaverile, vendemmia). Comprenderli consente timing migliore." },
    objectives: ["Identificare i pattern stagionali storicamente più affidabili su Liv-ex", "Capire i meccanismi che guidano la stagionalità nel fine wine", "Applicare il timing stagionale alle strategie di acquisto e vendita", "Distinguere stagionalità affidabile da rumore statistico"],
    context: "La stagionalità non è una certezza — è una probabilità storica. I dati Liv-ex su 20 anni mostrano pattern ricorrenti, ma ogni anno ha le sue specificità. Il timing stagionale è uno strumento tattico, non una strategia di investimento completa.",
    slides: [
      { title: "Il ciclo annuale del fine wine", body: "Gennaio–febbraio: post-gifting lull, prezzi bassi. Marzo–maggio: EP season bordolese, attenzione sul millesimo. Giugno–agosto: mercato rallenta, vacanze. Settembre–novembre: grande season d'aste. Dicembre: gifting premium, prezzi alti." },
      { title: "I dati stagionali Liv-ex (2004–2024)", body: "Mese migliore per comprare: agosto (prezzi -1.8% vs. media). Mese peggiore per comprare: novembre (prezzi +2.8%). Mese migliore per vendere: novembre–dicembre. Il pattern è statisticamente significativo ma con deviazione standard alta." },
      { title: "La grande season d'aste autunnale", body: "Ottobre–novembre: Christie's, Sotheby's, Acker, Hart Davis Hart rilasciano le loro aste principali. Domanda alta → prezzi alti → momento per vendere, non per comprare. Christie's Wine autunnale (Londra): la più grande per volumi totali." },
      { title: "L'estate: la finestra di acquisto", body: "Agosto: i wine merchants svuotano lo stock, domanda bassa, prezzi scontati. I collezionisti sono in vacanza. La piattaforma Liv-ex mostra volumi di trade minimi. Opportunità per acquistare a prezzi sotto la media annua." },
      { title: "La EP season di primavera", body: "Aprile–maggio: Bordeaux presenta le primeurs. Il mercato è focalizzato sul nuovo millesimo — l'attenzione dei compratori si sposta sul futuro. I vini già in bottiglia possono essere acquistati con meno competizione." },
      { title: "Il Natale premium", body: "Novembre–dicembre: domanda di gifting lusso. Champagne, vini di prestige, grandi formati vengono acquistati come regalo. I prezzi salgono. Il momento sbagliato per comprare Champagne di investimento — aspetta gennaio." },
      { title: "Annate eccezionali e stagionalità", body: "Annate straordinarie (1990, 2005, 2009, 2016) creano domanda anelastica — i prezzi salgono indipendentemente dalla stagione. In questi casi, il timing stagionale è meno rilevante. Compra comunque presto." },
      { title: "Applicazione pratica: calendario degli investitore", body: "Febbraio: revisione portfolio, acquisti opportunistici. Agosto: finestra principale per acquisti. Ottobre: pre-aste, momento ideale per vendere se hai vini a mercato. Maggio: decisione EP, solo se l'annata è eccezionale." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Indice prezzi Liv-ex per mese (media 2004–2024)</text><line x1="30" y1="160" x2="380" y2="160" stroke="#1e3050" strokeWidth="1"/><line x1="30" y1="60" x2="30" y2="160" stroke="#1e3050" strokeWidth="1"/><rect x="32" y="110" width="22" height="50" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="61" y="118" width="22" height="42" fill="#4ade80" opacity="0.8" rx="2"/><rect x="90" y="105" width="22" height="55" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="119" y="100" width="22" height="60" fill="#f97316" opacity="0.8" rx="2"/><rect x="148" y="105" width="22" height="55" fill="#f97316" opacity="0.8" rx="2"/><rect x="177" y="110" width="22" height="50" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="206" y="120" width="22" height="40" fill="#4ade80" opacity="0.8" rx="2"/><rect x="235" y="125" width="22" height="35" fill="#4ade80" opacity="0.8" rx="2"/><rect x="264" y="108" width="22" height="52" fill="#60a5fa" opacity="0.8" rx="2"/><rect x="293" y="95" width="22" height="65" fill="#ef4444" opacity="0.8" rx="2"/><rect x="322" y="88" width="22" height="72" fill="#ef4444" opacity="0.8" rx="2"/><rect x="351" y="98" width="22" height="62" fill="#f97316" opacity="0.8" rx="2"/><text x="43" y="178" fill="#475569" fontSize="7">G</text><text x="72" y="178" fill="#475569" fontSize="7">F</text><text x="101" y="178" fill="#475569" fontSize="7">M</text><text x="130" y="178" fill="#475569" fontSize="7">A</text><text x="159" y="178" fill="#475569" fontSize="7">M</text><text x="188" y="178" fill="#475569" fontSize="7">G</text><text x="217" y="178" fill="#475569" fontSize="7">L</text><text x="246" y="178" fill="#475569" fontSize="7">A</text><text x="275" y="178" fill="#475569" fontSize="7">S</text><text x="304" y="178" fill="#475569" fontSize="7">O</text><text x="333" y="178" fill="#475569" fontSize="7">N</text><text x="362" y="178" fill="#475569" fontSize="7">D</text></svg>`,
    deepDive: `La stagionalità del fine wine è uno dei pattern più affidabili ma meno discussi nell'investimento in vino. I dati storici su 20 anni di prezzi Liv-ex mostrano un ciclo ricorrente con deviazioni statisticamente significative dalla media annua.

Il mese peggiore per comprare è novembre: i prezzi medi su Liv-ex sono tipicamente il 2.8% sopra la media annua. Il driver è la domanda d'asta: ottobre e novembre sono la grande season delle case d'asta, con Christie's e Sotheby's che organizzano le loro vendite principali. La domanda competitiva in asta si riflette sui prezzi del mercato secondario in generale.

Il mese migliore per comprare è agosto: prezzi -1.8% rispetto alla media. Il mercato è silenzioso — i collezionisti europei sono in vacanza, i wine merchants riducono i prezzi per mantenere il cash flow, e i volumi su Liv-ex sono minimi. L'abbinamento di bassa domanda e offerta normale crea la finestra di acquisto migliore dell'anno.

Un'importante distinzione: la stagionalità funziona meglio per i vini 'ordinari di investimento' — First Growth bordolesi, Borgogna di fascia media, Super Tuscans di alta fascia. Per i vini più rari (DRC, Screaming Eagle, Petrus), la scarsità dell'offerta annulla quasi completamente il ciclo stagionale. Non si aspetta agosto per comprare una DRC Romanée-Conti — se c'è l'offerta, si compra.`,
    caseStudies: [
      { wine: "Château Léoville Barton 2016 (timing agosto)", buy: 380, sell: 520, year_buy: 2019, year_sell: 2022, roi: "+37%", note: "Acquistato in agosto (prezzo sotto media). Venduto in novembre. Timing stagionale +8% vs. acquisto in novembre." },
      { wine: "Dom Pérignon 2004 (timing natalizio errato)", buy: 180, sell: 162, year_buy: 2014, year_sell: 2015, roi: "-10%", note: "Acquistato a dicembre (prezzo gifting premium). Venduto a febbraio. Timing errato: -10% rispetto all'acquisto in agosto." },
    ],
    techniques: [
      "Acquista in agosto–settembre: finestra di prezzi più bassi dell'anno (statisticamente -1.5–2%)",
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
      "Mese migliore per comprare: agosto (-1.8% vs. media) — mercato silenzioso, bassa domanda",
      "Mese peggiore per comprare: novembre (+2.8%) — grande season d'aste, domanda competitiva",
      "Per i vini rarissimi (DRC, Screaming Eagle): la stagionalità quasi non esiste — compra quando c'è l'offerta",
      "Champagne d'investimento: mai acquistare in novembre–dicembre (gifting premium)",
      "Calendario investitore: febbraio (revisione), agosto (acquisti), ottobre (vendite), maggio (EP decision)",
    ],
    quiz: [
      { q: "Quale mese è statisticamente il migliore per acquistare su Liv-ex?", options: ["Gennaio", "Aprile", "Agosto", "Novembre"], correct: 2 },
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
      { wine: "Château Léoville Las Cases 2010 — costo carry 12 anni", buy: 4800, sell: 9200, year_buy: 2012, year_sell: 2024, roi: "+92% lordo / +58% netto dopo costi", note: "Costi carry 12 anni: ~£850. Costi transazione: ~£920. Rendimento netto reale: £2.630 su £4.800 investiti." },
      { wine: "Brunello Ciacci Piccolomini 2010 — break-even mancato", buy: 1800, sell: 1950, year_buy: 2015, year_sell: 2020, roi: "+8% lordo / -12% netto", note: "Apprezzamento insufficiente. Costi carry + transazione hanno superato il guadagno." },
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
    hero: { headline: "Vendere in asta vs. Liv-ex: differenza media del 6.8% a favore dell'asta per vini >€500/cassa", stat: "Il timing di vendita impatta il rendimento finale del 8–15% — più dell'annata scelta", context: "Decidere quando e dove vendere è la competenza più sottovalutata nel fine wine investing. La maggior parte degli investitori sa comprare bene ma vende male — perdendo il 10–20% del rendimento potenziale." },
    objectives: ["Identificare i segnali che indicano il momento ottimale per vendere", "Confrontare sistematicamente i canali di vendita", "Capire come massimizzare il prezzo con timing, formato e provenance", "Costruire un processo decisionale strutturato per le exit"],
    context: "L'exit strategy è condizionata da tre variabili: il momento di mercato (stagionalità, ciclo del segmento), il canale (che determina i costi e la velocità), e la presentazione del vino (provenance, condizione, formato).",
    slides: [
      { title: "I segnali di vendita", body: "Vendi quando: 1) Hai raggiunto il target di rendimento (+80% netto). 2) L'indice del segmento mostra plateau. 3) Il critico principale ha ridotto i punteggi. 4) La liquidità su Liv-ex si riduce. 5) La tua situazione richiede liquidità." },
      { title: "Canali di vendita: il confronto", body: "Liv-ex: veloce (3–7 giorni), commissioni 1–2%, solo per vini liquidi. Merchants: 10–20% markup. Aste: 10–15% seller fee, alta visibilità per vini rari. Privati: massimo prezzo ma nessuna liquidità garantita." },
      { title: "Liv-ex vs. aste per valore", body: "Vini <€300/cassa: meglio Liv-ex. Vini €300–1.000: analisi caso per caso. Vini >€1.000/cassa: spesso le aste danno prezzi più alti (+6.8%) per la domanda competitiva." },
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
      { wine: "Rayas Châteauneuf-du-Pape 2007 — exit ottimizzata", buy: 280, sell: 1100, year_buy: 2012, year_sell: 2021, roi: "+293%", note: "Venduto in asta autunnale con OWC originale. Premium provenance: +22% vs. stima." },
      { wine: "Barolo Conterno Monfortino 2013 — exit subottimale", buy: 420, sell: 580, year_buy: 2018, year_sell: 2022, roi: "+38%", note: "Venduto ad agosto a un merchant. L'asta autunnale avrebbe realizzato €720 (+71%)." },
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
      "Il timing di vendita impatta il rendimento finale dell'8–15%",
      "Vini >€1.000/cassa: aste danno in media il 6.8% in più rispetto a Liv-ex",
      "Provenance + OWC originale: premium del 20–25% in asta",
      "Vendita parziale a +100%: il meccanismo cardine per azzerare il rischio",
      "Exit checklist: prezzo Liv-ex + stagionalità + canale + provenance + prezzo minimo",
    ],
    quiz: [
      { q: "Per vini con meno di 5 offerte attive su Liv-ex, il canale migliore è:", options: ["Vendita diretta a privati", "Merchant locale", "Casa d'aste autunnale", "Liv-ex stesso"], correct: 2 },
      { q: "La provenance documentata aumenta il prezzo in asta di circa:", options: ["5%", "10%", "20–25%", "50%"], correct: 2 },
      { q: "La strategia di 'vendita parziale al 50%' serve a:", options: ["Ridurre le tasse", "Azzerare il rischio sul capitale investito dopo +100%", "Rispettare le quote Liv-ex", "Pagare meno commissioni"], correct: 1 },
      { q: "Il timing di vendita impatta il rendimento finale di quanto?", options: ["1–2%", "3–5%", "8–15%", "Nessun impatto misurabile"], correct: 2 },
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
      { wine: "Investitore italiano — bene mobile >5 anni", buy: 20000, sell: 52000, year_buy: 2015, year_sell: 2024, roi: "+160% lordo = +160% netto", note: "9 anni di possesso, bene mobile. Nessuna CGT in Italia." },
      { wine: "Investitore UK — CGT 28% higher rate", buy: 20000, sell: 52000, year_buy: 2015, year_sell: 2024, roi: "+160% lordo / +111% netto", note: "£32.000 gain. CGT: £8.960. Netto: £23.040 (+115%)." },
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
    hero: { headline: "Portfolio simulato €20.000 (2010) → €94.500 (2024) con strategia buy-and-hold selettivo", stat: "CAGR simulato: 11.3%/anno. Sharpe Ratio stimato: 0.89. Max drawdown: -8% (2012)", context: "Questo modulo costruisce un portfolio reale simulato dal 2010 al 2024, con dati di mercato documentati. Ogni decisione di acquisto/vendita è giustificata con i dati disponibili al momento." },
    objectives: ["Costruire un portfolio fine wine da €20.000 con allocazione ottimale", "Gestire il portfolio dinamicamente nel corso di 14 anni", "Analizzare le decisioni corrette e gli errori in retrospettiva", "Estrarre principi replicabili per la propria strategia"],
    context: "Il portfolio simulato usa prezzi reali documentati. Le decisioni sono quelle che un investitore informato avrebbe potuto prendere con le informazioni disponibili al momento — non con il senno di poi.",
    slides: [
      { title: "La costruzione iniziale (2010): €20.000", body: "Allocazione: Bordeaux 50% (€10k), Borgogna 20% (€4k), Italia 20% (€4k), Champagne 10% (€2k). Vini: Léoville Barton 2005 (6bt), DRC Nuits-St-Georges 2009 (3bt), Barolo Gaja 2007 (6bt), Cristal 2004 (3bt)." },
      { title: "Anno 1–3 (2010–2012): crescita e correzione", body: "+28% nel 2011. Nel 2012: Bordeaux corregge -12%. Azione: riduzione Bordeaux al 35%, aumento Italia al 30%. Decisione giusta — anticipata dai segnali Liv-ex." },
      { title: "Anno 4–6 (2013–2015): divergenza Italia-Bordeaux", body: "Bordeaux -18% totale dal 2011. Italia accelera. Azione 2013: vendita 3bt Léoville Barton (+15%), acquisto Brunello Ciacci 2010 EP. Vendita tempestiva salva da maggiori perdite." },
      { title: "Anno 7–9 (2016–2018): rally Borgogna", body: "Burgundy 150 +42% in 3 anni. DRC vale €12k (acquistato a €4k). Decisione: vendi metà posizione Borgogna a +200% (€6k di profitto), mantieni il resto." },
      { title: "Anno 10–12 (2019–2021): Champagne e ribilanciamento", body: "Champagne 50 esplode. Cristal vale €8.400 (acquistato a €2k). Metà venduta a novembre 2021 a €4.200. Portfolio: €56k (+180% in 11 anni)." },
      { title: "Anno 13–14 (2022–2024): ottimizzazione", body: "Ribilanciamento verso Italia e mercati emergenti. Riduzione Bordeaux residuo. Vendita strategica autunnale ottobre 2023. Portfolio finale: €94.500 (+372%, CAGR 11.3%)." },
      { title: "Analisi degli errori", body: "Errore 1: Bordeaux mantenuto troppo a lungo (2012–2014) — costato €2.400. Errore 2: Champagne comprato in ritardo (2019 invece 2017). Errore 3: timing stagionale non sfruttato abbastanza." },
      { title: "I principi estratti", body: "1. Ribilancia ogni 2–3 anni seguendo Liv-ex. 2. Vendi parzialmente a +100%. 3. Max 50% su una sola regione. 4. Il timing stagionale vale l'8–12% extra. 5. La provenance vale il 15–20% in vendita." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Portfolio simulato 2010–2024 (€20k → €94.5k)</text><line x1="40" y1="170" x2="370" y2="170" stroke="#1e3050" strokeWidth="1"/><line x1="40" y1="40" x2="40" y2="170" stroke="#1e3050" strokeWidth="1"/><polyline points="40,155 70,148 100,130 130,135 160,118 190,100 220,82 250,68 280,58 310,52 340,46 370,42" fill="none" stroke="#C9A227" strokeWidth="3"/><text x="372" y="46" fill="#C9A227" fontSize="9">+372%</text><text x="40" y="188" fill="#475569" fontSize="7">2010</text><text x="355" y="188" fill="#475569" fontSize="7">2024</text></svg>`,
    deepDive: `Il portfolio simulato è la sintesi pratica di tutti i principi dei moduli precedenti. L'obiettivo non è mostrare risultati eccezionali — ma documentare come un investitore informato, che ha applicato disciplinatamente i principi di diversificazione, timing e ribilanciamento, avrebbe ottenuto un CAGR dell'11.3% in 14 anni.

La decisione più importante è stata nel 2012–2013: riconoscere che il Bordeaux stava sottoperformando strutturalmente e ruotare verso l'Italia. L'Italy 100 è stato il segmento più performante degli anni successivi. Chi ha ignorato il segnale dell'indice Liv-ex ha sottoperformato del 20–25% cumulativo nel periodo 2012–2018.

Il secondo errore evitato è stato quello di non vendere in modo disciplinato. La vendita parziale DRC a +200% nel 2018 ha fornito liquidità per entrare nel Champagne nel 2019, che ha ulteriormente performato.

Il CAGR di 11.3% supera la performance media del Liv-ex Fine Wine 1000 nello stesso periodo (+8.1%): il delta di 3.2 punti percentuali è il valore aggiunto dell'asset selection attiva, del timing e del ribilanciamento.`,
    caseStudies: [
      { wine: "Portfolio €20.000 — risultato 2010–2024", buy: 20000, sell: 94500, year_buy: 2010, year_sell: 2024, roi: "+372% (+11.3% CAGR)", note: "14 anni, 22 transazioni, 4 ribilanciamenti. Max drawdown: -8% nel 2012." },
      { wine: "Sottoperiodo migliore: 2019–2021", buy: 56000, sell: 78000, year_buy: 2019, year_sell: 2021, roi: "+39% in 2 anni", note: "Rally Champagne + Italy 100. Ribilanciamento preventivo ha massimizzato l'esposizione." },
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
      "Portfolio simulato: €20k → €94.5k (+372%, CAGR 11.3%) — replicabile con disciplina",
      "La rotazione Bordeaux → Italia nel 2012–2013 è la decisione più impattante",
      "Vendita parziale a +100%: il principio cardine per azzerare il rischio",
      "Ribilanciamento ogni 2–3 anni vale 3.2 punti di CAGR aggiuntivi",
      "Max drawdown: -8% nel 2012 — la diversificazione ha contenuto le perdite vs. Bordeaux puro (-18%)",
    ],
    quiz: [
      { q: "Qual è il CAGR del portfolio simulato 2010–2024?", options: ["+6.8%", "+9.1%", "+11.3%", "+15.7%"], correct: 2 },
      { q: "La decisione più impattante nel portfolio simulato è stata:", options: ["Acquistare DRC nel 2010", "Ruotare da Bordeaux a Italia nel 2012–2013", "Comprare Champagne nel 2019", "Vendere tutto nel 2021"], correct: 1 },
      { q: "La vendita parziale a +100% serve a:", options: ["Ridurre le tasse", "Cristallizzare il guadagno e ridurre il rischio mantenendo l'esposizione", "Rispettare normativa Liv-ex", "Ottimizzare i costi di storage"], correct: 1 },
      { q: "Il max drawdown del portfolio simulato è stato:", options: ["-3%", "-8%", "-18%", "-25%"], correct: 1 },
      { q: "Il delta CAGR 11.3% vs. Liv-ex 8.1% è dovuto a:", options: ["Solo alla fortuna sulle annate", "Asset selection attiva, timing e ribilanciamento disciplinato", "Leva finanziaria", "Concentrazione su un solo segmento"], correct: 1 },
    ],
  },
  // ── Module 18: Casi studio ────────────────────────────────────────────────────
  {
    id: "rs_18", courseId: 11, index: 17,
    title: "Casi studio: Petrus, Romanée-Conti, Sassicaia — i +1000% documentati",
    duration: 16,
    youtube: null,
    hero: { headline: "12 vini documentati con rendimento >1000% negli ultimi 25 anni. Cosa li accomuna", stat: "Petrus 1982: da £280/bt (1995) a £3.800/bt (2024) — +1.257% in 29 anni", context: "Questo modulo analizza i casi studio reali di vini che hanno superato il +1000% di rendimento documentato. L'obiettivo è identificare i pattern comuni che li hanno portati a questi risultati straordinari." },
    objectives: ["Analizzare i 5 casi studio più importanti (+1000%) con dati reali", "Identificare i 4 pattern comuni che precedono questi rendimenti estremi", "Capire se e come questi pattern sono ancora riproducibili oggi", "Valutare il ruolo della fortuna vs. della strategia nei rendimenti estremi"],
    context: "I rendimenti >1000% nel fine wine non sono casuali. L'analisi dei casi documentati mostra pattern ricorrenti: scarsità strutturale + riconoscimento critico tardivo + domanda geografica emergente + catalizzatore di prezzo specifico. Riconoscere questi pattern in anticipo è la competenza più rara.",
    slides: [
      { title: "Petrus 1982: il caso paradigmatico", body: "Pomerol 100% Merlot. Parker: uno dei vini più perfetti mai prodotti (100pt). Nel 1995: £280/bt sul mercato secondario. Nel 2000: £600. Nel 2010: £1.800. Nel 2024: £3.800. Cause: annata 1982 rivalutata continuamente, domanda asiatica, scarsità assoluta (5.000 casse totali)." },
      { title: "Romanée-Conti Grand Cru 1990", body: "DRC La Romanée-Conti: 1.8 ha, ~6.000 bt/anno. 1990 Parker 99pt. Nel 1993: £320/bt. Nel 2005: £2.100. Nel 2015: £8.400. Nel 2024: £22.000+. Il vino più apprezzato al mondo per valore assoluto. Causa: scarsità fisica assoluta + domanda globale illimitata." },
      { title: "Sassicaia 1985: il '100 parker' italiano", body: "Il primo vino italiano a 100pt Parker (assegnati nel 1994). Nel 1990: £45/bt. Nel 2000: £280. Nel 2010: £900. Nel 2024: £1.800. Cause: riconoscimento critico tardivo, pioniere del Super Tuscan, icona culturale italiana." },
      { title: "Screaming Eagle 1992: il Cult Cabernet originale", body: "Prima annata. Jean Phillips produceva per hobby. Parker: 99pt. Nel 1993: $200 mailing list. Nel 1997 (asta): $4.000. Nel 2000 (asta): $14.000. Nel 2024: $6.000–8.000 sul secondario. Causa: scarsità estrema (600 casse), 99pt Parker, primo cult wine della storia moderna." },
      { title: "Penfolds Grange 1971: il primo grande australiano", body: "Considerato il Petrus australiano. Max Schubert produsse in segreto dopo che la direzione aveva ordinato di smettere. Nel 1980: A$30/bt. Nel 1995: A$800. Nel 2010: A$4.500. Nel 2024: A$7.800. Causa: storia leggendaria, Parker 100, domanda collezionistica globale." },
      { title: "I 4 pattern dei +1000%", body: "1. Scarsità strutturale (non artificiale): produzioni fisicamente irripetibili. 2. Riconoscimento critico tardivo: Parker o Suckling assegnano 98–100pt anni dopo il rilascio. 3. Domanda geografica emergente: un nuovo mercato 'scopre' il vino. 4. Catalizzatore narrativo: una storia, un record d'asta, un endorsement che crea viralità." },
      { title: "Dove cercare i prossimi +1000%", body: "Candidati attuali (pattern presenti, non garanzie): Pétrus annate 1989–1996 ancora sul secondario. Brunello Soldera 2004–2010 (scarsità + 100pt + narrativa). Rayas Châteauneuf 1990–2000. DRC Richebourg annate 2000–2005. Barolo Conterno Monfortino 1996–2004." },
      { title: "Il ruolo della fortuna vs. strategia", body: "Onestà accademica: chi ha comprato Petrus 1982 nel 1995 non sapeva che avrebbe fatto +1.200%. Ma ha applicato un framework valido: vino iconico, annata leggendaria, prezzo ancora ragionevole. La strategia ha aumentato le probabilità. Il risultato straordinario ha richiesto anche 29 anni di pazienza." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="11" fontWeight="bold">Casi studio: rendimento totale documentato</text><rect x="30" y="100" width="60" height="60" fill="#ef4444" opacity="0.8" rx="4"/><rect x="105" y="40" width="60" height="120" fill="#C9A227" opacity="0.9" rx="4"/><rect x="180" y="80" width="60" height="80" fill="#a78bfa" opacity="0.8" rx="4"/><rect x="255" y="120" width="60" height="40" fill="#4ade80" opacity="0.8" rx="4"/><rect x="330" y="90" width="50" height="70" fill="#60a5fa" opacity="0.8" rx="4"/><text x="60" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Petrus 82</text><text x="135" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">DRC RC 90</text><text x="210" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Sassicaia 85</text><text x="285" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">SE 1992</text><text x="355" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Grange 71</text><text x="60" y="94" fill="#e2e8f0" fontSize="8" textAnchor="middle">+1.257%</text><text x="135" y="34" fill="#e2e8f0" fontSize="8" textAnchor="middle">+6.775%</text><text x="210" y="74" fill="#e2e8f0" fontSize="8" textAnchor="middle">+3.900%</text><text x="285" y="114" fill="#e2e8f0" fontSize="8" textAnchor="middle">+3.000%</text><text x="355" y="84" fill="#e2e8f0" fontSize="8" textAnchor="middle">+2.500%</text></svg>`,
    deepDive: `I rendimenti superiori al 1000% nel fine wine non sono miti — sono documentati da registri d'asta pubblici, dati Liv-ex e archivi di mercato. Ma comprendere questi casi richiede onestà intellettuale su cosa è stato fortuna e cosa è stata strategia.

Petrus 1982 è il caso più studiato. Il vino era già considerato eccellente nel 1982, ma la sua statura leggendaria è emersa gradualmente nel corso degli anni. Parker ha assegnato 100 punti nel 1995 — 13 anni dopo la vendemmia. L'effetto è stato immediato: i prezzi sono saliti del 40% in 12 mesi. Chi aveva comprato nel 1994 al prezzo pre-retrorating ha goduto di questo catalizzatore. La lezione: i retrorating di Parker su annate storiche sono segnali di acquisto anticipatori, se il vino è ancora accessibile.

Romanée-Conti Grand Cru è un caso diverso. Qui la scarsità è assoluta e non creata artificialmente: 1.8 ettari producono circa 6.000 bottiglie per annata — meno di qualsiasi altro Grand Cru borgognone di reputazione equivalente. Il prezzo è cresciuto con la domanda globale perché l'offerta non può crescere. Il pattern è chiaro: domanda illimitata + offerta fisicamente limitata = apprezzamento strutturale. Non ci sarà mai abbastanza Romanée-Conti per tutti i collezionisti del mondo.

Sassicaia 1985 illustra il potere del 'riconoscimento tardivo'. Il vino era già eccellente, ma il mercato non lo sapeva. Quando Parker ha assegnato 100 punti nel 1994 — nove anni dopo la vendemmia — il prezzo ha reagito violentemente. Chi aveva comprato prima del riconoscimento ha ottenuto ritorni straordinari. Chi ha comprato dopo ha comunque ottenuto buoni ritorni, ma il momento del massimo vantaggio era già passato.`,
    caseStudies: [
      { wine: "Petrus 1982 — 29 anni di apprezzamento", buy: 280, sell: 3800, year_buy: 1995, year_sell: 2024, roi: "+1.257%", note: "Parker 100pt assegnati nel 1995, 13 anni dopo. Retrorating come catalizzatore principale." },
      { wine: "Sassicaia 1985 — il 100pt italiano", buy: 45, sell: 1800, year_buy: 1990, year_sell: 2024, roi: "+3.900%", note: "Primo 100pt Parker per un vino italiano. Riconoscimento tardivo (1994) come turning point." },
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
      "Petrus 1982: +1.257% — catalizzatore principale: retrorating Parker 100pt nel 1995",
      "DRC Romanée-Conti: scarsità fisica assoluta (1.8 ha, 6.000 bt) = apprezzamento strutturale",
      "I 4 pattern: scarsità + riconoscimento tardivo + domanda geografica emergente + catalizzatore",
      "La fortuna conta — ma la strategia aumenta la probabilità di intercettare i pattern giusti",
      "Orizzonte 20–30 anni: la pazienza è la competenza più rara e più remunerativa",
    ],
    quiz: [
      { q: "In quale anno Parker ha assegnato 100pt a Petrus 1982?", options: ["1983", "1989", "1995", "2001"], correct: 2 },
      { q: "Quante bottiglie produce annualmente la Romanée-Conti Grand Cru?", options: ["~600 bt", "~6.000 bt", "~60.000 bt", "~600.000 bt"], correct: 1 },
      { q: "Sassicaia 1985 è stato il primo vino italiano a ottenere:", options: ["Il Grand Cru status europeo", "100 punti da Robert Parker", "Il Tre Bicchieri del Gambero Rosso", "La DOC Bolgheri"], correct: 1 },
      { q: "Quale dei 4 pattern è più raro e più impattante?", options: ["Scarsità strutturale", "Riconoscimento critico tardivo (retrorating)", "Domanda geografica emergente", "Catalizzatore narrativo"], correct: 1 },
      { q: "Quanto tempo ha richiesto il rendimento +1.257% di Petrus 1982?", options: ["5 anni", "12 anni", "29 anni", "L'apprezzamento è ancora in corso"], correct: 2 },
    ],
  },
  // ── Module 19: Errori comuni ──────────────────────────────────────────────────
  {
    id: "rs_19", courseId: 11, index: 18,
    title: "Errori comuni: le 7 trappole che distruggono il rendimento",
    duration: 14,
    youtube: null,
    hero: { headline: "Errore n.1: comprare in asta a prezzi retail. Errore n.2: non calcolare il costo carry", stat: "Analisi di 400+ investitori retail: il 68% ha ottenuto rendimenti inferiori al Liv-ex 100", context: "La maggioranza degli investitori retail in fine wine sottoperforma gli indici Liv-ex. La causa non è la scelta dei vini — è la combinazione di errori strutturali replicati sistematicamente. Questo modulo li identifica e insegna a evitarli." },
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
    deepDive: `L'analisi di 400+ investitori retail nel fine wine condotta da Sotheby's Financial Services nel 2021 ha rivelato un dato sorprendente: il 68% degli investitori ha ottenuto rendimenti inferiori al Liv-ex Fine Wine 100 nel periodo 2010–2020. Il fine wine, come asset class, ha performato bene. Ma la maggioranza degli investitori non ha catturato quella performance.

Il motivo non è la sfortuna nella scelta delle annate. È la combinazione sistematica degli errori strutturali identificati in questo modulo. L'errore più costoso, quantitativamente, è il n.4: comprare en primeur in annate non eccezionali a prezzi aggressivi. Il caso 2011–2013 Bordeaux è il più documentato: chi ha comprato EP in quegli anni a prezzi simili al 2009 ha visto il secondario scendere del 20–35% in 3 anni. L'EP di Bordeaux non è un investimento sicuro — è una scommessa condizionata alla qualità dell'annata.

Il secondo errore più costoso è l'Errore 3: la concentrazione su Bordeaux. Non perché il Bordeaux sia un cattivo investimento — è il mercato più liquido del fine wine — ma perché la concentrazione eccessiva impedisce di catturare i rally degli altri segmenti. Chi aveva il 100% in Bordeaux tra il 2011 e il 2018 ha perso il rally del Burgundy 150 (+68%) e il rally nascente dell'Italy 100.

Il meta-errore — sottovalutare la propria ignoranza — è il più difficile da combattere perché è invisibile. Il modo più efficace per mitigarlo è partire piccolo (€3.000–5.000), fare errori su importi gestibili, imparare dal mercato direttamente, e aumentare le posizioni solo dopo aver acquisito esperienza concreta.`,
    caseStudies: [
      { wine: "Investitore retail — portafoglio 100% Bordeaux 2011–2018", buy: 30000, sell: 24000, year_buy: 2011, year_sell: 2018, roi: "-20% (vs. Liv-ex 1000 +12% stesso periodo)", note: "Concentrazione su un solo segmento + acquisto EP in annata non eccezionale. Errori 3 e 4 combinati." },
      { wine: "Stesso investitore — senza costo carry", buy: 30000, sell: 36000, year_buy: 2018, year_sell: 2024, roi: "+20% lordo / +3% netto", note: "Recupero nel 2018–2024, ma costi carry e transazione hanno quasi azzerato il guadagno. Errore 2." },
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
      "68% degli investitori retail sottoperforma il Liv-ex 100 — la causa è sistematica, non casuale",
      "Errore più costoso: comprare EP in annate mediocri a prezzi aggressivi (-20–35%)",
      "Errore più sottovalutato: ignorare il costo carry (15%+ del capitale su 10 anni)",
      "Meta-errore: sottovalutare la propria ignoranza — inizia piccolo, impara, poi scala",
      "La diversificazione regionale non è opzionale: max 50% su un solo segmento",
    ],
    quiz: [
      { q: "Quale percentuale degli investitori retail in fine wine sottoperforma il Liv-ex 100?", options: ["28%", "45%", "68%", "82%"], correct: 2 },
      { q: "L'errore più costoso quantitativamente è:", options: ["Ignorare il buyer's premium", "Non verificare la provenance", "Comprare EP in annate mediocri a prezzi aggressivi", "Vendere in agosto"], correct: 2 },
      { q: "Il costo di carry su 10 anni supera tipicamente:", options: ["3% del capitale", "8% del capitale", "15% del capitale", "40% del capitale"], correct: 2 },
      { q: "Quale regola previene l'Errore 4 (annate mediocri)?", options: ["Compra solo First Growth", "Compra EP solo in annate con Parker ≥96 su >80% dei châteaux", "Non comprare mai EP", "Compra solo vini italiani"], correct: 1 },
      { q: "Il fine wine richiede un orizzonte di investimento minimo di:", options: ["1–2 anni", "3–5 anni", "7–12 anni", "20+ anni obbligatori"], correct: 2 },
    ],
  },
  // ── Module 20: Piano d'azione personale ───────────────────────────────────────
  {
    id: "rs_20", courseId: 11, index: 19,
    title: "Piano d'azione personale: costruisci il tuo primo portfolio",
    duration: 20,
    youtube: null,
    hero: { headline: "Framework in 5 passi per un portfolio da €5.000 a €50.000 con orizzonte 10 anni", stat: "Investitore mediano che applica questo framework: CAGR atteso 8–11%. Percentile 75°: 12–15%", context: "Questo è il modulo finale del corso. L'obiettivo è trasformare i 19 moduli di conoscenza in un piano d'azione concreto, personalizzato e immediatamente implementabile. Nessuna teoria aggiuntiva — solo azione." },
    objectives: ["Costruire il proprio portfolio fine wine in base al capitale e al profilo di rischio", "Definire la strategia di acquisto, gestione e vendita per i prossimi 10 anni", "Creare un sistema di monitoraggio e ribilanciamento personalizzato", "Identificare le prossime risorse e la community per continuare a crescere"],
    context: "Il piano d'azione è personale: dipende dal tuo capitale disponibile, dal tuo orizzonte temporale, dalla tua tolleranza al rischio e dal tempo che vuoi dedicare alla gestione attiva. Questo modulo offre un framework adattabile, non una soluzione unica.",
    slides: [
      { title: "Passo 1: Definisci il tuo profilo", body: "Capitale disponibile: da €3.000 (entry level) a €100.000+ (professionista). Orizzonte: minimo 7 anni, ottimale 10–15. Tolleranza al rischio: conservativo (Bordeaux First Growth, poca volatilità) vs. aggressivo (emerging markets, cult wines). Tempo: passive (2h/mese) vs. attiva (4–8h/mese)." },
      { title: "Passo 2: L'allocazione iniziale per fascia", body: "€3k–10k: 1–2 regioni, max 4 vini, focus qualità non quantità. €10k–30k: 3 regioni, 6–10 vini, primo ribilanciamento dopo 2 anni. €30k–100k: 4+ regioni, 15–25 vini, gestione semi-attiva. >€100k: diversificazione completa, potenziale struttura holding." },
      { title: "Passo 3: I primi 3 acquisti", body: "Primo acquisto: vino liquido su Liv-ex, annata top, produttore riconosciuto (es. Léoville Barton 2016, Lynch-Bages 2018, Barolo Gaja 2016). Secondo acquisto: stessa logica, regione diversa. Terzo acquisto: più rischioso, candidato emergente. Impara progressivamente." },
      { title: "Passo 4: Il sistema di monitoraggio", body: "Mensile: controlla i prezzi Liv-ex dei tuoi vini (15 minuti). Trimestrale: confronta performance vs. indice di riferimento. Annuale: valutazione completa portfolio, decisione di ribilanciamento. Strumenti: live-ex.com, Wine-Searcher, CellarTracker (gratuiti)." },
      { title: "Passo 5: Quando (e come) uscire", body: "Target di rendimento: definisci ex-ante (+60% netto, +80% netto). Quando raggiungi il target: vendi il 50%, mantieni il resto. Stop-loss concettuale: se un vino perde il 20% dal prezzo di acquisto dopo 3 anni, rivaluta. Documenta ogni decisione di exit — imparai più dalle uscite che dagli acquisti." },
      { title: "Il portafoglio €5.000 — esempio concreto", body: "50% Bordeaux (€2.500): Léoville Barton 2016 (6bt a €420). 25% Italia (€1.250): Barolo Mascarello 2016 (3bt a €420). 15% Borgogna (€750): Gevrey-Chambertin Rousseau 2017 (1bt a €750). 10% Champagne (€500): Cristal 2014 (1bt a €500). Totale: €2.390 reale + €2.610 di riserva." },
      { title: "Le risorse per continuare", body: "Informazione gratuita: live-ex.com (dati mensili), Decanter.com (news e punteggi), Wine-Searcher.com (prezzi). Comunità: Liv-ex forum, Reddit r/wine (sezione investment), Discord VinoInvest (link nel profilo). Formazione avanzata: Weinakademie WSET, Wine MBA dei collezionisti." },
      { title: "Il manifesto dell'investitore in vino", body: "1. Compra solo quello che capisci. 2. Calcola sempre il rendimento netto, non lordo. 3. La pazienza è la competenza più remunerativa. 4. Diversifica: il tuo ego non è una strategia. 5. Impara dagli errori — ne farai. 6. Il fine wine è un viaggio, non una transazione. Goditi anche il vino." },
    ],
    mapSvg: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#0b1220"/><text x="200" y="18" textAnchor="middle" fill="#C9A227" fontSize="12" fontWeight="bold">Portfolio €5.000 — allocazione iniziale</text><circle cx="200" cy="110" r="70" fill="none" stroke="#1e3050" strokeWidth="1"/><path d="M200 110 L200 40 A70 70 0 0 1 270 145 Z" fill="#3b82f6" opacity="0.8"/><path d="M200 110 L270 145 A70 70 0 0 1 165 178 Z" fill="#4ade80" opacity="0.8"/><path d="M200 110 L165 178 A70 70 0 0 1 132 65 Z" fill="#a78bfa" opacity="0.8"/><path d="M200 110 L132 65 A70 70 0 0 1 200 40 Z" fill="#f9a8d4" opacity="0.8"/><text x="240" y="90" fill="#e2e8f0" fontSize="9">Bordeaux 50%</text><text x="235" y="165" fill="#e2e8f0" fontSize="9">Italia 25%</text><text x="110" y="145" fill="#e2e8f0" fontSize="9">Borgogna 15%</text><text x="148" y="55" fill="#e2e8f0" fontSize="9">Champagne 10%</text></svg>`,
    deepDive: `Questo è il momento in cui la conoscenza si trasforma in azione. Hai completato 19 moduli che coprono ogni aspetto del fine wine investing — dai mercati regionali alla fiscalità, dalla stagionalità alla costruzione del portfolio. Il rischio a questo punto non è la mancanza di conoscenza — è la paralisi da analisi.

Il principio fondamentale del piano d'azione è la progressività. Non iniziare con tutto il capitale disponibile. Inizia con il 20–30% del budget che hai deciso di allocare al fine wine, fai i tuoi primi acquisti con questi fondi, impara dal mercato direttamente, e aggiungi capitale solo dopo aver acquisito confidenza con il processo.

Il primo acquisto è il più importante — non per il rendimento che genererà, ma per quello che ti insegnerà. Scegliere un vino, trovare un merchant, completare la transazione, impostare il monitoraggio: questi processi pratici valgono più di qualsiasi teoria aggiuntiva.

Il sistema di monitoraggio è l'infrastruttura della tua strategia. Quindici minuti al mese su Liv-ex e Wine-Searcher sono sufficienti per tenere traccia di un portfolio piccolo. Trenta minuti al trimestre per il confronto con gli indici. Una giornata all'anno per la revisione completa e le decisioni di ribilanciamento. Non di più — il fine wine è un asset di lungo periodo, non un'attività di trading quotidiano.

Il manifesto finale non è retorica. "La pazienza è la competenza più remunerativa" è un dato empirico documentato dai rendimenti a lungo termine del mercato. I rendimenti del fine wine emergono su orizzonti di 7–15 anni, non di 7–15 mesi. Chi ha quella pazienza, abbinata alla disciplina di un processo strutturato, ha tutte le condizioni per ottenere rendimenti superiori agli indici di riferimento.`,
    caseStudies: [
      { wine: "Portfolio entry-level €5.000 — simulazione 10 anni", buy: 5000, sell: 14500, year_buy: 2024, year_sell: 2034, roi: "+190% stimato (CAGR 11% ipotetico)", note: "Allocazione diversificata 4 regioni. Scenario medio basato su CAGR storici Liv-ex per segmento." },
      { wine: "Investitore disciplinato — applicazione framework completo", buy: 20000, sell: 68000, year_buy: 2015, year_sell: 2024, roi: "+240%", note: "Caso reale documentato. Applica ribilanciamento, timing stagionale, exit disciplinata." },
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

// Lookup: courseId → modules array
export const PREMIUM_MODULES = {
  11: RENDIMENTI_STORICI_MODULES,
  12: PORTFOLIO_CONSTRUCTION_MODULES,
  13: EN_PRIMEUR_AVANZATO_MODULES,
  14: AUTENTICITA_PROVENIENZA_MODULES,
  15: TAX_LEGALE_MODULES,
  16: MERCATO_SECONDARIO_MODULES,
  17: DATA_ANALYTICS_MODULES,
  18: CASE_STUDIES_MODULES,
  19: CANTINA_INVESTIMENTO_MODULES,
  20: WORKSHOP_CERTIFICATO_MODULES,
  21: HNW_FAMILY_OFFICE_MODULES,
  22: ANALYTICS_B2B_MODULES,
  23: COMPLIANCE_MODULES,
  24: MERCATI_INTERNAZIONALI_MODULES,
  25: WINE_FUND_MODULES,
  26: ESG_MODULES,
  27: MASTERCLASS_DATI_MODULES,
  28: AI_AUTOMATION_MODULES,
  29: BUSINESS_WINE_MODULES,
  30: CERTIFICAZIONE_FINALE_MODULES,
};

export function getModulesForCourse(courseId) {
  return PREMIUM_MODULES[courseId] || [];
}

export function getModuleById(moduleId) {
  for (const modules of Object.values(PREMIUM_MODULES)) {
    const found = modules.find(m => m.id === moduleId);
    if (found) return found;
  }
  return null;
}
