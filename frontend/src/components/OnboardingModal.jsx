import React, { useState, useEffect, useCallback } from "react";

const PREFS_KEY = "vino_user_prefs_v1";

const STORAGE_KEY = "vino_onboarding_v1";
const STORAGE_KEY_B2B = "vino_onboarding_b2b_v1";

const STEPS_B2B = [
  {
    icon: "🏦",
    title: "Benvenuto su VinoInvest Pro",
    subtitle: "La piattaforma professionale per investitori istituzionali",
    content: (
      <div>
        <p style={{ marginBottom: 16, lineHeight: 1.7, fontSize: 13, color: "#94a3b8" }}>
          Hai accesso alla suite professionale VinoInvest. Ecco cosa puoi fare:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "📊", label: "Dashboard Analytics", desc: "Dati di mercato istituzionali in real-time" },
            { icon: "👥", label: "Multi-Portfolio", desc: "Portfolio separati per ogni cliente" },
            { icon: "📄", label: "Report PDF", desc: "Branded, esportabili, pronti per i clienti" },
            { icon: "🔌", label: "API & Export", desc: "CSV/Excel + REST API documentata" },
          ].map(f => (
            <div key={f.label} style={{
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: "#3a5a7a" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "📊",
    title: "Dashboard Analytics",
    subtitle: "Monitora il mercato e i tuoi clienti da un unico pannello",
    content: (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "📈", text: "Andamento prezzi in tempo reale per regione e annata" },
            { icon: "🔍", text: "Filtri avanzati: produttore, rating, rischio, liquidità" },
            { icon: "⚖️", text: "Correlazione con equity, obbligazioni e materie prime" },
            { icon: "🌍", text: "Prezzi in EUR, USD e GBP aggiornati continuamente" },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)",
              borderRadius: 10, padding: "11px 14px",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#60a5fa" }}>
          🏦 La tab "B2B Dashboard" nel menu principale ti dà accesso completo all'analytics professionale.
        </div>
      </div>
    ),
  },
  {
    icon: "👥",
    title: "Gestione Portfolio Clienti",
    subtitle: "Crea e monitora portfolio separati per ogni cliente",
    content: (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { step: "1", text: "Crea un portfolio per ogni cliente dalla Dashboard B2B" },
            { step: "2", text: "Aggiungi posizioni: vino, quantità, prezzo di acquisto, data" },
            { step: "3", text: "Monitora ROI, P&L e performance aggregate in tempo reale" },
            { step: "4", text: "Ricevi alert automatici su prezzi e segnali di mercato" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#fff",
              }}>{s.step}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "📄",
    title: "Export e Reportistica",
    subtitle: "Report professionali pronti in un click",
    content: (
      <div>
        <p style={{ marginBottom: 16, lineHeight: 1.7, fontSize: 13, color: "#94a3b8" }}>
          Genera report brandizzati per i tuoi clienti finali:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            { icon: "📊", label: "PDF Report", desc: "Composizione, YTD, benchmark, outlook AI" },
            { icon: "📋", label: "CSV / Excel", desc: "Compatibile con Bloomberg, Advent Geneva" },
            { icon: "🤖", label: "AI Insights", desc: "Raccomandazioni AI per ogni posizione" },
            { icon: "🔔", label: "Alert Settimanali", desc: "Email automatiche ai tuoi clienti" },
          ].map(r => (
            <div key={r.label} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)",
              borderRadius: 10, padding: "11px 14px",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "#3a5a7a" }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "🔌",
    title: "API & Integrazioni",
    subtitle: "Connetti VinoInvest ai tuoi sistemi esistenti",
    content: (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "🔗", text: "REST API documentata — illimitata nel tuo piano" },
            { icon: "📦", text: "Export CSV/XLSX compatibile con i principali PMS" },
            { icon: "📡", text: "Webhook per alert real-time su variazioni di prezzo" },
            { icon: "🔒", text: "API key sicura dalla Dashboard B2B → Integrazioni" },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)",
              borderRadius: 10, padding: "11px 14px",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#60a5fa" }}>
          💡 Per DPA, SLA personalizzati o integrazioni custom: <strong>sales@vinoinvest.com</strong>
        </div>
      </div>
    ),
  },
  {
    icon: "🎯",
    title: "Support Dedicato",
    subtitle: "Il tuo account manager è a disposizione",
    content: (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "✉️", label: "Email dedicata", desc: "sales@vinoinvest.com — risposta entro 4h" },
            { icon: "⚖️", label: "Legal & Compliance", desc: "legal@vinoinvest.com per DPA e questioni legali" },
            { icon: "❓", label: "FAQ B2B", desc: "Premi ? in basso → tab B2B/Pro per risposte immediate" },
            { icon: "🌐", label: "Info & Piani", desc: "Visita /b2b per la documentazione completa" },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)",
              borderRadius: 10, padding: "11px 14px",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#3a5a7a" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#60a5fa" }}>
          🚀 Sei pronto! Il team ti contatterà presto per il setup iniziale.
        </div>
      </div>
    ),
  },
];

const STEPS = [
  {
    icon: "🍷",
    title: "Benvenuto su VinoInvest",
    subtitle: "La piattaforma di intelligence per investire in vino pregiato",
    content: (
      <div>
        <p style={{ marginBottom: 16, lineHeight: 1.7 }}>
          VinoInvest aggrega dati da <strong style={{ color: "#C9A227" }}>50.000+ vini</strong> in tempo reale:
          prezzi storici, rating critici, trend di mercato e segnali AI.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "📊", label: "AI Score", desc: "Punteggio 0-100 per ogni vino" },
            { icon: "📈", label: "Price History", desc: "Grafico prezzi su 5 anni" },
            { icon: "💼", label: "Portfolio", desc: "Tracking ROI e P&L in tempo reale" },
            { icon: "🤖", label: "AI Advisor", desc: "Chat AI per consigli personalizzati" },
          ].map(f => (
            <div key={f.label} style={{
              background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: "#3a5a7a" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "📊",
    title: "Il Mercato",
    subtitle: "Come leggere le wine card e i segnali AI",
    content: (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              badge: <span style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Strong Buy</span>,
              desc: "Ottimo momento di acquisto — momentum e fondamentali eccellenti",
            },
            {
              badge: <span style={{ background: "rgba(134,239,172,0.15)", color: "#86efac", border: "1px solid rgba(134,239,172,0.3)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Buy</span>,
              desc: "Buone prospettive di crescita nel medio-lungo termine",
            },
            {
              badge: <span style={{ background: "rgba(201,162,39,0.15)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Hold</span>,
              desc: "Mantieni senza comprare altro — aspetta migliori condizioni",
            },
            {
              badge: <span style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Sell</span>,
              desc: "Considera di liquidare la posizione o ridurla",
            },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "rgba(11,18,32,0.6)", borderRadius: 10, border: "1px solid rgba(30,41,59,0.5)" }}>
              <div style={{ flexShrink: 0 }}>{s.badge}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: "#3a5a7a" }}>
          💡 L'<strong style={{ color: "#e2e8f0" }}>AI Score</strong> (0-100) riassume: rating critico, annata, produttore, trend e rischio.
          Score &gt; 80 = elevato potenziale di investimento.
        </p>
      </div>
    ),
  },
  {
    icon: "💼",
    title: "Il tuo Portfolio",
    subtitle: "Traccia ROI, P&L e ricevi analisi AI personalizzate",
    content: (
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { step: "1", text: "Trova un vino nel Mercato e clicca 'Aggiungi al Portfolio'" },
            { step: "2", text: "Inserisci prezzo pagato, quantità e data di acquisto" },
            { step: "3", text: "Il ROI si aggiorna automaticamente con i prezzi di mercato" },
            { step: "4", text: "Clicca 'Analizza Portfolio' per raccomandazioni AI in tempo reale" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#9b1c4a,#C9A227)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#fff",
              }}>{s.step}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#C9A227" }}>
          📌 Hai già comprato vini su altre piattaforme? Usa "Ho già comprato" per importare le tue posizioni.
        </div>
      </div>
    ),
  },
  {
    icon: "🤖",
    title: "L'AI Advisor",
    subtitle: "Il tuo consulente personale per il wine investment",
    content: (
      <div>
        <p style={{ marginBottom: 16, lineHeight: 1.7, fontSize: 13, color: "#94a3b8" }}>
          La chat AI in basso a destra può rispondere a qualsiasi domanda sui tuoi investimenti:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            { icon: "💬", msg: '"Ho €5.000 da investire, cosa compro?"' },
            { icon: "📊", msg: '"Analizza il mio portfolio e dimmi cosa fare"' },
            { icon: "🔍", msg: '"Trovami vini simili a Barolo con rischio basso"' },
            { icon: "📰", msg: '"Quali sono le notizie del mercato oggi?"' },
          ].map((ex, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,58,95,0.5)",
              borderRadius: 10, padding: "10px 14px",
            }}>
              <span style={{ fontSize: 16 }}>{ex.icon}</span>
              <span style={{ fontSize: 12, color: "#60a5fa", fontStyle: "italic" }}>{ex.msg}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#3a5a7a" }}>
          🍷 Il bottone <strong style={{ color: "#e2e8f0" }}>🍷</strong> in basso a destra apre la chat in qualsiasi momento.
          Funziona anche senza API key con il motore algoritmico.
        </p>
      </div>
    ),
  },
  {
    icon: "🎯",
    title: "Personalizza la tua esperienza",
    subtitle: "Dicci qualcosa di te — useremo queste info per personalizzare il feed",
    isPreferences: true,
  },
  {
    icon: "🔔",
    title: "Price Alerts",
    subtitle: "Non perdere mai il momento giusto per comprare",
    content: (
      <div>
        <p style={{ marginBottom: 16, lineHeight: 1.7, fontSize: 13, color: "#94a3b8" }}>
          Imposta avvisi di prezzo su qualsiasi vino. Ti notifichiamo quando il prezzo scende sotto la tua soglia target.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { step: "1", icon: "🔍", text: "Trova un vino nel Mercato" },
            { step: "2", icon: "🔔", text: "Inserisci il prezzo target nel campo Alert della card" },
            { step: "3", icon: "✅", text: "Premi il bottone 🔔 per attivare l'avviso" },
            { step: "4", icon: "📬", text: "Ricevi notifica quando il prezzo raggiunge il target" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{s.text}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#C9A227" }}>
          🎉 Ora sei pronto! Esplora il Mercato e inizia a costruire il tuo portfolio di vino.
        </div>
      </div>
    ),
  },
];

export function isOnboardingCompleted(accountType) {
  const key = (accountType === "cantina" || accountType === "wealth_manager") ? STORAGE_KEY_B2B : STORAGE_KEY;
  return localStorage.getItem(key) === "true";
}

export function resetOnboarding(accountType) {
  const key = (accountType === "cantina" || accountType === "wealth_manager") ? STORAGE_KEY_B2B : STORAGE_KEY;
  localStorage.removeItem(key);
}

function PreferencesForm({ onSave }) {
  const [budget, setBudget] = useState("");
  const [risk, setRisk] = useState("");
  const [regions, setRegions] = useState([]);

  const REGIONS = ["Bordeaux", "Borgogna", "Barolo/Barbaresco", "Champagne", "Toscana", "Spagna", "Napa Valley", "Altro"];
  const toggleRegion = (r) => setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Budget di investimento</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["< €1.000", "€1k–5k", "€5k–20k", "€20k–50k", "> €50k"].map(b => (
            <button key={b} onClick={() => setBudget(b)} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
              borderColor: budget === b ? "#C9A227" : "rgba(71,85,105,0.4)",
              background: budget === b ? "rgba(201,162,39,0.12)" : "rgba(30,41,59,0.5)",
              color: budget === b ? "#C9A227" : "#94a3b8",
            }}>{b}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tolleranza al rischio</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ v: "low", l: "Bassa", c: "#4ade80" }, { v: "medium", l: "Media", c: "#C9A227" }, { v: "high", l: "Alta", c: "#f87171" }].map(({ v, l, c }) => (
            <button key={v} onClick={() => setRisk(v)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid",
              borderColor: risk === v ? c : "rgba(71,85,105,0.4)",
              background: risk === v ? `${c}18` : "rgba(30,41,59,0.5)",
              color: risk === v ? c : "#94a3b8",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Regioni preferite (opzionale)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => toggleRegion(r)} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid",
              borderColor: regions.includes(r) ? "rgba(201,162,39,0.5)" : "rgba(71,85,105,0.3)",
              background: regions.includes(r) ? "rgba(201,162,39,0.1)" : "rgba(30,41,59,0.4)",
              color: regions.includes(r) ? "#C9A227" : "#64748b",
            }}>{r}</button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          const prefs = { budget, risk, regions, updatedAt: Date.now() };
          localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
          onSave(prefs);
        }}
        style={{
          padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg,#C9A227,#a07d1a)", border: "none",
          color: "#0b1220", cursor: "pointer",
        }}
      >
        Salva preferenze →
      </button>
    </div>
  );
}

export default function OnboardingModal({ onClose, accountType }) {
  const isB2B = accountType === "cantina" || accountType === "wealth_manager";
  const steps = isB2B ? STEPS_B2B : STEPS;
  const storageKey = isB2B ? STORAGE_KEY_B2B : STORAGE_KEY;
  const [step, setStep] = useState(0);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const accentFrom = isB2B ? "#1d4ed8" : "#9b1c4a";
  const accentTo = isB2B ? "#2563eb" : "#C9A227";
  const borderColor = isB2B ? "rgba(59,130,246,0.25)" : "rgba(201,162,39,0.25)";

  function handleComplete() {
    localStorage.setItem(storageKey, "true");
    onClose();
  }

  function handleSkip() {
    localStorage.setItem(storageKey, "true");
    onClose();
  }

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(2,6,23,0.88)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}>
        {/* Modal */}
        <div style={{
          width: "min(560px, 100%)",
          background: isB2B ? "linear-gradient(160deg,#060d1e 0%,#040810 100%)" : "linear-gradient(160deg,#0c1524 0%,#080f1c 100%)",
          border: `1px solid ${borderColor}`,
          borderRadius: 24,
          boxShadow: `0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px ${isB2B ? "rgba(59,130,246,0.08)" : "rgba(201,162,39,0.1)"}`,
          overflow: "hidden",
          animation: "onboardIn 0.25s ease-out",
        }}>
          {/* Progress bar */}
          <div style={{ height: 3, background: "rgba(30,41,59,0.6)" }}>
            <div style={{
              height: "100%",
              width: `${((step + 1) / steps.length) * 100}%`,
              background: `linear-gradient(90deg,${accentFrom},${accentTo})`,
              transition: "width 0.35s ease",
            }} />
          </div>

          {/* Header */}
          <div style={{ padding: "28px 32px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 36 }}>{current.icon}</div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 700, color: "#e2e8f0", margin: 0, lineHeight: 1.2 }}>
                    {current.title}
                  </h2>
                  <p style={{ fontSize: 12, color: "#3a5a7a", margin: "4px 0 0" }}>{current.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                style={{ background: "none", border: "none", color: "#3a5a7a", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.color = "#3a5a7a"}
                title="Salta tour"
                aria-label="Skip tour"
              >✕</button>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  aria-label={`Go to step ${i + 1}`}
                  style={{
                    width: i === step ? 20 : 8, height: 8, borderRadius: 4,
                    background: i === step ? accentTo : i < step ? `${accentTo}66` : "rgba(30,41,59,0.6)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "0 32px 28px", minHeight: 260 }}>
            {current.isPreferences
              ? <PreferencesForm onSave={() => { setPrefsSaved(true); setStep(s => s + 1); }} />
              : current.content}
          </div>

          {/* Footer — hidden while showing preferences form (has its own CTA) */}
          {!current.isPreferences && <div style={{
            padding: "16px 32px 24px",
            borderTop: "1px solid rgba(30,41,59,0.5)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ fontSize: 12, color: "#3a5a7a" }}>
              {step + 1} di {steps.length}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(30,41,59,0.6)",
                    background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; e.currentTarget.style.color = "#e2e8f0"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(30,41,59,0.6)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                  ← Indietro
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  style={{
                    padding: "9px 24px", borderRadius: 10, border: "none",
                    background: `linear-gradient(135deg,${accentFrom},${accentTo})`,
                    color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
                    boxShadow: `0 4px 16px ${isB2B ? "rgba(37,99,235,0.3)" : "rgba(201,162,39,0.3)"}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  Avanti →
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  style={{
                    padding: "9px 28px", borderRadius: 10, border: "none",
                    background: isB2B ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "linear-gradient(135deg,#4ade80,#16a34a)",
                    color: isB2B ? "#fff" : "#000", cursor: "pointer", fontSize: 13, fontWeight: 800,
                    boxShadow: isB2B ? "0 4px 16px rgba(37,99,235,0.35)" : "0 4px 16px rgba(74,222,128,0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  {isB2B ? "🏦 Inizia con Pro!" : "🚀 Inizia!"}
                </button>
              )}
            </div>
          </div>}
        </div>
      </div>

      <style>{`
        @keyframes onboardIn {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
