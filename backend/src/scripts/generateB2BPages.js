#!/usr/bin/env node
/**
 * generateB2BPages.js
 * Generates 200 professional B2B wine investment guide pages using Claude Haiku.
 * Output: JSON files in backend/src/data/b2b-guides/ (one per topic)
 * Usage: node generateB2BPages.js [--dry-run] [--batch 1-10]
 *
 * Requires: ANTHROPIC_API_KEY in environment
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../data/b2b-guides");
const DRY_RUN = process.argv.includes("--dry-run");

// ── 200 B2B guide topics ──────────────────────────────────────────────────
const B2B_TOPICS = [
  // Portfolio Management (1-30)
  { slug: "portfolio-construction-hnw", title: "Portfolio Construction per Clienti HNW", category: "portfolio" },
  { slug: "asset-allocation-fine-wine", title: "Asset Allocation con Fine Wine: Framework Professionale", category: "portfolio" },
  { slug: "diversification-wine-equity", title: "Diversificazione Wine/Equity: Correlazioni e Modelli", category: "portfolio" },
  { slug: "wine-portfolio-benchmarking", title: "Benchmarking del Wine Portfolio vs Indici Globali", category: "portfolio" },
  { slug: "risk-management-wine-assets", title: "Risk Management per Wine Asset Class", category: "portfolio" },
  { slug: "rebalancing-wine-portfolio", title: "Strategie di Rebalancing nel Fine Wine", category: "portfolio" },
  { slug: "portfolio-reporting-professional", title: "Reporting Professionale per Portfolio Wine", category: "portfolio" },
  { slug: "performance-attribution-wine", title: "Performance Attribution nel Fine Wine", category: "portfolio" },
  { slug: "sharpe-ratio-wine-portfolio", title: "Sharpe Ratio e Metriche Risk-Adjusted per Wine", category: "portfolio" },
  { slug: "monte-carlo-wine-portfolio", title: "Monte Carlo Simulation per Wine Portfolio", category: "portfolio" },
  { slug: "tail-risk-wine-investing", title: "Tail Risk nel Fine Wine: Misurare e Proteggere", category: "portfolio" },
  { slug: "correlation-matrix-wine-assets", title: "Matrice di Correlazione: Wine vs Multi-Asset", category: "portfolio" },
  { slug: "black-litterman-wine", title: "Black-Litterman Model Applicato al Fine Wine", category: "portfolio" },
  { slug: "factor-investing-wine", title: "Factor Investing nel Fine Wine: Quality, Momentum, Value", category: "portfolio" },
  { slug: "liability-matching-wine", title: "Liability Matching con Fine Wine per Fondi Pensione", category: "portfolio" },
  { slug: "alternative-investment-framework", title: "Fine Wine nel Framework degli Alternative Investments", category: "portfolio" },
  { slug: "esg-wine-portfolio", title: "Portfolio ESG con Fine Wine: Criteri e Selezione", category: "portfolio" },
  { slug: "wine-portfolio-stress-test", title: "Stress Testing del Wine Portfolio: Scenari Storici", category: "portfolio" },
  { slug: "drawdown-analysis-wine", title: "Drawdown Analysis nel Fine Wine", category: "portfolio" },
  { slug: "liquidity-premium-wine", title: "Liquidity Premium nel Fine Wine: Valorizzare l'Illiquidità", category: "portfolio" },
  { slug: "wine-as-inflation-hedge", title: "Fine Wine come Hedge all'Inflazione", category: "portfolio" },
  { slug: "wine-real-estate-correlation", title: "Correlazione Fine Wine / Real Estate", category: "portfolio" },
  { slug: "wine-gold-portfolio", title: "Wine e Gold: Due Diversificatori a Confronto", category: "portfolio" },
  { slug: "vintage-rotation-strategy", title: "Vintage Rotation Strategy per Portfolio Professionali", category: "portfolio" },
  { slug: "wine-currency-risk", title: "Currency Risk nel Fine Wine: Gestione e Hedging", category: "portfolio" },
  { slug: "wine-private-equity-comparison", title: "Fine Wine vs Private Equity: Confronto Strutturale", category: "portfolio" },
  { slug: "wine-infrastructure-comparison", title: "Fine Wine vs Infrastructure: Alternative Illiquide", category: "portfolio" },
  { slug: "portfolio-size-thresholds", title: "Soglie di Budget per Strategia Ottimale nel Wine", category: "portfolio" },
  { slug: "wine-portfolio-concentration", title: "Concentrazione di Portfolio nel Fine Wine: Limiti e Benefici", category: "portfolio" },
  { slug: "institutional-wine-portfolio", title: "Portfolio Wine per Investitori Istituzionali", category: "portfolio" },

  // Market Analysis (31-60)
  { slug: "liv-ex-indices-explained", title: "Gli Indici Liv-ex: Guida Completa per Professionisti", category: "market" },
  { slug: "bordeaux-market-analysis-2024", title: "Analisi Mercato Bordeaux 2024: Tendenze e Prospettive", category: "market" },
  { slug: "burgundy-market-dynamics", title: "La Dinamica del Mercato Borgognone: Domanda e Offerta", category: "market" },
  { slug: "italy-fine-wine-market", title: "Il Mercato del Fine Wine Italiano: Barolo, Brunello, Super Tuscans", category: "market" },
  { slug: "champagne-investment-market", title: "Il Mercato del Champagne da Investimento: Analisi 2024", category: "market" },
  { slug: "asia-wine-market-2024", title: "Il Mercato Asiatico del Fine Wine: Cina, HK, Singapore 2024", category: "market" },
  { slug: "en-primeur-market-analysis", title: "Analisi del Mercato En Primeur: Storia e Prospettive", category: "market" },
  { slug: "secondary-market-structure", title: "Struttura del Mercato Secondario Globale del Fine Wine", category: "market" },
  { slug: "wine-auction-market-trends", title: "Tendenze del Mercato delle Aste di Fine Wine", category: "market" },
  { slug: "wine-market-seasonality", title: "Stagionalità nel Mercato del Fine Wine", category: "market" },
  { slug: "wine-price-cycles", title: "Cicli di Prezzo nel Fine Wine: Pattern e Previsioni", category: "market" },
  { slug: "supply-scarcity-wine", title: "Scarsità dell'Offerta nel Fine Wine: Driver e Impatti", category: "market" },
  { slug: "critic-ratings-market-impact", title: "L'Impatto dei Critici sui Prezzi del Fine Wine", category: "market" },
  { slug: "wine-market-data-sources", title: "Fonti Dati per l'Analisi del Mercato Fine Wine", category: "market" },
  { slug: "rhone-valley-investment", title: "Rhône Valley: Opportunità di Investimento Emergenti", category: "market" },
  { slug: "new-world-fine-wine", title: "Il 'Nuovo Mondo' nel Fine Wine: Mercati Emergenti", category: "market" },
  { slug: "wine-market-post-covid", title: "Il Mercato del Fine Wine Post-COVID: Recovery e Nuovi Trend", category: "market" },
  { slug: "wine-market-2008-crisis", title: "La Crisi del 2008 e il Fine Wine: Resilienza e Lezioni", category: "market" },
  { slug: "bordeaux-vs-burgundy-2024", title: "Bordeaux vs Borgogna nel 2024: Chi Outperforma?", category: "market" },
  { slug: "wine-market-liquidity-analysis", title: "Analisi della Liquidità nel Mercato Fine Wine", category: "market" },
  { slug: "climate-change-wine-markets", title: "Climate Change e Mercati del Fine Wine", category: "market" },
  { slug: "wine-demand-drivers", title: "Driver della Domanda nel Fine Wine 2025-2030", category: "market" },
  { slug: "vintage-quality-market-premium", title: "Il Premium di Qualità dell'Annata: Analisi Quantitativa", category: "market" },
  { slug: "producer-pricing-power-analysis", title: "Pricing Power dei Produttori: Ranking e Analisi", category: "market" },
  { slug: "wine-market-bubble-indicators", title: "Indicatori di Bolla nel Mercato Fine Wine", category: "market" },
  { slug: "wine-market-macro-correlation", title: "Correlazione Wine Market / Macro Economia", category: "market" },
  { slug: "uk-market-post-brexit-wine", title: "Il Mercato UK del Fine Wine Post-Brexit", category: "market" },
  { slug: "usa-wine-investment-market", title: "Il Mercato USA del Fine Wine: Christie's, Acker, Zachys", category: "market" },
  { slug: "middle-east-wine-market", title: "Il Mercato del Medio Oriente per il Fine Wine", category: "market" },
  { slug: "wine-market-technology-disruption", title: "Technology Disruption nel Mercato Fine Wine", category: "market" },

  // Due Diligence (61-90)
  { slug: "wine-authentication-professional", title: "Autenticazione del Fine Wine: Standard Professionali", category: "due-diligence" },
  { slug: "provenance-verification-guide", title: "Verifica della Provenienza: Guida per Advisor", category: "due-diligence" },
  { slug: "cellar-inspection-checklist", title: "Ispezione della Cantina: Checklist per Due Diligence", category: "due-diligence" },
  { slug: "wine-fraud-red-flags", title: "Red Flag di Frode nel Fine Wine: Identificazione Rapida", category: "due-diligence" },
  { slug: "owc-certification-value", title: "OWC (Original Wooden Case): Valore e Certificazione", category: "due-diligence" },
  { slug: "storage-provider-due-diligence", title: "Due Diligence sullo Storage Provider", category: "due-diligence" },
  { slug: "auction-house-selection", title: "Selezione dell'Auction House: Criteri Professionali", category: "due-diligence" },
  { slug: "producer-assessment-framework", title: "Framework di Assessment del Produttore", category: "due-diligence" },
  { slug: "vintage-quality-assessment", title: "Assessment della Qualità dell'Annata: Metodi", category: "due-diligence" },
  { slug: "blockchain-wine-verification", title: "Blockchain per la Verifica del Fine Wine", category: "due-diligence" },
  { slug: "laboratory-wine-testing", title: "Testing di Laboratorio per il Fine Wine", category: "due-diligence" },
  { slug: "wine-consultant-selection", title: "Selezione del Consulente Fine Wine: Criteri", category: "due-diligence" },
  { slug: "wine-fund-due-diligence", title: "Due Diligence su un Wine Fund", category: "due-diligence" },
  { slug: "merchant-assessment-criteria", title: "Criteri di Assessment del Wine Merchant", category: "due-diligence" },
  { slug: "wine-insurance-assessment", title: "Assessment dell'Assicurazione Wine: Polizze e Massimali", category: "due-diligence" },
  { slug: "chain-of-custody-documentation", title: "Documentazione della Chain of Custody", category: "due-diligence" },
  { slug: "ullage-assessment-guide", title: "Guida all'Assessment dell'Ullage", category: "due-diligence" },
  { slug: "cork-label-inspection", title: "Ispezione di Cork ed Etichetta: Standard Professionali", category: "due-diligence" },
  { slug: "private-sale-due-diligence", title: "Due Diligence per Acquisti Privati di Fine Wine", category: "due-diligence" },
  { slug: "wine-valuation-methods", title: "Metodi di Valutazione del Fine Wine: Approcci Professionali", category: "due-diligence" },
  { slug: "negociant-due-diligence", title: "Due Diligence sul Négociant", category: "due-diligence" },
  { slug: "domaine-visit-checklist", title: "Checklist per la Visita alla Domaine", category: "due-diligence" },
  { slug: "wine-condition-grading", title: "Grading delle Condizioni del Fine Wine: Standard", category: "due-diligence" },
  { slug: "vintage-chart-professional-use", title: "Utilizzo Professionale della Vintage Chart", category: "due-diligence" },
  { slug: "terroir-assessment-investment", title: "Assessment del Terroir per l'Investimento", category: "due-diligence" },
  { slug: "climate-vintage-analysis", title: "Analisi Clima/Annata per Decisioni di Investimento", category: "due-diligence" },
  { slug: "critic-score-interpretation", title: "Interpretazione Professionale dei Punteggi dei Critici", category: "due-diligence" },
  { slug: "secondary-market-price-check", title: "Verifica Prezzi sul Mercato Secondario", category: "due-diligence" },
  { slug: "wine-lot-inspection-guide", title: "Guida all'Ispezione del Lotto d'Asta", category: "due-diligence" },
  { slug: "investment-grade-wine-definition", title: "Definizione di 'Investment Grade' nel Fine Wine", category: "due-diligence" },

  // Tax & Legal (91-110)
  { slug: "wine-tax-italy-guide", title: "Fiscalità del Fine Wine in Italia: Guida Completa", category: "tax-legal" },
  { slug: "wine-tax-uk-exemption", title: "Esenzione CGT UK per Fine Wine: Wasting Asset", category: "tax-legal" },
  { slug: "wine-tax-usa-guide", title: "Fiscalità del Fine Wine negli USA: Collectibles CGT", category: "tax-legal" },
  { slug: "wine-inheritance-planning", title: "Pianificazione Successoria con Fine Wine", category: "tax-legal" },
  { slug: "wine-holding-structure", title: "Strutture Societarie per la Detenzione di Wine Assets", category: "tax-legal" },
  { slug: "aml-kyc-wine-business", title: "AML/KYC nel Business del Fine Wine", category: "tax-legal" },
  { slug: "wine-import-export-duties", title: "Dazi Import/Export per il Fine Wine", category: "tax-legal" },
  { slug: "wine-vat-guide", title: "IVA nel Fine Wine: Italia e UE", category: "tax-legal" },
  { slug: "wine-contract-law", title: "Diritto Contrattuale nel Fine Wine", category: "tax-legal" },
  { slug: "wine-dispute-resolution", title: "Risoluzione delle Dispute nel Fine Wine", category: "tax-legal" },
  { slug: "wine-trust-structure", title: "Strutture Trust per il Fine Wine", category: "tax-legal" },
  { slug: "wine-gdpr-compliance", title: "GDPR e Privacy nel Business del Fine Wine", category: "tax-legal" },
  { slug: "wine-mifid-classification", title: "Classificazione MiFID del Fine Wine", category: "tax-legal" },
  { slug: "wine-aifmd-fund-structure", title: "Struttura AIFMD per Wine Fund", category: "tax-legal" },
  { slug: "wine-advisor-liability", title: "Responsabilità del Wine Advisor: Aspetti Legali", category: "tax-legal" },
  { slug: "wine-insurance-coverage", title: "Copertura Assicurativa per Wine Assets", category: "tax-legal" },
  { slug: "wine-tokenization-legal", title: "Tokenizzazione del Fine Wine: Aspetti Legali", category: "tax-legal" },
  { slug: "wine-nft-regulation", title: "Regolamentazione degli NFT nel Fine Wine", category: "tax-legal" },
  { slug: "wine-cross-border-compliance", title: "Compliance Cross-Border nel Fine Wine Business", category: "tax-legal" },
  { slug: "wine-advisor-licensing", title: "Licenze per il Wine Investment Advisor", category: "tax-legal" },

  // Client Management (111-140)
  { slug: "hnw-client-onboarding", title: "Onboarding del Cliente HNW per il Fine Wine", category: "client" },
  { slug: "wine-investment-proposal", title: "Costruire una Proposta di Investimento Wine Professionale", category: "client" },
  { slug: "family-office-wine-pitch", title: "Presentare il Fine Wine a un Family Office", category: "client" },
  { slug: "wine-mandate-structure", title: "Strutturare il Mandato di Investimento Wine", category: "client" },
  { slug: "client-reporting-wine", title: "Reporting Clienti per il Portfolio Wine", category: "client" },
  { slug: "wine-client-communication", title: "Communication Strategy con i Clienti Wine", category: "client" },
  { slug: "client-risk-profiling-wine", title: "Risk Profiling del Cliente per il Fine Wine", category: "client" },
  { slug: "wine-expectation-management", title: "Gestione delle Aspettative nel Wine Investment", category: "client" },
  { slug: "wine-client-retention", title: "Retention del Cliente nel Wine Advisory", category: "client" },
  { slug: "wine-cross-selling", title: "Cross-Selling: Fine Wine + Alternative Investments", category: "client" },
  { slug: "wine-client-education", title: "Educazione del Cliente sul Fine Wine", category: "client" },
  { slug: "wine-client-events", title: "Organizzare Degustazioni Investment per Clienti", category: "client" },
  { slug: "wine-client-quarterly-review", title: "Review Trimestrale con il Cliente Wine", category: "client" },
  { slug: "wine-mandate-renewal", title: "Rinnovo del Mandato Wine: Strategie", category: "client" },
  { slug: "wine-client-complaint-handling", title: "Gestione dei Reclami nel Wine Advisory", category: "client" },
  { slug: "wine-crm-best-practices", title: "CRM Best Practices per il Wine Advisor", category: "client" },
  { slug: "ultra-hnwi-wine-advisory", title: "Wine Advisory per Ultra-HNWI: Differenze e Standard", category: "client" },
  { slug: "endowment-foundation-wine", title: "Wine Investment per Endowment e Fondazioni", category: "client" },
  { slug: "pension-fund-wine-allocation", title: "Allocazione Wine per Fondi Pensione", category: "client" },
  { slug: "wine-digital-client-portal", title: "Portale Digitale per il Cliente Wine: Best Practices", category: "client" },
  { slug: "wine-client-kyc-process", title: "KYC Process per il Cliente Fine Wine", category: "client" },
  { slug: "wine-client-trust-building", title: "Costruire Trust con il Cliente Wine nel Tempo", category: "client" },
  { slug: "multi-generational-wine-portfolio", title: "Portfolio Wine Multi-Generazionale: Pianificazione", category: "client" },
  { slug: "wine-advisor-fee-structures", title: "Strutture di Fee per il Wine Advisor", category: "client" },
  { slug: "wine-discretionary-mandate", title: "Mandato Discrezionale nel Fine Wine", category: "client" },
  { slug: "wine-advisory-vs-execution-only", title: "Advisory vs Execution-Only nel Wine: Differenze", category: "client" },
  { slug: "wine-client-portfolio-review", title: "Annual Review del Portfolio Wine con il Cliente", category: "client" },
  { slug: "wine-client-onboarding-checklist", title: "Checklist di Onboarding del Cliente Wine", category: "client" },
  { slug: "wine-client-segmentation", title: "Segmentazione della Clientela Wine: Criteri e Approcci", category: "client" },
  { slug: "wine-client-lifetime-value", title: "Customer Lifetime Value nel Wine Advisory", category: "client" },

  // Operations (141-170)
  { slug: "wine-storage-operations", title: "Gestione Operativa dello Storage Wine", category: "operations" },
  { slug: "wine-inventory-management", title: "Inventory Management per Portfolio Wine Professionali", category: "operations" },
  { slug: "wine-logistics-guide", title: "Logistica del Fine Wine: Trasporto e Customs", category: "operations" },
  { slug: "lcb-bonded-warehouse", title: "London City Bond: Guida per Professionisti", category: "operations" },
  { slug: "wine-temperature-monitoring", title: "Monitoring della Temperatura per Wine Storage", category: "operations" },
  { slug: "wine-cellar-management-pro", title: "Cantina Management Professionale: Best Practices", category: "operations" },
  { slug: "wine-iot-monitoring-systems", title: "Sistemi IoT per il Monitoring della Cantina", category: "operations" },
  { slug: "wine-insurance-claims", title: "Gestire un Sinistro Assicurativo nel Fine Wine", category: "operations" },
  { slug: "wine-inventory-software", title: "Software di Inventario per Fine Wine: Confronto", category: "operations" },
  { slug: "wine-valuation-for-insurance", title: "Valutazione del Fine Wine per l'Assicurazione", category: "operations" },
  { slug: "wine-auction-consignment", title: "Consignment all'Asta: Processo e Best Practices", category: "operations" },
  { slug: "wine-merchant-relations", title: "Gestire le Relazioni con i Wine Merchant", category: "operations" },
  { slug: "wine-negociant-account", title: "Aprire e Gestire un Account Négociant", category: "operations" },
  { slug: "wine-delivery-inspection", title: "Ispezione alla Consegna del Fine Wine", category: "operations" },
  { slug: "wine-cellar-organization", title: "Organizzazione della Cantina per Portfolio Investment", category: "operations" },
  { slug: "wine-catalog-database", title: "Database e Catalogazione del Portfolio Wine", category: "operations" },
  { slug: "wine-transfer-procedure", title: "Procedura di Trasferimento del Fine Wine", category: "operations" },
  { slug: "wine-private-sale-procedure", title: "Procedura di Vendita Privata del Fine Wine", category: "operations" },
  { slug: "wine-storage-costs-analysis", title: "Analisi dei Costi di Storage nel Fine Wine", category: "operations" },
  { slug: "wine-operational-risk", title: "Operational Risk nel Fine Wine: Identificazione e Controllo", category: "operations" },
  { slug: "wine-secondary-market-entry", title: "Entrare nel Mercato Secondario: Procedure Operative", category: "operations" },
  { slug: "wine-lot-building-auction", title: "Costruire Lotti per l'Asta: Ottimizzazione", category: "operations" },
  { slug: "wine-professional-storage-selection", title: "Selezione dello Storage Professionale: Criteri", category: "operations" },
  { slug: "wine-digital-asset-management", title: "Digital Asset Management per il Fine Wine", category: "operations" },
  { slug: "wine-api-integration-guide", title: "Guida all'Integrazione API per Wine Data", category: "operations" },
  { slug: "wine-reporting-automation", title: "Automazione del Reporting nel Wine Portfolio", category: "operations" },
  { slug: "wine-portfolio-software-guide", title: "Guida ai Software per Portfolio Wine", category: "operations" },
  { slug: "wine-excel-portfolio-template", title: "Template Excel Professionale per Wine Portfolio", category: "operations" },
  { slug: "wine-python-analytics-guide", title: "Guida Python per Analytics del Wine Portfolio", category: "operations" },
  { slug: "wine-dashboard-design", title: "Design del Dashboard Wine per Advisor Professionali", category: "operations" },

  // Business Development (171-200)
  { slug: "wine-advisory-business-model", title: "Modello di Business per il Wine Investment Advisory", category: "business" },
  { slug: "wine-advisor-brand-building", title: "Costruire il Brand del Wine Investment Advisor", category: "business" },
  { slug: "wine-advisor-linkedin-strategy", title: "LinkedIn Strategy per il Wine Investment Professional", category: "business" },
  { slug: "wine-content-marketing", title: "Content Marketing per il Wine Advisor", category: "business" },
  { slug: "wine-client-acquisition", title: "Acquisizione Clienti nel Wine Advisory Business", category: "business" },
  { slug: "wine-referral-program", title: "Programma di Referral per il Wine Advisor", category: "business" },
  { slug: "wine-partnership-banks", title: "Partnership con Banche per il Wine Advisory", category: "business" },
  { slug: "wine-wealth-manager-partnership", title: "Partnership con Wealth Manager per il Fine Wine", category: "business" },
  { slug: "wine-business-pricing-strategy", title: "Pricing Strategy per i Servizi di Wine Advisory", category: "business" },
  { slug: "wine-business-scaling", title: "Scaling del Business di Wine Advisory", category: "business" },
  { slug: "wine-team-building", title: "Costruire un Team di Wine Advisory", category: "business" },
  { slug: "wine-advisor-certification-value", title: "Il Valore della Certificazione nel Wine Advisory", category: "business" },
  { slug: "wine-market-positioning", title: "Positioning nel Mercato del Wine Advisory", category: "business" },
  { slug: "wine-competitive-differentiation", title: "Differenziazione Competitiva nel Wine Advisory", category: "business" },
  { slug: "wine-event-hosting", title: "Organizzare Eventi per il Wine Investment Business", category: "business" },
  { slug: "wine-media-strategy", title: "Strategia Media per il Wine Investment Professional", category: "business" },
  { slug: "wine-business-plan", title: "Business Plan per una Wine Investment Advisory", category: "business" },
  { slug: "wine-legal-setup-business", title: "Setup Legale del Business di Wine Advisory", category: "business" },
  { slug: "wine-technology-stack", title: "Technology Stack per il Wine Advisory Business", category: "business" },
  { slug: "wine-international-expansion", title: "Espansione Internazionale del Wine Advisory Business", category: "business" },
  { slug: "wine-practice-management", title: "Practice Management nel Wine Advisory", category: "business" },
  { slug: "wine-advisor-succession", title: "Successione e Exit Strategy del Wine Advisor", category: "business" },
  { slug: "wine-fund-launch-guide", title: "Guida al Lancio di un Wine Investment Fund", category: "business" },
  { slug: "wine-platform-integration", title: "Integrazione con Piattaforme Wine come VinoInvest B2B", category: "business" },
  { slug: "wine-data-monetization", title: "Monetizzazione dei Dati nel Wine Advisory Business", category: "business" },
  { slug: "wine-white-label-solution", title: "Soluzioni White-Label per il Wine Advisory", category: "business" },
  { slug: "wine-robo-advisor-future", title: "Il Futuro del Robo-Advisor nel Fine Wine", category: "business" },
  { slug: "wine-ai-advisory-integration", title: "Integrare AI nel Wine Advisory Business", category: "business" },
  { slug: "vinoinvest-b2b-integration-guide", title: "Guida all'Integrazione VinoInvest B2B per Professionisti", category: "business" },
  { slug: "wine-professional-network-building", title: "Costruire un Network Professionale nel Fine Wine", category: "business" },
];

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generatePage(topic) {
  const prompt = `Sei un esperto di fine wine investment. Scrivi una guida B2B professionale in italiano su: "${topic.title}".

Struttura richiesta (JSON puro, niente markdown wrapper):
{
  "title": "${topic.title}",
  "slug": "${topic.slug}",
  "category": "${topic.category}",
  "summary": "Sommario di 2-3 frasi che spiega il valore della guida per professionisti",
  "keyPoints": ["punto 1", "punto 2", "punto 3", "punto 4", "punto 5"],
  "sections": [
    {"heading": "Titolo sezione", "body": "Contenuto professionale di 150-200 parole"},
    {"heading": "Titolo sezione 2", "body": "..."},
    {"heading": "Titolo sezione 3", "body": "..."}
  ],
  "actionableInsights": ["azione concreta 1", "azione concreta 2", "azione concreta 3"],
  "tools": ["strumento 1", "strumento 2"],
  "relatedGuides": ["slug-guida-correlata-1", "slug-guida-correlata-2"]
}

Requisiti: contenuto concreto, basato su dati reali, orientato all'azione, adatto a wealth manager e family office. Rispondi SOLO con JSON valido.`;

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would generate: ${topic.slug}`);
    return { ...topic, summary: "Dry run", sections: [], keyPoints: [], actionableInsights: [], tools: [], relatedGuides: [] };
  }

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = msg.content[0].text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(raw);
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const batchArg = process.argv.find(a => a.startsWith("--batch="));
  let topics = B2B_TOPICS;

  if (batchArg) {
    const [from, to] = batchArg.replace("--batch=", "").split("-").map(Number);
    topics = B2B_TOPICS.slice(from - 1, to);
    console.log(`Processing batch ${from}-${to} (${topics.length} topics)`);
  }

  // Generate index file listing all 200 topics (always)
  const indexPath = path.join(OUT_DIR, "_index.json");
  fs.writeFileSync(indexPath, JSON.stringify(B2B_TOPICS, null, 2));
  console.log(`Index written: ${indexPath}`);

  let ok = 0, err = 0;
  for (const topic of topics) {
    const outPath = path.join(OUT_DIR, `${topic.slug}.json`);
    if (fs.existsSync(outPath) && !process.argv.includes("--force")) {
      console.log(`  SKIP (exists): ${topic.slug}`);
      ok++;
      continue;
    }
    try {
      const page = await generatePage(topic);
      fs.writeFileSync(outPath, JSON.stringify(page, null, 2));
      console.log(`  OK: ${topic.slug}`);
      ok++;
      // Rate limiting: 3 req/sec with Haiku
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error(`  ERR: ${topic.slug} — ${e.message}`);
      err++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${err} errors`);
}

main().catch(e => { console.error(e); process.exit(1); });
