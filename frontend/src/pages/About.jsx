import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STEPS = [
  { num: "01", icon: "◈", title: "Aggregazione dati", desc: "Raccogliamo prezzi da Liv-ex, CellarTracker e 40+ fonti. Ogni dato ha un badge di affidabilità: verificato, stimato, elaborato." },
  { num: "02", icon: "◎", title: "AI Score proprietario", desc: "Il modello analizza punteggi critici (30%), dati Liv-ex (25%), qualità annata (20%), reputazione produttore (15%), liquidità (10%)." },
  { num: "03", icon: "◉", title: "Dashboard istituzionale", desc: "Portfolio tracker con risk analytics (Sharpe, VaR, Max Drawdown), segnali Buy/Sell/Hold e report PDF white-label per i professionisti." },
  { num: "04", icon: "◐", title: "Formazione professionale", desc: "Academy con 20 moduli intensivi per wealth manager, family office e appassionati. Certificato verificabile su blockchain." },
];

const STATS = [
  { value: "50.000+", label: "Vini analizzati" },
  { value: "1.8M+", label: "Punti dati storici" },
  { value: "40+", label: "Fonti integrate" },
  { value: "20+", label: "Anni di storico prezzi" },
];

const PILLARS = [
  { title: "Trasparenza", desc: "Ogni prezzo ha una fonte. Ogni fonte ha un badge. Nessun dato senza contesto. Vedere /data-sources per la lista completa delle 9 fonti integrate.", link: "/data-sources", linkLabel: "Fonti dati →" },
  { title: "Metodologia", desc: "L'AI Score è una formula documentata con pesi espliciti. Non un black box. Chiunque può verificare come viene calcolato ogni punteggio.", link: "/metodologia", linkLabel: "Metodologia →" },
  { title: "Sicurezza", desc: "OWASP Top 10 compliance, HSTS preload, CSP headers, JWT Supabase, query parametrizzate. Bug bounty program attivo.", link: "/security", linkLabel: "Security policy →" },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)", fontFamily: "var(--vi-font-sans)" }}>
      <style>{`
        .ab-step { transition: transform var(--vi-dur) var(--vi-ease), border-color var(--vi-dur-fast) linear; }
        .ab-step:hover { transform: translateY(-2px); border-color: var(--vi-accent) !important; }
        .ab-pillar { transition: transform var(--vi-dur) var(--vi-ease), border-color var(--vi-dur-fast) linear; }
        .ab-pillar:hover { transform: translateY(-2px); border-color: rgba(201,162,39,0.3) !important; }
        .ab-btn { transition: opacity var(--vi-dur-fast) linear, transform var(--vi-dur-fast) var(--vi-ease); cursor: pointer; }
        .ab-btn:hover { opacity: 0.86; transform: translateY(-1px); }
        .ab-btn-ghost { transition: background var(--vi-dur-fast) linear, color var(--vi-dur-fast) linear; cursor: pointer; }
        .ab-btn-ghost:hover { background: var(--vi-surface) !important; color: var(--vi-text) !important; }
        .ab-stat { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .ab-stat:hover { transform: translateY(-2px); box-shadow: var(--vi-glow); }
        @media (prefers-reduced-motion: reduce) { .ab-step:hover, .ab-pillar:hover, .ab-btn:hover, .ab-stat:hover { transform: none; } }
      `}</style>

      <Helmet>
        <title>Chi Siamo | VinoInvest — Intelligence per Investire nel Fine Wine</title>
        <meta name="description" content="VinoInvest democratizza l'intelligenza del mercato del vino. AI Score, dati Liv-ex, risk analytics istituzionali e Academy per wealth manager e family office." />
        <meta property="og:title" content="Chi Siamo | VinoInvest" />
        <meta property="og:description" content="Intelligence per chi investe seriamente nel vino. 50.000 vini, 1.8M dati storici, 40 fonti integrate." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/about" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "VinoInvest",
          "url": "https://vinoinvest-platform.vercel.app",
          "description": "Piattaforma di intelligence per investimento in fine wine",
          "email": "manumila88@gmail.com",
          "foundingLocation": "Italia",
          "knowsAbout": ["fine wine investment", "wine analytics", "wealth management"],
        })}</script>
      </Helmet>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--vi-surface)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid var(--vi-border)`,
        padding: "14px clamp(16px,3vw,24px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", fontFamily: "var(--vi-font-display)", fontSize: 19, fontWeight: 800, cursor: "pointer" }}
        >
          Vino<span style={{ color: "var(--vi-accent)" }}>Invest</span>
        </button>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "var(--vi-text-dim)", cursor: "pointer", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)" }}>Academy</button>
          <button onClick={() => navigate("/metodologia")} style={{ background: "none", border: "none", color: "var(--vi-text-dim)", cursor: "pointer", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)" }}>Metodologia</button>
          <button onClick={() => navigate("/b2b")} style={{ background: "none", border: "none", color: "var(--vi-text-dim)", cursor: "pointer", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)" }}>B2B</button>
          <button
            className="ab-btn vi-btn"
            onClick={() => navigate("/pricing")}
            style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-sm)" }}
          >
            Inizia gratis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "clamp(60px,8vw,88px) clamp(16px,3vw,24px) 64px", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          display: "inline-block", background: "rgba(201,162,39,0.08)",
          border: "1px solid rgba(201,162,39,0.2)", borderRadius: "var(--vi-radius-full)",
          padding: "5px 16px", marginBottom: 24,
          fontSize: "var(--vi-fs-xs)", color: "var(--vi-accent)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
        }}>
          La nostra missione
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, fontFamily: "var(--vi-font-display)" }}>
          Intelligence per chi investe<br />
          <span style={{ color: "var(--vi-accent)" }}>seriamente nel vino</span>
        </h1>
        <p style={{ fontSize: "var(--vi-fs-lg)", color: "var(--vi-text-dim)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px" }}>
          Il mercato del fine wine ha storicamente generato rendimenti superiori al mercato azionario
          con bassa correlazione agli asset tradizionali. Fino ad oggi era accessibile solo
          a chi aveva le connessioni giuste. VinoInvest democratizza questo accesso.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="ab-btn vi-btn"
            onClick={() => navigate("/b2b")}
            style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-sm)" }}
          >
            Soluzioni B2B Professional
          </button>
          <button
            className="ab-btn-ghost"
            onClick={() => navigate("/pricing")}
            style={{ background: "transparent", border: `1px solid var(--vi-border)`, borderRadius: "var(--vi-radius-md)", padding: "11px 28px", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)" }}
          >
            Piani e prezzi
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 clamp(16px,3vw,24px) 80px" }}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {STATS.map(s => (
            <div key={s.label} className="ab-stat vi-card" style={{ textAlign: "center", padding: "clamp(20px,2vw,28px) clamp(24px,3vw,36px)", minWidth: 160 }}>
              <div style={{ fontSize: "clamp(28px,4vw,38px)", fontWeight: 900, color: "var(--vi-accent)", fontFamily: "var(--vi-font-display)", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section style={{ padding: "0 clamp(16px,3vw,24px) 88px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, marginBottom: 12 }}>Come funziona</h2>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", maxWidth: 480, margin: "0 auto" }}>
            4 componenti che trasformano dati di mercato in decisioni di investimento.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {STEPS.map(s => (
            <div key={s.num} className="ab-step vi-card" style={{ padding: "clamp(20px,2vw,28px)", position: "relative" }}>
              <div style={{ position: "absolute", top: 16, right: 18, fontSize: "var(--vi-fs-xs)", fontWeight: 800, color: "var(--vi-bg-elev)", letterSpacing: 2 }}>{s.num}</div>
              <div style={{ fontSize: 28, marginBottom: 16, color: "var(--vi-accent)", lineHeight: 1 }}>{s.icon}</div>
              <h3 style={{ fontSize: "var(--vi-fs-base)", fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: "var(--vi-text-dim)", lineHeight: 1.65, fontSize: "var(--vi-fs-sm)", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tre pilastri */}
      <section style={{ padding: "72px clamp(16px,3vw,24px)", background: "var(--vi-bg-elev)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontFamily: "var(--vi-font-display)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, marginBottom: 44 }}>
            Tre pilastri irrinunciabili
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {PILLARS.map(p => (
              <div key={p.title} className="ab-pillar vi-card" style={{ padding: "clamp(20px,2vw,28px)" }}>
                <h3 style={{ fontSize: "var(--vi-fs-lg)", fontWeight: 800, color: "var(--vi-accent)", marginBottom: 12 }}>{p.title}</h3>
                <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
                <button
                  onClick={() => navigate(p.link)}
                  style={{ background: "none", border: "none", color: "var(--vi-accent)", cursor: "pointer", fontSize: "var(--vi-fs-sm)", fontWeight: 600, padding: 0, fontFamily: "var(--vi-font-sans)" }}
                >
                  {p.linkLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder / team */}
      <section style={{ padding: "80px clamp(16px,3vw,24px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontFamily: "var(--vi-font-display)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, marginBottom: 44 }}>Chi c'è dietro</h2>
          <div className="vi-card" style={{ padding: "clamp(24px,3vw,36px)" }}>
            <p style={{ fontSize: "var(--vi-fs-base)", color: "var(--vi-text-dim)", lineHeight: 1.8, marginBottom: 20 }}>
              VinoInvest è stato fondato da appassionati di vino con esperienza nei mercati finanziari alternativi.
              La frustrazione era semplice: i dati professionali sul fine wine erano frammentati, costosi
              e inaccessibili per chi non era già dentro al sistema.
            </p>
            <p style={{ fontSize: "var(--vi-fs-base)", color: "var(--vi-text-dim)", lineHeight: 1.8, marginBottom: 28 }}>
              Abbiamo costruito la piattaforma che avremmo voluto avere: dati aggregati, metodologia trasparente,
              risk analytics istituzionali e formazione professionale. Tutto in un'unica piattaforma.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["Aggregazione dati", "Machine Learning", "Mercati alternativi", "Fine wine", "Risk analytics"].map(tag => (
                <span key={tag} style={{
                  background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)",
                  borderRadius: "var(--vi-radius-full)", padding: "5px 12px",
                  fontSize: "var(--vi-fs-xs)", color: "var(--vi-accent)", fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "72px clamp(16px,3vw,24px)", background: "var(--vi-bg-elev)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, marginBottom: 12 }}>Contatti e partnership</h2>
        <p style={{ color: "var(--vi-text-dim)", marginBottom: 10, fontSize: "var(--vi-fs-base)" }}>Per partnership, press, B2B, supporto e segnalazioni:</p>
        <a href="mailto:manumila88@gmail.com" style={{ color: "var(--vi-accent)", fontSize: "var(--vi-fs-xl)", fontWeight: 700, textDecoration: "none" }}>
          manumila88@gmail.com
        </a>
        <div style={{ marginTop: 10, color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", opacity: 0.7 }}>Italia — Risposta entro 48 ore lavorative</div>
        <div style={{ marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="ab-btn vi-btn"
            onClick={() => navigate("/b2b")}
            style={{ border: "none", fontFamily: "var(--vi-font-sans)", fontSize: "var(--vi-fs-sm)" }}
          >
            Soluzioni B2B →
          </button>
          <button
            className="ab-btn-ghost"
            onClick={() => navigate("/press")}
            style={{ background: "transparent", border: `1px solid var(--vi-border)`, borderRadius: "var(--vi-radius-md)", padding: "11px 28px", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)" }}
          >
            Press Kit
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: "28px clamp(16px,3vw,24px)", borderTop: `1px solid var(--vi-border)` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h3 style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: "var(--vi-text-dim)", marginBottom: 8, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Disclaimer finanziario</h3>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)", lineHeight: 1.7, opacity: 0.5 }}>
            Le informazioni e le analisi fornite da VinoInvest hanno scopo puramente informativo e non costituiscono consulenza finanziaria,
            fiscale o legale ai sensi del D.Lgs. 58/1998 (TUF) e successive modificazioni. Investire in vino comporta rischi,
            inclusa la possibilità di perdita totale del capitale investito. I rendimenti passati non garantiscono risultati futuri.
            Prima di effettuare qualsiasi investimento consultare un consulente finanziario autorizzato.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px clamp(16px,3vw,24px)", borderTop: `1px solid var(--vi-border)`, textAlign: "center", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)", opacity: 0.6 }}>
        <div style={{ marginBottom: 10, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Disclaimer", "/disclaimer"], ["Metodologia", "/metodologia"], ["Fonti dati", "/data-sources"], ["Sicurezza", "/security"], ["B2B", "/b2b"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "inherit", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati. — Italia</div>
      </footer>
    </div>
  );
}
