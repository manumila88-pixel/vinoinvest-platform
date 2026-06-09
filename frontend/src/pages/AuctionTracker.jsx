import React, { useState } from "react";

const UPCOMING = [
  { house: "Sotheby's", city: "London", date: "2026-07-15", lots: 450, highlight: "DRC, Pétrus, Romanée-Conti", url: "https://www.sothebys.com/en/departments/wine" },
  { house: "Christie's", city: "New York", date: "2026-07-22", lots: 380, highlight: "Opus One vertical, Screaming Eagle", url: "https://www.christies.com/departments/wine" },
  { house: "Acker", city: "Hong Kong", date: "2026-08-10", lots: 620, highlight: "Burgundy Grand Crus collection", url: "https://www.ackerwinebid.com" },
  { house: "Idealwine", city: "Paris", date: "2026-08-18", lots: 290, highlight: "Bordeaux en primeur 2022", url: "https://www.idealwine.com" },
  { house: "Sotheby's", city: "Hong Kong", date: "2026-09-05", lots: 510, highlight: "Asia Special: Asia-Pacific collectors", url: "https://www.sothebys.com/en/departments/wine" },
];

const RECENT_RESULTS = [
  { wine: "DRC Romanée-Conti 2015", house: "Sotheby's", date: "2026-06-01", estimate: "€28,000", realized: "€34,500", vs: "+23%" },
  { wine: "Pétrus 2000 (12bt OWC)", house: "Christie's", date: "2026-06-03", estimate: "€96,000", realized: "€104,000", vs: "+8%" },
  { wine: "Screaming Eagle 2019", house: "Acker", date: "2026-06-05", estimate: "€3,400", realized: "€3,850", vs: "+13%" },
  { wine: "Mouton Rothschild 1945", house: "Sotheby's", date: "2026-05-28", estimate: "€12,000", realized: "€15,200", vs: "+27%" },
  { wine: "Krug Clos du Mesnil 2002", house: "Idealwine", date: "2026-05-25", estimate: "€2,800", realized: "€2,650", vs: "-5%" },
  { wine: "Cheval Blanc 1947 (magnum)", house: "Christie's", date: "2026-05-20", estimate: "€18,000", realized: "€22,400", vs: "+24%" },
];

export default function AuctionTracker() {
  const [view, setView] = useState("upcoming");

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <style>{`
        .at-toggle { transition: background var(--vi-dur-fast) linear, color var(--vi-dur-fast) linear; cursor: pointer; }
        .at-row { transition: background var(--vi-dur-fast) linear; }
        .at-row:hover { background: var(--vi-bg-elev); }
        .at-card { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .at-card:hover { transform: translateY(-2px); box-shadow: var(--vi-elev-2); }
        .at-link { transition: background var(--vi-dur-fast) linear, color var(--vi-dur-fast) linear; }
        .at-link:hover { background: rgba(201,162,39,0.2) !important; }
        @media (prefers-reduced-motion: reduce) { .at-card:hover { transform: none; } }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(24px,4vw,40px) 24px" }}>
        <a href="/" style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", textDecoration: "none" }}>← Back</a>

        <div style={{ margin: "24px 0 40px" }}>
          <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-2xl)", fontWeight: 800, marginBottom: 8 }}>
            Auction Tracker
          </h1>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", lineHeight: 1.6 }}>
            Calendar and results from major fine wine auction houses.
          </p>
          <div style={{ marginTop: 10, fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.8 }}>
            Sources:{" "}
            <a href="https://www.sothebys.com/en/departments/wine" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-text-dim)" }}>Sotheby's</a>
            {" · "}
            <a href="https://www.christies.com/departments/wine" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-text-dim)" }}>Christie's</a>
            {" · "}
            <a href="https://www.ackerwinebid.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-text-dim)" }}>Acker</a>
            {" · "}
            <a href="https://www.idealwine.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--vi-text-dim)" }}>Idealwine</a>
            {" · "}Indicative data for reference only
          </div>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "var(--vi-surface)", borderRadius: "var(--vi-radius-md)", padding: 4, width: "fit-content", border: `1px solid var(--vi-border)` }}>
          {["upcoming", "results"].map(v => (
            <button key={v} className="at-toggle" onClick={() => setView(v)} style={{
              padding: "8px 20px",
              background: view === v ? "var(--vi-accent)" : "transparent",
              color: view === v ? "var(--vi-bg)" : "var(--vi-text-dim)",
              border: "none", borderRadius: "var(--vi-radius-sm)", fontWeight: 600, fontSize: "var(--vi-fs-sm)"
            }}>
              {v === "upcoming" ? "Upcoming Auctions" : "Recent Results"}
            </button>
          ))}
        </div>

        {view === "upcoming" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {UPCOMING.map((a, i) => (
              <div key={i} className="at-card vi-card" style={{
                padding: "clamp(14px,2vw,20px) clamp(16px,2vw,22px)",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: "var(--vi-fs-base)", fontFamily: "var(--vi-font-display)" }}>{a.house}</span>
                    <span style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)" }}>{a.city}</span>
                  </div>
                  <div style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", marginBottom: 4 }}>{a.highlight}</div>
                  <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.7 }}>{a.lots} lots</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)" }}>
                      {Math.ceil((new Date(a.date) - new Date()) / (1000 * 60 * 60 * 24))} days away
                    </div>
                  </div>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="at-link" style={{
                    padding: "8px 16px",
                    background: "rgba(201,162,39,0.1)", color: "var(--vi-accent)",
                    border: "1px solid rgba(201,162,39,0.3)", borderRadius: "var(--vi-radius-sm)",
                    fontSize: "var(--vi-fs-sm)", textDecoration: "none", fontWeight: 600
                  }}>View ↗</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "results" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--vi-fs-sm)" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid var(--vi-border)` }}>
                  {["Wine", "House", "Date", "Estimate", "Realized", "vs Est."].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 14px", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_RESULTS.map((r, i) => {
                  const positive = r.vs.startsWith("+");
                  return (
                    <tr key={i} className="at-row" style={{ borderBottom: `1px solid rgba(35,42,58,0.4)` }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{r.wine}</td>
                      <td style={{ padding: "12px 14px", color: "var(--vi-text-dim)" }}>{r.house}</td>
                      <td style={{ padding: "12px 14px", color: "var(--vi-text-dim)", fontVariantNumeric: "tabular-nums" }}>
                        {new Date(r.date).toLocaleDateString("en-GB")}
                      </td>
                      <td style={{ padding: "12px 14px", color: "var(--vi-text-dim)", fontVariantNumeric: "tabular-nums" }}>{r.estimate}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.realized}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: positive ? "var(--vi-positive)" : "var(--vi-negative)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.vs}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 12, opacity: 0.7 }}>
              Indicative reference data. Verify actual results with respective auction houses. Not financial advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
