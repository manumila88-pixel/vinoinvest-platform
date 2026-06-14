/**
 * WineNotesButton — inline note button on WineCard.
 * Opens a small textarea to write personal notes on a wine.
 * Notes are display-only metadata: they never alter scores, prices or data.
 */
import React, { useState, useRef, useEffect } from "react";

const GOLD = "#C9A227";

export default function WineNotesButton({ wineId, wineName, note, onSave }) {
  const [open, setOpen]   = useState(false);
  const [text, setText]   = useState(note || "");
  const ref               = useRef(null);
  const areaRef           = useRef(null);

  // Sync external note changes
  useEffect(() => { setText(note || ""); }, [note]);

  useEffect(() => {
    if (open && areaRef.current) areaRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { handleSave(); setOpen(false); } };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, text]);

  function handleSave() {
    if (text !== (note || "")) onSave(wineId, text);
  }

  function handleKey(e) {
    if (e.key === "Escape") { setOpen(false); }
    if (e.key === "Enter" && e.ctrlKey) { handleSave(); setOpen(false); }
  }

  const hasNote = !!(note && note.trim());

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        title={hasNote ? `Nota: ${note}` : "Aggiungi nota personale"}
        aria-label="Note personali su questo vino"
        style={{
          background: "none",
          border: `1px solid ${hasNote ? `${GOLD}55` : "rgba(255,255,255,0.08)"}`,
          borderRadius: 6,
          color: hasNote ? GOLD : "#334155",
          fontSize: 11,
          padding: "3px 7px",
          cursor: "pointer",
          transition: "all 0.12s",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ✎{hasNote && <span style={{ fontSize: 9, opacity: 0.8 }}>•</span>}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 6px)",
          left: 0,
          zIndex: 200,
          background: "#0c1828",
          border: `1px solid ${GOLD}33`,
          borderRadius: 10,
          padding: 12,
          width: 240,
          boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
        }}>
          <div style={{ fontSize: 10, color: GOLD, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Nota su {wineName}
          </div>
          <textarea
            ref={areaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Appunta osservazioni, ricerche, piani…"
            maxLength={500}
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#060e1c",
              border: "1px solid rgba(201,162,39,0.2)",
              borderRadius: 6,
              color: "#cbd5e1",
              fontSize: 12,
              fontFamily: "var(--vi-font-sans, sans-serif)",
              lineHeight: 1.6,
              padding: "8px 10px",
              resize: "none",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 9, color: "#334155" }}>{text.length}/500 · Ctrl+Enter per salvare</span>
            <div style={{ display: "flex", gap: 6 }}>
              {hasNote && (
                <button
                  onClick={() => { setText(""); onSave(wineId, ""); setOpen(false); }}
                  style={{ fontSize: 10, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "3px 8px" }}
                >
                  Elimina
                </button>
              )}
              <button
                onClick={() => { handleSave(); setOpen(false); }}
                style={{ fontSize: 11, color: "#060e1c", background: GOLD, border: "none", borderRadius: 5, padding: "4px 10px", fontWeight: 700, cursor: "pointer" }}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
