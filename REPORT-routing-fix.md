# REPORT — Fix Routing & Navigation

**Branch:** `feat/fix-routing-navigation`
**Data:** 2026-06-15

---

## Bug verificati e fix applicati

### Bug 1 — Market Intelligence 404 al click

**Root cause:** `CommandPalette.jsx` usava `window.location.href = "/market-intelligence"` per TUTTI i comandi, incluso Market Intelligence. Questo forza un ricaricamento HTTP completo. Se il service worker serviva una versione cached dell'`index.html` (strategia cache-first), la nuova build non veniva caricata — causando la schermata vuota percepita come 404.

**Fix:**
- `CommandPalette.jsx`: rimosso l'array `STATIC_COMMANDS` con `window.location.href`. Sostituito con `STATIC_COMMAND_DEFS` (path-only) e `STATIC_COMMANDS` costruito dinamicamente dentro il componente usando `useRouterNavigate()`. Tutti i 20 comandi ora usano React Router `navigate(path)` → zero ricaricamenti.

### Bug 2 — Utenti bloccati in pagine senza navigazione "indietro"

**Status (pre-fix):**
- `BlogIndex.jsx` — già aveva `← navigate("/")` nell'header ✅
- `BlogPost.jsx` — già aveva breadcrumb con `navigate("/")` e `navigate("/blog")` ✅
- `MarketIntelligence.jsx` — aveva `<a href="/">` (hard reload) nel header logo

**Fix:**
- `MarketIntelligence.jsx`: `<a href="/">` → `<button onClick={() => navigate("/")} style={{...}}>` — navigazione SPA senza reload, mantiene lo stato auth.

### Bug 3 — Disclaimer dà errore al click

**Root cause:** Tre punti usavano `<a href="/disclaimer">` (e similari `/terms`, `/privacy`, `/cookies`, `/transparency`):
1. `DisclaimerBar.jsx` — il banner fisso in basso
2. `App.jsx` riga footer — "Read full disclaimer →"
3. `App.jsx` riga footer — link legali nel copyright

Un hard reload in certe condizioni (service worker stale, auth non ancora inizializzato) causava la schermata di errore.

**Fix:**
- `DisclaimerBar.jsx`: `<a href="/disclaimer">` → `<button onClick={() => navigate("/disclaimer")}>` usando `useNavigate`
- `App.jsx`: aggiunto `Link` all'import da `react-router-dom`; tutti i link legali nel footer convertiti in `<Link to="...">`:
  - `/disclaimer` (×2), `/terms`, `/privacy`, `/cookies`, `/transparency`

**Fix collaterali:**
- `<a href="/scan">` nell'header nav → `<button onClick={() => navigate("/scan")}>`
- `<a href="/admin">` nell'header → `<button onClick={() => navigate("/admin")}>`

### Bug 4 — App richiede Cmd+R manuale alla prima apertura

**Root cause:** `sw.js` usava una strategia "cache-first" per TUTTI gli asset statici, incluso `index.html`. Dopo un nuovo deploy su Vercel, il service worker serviva la vecchia versione dell'`index.html` in cache, che referenziava i vecchi chunk JS (ormai non più presenti con i nuovi hash). Questo causava errori di moduli non trovati che richiedevano Cmd+R per bypassare il service worker.

**Fix:**
- `sw.js`: i document request (`request.destination === "document"`) usano ora una strategia **network-first** — prova la rete, fallback alla cache solo se offline. I file JS/CSS (con hash nel nome) mantengono cache-first perché il loro nome cambia ad ogni deploy.

---

## File modificati

| File | Modifica |
|------|---------|
| `frontend/src/components/CommandPalette.jsx` | `window.location.href` → `useRouterNavigate()` per tutti i 20 comandi |
| `frontend/src/components/DisclaimerBar.jsx` | `<a href="/disclaimer">` → `<button onClick={() => navigate(...)}>`  |
| `frontend/src/pages/MarketIntelligence.jsx` | `<a href="/">` → `<button onClick={() => navigate("/")}>`; aggiunto `useNavigate` |
| `frontend/src/App.jsx` | Import `Link`; footer legale → `<Link to="...">`; `/scan` e `/admin` → navigate button |
| `frontend/public/sw.js` | HTML documents: cache-first → network-first |

---

## Route audit — tutte le route verificate

Tutte le route definite in `App.jsx` (file 2591 righe, versione main) hanno il loro componente:

| Route | Componente | Esiste? |
|-------|-----------|---------|
| `/landing` | LandingPage | ✅ |
| `/pricing` | Pricing | ✅ |
| `/b2b` | B2BPage | ✅ |
| `/market-intelligence` | MarketIntelligence | ✅ |
| `/org-dashboard` | OrgDashboard | ✅ |
| `/clients/:clientId` | ClientDetail | ✅ |
| `/disclaimer` | Disclaimer | ✅ |
| `/terms` | Terms | ✅ |
| `/privacy` | PrivacyPolicy | ✅ |
| `/cookies` | Cookies | ✅ |
| `/transparency` | Transparency | ✅ |
| `/scan` | LabelScannerPage | ✅ |
| `/admin` | AdminDashboard | ✅ |
| tutte le altre | — | ✅ |

Nessuna route mancante. Il 404 percepito era causato da reload HTTP + service worker stale, non da route undefined.

---

## Build

```
✓ 0 errori, 0 warning critici
✓ Built in 5.30s
✓ MarketIntelligence-*.js: 17.35 kB (gzip 4.52 kB)
```
