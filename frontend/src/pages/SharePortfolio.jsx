import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

function ROIBadge({ roi }) {
  const color = roi >= 0 ? "#4ade80" : "#f87171";
  return (
    <span style={{ color, fontSize: 12, fontWeight: 700, background: `${color}15`, borderRadius: 4, padding: "1px 6px" }}>
      {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
    </span>
  );
}

export default function SharePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);
  const isPublicView = window.location.pathname.startsWith("/share/");
  const portfolioId = isPublicView ? window.location.pathname.split("/share/")[1] : null;

  useEffect(() => {
    if (isPublicView) loadPublicPortfolio(portfolioId);
    else loadMyPortfolio();
  }, []);

  async function loadMyPortfolio() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(`${API}/api/orders/${session.user.id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      const h = (data.orders || []).filter(o => o.status !== "sold");

      const totalInvested = h.reduce((s, o) => s + (parseFloat(o.purchase_price) || 0) * (o.quantity || 1), 0);
      const totalValue = h.reduce((s, o) => s + (parseFloat(o.current_market_price) || parseFloat(o.purchase_price) || 0) * (o.quantity || 1), 0);
      const roi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

      setHoldings(h);
      setStats({ totalInvested, totalValue, roi, count: h.length });
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function loadPublicPortfolio(id) {
    setLoading(false);
    // Public portfolios would be stored with a share token; for now show placeholder
    setHoldings([]);
    setStats(null);
  }

  async function sharePortfolio() {
    const url = `${window.location.origin}/share/${Date.now()}`;
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  }

  if (loading) return <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #020617 0%, #0a1628 50%, #020617 100%)", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        {!isPublicView && <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back</a>}

        {/* Header */}
        <div style={{ textAlign: "center", margin: "32px 0 40px" }}>
          <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            VinoInvest Portfolio
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 12 }}>
            🍷 Fine Wine Portfolio
          </h1>
          {stats && (
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <div style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 12, padding: "12px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#C9A227" }}>€{stats.totalValue.toLocaleString("it-IT", { minimumFractionDigits: 0 })}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Portfolio Value</div>
              </div>
              <div style={{ background: stats.roi >= 0 ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${stats.roi >= 0 ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius: 12, padding: "12px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: stats.roi >= 0 ? "#4ade80" : "#f87171" }}>
                  {stats.roi >= 0 ? "+" : ""}{stats.roi.toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Total Return</div>
              </div>
              <div style={{ background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", borderRadius: 12, padding: "12px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#818cf8" }}>{stats.count}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Wines</div>
              </div>
            </div>
          )}
        </div>

        {/* Holdings */}
        {holdings.length > 0 ? (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "#94a3b8" }}>Holdings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {holdings.map(h => {
                const invested = parseFloat(h.purchase_price || 0) * (h.quantity || 1);
                const value = parseFloat(h.current_market_price || h.purchase_price || 0) * (h.quantity || 1);
                const roi = invested > 0 ? ((value - invested) / invested) * 100 : 0;
                return (
                  <div key={h.id} style={{
                    background: "rgba(11,18,32,0.9)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 12, padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap"
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{h.wineName}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{h.quantity}x · Purchased {h.purchaseDate ? new Date(h.purchaseDate).getFullYear() : "–"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>€{value.toLocaleString()}</div>
                      <ROIBadge roi={roi} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : !isPublicView ? (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "#475569" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <p>Add wines to your portfolio to share it</p>
          </div>
        ) : null}

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.05))", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>Build Your Wine Portfolio</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
            Track 50,000+ fine wines with AI-powered scoring and price intelligence
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/" style={{ padding: "12px 24px", background: "#C9A227", color: "#020617", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
              Start Free →
            </a>
            {!isPublicView && (
              <button onClick={sharePortfolio} style={{
                padding: "12px 24px", background: "rgba(201,162,39,0.1)", color: "#C9A227",
                border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 14
              }}>
                {shared ? "✓ Link Copied!" : "Share My Portfolio"}
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#334155" }}>
          VinoInvest · Past performance does not guarantee future results · Not financial advice
        </div>
      </div>
    </div>
  );
}
