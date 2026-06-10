/**
 * VinoInvest Wine Knowledge Base
 * Structured FAQ used as context for AI responses and /api/faq endpoint.
 */

export const FAQ = [
  // ── INVESTIMENTO ──────────────────────────────────────────────────────────
  {
    id: "inv-001",
    category: "investimento",
    persona: ["principiante", "intermedio"],
    q: "Perché investire nel vino?",
    a: "Il vino pregiato ha reso mediamente l'8-12% annuo negli ultimi 30 anni (Liv-ex Fine Wine 100). È un asset fisico, scarso per definizione, con bassa correlazione con i mercati azionari (beta ~0.2). Le bottiglie si consumano, riducendo l'offerta nel tempo.",
    tags: ["rendimenti", "asset class", "correlazione"],
  },
  {
    id: "inv-002",
    category: "investimento",
    persona: ["principiante"],
    q: "Quanto serve per iniziare?",
    a: "Il budget minimo consigliato è €2.000-5.000. Con meno di €2.000 la diversificazione è limitata. L'ideale per un portfolio bilanciato è €10.000-50.000 su 10-20 vini diversi.",
    tags: ["budget", "principiante", "diversificazione"],
  },
  {
    id: "inv-003",
    category: "investimento",
    persona: ["intermedio", "esperto"],
    q: "Qual è l'orizzonte temporale ideale?",
    a: "5-10 anni per vini di fascia media (€50-300/bottiglia). Per grandi vini (Pétrus, DRC) anche 15-20 anni. Mai meno di 3 anni: il mercato ha bisogno di tempo per riconoscere il valore.",
    tags: ["orizzonte", "timing", "hold"],
  },
  {
    id: "inv-004",
    category: "investimento",
    persona: ["intermedio"],
    q: "Come si calcola il ROI nel vino?",
    a: "ROI = (Prezzo vendita - Prezzo acquisto - Costi) / Prezzo acquisto × 100. I costi includono: assicurazione (~0.5%/anno), stoccaggio (€5-15/cassa/anno), commissioni asta (15-25%). Un ROI del 15-20% su 5 anni è considerato buono.",
    tags: ["ROI", "calcolo", "costi"],
  },
  {
    id: "inv-005",
    category: "investimento",
    persona: ["principiante", "intermedio"],
    q: "Quali vini hanno il miglior potenziale di investimento?",
    a: "I pilastri dell'investimento in vino: Bordeaux (Lafite, Pétrus, Margaux), Borgogna (DRC, Rousseau, Leroy), Super Tuscans (Sassicaia, Masseto, Ornellaia), Barolo/Barbaresco (Giacomo Conterno, Bruno Giacosa), Champagne di lusso (Krug, Cristal, Dom Pérignon).",
    tags: ["regioni", "produttori", "top wines"],
  },
  {
    id: "inv-006",
    category: "investimento",
    persona: ["esperto"],
    q: "Come costruire un portfolio vino ben diversificato?",
    a: "Regola 40/30/20/10: 40% grandi vini liquidi (Bordeaux, Borgogna), 30% vini emergenti ad alto potenziale (Barolo, Super Tuscans), 20% vini rari a bassa liquidità (DRC, Pétrus), 10% vini speculativi/en primeur. Diversifica per regione, annata, fascia di prezzo.",
    tags: ["diversificazione", "portfolio", "allocation"],
  },
  {
    id: "inv-007",
    category: "investimento",
    persona: ["intermedio"],
    q: "Quando è il momento giusto per vendere?",
    a: "Vendi quando: (1) hai raggiunto ROI 15-20%+, (2) il vino si avvicina alla finestra di bevibilità ottimale, (3) il mercato è ai massimi storici per quella regione/annata. Non vendere in crisi di mercato: il vino fine ha dimostrato resilienza nei bear market.",
    tags: ["vendita", "timing", "exit"],
  },
  {
    id: "inv-008",
    category: "investimento",
    persona: ["esperto"],
    q: "Vino vs S&P500: quale rende di più?",
    a: "S&P500 rende ~10-11%/anno (storico 20 anni). Il Liv-ex Fine Wine 100 rende ~8-12%/anno. La differenza: il vino ha beta ~0.2 (molto meno volatile), non paga dividendi ma beneficia di scarsità fisica. Ideale come diversificatore (10-20% del portfolio totale), non sostituto delle azioni.",
    tags: ["S&P500", "confronto", "asset allocation"],
  },

  // ── MERCATO ───────────────────────────────────────────────────────────────
  {
    id: "mkt-001",
    category: "mercato",
    persona: ["principiante", "intermedio", "esperto"],
    q: "Come funziona il mercato del vino fine?",
    a: "Il mercato si basa su domanda/offerta di bottiglie fisiche. Il principale indice è il Liv-ex Fine Wine 100 (100 vini più scambiati). I principali canali: case d'asta (Sotheby's, Christie's), piattaforme online (Wine-Searcher, Idealwine), merchant specializzati.",
    tags: ["mercato", "Liv-ex", "aste"],
  },
  {
    id: "mkt-002",
    category: "mercato",
    persona: ["intermedio"],
    q: "Quali regioni stanno crescendo nel 2025-2026?",
    a: "Crescita forte: Borgogna (+15% YoY, domanda asiatica), Barolo/Barbaresco (valutazioni ancora ragionevoli), Super Tuscans (Masseto, Ornellaia). Stabile: Champagne di lusso. In correzione: Bordeaux classico (-5-10% dal picco 2022), occasioni su annate secondarie.",
    tags: ["trend", "regioni", "2026"],
  },
  {
    id: "mkt-003",
    category: "mercato",
    persona: ["esperto"],
    q: "Cos'è il Liv-ex Fine Wine 100?",
    a: "Il Liv-ex Fine Wine 100 è il principale indice di riferimento per il mercato del vino fine. Misura le variazioni di prezzo delle 100 bottiglie più scambiate globalmente. Usato come benchmark, simile all'S&P500 per le azioni. Consulta live su liv-ex.com.",
    tags: ["Liv-ex", "indice", "benchmark"],
  },
  {
    id: "mkt-004",
    category: "mercato",
    persona: ["principiante", "intermedio"],
    q: "Il vino è una buona protezione dall'inflazione?",
    a: "Sì. I grandi vini hanno storicamente superato l'inflazione. In periodi di alta inflazione (2021-2022), il Liv-ex ha registrato +25% in 12 mesi. Come asset fisico scarso, il vino tende a rivalutarsi con la svalutazione monetaria.",
    tags: ["inflazione", "protezione", "asset reale"],
  },
  {
    id: "mkt-005",
    category: "mercato",
    persona: ["esperto"],
    q: "Come influisce la Cina sul mercato del vino?",
    a: "La Cina è il principale driver della domanda globale per Bordeaux e Borgogna. Quando la domanda cinese cala (come nel 2023-2024), i prezzi Bordeaux correggono. La diversificazione verso mercati emergenti (India, Brasile) sta compensando parzialmente.",
    tags: ["Cina", "domanda", "geopolitica"],
  },

  // ── EDUCATIVO ─────────────────────────────────────────────────────────────
  {
    id: "edu-001",
    category: "educativo",
    persona: ["principiante"],
    q: "Cos'è l'en primeur?",
    a: "L'en primeur (o futures) è l'acquisto di vini prima dell'imbottigliamento, quando sono ancora in botte. Tipico di Bordeaux. Si acquista ad aprile/maggio dell'anno successivo alla vendemmia, con consegna 18-24 mesi dopo. Vantaggi: prezzo spesso inferiore al mercato, accesso ad allocazioni rare.",
    tags: ["en primeur", "futures", "Bordeaux"],
  },
  {
    id: "edu-002",
    category: "educativo",
    persona: ["principiante"],
    q: "Cos'è la provenance di un vino?",
    a: "La provenance (provenienza) è la storia di custodia di una bottiglia: chi l'ha acquistata, dove è stata conservata, quante volte è cambiata di mano. Una provenance documentata (bottiglia diretta da château o cantina certificata) garantisce autenticità e valore. Fondamentale per vini di alto valore.",
    tags: ["provenance", "autenticità", "custodia"],
  },
  {
    id: "edu-003",
    category: "educativo",
    persona: ["principiante", "intermedio"],
    q: "Come si legge il punteggio Parker/Wine Spectator?",
    a: "Scala 100 punti: 96-100 = classico/eccezionale, 90-95 = eccellente, 85-89 = molto buono, 80-84 = buono. Per investimento, punta su vini con 95+. Il Parker Point ha un effetto diretto sul prezzo: +1 punto sopra 95 può valere +5-10% sul mercato.",
    tags: ["Parker", "Wine Spectator", "punteggi"],
  },
  {
    id: "edu-004",
    category: "educativo",
    persona: ["intermedio"],
    q: "Cosa sono i Premier Cru e Grand Cru di Borgogna?",
    a: "In Borgogna, la classificazione è del vigneto (climat), non del produttore. Grand Cru = massima qualità (~33 vigneti in tutta la Borgogna). Premier Cru = eccellente (~640 vigneti). Village = buono. Questo sistema spiega perché lo stesso vigneto Chambertin vale 10x un Village.",
    tags: ["Borgogna", "Grand Cru", "Premier Cru", "classificazione"],
  },
  {
    id: "edu-005",
    category: "educativo",
    persona: ["principiante"],
    q: "Qual è la classificazione del 1855 di Bordeaux?",
    a: "Creata per l'Esposizione Universale di Parigi del 1855. Classifica i Châteaux del Médoc in 5 crus: Premier Cru (Lafite, Latour, Margaux, Mouton, Haut-Brion), Deuxième Cru, etc. Quasi invariata da 170 anni. Il Médoc ha anche Cru Bourgeois (livello inferiore, ottimo rapporto qualità/prezzo).",
    tags: ["Bordeaux", "classificazione 1855", "Premier Grand Cru"],
  },
  {
    id: "edu-006",
    category: "educativo",
    persona: ["intermedio", "esperto"],
    q: "Come funziona la fiscalità del vino in Italia?",
    a: "In Italia, le plusvalenze da vendita di oggetti d'arte e di collezionismo (incluso il vino) possono essere soggette all'Art. 67 TUIR come redditi diversi, con aliquota IRPEF ordinaria. Tuttavia, la pratica fiscale reale è complessa e dipende dalla frequenza e sistematicità delle operazioni. Consulta un commercialista specializzato prima di operazioni significative.",
    tags: ["fiscalità", "TUIR", "Art. 67", "plusvalenze"],
  },
  {
    id: "edu-007",
    category: "educativo",
    persona: ["principiante"],
    q: "Cosa significa 'finestra di bevibilità'?",
    a: "La finestra di bevibilità (drinking window) è il periodo ottimale per bere un vino, dopo sufficiente invecchiamento. Per un Barolo 2016: 2024-2040. Per un Bordeaux di punta: 2015-2045+. Vini fuori finestra (troppo giovani o troppo vecchi) perdono valore e qualità. L'AI Score VinoInvest include questa analisi.",
    tags: ["bevibilità", "aging", "drinking window"],
  },
  {
    id: "edu-008",
    category: "educativo",
    persona: ["intermedio"],
    q: "Cos'è un Super Tuscan?",
    a: "I Super Tuscans sono vini toscani di alta qualità prodotti fuori dal disciplinare DOC tradizionale (spesso usano Cabernet Sauvignon o Merlot, non ammessi nel Chianti Classico). I più famosi: Sassicaia, Ornellaia, Masseto, Tignanello. Categorie legali: IGT Toscana o Bolgheri.",
    tags: ["Super Tuscan", "Toscana", "Sassicaia", "IGT"],
  },

  // ── PORTFOLIO ─────────────────────────────────────────────────────────────
  {
    id: "prt-001",
    category: "portfolio",
    persona: ["principiante", "intermedio"],
    q: "Come analizzo il mio portfolio vino?",
    a: "Metriche chiave: (1) ROI totale e per singolo vino, (2) Score di diversificazione (regioni, annate, fasce di prezzo), (3) Liquidità stimata (quanto velocemente puoi vendere), (4) Vintage exposure (non concentrare su una sola annata). VinoInvest calcola queste metriche automaticamente.",
    tags: ["analisi portfolio", "metriche", "diversificazione"],
  },
  {
    id: "prt-002",
    category: "portfolio",
    persona: ["intermedio"],
    q: "Come ribilancio il portfolio?",
    a: "Ribilancia quando: (1) una posizione supera il 20-25% del totale, (2) troppa concentrazione su una regione/annata, (3) cambiano le prospettive di mercato per una regione. Vendi i top performer e reinvesti in vini a maggiore potenziale.",
    tags: ["rebalancing", "ribilancio", "gestione"],
  },
  {
    id: "prt-003",
    category: "portfolio",
    persona: ["esperto"],
    q: "Qual è il numero ottimale di vini in portfolio?",
    a: "10-20 vini per un portfolio ben diversificato. Meno di 5: troppo concentrato. Più di 30: difficile da gestire. Inizia con 5-8 posizioni di qualità e aggiungi gradualmente. Meglio poche bottiglie di qualità che molte di media qualità.",
    tags: ["numero posizioni", "portfolio size", "gestione"],
  },

  // ── PRATICO ───────────────────────────────────────────────────────────────
  {
    id: "pra-001",
    category: "pratico",
    persona: ["principiante", "intermedio"],
    q: "Come si conserva correttamente il vino da investimento?",
    a: "Condizioni ottimali: Temperatura 12-14°C costante, umidità 70-80%, assenza di luce UV, zero vibrazioni, posizione orizzontale. Opzioni: cantina professionale (Octavian UK, Cru Classé FR, €5-15/cassa/anno), armadio climatizzato (da €800), cantina privata con controllo temperatura.",
    tags: ["conservazione", "temperatura", "stoccaggio"],
  },
  {
    id: "pra-002",
    category: "pratico",
    persona: ["principiante"],
    q: "Dove comprare vino da investimento?",
    a: "Fonti raccomandate: (1) Merchant specializzati: Berry Bros & Rudd (UK), Farr Vintners (UK), Serena Wines (IT). (2) Aste: Sotheby's Wine, Christie's, Acker, Hart Davis Hart. (3) Online: Wine-Searcher (confronta prezzi globali), Idealwine (ottime aste online). (4) En primeur: direttamente da château o merchant accreditati.",
    tags: ["dove comprare", "merchant", "aste"],
  },
  {
    id: "pra-003",
    category: "pratico",
    persona: ["intermedio", "esperto"],
    q: "Come verifico l'autenticità di una bottiglia?",
    a: "Metodi: (1) Etichetta: confronta con foto certificate (WineSearcher ha archivi foto), (2) Capsula: i grandi châteaux usano capsule specifiche per annata, (3) Livello del vino: livello basso = possibile deterioramento o manomissione, (4) Provenance documentata: richiedi sempre la catena di custodia, (5) Servizi certificati: Vinfolio (USA), Farr Vintners (UK).",
    tags: ["autenticità", "certificazione", "falsi"],
  },
  {
    id: "pra-004",
    category: "pratico",
    persona: ["principiante"],
    q: "Come vendo il vino che ho acquistato?",
    a: "Canali di vendita: (1) Case d'asta: Sotheby's, Christie's (commissioni 15-25%), (2) Merchant buy-back: alcuni merchant ricomprano vini della loro lista, (3) Piattaforme peer-to-peer: Idealwine, WineBid, (4) Privato: tra collezionisti. Tempi medi: aste 2-4 settimane, merchant 1-2 settimane.",
    tags: ["vendita", "aste", "exit"],
  },
  {
    id: "pra-005",
    category: "pratico",
    persona: ["intermedio"],
    q: "Quanto costano le assicurazioni per il vino?",
    a: "L'assicurazione di una cantina privata costa circa 0.3-0.8% del valore assicurato all'anno. Per collezioni >€50.000, si usano polizze specializzate (Chubb, AXA Art). Le cantine professionali includono generalmente l'assicurazione nel costo di stoccaggio.",
    tags: ["assicurazione", "costi", "protezione"],
  },

  // ── CONFRONTO ─────────────────────────────────────────────────────────────
  {
    id: "cfr-001",
    category: "confronto",
    persona: ["intermedio"],
    q: "Barolo vs Bordeaux: quale scelgo per investire?",
    a: "Bordeaux: alta liquidità, mercato globale profondo, prezzi più stabili, ma già prezzato. Barolo: crescita rapida (+20-30% ultimi 5 anni), meno liquido, mercato più piccolo ma in espansione, ancora sottovalutato vs. qualità. Per principianti: Bordeaux. Per chi cerca alpha: Barolo.",
    tags: ["Barolo", "Bordeaux", "confronto regioni"],
  },
  {
    id: "cfr-002",
    category: "confronto",
    persona: ["esperto"],
    q: "Borgogna vs Bordeaux: differenze d'investimento?",
    a: "Borgogna: scarsità estrema (DRC produce 6.000 bottiglie/anno), volatilità alta, rendimenti massimi (DRC Romanée-Conti +500% in 10 anni). Bordeaux: produzione maggiore, liquidità superiore, più prevedibile. Borgogna richiede accesso privilegiato alle allocazioni. Ideal per portfolio >€100k.",
    tags: ["Borgogna", "Bordeaux", "liquidità", "scarsità"],
  },
  {
    id: "cfr-003",
    category: "confronto",
    persona: ["intermedio"],
    q: "Champagne vs vino fermo come investimento?",
    a: "Champagne di lusso (Krug, Cristal, Dom Pérignon Œnothèque) ha avuto un rally eccezionale nel 2021-2022 (+40%), ora in fase di consolidamento. Vino fermo (Bordeaux, Borgogna) ha storia più lunga e profonda. Lo Champagne ha shelf life limitata (decenni, non secoli) rispetto ai grandi rossi.",
    tags: ["Champagne", "confronto", "spumante"],
  },

  // ── RICERCA ───────────────────────────────────────────────────────────────
  {
    id: "ric-001",
    category: "ricerca",
    persona: ["principiante"],
    q: "Quali sono le migliori annate Barolo?",
    a: "Annate eccezionali: 2016 (decade vintage), 2013, 2010, 1996, 1989. Molto buone: 2019, 2015, 2001. Da evitare per investimento: 2002, 2004, 2014 (annate difficili). Il 2016 è considerato il migliore degli ultimi 20 anni, con potenziale di invecchiamento 30-40 anni.",
    tags: ["Barolo", "annate", "vintage"],
  },
  {
    id: "ric-002",
    category: "ricerca",
    persona: ["intermedio"],
    q: "Quali sono le migliori annate Bordeaux?",
    a: "Annate eccezionali: 2005, 2009, 2010, 2016, 2019 (per Right Bank). 2000 e 1982 storiche. Per rapporto qualità/prezzo: 2012, 2014, 2017. Left Bank (Médoc): annate calde. Right Bank (Pomerol/St-Émilion): preferisce anni freschi.",
    tags: ["Bordeaux", "annate", "Left Bank", "Right Bank"],
  },
  {
    id: "ric-003",
    category: "ricerca",
    persona: ["principiante", "intermedio"],
    q: "Migliori Barolo sotto €200?",
    a: "Ottimi sotto €200: Massolino Serralunga d'Alba, Podere Rocche dei Manzoni, Vietti Castiglione, Luigi Einaudi Barolo, Paolo Scavino. Tra €100-150 offrono qualità/prezzo eccellente. Sali sopra €200 per vini da singolo vigneto (MGA) dei produttori top.",
    tags: ["Barolo", "budget", "raccomandazioni"],
  },
  {
    id: "ric-004",
    category: "ricerca",
    persona: ["intermedio"],
    q: "Quali Super Tuscans hanno il miglior potenziale?",
    a: "Top per investimento: Sassicaia (la più liquida e riconosciuta), Masseto (il Pomerol italiano, prezzi in forte crescita), Ornellaia (ottimo rapporto), Solaia (Antinori flagship). Emergenti: Guado al Tasso, Messorio. Attenzione: i prezzi di Masseto si sono quintuplicati in 10 anni.",
    tags: ["Super Tuscan", "Sassicaia", "Masseto", "investimento"],
  },

  // ── NOTIZIE ───────────────────────────────────────────────────────────────
  {
    id: "new-001",
    category: "notizie",
    persona: ["intermedio", "esperto"],
    q: "Dove trovo notizie affidabili sul mercato del vino?",
    a: "Fonti affidabili: Decanter (decanter.com) per news generali, Jancis Robinson (jancisrobinson.com) per critica e mercato, Liv-ex Blog (liv-ex.com/news) per dati di mercato, Wine Spectator (winespectator.com) per USA market, Vinous (vinous.com) per rating e analisi.",
    tags: ["notizie", "fonti", "media"],
  },
  {
    id: "new-002",
    category: "notizie",
    persona: ["esperto"],
    q: "Come funziona la stagione delle aste?",
    a: "Il calendario delle aste ha due picchi principali: Novembre (Sotheby's, Christie's London — lotti autunnali) e Aprile-Maggio (aste primaverili). Acker e Hart Davis Hart (USA) operano tutto l'anno con aste online mensili. I prezzi di aggiudicazione sono pubblici e consultabili su Wine-Searcher.",
    tags: ["aste", "calendario", "Sotheby's"],
  },

  // ── EN PRIMEUR ─────────────────────────────────────────────────────────────
  {
    id: "enp-001",
    category: "enprimeur",
    persona: ["intermedio"],
    q: "Come partecipo all'en primeur?",
    a: "L'en primeur si acquista attraverso merchant accreditati (Berry Bros, Farr Vintners, Justerini & Brooks in UK; Enoteca Bisson, Tannico in Italia). Il prezzo viene fissato dal Château, il merchant prende un margine 10-15%. Si paga subito, si riceve in bottiglia 18-24 mesi dopo.",
    tags: ["en primeur", "come partecipare", "merchant"],
  },
  {
    id: "enp-002",
    category: "enprimeur",
    persona: ["esperto"],
    q: "Come valuto se un en primeur è conveniente?",
    a: "Confronta il prezzo en primeur con il prezzo storico delle annate precedenti di qualità simile. Regola empirica: se l'en primeur è prezzato allo stesso livello o superiore al mercato secondario, non conviene. Annate sottovalutate dai critici possono essere ottime opportunità (spesso corrette al rialzo dopo imbottigliamento).",
    tags: ["en primeur", "valutazione", "convenienza"],
  },

  // ── SICUREZZA E RISCHI ────────────────────────────────────────────────────
  {
    id: "rsk-001",
    category: "investimento",
    persona: ["principiante"],
    q: "Quali sono i rischi dell'investimento nel vino?",
    a: "Rischi principali: (1) Illiquidità: non puoi vendere immediatamente come le azioni, (2) Autenticità: mercato dei falsi stimato 5-7% delle bottiglie, (3) Conservazione: un vino mal conservato perde tutto il valore, (4) Gusto del mercato: i trend cambiano, (5) Annate: un'annata deludente può far calare i prezzi. Mitigazione: diversifica, usa cantina professionale, compra solo da fonti certificate.",
    tags: ["rischi", "liquidità", "falsi"],
  },
  {
    id: "rsk-002",
    category: "investimento",
    persona: ["intermedio"],
    q: "Il vino è un investimento regolamentato in Italia?",
    a: "No. Il vino come asset non è regolamentato dalla Consob o dalla Banca d'Italia come i titoli finanziari. Non esistono fondi comuni d'investimento in vino riconosciuti in Italia. È trattato come bene mobile di collezionismo. Questo significa nessuna tutela normativa specifica per l'investitore.",
    tags: ["regolamentazione", "Consob", "tutele"],
  },

  // ── PIATTAFORMA VINOINVEST ─────────────────────────────────────────────────
  {
    id: "vi-001",
    category: "piattaforma",
    persona: ["principiante"],
    q: "Cos'è l'AI Score di VinoInvest?",
    a: "L'AI Score (0-100) è un punteggio composito che valuta: punteggio critico (Parker, WS), andamento storico prezzi, scarsità della produzione, annata climate score (dati Open-Meteo), trend domanda/offerta, liquidità sul mercato secondario. Sopra 85 = eccellente potenziale d'investimento.",
    tags: ["AI Score", "VinoInvest", "punteggio"],
  },
  {
    id: "vi-002",
    category: "piattaforma",
    persona: ["principiante"],
    q: "Come aggiungo vini al portfolio su VinoInvest?",
    a: "Vai su Mercato, cerca il vino, clicca la card per aprire il dettaglio, poi 'Aggiungi al Portfolio'. Inserisci prezzo d'acquisto e quantità. Il sistema monitora automaticamente il valore corrente e calcola ROI, diversificazione e suggerimenti.",
    tags: ["portfolio", "come usare", "guida"],
  },
  {
    id: "vi-003",
    category: "piattaforma",
    persona: ["intermedio"],
    q: "Come funziona lo Scanner Etichetta di VinoInvest?",
    a: "Lo Scanner usa Claude Vision AI per riconoscere il vino dalla foto dell'etichetta. Punta la fotocamera, scatta, e l'AI identifica il vino nel database e mostra: prezzo corrente, AI Score, storia prezzi, note degustazione community, premi e riconoscimenti.",
    tags: ["scanner", "label scan", "camera"],
  },
];

  // ── INVESTIMENTO AVANZATO ─────────────────────────────────────────────────
  {
    id: "inv-009",
    category: "investimento",
    persona: ["esperto"],
    q: "Quale impatto ha il climate change sull'investimento in vino?",
    a: "Il climate change sposta le zone climatiche ottimali verso nord: la Borgogna soffre calori estremi, mentre Inghilterra e Danimarca emergono per spumanti. Rischio geografico reale: vigneti a bassa altitudine in Rhône e Languedoc. Opportunità: regioni più fresche (Oregon, Alto Adige, Champagne) e produttori con vigne vecchie (radici profonde, più resistenti).",
    tags: ["climate change", "rischio", "geografia", "cambiamento climatico"],
  },
  {
    id: "inv-010",
    category: "investimento",
    persona: ["intermedio", "esperto"],
    q: "Cosa è il 'Parker effect' e come impatta i prezzi?",
    a: "Robert Parker ha inventato la critica moderna del vino con la scala 100 punti. Una valutazione di 100/100 può far raddoppiare il prezzo in settimane. Dopo il ritiro di Parker nel 2019, il mercato si è frammentato: oggi influenzano i prezzi anche James Suckling, Decanter, Wine Spectator e critici social. L'effetto è però diminuito di intensità.",
    tags: ["Parker", "critica", "valutazioni", "prezzo"],
  },
  {
    id: "inv-011",
    category: "investimento",
    persona: ["principiante", "intermedio"],
    q: "È possibile investire in vino tramite un fondo?",
    a: "Sì, esistono fondi specializzati: Cult Wines (UK), WineCap, Vinovest (USA). Vantaggi: diversificazione automatica, gestione professionale, accesso ad allocazioni esclusive. Svantaggi: fee alte (1.5-3% annuo), minore controllo, illiquidità. Alternativa: piattaforme come VinoInvest dove gestisci il tuo portfolio direttamente.",
    tags: ["fondo", "Cult Wines", "WineCap", "gestione"],
  },
  {
    id: "inv-012",
    category: "investimento",
    persona: ["esperto"],
    q: "Cos'è la tokenizzazione del vino e ha senso per un investitore?",
    a: "La tokenizzazione trasforma la proprietà di una bottiglia (o cassa) in un token digitale su blockchain. Permette proprietà frazionata (comprare 1/10 di cassa) e scambio rapido. Vantaggi: liquidità migliorata, accesso con piccoli capitali. Rischi: tecnologia imatura, regolamentazione incerta, controparty risk elevato. Segui Winechain, BlockBar, Vinid.",
    tags: ["tokenizzazione", "blockchain", "NFT", "frazioni"],
  },

  // ── CONFRONTO ──────────────────────────────────────────────────────────────
  {
    id: "cfr-001",
    category: "confronto",
    persona: ["principiante", "intermedio"],
    q: "Vino vs oro: quale è meglio come riserva di valore?",
    a: "Oro: liquidità immediata, riconoscimento globale, zero costi di conservazione. Vino: rendimento storico leggermente superiore (9% vs 7%), ma illiquido e con costi storage. Oro per liquidità e sicurezza assoluta. Vino per rendimento aggiuntivo con orizzonte lungo. Ideale: usarli entrambi in portfolio (correlazione bassissima tra loro).",
    tags: ["oro", "confronto", "riserva valore", "gold"],
  },
  {
    id: "cfr-002",
    category: "confronto",
    persona: ["intermedio"],
    q: "Vino vs whisky come investimento nel 2025?",
    a: "Whisky: rendimenti più volatili ma potenzialmente altissimi (Macallan Fine & Rare +300% in 10 anni). Mercato più giovane, meno strutturato. Vino: mercato più maturo, Liv-ex come benchmark, più liquido nei top names. Whisky ha più upside speculativo, vino più stabilità. Alcuni investitori usano whisky come 'equity part' e vino come 'bond part' degli alternativi.",
    tags: ["whisky", "confronto", "Macallan", "rendimento"],
  },
  {
    id: "cfr-003",
    category: "confronto",
    persona: ["intermedio", "esperto"],
    q: "Vino vs arte come investimento?",
    a: "Arte: rendimento storico similar al vino (8-10%/anno), ma liquidità ancora più bassa, dipende dall'artista (rischio di moda), autenticità difficile da verificare. Vino: più standardizzato (denominazioni, critici), mercato globale più profondo, ma deperibile. Entrambi sono asset fisici con benefici simili come diversificatori. Molti UHNW investor detengono entrambi (Sotheby's vende wine e art).",
    tags: ["arte", "confronto", "Sotheby's", "diversificazione"],
  },
  {
    id: "cfr-004",
    category: "confronto",
    persona: ["principiante"],
    q: "Vino vs immobiliare: differenze chiave",
    a: "Immobiliare: rendita da affitto, leva finanziaria possibile, valore intrinseco del mattone. Vino: nessuna rendita, no leva, valore basato su reputazione/scarsità. Immobiliare richiede più capitale iniziale e è molto illiquido. Vino è divisibile (si vende una bottiglia alla volta). Immobiliare tassa più chiaramente (IMU). Complementari in un portfolio ampio.",
    tags: ["immobiliare", "confronto", "real estate", "capitale"],
  },

  // ── PRATICO AVANZATO ──────────────────────────────────────────────────────
  {
    id: "pra-005",
    category: "pratico",
    persona: ["principiante", "intermedio"],
    q: "Come verificare l'autenticità di una bottiglia di vino pregiato?",
    a: "Controlli fisici: livello del vino nella bottiglia (ullage normale: mezzo centimetro sotto il tappo), capsula integra, etichetta non staccata o bagnata, tappo non ammuffito quando si estrae. Provenienza documentata: fattura di acquisto, tracciabilità. Per vini >€500: considera autenticazione professionale (Berry Bros o Christie's offrono il servizio). Diffida da prezzi troppo bassi.",
    tags: ["autenticità", "verifica", "contraffazione", "bottiglia"],
  },
  {
    id: "pra-006",
    category: "pratico",
    persona: ["intermedio"],
    q: "Qual è la differenza tra acquistare da un merchant e da un'asta?",
    a: "Merchant: prezzo fisso, garanzia provenienza, meno offerte rare ma più affidabili. Aste: prezzi potenzialmente più bassi (o più alti per vini rari), buyer's premium 15-25%, rischio sulla provenienza. Regola: per vini comuni compra da merchant (più veloce, più sicuro). Per vini ultra-rari (DRC, Pétrus annate storiche) l'asta è spesso l'unico canale.",
    tags: ["merchant", "asta", "acquisto", "differenze"],
  },
  {
    id: "pra-007",
    category: "pratico",
    persona: ["principiante"],
    q: "Come faccio a usare al meglio VinoInvest?",
    a: "Workflow consigliato: (1) Usa l'AI Advisor per orientarti sul mercato e fare domande specifiche, (2) esplora il Market con filtri AI Score >80, (3) aggiungi vini al watchlist per tracciarne i prezzi, (4) usa il calcolatore per stimare i rendimenti, (5) apri il portfolio quando fai acquisti reali. Il tutorial guidato dura 10 minuti.",
    tags: ["VinoInvest", "come usare", "tutorial", "workflow"],
  },

  // ── EN PRIMEUR ────────────────────────────────────────────────────────────
  {
    id: "enp-001",
    category: "enprimeur",
    persona: ["principiante", "intermedio"],
    q: "L'en primeur è sempre conveniente?",
    a: "No. Conviene quando: (1) l'annata è eccezionale (critica unanime), (2) il prezzo release è modesto rispetto alle aspettative, (3) hai orizzonte 5+ anni. Non conviene quando: (1) i châteaux alzano il prezzo release oltre le aspettative (Bordeaux 2022 era troppo caro), (2) l'annata è sopravvalutata, (3) hai bisogno di liquidità presto.",
    tags: ["en primeur", "convenienza", "release price"],
  },
  {
    id: "enp-002",
    category: "enprimeur",
    persona: ["intermedio"],
    q: "Quali cantine offrono en primeur oltre Bordeaux?",
    a: "Oltre Bordeaux: Borgogna (pochi domaine come DRC tramite lista allocation), Barolo (alcuni produttori fanno pre-vendita ai clienti fissi), Champagne (allocazioni per vintage), Brunello di Montalcino (pre-allocazioni per la Riserva). Il sistema è meno strutturato fuori Bordeaux ma opportunità esistono.",
    tags: ["en primeur", "Borgogna", "Barolo", "Brunello"],
  },

  // ── NOTIZIE E TREND ───────────────────────────────────────────────────────
  {
    id: "nws-001",
    category: "notizie",
    persona: ["principiante", "intermedio", "esperto"],
    q: "Quali sono i trend del mercato fine wine nel 2025-2026?",
    a: "Trend 2025-2026: (1) Borgogna in forte crescita — domanda asiatica che riprende; (2) Bordeaux Premier Cru in correzione dopo i picchi 2022 — opportunità; (3) Barolo emergente come 'the new Burgundy' — valore relativo ancora interessante; (4) Champagne vintage stabile; (5) New World (Oregon, Napa cult) in crescita strutturale.",
    tags: ["trend", "2025", "2026", "mercato"],
  },
  {
    id: "nws-002",
    category: "notizie",
    persona: ["esperto"],
    q: "Come il rialzo dei tassi ha impattato il mercato del vino?",
    a: "Il rialzo dei tassi 2022-2024 ha colpito gli alternativi in generale. Il fine wine ha corretto del 10-15% dal picco 2022, soprattutto il Bordeaux ultra-premium (meno i Grand Cru di Borgogna che hanno domanda strutturale). Con la riduzione tassi 2025, ci aspettano rimbalzo nei premium. I vini conservati in bond hanno costo opportunità crescente quando i tassi salgono.",
    tags: ["tassi", "Fed", "BCE", "correzione"],
  },

  // ── RICERCA ────────────────────────────────────────────────────────────────
  {
    id: "ric-001",
    category: "ricerca",
    persona: ["principiante"],
    q: "Come cerco un vino specifico su VinoInvest?",
    a: "Usa la barra di ricerca in alto: puoi cercare per nome vino, produttore, regione o annata. I filtri avanzati nel Market permettono di filtrare per AI Score, fascia di prezzo, tipologia (rosso/bianco/spumante) e vintage. Il risultato mostra prezzo corrente, trend e AI Score per ogni vino.",
    tags: ["ricerca", "filtri", "market", "VinoInvest"],
  },
  {
    id: "ric-002",
    category: "ricerca",
    persona: ["intermedio"],
    q: "Quali sono i migliori vini italiani emergenti da comprare ora?",
    a: "Radar 2025: Vietti Barolo Castiglione (ottimo rapporto qualità-prezzo), Sandrone Barolo Aleste (ex Cannubi Boschis), La Spinetta Barbaresco Starderi, Casanova di Neri Brunello Cerretalto, Allegrini Amarone (stabile ma spesso dimenticato). Cerca queste etichette nel Market VinoInvest con AI Score >80.",
    tags: ["emergenti", "italiani", "barolo", "brunello", "2025"],
  },

/** Helper: get FAQs by category */
export function getFAQByCategory(category) {
  if (!category || category === "all") return FAQ;
  return FAQ.filter(f => f.category === category);
}

/** Helper: search FAQs by keyword */
export function searchFAQ(query) {
  const q = (query || "").toLowerCase();
  return FAQ.filter(f =>
    f.q.toLowerCase().includes(q) ||
    f.a.toLowerCase().includes(q) ||
    (f.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

/** Helper: get AI context string for a given intent */
export function getContextForIntent(intent) {
  const intentToCategory = {
    investimento: "investimento",
    budget: "investimento",
    portfolio: "portfolio",
    mercato: "mercato",
    education: "educativo",
    enprimeur: "enprimeur",
    confronto: "confronto",
    pratico: "pratico",
    news: "notizie",
    similar: "ricerca",
    region: "ricerca",
    sell: "investimento",
    opportunities: "investimento",
  };
  const cat = intentToCategory[intent] || "investimento";
  const relevant = FAQ.filter(f => f.category === cat).slice(0, 5);
  return relevant.map(f => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
}

export const CATEGORIES = [
  "investimento",
  "mercato",
  "educativo",
  "portfolio",
  "pratico",
  "confronto",
  "ricerca",
  "notizie",
  "enprimeur",
  "piattaforma",
];

export default FAQ;
