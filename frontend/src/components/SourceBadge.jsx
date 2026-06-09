import React, { useState } from "react";

const RELIABILITY_COLOR = (score) => {
  if (score >= 95) return "var(--vi-positive)";
  if (score >= 80) return "var(--vi-accent)";
  return "var(--vi-text-dim)";
};

export default function SourceBadge({ source, url, date, confidence = 90, compact = false }) {
  const [hovered, setHovered] = useState(false);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const color = RELIABILITY_COLOR(confidence);

  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source: ${source}, external link`}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          fontSize: compact ? 9 : 10,
          color,
          textDecoration: "none",
          background: `${color}12`,
          border: `1px solid ${color}30`,
          borderRadius: 4,
          padding: compact ? "1px 4px" : "2px 6px",
          whiteSpace: "nowrap",
          cursor: "pointer",
          transition: `opacity var(--vi-dur-fast) var(--vi-ease)`,
        }}
      >
        {!compact && <span style={{ opacity: 0.7 }}>Fonte:</span>}
        <span style={{ fontWeight: 600 }}>{source}</span>
        <span style={{ fontSize: 8, opacity: 0.8 }}>↗</span>
      </a>

      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--vi-bg-elev)",
            border: "1px solid var(--vi-accent-glow)",
            borderRadius: "var(--vi-radius-sm)",
            padding: "8px 12px",
            fontSize: 11,
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          <div style={{ color: "var(--vi-text)", fontWeight: 600 }}>{source}</div>
          <div style={{ color: "var(--vi-text-dim)", marginTop: 2 }}>
            Reliability: <span style={{ color }}>{confidence}%</span>
          </div>
          {formattedDate && (
            <div style={{ color: "var(--vi-text-dim)", marginTop: 1 }}>Updated: {formattedDate}</div>
          )}
          <div style={{ color: "#64748b", marginTop: 2, fontSize: 10 }}>Click to visit source ↗</div>
        </div>
      )}
    </span>
  );
}

export function SourceRow({ sources = [] }) {
  if (!sources.length) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
      <span style={{ fontSize: 10, color: "#64748b" }}>Fonti:</span>
      {sources.map((s, i) => (
        <SourceBadge key={i} source={s.name} url={s.url} date={s.date} confidence={s.confidence} compact />
      ))}
    </div>
  );
}
