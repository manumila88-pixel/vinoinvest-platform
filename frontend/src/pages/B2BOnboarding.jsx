import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

const ORG_TYPES = [
  { id: "wealth_manager", icon: "💼", label: "Wealth Manager", desc: "Gestione patrimoni privati HNWI" },
  { id: "family_office", icon: "🏛️", label: "Family Office", desc: "Gestione patrimoni familiari" },
  { id: "investment_fund", icon: "📈", label: "Fondo d'Investimento", desc: "Fondi alternativi, hedge fund" },
  { id: "cantina", icon: "🍾", label: "Cantina / Produttore", desc: "Monitoraggio prezzi secondario" },
  { id: "fiduciario", icon: "⚖️", label: "Fiduciario / Consulente", desc: "Consulenza patrimoniale" },
  { id: "altro", icon: "🔬", label: "Altro", desc: "Analista, giornalista, ricercatore" },
];

const AUM_RANGES = [
  "< €500k", "€500k – €2M", "€2M – €10M", "€10M – €50M", "> €50M"
];

const CLIENT_RANGES = [
  "1–5 clienti", "6–20 clienti", "21–50 clienti", "50–200 clienti", "200+ clienti"
];

export default function B2BOnboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    org_type: "",
    org_name: "",
    client_range: "",
    aum_range: "",
    name: user?.name || "",
    email: user?.email || "",
    role: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await fetch(`${API}/api/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.org_name,
          email: formData.email,
          role: formData.role,
          aum_estimate: formData.aum_range,
          message: `Tipo organizzazione: ${formData.org_type}\nClienti: ${formData.client_range}\n${formData.message}`,
          source: "b2b-onboarding",
        }),
      });
    } catch {}
    setSubmitting(false);
    setDone(true);
  }

  const TOTAL_STEPS = 4;

  if (done) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif" }}>
      <div style={{ maxWidth: 560, textAlign: "center", padding: "0 32px" }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 16 }}>Benvenuto in VinoInvest B2B</h2>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
          Il nostro team ti contatterà entro 24 ore per una demo personalizzata. Nel frattempo, esplora la piattaforma.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="/org-dashboard" style={{ padding: "12px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", textDecoration: "none", fontWeight: 700 }}>
            Apri Dashboard →
          </a>
          <a href="/" style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", textDecoration: "none" }}>
            Esplora Piattaforma
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif", padding: "40px 20px" }}>
      <Helmet><title>Onboarding B2B | VinoInvest</title></Helmet>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 560, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} style={{
              width: "23%", height: 3, borderRadius: 2,
              background: i < step ? "linear-gradient(90deg,#1d4ed8,#2563eb)" : "rgba(59,130,246,0.15)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#334155", textAlign: "right" }}>Step {step} di {TOTAL_STEPS}</div>
      </div>

      <div style={{ width: "100%", maxWidth: 560, padding: "40px", borderRadius: 24, background: "rgba(8,15,30,0.8)", border: "1px solid rgba(59,130,246,0.15)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>

        {/* Step 1: Tipo organizzazione */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 8, letterSpacing: "0.08em" }}>PASSO 1 DI 4</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, margin: "0 0 8px" }}>Che tipo di organizzazione sei?</h2>
              <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Personalizziamo la piattaforma in base alle tue esigenze.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ORG_TYPES.map(t => (
                <button key={t.id} onClick={() => setFormData(d => ({ ...d, org_type: t.id }))} style={{
                  padding: "16px", borderRadius: 12, border: `1px solid ${formData.org_type === t.id ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.15)"}`,
                  background: formData.org_type === t.id ? "rgba(59,130,246,0.12)" : "rgba(8,15,30,0.6)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => formData.org_type && setStep(2)}
              disabled={!formData.org_type}
              style={{ marginTop: 24, width: "100%", padding: "13px", borderRadius: 10, border: "none", background: formData.org_type ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "rgba(59,130,246,0.15)", color: formData.org_type ? "#fff" : "#334155", fontWeight: 700, fontSize: 15, cursor: formData.org_type ? "pointer" : "not-allowed" }}>
              Continua →
            </button>
          </>
        )}

        {/* Step 2: Dimensione */}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 8, letterSpacing: "0.08em" }}>PASSO 2 DI 4</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, margin: "0 0 8px" }}>Dimensioni operative</h2>
              <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Quanti clienti gestisci e il loro AUM wine stimato?</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 8 }}>N° Clienti</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CLIENT_RANGES.map(r => (
                  <button key={r} onClick={() => setFormData(d => ({ ...d, client_range: r }))} style={{
                    padding: "8px 14px", borderRadius: 8, border: `1px solid ${formData.client_range === r ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.15)"}`,
                    background: formData.client_range === r ? "rgba(59,130,246,0.12)" : "rgba(8,15,30,0.6)",
                    color: formData.client_range === r ? "#60a5fa" : "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 8 }}>AUM Wine Stimato</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {AUM_RANGES.map(r => (
                  <button key={r} onClick={() => setFormData(d => ({ ...d, aum_range: r }))} style={{
                    padding: "8px 14px", borderRadius: 8, border: `1px solid ${formData.aum_range === r ? "rgba(59,130,246,0.6)" : "rgba(59,130,246,0.15)"}`,
                    background: formData.aum_range === r ? "rgba(59,130,246,0.12)" : "rgba(8,15,30,0.6)",
                    color: formData.aum_range === r ? "#60a5fa" : "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid rgba(59,130,246,0.2)", background: "none", color: "#475569", fontWeight: 600, cursor: "pointer" }}>← Indietro</button>
              <button onClick={() => (formData.client_range && formData.aum_range) && setStep(3)} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Continua →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Contatto */}
        {step === 3 && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 8, letterSpacing: "0.08em" }}>PASSO 3 DI 4</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, margin: "0 0 8px" }}>I tuoi dati</h2>
              <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Per configurare il tuo accesso B2B.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "org_name", label: "Nome Organizzazione", placeholder: "Family Office Rossi Spa" },
                { key: "name", label: "Nome e Cognome", placeholder: "Mario Rossi" },
                { key: "email", label: "Email Aziendale", placeholder: "mario@familyoffice.com", type: "email" },
                { key: "role", label: "Ruolo", placeholder: "CIO / Wealth Manager / Partner" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#60a5fa", marginBottom: 5 }}>{f.label}</label>
                  <input
                    type={f.type || "text"} value={formData[f.key]}
                    onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid rgba(59,130,246,0.2)", background: "none", color: "#475569", fontWeight: 600, cursor: "pointer" }}>← Indietro</button>
              <button
                onClick={() => (formData.name && formData.email && formData.org_name) && setStep(4)}
                style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Continua →
              </button>
            </div>
          </>
        )}

        {/* Step 4: Tour + Submit */}
        {step === 4 && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 8, letterSpacing: "0.08em" }}>PASSO 4 DI 4</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, margin: "0 0 8px" }}>Cosa ti aspetta</h2>
              <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Un recap del tuo accesso B2B personalizzato.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { icon: "📊", label: "Dashboard multi-portfolio", desc: `Gestisci separatamente ${formData.client_range || "i tuoi clienti"}` },
                { icon: "📄", label: "Report PDF professionale", desc: "Cover page, risk metrics, benchmark, AI commentary" },
                { icon: "📈", label: "Risk Analytics avanzati", desc: "Sharpe, VaR 95%, Max Drawdown, Beta vs indice" },
                { icon: "🔌", label: "API Enterprise", desc: "10.000 req/giorno + export Bloomberg CSV" },
                { icon: "🎯", label: "Demo personalizzata", desc: "Il team ti contatta entro 24h" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid rgba(59,130,246,0.2)", background: "none", color: "#475569", fontWeight: 600, cursor: "pointer" }}>← Indietro</button>
              <button
                onClick={submit}
                disabled={submitting}
                style={{ flex: 2, padding: "13px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                {submitting ? "Invio..." : "🚀 Attiva Accesso B2B →"}
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "#1e3a5f", marginTop: 12 }}>
              Nessun impegno · Risposta entro 24h · GDPR compliant
            </div>
          </>
        )}
      </div>
    </div>
  );
}
