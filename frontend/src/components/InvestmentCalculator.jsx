import React, { useState, useMemo } from "react";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from "recharts";

const RISK_PROFILES = {
  conservativo: { annualReturn: 0.06, volatility: 0.06, label: "Conservativo", color: "#4ade80" },
  bilanciato:   { annualReturn: 0.09, volatility: 0.10, label: "Bilanciato",   color: "#C9A227" },
  aggressivo:   { annualReturn: 0.13, volatility: 0.16, label: "Aggressivo",   color: "#f87171" },
};

function seededRandom(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateProjection(budget, years, profile, seed = 42) {
  const { annualReturn, volatility } = profile;
  const months = years * 12;
  const points = [{ month: 0, label: "Oggi", value: budget, low: budget, high: budget }];

  let value = budget;
  let low = budget;
  let high = budget;

  for (let m = 1; m <= months; m++) {
    const monthly = annualReturn / 12;
    const noise = (seededRandom(seed + m) - 0.5) * volatility / Math.sqrt(12);
    value = value * (1 + monthly);
    low = low * (1 + monthly - volatility / Math.sqrt(12) * 0.5);
    high = high * (1 + monthly + volatility / Math.sqrt(12) * 0.5);

    if (m % 12 === 0) {
      points.push({
        month: m,
        label: `Anno ${m / 12}`,
        value: Math.round(value),
        low: Math.round(low),
        high: Math.round(high),
      });
    }
  }
  return points;
}

export default function InvestmentCalculator({ onClose }) {
  const [budget, setBudget] = useState(10000);
  const [years, setYears] = useState(5);
  const [risk, setRisk] = useState("bilanciato");

  const profile = RISK_PROFILES[risk];
  const data = useMemo(() => generateProjection(budget, years, profile), [budget, years, risk]);

  const final = data[data.length - 1];
  const roi = final ? +(((final.value - budget) / budget) * 100).toFixed(1) : 0;
  const roiAnn = years > 0 ? +(Math.pow(final.value / budget, 1 / years) - 1).toFixed(4) * 100 : 0;

  const fmt = n => n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : `€${n}`;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16,
    }} onClick={onClose}>
      <div
        style={{ background: "#0a1120", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#C9A227", fontSize: 20, fontWeight: 800, margin: 0 }}>
            📊 Investment Calculator
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>
              Budget iniziale: <strong style={{ color: "#e2e8f0" }}>€{budget.toLocaleString("it-IT")}</strong>
            </label>
            <input type="range" min={1000} max={500000} step={1000} value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#C9A227" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569" }}>
              <span>€1k</span><span>€500k</span>
            </div>
          </div>

          <div>
            <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>
              Orizzonte: <strong style={{ color: "#e2e8f0" }}>{years} anni</strong>
            </label>
            <input type="range" min={1} max={20} step={1} value={years}
              onChange={e => setYears(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#C9A227" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569" }}>
              <span>1 anno</span><span>20 anni</span>
            </div>
          </div>
        </div>

        {/* Risk selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {Object.entries(RISK_PROFILES).map(([k, p]) => (
            <button key={k} onClick={() => setRisk(k)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
              border: risk === k ? `2px solid ${p.color}` : "1px solid rgba(30,41,59,0.5)",
              background: risk === k ? `${p.color}18` : "rgba(15,23,42,0.6)",
              color: risk === k ? p.color : "#64748b", fontWeight: 700, fontSize: 13,
              fontFamily: "inherit",
            }}>
              {p.label}<br />
              <span style={{ fontSize: 10, fontWeight: 400 }}>~{(p.annualReturn * 100).toFixed(0)}%/anno</span>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Investimento", value: `€${budget.toLocaleString("it-IT")}` },
            { label: `Valore stimato (${years}a)`, value: fmt(final?.value || budget), highlight: true },
            { label: "ROI totale", value: `+${roi}%`, color: profile.color },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(15,23,42,0.7)", borderRadius: 10, padding: "12px 14px", textAlign: "center", border: s.highlight ? "1px solid rgba(201,162,39,0.3)" : "1px solid rgba(30,41,59,0.3)" }}>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: s.color || "#e2e8f0" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <ComposedChart width={580} height={200} data={data} style={{ maxWidth: "100%" }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.4)" />
          <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 10 }} />
          <YAxis tickFormatter={v => fmt(v)} tick={{ fill: "#475569", fontSize: 10 }} width={55} />
          <Tooltip formatter={(v) => `€${v.toLocaleString("it-IT")}`} contentStyle={{ background: "#0a1120", border: "1px solid #1e293b", borderRadius: 8 }} />
          <Area type="monotone" dataKey="high" stroke="none" fill={`${profile.color}18`} />
          <Area type="monotone" dataKey="low" stroke="none" fill="#0a1120" />
          <Line type="monotone" dataKey="value" stroke={profile.color} strokeWidth={2} dot={false} />
        </ComposedChart>

        <p style={{ fontSize: 10, color: "#334155", marginTop: 12, textAlign: "center" }}>
          ⚠️ Proiezione indicativa basata su rendimenti storici fine wine. Non costituisce consulenza finanziaria. I rendimenti passati non garantiscono rendimenti futuri.
        </p>
      </div>
    </div>
  );
}
