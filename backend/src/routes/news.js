import express from "express";

const router = express.Router();

const FALLBACK_NEWS = [
  { id: 1, title: "Liv-ex Fine Wine 100 Index Rises 2.3% in May 2026", description: "The benchmark index for the fine wine secondary market continues its recovery with strong demand from Asian buyers and increasing interest from US institutional investors.", source: { name: "Liv-ex" }, publishedAt: "2026-06-04T08:00:00Z", url: "#", urlToImage: null, country: "UK", category: "market" },
  { id: 2, title: "Pétrus 2020 Breaks Auction Record in Hong Kong", description: "A single case of Pétrus 2020 fetched €48,500 at Christie's Hong Kong, setting a new benchmark for the vintage and underlining the strength of top Pomerol demand.", source: { name: "Wine Spectator" }, publishedAt: "2026-06-03T14:30:00Z", url: "#", urlToImage: null, country: "HK", category: "auction" },
  { id: 3, title: "Barolo 2021: Critic Scores Arrive — Best Vintage in a Decade?", description: "Initial reviews from Antonio Galloni and James Suckling are placing the 2021 Barolo vintage at exceptional levels, with scores ranging from 97-100 across top producers.", source: { name: "Vinous" }, publishedAt: "2026-06-02T10:00:00Z", url: "#", urlToImage: null, country: "IT", category: "critic" },
  { id: 4, title: "Bordeaux 2025 En Primeur: Négociants Report Strong Demand", description: "Early indicators from the Bordeaux 2025 en primeur campaign suggest strong pricing, supported by a vintage widely praised as exceptional across the Médoc and Right Bank.", source: { name: "Decanter" }, publishedAt: "2026-06-01T09:00:00Z", url: "#", urlToImage: null, country: "FR", category: "market" },
  { id: 5, title: "Burgundy Prices Stabilize After 2024 Correction", description: "Following a 15% price correction in 2024, Burgundy fine wines are showing signs of stabilization with renewed collector interest in premier and grand cru appellations.", source: { name: "The Wine Advocate" }, publishedAt: "2026-05-30T11:00:00Z", url: "#", urlToImage: null, country: "FR", category: "market" },
  { id: 6, title: "Fine Wine Outperforms Gold in Volatile Markets", description: "New research from Knight Frank's Luxury Investment Index shows fine wine delivering 12.4% annual returns over 10 years, outperforming traditional safe-haven assets including gold and luxury watches.", source: { name: "Financial Times" }, publishedAt: "2026-05-29T08:30:00Z", url: "#", urlToImage: null, country: "UK", category: "investment" },
  { id: 7, title: "Sassicaia 2022 Scores Perfect 100 from James Suckling", description: "The iconic Super Tuscan receives its fourth perfect score in six vintages, driving secondary market prices to new highs as collectors scramble for allocations.", source: { name: "JamesSuckling.com" }, publishedAt: "2026-05-28T15:00:00Z", url: "#", urlToImage: null, country: "IT", category: "critic" },
  { id: 8, title: "Napa Valley: Chinese Buyers Return to Premium California Wines", description: "Trade data shows a significant resurgence of Chinese importing of premium California wines, with Opus One and Harlan Estate benefiting most from renewed demand.", source: { name: "Wine Business Monthly" }, publishedAt: "2026-05-27T10:00:00Z", url: "#", urlToImage: null, country: "US", category: "market" },
  { id: 9, title: "Champagne Prestige Cuvées Lead Investment Returns at 18%", description: "Prestige cuvée champagne investments have delivered 18% returns over 3 years, with Dom Pérignon Plénitude 2 and Krug Vintage leading the segment.", source: { name: "Champagne Investor" }, publishedAt: "2026-05-26T09:00:00Z", url: "#", urlToImage: null, country: "FR", category: "investment" },
  { id: 10, title: "Penfolds Grange 2023 Sells Out in 48 Hours Across Europe", description: "The release of Penfolds Grange 2023 has been met with extraordinary demand from European collectors, with the allocation selling out within 48 hours of release.", source: { name: "Wine Spectator" }, publishedAt: "2026-05-25T14:00:00Z", url: "#", urlToImage: null, country: "AU", category: "market" },
  { id: 11, title: "Romanée-Conti 2022: Most Anticipated DRC Release Since 2015", description: "DRC's 2022 vintage is being positioned as one of the decade's greatest, with négociants allocating strict limits and secondary market prices already forming at €28,000+ per bottle.", source: { name: "Burghound" }, publishedAt: "2026-05-24T11:00:00Z", url: "#", urlToImage: null, country: "FR", category: "market" },
  { id: 12, title: "South African Fine Wine: Swartland Revolution Attracts International Capital", description: "Premium South African producers like Sadie Family and Eben Sadie are seeing significant price appreciation as international collectors discover the region's investment potential.", source: { name: "Platter's Wine Guide" }, publishedAt: "2026-05-23T10:00:00Z", url: "#", urlToImage: null, country: "ZA", category: "market" },
  { id: 13, title: "Digital Wine Trading Platforms Record €320M Volume in Q1 2026", description: "Online fine wine trading platforms report a combined volume of €320 million in Q1 2026, driven by younger investors seeking portfolio diversification through alternative assets.", source: { name: "Decanter Business" }, publishedAt: "2026-05-22T09:00:00Z", url: "#", urlToImage: null, country: "UK", category: "investment" },
  { id: 14, title: "Masseto and Ornellaia Lead Italian Super Tuscan Renaissance", description: "A new wave of collector interest in Super Tuscans is propelling prices to record levels, with Masseto emerging as one of the most sought-after investment-grade wines globally.", source: { name: "Vinous Italia" }, publishedAt: "2026-05-21T14:00:00Z", url: "#", urlToImage: null, country: "IT", category: "market" },
  { id: 15, title: "Climate Change Shifts Fine Wine Investment Profiles Northward", description: "Wine investors are reassessing regional risk profiles as climate change shifts production patterns, with northern regions benefiting and some traditional areas facing challenges.", source: { name: "The Economist" }, publishedAt: "2026-05-20T08:00:00Z", url: "#", urlToImage: null, country: "UK", category: "investment" },
  { id: 16, title: "Christie's May Wine Auction Totals €12M, 23% Above Estimate", description: "Christie's international wine auction achieved €12 million in total sales with bidders from 42 countries participating, reflecting robust collector demand for top-tier bottles.", source: { name: "Christie's" }, publishedAt: "2026-05-19T16:00:00Z", url: "#", urlToImage: null, country: "UK", category: "auction" },
  { id: 17, title: "Vega Sicilia Único 2018 Sets New Spanish Wine Price Record", description: "The latest release of Vega Sicilia Único has been allocated at €450 per bottle, marking a 35% increase from the previous vintage and reflecting growing international prestige.", source: { name: "Decanter Spain" }, publishedAt: "2026-05-18T11:00:00Z", url: "#", urlToImage: null, country: "ES", category: "market" },
  { id: 18, title: "London Fine Wine Fund Targets €50M AUM with Bordeaux Focus", description: "A new London-based fine wine fund is targeting €50 million in assets under management, focusing on en primeur Bordeaux and direct-from-estate Burgundy allocations.", source: { name: "Institutional Investor" }, publishedAt: "2026-05-17T09:00:00Z", url: "#", urlToImage: null, country: "UK", category: "investment" },
  { id: 19, title: "Oregon Pinot Noir Commands Burgundy-Equivalent Prices", description: "Domaine Drouhin Oregon's latest releases are commanding Burgundy-equivalent prices, signaling the state's arrival as a legitimate fine wine investment destination.", source: { name: "Wine Enthusiast" }, publishedAt: "2026-05-16T14:00:00Z", url: "#", urlToImage: null, country: "US", category: "market" },
  { id: 20, title: "IoT Smart Cellars Revolutionize €1M+ Private Wine Collections", description: "New IoT-enabled wine storage systems are helping collectors track provenance, optimal drinking windows, and real-time market values across portfolios worth €1M+.", source: { name: "Forbes" }, publishedAt: "2026-05-15T10:00:00Z", url: "#", urlToImage: null, country: "US", category: "technology" },
];

let cachedNews = null;
let cacheTime = 0;
const TTL = 30 * 60 * 1000;

router.get("/", async (req, res) => {
  const country = req.query.country || "all";
  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey && (!cachedNews || Date.now() - cacheTime > TTL)) {
    try {
      const q = encodeURIComponent("wine investment fine wine market bordeaux burgundy");
      const url = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (r.ok) {
        const data = await r.json();
        if (data.status === "ok" && data.articles?.length) {
          cachedNews = data.articles.map((a, i) => ({ ...a, id: i + 1, country: "UK", category: "market" }));
          cacheTime = Date.now();
        }
      }
    } catch {
      console.log("[news] NewsAPI unavailable, using fallback");
    }
  }

  let articles = cachedNews || FALLBACK_NEWS;

  if (country !== "all") {
    const countryMap = { IT: "IT", FR: "FR", US: "US", AU: "AU", ZA: "ZA" };
    const target = countryMap[country.toUpperCase()];
    if (target) {
      const filtered = articles.filter(a => (a.country || "UK") === target);
      if (filtered.length > 0) articles = filtered;
    }
  }

  res.json({ articles: articles.slice(0, 20), total: articles.length });
});

export default router;
