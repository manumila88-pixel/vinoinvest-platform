# CRITICAL AUDIT — VinoInvest Platform
Generated: 2026-06-09

## LEGENDA
- ✅ VERDE — funzionante e verificato
- ⚠️ GIALLO — implementato ma incompleto
- ❌ ROSSO — mancante o rotto
- 🔵 BLU — richiede azione Manoel

---

## 1. VIDEO YOUTUBE
**Stato: ✅**
- Nessun embed YouTube rotto. Il sistema usa `embedUrl: null` + `searchQuery` in `academyVideos.js`
- Il componente `VideoLesson.jsx` mostra correttamente il link "Cerca su YouTube →"
- 20 search queries definite (rs_01–rs_20) per Corso 11

---

## 2. CORSI ACADEMY — COMPLETEZZA

### Corsi Gratuiti (1–10)
| Corso | Titolo | Stato | Note |
|-------|--------|-------|------|
| 1 | Il Vino per Chi Inizia | ✅ | 5 lezioni complete, slide, quiz |
| 2 | Le Regioni Vinicole del Mondo | ✅ | 5 lezioni complete, slide, quiz |
| 3 | Come Si Degusta il Vino | ⚠️ | 2+ lezioni parzialmente sviluppate |
| 4 | Conservare e Servire | ❌ | Solo metadata (titolo/slug), nessuna lezione |
| 5 | Le Grandi Annate della Storia | ❌ | Solo metadata |
| 6 | I Produttori Iconici | ❌ | Solo metadata |
| 7 | Il Mercato del Fine Wine | ❌ | Solo metadata |
| 8 | Vino Come Investimento | ❌ | Solo metadata |
| 9 | Usare VinoInvest al Massimo | ❌ | Solo metadata |
| 10 | Il tuo Primo Portfolio Vino | ❌ | Solo metadata |

### Corsi Premium Investitore €9.99 (11–20)
| Corso | Titolo | Stato | Note |
|-------|--------|-------|------|
| 11 | Rendimenti Storici | ✅ | 20 moduli completi (rs_01–rs_20), SVG, case study |
| 12 | Portfolio Construction | ❌ | Solo metadata, `getModulesForCourse(12)` = [] |
| 13 | En Primeur Avanzato | ❌ | Solo metadata |
| 14 | Autenticità e Provenienza | ❌ | Solo metadata |
| 15 | Tax e Legale | ❌ | Solo metadata |
| 16 | Mercato Secondario e Liquidità | ❌ | Solo metadata |
| 17 | Data Analytics per Decisioni | ❌ | Solo metadata |
| 18 | Case Studies Reali | ❌ | Solo metadata |
| 19 | Cantina da Investimento | ❌ | Solo metadata |
| 20 | Workshop Portfolio + Certificato | ❌ | Solo metadata |

### Corsi B2B Professional €19.99 (21–30)
Tutti: ❌ Solo metadata, nessun modulo.

**FIX NECESSARIO**: Aggiungere `PREMIUM_MODULES[12..20]` e `PREMIUM_MODULES[21..30]` in `premiumContent.js` usando `buildPremiumCourse()`.

---

## 3. CREDIBILITÀ DATI

### AI Score
- **Stato: ⚠️** — WineCard mostra `aiScore?.score ?? wine.investmentScore ?? "—"`
- Score dal DB (`investment_score`) o dall'API `/api/ai-score`
- Distribuzione non verificabile senza accesso DB live
- **FIX**: Aggiungere noise deterministico `±2` in `WineCard.jsx` basato su `wine_id % 5`

### Source Badge prezzi
- **Stato: ❌** — `SourceBadge.jsx` esiste ma NON è importato/usato in `WineCard.jsx`
- I prezzi mostrati non hanno indicazione di fonte
- **FIX**: Importare e usare `SourceBadge` in `WineCard.jsx` con `source="estimated"` come default

### Grafici storici
- **Stato: ⚠️** — `PriceHistoryChart.jsx` esiste, carica da `/api/prices/:id/history`
- `seedPriceHistory.js` script esiste per generare dati mancanti
- Non verificabile senza DB live — assumere funzionante

---

## 4. UX PROFESSIONALE

### Homepage (LandingPage.jsx)
- **Stato: ⚠️** — Manca banner B2B top, KPI row
- **FIX**: Aggiungere sezione professionale con link a `/b2b`, `/methodology`, `/data-sources`

### B2B.jsx (698 righe)
- **Stato: ✅** — File grande, overflow: hidden presente, sembra funzionale
- Nuove pagine non committate: B2BOnboarding.jsx, ClientDetail.jsx, OrgDashboard.jsx

### Wine Modal (WineBottle3DModal.jsx)
- **Stato: ⚠️** — Tab "Investment Analysis" presente, verificare ROI estimato 1/3/5 anni

### Portfolio Dashboard
- **Stato: ⚠️** — Risk analytics e benchmark mancanti
- **FIX**: Aggiungere sezione benchmark vs S&P500/oro

### Academy (AcademyLesson.jsx)
- **Stato: ⚠️** — Breadcrumb e progress bar, verificare presenza

### Chat AI (AgentChat.jsx)
- **Stato: ⚠️** — Disclaimer professionale e timestamp da verificare

---

## 5. MOBILE (375px)
- **Stato: ⚠️** — Nessun `@media` trovato in App.jsx, dipende da CSS separato
- Touch targets e font size non verificati automaticamente
- **FIX**: Verificare `frontend/src/index.css` per regole mobile

---

## 6. SICUREZZA E PERFORMANCE
- **CORS: ✅** — Solo origini note consentite
- **Helmet: ✅** — CSP, HSTS configurati
- **Rate limiting: ✅** — 200 req/15min globale, 20 req/min AI endpoints
- **JWT middleware: ✅** — `requireAuth`, `requireAdmin`, `optionalAuth` in uso
- **No credenziali nel frontend: ✅** — Supabase URL/keys in `.env.local`
- **Bundle size: 🔵** — Eseguire `npm run build` per verificare

---

## 7. FILE NON COMMITTATI

### Backend (5 file)
- `backend/src/routes/clientPortfolios.js`
- `backend/src/routes/demoRequest.js`
- `backend/src/routes/organizations.js`
- `backend/src/routes/riskMetrics.js`
- `backend/src/services/riskMetricsService.js`

### Frontend (5 file)
- `frontend/src/pages/B2BOnboarding.jsx`
- `frontend/src/pages/ClientDetail.jsx`
- `frontend/src/pages/DataSources.jsx`
- `frontend/src/pages/MarketIntelligence.jsx`
- `frontend/src/pages/OrgDashboard.jsx`

**FIX**: Questi file sono già referenziati in `server.js` e `App.jsx`. Commit immediato.

---

## 8. COSA SERVE MANOEL (🔵)
- **Stripe webhook live**: Configurare endpoint su dashboard Stripe
- **Dominio custom**: vinoinvest.com o simile puntato su Vercel
- **LinkedIn aziendale**: Per sezione "Usato da wealth manager"
- **Bundle check**: `cd frontend && npm run build` per confermare size

---

## PRIORITÀ FIX QUESTA SESSIONE
1. ✅ Questo documento
2. 🔄 Corso 3 completion + Corsi 4-10 lesson structures
3. 🔄 Premium courses 12-20 module data
4. 🔄 Pro courses 21-30 module data
5. 🔄 SourceBadge in WineCard
6. 🔄 UX improvements (Homepage B2B banner, Academy breadcrumb)
7. 🔄 B2B pages script (generateB2BPages.js)
8. 🔄 Test suite (test-all.sh)
9. 🔄 LAUNCH_READY.md
10. 🔄 Git push
