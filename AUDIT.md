# VinoInvest — Complete Audit
> Generated: 2026-06-05 | Severity: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## 🔴 CRITICAL BUGS

### B1 — GET /api/orders returns empty on server restart
**File:** `backend/src/server.js:750-756`
**Bug:** `let orders = []` is in-memory. `getOrders()` reads from DB but is never called to populate the array on startup. On every Render deploy, GET /api/orders returns [] until new orders are POSTed.
**Fix:** Call `getOrders()` on startup and populate `orders` array. Make GET /api/orders always read from DB.

### B2 — Notifications routing bug: Express route conflict
**File:** `backend/src/routes/notifications.js:34-44`
**Bug:** Route `PUT /read-all/:userId` is registered AFTER `PUT /:id/read`. Express matches routes in order, so `PUT /api/notifications/read-all/someUser` matches `/:id/read` with `id="read-all"` — it tries to UPDATE where `id='read-all'` (UUID), finds nothing, returns success without actually marking anything read.
**Fix:** Register `PUT /read-all/:userId` BEFORE `PUT /:id/read`.

### B3 — Pricing.jsx uses localhost:3001 in production
**File:** `frontend/src/pages/Pricing.jsx:5`
**Bug:** `const BACKEND = "http://localhost:3001"` — hardcoded. On Vercel this breaks ALL payment flows (Stripe checkout, PayPal) since the frontend sends payment requests to localhost.
**Fix:** Use `import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com"`.

### B4 — WinePriceCompare fires on every wine card load
**File:** `frontend/src/components/WinePriceCompare.jsx:9-19`
**Bug:** Every wine card in the market (up to 200 per page) fires a fetch to `/api/prices/:id?wineName=...` on mount. This triggers Wine-Searcher scraping for each wine → instant IP ban + 200 simultaneous requests → backend DoS.
**Fix:** Lazy load only when user explicitly hovers/clicks the Compare button. Add abort controller to clean up on unmount.

---

## 🟠 HIGH BUGS

### B5 — PriceHistoryChart width never updates on resize
**File:** `frontend/src/components/PriceHistoryChart.jsx:12-16`
**Bug:** `offsetWidth` captured once on mount, never recalculated when container resizes (e.g., sidebar collapse). Chart gets clipped.
**Fix:** Use ResizeObserver.

### B6 — Memory leak: WinePriceCompare fetch on unmount
**File:** `frontend/src/components/WinePriceCompare.jsx:9-19`
**Bug:** No AbortController — if wine card is unmounted while fetch is in flight, React warns "Can't perform a state update on an unmounted component".
**Fix:** AbortController in useEffect cleanup.

### B7 — orders GET never reflects DB state
**File:** `backend/src/server.js:97-108` (loadData in frontend also affected)
**Bug:** In-memory `orders[]` array is populated by POST but never synced from DB. After Render restart, `/api/orders` returns [] and My Portfolio shows empty.
**Fix:** Make GET /api/orders call `getOrders()` directly.

### B8 — Mobile: sidebar + cards not responsive
**File:** `frontend/src/style.css:57-70, 282-286`
**Bug:** Sidebar is fixed 220px, wine cards minmax 278px. On mobile (<768px) the sidebar and grid overflow, layout breaks.
**Fix:** Add media queries for mobile/tablet.

### B9 — No health endpoint for Render keep-alive
**File:** `backend/src/server.js`
**Bug:** Render free tier sleeps after 15min inactivity. No `/api/health` endpoint. Frontend shows blank on cold start without user feedback.
**Fix:** Add GET /api/health + frontend wakeup ping with loading banner.

### B10 — Analysis tab: chart shows old data when wine changes
**File:** `frontend/src/App.jsx` (loadChart + toggleWatchlist)
**Bug:** `chartData` is not cleared when switching watchlist wines. Old chart flashes briefly before new data loads.
**Fix:** Clear `setChartData([])` before fetching.

---

## 🟡 MEDIUM ISSUES

### M1 — No export CSV for portfolio
**Missing feature** — User cannot export portfolio data.

### M2 — No P&L daily/weekly breakdown
**File:** `frontend/src/App.jsx:888-944` (myportfolio tab)
**Missing feature** — Only shows overall ROI, no time-based P&L.

### M3 — No pie chart for portfolio diversification
**Missing feature** — No breakdown by region/type/vintage.

### M4 — Analysis section is minimal
**File:** `frontend/src/App.jsx:859-886`
**Issue:** Shows only a watchlist chart, no market overview, no top performers, no regional analysis.

### M5 — B2B Dashboard incomplete
**File:** `frontend/src/pages/Dashboard.jsx`
**Issue:** Shows only analytics from orders table, no wine management, no client list, no export.

### M6 — Trending wines not loaded on dashboard mount
**File:** `frontend/src/App.jsx`
**Bug:** `loadTrending()` is defined but no useEffect calls it on login/mount. Dashboard shows skeletons indefinitely.

### M7 — WineBottle3D.jsx imported but never used
**File:** `frontend/src/App.jsx:9` — `import WineBottle3D from "./WineBottle3D"` 
**Issue:** Dead import. The named import is `WineBottle3D` but the component used is `WineBottle3DModal`. Adds to bundle.

### M8 — No mobile hamburger menu
**File:** `frontend/src/App.jsx:598-621` (sidebar)
**Issue:** On mobile, sidebar shows as a fixed strip or overflows. No hamburger toggle.

### M9 — WinePriceCompare fires Wine-Searcher scraper for every card
**Issue:** 200 wine cards × 1 fetch each = 200 Wine-Searcher requests on page load. Most will timeout/fail gracefully but waste backend resources.

### M10 — AI Portfolio tab lacks real AI analysis
**File:** `frontend/src/App.jsx:953-988`
**Issue:** Just shows pre-defined allocation percentages. No real AI analysis of user's actual portfolio.

### M11 — console.log / console.warn in production code
**Files:** `backend/src/server.js`, `backend/src/services/priceService.js`, etc.
**Issue:** Verbose logging (e.g., `[priceUpdater]`, `[priceService]`) in production. Minor noise.

### M12 — Render sleep notification missing
**Issue:** No user feedback when backend cold-starts from Render free tier sleep.

---

## 🟢 LOW ISSUES

### L1 — fetchAIScore deduplication with Set
**File:** `frontend/src/App.jsx` (aiQueueRef)
**Issue:** `fetchedAIRef` Set grows unboundedly. On infinite scroll with 10k wines, Set holds 10k IDs in memory. Fine for now but could leak.

### L2 — priceService.js: LIKE wildcard match could be overly broad  
**File:** `backend/src/services/priceService.js:251`
**Issue:** `wineId.replace(/-\d{4}$/, "")` → `pattern = producer + "%"`. For `opus-one-2018` → `opus-one%` matches correctly. But `lafite-2018` → `lafite%` would match any wine starting with "lafite". Not a security issue (parameterized query) but could return wrong history.

### L3 — `orders` table `created_at` is TEXT not TIMESTAMPTZ
**File:** `backend/src/server.js:152-160`
**Issue:** `created_at TEXT` — storing ISO strings as text. Won't break but prevents proper date range queries and indexing is less efficient.

### L4 — Bottle3D hardcoded grape variety detection
**File:** `frontend/src/components/Bottle3D.jsx:1-8`
**Issue:** `getBottleColor` uses string matching on name/region. "Masseto" is hardcoded for dark color. For new wines added to bigWines, color will often default to green.

### L5 — No VITE_BACKEND_URL in Vercel env
**Issue:** `import.meta.env.VITE_BACKEND_URL` must be set in Vercel dashboard. If not set, falls back to hardcoded production URL which is correct, but Pricing.jsx uses different hardcoded URL.

---

## Features Incomplete / Missing

| Feature | Status | Priority |
|---------|--------|----------|
| GET /api/orders reads DB | ❌ Bug | Critical |
| Notifications read-all routing | ❌ Bug | Critical |
| Mobile responsive | ❌ Missing | High |
| Health endpoint + wakeup | ❌ Missing | High |
| Portfolio diversification chart | ❌ Missing | Medium |
| Analysis page market overview | ❌ Missing | Medium |
| Portfolio export CSV | ❌ Missing | Medium |
| Trending auto-load on mount | ❌ Bug | Medium |
| WinePriceCompare lazy | ❌ Bug/Perf | High |
| AI Portfolio real analysis | ❌ Incomplete | Medium |

---

## Fixes Applied This Session

See commit history below for resolution of each item.
