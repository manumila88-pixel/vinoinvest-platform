import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BG = "#0b1220";
const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

export default function AcademyVerify() {
  const { code } = useParams();
  const [status, setStatus] = useState("loading"); // loading | valid | invalid
  const [cert, setCert] = useState(null);

  useEffect(() => {
    if (!code) { setStatus("invalid"); return; }
    fetch(`${API}/api/academy/verify/${code}`)
      .then(r => r.json())
      .then(d => {
        if (d.valid && d.certificate) { setCert(d.certificate); setStatus("valid"); }
        else setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [code]);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      {status === "loading" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div>Verifica in corso...</div>
        </div>
      )}
      {status === "invalid" && (
        <div style={{ background: "#1a2535", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>Certificato Non Valido</div>
          <div style={{ color: "#94a3b8" }}>Il codice inserito non corrisponde a nessun certificato emesso da VinoInvest Academy.</div>
        </div>
      )}
      {status === "valid" && cert && (
        <div style={{ background: "#1a2535", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 560, width: "100%" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#4ade80", marginBottom: 20 }}>Certificato Autentico</div>
          <div style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎓</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#C9A227", marginBottom: 4 }}>VinoInvest Academy</div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 16 }}>Certifica che</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{cert.user_name}</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>ha completato con successo il corso</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#C9A227", marginBottom: 16 }}>Corso ID: {cert.course_id}</div>
            <div style={{ fontSize: 13, color: "#475569" }}>
              Emesso il: {new Date(cert.issued_at).toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 8, fontFamily: "monospace" }}>
              Codice: {cert.code}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            Questo certificato è stato emesso e verificato da VinoInvest Academy.
            Qualsiasi datore di lavoro o istituzione può verificare l'autenticità su vinoinvest-platform.vercel.app/verify/{cert.code}
          </div>
        </div>
      )}
    </div>
  );
}
