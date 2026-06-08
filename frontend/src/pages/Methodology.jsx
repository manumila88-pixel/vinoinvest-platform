import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function Methodology() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Metodologia AI Score | VinoInvest — Come Calcoliamo i Punteggi";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Scopri come VinoInvest calcola l'AI Score per ogni vino: punteggi critici, dati Liv-ex, qualità dell'annata, reputazione del produttore e analisi di liquidità."
    );
  }, []);

  const factors = [
    {
      icon: "⭐",
      name: "Punteggi Critici (30%)",
      desc: "Aggregiamo valutazioni da Wine Spectator, Robert Parker, Decanter, James Suckling e Gambero Rosso. Ogni critico ha un peso calibrato in base alla sua autorevolezza per regione."
    },
    {
      icon: "📈",
      name: "Dati di Mercato Liv-ex (25%)",
      desc: "Il Liv-ex (London International Vintners Exchange) fornisce i benchmark di prezzo più affidabili per il vino d'investimento. Monitoriamo 1000+ indici giornalieri."
    },
    {
      icon: "🌡️",
      name: "Qualità dell'Annata (20%)",
      desc: "Utilizziamo dati climatici storici Open-Meteo (temperatura, precipitazioni, radiation) combinati con il consensus critico per generare un Vintage Climate Score (0-100) per ogni regione e anno."
    },
    {
      icon: "🏆",
      name: "Reputazione del Produttore (15%)",
      desc: "Ogni produttore riceve uno score di reputazione basato su: storia, consistenza qualitativa, allocazioni limitate, presenza su Liv-ex e riconoscimenti internazionali."
    },
    {
      icon: "💧",
      name: "Liquidità di Mercato (10%)",
      desc: "Misuriamo quante transazioni avviene mensilmente su Liv-ex, la disponibilità su Wine-Searcher e la frequenza di passaggi in aste internazionali (Sotheby's, Christie's, Acker)."
    }
  ];

  const scoreRanges = [
    { range: "95-100", label: "Eccezionale", color: "#C9A227", desc: "Investimento di prima classe. Basso rischio, alta liquidità, potenziale di apprezzamento significativo." },
    { range: "90-94", label: "Ottimo", color: "#60a5fa", desc: "Investimento solido. Buona combinazione di qualità e valore. Consigliato per portafogli diversificati." },
    { range: "85-89", label: "Buono", color: "#4ade80", desc: "Vino di qualità con potenziale speculativo. Richiede maggiore attenzione alla finestra di consumo." },
    { range: "80-84", label: "Discreto", color: "#fbbf24", desc: "Investimento di nicchia. Adatto solo per collezionisti esperti con orizzonte temporale lungo." },
    { range: "<80", label: "Non raccomandato", color: "#ef4444", desc: "Fuori dai parametri di investimento standard. Priorità al consumo rispetto alla conservazione." }
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem", color: "#e2e8f0" }}>
      <nav style={{ fontSize: ".85rem", color: "#64748b", marginBottom: "1.5rem" }}>
        <a href="/" style={{ color: "#C9A227", textDecoration: "none" }}>Home</a> {" › "}
        <span>Metodologia AI Score</span>
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: ".75rem" }}>
        Metodologia AI Score
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "1.05rem", lineHeight: 1.7 }}>
        L'AI Score di VinoInvest è un punteggio composito (0-100) che aggrega dati da oltre 15 fonti
        per fornire una valutazione obiettiva del potenziale di investimento di ogni vino.
        Aggiornato automaticamente ogni settimana.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1.25rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Fattori e Pesi
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {factors.map(f => (
            <div key={f.name} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{f.icon}</span>
                <strong style={{ color: "#C9A227", fontSize: "1rem" }}>{f.name}</strong>
              </div>
              <p style={{ color: "#94a3b8", fontSize: ".9rem", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1.25rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Interpretazione del Punteggio
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {scoreRanges.map(s => (
            <div key={s.range} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: "1rem" }}>
              <div style={{ minWidth: 70, textAlign: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: s.color }}>{s.range}</div>
                <div style={{ fontSize: ".7rem", color: s.color, fontWeight: 600 }}>{s.label}</div>
              </div>
              <p style={{ color: "#94a3b8", fontSize: ".9rem", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Fonti dei Dati
        </h2>
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "1.25rem" }}>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {[
              ["Liv-ex", "London International Vintners Exchange — benchmark prezzi di mercato"],
              ["Wine Spectator", "Rivista americana con oltre 250.000 recensioni"],
              ["Robert Parker Wine Advocate", "Il critico più influente per Bordeaux e Rhône"],
              ["Decanter", "Rivista britannica di riferimento per il fine wine"],
              ["James Suckling", "Punteggi globali per vini europei e californiani"],
              ["Gambero Rosso", "Riferimento per vini italiani"],
              ["CellarTracker", "600.000+ note di degustazione della community"],
              ["Open-Meteo", "Dati climatici storici per il Vintage Climate Score"],
              ["Wikidata", "Dati strutturati su produttori e cantine"],
              ["Reddit r/wine", "Sentiment analysis della community vinicola"],
            ].map(([name, desc]) => (
              <li key={name} style={{ display: "flex", gap: ".75rem", color: "#94a3b8", fontSize: ".9rem" }}>
                <strong style={{ color: "#C9A227", minWidth: 160 }}>{name}</strong>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Segnali Buy/Sell/Hold
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "1rem" }}>
          I segnali di trading sono generati dall'algoritmo proprietario VinoInvest considerando:
        </p>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: "1.5rem" }}>
          <li>Momentum del prezzo negli ultimi 3, 6 e 12 mesi su Liv-ex</li>
          <li>Volume di transazioni mensili (indicatore di liquidità)</li>
          <li>Trend dei punteggi critici nel tempo</li>
          <li>Curva di maturazione dell'annata (finestra di consumo ottimale)</li>
          <li>Analisi AI del sentiment di mercato e notizie recenti</li>
          <li>Comparazione con benchmark regionali (Bordeaux 500, Burgundy 150, etc.)</li>
        </ul>
        <div style={{ background: "#0a1628", border: "1px solid #C9A22730", borderRadius: 8, padding: "1rem", marginTop: "1rem", fontSize: ".85rem", color: "#64748b" }}>
          <strong style={{ color: "#94a3b8" }}>Disclaimer:</strong> I segnali Buy/Sell/Hold sono informativi e non costituiscono consulenza finanziaria.
          VinoInvest non è un intermediario finanziario abilitato. Le performance passate non garantiscono risultati futuri.{" "}
          <a href="/disclaimer" style={{ color: "#C9A227" }}>Leggi il disclaimer completo →</a>
        </div>
      </section>
    </div>
  );
}
