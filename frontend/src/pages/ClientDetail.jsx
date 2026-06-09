import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../lib/authFetch";

const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function RiskMeter({ label, value, max = 100, format = v => v?.toFixed(2) }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct < 30 ? "#34d399" : pct < 60 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#475569" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value !== null && value !== undefined ? format(value) : "—"}</span>
      </div>
      {value !== null && value !== undefined && (
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: color, transition: "width 0.5s" }} />
        </div>
      )}
    </div>
  );
}

export default function ClientDetail({ user }) {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [risk, setRisk] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [suitability, setSuitability] = useState([]);
  const [note, setNote] = useState("");
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [cr, rr, ir, sr] = await Promise.all([
        authFetch(`${API}/api/client-portfolios/${clientId}`),
        authFetch(`${API}/api/client-portfolios/${clientId}/risk`),
        authFetch(`${API}/api/client-portfolios/${clientId}/interactions`),
        authFetch(`${API}/api/client-portfolios/${clientId}/suitability`),
      ]);
      if (cr.ok) setClient(await cr.json());
      if (rr.ok) setRisk(await rr.json());
      if (ir.ok) setInteractions(await ir.json());
      if (sr.ok) setSuitability(await sr.json());
    } catch {}
    setLoading(false);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  async function addNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    const r = await authFetch(`${API}/api/client-portfolios/${clientId}/interactions`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "note", content: note }),
    });
    if (r.ok) { setNote(""); load(); }
  }

  async function generateReport() {
    if (!client) return;
    window.open(`${API}/api/reports/portfolio/${client.advisor_id}/pdf`, "_blank");
  }

  if (loading) return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
      Loading client...
    </div>
  );

  if (!client) return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
      Cliente non trovato.
    </div>
  );

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "risk", label: "Risk Analytics" },
    { id: "interactions", label: "CRM Timeline" },
    { id: "compliance", label: "Compliance" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif" }}>
      <Helmet><title>{client.client_name} — Cliente B2B | VinoInvest</title></Helmet>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(59,130,246,0.1)", padding: "0 32px", position: "sticky", top: 0, zIndex: 50, background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/org-dashboard" style={{ fontSize: 12, color: "#3a5a7a", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "#1e3a5f" }}>›</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{client.client_name}</span>
          </div>
          <button onClick={generateReport} style={{
            padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
            background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff",
          }}>
            📄 Genera Report PDF
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        {/* Client Card */}
        <div style={{ padding: "24px 28px", borderRadius: 16, background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.15)", marginBottom: 32, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {(client.client_name || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{client.client_name}</div>
            <div style={{ fontSize: 13, color: "#3a5a7a" }}>{client.client_email || "Email non disponibile"}</div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#34d399", fontFamily: "'Playfair Display',serif" }}>
                €{(Number(client.aum_wine) || 0).toLocaleString("it-IT")}
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>AUM Wine</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: client.kyc_status === "approved" ? "#34d399" : "#fbbf24" }}>
                {client.kyc_status === "approved" ? "✓" : "⏳"} KYC
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>{client.kyc_status || "Pending"}</div>
            </div>
            {client.next_review && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>
                  {new Date(client.next_review).toLocaleDateString("it-IT")}
                </div>
                <div style={{ fontSize: 11, color: "#334155" }}>Prossima Review</div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid rgba(59,130,246,0.1)", paddingBottom: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "9px 16px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: "none", color: tab === t.id ? "#60a5fa" : "#475569",
              borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: -1, transition: "color 0.2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && risk && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            <div style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>Rendimento Annuo Stimato</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: risk.annualisedReturn >= 0 ? "#34d399" : "#f87171", fontFamily: "'Playfair Display',serif" }}>
                {risk.annualisedReturn >= 0 ? "+" : ""}{(risk.annualisedReturn * 100).toFixed(1)}%
              </div>
            </div>
            <div style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>Benchmark vs S&P500</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa", fontFamily: "'Playfair Display',serif" }}>
                {risk.benchmarks?.vsSP500 >= 0 ? "+" : ""}{((risk.benchmarks?.vsSP500 || 0) * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>differenziale annuo</div>
            </div>
            <div style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>Risk Score</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: (risk.riskScore || 0) < 40 ? "#34d399" : (risk.riskScore || 0) < 70 ? "#fbbf24" : "#f87171", fontFamily: "'Playfair Display',serif" }}>
                {risk.riskScore || 0}/100
              </div>
              <div style={{ fontSize: 11, color: "#334155" }}>{risk.riskLabel}</div>
            </div>
            {risk.holdings?.map(h => (
              <div key={h.name} style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)" }}>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{h.name}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>€{Number(h.value).toLocaleString("it-IT")}</div>
                <div style={{ fontSize: 11, color: "#3a5a7a" }}>{h.weight} del portfolio</div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Analytics */}
        {tab === "risk" && risk && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 24 }}>
              <RiskMeter label="Volatilità Annua" value={(risk.annualisedVolatility || 0) * 100} max={50} format={v => `${v.toFixed(1)}%`} />
              <RiskMeter label="Sharpe Ratio" value={risk.sharpeRatio} max={3} format={v => v.toFixed(2)} />
              <RiskMeter label="Max Drawdown" value={(risk.maxDrawdown || 0) * 100} max={50} format={v => `${v.toFixed(1)}%`} />
              <RiskMeter label="VaR 95%" value={risk.var95} max={risk.totalValue * 0.3} format={v => `€${v.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`} />
              <RiskMeter label="Concentrazione (HHI)" value={(risk.concentrationRisk || 0) * 100} max={100} format={v => `${v.toFixed(0)}%`} />
              <RiskMeter label="Beta vs Indice" value={risk.beta} max={2} format={v => v.toFixed(2)} />
            </div>

            {/* Benchmark table */}
            <div style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <h4 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700 }}>Confronto Benchmark</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "VinoInvest Fine Wine Index", value: (risk.benchmarks?.vinoInvestIndex * 100).toFixed(1) + "%", color: "#60a5fa" },
                  { label: "S&P 500", value: (risk.benchmarks?.sp500 * 100).toFixed(1) + "%", color: "#94a3b8" },
                  { label: "Oro", value: (risk.benchmarks?.gold * 100).toFixed(1) + "%", color: "#fbbf24" },
                  { label: "Inflazione EU", value: (risk.benchmarks?.euInflation * 100).toFixed(1) + "%", color: "#475569" },
                  { label: "Portfolio Cliente (est.)", value: `${risk.annualisedReturn >= 0 ? "+" : ""}${(risk.annualisedReturn * 100).toFixed(1)}%`, color: "#34d399" },
                ].map(b => (
                  <div key={b.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>{b.label}</span>
                    <span style={{ fontWeight: 700, color: b.color }}>{b.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#1e3a5f", marginTop: 12 }}>
                * Rendimenti indicativi. Le performance passate non garantiscono risultati futuri.
              </div>
            </div>
          </div>
        )}

        {/* CRM Timeline */}
        {tab === "interactions" && (
          <div>
            <form onSubmit={addNote} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <input
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="Aggiungi nota, chiamata, meeting..."
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
              />
              <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                Aggiungi
              </button>
            </form>
            {interactions.length === 0 ? (
              <p style={{ color: "#334155", fontSize: 13 }}>Nessuna interazione registrata.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {interactions.map(i => (
                  <div key={i.id} style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#60a5fa", textTransform: "uppercase" }}>{i.type}</span>
                      <span style={{ fontSize: 11, color: "#334155" }}>{new Date(i.created_at).toLocaleString("it-IT")}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{i.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compliance */}
        {tab === "compliance" && (
          <div>
            <h4 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700 }}>Suitability Assessment</h4>
            {suitability.length === 0 ? (
              <div style={{ padding: 24, borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)", textAlign: "center" }}>
                <p style={{ color: "#334155", fontSize: 13 }}>Nessun assessment ancora.</p>
                <p style={{ color: "#1e3a5f", fontSize: 12 }}>Compila il suitability assessment per documentare la profilazione del rischio del cliente.</p>
              </div>
            ) : (
              suitability.map(s => (
                <div key={s.id} style={{ padding: "20px 24px", borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(52,211,153,0.2)", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>✓ Assessment Firmato</div>
                    <div style={{ fontSize: 12, color: "#334155" }}>{new Date(s.signed_at).toLocaleDateString("it-IT")}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12 }}>
                    <div><span style={{ color: "#475569" }}>Tolleranza rischio:</span> <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.risk_tolerance}</span></div>
                    <div><span style={{ color: "#475569" }}>Orizzonte (anni):</span> <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.investment_horizon}</span></div>
                    <div><span style={{ color: "#475569" }}>AUM totale:</span> <span style={{ color: "#e2e8f0", fontWeight: 600 }}>€{(s.aum_total || 0).toLocaleString("it-IT")}</span></div>
                    <div><span style={{ color: "#475569" }}>Alloc. wine:</span> <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.wine_allocation_pct}%</span></div>
                    <div><span style={{ color: "#475569" }}>Esperienza:</span> <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.experience_level}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
