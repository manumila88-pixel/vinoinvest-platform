import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

let pool = null;
export function setBlogPool(p) { pool = p; }

// In-memory cache: 1 hour
let blogCache = null;
let blogCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

const FALLBACK_POSTS = [
  {
    id: 1,
    title: "Come Investire in Vino nel 2026: Guida Completa",
    slug: "come-investire-in-vino-2026",
    excerpt: "Il vino pregiato ha consegnato rendimenti medi del 12% annuo negli ultimi 10 anni. Scopri come costruire un portfolio di fine wine.",
    content: "Investire in vino pregiato è diventato una delle strategie di diversificazione più apprezzate. A differenza degli asset finanziari tradizionali, il vino offre una correlazione bassa con i mercati azionari e una domanda strutturalmente crescente da Asia e Stati Uniti.\n\nLa chiave è selezionare vini con alte probabilità di apprezzamento: annate eccezionali di produttori iconici come Pétrus, DRC, Sassicaia o Lafite. L'AI Score di VinoInvest analizza oltre 15 variabili per identificare le opportunità più interessanti.\n\nPer iniziare, un portafoglio minimale di €10.000: 40% Bordeaux, 30% Borgogna, 20% Italia, 10% Champagne.",
    category: "Guida",
    author: "VinoInvest AI",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Barolo 2021: Perché Questa Annata Vale il Doppio",
    slug: "barolo-2021-annata-eccezionale",
    excerpt: "Con punteggi da 97 a 100 dai maggiori critici, il Barolo 2021 si candida come miglior annata del decennio.",
    content: "Il 2021 ha regalato al Piemonte condizioni climatiche eccezionali: estate calda ma non torrida, settembre freddo e soleggiato. Il risultato è un'annata di straordinaria eleganza e longevità.\n\nI top scorer: Giacomo Conterno Monfortino (99 punti), Bartolo Mascarello (98 punti), Bruno Giacosa (98 punti). Le quotazioni attuali sono ancora accessibili rispetto al potenziale 2030-2035.\n\nL'AI Score di VinoInvest assegna ai Barolo 2021 una media di 94/100, con segnale Strong Buy.",
    category: "Analisi",
    author: "VinoInvest AI",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    readTime: "5 min",
  },
  {
    id: 3,
    title: "Bordeaux vs Borgogna: Quale Investe Meglio nel 2026?",
    slug: "bordeaux-vs-borgogna-2026",
    excerpt: "Due regioni, due filosofie di investimento. Analisi completa di rischio/rendimento, liquidità e outlook per i prossimi 5 anni.",
    content: "Bordeaux offre liquidità superiore grazie al mercato Liv-ex, prezzi più accessibili e una catena di distribuzione globale. La Borgogna offre rendimenti maggiori ma minore liquidità.\n\nPer un portfolio di €50.000: 60% Bordeaux per liquidità e diversificazione, 30% Borgogna per rendimento, 10% wildcard.\n\nL'indice Liv-ex Fine Wine 100 mostra Bordeaux in ripresa (+3.2% YTD), mentre la Borgogna consolida dopo la correzione 2024.",
    category: "Confronto",
    author: "VinoInvest AI",
    publishedAt: new Date().toISOString(),
    readTime: "6 min",
  },
];

async function getPostsFromDB(page = 1, limit = 10) {
  if (!pool) return null;
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
    const offset = (page - 1) * limit;
    const r = await pool.query(
      `SELECT id, title, slug, excerpt, category, author, read_time AS "readTime", published_at AS "publishedAt"
       FROM blog_posts ORDER BY published_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    if (r.rowCount === 0) return null;
    const count = await pool.query("SELECT COUNT(*) FROM blog_posts");
    return { posts: r.rows, total: parseInt(count.rows[0].count), page, limit };
  } catch (_) { return null; }
}

async function generatePost(topic) {
  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system: "Wine investment blog AI. Return only valid JSON. No markdown.",
      messages: [{
        role: "user",
        content: `SEO article Italian wine investment. Topic:"${topic}". 350w. JSON:{title,slug,excerpt,content,category,readTime}`,
      }],
    });
    const text = msg.content[0]?.text?.trim() || "";
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}") + 1;
    if (s >= 0) return JSON.parse(text.slice(s, e));
  } catch (e) {
    console.error("[blog] generate:", e.message);
  }
  return null;
}

async function generateAndCachePosts() {
  const topics = [
    "Come investire in vino pregiato per principianti nel 2026",
    "Top 5 vini con il miglior potenziale di apprezzamento quest'anno",
    "Bordeaux vs Borgogna: analisi investimento 2026",
  ];

  const posts = [];
  for (let i = 0; i < topics.length; i++) {
    const post = await generatePost(topics[i]);
    if (post) {
      if (!post.slug) post.slug = topics[i].toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
      posts.push({ ...post, id: i + 1, author: "VinoInvest AI", publishedAt: new Date(Date.now() - i * 86400000).toISOString() });

      if (pool) {
        try {
          await pool.query(
            `INSERT INTO blog_posts (title, slug, excerpt, content, category, read_time)
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING`,
            [post.title, post.slug, post.excerpt, post.content, post.category || "Analisi", post.readTime || "5 min"]
          );
        } catch (_) {}
      }
    } else {
      posts.push(FALLBACK_POSTS[i]);
    }
    if (i < topics.length - 1) await new Promise(r => setTimeout(r, 500));
  }
  return posts.length > 0 ? posts : FALLBACK_POSTS;
}

// GET /api/blog?page=1&limit=10
router.get("/", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);

  // Try DB first
  const dbResult = await getPostsFromDB(page, limit);
  if (dbResult) return res.json(dbResult);

  // Fallback to in-memory cache
  if (!blogCache || Date.now() - blogCacheTime > CACHE_TTL) {
    blogCache = await generateAndCachePosts();
    blogCacheTime = Date.now();
  }

  const start = (page - 1) * limit;
  res.json({ posts: blogCache.slice(start, start + limit), total: blogCache.length, page, limit });
});

// GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  if (pool) {
    try {
      const r = await pool.query("SELECT * FROM blog_posts WHERE slug = $1 LIMIT 1", [req.params.slug]);
      if (r.rowCount > 0) return res.json(r.rows[0]);
    } catch (_) {}
  }

  if (!blogCache || Date.now() - blogCacheTime > CACHE_TTL) {
    blogCache = await generateAndCachePosts();
    blogCacheTime = Date.now();
  }
  const post = blogCache.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

export default router;
