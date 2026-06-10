import { useState } from "react";

const TIERS = [
  {
    id: "ultra",
    label: "Ultra Premium",
    sublabel: ">€2.000",
    color: "#C9A227",
    glow: "rgba(201,162,39,0.4)",
    bgFrom: "#C9A227",
    bgTo: "#e0b82d",
    examples: ["Romanée-Conti", "Pétrus", "Screaming Eagle", "Opus One"],
    detail: "I vini più rari e ambiti al mondo. ROI storico 12-20% annuo. Liquidità alta su mercati d'asta.",
    heightFrac: 0.28,
  },
  {
    id: "premium",
    label: "Premium",
    sublabel: "€500 – €2.000",
    color: "#8b9cb5",
    glow: "rgba(139,156,181,0.3)",
    bgFrom: "#4a6a8a",
    bgTo: "#2d4a6a",
    examples: ["Château Margaux", "Barolo Riserva", "Vega Sicilia", "Clos de Bèze"],
    detail: "Il cuore del mercato d'investimento. Ottimo bilanciamento tra accessibilità e potenziale di crescita. ROI medio 8-12%.",
    heightFrac: 0.38,
  },
  {
    id: "entry",
    label: "Entry Investment",
    sublabel: "€100 – €500",
    color: "#64748b",
    glow: "rgba(100,116,139,0.2)",
    bgFrom: "#1e3050",
    bgTo: "#0f1a2e",
    examples: ["Barolo entry", "Bordeaux AC", "Brunello base", "Côte-Rôtie"],
    detail: "Punto di ingresso ideale per i nuovi investitori. Alta disponibilità, mercato liquido, rischio contenuto.",
    heightFrac: 0.34,
  },
];

const W = 480;
const H = 320;
const BASE_W = 420;
const TIP_W = 60;

function getPyramidPath(tierIndex, totalTiers) {
  const tierHeights = TIERS.map(t => t.heightFrac * H);
  let yStart = 0;
  for (let i = 0; i < tierIndex; i++) yStart += tierHeights[i];
  const yEnd = yStart + tierHeights[tierIndex];

  const widthAtY = (y) => TIP_W + (BASE_W - TIP_W) * (y / H);
  const xCenterStart = (W - widthAtY(yStart)) / 2;
  const xCenterEnd = (W - widthAtY(yEnd)) / 2;

  return [
    `M ${xCenterStart} ${yStart}`,
    `L ${W - xCenterStart} ${yStart}`,
    `L ${W - xCenterEnd} ${yEnd}`,
    `L ${xCenterEnd} ${yEnd}`,
    "Z",
  ].join(" ");
}

function getGradientId(id) { return `pyramid-grad-${id}`; }

export default function WinePyramid({ onSelectTier, compact = false }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const active = selected || hovered;
  const activeTier = TIERS.find(t => t.id === active);

  function handleClick(tier) {
    const next = selected === tier.id ? null : tier.id;
    setSelected(next);
    if (onSelectTier) onSelectTier(next ? tier : null);
  }

  return (
    <div style={{ width: "100%", maxWidth: compact ? 360 : 520, margin: "0 auto" }}>
      {/* Title */}
      {!compact && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
            VinoInvest Market
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 800, margin: 0 }}>
            Piramide degli Investimenti in Vino
          </h3>
        </div>
      )}

      {/* SVG pyramid */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block", cursor: "pointer" }}
        role="img"
        aria-label="Piramide interattiva vini per fascia di investimento"
      >
        <defs>
          {TIERS.map(tier => (
            <linearGradient key={tier.id} id={getGradientId(tier.id)} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tier.bgFrom} stopOpacity="0.9" />
              <stop offset="100%" stopColor={tier.bgTo} stopOpacity="0.95" />
            </linearGradient>
          ))}
          <filter id="pyramid-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {TIERS.map((tier, i) => {
          const path = getPyramidPath(i, TIERS.length);
          const isActive = active === tier.id;
          const isSelected = selected === tier.id;
          return (
            <g key={tier.id}
              onMouseEnter={() => setHovered(tier.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(tier)}
            >
              {/* Glow for active */}
              {isActive && (
                <path
                  d={path}
                  fill={tier.glow}
                  stroke={tier.color}
                  strokeWidth="0"
                  style={{ filter: "blur(6px)" }}
                />
              )}
              {/* Tier shape */}
              <path
                d={path}
                fill={`url(#${getGradientId(tier.id)})`}
                stroke={isActive ? tier.color : "rgba(30,41,59,0.6)"}
                strokeWidth={isActive ? 2 : 1}
                style={{
                  transition: "all 0.2s ease",
                  opacity: active && !isActive ? 0.5 : 1,
                }}
              />
              {/* Selected indicator */}
              {isSelected && (
                <path
                  d={path}
                  fill="none"
                  stroke={tier.color}
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  style={{ animation: "marchingAnts 1s linear infinite" }}
                />
              )}
              {/* Tier label */}
              <text
                x={W / 2}
                y={TIERS.slice(0, i).reduce((acc, t) => acc + t.heightFrac * H, 0) + tier.heightFrac * H / 2 - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? tier.color : "#e2e8f0"}
                fontSize={i === 0 ? 11 : 12}
                fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
                style={{ pointerEvents: "none", transition: "fill 0.2s" }}
              >
                {tier.label}
              </text>
              <text
                x={W / 2}
                y={TIERS.slice(0, i).reduce((acc, t) => acc + t.heightFrac * H, 0) + tier.heightFrac * H / 2 + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? tier.color : "#64748b"}
                fontSize={10}
                fontFamily="Inter, system-ui, sans-serif"
                style={{ pointerEvents: "none", transition: "fill 0.2s" }}
              >
                {tier.sublabel}
              </text>
            </g>
          );
        })}

        {/* Divider lines */}
        {TIERS.slice(0, -1).map((tier, i) => {
          const yPos = TIERS.slice(0, i + 1).reduce((acc, t) => acc + t.heightFrac * H, 0);
          const widthAtY = TIP_W + (BASE_W - TIP_W) * (yPos / H);
          const xStart = (W - widthAtY) / 2;
          return (
            <line
              key={`divider-${i}`}
              x1={xStart} y1={yPos}
              x2={W - xStart} y2={yPos}
              stroke="rgba(15,23,42,0.8)"
              strokeWidth="2"
              style={{ pointerEvents: "none" }}
            />
          );
        })}
      </svg>

      <style>{`
        @keyframes marchingAnts { to { stroke-dashoffset: -18; } }
      `}</style>

      {/* Detail card */}
      <div style={{
        marginTop: 16, padding: "16px 20px",
        background: activeTier ? `${activeTier.bgFrom}18` : "rgba(11,18,32,0.7)",
        border: `1.5px solid ${activeTier ? activeTier.color + "44" : "rgba(30,41,59,0.4)"}`,
        borderRadius: 14,
        transition: "all 0.25s ease",
        minHeight: 90,
      }}>
        {activeTier ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: activeTier.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{activeTier.label}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{activeTier.sublabel}</span>
            </div>
            <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>{activeTier.detail}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {activeTier.examples.map(e => (
                <span key={e} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: `${activeTier.bgFrom}22`, border: `1px solid ${activeTier.color}33`, color: "#94a3b8" }}>
                  {e}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 12, color: "#3a5a7a", textAlign: "center", paddingTop: 14 }}>
            Clicca su una fascia per scoprire i vini
          </p>
        )}
      </div>
    </div>
  );
}
