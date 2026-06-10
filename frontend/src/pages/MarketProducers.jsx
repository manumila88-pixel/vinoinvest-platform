import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { API } from "../lib/constants";

const BG = "#0b1220";
const GOLD = "#C9A227";

function Badge({ children, color = GOLD }) {
  return (
    <span style={{ background: "rgba(201,162,39,0.12)", color, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function ProducerCard({ producer, region, wineCount, avgScore, avgPrice, upPercent, topWine, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "#1a2535", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#e2e8f0", marginBottom: 3 }}>{producer}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{region} · {wineCount} vini</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: avgScore >= 85 ? "#4ade80" : avgScore >= 75 ? GOLD : "#94a3b8" }}>{avgScore}</div>
          <div style={{ fontSize: 10, color: "#475569" }}>AI SCORE</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <Badge>€{avgPrice.toLocaleString("it-IT")}/bt avg</Badge>
        {upPercent > 50 && <Badge color="#4ade80">▲ {upPercent}% in crescita</Badge>}
      </div>
      {topWine && <div style={{ fontSize: 12, color: "#475569" }}>Top: {topWine}</div>}
    </div>
  );
}

function NewsItem({ title, link, source, pubDate, description }) {
  return (
    <a href={link || "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
      <div style={{ borderLeft: `3px solid ${GOLD}`, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "0 8px 8px 0", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4, lineHeight: 1.4 }}>{title}</div>
        <div style={{ fontSize: 11, color: "#475569" }}>
          {source} · {pubDate ? new Date(pubDate).toLocaleDateString("it-IT") : ""}
        </div>
        {description && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{description}</div>}
      </div>
    </a>
  );
}

export default function MarketProducers() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSegment, setActiveSegment] = useState("top");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API}/api/market/producers`);
      if (!r.ok) throw new Error("Server error");
      setData(await r.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const segmentOptions = [
    { key: "top", label: "Top Produttori" },
    { key: "b2b_premium", label: "Premium B2B (>€500)" },
    { key: "b2c_value", label: "Value B2C (€50-500)" },
    { key: "emerging", label: "Emergenti" },
    { key: "news", label: "News Cantine" },
    { key: "tech", label: "Wine Tech" },
  ];

  const getProducers = () => {
    if (!data) return [];
    let list = [];
    if (activeSegment === "top") list = data.topByScore || [];
    else if (data.segments?.[activeSegment]) list = data.segments[activeSegment];
    else return [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.producer?.toLowerCase().includes(q) || p.region?.toLowerCase().includes(q));
    }
    return list;
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      <Helmet>
        <title>Produttori Fine Wine | VinoInvest Market Intelligence</title>
        <meta name="description" content="Analisi e performance dei migliori produttori di fine wine per investitori B2B e B2C. Dati AI, trend mercato, news cantine." />
      </Helmet>

      {/* Header */}
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.2)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 15, padding: 0 }}>
            VinoInvest
          </button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0", fontWeight: 700 }}>Produttori</span>
          <span style={{ fontSize: 11, background: "rgba(201,162,39,0.15)", color: GOLD, borderRadius: 4, padding: "2px 8px", fontWeight: 700 }}>MARKET INTELLIGENCE</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, color: "#fff", margin: "0 0 8px" }}>Analisi Produttori</h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
            Performance, AI Score e trend di mercato per i principali produttori fine wine. Aggiornato ogni 4 ore.
          </p>
        </div>

        {/* Segment tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
          {segmentOptions.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSegment(s.key)}
              style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: activeSegment === s.key ? GOLD : "rgba(255,255,255,0.08)", background: activeSegment === s.key ? "rgba(201,162,39,0.1)" : "transparent", color: activeSegment === s.key ? GOLD : "#64748b", fontWeight: activeSegment === s.key ? 700 : 500, cursor: "pointer", fontSize: 13 }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ color: "#64748b", textAlign: "center", padding: 60, fontSize: 15 }}>{t('common.loadingProducers')}</div>
        )}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 16, color: "#f87171" }}>
            Errore nel caricamento: {error}
          </div>
        )}

        {/* News tabs */}
        {!loading && data && activeSegment === "news" && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#e2e8f0", marginBottom: 20 }}>News Cantine e Mercato</h2>
            {data.producerNews?.length > 0 ? (
              data.producerNews.map((n, i) => <NewsItem key={i} {...n} />)
            ) : (
              <div style={{ color: "#475569", padding: 32, textAlign: "center" }}>Nessuna news disponibile al momento.</div>
            )}
          </div>
        )}

        {!loading && data && activeSegment === "tech" && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", color: "#e2e8f0", marginBottom: 20 }}>Wine Tech & Startup</h2>
            {data.techNews?.length > 0 ? (
              data.techNews.map((n, i) => <NewsItem key={i} {...n} />)
            ) : (
              <div style={{ color: "#475569", padding: 32, textAlign: "center" }}>Nessuna news tech disponibile al momento.</div>
            )}
          </div>
        )}

        {/* Producer grids */}
        {!loading && data && !["news", "tech"].includes(activeSegment) && (
          <div>
            {/* Search */}
            <div style={{ marginBottom: 20 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca produttore o regione..."
                style={{ width: "100%", maxWidth: 400, background: "#1a2535", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {activeSegment === "top" && (
              <div style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
                {data.generatedAt && `Dati aggiornati: ${new Date(data.generatedAt).toLocaleString("it-IT")}`}
              </div>
            )}

            {activeSegment === "b2b_premium" && (
              <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#94a3b8" }}>
                🏛️ <strong style={{ color: GOLD }}>Segmento B2B Premium</strong> — Vini &gt;€500/bt, AI Score &gt;85, rischio basso/medio. Ideale per wealth manager e family office.
              </div>
            )}
            {activeSegment === "b2c_value" && (
              <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#94a3b8" }}>
                💼 <strong style={{ color: "#60a5fa" }}>Segmento B2C Value</strong> — Vini €50-500/bt, AI Score &gt;70. Accessibili all'investitore privato, buon potenziale di crescita.
              </div>
            )}
            {activeSegment === "emerging" && (
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#94a3b8" }}>
                🚀 <strong style={{ color: "#4ade80" }}>Emergenti</strong> — Produttori con &gt;60% dei vini in crescita e AI Score &gt;75. Opportunità early-stage.
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {getProducers().map((p, i) => (
                <ProducerCard
                  key={i}
                  {...p}
                  onClick={() => navigate(`/market/producers/${encodeURIComponent(p.producer)}`)}
                />
              ))}
            </div>
            {getProducers().length === 0 && (
              <div style={{ color: "#475569", textAlign: "center", padding: 48 }}>
                {search ? `Nessun produttore trovato per "${search}"` : "Nessun produttore in questo segmento."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
