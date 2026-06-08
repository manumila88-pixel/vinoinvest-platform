import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STEPS = [
  {
    num: "01",
    icon: "◈",
    title: "Aggregazione dati",
    desc: "Raccogliamo prezzi da Liv-ex, CellarTracker e 40+ fonti. Ogni dato ha un badge di affidabilità: verificato, stimato, elaborato.",
  },
  {
    num: "02",
    icon: "◎",
    title: "AI Score proprietario",
    desc: "Il modello analizza punteggi critici (30%), dati Liv-ex (25%), qualità annata (20%), reputazione produttore (15%), liquidità (10%).",
  },
  {
    num: "03",
    icon: "◉",
    title: "Dashboard istituzionale",
    desc: "Portfolio tracker con risk analytics (Sharpe, VaR, Max Drawdown), segnali Buy/Sell/Hold e report PDF white-label per i professionisti.",
  },
  {
    num: "04",
    icon: "◐",
    title: "Formazione professionale",
    desc: "Academy con 20 moduli intensivi per wealth manager, family office e appassionati. Certificato verificabile su blockchain.",
  },
];

const STATS = [
  { value: "50.000+", label: "Vini analizzati" },
  { value: "1.8M+", label: "Punti dati storici" },
  { value: "40+", label: "Fonti integrate" },
  { value: "20+", label: "Anni di storico prezzi" },
];

const PILLARS = [
  {
    title: "Trasparenza",
    desc: "Ogni prezzo ha una fonte. Ogni fonte ha un badge. Nessun dato senza contesto. Vedere /data-sources per la lista completa delle 9 fonti integrate.",
    link: "/data-sources",
    linkLabel: "Fonti dati →",
  },
  {
    title: "Metodologia",
    desc: "L'AI Score è una formula documentata con pesi espliciti. Non un black box. Chiunque può verificare come viene calcolato ogni punteggio.",
    link: "/metodologia",
    linkLabel: "Metodologia →",
  },
  {
    title: "Sicurezza",
    desc: "OWASP Top 10 compliance, HSTS preload, CSP headers, JWT Supabase, query parametrizzate. Bug bounty program attivo.",
    link: "/security",
    linkLabel: "Security policy →",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
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
        background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e3050", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", fontSize: 19, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5 }}>
          VinoInvest
        </button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Academy</button>
          <button onClick={() => navigate("/metodologia")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Metodologia</button>
          <button onClick={() => navigate("/b2b")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>B2B</button>
          <button onClick={() => navigate("/pricing")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Inizia gratis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "88px 24px 64px", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 24, fontSize: 11, color: "#C9A227", letterSpacing: 2, textTransform: "uppercase" }}>
          La nostra missione
        </div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 24, letterSpacing: -0.5 }}>
          Intelligence per chi investe<br />
          <span style={{ color: "#C9A227" }}>seriamente nel vino</span>
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.8, maxWidth: 580, margin: "0 auto 40px" }}>
          Il mercato del fine wine ha storicamente generato rendimenti superiori al mercato azionario
          con bassa correlazione agli asset tradizionali. Fino ad oggi era accessibile solo
          a chi aveva le connessioni giuste. VinoInvest democratizza questo accesso.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/b2b")} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "13px 28px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Soluzioni B2B Professional
          </button>
          <button onClick={() => navigate("/pricing")} style={{ background: "transparent", border: "2px solid #1e3050", borderRadius: 10, padding: "13px 28px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
            Piani e prezzi
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              textAlign: "center", background: "#0f1c2e", borderRadius: 14,
              padding: "28px 36px", border: "1px solid #1e3050", minWidth: 160,
            }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: "#C9A227", fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section style={{ padding: "0 24px 88px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Come funziona</h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            4 componenti che trasformano dati di mercato in decisioni di investimento.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ background: "#0f1c2e", borderRadius: 16, padding: "28px 24px", border: "1px solid #1e3050", position: "relative" }}>
              <div style={{ position: "absolute", top: 16, right: 18, fontSize: 11, fontWeight: 800, color: "#1e2d45", letterSpacing: 2 }}>{s.num}</div>
              <div style={{ fontSize: 28, marginBottom: 18, color: "#C9A227" }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.65, fontSize: 13 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tre pilastri */}
      <section style={{ padding: "72px 24px", background: "#0f1c2e" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 48 }}>
            Tre pilastri irrinunciabili
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {PILLARS.map(p => (
              <div key={p.title} style={{ background: "#0b1220", borderRadius: 14, padding: "28px 24px", border: "1px solid #1e3050" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#C9A227", marginBottom: 14 }}>{p.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
                <button onClick={() => navigate(p.link)} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}>
                  {p.linkLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Founder */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, marginBottom: 48 }}>Chi c'è dietro</h2>
          <div style={{ background: "#0f1c2e", borderRadius: 20, padding: "36px", border: "1px solid #1e3050" }}>
            <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 24 }}>
              VinoInvest è stato fondato da appassionati di vino con esperienza nei mercati finanziari alternativi.
              La frustrazione era semplice: i dati professionali sul fine wine erano frammentati, costosi
              e inaccessibili per chi non era già dentro al sistema.
            </p>
            <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 32 }}>
              Abbiamo costruito la piattaforma che avremmo voluto avere: dati aggregati, metodologia trasparente,
              risk analytics istituzionali e formazione professionale. Tutto in un'unica piattaforma.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["Aggregazione dati", "Machine Learning", "Mercati alternativi", "Fine wine", "Risk analytics"].map(tag => (
                <span key={tag} style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#C9A227" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section style={{ padding: "72px 24px", background: "#0f1c2e", textAlign: "center" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Contatti e partnership</h2>
        <p style={{ color: "#94a3b8", marginBottom: 8, fontSize: 15 }}>Per partnership, press, B2B, supporto e segnalazioni:</p>
        <a href="mailto:manumila88@gmail.com" style={{ color: "#C9A227", fontSize: 18, fontWeight: 700, textDecoration: "none" }}>
          manumila88@gmail.com
        </a>
        <div style={{ marginTop: 12, color: "#475569", fontSize: 13 }}>Italia — Risposta entro 48 ore lavorative</div>
        <div style={{ marginTop: 32, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/b2b")} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "12px 28px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Soluzioni B2B →
          </button>
          <button onClick={() => navigate("/press")} style={{ background: "transparent", border: "2px solid #1e3050", borderRadius: 10, padding: "12px 28px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
            Press Kit
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: "32px 24px", borderTop: "1px solid #1e3050" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 10 }}>Disclaimer finanziario</h3>
          <p style={{ color: "#334155", fontSize: 12, lineHeight: 1.7 }}>
            Le informazioni e le analisi fornite da VinoInvest hanno scopo puramente informativo e non costituiscono consulenza finanziaria,
            fiscale o legale ai sensi del D.Lgs. 58/1998 (TUF) e successive modificazioni. Investire in vino comporta rischi,
            inclusa la possibilità di perdita totale del capitale investito. I rendimenti passati non garantiscono risultati futuri.
            Prima di effettuare qualsiasi investimento consultare un consulente finanziario autorizzato.
            VinoInvest non è un intermediario finanziario regolamentato. I prezzi indicati hanno scopo informativo e possono
            differire dai prezzi di mercato effettivi.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#334155", fontSize: 12 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Disclaimer", "/disclaimer"], ["Metodologia", "/metodologia"], ["Fonti dati", "/data-sources"], ["Sicurezza", "/security"], ["B2B", "/b2b"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati. — Italia</div>
      </footer>
    </div>
  );
}
