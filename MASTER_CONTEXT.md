# VinoInvest — MASTER CONTEXT

> File di riferimento per nuove chat. Aggiornato: 2026-06-08.
> Leggilo prima di qualsiasi intervento sul progetto.

---

## Stack

| Layer    | Tech                  | URL / ID                                      |
|----------|-----------------------|-----------------------------------------------|
| Frontend | React 18 + Vite       | vinoinvest-platform.vercel.app                |
| Backend  | Node.js + Express     | vinoinvest-backend-2.onrender.com             |
| Database | PostgreSQL            | Render — vinoinvest_db                        |
| Auth     | Supabase              | xghuyfgftvrhnmuezbbz.supabase.co              |
| Repo     | GitHub                | github.com/manumila88-pixel/vinoinvest-platform |

---

## Regole INVIOLABILI

1. **MAI Three.js** — rimosso definitivamente. Usa SVG/CSS puri.
2. **Chart**: usa `ComposedChart` diretto con `width` fisso in pixel. **NO `ResponsiveContainer`**.
3. **Commit in inglese**: `feat/fix/chore(scope): description`.
4. **No mock** — solo codice funzionante con dati reali.
5. **Non rompere** funzionalità esistenti. Test prima di ogni commit.
6. **Database credentials** sono nel backend `.env` — non commitare mai secret.

---

## Architettura file

```
vinoinvest-platform-ready/
├── frontend/src/
│   ├── App.jsx                        ← main shell (1000+ righe, state centrale)
│   ├── LandingPage.jsx                ← landing non autenticata
│   ├── WineBottle3DModal.jsx          ← modal dettaglio vino
│   ├── lib/
│   │   ├── supabase.js                ← client Supabase
│   │   ├── authFetch.js               ← fetch autenticato
│   │   └── fetchWithRetry.js
│   ├── components/
│   │   ├── PriceHistoryChart.jsx      ← ComposedChart, NO ResponsiveContainer
│   │   ├── Bottle3D.jsx               ← SVG statica (non Three.js)
│   │   ├── AgentChat.jsx              ← chat AI floating
│   │   ├── VirtualWineGrid.jsx        ← virtual scroll wine grid
│   │   ├── WineCard.jsx               ← card singola vino
│   │   ├── PaymentModal.jsx           ← Stripe + PayPal
│   │   ├── PurchaseModal.jsx
│   │   ├── OnboardingModal.jsx
│   │   ├── HelpBot.jsx                ← FAQ bot
│   │   ├── GuidedTour.jsx
│   │   ├── SocialProof.jsx
│   │   ├── VoiceInterface.jsx
│   │   ├── InvestmentCalculator.jsx
│   │   ├── VintageScore.jsx
│   │   ├── CurrencySelector.jsx
│   │   ├── LangSelector.jsx
│   │   ├── SourceBadge.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── Toast.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── CookieBanner.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── WinePriceCompare.jsx
│   └── pages/
│       ├── Pricing.jsx                ← piani Free/Pro/Elite
│       ├── Dashboard.jsx
│       ├── WineCellar.jsx             ← cantina personale
│       ├── WineJournal.jsx            ← diario degustazioni
│       ├── LabelScanner.jsx           ← scan etichetta via camera
│       ├── InvestmentGoals.jsx        ← obiettivi investimento
│       ├── MarketIndex.jsx            ← indice mercato vino
│       ├── MarketSentiment.jsx
│       ├── Learn.jsx                  ← academy/formazione
│       ├── B2B.jsx                    ← landing B2B
│       ├── EnPrimeur.jsx
│       ├── AuctionTracker.jsx
│       ├── ReferralPage.jsx
│       ├── SharePortfolio.jsx
│       ├── Transparency.jsx
│       ├── PressKit.jsx
│       └── NotificationSettings.jsx
├── backend/src/
│   ├── server.js                      ← entry point Express
│   ├── db/
│   │   ├── init.js                    ← CREATE TABLE migrations
│   │   └── pool.js                    ← pg Pool singleton
│   ├── middleware/
│   │   ├── auth.js                    ← requireAuth (Supabase JWT)
│   │   └── tokenTracker.js            ← monitoring token AI
│   ├── routes/                        ← 30+ router files (vedi sotto)
│   ├── services/
│   │   ├── priceService.js            ← getPriceHistory, generateAndSeedHistory
│   │   ├── aiScoreService.js          ← AI scoring Claude API
│   │   ├── emailService.js
│   │   ├── gamificationService.js
│   │   ├── currencyService.js
│   │   ├── freeDataService.js
│   │   ├── priceAggregator.js
│   │   ├── rssNewsService.js
│   │   ├── vinoInvestIndex.js
│   │   ├── vintageClimateService.js
│   │   ├── personalizationEngine.js
│   │   └── translationService.js
│   ├── agents/
│   │   ├── portfolioAgent.js
│   │   ├── blogAgent.js
│   │   └── imageAgent.js
│   ├── jobs/
│   │   ├── priceUpdater.js            ← cron aggiornamento prezzi
│   │   ├── alertsChecker.js           ← cron price alerts
│   │   └── portfolioAnalysisJob.js
│   └── bots/telegramBot.js
├── chrome-extension/                  ← estensione Chrome
└── .claude/hooks/                     ← safety hooks Claude Code
```

---

## Routes frontend (React Router)

| Path                   | Component           |
|------------------------|---------------------|
| `/`                    | App (main shell)    |
| `/pricing`             | Pricing             |
| `/b2b`                 | B2BPage             |
| `/learn`               | Learn               |
| `/market-index`        | MarketIndex         |
| `/cellar`              | WineCellar          |
| `/journal`             | WineJournal         |
| `/scan`                | LabelScanner        |
| `/referral`            | ReferralPage        |
| `/share/:id`           | SharePortfolio      |
| `/en-primeur`          | EnPrimeur           |
| `/auctions`            | AuctionTracker      |
| `/press`               | PressKit            |
| `/sentiment`           | MarketSentiment     |
| `/goals`               | InvestmentGoals     |
| `/transparency`        | Transparency        |
| `/settings/notifications` | NotificationSettings |

---

## API Backend — endpoint attivi

```
# Core wines
GET  /api/wines?search=&limit=&offset=&type=&vintage=
GET  /api/market/wines
GET  /api/wine-info/:wineId
GET  /api/trending

# Prices
GET  /api/prices/:wineId/history?currentPrice=
POST /api/prices/refresh

# Orders & Purchase
GET  /api/orders
POST /api/orders
POST /api/purchase

# Auth
POST /api/auth/...

# AI (rate-limited)
GET  /api/ai-score/:wineId
GET  /api/ai/market-analysis
GET  /api/ai/portfolio/:userId
GET  /api/ai/proactive-analysis/:userId
POST /api/agent/chat

# User features
GET/POST /api/cellar
GET/POST /api/journal
GET/POST /api/goals
GET/POST /api/alerts
GET      /api/notifications
POST     /api/label-scan
GET      /api/referral/:userId
GET      /api/pairing

# Market data
GET  /api/market (index)
GET  /api/vintage/:region/:year
GET  /api/currency
GET  /api/rates
GET  /api/news
GET  /api/sentiment

# Payments
POST /api/payments/stripe/checkout
POST /api/payments/stripe/webhook
POST /api/payments/paypal

# Misc
GET  /api/gamification/:userId
GET  /api/blog
GET  /api/sources
GET  /api/dashboard/:userId
GET  /api/health
GET  /api/sitemap.xml
POST /api/feedback
GET/POST /api/email-preferences
POST /api/unsubscribe
```

---

## Database schema

```sql
wines          (id, name, producer, vintage, current_price, investment_score, risk, market_trend, image_url)
price_history  (id, wine_id, price, currency, source, recorded_at)
price_cache    (wine_id, vintage, price_avg, updated_at)
orders         (id, user_id, wine_id, quantity, price, status, created_at)
-- tabelle aggiuntive gestite via Supabase Auth: users, profiles
```

---

## Stato features (2026-06-08)

### ✅ Completato

| Feature | Dove |
|---------|------|
| Stripe checkout + webhook | `/api/payments/stripe` |
| PayPal sandbox | `/api/payments/paypal` |
| Pagina `/pricing` (Free/Pro/Elite) | `Pricing.jsx` |
| Wine search server-side + infinite scroll | `App.jsx` + `VirtualWineGrid` |
| Price history chart tutti i vini | `PriceHistoryChart.jsx` |
| Three.js rimosso → SVG puro (-53% bundle) | `Bottle3D.jsx` |
| Modal dettaglio vino | `WineBottle3DModal.jsx` |
| AI Score (Claude API) | `aiScoreService.js` |
| Price alerts + email | `alertsChecker.js` + `emailService.js` |
| Dashboard B2B | `B2B.jsx` |
| Gamification (punti/badge) | `gamificationService.js` |
| Cantina personale | `WineCellar.jsx` + `/api/cellar` |
| Diario degustazioni | `WineJournal.jsx` + `/api/journal` |
| Label scanner (camera) | `LabelScanner.jsx` + `/api/label-scan` |
| Voice interface | `VoiceInterface.jsx` |
| Social proof widget | `SocialProof.jsx` |
| PWA install prompt | `App.jsx` (deferredPrompt) |
| Vintage scoring | `VintageScore.jsx` + `/api/vintage` |
| Market index VinoInvest | `MarketIndex.jsx` + `vinoInvestIndex.js` |
| Academy/Learn | `Learn.jsx` |
| Investment calculator | `InvestmentCalculator.jsx` |
| Multi-currency | `CurrencySelector.jsx` + `/api/currency` |
| Onboarding modal | `OnboardingModal.jsx` |
| Guided tour | `GuidedTour.jsx` |
| HelpBot FAQ | `HelpBot.jsx` |
| AgentChat AI floating | `AgentChat.jsx` |
| Portfolio share | `SharePortfolio.jsx` |
| Referral system | `ReferralPage.jsx` + `/api/referral` |
| Blog auto-generato | `blogAgent.js` + `/api/blog` |
| Chrome extension | `chrome-extension/` |
| Telegram bot | `telegramBot.js` |
| i18n multi-lingua | `i18n.js` + `LangSelector.jsx` |
| Dark/light theme | `ThemeToggle.jsx` + `theme.js` |
| GDPR cookie banner | `CookieBanner.jsx` |
| SEO sitemap | `/api/sitemap.xml` |
| Transparency page | `Transparency.jsx` + `SourceBadge.jsx` |
| Free data sources | `freeDataService.js` |
| Security headers (helmet) | `server.js` |
| Rate limiting AI endpoints | `server.js` (aiRateLimit) |
| Notification settings | `NotificationSettings.jsx` |
| Feedback system | `/api/feedback` |
| Email preferences | `/api/email-preferences` |
| Newsletter service | `newsletterService.js` |

### 🔄 In corso / Da completare

| Feature | Stato | Note |
|---------|-------|------|
| Login reale Supabase | **PROSSIMO** | `supabase.auth.onAuthStateChange` già hookato in `App.jsx`, manca UI login/register completa |
| Stripe webhook live | Sandbox only | `STRIPE_WEBHOOK_SECRET` da configurare in Render |
| AI Agent acquisti autonomo | Infrastruttura pronta | `portfolioAgent.js` esiste, manca orchestrazione completa |

---

## Auth — stato attuale

`App.jsx` ascolta `supabase.auth.onAuthStateChange` — quando session esiste, legge `account_type` dalla tabella `users` su Supabase. Il login/logout è già funzionante via Supabase. La UI di registrazione/login completa (form dedicato o modal) è il **prossimo step** della roadmap.

---

## ENV vars necessari

**Backend `.env`** (su Render):
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xghuyfgftvrhnmuezbbz.supabase.co
SUPABASE_SERVICE_KEY=...
ANTHROPIC_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
SENDGRID_API_KEY=...       (o SMTP per email)
TELEGRAM_BOT_TOKEN=...
```

**Frontend `.env.local`** (su Vercel):
```
VITE_SUPABASE_URL=https://xghuyfgftvrhnmuezbbz.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://vinoinvest-backend-2.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=...
```

---

## Coordinamento multi-agente

- **Frontend agent**: scrivi `FRONTEND_DONE.md`, usa `FRONTEND_NEEDS.md` per comunicare col backend
- **Backend agent**: scrivi `BACKEND_DONE.md` con spec endpoint aggiunti
- **DB/Test agent**: scrivi `DB_TEST_REPORT.md`
- **Coordinator**: legge i tre file, risolve conflitti, push finale

Non fare push autonomamente se sei agente frontend/backend/db — aspetta il coordinator.

---

## Prossimi step prioritari

1. **Login UI completo** — modal o pagina dedicata `/login` con form email/password + OAuth Google via Supabase
2. **Stripe webhook live** — impostare `STRIPE_WEBHOOK_SECRET` in Render, testare con `stripe listen`
3. **AI Agent acquisti** — orchestrare `portfolioAgent.js` con trigger automatici
4. **Test E2E** — aggiungere Playwright o Cypress per golden path: search → modal → purchase
