# Google Search Console — Setup Guide for VinoInvest

## 1. Domain Verification

1. Go to https://search.google.com/search-console/
2. Click **Add property** → choose **Domain** (not URL prefix)
3. Enter: `vinoinvest.com`
4. Copy the DNS TXT record provided
5. In your DNS provider (Vercel / Cloudflare), add:
   - Type: TXT
   - Host: @
   - Value: `google-site-verification=XXXXXXXXXXXXXXX`
6. Wait 24–48h and click **Verify**

## 2. Submit Sitemaps

After verification, go to **Sitemaps** in Search Console and submit:

| Sitemap URL | Content |
|---|---|
| `https://vinoinvest-backend-2.onrender.com/sitemap-index.xml` | Master index |
| `https://vinoinvest-backend-2.onrender.com/sitemap-pages.xml` | Static pages |
| `https://vinoinvest-backend-2.onrender.com/sitemap-wines.xml` | 50k wine pages |
| `https://vinoinvest-backend-2.onrender.com/sitemap-blog.xml` | Blog articles |
| `https://vinoinvest-platform.vercel.app/sitemap.xml` | Frontend sitemap |

Submit the index first, then individual sitemaps if needed.

## 3. Request Indexing — Top 10 Priority Pages

Go to **URL Inspection** tool and request indexing for:

1. `https://vinoinvest-platform.vercel.app/` — Homepage
2. `https://vinoinvest-platform.vercel.app/pricing` — Pricing page
3. `https://vinoinvest-platform.vercel.app/academy` — Wine Investment Academy
4. `https://vinoinvest-platform.vercel.app/regioni` — Wine Regions Hub
5. `https://vinoinvest-platform.vercel.app/produttori` — Producers Hub
6. `https://vinoinvest-platform.vercel.app/annate` — Vintage Years Hub
7. `https://vinoinvest-platform.vercel.app/market-index` — Market Index
8. `https://vinoinvest-platform.vercel.app/en-primeur` — En Primeur
9. `https://vinoinvest-platform.vercel.app/about` — About
10. `https://vinoinvest-platform.vercel.app/b2b` — B2B Dashboard

## 4. Core Web Vitals

Check in Search Console → **Experience** → **Core Web Vitals**

Target thresholds:
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

Fixes if needed:
- Images: ensure all `<img>` tags have explicit `width` + `height`
- Fonts: use `font-display: swap` in CSS
- JS: verify no blocking scripts in `<head>`
- Charts: fixed pixel widths already in place (no ResponsiveContainer) ✅

## 5. Rich Results / Schema Markup

The SEO hub pages (`/regioni`, `/produttori`, `/annate`) include `ItemList` schema.
Test with: https://search.google.com/test/rich-results

## 6. Monitor Weekly

Set up email alerts for:
- Coverage errors (Settings → Email preferences)
- Manual actions
- Security issues

Key reports to check weekly:
- Performance → Queries (top search terms)
- Coverage → Valid / Errors
- Sitemaps → Last read / URLs submitted
