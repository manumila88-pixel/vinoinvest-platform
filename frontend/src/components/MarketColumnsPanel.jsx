/**
 * MarketColumnsPanel — gear icon + dropdown to toggle which WineCard columns are visible.
 * The user controls display only. Data values (AI Score, price, etc.) are untouched.
 */
import React, { useState, useRef, useEffect } from "react";

const GOLD = "#C9A227";

const COLUMN_DEFS = [
  { key: "aiScore",  label: "AI Score",          desc: "Punteggio AI + barra + segnale" },
  { key: "price",    label: "Prezzo",             desc: "Prezzo bottiglia + fonte dati" },
  { key: "badges",   label: "Badge",              desc: "Rischio e trend di mercato" },
  { key: "region",   label: "Regione",            desc: "Tag regione/paese sotto il produttore" },
  { key: "alert",    label: "Alert prezzo",       desc: "Campo input per impostare alert" },
  { key: "links",    label: "Link esterni",       desc: "Wine-Searcher, Vivino, Compare" },
];

export default function MarketColumnsPanel({ columns, onToggle, onReset }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const visibleCount = COLUMN_DEFS.filter(d => columns[d.key]).length;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Colonne visibili nel mercato"
        aria-expanded={open}
        style={{
          padding: "7px 12px",
          borderRadius: 8,
          border: open ? `1px solid ${GOLD}55` : "1px solid rgba(30,41,59,0.5)",
          background: open ? `${GOLD}12` : "rgba(8,15,30,0.5)",
          color: open ? GOLD : "#4a6a8a",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        ⚙ Colonne <span style={{ fontSize: 10, opacity: 0.7 }}>({visibleCount}/{COLUMN_DEFS.length})</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          right: 0,
          zIndex: 120,
          background: "#0c1828",
          border: "1px solid rgba(201,162,39,0.2)",
          borderRadius: 12,
          padding: "14px 16px",
          minWidth: 260,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Colonne visibili
            </span>
            <button
              onClick={onReset}
              style={{ fontSize: 10, color: "#475569", background: "none", border: "none", cursor: "pointer", padding: "2px 6px" }}
            >
              Ripristina
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COLUMN_DEFS.map(({ key, label, desc }) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: columns[key] ? "rgba(201,162,39,0.07)" : "transparent",
                  border: `1px solid ${columns[key] ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.04)"}`,
                  transition: "all 0.12s",
                }}
              >
                <div
                  onClick={() => onToggle(key)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `2px solid ${columns[key] ? GOLD : "#334155"}`,
                    background: columns[key] ? GOLD : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.12s",
                    cursor: "pointer",
                  }}
                >
                  {columns[key] && <span style={{ color: "#060e1c", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: columns[key] ? "#e2e8f0" : "#64748b" }}>{label}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "#334155", lineHeight: 1.6 }}>
            Le preferenze vengono salvate automaticamente.
          </div>
        </div>
      )}
    </div>
  );
}
