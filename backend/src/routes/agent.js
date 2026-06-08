import { Router } from "express";
import { createRequire } from "module";
import { runAgent, executeTool, getFollowUpSuggestions } from "../agents/portfolioAgent.js";
import { translateText } from "../services/translationService.js";
import { FAQ, getFAQByCategory, searchFAQ, CATEGORIES } from "../data/wineKnowledge.js";

let agentPool = null;
export const setAgentPool = (p) => { agentPool = p; };

async function searchWinesFromDB(query, limit = 12) {
  if (!agentPool) return [];
  try {
    const q = `%${query.toLowerCase()}%`;
    const { rows } = await agentPool.query(`
      SELECT id, name, producer, vintage, current_price, investment_score,
             risk, market_trend, type, region, image_url
      FROM wines
      WHERE LOWER(name) LIKE $1 OR LOWER(producer) LIKE $1
        OR LOWER(region) LIKE $1 OR LOWER(type) LIKE $1
      ORDER BY investment_score DESC NULLS LAST, current_price DESC
      LIMIT $2
    `, [q, limit]);
    return rows;
  } catch { return []; }
}

const router = Router();

// Fallback wine catalog — used when req._allWines is not injected by server.js
const _require = createRequire(import.meta.url);
let _fallbackWines = null;
function getFallbackWines() {
  if (_fallbackWines) return _fallbackWines;
  try {
    const wines = _require("../data/wines.json");
    const external = _require("../data/externalWines.json");
    const big = _require("../data/bigWines.json");
    _fallbackWines = [...wines, ...external, ...big];
  } catch { _fallbackWines = []; }
  return _fallbackWines;
}

// In-memory conversation histories (cleared on server restart)
const conversations = new Map();
const MAX_SESSIONS = 1000;

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  const { message, sessionId, holdings = [], userId, lang, conversationHistory } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "message required" });

  const sid = sessionId || userId || "anonymous";
  const history = conversationHistory || conversations.get(sid) || [];
  const allWines = req._allWines?.length ? req._allWines : getFallbackWines();
  const detectedLang = lang?.slice(0, 2) || "it";

  try {
    const result = await runAgent({
      message,
      conversationHistory: history,
      holdings,
      allWines,
      searchWinesFromDB,
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
      lang: detectedLang,
    });

    conversations.set(sid, result.conversationHistory);

    // Evict oldest sessions when limit reached
    if (conversations.size > MAX_SESSIONS) {
      conversations.delete([...conversations.keys()][0]);
    }

    res.json({
      response: result.response,
      suggestedWines: result.suggestedWines || [],
      resourceLinks: result.resourceLinks || [],
      toolsUsed: result.toolsUsed || [],
      followUpSuggestions: result.followUpSuggestions || [],
      intent: result.intent || "general",
      mode: result.mode || "algorithmic",
      sessionId: sid,
    });
  } catch (err) {
    console.error("[agent/chat] Error:", err.message);
    // Never return 500 — always give useful fallback response
    res.json({
      response: detectedLang === "it"
        ? "Mi dispiace, sto avendo difficoltà a elaborare la tua richiesta. Prova a riformulare la domanda o visita [wine-searcher.com](https://www.wine-searcher.com) per prezzi aggiornati."
        : "Sorry, I had trouble processing your request. Try rephrasing or visit [wine-searcher.com](https://www.wine-searcher.com) for current prices.",
      suggestedWines: [],
      resourceLinks: [{ url: "https://www.wine-searcher.com", label: "wine-searcher.com" }],
      toolsUsed: [],
      mode: "fallback",
      sessionId: sid,
    });
  }
});

// DELETE /api/agent/chat/:sessionId
router.delete("/chat/:sessionId", (req, res) => {
  conversations.delete(req.params.sessionId);
  res.json({ cleared: true });
});

// GET /api/agent/opportunities
router.get("/opportunities", async (req, res) => {
  const { risk = "medio", budget, lang = "it" } = req.query;
  const message = budget
    ? `Trova le migliori opportunità di investimento entro €${budget} con rischio ${risk}`
    : `Trova le top 5 opportunità di investimento in vino con rischio ${risk}`;
  try {
    const result = await runAgent({
      message,
      holdings: [],
      allWines: req._allWines?.length ? req._allWines : getFallbackWines(),
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
      lang: lang.slice(0, 2),
    });
    res.json({ response: result.response, suggestedWines: result.suggestedWines || [], toolsUsed: result.toolsUsed });
  } catch (err) {
    res.json({ response: "Nessuna opportunità disponibile al momento.", suggestedWines: [], toolsUsed: [] });
  }
});

// POST /api/agent/analyze-portfolio
router.post("/analyze-portfolio", async (req, res) => {
  const { holdings = [], lang = "it" } = req.body;
  if (!holdings.length) return res.status(400).json({ error: "holdings required" });
  try {
    const result = await runAgent({
      message: "Analizza il mio portfolio e dammi 3 raccomandazioni specifiche per migliorarlo",
      holdings,
      allWines: req._allWines?.length ? req._allWines : getFallbackWines(),
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
      lang: lang.slice(0, 2),
    });
    res.json({ response: result.response, suggestedWines: result.suggestedWines || [], toolsUsed: result.toolsUsed });
  } catch (err) {
    res.json({ response: "Impossibile analizzare il portfolio al momento.", suggestedWines: [], toolsUsed: [] });
  }
});

// GET /api/agent/similar/:wineId — find similar wines
router.get("/similar/:wineId", async (req, res) => {
  const { lang = "it" } = req.query;
  const allWines = req._allWines?.length ? req._allWines : getFallbackWines();
  const wine = allWines.find(w => w.id === req.params.wineId);
  if (!wine) return res.json({ wines: [] });
  try {
    const result = await executeTool("search_wines", { query: wine.region || wine.type || wine.name.split(" ")[0], limit: 6 }, { allWines, API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com" });
    const similar = (result.results || []).filter(w => w.id !== req.params.wineId).slice(0, 5);
    res.json({ wines: similar, basedOn: wine.name });
  } catch (err) {
    res.json({ wines: [] });
  }
});

// GET /api/faq — wine knowledge base FAQs
router.get("/faq", (req, res) => {
  const { category, q, limit } = req.query;
  let results = q ? searchFAQ(q) : getFAQByCategory(category);
  if (limit) results = results.slice(0, parseInt(limit, 10));
  res.json({ faqs: results, total: results.length, categories: CATEGORIES });
});

// GET /api/faq/categories
router.get("/faq/categories", (_req, res) => {
  res.json({ categories: CATEGORIES });
});

export default router;
