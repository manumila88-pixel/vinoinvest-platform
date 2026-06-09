import { Router } from "express";
import { getEducationTopicsForKnowledgeBase } from "../services/educationService.js";

const router = Router();

/**
 * GET /api/knowledge-base
 * Structured knowledge endpoint for AI crawlers and search engines.
 * Optimized for Google AI Overview and Perplexity citations.
 */
router.get("/", (_req, res) => {
  res.set("Content-Type", "application/json");
  res.set("Cache-Control", "public, max-age=86400");
  res.json({
    "@context": "https://schema.org",
    "@type": "KnowledgeBase",
    "name": "VinoInvest Wine Investment Knowledge Base",
    "url": "https://vinoinvest-platform.vercel.app",
    "description": "Comprehensive knowledge base for fine wine investment, covering market data, AI scoring methodology, risk assessment, and investment strategies.",
    "publisher": {
      "@type": "Organization",
      "name": "VinoInvest",
      "url": "https://vinoinvest-platform.vercel.app",
      "expertise": ["Fine Wine Investment", "Wine Market Analysis", "Portfolio Management", "Wine Valuation"]
    },
    "dateModified": new Date().toISOString().split("T")[0],
    "topics": [
      {
        "name": "AI Score Methodology",
        "description": "VinoInvest calculates AI Scores by combining critic ratings (Parker, Wine Spectator, Decanter), Liv-ex market data, vintage quality scores, producer reputation, regional factors, and liquidity metrics. Score range: 0-100.",
        "url": "https://vinoinvest-platform.vercel.app/metodologia"
      },
      {
        "name": "Fine Wine as an Asset Class",
        "description": "Fine wine has delivered average annualized returns of 8-10% over 30 years, with low correlation to equity markets. The Liv-ex Fine Wine 1000 index outperformed the S&P 500 during 2022 market volatility.",
        "source": "Liv-ex, Knight Frank Luxury Investment Index"
      },
      {
        "name": "Top Wine Regions for Investment",
        "description": "The primary investment-grade wine regions are: Bordeaux (40% of global fine wine market), Burgundy (DRC, Leroy, Rousseau), Barolo/Barbaresco (Giacomo Conterno, Gaja, Bruno Giacosa), Champagne (Krug, Salon), and Napa Valley (Screaming Eagle, Harlan Estate)."
      },
      {
        "name": "Investment Risk Levels",
        "description": "VinoInvest classifies investment wines into three risk tiers: (1) Basso/Low — First Growths, DRC, top producers with guaranteed liquidity; (2) Medio/Medium — Second-tier estates, emerging regions; (3) Alto/High — speculative vintages, ultra-rare allocations."
      },
      {
        "name": "How to Start Investing in Wine",
        "description": "Beginners should start with entry-level fine wine: Bordeaux Petits Châteaux (€20-50), Second Labels (€50-150), or well-rated Barolo from established producers (€60-200). Minimum recommended portfolio: €5,000. Diversify across regions and vintages."
      },
      {
        "name": "Wine Investment Returns",
        "description": "Historical average returns: Bordeaux First Growths +7%/year (10yr), DRC Burgundy +15%/year (10yr), Barolo Monfortino +12%/year (10yr), Champagne Prestige Cuvées +9%/year (10yr). Past performance does not guarantee future results."
      },
      {
        "name": "Vintage Quality Scoring",
        "description": "VinoInvest uses Open-Meteo historical climate data combined with critic consensus to generate Vintage Climate Scores (0-100) for major wine regions. Exceptional vintages (95+) typically command a 20-40% price premium at auction."
      },
      {
        "name": "Market Signals",
        "description": "VinoInvest generates Buy/Sell/Hold signals based on: price momentum (3/6/12 months), Liv-ex volume, critic score trends, vintage maturity curve, and AI portfolio analysis. Signals are updated daily."
      },
      ...getEducationTopicsForKnowledgeBase().map((t) => ({
        name: t.name,
        nameIt: t.nameIt,
        description: t.description,
        category: "education",
        difficulty: t.difficulty,
        estimatedMinutes: t.estimatedMinutes,
        apiEndpoint: `/api/academy/education/module/${t.slug}`,
      }))
    ],
    "dataSources": [
      { "name": "Liv-ex", "type": "Market Data", "description": "Global fine wine exchange — price benchmark" },
      { "name": "Wine Spectator", "type": "Critic Scores", "description": "100-point scale wine ratings" },
      { "name": "Robert Parker Wine Advocate", "type": "Critic Scores", "description": "100-point scale Bordeaux ratings" },
      { "name": "Decanter", "type": "Critic Scores", "description": "UK fine wine magazine scores" },
      { "name": "James Suckling", "type": "Critic Scores", "description": "Global wine ratings" },
      { "name": "CellarTracker", "type": "Community Data", "description": "600,000+ user tasting notes" },
      { "name": "Open-Meteo", "type": "Climate Data", "description": "Historical weather data for vintage scoring" },
      { "name": "Wikidata", "type": "Producer Data", "description": "Producer founding year, country, description" }
    ],
    "team": {
      "@type": "Organization",
      "name": "VinoInvest AI Research Team",
      "description": "A team of wine investment experts, data scientists, and AI engineers dedicated to democratizing fine wine investment intelligence.",
      "member": [
        {
          "@type": "Person",
          "name": "VinoInvest AI Engine",
          "jobTitle": "Autonomous Market Analysis System",
          "description": "Processes 50,000+ wine data points daily using Claude AI and proprietary algorithms."
        }
      ]
    },
    "contact": {
      "email": "info@vinoinvest.com",
      "apiDocs": "https://vinoinvest-backend-2.onrender.com/api/docs"
    }
  });
});

export default router;
