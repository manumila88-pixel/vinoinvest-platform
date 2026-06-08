import { Router } from "express";

const router = Router();
const BASE = "https://vinoinvest.com";

let winesRef = [];
export function setHubWines(wines) { winesRef = wines; }

function buildItemList(name, url, items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "url": `${BASE}${url}`,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": item,
    })),
  };
}

// GET /api/hub/regioni — top regions by wine count with ItemList schema
router.get("/regioni", (_req, res) => {
  const counts = {};
  const scores = {};

  for (const w of winesRef) {
    const r = w.region || w.appellation;
    if (!r) continue;
    counts[r] = (counts[r] || 0) + 1;
    const s = w.investmentScore ?? w.investment_score ?? w.criticScore;
    if (s) {
      if (!scores[r]) scores[r] = { sum: 0, n: 0 };
      scores[r].sum += s;
      scores[r].n += 1;
    }
  }

  const regions = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 200)
    .map(([name, count]) => {
      const avg = scores[name] ? Math.round(scores[name].sum / scores[name].n) : null;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return {
        "@type": "Thing",
        "name": name,
        "url": `${BASE}/market?region=${encodeURIComponent(name)}`,
        "description": `${count} vini${avg ? ` · AI Score medio: ${avg}` : ""}`,
        "identifier": slug,
      };
    });

  res.set("Content-Type", "application/ld+json");
  res.json(buildItemList("Regioni Vinicole — VinoInvest", "/regioni", regions));
});

// GET /api/hub/produttori — top producers by wine count with ItemList schema
router.get("/produttori", (_req, res) => {
  const counts = {};
  const scores = {};

  for (const w of winesRef) {
    const p = w.producer;
    if (!p) continue;
    counts[p] = (counts[p] || 0) + 1;
    const s = w.investmentScore ?? w.investment_score ?? w.criticScore;
    if (s) {
      if (!scores[p]) scores[p] = { sum: 0, n: 0 };
      scores[p].sum += s;
      scores[p].n += 1;
    }
  }

  const producers = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 500)
    .map(([name, count]) => {
      const avg = scores[name] ? Math.round(scores[name].sum / scores[name].n) : null;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return {
        "@type": "Organization",
        "name": name,
        "url": `${BASE}/market?search=${encodeURIComponent(name)}`,
        "description": `${count} vini in catalogo${avg ? ` · AI Score medio: ${avg}` : ""}`,
        "identifier": slug,
      };
    });

  res.set("Content-Type", "application/ld+json");
  res.json(buildItemList("Produttori di Vino da Investimento — VinoInvest", "/produttori", producers));
});

// GET /api/hub/annate — vintages with wine counts and ItemList schema
router.get("/annate", (_req, res) => {
  const counts = {};
  const scores = {};

  for (const w of winesRef) {
    const v = w.vintage;
    if (!v) continue;
    const year = String(v);
    counts[year] = (counts[year] || 0) + 1;
    const s = w.investmentScore ?? w.investment_score ?? w.criticScore;
    if (s) {
      if (!scores[year]) scores[year] = { sum: 0, n: 0 };
      scores[year].sum += s;
      scores[year].n += 1;
    }
  }

  const vintages = Object.entries(counts)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, count]) => {
      const avg = scores[year] ? Math.round(scores[year].sum / scores[year].n) : null;
      return {
        "@type": "Thing",
        "name": `Annata ${year}`,
        "url": `${BASE}/market?vintage=${year}`,
        "description": `${count} vini${avg ? ` · AI Score medio: ${avg}` : ""}`,
        "identifier": year,
      };
    });

  res.set("Content-Type", "application/ld+json");
  res.json(buildItemList("Annate di Vino da Investimento — VinoInvest", "/annate", vintages));
});

export default router;
