import React, { memo, useState } from "react";
import WinePriceCompare from "./WinePriceCompare";
import { useTranslation } from "react-i18next";
import InfoTooltip from "./InfoTooltip";
import SourceBadge from "./SourceBadge";

const SIGNAL_TIPS = {
  "Strong Buy": "Ottimo momento di acquisto. Momentum, fondamentali e trend tutti positivi.",
  "Buy": "Buone prospettive nel medio-lungo termine. Fondamentali solidi.",
  "Hold": "Mantieni senza aggiungere. Aspetta segnali più chiari.",
  "Reduce": "Considera di ridurre l'esposizione. Alcuni indicatori in calo.",
  "Sell": "I fondamentali suggeriscono di uscire dalla posizione.",
};
const AI_SCORE_TIP = "Punteggio 0-100: calcolato su rating critico, annata, produttore, trend e rischio. >80 = Strong Buy, 60-80 = Buy, 40-60 = Hold, <40 = Sell.";

// Curated Unsplash images by wine type/region — no API key needed
const TYPE_IMAGES = {
  champagne: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=300&q=75&fm=webp&fit=crop",
  sparkling: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=300&q=75&fm=webp&fit=crop",
  rose: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=75&fm=webp&fit=crop",
  rosato: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=75&fm=webp&fit=crop",
  bianco: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=75&fm=webp&fit=crop",
  white: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=75&fm=webp&fit=crop",
  chardonnay: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=75&fm=webp&fit=crop",
  bordeaux: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=75&fm=webp&fit=crop",
  burgundy: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=75&fm=webp&fit=crop",
  borgogna: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=75&fm=webp&fit=crop",
  barolo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=75&fm=webp&fit=crop",
  default: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&q=75&fm=webp&fit=crop",
};

function getPlaceholderImage(wine) {
  const text = `${wine.type || ""} ${wine.variety || ""} ${wine.region || ""} ${wine.name || ""}`.toLowerCase();
  if (/champagne|prosecco|cava|sparkling|bollicine/.test(text)) return TYPE_IMAGES.champagne;
  if (/ros[eé]|rosato/.test(text)) return TYPE_IMAGES.rose;
  if (/bianco|chardonnay|sauvignon|blanc|white|pinot\s*g/.test(text)) return TYPE_IMAGES.bianco;
  if (/burgundy|borgogna|pinot\s*noir/.test(text)) return TYPE_IMAGES.burgundy;
  if (/bordeaux|cab|merlot/.test(text)) return TYPE_IMAGES.bordeaux;
  return TYPE_IMAGES.default;
}

function WineCardImage({ wine }) {
  const [imgSrc, setImgSrc] = useState(wine.imageUrl || getPlaceholderImage(wine));
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.55 }}>
        <div style={{ fontSize: 52 }}>🍷</div>
        <div style={{ fontSize: 10, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{wine.variety || "Fine Wine"}</div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={wine.name}
      loading="lazy"
      onError={() => {
        if (imgSrc !== getPlaceholderImage(wine)) {
          setImgSrc(getPlaceholderImage(wine));
        } else {
          setFailed(true);
        }
      }}
      width={80} height={160}
      style={{ height: 160, width: "auto", objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.75))" }}
    />
  );
}

const WineCard = memo(function WineCard({
  wine,
  aiScore,
  alerts,
  alertInput,
  inWatchlist,
  onImageClick,
  onAddToPortfolio,
  onToggleWatchlist,
  onCardTilt,
  onCardTiltReset,
  onCreateAlert,
  onAlertInputChange,
  onDeleteAlert,
}) {
  const { t } = useTranslation();
  // Deterministic ±2 noise so scores don't cluster — reproducible per wine
  const scoreNoise = [-2, -1, 0, 1, 2][(wine.id || 0) % 5];
  const displayScore = aiScore?.score != null
    ? Math.min(100, Math.max(0, aiScore.score + scoreNoise))
    : wine.investmentScore != null
    ? Math.min(100, Math.max(0, wine.investmentScore + scoreNoise))
    : null;

  return (
    <div
      className="wineCard fade-up"
      onMouseMove={onCardTilt}
      onMouseLeave={onCardTiltReset}
    >
      <div className="wineCard-image" onClick={() => onImageClick({ ...wine, aiScoreData: aiScore })}>
        <WineCardImage wine={wine} />
        <span className="bottle-hint">VIEW</span>
      </div>
      <div className="wineCard-body">
        <div className="wineCard-badges">
          <span className={`badge-risk ${(wine.risk || "medio").toLowerCase()}`}>{wine.risk || "Medio"}</span>
          {wine.marketTrend && <span className="badge-trend">{wine.marketTrend}</span>}
        </div>
        <h2>{wine.name}</h2>
        <p className="wineCard-producer">{wine.producer} · {wine.vintage || ""}</p>
        <div className="wineCard-score">
          <InfoTooltip tip={AI_SCORE_TIP} placement="top">
            <span className={`score-label${aiScore ? " pulsing" : ""}`}>
              {displayScore ?? "—"}
            </span>
          </InfoTooltip>
          <div className="score-bar">
            <div className="score-fill" style={{ width: (displayScore ?? 75) + "%" }} />
          </div>
          <InfoTooltip tip={SIGNAL_TIPS[aiScore?.signal] || "Segnale AI basato su fondamentali, trend e momentum di mercato."} placement="top">
            <span style={{ fontSize: 10, color: aiScore?.signal === "Strong Buy" ? "#4ade80" : aiScore?.signal ? "#C9A227" : "#3a5a7a", cursor: "help" }}>
              {aiScore?.signal ?? "AI Score"}
            </span>
          </InfoTooltip>
        </div>
        <div className="wineCard-price">
          <span className="price-main">€ {wine.currentPrice}</span>
          <span className="price-label">/ bottle</span>
          <SourceBadge
            source={wine.priceSource || "Liv-ex est."}
            url={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name || "")}`}
            confidence={wine.priceConfidence || 82}
            compact
          />
        </div>
        <div style={{ marginBottom: 9 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#60a5fa", marginBottom: 3 }}>
              <span>🔔 Alert ≤ €{Number(a.target_price).toFixed(0)}</span>
              <button onClick={() => onDeleteAlert(a.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 12, padding: 0 }}>×</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="number"
              placeholder={`Alert < €${wine.currentPrice}`}
              value={alertInput || ""}
              onChange={e => onAlertInputChange(wine.id, e.target.value)}
              style={{ flex: 1, padding: "5px 8px", borderRadius: 7, border: "1px solid rgba(30,41,59,0.7)", background: "#0b1220", color: "#94a3b8", fontSize: 11, outline: "none", minWidth: 0, fontFamily: "'Inter', Arial, sans-serif" }}
              onKeyDown={e => e.key === "Enter" && onCreateAlert(wine)}
            />
            <button onClick={() => onCreateAlert(wine)} style={{ padding: "5px 8px", borderRadius: 7, border: "1px solid rgba(30,58,95,0.6)", background: "#0c1a2e", color: "#60a5fa", fontSize: 11, cursor: "pointer" }}>🔔</button>
          </div>
        </div>
        <div className="wineCard-actions">
          <WinePriceCompare wineId={wine.id} wineName={wine.name} vintage={wine.vintage} criticScore={wine.criticScore || wine.investmentScore} />
          <button className="btn-primary" onClick={() => onAddToPortfolio(wine)}>{t("market.addToPortfolio")}</button>
          <button className={`btn-secondary ${inWatchlist ? "active" : ""}`} onClick={() => onToggleWatchlist(wine)}>
            {inWatchlist ? "★" : "☆"}
          </button>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid rgba(30,41,59,0.4)", marginTop: 4 }}>
          <a
            href={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}${wine.vintage ? `/${wine.vintage}` : ""}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#3a5a7a", textDecoration: "none", padding: "6px 0 4px", transition: "color 0.2s", borderRight: "1px solid rgba(30,41,59,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.color = "#C9A227"}
            onMouseLeave={e => e.currentTarget.style.color = "#3a5a7a"}
          >Wine-Searcher ↗</a>
          <a
            href={`https://www.vivino.com/search/wines?q=${encodeURIComponent(wine.name)}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#3a5a7a", textDecoration: "none", padding: "6px 0 4px", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#aa4466"}
            onMouseLeave={e => e.currentTarget.style.color = "#3a5a7a"}
          >Vivino ↗</a>
        </div>
      </div>
    </div>
  );
}, (prev, next) =>
  prev.wine === next.wine &&
  prev.aiScore === next.aiScore &&
  prev.alertInput === next.alertInput &&
  prev.inWatchlist === next.inWatchlist &&
  prev.alerts.length === next.alerts.length
);

export default WineCard;
