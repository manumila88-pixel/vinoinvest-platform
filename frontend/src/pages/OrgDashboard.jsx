import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { authFetch } from "../lib/authFetch";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

function StatCard({ label, value, sub, color = "#60a5fa" }) {
  const rgb = color === "#60a5fa" ? "59,130,246" : color === "#34d399" ? "52,211,153" : color === "#fbbf24" ? "251,191,36" : "167,139,250";
  return (
    <div style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(8,15,30,0.7)", border: `1px solid rgba(${rgb},0.2)` }}>
      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'Playfair Display',serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function KycBadge({ status }) {
  const map = { approved: ["#34d399", "✓ KYC"], pending: ["#fbbf24", "KYC Pending"], review: ["#f87171", "KYC Review"] };
  const [color, label] = map[status] || ["#475569", status || "—"];
  return (
    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: `${color}1a`, border: `1px solid ${color}4d`, color }}>
      {label}
    </span>
  );
}

function ReviewUrgency({ nextReview }) {
  if (!nextReview) return null;
  const days = Math.ceil((new Date(nextReview) - new Date()) / 86400000);
  if (days > 14) return null;
  const color = days < 0 ? "#f87171" : days < 7 ? "#fbbf24" : "#60a5fa";
  const label = days < 0 ? `${Math.abs(days)}g scaduta` : days === 0 ? "Oggi" : `${days}g`;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: `${color}1a`, border: `1px solid ${color}4d`, color }}>
      📅 {label}
    </span>
  );
}

export default function OrgDashboard() {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [clients, setClients] = useState([]);
  const [members, setMembers] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [tab, setTab] = useState("clients");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  // Invite client modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ client_name: "", client_email: "" });
  const [inviteResult, setInviteResult] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // API Key creation
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
      if (r.ok) {
        const d = await r.json();
        setOrgs(d);
        if (d.length && !selectedOrg) setSelectedOrg(d[0]);
      }
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
    const r = await authFetch(`${API}/api/organizations`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newOrgName }),
    });
    if (r.ok) { await loadOrgs(); setNewOrgName(""); }
  }

  async function seedDemo() {
    if (!session) return;
    setSeeding(true);
    try {
      const r = await authFetch(`${API}/api/org/demo-seed`, { method: "POST" });
      if (r.ok) { await loadOrgs(); }
      else { const d = await r.json(); alert(d.error || "Errore seed"); }
    } catch (e) { alert(e.message); }
    setSeeding(false);
  }

  async function inviteClient(e) {
    e.preventDefault();
    if (!inviteForm.client_name.trim() || !inviteForm.client_email.trim()) return;
    setInviteLoading(true);
    setInviteResult(null);
    try {
      const r = await authFetch(`${API}/api/org/invite-client`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inviteForm, org_id: selectedOrg.id }),
      });
      const d = await r.json();
      if (r.ok) {
        setInviteResult(d);
        setInviteForm({ client_name: "", client_email: "" });
        await loadOrgData(selectedOrg);
      } else {
        setInviteResult({ error: d.error });
      }
    } catch (e) { setInviteResult({ error: e.message }); }
    setInviteLoading(false);
  }

  async function createApiKey() {
    if (!newKeyLabel.trim()) return;
    const r = await authFetch(`${API}/api/organizations/${selectedOrg.id}/api-keys`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newKeyLabel }),
    });
    if (r.ok) { const d = await r.json(); setCreatedKey(d); setNewKeyLabel(""); await loadOrgData(selectedOrg); }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const totalAUM = clients.reduce((s, c) => s + (Number(c.aum_wine) || 0), 0);
  const urgentReviews = clients.filter(c => {
    if (!c.next_review) return false;
    const days = Math.ceil((new Date(c.next_review) - new Date()) / 86400000);
    return days <= 7;
  }).sort((a, b) => new Date(a.next_review) - new Date(b.next_review));

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
      {showAuthModal && <AuthModal reason="Accedi per gestire la tua organizzazione B2B" onSuccess={() => { setShowAuthModal(false); loadOrgs(); }} onClose={() => setShowAuthModal(false)} />}
    </div>
  );

  if (orgs.length === 0) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", color: "#e2e8f0", padding: 40 }}>
      <Helmet><title>Organizzazione B2B | VinoInvest</title></Helmet>
      <div style={{ maxWidth: 580, margin: "80px auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🏢</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 12 }}>Crea la tua Organizzazione</h2>
        <p style={{ color: "#64748b", marginBottom: 32, lineHeight: 1.7 }}>
          La dashboard B2B ti permette di gestire portfolio clienti separati, generare report professionali e accedere alle API enterprise.
        </p>
        <form onSubmit={createOrg} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <input
            value={newOrgName} onChange={e => setNewOrgName(e.target.value)}
            placeholder="Nome organizzazione (es: Family Office Rossi)" required
            style={{ flex: 1, padding: "12px 16px", borderRadius: 10, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.3)", color: "#e2e8f0", fontSize: 14, outline: "none" }}
          />
          <button type="submit" style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Crea →</button>
        </form>
        <div style={{ borderTop: "1px solid rgba(59,130,246,0.1)", paddingTop: 24 }}>
          <p style={{ fontSize: 13, color: "#334155", marginBottom: 12 }}>Oppure carica 15 clienti demo premium per esplorare la dashboard:</p>
          <button onClick={seedDemo} disabled={seeding} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(167,139,250,0.4)", background: "rgba(167,139,250,0.08)", color: "#a78bfa", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            {seeding ? "Caricamento..." : "🎭 Carica Demo (15 clienti premium)"}
          </button>
        </div>
      </div>
    </div>
  );

  const TABS = [
    { id: "clients", label: "Clienti", icon: "👥" },
    { id: "crm",     label: "CRM",     icon: "📊" },
    { id: "members", label: "Team",    icon: "🤝" },
    { id: "apikeys", label: "API Keys", icon: "🔑" },
    { id: "audit",   label: "Audit Log", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif" }}>
      <Helmet><title>{selectedOrg?.name || "Organizzazione"} — Dashboard B2B | VinoInvest</title></Helmet>

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
              <select value={selectedOrg?.id || ""} onChange={e => setSelectedOrg(orgs.find(o => o.id === e.target.value))}
                style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", padding: "4px 8px", borderRadius: 6, fontSize: 13 }}>
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
            <a href="/b2b" style={{ fontSize: 12, color: "#3a5a7a", textDecoration: "none", padding: "6px 12px", borderRadius: 8, background: "rgba(8,15,30,0.5)" }}>← B2B</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(16px,4vw,32px)" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 16, marginBottom: 24 }}>
          <StatCard label="Clienti Totali" value={clients.length} sub={`${clients.filter(c => c.kyc_status === "approved").length} KYC approvati`} />
          <StatCard label="AUM Wine Totale" value={`€${(totalAUM / 1000000).toFixed(2)}M`} sub="portfolio aggregato" color="#34d399" />
          <StatCard label="Review Urgenti" value={urgentReviews.length} sub="entro 7 giorni" color={urgentReviews.length > 0 ? "#f87171" : "#60a5fa"} />
          <StatCard label="Team Members" value={members.length} sub={`${members.filter(m => m.role === "owner").length} owner`} color="#fbbf24" />
        </div>

        {/* Urgent reviews alert */}
        {urgentReviews.length > 0 && (
          <div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.25)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f87171" }}>
              {urgentReviews.length} review in scadenza:
            </span>
            {urgentReviews.slice(0, 3).map(c => {
              const days = Math.ceil((new Date(c.next_review) - new Date()) / 86400000);
              return (
                <a key={c.id} href={`/clients/${c.id}`} style={{ fontSize: 12, color: "#f87171", textDecoration: "none", padding: "3px 10px", borderRadius: 6, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
                  {c.client_name} ({days < 0 ? `${Math.abs(days)}g scaduta` : days === 0 ? "oggi" : `${days}g`})
                </a>
              );
            })}
            {urgentReviews.length > 3 && <span style={{ fontSize: 12, color: "#475569" }}>+{urgentReviews.length - 3} altri</span>}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
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

        {/* ── CLIENTS TAB ────────────────────────────────────────── */}
        {tab === "clients" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Portfolio Clienti</h3>
              <button onClick={() => { setShowInviteModal(true); setInviteResult(null); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff" }}>
                + Invita Cliente
              </button>
            </div>

            {clients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
                <p style={{ marginBottom: 16 }}>Nessun cliente ancora. Invita il tuo primo cliente.</p>
                <button onClick={seedDemo} disabled={seeding} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(167,139,250,0.4)", background: "rgba(167,139,250,0.08)", color: "#a78bfa", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                  {seeding ? "Caricamento..." : "🎭 Carica 15 clienti demo"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {clients.map(c => (
                  <div key={c.id}
                    style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.1)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {(c.client_name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.client_name}</div>
                        <div style={{ fontSize: 11, color: "#3a5a7a" }}>{c.client_email || "—"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>€{(Number(c.aum_wine) || 0).toLocaleString("it-IT")}</div>
                        <div style={{ fontSize: 10, color: "#1e3a5f" }}>AUM Wine</div>
                      </div>
                      <KycBadge status={c.kyc_status} />
                      <ReviewUrgency nextReview={c.next_review} />
                      {c.last_contact && (
                        <div style={{ fontSize: 11, color: "#334155" }}>
                          Contatto: {new Date(c.last_contact).toLocaleDateString("it-IT")}
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: "#1e3a5f" }}>{c.interaction_count || 0} int.</div>
                      <a href={`/clients/${c.id}`} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", textDecoration: "none" }}>
                        Apri →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CRM TAB ───────────────────────────────────────────── */}
        {tab === "crm" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>CRM — Gestione Relazioni</h3>

            {/* Upcoming reviews */}
            <div style={{ marginBottom: 28 }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#f87171" }}>📅 Prossime Review</h4>
              {clients.filter(c => c.next_review).sort((a, b) => new Date(a.next_review) - new Date(b.next_review)).slice(0, 8).map(c => {
                const days = Math.ceil((new Date(c.next_review) - new Date()) / 86400000);
                const color = days < 0 ? "#f87171" : days < 7 ? "#fbbf24" : "#60a5fa";
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: "rgba(8,15,30,0.6)", border: `1px solid ${color}20`, marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 700 }}>
                        {(c.client_name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.client_name}</div>
                        <div style={{ fontSize: 11, color: "#3a5a7a" }}>€{(Number(c.aum_wine) || 0).toLocaleString("it-IT")}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color, fontWeight: 700 }}>
                        {days < 0 ? `⚠ ${Math.abs(days)}g scaduta` : days === 0 ? "⚡ Oggi" : `${days}g`}
                      </span>
                      <span style={{ fontSize: 11, color: "#475569" }}>{new Date(c.next_review).toLocaleDateString("it-IT")}</span>
                      <a href={`/clients/${c.id}`} style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", padding: "4px 10px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>Apri</a>
                    </div>
                  </div>
                );
              })}
              {clients.filter(c => c.next_review).length === 0 && (
                <p style={{ color: "#334155", fontSize: 13 }}>Nessuna review programmata.</p>
              )}
            </div>

            {/* No recent contact */}
            <div>
              <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>📞 Nessun Contatto Recente (&gt;30 giorni)</h4>
              {(() => {
                const stale = clients.filter(c => {
                  if (!c.last_contact) return true;
                  const days = Math.floor((new Date() - new Date(c.last_contact)) / 86400000);
                  return days > 30;
                });
                if (!stale.length) return <p style={{ color: "#334155", fontSize: 13 }}>Tutti i clienti contattati recentemente. ✅</p>;
                return stale.map(c => {
                  const days = c.last_contact ? Math.floor((new Date() - new Date(c.last_contact)) / 86400000) : null;
                  return (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(251,191,36,0.1)", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 700 }}>
                          {(c.client_name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{c.client_name}</div>
                          <div style={{ fontSize: 11, color: "#3a5a7a" }}>{c.client_email || "—"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#fbbf24" }}>{days !== null ? `${days}g fa` : "Mai"}</span>
                        <a href={`/clients/${c.id}`} style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", padding: "4px 10px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>Contatta</a>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* ── MEMBERS TAB ──────────────────────────────────────── */}
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
                  <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: m.role === "owner" ? "rgba(251,191,36,0.1)" : "rgba(59,130,246,0.1)", border: `1px solid ${m.role === "owner" ? "rgba(251,191,36,0.3)" : "rgba(59,130,246,0.2)"}`, color: m.role === "owner" ? "#fbbf24" : "#60a5fa" }}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── API KEYS TAB ─────────────────────────────────────── */}
        {tab === "apikeys" && (
          <div>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>API Keys</h3>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <input value={newKeyLabel} onChange={e => setNewKeyLabel(e.target.value)}
                placeholder="Etichetta (es: Bloomberg Integration)"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
              <button onClick={createApiKey} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                Genera
              </button>
            </div>
            {createdKey && (
              <div style={{ padding: 16, borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", marginBottom: 8 }}>⚠ Salva questa chiave — non sarà mostrata di nuovo</div>
                <code style={{ fontSize: 13, color: "#e2e8f0", wordBreak: "break-all" }}>{createdKey.key}</code>
              </div>
            )}
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
          </div>
        )}

        {/* ── AUDIT TAB ────────────────────────────────────────── */}
        {tab === "audit" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Audit Log</h3>
              <a href={`${API}/api/organizations/${selectedOrg?.id}/audit/export.csv`}
                style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", textDecoration: "none" }}>
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
                      <span style={{ color: "#334155" }}>{e.resource || ""} {e.resource_id ? `#${String(e.resource_id).substring(0, 8)}` : ""}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, color: "#1e3a5f" }}>
                      <span>{String(e.user_id || "").substring(0, 12)}…</span>
                      <span>{new Date(e.ts).toLocaleString("it-IT")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── INVITE CLIENT MODAL ──────────────────────────────────── */}
      {showInviteModal && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200 }} onClick={() => { setShowInviteModal(false); setInviteResult(null); }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 201, width: "min(520px,90vw)", background: "linear-gradient(145deg,#0d1829,#070d1a)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 18, padding: "32px 28px", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>Invita Cliente</h3>
              <button onClick={() => { setShowInviteModal(false); setInviteResult(null); }} aria-label="Chiudi" style={{ background: "none", border: "none", color: "#475569", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            {!inviteResult ? (
              <form onSubmit={inviteClient} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#60a5fa", marginBottom: 4, fontWeight: 600 }}>Nome Cliente *</label>
                  <input
                    value={inviteForm.client_name} onChange={e => setInviteForm(d => ({ ...d, client_name: e.target.value }))}
                    placeholder="Mario Rossi" required
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#60a5fa", marginBottom: 4, fontWeight: 600 }}>Email Cliente *</label>
                  <input
                    type="email" value={inviteForm.client_email} onChange={e => setInviteForm(d => ({ ...d, client_email: e.target.value }))}
                    placeholder="mario@email.com" required
                    style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 8, background: "rgba(4,8,20,0.8)", border: "1px solid rgba(59,130,246,0.2)", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
                  Il cliente riceverà un'email con le credenziali di accesso e potrà vedere il suo portfolio su VinoInvest.
                </p>
                <button type="submit" disabled={inviteLoading} style={{ padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                  {inviteLoading ? "Invio in corso..." : "Invia Invito →"}
                </button>
              </form>
            ) : inviteResult.error ? (
              <div>
                <div style={{ padding: 16, borderRadius: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", marginBottom: 16 }}>
                  <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>❌ {inviteResult.error}</p>
                </div>
                <button onClick={() => setInviteResult(null)} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(59,130,246,0.3)", background: "none", color: "#60a5fa", cursor: "pointer" }}>Riprova</button>
              </div>
            ) : (
              <div>
                <div style={{ padding: 20, borderRadius: 12, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.3)", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#34d399", marginBottom: 12 }}>✅ Invito creato con successo!</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>
                    <strong style={{ color: "#e2e8f0" }}>Email:</strong> {inviteResult.client_email}
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
                    <strong style={{ color: "#e2e8f0" }}>Password temporanea:</strong>
                    <code style={{ marginLeft: 8, background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 4, color: "#e2e8f0" }}>{inviteResult.temp_password}</code>
                  </div>
                  <button onClick={() => copyToClipboard(`Email: ${inviteResult.client_email}\nPassword: ${inviteResult.temp_password}`)}
                    style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(52,211,153,0.4)", background: "rgba(52,211,153,0.1)", color: "#34d399", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    {copied ? "✓ Copiato!" : "📋 Copia credenziali"}
                  </button>
                </div>
                <button onClick={() => { setShowInviteModal(false); setInviteResult(null); }} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", cursor: "pointer", fontWeight: 600, width: "100%" }}>
                  Chiudi
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
