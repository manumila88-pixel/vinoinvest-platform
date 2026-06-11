import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { API, ADMIN_EMAIL } from "../lib/constants";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const BG = "#0b1220";
const GOLD = "#C9A227";
const CARD = "#1a2535";
const BORDER = "rgba(255,255,255,0.06)";

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function StatCard({ label, value, sub, color = GOLD, delta }) {
  return (
    <div style={{ background: CARD, borderRadius: 16, padding: "20px 24px", border: `1px solid ${BORDER}` }}>
      <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{sub}</div>}
      {delta !== undefined && (
        <div style={{ fontSize: 12, color: delta >= 0 ? "#22c55e" : "#ef4444", marginTop: 4 }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs settimana precedente
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 12, marginTop: 0 }}>
      {children}
    </h3>
  );
}

const TABS = [
  { id: "overview", label: "Panoramica" },
  { id: "sequences", label: "Sequenze" },
  { id: "behavioral", label: "Trigger" },
  { id: "revenue", label: "Revenue" },
  { id: "recent", label: "Ultimi invii" },
];

export default function AdminEmailDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [chartWidth, setChartWidth] = useState(520);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("vino_user") || "{}");
    if (user.email !== ADMIN_EMAIL) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setChartWidth(Math.floor(e.contentRect.width) - 32);
    });
    const el = document.getElementById("chart-container");
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${API}/api/admin/email-analytics`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const t = data?.totals || {};
  const bySegment = data?.bySegment || [];
  const byDay = data?.byDay || [];
  const behavioral = data?.behavioral || [];
  const recent = data?.recent || [];
  const revenue = data?.revenueAttribution || {};

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#020617", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link to="/admin" style={{ color: "#64748b", textDecoration: "none", fontSize: 13 }}>← Admin</Link>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>
          Vino<span style={{ color: GOLD }}>Invest</span>
          <span style={{ fontSize: 13, fontWeight: 400, color: "#64748b", marginLeft: 12 }}>Email Dashboard</span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={load} style={{ background: "rgba(201,162,39,0.1)", border: `1px solid ${BORDER}`, color: GOLD, padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            ↻ Aggiorna
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
            <div style={{ fontSize: 32 }}>📧</div>
            <p>Caricamento analytics...</p>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 20, color: "#fca5a5", marginBottom: 24 }}>
            Errore: {error} · <button onClick={load} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer" }}>Riprova</button>
          </div>
        )}

        {!loading && data && (
          <>
            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard label="Email inviate" value={parseInt(t.sent || 0).toLocaleString("it-IT")} sub="totale storico" />
              <StatCard label="Open rate" value={`${t.open_rate || 0}%`} sub={`${parseInt(t.opened || 0).toLocaleString()} aperture`} color={parseFloat(t.open_rate || 0) > 25 ? "#22c55e" : GOLD} />
              <StatCard label="Click rate" value={`${t.click_rate || 0}%`} sub={`${parseInt(t.clicked || 0).toLocaleString()} click`} color={parseFloat(t.click_rate || 0) > 3 ? "#22c55e" : GOLD} />
              <StatCard label="Unsub rate" value={`${t.unsub_rate || 0}%`} sub={`${parseInt(t.unsubscribed || 0)} cancellazioni`} color={parseFloat(t.unsub_rate || 0) > 1 ? "#ef4444" : "#22c55e"} />
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab.id ? `2px solid ${GOLD}` : "2px solid transparent",
                    color: activeTab === tab.id ? GOLD : "#64748b",
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: activeTab === tab.id ? 700 : 400,
                    cursor: "pointer",
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "overview" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Segment breakdown */}
                  <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                    <SectionTitle>Performance per Segmento</SectionTitle>
                    {bySegment.map(seg => (
                      <div key={seg.segment} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                        <div>
                          <span style={{ fontWeight: 700, textTransform: "uppercase", fontSize: 12, color: seg.segment === 'b2b' ? "#60a5fa" : GOLD }}>{seg.segment}</span>
                          <span style={{ color: "#64748b", fontSize: 12, marginLeft: 8 }}>{parseInt(seg.sent || 0).toLocaleString()} inviate</span>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 700, color: "#e2e8f0" }}>{seg.open_rate || 0}%</div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>open</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 700, color: "#e2e8f0" }}>{parseInt(seg.clicked || 0)}</div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>click</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!bySegment.length && <p style={{ color: "#64748b", fontSize: 13 }}>Nessun dato segmento disponibile.</p>}
                  </div>

                  {/* Top performing days */}
                  <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                    <SectionTitle>Top Email per Open Rate</SectionTitle>
                    {[...byDay].sort((a, b) => parseFloat(b.open_rate || 0) - parseFloat(a.open_rate || 0)).slice(0, 6).map(row => (
                      <div key={row.day_number} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                        <div>
                          <span style={{ fontWeight: 700, color: GOLD, fontSize: 12 }}>Day {row.day_number}</span>
                          <span style={{ color: "#64748b", fontSize: 11, marginLeft: 8, display: "block" }}>{(row.email_subject || '').slice(0, 40)}</span>
                        </div>
                        <div style={{ fontWeight: 700, color: parseFloat(row.open_rate || 0) > 30 ? "#22c55e" : "#e2e8f0" }}>
                          {row.open_rate || 0}%
                        </div>
                      </div>
                    ))}
                    {!byDay.length && <p style={{ color: "#64748b", fontSize: 13 }}>Nessun dato disponibile.</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sequences" && (
              <div id="chart-container">
                <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
                  <SectionTitle>Open Rate per Giorno della Sequenza</SectionTitle>
                  {byDay.length > 0 ? (
                    <BarChart width={chartWidth} height={280} data={byDay.sort((a, b) => a.day_number - b.day_number)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day_number" stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "Giorno", position: "insideBottom", offset: -4, fill: "#64748b", fontSize: 11 }} />
                      <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        contentStyle={{ background: "#1a2535", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
                        formatter={(val) => [`${val}%`, "Open rate"]}
                        labelFormatter={(l) => `Day ${l}`}
                      />
                      <Bar dataKey="open_rate" fill={GOLD} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : <p style={{ color: "#64748b", fontSize: 13 }}>Nessun dato disponibile.</p>}
                </div>

                {/* Full sequence table */}
                <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                  <SectionTitle>Tabella Sequenza Completa</SectionTitle>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ color: "#64748b", textAlign: "left" }}>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Giorno</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Subject</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Inviate</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Aperte</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Click</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Open %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byDay.sort((a, b) => a.day_number - b.day_number).map(row => (
                          <tr key={row.day_number} style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: GOLD }}>D{row.day_number}</td>
                            <td style={{ padding: "10px 12px", color: "#94a3b8", fontSize: 12, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.email_subject || '—'}</td>
                            <td style={{ padding: "10px 12px", color: "#e2e8f0" }}>{parseInt(row.sent || 0)}</td>
                            <td style={{ padding: "10px 12px", color: "#e2e8f0" }}>{parseInt(row.opened || 0)}</td>
                            <td style={{ padding: "10px 12px", color: "#e2e8f0" }}>{parseInt(row.clicked || 0)}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: parseFloat(row.open_rate || 0) > 30 ? "#22c55e" : "#e2e8f0" }}>
                              {row.open_rate || 0}%
                            </td>
                          </tr>
                        ))}
                        {!byDay.length && (
                          <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Nessun dato sequenza disponibile</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "behavioral" && (
              <div>
                <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                  <SectionTitle>Trigger Comportamentali</SectionTitle>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ color: "#64748b", textAlign: "left" }}>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Evento</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Email inviate</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Aperte</th>
                          <th style={{ padding: "8px 12px", borderBottom: `1px solid ${BORDER}` }}>Open rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {behavioral.map(row => (
                          <tr key={row.trigger_event} style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: "#e2e8f0" }}>{row.trigger_event || '—'}</td>
                            <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{parseInt(row.sent || 0)}</td>
                            <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{parseInt(row.opened || 0)}</td>
                            <td style={{ padding: "10px 12px", fontWeight: 700, color: parseFloat(row.open_rate || 0) > 40 ? "#22c55e" : GOLD }}>
                              {row.open_rate || 0}%
                            </td>
                          </tr>
                        ))}
                        {!behavioral.length && (
                          <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Nessun trigger comportamentale ancora registrato</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "revenue" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <StatCard
                    label="Acquirenti attribuiti"
                    value={parseInt(revenue.buyers || 0).toLocaleString("it-IT")}
                    sub="ordini entro 48h da un click email"
                    color="#22c55e"
                  />
                  <StatCard
                    label="Revenue attribuita"
                    value={revenue.revenue ? `€${parseFloat(revenue.revenue).toLocaleString("it-IT", { maximumFractionDigits: 0 })}` : "€0"}
                    sub="valore ordini post-click (48h window)"
                    color="#22c55e"
                  />
                </div>
                <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                  <SectionTitle>Come funziona la revenue attribution</SectionTitle>
                  <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
                    Viene attribuito a email marketing ogni ordine effettuato entro <strong style={{ color: "#e2e8f0" }}>48 ore</strong> dall'ultimo click su un'email VinoInvest.
                    Metodologia conservativa (single-touch, last-click). Nella realtà l'impatto è più alto perché non tutti gli ordini vengono tracciati end-to-end.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "recent" && (
              <div style={{ background: CARD, borderRadius: 16, padding: 20, border: `1px solid ${BORDER}` }}>
                <SectionTitle>Ultime 20 Email Inviate</SectionTitle>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ color: "#64748b", textAlign: "left" }}>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Email</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Segmento</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Tipo</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Giorno</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Subject</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Inviata</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Aperta</th>
                        <th style={{ padding: "8px 10px", borderBottom: `1px solid ${BORDER}` }}>Click</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map(row => (
                        <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ padding: "8px 10px", color: "#94a3b8" }}>{(row.user_email || '').split('@')[0]}…</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ background: row.segment === 'b2b' ? "rgba(96,165,250,0.15)" : "rgba(201,162,39,0.1)", color: row.segment === 'b2b' ? "#60a5fa" : GOLD, borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>
                              {row.segment}
                            </span>
                          </td>
                          <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 11 }}>{row.trigger_type}</td>
                          <td style={{ padding: "8px 10px", color: GOLD, fontWeight: 700 }}>{row.day_number >= 0 ? `D${row.day_number}` : '—'}</td>
                          <td style={{ padding: "8px 10px", color: "#e2e8f0", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.email_subject || '—'}</td>
                          <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 11 }}>{row.sent_at ? new Date(row.sent_at).toLocaleDateString("it-IT") : '—'}</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ color: row.opened_at ? "#22c55e" : "#ef4444", fontSize: 16 }}>{row.opened_at ? "✓" : "–"}</span>
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ color: row.clicked_at ? "#22c55e" : "#64748b", fontSize: 16 }}>{row.clicked_at ? "✓" : "–"}</span>
                          </td>
                        </tr>
                      ))}
                      {!recent.length && (
                        <tr><td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Nessuna email inviata ancora</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
