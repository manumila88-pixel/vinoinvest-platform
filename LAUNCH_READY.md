# VinoInvest — Launch Readiness Checklist

> Last updated: 2026-06-09

## Legend
- ✅ Done & verified
- 🔄 In progress / partially done
- ⬜ Not started
- ❌ Blocked / needs action

---

## 1. Core Platform Features

| Feature | Status | Notes |
|---------|--------|-------|
| Wine catalog (search, filter, pagination) | ✅ | Server-side, infinite scroll |
| Price history charts | ✅ | Per wine, multiple timeframes |
| Portfolio tracker (add/remove/ROI) | ✅ | With analytics |
| AI Score (0-100) | ✅ | Claude Haiku + algorithmic |
| AI Wine Advisor Chat | ✅ | All 8 question categories + follow-ups |
| Wine Knowledge Base FAQ | ✅ | 42 FAQs, /api/faq endpoint |
| Proactive AI Briefing | ✅ | Daily morning card, per-user |
| Investment Calculator | ✅ | Modal popup |
| Price Alerts (email) | ✅ | alertsChecker.js cron |
| Dark/Light mode | ✅ | ThemeToggle.jsx |
| Keyboard shortcuts | ✅ | Cmd+K search, Cmd+P portfolio |
| En Primeur Tracker | ✅ | /en-primeur page |
| Vintage Comparator | ✅ | Bubble chart at /annate |
| Wine Journal | ✅ | Personal tasting notes |
| Label Scanner | ✅ | Camera + Claude Vision |
| Wine Cellar Manager | ✅ | /cellar page |
| Portfolio Public Share | ✅ | /share/:id |
| Vintage Climate Scores | ✅ | Open-Meteo data, persisted to DB |
| Reddit Sentiment Badge | ✅ | r/wine public JSON API |
| Award Badges | ✅ | Gambero Rosso, WS, Parker, Decanter |
| Community Tasting Notes | ✅ | CellarTracker API |
| Producer Info (Wikidata) | ✅ | SPARQL, 7-day cache |
| Voice Interface | ✅ | Web Speech API |
| PDF Portfolio Report | ✅ | PDFKit, /api/reports endpoint |
| Public API v1 + Swagger | ✅ | /api/docs |
| Embeddable Widget | ✅ | Shadow DOM, /widget.js |
| Web Push Notifications | ✅ | VAPID flow complete |
| Chrome Extension | ✅ | Manifest v3 |
| Telegram Bot | ✅ | /price /score /vintage /news |
| B2B Dashboard | ✅ | /b2b page |

---

## 2. Authentication & Security

| Item | Status | Notes |
|------|--------|-------|
| Supabase real auth (login/signup) | ✅ | AuthModal.jsx |
| JWT middleware (requireAuth) | ✅ | All protected routes |
| Rate limiting (200 req/15min) | ✅ | express-rate-limit |
| AI rate limit (20 req/min) | ✅ | Separate limiter |
| CORS restricted to known origins | ✅ | vinoinvest-platform.vercel.app |
| Security headers (Helmet) | ✅ | CSP, HSTS, X-Frame |
| Admin secret (ADMIN_SECRET) | ❌ | **Set in Render env vars** |

---

## 3. Payments

| Item | Status | Notes |
|------|--------|-------|
| Stripe checkout (frontend) | ✅ | /pricing page |
| PayPal checkout | ✅ | PaymentModal.jsx |
| Stripe webhook handler | 🔄 | Code exists, needs live webhook config in Stripe dashboard |
| Subscription DB table | ✅ | Created on first webhook |
| Pro/Premium gating | ✅ | premiumContent.js checks |

---

## 4. Infrastructure & Deployments

| Item | Status | Notes |
|------|--------|-------|
| Frontend → Vercel | ✅ | vinoinvest-platform.vercel.app |
| Backend → Render | ✅ | vinoinvest-backend-2.onrender.com |
| PostgreSQL → Render | ✅ | vinoinvest_db |
| GitHub repo | ✅ | github.com/manumila88-pixel/vinoinvest-platform |
| Supabase project | ✅ | xghuyfgftvrhnmuezbbz |

---

## 5. Environment Variables — Backend (Render)

| Variable | Status | Notes |
|----------|--------|-------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `SUPABASE_URL` | ✅ | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | |
| `ANTHROPIC_API_KEY` | ✅ | Claude Haiku for AI features |
| `STRIPE_SECRET_KEY` | ✅ | |
| `STRIPE_WEBHOOK_SECRET` | 🔄 | Need live webhook endpoint in Stripe |
| `VAPID_PUBLIC_KEY` | ❌ | **Run: `cd backend && npx web-push generate-vapid-keys`** |
| `VAPID_PRIVATE_KEY` | ❌ | Same as above |
| `VAPID_SUBJECT` | ❌ | Set to `mailto:admin@vinoinvest.com` |
| `TELEGRAM_BOT_TOKEN` | ❌ | **Get from @BotFather on Telegram** |
| `ADMIN_SECRET` | ❌ | Set a strong secret for admin CLI |
| `FRONTEND_URL` | ✅ | https://vinoinvest-platform.vercel.app |
| `NEWSAPI_KEY` | 🔄 | Optional — RSS fallback works without it |
| `JWT_SECRET` | ✅ | |
| `PAYPAL_CLIENT_ID` | ✅ | |
| `PAYPAL_CLIENT_SECRET` | ✅ | |

---

## 6. Frontend Environment Variables (Vercel)

| Variable | Status |
|----------|--------|
| `VITE_BACKEND_URL` | ✅ |
| `VITE_SUPABASE_URL` | ✅ |
| `VITE_SUPABASE_ANON_KEY` | ✅ |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ✅ |
| `VITE_PAYPAL_CLIENT_ID` | ✅ |

---

## 7. Code Quality

| Item | Status | Notes |
|------|--------|-------|
| No production console.logs in routes | ✅ | Cleaned 2026-06-09 |
| Error boundaries on all major sections | ✅ | Including floating chat overlay |
| Loading skeletons (SkeletonCard) | ✅ | VirtualWineGrid |
| Empty states on wine grid | ✅ | Zero results message |
| Offline fallback (Service Worker) | ✅ | sw.js with push event |
| Mobile responsive (no horizontal scroll) | ✅ | min-width handled |

---

## 8. SEO & Discoverability

| Item | Status | Notes |
|------|--------|-------|
| Sitemap.xml | ✅ | /sitemap.xml dynamic |
| robots.txt | ✅ | |
| Meta tags per page | ✅ | react-helmet-async |
| Google Business Profile | 🔄 | See GOOGLE_BUSINESS_SETUP.md |
| Bing Webmaster | 🔄 | See BING_SETUP.md |
| OpenGraph tags | ✅ | og:title, og:description, og:image |

---

## 9. Pending Actions Before Launch

```bash
# 1. Generate VAPID keys (run on Render shell or locally):
cd backend && npx web-push generate-vapid-keys
# → Add VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY to Render
# → Set VAPID_SUBJECT=mailto:admin@vinoinvest.com

# 2. Set admin secret:
# → Add ADMIN_SECRET=<strong-random-string> to Render env vars

# 3. Get Telegram bot token:
# → Open Telegram, message @BotFather, /newbot
# → Add TELEGRAM_BOT_TOKEN to Render env vars

# 4. Configure Stripe live webhook:
# → Stripe Dashboard → Webhooks → Add endpoint
# → URL: https://vinoinvest-backend-2.onrender.com/api/payments/webhook
# → Events: checkout.session.completed, customer.subscription.deleted
# → Copy webhook signing secret → Add STRIPE_WEBHOOK_SECRET to Render

# 5. Run test suite:
chmod +x test-all.sh && ./test-all.sh
# → Fix any FAILs before pushing
```

---

## 10. Launch Checklist

- [ ] All pending env vars set on Render (VAPID x3, Telegram, Admin, Stripe webhook)
- [ ] Stripe webhook configured for live mode
- [ ] test-all.sh passes 50+ tests
- [ ] Google Business Profile submitted
- [ ] Final git push to main → Vercel + Render auto-deploy
- [ ] Manual smoke test on mobile (iOS Safari + Android Chrome)
- [ ] Smoke test: register → add wine → chat → view portfolio → PDF export

---

**Launch status: 🟡 ALMOST READY — 4 env vars pending (VAPID, Telegram, Admin, Stripe webhook)**
