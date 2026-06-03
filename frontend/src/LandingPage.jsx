import { useState, useEffect } from "react";

const GOLD = "#c9a84c";
const BG = "#0a0f1e";
const CARD = "#0c1426";

const features = [
  {
    icon: "📊",
    title: "AI-Powered Scoring",
    desc: "Proprietary models evaluate 50,000+ wines across critic scores, provenance, region, and investment potential — updated daily."
  },
  {
    icon: "🌍",
    title: "Global Price Comparison",
    desc: "Live prices from Vivino, Wine-Searcher, Millesima and 10+ platforms side-by-side. Never overpay again."
  },
  {
    icon: "📈",
    title: "Historical Price Charts",
    desc: "10-year price histories for the world's most collectible wines, down to individual vintage and négociant level."
  },
  {
    icon: "🤖",
    title: "Portfolio Builder AI",
    desc: "Set your budget and risk appetite. Our AI allocates across an optimal selection and projects returns over your horizon."
  }
];

const enterpriseBenefits = [
  "Custom reporting & white-label dashboards",
  "Dedicated relationship manager",
  "Direct market access via Liv-ex API",
  "Regulatory compliance documentation"
];

export default function LandingPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("investor");
  const [authTab, setAuthTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  function openModal(type) {
    setModalType(type);
    setAuthTab("login");
    setEmail("");
    setPassword("");
    setShowModal(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) onLogin({ email, type: modalType });
  }

  return (
    <>
      <div style={{ background: BG, minHeight: "100vh", color: "white", fontFamily: "Inter, Arial, sans-serif", overflowX: "hidden" }}>

        {/* ── Header ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100, height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
          background: "rgba(10,15,30,0.90)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,168,76,0.10)"
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>
            🍷 Vino<span style={{ color: GOLD }}>Invest</span>
          </div>
          <button
            onClick={() => openModal("investor")}
            style={{
              padding: "10px 24px", border: `1px solid ${GOLD}`, borderRadius: 8,
              background: "transparent", color: GOLD, fontWeight: 700, fontSize: 14,
              cursor: "pointer", letterSpacing: "0.01em",
              transition: "background 0.2s, color 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
          >
            Login / Sign Up
          </button>
        </header>

        {/* ── Hero ── */}
        <section style={{
          minHeight: "calc(100vh - 72px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "80px 32px 80px",
          background: "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(201,168,76,0.09) 0%, transparent 65%)"
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: "1px solid rgba(201,168,76,0.30)", borderRadius: 999,
            padding: "6px 18px", marginBottom: 36,
            fontSize: 11, fontWeight: 700, color: GOLD,
            letterSpacing: "0.12em", textTransform: "uppercase"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block", flexShrink: 0 }} />
            AI-Powered Fine Wine Intelligence
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 5.8vw, 76px)", fontWeight: 900,
            lineHeight: 1.08, marginBottom: 28, maxWidth: 920,
            letterSpacing: "-0.04em",
            background: "linear-gradient(145deg, #ffffff 0%, #d4b96a 55%, #f0d898 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            The Bloomberg Terminal<br />for Fine Wine Investment
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "#7a8ea0",
            maxWidth: 620, marginBottom: 52, lineHeight: 1.75
          }}>
            50,000+ wines tracked. Real-time price intelligence across global marketplaces.
            AI portfolio construction for private investors and wealth managers.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 88 }}>
            <button
              onClick={() => openModal("investor")}
              style={{
                padding: "17px 40px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${GOLD} 0%, #e8cc65 100%)`,
                color: "#000", fontWeight: 800, fontSize: 16, cursor: "pointer",
                letterSpacing: "0.01em", boxShadow: "0 6px 28px rgba(201,168,76,0.32)",
                transition: "transform 0.18s, box-shadow 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(201,168,76,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(201,168,76,0.32)"; }}
            >
              Start Investing →
            </button>
            <button
              onClick={() => openModal("enterprise")}
              style={{
                padding: "17px 40px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)", color: "white",
                fontWeight: 700, fontSize: 16, cursor: "pointer",
                letterSpacing: "0.01em", transition: "background 0.18s, border-color 0.18s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
            >
              Enterprise Access →
            </button>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 18, overflow: "hidden",
            background: "rgba(12,20,38,0.80)", backdropFilter: "blur(10px)"
          }}>
            {[
              { value: "50,000+", label: "Wines Indexed" },
              { value: "3", label: "Platforms Compared" },
              { value: "AI", label: "Powered Analysis" }
            ].map((s, i) => (
              <div key={i} style={{
                padding: "28px 52px", textAlign: "center",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none"
              }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: GOLD, letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#4a5a6a", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.10em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: "110px 48px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 50px)", fontWeight: 800, marginBottom: 18, letterSpacing: "-0.03em" }}>
              Built for serious wine investors
            </h2>
            <p style={{ color: "#4a5a6a", fontSize: 18, maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              Institutional-grade tools now available to private collectors worldwide
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: CARD, border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 20, padding: "36px 30px", transition: "border-color 0.2s, transform 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 40, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ color: "#4a5a6a", fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Enterprise CTA ── */}
        <section style={{ padding: "0 48px 110px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(12,20,38,0.95) 100%)",
            border: "1px solid rgba(201,168,76,0.18)", borderRadius: 24, padding: "64px 56px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40, flexWrap: "wrap"
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                For Wealth Managers &amp; Family Offices
              </div>
              <h2 style={{ fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 800, marginBottom: 14, letterSpacing: "-0.03em" }}>
                Enterprise Access
              </h2>
              <p style={{ color: "#4a5a6a", fontSize: 16, maxWidth: 480, lineHeight: 1.75, marginBottom: 24 }}>
                White-label reporting, multi-portfolio management, API access and dedicated support for institutions managing €1M+ in fine wine assets.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {enterpriseBenefits.map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#7a8ea0" }}>
                    <span style={{ color: GOLD, fontWeight: 700 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 8 }}>
              <button
                onClick={() => openModal("enterprise")}
                style={{
                  padding: "16px 36px", borderRadius: 10, border: `1px solid ${GOLD}`,
                  background: "transparent", color: GOLD, fontWeight: 700, fontSize: 16,
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "background 0.2s, color 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
              >
                Request Enterprise Access →
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16
        }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            🍷 Vino<span style={{ color: GOLD }}>Invest</span>
          </div>
          <p style={{ color: "#253040", fontSize: 13 }}>
            © 2026 VinoInvest · Fine wine intelligence platform · Investment values are indicative only
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Contact"].map(link => (
              <a key={link} href="#" style={{ color: "#334155", fontSize: 13, textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#334155"; }}>
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>

      {/* ── Auth Modal ── */}
      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(7,9,15,0.88)", display: "flex",
            alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)", padding: 16
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#0c1426", border: "1px solid rgba(201,168,76,0.18)",
              borderRadius: 22, width: "100%", maxWidth: 420,
              padding: "40px 36px", position: "relative",
              animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute", top: 16, right: 16, width: 32, height: 32,
                borderRadius: "50%", background: "rgba(30,41,59,0.9)",
                border: "1px solid #334155", color: "#94a3b8", fontSize: 20,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                lineHeight: 1
              }}
            >×</button>

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                🍷 Vino<span style={{ color: GOLD }}>Invest</span>
              </div>
              <p style={{ color: "#4a5a6a", fontSize: 13 }}>
                {modalType === "enterprise" ? "Enterprise — Wealth Manager Access" : "Private Investor Platform"}
              </p>
            </div>

            {/* Login / Signup tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "#070d1c", borderRadius: 10, padding: 4 }}>
              {["login", "signup"].map(t => (
                <button
                  key={t}
                  onClick={() => setAuthTab(t)}
                  style={{
                    flex: 1, padding: "9px", border: "none", borderRadius: 8,
                    background: authTab === t ? GOLD : "transparent",
                    color: authTab === t ? "#000" : "#4a5a6a",
                    fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.15s"
                  }}
                >
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <input
                type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)} required
                style={{
                  padding: "14px 16px", borderRadius: 10,
                  border: "1px solid #1a2540", background: "#07090f",
                  color: "white", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box"
                }}
                onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#1a2540"; }}
              />
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} required
                style={{
                  padding: "14px 16px", borderRadius: 10,
                  border: "1px solid #1a2540", background: "#07090f",
                  color: "white", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box"
                }}
                onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#1a2540"; }}
              />
              {authTab === "signup" && modalType === "enterprise" && (
                <input
                  type="text" placeholder="Company / Institution name"
                  style={{
                    padding: "14px 16px", borderRadius: 10,
                    border: "1px solid #1a2540", background: "#07090f",
                    color: "white", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box"
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#1a2540"; }}
                />
              )}
              <button
                type="submit"
                style={{
                  marginTop: 6, padding: "15px", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg, ${GOLD}, #e8cc65)`,
                  color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                {authTab === "login" ? "Log In →" : "Create Account →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: "#253040" }}>
              Demo platform — any email &amp; password accepted
            </p>
          </div>
        </div>
      )}
    </>
  );
}
