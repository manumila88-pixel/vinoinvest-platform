import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GOLD = "#C9A227";
const WINE = "#d97706";
const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

function scoreColor(s) {
  if (!s) return "#64748b";
  return s >= 96 ? "#4ade80" : s >= 88 ? GOLD : "#94a3b8";
}
function fmtPrice(w) {
  const p = Number(w.currentPrice ?? w.current_price ?? 0);
  return p ? `€${p.toLocaleString("it-IT")}` : "—";
}

export default function WineryDashboard() {
  const navigate = useNavigate();
  const [producerName, setProducerName] = useState("");
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ count: 0, avgScore: 0, avgPrice: 0, vintages: 0 });

  // Load producer name from Supabase user metadata
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.organization_name
        || user?.user_metadata?.winery_name
        || localStorage.getItem("vino_org_name")
        || "";
      setProducerName(name);
    });
  }, []);

  // Load wines by producer
  useEffect(() => {
    if (!producerName) { setLoading(false); return; }
    setLoading(true);
    const qs = new URLSearchParams({ producer: producerName, limit: 50, sort: "vintage" });
    fetch(`${API}/api/wines?${qs}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list = d.results || d.wines || [];
        setWines(list);
        if (list.length) {
          const scores = list.map(w => Number(w.investmentScore ?? w.investment_score ?? 0)).filter(Boolean);
          const prices = list.map(w => Number(w.currentPrice ?? w.current_price ?? 0)).filter(Boolean);
          const vintages = new Set(list.map(w => w.vintage).filter(Boolean));
          setStats({
            count: list.length,
            avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0,
            avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b) / prices.length) : 0,
            vintages: vintages.size,
          });
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [producerName]);

  if (!producerName && !loading) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍾</div>
        <h2 style={{ color: "#fff", marginBottom: 12 }}>Configura il tuo profilo cantina</h2>
        <p style={{ marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
          Per visualizzare i tuoi vini sul catalogo, inserisci il nome della tua cantina nel profilo.
        </p>
        <button
          onClick={() => navigate("/winery/profile")}
          style={{ background: WINE, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, color: "#fff", cursor: "pointer", fontSize: 14 }}
        >
          Configura profilo →
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 0 0" }}>

      {/* ── Hero cantina ─────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, rgba(217,119,6,0.12) 0%, rgba(201,162,39,0.06) 60%), #16203200`, border: `1px solid rgba(217,119,6,0.25)`, borderRadius: 20, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(217,119,6,0.06)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(217,119,6,0.18)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: `1px solid rgba(217,119,6,0.35)` }}>🏡</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: WINE, textTransform: "uppercase", marginBottom: 2 }}>CANTINA · VinoInvest</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>{producerName || "La mia Cantina"}</h1>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => navigate("/winery/profile")} style={{ background: "rgba(217,119,6,0.12)", border: `1px solid rgba(217,119,6,0.3)`, borderRadius: 8, padding: "7px 14px", color: WINE, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              👤 Profilo
            </button>
            <button onClick={() => navigate("/winery/vintage-story")} style={{ background: "rgba(201,162,39,0.12)", border: `1px solid rgba(201,162,39,0.3)`, borderRadius: 8, padding: "7px 14px", color: GOLD, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
              📖 Racconto annata
            </button>
          </div>
        </div>
        <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, maxWidth: 600 }}>
          Gestisci la tua presenza su VinoInvest: i tuoi vini, le tue annate, il tuo racconto. I dati di AI Score e prezzi sono quelli del mercato reale — non modificabili.
        </p>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <section className="statsGrid" style={{ marginBottom: 24 }}>
        {[
          { label: "Vini nel catalogo",  value: stats.count,                 color: WINE },
          { label: "Annate uniche",      value: stats.vintages,               color: GOLD },
          { label: "AI Score medio",     value: stats.avgScore || "—",        color: stats.avgScore >= 90 ? "#4ade80" : GOLD },
          { label: "Prezzo medio",       value: stats.avgPrice ? `€${stats.avgPrice.toLocaleString("it-IT")}` : "—", color: "#60a5fa" },
        ].map((s, i) => (
          <div key={i} className="statCard" style={{ borderTop: `2px solid ${s.color}33` }}>
            <small>{s.label}</small>
            <h2 style={{ color: s.color }}>{s.value}</h2>
          </div>
        ))}
      </section>

      {/* ── Quick actions ────────────────────────────────────────────── */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { icon: "📖", title: "Racconto Annata",   desc: "Scrivi la storia delle tue annate",   href: "/winery/vintage-story", accent: GOLD },
          { icon: "👤", title: "Profilo Cantina",   desc: "Informazioni visibili agli investitori", href: "/winery/profile", accent: WINE },
          { icon: "🔍", title: "Vedi come investitore", desc: "Come appare la tua cantina",       href: `/cantina/${encodeURIComponent(producerName)}`, accent: "#60a5fa" },
          { icon: "🌍", title: "Mercato Globale",   desc: "50k+ vini e prezzi in tempo reale",   href: null, isTab: "market", accent: "#94a3b8" },
        ].map((a) => (
          <button key={a.title}
            onClick={() => a.href ? navigate(a.href) : null}
            style={{ background: `${a.accent}08`, border: `1px solid ${a.accent}22`, borderRadius: 12, padding: "16px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${a.accent}14`; e.currentTarget.style.borderColor = `${a.accent}44`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${a.accent}08`; e.currentTarget.style.borderColor = `${a.accent}22`; }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: a.accent, marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>{a.desc}</div>
          </button>
        ))}
      </section>

      {/* ── I miei vini ─────────────────────────────────────────────── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>
            🍷 I miei vini nel catalogo
            {wines.length > 0 && <span style={{ marginLeft: 8, fontSize: 12, color: "#64748b", fontWeight: 400 }}>{wines.length} vini trovati</span>}
          </h2>
          {producerName && (
            <a href={`/market/producers/${encodeURIComponent(producerName)}`} style={{ fontSize: 12, color: WINE, textDecoration: "none", fontWeight: 600 }}>
              Vedi tutto sul mercato →
            </a>
          )}
        </div>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 120, background: "#1a2535", borderRadius: 12, animation: "pulse 1.4s ease-in-out infinite" }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "24px", color: "#64748b", textAlign: "center", background: "#1a2535", borderRadius: 12 }}>
            Impossibile caricare i vini. Verifica che il nome cantina nel profilo corrisponda ai dati del catalogo.
          </div>
        )}

        {!loading && !error && wines.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", background: "#1a2535", borderRadius: 12 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ color: "#94a3b8", marginBottom: 16 }}>Nessun vino trovato per "{producerName}"</div>
            <div style={{ fontSize: 12, color: "#64748b", maxWidth: 400, margin: "0 auto" }}>
              Il nome cantina nel profilo deve corrispondere esattamente al campo "produttore" nel catalogo.
              Contattaci per aggiungere o correggere i tuoi vini.
            </div>
          </div>
        )}

        {!loading && !error && wines.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {wines.map(w => <WineryWineCard key={w.id} wine={w} />)}
          </div>
        )}
      </section>

      {/* ── Nota dati ──────────────────────────────────────────────── */}
      <div style={{ marginTop: 24, padding: "10px 16px", background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", borderRadius: 8, fontSize: 11, color: "#78716c", lineHeight: 1.6 }}>
        🔒 <strong style={{ color: WINE }}>Dati di mercato intoccabili</strong> — AI Score e prezzi provengono da fonti di mercato indipendenti (Liv-ex, Wine-Searcher, algoritmo VinoInvest). Non sono modificabili dalla cantina, garantendo l'affidabilità per gli investitori.
      </div>
    </div>
  );
}

function WineryWineCard({ wine }) {
  const score = Number(wine.investmentScore ?? wine.investment_score ?? 0) || null;
  return (
    <div style={{ background: "#1a2535", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, flex: 1 }}>{wine.name}</div>
        {score && (
          <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: `${scoreColor(score)}18`, border: `1px solid ${scoreColor(score)}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(score) }}>{score}</span>
            <span style={{ fontSize: 6, color: "#64748b" }}>AI</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, color: "#64748b" }}>{wine.vintage || "—"} · {wine.region || wine.country || ""}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>{fmtPrice(wine)}</span>
        <span style={{ fontSize: 10, color: wine.risk === "basso" || wine.risk === "low" ? "#4ade80" : wine.risk === "alto" || wine.risk === "high" ? "#f87171" : "#f59e0b", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
          {wine.risk || "—"}
        </span>
      </div>
    </div>
  );
}
