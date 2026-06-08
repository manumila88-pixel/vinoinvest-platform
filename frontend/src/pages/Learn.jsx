import React, { useState, useEffect } from "react";

const GOLD = "#C9A227";

const COURSES = [
  {
    id: 1, title: "Perché investire nel vino?", icon: "🍷", duration: "5 min",
    level: "Principiante",
    content: `Il vino fine è una delle asset class alternative con le performance più costanti. Il Knight Frank Luxury Investment Index mostra rendimenti medi del 10-12% annuo negli ultimi 10 anni.

**Vantaggi principali:**
- Bassa correlazione con i mercati azionari (resiliente nelle crisi)
- Asset fisico: non può andare a zero come un'azione
- Valore intrinseco che aumenta con l'invecchiamento
- Mercato liquido: Wine-Searcher aggrega 10M+ offerte
- Diversificazione geografica: Bordeaux, Borgogna, Toscana, Champagne

**Rischi da considerare:**
- Conservazione richiede condizioni controllate (12-15°C, 70% umidità)
- Mercato meno regolamentato dei mercati finanziari tradizionali
- Falsificazioni: sempre verificare provenienza e certificati
- Liquidità variabile per vini meno noti

**Performance storiche:**
- Liv-ex Fine Wine 100: +127% in 10 anni (2014-2024)
- Bordeaux 500: correlazione con S&P500 = 0.12 (quasi nulla)
- Durante la crisi 2008: fine wine -8% vs equity -40%`,
    quiz: [
      { q: "Qual è la correlazione storica tra il mercato del fine wine e l'S&P500?", opts: ["0.82 (alta)", "0.12 (quasi nulla)", "0.55 (media)", "0.95 (molto alta)"], ans: 1 },
      { q: "Qual è la temperatura ideale di conservazione per il vino da investimento?", opts: ["5-8°C", "18-22°C", "12-15°C", "0-4°C"], ans: 2 },
      { q: "Quale indice misura i rendimenti del mercato del lusso incluso il fine wine?", opts: ["Dow Jones", "FTSE 100", "Knight Frank Luxury Investment Index", "Bloomberg Wine Index"], ans: 2 },
      { q: "Durante la crisi finanziaria del 2008, come si è comportato il fine wine vs le azioni?", opts: ["Ha perso più delle azioni", "Ha perso meno delle azioni (-8% vs -40%)", "È rimasto stabile", "Ha guadagnato valore"], ans: 1 },
    ],
  },
  {
    id: 2, title: "Come funziona il mercato", icon: "📈", duration: "8 min",
    level: "Principiante",
    content: `Il mercato del fine wine opera su diversi livelli:

**Mercato primario (en primeur):**
I vini di Bordeaux vengono venduti ancora in botte a prezzi scontati. Il prezzo finale dipenderà da qualità dell'annata e critica professionale.

**Mercato secondario:**
- Case d'aste: Sotheby's, Christie's, Acker — per i collezionisti premium
- Piattaforme online: Wine-Searcher (aggregatore), Vivino (consumer), Idealwine (aste)
- Négociants/merchants: Millesima, Tannico, Callmewine

**Indici di mercato:**
- Liv-ex Fine Wine 100: i 100 vini più scambiati al mondo
- Liv-ex Bordeaux 500: focus su Bordeaux
- VinoInvest Index (VII): basato sui vini più seguiti sulla piattaforma

**Prezzi medi storici:**
Château Petrus 2015: €5.000/bt → €8.500/bt in 5 anni (+70%)
Barolo Monfortino 2010: €400/bt → €850/bt in 8 anni (+112%)
Dom Pérignon 2012: €180/bt → €240/bt in 4 anni (+33%)

**Market makers:**
Il mercato è dominato da UK (Liv-ex, Bonhams) e Hong Kong (Zachys, Acker Asia).`,
    quiz: [
      { q: "Cos'è l'en primeur?", opts: ["Un vino già imbottigliato e pronto", "Acquisto di vino ancora in botte, 18 mesi prima dell'imbottigliamento", "Un tipo di bottiglia da 3 litri", "Una denominazione francese"], ans: 1 },
      { q: "Cos'è il Liv-ex Fine Wine 100?", opts: ["Una classifica dei 100 migliori sommelier", "L'indice dei 100 vini fine wine più scambiati al mondo", "Una borsa merci a Londra", "Un'asta annuale di Christie's"], ans: 1 },
      { q: "In quale mercato si commercializzano principalmente i fine wines?", opts: ["New York e Tokyo", "Londra e Hong Kong", "Parigi e Roma", "Sydney e Dubai"], ans: 1 },
      { q: "Quale piattaforma online aggrega oltre 10 milioni di offerte di vino?", opts: ["Vivino", "Wine-Searcher", "Idealwine", "Millesima"], ans: 1 },
    ],
  },
  {
    id: 3, title: "Come leggere l'AI Score", icon: "🤖", duration: "6 min",
    level: "Intermedio",
    content: `L'AI Score di VinoInvest è un punteggio 0-100 che valuta il potenziale di investimento di ogni vino.

**Componenti del punteggio:**
- Rating critico (30%): James Suckling, Jancis Robinson, Parker
- Qualità annata (25%): Dati climatici Open-Meteo + storico
- Produttore (20%): Reputazione, consistenza, rarità
- Trend mercato (15%): Movimento prezzi ultimi 12 mesi
- Rischio (10%): Volatilità, liquidità, storage

**Interpretazione:**
- 90-100: Eccezionale — Strong Buy
- 80-89: Ottimo — Buy
- 70-79: Buono — Buy moderato
- 60-69: Discreto — Hold
- 50-59: Neutro — Watch
- <50: Speculativo — Sell/Avoid

**Segnali di trading:**
🟢 Strong Buy: confluenza di tutti i fattori positivi
🔵 Buy: fondamentali solidi, trend favorevole
🟡 Hold: mantieni, aspetta catalizzatori
🔴 Sell: uscire dalla posizione

**Come viene calcolato:**
Il modello Claude AI analizza dati in tempo reale: rating critici aggregati, dati climatici storici Open-Meteo, storico prezzi Liv-ex, e indicatori di liquidità del mercato.`,
    quiz: [
      { q: "Qual è il fattore con il peso maggiore nell'AI Score di VinoInvest?", opts: ["Trend mercato (15%)", "Produttore (20%)", "Rating critico (30%)", "Rischio (10%)"], ans: 2 },
      { q: "Un vino con AI Score 87 riceve quale segnale?", opts: ["Strong Buy", "Buy", "Hold", "Sell"], ans: 1 },
      { q: "Quale fonte di dati climatici usa VinoInvest per la qualità dell'annata?", opts: ["NOAA", "Meteo France", "Open-Meteo", "Weather.com"], ans: 2 },
      { q: "Un AI Score sotto quale soglia indica una raccomandazione Sell/Avoid?", opts: ["60", "70", "50", "40"], ans: 2 },
    ],
  },
  {
    id: 4, title: "I vini di investimento top", icon: "🏆", duration: "10 min",
    level: "Intermedio",
    content: `**TIER 1 — Blue Chip (€2.000-€50.000+ a bottiglia)**

Bordeaux 5 Premiers Crus:
- Château Pétrus (Pomerol) — il più costoso, 100% Merlot
- Château Lafite Rothschild — preferred dai collezionisti asiatici
- Château Margaux — il più elegante, spesso il migliore dei 5
- Château Mouton Rothschild — unico premier cru promosso nel 1973
- Château Haut-Brion — il più antico, terroir unico di Pessac

Borgogna DRC:
- Romanée-Conti — il vino più costoso al mondo (~€30.000/bt)
- La Tâche, Richebourg, Romanée-Saint-Vivant

**TIER 2 — Premium (€200-€2.000)**
- Barolo: Giacomo Conterno Monfortino, Gaja Barbaresco
- Toscana: Sassicaia, Ornellaia, Masseto
- Borgogna: Rousseau, Leroy, Ponsot
- Champagne: Krug, Louis Roederer Cristal, Dom Pérignon

**TIER 3 — Investimento accessibile (€50-€200)**
- Barolo e Barbaresco da piccoli produttori di qualità
- Côtes du Rhône Hermitage, Châteauneuf-du-Pape
- Vini spagnoli: Vega Sicilia Único, Pingus
- Toscana: Brunello di Montalcino DOCG

**Regola d'oro:** Acquista solo quello che beresti, così anche nel peggior scenario hai una bella bottiglia.`,
    quiz: [
      { q: "Qual è il vino più costoso al mondo per bottiglia?", opts: ["Château Pétrus", "Romanée-Conti", "Château Margaux", "Dom Pérignon"], ans: 1 },
      { q: "Quale château di Bordeaux è stato promosso a Premier Cru nel 1973?", opts: ["Haut-Brion", "Lafite Rothschild", "Mouton Rothschild", "Pétrus"], ans: 2 },
      { q: "In quale fascia di prezzo per bottiglia si trovano i vini Tier 2 Premium?", opts: ["€50-€200", "€200-€2.000", "€2.000-€50.000", "Sotto €50"], ans: 1 },
      { q: "Quale vino italiano Tier 2 è prodotto a Bolgheri, Toscana?", opts: ["Barolo Monfortino", "Brunello Cerbaiona", "Sassicaia", "Amarone Bertani"], ans: 2 },
    ],
  },
  {
    id: 5, title: "Costruire un portfolio vino", icon: "💼", duration: "8 min",
    level: "Intermedio",
    content: `**Principio di diversificazione:**

Un portfolio vino ben costruito dovrebbe coprire:
- 3+ regioni diverse (riduce rischio geografico)
- 3+ annate diverse (riduce rischio annata)
- Mix di liquidità: 60% vini blue chip + 40% emerging

**Esempio portfolio €10.000:**
- Château Léoville Barton 2018: 3 bt × €120 = €360
- Barolo Brunate Rinaldi 2019: 6 bt × €80 = €480
- Brunello Montalcino Cerbaiona 2016: 3 bt × €150 = €450
- Burgundy Village Leroy 2020: 6 bt × €120 = €720
- Dom Pérignon 2015: 3 bt × €220 = €660
Totale: €2.670 → restante per opportunità

**Regole di gestione:**
1. Non vendere prima di 5 anni per vini top
2. Controlla l'inventory con VinoInvest ogni trimestre
3. Assicura la cantina (stimata 0.5-1% del valore annuo)
4. Considera stoccaggio professionale se >€50.000
5. Mantieni documentazione: fatture, provenance, foto

**Uscita dall'investimento:**
- Aste: per vini >€500/bt (minor spread)
- Merchant: per volumi medi (velocità)
- Wine-Searcher: per verificare il miglior prezzo attuale`,
    quiz: [
      { q: "Qual è la distribuzione consigliata in un portfolio vino?", opts: ["100% blue chip", "60% blue chip + 40% emerging", "50% blue chip + 50% emerging", "80% emerging + 20% blue chip"], ans: 1 },
      { q: "Dopo quanti anni è consigliato vendere i vini top per massimizzare il rendimento?", opts: ["1-2 anni", "3 anni", "5 anni o più", "10+ anni sempre"], ans: 2 },
      { q: "Per vini sopra quale prezzo per bottiglia è consigliato vendere tramite aste?", opts: ["€100/bt", "€200/bt", "€500/bt", "€1.000/bt"], ans: 2 },
      { q: "Quante regioni minime dovrebbe coprire un portfolio diversificato?", opts: ["1", "2", "3 o più", "5 o più"], ans: 2 },
    ],
  },
  {
    id: 6, title: "Conservazione e storage", icon: "🏚️", duration: "6 min",
    level: "Principiante",
    content: `**La conservazione è fondamentale** — un vino mal conservato perde tutto il suo valore.

**Condizioni ideali:**
- 🌡️ Temperatura: 12-15°C costante (mai sopra 20°C)
- 💧 Umidità: 65-75% (protezione tappo di sughero)
- 🌑 Buio: niente luce UV (danneggiano i polifenoli)
- 🔇 Silenzio: zero vibrazioni (alterano sedimento)
- 🍾 Orizzontale: il tappo deve essere bagnato

**Opzioni di storage:**

Home cellar:
Pro: controllo totale, costo zero
Contro: dipendente da clima, non ottimale per tutti

Cantinetta elettrica:
Costo: €200-€2.000 — Capacità: 20-200 bottiglie
Adatta per investitori <€20.000 di portfolio

Storage professionale:
Costo: €10-30/cassa/anno
Servizi: temperatura garantita, assicurazione, inventario
Consigliato per: >50 bottiglie di valore

Stoccaggio bonded warehouse UK:
Vantaggio fiscale: no IVA fino alla vendita
Richiesto da Liv-ex e case d'aste top

**Certificato di provenienza:**
Conserva sempre: fattura originale, foto imballaggio, foto etichetta e capsula, documentazione temperature di trasporto.`,
    quiz: [
      { q: "Qual è il range di umidità ideale per conservare il vino da investimento?", opts: ["40-50%", "55-65%", "65-75%", "80-90%"], ans: 2 },
      { q: "Come devono essere posizionate le bottiglie da investimento?", opts: ["In verticale, tappo in alto", "In verticale, tappo in basso", "In orizzontale", "Non importa l'orientamento"], ans: 2 },
      { q: "Quale vantaggio fiscale offre lo stoccaggio in bonded warehouse UK?", opts: ["Detrazione IVA immediata", "Nessuna IVA fino alla vendita", "Aliquota IVA ridotta al 5%", "Esenzione totale dalle tasse"], ans: 1 },
      { q: "Da quante bottiglie in poi è consigliato lo storage professionale?", opts: ["10+", "20+", "50+", "100+"], ans: 2 },
    ],
  },
  {
    id: 7, title: "Annate migliori per regione", icon: "📅", duration: "5 min",
    level: "Intermedio",
    content: `**Bordeaux — Millésimes eccezionali:**
2000, 2005, 2009, 2010, 2015, 2016, 2019, 2020, 2022
Da evitare: 1997, 2002, 2007, 2013

**Borgogna:**
2005, 2010, 2012, 2015, 2019, 2020 (bilanciato)
2022 = considerata eccezionale dai critici

**Champagne:**
2002, 2008, 2012, 2015 = più cercate dai collezionisti
Cuvée millesimata: solo nelle annate migliori

**Barolo/Barbaresco:**
2010, 2013, 2016, 2019 = top assoluti
2015 = caldo ma elegante
2022 = molto promettente

**Brunello di Montalcino:**
2010, 2012, 2015, 2016, 2019 = eccezionali
Annate >5 anni migliori per investimento

**Napa Valley (Cabernet):**
2013, 2016, 2018, 2019 = top californiani

**Rioja (Tempranillo):**
2004, 2010, 2016, 2020 = investimento sicuro
Vega Sicilia Único: cerca annate 1994, 1999, 2004

Per score climatici basati su dati reali Open-Meteo, usa il filtro "Annata" in VinoInvest.`,
    quiz: [
      { q: "Quale annata di Bordeaux è considerata tra le migliori del secolo?", opts: ["2007", "2013", "2010", "1997"], ans: 2 },
      { q: "Quale annata di Champagne è tra le più ricercate dai collezionisti?", opts: ["2010", "2008", "2014", "2017"], ans: 1 },
      { q: "Quali annate di Barolo/Barbaresco sono considerati i top assoluti?", opts: ["2007, 2008, 2009", "2010, 2013, 2016, 2019", "2000, 2001, 2003", "2014, 2017, 2018"], ans: 1 },
      { q: "Quale annata di Bordeaux è considerata da evitare per investimento?", opts: ["2010", "2015", "2013", "2019"], ans: 2 },
    ],
  },
  {
    id: 8, title: "Glossario essenziale", icon: "📖", duration: "4 min",
    level: "Principiante",
    content: `**AOC/AOP**: Appellation d'Origine Contrôlée — denominazione geografica francese
**Assemblage**: blend di più vitigni o parcelle
**Biodynamic**: viticoltura biodinamica secondo il calendario lunare
**Brix**: misura della concentrazione zuccherina delle uve
**Château**: tenuta vitivinicola bordolese
**Cuvée**: selezione o blend specifico di un produttore
**DOC/DOCG**: denominazione italiana, DOCG = massima garanzia qualità
**DRC**: Domaine de la Romanée-Conti
**En primeur**: acquisto vino ancora in botte, ~18 mesi prima dell'imbottigliamento
**Grand Cru**: classificazione di eccellenza in Borgogna e Bordeaux
**Liv-ex**: London International Vintners Exchange — principale borsa fine wine
**Magnum**: formato 1,5L (= 2 bottiglie standard) — preferito dai collezionisti
**Millésime**: annata (francese)
**Négociant**: intermediario che acquista, eleva e commercializza vini
**Parker points**: punteggio 100/100 creato da Robert Parker
**Provenance**: documentazione della catena di custodia del vino
**Reserva**: in Spagna, invecchiamento minimo garantito
**ROI**: Return on Investment = (valore finale - prezzo acquisto) / prezzo acquisto
**Terroir**: insieme di suolo, microclima, esposizione che caratterizza un vigneto
**Vintage chart**: guida alle migliori annate per regione`,
    quiz: [
      { q: "Cosa significa l'acronimo DRC nel mondo del vino?", opts: ["Denominazione Regionale Controllata", "Domaine de la Romanée-Conti", "Directoire de Réglementation des Crus", "Domaine Rouge de Champagne"], ans: 1 },
      { q: "Cos'è il Liv-ex?", opts: ["Una rivista di settore londinese", "Il London International Vintners Exchange — principale borsa fine wine", "Un produttore di Bordeaux", "Un'app di wine tasting"], ans: 1 },
      { q: "Quanto vale un Magnum in bottiglie standard?", opts: ["1 bottiglia", "1.5 bottiglie", "2 bottiglie", "3 bottiglie"], ans: 2 },
      { q: "Cosa misura il Brix nel vino?", opts: ["L'acidità del vino", "La concentrazione di tannini", "La concentrazione zuccherina delle uve", "Il grado alcolico finale"], ans: 2 },
    ],
  },
  {
    id: 9, title: "Due Diligence e autenticità", icon: "🔍", duration: "7 min",
    level: "Avanzato",
    content: `**Il problema delle contraffazioni:**
Si stima che il 5-20% dei vini costosi sul mercato secondario siano falsi o mal etichettati. Il caso Rudy Kurniawan (2012) ha esposto frodi per milioni di dollari.

**Come verificare l'autenticità:**

1. Provenienza documentata
   - Fattura originale di acquisto dal produttore o merchant autorizzato
   - Catena di custodia continua e tracciabile
   - Temperatura di trasporto documentata

2. Controllo fisico della bottiglia
   - Livello del vino nel collo (ullage): accettabile per vini >15 anni
   - Etichetta: carta, inchiostro, caratteri tipografici coerenti con l'epoca
   - Capsula: tipo di metallo, colore, impressioni in rilievo
   - Tappatura: sughero con anno impresso, senza difetti

3. Database di riferimento
   - Wine-Searcher: prezzi medi di mercato
   - CellarTracker: note e recensioni community
   - Liv-ex: dati commerciali certificati

4. Autenticazione professionale
   - Servizi: Vinfolio, Acker Authentication
   - Costo: €15-50 per bottiglia
   - Fondamentale per bottiglie >€500

**Red flags:**
- Prezzo troppo basso rispetto al mercato
- Venditore senza storia verificabile
- Nessuna documentazione di provenienza
- Bottiglia trovata in condizioni di calore`,
    quiz: [
      { q: "Quale percentuale stimata dei vini costosi sul mercato secondario è contraffatta?", opts: ["Meno dell'1%", "5-20%", "30-40%", "Oltre il 50%"], ans: 1 },
      { q: "Cos'è l'ullage nel contesto del fine wine?", opts: ["Il documento di autenticità del vino", "Il livello del vino nel collo della bottiglia", "Il sistema di classificazione borgognone", "Il certificato di temperatura di trasporto"], ans: 1 },
      { q: "Quale caso di frode ha esposto contraffazioni per milioni nel 2012?", opts: ["Il caso Mondovino", "Il caso Lafite 2000", "Il caso Rudy Kurniawan", "Il caso Hardy Rodenstock"], ans: 2 },
      { q: "Da quale prezzo per bottiglia è fondamentale l'autenticazione professionale?", opts: ["€100", "€200", "€500", "€1.000"], ans: 2 },
    ],
  },
  {
    id: 10, title: "Fiscalità e aspetti legali", icon: "⚖️", duration: "6 min",
    level: "Avanzato",
    content: `**Il vino come investimento: aspetti fiscali chiave**

**Italia:**
- I proventi dalla vendita di vino sono considerati plusvalenze
- Se non è attività professionale: tassazione IRPEF in base allo scaglione
- Nessuna imposta patrimoniale specifica sul vino
- IVA 22% sugli acquisti (recuperabile solo da aziende)

**UK — Bonded Warehouse (In Bond):**
- Vino conservato "in bond" = nessuna IVA e dazi sospesi
- IVA pagata solo all'uscita (per consumo o vendita in UK)
- Vantaggio: liquidità dell'investimento non impegnata in tasse
- Principale mercato mondiale per fine wine non ancora svincolato

**Pianificazione successoria:**
- Il vino è un bene mobile: si include nell'asse ereditario
- Donazione vino: soggetta a imposta sulle donazioni
- Valutazione: basata sul prezzo di mercato al momento del trasferimento

**Aspetti legali internazionali:**
- Importare vino da UK post-Brexit: accise e IVA applicabili in Italia
- Etichettatura obbligatoria UE 2023: allergeni, calorie, valore nutrizionale
- Vino come commodity: scambiato anche su futures (Liv-ex OTC)

**Consiglio pratico:**
Per portfolio >€50.000 consulta un commercialista specializzato in beni alternativi. I costi di consulenza sono marginali rispetto al risparmio fiscale potenziale.`,
    quiz: [
      { q: "Quale vantaggio fiscale offre il bonded warehouse UK?", opts: ["Aliquota IVA ridotta al 5%", "IVA e dazi sospesi finché il vino è in bond", "Esenzione totale dalle imposte per sempre", "Detrazione del 50% del costo di acquisto"], ans: 1 },
      { q: "In Italia, come vengono tassati i proventi dalla vendita di vino da investimento?", opts: ["Sono esenti da tassazione", "Come plusvalenze, IRPEF secondo lo scaglione", "Imposta fissa del 26%", "Come redditi d'impresa sempre"], ans: 1 },
      { q: "Quale aliquota IVA si applica agli acquisti di vino in Italia?", opts: ["4%", "10%", "22%", "12%"], ans: 2 },
      { q: "Cosa prevede la normativa UE 2023 sull'etichettatura del vino?", opts: ["Solo il grado alcolico", "Indicazione della regione di produzione", "Allergeni, calorie e valore nutrizionale", "Certificazione biologica obbligatoria"], ans: 2 },
    ],
  },
];

function renderContent(text) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const clean = line.replace(/\*\*/g, "");
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} style={{ color: "#e2e8f0", fontWeight: 700, marginTop: 18, marginBottom: 6, fontSize: 15 }}>{clean}</p>;
    }
    if (line.startsWith("- ")) {
      return <p key={i} style={{ paddingLeft: 18, marginBottom: 5, color: "#94a3b8" }}>• {clean.slice(2)}</p>;
    }
    if (/^\d+\./.test(line)) {
      return <p key={i} style={{ paddingLeft: 18, marginBottom: 5, color: "#94a3b8" }}>{clean}</p>;
    }
    return <p key={i} style={{ marginBottom: 6, color: "#94a3b8" }}>{clean}</p>;
  });
}

const LEVEL_COLORS = { "Principiante": "#4ade80", "Intermedio": GOLD, "Avanzato": "#f87171" };

export default function Learn() {
  const [activeId, setActiveId] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [filterLevel, setFilterLevel] = useState("Tutti");

  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vino_lessons_v2") || "{}"); } catch { return {}; }
  });

  function saveCompleted(updated) {
    setCompleted(updated);
    localStorage.setItem("vino_lessons_v2", JSON.stringify(updated));
  }

  function openLesson(id) {
    setActiveId(id);
    setShowQuiz(false);
    setAnswers({});
    setQuizSubmitted(false);
  }

  function startQuiz() {
    setAnswers({});
    setQuizSubmitted(false);
    setShowQuiz(true);
  }

  function submitQuiz() {
    setQuizSubmitted(true);
    const course = COURSES.find(c => c.id === activeId);
    const correct = course.quiz.filter((q, i) => answers[i] === q.ans).length;
    const pct = Math.round((correct / course.quiz.length) * 100);
    if (pct >= 60) {
      const updated = { ...completed, [activeId]: { passed: true, score: pct, date: new Date().toISOString() } };
      saveCompleted(updated);
    }
  }

  const course = COURSES.find(c => c.id === activeId);
  const passedCount = Object.values(completed).filter(v => v.passed).length;
  const progress = Math.round((passedCount / COURSES.length) * 100);

  const filtered = filterLevel === "Tutti" ? COURSES : COURSES.filter(c => c.level === filterLevel);

  if (activeId && course) {
    const quizResult = (() => {
      if (!quizSubmitted) return null;
      const correct = course.quiz.filter((q, i) => answers[i] === q.ans).length;
      return { correct, total: course.quiz.length, pct: Math.round((correct / course.quiz.length) * 100) };
    })();
    const isPassed = completed[activeId]?.passed;

    return (
      <div style={{ minHeight: "100vh", background: "#060d1a", padding: "32px 24px", maxWidth: 860, margin: "0 auto" }}>
        <button
          onClick={() => setActiveId(null)}
          style={{ background: "none", border: "1px solid rgba(30,41,59,0.6)", color: "#94a3b8", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, marginBottom: 28, fontFamily: "inherit" }}
        >← Torna ai corsi</button>

        <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 18, padding: "32px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span style={{ fontSize: 44 }}>{course.icon}</span>
              <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 800, margin: "10px 0 4px" }}>{course.title}</h2>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: "#64748b", fontSize: 12 }}>⏱ {course.duration}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: LEVEL_COLORS[course.level] + "22", color: LEVEL_COLORS[course.level], fontWeight: 700 }}>{course.level}</span>
              </div>
            </div>
            {isPassed && <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 700 }}>✓ Completato ({completed[activeId].score}%)</span>}
          </div>

          {!showQuiz ? (
            <>
              <div style={{ marginBottom: 32 }}>{renderContent(course.content)}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={startQuiz}
                  style={{ padding: "12px 24px", background: `linear-gradient(135deg, ${GOLD}, #a37e1a)`, color: "#0a0f1e", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
                >
                  {isPassed ? "Ripeti il Quiz" : "Inizia Quiz →"}
                </button>
                {!isPassed && (
                  <button
                    onClick={() => { const u = { ...completed, [activeId]: { passed: true, score: 100, date: new Date().toISOString() } }; saveCompleted(u); }}
                    style={{ padding: "12px 24px", background: "none", color: "#64748b", border: "1px solid rgba(30,41,59,0.6)", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}
                  >
                    Segna come letto
                  </button>
                )}
              </div>
            </>
          ) : (
            <div>
              <h3 style={{ color: GOLD, fontSize: 16, fontWeight: 800, marginBottom: 24 }}>Quiz — {course.quiz.length} domande</h3>
              {course.quiz.map((q, qi) => {
                const userAns = answers[qi];
                const isCorrect = userAns === q.ans;
                return (
                  <div key={qi} style={{ marginBottom: 28 }}>
                    <p style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{qi + 1}. {q.q}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {q.opts.map((opt, oi) => {
                        let bg = "rgba(15,23,42,0.6)";
                        let border = "rgba(30,41,59,0.5)";
                        let color = "#94a3b8";
                        if (quizSubmitted) {
                          if (oi === q.ans) { bg = "rgba(74,222,128,0.1)"; border = "#4ade80"; color = "#4ade80"; }
                          else if (oi === userAns && !isCorrect) { bg = "rgba(248,113,113,0.1)"; border = "#f87171"; color = "#f87171"; }
                        } else if (oi === userAns) {
                          bg = "rgba(201,162,39,0.12)"; border = GOLD; color = GOLD;
                        }
                        return (
                          <button
                            key={oi}
                            disabled={quizSubmitted}
                            onClick={() => !quizSubmitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                            style={{ padding: "11px 16px", textAlign: "left", background: bg, border: `1px solid ${border}`, borderRadius: 9, color, cursor: quizSubmitted ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, transition: "all 0.15s" }}
                          >{opt}</button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < course.quiz.length}
                  style={{ padding: "13px 28px", background: Object.keys(answers).length < course.quiz.length ? "#1e293b" : `linear-gradient(135deg, ${GOLD}, #a37e1a)`, color: Object.keys(answers).length < course.quiz.length ? "#475569" : "#0a0f1e", border: "none", borderRadius: 10, fontWeight: 800, cursor: Object.keys(answers).length < course.quiz.length ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 14 }}
                >
                  Invia risposte ({Object.keys(answers).length}/{course.quiz.length})
                </button>
              ) : (
                <div style={{ marginTop: 8 }}>
                  <div style={{ padding: 20, borderRadius: 12, background: quizResult.pct >= 60 ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${quizResult.pct >= 60 ? "#4ade80" : "#f87171"}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{quizResult.pct >= 60 ? "🎉" : "📚"}</div>
                    <p style={{ color: quizResult.pct >= 60 ? "#4ade80" : "#f87171", fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>
                      {quizResult.correct}/{quizResult.total} corrette — {quizResult.pct}%
                    </p>
                    <p style={{ color: "#64748b", fontSize: 13 }}>
                      {quizResult.pct >= 60 ? "Ottimo! Lezione completata con successo." : "Punteggio insufficiente (min 60%). Rileggi la lezione e riprova."}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button onClick={() => setShowQuiz(false)} style={{ padding: "11px 22px", background: "none", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 9, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Rileggi lezione</button>
                    {quizResult.pct < 60 && <button onClick={startQuiz} style={{ padding: "11px 22px", background: `linear-gradient(135deg, ${GOLD}, #a37e1a)`, color: "#0a0f1e", border: "none", borderRadius: 9, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Riprova Quiz</button>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#060d1a", padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: GOLD, fontSize: 30, fontWeight: 900, margin: "0 0 6px" }}>🎓 Wine Investment Academy</h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>
          {COURSES.length} corsi gratuiti · quiz finali · traccia i tuoi progressi
        </p>

        {/* Overall progress */}
        <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>Progresso totale</span>
              <span style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>{passedCount}/{COURSES.length}</span>
            </div>
            <div style={{ height: 7, background: "rgba(30,41,59,0.7)", borderRadius: 4 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${GOLD}, #4ade80)`, borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
          {passedCount === COURSES.length && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>🏅</span>
              <span style={{ color: "#4ade80", fontWeight: 800, fontSize: 14 }}>Corso completato!</span>
            </div>
          )}
        </div>

        {/* Level filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Tutti", "Principiante", "Intermedio", "Avanzato"].map(lv => (
            <button
              key={lv}
              onClick={() => setFilterLevel(lv)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filterLevel === lv ? GOLD : "rgba(30,41,59,0.6)"}`, background: filterLevel === lv ? GOLD + "22" : "transparent", color: filterLevel === lv ? GOLD : "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >{lv}</button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {filtered.map(c => {
          const done = completed[c.id]?.passed;
          const score = completed[c.id]?.score;
          return (
            <div
              key={c.id}
              onClick={() => openLesson(c.id)}
              style={{
                background: done ? "rgba(74,222,128,0.04)" : "rgba(15,23,42,0.8)",
                border: done ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(30,41,59,0.5)",
                borderRadius: 15, padding: "22px 20px", cursor: "pointer",
                transition: "all 0.2s", position: "relative",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = done ? "rgba(74,222,128,0.3)" : "rgba(30,41,59,0.5)"}
            >
              {done && (
                <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  ✓ {score}%
                </span>
              )}
              <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#475569" }}>Corso {c.id} · {c.duration}</span>
                <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 20, background: LEVEL_COLORS[c.level] + "22", color: LEVEL_COLORS[c.level], fontWeight: 700 }}>{c.level}</span>
              </div>
              <h3 style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>{c.title}</h3>
              <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>{c.quiz.length} domande quiz</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
