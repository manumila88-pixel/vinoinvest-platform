import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { marked } from "marked";
import { BLOG_MANIFEST } from "../data/blogManifest.js";

const GOLD = "#C9A227";
const BASE = "https://vinoinvest-platform.vercel.app";

// Configure marked: no HTML pass-through, GFM enabled
marked.setOptions({ gfm: true, breaks: false });
const renderer = new marked.Renderer();
// Open external links in new tab; keep internal links as-is
renderer.link = ({ href, text }) => {
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
  const attrs = isExternal ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a href="${href}"${attrs}>${text}</a>`;
};
marked.use({ renderer });

// ── Strip YAML frontmatter from raw .md ───────────────────────────────────────
function stripFrontmatter(raw) {
  return raw.replace(/^---[\s\S]*?---\n?/, "");
}

// ── Related posts (same category, excluding self) ─────────────────────────────
function relatedPosts(current, n = 3) {
  return BLOG_MANIFEST
    .filter(p => p.slug !== current.slug && p.category === current.category)
    .slice(0, n);
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const meta = BLOG_MANIFEST.find(p => p.slug === slug);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setHtml(null);
    window.scrollTo(0, 0);
    fetch(`/blog/${slug}.md`)
      .then(r => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      })
      .then(raw => {
        const body = stripFrontmatter(raw);
        setHtml(marked.parse(body));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const related = meta ? relatedPosts(meta) : [];

  const schemaOrg = meta ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "description": meta.meta_description,
    "author": { "@type": "Organization", "name": "VinoInvest" },
    "publisher": {
      "@type": "Organization",
      "name": "VinoInvest",
      "url": BASE,
      "logo": { "@type": "ImageObject", "url": `${BASE}/favicon.ico` },
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/blog/${slug}` },
    "keywords": (meta.keywords || []).join(", "),
    "articleSection": meta.category,
    "url": `${BASE}/blog/${slug}`,
  }) : null;

  return (
    <>
      {meta && (
        <Helmet>
          <title>{meta.title} | VinoInvest Blog</title>
          <meta name="description" content={meta.meta_description} />
          <meta name="keywords" content={(meta.keywords || []).join(", ")} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.meta_description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`${BASE}/blog/${slug}`} />
          <meta property="og:site_name" content="VinoInvest" />
          <link rel="canonical" href={`${BASE}/blog/${slug}`} />
          {schemaOrg && <script type="application/ld+json">{schemaOrg}</script>}
        </Helmet>
      )}

      <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>

        {/* ── Breadcrumb / Back ──────────────────────────────────── */}
        <div style={{ borderBottom: "1px solid rgba(201,162,39,0.12)", padding: "14px 24px" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => navigate("/")}
              style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              VinoInvest
            </button>
            <span style={{ color: "#334155" }}>›</span>
            <button onClick={() => navigate("/blog")}
              style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              Blog
            </button>
            {meta && <>
              <span style={{ color: "#334155" }}>›</span>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{meta.category}</span>
            </>}
          </div>
        </div>

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 72px" }}>

          {/* ── Loading ───────────────────────────────────────────── */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "pulse 1.4s ease-in-out infinite" }}>
              <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.7}}`}</style>
              <div style={{ height: 40, background: "#1a2535", borderRadius: 8, width: "70%" }} />
              <div style={{ height: 18, background: "#1a2535", borderRadius: 6, width: "90%" }} />
              <div style={{ height: 18, background: "#1a2535", borderRadius: 6, width: "80%" }} />
            </div>
          )}

          {/* ── Error ────────────────────────────────────────────── */}
          {error && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
              <h2 style={{ color: "#e2e8f0", marginBottom: 12 }}>Articolo non trovato</h2>
              <button onClick={() => navigate("/blog")}
                style={{ background: GOLD, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                ← Torna al blog
              </button>
            </div>
          )}

          {/* ── Article ──────────────────────────────────────────── */}
          {!loading && !error && html && (
            <>
              {/* Meta chips */}
              {meta && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, background: "rgba(201,162,39,0.12)", borderRadius: 5, padding: "3px 9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {meta.category}
                  </span>
                  <span style={{ fontSize: 11, color: "#475569" }}>·</span>
                  <span style={{ fontSize: 11, color: "#475569" }}>{meta.reading_time}</span>
                  {meta.audience !== "both" && (
                    <>
                      <span style={{ fontSize: 11, color: "#475569" }}>·</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: meta.audience === "b2b" ? "#60a5fa" : GOLD,
                        background: meta.audience === "b2b" ? "rgba(96,165,250,0.1)" : "rgba(201,162,39,0.1)",
                        borderRadius: 5, padding: "3px 9px", textTransform: "uppercase", letterSpacing: "0.06em",
                      }}>
                        {meta.audience === "b2b" ? "PRO" : "Investitore"}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Article body */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.85,
                  fontSize: 16,
                }}
              />

              {/* CTA */}
              <div style={{ marginTop: 40, background: "linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.04) 100%)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 16, padding: "24px 28px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>
                  Investi nel vino con dati reali
                </div>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px" }}>
                  AI Score, price history e portfolio tracking — tutto su VinoInvest.
                </p>
                <button onClick={() => navigate("/")}
                  style={{ background: GOLD, border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                  Scopri la piattaforma →
                </button>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <section style={{ marginTop: 40 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Articoli correlati
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {related.map(r => (
                      <button key={r.slug} onClick={() => navigate(`/blog/${r.slug}`)}
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{r.reading_time}</div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Back */}
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => navigate("/blog")}
                  style={{ background: "none", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, padding: "8px 16px", color: GOLD, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  ← Tutti gli articoli
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
