import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
let _client = null;
function getClient() {
  if (!_client && process.env.ANTHROPIC_API_KEY) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// Cache per userId: 6 ore (portafoglio cambia poco)
const analysisCache = new Map();
const CACHE_TTL = 6 * 60 * 60 * 1000;

// POST /api/ai/portfolio-analysis
router.post("/portfolio-analysis", async (req, res) => {
  const { userId, holdings, totalValue, totalInvested } = req.body;

  if (!holdings?.length) {
    return res.status(400).json({ error: "No holdings provided" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json(fallbackAnalysis(holdings, totalValue, totalInvested));
  }

  const cacheKey = `${userId}_${JSON.stringify([...holdings].sort((a,b) => a.id < b.id ? -1 : 1).map(h => h.id + h.quantity))}`;
  const cached = analysisCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  const portfolioText = holdings.map(h =>
    `- ${h.name} (${h.id}): ${h.quantity} bottles, bought @ €${h.purchasePrice}, current @ €${h.currentPrice}, ROI: ${h.roi}%, invested: €${h.invested?.toFixed(0)}`
  ).join("\n");

  const totalProfit = (totalValue - totalInvested).toFixed(0);
  const roi = totalInvested > 0 ? (((totalValue - totalInvested) / totalInvested) * 100).toFixed(1) : 0;

  const prompt = `You are a fine wine investment analyst. Analyze this wine portfolio and provide actionable investment advice.

PORTFOLIO SUMMARY:
- Total Value: €${totalValue?.toFixed(0)}
- Total Invested: €${totalInvested?.toFixed(0)}
- Total Profit/Loss: €${totalProfit}
- Overall ROI: ${roi}%

HOLDINGS:
${portfolioText}

Respond with a JSON object (no markdown, pure JSON) with this exact structure:
{
  "summary": "2-3 sentence portfolio overview",
  "overallSignal": "Strong Buy|Buy|Hold|Reduce|Sell",
  "riskScore": 1-10,
  "diversificationScore": 1-10,
  "recommendations": [
    { "wineId": "id", "action": "Hold|Buy More|Sell|Reduce", "reason": "short reason", "urgency": "High|Medium|Low" }
  ],
  "topPicks": ["wineId1", "wineId2"],
  "concerns": ["concern1", "concern2"],
  "marketOutlook": "Bullish|Neutral|Bearish",
  "suggestedAllocation": { "Bordeaux": 30, "Burgundy": 25, "Italy": 20, "Other": 25 }
}`;

  try {
    const msg = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = msg.content[0]?.text?.trim() || "{}";
    let analysis;
    try {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      analysis = JSON.parse(text.slice(jsonStart, jsonEnd));
    } catch {
      analysis = fallbackAnalysis(holdings, totalValue, totalInvested);
    }

    const result = { ...analysis, generatedAt: new Date().toISOString(), cached: false };
    analysisCache.set(cacheKey, { data: result, ts: Date.now() });
    res.json(result);
  } catch (e) {
    console.error("[aiPortfolio] Claude error:", e.message);
    res.json(fallbackAnalysis(holdings, totalValue, totalInvested));
  }
});

function fallbackAnalysis(holdings, totalValue, totalInvested) {
  const roi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  const isProfit = roi >= 0;

  const recommendations = holdings.map(h => ({
    wineId: h.id,
    action: Number(h.roi) > 15 ? "Hold" : Number(h.roi) < -10 ? "Reduce" : "Buy More",
    reason: Number(h.roi) > 15 ? "Strong performer, maintain position" : Number(h.roi) < -10 ? "Underperforming, consider reducing exposure" : "Stable position with growth potential",
    urgency: "Low",
  }));

  return {
    summary: `Portfolio of ${holdings.length} wines with ${isProfit ? "positive" : "negative"} overall performance. ${roi >= 0 ? "Well positioned for continued growth." : "Consider rebalancing to improve returns."}`,
    overallSignal: roi > 10 ? "Buy" : roi > 0 ? "Hold" : "Reduce",
    riskScore: 5,
    diversificationScore: Math.min(10, holdings.length * 2),
    recommendations,
    topPicks: holdings.slice(0, 2).map(h => h.id),
    concerns: roi < 0 ? ["Negative overall ROI"] : ["Monitor for market volatility"],
    marketOutlook: "Neutral",
    suggestedAllocation: { Bordeaux: 30, Burgundy: 25, Italy: 20, Other: 25 },
    generatedAt: new Date().toISOString(),
    cached: false,
    fallback: true,
  };
}

export default router;
