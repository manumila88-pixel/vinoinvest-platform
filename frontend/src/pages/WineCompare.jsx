import { useState, useCallback } from "react";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const MAX_WINES = 4;
const ACCENT = "#C9A227";

const METRICS = [
  { key: "investment_score", label: "AI Score", max: 100, unit: "/100", color: "#C9A227" },
  { key: "current_price",   label: "Price",    max: null, unit: "€",   color: "#818cf8" },
];

function normalizePrice(w) {
  return Number(w.currentPrice || w.current_price || 0);
}
function normalizeScore(w) {
  return Number(w.investmentScore || w.investment_score || 0);
}
function normalizeRisk(r) {
  const m = { basso: "Low", low: "Low", medio: "Medium", medium: "Medium", alto: "High", high: "High" };
  return m[(r || "").toLowerCase()] || r || "–";
}
function normalizeTrend(t) {
  if (!t) return "–";
  const lc = t.toLowerCase();
  if (lc.includes("up") || lc.includes("crescit") || lc.includes("rialzo")) return "↑ Bullish";
  if (lc.includes("down") || lc.includes("bear") || lc.includes("ribass")) return "↓ Bearish";
  return "→ Stable";
}

const PALETTE = ["#C9A227", "#818cf8", "#34d399", "#f87171"];

export default function WineCompare() {
  const [wines, setWines] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchTimer, setSearchTimer] = useState(null);

  const search = useCallback((q) => {
    if (searchTimer) clearTimeout(searchTimer);
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      setSearching(true);
      fetch(`${API}/api/wines?search=${encodeURIComponent(q)}&limit=8`)
        .then(r => r.ok ? r.json() : { results: [] })
        .then(d => { setResults(d.results || []); setSearching(false); })
        .catch(() => setSearching(false));
    }, 320);
    setSearchTimer(t);
  }, [searchTimer]);

  function addWine(w) {
    if (wines.length >= MAX_WINES) return;
    if (wines.find(x => x.id === w.id)) return;
    setWines(prev => [...prev, w]);
    setQuery("");
    setResults([]);
  }

  function removeWine(id) {
    setWines(prev => prev.filter(w => w.id !== id));
  }

  const chartData = [
    { metric: "AI Score", ...Object.fromEntries(wines.map((w, i) => [`w${i}`, normalizeScore(w)])) },
  ];

  const priceData = [
    { metric: "Price (€)", ...Object.fromEntries(wines.map((w, i) => [`w${i}`, normalizePrice(w)])) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)", fontFamily: "'Inter', Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>

        {/* Header */}
        <nav style={{ fontSize: ".85rem", color: "var(--vi-text-dim)", marginBottom: "1.5rem" }}>
          <a href="/" style={{ color: ACCENT, textDecoration: "none" }}>Home</a>
          {" › "}Compare Wines
        </nav>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: ".25rem" }}>Wine Comparison</h1>
        <p style={{ color: "var(--vi-text-dim)", marginBottom: "1.5rem", fontSize: ".9rem" }}>
          Compare up to {MAX_WINES} wines side-by-side — scores, prices, risk, and market trend.
        </p>

        {/* Search bar */}
        {wines.length < MAX_WINES && (
          <div style={{ position: "relative", maxWidth: 520, marginBottom: "2rem" }}>
            <input
              type="search"
              placeholder={`Search a wine to compare (${wines.length}/${MAX_WINES} added)...`}
              value={query}
              onChange={e => { setQuery(e.target.value); search(e.target.value); }}
              style={{
                width: "100%", padding: ".7rem 1rem", background: "var(--vi-bg-elev)",
                border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius-sm)",
                color: "var(--vi-text)", fontSize: ".9rem", boxSizing: "border-box",
              }}
            />
            {(results.length > 0 || searching) && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)",
                borderRadius: "var(--vi-radius-sm)", boxShadow: "var(--vi-elev-2)", overflow: "hidden",
              }}>
                {searching && <div style={{ padding: ".75rem 1rem", color: "var(--vi-text-dim)", fontSize: ".85rem" }}>Searching…</div>}
                {results.map(r => (
                  <button
                    key={r.id}
                    onClick={() => addWine(r)}
                    disabled={!!wines.find(w => w.id === r.id)}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: ".65rem 1rem", background: "transparent",
                      border: "none", borderBottom: "1px solid var(--vi-border)",
                      color: wines.find(w => w.id === r.id) ? "var(--vi-text-dim)" : "var(--vi-text)",
                      cursor: wines.find(w => w.id === r.id) ? "default" : "pointer",
                      fontSize: ".85rem", fontFamily: "inherit",
                    }}
                    onMouseEnter={e => { if (!wines.find(w => w.id === r.id)) e.currentTarget.style.background = "var(--vi-bg)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <strong style={{ color: ACCENT }}>{r.name || r.wine_name}</strong>
                    {" "}
                    <span style={{ color: "var(--vi-text-dim)", fontSize: ".8rem" }}>
                      {r.producer || r.winery || ""}{r.vintage ? ` · ${r.vintage}` : ""}
                      {" · "}€{normalizePrice(r).toLocaleString()}
                    </span>
                    {wines.find(w => w.id === r.id) && (
                      <span style={{ float: "right", color: "var(--vi-text-dim)", fontSize: ".75rem" }}>Added</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {wines.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--vi-text-dim)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍷</div>
            <p>Search for wines above to start comparing.</p>
          </div>
        )}

        {wines.length > 0 && (
          <>
            {/* Wine header cards */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${wines.length}, 1fr)`, gap: "1rem", marginBottom: "1.5rem" }}>
              {wines.map((w, i) => (
                <div key={w.id} style={{
                  background: "var(--vi-bg-elev)", border: `1px solid ${PALETTE[i]}40`,
                  borderRadius: "var(--vi-radius)", padding: "1rem", position: "relative",
                }}>
                  <button
                    onClick={() => removeWine(w.id)}
                    title="Remove"
                    aria-label={`Remove ${w.name || w.wine_name} from comparison`}
                    style={{
                      position: "absolute", top: 8, right: 8, background: "transparent",
                      border: "none", color: "var(--vi-text-dim)", cursor: "pointer",
                      fontSize: ".85rem", padding: "2px 6px", borderRadius: 4,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--vi-text-dim)"; }}
                  >✕</button>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE[i], marginBottom: ".5rem" }} />
                  <div style={{ fontWeight: 700, fontSize: ".95rem", marginBottom: ".25rem", paddingRight: 20 }}>
                    {w.name || w.wine_name}
                  </div>
                  <div style={{ fontSize: ".8rem", color: "var(--vi-text-dim)" }}>
                    {w.producer || w.winery || ""}
                    {w.vintage ? ` · ${w.vintage}` : ""}
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics table */}
            <div style={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius)", overflow: "hidden", marginBottom: "1.5rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--vi-border)" }}>
                    <th style={{ padding: ".75rem 1rem", textAlign: "left", fontSize: ".8rem", color: "var(--vi-text-dim)", fontWeight: 600, width: 140 }}>Metric</th>
                    {wines.map((w, i) => (
                      <th key={w.id} style={{ padding: ".75rem 1rem", textAlign: "center", fontSize: ".85rem", color: PALETTE[i], fontWeight: 700 }}>
                        {(w.name || w.wine_name || "").split(" ").slice(0, 2).join(" ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "AI Score", fn: w => { const s = normalizeScore(w); return s ? `${s}/100` : "–"; }, highlight: true },
                    { label: "Price",    fn: w => { const p = normalizePrice(w); return p ? `€${p.toLocaleString()}` : "–"; } },
                    { label: "Vintage",  fn: w => w.vintage || "–" },
                    { label: "Region",   fn: w => w.region || "–" },
                    { label: "Type",     fn: w => w.type || "–" },
                    { label: "Risk",     fn: w => normalizeRisk(w.risk) },
                    { label: "Trend",    fn: w => normalizeTrend(w.market_trend) },
                    { label: "Producer", fn: w => w.producer || w.winery || "–" },
                  ].map((row, ri) => (
                    <tr key={row.label} style={{ borderBottom: "1px solid var(--vi-border)", background: ri % 2 === 0 ? "transparent" : "var(--vi-bg)" }}>
                      <td style={{ padding: ".65rem 1rem", fontSize: ".85rem", color: "var(--vi-text-dim)", fontWeight: 500 }}>{row.label}</td>
                      {wines.map((w, i) => {
                        const val = row.fn(w);
                        const bestScore = row.label === "AI Score" && wines.length > 1 && normalizeScore(w) === Math.max(...wines.map(normalizeScore));
                        const lowestPrice = row.label === "Price" && wines.length > 1 && normalizePrice(w) > 0 && normalizePrice(w) === Math.min(...wines.filter(x => normalizePrice(x) > 0).map(normalizePrice));
                        return (
                          <td key={w.id} style={{ padding: ".65rem 1rem", textAlign: "center", fontSize: ".9rem", fontWeight: row.highlight ? 700 : 400, color: bestScore ? ACCENT : lowestPrice ? "#34d399" : "var(--vi-text)", fontVariantNumeric: "tabular-nums" }}>
                            {val}
                            {bestScore && <span title="Highest AI Score" style={{ marginLeft: 4, fontSize: ".7rem" }}>★</span>}
                            {lowestPrice && <span title="Lowest price" style={{ marginLeft: 4, fontSize: ".7rem", color: "#34d399" }}>↓</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Score bar chart */}
            {wines.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius)", padding: "1rem" }}>
                  <h3 style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--vi-text-dim)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: ".05em" }}>AI Score Comparison</h3>
                  <ComposedChart width={340} height={180} data={wines.map((w, i) => ({ name: (w.name || "Wine").split(" ")[0], score: normalizeScore(w), fill: PALETTE[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--vi-text-dim)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--vi-text-dim)" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [`${v}/100`, "AI Score"]} contentStyle={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} fill={ACCENT} isAnimationActive label={{ position: "top", fontSize: 11, fill: "var(--vi-text-dim)" }}>
                      {wines.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i]} />
                      ))}
                    </Bar>
                  </ComposedChart>
                </div>

                <div style={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius)", padding: "1rem" }}>
                  <h3 style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--vi-text-dim)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: ".05em" }}>Price Comparison (€)</h3>
                  <ComposedChart width={340} height={180} data={wines.map((w, i) => ({ name: (w.name || "Wine").split(" ")[0], price: normalizePrice(w), fill: PALETTE[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--vi-text-dim)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--vi-text-dim)" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip formatter={v => [`€${Number(v).toLocaleString()}`, "Price"]} contentStyle={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="price" radius={[4, 4, 0, 0]} isAnimationActive>
                      {wines.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i]} />
                      ))}
                    </Bar>
                  </ComposedChart>
                </div>
              </div>
            )}

            {/* Wine-Searcher links */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${wines.length}, 1fr)`, gap: "1rem" }}>
              {wines.map((w, i) => (
                <a
                  key={w.id}
                  href={`https://www.wine-searcher.com/find/${encodeURIComponent(w.name || w.wine_name || "")}${w.vintage ? `/${w.vintage}` : ""}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    display: "block", textAlign: "center", padding: ".65rem 1rem",
                    border: `1px solid ${PALETTE[i]}50`, borderRadius: "var(--vi-radius-sm)",
                    color: PALETTE[i], textDecoration: "none", fontSize: ".85rem", fontWeight: 600,
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${PALETTE[i]}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  Buy on Wine-Searcher →
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
