import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const VINTAGES = [
  { year: 2022, score: 100, quality: "Leggendaria", regions: "Bordeaux, Borgogna, Rodano", description: "L'annata del secolo per molti esperti. Condizioni climatiche perfette in tutta Francia. I vini en primeur 2022 già a premio del 15-20% sul prezzo di rilascio.", growth: "+22%", risk: "Basso" },
  { year: 2019, score: 98, quality: "Eccezionale", regions: "Borgogna, Barolo, Champagne", description: "Borgogna straordinaria con equilibrio perfetto. Barolo 2019 definito 'il migliore degli ultimi 20 anni' da Gambero Rosso e Wine Spectator.", growth: "+18%", risk: "Basso" },
  { year: 2018, score: 98, quality: "Eccezionale", regions: "Bordeaux, Toscana, Napa", description: "Annata calda con vini potenti e concentrati. Château Lafite 2018 a 100/100 Parker. Sassicaia 2018 a 100/100 Wine Spectator.", growth: "+19%", risk: "Basso" },
  { year: 2016, score: 97, quality: "Eccellente", regions: "Bordeaux, Piemonte, Rodano", description: "Bordeaux classico, elegante e longevo. Barolo 2016 da Conterno, Giacosa e Cappellano tra i più apprezzati dell'ultimo decennio.", growth: "+16%", risk: "Basso" },
  { year: 2015, score: 97, quality: "Eccellente", regions: "Borgogna, Champagne, California", description: "Borgogna generosa e opulenta. Champagne con materia prima eccezionale per le cuvée prestige. Screaming Eagle 2015 a 100/100.", growth: "+15%", risk: "Basso" },
  { year: 2013, score: 91, quality: "Ottima", regions: "Barolo, Barbaresco, Borgogna", description: "Annata complessa ma di grande eleganza per Piemonte e Borgogna. Vini ancora in evoluzione con grande potenziale di apprezzamento.", growth: "+9%", risk: "Medio" },
  { year: 2012, score: 93, quality: "Molto Buona", regions: "Barolo, Barbaresco, Champagne", description: "Piemonte in grande forma. Barolo e Barbaresco 2012 offrono qualità/prezzo tra le migliori dell'ultimo decennio.", growth: "+11%", risk: "Medio" },
  { year: 2011, score: 90, quality: "Buona", regions: "Toscana, Napa, Spagna", description: "Annata calda con vini pronti prima. Brunello e Super Tuscan bevibili ora o con 5-10 anni di conservazione.", growth: "+7%", risk: "Medio" },
  { year: 2010, score: 100, quality: "Leggendaria", regions: "Bordeaux, Borgogna", description: "La migliore annata di Bordeaux del decennio. Vini già apprezzati del 30-50% rispetto al prezzo en primeur. Pomerol e St-Émilion straordinari.", growth: "+28%", risk: "Basso" },
  { year: 2009, score: 100, quality: "Leggendaria", regions: "Bordeaux, Rodano, Toscana", description: "Annata solare e generosa. I vini 2009 sono pienamente evoluti e pronti. Ottima liquidità sul mercato secondario.", growth: "+25%", risk: "Basso" },
  { year: 2008, score: 95, quality: "Eccezionale", regions: "Champagne, Borgogna", description: "Champagne straordinario. Krug 2008, Dom Pérignon 2008, Louis Roederer Cristal 2008 tra i migliori Prestige Cuvée della storia recente.", growth: "+20%", risk: "Basso" },
  { year: 2005, score: 100, quality: "Leggendaria", regions: "Bordeaux, Barolo, Brunello", description: "Forse la migliore annata di Bordeaux del XXI secolo. Vini immortali, ancora a decenni dall'apice. Apprezzamento medio: +40% dall'uscita.", growth: "+35%", risk: "Basso" },
  { year: 2004, score: 90, quality: "Buona", regions: "Piemonte, Borgogna, Champagne", description: "Annata classica ed elegante per Piemonte e Borgogna. Vini longevi che stanno ancora evolvendo positivamente.", growth: "+8%", risk: "Medio" },
  { year: 2001, score: 94, quality: "Eccellente", regions: "Barolo, Brunello, Borgogna", description: "Annata straordinaria per l'Italia. Barolo 2001 Giacomo Conterno Monfortino è considerato il miglior Barolo degli ultimi 30 anni da molti critici.", growth: "+22%", risk: "Basso" },
  { year: 2000, score: 99, quality: "Leggendaria", regions: "Bordeaux, Borgogna", description: "L'annata del millennio. I grandi Bordeaux 2000 sono icone del collezionismo. Apprezzamento medio +50% dall'uscita sul mercato.", growth: "+45%", risk: "Basso" },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Annate Vino da Investimento 2000-2024",
  "description": "Guida alle migliori annate vinicole per investimento con score, performance storica e analisi",
  "numberOfItems": VINTAGES.length,
  "itemListElement": VINTAGES.map((v, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": `Annata ${v.year}`,
    "description": v.description,
  })),
};

const qualityColor = {
  "Leggendaria": "#C9A227",
  "Eccezionale": "#4ade80",
  "Eccellente": "#60a5fa",
  "Molto Buona": "#94a3b8",
  "Ottima": "#94a3b8",
  "Buona": "#64748b",
};

export default function Annate() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? VINTAGES
    : filter === "legendary" ? VINTAGES.filter(v => v.score === 100)
    : VINTAGES.filter(v => v.score >= 95);

  return (
    <>
      <Helmet>
        <title>Migliori Annate Vino Investimento 2000-2024 | VinoInvest</title>
        <meta name="description" content="Guida completa alle migliori annate vinicole per investimento dal 2000 al 2024. Score, performance storica, regioni e vini top per ogni annata." />
        <meta name="keywords" content="migliori annate vino investimento, bordeaux 2010 investimento, barolo 2016 prezzo, brunello 2016 investimento, annate eccezionali vino" />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/annate" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px", color: "#e2e8f0" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontSize: 14, marginBottom: 24, padding: 0 }}>
          ← Torna alla piattaforma
        </button>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,5vw,40px)", fontWeight: 700, marginBottom: 8, color: "#C9A227" }}>
          Migliori Annate Vino da Investimento
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 12, lineHeight: 1.7 }}>
          Analisi delle annate vinicole dal 2000 al 2024 per orientare le scelte di investimento.
          Ogni annata è valutata con AI Score VinoInvest, performance storica di prezzo, regioni di
          eccellenza e indicazione del rischio. Le annate "Leggendarie" (score 100) offrono la
          massima sicurezza di apprezzamento nel tempo.
        </p>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32, lineHeight: 1.6 }}>
          La crescita indicata è la variazione media di prezzo rispetto al rilascio sul mercato primario.
          Dati elaborati da VinoInvest su base Liv-ex, Wine-Searcher e aste internazionali.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "Tutte le annate" },
            { key: "legendary", label: "Solo Leggendarie (100)" },
            { key: "top", label: "Score ≥ 95" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key ? "rgba(201,162,39,0.2)" : "rgba(11,18,32,0.85)",
                border: `1px solid ${filter === f.key ? "#C9A227" : "rgba(31,41,55,0.7)"}`,
                color: filter === f.key ? "#C9A227" : "#94a3b8",
                borderRadius: 10,
                padding: "8px 18px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: filter === f.key ? 700 : 400,
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map(v => (
            <div
              key={v.year}
              onClick={() => navigate(`/?search=${v.year}`)}
              style={{
                background: "rgba(11,18,32,0.85)",
                border: "1px solid rgba(31,41,55,0.7)",
                borderRadius: 14,
                padding: "20px 24px",
                cursor: "pointer",
                transition: "border-color 0.2s",
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: "0 20px",
                alignItems: "start",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A227"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(31,41,55,0.7)"}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: qualityColor[v.quality] || "#94a3b8", lineHeight: 1 }}>{v.year}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Score</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: qualityColor[v.quality] || "#94a3b8" }}>{v.score}</div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    background: `${qualityColor[v.quality]}18`,
                    color: qualityColor[v.quality] || "#94a3b8",
                    border: `1px solid ${qualityColor[v.quality]}30`,
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    {v.quality}
                  </span>
                  <span style={{ fontSize: 11, color: "#475569" }}>{v.regions}</span>
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>{v.description}</p>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>{v.growth}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>crescita media</div>
                <div style={{ marginTop: 8, fontSize: 11, padding: "2px 8px", borderRadius: 5, background: v.risk === "Basso" ? "rgba(74,222,128,0.1)" : "rgba(201,162,39,0.1)", color: v.risk === "Basso" ? "#4ade80" : "#C9A227", border: `1px solid ${v.risk === "Basso" ? "rgba(74,222,128,0.2)" : "rgba(201,162,39,0.2)"}` }}>
                  Rischio {v.risk}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: "28px 24px", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#C9A227", marginBottom: 12 }}>
            Perché l'annata è fondamentale nell'investimento vinicolo
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75 }}>
            Nel vino da investimento l'annata determina fino al 60% del valore finale di un vino.
            Un Château Lafite 2010 vale quasi il doppio di un Lafite 2011 dello stesso produttore,
            nonostante la differenza di qualità sia minima al palato. Gli investitori esperti comprano
            principalmente nelle annate "leggendarie" (score 100/100) perché sono quelle che mantengono
            e aumentano il valore nel tempo con la massima certezza. Le annate 2000, 2005, 2009, 2010,
            2018 e 2022 di Bordeaux sono considerate le più solide. Per il Piemonte le annate 2001,
            2010, 2013, 2016 e 2019 rappresentano i migliori rapporti tra qualità e potenziale di crescita.
            VinoInvest aggiorna i prezzi quotidianamente per permetterti di monitorare l'andamento
            delle tue annate preferite in tempo reale.
          </p>
        </div>
      </div>
    </>
  );
}
