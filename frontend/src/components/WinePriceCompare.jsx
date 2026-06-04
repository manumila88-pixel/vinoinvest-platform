import { useState, useEffect } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function WinePriceCompare({ wineId, wineName, vintage, criticScore }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wineId || !wineName) { setLoading(false); return; }

    const params = new URLSearchParams({ wineName });
    if (vintage) params.set("vintage", vintage);
    if (criticScore) params.set("criticScore", criticScore);

    fetch(`${API}/api/prices/${encodeURIComponent(wineId)}?${params}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [wineId, wineName, vintage]);

  const header = (
    <p style={{ fontSize: 11, color: "#475569", marginBottom: 6, textTransform: "uppercase" }}>
      Compare Prices
    </p>
  );

  if (loading) {
    return (
      <div style={{ marginBottom: 12, width: "100%" }}>
        {header}
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", fontSize: 12 }}>
          <span style={{
            width: 12, height: 12, borderRadius: "50%",
            border: "2px solid #475569", borderTopColor: "#c9a227",
            display: "inline-block", animation: "spin 0.8s linear infinite",
          }} />
          Caricamento...
        </div>
      </div>
    );
  }

  const hasPrice = data && (data.price_min || data.price_avg);
  if (!hasPrice) {
    return (
      <div style={{ marginBottom: 12, width: "100%" }}>
        {header}
        <div style={{ fontSize: 12, color: "#475569" }}>Prezzo non disponibile</div>
      </div>
    );
  }

  const min = data.price_min;
  const max = data.price_max;
  const spread = min && max ? Math.round(((max - min) / min) * 100) : 0;
  const isEstimate = data.source === "estimated";

  return (
    <div style={{ marginBottom: 12, width: "100%" }}>
      <p style={{ fontSize: 11, color: "#475569", marginBottom: 6, textTransform: "uppercase" }}>
        Compare Prices{isEstimate && <span style={{ color: "#334155", marginLeft: 4, fontSize: 10 }}>(stima)</span>}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0f1923" }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>🔻 Min</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>€ {min}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0f1923" }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>🔺 Max</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>€ {max}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "#475569" }}>
        {data.merchant_count > 0
          ? <span>{data.merchant_count} merchant · spread +{spread}%</span>
          : <span>Prezzo stimato da AI Score</span>
        }
        {!isEstimate && (
          <a
            href={`https://www.wine-searcher.com/find/${encodeURIComponent(wineName)}${vintage ? `/${vintage}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#c9a227", textDecoration: "none", fontWeight: 700 }}
          >
            Vedi →
          </a>
        )}
      </div>
    </div>
  );
}
