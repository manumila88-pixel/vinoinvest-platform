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
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ margin: "24px 0 40px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 8 }}>🔨 Auction Tracker</h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            Calendar and results from major fine wine auction houses.
          </p>
          <div style={{ marginTop: 10, fontSize: 11, color: "#475569" }}>
            Sources: <a href="https://www.sothebys.com/en/departments/wine" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b" }}>Sotheby's ↗</a> ·
            <a href="https://www.christies.com/departments/wine" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", marginLeft: 4 }}>Christie's ↗</a> ·
            <a href="https://www.ackerwinebid.com" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", marginLeft: 4 }}>Acker ↗</a> ·
            <a href="https://www.idealwine.com" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b", marginLeft: 4 }}>Idealwine ↗</a>
            <span style={{ marginLeft: 8 }}>· Indicative data for reference only</span>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["upcoming", "results"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 20px", background: view === v ? "#C9A227" : "rgba(30,41,59,0.5)",
              color: view === v ? "#020617" : "#94a3b8",
              border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14
            }}>
              {v === "upcoming" ? "Upcoming Auctions" : "Recent Results"}
            </button>
          ))}
        </div>

        {view === "upcoming" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {UPCOMING.map((a, i) => (
              <div key={i} style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>{a.house}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{a.city}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>🏆 {a.highlight}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{a.lots} lots</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>
                      {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      {Math.ceil((new Date(a.date) - new Date()) / (1000 * 60 * 60 * 24))} days away
                    </div>
                  </div>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" style={{
                    padding: "8px 16px", background: "rgba(201,162,39,0.1)", color: "#C9A227",
                    border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 600
                  }}>View ↗</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "results" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
                  {["Wine", "House", "Date", "Estimate", "Realized", "vs Est."].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 14px", color: "#64748b", fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_RESULTS.map((r, i) => {
                  const positive = r.vs.startsWith("+");
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(30,41,59,0.2)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>{r.wine}</td>
                      <td style={{ padding: "12px 14px", color: "#94a3b8" }}>{r.house}</td>
                      <td style={{ padding: "12px 14px", color: "#94a3b8" }}>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                      <td style={{ padding: "12px 14px", color: "#64748b" }}>{r.estimate}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700 }}>{r.realized}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: positive ? "#4ade80" : "#f87171", fontWeight: 700 }}>{r.vs}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ fontSize: 11, color: "#334155", marginTop: 12 }}>
              Indicative reference data. Verify actual results with respective auction houses. Not financial advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
