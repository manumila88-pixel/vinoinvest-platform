import React, { useState, useEffect } from "react";

const COUNTER_FACTS = [
  { icon: "🍷", label: "Wines tracked", value: 50234, suffix: "+" },
  { icon: "📊", label: "Price data points", value: 1842000, suffix: "" },
  { icon: "👤", label: "Active investors", value: 3847, suffix: "+" },
  { icon: "🤖", label: "AI analyses today", value: 127, suffix: "" },
];

function AnimatedCount({ target, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + step;
        if (next >= target) { clearInterval(timer); return target; }
        return next;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export function StatsCounter() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", padding: "12px 0" }}>
      {COUNTER_FACTS.map(f => (
        <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(11,18,32,0.6)", border: "1px solid rgba(30,41,59,0.4)", borderRadius: 10, padding: "8px 14px" }}>
          <span style={{ fontSize: 16 }}>{f.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#C9A227" }}>
              <AnimatedCount target={f.value} suffix={f.suffix} />
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{f.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Show "X people are watching this wine" ticker
export function WatcherCount({ wineId }) {
  const [count] = useState(() => Math.floor(3 + Math.abs(hashCode(wineId || "")) % 28));

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    return h;
  }

  return (
    <span style={{ fontSize: 11, color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
      {count} watching now
    </span>
  );
}

// Live ticker of recent activity
export function ActivityTicker({ holdings = [] }) {
  const [items] = useState(() => {
    const wines = ["Barolo DOCG 2019", "Château Margaux 2018", "Sassicaia 2017", "Dom Pérignon 2013", "Opus One 2020", "Romanée-Conti 2016"];
    const actions = ["added to portfolio", "set a price alert on", "just viewed", "added to watchlist"];
    return Array.from({ length: 6 }, (_, i) => ({
      wine: wines[i % wines.length],
      action: actions[i % actions.length],
      ago: `${Math.floor(1 + Math.random() * 15)}m ago`,
    }));
  });

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  const item = items[idx];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(11,18,32,0.5)", borderRadius: 8, fontSize: 12, color: "#94a3b8", overflow: "hidden" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0, animation: "pulse 2s infinite" }} />
      <span style={{ animation: "fadeSlide 0.4s ease" }} key={idx}>
        Someone <span style={{ color: "#C9A227" }}>{item.action}</span> <strong style={{ color: "#e2e8f0" }}>{item.wine}</strong> — {item.ago}
      </span>
      <style>{`@keyframes fadeSlide { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
