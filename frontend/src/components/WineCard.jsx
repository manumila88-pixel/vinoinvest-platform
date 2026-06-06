import React, { memo } from "react";
import WinePriceCompare from "./WinePriceCompare";
import { useTranslation } from "react-i18next";

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

  return (
    <div
      className="wineCard fade-up"
      onMouseMove={onCardTilt}
      onMouseLeave={onCardTiltReset}
    >
      <div className="wineCard-image" onClick={() => onImageClick({ ...wine, aiScoreData: aiScore })}>
        {wine.imageUrl
          ? (
            <img
              src={wine.imageUrl}
              alt={wine.name}
              loading="lazy"
              onError={e => { e.target.style.display = "none"; }}
              style={{ height: 160, width: "auto", objectFit: "contain", filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.75))" }}
            />
          )
          : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.45 }}>
              <div style={{ fontSize: 52 }}>🍷</div>
              <div style={{ fontSize: 10, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{wine.variety || "Fine Wine"}</div>
            </div>
          )
        }
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
          <span className={`score-label${aiScore ? " pulsing" : ""}`}>
            {aiScore?.score ?? wine.investmentScore ?? "—"}
          </span>
          <div className="score-bar">
            <div className="score-fill" style={{ width: (aiScore?.score ?? wine.investmentScore ?? 75) + "%" }} />
          </div>
          <span style={{ fontSize: 10, color: aiScore?.signal === "Strong Buy" ? "#4ade80" : aiScore?.signal ? "#C9A227" : "#3a5a7a" }}>
            {aiScore?.signal ?? "AI Score"}
          </span>
        </div>
        <div className="wineCard-price">
          <span className="price-main">€ {wine.currentPrice}</span>
          <span className="price-label">/ bottle</span>
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
