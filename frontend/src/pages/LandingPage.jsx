import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API, SITE_URL } from "../lib/constants";
import AuthModal from "../components/AuthModal";

const FEATURES = [
  { title: "AI Score su 50.000+ vini", desc: "Algoritmo proprietario che analizza storico prezzi, punteggi critici e liquidità." },
  { title: "Prezzi storici Liv-ex", desc: "Grafici di performance su 20 anni per ogni vino nel database." },
  { title: "Portfolio tracker", desc: "Gestisci il tuo cellar con valutazione real-time e alert automatici." },
  { title: "AI Chat Advisor", desc: "Assistente AI connesso al DB reale. Risponde su prezzi, annate, strategie." },
  { title: "Academy 20 moduli", desc: "Corso completo dal Bordeaux ai casi studio +1000%. Certificato incluso." },
  { title: "Price Alerts", desc: "Notifiche push e email quando il tuo vino raggiunge il target price." },
];

const SOCIAL_PROOF = [
  { name: "Marco R.", role: "Private equity, Milano", text: "Ho diversificato il 15% del portfolio in fine wine. +38% in 3 anni con VinoInvest." },
  { name: "Sarah K.", role: "Wine collector, Londra", text: "La Academy è semplicemente il corso migliore disponibile sul mercato. Niente paragoni." },
  { name: "Luca M.", role: "Family office, Ginevra", text: "Il portfolio tracker ci ha permesso di identificare vini da vendere al momento giusto." },
];

const PLANS = [
  {
    name: "Starter", price: "€9", period: "/mese",
    features: ["50 ricerche/giorno", "Grafici base", "Academy moduli 1–5"],
  },
  {
    name: "Investor", price: "€29", period: "/mese",
    features: ["Ricerche illimitate", "AI Score completo", "Portfolio tracker", "Academy completa", "Price alerts"],
    popular: true,
  },
  {
    name: "Pro", price: "€79", period: "/mese",
    features: ["Tutto Investor +", "API access", "B2B dashboard", "Consulenza mensile", "Priority support"],
  },
];

const ACADEMY_TAGS = [
  "20 moduli completi", "Portfolio simulato 2010–2024", "Certificato verificabile",
  "Dati Liv-ex reali", "Quiz e esercizi pratici", "Accesso a vita",
];

export default function LandingPage({ onLogin }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ wines: "50.000+", users: "2.800+", prices: "180.000+" });
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  useEffect(() => {
    fetch(`${API}/api/stats/public`).then(r => r.json()).then(d => {
      if (d.wines) setStats({ wines: d.wines.toLocaleString() + "+", users: d.users.toLocaleString() + "+", prices: (d.pricePoints || d.prices || 0).toLocaleString() + "+" });
    }).catch(() => {});
  }, []);

  function openAuth(tab = "signup") {
    setAuthTab(tab);
    setShowAuth(true);
  }

  async function handleEmailSignup(e) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(`${API}/api/email-preferences/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing_page", list: "newsletter" }),
      });
      setEmailSent(true);
    } catch {}
  }

  return (
    <div style={{ background: "var(--vi-bg)", color: "var(--vi-text)", minHeight: "100vh", fontFamily: "var(--vi-font-sans)" }}>
      <style>{`
        .lp-feature-card { transition: transform var(--vi-dur) var(--vi-ease), border-color var(--vi-dur-fast) linear; }
        .lp-feature-card:hover { transform: translateY(-3px); border-color: var(--vi-accent) !important; }
        .lp-plan-card { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .lp-plan-card:hover { transform: translateY(-3px); }
        .lp-plan-card-popular:hover { box-shadow: var(--vi-glow); }
        .lp-btn { transition: opacity var(--vi-dur-fast) linear, transform var(--vi-dur-fast) var(--vi-ease); cursor: pointer; }
        .lp-btn:hover { opacity: 0.86; transform: translateY(-1px); }
        .lp-btn-outline { transition: background var(--vi-dur-fast) linear, transform var(--vi-dur-fast) var(--vi-ease); cursor: pointer; }
        .lp-btn-outline:hover { background: rgba(201,162,39,0.12) !important; transform: translateY(-1px); }
        .lp-testi { transition: border-color var(--vi-dur-fast) linear, transform var(--vi-dur) var(--vi-ease); }
        .lp-testi:hover { transform: translateY(-2px); border-color: rgba(201,162,39,0.3) !important; }
        .lp-nav-link { transition: color var(--vi-dur-fast) linear; }
        .lp-nav-link:hover { color: var(--vi-text) !important; }
        @media (prefers-reduced-motion: reduce) {
          .lp-feature-card:hover, .lp-plan-card:hover, .lp-btn:hover, .lp-btn-outline:hover, .lp-testi:hover { transform: none; }
        }
      `}</style>

      <Helmet>
        <title>VinoInvest — Investi in Vino Pregiato con l'AI</title>
        <meta name="description" content="La piattaforma #1 per investire in fine wine. AI Score su 50.000+ vini, prezzi storici Liv-ex, Academy 20 moduli, portfolio tracker. Inizia gratis." />
        <meta property="og:title" content="VinoInvest — Investi in Vino Pregiato con l'AI" />
        <meta property="og:description" content="La piattaforma #1 per investire in fine wine. AI Score su 50.000+ vini, prezzi storici Liv-ex, Academy 20 moduli, portfolio tracker." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`${SITE_URL}/landing`} />
      </Helmet>

      {/* B2B strip */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 101,
        background: "linear-gradient(90deg, rgba(26,10,62,0.95) 0%, rgba(15,28,46,0.95) 100%)",
        borderBottom: "1px solid rgba(124,58,237,0.25)",
        padding: "7px clamp(16px,3vw,24px)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
        fontSize: "var(--vi-fs-xs)", flexWrap: "wrap",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{ color: "#a78bfa", fontWeight: 700 }}>VinoInvest Professional</span>
        <span style={{ color: "var(--vi-text-dim)" }}>Per Wealth Manager · Family Office · Advisors</span>
        <div style={{ display: "flex", gap: 14 }}>
          <a href="/b2b" style={{ color: "var(--vi-accent)", textDecoration: "none", fontWeight: 700 }}>Dashboard B2B →</a>
          <a href="/methodology" style={{ color: "var(--vi-text-dim)", textDecoration: "none" }}>Metodologia</a>
          <a href="/data-sources" style={{ color: "var(--vi-text-dim)", textDecoration: "none" }}>Fonti Dati</a>
        </div>
      </div>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 38, left: 0, right: 0, zIndex: 100,
        background: "var(--vi-surface)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid var(--vi-border)`,
        padding: "14px clamp(16px,3vw,24px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: "var(--vi-font-display)", fontSize: 20, fontWeight: 800 }}>
          Vino<span style={{ color: "var(--vi-accent)" }}>Invest</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#features" className="lp-nav-link" style={{ color: "var(--vi-text-dim)", textDecoration: "none", fontSize: "var(--vi-fs-sm)" }}>Features</a>
          <a href="#academy" className="lp-nav-link" style={{ color: "var(--vi-text-dim)", textDecoration: "none", fontSize: "var(--vi-fs-sm)" }}>Academy</a>
          <a href="#pricing" className="lp-nav-link" style={{ color: "var(--vi-text-dim)", textDecoration: "none", fontSize: "var(--vi-fs-sm)" }}>Prezzi</a>
          <button
            className="lp-btn vi-btn"
            onClick={() => openAuth("login")}
            style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-sm)" }}
          >
            Accedi
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 178, paddingBottom: 80, textAlign: "center",
        background: "radial-gradient(ellipse at 50% 0%, var(--vi-accent-glow) 0%, transparent 60%)",
        padding: "178px clamp(16px,3vw,24px) 80px",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(201,162,39,0.12)",
          border: "1px solid rgba(201,162,39,0.3)", borderRadius: "var(--vi-radius-full)",
          padding: "6px 16px", marginBottom: 24, fontSize: "var(--vi-fs-sm)", color: "var(--vi-accent)", fontWeight: 600,
        }}>
          La piattaforma #1 per investire in fine wine
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 68px)", fontWeight: 900, margin: "0 0 24px", lineHeight: 1.1, fontFamily: "var(--vi-font-display)" }}>
          Investi in vino pregiato<br />
          <span style={{ color: "var(--vi-accent)" }}>con intelligenza artificiale</span>
        </h1>
        <p style={{ fontSize: "var(--vi-fs-lg)", color: "var(--vi-text-dim)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
          AI Score su {stats.wines} vini. Portfolio tracker, prezzi storici Liv-ex, Academy 20 moduli. Tutto in un'unica piattaforma.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="lp-btn vi-btn"
            onClick={() => openAuth("signup")}
            style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-base)", padding: "15px 32px" }}
          >
            Inizia gratis →
          </button>
          <button
            className="lp-btn-outline"
            onClick={() => navigate("/academy")}
            style={{
              background: "transparent", color: "var(--vi-accent)",
              border: `2px solid var(--vi-accent)`, borderRadius: "var(--vi-radius-md)",
              padding: "13px 32px", fontWeight: 700, fontSize: "var(--vi-fs-base)", fontFamily: "var(--vi-font-sans)",
            }}
          >
            Vedi la Academy
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
          {[
            { val: stats.wines, label: "Vini nel database" },
            { val: stats.users, label: "Investitori attivi" },
            { val: stats.prices, label: "Prezzi storici" },
            { val: "20", label: "Moduli Academy" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(28px,4vw,36px)", fontWeight: 900, color: "var(--vi-accent)", fontFamily: "var(--vi-font-display)", fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
              <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontFamily: "var(--vi-font-display)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, marginBottom: 12 }}>Tutto quello che ti serve</h2>
        <p style={{ textAlign: "center", color: "var(--vi-text-dim)", marginBottom: 56, fontSize: "var(--vi-fs-base)" }}>Nessun altro tool ha questa integrazione completa.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="lp-feature-card vi-card" style={{ padding: "clamp(20px,2vw,28px)" }}>
              <div style={{
                width: 44, height: 44, marginBottom: 16,
                background: "var(--vi-bg-elev)", border: `1px solid var(--vi-border)`,
                borderRadius: "var(--vi-radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 18, height: 2, background: "var(--vi-accent)", borderRadius: 2 }} />
              </div>
              <h3 style={{ fontSize: "var(--vi-fs-base)", fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "var(--vi-text-dim)", lineHeight: 1.6, fontSize: "var(--vi-fs-sm)", margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academy teaser */}
      <section id="academy" style={{ padding: "80px clamp(16px,3vw,24px)", background: `linear-gradient(135deg, var(--vi-bg-elev) 0%, var(--vi-bg) 100%)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-accent)", fontWeight: 700, marginBottom: 14, letterSpacing: "0.12em", textTransform: "uppercase" }}>Accademia del Vino</div>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
            Dal Bordeaux ai +1000% documentati
          </h2>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", lineHeight: 1.7, marginBottom: 36, maxWidth: 680, margin: "0 auto 36px" }}>
            20 moduli intensivi su mercati regionali, en primeur, aste internazionali, indici Liv-ex, fiscalità e casi studio reali. Progettato per chi vuole investire seriamente, non speculare.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
            {ACADEMY_TAGS.map(tag => (
              <span key={tag} style={{
                background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.25)",
                borderRadius: "var(--vi-radius-full)", padding: "6px 14px",
                fontSize: "var(--vi-fs-xs)", color: "var(--vi-accent)", fontWeight: 600
              }}>{tag}</span>
            ))}
          </div>
          <button
            className="lp-btn vi-btn"
            onClick={() => navigate("/academy")}
            style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-base)", padding: "15px 40px" }}
          >
            Accedi alla Academy →
          </button>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontFamily: "var(--vi-font-display)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, marginBottom: 48 }}>Cosa dicono gli investitori</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {SOCIAL_PROOF.map(t => (
            <div key={t.name} className="lp-testi vi-card" style={{ padding: "clamp(20px,2vw,28px)" }}>
              <p style={{ color: "var(--vi-text)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic", fontSize: "var(--vi-fs-sm)" }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, fontSize: "var(--vi-fs-sm)" }}>{t.name}</div>
              <div style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "80px clamp(16px,3vw,24px)", background: "var(--vi-bg-elev)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontFamily: "var(--vi-font-display)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, marginBottom: 12 }}>Piani e prezzi</h2>
          <p style={{ textAlign: "center", color: "var(--vi-text-dim)", marginBottom: 56, fontSize: "var(--vi-fs-base)" }}>Inizia gratis. Upgrade quando vuoi.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {PLANS.map(p => (
              <div
                key={p.name}
                className={`lp-plan-card${p.popular ? " lp-plan-card-popular" : ""} vi-card`}
                style={{
                  padding: "clamp(24px,2vw,32px)",
                  border: p.popular ? `2px solid var(--vi-accent)` : `1px solid var(--vi-border)`,
                  background: p.popular ? `linear-gradient(145deg, var(--vi-bg-elev), var(--vi-bg))` : "var(--vi-surface)",
                  position: "relative",
                  boxShadow: p.popular ? "0 0 40px var(--vi-accent-glow)" : "var(--vi-elev-1)",
                }}
              >
                {p.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "var(--vi-accent)", color: "var(--vi-bg)",
                    borderRadius: "var(--vi-radius-full)", padding: "4px 16px",
                    fontSize: "var(--vi-fs-xs)", fontWeight: 800, whiteSpace: "nowrap", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>Più Popolare</div>
                )}
                <h3 style={{ fontSize: "var(--vi-fs-xl)", fontWeight: 800, color: p.popular ? "var(--vi-accent)" : "var(--vi-text)", marginBottom: 8, fontFamily: "var(--vi-font-display)" }}>{p.name}</h3>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: "clamp(32px,4vw,40px)", fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{p.price}</span>
                  <span style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "var(--vi-accent)", fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  className="lp-btn"
                  onClick={() => navigate("/pricing")}
                  style={{
                    width: "100%",
                    background: p.popular ? "var(--vi-accent)" : "transparent",
                    color: p.popular ? "var(--vi-bg)" : "var(--vi-accent)",
                    border: `2px solid ${p.popular ? "var(--vi-accent)" : "var(--vi-border)"}`,
                    borderRadius: "var(--vi-radius-md)", padding: "12px", fontWeight: 700,
                    fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)",
                  }}
                >
                  {p.popular ? "Inizia ora" : "Scegli piano"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section style={{
        padding: "80px clamp(16px,3vw,24px)", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 100%, var(--vi-accent-glow) 0%, transparent 60%)",
      }}>
        <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, marginBottom: 14 }}>Ricevi la newsletter settimanale</h2>
        <p style={{ color: "var(--vi-text-dim)", marginBottom: 32, fontSize: "var(--vi-fs-base)", lineHeight: 1.6 }}>Annate, opportunità di mercato e analisi Liv-ex ogni lunedì. Solo dati reali.</p>
        {emailSent ? (
          <div style={{ color: "var(--vi-positive)", fontWeight: 700, fontSize: "var(--vi-fs-base)" }}>Iscritto. Ti manderemo le prime news a breve.</div>
        ) : (
          <form onSubmit={handleEmailSignup} style={{ display: "flex", gap: 10, justifyContent: "center", maxWidth: 480, margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="la-tua@email.com"
              required
              style={{
                flex: 1, minWidth: 220, background: "var(--vi-surface)", border: `1px solid var(--vi-border)`,
                borderRadius: "var(--vi-radius-md)", padding: "12px 16px",
                color: "var(--vi-text)", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)", outline: "none",
              }}
            />
            <button
              type="submit"
              className="lp-btn vi-btn"
              style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-sm)", padding: "12px 24px" }}
            >
              Iscriviti →
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer style={{ padding: "28px clamp(16px,3vw,24px)", borderTop: `1px solid var(--vi-border)`, textAlign: "center", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)" }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Cookies", "/cookies"], ["Disclaimer", "/disclaimer"], ["Academy", "/academy"], ["Prezzi", "/pricing"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "var(--vi-text-dim)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. <span style={{ color: "var(--vi-accent)" }}>Investire in vino comporta rischi. I rendimenti passati non garantiscono risultati futuri.</span></div>
      </footer>

      {showAuth && (
        <AuthModal
          defaultTab={authTab}
          reason={authTab === "signup" ? "Crea il tuo account gratuito" : null}
          onSuccess={({ user, account_type }) => {
            setShowAuth(false);
            if (onLogin) onLogin({ user, account_type });
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
