# Skill: auto-fix

Rileva e corregge automaticamente errori comuni nel progetto VinoInvest.
Esegui `npm run build` dopo ogni modifica e fixa eventuali errori prima di procedere.

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
