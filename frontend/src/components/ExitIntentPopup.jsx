import React, { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const STORAGE_KEY = "vino_exit_popup_shown";

export default function ExitIntentPopup({ userEmail }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState(userEmail || "");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const triggered = useRef(false);

  useEffect(() => {
    if (userEmail || sessionStorage.getItem(STORAGE_KEY)) return;

    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && !triggered.current) {
        triggered.current = true;
        setTimeout(() => setVisible(true), 300);
      }
    };

    // Mobile: trigger after 45s of inactivity
    let mobileTimer;
    if ("ontouchstart" in window) {
      mobileTimer = setTimeout(() => {
        if (!triggered.current) {
          triggered.current = true;
          setVisible(true);
        }
      }, 45000);
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/email-preferences/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "exit_intent", list: "newsletter" }),
      });
      if (res.ok) {
        setStatus("done");
        sessionStorage.setItem(STORAGE_KEY, "1");
        setTimeout(() => setVisible(false), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div style={{
        background: "linear-gradient(135deg, #0b1220 0%, #111827 100%)",
        border: "1px solid rgba(201,162,39,0.3)",
        borderRadius: 16, padding: "36px 32px", maxWidth: 460, width: "100%",
        position: "relative", boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        textAlign: "center",
      }}>
        <button
          onClick={handleClose}
          style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
        >×</button>

        <div style={{ fontSize: 48, marginBottom: 8 }}>🍷</div>
        <h2 style={{ color: "#C9A227", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Prima di andare...
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          Scarica <strong style={{ color: "#e2e8f0" }}>gratis</strong> la nostra guida
          <em> "Wine Investment 2025: Come investire nei vini pregiati"</em> —
          12 pagine di strategie, dati Liv-ex e case studies reali.
        </p>

        {status === "done" ? (
          <div style={{ color: "#4ade80", fontSize: 16, fontWeight: 700, padding: "16px 0" }}>
            Perfetto! Ti invieremo la guida via email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email"
              required
              placeholder="La tua email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              style={{
                padding: "12px 16px", borderRadius: 8, fontSize: 14,
                background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.6)",
                color: "#e2e8f0", outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #C9A227, #a07d1a)",
                color: "#0b1220", border: "none", cursor: "pointer",
              }}
            >
              {status === "loading" ? "Invio..." : "Invia la guida gratis →"}
            </button>
            {status === "error" && (
              <p style={{ color: "#f87171", fontSize: 12, margin: 0 }}>
                Errore — riprova o contatta support@vinoinvest.it
              </p>
            )}
          </form>
        )}

        <p style={{ color: "#475569", fontSize: 11, marginTop: 12 }}>
          Nessuno spam. Puoi disiscriverti in qualsiasi momento.
        </p>
      </div>
    </div>
  );
}
