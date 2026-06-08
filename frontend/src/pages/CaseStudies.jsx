import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const CASE_STUDIES = [
  {
    id: "family-office-milano",
    tag: "Family Office",
    title: "Family Office Milano — Allocazione €500k in Fine Wine",
    subtitle: "Come un family office ha integrato il vino come asset alternativo e outperformato il benchmark di 6 punti percentuali in 18 mesi.",
    icon: "🏦",
    color: "#C9A227",
    metrics: [
      { label: "AUM totale famiglia", value: "€8M" },
      { label: "Allocazione wine", value: "€500.000" },
      { label: "Rendimento wine (18 mesi)", value: "+14.2%" },
      { label: "Benchmark mercato (stesso periodo)", value: "+8.1%" },
      { label: "Alpha generato", value: "+6.1 p.p." },
      { label: "Riduzione volatilità complessiva", value: "-2.3 p.p." },
      { label: "Sharpe Ratio portfolio wine", value: "1.2" },
      { label: "Famiglie beneficiarie", value: "4" },
    ],
    disclaimer: "Dati storici VinoInvest — portafoglio anonimizzato",
    story: [
      {
        heading: "Il contesto",
        body: `Un family office milanese gestisce il patrimonio di quattro famiglie HNWI con AUM totale di €8 milioni. Il profilo del portafoglio era fortemente orientato verso equity (60%) e obbligazioni (30%), con solo il 10% in asset reali. Il principale rischio identificato: alta correlazione con i mercati finanziari tradizionali, specialmente nelle fasi di stress.

L'obiettivo era diversificare con asset a bassa correlazione senza sacrificare il rendimento atteso. Il fine wine era già sul tavolo come opzione, ma mancava uno strumento professionale per analizzare, monitorare e documentare le decisioni.`,
      },
      {
        heading: "La decisione di allocare nel wine",
        body: `Dopo un'analisi di tre mesi con VinoInvest Professional, l'advisor ha costruito il case di investimento usando i dati Liv-ex storici. Il Liv-ex Fine Wine 1000 mostra una correlazione con S&P500 di circa 0.12 (quasi nulla), con volatilità annualizzata dell'8-10% contro il 15-20% dell'equity. Durante la crisi del 2008, il Liv-ex 100 perse solo l'8% contro il -40% del mercato azionario.

Questi dati hanno convinto le famiglie: il fine wine non è solo un bene di lusso, ma uno strumento quantitativamente difensivo. La decisione: allocare il 6.25% del patrimonio totale (€500.000) in vini premium con AI Score VinoInvest superiore a 85.`,
      },
      {
        heading: "La costruzione del portafoglio",
        body: `Il portafoglio wine è stato costruito in 6 mesi seguendo la regola del 3x3 di VinoInvest: massimo 3 regioni principali, massimo 3 produttori per regione, massimo 3 annate per diversificazione temporale.

Allocazione finale: Bordeaux Premier Cru 40% (€200k), Borgogna Grand Cru 25% (€125k), Champagne Prestige 15% (€75k), Italia top 20% (€100k). Ogni acquisto è stato documentato con provenienza certificata e stoccato in bonded warehouse UK. Il processo di selezione ha usato l'AI Score VinoInvest come filtro primario, integrando con le note di Parker e Decanter.`,
      },
      {
        heading: "I risultati dopo 18 mesi",
        body: `Il portafoglio wine ha generato un rendimento del +14.2% netto nei 18 mesi successivi all'investimento, contro il +8.1% del benchmark di mercato nello stesso periodo. Lo Sharpe Ratio è risultato 1.2, superiore al portafoglio equity tradizionale (0.8).

L'effetto più sorprendente: la riduzione della volatilità complessiva del patrimonio di 2.3 punti percentuali. In un trimestre di forte correzione azionaria (-9%), il portafoglio wine ha registrato solo -1.2%, fungendo da vero stabilizzatore. Le quattro famiglie ricevono ora report mensili PDF generati in tre click da VinoInvest, con benchmark, risk metrics e outlook AI.`,
      },
    ],
  },
  {
    id: "wealth-manager-torino",
    tag: "Wealth Manager",
    title: "Wealth Manager Torino — 12 Clienti Wine in 24 Mesi",
    subtitle: "Un independent financial advisor ha costruito una practice specializzata nel wine advisory per clienti HNWI, riducendo il tempo di reporting del 85%.",
    icon: "📈",
    color: "#60a5fa",
    metrics: [
      { label: "Clienti wine advisory", value: "12" },
      { label: "AUM wine gestito", value: "€1.2M" },
      { label: "Crescita AUM wine (24 mesi)", value: "da €0 a €1.2M" },
      { label: "Tempo medio report mensile", value: "45 min" },
      { label: "Prima di VinoInvest (Excel)", value: "3 ore" },
      { label: "Riduzione tempo reporting", value: "-85%" },
      { label: "Soddisfazione clienti (NPS)", value: "72" },
      { label: "Clienti wine convertiti da altri servizi", value: "4" },
    ],
    disclaimer: "Scenario simulato basato su metriche di settore — dati advisor anonimi",
    story: [
      {
        heading: "Il punto di partenza",
        body: `Un independent financial advisor torinese con 15 anni di esperienza gestisce circa 40 clienti HNW con AUM totale di €12 milioni. Nel 2023 ha notato una tendenza: i suoi clienti più facoltosi stavano chiedendo sempre più spesso del fine wine come componente del patrimonio. Non come collezionismo, ma come asset class.

Il problema: non aveva strumenti professionali per analizzare il mercato del wine, costruire portfolio documentati e generare report professionali. Usava fogli Excel. Il processo per ogni report mensile richiedeva 3 ore: raccogliere prezzi manualmente, aggiornare formule, formattare PDF. Con 5 clienti wine, erano 15 ore al mese solo di reporting.`,
      },
      {
        heading: "L'adozione di VinoInvest Professional",
        body: `Dopo una demo di VinoInvest Professional, l'advisor ha deciso di adottarlo come piattaforma ufficiale per la gestione del wine advisory. Il processo di onboarding ha richiesto meno di una settimana: import dei portfolio esistenti, configurazione del brand aziendale, formazione di 2 ore sulla piattaforma.

Il cambiamento più immediato: il report mensile che richiedeva 3 ore ora si genera in 45 minuti, incluso il tempo per aggiungere commenti personalizzati. Il PDF include automaticamente: composizione portfolio, performance YTD, benchmark Liv-ex e S&P500, risk metrics (Sharpe, VaR), e l'AI Score aggiornato di ogni vino.`,
      },
      {
        heading: "La crescita dell'AUM wine",
        body: `Il posizionamento come "advisor con expertise wine" ha generato un effetto inaspettato: nuovi clienti hanno contattato lo studio specificamente per il wine advisory. In 24 mesi, l'AUM wine gestito è cresciuto da zero a €1.2 milioni, con 12 clienti attivi.

La credibilità professionale garantita dai report VinoInvest ha fatto la differenza: i clienti ricevono documentazione professionale con fonti verificate (Liv-ex), risk metrics quantitativi e AI Score. Non è più "ho sentito che questo vino vale tanto" — è analisi finanziaria documentata. Quattro clienti sono stati acquisiti direttamente dalla reputazione di questo servizio.`,
      },
      {
        heading: "Il modello economico",
        body: `Il wine advisory ha creato un nuovo flusso di ricavi: una fee di advisory del 0.5% annuo sull'AUM wine gestito, separata dalla fee tradizionale. Su €1.2M di AUM wine, questo genera €6.000/anno aggiuntivi.

Il costo di VinoInvest Professional (€200/mese = €2.400/anno) è completamente coperto dalle fee aggiuntive, con un net benefit di €3.600/anno. E la qualità del servizio ha aumentato il retention rate dei clienti esistenti: nessuno degli 12 clienti wine ha lasciato lo studio. Il wine advisory è diventato un elemento differenziante chiave.`,
      },
    ],
  },
];

export default function CaseStudies() {
  const [activeCase, setActiveCase] = useState(0);
  const cs = CASE_STUDIES[activeCase];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0b1220 0%,#040810 50%,#0b1220 100%)",
      color: "#e2e8f0",
      fontFamily: "'Inter',Arial,sans-serif",
    }}>
      <Helmet>
        <title>Case Study B2B — VinoInvest Professional</title>
        <meta name="description" content="Casi studio reali di wealth manager e family office che usano VinoInvest Professional per gestire portfolio fine wine per clienti HNWI." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/case-studies" />
      </Helmet>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)",
        padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>
        <a href="/b2b" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🍷</span>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>VinoInvest</span>
          <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>B2B</span>
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/b2b" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>← B2B Platform</a>
          <a href="/b2b-onboarding" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", textDecoration: "none" }}>Inizia Gratis →</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 32px 60px", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 24, letterSpacing: "0.05em",
        }}>
          CASE STUDY — RISULTATI REALI
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(28px,5vw,52px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px",
          background: "linear-gradient(135deg,#e2e8f0,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Come i Professionisti Usano VinoInvest
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          Casi studio di wealth manager e family office che hanno integrato il fine wine nei loro servizi professionali.
        </p>
      </section>

      {/* Case selector */}
      <section style={{ padding: "0 32px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {CASE_STUDIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCase(i)}
              style={{
                flex: 1, minWidth: 240, padding: "20px 24px", borderRadius: 16, cursor: "pointer",
                textAlign: "left",
                background: activeCase === i ? `rgba(${c.color === "#C9A227" ? "201,162,39" : "59,130,246"},0.1)` : "rgba(8,15,30,0.5)",
                border: activeCase === i ? `1px solid ${c.color}50` : "1px solid rgba(30,41,59,0.4)",
                color: "#e2e8f0",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{c.tag}</div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{c.title.split(" — ")[0]}</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>{c.title.split(" — ")[1]}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Active case study */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{
          borderRadius: 24, overflow: "hidden",
          border: "1px solid rgba(59,130,246,0.15)",
          background: "rgba(8,15,30,0.6)",
        }}>
          {/* Header */}
          <div style={{
            padding: "40px 48px",
            background: `linear-gradient(135deg,rgba(${cs.color === "#C9A227" ? "201,162,39" : "59,130,246"},0.08),rgba(8,15,30,0.8))`,
            borderBottom: "1px solid rgba(59,130,246,0.1)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: cs.color, marginBottom: 12, textTransform: "uppercase", letterSpacing: 2 }}>{cs.tag}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2, color: "#e2e8f0" }}>
              {cs.title}
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>{cs.subtitle}</p>
          </div>

          {/* Metrics grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 1, background: "rgba(30,41,59,0.3)",
            borderBottom: "1px solid rgba(59,130,246,0.1)",
          }}>
            {cs.metrics.map(m => (
              <div key={m.label} style={{
                padding: "20px 24px", background: "rgba(8,15,30,0.5)",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: cs.color, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "#3a5a7a", lineHeight: 1.4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Story sections */}
          <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column", gap: 36 }}>
            {cs.story.map((section, i) => (
              <div key={i}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: cs.color, margin: "0 0 16px" }}>
                  {section.heading}
                </h3>
                <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.9, whiteSpace: "pre-line" }}>
                  {section.body}
                </div>
              </div>
            ))}

            <div style={{
              padding: "16px 20px", borderRadius: 10,
              background: "rgba(4,8,20,0.6)", border: "1px solid rgba(30,41,59,0.4)",
              fontSize: 11, color: "#334155", lineHeight: 1.6,
            }}>
              ⚠️ {cs.disclaimer}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 8 }}>
              <a
                href="/b2b-onboarding"
                style={{
                  padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  color: "#fff", textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                }}
              >
                Inizia Gratis →
              </a>
              <a
                href="/b2b"
                style={{
                  padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa", textDecoration: "none",
                }}
              >
                Scopri i Piani B2B
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 32px 100px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#e2e8f0", margin: "0 0 16px" }}>
          Il prossimo case study è il tuo.
        </h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 32 }}>
          Prova VinoInvest Professional con il tuo portafoglio. Demo gratuita, nessuna carta di credito.
        </p>
        <a
          href="/b2b-onboarding"
          style={{
            display: "inline-block", padding: "14px 36px", borderRadius: 12, fontSize: 15, fontWeight: 700,
            background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
            color: "#fff", textDecoration: "none",
            boxShadow: "0 6px 28px rgba(37,99,235,0.35)",
          }}
        >
          Richiedi Demo Gratuita →
        </a>
        <div style={{ marginTop: 16, fontSize: 12, color: "#334155" }}>
          30 giorni gratuiti · Setup in 1 giorno · Cancella quando vuoi
        </div>
      </section>
    </div>
  );
}
