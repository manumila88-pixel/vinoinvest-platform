import { useState } from "react";
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
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)", padding: "clamp(32px,5vw,60px) clamp(16px,4vw,40px)" }}>
      <style>{`
        .pricing-card { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .pricing-card:hover { transform: translateY(-3px); box-shadow: var(--vi-elev-2); }
        .pricing-card-hi:hover { box-shadow: var(--vi-glow); }
        .pricing-cta { transition: opacity var(--vi-dur-fast) linear, transform var(--vi-dur-fast) var(--vi-ease); cursor: pointer; }
        .pricing-cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .pricing-toggle-btn { transition: background var(--vi-dur-fast) linear, color var(--vi-dur-fast) linear; cursor: pointer; }
        @media (prefers-reduced-motion: reduce) { .pricing-card:hover, .pricing-cta:hover { transform: none; } }
      `}</style>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed", left: "clamp(16px,3vw,40px)", top: 90,
          background: "transparent", border: `1px solid var(--vi-border)`,
          color: "var(--vi-text-dim)", padding: "7px 14px",
          borderRadius: "var(--vi-radius-sm)", cursor: "pointer", fontSize: "var(--vi-fs-sm)"
        }}
      >
        ← Indietro
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 560, margin: "0 auto 48px" }}>
        <div style={{ fontSize: "var(--vi-fs-xs)", letterSpacing: "0.15em", color: "var(--vi-accent)", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
          Piani & Prezzi
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16, fontFamily: "var(--vi-font-display)" }}>
          Investi nel vino con<br /><span style={{ color: "var(--vi-accent)" }}>l'intelligenza artificiale</span>
        </h1>
        <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", lineHeight: 1.6 }}>
          Scegli il piano giusto per il tuo profilo. Annulla quando vuoi.
        </p>

        {/* Toggle */}
        <div style={{ display: "inline-flex", marginTop: 24, background: "var(--vi-surface)", border: `1px solid var(--vi-border)`, borderRadius: "var(--vi-radius-full)", padding: 4, gap: 4 }}>
          <button
            className="pricing-toggle-btn"
            onClick={() => setAnnual(false)}
            style={{ padding: "8px 20px", borderRadius: "var(--vi-radius-full)", border: "none", fontSize: "var(--vi-fs-sm)", fontWeight: 600, background: !annual ? "var(--vi-accent)" : "transparent", color: !annual ? "var(--vi-bg)" : "var(--vi-text-dim)" }}
          >
            Mensile
          </button>
          <button
            className="pricing-toggle-btn"
            onClick={() => setAnnual(true)}
            style={{ padding: "8px 20px", borderRadius: "var(--vi-radius-full)", border: "none", fontSize: "var(--vi-fs-sm)", fontWeight: 600, background: annual ? "var(--vi-accent)" : "transparent", color: annual ? "var(--vi-bg)" : "var(--vi-text-dim)" }}
          >
            Annuale <span style={{ fontSize: "var(--vi-fs-xs)", opacity: 0.8 }}>(-20%)</span>
          </button>
        </div>
      </div>

      {/* Stripe test mode banner */}
      {(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "").startsWith("pk_test_") && (
        <div style={{
          background: "rgba(154,52,18,0.08)", border: "1px solid rgba(154,52,18,0.3)",
          borderRadius: "var(--vi-radius-sm)", padding: "10px 20px", marginBottom: 24,
          color: "#fb923c", textAlign: "center", maxWidth: 560, margin: "0 auto 24px", fontSize: "var(--vi-fs-sm)"
        }}>
          <strong>Stripe in modalità TEST</strong> — nessun addebito reale viene processato. Carta di test: 4242 4242 4242 4242.
        </div>
      )}

      {/* Feedback banners */}
      {success && (
        <div style={{
          background: "rgba(5,46,22,0.6)", border: "1px solid rgba(22,101,52,0.6)",
          borderRadius: "var(--vi-radius-md)", padding: "14px 20px", marginBottom: 32,
          color: "var(--vi-positive)", textAlign: "center", maxWidth: 560, margin: "0 auto 32px"
        }}>
          Pagamento completato. Abbonamento attivo.
        </div>
      )}
      {cancelled && (
        <div style={{
          background: "rgba(28,16,7,0.6)", border: "1px solid rgba(154,52,18,0.4)",
          borderRadius: "var(--vi-radius-md)", padding: "14px 20px", marginBottom: 32,
          color: "#fb923c", textAlign: "center", maxWidth: 560, margin: "0 auto 32px"
        }}>
          Pagamento annullato. Puoi riprovare quando vuoi.
        </div>
      )}

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
        {PLANS.map(plan => {
          const price = annual ? plan.priceAnnual : plan.priceMonthly;
          const priceId = annual ? plan.stripePriceAnnual : plan.stripePriceMonthly;
          const isB2B = plan.audience === "B2B";
          return (
            <div
              key={plan.id}
              className={`pricing-card${plan.highlighted ? " pricing-card-hi" : ""}`}
              style={{
                background: plan.highlighted ? "linear-gradient(145deg, var(--vi-bg-elev), var(--vi-bg))" : "var(--vi-surface)",
                border: plan.highlighted ? `2px solid var(--vi-accent)` : `1px solid var(--vi-border)`,
                borderRadius: "var(--vi-radius-lg)",
                padding: "clamp(24px,3vw,32px)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.highlighted ? "0 0 40px var(--vi-accent-glow)" : "var(--vi-elev-1)",
              }}
            >
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "var(--vi-accent)", color: "var(--vi-bg)",
                  fontSize: "var(--vi-fs-xs)", fontWeight: 800, padding: "4px 16px",
                  borderRadius: "var(--vi-radius-full)", letterSpacing: "0.08em", textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <span style={{
                  fontSize: "var(--vi-fs-xs)", letterSpacing: "0.12em", textTransform: "uppercase",
                  color: isB2B ? "#60a5fa" : "var(--vi-accent)", fontWeight: 700
                }}>{plan.audience}</span>
                <h2 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, marginTop: 4, fontFamily: "var(--vi-font-display)" }}>{plan.name}</h2>
              </div>

              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: "clamp(32px,4vw,44px)", fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>€{price.toLocaleString("it-IT")}</span>
                <span style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)" }}>/{annual ? "anno" : "mese"}</span>
                {annual && (
                  <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-positive)", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                    ≈ €{Math.round(price / 12).toLocaleString("it-IT")}/mese
                  </div>
                )}
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, flex: 1, padding: 0 }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>
                    <span style={{ color: isB2B ? "#60a5fa" : "var(--vi-accent)", flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="pricing-cta"
                onClick={() => openPlan({ ...plan, priceId, price })}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "var(--vi-radius-md)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "var(--vi-fs-sm)",
                  background: plan.highlighted ? "var(--vi-accent)" : isB2B ? "rgba(96,165,250,0.12)" : "var(--vi-bg-elev)",
                  color: plan.highlighted ? "var(--vi-bg)" : isB2B ? "#60a5fa" : "var(--vi-text)",
                  border: isB2B && !plan.highlighted ? "1px solid rgba(96,165,250,0.2)" : "none",
                }}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust row */}
      <div style={{ textAlign: "center", marginTop: 48, color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-xs)", opacity: 0.7 }}>
        Tutti i piani includono 14 giorni di prova gratuita · Nessuna carta richiesta per iniziare · Disdici in qualsiasi momento
      </div>

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
