import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const TEMPLATES = [
  {
    id: "suitability",
    title: "Template Suitability Assessment",
    description: "Questionario di adeguatezza per clienti HNWI che investono in fine wine. Conforme MiFID II.",
    icon: "⚖️",
    tag: "Compliance",
    filename: "suitability-assessment-wine.txt",
    content: `SUITABILITY ASSESSMENT — INVESTIMENTO IN FINE WINE
Data: _______________    Advisor: _______________    Cliente: _______________

1. PROFILO DEL CLIENTE
──────────────────────
1.1 Età: ___   Professione: _______________
1.2 AUM totale gestito: □ <€500k  □ €500k-2M  □ €2M-10M  □ >€10M
1.3 Esperienze di investimento pregresse:
    □ Obbligazioni  □ Azioni  □ Immobiliare  □ Private Equity  □ Alternative  □ Wine

2. OBIETTIVI DI INVESTIMENTO
────────────────────────────
2.1 Orizzonte temporale:  □ 3-5 anni  □ 5-10 anni  □ >10 anni
2.2 Obiettivo principale:  □ Preservazione patrimonio  □ Crescita moderata  □ Crescita sostenuta
2.3 Necessità di liquidità nei prossimi 12 mesi:  □ Sì — importo: ___  □ No
2.4 Rendimento atteso annuo:  □ <5%  □ 5-10%  □ 10-15%  □ >15%

3. TOLLERANZA AL RISCHIO
──────────────────────────
3.1 Perdita massima accettabile (orizzonte 12 mesi):
    □ 0-5%  □ 5-10%  □ 10-20%  □ >20%
3.2 Reazione storica a perdite temporanee:
    □ Liquido tutto  □ Riduco esposizione  □ Mantengo  □ Incremento
3.3 Volatilità accettabile:  □ Bassa  □ Moderata  □ Alta
3.4 Esperienza specifica fine wine (anni): □ 0  □ 1-2  □ 3-5  □ >5

4. CONOSCENZA DEL PRODOTTO (fine wine)
───────────────────────────────────────
4.1 Conosco i principali indici (Liv-ex 1000, Bordeaux 500): □ Sì  □ No
4.2 Conosco il meccanismo di en primeur: □ Sì  □ No
4.3 Comprendo l'illiquidità tipica (vendita 30-90 giorni): □ Sì  □ No
4.4 Conosco i costi: storage, assicurazione, commissioni: □ Sì  □ No

5. VALUTAZIONE DI ADEGUATEZZA
───────────────────────────────
Allocazione proposta al fine wine: ___% del patrimonio totale
Motivazione: _______________________________________________

Adeguato:  □ Sì  □ No
Se no, motivo: _______________________________________________

Firma Advisor: _______________    Data: _______________
Firma Cliente: _______________    Data: _______________

NOTE: Questo documento è destinato esclusivamente all'uso professionale.
Conservare per 10 anni ai sensi della normativa MiFID II.
`,
  },
  {
    id: "duediligence",
    title: "Checklist Due Diligence Wine Fund",
    description: "Checklist professionale per la valutazione di fondi di investimento specializzati in fine wine.",
    icon: "🔍",
    tag: "Analisi",
    filename: "due-diligence-wine-fund.txt",
    content: `DUE DILIGENCE CHECKLIST — WINE INVESTMENT FUND
Data: _______________    Fondo valutato: _______________    Analista: _______________

1. STRUTTURA LEGALE E REGOLAMENTARE
─────────────────────────────────────
□ Tipo di veicolo: _______________  (SIF, FIA, LP, SICAV, altro)
□ Giurisdizione: _______________
□ Autorizzazione regolamentare (es. CSSF, FCA, Banca d'Italia): □ Sì  □ No
□ Depositario indipendente: □ Sì  □ No  — Nome: _______________
□ Audit annuale certificato: □ Sì  □ No  — Revisore: _______________
□ NAV calculation: □ Mensile  □ Trimestrale  □ Annuale

2. STRATEGIA DI INVESTIMENTO
──────────────────────────────
□ Focus geografico: □ Bordeaux  □ Borgogna  □ Italia  □ Multi-regione
□ Approccio: □ Buy & hold  □ Trading attivo  □ En primeur  □ Misto
□ Target rendimento annuo netto: ___%
□ Orizzonte raccomandato: ___ anni
□ Esposizione max a singolo vino: ___%
□ Esposizione max a singola annata: ___%

3. TRACK RECORD
────────────────
□ Performance netta 1 anno: ___%  3 anni: ___%  5 anni: ___%
□ Fonte dei rendimenti: □ Apprezzamento  □ Trading  □ Dividendi en primeur
□ Benchmark usato: □ Liv-ex 1000  □ Bordeaux 500  □ Nessuno  □ Custom
□ Drawdown massimo storico: ___%  Anno: ___
□ Sharpe Ratio storico: ___

4. TEAM E GOVERNANCE
──────────────────────
□ AUM totale gestito: _______________
□ Numero di vini in portfolio: ___
□ Expertise team (anni medi nel settore): ___
□ Advisor indipendente: □ Sì  □ No
□ Investment committee: □ Sì  □ No  — Frequenza: ___

5. OPERAZIONI E CUSTODIA
─────────────────────────
□ Stoccaggio: □ Bonded warehouse UK  □ Switzerland Free Port  □ Altro
□ Assicurazione: □ Sì  □ No  — Importo: ___
□ Verifica autenticità: □ Sì  □ No  — Metodo: ___
□ Exit: □ Aste  □ Liv-ex  □ Merchant  □ Secondario
□ Lock-up period: ___ mesi

6. VALUTAZIONE FINALE
──────────────────────
Score complessivo (1-10): ___
Raccomandazione: □ Idoneo  □ Idoneo con riserve  □ Non idoneo
Note: _______________________________________________

Firma: _______________    Data: _______________
`,
  },
  {
    id: "portfolioReport",
    title: "Template Report Portfolio Cliente",
    description: "Struttura professionale per report mensile/trimestrale di portfolio fine wine per clienti HNWI.",
    icon: "📄",
    tag: "Reporting",
    filename: "template-report-portfolio.txt",
    content: `REPORT PORTFOLIO FINE WINE
Cliente: _______________    Periodo: _______________    Advisor: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. SOMMARIO ESECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Valore Portfolio a Fine Periodo:  € _______________
Variazione vs Periodo Precedente: +/- € _______________  (+/- __%)
ROI dall'Inizio:                  +/- € _______________  (+/- __%)
Benchmark Liv-ex 1000 (periodo):  +/- ___%

Performance vs Benchmark:         +/- ___ punti base

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. COMPOSIZIONE PORTFOLIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vino                    | Annata | Btg | P.Acquisto | P.Attuale | P&L     | %Port
──────────────────────────────────────────────────────────────────────────────────
___________________     | ___  | ___ | €_____     | €_____    | €_____  | ___
___________________     | ___  | ___ | €_____     | €_____    | €_____  | ___
___________________     | ___  | ___ | €_____     | €_____    | €_____  | ___
TOTALE                  |      |     |            |           | €_____  | 100%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. ALLOCAZIONE PER REGIONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bordeaux:        ___% — Valore: €_______________
Borgogna:        ___% — Valore: €_______________
Champagne:       ___% — Valore: €_______________
Italia:          ___% — Valore: €_______________
Altre Regioni:   ___% — Valore: €_______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. METRICHE DI RISCHIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sharpe Ratio:              ___
Volatilità annualizzata:   ___%
Max Drawdown (storico):    ___%
Value at Risk (95%, 1mo):  €_______________
Correlazione vs S&P500:    ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. OPERAZIONI DEL PERIODO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Acquisti:  _______________________________________________
Vendite:   _______________________________________________
Costi periodo (storage + assicurazione): €_______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. OUTLOOK E RACCOMANDAZIONI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analisi mercato: _______________________________________________
_______________________________________________________________

Raccomandazioni advisor: ________________________________________
_______________________________________________________________

Prossima review: _______________
Firma Advisor:   _______________    Data: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Documento riservato — uso esclusivo del destinatario.
Dati elaborati da VinoInvest Professional Platform.
`,
  },
  {
    id: "allocation",
    title: "Framework Allocazione Wine in Multi-Asset",
    description: "Modello quantitativo per determinare l'allocazione ottimale al fine wine in un portfolio multi-asset.",
    icon: "📊",
    tag: "Portfolio",
    filename: "framework-allocazione-wine-multi-asset.txt",
    content: `FRAMEWORK ALLOCAZIONE FINE WINE IN PORTFOLIO MULTI-ASSET
VinoInvest Professional — Documento ad uso interno advisor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PREMESSA E RAZIONALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Il fine wine come asset class:
• Rendimento storico (Liv-ex 1000, 2004-2024): ~10% annuo
• Volatilità media: 8-12% (vs equity 15-20%)
• Correlazione con S&P500: ~0.1-0.2
• Correlazione con inflazione: ~0.4 (hedge parziale)
• Liquidità: bassa (30-90 giorni per vendita)
• Storage: £12-17/cassa/anno (UK bonded)

Logica dell'inclusione: riduzione volatilità complessiva
senza sacrificio significativo di rendimento atteso.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. GRIGLIA DI ALLOCAZIONE PER PROFILO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Profilo Conservativo:
  Wine: 2-4%  |  Rationale: puro hedge inflazione
  Min AUM consigliato: €500k (illiquidità)
  Prodotti: Bordeaux grand cru, Champagne prestige

Profilo Moderato:
  Wine: 4-8%  |  Rationale: diversificazione + rendimento
  Min AUM consigliato: €1M
  Prodotti: Bordeaux + top Borgogna + top Italia

Profilo Crescita:
  Wine: 8-12% |  Rationale: alpha seeking, trading attivo
  Min AUM consigliato: €2M
  Prodotti: Multi-regione + en primeur + emerging regions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. COSTRUZIONE PORTFOLIO WINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Regola del 3x3:
• Max 3 regioni principali
• Max 3 produttori per regione
• Max 3 annate (diversificazione temporale)

Peso suggerito per regione (profilo moderato):
• Bordeaux premier cru: 40%
• Borgogna grand cru:   25%
• Champagne prestige:   15%
• Italia (Barolo/Brunello): 20%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CHECKLIST PRE-ACQUISTO (per ogni vino)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ AI Score VinoInvest > 85
□ Annata: parere Parker/Wine Advocate/Decanter (>93pts)
□ Trend Liv-ex ultimi 12 mesi: stabile o crescente
□ Liquidity score: >3 (almeno 10 transazioni Liv-ex/anno)
□ Provenance: acquisto da merchant certificato con fattura
□ Storage: bonded warehouse con certificato di custodia
□ Assicurazione: inclusa o separata sul valore di mercato
□ Exit strategy pianificata: asta / Liv-ex / merchant

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. MONITORAGGIO E RIBILANCIAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frequenza review: trimestrale
Trigger ribilanciamento: deviazione >20% dall'allocation target
Sell trigger: AI Score scende sotto 70, o indice regionale -15% YTD
Buy opportunity: correzioni di mercato >10% su vini AI Score >85

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. COSTI DA CONSIDERARE NELL'IRR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Storage:           £12-17/cassa/anno (~0.5-1% p.a. per value)
Assicurazione:     ~0.2-0.4% del valore
Commissioni acquisto: 5-12% (aste) / 2-5% (merchant)
Commissioni vendita: 8-15% (aste) / 3-7% (Liv-ex)
Fiscalità:         varia per giurisdizione (cgT exemption UK)

IRR netto target (al netto di tutti i costi): 6-9% p.a.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Documento ad uso professionale — VinoInvest Professional
Aggiornato: 2026 | Non costituisce consulenza d'investimento.
`,
  },
];

function downloadTemplate(template) {
  const blob = new Blob([template.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = template.filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AcademyTemplates() {
  const [downloaded, setDownloaded] = useState({});

  function handleDownload(tpl) {
    downloadTemplate(tpl);
    setDownloaded(d => ({ ...d, [tpl.id]: true }));
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0b1220 0%,#040810 50%,#0b1220 100%)",
      color: "#e2e8f0",
      fontFamily: "'Inter',Arial,sans-serif",
    }}>
      <Helmet>
        <title>Template Professionali B2B | VinoInvest Academy</title>
        <meta name="description" content="Template professionali scaricabili per wealth manager: suitability assessment, due diligence, report portfolio, allocazione multi-asset." />
      </Helmet>

      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)",
        padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>
        <a href="/b2b" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🍷</span>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>VinoInvest</span>
          <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>B2B</span>
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/academy" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>Academy →</a>
          <a href="/b2b" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, color: "#60a5fa", textDecoration: "none", border: "1px solid rgba(59,130,246,0.2)" }}>B2B Platform →</a>
        </div>
      </nav>

      <section style={{ padding: "80px 32px 40px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 100,
          background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.3)",
          fontSize: 12, fontWeight: 600, color: "#C9A227", marginBottom: 24, letterSpacing: "0.05em",
        }}>
          ACADEMY PROFESSIONAL — MATERIALI SCARICABILI
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px",
          background: "linear-gradient(135deg,#e2e8f0,#C9A227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Template Professionali
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
          Strumenti operativi per wealth manager e family office. Scarica, personalizza e usa subito.
        </p>
      </section>

      <section style={{ padding: "0 32px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {TEMPLATES.map(tpl => (
            <div key={tpl.id} style={{
              padding: "28px 32px", borderRadius: 16,
              background: downloaded[tpl.id] ? "rgba(201,162,39,0.05)" : "rgba(8,15,30,0.6)",
              border: downloaded[tpl.id] ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(59,130,246,0.15)",
              display: "flex", alignItems: "center", gap: 24,
              transition: "border-color 0.2s",
            }}>
              <div style={{ fontSize: 40, flexShrink: 0 }}>{tpl.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#C9A227", background: "rgba(201,162,39,0.1)", padding: "2px 8px", borderRadius: 4 }}>
                    {tpl.tag}
                  </span>
                  {downloaded[tpl.id] && (
                    <span style={{ fontSize: 11, color: "#34d399" }}>✓ Scaricato</span>
                  )}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: "#e2e8f0", margin: "0 0 6px" }}>{tpl.title}</h3>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{tpl.description}</p>
                <div style={{ fontSize: 11, color: "#334155", marginTop: 8 }}>📄 {tpl.filename}</div>
              </div>
              <button
                onClick={() => handleDownload(tpl)}
                style={{
                  flexShrink: 0, padding: "10px 20px", borderRadius: 10, cursor: "pointer",
                  fontSize: 13, fontWeight: 700,
                  background: downloaded[tpl.id]
                    ? "rgba(52,211,153,0.1)"
                    : "linear-gradient(135deg,#C9A227,#a07820)",
                  border: downloaded[tpl.id] ? "1px solid rgba(52,211,153,0.3)" : "none",
                  color: downloaded[tpl.id] ? "#34d399" : "#fff",
                  boxShadow: downloaded[tpl.id] ? "none" : "0 4px 16px rgba(201,162,39,0.25)",
                  transition: "all 0.2s",
                }}
              >
                {downloaded[tpl.id] ? "✓ Scaricato" : "Scarica .txt"}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 40, padding: "20px 24px", borderRadius: 12,
          background: "rgba(8,15,30,0.4)", border: "1px solid rgba(30,41,59,0.4)",
          fontSize: 13, color: "#3a5a7a", lineHeight: 1.7, textAlign: "center",
        }}>
          Tutti i template sono in formato testo strutturato. Personalizzabili con il tuo brand.<br />
          Per richieste di template personalizzati o in formato Word/PDF:{" "}
          <a href="mailto:sales@vinoinvest.com" style={{ color: "#C9A227", textDecoration: "none" }}>sales@vinoinvest.com</a>
        </div>
      </section>
    </div>
  );
}
