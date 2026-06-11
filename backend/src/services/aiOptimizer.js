import Anthropic from "@anthropic-ai/sdk";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// Haiku: $0.80/MTok input, $4/MTok output
// Sonnet: $3/MTok input, $15/MTok output
const MODEL_COSTS = {
  "claude-haiku-4-5-20251001": { in: 0.0000008, out: 0.000004 },
  "claude-sonnet-4-6": { in: 0.000003, out: 0.000015 },
};

const TOKEN_BUDGETS = {
  simple: { model: "claude-haiku-4-5-20251001", max_tokens: 512 },
  batch: { model: "claude-haiku-4-5-20251001", max_tokens: 1024 },
  agent: { model: "claude-haiku-4-5-20251001", max_tokens: 1000 },
  portfolio: { model: "claude-sonnet-4-6", max_tokens: 3000 },
  blog: { model: "claude-haiku-4-5-20251001", max_tokens: 700 },
};

// Rough token estimator: ~4 chars per token
export function estimateTokenCost(prompt, outputTokens = 200, model = "claude-haiku-4-5-20251001") {
  const inputTokens = Math.ceil(prompt.length / 4);
  const costs = MODEL_COSTS[model] || MODEL_COSTS["claude-haiku-4-5-20251001"];
  return {
    inputTokens,
    outputTokens,
    estimatedCostUsd: inputTokens * costs.in + outputTokens * costs.out,
  };
}

// Select model by task complexity
export function selectModel(taskComplexity) {
  return TOKEN_BUDGETS[taskComplexity] || TOKEN_BUDGETS.simple;
}

// Build compressed minimal prompt — strip articles, redundant words
export function buildCompressedPrompt(task, data) {
  const templates = {
    wine_score: (d) =>
      `Wine:${d.name}|Price:${d.price}|Region:${d.region}|Vintage:${d.vintage}|Score:${d.score}|Risk:${d.risk}\nJSON:{score:0-100,signal:BUY|HOLD|SELL,reason:"<20 words"}`,

    portfolio_analysis: (d) =>
      `Portfolio ${d.holdings.length} wines,value:€${d.totalValue},invested:€${d.totalInvested},ROI:${d.roi}%\nHoldings:${d.holdings.map(h => `${h.name}(${h.roi}%)`).join(",")}\nAnalyze:risks,diversification,top3 actions. JSON:{score,risks:[],actions:[],verdict}`,

    blog_article: (d) =>
      `SEO article Italian wine investment. Topic:"${d.title}". 350w. JSON:{title,slug,excerpt,content,category,readTime}`,

    opportunities: (d) =>
      `Top10 wines invest. Data:${JSON.stringify(d.wines.map(w => ({ id: w.id, name: w.name, score: w.investmentScore || w.investment_score, price: w.current_price, risk: w.risk, trend: w.market_trend })))}\nJSON:[{id,name,score,signal,reason:"<15w"}]`,

    batch_score: (d) =>
      `Score these wines for investment 0-100. JSON array same order:\n${d.wines.map((w, i) => `${i}.${w.name}|€${w.current_price}|${w.risk}|${w.market_trend}`).join("\n")}\n[{i,score,signal}]`,
  };

  const fn = templates[task];
  return fn ? fn(data) : JSON.stringify(data);
}

// Batch analyze up to 10 wines in one call
export async function batchAnalyzeWines(wines, taskType = "batch_score") {
  if (!process.env.ANTHROPIC_API_KEY) return wines.map((w, i) => ({ i, score: 70, signal: "HOLD" }));

  const batch = wines.slice(0, 10);
  const prompt = buildCompressedPrompt(taskType, { wines: batch });
  const { model, max_tokens } = selectModel("batch");

  try {
    const msg = await client.messages.create({
      model,
      max_tokens,
      system: "Wine investment AI. Return only valid JSON array. No markdown.",
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content[0]?.text || "[]";
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    return jsonStart >= 0 ? JSON.parse(text.slice(jsonStart, jsonEnd)) : [];
  } catch (e) {
    console.error("[batchAnalyze]", e.message);
    return [];
  }
}

// Cached system prompt using Anthropic prompt caching (saves 90% on repeat calls)
const CACHED_SYSTEM = [
  {
    type: "text",
    text: "Expert wine investment AI. Return JSON only. No markdown. Be concise.",
    cache_control: { type: "ephemeral" },
  },
];

export async function cachedCall({ task, data, complexity = "agent", trackUsage = null }) {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const { model, max_tokens } = selectModel(complexity);
  const userPrompt = buildCompressedPrompt(task, data);

  const est = estimateTokenCost(userPrompt, max_tokens, model);
  if (est.estimatedCostUsd > 0.05) {
    console.warn(`[aiOptimizer] High cost call: $${est.estimatedCostUsd.toFixed(4)} for ${task}`);
  }

  try {
    const msg = await client.messages.create({
      model,
      max_tokens,
      system: CACHED_SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    });

    if (trackUsage) {
      await trackUsage({
        model,
        tokens_input: msg.usage?.input_tokens || est.inputTokens,
        tokens_output: msg.usage?.output_tokens || 200,
        cost_usd: est.estimatedCostUsd,
        endpoint: task,
      });
    }

    const text = msg.content[0]?.text || "";
    const s = text.indexOf("{") >= 0 ? text.indexOf("{") : text.indexOf("[");
    const e = text.lastIndexOf("}") >= 0 ? text.lastIndexOf("}") + 1 : text.lastIndexOf("]") + 1;
    return s >= 0 ? JSON.parse(text.slice(s, e)) : null;
  } catch (err) {
    console.error(`[aiOptimizer] ${task}:`, err.message);
    return null;
  }
}
