import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { API } from "../lib/constants";

const TOP_PRODUCERS = [
  { name: "Lafite Rothschild", region: "Bordeaux", country: "Francia", flag: "🇫🇷", specialty: "Cabernet Sauvignon blend", score: 98, description: "Il Château più famoso del mondo. Premier Grand Cru Classé del 1855. Le annate iconiche 2000, 2010, 2018 restano tra le più ricercate dagli investitori globali." },
  { name: "Pétrus", region: "Pomerol", country: "Francia", flag: "🇫🇷", specialty: "Merlot puro", score: 100, description: "Il Merlot più costoso al mondo. Produzione limitata a 3.000 casse annue. Prezzi di ingresso da €3.000/bottiglia per le grandi annate." },
  { name: "Romanée-Conti (DRC)", region: "Borgogna", country: "Francia", flag: "🇫🇷", specialty: "Pinot Nero", score: 100, description: "Il vino più raro e costoso del mondo. La Tâche, Romanée-Conti, Richebourg. Prezzi da €5.000 a €50.000+ per bottiglia. Lista d'attesa pluriennale." },
  { name: "Dom Pérignon", region: "Champagne", country: "Francia", flag: "🇫🇷", specialty: "Prestige Cuvée", score: 97, description: "La cuvée di punta di Moët & Chandon. Le versioni P2 e P3 (seconda e terza plenitude) sono tra i Champagne da investimento più popolari." },
  { name: "Sassicaia (Tenuta San Guido)", region: "Bolgheri", country: "Italia", flag: "🇮🇹", specialty: "Cabernet Sauvignon/Franc", score: 98, description: "Il primo Super Tuscan. DOC Bolgheri Sassicaia — la prima DOC dedicata a un singolo produttore in Italia. Crescita di valore +18% annuo ultimo decennio." },
  { name: "Ornellaia", region: "Bolgheri", country: "Italia", flag: "🇮🇹", specialty: "Cabernet blend", score: 97, description: "Tra i Top 100 vini Wine Spectator per tre volte. Ogni annata rilascia un'edizione d'arte limitata. Alta domanda in Asia e USA." },
  { name: "Masseto", region: "Bolgheri", country: "Italia", flag: "🇮🇹", specialty: "Merlot puro", score: 97, description: "Il 'Pétrus italiano'. Merlot da un singolo vigneto di argilla blu. Produzione sotto le 10.000 bottiglie. Rivalutazione costante del 12-20% annuo." },
  { name: "Giacomo Conterno", region: "Piemonte", country: "Italia", flag: "🇮🇹", specialty: "Barolo Monfortino", score: 99, description: "Il Barolo Monfortino Riserva è il Barolo più ricercato dagli investitori. Affinamento minimo 7 anni. Alcune annate valgono oltre €800/bottiglia." },
  { name: "Gaja", region: "Piemonte", country: "Italia", flag: "🇮🇹", specialty: "Barbaresco, Barolo", score: 98, description: "Angelo Gaja ha portato il Barbaresco ai vertici mondiali. Sorì Tildin, Costa Russi e Sorì San Lorenzo — tre MGA di Barbaresco tra i più ambiti al mondo." },
  { name: "Screaming Eagle", region: "Napa Valley", country: "USA", flag: "🇺🇸", specialty: "Cabernet Sauvignon", score: 100, description: "Il vino più costoso della California. 600 casse annue, lista d'attesa decennale. La prima annata 1992 venduta all'asta per $500.000 a magnums." },
  { name: "Harlan Estate", region: "Napa Valley", country: "USA", flag: "🇺🇸", specialty: "Cabernet Sauvignon", score: 99, description: "Fondato nel 1984, oggi cult wine globale. The Maiden è il secondo vino accessibile agli investitori con budget più contenuti." },
  { name: "Opus One", region: "Napa Valley", country: "USA", flag: "🇺🇸", specialty: "Cabernet blend", score: 96, description: "Joint venture storica tra Robert Mondavi e Barone Philippe de Rothschild. Alta liquidità, produzione di 25.000 casse annue. Entry-level ideale per i nuovi investitori." },
  { name: "Vega Sicilia", region: "Ribera del Duero", country: "Spagna", flag: "🇪🇸", specialty: "Tempranillo", score: 99, description: "Único è il vino flagship spagnolo più longevo. Affinamento fino a 10 anni in cantina prima del rilascio. Valore in forte apprezzamento sul mercato internazionale." },
  { name: "E. Guigal", region: "Rhône", country: "Francia", flag: "🇫🇷", specialty: "Syrah/Grenache", score: 100, description: "La Mouline, La Turque, La Landonne — le 'La La La'. Ottime valutazioni Parker (100/100 ripetuti). Produzione limitata, ottima tenuta nel tempo." },
  { name: "Domaine Leroy", region: "Borgogna", country: "Francia", flag: "🇫🇷", specialty: "Pinot Nero", score: 100, description: "Lalou Bize-Leroy, ex co-direttrice di DRC. Vini biodinamici di massima espressione. Musigny, Chambolle-Musigny — prezzi da €2.000 a €30.000." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Top Produttori di Vino da Investimento",
  "description": "I migliori produttori mondiali di vino fine per investimento con score AI e analisi",
  "numberOfItems": TOP_PRODUCERS.length,
  "itemListElement": TOP_PRODUCERS.map((p, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": p.name,
    "description": p.description,
  })),
};

export default function Produttori() {
  const navigate = useNavigate();
  const [winesByProducer, setWinesByProducer] = useState({});

  useEffect(() => {
    fetch(`${API}/api/wines?limit=50`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        (data.results || []).forEach(w => {
          const prod = w.producer || "";
          if (prod) {
            if (!map[prod]) map[prod] = [];
            map[prod].push(w);
          }
        });
        setWinesByProducer(map);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Top Produttori Vino Investimento | VinoInvest</title>
        <meta name="description" content="I migliori produttori di vino da investimento al mondo: DRC, Pétrus, Sassicaia, Screaming Eagle, Gaja, Ornellaia. AI Score, prezzi aggiornati e analisi di mercato." />
        <meta name="keywords" content="produttori vino investimento, romanee conti prezzo, sassicaia investimento, screaming eagle, petrus vino, gaja barolo prezzo" />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/produttori" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px", color: "#e2e8f0" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontSize: 14, marginBottom: 24, padding: 0 }}>
          ← Torna alla piattaforma
        </button>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: 700, marginBottom: 8, color: "#C9A227" }}>
          Top Produttori di Vino da Investimento
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 12, lineHeight: 1.7 }}>
          Guida ai 500+ produttori di vino fine tracciati da VinoInvest. Ogni produttore include AI Score,
          prezzi aggiornati quotidianamente, trend di mercato e analisi storica delle performance di investimento.
          Da Romanée-Conti a Sassicaia, da Screaming Eagle a Gaja: tutto il mercato del collezionismo vinicolo.
        </p>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 40, lineHeight: 1.6 }}>
          Dati aggiornati da Wine-Searcher, Vivino, Millesima, Idealwine e Liv-ex. Score AI calcolato su
          critica, liquidità, rarità, trend di prezzo e domanda globale.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 18 }}>
          {TOP_PRODUCERS.map(prod => {
            const wines = winesByProducer[prod.name] || [];
            const lowestPrice = wines.length > 0
              ? Math.min(...wines.map(w => w.current_price || w.currentPrice || 999999))
              : null;

            return (
              <div
                key={prod.name}
                onClick={() => navigate(`/?search=${encodeURIComponent(prod.name)}`)}
                style={{
                  background: "rgba(11,18,32,0.85)",
                  border: "1px solid rgba(31,41,55,0.7)",
                  borderRadius: 16,
                  padding: 22,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A227"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(31,41,55,0.7)"}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
                      {prod.flag} {prod.name}
                    </h2>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "3px 0 0" }}>{prod.region} · {prod.country}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ background: "rgba(201,162,39,0.15)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                      AI {prod.score}
                    </div>
                    {lowestPrice && lowestPrice < 999999 && (
                      <div style={{ fontSize: 11, color: "#4ade80" }}>da €{lowestPrice.toLocaleString()}</div>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#475569", marginBottom: 8 }}>Specialità: {prod.specialty}</p>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.55, marginBottom: 10 }}>{prod.description}</p>
                <div style={{ fontSize: 12, color: "#C9A227", fontWeight: 600 }}>
                  Vedi vini disponibili →
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 56, padding: "28px 24px", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C9A227", marginBottom: 12 }}>
            Come valutare un produttore per investimento vinicolo
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75 }}>
            Non tutti i vini di un grande produttore sono adatti all'investimento. L'AI Score di VinoInvest
            considera sei fattori: reputazione critica (Decanter, Wine Spectator, Robert Parker), liquidità sul
            mercato secondario (Liv-ex, aste), scarsità di produzione, consistenza delle annate, trend di prezzo
            degli ultimi 5 anni, e domanda geografica globale. Un produttore con score 95+ garantisce mediamente
            un apprezzamento del 10-15% annuo sulle annate top. La chiave è comprare le annate giuste:
            spesso il secondo vino (es. Carruades de Lafite, Maiden di Harlan) offre un punto d'ingresso
            più accessibile con rendimenti proporzionali.
          </p>
        </div>
      </div>
    </>
  );
}
