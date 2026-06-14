# REPORT — Academy Corso 1 DeepDiveSection

**Branch:** `feat/academy-course1-deepdive`
**Commit:** `9d32600`
**Data:** 2026-06-14

---

## Cosa è stato fatto

### File creati (8 totali)

| File | Cosa fa |
|------|---------|
| `frontend/src/components/DeepDiveSection.jsx` | Componente principale: lazy-load con IntersectionObserver, albero espandibile per branch, MarketBlock live con tab, localStorage per tracking "letti" |
| `frontend/src/data/courseDeepDive/course1.js` | Registry dinamico: mappa lessonId → import() dei file dati |
| `frontend/src/data/courseDeepDive/lesson101.js` | "Dalla vigna alla bottiglia" — 7 branches, market Barolo live |
| `frontend/src/data/courseDeepDive/lesson102.js` | "Le sei varietà" — 7 branches, market 6-tab per varietà live |
| `frontend/src/data/courseDeepDive/lesson103.js` | "L'etichetta come documento" — 7 branches, market Sassicaia live |
| `frontend/src/data/courseDeepDive/lesson104.js` | "Rosso, bianco, Champagne" — 7 branches, market per categoria live |
| `frontend/src/data/courseDeepDive/lesson105.js` | "Sintesi Corso 1" — 6 branches, checklist investment-grade, market live |

### File modificati

| File | Cosa cambia |
|------|-------------|
| `frontend/src/pages/AcademyLesson.jsx` | +5 righe: import DeepDiveSection + sezione "APPROFONDIMENTO — ALBERO ESPANDIBILE" tra slides e charts |

---

## Architettura del componente

```
AcademyLesson (courseId, lessonId)
  └── DeepDiveSection
        ├── IntersectionObserver: lazy-load chunk solo quando si avvicina al viewport
        ├── import("../data/courseDeepDive/course1.js")  ← chunk separato 189 kB
        ├── ConceptCard: il concetto principale con icon, title, tagline, body
        ├── BranchTree: albero di 6-7 sotto-slide espandibili
        │     ├── header sempre presente (leggero: testo + icona)
        │     └── BranchBody montato SOLO all'apertura (lazy DOM)
        │           ├── question (corsivo dorato)
        │           ├── paragraphs (con **bold** inline, no innerHTML)
        │           └── takeaway (box accent)
        └── MarketBlock: vini reali dal DB
              ├── mode "single": una query unica (lezione 101)
              └── mode "tabs": tab per varietà (lezione 102, ecc.)
```

---

## Performance

- **Bundle:** `course1-Cq1FFMYY.js` separato da 189 kB (gzip 60 kB) — non carica mai nel bundle iniziale
- **DOM:** body di ogni branch non montato finché non aperto
- **API:** `MarketTab` chiama `/api/wines` solo per la tab attiva e solo quando la sezione è visibile
- **Build:** 0 errori, 0 warning su chunk size (limite 500 kB rispettato per tutti i chunk iniziali)

---

## Verifiche eseguite

- [x] `npm run build` passa, 0 errori
- [x] `sort=score` supportato backend (server.js:1024-1029)
- [x] `scoreMin` supportato backend (server.js:963)
- [x] `course1.js` appare come chunk separato nell'output di build
- [x] AcademyLesson.jsx integra DeepDiveSection con `courseId={course.id}` e `lessonId={lesson.id}`
- [x] Per corsi senza deep-dive (id ≠ 1) DeepDiveSection restituisce `null` silenzioso

---

## Cosa NON è stato fatto (per ordine esplicito)

- Corsi 2-30: nessun file `lesson2xx.js` / `course2.js` ecc.
- Nessun push su main o build/v2
- Nessuna modifica al backend

---

## Come vederlo sul sito

1. Mergia `feat/academy-course1-deepdive` → `main` (il push su main triggera deploy Vercel)
2. Vai su `vinoinvest-platform.vercel.app/academy/lesson/101` (o 102, 103, 104, 105)
3. Scrolla oltre le slide: appare la sezione **"🌳 APPROFONDIMENTO — ALBERO ESPANDIBILE"**
4. Il blocco **"📡 VEDI SUL MERCATO — DATI LIVE"** mostra vini reali dal DB

---

## Prossimi passi (quando vorrai)

Per estendere ai corsi 2-30 basta:
1. Aggiungere `N: () => import("../data/courseDeepDive/courseN.js")` in `COURSE_DEEP_DIVE` dentro `DeepDiveSection.jsx`
2. Creare i file dati `courseN.js` + `lessonNxx.js` con la stessa struttura
3. Nessuna modifica al resto dell'app
