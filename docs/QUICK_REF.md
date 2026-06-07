# VinoInvest — Quick Reference

> Comandi essenziali per sviluppo, deploy e agent team.

## Dev locale

```bash
# Frontend (porta 5173)
cd frontend && npm run dev

# Backend (porta 3001)
cd backend && npm run dev

# Entrambi in parallelo
cd frontend && npm run dev & cd ../backend && npm run dev

# Build frontend
cd frontend && npm run build

# Test suite
bash test-all.sh        # 31 test — deve essere 31/31 PASS

# Test singolo endpoint
curl http://localhost:3001/api/wines?limit=3 | jq '.data | length'
curl http://localhost:3001/api/prices/1/history | jq '.history | length'
```

## Agent team

```bash
# Setup (prima volta)
chmod +x setup.sh launch.sh && ./setup.sh

# Ricarica env
source ~/.zshrc

# Avvia team (orchestratore)
./launch.sh team

# Sessione singola
./launch.sh solo

# Agenti isolati (worktrees)
./launch.sh frontend
./launch.sh backend
./launch.sh db

# Audit automatico
./launch.sh audit

# Monitor token (tab separato)
./launch.sh monitor
# oppure
node scripts/token-monitor.js
```

## Git worktrees

```bash
# Crea worktrees manualmente
git worktree add ../vinoinvest-agent-frontend -b agent-frontend
git worktree add ../vinoinvest-agent-backend  -b agent-backend
git worktree add ../vinoinvest-agent-db       -b agent-db

# Lista worktrees attivi
git worktree list

# Rimuovi worktree
git worktree remove ../vinoinvest-agent-frontend
git branch -d agent-frontend
```

## Deploy

```bash
# Push → Vercel autodeploy (frontend)
git push origin main

# Redeploy backend Render
curl -X POST "https://api.render.com/v1/services/SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY"

# Check Vercel deployment
gh run list --repo manumila88-pixel/vinoinvest-platform
```

## Plugin MCP — installazione

```bash
# PostgreSQL MCP
npm install -g @modelcontextprotocol/server-postgres

# Stripe MCP
npm install -g @stripe/mcp

# Filesystem MCP (debug locale)
npm install -g @modelcontextprotocol/server-filesystem

# Verifica installazioni
npx @modelcontextprotocol/server-postgres --version
npx @stripe/mcp --version
```

## Auth comandi

```bash
# GitHub CLI login
gh auth login

# Vercel CLI login
npx vercel login

# Supabase CLI login
npx supabase login

# Claude Code — imposta API key
export ANTHROPIC_API_KEY="sk-ant-XXXXXXXX"
echo 'export ANTHROPIC_API_KEY="sk-ant-XXXXXXXX"' >> ~/.zshrc
```

## Variabili d'ambiente richieste

| Variabile | Dove |
|-----------|------|
| `DATABASE_URL` | Render → vinoinvest_db → Connection String |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys |
| `VITE_BACKEND_URL` | `http://localhost:3001` (dev) / Render URL (prod) |

## URL di riferimento

| Servizio | URL |
|----------|-----|
| Frontend prod | vinoinvest-platform.vercel.app |
| Backend prod | vinoinvest-backend-2.onrender.com |
| GitHub repo | github.com/manumila88-pixel/vinoinvest-platform |
| Supabase | supabase.com/dashboard/project/xghuyfgftvrhnmuezbbz |

## Commit convention

```
feat(scope): add new feature
fix(scope): fix a bug
chore(scope): maintenance, deps
refactor(scope): code restructuring
test(scope): add or fix tests
docs(scope): documentation only

Scope examples: frontend, backend, db, auth, chat, pricing, ui
```

## Debug backend

```bash
# Log in tempo reale
cd backend && npm run dev 2>&1 | grep -v "GET /api/wines"

# Test agente AI
curl -X POST http://localhost:3001/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message":"analizza il mio portfolio","userId":"test","holdings":[]}'

# Test prezzi CellarTracker
curl "http://localhost:3001/api/wine-info/price?q=Petrus&vintage=2015"

# Reset cache prezzi
curl -X POST http://localhost:3001/api/prices/refresh
```

## Troubleshooting comune

| Problema | Soluzione |
|----------|-----------|
| Build fails | `cd frontend && npm install && npm run build` |
| Backend offline | Check Render dashboard — cold start ~30s |
| AI chat non risponde | Verifica `ANTHROPIC_API_KEY` nel backend .env |
| Immagini non caricano | Normali — fallback Unsplash attivo |
| DB timeout | Render PostgreSQL — max 5 connessioni simultanee |
| Worktree error | `git worktree prune` poi ricrea |
