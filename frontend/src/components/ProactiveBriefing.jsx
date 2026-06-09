import { useState, useEffect } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const SEEN_KEY = "vi_briefing_seen";

function getTodayKey() {
  return `vi_briefing_${new Date().toISOString().slice(0, 10)}`;
}

function hasSeen() {
  return !!localStorage.getItem(getTodayKey());
}

function markSeen() {
  localStorage.setItem(getTodayKey(), "1");
}

export default function ProactiveBriefing({ userId, holdings = [], marketWines = [] }) {
  const [briefing, setBriefing] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || hasSeen()) return;
    // Only show after a short delay so the page settles
    const t = setTimeout(() => loadBriefing(), 3000);
    return () => clearTimeout(t);
  }, [userId]);

  async function loadBriefing() {
    setLoading(true);
    try {
      // Try server-side proactive analysis first
      const res = await fetch(`${API}/api/ai/proactive-analysis/${encodeURIComponent(userId)}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.analysis) {
          setBriefing({ type: "analysis", text: data.analysis, ts: data.timestamp });
          setVisible(true);
          markSeen();
          return;
        }
      }
    } catch {}

    // Fallback: build a local briefing from holdings + market data
    if (holdings.length > 0) {
      const totalValue = holdings.reduce((s, h) => s + (h.currentValue || 0), 0);
      const totalROI = holdings.length > 0
        ? (holdings.reduce((s, h) => s + (parseFloat(h.roi) || 0), 0) / holdings.length).toFixed(1)
        : 0;
      const topWine = [...holdings].sort((a, b) => (parseFloat(b.roi) || 0) - (parseFloat(a.roi) || 0))[0];
      const hour = new Date().getHours();
      const greeting = hour < 12 ? "Buongiorno" : hour < 18 ? "Buon pomeriggio" : "Buonasera";

      setBriefing({
        type: "portfolio",
        greeting,
        totalValue: Math.round(totalValue),
        totalROI,
        topWine: topWine?.name,
        topROI: topWine ? parseFloat(topWine.roi).toFixed(1) : null,
        wineCount: holdings.length,
      });
      setVisible(true);
      markSeen();
    } else if (marketWines.length > 0) {
      // No portfolio — show top opportunity
      const top = [...marketWines]
        .sort((a, b) => (b.investment_score || 0) - (a.investment_score || 0))
        .slice(0, 1)[0];
      if (top) {
        setBriefing({ type: "opportunity", wine: top });
        setVisible(true);
        markSeen();
      }
    }
    setLoading(false);
  }

  function dismiss() {
    setVisible(false);
    markSeen();
  }

  if (!visible || !briefing) return null;

  return (
    <div style={{
      position: "fixed", bottom: 80, right: 20, zIndex: 900,
      width: 320, background: "rgba(7,11,22,0.97)", border: "1px solid rgba(201,162,39,0.3)",
      borderRadius: 14, padding: "14px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      animation: "vi-slide-in 0.4s ease-out",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>🍷</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#C9A227", fontFamily: "'Playfair Display',serif" }}>AI Wine Advisor</span>
        </div>
        <button onClick={dismiss} aria-label="Dismiss" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
      </div>

      {briefing.type === "analysis" && (
        <p style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55, margin: 0 }}>
          {briefing.text.slice(0, 200)}{briefing.text.length > 200 ? "…" : ""}
        </p>
      )}

      {briefing.type === "portfolio" && (
        <div>
          <p style={{ fontSize: 12, color: "#e2e8f0", margin: "0 0 6px", lineHeight: 1.5 }}>
            <strong>{briefing.greeting}!</strong> Il tuo portfolio ({briefing.wineCount} vini) vale <strong style={{ color: "#C9A227" }}>€{briefing.totalValue.toLocaleString("it")}</strong> — ROI medio: <strong style={{ color: briefing.totalROI >= 0 ? "#4ade80" : "#f87171" }}>{briefing.totalROI >= 0 ? "+" : ""}{briefing.totalROI}%</strong>
          </p>
          {briefing.topWine && (
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
              🏆 Top performer: <strong>{briefing.topWine}</strong> (+{briefing.topROI}%)
            </p>
          )}
        </div>
      )}

      {briefing.type === "opportunity" && (
        <div>
          <p style={{ fontSize: 12, color: "#e2e8f0", margin: "0 0 4px", lineHeight: 1.5 }}>
            💎 Opportunità del giorno: <strong style={{ color: "#C9A227" }}>{briefing.wine.name}</strong>
          </p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
            AI Score: {briefing.wine.investment_score}/100 · €{briefing.wine.current_price} · {briefing.wine.risk}
          </p>
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
        <button
          onClick={dismiss}
          style={{ flex: 1, fontSize: 11, padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(201,162,39,0.3)", background: "rgba(201,162,39,0.08)", color: "#C9A227", cursor: "pointer" }}
        >
          Vedi portfolio →
        </button>
        <button
          onClick={dismiss}
          style={{ fontSize: 11, padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.6)", background: "transparent", color: "#64748b", cursor: "pointer" }}
        >
          Chiudi
        </button>
      </div>

      <style>{`
        @keyframes vi-slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
