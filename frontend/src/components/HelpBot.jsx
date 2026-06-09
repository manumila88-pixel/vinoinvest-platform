import React, { useState, useRef, useEffect, useCallback } from "react";
import { FAQ, B2B_CATS, searchFAQ } from "../data/faq.js";

const FAQ_B2C = FAQ.filter(f => !B2B_CATS.has(f.cat));
const FAQ_B2B = FAQ.filter(f => B2B_CATS.has(f.cat));

const SUGGESTED_B2C = [
  "Cos'è l'AI Score?",
  "Come calcolo il ROI?",
  "I prezzi sono reali?",
  "Come aggiungo un vino al portfolio?",
  "Qual è il rendimento medio?",
  "Posso comprare qui?",
];

const SUGGESTED_B2B = [
  "Volumi minimi istituzionale?",
  "Come funziona la due diligence?",
  "Correlazione vino con equity?",
  "API pubblica disponibile?",
  "Come ottenere il DPA?",
  "Prezzi piani B2B?",
];

const CATS_B2C = [
  { id: "all", label: "Tutte", icon: "🔍" },
  { id: "rendimenti", label: "Rendimenti", icon: "📈" },
  { id: "funziona", label: "Come funziona", icon: "⚙️" },
  { id: "portfolio", label: "Portfolio", icon: "💼" },
  { id: "acquisti", label: "Acquisti", icon: "🛒" },
  { id: "account", label: "Account", icon: "👤" },
  { id: "sicurezza", label: "Sicurezza", icon: "🔒" },
];

const CATS_B2B = [
  { id: "all", label: "Tutte", icon: "🔍" },
  { id: "b2b", label: "Investitori", icon: "🏦" },
  { id: "cantina", label: "Cantine", icon: "🍾" },
  { id: "wealth", label: "Wealth Mgr", icon: "📊" },
  { id: "compliance", label: "Compliance", icon: "⚖️" },
  { id: "tecnico", label: "Tecnico", icon: "🔧" },
];

function FAQItem({ item, defaultOpen = false, b2bMode = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: `1px solid ${b2bMode ? "rgba(59,130,246,0.2)" : "var(--vi-border)"}`,
      borderRadius: "var(--vi-radius-md)",
      overflow: "hidden",
      transition: `border-color var(--vi-dur) var(--vi-ease)`,
      ...(open ? { borderColor: b2bMode ? "rgba(59,130,246,0.5)" : "rgba(201,162,39,0.3)" } : {}),
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 10, padding: "12px 16px",
          background: open
            ? (b2bMode ? "rgba(59,130,246,0.08)" : "rgba(201,162,39,0.05)")
            : (b2bMode ? "rgba(8,15,30,0.8)" : "var(--vi-surface)"),
          border: "none", cursor: "pointer", color: "var(--vi-text)",
          fontSize: 13, fontWeight: open ? 600 : 500, lineHeight: 1.4,
          transition: `background var(--vi-dur) var(--vi-ease)`,
        }}
      >
        <span style={{ flex: 1 }}>{item.q}</span>
        <span style={{
          fontSize: 18,
          color: b2bMode ? "#60a5fa" : "var(--vi-accent)",
          transition: "transform 0.25s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          flexShrink: 0,
        }}>›</span>
      </button>
      {open && (
        <div style={{
          padding: "14px 16px",
          background: "var(--vi-bg)",
          fontSize: 13, color: "var(--vi-text-dim)", lineHeight: 1.7,
          borderTop: `1px solid ${b2bMode ? "rgba(59,130,246,0.15)" : "var(--vi-border)"}`,
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
  const [mode, setMode] = useState("b2c"); // "b2c" | "b2b"
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const b2bMode = mode === "b2b";
  const baseList = b2bMode ? FAQ_B2B : FAQ_B2C;
  const catList = b2bMode ? CATS_B2B : CATS_B2C;
  const suggested = b2bMode ? SUGGESTED_B2B : SUGGESTED_B2C;

  const results = useCallback(() => {
    let items = query.trim() ? searchFAQ(query).filter(f => b2bMode ? B2B_CATS.has(f.cat) : !B2B_CATS.has(f.cat)) : baseList;
    if (activeCat !== "all") items = items.filter(f => f.cat === activeCat);
    return items;
  }, [query, activeCat, b2bMode, baseList])();

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    function handler(e) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function switchMode(newMode) {
    setMode(newMode);
    setQuery("");
    setActiveCat("all");
  }

  function handleAskAI() {
    if (onAskAI) onAskAI(query);
    setOpen(false);
  }

  const accentColor = b2bMode ? "#60a5fa" : "var(--vi-accent)";
  const borderColor = b2bMode ? "rgba(59,130,246,0.25)" : "rgba(201,162,39,0.2)";

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        title="Centro assistenza FAQ"
        aria-label={open ? "Close help" : "Open help"}
        className="vi-interactive"
        style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9000,
          width: 44, height: 44, borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,#1e3a5f,#0c2a4a)"
            : "var(--vi-bg)",
          border: `1.5px solid ${open ? "rgba(201,162,39,0.6)" : "rgba(201,162,39,0.35)"}`,
          cursor: "pointer", fontSize: 18, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--vi-accent)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          transition: `all var(--vi-dur) var(--vi-ease)`,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.7)"; e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = open ? "rgba(201,162,39,0.6)" : "rgba(201,162,39,0.35)"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? "✕" : "?"}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="vi-card"
          style={{
            position: "fixed",
            bottom: 152,
            right: 28,
            zIndex: 9001,
            width: "min(420px, calc(100vw - 32px))",
            maxHeight: "min(640px, calc(100vh - 180px))",
            background: "var(--vi-bg)",
            borderColor,
            borderRadius: "var(--vi-radius-lg)",
            boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px ${b2bMode ? "rgba(59,130,246,0.06)" : "rgba(201,162,39,0.08)"}`,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            animation: "helpIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${b2bMode ? "rgba(59,130,246,0.15)" : "var(--vi-border)"}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{b2bMode ? "🏦" : "💬"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--vi-font-display)", fontSize: 15, fontWeight: 700, color: "var(--vi-text)" }}>
                  {b2bMode ? "Assistenza Professionale" : "Centro Assistenza"}
                </div>
                <div style={{ fontSize: 11, color: "#3a5a7a", marginTop: 1 }}>
                  {b2bMode ? `${FAQ_B2B.length} risposte B2B` : `${FAQ_B2C.length} risposte disponibili`}
                </div>
              </div>
            </div>

            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12, background: "var(--vi-bg)", borderRadius: "var(--vi-radius-sm)", padding: 3 }}>
              {[
                { key: "b2c", label: "Consumer", icon: "👤" },
                { key: "b2b", label: "B2B / Pro", icon: "🏦" },
              ].map(m => (
                <button
                  key={m.key}
                  onClick={() => switchMode(m.key)}
                  style={{
                    flex: 1, padding: "6px 10px", borderRadius: "var(--vi-radius-sm)", cursor: "pointer",
                    fontSize: 11, fontWeight: 700,
                    border: "none",
                    background: mode === m.key
                      ? (m.key === "b2b" ? "rgba(59,130,246,0.2)" : "rgba(201,162,39,0.15)")
                      : "transparent",
                    color: mode === m.key
                      ? (m.key === "b2b" ? "#60a5fa" : "var(--vi-accent)")
                      : "#4a6a8a",
                    transition: `all var(--vi-dur-fast) var(--vi-ease)`,
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#3a5a7a", fontSize: 14 }}>🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveCat("all"); }}
                placeholder={b2bMode ? "Cerca nelle FAQ B2B..." : "Cerca nelle FAQ..."}
                style={{
                  width: "100%", padding: "9px 12px 9px 34px",
                  background: "var(--vi-surface)",
                  border: `1px solid ${b2bMode ? "rgba(59,130,246,0.2)" : "var(--vi-border)"}`,
                  borderRadius: "var(--vi-radius-sm)", color: "var(--vi-text)", fontSize: 13,
                  outline: "none", fontFamily: "var(--vi-font-sans)",
                  boxSizing: "border-box",
                  transition: `border-color var(--vi-dur) var(--vi-ease)`,
                }}
                onFocus={e => e.currentTarget.style.borderColor = b2bMode ? "rgba(59,130,246,0.6)" : "rgba(201,162,39,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = b2bMode ? "rgba(59,130,246,0.2)" : "var(--vi-border)"}
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#3a5a7a", cursor: "pointer", fontSize: 14,
                }}>✕</button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {!query && (
            <div style={{
              display: "flex", gap: 5, padding: "10px 16px",
              overflowX: "auto", flexShrink: 0,
              borderBottom: `1px solid ${b2bMode ? "rgba(59,130,246,0.1)" : "var(--vi-border)"}`,
              scrollbarWidth: "none",
            }}>
              {catList.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  style={{
                    whiteSpace: "nowrap", padding: "5px 10px", borderRadius: "var(--vi-radius-sm)", cursor: "pointer",
                    fontSize: 11, fontWeight: 600,
                    border: activeCat === c.id
                      ? `1px solid ${b2bMode ? "rgba(59,130,246,0.5)" : "rgba(201,162,39,0.5)"}`
                      : "1px solid var(--vi-border)",
                    background: activeCat === c.id
                      ? (b2bMode ? "rgba(59,130,246,0.12)" : "rgba(201,162,39,0.12)")
                      : "var(--vi-surface)",
                    color: activeCat === c.id ? accentColor : "#4a6a8a",
                    transition: `all var(--vi-dur-fast) var(--vi-ease)`,
                  }}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 16px" }}>
            {/* Suggestions when no query */}
            {!query && activeCat === "all" && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#3a5a7a", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {b2bMode ? "Domande professionali" : "Domande frequenti"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {suggested.map(s => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      style={{
                        padding: "5px 10px", borderRadius: "var(--vi-radius-sm)",
                        background: "var(--vi-surface)",
                        border: `1px solid ${b2bMode ? "rgba(59,130,246,0.2)" : "var(--vi-border)"}`,
                        color: accentColor, fontSize: 11, cursor: "pointer",
                        transition: `all var(--vi-dur-fast) var(--vi-ease)`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = b2bMode ? "rgba(59,130,246,0.1)" : "rgba(30,58,95,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--vi-surface)"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ list */}
            {results.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {query && (
                  <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 4 }}>
                    {results.length} risultat{results.length === 1 ? "o" : "i"} per "{query}"
                  </div>
                )}
                {results.map((item, i) => (
                  <FAQItem key={item.id} item={item} defaultOpen={query.trim() && i === 0} b2bMode={b2bMode} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🤔</div>
                <div style={{ fontSize: 13, color: "#3a5a7a", marginBottom: 16 }}>
                  Non ho trovato una risposta per "{query}".
                </div>
                {!b2bMode && (
                  <button
                    onClick={handleAskAI}
                    className="vi-btn"
                    style={{ padding: "10px 20px", fontSize: 13 }}
                  >
                    🤖 Chiedi all'AI Advisor →
                  </button>
                )}
              </div>
            )}

            {/* B2B: expert contact CTA */}
            {b2bMode && (
              <div style={{
                marginTop: 14, padding: "16px",
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "var(--vi-radius-md)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", marginBottom: 6 }}>
                  Hai bisogno di supporto dedicato?
                </div>
                <div style={{ fontSize: 11, color: "#4a6a8a", marginBottom: 12, lineHeight: 1.6 }}>
                  Il nostro team di esperti risponde entro 24h per clienti professional e istituzionali.
                </div>
                <a
                  href="mailto:sales@vinoinvest.com?subject=Richiesta%20supporto%20B2B"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "9px 16px", borderRadius: "var(--vi-radius-sm)",
                    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                    border: "none", color: "#fff", cursor: "pointer",
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                    transition: `transform var(--vi-dur) var(--vi-ease)`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  ✉️ Parla con un esperto → sales@vinoinvest.com
                </a>
                <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
                  <a href="mailto:legal@vinoinvest.com?subject=DPA%20Request" style={{ fontSize: 10, color: "#3a5a7a", textDecoration: "none" }}>
                    ⚖️ legal@vinoinvest.com
                  </a>
                  <span style={{ color: "#1e293b" }}>·</span>
                  <a href="/b2b" style={{ fontSize: 10, color: "#60a5fa", textDecoration: "none" }}>
                    Scopri i piani B2B →
                  </a>
                </div>
              </div>
            )}

            {/* B2C: Ask AI shortcut */}
            {!b2bMode && query.trim() && results.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--vi-border)" }}>
                <button
                  onClick={handleAskAI}
                  style={{
                    width: "100%", padding: "10px 16px", borderRadius: "var(--vi-radius-sm)",
                    background: "var(--vi-surface)", border: "1px solid rgba(30,58,95,0.5)",
                    color: "#60a5fa", cursor: "pointer", fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: `all var(--vi-dur) var(--vi-ease)`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(30,58,95,0.3)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--vi-surface)"; e.currentTarget.style.borderColor = "rgba(30,58,95,0.5)"; }}
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
