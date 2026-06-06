import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Tool definitions for Claude tool use
const TOOLS = [
  {
    name: "get_wine_price_history",
    description: "Get price history for a specific wine over a given timeframe",
    input_schema: {
      type: "object",
      properties: {
        wineId: { type: "string", description: "Wine ID (e.g., 'lafite-2018')" },
        timeframe: { type: "string", enum: ["1m", "3m", "6m", "1y", "3y", "5y"], description: "Time period for price data" },
      },
      required: ["wineId"],
    },
  },
  {
    name: "get_market_news",
    description: "Get latest fine wine market news and analysis",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string", enum: ["all", "FR", "IT", "US", "AU", "ZA"], description: "Filter by country" },
        category: { type: "string", enum: ["all", "auction", "critic", "investment", "market"], description: "Filter by news category" },
      },
    },
  },
  {
    name: "search_wines",
    description: "Search for wines matching specific criteria",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (name, producer, region)" },
        limit: { type: "number", description: "Maximum results to return (default 5)" },
      },
      required: ["query"],
    },
  },
  {
    name: "calculate_portfolio_metrics",
    description: "Calculate ROI, diversification score, and risk metrics for a wine portfolio",
    input_schema: {
      type: "object",
      properties: {
        holdings: {
          type: "array",
          description: "List of portfolio holdings",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              quantity: { type: "number" },
              purchasePrice: { type: "number" },
              currentPrice: { type: "number" },
            },
          },
        },
      },
      required: ["holdings"],
    },
  },
  {
    name: "get_exchange_rates",
    description: "Get current EUR exchange rates for major currencies",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_top_opportunities",
    description: "Get top 10 wine investment opportunities based on AI score, price trend, and market data",
    input_schema: {
      type: "object",
      properties: {
        riskLevel: { type: "string", enum: ["basso", "medio", "alto"], description: "Risk tolerance" },
        budget: { type: "number", description: "Maximum budget per bottle in EUR" },
      },
    },
  },
];

// Tool execution functions
async function executeTool(name, input, { allWines, API_URL }) {
  switch (name) {
    case "get_wine_price_history": {
      try {
        const r = await fetch(`${API_URL}/api/prices/${encodeURIComponent(input.wineId)}/history?currentPrice=100&timeframe=${input.timeframe || "1y"}`, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        const pts = d.history || [];
        if (!pts.length) return { error: "No price history available" };
        const prices = pts.map(p => Number(p.price));
        const first = prices[0], last = prices[prices.length - 1];
        return {
          wineId: input.wineId,
          timeframe: input.timeframe || "1y",
          points: pts.length,
          startPrice: first,
          endPrice: last,
          changePercent: ((last - first) / first * 100).toFixed(1),
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          source: d.source,
        };
      } catch (e) {
        return { error: e.message };
      }
    }

    case "get_market_news": {
      try {
        const params = new URLSearchParams();
        if (input.country && input.country !== "all") params.set("country", input.country);
        if (input.category && input.category !== "all") params.set("category", input.category);
        const r = await fetch(`${API_URL}/api/news?${params}`, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return { articles: (d.articles || []).slice(0, 5).map(a => ({ title: a.title, description: a.description?.slice(0, 200), source: a.source?.name, date: a.publishedAt, category: a.category })), source: d.source };
      } catch (e) {
        return { error: e.message };
      }
    }

    case "search_wines": {
      const limit = input.limit || 5;
      const q = (input.query || "").toLowerCase();
      const results = allWines
        .filter(w => `${w.name} ${w.producer} ${w.region}`.toLowerCase().includes(q))
        .slice(0, limit)
        .map(w => ({ id: w.id, name: w.name, producer: w.producer, region: w.region, vintage: w.vintage, price: w.currentPrice || w.current_price, score: w.investmentScore || w.investment_score, risk: w.risk }));
      return { results, total: results.length };
    }

    case "calculate_portfolio_metrics": {
      const h = input.holdings || [];
      const totalInvested = h.reduce((s, x) => s + x.purchasePrice * x.quantity, 0);
      const totalValue = h.reduce((s, x) => s + x.currentPrice * x.quantity, 0);
      const roi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested * 100).toFixed(1) : 0;
      const diversificationScore = Math.min(10, Math.round(h.length * 1.5));
      const avgPrice = h.length > 0 ? h.reduce((s, x) => s + x.currentPrice, 0) / h.length : 0;
      return {
        totalInvested: Math.round(totalInvested),
        totalValue: Math.round(totalValue),
        totalProfit: Math.round(totalValue - totalInvested),
        roi: Number(roi),
        diversificationScore,
        positions: h.length,
        avgBottlePrice: Math.round(avgPrice),
        topPerformer: h.sort((a, b) => (b.currentPrice - b.purchasePrice) - (a.currentPrice - a.purchasePrice))[0]?.name || "—",
      };
    }

    case "get_exchange_rates": {
      try {
        const r = await fetch(`${API_URL}/api/rates`, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return { rates: d.rates, base: "EUR", updated: d.updated };
      } catch (e) {
        return { error: e.message };
      }
    }

    case "get_top_opportunities": {
      const budget = input.budget || Infinity;
      const risk = input.riskLevel || "medio";
      const wines = allWines
        .filter(w => {
          const price = w.currentPrice || w.current_price || 0;
          const wRisk = (w.risk || "").toLowerCase();
          const matchRisk = risk === "medio" ? (wRisk === "medio" || wRisk === "basso") : wRisk === risk;
          return price > 0 && price <= budget && matchRisk;
        })
        .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
        .slice(0, 10)
        .map(w => ({
          id: w.id,
          name: w.name,
          producer: w.producer,
          region: w.region,
          vintage: w.vintage,
          price: w.currentPrice || w.current_price,
          score: w.investmentScore || w.investment_score,
          risk: w.risk,
          trend: w.marketTrend || w.market_trend,
        }));
      return { opportunities: wines, count: wines.length, criteria: { risk, maxBudget: budget } };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// Main agent function — chat with tool use
export async function runAgent({ message, conversationHistory = [], holdings = [], allWines = [], API_URL = "https://vinoinvest-backend-2.onrender.com" }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      response: "AI Agent non disponibile — configura ANTHROPIC_API_KEY su Render.",
      toolsUsed: [],
      conversationHistory,
    };
  }

  const systemPrompt = `You are VinoInvest AI Agent, an expert fine wine investment advisor with access to real-time tools.
You help users analyze their wine portfolio, find investment opportunities, and understand market trends.

${holdings.length > 0 ? `
CURRENT USER PORTFOLIO (${holdings.length} wines):
${holdings.map(h => `- ${h.name}: ${h.quantity} btl @ €${h.purchasePrice} → current €${h.currentPrice} (ROI: ${h.roi}%)`).join("\n")}
Total value: €${holdings.reduce((s, h) => s + h.currentValue, 0).toFixed(0)}
` : "User has no portfolio positions yet."}

Always respond in the same language the user writes in. Be concise and actionable.
When analyzing, always use the available tools to get real data before making recommendations.
Format monetary values in EUR. Use specific wine names and data from tool results.`;

  const messages = [
    ...conversationHistory,
    { role: "user", content: message },
  ];

  const toolsUsed = [];
  let finalResponse = "";

  // Agentic loop — keep running until no more tool calls
  for (let step = 0; step < 6; step++) {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      finalResponse = response.content.filter(b => b.type === "text").map(b => b.text).join("");
      messages.push({ role: "assistant", content: response.content });
      break;
    }

    if (response.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: response.content });

      const toolResults = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        toolsUsed.push(block.name);
        const result = await executeTool(block.name, block.input, { allWines, API_URL });
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }

      messages.push({ role: "user", content: toolResults });
    } else {
      // Unexpected stop reason
      break;
    }
  }

  // Keep last 10 messages for conversation history (avoid token bloat)
  const updatedHistory = messages.slice(-10);

  return {
    response: finalResponse,
    toolsUsed,
    conversationHistory: updatedHistory,
  };
}
