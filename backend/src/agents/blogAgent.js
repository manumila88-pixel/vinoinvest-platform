import cron from "node-cron";
import { cachedCall } from "../services/aiOptimizer.js";
import { trackUsage } from "../middleware/tokenTracker.js";

let pool = null;
export function setBlogPool(p) { pool = p; }

// Seasonal topics by month
const SEASONAL_TOPICS = {
  1: "I migliori vini da comprare a gennaio per valorizzare il portfolio 2026",
  2: "Vini di San Valentino: investimento romantico ad alto rendimento",
  3: "Vendite primavera: cosa comprare prima che i prezzi salgano",
  4: "Primavera in cantina: i vini che sbocciano con la stagione",
  5: "Vini estivi: rosé e bianchi pregiati come investimento",
  6: "Mercato di metà anno: bilancio e opportunità per il semestre",
  7: "Estate del vino: le aste estive di Sotheby's e Christie's",
  8: "Vendemmia 2026: anticipazioni e previsioni annata",
  9: "Vendemmia! Come investire subito nella nuova annata",
  10: "Autunno del vino: i grandi rossi da accumulare ora",
  11: "Natale si avvicina: vini pregiati come regalo d'investimento",
  12: "Fine anno: bilancio del mercato del vino e outlook 2027",
};

const EVERGREEN_TOPICS = [
  "Barolo vs Brunello: quale conviene comprare nel 2026",
  "Dom Pérignon: storia, quotazioni e potenziale di crescita",
  "Come conservare il vino da investimento: guida completa",
  "Vini italiani emergenti: le nuove stelle da comprare adesso",
  "Punteggi Robert Parker: come influenzano il valore del vino",
];

async function getTrendingTopics() {
  if (!pool) return [];
  try {
    // Wines with highest price variation in last 7 days
    const r = await pool.query(`
      SELECT w.name, w.producer, w.vintage,
             MAX(ph.price) - MIN(ph.price) AS price_range,
             AVG(ph.price) AS avg_price
      FROM wines w
      JOIN price_history ph ON ph.wine_id = w.id
      WHERE ph.recorded_at > NOW() - INTERVAL '7 days'
      GROUP BY w.id, w.name, w.producer, w.vintage
      ORDER BY price_range DESC
      LIMIT 3
    `);
    return r.rows.map(w => `Analisi investimento: ${w.name} ${w.vintage || ""} — trend settimanale`);
  } catch (_) {
    return [];
  }
}

async function postExists(slug) {
  if (!pool) return false;
  try {
    const r = await pool.query("SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1", [slug]);
    return r.rowCount > 0;
  } catch (_) { return false; }
}

async function saveBlogPost(post) {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT,
        slug TEXT UNIQUE,
        excerpt TEXT,
        content TEXT,
        category TEXT,
        author TEXT DEFAULT 'VinoInvest AI',
        read_time TEXT,
        tokens_used INTEGER DEFAULT 0,
        published_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, category, read_time, tokens_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [post.title, post.slug, post.excerpt, post.content, post.category || "Analisi", post.readTime || "5 min", post.tokensUsed || 0]
    );
  } catch (e) {
    console.error("[blogAgent] save:", e.message);
  }
}

async function generateArticles() {
  const month = new Date().getMonth() + 1;
  const seasonal = SEASONAL_TOPICS[month];
  const trending = await getTrendingTopics();

  const topics = [
    ...(trending.length ? trending : []),
    seasonal,
    ...EVERGREEN_TOPICS.slice(0, 5 - trending.length - 1),
  ].slice(0, 5);

  let generated = 0;
  for (const title of topics) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
    if (await postExists(slug)) continue;

    const result = await cachedCall({
      task: "blog_article",
      data: { title },
      complexity: "blog",
      trackUsage: (u) => trackUsage({ ...u, endpoint: "blog_generate" }),
    });

    if (result?.title) {
      result.slug = result.slug || slug;
      result.tokensUsed = 700;
      await saveBlogPost(result);
      generated++;
      console.log(`[blogAgent] Generated: ${result.title}`);
    }

    // 800ms delay between articles
    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`[blogAgent] Done — ${generated} new articles`);
}

// Weekly automation: generate 3 topic-driven articles every Monday at 06:30
async function generateWeeklyArticles() {
  const month = new Date().getMonth() + 1;
  const seasonal = SEASONAL_TOPICS[month];
  const trending = await getTrendingTopics();

  // 3 articles: 1 market update, 1 deep dive on top wine, 1 rotating educational topic
  const topics = [
    trending[0] || `Analisi mercato vino: cosa comprare nella settimana ${new Date().toLocaleDateString('it-IT')}`,
    trending[1] || `Deep dive: ${seasonal}`,
    ...EVERGREEN_TOPICS.slice(0, 1),
  ].slice(0, 3);

  let generated = 0;
  for (const title of topics) {
    const slug = title.toLowerCase()
      .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

    if (await postExists(slug)) continue;

    const result = await cachedCall({
      task: "blog_article",
      data: { title },
      complexity: "blog",
      trackUsage: (u) => trackUsage({ ...u, endpoint: "blog_weekly" }),
    });

    if (result?.title) {
      result.slug = result.slug || slug;
      result.tokensUsed = 700;
      await saveBlogPost(result);
      generated++;
      console.log(`[blogAgent] Weekly: ${result.title}`);
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`[blogAgent] Weekly automation done — ${generated} new articles`);
}

// Run every Monday at 06:30 CET
export function startBlogAgent() {
  cron.schedule("30 6 * * 1", generateWeeklyArticles, { timezone: "Europe/Rome" });
  console.log("[blogAgent] Scheduled — Mondays 06:30 Rome");
}

export { generateArticles, generateWeeklyArticles };
