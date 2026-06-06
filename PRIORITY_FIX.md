# PRIORITY_FIX.md — VinoInvest Fix Order
Generated: 2026-06-06

## FASE 1 — CRITICO (fix immediately, can crash)

| ID | File | Fix |
|----|------|-----|
| C1 | frontend/src/App.jsx:1319 | `toast.success(...)` → `toast(..., "success")` |
| C2 | backend/src/services/priceService.js:7-9 | sync getPool → async getPool |
| C3 | frontend/src/App.jsx:354 + backend/src/server.js:784 | Pass userId to GET /api/orders |

## FASE 2 — GRAVE (fix before next deploy)

| ID | File | Fix |
|----|------|-----|
| G1 | frontend/src/App.jsx:686 | useMemo growthData with dynamic start date |
| G2 | frontend/src/App.jsx:667 | useMemo holdings |
| G3 | frontend/src/components/PriceHistoryChart.jsx | Add timeframe buttons (1w/1m/3m/6m/1y/3y/5y/10y/max) |
| G5 | backend/src/server.js:342 | Persist new wines to PostgreSQL |
| G6 | backend/src/server.js:276 | Deterministic seeded random for currentMarketPrice |

## FASE 3 — MEDIO (this sprint)

| ID | File | Fix |
|----|------|-----|
| M8 | frontend/src/App.jsx:598 | Guard notification polling with isLoggedIn |
| M11 | backend/src/routes/blog.js:84 | Add slug fallback from title |
| M12 | backend/src/routes/aiPortfolio.js:22 | Sort holdings before cache key |
| L6 | frontend/src/WineBottle3D.jsx | Delete dead file |

## FASE 4 — MINORE + SICUREZZA (backlog)

| ID | File | Fix |
|----|------|-----|
| S1 | backend/src/server.js:342 | Auth check on POST /api/wines |
| L4 | backend/src/services/priceService.js | Remove unused axios/cheerio imports |
| L2 | frontend/src/App.jsx:1 | Remove unused React import |
| M5 | backend/src/routes/news.js | Handle HK country code |
