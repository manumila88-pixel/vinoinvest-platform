/**
 * RSS News Service — aggregates wine news from free public RSS feeds.
 * No API key required. Cache 1h in memory.
 */
import Parser from "rss-parser";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 }); // 1h
const parser = new Parser({
  timeout: 8000,
  maxRedirects: 3,
  customFields: { item: ["media:content", "media:thumbnail", "dc:creator"] },
});

const RSS_FEEDS = [
  // Primary wine investment news
  { url: "https://www.decanter.com/feed/",                    source: "Decanter",          country: "UK" },
  { url: "https://www.decanter.com/wine-news/feed/",          source: "Decanter News",     country: "UK" },
  { url: "https://www.thedrinksbusiness.com/feed/",           source: "Drinks Business",   country: "UK" },
  { url: "https://www.wineenthusiast.com/feed/",              source: "Wine Enthusiast",   country: "US" },
  { url: "https://www.wine-searcher.com/rss/news",            source: "Wine-Searcher",     country: "UK" },
  { url: "https://www.wine-searcher.com/rss/articles",        source: "Wine-Searcher",     country: "UK" },
  // Italian wine news
  { url: "https://winenews.it/feed/",                         source: "WineNews.it",       country: "IT" },
  { url: "https://www.gamberorosso.it/category/vini/feed/",   source: "Gambero Rosso",     country: "IT" },
  // Broader wine content
  { url: "https://vinepair.com/feed/",                        source: "VinePair",          country: "US" },
  { url: "https://winefolly.com/feed/",                       source: "Wine Folly",        country: "US" },
  { url: "https://www.thewinesociety.com/blog/feed",          source: "The Wine Society",  country: "UK" },
  { url: "https://www.thewinehub.net/feed/",                  source: "Wine Hub",          country: "UK" },
];

function detectCategory(title = "", desc = "") {
  const t = (title + " " + desc).toLowerCase();
  if (/auction|sotheby|christie|hammer|bid|lot\s+\d/i.test(t)) return "auction";
  if (/score|points|critic|review|rating|advocate|spectator|suckling|parker|galloni/i.test(t)) return "critic";
  if (/invest|return|roi|fund|portfolio|capital|yield|performance|asset/i.test(t)) return "investment";
  if (/tech|ai|digital|platform|blockchain|iot|smart|app/i.test(t)) return "technology";
  return "market";
}

function detectCountry(title = "", source = "") {
  const t = (title + " " + source).toLowerCase();
  if (/bordeaux|burgundy|champagne|france|french|chablis|pomerol|alsace/i.test(t)) return "FR";
  if (/tuscany|barolo|brunello|italy|italian|piedmont|sassicaia|amarone|veneto/i.test(t)) return "IT";
  if (/napa|california|oregon|us wine|american wine|sonoma/i.test(t)) return "US";
  if (/australia|penfolds|barossa|shiraz/i.test(t)) return "AU";
  if (/spain|rioja|ribera|priorat|vega sicilia/i.test(t)) return "ES";
  if (/south africa|cape|stellenbosch/i.test(t)) return "ZA";
  if (/germany|mosel|riesling|rhine/i.test(t)) return "DE";
  if (/portugal|douro|port wine/i.test(t)) return "PT";
  return "UK";
}

function cleanHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}

async function fetchOneFeed(feed) {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || []).slice(0, 6).map((item, i) => {
      const desc = cleanHtml(item.contentSnippet || item.content || item.summary || "");
      return {
        id: `${feed.source.replace(/\s/g, "_")}-${i}-${Date.now()}`,
        title: item.title?.trim() || "",
        description: desc,
        source: { name: feed.source },
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        url: item.link || "#",
        country: detectCountry(item.title, feed.source),
        category: detectCategory(item.title, desc),
        imageUrl: item["media:content"]?.$?.url || item["media:thumbnail"]?.$?.url || null,
      };
    });
  } catch {
    return [];
  }
}

export async function fetchRSSNews() {
  const cached = cache.get("rss_news");
  if (cached) return cached;

  const results = await Promise.allSettled(RSS_FEEDS.map(f => fetchOneFeed(f)));
  const articles = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value)
    .filter(a => a.title && a.title.length > 5)
    // Deduplication by title prefix (first 40 chars)
    .filter((a, i, arr) => arr.findIndex(b => b.title.slice(0, 40) === a.title.slice(0, 40)) === i)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 30);

  if (articles.length >= 3) {
    cache.set("rss_news", articles);
    console.log(`[rssNewsService] Fetched ${articles.length} articles from RSS feeds.`);
    return articles;
  }

  console.log("[rssNewsService] Not enough RSS articles, returning null for fallback.");
  return null;
}

export function clearRSSCache() {
  cache.del("rss_news");
}
