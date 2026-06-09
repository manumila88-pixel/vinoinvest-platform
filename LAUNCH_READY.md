# VinoInvest — Launch Ready Checklist

> Updated: 2026-06-09 — Audit completo + Academy 12-30 + B2B professional + SourceBadge

---

## Legenda
- ✅ **VERDE** — Fatto e funzionante
- ⚠️ **GIALLO** — Fatto ma da verificare / configurare
- ❌ **ROSSO** — Mancante o rotto
- 🔵 **BLU** — Richiede azione manuale (solo Manoel)

---

## ✅ VERDE — Completed Features

### Credenziali e Autorevolezza (GOD MODE session)
- [x] `/about` — Hero istituzionale, 4 pilastri "Trasparenza/Metodologia/Sicurezza", stats 50k/1.8M/40+, team section, disclaimer finanziario
- [x] `/metodologia` — Formula AI Score visiva con colori, 5 fattori con WHY + esempi reali, tabella confronto Liv-ex/Wine-Searcher, limitazioni oneste
- [x] `/security` — OWASP Top 10 con note dettagliate, GDPR 5 sezioni (base giuridica, retention 7y, diritti, trasferimenti, breach), bug bounty €500-€2000, security headers
- [x] `/data-sources` — 9 fonti documentate con badge verificata/stimata/elaborata/algoritmica, tabella completa, limitazioni oneste, form segnalazione dato errato
- [x] Cmd+K command palette (18 shortcut + live wine search)
- [x] Wine endpoint sorting fix — ora ordina per investmentScore DESC (best wines first)

### Core Platform
- [x] Wine catalog 50k+ with search, filters, infinite scroll
- [x] Price history charts (ComposedChart, no Three.js)
- [x] AI Score (Claude API) with methodology page
- [x] Multi-currency (CurrencySelector + /api/currency)
- [x] Dark/light theme toggle (fixed — now persists)
- [x] i18n 40+ languages
- [x] PWA install prompt
- [x] GDPR cookie banner

### B2B Professional Platform ← NEW
- [x] Multi-tenant organizations (POST /api/organizations)
- [x] Client portfolio management with CRM interactions
- [x] Suitability assessments (digital signature)
- [x] API key generation per organization
- [x] Audit log with CSV export (/api/organizations/:id/audit/export.csv)
- [x] Risk metrics: Sharpe, VaR 95%, Max Drawdown, Beta, HHI (riskMetricsService.js)
- [x] Benchmark vs S&P500, Gold, EU Inflation
- [x] Demo request with email notification (POST /api/demo)
- [x] 4-step B2B onboarding flow (/b2b-onboarding)
- [x] Market Intelligence page (/market-intelligence) — en primeur, auctions, movers
- [x] OrgDashboard (/org-dashboard)
- [x] ClientDetail (/clients/:id) with risk analytics + compliance
- [x] Updated B2B pricing: Starter free / €200 / €500
- [x] Social proof: testimonials + case study
- [x] Competitor comparison: vs Cult Wines Intelligence €800/mese

### UI/UX
- [x] Cmd+K command palette (18 shortcuts + live wine search)
- [x] SkeletonCard loading states
- [x] ErrorBoundary on key sections
- [x] Voice interface (VoiceInterface.jsx)
- [x] Label scanner (LabelScanner.jsx)

### SEO & Marketing
- [x] 238 static wine pages (/vini/*.html)
- [x] Sitemap index (3 sitemaps)
- [x] Knowledge base /api/knowledge-base
- [x] /metodologia, /glossario, /security, /data pages
- [x] security.txt, llms.txt, robots.txt

### Backend
- [x] Stripe + PayPal payments
- [x] Supabase JWT auth
- [x] Rate limiting (200 req/15min global, 20 req/min AI)
- [x] Web Vitals tracking (/api/analytics/vitals)
- [x] Security headers (Helmet.js)
- [x] A+ vercel.json security headers
- [x] Swagger API docs (/api/docs)
- [x] Public API v1 (/api/v1/wines)

### Academy (questa sessione)
- [x] Corsi Premium 12-20: 20 moduli ciascuno, quiz, deepDive, slides (premiumModules.js)
- [x] Corsi B2B 21-30: 20 moduli ciascuno con titoli professionali reali
- [x] Video search queries per tutti i moduli c12_xx → c30_xx (academyVideos.js)
- [x] SourceBadge in WineCard.jsx con fonte Liv-ex est. e confidence score
- [x] AI score noise deterministico ±2 per distribuzione realistica (wine_id % 5)
- [x] Banner B2B fisso in LandingPage con link /b2b, /methodology, /data-sources
- [x] Script generateB2BPages.js (200 topic, Claude Haiku, batch mode, dry-run)
- [x] test-all.sh aggiornato con test Academy, SourceBadge, B2B Banner

## ❌ ROSSO — Mancante

- [ ] **200 pagine B2B** `/b2b/guide/:slug` — `node backend/src/scripts/generateB2BPages.js` (usa ANTHROPIC_API_KEY)
- [ ] **Stripe webhook live** — necessario per abbonamenti real-time
- [ ] **Dominio custom** — vinoinvest.com non acquistato

## ⚠️ GIALLO — Da verificare / configurare

- [ ] Video YouTube nei moduli Academy — i placeholder search queries funzionano ma inserire URL reali per produzione
- [ ] Score noise ±2 — verificare visivamente su WineCard in produzione

## 🔵 BLU — Azioni manuali (solo Manoel)

1. **Blog 100 articoli**: `cd backend && node src/scripts/generateBlogContent.js`
2. **Stripe live**: `STRIPE_LIVE_KEY` + `STRIPE_WEBHOOK_SECRET_LIVE` su Render env
3. **Cron-job.org ping**: `https://vinoinvest-backend-2.onrender.com/api/health` ogni 10 min
4. **Dominio**: acquistare `vinoinvest.com` e collegarlo a Vercel
5. **Google Search Console**: submitta sitemap-index.xml

| Item | Action |
|------|--------|
| VAPID keys | `cd backend && npx web-push generate-vapid-keys` → Render env |
| TELEGRAM_BOT_TOKEN | @BotFather → Render env |
| ADMIN_SECRET | Generate strong secret → Render env |
| Stripe webhook live | Dashboard Stripe → webhook URL → STRIPE_WEBHOOK_SECRET |
| SMTP / SendGrid | SENDGRID_API_KEY → Render env (for demo request emails) |
| Google Search Console | Submit sitemap-index.xml manually |
| IndexNow key | Generate UUID → /public/[key].txt → INDEXNOW_KEY env |

## Quick Smoke Test

```bash
curl https://vinoinvest-backend-2.onrender.com/api/health
curl https://vinoinvest-backend-2.onrender.com/api/risk/benchmark
curl -X POST https://vinoinvest-backend-2.onrender.com/api/demo \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","company":"Test Co"}'
./test-all.sh
```

## Key URLs

| Service | URL |
|---------|-----|
| Frontend | https://vinoinvest-platform.vercel.app |
| Backend | https://vinoinvest-backend-2.onrender.com |
| API Docs | https://vinoinvest-backend-2.onrender.com/api/docs |
| B2B Landing | https://vinoinvest-platform.vercel.app/b2b |
| B2B Onboarding | https://vinoinvest-platform.vercel.app/b2b-onboarding |
| Org Dashboard | https://vinoinvest-platform.vercel.app/org-dashboard |
| Market Intelligence | https://vinoinvest-platform.vercel.app/market-intelligence |
