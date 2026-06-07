/**
 * Proactive portfolio analysis job.
 * Runs every 15 minutes. For each user with holdings, triggers a lightweight
 * algorithmic analysis and stores results in-memory so the frontend can
 * poll GET /api/ai/proactive-analysis/:userId for instant results.
 *
 * When ANTHROPIC_API_KEY is set, one analysis per user per hour uses Claude.
 * Without it, uses the algorithmic fallback from portfolioAgent.
 */

import cron from "node-cron";
import { runAgent } from "../agents/portfolioAgent.js";

// In-memory store: userId → { analysis, ts, holdings_hash }
export const proactiveResults = new Map();

// Mock user portfolio store — in production this would be DB-driven.
// We pull holdings from the /api/orders table if DB is available.
let pool = null;
export function setAnalysisPool(p) { pool = p; }

const CLAUDE_INTERVAL_MS = 60 * 60 * 1000; // Claude: once per user per hour
const ALGO_INTERVAL_MS = 15 * 60 * 1000;   // Algorithmic: every 15 min

function holdingsHash(holdings) {
  return holdings.map(h => `${h.wineId}:${h.quantity}`).sort().join("|");
}

async function getUserHoldings() {
  if (!pool) return [];
  try {
    const { rows } = await pool.query(`
      SELECT
        o.user_id,
        o.wine_id,
        o.quantity,
        o.price AS purchase_price,
        w.name,
        w.current_price,
        w.investment_score,
        w.risk
      FROM orders o
      JOIN wines w ON w.id = o.wine_id
      WHERE o.status = 'completed'
      ORDER BY o.user_id, o.created_at DESC
    `);

    // Group by user
    const byUser = {};
    rows.forEach(r => {
      if (!byUser[r.user_id]) byUser[r.user_id] = [];
      byUser[r.user_id].push({
        wineId: r.wine_id,
        name: r.name,
        quantity: r.quantity,
        purchasePrice: parseFloat(r.purchase_price),
        currentPrice: parseFloat(r.current_price),
        investmentScore: r.investment_score,
        risk: r.risk,
        roi: r.purchase_price > 0
          ? (((r.current_price - r.purchase_price) / r.purchase_price) * 100).toFixed(1)
          : "0",
      });
    });

    return Object.entries(byUser).map(([userId, holdings]) => ({ userId, holdings }));
  } catch (e) {
    console.warn("[portfolioAnalysisJob] DB query failed:", e.message);
    return [];
  }
}

async function analyzeUser(userId, holdings, allWines) {
  const cached = proactiveResults.get(userId);
  const hash = holdingsHash(holdings);
  const now = Date.now();

  if (cached && cached.holdings_hash === hash) {
    const useClaudeInterval = process.env.ANTHROPIC_API_KEY ? CLAUDE_INTERVAL_MS : ALGO_INTERVAL_MS;
    if (now - cached.ts < useClaudeInterval) return; // still fresh
  }

  try {
    const result = await runAgent({
      message: "Analizza il mio portfolio e dammi 3 raccomandazioni specifiche per migliorarlo. Sii breve e diretto.",
      conversationHistory: [],
      holdings,
      allWines,
      API_URL: process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com",
      lang: "it",
    });

    proactiveResults.set(userId, {
      analysis: result.response,
      suggestedWines: result.suggestedWines || [],
      toolsUsed: result.toolsUsed || [],
      mode: result.mode,
      holdings_hash: hash,
      ts: now,
      userId,
    });
  } catch (e) {
    console.warn(`[portfolioAnalysisJob] Analysis failed for ${userId}:`, e.message);
  }
}

let allWinesRef = [];
export function setWinesRef(wines) { allWinesRef = wines; }

// Run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("[portfolioAnalysisJob] Running proactive portfolio analysis...");

  const users = await getUserHoldings();
  if (!users.length) {
    console.log("[portfolioAnalysisJob] No users with holdings, skipping.");
    return;
  }

  let analyzed = 0;
  for (const { userId, holdings } of users) {
    await analyzeUser(userId, holdings, allWinesRef);
    analyzed++;
    // Small delay to avoid hammering the AI API
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`[portfolioAnalysisJob] Done. Analyzed ${analyzed} users.`);
});

console.log("[portfolioAnalysisJob] Proactive analysis cron registered (every 15 min).");
