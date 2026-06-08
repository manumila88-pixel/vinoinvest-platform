// Premium Academy course content — 20 sequential modules per course
// Each module unlocks only after 70% quiz pass on the previous one.
export { ADMIN_EMAIL, QUIZ_PASS_THRESHOLD } from "../lib/constants";

// ── Course 11: Rendimenti Storici ─────────────────────────────────────────────
export const RENDIMENTI_STORICI_MODULES = [
  {
    id: "rs_01",
    courseId: 11,
    index: 0,
    title: "Introduzione ai rendimenti storici del vino",
    duration: 14,
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ", // placeholder
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
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
];

// Template for other premium courses — same 20-module structure
export function buildPremiumCourse(courseId, courseTitle, modules20) {
  return modules20.map((m, i) => ({
    id: `c${courseId}_${String(i + 1).padStart(2, "0")}`,
    courseId,
    index: i,
    title: m.title,
    duration: m.duration || 14,
    youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
