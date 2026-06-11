/**
 * Personalization Engine — generates tailored content for each user
 * based on their profile, portfolio, and behavior.
 */

let pool;
export const setPersonalizationPool = (p) => { pool = p; };

/**
 * Returns personalized content for a user.
 * @param {string} userId
 * @param {Array} allWines — full wine catalog
 * @param {Array} recentNews — fetched from RSS
 */
export async function getPersonalizedContent(userId, allWines = [], recentNews = []) {
  let profile = {};
  let orders = [];
  let alerts = [];

  if (pool) {
    try {
      // Get user profile (interests stored in users table)
      const { rows: users } = await pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [userId]).catch(() => ({ rows: [] }));
      profile = users[0] || {};

      // Get user portfolio
      const { rows: orderRows } = await pool.query("SELECT * FROM orders WHERE user_id = $1 LIMIT 20", [userId]).catch(() => ({ rows: [] }));
      orders = orderRows;

      // Get user alerts
      const { rows: alertRows } = await pool.query("SELECT * FROM price_alerts WHERE user_id = $1 AND active = true LIMIT 10", [userId]).catch(() => ({ rows: [] }));
      alerts = alertRows;
    } catch (e) { console.warn("[personalization]", e.message); }
  }

  const preferredRegions = profile.preferred_regions || inferRegionsFromOrders(orders, allWines);
  const preferredTypes = profile.preferred_types || [];

  // Score wines by relevance
  const scoredWines = allWines
    .filter(w => w.currentPrice > 0)
    .map(w => ({
      ...w,
      relevance: scoreWineRelevance(w, preferredRegions, preferredTypes, orders),
    }))
    .filter(w => w.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  // Filter news by relevance
  const scoredNews = recentNews
    .map(n => ({
      ...n,
      relevance: scoreNewsRelevance(n, preferredRegions, orders),
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  // Portfolio summary
  const portfolioValue = orders.reduce((s, o) => s + (parseFloat(o.current_market_price || o.purchase_price || 0) * (o.quantity || 1)), 0);
  const portfolioInvested = orders.reduce((s, o) => s + (parseFloat(o.purchase_price || 0) * (o.quantity || 1)), 0);

  const topPerformer = orders.length > 0 ? orders.reduce((best, o) => {
    const roi = o.purchase_price > 0 ? (o.current_market_price - o.purchase_price) / o.purchase_price : 0;
    const bRoi = best.purchase_price > 0 ? (best.current_market_price - best.purchase_price) / best.purchase_price : 0;
    return roi > bRoi ? o : best;
  }, orders[0]) : null;

  return {
    userId,
    firstName: profile.first_name || extractFirstName(profile.email || ""),
    preferredRegions,
    preferredTypes,
    recommendedWines: scoredWines.slice(0, 3),
    relevantNews: scoredNews.slice(0, 3),
    topOpportunity: scoredWines[0] || null,
    portfolio: {
      value: portfolioValue,
      invested: portfolioInvested,
      roi: portfolioInvested > 0 ? ((portfolioValue - portfolioInvested) / portfolioInvested * 100).toFixed(1) : null,
      count: orders.length,
      topPerformer,
    },
    activeAlerts: alerts.length,
    profile,
  };
}

function scoreWineRelevance(wine, regions, types, orders) {
  let score = 0;
  const name = (wine.name || wine.wineName || "").toLowerCase();

  // Match preferred regions
  for (const r of regions) {
    if (name.includes(r.toLowerCase()) || (wine.region || "").toLowerCase().includes(r.toLowerCase())) score += 30;
  }

  // Match preferred types
  for (const t of types) {
    if ((wine.type || "").toLowerCase().includes(t.toLowerCase())) score += 20;
  }

  // High AI score is a signal
  if (wine.investmentScore >= 80) score += 20;
  if (wine.marketTrend === "up") score += 15;

  // Not already in portfolio
  const alreadyOwned = orders.some(o => o.wine_id === wine.id);
  if (alreadyOwned) score -= 40;

  return Math.max(0, score);
}

function scoreNewsRelevance(news, regions, orders) {
  let score = 10; // base score for all news
  const text = ((news.title || "") + " " + (news.description || "")).toLowerCase();

  for (const r of regions) {
    if (text.includes(r.toLowerCase())) score += 25;
  }

  // Match portfolio wines
  for (const o of orders) {
    const wineName = (o.wineName || o.wine_id || "").toLowerCase().split(" ")[0];
    if (wineName && text.includes(wineName)) score += 30;
  }

  return score;
}

function inferRegionsFromOrders(orders, allWines) {
  const regions = {};
  for (const o of orders) {
    const wine = allWines.find(w => w.id === o.wine_id);
    if (wine?.region) regions[wine.region] = (regions[wine.region] || 0) + 1;
  }
  return Object.entries(regions).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
}

function extractFirstName(email) {
  const local = email.split("@")[0] || "";
  const name = local.split(/[._\-0-9]/)[0] || "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function generatePersonalizedIntro(userData) {
  const { firstName, preferredRegions, portfolio, activeAlerts } = userData;
  const name = firstName || "Wine enthusiast";
  const regions = preferredRegions?.slice(0, 2).join(" and ") || "fine wine";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (portfolio?.value > 0) {
    return `${greeting} ${name}, your wine portfolio is currently valued at €${Math.round(portfolio.value).toLocaleString()} — ${portfolio.roi > 0 ? `up ${portfolio.roi}%` : `${portfolio.roi}%`} from your investment.`;
  }

  if (activeAlerts > 0) {
    return `${greeting} ${name}, you have ${activeAlerts} active price alert${activeAlerts > 1 ? "s" : ""} on your watchlist wines.`;
  }

  return `${greeting} ${name}, we've curated the latest ${regions} market insights especially for you.`;
}
