/**
 * Wine Market Research Service
 * Aggregates producer performance from local DB + RSS feeds for market/producers page
 * Sources: Decanter RSS, Wine Spectator RSS, wine tech news
 */
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 * 4 }); // 4h cache

let allWines = [];
export const setMarketResearchWines = (w) => { allWines = w; };

const PRODUCER_RSS_FEEDS = [
  { url: "https://www.decanter.com/wine-news/feed/",    source: "Decanter",        type: "producer_news" },
  { url: "https://www.decanter.com/feed/",              source: "Decanter",        type: "general" },
  { url: "https://www.thedrinksbusiness.com/feed/",     source: "Drinks Business", type: "market" },
  { url: "https://winenews.it/feed/",                   source: "WineNews.it",     type: "producer_news" },
];

const WINE_TECH_RSS = [
  { url: "https://vinepair.com/feed/",                  source: "VinePair",        type: "tech" },
  { url: "https://www.wineenthusiast.com/feed/",        source: "Wine Enthusiast", type: "general" },
];

async function fetchRSS(feedUrl, source) {
  try {
    const { default: Parser } = await import("rss-parser");
    const parser = new Parser({ timeout: 6000, maxRedirects: 3 });
    const feed = await parser.parseURL(feedUrl);
    return (feed.items || []).slice(0, 8).map(item => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || item.isoDate || null,
      description: (item.contentSnippet || item.summary || "").replace(/<[^>]+>/g, " ").slice(0, 200),
      source,
    }));
  } catch {
    return [];
  }
}

async function fetchAllProducerNews() {
  const cached = cache.get("producer_news");
  if (cached) return cached;

  const results = await Promise.allSettled(
    PRODUCER_RSS_FEEDS.map(f => fetchRSS(f.url, f.source))
  );
  const news = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
    .slice(0, 20);

  cache.set("producer_news", news);
  return news;
}

async function fetchWineTechNews() {
  const cached = cache.get("wine_tech_news");
  if (cached) return cached;

  const results = await Promise.allSettled(
    WINE_TECH_RSS.map(f => fetchRSS(f.url, f.source))
  );
  const news = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value)
    .filter(n => /tech|ai|digital|platform|invest|startup|fund/i.test(n.title + " " + n.description))
    .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
    .slice(0, 10);

  cache.set("wine_tech_news", news);
  return news;
}

function computeTopProducers(wines) {
  const producerMap = new Map();

  for (const w of wines) {
    const producer = w.producer || w.name?.split(' ').slice(0, 2).join(' ') || 'Unknown';
    const region = w.region || w.country || '';
    const price = parseFloat(w.currentPrice || w.current_price || 0);
    const score = parseInt(w.investmentScore || w.investment_score || 0);
    const trend = w.marketTrend || w.market_trend || 'stable';

    if (!producerMap.has(producer)) {
      producerMap.set(producer, { producer, region, wines: [], totalScore: 0, totalPrice: 0, upCount: 0 });
    }
    const p = producerMap.get(producer);
    p.wines.push(w);
    p.totalScore += score;
    p.totalPrice += price;
    if (trend === 'up') p.upCount++;
  }

  const producers = Array.from(producerMap.values())
    .filter(p => p.wines.length >= 2)
    .map(p => ({
      producer: p.producer,
      region: p.region,
      wineCount: p.wines.length,
      avgScore: Math.round(p.totalScore / p.wines.length),
      avgPrice: Math.round(p.totalPrice / p.wines.length),
      upPercent: Math.round((p.upCount / p.wines.length) * 100),
      topWine: p.wines
        .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))[0]?.name || '',
    }));

  return producers.sort((a, b) => b.avgScore - a.avgScore);
}

export async function getMarketProducers() {
  const cached = cache.get("market_producers");
  if (cached) return cached;

  const allProducers = computeTopProducers(allWines);
  const [producerNews, techNews] = await Promise.all([
    fetchAllProducerNews(),
    fetchWineTechNews(),
  ]);

  const result = {
    segments: {
      b2b_premium: allProducers
        .filter(p => p.avgPrice > 500 && p.avgScore > 85)
        .slice(0, 20),
      b2c_value: allProducers
        .filter(p => p.avgPrice >= 50 && p.avgPrice <= 500 && p.avgScore > 70)
        .slice(0, 20),
      emerging: allProducers
        .filter(p => p.upPercent > 60 && p.avgScore > 75)
        .sort((a, b) => b.upPercent - a.upPercent)
        .slice(0, 15),
    },
    topByScore: allProducers.slice(0, 30),
    producerNews,
    techNews,
    generatedAt: new Date().toISOString(),
  };

  cache.set("market_producers", result);
  return result;
}

export async function getProducerDetail(producerName) {
  const wines = allWines.filter(w =>
    (w.producer || '').toLowerCase().includes(producerName.toLowerCase()) ||
    (w.name || '').toLowerCase().includes(producerName.toLowerCase())
  );

  if (!wines.length) return null;

  const prices = wines.map(w => parseFloat(w.currentPrice || w.current_price || 0)).filter(Boolean);
  const scores = wines.map(w => parseInt(w.investmentScore || w.investment_score || 0)).filter(Boolean);

  return {
    producer: producerName,
    wineCount: wines.length,
    wines: wines.slice(0, 20),
    avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
    minPrice: prices.length ? Math.round(Math.min(...prices)) : 0,
    maxPrice: prices.length ? Math.round(Math.max(...prices)) : 0,
    avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    bestScore: scores.length ? Math.max(...scores) : 0,
    upTrending: wines.filter(w => (w.marketTrend || w.market_trend) === 'up').length,
  };
}
