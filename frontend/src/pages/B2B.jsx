import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FAQ, B2B_CATS, B2B_CATEGORIES } from "../data/faq.js";

const FAQ_B2B = FAQ.filter(f => B2B_CATS.has(f.cat));

function FAQAccordion({ items }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map(item => (
        <div key={item.id} style={{
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 12,
          overflow: "hidden",
          transition: "border-color 0.2s",
          ...(openId === item.id ? { borderColor: "rgba(59,130,246,0.5)" } : {}),
        }}>
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            style={{
              width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 12, padding: "14px 20px",
              background: openId === item.id ? "rgba(59,130,246,0.08)" : "rgba(8,15,30,0.6)",
              border: "none", cursor: "pointer", color: "#e2e8f0",
              fontSize: 14, fontWeight: openId === item.id ? 600 : 500, lineHeight: 1.4,
              transition: "background 0.2s",
            }}
          >
            <span style={{ flex: 1 }}>{item.q}</span>
            <span style={{
              fontSize: 20, color: "#60a5fa", flexShrink: 0,
              transition: "transform 0.25s",
              transform: openId === item.id ? "rotate(180deg)" : "rotate(0deg)",
            }}>›</span>
          </button>
          {openId === item.id && (
            <div style={{
              padding: "16px 20px",
              background: "rgba(4,8,20,0.8)",
              fontSize: 14, color: "#94a3b8", lineHeight: 1.8,
              borderTop: "1px solid rgba(59,130,246,0.15)",
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
  {
    icon: "📊",
    title: "Analytics Avanzati",
    desc: "Dashboard dedicata con dati di mercato in tempo reale, trend per regione e annata, correlazione con altri asset class.",
  },
  {
    icon: "👥",
    title: "Multi-Portfolio",
    desc: "Gestisci portfolio separati per ogni cliente. Performance aggregate, P&L per posizione, report individuali.",
  },
  {
    icon: "📄",
    title: "Report PDF Branded",
    desc: "Genera report professionali in un click: composizione, YTD, benchmark, outlook AI. Brandizzabili con il tuo logo.",
  },
  {
    icon: "🔌",
    title: "API & Integrazioni",
    desc: "REST API documentata. Export CSV/XLSX compatibile con Bloomberg, Advent Geneva e i principali PMS.",
  },
  {
    icon: "⚖️",
    title: "GDPR & DPA",
    desc: "Conformità GDPR completa. Data Processing Agreement disponibile per clienti B2B. Dati conservati in EU.",
  },
  {
    icon: "🎯",
    title: "Support Dedicato",
    desc: "Account manager dedicato, risposta entro 4h su Slack o email. Onboarding assistito per il tuo team.",
  },
];

const PLANS = [
  {
    name: "Starter B2B",
    price: "Gratis",
    period: "30 giorni",
    color: "#C9A227",
    border: "rgba(201,162,39,0.3)",
    bg: "rgba(201,162,39,0.05)",
    badge: null,
    sub: "Poi €0 — fino a 3 clienti",
    competitor: null,
    features: [
      "3 portfolio clienti",
      "Dashboard B2B base",
      "Report PDF standard",
      "Risk metrics base",
      "Export CSV",
      "Support email",
    ],
    cta: "Inizia gratis 30gg →",
    ctaHref: "/b2b-onboarding",
  },
  {
    name: "Professional",
    price: "€200",
    period: "/mese",
    color: "#60a5fa",
    border: "rgba(59,130,246,0.5)",
    bg: "rgba(59,130,246,0.06)",
    badge: "Più popolare",
    sub: "Risparmia €600 vs Cult Wines Intelligence",
    competitor: "Cult Wines Intelligence: €800/mese",
    features: [
      "20 portfolio clienti",
      "Dashboard B2B completa",
      "Report PDF branded + logo",
      "Risk metrics avanzati (Sharpe, VaR, MDD)",
      "Benchmark S&P500 / Gold / Inflazione",
      "API 10.000 req/giorno",
      "Market Intelligence B2B",
      "Export Bloomberg CSV",
      "DPA incluso · Support dedicato",
    ],
    cta: "Richiedi Demo →",
    ctaHref: "/b2b-onboarding",
  },
  {
    name: "Enterprise",
    price: "€500",
    period: "/mese",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.4)",
    bg: "rgba(167,139,250,0.05)",
    badge: "White-Label",
    sub: "SLA 99.9% · Account manager dedicato",
    competitor: null,
    features: [
      "Portfolio clienti illimitati",
      "Tutto di Professional",
      "White-label: logo + colori + dominio",
      "API illimitata + webhook real-time",
      "SLA 99.9% garantito",
      "Account manager dedicato",
      "Integrazione Bloomberg/Advent Geneva",
      "Report completamente brandizzati",
      "Onboarding assistito team",
    ],
    cta: "Contatta Sales →",
    ctaHref: "mailto:sales@vinoinvest.com?subject=Enterprise%20Inquiry",
  },
];

const SEGMENTS = [
  { icon: "🏦", label: "Family Office" },
  { icon: "📈", label: "Wealth Manager" },
  { icon: "🍾", label: "Cantine" },
  { icon: "🏛️", label: "Fondi d'Investimento" },
  { icon: "⚖️", label: "Fiduciari" },
  { icon: "🔬", label: "Analisti" },
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0b1220 0%,#040810 50%,#0b1220 100%)",
      color: "#e2e8f0",
      fontFamily: "'Inter',Arial,sans-serif",
    }}>
      <Helmet>
        <title>Soluzioni B2B per Wealth Manager | VinoInvest</title>
        <meta name="description" content="Dashboard professionale per wealth manager, family office e consulenti finanziari. API, dati Liv-ex, AI Score e reportistica per clienti HNWI." />
        <meta property="og:title" content="Soluzioni B2B per Wealth Manager | VinoInvest" />
        <meta property="og:description" content="Strumenti professionali per investimento in wine per wealth manager e family office." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/b2b" />
      </Helmet>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        background: "rgba(2,6,23,0.9)",
        backdropFilter: "blur(12px)",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🍷</span>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
            VinoInvest
          </span>
          <span style={{
            padding: "2px 8px", borderRadius: 6,
            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
            fontSize: 10, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.05em",
          }}>B2B</span>
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/market-intelligence" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, color: "#60a5fa", textDecoration: "none", border: "1px solid rgba(59,130,246,0.2)" }}>
            Market Intelligence
          </a>
          <a href="/org-dashboard" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>
            Dashboard Org
          </a>
          <a href="/" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>
            Consumer →
          </a>
          <a
            href="/b2b-onboarding"
            style={{
              padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
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
      <section style={{ padding: "100px 32px 80px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 100,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          fontSize: 12, fontWeight: 600, color: "#60a5fa",
          marginBottom: 28, letterSpacing: "0.05em",
        }}>
          INTELLIGENCE PER PROFESSIONISTI
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(36px,6vw,64px)",
          fontWeight: 700, lineHeight: 1.1,
          margin: "0 0 24px",
          background: "linear-gradient(135deg,#e2e8f0 0%,#60a5fa 50%,#e2e8f0 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Intelligence per Investitori<br />Professionali
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 40px" }}>
          Strumenti istituzionali per wealth manager, family office e cantine.
          Dati reali, API integrate, reportistica avanzata.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#demo"
            style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
              color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 24px rgba(37,99,235,0.35)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
          >
            Richiedi una Demo
          </a>
          <a
            href="#pricing"
            style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)",
              color: "#60a5fa", textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; }}
          >
            Vedi i Piani
          </a>
        </div>

        {/* Segments */}
        <div style={{ marginTop: 60, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {SEGMENTS.map(s => (
            <div key={s.label} style={{
              padding: "8px 16px", borderRadius: 100,
              background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.6)",
              fontSize: 12, color: "#64748b",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>{s.icon}</span> {s.label}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 32px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16,
        }}>
          {[
            { value: "50.000+", label: "Vini nel catalogo" },
            { value: "€2M+", label: "Portfolio monitorati" },
            { value: "99.5%", label: "Uptime garantito" },
            { value: "24h", label: "Risposta support" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "24px", borderRadius: 16, textAlign: "center",
              background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)",
            }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#60a5fa" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#3a5a7a", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ padding: "0 32px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{
          padding: "32px 40px", borderRadius: 20,
          background: "linear-gradient(135deg,rgba(8,15,30,0.8),rgba(15,25,50,0.8))",
          border: "1px solid rgba(59,130,246,0.15)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 8 }}>
              TRUSTED BY WEALTH MANAGERS ACROSS EUROPE
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              {
                quote: "In 3 mesi ho spostato il 12% del patrimonio di 5 clienti sul fine wine. VinoInvest mi ha dato i dati per farlo con sicurezza.",
                author: "Marco T.", role: "Wealth Manager, Milano",
              },
              {
                quote: "I report PDF sono esattamente quello che cercavo: professionali, con risk metrics reali e il mio logo. I clienti chiedono quando arriva il prossimo.",
                author: "Francesca R.", role: "Family Office, Roma",
              },
              {
                quote: "L'API Bloomberg-compatible ci ha permesso di integrare VinoInvest nel nostro PMS in meno di una settimana. €200/mese è un regalo.",
                author: "Luca B.", role: "CIO, Fondo Alternativo",
              },
            ].map(t => (
              <div key={t.author} style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(4,8,20,0.6)", border: "1px solid rgba(59,130,246,0.08)" }}>
                <div style={{ fontSize: 28, color: "#1d4ed8", marginBottom: 10, lineHeight: 1 }}>❝</div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic" }}>{t.quote}</p>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{t.author}</div>
                <div style={{ fontSize: 11, color: "#3a5a7a" }}>{t.role}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#334155" }}>
            📍 Testimonial verificati · Nomi abbreviati per privacy
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section style={{ padding: "0 32px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{
          padding: "36px 40px", borderRadius: 20,
          background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.08em", marginBottom: 12 }}>CASE STUDY</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, margin: "0 0 16px", lineHeight: 1.3, color: "#e2e8f0" }}>
                Come un Family Office ha allocato €500k in Fine Wine
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, margin: 0 }}>
                Un family office milanese con €8M di AUM totale voleva diversificare verso asset reali alternativi.
                In 6 mesi, utilizzando VinoInvest Professional, ha costruito un portfolio wine di €500k con Sharpe Ratio 1.2
                e rendimento +14.8% vs +11.7% S&P500 nello stesso periodo.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "AUM Wine allocato", value: "€500.000" },
                { label: "Rendimento 12 mesi", value: "+14.8%" },
                { label: "vs S&P500 (stesso periodo)", value: "+3.1pp" },
                { label: "Sharpe Ratio", value: "1.2" },
                { label: "Clienti beneficiari", value: "4 famiglie" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(59,130,246,0.08)", fontSize: 13 }}>
                  <span style={{ color: "#475569" }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: "#60a5fa" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 32px 100px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "#e2e8f0", margin: "0 0 12px" }}>
            Funzionalità Professionali
          </h2>
          <p style={{ fontSize: 15, color: "#475569" }}>
            Tutto quello che serve a un gestore professionale
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              padding: "28px", borderRadius: 16,
              background: "rgba(8,15,30,0.5)", border: "1px solid rgba(59,130,246,0.12)",
              transition: "border-color 0.2s, transform 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.12)"; e.currentTarget.style.transform = ""; }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "#e2e8f0", margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "0 32px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "#e2e8f0", margin: "0 0 12px" }}>
            Piani e Prezzi
          </h2>
          <p style={{ fontSize: 15, color: "#475569" }}>
            Scegli il piano giusto per la tua organizzazione
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              padding: "28px", borderRadius: 20,
              background: plan.bg, border: `1px solid ${plan.border}`,
              position: "relative",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
            >
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  padding: "4px 14px", borderRadius: 100,
                  background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  fontSize: 11, fontWeight: 700, color: "#fff",
                  whiteSpace: "nowrap",
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 700, color: "#e2e8f0" }}>
                  {plan.price}
                </span>
                {plan.period && <span style={{ fontSize: 14, color: "#475569" }}>{plan.period}</span>}
              </div>
              {plan.sub && <div style={{ fontSize: 11, color: "#34d399", marginBottom: 8, fontWeight: 600 }}>{plan.sub}</div>}
              {plan.competitor && <div style={{ fontSize: 10, color: "#334155", marginBottom: 12, textDecoration: "line-through" }}>{plan.competitor}</div>}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#94a3b8" }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                style={{
                  display: "block", textAlign: "center",
                  padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: plan.name === "Professional"
                    ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
                    : `rgba(${plan.color === "#C9A227" ? "201,162,39" : plan.color === "#60a5fa" ? "59,130,246" : "167,139,250"},0.12)`,
                  border: plan.name === "Professional" ? "none" : `1px solid ${plan.border}`,
                  color: plan.name === "Professional" ? "#fff" : plan.color,
                  textDecoration: "none",
                  boxShadow: plan.name === "Professional" ? "0 4px 16px rgba(37,99,235,0.35)" : "none",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ B2B */}
      <section style={{ padding: "0 32px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: "#e2e8f0", margin: "0 0 12px" }}>
            FAQ Professionali
          </h2>
          <p style={{ fontSize: 15, color: "#475569" }}>
            Domande frequenti da investitori istituzionali, cantine e wealth manager
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
          {B2B_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                padding: "7px 14px", borderRadius: 100, cursor: "pointer",
                fontSize: 12, fontWeight: 600,
                border: activeCat === c.id ? "1px solid rgba(59,130,246,0.6)" : "1px solid rgba(30,41,59,0.5)",
                background: activeCat === c.id ? "rgba(59,130,246,0.15)" : "rgba(8,15,30,0.6)",
                color: activeCat === c.id ? "#60a5fa" : "#4a6a8a",
                transition: "all 0.15s",
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <FAQAccordion items={filteredFAQ} />
      </section>

      {/* Demo form */}
      <section id="demo" style={{ padding: "0 32px 120px", maxWidth: 680, margin: "0 auto" }}>
        <div style={{
          padding: "48px", borderRadius: 24,
          background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}>
          {formSent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#e2e8f0", margin: "0 0 12px" }}>
                Richiesta inviata!
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
                Il nostro team ti contatterà entro 24h per organizzare una demo personalizzata.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#e2e8f0", margin: "0 0 8px" }}>
                Richiedi una Demo
              </h2>
              <p style={{ fontSize: 14, color: "#475569", marginBottom: 28, lineHeight: 1.6 }}>
                Mostriamo come VinoInvest si adatta alla tua organizzazione. Demo personalizzata in 30 minuti.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { key: "name", label: "Nome", placeholder: "Mario Rossi", type: "text" },
                    { key: "company", label: "Azienda", placeholder: "Family Office Spa", type: "text" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 6 }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        required
                        value={formData[f.key]}
                        onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 10, boxSizing: "border-box",
                          background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)",
                          color: "#e2e8f0", fontSize: 13, outline: "none",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"}
                      />
                    </div>
                  ))}
                </div>
                {[
                  { key: "email", label: "Email aziendale", placeholder: "mario@familyoffice.com", type: "email" },
                  { key: "role", label: "Ruolo", placeholder: "Wealth Manager / Family Office / CIO...", type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      required
                      value={formData[f.key]}
                      onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 10, boxSizing: "border-box",
                        background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)",
                        color: "#e2e8f0", fontSize: 13, outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 6 }}>
                    Cosa vuoi ottenere? (opzionale)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                    placeholder="Es: Gestisco 15 clienti HNW, voglio monitorare portfolio vino + report mensili..."
                    rows={3}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10, boxSizing: "border-box",
                      background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)",
                      color: "#e2e8f0", fontSize: 13, outline: "none", resize: "vertical",
                      fontFamily: "'Inter',Arial,sans-serif",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "13px 32px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                    color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 700,
                    boxShadow: "0 4px 24px rgba(37,99,235,0.4)",
                    transition: "transform 0.2s",
                    marginTop: 4,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  Richiedi Demo →
                </button>
                <div style={{ fontSize: 11, color: "#3a5a7a", textAlign: "center" }}>
                  Risposta entro 24h · Nessun impegno · GDPR compliant
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(59,130,246,0.1)",
        padding: "32px",
        textAlign: "center",
        fontSize: 12,
        color: "#1e293b",
      }}>
        <div style={{ marginBottom: 8 }}>
          <a href="mailto:sales@vinoinvest.com" style={{ color: "#3a5a7a", marginRight: 20, textDecoration: "none" }}>sales@vinoinvest.com</a>
          <a href="mailto:legal@vinoinvest.com" style={{ color: "#3a5a7a", marginRight: 20, textDecoration: "none" }}>legal@vinoinvest.com</a>
          <a href="/" style={{ color: "#3a5a7a", textDecoration: "none" }}>Consumer Platform →</a>
        </div>
        <div>© 2025 VinoInvest · GDPR Compliant · Dati EU</div>
      </footer>

      <style>{`
        @keyframes faqExpand {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
