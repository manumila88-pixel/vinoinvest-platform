import React, { useState } from "react";

const SOURCES = [
  {
    name: "Liv-ex Fine Wine 100 Index",
    url: "https://www.liv-ex.com/news-and-insights/indices/",
    desc: "Global benchmark for fine wine trading prices and market trends.",
    type: "Market Data",
  },
  {
    name: "Wine Spectator",
    url: "https://www.winespectator.com",
    desc: "Critical scores and reviews for investment-grade wines.",
    type: "Ratings",
  },
  {
    name: "Decanter",
    url: "https://www.decanter.com",
    desc: "Expert tasting notes, regional guides, and auction reports.",
    type: "Ratings",
  },
  {
    name: "Wine-Searcher",
    url: "https://www.wine-searcher.com",
    desc: "Aggregated retail and auction price data from global merchants.",
    type: "Prices",
  },
  {
    name: "Robert Parker / Wine Advocate",
    url: "https://www.robertparker.com",
    desc: "100-point scores and cellar notes for collector wines.",
    type: "Ratings",
  },
  {
    name: "Jancis Robinson MW",
    url: "https://www.jancisrobinson.com",
    desc: "Master of Wine perspective on fine wine regions and vintages.",
    type: "Ratings",
  },
];

const TYPE_COLORS = {
  "Market Data": "#C9A227",
  "Ratings": "#60a5fa",
  "Prices": "#4ade80",
};

export default function SourceLink({ label = "Fonti →" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          color: "#C9A227",
          cursor: "pointer",
          fontSize: 12,
          padding: 0,
          textDecoration: "underline",
          fontFamily: "inherit",
        }}
      >
        {label}
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
        >
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(201,162,39,0.3)",
            borderRadius: 16,
            padding: 28,
            maxWidth: 520,
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0" }}>Data Sources</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  VinoInvest aggregates data from these authoritative sources.
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none", border: "none", color: "#475569",
                  cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "2px 6px",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SOURCES.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10, padding: "12px 14px",
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{s.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                        color: TYPE_COLORS[s.type] || "#94a3b8",
                        background: `${TYPE_COLORS[s.type]}1a` || "rgba(148,163,184,0.1)",
                        borderRadius: 4, padding: "1px 6px",
                      }}>
                        {s.type.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                  <span style={{ fontSize: 14, color: "#475569", flexShrink: 0, marginTop: 2 }}>↗</span>
                </a>
              ))}
            </div>

            <div style={{ marginTop: 16, fontSize: 11, color: "#334155", textAlign: "center" }}>
              AI Scores are computed by VinoInvest and are for informational purposes only.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
