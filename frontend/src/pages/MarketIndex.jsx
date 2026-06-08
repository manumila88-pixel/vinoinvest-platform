import React, { useState, useEffect } from "react";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function MarketIndex() {
  const [index, setIndex] = useState(null);
  const [range, setRange] = useState("1Y");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/market/index`)
      .then(r => r.json())
      .then(setIndex)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#475569", fontSize: 14 }}>Caricamento indice...</span>
    </div>
  );

  if (!index) return (
    <div style={{ minHeight: "100vh", background: "#0b1220", padding: 32, color: "#f87171" }}>
      Indice non disponibile.
    </div>
  );

  const chartData = index.history?.[range] || [];
  const change = index.changes?.[range] || 0;
  const changeColor = change >= 0 ? "#4ade80" : "#f87171";
  const changeSign = change >= 0 ? "+" : "";

  const RANGES = ["1M", "3M", "6M", "1Y", "3Y"];

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
          <h1 style={{ color: "#C9A227", fontSize: 28, fontWeight: 900, margin: 0 }}>
            VinoInvest Index
          </h1>
          <span style={{ color: "#64748b", fontSize: 14, fontFamily: "monospace" }}>VII</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: "#e2e8f0" }}>{index.currentValue}</span>
          <span style={{ fontSize: 20, color: changeColor, fontWeight: 700 }}>
            {changeSign}{change}%
          </span>
          <span style={{ fontSize: 12, color: "#475569" }}>({range})</span>
        </div>

        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
          Indice proprietario basato sui {index.topWeights?.length || 100} vini più seguiti su VinoInvest.
          Base 1.000 dal {index.baseDate}.
        </p>
      </div>

      {/* Performance summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {Object.entries(index.changes || {}).map(([period, pct]) => (
          <div key={period} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{period}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: pct >= 0 ? "#4ade80" : "#f87171" }}>
              {pct >= 0 ? "+" : ""}{pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Range selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {RANGES.map(r => (
          <button key={r} onClick={() => setRange(r)} style={{
            padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer",
            background: range === r ? "rgba(201,162,39,0.2)" : "rgba(15,23,42,0.7)",
            color: range === r ? "#C9A227" : "#64748b", fontWeight: range === r ? 700 : 400,
            fontSize: 13, fontFamily: "inherit",
          }}>{r}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.4)", borderRadius: 14, padding: "20px 16px", marginBottom: 28 }}>
        <ComposedChart width={880} height={280} data={chartData} style={{ maxWidth: "100%" }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.4)" />
          <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={["auto", "auto"]} tick={{ fill: "#475569", fontSize: 10 }} width={60} />
          <Tooltip
            formatter={v => [v.toLocaleString("it-IT"), "VII"]}
            contentStyle={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 8 }}
          />
          <ReferenceLine y={index.baseValue} stroke="rgba(201,162,39,0.3)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="value" stroke="#C9A227" strokeWidth={2} dot={false} />
        </ComposedChart>
      </div>

      {/* Benchmark comparison */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Confronto benchmark — ultimi 12 mesi
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "VinoInvest Index", value: index.changes?.["1Y"] || 0, color: "#C9A227" },
            { label: "S&P 500", value: index.benchmark?.sp500_1y || 0, color: "#60a5fa" },
            { label: "Oro", value: index.benchmark?.gold_1y || 0, color: "#fbbf24" },
            { label: "Immobiliare EU", value: index.benchmark?.realestate_1y || 0, color: "#a78bfa" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#64748b", fontSize: 13, width: 160 }}>{b.label}</span>
              <div style={{ flex: 1, height: 8, background: "rgba(30,41,59,0.5)", borderRadius: 4, position: "relative" }}>
                <div style={{ width: `${Math.min(100, Math.abs(b.value) * 2)}%`, height: "100%", background: b.color, borderRadius: 4 }} />
              </div>
              <span style={{ color: b.value >= 0 ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: 14, width: 56, textAlign: "right" }}>
                {b.value >= 0 ? "+" : ""}{b.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top composition */}
      <div>
        <h2 style={{ color: "#94a3b8", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Top 5 componenti dell'indice
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(index.topWeights || []).map((w, i) => (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.4)", borderRadius: 10, padding: "10px 16px" }}>
              <span style={{ color: "#475569", fontSize: 12, width: 20, textAlign: "right" }}>#{i + 1}</span>
              <span style={{ flex: 1, color: "#e2e8f0", fontSize: 13 }}>{w.name}</span>
              <span style={{ color: "#C9A227", fontWeight: 700, fontSize: 12 }}>{(w.weight * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 10, color: "#334155", textAlign: "center" }}>
        {index.disclaimer}
      </p>
    </div>
  );
}
