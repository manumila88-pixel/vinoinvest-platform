import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../lib/constants";

const FEATURES = [
  { icon: "📊", title: "AI Score su 50.000+ vini", desc: "Algoritmo proprietario che analizza storico prezzi, punteggi critici e liquidità." },
  { icon: "📈", title: "Prezzi storici Liv-ex", desc: "Grafici di performance su 20 anni per ogni vino nel database." },
  { icon: "💼", title: "Portfolio tracker", desc: "Gestisci il tuo cellar con valutazione real-time e alert automatici." },
  { icon: "🤖", title: "AI Chat Advisor", desc: "Assistente AI connesso al DB reale. Risponde su prezzi, annate, strategie." },
  { icon: "🎓", title: "Academy 20 moduli", desc: "Corso completo dal Bordeaux ai casi studio +1000%. Certificato incluso." },
  { icon: "🔔", title: "Price Alerts", desc: "Notifiche push e email quando il tuo vino raggiunge il target price." },
];

const SOCIAL_PROOF = [
  { name: "Marco R.", role: "Private equity, Milano", text: "Ho diversificato il 15% del portfolio in fine wine. +38% in 3 anni con VinoInvest." },
  { name: "Sarah K.", role: "Wine collector, Londra", text: "La Academy è semplicemente il corso migliore disponibile sul mercato. Niente paragoni." },
  { name: "Luca M.", role: "Family office, Ginevra", text: "Il portfolio tracker ci ha permesso di identificare vini da vendere al momento giusto." },
];

const PLANS = [
  { name: "Starter", price: "€9", period: "/mese", color: "#475569", features: ["50 ricerche/giorno", "Grafici base", "Academy moduli 1–5"] },
  { name: "Investor", price: "€29", period: "/mese", color: "#C9A227", features: ["Ricerche illimitate", "AI Score completo", "Portfolio tracker", "Academy completa", "Price alerts"], popular: true },
  { name: "Pro", price: "€79", period: "/mese", color: "#7c3aed", features: ["Tutto Investor +", "API access", "B2B dashboard", "Consulenza mensile", "Priority support"] },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ wines: "50.000+", users: "2.800+", prices: "180.000+" });
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/stats/public`).then(r => r.json()).then(d => {
      if (d.wines) setStats({ wines: d.wines.toLocaleString() + "+", users: d.users.toLocaleString() + "+", prices: d.prices.toLocaleString() + "+" });
    }).catch(() => {});
  }, []);

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
    <div style={{ background: "#0b1220", color: "#e2e8f0", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(11,18,32,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#C9A227" }}>🍷 VinoInvest</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#features" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Features</a>
          <a href="#academy" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Academy</a>
          <a href="#pricing" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Prezzi</a>
          <button onClick={() => navigate("/")} style={{ background: "#C9A227", color: "#0b1220", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Inizia gratis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: "center", background: "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.12) 0%, transparent 60%)" }}>
        <div style={{ display: "inline-block", background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: "#C9A227" }}>
          🏆 La piattaforma #1 per investire in fine wine
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, margin: "0 0 24px", lineHeight: 1.1 }}>
          Investi in vino pregiato<br />
          <span style={{ color: "#C9A227" }}>con intelligenza artificiale</span>
        </h1>
        <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
          AI Score su {stats.wines} vini. Portfolio tracker, prezzi storici Liv-ex, Academy 20 moduli. Tutto in un'unica piattaforma.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")} style={{ background: "#C9A227", color: "#0b1220", border: "none", borderRadius: 10, padding: "16px 32px", fontWeight: 800, cursor: "pointer", fontSize: 17 }}>
            Inizia gratis →
          </button>
          <button onClick={() => navigate("/academy")} style={{ background: "transparent", color: "#C9A227", border: "2px solid #C9A227", borderRadius: 10, padding: "14px 32px", fontWeight: 700, cursor: "pointer", fontSize: 17 }}>
            Vedi la Academy
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
          {[
            { val: stats.wines, label: "Vini nel database" },
            { val: stats.users, label: "Investitori attivi" },
            { val: stats.prices, label: "Prezzi storici" },
            { val: "20", label: "Moduli Academy" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#C9A227" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Tutto quello che ti serve</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 56, fontSize: 17 }}>Nessun altro tool ha questa integrazione completa.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: "#0f1c2e", borderRadius: 16, padding: 28, border: "1px solid #1e3050", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACADEMY TEASER */}
      <section id="academy" style={{ padding: "80px 24px", background: "linear-gradient(135deg, #0f1c2e 0%, #0b1220 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#C9A227", fontWeight: 600, marginBottom: 16, letterSpacing: 1 }}>ACCADEMIA DEL VINO</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>Dal Bordeaux ai +1000% documentati</h2>
          <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
            20 moduli intensivi su mercati regionali, en primeur, aste internazionali, indici Liv-ex, fiscalità e casi studio reali. Progettato per chi vuole investire seriamente, non speculare.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {["📊 20 moduli completi", "💼 Portfolio simulato 2010–2024", "🎓 Certificato verificabile", "📈 Dati Liv-ex reali", "🤖 Quiz e esercizi pratici", "♾️ Accesso a vita"].map(tag => (
              <span key={tag} style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#C9A227" }}>{tag}</span>
            ))}
          </div>
          <button onClick={() => navigate("/academy")} style={{ background: "#C9A227", color: "#0b1220", border: "none", borderRadius: 10, padding: "16px 40px", fontWeight: 800, cursor: "pointer", fontSize: 17 }}>
            Accedi alla Academy →
          </button>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 48 }}>Cosa dicono gli investitori</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {SOCIAL_PROOF.map(t => (
            <div key={t.name} style={{ background: "#0f1c2e", borderRadius: 16, padding: 28, border: "1px solid #1e3050" }}>
              <p style={{ color: "#e2e8f0", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "80px 24px", background: "#0f1c2e" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Piani e prezzi</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 56, fontSize: 17 }}>Inizia gratis. Upgrade quando vuoi.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background: "#0b1220", borderRadius: 16, padding: 32, border: p.popular ? "2px solid #C9A227" : "1px solid #1e3050", position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#C9A227", color: "#0b1220", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>PIÙ POPOLARE</div>}
                <h3 style={{ fontSize: 22, fontWeight: 800, color: p.color, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 16, color: "#64748b" }}>{p.period}</span></div>
                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map(f => <li key={f} style={{ fontSize: 14, color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "#C9A227" }}>✓</span>{f}</li>)}
                </ul>
                <button onClick={() => navigate("/pricing")} style={{ width: "100%", background: p.popular ? "#C9A227" : "transparent", color: p.popular ? "#0b1220" : "#C9A227", border: `2px solid ${p.popular ? "#C9A227" : "#1e3050"}`, borderRadius: 8, padding: "12px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                  {p.popular ? "Inizia ora" : "Scegli piano"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.08) 0%, transparent 60%)" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ricevi la newsletter settimanale</h2>
        <p style={{ color: "#64748b", marginBottom: 32, fontSize: 16 }}>Annate, opportunità di mercato e analisi Liv-ex ogni lunedì. Solo dati reali.</p>
        {emailSent ? (
          <div style={{ color: "#4ade80", fontWeight: 700, fontSize: 17 }}>✅ Iscritto! Ti manderemo le prime news a breve.</div>
        ) : (
          <form onSubmit={handleEmailSignup} style={{ display: "flex", gap: 12, justifyContent: "center", maxWidth: 500, margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="la-tua@email.com"
              required
              style={{ flex: 1, minWidth: 220, background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 8, padding: "12px 16px", color: "#e2e8f0", fontSize: 15 }}
            />
            <button type="submit" style={{ background: "#C9A227", color: "#0b1220", border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              Iscriviti →
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#475569", fontSize: 13 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Cookies", "/cookies"], ["Disclaimer", "/disclaimer"], ["Academy", "/academy"], ["Prezzi", "/pricing"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#475569", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. <span style={{ color: "#C9A227" }}>Investire in vino comporta rischi. I rendimenti passati non garantiscono risultati futuri.</span></div>
      </footer>
    </div>
  );
}
