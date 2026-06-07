import React, { useState, useEffect } from "react";

const STORAGE_KEY = "vino_cookie_consent_v1";

export function hasCookieConsent() {
  try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasCookieConsent()) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, ts: Date.now() })); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: false, ts: Date.now() })); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "rgba(2,6,23,0.97)", borderTop: "1px solid rgba(201,162,39,0.3)",
      backdropFilter: "blur(12px)", padding: "16px 24px",
      display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      animation: "slideUpCookie 0.4s ease",
    }}>
      <style>{`
        @keyframes slideUpCookie {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>

      <div style={{ flex: 1, minWidth: 260 }}>
        <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
          🍪 Utilizziamo cookie tecnici essenziali per il funzionamento del sito.{" "}
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#C9A227", textDecoration: "underline", fontSize: 12 }}
          >
            Privacy Policy
          </a>
          {" · "}
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#C9A227", textDecoration: "underline", fontSize: 12 }}
          >
            Cookie Policy
          </a>
        </span>
      </div>

      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(100,116,139,0.4)",
            background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Solo essenziali
        </button>
        <button
          onClick={accept}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #C9A227, #a37e1a)",
            color: "#0a0f1e", fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Accetta
        </button>
      </div>
    </div>
  );
}
