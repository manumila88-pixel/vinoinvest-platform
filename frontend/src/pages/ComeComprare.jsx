import React, { useState } from "react";
import { Link } from "react-router-dom";

const PLATFORMS = [
  {
    name: "Wine-Searcher",
    logo: "🔍",
    url: "https://www.wine-searcher.com",
    specialty: "Confronto prezzi globale",
    bestFor: "Trovare il prezzo migliore su migliaia di merchant",
    pros: ["Prezzi aggregati da 70.000+ merchant", "Gratuito con account basic", "Storico prezzi disponibile"],
    cons: ["Non vende direttamente", "I prezzi includono IVA variabile per paese"],
    avgFees: "Gratuito",
    color: "#e53e3e",
  },
  {
    name: "Vivino",
    logo: "📱",
    url: "https://www.vivino.com",
    specialty: "Community + recensioni",
    bestFor: "Leggere recensioni reali e acquistare bottiglie entry-level",
    pros: ["App mobile eccellente", "Milioni di recensioni utenti", "Prezzi competitivi per vini popolari"],
    cons: ["Limitato per fine wine da investimento", "Non ideale per vini rari"],
    avgFees: "0% (prezzi fissi merchant)",
    color: "#9f2b68",
  },
  {
    name: "Tannico",
    logo: "🇮🇹",
    url: "https://www.tannico.it",
    specialty: "Vino italiano premium",
    bestFor: "Barolo, Brunello, Supertoscani e vini italiani di qualità",
    pros: ["Migliore selezione italiana", "Spedizione veloce in Italia", "Programma loyalty"],
    cons: ["Selezione internazionale limitata", "Prezzi retail (non scontati)"],
    avgFees: "Spedizione da €6.90",
    color: "#c0392b",
  },
  {
    name: "Millesima",
    logo: "🇫🇷",
    url: "https://www.millesima.it",
    specialty: "Bordeaux e vini francesi",
    bestFor: "En primeur Bordeaux, Borgogna, Champagne millesimato",
    pros: ["Leader mondiale en primeur", "Storage professionale in bonded warehouse", "Ampia selezione francese"],
    cons: ["Prezzi premium", "Selezione italiana limitata"],
    avgFees: "Spedizione da €15",
    color: "#1a237e",
  },
  {
    name: "Idealwine",
    logo: "🏛️",
    url: "https://www.idealwine.com",
    specialty: "Aste online",
    bestFor: "Vini rari e vintage, acquisto e vendita all'asta",
    pros: ["Autenticità garantita", "Ottimo per vini rari", "Aste ogni settimana"],
    cons: ["Commissioni acquirente 21-24%", "Tempi asta lunghi"],
    avgFees: "21% acquirente + 15% venditore",
    color: "#4a148c",
  },
  {
    name: "Berry Bros & Rudd",
    logo: "🇬🇧",
    url: "https://www.bbr.com",
    specialty: "Fine wine tradizionale UK",
    bestFor: "Bordeaux premier cru, Borgogna, storage in bonded warehouse UK",
    pros: ["300 anni di storia", "Bonded warehouse UK", "Selezione eccezionale"],
    cons: ["Prezzi UK con cambio EUR/GBP", "Orientato mercato inglese"],
    avgFees: "Spedizione da £25",
    color: "#1b5e20",
  },
  {
    name: "Wine Owners",
    logo: "📊",
    url: "https://www.wineowners.com",
    specialty: "Portfolio management",
    bestFor: "Gestire e vendere il tuo portfolio di fine wine",
    pros: ["Valutazione portfolio automatica", "Piattaforma di vendita P2P", "Interfaccia professionale"],
    cons: ["Fee di gestione annuale", "Mercato più piccolo di Liv-ex"],
    avgFees: "£60/anno + commissione vendita",
    color: "#0d47a1",
  },
];

const STEPS = [
  {
    n: 1,
    icon: "🔍",
    title: "Cerca su VinoInvest",
    desc: "Usa il catalogo 50.000+ vini con AI Score, storico prezzi e analisi fondamentale. Trova i vini con il miglior potenziale.",
    cta: "Vai al catalogo",
    href: "/?tab=market",
  },
  {
    n: 2,
    icon: "📊",
    title: "Analizza con i dati",
    desc: "Leggi il grafico storico prezzi, controlla l'AI Score (0-100), verifica il market trend e il risk rating per ogni vino.",
    cta: "Come funziona l'AI Score",
    href: "/metodologia",
  },
  {
    n: 3,
    icon: "💰",
    title: "Confronta i prezzi",
    desc: "Clicca 'Dove comprare' sulla card del vino: vedi prezzi in tempo reale su 7 piattaforme diverse. Scegli il prezzo migliore.",
    cta: "Inizia gratis",
    href: "/?tab=market",
  },
  {
    n: 4,
    icon: "🛒",
    title: "Compra sulla piattaforma scelta",
    desc: "Vai direttamente sul merchant selezionato e completa l'acquisto. VinoInvest ti mostra dove comprare, non vende direttamente.",
    cta: "Guida alle piattaforme",
    href: "/academy/course/guida-piattaforme",
  },
  {
    n: 5,
    icon: "📁",
    title: "Aggiungi al portfolio",
    desc: "Torna su VinoInvest e aggiungi il vino acquistato al tuo portfolio manualmente. Traccia il valore nel tempo.",
    cta: "Apri il portfolio",
    href: "/?tab=portfolio",
  },
];

const FAQ = [
  {
    q: "VinoInvest vende vino direttamente?",
    a: "No. VinoInvest è una piattaforma di analisi e monitoraggio. Ti aiutiamo a trovare i vini migliori, confrontare i prezzi e gestire il tuo portfolio. L'acquisto avviene sempre su merchant certificati esterni.",
  },
  {
    q: "Come faccio a sapere se il prezzo è buono?",
    a: "Confronta il prezzo attuale con il grafico storico su VinoInvest. Se il prezzo corrente è sotto la media storica degli ultimi 12 mesi e l'AI Score è alto, è generalmente un buon momento per comprare.",
  },
  {
    q: "Devo pagare per usare VinoInvest?",
    a: "Il catalogo base, la ricerca vini e la comparazione prezzi sono gratuiti. Le funzionalità avanzate (portfolio tracker, alert prezzi, AI Score completo) sono disponibili con il piano Investor da €9.99/mese.",
  },
  {
    q: "Come aggiungo un vino al portfolio se non lo compro da VinoInvest?",
    a: "Dal menu Portfolio → 'Aggiungi manualmente': inserisci nome vino, quantità, prezzo pagato e data acquisto. VinoInvest aggiornerà automaticamente il valore di mercato giornalmente.",
  },
  {
    q: "In futuro sarà possibile comprare direttamente da VinoInvest?",
    a: "Sì, è nella roadmap. Stiamo lavorando a integrazione API con i principali merchant per aggiornare il portfolio automaticamente dopo l'acquisto. Previsto entro fine 2026.",
  },
];

export default function ComeComprare() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("come-funziona");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #0b1220)", color: "var(--text, #e2e8f0)", fontFamily: "system-ui, sans-serif" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0b1220 0%, #1a2744 100%)", padding: "60px 24px 40px", textAlign: "center", borderBottom: "1px solid #1e3050" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "#C9A22722", color: "#C9A227", border: "1px solid #C9A22744", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
            GUIDA ALL'ACQUISTO
          </span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
            Come comprare vino da investimento
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 28px" }}>
            VinoInvest è una piattaforma di <strong style={{ color: "#C9A227" }}>analisi e monitoraggio</strong>. Non vendiamo vino direttamente.
            Ecco come funziona il processo completo — dalla ricerca all'acquisto al tracking del portfolio.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/?tab=market" style={{ background: "#C9A227", color: "#0b1220", padding: "12px 24px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
              Inizia gratis
            </Link>
            <Link to="/academy/course/guida-piattaforme" style={{ background: "transparent", color: "#C9A227", border: "1px solid #C9A22766", padding: "12px 24px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 15 }}>
              Corso gratuito
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #1e3050", marginBottom: 32 }}>
          {[
            { id: "come-funziona", label: "Come funziona" },
            { id: "piattaforme", label: "Le piattaforme" },
            { id: "faq", label: "FAQ" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
              color: activeTab === t.id ? "#C9A227" : "#64748b",
              borderBottom: activeTab === t.id ? "2px solid #C9A227" : "2px solid transparent",
              fontWeight: activeTab === t.id ? 700 : 500, fontSize: 15, transition: "all .2s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Come funziona */}
        {activeTab === "come-funziona" && (
          <div>
            {/* Disclaimer box */}
            <div style={{ background: "#C9A22711", border: "1px solid #C9A22744", borderRadius: 12, padding: "20px 24px", marginBottom: 40, display: "flex", gap: 16 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <div>
                <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#C9A227" }}>VinoInvest è una piattaforma di analisi</p>
                <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.6, fontSize: 15 }}>
                  Non vendiamo vino, non siamo un merchant, non gestiamo pagamenti per l'acquisto di bottiglie fisiche.
                  Siamo lo strumento che ti aiuta a <strong style={{ color: "#e2e8f0" }}>decidere cosa comprare</strong>,
                  dove trovare il prezzo migliore e come tracciare nel tempo il tuo portfolio.
                </p>
              </div>
            </div>

            {/* Steps */}
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 24 }}>Come funziona il processo</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEPS.map((step, i) => (
                <div key={step.n} style={{ display: "flex", gap: 20, paddingBottom: i < STEPS.length - 1 ? 0 : 0 }}>
                  {/* Line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#C9A22722", border: "2px solid #C9A22766", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {step.icon}
                    </div>
                    {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: "#1e3050", minHeight: 32, margin: "4px 0" }} />}
                  </div>
                  <div style={{ paddingBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#C9A227", fontWeight: 700, letterSpacing: 1 }}>PASSO {step.n}</span>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#e2e8f0" }}>{step.title}</h3>
                    </div>
                    <p style={{ margin: "0 0 10px", color: "#94a3b8", lineHeight: 1.6, fontSize: 15 }}>{step.desc}</p>
                    <Link to={step.href} style={{ color: "#C9A227", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                      {step.cta} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Future roadmap */}
            <div style={{ background: "#0d1f3a", border: "1px solid #1e3050", borderRadius: 12, padding: "24px", marginTop: 16 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 700, color: "#60a5fa" }}>In futuro: integrazione diretta</h3>
              <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.6, fontSize: 15 }}>
                Stiamo sviluppando un sistema di integrazione diretta con i principali merchant: dopo l'acquisto su Tannico o Millesima,
                il tuo portfolio su VinoInvest si aggiornerà automaticamente. Previsto entro fine 2026.
                <br /><br />
                <strong style={{ color: "#e2e8f0" }}>Nel frattempo:</strong> aggiungi i tuoi acquisti manualmente dal Portfolio → Aggiungi vino.
                Il sistema aggiorna il valore di mercato ogni giorno automaticamente.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Piattaforme */}
        {activeTab === "piattaforme" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Le 7 piattaforme consigliate</h2>
            <p style={{ color: "#64748b", marginBottom: 28, fontSize: 15 }}>
              Confronto aggiornato a giugno 2026. I prezzi dei vini variano — usa sempre Wine-Searcher per confrontare prima di comprare.
            </p>
            <div style={{ display: "grid", gap: 16 }}>
              {PLATFORMS.map(p => (
                <div key={p.name} style={{ background: "#0d1f3a", border: "1px solid #1e3050", borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 10, background: p.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                      {p.logo}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{p.name}</h3>
                        <span style={{ fontSize: 12, background: p.color + "22", color: p.color, border: `1px solid ${p.color}44`, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                          {p.specialty}
                        </span>
                      </div>
                      <p style={{ margin: "0 0 12px", color: "#94a3b8", fontSize: 14 }}>
                        <strong style={{ color: "#e2e8f0" }}>Meglio per:</strong> {p.bestFor}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                        <div>
                          <p style={{ margin: "0 0 6px", color: "#4ade80", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Punti di forza</p>
                          {p.pros.map((pro, i) => <p key={i} style={{ margin: "0 0 3px", color: "#94a3b8" }}>✓ {pro}</p>)}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 6px", color: "#f87171", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Limiti</p>
                          {p.cons.map((con, i) => <p key={i} style={{ margin: "0 0 3px", color: "#94a3b8" }}>✗ {con}</p>)}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "#64748b" }}>
                          <strong style={{ color: "#94a3b8" }}>Commissioni:</strong> {p.avgFees}
                        </span>
                        <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
                          background: p.color + "22", color: p.color, border: `1px solid ${p.color}44`,
                          padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none",
                        }}>
                          Visita {p.name} →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: "16px 20px", background: "#C9A22711", borderRadius: 10, border: "1px solid #C9A22733" }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>
                <strong style={{ color: "#C9A227" }}>Consiglio VinoInvest:</strong> Prima di comprare ovunque, controlla il prezzo su <strong style={{ color: "#e2e8f0" }}>Wine-Searcher</strong> (gratuito) per vedere la range di prezzi su centinaia di merchant. Poi confronta con il grafico storico prezzi su VinoInvest.
                <Link to="/academy/course/guida-piattaforme" style={{ color: "#C9A227", marginLeft: 8 }}>
                  Segui il corso gratuito sulle piattaforme →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Tab: FAQ */}
        {activeTab === "faq" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 24 }}>Domande frequenti</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {FAQ.map((item, i) => (
                <div key={i} style={{ border: "1px solid #1e3050", borderRadius: 10, overflow: "hidden", background: "#0d1f3a" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left" }}
                  >
                    <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 16 }}>{item.q}</span>
                    <span style={{ color: "#C9A227", fontSize: 18, transition: "transform .2s", transform: openFaq === i ? "rotate(180deg)" : "none", flexShrink: 0 }}>▼</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 20px 18px", color: "#94a3b8", lineHeight: 1.7, fontSize: 15 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA bottom */}
        <div style={{ margin: "48px 0", background: "linear-gradient(135deg, #0d1f3a 0%, #1a2744 100%)", border: "1px solid #C9A22744", borderRadius: 16, padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
            Pronto ad iniziare?
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16, margin: "0 0 24px", lineHeight: 1.6 }}>
            Cerca i tuoi primi vini, analizza i dati, scopri dove comprare al prezzo migliore.
            Account gratuito, nessuna carta di credito richiesta.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/?tab=market" style={{ background: "#C9A227", color: "#0b1220", padding: "13px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>
              Esplora il catalogo
            </Link>
            <Link to="/academy/course/guida-piattaforme" style={{ background: "transparent", color: "#e2e8f0", border: "1px solid #1e3050", padding: "13px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              Corso gratuito: piattaforme
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
