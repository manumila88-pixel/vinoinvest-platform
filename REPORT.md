# REPORT — Dashboard Personalization

**Branch:** `feat/dashboard-personalization`
**Data:** 2026-06-15

---

## Funzionalità implementate

### 1. Preferenze centrali — `useUserPrefs` hook
**File:** `frontend/src/hooks/useUserPrefs.js`

Hook centrale che gestisce tutte le preferenze utente:
- `columns` — visibilità colonne nelle wine card (badges, aiScore, price, region, alert, links)
- `sections` — ordine e visibilità delle sezioni del menu di navigazione
- `notes` — note personali per vino (dizionario `{ wineId: "testo" }`)
- `savedFilters` — filtri mercato salvati (array `{ id, name, filters, savedAt }`)

**Persistenza:**
- `localStorage` per uso immediato anche senza login
- Sincronizzazione al backend `/api/user-prefs` (debounced 1500ms) quando l'utente è autenticato
- Al mount: carica dal backend e sovrascrive `localStorage` se l'utente è loggato

**VINCOLO rispettato:** Il hook controlla solo cosa l'utente vede, non i valori dei dati (AI Score, prezzi, punteggi restano invariati e server-side).

---

### 2. Colonne visibili nel mercato — `MarketColumnsPanel`
**File:** `frontend/src/components/MarketColumnsPanel.jsx`

Pulsante ⚙ con dropdown per toggle colonne:
- AI Score (barra + punteggio + segnale)
- Prezzo (bottiglia + fonte dati)
- Badge (rischio + trend)
- Regione (tag sotto produttore — off by default)
- Alert prezzo (input + alert attivi)
- Link esterni (Wine-Searcher, Vivino, Compare)

Posizione: nella toolbar del mercato, accanto a "Salva filtri".

---

### 3. Note personali sui vini — `WineNotesButton`
**File:** `frontend/src/components/WineNotesButton.jsx`

Pulsante ✎ integrato in ogni wine card:
- Apre popup textarea (max 500 caratteri)
- Mostra dot dorato se la nota esiste
- Ctrl+Enter per salvare, click esterno auto-salva
- Opzione "Elimina" per rimuovere la nota
- Si chiude automaticamente al click fuori

---

### 4. Wine card con colonne configurabili
**File:** `frontend/src/components/WineCard.jsx`

Modifiche:
- Aggiunto import `WineNotesButton`
- Nuove props: `visibleColumns = {}`, `note = ""`, `onNoteChange`
- Helper `col(key, defaultOn)` per leggere le preferenze con fallback
- Ogni sezione condizionale (badges, aiScore, price, region, alert, links)
- `WineNotesButton` aggiunto nelle azioni del card (accanto al pulsante watchlist)
- Comparatore memo aggiornato per includere `note` e `visibleColumns`

Default values garantiscono backward compatibility con qualsiasi WineCard non aggiornata.

---

### 5. Personalizzazione sezioni dashboard — `DashboardCustomizer`
**File:** `frontend/src/components/DashboardCustomizer.jsx`

Pulsante "⊟ Sezioni" nella sidebar B2C che apre un overlay:
- Toggle visibilità (checkbox dorata) per 8 sezioni
- Frecce ▲▼ per cambiare ordine
- Pulsante "Ripristina ordine" per tornare al default
- Messaggio chiarificatore: "Non modifica i dati visualizzati"

La sidebar B2C rende i bottoni dinamicamente in base all'ordine e visibilità in `userSections`.

---

### 6. Filtri salvati nel mercato
Nella toolbar del mercato (accanto a MarketColumnsPanel):
- Pulsante `+ Salva filtri` — salva i filtri correnti (ricerca + price range + tipo + annata) con un nome
- Chips ricaricabili per ogni filtro salvato (click per applicare, × per eliminare)
- Persistiti in localStorage + backend

---

### 7. Backend — `userPrefs` route
**File:** `backend/src/routes/userPrefs.js`

```
GET  /api/user-prefs      → restituisce { display_prefs, wine_notes, saved_filters }
POST /api/user-prefs      → upsert con merge parziale
```

**Tabella DB (auto-create):**
```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id       TEXT PRIMARY KEY,
  display_prefs JSONB NOT NULL DEFAULT '{}',
  wine_notes    JSONB NOT NULL DEFAULT '{}',
  saved_filters JSONB NOT NULL DEFAULT '[]',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
```

Entrambi gli endpoint richiedono `requireAuth` (Supabase JWT).

Registrato in `server.js`:
- Import: `import userPrefsRouter, { setUserPrefsPool } from "./routes/userPrefs.js"`
- Route: `app.use("/api/user-prefs", userPrefsRouter)`
- Pool: `setUserPrefsPool(pool)` nel blocco init

---

## File modificati/creati

| File | Tipo | Descrizione |
|------|------|-------------|
| `frontend/src/hooks/useUserPrefs.js` | NUOVO | Hook centrale preferenze |
| `frontend/src/components/MarketColumnsPanel.jsx` | NUOVO | Gear dropdown colonne mercato |
| `frontend/src/components/WineNotesButton.jsx` | NUOVO | Note personali su wine card |
| `frontend/src/components/DashboardCustomizer.jsx` | NUOVO | Panel reorder/hide sezioni |
| `frontend/src/components/WineCard.jsx` | MODIFICA | Props visibleColumns + note + onNoteChange |
| `frontend/src/App.jsx` | MODIFICA | Imports, hook call, sidebar dinamica, MarketColumnsPanel, saved filters, WineCard props |
| `backend/src/routes/userPrefs.js` | NUOVO | GET/POST /api/user-prefs |
| `backend/src/server.js` | MODIFICA | Import + registrazione route + pool |

---

## Vincoli rispettati

- L'utente sceglie cosa VEDERE, non può modificare i valori dei dati
- AI Score, prezzi, punteggi restano oggettivi e server-side
- Nessun merge su main
- Nessuna funzionalità esistente rotta (WineCard con `visibleColumns={}` si comporta come prima)
- Nessun Three.js, nessun dato inventato, zero mock

---

## Come testare

1. **Colonne mercato**: Tab Mercato → ⚙ Colonne → disabilitare "AI Score" → i punteggi scompaiono dalle card
2. **Note personali**: Cliccare ✎ su qualsiasi card → scrivere nota → salvare → il dot dorato appare
3. **Filtri salvati**: Applicare filtri nel mercato → "+ Salva filtri" → dare un nome → il chip appare e ricarica i filtri al click
4. **Sezioni sidebar**: Cliccare "⊟ Sezioni" nella sidebar → nascondere "Diario" → il bottone 📓 scompare dalla nav
5. **Persistenza**: Ricaricare la pagina → le preferenze sono mantenute (localStorage)
6. **Sync cross-device**: Riloggare da un browser diverso → le preferenze vengono caricate dal backend
