/**
 * Reddit Sentiment Service — public JSON API, no auth required.
 * Analyzes community sentiment from r/wine posts about a given wine.
 */
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400 }); // 24h
const UA = "VinoInvest/1.0 (vinoinvest.com; contact@vinoinvest.com)";

const POSITIVE_KEYWORDS = [
  "excellent", "amazing", "outstanding", "perfect", "love", "recommend",
  "fantastic", "best", "superb", "great", "bellissimo", "ottimo", "eccellente",
  "straordinario", "buy", "upgrade", "worth",
];

const NEGATIVE_KEYWORDS = [
  "disappointing", "overpriced", "avoid", "terrible", "bad", "worst",
  "overrated", "not worth", "delusione", "deludente", "evitare", "pessimo",
];

function countKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.reduce((count, kw) => count + (lower.includes(kw) ? 1 : 0), 0);
}

export async function getRedditSentiment(wineName) {
  const cacheKey = `reddit_${wineName.toLowerCase().replace(/\s+/g, "_")}`;
  const hit = cache.get(cacheKey);
  if (hit !== undefined) return hit;

  const searchUrl = `https://www.reddit.com/r/wine/search.json?q=${encodeURIComponent(wineName)}&sort=top&limit=10&t=month`;
  const redditUrl = `https://reddit.com/r/wine/search?q=${encodeURIComponent(wineName)}`;

  try {
    const r = await fetch(searchUrl, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) throw new Error(`Reddit API ${r.status}`);

    const data = await r.json();
    const posts = data?.data?.children ?? [];
    const postCount = posts.length;

    let positiveCount = 0;
    let negativeCount = 0;

    for (const post of posts) {
      const d = post?.data ?? {};
      const combined = `${d.title || ""} ${d.selftext || ""}`;
      positiveCount += countKeywords(combined, POSITIVE_KEYWORDS);
      negativeCount += countKeywords(combined, NEGATIVE_KEYWORDS);
    }

    const total = positiveCount + negativeCount;
    const score = total > 0
      ? Math.round((positiveCount / total) * 100)
      : 70; // neutral default if no clear signal

    const result = {
      score,
      positiveCount,
      negativeCount,
      postCount,
      subreddit: "r/wine",
      url: redditUrl,
    };

    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    const fallback = {
      score: 70,
      positiveCount: 0,
      negativeCount: 0,
      postCount: 0,
      subreddit: "r/wine",
      url: redditUrl,
      error: err.message,
    };
    // Don't cache errors — allow retry on next request
    return fallback;
  }
}
