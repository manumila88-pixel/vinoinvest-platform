import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { translateObjects, translateText } from "../services/translationService.js";
import { BLOG_POSTS } from "../data/blogPosts.js";

const router = express.Router();
const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

let pool = null;
export function setBlogPool(p) {
  pool = p;
  seedFallbackPostsToDb().catch(() => {});
}

async function seedFallbackPostsToDb() {
  if (!pool) return;
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
  `).catch(() => {});
  for (const p of FALLBACK_POSTS) {
    await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, category, author, read_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (slug) DO NOTHING`,
      [p.title, p.slug, p.excerpt, p.content, p.category || "Analisi", p.author || "VinoInvest AI", p.readTime || "6 min"]
    ).catch(() => {});
  }
}

// In-memory cache: 1 hour
let blogCache = null;
let blogCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

const FALLBACK_POSTS = BLOG_POSTS;

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
    "Come investire nel vino nel 2026: guida completa per principianti con dati reali rendimenti",
    "Barolo vs Bordeaux: quale rende di piu' nel 2026, confronto rendimenti storici e prezzi",
    "Art. 67 TUIR: nessuna tassa sul vino per i collezionisti italiani, guida fiscale",
    "AI Score VinoInvest: come funziona la metodologia per analisi investimento vino",
    "Le 10 annate piu' redditizie degli ultimi 20 anni per investire in fine wine",
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

// GET /api/blog?page=1&limit=10&lang=fr
router.get("/", async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const targetLang = req.query.lang?.slice(0, 2);

  // Try DB first
  const dbResult = await getPostsFromDB(page, limit);
  if (dbResult) {
    if (targetLang && targetLang !== "it") {
      try {
        dbResult.posts = await translateObjects(dbResult.posts, ["title", "excerpt"], targetLang, "it");
      } catch (e) { console.warn("[blog] Translation failed:", e.message); }
    }
    return res.json(dbResult);
  }

  // Fallback to in-memory cache
  if (!blogCache || Date.now() - blogCacheTime > CACHE_TTL) {
    blogCache = await generateAndCachePosts();
    blogCacheTime = Date.now();
  }

  const start = (page - 1) * limit;
  let posts = blogCache.slice(start, start + limit);

  if (targetLang && targetLang !== "it") {
    try {
      posts = await translateObjects(posts, ["title", "excerpt"], targetLang, "it");
    } catch (e) { console.warn("[blog] Translation failed:", e.message); }
  }

  res.json({ posts, total: blogCache.length, page, limit });
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
