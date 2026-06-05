# VinoInvest — Contesto Agente

> Questo file viene letto automaticamente da Claude Code ad ogni sessione.
> Contiene tutto il contesto necessario per lavorare su VinoInvest senza spiegazioni.

## Progetto

**VinoInvest** è una piattaforma di investimento sul vino.
Obiettivo prodotto: aggregatore dove gli utenti non escono mai dalla piattaforma.

## Stack

| Layer | Tech | URL |
|-------|------|-----|
| Frontend | React + Vite | vinoinvest-platform.vercel.app |
| Backend | Node.js + Express | vinoinvest-backend-2.onrender.com |
| Database | PostgreSQL | Render (vinoinvest_db) |
| Auth | Supabase | xghuyfgftvrhnmuezbbz |
| Repo | GitHub | github.com/manumila88-pixel/vinoinvest-platform |

## Regole fondamentali

1. **MAI Three.js** — rimosso definitivamente, usa SVG/CSS
2. **Chart**: `ComposedChart` diretto, width fisso in pixel, NO `ResponsiveContainer`
3. **Ogni commit** deve essere in inglese: `feat/fix/chore(scope): description`
4. **Test prima del commit** — curl per backend, visual check per frontend
5. **Non rompere** funzionalità esistenti
6. **Non usare mock** — solo codice funzionante con dati reali

## Roadmap (stato attuale)

- ✅ Stripe + PayPal + /pricing
- ✅ Wine search server-side + infinite scroll
- ✅ Price history chart (tutti i vini)
- ✅ Three.js rimosso, SVG bottle, bundle -53%
- 🔄 Login reale Supabase ← PROSSIMO
- ⬜ AI Score con Claude API
- ⬜ Price alerts (email)
- ⬜ Dashboard B2B
- ⬜ Stripe webhook live
- ⬜ AI Agent acquisti autonomo

## Architettura file

```
vinoinvest-platform-ready/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    ← main (1000+ righe)
│   │   ├── WineBottle3DModal.jsx      ← modal dettaglio vino
│   │   ├── lib/
│   │   │   └── supabase.js            ← client Supabase
│   │   └── components/
│   │       ├── PriceHistoryChart.jsx  ← NO ResponsiveContainer
│   │       └── Bottle3D.jsx           ← SVG statica (non Three.js)
│   └── .env.local
└── backend/
    ├── src/
    │   ├── index.js
    │   ├── routes/
    │   │   ├── wines.js
    │   │   ├── prices.js
    │   │   └── orders.js
    │   └── services/
    │       └── priceService.js        ← getPriceHistory, generateAndSeedHistory
    └── .env
```

## Endpoint backend attivi

```
GET  /api/wines?search=&limit=&offset=&type=&vintage=
GET  /api/prices/:wineId/history?currentPrice=
POST /api/prices/refresh
GET  /api/orders/:userId
POST /api/orders
```

## DB Schema

```sql
wines          (id, name, producer, vintage, current_price, investment_score, risk, market_trend, image_url)
price_history  (id, wine_id, price, currency, source, recorded_at)
price_cache    (wine_id, vintage, price_avg, updated_at)
orders         (id, user_id, wine_id, quantity, price, status, created_at)
```

## Coordinamento multi-agente

Quando lavori come agente specializzato:
- **Frontend agent**: scrivi `FRONTEND_DONE.md` quando finisci, usa `FRONTEND_NEEDS.md` per comunicare con backend
- **Backend agent**: scrivi `BACKEND_DONE.md` con spec degli endpoint aggiunti
- **DB/Test agent**: scrivi `DB_TEST_REPORT.md` con risultati test
- **Coordinator**: leggi i tre file sopra, risolvi conflitti, push finale

Non fare push autonomamente se sei un agente frontend/backend/db — aspetta il coordinatore.
