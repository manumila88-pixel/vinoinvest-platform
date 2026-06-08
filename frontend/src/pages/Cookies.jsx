import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const COOKIE_CATEGORIES = [
  {
    id: "necessary",
    name: "Cookie Necessari",
    required: true,
    description: "Essenziali per il funzionamento del sito. Non possono essere disattivati.",
    cookies: [
      { name: "vino_cookie_consent", purpose: "Memorizza il consenso ai cookie", duration: "1 anno" },
      { name: "vino_auth_session", purpose: "Sessione di autenticazione utente", duration: "Sessione" },
      { name: "sb-*", purpose: "Token di sessione Supabase", duration: "7 giorni" },
    ],
  },
  {
    id: "functional",
    name: "Cookie Funzionali",
    required: false,
    description: "Migliorano l'esperienza salvando preferenze come lingua e valuta.",
    cookies: [
      { name: "vino_currency", purpose: "Valuta preferita (EUR/USD/GBP)", duration: "1 anno" },
      { name: "i18nextLng", purpose: "Lingua dell'interfaccia", duration: "1 anno" },
      { name: "vino_theme", purpose: "Tema chiaro/scuro", duration: "1 anno" },
      { name: "vino_module_progress_v1", purpose: "Progressi corsi Academy", duration: "Locale" },
    ],
  },
  {
    id: "analytics",
    name: "Cookie Analitici",
    required: false,
    description: "Ci aiutano a capire come gli utenti usano la piattaforma. Non raccogliamo dati personali.",
    cookies: [
      { name: "_umami_*", purpose: "Statistiche anonime (Umami - privacy-first)", duration: "30 giorni" },
    ],
  },
  {
    id: "marketing",
    name: "Cookie di Marketing",
    required: false,
    description: "Usati per mostrare contenuti rilevanti. Attualmente non utilizziamo cookie di terze parti per marketing.",
    cookies: [],
  },
];

function CookieRow({ cookie }) {
  return (
    <tr>
      <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 11, color: "#C9A227", borderBottom: "1px solid rgba(30,41,59,0.3)" }}>{cookie.name}</td>
      <td style={{ padding: "8px 12px", fontSize: 12, color: "#94a3b8", borderBottom: "1px solid rgba(30,41,59,0.3)" }}>{cookie.purpose}</td>
      <td style={{ padding: "8px 12px", fontSize: 12, color: "#64748b", borderBottom: "1px solid rgba(30,41,59,0.3)", whiteSpace: "nowrap" }}>{cookie.duration}</td>
    </tr>
  );
}

export default function Cookies() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vino_cookie_prefs") || "{}");
      return { functional: true, analytics: true, marketing: false, ...saved };
    } catch { return { functional: true, analytics: true, marketing: false }; }
  });
  const [saved, setSaved] = useState(false);

  const toggle = (id) => setPrefs(p => ({ ...p, [id]: !p[id] }));

  const handleSave = () => {
    localStorage.setItem("vino_cookie_prefs", JSON.stringify(prefs));
    localStorage.setItem("vino_cookie_consent", "custom");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    const all = { functional: true, analytics: true, marketing: true };
    setPrefs(all);
    localStorage.setItem("vino_cookie_prefs", JSON.stringify(all));
    localStorage.setItem("vino_cookie_consent", "all");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", padding: "24px 16px", fontFamily: "system-ui, sans-serif", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", marginBottom: 24, fontSize: 14 }}>
          ← Indietro
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#C9A227", marginBottom: 8 }}>Cookie Policy</h1>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 32 }}>
          Ultimo aggiornamento: 1 giugno 2025 · Gestisci le tue preferenze qui sotto.
        </p>

        <div style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(30,41,59,0.4)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Cosa sono i cookie?</h2>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
            I cookie sono piccoli file di testo salvati sul tuo dispositivo quando visiti un sito web.
            Usiamo cookie per mantenere la tua sessione attiva, ricordare le tue preferenze e migliorare la piattaforma.
            Puoi gestire i tuoi consensi in qualsiasi momento da questa pagina.
          </p>
        </div>

        {COOKIE_CATEGORIES.map(cat => (
          <div key={cat.id} style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(30,41,59,0.4)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{cat.name}</h3>
                <p style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{cat.description}</p>
              </div>
              {cat.required ? (
                <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 4, padding: "3px 8px" }}>
                  Sempre attivo
                </span>
              ) : (
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div
                    onClick={() => toggle(cat.id)}
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: prefs[cat.id] ? "#C9A227" : "rgba(71,85,105,0.5)",
                      position: "relative", transition: "background 0.2s", cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", background: "white",
                      position: "absolute", top: 3,
                      left: prefs[cat.id] ? 23 : 3,
                      transition: "left 0.2s",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: prefs[cat.id] ? "#C9A227" : "#64748b" }}>
                    {prefs[cat.id] ? "Attivo" : "Disattivato"}
                  </span>
                </label>
              )}
            </div>

            {cat.cookies.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
                  <thead>
                    <tr>
                      {["Nome", "Scopo", "Durata"].map(h => (
                        <th key={h} style={{ padding: "6px 12px", fontSize: 11, color: "#475569", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.cookies.map(c => <CookieRow key={c.name} cookie={c} />)}
                  </tbody>
                </table>
              </div>
            )}
            {cat.cookies.length === 0 && (
              <p style={{ color: "#475569", fontSize: 12, fontStyle: "italic", margin: 0 }}>
                Nessun cookie di questo tipo è attualmente in uso.
              </p>
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <button
            onClick={acceptAll}
            style={{
              flex: 1, minWidth: 160, padding: "12px 20px", borderRadius: 8,
              background: "linear-gradient(135deg, #C9A227, #a07d1a)",
              border: "none", color: "#0b1220", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Accetta tutti
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1, minWidth: 160, padding: "12px 20px", borderRadius: 8,
              background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.4)",
              color: "#e2e8f0", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            Salva preferenze
          </button>
        </div>

        {saved && (
          <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, color: "#4ade80", fontSize: 13 }}>
            Preferenze salvate correttamente.
          </div>
        )}

        <div style={{ marginTop: 32, padding: 20, background: "rgba(11,18,32,0.4)", borderRadius: 8, fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
          <strong style={{ color: "#94a3b8" }}>Note tecniche:</strong> VinoInvest non vende dati a terze parti.
          Le statistiche analitiche (Umami) sono privacy-first: nessuna PII, nessun fingerprinting, nessun cookie cross-site.
          I dati sono ospitati in EU. Per esercitare i tuoi diritti GDPR visita{" "}
          <a href="/settings/privacy" style={{ color: "#C9A227" }}>/settings/privacy</a>.
          Per la Privacy Policy completa: <a href="/privacy" style={{ color: "#C9A227" }}>/privacy</a>.
        </div>
      </div>
    </div>
  );
}
