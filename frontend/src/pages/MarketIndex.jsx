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
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "var(--vi-text-dim)", fontSize: 14 }}>Loading index...</span>
    </div>
  );

  if (!index) return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", padding: 32, color: "var(--vi-negative)" }}>
      Index not available.
    </div>
  );

  const chartData = index.history?.[range] || [];
  const change = index.changes?.[range] || 0;
  const changeColor = change >= 0 ? "var(--vi-positive)" : "var(--vi-negative)";
  const changeSign = change >= 0 ? "+" : "";

  const RANGES = ["1M", "3M", "6M", "1Y", "3Y"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
          <h1 style={{ color: "var(--vi-accent)", fontSize: 28, fontWeight: 900, margin: 0 }}>
            VinoInvest Index
          </h1>
          <span style={{ color: "#64748b", fontSize: 14, fontFamily: "monospace" }}>VII</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: "var(--vi-text)", fontVariantNumeric: "tabular-nums" }}>{index.currentValue}</span>
          <span style={{ fontSize: 20, color: changeColor, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {changeSign}{change}%
          </span>
          <span style={{ fontSize: 12, color: "var(--vi-text-dim)" }}>({range})</span>
        </div>

        <p style={{ color: "var(--vi-text-dim)", fontSize: 13, margin: 0 }}>
          Indice proprietario basato sui {index.topWeights?.length || 100} vini più seguiti su VinoInvest.
          Base 1.000 dal {index.baseDate}.
        </p>
      </div>

      {/* Performance summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {Object.entries(index.changes || {}).map(([period, pct]) => (
          <div key={period} style={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--vi-text-dim)", marginBottom: 4 }}>{period}</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: pct >= 0 ? "var(--vi-positive)" : "var(--vi-negative)", fontVariantNumeric: "tabular-nums" }}>
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
            background: range === r ? "rgba(201,162,39,0.2)" : "var(--vi-bg-elev)",
            color: range === r ? "var(--vi-accent)" : "var(--vi-text-dim)", fontWeight: range === r ? 700 : 400,
            fontSize: 13, fontFamily: "inherit",
          }}>{r}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 14, padding: "20px 16px", marginBottom: 28 }}>
        <ComposedChart width={880} height={280} data={chartData} style={{ maxWidth: "100%" }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-border)" />
          <XAxis dataKey="date" tick={{ fill: "var(--vi-text-dim)", fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={["auto", "auto"]} tick={{ fill: "var(--vi-text-dim)", fontSize: 10 }} width={60} />
          <Tooltip
            formatter={v => [v.toLocaleString("it-IT"), "VII"]}
            contentStyle={{ background: "var(--vi-bg)", border: "1px solid var(--vi-border)", borderRadius: 8 }}
          />
          <ReferenceLine y={index.baseValue} stroke="rgba(201,162,39,0.3)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="value" stroke="var(--vi-accent)" strokeWidth={2} dot={false} />
        </ComposedChart>
      </div>

      {/* Benchmark comparison */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: "var(--vi-text-dim)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Confronto benchmark — ultimi 12 mesi
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "VinoInvest Index", value: index.changes?.["1Y"] || 0, color: "var(--vi-accent)" },
            { label: "S&P 500", value: index.benchmark?.sp500_1y || 0, color: "#60a5fa" },
            { label: "Oro", value: index.benchmark?.gold_1y || 0, color: "#fbbf24" },
            { label: "Immobiliare EU", value: index.benchmark?.realestate_1y || 0, color: "#a78bfa" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--vi-text-dim)", fontSize: 13, width: 160 }}>{b.label}</span>
              <div style={{ flex: 1, height: 8, background: "var(--vi-border)", borderRadius: 4, position: "relative" }}>
                <div style={{ width: `${Math.min(100, Math.abs(b.value) * 2)}%`, height: "100%", background: b.color, borderRadius: 4 }} />
              </div>
              <span style={{ color: b.value >= 0 ? "var(--vi-positive)" : "var(--vi-negative)", fontWeight: 700, fontSize: 14, width: 56, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {b.value >= 0 ? "+" : ""}{b.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top composition */}
      <div>
        <h2 style={{ color: "var(--vi-text-dim)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Top 5 componenti dell'indice
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(index.topWeights || []).map((w, i) => (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 10, padding: "10px 16px" }}>
              <span style={{ color: "var(--vi-text-dim)", fontSize: 12, width: 20, textAlign: "right" }}>#{i + 1}</span>
              <span style={{ flex: 1, color: "var(--vi-text)", fontSize: 13 }}>{w.name}</span>
              <span style={{ color: "var(--vi-accent)", fontWeight: 700, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{(w.weight * 100).toFixed(0)}%</span>
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
