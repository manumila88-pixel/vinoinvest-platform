import React from "react";

const DOWNLOADS = [
  { label: "Logo SVG (dark bg)", desc: "For use on dark backgrounds", icon: "🖼️" },
  { label: "Logo SVG (light bg)", desc: "For use on light backgrounds", icon: "🖼️" },
  { label: "Brand guidelines PDF", desc: "Colors, fonts, spacing", icon: "📄" },
  { label: "Press release IT", desc: "Comunicato stampa (Italiano)", icon: "📰" },
  { label: "Press release EN", desc: "Press release (English)", icon: "📰" },
  { label: "Press release FR", desc: "Communiqué de presse (Français)", icon: "📰" },
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
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 40 }}>
          ← Back to VinoInvest
        </a>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
            Vino<span style={{ color: "#C9A227" }}>Invest</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 12 }}>Press Kit</h1>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, maxWidth: 600 }}>
            Resources for journalists, bloggers, and media covering fine wine investment and FinTech.
          </p>
          <a href="mailto:press@vinoinvest.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: "#C9A227", textDecoration: "none", fontWeight: 600 }}>
            📧 press@vinoinvest.com
          </a>
        </div>

        {/* Facts */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 24 }}>Key Facts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {FACTS.map(f => (
              <div key={f.label} style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#C9A227", fontFamily: "'Playfair Display', serif" }}>{f.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 20 }}>About VinoInvest</h2>
          {[
            { lang: "🇮🇹 IT", text: "VinoInvest è la piattaforma AI per l'investimento nel vino pregiato. Offre analisi avanzate su 50.000+ vini, AI Score proprietario, tracker del portfolio, storico prezzi e notizie personalizzate. La piattaforma serve sia investitori privati che istituzionali che desiderano inserire il vino pregiato nel proprio portfolio di asset alternativi." },
            { lang: "🇬🇧 EN", text: "VinoInvest is the AI-powered platform for fine wine investment. It provides advanced analytics on 50,000+ wines, a proprietary AI Score, portfolio tracker, price history and personalised news. The platform serves both private and institutional investors looking to include fine wine in their alternative asset portfolio." },
            { lang: "🇫🇷 FR", text: "VinoInvest est la plateforme d'intelligence artificielle pour l'investissement dans le vin fin. Elle offre des analyses avancées sur 50 000+ vins, un AI Score propriétaire, un suivi de portefeuille, un historique des prix et des actualités personnalisées." },
          ].map(item => (
            <div key={item.lang} style={{ marginBottom: 20, background: "rgba(11,18,32,0.6)", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>{item.lang}</div>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Brand */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 20 }}>Brand Assets</h2>

          {/* Logo preview */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ background: "#020617", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 12, padding: "24px 32px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900 }}>Vino<span style={{ color: "#C9A227" }}>Invest</span></span>
            </div>
            <div style={{ background: "#F8F4EF", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "24px 32px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "#1a1a2e" }}>Vino<span style={{ color: "#8B1A1A" }}>Invest</span></span>
            </div>
          </div>

          {/* Colors */}
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Brand Colors</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { name: "Gold", hex: "#C9A227", bg: "#C9A227" },
              { name: "Navy", hex: "#020617", bg: "#020617", light: true },
              { name: "Wine Red", hex: "#8B1A1A", bg: "#8B1A1A" },
              { name: "Slate", hex: "#94a3b8", bg: "#94a3b8" },
              { name: "Cream", hex: "#F8F4EF", bg: "#F8F4EF", dark: true },
            ].map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: c.bg, border: c.light || c.dark ? "1px solid rgba(255,255,255,0.1)" : "none" }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{c.hex}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Downloads */}
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Downloads</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {DOWNLOADS.map(d => (
              <div key={d.label} style={{
                background: "rgba(11,18,32,0.6)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 10, padding: "14px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13 }}>
                    <span>{d.icon}</span>{d.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{d.desc}</div>
                </div>
                <button
                  onClick={() => alert("Contact press@vinoinvest.com for assets")}
                  style={{ padding: "4px 12px", background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshots */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 16 }}>Screenshots</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {["Market Dashboard", "Portfolio Tracker", "AI Wine Advisor", "Price History Chart"].map(s => (
              <div key={s} style={{
                background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 12,
                aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 8, color: "#475569"
              }}>
                <span style={{ fontSize: 32 }}>🖥️</span>
                <span style={{ fontSize: 13 }}>{s}</span>
                <span style={{ fontSize: 11 }}>Contact press@vinoinvest.com</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(30,41,59,0.4)", paddingTop: 24, fontSize: 13, color: "#475569" }}>
          For press inquiries: <a href="mailto:press@vinoinvest.com" style={{ color: "#C9A227" }}>press@vinoinvest.com</a>
        </div>
      </div>
    </div>
  );
}
