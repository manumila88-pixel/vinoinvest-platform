import React from "react";
import { useNavigate } from "react-router-dom";

const BG = "#0b1220";
const GOLD = "#C9A227";

export default function Disclaimer() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "rgba(11,18,32,0.97)", borderBottom: "1px solid rgba(30,41,59,0.7)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0" }}>Disclaimer Finanziario</span>
        </div>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 16px" }}>
        <div style={{ background: "rgba(201,162,39,0.08)", border: "2px solid rgba(201,162,39,0.3)", borderRadius: 16, padding: "24px 28px", marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12, color: GOLD }}>⚠️ Disclaimer Finanziario</h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#e2e8f0" }}>
            VinoInvest fornisce dati, analisi e contenuti educativi <strong>a scopo puramente informativo</strong>. Nulla di quanto presente su questa piattaforma costituisce consulenza finanziaria, raccomandazione personalizzata di investimento, o sollecitazione all'acquisto o alla vendita di asset.
          </p>
        </div>

        {[
          { title: "Rendimenti passati non garantiscono rendimenti futuri", body: "I dati storici di performance mostrati su VinoInvest si riferiscono a periodi passati e non costituiscono in alcun modo una garanzia di rendimenti futuri. I mercati del fine wine possono essere soggetti a volatilità significativa. Il valore degli investimenti può scendere così come salire." },
          { title: "Rischio di perdita del capitale", body: "Investire nel vino comporta rischi reali di perdita parziale o totale del capitale investito. Fattori di rischio includono: fluttuazioni del mercato, problemi di autenticità, costi di stoccaggio e assicurazione, illiquidità, moda e preferenze dei consumatori, condizioni macroeconomiche." },
          { title: "Prezzi e Score Algoritmici", body: "I prezzi mostrati su VinoInvest sono stime algoritmiche basate su dati pubblici disponibili (Liv-ex, CellarTracker, aste). Salvo diversa indicazione esplicita, non costituiscono prezzi ufficiali di mercato né quotazioni vincolanti. L'AI Score è un indicatore informativo elaborato da un algoritmo proprietario, non una valutazione di un analista umano." },
          { title: "Non siamo una SIM né un consulente abilitato", body: "VinoInvest non è una Società di Intermediazione Mobiliare, non è iscritta all'Albo dei Promotori Finanziari, e non è autorizzata a fornire consulenza finanziaria ai sensi del D.Lgs. 58/1998 (TUF) e della Direttiva MiFID II. Prima di qualsiasi decisione di investimento, consulta un professionista abilitato." },
          { title: "Contenuti Academy", body: "I corsi dell'Academy di VinoInvest hanno scopo puramente educativo. I certificati rilasciati al termine dei percorsi non costituiscono qualifiche professionali riconosciute da enti regolatori finanziari o viticoli." },
          { title: "Fonti e Accuratezza", body: "VinoInvest si impegna a citare fonti verificabili. I dati provenienti da terze parti (Liv-ex, CellarTracker, Wine Spectator, Decanter) sono soggetti ai termini d'uso dei rispettivi titolari. VinoInvest non verifica in tempo reale l'accuratezza di tutti i dati e non risponde di eventuali inesattezze." },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{item.title}</h2>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{item.body}</p>
          </div>
        ))}

        <div style={{ marginTop: 40, padding: "16px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 12, fontSize: 13, color: "#475569" }}>
          <a href="/terms" style={{ color: "#64748b", marginRight: 16 }}>Termini di Servizio</a>
          <a href="/privacy" style={{ color: "#64748b", marginRight: 16 }}>Privacy Policy</a>
          <a href="/cookies" style={{ color: "#64748b" }}>Cookie Policy</a>
        </div>
      </div>
    </div>
  );
}
