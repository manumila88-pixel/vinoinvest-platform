import { Router } from "express";
import { runAgent } from "../agents/portfolioAgent.js";
import { translateText } from "../services/translationService.js";

const router = Router();

// In-memory conversation histories per session (cleared on server restart)
const conversations = new Map();

// POST /api/agent/chat
router.post("/chat", async (req, res) => {
  const { message, sessionId, holdings = [], userId, lang } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "message required" });

  const sid = sessionId || userId || "anonymous";
  const history = conversations.get(sid) || [];
  const allWines = req._allWines || [];

  // Prepend language hint to message if non-Italian — agent prompt already says
  // "respond in the same language the user writes in", this makes it explicit
  const langHint = lang && lang !== "it" ? ` [respond in language: ${lang}]` : "";
  const enrichedMessage = message + langHint;

  try {
    const result = await runAgent({
      message: enrichedMessage,
      conversationHistory: history,
      holdings,
      allWines,
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
    });

    conversations.set(sid, result.conversationHistory);

    // Clean up sessions older than 1h (simple eviction)
    if (conversations.size > 1000) {
      const oldest = [...conversations.keys()][0];
      conversations.delete(oldest);
    }

    res.json({
      response: result.response,
      toolsUsed: result.toolsUsed,
      sessionId: sid,
    });
  } catch (err) {
    console.error("[agent/chat]", err.message);
    res.status(500).json({ error: "Agent error: " + err.message });
  }
});

// DELETE /api/agent/chat/:sessionId — clear conversation history
router.delete("/chat/:sessionId", (req, res) => {
  conversations.delete(req.params.sessionId);
  res.json({ cleared: true });
});

// GET /api/agent/opportunities?risk=medio&budget=500&lang=fr
router.get("/opportunities", async (req, res) => {
  const { risk = "medio", budget, lang } = req.query;
  const question = `Find the top wine investment opportunities${budget ? ` under €${budget}` : ""} with ${risk} risk. Use the get_top_opportunities tool and summarize the top 5 with brief reasoning for each.`;

  try {
    const result = await runAgent({
      message: question,
      holdings: [],
      allWines: req._allWines || [],
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
    });

    let response = result.response;
    const targetLang = lang?.slice(0, 2);
    if (targetLang && targetLang !== "en") {
      try {
        response = await translateText(response, targetLang, "en");
      } catch (e) { console.warn("[agent] Translation failed:", e.message); }
    }

    res.json({ response, toolsUsed: result.toolsUsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/agent/analyze-portfolio
router.post("/analyze-portfolio", async (req, res) => {
  const { holdings = [] } = req.body;
  if (!holdings.length) return res.status(400).json({ error: "holdings required" });

  const question = "Analyze my portfolio using calculate_portfolio_metrics, then give me 3 specific recommendations to improve it. Check market news for relevant context.";

  try {
    const result = await runAgent({
      message: question,
      holdings,
      allWines: req._allWines || [],
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
    });
    res.json({ response: result.response, toolsUsed: result.toolsUsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
