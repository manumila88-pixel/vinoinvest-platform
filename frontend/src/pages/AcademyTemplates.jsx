import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { SITE_HOST } from "../lib/constants";

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
• Rendimento storico (Liv-ex 1000): ESEMPIO ILLUSTRATIVO — verificare su Liv-ex per il periodo corrente
• Volatilità media: 8-12% (vs equity 15-20%) — dato indicativo, verificare su fonti primarie
• Correlazione con S&P500: ~0.1-0.2 (storicamente bassa)
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
  {
    id: "due-diligence-wine",
    title: "Due Diligence Checklist per Investimento Fine Wine",
    description: "Checklist professionale in 5 sezioni per la valutazione di autenticità, conservazione, documentazione legale, mercato e controparte prima di ogni acquisto.",
    icon: "🔍",
    tag: "Due Diligence",
    filename: "due-diligence-fine-wine.txt",
    content: `DUE DILIGENCE CHECKLIST — INVESTIMENTO FINE WINE (SINGOLO LOTTO)
Data: _______________    Acquirente/Advisor: _______________    Vino: _______________
Annata: ___   Quantità (bottiglie/casse): ___   Prezzo offerto: €_______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. AUTENTICITÀ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Provenienza documentata (catena di custodia completa): □ Sì  □ No  □ Parziale
   Note: _______________________________________________
□ Etichetta: corrispondenza con annata dichiarata, font e colori autentici
   Note: _______________________________________________
□ Capsula: integrità, colore e stampa conformi al produttore
   Note: _______________________________________________
□ Livello: □ Base gola  □ Alta spalla  □ Media spalla  □ Bassa spalla
   Livello accettabile per l'annata? □ Sì  □ No
   Note: _______________________________________________
□ Tappatura: assenza di spinte verso l'alto, nessuna perdita visibile
   Note: _______________________________________________
□ Retroetichetta e codici lotto: verificati e coerenti con release ufficiale
   Note: _______________________________________________
□ Numero di serie / QR Code produttore (ove applicabile): □ Verificato  □ N/A
   Note: _______________________________________________
□ Documentazione fotografica completa effettuata: □ Sì  □ No
   Note: _______________________________________________
□ Perizia terza parte (es. Wine Authenticate, Vérif'Vin): □ Sì  □ No  □ Da richiedere
   Note: _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. STATO DI CONSERVAZIONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Temperatura di stoccaggio storica: □ <12°C costante  □ 12-15°C  □ variabile  □ sconosciuta
   Note: _______________________________________________
□ Umidità relativa di stoccaggio: □ 60-75% (ideale)  □ fuori range  □ sconosciuta
   Note: _______________________________________________
□ Storage provider attuale: _______________________________________________
□ Storage provider certificato/accreditato (es. London City Bond, Octavian, Crown Wine): □ Sì  □ No
   Note: _______________________________________________
□ Storico trasferimenti tra magazzini (numero di movimenti): ___
   Ogni trasferimento documentato? □ Sì  □ No  □ Parziale
   Note: _______________________________________________
□ Audit reports magazzino disponibili (ultimo 12 mesi): □ Sì  □ No
   Note: _______________________________________________
□ Assicurazione attiva sul lotto: □ Sì — valore assicurato: €___  □ No
   Note: _______________________________________________
□ Casse originali (OWC — Original Wooden Case): □ Sì  □ No  □ Non applicabile
   Note: _______________________________________________
□ Stato fisico etichette (umidità, strappi, muffa): □ Ottimo  □ Buono  □ Discreto  □ Scarso
   Note: _______________________________________________
□ Ispezione fisica effettuata in loco: □ Sì  □ No (solo foto)
   Note: _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. DOCUMENTAZIONE LEGALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Invoice originale di acquisto disponibile: □ Sì  □ No
   Emessa da: _______________________________________________
□ Chain of custody completa (ogni passaggio di proprietà documentato): □ Sì  □ No  □ Parziale
   Note: _______________________________________________
□ Documenti doganali (per vini extra-UE o ex-UK post-Brexit): □ Sì  □ N/A
   Note: _______________________________________________
□ Certificato di custodia magazzino (warehouse receipt) corrente: □ Sì  □ No
   Note: _______________________________________________
□ Prova che il vino è in regime bonded / duty-paid: □ Bonded  □ Duty-paid  □ Da verificare
   Note: _______________________________________________
□ Assenza di pegni o vincoli legali sul lotto: □ Confermato  □ Da verificare
   Note: _______________________________________________
□ Contratto di vendita con clausole di garanzia autenticità: □ Sì  □ No  □ Da negoziare
   Note: _______________________________________________
□ Clausola di recesso o garanzia in caso di non autenticità: □ Sì  □ No
   Note: _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. VALUTAZIONE DI MERCATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Prezzo verificato su Liv-ex (Market Price): €___ / bottiglia   Data check: ___
   Note: _______________________________________________
□ Confronto Wine-Searcher (prezzo medio mercato): €___ / bottiglia
   Spread rispetto all'offerta: ___% (positivo se < 0%)
   Note: _______________________________________________
□ Ultime aste rilevanti (Sotheby's, Christie's, Hart Davis Hart) negli ultimi 12 mesi:
   Prezzo medio realizzato: €___ / bottiglia   Fonte: _______________
□ Trend di prezzo Liv-ex ultimi 12 mesi: □ +  □ stabile  □ - di ___%
   Note: _______________________________________________
□ Liquidity score (n. transazioni Liv-ex ultimi 12 mesi): ___
   Adeguato (>10 tx/anno)? □ Sì  □ No
   Note: _______________________________________________
□ Punteggi critici confermati: Parker/WA: ___  Decanter: ___  JR: ___
   Coerenti con le aspettative di prezzo? □ Sì  □ No
   Note: _______________________________________________
□ AI Score VinoInvest: ___  (target >80 per acquisto)
   Note: _______________________________________________
□ Prezzo d'acquisto vs. fair value stimato: sconto/premio: ___%
   Note: _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. CONTROPARTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Merchant / venditore: _______________________________________________
□ Anni di attività nel settore: ___
□ Iscrizione a associazioni di settore (LIV-EX, BIVB, CIVB, Merchants of Florence): □ Sì  □ No
   Quale: _______________________________________________
□ Reputazione online verificata (Wine-Searcher seller rating, Trustpilot): □ Positiva  □ Neutra  □ Negativa
   Note: _______________________________________________
□ Referenze da altri wealth manager / family office: □ Sì  □ No
   Fonte: _______________________________________________
□ Referenze dirette ricevute e verificate: □ Sì (n. ___) □ No
   Note: _______________________________________________
□ Storico di controversie legali note: □ No  □ Sì — dettagli: _______________
□ AML / KYC venditore completato (per acquisti >€10k): □ Sì  □ No  □ Da completare
   Note: _______________________________________________
□ Termini di pagamento e garanzie contrattuali accettabili: □ Sì  □ No
   Note: _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESITO DUE DILIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sezioni con criticità rilevate: □ 1  □ 2  □ 3  □ 4  □ 5  □ Nessuna

Raccomandazione: □ Procedi all'acquisto  □ Procedi con riserve  □ Non procedere
Note finali: _______________________________________________

Firma Advisor: _______________    Data: _______________

NOTE: Documento ad uso interno. Conservare con il dossier di acquisto.
Conforme alle best practice MiFID II per strumenti alternativi illiquidi.
`,
  },
  {
    id: "risk-calculator",
    title: "Risk Calculator per Portfolio Fine Wine",
    description: "Calcolatore testuale con formule quantitative (VaR, Sharpe, HHI) per valutare il profilo di rischio di un portfolio fine wine. Include esempio compilato.",
    icon: "📊",
    tag: "Risk",
    filename: "risk-calculator-wine.txt",
    content: `RISK CALCULATOR — PORTFOLIO FINE WINE
VinoInvest Professional | Versione 2026
Data elaborazione: _______________    Advisor: _______________    Cliente: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEZIONE A — INPUT DEL PORTFOLIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Compila i campi seguenti con i dati del portfolio cliente.

A1. AUM totale del cliente (tutti gli asset): €_______________
A2. Valore attuale portfolio fine wine:       €_______________
A3. % allocazione wine su AUM totale:         ___%   [= A2 / A1 × 100]

A4. Numero di posizioni nel portfolio wine:   ___
A5. Numero di regioni rappresentate:          ___
    (Bordeaux, Borgogna, Champagne, Italia, Rodano, California, altro)
    Dettaglio:
    Regione 1: _______________ — Valore: €_____ — % portfolio wine: ___%
    Regione 2: _______________ — Valore: €_____ — % portfolio wine: ___%
    Regione 3: _______________ — Valore: €_____ — % portfolio wine: ___%
    Regione 4: _______________ — Valore: €_____ — % portfolio wine: ___%
    Regione 5: _______________ — Valore: €_____ — % portfolio wine: ___%

A6. Rendimento medio annuo portfolio (ultimi 3 anni, se disponibile): ___%
A7. Volatilità annualizzata stimata o storica:                         ___%
    (default di settore: 10% per portfolio diversificato; 15-20% per portfolio concentrato)
A8. Rendimento del tasso risk-free (es. BTP 2Y, Euribor):             ___%
    (riferimento corrente 2026: ~2.8%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEZIONE B — FORMULE E CALCOLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

B1. SHARPE RATIO
────────────────
Formula: Sharpe = (Rp - Rf) / σp

Dove:
  Rp = rendimento annuo portfolio wine    (dal campo A6)
  Rf = tasso risk-free                    (dal campo A8)
  σp = volatilità annualizzata portfolio  (dal campo A7)

Calcolo:
  Sharpe = ( ___ % - ___ % ) / ___ % = ___

Interpretazione:
  > 1.0  → Eccellente risk-adjusted return
  0.5–1.0 → Buono
  0.0–0.5 → Accettabile
  < 0.0  → Underperformance rispetto al risk-free

B2. VALUE AT RISK (VaR) 95% — ORIZZONTE 1 MESE
────────────────────────────────────────────────
Formula: VaR(95%, 1M) = Vp × (µ_mensile - 1.65 × σ_mensile)

Dove:
  Vp           = valore portfolio wine                (dal campo A2)
  µ_mensile    = Rp_annuo / 12                        = ___ % / 12 = ___ %
  σ_mensile    = σ_annuo / √12                        = ___ % / √12 = ___ %
  1.65         = z-score per intervallo di confidenza 95%

Calcolo:
  µ_mensile  = ___ %
  σ_mensile  = ___ %
  VaR input  = µ_mensile - 1.65 × σ_mensile = ___ % - ___ % = ___ %
  VaR (€)    = €_______________ × ___ % = €_______________

Interpretazione:
  Con confidenza al 95%, la perdita massima mensile attesa è ≤ €_______________
  (ovvero il ___% del valore corrente del portfolio wine)

B3. INDICE DI CONCENTRAZIONE HERFINDAHL-HIRSCHMAN (HHI)
─────────────────────────────────────────────────────────
Formula: HHI = Σ (wi²)   dove wi = peso % di ogni regione espresso come frazione

Calcolo (inserire i pesi % di ogni regione da A5, divisi per 100):
  HHI = (___)² + (___)² + (___)² + (___)² + (___)² = ___

Esempio: se Bordeaux 50%, Borgogna 30%, Italia 20%:
  HHI = 0.50² + 0.30² + 0.20² = 0.25 + 0.09 + 0.04 = 0.38

Interpretazione:
  HHI < 0.15 → Alta diversificazione (portafoglio ben distribuito)
  0.15–0.25  → Diversificazione moderata
  0.25–0.40  → Concentrazione significativa (monitorare)
  > 0.40     → Alta concentrazione (rischio idiosincratico elevato)
  = 1.0      → Concentrazione totale (mono-regione)

B4. PESO MASSIMO SINGOLA POSIZIONE
────────────────────────────────────
Peso max consigliato per singolo vino: max 10% del portfolio wine
Calcolo soglia: 10% × €_______________ = €_______________

Posizioni che superano la soglia (indicare):
  1. _______________ — peso: ___% — €_______________
  2. _______________ — peso: ___% — €_______________
  Azione raccomandata: □ Nessuna  □ Riduzione posizione  □ Ribilanciamento

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEZIONE C — ESEMPIO DI CALCOLO COMPILATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESEMPIO ILLUSTRATIVO — sostituire con dati reali del cliente

INPUT (valori di esempio — non rappresentano rendimenti effettivi):
  AUM totale:              €3.500.000
  Portfolio wine:          €280.000  (8% di AUM — profilo moderato)
  N. posizioni:            12
  Regioni: Bordeaux 45%, Borgogna 30%, Champagne 15%, Italia 10%
  Rendimento storico 3Y:   X% annuo  [inserire rendimento reale verificato]
  Volatilità:              Y% annuo  [inserire volatilità reale verificata]
  Risk-free rate:          Z%        [inserire tasso corrente, es. BTP 2Y]

RISULTATI (con valori di esempio X=9%, Y=11%, Z=2.8%):
  Sharpe Ratio:
    = (X% - Z%) / Y% → formula: (Rp - Rf) / σp  → ESEMPIO: (9% - 2.8%) / 11% = 0.56  → BUONO

  VaR (95%, 1 mese):
    µ_mensile  = X% / 12
    σ_mensile  = Y% / √12
    VaR input  = µ_mensile - 1.65 × σ_mensile
    VaR (€)    = Vp × |VaR input|
    → Con il 95% di confidenza, la perdita mensile max è ≤ VaR (€) calcolato sui dati reali

  HHI:
    = 0.45² + 0.30² + 0.15² + 0.10²
    = 0.2025 + 0.09 + 0.0225 + 0.01 = 0.325  → CONCENTRAZIONE SIGNIFICATIVA
    Raccomandazione: ridurre Bordeaux al 40%, aumentare Italia al 15%

  Peso max singola posizione: 10% × €280.000 = €28.000
    Posizione Pétrus 2015 (OWC 3 bt): €31.000 → supera soglia, considerare riduzione

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEZIONE D — SINTESI E RACCOMANDAZIONI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sharpe Ratio calcolato:       ___   Giudizio: _______________
VaR 95% (1 mese) calcolato:   €___  Giudizio: _______________
HHI calcolato:                ___   Giudizio: _______________
Posizioni > 10%:              ___   Azione: _______________

Azioni di ribilanciamento proposte:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

Data prossima review rischio: _______________
Firma Advisor: _______________    Data: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTE METODOLOGICHE
Le formule applicate assumono distribuzione normale dei rendimenti.
Il fine wine presenta code più pesanti della normale (tail risk).
VaR non cattura i rischi di illiquidità (orizzonte vendita 30-90 giorni).
Documento ad uso professionale — VinoInvest Professional 2026.
`,
  },
  {
    id: "investment-proposal",
    title: "Template Investment Proposal per Clienti HNW",
    description: "Proposta di investimento in 6 sezioni per clienti High Net Worth: executive summary, allocazione, selezione vini con AI Score, risk management ed exit strategy.",
    icon: "📋",
    tag: "Proposal",
    filename: "investment-proposal-wine.txt",
    content: `INVESTMENT PROPOSAL — FINE WINE PORTFOLIO
Documento riservato — uso esclusivo del destinatario
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Preparato da:  _______________________________________________
Per:           _______________________________________________
Data:          _______________    Versione: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proposta in sintesi:

  Allocazione proposta al fine wine:   ___% dell'AUM  (€_______________)
  Rendimento atteso annuo netto:       ___%  (orizzonte ___ anni)
  Profilo di rischio:                  □ Conservativo  □ Moderato  □ Crescita

I tre argomenti chiave per questa proposta:

  1. _______________________________________________
     _______________________________________________

  2. _______________________________________________
     _______________________________________________

  3. _______________________________________________
     _______________________________________________

Raccomandazione sintetica:
_______________________________________________
_______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. PROFILO CLIENTE E OBIETTIVI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cliente: _______________________________________________
Categoria: □ HNWI (€1M-30M)  □ UHNWI (>€30M)  □ Family Office  □ Istituzionale

Obiettivo primario:
□ Preservazione patrimonio reale (hedge inflazione)
□ Diversificazione da equity/bond
□ Rendimento assoluto su orizzonte lungo
□ Passione e competenza di settore (motivazione mista)

Orizzonte temporale dichiarato: ___ anni
Necessità di liquidità nei prossimi 24 mesi: □ Sì — importo: €___  □ No
Vincoli etici o geografici da considerare: _______________

Suitability Assessment completato il: _______________  (ref. doc. n. ___)
Esito: □ Adeguato  □ Adeguato con avvertenze  □ Non adeguato (proposta non procedibile)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. PROPOSTA DI ALLOCAZIONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUM totale cliente: €_______________
Allocazione proposta al fine wine: ___% = €_______________

RIPARTIZIONE PER REGIONE:
─────────────────────────────────────────────────────────────────────────
Regione              | Peso % | Importo (€) | Rendimento Atteso (p.a.)
─────────────────────────────────────────────────────────────────────────
Bordeaux premier cru |  ___%  | €_________  | ___%
Borgogna grand cru   |  ___%  | €_________  | ___%
Champagne prestige   |  ___%  | €_________  | ___%
Italia (top tier)    |  ___%  | €_________  | ___%
Altra regione: ___   |  ___%  | €_________  | ___%
─────────────────────────────────────────────────────────────────────────
TOTALE               |  100%  | €_________  | ___% (media ponderata)
─────────────────────────────────────────────────────────────────────────

Note sull'allocazione:
_______________________________________________
_______________________________________________

Confronto con profilo benchmark MiFID:
  Max allocazione in strumenti illiquidi per questo profilo: ___%
  Allocazione proposta rientra nei limiti: □ Sì  □ No — giustificazione: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. SELEZIONE VINI — TOP 5 RACCOMANDATI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metodologia di selezione: AI Score VinoInvest + verifica Liv-ex + analisi fondamentale
Soglia minima AI Score per inclusione: 82/100

─────────────────────────────────────────────────────────────────────────────────
N. | Vino                    | Annata | AI Score | Prezzo/bt | % Portfolio | Rationale
─────────────────────────────────────────────────────────────────────────────────
1  | _____________________   |  ____  |  ___/100 | €_______  |    ___%     |
   | _______________________________________________
2  | _____________________   |  ____  |  ___/100 | €_______  |    ___%     |
   | _______________________________________________
3  | _____________________   |  ____  |  ___/100 | €_______  |    ___%     |
   | _______________________________________________
4  | _____________________   |  ____  |  ___/100 | €_______  |    ___%     |
   | _______________________________________________
5  | _____________________   |  ____  |  ___/100 | €_______  |    ___%     |
   | _______________________________________________
─────────────────────────────────────────────────────────────────────────────────

Note sulla selezione:
_______________________________________________
_______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. RISK MANAGEMENT E EXIT STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metriche di rischio target del portfolio proposto:
  Sharpe Ratio target:                   > ___
  VaR 95% mensile target (max):          ≤ ___% del valore wine = ≤ €_______________
  Concentrazione max (HHI):              < 0.30
  Peso max singolo vino:                 ≤ 10% del portfolio wine

Trigger di alert automatici (VinoInvest Platform):
  □ AI Score scende sotto 70 → notifica immediata
  □ Prezzo spot cala > 10% in 30 giorni → notifica immediata
  □ Indice Liv-ex regione di riferimento -8% YTD → review straordinaria

Strategia di uscita:
  Orizzonte primario: ___ anni
  Canale di vendita preferito: □ Aste (Sotheby's/Christie's)  □ Liv-ex  □ Merchant  □ Misto
  Canale secondario: _______________
  Stima tempo di liquidazione: 30-90 giorni per lotto standard
  Commissioni di uscita stimate: ___% del valore (incluse nelle proiezioni di rendimento)

Piano di ribilanciamento:
  Frequenza review: □ Mensile  □ Trimestrale  □ Semestrale
  Trigger ribilanciamento: deviazione > __% dall'allocation target

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. APPENDICE — FONTI E DISCLAIMER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fonti dati utilizzate:
  • Liv-ex (indici di mercato, prezzi spot, liquidità)
  • Wine-Searcher (prezzi di mercato comparati)
  • Wine Advocate / Robert Parker (punteggi critici)
  • Decanter / Jancis Robinson MW (punteggi critici)
  • VinoInvest AI Score (algoritmo proprietario)
  • Dati macroeconomici: Eurostat, BCE (tasso risk-free)
  Ultimo aggiornamento dati: _______________

Rendimenti storici citati:
  ESEMPIO ILLUSTRATIVO — sostituire con dati reali verificati da Liv-ex
  Liv-ex 1000 CAGR (periodo di riferimento): X% p.a. lordo (fonte: Liv-ex — verificare aggiornamento)
  Volatilità storica Bordeaux 500: da verificare su Liv-ex per il periodo corrente
  I rendimenti passati non sono garanzia di rendimenti futuri.

DISCLAIMER LEGALE (MiFID II):
Questo documento è preparato ai soli fini informativi e non costituisce
consulenza d'investimento ai sensi della Direttiva 2014/65/UE (MiFID II).
L'investimento in fine wine è uno strumento alternativo illiquido
classificato come ad alto rischio per la categoria retail. L'investimento
è adatto esclusivamente a investitori professionali e/o HNWI che soddisfino
i requisiti di adeguatezza verificati nel documento di Suitability Assessment.
Il fine wine non è uno strumento finanziario regolamentato ai sensi di MiFID II;
non è coperto da garanzie FITD/FGD né da sistemi di protezione degli investitori.
Conservare il presente documento per 5 anni ai sensi degli obblighi di
rendicontazione MiFID II (art. 25, Direttiva 2014/65/UE).

Firma Advisor: _______________    Data: _______________
Firma Cliente per ricevuta: _______________    Data: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VinoInvest Professional Platform | ${SITE_HOST}
`,
  },
  {
    id: "monthly-report",
    title: "Template Report Mensile Cliente",
    description: "Struttura completa per il report mensile: performance YTD, market update con benchmark Liv-ex/S&P500, portfolio highlights, raccomandazioni e appendice tecnica.",
    icon: "📅",
    tag: "Reporting",
    filename: "monthly-report-wine.txt",
    content: `REPORT MENSILE — PORTFOLIO FINE WINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cliente:    _______________________________________________
Advisor:    _______________________________________________
Periodo:    _______________ (es. Maggio 2026)
Data emit.: _______________
Rif. doc.:  _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PERFORMANCE YEAR-TO-DATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RIEPILOGO PERFORMANCE:
────────────────────────────────────────────────────────────────────
Metrica                        | Questo Mese | YTD       | Inception
────────────────────────────────────────────────────────────────────
Valore Portfolio Fine Wine     | €_________  | —         | —
Variazione Valore (€)          | €_________  | €________ | €________
Variazione Valore (%)          |    ___%     |   ___% YTD|   ___% tot.
Benchmark Liv-ex 1000 (%)      |    ___%     |   ___% YTD| —
Alpha vs Benchmark (pp)        |    ___pp    |   ___pp   | —
────────────────────────────────────────────────────────────────────

PERFORMANCE PER REGIONE (YTD):
────────────────────────────────────────────────────────────────────
Regione              | Val. Iniziale | Val. Corrente | P&L (€) | P&L (%)
────────────────────────────────────────────────────────────────────
Bordeaux             | €_________   | €_________    | €_____  |  ___%
Borgogna             | €_________   | €_________    | €_____  |  ___%
Champagne            | €_________   | €_________    | €_____  |  ___%
Italia               | €_________   | €_________    | €_____  |  ___%
Altra regione: ___   | €_________   | €_________    | €_____  |  ___%
────────────────────────────────────────────────────────────────────
TOTALE PORTFOLIO     | €_________   | €_________    | €_____  |  ___%
────────────────────────────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. MARKET UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INDICI DI MERCATO (variazione mensile):
────────────────────────────────────────────────────────────────────
Indice                   | Valore Corrente | Var. Mese | Var. YTD
────────────────────────────────────────────────────────────────────
Liv-ex Fine Wine 1000    |    ________     |   ____%   |   ____%
Liv-ex Bordeaux 500      |    ________     |   ____%   |   ____%
Liv-ex Burgundy 150      |    ________     |   ____%   |   ____%
Liv-ex Italy 100         |    ________     |   ____%   |   ____%
S&P 500 (benchmark EQ)   |    ________     |   ____%   |   ____%
EUR/GBP (impatto storage)|    ________     |   ____%   |   ____%
────────────────────────────────────────────────────────────────────

Commento mercato:
_______________________________________________
_______________________________________________
_______________________________________________

Notizie rilevanti del mese (en primeur, aste, rating):
• _______________________________________________
• _______________________________________________
• _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. PORTFOLIO HIGHLIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEST PERFORMER DEL MESE:
  Vino:         _______________________________________________
  Annata:       ___    Bottiglie detenute: ___
  Variazione:   +___% (da €___ a €___ / bottiglia)
  Motivazione: _______________________________________________

WORST PERFORMER DEL MESE:
  Vino:         _______________________________________________
  Annata:       ___    Bottiglie detenute: ___
  Variazione:   -___% (da €___ a €___ / bottiglia)
  Motivazione: _______________________________________________
  Azione:       □ Mantieni  □ Monitora  □ Considera uscita

AI ALERTS RICEVUTI NEL PERIODO:
  □ Nessun alert
  □ Alert ricevuti:
    1. Vino: _________________ — AI Score sceso a ___  — Azione: _______________
    2. Vino: _________________ — AI Score sceso a ___  — Azione: _______________
    3. Vino: _________________ — Prezzo -10% in 30gg   — Azione: _______________

OPERAZIONI EFFETTUATE NEL MESE:
  Acquisti:
    1. _______________ — Annata ___ — ___ bt — €___ / bt — Totale: €___
    2. _______________ — Annata ___ — ___ bt — €___ / bt — Totale: €___
  Vendite:
    1. _______________ — Annata ___ — ___ bt — €___ / bt — P&L realizzato: €___
    2. _______________ — Annata ___ — ___ bt — €___ / bt — P&L realizzato: €___
  Costi periodo (storage + assicurazione): €_______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. RACCOMANDAZIONI PER IL MESE SUCCESSIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Opportunità di acquisto identificate:
  1. _______________ — Rationale: _______________  — Budget: €___
  2. _______________ — Rationale: _______________  — Budget: €___

Posizioni da considerare per uscita:
  1. _______________ — Rationale: _______________  — Timing: ___
  2. _______________ — Rationale: _______________  — Timing: ___

Ribilanciamento necessario: □ No  □ Sì — descrizione: _______________
Obiettivo allocazione post-ribilanciamento:
  Bordeaux: ___%  Borgogna: ___%  Champagne: ___%  Italia: ___%  Altro: ___%

Prossima review: _______________
Eventuali scadenze/aste da calendario:
  • _______________________________________________
  • _______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. APPENDICE TECNICA — METRICHE DI RISCHIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metriche aggiornate al _______________ :
────────────────────────────────────────────────────────────────────
Metrica                        | Questo Mese | Mese Prec. | Target
────────────────────────────────────────────────────────────────────
Sharpe Ratio (rolling 12M)     |    ___      |    ___     | > 0.60
Volatilità annualizzata        |   ____%     |   ____%    | < 12%
VaR 95% (1 mese)               |  ___% / €__| ___% / €__ | < 5%
Max Drawdown (storico)         |   ____%     |   ____%    | < 15%
Beta vs Liv-ex 1000            |    ___      |    ___     | 0.8–1.2
Correlazione vs S&P 500        |    ___      |    ___     | < 0.25
HHI Concentrazione Regionale   |    ___      |    ___     | < 0.30
────────────────────────────────────────────────────────────────────

Formula reminder:
  Sharpe = (Rp - Rf) / σp
  VaR(95%, 1M) = Vp × (µ_mensile - 1.65 × σ_mensile)
  HHI = Σ(wi²)   con wi = peso regionale come frazione

Commento metriche:
_______________________________________________
_______________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Firma Advisor: _______________    Data: _______________

Documento riservato — uso esclusivo del destinatario.
I dati sono elaborati da VinoInvest Professional Platform.
I rendimenti passati non garantiscono rendimenti futuri.
Conservare per 10 anni ai sensi della normativa MiFID II.
`,
  },
  {
    id: "onboarding-checklist",
    title: "Checklist Onboarding Nuovo Cliente",
    description: "Piano operativo in 4 settimane per l'onboarding completo di un nuovo cliente fine wine: KYC/AML, suitability, proposta, primo acquisto e setup ongoing.",
    icon: "✅",
    tag: "Onboarding",
    filename: "onboarding-checklist-wine.txt",
    content: `CHECKLIST ONBOARDING NUOVO CLIENTE — FINE WINE INVESTMENT
VinoInvest Professional | Piano 4 Settimane
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Advisor:          _______________________________________________
Cliente:          _______________________________________________
Data inizio:      _______________    Target completamento: _______________
Segmento cliente: □ HNWI  □ UHNWI  □ Family Office  □ Corporate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETTIMANA 1 — KYC / AML / PROFILO DI RISCHIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Obiettivo: completare tutta la documentazione normativa prima di qualsiasi raccomandazione.

KYC / IDENTIFICAZIONE:
□ Documento d'identità in corso di validità ricevuto e verificato (CI/Passaporto)
  Data verifica: _______________   Verificato da: _______________
□ Codice fiscale / partita IVA acquisita
□ Indirizzo di residenza fiscale documentato (utenza / estratto conto)
□ Per persone giuridiche: visura camerale, statuto, procura del rappresentante
□ Screening PEP (Politically Exposed Person): □ Non PEP  □ PEP — procedura rafforzata attivata
□ Screening sanzioni internazionali (OFAC, EU sanctions list): □ Clear  □ Match — escalation

AML:
□ Dichiarazione origine dei fondi acquisita e coerente con profilo
  Fonte dichiarata: _______________________________________________
□ Suspicious Activity Report (SAR) necessario: □ No  □ Sì — ref: _______________
□ Verifica titolarità effettiva (per strutture societarie/trust): □ Completata  □ N/A
□ Soglie AML verificate (>€10k — identificazione; >€15k — approfondimento origine fondi)

SUITABILITY ASSESSMENT (MiFID II):
□ Questionario di adeguatezza compilato (ref. Template Suitability Assessment)
  Data compilazione: _______________
□ AUM dichiarato: €_______________
□ Profilo di rischio assegnato: □ Conservativo  □ Moderato  □ Crescita
□ Esito adeguatezza per fine wine: □ Adeguato  □ Non adeguato (blocco procedura)
□ Documento suitability firmato da cliente e advisor
□ Copia consegnata al cliente: □ Email  □ Cartaceo  □ Portale digitale

PROFILO COMPLETO CREATO SU PIATTAFORMA:
□ Account VinoInvest Professional creato per advisor
□ Profilo cliente inserito in piattaforma
□ Livello di accesso configurato: □ View only  □ Full access
□ Notifiche e alert configurati (email: ___________________)

Completamento Settimana 1: □ Sì — Data: ___   □ Parziale — Blocchi: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETTIMANA 2 — PRIMA CONSULENZA E EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Obiettivo: allineare il cliente sul mercato fine wine e stabilire le basi della strategia.

PRIMA CONSULENZA DI PORTFOLIO:
□ Incontro (in presenza / video call) effettuato — Durata: ___ min   Data: _______________
□ Presentazione piattaforma VinoInvest: funzionalità, AI Score, price history
□ Discussione obiettivi di lungo periodo confermata e documentata
□ Simulazione di portfolio proposta (strumento Risk Calculator Wine condiviso)
□ Domande aperte del cliente registrate:
  1. _______________________________________________
  2. _______________________________________________
□ Follow-up necessario: □ No  □ Sì — entro: _______________

WINE EDUCATION BRIEF:
□ Documento "Introduzione al Fine Wine come Asset Class" inviato
□ Spiegazione meccanismo Liv-ex: prezzo, liquidità, trading
□ Spiegazione en primeur: rischi, tempistiche, vantaggi di prezzo
□ Spiegazione storage bonded: costi, sicurezza, audit
□ Spiegazione Sharpe Ratio e VaR applicati al fine wine (Template Risk Calculator condiviso)
□ Punteggi critici spiegati: Parker/WA, Decanter, JR — come influenzano i prezzi
□ Costi totali del ciclo di investimento presentati chiaramente:
  Acquisto: ____%   Storage: ___% p.a.   Assicurazione: ____%   Vendita: ____%
□ Documento di educazione firmato dal cliente per ricevuta: □ Sì  □ No

STORAGE SETUP (pre-autorizzazione):
□ Provider di stoccaggio discusso: □ London City Bond  □ Octavian  □ Crown  □ Altro: ___
□ Regime preferito: □ Bonded  □ Duty-paid
□ Cliente informato sui costi di storage: £___/cassa/anno

Completamento Settimana 2: □ Sì — Data: ___   □ Parziale — Blocchi: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETTIMANA 3 — PRESENTAZIONE PROPOSTA DI INVESTIMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Obiettivo: presentare e far approvare la proposta formale.

PREPARAZIONE:
□ Investment Proposal redatta (ref. Template Investment Proposal Wine)
  Allocazione proposta: ___% = €_______________
□ Top 5 vini selezionati con AI Score VinoInvest > 82 — confermati
□ Risk Calculator compilato con dati reali del portfolio proposto
□ Due Diligence completata sui vini proposti (ref. Template Due Diligence Fine Wine)
□ Proposta revisionata dal compliance officer interno: □ Sì  □ N/A

PRESENTAZIONE AL CLIENTE:
□ Incontro di presentazione effettuato — Data: _______________
□ Executive Summary illustrato (3 punti chiave)
□ Tabella di allocazione per regione presentata e spiegata
□ Selezione vini con rationale spiegata (AI Score + fondamentali)
□ Risk Management e VaR illustrati in modo accessibile
□ Disclaimer MiFID II letto e sottoscritto dal cliente
□ Domande post-presentazione del cliente:
  1. _______________________________________________
  2. _______________________________________________
□ Richieste di modifica alla proposta: □ No  □ Sì — dettagli: _______________

APPROVAZIONE:
□ Investment Proposal firmata dal cliente: □ Sì  □ In attesa — scadenza: _______________
□ Investment Proposal firmata dall'advisor: □ Sì
□ Copia depositata nel dossier cliente: □ Sì

Completamento Settimana 3: □ Sì — Data: ___   □ Parziale — Blocchi: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETTIMANA 4 — PRIMO ACQUISTO E SETUP OPERATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Obiettivo: eseguire il primo acquisto e configurare tutti i servizi ongoing.

ESECUZIONE PRIMO ACQUISTO:
□ Ordine di acquisto autorizzato dal cliente (scrittura): □ Sì — data: _______________
□ Due Diligence pre-acquisto completata per ogni lotto (ref. Template Due Diligence)
□ Acquisto n. 1: _______________ — Annata ___ — ___ bt — €___ tot.
□ Acquisto n. 2: _______________ — Annata ___ — ___ bt — €___ tot.
□ Acquisto n. 3: _______________ — Annata ___ — ___ bt — €___ tot.
□ Invoice ufficiali ricevute e archiviate: □ Sì
□ Conferma avvenuto trasferimento a magazzino bonded: □ Sì — data: _______________
□ Certificato di custodia magazzino ricevuto: □ Sì
□ Polizza assicurativa attivata sul lotto: □ Sì — compagnia: ___  valore: €___

SETUP REPORTING MENSILE:
□ Cadenza report mensile concordata: primo ___ del mese
□ Formato report concordato: □ Email PDF  □ Portale VinoInvest  □ Entrambi
□ Template Report Mensile personalizzato con brand advisor: □ Sì  □ No
□ Primo report mensile schedulato per: _______________

SETUP ALERT E NOTIFICHE (VinoInvest Platform):
□ Alert AI Score < 70 attivato per tutti i vini in portfolio: □ Sì
□ Alert variazione prezzo > -10% in 30 giorni: □ Sì
□ Alert Liv-ex indice regionale -8% YTD: □ Sì
□ Alert scadenza assicurazione (90 giorni prima): □ Sì
□ Email notifiche impostata: _______________________________________________
□ Frequenza digest: □ In tempo reale  □ Giornaliero  □ Settimanale

DOCUMENTAZIONE FINALE:
□ Dossier cliente completo archiviato (KYC + AML + Suitability + Proposal + DD + Invoice)
□ Registro interno clienti aggiornato
□ Prossima review suitability programmata (ogni 12 mesi): _______________
□ Data anniversary review portfolio: _______________

Completamento Settimana 4: □ Sì — Data: ___   □ Parziale — Blocchi: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ONGOING — SERVIZIO CONTINUATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pianificazione mensile:
□ Report mensile inviato entro il ___ del mese
□ Call di aggiornamento: □ Mensile  □ Trimestrale  □ Su richiesta
□ Proposta di acquisto opportunistico se AI Score > 88 su vino non in portfolio

Pianificazione annuale:
□ Revisione suitability annuale (obbligo MiFID II): _______________
□ Revisione dell'Investment Proposal e strategia: _______________
□ Audit del magazzino / verifica fisica del lotto: _______________
□ Revisione copertura assicurativa: _______________
□ Report fiscale annuale (P&L realizzati e non realizzati): _______________

Note advisor:
_______________________________________________
_______________________________________________

ONBOARDING COMPLETATO: □ Sì — Data: _______________
Firma Advisor: _______________    Firma Cliente (ricevuta): _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Documento ad uso interno. Conservare nel dossier cliente.
VinoInvest Professional Platform | ${SITE_HOST}
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
