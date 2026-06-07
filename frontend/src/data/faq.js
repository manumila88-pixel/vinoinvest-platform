export const FAQ = [
  // ── Rendimenti ──────────────────────────────────────────────────────────
  {
    id: "r1", cat: "rendimenti",
    q: "Il vino è un buon investimento?",
    a: "Può esserlo per chi ha un orizzonte temporale lungo (5-10 anni), seleziona correttamente i vini e gestisce il rischio. Non garantisce rendimenti. Come ogni asset alternativo, richiede diversificazione e pazienza.",
    tags: ["investimento", "rendimento", "rischio"],
  },
  {
    id: "r2", cat: "rendimenti",
    q: "Qual è il rendimento medio del vino fine?",
    a: "Storicamente il fine wine ha reso 8-12% annuo (Liv-ex Fine Wine 100 su 30 anni), ma con alta variabilità. Alcuni vini iconici (DRC, Pétrus, Giacomo Conterno) hanno reso 20%+, altri hanno perso valore. La media nasconde dispersione enorme.",
    tags: ["rendimento", "medio", "liv-ex", "percentuale"],
  },
  {
    id: "r3", cat: "rendimenti",
    q: "Quanto tempo devo tenere un vino per guadagnare?",
    a: "Minimo 3-5 anni per vini di qualità media, 7-10 anni per i grandi cru. Il vino è un investimento a lungo termine: vendere entro 1-2 anni raramente è profittevole dopo commissioni e stoccaggio.",
    tags: ["tempo", "tenere", "lungo termine", "anni"],
  },
  {
    id: "r4", cat: "rendimenti",
    q: "Quali vini rendono di più?",
    a: "Borgogna Premier/Grand Cru (Romanée-Conti, Roumier, Rousseau), Bordeaux Premier Cru (Pétrus, Le Pin, Lafite), Barolo DOCG (Giacomo Conterno, Bruno Giacosa), Champagne Prestige (Dom Pérignon, Krug). AI Score > 85 indica alto potenziale.",
    tags: ["migliori", "rendono", "borgogna", "bordeaux", "barolo"],
  },
  {
    id: "r5", cat: "rendimenti",
    q: "Il vino batte le azioni in borsa?",
    a: "Non sempre e non per tutti. Negli ultimi 10 anni il mercato azionario (S&P 500) ha sovraperformato il fine wine in media, ma il vino mostra bassa correlazione con i mercati — ottimo per diversificare un portafoglio.",
    tags: ["azioni", "borsa", "confronto", "diversificazione"],
  },
  {
    id: "r6", cat: "rendimenti",
    q: "Come si calcola il ROI del mio portfolio?",
    a: "ROI = (Valore attuale totale − Capitale investito totale) ÷ Capitale investito × 100. Il valore attuale usa il prezzo di mercato corrente di ogni vino nel tuo portfolio.",
    tags: ["ROI", "calcolo", "formula", "portfolio"],
  },
  {
    id: "r7", cat: "rendimenti",
    q: "I costi di stoccaggio mangiano i rendimenti?",
    a: "Sì, calcolali sempre: stoccaggio professionale costa ~€10-20 per cassa/anno, assicurazione ~0.5-1% del valore. Su un portfolio da €10.000 puoi spendere €200-400/anno. Sottrailo dal rendimento atteso.",
    tags: ["costi", "stoccaggio", "assicurazione", "spese"],
  },

  // ── Come funziona ────────────────────────────────────────────────────────
  {
    id: "f1", cat: "funziona",
    q: "Cos'è l'AI Score?",
    a: "Un punteggio 0-100 calcolato da: rating critico (Parker, Decanter), annata, produttore, trend di mercato, rischio e liquidità. Score >80 = Strong Buy, 60-80 = Buy, 40-60 = Hold, <40 = considera Sell.",
    tags: ["ai score", "punteggio", "score", "come funziona"],
  },
  {
    id: "f2", cat: "funziona",
    q: "Come si legge il grafico storico prezzi?",
    a: "La linea mostra il prezzo medio nel tempo. Usa i bottoni 1M/3M/6M/1A/3A/MAX per cambiare periodo. Il tooltip su ogni punto mostra prezzo esatto e data. Fonte indicata in alto a destra.",
    tags: ["grafico", "storico", "prezzi", "leggere", "chart"],
  },
  {
    id: "f3", cat: "funziona",
    q: "Cosa significa Strong Buy / Buy / Hold / Sell?",
    a: "Sono segnali AI basati su momentum, trend e fondamentali: Strong Buy = ottimo momento, potenziale elevato. Buy = buone prospettive. Hold = mantieni senza comprare altro. Sell = considera di liquidare la posizione.",
    tags: ["strong buy", "buy", "hold", "sell", "segnale"],
  },
  {
    id: "f4", cat: "funziona",
    q: "I prezzi sono reali?",
    a: "I prezzi vengono da fonti multiple: Wine-Searcher (scraping), CellarTracker (community), Liv-ex (mercato professionale) e stime algoritmiche per regione/annata. Il badge 'Dati reali' vs 'Stimato' indica la fonte.",
    tags: ["prezzi", "reali", "fonte", "dati", "wine-searcher"],
  },
  {
    id: "f5", cat: "funziona",
    q: "Quanti vini sono sulla piattaforma?",
    a: "Oltre 50.000 vini da tutto il mondo: Bordeaux, Borgogna, Piemonte, Toscana, Champagne, California, Australia e altro. Aggiornati continuamente con nuovi lotti e annate.",
    tags: ["vini", "quanti", "catalogo", "database"],
  },
  {
    id: "f6", cat: "funziona",
    q: "Cosa sono le wine card?",
    a: "Ogni card mostra: nome, produttore, annata, prezzo corrente, AI Score con segnale, badge di rischio (Basso/Medio/Alto) e trend di mercato. Clicca sulla card per aprire il dettaglio con grafico prezzi e analisi completa.",
    tags: ["wine card", "scheda", "informazioni"],
  },
  {
    id: "f7", cat: "funziona",
    q: "Come funziona la ricerca?",
    a: "Digita nella barra di ricerca: nome del vino, produttore, regione, annata o tipo. Vengono mostrati i risultati più rilevanti in tempo reale. Filtra per tipo (Rosso/Bianco/Champagne) e annata dai menu a tendina.",
    tags: ["ricerca", "cerca", "search", "filtrare"],
  },
  {
    id: "f8", cat: "funziona",
    q: "Cos'è il mercato secondario del vino?",
    a: "È dove si comprano e vendono bottiglie già acquistate, tramite case d'aste (Sotheby's, Christie's), broker (Liv-ex, Bordeaux Index) o piattaforme online (Wine-Searcher, Vivino). VinoInvest ti mostra i prezzi di questo mercato.",
    tags: ["mercato secondario", "aste", "broker", "rivendita"],
  },

  // ── Portfolio ────────────────────────────────────────────────────────────
  {
    id: "p1", cat: "portfolio",
    q: "Come aggiungo un vino al portfolio?",
    a: "Clicca su un vino → bottone 'Aggiungi al Portfolio' (o 'Acquista') → inserisci prezzo pagato, quantità e data di acquisto. Il portfolio si aggiorna automaticamente con ROI e P&L.",
    tags: ["aggiungere", "portfolio", "acquistare", "come"],
  },
  {
    id: "p2", cat: "portfolio",
    q: "Come si calcola il ROI?",
    a: "ROI = (Prezzo attuale − Prezzo pagato) ÷ Prezzo pagato × 100. Esempio: hai pagato €500, vale oggi €650 → ROI = 30%. Il P&L assoluto è la differenza in euro per ogni bottiglia × quantità.",
    tags: ["ROI", "calcolo", "formula", "P&L"],
  },
  {
    id: "p3", cat: "portfolio",
    q: "Posso importare acquisti da altre piattaforme?",
    a: "Sì. Clicca su un vino → 'Ho già comprato' → inserisci dove hai comprato, prezzo pagato e data. Appare subito nel tuo portfolio con tracking del rendimento.",
    tags: ["importare", "altro", "piattaforme", "già comprato"],
  },
  {
    id: "p4", cat: "portfolio",
    q: "Come vedo l'analisi AI del mio portfolio?",
    a: "Vai alla sezione Portfolio → clicca 'Analizza Portfolio'. L'AI Claude analizza le tue posizioni e fornisce: segnale complessivo, raccomandazioni per ogni vino, diversificazione e outlook di mercato.",
    tags: ["analisi", "AI", "portfolio", "analizza"],
  },
  {
    id: "p5", cat: "portfolio",
    q: "Quanti vini devo avere per diversificare bene?",
    a: "Regola pratica: almeno 5-10 vini diversi, da almeno 3 regioni, su 2-3 annate diverse. Evita di concentrare >30% del valore su un singolo vino. Il Diversification Score in AI Analysis ti guida.",
    tags: ["diversificazione", "quanti", "numero", "regioni"],
  },
  {
    id: "p6", cat: "portfolio",
    q: "Come cancello una posizione dal portfolio?",
    a: "Vai a Portfolio → sezione 'Le mie posizioni' → trova il vino → clicca sull'icona cestino. La posizione viene rimossa e il P&L totale si aggiorna.",
    tags: ["cancellare", "rimuovere", "eliminare", "posizione"],
  },

  // ── Acquisti ─────────────────────────────────────────────────────────────
  {
    id: "a1", cat: "acquisti",
    q: "Posso comprare vini direttamente qui?",
    a: "VinoInvest è una piattaforma di analisi e intelligence. Per acquistare ti colleghiamo alle migliori piattaforme: Wine-Searcher, Vivino, Tannico, Millesima. Vedi i prezzi su 7 piattaforme e scegli il migliore.",
    tags: ["comprare", "acquistare", "direttamente", "piattaforme"],
  },
  {
    id: "a2", cat: "acquisti",
    q: "Come funziona il confronto prezzi?",
    a: "Apri un vino → sezione 'Confronta Prezzi' (bottone sotto la card). Vedi prezzi su Wine-Searcher, Vivino, Bordeaux Index, Liv-ex e altre. Clicca sulla piattaforma e vai direttamente alla pagina di acquisto.",
    tags: ["confronto", "prezzi", "piattaforme", "migliore"],
  },
  {
    id: "a3", cat: "acquisti",
    q: "Come conservo correttamente le bottiglie?",
    a: "Temperatura costante 12-14°C, umidità 60-70%, buio totale, vibrazioni minime, bottiglie orizzontali. Per investimento serio usa cantinieri professionali certificati (es. Octavian UK, Unico Collector IT).",
    tags: ["conservare", "stoccaggio", "temperatura", "cantina"],
  },
  {
    id: "a4", cat: "acquisti",
    q: "Cosa sono i vini en primeur?",
    a: "Vini acquistati 'a futura' prima dell'imbottigliamento (tipicamente aprile-maggio per Bordeaux). Prezzi più bassi ma paghi ora e ricevi il vino 2-3 anni dopo. Rischio maggiore ma potenziale upside significativo.",
    tags: ["en primeur", "futures", "bordeaux", "prenotare"],
  },
  {
    id: "a5", cat: "acquisti",
    q: "Dove posso vendere vini dal mio portfolio?",
    a: "Case d'aste: Sotheby's, Christie's, Bonhams. Broker: Liv-ex, Bordeaux Index. Piattaforme peer-to-peer: Wine-Searcher (listing), Vinfolio. Tasse sulla plusvalenza variano per paese — consulta un fiscalista.",
    tags: ["vendere", "aste", "broker", "liquidare"],
  },

  // ── Account ───────────────────────────────────────────────────────────────
  {
    id: "ac1", cat: "account",
    q: "Come cambio la lingua?",
    a: "Clicca sulla bandiera in alto a destra (header) e seleziona la tua lingua. Il sito è disponibile in 40+ lingue. La preferenza viene salvata per le sessioni future.",
    tags: ["lingua", "traduzione", "cambiare", "italiano"],
  },
  {
    id: "ac2", cat: "account",
    q: "Come imposto un price alert?",
    a: "Apri un vino → sezione 'Alert' → inserisci il prezzo target → premi il bottone 🔔. Ti avvisiamo quando il prezzo scende sotto la soglia. Vedi tutti i tuoi alert nella sezione Notifiche.",
    tags: ["alert", "avviso", "prezzo", "notifica"],
  },
  {
    id: "ac3", cat: "account",
    q: "Come accedo con Google?",
    a: "Nella schermata di login clicca 'Accedi con Google'. Se è il tuo primo accesso, verrà creato automaticamente un account VinoInvest collegato alla tua email Google.",
    tags: ["google", "login", "accesso", "social"],
  },
  {
    id: "ac4", cat: "account",
    q: "Posso usare VinoInvest gratis?",
    a: "Sì, il piano Free include: catalogo completo, AI Score base, portfolio tracker (fino a 5 vini), news e blog. I piani Premium aggiungono: analisi AI illimitata, alert multipli, dati Liv-ex avanzati.",
    tags: ["gratis", "free", "piano", "premium", "costo"],
  },
  {
    id: "ac5", cat: "account",
    q: "Come cancello il mio account?",
    a: "Vai alle impostazioni account → 'Zona pericolosa' → 'Elimina account'. Tutti i tuoi dati vengono cancellati entro 30 giorni. Esporta prima i dati del portfolio se li vuoi conservare.",
    tags: ["cancellare", "eliminare", "account", "dati"],
  },

  // ── Sicurezza ─────────────────────────────────────────────────────────────
  {
    id: "s1", cat: "sicurezza",
    q: "I miei dati sono al sicuro?",
    a: "Sì. Usiamo Supabase per l'autenticazione (standard bancario, crittografia AES-256), connessioni HTTPS/SSL ovunque, e non condividiamo mai i tuoi dati con terzi. Portfolio e alert sono visibili solo a te.",
    tags: ["sicurezza", "dati", "privacy", "protezione"],
  },
  {
    id: "s2", cat: "sicurezza",
    q: "Come proteggete la mia password?",
    a: "Non memorizziamo la tua password in chiaro. Supabase usa hashing bcrypt. Puoi anche accedere con Google OAuth (non ci serve alcuna password). Abilita 2FA dalle impostazioni per maggiore sicurezza.",
    tags: ["password", "protezione", "hash", "2FA"],
  },
  {
    id: "s3", cat: "sicurezza",
    q: "VinoInvest può accedere al mio conto bancario?",
    a: "No. VinoInvest non chiede mai credenziali bancarie. I pagamenti per i piani premium passano attraverso Stripe e PayPal — non gestiamo direttamente i dati della tua carta di credito.",
    tags: ["banca", "conto", "carte", "pagamento", "stripe"],
  },
  {
    id: "s4", cat: "sicurezza",
    q: "Cosa succede ai miei dati se cancello l'account?",
    a: "Tutti i dati vengono eliminati definitivamente entro 30 giorni dalla cancellazione: portfolio, alert, storico, sessioni. Ti consigliamo di esportare il portfolio prima.",
    tags: ["cancellazione", "dati", "eliminazione", "GDPR"],
  },
];

export const CATEGORIES = [
  { id: "all",        label: "Tutte",          icon: "🔍" },
  { id: "rendimenti", label: "Rendimenti",      icon: "📈" },
  { id: "funziona",   label: "Come funziona",   icon: "⚙️" },
  { id: "portfolio",  label: "Portfolio",       icon: "💼" },
  { id: "acquisti",   label: "Acquisti",        icon: "🛒" },
  { id: "account",    label: "Account",         icon: "👤" },
  { id: "sicurezza",  label: "Sicurezza",       icon: "🔒" },
];

// Fuzzy search: returns FAQ items sorted by relevance score
export function searchFAQ(query) {
  if (!query.trim()) return FAQ;
  const q = query.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const synonyms = {
    "guadagno": ["rendimento", "ritorno", "profitto"],
    "guadagnare": ["rendimento", "rendere", "profitto"],
    "comprare": ["acquistare", "acquisto"],
    "vendere": ["liquidare", "vendita"],
    "rischio": ["rischioso", "rischiare"],
    "score": ["punteggio", "ai score"],
    "quanto": ["rendimento", "percentuale", "ROI"],
    "sicuro": ["sicurezza", "protezione"],
    "gratis": ["free", "piano", "gratuito"],
  };

  const expandedTerms = [q];
  Object.entries(synonyms).forEach(([word, syns]) => {
    if (q.includes(word)) expandedTerms.push(...syns);
    syns.forEach(s => { if (q.includes(s)) expandedTerms.push(word); });
  });

  return FAQ
    .map(item => {
      const text = `${item.q} ${item.a} ${(item.tags || []).join(" ")}`.toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "");
      let score = 0;
      expandedTerms.forEach(term => {
        if (text.includes(term)) score += term === q ? 3 : 1;
      });
      return { ...item, _score: score };
    })
    .filter(i => i._score > 0)
    .sort((a, b) => b._score - a._score);
}
