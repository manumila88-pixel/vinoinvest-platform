import { useState } from "react";

const TYPES = [
  { id: "rosso", label: "Rosso", emoji: "🍷" },
  { id: "bianco", label: "Bianco", emoji: "🥂" },
  { id: "rosé", label: "Rosé", emoji: "🌸" },
  { id: "champagne", label: "Champagne / Sparkling", emoji: "🍾" },
  { id: "dolce", label: "Dolce", emoji: "🍯" },
  { id: "fortificato", label: "Fortificato", emoji: "🫙" },
];

const GRAPES = ["Nebbiolo", "Cabernet Sauvignon", "Pinot Noir", "Chardonnay", "Sangiovese", "Syrah / Shiraz", "Merlot", "Riesling", "Grenache", "Tempranillo"];

const REGIONS = [
  { id: "bordeaux", label: "Bordeaux", flag: "🇫🇷" },
  { id: "bourgogne", label: "Bourgogne", flag: "🇫🇷" },
  { id: "piemonte", label: "Piemonte", flag: "🇮🇹" },
  { id: "toscana", label: "Toscana", flag: "🇮🇹" },
  { id: "champagne", label: "Champagne", flag: "🇫🇷" },
  { id: "napa", label: "Napa Valley", flag: "🇺🇸" },
  { id: "rioja", label: "Rioja", flag: "🇪🇸" },
  { id: "barossa", label: "Barossa Valley", flag: "🇦🇺" },
  { id: "douro", label: "Douro", flag: "🇵🇹" },
  { id: "mosel", label: "Mosel", flag: "🇩🇪" },
];

const RISKS = [
  { id: "basso", label: "Basso", color: "#4ade80" },
  { id: "medio", label: "Medio", color: "#fbbf24" },
  { id: "alto", label: "Alto", color: "#f87171" },
];

const MERCHANTS = [
  { id: "wine-searcher", label: "Wine-Searcher" },
  { id: "vivino", label: "Vivino" },
  { id: "tannico", label: "Tannico" },
  { id: "millesima", label: "Millesima" },
  { id: "idealwine", label: "iDealwine" },
];

export default function MarketFilters({ filters, onChange, onReset, resultCount }) {
  const [open, setOpen] = useState(false);

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function toggleArr(key, value) {
    const arr = filters[key] || [];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    set(key, next);
  }

  const activeCount = [
    filters.type,
    (filters.priceMin > 0 || filters.priceMax < 10000) ? 1 : null,
    (filters.scoreMin > 0 || filters.scoreMax < 100) ? 1 : null,
    filters.grape,
    filters.region,
    (filters.vintageMin > 1990 || filters.vintageMax < 2024) ? 1 : null,
    filters.risk,
    filters.realDataOnly ? 1 : null,
  ].filter(Boolean).length;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px", borderRadius: 10, cursor: "pointer",
          background: open ? "rgba(201,162,39,0.12)" : "rgba(11,18,32,0.7)",
          border: open ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(30,41,59,0.5)",
          color: open ? "#C9A227" : "#94a3b8",
          fontSize: 13, fontWeight: 600, transition: "all 0.2s",
          marginBottom: 0,
        }}
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Filtri Avanzati
        {activeCount > 0 && (
          <span style={{ background: "#C9A227", color: "#0b1220", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
            {activeCount}
          </span>
        )}
        {resultCount != null && (
          <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>{resultCount.toLocaleString()} vini</span>
        )}
      </button>

      {/* Filter panel */}
      {open && (
        <div style={{
          background: "rgba(11,18,32,0.97)", border: "1px solid rgba(30,41,59,0.7)",
          borderRadius: 16, padding: "20px 24px", marginTop: 10, marginBottom: 16,
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>

            {/* Tipologia */}
            <div>
              <p style={sectionLabel}>Tipologia</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => set("type", filters.type === t.id ? "" : t.id)}
                    style={chipStyle(filters.type === t.id)}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fascia prezzo */}
            <div>
              <p style={sectionLabel}>Fascia Prezzo</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  type="number" min="0" max="10000"
                  value={filters.priceMin}
                  onChange={e => set("priceMin", Number(e.target.value))}
                  placeholder="€ Min"
                  style={numInput}
                />
                <input
                  type="number" min="0" max="10000"
                  value={filters.priceMax}
                  onChange={e => set("priceMax", Number(e.target.value))}
                  placeholder="€ Max"
                  style={numInput}
                />
              </div>
              <input
                type="range" min="0" max="10000" step="50"
                value={filters.priceMax}
                onChange={e => set("priceMax", Number(e.target.value))}
                style={{ width: "100%", accentColor: "#C9A227" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
                <span>€0</span><span>€{(filters.priceMax || 10000).toLocaleString()}</span>
              </div>
            </div>

            {/* AI Score */}
            <div>
              <p style={sectionLabel}>AI Score</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="number" min="0" max="100" value={filters.scoreMin} onChange={e => set("scoreMin", Number(e.target.value))} placeholder="Min" style={numInput} />
                <input type="number" min="0" max="100" value={filters.scoreMax} onChange={e => set("scoreMax", Number(e.target.value))} placeholder="Max" style={numInput} />
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[60, 70, 80, 90].map(v => (
                  <button key={v} onClick={() => set("scoreMin", v)} style={chipStyle(filters.scoreMin === v)}>
                    {v}+
                  </button>
                ))}
              </div>
            </div>

            {/* Uve */}
            <div>
              <p style={sectionLabel}>Uve Principali</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {GRAPES.map(g => (
                  <button
                    key={g}
                    onClick={() => set("grape", filters.grape === g ? "" : g)}
                    style={chipStyle(filters.grape === g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Regione */}
            <div>
              <p style={sectionLabel}>Regione</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {REGIONS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => set("region", filters.region === r.id ? "" : r.id)}
                    style={chipStyle(filters.region === r.id)}
                  >
                    {r.flag} {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Annata */}
            <div>
              <p style={sectionLabel}>Annata</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="number" min="1950" max="2024" value={filters.vintageMin} onChange={e => set("vintageMin", Number(e.target.value))} placeholder="Da" style={numInput} />
                <input type="number" min="1950" max="2024" value={filters.vintageMax} onChange={e => set("vintageMax", Number(e.target.value))} placeholder="A" style={numInput} />
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {[2010, 2015, 2018, 2020].map(y => (
                  <button key={y} onClick={() => { set("vintageMin", y); set("vintageMax", 2024); }} style={chipStyle(filters.vintageMin === y)}>
                    {y}+
                  </button>
                ))}
              </div>
            </div>

            {/* Rischio */}
            <div>
              <p style={sectionLabel}>Rischio</p>
              <div style={{ display: "flex", gap: 8 }}>
                {RISKS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => set("risk", filters.risk === r.id ? "" : r.id)}
                    style={{
                      padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: filters.risk === r.id ? `${r.color}22` : "rgba(11,18,32,0.6)",
                      border: filters.risk === r.id ? `1.5px solid ${r.color}` : "1px solid rgba(30,41,59,0.5)",
                      color: filters.risk === r.id ? r.color : "#64748b",
                      transition: "all 0.15s",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Commercianti & Solo dati reali */}
            <div>
              <p style={sectionLabel}>Commercianti</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                {MERCHANTS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleArr("merchants", m.id)}
                    style={chipStyle((filters.merchants || []).includes(m.id))}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#94a3b8" }}>
                <input
                  type="checkbox"
                  checked={filters.realDataOnly || false}
                  onChange={e => set("realDataOnly", e.target.checked)}
                  style={{ accentColor: "#C9A227" }}
                />
                Solo dati reali verificati
              </label>
            </div>

          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(30,41,59,0.5)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onReset} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.5)", background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer" }}>
              Azzera filtri
            </button>
            <button onClick={() => setOpen(false)} style={{ padding: "8px 18px", borderRadius: 8, border: "1.5px solid rgba(201,162,39,0.5)", background: "rgba(201,162,39,0.1)", color: "#C9A227", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Applica ({resultCount?.toLocaleString() ?? "…"} risultati)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const sectionLabel = { fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, marginTop: 0 };

function chipStyle(active) {
  return {
    padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600,
    background: active ? "rgba(201,162,39,0.15)" : "rgba(30,41,59,0.4)",
    border: active ? "1.5px solid rgba(201,162,39,0.5)" : "1px solid rgba(30,41,59,0.5)",
    color: active ? "#C9A227" : "#64748b",
    transition: "all 0.15s",
  };
}

const numInput = {
  width: "100%", padding: "6px 10px", borderRadius: 8,
  background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.6)",
  color: "#e2e8f0", fontSize: 12, outline: "none",
};

export const DEFAULT_FILTERS = {
  type: "", priceMin: 0, priceMax: 10000, scoreMin: 0, scoreMax: 100,
  grape: "", region: "", vintageMin: 1990, vintageMax: 2024,
  risk: "", merchants: [], realDataOnly: false,
};
