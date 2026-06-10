# VinoInvest — HANDOFF per nuova sessione

> Ultimo aggiornamento: 2026-06-10
> Scopo: riprendere il lavoro senza rileggere 40 file di contesto.

---

## STATO PIATTAFORMA

| Voce | Dettaglio |
|------|-----------|
| **Frontend** | https://vinoinvest-platform.vercel.app |
| **Backend** | https://vinoinvest-backend-2.onrender.com |
| **API Docs** | https://vinoinvest-backend-2.onrender.com/api/docs |
| **Repository** | https://github.com/manumila88-pixel/vinoinvest-platform |
| **Branch** | `main` — deploy automatico su Vercel al push |
| **Stack** | React 18 + Vite (Vercel) · Node.js/Express (Render) · PostgreSQL (Render) · Supabase Auth |
| **Admin** | manumila88@gmail.com — bypassa tutti i paywall in produzione |
| **DB** | 50.016 vini nel catalogo (wines.json + externalWines.json + bigWines.json) |
| **Cold start** | Backend Render: 30s primo accesso — normale, il frontend mostra "Server starting..." |

---

## COSA FUNZIONA AL 100%

### Core Platform
- Catalogo 50k+ vini con search server-side, filtri tipo/annata, infinite scroll
- Price history chart (ComposedChart, fixed width — NO ResponsiveContainer, NO Three.js)
- AI Score (algoritmo + Claude API quando ANTHROPIC_API_KEY è presente)
- Multi-currency 10 valute live (ECB Exchange Rates)
- Dark/light theme toggle (persiste su localStorage)
- i18n 40+ lingue con auto-detect browser, RTL per ar/he
- PWA install prompt + Service Worker offline cache
- GDPR cookie banner
- Cmd+K command palette (18 shortcut + live wine search)
- SkeletonCard loading states + ErrorBoundary su tutte le sezioni critiche

### B2B Professional Platform
- Multi-tenant organizations (POST /api/organizations)
- Client portfolio management con CRM interactions
- Suitability assessments con firma digitale
- API key generation per organizzazione
- Audit log con export CSV
- Risk metrics: Sharpe, VaR 95%, Max Drawdown, Beta, HHI
- Benchmark vs S&P500, Gold, EU Inflation
- Demo request con email notification (POST /api/demo)
- 4-step B2B onboarding flow (/b2b-onboarding)
- Market Intelligence (/market-intelligence)
- OrgDashboard (/org-dashboard) · ClientDetail (/clients/:id)
- Prezzi B2B: Starter free / €200 / €500

### Backend API (92/93 test passano)
- Tutti i route principali attivi con try/catch, auth JWT, rate limiting
- CORS corretto (blocca origini non autorizzate senza 500)
- Security headers Helmet.js
- Swagger docs /api/docs
- Public API v1 /api/v1/wines
- 8 cron jobs registrati (blog, images, newsletter, price updater, alerts, cellar)
- 15+ DB indices su tutte le colonne critiche
- Cache TTL configurati (da 30min news a 7d vintage)

### SEO & Marketing
- 238 pagine vino statiche (/vini/*.html)
- Sitemap index (3 sitemap), robots.txt, security.txt, llms.txt
- hreflang × 40 lingue

### Academy
- 30 corsi: 1-11 free, 12-20 premium (20 moduli ciascuno), 21-30 B2B
- Video search queries per tutti i moduli (YouTube embed)
- SourceBadge su ogni WineCard (fonte Liv-ex est., confidence score)

### Frontend Health (audit 2026-06-09)
- Build: 0 errori, 748 moduli
- Tutte le 48 route lazy-loaded verificate
- Zero console.log in produzione (guard DEV)
- i18n: zero stringhe italiane hardcoded nei componenti
- Mobile: zero horizontal overflow, tabelle in overflow-x: auto

---

## BUG APERTI (non bloccanti, documentati in QA_BROKEN_LIST.md)

| Bug | Gravità | File | Fix stimato |
|-----|---------|------|-------------|
| Portfolio "By Type" mostra sempre "Other" | Minore | dati vini senza campo `type` | 2h |
| Watchlist non persiste dopo refresh | Minore | App.jsx — solo useState | 1h (salvare su Supabase) |
| Route `/landing` definita due volte (dead code) | Minore | App.jsx righe ~1972/2020 | 5min |
| AgentChat `<polyline>` attributo `points` duplicato | Cosmetic | AgentChat.jsx riga 33/35 | 2min |

---

## COSA MANCA — SOLO MANOEL PUÒ FARLO

### Azioni urgenti (revenue-critical)
1. **Stripe live mode** — vai su dashboard.stripe.com → Developers → Webhooks
   - Crea webhook URL: `https://vinoinvest-backend-2.onrender.com/api/payments/stripe/webhook`
   - Copia `whsec_...` → imposta `STRIPE_WEBHOOK_SECRET` su Render Environment
   - Cambia `STRIPE_SECRET_KEY` da `sk_test_` a `sk_live_`
   - Cambia `VITE_STRIPE_PUBLISHABLE_KEY` su Vercel da `pk_test_` a `pk_live_`

2. **Dominio vinoinvest.com** — namecheap.com (~€12/anno)
   - Dopo acquisto: Vercel Dashboard → Settings → Domains → Add
   - DNS: aggiunge record A/CNAME forniti da Vercel

3. **ANTHROPIC_API_KEY su Render** — console.anthropic.com (5 min, sblocca AI reale per tutti)

4. **Google Search Console** — search.google.com/search-console
   - Aggiungi proprietà `vinoinvest-platform.vercel.app`
   - Invia sitemap: `https://vinoinvest-platform.vercel.app/sitemap-index.xml`

5. **UptimeRobot** — uptimerobot.com (gratuito)
   - Monitor HTTP: `https://vinoinvest-backend-2.onrender.com/api/health` ogni 5 min
   - Ti sveglia il backend e ti notifica se va down

6. **Cron-job.org ping** — cron-job.org (gratuito)
   - URL: `https://vinoinvest-backend-2.onrender.com/api/health`
   - Intervallo: ogni 10 minuti (evita cold start di 30s per gli utenti)

7. **LinkedIn company page VinoInvest** — linkedin.com/company/create
   - Usa logo da /public/logo.png, descrizione dalla /about page

8. **Prima cantina da contattare** (vedi template sotto)

### Template email cantina
```
Oggetto: Partnership VinoInvest — Visibilità sui 50.000+ investitori

Gentile [Nome],

VinoInvest è la piattaforma italiana di riferimento per investitori nel vino fine.
I nostri utenti cercano attivamente vini da [Regione] con potenziale di apprezzamento.

Proposta: inserimento gratuito dei vostri vini in evidenza per 3 mesi,
in cambio di un testimonial e link al vostro shop.

Disponibile per una chiamata di 15 minuti?

Manoel Milanesi — fondatore VinoInvest
vinoinvest-platform.vercel.app
```
Cantiners target: Antinori, Gaja, Sassicaia, Ornellaia, Quintarelli.

---

## ENV VARS SU RENDER — STATO ATTUALE

### Backend (Render Environment)

| Variabile | Stato | Note |
|-----------|-------|------|
| `DATABASE_URL` | ✅ configurata | PostgreSQL Render |
| `SUPABASE_URL` | ✅ configurata | https://xghuyfgftvrhnmuezbbz.supabase.co |
| `SUPABASE_ANON_KEY` | ✅ configurata | |
| `STRIPE_SECRET_KEY` | ✅ configurata (test) | Cambiare a `sk_live_` per produzione |
| `PAYPAL_CLIENT_ID` | ✅ configurata | |
| `PAYPAL_CLIENT_SECRET` | ✅ configurata | |
| `PORT` | ✅ configurata | 3001 |
| `NODE_ENV` | ✅ configurata | production |
| `FRONTEND_URL` | ✅ configurata | https://vinoinvest-platform.vercel.app |
| `STRIPE_WEBHOOK_SECRET` | ❌ mancante | `whsec_...` da Stripe Dashboard — senza questo gli abbonamenti non si attivano |
| `ANTHROPIC_API_KEY` | ❌ mancante | `sk-ant-...` da console.anthropic.com — senza questo AI Agent usa fallback algoritmico |
| `NEWS_API_KEY` | ❌ mancante | newsapi.org free tier — senza questo news sono mock |
| `SENDGRID_API_KEY` | ❌ mancante | per email price alerts |
| `VAPID_PUBLIC_KEY` | ❌ mancante | `npx web-push generate-vapid-keys` — per push notifications |
| `VAPID_PRIVATE_KEY` | ❌ mancante | generare insieme a PUBLIC_KEY |
| `ADMIN_SECRET` | ❌ mancante | stringa random sicura per endpoint admin |
| `LIVEX_API_KEY` | ❌ mancante | Liv-ex API (paid, opzionale) |
| `HUGGINGFACE_API_KEY` | ❌ mancante | FinBERT sentiment (opzionale, free tier funziona senza) |
| `NOWPAYMENTS_API_KEY` | ❌ mancante | crypto payments (opzionale) |

### Frontend (Vercel Environment Variables)

| Variabile | Stato | Note |
|-----------|-------|------|
| `VITE_SUPABASE_URL` | ✅ configurata | |
| `VITE_SUPABASE_ANON_KEY` | ✅ configurata | |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ✅ configurata (test) | Cambiare a `pk_live_` |
| `VITE_PAYPAL_CLIENT_ID` | ✅ configurata | |
| `VITE_BACKEND_URL` | ✅ configurata | https://vinoinvest-backend-2.onrender.com |

---

## PROSSIMI TASK TECNICI PRIORITIZZATI

### Priorità 1 — Revenue (< 1h ciascuno)
1. **Stripe live** — Manoel imposta env vars su Render (già scritto, solo config) → abbonamenti funzionano in prod
2. **ANTHROPIC_API_KEY** su Render — 5 minuti, AI Agent risponde con Claude reale
3. **NEWS_API_KEY** su Render — newsapi.org free, 10 minuti → news reali invece di mock
4. **Cron-job.org keep-alive** — evita cold start 30s per gli utenti

### Priorità 2 — UX (stima 2-8h)
5. **Email price alerts** — `alertsChecker.js` già rileva breach, manca solo `SENDGRID_API_KEY` + template email (4h)
6. **Login UX migliorata** — password reset + social login Google/Apple (8h)
7. **Watchlist persistente** — salvare su Supabase invece di useState (1h)
8. **200 pagine B2B** — `node backend/src/scripts/generateB2BPages.js` (usa ANTHROPIC_API_KEY, generazione batch)

### Priorità 3 — Ops (stima 2-4h)
9. **GitHub Actions CI** — aggiungere `.github/workflows/test.yml` che esegue `test-all.sh` ad ogni push (2h)
10. **Sentry error monitoring** — `@sentry/node` + `@sentry/react`, 1h di setup (2h)
11. **Plausible/PostHog analytics** — script in index.html, 1h
12. **VAPID keys** — `npx web-push generate-vapid-keys` → Render env → push notifications browser attive

### Priorità 4 — Growth
13. **Blog 100 articoli** — `node backend/src/scripts/generateBlogContent.js` (richiede ANTHROPIC_API_KEY)
14. **Portfolio sharing/export PDF** — react-to-pdf o Puppeteer server-side (6h)
15. **Icon-only buttons aria-label** — ~20 bottoni close/toggle senza label screen reader

---

## ARCHITETTURA FILE PRINCIPALI

```
vinoinvest-platform-ready/
├── CLAUDE.md                        ← regole agente (letto automaticamente)
├── HANDOFF.md                       ← questo file
├── LAUNCH_READY.md                  ← checklist completa funzionalità
├── FRONTEND_HEALTH.md               ← audit build + i18n + accessibilità
├── BACKEND_HEALTH.md                ← test 92/93, security, performance
├── QA_BROKEN_LIST.md                ← bug aperti non bloccanti
├── BUGFIX_LOG.md                    ← root cause + fix applicati
├── MISSING_FEATURES.md              ← backlog tecnico dettagliato
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  ← main app 1000+ righe (market, portfolio, news, dashboard)
│   │   ├── WineBottle3DModal.jsx    ← modal dettaglio vino (Wiki, chart, food pairing)
│   │   ├── LandingPage.jsx          ← landing page pubblica
│   │   ├── lib/
│   │   │   └── supabase.js          ← client Supabase auth
│   │   ├── components/
│   │   │   ├── WineCard.jsx         ← card vino (AI score, alert, watchlist, affiliate)
│   │   │   ├── PriceHistoryChart.jsx ← chart prezzi (ComposedChart, NO ResponsiveContainer)
│   │   │   ├── WinePriceCompare.jsx ← compare prezzi merchant
│   │   │   ├── AgentChat.jsx        ← AI chat interface
│   │   │   ├── PaymentModal.jsx     ← Stripe + PayPal
│   │   │   ├── PurchaseModal.jsx    ← dove comprare
│   │   │   ├── SourceBadge.jsx      ← badge fonte prezzo + confidence
│   │   │   ├── SkeletonCard.jsx     ← loading skeleton
│   │   │   ├── CurrencySelector.jsx ← switcher 10 valute
│   │   │   └── [altri 15+ componenti]
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        ← dashboard utente
│   │   │   ├── AdminDashboard.jsx   ← admin panel
│   │   │   ├── B2B.jsx              ← landing B2B
│   │   │   ├── OrgDashboard.jsx     ← org dashboard multi-tenant
│   │   │   ├── ClientDetail.jsx     ← dettaglio cliente B2B
│   │   │   ├── MarketIntelligence.jsx ← en primeur, auctions, movers
│   │   │   └── [40+ altre pagine]
│   │   └── i18n/
│   │       └── en.json              ← tutte le chiavi i18n (lingua base)
│   ├── .env.example                 ← variabili frontend
│   └── vercel.json                  ← security headers A+
│
└── backend/
    ├── src/
    │   ├── index.js                 ← entry point Express
    │   ├── routes/
    │   │   ├── wines.js             ← catalogo, search, filtri
    │   │   ├── prices.js            ← storico prezzi
    │   │   ├── orders.js            ← ordini (JWT required)
    │   │   ├── payments.js          ← Stripe + PayPal
    │   │   ├── ai.js                ← AI score, sentiment, portfolio analysis
    │   │   ├── agent.js             ← AI agent chat (6 tools)
    │   │   ├── organizations.js     ← B2B multi-tenant (JWT required)
    │   │   ├── riskMetrics.js       ← Sharpe, VaR, benchmark
    │   │   ├── blog.js              ← articoli AI-generated
    │   │   └── [20+ altre route]
    │   ├── services/
    │   │   ├── priceService.js      ← getPriceHistory, generateAndSeedHistory
    │   │   ├── aiScoreService.js    ← score cappato 95/97/99 (fix bug #2)
    │   │   └── riskMetricsService.js ← calcoli finanziari
    │   ├── middleware/
    │   │   └── auth.js              ← requireAuth (Supabase JWT), requireAdmin
    │   ├── jobs/
    │   │   ├── priceUpdater.js      ← cron aggiornamento prezzi
    │   │   ├── alertsChecker.js     ← controlla price alert utenti
    │   │   └── cellarTrackerCron.js ← sync CellarTracker
    │   └── scripts/
    │       ├── generateBlogContent.js  ← 100 articoli blog (richiede ANTHROPIC_API_KEY)
    │       └── generateB2BPages.js    ← 200 pagine B2B SEO (richiede ANTHROPIC_API_KEY)
    └── .env.example                 ← variabili backend
```

---

## REGOLE CLAUDE.MD (non dimenticare)

1. **MAI Three.js** — rimosso definitivamente, usa SVG/CSS
2. **Chart**: `ComposedChart` diretto, width fisso in pixel, **NO `ResponsiveContainer`**
3. **Ogni commit** in inglese: `feat/fix/chore(scope): description`
4. **Test prima del commit** — curl per backend, build check per frontend
5. **Non usare mock** — solo codice funzionante con dati reali
6. **Non rompere** funzionalità esistenti

---

## COMANDI UTILI

```bash
# Sessione di lavoro
cd ~/Downloads/vinoinvest-platform-ready
claude --dangerously-skip-permissions

# Build frontend
cd frontend && npm run build

# Deploy manuale (normalmente automatico via git push)
cd frontend && vercel --prod

# Test backend
curl https://vinoinvest-backend-2.onrender.com/api/health
./test-all.sh

# Smoke test rapido
curl https://vinoinvest-backend-2.onrender.com/api/wines?limit=3
curl https://vinoinvest-backend-2.onrender.com/api/risk/benchmark

# Commit e push standard
git add <files>
git commit -m "fix(scope): descrizione"
git push origin main

# Generare VAPID keys (push notifications)
cd backend && npx web-push generate-vapid-keys

# Generare blog (richiede ANTHROPIC_API_KEY)
node backend/src/scripts/generateBlogContent.js

# Generare pagine B2B SEO (richiede ANTHROPIC_API_KEY)
node backend/src/scripts/generateB2BPages.js
```

---

## QUICK SMOKE TEST (copia-incolla)

```bash
echo "=== Health ===" && curl -s https://vinoinvest-backend-2.onrender.com/api/health
echo "=== Wines ===" && curl -s "https://vinoinvest-backend-2.onrender.com/api/wines?limit=2" | head -c 200
echo "=== AI Score ===" && curl -s "https://vinoinvest-backend-2.onrender.com/api/ai-score/1"
echo "=== Benchmark ===" && curl -s https://vinoinvest-backend-2.onrender.com/api/risk/benchmark | head -c 100
```

---

## ULTIMO FIX APPLICATO (2026-06-10)

**fix(market): card vini si sovrapponevano in verticale**
- Causa: `VirtualWineGrid` usava `react-window` con `ROW_HEIGHT=464` fisso, ma le card sono ~500px+
- Fix: rimosso `VirtualWineGrid`, sostituito con `<section className="marketGrid">` (CSS grid normale)
- La `.marketGrid` ha già `display:grid; grid-template-columns: repeat(auto-fill, minmax(278px, 1fr)); gap: 18px`
- Commit: `528f07e` — pushato su main ✅
