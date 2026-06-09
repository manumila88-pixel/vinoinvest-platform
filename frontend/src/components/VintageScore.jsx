import React, { useEffect, useState, memo } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const REGION_MAP = {
  bordeaux: "Bordeaux", burgundy: "Bourgogne", barolo: "Barolo",
  chianti: "Chianti", champagne: "Champagne", rioja: "Rioja",
  douro: "Douro", napa: "Napa Valley", mendoza: "Mendoza",
};

function scoreColor(score) {
  if (score >= 90) return "var(--vi-positive)";
  if (score >= 78) return "#86efac";
  if (score >= 65) return "var(--vi-accent)";
  if (score >= 50) return "#fb923c";
  return "var(--vi-negative)";
}

const VintageScore = memo(function VintageScore({ wine, compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const region = detectRegion(wine);
  const year = wine.vintage ? parseInt(wine.vintage) : null;

  useEffect(() => {
    if (!region || !year || year < 2000) return;
    setLoading(true);
    fetch(`${API}/api/vintage/score?region=${region}&year=${year}`)
      .then(r => r.json())
      .then(d => { if (d.score !== undefined) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [region, year]);

  if (!region || !year || loading || !data) {
    if (compact) return null;
    return null;
  }

  if (compact) {
    return (
      <span
        title={`Annata ${year} ${data.region}: ${data.label} (${data.score}/100) — Dati climatici Open-Meteo`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
          background: `${scoreColor(data.score)}22`, color: scoreColor(data.score),
          border: `1px solid ${scoreColor(data.score)}44`, cursor: "help",
        }}
      >
        {data.score}
      </span>
    );
  }

  return (
    <div style={{
      background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ color: "var(--vi-text-dim)", fontWeight: 600 }}>Qualità Annata {year}</span>
        <span style={{ color: scoreColor(data.score), fontWeight: 700 }}>{data.score}/100</span>
      </div>
      <div style={{ background: "rgba(2,6,23,0.5)", borderRadius: 4, height: 4, marginBottom: 6 }}>
        <div style={{ width: `${data.score}%`, height: "100%", borderRadius: 4, background: scoreColor(data.score), transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: scoreColor(data.score), fontWeight: 600 }}>{data.label}</span>
        <span style={{ color: "var(--vi-text-dim)", fontSize: 10 }}>
          {data.temp_mean}°C · {data.rain_total}mm · Open-Meteo
        </span>
      </div>
    </div>
  );
});

function detectRegion(wine) {
  const text = `${wine.region || ""} ${wine.name || ""} ${wine.country || ""}`.toLowerCase();
  if (/bordeaux|médoc|pomerol|saint.émilion|graves/.test(text)) return "bordeaux";
  if (/bourgogne|burgundy|pinot.noir|côte.de.nuits|gevrey/.test(text)) return "burgundy";
  if (/barolo|barbaresco|piemonte|piedmont/.test(text)) return "barolo";
  if (/chianti|toscana|tuscany|brunello|bolgheri/.test(text)) return "chianti";
  if (/champagne|reims|épernay/.test(text)) return "champagne";
  if (/rioja|ribera/.test(text)) return "rioja";
  if (/douro|porto/.test(text)) return "douro";
  if (/napa|sonoma|california/.test(text)) return "napa";
  if (/mendoza|argentina/.test(text)) return "mendoza";
  return null;
}

export default VintageScore;
export { detectRegion };
