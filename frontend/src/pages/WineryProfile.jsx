import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GOLD = "#C9A227";
const WINE = "#d97706";
const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// ── Public winery profile — readable by all, editable only by the owner ──────
export default function WineryProfile() {
  const { producerName: paramName } = useParams();
  const navigate = useNavigate();

  const [isOwner, setIsOwner] = useState(false);
  const [producerName, setProducerName] = useState(paramName || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);

  // Profile fields (editable by owner, read-only for visitors)
  const [profile, setProfile] = useState({
    displayName: "",
    location: "",
    founded: "",
    hectares: "",
    description: "",
    philosophy: "",
    certifications: "",
    website: "",
    instagram: "",
  });

  const [wines, setWines] = useState([]);
  const [winesLoading, setWinesLoading] = useState(true);

  // Determine if logged-in user is the owner of this winery profile
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const orgName = user.user_metadata?.organization_name || user.user_metadata?.winery_name || localStorage.getItem("vino_org_name") || "";
      // Owner if: no param (own dashboard view) OR param matches org name
      if (!paramName || normalize(orgName) === normalize(paramName)) {
        setIsOwner(true);
        const saved = user.user_metadata?.winery_profile || {};
        setProfile(prev => ({ ...prev, displayName: orgName, ...saved }));
        setProducerName(orgName);
      } else {
        // Visitor: show producer param as display name
        setProfile(prev => ({ ...prev, displayName: paramName }));
      }
    });
  }, [paramName]);

  // Load wines for this producer
  useEffect(() => {
    const name = producerName || paramName;
    if (!name) return;
    setWinesLoading(true);
    fetch(`${API}/api/wines?producer=${encodeURIComponent(name)}&limit=50&sort=vintage`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setWines(d.results || d.wines || []); setWinesLoading(false); })
      .catch(() => setWinesLoading(false));
  }, [producerName, paramName]);

  async function saveProfile() {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { winery_profile: profile, organization_name: profile.displayName } });
      setProducerName(profile.displayName);
      try { localStorage.setItem("vino_org_name", profile.displayName); } catch {}
      setSaveOk(true);
      setEditing(false);
      setTimeout(() => setSaveOk(false), 3000);
    } catch {}
    setSaving(false);
  }

  const displayName = profile.displayName || producerName || paramName || "Cantina";

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, rgba(217,119,6,0.15) 0%, #0b1220 100%)`, borderBottom: "1px solid rgba(217,119,6,0.2)", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: WINE, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: WINE, cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
            PROFILO CANTINA · VinoInvest
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            {/* Logo placeholder */}
            <div style={{ width: 72, height: 72, borderRadius: 18, background: `rgba(217,119,6,0.15)`, border: `2px solid rgba(217,119,6,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              🏡
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              {editing ? (
                <input value={profile.displayName} onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))}
                  style={{ fontSize: 26, fontWeight: 900, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(217,119,6,0.4)", borderRadius: 8, padding: "6px 12px", color: "#fff", width: "100%", fontFamily: "inherit" }}
                  placeholder="Nome cantina"
                />
              ) : (
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>{displayName}</h1>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12, color: "#94a3b8" }}>
                {(editing ? profile.location : profile.location) && <span>📍 {profile.location}</span>}
                {(editing ? profile.founded : profile.founded) && <span>📅 {profile.founded}</span>}
                {(editing ? profile.hectares : profile.hectares) && <span>🌿 {profile.hectares} ha</span>}
                {!editing && !profile.location && !profile.founded && isOwner && (
                  <span style={{ color: "#475569", fontStyle: "italic" }}>Clicca "Modifica" per aggiungere i dettagli</span>
                )}
              </div>
            </div>
            {isOwner && (
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {editing ? (
                  <>
                    <button onClick={saveProfile} disabled={saving} style={{ background: WINE, border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, color: "#fff", cursor: "pointer", fontSize: 13 }}>
                      {saving ? "Salvo…" : "Salva"}
                    </button>
                    <button onClick={() => setEditing(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 16px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
                      Annulla
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} style={{ background: "rgba(217,119,6,0.12)", border: `1px solid rgba(217,119,6,0.3)`, borderRadius: 8, padding: "8px 16px", color: WINE, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                    ✏️ Modifica profilo
                  </button>
                )}
              </div>
            )}
          </div>

          {saveOk && (
            <div style={{ marginTop: 12, padding: "8px 14px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, fontSize: 12, color: "#4ade80" }}>
              ✓ Profilo salvato con successo
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── Editing fields ─────────────────────────────────────────── */}
        {editing && (
          <div style={{ background: "#1a2535", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 16, padding: 24, marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: WINE, marginBottom: 20, letterSpacing: "0.05em" }}>DETTAGLI CANTINA</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { key: "location",       label: "Città / Regione",    placeholder: "es. Montalcino, Toscana" },
                { key: "founded",        label: "Anno fondazione",     placeholder: "es. 1888" },
                { key: "hectares",       label: "Ettari vitati",       placeholder: "es. 32" },
                { key: "certifications", label: "Certificazioni",      placeholder: "es. Biologico, Biodinamico" },
                { key: "website",        label: "Sito web",            placeholder: "https://…" },
                { key: "instagram",      label: "Instagram",           placeholder: "@nomecantina" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                  <input
                    value={profile[key]}
                    onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Descrizione cantina</label>
              <textarea
                value={profile.description}
                onChange={e => setProfile(p => ({ ...p, description: e.target.value }))}
                placeholder="Storia, territorio, metodi produttivi…"
                rows={4}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "Inter, serif", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Filosofia produttiva</label>
              <textarea
                value={profile.philosophy}
                onChange={e => setProfile(p => ({ ...p, philosophy: e.target.value }))}
                placeholder="Viticoltura, vinificazione, affinamento…"
                rows={3}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "Inter, serif", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>
        )}

        {/* ── Profilo pubblico ──────────────────────────────────────── */}
        {!editing && (profile.description || profile.philosophy) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            {profile.description && (
              <div style={{ background: "#1a2535", borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: WINE, letterSpacing: "0.08em", marginBottom: 12 }}>LA CANTINA</div>
                <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, margin: 0, fontFamily: "Georgia, serif" }}>{profile.description}</p>
              </div>
            )}
            {profile.philosophy && (
              <div style={{ background: "#1a2535", borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: 12 }}>FILOSOFIA</div>
                <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, margin: 0, fontFamily: "Georgia, serif" }}>{profile.philosophy}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Dettagli rapidi ──────────────────────────────────────── */}
        {!editing && (profile.certifications || profile.website || profile.instagram) && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            {profile.certifications && (
              <span style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#4ade80" }}>
                🌿 {profile.certifications}
              </span>
            )}
            {profile.website && (
              <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer"
                style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#60a5fa", textDecoration: "none" }}>
                🌐 {profile.website}
              </a>
            )}
            {profile.instagram && (
              <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: WINE, textDecoration: "none" }}>
                📸 {profile.instagram}
              </a>
            )}
          </div>
        )}

        {/* ── I Miei Vini / I vini di questa cantina ───────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>
              🍷 {isOwner ? "I miei vini nel catalogo" : `Vini di ${displayName}`}
            </h2>
            <span style={{ fontSize: 12, color: "#64748b" }}>{wines.length} vini · dati di mercato reali</span>
          </div>

          {winesLoading && <div style={{ color: "#64748b", fontSize: 13, padding: "20px 0" }}>Carico vini…</div>}

          {!winesLoading && wines.length === 0 && (
            <div style={{ padding: "24px", color: "#64748b", textAlign: "center", background: "#1a2535", borderRadius: 12 }}>
              Nessun vino trovato nel catalogo per "{displayName}".
              {isOwner && <div style={{ marginTop: 8, fontSize: 12 }}>Contattaci per aggiungere i tuoi vini al catalogo.</div>}
            </div>
          )}

          {!winesLoading && wines.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Vino", "Annata", "Regione", "AI Score", "Prezzo", "Rischio"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wines.map(w => {
                    const score = Number(w.investmentScore ?? w.investment_score ?? 0);
                    const price = Number(w.currentPrice ?? w.current_price ?? 0);
                    return (
                      <tr key={w.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}
                      >
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#e2e8f0" }}>{w.name}</td>
                        <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{w.vintage || "—"}</td>
                        <td style={{ padding: "10px 12px", color: "#94a3b8", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.region || w.country || "—"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          {score ? <span style={{ fontWeight: 800, color: score >= 96 ? "#4ade80" : score >= 88 ? GOLD : "#94a3b8" }}>{score}</span> : <span style={{ color: "#475569" }}>—</span>}
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: GOLD }}>{price ? `€${price.toLocaleString("it-IT")}` : "—"}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.05)", color: w.risk === "basso" || w.risk === "low" ? "#4ade80" : w.risk === "alto" || w.risk === "high" ? "#f87171" : "#f59e0b" }}>
                            {w.risk || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── CTA racconto annata ───────────────────────────────────── */}
        {isOwner && (
          <div style={{ background: `linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(217,119,6,0.06) 100%)`, border: `1px solid rgba(201,162,39,0.25)`, borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", marginBottom: 4 }}>📖 Racconta le tue annate agli investitori</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Ogni annata ha una storia: clima, scelte, sfide e risultati. Scrivila qui.</div>
            </div>
            <button onClick={() => navigate("/winery/vintage-story")}
              style={{ background: GOLD, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>
              Scrivi racconto →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function normalize(s) { return (s || "").toLowerCase().trim(); }
