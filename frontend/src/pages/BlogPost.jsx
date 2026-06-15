import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`${API}/api/blog/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error("Articolo non trovato");
        return r.json();
      })
      .then(data => { setPost(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#C9A227", fontSize: 14 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #3a5a7a", borderTopColor: "#C9A227", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
          Caricamento articolo...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, color: "#e2e8f0", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ fontSize: 40 }}>🍷</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: "#f1f5f9", margin: 0 }}>Articolo non trovato</h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>{error || "Questo articolo non è disponibile."}</p>
        <Link to="/blog" style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid rgba(201,162,39,0.4)", color: "#C9A227", textDecoration: "none", fontSize: 13 }}>
          ← Tutti gli articoli
        </Link>
      </div>
    );
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Helmet>
        <title>{post.title} | VinoInvest Blog</title>
        <meta name="description" content={post.excerpt || ""} />
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,162,39,0.15)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, background: "rgba(11,18,32,0.95)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <button
          onClick={() => navigate("/blog")}
          style={{ background: "transparent", border: "1px solid rgba(201,162,39,0.3)", color: "#C9A227", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", flexShrink: 0 }}
        >
          ← Blog
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: "#C9A227", flexShrink: 0 }}>VinoInvest</span>
          <span style={{ color: "rgba(201,162,39,0.4)", fontSize: 14 }}>/</span>
          <Link to="/blog" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 13, flexShrink: 0 }}>Blog</Link>
          <span style={{ color: "rgba(201,162,39,0.4)", fontSize: 14 }}>/</span>
          <span style={{ color: "#64748b", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "52px 24px 80px" }}>
        {/* Category + read time */}
        {(post.category || post.readTime || post.read_time) && (
          <div style={{ fontSize: 11, color: "#C9A227", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
            {post.category && <span>{post.category}</span>}
            {(post.category && (post.readTime || post.read_time)) && <span style={{ margin: "0 8px", color: "rgba(201,162,39,0.3)" }}>·</span>}
            {(post.readTime || post.read_time) && <span>{post.readTime || post.read_time} lettura</span>}
          </div>
        )}

        {/* Title */}
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.25, margin: "0 0 16px", color: "#f1f5f9" }}>
          {post.title}
        </h1>

        {/* Author + date */}
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 28, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span>{post.author || "VinoInvest AI"}</span>
          {publishedDate && (
            <>
              <span style={{ color: "rgba(100,116,139,0.4)" }}>·</span>
              <span>{publishedDate}</span>
            </>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div style={{ borderLeft: "3px solid #C9A227", paddingLeft: 18, marginBottom: 32, color: "#94a3b8", fontSize: 15, fontStyle: "italic", lineHeight: 1.7 }}>
            {post.excerpt}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(201,162,39,0.12)", marginBottom: 32 }} />

        {/* Content */}
        <div style={{ fontSize: 15, lineHeight: 1.85, color: "#cbd5e1" }}>
          {(post.content || "").split("\n\n").map((para, i) => {
            if (!para.trim()) return null;
            // Detect headings (lines that start with a capital and are short)
            if (para.length < 100 && !para.includes(".") && para === para.trimStart()) {
              return (
                <h2 key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "36px 0 14px" }}>
                  {para.trim()}
                </h2>
              );
            }
            return <p key={i} style={{ marginBottom: 20 }}>{para.trim()}</p>;
          })}
        </div>

        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(30,41,59,0.5)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Fonti</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {post.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#C9A227")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
                  >
                    ↗ {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 48, padding: "28px 32px", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 14, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#C9A227", fontWeight: 700, marginBottom: 8 }}>Inizia a investire nel vino</p>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Analizza oltre 10.000 vini con AI Score, storico prezzi e dati Liv-ex in tempo reale.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/")}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#C9A227", color: "#0b1220", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Esplora il Mercato →
            </button>
            <Link
              to="/blog"
              style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(201,162,39,0.3)", color: "#C9A227", fontSize: 14, textDecoration: "none", display: "inline-block", lineHeight: "1.4" }}
            >
              ← Tutti gli articoli
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
