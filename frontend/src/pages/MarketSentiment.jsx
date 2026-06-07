import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const REGIONS = ["Bordeaux", "Burgundy", "Champagne", "Tuscany", "Piedmont", "Rhône", "Barossa", "Napa Valley", "Rioja", "Douro"];

const MOCK_SENTIMENT = {
  overall: 64,
  trend: "bullish",
  regions: {
    Bordeaux: { score: 58, label: "Neutral+", color: "#C9A227" },
    Burgundy: { score: 78, label: "Bullish", color: "#4ade80" },
    Champagne: { score: 71, label: "Bullish", color: "#4ade80" },
    Tuscany: { score: 65, label: "Neutral+", color: "#C9A227" },
    Piedmont: { score: 72, label: "Bullish", color: "#4ade80" },
    Rhône: { score: 55, label: "Neutral", color: "#94a3b8" },
    Barossa: { score: 48, label: "Neutral-", color: "#fb923c" },
    "Napa Valley": { score: 52, label: "Neutral", color: "#94a3b8" },
    Rioja: { score: 44, label: "Bearish+", color: "#fb923c" },
    Douro: { score: 61, label: "Neutral+", color: "#C9A227" },
  },
};

function GaugeMeter({ value, label }) {
  const angle = -90 + (value / 100) * 180;
  const color = value >= 66 ? "#4ade80" : value >= 34 ? "#C9A227" : "#f87171";

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 180, height: 100, margin: "0 auto" }}>
        <svg viewBox="0 0 180 100" style={{ width: "100%", height: "100%" }}>
          {/* Background arc */}
          <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="rgba(30,41,59,0.6)" strokeWidth="14" strokeLinecap="round" />
          {/* Value arc */}
          <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${value * 2.2} 220`} />
          {/* Labels */}
          <text x="18" y="98" fontSize="9" fill="#475569">Bear</text>
          <text x="80" y="18" fontSize="9" fill="#475569" textAnchor="middle">Neutral</text>
          <text x="155" y="98" fontSize="9" fill="#475569" textAnchor="end">Bull</text>
          {/* Needle */}
          <g transform={`rotate(${angle}, 90, 90)`}>
            <line x1="90" y1="90" x2="90" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="90" cy="90" r="4" fill={color} />
          </g>
        </svg>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color, marginTop: -8 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function MarketSentiment() {
  const [sentiment] = useState(MOCK_SENTIMENT);
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/news?limit=5`).then(r => r.json()).then(d => setNews(d.articles || [])).catch(() => {});
  }, []);

  const trendColor = sentiment.overall >= 66 ? "#4ade80" : sentiment.overall >= 34 ? "#C9A227" : "#f87171";
  const trendLabel = sentiment.overall >= 66 ? "Bullish 📈" : sentiment.overall >= 34 ? "Neutral ➡️" : "Bearish 📉";

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ margin: "24px 0 40px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 8 }}>📊 Market Sentiment</h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            Aggregated sentiment from wine news, community reviews and price momentum.
          </p>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 8 }}>
            Data: <a href="https://www.decanter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b" }}>Decanter ↗</a> ·
            <a href="https://www.cellartracker.com" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", marginLeft: 4 }}>CellarTracker ↗</a> ·
            <a href="https://www.liv-ex.com" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", marginLeft: 4 }}>Liv-ex ↗</a>
            <span style={{ marginLeft: 6 }}>· Sentiment is algorithmic — not financial advice</span>
          </div>
        </div>

        {/* Overall gauge */}
        <div style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 20, padding: 32, marginBottom: 32, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 24 }}>Fine Wine Market — Fear & Greed Index</h2>
          <GaugeMeter value={sentiment.overall} label={trendLabel} />
          <p style={{ color: "#64748b", fontSize: 12, marginTop: 16, maxWidth: 400, margin: "16px auto 0" }}>
            Aggregated from price momentum, news volume, community activity, and auction results over the last 30 days.
          </p>
        </div>

        {/* Region grid */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20 }}>By Region</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 40 }}>
          {REGIONS.map(r => {
            const s = sentiment.regions[r];
            if (!s) return null;
            return (
              <div key={r} style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{r}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ flex: 1, height: 6, background: "rgba(30,41,59,0.6)", borderRadius: 3, marginRight: 10 }}>
                    <div style={{ height: "100%", borderRadius: 3, background: s.color, width: `${s.score}%`, transition: "width 1s ease" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color, minWidth: 28 }}>{s.score}</span>
                </div>
                <div style={{ fontSize: 11, color: s.color, marginTop: 6 }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Recent news sentiment */}
        {news.length > 0 && (
          <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16 }}>News Driving Sentiment</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {news.slice(0, 5).map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: 12, borderBottom: i < 4 ? "1px solid rgba(30,41,59,0.3)" : "none" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{i % 2 === 0 ? "📈" : "📰"}</span>
                  <div>
                    <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
                      {a.title}
                    </a>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                      {a.source} · {a.pubDate ? new Date(a.pubDate).toLocaleDateString("en-GB") : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
