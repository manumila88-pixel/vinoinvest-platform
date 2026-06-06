# FULL_AUDIT.md — VinoInvest Chirurgical Audit
Generated: 2026-06-06

---

## CRITICO — Crash / Data Loss

### C1 · App.jsx:1319 — toast.success() crash
`toast` from `useToast()` is a plain function `(msg, type) => void`.
Calling `toast.success(...)` is `undefined()` → TypeError crash when user clicks "Enable Push".
**Fix:** Replace `toast.success("Push notifications enabled!")` → `toast("Push notifications enabled!", "success")`

### C2 · priceService.js:8-9 — getPool() always returns null on first call
Uses sync fire-and-forget `import("../db/pool.js").then(m => { pool = m.pool })` then `return pool` synchronously.
First invocation returns null even with DATABASE_URL set. Any request served before the microtask resolves
gets the fallback (synthetic data), silently. Subsequent calls work.
**Fix:** Convert priceService.js getPool to the same async `await import()` pattern as alertsChecker.js.

### C3 · App.jsx:354-361 — GET /api/orders returns ALL orders (no user filter)
`loadData()` calls `/api/orders` without userId. Server returns all orders from DB.
Any logged-in user sees all other users' portfolio orders.
**Fix:** Pass userId in query: `/api/orders?userId=${getUserId()}` and filter in server.

---

## GRAVE — Functional Bugs

### G1 · App.jsx:686-689 — growthData uses hardcoded 2025 start date
`new Date(2025, 5 + i, 1)` always starts from Jun 2025 regardless of when user bought.
The "Portfolio Growth" chart is disconnected from real portfolio start date.
**Fix:** Use `useMemo`, derive start from earliest order or 12 months ago.

### G2 · App.jsx:667-679 — holdings computed inline on every render
`orders.map(...)` creates new objects on every state change, causing all child components to re-render.
**Fix:** `useMemo(() => orders.map(...), [orders, wines])`

### G3 · PriceHistoryChart.jsx — no timeframe selection
Chart always shows all available data with no 1w/1m/3m/6m/1y/3y/5y/10y/max buttons.
User cannot drill into short-term trends.
**Fix:** Add timeframe state + filter data + pass `?timeframe=` to API.

### G4 · priceService.js — getPool sync pattern (duplicate of C2 in all routes using it)
alerts.js getPool correctly uses `async getPool()`. But priceService.js and the inline
getPool in several routes uses the sync/fire-and-forget pattern.

### G5 · server.js:342-349 — POST /api/wines writes in-memory only
Wine added via B2B form is lost on Render restart. Not persisted to PostgreSQL.
**Fix:** INSERT into wines table (create table if not exists).

### G6 · server.js:815-817 — currentMarketPrice random on each order
`getMarketMultiplier` calls `Math.random()` each time. Two orders for the same wine get
different "current" prices. Portfolio ROI calculations become inconsistent.
**Fix:** Seed the random with wine.id for deterministic per-wine multiplier.

### G7 · App.jsx:1319 — `if (perm === "granted") toast.success(...)` (same as C1)

---

## MEDIO — UX / Performance Issues

### M1 · WineBottle3DModal.jsx — no AbortController on PriceHistoryChart fetch
If modal is closed before chart loads, the fetch completes and tries to setState on unmounted component.
PriceHistoryChart already handles this — but the parent modal fetch in App.jsx:486-498 does not.
**Fix:** Already fixed in App.jsx (setChartData([])), but PriceHistoryChart.jsx fetch has no AbortController.

### M2 · App.jsx:265-278 — ResizeObserver depends on `tab` in deps array
The observer is disconnected and re-created every tab change. If `analysisChartRef.current` is null
when tab changes, the ref is not observed until next tab switch.
**Fix:** Keep the observer always connected regardless of tab, or attach lazily when ref mounts.

### M3 · App.jsx:686 — growthData Math.pow(1.08) fixed 8% assumption
Portfolio growth is always projected at flat 8%/year with no real data.
At minimum add a comment; ideally show it as "projected" with disclaimer.

### M4 · server.js:276 — getMarketMultiplier adds noise: `Math.random()` non-deterministic
(see G6)

### M5 · news.js — country filter: "HK" not in frontend filter list
Frontend shows IT/FR/US/AU/ZA but Pétrus article has country "HK". Will never appear.

### M6 · App.jsx:607-608 — prevUnreadRef starts at 0, suppresses first push
`if (current > prevUnreadRef.current && prevUnreadRef.current !== 0)` means the first notification
never triggers a push (prevUnreadRef is 0 on mount). This is intentional (avoids push on load),
but the comment is missing making it surprising.

### M7 · Dashboard.jsx — win.document.close() needed for Firefox print
`printReport()` calls `win.document.write(...)` then relies on `onload`. Some browsers (Firefox)
need `win.document.close()` before `onload` fires.
**Status:** Already present at line 62: `win.document.close()` ✓

### M8 · App.jsx:602-603 — Notification polling fires immediately on mount
`loadNotifications()` is called once unconditionally (line 599), then again by interval after 30s.
If user is not logged in yet, call may 404 on userId = undefined.
**Fix:** Guard with `if (isLoggedIn)` or move inside auth effect.

### M9 · App.jsx:350 — `loadData()` and `loadTrending()` not called for initial localStorage session
Auth effect on line 331 uses `onAuthStateChange`. If user has a valid Supabase session from
localStorage, the INITIAL_SESSION event fires synchronously and calls loadData via useEffect line 350.
This is correct. ✓

### M10 · App.jsx:665 — `totalMarket` sums currentPrice of wines[] (market wines, not portfolio)
This is labeled "Global Market" — the label is accurate, but value is the sum of displayed wines
which is misleading as "global market" implies Liv-ex etc.

### M11 · blog.js — no slug field fallback
If Claude omits "slug" in JSON response, `post.slug` is undefined → GET /api/blog/:slug 404.
**Fix:** Generate slug from title if missing.

### M12 · aiPortfolio.js:22 — cache key uses JSON.stringify(holdings.map(...))
If holdings are in different order each time, cache misses even for same portfolio.
**Fix:** Sort before stringifying.

---

## MINORE — Code Quality

### L1 · server.js — extreme whitespace formatting
`normalize()`, `getMarketMultiplier()`, route handlers have 1 statement per line with blank lines
between each expression. Makes 800-line file harder to scan.

### L2 · App.jsx:1 — `React` imported but never used (Vite JSX transform handles it)
Minor, but can confuse ESLint.

### L3 · WineBottle3DModal.jsx:51 — `touchmove` preventDefault without passive:false warning
`{ passive: false }` is set — correct. ✓

### L4 · backend/src/services/priceService.js — axios + cheerio imported but scraping disabled
`getPrices()` falls back to synthetic data; real scraping code is never reached.
Unused `axios`/`cheerio` add ~300KB to backend bundle.

### L5 · App.jsx:729 — accountType "cantina" hardcoded
B2B tab only shows for `accountType === "cantina"`. If Supabase uses different value (e.g. "b2b"),
tab never appears.

### L6 · frontend/src/WineBottle3D.jsx — dead file
Old Three.js component still in src/ but never imported. Wastes disk, confuses readers.
**Fix:** Delete it.

### L7 · blog.js:9 — CACHE_TTL in-memory only
If Render restarts, blog cache is cleared and 3 Claude Haiku calls fire immediately on next request.
**Fix:** Accept as-is (24h regeneration is fine); or persist to DB.

### L8 · App.jsx:38 — comment "── News Card ──" is empty (the component is below it)
NewsCard component is defined at line 136, but comment on line 35-36 misplaced.

---

## SICUREZZA

### S1 · server.js:342 — POST /api/wines has no auth check
Any anonymous request can add wines to the in-memory list.
**Fix:** Add middleware to verify Supabase JWT or at least check a secret header.

### S2 · App.jsx:568-570 — Alert direction hardcoded to "below"
Users cannot set "above" alerts from UI. API supports it but form sends `direction: "below"` always.

### S3 · dashboard.js — analytics returns all orders from all users
B2B dashboard aggregates data from all users' orders. Acceptable for admin view; document this assumption.

---

## SUMMARY COUNT
- CRITICO: 3 (C1, C2, C3)
- GRAVE: 7 (G1-G7)
- MEDIO: 12 (M1-M12)
- MINORE: 8 (L1-L8)
- SICUREZZA: 3 (S1-S3)
