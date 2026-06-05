import Anthropic from "@anthropic-ai/sdk";

let pool = null;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    import("../db/pool.js").then(m => { pool = m.pool; }).catch(() => {});
  }
  return pool;
}

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

let tableReady = false;

async function ensureTable() {
  const db = getPool();
  if (!db || tableReady) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_scores (
        wine_id TEXT PRIMARY KEY,
        score INTEGER NOT NULL,
        breakdown JSONB NOT NULL,
        signal TEXT,
        reasoning TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
      )
    `);
    tableReady = true;
  } catch (e) {
    console.warn("[aiScore] Table init failed:", e.message);
  }
}

async function getCached(wineId) {
  const db = getPool();
  if (!db) return null;
  try {
    const { rows } = await db.query(
      `SELECT score, breakdown, signal, reasoning FROM ai_scores
       WHERE wine_id = $1 AND expires_at > NOW()`,
      [wineId]
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function saveScore(wineId, data) {
  const db = getPool();
  if (!db) return;
  try {
    await db.query(
      `INSERT INTO ai_scores (wine_id, score, breakdown, signal, reasoning)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (wine_id) DO UPDATE SET
         score      = EXCLUDED.score,
         breakdown  = EXCLUDED.breakdown,
         signal     = EXCLUDED.signal,
         reasoning  = EXCLUDED.reasoning,
         created_at = NOW(),
         expires_at = NOW() + INTERVAL '7 days'`,
      [wineId, data.score, JSON.stringify(data.breakdown), data.signal, data.reasoning]
    );
  } catch (e) {
    console.warn("[aiScore] Save failed:", e.message);
  }
}

function algorithmicScore(wine) {
  const criticScore = wine.criticScore || wine.investmentScore || 90;
  const vintage = parseInt(wine.vintage) || 2015;
  const age = Math.max(0, 2026 - vintage);
  const risk = wine.risk || "Medio";
  const trend = wine.marketTrend || "Stable";

  const critic = Math.min(100, Math.max(0, Math.round((criticScore - 78) * 5)));
  const vintageScore = Math.min(100, Math.max(0, 30 + age * 4));
  const market = trend === "Bullish" ? 82 : trend === "Bearish" ? 28 : 52;
  const riskAdj = risk === "Basso" ? 80 : risk === "Medio" ? 60 : 35;
  const producer = Math.min(100, Math.round(criticScore * 0.88));

  const score = Math.min(100, Math.max(0, Math.round(
    critic * 0.25 + vintageScore * 0.20 + market * 0.25 + riskAdj * 0.15 + producer * 0.15
  )));

  return {
    score,
    breakdown: { vintage: vintageScore, producer, market, critic, risk_adjusted: riskAdj },
    signal: score >= 80 ? "Strong Buy" : score >= 65 ? "Buy" : score >= 45 ? "Hold" : "Sell",
    reasoning: `Score basato su dati statici: critico ${criticScore}/100, annata ${vintage} (${age}a), trend ${trend}, rischio ${risk}.`,
  };
}

export async function getAIScore(wine) {
  await ensureTable();

  const cached = await getCached(wine.id);
  if (cached) {
    return {
      wineId: wine.id,
      score: cached.score,
      breakdown: cached.breakdown,
      signal: cached.signal,
      reasoning: cached.reasoning,
      cached: true,
    };
  }

  if (!client) {
    return { wineId: wine.id, ...algorithmicScore(wine), cached: false, estimated: true };
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{
        role: "user",
        content: `You are an expert fine wine investment analyst. Score this wine for investment potential.

Wine: ${wine.name}
Producer: ${wine.producer || "Unknown"}
Vintage: ${wine.vintage || "NV"}
Region: ${wine.region || "Unknown"}
Critic Score: ${wine.criticScore || wine.investmentScore || 90}/100
Market Trend: ${wine.marketTrend || "Stable"}
Risk Level: ${wine.risk || "Medio"}
Current Price: €${wine.currentPrice || 0}

Respond ONLY with valid JSON, no markdown:
{
  "score": <integer 0-100>,
  "breakdown": {
    "vintage": <integer 0-100>,
    "producer": <integer 0-100>,
    "market": <integer 0-100>,
    "critic": <integer 0-100>,
    "risk_adjusted": <integer 0-100>
  },
  "signal": "<Strong Buy|Buy|Hold|Sell>",
  "reasoning": "<2 sentences on investment thesis>"
}`,
      }],
    });

    const text = message.content[0].text.trim();
    const parsed = JSON.parse(text);
    const clamp = v => Math.min(100, Math.max(0, parseInt(v) || 0));
    const valid = ["Strong Buy", "Buy", "Hold", "Sell"];

    const result = {
      score: clamp(parsed.score),
      breakdown: {
        vintage: clamp(parsed.breakdown?.vintage),
        producer: clamp(parsed.breakdown?.producer),
        market: clamp(parsed.breakdown?.market),
        critic: clamp(parsed.breakdown?.critic),
        risk_adjusted: clamp(parsed.breakdown?.risk_adjusted),
      },
      signal: valid.includes(parsed.signal) ? parsed.signal : "Hold",
      reasoning: String(parsed.reasoning || ""),
    };

    await saveScore(wine.id, result);
    return { wineId: wine.id, ...result, cached: false };
  } catch (e) {
    console.warn("[aiScore] Claude API error:", e.message);
    const fallback = algorithmicScore(wine);
    await saveScore(wine.id, fallback);
    return { wineId: wine.id, ...fallback, cached: false, estimated: true };
  }
}
