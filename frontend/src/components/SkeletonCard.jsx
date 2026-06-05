export default function SkeletonCard() {
  return (
    <div className="wineCard" style={{ pointerEvents: "none" }}>
      <div className="wineCard-image skeleton" style={{ height: 190 }} />
      <div className="wineCard-body" style={{ gap: 10 }}>
        <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 20, width: "80%", borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: "50%", borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 8, width: "100%", borderRadius: 6, marginTop: 4 }} />
        <div className="skeleton" style={{ height: 24, width: "40%", borderRadius: 6, marginTop: 6 }} />
        <div className="skeleton" style={{ height: 36, width: "100%", borderRadius: 10, marginTop: 8 }} />
      </div>
    </div>
  );
}
