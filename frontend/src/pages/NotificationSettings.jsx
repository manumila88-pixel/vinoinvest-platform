import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const REGIONS = ["Bordeaux", "Burgundy", "Champagne", "Tuscany", "Piedmont", "Rhône", "Barossa", "Napa Valley", "Rioja", "Douro", "Alsace", "Loire Valley"];
const TYPES = ["Red", "White", "Rosé", "Champagne/Sparkling", "Sweet/Fortified"];
const FREQUENCIES = [
  { key: "immediata", label: "Immediately", desc: "Get alerts as they happen" },
  { key: "giornaliera", label: "Daily Digest", desc: "One email per day at 9am" },
  { key: "settimanale", label: "Weekly Digest", desc: "Every Monday at 8am" },
  { key: "mensile", label: "Monthly", desc: "First day of each month" },
];

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    email_subscribed: true,
    notification_frequency: "settimanale",
    preferred_regions: [],
    preferred_types: [],
    price_range_min: 50,
    price_range_max: 500,
    risk_tolerance: "medio",
    investment_horizon: "3anni",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => { loadPrefs(); }, []);

  async function loadPrefs() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(`${API}/api/email-preferences`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await res.json();
      setPrefs(p => ({ ...p, ...data }));
    } catch (e) {}
    setLoading(false);
  }

  async function savePrefs() {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await fetch(`${API}/api/email-preferences`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(prefs),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {}
    setSaving(false);
  }

  async function sendTest() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await fetch(`${API}/api/email-preferences/test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    } catch (e) {}
  }

  function toggleArray(arr, item) {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  if (loading) return <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ margin: "24px 0 36px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, marginBottom: 6 }}>⚙️ Notification Preferences</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Customize what you receive and how often</p>
        </div>

        {/* Email toggle */}
        <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Email Notifications</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Receive personalized wine intelligence in your inbox</div>
            </div>
            <button
              onClick={() => setPrefs(p => ({ ...p, email_subscribed: !p.email_subscribed }))}
              style={{
                width: 52, height: 28, borderRadius: 14,
                background: prefs.email_subscribed ? "#C9A227" : "rgba(30,41,59,0.8)",
                border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s"
              }}
            >
              <span style={{
                position: "absolute", top: 3, left: prefs.email_subscribed ? 26 : 3,
                width: 22, height: 22, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s",
              }} />
            </button>
          </div>
        </div>

        {prefs.email_subscribed && (
          <>
            {/* Frequency */}
            <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Email Frequency</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FREQUENCIES.map(f => (
                  <label key={f.key} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "10px 12px", background: prefs.notification_frequency === f.key ? "rgba(201,162,39,0.1)" : "transparent", border: `1px solid ${prefs.notification_frequency === f.key ? "rgba(201,162,39,0.3)" : "rgba(30,41,59,0.4)"}`, borderRadius: 8 }}>
                    <input type="radio" name="freq" value={f.key} checked={prefs.notification_frequency === f.key} onChange={() => setPrefs(p => ({ ...p, notification_frequency: f.key }))} style={{ accentColor: "#C9A227" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{f.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Preferred Regions</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {REGIONS.map(r => {
                  const active = (prefs.preferred_regions || []).includes(r);
                  return (
                    <button key={r} onClick={() => setPrefs(p => ({ ...p, preferred_regions: toggleArray(p.preferred_regions || [], r) }))} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                      background: active ? "rgba(201,162,39,0.15)" : "rgba(30,41,59,0.4)",
                      color: active ? "#C9A227" : "#94a3b8",
                      border: `1px solid ${active ? "rgba(201,162,39,0.4)" : "rgba(30,41,59,0.5)"}`,
                    }}>{r}</button>
                  );
                })}
              </div>
            </div>

            {/* Types */}
            <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Wine Types</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TYPES.map(t => {
                  const active = (prefs.preferred_types || []).includes(t);
                  return (
                    <button key={t} onClick={() => setPrefs(p => ({ ...p, preferred_types: toggleArray(p.preferred_types || [], t) }))} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                      background: active ? "rgba(129,140,248,0.15)" : "rgba(30,41,59,0.4)",
                      color: active ? "#818cf8" : "#94a3b8",
                      border: `1px solid ${active ? "rgba(129,140,248,0.4)" : "rgba(30,41,59,0.5)"}`,
                    }}>{t}</button>
                  );
                })}
              </div>
            </div>

            {/* Price range */}
            <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Price Range (per bottle)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Min €", key: "price_range_min" },
                  { label: "Max €", key: "price_range_max" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 6 }}>{f.label}</label>
                    <input
                      type="number"
                      value={prefs[f.key] || ""}
                      onChange={e => setPrefs(p => ({ ...p, [f.key]: parseInt(e.target.value) || 0 }))}
                      style={{ width: "100%", padding: "10px", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.6)", borderRadius: 8, color: "#e2e8f0", fontSize: 14 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={savePrefs}
            disabled={saving}
            style={{ flex: 1, minWidth: 140, padding: "12px", background: saved ? "rgba(74,222,128,0.2)" : "#C9A227", color: saved ? "#4ade80" : "#020617", border: saved ? "1px solid rgba(74,222,128,0.4)" : "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 14 }}
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Preferences"}
          </button>
          {prefs.email_subscribed && (
            <button
              onClick={sendTest}
              style={{ padding: "12px 20px", background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              {testSent ? "✓ Sent!" : "Send Test Email"}
            </button>
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: 11, color: "#334155" }}>
          Your preferences are used to personalize news, wine recommendations and email content.
          <br />GDPR: <a href="/" style={{ color: "#475569" }}>Download your data</a> · <a href="/" style={{ color: "#475569" }}>Delete account</a>
        </div>
      </div>
    </div>
  );
}
