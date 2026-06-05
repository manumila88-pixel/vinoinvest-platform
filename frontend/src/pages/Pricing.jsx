import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    audience: "B2C",
    priceMonthly: 9,
    priceAnnual: 86,
    stripePriceMonthly: "price_1Tec4l15Hu1SBgIFa0PwZQvq",
    stripePriceAnnual: "price_1TecAi15Hu1SBgIFmZfb4ZLU",
    color: "#c9a227",
    features: [
      "Accesso al mercato vini",
      "Portfolio tracker (fino a 10 vini)",
      "AI Score su tutti i vini",
      "Analisi prezzi storici",
      "Supporto email",
    ],
    cta: "Inizia ora",
  },
  {
    id: "pro",
    name: "Pro",
    audience: "B2C",
    priceMonthly: 29,
    priceAnnual: 278,
    stripePriceMonthly: "price_1Tec9R15Hu1SBgIFH99EfNSL",
    stripePriceAnnual: "price_1TecAi15Hu1SBgIFmZfb4ZLU",
    color: "#c9a227",
    badge: "Più popolare",
    features: [
      "Tutto incluso in Basic",
      "Portfolio illimitato",
      "Segnali AI avanzati (Strong Buy/Sell)",
      "Comparazione marketplace live",
      "Portfolio Builder automatico",
      "Report mensili PDF",
      "Supporto prioritario",
    ],
    cta: "Passa a Pro",
    highlighted: true,
  },
  {
    id: "professional",
    name: "Professional",
    audience: "B2B",
    priceMonthly: 500,
    priceAnnual: 4800,
    stripePriceMonthly: "price_1TecCB15Hu1SBgIFRF1Rtv17",
    stripePriceAnnual: "price_1TecFh15Hu1SBgIFzQyMNKob",
    color: "#60a5fa",
    features: [
      "Tutto incluso in Pro",
      "API access completo",
      "White-label disponibile",
      "Dashboard multi-utente",
      "Gestione clienti (CRM wine)",
      "Integrazione Liv-ex / Wine-Searcher",
      "Account manager dedicato",
      "SLA garantito 99.9%",
    ],
    cta: "Attiva Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    audience: "B2B",
    priceMonthly: 2000,
    priceAnnual: 19200,
    stripePriceMonthly: "price_1TecDn15Hu1SBgIFxnz20ADN",
    stripePriceAnnual: "price_1TecFh15Hu1SBgIFzQyMNKob",
    color: "#60a5fa",
    features: [
      "Tutto incluso in Professional",
      "Onboarding dedicato",
      "Integrazioni custom su richiesta",
      "Accesso dati raw via data warehouse",
      "Contratti personalizzati",
      "Supporto 24/7 con SLA premium",
    ],
    cta: "Contatta vendite",
  },
];

export default function Pricing() {
  const stored = JSON.parse(localStorage.getItem("vino_user") || "{}");
  const userEmail = stored.email || "";
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");

  function openPlan(plan) {
    if (plan.id === "enterprise") {
      window.open("mailto:sales@vinoinvest.com?subject=Enterprise%20Plan%20VinoInvest", "_blank");
      return;
    }
    setSelected(plan);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", padding: "60px 40px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ position: "absolute", left: 40, top: 100, background: "transparent", border: "1px solid #1e293b", color: "#94a3b8", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
        >
          ← Indietro
        </button>
        <div style={{ fontSize: 12, letterSpacing: "0.15em", color: "#c9a227", textTransform: "uppercase", marginBottom: 12 }}>Piani & Prezzi</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
          Investi nel vino con<br /><span style={{ color: "#c9a227" }}>l'intelligenza artificiale</span>
        </h1>
        <p style={{ color: "#64748b", fontSize: 16, maxWidth: 520, margin: "0 auto 32px" }}>
          Scegli il piano giusto per il tuo profilo. Annulla quando vuoi.
        </p>

        {/* Toggle */}
        <div style={{ display: "inline-flex", background: "#0b1220", border: "1px solid #1e293b", borderRadius: 999, padding: 4, gap: 4 }}>
          <button
            onClick={() => setAnnual(false)}
            style={{ padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: !annual ? "#c9a227" : "transparent", color: !annual ? "#000" : "#64748b", transition: "0.2s" }}
          >
            Mensile
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{ padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: annual ? "#c9a227" : "transparent", color: annual ? "#000" : "#64748b", transition: "0.2s" }}
          >
            Annuale <span style={{ fontSize: 11, opacity: 0.8 }}>(-20%)</span>
          </button>
        </div>
      </div>

      {/* Feedback banners */}
      {success && (
        <div style={{ background: "#052e16", border: "1px solid #166534", borderRadius: 12, padding: "14px 20px", marginBottom: 32, color: "#4ade80", textAlign: "center", maxWidth: 560, margin: "0 auto 32px" }}>
          Pagamento completato. Abbonamento attivo!
        </div>
      )}
      {cancelled && (
        <div style={{ background: "#1c1007", border: "1px solid #9a3412", borderRadius: 12, padding: "14px 20px", marginBottom: 32, color: "#fb923c", textAlign: "center", maxWidth: 560, margin: "0 auto 32px" }}>
          Pagamento annullato. Puoi riprovare quando vuoi.
        </div>
      )}

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 1200, margin: "0 auto" }}>
        {PLANS.map(plan => {
          const price = annual ? plan.priceAnnual : plan.priceMonthly;
          const priceId = annual ? plan.stripePriceAnnual : plan.stripePriceMonthly;
          return (
            <div
              key={plan.id}
              style={{
                background: plan.highlighted ? "linear-gradient(145deg, #0f1a30, #0b1220)" : "#0b1220",
                border: plan.highlighted ? "2px solid #c9a227" : "1px solid #1f2937",
                borderRadius: 24,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.highlighted ? "0 0 40px #c9a22722" : "none",
                transition: "0.25s",
              }}
            >
              {plan.badge && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#c9a227", color: "#000", fontSize: 11, fontWeight: 800, padding: "4px 16px", borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: plan.audience === "B2B" ? "#60a5fa" : "#c9a227", fontWeight: 700 }}>{plan.audience}</span>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{plan.name}</h2>
              </div>

              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 44, fontWeight: 900 }}>€{price.toLocaleString("it-IT")}</span>
                <span style={{ color: "#64748b", fontSize: 14 }}>/{annual ? "anno" : "mese"}</span>
                {annual && (
                  <div style={{ fontSize: 11, color: "#4ade80", marginTop: 4 }}>
                    ≈ €{Math.round(price / 12).toLocaleString("it-IT")}/mese
                  </div>
                )}
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, flex: 1 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#cbd5e1" }}>
                    <span style={{ color: plan.audience === "B2B" ? "#60a5fa" : "#c9a227", flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openPlan({ ...plan, priceId, price })}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
                  background: plan.highlighted ? "#c9a227" : plan.audience === "B2B" ? "#1e3a5f" : "#1e293b",
                  color: plan.highlighted ? "#000" : plan.audience === "B2B" ? "#60a5fa" : "white",
                  transition: "0.2s",
                }}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / trust row */}
      <div style={{ textAlign: "center", marginTop: 56, color: "#475569", fontSize: 12 }}>
        Tutti i piani includono 14 giorni di prova gratuita · Nessuna carta richiesta per iniziare · Disdici in qualsiasi momento
      </div>

      {/* Payment modal */}
      {selected && (
        <PaymentModal
          plan={selected}
          userEmail={userEmail}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
