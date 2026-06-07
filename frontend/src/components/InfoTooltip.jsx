import React, { useState, useRef, useEffect } from "react";

/**
 * Inline contextual tooltip. Wrap any element:
 * <InfoTooltip tip="Spiegazione..."><span>AI Score</span></InfoTooltip>
 *
 * Props:
 *  tip      - string: tooltip content
 *  placement - "top" | "bottom" | "left" | "right"  (default "top")
 *  icon      - show "ⓘ" badge (default false)
 */
export default function InfoTooltip({ children, tip, placement = "top", icon = false }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const tipRef = useRef(null);

  if (!tip) return children;

  return (
    <span
      ref={ref}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4, cursor: "help" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {icon && (
        <span style={{ fontSize: 11, color: "#3a5a7a", lineHeight: 1, userSelect: "none" }}>ⓘ</span>
      )}
      {visible && (
        <span
          ref={tipRef}
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 9999,
            ...(placement === "top"    ? { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" } : {}),
            ...(placement === "bottom" ? { top: "calc(100% + 8px)",    left: "50%", transform: "translateX(-50%)" } : {}),
            ...(placement === "left"   ? { right: "calc(100% + 8px)",  top: "50%",  transform: "translateY(-50%)" } : {}),
            ...(placement === "right"  ? { left: "calc(100% + 8px)",   top: "50%",  transform: "translateY(-50%)" } : {}),
            width: "max-content",
            maxWidth: 240,
            padding: "8px 12px",
            background: "rgba(8,15,28,0.97)",
            border: "1px solid rgba(201,162,39,0.25)",
            borderRadius: 10,
            color: "#94a3b8",
            fontSize: 12,
            lineHeight: 1.6,
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            pointerEvents: "none",
            animation: "tipIn 0.15s ease-out",
            whiteSpace: "normal",
          }}
        >
          {tip}
          {/* Arrow */}
          <span style={{
            position: "absolute",
            ...(placement === "top"    ? { bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)" } : {}),
            ...(placement === "bottom" ? { top: -5,    left: "50%", transform: "translateX(-50%) rotate(45deg)" } : {}),
            ...(placement === "left"   ? { right: -5,  top: "50%",  transform: "translateY(-50%) rotate(45deg)" } : {}),
            ...(placement === "right"  ? { left: -5,   top: "50%",  transform: "translateY(-50%) rotate(45deg)" } : {}),
            width: 8, height: 8,
            background: "rgba(8,15,28,0.97)",
            border: "1px solid rgba(201,162,39,0.25)",
            borderTop: placement === "bottom" ? "1px solid rgba(201,162,39,0.25)" : "none",
            borderLeft: placement === "right" ? "1px solid rgba(201,162,39,0.25)" : "none",
            borderRight: placement === "left" ? "1px solid rgba(201,162,39,0.25)" : "none",
            borderBottom: placement === "top" ? "1px solid rgba(201,162,39,0.25)" : "none",
          }} />
        </span>
      )}
      <style>{`
        @keyframes tipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </span>
  );
}

// Convenience: score badge with tooltip
export function ScoreWithTooltip({ score, signal }) {
  const signalColor = {
    "Strong Buy": "#4ade80", "Buy": "#86efac",
    "Hold": "#C9A227", "Reduce": "#fb923c", "Sell": "#f87171",
  };
  const tip = `AI Score 0-100: calcolato su rating critico, annata, produttore, trend di mercato e rischio di liquidità.\n• >80 = Strong Buy\n• 60-80 = Buy\n• 40-60 = Hold\n• <40 = Sell`;
  return (
    <InfoTooltip tip={tip} icon placement="top">
      <span style={{ fontWeight: 800, fontSize: 22, color: signalColor[signal] || "#C9A227" }}>
        {score ?? "—"}
      </span>
    </InfoTooltip>
  );
}

// Convenience: signal badge with tooltip
export function SignalBadge({ signal }) {
  const TIPS = {
    "Strong Buy": "Ottimo momento di acquisto. Momentum, fondamentali e trend tutti positivi. Considera di aggiungere al portfolio.",
    "Buy": "Buone prospettive nel medio-lungo termine. Fondamentali solidi con trend positivo.",
    "Hold": "Mantieni le posizioni senza aggiungere. Aspetta segnali più chiari prima di muoverti.",
    "Reduce": "Considera di ridurre l'esposizione. Alcuni indicatori mostrano debolezza.",
    "Sell": "I fondamentali suggeriscono di uscire dalla posizione o ridurla significativamente.",
  };
  const COLORS = {
    "Strong Buy": { bg: "rgba(74,222,128,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.3)" },
    "Buy":        { bg: "rgba(134,239,172,0.15)", color: "#86efac", border: "rgba(134,239,172,0.3)" },
    "Hold":       { bg: "rgba(201,162,39,0.15)",  color: "#C9A227", border: "rgba(201,162,39,0.3)" },
    "Reduce":     { bg: "rgba(251,146,60,0.15)",  color: "#fb923c", border: "rgba(251,146,60,0.3)" },
    "Sell":       { bg: "rgba(248,113,113,0.15)", color: "#f87171", border: "rgba(248,113,113,0.3)" },
  };
  const style = COLORS[signal] || COLORS["Hold"];
  return (
    <InfoTooltip tip={TIPS[signal] || ""} placement="top">
      <span style={{
        padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
        background: style.bg, color: style.color, border: `1px solid ${style.border}`,
        cursor: "help",
      }}>
        {signal}
      </span>
    </InfoTooltip>
  );
}

// Convenience: ROI with tooltip
export function ROIWithTooltip({ roi, profit }) {
  const tip = `ROI = (Valore attuale − Prezzo pagato) ÷ Prezzo pagato × 100\nP&L = ${profit >= 0 ? "+" : ""}€${Math.abs(profit || 0).toFixed(0)}`;
  const positive = (roi || 0) >= 0;
  return (
    <InfoTooltip tip={tip} icon placement="top">
      <span style={{ fontWeight: 700, color: positive ? "#4ade80" : "#f87171" }}>
        {positive ? "+" : ""}{(roi || 0).toFixed(1)}%
      </span>
    </InfoTooltip>
  );
}
