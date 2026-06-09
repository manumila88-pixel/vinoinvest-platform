# AGENT_G_V2_DONE — Performance Frontend

**Branch:** `build/v2`
**File toccato:** `frontend/vite.config.js` (solo questo, come da contratto §2)

---

## Bundle: Baseline vs After

| Chunk | Before | After | Δ gzip |
|-------|--------|-------|--------|
| `academy` | 514.98 kB / **149 kB gzip** | 67.73 kB / **16 kB gzip** | **−89%** |
| `academy-modules` | 269.74 kB / **88 kB gzip** | 59.17 kB / **17 kB gzip** | **−80%** |
| `academy-data` | — | 169.28 kB / 56 kB gzip | new cacheable chunk |
| `academy-premium-data` | — | 242.87 kB / 80 kB gzip | new cacheable chunk |
| `faq-data` | — | 26.86 kB / 9 kB gzip | new cacheable chunk |
| `supabase` | — (in-lined) | 199.77 kB / 51 kB gzip | new cacheable chunk |
| `recharts` | 382.33 kB / 109 kB gzip | 382.33 kB / 109 kB gzip | unchanged |
| `index` | 236.49 kB / 68 kB gzip | 237.17 kB / 68 kB gzip | unchanged |

**Warning 500 kB:** 1 chunk over limit prima → **0 chunks over limit dopo** ✅

---

## Cosa è stato fatto

### 1. Migrazione da `rollupOptions.manualChunks` a `rolldownOptions.output.codeSplitting`

Vite 8 usa **Rolldown** (non Rollup) come bundler. In Rolldown, `manualChunks` non può
estrarre le dipendenze sincrone di chunk dinamici in chunk separati — le assegnazioni
venivano silenziosamente ignorate. L'API nativa è `rolldownOptions.output.codeSplitting.groups`
(simile a `optimization.splitChunks.cacheGroups` di webpack).

### 2. Split dei file dati pesanti

- `academyContent.js` (181 kB raw): era bundlato nel chunk `academy` (514 kB). Ora ha il suo
  chunk `academy-data` (169 kB). I 4 file di pagina Academy (UI) scendono a 67 kB.
- `premiumContent.js` (187 kB) + `premiumModules.js` (77 kB): erano in `academy-modules`
  (269 kB). Ora in `academy-premium-data` (242 kB). La UI di AcademyModule scende a 59 kB.
- `faq.js` (33 kB): era bundlato dentro `b2b`/`HelpBot`. Ora chunk separato (26 kB).

**Beneficio cache:** questi file dati cambiano raramente vs il codice UI → su revisit,
il browser riusa il chunk dati dalla cache anche dopo un aggiornamento UI.

### 3. Vendor chunks

- `supabase` estratto automaticamente da Rolldown come chunk cacheable (199 kB).
- `recharts` mantenuto nel suo chunk (382 kB invariato).
- `react-vendor` include react-dom + react-router (219 kB, era 178 kB con manualChunks —
  Rolldown raggruppa più sub-dependencies di react-dom rispetto a Rollup).

### 4. assetsInlineLimit: 8192

Aumentato da 4 kB (default) a 8 kB. Le icone SVG e le immagini piccole sotto 8 kB vengono
inlineate come data URI, riducendo le richieste HTTP per piccoli asset.

### 5. Lazy loading — già presente

Le route erano già tutte lazy (`React.lazy`) in `App.jsx`. Non modificato.

### 6. Immagini — già presente

`WineCard.jsx` usa già `loading="lazy"` sulle `<img>`. Non modificato.

---

## Nuove dipendenze installate

**Nessuna.** Solo configurazione Vite.

---

## Note per il merge

- Nessun conflitto atteso: solo `frontend/vite.config.js` è stato modificato.
- Il `dist/` non va committato (è in `.gitignore`).
- Se un altro agente tocca `frontend/vite.config.js`, risolvere il conflitto mantenendo
  entrambe le sezioni (vendor chunks + data chunks).

---

## Ottimizzazioni future (non installate — richiedono `npm install`)

1. **`vite-plugin-image-optimizer`** — conversione WebP automatica a build time.
   `npm install -D vite-plugin-image-optimizer sharp` → aggiungere al `plugins:[]` in vite.config.js.
2. **`rollup-plugin-visualizer`** — bundle analyzer visuale.
   `npm install -D rollup-plugin-visualizer`
3. **Lazy load `recharts`** — ridurre il carico iniziale di 382 kB: spostare
   le importazioni recharts da `App.jsx` a `PriceHistoryChart.jsx` (evitare import statici
   nel entry point). Richiede modifica App.jsx (fuori scope Agent G).
