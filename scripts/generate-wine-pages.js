#!/usr/bin/env node
/**
 * Generates static SEO-optimized HTML pages for top investment wines.
 * Output: frontend/public/vini/[wine-id].html
 * Run: node scripts/generate-wine-pages.js
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { TOP_WINES } from "./wine-catalog.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "frontend", "public", "vini");
// Base URL centralizzato: override con SITE_URL env, fallback aggiornabile via scripts/set-site-url.js
const BASE_URL = (process.env.SITE_URL || "https://vinoinvest-platform.vercel.app").replace(/\/$/, "");
const BACKEND_URL = "https://vinoinvest-backend-2.onrender.com";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatPrice(eur) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(eur);
}

function investmentDescription(wine) {
  const trend = wine.trend === "Bullish" ? "positivo" : "stabile";
  const risk = wine.risk === "Basso" ? "basso rischio" : "rischio medio";
  return `${wine.name} è un vino da investimento con score critico ${wine.criticScore}/100, tendenza di mercato ${trend} e ${risk}. Prezzo corrente: ${formatPrice(wine.priceEur)}/bottiglia.`;
}

function faqs(wine) {
  return [
    {
      q: `Quanto vale ${wine.name}?`,
      a: `Il prezzo corrente di ${wine.name} è circa ${formatPrice(wine.priceEur)} per bottiglia. Il valore storico è aumentato negli ultimi anni, con trend di mercato ${wine.trend === "Bullish" ? "positivo" : "stabile"}.`
    },
    {
      q: `Vale la pena investire in ${wine.name}?`,
      a: `${wine.name} ha un AI Score di ${wine.criticScore}/100 su VinoInvest, con rischio ${wine.risk.toLowerCase()} e buona liquidità. È considerato uno dei migliori vini da investimento della regione ${wine.region}.`
    },
    {
      q: `Dove comprare ${wine.name}?`,
      a: `${wine.name} è disponibile tramite le principali piattaforme di wine trading come Liv-ex, Wine-Searcher e Sotheby's Wine. Su VinoInvest puoi monitorarne il prezzo storico e ricevere segnali Buy/Sell.`
    },
    {
      q: `Qual è il punteggio critico di ${wine.name}?`,
      a: `${wine.name} ha ricevuto ${wine.criticScore}/100 dai principali critici internazionali (Parker, Wine Spectator, James Suckling). È prodotto da ${wine.producer} nella regione ${wine.region}.`
    }
  ];
}

function htmlPage(wine) {
  const pageUrl = `${BASE_URL}/vini/${wine.id}.html`;
  // Canonical DEVE essere self-referencing: /vini/x (senza .html) non esiste come
  // file statico e via rewrite Vercel servirebbe la SPA, non questa pagina.
  const canonicalUrl = pageUrl;
  const appUrl = `${BASE_URL}/?wine=${wine.id}`;
  const desc = investmentDescription(wine);
  const title = `${wine.name} — Prezzo, Investimento & AI Score | VinoInvest`;
  const faqList = faqs(wine);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": wine.name,
    "description": desc,
    "brand": { "@type": "Brand", "name": wine.producer },
    "category": wine.type,
    "image": `${BASE_URL}/og-image.jpg`,
    "offers": {
      "@type": "Offer",
      "price": wine.priceEur,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": pageUrl
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "vintage", "value": wine.vintage },
      { "@type": "PropertyValue", "name": "region", "value": wine.region },
      { "@type": "PropertyValue", "name": "producer", "value": wine.producer },
      { "@type": "PropertyValue", "name": "investment_risk", "value": wine.risk },
      { "@type": "PropertyValue", "name": "market_trend", "value": wine.trend }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "VinoInvest", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Investimento Vino", "item": `${BASE_URL}/` },
      { "@type": "ListItem", "position": 3, "name": wine.region.split(",")[0], "item": `${BASE_URL}/regioni` },
      { "@type": "ListItem", "position": 4, "name": wine.name, "item": canonicalUrl }
    ]
  };

  const faqHtml = faqList.map(f => `
    <div class="faq-item">
      <h3>${f.q}</h3>
      <p>${f.a}</p>
    </div>`).join("");

  const trendBadge = wine.trend === "Bullish"
    ? '<span class="badge bullish">📈 Bullish</span>'
    : '<span class="badge stable">➡️ Stabile</span>';

  const riskBadge = wine.risk === "Basso"
    ? '<span class="badge low-risk">🟢 Rischio Basso</span>'
    : '<span class="badge med-risk">🟡 Rischio Medio</span>';

  return `<!DOCTYPE html>
<html lang="it" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:title" content="${wine.name} — Wine Investment | VinoInvest">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${BASE_URL}/og-image.jpg">
  <meta property="og:site_name" content="VinoInvest">
  <meta property="og:locale" content="it_IT">
  <meta property="product:price:amount" content="${wine.priceEur}">
  <meta property="product:price:currency" content="EUR">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${wine.name} — AI Score ${wine.criticScore}/100">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${BASE_URL}/og-image.jpg">

  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>

  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#0b1220;color:#e2e8f0;line-height:1.6}
    .container{max-width:900px;margin:0 auto;padding:2rem 1rem}
    header{background:linear-gradient(135deg,#1a2035,#0b1220);border-bottom:1px solid #C9A22730;padding:1rem 2rem;display:flex;align-items:center;gap:1rem}
    .logo{font-size:1.4rem;font-weight:800;color:#C9A227;text-decoration:none}
    .breadcrumb{font-size:.85rem;color:#94a3b8;margin-bottom:1.5rem}
    .breadcrumb a{color:#C9A227;text-decoration:none}
    h1{font-size:2rem;font-weight:800;color:#f8fafc;margin-bottom:.5rem;line-height:1.2}
    .wine-meta{color:#94a3b8;font-size:.95rem;margin-bottom:1.5rem}
    .wine-meta strong{color:#cbd5e1}
    .badges{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
    .badge{padding:.3rem .8rem;border-radius:9999px;font-size:.8rem;font-weight:700}
    .badge.bullish{background:#0534102a;color:#4ade80;border:1px solid #16a34a}
    .badge.stable{background:#1a293e;color:#93c5fd;border:1px solid #3b82f6}
    .badge.low-risk{background:#0534102a;color:#4ade80;border:1px solid #16a34a}
    .badge.med-risk{background:#2a1f00;color:#fcd34d;border:1px solid #d97706}
    .price-card{background:linear-gradient(135deg,#1a2035,#0f172a);border:1px solid #C9A22740;border-radius:12px;padding:1.5rem;margin-bottom:2rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
    .price-card .item label{font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:#64748b;display:block;margin-bottom:.25rem}
    .price-card .item .value{font-size:1.4rem;font-weight:800;color:#C9A227}
    .score-ring{width:60px;height:60px;border-radius:50%;border:4px solid #C9A227;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;color:#C9A227}
    .section-title{font-size:1.3rem;font-weight:700;color:#f1f5f9;margin:2rem 0 1rem;border-bottom:1px solid #1e293b;padding-bottom:.5rem}
    .faq-item{background:#111827;border-radius:8px;padding:1rem 1.25rem;margin-bottom:.75rem;border:1px solid #1e293b}
    .faq-item h3{font-size:1rem;font-weight:600;color:#f1f5f9;margin-bottom:.4rem}
    .faq-item p{font-size:.9rem;color:#94a3b8}
    .cta{background:linear-gradient(135deg,#C9A227,#a07d1a);color:#020617;font-weight:800;padding:1rem 2rem;border-radius:8px;text-decoration:none;display:inline-block;margin:1.5rem 0;font-size:1rem}
    .data-table{width:100%;border-collapse:collapse;margin:1rem 0}
    .data-table th,.data-table td{padding:.6rem 1rem;border-bottom:1px solid #1e293b;text-align:left}
    .data-table th{color:#64748b;font-size:.8rem;text-transform:uppercase}
    .data-table td{color:#e2e8f0}
    footer{border-top:1px solid #1e293b;padding:2rem;text-align:center;color:#475569;font-size:.85rem;margin-top:3rem}
    footer a{color:#C9A227;text-decoration:none}
    @media(max-width:640px){.price-card{grid-template-columns:1fr 1fr}.price-card .item:last-child{grid-column:1/-1}h1{font-size:1.5rem}}
  </style>
</head>
<body>
<header>
  <a href="${BASE_URL}" class="logo">🍷 VinoInvest</a>
  <span style="color:#475569;font-size:.9rem">The Bloomberg Terminal for Fine Wine</span>
</header>

<div class="container">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${BASE_URL}">Home</a> &rsaquo;
    <a href="${BASE_URL}/regioni">Regioni</a> &rsaquo;
    <span>${wine.region.split(",")[0]}</span> &rsaquo;
    <span>${wine.name}</span>
  </nav>

  <h1>${wine.name}</h1>
  <p class="wine-meta">
    <strong>${wine.producer}</strong> &bull;
    <strong>${wine.region}</strong> &bull;
    Annata <strong>${wine.vintage}</strong> &bull;
    ${wine.type}
  </p>

  <div class="badges">
    ${trendBadge}
    ${riskBadge}
    <span class="badge" style="background:#1a293e;color:#c084fc;border:1px solid #7c3aed">⭐ Score: ${wine.criticScore}/100</span>
  </div>

  <div class="price-card">
    <div class="item">
      <label>Prezzo Corrente</label>
      <span class="value">${formatPrice(wine.priceEur)}</span>
    </div>
    <div class="item">
      <label>AI Score</label>
      <span class="value">${wine.criticScore}/100</span>
    </div>
    <div class="item">
      <label>Trend Mercato</label>
      <span class="value" style="font-size:1.1rem">${wine.trend}</span>
    </div>
  </div>

  <p style="color:#94a3b8;margin-bottom:1.5rem;font-size:1rem">${desc}</p>

  <a class="cta" href="${appUrl}">
    📊 Analisi completa + Storico prezzi su VinoInvest →
  </a>

  <h2 class="section-title">Dati tecnici</h2>
  <table class="data-table">
    <tbody>
      <tr><th>Produttore</th><td>${wine.producer}</td></tr>
      <tr><th>Regione</th><td>${wine.region}</td></tr>
      <tr><th>Paese</th><td>${wine.country}</td></tr>
      <tr><th>Annata</th><td>${wine.vintage}</td></tr>
      <tr><th>Tipologia</th><td>${wine.type}</td></tr>
      <tr><th>Punteggio Critico</th><td>${wine.criticScore}/100</td></tr>
      <tr><th>Rischio Investimento</th><td>${wine.risk}</td></tr>
      <tr><th>Trend Mercato</th><td>${wine.trend}</td></tr>
      <tr><th>Prezzo Stimato (bottiglia)</th><td>${formatPrice(wine.priceEur)}</td></tr>
    </tbody>
  </table>

  <h2 class="section-title">Domande frequenti</h2>
  ${faqHtml}

  <h2 class="section-title">Perché investire in vino pregiato?</h2>
  <p style="color:#94a3b8;margin-bottom:1rem">Il vino pregiato ha dimostrato negli ultimi 30 anni una crescita media dell'8-10% annuo, con bassa correlazione con i mercati azionari tradizionali. Vini come ${wine.name} sono considerati "asset rifugio" per investitori istituzionali e privati.</p>
  <p style="color:#94a3b8;margin-bottom:1rem">VinoInvest analizza oltre 50.000 vini con algoritmi AI, monitorando prezzi su Liv-ex, Sotheby's, Christie's e le principali piattaforme di wine trading mondiali.</p>

  <div style="background:#111827;border:1px solid #1e293b;border-radius:8px;padding:1.25rem;margin-top:2rem">
    <p style="font-size:.8rem;color:#64748b"><strong style="color:#94a3b8">Nota:</strong> I prezzi e gli score sono aggiornati automaticamente da fonti di mercato. VinoInvest non offre consulenza finanziaria. Tutti i dati sono forniti a scopo informativo. I rendimenti passati non garantiscono risultati futuri. <a href="${BASE_URL}/disclaimer" style="color:#C9A227">Disclaimer completo →</a></p>
  </div>
</div>

<footer>
  <p>© 2026 <a href="${BASE_URL}">VinoInvest</a> — La piattaforma AI per investire in vino pregiato</p>
  <p style="margin-top:.5rem"><a href="${BASE_URL}/metodologia">Metodologia AI Score</a> &bull; <a href="${BASE_URL}/glossario">Glossario</a> &bull; <a href="${BASE_URL}/privacy">Privacy</a> &bull; <a href="${BASE_URL}/api/docs">API</a></p>
</footer>
</body>
</html>`;
}

let count = 0;
const urls = [];

for (const wine of TOP_WINES) {
  const html = htmlPage(wine);
  const outPath = join(OUT_DIR, `${wine.id}.html`);
  writeFileSync(outPath, html, "utf8");
  urls.push({
    url: `${BASE_URL}/vini/${wine.id}.html`,
    id: wine.id,
    name: wine.name,
  });
  count++;
}

// Generate wine sitemap
const today = new Date().toISOString().split("T")[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

writeFileSync(join(ROOT, "frontend", "public", "sitemap-wines.xml"), sitemapXml, "utf8");

// Sitemap index: sitemap.xml è l'index canonico (referenziato da robots.txt);
// sitemap-index.xml è mantenuto identico per retrocompatibilità.
// DEVE includere tutte e tre le sitemap figlie (static, wines, blog).
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-wines.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

writeFileSync(join(ROOT, "frontend", "public", "sitemap-index.xml"), sitemapIndex, "utf8");
writeFileSync(join(ROOT, "frontend", "public", "sitemap.xml"), sitemapIndex, "utf8");

console.log(`✅ Generated ${count} static wine pages in frontend/public/vini/`);
console.log(`✅ Generated sitemap-wines.xml with ${urls.length} URLs`);
console.log(`✅ Generated sitemap.xml + sitemap-index.xml (static + wines + blog)`);
console.log(`\nRun: node scripts/generate-wine-pages.js`);
