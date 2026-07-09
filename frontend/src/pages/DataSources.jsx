import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../lib/constants";

// Fonti verificate: Giugno 2026
const SOURCES = [
  {
    name: "Liv-ex",
    fullName: "London International Vintners Exchange",
    type: "Prezzi di mercato",
    category: "Exchange",
    freq: "Giornaliera (indici) / Real-time (membri)",
    affidabilita: "Verificata",
    color: "#34d399",
    trust: "⭐⭐⭐⭐⭐",
    trustNote: "Fonte primaria",
    access: "API a pagamento (abbonamento £5k+/anno) + indici gratuiti pubblicati ogni giorno",
    coverage: "~5.000 referenze fine wine, 95%+ del volume di mercato B2B",
    usedFor: "Calcolo market_score, benchmark Fine Wine 100, storico prezzi",
    limitation: "Copre solo vini con mercato B2B attivo e scambi commerciali regolari",
    desc: "London International Vintners Exchange — il benchmark globale per i prezzi del fine wine. ~5.000 referenze tracciate, indici Liv-ex 50/100/500/1000 pubblicati ogni giorno. Base del 95%+ del volume di mercato fine wine a livello mondiale.",
    url: "https://www.liv-ex.com",
    badge: "verified",
  },
  {
    name: "Wine-Searcher",
    fullName: "Wine-Searcher",
    type: "Prezzi retail",
    category: "Aggregatore",
    freq: "Giornaliera (aggregazione da 50.000+ merchant)",
    affidabilita: "Stimata",
    color: "#fbbf24",
    trust: "⭐⭐⭐⭐",
    trustNote: "Fonte secondaria forte",
    access: "Tier gratuito (100 ricerche/giorno) + Pro API (abbonamento mensile)",
    coverage: "15M+ offerte vino a livello globale",
    usedFor: "Benchmark prezzi retail, dati di disponibilità",
    limitation: "I prezzi retail includono margine del rivenditore (tipicamente +20-40% vs Liv-ex)",
    desc: "Aggregatore prezzi retail con 15M+ offerte da 50.000+ commercianti in tutto il mondo. Usato per confronto prezzi al dettaglio e verifica disponibilità globale. I prezzi retail sono più alti rispetto al mercato B2B Liv-ex.",
    url: "https://www.wine-searcher.com",
    badge: "estimated",
  },
  {
    name: "Robert Parker Wine Advocate",
    fullName: "Robert Parker Wine Advocate",
    type: "Punteggi critici",
    category: "Media / Recensioni",
    freq: "Per pubblicazione recensione",
    affidabilita: "Verificata",
    color: "#34d399",
    trust: "⭐⭐⭐⭐⭐",
    trustNote: "Gold standard",
    access: "Abbonamento $99/anno",
    coverage: "Tutte le principali regioni fine wine mondiali",
    usedFor: "Componente critic_score (peso massimo per Bordeaux e California)",
    limitation: "Copertura più forte su Bordeaux/Napa; meno approfondita per Borgogna e Italia",
    desc: "Il più influente critico di vino al mondo. Punteggi in centesimi (100pt) per tutte le principali regioni. Gold standard per Bordeaux e California. Influenza diretta sul prezzo di mercato dei vini premiati.",
    url: "https://www.robertparker.com",
    badge: "verified",
  },
  {
    name: "Wine Spectator",
    fullName: "Wine Spectator",
    type: "Punteggi critici / News",
    category: "Media / Recensioni",
    freq: "Per pubblicazione recensione",
    affidabilita: "Verificata",
    color: "#34d399",
    trust: "⭐⭐⭐⭐⭐",
    trustNote: "Gold standard",
    access: "Abbonamento $40/anno",
    coverage: "Tutte le principali regioni; copertura Borgogna e Italia più forte vs Parker",
    usedFor: "Componente critic_score (peso uguale a Parker)",
    limitation: null,
    desc: "Rivista di riferimento per fine wine con copertura globale. Punteggi in centesimi, più forte di Parker su Borgogna e Italia. Usato per il calcolo del critic_score con peso pari a Wine Advocate.",
    url: "https://www.winespectator.com",
    badge: "verified",
  },
  {
    name: "Open-Meteo / ERA5",
    fullName: "Open-Meteo + ERA5 Climate Data (Copernicus)",
    type: "Dati climatici storici",
    category: "API pubblica",
    freq: "Giornaliera (attuale) / Storico dal 1940",
    affidabilita: "Verificata",
    color: "#34d399",
    trust: "⭐⭐⭐⭐⭐",
    trustNote: "Dati EU Copernicus",
    access: "API gratuita (nessuna chiave richiesta, licenza CC-BY)",
    coverage: "Globale a risoluzione 0.25° di griglia",
    usedFor: "vintage_score — dati temperatura/precipitazioni per Bordeaux, Borgogna, Toscana e altre regioni",
    limitation: "Griglia geografica, non tiene conto del microclima specifico del singolo vigneto",
    desc: "API meteorologica open source con dati ERA5 (Copernicus EU) dal 1940. Temperatura, precipitazioni, radiazione solare per calcolo Vintage Climate Score (0–100) per ogni regione vinicola. Gratuita, nessuna chiave API necessaria.",
    url: "https://open-meteo.com",
    badge: "verified",
  },
  {
    name: "ECB Exchange Rates",
    fullName: "European Central Bank — Euro Foreign Exchange Reference Rates",
    type: "Tassi di cambio",
    category: "Istituzionale / Banca Centrale",
    freq: "Giornaliera (giorni lavorativi)",
    affidabilita: "Verificata",
    color: "#34d399",
    trust: "⭐⭐⭐⭐⭐",
    trustNote: "Dati BCE ufficiali",
    access: "Gratuito (feed XML pubblico)",
    coverage: "27 valute vs EUR",
    usedFor: "Conversione prezzi multi-valuta",
    limitation: null,
    desc: "Feed ufficiale della Banca Centrale Europea per i tassi di cambio di riferimento. Aggiornato ogni giorno lavorativo. Usato per convertire i prezzi Liv-ex (GBP) e Wine-Searcher (USD/altri) in EUR.",
    url: "https://www.ecb.europa.eu/stats/eurofxref",
    badge: "verified",
  },
  {
    name: "Wikidata / Wikipedia",
    fullName: "Wikidata + Wikipedia",
    type: "Dati strutturati produttori / Regioni",
    category: "Linked Data / Community",
    freq: "Community-driven, quasi real-time",
    affidabilita: "Verificata",
    color: "#34d399",
    trust: "⭐⭐⭐",
    trustNote: "Accuratezza editoriale variabile",
    access: "API pubblica gratuita",
    coverage: "Regioni vinicole, storia produttori, informazioni appellazioni",
    usedFor: "Background produttori, descrizioni regioni",
    limitation: "Accuratezza variabile — contenuto editoriale non sempre aggiornato",
    desc: "Dati strutturati su cantine, produttori, appellazioni e certificazioni vinicole. Usati per background produttori e descrizioni delle regioni. Qualità editoriale variabile: incrociato con altre fonti prima dell'uso.",
    url: "https://www.wikidata.org",
    badge: "verified",
  },
  {
    name: "Aste: Christie's / Sotheby's / HDH",
    fullName: "Christie's, Sotheby's, Hart Davis Hart Wine",
    type: "Risultati aste",
    category: "Casa d'aste",
    freq: "Per asta (tipicamente mensile)",
    affidabilita: "Stimata",
    color: "#fbbf24",
    trust: "⭐⭐⭐⭐",
    trustNote: "Transazioni verificate",
    access: "Risultati pubblici post-asta",
    coverage: "Top 5.000+ referenze fine wine",
    usedFor: "Dati prezzi secondari, tracking vendite eccezionali",
    limitation: "Prezzi da singola transazione — non rappresentativi del mercato giornaliero",
    desc: "Risultati d'asta pubblici di Christie's, Sotheby's e Hart Davis Hart Wine. Usati come dati di prezzo secondari e per tracciare vendite eccezionali. Prezzi da singola transazione, non rappresentativi del mercato giornaliero.",
    url: "https://www.christies.com",
    badge: "estimated",
  },
  {
    name: "Open Food Facts",
    fullName: "Open Food Facts",
    type: "Immagini / Metadati prodotto",
    category: "Community / Open Data",
    freq: "Community-driven",
    affidabilita: "Elaborata",
    color: "#60a5fa",
    trust: "⭐⭐⭐",
    trustNote: "Dato di supporto",
    access: "Gratuito (licenza CC0)",
    coverage: "3M+ prodotti inclusi vini",
    usedFor: "Sorgente di fallback per immagini bottiglia",
    limitation: "Copertura non uniforme; immagini non sempre di qualità professionale",
    desc: "Database open source di prodotti alimentari e bevande con licenza CC0. Usato come fallback per le immagini delle bottiglie quando non disponibili da altre fonti. Copertura variabile per fine wine.",
    url: "https://world.openfoodfacts.org",
    badge: "processed",
  },
  {
    name: "Dati interni VinoInvest",
    fullName: "VinoInvest — Storico prezzi algoritmico",
    type: "Storico prezzi elaborato",
    category: "Proprietario",
    freq: "Continua",
    affidabilita: "Algoritmica",
    color: "#a78bfa",
    trust: null,
    trustNote: null,
    access: "Interno — non ridistribuito",
    coverage: "Tutti i vini nel catalogo VinoInvest",
    usedFor: "Prezzi storici dove dati Liv-ex non disponibili",
    limitation: "Prezzi stimati algoritmicamente — non corrispondono a transazioni reali salvo badge verde",
    desc: "Prezzi storici generati algoritmicamente a partire da medie Liv-ex, Wine-Searcher e modelli di apprezzamento per regione/annata. Nessun dato grezzo Liv-ex o Wine-Searcher viene ridistribuito. Solo orientativo.",
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
        <link rel="canonical" href={`${SITE_URL}/data-sources`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "VinoInvest Fine Wine Data",
          "description": "Dataset aggregato per investimento in fine wine: prezzi, punteggi, dati climatici, sentiment.",
          "publisher": { "@type": "Organization", "name": "VinoInvest" },
          "license": `${SITE_URL}/terms`,
          "url": `${SITE_URL}/data-sources`,
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
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
              Tutte le fonti ({SOURCES.length})
            </h2>
            <span style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>
              Fonti verificate: Giugno 2026
            </span>
          </div>

          {/* Desktop table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1e3050" }}>
                  {["Fonte", "Tipo dato", "Frequenza", "Affidabilità", "Fiducia"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s, i) => {
                  const badge = BADGES.find(b => b.id === s.badge);
                  return (
                    <tr key={s.name} style={{ borderBottom: "1px solid #1e3050", background: i % 2 === 0 ? "transparent" : "rgba(15,28,46,0.3)" }}>
                      <td style={{ padding: "16px 16px", verticalAlign: "top" }}>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#C9A227", fontWeight: 700, textDecoration: "none", display: "inline-block", marginBottom: 4 }}>{s.name} ↗</a>
                        ) : (
                          <span style={{ color: "#C9A227", fontWeight: 700, display: "inline-block", marginBottom: 4 }}>{s.name}</span>
                        )}
                        {s.fullName && s.fullName !== s.name && (
                          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{s.fullName}</div>
                        )}
                        <div style={{ fontSize: 11, color: "#475569", maxWidth: 280, lineHeight: 1.5 }}>{s.desc}</div>
                        {s.usedFor && (
                          <div style={{ marginTop: 6, fontSize: 11 }}>
                            <span style={{ color: "#475569" }}>Usato per: </span>
                            <span style={{ color: "#94a3b8" }}>{s.usedFor}</span>
                          </div>
                        )}
                        {s.access && (
                          <div style={{ marginTop: 4, fontSize: 11 }}>
                            <span style={{ color: "#475569" }}>Accesso: </span>
                            <span style={{ color: "#94a3b8" }}>{s.access}</span>
                          </div>
                        )}
                        {s.coverage && (
                          <div style={{ marginTop: 4, fontSize: 11 }}>
                            <span style={{ color: "#475569" }}>Copertura: </span>
                            <span style={{ color: "#94a3b8" }}>{s.coverage}</span>
                          </div>
                        )}
                        {s.limitation && (
                          <div style={{ marginTop: 4, fontSize: 11 }}>
                            <span style={{ color: "#475569" }}>Limite: </span>
                            <span style={{ color: "#64748b", fontStyle: "italic" }}>{s.limitation}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "16px 16px", color: "#94a3b8", verticalAlign: "top", whiteSpace: "nowrap" }}>{s.type}</td>
                      <td style={{ padding: "16px 16px", color: "#94a3b8", verticalAlign: "top", maxWidth: 180 }}>{s.freq}</td>
                      <td style={{ padding: "16px 16px", verticalAlign: "top" }}>
                        {badge && (
                          <span style={{ display: "inline-block", background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: badge.color, whiteSpace: "nowrap" }}>
                            {badge.label}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "16px 16px", verticalAlign: "top" }}>
                        {s.trust && (
                          <div>
                            <span style={{ fontSize: 13, letterSpacing: 1 }}>{s.trust}</span>
                            {s.trustNote && (
                              <div style={{ fontSize: 10, color: "#64748b", marginTop: 3, whiteSpace: "nowrap" }}>{s.trustNote}</div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* GDPR / Transparency note */}
          <div style={{ marginTop: 32, background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#C9A227", marginBottom: 8, letterSpacing: 0.5 }}>GDPR / NOTA SULLA TRASPARENZA</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
              <li>Tutti i dati mostrati sono pubblicamente disponibili o ottenuti tramite licenze sottoscritte da VinoInvest.</li>
              <li>VinoInvest non effettua scraping da sistemi che richiedono login o pagamento salvo tramite le proprie sottoscrizioni licenziate.</li>
              <li>VinoInvest non rivende dati grezzi provenienti da Liv-ex o Wine-Searcher.</li>
            </ul>
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
