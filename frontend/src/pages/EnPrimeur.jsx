import React, { useState } from "react";

const CHATEAUX = [
  { name: "Pétrus", region: "Pomerol", last_ep: 2023, ep_price: 6200, current_price: 8100, roi_5y: 28.4, score: 97, icon: "🏆" },
  { name: "Château Margaux", region: "Margaux", last_ep: 2023, ep_price: 680, current_price: 840, roi_5y: 18.2, score: 96, icon: "⭐" },
  { name: "Château Latour", region: "Pauillac", last_ep: 2023, ep_price: 840, current_price: 1050, roi_5y: 22.1, score: 97, icon: "⭐" },
  { name: "Mouton Rothschild", region: "Pauillac", last_ep: 2023, ep_price: 560, current_price: 680, roi_5y: 16.8, score: 95, icon: "⭐" },
  { name: "Haut-Brion", region: "Pessac-Léognan", last_ep: 2023, ep_price: 720, current_price: 890, roi_5y: 19.5, score: 96, icon: "⭐" },
  { name: "Lafite Rothschild", region: "Pauillac", last_ep: 2023, ep_price: 680, current_price: 820, roi_5y: 17.9, score: 96, icon: "⭐" },
  { name: "Cheval Blanc", region: "Saint-Émilion", last_ep: 2023, ep_price: 980, current_price: 1240, roi_5y: 24.8, score: 97, icon: "⭐" },
  { name: "Ausone", region: "Saint-Émilion", last_ep: 2022, ep_price: 1420, current_price: 1680, roi_5y: 15.6, score: 96, icon: "⭐" },
  { name: "Angélus", region: "Saint-Émilion", last_ep: 2023, ep_price: 320, current_price: 395, roi_5y: 21.3, score: 94, icon: "🔔" },
  { name: "Pichon Baron", region: "Pauillac", last_ep: 2023, ep_price: 140, current_price: 178, roi_5y: 24.1, score: 93, icon: "🔵" },
];

const VINTAGES = [
  { year: 2019, score: 98, note: "Exceptional — century vintage for Right Bank. Excellent value at release." },
  { year: 2020, score: 96, note: "Outstanding — warm, concentrated. Best across all appellations." },
  { year: 2021, score: 89, note: "Good — cool vintage. Elegant wines. Some undervalued châteaux." },
  { year: 2022, score: 99, note: "Historic — possibly the best Bordeaux vintage of the century. Very limited supply." },
  { year: 2023, score: 93, note: "Very good — complex with good freshness. Released Spring 2025." },
];

export default function EnPrimeur() {
  const [sortBy, setSortBy] = useState("roi_5y");

  const sorted = [...CHATEAUX].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ margin: "24px 0 40px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 8 }}>🍇 Bordeaux En Primeur</h1>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 600 }}>
            Track Bordeaux en primeur campaigns, historical ROI and vintage quality scores.
            Buy wine as futures before bottling.
          </p>
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 8, display: "inline-block", fontSize: 12, color: "#94a3b8" }}>
            ⚠️ En primeur prices are historical reference data. Verify current prices with your merchant.
            Source: <a href="https://www.idealwine.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A227" }}>Idealwine ↗</a> ·
            <a href="https://www.liv-ex.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C9A227", marginLeft: 4 }}>Liv-ex ↗</a>
          </div>
        </div>

        {/* Vintage scores */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20 }}>Recent Vintages</h2>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {VINTAGES.map(v => (
              <div key={v.year} style={{
                flexShrink: 0, width: 180, background: "rgba(11,18,32,0.8)",
                border: `1px solid ${v.score >= 97 ? "rgba(201,162,39,0.4)" : "rgba(30,41,59,0.5)"}`,
                borderRadius: 14, padding: 18
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{v.year}</span>
                  <span style={{
                    fontSize: 16, fontWeight: 800, color: v.score >= 97 ? "#C9A227" : v.score >= 94 ? "#4ade80" : "#94a3b8",
                    background: v.score >= 97 ? "rgba(201,162,39,0.15)" : "rgba(74,222,128,0.08)",
                    padding: "3px 8px", borderRadius: 6
                  }}>{v.score}/100</span>
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>{v.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Château table */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Top Châteaux</h2>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "roi_5y", label: "ROI 5Y" },
                { key: "ep_price", label: "EP Price" },
                { key: "score", label: "Score" },
              ].map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key)} style={{
                  padding: "5px 12px", background: sortBy === s.key ? "rgba(201,162,39,0.15)" : "rgba(30,41,59,0.4)",
                  color: sortBy === s.key ? "#C9A227" : "#94a3b8",
                  border: `1px solid ${sortBy === s.key ? "rgba(201,162,39,0.3)" : "rgba(30,41,59,0.5)"}`,
                  borderRadius: 6, fontSize: 12, cursor: "pointer"
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
                  {["Château", "Region", "2023 EP Price", "Current", "5Y ROI", "Score"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(c => (
                  <tr key={c.name} style={{ borderBottom: "1px solid rgba(30,41,59,0.25)" }}>
                    <td style={{ padding: "12px" }}>
                      <span style={{ marginRight: 6 }}>{c.icon}</span>
                      <strong>{c.name}</strong>
                    </td>
                    <td style={{ padding: "12px", color: "#94a3b8" }}>{c.region}</td>
                    <td style={{ padding: "12px" }}>
                      €{c.ep_price.toLocaleString()}
                      <span style={{ fontSize: 10, color: "#475569", marginLeft: 4 }}>/bt</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      €{c.current_price.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ color: "#4ade80", fontWeight: 700 }}>+{c.roi_5y}%</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ color: "#C9A227", fontWeight: 700 }}>{c.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: "#334155", marginTop: 12 }}>
            Reference prices. Data: <a href="https://www.idealwine.com" target="_blank" rel="noopener noreferrer" style={{ color: "#475569" }}>Idealwine ↗</a> · <a href="https://www.liv-ex.com" target="_blank" rel="noopener noreferrer" style={{ color: "#475569" }}>Liv-ex ↗</a>
            · Past performance does not guarantee future results.
          </p>
        </div>

        {/* How EP works */}
        <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16 }}>How En Primeur Works</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { step: "1", title: "Spring Campaign", desc: "Châteaux release barrel samples for critics. Prices set based on vintage quality." },
              { step: "2", title: "Futures Purchase", desc: "Merchants sell futures (wine not yet bottled). Typically 18-24 months before delivery." },
              { step: "3", title: "Bottling & Delivery", desc: "Wine is bottled and delivered to buyers, typically 2-3 years after harvest." },
              { step: "4", title: "ROI Potential", desc: "Price typically rises between EP release and physical delivery, especially for great vintages." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,162,39,0.2)", color: "#C9A227", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, fontSize: 13 }}>
                  {s.step}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
