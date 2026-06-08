import React, { useState, useEffect, useRef, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

const STATIC_COMMANDS = [
  { id: "home", label: "Home — Dashboard vini", icon: "🏠", action: () => { window.location.href = "/"; } },
  { id: "pricing", label: "Prezzi e piani", icon: "💎", action: () => { window.location.href = "/pricing"; } },
  { id: "b2b", label: "Soluzioni B2B", icon: "🏢", action: () => { window.location.href = "/b2b"; } },
  { id: "org", label: "Dashboard Organizzazione", icon: "📊", action: () => { window.location.href = "/org-dashboard"; } },
  { id: "cellar", label: "La mia Cantina", icon: "🍾", action: () => { window.location.href = "/cellar"; } },
  { id: "journal", label: "Diario Degustazioni", icon: "📔", action: () => { window.location.href = "/journal"; } },
  { id: "goals", label: "Obiettivi Investimento", icon: "🎯", action: () => { window.location.href = "/goals"; } },
  { id: "market", label: "Market Index", icon: "📈", action: () => { window.location.href = "/market-index"; } },
  { id: "intelligence", label: "Market Intelligence B2B", icon: "🔬", action: () => { window.location.href = "/market-intelligence"; } },
  { id: "en-primeur", label: "En Primeur", icon: "🏰", action: () => { window.location.href = "/en-primeur"; } },
  { id: "auctions", label: "Tracker Aste", icon: "🔨", action: () => { window.location.href = "/auctions"; } },
  { id: "learn", label: "Wine Academy", icon: "🎓", action: () => { window.location.href = "/learn"; } },
  { id: "metodologia", label: "Metodologia AI Score", icon: "🧠", action: () => { window.location.href = "/metodologia"; } },
  { id: "glossario", label: "Glossario Wine Investment", icon: "📚", action: () => { window.location.href = "/glossario"; } },
  { id: "about", label: "Chi siamo", icon: "ℹ️", action: () => { window.location.href = "/about"; } },
  { id: "press", label: "Press Kit", icon: "📰", action: () => { window.location.href = "/press"; } },
  { id: "transparency", label: "Trasparenza dati", icon: "🔍", action: () => { window.location.href = "/transparency"; } },
  { id: "data", label: "Download Dataset", icon: "⬇️", action: () => { window.location.href = "/data"; } },
  { id: "security", label: "Security & Bug Bounty", icon: "🔒", action: () => { window.location.href = "/security"; } },
];

export default function CommandPalette({ onSelectWine }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setWines([]);
      setSelected(0);
    }
  }, [open]);

  const search = useCallback(async (q) => {
    if (!q || q.length < 2) { setWines([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/wines?search=${encodeURIComponent(q)}&limit=5`);
      if (r.ok) {
        const d = await r.json();
        setWines((d.wines || d.results || []).slice(0, 5));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const filtered = query
    ? STATIC_COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : STATIC_COMMANDS;

  const allItems = [
    ...wines.map(w => ({ id: `wine:${w.id}`, label: `${w.name}${w.vintage ? ` ${w.vintage}` : ""}`, sub: w.producer || w.region, icon: "🍷", isWine: true, wine: w })),
    ...filtered.slice(0, query ? 5 : 8),
  ];

  const navigate = useCallback((dir) => {
    setSelected(s => Math.max(0, Math.min(allItems.length - 1, s + dir)));
  }, [allItems.length]);

  const execute = useCallback((item) => {
    if (!item) return;
    setOpen(false);
    if (item.isWine && onSelectWine) { onSelectWine(item.wine); return; }
    if (item.action) item.action();
  }, [onSelectWine]);

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); navigate(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); navigate(-1); }
      if (e.key === "Enter") { e.preventDefault(); execute(allItems[selected]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, navigate, execute, allItems, selected]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "15vh",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          width: "100%", maxWidth: 560,
          background: "#0b1220", border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{loading ? "⏳" : "🔍"}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Cerca vino, pagina o azione... (⌘K)"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 15, color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif",
              caretColor: "#60a5fa",
            }}
          />
          <kbd style={{ padding: "2px 6px", borderRadius: 5, fontSize: 10, color: "#334155", border: "1px solid rgba(59,130,246,0.15)", background: "rgba(4,8,20,0.6)" }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {wines.length > 0 && (
            <div style={{ padding: "8px 0 4px", borderBottom: "1px solid rgba(59,130,246,0.06)" }}>
              <div style={{ padding: "4px 18px 4px", fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em" }}>VINI</div>
            </div>
          )}
          {allItems.length === 0 ? (
            <div style={{ padding: "24px 18px", textAlign: "center", color: "#334155", fontSize: 13 }}>
              Nessun risultato per "{query}"
            </div>
          ) : (
            allItems.map((item, i) => (
              <button
                key={item.id}
                onClick={() => execute(item)}
                style={{
                  width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 18px", border: "none", cursor: "pointer", fontFamily: "'Inter',Arial,sans-serif",
                  background: i === selected ? "rgba(59,130,246,0.12)" : "transparent",
                  color: "#e2e8f0", transition: "background 0.1s",
                  borderLeft: i === selected ? "2px solid #2563eb" : "2px solid transparent",
                }}
                onMouseEnter={() => setSelected(i)}
              >
                <span style={{ fontSize: 16, flexShrink: 0, width: 24, textAlign: "center" }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.label}
                  </div>
                  {item.sub && <div style={{ fontSize: 11, color: "#3a5a7a" }}>{item.sub}</div>}
                </div>
                {item.isWine && (
                  <span style={{ fontSize: 11, color: "#334155", flexShrink: 0 }}>Apri →</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "8px 18px", borderTop: "1px solid rgba(59,130,246,0.08)", display: "flex", gap: 16, fontSize: 10, color: "#1e3a5f" }}>
          <span><kbd style={{ fontFamily: "monospace" }}>↑↓</kbd> naviga</span>
          <span><kbd style={{ fontFamily: "monospace" }}>↵</kbd> seleziona</span>
          <span><kbd style={{ fontFamily: "monospace" }}>ESC</kbd> chiudi</span>
          <span style={{ marginLeft: "auto" }}>⌘K per riaprire</span>
        </div>
      </div>
    </div>
  );
}
