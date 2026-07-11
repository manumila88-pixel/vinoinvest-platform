import React, { useEffect, useMemo, useState } from "react";
import { API } from "../lib/constants";

const scoreColor = (s) =>
  s >= 90 ? "var(--vi-positive)" : s >= 78 ? "#86efac" : s >= 65 ? "var(--vi-accent)" : s >= 50 ? "#fb923c" : "var(--vi-negative)";

const riskClass = (r) => {
  const lc = (r || "").toLowerCase();
  if (lc === "basso" || lc === "low") return "basso";
  if (lc === "alto" || lc === "high") return "alto";
  return "medio";
};

const price = (w) => Number(w.currentPrice || w.current_price || 0);
const score = (w) => Number(w.investmentScore || w.investment_score || 0);

export default function WatchlistPanel({ watchlist, onToggleWatchlist, onSelectWine, onGoMarket, navigate }) {
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState([]);
  const ids = useMemo(() => (watchlist || []).filter(Boolean), [watchlist]);

  useEffect(() => {
    if (ids.length === 0) { setWines([]); setError(false); return; }
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`${API}/api/wines?ids=${encodeURIComponent(ids.join(","))}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(d => setWines(d.results || []))
      .catch(e => { if (e.name !== "AbortError") setError(true); })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [ids.join(",")]);

  // keep selection valid when the watchlist changes
  useEffect(() => {
    setSelected(prev => prev.filter(id => ids.includes(id)));
  }, [ids.join(",")]);

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 4 ? prev : [...prev, id]
    );
  }

  const compareIds = selected.length >= 2 ? selected : ids.length >= 2 && ids.length <= 4 ? ids : null;

  return (
    <div style={{ marginBottom: 34 }}>
      <div className="section-header">
        <div>
          <div className="section-title">⭐ Watchlist</div>
          <div className="section-sub">
            {ids.length === 0 ? "Nessun vino osservato" : `${ids.length} vin${ids.length === 1 ? "o" : "i"} sotto osservazione — seleziona fino a 4 per confrontarli`}
          </div>
        </div>
        {compareIds && (
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "9px 18px", fontSize: 12, flex: "0 0 auto" }}
            onClick={() => navigate(`/compare?ids=${compareIds.join(",")}`)}
          >⚖️ Confronta {selected.length >= 2 ? `selezionati (${selected.length})` : "tutti"}</button>
        )}
      </div>

      {ids.length === 0 && (
        <div style={{ background: "var(--vi-bg-elev, rgba(11,18,32,0.82))", border: "1px dashed rgba(201,162,39,0.3)", borderRadius: 14, padding: "26px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 26, marginBottom: 8 }}>⭐</div>
          <div style={{ color: "var(--vi-text-dim, #94a3b8)", fontSize: 13, marginBottom: 14 }}>
            Aggiungi vini alla watchlist dal Mercato (icona ⭐ sulle card) per seguirli da qui.
          </div>
          <button className="btn-primary" style={{ width: "auto", padding: "9px 18px", fontSize: 12 }} onClick={onGoMarket}>
            🔍 Esplora il Mercato
          </button>
        </div>
      )}

      {ids.length > 0 && loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ids.slice(0, 4).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 12 }} />)}
        </div>
      )}

      {ids.length > 0 && !loading && error && (
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "16px 18px", color: "#f87171", fontSize: 13, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          Impossibile caricare la watchlist. Controlla la connessione.
          <button onClick={() => { setError(false); setWines([]); setLoading(true); fetch(`${API}/api/wines?ids=${encodeURIComponent(ids.join(","))}`).then(r => r.ok ? r.json() : Promise.reject()).then(d => setWines(d.results || [])).catch(() => setError(true)).finally(() => setLoading(false)); }}
            style={{ background: "transparent", border: "1px solid rgba(248,113,113,0.5)", color: "#f87171", borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontSize: 12 }}>
            Riprova
          </button>
        </div>
      )}

      {ids.length > 0 && !loading && !error && (
        <div style={{ overflowX: "auto", background: "var(--vi-bg-elev, rgba(11,18,32,0.82))", border: "1px solid var(--vi-border, rgba(30,41,59,0.6))", borderRadius: 14 }}>
          <table className="holdingsTable" style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--vi-border, rgba(30,41,59,0.6))" }}>
                <th style={{ padding: "10px 8px 10px 14px", width: 30 }} aria-label="Seleziona per confronto"></th>
                <th style={{ padding: "10px 8px", textAlign: "left", fontSize: 11, color: "var(--vi-text-dim, #94a3b8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Vino</th>
                <th style={{ padding: "10px 8px", textAlign: "right", fontSize: 11, color: "var(--vi-text-dim, #94a3b8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Prezzo</th>
                <th style={{ padding: "10px 8px", textAlign: "center", fontSize: 11, color: "var(--vi-text-dim, #94a3b8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Score</th>
                <th style={{ padding: "10px 8px", textAlign: "center", fontSize: 11, color: "var(--vi-text-dim, #94a3b8)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rischio</th>
                <th style={{ padding: "10px 8px", width: 40 }} aria-label="Rimuovi"></th>
              </tr>
            </thead>
            <tbody>
              {wines.map(w => (
                <tr key={w.id} style={{ borderBottom: "1px solid rgba(30,41,59,0.35)" }}>
                  <td style={{ padding: "8px 8px 8px 14px" }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(w.id)}
                      onChange={() => toggleSelect(w.id)}
                      disabled={!selected.includes(w.id) && selected.length >= 4}
                      aria-label={`Seleziona ${w.name} per il confronto`}
                      style={{ accentColor: "#C9A227", width: 15, height: 15, cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button onClick={() => onSelectWine(w)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", font: "inherit" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vi-text, #e2e8f0)", fontFamily: "'Playfair Display', Georgia, serif" }}>{w.name}</div>
                      <div style={{ fontSize: 11, color: "var(--vi-text-dim, #64748b)" }}>{w.producer}{w.vintage ? ` · ${w.vintage}` : ""}{w.region ? ` · ${w.region}` : ""}</div>
                    </button>
                  </td>
                  <td style={{ padding: "8px", textAlign: "right", fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "var(--vi-text, #f1f5f9)" }}>
                    {price(w) ? `€${price(w).toLocaleString("it-IT")}` : "–"}
                  </td>
                  <td style={{ padding: "8px", textAlign: "center", fontSize: 13, fontWeight: 800, color: scoreColor(score(w)) }}>
                    {score(w) || "–"}
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <span className={`badge-risk ${riskClass(w.risk)}`}>{w.risk || "–"}</span>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    <button
                      onClick={() => onToggleWatchlist(w)}
                      title="Rimuovi dalla watchlist"
                      aria-label={`Rimuovi ${w.name} dalla watchlist`}
                      style={{ background: "transparent", border: "none", color: "#C9A227", cursor: "pointer", fontSize: 15, minHeight: 0 }}
                    >★</button>
                  </td>
                </tr>
              ))}
              {wines.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "16px 14px", fontSize: 12, color: "var(--vi-text-dim, #64748b)", textAlign: "center" }}>
                  I vini osservati non sono più disponibili nel catalogo.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
