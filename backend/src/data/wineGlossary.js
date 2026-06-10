/**
 * Wine investment glossary — terms used in AI advisor responses.
 * Italian primary, with English/French terms common in the market.
 */

export const GLOSSARY = [
  // ── Mercato e Trading ─────────────────────────────────────────────────────
  {
    term: "Liv-ex",
    category: "mercato",
    definition: "London International Vintners Exchange — la principale borsa internazionale del vino fine. Stabilisce prezzi di riferimento usati da merchant e investitori professionali.",
    equivalenti: [],
  },
  {
    term: "En primeur",
    category: "mercato",
    definition: "Sistema di vendita anticipata del vino prima dell'imbottigliamento, tipicamente 18-24 mesi prima della consegna. Permette ai châteaux di vendere il vino 'a futuro'. Diffuso soprattutto a Bordeaux.",
    equivalenti: ["wine futures", "futures"],
  },
  {
    term: "In bond (IB)",
    category: "mercato",
    definition: "Vino conservato in magazzino doganale che non ha ancora pagato accise e IVA. Prezzi più bassi, vantaggio fiscale nella rivendita. Non può essere consumato prima di uscire dal bond.",
    equivalenti: ["bonded", "entrepôt"],
  },
  {
    term: "Duty paid (DP)",
    category: "mercato",
    definition: "Vino che ha già pagato tutte le accise e imposte. Pronto per il consumo immediato. Prezzo più alto rispetto all'in bond.",
    equivalenti: [],
  },
  {
    term: "OWC",
    category: "mercato",
    definition: "Original Wooden Case — cassa di legno originale del produttore. Le bottiglie in OWC valgono 10-15% in più all'asta rispetto a bottiglie sfuse.",
    equivalenti: ["cassa originale", "wooden case"],
  },
  {
    term: "Buyer's premium",
    category: "mercato",
    definition: "Commissione aggiuntiva pagata dall'acquirente all'asta, in percentuale sul prezzo d'aggiudicazione. Tipicamente 15-25%. Da calcolare nel prezzo finale di acquisto.",
    equivalenti: ["diritti d'asta", "commissione acquirente"],
  },
  {
    term: "Hammer price",
    category: "mercato",
    definition: "Prezzo di aggiudicazione all'asta (il prezzo al colpo di martello). Non include il buyer's premium. Il costo finale è hammer price + buyer's premium + IVA.",
    equivalenti: ["prezzo di aggiudicazione", "prix d'adjudication"],
  },
  {
    term: "Allocation",
    category: "mercato",
    definition: "Quantità di vino riservata a un merchant o cliente specifico dal produttore. Per i vini più richiesti (DRC, Screaming Eagle) l'allocation è il principale bottleneck d'accesso.",
    equivalenti: ["allocazione", "allotment"],
  },
  {
    term: "Merchant",
    category: "mercato",
    definition: "Commerciante di vino professionale che acquista dai produttori e rivende agli investitori. Esempi: Berry Bros & Rudd, Farr Vintners, iDealwine.",
    equivalenti: ["négociant", "wine dealer"],
  },
  {
    term: "Négociant",
    category: "mercato",
    definition: "Termine francese per commerciante/intermediario nel mercato del vino. Acquista uve o vino sfuso dai produttori, lo affina e lo imbottiglia con il proprio marchio. A Bordeaux, i négociants gestiscono la Place de Bordeaux.",
    equivalenti: ["merchant", "commerciante"],
  },
  {
    term: "Place de Bordeaux",
    category: "mercato",
    definition: "Sistema di distribuzione del vino di Bordeaux che coinvolge tre livelli: Château (produttore) → Courtier (broker) → Négociant (distributore) → Merchant internazionale → Consumatore finale.",
    equivalenti: [],
  },

  // ── Qualità e Classificazioni ─────────────────────────────────────────────
  {
    term: "Grand Cru",
    category: "qualità",
    definition: "La classificazione più alta in Borgogna (33 vigneti Grand Cru) e Alsace. Indica il vigneto di massima qualità riconosciuto per legge. Non confondere con 'Grand Cru Classé' di Bordeaux che ha significato diverso.",
    equivalenti: ["Grande annata", "Großes Gewächs (Germania)"],
  },
  {
    term: "Premier Cru",
    category: "qualità",
    definition: "In Borgogna: vigneto di primo livello, sotto i Grand Cru ma sopra i Village wine. A Bordeaux con la Classificazione 1855: i 5 Premiers Crus Classés sono il top assoluto (Lafite, Latour, Margaux, Haut-Brion, Mouton).",
    equivalenti: ["1er Cru", "First Growth (Bordeaux)"],
  },
  {
    term: "DOCG",
    category: "qualità",
    definition: "Denominazione di Origine Controllata e Garantita — la massima classificazione italiana. Include Barolo, Barbaresco, Brunello di Montalcino, Chianti Classico, Amarone, Franciacorta.",
    equivalenti: ["DOC", "IGT"],
  },
  {
    term: "IGT",
    category: "qualità",
    definition: "Indicazione Geografica Tipica — classificazione italiana usata dai Super Tuscans (Sassicaia era IGT fino al 1994). Un vino IGT può essere di altissima qualità e prezzo nonostante la classificazione 'inferiore'.",
    equivalenti: ["Vino da Tavola (storico)", "IGP"],
  },
  {
    term: "Tre Bicchieri",
    category: "qualità",
    definition: "Massima valutazione del Gambero Rosso (Guida Vini d'Italia). Circa 500 vini/anno la ricevono. Equivalente italiano ai 90+ points delle guide internazionali.",
    equivalenti: ["Three Glasses"],
  },
  {
    term: "Parker 100",
    category: "qualità",
    definition: "Punteggio di 100/100 assegnato da Robert Parker — il massimo riconoscimento della critica mondiale. Storicamente può raddoppiare il prezzo di una bottiglia in settimane.",
    equivalenti: ["100 points", "Parker perfect"],
  },

  // ── Vino e Produzione ─────────────────────────────────────────────────────
  {
    term: "Terroir",
    category: "produzione",
    definition: "Concetto francese che sintetizza l'insieme di fattori naturali (suolo, clima, esposizione, topografia) che caratterizzano un vigneto e influenzano il gusto del vino. Fondamentale per la Borgogna.",
    equivalenti: [],
  },
  {
    term: "Ullage",
    category: "produzione",
    definition: "Spazio d'aria tra il tappo e il livello del vino nella bottiglia. Un ullage normale è 1-2 cm; un ullage elevato può indicare invecchiamento avanzato, evaporazione o problema di tenuta. Importante per autenticità.",
    equivalenti: ["headspace", "dépression"],
  },
  {
    term: "Millésime / Vintage",
    category: "produzione",
    definition: "Anno di raccolta dell'uva. La qualità del vintage è determinante per il valore del vino. Un grande vintage (2010, 2016, 2019 a Bordeaux) può valere 5-10x un vintage mediocre dello stesso produttore.",
    equivalenti: ["annata", "récolte"],
  },
  {
    term: "Decantare / Decanting",
    category: "produzione",
    definition: "Travasare il vino in un altro contenitore (decanter) per ossigenarlo prima della degustazione. Importante per vini rossi giovani o molto tannici. Influisce su quando aprire un vino da investimento.",
    equivalenti: ["decantation", "aerazione"],
  },
  {
    term: "Brettanomyces",
    category: "produzione",
    definition: "Lievito in cantina che può dare aromi di 'stalla', cuoio, fungo. In piccole quantità è tollerato o apprezzato (certi Bordeaux storici). In eccesso compromette il valore del vino.",
    equivalenti: ["Brett", "alterazione"],
  },
  {
    term: "Riserva",
    category: "produzione",
    definition: "Denominazione italiana per vini con invecchiamento minimo più lungo rispetto alla versione base. Es. Barolo Riserva (minimo 62 mesi vs 38 base), Brunello Riserva (6 anni). Generalmente maggior complessità e prezzo.",
    equivalenti: ["Reserva (Spagna)", "Réserve"],
  },

  // ── Investimento ──────────────────────────────────────────────────────────
  {
    term: "Blue chip (vino)",
    category: "investimento",
    definition: "Vini di massima liquidità e riconoscimento internazionale, con mercato secondario profondo. Include Bordeaux Premier Cru, Borgogna Grand Cru top, Champagne prestige. Analogo alle azioni blue chip.",
    equivalenti: ["vini di riferimento", "vini icona"],
  },
  {
    term: "Trophy wine",
    category: "investimento",
    definition: "Vino con status di 'oggetto del desiderio' assoluto. Produzione molto limitata, prezzo stellare. Esempi: DRC Romanée-Conti, Pétrus, Screaming Eagle, Le Pin. Acquistato per status e collezionismo oltre che per investimento.",
    equivalenti: ["vino trofeo", "iconic wine"],
  },
  {
    term: "Cult wine",
    category: "investimento",
    definition: "Vino con following di collezionisti appassionati, spesso con produzione limitatissima e lista d'attesa. Tipici esempi: Barolo Monfortino (Conterno), Screaming Eagle, Pingus. Diversi dai 'trophy' per storia più recente.",
    equivalenti: ["vino di culto"],
  },
  {
    term: "Sharpe Ratio",
    category: "investimento",
    definition: "Misura del rendimento aggiustato per il rischio: (rendimento - tasso risk-free) / volatilità. Il fine wine Liv-ex 100 ha Sharpe ~0.7, superiore a molti fondi azionari grazie alla bassa correlazione con i mercati.",
    equivalenti: ["indice di Sharpe"],
  },
  {
    term: "Correlazione",
    category: "investimento",
    definition: "Misura statistica di quanto due asset si muovono insieme (-1 a +1). Il fine wine ha correlazione ~0.1 con S&P 500 e ~0.05 con l'oro: eccellente diversificatore in un portafoglio tradizionale.",
    equivalenti: ["correlation"],
  },
  {
    term: "Drawdown",
    category: "investimento",
    definition: "Perdita massima dal picco al punto più basso. Il fine wine Liv-ex 100 ha max drawdown storico di -18% (vs -34% dell'S&P 500). Indicatore chiave del rischio downside.",
    equivalenti: ["max drawdown", "perdita massima"],
  },
  {
    term: "LWIN",
    category: "investimento",
    definition: "Liv-ex Wine Identification Number — codice univoco di 7, 11 o 18 cifre che identifica ogni vino nel sistema Liv-ex. Standard de facto per il commercio professionale. I primi 7 digits identificano il vino, i successivi indicano il vintage.",
    equivalenti: [],
  },
  {
    term: "NAV",
    category: "investimento",
    definition: "Net Asset Value — valore netto del portfolio wine calcolato ai prezzi di mercato correnti. Usato nei report B2B per mostrare la performance aggregata dei portfolio clienti.",
    equivalenti: ["valore netto", "Net Asset Value"],
  },
  {
    term: "Benchmark",
    category: "investimento",
    definition: "Indice di riferimento per confrontare le performance. Per il vino: Liv-ex Fine Wine 100. Confrontato con S&P 500, MSCI World e oro per mostrare l'alpha generato dalla selezione attiva.",
    equivalenti: ["indice di riferimento"],
  },
];

/** Search glossary by term or definition */
export function searchGlossary(query = "") {
  const q = query.toLowerCase().trim();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(entry =>
    entry.term.toLowerCase().includes(q) ||
    entry.definition.toLowerCase().includes(q) ||
    (entry.equivalenti || []).some(e => e.toLowerCase().includes(q))
  );
}

/** Get all terms for a specific category */
export function getGlossaryByCategory(category) {
  if (!category || category === "all") return GLOSSARY;
  return GLOSSARY.filter(e => e.category === category);
}

export const GLOSSARY_CATEGORIES = [
  { id: "mercato", label: "Mercato & Trading", icon: "📊" },
  { id: "qualità", label: "Qualità & Classificazioni", icon: "🏆" },
  { id: "produzione", label: "Vino & Produzione", icon: "🍇" },
  { id: "investimento", label: "Investimento", icon: "💰" },
];

export default GLOSSARY;
