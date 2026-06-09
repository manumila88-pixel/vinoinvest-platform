import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const AVG_RETURN = 0.08;

function calcMonthlyNeeded(target, months) {
  if (months <= 0 || !target) return 0;
  const r = AVG_RETURN / 12;
  return Math.round(target / (((Math.pow(1 + r, months) - 1) / r)));
}

function ProgressBar({ current, target }) {
  const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0);
  const color = pct >= 100 ? "var(--vi-positive)" : pct >= 60 ? "var(--vi-accent)" : "#818cf8";
  return (
    <div>
      <div style={{ height: 8, background: "var(--vi-border)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "var(--vi-text-dim)", fontVariantNumeric: "tabular-nums" }}>
        <span>€{Math.round(current || 0).toLocaleString()}</span>
        <span>{pct.toFixed(0)}% of €{Math.round(target).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function InvestmentGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "My Wine Investment Goal", target_amount: "", target_date: "", monthly_budget: "", strategy: "balanced" });
  const [preview, setPreview] = useState(null);

  useEffect(() => { loadGoals(); }, []);

  useEffect(() => {
    const target = parseFloat(form.target_amount);
    const months = form.target_date ? Math.max(1, Math.ceil((new Date(form.target_date) - new Date()) / (1000 * 60 * 60 * 24 * 30))) : 0;
    if (target && months) {
      setPreview({ monthly: calcMonthlyNeeded(target, months), months });
    } else {
      setPreview(null);
    }
  }, [form.target_amount, form.target_date]);

  async function loadGoals() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(`${API}/api/goals`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await res.json();
      setGoals(data.goals || []);
    } catch (e) {}
    setLoading(false);
  }

  async function createGoal() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`${API}/api/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(form),
    });
    setShowAdd(false);
    loadGoals();
  }

  async function deleteGoal(id) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`${API}/api/goals/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${session.access_token}` } });
    loadGoals();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "var(--vi-text-dim)", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 32px", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: 32, marginBottom: 6 }}>Investment Goals</h1>
            <p style={{ color: "var(--vi-text-dim)", fontSize: 14 }}>Define and track your wine investment objectives</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>
            + New Goal
          </button>
        </div>

        {loading && <div style={{ color: "var(--vi-text-dim)", textAlign: "center", padding: 40 }}>Loading...</div>}

        {!loading && goals.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "var(--vi-surface)", border: "1px dashed var(--vi-border)", borderRadius: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--vi-accent)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vi-accent)", fontSize: 20 }}>◎</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No investment goals yet</p>
            <p style={{ fontSize: 13, color: "var(--vi-text-dim)", marginBottom: 24 }}>
              Set a target and our calculator will show you exactly how much to invest monthly
            </p>
            <button onClick={() => setShowAdd(true)} style={{ background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>
              Create Your First Goal
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {goals.map(g => {
            const months = Math.max(0, Math.ceil((new Date(g.target_date) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
            const isCompleted = (g.current_progress || 0) >= g.target_amount;
            const isAtRisk = months < 6 && (g.current_progress || 0) < g.target_amount * 0.5;

            return (
              <div key={g.id} style={{ background: "var(--vi-surface)", border: `1px solid ${isCompleted ? "rgba(74,222,128,0.3)" : isAtRisk ? "rgba(248,113,113,0.3)" : "var(--vi-border)"}`, borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 18 }}>{g.title}</h3>
                      {isCompleted && <span style={{ fontSize: 11, color: "var(--vi-positive)", background: "rgba(74,222,128,0.1)", padding: "2px 8px", borderRadius: 4 }}>✓ Completed</span>}
                      {isAtRisk && !isCompleted && <span style={{ fontSize: 11, color: "var(--vi-negative)", background: "rgba(248,113,113,0.1)", padding: "2px 8px", borderRadius: 4 }}>! At risk</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--vi-text-dim)", marginTop: 4 }}>
                      Target: {new Date(g.target_date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                      {months > 0 ? ` · ${months} months remaining` : " · Past due"}
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(g.id)} aria-label="Delete goal" style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>×</button>
                </div>

                <ProgressBar current={g.current_progress || 0} target={g.target_amount} />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginTop: 18 }}>
                  {[
                    { label: "Target", value: `€${Math.round(g.target_amount).toLocaleString()}` },
                    { label: "Monthly Needed", value: `€${Math.round(g.monthly_needed || 0).toLocaleString()}`, color: "var(--vi-accent)" },
                    { label: "Your Budget", value: `€${Math.round(g.monthly_budget || g.monthly_needed || 0).toLocaleString()}` },
                    { label: "Strategy", value: g.strategy || "balanced" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "var(--vi-border)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "var(--vi-text-dim)" }}>{s.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: s.color || "var(--vi-text)", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {!isCompleted && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: 8, fontSize: 13, color: "var(--vi-text-dim)" }}>
                    Invest €{Math.round((g.monthly_needed || 0)).toLocaleString()}/month to reach your goal by {new Date(g.target_date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}.
                    Based on 8% average annual wine market return. <span style={{ color: "var(--vi-text-dim)" }}>*Estimate only — not guaranteed.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowAdd(false)}>
            <div style={{ background: "var(--vi-bg-elev)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 20, marginBottom: 24 }}>New Investment Goal</h3>

              {[
                { label: "Goal Name", key: "title", type: "text", placeholder: "e.g. Retire with wine" },
                { label: "Target Amount (€)", key: "target_amount", type: "number", placeholder: "e.g. 50000" },
                { label: "Target Date", key: "target_date", type: "date" },
                { label: "Monthly Budget (€) — optional", key: "monthly_budget", type: "number", placeholder: "Leave empty to calculate" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
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

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "var(--vi-text-dim)", display: "block", marginBottom: 8 }}>Strategy</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["conservative", "balanced", "aggressive"].map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, strategy: s }))} style={{
                      flex: 1, padding: "8px", background: form.strategy === s ? "rgba(201,162,39,0.2)" : "rgba(30,41,59,0.4)",
                      color: form.strategy === s ? "var(--vi-accent)" : "var(--vi-text-dim)",
                      border: `1px solid ${form.strategy === s ? "rgba(201,162,39,0.4)" : "rgba(30,41,59,0.5)"}`,
                      borderRadius: 8, fontSize: 12, cursor: "pointer", textTransform: "capitalize"
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {preview && (
                <div style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "var(--vi-accent)", fontWeight: 700, marginBottom: 4 }}>
                    Estimated monthly investment: €{preview.monthly.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--vi-text-dim)" }}>
                    Over {preview.months} months at 8% avg annual return.
                    This is an estimate — not guaranteed.
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 10, background: "rgba(30,41,59,0.5)", color: "var(--vi-text-dim)", border: "1px solid var(--vi-border)", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
                <button onClick={createGoal} disabled={!form.target_amount || !form.target_date} style={{ flex: 2, padding: 10, background: "var(--vi-accent)", color: "var(--vi-bg)", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Create Goal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
