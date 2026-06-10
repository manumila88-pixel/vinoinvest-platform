import { useState } from "react";
import { Helmet } from "react-helmet-async";

const PLATFORMS = [
  {
    id: "wine-searcher",
    name: "Wine-Searcher",
    logo: "🔍",
    tagline: "Il motore di ricerca globale per il vino",
    reliability: 5,
    specialty: "Confronto prezzi globale · 10+ milioni di vini · Dati Liv-ex",
    description: "Wine-Searcher è il punto di riferimento mondiale per confrontare i prezzi del vino da migliaia di commercianti in tutto il mondo. Indicato per trovare le offerte migliori e monitorare il valore di mercato.",
    pros: [
      "Copertura globale (67+ paesi, 100k+ commercianti)",
      "Storico prezzi per ogni vino",
      "Dati Liv-ex integrati — prezzi autentici di mercato",
      "App mobile potente",
      "Versione gratuita già utile",
    ],
    cons: [
      "Non vende direttamente — rimanda ai merchant",
      "Piano Pro necessario per dati storici completi (€9/mese)",
      "Interfaccia densa, curva di apprendimento",
    ],
    costs: "Gratuito per ricerca base. Pro: €9/mese (storico prezzi + alert + export)",
    steps: [
      "Vai su wine-searcher.com o scarica l'app",
      "Cerca il vino per nome, produttore o barcode",
      "Clicca su un'offerta → verrai reindirizzato al commerciante",
      "Confronta almeno 3 offerte — considera spedizione e dazio",
      "Attiva un alert prezzo gratuito per monitorare le variazioni",
    ],
    link: "https://www.wine-searcher.com",
    color: "#1e40af",
    bgColor: "rgba(30,64,175,0.08)",
    borderColor: "rgba(30,64,175,0.25)",
    badge: "Migliore per prezzi",
  },
  {
    id: "vivino",
    name: "Vivino",
    logo: "🍇",
    tagline: "La community più grande al mondo per il vino",
    reliability: 4,
    specialty: "Community · Recensioni · Scan etichette",
    description: "Vivino è il marketplace social del vino con oltre 60 milioni di utenti. Ideale per scoprire nuovi vini tramite recensioni peer-to-peer e per acquistare bottiglie a prezzi competitivi.",
    pros: [
      "60+ milioni di recensioni utenti",
      "Scan etichetta con fotocamera per identificazione istantanea",
      "Prezzi competitivi su selezione curata",
      "Spedizione rapida in Italia",
      "Abbinamenti cibo-vino personalizzati",
    ],
    cons: [
      "Catalogo più ristretto rispetto a Wine-Searcher",
      "Rating community può divergere da critica professionale",
      "Alcune etichette rare non disponibili",
    ],
    costs: "Gratuito. Spedizione da €6,90. Vivino Premium: €3/mese",
    steps: [
      "Scarica l'app Vivino (iOS/Android) o vai su vivino.com",
      "Fotografa l'etichetta per vedere rating e prezzo",
      "Filtra per punteggio, prezzo, regione",
      "Aggiungi al carrello e checkout con carta o PayPal",
      "Segui il tracker di spedizione nell'app",
    ],
    link: "https://www.vivino.com",
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.08)",
    borderColor: "rgba(124,58,237,0.25)",
    badge: "Migliore per scoperta",
  },
  {
    id: "tannico",
    name: "Tannico",
    logo: "🇮🇹",
    tagline: "Il leader italiano per il vino online",
    reliability: 5,
    specialty: "Vini italiani · Cantina digitale · Servizio premium",
    description: "Tannico è la piattaforma di riferimento per i vini italiani, con oltre 15.000 etichette e un servizio clienti eccellente. Acquisita da Campari Group, garantisce autenticità e logistica impeccabile.",
    pros: [
      "Maggior specializzazione in vini italiani al mondo",
      "15.000+ etichette con descrizioni dettagliate",
      "Cantina digitale per gestire la tua collezione",
      "Consegna garantita in 24-48h",
      "Packaging premium con protezione antigelo",
    ],
    cons: [
      "Prezzi leggermente superiori alla media",
      "Meno vini francesi e del Nuovo Mondo",
      "Spedizione non sempre inclusa sotto €79",
    ],
    costs: "Spedizione gratuita sopra €79. Da €6 sotto soglia. Tannico+ (abbonamento vantaggi): €39/anno",
    steps: [
      "Vai su tannico.it e crea un account gratuito",
      "Usa i filtri avanzati: regione, vitigno, fascia prezzo",
      "Leggi la scheda tecnica — Tannico aggiunge note editoriali",
      "Aggiungi al carrello, scegli consegna standard o express",
      "Configura la cantina digitale per tracciare gli acquisti",
    ],
    link: "https://www.tannico.it",
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.08)",
    borderColor: "rgba(220,38,38,0.25)",
    badge: "Top per vini italiani",
  },
  {
    id: "millesima",
    name: "Millesima",
    logo: "🏰",
    tagline: "Grande selezione di Bordeaux e vini da investimento",
    reliability: 5,
    specialty: "Bordeaux · En Primeur · Vini da investimento",
    description: "Millesima è il punto di riferimento europeo per i grandi Bordeaux e per i vini da investimento. Con 3 milioni di bottiglie in magazzino a Bordeaux, offre autenticità certificata e conservazione professionale.",
    pros: [
      "3 milioni di bottiglie in magazzino a Bordeaux",
      "Autenticità garantita per ogni bottiglia",
      "En Primeur: accesso alle campagne Bordeaux",
      "Conservazione professionale a temperatura controllata",
      "Certificato di provenienza per ogni acquisto",
    ],
    cons: [
      "Focalizzato su fascia alta (prezzi da €50+)",
      "Navigazione meno intuitiva",
      "Spedizione internazionale lenta (7-14 giorni)",
    ],
    costs: "Spedizione variabile per paese. Dazio/IVA a carico dell'acquirente per import fuori UE. Magazzinaggio incluso.",
    steps: [
      "Vai su millesima.com (disponibile in italiano)",
      "Filtra per 'Bordeaux', 'Borgogna' o 'Vini da investimento'",
      "Controlla il vintage e le note di valutazione (Robert Parker, Wine Spectator)",
      "Scegli quantità (formati: bottiglia, cassa, magnum)",
      "Richiedi certificato di provenienza alla cassa",
    ],
    link: "https://www.millesima.it",
    color: "#92400e",
    bgColor: "rgba(146,64,14,0.08)",
    borderColor: "rgba(146,64,14,0.25)",
    badge: "Migliore per Bordeaux",
  },
  {
    id: "idealwine",
    name: "iDealwine",
    logo: "🔨",
    tagline: "Aste online per vini fini e da collezione",
    reliability: 4,
    specialty: "Aste · Borgogna · Vini rari · Collezioni private",
    description: "iDealwine è la principale casa d'aste online per vini fini, con oltre 3 milioni di bottiglie vendute. Specializzata in Borgogna e vini rari provenienti da cantine private, è il posto giusto per trovare perle introvabili.",
    pros: [
      "Accesso a vini fuori mercato da cantine private",
      "Borgogna eccezionale — DRC, Leroy, Rousseau",
      "Stima del valore pre-asta trasparente",
      "Acquisto diretto (oltre alle aste)",
      "Gestione completa per chi vuole vendere",
    ],
    cons: [
      "Commissioni acquirente: 15-20% del prezzo",
      "Tempi di consegna più lunghi (aste mensili)",
      "Richiede iscrizione e verifica identità",
    ],
    costs: "Commissione acquirente 15-20%. Spedizione da €15 per cassa. Nessun abbonamento richiesto.",
    steps: [
      "Registrati su idealwine.com con documento d'identità",
      "Sfoglia le aste in corso o il catalogo diretto",
      "Imposta un'offerta massima — il sistema rilancia automaticamente",
      "Se aggiudicato, ricevi fattura entro 24h",
      "Organizza spedizione o ritiro in magazzino (Parigi/Lyon)",
    ],
    link: "https://www.idealwine.com",
    color: "#0f766e",
    bgColor: "rgba(15,118,110,0.08)",
    borderColor: "rgba(15,118,110,0.25)",
    badge: "Migliore per aste",
  },
];

function StarRating({ rating, color = "#C9A227" }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i <= rating ? color : "none"} stroke={color} strokeWidth="1.5">
          <polygon points="10,1 12.9,7 19.5,7.6 14.8,11.9 16.3,18.5 10,15 3.7,18.5 5.2,11.9 0.5,7.6 7.1,7" />
        </svg>
      ))}
    </div>
  );
}

function StepCard({ step, number }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(30,41,59,0.3)" }}>
      <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "rgba(201,162,39,0.15)", border: "1.5px solid rgba(201,162,39,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#C9A227" }}>
        {number}
      </div>
      <p style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", lineHeight: 1.5 }}>{step}</p>
    </div>
  );
}

export default function PlatformGuide() {
  const [active, setActive] = useState(null);

  return (
    <>
      <Helmet>
        <title>Guida Piattaforme di Acquisto Vino | VinoInvest</title>
        <meta name="description" content="Confronto completo delle migliori piattaforme per acquistare vini fine: Wine-Searcher, Vivino, Tannico, Millesima, iDealwine. Pro, contro, commissioni, step-by-step." />
      </Helmet>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>Guida VinoInvest</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
            Dove Comprare Vini da Investimento
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            Confronto completo delle 5 piattaforme principali — affidabilità, commissioni, specialità e guida step-by-step per il primo acquisto.
          </p>
        </div>

        {/* Platform cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {PLATFORMS.map(p => {
            const isOpen = active === p.id;
            return (
              <div
                key={p.id}
                style={{
                  background: isOpen ? p.bgColor : "rgba(11,18,32,0.85)",
                  border: `1.5px solid ${isOpen ? p.borderColor : "rgba(30,41,59,0.5)"}`,
                  borderRadius: 18,
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                }}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => setActive(isOpen ? null : p.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
                    background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 32 }}>{p.logo}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", fontFamily: "'Playfair Display', Georgia, serif" }}>{p.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}>{p.badge}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{p.tagline}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#3a5a7a" }}>{p.specialty}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <StarRating rating={p.reliability} color={p.color} />
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: "0 24px 28px" }}>
                    <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, marginBottom: 24, paddingTop: 4, borderTop: "1px solid rgba(30,41,59,0.4)" }}>
                      {p.description}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                      {/* Pro */}
                      <div>
                        <p style={labelStyle}>Punti di forza</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {p.pros.map((pro, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", fontSize: 13, color: "#94a3b8" }}>
                              <span style={{ color: "#4ade80", marginTop: 2, flexShrink: 0 }}>✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Contro */}
                      <div>
                        <p style={labelStyle}>Limitazioni</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {p.cons.map((con, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", fontSize: 13, color: "#94a3b8" }}>
                              <span style={{ color: "#f87171", marginTop: 2, flexShrink: 0 }}>✗</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Costi */}
                    <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Commissioni e Costi</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{p.costs}</p>
                    </div>

                    {/* Step by step */}
                    <p style={labelStyle}>Primo Acquisto — Step by Step</p>
                    <div style={{ marginBottom: 20 }}>
                      {p.steps.map((step, i) => (
                        <StepCard key={i} step={step} number={i + 1} />
                      ))}
                    </div>

                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "10px 22px", borderRadius: 10,
                        background: `${p.color}18`, border: `1.5px solid ${p.color}44`,
                        color: p.color, fontSize: 13, fontWeight: 700, textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                    >
                      Visita {p.name} →
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 48, padding: "20px 24px", background: "rgba(11,18,32,0.7)", border: "1px solid rgba(30,41,59,0.4)", borderRadius: 14 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
            <strong style={{ color: "#94a3b8" }}>Nota VinoInvest:</strong> Questa guida è aggiornata al 2026 e basata sull'esperienza diretta dei nostri analisti. Le commissioni e le politiche di spedizione possono variare. VinoInvest non riceve commissioni da queste piattaforme.
            {" "}<a href="/disclaimer" style={{ color: "#C9A227" }}>Leggi il disclaimer →</a>
          </p>
        </div>
      </div>
    </>
  );
}

const labelStyle = { fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 0 };
