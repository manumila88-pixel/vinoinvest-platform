import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "manumila88@gmail.com";
const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const BG = "#0b1220";

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function StatCard({ label, value, sub, color = "#C9A227" }) {
  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantPlan, setGrantPlan] = useState("investor");
  const [grantMsg, setGrantMsg] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Guard: only admin can access
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("vino_user") || "{}");
    if (user.email !== ADMIN_EMAIL) {
      navigate("/");
    }
  }, [navigate]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeader();
      const [statsRes, usersRes, secRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/users`, { headers }),
        fetch(`${API}/api/admin/security-events`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (secRes.ok) setSecurityEvents(await secRes.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function handleGrant(e) {
    e.preventDefault();
    setGrantMsg("");
    try {
      const headers = { ...await getAuthHeader(), "Content-Type": "application/json" };
      const r = await fetch(`${API}/api/admin/grant-access`, { method: "POST", headers, body: JSON.stringify({ email: grantEmail, plan: grantPlan }) });
      const d = await r.json();
      setGrantMsg(d.ok ? `Accesso ${grantPlan} concesso a ${grantEmail}` : `Errore: ${d.error}`);
      if (d.ok) { setGrantEmail(""); loadAll(); }
    } catch (e) { setGrantMsg("Errore di rete"); }
  }

  async function handleRevoke(email) {
    if (!confirm(`Revocare accesso a ${email}?`)) return;
    const headers = { ...await getAuthHeader(), "Content-Type": "application/json" };
    await fetch(`${API}/api/admin/revoke-access`, { method: "POST", headers, body: JSON.stringify({ email }) });
    loadAll();
  }

  const tabs = ["overview", "users", "security", "grant"];

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.3)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontWeight: 700, fontSize: 15, padding: 0 }}>VinoInvest</button>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>Admin Dashboard</span>
            <span style={{ fontSize: 11, background: "rgba(201,162,39,0.15)", color: "#C9A227", borderRadius: 4, padding: "2px 8px", fontWeight: 700 }}>ADMIN</span>
          </div>
          <button onClick={loadAll} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 14px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
            {loading ? "Caricamento..." : "Aggiorna"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 16, marginBottom: 24, color: "#f87171" }}>Errore: {error}</div>}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "9px 16px", borderRadius: 9, border: "none", background: activeTab === t ? "#1a2535" : "transparent", color: activeTab === t ? "#C9A227" : "#64748b", fontWeight: activeTab === t ? 700 : 500, cursor: "pointer", fontSize: 13, textTransform: "capitalize" }}>
              {t === "overview" ? "Panoramica" : t === "users" ? "Utenti" : t === "security" ? "Sicurezza" : "Accessi"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
              <StatCard label="Utenti Totali" value={stats.users?.total || 0} />
              <StatCard label="Abbonamenti Attivi" value={stats.subscriptions?.total || 0} sub={`MRR: €${stats.subscriptions?.mrr || "0.00"}`} color="#4ade80" />
              <StatCard label="Academy Learners" value={stats.academy?.learners || 0} sub={`${stats.academy?.completions || 0} completamenti`} color="#60a5fa" />
              <StatCard label="Certificati" value={stats.academy?.certificates || 0} color="#c084fc" />
            </div>

            {/* Plan breakdown */}
            {stats.subscriptions?.byPlan && Object.keys(stats.subscriptions.byPlan).length > 0 && (
              <div style={{ background: "#1a2535", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Distribuzione Piani</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {Object.entries(stats.subscriptions.byPlan).map(([plan, count]) => (
                    <div key={plan} style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 10, padding: "10px 18px" }}>
                      <div style={{ fontSize: 10, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.08em" }}>{plan}</div>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API usage */}
            {stats.api?.topEndpoints?.length > 0 && (
              <div style={{ background: "#1a2535", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Utilizzo API (30gg)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {stats.api.topEndpoints.map((ep, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 13 }}>
                      <span style={{ color: "#60a5fa", fontFamily: "monospace" }}>{ep.endpoint}</span>
                      <span style={{ color: "#64748b" }}>{ep.calls} req · €{ep.cost.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit log */}
            {stats.auditLog?.length > 0 && (
              <div style={{ background: "#1a2535", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Audit Log Recente</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
                  {stats.auditLog.map((entry, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "7px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 12, flexWrap: "wrap" }}>
                      <span style={{ color: "#C9A227", fontWeight: 700 }}>{entry.action}</span>
                      <span style={{ color: "#64748b" }}>{entry.target}</span>
                      <span style={{ color: "#475569", marginLeft: "auto" }}>{new Date(entry.created_at).toLocaleString("it-IT")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div style={{ background: "#1a2535", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Utenti ({users.length})</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Email", "Tipo", "Piano", "Attivo", "Registrato", "Azioni"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#475569", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "10px 12px", color: u.email === ADMIN_EMAIL ? "#C9A227" : "#e2e8f0" }}>
                        {u.email}
                        {u.email === ADMIN_EMAIL && <span style={{ fontSize: 10, marginLeft: 6, background: "rgba(201,162,39,0.15)", color: "#C9A227", borderRadius: 3, padding: "1px 5px" }}>ADMIN</span>}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#64748b" }}>{u.account_type || "b2c"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {u.plan ? <span style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", borderRadius: 4, padding: "2px 7px" }}>{u.plan}</span> : <span style={{ color: "#475569" }}>—</span>}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ color: u.sub_active ? "#4ade80" : "#475569" }}>{u.sub_active ? "Sì" : "No"}</span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#475569" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("it-IT") : "—"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {u.sub_active && u.email !== ADMIN_EMAIL && (
                          <button onClick={() => handleRevoke(u.email)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "4px 10px", color: "#f87171", cursor: "pointer", fontSize: 12 }}>
                            Revoca
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && !loading && <div style={{ color: "#475569", textAlign: "center", padding: 32 }}>Nessun utente trovato. La tabella users potrebbe non essere popolata.</div>}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div style={{ background: "#1a2535", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Security Events (ultimi 7gg)</div>
            {securityEvents.length === 0 ? (
              <div style={{ color: "#475569", textAlign: "center", padding: 32 }}>Nessun evento di sicurezza registrato.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {securityEvents.map((ev, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: ev.event_type?.includes("fail") || ev.event_type?.includes("lock") ? "rgba(239,68,68,0.15)" : "rgba(201,162,39,0.15)", color: ev.event_type?.includes("fail") || ev.event_type?.includes("lock") ? "#f87171" : "#C9A227", borderRadius: 4, padding: "2px 8px", textTransform: "uppercase" }}>
                      {ev.event_type}
                    </span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>×{ev.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grant Access Tab */}
        {activeTab === "grant" && (
          <div style={{ background: "#1a2535", borderRadius: 16, padding: 32, maxWidth: 480 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Concedi / Revoca Accesso</div>
            <form onSubmit={handleGrant} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>Email utente</label>
                <input value={grantEmail} onChange={e => setGrantEmail(e.target.value)} type="email" required placeholder="utente@esempio.com"
                  style={{ width: "100%", background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>Piano</label>
                <select value={grantPlan} onChange={e => setGrantPlan(e.target.value)}
                  style={{ width: "100%", background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14 }}>
                  <option value="investor">Academy Investor (€9.99/mese)</option>
                  <option value="professional">Academy Professional (€19.99/mese)</option>
                  <option value="bundle">Bundle Completo (€24.99/mese)</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <button type="submit" style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, color: "#0b1220", cursor: "pointer", fontSize: 15 }}>
                Concedi Accesso
              </button>
              {grantMsg && <div style={{ fontSize: 13, color: grantMsg.includes("Errore") ? "#f87171" : "#4ade80", padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>{grantMsg}</div>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
