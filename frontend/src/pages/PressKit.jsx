import React from "react";

const DOWNLOADS = [
  { label: "Logo SVG (dark bg)", desc: "For use on dark backgrounds" },
  { label: "Logo SVG (light bg)", desc: "For use on light backgrounds" },
  { label: "Brand guidelines PDF", desc: "Colors, fonts, spacing" },
  { label: "Press release IT", desc: "Comunicato stampa (Italiano)" },
  { label: "Press release EN", desc: "Press release (English)" },
  { label: "Press release FR", desc: "Communiqué de presse (Français)" },
];

const FACTS = [
  { label: "Founded", value: "2026" },
  { label: "HQ", value: "Milan, Italy" },
  { label: "Wines tracked", value: "50,000+" },
  { label: "Price data points", value: "1.8M+" },
  { label: "AI analyses/month", value: "10,000+" },
  { label: "Languages", value: "40" },
];

export default function PressKit() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <style>{`
        .pk-fact { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .pk-fact:hover { transform: translateY(-2px); box-shadow: var(--vi-glow); }
        .pk-download { transition: background var(--vi-dur-fast) linear; }
        .pk-download:hover { background: var(--vi-bg-elev) !important; }
        .pk-dl-btn { transition: background var(--vi-dur-fast) linear; cursor: pointer; }
        .pk-dl-btn:hover { background: rgba(201,162,39,0.2) !important; }
        @media (prefers-reduced-motion: reduce) { .pk-fact:hover { transform: none; } }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(32px,5vw,60px) 24px" }}>
        <a href="/" style={{
          color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 40
        }}>
          ← Back to VinoInvest
        </a>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "var(--vi-font-display)", fontSize: "clamp(40px,6vw,56px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Vino<span style={{ color: "var(--vi-accent)" }}>Invest</span>
          </div>
          <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-2xl)", fontWeight: 700, marginBottom: 12 }}>
            Press Kit
          </h1>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", lineHeight: 1.7, maxWidth: 600 }}>
            Resources for journalists, bloggers, and media covering fine wine investment and FinTech.
          </p>
          <a href="mailto:press@vinoinvest.com" style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
            color: "var(--vi-accent)", textDecoration: "none", fontWeight: 600, fontSize: "var(--vi-fs-sm)"
          }}>
            press@vinoinvest.com ↗
          </a>
        </div>

        {/* Facts */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-xl)", fontWeight: 700, marginBottom: 24 }}>
            Key Facts
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
            {FACTS.map(f => (
              <div key={f.label} className="pk-fact vi-card" style={{ padding: "18px 20px" }}>
                <div style={{
                  fontSize: "var(--vi-fs-xl)", fontWeight: 800, color: "var(--vi-accent)",
                  fontFamily: "var(--vi-font-display)", fontVariantNumeric: "tabular-nums"
                }}>{f.value}</div>
                <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 6 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-xl)", fontWeight: 700, marginBottom: 20 }}>
            About VinoInvest
          </h2>
          {[
            { lang: "IT", text: "VinoInvest è la piattaforma AI per l'investimento nel vino pregiato. Offre analisi avanzate su 50.000+ vini, AI Score proprietario, tracker del portfolio, storico prezzi e notizie personalizzate. La piattaforma serve sia investitori privati che istituzionali che desiderano inserire il vino pregiato nel proprio portfolio di asset alternativi." },
            { lang: "EN", text: "VinoInvest is the AI-powered platform for fine wine investment. It provides advanced analytics on 50,000+ wines, a proprietary AI Score, portfolio tracker, price history and personalised news. The platform serves both private and institutional investors looking to include fine wine in their alternative asset portfolio." },
            { lang: "FR", text: "VinoInvest est la plateforme d'intelligence artificielle pour l'investissement dans le vin fin. Elle offre des analyses avancées sur 50 000+ vins, un AI Score propriétaire, un suivi de portefeuille, un historique des prix et des actualités personnalisées." },
          ].map(item => (
            <div key={item.lang} className="vi-card" style={{ marginBottom: 12, padding: "16px 20px", borderRadius: "var(--vi-radius-md)" }}>
              <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 700, color: "var(--vi-text-dim)", marginBottom: 8, letterSpacing: "0.06em" }}>{item.lang}</div>
              <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Brand */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-xl)", fontWeight: 700, marginBottom: 20 }}>
            Brand Assets
          </h2>

          {/* Logo preview */}
          <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{
              background: "var(--vi-bg)", border: "1px solid rgba(201,162,39,0.3)",
              borderRadius: "var(--vi-radius-md)", padding: "24px 32px",
              display: "flex", alignItems: "center"
            }}>
              <span style={{ fontFamily: "var(--vi-font-display)", fontSize: 28, fontWeight: 900 }}>
                Vino<span style={{ color: "var(--vi-accent)" }}>Invest</span>
              </span>
            </div>
            <div style={{
              background: "#F8F4EF", border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "var(--vi-radius-md)", padding: "24px 32px",
              display: "flex", alignItems: "center"
            }}>
              <span style={{ fontFamily: "var(--vi-font-display)", fontSize: 28, fontWeight: 900, color: "#1a1a2e" }}>
                Vino<span style={{ color: "#8B1A1A" }}>Invest</span>
              </span>
            </div>
          </div>

          {/* Colors */}
          <h3 style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 600, marginBottom: 12 }}>Brand Colors</h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { name: "Gold", hex: "#C9A227" },
              { name: "Navy", hex: "#0B0E14" },
              { name: "Wine Red", hex: "#8B1A1A" },
              { name: "Slate", hex: "#8A95A8" },
              { name: "Cream", hex: "#F8F4EF" },
            ].map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--vi-radius-sm)",
                  background: c.hex,
                  border: c.hex === "#F8F4EF" ? "1px solid rgba(0,0,0,0.1)" : `1px solid rgba(255,255,255,0.08)`
                }} />
                <div>
                  <div style={{ fontSize: "var(--vi-fs-xs)", fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", fontFamily: "monospace" }}>{c.hex}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Downloads */}
          <h3 style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 600, marginBottom: 12 }}>Downloads</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {DOWNLOADS.map(d => (
              <div key={d.label} className="pk-download vi-card" style={{
                borderRadius: "var(--vi-radius-md)", padding: "14px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--vi-fs-sm)" }}>{d.label}</div>
                  <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 2 }}>{d.desc}</div>
                </div>
                <button
                  className="pk-dl-btn"
                  onClick={() => alert("Contact press@vinoinvest.com for assets")}
                  style={{
                    padding: "4px 12px",
                    background: "rgba(201,162,39,0.1)", color: "var(--vi-accent)",
                    border: "1px solid rgba(201,162,39,0.3)", borderRadius: "var(--vi-radius-sm)",
                    fontSize: "var(--vi-fs-sm)"
                  }}
                  aria-label={`Download ${d.label}`}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshots */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-xl)", fontWeight: 700, marginBottom: 16 }}>
            Screenshots
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {["Market Dashboard", "Portfolio Tracker", "AI Wine Advisor", "Price History Chart"].map(s => (
              <div key={s} className="vi-card" style={{
                borderRadius: "var(--vi-radius-md)",
                aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 8, color: "var(--vi-text-dim)"
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--vi-bg-elev)", border: `1px solid var(--vi-border)` }} />
                <span style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 600 }}>{s}</span>
                <span style={{ fontSize: "var(--vi-fs-xs)", opacity: 0.6 }}>Contact press@vinoinvest.com</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid var(--vi-border)`, paddingTop: 24, fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>
          For press inquiries:{" "}
          <a href="mailto:press@vinoinvest.com" style={{ color: "var(--vi-accent)" }}>press@vinoinvest.com</a>
        </div>
      </div>
    </div>
  );
}
