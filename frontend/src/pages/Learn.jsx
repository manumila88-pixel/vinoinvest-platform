import React, { useState } from "react";

const LESSONS = [
  {
    id: 1, title: "Perché investire nel vino?", icon: "🍷", duration: "5 min",
    content: `Il vino fine è una delle asset class alternative con le performance più costanti. Il Knight Frank Luxury Investment Index mostra rendimenti medi del 10-12% annuo negli ultimi 10 anni.

**Vantaggi principali:**
- Bassa correlazione con i mercati azionari (resiliente nelle crisi)
- Asset fisico: non può andare a zero come un'azione
- Valore intrinseco che aumenta con l'invecchiamento
- Mercato liquido: Wine-Searcher aggrega 10M+ offerte
- Diversificazione geografica: Bordeaux, Borgogna, Toscana, Champagne

**Rischi da considerare:**
- Conservazione richiede condizioni controllate (12-15°C, 70% umidità)
- Mercato meno regolamentato dei mercati finanziari tradizionali
- Falsificazioni: sempre verificare provenienza e certificati
- Liquidità variabile per vini meno noti`,
  },
  {
    id: 2, title: "Come funziona il mercato", icon: "📈", duration: "8 min",
    content: `Il mercato del fine wine opera su diversi livelli:

**Mercato primario (en primeur):**
I vini di Bordeaux vengono venduti ancora in botte a prezzi scontati. Il prezzo finale dipenderà da qualità dell'annata e critica professionale.

**Mercato secondario:**
- **Case d'aste**: Sotheby's, Christie's, Acker — per i collezionisti premium
- **Piattaforme online**: Wine-Searcher (aggregatore), Vivino (consumer), Idealwine (aste)
- **Negociants/merchants**: Millesima, Tannico, Callmewine

**Indici di mercato:**
- **Liv-ex Fine Wine 100**: i 100 vini più scambiati al mondo
- **Liv-ex Bordeaux 500**: focus su Bordeaux
- **VinoInvest Index (VII)**: basato sui vini più seguiti sulla piattaforma

**Prezzi medi storici:**
Château Petrus 2015: €5.000/bt → €8.500/bt in 5 anni (+70%)
Barolo Monfortino 2010: €400/bt → €850/bt in 8 anni (+112%)
Dom Pérignon 2012: €180/bt → €240/bt in 4 anni (+33%)`,
  },
  {
    id: 3, title: "Come leggere l'AI Score", icon: "🤖", duration: "6 min",
    content: `L'AI Score di VinoInvest è un punteggio 0-100 che valuta il potenziale di investimento di ogni vino.

**Componenti del punteggio:**

| Fattore | Peso | Descrizione |
|---------|------|-------------|
| Rating critico | 30% | James Suckling, Jancis Robinson, Parker |
| Qualità annata | 25% | Dati climatici Open-Meteo + storico |
| Produttore | 20% | Reputazione, consistenza, rarità |
| Trend mercato | 15% | Movimento prezzi ultimi 12 mesi |
| Rischio | 10% | Volatilità, liquidità, storage |

**Interpretazione:**
- **90-100**: Eccezionale — Strong Buy
- **80-89**: Ottimo — Buy
- **70-79**: Buono — Buy moderato
- **60-69**: Discreto — Hold
- **50-59**: Neutro — Watch
- **<50**: Speculativo — Sell/Avoid

**Segnali di trading:**
🟢 **Strong Buy**: confluenza di tutti i fattori positivi
🔵 **Buy**: fondamentali solidi, trend favorevole
🟡 **Hold**: mantieni, aspetta catalizzatori
🔴 **Sell**: uscire dalla posizione`,
  },
  {
    id: 4, title: "I vini di investimento top", icon: "🏆", duration: "10 min",
    content: `**TIER 1 — Blue Chip (€2.000-€50.000+ a bottiglia)**

*Bordeaux 5 Premiers Crus:*
- Château Pétrus (Pomerol) — il più costoso, 100% Merlot
- Château Lafite Rothschild — preferred dai collezionisti asiatici
- Château Margaux — il più elegante, spesso il migliore dei 5
- Château Mouton Rothschild — unico premier cru promosso nel 1973
- Château Haut-Brion — il più antico, terroir unico di Pessac

*Borgogna DRC:*
- Romanée-Conti — il vino più costoso al mondo (~€30.000/bt)
- La Tâche, Richebourg, Romanée-Saint-Vivant
- Riserva: acquistare all'en primeur se possibile

**TIER 2 — Premium (€200-€2.000)**
- Barolo: Giacomo Conterno Monfortino, Gaja Barbaresco
- Toscana: Sassicaia, Ornellaia, Masseto
- Borgogna: Rousseau, Leroy, Ponsot
- Champagne: Krug, Louis Roederer Cristal, Dom Pérignon

**TIER 3 — Investimento accessibile (€50-€200)**
- Barolo e Barbaresco da piccoli produttori di qualità
- Côtes du Rhône Hermitage, Châteauneuf-du-Pape
- Vini spagnoli: Vega Sicilia Único, Pingus
- Toscana: Brunello di Montalcino DOCG

**Regola d'oro:** Acquista solo quello che beresti, così anche nel peggior scenario hai una bella bottiglia.`,
  },
  {
    id: 5, title: "Costruire un portfolio vino", icon: "💼", duration: "8 min",
    content: `**Principio di diversificazione:**

Un portfolio vino ben costruito dovrebbe coprire:
- 3+ regioni diverse (riduce rischio geografico)
- 3+ annate diverse (riduce rischio annata)
- Mix di liquidità: 60% vini blue chip + 40% emerging

**Esempio portfolio €10.000:**

| Vino | Bottiglie | Prezzo/bt | Totale | Categoria |
|------|-----------|-----------|--------|-----------|
| Château Léoville Barton 2018 | 3 | €120 | €360 | Blue chip |
| Barolo Brunate Rinaldi 2019 | 6 | €80 | €480 | Premium |
| Brunello Montalcino Cerbaiona 2016 | 3 | €150 | €450 | Premium |
| Burgundy Village Leroy 2020 | 6 | €120 | €720 | Premium |
| Dom Pérignon 2015 | 3 | €220 | €660 | Champagne |

Totale: €2.670 → restante per opportunità

**Regole di gestione:**
1. Non vendere prima di 5 anni per vini top
2. Controlla l'inventory con VinoInvest ogni trimestre
3. Assicura la cantina (stimata 0.5-1% del valore annuo)
4. Considera stoccaggio professionale se >€50.000
5. Mantieni documentazione: fatture, provenance, foto

**Uscita dall'investimento:**
- Aste: per vini >€500/bt (minor spread)
- Merchant: per volumi medi (velocità)
- Wine-Searcher: per verificare il miglior prezzo attuale`,
  },
  {
    id: 6, title: "Conservazione e storage", icon: "🏚️", duration: "6 min",
    content: `**La conservazione è fondamentale** — un vino mal conservato perde tutto il suo valore.

**Condizioni ideali:**
- 🌡️ Temperatura: 12-15°C costante (mai sopra 20°C)
- 💧 Umidità: 65-75% (protezione tappo di sughero)
- 🌑 Buio: niente luce UV (danneggiano i polifenoli)
- 🔇 Silenzio: zero vibrazioni (alterano sedimento)
- 🍾 Orizzontale: il tappo deve essere bagnato

**Opzioni di storage:**

*Home cellar:*
Pro: controllo totale, costo zero
Contro: dipendente da clima, non ottimale per tutti

*Cantinetta elettrica:*
Costo: €200-€2.000
Capacità: 20-200 bottiglie
Adatta per: investitori <€20.000 portfolio

*Storage professionale:*
Costo: €10-30/cassa/anno
Servizi: temperatura garantita, assicurazione, inventario
Consigliato per: >50 bottiglie di valore

*Stoccaggio bonded warehouse UK:*
Vantaggio fiscale: no IVA fino alla vendita
Richiesto da: Liv-ex e case d'aste top

**Certificato di provenienza:**
Quando acquisti, conserva sempre:
- Fattura originale di acquisto
- Foto dell'imballaggio ricevuto
- Foto etichetta e capsula
- Documentazione temperature di trasporto`,
  },
  {
    id: 7, title: "Annate migliori per regione", icon: "📅", duration: "5 min",
    content: `**Bordeaux — Millésimes eccezionali:**
2000, 2005, 2009, 2010, 2015, 2016, 2019, 2020, 2022

**Da evitare:** 1997, 2002, 2007, 2013

**Borgogna:**
2005, 2010, 2012, 2015, 2019, 2020 (bilanciato)
2022 = considerata eccezionale dai critici

**Champagne:**
2002, 2008, 2012, 2015 = più cercate dai collezionisti
Cuvée millesimata: solo nelle annate migliori

**Barolo/Barbaresco:**
2010, 2013, 2016, 2019 = top assoluti
2015 = caldo ma elegante
2022 = molto promettente

**Brunello di Montalcino:**
2010, 2012, 2015, 2016, 2019 = eccezionali
Annate >5 anni migliori per investimento

**Napa Valley (Cabernet):**
2013, 2016, 2018, 2019 = top californiani

**Rioja (Tempranillo):**
2004, 2010, 2016, 2020 = investimento sicuro
Vega Sicilia Único: cerca annate 1994, 1999, 2004

📊 Per score climatici basati su dati reali Open-Meteo, usa il filtro "Annata" in VinoInvest.`,
  },
  {
    id: 8, title: "Glossario essenziale", icon: "📖", duration: "4 min",
    content: `**A**
- **AOC/AOP**: Appellation d'Origine Contrôlée — denominazione geografica francese
- **Assemblage**: blend di più vitigni o parcelle

**B**
- **Biodynamic**: viticoltura biodinamica secondo il calendario lunare
- **Brix**: misura della concentrazione zuccherina delle uve

**C**
- **Château**: tenuta vitivinicola bordolese
- **Cuvée**: selezione o blend specifico di un produttore

**D**
- **DOC/DOCG**: denominazione italiana, DOCG = massima garanzia qualità
- **DRC**: Domaine de la Romanée-Conti

**E**
- **En primeur**: acquisto vino ancora in botte, ~18 mesi prima dell'imbottigliamento

**G**
- **Grand Cru**: classificazione di eccellenza in Borgogna e Bordeaux

**L**
- **Liv-ex**: London International Vintners Exchange — principale borsa fine wine

**M**
- **Magnum**: formato 1,5L (= 2 bottiglie standard) — preferito dai collezionisti
- **Millésime**: annata (francese)

**N**
- **Négociant**: intermediario che acquista, eleva e commercializza vini

**P**
- **Parker points**: punteggio 100/100 creato da Robert Parker
- **Provenance**: documentazione della catena di custodia del vino

**R**
- **Reserva**: in Spagna, invecchiamento minimo garantito
- **ROI**: Return on Investment = (valore finale - prezzo acquisto) / prezzo acquisto

**T**
- **Terroir**: insieme di suolo, microclima, esposizione che caratterizza un vigneto

**V**
- **VdP/IGP**: vino da tavola con indicazione geografica (categoria inferiore)
- **Vintage chart**: guida alle migliori annate per regione`,
  },
];

export default function Learn() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vino_lessons_v1") || "[]"); } catch { return []; }
  });

  function markComplete(id) {
    const updated = [...new Set([...completed, id])];
    setCompleted(updated);
    localStorage.setItem("vino_lessons_v1", JSON.stringify(updated));
  }

  const lesson = LESSONS.find(l => l.id === activeLesson);
  const progress = Math.round((completed.length / LESSONS.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#060d1a", padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#C9A227", fontSize: 32, fontWeight: 900, margin: "0 0 8px" }}>
          🎓 Wine Investment Academy
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Impara a investire nel vino come un professionista. {LESSONS.length} lezioni gratuite.
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 6, background: "rgba(30,41,59,0.6)", borderRadius: 3 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #C9A227, #4ade80)", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <span style={{ color: "#94a3b8", fontSize: 12, flexShrink: 0 }}>{completed.length}/{LESSONS.length} completate</span>
        </div>
      </div>

      {activeLesson ? (
        /* Lesson view */
        <div>
          <button onClick={() => setActiveLesson(null)} style={{ background: "none", border: "1px solid rgba(30,41,59,0.6)", color: "#94a3b8", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, marginBottom: 24, fontFamily: "inherit" }}>
            ← Torna alle lezioni
          </button>
          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 16, padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <span style={{ fontSize: 40 }}>{lesson.icon}</span>
                <h2 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 800, margin: "8px 0 4px" }}>{lesson.title}</h2>
                <span style={{ color: "#64748b", fontSize: 12 }}>⏱ {lesson.duration}</span>
              </div>
              {!completed.includes(lesson.id) && (
                <button onClick={() => markComplete(lesson.id)} style={{ background: "linear-gradient(135deg, #C9A227, #a37e1a)", color: "#0a0f1e", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                  ✓ Completa lezione
                </button>
              )}
              {completed.includes(lesson.id) && (
                <span style={{ color: "#4ade80", fontSize: 12 }}>✓ Completata</span>
              )}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {lesson.content.split("\n").map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={i} style={{ color: "#e2e8f0", fontWeight: 700, marginTop: 16, marginBottom: 4 }}>{line.replace(/\*\*/g, "")}</p>;
                }
                if (line.startsWith("- ")) {
                  return <p key={i} style={{ paddingLeft: 16, marginBottom: 4 }}>• {line.slice(2)}</p>;
                }
                if (line.startsWith("|")) {
                  return <p key={i} style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b", marginBottom: 2 }}>{line}</p>;
                }
                return line ? <p key={i} style={{ marginBottom: 8 }}>{line.replace(/\*\*/g, "")}</p> : <br key={i} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Lesson grid */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {LESSONS.map(l => {
            const done = completed.includes(l.id);
            return (
              <div
                key={l.id}
                onClick={() => setActiveLesson(l.id)}
                style={{
                  background: done ? "rgba(74,222,128,0.05)" : "rgba(15,23,42,0.8)",
                  border: done ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(30,41,59,0.5)",
                  borderRadius: 14, padding: "20px 18px", cursor: "pointer",
                  transition: "all 0.2s", position: "relative",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A227"}
                onMouseLeave={e => e.currentTarget.style.borderColor = done ? "rgba(74,222,128,0.3)" : "rgba(30,41,59,0.5)"}
              >
                {done && <span style={{ position: "absolute", top: 12, right: 12, color: "#4ade80", fontSize: 14 }}>✓</span>}
                <div style={{ fontSize: 32, marginBottom: 10 }}>{l.icon}</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 6 }}>Lezione {l.id} · {l.duration}</div>
                <h3 style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{l.title}</h3>
              </div>
            );
          })}
        </div>
      )}

      {!activeLesson && completed.length === LESSONS.length && (
        <div style={{ marginTop: 32, textAlign: "center", padding: 24, background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
          <h2 style={{ color: "#4ade80", fontSize: 22, fontWeight: 800 }}>Corso completato!</h2>
          <p style={{ color: "#64748b" }}>Hai completato tutti i moduli dell'Academy. Sei pronto a investire come un professionista.</p>
        </div>
      )}
    </div>
  );
}
