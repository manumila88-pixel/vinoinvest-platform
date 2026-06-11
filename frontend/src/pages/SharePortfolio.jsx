import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

function ROIBadge({ roi }) {
  const positive = roi >= 0;
  return (
    <span style={{
      color: positive ? "var(--vi-positive)" : "var(--vi-negative)",
      fontSize: "var(--vi-fs-xs)", fontWeight: 700,
      background: positive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
      borderRadius: 4, padding: "1px 6px",
      fontVariantNumeric: "tabular-nums"
    }}>
      {positive ? "+" : ""}{roi.toFixed(1)}%
    </span>
  );
}

export default function SharePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const printRef = useRef(null);
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
      if (!session) { setIsGuest(true); setLoading(false); return; }
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
    } catch (e) { setError("Errore nel caricamento del portfolio."); }
    setLoading(false);
  }

  async function loadPublicPortfolio(id) {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/portfolio/share/${id}`);
      if (!res.ok) { setError("Portfolio non trovato o scaduto."); setLoading(false); return; }
      const data = await res.json();
      setHoldings(data.holdings || []);
      setStats(data.stats || null);
    } catch (e) { setError("Errore nel caricamento."); }
    setLoading(false);
  }

  async function sharePortfolio() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${API}/api/portfolio/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ holdings, stats }),
      });
      const data = await res.json();
      if (data.shareId) {
        const url = `${window.location.origin}/share/${data.shareId}`;
        setShareUrl(url);
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 4000);
      }
    } catch {}
  }

  function exportPDF() {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body > *:not(#vi-portfolio-print) { display: none !important; }
        #vi-portfolio-print { display: block !important; background: #fff !important; color: #000 !important; }
        .vi-no-print { display: none !important; }
      }
    `;
    style.id = "vi-print-style";
    document.getElementById("vi-print-style")?.remove();
    document.head.appendChild(style);
    window.print();
    setTimeout(() => style.remove(), 1500);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vi-text-dim)" }}>
      Loading...
    </div>
  );

  if (!isPublicView && isGuest) return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--vi-text-dim)" }}>
      <div style={{ fontSize: 40 }}>📊</div>
      <p style={{ color: "var(--vi-text)", fontSize: 16 }}>Accedi per vedere il tuo portfolio</p>
      <p style={{ fontSize: 13 }}>Gestisci e condividi il tuo portfolio di investimenti in vino.</p>
      <a href="/" style={{ marginTop: 8, padding: "10px 24px", background: "var(--vi-accent)", color: "#020617", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>Accedi a VinoInvest →</a>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--vi-text-dim)" }}>
      <div style={{ fontSize: 40 }}>🍷</div>
      <p>{error}</p>
      <a href="/" style={{ color: "var(--vi-accent)", textDecoration: "none" }}>Torna alla piattaforma</a>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <style>{`
        .sp-holding { transition: background var(--vi-dur-fast) linear; }
        .sp-holding:hover { background: var(--vi-bg-elev) !important; }
      `}</style>

      <div id="vi-portfolio-print" ref={printRef} style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(24px,4vw,40px) 24px" }}>
        {!isPublicView && (
          <a href="/" className="vi-no-print" style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", textDecoration: "none" }}>← Back</a>
        )}

        {/* Header */}
        <div style={{ textAlign: "center", margin: "32px 0 40px" }}>
          <div style={{
            fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12
          }}>
            VinoInvest Portfolio
          </div>
          <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-2xl)", fontWeight: 800, marginBottom: 12 }}>
            Fine Wine Portfolio
          </h1>
          {stats && (
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <div className="vi-card" style={{ border: "1px solid rgba(201,162,39,0.2)", padding: "12px 20px", borderRadius: "var(--vi-radius-md)" }}>
                <div style={{ fontSize: "var(--vi-fs-xl)", fontWeight: 800, color: "var(--vi-accent)", fontVariantNumeric: "tabular-nums" }}>
                  €{(stats.totalValue || 0).toLocaleString("it-IT", { minimumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)" }}>Portfolio Value</div>
              </div>
              <div className="vi-card" style={{
                border: `1px solid ${(stats.roi || 0) >= 0 ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                padding: "12px 20px", borderRadius: "var(--vi-radius-md)"
              }}>
                <div style={{
                  fontSize: "var(--vi-fs-xl)", fontWeight: 800,
                  color: (stats.roi || 0) >= 0 ? "var(--vi-positive)" : "var(--vi-negative)",
                  fontVariantNumeric: "tabular-nums"
                }}>
                  {(stats.roi || 0) >= 0 ? "+" : ""}{(stats.roi || 0).toFixed(1)}%
                </div>
                <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)" }}>Total Return</div>
              </div>
              <div className="vi-card" style={{ padding: "12px 20px", borderRadius: "var(--vi-radius-md)" }}>
                <div style={{ fontSize: "var(--vi-fs-xl)", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{stats.count || holdings.length}</div>
                <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)" }}>Wines</div>
              </div>
            </div>
          )}
        </div>

        {/* Holdings */}
        {holdings.length > 0 ? (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 600, marginBottom: 16, color: "var(--vi-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Holdings</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {holdings.map((h, i) => {
                const invested = parseFloat(h.purchase_price || 0) * (h.quantity || 1);
                const value = parseFloat(h.current_market_price || h.purchase_price || 0) * (h.quantity || 1);
                const roi = invested > 0 ? ((value - invested) / invested) * 100 : 0;
                return (
                  <div key={h.id || i} className="sp-holding vi-card" style={{
                    borderRadius: "var(--vi-radius-md)", padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap"
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontFamily: "var(--vi-font-display)" }}>{h.wineName || h.wine_name || h.name}</div>
                      <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 2 }}>
                        {h.quantity}x
                        {(h.purchaseDate || h.purchase_date) ? ` · ${new Date(h.purchaseDate || h.purchase_date).getFullYear()}` : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>€{value.toLocaleString()}</div>
                      <ROIBadge roi={roi} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : !isPublicView ? (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--vi-text-dim)" }}>
            <div style={{
              width: 64, height: 64, margin: "0 auto 12px",
              background: "var(--vi-surface)", borderRadius: "var(--vi-radius-md)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28
            }}>📊</div>
            <p>Aggiungi vini al portfolio per condividerlo</p>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--vi-text-dim)" }}>
            <p>Questo portfolio non contiene vini.</p>
          </div>
        )}

        {/* CTA */}
        <div className="vi-no-print" style={{
          background: "linear-gradient(135deg, rgba(201,162,39,0.12), rgba(201,162,39,0.04))",
          border: "1px solid rgba(201,162,39,0.25)",
          borderRadius: "var(--vi-radius-lg)", padding: "clamp(20px,3vw,28px) 24px", textAlign: "center"
        }}>
          <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-lg)", fontWeight: 700, marginBottom: 8 }}>
            {isPublicView ? "Costruisci il tuo portfolio" : "Condividi & Esporta"}
          </h3>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", marginBottom: 20, lineHeight: 1.6 }}>
            {isPublicView
              ? "Traccia 50.000+ vini pregiati con AI scoring e price intelligence"
              : "Condividi il link pubblico o esporta in PDF per report e advisor"}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/" className="vi-btn" style={{ textDecoration: "none" }}>
              {isPublicView ? "Inizia gratis" : "Torna alla piattaforma"}
            </a>
            {!isPublicView && holdings.length > 0 && (
              <>
                <button onClick={sharePortfolio} style={{
                  padding: "10px 22px",
                  background: shared ? "rgba(74,222,128,0.15)" : "rgba(201,162,39,0.1)",
                  color: shared ? "var(--vi-positive)" : "var(--vi-accent)",
                  border: `1px solid ${shared ? "rgba(74,222,128,0.3)" : "rgba(201,162,39,0.3)"}`,
                  borderRadius: "var(--vi-radius-md)", fontWeight: 600, cursor: "pointer",
                  fontSize: "var(--vi-fs-sm)"
                }}>
                  {shared ? "✓ Link copiato!" : "Condividi portfolio"}
                </button>
                <button onClick={exportPDF} style={{
                  padding: "10px 22px",
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--vi-text-dim)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--vi-radius-md)", fontWeight: 600, cursor: "pointer",
                  fontSize: "var(--vi-fs-sm)"
                }}>
                  Esporta PDF
                </button>
              </>
            )}
          </div>
          {shared && shareUrl && (
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--vi-text-dim)", wordBreak: "break-all" }}>
              {shareUrl}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", opacity: 0.6 }}>
          VinoInvest · Past performance does not guarantee future results · Not financial advice
        </div>
      </div>
    </div>
  );
}
