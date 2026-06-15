import React, { memo, useState } from "react";
import WinePriceCompare from "./WinePriceCompare";
import WineNotesButton from "./WineNotesButton";
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

function WineBottlePlaceholder({ wine }) {
  const raw = wine.name || "";
  const label = raw.length > 20 ? raw.slice(0, 18) + "…" : raw;
  const vintage = wine.vintage || "";
  const text = raw.toLowerCase();
  // bottle color by type
  const bottleColor = /champagne|prosecco|cava|sparkling/.test(text)
    ? "#c8b560"
    : /ros[eé]|rosato/.test(text)
    ? "#7a2a3a"
    : /bianco|chardonnay|sauvignon|blanc|white/.test(text)
    ? "#2a4a2a"
    : "#1a2f4a";

  return (
    <svg width="80" height="160" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={raw}>
      {/* bottle body */}
      <rect x="26" y="62" width="28" height="78" rx="8" fill={bottleColor} stroke="#C9A227" strokeWidth="0.8"/>
      {/* shoulder curve */}
      <path d="M26 70 Q26 62 33 58 L47 58 Q54 62 54 70" fill={bottleColor} stroke="#C9A227" strokeWidth="0.8"/>
      {/* neck */}
      <rect x="33" y="30" width="14" height="30" rx="3" fill={bottleColor} stroke="#C9A227" strokeWidth="0.8"/>
      {/* capsule */}
      <rect x="31" y="24" width="18" height="10" rx="3" fill="#C9A227" opacity="0.85"/>
      {/* label */}
      <rect x="29" y="84" width="22" height="42" rx="2" fill="#0B1220" stroke="#C9A227" strokeWidth="0.5" opacity="0.9"/>
      <line x1="31" y1="90" x2="49" y2="90" stroke="#C9A227" strokeWidth="0.4" opacity="0.5"/>
      <line x1="31" y1="122" x2="49" y2="122" stroke="#C9A227" strokeWidth="0.4" opacity="0.5"/>
      <text x="40" y="103" textAnchor="middle" fill="#C9A227" fontSize="4.8" fontWeight="700" fontFamily="Georgia, serif"
        style={{ letterSpacing: "0.02em" }}>{label}</text>
      {vintage && (
        <text x="40" y="115" textAnchor="middle" fill="#8aafc9" fontSize="5" fontFamily="monospace">{vintage}</text>
      )}
    </svg>
  );
}

function WineCardImage({ wine }) {
  const [failed, setFailed] = useState(false);

  if (failed || !wine.imageUrl) {
    return <WineBottlePlaceholder wine={wine} />;
  }

  return (
    <img
      src={wine.imageUrl}
      alt={wine.name}
      loading="lazy"
      onError={() => setFailed(true)}
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
  visibleColumns = {},
  note = "",
  onNoteChange,
}) {
  const col = (key, defaultOn = true) => visibleColumns[key] !== undefined ? visibleColumns[key] : defaultOn;
  const { t } = useTranslation();
  // Deterministic ±2 noise for investmentScore fallback — reproducible per wine
  const scoreNoise = [-2, -1, 0, 1, 2][(parseInt(wine.id) || 0) % 5];
  const displayScore = (() => {
    if (aiScore?.score != null) {
      const s = Number(aiScore.score);
      return isNaN(s) ? null : Math.min(100, Math.max(0, s));
    }
    if (wine.investmentScore != null) {
      const s = Math.min(95, Number(wine.investmentScore));
      return isNaN(s) ? null : Math.min(97, Math.max(0, s + scoreNoise));
    }
    return null;
  })();

  return (
    <div
      className="wineCard fade-up vi-interactive"
      onMouseMove={onCardTilt}
      onMouseLeave={onCardTiltReset}
    >
      <div className="wineCard-image" onClick={(e) => { e.stopPropagation(); onImageClick({ ...wine, aiScoreData: aiScore }); }}>
        <WineCardImage wine={wine} />
        <span className="bottle-hint">VIEW</span>
      </div>
      <div className="wineCard-body">
        {col("badges") && (
          <div className="wineCard-badges">
            <span className={`badge-risk ${(wine.risk || "medio").toLowerCase()}`}>{wine.risk || "Medio"}</span>
            {wine.marketTrend && <span className="badge-trend">{wine.marketTrend}</span>}
          </div>
        )}
        <h2>{wine.name}</h2>
        <p className="wineCard-producer">{wine.producer} · {wine.vintage || ""}</p>
        {col("region", false) && wine.region && (
          <p style={{ fontSize: 10, color: "#3a5a7a", margin: "-4px 0 6px", fontStyle: "italic" }}>
            {wine.region.split(",")[0]}
          </p>
        )}
        {col("aiScore") && (
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
              <span style={{ fontSize: 10, color: aiScore?.signal === "Strong Buy" ? "var(--vi-positive)" : aiScore?.signal ? "var(--vi-accent)" : "#3a5a7a", cursor: "help" }}>
                {aiScore?.signal ?? "AI Score"}
              </span>
            </InfoTooltip>
          </div>
        )}
        {col("price") && (
          <div className="wineCard-price">
            <span className="price-main">€ {wine.currentPrice != null && !isNaN(wine.currentPrice) ? wine.currentPrice : '—'}</span>
            <span className="price-label">/ bottle</span>
            <SourceBadge
              source={wine.priceSource || "Liv-ex est."}
              url={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name || "")}`}
              confidence={wine.priceConfidence || 82}
              compact
            />
          </div>
        )}
        {col("alert") && (
          <div style={{ marginBottom: 9 }}>
            {alerts.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#60a5fa", marginBottom: 3 }}>
                <span>🔔 Alert ≤ €{Number(a.target_price).toFixed(0)}</span>
                <button onClick={() => onDeleteAlert(a.id)} aria-label="Delete alert" style={{ background: "none", border: "none", color: "var(--vi-negative)", cursor: "pointer", fontSize: 12, padding: 0 }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 4 }}>
              <input
                type="number"
                placeholder={`Alert < €${wine.currentPrice}`}
                value={alertInput || ""}
                onChange={e => onAlertInputChange(wine.id, e.target.value)}
                style={{ flex: 1, padding: "5px 8px", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)", background: "var(--vi-bg)", color: "var(--vi-text-dim)", fontSize: 11, outline: "none", minWidth: 0, fontFamily: "var(--vi-font-sans)" }}
                onKeyDown={e => e.key === "Enter" && onCreateAlert(wine)}
              />
              <button onClick={() => onCreateAlert(wine)} aria-label="Set price alert" style={{ padding: "5px 8px", borderRadius: "var(--vi-radius-sm)", border: "1px solid rgba(30,58,95,0.6)", background: "#0c1a2e", color: "#60a5fa", fontSize: 11, cursor: "pointer" }}>🔔</button>
            </div>
          </div>
        )}
        <div className="wineCard-actions">
          <WinePriceCompare wineId={wine.id} wineName={wine.name} vintage={wine.vintage} criticScore={wine.criticScore || wine.investmentScore} />
          <button className="btn-primary" onClick={() => onAddToPortfolio(wine)}>{t("market.addToPortfolio")}</button>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button className={`btn-secondary ${inWatchlist ? "active" : ""}`} onClick={() => onToggleWatchlist(wine)} aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"} title={wine._watchlistCount > 0 ? `${wine._watchlistCount} investors watching` : undefined}>
              {inWatchlist ? "★" : "☆"}{wine._watchlistCount > 1 ? <span style={{ fontSize: 9, marginLeft: 2, color: "#60a5fa" }}>{wine._watchlistCount}</span> : null}
            </button>
            {onNoteChange && (
              <WineNotesButton
                wineId={wine.id}
                wineName={wine.name}
                note={note}
                onSave={onNoteChange}
              />
            )}
          </div>
        </div>
        {col("links") && (
          <div style={{ display: "flex", borderTop: "1px solid var(--vi-border)", marginTop: 4 }}>
            <a
              href={`https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}${wine.vintage ? `/${wine.vintage}` : ""}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#3a5a7a", textDecoration: "none", padding: "6px 0 4px", transition: `color var(--vi-dur) var(--vi-ease)`, borderRight: "1px solid var(--vi-border)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--vi-accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "#3a5a7a"}
            >Wine-Searcher ↗</a>
            <a
              href={`https://www.vivino.com/search/wines?q=${encodeURIComponent(wine.name)}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#3a5a7a", textDecoration: "none", padding: "6px 0 4px", transition: `color var(--vi-dur) var(--vi-ease)`, borderRight: "1px solid var(--vi-border)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#aa4466"}
              onMouseLeave={e => e.currentTarget.style.color = "#3a5a7a"}
            >Vivino ↗</a>
            <a
              href="/compare"
              style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#3a5a7a", textDecoration: "none", padding: "6px 0 4px", transition: `color var(--vi-dur) var(--vi-ease)` }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--vi-accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "#3a5a7a"}
            >Compare →</a>
          </div>
        )}
      </div>
    </div>
  );
}, (prev, next) =>
  prev.wine === next.wine &&
  prev.aiScore === next.aiScore &&
  prev.alertInput === next.alertInput &&
  prev.inWatchlist === next.inWatchlist &&
  prev.alerts.length === next.alerts.length &&
  prev.note === next.note &&
  prev.visibleColumns === next.visibleColumns
);

export default WineCard;
