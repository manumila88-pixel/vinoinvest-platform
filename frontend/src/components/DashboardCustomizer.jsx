/**
 * DashboardCustomizer — slide-in panel to reorder and show/hide sidebar sections.
 * Users control navigation order only. Data displayed in each section is unaffected.
 */
import React, { useState } from "react";

const GOLD = "#C9A227";

export default function DashboardCustomizer({ sections, onToggle, onMoveUp, onMoveDown, onReset }) {
  const [open, setOpen] = useState(false);
  const visibleCount = sections.filter(s => s.visible).length;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        title="Personalizza sezioni della dashboard"
        style={{
          padding: "5px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(8,15,30,0.5)",
          color: "#4a6a8a",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${GOLD}44`; e.currentTarget.style.color = GOLD; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#4a6a8a"; }}
      >
        ⊟ Sezioni <span style={{ fontSize: 9, opacity: 0.7 }}>({visibleCount}/{sections.length})</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
        >
          {/* Panel */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: "#0c1828",
              border: "1px solid rgba(201,162,39,0.2)",
              borderRadius: 16,
              padding: "24px 22px",
              width: 320,
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: GOLD, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Personalizza sezioni
              </span>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#475569", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <p style={{ fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.6 }}>
              Scegli l'ordine e la visibilità delle sezioni nel menu. Non modifica i dati visualizzati.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sections.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: s.visible ? "rgba(201,162,39,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${s.visible ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.04)"}`,
                    borderRadius: 10,
                    transition: "all 0.12s",
                  }}
                >
                  {/* Toggle visible */}
                  <button
                    onClick={() => onToggle(s.id)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: `2px solid ${s.visible ? GOLD : "#334155"}`,
                      background: s.visible ? GOLD : "transparent",
                      flexShrink: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.12s",
                    }}
                    title={s.visible ? "Nascondi sezione" : "Mostra sezione"}
                  >
                    {s.visible && <span style={{ color: "#060e1c", fontSize: 10, fontWeight: 900 }}>✓</span>}
                  </button>

                  {/* Label */}
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: s.visible ? "#e2e8f0" : "#475569" }}>
                    {s.label}
                  </span>

                  {/* Move buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button
                      onClick={() => onMoveUp(s.id)}
                      disabled={i === 0}
                      style={{ background: "none", border: "none", color: i === 0 ? "#1e293b" : "#475569", cursor: i === 0 ? "default" : "pointer", fontSize: 12, lineHeight: 1, padding: "1px 4px" }}
                      title="Sposta su"
                    >▲</button>
                    <button
                      onClick={() => onMoveDown(s.id)}
                      disabled={i === sections.length - 1}
                      style={{ background: "none", border: "none", color: i === sections.length - 1 ? "#1e293b" : "#475569", cursor: i === sections.length - 1 ? "default" : "pointer", fontSize: 12, lineHeight: 1, padding: "1px 4px" }}
                      title="Sposta giù"
                    >▼</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => { onReset(); }}
                style={{ fontSize: 11, color: "#475569", background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 12px", cursor: "pointer" }}
              >
                Ripristina ordine
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ fontSize: 11, fontWeight: 700, color: "#060e1c", background: GOLD, border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer" }}
              >
                Fine
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
