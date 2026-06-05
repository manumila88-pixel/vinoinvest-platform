#!/bin/bash
# ============================================================
# VinoInvest Multi-Agent Orchestrator
# Uso: ./orchestrator.sh "descrizione obiettivo in italiano"
# ============================================================

set -euo pipefail

PROJECT_ROOT="/Users/manoelmilanesi/Downloads/vinoinvest-platform-ready"
AGENT_LOG_DIR="$HOME/.vinoinvest-agent/logs"
PLAN_FILE="$HOME/.vinoinvest-agent/plan.json"
STATUS_FILE="$HOME/.vinoinvest-agent/status.json"

# Colori terminale
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

# ──────────────────────────────────────────────
# CONTESTO PERMANENTE DI VINOINVEST
# ──────────────────────────────────────────────
read -r -d '' VINOINVEST_CONTEXT << 'CONTEXT_EOF' || true
## Contesto VinoInvest

**Progetto**: VinoInvest — piattaforma di investimento sul vino (aggregatore)
**Obiettivo**: Gli utenti non escono mai dalla piattaforma. Tutto avviene dentro.

**Stack tecnico**:
- Frontend: React + Vite → Vercel (vinoinvest-platform.vercel.app)
- Backend: Node.js + Express → Render (vinoinvest-backend-2.onrender.com)
- DB: PostgreSQL → Render (vinoinvest_db)
- Repo: github.com/manumila88-pixel/vinoinvest-platform
- Path locale: /Users/manoelmilanesi/Downloads/vinoinvest-platform-ready

**Credenziali DB** (solo per script locali, non committare):
- Host: dpg-d7ud9vnavr4c73cgvdhg-a.oregon-postgres.render.com
- User: vinoinvest_db_user
- DB: vinoinvest_db
- SSL: richiesto (rejectUnauthorized: false)

**Auth**: Supabase (xghuyfgftvrhnmuezbbz)
- VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY in .env del frontend

**Variabili d'ambiente Vercel**:
- VITE_BACKEND_URL = https://vinoinvest-backend-2.onrender.com
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

**Roadmap priorità** (seguire in ordine):
1. ✅ Stripe + PayPal + /pricing
2. ✅ Wine search API server-side + infinite scroll
3. ✅ Price history chart per tutti i vini
4. ✅ Three.js rimosso (SVG bottle), bundle -53%
5. → Login reale Supabase (IN CORSO)
6. AI Score reale con Claude API
7. Price alerts automatici (email/push)
8. Dashboard B2B per cantine/investitori
9. Stripe webhook live
10. AI Agent autonomo per acquisti

**Regole di sviluppo**:
- Nessun mock, nessun placeholder — solo codice funzionante
- Ogni fix deve essere testato prima del commit
- Git commit descrittivo in inglese (feat/fix/chore)
- Push solo quando il build passa
- Non rompere funzionalità esistenti
- Il price history chart usa ComposedChart senza ResponsiveContainer
- Three.js è stato rimosso — NON reintrodurlo
CONTEXT_EOF

# ──────────────────────────────────────────────
# ROADMAP COMPLETA (per pianificazione automatica)
# ──────────────────────────────────────────────
read -r -d '' ROADMAP << 'ROADMAP_EOF' || true
ROADMAP VINOINVEST (stato aggiornato):

COMPLETATI:
- Sistema pagamenti Stripe + PayPal + pagina /pricing
- Wine search API server-side con infinite scroll  
- Price history chart funzionante per tutti i vini
- Three.js rimosso, bundle -53%, SVG bottle
- Deploy Vercel + variabili d'ambiente configurate

DA FARE (in ordine):
5. Login reale Supabase:
   - supabase.auth.signUp/signInWithPassword/signOut
   - Session ripristino al mount con getSession()
   - onAuthStateChange per stato real-time
   - Protezione tab Portfolio/AI/Compare se non loggato
   - UI: tab Login/Registrati, loading spinner, messaggi errore

6. AI Score reale (Claude API):
   - Endpoint backend POST /api/ai-score con Anthropic SDK
   - Analisi vino: produttore, annata, rating critico, trend mercato
   - Score 0-100 con breakdown (liquidità, apprezzamento, rischio)
   - Cache in DB per non chiamare API ogni volta

7. Price alerts:
   - Tabella price_alerts in DB (user_id, wine_id, target_price, direction)
   - Cron job ogni ora: confronta prezzi e invia email (Resend API)
   - UI nella card vino: "Avvisami quando scende sotto €X"

8. Dashboard B2B:
   - Rotta /dashboard riservata agli utenti con ruolo "cantina"
   - Analytics: quali vini vengono guardati di più, ROI medio utenti
   - Possibilità di aggiungere vini e aggiornare prezzi

9. Stripe webhook live:
   - Endpoint POST /api/webhook/stripe con verifica firma
   - Aggiornamento ordini su checkout.session.completed
   - Email conferma acquisto

10. AI Agent acquisti:
    - Claude API con tool use per ricerca vini + esecuzione acquisto
    - Budget massimo configurabile dall'utente
    - Report settimanale automatico in email
ROADMAP_EOF

# ──────────────────────────────────────────────
# FUNZIONI UTILITÀ
# ──────────────────────────────────────────────

log() { echo -e "${CYAN}[$(date +%H:%M:%S)]${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }

init_dirs() {
  mkdir -p "$AGENT_LOG_DIR" "$HOME/.vinoinvest-agent"
}

check_claude_code() {
  if ! command -v claude &> /dev/null; then
    error "Claude Code non trovato. Installa con: npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
  success "Claude Code trovato: $(claude --version 2>/dev/null || echo 'ok')"
}

check_git() {
  cd "$PROJECT_ROOT"
  if [ -n "$(git status --porcelain)" ]; then
    warn "Ci sono modifiche non committate. Le agenti lavoreranno sul codice attuale."
  fi
  CURRENT_BRANCH=$(git branch --show-current)
  log "Branch corrente: $CURRENT_BRANCH"
}

# ──────────────────────────────────────────────
# GENERAZIONE PROMPT PER I TRE AGENTI
# ──────────────────────────────────────────────

build_frontend_prompt() {
  local GOAL="$1"
  cat << PROMPT_EOF
$VINOINVEST_CONTEXT

---

## Il tuo ruolo: AGENTE FRONTEND

Stai lavorando su: $PROJECT_ROOT/frontend

Il tuo obiettivo specifico per questa sessione:
> $GOAL

### Istruzioni operative:

1. **Analizza prima**: leggi i file rilevanti, capisci la struttura esistente
2. **Non rompere nulla**: il sito DEVE continuare a funzionare dopo le tue modifiche
3. **Coordina con backend**: se hai bisogno di nuovi endpoint, documentali in un file FRONTEND_NEEDS.md nella root del progetto
4. **Test visivo**: dopo ogni modifica, verifica che il componente si renderizzi correttamente
5. **Niente Three.js**: rimosso definitivamente, usa SVG/CSS
6. **Chart**: usa ComposedChart diretto (NO ResponsiveContainer) con width fisso

### File importanti frontend:
- src/App.jsx (main, 1000+ righe)
- src/WineBottle3DModal.jsx (modal dettaglio vino)
- src/components/PriceHistoryChart.jsx (grafico senza ResponsiveContainer)
- src/components/ (altri componenti)
- .env.local (variabili VITE_*)

### Quando hai finito:
- Fai git add e commit con messaggio "feat(frontend): [descrizione]"
- Scrivi un file FRONTEND_DONE.md con cosa hai fatto e cosa resta
- NON fare push — aspetta che l'agente orchestratore coordini

Inizia leggendo i file rilevanti, poi procedi con le modifiche.
PROMPT_EOF
}

build_backend_prompt() {
  local GOAL="$1"
  cat << PROMPT_EOF
$VINOINVEST_CONTEXT

---

## Il tuo ruolo: AGENTE BACKEND

Stai lavorando su: $PROJECT_ROOT/backend

Il tuo obiettivo specifico per questa sessione:
> $GOAL

### Istruzioni operative:

1. **Analizza prima**: leggi routes/, services/, index.js
2. **Compatibilità**: i nuovi endpoint devono essere backwards-compatible
3. **Gestione errori**: ogni endpoint deve avere try/catch e risposta JSON consistente
4. **Leggi FRONTEND_NEEDS.md** se esiste nella root — implementa gli endpoint richiesti dal frontend
5. **Non toccare endpoint esistenti** a meno che il goal non lo richieda esplicitamente

### File importanti backend:
- src/index.js (server principale)
- src/routes/ (tutte le routes API)
- src/services/priceService.js (logica prezzi)
- src/services/ (altri servizi)
- .env (variabili d'ambiente)

### Endpoint esistenti (NON modificare senza motivo):
- GET /api/wines — lista vini con filtri
- GET /api/prices/:wineId/history — storico prezzi
- POST /api/orders — crea ordine
- GET /api/orders/:userId — ordini utente
- POST /api/prices/refresh — aggiorna prezzo

### Quando hai finito:
- Testa ogni endpoint con curl
- Fai git add e commit "feat(backend): [descrizione]"
- Scrivi BACKEND_DONE.md con endpoints aggiunti, formato request/response
- NON fare push — aspetta il coordinamento

Inizia leggendo index.js e le routes esistenti.
PROMPT_EOF
}

build_db_prompt() {
  local GOAL="$1"
  cat << PROMPT_EOF
$VINOINVEST_CONTEXT

---

## Il tuo ruolo: AGENTE DB + TEST + QUALITÀ

Stai lavorando su: $PROJECT_ROOT

Il tuo obiettivo specifico per questa sessione:
> $GOAL

### Istruzioni operative:

1. **Schema DB**: verifica che le tabelle necessarie esistano, crea migrations se serve
2. **Seed data**: aggiungi dati di test realistici se mancano
3. **Test endpoint**: dopo che il backend finisce, testa tutti gli endpoint con curl
4. **Verifica integrazione**: il frontend chiama gli endpoint giusti con i dati giusti?
5. **Performance**: ci sono query lente? Aggiungi indici se serve

### Schema DB attuale (tabelle principali):
- wines (id, name, producer, vintage, current_price, investment_score, ...)
- price_history (id, wine_id, price, currency, source, recorded_at)
- price_cache (wine_id, vintage, price_avg, ...)
- orders (id, user_id, wine_id, quantity, price, status, created_at)

### Connessione DB locale per test:
\`\`\`bash
cd $PROJECT_ROOT/backend
DATABASE_URL='postgresql://vinoinvest_db_user:aL5g3wxLJ50FPaOozlNVkT8PJEzmJE2H@dpg-d7ud9vnavr4c73cgvdhg-a.oregon-postgres.render.com/vinoinvest_db?sslmode=require' node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query('SELECT COUNT(*) FROM wines').then(r => { console.log('Wines:', r.rows[0].count); pool.end(); });
"
\`\`\`

### Test backend:
\`\`\`bash
curl https://vinoinvest-backend-2.onrender.com/api/wines?limit=3
curl https://vinoinvest-backend-2.onrender.com/api/prices/margaux-2015/history?currentPrice=990
\`\`\`

### Quando hai finito:
- Scrivi DB_TEST_REPORT.md con: tabelle verificate, endpoint testati, risultati, problemi trovati
- Se hai fatto migrations, committale: "chore(db): [descrizione migration]"
- NON fare push autonomamente

Inizia verificando lo schema attuale e i dati esistenti.
PROMPT_EOF
}

build_coordinator_prompt() {
  local GOAL="$1"
  cat << PROMPT_EOF
$VINOINVEST_CONTEXT

---

## Il tuo ruolo: COORDINATORE FINALE

Gli altri tre agenti (frontend, backend, db/test) hanno completato il loro lavoro su:
> $GOAL

Il tuo compito è:
1. Leggi FRONTEND_DONE.md, BACKEND_DONE.md, DB_TEST_REPORT.md
2. Verifica che non ci siano conflitti tra le modifiche
3. Risolvi eventuali conflitti git (git merge --no-ff o manuale)
4. Fai un unico push finale: git push origin main
5. Verifica che Vercel stia ridepployando (controlla il build log)
6. Testa il sito live su vinoinvest-platform.vercel.app:
   - Apri 3 vini diversi → il grafico deve apparire
   - Testa il login se modificato
   - Testa la funzionalità principale dell'obiettivo
7. Scrivi DEPLOY_REPORT.md con:
   - Cosa è stato implementato
   - URL da testare
   - Problemi riscontrati (se ci sono)
   - Prossimi step consigliati dalla roadmap

Se qualcosa non funziona: crea un commit di fix immediato prima del push.

$ROADMAP
PROMPT_EOF
}

# ──────────────────────────────────────────────
# ESECUZIONE AGENTI IN PARALLELO
# ──────────────────────────────────────────────

run_agent() {
  local AGENT_NAME="$1"
  local PROMPT="$2"
  local LOG_FILE="$AGENT_LOG_DIR/${AGENT_NAME}_$(date +%Y%m%d_%H%M%S).log"
  
  log "Avvio agente ${BOLD}$AGENT_NAME${NC}..."
  
  # Esegui Claude Code con il prompt come input
  echo "$PROMPT" | claude --dangerously-skip-permissions \
    --print \
    2>&1 | tee "$LOG_FILE" &
  
  echo $! # restituisce PID per tracking
}

run_agents_parallel() {
  local GOAL="$1"
  
  echo ""
  echo -e "${BOLD}${BLUE}╔══════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${BLUE}║   VinoInvest Multi-Agent Orchestra   ║${NC}"
  echo -e "${BOLD}${BLUE}╚══════════════════════════════════════╝${NC}"
  echo ""
  log "Obiettivo: ${BOLD}$GOAL${NC}"
  echo ""

  # Genera i prompt
  FRONTEND_PROMPT=$(build_frontend_prompt "$GOAL")
  BACKEND_PROMPT=$(build_backend_prompt "$GOAL")
  DB_PROMPT=$(build_db_prompt "$GOAL")

  # Avvia i tre agenti in parallelo
  log "Avvio 3 agenti in parallelo..."
  echo ""

  # Scrivi i prompt su file temporanei (Claude Code legge stdin)
  TMPDIR_AGENT=$(mktemp -d)
  echo "$FRONTEND_PROMPT" > "$TMPDIR_AGENT/frontend.txt"
  echo "$BACKEND_PROMPT"  > "$TMPDIR_AGENT/backend.txt"
  echo "$DB_PROMPT"       > "$TMPDIR_AGENT/db.txt"

  # Apri tre finestre di terminale separate (macOS)
  echo -e "${CYAN}Apertura terminali separati per ogni agente...${NC}"
  
  # Agente Frontend
  osascript << APPLE_EOF
tell application "Terminal"
  do script "echo '🍷 AGENTE FRONTEND' && cd '$PROJECT_ROOT' && cat '$TMPDIR_AGENT/frontend.txt' | claude --dangerously-skip-permissions; echo '✅ Agente Frontend completato'; exec bash"
  set position of window 1 to {0, 0}
  set size of window 1 to {800, 600}
end tell
APPLE_EOF
  sleep 1

  # Agente Backend
  osascript << APPLE_EOF
tell application "Terminal"
  do script "echo '⚙️ AGENTE BACKEND' && cd '$PROJECT_ROOT' && cat '$TMPDIR_AGENT/backend.txt' | claude --dangerously-skip-permissions; echo '✅ Agente Backend completato'; exec bash"
  set position of window 1 to {820, 0}
  set size of window 1 to {800, 600}
end tell
APPLE_EOF
  sleep 1

  # Agente DB + Test
  osascript << APPLE_EOF
tell application "Terminal"
  do script "echo '🗄️ AGENTE DB+TEST' && cd '$PROJECT_ROOT' && cat '$TMPDIR_AGENT/db.txt' | claude --dangerously-skip-permissions; echo '✅ Agente DB+Test completato'; exec bash"
  set position of window 1 to {0, 620}
  set size of window 1 to {800, 600}
end tell
APPLE_EOF

  echo ""
  success "Tre agenti avviati in terminali separati"
  echo ""
  echo -e "${YELLOW}Quando tutti e tre hanno finito (vedi '✅ Agente X completato'),${NC}"
  echo -e "${YELLOW}torna qui e premi INVIO per avviare il coordinatore finale.${NC}"
  echo ""
  read -r -p "$(echo -e "${BOLD}Premi INVIO quando gli agenti hanno finito...${NC} ")"
  echo ""

  # Agente Coordinatore
  log "Avvio coordinatore finale..."
  COORDINATOR_PROMPT=$(build_coordinator_prompt "$GOAL")
  
  osascript << APPLE_EOF
tell application "Terminal"
  do script "echo '🎯 COORDINATORE FINALE' && cd '$PROJECT_ROOT' && echo '$COORDINATOR_PROMPT' | claude --dangerously-skip-permissions; echo '🚀 Deploy completato!'; exec bash"
  set position of window 1 to {820, 620}
  set size of window 1 to {800, 600}
end tell
APPLE_EOF

  echo ""
  success "Coordinatore avviato. Monitora il terminale in basso a destra."
  echo ""
  echo -e "${GREEN}Dopo il deploy, verifica su: https://vinoinvest-platform.vercel.app${NC}"
  echo ""

  # Pulizia
  rm -rf "$TMPDIR_AGENT"
}

# ──────────────────────────────────────────────
# COMANDO RAPIDO: solo un agente specifico
# ──────────────────────────────────────────────

run_single() {
  local AGENT="$1"
  local GOAL="$2"
  
  case "$AGENT" in
    frontend) PROMPT=$(build_frontend_prompt "$GOAL") ;;
    backend)  PROMPT=$(build_backend_prompt "$GOAL")  ;;
    db)       PROMPT=$(build_db_prompt "$GOAL")       ;;
    *)
      error "Agente '$AGENT' non riconosciuto. Usa: frontend, backend, db"
      exit 1
      ;;
  esac

  log "Avvio singolo agente: $AGENT"
  cd "$PROJECT_ROOT"
  echo "$PROMPT" | claude --dangerously-skip-permissions
}

# ──────────────────────────────────────────────
# MODALITÀ INTERATTIVA (senza argomenti)
# ──────────────────────────────────────────────

interactive_mode() {
  echo ""
  echo -e "${BOLD}${BLUE}VinoInvest Agent Orchestrator${NC}"
  echo ""
  echo "Cosa vuoi fare?"
  echo ""
  echo "  1) Prossimo punto della roadmap (automatico)"
  echo "  2) Obiettivo personalizzato"
  echo "  3) Solo agente frontend"
  echo "  4) Solo agente backend"
  echo "  5) Solo agente DB/test"
  echo ""
  read -r -p "Scelta [1-5]: " CHOICE
  echo ""

  case "$CHOICE" in
    1)
      GOAL="Implementa il punto 5 della roadmap: Login reale con Supabase. Seguire esattamente le specifiche nella roadmap. Non toccare i punti successivi."
      run_agents_parallel "$GOAL"
      ;;
    2)
      read -r -p "Descrivi l'obiettivo: " GOAL
      run_agents_parallel "$GOAL"
      ;;
    3)
      read -r -p "Obiettivo frontend: " GOAL
      run_single "frontend" "$GOAL"
      ;;
    4)
      read -r -p "Obiettivo backend: " GOAL
      run_single "backend" "$GOAL"
      ;;
    5)
      read -r -p "Obiettivo DB/test: " GOAL
      run_single "db" "$GOAL"
      ;;
    *)
      error "Scelta non valida"
      exit 1
      ;;
  esac
}

# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────

init_dirs
check_claude_code
check_git

if [ $# -eq 0 ]; then
  interactive_mode
elif [ $# -eq 1 ]; then
  # Comando singolo: ./orchestrator.sh "obiettivo"
  run_agents_parallel "$1"
elif [ $# -eq 2 ]; then
  # Agente specifico: ./orchestrator.sh frontend "obiettivo"
  run_single "$1" "$2"
else
  echo "Uso:"
  echo "  ./orchestrator.sh                        # modalità interattiva"
  echo "  ./orchestrator.sh 'obiettivo'            # 3 agenti paralleli"
  echo "  ./orchestrator.sh frontend 'obiettivo'   # solo frontend"
  echo "  ./orchestrator.sh backend 'obiettivo'    # solo backend"
  echo "  ./orchestrator.sh db 'obiettivo'         # solo db+test"
  exit 1
fi
