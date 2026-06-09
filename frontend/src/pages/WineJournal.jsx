import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const OCCASIONS = ["Dinner", "Celebration", "Tasting", "Gift", "Business", "Casual", "Wine club", "Other"];

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onChange && onChange(n)}
          style={{ fontSize: 24, cursor: onChange ? "pointer" : "default", color: n <= value ? "var(--vi-accent)" : "var(--vi-border)" }}
        >★</span>
      ))}
    </div>
  );
}

export default function WineJournal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ wine_name: "", vintage: "", rating: 0, notes: "", occasion: "", companions: "", tasted_at: new Date().toISOString().slice(0, 10) });
  const [filter, setFilter] = useState("all");

  useEffect(() => { loadJournal(); }, []);

  async function loadJournal() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { setLoading(false); return; }
      const res = await fetch(`${API}/api/journal`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function saveEntry() {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;

    await fetch(`${API}/api/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    setShowAdd(false);
    setForm({ wine_name: "", vintage: "", rating: 0, notes: "", occasion: "", companions: "", tasted_at: new Date().toISOString().slice(0, 10) });
    loadJournal();
  }

  async function deleteEntry(id) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    await fetch(`${API}/api/journal/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadJournal();
  }

  const filtered = filter === "all" ? entries : entries.filter(e => e.occasion === filter);

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "var(--vi-text-dim)", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 32px", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: 32, marginBottom: 6 }}>Wine Journal</h1>
            <p style={{ color: "var(--vi-text-dim)", fontSize: 14 }}>{entries.length} tasting {entries.length === 1 ? "note" : "notes"}</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{ background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
          >
            + Add Entry
          </button>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["all", ...OCCASIONS].map(o => (
            <button key={o} onClick={() => setFilter(o)} style={{
              background: filter === o ? "rgba(201,162,39,0.15)" : "rgba(30,41,59,0.4)",
              color: filter === o ? "var(--vi-accent)" : "var(--vi-text-dim)",
              border: `1px solid ${filter === o ? "rgba(201,162,39,0.4)" : "var(--vi-border)"}`,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer",
            }}>
              {o === "all" ? "All" : o}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: "var(--vi-text-dim)", textAlign: "center", padding: 40 }}>Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--vi-text-dim)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(201,162,39,0.15)", margin: "0 auto 16px" }} />
            <p style={{ fontSize: 16, marginBottom: 8 }}>No tasting notes yet</p>
            <p style={{ fontSize: 13 }}>Start recording your wine experiences</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(entry => (
            <div key={entry.id} style={{
              background: "var(--vi-surface)", border: "1px solid var(--vi-border)", borderRadius: 16, padding: "20px 24px"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 18, marginBottom: 4 }}>
                    {entry.wine_name || entry.name || "Unknown Wine"}
                    {entry.vintage && <span style={{ fontSize: 14, color: "var(--vi-text-dim)", fontWeight: 400, marginLeft: 8 }}>{entry.vintage}</span>}
                  </h3>
                  <StarRating value={entry.rating || 0} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--vi-text-dim)" }}>
                    {new Date(entry.tasted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {entry.occasion && (
                    <span style={{ background: "rgba(201,162,39,0.1)", color: "var(--vi-accent)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>
                      {entry.occasion}
                    </span>
                  )}
                  <button onClick={() => deleteEntry(entry.id)} aria-label="Delete journal entry" style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
              </div>

              {entry.notes && (
                <p style={{ color: "var(--vi-text-dim)", fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>{entry.notes}</p>
              )}

              {entry.companions && (
                <p style={{ fontSize: 12, color: "var(--vi-text-dim)", marginTop: 8 }}>{entry.companions}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add Entry Modal */}
        {showAdd && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowAdd(false)}>
            <div style={{ background: "var(--vi-bg-elev)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 20, marginBottom: 20 }}>New Tasting Note</h3>

              {[
                { label: "Wine Name", key: "wine_name", type: "text", placeholder: "e.g. Barolo Cascina Francia" },
                { label: "Vintage", key: "vintage", type: "text", placeholder: "e.g. 2016" },
                { label: "Tasting Date", key: "tasted_at", type: "date" },
                { label: "With Whom", key: "companions", type: "text", placeholder: "e.g. Family dinner" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, color: "var(--vi-text)", fontSize: 14 }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 8 }}>Rating</label>
                <StarRating value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 6 }}>Occasion</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {OCCASIONS.map(o => (
                    <button key={o} onClick={() => setForm(p => ({ ...p, occasion: p.occasion === o ? "" : o }))} style={{
                      background: form.occasion === o ? "rgba(201,162,39,0.2)" : "rgba(30,41,59,0.4)",
                      color: form.occasion === o ? "var(--vi-accent)" : "var(--vi-text-dim)",
                      border: `1px solid ${form.occasion === o ? "rgba(201,162,39,0.4)" : "var(--vi-border)"}`,
                      borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                    }}>{o}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 6 }}>Tasting Notes</label>
                <textarea
                  placeholder="Describe the aromas, flavours, texture..."
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, color: "var(--vi-text)", fontSize: 14, resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", background: "rgba(30,41,59,0.5)", color: "var(--vi-text-dim)", border: "1px solid var(--vi-border)", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
                <button onClick={saveEntry} style={{ flex: 2, padding: "10px", background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Save Note</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
