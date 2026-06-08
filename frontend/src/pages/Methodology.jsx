import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const FACTORS = [
  {
    weight: "30%",
    name: "Punteggi Critici",
    color: "#C9A227",
    icon: "★",
    desc: "Aggregiamo valutazioni da Wine Spectator, Robert Parker Wine Advocate, Decanter, James Suckling e Gambero Rosso. Ogni critico ha un peso calibrato per regione di competenza. Il consenso critico è il predittore più affidabile del potenziale di apprezzamento a lungo termine.",
    why: "Studi Liv-ex mostrano correlazione 0.72 tra consensus critico >95pts e apprezzamento prezzi a 5 anni.",
    example: "Petrus 2019: 100/100 Parker + 98/100 Spectator → critic_score = 99 → contributo 29.7 punti",
  },
  {
    weight: "25%",
    name: "Dati di Mercato",
    color: "#60a5fa",
    icon: "◎",
    desc: "Il Liv-ex (London International Vintners Exchange) fornisce i benchmark di prezzo più affidabili per il fine wine. Monitoriamo volumi di transazione, spread bid/ask, momentum su 3/6/12 mesi e posizionamento rispetto all'indice Liv-ex 1000.",
    why: "Il momentum di prezzo su 6 mesi ha potere predittivo sui successivi 12 mesi con accuratezza del 68%.",
    example: "Vino con +12% su Liv-ex negli ultimi 6 mesi e volumi sopra media → market_trend_score = 78",
  },
  {
    weight: "20%",
    name: "Qualità Annata",
    color: "#34d399",
    icon: "◐",
    desc: "Vintage Climate Score proprietario basato su dati climatici ERA5 (Open-Meteo). Analizziamo temperatura media aprile-settembre, precipitazioni durante fioritura e raccolta, escursione termica e radiation solare per ogni zona di produzione. Combinato con consensus critico sull'annata.",
    why: "Le grandi annate apprezzano in media il 340% in più delle annate difficili sullo stesso produttore su 10 anni.",
    example: "Borgogna 2015: temperatura ottimale, precipitazioni sotto media, VCS = 94 → contributo 18.8 punti",
  },
  {
    weight: "15%",
    name: "Reputazione Produttore",
    color: "#a78bfa",
    icon: "◈",
    desc: "Producer Score costruito su: storia e consistenza qualitativa, allocazioni limitate (domanda > offerta), presenza e volumi su Liv-ex, riconoscimenti internazionali, management stabile, transizioni generazionali.",
    why: "I produttori con Producer Score >80 mantengono premium di prezzo del 45% rispetto alla media regionale.",
    example: "DRC: storia 400+ anni, allocazioni limitate, 100% su Liv-ex → producer_score = 98",
  },
  {
    weight: "10%",
    name: "Liquidità di Mercato",
    color: "#f87171",
    icon: "◉",
    desc: "Misuriamo la facilità di compravendita: transazioni mensili Liv-ex, disponibilità su Wine-Searcher, frequenza aste internazionali (Sotheby's, Christie's, Acker, Hart Davis Hart). Un vino illiquido è più rischioso indipendentemente dalla qualità.",
    why: "Vini con alta liquidità hanno bid/ask spread <3%, riducendo il costo implicito di transazione.",
    example: "Margaux 2016: 450+ transazioni Liv-ex/mese, 1.200 offer Wine-Searcher → liquidity_score = 88",
  },
];

const RANGES = [
  { range: "95–100", label: "Eccezionale", color: "#C9A227", desc: "Primo livello assoluto. Basso rischio, alta liquidità, apprezzamento significativo probabile." },
  { range: "90–94", label: "Eccellente", color: "#60a5fa", desc: "Investimento solido. Ottimo rapporto qualità/valore per portafogli diversificati." },
  { range: "85–89", label: "Buono", color: "#34d399", desc: "Qualità elevata con potenziale speculativo. Monitorare la finestra di consumo." },
  { range: "80–84", label: "Discreto", color: "#fbbf24", desc: "Nicchia specifica. Adatto per collezionisti esperti con orizzonte >7 anni." },
  { range: "<80", label: "Non raccomandato", color: "#ef4444", desc: "Fuori dai parametri standard. Priorità consumo vs conservazione." },
];

const SIGNALS = [
  { signal: "BUY", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", criteria: "AI Score >88, momentum +6m >8%, volume sopra media, annata nella finestra di potenziale o pre-picco, producer tier A/B." },
  { signal: "HOLD", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", criteria: "AI Score 75–88, prezzi stabili, vino nella finestra di consumo ottimale, sell signal non ancora attivato." },
  { signal: "SELL", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", criteria: "Vino oltre la finestra di consumo, trend prezzi -6m negativo, calo significativo volumi Liv-ex, AI Score <72." },
];

export default function Methodology() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Helmet>
        <title>Metodologia AI Score | VinoInvest — Trasparenza Totale sul Calcolo</title>
        <meta name="description" content="Come VinoInvest calcola l'AI Score: formula esatta con pesi, fonti dati, limitazioni oneste. Trasparenza istituzionale sul modello di valutazione del fine wine." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/metodologia" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "Come calcolare l'AI Score VinoInvest",
          "description": "Formula e metodologia per il calcolo dell'AI Score per investimento in fine wine",
          "totalTime": "PT5M",
          "step": FACTORS.map((f, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": f.name,
            "text": f.desc,
          })),
        })}</script>
      </Helmet>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", fontSize: 19, fontWeight: 800, cursor: "pointer" }}>VinoInvest</button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => navigate("/data-sources")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Fonti dati</button>
          <button onClick={() => navigate("/security")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Sicurezza</button>
          <button onClick={() => navigate("/b2b")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>B2B Professional</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "72px 24px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 12, color: "#64748b", marginBottom: 32 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", padding: 0, fontSize: 12 }}>Home</button>
          <span style={{ margin: "0 6px" }}>›</span>
          <span>Metodologia AI Score</span>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-block", background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontSize: 11, color: "#C9A227", letterSpacing: 2 }}>
            TRASPARENZA TOTALE
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
            Come calcoliamo l'AI Score:<br />
            <span style={{ color: "#C9A227" }}>la formula esatta</span>
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.8, maxWidth: 580, margin: "0 auto" }}>
            L'AI Score non è un black box. È una formula documentata con pesi espliciti,
            fonti verificabili e limitazioni oneste. Aggiornato automaticamente ogni settimana.
          </p>
        </div>

        {/* Formula visiva */}
        <section style={{ marginBottom: 64, background: "#0f1c2e", borderRadius: 20, padding: "36px", border: "1px solid #1e3050" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#475569", marginBottom: 28, textTransform: "uppercase", letterSpacing: 1 }}>Formula</h2>
          <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 15, color: "#e2e8f0", lineHeight: 2.2 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#C9A227", fontWeight: 700 }}>AI Score</span>
              <span style={{ color: "#475569" }}> = </span>
              <span style={{ color: "#fbbf24" }}>( critic_score </span>
              <span style={{ color: "#C9A227", fontWeight: 700 }}>× 0.30 )</span>
            </div>
            <div style={{ paddingLeft: 98 }}>
              <span style={{ color: "#475569" }}>+ </span>
              <span style={{ color: "#60a5fa" }}>( market_trend </span>
              <span style={{ color: "#C9A227", fontWeight: 700 }}>× 0.25 )</span>
            </div>
            <div style={{ paddingLeft: 98 }}>
              <span style={{ color: "#475569" }}>+ </span>
              <span style={{ color: "#34d399" }}>( vintage_score </span>
              <span style={{ color: "#C9A227", fontWeight: 700 }}>× 0.20 )</span>
            </div>
            <div style={{ paddingLeft: 98 }}>
              <span style={{ color: "#475569" }}>+ </span>
              <span style={{ color: "#a78bfa" }}>( producer_score </span>
              <span style={{ color: "#C9A227", fontWeight: 700 }}>× 0.15 )</span>
            </div>
            <div style={{ paddingLeft: 98 }}>
              <span style={{ color: "#475569" }}>+ </span>
              <span style={{ color: "#f87171" }}>( liquidity_score </span>
              <span style={{ color: "#C9A227", fontWeight: 700 }}>× 0.10 )</span>
            </div>
          </div>
          <div style={{ marginTop: 24, padding: "14px 20px", borderRadius: 10, background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)", fontSize: 13, color: "#94a3b8" }}>
            Ogni input è normalizzato 0–100. Il risultato è un punteggio composito 0–100.
            Tutti i sotto-punteggi sono calcolati con le stesse fonti e la stessa logica per ogni vino.
          </div>
        </section>

        {/* Fattori */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>I 5 fattori spiegati</h2>
          <p style={{ color: "#64748b", marginBottom: 36, fontSize: 14 }}>Perché questi pesi, quali fonti, un esempio reale per ognuno.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FACTORS.map(f => (
              <div key={f.name} style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 14, padding: "28px 28px", borderLeft: `3px solid ${f.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 22, color: f.color }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: f.color, fontWeight: 700 }}>Peso: {f.weight}</div>
                  </div>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{f.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ color: "#475569", fontWeight: 600 }}>Perché questo peso: </span>
                    <span style={{ color: "#64748b" }}>{f.why}</span>
                  </div>
                  <div style={{ fontSize: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace" }}>
                    <span style={{ color: "#475569", fontWeight: 600 }}>Esempio: </span>
                    <span style={{ color: "#64748b" }}>{f.example}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Score ranges */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28 }}>Interpretazione del punteggio</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {RANGES.map(r => (
              <div key={r.range} style={{ display: "flex", gap: 20, alignItems: "center", background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 10, padding: "14px 20px" }}>
                <div style={{ textAlign: "center", minWidth: 80 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: r.color }}>{r.range}</div>
                  <div style={{ fontSize: 11, color: r.color, fontWeight: 600 }}>{r.label}</div>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Segnali */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28 }}>Segnali Buy / Hold / Sell</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SIGNALS.map(s => (
              <div key={s.signal} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "18px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 900, fontSize: 14, color: s.color, minWidth: 40 }}>{s.signal}</span>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.criteria}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Confronto metodologie */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Confronto con metodologie di riferimento</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1e3050" }}>
                  {["Caratteristica", "VinoInvest AI Score", "Liv-ex Score", "Wine-Searcher Market Score"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fonti integrate", "9 fonti", "Dati exchange", "Prezzi retail"],
                  ["Qualità annata", "✓ VCS proprietario", "Parziale", "Non incluso"],
                  ["Sentiment community", "✓ CellarTracker + Reddit", "No", "No"],
                  ["Liquidità integrata", "✓ 10% del peso", "Sì (volumi)", "Parziale"],
                  ["Trasparenza formula", "✓ Pesi pubblicati", "Parziale", "Non documentato"],
                  ["Aggiornamento", "Settimanale", "Giornaliero", "In tempo reale"],
                  ["Coverage", "50.000+ vini", "~5.000 (exchange)", "2M+ (retail)"],
                ].map(([feat, vi, lx, ws], i) => (
                  <tr key={feat} style={{ borderBottom: "1px solid #1e3050", background: i % 2 === 0 ? "transparent" : "rgba(15,28,46,0.3)" }}>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontWeight: 600 }}>{feat}</td>
                    <td style={{ padding: "12px 16px", color: "#C9A227" }}>{vi}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{lx}</td>
                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{ws}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Limitazioni */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Limitazioni — onestà prima di tutto</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Prezzi storici stimati", "La maggior parte dei prezzi storici su VinoInvest sono stime algoritmiche, non transazioni Liv-ex reali. Il badge 'Verificata' indica dati da fonte primaria."],
              ["Copertura non uniforme", "La coverage è eccellente per Bordeaux, Borgogna, Champagne e top italiani. Regioni emergenti hanno dati storici limitati e AI Score meno accurati."],
              ["Critici non licenziati", "I punteggi critici sono aggregati da fonti pubbliche, non licenziati direttamente. Per punteggi ufficiali consultare le pubblicazioni originali."],
              ["Non è consulenza finanziaria", "L'AI Score è un indicatore informativo. Non costituisce e non sostituisce la consulenza di un professionista finanziario qualificato."],
            ].map(([title, body]) => (
              <div key={title} style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 12, padding: "18px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fbbf24", marginBottom: 8 }}>{title}</div>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div style={{ background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 10, padding: "16px 20px", fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
          <strong style={{ color: "#94a3b8" }}>Disclaimer:</strong> I segnali Buy/Sell/Hold e l'AI Score hanno scopo esclusivamente informativo.
          Non costituiscono consulenza finanziaria ai sensi del D.Lgs. 58/1998 (TUF).
          VinoInvest non è un intermediario finanziario regolamentato.
          {" "}<a href="/disclaimer" style={{ color: "#C9A227" }}>Leggi il disclaimer completo →</a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#334155", fontSize: 12 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Home", "/"], ["Fonti dati", "/data-sources"], ["Sicurezza", "/security"], ["B2B", "/b2b"], ["Privacy", "/privacy"], ["Termini", "/terms"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati.</div>
      </footer>
    </div>
  );
}
