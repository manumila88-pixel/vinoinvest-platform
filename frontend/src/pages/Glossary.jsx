import { useState, useEffect } from "react";

const TERMS = [
  { term: "AI Score", def: "Punteggio composito (0-100) calcolato da VinoInvest aggregando dati critici, di mercato, climatici e di liquidità per ogni vino." },
  { term: "Allocazione", def: "Quantità limitata di vino assegnata da una cantina a distributori o clienti selezionati prima della commercializzazione ufficiale." },
  { term: "Annata / Vintage", def: "Anno di raccolta dell'uva. Le annate eccezionali (es. 2010, 2016, 2019 per Bordeaux) possono valere il 20-50% in più rispetto ad annate normali." },
  { term: "AOC / AOP", def: "Appellation d'Origine Contrôlée/Protégée — sistema francese di tutela delle denominazioni geografiche vinicole." },
  { term: "Assemblaggio / Blend", def: "Vino ottenuto miscelando più varietà di uve o più annate. Comune nei Bordeaux (Cabernet Sauvignon + Merlot + Cabernet Franc)." },
  { term: "Asset Class", def: "Categoria di investimento con caratteristiche rischio/rendimento simili. Il fine wine è considerato un'asset class alternativa, come arte, gioielli e whisky raro." },
  { term: "Auction Premium", def: "Prezzo pagato all'asta rispetto al prezzo di mercato standard. Grandi annate DRC o Pétrus raggiungono spesso premi del 200-400%." },
  { term: "Barrique", def: "Botte da 225 litri (Bordeaux) o 228 litri (Borgogna) usata per affinamento. Il legno nuovo conferisce tannini, vanillina e complessità aromatica." },
  { term: "Bid/Ask Spread", def: "Differenza tra il prezzo offerto dagli acquirenti (Bid) e quello richiesto dai venditori (Ask) su piattaforme come Liv-ex. Spread basso = alta liquidità." },
  { term: "Bordeaux Futures / En Primeur", def: "Sistema di vendita anticipata dei vini di Bordeaux prima dell'imbottigliamento, tipicamente 18-24 mesi prima del rilascio ufficiale." },
  { term: "Botrytis Cinerea", def: "'Muffa nobile' che concentra gli zuccheri nell'uva disidratandola. Fondamentale per Sauternes (Château d'Yquem) e Tokaji." },
  { term: "Case (Cassa)", def: "Unità di misura standard nel mercato del fine wine: 12 bottiglie da 75cl, oppure 6 bottiglie da 1,5L (Magnum). I prezzi Liv-ex sono espressi per cassa." },
  { term: "Cellared Wine", def: "Vino conservato in condizioni ottimali (14-16°C, umidità 70-80%, oscurità totale) per affinamento a lungo termine. Elemento chiave per la valorizzazione." },
  { term: "Château", def: "Termine francese che designa una proprietà vinicola in Bordeaux. I 61 Châteaux classificati nel 1855 (Classification de Médoc) sono i benchmark del fine wine." },
  { term: "Classification 1855", def: "Classificazione dei migliori Châteaux di Bordeaux stabilita per l'Esposizione Universale del 1855. Divide i vini in 5 Crus Classés. Modificata solo una volta (Mouton Rothschild, 1973)." },
  { term: "Clos", def: "Vigneto recintato da muri, tradizione monastica borgognona. I Clos più famosi: Romanée-Conti, Clos de Vougeot, Clos du Mesnil (Krug)." },
  { term: "Corked Wine", def: "Vino difettato dal TCA (trichloroanisole) rilasciato da tappi di sughero contaminati. Odore di cartone bagnato. Rende il vino privo di valore collezionistico." },
  { term: "Critical Score", def: "Punteggio assegnato da critici professionisti su scala 100. Score 95+ indica eccellenza; 98+ è raro e spesso porta a forte apprezzamento." },
  { term: "DRC (Domaine de la Romanée-Conti)", def: "La cantina più famosa e costosa al mondo. Produce 8 Grand Cru in Borgogna. La Romanée-Conti supera i €25.000/bottiglia sul mercato secondario." },
  { term: "Decanting", def: "Operazione di versare il vino in un decanter per ossigenarlo e separarlo dai sedimenti. Vini vecchi e tannici beneficiano di 1-3 ore di decantazione." },
  { term: "DOC / DOCG", def: "Denominazione di Origine Controllata / Garantita — sistema italiano di classificazione vinicola. DOCG è il massimo livello (es. Barolo, Barbaresco, Brunello di Montalcino)." },
  { term: "En Primeur", def: "Vedi Bordeaux Futures. Acquistare en primeur permette prezzi inferiori ma implica un rischio di qualità finale e attesa di 2-3 anni per la consegna fisica." },
  { term: "Fine Wine", def: "Categoria di vini di eccellenza con potenziale di affinamento, liquidità di mercato e valore collezionistico. Tipicamente €50+ a bottiglia, score 90+ da critici riconosciuti." },
  { term: "First Growth", def: "Termine inglese per Premier Cru Classé di Bordeaux. I 5 First Growth: Lafite Rothschild, Mouton Rothschild, Margaux, Latour, Haut-Brion." },
  { term: "Freighting / Shipping Wine", def: "Trasporto di vino, particolarmente delicato: richiede temperature controllate (15-17°C), assenza di vibrazioni e luce. Costi medi €5-15/cassa per consegna in 2-4 settimane." },
  { term: "Grand Cru", def: "In Borgogna: la classificazione più alta per singoli vigneti (33 appellation). In Bordeaux: vini classificati nel sistema del 1855 o nel Classification Saint-Émilion." },
  { term: "Hectolitro (HL)", def: "Unità di misura della produzione vinicola (100 litri = 133 bottiglie). I Grand Cru borgognoni producono tipicamente 25-35 HL/ettaro (vs 50-60 per i vini commerciali)." },
  { term: "iDealWine", def: "Piattaforma francese di aste e vendita di vini pregiati. Importante per trovare prezzi di riferimento per vini europei." },
  { term: "Investment Grade Wine", def: "Vino con caratteristiche adeguate per l'investimento: punteggio critico 90+, produzione limitata, track record di apprezzamento e liquidità di mercato." },
  { term: "LWIN (Liv-ex Wine Number)", def: "Codice univoco Liv-ex per identificare ogni vino (produttore + nome + tipo). Fondamentale per comparare prezzi su diverse piattaforme senza ambiguità." },
  { term: "Liquidity", def: "Facilità con cui un vino può essere acquistato o venduto senza impattare significativamente il prezzo. Alta liquidità = spread bid/ask ridotto su Liv-ex." },
  { term: "Liv-ex", def: "London International Vintners Exchange — la principale borsa mondiale del vino d'investimento. Definisce il benchmark di prezzo per oltre 15.000 vini." },
  { term: "Liv-ex Fine Wine 1000", def: "Indice che traccia i prezzi degli ultimi 10 anni delle migliori 1000 referenze sul Liv-ex. Benchmark standard per valutare performance del mercato fine wine." },
  { term: "Magnifique Bouteille", def: "Termine colloquiale per definire bottiglie di eccezionale qualità e rarità. Formato Magnum (1,5L) è spesso considerato ideale per il collezionismo." },
  { term: "Magnum (1.5L)", def: "Formato da 1,5 litri (2 bottiglie). Il Magnum invecchia più lentamente e uniformemente del formato standard 75cl. Raramente disponibile, spesso vale 2,5-3x la bottiglia singola." },
  { term: "Maturity Window", def: "Periodo ottimale per consumare un vino. Es. Barolo Monfortino 2016: finestra 2030-2055. Vini fuori dalla finestra perdono valore rapidamente." },
  { term: "Merchant (Négociant)", def: "Intermediario che acquista uve o mosti da viticoltori per produrre, affinare e commercializzare vino. Louis Jadot, Boisset e Louis Latour sono i più noti in Borgogna." },
  { term: "Micro-oxygenation", def: "Tecnica enologica che introduce piccole quantità di ossigeno nel vino durante la fermentazione per stabilizzare il colore e ammorbidire i tannini." },
  { term: "Natural Wine", def: "Vino prodotto con intervento minimo in cantina, senza additivi. Difficile da valutare come investimento per instabilità in bottiglia e mancanza di storico." },
  { term: "Négociant", def: "Vedi Merchant. In Borgogna, i négociants acquistano vino in barrique dai domaine e lo imbottigliano con il loro brand. Maison Leroy e Joseph Drouhin sono esempi." },
  { term: "OWC (Original Wooden Case)", def: "Cassa originale in legno del produttore. Fondamentale per l'autenticità e il valore al rivendita. Un vino in OWC vale tipicamente 10-15% in più." },
  { term: "Parker Points", def: "Punteggi assegnati da Robert Parker su scala 100. Parker ha rivoluzionato il mercato del vino negli anni '80 con valutazioni che muovono prezzi globalmente." },
  { term: "Pétrus", def: "Il vino più costoso del Pomerol (Bordeaux). 100% Merlot su un'argilla unica (boutonnière argileuse). Produzione: ~2.500 casse/anno. Prezzo: €4.000-8.000/bottiglia." },
  { term: "Phylloxera", def: "Insetto parassita che distrusse i vigneti europei nel XIX secolo. Oggi tutte le viti sono innestate su portainnesti americani resistenti (eccetto Colheita e alcune Romanée-Conti)." },
  { term: "Portfolio Wine Management", def: "Gestione diversificata di investimenti vinicoli: mix di regioni, annate, fasce di prezzo. VinoInvest analizza la correlazione tra vini per ottimizzare il rischio." },
  { term: "Premier Cru (1er Cru)", def: "In Borgogna: seconda classificazione dopo Grand Cru. In Bordeaux (Médoc): i 5 First Growth. In Champagne: villaggi con rating storico massimo." },
  { term: "Provenance", def: "Provenienza e storia di custodia di una bottiglia. Provenance documentata (cantina, importatore, asta certificata) aumenta il valore e la sicurezza dell'acquisto." },
  { term: "Re-corking", def: "Operazione eseguita da cantine su vini molto vecchi per sostituire il tappo deteriorato e rabboccare il vino evaporato. Château Petrus offre questo servizio ogni 25 anni." },
  { term: "Riddling / Remuage", def: "In Champagne: processo di rotazione graduale delle bottiglie per raccogliere i sedimenti nel collo, prima della sboccatura (dégorgement)." },
  { term: "ROI (Return on Investment)", def: "Rendimento dell'investimento: (valore attuale − costo) ÷ costo. Nel fine wine va sempre calcolato al netto di costi di stoccaggio, assicurazione e commissioni. Per le serie storiche reali degli indici: liv-ex.com." },
  { term: "Sassicaia", def: "Il capostipite dei Super Tuscan (prima annata commercializzata: 1968), oggi tutelato dalla DOC Bolgheri Sassicaia. Tenuta San Guido, Bolgheri. Cabernet Sauvignon e Cabernet Franc. Considerato il 'Petite Pomerol' d'Italia." },
  { term: "Secondary Market", def: "Mercato di rivendita dei vini (opposto al mercato primario di produttori e distributori). Liv-ex, Sotheby's, Idealwine, Berry Bros & Rudd sono attori principali." },
  { term: "SGN (Sélection de Grains Nobles)", def: "In Alsazia: vendemmia tardiva di grappoli selezionati grano per grano, attaccati dalla botrytis. Equivalente tedesco: Trockenbeerenauslese (TBA)." },
  { term: "Solera", def: "Sistema di invecchiamento usato per Sherry, Madeira e alcuni Marsala. Consiste nel mescolare vini di diverse annate in botti decrescenti." },
  { term: "Sommelier", def: "Professionista specializzato nella selezione, servizio e abbinamento del vino. Il Master Sommelier (MS) è la certificazione più difficile al mondo." },
  { term: "Stock Market Correlation", def: "Il fine wine ha una correlazione di 0.1-0.2 con i mercati azionari (vs 0.6-0.8 di oro e immobili). Rende il wine portfolio un ottimo diversificatore." },
  { term: "Storage / Conservazione", def: "Condizioni ottimali: 14-16°C, umidità 70-80%, oscurità totale, assenza di vibrazioni. Alternativa: warehouse professionale a €0.50-2.00/cassa/mese." },
  { term: "Super Tuscan", def: "Vini toscani non conformi alle DOC tradizionali (Sangiovese + varietà internazionali). Sassicaia, Tignanello, Masseto, Ornellaia sono i più pregiati." },
  { term: "Tannini", def: "Composti fenolici presenti principalmente nelle bucce dell'uva. Conferiscono struttura e longevità al vino rosso. Ammorbidiscono con l'invecchiamento." },
  { term: "Terroir", def: "Insieme di fattori naturali che influenzano un vino: suolo, microclima, esposizione, topografia. La Romanée-Conti ha il terroir più studiato e valorizzato al mondo." },
  { term: "Ullage", def: "Spazio tra il vino e il tappo in una bottiglia, causato dall'evaporazione nel tempo. Livello basso (below capsule) riduce significativamente il valore collezionistico." },
  { term: "VDQS", def: "Vin Délimité de Qualité Supérieure — categoria francese obsoleta, abolita nel 2011. Storicamente intermedia tra Vin de Pays e AOC." },
  { term: "Vigneron", def: "Viticoltore che coltiva la vigna e produce il proprio vino. Distinto dal négociant che acquista uve. I vigneron de qualité sono la base del mercato fine wine." },
  { term: "Vini da Gastronomia vs Investimento", def: "I vini da gastronomia sono bevuti al picco della maturità. I vini da investimento hanno longevità di 20-50 anni e la capacità di apprezzarsi nel tempo. Non sempre coincidono." },
  { term: "Vintage Port", def: "Porto da singola annata eccezionale, imbottigliato dopo 2 anni. Invecchia bene per 30-50 anni. I migliori: Graham's 2016, Fonseca 2011, Quinta do Noval Nacional." },
  { term: "Wine Futures", def: "Vedi En Primeur. Contratti di acquisto anticipato prima che il vino sia imbottigliato. Rischi: qualità finale incerta, esposizione valutaria, tempi lunghi di consegna." },
  { term: "Wine Spectator", def: "La rivista americana più influente del settore. Pubblica punteggi su scala 100 e classifica ogni anno i '100 Best Wines'. Score 95+ garantisce spesso sell-out immediato." },
  { term: "Winemaker / Enologo", def: "Professionista responsabile delle scelte in cantina: vinificazione, affinamento, assemblaggio. Il winemaker firma lo stile di un vino (es. Michel Rolland per molti Bordeaux)." },
  { term: "Yield / Resa", def: "Quantità di uva prodotta per ettaro. Rese basse (25-35 hl/ha) concentrano i sapori e aumentano la qualità. I Grand Cru limitano la resa per decreto." },
];

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState("tutti");

  useEffect(() => {
    document.title = "Glossario Wine Investment | VinoInvest — 60 Termini Essenziali";
  }, []);

  const letters = ["tutti", ...new Set(TERMS.map(t => t.term[0].toUpperCase()).sort())];

  const filtered = TERMS.filter(t => {
    const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.def.toLowerCase().includes(search.toLowerCase());
    const matchLetter = letter === "tutti" || t.term[0].toUpperCase() === letter;
    return matchSearch && matchLetter;
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", color: "#e2e8f0" }}>
      <nav style={{ fontSize: ".85rem", color: "#64748b", marginBottom: "1.5rem" }}>
        <a href="/" style={{ color: "#C9A227", textDecoration: "none" }}>Home</a> {" › "}
        <span>Glossario Wine Investment</span>
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: ".5rem" }}>
        Glossario Wine Investment
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
        {TERMS.length} termini essenziali per investire in vino pregiato. Dal linguaggio Liv-ex ai metodi di vinificazione.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="search"
          placeholder="Cerca un termine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: ".6rem 1rem",
            background: "#111827", border: "1px solid #334155",
            borderRadius: 8, color: "#e2e8f0", fontSize: ".9rem"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {letters.map(l => (
          <button
            key={l}
            onClick={() => setLetter(l)}
            style={{
              padding: ".25rem .6rem", borderRadius: 6, fontSize: ".8rem",
              background: letter === l ? "#C9A227" : "#111827",
              color: letter === l ? "#020617" : "#94a3b8",
              border: "1px solid " + (letter === l ? "#C9A227" : "#334155"),
              cursor: "pointer", fontWeight: letter === l ? 700 : 400
            }}
          >
            {l === "tutti" ? "Tutti" : l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
        {filtered.length === 0 && (
          <p style={{ color: "#475569", textAlign: "center", padding: "2rem" }}>Nessun termine trovato.</p>
        )}
        {filtered.map(t => (
          <div
            key={t.term}
            id={`term-${t.term.replace(/\s+/g, "-").toLowerCase()}`}
            style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: "1rem 1.25rem" }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: ".75rem", marginBottom: ".3rem" }}>
              <strong style={{ color: "#C9A227", fontSize: "1rem" }}>{t.term}</strong>
            </div>
            <p style={{ color: "#94a3b8", fontSize: ".9rem", lineHeight: 1.6 }}>{t.def}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#0a1628", border: "1px solid #C9A22730", borderRadius: 8, fontSize: ".85rem", color: "#64748b" }}>
        Vuoi approfondire? Visita la nostra{" "}
        <a href="/academy" style={{ color: "#C9A227" }}>Wine Investment Academy</a>{" "}
        o esplora la{" "}
        <a href="/metodologia" style={{ color: "#C9A227" }}>Metodologia AI Score →</a>
      </div>
    </div>
  );
}
