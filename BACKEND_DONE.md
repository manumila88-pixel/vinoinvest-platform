# BACKEND_DONE — Roadmap Point 5 + AI Score

## Endpoints aggiunti

### Auth (Supabase JWT)

**GET /api/auth/me**
- Header: `Authorization: Bearer <supabase_access_token>`
- Returns: `{ id, email, created_at, account_type }`
- 401 se token non valido o assente

### AI Score (Claude API)

**POST /api/ai-score**
- Body: `{ id, name, producer, vintage, region, criticScore, marketTrend, risk, currentPrice }`
- Returns:
```json
{
  "wineId": "...",
  "score": 81,
  "breakdown": {
    "vintage": 62,
    "producer": 85,
    "market": 82,
    "critic": 95,
    "risk_adjusted": 80
  },
  "signal": "Strong Buy",
  "reasoning": "...",
  "cached": false
}
```
- Cache in DB: tabella `ai_scores`, scade dopo 7 giorni
- Fallback algoritmico se `ANTHROPIC_API_KEY` non configurata

## File creati

- `src/middleware/auth.js` — Supabase JWT middleware (requireAuth, optionalAuth)
- `src/routes/auth.js` — GET /api/auth/me
- `src/routes/aiScore.js` — POST /api/ai-score
- `src/services/aiScoreService.js` — Claude Haiku + DB cache

## Variabili d'ambiente aggiunte a .env

```
SUPABASE_URL=https://xghuyfgftvrhnmuezbbz.supabase.co
SUPABASE_ANON_KEY=<anon key>
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE   ← da impostare
```

## Frontend aggiornato

- `App.jsx`: stato `aiScores`, fetch AI score per ogni wine card caricata
- Wine card mostra score reale + signal colorato (Strong Buy verde, Buy gold)
- `WineBottle3DModal.jsx`: breakdown a barre nel modal + reasoning dell'AI
- Modal passa `aiScoreData` al modal quando si apre una wine card

## Tabella DB nuova

```sql
CREATE TABLE ai_scores (
  wine_id TEXT PRIMARY KEY,
  score INTEGER NOT NULL,
  breakdown JSONB NOT NULL,
  signal TEXT,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
)
```

## Note

- La tabella `ai_scores` viene creata automaticamente al primo request
- Senza `ANTHROPIC_API_KEY`, lo score è algoritmico (critico + vintage + trend + rischio)
- Con `ANTHROPIC_API_KEY` impostata: usa claude-haiku-4-5-20251001
- Il frontend usa `fetchedAIRef` per non refetchare score già caricati
