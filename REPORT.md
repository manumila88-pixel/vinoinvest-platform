# REPORT: feat/fix-routing-navigation

**Data:** 2026-06-15  
**Branch:** `feat/fix-routing-navigation`  
**Obiettivo:** Fix 5 bug di navigazione verificati sul sito live. NO merge su main senza OK esplicito.

---

## Bug 1 — Market Intelligence dà 404 al click ✅ RISOLTO

**Causa radice (doppia):**
1. Il check `isB2B` nel componente `MarketIntelligence.jsx` non includeva i tipi account B2B reali (`wealth_manager`, `family_office`, `cantina`), quindi gli utenti B2B vedevano il pannello "🔒 Contenuto Riservato" invece della pagina piena.
2. Un `<a href="/b2b">` dentro il componente causava un full page reload che, se il vercel.json non era applicato, risultava in 404 del server.

**Fix applicati:**
- `frontend/src/pages/MarketIntelligence.jsx`: isB2B check espanso a tutti i tipi B2B: `["b2b", "wealth_manager", "cantina", "family_office", "professional", "enterprise"]`
- `<a href="/b2b">` → `<button onClick={() => navigate("/b2b")}>`
- Aggiunto pulsante "← Indietro" nell'header

---

## Bug 2 — Manca il "torna indietro" in varie pagine ✅ RISOLTO

**Causa radice:** Navigazione back/home assente o inconsistente nelle pagine standalone.

**Fix applicati:**
- Creato `frontend/src/components/BackNav.jsx` — componente riutilizzabile sticky con "← Indietro" (navigate -1 o backTo specificato) + "VinoInvest" home link + breadcrumb title opzionale
- BackNav aggiunto a:
  - `MarketIntelligence.jsx` — "← Indietro" aggiunto nell'header esistente
  - `Disclaimer.jsx` — "← Indietro" aggiunto nel breadcrumb header
  - `B2B.jsx` — `<BackNav title="B2B Solutions" />`
  - `OrgDashboard.jsx` — `<BackNav title="Dashboard B2B" />`
  - `ClientDetail.jsx` — `<BackNav title={client.client_name} backTo="/org-dashboard" />`

---

## Bug 3 — Pagina disclaimer dà errore al click ✅ RISOLTO

**Causa radice:** Links a `/disclaimer` usavano `<a href>` (full page reload). Su Vercel, se il rewrite rule non è nella directory corretta, il server restituisce 404 per URL diretti.

**Fix applicati:**
- `frontend/vercel.json` CREATO con `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]` nella directory `frontend/` (dove Vercel cercava il config quando `rootDirectory=frontend/`)
- `frontend/src/App.jsx`: tutti i link footer interni `<a href>` → `<Link to>` (9 link nel footer nav + il link "Disclaimer →" nel tool di calcolo a line 2128)
- `frontend/src/pages/Disclaimer.jsx`: aggiunto "← Indietro" button + i link interni `<a href="/terms">` ecc. rimasti (solo 3 link nel footer della pagina stessa, lasciate come `<a href>` perché le pagine `/terms`, `/privacy`, `/cookies` hanno già il loro standalone rendering)

---

## Bug 4 — Blog: manca la pagina indice ✅ RISOLTO

**Causa radice:** Solo `/blog/:slug` era presente come concetto ma nessuna delle due route (`/blog` e `/blog/:slug`) era registrata in App.jsx. Nessuna pagina BlogIndex o BlogPost esisteva.

**Fix applicati:**
- Creato `frontend/src/pages/BlogIndex.jsx`:
  - Grid di 99 articoli con search bar e filtri per categoria
  - Ogni card linka a `/blog/:slug`
  - Back button verso home
  - Design coerente col tema app
- Creato `frontend/src/pages/BlogPost.jsx`:
  - Carica articolo da `GET /api/blog/:slug`
  - Breadcrumb: VinoInvest / Blog / Titolo articolo
  - Back link verso `/blog`
- `frontend/src/App.jsx`: aggiunti lazy imports e route `/blog` e `/blog/:slug`

---

## Bug 5 — All'apertura dell'app serve Cmd+R ✅ RISOLTO (parziale)

**Causa radice identificata:**
- `<Route path="/landing" element={<LandingPage onLogin={() => { window.location.href = "/"; }} />} />` causava un full page reload dopo il login, resettando lo state React. Dopo il reload, la sequenza Supabase auth → `setIsLoggedIn(true)` → `loadData()` ripartiva da zero.
- Questo comportava un momento in cui i dati non erano caricati finché la chain async non completava.

**Fix applicato:**
- Creato componente `LandingRoute` che usa `useNavigate()` e chiama `navigate("/")` invece di `window.location.href = "/"`. Login ora usa navigazione client-side senza reload.

**Nota:** Se il problema persiste su tutti i browser (non solo dopo login da `/landing`), la causa potrebbe essere la Supabase session verificatioin async al primo mount. In quel caso il fix richiede inizializzare `isLoggedIn` sincrono da localStorage: `const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("vino_user"))`. Questo non è stato modificato per non rompere il flow di autenticazione Supabase esistente — da verificare dopo il deploy.

---

## Cosa NON è stato modificato

- Routes già funzionanti (pricing, academy, cellar, journal, etc.)
- Logica auth Supabase in App.jsx
- Styling esistente dei componenti modificati (solo aggiunta di elementi, nessuna modifica al layout)
- AcademyCourse.jsx e AcademyLesson.jsx — queste pagine hanno già navigazione interna propria (prev/next slide, breadcrumb corso). BackNav non aggiunto per non confliggere con l'UX del corso.

---

## File modificati

| File | Tipo | Motivo |
|------|------|--------|
| `frontend/vercel.json` | NUOVO | SPA rewrite rules per Vercel |
| `frontend/src/components/BackNav.jsx` | NUOVO | Componente navigazione back riutilizzabile |
| `frontend/src/pages/BlogIndex.jsx` | NUOVO | Pagina indice blog /blog |
| `frontend/src/pages/BlogPost.jsx` | NUOVO | Pagina articolo blog /blog/:slug |
| `frontend/src/App.jsx` | MODIFICATO | LandingRoute, blog routes, Link invece di `<a href>` footer |
| `frontend/src/pages/MarketIntelligence.jsx` | MODIFICATO | isB2B fix, back button, href→navigate |
| `frontend/src/pages/Disclaimer.jsx` | MODIFICATO | Back button aggiunto |
| `frontend/src/pages/B2B.jsx` | MODIFICATO | BackNav aggiunto |
| `frontend/src/pages/OrgDashboard.jsx` | MODIFICATO | BackNav aggiunto |
| `frontend/src/pages/ClientDetail.jsx` | MODIFICATO | BackNav aggiunto (backTo="/org-dashboard") |

**Branch:** `feat/fix-routing-navigation` — in attesa di OK per merge su main.
