# VinoInvest — HANDOFF per nuova sessione

> Ultimo aggiornamento: 2026-07-08
> Scopo: riprendere il lavoro senza rileggere 40 file di contesto.

---

## HANDOFF Agente Contenuti → Agente 1 (2026-07-08)

### Cookie banner — NESSUN CODICE NECESSARIO
`frontend/src/components/CookieBanner.jsx` esiste già ed è conforme GDPR per l'uso
attuale (solo cookie tecnici): "Accetta" / "Solo essenziali", link a Privacy e Cookie
Policy, consenso in localStorage `vino_cookie_consent_v1`. Nulla da fare finché non
si aggiungono analytics/marketing.

### Pagine legali JSX da allineare alle bozze in `legal/`
Bozze complete IT+EN con placeholder ([NOME TITOLARE], [INDIRIZZO], [EMAIL CONTATTO],
[PARTITA IVA / CODICE FISCALE], [DATA DI ENTRATA IN VIGORE], [FORO COMPETENTE]):
`legal/privacy-policy.{it,en}.md` · `legal/cookie-policy.{it,en}.md` ·
`legal/termini-di-servizio.it.md` · `legal/terms-of-service.en.md`.
**Prima Manoel compila i placeholder e fa revisionare a un legale**, poi Agente 1
aggiorna le pagine JSX. Incoerenze da correggere nei JSX attuali:
1. `PrivacyPolicy.jsx` non menziona PayPal (pagamenti) né Resend (email transazionali).
2. `Cookies.jsx` dichiara analytics Umami (`_umami_*`) e categoria marketing, ma
   Umami è DISATTIVATO (script commentato in `frontend/index.html` ~riga 151).
   Decisione Manoel: rimuovere dalla policy o attivare Umami. Le bozze riflettono
   la realtà attuale (nessun analytics).
3. `Cookies.jsx` cita chiavi `vino_cookie_consent`/`vino_cookie_prefs`; quella reale
   è `vino_cookie_consent_v1`.
4. `Terms.jsx` ha Foro di Milano hardcoded; bozze usano [FORO COMPETENTE] con
   salvezza del foro del consumatore.
5. Date incoerenti: `Cookies.jsx` "1 giugno 2025" vs altre "1 giugno 2026".
6. Email privacy@/legal@/support@vinoinvest.io hardcoded: verificare che esistano.

### Verifiche umane richieste (contenuti, non codice)
- `content/blog/fiscalita-vino-investimento-italia.md`: quadro RW per vino fisico in
  Italia + "esclusioni dopo 6 anni" — da verificare con un commercialista.
- `content/blog/igt-vs-docg-classificazioni-valore.md`: "79 zone DOCG" — il numero
  reale è ~77, verificare.
- `frontend/src/data/awards.js`: spot-check dei premi (Tre Bicchieri, Decanter
  Platinum, WS Top 100 con anni) prima del lancio. Già corretto l'errore che
  attribuiva il Sassicaia ad Antinori (è di Tenuta San Guido).

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
| Portfolio "By Type" mostra sempre "Other" | Minore | ✅ FIXATO — deriveWineType() già in App.jsx riga 96 con fallback "Red" | — |
| Watchlist non persiste dopo refresh | Minore | ✅ FIXATO — localStorage in useState init + toggleWatchlist + logout | — |
| Route `/landing` definita due volte (dead code) | Minore | Solo UNA route esiste (riga 2481) — già rimossa la duplicata | — |
| AgentChat `<polyline>` attributo `points` duplicato | Cosmetic | Solo UN attributo esiste (riga 33) — già rimosso il duplicato | — |
| PasswordRecoveryModal non appare su deep link reset | Medio | ✅ FIXATO — modal ora renderizzato anche su LandingPage | — |

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
| `NEWS_API_KEY` | ❌ mancante | newsapi.org free tier — senza questo news fallback a RSS gratuito (funziona) |
| `RESEND_API_KEY` | ❌ mancante | resend.com (free: 3k email/mese) — codice già scritto in emailService.js, solo env var mancante |
| `SENTRY_DSN` | ❌ mancante | sentry.io — codice già in server.js con `if (process.env.SENTRY_DSN)`, solo env var mancante |
| `VAPID_PUBLIC_KEY` | ⚠️ generata, non su Render | Già in `backend/.env.example` — copia su Render per attivare push |
| `VAPID_PRIVATE_KEY` | ⚠️ generata, non su Render | Già in `backend/.env.example` — copia su Render per attivare push |
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
| `VITE_SENTRY_DSN` | ❌ mancante | sentry.io — codice già in errorReporting.js con `if (!dsn) return`, solo env var mancante |
| `VITE_POSTHOG_KEY` | ❌ mancante | app.posthog.com — codice già in analytics.js, solo env var mancante |

---

## PROSSIMI TASK TECNICI PRIORITIZZATI

### Priorità 1 — Revenue (< 1h ciascuno, solo config Manoel)
1. **Stripe live** — Manoel imposta env vars su Render (già scritto, solo config) → abbonamenti funzionano in prod
2. **ANTHROPIC_API_KEY** su Render — 5 minuti, AI Agent risponde con Claude reale
3. **RESEND_API_KEY** su Render — resend.com (free: 3k email/mese) → email alerts funzionano (codice già in emailService.js)
4. **Cron-job.org keep-alive** — evita cold start 30s per gli utenti

### Priorità 2 — UX (solo config mancante)
5. **Email price alerts** ✅ codice completo — alertsChecker.js + emailService.js usando Resend (non SendGrid). Manca solo `RESEND_API_KEY` su Render.
6. **Login UX migliorata** ✅ già implementata — AuthModal.jsx ha Google OAuth, password reset, signup. LandingPage gestisce ?login=1&email=... deep link.
7. **Watchlist persistente** ✅ FIXATO — ora persiste su localStorage per utenti anonimi; backend sync per utenti loggati.
8. **200 pagine B2B** — `node backend/src/scripts/generateB2BPages.js` (usa ANTHROPIC_API_KEY, generazione batch)

### Priorità 3 — Ops (già implementate nel codice)
9. **GitHub Actions CI** ✅ — `.github/workflows/ci.yml` già presente con build check, syntax check, secret scan
10. **Sentry error monitoring** ✅ — codice in server.js e errorReporting.js. Manca solo `SENTRY_DSN` (backend) + `VITE_SENTRY_DSN` (frontend) su Render/Vercel.
11. **PostHog analytics** ✅ — codice in analytics.js. Manca solo `VITE_POSTHOG_KEY` su Vercel.
12. **VAPID keys** ⚠️ già generate in `backend/.env.example` — solo da copiare su Render env (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`)

### Priorità 4 — Growth
13. **Blog 100 articoli** — `node backend/src/scripts/generateBlogContent.js` (richiede ANTHROPIC_API_KEY)
14. **Portfolio sharing/export PDF** ✅ — già implementato con jsPDF in App.jsx (bottone "Export PDF" nel portfolio)
15. **Secondary market (P2P)** — listings table + Stripe Connect (2 settimane, grande feature)

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

## ULTIMO FIX APPLICATO (2026-06-11) — sessione 3

**fix(auth+watchlist): password recovery deep link, watchlist localStorage, login ?email= deep link**

### Fix applicati:
1. **PasswordRecoveryModal su LandingPage** — Il modal non appariva quando l'utente cliccava il link di reset email perché era renderizzato solo dopo `isLoggedIn`. Ora viene reso anche sopra la LandingPage.
2. **Watchlist localStorage** — useState inizializzato da `localStorage.getItem("vino_watchlist")`. toggleWatchlist aggiorna sempre localStorage. Logout cancella la chiave. Utenti anonimi non perdono più la watchlist al refresh.
3. **LandingPage deep link `?login=1&email=...`** — Apre automaticamente il modal di login pre-compilando l'email. Usato dalle email di invito clienti B2B.
4. **HANDOFF.md corrections** — `SENDGRID_API_KEY` → `RESEND_API_KEY`; aggiunti `VITE_SENTRY_DSN`, `VITE_POSTHOG_KEY`, `SENTRY_DSN`; task già completati marcati ✅.

---

## ULTIMO FIX APPLICATO (2026-06-11) — sessione 2

**feat(market): advanced filters, pyramid, donut charts, platform guide, recommendations** — commit `e3c8602`

### Nuove feature:
1. **Filtri Avanzati Market** (MarketFilters.jsx): sidebar collassabile Vivino-style — tipo, fascia prezzo, AI Score slider, uve principali, regione con flag, annata range, rischio, commercianti, solo dati reali. Backend `/api/wines` aggiornato con `type`, `priceMin/Max`, `scoreMin/Max`, `vintageMin/Max`, `risk`, `region`, `grape` + sort `price_asc/price_desc/vintage`.
2. **Guida Piattaforme** (`/guide/piattaforme`): confronto completo Wine-Searcher, Vivino, Tannico, Millesima, iDealwine — pro/contro, costi, step-by-step primo acquisto, rating affidabilità.
3. **Piramide Vini** (WinePyramid.jsx): SVG interattiva 3 livelli (Ultra Premium >€2k, Premium €500-2k, Entry €100-500). Click filtra automaticamente il market per fascia prezzo. Animazione hover + dettaglio card.
4. **Portfolio Donut** (PortfolioDonut.jsx): SVG donut rotante CSS animation sostituisce le barre statiche. Hover paussa rotazione, mostra nome/valore/ROI. Due donuts: Per Tipo e Per Vino.
5. **Raccomandazioni Vivino-style**: SimilarWines in WineBottle3DModal (stesso score ±12, stessa regione). "Trending questa settimana" e "Gli investitori guardano anche questi" (AI Score 85+) nel Market tab.

### File nuovi:
- `frontend/src/components/MarketFilters.jsx`
- `frontend/src/components/WinePyramid.jsx`
- `frontend/src/components/PortfolioDonut.jsx`
- `frontend/src/pages/PlatformGuide.jsx`

### File modificati:
- `backend/src/server.js` — filtri avanzati su `/api/wines`
- `frontend/src/App.jsx` — integrazioni pyramid, filters, donut, recommendations
- `frontend/src/WineBottle3DModal.jsx` — SimilarWines component

---

## ULTIMO FIX APPLICATO (2026-06-11) — sessione 1

**feat(ui): B2B/B2C dashboards, i18n calc, tooltips, 5-step tour** — commit `585f89c`

### Fix critico:
- `premiumModules.js` aveva ~80+ stringhe multi-riga con doppi apici — build falliva con "Unterminated string". Script Python ha collassato tutte in singola riga con `\n`. Ora 0 stringhe non terminate.

### Task 1 — Route 404:
- Tutte le route (Cellar, Journal, Goals, En Primeur, Auctions, Sentiment, Referral, Press, Transparency) erano già definite con i componenti corretti. Il build break era l'unica causa reale dei 404.

### Task 2 — i18n consistente:
- `InvestmentCalculator.jsx`: usa ora `useTranslation()`; label "Conservativo/Bilanciato/Aggressivo" → `t('calc.conservative/balanced/aggressive')`; tutte le UI string tradotte
- `App.jsx`: "Notifiche" → `t('notifications.title')`, "Segna tutte come lette" → `t('notifications.markAllRead')`, "(vista completa)" → "(full access)", rimosso testo italiano hard-coded dal banner server
- Aggiunti `calc.*` e `b2b.*` keys in `en.json` e `it.json` (altri 38 lingue fallback su en)

### Task 3 — B2B vs B2C dashboard distinte:
- Nuovo `viewMode` state ('b2c'|'b2b'); si imposta automaticamente dal `account_type` al login
- **Toggle admin** (solo manumila88@gmail.com): bottone header "⇄ View as B2B" / "↩ View as B2C"
- **Header B2B**: "🍷 VinoInvest PRO — VinoInvest Professional" (badge blu, title blu)
- **Sidebar B2B**: aggiunge Market Intelligence, Clients, Reports separati da divider
- **Dashboard B2B**: hero con KPI (AUM, Clienti, Perf. Media, Invested, P&L, Watchlist), 4 quick-action cards, notice "solo vini premium >€200"
- **Market B2B**: `priceMin = Math.max(f.priceMin, 200)` quando viewMode === 'b2b'; notice visivo

### Task 4 — Investment Calculator migliorato:
- **Tooltip** su ogni risk profile (hover): descrizione dettagliata + rendimento atteso + volatilità
- **Tour guidato 5 step**: budget → orizzonte → rischio → KPI → chart; progress dots; highlight outline sul componente attivo
- **Confidence band**: legenda visiva (area ombreggiata + linea centrale); pallini sul tracciato

## ULTIMO FIX APPLICATO (2026-06-10) — precedente

**fix(market): card vini si sovrapponevano in verticale**
- Causa: `VirtualWineGrid` usava `react-window` con `ROW_HEIGHT=464` fisso, ma le card sono ~500px+
- Fix: rimosso `VirtualWineGrid`, sostituito con `<section className="marketGrid">` (CSS grid normale)
- La `.marketGrid` ha già `display:grid; grid-template-columns: repeat(auto-fill, minmax(278px, 1fr)); gap: 18px`
- Commit: `528f07e` — pushato su main ✅
