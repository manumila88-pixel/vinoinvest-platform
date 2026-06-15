import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_MANIFEST, BLOG_CATEGORIES } from "../data/blogManifest.js";

const GOLD = "#C9A227";
const WINE = "#7c2d12";

const AUDIENCE_LABELS = { b2c: "Investitore", b2b: "Professionale", both: "Tutti" };
const AUDIENCE_COLORS = { b2c: GOLD, b2b: "#60a5fa", both: "#94a3b8" };

const CATEGORY_ICONS = {
  Strategia: "🎯", Principianti: "🌱", Bordeaux: "🏰", Borgogna: "🍇",
  "En Primeur": "📋", Annate: "📅", Conservazione: "🌡️", Italia: "🇮🇹",
  Champagne: "🥂", Rischi: "⚠️", Fiscalità: "📊", Tecnico: "🔬",
  Mercato: "📈", Confronti: "⚖️", Tendenze: "🌐", Uscita: "🚪",
  Regioni: "🗺️", Analisi: "🔍", default: "📝",
};

function catIcon(c) { return CATEGORY_ICONS[c] || CATEGORY_ICONS.default; }

function slugToDisplay(s) {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ── BlogCard ──────────────────────────────────────────────────────────────────
function BlogCard({ post, onClick }) {
  const [hover, setHover] = useState(false);
  const icon = catIcon(post.category);
  const acol = AUDIENCE_COLORS[post.audience];

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(201,162,39,0.05)" : "#151e2d",
        border: `1px solid ${hover ? "rgba(201,162,39,0.35)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        padding: "20px 22px",
        cursor: "pointer",
        transition: "all 0.18s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: acol,
          background: `${acol}14`, borderRadius: 5, padding: "2px 8px",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {AUDIENCE_LABELS[post.audience]}
        </span>
        <span style={{ fontSize: 10, color: "#475569" }}>{post.reading_time}</span>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", margin: 0, lineHeight: 1.4 }}>
        {icon} {post.title}
      </h2>

      <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6, flex: 1 }}>
        {post.meta_description}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#475569",
          background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 8px",
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {post.category}
        </span>
        <span style={{ fontSize: 11, color: hover ? GOLD : "#3a5a7a", fontWeight: 600, transition: "color 0.18s" }}>
          Leggi →
        </span>
      </div>
    </article>
  );
}

// ── BlogIndex ─────────────────────────────────────────────────────────────────
export default function BlogIndex() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Tutti");
  const [audienceFilter, setAudienceFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return BLOG_MANIFEST.filter(p => {
      if (catFilter !== "Tutti" && p.category !== catFilter) return false;
      if (audienceFilter === "b2c" && p.audience === "b2b") return false;
      if (audienceFilter === "b2b" && p.audience === "b2c") return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.meta_description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q))
      );
    });
  }, [search, catFilter, audienceFilter]);

  const schemaOrg = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "VinoInvest Blog — Investimento nel Vino Fine",
    "description": "Guide, analisi e strategie per investire nel vino fine.",
    "url": "https://vinoinvest-platform.vercel.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "VinoInvest",
      "url": "https://vinoinvest-platform.vercel.app",
    },
  });

  return (
    <>
      <Helmet>
        <title>Blog — Investimento nel Vino Fine | VinoInvest</title>
        <meta name="description" content="Guide complete, analisi di mercato e strategie per investire nel vino fine. 99 articoli curati dal team editoriale di VinoInvest." />
        <meta property="og:title" content="Blog — Investimento nel Vino Fine | VinoInvest" />
        <meta property="og:description" content="Guide, analisi e strategie per investire nel vino fine." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/blog" />
        <script type="application/ld+json">{schemaOrg}</script>
      </Helmet>

      <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header style={{
          background: `linear-gradient(135deg, rgba(124,45,18,0.18) 0%, rgba(201,162,39,0.08) 50%, #0b1220 100%)`,
          borderBottom: "1px solid rgba(201,162,39,0.2)",
          padding: "40px 24px 32px",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
              VINOINVEST · BLOG
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 12px", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Investimento nel Vino Fine
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15, margin: "0 0 24px", maxWidth: 600 }}>
              {BLOG_MANIFEST.length} articoli curati: guide, analisi di mercato, fiscalità e strategie per investitori individuali e professionali.
            </p>

            {/* ── Search ──────────────────────────────────────────── */}
            <div style={{ position: "relative", maxWidth: 480 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca articoli, categorie, parole chiave…"
                aria-label="Cerca articoli del blog"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.25)",
                  borderRadius: 10, padding: "11px 16px 11px 40px",
                  color: "#e2e8f0", fontSize: 14, fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569" }}>🔍</span>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 60px" }}>

          {/* ── Filters ───────────────────────────────────────────── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {/* Audience filter */}
            {[
              { key: "all",  label: "Tutti gli articoli" },
              { key: "b2c",  label: "👤 Investitore individuale" },
              { key: "b2b",  label: "💎 Professionale / B2B" },
            ].map(a => (
              <button key={a.key} onClick={() => setAudienceFilter(a.key)}
                style={{
                  background: audienceFilter === a.key ? "rgba(201,162,39,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${audienceFilter === a.key ? "rgba(201,162,39,0.5)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                  color: audienceFilter === a.key ? GOLD : "#64748b",
                  fontWeight: audienceFilter === a.key ? 700 : 400, fontSize: 12,
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
              >{a.label}</button>
            ))}
          </div>

          {/* ── Category chips ────────────────────────────────────── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
            {["Tutti", ...BLOG_CATEGORIES].map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                style={{
                  background: catFilter === c ? `rgba(201,162,39,0.14)` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${catFilter === c ? "rgba(201,162,39,0.4)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 20, padding: "4px 12px", cursor: "pointer",
                  color: catFilter === c ? GOLD : "#475569",
                  fontWeight: catFilter === c ? 700 : 400, fontSize: 11,
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
              >{catIcon(c !== "Tutti" ? c : "")} {c}</button>
            ))}
          </div>

          {/* ── Results count ────────────────────────────────────── */}
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>
            {filtered.length} articol{filtered.length === 1 ? "o" : "i"}
            {catFilter !== "Tutti" && ` in "${catFilter}"`}
            {search && ` per "${search}"`}
          </div>

          {/* ── Grid ─────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#475569" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div>Nessun articolo trovato. Prova una ricerca diversa.</div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}>
              {filtered.map(post => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
