import React, { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DeepDiveSection — albero di sotto-slide espandibili + "Vedi sul mercato" live.
//
// Performance contract:
//  1. Il modulo dati del corso (migliaia di parole) è in un chunk DINAMICO,
//     importato SOLO quando la sezione si avvicina al viewport (IntersectionObserver).
//  2. Il body di ogni sotto-slide viene montato nel DOM SOLO all'apertura.
//  3. Il blocco "Vedi sul mercato" interroga il DB solo per la tab attiva, e solo
//     quando la sezione è visibile.
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = "#C9A227";
const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// Registry: courseId → dynamic import of its deep-dive module.
// Each module's default export maps lessonId → deep-dive object.
const COURSE_DEEP_DIVE = {
  1: () => import("../data/courseDeepDive/course1.js"),
};

// Color accent per branch "kind"
const KIND_ACCENT = {
  "Come si fa": "#60a5fa",
  "Quando applicare": "#4ade80",
  "Quando NON applicare": "#f87171",
  "Rischi": "#fb923c",
  "Eccezioni": "#a78bfa",
  "Casi reali": "#22d3ee",
  "Domande dell'investitore": GOLD,
};
function accentFor(kind) { return KIND_ACCENT[kind] || GOLD; }

// ── localStorage helper to remember "read" branches (light gamification) ──────
const READ_KEY = "vino_academy_deepdive_read";
function loadRead() { try { return JSON.parse(localStorage.getItem(READ_KEY) || "{}"); } catch { return {}; } }
function saveRead(m) { try { localStorage.setItem(READ_KEY, JSON.stringify(m)); } catch {} }

export default function DeepDiveSection({ courseId, lessonId }) {
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // Lazy-trigger import only when section nears viewport
  useEffect(() => {
    if (visible) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  // Load the (code-split) course module once visible
  useEffect(() => {
    if (!visible || data) return;
    const loader = COURSE_DEEP_DIVE[courseId];
    if (!loader) { setError(true); return; }
    let alive = true;
    loader()
      .then((mod) => {
        const map = mod.default || mod;
        const lesson = map?.[lessonId];
        if (alive) { if (lesson) setData(lesson); else setError(true); }
      })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [visible, data, courseId, lessonId]);

  // Nothing to show for this lesson — render nothing (no layout shift)
  if (error) return null;

  return (
    <div ref={rootRef}>
      {!data ? (
        <DeepDiveSkeleton />
      ) : (
        <>
          <ConceptCard concept={data.concept} />
          <BranchTree branches={data.branches || []} lessonId={lessonId} />
          {data.market && <MarketBlock market={data.market} visible={visible} />}
        </>
      )}
    </div>
  );
}

// ── Skeleton while the chunk loads ────────────────────────────────────────────
function DeepDiveSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
      <div style={{ height: 120, background: "#141d2e", borderRadius: 16, animation: "pulse 1.4s ease-in-out infinite" }} />
      {[0, 1, 2].map(i => (
        <div key={i} style={{ height: 56, background: "#141d2e", borderRadius: 12, opacity: 1 - i * 0.18 }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:.5}50%{opacity:.9}}`}</style>
    </div>
  );
}

// ── CONCEPT (la slide principale: il concetto chiaro) ─────────────────────────
function ConceptCard({ concept }) {
  if (!concept) return null;
  const paras = Array.isArray(concept.body) ? concept.body : [concept.body].filter(Boolean);
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.14) 0%, #16203200 60%), #1a2535", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 20, padding: "32px 30px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(201,162,39,0.06)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, position: "relative" }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}>{concept.icon || "💡"}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: GOLD, marginBottom: 4 }}>IL CONCETTO</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.25 }}>{concept.title}</h2>
        </div>
      </div>
      {concept.tagline && (
        <div style={{ fontSize: 15, fontStyle: "italic", color: GOLD, marginBottom: 18, position: "relative", lineHeight: 1.6 }}>{concept.tagline}</div>
      )}
      <div style={{ position: "relative" }}>
        {paras.map((p, i) => (
          <p key={i} style={{ fontSize: 15.5, lineHeight: 1.85, color: "#cbd5e1", marginBottom: 16, fontFamily: "Georgia, serif" }}>{p}</p>
        ))}
      </div>
    </div>
  );
}

// ── BRANCH TREE (sotto-slide espandibili; body montato solo all'apertura) ─────
function BranchTree({ branches, lessonId }) {
  const [openId, setOpenId] = useState(null);
  const [readMap, setReadMap] = useState(loadRead);

  const toggle = useCallback((id) => {
    setOpenId(prev => {
      const next = prev === id ? null : id;
      if (next) {
        setReadMap(m => {
          const key = `${lessonId}:${id}`;
          if (m[key]) return m;
          const nm = { ...m, [key]: true };
          saveRead(nm);
          return nm;
        });
      }
      return next;
    });
  }, [lessonId]);

  if (!branches.length) return null;
  const readCount = branches.filter(b => readMap[`${lessonId}:${b.id}`]).length;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
          🌳 Albero di approfondimento — {branches.length} diramazioni
        </div>
        <div style={{ fontSize: 12, color: "#64748b" }}>{readCount}/{branches.length} esplorate</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {branches.map((b) => {
          const open = openId === b.id;
          const accent = accentFor(b.kind);
          const isRead = !!readMap[`${lessonId}:${b.id}`];
          return (
            <div key={b.id} style={{ background: "#1a2535", border: `1px solid ${open ? `${accent}66` : "rgba(255,255,255,0.06)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
              {/* Header — sempre presente, leggero */}
              <button onClick={() => toggle(b.id)} aria-expanded={open} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}1f`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.icon || "▸"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: accent, textTransform: "uppercase" }}>{b.kind}</span>
                    {isRead && <span style={{ fontSize: 10, color: "#4ade80" }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.35 }}>{b.title}</div>
                  {b.question && !open && (
                    <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.question}</div>
                  )}
                </div>
                <div style={{ fontSize: 18, color: open ? accent : "#475569", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>⌄</div>
              </button>

              {/* Body — montato SOLO all'apertura (lazy) */}
              {open && <BranchBody branch={b} accent={accent} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BranchBody({ branch, accent }) {
  const paras = Array.isArray(branch.paragraphs) ? branch.paragraphs : [branch.paragraphs].filter(Boolean);
  return (
    <div style={{ padding: "4px 22px 22px 70px", borderTop: "1px solid rgba(255,255,255,0.05)", animation: "ddIn 0.25s ease" }}>
      {branch.question && (
        <div style={{ fontSize: 13, color: accent, fontWeight: 600, margin: "14px 0 14px", fontStyle: "italic", lineHeight: 1.6 }}>
          ❝ {branch.question} ❞
        </div>
      )}
      {paras.map((p, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: "#cbd5e1", marginBottom: 14, fontFamily: "Georgia, serif" }}>
          {renderInline(p)}
        </p>
      ))}
      {branch.takeaway && (
        <div style={{ marginTop: 16, background: `${accent}12`, border: `1px solid ${accent}33`, borderRadius: 10, padding: "12px 16px", fontSize: 13.5, color: "#e2e8f0", lineHeight: 1.65 }}>
          <span style={{ fontWeight: 800, color: accent, marginRight: 6 }}>In sintesi:</span>{branch.takeaway}
        </div>
      )}
      <style>{`@keyframes ddIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// Minimal inline markdown: **bold** → React nodes (no innerHTML, no XSS surface).
function renderInline(s) {
  if (typeof s !== "string") return s;
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = /^\*\*([^*]+)\*\*$/.exec(part);
    if (m) return <strong key={i} style={{ color: "#fff" }}>{m[1]}</strong>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ── "VEDI SUL MERCATO" — query live al DB ─────────────────────────────────────
function MarketBlock({ market, visible }) {
  const tabs = market.mode === "tabs" ? (market.tabs || []) : [{ label: "Mercato", params: market.query || {} }];
  const [active, setActive] = useState(0);

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(114,47,55,0.18) 0%, #1a2535 55%)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 18, padding: "26px 24px", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>📡</span>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: GOLD }}>VEDI SUL MERCATO — DATI LIVE</div>
      </div>
      <h3 style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>{market.title}</h3>
      {market.intro && <p style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.7, marginBottom: 18, maxWidth: 720 }}>{market.intro}</p>}

      {tabs.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ background: active === i ? GOLD : "rgba(255,255,255,0.05)", border: `1px solid ${active === i ? GOLD : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: "6px 14px", color: active === i ? "#0b1220" : "#cbd5e1", fontWeight: active === i ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Render only the active tab; each tab fetches lazily on first view */}
      <MarketTab key={active} params={tabs[active]?.params || {}} visible={visible} />
    </div>
  );
}

function MarketTab({ params, visible }) {
  const [state, setState] = useState({ loading: true, wines: [], total: 0, err: false });

  useEffect(() => {
    if (!visible) return;
    let alive = true;
    setState({ loading: true, wines: [], total: 0, err: false });
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") qs.set(k, v); });
    if (!qs.has("limit")) qs.set("limit", "9");
    fetch(`${API}/api/wines?${qs.toString()}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { if (alive) setState({ loading: false, wines: d.results || [], total: d.total || 0, err: false }); })
      .catch(() => { if (alive) setState({ loading: false, wines: [], total: 0, err: true }); });
    return () => { alive = false; };
  }, [params, visible]);

  if (state.loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 104, background: "#141d2e", borderRadius: 12, animation: "pulse 1.4s ease-in-out infinite" }} />
        ))}
        <style>{`@keyframes pulse{0%,100%{opacity:.45}50%{opacity:.85}}`}</style>
      </div>
    );
  }
  if (state.err || !state.wines.length) {
    return <div style={{ color: "#64748b", fontSize: 13, padding: "12px 0" }}>Nessun vino disponibile per questa selezione al momento.</div>;
  }

  const searchHref = params.search ? `/?search=${encodeURIComponent(params.search)}` : "/";

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {state.wines.map((w) => <WineCardMini key={w.id} wine={w} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12, color: "#64748b" }}>
          {state.total > state.wines.length ? `Mostrati ${state.wines.length} di ${state.total} vini reali nel database` : `${state.wines.length} vini dal database`}
        </div>
        <a href={searchHref} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, padding: "7px 14px", color: GOLD, textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
          Esplora sul mercato →
        </a>
      </div>
    </>
  );
}

function fmtPrice(w) {
  const p = Number(w.currentPrice ?? w.current_price ?? 0);
  if (!p) return "—";
  return `€${p.toLocaleString("it-IT")}`;
}
function aiScore(w) { return Number(w.investmentScore ?? w.investment_score ?? w.ai_score ?? 0) || null; }
function scoreColor(s) { return s >= 96 ? "#4ade80" : s >= 90 ? GOLD : "#94a3b8"; }
function riskColor(r) {
  const x = (r || "").toLowerCase();
  if (x.includes("bass") || x.includes("low")) return "#4ade80";
  if (x.includes("alt") || x.includes("high")) return "#f87171";
  return "#f59e0b";
}

function WineCardMini({ wine }) {
  const score = aiScore(wine);
  const region = wine.region || wine.country || "";
  return (
    <div style={{ background: "#0f1828", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 8, minHeight: 104 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, flex: 1 }}>{wine.name}</div>
        {score && (
          <div title="AI Score" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 8, background: `${scoreColor(score)}1f`, border: `1px solid ${scoreColor(score)}55`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(score) }}>{score}</span>
            <span style={{ fontSize: 6, color: "#64748b", marginTop: 1 }}>AI</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: "#64748b" }}>{wine.producer}{wine.vintage ? ` · ${wine.vintage}` : ""}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: GOLD }}>{fmtPrice(wine)}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {region && <span style={{ fontSize: 10, color: "#64748b", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {region}</span>}
          {wine.risk && <span style={{ fontSize: 9.5, fontWeight: 700, color: riskColor(wine.risk), background: `${riskColor(wine.risk)}18`, borderRadius: 6, padding: "2px 6px" }}>{wine.risk}</span>}
        </div>
      </div>
    </div>
  );
}
