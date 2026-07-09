import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { API, SITE_URL } from "../lib/constants";

const REGIONS = [
  { name: "Bordeaux", country: "Francia", flag: "🇫🇷", description: "Patria dei Grands Crus Classés. Château Lafite, Margaux, Pétrus. I vini più scambiati al mondo sul mercato Liv-ex.", keywords: "bordeaux investimento, château lafite prezzo, cabernet sauvignon investimento" },
  { name: "Borgogna", country: "Francia", flag: "🇫🇷", description: "Pinot Nero e Chardonnay di massima espressione. Romanée-Conti, Domaine Leroy, DRC. Scarsità estrema e prezzi in crescita costante.", keywords: "borgogna investimento, romanee conti prezzo, domaine leroy" },
  { name: "Champagne", country: "Francia", flag: "🇫🇷", description: "Prestige cuvée da Krug, Dom Pérignon, Louis Roederer Cristal. Liquidità alta e domanda globale in aumento.", keywords: "champagne investimento, dom perignon prezzo, krug vintage" },
  { name: "Toscana", country: "Italia", flag: "🇮🇹", description: "Brunello di Montalcino, Barolo, Sassicaia, Ornellaia, Masseto. I Super Tuscan guidano il mercato dei vini italiani.", keywords: "brunello investimento, sassicaia prezzo, super tuscan investimento" },
  { name: "Piemonte", country: "Italia", flag: "🇮🇹", description: "Barolo e Barbaresco da Giacomo Conterno, Gaja, Bartolo Mascarello. Nebbiolo tra i più longevi e apprezzati dagli investitori.", keywords: "barolo investimento, gaja prezzo, giacomo conterno monfortino" },
  { name: "Rhône", country: "Francia", flag: "🇫🇷", description: "Hermitage, Côte-Rôtie, Châteauneuf-du-Pape. E. Guigal La Turque e La Landonne tra i più ricercati dagli investitori.", keywords: "rhone investimento, guigal la turque, hermitage vino" },
  { name: "Toscana IGT", country: "Italia", flag: "🇮🇹", description: "Masseto, Ornellaia, Solaia, Tignanello. I vini IGT toscani hanno superato molti bordeaux in crescita di valore negli ultimi 10 anni.", keywords: "masseto investimento, ornellaia prezzo, solaia vino" },
  { name: "Napa Valley", country: "USA", flag: "🇺🇸", description: "Opus One, Screaming Eagle, Harlan Estate. Il mercato americano premium con rendimenti storici del 20-30% annuo.", keywords: "napa valley investimento, opus one prezzo, screaming eagle" },
  { name: "Toscana DOCG", country: "Italia", flag: "🇮🇹", description: "Brunello di Montalcino DOCG, Vino Nobile di Montepulciano, Chianti Classico Gran Selezione.", keywords: "brunello montalcino investimento, vino nobile investimento" },
  { name: "Spagna", country: "Spagna", flag: "🇪🇸", description: "Vega Sicilia Único, Pingus, Álvaro Palacios L'Ermita. Il mercato spagnolo premium in forte crescita.", keywords: "vega sicilia investimento, pingus prezzo, vino spagna investimento" },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Regioni Vinicole per Investimento",
  "description": "Le migliori regioni vinicole del mondo per investimento in vino fine",
  "numberOfItems": REGIONS.length,
  "itemListElement": REGIONS.map((r, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": r.name,
    "description": r.description,
  })),
};

export default function Regioni() {
  const navigate = useNavigate();
  const [winesByRegion, setWinesByRegion] = useState({});

  useEffect(() => {
    fetch(`${API}/api/wines?limit=50`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        (data.results || []).forEach(w => {
          const reg = w.region || "Altro";
          if (!map[reg]) map[reg] = [];
          map[reg].push(w);
        });
        setWinesByRegion(map);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Regioni Vinicole per Investimento | VinoInvest</title>
        <meta name="description" content="Guida completa alle regioni vinicole per investimento: Bordeaux, Borgogna, Toscana, Piemonte, Champagne, Napa Valley. Prezzi, score AI e performance storiche." />
        <meta name="keywords" content="regioni vinicole investimento, bordeaux investimento, borgogna investimento, toscana investimento, barolo investimento, champagne investimento" />
        <link rel="canonical" href={`${SITE_URL}/regioni`} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px", color: "#e2e8f0" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontSize: 14, marginBottom: 24, padding: 0 }}>
          ← Torna alla piattaforma
        </button>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: 700, marginBottom: 8, color: "#C9A227" }}>
          Regioni Vinicole per Investimento
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 12, lineHeight: 1.7 }}>
          Scopri le migliori regioni vinicole del mondo per investire nel vino fine. VinoInvest analizza oltre 50.000 vini
          con AI Score proprietario, traccia prezzi giornalieri e calcola la performance storica per ogni regione.
          Dalle grandi appellazioni francesi ai Super Tuscan italiani fino a Napa Valley: tutto il mercato del vino
          da investimento in un unico posto.
        </p>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 40, lineHeight: 1.6 }}>
          I dati di prezzo sono aggiornati quotidianamente da Wine-Searcher, Vivino, Millesima e Idealwine.
          Ogni vino include AI Score (0-100), indicatore di rischio e trend di mercato.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
          {REGIONS.map(region => {
            const wines = winesByRegion[region.name] || [];
            const avgScore = wines.length > 0
              ? Math.round(wines.reduce((s, w) => s + (w.investment_score || w.investmentScore || 80), 0) / wines.length)
              : null;

            return (
              <div
                key={region.name}
                onClick={() => navigate(`/?search=${encodeURIComponent(region.name)}`)}
                style={{
                  background: "rgba(11,18,32,0.85)",
                  border: "1px solid rgba(31,41,55,0.7)",
                  borderRadius: 16,
                  padding: 24,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A227"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(31,41,55,0.7)"}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
                    {region.flag} {region.name}
                  </h2>
                  {avgScore && (
                    <span style={{ background: "rgba(201,162,39,0.15)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                      AI {avgScore}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{region.country}</p>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12 }}>{region.description}</p>
                {wines.length > 0 && (
                  <div style={{ fontSize: 11, color: "#475569" }}>
                    {wines.slice(0, 3).map(w => w.name || w.id).join(" · ")}
                  </div>
                )}
                <div style={{ marginTop: 14, fontSize: 12, color: "#C9A227", fontWeight: 600 }}>
                  Esplora vini →
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 56, padding: "28px 24px", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C9A227", marginBottom: 12 }}>
            Come scegliere la regione giusta per investire nel vino
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75 }}>
            La scelta della regione è il primo passo per costruire un portfolio di vini da investimento solido.
            Bordeaux offre la massima liquidità: i vini vengono scambiati quotidianamente su Liv-ex e le grandi
            annate (2000, 2005, 2009, 2010, 2016, 2018, 2022) mantengono valore nel tempo.
            La Borgogna garantisce ritorni storicamente superiori grazie alla scarsità produttiva, ma richiede
            capitali più elevati. La Toscana e il Piemonte rappresentano il migliore rapporto qualità-prezzo
            per gli investitori europei, con Super Tuscan come Sassicaia, Ornellaia e Masseto che hanno
            apprezzato del 15-25% annuo nell'ultimo decennio.
          </p>
        </div>
      </div>
    </>
  );
}
