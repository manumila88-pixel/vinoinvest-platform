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

  // ── B2B — Investitori istituzionali ──────────────────────────────────────
  {
    id: "b1", cat: "b2b",
    q: "Quali sono i volumi minimi per investimento istituzionale?",
    a: "Per wealth manager e family office consigliamo portafogli da €50.000+. Sotto questa soglia i costi di gestione erodono i rendimenti.",
    tags: ["istituzionale", "minimo", "family office", "wealth manager", "volume"],
  },
  {
    id: "b2", cat: "b2b",
    q: "Come funziona la due diligence su un vino da investimento?",
    a: "Verificare: autenticità (provenienza documentata), condizioni di stoccaggio (temperatura 12-14°C, umidità 70%), track record del produttore, liquidità del mercato secondario.",
    tags: ["due diligence", "autenticità", "stoccaggio", "verifica"],
  },
  {
    id: "b3", cat: "b2b",
    q: "Quali sono i rischi principali per un investitore istituzionale?",
    a: "Rischio liquidità (mercato secondario limitato), rischio autenticità (falsi), rischio stoccaggio, rischio reputazionale del produttore, cambio valuta per mercati esteri.",
    tags: ["rischi", "istituzionale", "liquidità", "autenticità", "valuta"],
  },
  {
    id: "b4", cat: "b2b",
    q: "Come si costruisce un portafoglio vino diversificato per un family office?",
    a: "Allocazione consigliata: 40% Bordeaux premier cru, 25% Borgogna grand cru, 15% Italia (Barolo/Brunello), 10% Champagne prestige, 10% emerging (Napa, Spagna). Orizzonte 7-10 anni.",
    tags: ["portafoglio", "diversificato", "allocazione", "family office"],
  },
  {
    id: "b5", cat: "b2b",
    q: "Qual è la correlazione del vino con altri asset class?",
    a: "Il fine wine ha correlazione bassa con equity (~0.1) e obbligazioni (~0.05). Eccellente diversificatore in periodi di volatilità. Durante crisi 2008 Liv-ex 100 perse solo 8% vs -40% S&P500.",
    tags: ["correlazione", "asset class", "diversificazione", "equity", "obbligazioni"],
  },
  {
    id: "b6", cat: "b2b",
    q: "Come si calcola il NAV di un portafoglio vino?",
    a: "NAV = somma (prezzo mercato corrente × quantità) per ogni posizione. VinoInvest aggiorna i prezzi continuamente. Export CSV disponibile per riconciliazione contabile.",
    tags: ["NAV", "calcolo", "portafoglio", "contabile", "export"],
  },

  // ── B2B — Wealth Manager avanzato ────────────────────────────────────────
  {
    id: "b7", cat: "b2b",
    q: "Come posso gestire portfolio separati per ogni cliente?",
    a: "Con il piano Professional o Enterprise puoi creare portfolio dedicati per ogni cliente dalla sezione 'Clienti' della dashboard B2B. Ogni cliente vede solo il suo portfolio, con report personalizzati.",
    tags: ["portfolio", "clienti", "separati", "wealth manager", "gestione"],
  },
  {
    id: "b8", cat: "b2b",
    q: "Il report PDF è personalizzabile con il mio logo?",
    a: "Sì, nel piano Professional e Enterprise i report PDF includono il tuo logo e colori aziendali. Vai su Dashboard B2B → Impostazioni → Brand per caricare logo e scegliere il colore primario.",
    tags: ["PDF", "logo", "brand", "personalizzabile", "report"],
  },
  {
    id: "b9", cat: "b2b",
    q: "Quali formati di export sono disponibili?",
    a: "CSV (compatibile Excel e Bloomberg), PDF professionale con grafici, JSON via API REST. Excel XLSX in arrivo. Tutti gli export sono disponibili dal tab Portfolio → Esporta.",
    tags: ["export", "CSV", "PDF", "Bloomberg", "formati", "Excel"],
  },
  {
    id: "b10", cat: "b2b",
    q: "Come funziona la fatturazione per più utenti?",
    a: "La fatturazione è per organizzazione, non per utente. Un piano Professional a €200/mese include fino a 5 utenti advisor. Enterprise è illimitato. Fattura mensile o annuale (sconto 20%).",
    tags: ["fatturazione", "utenti", "piano", "organizzazione", "costo"],
  },
  {
    id: "b11", cat: "b2b",
    q: "Posso integrare VinoInvest con il mio CRM?",
    a: "Sì via API REST: endpoint /api/v1/clients e /api/v1/portfolios esportano tutti i dati in JSON. Compatibile con Salesforce, HubSpot, e qualsiasi CRM con webhook. Documentazione su /api/v1/docs.",
    tags: ["CRM", "integrazione", "Salesforce", "API", "webhook"],
  },
  {
    id: "b12", cat: "b2b",
    q: "I dati dei miei clienti sono al sicuro?",
    a: "Sì. I dati dei clienti sono isolati per organizzazione: un advisor non può vedere i clienti di un'altra org. Crittografia AES-256 a riposo, TLS 1.3 in transito. Data center EU. DPA disponibile.",
    tags: ["sicurezza", "clienti", "dati", "isolamento", "crittografia"],
  },
  {
    id: "b13", cat: "b2b",
    q: "Qual è l'SLA garantito?",
    a: "Piano Professional: 99.5% uptime, risposta support entro 4h lavorative. Piano Enterprise: 99.9% uptime garantito contrattualmente, account manager dedicato, supporto 24/7 per incidenti critici.",
    tags: ["SLA", "uptime", "supporto", "garantito", "enterprise"],
  },
  {
    id: "b14", cat: "b2b",
    q: "Posso fare white label per i miei clienti?",
    a: "Sì, nel piano Enterprise. White label completo: logo, colori, dominio personalizzato (es. wine.tuaazienda.com), report PDF completamente brandizzati senza riferimenti a VinoInvest.",
    tags: ["white label", "dominio", "brand", "enterprise", "personalizzazione"],
  },
  {
    id: "b15", cat: "b2b",
    q: "Come funziona la suitability assessment?",
    a: "Dal profilo cliente in Dashboard B2B → Clienti → Suitability. Compila il questionario MiFID II (rischio, orizzonte, esperienza, obiettivi). Il sistema calcola il profilo adeguato e genera il documento firmabile.",
    tags: ["suitability", "assessment", "MiFID", "questionario", "cliente"],
  },
  {
    id: "b16", cat: "b2b",
    q: "Avete supporto per compliance MiFID II?",
    a: "VinoInvest non è un gestore regolamentato, ma supporta la compliance del tuo processo: suitability assessment, audit trail completo, DPA GDPR, report documentati con fonti. Parlate con il vostro compliance officer.",
    tags: ["MiFID II", "compliance", "suitability", "audit", "regolamentazione"],
  },
  {
    id: "b17", cat: "b2b",
    q: "Come invito un cliente a vedere il suo portfolio?",
    a: "Dashboard B2B → Clienti → [cliente] → 'Invia Invito'. Il cliente riceve email con credenziali temporanee e accede a una vista dedicata che mostra SOLO il suo portfolio.",
    tags: ["invito", "cliente", "credenziali", "portfolio", "accesso"],
  },
  {
    id: "b18", cat: "b2b",
    q: "Posso aggiungere note private su un cliente?",
    a: "Sì, dalla scheda cliente in Dashboard B2B → Note Advisor. Le note sono visibili solo all'advisor e ai membri dell'organizzazione. Il cliente non le vede. Ideale per memo post-incontro e raccomandazioni.",
    tags: ["note", "advisor", "privato", "cliente", "memo"],
  },
  {
    id: "b19", cat: "b2b",
    q: "Come funzionano i permessi multi-utente?",
    a: "Nella tua organizzazione puoi assegnare ruoli: Owner (tutti i permessi), Analyst (legge e analisi), Advisor (gestione clienti). Ogni ruolo vede solo le funzioni appropriate.",
    tags: ["permessi", "ruoli", "multi-utente", "organizzazione", "accesso"],
  },
  {
    id: "b20", cat: "b2b",
    q: "Quanto costa lo storage dei dati storici?",
    a: "Incluso nel piano. Tutti i piani B2B includono accesso illimitato allo storico prezzi Liv-ex, price history 24+ mesi per ogni vino, e archivio report generati illimitato.",
    tags: ["storage", "dati", "storico", "incluso", "costo"],
  },
  {
    id: "b21", cat: "b2b",
    q: "Posso generare un report in automatico ogni mese?",
    a: "Sì, nel piano Professional e Enterprise puoi configurare report automatici mensili o trimestrali: Dashboard B2B → Impostazioni → Report Automatici. Il PDF viene inviato via email al cliente.",
    tags: ["automatico", "report", "mensile", "trimestrale", "email"],
  },
  {
    id: "b22", cat: "b2b",
    q: "Come scarico i template professionali?",
    a: "Vai su vinoinvest-platform.vercel.app/b2b/templates. Trovi 4 template scaricabili: Suitability Assessment, Due Diligence Checklist, Report Portfolio, Framework Allocazione Multi-Asset.",
    tags: ["template", "scaricabili", "suitability", "due diligence", "framework"],
  },
  {
    id: "b23", cat: "b2b",
    q: "Qual è la differenza tra Professional ed Enterprise?",
    a: "Professional (€200/mese): 20 clienti, report branded, API 10k req/giorno, support dedicato. Enterprise (€500/mese): clienti illimitati, white label completo, API illimitata, SLA 99.9%, account manager dedicato.",
    tags: ["piano", "professional", "enterprise", "differenza", "funzionalità"],
  },
  {
    id: "b24", cat: "b2b",
    q: "Come funziona il benchmark nel report PDF?",
    a: "Il report include confronto automatico con: Liv-ex 1000 (indice principale fine wine), S&P500, Gold, Inflazione EU. Evidenzia l'alpha generato dal portfolio wine rispetto agli indici standard.",
    tags: ["benchmark", "Liv-ex", "S&P500", "report", "alpha"],
  },
  {
    id: "b25", cat: "b2b",
    q: "Posso esportare l'audit trail delle operazioni?",
    a: "Sì, Dashboard B2B → Compliance → Audit Log esporta tutte le operazioni con timestamp, utente e dettaglio. Disponibile in CSV. Essenziale per audit interni e documentazione compliance.",
    tags: ["audit", "trail", "operazioni", "compliance", "export"],
  },
  {
    id: "b26", cat: "b2b",
    q: "Come accede il cliente alla sua vista personalizzata?",
    a: "Il cliente riceve email di invito con link e credenziali temporanee. Accede a un'interfaccia semplificata che mostra solo il suo portfolio, i report dell'advisor e le note visibili. Non vede altri clienti.",
    tags: ["cliente", "accesso", "personalizzata", "interfaccia", "portale"],
  },
  {
    id: "b27", cat: "b2b",
    q: "Come calcolo il Sharpe Ratio del portfolio di un cliente?",
    a: "Dashboard B2B → [Cliente] → Risk Metrics. Il sistema calcola automaticamente Sharpe Ratio, Volatilità, Max Drawdown e VaR usando i prezzi storici Liv-ex. Export disponibile per i report.",
    tags: ["Sharpe", "rischio", "VaR", "drawdown", "metriche"],
  },
  {
    id: "b28", cat: "b2b",
    q: "Posso collegare VinoInvest a Bloomberg Terminal?",
    a: "Sì, via API REST e export CSV compatibile con Bloomberg Data License. Il formato CSV segue gli standard Bloomberg per l'importazione diretta. Contatta support per la configurazione guidata.",
    tags: ["Bloomberg", "Terminal", "integrazione", "CSV", "API"],
  },
  {
    id: "b29", cat: "b2b",
    q: "Come funziona la prova gratuita B2B?",
    a: "30 giorni gratuiti senza carta di credito. Puoi creare fino a 3 portfolio clienti, generare report PDF, usare la dashboard completa. Al termine: converti in Professional (€200/mese) o Starter (gratis fino a 3 clienti).",
    tags: ["prova", "gratuita", "trial", "30 giorni", "senza carta"],
  },
  {
    id: "b30", cat: "b2b",
    q: "Come gestisco i portfolio in più valute?",
    a: "I prezzi dei vini vengono mostrati in EUR, USD e GBP. Il NAV totale del portfolio è calcolato nella valuta base scelta dall'advisor. I tassi di cambio si aggiornano ogni ora.",
    tags: ["valuta", "EUR", "USD", "GBP", "multi-valuta", "NAV"],
  },

  // ── B2B Professional — Onboarding ────────────────────────────────────────
  {
    id: "b2b_01", cat: "b2b",
    q: "Quanto tempo richiede il processo di onboarding?",
    a: "Il processo di onboarding per clienti Professional ed Enterprise richiede in media 2–3 giorni lavorativi: il giorno 1 viene creato e verificato l'account organizzazione; il giorno 2 viene completato il KYC e caricato il brand kit; il giorno 3 il team abilita tutte le funzionalità avanzate e organizza una sessione di formazione dedicata.",
    tags: ["onboarding", "tempi", "attivazione", "professional", "enterprise"],
  },
  {
    id: "b2b_02", cat: "b2b",
    q: "Quali documenti sono necessari per il KYC?",
    a: "Per completare la verifica KYC sono richiesti: documento di identità valido del rappresentante legale (carta d'identità o passaporto), visura camerale aggiornata (non oltre 6 mesi), codice LEI per clienti istituzionali e, per fondi o family office, copia dello statuto e delibera di autorizzazione all'utilizzo della piattaforma.",
    tags: ["KYC", "documenti", "verifica", "identità", "LEI", "onboarding"],
  },
  {
    id: "b2b_03", cat: "b2b",
    q: "È possibile importare portfolio di clienti già esistenti?",
    a: "Sì. Durante l'onboarding il team VinoInvest supporta la migrazione dei dati esistenti tramite upload CSV con il formato standard fornito nella documentazione. È possibile importare: nome cliente, posizioni wine (LWIN o nome libero), prezzo di acquisto, quantità e data. Il processo richiede circa 24 ore per portafogli fino a 500 posizioni.",
    tags: ["importare", "migrazione", "portfolio", "CSV", "onboarding", "dati esistenti"],
  },
  {
    id: "b2b_04", cat: "b2b",
    q: "È disponibile formazione o supporto dedicato alla piattaforma?",
    a: "Sì. Il piano Professional include una sessione di onboarding live da 60 minuti con un account specialist e accesso alla knowledge base completa. Il piano Enterprise aggiunge formazione personalizzata per tutti gli advisor del team, sessioni mensili di aggiornamento sulle nuove funzionalità e un canale Slack dedicato con il team VinoInvest.",
    tags: ["formazione", "training", "supporto", "onboarding", "account specialist", "sessione"],
  },

  // ── B2B Professional — Compliance / MiFID II ─────────────────────────────
  {
    id: "b2b_05", cat: "b2b",
    q: "La piattaforma supporta la conformità MiFID II per il mio processo advisory?",
    a: "VinoInvest non è un intermediario regolamentato MiFID II, ma è progettata per supportare il tuo processo di conformità: include suitability assessment strutturato, audit trail immutabile di tutte le operazioni, documentazione delle raccomandazioni con fonti e metodologia AI, e report pronti per la conservazione documentale richiesta dalla direttiva.",
    tags: ["MiFID II", "compliance", "suitability", "audit trail", "conformità", "direttiva"],
  },
  {
    id: "b2b_06", cat: "b2b",
    q: "Come vengono conservati e tracciati i suitability assessment?",
    a: "Ogni suitability assessment completato viene salvato con timestamp certificato, versione del questionario utilizzata e punteggio di profilo risultante. I documenti sono consultabili e scaricabili in PDF da Dashboard B2B → Compliance → Suitability Archive. La retention predefinita è 10 anni, in linea con i requisiti MiFID II.",
    tags: ["suitability", "assessment", "conservazione", "MiFID II", "retention", "audit"],
  },
  {
    id: "b2b_07", cat: "b2b",
    q: "Per quanto tempo vengono conservati i documenti di compliance?",
    a: "I documenti di compliance (suitability, report generati, audit log, comunicazioni con i clienti) vengono conservati per un minimo di 10 anni dalla data di creazione, in conformità con l'art. 25 MiFID II. Al termine della retention period viene inviata notifica all'organizzazione prima di qualsiasi eliminazione. Puoi richiedere retention estesa fino a 15 anni per piani Enterprise.",
    tags: ["conservazione", "retention", "compliance", "MiFID II", "documenti", "10 anni"],
  },
  {
    id: "b2b_08", cat: "b2b",
    q: "Posso generare report conformi MiFID II da consegnare ai clienti?",
    a: "Sì. I report generabili da Dashboard B2B → Report includono tutti gli elementi richiesti: descrizione degli strumenti raccomandati, giustificazione della raccomandazione rispetto al profilo di suitability del cliente, costi e oneri stimati, e dichiarazione che la raccomandazione si basa su dati di mercato aggiornati. Il PDF è firmabile digitalmente e archiviato automaticamente.",
    tags: ["report", "MiFID II", "conforme", "raccomandazione", "PDF", "compliance"],
  },

  // ── B2B Professional — Gestione multi-cliente ────────────────────────────
  {
    id: "b2b_09", cat: "b2b",
    q: "Quanti clienti posso gestire per ciascun piano?",
    a: "Il piano Starter B2B include fino a 3 clienti. Il piano Professional (€200/mese) supporta fino a 20 clienti attivi. Il piano Enterprise (€500/mese) offre clienti illimitati. In tutti i piani 'cliente attivo' significa un profilo con almeno un portfolio associato; profili archiviati non contano verso il limite.",
    tags: ["clienti", "piano", "limite", "professional", "enterprise", "numero"],
  },
  {
    id: "b2b_10", cat: "b2b",
    q: "I clienti possono vedere i portfolio degli altri clienti?",
    a: "Assolutamente no. L'isolamento dei dati è garantito a livello di database: ogni cliente accede esclusivamente al proprio portfolio tramite credenziali personali. Gli advisor vedono tutti i clienti della propria organizzazione, ma non possono accedere ai clienti di altre organizzazioni. L'architettura è multi-tenant con row-level security su PostgreSQL.",
    tags: ["privacy", "isolamento", "clienti", "sicurezza", "multi-tenant", "row-level security"],
  },
  {
    id: "b2b_11", cat: "b2b",
    q: "Come configuro l'accesso per un nuovo cliente?",
    a: "Da Dashboard B2B → Clienti → '+Nuovo Cliente': inserisci nome, email e profilo di rischio base. Il sistema invia automaticamente un'email di invito con credenziali temporanee (valide 7 giorni). Al primo accesso il cliente imposta la password definitiva e può facoltativamente completare il profilo di suitability.",
    tags: ["accesso", "nuovo cliente", "invito", "credenziali", "configurazione"],
  },
  {
    id: "b2b_12", cat: "b2b",
    q: "Esiste un portale dedicato per i clienti finali?",
    a: "Sì. I clienti invitati accedono a un portale semplificato su app.vinoinvest.com/client che mostra esclusivamente: il loro portfolio con performance aggiornata, i report pubblicati dall'advisor, i documenti condivisi e le notifiche di mercato personalizzate. Il portale è responsive e ottimizzato per mobile.",
    tags: ["portale", "cliente", "app", "interfaccia", "mobile", "performance"],
  },

  // ── B2B Professional — Reporting & PDF ───────────────────────────────────
  {
    id: "b2b_13", cat: "b2b",
    q: "Quali tipologie di report posso generare?",
    a: "Dalla Dashboard B2B sono disponibili: (1) Report Portfolio mensile/trimestrale con performance e benchmark, (2) Report Due Diligence vino singolo, (3) Report Suitability Assessment, (4) Market Outlook settimanale con top pick B2B, (5) Audit Log Compliance esportabile in CSV. Tutti i report sono disponibili in PDF e, dove indicato, in CSV/Excel.",
    tags: ["report", "tipologie", "portfolio", "due diligence", "suitability", "audit log"],
  },
  {
    id: "b2b_14", cat: "b2b",
    q: "Posso personalizzare i report PDF con il logo e i colori della mia società?",
    a: "Sì, nel piano Professional ed Enterprise. Vai su Dashboard B2B → Impostazioni → Brand Identity: carica il logo (PNG/SVG, min 200px), seleziona colore primario e secondario in hex, e inserisci i dati aziendali (nome, partita IVA, disclaimer legale). Tutti i PDF generati useranno automaticamente il tuo brand kit. Nel piano Enterprise è possibile rimuovere completamente ogni riferimento a VinoInvest.",
    tags: ["white label", "logo", "brand", "PDF", "personalizzazione", "colori"],
  },
  {
    id: "b2b_15", cat: "b2b",
    q: "Con quale frequenza posso generare report?",
    a: "Non ci sono limiti al numero di report manuali generabili. I report automatici schedulabili sono: mensili (12/anno), trimestrali (4/anno) o settimanali (52/anno, solo Enterprise). Ogni report generato viene archiviato nella Document Library del cliente e può essere ri-scaricato in qualsiasi momento.",
    tags: ["frequenza", "report", "mensile", "trimestrale", "settimanale", "limite"],
  },
  {
    id: "b2b_16", cat: "b2b",
    q: "Cosa contiene il report PDF mensile standard?",
    a: "Il report PDF mensile include: riepilogo executive con NAV e variazione del mese, composizione portfolio per regione e tipologia con grafico a torta, performance di ogni posizione (P&L, ROI, variazione mensile), confronto con benchmark (Liv-ex 1000, S&P 500, Oro), top mover del portfolio, segnali AI aggiornati per ogni posizione, outlook di mercato del mese e note dell'advisor.",
    tags: ["PDF", "mensile", "contenuto", "NAV", "benchmark", "composizione", "outlook"],
  },

  // ── B2B Professional — Pricing & Piani ───────────────────────────────────
  {
    id: "b2b_17", cat: "b2b",
    q: "Cosa è incluso nel piano Professional?",
    a: "Il piano Professional (€200/mese, fatturazione mensile; €160/mese con fatturazione annuale) include: gestione fino a 20 clienti, report PDF branded con il tuo logo, accesso API fino a 10.000 richieste/giorno, dati Liv-ex avanzati, suitability assessment illimitati, audit trail completo, supporto via email con risposta entro 4 ore lavorative e accesso alla knowledge base B2B.",
    tags: ["professional", "piano", "incluso", "prezzo", "funzionalità", "API"],
  },
  {
    id: "b2b_18", cat: "b2b",
    q: "Posso passare a un piano superiore o inferiore in qualsiasi momento?",
    a: "Sì. L'upgrade è immediato: le funzionalità aggiuntive sono disponibili subito e la fatturazione viene ricalcolata pro-rata per il mese in corso. Il downgrade è effettivo al termine del ciclo di fatturazione corrente; riceverai notifica se il numero di clienti attivi supera il limite del piano di destinazione e avrai 30 giorni per archiviare le posizioni in eccesso.",
    tags: ["upgrade", "downgrade", "piano", "cambio", "fatturazione", "pro-rata"],
  },
  {
    id: "b2b_19", cat: "b2b",
    q: "È disponibile un periodo di prova gratuito per i piani B2B?",
    a: "Sì. I piani Professional ed Enterprise includono 30 giorni di prova gratuita senza carta di credito. Durante la prova hai accesso completo a tutte le funzionalità del piano scelto, puoi gestire fino a 3 clienti reali e generare report brandizzati. Al termine del trial puoi scegliere di sottoscrivere o continuare con il piano Starter B2B gratuito (max 3 clienti, funzionalità base).",
    tags: ["prova", "trial", "gratuito", "30 giorni", "senza carta", "professional"],
  },
  {
    id: "b2b_20", cat: "b2b",
    q: "Sono disponibili sconti per volumi o contratti pluriennali?",
    a: "Sì. Fatturazione annuale: sconto del 20% su tutti i piani (equivalente a 2 mesi gratuiti). Contratti biennali: sconto 30% con pagamento anticipato. Per organizzazioni con più di 10 advisor o portfoli superiori a €50M AUM gestiti sulla piattaforma, contatta sales@vinoinvest.com per un'offerta personalizzata. Sconti non cumulabili.",
    tags: ["sconto", "volume", "annuale", "pluriennale", "prezzo", "AUM"],
  },

  // ── B2B Professional — Dati & API ────────────────────────────────────────
  {
    id: "b2b_21", cat: "b2b",
    q: "Posso esportare tutti i dati in CSV o Excel?",
    a: "Sì. Da Dashboard B2B → Export puoi scaricare: portafoglio completo per cliente in CSV (compatibile Excel, Google Sheets, Bloomberg), storico prezzi per ogni vino selezionato, audit log delle operazioni, e lista completa dei clienti con metadati. L'export Excel nativo (XLSX) con formattazione e grafici incorporati è disponibile nel piano Enterprise.",
    tags: ["export", "CSV", "Excel", "XLSX", "dati", "Bloomberg", "download"],
  },
  {
    id: "b2b_22", cat: "b2b",
    q: "Esiste un'API per integrare VinoInvest con il mio CRM?",
    a: "Sì. L'API REST v1 è documentata su /api/v1/docs (Swagger UI). Gli endpoint principali per l'integrazione CRM sono: GET /api/v1/clients (lista clienti), GET /api/v1/portfolios/{clientId} (portfolio cliente), POST /api/v1/webhooks (configura webhook per eventi real-time come aggiornamenti prezzo o segnali AI). Compatibile nativamente con Salesforce via Connected App e HubSpot via Custom Integration.",
    tags: ["API", "CRM", "Salesforce", "HubSpot", "webhook", "integrazione", "REST"],
  },
  {
    id: "b2b_23", cat: "b2b",
    q: "Quali sono le fonti dei dati utilizzate da VinoInvest?",
    a: "I prezzi dei vini provengono da: Liv-ex (mercato professionale, aggiornamento intraday), Wine-Searcher (prezzi di vendita al dettaglio globali), CellarTracker (valutazioni community e prezzi d'asta), dati di Christie's e Sotheby's (risultati d'asta storici), e algoritmi proprietari di stima per vini con scarsa liquidità. Il badge 'Dati reali' vs 'Stimato' indica la fonte primaria utilizzata per ogni vino.",
    tags: ["fonti", "dati", "Liv-ex", "Wine-Searcher", "CellarTracker", "aste", "prezzi"],
  },
  {
    id: "b2b_24", cat: "b2b",
    q: "Con quale frequenza viene aggiornato l'AI Score?",
    a: "L'AI Score viene ricalcolato ogni 24 ore nella finestra notturna (01:00–03:00 CET) tenendo conto di: aggiornamenti di prezzo Liv-ex, nuove recensioni dei critici (Parker, Decanter, Gambero Rosso), variazioni del sentiment di mercato e dati macroeconomici rilevanti. Per eventi straordinari (es. nuova vendemmia classificata 100 punti) viene eseguito un ricalcolo immediato fuori ciclo.",
    tags: ["AI Score", "aggiornamento", "frequenza", "ricalcolo", "Parker", "Decanter"],
  },

  // ── B2B Professional — Sicurezza & Privacy ───────────────────────────────
  {
    id: "b2b_25", cat: "b2b",
    q: "Come sono protetti i dati dei miei clienti?",
    a: "I dati dei clienti sono protetti con: crittografia AES-256 a riposo su tutti i database, TLS 1.3 in transito, isolamento multi-tenant con row-level security (ogni organizzazione non può accedere ai dati di un'altra), autenticazione a due fattori obbligatoria per gli account advisor B2B, e accesso all'infrastruttura ristretto con principio del privilegio minimo. I log di accesso ai dati sono conservati per 12 mesi.",
    tags: ["sicurezza", "dati", "crittografia", "AES-256", "TLS", "2FA", "multi-tenant"],
  },
  {
    id: "b2b_26", cat: "b2b",
    q: "VinoInvest è conforme al GDPR?",
    a: "Sì. VinoInvest è conforme al Regolamento UE 2016/679 (GDPR): i dati sono trattati e conservati in data center nell'Unione Europea (Supabase EU region, Frankfurt), viene fornito un Data Processing Agreement (DPA) standard a tutti i clienti B2B, gli interessati possono esercitare i diritti di accesso, rettifica e cancellazione dall'account, e VinoInvest è iscritta al registro dei titolari del trattamento. Il DPA è richiesto tramite legal@vinoinvest.com.",
    tags: ["GDPR", "conformità", "data protection", "DPA", "EU", "diritti"],
  },
  {
    id: "b2b_27", cat: "b2b",
    q: "Dove sono fisicamente conservati i dati?",
    a: "Tutti i dati degli utenti e dei clienti B2B sono conservati esclusivamente in Europa: il database PostgreSQL principale è ospitato su Render (Frankfurt, DE), l'autenticazione è gestita da Supabase (EU region, Frankfurt), e il frontend è distribuito su Vercel con CDN geo-restricted a edge node europei. Non vengono effettuati trasferimenti di dati personali verso paesi extra-SEE.",
    tags: ["dati", "storage", "EU", "Frankfurt", "Render", "Supabase", "GDPR", "geografico"],
  },

  // ── B2B Professional — Supporto & SLA ────────────────────────────────────
  {
    id: "b2b_28", cat: "b2b",
    q: "Quali sono i tempi di risposta del supporto per i piani B2B?",
    a: "Piano Starter B2B: supporto via email, risposta entro 2 giorni lavorativi. Piano Professional: supporto via email con risposta garantita entro 4 ore lavorative (lun–ven, 9–18 CET), accesso alla knowledge base avanzata e chat in-app. Piano Enterprise: supporto prioritario 24/7 per incidenti critici (P1), risposta entro 1 ora; per richieste normali entro 2 ore lavorative. Tutti i piani includono la status page pubblica con uptime storico.",
    tags: ["supporto", "tempi", "risposta", "SLA", "professional", "enterprise", "24/7"],
  },
  {
    id: "b2b_29", cat: "b2b",
    q: "Il piano Enterprise include un account manager dedicato?",
    a: "Sì. Il piano Enterprise include un Customer Success Manager (CSM) dedicato che funge da punto di contatto unico: gestisce l'onboarding, pianifica le sessioni di aggiornamento trimestrale, coordina le richieste di sviluppo personalizzato e monitora proattivamente l'utilizzo della piattaforma per suggerire ottimizzazioni. Il CSM è raggiungibile via email, telefono e Slack dedicato durante gli orari lavorativi, con reperibilità per incidenti critici.",
    tags: ["account manager", "CSM", "enterprise", "dedicato", "supporto", "customer success"],
  },
  {
    id: "b2b_30", cat: "b2b",
    q: "Qual è l'uptime SLA garantito contrattualmente?",
    a: "Piano Professional: SLA target 99.5% uptime mensile (massimo ~3.6 ore di downtime/mese). Piano Enterprise: SLA 99.9% uptime mensile (massimo ~43 minuti di downtime/mese) garantito contrattualmente con penali in caso di mancato rispetto. Il calcolo esclude le finestre di manutenzione programmate (comunicata con 72h di anticipo). La status page con uptime storico in tempo reale è disponibile su status.vinoinvest.com.",
    tags: ["SLA", "uptime", "99.9%", "enterprise", "contrattuale", "downtime", "manutenzione"],
  },

  // ── B2B — Cantine e produttori ───────────────────────────────────────────
  {
    id: "c1", cat: "cantina",
    q: "Come posso listare i miei vini su VinoInvest?",
    a: "Registra un account cantina (account_type=cantina), accedi alla Dashboard B2B → Gestione Vini → Aggiungi vino. Il team verifica i dati entro 48h.",
    tags: ["listare", "cantina", "dashboard", "aggiungere"],
  },
  {
    id: "c2", cat: "cantina",
    q: "Come funziona l'analytics per le cantine?",
    a: "La dashboard B2B mostra: quanti utenti hanno visto i tuoi vini, click su 'Acquista', prezzo medio mercato vs tuo listino, ROI medio degli investitori sui tuoi vini.",
    tags: ["analytics", "cantina", "dashboard", "statistiche"],
  },
  {
    id: "c3", cat: "cantina",
    q: "Posso aggiornare i prezzi in tempo reale?",
    a: "Sì, dalla Dashboard B2B → Gestione Vini puoi aggiornare prezzo e disponibilità. Le modifiche sono visibili immediatamente su tutta la piattaforma.",
    tags: ["prezzi", "aggiornare", "tempo reale", "cantina"],
  },
  {
    id: "c4", cat: "cantina",
    q: "Come posso contattare i miei investitori?",
    a: "Dashboard B2B → Clienti mostra la lista degli investitori che hanno i tuoi vini nel portfolio. Puoi inviare loro comunicazioni tramite la piattaforma.",
    tags: ["investitori", "contattare", "comunicazioni", "clienti"],
  },
  {
    id: "c5", cat: "cantina",
    q: "Quali dati analytics sono disponibili?",
    a: "Volume di visualizzazioni settimanali, conversion rate (visualizzazioni → click acquisto), confronto prezzo mercato vs listino, trend interesse per annata e tipologia.",
    tags: ["analytics", "dati", "conversion", "trend", "visualizzazioni"],
  },

  // ── B2B — Wealth manager ─────────────────────────────────────────────────
  {
    id: "w1", cat: "wealth",
    q: "Come posso gestire i portfolio dei miei clienti?",
    a: "Con account wealth_manager puoi creare portfolio separati per ogni cliente, monitorare performance aggregate, esportare report personalizzati in PDF.",
    tags: ["wealth manager", "clienti", "portfolio", "report"],
  },
  {
    id: "w2", cat: "wealth",
    q: "È possibile integrare VinoInvest con altri sistemi di portfolio management?",
    a: "Sì, offriamo API REST documentata e export CSV/Excel compatibile con Bloomberg, Advent Geneva, e i principali PMS.",
    tags: ["integrazione", "API", "Bloomberg", "PMS", "CSV"],
  },
  {
    id: "w3", cat: "wealth",
    q: "Come funziona la reportistica per i clienti finali?",
    a: "Dashboard B2B → Report genera PDF branded con: composizione portfolio, performance YTD, confronto benchmark, raccomandazioni AI, outlook mercato.",
    tags: ["report", "PDF", "performance", "YTD", "clienti"],
  },
  {
    id: "w4", cat: "wealth",
    q: "Quali sono i prezzi per account B2B?",
    a: "I piani B2B partono da €500/mese per fino a 10 clienti, €1.500/mese per fino a 50 clienti, enterprise su misura. Contatta sales@vinoinvest.com",
    tags: ["prezzi", "piani", "B2B", "costo", "enterprise"],
  },
  {
    id: "w5", cat: "wealth",
    q: "Come gestisco il rischio valuta per clienti internazionali?",
    a: "VinoInvest mostra prezzi in EUR, USD e GBP aggiornati in tempo reale. Per hedge valutario consigliamo di consultare il proprio desk FX.",
    tags: ["valuta", "rischio", "internazionale", "EUR", "USD", "GBP"],
  },

  // ── B2B — Compliance e legale ────────────────────────────────────────────
  {
    id: "co1", cat: "compliance",
    q: "VinoInvest è regolamentato?",
    a: "VinoInvest è una piattaforma di analisi e intelligence, non un gestore patrimoniale. Non richiede licenza MiFID II. Gli acquisti avvengono su piattaforme terze regolamentate.",
    tags: ["regolamentato", "MiFID", "compliance", "licenza"],
  },
  {
    id: "co2", cat: "compliance",
    q: "Come trattate i dati dei clienti (GDPR)?",
    a: "Siamo conformi GDPR. I dati sono conservati in EU (Supabase EU region). Diritto alla cancellazione disponibile dalle impostazioni account. DPA disponibile per clienti B2B.",
    tags: ["GDPR", "dati", "privacy", "EU", "DPA"],
  },
  {
    id: "co3", cat: "compliance",
    q: "È possibile ottenere un Data Processing Agreement?",
    a: "Sì, per clienti B2B forniamo DPA standard EU. Contatta legal@vinoinvest.com con i vostri requisiti specifici.",
    tags: ["DPA", "data processing", "agreement", "B2B", "legale"],
  },
  {
    id: "co4", cat: "compliance",
    q: "Come vengono verificati i prezzi?",
    a: "I prezzi vengono da fonti multiple: dati storici di mercato, CellarTracker community, stime algoritmiche per regione. Badge 'Dati reali' vs 'Dati stimati' indicano la fonte.",
    tags: ["prezzi", "verificati", "fonti", "CellarTracker", "badge"],
  },

  // ── B2B — Tecnico e integrazione ─────────────────────────────────────────
  {
    id: "t1", cat: "tecnico",
    q: "Avete API pubblica?",
    a: "Sì, API REST documentata disponibile su /api/v1/. Rate limit: 1000 req/giorno per piano free, illimitato per piani B2B. Documentazione Swagger in arrivo.",
    tags: ["API", "pubblica", "REST", "rate limit", "Swagger"],
  },
  {
    id: "t2", cat: "tecnico",
    q: "Quali formati di export supportate?",
    a: "CSV, Excel (XLSX), PDF per report. JSON via API. In sviluppo: integrazione diretta Bloomberg Terminal.",
    tags: ["export", "CSV", "Excel", "PDF", "Bloomberg"],
  },
  {
    id: "t3", cat: "tecnico",
    q: "Qual è l'uptime garantito?",
    a: "Target 99.5% uptime. Il sistema gira su Vercel (frontend) e Render (backend) con monitoring automatico. Status page in arrivo.",
    tags: ["uptime", "SLA", "disponibilità", "Vercel", "Render"],
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

  // ── Rendimenti aggiuntivi ────────────────────────────────────────────────
  {
    id: "r8", cat: "rendimenti",
    q: "Il vino è correlato all'inflazione?",
    a: "Parzialmente sì. Il fine wine tende a conservare il valore reale in periodi di alta inflazione, in particolare i Grand Cru di Borgogna e i Bordeaux Premier Cru che sono prezzati in EUR o GBP. Non è però una copertura garantita.",
    tags: ["inflazione", "correlazione", "copertura", "hedge"],
  },
  {
    id: "r9", cat: "rendimenti",
    q: "Quanto pesa la liquidità nel valutare un investimento in vino?",
    a: "Molto. Il vino non è liquido come un'azione. Vendere può richiedere settimane o mesi. Prediligi vini con mercato attivo (Bordeaux Premier Cru, Borgogna Grand Cru) se prevedi di liquidare entro 3-5 anni.",
    tags: ["liquidità", "vendita", "tempo", "mercato attivo"],
  },
  {
    id: "r10", cat: "rendimenti",
    q: "Cosa sono i vini 'cult' e perché rendono di più?",
    a: "Vini prodotti in quantità minime da produttori iconici: Screaming Eagle (800 casse/anno), Romanée-Conti (450 casse/anno), Le Pin (~400 casse). La scarsità artificiale genera domanda > offerta, spingendo i prezzi in modo esponenziale.",
    tags: ["cult", "scarsità", "Screaming Eagle", "Le Pin", "DRC", "quantità"],
  },

  // ── Come funziona aggiuntivi ─────────────────────────────────────────────
  {
    id: "f10", cat: "funziona",
    q: "Come funziona la sezione AI Portfolio?",
    a: "Inserisci il tuo budget, orizzonte temporale e preferenza di rischio. L'algoritmo seleziona una combinazione ottimale di vini diversificati per regione, annata e profilo di rischio/rendimento. I suggerimenti si aggiornano con i movimenti di mercato.",
    tags: ["AI portfolio", "allocazione", "budget", "rischio", "diversificazione"],
  },
  {
    id: "f11", cat: "funziona",
    q: "Come sono calcolati i 'market trend' (Bull/Bear/Neutral)?",
    a: "Il trend è calcolato comparando il prezzo attuale con la media mobile a 90 giorni e il momentum a 30 giorni. Bull = +5% su 90gg, Bear = -5%, Neutral = tra i due. Basato su dati storici reali dove disponibili.",
    tags: ["market trend", "bull", "bear", "neutral", "calcolo", "media mobile"],
  },
  {
    id: "f12", cat: "funziona",
    q: "Cosa fa l'AI Advisor nella chat?",
    a: "L'AI Advisor analizza il tuo portfolio, risponde a domande su vini specifici, fornisce analisi di mercato e suggerisce ottimizzazioni. È alimentato da Claude (Anthropic). Non fornisce consulenza finanziaria regolamentata.",
    tags: ["AI advisor", "chat", "claude", "analisi", "consigli"],
  },
  {
    id: "f13", cat: "funziona",
    q: "Cos'è il VinoInvest Index?",
    a: "Un indice proprietario che aggrega 150 vini fine selezionati per liquidità, qualità e distribuzione geografica (Bordeaux 35%, Borgogna 25%, Italia 20%, resto del mondo 20%). Mostra la performance aggregata del mercato fine wine.",
    tags: ["index", "indice", "150", "composizione", "benchmark"],
  },

  // ── Portfolio aggiuntivi ─────────────────────────────────────────────────
  {
    id: "p10", cat: "portfolio",
    q: "Posso importare un portfolio esistente?",
    a: "Sì, puoi importare via CSV (template scaricabile dalla Dashboard). Campi: nome_vino, produttore, annata, quantità, prezzo_acquisto, data_acquisto. Il sistema abbina automaticamente ai vini nel database.",
    tags: ["importare", "CSV", "template", "esistente", "migrazione"],
  },
  {
    id: "p11", cat: "portfolio",
    q: "Come funziona la sezione 'Diversificazione'?",
    a: "Mostra la distribuzione del tuo portfolio per tipologia (rosso/bianco/spumante/dolce) e per vino singolo. Idealmente: max 20-25% su un singolo vino, almeno 3 regioni diverse, mix di annate.",
    tags: ["diversificazione", "distribuzione", "regioni", "tipologia", "bilanciamento"],
  },
  {
    id: "p12", cat: "portfolio",
    q: "Perché il valore del portfolio si aggiorna lentamente?",
    a: "I prezzi fine wine si aggiornano meno frequentemente dei mercati finanziari tradizionali. Il sistema aggiorna i dati ogni 24h per i vini con quotazioni disponibili, ogni 72h per quelli con dati stimati.",
    tags: ["aggiornamento", "lento", "prezzi", "frequenza", "real-time"],
  },

  // ── Acquisti aggiuntivi ──────────────────────────────────────────────────
  {
    id: "a10", cat: "acquisti",
    q: "Conviene comprare vino all'asta o in enoteca?",
    a: "All'asta: prezzi spesso più bassi, ma aggiungi buyer's premium (15-25%) e attenzione alla provenienza. In enoteca: prezzo certo, garanzia condizioni. En primeur: sconto 20-40% ma aspetti 2-3 anni la consegna.",
    tags: ["asta", "enoteca", "buyer premium", "en primeur", "prezzo"],
  },
  {
    id: "a11", cat: "acquisti",
    q: "Cos'è il 'duty-paid' e 'in bond'?",
    a: "'In bond' significa che il vino è in magazzino doganale e non ha ancora pagato accise/IVA — prezzo più basso ma non puoi prenderlo fisicamente. 'Duty-paid' ha già pagato tutti i dazi. Per investimento puro preferisci in bond.",
    tags: ["duty-paid", "in bond", "magazzino", "accise", "IVA", "doganale"],
  },

  // ── Tecnico aggiuntivi ───────────────────────────────────────────────────
  {
    id: "t5", cat: "tecnico",
    q: "Come faccio il white-label di VinoInvest per i miei clienti?",
    a: "Il piano Enterprise include white-label completo: logo, colori, dominio custom. Disponibile per wealth manager e family office. Contatta enterprise@vinoinvest.com per una demo.",
    tags: ["white-label", "enterprise", "custom", "branding", "wealth manager"],
  },
  {
    id: "t6", cat: "tecnico",
    q: "Supportate single sign-on (SSO)?",
    a: "Sì, per piani Enterprise offriamo SAML 2.0 e OAuth 2.0 SSO. Compatibile con Azure AD, Okta, Google Workspace. Setup in 2-3 giorni lavorativi.",
    tags: ["SSO", "SAML", "OAuth", "Azure AD", "Okta", "enterprise"],
  },

  // ── Wealth manager aggiuntivi ─────────────────────────────────────────────
  {
    id: "w6", cat: "wealth",
    q: "È possibile personalizzare i parametri di rischio per ogni cliente?",
    a: "Sì. Per ogni cliente puoi impostare: budget target, orizzonte minimo, soglia di rischio (1-5), regioni preferite ed escluse. L'AI adatta le raccomandazioni al profilo individuale.",
    tags: ["rischio", "personalizzare", "cliente", "profilo", "parametri"],
  },
  {
    id: "w7", cat: "wealth",
    q: "Come gestite la performance attribution?",
    a: "Il report Performance Attribution scompone il rendimento per: selezione vino, timing d'acquisto, effetto annata, effetto regione. Confronto con benchmark Liv-ex Fine Wine 100 e S&P 500.",
    tags: ["performance attribution", "rendimento", "scomposizione", "benchmark", "Liv-ex"],
  },

  // ── Rendimenti — Regioni specifiche ──────────────────────────────────────
  {
    id: "r11", cat: "rendimenti",
    q: "La Borgogna è davvero il miglior investimento in vino?",
    a: "In termini di rendimento puro degli ultimi 20 anni: sì, la Borgogna Grand Cru ha superato tutte le altre regioni. DRC Romanée-Conti 2000 costava €2.000 → oggi €30.000 (+1.400%). Ma l'accesso alle etichette top è quasi impossibile senza allocation. Per chi ha accesso: Borgogna batte tutto. Per chi non ce l'ha: Barolo offre il miglior rapporto qualità/upside.",
    tags: ["borgogna", "rendimento", "DRC", "barolo", "confronto regioni"],
  },
  {
    id: "r12", cat: "rendimenti",
    q: "Il Barolo è una buona alternativa alla Borgogna per investire?",
    a: "Sì. Il Barolo viene sempre più chiamato 'il Pinot Noir del Nebbiolo' dagli investitori. Produttori top come Giacomo Conterno e Bruno Giacosa fanno vini comparabili per longevità (20-40 anni) a prezzi ancora 3-5x inferiori al Borgogna equivalente. Il mercato è in forte crescita specialmente in Asia e USA. Rischio: liquidità ancora inferiore al Bordeaux.",
    tags: ["barolo", "alternativa", "borgogna", "Conterno", "Giacosa", "upside"],
  },
  {
    id: "r13", cat: "rendimenti",
    q: "Il Champagne vintage è un buon investimento?",
    a: "Per alcune etichette sì. Krug Vintage e Dom Pérignon si apprezzano del 5-8% annuo con bassa volatilità. Salon (prodotto solo nelle migliori annate) ha reso oltre il 15% annuo nell'ultimo decennio. Il vantaggio: sono vini più 'leggibili' e riconoscibili per investitori non esperti. La liquidità è buona per le etichette di punta.",
    tags: ["champagne", "vintage", "krug", "dom perignon", "salon", "rendimento"],
  },

  // ── Come funziona — Funzionalità specifiche ───────────────────────────────
  {
    id: "f14", cat: "funziona",
    q: "Come funziona il filtro AI Score > 80 nel Market?",
    a: "Apri il Market, clicca 'Filtri' o 'Filter', e imposta AI Score minimo a 80. Il sistema mostrerà solo i vini classificati come Strong Buy (>80) dall'algoritmo. Combina con filtri per regione o fascia di prezzo per risultati più mirati.",
    tags: ["filtro", "AI score", "80", "strong buy", "market", "ricerca"],
  },
  {
    id: "f15", cat: "funziona",
    q: "Cosa significa il badge 'Dati stimati' vs 'Dati reali'?",
    a: "'Dati reali' = il prezzo viene da Liv-ex, Wine-Searcher o aste documentate. 'Dati stimati' = il prezzo è calcolato dall'algoritmo su vini simili per regione, produttore e annata. I dati stimati sono meno precisi ma permettono di monitorare vini con poca liquidità.",
    tags: ["dati reali", "stimati", "badge", "Liv-ex", "algoritmo", "prezzo"],
  },
  {
    id: "f16", cat: "funziona",
    q: "Come impostare un price alert per un vino?",
    a: "Dal Market, apri la card del vino → clicca l'icona 🔔 o 'Imposta Alerta'. Inserisci il prezzo target (es. 'notificami quando scende sotto €X'). Ricevi notifica via push/email quando il prezzo raggiunge la soglia. Disponibile per account registrati.",
    tags: ["alert", "notifica", "prezzo", "soglia", "push", "email"],
  },

  // ── Portfolio — Gestione avanzata ─────────────────────────────────────────
  {
    id: "p13", cat: "portfolio",
    q: "Come ottimizzare la diversificazione del mio portfolio?",
    a: "Regole base: max 20% su una singola bottiglia, almeno 3 regioni diverse, mix tra vini 'blue chip' (Bordeaux Premier Cru, Borgogna Grand Cru) e vini emergenti (Barolo, Etna), bilanciare annate (alcune vecchie già apprezzate + alcune recenti in fase di crescita). L'AI Portfolio di VinoInvest calcola automaticamente un portafoglio ottimale dato il tuo budget.",
    tags: ["diversificazione", "ottimizzare", "regioni", "blue chip", "bilanciamento"],
  },
  {
    id: "p14", cat: "portfolio",
    q: "Quando è il momento giusto per vendere un vino dal portfolio?",
    a: "Segnali di vendita: (1) il vino ha raggiunto il picco di maturazione — prezzi smettono di crescere, (2) hai realizzato il target di ROI prefissato, (3) la liquidità personale ne ha bisogno, (4) sono cambiate le condizioni di mercato per quella regione/produttore. Evita di vendere in periodi di bassa liquidità (agosto, dicembre). Il grafico storico prezzi aiuta a identificare il trend.",
    tags: ["vendere", "quando", "timing", "ROI", "peak", "liquidità"],
  },

  // ── Acquisti — Guida pratica ──────────────────────────────────────────────
  {
    id: "a12", cat: "acquisti",
    q: "Come trovare vini a buon prezzo su Wine-Searcher?",
    a: "Su Wine-Searcher cerca il vino, poi filtra per 'Best price'. Attenzione: i prezzi più bassi sono spesso da merchant con spedizione internazionale costosa. Valuta il prezzo totale incluso spedizione. Usa Wine-Searcher Pro (abbonamento) per accedere all'istogramma storico prezzi e capire se stai comprando sotto o sopra il fair value.",
    tags: ["wine-searcher", "prezzo", "buon prezzo", "merchant", "spedizione"],
  },
  {
    id: "a13", cat: "acquisti",
    q: "Vale la pena comprare 6 bottiglie (mezza cassa) invece di 12?",
    a: "Dipende dal vino. Per vini da investimento, le casse originali intatte (OWC - Original Wooden Case) valgono di più all'asta: 10-15% premium rispetto a bottiglie sfuse. Se il tuo obiettivo è rivendere, punta su casse complete di 6 o 12. Se l'obiettivo è bere parte e tenere parte, la mezza cassa va bene.",
    tags: ["cassa", "bottiglie", "OWC", "asta", "premium", "mezza cassa"],
  },

  // ── Account — Registrazione e piani ──────────────────────────────────────
  {
    id: "ac1", cat: "account",
    q: "Come mi registro su VinoInvest?",
    a: "Clicca 'Accedi' in alto a destra → Inserisci email e password, oppure usa 'Continua con Google' per accesso istantaneo. L'account base è completamente gratuito. I dati dell'account sono protetti da Supabase (autenticazione di livello bancario).",
    tags: ["registrazione", "account", "accedere", "google", "gratuito"],
  },
  {
    id: "ac2", cat: "account",
    q: "Qual è la differenza tra account gratuito e premium?",
    a: "Gratuito: market completo, watchlist (max 20 vini), portfolio (max 10 posizioni), AI Score su tutti i vini, storico prezzi base. Premium: portfolio illimitato, AI Advisor avanzato, price alerts illimitati, export CSV, report PDF. I piani B2B aggiungono funzionalità per professionisti.",
    tags: ["gratuito", "premium", "differenza", "piano", "funzionalità"],
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

export const B2B_CATEGORIES = [
  { id: "all",        label: "Tutte",            icon: "🔍" },
  { id: "b2b",        label: "Investitori",       icon: "🏦" },
  { id: "cantina",    label: "Cantine",           icon: "🍾" },
  { id: "wealth",     label: "Wealth Manager",    icon: "📊" },
  { id: "compliance", label: "Compliance",        icon: "⚖️" },
  { id: "tecnico",    label: "Tecnico",           icon: "🔧" },
];

export const B2B_CATS = new Set(["b2b","cantina","wealth","compliance","tecnico"]);

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
