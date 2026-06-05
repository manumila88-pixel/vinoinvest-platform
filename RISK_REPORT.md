# VinoInvest — Risk Report & Solutions Applied
> Generated: 2026-06-05 | All issues resolved unless marked ⚠️ MANUAL

---

## 🔴 CRITICAL

### 1. AI Score API flooding
**File:** `frontend/src/App.jsx:210-213`
**Risk:** `useEffect` chiama `fetchAIScore` per ogni vino nel market load. Con infinite scroll → centinaia di chiamate Claude Haiku in parallelo. Costo esplosivo + Anthropic rate-limit 429.
**Fix applied:** Batch sequenziale con delay 150ms tra chiamate + throttle max 8 in-flight.

### 2. ResponsiveContainer bug — charts vuoti
**File:** `frontend/src/App.jsx:508-516` (Analysis), `577-585` (Portfolio)
**Risk:** Recharts `ResponsiveContainer` in Vite/Rolldown non calcola il width correttamente → chart renderizzato a 0px → invisibile.
**Fix applied:** Rimosso `ResponsiveContainer`, sostituito con width fisso calcolato da `useRef + offsetWidth`.

### 3. No helmet — headers HTTP mancanti
**File:** `backend/src/server.js`
**Risk:** Senza `helmet`, il server non imposta X-Content-Type-Options, X-Frame-Options, CSP, HSTS → vulnerabile a clickjacking, MIME sniffing, XSS.
**Fix applied:** Aggiunto `helmet()` come primo middleware.

### 4. No rate limiting
**File:** `backend/src/server.js`
**Risk:** Nessun limite di richieste → DoS, brute force su `/api/orders`, spam su `/api/ai-score`.
**Fix applied:** `express-rate-limit` — 100 req/15min globale; 20 req/min per `/api/ai-score`.

### 5. CORS completamente aperto
**File:** `backend/src/server.js:26`
**Risk:** `app.use(cors())` accetta richieste da qualunque origine → CSRF attacks da siti terzi.
**Fix applied:** CORS limitato a `FRONTEND_URL` + `localhost:5173` in dev.

---

## 🟠 HIGH

### 6. window.alert() nativo
**File:** `frontend/src/App.jsx:283`
**Risk:** Blocca il thread principale, esperienza utente orribile, non dismissibile da mobile.
**Fix applied:** Rimosso, sostituito con toast notification in-app.

### 7. Nessun Error Boundary in React
**Risk:** Un crash in qualsiasi componente (PriceHistoryChart, WineCard, Modal) rompe l'intera app — schermo bianco.
**Fix applied:** Aggiunto `<ErrorBoundary>` che wrappa ogni sezione principale.

### 8. Nessun retry su fetch falliti
**Risk:** Backend su Render va in sleep dopo 15min di inattività (piano free) → prime richieste falliscono con timeout.
**Fix applied:** Wrapper `fetchWithRetry` (3 tentativi, backoff 1s/2s/4s) su tutti i fetch critici.

### 9. pool.js crash senza DATABASE_URL
**File:** `backend/src/db/pool.js`
**Risk:** `new Pool({ connectionString: undefined })` — pg non crasha subito ma ogni query fallisce con errore oscuro.
**Fix applied:** Guard per DATABASE_URL mancante, export `null` se non configurato.

### 10. DB indexes mancanti
**Risk:** Con migliaia di vini e ordini, `SELECT * FROM orders ORDER BY created_at DESC` senza index → full table scan → query lente.
**Fix applied:** Indexes su `orders(created_at)`, `price_history(wine_id, recorded_at)`, `ai_scores(expires_at)`.

---

## 🟡 MEDIUM

### 11. Gestione offline assente
**Risk:** Utente perde connessione → app silenziosa, nessun feedback.
**Fix applied:** Banner offline con `window.addEventListener("offline/online")`.

### 12. Skeleton loading mancante
**Risk:** Sezione Market e Dashboard mostrano schermo vuoto durante il caricamento → utenti abbandonano.
**Fix applied:** Skeleton cards animate durante il caricamento iniziale.

### 13. fetchAIScore per vini non visibili
**File:** `frontend/src/App.jsx:210-213`
**Risk:** Vengono fetchati AI score anche per vini fuori viewport.
**Fix applied:** Intersection Observer su wine cards per fetch lazy degli AI score.

### 14. Hugging Face sentiment — non implementato
**Risk:** Manca endpoint `/api/ai/market-sentiment`.
**Fix applied:** Aggiunto endpoint con HuggingFace Inference API + fallback algoritmico.

### 15. NewsAPI key — placeholder
**File:** `backend/.env`
**Risk:** `NEWS_API_KEY` non configurata → solo fallback news.
**Status:** ⚠️ MANUAL — l'utente deve registrarsi su newsapi.org e aggiungere la key a Render env vars.

### 16. ANTHROPIC_API_KEY — placeholder
**File:** `backend/.env`
**Risk:** AI Score usa solo fallback algoritmico senza key reale.
**Status:** ⚠️ MANUAL — impostare `ANTHROPIC_API_KEY` su Render dashboard.

---

## 🟢 LOW (già risolti in sessioni precedenti)

- ✅ Gzip compression (compression package)
- ✅ Code splitting vite (manualChunks function)
- ✅ Exchange rates con cache 6h
- ✅ Supabase JWT auth middleware
- ✅ Three.js rimosso → SVG bottle
- ✅ Stripe webhook handler
- ✅ Price alerts + notifications (cron hourly)
- ✅ B2B dashboard analytics
- ✅ Playfair Display + Inter in index.html
- ✅ Glassmorphism header in style.css
- ✅ Bottle3D backface-visibility fix

---

## Summary

| Severity | Found | Fixed | Manual |
|----------|-------|-------|--------|
| Critical | 5     | 5     | 0      |
| High     | 5     | 5     | 0      |
| Medium   | 6     | 4     | 2      |
| Low      | 10    | 10    | 0      |
| **Total**| **26**| **24**| **2**  |
