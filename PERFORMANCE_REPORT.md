# VinoInvest — Performance Report
**Date:** 2026-06-06

---

## Frontend Performance

### Bundle Chunks (production build)
| Chunk | Raw | Gzip | Strategy |
|-------|-----|------|---------|
| `charts` | 360.67 kB | 103.88 kB | recharts + d3 isolated |
| `vendor` | 219.10 kB | 70.39 kB | react + react-dom + react-router |
| `supabase` | 201.05 kB | 51.57 kB | @supabase/supabase-js isolated |
| `index` | 168.99 kB | 49.08 kB | app code |
| `i18n` | 53.95 kB | 17.40 kB | i18next + react-i18next |
| `virtual` | 8.58 kB | 3.27 kB | react-window v2 |
| CSS | 17.93 kB | 4.33 kB | — |
| **Total** | **~1.03 MB** | **~300 kB** | parallel chunk loading |

Total gzip ~300 kB. Browser loads chunks in parallel; initial paint only needs `vendor` + `index` + CSS = ~185 kB gzip.

### React Rendering Optimizations

#### `WineCard` — `React.memo` with custom comparator
```jsx
// Re-renders ONLY when:
// - wine object reference changes
// - aiScore changes (new score fetched from API)
// - alertInput changes (user types in price alert)
// - inWatchlist changes
// - alerts.length changes
export default memo(WineCard, (prev, next) =>
  prev.wine === next.wine &&
  prev.aiScore === next.aiScore &&
  prev.alertInput === next.alertInput &&
  prev.inWatchlist === next.inWatchlist &&
  prev.alerts.length === next.alerts.length
);
```
**Impact:** With 20 cards, a single AI score update previously caused 20 re-renders. Now: 1.

#### `VirtualWineGrid` — react-window `List`
- Renders only visible rows (overscan=2)
- Each row = 3 WineCards at ROW_HEIGHT=464px
- 20 wines = 7 rows total, only ~2-3 visible at viewport height=880px
- Grows to 200+ wines without DOM bloat

#### `useCallback` handlers (stable references)
```
onCardTilt             → [] (stable forever)
onCardTiltReset        → [] (stable forever)
toggleWatchlist        → [watchlist]
createAlert            → [alertInputs]
deleteAlert            → [] (stable forever)
handleAlertInputChange → [] (stable forever)
handleImageClick       → [] (stable forever)
handleAddToPortfolio   → [] (stable forever)
```

#### `useMemo` — `cardProps` object
```jsx
// Single stable reference passed to VirtualWineGrid
// Only re-creates when any of its dependencies change
const cardProps = useMemo(() => ({ aiScores, alerts, ... }), [...deps]);
```

---

## Backend Performance

### Cache TTL Configuration
| Endpoint | Before | After | Ratio |
|----------|--------|-------|-------|
| `GET /api/wines` | 120s | 300s | 2.5x |
| `GET /api/market/wines` | 300s | 600s | 2x |
| `GET /api/rates` | 300s | 21600s | 72x |
| `GET /api/news` | 1800s | 1800s | unchanged |
| `GET /api/blog` | 3600s | 7200s | 2x |
| `GET /api/dashboard` | none | 300s | new |
| `GET /api/trending` | none | 14400s | new (4h) |

### ETag Support
All cached endpoints now return `ETag` header. Clients can send `If-None-Match` → server responds `304 Not Modified` with empty body.

### PostgreSQL Indices Added
```sql
-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Price history
CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON price_history(recorded_at DESC);

-- Wines (DB table)
CREATE INDEX IF NOT EXISTS idx_wines_name ON wines(name text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_wines_investment_score ON wines(investment_score DESC);
CREATE INDEX IF NOT EXISTS idx_wines_vintage ON wines(vintage);

-- Price cache
CREATE INDEX IF NOT EXISTS idx_price_cache_wine_vintage ON price_cache(wine_id, vintage);

-- AI scores
CREATE INDEX IF NOT EXISTS idx_ai_scores_wine ON ai_scores(wine_id);

-- Alerts
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_wine_active ON alerts(wine_id) WHERE active = true;

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```
**Total new indices:** 10 (+ 5 pre-existing = 15 total)

---

## Vite Build Optimizations

### manualChunks Configuration
```js
manualChunks(id) {
  if (id.includes("recharts") || id.includes("d3"))      return "charts";
  if (id.includes("@supabase"))                          return "supabase";
  if (id.includes("react-window"))                       return "virtual";  // NEW
  if (id.includes("i18next") || id.includes("react-i18next")) return "i18n"; // NEW
  if (id.includes("react") || id.includes("react-router")) return "vendor";
}
```

Build target: `es2020` — smaller output for modern browsers.

---

## Estimated Performance Gains

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Re-renders per AI score fetch (20 cards) | 20 | 1 | **-95%** |
| DOM nodes for 100 wine cards | ~2000 | ~300 (virtual) | **-85%** |
| Backend calls to `/api/rates` per hour | 12 | 0.17 | **-98.6%** |
| Backend calls to `/api/trending` per hour | ∞ | 0.25 | **-99%** |
| `charts` chunk | with app bundle | separate lazy | deferred |

---

*Build: 340ms | Test suite: 31/31 PASS*
