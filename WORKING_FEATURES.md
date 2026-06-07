# VinoInvest — Feature Status (Audit 2026-06-07)

## ✅ FUNZIONANTE (verificato)

### Dati
- **50k+ vini** caricati da wines.json + externalWines.json + bigWines.json
- **Wikipedia REST API** → descrizioni produttori (testato: Château Margaux OK)
- **Wikipedia Commons** → immagini bottiglie reali (testato: Barolo → upload.wikimedia.org)
- **Open Food Facts** → immagini aggiuntive
- **RSS News** (10 feed) → 30 articoli reali aggregati (testato: 30 articles OK)
- **Open-Meteo** vintage climate scoring (testato: Bordeaux 2019 = 95/100 Eccezionale)
- **CellarTracker** gratuito → prezzi community
- **ECB HICP** → inflazione eurozona
- **ECB Exchange rates** → 10 valute live

### Backend API
- `GET /api/wines` — catalogo con search, filtri, paginazione
- `GET /api/prices/:id/history` — storico prezzi
- `GET /api/news` — RSS → NewsAPI → fallback
- `GET /api/wine-info/wiki` — Wikipedia summary
- `GET /api/wine-info/image` — immagini multi-source
- `GET /api/wine-info/price` — CellarTracker prezzi
- `GET /api/wine-info/notes` — CellarTracker community notes
- `GET /api/wine-info/inflation` — ECB HICP
- `GET /api/vintage/score` — score climatico per regione/anno
- `GET /api/vintage/region/:key` — serie storica annate
- `GET /api/currency/rates` — tassi ECB live
- `GET /api/currency/price/:amount` — conversione in 10 valute
- `GET /api/market/index` — VinoInvest Index (VII)
- `GET /api/market/merchants` — link merchant con trust badge
- `GET /api/market/investment-estimate` — proiezione 1/3/5 anni
- `GET /api/gamification/stats/:userId` — punti + badge
- `POST /api/gamification/event` — assegna punti
- `GET /api/gamification/leaderboard` — top investitori
- `GET /api/sitemap.xml` — sitemap dinamica 50k vini
- `GET /api/health` — health check
- `GET /api/ai/proactive-analysis/:userId` — analisi AI proattiva

### Frontend Pages
- `/` — App principale (market, portfolio, news, blog, dashboard)
- `/pricing` — Piani e prezzi
- `/b2b` — Landing B2B
- `/learn` — Wine Investment Academy (8 lezioni)
- `/market-index` — VinoInvest Index con grafici

### Frontend Components
- **WineCard** — immagini reali + placeholder Unsplash + tooltip AI Score
- **PriceHistoryChart** — grafico prezzi storici
- **VintageScore** — score climatico badge compatto
- **InvestmentCalculator** — proiezione interattiva budget/orizzonte/rischio
- **CurrencySelector** — switcher 10 valute ECB live
- **PurchaseModal** — merchant links + trust badge
- **AgentChat** — AI chat (Claude o fallback algoritmico)
- **OnboardingModal** — 5 step guida
- **HelpBot** — FAQ + fuzzy search
- **GuidedTour** — overlay tour 5 step
- **CookieBanner** — GDPR accept/decline
- **Disclaimer footer** — avviso legale

### Infrastructure
- **Service Worker** — offline cache, push notifications ready
- **Multi-agent system** — setup.sh, launch.sh, git worktrees
- **Telegram Bot** — pronto (richiede TELEGRAM_BOT_TOKEN)
- **VinoInvest Index** — indice proprietario con history 3 anni
- **Gamification** — punti, badge, leaderboard
- **Sitemap.xml** — 50k URL dinamici

## ⚠️ PARZIALE (funziona ma non testato in prod)

- **Price alerts** — sistema base, webhook Stripe non live
- **Blog agent** — genera post, richiede DB connection
- **Proactive portfolio analysis** — cron ogni 15 min, richiede utenti con holdings
- **Translation service** — attivo ma richiede DB per caching

## ❌ RICHIEDE CONFIGURAZIONE UTENTE

- **Telegram Bot** — aggiungere TELEGRAM_BOT_TOKEN in backend/.env
- **Anthropic API** — aggiungere ANTHROPIC_API_KEY per Claude chat
- **Unsplash/Pexels** — registrare account su unsplash.com/developers
- **Sentry** — registrare account su sentry.io
- **Stripe webhook** — configurare endpoint in produzione
- **Email alerts** — configurare SMTP/Resend

## 📋 STACK RIEPILOGO

| Layer | Status |
|-------|--------|
| Frontend (Vercel) | ✅ Deploy automatico via GitHub |
| Backend (Render) | ✅ Online (cold start 30s) |
| Database PostgreSQL | ✅ Render vinoinvest_db |
| Auth (Supabase) | ✅ xghuyfgftvrhnmuezbbz |
| Service Worker | ✅ Registrato |
| Telegram Bot | ⚠️ Richiede token |
