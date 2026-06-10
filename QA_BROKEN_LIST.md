# QA Broken List — VinoInvest

> Generato: 2026-06-09 | QA tester automatico
> Metodo: analisi statica del codice, build check, verifica API, verifica i18n, verifica import

---

## Risultati Build & Config

| Check | Risultato |
|-------|-----------|
| `npm run build` | ✅ Clean — nessun errore |
| `dist/index.html` punta a `/assets/*.js` compilati | ✅ Corretto |
| `frontend/vercel.json` fantasma | ✅ Non esiste |
| Tutti i file lazy-loaded (`pages/*.jsx`) esistono | ✅ Tutti presenti |
| Tutti i lib import (`lib/*.js`) esistono | ✅ Tutti presenti |
| Chiavi i18n in `en.json` (nav, stats, market, auth, ecc.) | ✅ Tutte presenti |
| File dati Academy (`academyContent.js`, `premiumContent.js`, ecc.) | ✅ Tutti presenti |
| Video YouTube — query pertinenti a vino/investimento | ✅ Tutte rilevanti |

---

## Tabella Bug

| Pagina | Cosa è rotto/vuoto | Gravità | Fixato? |
|--------|---------------------|---------|---------|
| Wine Detail Modal (WineBottle3DModal) | Browser tab title mostra "Prezzo €0" per TUTTI i vini: `price = wine.current_price \|\| wine.price \|\| 0` ma i dati usano camelCase `currentPrice` — risultato: `0`. Schema.org product price = 0. | GRAVE | ✅ Fixato |
| My Portfolio — Diversification "By Type" | Mostra sempre "Other" per tutti i vini perché `wines.json` / `bigWines.json` non hanno campo `type`. Non crasha ma il chart è inutile. | MINORE | No |
| Watchlist | Non persiste dopo refresh pagina (solo `useState([])`). L'utente perde la watchlist ad ogni ricarica. | MINORE | No |
| Route duplicata `/landing` | Definita due volte (riga 1972 e 2020), la seconda non viene mai raggiunta. Dead code, non visibile all'utente. | MINORE | No |
| AgentChat — `Sparkline` | `<polyline>` ha l'attributo `points` duplicato (riga 33 e 35). React usa l'ultimo. Piccolo elemento visivo, non crasha. | MINORE | No |
| Modal SEO schema — `score` | `wine.investment_score` (snake_case) è undefined per tutti i vini market (usano `investmentScore`). Tuttavia il fallback `aiScore` (da `wine.investmentScore`) funziona, quindi il valore finale è corretto. | MINORE (già funzionante via fallback) | N/A |

---

## Note Generali (non bug, comportamenti attesi)

- **Backend Render cold start**: primo accesso può richiedere 30s. Il frontend mostra correttamente "Server starting..." e riprova. ✅
- **Tab Analysis vuoto**: mostra "Add wines to watchlist" quando non ci sono vini nella watchlist — comportamento corretto, non broken. ✅
- **My Portfolio — stato vuoto**: mostra DEMO data con banner giallo quando non ci sono holdings reali. ✅
- **News/Blog tabs**: mostrano empty state quando il backend è down — gestito correttamente. ✅
- **`.env` locale ha `VITE_BACKEND_URL=localhost:3000`**: backend non gira localmente, ma in produzione (Vercel) la variabile d'ambiente è sovrascritta con il Render URL. Non è un bug di produzione. ✅
- **Stripe key placeholder in `.env`**: PaymentModal ha guard `!key.includes("YOUR_")`, non crasha. ✅ Il flusso Stripe usa checkout server-side (redirect), non il SDK client.

---

## Dettaglio Fix Applicati

### 1. WineBottle3DModal — browser tab title "Prezzo €0"
**File**: `frontend/src/WineBottle3DModal.jsx` riga 446
**Prima**: `const price = wine.current_price || wine.price || 0;`
**Dopo**: `const price = wine.currentPrice || wine.current_price || wine.price || 0;`
**Perché**: tutti i dati vini (wines.json, externalWines.json, bigWines.json) usano camelCase `currentPrice`. Il snake_case `current_price` è undefined, quindi `price = 0` e il browser tab mostrava "Prezzo €0" per tutti i vini.
