import React, { useState } from "react";

const RELIABILITY_COLOR = (score) => {
  if (score >= 95) return "#4ade80";
  if (score >= 80) return "#C9A227";
  return "#94a3b8";
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
          transition: "opacity 0.15s",
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
            background: "#0f172a",
            border: "1px solid rgba(201,162,39,0.2)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11,
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          <div style={{ color: "#e2e8f0", fontWeight: 600 }}>{source}</div>
          <div style={{ color: "#94a3b8", marginTop: 2 }}>
            Reliability: <span style={{ color }}>{confidence}%</span>
          </div>
          {formattedDate && (
            <div style={{ color: "#94a3b8", marginTop: 1 }}>Updated: {formattedDate}</div>
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
