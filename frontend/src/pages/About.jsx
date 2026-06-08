import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STEPS = [
  { num: "01", icon: "🗃", title: "Aggregiamo i dati", desc: "Raccogliamo prezzi da Liv-ex, aste internazionali, CellarTracker e 40+ fonti in tempo reale." },
  { num: "02", icon: "🤖", title: "Calcoliamo l'AI Score", desc: "Il nostro modello analizza storico prezzi, punteggi critici, liquidità, domanda globale e tendenze per generare un punteggio 0-100." },
  { num: "03", icon: "📊", title: "Presentiamo le opportunità", desc: "Dashboard intuitiva con grafici, alert e raccomandazioni personalizzate basate sul tuo profilo di rischio." },
  { num: "04", icon: "🎓", title: "Ti formiamo", desc: "Academy con 20 moduli intensivi — dal Bordeaux ai casi studio documentati +1000%. Certificato verificabile incluso." },
];

const TECH = [
  { label: "Vini analizzati", value: "50.000+" },
  { label: "Punti dati storici", value: "1.8M+" },
  { label: "Fonti integrate", value: "40+" },
  { label: "Anni di storico", value: "20+" },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Helmet>
        <title>Chi Siamo | VinoInvest — Piattaforma Intelligente per Investire in Vino</title>
        <meta name="description" content="VinoInvest democratizza l'intelligenza del mercato del vino. AI Score, dati Liv-ex, Academy 20 moduli e portfolio tracker per investitori privati e professionisti." />
        <meta property="og:title" content="Chi Siamo | VinoInvest" />
        <meta property="og:description" content="Scopri la missione di VinoInvest: democratizzare l'intelligenza del mercato del vino." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/about" />
      </Helmet>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,18,32,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", fontSize: 20, fontWeight: 800, cursor: "pointer" }}>🍷 VinoInvest</button>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => navigate("/landing")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Home</button>
          <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Academy</button>
          <button onClick={() => navigate("/pricing")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Inizia gratis</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: "#C9A227" }}>
          La nostra missione
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 24 }}>
          Democratizzare l'intelligenza<br />
          <span style={{ color: "#C9A227" }}>del mercato del vino</span>
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          Il mercato del fine wine ha storicamente generato rendimenti superiori al mercato azionario con bassa correlazione. Ma fino ad oggi era accessibile solo a pochi con connessioni privilegiate. VinoInvest cambia questo.
        </p>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", maxWidth: 800, margin: "0 auto" }}>
          {TECH.map(t => (
            <div key={t.label} style={{ textAlign: "center", background: "#0f1c2e", borderRadius: 16, padding: "24px 32px", border: "1px solid #1e3050", minWidth: 160 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#C9A227" }}>{t.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section style={{ padding: "0 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Come funziona</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 56, fontSize: 16 }}>4 step per portare l'intelligenza professionale del mercato a chiunque voglia investire in vino.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ background: "#0f1c2e", borderRadius: 16, padding: 28, border: "1px solid #1e3050", position: "relative" }}>
              <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 800, color: "#1e3050", letterSpacing: 1 }}>{s.num}</div>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tecnologia */}
      <section style={{ padding: "60px 24px", background: "#0f1c2e" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>La nostra tecnologia</h2>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            L'AI Score di VinoInvest combina modelli di machine learning addestrati su 20 anni di dati Liv-ex con analisi in tempo reale di punteggi critici internazionali (Wine Advocate, Decanter, Jancis Robinson), trend di mercato e indicatori di domanda globale.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {["Machine Learning", "Dati Liv-ex", "40+ Fonti", "API Real-time", "Claude AI", "PostgreSQL"].map(tag => (
              <span key={tag} style={{ background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#C9A227" }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contatti */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Contatti</h2>
        <p style={{ color: "#94a3b8", marginBottom: 12 }}>Per partnership, press, B2B e supporto:</p>
        <a href="mailto:manumila88@gmail.com" style={{ color: "#C9A227", fontSize: 18, fontWeight: 700, textDecoration: "none" }}>manumila88@gmail.com</a>
        <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/b2b")} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "12px 28px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Soluzioni B2B →</button>
          <button onClick={() => navigate("/press")} style={{ background: "transparent", border: "2px solid #1e3050", borderRadius: 10, padding: "12px 28px", color: "#94a3b8", cursor: "pointer", fontSize: 15 }}>Press Kit</button>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: "32px 24px", background: "#0f1c2e", borderTop: "1px solid #1e3050" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 10 }}>Disclaimer finanziario</h3>
          <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.7 }}>
            Le informazioni e le analisi fornite da VinoInvest hanno scopo puramente informativo e non costituiscono consulenza finanziaria, fiscale o legale ai sensi del D.Lgs. 58/1998 (TUF) e successive modificazioni. Investire in vino comporta rischi, inclusa la possibilità di perdita totale del capitale investito. I rendimenti passati non garantiscono risultati futuri. Prima di effettuare qualsiasi investimento, consultare un consulente finanziario autorizzato. VinoInvest non è un intermediario finanziario regolamentato. I prezzi indicati hanno scopo informativo e possono differire dai prezzi di mercato effettivi.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#334155", fontSize: 12 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Disclaimer", "/disclaimer"], ["Academy", "/academy"], ["B2B", "/b2b"], ["Referral", "/referral"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati.</div>
      </footer>
    </div>
  );
}
