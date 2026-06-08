import React from "react";
import { useNavigate } from "react-router-dom";

const BG = "#0b1220";
const GOLD = "#C9A227";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: GOLD, marginBottom: 12, borderBottom: "1px solid rgba(201,162,39,0.15)", paddingBottom: 8 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "rgba(11,18,32,0.97)", borderBottom: "1px solid rgba(30,41,59,0.7)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0" }}>Privacy Policy</span>
        </div>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 16px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>Informativa sulla Privacy</h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>Ai sensi del Regolamento UE 2016/679 (GDPR) · Ultimo aggiornamento: 1 giugno 2026</p>
        </div>

        <Section title="1. Titolare del Trattamento">
          <p>Il titolare del trattamento dei dati è VinoInvest, contattabile all'indirizzo email: <a href="mailto:privacy@vinoinvest.io" style={{ color: GOLD }}>privacy@vinoinvest.io</a></p>
        </Section>

        <Section title="2. Dati Raccolti e Finalità">
          <p><strong style={{ color: "#e2e8f0" }}>Dati di registrazione:</strong> Email e password (hasharata con bcrypt, mai leggibile in chiaro). Finalità: autenticazione e gestione account. Base giuridica: esecuzione contratto (Art. 6.1.b GDPR).</p>
          <p style={{ marginTop: 12 }}><strong style={{ color: "#e2e8f0" }}>Dati di utilizzo:</strong> Vini visualizzati, ricerche effettuate, progressi Academy. Finalità: personalizzazione del servizio. Base giuridica: interesse legittimo (Art. 6.1.f GDPR).</p>
          <p style={{ marginTop: 12 }}><strong style={{ color: "#e2e8f0" }}>Dati di pagamento:</strong> Elaborati esclusivamente da Stripe Inc. VinoInvest non conserva dati di carte di credito. Base giuridica: esecuzione contratto.</p>
          <p style={{ marginTop: 12 }}><strong style={{ color: "#e2e8f0" }}>Log tecnici:</strong> Indirizzo IP, browser, timestamp accessi. Conservati per 90 giorni a fini di sicurezza.</p>
        </Section>

        <Section title="3. Conservazione dei Dati">
          <p>I dati dell'account vengono conservati per tutta la durata del rapporto contrattuale e per i successivi 2 anni, salvo obbligo legale di conservazione più lungo.</p>
          <p style={{ marginTop: 12 }}>In caso di cancellazione account, i dati vengono eliminati entro 30 giorni, eccetto quelli richiesti dalla legge (fatturazione: 10 anni).</p>
        </Section>

        <Section title="4. Diritti dell'Utente (Art. 15-22 GDPR)">
          <ul style={{ paddingLeft: 20, marginTop: 0 }}>
            <li style={{ marginBottom: 8 }}><strong>Accesso (Art. 15):</strong> Ottenere copia di tutti i dati che ti riguardano</li>
            <li style={{ marginBottom: 8 }}><strong>Rettifica (Art. 16):</strong> Correggere dati inesatti</li>
            <li style={{ marginBottom: 8 }}><strong>Cancellazione (Art. 17):</strong> Richiedere l'eliminazione dei tuoi dati</li>
            <li style={{ marginBottom: 8 }}><strong>Portabilità (Art. 20):</strong> Ricevere i tuoi dati in formato leggibile da macchina</li>
            <li style={{ marginBottom: 8 }}><strong>Opposizione (Art. 21):</strong> Opporti al trattamento per interesse legittimo</li>
            <li style={{ marginBottom: 8 }}><strong>Limitazione (Art. 18):</strong> Richiedere la limitazione del trattamento</li>
          </ul>
          <p style={{ marginTop: 12 }}>Per esercitare questi diritti: <a href="/settings/privacy" style={{ color: GOLD }}>Impostazioni Privacy</a> oppure email a privacy@vinoinvest.io. Risposta entro 30 giorni.</p>
        </Section>

        <Section title="5. Trasferimento Dati Extra-UE">
          <p>I seguenti fornitori possono trattare dati fuori dall'UE:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}><strong>Supabase Inc. (USA)</strong> — autenticazione. Standard Contractual Clauses UE approvate.</li>
            <li style={{ marginBottom: 8 }}><strong>Render Services Inc. (USA)</strong> — hosting backend. SCC approvate.</li>
            <li style={{ marginBottom: 8 }}><strong>Vercel Inc. (USA)</strong> — hosting frontend. SCC approvate.</li>
            <li style={{ marginBottom: 8 }}><strong>Stripe Inc. (USA)</strong> — pagamenti. Adeguatezza certificata (Privacy Shield successor).</li>
          </ul>
        </Section>

        <Section title="6. Cookie Policy">
          <p>VinoInvest usa esclusivamente cookie tecnici necessari al funzionamento del servizio (sessione di autenticazione Supabase). Non usa cookie di profilazione o marketing di terze parti.</p>
          <p style={{ marginTop: 12 }}>Per dettagli: <a href="/cookies" style={{ color: GOLD }}>Cookie Policy</a></p>
        </Section>

        <Section title="7. Reclami">
          <p>Hai il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (Autorità di controllo italiana): <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>www.garanteprivacy.it</a></p>
        </Section>

        <div style={{ marginTop: 40, padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 12, fontSize: 13, color: "#475569" }}>
          <a href="/terms" style={{ color: "#64748b", marginRight: 16 }}>Termini di Servizio</a>
          <a href="/cookies" style={{ color: "#64748b", marginRight: 16 }}>Cookie Policy</a>
          <a href="/disclaimer" style={{ color: "#64748b" }}>Disclaimer Finanziario</a>
        </div>
      </div>
    </div>
  );
}
