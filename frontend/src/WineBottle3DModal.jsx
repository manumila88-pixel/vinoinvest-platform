import { useEffect, useRef, useState } from "react";
import Bottle3D from "./components/Bottle3D";
import PriceHistoryChart from "./components/PriceHistoryChart";

function getWineType(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante")) return "Bollicine";
  if (t.includes("ros")) return "Rosé";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("bianco") || t.includes("blanc") || t.includes("white")) return "Bianco";
  return "Rosso";
}

export default function WineBottle3DModal({ wine, onClose }) {
  const [useImage, setUseImage] = useState(!!wine.imageUrl);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // CSS drag rotation for image wines
  const bottleRef = useRef(null);
  const wrapperRef = useRef(null);
  const stateRef = useRef({ angle: 20, isDragging: false, lastX: 0, vel: 0 });

  useEffect(() => {
    if (!useImage) return;
    const bottle = bottleRef.current;
    const wrapper = wrapperRef.current;
    if (!bottle || !wrapper) return;

    const s = stateRef.current;
    let animId;

    const tick = () => {
      if (!s.isDragging) {
        if (Math.abs(s.vel) > 0.08) { s.angle += s.vel * 0.55; s.vel *= 0.90; }
        else { s.vel = 0; s.angle += 0.35; }
      }
      bottle.style.transform = `rotateY(${s.angle}deg)`;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    const onMD = (e) => { s.isDragging = true; s.lastX = e.clientX; s.vel = 0; wrapper.style.cursor = "grabbing"; };
    const onMM = (e) => { if (!s.isDragging) return; const dx = e.clientX - s.lastX; s.angle += dx * 0.65; s.vel = dx; s.lastX = e.clientX; };
    const onMU = () => { s.isDragging = false; wrapper.style.cursor = "grab"; };
    const onTS = (e) => { s.isDragging = true; s.lastX = e.touches[0].clientX; s.vel = 0; };
    const onTM = (e) => { e.preventDefault(); const dx = e.touches[0].clientX - s.lastX; s.angle += dx * 0.65; s.vel = dx; s.lastX = e.touches[0].clientX; };
    const onTE = () => { s.isDragging = false; };

    wrapper.addEventListener("mousedown", onMD);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    wrapper.addEventListener("touchstart", onTS, { passive: true });
    wrapper.addEventListener("touchmove", onTM, { passive: false });
    wrapper.addEventListener("touchend", onTE);

    return () => {
      cancelAnimationFrame(animId);
      wrapper.removeEventListener("mousedown", onMD);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      wrapper.removeEventListener("touchstart", onTS);
      wrapper.removeEventListener("touchmove", onTM);
      wrapper.removeEventListener("touchend", onTE);
    };
  }, [useImage]);

  const wineType = getWineType(wine);
  const aiScore = wine.analysis?.aiScore ?? wine.investmentScore ?? "—";

  return (
    <div className="bottle-overlay" onClick={onClose}>
      <div className="bottle-modal" style={{ overflowY: "auto", maxHeight: "92vh" }} onClick={e => e.stopPropagation()}>
        <button className="bottle-modal-close" onClick={onClose}>×</button>

        {useImage ? (
          /* ── Real bottle photo with CSS drag rotation ── */
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
            </div>
          </div>
        ) : (
          /* ── Three.js bottle with CylinderGeometry — interactive drag built-in ── */
          <div style={{
            borderRadius: "12px 12px 0 0",
            overflow: "hidden",
            background: "linear-gradient(180deg, #060e1c 0%, #0a1628 100%)",
          }}>
            <Bottle3D wine={wine} height={380} interactive={true} />
          </div>
        )}

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

          <div style={{ marginTop: 16, borderTop: "1px solid #1e293b", paddingTop: 14 }}>
            <p style={{ fontSize: 10, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Storico Prezzi · 12 mesi
            </p>
            <PriceHistoryChart wineId={wine.id} currentPrice={wine.currentPrice} height={180} />
          </div>

          <p style={{ fontSize: 10, color: "#334155", marginTop: 14, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {useImage ? "Trascina per ruotare" : "Trascina sulla bottiglia · "} ESC o clicca fuori per chiudere
          </p>
        </div>
      </div>
    </div>
  );
}
