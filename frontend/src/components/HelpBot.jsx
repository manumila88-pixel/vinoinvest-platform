import React, { useState, useRef, useEffect, useCallback } from "react";
import { FAQ, CATEGORIES, searchFAQ } from "../data/faq.js";

const SUGGESTED = [
  "Cos'è l'AI Score?",
  "Come calcolo il ROI?",
  "I prezzi sono reali?",
  "Come aggiungo un vino al portfolio?",
  "Qual è il rendimento medio?",
  "Posso comprare qui?",
];

function FAQItem({ item, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: "1px solid rgba(30,41,59,0.6)",
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.2s",
      ...(open ? { borderColor: "rgba(201,162,39,0.3)" } : {}),
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 10, padding: "12px 16px",
          background: open ? "rgba(201,162,39,0.05)" : "rgba(11,18,32,0.6)",
          border: "none", cursor: "pointer", color: "#e2e8f0",
          fontSize: 13, fontWeight: open ? 600 : 500, lineHeight: 1.4,
          transition: "background 0.2s",
        }}
      >
        <span style={{ flex: 1 }}>{item.q}</span>
        <span style={{ fontSize: 18, color: "#C9A227", transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
          ›
        </span>
      </button>
      {open && (
        <div style={{
          padding: "14px 16px",
          background: "rgba(6,13,26,0.8)",
          fontSize: 13, color: "#94a3b8", lineHeight: 1.7,
          borderTop: "1px solid rgba(30,41,59,0.4)",
          animation: "helpExpand 0.2s ease-out",
        }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function HelpBot({ onAskAI }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [openItemId, setOpenItemId] = useState(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useCallback(() => {
    let items = query.trim() ? searchFAQ(query) : FAQ;
    if (activeCat !== "all") items = items.filter(f => f.cat === activeCat);
    return items;
  }, [query, activeCat]);

  const results = filtered();

  // Focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    function handler(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function handleSuggestion(q) {
    setQuery(q);
    setActiveCat("all");
  }

  function handleAskAI() {
    if (onAskAI) onAskAI(query);
    setOpen(false);
  }

  const catList = [
    { id: "all", label: "Tutte", icon: "🔍" },
    { id: "rendimenti", label: "Rendimenti", icon: "📈" },
    { id: "funziona", label: "Come funziona", icon: "⚙️" },
    { id: "portfolio", label: "Portfolio", icon: "💼" },
    { id: "acquisti", label: "Acquisti", icon: "🛒" },
    { id: "account", label: "Account", icon: "👤" },
    { id: "sicurezza", label: "Sicurezza", icon: "🔒" },
  ];

  return (
    <>
      {/* Floating ? button — positioned above AI chat button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Centro assistenza FAQ"
        style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9000,
          width: 44, height: 44, borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,#1e3a5f,#0c2a4a)"
            : "rgba(11,18,32,0.92)",
          border: "1.5px solid rgba(201,162,39,0.35)",
          cursor: "pointer", fontSize: 18, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#C9A227",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.7)"; e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.35)"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? "✕" : "?"}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            bottom: 152,
            right: 28,
            zIndex: 9001,
            width: "min(400px, calc(100vw - 32px))",
            maxHeight: "min(600px, calc(100vh - 180px))",
            background: "linear-gradient(160deg,#0c1524 0%,#080f1c 100%)",
            border: "1px solid rgba(201,162,39,0.2)",
            borderRadius: 18,
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,162,39,0.08)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            animation: "helpIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(30,41,59,0.5)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>💬</span>
              <div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                  Centro Assistenza
                </div>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginTop: 1 }}>
                  {FAQ.length} risposte disponibili
                </div>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#3a5a7a", fontSize: 14 }}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveCat("all"); }}
                placeholder="Cerca nelle FAQ..."
                style={{
                  width: "100%", padding: "9px 12px 9px 34px",
                  background: "rgba(11,18,32,0.8)",
                  border: "1px solid rgba(30,41,59,0.7)",
                  borderRadius: 10, color: "#e2e8f0", fontSize: 13,
                  outline: "none", fontFamily: "'Inter',Arial,sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(30,41,59,0.7)"}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#3a5a7a", cursor: "pointer", fontSize: 14,
                }}>✕</button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {!query && (
            <div style={{
              display: "flex", gap: 6, padding: "12px 18px",
              overflowX: "auto", flexShrink: 0,
              borderBottom: "1px solid rgba(30,41,59,0.4)",
              scrollbarWidth: "none",
            }}>
              {catList.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  style={{
                    whiteSpace: "nowrap", padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                    fontSize: 11, fontWeight: 600,
                    border: activeCat === c.id ? "1px solid rgba(201,162,39,0.5)" : "1px solid rgba(30,41,59,0.5)",
                    background: activeCat === c.id ? "rgba(201,162,39,0.12)" : "rgba(11,18,32,0.5)",
                    color: activeCat === c.id ? "#C9A227" : "#4a6a8a",
                    transition: "all 0.15s",
                  }}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 18px" }}>
            {/* No query: show suggestions */}
            {!query && activeCat === "all" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#3a5a7a", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Domande frequenti
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SUGGESTED.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      style={{
                        padding: "5px 10px", borderRadius: 8,
                        background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,58,95,0.5)",
                        color: "#60a5fa", fontSize: 11, cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(30,58,95,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(11,18,32,0.8)"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ list */}
            {results.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {query && (
                  <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 4 }}>
                    {results.length} risultat{results.length === 1 ? "o" : "i"} per "{query}"
                  </div>
                )}
                {results.map((item, i) => (
                  <FAQItem key={item.id} item={item} defaultOpen={query.trim() && i === 0} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🤔</div>
                <div style={{ fontSize: 13, color: "#3a5a7a", marginBottom: 16 }}>
                  Non ho trovato una risposta precisa per "{query}".
                </div>
                <button
                  onClick={handleAskAI}
                  style={{
                    padding: "10px 20px", borderRadius: 10,
                    background: "linear-gradient(135deg,#9b1c4a,#C9A227)",
                    border: "none", color: "#fff", cursor: "pointer",
                    fontSize: 13, fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(201,162,39,0.3)",
                  }}
                >
                  🤖 Chiedi all'AI Advisor →
                </button>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginTop: 8 }}>
                  L'AI risponde in tempo reale con dati di mercato reali
                </div>
              </div>
            )}

            {/* Ask AI shortcut — always visible at bottom when query present */}
            {query.trim() && results.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(30,41,59,0.4)" }}>
                <button
                  onClick={handleAskAI}
                  style={{
                    width: "100%", padding: "10px 16px", borderRadius: 10,
                    background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,58,95,0.5)",
                    color: "#60a5fa", cursor: "pointer", fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(30,58,95,0.3)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(11,18,32,0.8)"; e.currentTarget.style.borderColor = "rgba(30,58,95,0.5)"; }}
                >
                  🤖 <span>Non trovi risposta? Chiedi all'AI Advisor</span> →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes helpIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes helpExpand {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
