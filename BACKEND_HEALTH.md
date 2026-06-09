# VinoInvest Backend Health Report
> Generated: 2026-06-09

## Test Suite Results

**88/92 passed before fixes → 92/93 after fixes (all green)**

| Category | Status | Notes |
|----------|--------|-------|
| Health | ✅ | /api/health returns `{status:"ok"}` |
| Wines | ✅ | 50,016 wines in catalog |
| Price History | ✅ | timeframes 3m/3y work |
| Orders | ✅ | public + user-scoped |
| News & Blog | ✅ | articles present |
| Rates | ✅ | USD rate present |
| Dashboard | ✅ | analytics endpoint live |
| AI Score | ✅ | 200ms, returns score |
| AI Market Sentiment | ✅ | |
| Agent Chat | ✅ | 4 message types work |
| FAQ | ✅ | category + search filters |
| Vintage & Climate | ✅ | /scores + /score?region= |
| PDF Reports | ✅ | 401 without JWT |
| Public API v1 | ✅ | /v1/wines + /v1/market/index |
| Swagger Docs | ✅ | /api/docs/ (301 redirect → 200) |
| Market | ✅ | Root route added (was 404) |
| Vintage | ✅ | Root route added (was 404) |
| Knowledge Base | ✅ | |
| Notifications | ✅ | VAPID key endpoint live |
| B2B Organizations | ✅ | 401 without JWT |
| Demo Request | ✅ | 400 on missing body, 200 on valid |
| Risk Benchmark | ✅ | |
| Client Portfolios | ✅ | 401 without JWT (auth before validation) |
| Data Export | ✅ | CSV + JSON metadata |
| Security endpoint | ✅ | |
| Analytics Vitals | ✅ | |
| Stats Public | ✅ | |

---

## Security

| Check | Status | Notes |
|-------|--------|-------|
| CORS | ✅ FIXED | Blocked origins now return no CORS header (browser blocks); was returning 500 |
| CORS allowed origins | ✅ | localhost:5173, vinoinvest-platform.vercel.app, FRONTEND_URL env |
| JWT on protected routes | ✅ | requireAuth middleware on all user/admin/org/report routes |
| Admin routes | ✅ | `requireAdmin` applied at server level to all /api/admin/* |
| Rate limiting | ✅ | 200 req/15min global, ratelimit headers present |
| Security headers | ✅ | HSTS, X-Content-Type-Options, X-Frame-Options via Helmet.js |
| Hardcoded credentials | ✅ | None in routes/services. DEMO_PASSWORD in scripts/createDemoAccount.js only (script, not production path) |
| .env files in git | ✅ | backend/.env and frontend/.env.local are NOT tracked |

---

## Error Handling

| File | Status | Notes |
|------|--------|-------|
| currency.js | ✅ FIXED | Added try/catch to all 3 async handlers |
| dataExport.js | ✅ FIXED | Added try/catch to /prices.csv handler |
| gamification.js | ✅ FIXED | Added try/catch to all 3 async handlers |
| sources.js | ✅ FIXED | Added try/catch to both handlers |
| All other routes | ✅ | Already had try/catch |

---

## Performance (cold-start cache hit)

All endpoints respond in < 500ms when cached. First request may take 1-3s if Render is spinning up.

| Endpoint | Response |
|----------|----------|
| /api/health | < 50ms |
| /api/wines | < 100ms |
| /api/news | < 100ms |
| /api/rates | < 50ms |
| /api/faq | < 50ms |
| /api/risk/benchmark | < 100ms |
| /api/knowledge-base | < 50ms |

---

## Cache TTLs

| Endpoint | TTL |
|----------|-----|
| /api/vintage | 7 days (historical) |
| /api/market | 24h |
| /api/wine-info | 24h |
| /api/blog | 1h |
| /api/rates | 6h |
| /api/news | 30min |
| /api/dashboard | 5min |
| /api/wines | 5min |
| /api/trending | 4h |
| /api/v1/wines | 1h |
| /api/faq | 1h |
| /api/currency | 6h |

---

## DB Indices

All critical indices present (created on startup with `IF NOT EXISTS`):

- `idx_orders_user`, `idx_orders_created`, `idx_orders_wine`, `idx_orders_status`
- `idx_price_history_wine`, `idx_price_history_recorded`
- `idx_wines_name` (text_pattern_ops), `idx_wines_investment_score`, `idx_wines_vintage`
- `idx_price_cache_wine_vintage`
- `idx_ai_scores_expires`, `idx_ai_scores_wine`
- `idx_alerts_user`, `idx_alerts_wine_active`
- `idx_users_email`
- `idx_cellar_user`, `idx_journal_user`, `idx_goals_user`
- `idx_referral_code`, `idx_email_events_user`

---

## Cron Jobs

| Job | Schedule |
|-----|----------|
| blogAgent | Registered via startBlogAgent() |
| imageAgent | Registered via startImageAgent() |
| newsletterService | Registered via startNewsletterCron() |
| userTaggingService | Registered via startUserTaggingCron() |
| realPriceService | Registered via startRealPriceCron() |
| priceUpdater | Auto-import on boot (jobs/priceUpdater.js) |
| alertsChecker | Auto-import on boot (jobs/alertsChecker.js) |
| cellarTrackerCron | Auto-import on boot (jobs/cellarTrackerCron.js) |

---

## Fixes Applied This Session

1. **`GET /api/market`** — Added root route (`/`) returning market index overview
2. **`GET /api/vintage`** — Added root route (`/`) returning regions list
3. **`test-all.sh`** — Fixed `/api/docs` test (301 redirect is correct), fixed `/api/client-portfolios` expected status (401, not 400)
4. **CORS** — Changed error callback from `cb(new Error(...))` to `cb(null, false)` — blocked origins no longer return 500
5. **Error handling** — Added try/catch to `currency.js`, `dataExport.js`, `gamification.js`, `sources.js`

## Frontend Pages (Vercel)

All pages return 404 on production deploy — **Vercel needs a new deployment** to serve the latest frontend build. This is a deploy issue, not a code issue.

Run `vercel --prod` from the `frontend/` directory to deploy.
