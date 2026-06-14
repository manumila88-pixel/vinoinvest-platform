import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const GOLD = "#C9A227";
const WINE = "#d97706";
const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// ── VintageStory — editor racconto annata per le cantine ──────────────────────
// Stories sono salvate nei user_metadata Supabase (JSON server-side, senza nuove tabelle).
// Struttura: { vintage_stories: { "2021": { story: "…", harvest: "…", notes: "…" }, ... } }

export default function VintageStory() {
  const navigate = useNavigate();
  const [producerName, setProducerName] = useState("");
  const [vintages, setVintages] = useState([]); // list from wines
  const [stories, setStories] = useState({}); // { "2021": { story, harvest, notes } }
  const [selected, setSelected] = useState(null); // current vintage being edited
  const [draft, setDraft] = useState({ story: "", harvest: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [loadingWines, setLoadingWines] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Load producer + existing stories
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const name = user.user_metadata?.organization_name || user.user_metadata?.winery_name || localStorage.getItem("vino_org_name") || "";
      setProducerName(name);
      setIsOwner(true);
      const savedStories = user.user_metadata?.vintage_stories || {};
      setStories(savedStories);
    });
  }, []);

  // Load vintages from producer wines
  useEffect(() => {
    if (!producerName) { setLoadingWines(false); return; }
    fetch(`${API}/api/wines?producer=${encodeURIComponent(producerName)}&limit=50&sort=vintage`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list = d.results || d.wines || [];
        const years = [...new Set(list.map(w => w.vintage).filter(Boolean))].sort((a, b) => b - a);
        setVintages(years);
        if (years.length && !selected) setSelected(String(years[0]));
        setLoadingWines(false);
      })
      .catch(() => setLoadingWines(false));
  }, [producerName]);

  // When vintage selection changes, load draft from stories
  useEffect(() => {
    if (!selected) return;
    setDraft(stories[selected] || { story: "", harvest: "", notes: "" });
  }, [selected, stories]);

  async function save() {
    if (!selected || !isOwner) return;
    setSaving(true);
    const updated = { ...stories, [selected]: { ...draft, updatedAt: new Date().toISOString() } };
    try {
      await supabase.auth.updateUser({ data: { vintage_stories: updated } });
      setStories(updated);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch {}
    setSaving(false);
  }

  const hasContent = draft.story || draft.harvest || draft.notes;

  if (!isOwner) {
    return (
      <div style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <div>Solo le cantine possono accedere a questa sezione.</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, rgba(201,162,39,0.12) 0%, #0b1220 100%)`, borderBottom: "1px solid rgba(201,162,39,0.2)", padding: "28px 24px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
            RACCONTO DELL'ANNATA · {producerName}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>📖 Racconto dell'Annata</h1>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
            Descrivi ogni annata ai tuoi investitori: clima, vendemmia, sfide e risultati.
            Queste informazioni arricchiscono il profilo della tua cantina sulla piattaforma.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Sidebar: lista annate ──────────────────────────────── */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>ANNATE</div>

            {loadingWines && <div style={{ color: "#475569", fontSize: 13 }}>Carico annate…</div>}

            {!loadingWines && vintages.length === 0 && (
              <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.6 }}>
                Nessuna annata trovata nel catalogo. Configura prima il profilo cantina con il nome esatto.
              </div>
            )}

            {vintages.map(year => {
              const hasStory = !!stories[year]?.story;
              const isSelected = selected === String(year);
              return (
                <button key={year} onClick={() => setSelected(String(year))}
                  style={{ width: "100%", background: isSelected ? `rgba(201,162,39,0.12)` : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? "rgba(201,162,39,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: 6, textAlign: "left", fontFamily: "inherit" }}>
                  <span style={{ fontWeight: 700, color: isSelected ? GOLD : "#94a3b8", fontSize: 15 }}>{year}</span>
                  {hasStory
                    ? <span style={{ fontSize: 9, fontWeight: 800, color: "#4ade80", background: "rgba(74,222,128,0.12)", borderRadius: 4, padding: "2px 6px" }}>✓ OK</span>
                    : <span style={{ fontSize: 9, color: "#475569" }}>vuoto</span>
                  }
                </button>
              );
            })}

            {/* Add manual vintage if not in wines */}
            <button onClick={() => {
              const y = prompt("Inserisci l'anno dell'annata (es. 2020)");
              if (y && /^\d{4}$/.test(y)) { setVintages(prev => [...new Set([...prev, y])].sort((a, b) => b - a)); setSelected(y); }
            }} style={{ width: "100%", background: "transparent", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 14px", color: "#475569", fontSize: 12, cursor: "pointer", marginTop: 4, fontFamily: "inherit" }}>
              + Aggiungi annata manualmente
            </button>
          </div>

          {/* ── Editor ────────────────────────────────────────────── */}
          <div>
            {!selected ? (
              <div style={{ textAlign: "center", color: "#475569", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
                <div>Seleziona un'annata per iniziare</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}>Annata {selected}</h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {saveOk && <span style={{ fontSize: 12, color: "#4ade80" }}>✓ Salvato</span>}
                    <button onClick={save} disabled={saving || !hasContent}
                      style={{ background: hasContent ? GOLD : "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, color: hasContent ? "#0b1220" : "#475569", cursor: hasContent ? "pointer" : "default", fontSize: 13 }}>
                      {saving ? "Salvo…" : "Salva"}
                    </button>
                  </div>
                </div>

                {/* Story fields */}
                {[
                  { key: "story",    label: "Racconto dell'annata",     placeholder: "Descrivi l'annata: clima, eventi climatici, momenti salienti, decisioni di cantina…", rows: 7 },
                  { key: "harvest",  label: "La Vendemmia",              placeholder: "Data e condizioni della vendemmia, rese, selezione delle uve…", rows: 4 },
                  { key: "notes",    label: "Note tecniche per gli investitori", placeholder: "Struttura del vino, potenziale di invecchiamento, confronto con annate storiche…", rows: 4 },
                ].map(({ key, label, placeholder, rows }) => (
                  <div key={key} style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                      {label}
                      {key === "story" && <span style={{ marginLeft: 8, color: "#475569", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— visibile agli investitori sulla tua scheda</span>}
                    </label>
                    <textarea
                      value={draft[key]}
                      onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      rows={rows}
                      style={{ width: "100%", background: "#1a2535", border: `1px solid ${draft[key] ? "rgba(201,162,39,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "12px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "Georgia, serif", resize: "vertical", lineHeight: 1.8, boxSizing: "border-box", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "rgba(201,162,39,0.5)"}
                      onBlur={e => e.target.style.borderColor = draft[key] ? "rgba(201,162,39,0.25)" : "rgba(255,255,255,0.08)"}
                    />
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 4, textAlign: "right" }}>
                      {(draft[key] || "").length} caratteri
                    </div>
                  </div>
                ))}

                {/* Preview */}
                {hasContent && (
                  <div style={{ background: `linear-gradient(135deg, rgba(201,162,39,0.07) 0%, #1a2535 100%)`, border: "1px solid rgba(201,162,39,0.2)", borderRadius: 14, padding: 20, marginTop: 4 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: 14 }}>ANTEPRIMA — come apparirà agli investitori</div>
                    {draft.story && (
                      <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.85, fontFamily: "Georgia, serif", marginBottom: 16 }}>{draft.story}</p>
                    )}
                    {draft.harvest && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>🌿 VENDEMMIA</div>
                        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, fontFamily: "Georgia, serif", margin: 0 }}>{draft.harvest}</p>
                      </div>
                    )}
                    {draft.notes && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>📊 NOTE PER GLI INVESTITORI</div>
                        <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, fontFamily: "Georgia, serif", margin: 0 }}>{draft.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Data integrity notice */}
                <div style={{ marginTop: 20, padding: "10px 14px", background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", borderRadius: 8, fontSize: 11, color: "#78716c", lineHeight: 1.6 }}>
                  🔒 <strong style={{ color: WINE }}>Solo racconto editoriale</strong> — Questa sezione consente solo testi descrittivi.
                  AI Score, prezzi e dati di performance rimangono quelli del mercato reale e non sono modificabili dalla cantina.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
