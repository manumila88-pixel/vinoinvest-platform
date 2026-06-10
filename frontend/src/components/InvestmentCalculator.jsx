import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from "recharts";

const RISK_PROFILES = {
  conservative: { annualReturn: 0.06, volatility: 0.06, color: "var(--vi-positive)" },
  balanced:     { annualReturn: 0.09, volatility: 0.10, color: "var(--vi-accent)" },
  aggressive:   { annualReturn: 0.13, volatility: 0.16, color: "var(--vi-negative)" },
};

const TOUR_STEPS = [
  { key: "budget",   titleKey: "calc.tourBudgetTitle",   descKey: "calc.tourBudgetDesc" },
  { key: "horizon",  titleKey: "calc.tourHorizonTitle",  descKey: "calc.tourHorizonDesc" },
  { key: "risk",     titleKey: "calc.tourRiskTitle",     descKey: "calc.tourRiskDesc" },
  { key: "summary",  titleKey: "calc.tourSummaryTitle",  descKey: "calc.tourSummaryDesc" },
  { key: "chart",    titleKey: "calc.tourChartTitle",    descKey: "calc.tourChartDesc" },
];

function generateProjection(budget, years, profile) {
  const { annualReturn, volatility } = profile;
  const months = years * 12;
  const points = [{ month: 0, label: "Today", value: budget, low: budget, high: budget }];
  let value = budget, low = budget, high = budget;
  for (let m = 1; m <= months; m++) {
    const monthly = annualReturn / 12;
    value = value * (1 + monthly);
    low  = low  * (1 + monthly - volatility / Math.sqrt(12) * 0.5);
    high = high * (1 + monthly + volatility / Math.sqrt(12) * 0.5);
    if (m % 12 === 0) {
      points.push({ month: m, label: `Y${m / 12}`, value: Math.round(value), low: Math.round(low), high: Math.round(high) });
    }
  }
  return points;
}

function Tooltip2({ visible, color, title, desc, returnRange, volatility }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
      background: "#0b1220", border: `1px solid ${color}50`, borderRadius: 12,
      padding: "14px 16px", width: 240, zIndex: 200,
      boxShadow: "0 12px 32px rgba(0,0,0,0.7)",
      pointerEvents: "none",
    }}>
      <div style={{ fontWeight: 700, color, fontSize: 13, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{desc}</div>
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 4, padding: "2px 7px", fontWeight: 700 }}>↗ {returnRange}</span>
        <span style={{ fontSize: 10, color: "#64748b", background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.2)", borderRadius: 4, padding: "2px 7px" }}>{volatility}</span>
      </div>
      <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: "#0b1220", border: `1px solid ${color}50`, borderRight: "none", borderTop: "none", rotate: "-45deg" }} />
    </div>
  );
}

export default function InvestmentCalculator({ onClose }) {
  const { t } = useTranslation();
  const [budget, setBudget] = useState(10000);
  const [years, setYears] = useState(5);
  const [risk, setRisk] = useState("balanced");
  const [tourStep, setTourStep] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const profile = RISK_PROFILES[risk];
  const data = useMemo(() => generateProjection(budget, years, profile), [budget, years, risk]);
  const final = data[data.length - 1];
  const roi = final ? +(((final.value - budget) / budget) * 100).toFixed(1) : 0;
  const fmt = n => n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : `€${n}`;

  const RISK_META = {
    conservative: {
      label: t("calc.conservative"),
      desc: t("calc.conservativeDesc"),
      returnRange: "4–6%/yr",
      volatility: t("calc.lowVolatility"),
    },
    balanced: {
      label: t("calc.balanced"),
      desc: t("calc.balancedDesc"),
      returnRange: "7–10%/yr",
      volatility: t("calc.mediumVolatility"),
    },
    aggressive: {
      label: t("calc.aggressive"),
      desc: t("calc.aggressiveDesc"),
      returnRange: "11–15%/yr",
      volatility: t("calc.highVolatility"),
    },
  };

  const currentTour = tourStep !== null ? TOUR_STEPS[tourStep] : null;
  const isHighlighted = (key) => currentTour?.key === key;
  const highlightStyle = (key) => isHighlighted(key)
    ? { border: "2px solid rgba(96,165,250,0.6)", borderRadius: 12, padding: "10px", marginBottom: 0 }
    : {};

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16,
    }} onClick={onClose}>
      <div
        style={{ background: "var(--vi-bg)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "var(--vi-accent)", fontSize: 20, fontWeight: 800, margin: 0 }}>
            {t("calc.title")}
          </h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {tourStep === null ? (
              <button
                onClick={() => setTourStep(0)}
                style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", borderRadius: 8, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
              >
                🗺 {t("calc.guidedTour")}
              </button>
            ) : (
              <button
                onClick={() => setTourStep(null)}
                style={{ background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.3)", color: "#94a3b8", borderRadius: 8, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}
              >
                ✕ {t("calc.closeTour")}
              </button>
            )}
            <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "#64748b", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>×</button>
          </div>
        </div>

        {/* Tour banner */}
        {currentTour && (
          <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700, marginBottom: 2 }}>
                  {t("calc.step")} {tourStep + 1}/{TOUR_STEPS.length}: {t(currentTour.titleKey)}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{t(currentTour.descKey)}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {tourStep > 0 && (
                  <button onClick={() => setTourStep(s => s - 1)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid rgba(96,165,250,0.3)", background: "none", color: "#60a5fa", fontSize: 11, cursor: "pointer" }}>←</button>
                )}
                {tourStep < TOUR_STEPS.length - 1 ? (
                  <button onClick={() => setTourStep(s => s + 1)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#60a5fa", color: "#000", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>→</button>
                ) : (
                  <button onClick={() => setTourStep(null)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "var(--vi-positive)", color: "#000", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Done!</button>
                )}
              </div>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: 4, marginTop: 10, justifyContent: "center" }}>
              {TOUR_STEPS.map((_, i) => (
                <button key={i} onClick={() => setTourStep(i)} style={{ width: i === tourStep ? 20 : 6, height: 6, borderRadius: 3, background: i === tourStep ? "#60a5fa" : i < tourStep ? "rgba(96,165,250,0.4)" : "rgba(100,116,139,0.3)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />
              ))}
            </div>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, ...highlightStyle("budget"), ...((isHighlighted("horizon") && !isHighlighted("budget")) ? highlightStyle("horizon") : {}) }}>
          <div style={isHighlighted("budget") ? { outline: "2px solid rgba(96,165,250,0.5)", borderRadius: 8, padding: 8 } : {}}>
            <label style={{ color: "var(--vi-text-dim)", fontSize: 12, display: "block", marginBottom: 6 }}>
              {t("calc.initialBudget")}: <strong style={{ color: "#e2e8f0" }}>€{budget.toLocaleString()}</strong>
            </label>
            <input type="range" min={1000} max={500000} step={1000} value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--vi-accent)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--vi-text-dim)" }}>
              <span>€1k</span><span>€500k</span>
            </div>
          </div>

          <div style={isHighlighted("horizon") ? { outline: "2px solid rgba(96,165,250,0.5)", borderRadius: 8, padding: 8 } : {}}>
            <label style={{ color: "var(--vi-text-dim)", fontSize: 12, display: "block", marginBottom: 6 }}>
              {t("calc.horizon")}: <strong style={{ color: "#e2e8f0" }}>{years} {t("calc.years")}</strong>
            </label>
            <input type="range" min={1} max={20} step={1} value={years}
              onChange={e => setYears(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--vi-accent)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--vi-text-dim)" }}>
              <span>1 {t("calc.year")}</span><span>20 {t("calc.years")}</span>
            </div>
          </div>
        </div>

        {/* Risk selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, ...(isHighlighted("risk") ? { outline: "2px solid rgba(96,165,250,0.5)", borderRadius: 12, padding: 10 } : {}) }}>
          {Object.entries(RISK_PROFILES).map(([k, p]) => {
            const m = RISK_META[k];
            return (
              <div key={k} style={{ flex: 1, position: "relative" }}>
                <button
                  onClick={() => setRisk(k)}
                  onMouseEnter={() => setTooltip(k)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    width: "100%", padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                    border: risk === k ? `2px solid ${p.color}` : "1px solid rgba(30,41,59,0.5)",
                    background: risk === k ? `${p.color}18` : "rgba(15,23,42,0.6)",
                    color: risk === k ? p.color : "#64748b", fontWeight: 700, fontSize: 13,
                    fontFamily: "inherit", textAlign: "center",
                  }}
                >
                  {m.label}<br />
                  <span style={{ fontSize: 10, fontWeight: 400 }}>~{(p.annualReturn * 100).toFixed(0)}%/{t("calc.year")}</span>
                </button>
                <Tooltip2
                  visible={tooltip === k}
                  color={p.color}
                  title={m.label}
                  desc={m.desc}
                  returnRange={m.returnRange}
                  volatility={m.volatility}
                />
              </div>
            );
          })}
        </div>

        {/* Summary KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20, ...(isHighlighted("summary") ? { outline: "2px solid rgba(96,165,250,0.5)", borderRadius: 12, padding: 10 } : {}) }}>
          {[
            { label: t("calc.investment"), value: `€${budget.toLocaleString()}` },
            { label: `${t("calc.projectedValue")} (${years}y)`, value: fmt(final?.value || budget), highlight: true },
            { label: t("calc.totalROI"), value: `+${roi}%`, color: profile.color },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--vi-bg-elev)", borderRadius: 10, padding: "12px 14px", textAlign: "center", border: s.highlight ? "1px solid rgba(201,162,39,0.3)" : "1px solid var(--vi-border)" }}>
              <div style={{ fontSize: 10, color: "var(--vi-text-dim)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: s.color || "var(--vi-text)", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ ...(isHighlighted("chart") ? { outline: "2px solid rgba(96,165,250,0.5)", borderRadius: 12, padding: 10 } : {}) }}>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 28, height: 8, background: `${profile.color}25`, borderRadius: 2, border: `1px solid ${profile.color}30` }} />
            {t("calc.confidenceBand")}
            <span style={{ display: "inline-block", width: 20, height: 2, background: profile.color, borderRadius: 1, marginLeft: 4 }} />
            {t("calc.centralProjection")}
          </div>
          <ComposedChart width={572} height={200} data={data} style={{ maxWidth: "100%" }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-border)" />
            <XAxis dataKey="label" tick={{ fill: "var(--vi-text-dim)", fontSize: 10 }} />
            <YAxis tickFormatter={v => fmt(v)} tick={{ fill: "var(--vi-text-dim)", fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => `€${v.toLocaleString()}`} contentStyle={{ background: "var(--vi-bg)", border: "1px solid var(--vi-border)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="high" stroke="none" fill={`${profile.color}22`} fillOpacity={1} />
            <Area type="monotone" dataKey="low" stroke="none" fill="var(--vi-bg)" fillOpacity={1} />
            <Line type="monotone" dataKey="value" stroke={profile.color} strokeWidth={2.5} dot={{ r: 3, fill: profile.color, strokeWidth: 0 }} />
          </ComposedChart>
        </div>

        <p style={{ fontSize: 10, color: "#334155", marginTop: 12, textAlign: "center" }}>
          ⚠️ {t("calc.disclaimer")}
        </p>
      </div>
    </div>
  );
}
