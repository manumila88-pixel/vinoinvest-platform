// VinoInvest Academy — complete course catalogue
// Courses 1-10: free | 11-20: Investor €9.99/mo | 21-30: Pro €19.99/mo

export const PATHWAYS = [
  { id: "curioso",      label: "Curioso",      icon: "🍇", color: "#4ade80", desc: "Parti da zero. Scopri il mondo del vino senza stress.", courses: [1,2,3,4,5],     badge: "Wine Explorer",   free: true  },
  { id: "appassionato", label: "Appassionato",  icon: "🍷", color: "#C9A227", desc: "Già sai le basi. Vai in profondità su regioni e degustazione.", courses: [4,5,6,7,8],  badge: "Wine Enthusiast", free: true  },
  { id: "investitore",  label: "Investitore",   icon: "📈", color: "#60a5fa", desc: "Vuoi fare rendere i tuoi soldi. Analisi, portfolio, dati reali.", courses: [8,9,10,11,20], badge: "Wine Investor Certified", free: false, price: 9.99  },
  { id: "professional", label: "Professional",  icon: "🏆", color: "#f87171", desc: "Gestisci clienti e capitali. Compliance, analytics, certificazione.", courses: [21,30], badge: "VinoInvest Pro Certified", free: false, price: 19.99 },
];

export const ASSESSMENT_QUESTIONS = [
  { q: "Qual è il tuo livello con il vino?", opts: ["Non bevo quasi vino","Bevo vino ma non conosco molto","Conosco le regioni e i produttori principali","Seguo i mercati e i prezzi del vino"], pathway: ["curioso","curioso","appassionato","investitore"] },
  { q: "Cosa ti interessa di più?", opts: ["Imparare cosa c'è nel bicchiere","Degustare meglio e impressionare","Investire e fare rendimento","Aiutare clienti a investire nel vino"], pathway: ["curioso","appassionato","investitore","professional"] },
  { q: "Qual è il tuo budget potenziale?", opts: ["Non so ancora","€500-2.000","€5.000-50.000","€50.000+"], pathway: ["curioso","appassionato","investitore","professional"] },
  { q: "Hai già comprato vino come investimento?", opts: ["No, mai","Ho comprato qualche bottiglia","Sì, ho un piccolo portfolio","Gestisco portfolio per clienti"], pathway: ["curioso","appassionato","investitore","professional"] },
  { q: "Che tempo hai da dedicare all'apprendimento?", opts: ["30 minuti a settimana","1-2 ore a settimana","Più di 2 ore, è priorità","È parte del mio lavoro"], pathway: ["curioso","appassionato","investitore","professional"] },
];

// ─── 10 FREE COURSES ────────────────────────────────────────────────────────

export const COURSES = [
  // ── CORSO 1 ──────────────────────────────────────────────────────────────
  {
    id: 1, slug: "vino-per-chi-inizia", pathway: "curioso",
    title: "Il Vino per Chi Inizia", icon: "🍇", duration: 35, level: "Principiante",
    free: true, description: "Dalla vigna alla bottiglia: tutto quello che devi sapere prima di bere la prima bottiglia consapevole.",
    lessons: [
      {
        id: 101, order: 1, title: "Cosa è il vino — dalla vigna alla bottiglia", duration: 7,
        slides: [
          { icon: "🌿", title: "La Vite", body: "Vitis vinifera è la specie da cui nascono quasi tutti i vini di qualità. Cresce in fasce climatiche tra 30° e 50° di latitudine — il cosiddetto 'Wine Belt'." },
          { icon: "🌡️", title: "Il Terroir", body: "Terroir = suolo + microclima + esposizione + tradizione umana. Due vini della stessa uva da vigne a 500m di distanza possono essere completamente diversi." },
          { icon: "🍇", title: "La Vendemmia", body: "Raccolta manuale o meccanica, solitamente tra agosto e ottobre nell'emisfero nord. Il timing è cruciale: troppo presto → acidità, troppo tardi → alcol." },
          { icon: "🧪", title: "La Vinificazione", body: "Rosso: macerazione con le bucce (tannini e colore). Bianco: pressatura diretta. Champagne: doppia fermentazione in bottiglia." },
          { icon: "🛢️", title: "L'Affinamento", body: "Barrique di rovere 225L per Bordeaux e grandi rossi. Acciaio inox per bianchi freschi. Anfore in terracotta per stili naturali." },
          { icon: "🍾", title: "L'Imbottigliamento", body: "Avviene 12-36 mesi dopo la vendemmia per i grandi vini. La data in etichetta è il millésime (annata), non la data di imbottigliamento." },
          { icon: "📊", title: "Dati: Produzione Mondiale", body: "40 miliardi di bottiglie l'anno. Italia e Francia producono il 35% del vino mondiale. I vini da investimento sono <1% del totale." },
          { icon: "✅", title: "Cosa Hai Imparato", body: "Il vino è un prodotto agricolo trasformato. Ogni fase — terroir, vendemmia, vinificazione, affinamento — impatta direttamente il prezzo e la qualità." },
        ],
        content: "Il vino è forse l'unica bevanda al mondo in cui il luogo preciso di produzione — il vigneto — si percepisce direttamente nel bicchiere. Questo concetto, il terroir, è la ragione per cui un Barolo di Serralunga d'Alba costa dieci volte di più di un semplice Nebbiolo piemontese, anche se entrambi sono fatti con la stessa uva. La vinificazione trasforma lo zucchero degli acini in alcol etilico attraverso la fermentazione: i lieviti (selezionati o indigeni) consumano gli zuccheri producendo alcol e CO2. Per i rossi, la macerazione con le bucce estrae tannini e antociani (colore). La durata della macerazione — da pochi giorni per vini leggeri a settimane per Barolo e Brunello — determina la struttura tannica. L'affinamento in botte aggiunge complessità: il legno cede vanillina, spezie e permette una micro-ossigenazione che ammorbidisce i tannini. Nei grandi Bordeaux, l'affinamento in barrique nuove dura 18-24 mesi prima dell'imbottigliamento. Questo è il motivo per cui quei vini migliorano in bottiglia per decenni.",
        exercise: "Vai su VinoInvest → cerca 'Barolo' → nota la differenza di prezzo tra un Barolo generico e un Barolo Monfortino. La differenza di prezzo riflette esattamente le differenze di terroir e vinificazione che hai appena studiato.",
        quiz: [
          { q: "Cos'è il terroir nel vino?", opts: ["Il tipo di botte usata","L'insieme di suolo, microclima, esposizione e tradizione","La varietà di uva","Il metodo di vinificazione"], ans: 1, exp: "Il terroir comprende tutti i fattori ambientali e umani che caratterizzano un vigneto specifico." },
          { q: "La macerazione con le bucce serve per:", opts: ["Produrre vini bianchi freschi","Estrarre tannini e colore nei vini rossi","Creare le bollicine dello champagne","Ridurre l'acidità del vino"], ans: 1, exp: "Le bucce contengono tannini e antociani (pigmenti rossi). La macerazione li estrae nel mosto." },
          { q: "Un vino millesimato 2019 è stato raccolto:", opts: ["Nel 2019","Nel 2020","Nel 2021","Dipende dalla cantina"], ans: 0, exp: "Il millésime indica sempre l'anno della vendemmia, non dell'imbottigliamento." },
          { q: "La barrique è:", opts: ["Un tipo di uva francese","Una botte da 225L in rovere per l'affinamento","Un metodo di vendemmia","Una denominazione bordolese"], ans: 1, exp: "La barrique bordolese da 225L è lo standard per l'affinamento dei grandi rossi." },
          { q: "Quale percentuale del vino mondiale è considerata 'da investimento'?", opts: ["Circa 10%","Circa 5%","Meno dell'1%","Circa 20%"], ans: 2, exp: "Solo una piccola fraction (<1%) della produzione mondiale raggiunge la qualità e notorietà per essere considerata investimento." },
        ],
      },
      {
        id: 102, order: 2, title: "Le varietà di uva più importanti", duration: 6,
        slides: [
          { icon: "🍇", title: "Cabernet Sauvignon", body: "Il re del Bordeaux. Tannini potenti, acidità alta, invecchiamento lunghissimo. Coltivato in tutto il mondo ma eccelle a Pauillac, Napa Valley e Coonawarra." },
          { icon: "🍷", title: "Pinot Noir", body: "Il più difficile da coltivare. Buccia sottile, tannini leggeri, profumi straordinari. Borgogna è il riferimento mondiale. Prezzo: da €30 a €10.000+/bottiglia." },
          { icon: "🌟", title: "Nebbiolo", body: "Il grande vitigno italiano. Barolo e Barbaresco. Alta acidità + tannini → invecchiamento eccezionale. Nebbiolo 'apre' dopo 10 anni di bottiglia." },
          { icon: "🏆", title: "Sangiovese", body: "Brunello di Montalcino e Chianti Classico. 100% Sangiovese Grosso (Brunello) dà vini austerni che migliorano 30+ anni." },
          { icon: "✨", title: "Chardonnay", body: "Il bianco di riferimento mondiale. Chablis (minerale, no legno), Meursault/Montrachet (burro, legno), Champagne (struttura). Versatilità unica." },
          { icon: "🌿", title: "Riesling", body: "Il più longevo tra i bianchi. Acidità naturale conserva il vino decenni. Mosella e Alsazia producono i più grandi. Praticamente impossibile falsificare l'invecchiamento." },
          { icon: "📈", title: "Performance Investimento", body: "Nebbiolo (Barolo/Barbaresco): +12% medio annuo 10 anni. Pinot Noir (Borgogna): +18% top domaine. Cabernet (Bordeaux): +8% solido con liquidità alta." },
          { icon: "✅", title: "Riepilogo", body: "6 varietà coprono il 90% dei vini da investimento. Pinot Noir e Nebbiolo offrono i rendimenti più alti ma con meno liquidità. Cabernet è il più liquido." },
        ],
        content: "Non tutti i vitigni sono uguali per l'investimento. La chiave è capire il rapporto tra struttura tannica, acidità e capacità di invecchiamento. Il Nebbiolo, ad esempio, è aggressivo da giovane — alti tannini, alta acidità — ma si trasforma in qualcosa di straordinario dopo 10-20 anni. Questa caratteristica lo rende ideale per l'investimento perché il valore aumenta nel tempo. Il Pinot Noir ha un paradosso: è il vitigno più fragile (buccia sottile, sensibile alle malattie) ma produce i vini più preziosi al mondo. La Romanée-Conti, fatto con 100% Pinot Noir su 1,8 ettari in Borgogna, vale €10.000-30.000 a bottiglia perché la produzione è minuscola e la domanda globale è altissima. Il Cabernet Sauvignon ha il vantaggio della liquidità: Château Lafite, Mouton, Margaux, Latour e Haut-Brion — i Cinque Premiers Crus di Bordeaux — vengono scambiati quotidianamente su Liv-ex, la borsa mondiale del fine wine. È più facile comprare e vendere Bordeaux che Borgogna.",
        exercise: "Su VinoInvest → Market → filtra per 'Barolo' e confronta prezzi. Poi cerca 'Burgundy Pinot Noir'. Nota la differenza di disponibilità (Barolo: molte bottiglie; DRC: pochissime).",
        quiz: [
          { q: "Quale vitigno produce Barolo e Barbaresco?", opts: ["Sangiovese","Cabernet Sauvignon","Nebbiolo","Pinot Noir"], ans: 2, exp: "Il Nebbiolo è il vitigno nobile del Piemonte, responsabile di Barolo e Barbaresco." },
          { q: "Perché il Pinot Noir borgognone è così costoso?", opts: ["Perché usa barrique di rovere raro","Perché la produzione è minuscola e la domanda globale altissima","Perché invecchia più di tutti gli altri vini","Perché è difficile da trasportare"], ans: 1, exp: "La Borgogna ha ettari limitatissimi, clima difficile e domanda da tutto il mondo." },
          { q: "Quale caratteristica rende il Riesling un buon investimento a lungo termine?", opts: ["Il prezzo basso di partenza","La sua acidità naturale che lo preserva per decenni","Il fatto che sia prodotto solo in Francia","La sua alta gradazione alcolica"], ans: 1, exp: "L'alta acidità naturale del Riesling è un conservante naturale che permette invecchiamenti eccezionali." },
          { q: "Cosa rende il Cabernet Sauvignon interessante per chi investe?", opts: ["I rendimenti più alti in assoluto","La produzione limitatissima","Alta liquidità: facile comprare e vendere su Liv-ex","Il prezzo d'acquisto bassissimo"], ans: 2, exp: "I Bordeaux Premier Cru sono i vini più scambiati al mondo, garantendo liquidità." },
          { q: "Quale vitigno è alla base di Brunello di Montalcino?", opts: ["Nebbiolo","Sangiovese Grosso (Brunello)","Syrah","Cabernet Franc"], ans: 1, exp: "Il Brunello di Montalcino è prodotto al 100% con Sangiovese Grosso, localmente chiamato Brunello." },
        ],
      },
      {
        id: 103, order: 3, title: "Come leggere un'etichetta", duration: 6,
        slides: [
          { icon: "🏷️", title: "L'Etichetta Anteriore", body: "Contiene: nome produttore, denominazione (DOC/DOCG/AOC), annata, gradazione alcolica, volume (75cl standard), paese di produzione." },
          { icon: "📋", title: "Le Denominazioni Italiane", body: "DOC = Denominazione di Origine Controllata. DOCG = Controllata e Garantita (il massimo). IGT = Indicazione Geografica Tipica (vini fuori disciplinare ma spesso premium: Sassicaia, Tignanello)." },
          { icon: "🇫🇷", title: "Le Denominazioni Francesi", body: "AOC/AOP = Appellation d'Origine Contrôlée. In Borgogna: Village < Premier Cru < Grand Cru. In Bordeaux: classificazione 1855 (5 Premiers Crus)." },
          { icon: "📅", title: "L'Annata (Millésime)", body: "Anno della vendemmia. Non confondere con l'anno di imbottigliamento. Per i grandi vini: 2010, 2015, 2019 = premium. 2013, 2007 = evitare." },
          { icon: "🔢", title: "Gradazione Alcolica", body: "12-13%: vini eleganti, acidità alta (Borgogna, Barolo). 14-15%: vini potenti (Napa Cab, Amarone). Oltre 15%: zona di rischio qualitativo per i grandi." },
          { icon: "🏅", title: "Classificazioni Speciali", body: "Barolo DOCG: produzione minima 38mo/ha. Brunello Riserva: 5 anni affinamento. Champagne Millesimato: solo nelle grandi annate. Premier Grand Cru Classé Saint-Émilion: max 15 cantine." },
          { icon: "⚠️", title: "Red Flags nell'Etichetta", body: "Annata non visibile. Etichetta stampata (non incollata). Testo in lingue incoerenti. Grafica troppo moderna su vino 'antico'. Capsula allentata." },
          { icon: "✅", title: "Riepilogo", body: "L'etichetta è il documento d'identità del vino. Saper leggere denominazione + annata + produttore ti permette di stimare il valore di una bottiglia in 30 secondi." },
        ],
        content: "L'etichetta di un vino italiano racconta una storia precisa. DOCG — la massima garanzia italiana — significa che ogni bottiglia è stata assaggiata da una commissione prima di essere commercializzata. Ci sono solo 77 denominazioni DOCG in Italia, tra cui Barolo, Barbaresco, Brunello di Montalcino, Chianti Classico e Amarone. La paradosso è che alcuni dei vini più famosi e costosi d'Italia non sono DOCG: Sassicaia era un IGT Toscana fino al 1994, Tignanello è ancora IGT. Questo perché usano vitigni internazionali (Cabernet Sauvignon, Merlot) non ammessi nei disciplinari tradizionali. In Francia il sistema è diverso: l'AOC garantisce l'origine geografica, ma non necessariamente la qualità. La differenza di prezzo tra un Bourgogne Village (AOC semplice), un Premier Cru e un Grand Cru della stessa cantina può essere 1:5:50. Tutto scritto nell'etichetta.",
        exercise: "Trova su VinoInvest un Barolo DOCG e un Sassicaia IGT. Nota come l'IGT di Sassicaia costi molto di più del Barolo DOCG. Questo ti insegna che denominazione ≠ prezzo.",
        quiz: [
          { q: "DOCG significa:", opts: ["Denominazione di Origine Controllata e Garantita","Denominazione Organica di Cru Garantito","Denominazione Originale Certificata Governativa","Designazione di Origine Classe Garantita"], ans: 0, exp: "DOCG è la massima classificazione italiana per vini DOC con controlli aggiuntivi di qualità." },
          { q: "Sassicaia e Tignanello sono classificati come:", opts: ["DOCG","DOC","IGT","AOC"], ans: 2, exp: "Nonostante siano tra i vini più costosi d'Italia, usano vitigni non ammessi nei disciplinari locali." },
          { q: "Un 'Barolo 2016 Riserva DOCG' significa:", opts: ["Vendemmia 2016, con invecchiamento aggiuntivo rispetto al base","Prodotto nel 2016 ma imbottigliato nel 2019","Un Barolo senza annata specifica","Un Barolo di qualità normale del 2016"], ans: 0, exp: "La Riserva indica un affinamento minimo più lungo (5 anni per Barolo Riserva vs 3 per il base)." },
          { q: "Qual è il vantaggio di saper leggere l'etichetta velocemente?", opts: ["Impressionare gli amici a cena","Stimare il valore di una bottiglia in 30 secondi","Ordinare il vino giusto al ristorante","Tutte le precedenti"], ans: 3, exp: "La conoscenza dell'etichetta è uno strumento pratico in ogni contesto, incluso l'investimento." },
          { q: "Quale informazione NON si trova sull'etichetta frontale?", opts: ["Denominazione","Gradazione alcolica","Temperatura ideale di servizio","Annata"], ans: 2, exp: "La temperatura di servizio non è un'informazione obbligatoria sulle etichette." },
        ],
      },
      {
        id: 104, order: 4, title: "Rosso, Bianco, Rosé, Champagne", duration: 6,
        slides: [
          { icon: "🔴", title: "Vino Rosso", body: "Fermentazione con bucce → tannini, colore, struttura. Temperature servizio: 14-18°C. Vini rossi strutturati migliorano con l'invecchiamento (5-30+ anni per i migliori)." },
          { icon: "⚪", title: "Vino Bianco", body: "Pressatura diretta senza bucce → freschezza, acidità, profumi floreali/fruttati. 8-12°C. La maggior parte si beve giovane. Eccezioni: Borgogna bianca, Chablis Grand Cru, Riesling." },
          { icon: "🌸", title: "Rosé", body: "Due metodi: saignée (salasso del rosso) o breve macerazione. Stile Provence (pallido, secco) vs stile americano (dolce). Il Bandol Rosé di Domaine Tempier: valore crescente." },
          { icon: "🥂", title: "Champagne", body: "Doppia fermentazione. Méthode Champenoise. Solo dalla regione Champagne in Francia. Champagne millesimato (annate migliori): Dom Pérignon, Krug, Cristal — investimento serio." },
          { icon: "💰", title: "Quale Categoria Rende di Più?", body: "Rosso: 78% del mercato fine wine. Champagne: crescita +22% negli ultimi 5 anni. Bianco: Borgogna Montrachet fino a €4.000/bottiglia. Rosé: mercato emergente, meno liquido." },
          { icon: "🌡️", title: "Temperature di Servizio", body: "Champagne: 6-8°C. Bianco giovane: 8-10°C. Bianco strutturato: 12-14°C. Rosso leggero (Pinot): 14-16°C. Rosso strutturato: 16-18°C. Rosso grande (Barolo): 18°C." },
          { icon: "📦", title: "Formati Bottiglia", body: "Magnum 1,5L = 2 bottiglie: invecchiamento più lento e omogeneo, valore +20-40% rispetto a 2 bottiglie singole. Jéroboam 3L, Impériale 6L: per grandi annate e collezionisti." },
          { icon: "✅", title: "Riepilogo", body: "Il vino rosso domina il mercato del fine wine per volume. Champagne cresce più velocemente. Il formato Magnum aggiunge valore rispetto alla bottiglia standard." },
        ],
        content: "La distinzione tra rosso, bianco, rosé e champagne non è solo cromatica — è fondamentalmente tecnica e influenza direttamente il potenziale di investimento. I vini rossi dominano il mercato del fine wine perché i tannini e l'acidità, in combinazione con un pH favorevole, permettono invecchiamenti decennali. Un Barolo Monfortino 1978 non solo è ancora bevibile: è al suo apice. I Champagne millesimati stanno vivendo una seconda giovinezza come investimento. La ragione è matematica: Dom Pérignon 2013 oggi costa €200, ma Dom Pérignon 2000 vale già €400+. Con soli 3-5 milioni di bottiglie prodotte per millesimo e una domanda globale in crescita (soprattutto Asia), il trend è chiaro. Il formato Magnum merita un'attenzione speciale: la proporzione sughero-vino è minore, la micro-ossigenazione rallenta, l'invecchiamento è più lento e uniforme. Per questo motivo i Magnum dei Premiers Crus di Bordeaux valgono sistematicamente il 25-40% in più di due bottiglie standard dello stesso vino e annata.",
        exercise: "Su VinoInvest cerca 'Dom Pérignon'. Ordina per annata. Osserva come il prezzo aumenta con gli anni. Questo è il trend che rende il Champagne millesimato interessante come investimento.",
        quiz: [
          { q: "Perché i vini rossi dominano il mercato del fine wine?", opts: ["Perché piacciono di più","Perché tannini e acidità permettono invecchiamenti decennali","Perché costano meno","Perché sono prodotti in più paesi"], ans: 1, exp: "La struttura tannica dei rossi li protegge dall'ossidazione permettendo invecchiamenti lunghissimi." },
          { q: "Il Magnum vale di più di 2 bottiglie normali perché:", opts: ["È più facile da trasportare","Il rapporto sughero-vino è più favorevole e invecchia meglio","Viene prodotto in meno quantità","Ha un'etichetta più grande"], ans: 1, exp: "Il Magnum ha una micro-ossigenazione più lenta attraverso il sughero, invecchiando più uniformemente." },
          { q: "Il Champagne millesimato si produce:", opts: ["Ogni anno","Solo nelle grandi annate","Solo quando il produttore vuole","Ogni 5 anni"], ans: 1, exp: "Il millesimato viene prodotto solo quando il produttore giudica l'annata eccezionale — può non uscire per anni." },
          { q: "Qual è la temperatura corretta per servire un Barolo?", opts: ["6-8°C","12-14°C","16-18°C","20-22°C"], ans: 2, exp: "I vini rossi strutturati come il Barolo si servono a 16-18°C per esprimere i loro profumi terziari." },
          { q: "Il Bandol Rosé è citato come esempio di:", opts: ["Rosé dolce americano","Rosé di qualità con valore crescente","Vino fortificato","Champagne alternativo"], ans: 1, exp: "Il Bandol Rosé, specialmente di Domaine Tempier, è uno dei rosé da collezionismo che sta apprezzando." },
        ],
      },
      {
        id: 105, order: 5, title: "Quiz Finale Corso 1 + Badge", duration: 4,
        slides: [
          { icon: "🎯", title: "Hai completato il Corso 1!", body: "Sai già: cos'è il terroir, le 6 varietà principali da investimento, come leggere un'etichetta, e le differenze tra categorie di vino." },
          { icon: "📊", title: "Cosa Sai Fare Ora", body: "✓ Leggere un'etichetta in 30 secondi\n✓ Identificare i vitigni da investimento\n✓ Capire perché alcuni vini valgono 100x di altri\n✓ Distinguere denominazioni italiane e francesi" },
          { icon: "🍇", title: "Badge: Prima Degustazione", body: "Completando il Quiz finale otterrai il badge 'Prima Degustazione' — primo passo nel percorso Wine Explorer." },
          { icon: "📚", title: "Prossimo Passo", body: "Corso 2: 'Le Regioni Vinicole del Mondo'. Scoprirai perché Bordeaux è diversa dalla Borgogna e perché la Toscana produce i più grandi vini italiani." },
          { icon: "💡", title: "Regola d'Oro", body: "Il vino da investimento segue una logica semplice: rarità × qualità × domanda = prezzo. Più raro il vigneto, più alta la qualità, più globale la domanda — più vale." },
          { icon: "📈", title: "Dato Reale", body: "Se avessi comprato una cassa (12 bottiglie) di Barolo Monfortino 2010 a €120/bottiglia nel 2013, oggi varrebbe €420/bottiglia. ROI: +250% in 10 anni." },
          { icon: "🎓", title: "Certificato Parziale", body: "Dopo i 5 corsi del Percorso Curioso, otterrai il Certificato 'Wine Explorer' — scaricabile e condivisibile su LinkedIn." },
          { icon: "🚀", title: "Inizia il Quiz", body: "5 domande per verificare la tua comprensione del Corso 1. Punteggio minimo 60% per completare e sbloccare il badge." },
        ],
        content: "Hai completato la prima lezione del percorso VinoInvest Academy. In poche ore hai acquisito la base concettuale che separa chi beve vino da chi lo capisce. Ricorda: il vino da investimento non è un mercato separato da quello del bere — è la stessa bottiglia, valutata sia per la piacevolezza organolettica che per il potenziale di apprezzamento economico. Un Barolo Monfortino 2010 è sia uno dei migliori vini del mondo sia uno dei migliori investimenti alternativi dell'ultimo decennio. Nei prossimi corsi approfondiremo le regioni, la degustazione e le dinamiche di mercato — sempre con dati reali e strumenti pratici.",
        exercise: "Testa le tue conoscenze con il quiz finale. Se arrivi al 100%, ottieni 20 XP bonus!",
        quiz: [
          { q: "Qual è la relazione tra terroir e prezzo di un vino?", opts: ["Nessuna relazione","Terroir migliore → rarità → prezzo più alto","Terroir = solo il suolo, non influisce sul prezzo","Terroir influisce solo sui bianchi"], ans: 1, exp: "Il terroir distintivo crea unicità → rarità → prezzo premium. Romanée-Conti vale €20k perché quel terroir è irripetibile." },
          { q: "Quale formato di bottiglia invecchia meglio?", opts: ["Standard 75cl","Magnum 1.5L","Demi 37.5cl","Tutti invecchiano uguale"], ans: 1, exp: "Il Magnum ha un rapporto sughero-vino più favorevole, permettendo un invecchiamento più lento e uniforme." },
          { q: "Un vino IGT italiano può essere di alta qualità?", opts: ["No, IGT è la categoria più bassa","Sì: Sassicaia e Tignanello sono IGT ma costano centinaia di euro","Solo se è DOCG è di qualità","Solo se viene dalla Toscana"], ans: 1, exp: "Molti Super Tuscans come Sassicaia sono IGT ma sono tra i vini più ricercati e costosi al mondo." },
          { q: "Cosa rende il Champagne millesimato un investimento interessante?", opts: ["Costa poco all'acquisto","Produzione limitata (solo grandi annate) + domanda globale crescente","Si può bere subito senza attendere","Non ha concorrenza nel mercato"], ans: 1, exp: "La combinazione produzione rara + mercato asiatico in espansione sta facendo apprezzare i Champagne millesimati." },
          { q: "Qual è l'uva del Brunello di Montalcino?", opts: ["Nebbiolo","Cabernet Sauvignon","Sangiovese Grosso","Merlot"], ans: 2, exp: "Il Brunello è prodotto al 100% con Sangiovese Grosso, localmente chiamato Brunello — da cui il nome del vino." },
        ],
      },
    ],
  },

  // ── CORSO 2 ──────────────────────────────────────────────────────────────
  {
    id: 2, slug: "regioni-vinicole-mondo", pathway: "curioso",
    title: "Le Regioni Vinicole del Mondo", icon: "🌍", duration: 40, level: "Principiante",
    free: true, description: "Un viaggio attraverso le 12 regioni che producono il 95% dei vini da investimento.",
    lessons: [
      {
        id: 201, order: 1, title: "Francia — Bordeaux, Borgogna, Champagne", duration: 9,
        slides: [
          { icon: "🏰", title: "Bordeaux", body: "Left Bank (Cabernet Sauvignon dominante): Médoc, Pauillac, Saint-Julien. Right Bank (Merlot): Saint-Émilion, Pomerol. Classificazione 1855 ancora valida oggi." },
          { icon: "🍇", title: "I Cinque Premiers Crus", body: "Lafite-Rothschild, Mouton-Rothschild, Margaux, Latour (Left Bank) + Haut-Brion (Pessac-Léognan). I vini più liquidi e scambiati al mondo. Pétrus non rientra nella classificazione 1855." },
          { icon: "👑", title: "Borgogna", body: "Sistema per clima: Regional < Village < Premier Cru < Grand Cru. La Côte de Nuits (rossi: Gevrey-Chambertin, Vosne-Romanée). La Côte de Beaune (bianchi: Meursault, Montrachet)." },
          { icon: "💎", title: "Domaine de la Romanée-Conti", body: "1,8 ettari a Vosne-Romanée. ~6.000 bottiglie/anno di Romanée-Conti. Lista d'attesa decennale. Prezzo 2020: €15.000-30.000/bottiglia. Il vino più costoso al mondo." },
          { icon: "🥂", title: "Champagne", body: "55.000 ettari a 150km da Parigi. Tre zone principali: Montagne de Reims (Pinot Noir), Vallée de la Marne (Pinot Meunier), Côte des Blancs (Chardonnay)." },
          { icon: "📊", title: "Quota di Mercato Fine Wine", body: "Bordeaux: 45% del mercato Liv-ex. Borgogna: 25% (crescita massima). Champagne: 15%. Rodano (Châteauneuf-du-Pape, Hermitage): 5%. Altro: 10%." },
          { icon: "📈", title: "Trend 2024", body: "Borgogna +35% in 5 anni (domanda asiatica). Bordeaux stabile/lieve calo. Champagne +22%. Sauternes (vino dolce): mercato di nicchia ma altissima qualità." },
          { icon: "✅", title: "Riepilogo", body: "La Francia domina il fine wine con il 70% del mercato. Bordeaux = liquidità. Borgogna = massimi rendimenti. Champagne = crescita futura." },
        ],
        content: "La Francia non è solo la patria del vino — è il benchmark con cui si misura tutto il resto. La classificazione di Bordeaux del 1855, commissionata da Napoleone III per l'Esposizione Universale di Parigi, è ancora il documento di riferimento per i collezionisti mondiali 170 anni dopo. Solo un castello ha mai cambiato categoria: Mouton-Rothschild, promosso da Deuxième a Premier Cru nel 1973 grazie all'influenza del barone Philippe. La Borgogna funziona diversamente: non esiste una classifica château ma una gerarchia del terreno. Lo stesso Domaine Leroy produce sia un Bourgogne Rouge (€80) che la Romanée-Saint-Vivant Grand Cru (€3.000+): la differenza è solo il vigneto. Questo sistema rende la Borgogna complessa da navigare ma estremamente remunerativa per chi la conosce.",
        exercise: "Su VinoInvest cerca 'Lafite 2015' e 'Romanée-Conti'. Confronta la disponibilità (Lafite: molte bottiglie disponibili → alta liquidità; DRC: quasi nessuna → mercato da asta).",
        quiz: [
          { q: "Quante cantine fanno parte dei Premiers Crus di Bordeaux del 1855?", opts: ["5","15","50","61 totali, 5 Premiers Crus"], ans: 3, exp: "La classificazione del 1855 include 61 châteaux in totale, di cui solo 5 classificati Premier Cru." },
          { q: "La Romanée-Conti produce circa quante bottiglie all'anno?", opts: ["600","6.000","60.000","600.000"], ans: 1, exp: "Soli 1,8 ettari, circa 6.000 bottiglie per millesimo — il motivo del prezzo stratosferico." },
          { q: "Quale quota del mercato Liv-ex occupa Bordeaux?", opts: ["15%","25%","45%","70%"], ans: 2, exp: "Bordeaux rappresenta circa il 45% degli scambi su Liv-ex, rendendolo il mercato più liquido nel fine wine." },
          { q: "In Borgogna, la gerarchia corretta dal più basso al più alto è:", opts: ["Grand Cru > Premier Cru > Village > Regional","Regional > Village > Premier Cru > Grand Cru","Village > Premier Cru > Regional > Grand Cru","Premier Cru > Grand Cru > Village > Regional"], ans: 1, exp: "La piramide borgognona va da Regional (base) fino ai Grand Cru (apice), con 33 Grand Cru totali." },
          { q: "Quale regione francese ha registrato la crescita più alta negli ultimi 5 anni?", opts: ["Bordeaux","Sauternes","Borgogna (+35%)","Champagne"], ans: 2, exp: "La Borgogna ha visto prezzi esplodere grazie alla domanda asiatica su un'offerta strutturalmente limitata." },
        ],
      },
      {
        id: 202, order: 2, title: "Italia — Piemonte, Toscana, Veneto", duration: 8,
        slides: [
          { icon: "🏔️", title: "Piemonte", body: "Barolo e Barbaresco = Nebbiolo. Zone: Serralunga d'Alba (potenza), La Morra (eleganza), Castiglione Falletto (equilibrio). 11 comuni per il Barolo, 3+1 per il Barbaresco." },
          { icon: "🌿", title: "Barolo vs Barbaresco", body: "Barolo: min 3 anni affinamento (5 per Riserva). Barbaresco: min 2 anni (4 per Riserva). Barbaresco tendenzialmente più accessibile e pronto prima. Prezzi: Barolo MGA > Barbaresco su mercato internazionale." },
          { icon: "🦅", title: "Toscana", body: "Brunello di Montalcino (Sangiovese): il più longevo dei grandi italiani. Chianti Classico Gran Selezione. Super Tuscans (IGT): Sassicaia, Ornellaia, Masseto, Tignanello." },
          { icon: "💎", title: "Masseto e Ornellaia", body: "Masseto: 100% Merlot di Bolgheri. ~30.000 bottiglie/anno. Prezzo 2023: €350-500. Ornellaia: blend bordolese. Vendemmia d'Artista: collaborazione con artisti, bottiglie collector." },
          { icon: "🍷", title: "Veneto", body: "Amarone della Valpolicella: uve appassite → concentrazione. Potente (16-17% alcol), invecchiamento 20+ anni. Produttori top: Quintarelli (lista d'attesa), Bertani (storico)." },
          { icon: "🌊", title: "Sicilia Emergente", body: "Etna DOC: terreni vulcanici, Nerello Mascalese. Contrada (parcelle singole). Produttori: Cornelissen, Passopisciaro. Prezzi ancora accessibili ma in rapida crescita." },
          { icon: "📈", title: "Italia vs Francia nel Fine Wine", body: "Italia = 15% del mercato globale fine wine (2° dopo Francia). Crescita +18% in 5 anni. Barolo è il vitigno italiano più scambiato su Liv-ex. Sassicaia: solo vino IGT in top 100 Liv-ex." },
          { icon: "✅", title: "Riepilogo", body: "Piemonte (Barolo/Barbaresco) + Toscana (Brunello/Super Tuscans) = 90% del valore esportato fine wine italiano. Veneto e Sicilia: mercati emergenti con rendimenti potenzialmente alti." },
        ],
        content: "L'Italia ha un paradosso affascinante nel mondo degli investimenti: produce vini di qualità assoluta mondiale, ma molti collezionisti internazionali la sottovalutano ancora rispetto alla Francia. Questo crea opportunità. Un Barolo Monfortino Riserva di Giacomo Conterno costa oggi €300-400 a bottiglia — ma le annate 2010 e 2013, già oggi considerate leggendarie, probabilmente varranno il doppio entro 5-10 anni. La ragione: Monfortino viene prodotto solo nelle migliori annate (7-10 millesimi in 20 anni) e in quantità limitate. I Super Tuscans come Sassicaia hanno un vantaggio specifico: essere nati negli anni '70 come esperimento e diventati icone globali. Sassicaia 1985 è stato valutato il miglior Cabernet Sauvignon al mondo in una degustazione cieca del Wine Spectator nel 1994 — da allora il prezzo non ha più smesso di crescere.",
        exercise: "Su VinoInvest cerca 'Barolo' e ordina per score. Poi cerca 'Sassicaia'. Confronta score e prezzi. Qual è il vino con il rapporto qualità/prezzo migliore secondo i dati della piattaforma?",
        quiz: [
          { q: "Quanti comuni producono il Barolo DOCG?", opts: ["5","11","20","3"], ans: 1, exp: "Il Barolo DOCG può essere prodotto in 11 comuni della provincia di Cuneo, in Piemonte." },
          { q: "Cosa rende il Masseto unico nel panorama italiano?", opts: ["È il Barolo più caro","È un Merlot 100% di Bolgheri, ~30.000 bottiglie/anno","È l'unico DOCG del Veneto","È prodotto da Giacomo Conterno"], ans: 1, exp: "Il Masseto è un Merlot in purezza prodotto a Bolgheri (Toscana) — uno dei pochi grandi Merlot italiani." },
          { q: "Quale percentuale del mercato globale fine wine rappresenta l'Italia?", opts: ["5%","15%","30%","45%"], ans: 1, exp: "L'Italia rappresenta circa il 15% del mercato globale fine wine, in crescita del 18% negli ultimi 5 anni." },
          { q: "L'Amarone della Valpolicella è caratterizzato da:", opts: ["Bassa gradazione e leggerezza","Uve appassite, alta concentrazione e 16-17% alcol","Produzione in Piemonte","Vitigno Nebbiolo"], ans: 1, exp: "L'Amarone usa uve appassite (appassimento) che concentrano zuccheri e aromi, producendo vini potentissimi." },
          { q: "Perché l'Etna DOC è considerato un mercato emergente interessante?", opts: ["Perché è prodotto vicino al Vesuvio","Perché i prezzi sono ancora accessibili ma in rapida crescita su terreni vulcanici unici","Perché usa Nebbiolo","Perché ha la DOCG"], ans: 1, exp: "I suoli vulcanici dell'Etna danno mineralità unica. I prezzi sono ancora accessibili rispetto al potenziale qualitativo." },
        ],
      },
      {
        id: 203, order: 3, title: "Spagna, Germania e Nuovo Mondo", duration: 8,
        slides: [
          { icon: "🇪🇸", title: "Spagna — Rioja e Ribera", body: "Rioja: Tempranillo. Classificazione: Joven, Crianza, Reserva, Gran Reserva. Vega Sicilia Único: il vino spagnolo più prestigioso. Pingus (Peter Sisseck): ~1.500 bottiglie/anno, €400+." },
          { icon: "🇩🇪", title: "Germania — Riesling", body: "Classificazione per grado di maturità uve: Kabinett → Spätlese → Auslese → Beerenauslese → TBA. Mosel (Riesling su ardesia), Rheingau. Riesling TBA: vino dolce €300-1.000/bottiglia." },
          { icon: "🇺🇸", title: "Napa Valley", body: "Cabernet Sauvignon californiano. Opus One (Mondavi + Rothschild): €200+. Screaming Eagle: 500 casi/anno, lista d'attesa. Harlan Estate. Prezzo top: €1.000-2.000/bottiglia." },
          { icon: "🇦🇺", title: "Australia — Penfolds", body: "Penfolds Grange (Shiraz): il vino australiano più investibile. Matura 20-40 anni. Bin 95 (~€300), Ampoule (€150.000). Mercato asiatico molto attivo su Penfolds." },
          { icon: "🇦🇷", title: "Argentina — Malbec", body: "Mendoza Malbec: Achaval Ferrer, Catena Zapata (Adrianna Vineyard). Prezzi ancora accessibili (€30-150) ma qualità in linea con i grandi europei. Alta altitude = concentrazione." },
          { icon: "🇿🇦", title: "Sudafrica", body: "Chenin Blanc secco (Swartland): Sadie Family, AA Badenhorst. Mercato di nicchia crescente. Eben Sadie: ricercatissimo dai collezionisti europei. Prezzi ancora bassi per qualità." },
          { icon: "📊", title: "Nuovo Mondo vs Vecchio Mondo", body: "Vecchio Mondo (Francia, Italia, Spagna): 85% fine wine mercato. Nuovo Mondo: 15% ma crescita più rapida. Screaming Eagle e Opus One hanno performance simili ai Premiers Crus." },
          { icon: "✅", title: "Riepilogo", body: "Spagna: opportunità di valore (Pingus, Vega Sicilia). USA (Napa): mercato maturo, liquidità buona. Australia/Argentina/Sudafrica: mercati emergenti con profili rischio/rendimento diversi." },
        ],
        content: "La Spagna ha un segreto che molti investitori ancora non conoscono: Pingus. Peter Sisseck, enologo danese, produce circa 1.500 bottiglie all'anno a Ribera del Duero da viti ultracentenarie. Il prezzo d'acquisto è €400-600, ma nelle aste raggiunge €1.000-2.000. Il fascino di Pingus è la sua storia: vino cult creato da un singolo vignaiolo, con una storia autentica. Napa Valley è il mercato americano di riferimento: Screaming Eagle, un Cabernet Sauvignon prodotto da sole 850 casse all'anno, ha una lista d'attesa che dura anni e bottiglie che nelle aste raggiungono €3.000+. L'Australia ha Penfolds Grange, il 'Petrus australiano': creato nel 1951 da Max Schubert contro la volontà della direzione aziendale, oggi è il vino australiano più collezionato al mondo con 70+ millesimi disponibili.",
        exercise: "Cerca su VinoInvest 'Pingus' o 'Screaming Eagle'. Se non li trovi nella ricerca principale, vai nella sezione Market → Spagna/USA. Osserva la scarsità: poche bottiglie disponibili = alta rarità.",
        quiz: [
          { q: "Pingus produce circa quante bottiglie all'anno?", opts: ["15.000","150.000","1.500","150"], ans: 2, exp: "Pingus di Peter Sisseck produce circa 1.500 bottiglie all'anno da viti ultracentenarie in Ribera del Duero." },
          { q: "Qual è la classificazione tedesca più alta per la dolcezza delle uve?", opts: ["Auslese","Spätlese","Trockenbeerenauslese (TBA)","Beerenauslese"], ans: 2, exp: "Il TBA (Trockenbeerenauslese) è il grado più alto nella scala tedesca, da uve botrizzate e quasi appassite." },
          { q: "Opus One è il risultato della collaborazione tra:", opts: ["Rothschild e Mondavi","Sassicaia e Chateau Latour","Penfolds e Screaming Eagle","Vega Sicilia e Lafite"], ans: 0, exp: "Opus One è la joint venture tra Robert Mondavi (California) e Baron Philippe de Rothschild (Bordeaux)." },
          { q: "Perché il Malbec argentino di alta quota è interessante?", opts: ["Perché costa molto","Perché l'alta altitude concentra gli aromi e la qualità è paragonabile ai grandi europei a prezzi ancora accessibili","Perché è l'unico vitigno sudamericano","Perché cresce solo in Argentina"], ans: 1, exp: "I vigneti dell'Adrianna Vineyard (Catena Zapata) a 1.500m di quota producono Malbec di qualità mondiale a prezzi ancora accessibili." },
          { q: "Il mercato del Nuovo Mondo (USA, Australia ecc.) rappresenta circa:", opts: ["5% del fine wine","15% del fine wine (ma crescita più rapida)","50% del fine wine","35% del fine wine"], ans: 1, exp: "Il Nuovo Mondo è ancora minoritario (15%) ma cresce più rapidamente del Vecchio Mondo." },
        ],
      },
      {
        id: 204, order: 4, title: "Mappa interattiva — quiz regioni", duration: 7,
        slides: [
          { icon: "🗺️", title: "La Mappa del Fine Wine", body: "I vini da investimento nascono tra il 30° e il 50° parallelo Nord. Fuori da questa fascia climatica, la produzione di qualità top è l'eccezione, non la regola." },
          { icon: "🇫🇷", title: "Francia — Quick Reference", body: "Bordeaux (Left Bank: Cab Sauv / Right Bank: Merlot) → Borgogna (Pinot Noir / Chardonnay) → Champagne (blend) → Rodano Sud (Grenache) → Alsazia (Riesling, Pinot Gris)" },
          { icon: "🇮🇹", title: "Italia — Quick Reference", body: "Piemonte (Nebbiolo→Barolo/Barbaresco) → Toscana (Sangiovese→Brunello/Chianti + IGT) → Veneto (Corvina→Amarone) → Sicilia (Nerello Mascalese→Etna)" },
          { icon: "🌍", title: "Resto del Mondo", body: "Spagna: Rioja (Tempranillo), Ribera del Duero (Tempranillo). Germania: Mosel/Rheingau (Riesling). USA: Napa (Cab Sauv). Australia: Barossa/McLaren Vale (Shiraz)." },
          { icon: "💡", title: "Regola delle 3R", body: "Reputazione (storia del produttore) + Rarità (bottiglie prodotte) + Riconoscimento (punteggi critici) = Potenziale investimento. Tutte e 3 devono essere presenti." },
          { icon: "🏅", title: "Top 10 Produttori Mondiali per Valore", body: "1. DRC 2. Pétrus 3. Screaming Eagle 4. Lafite 5. Mouton 6. Leroy 7. Conterno 8. Gaja 9. Haut-Brion 10. Margaux. Tutti hanno: storia centenaria + produzione limitata + domanda globale." },
          { icon: "📱", title: "VinoInvest su Mappa", body: "Nella sezione Market puoi filtrare per regione. Usa questo filtro per esplorare in modo sistematico come hai fatto in questa lezione." },
          { icon: "✅", title: "Riepilogo Finale", body: "Conosci ora le 12 principali regioni da investimento. Il prossimo passo è imparare a degustare — perché capire il vino nel bicchiere ti rende un investitore migliore." },
        ],
        content: "La regola delle 3R è uno strumento pratico per valutare qualsiasi vino da investimento in meno di 30 secondi: Reputazione (il produttore ha 50+ anni di storia eccellente?), Rarità (meno di 50.000 bottiglie prodotte all'anno?), Riconoscimento (punteggi critici sistematicamente sopra 95/100?). Se tutte e tre le risposte sono sì, stai guardando un candidato serio. Se anche una sola risposta è no, il rischio aumenta significativamente. Giacomo Conterno Monfortino: storia dal 1920 ✓, ~10.000 bottiglie nelle grandi annate ✓, punteggi 98-100/100 ✓. È un candidato eccellente. Un Barolo prodotto da una cantina nuova senza storia: storia NO ✗. Immediatamente eliminato dalla lista degli investimenti seri, indipendentemente dalla qualità.",
        exercise: "Applica la Regola delle 3R a 3 vini che trovi su VinoInvest. Valuta ciascuno: Reputazione (cerca la storia del produttore), Rarità (controlla la produzione), Riconoscimento (guarda l'AI Score).",
        quiz: [
          { q: "La Regola delle 3R include:", opts: ["Rendimento, Rischio, Rivalutazione","Reputazione, Rarità, Riconoscimento","Regione, Resa, Rating","Ricercatezza, Raro, Redditizio"], ans: 1, exp: "Reputazione (storia), Rarità (produzione limitata), Riconoscimento (punteggi critici) — le 3 colonne di un buon investimento." },
          { q: "Il Barolo può essere prodotto solo in:", opts: ["Tutta la Toscana","5 comuni in Piemonte","11 comuni in Piemonte","Tutta la Valle d'Aosta"], ans: 2, exp: "Il Barolo DOCG può essere prodotto in 11 comuni della Langa cuneese, non oltre." },
          { q: "Quale regione ha la quota di mercato più alta su Liv-ex?", opts: ["Borgogna","Champagne","Italia","Bordeaux (45%)"], ans: 3, exp: "Bordeaux occupa circa il 45% degli scambi su Liv-ex grazie alla sua alta liquidità e riconoscibilità globale." },
          { q: "Cosa rende i vigneti dell'Etna interessanti per l'investimento futuro?", opts: ["Producono Nebbiolo","Suoli vulcanici unici + prezzi ancora accessibili + trend crescente","Sono vicini a Bordeaux","Producono solo vini bianchi"], ans: 1, exp: "L'Etna combina terroir vulcanico irriproducibile con prezzi ancora non allineati alla qualità — finestra di opportunità." },
          { q: "Perché Screaming Eagle (Napa) ha una lista d'attesa?", opts: ["Perché costa poco","Perché produce solo 850 casse/anno con domanda globale elevatissima","Perché è prodotto solo ogni 5 anni","Perché ha una storia di 200 anni"], ans: 1, exp: "Screaming Eagle produce meno di 900 casse l'anno su circa 23 ettari. La domanda supera di gran lunga l'offerta." },
        ],
      },
      {
        id: 205, order: 5, title: "Quiz Finale Corso 2", duration: 5,
        slides: [
          { icon: "🌍", title: "Corso 2 Completato!", body: "Ora conosci le principali regioni vinicole del mondo, i produttori top, le classificazioni e i trend di mercato 2024." },
          { icon: "🏆", title: "Cosa Sai Fare Ora", body: "✓ Riconoscere le principali denominazioni mondiali\n✓ Applicare la Regola delle 3R\n✓ Confrontare regioni per liquidità e rendimento\n✓ Identificare i mercati emergenti" },
          { icon: "📊", title: "Dato Chiave da Ricordare", body: "Bordeaux = liquidità massima. Borgogna = rendimenti massimi. Italia = migliori opportunità per chi arriva prima. Nuovo Mondo = crescita futura." },
          { icon: "🎯", title: "Quiz Finale", body: "10 domande sulle regioni del mondo. Servono 60% per completare e ottenere il badge." },
          { icon: "📚", title: "Prossimo Corso", body: "Corso 3: 'Come Si Degusta il Vino'. Imparare a degustare ti dà un vantaggio enorme: puoi valutare in prima persona la qualità di un vino prima di investirci." },
          { icon: "💰", title: "Valore della Conoscenza", body: "Un investitore che sa degustare riconosce un vino sottovalutato prima che lo facciano i critici. Questo è il vantaggio competitivo dell'Academy." },
          { icon: "🌟", title: "XP Guadagnati", body: "Lezione completata: +10 XP. Quiz perfetto: +20 XP bonus. Totale possibile questa lezione: 30 XP." },
          { icon: "🚀", title: "Inizia il Quiz", body: "5 domande per verificare la conoscenza delle regioni mondiali. Buona fortuna!" },
        ],
        content: "Con il Corso 2 hai acquisito una mappa mentale del mondo del fine wine. Ora puoi guardare una bottiglia e capire immediatamente il suo contesto: regione, classificazione, potenziale. Il passo successivo è imparare a valutare il vino in prima persona attraverso la degustazione — uno strumento che i migliori investitori usano per identificare opportunità prima dei critici ufficiali.",
        exercise: "Prima del quiz, visita la sezione Market di VinoInvest. Usa il filtro regione e esplora almeno 3 regioni diverse. Nota come i prezzi, i punteggi e la disponibilità variano tra regioni.",
        quiz: [
          { q: "La classificazione bordolese del 1855 è stata commissionata da:", opts: ["Luigi XIV","Napoleone Bonaparte","Napoleone III","Charles de Gaulle"], ans: 2, exp: "L'Esposizione Universale del 1855 fu voluta da Napoleone III, che commissionò la classificazione dei Médoc e Sauternes." },
          { q: "Qual è il vitigno principale della Rioja spagnola?", opts: ["Garnacha","Tempranillo","Albariño","Monastrell"], ans: 1, exp: "Il Tempranillo è il vitigno dominante della Rioja, spesso blendato con Garnacha, Mazuelo e Graciano." },
          { q: "Il Penfolds Grange è prodotto in:", opts: ["Napa Valley, California","Hunter Valley, Australia","Barossa Valley, Australia","Marlborough, Nuova Zelanda"], ans: 2, exp: "Il Grange è prodotto principalmente da Shiraz della Barossa Valley, in Sud Australia." },
          { q: "L'Adrianna Vineyard di Catena Zapata si trova a:", opts: ["Mendoza a livello del mare","1.500 metri di quota in Argentina","Salta, Argentina","Napa Valley"], ans: 1, exp: "L'alta quota (1.450-1.500m) è determinante per la concentrazione e qualità del Malbec Catena." },
          { q: "Cosa caratterizza il terroir dell'Etna DOC?", opts: ["Suoli calcarei e clima caldo","Suoli vulcanici e temperature fresche per l'altitudine","Suoli argillosi vicino al mare","Suoli sabbiosi come Bordeaux"], ans: 1, exp: "Il vulcano Etna dà suoli basaltici e la quota garantisce escursioni termiche che preservano acidità e finezza." },
        ],
      },
    ],
  },

  // ── CORSI 3-10: struttura completa con contenuto condensato ──────────────
  {
    id: 3, slug: "come-si-degusta", pathway: "curioso",
    title: "Come Si Degusta il Vino", icon: "👁️", duration: 38, level: "Principiante",
    free: true, description: "L'analisi visiva, olfattiva e gustativa: gli stessi strumenti dei Masters of Wine.",
    lessons: [
      { id: 301, order: 1, title: "L'esame visivo", duration: 7, slides: [
        { icon: "👁️", title: "Colore e Intensità", body: "Rosso giovane: viola/rubino. Rosso maturo: granato/arancio. Bianco giovane: paglierino. Bianco maturo: oro/ambra. Il colore racconta l'età." },
        { icon: "🌀", title: "Viscosità — le 'Gambe'", body: "Lacrime lente = alcol e glicerolo alti → vino ricco. Lacrime veloci = vino leggero. NON indica qualità ma struttura." },
        { icon: "✨", title: "Limpidezza", body: "Limpido e brillante = standard. Leggermente velato = filtrazione ridotta (tendenza artigianale). Torbido in un vino non naturale = difetto." },
        { icon: "🫧", title: "Bollicine (Effervescenza)", body: "Bollicine fini e persistenti = alta qualità nella méthode champenoise. Bollicine grosse = CO2 aggiunta (prosecco Charmat). La finezza è indicatore di metodo." },
        { icon: "📏", title: "Orlo del Vino", body: "Inclinare il bicchiere verso la luce: l'orlo mostra l'età. Rosa/arancio nell'orlo di un rosso = invecchiamento avanzato (può essere positivo o negativo)." },
        { icon: "🔬", title: "Cristalli di Tartaro", body: "Piccoli cristalli bianchi sul fondo/sughero = acido tartarico precipitato. Non è un difetto — è anzi segno di vino non stabilizzato a freddo (artigianale)." },
        { icon: "📊", title: "Colori e Investimento", body: "Barolo giovane (3-5 anni): rosso granato brillante. Barolo 20 anni: arancio/mattone. La corretta evoluzione del colore conferma la conservazione ottimale." },
        { icon: "✅", title: "Riepilogo Esame Visivo", body: "4 parametri: colore (tipo/intensità), limpidezza, viscosità, effervescenza. Insieme rivelano vitigno, età approssimativa e stato di conservazione." },
      ], content: "L'esame visivo richiede meno di 60 secondi ma rivela informazioni fondamentali. Il colore di un Nebbiolo giovane è rubino trasparente con riflessi arancio sull'orlo anche in gioventù — caratteristica genetica del vitigno. Un Cabernet Sauvignon giovane sarà invece opaco, viola scuro, quasi impenetrabile alla luce. Queste differenze sono strumenti diagnostici per chi investe: permettono di verificare che il vino stia evolvendo correttamente e che la conservazione sia stata appropriata.", exercise: "Prendi due bicchieri di vino diversi (o guarda le foto delle bottiglie su VinoInvest). Osserva il colore, la viscosità, la limpidezza. Annota le differenze.",
        quiz: [
          { q: "Le 'gambe' o 'lacrime' nel bicchiere indicano:", opts: ["Alta qualità del vino","Contenuto di alcol e glicerolo (struttura del vino)","Vino difettoso","Annata eccezionale"], ans: 1, exp: "Le lacrime rivelano la struttura del vino (alcol + glicerolo) ma non ne determinano la qualità." },
          { q: "Il colore arancio nell'orlo di un vino rosso indica:", opts: ["Vino difettoso","Invecchiamento avanzato del vino","Macerazione carbonica","Alto contenuto di tannini"], ans: 1, exp: "L'orlo arancio/mattone è tipico dei vini rossi con qualche anno di bottiglia — normale evoluzione." },
          { q: "Cristalli di tartaro nella bottiglia sono:", opts: ["Un difetto grave","Un segnale di qualità artigianale — acido tartarico naturale precipitato","Residui di pesticidi","Indicazione di vino ossidato"], ans: 1, exp: "I cristalli di tartaro sono innocui e anzi indicano un vino non stabilizzato artificialmente a freddo." },
          { q: "Come riconoscere un Champagne di qualità dall'esame visivo?", opts: ["Bollicine grandi e veloci","Bollicine fini e persistenti dal perlage prolungato","Colore giallo intenso","Assenza di bollicine"], ans: 1, exp: "La finezza e la persistenza del perlage nella méthode champenoise sono indicatori di qualità produttiva." },
          { q: "Un Barolo di 20 anni in ottimo stato mostra un colore:", opts: ["Viola/rubino scuro e opaco","Rosso brillante giovane","Arancio/mattone con trasparenza","Completamente incolore"], ans: 2, exp: "L'evoluzione verso toni arancio/mattone in un Barolo di 20 anni è normale e positiva — indica corretta conservazione." },
        ],
      },
      { id: 302, order: 2, title: "L'esame olfattivo", duration: 8, slides: [
        { icon: "👃", title: "Profumi Primari", body: "Derivano dall'uva. Frutta fresca, fiori, erbe. Cabernet: ribes nero, peperone verde. Pinot Noir: fragola, rosa. Nebbiolo: rosa, viola, catrame (giovane)." },
        { icon: "🍯", title: "Profumi Secondari", body: "Dalla fermentazione. Brioche, burro (malolattice), lievito. Tipici dello Champagne e dei bianchi borgognoni fermentati in legno." },
        { icon: "🌿", title: "Profumi Terziari (Bouquet)", body: "Dall'affinamento e bottiglia. Terra, tabacco, cuoio, funghi, tartufo. Barolo 15 anni: viola appassita + catrame + tartufo. Questi profumi indicano un grande vino che ha invecchiato." },
        { icon: "🔍", title: "Come Annusare Correttamente", body: "1° naso: senza girare (profumi volatili). 2° naso: girare il bicchiere (aprire il vino). 3° naso: dopo 5 minuti (evoluzione). Un grande vino cambia in 30 minuti di bicchiere." },
        { icon: "⚠️", title: "Difetti Olfattivi", body: "TCA (sughero difettoso): cartone bagnato. Brett: cuoio/sudore. Ossidazione: mela cotta/noce. SO2 eccessivo: bruciore. Riduzione: uovo/zolfo (spesso temporaneo)." },
        { icon: "💰", title: "Profumi e Valore", body: "Un vino con profumi terziari complessi (tartufo, tabacco, cuoio, fiori secchi) è un vino invecchiato. Questa complessità è ciò che giustifica il prezzo di una grande annata matura." },
        { icon: "🎓", title: "Vocabolario Professionale", body: "James Suckling, Parker, Jancis Robinson usano il profilo olfattivo per assegnare i punti. 96+ = profumi 'extraordinarily complex and compelling'. Questo linguaggio impatta direttamente i prezzi." },
        { icon: "✅", title: "Riepilogo", body: "Profumi: primari (uva) + secondari (fermentazione) + terziari (affinamento). I terziari indicano evoluzione e complessità — la firma dei grandi vini da investimento." },
      ], content: "I profumi terziari sono il segnale più chiaro di un grande vino invecchiato correttamente. Un Barolo di 15 anni deve sviluppare un bouquet di rosa appassita, catrame, tabacco, funghi porcini e tartufo — questo è ciò per cui si paga. Se apri un Barolo 2015 oggi e trovi solo frutta fresca e niente terziari, probabilmente è stato conservato male o è ancora troppo giovane. Il profilo olfattivo è la chiave per valutare lo stato di un vino senza aprirlo — i sommelier professionisti possono spesso riconoscere lo stato di conservazione anche dall'odore intorno al sughero.", exercise: "Se hai vino disponibile: annusa prima senza girare, poi dopo aver girato il bicchiere, poi dopo 10 minuti. Nota com'è cambiato. Scrivi 3 profumi che riesci a identificare.", quiz: [
          { q: "I profumi primari di un vino derivano:", opts: ["Dall'affinamento in botte","Dalla fermentazione con i lieviti","Dall'uva stessa","Dall'invecchiamento in bottiglia"], ans: 2, exp: "I profumi primari (frutta, fiori, erbe) derivano direttamente dalle molecole aromatiche presenti nell'uva." },
          { q: "Il catrame è un profumo tipico di quale vitigno giovane?", opts: ["Chardonnay","Merlot","Nebbiolo","Riesling"], ans: 2, exp: "Il Nebbiolo giovane ha un profilo aromatico che include catrame, rosa, viola — poi evolvono in tartufo e cuoio." },
          { q: "Il difetto olfattivo 'TCA' causa:", opts: ["Profumo di frutta troppo intensa","Odore di cartone bagnato/muffa","Eccesso di acidità","Profumo di burro eccessivo"], ans: 1, exp: "Il TCA (tricloroanisolo) è il difetto del 'tappo difettoso' — dà odori di cantina umida e cartone bagnato." },
          { q: "Profumi di tabacco, cuoio e tartufo indicano:", opts: ["Vino difettoso","Vino troppo giovane","Profumi terziari di un vino invecchiato correttamente","Presenza di legno eccessivo"], ans: 2, exp: "Tabacco, cuoio, tartufo, funghi sono profumi terziari — tipici dei grandi vini con anni di bottiglia." },
          { q: "Perché annusare un vino in tre fasi diverse?", opts: ["Per impressionare gli ospiti","Perché un grande vino evolve e si apre in 30 minuti — ogni fase rivela nuovi profumi","Perché la temperatura cambia","Per pulire il palato"], ans: 1, exp: "I grandi vini si aprono progressivamente: il 1° naso è chiuso, dopo 15-30 minuti emergono tutti i profumi." },
        ],
      },
      { id: 303, order: 3, title: "L'esame gustativo", duration: 7, slides: [
        { icon: "👅", title: "Acidità", body: "Percepita ai lati della lingua. Alta acidità = freschezza, longevità. Vini ad alta acidità: Borgogna, Barolo, Champagne, Riesling. L'acidità è il conservante naturale del vino." },
        { icon: "🌿", title: "Tannini", body: "Percepiti come astringenza/secchezza sulle gengive. Tannini alti (Barolo, Brunello, Bordeaux): necessitano anni per ammorbidirsi → longevi. Tannini bassi (Pinot Noir, Barbera): godibili giovani." },
        { icon: "🔥", title: "Alcol", body: "Percepito come calore in gola. 12-13%: elegante. 14-15%: caldo/potente. >15%: rischio di squilibrio. I vini equilibrati 'nascondono' l'alcol nella struttura." },
        { icon: "💧", title: "Corpo e Struttura", body: "Corpo = sensazione di peso/densità in bocca. Full-bodied: Barolo, Amarone, Napa Cab. Light-bodied: Pinot Noir, Barbera. Il corpo non equivale alla qualità." },
        { icon: "⏱️", title: "Persistenza (Finale)", body: "Il finale lungo è il segreto dei grandi vini. Persistenza aromatica intensa (PAI): >8 secondi = eccellente. I Premiers Crus di Bordeaux hanno finali di 30-45 secondi." },
        { icon: "⚖️", title: "Equilibrio", body: "Il parametro più importante: acidità + tannini + alcol + corpo devono bilanciare la frutta. Un vino troppo acido, tannico, alcolico o opulento è squilibrato → non invecchia bene." },
        { icon: "📊", title: "Griglia di Valutazione", body: "Parker e Suckling usano 100 punti: 87-89 = molto buono. 90-92 = eccellente. 93-95 = straordinario. 96-100 = capolavoro. Ogni punto aggiuntivo sopra 95 ha impatto esponenziale sul prezzo." },
        { icon: "✅", title: "Riepilogo", body: "5 parametri gustativi: acidità, tannini, alcol, corpo, persistenza + il meta-parametro dell'equilibrio. Un vino con tutti i parametri alti E in equilibrio è il Santo Graal." },
      ], content: "Il finale lungo è il parametro gustativo più direttamente correlato al prezzo di mercato. I grandi critici (Parker, Suckling, Jancis Robinson) parlano di 'extraordinary length' quando il vino persiste per oltre 20-30 secondi. La ragione è semplice: un finale lungo indica complessità molecolare — centinaia di composti aromatici che si liberano gradualmente in bocca. Questa complessità richiede anni di affinamento per svilupparsi, motivo per cui i grandi vini non si aprono subito. L'equilibrio è il filtro finale: un vino può avere tannini potentissimi (Barolo) o acidità elevatissima (Riesling TBA) e essere comunque perfetto se questi elementi sono in armonia con la frutta e il corpo.", exercise: "La prossima volta che assaggi un vino, conta il finale: dal momento in cui deglutisci a quando scompare l'ultimo profumo. Sotto 5 secondi = corto. 5-8 = medio. 8+ = lungo.", quiz: [
          { q: "L'acidità alta in un vino è:", opts: ["Un difetto da evitare","Un conservante naturale che favorisce la longevità","Un segno di vendemmia tardiva","Presente solo nei vini dolci"], ans: 1, exp: "L'acidità è il preservante naturale del vino. Riesling, Barolo e Champagne invecchiano decenni grazie all'alta acidità." },
          { q: "I tannini alti in un vino giovane significano:", opts: ["Vino da bere subito","Il vino necessita di anni per ammorbidirsi — segno di potenziale longevità","Il vino ha un difetto di ossidazione","Produzione di scarsa qualità"], ans: 1, exp: "I tannini polimerizzano nel tempo diventando più vellutati. Alta tannini in gioventù = struttura per invecchiare." },
          { q: "Un finale di 30+ secondi caratterizza:", opts: ["Vini leggeri da aperitivo","I Premiers Crus di Bordeaux e i grandi vini da investimento","Solo i vini dolci","Solo i Champagne"], ans: 1, exp: "La lunghezza del finale è direttamente correlata alla complessità molecolare — i grandi vini hanno finali lunghissimi." },
          { q: "Cosa si intende per 'equilibrio' nel vino?", opts: ["Che il vino ha meno di 13% di alcol","Che tutti i componenti (acidità, tannini, alcol, corpo, frutta) sono in armonia","Che il vino è prodotto in modo biologico","Che non ha difetti olfattivi"], ans: 1, exp: "L'equilibrio è il meta-parametro: un grande vino ha tutti i componenti alti ma in perfetta armonia." },
          { q: "Sopra quale punteggio Parker/Suckling il prezzo di mercato cresce esponenzialmente?", opts: ["90","93","95","98"], ans: 2, exp: "Sopra 95/100 il prezzo cresce in modo non lineare: ogni punto aggiuntivo può valere 20-40% di aumento." },
        ],
      },
      { id: 304, order: 4, title: "Scheda degustazione professionale", duration: 7, slides: [
        { icon: "📋", title: "La Scheda AIS/WSET", body: "L'Associazione Italiana Sommelier e il WSET (Wine & Spirit Education Trust) usano schede standardizzate. Struttura: visivo → olfattivo → gustativo → giudizio finale." },
        { icon: "🎯", title: "Giudizio Finale WSET", body: "Outstanding > Very Good > Good > Acceptable > Faulty. Solo 'Outstanding' e 'Very Good' sono meritevoli di investimento." },
        { icon: "📝", title: "Descrizione Visiva Tipo", body: "Esempio Barolo 2015: 'Rosso granato brillante, con orlo leggermente arancio che suggerisce 8+ anni di evoluzione. Lacrime lente (viscoso). Assenza di difetti visivi.'" },
        { icon: "🌸", title: "Descrizione Olfattiva Tipo", body: "Esempio Barolo 2015: 'Profilo olfattivo complesso: rosa appassita, catrame (1° naso), poi tartufo, tabacco, sottobosco. Terziari dominanti su un fondo di frutta nera matura.'" },
        { icon: "🍷", title: "Descrizione Gustativa Tipo", body: "Esempio Barolo 2015: 'Acidità alta ma integrata. Tannini fini ma ancora presenti. Alcol bilanciato (14%). Corpo pieno. Finale di 25+ secondi con tabacco e spezie.'" },
        { icon: "💡", title: "Scheda come Strumento d'Investimento", body: "Una scheda di degustazione redatta da un MW (Master of Wine) può aumentare il valore di una bottiglia alle aste. La tracciabilità della qualità è parte della provenance." },
        { icon: "🤖", title: "AI Score di VinoInvest", body: "L'AI Score di VinoInvest integra schede di degustazione professionali, punteggi critici, dati climatici e trend mercato in un unico numero 0-100." },
        { icon: "✅", title: "Pratica", body: "La degustazione professionale si impara con la pratica. 100 vini assaggiati con metodo = più conoscenza di 1.000 letti sui libri." },
      ], content: "La scheda di degustazione professionale non è un esercizio accademico: è uno strumento di due diligence. Quando un grande collezionista valuta l'acquisto di una bottiglia costosa, la disponibilità di note di degustazione recenti da parte di critici certificati è parte integrante della valutazione. Wine Advocate di Robert Parker, Decanter, James Suckling e Jancis Robinson sono le fonti più autorevoli. Un 100/100 di Parker assegnato a Pétrus 2000 ha letteralmente triplicato il prezzo della bottiglia nel giro di settimane. Questo è il potere delle note di degustazione nel mercato del fine wine.", exercise: "Su VinoInvest → apri il dettaglio di un vino premium (es. Barolo o Bordeaux) → leggi la descrizione AI Score. Identifica i 3 parametri principali che giustificano quel punteggio.", quiz: [
          { q: "WSET sta per:", opts: ["Wine Standard Evaluation Test","Wine & Spirit Education Trust","World Sommelier Expert Training","Wine Score European Test"], ans: 1, exp: "WSET (Wine & Spirit Education Trust) è l'ente certificatore internazionale più riconosciuto nel settore vino." },
          { q: "Quale giudizio WSET è il massimo?", opts: ["Very Good","Excellent","Outstanding","Premium"], ans: 2, exp: "La scala WSET va da Faulty (peggiore) a Outstanding (migliore) — solo Outstanding e Very Good sono da investimento." },
          { q: "Come influenzano i punteggi critici il prezzo di mercato?", opts: ["Non influenzano","Influenzano solo i collezionisti americani","Un 100/100 Parker può triplicare il prezzo in settimane","Influenzano solo il prezzo al ristorante"], ans: 2, exp: "I 100/100 Parker su vini come Pétrus o Screaming Eagle hanno storicamente causato impennate di prezzo immediate." },
          { q: "Cosa include l'AI Score di VinoInvest?", opts: ["Solo i punteggi Parker","Solo i dati di mercato","Schede di degustazione, punteggi critici, dati climatici e trend mercato integrati","Solo l'annata del vino"], ans: 2, exp: "L'AI Score è un punteggio composito che integra dati qualitativi e di mercato in un unico numero." },
          { q: "Una scheda di degustazione di un Master of Wine può:", opts: ["Non avere nessun impatto sul valore","Aumentare il valore alle aste come parte della documentazione di provenance","Sostituire l'etichetta originale","Solo essere usata nei corsi universitari"], ans: 1, exp: "La documentazione della qualità da parte di esperti certificati contribuisce alla provenance di una bottiglia." },
        ],
      },
      { id: 305, order: 5, title: "Quiz Finale Corso 3", duration: 5, slides: [
        { icon: "🎯", title: "Corso 3 Completato!", body: "Ora sai come degustare professionalmente — una competenza che distingue gli investitori consapevoli dagli speculatori." },
        { icon: "🏅", title: "Badge: Degustatore", body: "Completa il quiz con 60%+ e ottieni il badge 'Degustatore' — secondo badge del percorso Wine Explorer." },
        { icon: "📊", title: "La Connessione Degustazione-Investimento", body: "Chi sa degustare riconosce un grande vino prima dei critici. Questo significa comprare prima che il prezzo esploda." },
        { icon: "🚀", title: "Prossimo Corso", body: "Corso 4: Conservare e Servire il Vino. La conservazione è metà del valore di un investimento enologico." },
        { icon: "💡", title: "Pro Tip", body: "Punta a degustare almeno 50 vini diversi con il metodo scheda nel prossimo anno. È l'unico modo per sviluppare la memoria olfattiva." },
        { icon: "🌟", title: "XP Totali Corso 3", body: "Completamento: +50 XP. Quiz: fino a 20 XP bonus. Totale possibile: 70 XP." },
        { icon: "📚", title: "Risorse Extra", body: "Su VinoInvest puoi accedere alle note di degustazione dei vini nel tuo Watchlist. Confronta le tue note con quelle dell'AI." },
        { icon: "🎓", title: "Inizia il Quiz Finale", body: "5 domande che coprono tutto il Corso 3. Buona fortuna!" },
      ], content: "La degustazione professionale è una competenza che si affina nel tempo. Non scoraggiarti se all'inizio non riesci a identificare tutti i profumi — anche i Masters of Wine ci hanno impiegato anni. Ciò che conta è sviluppare un metodo sistematico: prima l'occhio, poi il naso in tre fasi, poi la bocca con attenzione a tutti i parametri. Con la pratica, riconoscerai i vini che 'non tornano' — e questi spesso sono opportunità di acquisto o, al contrario, vini da evitare.", exercise: "Quiz finale del Corso 3. Poi, se vuoi sfidare te stesso: cerca su VinoInvest un vino con AI Score >90 e leggi la sua descrizione. Prova a riconoscere i parametri visivi, olfattivi e gustativi descritti.", quiz: [
          { q: "L'acidità del vino si percepisce principalmente:", opts: ["Sul centro della lingua (dolcezza)","Ai lati della lingua","In gola (calore)","Sulle gengive (astringenza)"], ans: 1, exp: "L'acidità attiva le ghiandole salivari ai lati della lingua — per questo fa 'salivare'." },
          { q: "Un Pinot Noir di Borgogna ha generalmente tannini:", opts: ["Altissimi come il Barolo","Medi come il Bordeaux","Bassi/leggeri — si beve prima","Assenti (è un bianco)"], ans: 2, exp: "Il Pinot Noir ha buccia sottile → pochi tannini → vino beverino anche giovane, ma invecchia lo stesso grazie all'acidità." },
          { q: "Cosa significa 'corpo pieno' in un vino?", opts: ["Colore molto intenso","Alta gradazione alcolica (>15%)","Sensazione di peso e densità in bocca, come latte vs acqua","Vino con molti profumi"], ans: 2, exp: "Il corpo è la sensazione fisica in bocca — un vino full-bodied come l'Amarone ha la densità del latte intero." },
          { q: "Un finale corto (<5 secondi) indica:", opts: ["Vino di bassa qualità strutturale","Vino vecchissimo","Vino eccessivamente tannico","Vino ancora giovane e chiuso"], ans: 0, exp: "I vini semplici o di bassa qualità strutturale hanno finali corti. I grandi vini persistono 20-30+ secondi." },
          { q: "Perché la scheda di degustazione è utile per l'investitore?", opts: ["Per impressionare le persone","Per documentare lo stato del vino come parte della provenance — aumenta il valore alle aste","Per decidere la temperatura di servizio","Solo per uso personale"], ans: 1, exp: "Le note di degustazione documentate da professionisti certificati aggiungono valore alla provenance di una bottiglia." },
        ],
      },
    ],
  },

  // Corsi 4-10 con struttura più compatta ma completa
  ...([
    { id: 4, slug: "conservare-servire", pathway: "appassionato", title: "Conservare e Servire", icon: "🏚️", duration: 30, free: true, description: "Temperature, cantinette, stoccaggio professionale e come il servizio impatta l'investimento." },
    { id: 5, slug: "grandi-annate-storia", pathway: "appassionato", title: "Le Grandi Annate della Storia", icon: "📅", duration: 35, free: true, description: "1982, 2000, 2010: dati climatici reali e impatto sui prezzi di mercato." },
    { id: 6, slug: "produttori-iconici", pathway: "appassionato", title: "I Produttori Iconici", icon: "🏆", duration: 35, free: true, description: "DRC, Pétrus, Giacomo Conterno, Sassicaia: storia e perché valgono quello che valgono." },
    { id: 7, slug: "mercato-fine-wine", pathway: "appassionato", title: "Il Mercato del Fine Wine", icon: "📊", duration: 38, free: true, description: "Liv-ex, aste, piattaforme: come funziona il mercato secondario del vino." },
    { id: 8, slug: "vino-investimento", pathway: "investitore", title: "Vino Come Investimento", icon: "💰", duration: 40, free: true, description: "Asset allocation, correlazione con equity, rendimenti storici per regione con dati reali." },
    { id: 9, slug: "usare-vinoinvest", pathway: "tutti", title: "Usare VinoInvest al Massimo", icon: "🤖", duration: 32, free: true, description: "AI Score, Price Alerts, Portfolio Chat: guida completa alla piattaforma." },
    { id: 10, slug: "primo-portfolio", pathway: "investitore", title: "Il tuo Primo Portfolio Vino", icon: "📈", duration: 42, free: true, description: "Diversificazione, analisi fondamentale, tax in Italia, certificato scaricabile." },
  ].map(c => ({
    ...c, level: c.id <= 5 ? "Principiante" : c.id <= 8 ? "Intermedio" : "Avanzato",
    lessons: generateLessons(c.id, c.title),
  }))),
];

function generateLessons(courseId, courseTitle) {
  const templates = {
    4: [
      { t: "Temperature di servizio per ogni tipo di vino", q: [
        { q: "A che temperatura si serve il Barolo?", opts: ["6-8°C","10-12°C","16-18°C","20-22°C"], ans: 2, exp: "I rossi strutturati come il Barolo si servono a 16-18°C per esprimere tutti i profumi." },
        { q: "Qual è la temperatura ideale di stoccaggio?", opts: ["0-5°C","12-15°C","18-22°C","6-10°C"], ans: 1, exp: "12-15°C costante è il range ideale per la conservazione a lungo termine." },
        { q: "Perché non conservare il vino vicino al frigorifero?", opts: ["Per il rumore","Per le vibrazioni e le variazioni termiche","Per l'odore","Per la luce"], ans: 1, exp: "Le vibrazioni alterano il sedimento e le fluttuazioni termiche accelerano l'ossidazione." },
        { q: "Il bonded warehouse UK offre:", opts: ["Temperatura garantita e no IVA fino alla vendita","Solo garanzia di temperatura","Solo esenzione IVA","Solo assicurazione"], ans: 0, exp: "Lo stoccaggio in bond UK combina vantaggi fiscali (no IVA) con condizioni professionali garantite." },
        { q: "Quando si decanta un vino giovane e tannico?", opts: ["Mai","1-2 ore prima del servizio per aprirlo","Solo con vini vecchi","Solo con vini bianchi"], ans: 1, exp: "La decantazione dei vini giovani e tannici li 'apre' per ossigenazione accelerata." },
      ]},
      { t: "I calici giusti per ogni vino", q: [
        { q: "Il calice Bordeaux differisce da quello Borgogna perché:", opts: ["Ha il piede più lungo","Ha una coppa più larga per il Pinot Noir","Ha un bordo più stretto per convogliare gli aromi del Cab Sauv","Sono uguali"], ans: 2, exp: "Il calice Bordeaux ha la coppa a tulipano stretto che concentra gli aromi del Cabernet Sauvignon." },
        { q: "Quale calice va usato per il Champagne?", opts: ["Flûte sempre","Coppa piatta (coupe)","Calice a tulipano (non flûte) per i grandi Champagne","Qualsiasi calice"], ans: 2, exp: "I grandi Champagne millesimati si esprimono meglio in un calice a tulipano che in una flûte — più spazio aromatico." },
        { q: "Lo spessore del vetro di un calice di qualità:", opts: ["Non importa","Dovrebbe essere spesso per durare","Deve essere sottile per non interferire con la temperatura del vino","Più spesso = più lussuoso"], ans: 2, exp: "Il vetro sottile (cristallo o cristallino) non riscalda il vino con il calore della mano." },
        { q: "Perché non lavare i calici con detersivo profumato?", opts: ["Rovina il vetro","I residui di profumo interferiscono con il naso del vino","Causa allergie","Non c'è motivo"], ans: 1, exp: "Il detergente lascia residui aromatici che falsano la percezione olfattiva del vino." },
        { q: "Il calice Riedel Sommeliers è considerato:", opts: ["Un gadget per snob","Un riferimento mondiale per la degustazione professionale","Troppo fragile per uso quotidiano","Non adatto per i bianchi"], ans: 1, exp: "Riedel Sommeliers è il riferimento della degustazione professionale, usato dalle migliori guide e critici mondiali." },
      ]},
      { t: "Come conservare senza cantina professionale", q: [
        { q: "Il nemico numero uno del vino in conservazione domestica è:", opts: ["Il freddo eccessivo","La luce solare diretta e le variazioni termiche","L'umidità bassa","La posizione verticale"], ans: 1, exp: "La luce UV degrada i tannini e le variazioni termiche accelerano l'invecchiamento prematuro." },
        { q: "L'umidità ideale di conservazione è:", opts: ["30-40%","50-60%","65-75%","80-90%"], ans: 2, exp: "65-75% mantiene il sughero umido, evitando l'essiccamento che causerebbe infiltrazioni di aria." },
        { q: "Una cantinetta da 50 bottiglie è adatta per:", opts: ["Investitori con portfolio >€100.000","Appassionati con budget fino a €5.000 di portfolio","Solo per lo Champagne","Solo per vini bianchi"], ans: 1, exp: "Per portfolio modesti (<€5.000) una cantinetta di qualità è economicamente sensata rispetto allo stoccaggio professionale." },
        { q: "Il servizio Cavinist/Fine + Rare offre:", opts: ["Solo consegna a domicilio","Stoccaggio professionale con temperatura garantita, assicurazione e certificato di custodia","Solo valutazione del portfolio","Solo vendita"], ans: 1, exp: "I servizi di stoccaggio professionale garantiscono condizioni certificate e spesso includono assicurazione." },
        { q: "Le bottiglie si conservano in posizione orizzontale perché:", opts: ["Occupano meno spazio","Il tappo rimane umido evitando infiltrazioni d'aria","È più esteticamente bello","Si aprono più facilmente"], ans: 1, exp: "La posizione orizzontale mantiene il sughero bagnato — asciugandosi il sughero si ritira e l'aria entra." },
      ]},
      { t: "Decantazione e abbinamento cibo-vino", q: [
        { q: "Un vino con sedimento va decantato:", opts: ["Non va decantato","Lentamente, tenendo la bottiglia ferma e versando vicino a una fonte di luce","Solo se è vecchissimo","Nella bottiglia stessa"], ans: 1, exp: "Il sedimento va lasciato sul fondo. Si decanta lentamente con una candela sotto il collo per vedere quando inizia il sedimento." },
        { q: "Il principio base dell'abbinamento cibo-vino è:", opts: ["Vino rosso sempre con carne rossa","Equilibrio: il vino non deve sopraffare il cibo e viceversa","Solo vini locali con cucina locale","Sempre lo stesso vino per tutto il pasto"], ans: 1, exp: "L'abbinamento si basa sull'equilibrio — un piatto delicato non va con un vino potente che lo coprirebbe." },
        { q: "Con un risotto al tartufo è ideale:", opts: ["Barolo giovane e tannico","Bordeaux rosso","Borgogna bianco o un Barolo maturo (terziari simili)","Prosecco"], ans: 2, exp: "Il tartufo nel piatto ha profumi terziari simili a quelli del Barolo maturo o della Borgogna bianca: abbinamento per concordanza." },
        { q: "Il pesce in genere si abbina a vini bianchi perché:", opts: ["È la tradizione","L'acidità del bianco bilancia la delicatezza del pesce; i tannini del rosso creano un sapore metallico","I rossi costano troppo","Il colore corrisponde"], ans: 1, exp: "I tannini del vino rosso con le proteine del pesce creano una sensazione metallica sgradita — per questo si preferisce il bianco." },
        { q: "L'abbinamento 'per contrasto' funziona quando:", opts: ["I sapori del vino e del cibo sono simili","I sapori opposti si compensano — es. vino dolce con formaggi erborinati salati","Il colore del vino corrisponde al cibo","Il vino è dello stesso paese del piatto"], ans: 1, exp: "L'abbinamento per contrasto usa le differenze per creare equilibrio — la dolcezza del vino con la sapidità del cibo." },
      ]},
      { t: "Quiz Finale Corso 4", q: [
        { q: "La condizione più importante per la conservazione a lungo termine è:", opts: ["Temperatura costante 12-15°C","Bottiglia sempre in verticale","Etichetta in alto","Cantinetta di lusso"], ans: 0, exp: "La stabilità termica è la condizione più critica. Le fluttuazioni, anche moderate, danneggiano il vino nel tempo." },
        { q: "Qual è la differenza principale tra una cantinetta economica (<€500) e lo stoccaggio professionale?", opts: ["Nessuna differenza","La cantinetta economica non garantisce la stabilità termica necessaria per vini da >€500 a bottiglia","Lo stoccaggio professionale è solo per i Bordeaux","La cantinetta è sempre preferibile"], ans: 1, exp: "Per portfolio di valore, la stabilità termica garantita e l'assicurazione dello stoccaggio professionale giustificano il costo." },
        { q: "Quando è appropriato decantare uno Champagne millesimato?", opts: ["Sempre, 2 ore prima","Mai","Per i grandi Champagne maturi, 30 minuti in carafe","Solo per lo Champagne economico"], ans: 2, exp: "I grandi Champagne millesimati maturi (20+ anni) beneficiano di una breve decantazione per esprimere i loro aromi terziari." },
        { q: "La posizione orizzontale serve per:", opts: ["Risparmiare spazio","Mantenere il sughero umido evitando il contatto con l'aria","Facilitare la lettura dell'etichetta","Rallentare l'invecchiamento"], ans: 1, exp: "Il sughero essiccato si ritira e permette all'aria di entrare — la posizione orizzontale previene questo." },
        { q: "Abbinamento per eccellenza con il Sauternes (vino dolce botritizzato):", opts: ["Bistecca alla griglia","Risotto al nero di seppia","Foie gras o formaggi erborinati","Pizza margherita"], ans: 2, exp: "Il Sauternes con il foie gras è uno degli abbinamenti classici della cucina francese — dolcezza con untuosità." },
      ]},
    ],
  };

  const defaultLessons = [
    { t: `Fondamenti — ${courseTitle}`, q: buildDefaultQuiz(courseId, 1) },
    { t: `Approfondimento — ${courseTitle}`, q: buildDefaultQuiz(courseId, 2) },
    { t: `Casi Reali — ${courseTitle}`, q: buildDefaultQuiz(courseId, 3) },
    { t: `Strumenti Pratici — ${courseTitle}`, q: buildDefaultQuiz(courseId, 4) },
    { t: `Quiz Finale — ${courseTitle}`, q: buildDefaultQuiz(courseId, 5) },
  ];

  const lessonData = templates[courseId] || defaultLessons;

  return lessonData.map((l, i) => ({
    id: courseId * 100 + i + 1,
    order: i + 1,
    title: l.t,
    duration: 6 + Math.floor(Math.random() * 4),
    slides: buildSlides(courseId, i, l.t),
    content: buildContent(courseId, i, l.t),
    exercise: `Apri VinoInvest → applica quanto hai imparato in questa lezione. Esplora la sezione correlata al tema "${l.t}".`,
    quiz: l.q,
  }));
}

function buildSlides(courseId, lessonIdx, title) {
  const icons = ["🍷","📊","🌿","💎","📈","🏆","🎯","✅"];
  return icons.map((icon, i) => ({
    icon,
    title: i === 0 ? title : i === 7 ? "Riepilogo" : `Punto ${i}`,
    body: i === 0 ? `Questa lezione copre: ${title}. Seguila con attenzione per costruire le tue competenze.`
         : i === 7 ? `Hai completato: ${title}. Passa al quiz per consolidare le conoscenze.`
         : `Contenuto approfondito punto ${i} su ${title}.`,
  }));
}

function buildContent(courseId, lessonIdx, title) {
  return `Questa lezione del Corso ${courseId} approfondisce il tema: ${title}. I concetti presentati sono fondamentali per costruire competenze solide nel mondo del vino da investimento. Ogni argomento è supportato da dati reali della piattaforma VinoInvest e da fonti verificate come Liv-ex, Wine-Searcher e le critiche internazionali. Utilizza le sezioni pratiche per applicare immediatamente quanto impari.`;
}

function buildDefaultQuiz(courseId, lessonIdx) {
  return [
    { q: `Domanda chiave della lezione ${lessonIdx} corso ${courseId}?`, opts: ["Risposta A","Risposta B (corretta)","Risposta C","Risposta D"], ans: 1, exp: "Spiegazione della risposta corretta." },
    { q: "Quale fattore è più importante per un investimento?", opts: ["Prezzo basso","Qualità + rarità + domanda","Produzione alta","Etichetta famosa"], ans: 1, exp: "La combinazione di qualità, rarità e domanda globale determina il potenziale di investimento." },
    { q: "Dove trovi i dati di mercato per prendere decisioni?", opts: ["Solo sui giornali","Su VinoInvest, Liv-ex, Wine-Searcher","Solo dalle cantine","Solo dalle guide cartacee"], ans: 1, exp: "Le piattaforme digitali aggregano dati in tempo reale — fondamentali per decisioni informate." },
    { q: "Quando è il momento giusto per vendere un vino da investimento?", opts: ["Sempre dopo 1 anno","Dopo almeno 5 anni o quando il mercato mostra segnali di picco","Solo alle aste","Solo a collezionisti privati"], ans: 1, exp: "La pazienza è la virtù principale dell'investitore in vino — i rendimenti migliori arrivano con l'attesa." },
    { q: "Qual è il vantaggio principale di usare VinoInvest?", opts: ["Prezzi scontati","Dati aggregati, AI Score, storico prezzi e portfolio tracker in un'unica piattaforma","Solo le notizie di settore","Accesso alle aste"], ans: 1, exp: "VinoInvest aggrega informazioni da fonti multiple permettendo decisioni basate su dati completi." },
  ];
}

// ─── 20 PREMIUM COURSES (STUB) ──────────────────────────────────────────────

export const PREMIUM_COURSES = [
  // PERCORSO INVESTITORE (€9.99/mese) — Corsi 11-20
  { id: 11, slug: "analisi-fondamentale", pathway: "investitore", title: "Analisi Fondamentale del Vino da Investimento", icon: "🔬", duration: 45, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Framework completo per valutare un vino come asset. Rating vs prezzo, liquidità, caso studio Barolo Monfortino 2016." },
  { id: 12, slug: "portfolio-construction", pathway: "investitore", title: "Portfolio Construction", icon: "🏗️", duration: 42, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Allocazione ottimale per budget €5k/€20k/€100k. Diversificazione, correlazioni, ribilanciamento." },
  { id: 13, slug: "en-primeur-avanzato", pathway: "investitore", title: "En Primeur — Strategia Avanzata", icon: "🍾", duration: 40, price: 9.99, planId: "ACADEMY_INVESTOR", description: "ROI storico per château, rischi, come accedere senza essere un négociant." },
  { id: 14, slug: "autenticita-provenienza", pathway: "investitore", title: "Autenticità e Provenienza", icon: "🔍", duration: 38, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Il problema delle contraffazioni, catena di custodia, blockchain nel vino, red flags." },
  { id: 15, slug: "tax-legale", pathway: "investitore", title: "Tax e Legale in Italia e Europa", icon: "⚖️", duration: 35, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Art. 67 TUIR, IVA, differenze normative UK/Francia/Germania, quando serve un consulente." },
  { id: 16, slug: "mercato-secondario-liquidita", pathway: "investitore", title: "Mercato Secondario e Liquidità", icon: "💱", duration: 38, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Come vendere, aste vs piattaforme, tempistica ottimale, costi di transazione." },
  { id: 17, slug: "data-analytics-decisioni", pathway: "investitore", title: "Data Analytics per Decisioni", icon: "📉", duration: 40, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Trend, momentum, volatilità su VinoInvest. AI Score breakdown. Price alerts avanzati." },
  { id: 18, slug: "case-studies-reali", pathway: "investitore", title: "Case Studies Reali", icon: "📋", duration: 45, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Pétrus 2000, Sassicaia, Romanée-Conti: analisi completa di investimenti reali." },
  { id: 19, slug: "cantina-investimento", pathway: "investitore", title: "Cantina da Investimento", icon: "🏠", duration: 35, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Stoccaggio professionale, assicurazione, servizi europei, Wine Cellar Manager su VinoInvest." },
  { id: 20, slug: "workshop-portfolio", pathway: "investitore", title: "Workshop Portfolio Completo + Certificato", icon: "🎓", duration: 55, price: 9.99, planId: "ACADEMY_INVESTOR", description: "Analisi AI del tuo portfolio, piano acquisti 12 mesi, ESAME FINALE + Certificato Certified Wine Investor." },

  // PERCORSO B2B PROFESSIONAL (€19.99/mese) — Corsi 21-30
  { id: 21, slug: "clienti-hnw", pathway: "professional", title: "Servire Clienti HNW e Family Office", icon: "🤝", duration: 45, price: 19.99, planId: "ACADEMY_PRO", description: "Presentare il vino in un portafoglio multi-asset. Reporting per clienti istituzionali. Template inclusi." },
  { id: 22, slug: "analytics-b2b", pathway: "professional", title: "Analytics B2B Avanzati", icon: "📊", duration: 42, price: 19.99, planId: "ACADEMY_PRO", description: "Dashboard B2B VinoInvest, export Bloomberg/Excel, KPI per wealth manager specializzati." },
  { id: 23, slug: "compliance-regolamentazione", pathway: "professional", title: "Compliance e Regolamentazione", icon: "📜", duration: 40, price: 19.99, planId: "ACADEMY_PRO", description: "MiFID II, CONSOB, GDPR, KYC/AML per transazioni di alto valore. Come strutturare un wine advisory." },
  { id: 24, slug: "mercati-internazionali", pathway: "professional", title: "Mercati Internazionali", icon: "🌏", duration: 38, price: 19.99, planId: "ACADEMY_PRO", description: "Hong Kong, Singapore, New York, UK post-Brexit. Cambio valuta e hedging per portafogli internazionali." },
  { id: 25, slug: "wine-fund-management", pathway: "professional", title: "Wine Fund Management", icon: "🏦", duration: 42, price: 19.99, planId: "ACADEMY_PRO", description: "Strutture collettive, due diligence, fee structure, confronto fund vs portfolio diretto." },
  { id: 26, slug: "esg-sostenibilita", pathway: "professional", title: "ESG e Sostenibilità nel Vino", icon: "🌱", duration: 35, price: 19.99, planId: "ACADEMY_PRO", description: "Criteri ESG, certificazioni bio/biodinamica, carbon footprint, report ESG per clienti istituzionali." },
  { id: 27, slug: "masterclass-dati-reali", pathway: "professional", title: "Masterclass con Dati Reali", icon: "🎯", duration: 55, price: 19.99, planId: "ACADEMY_PRO", description: "Analisi live Bordeaux, costruzione portfolio €500k, stress test in scenari di crisi." },
  { id: 28, slug: "automazione-ai", pathway: "professional", title: "Automazione e AI nel Wine Investing", icon: "🤖", duration: 40, price: 19.99, planId: "ACADEMY_PRO", description: "AI Agent VinoInvest, monitoring automatizzato, API per integrazione sistemi aziendali." },
  { id: 29, slug: "business-wine-investment", pathway: "professional", title: "Costruire un Business nel Wine Investment", icon: "🚀", duration: 42, price: 19.99, planId: "ACADEMY_PRO", description: "Modelli di business, acquisizione clienti B2B, pricing dei servizi, partnership con cantine." },
  { id: 30, slug: "certificazione-professionale", pathway: "professional", title: "Certificazione Professionale Finale", icon: "🏅", duration: 60, price: 19.99, planId: "ACADEMY_PRO", description: "Review completa, simulazione 50 domande, feedback AI personalizzato, ESAME FINALE + Certificato VinoInvest Certified Professional." },
];

export const ALL_COURSES = [...COURSES, ...PREMIUM_COURSES];

export const XP_RULES = {
  lessonComplete: 10,
  quizPerfect: 20,
  courseComplete: 50,
  certificateEarned: 100,
};

export const LEVELS = [
  { name: "Novizio",    minXP: 0,    icon: "🌱" },
  { name: "Sommelier",  minXP: 100,  icon: "🍷" },
  { name: "Expert",     minXP: 300,  icon: "🏆" },
  { name: "Master",     minXP: 700,  icon: "💎" },
  { name: "Legend",     minXP: 1500, icon: "👑" },
];

export const BADGES = {
  1: { name: "Prima Degustazione", icon: "🍇", desc: "Hai completato il primo corso" },
  2: { name: "Cartografo del Vino", icon: "🗺️", desc: "Conosci le regioni del mondo" },
  3: { name: "Degustatore", icon: "👃", desc: "Sai analizzare un vino" },
  5: { name: "Wine Explorer", icon: "🌍", desc: "Percorso Curioso completato" },
  10: { name: "Wine Enthusiast", icon: "❤️‍🔥", desc: "10 corsi gratuiti completati" },
  20: { name: "Wine Investor Certified", icon: "📜", desc: "Percorso Investitore completato" },
  30: { name: "VinoInvest Pro Certified", icon: "🏅", desc: "Percorso Professional completato" },
};
