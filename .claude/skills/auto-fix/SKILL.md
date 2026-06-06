# Skill: auto-fix

Rileva e corregge automaticamente errori comuni nel progetto VinoInvest.
Esegui `npm run build` dopo ogni modifica e fixa eventuali errori prima di procedere.

## Golden Rules

1. **Never break existing functionality** — test with `bash test-all.sh` before committing (target: 31/31)
2. **Never use Three.js** — SVG/CSS only
3. **Never use ResponsiveContainer** — fixed pixel width on ComposedChart
4. **Never mock data** — real DB + graceful fallback only
5. **Use Haiku for simple tasks** — `claude-haiku-4-5-20251001` for blog/scoring/batch; Sonnet only for portfolio deep analysis
6. **Apply cache_control on system prompts** — `{ type: "ephemeral" }` on any system prompt >100 tokens
7. **Batch API calls** — batchAnalyzeWines() for up to 10 wines per call

## Common Error Patterns

| Error | Fix |
|-------|-----|
| `set -e` kills `((PASS++))` | Use `set -uo pipefail` (no `-e`) |
| `toast.success is not a function` | Use `toast(msg, "success")` |
| `ResponsiveContainer` renders 0px | Remove it, use fixed pixel width |
| DB pool null | Check `DATABASE_URL` env var |
| Anthropic 401 | Set `ANTHROPIC_API_KEY` on Render |
| `Cannot find module` | Check ESM import paths have `.js` extension |

## Commit Format

```
feat|fix|perf|chore(scope): description
```

## Pre-Push Checklist

- [ ] `bash test-all.sh` → 31/31
- [ ] `cd frontend && npm run build` → no errors
- [ ] No API keys in git diff
- [ ] Env vars documented in MISSING_FEATURES.md

## Trigger

Invoca questa skill quando:
- Ricevi un errore di build o runtime
- Stai per fare un commit
- Hai modificato file frontend o backend

## Checklist errori da rilevare e correggere

### 1. WebGL / Three.js
- **Sintomo**: import di `three`, `@react-three/fiber`, `@react-three/drei`
- **Fix**: rimuovi import, sostituisci con `<Bottle3D>` (SVG) da `./components/Bottle3D`
- **Regola**: Three.js è rimosso definitivamente — MAI reintrodurlo

### 2. ResponsiveContainer (Recharts)
- **Sintomo**: `<ResponsiveContainer>` intorno a chart
- **Fix**: rimuovi wrapper, usa `ComposedChart` o `LineChart` con `width` fisso in pixel
- **Regola**: il chart deve avere `width={containerWidth}` calcolato con `useRef` + `offsetWidth`

### 3. Bottiglia SVG capovolta
- **Sintomo**: `<Bottle3D interactive={true}>` in wine card (non modal), oppure animazione `cssBottleSpin` su SVG flat
- **Fix**: passa `interactive={false}` nelle card, `interactive={true}` solo nel modal
- **Regola**: l'animazione `rotateY` su SVG 2D causa effetto "capovolta" a 180°; `backfaceVisibility: hidden` è già nel componente

### 4. currentPrice mancante
- **Sintomo**: `PriceHistoryChart` o `/api/prices/:id/history` chiamati senza `?currentPrice=X`
- **Fix**: passa sempre `wine.currentPrice` come prop e come query param
- **Regola**: senza `currentPrice`, il backend genera history con prezzo=100 (errato)

### 5. Import mancanti
- **Sintomo**: `ReferenceError: X is not defined` in build o runtime
- **Fix**: aggiungi import mancante nel file corretto
- **Pattern comune**: `useState`, `useEffect`, `useRef` da `react`; componenti da percorso relativo

### 6. recorded_at come Date object
- **Sintomo**: grafico mostra 1 solo punto invece di 12 mesi
- **Fix**: usa `new Date(p.recorded_at).toISOString().slice(0, 7)` invece di `p.recorded_at.slice(0, 7)`
- **Causa**: Postgres restituisce oggetti Date JS, non stringhe

### 7. Build errors generici
Dopo ogni modifica frontend:
```bash
cd frontend && npm run build
```
Se fallisce:
1. Leggi l'errore esatto
2. Identifica il file e la riga
3. Correggi
4. Rebuilda finché `✓ built in` appare senza errori

### 8. Port already in use
- **Sintomo**: `EADDRINUSE :::3000`
- **Fix**: `pkill -f "node src/server" && sleep 1` prima di riavviare

## Procedura completa

```
1. Leggi tutti i file modificati
2. Applica checklist sopra
3. cd frontend && npm run build
4. Se errori → fixa → torna al punto 3
5. cd backend && node --input-type=module (test import)
6. Commit solo se build verde
```
