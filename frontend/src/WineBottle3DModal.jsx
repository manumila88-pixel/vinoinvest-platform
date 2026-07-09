import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Bottle3D from "./components/Bottle3D";
import PriceHistoryChart from "./components/PriceHistoryChart";
import SourceBadge from "./components/SourceBadge";
import { getWineAwards } from "./data/awards";
import { SITE_URL } from "./lib/constants";

function SimilarWines({ wine, onWineClick }) {
  const [similar, setSimilar] = useState([]);
  useEffect(() => {
    if (!wine?.id) return;
    const region = encodeURIComponent((wine.region || wine.country || "").split(",")[0].trim());
    const score = wine.investmentScore || wine.investment_score || 70;
    fetch(`${API}/api/wines?limit=6&scoreMin=${Math.max(0, score - 12)}&scoreMax=${Math.min(100, score + 12)}${region ? `&region=${region}` : ""}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.results) setSimilar(d.results.filter(w => w.id !== wine.id).slice(0, 4));
      }).catch(() => {});
  }, [wine?.id]);

  if (similar.length === 0) return null;
  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
        Vini simili che potrebbero interessarti
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {similar.map(w => (
          <button
            key={w.id}
            onClick={() => onWineClick && onWineClick(w)}
            style={{
              padding: "8px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left",
              background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.6)",
              transition: "all 0.15s", minWidth: 150, maxWidth: 200,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {w.name}
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>
              {w.producer} · {w.vintage || "N/A"}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#C9A227", fontWeight: 700 }}>
                Score {w.investmentScore || w.investment_score || "–"}
              </span>
              {w.currentPrice && (
                <span style={{ fontSize: 11, color: "#94a3b8" }}>€{Number(w.currentPrice).toFixed(0)}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// Region inference: map wine fields to a vintage score region key
function inferRegionKey(wine) {
  const hay = [wine.region, wine.producer, wine.country, wine.name]
    .filter(Boolean).join(" ").toLowerCase();
  if (hay.includes("bordeaux") || hay.includes("pomerol") || hay.includes("saint-emilion") || hay.includes("medoc") || hay.includes("pessac")) return "bordeaux";
  if (hay.includes("bourgogne") || hay.includes("burgundy") || hay.includes("chablis") || hay.includes("nuit") || hay.includes("beaune") || hay.includes("gevrey") || hay.includes("volnay") || hay.includes("meursault")) return "burgundy";
  if (hay.includes("champagne") || hay.includes("reims") || hay.includes("epernay")) return "champagne";
  if (hay.includes("barolo") || hay.includes("barbaresco") || hay.includes("piemonte") || hay.includes("langhe")) return "barolo";
  if (hay.includes("chianti") || hay.includes("brunello") || hay.includes("montalcino") || hay.includes("montepulciano")) return "chianti";
  if (hay.includes("toscana") || hay.includes("tuscany") || hay.includes("sassicaia") || hay.includes("tignanello") || hay.includes("supertuscan") || hay.includes("bolgheri")) return "tuscany";
  if (hay.includes("rioja") || hay.includes("ribera")) return "rioja";
  if (hay.includes("priorat") || hay.includes("priorato")) return "priorat";
  if (hay.includes("douro") || hay.includes("portugal") || hay.includes("porto")) return "douro";
  if (hay.includes("napa") || hay.includes("california") || hay.includes("sonoma")) return "napa";
  if (hay.includes("mendoza") || hay.includes("argentina") || hay.includes("malbec")) return "mendoza";
  if (hay.includes("mosel") || hay.includes("moselle") || hay.includes("riesling") || hay.includes("germany") || hay.includes("deutschland")) return "mosel";
  // Italy fallback
  if (hay.includes("italia") || hay.includes("italy") || hay.includes("italian")) return "tuscany";
  // France fallback
  if (hay.includes("france") || hay.includes("french") || hay.includes("francese")) return "bordeaux";
  // Spain fallback
  if (hay.includes("spain") || hay.includes("spanish") || hay.includes("spagna")) return "rioja";
  return null;
}

function getWineType(wine) {
  const t = [wine.variety, wine.name, wine.region].filter(Boolean).join(" ").toLowerCase();
  if (t.includes("champagne") || t.includes("prosecco") || t.includes("cava") || t.includes("spumante")) return "Bollicine";
  if (t.includes("ros")) return "Rosé";
  if (t.includes("chardonnay") || t.includes("sauvignon") || t.includes("riesling") || t.includes("pinot grigio") || t.includes("bianco") || t.includes("blanc") || t.includes("white")) return "Bianco";
  return "Rosso";
}

const BADGE_STYLE = {
  background: "linear-gradient(135deg, var(--vi-accent), var(--vi-accent-2))",
  color: "#1a0a00",
  borderRadius: "var(--vi-radius-sm)",
  padding: "2px 8px",
  fontSize: 11,
  fontWeight: 700,
  whiteSpace: "nowrap",
  cursor: "default",
};

function AwardsBadges({ awards }) {
  const [expanded, setExpanded] = useState(false);
  if (!awards || awards.length === 0) return null;

  const VISIBLE = 3;
  const visible = expanded ? awards : awards.slice(0, VISIBLE);
  const hasMore = awards.length > VISIBLE;

  return (
    <div style={{ marginTop: 10 }}>
      <p style={{ fontSize: 10, color: "var(--vi-accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>
        Premi &amp; Riconoscimenti
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
        {visible.map((aw, i) => (
          <span key={i} style={BADGE_STYLE} title={`${aw.award} ${aw.year}`}>
            {aw.emoji} {aw.award} {aw.year}
          </span>
        ))}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            style={{ background: "none", border: "none", color: "var(--vi-accent)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "2px 4px", textDecoration: "underline" }}
          >
            Vedi tutti ({awards.length})
          </button>
        )}
        {expanded && hasMore && (
          <button
            onClick={() => setExpanded(false)}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", padding: "2px 4px", textDecoration: "underline" }}
          >
            Comprimi
          </button>
        )}
      </div>
    </div>
  );
}

function RedditSentimentBadge({ wineName }) {
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    if (!wineName) return;
    fetch(`${API}/api/wine-info/${encodeURIComponent(wineName)}/reddit-sentiment`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && typeof data.score === "number") setSentiment(data);
      })
      .catch(() => {});
  }, [wineName]);

  if (!sentiment) return null;

  const { score, url } = sentiment;
  let bg, border, color;
  if (score >= 60) {
    bg = "rgba(74,222,128,0.08)"; border = "rgba(74,222,128,0.3)"; color = "#4ade80";
  } else if (score >= 40) {
    bg = "rgba(250,204,21,0.08)"; border = "rgba(250,204,21,0.3)"; color = "#facc15";
  } else {
    bg = "rgba(248,113,113,0.08)"; border = "rgba(248,113,113,0.3)"; color = "#f87171";
  }

  return (
    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{
        padding: "3px 10px", borderRadius: 999, fontSize: 11,
        background: bg, color, border: `1px solid ${border}`, fontWeight: 700,
      }}>
        👥 Community: {score}% positivo
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 10, color: "#ff4500", textDecoration: "none", opacity: 0.85 }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.textDecoration = "underline"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.textDecoration = "none"; }}
      >
        r/wine
      </a>
    </div>
  );
}

function ProducerInfoCard({ producerName }) {
  const { t } = useTranslation();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!producerName) return;
    fetch(`${API}/api/wine-info/producer/${encodeURIComponent(producerName)}/wikidata`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && (data.foundingYear || data.description || data.country)) {
          setInfo(data);
        }
      })
      .catch(() => {});
  }, [producerName]);

  if (!info) return null;

  const desc = info.description ? (info.description.length > 100 ? info.description.slice(0, 97) + "…" : info.description) : null;

  return (
    <div style={{
      marginTop: 12,
      padding: "10px 14px",
      background: "var(--vi-bg)",
      borderRadius: "var(--vi-radius-sm)",
      border: "1px solid var(--vi-border)",
    }}>
      <p style={{ fontSize: 10, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        {t('modal.producer')}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {info.country && (
          <span style={{ fontSize: 11, color: "#60a5fa", background: "rgba(96,165,250,0.08)", padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(96,165,250,0.2)" }}>
            {info.country}
          </span>
        )}
        {info.foundingYear && (
          <span style={{ fontSize: 11, color: "var(--vi-accent)", background: "rgba(201,162,39,0.08)", padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(201,162,39,0.2)" }}>
            Est. {info.foundingYear}
          </span>
        )}
      </div>
      {desc && (
        <p style={{ fontSize: 11, color: "var(--vi-text-dim)", marginTop: 6, lineHeight: 1.5, fontStyle: "italic" }}>
          {desc}
        </p>
      )}
    </div>
  );
}

function VintageQualityBadge({ wine }) {
  const { t } = useTranslation();
  const [vintageData, setVintageData] = useState(null);

  useEffect(() => {
    const year = wine.vintage ? parseInt(wine.vintage) : null;
    if (!year || year < 2000) return;
    const regionKey = inferRegionKey(wine);
    if (!regionKey) return;

    fetch(`${API}/api/vintage/scores/${encodeURIComponent(regionKey)}/${year}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && typeof data.score === "number") setVintageData(data); })
      .catch(() => {});
  }, [wine]);

  if (!vintageData) return null;

  const { score, year, region } = vintageData;
  let bg, border, color;
  if (score > 85) {
    bg = "rgba(74,222,128,0.08)"; border = "rgba(74,222,128,0.3)"; color = "#4ade80";
  } else if (score > 70) {
    bg = "rgba(250,204,21,0.08)"; border = "rgba(250,204,21,0.3)"; color = "#facc15";
  } else {
    bg = "rgba(248,113,113,0.08)"; border = "rgba(248,113,113,0.3)"; color = "#f87171";
  }

  return (
    <div style={{
      marginTop: 10,
      padding: "10px 14px",
      background: bg,
      borderRadius: 10,
      border: `1px solid ${border}`,
    }}>
      <p style={{ fontSize: 10, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        {t('modal.vintageQuality')}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>
          {t('modal.vintageScore', { year, score })}
        </span>
        <span style={{ fontSize: 11, color, background: "rgba(0,0,0,0.2)", padding: "1px 7px", borderRadius: 999, border: `1px solid ${border}` }}>
          {vintageData.label}
        </span>
      </div>
      <p style={{ fontSize: 10, color: "#475569", marginTop: 4, fontStyle: "italic" }}>
        Dati climatici Open-Meteo · {region}
      </p>
    </div>
  );
}

function CellarTrackerNotes({ wineName }) {
  const [notes, setNotes] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotes = () => {
    if (notes !== null || loading) { setOpen(o => !o); return; }
    setLoading(true);
    fetch(`${API}/api/cellar/notes/${encodeURIComponent(wineName)}`)
      .then(r => r.ok ? r.json() : { notes: [] })
      .then(data => {
        setNotes(data.notes || []);
        setLoading(false);
        setOpen(true);
      })
      .catch(() => { setNotes([]); setLoading(false); setOpen(true); });
  };

  if (!wineName) return null;

  return (
    <div style={{ marginTop: 12, borderTop: "1px solid var(--vi-border)", paddingTop: 12 }}>
      <button
        onClick={loadNotes}
        style={{
          background: "none",
          border: "none",
          color: "var(--vi-accent)",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          padding: "4px 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {loading ? "Loading..." : `Community Notes ${open ? "↑" : "↓"}`}
      </button>

      {open && notes !== null && (
        <div style={{ marginTop: 10 }}>
          {notes.length === 0 ? (
            <p style={{ fontSize: 11, color: "#475569", fontStyle: "italic" }}>
              No notes available on CellarTracker.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notes.map((note, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    background: "var(--vi-bg)",
                    borderRadius: "var(--vi-radius-sm)",
                    border: "1px solid var(--vi-border)",
                    borderLeft: "3px solid var(--vi-accent)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                    {note.score > 0 && (
                      <span style={{
                        background: "linear-gradient(135deg, var(--vi-accent), var(--vi-accent-2))",
                        color: "#1a0a00",
                        borderRadius: "var(--vi-radius-sm)",
                        padding: "1px 8px",
                        fontSize: 11,
                        fontWeight: 800,
                      }}>
                        {note.score} pt
                      </span>
                    )}
                    {note.reviewer && (
                      <span style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>
                        {note.reviewer}
                      </span>
                    )}
                    {note.noteDate && (
                      <span style={{ fontSize: 10, color: "#475569" }}>
                        {note.noteDate}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--vi-text-dim)", lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
                    "{note.noteText.length > 120 ? note.noteText.slice(0, 117) + "…" : note.noteText}"
                  </p>
                </div>
              ))}
              <p style={{ fontSize: 9, color: "#334155", marginTop: 2, textAlign: "right" }}>
                Fonte: CellarTracker Community
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FoodPairings({ wineId }) {
  const [pairings, setPairings] = useState(null);

  useEffect(() => {
    if (!wineId) return;
    fetch(`${API}/api/pairing/${encodeURIComponent(wineId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.pairings?.length) setPairings(data.pairings); })
      .catch(() => {});
  }, [wineId]);

  if (!pairings) return null;

  return (
    <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--vi-bg)", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)" }}>
      <p style={{ fontSize: 10, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
        Abbinamenti
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {pairings.slice(0, 6).map((p, i) => (
          <span key={i} style={{ fontSize: 11, color: "var(--vi-accent)", background: "rgba(201,162,39,0.08)", padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(201,162,39,0.2)" }}>
            {typeof p === "object" ? p.food : p}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WineBottle3DModal({ wine, onClose }) {
  const { t } = useTranslation();
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

  const price = wine.currentPrice || wine.current_price || wine.price || 0;
  const score = wine.investment_score || wine.aiScore || (aiScore !== "—" ? aiScore : null);
  const wineImage = wine.imageUrl || placeholderImg;
  const wineTitle = `${wine.name} ${wine.vintage || ""}`.trim();
  const seoTitle = `${wineTitle} - Prezzo €${price} | VinoInvest`;
  const seoDesc = `${wine.name}: AI Score ${score ? `${score}/100` : "available"}. Price history, where to buy. Producer: ${wine.producer || ""}. Complete investment analysis.`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": wine.name,
    "image": wineImage,
    "description": `${wineTitle} — ${wine.producer || ""}. Vino da investimento con AI Score ${score || "N/A"}/100.`,
    "brand": { "@type": "Brand", "name": wine.producer || "VinoInvest" },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "VinoInvest" },
    },
    ...(score ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": score,
        "bestRating": "100",
        "ratingCount": "1",
      }
    } : {}),
  };

  const breadcrumbItems = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
  ];
  if (wine.region) breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": wine.region, "item": `${SITE_URL}/?region=${encodeURIComponent(wine.region)}` });
  if (wine.producer) breadcrumbItems.push({ "@type": "ListItem", "position": breadcrumbItems.length + 1, "name": wine.producer, "item": `${SITE_URL}/?producer=${encodeURIComponent(wine.producer)}` });
  breadcrumbItems.push({ "@type": "ListItem", "position": breadcrumbItems.length + 1, "name": wineTitle });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Quanto vale ${wine.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${wineTitle} ha un prezzo attuale di €${price}. Il prezzo può variare in base alle condizioni del mercato del vino pregiato e alle annate disponibili.`,
        },
      },
      {
        "@type": "Question",
        "name": `${wine.name} è un buon investimento?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Secondo l'analisi AI di VinoInvest, ${wine.name} ha un AI Score di ${score ? `${score}/100` : "N/A"}${aiSignal ? ` con segnale ${aiSignal}` : ""}. ${score >= 70 ? "Indica un ottimo potenziale di investimento." : score >= 50 ? "Indica un discreto potenziale di investimento." : "Valuta attentamente prima di investire."}`,
        },
      },
      {
        "@type": "Question",
        "name": `Dove comprare ${wine.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Puoi acquistare ${wineTitle} attraverso VinoInvest, la piattaforma italiana per investire in vino pregiato. VinoInvest offre prezzi storici, analisi AI e accesso ai migliori produttori certificati.`,
        },
      },
    ],
  };

  // ── Awards ────────────────────────────────────────────────────────────
  const wineAwards = getWineAwards(wine.name, wine.producer);

  return (
    <div className="bottle-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={wineImage} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="VinoInvest" />
        <link rel="alternate" hreflang="it" href={`${SITE_URL}/?wine=${encodeURIComponent(wine.name)}&lang=it`} />
        <link rel="alternate" hreflang="en" href={`${SITE_URL}/?wine=${encodeURIComponent(wine.name)}&lang=en`} />
        <link rel="alternate" hreflang="fr" href={`${SITE_URL}/?wine=${encodeURIComponent(wine.name)}&lang=fr`} />
        <link rel="alternate" hreflang="de" href={`${SITE_URL}/?wine=${encodeURIComponent(wine.name)}&lang=de`} />
        <link rel="alternate" hreflang="es" href={`${SITE_URL}/?wine=${encodeURIComponent(wine.name)}&lang=es`} />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="bottle-modal" style={{ overflowY: "auto", maxHeight: "92vh" }} onClick={e => e.stopPropagation()}>
        <button className="bottle-modal-close" onClick={onClose} aria-label="Close">×</button>

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
                alt={wine.name}
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
            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--vi-accent)", whiteSpace: "nowrap" }}>€ {price || "—"}</span>
          </div>

          {/* ── Wikidata Producer Info ───────────────────────────────── */}
          {wine.producer && <ProducerInfoCard producerName={wine.producer} />}

          {/* ── Vintage Climate Quality ──────────────────────────────── */}
          <VintageQualityBadge wine={wine} />

          {/* ── Awards & Recognitions ─────────────────────────────────── */}
          <AwardsBadges awards={wineAwards} />

          {/* ── Reddit Community Sentiment ────────────────────────────── */}
          <RedditSentimentBadge wineName={wine.name} />

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0c1a2e", color: "#60a5fa", border: "1px solid #1e3a5f" }}>{wineType}</span>
            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#1a1207", color: "var(--vi-accent)", border: "1px solid #5a400d" }}>AI Score {aiScore}</span>
            {aiSignal && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0d1f0d", color: aiSignal === "Strong Buy" ? "var(--vi-positive)" : "#86efac", border: "1px solid #166534" }}>{aiSignal}</span>}
            {wine.risk && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#0d1f0d", color: "var(--vi-positive)", border: "1px solid #166534" }}>{wine.risk}</span>}
            {wine.marketTrend && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, background: "#131a0d", color: "#86efac", border: "1px solid #166534" }}>{wine.marketTrend}</span>}
          </div>

          {wine.aiScoreData?.breakdown && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--vi-bg)", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)" }}>
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
                      <div style={{ flex: 1, background: "var(--vi-border)", borderRadius: 4, height: 5 }}>
                        <div style={{ width: val + "%", height: "100%", background: "var(--vi-accent)", borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 10, color: "var(--vi-accent)", width: 24, textAlign: "right" }}>{val}</span>
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

          <div style={{ marginTop: 16, borderTop: "1px solid var(--vi-border)", paddingTop: 14 }}>
            <p style={{ fontSize: 10, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Storico Prezzi · 12 mesi
            </p>
            <div style={{ width: "100%", minWidth: 200 }}><PriceHistoryChart wineId={wine.id} currentPrice={wine.currentPrice} height={180} /></div>
          </div>

          {/* ── Affiliate buy links ─────────────────────────────────────── */}
          <div style={{ marginTop: 16, borderTop: "1px solid var(--vi-border)", paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}${wine.vintage ? `/${wine.vintage}` : ""}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: "var(--vi-radius-sm)", color: "var(--vi-accent)", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: `background var(--vi-dur) var(--vi-ease)` }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,162,39,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(201,162,39,0.1)"}
            >
              🔍 Trova su Wine-Searcher
            </a>
            <a
              href={`https://www.vivino.com/search/wines?q=${encodeURIComponent(wine.name)}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "var(--vi-radius-sm)", color: "#60a5fa", fontSize: 12, fontWeight: 700, textDecoration: "none", transition: `background var(--vi-dur) var(--vi-ease)` }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(96,165,250,0.08)"}
            >
              {t('modal.searchVivino')}
            </a>
          </div>

          {/* ── Similar wines recommendations ───────────────────────────── */}
          <SimilarWines wine={wine} onWineClick={w => { onClose(); setTimeout(() => onClose(w), 50); }} />

          {/* ── Food Pairings ───────────────────────────────────────────── */}
          <FoodPairings wineId={wine.id} />

          {/* ── CellarTracker Community Notes ───────────────────────────── */}
          <CellarTrackerNotes wineName={wine.name} />

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
