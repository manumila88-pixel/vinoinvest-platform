# REPORT — 3 User Types: B2C / B2B / CANTINA

**Branch:** `feat/user-types-b2c-b2b-cantina`
**Commit:** `2850d3c`
**Data:** 2026-06-14

---

## Cosa è stato fatto

### 3 esperienze utente distinte

| Tipo | Account type | viewMode | Colore tema |
|------|-------------|----------|-------------|
| B2C — Investitore individuale | `b2c` (default) | `"b2c"` | Gold `#C9A227` |
| B2B — Wealth manager / agenzia | `b2b`, `wealth_manager`, `family_office` | `"b2b"` | Blue `#60a5fa` |
| CANTINA — Produttore vinicolo | `cantina` | `"cantina"` | Amber `#d97706` |

---

## File creati (3 nuovi)

| File | Dimensione chunk | Cosa fa |
|------|-----------------|---------|
| `frontend/src/pages/WineryDashboard.jsx` | 9.86 kB | Dashboard cantina: stats, lista vini propri, quick actions |
| `frontend/src/pages/WineryProfile.jsx` | 12.63 kB | Profilo pubblico + editor campi (visibile agli investitori) |
| `frontend/src/pages/VintageStory.jsx` | 8.79 kB | Editor racconto annate → salvato in Supabase user_metadata |

---

## File modificati

| File | Cosa cambia |
|------|-------------|
| `frontend/src/App.jsx` | viewMode ternario, auth logic, sidebar 3-way, header 3-way, NextStepWidget, routes cantina, cantina dashboard block |
| `backend/src/server.js` | `?producer=` filter su `/api/wines` per filtrare per produttore esatto |

---

## Architettura viewMode

```
Supabase user_metadata.account_type
  "cantina"                    → setViewMode("cantina")
  "b2b" | "wealth_manager"
  | "family_office"            → setViewMode("b2b")
  qualsiasi altro              → setViewMode("b2c")
```

Admin toggle (dev/preview): ciclo 3-way nel header `b2c → b2b → cantina → b2c`

---

## Sidebar per tipo utente

### B2C (gold)
Dashboard · Market · Watchlist & Portfolio · Analysis · Academy · News · Blog

### B2B (blue)
Dashboard PRO · Market Intelligence · Clienti · Reports · Market · PortfolioAI · Portfolio · B2B Academy

### CANTINA (amber)
Dashboard · I Miei Vini (`/winery`) · Profilo Cantina (`/winery/profile`) · Racconto Annata (`/winery/vintage-story`) · Mercato Globale · Analytics

---

## Header per tipo utente

| viewMode | Badge | Border |
|----------|-------|--------|
| b2c | — | default |
| b2b | `B2B PRO` (blue) | `rgba(96,165,250,0.25)` |
| cantina | `CANTINA` (amber) | `rgba(217,119,6,0.25)` |

---

## NextStepWidget (B2C guided path)

Logica di stato → suggerimento contestuale:

```
watchlist vuota          → "Esplora il mercato"
watchlist ✓, no ordini  → "Fai il tuo primo investimento"
portfolio ✓, no Academy → "Inizia l'Academy"
tutto fatto              → null (componente non renderizzato)
```

---

## Nuove routes

```
/winery                  → WineryDashboard  (lazy)
/winery/profile          → WineryProfile    (lazy)
/winery/vintage-story    → VintageStory     (lazy)
/cantina/:producerName   → WineryProfile    (vista pubblica investitori)
```

---

## Persistenza dati cantina

Tutto via `supabase.auth.updateUser({ data: { ... } })` — nessuna migrazione DB:

```json
user_metadata: {
  "organization_name": "Tenuta XYZ",
  "account_type": "cantina",
  "winery_profile": {
    "displayName": "Tenuta XYZ",
    "location": "Barolo, CN",
    "founded": 1962,
    "hectares": 18,
    "description": "...",
    "philosophy": "...",
    "certifications": ["Bio", "Demeter"],
    "website": "...",
    "instagram": "@tenuta_xyz"
  },
  "vintage_stories": {
    "2021": { "story": "...", "harvest": "...", "notes": "...", "updatedAt": "..." },
    "2020": { ... }
  }
}
```

---

## Invarianti di dati rispettati

**AI Score e prezzi sono SEMPRE dati di mercato reali, non modificabili:**
- In `WineryDashboard`: colonne AI Score e Prezzo mostrate in read-only con badge "dati di mercato"
- In `WineryProfile`: tabella vini read-only con nota "fonte: Liv-ex / Wine-Searcher / algoritmo VinoInvest"
- In `VintageStory`: solo testo descrittivo, nota esplicita "AI Score, prezzi e dati di performance non sono modificabili dalla cantina"
- La cantina può scrivere solo: profilo editoriale, racconto annate, note tecniche per investitori

---

## Backend: filtro producer

Aggiunto parametro `?producer=` a `GET /api/wines`:

```
/api/wines?producer=Gaja&limit=50
```

- Cerca match parziale case-insensitive nel campo `producer`
- Complementare a `?search=` (che cerca su nome, regione, produttore insieme)
- Usato da `WineryDashboard` e `VintageStory` per caricare solo i vini della cantina

---

## Build

```
✓ 0 errori
✓ 0 warning critici
✓ WineryDashboard chunk: 9.86 kB
✓ WineryProfile chunk: 12.63 kB
✓ VintageStory chunk: 8.79 kB
✓ Build completata in 7.51s
```

---

## Cosa NON è stato fatto (per design)

- Nessun merge su `main`
- Nessuna modifica ad AI Score o prezzi per nessun tipo utente
- Nessuna nuova tabella DB (tutto in user_metadata Supabase)
- La B2B "vista densa" usa già il toggle `institutionalView` esistente (prezzo >€200, score 80+)

---

## Come testare

1. Usa il toggle admin nel header (⇄ B2B / ⇄ Cantina / ↩ B2C) per switchare la vista
2. **B2C**: controlla NextStepWidget sotto le stats (scomparirà man mano che completi le azioni)
3. **B2B**: sidebar blu, market con filtro istituzionale attivo
4. **CANTINA**: sidebar amber, naviga su `/winery` → dashboard cantina
5. Imposta `organization_name` nei metadati Supabase per caricare vini reali in WineryDashboard

---

## Come andare in produzione (quando vorrai)

1. Mergia `feat/user-types-b2c-b2b-cantina` → `main`
2. Vercel fa deploy automatico
3. Nel DB Supabase, aggiungi `account_type = 'cantina'` agli utenti cantina
4. Ogni cantina configura il proprio profilo su `/winery/profile`
