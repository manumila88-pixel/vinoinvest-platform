# VinoInvest — Performance Report

> Measured: 2026-06-06 | Backend: vinoinvest-backend-2.onrender.com | Frontend: Vite 8.0.12

---

## Response Times (cold start, production Render)

| Endpoint | Time | Target | Status |
|----------|------|--------|--------|
| `GET /api/wines` | 645ms | <200ms (cached) | ⚠️ Cold |
| `GET /api/prices/:id/history` | 275ms | <300ms | ✅ |
| `GET /api/news` | 241ms | <500ms | ✅ |
| `GET /api/blog` | 238ms | <1000ms | ✅ |
| `GET /api/rates` | 404ms | <500ms | ✅ |
| `GET /api/dashboard/analytics` | 496ms | <500ms | ✅ |

> Note: Render free tier cold-starts after 15min idle. `/api/wines` target of <200ms is achievable after NodeCache warms up (subsequent requests served from memory).

---

## Frontend Bundle Size

| Asset | Raw | Gzip |
|-------|-----|------|
| index.html | 8.2 KB | 1.8 KB |
| CSS | 17.9 KB | 4.3 KB |
| supabase chunk | 200.9 KB | 51.5 KB |
| main app chunk | 215.9 KB | 64.1 KB |
| vendor chunk | 223.5 KB | 72.4 KB |
| recharts chunk | 359.7 KB | 103.7 KB |
| **Total JS** | **~1.0 MB** | **~292 KB** |

✅ Gzip total ~292 KB — well under 800 KB target (browser receives gzip).

---

## Token Optimization — Before vs After

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Model for blog | claude-sonnet-4-6 | claude-haiku-4-5-20251001 | **25× cheaper** |
| System prompt caching | None | `cache_control: ephemeral` | **~90% input tokens** |
| Wine scoring | 1 call/wine | Batch 10/call | **10× fewer API calls** |
| Token budget (agent) | Unlimited | 1000 max | Predictable cost |
| Token budget (portfolio) | Unlimited | 3000 max | Cost capped |

**Estimated cost per 1000 blog articles:** ~$0.60 (Haiku) vs $15.00 (Sonnet) — 25× reduction.

---

## Caching Strategy

| Data | TTL | Storage |
|------|-----|---------|
| `/api/wines` | 120s | NodeCache in-memory |
| `/api/news` | 1800s | NodeCache + Cache-Control |
| `/api/blog` | 3600s | NodeCache + Cache-Control + DB |
| `/api/rates` | 300s | NodeCache + Cache-Control |
| `/api/agent/opportunities` | 900s | NodeCache |
| AI blog generation | 7 days (per slug) | PostgreSQL blog_posts |
| Price history | On-demand | PostgreSQL + seeded fallback |

---

## DB Connection Pool

```
max connections: 10
idle timeout: 30s
connection timeout: 5s
```

Indexes added:
- `idx_orders_user` on `orders(user_id)`
- `idx_orders_created` on `orders(created_at DESC)`
- `idx_orders_wine` on `orders(wine_id)`
- `idx_api_usage_created` on `api_usage(created_at DESC)`
- `idx_api_usage_endpoint` on `api_usage(endpoint)`

---

## AI Agent Performance

| Task | Model | Max tokens | Est. cost/call |
|------|-------|-----------|----------------|
| Chat (simple Q&A) | Haiku | 1000 | $0.001 |
| Portfolio analysis | Sonnet | 3000 | $0.009 |
| Batch score 10 wines | Haiku | 1024 | $0.0008 |
| Blog article | Haiku | 700 | $0.0006 |
| Image agent | n/a | n/a | $0.00 |

Monitoring: `GET /api/admin/costs` — daily/weekly/monthly breakdown + alert if >$5/day.

---

## Mobile Performance

- iOS zoom prevention: `font-size: 16px` on textarea inputs
- Chart overflow: `overflow-x: auto` on chartPanel at 480px
- Touch targets: `min-height: 44px` on all action buttons
- Sidebar: CSS transform slide (no JS layout recalc)
- Image loading: `loading="lazy"` on all wine card images

---

## Optimizations Added This Session

1. **NodeCache** — in-memory cache layer for all read endpoints
2. **aiOptimizer.js** — model selection, compressed prompts, batch analysis, cost estimation
3. **Prompt caching** — `cache_control: ephemeral` on system prompts
4. **blogAgent.js** — cron Monday 06:00, DB-persisted, no regeneration of existing slugs
5. **imageAgent.js** — nightly 02:00, Vivino CDN + Unsplash fallback
6. **tokenTracker.js** — logs all API usage to `api_usage` table
7. **Connection pool** — max 10 connections, timeout settings
8. **DB indexes** — on api_usage, purchase_clicks
9. **react-window** installed — ready for virtual list on 50k+ wine market
10. **PurchaseModal** — affiliate links + external import without page reload
