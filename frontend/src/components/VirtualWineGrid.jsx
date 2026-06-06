import React from "react";
import { List } from "react-window";
import WineCard from "./WineCard";

const CARDS_PER_ROW = 3;
const ROW_HEIGHT = 464; // card ~440px + 24px gap

function RowComponent({ index, style, rows, cardProps }) {
  const row = rows[index];
  if (!row) return null;

  return (
    <div style={{ ...style, display: "flex", gap: 24, paddingBottom: 24, boxSizing: "border-box" }}>
      {row.map(wine => (
        <div key={wine.id} style={{ flex: "1 1 0", minWidth: 0 }}>
          <WineCard
            wine={wine}
            aiScore={cardProps.aiScores[wine.id]}
            alerts={cardProps.alerts.filter(a => a.wine_id === wine.id && a.active)}
            alertInput={cardProps.alertInputs[wine.id]}
            inWatchlist={cardProps.watchlist.includes(wine.id)}
            onImageClick={cardProps.onImageClick}
            onAddToPortfolio={cardProps.onAddToPortfolio}
            onToggleWatchlist={cardProps.onToggleWatchlist}
            onCardTilt={cardProps.onCardTilt}
            onCardTiltReset={cardProps.onCardTiltReset}
            onCreateAlert={cardProps.onCreateAlert}
            onAlertInputChange={cardProps.onAlertInputChange}
            onDeleteAlert={cardProps.onDeleteAlert}
          />
        </div>
      ))}
      {Array.from({ length: CARDS_PER_ROW - row.length }).map((_, i) => (
        <div key={`empty-${i}`} style={{ flex: "1 1 0", minWidth: 0 }} />
      ))}
    </div>
  );
}

export default function VirtualWineGrid({ wines, containerWidth = 900, listHeight = 880, cardProps, sentinelRef }) {
  const rows = [];
  for (let i = 0; i < wines.length; i += CARDS_PER_ROW) {
    rows.push(wines.slice(i, i + CARDS_PER_ROW));
  }

  return (
    <>
      <List
        rowComponent={RowComponent}
        rowCount={rows.length}
        rowHeight={ROW_HEIGHT}
        rowProps={{ rows, cardProps }}
        height={listHeight}
        width={containerWidth}
        overscanRowCount={2}
      />
      <div ref={sentinelRef} style={{ height: 1 }} />
    </>
  );
}
