# Skill: deploy-verify

Dopo ogni push, verifica che il deploy funzioni end-to-end.
Riporta PASS o FAIL con dettagli specifici.

## Trigger

Invoca dopo ogni `git push origin main` o quando l'utente chiede
"verifica il deploy", "controlla che funzioni", "testa in produzione".

## Procedura di verifica

### 1. Backend (Render) — curl tests

```bash
BASE="https://vinoinvest-backend-2.onrender.com"

# Health check
curl -s $BASE/ | python3 -m json.tool

# Wines endpoint
curl -s "$BASE/api/wines?limit=3&search=lafite" | python3 -m json.tool | head -20

# Price history (deve avere ≥ 12 punti)
curl -s "$BASE/api/prices/lafite-2018/history?currentPrice=550" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'History points: {len(d[\"history\"])}')"

# AI Score
curl -s -X POST $BASE/api/ai-score \
  -H "Content-Type: application/json" \
  -d '{"id":"lafite-2018","name":"Lafite","producer":"Rothschild","vintage":2018,"currentPrice":550}' \
  | python3 -m json.tool | grep -E "score|signal|cached"

# Exchange rates
curl -s $BASE/api/rates | python3 -m json.tool | grep -E "USD|GBP"

# Dashboard analytics
curl -s $BASE/api/dashboard/analytics | python3 -m json.tool | grep -E "avgRoi|totalOrders"

# Alerts (deve rispondere 400 senza body, non 500)
curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/api/alerts \
  -H "Content-Type: application/json" -d '{}'
echo " (atteso: 400)"
```

### 2. Vercel build — verifica log

```bash
# Controlla ultimo deployment Vercel
gh api repos/manumila88-pixel/vinoinvest-platform/deployments \
  --jq '.[0] | {state: .environment, updated: .updated_at}' 2>/dev/null

# Oppure usa gh releases o checks
gh run list --limit 3
```

Segno di successo: `state: "production"` e nessun errore nel log.

### 3. Test funzionale (3 vini diversi)

Per ogni vino in `["lafite-2018", "romanee-conti-2015", "sassicaia-2016"]`:

```bash
WINE=$1
BASE="https://vinoinvest-backend-2.onrender.com"

echo "=== $WINE ==="

# Grafico: deve avere ≥ 6 punti
HISTORY=$(curl -s "$BASE/api/prices/$WINE/history?currentPrice=500")
POINTS=$(echo $HISTORY | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('history',[])))" 2>/dev/null)
[ "$POINTS" -ge 6 ] && echo "✅ Chart: $POINTS punti" || echo "❌ Chart: solo $POINTS punti"

# AI Score: deve avere score 0-100
SCORE=$(curl -s -X POST $BASE/api/ai-score -H "Content-Type: application/json" \
  -d "{\"id\":\"$WINE\",\"name\":\"$WINE\",\"currentPrice\":500}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('score','ERR'))" 2>/dev/null)
[[ "$SCORE" =~ ^[0-9]+$ ]] && echo "✅ AI Score: $SCORE" || echo "❌ AI Score: $SCORE"
```

### 4. Gzip attivo

```bash
curl -s -I -H "Accept-Encoding: gzip" \
  "https://vinoinvest-backend-2.onrender.com/api/wines?limit=5" \
  | grep -i "content-encoding"
# Atteso: Content-Encoding: gzip
```

## Report formato

```
## Deploy Verify — $(date)

**Backend**: PASS/FAIL
- Health: ✅/❌
- /api/wines: ✅/❌ (N risultati)
- /api/prices history: ✅/❌ (N punti)
- /api/ai-score: ✅/❌ (score=N)
- /api/rates: ✅/❌
- /api/dashboard: ✅/❌
- Gzip: ✅/❌

**Frontend (Vercel)**: PASS/FAIL
- Build: ✅/❌
- Ultimo deploy: [timestamp]

**Test 3 vini**:
- lafite-2018: Chart ✅ · Score ✅ · Bottle ✅
- romanee-conti-2015: Chart ✅ · Score ✅ · Bottle ✅
- sassicaia-2016: Chart ✅ · Score ✅ · Bottle ✅

**Verdict: PASS** / **Verdict: FAIL** (dettaglio problema)
```

## Se FAIL

1. Identifica quale endpoint/componente fallisce
2. Controlla i log Render: `https://dashboard.render.com`
3. Controlla i log Vercel build
4. Fixa il problema (usa skill auto-fix se serve)
5. Push fix e re-verifica
