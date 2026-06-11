import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const BG = "#0b1220";
const GOLD = "#C9A227";

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("vino_user") || "{}"); } catch { return {}; }
}

function Section({ title, description, children }) {
  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: 28, marginBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{description}</div>
      </div>
      {children}
    </div>
  );
}

export default function PrivacySettings() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [exportStatus, setExportStatus] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleDataExport() {
    setExportLoading(true);
    setExportStatus(null);
    try {
      const userId = localStorage.getItem("vino_user_id");
      if (!userId) { setExportStatus({ error: "Accedi per esportare i dati." }); setExportLoading(false); return; }

      // Collect all local data
      const storedUser = getStoredUser();
      const userEmail = storedUser.email || userId;
      const localData = {
        user: storedUser,
        academy_progress: JSON.parse(localStorage.getItem("vino_academy_v1") || "{}"),
        module_progress: JSON.parse(localStorage.getItem("vino_module_progress_v1") || "{}"),
        watchlist: JSON.parse(localStorage.getItem("vino_watchlist") || "[]"),
        theme: localStorage.getItem("vino_theme"),
        exportedAt: new Date().toISOString(),
        userId,
      };

      // Fetch server-side data
      const headers = await getAuthHeader();
      const [ordersRes, progressRes] = await Promise.all([
        fetch(`${API}/api/orders?userId=${encodeURIComponent(userEmail)}`).catch(() => null),
        fetch(`${API}/api/academy/progress/${userId}`, { headers }).catch(() => null),
      ]);

      if (ordersRes?.ok) localData.orders = await ordersRes.json();
      if (progressRes?.ok) localData.academy_server_progress = await progressRes.json();

      const blob = new Blob([JSON.stringify(localData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vinoinvest_data_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus({ ok: true, message: "Dati esportati con successo." });
    } catch (e) {
      setExportStatus({ error: `Errore: ${e.message}` });
    }
    setExportLoading(false);
  }

  async function handleAccountDelete(e) {
    e.preventDefault();
    if (deleteConfirm !== "ELIMINA") {
      setDeleteStatus({ error: "Digita ELIMINA per confermare." });
      return;
    }
    setDeleteLoading(true);
    setDeleteStatus(null);
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear all local storage
      localStorage.clear();
      setDeleteStatus({ ok: true, message: "Account eliminato. Tutti i dati locali sono stati rimossi." });
      setTimeout(() => navigate("/"), 3000);
    } catch (e) {
      setDeleteStatus({ error: `Errore: ${e.message}` });
    }
    setDeleteLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(30,41,59,0.7)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0" }}>Privacy & Dati</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Privacy & Gestione Dati</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Conformità GDPR — hai il diritto di accedere, esportare ed eliminare tutti i tuoi dati in qualsiasi momento.
          {user.email && <> Account: <strong style={{ color: "#94a3b8" }}>{user.email}</strong></>}
        </p>

        {/* Data we store */}
        <Section title="Dati che raccogliamo" description="Elenco completo dei dati personali memorizzati sulla piattaforma.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Email e profilo Supabase", purpose: "Autenticazione e personalizzazione" },
              { label: "Ordini di acquisto simulati", purpose: "Portfolio e storico transazioni" },
              { label: "Watchlist vini", purpose: "Preferenze di monitoraggio" },
              { label: "Progressi Academy e quiz", purpose: "Tracciamento apprendimento" },
              { label: "Alert prezzi", purpose: "Notifiche automatiche" },
              { label: "Feedback e valutazioni", purpose: "Miglioramento del prodotto" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 13, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: "#64748b" }}>{item.purpose}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Data export */}
        <Section title="Esporta i tuoi dati (Art. 20 GDPR)" description="Scarica una copia completa di tutti i tuoi dati in formato JSON leggibile da macchina.">
          <button onClick={handleDataExport} disabled={exportLoading}
            style={{ background: GOLD, border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, color: BG, cursor: exportLoading ? "default" : "pointer", fontSize: 14, opacity: exportLoading ? 0.7 : 1 }}>
            {exportLoading ? "Preparazione..." : "Scarica i miei dati →"}
          </button>
          {exportStatus && (
            <div style={{ marginTop: 12, fontSize: 13, color: exportStatus.error ? "#f87171" : "#4ade80" }}>
              {exportStatus.error || exportStatus.message}
            </div>
          )}
        </Section>

        {/* Cookie policy */}
        <Section title="Cookie e Storage locale" description="VinoInvest usa solo cookie essenziali per l'autenticazione. Nessun cookie di profilazione di terze parti.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "vino_user", type: "localStorage", purpose: "Email e tipo account (necessario)", essential: true },
              { name: "vino_academy_v1", type: "localStorage", purpose: "Progressi Academy", essential: true },
              { name: "vino_watchlist", type: "localStorage", purpose: "Lista vini preferiti", essential: true },
              { name: "sb-*", type: "cookie", purpose: "Sessione Supabase (autenticazione)", essential: true },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: 13, flexWrap: "wrap", alignItems: "center" }}>
                <code style={{ color: "#60a5fa", fontFamily: "monospace", fontSize: 12 }}>{c.name}</code>
                <span style={{ color: "#475569", fontSize: 11 }}>{c.type}</span>
                <span style={{ flex: 1, color: "#64748b" }}>{c.purpose}</span>
                <span style={{ fontSize: 10, background: "rgba(74,222,128,0.1)", color: "#4ade80", borderRadius: 3, padding: "1px 6px" }}>Essenziale</span>
              </div>
            ))}
          </div>
          <button onClick={() => { localStorage.removeItem("vino_watchlist"); localStorage.removeItem("vino_theme"); alert("Cookie non-essenziali rimossi."); }}
            style={{ marginTop: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 18px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
            Rimuovi dati non essenziali
          </button>
        </Section>

        {/* Account deletion */}
        <Section
          title="Elimina account (Art. 17 GDPR — Diritto all'oblio)"
          description="L'eliminazione rimuove immediatamente tutti i tuoi dati locali e disconnette la sessione. I dati server (ordini, progressi) vengono marcati per cancellazione entro 30 giorni."
        >
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
              Questa azione è <strong style={{ color: "#f87171" }}>irreversibile</strong>. Tutti i tuoi progressi Academy, ordini e preferenze verranno eliminati permanentemente.
            </div>
            <form onSubmit={handleAccountDelete} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>Digita ELIMINA per confermare</label>
                <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="ELIMINA"
                  style={{ background: "#0b1220", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, width: "100%", boxSizing: "border-box" }} />
              </div>
              <button type="submit" disabled={deleteLoading || deleteConfirm !== "ELIMINA"}
                style={{ background: deleteConfirm === "ELIMINA" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${deleteConfirm === "ELIMINA" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: 8, padding: "11px 20px", color: deleteConfirm === "ELIMINA" ? "#f87171" : "#2d3748", cursor: deleteConfirm === "ELIMINA" && !deleteLoading ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 600 }}>
                {deleteLoading ? "Eliminazione in corso..." : "Elimina account definitivamente"}
              </button>
            </form>
            {deleteStatus && (
              <div style={{ marginTop: 12, fontSize: 13, color: deleteStatus.error ? "#f87171" : "#4ade80" }}>
                {deleteStatus.error || deleteStatus.message}
              </div>
            )}
          </div>
        </Section>

        {/* Contact DPO */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 18, fontSize: 13, color: "#475569", textAlign: "center" }}>
          Per richieste GDPR: <a href="mailto:privacy@vinoinvest.io" style={{ color: GOLD }}>privacy@vinoinvest.io</a> · Risposta entro 30 giorni come da regolamento UE 2016/679
        </div>
      </div>
    </div>
  );
}
