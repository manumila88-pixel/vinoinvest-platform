import { Router } from "express";

const router = Router();
let winesRef = [];
export function setSchemaWines(wines) { winesRef = wines; }

// GET /api/wines/:id/schema
router.get("/wines/:id/schema", (req, res) => {
  const wine = winesRef.find(w => w.id === req.params.id || String(w.id) === req.params.id);
  if (!wine) return res.status(404).json({ error: "Wine not found" });

  const price = wine.currentPrice ?? wine.current_price ?? 0;
  const score = wine.investmentScore ?? wine.investment_score ?? wine.criticScore ?? 80;
  const image = wine.imageUrl ?? wine.image_url ?? undefined;

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": wine.name,
    "brand": { "@type": "Brand", "name": wine.producer || wine.name },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": +(price * 0.95).toFixed(2),
      "highPrice": +(price * 1.05).toFixed(2),
      "priceCurrency": "EUR",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": score,
      "bestRating": 100,
      "ratingCount": 500,
    },
    "description": wine.description || `${wine.name} - vino da investimento`,
  };

  if (image) jsonld.image = image;
  if (wine.vintage) jsonld.additionalProperty = [{ "@type": "PropertyValue", "name": "vintage", "value": wine.vintage }];
  if (wine.region) jsonld.category = wine.region;

  res.set("Content-Type", "application/ld+json");
  res.json(jsonld);
});

// GET /api/schema/website
router.get("/schema/website", (_req, res) => {
  res.set("Content-Type", "application/ld+json");
  res.json({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VinoInvest",
    "url": "https://vinoinvest.com",
    "description": "The Bloomberg Terminal for Fine Wine Investment",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vinoinvest.com/market?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });
});

// GET /api/schema/organization
router.get("/schema/organization", (_req, res) => {
  res.set("Content-Type", "application/ld+json");
  res.json({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VinoInvest",
    "url": "https://vinoinvest.com",
    "logo": "https://vinoinvest.com/logo.png",
    "description": "The Bloomberg Terminal for Fine Wine Investment — data-driven platform for wine investors",
    "sameAs": [
      "https://vinoinvest-platform.vercel.app",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "info@vinoinvest.com",
      "availableLanguage": ["Italian", "English"],
    },
  });
});

export default router;
