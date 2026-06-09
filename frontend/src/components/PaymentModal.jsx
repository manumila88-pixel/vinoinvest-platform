import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

let stripePromise = null;
function getStripe() {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (key && !key.includes("YOUR_")) stripePromise = loadStripe(key);
  }
  return stripePromise;
}

const TABS = [
  { id: "card", label: "Carta di credito" },
  { id: "paypal", label: "PayPal" },
  { id: "crypto", label: "Crypto" },
];

export default function PaymentModal({ plan, userEmail, onClose }) {
  const [tab, setTab] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Stripe Checkout ────────────────────────────────────────────────────────
  async function handleStripe() {
    setLoading(true); setError("");
    try {
      const resp = await fetch(`${BACKEND}/api/payments/stripe/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId, email: userEmail, plan: plan.id }),
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Stripe checkout error.");
      }
    } catch (e) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  // ── PayPal ─────────────────────────────────────────────────────────────────
  async function handlePayPal() {
    setLoading(true); setError("");
    try {
      const resp = await fetch(`${BACKEND}/api/payments/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price, currency: "EUR", plan: plan.id }),
      });
      const data = await resp.json();
      if (data.id) {
        const paypalBase = import.meta.env.VITE_PAYPAL_ENV === "production"
          ? "https://www.paypal.com"
          : "https://www.sandbox.paypal.com";
        window.location.href = `${paypalBase}/checkoutnow?token=${data.id}`;
      } else {
        setError(data.error || "PayPal error.");
      }
    } catch (e) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  // ── NOWPayments ────────────────────────────────────────────────────────────
  async function handleCrypto() {
    setLoading(true); setError("");
    try {
      const resp = await fetch(`${BACKEND}/api/payments/crypto/create-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price, plan: plan.id, email: userEmail }),
      });
      const data = await resp.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        setError(data.error || "NOWPayments error.");
      }
    } catch (e) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  function handlePrimary() {
    if (tab === "card") handleStripe();
    else if (tab === "paypal") handlePayPal();
    else handleCrypto();
  }

  const btnLabel = {
    card: "Paga con Stripe",
    paypal: "Paga con PayPal",
    crypto: "Paga con Crypto",
  }[tab];

  const btnColor = {
    card: "#c9a227",
    paypal: "#0070ba",
    crypto: "#1652f0",
  }[tab];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.82)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: 24, width: "min(94vw,480px)", overflow: "hidden", position: "relative" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%", background: "rgba(30,41,59,0.9)", border: "1px solid #334155", color: "#94a3b8", fontSize: 20, lineHeight: "32px", textAlign: "center", cursor: "pointer" }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Piano selezionato</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>{plan.name}</span>
              <span style={{ marginLeft: 10, fontSize: 12, color: "#64748b" }}>{plan.audience}</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 24, color: "#c9a227" }}>€{plan.price}<span style={{ fontSize: 13, color: "#64748b", fontWeight: 400 }}>/mese</span></span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #1e293b" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setError(""); }}
              style={{
                flex: 1, padding: "13px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600,
                color: tab === t.id ? "#c9a227" : "#64748b",
                borderBottom: tab === t.id ? "2px solid #c9a227" : "2px solid transparent",
                transition: "0.18s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: "24px 28px 28px" }}>
          {tab === "card" && (
            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Sarai reindirizzato alla pagina di pagamento sicura di <strong style={{ color: "white" }}>Stripe</strong>.<br />
              Accettiamo Visa, Mastercard, American Express e altri metodi.
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                {["VISA", "MC", "AMEX", "SEPA"].map(c => (
                  <span key={c} style={{ padding: "3px 8px", background: "#1e293b", borderRadius: 6, fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {tab === "paypal" && (
            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Sarai reindirizzato al checkout sicuro di <strong style={{ color: "#0070ba" }}>PayPal</strong>.<br />
              Puoi pagare con il saldo PayPal o con la tua carta tramite PayPal.
            </div>
          )}

          {tab === "crypto" && (
            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Paga con <strong style={{ color: "#f7931a" }}>Bitcoin, Ethereum, USDT, USDC</strong> o altra crypto tramite <strong style={{ color: "white" }}>NOWPayments</strong>.<br />
              Sarai reindirizzato alla pagina di pagamento sicura.
            </div>
          )}

          {error && (
            <div style={{ background: "#1c0707", border: "1px solid #991b1b", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#f87171", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            onClick={handlePrimary}
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#334155" : btnColor,
              color: tab === "card" ? "#000" : "white",
              fontWeight: 700, fontSize: 14, transition: "0.2s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading..." : btnLabel}
          </button>

          <p style={{ fontSize: 10, color: "#334155", marginTop: 16, textAlign: "center", lineHeight: 1.6 }}>
            Pagamento sicuro e crittografato. Disdici in qualsiasi momento dalla tua area personale.
            Premendo il pulsante accetti i <span style={{ color: "#475569" }}>Termini di Servizio</span> e la <span style={{ color: "#475569" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
