import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { reportError } from "../lib/errorReporting";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const SHELF_COLS = 8;
const SHELF_ROWS = 6;
const TOTAL_SHELVES = 3;

const SLOT_COLORS = {
  optimal: "var(--vi-positive)",
  young: "#60a5fa",
  overdue: "var(--vi-negative)",
  empty: "var(--vi-border)",
};

function getSlotStatus(bottle) {
  if (!bottle) return "empty";
  const now = new Date();
  if (!bottle.drink_from && !bottle.drink_until) return "optimal";
  const from = bottle.drink_from ? new Date(bottle.drink_from) : null;
  const until = bottle.drink_until ? new Date(bottle.drink_until) : null;
  if (until && now > until) return "overdue";
  if (from && now < from) return "young";
  return "optimal";
}

export default function WineCellar() {
  const [bottles, setBottles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [activeShelf, setActiveShelf] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [form, setForm] = useState({ wine_name: "", producer: "", vintage: "", quantity: 1, purchase_price: "", drink_from: "", drink_until: "", notes: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWine, setSelectedWine] = useState(null);

  useEffect(() => { loadCellar(); }, []);

  async function loadCellar() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { setIsGuest(true); setLoading(false); return; }

      const [bRes, sRes] = await Promise.all([
        fetch(`${API}/api/cellar`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/cellar/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const bData = await bRes.json();
      const sData = await sRes.json();
      setBottles(bData.bottles || []);
      setStats(sData);
    } catch (e) {
      reportError(e, { component: "WineCellar" });
      setFetchError("Impossibile caricare la cantina. Controlla la connessione e riprova.");
    }
    setLoading(false);
  }

  async function searchWines(q) {
    if (q.length < 2) { setSearchResults([]); return; }
    const res = await fetch(`${API}/api/wines?search=${encodeURIComponent(q)}&limit=5`);
    const data = await res.json();
    setSearchResults(data.results || data.wines || []);
  }

  async function addBottle(slot) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;

    const body = {
      wine_id: selectedWine?.id || null,
      quantity: form.quantity || 1,
      purchase_price: form.purchase_price || null,
      shelf_number: activeShelf,
      position: slot,
      notes: form.notes || null,
      drink_from: form.drink_from || null,
      drink_until: form.drink_until || null,
    };

    await fetch(`${API}/api/cellar`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    setShowAddModal(false);
    setSelectedWine(null);
    setForm({ wine_name: "", producer: "", vintage: "", quantity: 1, purchase_price: "", drink_from: "", drink_until: "", notes: "" });
    loadCellar();
  }

  async function removeBottle(id) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    await fetch(`${API}/api/cellar/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSelectedBottle(null);
    loadCellar();
  }

  function getBottleAtSlot(shelf, slot) {
    return bottles.find(b => b.shelf_number === shelf && b.position === slot) || null;
  }

  const shelfBottles = bottles.filter(b => b.shelf_number === activeShelf);

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "var(--vi-text-dim)", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 32px", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: 32, marginBottom: 6 }}>Wine Cellar</h1>
            <p style={{ color: "var(--vi-text-dim)", fontSize: 14 }}>Manage your physical wine collection</p>
          </div>
          <button
            onClick={() => { setShowAddModal(true); setSelectedSlot(null); }}
            style={{ background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
          >
            + Add Bottle
          </button>
        </div>

        {/* Guest state */}
        {!loading && isGuest && (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--vi-text-dim)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍾</div>
            <p style={{ fontSize: 16, marginBottom: 8, color: "var(--vi-text)" }}>Accedi per gestire la tua cantina</p>
            <p style={{ fontSize: 13, marginBottom: 20 }}>Tieni traccia delle tue bottiglie, finestre di consumo e valore del cellar.</p>
            <a href="/" style={{ display: "inline-block", padding: "10px 24px", background: "var(--vi-accent)", color: "#020617", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Accedi a VinoInvest →</a>
          </div>
        )}

        {/* Error state */}
        {fetchError && (
          <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--vi-negative)", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span>{fetchError}</span>
            <button onClick={() => { setFetchError(null); loadCellar(); }} style={{ background: "var(--vi-bg-elev)", border: "none", borderRadius: 6, padding: "5px 12px", color: "var(--vi-text-dim)", cursor: "pointer", fontSize: 12 }}>Riprova</button>
          </div>
        )}

        {/* Stats */}
        {!loading && !fetchError && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total Bottles", value: stats.total_quantity || 0, color: "var(--vi-accent)" },
              { label: "Unique Wines", value: stats.unique_wines || 0, color: "#818cf8" },
              { label: "Value", value: stats.current_value ? `€${Math.round(stats.current_value).toLocaleString()}` : "–", color: "var(--vi-positive)" },
              { label: "Optimal Window", value: stats.in_window || 0, icon: "🟢" },
              { label: "Too Young", value: stats.too_young || 0, icon: "🔵" },
              { label: "Past Peak", value: stats.past_peak || 0, icon: "🔴" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--vi-surface)", border: "1px solid var(--vi-border)", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color || "var(--vi-text)", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--vi-text-dim)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Shelf selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {Array.from({ length: TOTAL_SHELVES }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setActiveShelf(n)} style={{
              background: activeShelf === n ? "var(--vi-accent)" : "rgba(30,41,59,0.5)",
              color: activeShelf === n ? "var(--vi-bg)" : "var(--vi-text-dim)",
              border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, cursor: "pointer", fontSize: 13
            }}>Shelf {n}</button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { color: SLOT_COLORS.optimal, label: "Optimal window" },
            { color: SLOT_COLORS.young, label: "Too young" },
            { color: SLOT_COLORS.overdue, label: "Past peak" },
            { color: SLOT_COLORS.empty, label: "Empty" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, display: "inline-block", flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Cellar Grid */}
        <div style={{
          background: "var(--vi-bg)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 16,
          padding: 20, marginBottom: 32,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${SHELF_COLS}, 1fr)`, gap: 8 }}>
            {Array.from({ length: SHELF_ROWS * SHELF_COLS }, (_, i) => {
              const slotNum = i + 1;
              const bottle = getBottleAtSlot(activeShelf, slotNum);
              const status = getSlotStatus(bottle);
              return (
                <div
                  key={slotNum}
                  onClick={() => {
                    if (bottle) { setSelectedBottle(bottle); }
                    else { setSelectedSlot(slotNum); setShowAddModal(true); }
                  }}
                  title={bottle ? `${bottle.name || "Wine"} (${bottle.vintage || "?"})` : `Empty slot ${slotNum}`}
                  style={{
                    aspectRatio: "1/1.6",
                    borderRadius: 6,
                    background: bottle ? SLOT_COLORS[status] + "30" : SLOT_COLORS.empty,
                    border: `2px solid ${bottle ? SLOT_COLORS[status] : "rgba(30,41,59,0.3)"}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: bottle ? "20px" : "12px",
                    color: bottle ? SLOT_COLORS[status] : "#334155",
                    transition: "transform 0.15s, opacity 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {bottle ? "🍷" : "+"}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottle list */}
        {shelfBottles.length > 0 && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16 }}>Shelf {activeShelf} — {shelfBottles.length} bottles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {shelfBottles.map(b => (
                <div key={b.id} style={{
                  background: "var(--vi-surface)", border: "1px solid var(--vi-border)", borderRadius: 12, padding: "14px 18px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(201,162,39,0.15)", display: "inline-block", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{b.name || "Unknown Wine"}</div>
                      <div style={{ fontSize: 12, color: "var(--vi-text-dim)" }}>{b.producer} · {b.vintage} · Pos. {b.position}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    {b.drink_from && b.drink_until && (
                      <span style={{ fontSize: 11, color: "var(--vi-text-dim)" }}>
                        {new Date(b.drink_from).getFullYear()}–{new Date(b.drink_until).getFullYear()}
                      </span>
                    )}
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                      background: SLOT_COLORS[getSlotStatus(b)] + "20", color: SLOT_COLORS[getSlotStatus(b)]
                    }}>
                      {getSlotStatus(b) === "optimal" ? "In window" : getSlotStatus(b) === "young" ? "Too young" : "Past peak"}
                    </span>
                    <button onClick={() => removeBottle(b.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowAddModal(false)}>
            <div style={{ background: "var(--vi-bg-elev)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 20, marginBottom: 20 }}>Add to Cellar</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 6 }}>Search wine database</label>
                <input
                  placeholder="Search by name..."
                  onChange={e => searchWines(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, color: "var(--vi-text)", fontSize: 14 }}
                />
                {searchResults.length > 0 && (
                  <div style={{ marginTop: 4, background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8 }}>
                    {searchResults.map(w => (
                      <div key={w.id} onClick={() => { setSelectedWine(w); setSearchResults([]); }} style={{ padding: "8px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid var(--vi-border)" }}>
                        <span style={{ fontWeight: 600 }}>{w.name}</span> <span style={{ color: "var(--vi-text-dim)" }}>{w.vintage}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedWine && <div style={{ fontSize: 12, color: "var(--vi-positive)", marginTop: 6 }}>✓ Selected: {selectedWine.name}</div>}
              </div>

              {[
                { label: "Quantity", key: "quantity", type: "number", min: 1 },
                { label: "Purchase Price (€)", key: "purchase_price", type: "number" },
                { label: "Drink From", key: "drink_from", type: "date" },
                { label: "Drink Until", key: "drink_until", type: "date" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    min={f.min}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, color: "var(--vi-text)", fontSize: 14 }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 6 }}>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--vi-bg-elev)", border: "1px solid var(--vi-border)", borderRadius: 8, color: "var(--vi-text)", fontSize: 14, resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", background: "rgba(30,41,59,0.5)", color: "var(--vi-text-dim)", border: "1px solid var(--vi-border)", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
                <button
                  onClick={() => addBottle(selectedSlot || Math.max(0, ...(shelfBottles.map(b => b.position) || [0])) + 1)}
                  style={{ flex: 2, padding: "10px", background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}
                >
                  Add to Cellar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottle detail */}
        {selectedBottle && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setSelectedBottle(null)}>
            <div style={{ background: "var(--vi-bg-elev)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 360 }} onClick={e => e.stopPropagation()}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(201,162,39,0.15)", margin: "0 auto 16px" }} />
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 20, marginBottom: 4, textAlign: "center" }}>{selectedBottle.name}</h3>
              <p style={{ color: "var(--vi-text-dim)", fontSize: 13, textAlign: "center", marginBottom: 20 }}>{selectedBottle.producer} · {selectedBottle.vintage}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Shelf", value: selectedBottle.shelf_number },
                  { label: "Position", value: selectedBottle.position },
                  { label: "Quantity", value: selectedBottle.quantity },
                  { label: "Paid", value: selectedBottle.purchase_price ? `€${selectedBottle.purchase_price}` : "–" },
                  { label: "Drink from", value: selectedBottle.drink_from ? new Date(selectedBottle.drink_from).getFullYear() : "–" },
                  { label: "Drink by", value: selectedBottle.drink_until ? new Date(selectedBottle.drink_until).getFullYear() : "–" },
                ].map(f => (
                  <div key={f.label} style={{ background: "var(--vi-border)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "var(--vi-text-dim)", marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {selectedBottle.notes && (
                <div style={{ background: "rgba(30,41,59,0.2)", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: "var(--vi-text-dim)" }}>
                  {selectedBottle.notes}
                </div>
              )}

              <button onClick={() => removeBottle(selectedBottle.id)} style={{ width: "100%", padding: 12, background: "rgba(239,68,68,0.1)", color: "var(--vi-negative)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
                Remove from Cellar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
