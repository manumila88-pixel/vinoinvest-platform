import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Bottle3D from "./components/Bottle3D";
import PriceHistoryChart from "./components/PriceHistoryChart";
import SourceBadge from "./components/SourceBadge";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

function getWineType(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante")) return "Bollicine";
  if (t.includes("ros")) return "Rosé";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("bianco") || t.includes("blanc") || t.includes("white")) return "Bianco";
  return "Rosso";
}

export default function WineBottle3DModal({ wine, onClose }) {
  const placeholderImg = (() => {
    const t = `${wine.type || ""} ${wine.variety || ""} ${wine.region || ""} ${wine.name || ""}`.toLowerCase();
    if (/champagne|prosecco|cava|sparkling/.test(t)) return "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400&q=80&fm=webp&fit=crop";
    if (/ros[eé]|rosato/.test(t)) return "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80&fm=webp&fit=crop";
    if (/bianco|chardonnay|sauvignon|blanc|white/.test(t)) return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fm=webp&fit=crop";
    return "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80&fm=webp&fit=crop";
  })();
  const [imgSrc, setImgSrc] = useState(wine.imageUrl || placeholderImg);
  const [useImage, setUseImage] = useState(true);

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
  const aiScore = wine.aiScoreData?.score ?? wine.analysis?.aiScore ?? wine.investmentScore ?? "—";
  const aiSignal = wine.aiScoreData?.signal;

  const schemaLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": wine.name,
    "description": `${wine.name} ${wine.vintage || ""} — ${wine.producer || ""}. Vino da investimento con AI Score ${wine.investment_score || wine.aiScore || ""}/100.`,
    "brand": { "@type": "Brand", "name": wine.producer || "VinoInvest" },
    "offers": {
      "@type": "Offer",
      "price": wine.current_price || wine.price || "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
    },
    ...(wine.investment_score || wine.aiScore ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": wine.investment_score || wine.aiScore,
        "bestRating": "100",
        "ratingCount": "1",
      }
    } : {}),
  };

  return (
    <div className="bottle-overlay" onClick={onClose}>
      <Helmet>
        <title>{wine.name} {wine.vintage || ""} - Analisi e Prezzo | VinoInvest</title>
        <meta name="description" content={`Analisi investimento, storico prezzi e AI Score per ${wine.name} ${wine.vintage || ""}. Produttore: ${wine.producer || ""}. Prezzo attuale: €${wine.current_price || wine.price || "N/A"}.`} />
        <script type="application/ld+json">{JSON.stringify(schemaLD)}</script>
      </Helmet>
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
                src={imgSrc}
                alt=""
                style={{
                  height: "340px", width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.8)) drop-shadow(0 0 16px rgba(201,162,39,0.18))",
                  display: "block",
                }}
                onError={() => {
                  if (imgSrc !== placeholderImg) setImgSrc(placeholderImg);
                  else setUseImage(false);
                }}
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
            <Bottle3D key={wine.id} wine={wine} height={380} interactive={true} />
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
            {aiSignal && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0d1f0d", color: aiSignal === "Strong Buy" ? "#4ade80" : "#86efac", border: "1px solid #166534" }}>{aiSignal}</span>}
            {wine.risk && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0d1f0d", color: "#4ade80", border: "1px solid #166534" }}>{wine.risk}</span>}
            {wine.marketTrend && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#131a0d", color: "#86efac", border: "1px solid #166534" }}>{wine.marketTrend}</span>}
          </div>

          {wine.aiScoreData?.breakdown && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: "#0a1628", borderRadius: 10, border: "1px solid #1e293b" }}>
              <p style={{ fontSize: 10, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Score Breakdown</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { key: "vintage", label: "Vintage" },
                  { key: "producer", label: "Producer" },
                  { key: "market", label: "Market" },
                  { key: "critic", label: "Critic" },
                  { key: "risk_adjusted", label: "Risk Adj." },
                ].map(({ key, label }) => {
                  const val = wine.aiScoreData.breakdown[key] ?? 0;
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, color: "#64748b", width: 64, flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, background: "#1e293b", borderRadius: 4, height: 5 }}>
                        <div style={{ width: val + "%", height: "100%", background: "#c9a227", borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 10, color: "#c9a227", width: 24, textAlign: "right" }}>{val}</span>
                    </div>
                  );
                })}
              </div>
              {wine.aiScoreData.reasoning && (
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 10, lineHeight: 1.6, fontStyle: "italic" }}>
                  {wine.aiScoreData.reasoning}
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: 16, borderTop: "1px solid #1e293b", paddingTop: 14 }}>
            <p style={{ fontSize: 10, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Storico Prezzi · 12 mesi
            </p>
            <div style={{ width: "100%", minWidth: 200 }}><PriceHistoryChart wineId={wine.id} currentPrice={wine.currentPrice} height={180} /></div>
          </div>

          {/* ── Affiliate buy links ─────────────────────────────────────── */}
          <div style={{ marginTop: 16, borderTop: "1px solid #1e293b", paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}${wine.vintage ? `/${wine.vintage}` : ""}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, color: "#C9A227", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,162,39,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(201,162,39,0.1)"}
            >
              🔍 Trova su Wine-Searcher
            </a>
            <a
              href={`https://www.vivino.com/search/wines?q=${encodeURIComponent(wine.name)}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 10, color: "#60a5fa", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(96,165,250,0.08)"}
            >
              🍇 Cerca su Vivino
            </a>
          </div>

          {/* ── Food Pairings ───────────────────────────────────────────── */}
          <FoodPairings wineId={wine.id} />

          {/* ── Source attribution ──────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: "#334155" }}>Data:</span>
            <SourceBadge source="Wine-Searcher" url={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}`} confidence={99} compact />
            <SourceBadge source="CellarTracker" url="https://www.cellartracker.com" confidence={90} compact />
            <SourceBadge source="Decanter" url="https://www.decanter.com" confidence={99} compact />
          </div>

          <p style={{ fontSize: 10, color: "#334155", marginTop: 10, textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {useImage ? "Trascina per ruotare" : "Trascina sulla bottiglia · "} ESC o clicca fuori per chiudere
          </p>
        </div>
      </div>
    </div>
  );
}
