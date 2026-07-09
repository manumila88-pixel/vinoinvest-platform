import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FAQ, B2B_CATS, B2B_CATEGORIES } from "../data/faq.js";
import BackNav from "../components/BackNav";
import { SITE_URL } from "../lib/constants";

const FAQ_B2B = FAQ.filter(f => B2B_CATS.has(f.cat));

const B2B_BLUE = "#60a5fa";
const B2B_BLUE_MID = "rgba(59,130,246,0.2)";

function FAQAccordion({ items }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map(item => (
        <div key={item.id} style={{
          border: `1px solid ${openId === item.id ? "rgba(59,130,246,0.4)" : "rgba(59,130,246,0.15)"}`,
          borderRadius: "var(--vi-radius-md)",
          overflow: "hidden",
          transition: "border-color var(--vi-dur-fast) linear",
        }}>
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            style={{
              width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 12, padding: "14px 20px",
              background: openId === item.id ? "rgba(59,130,246,0.08)" : "var(--vi-surface)",
              border: "none", cursor: "pointer", color: "var(--vi-text)",
              fontSize: "var(--vi-fs-sm)", fontWeight: openId === item.id ? 600 : 500, lineHeight: 1.4,
              transition: "background var(--vi-dur-fast) linear", fontFamily: "var(--vi-font-sans)",
            }}
          >
            <span style={{ flex: 1 }}>{item.q}</span>
            <span style={{
              fontSize: 20, color: B2B_BLUE, flexShrink: 0,
              transition: "transform var(--vi-dur) var(--vi-ease)",
              transform: openId === item.id ? "rotate(180deg)" : "rotate(0deg)",
            }}>›</span>
          </button>
          {openId === item.id && (
            <div style={{
              padding: "16px 20px",
              background: "var(--vi-bg)",
              fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.8,
              borderTop: "1px solid rgba(59,130,246,0.1)",
              animation: "faqExpand 0.2s ease-out",
            }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const FEATURES = [
  { title: "Analytics Avanzati", desc: "Dashboard dedicata con dati di mercato in tempo reale, trend per regione e annata, correlazione con altri asset class." },
  { title: "Multi-Portfolio", desc: "Gestisci portfolio separati per ogni cliente. Performance aggregate, P&L per posizione, report individuali." },
  { title: "Report PDF Branded", desc: "Genera report professionali in un click: composizione, YTD, benchmark, outlook AI. Brandizzabili con il tuo logo." },
  { title: "API & Integrazioni", desc: "REST API documentata. Export CSV/XLSX compatibile con Bloomberg, Advent Geneva e i principali PMS." },
  { title: "GDPR & DPA", desc: "Conformità GDPR completa. Data Processing Agreement disponibile per clienti B2B. Dati conservati in EU." },
  { title: "Support Dedicato", desc: "Account manager dedicato, risposta entro 4h su Slack o email. Onboarding assistito per il tuo team." },
];

const PLANS = [
  {
    name: "Starter",
    price: "€0",
    period: "/mese",
    accent: "var(--vi-accent)",
    border: "rgba(201,162,39,0.3)",
    bg: "rgba(201,162,39,0.05)",
    badge: null,
    sub: "Gratuito — fino a 5 clienti",
    competitor: null,
    features: ["5 portfolio clienti", "Dashboard B2B base", "Report PDF standard", "Risk metrics base", "Export CSV", "Support email"],
    cta: "Inizia gratis →",
    ctaHref: "/b2b-onboarding",
  },
  {
    name: "Professional",
    price: "€200",
    period: "/mese",
    accent: B2B_BLUE,
    border: "rgba(59,130,246,0.5)",
    bg: "rgba(59,130,246,0.06)",
    badge: "Più popolare",
    sub: "Risparmia €600 vs Cult Wines Intelligence",
    competitor: "Cult Wines Intelligence: €800/mese",
    features: [
      "25 portfolio clienti", "Dashboard B2B completa", "Report PDF branded + logo",
      "Risk metrics avanzati (Sharpe, VaR, MDD)", "Benchmark S&P500 / Gold / Inflazione",
      "API 10.000 req/giorno", "Market Intelligence B2B",
      "Export Bloomberg CSV", "DPA incluso · Support dedicato",
    ],
    cta: "Richiedi Demo →",
    ctaHref: "/b2b-onboarding",
  },
  {
    name: "Enterprise",
    price: "€500",
    period: "/mese",
    accent: "#a78bfa",
    border: "rgba(167,139,250,0.4)",
    bg: "rgba(167,139,250,0.05)",
    badge: "White-Label",
    sub: "SLA 99.9% · Account manager dedicato",
    competitor: null,
    features: [
      "Clienti illimitati", "Tutto di Professional",
      "White-label: logo + colori + dominio", "API illimitata + webhook real-time",
      "SLA 99.9% garantito", "Account manager dedicato",
      "Integrazione Bloomberg/Advent Geneva", "Report completamente brandizzati", "Onboarding assistito team",
    ],
    cta: "Contatta Sales →",
    ctaHref: "mailto:sales@vinoinvest.com?subject=Enterprise%20Inquiry",
  },
];

const SEGMENTS = [
  { label: "Family Office" },
  { label: "Wealth Manager" },
  { label: "Cantine" },
  { label: "Fondi d'Investimento" },
  { label: "Fiduciari" },
  { label: "Analisti" },
];

export default function B2BPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [formData, setFormData] = useState({ name: "", company: "", email: "", role: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const filteredFAQ = activeCat === "all" ? FAQ_B2B : FAQ_B2B.filter(f => f.cat === activeCat);

  function handleSubmit(e) {
    e.preventDefault();
    const subject = encodeURIComponent(`Demo Request — ${formData.company}`);
    const body = encodeURIComponent(
      `Nome: ${formData.name}\nAzienda: ${formData.company}\nRuolo: ${formData.role}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:sales@vinoinvest.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)", fontFamily: "var(--vi-font-sans)" }}>
      <BackNav title="B2B Solutions" />
      <style>{`
        @keyframes faqExpand { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .b2b-feature-card { transition: transform var(--vi-dur) var(--vi-ease), border-color var(--vi-dur-fast) linear; }
        .b2b-feature-card:hover { transform: translateY(-2px); border-color: rgba(59,130,246,0.35) !important; }
        .b2b-plan-card { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .b2b-plan-card:hover { transform: translateY(-4px); box-shadow: var(--vi-elev-2); }
        .b2b-cta-btn { transition: opacity var(--vi-dur-fast) linear, transform var(--vi-dur-fast) var(--vi-ease); }
        .b2b-cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .b2b-guide-card { transition: border-color var(--vi-dur-fast) linear; }
        .b2b-guide-card:hover { border-color: rgba(201,162,39,0.3) !important; }
        .b2b-input { transition: border-color var(--vi-dur-fast) linear; outline: none; }
        .b2b-input:focus { border-color: rgba(59,130,246,0.55) !important; }
        .b2b-faq-cat { transition: background var(--vi-dur-fast) linear, color var(--vi-dur-fast) linear, border-color var(--vi-dur-fast) linear; cursor: pointer; }
        .b2b-stat { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .b2b-stat:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(59,130,246,0.3), 0 8px 32px rgba(59,130,246,0.12); }
        .b2b-testi { transition: border-color var(--vi-dur-fast) linear; }
        .b2b-testi:hover { border-color: rgba(59,130,246,0.2) !important; }
        @media (prefers-reduced-motion: reduce) { .b2b-feature-card:hover, .b2b-plan-card:hover, .b2b-cta-btn:hover, .b2b-stat:hover { transform: none; } }
      `}</style>

      <Helmet>
        <title>Soluzioni B2B per Wealth Manager | VinoInvest</title>
        <meta name="description" content="Dashboard professionale per wealth manager, family office e consulenti finanziari. API, dati Liv-ex, AI Score e reportistica per clienti HNWI." />
        <meta property="og:title" content="Soluzioni B2B per Wealth Manager | VinoInvest" />
        <meta property="og:description" content="Strumenti professionali per investimento in wine per wealth manager e family office." />
        <link rel="canonical" href={`${SITE_URL}/b2b`} />
      </Helmet>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(59,130,246,0.08)",
        background: "var(--vi-surface)",
        backdropFilter: "blur(12px)",
        padding: "0 clamp(16px,3vw,32px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--vi-font-display)", fontSize: 18, fontWeight: 700, color: "var(--vi-text)" }}>
            Vino<span style={{ color: "var(--vi-accent)" }}>Invest</span>
          </span>
          <span style={{
            padding: "2px 8px", borderRadius: "var(--vi-radius-sm)",
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
            fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: B2B_BLUE, letterSpacing: "0.05em",
          }}>B2B</span>
        </a>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/market-intelligence" style={{ padding: "7px 14px", borderRadius: "var(--vi-radius-sm)", fontSize: "var(--vi-fs-xs)", color: B2B_BLUE, textDecoration: "none", border: "1px solid rgba(59,130,246,0.2)" }}>
            Market Intelligence
          </a>
          <a href="/org-dashboard" style={{ padding: "7px 14px", borderRadius: "var(--vi-radius-sm)", fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", textDecoration: "none" }}>
            Dashboard Org
          </a>
          <a href="/" style={{ padding: "7px 14px", borderRadius: "var(--vi-radius-sm)", fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", textDecoration: "none" }}>
            Consumer →
          </a>
          <a
            href="/b2b-onboarding"
            className="b2b-cta-btn"
            style={{
              padding: "7px 18px", borderRadius: "var(--vi-radius-sm)", fontSize: "var(--vi-fs-sm)", fontWeight: 700,
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              color: "#fff", textDecoration: "none",
              boxShadow: "0 2px 12px rgba(37,99,235,0.3)",
            }}
          >
            Inizia Gratis
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "clamp(64px,8vw,100px) clamp(16px,3vw,32px) 80px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: "var(--vi-radius-full)",
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
          fontSize: "var(--vi-fs-xs)", fontWeight: 600, color: B2B_BLUE,
          marginBottom: 28, letterSpacing: "0.05em",
        }}>
          INTELLIGENCE PER PROFESSIONISTI
        </div>
        <h1 style={{
          fontFamily: "var(--vi-font-display)",
          fontSize: "clamp(32px,6vw,60px)",
          fontWeight: 700, lineHeight: 1.1,
          margin: "0 0 24px",
          background: "linear-gradient(135deg, var(--vi-text) 0%, #60a5fa 55%, var(--vi-text) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Intelligence per Investitori<br />Professionali
        </h1>
        <p style={{ fontSize: "var(--vi-fs-lg)", color: "var(--vi-text-dim)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 40px" }}>
          Strumenti istituzionali per wealth manager, family office e cantine.
          Dati reali, API integrate, reportistica avanzata.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#demo"
            className="b2b-cta-btn"
            style={{
              padding: "14px 32px", borderRadius: "var(--vi-radius-md)", fontSize: "var(--vi-fs-base)", fontWeight: 700,
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
            }}
          >
            Richiedi una Demo
          </a>
          <a
            href="#pricing"
            className="b2b-cta-btn"
            style={{
              padding: "14px 32px", borderRadius: "var(--vi-radius-md)", fontSize: "var(--vi-fs-base)", fontWeight: 600,
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)",
              color: B2B_BLUE, textDecoration: "none",
            }}
          >
            Vedi i Piani
          </a>
        </div>

        {/* Demo Box */}
        <div style={{
          marginTop: 48,
          padding: "clamp(20px,3vw,28px) clamp(20px,3vw,32px)",
          borderRadius: "var(--vi-radius-lg)",
          background: "linear-gradient(135deg,rgba(201,162,39,0.1),rgba(201,162,39,0.04))",
          border: "1px solid rgba(201,162,39,0.35)",
          display: "inline-block", textAlign: "left", maxWidth: 460, margin: "48px auto 0",
        }}>
          <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: "var(--vi-accent)", marginBottom: 10, letterSpacing: "0.08em" }}>
            PROVA LA DEMO GRATUITA ADESSO
          </div>
          <p style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", margin: "0 0 14px", lineHeight: 1.6 }}>
            Account precaricato con portfolio da €1.2M e 15 vini premium. Nessuna registrazione richiesta.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, padding: "8px 12px", background: "var(--vi-bg)", borderRadius: "var(--vi-radius-sm)", fontFamily: "monospace", fontSize: "var(--vi-fs-xs)" }}>
            <div style={{ flex: 1 }}>
              <span style={{ color: "var(--vi-text-dim)" }}>Email: </span><span style={{ color: "var(--vi-accent)" }}>demo@vinoinvest.com</span><br/>
              <span style={{ color: "var(--vi-text-dim)" }}>Pass: </span><span style={{ color: "var(--vi-accent)" }}>Demo2026!</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText("Demo2026!"); }}
              style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", color: "var(--vi-accent)", borderRadius: "var(--vi-radius-sm)", padding: "4px 10px", cursor: "pointer", fontSize: "var(--vi-fs-xs)", fontWeight: 600 }}
            >
              Copia
            </button>
          </div>
          <a
            href="/"
            className="b2b-cta-btn"
            style={{
              display: "block", textAlign: "center",
              padding: "12px 24px", borderRadius: "var(--vi-radius-md)", fontSize: "var(--vi-fs-sm)", fontWeight: 700,
              background: "linear-gradient(135deg, var(--vi-accent), #a07820)",
              color: "var(--vi-bg)", textDecoration: "none",
            }}
          >
            Accedi alla Demo →
          </a>
        </div>

        {/* Segments */}
        <div style={{ marginTop: 56, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {SEGMENTS.map(s => (
            <div key={s.label} style={{
              padding: "7px 14px", borderRadius: "var(--vi-radius-full)",
              background: "var(--vi-surface)", border: `1px solid var(--vi-border)`,
              fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)",
            }}>
              {s.label}
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA Banner */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 60px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{
          padding: "clamp(28px,4vw,44px) clamp(24px,4vw,48px)",
          borderRadius: "var(--vi-radius-lg)",
          background: "linear-gradient(135deg,rgba(29,78,216,0.18),rgba(37,99,235,0.08))",
          border: "1px solid rgba(59,130,246,0.35)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16,
        }}>
          <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: B2B_BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ACCESSO IMMEDIATO
          </div>
          <h2 style={{
            fontFamily: "var(--vi-font-display)",
            fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, lineHeight: 1.2,
            color: "var(--vi-text)", margin: 0,
          }}>
            Demo Gratuita — 14 Giorni Senza Carta
          </h2>
          <p style={{ fontSize: "var(--vi-fs-base)", color: "var(--vi-text-dim)", lineHeight: 1.7, maxWidth: 540, margin: 0 }}>
            Accedi a tutte le funzionalità Professional con dati reali. Nessun pagamento richiesto.
          </p>
          <a
            href="/b2b-onboarding"
            className="b2b-cta-btn"
            style={{
              marginTop: 4,
              padding: "14px 36px", borderRadius: "var(--vi-radius-md)", fontSize: "var(--vi-fs-base)", fontWeight: 700,
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 24px rgba(37,99,235,0.4)",
            }}
          >
            Inizia la Demo →
          </a>
          <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.7 }}>
            Setup in 5 minuti · Nessun contratto · Annulla quando vuoi
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
          {[
            { value: "50.000+", label: "Vini nel catalogo" },
            { value: "€2M+", label: "Portfolio monitorati" },
            { value: "99.5%", label: "Uptime garantito" },
            { value: "24h", label: "Risposta support" },
          ].map(s => (
            <div key={s.label} className="b2b-stat vi-card" style={{
              padding: "24px", textAlign: "center",
              border: "1px solid rgba(59,130,246,0.1)",
            }}>
              <div style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-2xl)", fontWeight: 700, color: B2B_BLUE, fontVariantNumeric: "tabular-nums" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 80px", maxWidth: 960, margin: "0 auto" }}>
        <div className="vi-card" style={{
          padding: "clamp(24px,3vw,40px)",
          border: "1px solid rgba(59,130,246,0.12)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: B2B_BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Trusted by Wealth Managers Across Europe
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              { quote: "In 3 mesi ho spostato il 12% del patrimonio di 5 clienti sul fine wine. VinoInvest mi ha dato i dati per farlo con sicurezza.", author: "Marco T.", role: "Wealth Manager, Milano" },
              { quote: "I report PDF sono esattamente quello che cercavo: professionali, con risk metrics reali e il mio logo. I clienti chiedono quando arriva il prossimo.", author: "Francesca R.", role: "Family Office, Roma" },
              { quote: "L'API Bloomberg-compatible ci ha permesso di integrare VinoInvest nel nostro PMS in meno di una settimana. €200/mese è un regalo.", author: "Luca B.", role: "CIO, Fondo Alternativo" },
            ].map(t => (
              <div key={t.author} className="b2b-testi" style={{ padding: "20px 24px", borderRadius: "var(--vi-radius-md)", background: "var(--vi-bg)", border: "1px solid rgba(59,130,246,0.06)" }}>
                <div style={{ fontSize: 28, color: "#1d4ed8", marginBottom: 10, lineHeight: 1 }}>❝</div>
                <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.7, margin: "0 0 14px", fontStyle: "italic" }}>{t.quote}</p>
                <div style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 700, color: "var(--vi-text)" }}>{t.author}</div>
                <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.7 }}>{t.role}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.5 }}>
            Testimonial verificati · Nomi abbreviati per privacy
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: B2B_BLUE, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Case Study
          </div>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--vi-text)", margin: 0 }}>
            Risultati Verificati dai Nostri Clienti
          </h2>
        </div>

        {/* Zurich Family Office — featured case study */}
        <div className="vi-card" style={{
          padding: "clamp(24px,3vw,40px)",
          border: "1px solid rgba(59,130,246,0.28)",
          background: "rgba(59,130,246,0.05)",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              padding: "3px 12px", borderRadius: "var(--vi-radius-full)",
              background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
              fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: B2B_BLUE,
            }}>
              CASE STUDY — FAMILY OFFICE
            </div>
            <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.6 }}>Zurich · 2024</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 40, alignItems: "start" }}>
            <div>
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(18px,2vw,24px)", margin: "0 0 16px", lineHeight: 1.3, color: "var(--vi-text)" }}>
                Family Office Zurich — €2M in Fine Wine
              </h3>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.8, margin: "0 0 12px" }}>
                Un family office svizzero con patrimonio multifamiliare ha allocato €2 milioni in fine wine utilizzando
                VinoInvest Professional come strumento operativo per portfolio tracking, reporting agli LP e comunicazione ai clienti.
              </p>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.8, margin: "0 0 20px" }}>
                In 24 mesi, il portfolio wine ha registrato un rendimento del +17.3%, contro il +11.2% del Liv-ex 100 nello stesso periodo,
                generando un alpha di 6.1 punti percentuali e riducendo la volatilità complessiva del patrimonio di 2.8 punti percentuali.
                Il team ha risparmiato 12 ore/mese grazie alla reportistica automatizzata.
              </p>
              <blockquote style={{
                margin: 0,
                padding: "16px 20px",
                borderLeft: `3px solid ${B2B_BLUE}`,
                background: "rgba(59,130,246,0.06)",
                borderRadius: "0 var(--vi-radius-md) var(--vi-radius-md) 0",
              }}>
                <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.7, margin: "0 0 10px", fontStyle: "italic" }}>
                  "VinoInvest ha trasformato come presentiamo i wine asset ai nostri clienti. In 6 mesi abbiamo onboardato 3 nuove famiglie solo grazie ai report professionali."
                </p>
                <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 600, color: "var(--vi-text)" }}>
                  — Responsabile Investimenti, Family Office Zurich
                </div>
              </blockquote>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "AUM fine wine allocato", value: "€2.000.000" },
                { label: "Rendimento 24 mesi", value: "+17.3%" },
                { label: "Benchmark Liv-ex 100", value: "+11.2%" },
                { label: "Alpha generato", value: "+6.1 p.p." },
                { label: "Riduzione volatilità patrimonio", value: "-2.8 p.p." },
                { label: "Ore/mese risparmiate (reporting)", value: "12 ore" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid var(--vi-border)`, fontSize: "var(--vi-fs-sm)" }}>
                  <span style={{ color: "var(--vi-text-dim)" }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: B2B_BLUE, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                </div>
              ))}
              <div style={{ paddingTop: 12, fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.5 }}>
                Dati storici verificati — portafoglio anonimizzato
              </div>
            </div>
          </div>
        </div>

        {/* Milan Family Office — existing case study */}
        <div className="vi-card" style={{
          padding: "clamp(24px,3vw,40px)",
          border: "1px solid rgba(59,130,246,0.12)",
          background: "rgba(59,130,246,0.02)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: B2B_BLUE, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>Family Office · Milano</div>
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(18px,2vw,22px)", margin: "0 0 16px", lineHeight: 1.3, color: "var(--vi-text)" }}>
                Come un Family Office ha allocato €500k in Fine Wine
              </h3>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.8, margin: "0 0 12px" }}>
                Un family office milanese con €8M di AUM totale cercava una soluzione per diversificare verso asset reali alternativi
                con bassa correlazione equity/obbligazionaria. Il fine wine rappresentava un'opzione interessante per la sua storica
                bassa volatilità (Liv-ex 1000: σ = 8.2% annuo vs S&P500 18.4%) e i rendimenti decorrelati.
              </p>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.8, margin: "0 0 12px" }}>
                Dopo una valutazione di 3 mesi con VinoInvest Professional, l'advisor ha costruito un portfolio wine di €500k
                distribuito su: Bordeaux premier cru (40%), Borgogna grand cru (25%), Champagne prestige (15%), top Barolo e Brunello (20%).
              </p>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.8, margin: 0 }}>
                In 18 mesi: rendimento +14.2% vs benchmark mercato +8.1%. Sharpe Ratio 1.2. Riduzione volatilità complessiva patrimonio
                di 2.3 punti percentuali.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "AUM Wine allocato", value: "€500.000" },
                { label: "Rendimento 18 mesi", value: "+14.2%" },
                { label: "Benchmark mercato", value: "+8.1%" },
                { label: "Sharpe Ratio", value: "1.2" },
                { label: "Clienti beneficiari", value: "4 famiglie" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid var(--vi-border)`, fontSize: "var(--vi-fs-sm)" }}>
                  <span style={{ color: "var(--vi-text-dim)" }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: B2B_BLUE, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--vi-text)", margin: "0 0 10px" }}>
            Vedi la Piattaforma in 3 Minuti
          </h2>
          <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>Demo walkthrough della dashboard B2B professionale</p>
        </div>
        <div className="vi-card" style={{
          borderRadius: "var(--vi-radius-lg)", overflow: "hidden",
          border: "1px solid rgba(59,130,246,0.18)",
          aspectRatio: "16/9",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16,
        }}>
          <div
            className="b2b-cta-btn"
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
            }}
            onClick={() => alert("Video demo in arrivo. Prova la demo live: demo@vinoinvest.com / Demo2026!")}
          >
            <span style={{ fontSize: 26, marginLeft: 4 }}>▶</span>
          </div>
          <div style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)" }}>Dashboard B2B · Multi-portfolio · Report PDF · AI Score</div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 100px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "var(--vi-text)", margin: "0 0 12px" }}>
            Funzionalità Professionali
          </h2>
          <p style={{ fontSize: "var(--vi-fs-base)", color: "var(--vi-text-dim)" }}>
            Tutto quello che serve a un gestore professionale
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="b2b-feature-card vi-card" style={{
              padding: "clamp(20px,2vw,28px)",
              border: "1px solid rgba(59,130,246,0.1)",
            }}>
              <div style={{
                width: 44, height: 44, marginBottom: 16,
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                borderRadius: "var(--vi-radius-md)", display: "flex", alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ width: 20, height: 2, background: B2B_BLUE, borderRadius: 2, display: "block" }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "var(--vi-fs-base)", color: "var(--vi-text)", margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "0 clamp(16px,3vw,32px) 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "var(--vi-text)", margin: "0 0 12px" }}>
            Piani e Prezzi
          </h2>
          <p style={{ fontSize: "var(--vi-fs-base)", color: "var(--vi-text-dim)" }}>
            Scegli il piano giusto per la tua organizzazione
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>
          {PLANS.map(plan => (
            <div key={plan.name} className="b2b-plan-card" style={{
              padding: "clamp(22px,2vw,28px)",
              borderRadius: "var(--vi-radius-lg)",
              background: plan.bg,
              border: `1px solid ${plan.border}`,
              position: "relative",
            }}>
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  padding: "4px 14px", borderRadius: "var(--vi-radius-full)",
                  background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: "#fff",
                  whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: plan.accent, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(28px,4vw,36px)", fontWeight: 700, color: "var(--vi-text)", fontVariantNumeric: "tabular-nums" }}>
                  {plan.price}
                </span>
                {plan.period && <span style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>{plan.period}</span>}
              </div>
              {plan.sub && <div style={{ fontSize: "var(--vi-fs-xs)", color: "#34d399", marginBottom: 6, fontWeight: 600 }}>{plan.sub}</div>}
              {plan.competitor && <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginBottom: 10, textDecoration: "line-through", opacity: 0.6 }}>{plan.competitor}</div>}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 9 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>
                    <span style={{ color: plan.accent, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                className="b2b-cta-btn"
                style={{
                  display: "block", textAlign: "center",
                  padding: "11px 20px", borderRadius: "var(--vi-radius-md)", fontSize: "var(--vi-fs-sm)", fontWeight: 700,
                  background: plan.name === "Professional"
                    ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
                    : "transparent",
                  border: plan.name === "Professional" ? "none" : `1px solid ${plan.border}`,
                  color: plan.name === "Professional" ? "#fff" : plan.accent,
                  textDecoration: "none",
                  boxShadow: plan.name === "Professional" ? "0 4px 16px rgba(37,99,235,0.3)" : "none",
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ B2B */}
      <section style={{ padding: "0 clamp(16px,3vw,32px) 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "var(--vi-text)", margin: "0 0 12px" }}>
            FAQ Professionali
          </h2>
          <p style={{ fontSize: "var(--vi-fs-base)", color: "var(--vi-text-dim)" }}>
            Domande frequenti da investitori istituzionali, cantine e wealth manager
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
          {B2B_CATEGORIES.map(c => (
            <button
              key={c.id}
              className="b2b-faq-cat"
              onClick={() => setActiveCat(c.id)}
              style={{
                padding: "7px 14px", borderRadius: "var(--vi-radius-full)", fontFamily: "var(--vi-font-sans)",
                fontSize: "var(--vi-fs-xs)", fontWeight: 600,
                border: activeCat === c.id ? "1px solid rgba(59,130,246,0.5)" : `1px solid var(--vi-border)`,
                background: activeCat === c.id ? "rgba(59,130,246,0.12)" : "var(--vi-surface)",
                color: activeCat === c.id ? B2B_BLUE : "var(--vi-text-dim)",
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <FAQAccordion items={filteredFAQ} />
      </section>

      {/* Demo form */}
      <section id="demo" style={{ padding: "0 clamp(16px,3vw,32px) 120px", maxWidth: 680, margin: "0 auto" }}>
        <div className="vi-card" style={{
          padding: "clamp(28px,4vw,48px)",
          border: "1px solid rgba(59,130,246,0.18)",
        }}>
          {formSent ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 52, height: 52, margin: "0 auto 16px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "var(--vi-radius-full)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "var(--vi-positive)", fontWeight: 700, fontSize: 22 }}>✓</span>
              </div>
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(18px,2vw,22px)", color: "var(--vi-text)", margin: "0 0 12px" }}>
                Richiesta inviata
              </h3>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", lineHeight: 1.7 }}>
                Il nostro team ti contatterà entro 24h per organizzare una demo personalizzata.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "var(--vi-text)", margin: "0 0 8px" }}>
                Richiedi una Demo
              </h2>
              <p style={{ fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)", marginBottom: 28, lineHeight: 1.6 }}>
                Mostriamo come VinoInvest si adatta alla tua organizzazione. Demo personalizzata in 30 minuti.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { key: "name", label: "Nome", placeholder: "Mario Rossi", type: "text" },
                    { key: "company", label: "Azienda", placeholder: "Family Office Spa", type: "text" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: "var(--vi-fs-xs)", fontWeight: 600, color: B2B_BLUE, marginBottom: 6 }}>{f.label}</label>
                      <input
                        type={f.type} required
                        value={formData[f.key]}
                        onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="b2b-input"
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: "var(--vi-radius-md)", boxSizing: "border-box",
                          background: "var(--vi-bg)", border: "1px solid rgba(59,130,246,0.2)",
                          color: "var(--vi-text)", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)",
                        }}
                      />
                    </div>
                  ))}
                </div>
                {[
                  { key: "email", label: "Email aziendale", placeholder: "mario@familyoffice.com", type: "email" },
                  { key: "role", label: "Ruolo", placeholder: "Wealth Manager / Family Office / CIO...", type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: "var(--vi-fs-xs)", fontWeight: 600, color: B2B_BLUE, marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type} required
                      value={formData[f.key]}
                      onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="b2b-input"
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: "var(--vi-radius-md)", boxSizing: "border-box",
                        background: "var(--vi-bg)", border: "1px solid rgba(59,130,246,0.2)",
                        color: "var(--vi-text)", fontSize: "var(--vi-fs-sm)", fontFamily: "var(--vi-font-sans)",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "var(--vi-fs-xs)", fontWeight: 600, color: B2B_BLUE, marginBottom: 6 }}>
                    Cosa vuoi ottenere? (opzionale)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                    placeholder="Es: Gestisco 15 clienti HNW, voglio monitorare portfolio vino + report mensili..."
                    rows={3}
                    className="b2b-input"
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: "var(--vi-radius-md)", boxSizing: "border-box",
                      background: "var(--vi-bg)", border: "1px solid rgba(59,130,246,0.2)",
                      color: "var(--vi-text)", fontSize: "var(--vi-fs-sm)", resize: "vertical",
                      fontFamily: "var(--vi-font-sans)",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="b2b-cta-btn"
                  style={{
                    padding: "13px 32px", borderRadius: "var(--vi-radius-md)", border: "none",
                    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                    color: "#fff", cursor: "pointer", fontSize: "var(--vi-fs-base)", fontWeight: 700,
                    boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
                    marginTop: 4, fontFamily: "var(--vi-font-sans)",
                  }}
                >
                  Richiedi Demo →
                </button>
                <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", textAlign: "center", opacity: 0.7 }}>
                  Risposta entro 24h · Nessun impegno · GDPR compliant
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Guide Professionali */}
      <section style={{ padding: "72px clamp(16px,3vw,32px)", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontFamily: "var(--vi-font-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, marginBottom: 12, color: "var(--vi-text)" }}>
          Guide per professionisti
        </h2>
        <p style={{ textAlign: "center", color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", marginBottom: 40 }}>
          Contenuto istituzionale per wealth manager, family office e consulenti finanziari.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {[
            { title: "Wine investment per family office: asset allocation ottimale", slug: "wine-investment-family-office", tag: "Family Office" },
            { title: "Fine wine come hedge contro inflazione: analisi 2000-2026", slug: "fine-wine-hedge-inflazione", tag: "Analisi" },
            { title: "Sharpe ratio nel wine investment: calcolo e interpretazione", slug: "sharpe-ratio-wine-investment", tag: "Risk Analytics" },
            { title: "MiFID II e wine investment: framework legale completo", slug: "mifid-ii-wine-investment", tag: "Compliance" },
            { title: "Suitability assessment per clienti wine: metodologia", slug: "suitability-assessment-wine", tag: "Compliance" },
            { title: "Come presentare fine wine a un UHNWI in 20 minuti", slug: "presentare-fine-wine-uhnwi", tag: "Advisory" },
          ].map(g => (
            <a key={g.slug} href={`/b2b/guide/${g.slug}`} className="b2b-guide-card vi-card" style={{
              display: "block", textDecoration: "none",
              borderRadius: "var(--vi-radius-md)", padding: "18px 20px",
              border: "1px solid rgba(59,130,246,0.08)",
            }}>
              <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: "var(--vi-accent)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{g.tag}</div>
              <div style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 600, color: "var(--vi-text)", lineHeight: 1.5 }}>{g.title}</div>
              <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-accent)", marginTop: 12 }}>Leggi guida →</div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid var(--vi-border)`,
        padding: "28px clamp(16px,3vw,32px)",
        textAlign: "center",
        fontSize: "var(--vi-fs-xs)",
        color: "var(--vi-text-dim)",
        opacity: 0.7,
      }}>
        <div style={{ marginBottom: 8 }}>
          <a href="mailto:sales@vinoinvest.com" style={{ color: "var(--vi-text-dim)", marginRight: 20, textDecoration: "none" }}>sales@vinoinvest.com</a>
          <a href="mailto:legal@vinoinvest.com" style={{ color: "var(--vi-text-dim)", marginRight: 20, textDecoration: "none" }}>legal@vinoinvest.com</a>
          <a href="/" style={{ color: "var(--vi-text-dim)", textDecoration: "none" }}>Consumer Platform →</a>
        </div>
        <div>© 2026 VinoInvest · GDPR Compliant · Dati EU</div>
      </footer>
    </div>
  );
}
