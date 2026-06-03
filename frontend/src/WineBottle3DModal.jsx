import { useEffect, useRef, useState } from "react";

function getGlassColor(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante") || t.includes("crémant") || t.includes("cremant")) return "#3e5c18";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("pinot gris") || t.includes("viognier") || t.includes("moscato") || t.includes("gewurz") || t.includes("albari") || t.includes("white") || t.includes("bianco") || t.includes("blanc") || t.includes("soave") || t.includes("vermentino") || t.includes("gavi")) return "#4f7a22";
  if (t.includes("ros")) return "#5a2035";
  if (t.includes("barolo") || t.includes("amarone") || t.includes("brunello") || t.includes("monfortino") || t.includes("masseto") || t.includes("conterno")) return "#080f09";
  if (t.includes("cabernet") || t.includes("merlot") || t.includes("pinot noir") || t.includes("chianti") || t.includes("sassicaia") || t.includes("ornellaia") || t.includes("bordeaux") || t.includes("pomerol") || t.includes("saint-emilion")) return "#0d2015";
  return "#1b3d22";
}

function getWineType(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante")) return "Bollicine";
  if (t.includes("ros")) return "Rosé";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("bianco") || t.includes("blanc") || t.includes("white")) return "Bianco";
  return "Rosso";
}

function cleanName(name) {
  return (name || "").replace(/\s+\d{4}$/, "").trim();
}

function truncate(str, max) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

// Split long name into two lines at a word boundary near the middle
function splitName(name, max = 16) {
  const clean = cleanName(name);
  if (clean.length <= max) return [clean, ""];
  const mid = Math.floor(clean.length / 2);
  let split = clean.lastIndexOf(" ", mid);
  if (split < 4) split = clean.indexOf(" ", mid);
  if (split < 0) return [clean.slice(0, max) + "…", ""];
  return [clean.slice(0, split), truncate(clean.slice(split + 1), max)];
}

const BODY = "M12,192 L68,192 L70,190 L70,92 C70,75 52,68 50,65 L50,22 C50,12 46,8 40,8 C34,8 30,12 30,22 L30,65 C28,68 10,75 10,92 L10,190 L12,192 Z";

function BottleSvg({ wine, width, height, uid }) {
  const color = getGlassColor(wine);
  const gid = `bg${uid}`;
  const cid = `cg${uid}`;
  const [line1, line2] = splitName(wine.name, 16);
  const producer = truncate(wine.producer, 15);
  const vintage = wine.vintage ? String(wine.vintage) : "";
  const region = truncate(wine.region, 14);

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

      {/* Label — ivory, gold border, serif text */}
      <rect x="11" y="96" width="58" height="80" rx="2" fill="#f7f2e8" />
      {/* Outer gold border */}
      <rect x="11" y="96" width="58" height="80" rx="2" fill="none" stroke="#c9a22799" strokeWidth="0.9" />
      {/* Inner decorative lines */}
      <line x1="15" y1="102" x2="65" y2="102" stroke="#c9a22766" strokeWidth="0.7" />
      <line x1="15" y1="172" x2="65" y2="172" stroke="#c9a22766" strokeWidth="0.7" />

      {/* Wine name — line 1 */}
      <text x="40" y="117" textAnchor="middle" fontSize="6.2" fontFamily="Georgia,'Times New Roman',serif" fill="#1a1205" fontWeight="bold">{line1}</text>
      {/* Wine name — line 2 (if needed) */}
      {line2 && (
        <text x="40" y="127" textAnchor="middle" fontSize="6.2" fontFamily="Georgia,'Times New Roman',serif" fill="#1a1205" fontWeight="bold">{line2}</text>
      )}

      {/* Producer italic */}
      {producer && (
        <text x="40" y={line2 ? "140" : "134"} textAnchor="middle" fontSize="4.8" fontFamily="Georgia,'Times New Roman',serif" fill="#4a3a10" fontStyle="italic">{producer}</text>
      )}

      {/* Region */}
      {region && (
        <text x="40" y={line2 ? "150" : "144"} textAnchor="middle" fontSize="4.2" fontFamily="Georgia,'Times New Roman',serif" fill="#6a5020" letterSpacing="0.5">{region}</text>
      )}

      <line x1="24" y1={line2 ? "157" : "152"} x2="56" y2={line2 ? "157" : "152"} stroke="#c9a22766" strokeWidth="0.6" />

      {/* Vintage — prominent */}
      {vintage && (
        <text x="40" y={line2 ? "168" : "164"} textAnchor="middle" fontSize="7" fontFamily="Georgia,'Times New Roman',serif" fill="#8a6010" fontWeight="bold" letterSpacing="1.5">{vintage}</text>
      )}

      {/* Capsule */}
      <rect x="28" y="10" width="24" height="22" rx="3" fill="#c9a227" />
      <rect x="28" y="10" width="24" height="22" rx="3" fill={`url(#${cid})`} />

      {/* Edge highlight */}
      <path d="M10,190 L10,92 C10,75 28,68 30,65" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" />

      {/* Punt shadow at base */}
      <ellipse cx="40" cy="192" rx="13" ry="2.5" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}

export default function WineBottle3DModal({ wine, onClose }) {
  const bottleRef = useRef(null);
  const wrapperRef = useRef(null);
  const stateRef = useRef({ angle: 20, isDragging: false, lastX: 0, vel: 0 });
  const [useImage, setUseImage] = useState(!!wine.imageUrl);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const bottle = bottleRef.current;
    const wrapper = wrapperRef.current;
    if (!bottle || !wrapper) return;

    const s = stateRef.current;
    let animId;

    const tick = () => {
      if (!s.isDragging) {
        if (Math.abs(s.vel) > 0.08) {
          s.angle += s.vel * 0.55;
          s.vel *= 0.90;
        } else {
          s.vel = 0;
          s.angle += 0.35;
        }
      }
      bottle.style.transform = `rotateY(${s.angle}deg)`;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    const onMouseDown = (e) => {
      s.isDragging = true; s.lastX = e.clientX; s.vel = 0;
      wrapper.style.cursor = "grabbing";
    };
    const onMouseMove = (e) => {
      if (!s.isDragging) return;
      const dx = e.clientX - s.lastX;
      s.angle += dx * 0.65; s.vel = dx; s.lastX = e.clientX;
    };
    const onMouseUp = () => { s.isDragging = false; wrapper.style.cursor = "grab"; };
    const onTouchStart = (e) => { s.isDragging = true; s.lastX = e.touches[0].clientX; s.vel = 0; };
    const onTouchMove = (e) => {
      e.preventDefault();
      const dx = e.touches[0].clientX - s.lastX;
      s.angle += dx * 0.65; s.vel = dx; s.lastX = e.touches[0].clientX;
    };
    const onTouchEnd = () => { s.isDragging = false; };

    wrapper.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      wrapper.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const wineType = getWineType(wine);
  const aiScore = wine.analysis?.aiScore ?? wine.investmentScore ?? "—";
  const uid = `m${String(wine.id).replace(/\W/g, "")}`;

  return (
    <div className="bottle-overlay" onClick={onClose}>
      <div className="bottle-modal" onClick={e => e.stopPropagation()}>
        <button className="bottle-modal-close" onClick={onClose}>×</button>

        <div
          ref={wrapperRef}
          style={{
            width: "100%", height: "380px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(180deg, #060e1c 0%, #0a1628 100%)",
            perspective: "600px",
            cursor: "grab",
            borderRadius: "12px 12px 0 0",
            userSelect: "none",
            overflow: "hidden",
          }}
        >
          <div ref={bottleRef}>
            {useImage ? (
              <img
                src={wine.imageUrl}
                alt=""
                style={{
                  height: "340px", width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.8)) drop-shadow(0 0 16px rgba(201,162,39,0.18))",
                  display: "block",
                }}
                onError={() => setUseImage(false)}
              />
            ) : (
              <BottleSvg wine={wine} width={140} height={350} uid={uid} />
            )}
          </div>
        </div>

        <div className="bottle-modal-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 3, lineHeight: 1.3 }}>{wine.name}</h3>
              <p style={{ color: "#64748b", fontSize: 12 }}>{wine.producer} · {wine.vintage} · {wine.region}</p>
            </div>
            <span style={{ fontSize: 26, fontWeight: 800, color: "#c9a227", whiteSpace: "nowrap" }}>€ {wine.currentPrice}</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0c1a2e", color: "#60a5fa", border: "1px solid #1e3a5f" }}>{wineType}</span>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#1a1207", color: "#c9a227", border: "1px solid #5a400d" }}>AI Score {aiScore}</span>
            {wine.risk && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0d1f0d", color: "#4ade80", border: "1px solid #166534" }}>{wine.risk}</span>}
            {wine.marketTrend && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#131a0d", color: "#86efac", border: "1px solid #166534" }}>{wine.marketTrend}</span>}
          </div>

          <p style={{ fontSize: 10, color: "#334155", marginTop: 14, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Trascina per ruotare · ESC o clicca fuori per chiudere
          </p>
        </div>
      </div>
    </div>
  );
}
