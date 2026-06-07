#!/bin/bash
# ============================================================
#  VinoInvest — Multi-Agent Setup Script
#  Esegui una volta sola dalla root del progetto:
#  chmod +x setup.sh && ./setup.sh
# ============================================================

set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   VinoInvest — Agent System Setup v1.0   ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Prerequisiti ─────────────────────────────────────────────
command -v node >/dev/null 2>&1 || err "Node.js non trovato. Installa Node 18+."
command -v git  >/dev/null 2>&1 || err "Git non trovato."
NODE_V=$(node -v | cut -d'.' -f1 | tr -d 'v')
[ "$NODE_V" -lt 18 ] && err "Node 18+ richiesto. Versione attuale: $(node -v)"
log "Node $(node -v) ✓"

# ── Claude Code ───────────────────────────────────────────────
if ! command -v claude &>/dev/null; then
  warn "Claude Code non trovato — installo..."
  npm install -g @anthropic-ai/claude-code
  log "Claude Code installato"
else
  log "Claude Code $(claude --version 2>/dev/null || echo '') già installato"
fi

# ── GitHub CLI (gh) ───────────────────────────────────────────
if ! command -v gh &>/dev/null; then
  warn "GitHub CLI non trovato — installo via Homebrew..."
  command -v brew >/dev/null 2>&1 && brew install gh || warn "Homebrew non trovato — installa gh manualmente: https://cli.github.com"
else
  log "GitHub CLI $(gh --version | head -1) ✓"
fi

# ── Variabili d'ambiente ──────────────────────────────────────
ZSHRC="$HOME/.zshrc"
BASHRC="$HOME/.bashrc"
RC_FILE="$ZSHRC"
[ ! -f "$ZSHRC" ] && RC_FILE="$BASHRC"

add_env() {
  local key=$1 val=$2
  if ! grep -q "$key" "$RC_FILE" 2>/dev/null; then
    echo "export $key=\"$val\"" >> "$RC_FILE"
    export "$key"="$val"
    log "Aggiunto $key in $RC_FILE"
  else
    warn "$key già presente in $RC_FILE"
  fi
}

add_env "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" "1"
add_env "CLAUDE_CODE_MAX_SUBAGENTS"            "10"
add_env "CLAUDE_CODE_DISABLE_TELEMETRY"        "0"
# Decommenta e inserisci la tua chiave:
# add_env "ANTHROPIC_API_KEY" "sk-ant-XXXXXXXX"

# ── Struttura cartelle ────────────────────────────────────────
mkdir -p agents scripts docs .claude
log "Cartelle create: agents/ scripts/ docs/ .claude/"

# ── .claudeignore ─────────────────────────────────────────────
if [ ! -f .claudeignore ]; then
  cat > .claudeignore << 'IGNORE'
# Build & cache — nessun valore per gli agenti
node_modules/
dist/
build/
.next/
.vite/
coverage/
.nyc_output/

# Log — rumore puro
*.log
logs/
npm-debug.log*

# Env & secrets — MAI in contesto
.env
.env.*
!.env.example

# Asset binari — non leggibili
*.png
*.jpg
*.jpeg
*.gif
*.ico
*.woff
*.woff2
*.ttf
*.eot
*.mp4
*.webm

# Lock files — troppo lunghi, inutili per ragionamento
package-lock.json
yarn.lock
pnpm-lock.yaml

# IDE
.vscode/
.idea/
*.swp

# Dati di test — non caricare in contesto
*.sql
*.csv
*.json.gz

# Report di audit (generati, non utili come input)
AUDIT.md
FULL_AUDIT.md
PERFORMANCE_REPORT.md
RISK_REPORT.md
LAUNCH_READY.md
IGNORE
  log ".claudeignore creato"
else
  warn ".claudeignore già esistente — saltato"
fi

# ── Git worktrees (isolamento agenti) ─────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setup Git Worktrees (isolamento agenti)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if git rev-parse --git-dir > /dev/null 2>&1; then
  REPO_ROOT=$(git rev-parse --show-toplevel)
  PARENT=$(dirname "$REPO_ROOT")

  for branch in agent-frontend agent-backend agent-db; do
    WT_PATH="$PARENT/vinoinvest-$branch"
    if [ ! -d "$WT_PATH" ]; then
      git worktree add "$WT_PATH" -b "$branch" 2>/dev/null \
        || git worktree add "$WT_PATH" "$branch" 2>/dev/null \
        || warn "Worktree $branch già esiste o errore"
      log "Worktree creato: $WT_PATH"
    else
      warn "Worktree già esistente: $WT_PATH"
    fi
  done
else
  warn "Non sei in una repo git — worktrees saltati"
fi

# ── Script eseguibili ─────────────────────────────────────────
chmod +x launch.sh 2>/dev/null && log "launch.sh → eseguibile"
chmod +x setup.sh  2>/dev/null

echo ""
log "Setup completato!"
echo ""
echo "  Prossimi passi:"
echo "  1. source $RC_FILE"
echo "  2. ./launch.sh team    (avvia il team multi-agente)"
echo "  3. ./launch.sh solo    (sessione singola)"
echo "  4. ./launch.sh audit   (bug detection automatico)"
echo "  5. node scripts/token-monitor.js  (monitora token in un tab separato)"
echo ""
