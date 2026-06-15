import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Slugs and titles from BLOG_POSTS in backend/src/data/blogPosts.js
const ARTICLES = [
  { slug: "come-investire-in-vino-2026", title: "Come Investire in Vino nel 2026: Guida Completa", category: "Guida", readTime: "8 min" },
  { slug: "barolo-2021-annata-eccezionale", title: "Barolo 2021: Perché Questa Annata Vale il Doppio", category: "Analisi", readTime: "5 min" },
  { slug: "bordeaux-vs-borgogna-2026", title: "Bordeaux vs Borgogna: Quale Investe Meglio nel 2026?", category: "Analisi", readTime: "6 min" },
  { slug: "tasse-vino-investimento-italia-art-67-tuir", title: "Art. 67 TUIR: Guida Completa per Collezionisti Italiani", category: "Fiscalità", readTime: "7 min" },
  { slug: "ai-score-vinoinvest-come-funziona", title: "AI Score VinoInvest: Come Funziona e Come Usarlo", category: "Guida", readTime: "5 min" },
  { slug: "iva-acquisto-vino-investimento", title: "IVA sull'Acquisto di Vino da Investimento: Tutto quello che devi sapere", category: "Fiscalità", readTime: "6 min" },
  { slug: "dichiarazione-proventi-vendita-vino", title: "Come Dichiarare i Proventi dalla Vendita di Vino", category: "Fiscalità", readTime: "6 min" },
  { slug: "confronto-fiscale-paesi-vino-investimento", title: "Differenze Fiscali: Italia vs UK vs Francia vs Svizzera per Wine Investment", category: "Fiscalità", readTime: "7 min" },
  { slug: "trust-holding-vino-vantaggi-fiscali", title: "Trust e Holding per Collezioni di Vino: Vantaggi Fiscali", category: "Fiscalità", readTime: "6 min" },
  { slug: "vino-eredita-successione-donazione", title: "Vino in Eredità: Successione, Donazione e Imposta", category: "Fiscalità", readTime: "5 min" },
  { slug: "wine-tax-europa-ottimizzazione-fiscale", title: "Wine Tax in Europa: Come Ottimizzare Legalmente il Carico Fiscale", category: "Fiscalità", readTime: "6 min" },
  { slug: "dichiarazione-rw-vino-estero-monitoraggio-fiscale", title: "Dichiarazione RW e Monitoraggio Fiscale del Vino all'Estero", category: "Fiscalità", readTime: "6 min" },
  { slug: "tassazione-wine-fund-italia", title: "Tassazione dei Wine Fund in Italia: Cosa Devi Sapere", category: "Fiscalità", readTime: "5 min" },
  { slug: "deduzione-costi-storage-vino-investimento", title: "Come Dedurre i Costi di Storage dal Reddito da Investimento Vino", category: "Fiscalità", readTime: "5 min" },
  { slug: "accise-vino-italia-guida-completa", title: "Accise sul Vino in Italia: Guida Completa", category: "Fiscalità", readTime: "5 min" },
  { slug: "certificati-investimento-wine-linked-tassazione", title: "Certificati di Investimento Wine-Linked: Come Funzionano e Come Vengono Tassati", category: "Fiscalità", readTime: "6 min" },
  { slug: "regime-forfettario-vino-investimento", title: "Regime Forfettario e Vino: Cosa Cambia per i Piccoli Investitori", category: "Fiscalità", readTime: "5 min" },
  { slug: "imposta-bollo-wine-investment", title: "Imposta di Bollo e Wine Investment: Quando si Applica", category: "Fiscalità", readTime: "4 min" },
  { slug: "vino-piano-pensionistico-previdenziale", title: "Vino e Piano Pensionistico: Come Integrare il Fine Wine nella Pianificazione Previdenziale", category: "Fiscalità", readTime: "6 min" },
  { slug: "documentazione-fiscale-cantina-investimento", title: "Come Gestire la Documentazione Fiscale per una Cantina da Investimento", category: "Fiscalità", readTime: "5 min" },
  { slug: "wine-searcher-vs-vivino-per-investire", title: "Wine-Searcher vs Vivino: Quale Usare per Investire nel Vino", category: "Piattaforme", readTime: "5 min" },
  { slug: "tannico-vs-millesima-confronto-2026", title: "Tannico vs Millesima: Confronto Completo 2026", category: "Piattaforme", readTime: "5 min" },
  { slug: "migliori-piattaforme-vino-investimento-2026", title: "Le 10 Migliori Piattaforme per Comprare Vino da Investimento nel 2026", category: "Piattaforme", readTime: "7 min" },
  { slug: "idealwine-guida-completa-aste-vino", title: "Idealwine: La Guida Completa per Acquistare e Vendere all'Asta", category: "Piattaforme", readTime: "6 min" },
  { slug: "confrontare-prezzi-vino-piattaforme-sistema", title: "Come Confrontare i Prezzi su Più Piattaforme: Il Sistema dei 3 Controlli", category: "Piattaforme", readTime: "5 min" },
  { slug: "berry-bros-rudd-guida-completa", title: "Berry Bros & Rudd: Il Merchant Più Antico del Mondo per il Fine Wine", category: "Piattaforme", readTime: "5 min" },
  { slug: "sothebys-vs-christies-vino-dove-vendere", title: "Sotheby's vs Christie's per il Vino: Dove Vendere Meglio la Tua Collezione", category: "Piattaforme", readTime: "6 min" },
  { slug: "liv-ex-privati-accesso-mercato-professionale", title: "Liv-ex per Privati: Come Accedere al Mercato Professionale del Fine Wine", category: "Piattaforme", readTime: "5 min" },
  { slug: "wine-owners-piattaforma-portfolio-fine-wine", title: "Wine Owners: La Piattaforma Portfolio-First per Investitori di Vino", category: "Piattaforme", readTime: "5 min" },
  { slug: "acquistare-vino-direttamente-in-cantina", title: "Acquistare Vino da Investimento Direttamente in Cantina: Guida Pratica", category: "Piattaforme", readTime: "5 min" },
  { slug: "winebid-hart-davis-hart-aste-usa-vino", title: "WineBid e Hart Davis Hart: Il Mercato delle Aste USA per il Fine Wine Italiano", category: "Piattaforme", readTime: "5 min" },
  { slug: "confronto-piattaforme-storage-fine-wine", title: "Confronto Piattaforme Storage: Dove Conservare il Tuo Fine Wine", category: "Piattaforme", readTime: "5 min" },
  { slug: "farr-vintners-wholesale-bordeaux", title: "Farr Vintners e il Mercato Wholesale del Bordeaux", category: "Piattaforme", readTime: "5 min" },
  { slug: "wineandco-modello-francese-vino-fine", title: "Wineandco e il Modello Francese di e-Commerce del Vino Fine", category: "Piattaforme", readTime: "4 min" },
  { slug: "sistema-monitoraggio-prezzi-piattaforme-vino", title: "Come Costruire un Sistema di Monitoraggio Prezzi su Più Piattaforme", category: "Piattaforme", readTime: "5 min" },
  { slug: "analisi-tecnica-mercato-vino", title: "Analisi Tecnica Applicata al Mercato del Vino", category: "Analisi Mercato", readTime: "6 min" },
  { slug: "usare-dati-liv-ex-decisioni-investimento", title: "Come Usare i Dati Liv-ex per Decisioni di Investimento", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "stagionalita-mercato-vino-quando-comprare-vendere", title: "Stagionalità nel Mercato del Vino: Quando Comprare e Quando Vendere", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "impatto-recensioni-critici-prezzi-vino", title: "L'Impatto delle Recensioni dei Critici sui Prezzi del Vino da Investimento", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "vino-inflazione-hedge-inflazione", title: "Vino e Inflazione: Il Fine Wine come Hedge Inflazionistico", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "mercato-barolo-2026-outlook-previsioni", title: "Il Mercato del Barolo nel 2026: Outlook e Previsioni", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "cambiamento-climatico-investimenti-vino", title: "Il Cambiamento Climatico Ridisegna la Mappa degli Investimenti nel Vino", category: "Analisi Mercato", readTime: "6 min" },
  { slug: "asia-fine-wine-domanda-investimento", title: "Asia e Fine Wine: China, Hong Kong, Singapore come Motori della Domanda", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "en-primeur-2025-comprare-o-aspettare", title: "En Primeur 2025: Comprare o Aspettare? Analisi Completa", category: "Analisi Mercato", readTime: "6 min" },
  { slug: "segnali-correzione-mercato-fine-wine", title: "I Segnali di una Correzione del Mercato del Fine Wine", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "vino-recessione-performance-crisi-economiche", title: "Vino e Recessione: Come Performa il Fine Wine nelle Crisi Economiche", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "champagne-millesimato-mercato-investimento-2026", title: "Analisi del Mercato Champagne Millesimato: Opportunità di Investimento 2026", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "regioni-vino-emergenti-investimento-2026", title: "Le Regioni del Vino Emergenti per l'Investimento nel 2026", category: "Analisi Mercato", readTime: "6 min" },
  { slug: "cambio-eur-usd-impatto-portfolio-fine-wine", title: "Come il Cambio EUR/USD Impatta il Tuo Portfolio di Fine Wine", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "scarsita-artificiale-manipolazione-prezzi-vino", title: "Scarsità Artificiale e Manipolazione dei Prezzi nel Fine Wine", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "portfolio-wine-benchmark-kpi-performance", title: "Portfolio Wine: Benchmark e KPI per Misurare la Performance", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "vini-naturali-biologici-biodinamici-investimento", title: "Vini Naturali, Biologici e Biodinamici: Opportunità di Investimento o Trend Passeggero?", category: "Analisi Mercato", readTime: "5 min" },
  { slug: "brunello-montalcino-investimento-vino-italiano", title: "Brunello di Montalcino: Il Più Grande Investimento del Vino Italiano?", category: "Analisi", readTime: "5 min" },
  { slug: "investire-vino-spumante-champagne-franciacorta-cava", title: "Investire in Vino Spumante: Champagne, Franciacorta e Cava a Confronto", category: "Analisi", readTime: "5 min" },
  { slug: "whisky-vs-vino-asset-alternativa-confronto", title: "Whisky vs Vino: Quale Asset Alternativa Performa Meglio?", category: "Analisi", readTime: "5 min" },
  { slug: "sistema-costruire-asset-vino-guida-operativa", title: "Il Sistema per Costruire Asset con il Vino: Guida Operativa", category: "Sistema & Mentalità", readTime: "6 min" },
  { slug: "mentalita-migliori-wine-investor-mondo", title: "Come Pensano i Migliori Wine Investor del Mondo", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "da-collezionista-a-investitore-cambio-mentalita", title: "Da Collezionista a Investitore: Il Cambio di Mentalità Necessario", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "errori-psicologici-investimento-vino", title: "Errori Psicologici nell'Investimento in Vino: Come Evitare le 7 Trappole Mentali", category: "Sistema & Mentalità", readTime: "6 min" },
  { slug: "disciplina-pazienza-wine-investment", title: "Come Costruire Disciplina e Pazienza nel Wine Investment", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "minimum-viable-wine-portfolio-3000-5000", title: "Il Minimum Viable Wine Portfolio: Come Iniziare con €3.000-5.000", category: "Sistema & Mentalità", readTime: "6 min" },
  { slug: "costruire-relazioni-merchant-vino", title: "Come Costruire Relazioni con i Merchant del Vino", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "quando-vendere-strategia-exit-fine-wine", title: "Quando Vendere: La Strategia di Exit Ottimale nel Fine Wine", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "wine-investment-journal-documentare-decisioni", title: "Il Wine Investment Journal: Come Documentare le Tue Decisioni", category: "Sistema & Mentalità", readTime: "4 min" },
  { slug: "networking-mondo-fine-wine-circoli", title: "Networking nel Mondo del Fine Wine: Come Entrare nei Circoli Giusti", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "obiettivi-smart-wine-investment", title: "Obiettivi SMART Applicati al Wine Investment", category: "Sistema & Mentalità", readTime: "4 min" },
  { slug: "comunicare-portfolio-wine-familiari", title: "Come Comunicare il Tuo Portfolio Wine ai Familiari", category: "Sistema & Mentalità", readTime: "4 min" },
  { slug: "psicologia-asta-non-pagare-troppo-vino", title: "La Psicologia dell'Asta: Come Non Pagare Troppo", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "costruire-knowledge-base-wine-investment", title: "Come Costruire una Knowledge Base sul Vino come Investimento", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "wine-investment-40-55-anni-finestra-temporale", title: "Wine Investment per i 40-55 Anni: La Finestra Temporale Perfetta", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "advisor-wine-investment-quando-serve-professionista", title: "Il Ruolo di un Advisor nel Wine Investment: Quando Serve un Professionista", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "due-diligence-vino-prima-di-comprare", title: "Come Fare Due Diligence su un Vino Prima di Comprare", category: "Strategie", readTime: "5 min" },
  { slug: "autenticita-provenienza-verificare-bottiglia-vino", title: "Autenticità e Provenienza: Come Verificare una Bottiglia Prima dell'Acquisto", category: "Strategie", readTime: "5 min" },
  { slug: "sistema-rebalancing-portfolio-wine", title: "Costruire un Sistema di Rebalancing per il Portfolio Wine", category: "Strategie", readTime: "5 min" },
  { slug: "10-anni-wine-investment-lezioni", title: "10 Anni nel Wine Investment: Cosa Impari che Nessun Libro Insegna", category: "Strategie", readTime: "6 min" },
  { slug: "strategia-en-primeur-guida-completa-2026", title: "La Strategia En Primeur: Guida Completa per il 2026", category: "Strategie", readTime: "7 min" },
  { slug: "inventario-professionale-cantina-vino", title: "Come Creare un Inventario Professionale della Tua Cantina", category: "Strategie", readTime: "5 min" },
  { slug: "assicurazione-vino-investimento-guida-2026", title: "Assicurazione per il Vino da Investimento: Guida Completa 2026", category: "Strategie", readTime: "5 min" },
  { slug: "vendere-asta-vs-merchant-pro-contro", title: "Vendere all'Asta vs Vendere a un Merchant: Pro, Contro e Quando Scegliere", category: "Strategie", readTime: "6 min" },
  { slug: "spedizione-internazionale-vino-normative-costi", title: "Spedizione Internazionale di Vino: Normative, Costi e Consigli Pratici", category: "Strategie", readTime: "5 min" },
  { slug: "dollar-cost-averaging-fine-wine", title: "Dollar Cost Averaging nel Fine Wine: Funziona per il Vino?", category: "Strategie", readTime: "5 min" },
  { slug: "investire-wine-fund-pro-contro-migliori-2026", title: "Investire in Wine Fund: Pro, Contro e i Migliori Fund del 2026", category: "Strategie", readTime: "6 min" },
  { slug: "portfolio-wine-barbell-strategia", title: "Portfolio Wine Barbell: Come Combinare Vini Sicuri e Vini Ad Alto Rischio", category: "Strategie", readTime: "5 min" },
  { slug: "wine-lending-cantina-collaterale-prestito", title: "Wine Lending: Usare la Tua Cantina come Collaterale per un Prestito", category: "Strategie", readTime: "5 min" },
  { slug: "uscire-investimento-wine-sbagliato", title: "Come Uscire da un Investimento Wine Sbagliato", category: "Strategie", readTime: "5 min" },
  { slug: "gestione-cellar-lungo-termine-temperatura-umidita", title: "La Gestione del Cellar nel Lungo Termine: Temperatura, Umidità e Luce", category: "Strategie", readTime: "5 min" },
  { slug: "costruire-track-record-wine-investor", title: "Come Costruire un Track Record di Wine Investor: La Credibilità nel Mercato", category: "Strategie", readTime: "5 min" },
  { slug: "portfolio-wine-esg-criteri-sostenibilita", title: "Portfolio Wine e ESG: Come Integrare i Criteri di Sostenibilità", category: "Strategie", readTime: "5 min" },
  { slug: "vintage-chart-2026-migliori-annate-regione", title: "Vintage Chart 2026: Guida Aggiornata alle Migliori Annate per Regione", category: "Guide Pratiche", readTime: "6 min" },
  { slug: "magnum-investimento-formati-grandi-performano", title: "Il Magnum Investment: Perché i Formati Grandi Performano Meglio", category: "Guide Pratiche", readTime: "5 min" },
  { slug: "barolo-menzioni-geografiche-aggiuntive-investimento", title: "Barolo Menzioni Geografiche Aggiuntive: La Nuova Frontiera dell'Investimento", category: "Guide Pratiche", readTime: "5 min" },
  { slug: "fine-wine-millennials-generazione-y-mercato", title: "Fine Wine per i Millennials: Come la Generazione Y Sta Reinventando il Mercato", category: "Guide Pratiche", readTime: "5 min" },
  { slug: "supertoscani-storia-performance-outlook-2026", title: "I Supertoscani: Storia, Performance e Outlook 2026", category: "Guide Pratiche", readTime: "6 min" },
  { slug: "borgogna-bianca-chardonnay-investimento", title: "Borgogna Bianca: Chardonnay da Investimento che Pochi Considerano", category: "Guide Pratiche", readTime: "5 min" },
  { slug: "guida-completa-vinoinvest-funzionalita", title: "Come Usare VinoInvest al Massimo: Guida Completa alle Funzionalità", category: "Guide Pratiche", readTime: "7 min" },
  { slug: "glossario-wine-investment-termini", title: "Il Glossario del Wine Investment: 100 Termini da Conoscere", category: "Guide Pratiche", readTime: "8 min" },
  { slug: "wine-investment-professionisti-medici-avvocati-manager", title: "Wine Investment per i Professionisti: Medici, Avvocati e Manager", category: "Guide Pratiche", readTime: "6 min" },
  { slug: "crollo-prezzi-bordeaux-2022-2023-lezioni", title: "Il Crollo dei Prezzi Bordeaux 2022-2023: Lezioni per il Futuro", category: "Analisi Mercato", readTime: "6 min" },
  { slug: "advisory-board-personale-wine-investment", title: "Costruire un Advisory Board Personale per il Wine Investment", category: "Sistema & Mentalità", readTime: "5 min" },
  { slug: "vino-vs-arte-vs-orologi-vs-borse-lusso-confronto", title: "Vino vs Arte vs Orologi vs Borse di Lusso: Il Confronto Definitivo degli Asset Alternativi", category: "Analisi", readTime: "7 min" },
];

const CATEGORIES = ["Tutti", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

const CATEGORY_COLORS = {
  "Guida": "#C9A227",
  "Analisi": "#4ade80",
  "Fiscalità": "#60a5fa",
  "Piattaforme": "#f472b6",
  "Analisi Mercato": "#a78bfa",
  "Sistema & Mentalità": "#fb923c",
  "Strategie": "#34d399",
  "Guide Pratiche": "#f59e0b",
};

export default function BlogIndex() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tutti");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ARTICLES.filter(a => {
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "Tutti" || a.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Helmet>
        <title>Wine Investment Blog | VinoInvest</title>
        <meta name="description" content="Articoli su investimento nel vino: guide fiscali, analisi di mercato, strategie di portfolio e piattaforme. Aggiornati settimanalmente." />
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(201,162,39,0.15)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, background: "rgba(11,18,32,0.95)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "transparent", border: "1px solid rgba(201,162,39,0.3)", color: "#C9A227", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
        >
          ← Home
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, color: "#C9A227" }}>VinoInvest</span>
          <span style={{ color: "rgba(201,162,39,0.4)", fontSize: 14 }}>/</span>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>Blog</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
            Wine Investment Blog
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px", color: "#f1f5f9" }}>
            Guide, Analisi e Strategie<br />per Investire nel Vino
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto" }}>
            {ARTICLES.length} articoli su fiscalità, mercato, piattaforme e mentalità dell'investitore nel fine wine.
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 16, pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              placeholder="Cerca articoli..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                background: "rgba(30,41,59,0.6)",
                border: "1px solid rgba(201,162,39,0.2)",
                borderRadius: 10,
                color: "#e2e8f0",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(201,162,39,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(201,162,39,0.2)")}
            />
          </div>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? "#C9A227" : "rgba(201,162,39,0.2)"}`,
                background: activeCategory === cat ? "rgba(201,162,39,0.15)" : "transparent",
                color: activeCategory === cat ? "#C9A227" : "#64748b",
                fontSize: 12,
                fontWeight: activeCategory === cat ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "#475569", textAlign: "center" }}>
          {filtered.length} {filtered.length === 1 ? "articolo" : "articoli"}{activeCategory !== "Tutti" ? ` in "${activeCategory}"` : ""}
          {search && ` per "${search}"`}
        </div>

        {/* Article grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#475569" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>Nessun articolo trovato per questa ricerca.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("Tutti"); }}
              style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(201,162,39,0.3)", background: "transparent", color: "#C9A227", fontSize: 13, cursor: "pointer" }}
            >
              Mostra tutti
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map(article => {
              const catColor = CATEGORY_COLORS[article.category] || "#C9A227";
              return (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div style={{
                    background: "rgba(15,23,42,0.7)",
                    border: "1px solid rgba(201,162,39,0.1)",
                    borderRadius: 12,
                    padding: "20px",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(201,162,39,0.35)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.background = "rgba(20,30,55,0.85)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(201,162,39,0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "rgba(15,23,42,0.7)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: catColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        background: `${catColor}18`,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: 10, color: "#475569" }}>{article.readTime}</span>
                    </div>
                    <h2 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.45,
                      color: "#e2e8f0",
                      margin: "0 0 12px",
                    }}>
                      {article.title}
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#475569" }}>
                      <span>VinoInvest AI</span>
                      <span style={{ color: "#C9A227", fontWeight: 600, fontSize: 12 }}>Leggi →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        <div style={{ marginTop: 64, padding: "32px", background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 16, textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>
            Pronto ad Investire nel Vino?
          </h3>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
            Analizza oltre 10.000 vini con AI Score, storico prezzi e dati Liv-ex in tempo reale.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "#C9A227", color: "#0b1220", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Esplora il Mercato →
          </button>
        </div>
      </div>
    </div>
  );
}
