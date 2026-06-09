import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../lib/authFetch";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";

const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

function StatCard({ label, value, sub, color = "#60a5fa" }) {
  return (
    <div style={{
      padding: "20px 24px", borderRadius: 14,
      background: "rgba(8,15,30,0.7)", border: `1px solid rgba(${color === "#60a5fa" ? "59,130,246" : color === "#34d399" ? "52,211,153" : "167,139,250"},0.2)`,
    }}>
      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'Playfair Display',serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function RiskBadge({ label, score }) {
  const color = score < 30 ? "#34d399" : score < 60 ? "#fbbf24" : "#f87171";
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: `${color}20`, border: `1px solid ${color}50`, color,
    }}>{label}</span>
  );
}

export default function OrgDashboard({ user }) {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [clients, setClients] = useState([]);
  const [members, setMembers] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [tab, setTab] = useState("clients");
  const [loading, setLoading] = useState(true);
  const [newOrgName, setNewOrgName] = useState("");
  const [newClientForm, setNewClientForm] = useState({ client_name: "", client_email: "", aum_wine: "" });
  const [showNewClient, setShowNewClient] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [createdKey, setCreatedKey] = useState(null);

  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) { setShowAuthModal(false); loadOrgs(); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadOrgs = useCallback(async () => {
    try {
      const r = await authFetch(`${API}/api/organizations/my`);
      if (r.ok) { const d = await r.json(); setOrgs(d); if (d.length && !selectedOrg) setSelectedOrg(d[0]); }
    } catch {}
    setLoading(false);
  }, []);

  const loadOrgData = useCallback(async (org) => {
    if (!org) return;
    try {
      const [cr, mr, ar] = await Promise.all([
        authFetch(`${API}/api/client-portfolios?orgId=${org.id}`),
        authFetch(`${API}/api/organizations/${org.id}/members`),
        authFetch(`${API}/api/organizations/${org.id}/api-keys`),
      ]);
      if (cr.ok) setClients(await cr.json());
      if (mr.ok) setMembers(await mr.json());
      if (ar.ok) setApiKeys(await ar.json());
    } catch {}
  }, []);

  const loadAudit = useCallback(async () => {
    if (!selectedOrg) return;
    try {
      const r = await authFetch(`${API}/api/organizations/${selectedOrg.id}/audit?limit=50`);
      if (r.ok) setAuditLog(await r.json());
    } catch {}
  }, [selectedOrg]);

  useEffect(() => { loadOrgs(); }, [loadOrgs]);
  useEffect(() => { if (selectedOrg) loadOrgData(selectedOrg); }, [selectedOrg, loadOrgData]);
  useEffect(() => { if (tab === "audit") loadAudit(); }, [tab, loadAudit]);

  async function createOrg(e) {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    const r = await authFetch(`${API}/api/organizations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newOrgName }) });
    if (r.ok) { await loadOrgs(); setNewOrgName(""); }
  }

  async function createClient(e) {
    e.preventDefault();
    const r = await authFetch(`${API}/api/client-portfolios?orgId=${selectedOrg.id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newClientForm, aum_wine: parseFloat(newClientForm.aum_wine) || 0 }),
    });
    if (r.ok) { await loadOrgData(selectedOrg); setNewClientForm({ client_name: "", client_email: "", aum_wine: "" }); setShowNewClient(false); }
  }

  async function createApiKey() {
    if (!newKeyLabel.trim()) return;
    const r = await authFetch(`${API}/api/organizations/${selectedOrg.id}/api-keys`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: newKeyLabel }),
    });
    if (r.ok) { const d = await r.json(); setCreatedKey(d); setNewKeyLabel(""); await loadOrgData(selectedOrg); }
  }

  const totalAUM = clients.reduce((s, c) => s + (Number(c.aum_wine) || 0), 0);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
      Caricamento dashboard...
    </div>
  );

  if (!session) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <p style={{ color: "#475569" }}>Accedi per gestire la tua organizzazione</p>
      <button onClick={() => setShowAuthModal(true)} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer" }}>
        Accedi
      </button>
      {showAuthModal && (
        <AuthModal
          reason="Accedi per gestire la tua organizzazione B2B"
          onSuccess={() => { setShowAuthModal(false); loadOrgs(); }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );

  if (orgs.length === 0) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", color: "#e2e8f0", padding: 40 }}>
      <Helmet><title>Organizzazione B2B | VinoInvest</title></Helmet>
      <div style={{ maxWidth: 560, margin: "80px auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🏢</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 12 }}>Crea la tua Organizzazione</h2>
        <p style={{ color: "#64748b", marginBottom: 32, lineHeight: 1.7 }}>
          La dashboard B2B ti permette di gestire portfolio clienti separati, generare report professionali e accedere alle API enterprise.
        </p>
        <form onSubmit={createOrg} style={{ display: "flex", gap: 12 }}>
          <input
            value={newOrgName} onChange={e => setNewOrgName(e.target.value)}
            placeholder="Nome organizzazione (es: Family Office Rossi)"
            required
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 10,
              background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.3)",
              color: "#e2e8f0", fontSize: 14, outline: "none",
            }}
          />
          <button type="submit" style={{
            padding: "12px 24px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer",
          }}>Crea →</button>
        </form>
      </div>
    </div>
  );

  const TABS = [
    { id: "clients", label: "Clienti", icon: "👥" },
    { id: "members", label: "Team", icon: "🤝" },
    { id: "apikeys", label: "API Keys", icon: "🔑" },
    { id: "audit", label: "Audit Log", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif" }}>
      <Helmet>
        <title>{selectedOrg?.name || "Organizzazione"} — Dashboard B2B | VinoInvest</title>
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(59,130,246,0.1)", padding: "0 32px", background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🍷</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>VinoInvest</span>
            </a>
            <span style={{ color: "#1e3a5f" }}>›</span>
            {orgs.length > 1 ? (
              <select
                value={selectedOrg?.id || ""}
                onChange={e => setSelectedOrg(orgs.find(o => o.id === e.target.value))}
                style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", padding: "4px 8px", borderRadius: 6, fontSize: 13 }}
              >
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            ) : (
              <span style={{ fontSize: 14, fontWeight: 600, color: "#60a5fa" }}>{selectedOrg?.name}</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontWeight: 700 }}>
              {(selectedOrg?.plan || "starter").toUpperCase()}
            </span>
            <a href="/b2b" style={{ fontSize: 12, color: "#3a5a7a", textDecoration: "none", padding: "6px 12px", borderRadius: 8, background: "rgba(8,15,30,0.5)" }}>
              ← B2B
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(16px,4vw,32px)" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Clienti Totali" value={clients.length} sub={`${clients.filter(c => c.kyc_status === "approved").length} KYC approvati`} />
          <StatCard label="AUM Wine Totale" value={`€${(totalAUM / 1000).toFixed(0)}k`} sub="portfolio aggregato" color="#34d399" />
          <StatCard label="Prossime Review" value={clients.filter(c => c.next_review).length} sub="in agenda" color="#a78bfa" />
          <StatCard label="Team Members" value={members.length} sub={`${members.filter(m => m.role === "owner").length} owner`} color="#fbbf24" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid rgba(59,130,246,0.1)", paddingBottom: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: "none", color: tab === t.id ? "#60a5fa" : "#475569",
              borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: -1, transition: "color 0.2s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Clients Tab */}
        {tab === "clients" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Portfolio Clienti</h3>
              <button onClick={() => setShowNewClient(!showNewClient)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff",
              }}>+ Nuovo Cliente</button>
            </div>

            {showNewClient && (
              <form onSubmit={createClient} style={{
                padding: 24, borderRadius: 14, background: "rgba(8,15,30,0.7)", border: "1px solid rgba(59,130,246,0.2)",
                display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 20,
              }}>
                {[
                  { key: "client_name", label: "Nome Cliente", placeholder: "Mario Rossi", required: true },
                  { key: "client_email", label: "Email", placeholder: "mario@email.com", required: false },
                  { key: "aum_wine", label: "AUM Wine (€)", placeholder: "50000", required: false },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 11, color: "#60a5fa", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                    <input
                      value={newClientForm[f.key]} onChange={e => setNewClientForm(d => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} required={f.required}
                      style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
                  <button type="submit" style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    Crea Cliente
                  </button>
                  <button type="button" onClick={() => setShowNewClient(false)} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.2)", background: "none", color: "#475569", cursor: "pointer", fontSize: 13 }}>
                    Annulla
                  </button>
                </div>
              </form>
            )}

            {clients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
                <p>Nessun cliente ancora. Crea il tuo primo portfolio cliente.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {clients.map(c => (
                  <div key={c.id} style={{
                    padding: "16px 20px", borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.1)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(135deg,#1d4ed8,#7c3aed)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0,
                      }}>
                        {(c.client_name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.client_name}</div>
                        <div style={{ fontSize: 11, color: "#3a5a7a" }}>{c.client_email || "—"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>
                          €{(Number(c.aum_wine) || 0).toLocaleString("it-IT")}
                        </div>
                        <div style={{ fontSize: 10, color: "#1e3a5f" }}>AUM Wine</div>
                      </div>
                      <div>
                        <span style={{
                          padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700,
                          background: c.kyc_status === "approved" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                          border: `1px solid ${c.kyc_status === "approved" ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}`,
                          color: c.kyc_status === "approved" ? "#34d399" : "#fbbf24",
                        }}>
                          KYC {c.kyc_status === "approved" ? "✓" : "Pending"}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#334155" }}>
                          {c.next_review ? `Review: ${new Date(c.next_review).toLocaleDateString("it-IT")}` : "Nessuna review"}
                        </div>
                        <div style={{ fontSize: 10, color: "#1e3a5f" }}>{c.interaction_count || 0} interazioni</div>
                      </div>
                      <a href={`/clients/${c.id}`} style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                        color: "#60a5fa", textDecoration: "none",
                      }}>Apri →</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {tab === "members" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Team Members</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {members.map(m => (
                <div key={m.id} style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>
                      {(m.user_email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.user_email || m.user_id}</div>
                      <div style={{ fontSize: 11, color: "#334155" }}>{m.accepted_at ? `Accettato ${new Date(m.accepted_at).toLocaleDateString("it-IT")}` : "Invito pendente"}</div>
                    </div>
                  </div>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                    background: m.role === "owner" ? "rgba(251,191,36,0.1)" : "rgba(59,130,246,0.1)",
                    border: `1px solid ${m.role === "owner" ? "rgba(251,191,36,0.3)" : "rgba(59,130,246,0.2)"}`,
                    color: m.role === "owner" ? "#fbbf24" : "#60a5fa",
                  }}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {tab === "apikeys" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>API Keys</h3>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <input
                value={newKeyLabel} onChange={e => setNewKeyLabel(e.target.value)}
                placeholder="Etichetta chiave (es: Bloomberg Integration)"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
              />
              <button onClick={createApiKey} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                Genera Chiave
              </button>
            </div>
            {createdKey && (
              <div style={{ padding: 16, borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", marginBottom: 8 }}>⚠ Salva questa chiave — non sarà mostrata di nuovo</div>
                <code style={{ fontSize: 13, color: "#e2e8f0", wordBreak: "break-all" }}>{createdKey.key}</code>
              </div>
            )}
            {apiKeys.length === 0 ? (
              <p style={{ color: "#334155", fontSize: 13 }}>Nessuna chiave API ancora. Creane una per integrare Bloomberg, Excel o altri sistemi.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {apiKeys.map(k => (
                  <div key={k.id} style={{ padding: "14px 20px", borderRadius: 10, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{k.label}</div>
                      <code style={{ fontSize: 11, color: "#475569" }}>{k.key_prefix}••••••••••••••••</code>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: "#34d399" }}>{k.requests_today || 0} / {(k.daily_limit || 10000).toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: "#1e3a5f" }}>req oggi</div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: k.active ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", color: k.active ? "#34d399" : "#f87171" }}>
                        {k.active ? "Attiva" : "Disattivata"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audit Tab */}
        {tab === "audit" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Audit Log</h3>
              <a
                href={`${API}/api/organizations/${selectedOrg?.id}/audit/export.csv`}
                style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", textDecoration: "none" }}
              >
                Export CSV ↓
              </a>
            </div>
            {auditLog.length === 0 ? (
              <p style={{ color: "#334155", fontSize: 13 }}>Nessuna attività registrata ancora.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {auditLog.map(e => (
                  <div key={e.id} style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(8,15,30,0.5)", border: "1px solid rgba(59,130,246,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontFamily: "monospace", color: "#60a5fa", fontSize: 11 }}>{e.action}</span>
                      <span style={{ color: "#334155" }}>{e.resource || ""} {e.resource_id ? `#${e.resource_id.substring(0, 8)}` : ""}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, color: "#1e3a5f" }}>
                      <span>{e.user_id?.substring(0, 12)}…</span>
                      <span>{new Date(e.ts).toLocaleString("it-IT")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
