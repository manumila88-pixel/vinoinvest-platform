import { useState, useEffect, useRef } from "react";

const COLORS = [
  "#C9A227", "#4a9eff", "#4ade80", "#f87171",
  "#a78bfa", "#fb923c", "#34d399", "#e879f9",
  "#60a5fa", "#fbbf24",
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function PortfolioDonut({ data, label = "Per Tipo", totalValue }) {
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState(null);
  const animRef = useRef(null);
  const lastTime = useRef(null);
  const paused = useRef(false);

  useEffect(() => {
    function animate(time) {
      if (!paused.current) {
        if (lastTime.current !== null) {
          const delta = time - lastTime.current;
          setRotation(r => (r + delta * 0.02) % 360);
        }
        lastTime.current = time;
      }
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: "#3a5a7a", fontSize: 13 }}>
        Nessun dato
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const CX = 100, CY = 100, R = 70, INNER = 42;

  let cumulAngle = 0;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const start = cumulAngle;
    cumulAngle += angle;
    return { ...d, start, angle, end: cumulAngle, color: COLORS[i % COLORS.length] };
  });

  const hoveredSlice = hovered != null ? slices[hovered] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        {/* Donut SVG */}
        <div
          style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}
          onMouseEnter={() => { paused.current = true; lastTime.current = null; }}
          onMouseLeave={() => { paused.current = false; setHovered(null); }}
        >
          <svg
            viewBox="0 0 200 200"
            style={{ width: "100%", height: "100%", transform: `rotate(${rotation}deg)`, transition: paused.current ? "none" : undefined }}
          >
            <defs>
              {slices.map((s, i) => (
                <radialGradient key={i} id={`dg-${i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.65" />
                </radialGradient>
              ))}
            </defs>
            {slices.map((s, i) => {
              const isHov = hovered === i;
              const outerR = isHov ? R + 6 : R;
              const startPath = arcPath(CX, CY, outerR, s.start, s.end);
              const endPath = arcPath(CX, CY, INNER, s.start, s.end);
              const startInner = polarToCartesian(CX, CY, INNER, s.start);
              const endInner = polarToCartesian(CX, CY, INNER, s.end);
              const startOuter = polarToCartesian(CX, CY, outerR, s.start);
              const endOuter = polarToCartesian(CX, CY, outerR, s.end);
              const largeArc = s.angle > 180 ? 1 : 0;
              const donutPath = [
                `M ${endOuter.x} ${endOuter.y}`,
                `A ${outerR} ${outerR} 0 ${largeArc} 0 ${startOuter.x} ${startOuter.y}`,
                `L ${startInner.x} ${startInner.y}`,
                `A ${INNER} ${INNER} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
                "Z",
              ].join(" ");
              return (
                <path
                  key={i}
                  d={donutPath}
                  fill={`url(#dg-${i})`}
                  stroke="rgba(11,18,32,0.5)"
                  strokeWidth={isHov ? 2 : 0.5}
                  style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
            {/* Center text — counter-rotated */}
            <g style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "none" }}>
              {hoveredSlice ? (
                <>
                  <text x={CX} y={CY - 6} textAnchor="middle" fill={hoveredSlice.color} fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">
                    {hoveredSlice.label}
                  </text>
                  <text x={CX} y={CY + 9} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter,sans-serif">
                    {((hoveredSlice.value / total) * 100).toFixed(1)}%
                  </text>
                  {hoveredSlice.roi != null && (
                    <text x={CX} y={CY + 23} textAnchor="middle" fill={hoveredSlice.roi >= 0 ? "#4ade80" : "#f87171"} fontSize="9" fontFamily="Inter,sans-serif">
                      ROI {hoveredSlice.roi >= 0 ? "+" : ""}{hoveredSlice.roi}%
                    </text>
                  )}
                </>
              ) : (
                <>
                  <text x={CX} y={CY - 4} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700" fontFamily="Playfair Display,serif">
                    {totalValue != null ? `€${(totalValue / 1000).toFixed(0)}k` : `${data.length}`}
                  </text>
                  <text x={CX} y={CY + 12} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Inter,sans-serif">
                    {totalValue != null ? "Portfolio" : "vini"}
                  </text>
                </>
              )}
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, minWidth: 120 }}>
          {slices.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => { paused.current = true; lastTime.current = null; setHovered(i); }}
              onMouseLeave={() => { paused.current = false; setHovered(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: 6,
                cursor: "pointer",
                background: hovered === i ? `${s.color}12` : "transparent",
                transition: "background 0.15s",
                marginBottom: 2,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: hovered === i ? s.color : "#94a3b8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: hovered === i ? 700 : 400 }}>
                {s.label}
              </span>
              <span style={{ fontSize: 11, color: "#C9A227", fontWeight: 700, flexShrink: 0 }}>
                {((s.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
