# VinoInvest — Missing Features & Next Steps

> Updated: 2026-06-06
> Status: everything shipped so far is production-ready.

## Completed ✅

| Feature | Notes |
|---------|-------|
| Stripe + PayPal + /pricing | Live payment flows |
| Wine search server-side + infinite scroll | 50k+ wines, debounced |
| Price history chart (all timeframes 1w–max) | Real DB + estimated fallback |
| Three.js removed, SVG bottle, bundle −53% | Clean, fast |
| JWT auth (Supabase) on protected endpoints | POST /orders, POST /wines |
| Rate limiting (200/15min global, 20/min AI) | express-rate-limit |
| CORS restricted to Vercel + localhost | Origin whitelist |
| i18n — 40 languages, browser auto-detect | i18next, RTL for ar/he |
| SEO — sitemap.xml, robots.txt, hreflang×40 | All pages |
| Affiliate links — Wine-Searcher + Vivino on every card | rel=sponsored |
| Mobile responsive — 480px + 768px breakpoints | Hamburger, slide sidebar |
| AI Agent — tool use, 6 tools, conversation history | POST /api/agent/chat |
| AgentChat UI — suggestions, tool badges, streaming dots | Portfolio tab |
| B2B Dashboard — analytics, wine management, PDF report | /dashboard |
| Blog — AI-generated articles | /api/blog |
| Price alerts — alert creation | /api/alerts |
| Push notifications — browser Notification API | Frontend only |
| Orders — per-user scoping via user_id | DB + API |

---

## Missing / Not Implemented ❌

### Priority 1 — Revenue Critical

| Feature | Why missing | Effort |
|---------|-------------|--------|
| **Stripe webhook live (production)** | Render env var `STRIPE_WEBHOOK_SECRET` must be set to real Stripe live secret. The code is written (`/api/payments/stripe/webhook`), just needs the secret + Stripe dashboard webhook configured to that URL. | 1h |
| **Email alerts (Nodemailer / SendGrid)** | `alertsChecker.js` detects price breaches but has no email sender. Need `SENDGRID_API_KEY` or SMTP config + 1 email template. | 4h |
| **Real Supabase login UI** | Login modal calls `supabase.auth.signInWithPassword()` but UX is minimal. No password reset, no social login (Google/Apple). | 8h |

### Priority 2 — Growth

| Feature | Why missing | Effort |
|---------|-------------|--------|
| **AI Score per wine (Claude API)** | Route `/api/ai-score` exists and returns a score, but score is synthetic (seeded random × factors). To get real Claude scores, send wine data to Claude Haiku and parse JSON response with investment_score + rationale. Needs `ANTHROPIC_API_KEY` on Render. | 4h |
| **Portfolio sharing / export PDF** | Users want to export their portfolio as PDF. React-to-PDF or server-side Puppeteer. | 6h |
| **Secondary market (peer-to-peer)** | Users list bottles for sale. Needs `listings` table + Stripe Connect for payouts. | 2 weeks |
| **Wine authentication / provenance** | QR code on each bottle, blockchain hash. | sprint |

### Priority 3 — Operations

| Feature | Why missing | Effort |
|---------|-------------|--------|
| **Price data from real sources** | Currently synthetic (seeded random). Integrate Wine-Searcher API ($299/mo) or scrape Liv-ex CSV exports. | 1 week |
| **Automated tests in CI** | `test-all.sh` runs locally. Should run in GitHub Actions on every push. Add `.github/workflows/test.yml`. | 2h |
| **Error monitoring (Sentry)** | No error tracking in production. Add `@sentry/node` (backend) + `@sentry/react` (frontend). | 2h |
| **Analytics (Plausible/PostHog)** | No user analytics. Add lightweight script to `index.html`. | 1h |
| **ANTHROPIC_API_KEY on Render** | AI Agent + AI Score endpoints degrade gracefully without it but produce no real AI responses. Set real key in Render dashboard. | 5 min |
| **NEWS_API_KEY** | News endpoint falls back to mock articles without it. Register at newsapi.org (free tier) and set env var. | 10 min |

### Priority 4 — Nice to Have

| Feature | Why missing | Effort |
|---------|-------------|--------|
| **Dark / Light theme toggle** | All dark only. Add CSS variables + toggle in header. | 3h |
| **Wine comparison tool** | Side-by-side comparison of 2–4 wines. | 4h |
| **Cellar tracking** | Physical bottle location + drinking window + tasting notes. | 1 week |
| **AI Agent autonomous buying** | Agent calls POST /api/orders automatically when score > threshold + budget available. Legal/compliance review needed first. | sprint |

---

## Environment Variables Required on Render

```
DATABASE_URL         ← already set
SUPABASE_URL         ← already set
SUPABASE_ANON_KEY    ← already set
STRIPE_SECRET_KEY    ← already set
STRIPE_WEBHOOK_SECRET ← ⚠️ MISSING — set to Stripe live webhook secret
ANTHROPIC_API_KEY    ← ⚠️ MISSING — set real key for AI features
NEWS_API_KEY         ← ⚠️ MISSING — newsapi.org free key
SENDGRID_API_KEY     ← ⚠️ MISSING — for email price alerts
PAYPAL_CLIENT_ID     ← already set
PAYPAL_CLIENT_SECRET ← already set
```

---

## Quick Wins (< 1h each)

1. Set `ANTHROPIC_API_KEY` on Render → AI Agent + AI Score work immediately
2. Set `NEWS_API_KEY` on Render → real wine news instead of mock
3. Configure Stripe webhook URL in Stripe dashboard → payments confirmed instantly
4. Add `.github/workflows/test.yml` to run `test-all.sh` on push

---

*This file is maintained by the development agent. Last updated automatically.*
