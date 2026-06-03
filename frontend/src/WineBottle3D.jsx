import { useState } from "react";

function getGlassColor(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante") || t.includes("crémant") || t.includes("cremant")) return "#3e5c18";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("pinot gris") || t.includes("viognier") || t.includes("moscato") || t.includes("gewurz") || t.includes("albari") || t.includes("white") || t.includes("bianco") || t.includes("blanc") || t.includes("soave") || t.includes("vermentino") || t.includes("gavi")) return "#4f7a22";
  if (t.includes("ros")) return "#5a2035";
  if (t.includes("barolo") || t.includes("amarone") || t.includes("brunello") || t.includes("monfortino") || t.includes("masseto") || t.includes("conterno")) return "#080f09";
  if (t.includes("cabernet") || t.includes("merlot") || t.includes("pinot noir") || t.includes("chianti") || t.includes("sassicaia") || t.includes("ornellaia") || t.includes("bordeaux") || t.includes("pomerol") || t.includes("saint-emilion")) return "#0d2015";
  return "#1b3d22";
}

function cleanName(name) {
  return (name || "").replace(/\s+\d{4}$/, "").trim();
}

function truncate(str, max) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

const BODY = "M12,192 L68,192 L70,190 L70,92 C70,75 52,68 50,65 L50,22 C50,12 46,8 40,8 C34,8 30,12 30,22 L30,65 C28,68 10,75 10,92 L10,190 L12,192 Z";

function BottleSvg({ wine, width, height, uid }) {
  const color = getGlassColor(wine);
  const gid = `bg${uid}`;
  const cid = `cg${uid}`;
  const name = truncate(cleanName(wine.name), 13);
  const producer = truncate(wine.producer, 11);
  const vintage = wine.vintage ? String(wine.vintage) : "";

  return (
    <svg width={width} height={height} viewBox="0 0 80 200" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.55)" />
          <stop offset="22%"  stopColor="rgba(255,255,255,0.06)" />
          <stop offset="42%"  stopColor="rgba(255,255,255,0.22)" />
          <stop offset="62%"  stopColor="rgba(0,0,0,0.04)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.48)" />
        </linearGradient>
        <linearGradient id={cid} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.38)" />
          <stop offset="45%"  stopColor="rgba(255,220,80,0.45)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
        </linearGradient>
      </defs>

      <path d={BODY} fill={color} />
      <path d={BODY} fill={`url(#${gid})`} />

      {/* Label — ivory background with gold border */}
      <rect x="12" y="100" width="56" height="72" rx="2" fill="#f7f2e8" />
      <rect x="12" y="100" width="56" height="72" rx="2" fill="none" stroke="#c9a22766" strokeWidth="0.8" />
      <line x1="16" y1="106" x2="64" y2="106" stroke="#c9a22755" strokeWidth="0.7" />
      <line x1="16" y1="168" x2="64" y2="168" stroke="#c9a22755" strokeWidth="0.7" />

      {/* Wine name */}
      <text x="40" y="121" textAnchor="middle" fontSize="6.2" fontFamily="Georgia,'Times New Roman',serif" fill="#1a1205" fontWeight="bold">{name}</text>

      {/* Producer italic */}
      {producer && (
        <text x="40" y="133" textAnchor="middle" fontSize="4.6" fontFamily="Georgia,'Times New Roman',serif" fill="#4a3a10" fontStyle="italic">{producer}</text>
      )}

      <line x1="26" y1="143" x2="54" y2="143" stroke="#c9a22766" strokeWidth="0.6" />

      {/* Vintage */}
      {vintage && (
        <text x="40" y="158" textAnchor="middle" fontSize="6.5" fontFamily="Georgia,'Times New Roman',serif" fill="#8a6010" fontWeight="bold" letterSpacing="1">{vintage}</text>
      )}

      {/* Capsule */}
      <rect x="28" y="10" width="24" height="22" rx="3" fill="#c9a227" />
      <rect x="28" y="10" width="24" height="22" rx="3" fill={`url(#${cid})`} />

      {/* Edge highlight */}
      <path d="M10,190 L10,92 C10,75 28,68 30,65" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function WineBottle3D({ wine }) {
  const uid = `s${String(wine.id).replace(/\W/g, "")}`;
  const [useImage, setUseImage] = useState(!!wine.imageUrl);

  return (
    <div style={{
      width: "100%", height: "180px",
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "280px",
      pointerEvents: "none",
    }}>
      <div style={{ animation: "cssBottleSpin 8s linear infinite" }}>
        {useImage ? (
          <img
            src={wine.imageUrl}
            alt=""
            style={{
              height: "162px", width: "auto", objectFit: "contain",
              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.7)) drop-shadow(0 0 8px rgba(201,162,39,0.15))",
            }}
            onError={() => setUseImage(false)}
          />
        ) : (
          <BottleSvg wine={wine} width={70} height={175} uid={uid} />
        )}
      </div>
    </div>
  );
}
