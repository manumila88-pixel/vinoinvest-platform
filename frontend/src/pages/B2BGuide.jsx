import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../lib/constants";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const B2B_CATEGORIES = [
  { slug: "investment", label: "Investimento Wine" },
  { slug: "compliance", label: "Compliance & MiFID II" },
  { slug: "portfolio", label: "Portfolio Management" },
  { slug: "analytics", label: "Analytics & Data" },
  { slug: "client-advisory", label: "Client Advisory" },
];

export default function B2BGuide() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API}/api/blog/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${API}/api/blog?persona=wealth_manager&limit=4`)
      .then(r => r.ok ? r.json() : { posts: [] })
      .then(data => setRelated((data.posts || []).filter(p => p.slug !== slug).slice(0, 3)))
      .catch(() => {});
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A227", fontSize: 14 }}>
      Loading guide...
    </div>
  );

  if (!post) return (
    <div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e2e8f0", gap: 16 }}>
      <div style={{ fontSize: 36, color: "#334155" }}>404</div>
      <div style={{ fontSize: 16, color: "#64748b" }}>Guida non trovata.</div>
      <button onClick={() => navigate("/b2b")} style={{ marginTop: 8, background: "#C9A227", border: "none", borderRadius: 10, padding: "10px 24px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
        Torna al B2B Hub
      </button>
    </div>
  );

  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Helmet>
        <title>{post.title} | VinoInvest Professional</title>
        <meta name="description" content={post.excerpt || post.meta_description || post.title} />
        <link rel="canonical" href={`${SITE_URL}/b2b/guide/${slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt || post.meta_description,
          "author": { "@type": "Organization", "name": "VinoInvest" },
          "publisher": { "@type": "Organization", "name": "VinoInvest", "url": SITE_URL },
          "datePublished": post.published_at,
          "url": `${SITE_URL}/b2b/guide/${slug}`,
        })}</script>
      </Helmet>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", fontSize: 18, fontWeight: 800, cursor: "pointer" }}>VinoInvest</button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => navigate("/b2b")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>B2B Hub</button>
          <button onClick={() => navigate("/org-dashboard")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Dashboard</button>
          <button onClick={() => navigate("/pricing")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Professional
          </button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ padding: "20px 24px 0", maxWidth: 800, margin: "0 auto" }}>
        <nav style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", padding: 0, fontSize: 12 }}>Home</button>
          <span>›</span>
          <button onClick={() => navigate("/b2b")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0, fontSize: 12 }}>B2B Professional</button>
          <span>›</span>
          <span style={{ color: "#94a3b8" }}>{post.category || "Guida"}</span>
        </nav>
      </div>

      {/* Article */}
      <article style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Meta */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {post.persona && (
            <span style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#C9A227", fontWeight: 600 }}>
              {post.persona === "wealth_manager" ? "Wealth Manager" : post.persona === "family_office" ? "Family Office" : post.persona}
            </span>
          )}
          {post.category && (
            <span style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#60a5fa", fontWeight: 600 }}>
              {post.category}
            </span>
          )}
          <span style={{ fontSize: 12, color: "#475569" }}>{readTime} min di lettura</span>
          {post.published_at && (
            <span style={{ fontSize: 12, color: "#475569" }}>
              {new Date(post.published_at).toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 24, letterSpacing: -0.5 }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.8, marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid #1e3050" }}>
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div style={{ fontSize: 16, color: "#cbd5e1", lineHeight: 1.9 }}>
          {(post.content || "").split("\n\n").filter(Boolean).map((para, i) => {
            if (para.startsWith("## ")) {
              return <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginTop: 40, marginBottom: 16 }}>{para.replace("## ", "")}</h2>;
            }
            if (para.startsWith("### ")) {
              return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginTop: 28, marginBottom: 12 }}>{para.replace("### ", "")}</h3>;
            }
            if (para.startsWith("- ") || para.startsWith("* ")) {
              return (
                <ul key={i} style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 2 }}>
                  {para.split("\n").filter(l => l.startsWith("- ") || l.startsWith("* ")).map((li, j) => (
                    <li key={j} style={{ color: "#94a3b8", marginBottom: 4 }}>{li.replace(/^[-*] /, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i} style={{ marginBottom: 20, color: "#94a3b8" }}>{para}</p>;
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56, padding: "32px", background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 16, textAlign: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Try VinoInvest Professional free for 30 days</h3>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Multi-client dashboard, institutional risk analytics, white-label PDF reports.
            No credit card required.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/b2b-onboarding")} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "12px 28px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Start free →
            </button>
            <button onClick={() => navigate("/b2b")} style={{ background: "transparent", border: "2px solid #1e3050", borderRadius: 10, padding: "12px 28px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
              View all plans
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 32, padding: "14px 20px", borderRadius: 10, background: "rgba(71,85,105,0.05)", border: "1px solid #1e3050", fontSize: 12, color: "#334155" }}>
          Contenuto a scopo informativo. Non costituisce consulenza finanziaria ai sensi del D.Lgs. 58/1998.
          {" "}<a href="/disclaimer" style={{ color: "#475569" }}>Disclaimer completo →</a>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: "0 24px 80px", maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#f1f5f9" }}>Guide correlate</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {related.map(r => (
              <button key={r.slug} onClick={() => navigate(`/b2b/guide/${r.slug}`)} style={{
                background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 12, padding: "16px 20px",
                textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{r.category} · {r.read_time}</div>
                </div>
                <span style={{ color: "#C9A227", fontSize: 16 }}>→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer style={{ padding: "24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#334155", fontSize: 12 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["B2B Hub", "/b2b"], ["Metodologia", "/metodologia"], ["Privacy", "/privacy"], ["Termini", "/terms"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati.</div>
      </footer>
    </div>
  );
}
