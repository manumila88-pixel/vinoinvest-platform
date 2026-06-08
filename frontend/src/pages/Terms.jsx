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

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "rgba(11,18,32,0.97)", borderBottom: "1px solid rgba(30,41,59,0.7)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0" }}>Termini di Servizio</span>
        </div>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 16px" }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>Termini di Servizio</h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>Ultimo aggiornamento: 1 giugno 2026</p>
        </div>

        <div style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 32, fontSize: 13, lineHeight: 1.7 }}>
          <strong style={{ color: GOLD }}>⚠️ Avvertenza importante:</strong> VinoInvest fornisce dati e analisi a scopo puramente informativo. Non costituisce consulenza finanziaria, raccomandazione di investimento o sollecitazione all'acquisto di strumenti finanziari. I rendimenti passati non garantiscono risultati futuri.
        </div>

        <Section title="1. Natura del Servizio">
          <p>VinoInvest è una piattaforma di informazione e analisi dati dedicata al mercato del fine wine. Il servizio include: motore di ricerca vini, score algoritmici di valutazione, storico prezzi basato su fonti pubbliche, contenuti educativi (Academy) e strumenti di analisi del portafoglio.</p>
          <p style={{ marginTop: 12 }}>VinoInvest <strong>non è</strong>: un intermediario finanziario, un consulente di investimento, un broker, una piattaforma di scambio di strumenti finanziari regolamentati. I vini mostrati non sono strumenti finanziari ai sensi della Direttiva MiFID II.</p>
        </Section>

        <Section title="2. Limitazione di Responsabilità">
          <p>I dati presenti su VinoInvest provengono da fonti pubbliche (Liv-ex, CellarTracker, aste pubbliche) e da stime algoritmiche. VinoInvest non garantisce l'accuratezza, la completezza o l'attualità delle informazioni.</p>
          <p style={{ marginTop: 12 }}>L'utente è l'unico responsabile delle decisioni di acquisto o vendita di vini o altri asset. VinoInvest declina ogni responsabilità per perdite dirette o indirette derivanti dall'uso delle informazioni presenti sulla piattaforma.</p>
          <p style={{ marginTop: 12 }}>I prezzi mostrati sono stime algoritmiche basate su dati storici, salvo diversa indicazione. Non costituiscono quotazioni ufficiali né impegni di acquisto o vendita.</p>
        </Section>

        <Section title="3. Account e Accesso">
          <p>La registrazione richiede l'inserimento di un indirizzo email valido. L'utente è responsabile della riservatezza delle proprie credenziali e di tutte le attività svolte con il proprio account.</p>
          <p style={{ marginTop: 12 }}>VinoInvest si riserva il diritto di sospendere o eliminare account che violino i presenti Termini, utilizzino la piattaforma in modo fraudolento, o tentino di compromettere la sicurezza del sistema.</p>
        </Section>

        <Section title="4. Academy — Condizioni di Accesso">
          <p>I corsi Academy gratuiti sono disponibili per tutti gli utenti registrati. I corsi premium (€9.99/mese — Investor; €19.99/mese — Professional) richiedono un abbonamento attivo.</p>
          <p style={{ marginTop: 12 }}>I contenuti Academy sono protetti da copyright. È vietata la riproduzione, condivisione o commercializzazione senza autorizzazione scritta.</p>
          <p style={{ marginTop: 12 }}>I certificati rilasciati al termine dei corsi hanno valore educativo e non costituiscono qualifiche professionali riconosciute da enti regolatori.</p>
        </Section>

        <Section title="5. Abbonamenti e Rimborsi">
          <p>Gli abbonamenti si rinnovano automaticamente salvo disdetta prima del rinnovo. È possibile disdire in qualsiasi momento dall'area personale.</p>
          <p style={{ marginTop: 12 }}>Politica rimborsi: entro 14 giorni dall'attivazione dell'abbonamento, l'utente può richiedere il rimborso completo via email a support@vinoinvest.io, purché non siano stati completati più di 2 moduli del corso acquistato.</p>
        </Section>

        <Section title="6. Proprietà Intellettuale">
          <p>Tutti i contenuti di VinoInvest (testi, grafici, score algoritimici, codice, brand) sono di proprietà esclusiva di VinoInvest. È vietato l'uso commerciale senza autorizzazione.</p>
          <p style={{ marginTop: 12 }}>I dati di terze parti (Liv-ex, CellarTracker, etc.) rimangono di proprietà dei rispettivi titolari e sono usati in conformità con i loro termini di utilizzo.</p>
        </Section>

        <Section title="7. Legge Applicabile e Foro Competente">
          <p>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente in via esclusiva il Foro di Milano, salvo diversa previsione di legge a tutela del consumatore (D.Lgs. 206/2005).</p>
        </Section>

        <Section title="8. Modifiche ai Termini">
          <p>VinoInvest può modificare i presenti Termini con preavviso di 30 giorni via email. L'uso continuato del servizio dopo tale periodo costituisce accettazione delle modifiche.</p>
        </Section>

        <div style={{ marginTop: 40, padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 12, fontSize: 13, color: "#475569" }}>
          Per contatti legali: <a href="mailto:legal@vinoinvest.io" style={{ color: GOLD }}>legal@vinoinvest.io</a>
          <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/privacy" style={{ color: "#64748b" }}>Privacy Policy</a>
            <a href="/cookies" style={{ color: "#64748b" }}>Cookie Policy</a>
            <a href="/disclaimer" style={{ color: "#64748b" }}>Disclaimer</a>
          </div>
        </div>
      </div>
    </div>
  );
}
