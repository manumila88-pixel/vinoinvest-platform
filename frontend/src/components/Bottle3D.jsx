function getBottleColor(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante") || t.includes("cremant")) return "#3e5c18";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("blanc") || t.includes("bianco") || t.includes("white") || t.includes("soave") || t.includes("vermentino") || t.includes("gavi")) return "#4f7a22";
  if (t.includes("ros")) return "#5a2035";
  if (t.includes("barolo") || t.includes("brunello") || t.includes("monfortino") || t.includes("amarone") || t.includes("masseto")) return "#0d1a10";
  return "#1b3d22";
}

export default function Bottle3D({ wine, height = 300, interactive = false }) {
  const color = getBottleColor(wine);
  const rawName = (wine.name || "").replace(/\s+\d{4}$/, "");
  const words = rawName.split(" ");
  const line1 = words.slice(0, 2).join(" ").slice(0, 16);
  const line2 = words.length > 2 ? words.slice(2, 4).join(" ").slice(0, 16) : "";

  const svgW = Math.round(height * 0.28);
  const svgH = Math.round(height * 0.86);

  return (
    <div style={{
      width: "100%",
      height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #060e1c 0%, #0a1628 100%)",
      perspective: interactive ? "600px" : "none",
    }}>
      <div style={interactive ? {
        animation: "cssBottleSpin 9s linear infinite",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      } : {}}>
        <svg
          width={svgW}
          height={svgH}
          viewBox="0 0 100 320"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: "block",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.85)) drop-shadow(0 0 14px rgba(201,162,39,0.14))",
          }}
        >
          {/* Gold capsule */}
          <rect x="38" y="2" width="24" height="26" rx="5" fill="#c9a227" />
          <rect x="38" y="22" width="24" height="6" rx="2" fill="#a07a10" />

          {/* Neck */}
          <rect x="41" y="28" width="18" height="50" rx="3" fill={color} />
          <rect x="43" y="31" width="4" height="43" rx="2" fill="white" opacity="0.10" />

          {/* Shoulder */}
          <polygon points="41,78 28,115 72,115 59,78" fill={color} />

          {/* Body */}
          <rect x="26" y="112" width="48" height="180" rx="6" fill={color} />

          {/* Body highlight */}
          <rect x="30" y="118" width="7" height="152" rx="4" fill="white" opacity="0.07" />

          {/* Bottom */}
          <rect x="26" y="286" width="48" height="8" rx="6" fill={color} />

          {/* Label background */}
          <rect x="30" y="148" width="40" height="88" rx="3" fill="#f7f2e8" />
          <rect x="32" y="150" width="36" height="84" rx="2" fill="none" stroke="#c9a227" strokeWidth="0.9" opacity="0.65" />

          {/* Top rule */}
          <line x1="36" y1="162" x2="64" y2="162" stroke="#c9a22766" strokeWidth="0.6" />

          {/* Wine name */}
          <text x="50" y="175" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" fontWeight="bold" fill="#1a1205">
            {line1}
          </text>
          {line2 && (
            <text x="50" y="186" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" fontWeight="bold" fill="#1a1205">
              {line2}
            </text>
          )}

          {/* Divider */}
          <line x1="38" y1={line2 ? 193 : 183} x2="62" y2={line2 ? 193 : 183} stroke="#c9a22788" strokeWidth="0.7" />

          {/* Vintage */}
          {wine.vintage && (
            <text x="50" y={line2 ? 215 : 206} textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="bold" fill="#8a6010">
              {wine.vintage}
            </text>
          )}

          {/* Region */}
          {wine.region && (
            <text x="50" y={line2 ? 229 : 222} textAnchor="middle" fontFamily="Georgia,serif" fontSize="5.5" fill="#6a5020">
              {wine.region.toUpperCase().slice(0, 20)}
            </text>
          )}

          {/* Bottom rule */}
          <line x1="36" y1="234" x2="64" y2="234" stroke="#c9a22744" strokeWidth="0.6" />
        </svg>
      </div>
    </div>
  );
}
