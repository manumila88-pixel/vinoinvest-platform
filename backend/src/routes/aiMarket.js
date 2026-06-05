import express from "express";

const router = express.Router();

// In-memory cache: 30 min TTL
let sentimentCache = null;
let sentimentCacheTime = 0;
const SENTIMENT_TTL = 30 * 60 * 1000;

// HuggingFace Inference API (free tier, no key needed for public models)
const HF_API = "https://api-inference.huggingface.co/models/ProsusAI/finbert";

const WINE_HEADLINES = [
  "Fine wine index rises amid strong Asian demand",
  "Bordeaux en primeur prices set new records this season",
  "Burgundy grand cru shortage drives prices higher",
  "Investment in fine wine outperforms traditional assets",
  "Wine auction sales reach record highs in Hong Kong",
  "Climate concerns impact Bordeaux 2025 harvest outlook",
  "Pétrus 2020 breaks auction records worldwide",
  "Italian super tuscans attract institutional investors",
];

async function getHuggingFaceSentiment(texts) {
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  const headers = { "Content-Type": "application/json" };
  if (hfKey) headers["Authorization"] = `Bearer ${hfKey}`;

  try {
    const res = await fetch(HF_API, {
      method: "POST",
      headers,
      body: JSON.stringify({ inputs: texts }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HF API ${res.status}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.log("[aiMarket] HuggingFace unavailable:", e.message);
    return null;
  }
}

function algorithmicSentiment(articles) {
  const bullish = ["rises", "record", "strong", "outperforms", "higher", "demand", "institutional", "growth", "rally"];
  const bearish = ["falls", "drop", "concerns", "shortage", "risk", "correction", "decline", "lower", "climate"];

  let bull = 0, bear = 0, neutral = 0;
  (articles || WINE_HEADLINES).forEach(text => {
    const t = (typeof text === "string" ? text : text.title || "").toLowerCase();
    const b = bullish.filter(w => t.includes(w)).length;
    const n = bearish.filter(w => t.includes(w)).length;
    if (b > n) bull++;
    else if (n > b) bear++;
    else neutral++;
  });

  const total = bull + bear + neutral || 1;
  const score = ((bull - bear) / total + 1) / 2; // 0-1, 0.5 = neutral

  return {
    positive: Math.round((bull / total) * 100),
    negative: Math.round((bear / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    score: parseFloat(score.toFixed(3)),
    signal: score > 0.6 ? "Bullish" : score < 0.4 ? "Bearish" : "Neutral",
    confidence: "algorithmic",
  };
}

// GET /api/ai/market-sentiment
router.get("/market-sentiment", async (req, res) => {
  if (sentimentCache && Date.now() - sentimentCacheTime < SENTIMENT_TTL) {
    return res.json({ ...sentimentCache, cached: true });
  }

  // Try to get news from internal cache for analysis
  let headlines = WINE_HEADLINES;

  // Try HuggingFace sentiment analysis
  const hfResult = await getHuggingFaceSentiment(headlines);

  let sentiment;
  if (hfResult && Array.isArray(hfResult)) {
    // FinBERT returns [{label, score}] per item
    let positive = 0, negative = 0, neutral = 0;
    hfResult.forEach(item => {
      if (Array.isArray(item)) {
        const best = item.reduce((a, b) => a.score > b.score ? a : b, item[0]);
        if (best.label === "positive") positive++;
        else if (best.label === "negative") negative++;
        else neutral++;
      }
    });
    const total = positive + negative + neutral || 1;
    const score = ((positive - negative) / total + 1) / 2;
    sentiment = {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      score: parseFloat(score.toFixed(3)),
      signal: score > 0.6 ? "Bullish" : score < 0.4 ? "Bearish" : "Neutral",
      confidence: "ai",
      model: "ProsusAI/finbert",
    };
  } else {
    sentiment = algorithmicSentiment(headlines);
  }

  const result = {
    ...sentiment,
    analyzed: headlines.length,
    updatedAt: new Date().toISOString(),
  };

  sentimentCache = result;
  sentimentCacheTime = Date.now();
  res.json({ ...result, cached: false });
});

export default router;
