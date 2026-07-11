/**
 * Seed blog_posts from content/blog markdown files.
 * Run: node src/scripts/seedBlogFromContent.js <slug> [<slug> ...]
 *      node src/scripts/seedBlogFromContent.js --all-missing   (inserts only slugs not yet in DB)
 *
 * The SPA serves articles from the blog_posts table (routes/blog.js); the
 * content/blog pipeline (gen-blog-data.mjs) only feeds the sitemap and static
 * copies. This script bridges the two: frontmatter → columns, body → content.
 */

import pg from "pg";
import dotenv from "dotenv";
import { readFile, readdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env") });

const CONTENT_DIR = join(__dirname, "../../../content/blog");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const key of ["title", "slug", "meta_description", "category", "reading_time"]) {
    const mm = m[1].match(new RegExp(`^${key}:\\s*"([^"]+)"`, "m"));
    if (mm) meta[key] = mm[1];
  }
  return { meta, body: raw.slice(m[0].length) };
}

// First real paragraph after the H1 → excerpt
function deriveExcerpt(body) {
  const paragraphs = body.split(/\n\n+/).map(p => p.trim());
  for (const p of paragraphs) {
    if (!p || p.startsWith("#") || p.startsWith("---")) continue;
    const text = p.replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    return text.length > 280 ? text.slice(0, 277) + "…" : text;
  }
  return "";
}

async function upsert(slug, columns) {
  const raw = await readFile(join(CONTENT_DIR, `${slug}.md`), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  if (!meta.title) throw new Error(`frontmatter senza title in ${slug}.md`);
  const excerpt = meta.meta_description || deriveExcerpt(body);
  const wc = body.split(/\s+/).length;
  const optional = { persona: "both", meta_description: meta.meta_description || excerpt, word_count: wc };
  const cols = ["title", "slug", "excerpt", "content", "category", "read_time"];
  const vals = [meta.title, meta.slug || slug, excerpt, body, meta.category || "Analisi", meta.reading_time || "5 min"];
  for (const [c, v] of Object.entries(optional)) {
    if (columns.has(c)) { cols.push(c); vals.push(v); }
  }
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(",");
  const updates = cols.filter(c => c !== "slug").map(c => `${c}=EXCLUDED.${c}`).join(", ");
  await pool.query(
    `INSERT INTO blog_posts (${cols.join(",")}) VALUES (${placeholders})
     ON CONFLICT (slug) DO UPDATE SET ${updates}`,
    vals
  );
  console.log(`✓ ${meta.slug || slug} (${wc} parole)`);
}

// The production table may predate optional columns (persona, meta_description, word_count)
async function tableColumns() {
  const { rows } = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'blog_posts'"
  );
  return new Set(rows.map(r => r.column_name));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Uso: node src/scripts/seedBlogFromContent.js <slug> [...] | --all-missing");
    process.exit(1);
  }
  let slugs;
  if (args[0] === "--all-missing") {
    const files = (await readdir(CONTENT_DIR)).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""));
    const { rows } = await pool.query("SELECT slug FROM blog_posts");
    const existing = new Set(rows.map(r => r.slug));
    slugs = files.filter(s => !existing.has(s));
    console.log(`${slugs.length} articoli mancanti nel DB su ${files.length} in content/blog`);
  } else {
    slugs = args;
  }
  const columns = await tableColumns();
  for (const slug of slugs) await upsert(slug, columns);
  await pool.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
