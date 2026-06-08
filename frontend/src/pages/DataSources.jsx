import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SOURCES = [
  {
    name: "Liv-ex",
    type: "Prezzi di mercato",
    category: "Exchange",
    freq: "Giornaliera",
    affidabilita: "Verificata",
    color: "#34d399",
    desc: "London International Vintners Exchange. Il benchmark globale per i prezzi del fine wine. 500+ commercianti, 15.000+ vini tracciati, indici Liv-ex 50/100/500/1000.",
    url: "https://www.liv-ex.com",
    badge: "verified",
  },
  {
    name: "CellarTracker",
    type: "Note di degustazione",
    category: "Community",
    freq: "In tempo reale",
    affidabilita: "Verificata",
    color: "#34d399",
    desc: "La più grande community di degustatori online. 600.000+ note, 2.7M+ vini catalogati. Usato per sentiment analysis e validazione qualitativa.",
    url: "https://www.cellartracker.com",
    badge: "verified",
  },
  {
    name: "Wine-Searcher",
    type: "Prezzi retail",
    category: "Aggregatore",
    freq: "Settimanale",
    affidabilita: "Stimata",
    color: "#fbbf24",
    desc: "Aggregatore prezzi con 2M+ offerte da 45.000+ commercianti. Usato per confronto prezzi retail e disponibilità globale.",
    url: "https://www.wine-searcher.com",
    badge: "estimated",
  },
  {
    name: "Open-Meteo",
    type: "Dati climatici storici",
    category: "API pubblica",
    freq: "Stagionale",
    affidabilita: "Verificata",
    color: "#34d399",
    desc: "API meteorologica open source con dati ERA5 dal 1940. Temperatura, precipitazioni, radiazione solare per calcolo Vintage Climate Score (0-100) per ogni regione.",
    url: "https://open-meteo.com",
    badge: "verified",
  },
  {
    name: "Wikidata / DBpedia",
    type: "Dati strutturati produttori",
    category: "Linked Data",
    freq: "Mensile",
    affidabilita: "Verificata",
    color: "#34d399",
    desc: "Dati strutturati su cantine, produttori, appellazioni, certificazioni. Utilizzati per building Producer Score e validazione informazioni base.",
    url: "https://www.wikidata.org",
    badge: "verified",
  },
  {
    name: "Wine Spectator RSS",
    type: "News e recensioni",
    category: "Media",
    freq: "Giornaliera",
    affidabilita: "Stimata",
    color: "#fbbf24",
    desc: "Feed RSS di notizie dal mercato del vino. Utilizzato per news feed e sentiment analysis.",
    url: "https://www.winespectator.com",
    badge: "estimated",
  },
  {
    name: "Decanter",
    type: "Punteggi critici",
    category: "Media",
    freq: "Mensile",
    affidabilita: "Stimata",
    color: "#fbbf24",
    desc: "Rivista britannica di riferimento per il fine wine. Punteggi e recensioni per Bordeaux, Borgogna, Super Tuscans.",
    url: "https://www.decanter.com",
    badge: "estimated",
  },
  {
    name: "Reddit r/wine & r/WineInvestment",
    type: "Sentiment community",
    category: "Social",
    freq: "In tempo reale",
    affidabilita: "Elaborata",
    color: "#60a5fa",
    desc: "Analisi del sentiment della community vinicola. Processato con NLP per identificare trend emergenti e interesse geografico.",
    url: "https://www.reddit.com/r/wine",
    badge: "processed",
  },
  {
    name: "Dati interni VinoInvest",
    type: "Storico prezzi elaborato",
    category: "Proprietario",
    freq: "Continua",
    affidabilita: "Algoritmica",
    color: "#60a5fa",
    desc: "Prezzi storici generati algoritmicamente basati su medie Liv-ex, CellarTracker e modelli di apprezzamento per regione/annata. Dati estimati salvo badge verde.",
    url: null,
    badge: "algorithmic",
  },
];

const BADGES = [
  {
    id: "verified",
    label: "Verificata",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.3)",
    desc: "Dato da fonte primaria verificabile. Aggiornato direttamente dall'API originale.",
  },
  {
    id: "estimated",
    label: "Stimata",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
    desc: "Dato aggregato o ricavato da fonti pubbliche. Potenzialmente non aggiornato in tempo reale.",
  },
  {
    id: "processed",
    label: "Elaborata",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.3)",
    desc: "Dato processato da VinoInvest con algoritmi NLP o ML. Rappresenta un'elaborazione, non un dato grezzo.",
  },
  {
    id: "algorithmic",
    label: "Algoritmica",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.3)",
    desc: "Prezzo o valore generato algoritmicamente. Non corrisponde a una transazione reale. Usato come indicazione orientativa.",
  },
];

export default function DataSources() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Helmet>
        <title>Fonti dei Dati | VinoInvest — Trasparenza Totale sulla Nostra Metodologia</title>
        <meta name="description" content="Scopri da dove provengono i dati di VinoInvest: Liv-ex, CellarTracker, Open-Meteo, Wine-Searcher e molto altro. Trasparenza completa su fonti, frequenza e affidabilità." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/data-sources" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "VinoInvest Fine Wine Data",
          "description": "Dataset aggregato per investimento in fine wine: prezzi, punteggi, dati climatici, sentiment.",
          "publisher": { "@type": "Organization", "name": "VinoInvest" },
          "license": "https://vinoinvest-platform.vercel.app/terms",
          "url": "https://vinoinvest-platform.vercel.app/data-sources",
        })}</script>
      </Helmet>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", fontSize: 20, fontWeight: 800, cursor: "pointer" }}>VinoInvest</button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => navigate("/metodologia")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Metodologia</button>
          <button onClick={() => navigate("/security")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Sicurezza</button>
          <button onClick={() => navigate("/b2b")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>B2B Professional</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "72px 24px 48px", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontSize: 12, color: "#C9A227", letterSpacing: 1 }}>
          TRASPARENZA TOTALE
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
          Fonti dei dati:<br />
          <span style={{ color: "#C9A227" }}>sapere da dove vengono i numeri</span>
        </h1>
        <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.7 }}>
          Ogni prezzo, ogni punteggio, ogni metrica ha una fonte. La riportiamo sempre,
          insieme al badge di affidabilità. Nessun dato senza contesto.
        </p>
      </section>

      {/* Badge legend */}
      <section style={{ padding: "0 24px 56px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#f1f5f9" }}>
            Sistema di badge
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {BADGES.map(b => (
              <div key={b.id} style={{ background: b.bg, border: `1px solid ${b.border}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ display: "inline-block", background: b.bg, border: `1px solid ${b.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: b.color, marginBottom: 10 }}>
                  {b.label}
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources table */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: "#f1f5f9" }}>
            Tutte le fonti ({SOURCES.length})
          </h2>

          {/* Desktop table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1e3050" }}>
                  {["Fonte", "Tipo dato", "Categoria", "Frequenza aggiornamento", "Affidabilità"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s, i) => {
                  const badge = BADGES.find(b => b.id === s.badge);
                  return (
                    <tr key={s.name} style={{ borderBottom: "1px solid #1e3050", background: i % 2 === 0 ? "transparent" : "rgba(15,28,46,0.3)" }}>
                      <td style={{ padding: "14px 16px" }}>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#C9A227", fontWeight: 700, textDecoration: "none" }}>{s.name} ↗</a>
                        ) : (
                          <span style={{ color: "#C9A227", fontWeight: 700 }}>{s.name}</span>
                        )}
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 4, maxWidth: 260 }}>{s.desc}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{s.type}</td>
                      <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{s.category}</td>
                      <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{s.freq}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {badge && (
                          <span style={{ display: "inline-block", background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: badge.color }}>
                            {badge.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Segnala dato errato */}
      <section style={{ padding: "56px 24px", background: "#0f1c2e" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Hai trovato un dato errato?</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: 32 }}>
            La qualità del dato è la nostra priorità. Se noti un prezzo anomalo, un'informazione mancante
            o una fonte non aggiornata, segnalacelo: verrà revisionato entro 48 ore lavorative.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:data@vinoinvest.com?subject=Segnalazione dato errato" style={{ display: "inline-block", background: "#C9A227", border: "none", borderRadius: 10, padding: "12px 28px", color: "#0b1220", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
              Segnala via email →
            </a>
            <button onClick={() => navigate("/metodologia")} style={{ background: "transparent", border: "2px solid #1e3050", borderRadius: 10, padding: "12px 28px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
              Metodologia AI Score
            </button>
          </div>
        </div>
      </section>

      {/* Limitazioni */}
      <section style={{ padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>Limitazioni oneste</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                title: "I prezzi storici sono stime algoritmiche",
                body: "La maggior parte dei prezzi storici su VinoInvest sono generati algoritmicamente a partire da medie Liv-ex, dati CellarTracker e modelli di apprezzamento per regione e annata. Non rappresentano transazioni reali salvo badge verde 'Verificata'.",
              },
              {
                title: "Dati non in tempo reale",
                body: "VinoInvest non è un feed live di prezzi. L'aggiornamento medio è settimanale per dati Liv-ex e mensile per altri. Per trading ad alta frequenza nel fine wine, utilizzare direttamente le API Liv-ex.",
              },
              {
                title: "Copertura geografica non uniforme",
                body: "La copertura dati è migliore per Bordeaux, Borgogna, Champagne e top Italiani. Vini di regioni emergenti (Georgia, Grecia, Croazia) hanno dati storici limitati e AI Score meno precisi.",
              },
              {
                title: "Punteggi critici non licenziati",
                body: "I punteggi critici (Wine Spectator, Parker, ecc.) non sono licenziati direttamente. Sono aggregati da fonti pubbliche e community. Per i punteggi ufficiali consultare le rispettive pubblicazioni.",
              },
            ].map(l => (
              <div key={l.title} style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 12, padding: "20px 24px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fbbf24", marginBottom: 10 }}>{l.title}</h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#334155", fontSize: 12 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Metodologia", "/metodologia"], ["Sicurezza", "/security"], ["B2B", "/b2b"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati.</div>
      </footer>
    </div>
  );
}
