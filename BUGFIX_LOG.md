# BUGFIX LOG

## BUG 1 — NaN nel gauge score delle WineCard
**File:** `frontend/src/components/WineCard.jsx`

**Root cause:**
- `wine.id` è una stringa/UUID → `"abc" % 5 = NaN` → `[-2,-1,0,1,2][NaN] = undefined`
- `wine.investmentScore` (numero dal DB) non veniva convertito con `Number()` → `"100" + undefined = NaN`
- `NaN ?? "—"` non fa fallback perché NaN non è null/undefined

**Fix:**
- `parseInt(wine.id) || 0` per il modulo
- `Number(wine.investmentScore)` per la conversione
- Controllo `isNaN()` esplicito → restituisce `null` che attiva `?? "—"`

**Verifica:** Build pulito, formula restituisce null (→ "—") invece di NaN per tutti i casi edge.

---

## BUG 2 — AI Score 100/100 su troppi vini
**File:** `frontend/src/components/WineCard.jsx` + `backend/src/services/aiScoreService.js`

**Root cause:**
1. Vecchi score cached in DB (`ai_scores`) salvati come 100 prima che il cap fosse introdotto
2. `wine.investmentScore = 100` nel DB per molti vini pregiati → fallback dava score 100
3. `scoreNoise` (+2) veniva aggiunto sopra all'`aiScore.score` già rumoroso (double noise)

**Fix:**
- `aiScoreService.js`: cached score cappato a 99 per vini non-elite (`isEliteWine` check)
- `WineCard`: rimosso scoreNoise dall'`aiScore` path (già ha rumore baked-in dall'algoritmo backend)
- `WineCard`: `investmentScore` fallback cappato a 95 → max display 97 con noise ±2

**Verifica:** Solo vini elite (DRC, Petrus) possono mostrare 100. Il resto max 99.

---

## BUG 3 — Portfolio AI crash "Qualcosa è andato storto"
**File:** `frontend/src/WineBottle3DModal.jsx`

**Root cause:**
- La pairing API (`/api/pairing/:wineId`) restituisce `[{food, description, match_score}]` (oggetti)
- Il componente `FoodPairings` renderizzava `{p}` direttamente → React Error #31 "Objects are not valid as React child"

**Fix:**
```jsx
{typeof p === "object" ? p.food : p}
```
Compatibile con entrambi i formati (stringa o oggetto).

**Verifica:** Build pulito. Il componente ora renderizza `p.food` (stringa) per il nuovo formato API.

---

## BUG 4 — Stringhe in inglese
**File:** `frontend/src/App.jsx`

**Stringhe fixate:**
| Prima | Dopo |
|-------|------|
| `Watchlist Analysis` | `Analisi Watchlist` |
| `Add wines to watchlist from Market section.` | `Aggiungi vini alla watchlist dalla sezione Mercato.` |
| `My Portfolio` | `{t('portfolio.title')}` → "Il Mio Portfolio" |
| `Notifications` | `{t('notifications.title')}` → "Notifiche" |
| `🔔 Enable Push` | `{t('notifications.enablePush')}` → "🔔 Abilita Push" |
| `Mark all read` | `{t('notifications.markAllRead')}` → "Segna tutto come letto" |
| `No notifications yet. Set a price alert...` | `{t('notifications.noNotifications')}` → traduzione IT |

**Verifica:** Build pulito. Tutte le chiavi i18n esistono in `locales/it.json`.
