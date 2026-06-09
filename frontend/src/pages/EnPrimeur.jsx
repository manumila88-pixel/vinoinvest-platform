import React, { useState } from "react";

const CHATEAUX = [
  { name: "Pétrus", region: "Pomerol", last_ep: 2023, ep_price: 6200, current_price: 8100, roi_5y: 28.4, score: 97 },
  { name: "Château Margaux", region: "Margaux", last_ep: 2023, ep_price: 680, current_price: 840, roi_5y: 18.2, score: 96 },
  { name: "Château Latour", region: "Pauillac", last_ep: 2023, ep_price: 840, current_price: 1050, roi_5y: 22.1, score: 97 },
  { name: "Mouton Rothschild", region: "Pauillac", last_ep: 2023, ep_price: 560, current_price: 680, roi_5y: 16.8, score: 95 },
  { name: "Haut-Brion", region: "Pessac-Léognan", last_ep: 2023, ep_price: 720, current_price: 890, roi_5y: 19.5, score: 96 },
  { name: "Lafite Rothschild", region: "Pauillac", last_ep: 2023, ep_price: 680, current_price: 820, roi_5y: 17.9, score: 96 },
  { name: "Cheval Blanc", region: "Saint-Émilion", last_ep: 2023, ep_price: 980, current_price: 1240, roi_5y: 24.8, score: 97 },
  { name: "Ausone", region: "Saint-Émilion", last_ep: 2022, ep_price: 1420, current_price: 1680, roi_5y: 15.6, score: 96 },
  { name: "Angélus", region: "Saint-Émilion", last_ep: 2023, ep_price: 320, current_price: 395, roi_5y: 21.3, score: 94 },
  { name: "Pichon Baron", region: "Pauillac", last_ep: 2023, ep_price: 140, current_price: 178, roi_5y: 24.1, score: 93 },
];

const VINTAGES = [
  { year: 2019, score: 98, note: "Exceptional. Century vintage for Right Bank. Excellent value at release." },
  { year: 2020, score: 96, note: "Outstanding. Warm, concentrated. Best across all appellations." },
  { year: 2021, score: 89, note: "Good. Cool vintage. Elegant wines. Some undervalued châteaux." },
  { year: 2022, score: 99, note: "Historic. Possibly the best Bordeaux vintage of the century. Very limited supply." },
  { year: 2023, score: 93, note: "Very good. Complex with good freshness. Released Spring 2025." },
];

export default function EnPrimeur() {
  const [sortBy, setSortBy] = useState("roi_5y");
  const sorted = [...CHATEAUX].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <style>{`
        .ep-vintage-card { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .ep-vintage-card:hover { transform: translateY(-2px); box-shadow: var(--vi-glow); }
        .ep-sort-btn { transition: background var(--vi-dur-fast) linear, color var(--vi-dur-fast) linear; }
        .ep-sort-btn:hover { background: rgba(192,160,98,0.1) !important; color: var(--vi-accent) !important; }
        .ep-row { transition: background var(--vi-dur-fast) linear; }
        .ep-row:hover { background: var(--vi-bg-elev); }
        .ep-step { transition: background var(--vi-dur-fast) linear; }
        @media (prefers-reduced-motion: reduce) {
          .ep-vintage-card:hover { transform: none; }
        }
      `}</style>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "clamp(24px,4vw,40px) 24px" }}>
        <a href="/" style={{ color: "var(--vi-text-dim)", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ margin: "24px 0 40px" }}>
          <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-2xl)", fontWeight: 800, marginBottom: 8 }}>
            Bordeaux En Primeur
          </h1>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", maxWidth: 600, lineHeight: 1.6 }}>
            Track Bordeaux en primeur campaigns, historical ROI and vintage quality scores.
            Buy wine as futures before bottling.
          </p>
          <div style={{
            marginTop: 12, padding: "10px 14px",
            background: "rgba(192,160,98,0.08)", border: "1px solid rgba(192,160,98,0.2)",
            borderRadius: "var(--vi-radius-sm)", display: "inline-block",
            fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)"
          }}>
            En primeur prices are historical reference data. Verify current prices with your merchant.
            Source:{" "}
            <a href="https://www.idealwine.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-accent)" }}>Idealwine</a>
            {" · "}
            <a href="https://www.liv-ex.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-accent)" }}>Liv-ex</a>
          </div>
        </div>

        {/* Vintage scores */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-lg)", fontWeight: 700, marginBottom: 20 }}>
            Recent Vintages
          </h2>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {VINTAGES.map(v => (
              <div key={v.year} className="ep-vintage-card" style={{
                flexShrink: 0, width: 180,
                background: "var(--vi-surface)",
                border: `1px solid ${v.score >= 97 ? "rgba(192,160,98,0.4)" : "var(--vi-border)"}`,
                borderRadius: "var(--vi-radius-md)", padding: 18
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--vi-font-display)" }}>{v.year}</span>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: v.score >= 97 ? "var(--vi-accent)" : v.score >= 94 ? "var(--vi-positive)" : "var(--vi-text-dim)",
                    background: v.score >= 97 ? "rgba(192,160,98,0.12)" : "rgba(74,222,128,0.08)",
                    padding: "3px 8px", borderRadius: 6
                  }}>{v.score}/100</span>
                </div>
                <p style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", lineHeight: 1.5, margin: 0 }}>{v.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Château table */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-lg)", fontWeight: 700 }}>
              Top Châteaux
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "roi_5y", label: "ROI 5Y" },
                { key: "ep_price", label: "EP Price" },
                { key: "score", label: "Score" },
              ].map(s => (
                <button key={s.key} className="ep-sort-btn" onClick={() => setSortBy(s.key)} style={{
                  padding: "5px 12px",
                  background: sortBy === s.key ? "rgba(192,160,98,0.15)" : "rgba(30,41,59,0.4)",
                  color: sortBy === s.key ? "var(--vi-accent)" : "var(--vi-text-dim)",
                  border: `1px solid ${sortBy === s.key ? "rgba(192,160,98,0.3)" : "var(--vi-border)"}`,
                  borderRadius: "var(--vi-radius-sm)", fontSize: "var(--vi-fs-xs)", cursor: "pointer"
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--vi-fs-sm)" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid var(--vi-border)` }}>
                  {["Château", "Region", "2023 EP Price", "Current", "5Y ROI", "Score"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(c => (
                  <tr key={c.name} className="ep-row" style={{ borderBottom: `1px solid rgba(35,42,58,0.5)` }}>
                    <td style={{ padding: "12px" }}>
                      <strong style={{ fontVariantNumeric: "tabular-nums" }}>{c.name}</strong>
                    </td>
                    <td style={{ padding: "12px", color: "var(--vi-text-dim)" }}>{c.region}</td>
                    <td style={{ padding: "12px", fontVariantNumeric: "tabular-nums" }}>
                      €{c.ep_price.toLocaleString()}
                      <span style={{ fontSize: 10, color: "var(--vi-text-dim)", marginLeft: 4 }}>/bt</span>
                    </td>
                    <td style={{ padding: "12px", fontVariantNumeric: "tabular-nums" }}>
                      €{c.current_price.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ color: "var(--vi-positive)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>+{c.roi_5y}%</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ color: "var(--vi-accent)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{c.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 12, opacity: 0.7 }}>
            Reference prices. Data:{" "}
            <a href="https://www.idealwine.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-text-dim)" }}>Idealwine</a>
            {" · "}
            <a href="https://www.liv-ex.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-text-dim)" }}>Liv-ex</a>
            {" · "}Past performance does not guarantee future results.
          </p>
        </div>

        {/* How EP works */}
        <div className="vi-card" style={{ padding: "clamp(20px,3vw,28px)" }}>
          <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-lg)", fontWeight: 700, marginBottom: 20 }}>
            How En Primeur Works
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { step: "1", title: "Spring Campaign", desc: "Châteaux release barrel samples for critics. Prices set based on vintage quality." },
              { step: "2", title: "Futures Purchase", desc: "Merchants sell futures (wine not yet bottled). Typically 18-24 months before delivery." },
              { step: "3", title: "Bottling & Delivery", desc: "Wine is bottled and delivered to buyers, typically 2-3 years after harvest." },
              { step: "4", title: "ROI Potential", desc: "Price typically rises between EP release and physical delivery, especially for great vintages." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(192,160,98,0.15)", color: "var(--vi-accent)",
                  border: "1px solid rgba(192,160,98,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, flexShrink: 0, fontSize: 13
                }}>{s.step}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--vi-fs-sm)", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
