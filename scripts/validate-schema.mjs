#!/usr/bin/env node
/**
 * Validazione locale schema.org + meta SEO.
 *   node scripts/validate-schema.mjs [numero pagine vino da campionare, default 20]
 *
 * Controlla:
 *  - pagine /vini/*.html: JSON-LD (Product, FAQPage, BreadcrumbList), canonical
 *    self-referencing, meta description, og:url/og:image, twitter card
 *  - homepage (frontend/index.html): WebApplication, WebSite, Organization,
 *    canonical, og:image
 *  - articoli blog: shape dell'Article JSON-LD generato da BlogPost.jsx,
 *    costruito con i dati reali di blogManifest.js (campione di 5)
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const SAMPLE = parseInt(process.argv[2] || "20", 10);

let errors = 0, checked = 0;
const err = (file, msg) => { errors++; console.log(`  ❌ ${file}: ${msg}`); };

function ldBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m => m[1]);
}
function metaContent(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

// ---------- pagine vino ----------
const viniDir = join(ROOT, "frontend/public/vini");
const all = readdirSync(viniDir).filter(f => f.endsWith(".html")).sort();
// campione deterministico distribuito su tutto il catalogo
const step = Math.max(1, Math.floor(all.length / SAMPLE));
const sample = all.filter((_, i) => i % step === 0).slice(0, SAMPLE);

console.log(`\n— Pagine vino: ${sample.length} campionate su ${all.length} —`);
for (const f of sample) {
  checked++;
  const html = readFileSync(join(viniDir, f), "utf8");
  const file = `vini/${f}`;

  const blocks = ldBlocks(html);
  if (blocks.length !== 3) err(file, `attesi 3 blocchi JSON-LD, trovati ${blocks.length}`);
  const parsed = [];
  for (const b of blocks) {
    try { parsed.push(JSON.parse(b)); } catch (e) { err(file, `JSON-LD non parsabile: ${e.message}`); }
  }
  const product = parsed.find(p => p["@type"] === "Product");
  const faq = parsed.find(p => p["@type"] === "FAQPage");
  const crumbs = parsed.find(p => p["@type"] === "BreadcrumbList");

  if (!product) err(file, "Product schema mancante");
  else {
    for (const k of ["name", "description", "image", "offers", "brand"])
      if (!product[k]) err(file, `Product.${k} mancante`);
    const o = product.offers || {};
    if (o["@type"] !== "Offer" || !o.price || o.priceCurrency !== "EUR" || !o.availability)
      err(file, "Product.offers incompleto (price/priceCurrency/availability)");
    if (product.aggregateRating) err(file, "aggregateRating presente (dati inventati — vietato)");
  }
  if (!faq) err(file, "FAQPage schema mancante");
  else if (!Array.isArray(faq.mainEntity) || faq.mainEntity.some(q => !q.name || !q.acceptedAnswer?.text))
    err(file, "FAQPage.mainEntity incompleto");
  if (!crumbs) err(file, "BreadcrumbList mancante");
  else {
    const items = crumbs.itemListElement || [];
    items.forEach((it, i) => {
      if (it.position !== i + 1) err(file, `breadcrumb position ${it.position} != ${i + 1}`);
      if (!/^https?:\/\//.test(it.item || "")) err(file, "breadcrumb item non assoluto");
    });
  }

  const canonical = metaContent(html, /<link rel="canonical" href="([^"]+)">/);
  if (!canonical) err(file, "canonical mancante");
  else if (!canonical.endsWith(`/vini/${f}`)) err(file, `canonical non self-referencing: ${canonical}`);
  if (!metaContent(html, /<meta name="description" content="([^"]+)">/)) err(file, "meta description mancante");
  const ogUrl = metaContent(html, /<meta property="og:url" content="([^"]+)">/);
  if (ogUrl !== canonical) err(file, `og:url (${ogUrl}) != canonical (${canonical})`);
  if (!metaContent(html, /<meta property="og:image" content="([^"]+)">/)) err(file, "og:image mancante");
  if (!metaContent(html, /<meta name="twitter:image" content="([^"]+)">/)) err(file, "twitter:image mancante");
}

// ---------- homepage ----------
console.log(`— Homepage (frontend/index.html) —`);
checked++;
{
  const html = readFileSync(join(ROOT, "frontend/index.html"), "utf8");
  const file = "index.html";
  const parsed = [];
  for (const b of ldBlocks(html)) {
    try { parsed.push(JSON.parse(b)); } catch (e) { err(file, `JSON-LD non parsabile: ${e.message}`); }
  }
  for (const t of ["WebApplication", "WebSite", "Organization"]) {
    const s = parsed.find(p => p["@type"] === t);
    if (!s) { err(file, `${t} schema mancante`); continue; }
    if (!s.name || !s.url) err(file, `${t}.name/url mancante`);
  }
  const webapp = parsed.find(p => p["@type"] === "WebApplication");
  if (webapp?.aggregateRating) err(file, "WebApplication.aggregateRating presente (dati inventati — vietato)");
  const ws = parsed.find(p => p["@type"] === "WebSite");
  if (ws && !ws.potentialAction?.target) err(file, "WebSite.SearchAction.target mancante");
  if (!metaContent(html, /<link rel="canonical" href="([^"]+)">/)) err(file, "canonical mancante");
  if (!metaContent(html, /<meta property="og:image" content="([^"]+)">/)) err(file, "og:image mancante");
  if (!metaContent(html, /<meta name="description" content="([^"]+)">/)) err(file, "meta description mancante");
}

// ---------- articoli blog (shape dell'Article generato da BlogPost.jsx) ----------
console.log(`— Blog: Article JSON-LD (5 articoli da blogManifest) —`);
{
  const manifestSrc = readFileSync(join(ROOT, "frontend/src/data/blogManifest.js"), "utf8");
  const m = manifestSrc.match(/export const BLOG_MANIFEST = (\[[\s\S]*?\]);/);
  const manifest = JSON.parse(m[1]);
  const SITE_URL = "https://vinoinvest-platform.vercel.app";
  const posts = manifest.filter((_, i) => i % Math.max(1, Math.floor(manifest.length / 5)) === 0).slice(0, 5);
  for (const p of posts) {
    checked++;
    // replica della costruzione in frontend/src/pages/BlogPost.jsx
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title,
      description: p.meta_description || "",
      image: `${SITE_URL}/og-image.jpg`,
      author: { "@type": "Organization", name: "VinoInvest" },
      publisher: { "@type": "Organization", name: "VinoInvest", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      mainEntityOfPage: `${SITE_URL}/blog/${p.slug}`,
      inLanguage: "it",
    };
    const file = `blog/${p.slug}`;
    if (!article.headline) err(file, "headline mancante");
    if (!article.description) err(file, "description (meta_description) mancante nel manifest");
    if (!article.mainEntityOfPage.includes("/blog/")) err(file, "mainEntityOfPage errato");
    console.log(`  ✓ ${file}`);
  }
}

console.log(`\n${errors === 0 ? "✅" : "❌"} ${checked} pagine controllate, ${errors} errori.`);
process.exit(errors ? 1 : 0);
