import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

const GOLD = "#C9A227";
const BG = "#020617";
const CARD = "#0c1426";

const CAROUSEL_SLIDES = [
  {
    region: "Bordeaux · France",
    title: "Premier Grand Cru Classé",
    subtitle: "Châteaux Margaux, Lafite, Pétrus — the world's most investable wines.",
    gradient: "linear-gradient(135deg, #1a0a12 0%, #2d0f1a 40%, #0b1220 100%)",
    accent: "#9b1c4a",
  },
  {
    region: "Toscana · Italia",
    title: "La Terra del Brunello",
    subtitle: "Barolo, Brunello, Super Tuscans — Italy's finest investment-grade bottles.",
    gradient: "linear-gradient(135deg, #1a0e06 0%, #2e1a08 40%, #0b1220 100%)",
    accent: "#b85c1a",
  },
  {
    region: "Bourgogne · France",
    title: "Ancient Vines, Eternal Value",
    subtitle: "Romanée-Conti, Gevrey-Chambertin — Burgundy's irreplaceable grand crus.",
    gradient: "linear-gradient(135deg, #0d0a1a 0%, #1e1430 40%, #0b1220 100%)",
    accent: "#6b3fa0",
  },
  {
    region: "Champagne · France",
    title: "The Art of Effervescence",
    subtitle: "Dom Pérignon, Krug, Cristal — prestige cuvées delivering 18% annual returns.",
    gradient: "linear-gradient(135deg, #101010 0%, #1a1808 40%, #0b1220 100%)",
    accent: "#b09a2a",
  },
  {
    region: "Napa Valley · USA",
    title: "New World, Old World Returns",
    subtitle: "Opus One, Screaming Eagle, Harlan Estate — California's blue-chip collection.",
    gradient: "linear-gradient(135deg, #080d14 0%, #0f1e10 40%, #0b1220 100%)",
    accent: "#2a6b3a",
  },
];

const FEATURES = [
  { icon: "📊", title: "AI-Powered Scoring", desc: "Proprietary models evaluate 50,000+ wines across critic scores, provenance, region, and investment potential — updated daily." },
  { icon: "🌍", title: "Global Price Comparison", desc: "Live prices from Vivino, Wine-Searcher, Millesima and 10+ platforms side-by-side. Never overpay again." },
  { icon: "📈", title: "Historical Price Charts", desc: "10-year price histories for the world's most collectible wines, down to individual vintage and négociant level." },
  { icon: "🤖", title: "Portfolio Builder AI", desc: "Set your budget and risk appetite. Our AI allocates across an optimal selection and projects returns over your horizon." },
];

const ENTERPRISE_BENEFITS = [
  "Custom reporting & white-label dashboards",
  "Dedicated relationship manager",
  "Direct market access via Liv-ex API",
  "Regulatory compliance documentation",
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  const go = (idx) => setActive((idx + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  useEffect(() => {
    intervalRef.current = setInterval(() => go(active + 1), 3200);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const slide = CAROUSEL_SLIDES[active];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Background with morphing transition */}
      {CAROUSEL_SLIDES.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            background: s.gradient,
            transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
            opacity: i === active ? 1 : 0,
          }}
        />
      ))}

      {/* Animated radial glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 120%, ${slide.accent}22 0%, transparent 65%)`,
        transition: "background 0.9s ease",
        pointerEvents: "none",
      }} />

      {/* Decorative bottle silhouettes */}
      <div style={{
        position: "absolute",
        right: "8%",
        top: "50%",
        transform: "translateY(-50%)",
        opacity: 0.06,
        fontSize: 240,
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        filter: "blur(2px)",
      }}>🍷</div>

      {/* Slide content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        padding: "0 40px",
      }}>
        {/* Region chip */}
        <div key={`region-${active}`} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          border: "1px solid rgba(201,162,39,0.28)",
          borderRadius: 999,
          padding: "5px 16px",
          marginBottom: 28,
          fontSize: 10,
          fontWeight: 700,
          color: GOLD,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          animation: "fadeUp 0.55s ease forwards",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
          {slide.region}
        </div>

        {/* Title */}
        <h2 key={`title-${active}`} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 4.5vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.08,
          marginBottom: 18,
          maxWidth: 700,
          letterSpacing: "-0.03em",
          background: "linear-gradient(140deg, #ffffff 0%, #d4b96a 55%, #f0d898 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "fadeUp 0.6s 0.06s ease forwards",
          opacity: 0,
        }}>
          {slide.title}
        </h2>

        {/* Subtitle */}
        <p key={`sub-${active}`} style={{
          fontSize: "clamp(13px, 1.6vw, 17px)",
          color: "#6a8aa8",
          maxWidth: 520,
          lineHeight: 1.7,
          animation: "fadeUp 0.6s 0.12s ease forwards",
          opacity: 0,
        }}>
          {slide.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 7,
        zIndex: 3,
      }}>
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { clearInterval(intervalRef.current); go(i); }}
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? GOLD : "rgba(201,162,39,0.25)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function LandingPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("investor");
  const [authTab, setAuthTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("b2c");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const featuresRef = useRef(null);
  const [featsVisible, setFeatsVisible] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setFeatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function openModal(type) {
    setModalType(type);
    setAuthTab("login");
    setEmail(""); setPassword("");
    setAccountType(type === "enterprise" ? "b2b" : "b2c");
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (authTab === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) { setError(err.message); setLoading(false); return; }
        if (data.user) {
          await supabase.from("users").insert({ id: data.user.id, email, account_type: accountType });
          if (!data.session) { setError("Account created! Check your email to confirm."); setLoading(false); return; }
          onLogin({ user: data.user, account_type: accountType });
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); setLoading(false); return; }
        const { data: ud } = await supabase.from("users").select("account_type").eq("id", data.user.id).single();
        onLogin({ user: data.user, account_type: ud?.account_type || "b2c" });
      }
    } catch { setError("An unexpected error occurred."); }
    setLoading(false);
  }

  return (
    <>
      <div style={{ background: BG, minHeight: "100vh", color: "white", fontFamily: "'Inter', Arial, sans-serif", overflowX: "hidden" }}>

        {/* ── Header ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100, height: 70,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 48px",
          background: "rgba(2,6,23,0.80)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,162,39,0.10)",
          boxShadow: "0 1px 40px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
            🍷 Vino<span style={{ color: GOLD }}>Invest</span>
          </div>
          <button
            onClick={() => openModal("investor")}
            style={{ padding: "10px 24px", border: `1px solid ${GOLD}`, borderRadius: 8, background: "transparent", color: GOLD, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
          >Login / Sign Up</button>
        </header>

        {/* ── Hero with Carousel ── */}
        <section style={{
          height: "calc(100vh - 70px)",
          minHeight: 500,
          position: "relative",
          overflow: "hidden",
        }}>
          <HeroCarousel />

          {/* CTA overlay */}
          <div style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            zIndex: 4,
          }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => openModal("investor")}
                style={{
                  padding: "16px 38px", borderRadius: 10, border: "none",
                  background: `linear-gradient(135deg, ${GOLD} 0%, #e8cc65 100%)`,
                  color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
                  letterSpacing: "0.01em", boxShadow: "0 6px 28px rgba(201,162,39,0.35)",
                  transition: "transform 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(201,162,39,0.48)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(201,162,39,0.35)"; }}
              >Start Investing →</button>
              <button
                onClick={() => openModal("enterprise")}
                style={{
                  padding: "16px 38px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)", color: "white",
                  fontWeight: 700, fontSize: 15, cursor: "pointer",
                  transition: "background 0.18s, border-color 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
              >Enterprise Access →</button>
            </div>

            {/* Stats bar */}
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, overflow: "hidden",
              background: "rgba(12,20,38,0.85)", backdropFilter: "blur(12px)",
            }}>
              {[{ value: "50,000+", label: "Wines Indexed" }, { value: "+12.4%", label: "Avg Annual Return" }, { value: "AI", label: "Powered Analysis" }].map((s, i) => (
                <div key={i} style={{
                  padding: "22px 44px", textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: GOLD, letterSpacing: "-0.03em", fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#3a5a7a", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section ref={featuresRef} style={{ padding: "100px 48px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 48px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.03em" }}>
              Built for serious wine investors
            </h2>
            <p style={{ color: "#3a5a7a", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
              Institutional-grade tools now available to private collectors worldwide
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  background: CARD,
                  border: "1px solid rgba(255,255,255,0.055)",
                  borderRadius: 20,
                  padding: "34px 28px",
                  transition: "border-color 0.2s, transform 0.2s",
                  opacity: featsVisible ? 1 : 0,
                  transform: featsVisible ? "none" : "translateY(20px)",
                  transitionDelay: featsVisible ? `${i * 0.08}s` : "0s",
                  transitionProperty: "border-color, transform, opacity",
                  transitionDuration: "0.2s, 0.5s, 0.5s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.24)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.055)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 38, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ color: "#3a5a7a", fontSize: 13, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Enterprise CTA ── */}
        <section style={{ padding: "0 48px 100px", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(12,20,38,0.97) 100%)",
            border: "1px solid rgba(201,162,39,0.16)", borderRadius: 24, padding: "60px 52px",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40, flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 10, color: GOLD, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 12 }}>
                For Wealth Managers &amp; Family Offices
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.03em" }}>
                Enterprise Access
              </h2>
              <p style={{ color: "#3a5a7a", fontSize: 15, maxWidth: 480, lineHeight: 1.75, marginBottom: 22 }}>
                White-label reporting, multi-portfolio management, API access and dedicated support for institutions managing €1M+ in fine wine assets.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {ENTERPRISE_BENEFITS.map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6a8aa8" }}>
                    <span style={{ color: GOLD, fontWeight: 800 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 8 }}>
              <button
                onClick={() => openModal("enterprise")}
                style={{
                  padding: "15px 34px", borderRadius: 10, border: `1px solid ${GOLD}`,
                  background: "transparent", color: GOLD, fontWeight: 700, fontSize: 15,
                  cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
              >Request Enterprise Access →</button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.05)", padding: "36px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14,
        }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 800 }}>
            🍷 Vino<span style={{ color: GOLD }}>Invest</span>
          </div>
          <p style={{ color: "#1e3050", fontSize: 12 }}>
            © 2026 VinoInvest · Fine wine intelligence · Investment values are indicative only
          </p>
          <div style={{ display: "flex", gap: 22 }}>
            {["Privacy", "Terms", "Contact"].map(link => (
              <a key={link} href="#" style={{ color: "#263a50", fontSize: 12, textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#6a8aa8"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#263a50"; }}>
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>

      {/* ── Auth Modal ── */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(2,6,23,0.9)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", padding: 16 }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: "#0c1426", border: "1px solid rgba(201,162,39,0.16)", borderRadius: 22, width: "100%", maxWidth: 420, padding: "38px 34px", position: "relative", animation: "landingModalIn 0.24s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`@keyframes landingModalIn { from { opacity:0; transform:scale(0.92) translateY(18px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", background: "rgba(30,41,59,0.9)", border: "1px solid #334155", color: "#94a3b8", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >×</button>

            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, fontWeight: 800, marginBottom: 7 }}>
                🍷 Vino<span style={{ color: GOLD }}>Invest</span>
              </div>
              <p style={{ color: "#3a5a7a", fontSize: 12 }}>
                {modalType === "enterprise" ? "Enterprise — Wealth Manager Access" : "Private Investor Platform"}
              </p>
            </div>

            <div style={{ display: "flex", gap: 0, marginBottom: 26, background: "#070d1c", borderRadius: 10, padding: 3 }}>
              {["login", "signup"].map(t => (
                <button key={t} onClick={() => setAuthTab(t)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, background: authTab === t ? GOLD : "transparent", color: authTab === t ? "#000" : "#3a5a7a", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "0.15s", fontFamily: "'Inter', Arial, sans-serif" }}>
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)} required
                style={{ padding: "13px 15px", borderRadius: 10, border: "1px solid #1a2540", background: "#07090f", color: "white", fontSize: 13, outline: "none", width: "100%" }}
                onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#1a2540"; }}
              />
              <input
                type="password" placeholder="Password (min 6 characters)" value={password}
                onChange={e => setPassword(e.target.value)} required
                style={{ padding: "13px 15px", borderRadius: 10, border: "1px solid #1a2540", background: "#07090f", color: "white", fontSize: 13, outline: "none", width: "100%" }}
                onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#1a2540"; }}
              />
              {authTab === "signup" && (
                <select
                  value={accountType} onChange={e => setAccountType(e.target.value)}
                  style={{ padding: "13px 15px", borderRadius: 10, border: "1px solid #1a2540", background: "#07090f", color: accountType ? "white" : "#3a5a7a", fontSize: 13, outline: "none", width: "100%", cursor: "pointer" }}
                  onFocus={e => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#1a2540"; }}
                >
                  <option value="b2c">Private Investor (B2C)</option>
                  <option value="b2b">Wealth Manager / Institution (B2B)</option>
                  <option value="cantina">Cantina / Wine Producer</option>
                </select>
              )}
              {error && (
                <p style={{ color: error.startsWith("Account created") ? GOLD : "#e53935", fontSize: 12, margin: 0, textAlign: "center" }}>
                  {error}
                </p>
              )}
              <button
                type="submit" disabled={loading}
                style={{ marginTop: 5, padding: "14px", borderRadius: 10, border: "none", background: loading ? "#3a3a3a" : `linear-gradient(135deg, ${GOLD}, #e8cc65)`, color: loading ? "#888" : "#000", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter', Arial, sans-serif" }}
              >
                {loading ? "Please wait..." : authTab === "login" ? "Log In →" : "Create Account →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
