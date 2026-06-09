# AGENT_F_V2_DONE — Motore di STIMA prezzo (§2)

Branch: `build/v2`

---

## File toccati

| File | Tipo | Commit | Cosa fa |
|------|------|--------|---------|
| `backend/src/services/priceEstimateService.js` | **nuovo** | 383c9f2 | Motore di stima: blending ponderato tra 7 segnali |
| `backend/src/routes/priceEstimate.js` | **nuovo** | 50e8f2a | Route REST per il servizio di stima |
| `backend/src/services/riskMetricsService.js` | modifica | a9b4f00 | Aggiunta `estimateSingleWineRisk()` — profilo rischio per singolo vino |

File non toccati (già esistenti e funzionanti):
- `backend/src/services/aiScoreService.js` — invariato
- `backend/src/services/vinoInvestIndex.js` — invariato

---

## Cosa fa `priceEstimateService.js`

### Segnali usati (tutti gratuiti / legali)

| Segnale | Fonte | Peso |
|---------|-------|------|
| Producer reputation tier | `producerScores.js` (curato da report aste pubblici) | 40% |
| Vintage aging curve | Masset & Weisskopf (2018), SSRN public paper | 30% |
| Regional demand premium | Liv-ex Fine Wine Annual Reports (PDF pubblici) | 15% |
| Market trend (wines table) | DB interno | 10% |
| Price history momentum | `price_history` DB table | 5% |
| DB current_price | Ancora se presente | peso dinamico |
| Wine-Searcher API | Opzionale — solo se `WINE_SEARCHER_KEY` env è impostata | peso dinamico |

### Output garantito

```json
{
  "is_estimate": true,
  "source_label": "STIMA",
  "estimate_low": 150,
  "estimate_mid": 200,
  "estimate_high": 270,
  "currency": "EUR",
  "confidence": 0.62,
  "confidence_level": "medium",
  "factors": { ... },
  "methodology": "...",
  "sources": [ ... ],
  "disclaimer": "Questo è un valore INDICATIVO...",
  "generated_at": "2026-06-09T..."
}
```

Ogni risposta ha **sempre** `is_estimate: true` e `source_label: "STIMA"`. Non viene mai presentato come prezzo reale.

### Livelli di confidenza

- **high** (≥ 0.65): DB price + history ≥ 6 punti + producer lookup → spread ±12%
- **medium** (0.38–0.64): DB price o history parziale → spread ±22%
- **low** (< 0.38): solo modello algoritmico → spread ±35%

---

## Endpoint esposti

### `POST /api/price-estimate`
Body: wine object `{ id, name, producer, vintage, region, current_price, market_trend, risk }`
Oppure array (max 20 wine) per batch.

### `GET /api/price-estimate/:wineId`
Query: `name`, `producer`, `vintage`, `region`, `current_price`, `market_trend`, `risk`

---

## Azione richiesta al coordinatore (server.js — non toccato da Agent F)

Aggiungere in `backend/src/server.js`:

```js
// Import (in cima, con gli altri import)
import priceEstimateRouter, { setEstimateRoutePool } from "./routes/priceEstimate.js";

// Mount (dopo le altre app.use)
app.use("/api/price-estimate", priceEstimateRouter);

// Nel callback dove il pool DB è pronto (vicino a setRiskPool, setDemoPool, ecc.)
setEstimateRoutePool(pool);
```

Senza queste righe il servizio esiste ma non è raggiungibile via HTTP. Il servizio funziona già in modalità degradata (senza pool DB): usa solo il modello algoritmico.

---

## Wine-Searcher (opzionale)

Il servizio supporta Wine-Searcher come segnale aggiuntivo ma **non lo richiede**.
- Richede `WINE_SEARCHER_KEY` env su Render
- Se la key non è impostata, il servizio funziona ugualmente (confidenza leggermente inferiore)
- L'utente deve registrarsi su wine-searcher.com e verificare il formato esatto dell'endpoint API
- Free tier: 100 lookup/giorno

**NOTA**: il formato esatto dell'endpoint API Wine-Searcher deve essere verificato dalla documentazione ufficiale dopo la registrazione. Il codice usa `https://api.wine-searcher.com/api/default/1/` — potrebbe differire dalla versione attuale.

---

## Nuove dipendenze

**Nessuna.** Il servizio usa solo:
- `node-fetch` (built-in `fetch` in Node 18+, già disponibile)
- `../data/producerScores.js` (già esistente)
- `pg` pool (già esistente, passato via injection)

---

## Cosa NON è stato fatto (e perché)

- **Scraping Wine-Searcher / Liv-ex / Decanter**: vietato dal contratto (ToS)
- **CellarTracker prezzi diretti**: non ha API pubblica documentata
- **Robert Parker / Wine Spectator scores**: solo a pagamento
- **Dati aste live (Christie's, Sotheby's)**: nessuna API gratuita pubblica con prezzi strutturati
- **Modifica di server.js**: non è nella proprietà §2 — segnalato sopra per il coordinatore

---

## Delta bundle

Zero impatto sul frontend (backend only).
