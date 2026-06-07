#!/bin/bash
# ============================================================
#  install-autonomous.sh — VinoInvest Autonomous Agent Setup
#  Installa e configura il sistema completamente autonomo.
#  Esegui UNA VOLTA dalla root del progetto:
#    chmod +x install-autonomous.sh && ./install-autonomous.sh
# ============================================================

set -e
G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; B='\033[1;34m'; NC='\033[0m'
ok()   { echo -e "${G}[✓]${NC} $1"; }
warn() { echo -e "${Y}[!]${NC} $1"; }
info() { echo -e "${B}[→]${NC} $1"; }
err()  { echo -e "${R}[✗]${NC} $1"; exit 1; }

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  VinoInvest — Autonomous Agent System Setup    ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# ── Prerequisiti ─────────────────────────────────────────────
command -v node >/dev/null || err "Node.js richiesto (installa Node 20+)"
command -v git  >/dev/null || err "Git richiesto"
command -v gh   >/dev/null || warn "GitHub CLI non trovato — alcune funzioni autonome non funzioneranno. Installa: brew install gh"
ok "Prerequisiti OK"

# ── Claude Code ───────────────────────────────────────────────
if ! command -v claude &>/dev/null; then
  info "Installo Claude Code..."
  npm install -g @anthropic-ai/claude-code
  ok "Claude Code installato"
else
  ok "Claude Code già presente: $(claude --version 2>/dev/null || echo 'versione sconosciuta')"
fi

# ── Variabili d'ambiente ──────────────────────────────────────
RC="$HOME/.zshrc"
[ ! -f "$RC" ] && RC="$HOME/.bashrc"

add_env() {
  grep -q "^export $1=" "$RC" 2>/dev/null || echo "export $1=\"$2\"" >> "$RC"
}

add_env "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" "1"
add_env "CLAUDE_CODE_MAX_SUBAGENTS" "10"
ok "Variabili d'ambiente configurate in $RC"

# ── Struttura file ────────────────────────────────────────────
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
info "Root progetto: $REPO_ROOT"

mkdir -p "$REPO_ROOT/.claude/hooks"
mkdir -p "$REPO_ROOT/.github/workflows"
mkdir -p "$REPO_ROOT/agents"
mkdir -p "$REPO_ROOT/docs"
mkdir -p "$REPO_ROOT/scripts"

# Rendi eseguibili gli hooks
chmod +x "$REPO_ROOT/.claude/hooks/"*.js 2>/dev/null || true
ok "Struttura directory creata"

# ── GitHub Secrets (guida) ────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  GitHub Secrets richiesti (configura manualmente)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Vai su: github.com/[TUO_USERNAME]/vinoinvest/settings/secrets/actions"
echo "  Aggiungi questi secrets:"
echo ""
echo "  ANTHROPIC_API_KEY      → console.anthropic.com → API Keys"
echo "  DATABASE_URL           → Render dashboard → DB connection string"
echo "  VITE_SUPABASE_URL      → Supabase → Settings → API"
echo "  VITE_SUPABASE_ANON_KEY → Supabase → Settings → API"
echo ""
if command -v gh &>/dev/null && gh auth status &>/dev/null; then
  echo "  Oppure da terminale:"
  echo "  gh secret set ANTHROPIC_API_KEY"
  echo "  gh secret set DATABASE_URL"
  echo "  gh secret set VITE_SUPABASE_URL"
  echo "  gh secret set VITE_SUPABASE_ANON_KEY"
  echo ""
fi

# ── Worktrees per agent teams ─────────────────────────────────
info "Creo git worktrees per agent isolation..."
PARENT="$(dirname "$REPO_ROOT")"
for branch in agent-frontend agent-backend agent-db; do
  WT="$PARENT/vinoinvest-$branch"
  if [ ! -d "$WT" ]; then
    git -C "$REPO_ROOT" worktree add "$WT" -b "$branch" 2>/dev/null \
      || git -C "$REPO_ROOT" worktree add "$WT" "$branch" 2>/dev/null \
      || warn "Worktree $branch: già esiste o errore"
    ok "Worktree: $WT"
  else
    warn "Worktree già presente: $WT"
  fi
done

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  ✅  Setup completato!                         ║"
echo "╠════════════════════════════════════════════════╣"
echo "║                                                ║"
echo "║  Prossimi passi:                               ║"
echo "║  1. source ~/.zshrc                            ║"
echo "║  2. Aggiungi i GitHub Secrets (vedi sopra)     ║"
echo "║  3. git push → GitHub Actions si attivano      ║"
echo "║  4. Testa: commenta @claude su una PR          ║"
echo "║                                                ║"
echo "║  Plugin (esegui in sessione Claude Code):      ║"
echo "║  /plugin install feature-dev@claude-plugins-official"
echo "║  /plugin install code-review@claude-plugins-official"
echo "║  /plugin install supabase@claude-plugins-official"
echo "║  /plugin install vercel@claude-plugins-official"
echo "║  /plugin install github@claude-plugins-official"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
