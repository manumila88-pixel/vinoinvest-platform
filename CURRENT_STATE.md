# VinoInvest — Current State
**Date:** 2026-06-08  
**Audit:** Final pre-launch

## Backend (vinoinvest-backend-2.onrender.com)
| Feature | Status |
|---------|--------|
| /api/health | ✅ UP |
| /api/wines (50k+ vini) | ✅ UP |
| /api/news (RSS reali) | ✅ UP |
| /api/schema/website | ✅ UP |
| /sitemap-index.xml | ✅ UP |
| /api/agent/opportunities | ✅ UP (~890ms) |
| /api/blog | ✅ UP (~450ms) |
| CORS | ✅ Solo vinoinvest-platform.vercel.app |
| Rate limiting | ✅ 200/15min global |
| JWT auth | ✅ Supabase |
| Helmet.js | ✅ HSTS + CSP |
| Email flow 180 giorni | ✅ Implementato (attende RESEND_API_KEY) |

## Frontend (vinoinvest-platform.vercel.app)
| Feature | Status |
|---------|--------|
| Build | ✅ 0 errori, nessun chunk > 500KB |
| Academy paywall | ✅ Corsi 1-10 gratis, 11+ subscriber, admin bypass |
| DisclaimerBar | ✅ Presente su ogni pagina |
| ErrorBoundary | ✅ Su tutte le sezioni principali |
| Mobile responsive | ✅ 480px + 768px breakpoints |
| i18n 40 lingue | ✅ con RTL ar/he |
| Bundle academy | ✅ Ridotto da 689KB a 495KB (split premiumContent) |

## Mancante (action required)
| Item | Azione |
|------|--------|
| ANTHROPIC_API_KEY | Set su Render → AI reale |
| RESEND_API_KEY | Set su Render → email flow si attiva |
| STRIPE_WEBHOOK_SECRET | Set su Render + configura su Stripe dashboard |
| vinoinvest.com | Acquista su namecheap.com (€15) |
| Google Search Console | Submit sitemap dopo dominio |
| UptimeRobot | Monitor backend + frontend |
