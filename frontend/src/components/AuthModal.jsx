import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const BG = "#0b1220";
const GOLD = "#C9A227";

// Reusable auth modal — shows over any page
// Props: onSuccess(user, account_type), onClose, defaultTab ("login"|"signup"), reason (string shown above form)
export default function AuthModal({ onSuccess, onClose, defaultTab = "login", reason = null }) {
  const [tab, setTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("form"); // form | forgot | sent

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) { setError(err.message); setLoading(false); return; }
        if (data.user) {
          try { await supabase.from("users").insert({ id: data.user.id, email, account_type: "b2c" }); } catch {}
          if (!data.session) { setMode("sent"); setLoading(false); return; }
          onSuccess?.({ user: data.user, account_type: "b2c" });
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); setLoading(false); return; }
        const { data: ud } = await supabase.from("users").select("account_type").eq("id", data.user.id).single();
        onSuccess?.({ user: data.user, account_type: ud?.account_type || "b2c" });
      }
    } catch { setError("Errore imprevisto. Riprova."); }
    setLoading(false);
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (err) { setError(err.message); setLoading(false); }
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!email) { setError("Inserisci prima la tua email."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}?reset=1`,
    });
    if (err) setError(err.message);
    else setMode("sent");
    setLoading(false);
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#111827", borderRadius: 20, width: "100%", maxWidth: 400, border: "1px solid rgba(201,162,39,0.2)", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: GOLD, fontFamily: "Inter, sans-serif" }}>VinoInvest</div>
          {onClose && <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>}
        </div>

        {/* Reason banner */}
        {reason && (
          <div style={{ margin: "12px 24px 0", background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
            {reason}
          </div>
        )}

        <div style={{ padding: "20px 24px 28px", fontFamily: "Inter, sans-serif" }}>
          {/* Sent confirmation */}
          {mode === "sent" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{tab === "signup" ? "📬" : "📧"}</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#e2e8f0" }}>
                {tab === "signup" ? "Controlla la tua email" : "Email inviata!"}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                {tab === "signup"
                  ? "Ti abbiamo inviato un link di conferma. Clicca il link per attivare il tuo account."
                  : "Ti abbiamo inviato un link per reimpostare la password. Controlla la tua casella di posta."}
              </div>
              <button onClick={onClose} style={{ marginTop: 20, background: GOLD, border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>
                Chiudi
              </button>
            </div>
          )}

          {mode === "form" && (
            <>
              {/* Tab switcher */}
              <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 20 }}>
                {[["login","Accedi"],["signup","Registrati"]].map(([t, label]) => (
                  <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex: 1, background: tab === t ? GOLD : "transparent", color: tab === t ? "#0b1220" : "#64748b", border: "none", borderRadius: 8, padding: "8px", fontWeight: 700, cursor: "pointer", fontSize: 14, transition: "all 0.15s" }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Google button */}
              <button onClick={handleGoogle} disabled={loading} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", color: "#e2e8f0", fontSize: 14, fontWeight: 600, marginBottom: 16, fontFamily: "Inter, sans-serif" }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continua con Google
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ color: "#475569", fontSize: 12 }}>oppure</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email" required
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                  <div style={{ position: "relative" }}>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Password" required minLength={6}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                    />
                  </div>

                  {error && (
                    <div style={{ background: error.includes("sent") || error.includes("inviata") ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${error.includes("sent") || error.includes("inviata") ? "#4ade80" : "#f87171"}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: error.includes("sent") || error.includes("inviata") ? "#4ade80" : "#f87171" }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={{ background: GOLD, border: "none", borderRadius: 12, padding: "12px", fontWeight: 800, color: "#0b1220", cursor: loading ? "default" : "pointer", fontSize: 15, opacity: loading ? 0.7 : 1, fontFamily: "Inter, sans-serif" }}>
                    {loading ? "..." : tab === "login" ? "Accedi" : "Crea account"}
                  </button>

                  {tab === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "Inter, sans-serif" }}>
                      Password dimenticata?
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#e2e8f0" }}>Reset password</div>
              <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>Inserisci la tua email e ti inviamo un link per reimpostare la password.</div>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email" required
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
              />
              {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 10 }}>{error}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setMode("form")} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "10px", color: "#94a3b8", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Indietro</button>
                <button type="submit" disabled={loading} style={{ flex: 2, background: GOLD, border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                  {loading ? "..." : "Invia link →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
