import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function WinePriceCompare({ wineId, wineName, vintage, criticScore }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(() => {
    if (!wineId || !wineName || loading || data) return;
    const ctrl = new AbortController();
    setLoading(true);

    const params = new URLSearchParams({ wineName });
    if (vintage) params.set("vintage", vintage);
    if (criticScore) params.set("criticScore", criticScore);

    fetch(`${API}/api/prices/${encodeURIComponent(wineId)}?${params}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { if (e.name !== "AbortError") setLoading(false); });

    return () => ctrl.abort();
  }, [wineId, wineName, vintage, criticScore, loading, data]);

  const handleToggle = () => {
    setExpanded(e => !e);
    if (!expanded && !data) load();
  };

  if (!expanded) {
    return (
      <button
        onClick={handleToggle}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: 8,
          border: "1px solid var(--vi-border)",
          borderRadius: 10,
          background: "transparent",
          color: "var(--vi-accent)",
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "'Inter', Arial, sans-serif",
          textAlign: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => e.target.style.borderColor = "rgba(201,162,39,0.4)"}
        onMouseLeave={e => e.target.style.borderColor = "var(--vi-border)"}
      >
        Compare Prices ↓
      </button>
    );
  }

  if (loading) {
    return (
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 10, color: "var(--vi-text-dim)", marginBottom: 5, textTransform: "uppercase" }}>Compare Prices</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3a5a7a", fontSize: 11 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--vi-border)", borderTopColor: "var(--vi-accent)", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
          Loading...
        </div>
      </div>
    );
  }

  const hasPrice = data && (data.price_min || data.price_avg);
  if (!hasPrice) {
    return (
      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 10, color: "#3a5a7a", marginBottom: 4, textTransform: "uppercase" }}>Compare Prices</p>
        <div style={{ fontSize: 11, color: "var(--vi-text-dim)" }}>Prezzo non disponibile</div>
      </div>
    );
  }

  const min = data.price_min;
  const max = data.price_max;
  const spread = min && max ? Math.round(((max - min) / min) * 100) : 0;
  const isEstimate = data.source === "estimated";

  return (
    <div style={{ marginBottom: 10, cursor: "pointer" }} onClick={handleToggle}>
      <p style={{ fontSize: 10, color: "var(--vi-text-dim)", marginBottom: 5, textTransform: "uppercase" }}>
        Compare Prices{isEstimate && <span style={{ color: "var(--vi-text-dim)", marginLeft: 4, fontSize: 9 }}>(stima)</span>}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--vi-bg)" }}>
        <span style={{ fontSize: 11, color: "var(--vi-text-dim)" }}>Min</span>
        <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>€ {min}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--vi-bg)" }}>
        <span style={{ fontSize: 11, color: "var(--vi-text-dim)" }}>Max</span>
        <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>€ {max}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 10, color: "var(--vi-text-dim)" }}>
        {data.merchant_count > 0
          ? <span>{data.merchant_count} merchant · +{spread}%</span>
          : <span>Stima AI</span>
        }
        {!isEstimate && (
          <a
            href={`https://www.wine-searcher.com/find/${encodeURIComponent(wineName)}${vintage ? `/${vintage}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ color: "var(--vi-accent)", textDecoration: "none", fontWeight: 700 }}
          >Vedi →</a>
        )}
      </div>
    </div>
  );
}
