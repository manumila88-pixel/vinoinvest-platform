#!/bin/bash
# ============================================================
#  launch.sh — Avvio rapido agent team VinoInvest
#  Uso: ./launch.sh [modalità]
#  Modalità: solo | team | audit | monitor | frontend | backend | db
# ============================================================

MODE="${1:-team}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# ── Carica env ────────────────────────────────────────────────
[ -f "$ROOT/backend/.env" ] && set -a && source "$ROOT/backend/.env" && set +a
source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null || true

# Variabili obbligatorie agent teams
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
export CLAUDE_CODE_MAX_SUBAGENTS=10
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

echo "╔══════════════════════════════════════════╗"
echo "║   VinoInvest Agent Launcher              ║"
echo "║   Mode: $MODE                             "
echo "╚══════════════════════════════════════════╝"
echo ""
echo "  Root:   $ROOT"
echo "  Teams:  $CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS (max $CLAUDE_CODE_MAX_SUBAGENTS)"
echo ""

case "$MODE" in

  # ── Solo: sessione singola normale ──────────────────────────
  solo)
    echo "  Avvio sessione singola..."
    cd "$ROOT"
    exec claude --dangerously-skip-permissions
    ;;

  # ── Team: orchestratore + 3 agenti paralleli ───────────────
  team)
    echo "  Avvio team multi-agente (leggi agents/ORCHESTRATOR_PROMPT.md)"
    echo "  Copia il prompt e incollalo nella prima richiesta a Claude Code."
    echo ""
    cd "$ROOT"
    exec claude --dangerously-skip-permissions \
      --system "$(cat agents/ORCHESTRATOR_PROMPT.md 2>/dev/null || echo 'Sei l orchestratore VinoInvest. Leggi CLAUDE.md.')"
    ;;

  # ── Agente Frontend isolato ─────────────────────────────────
  frontend)
    WT="$(dirname "$ROOT")/vinoinvest-agent-frontend"
    if [ ! -d "$WT" ]; then
      git -C "$ROOT" worktree add "$WT" -b agent-frontend 2>/dev/null || true
    fi
    echo "  Avvio agente frontend in: $WT"
    cd "$WT"
    exec claude --dangerously-skip-permissions \
      --system "Sei l'agente Frontend di VinoInvest. Lavora solo su frontend/src/. Scrivi FRONTEND_DONE.md quando finisci."
    ;;

  # ── Agente Backend isolato ──────────────────────────────────
  backend)
    WT="$(dirname "$ROOT")/vinoinvest-agent-backend"
    if [ ! -d "$WT" ]; then
      git -C "$ROOT" worktree add "$WT" -b agent-backend 2>/dev/null || true
    fi
    echo "  Avvio agente backend in: $WT"
    cd "$WT"
    exec claude --dangerously-skip-permissions \
      --system "Sei l'agente Backend di VinoInvest. Lavora solo su backend/src/. Scrivi BACKEND_DONE.md con gli endpoint aggiunti."
    ;;

  # ── Agente DB isolato ───────────────────────────────────────
  db)
    WT="$(dirname "$ROOT")/vinoinvest-agent-db"
    if [ ! -d "$WT" ]; then
      git -C "$ROOT" worktree add "$WT" -b agent-db 2>/dev/null || true
    fi
    echo "  Avvio agente DB in: $WT"
    cd "$WT"
    exec claude --dangerously-skip-permissions \
      --system "Sei l'agente Database di VinoInvest. Analizza e ottimizza schema DB, indici e query. Scrivi DB_TEST_REPORT.md con i risultati."
    ;;

  # ── Audit automatico ────────────────────────────────────────
  audit)
    echo "  Avvio audit automatico codebase..."
    AUDIT_PROMPT="Esegui un audit completo del codebase VinoInvest.

Spawna 3 agenti in parallelo:

**Agent-Frontend**: analizza frontend/src/ cercando:
- console.log rimasti in produzione
- useEffect con dependency array sbagliato
- Componenti non memoizzati che causano re-render inutili
- Import non utilizzati
- Accessibilità (aria-label mancanti, contrasto colori)
Scrivi risultati in /tmp/audit-frontend.md

**Agent-Backend**: analizza backend/src/ cercando:
- Query N+1 (loop con query dentro)
- Endpoint senza autenticazione che la richiederebbero
- Missing try-catch su operazioni async
- Secrets hardcoded
- Rate limit assenti su endpoint critici
Scrivi risultati in /tmp/audit-backend.md

**Agent-DB**: analizza tutte le query cercando:
- Sequential scan su tabelle grandi (mancanza indici)
- Query potenzialmente lente (N+1, subquery non ottimizzate)
- Schema migliorabile (tipi dati, constraints mancanti)
Scrivi risultati in /tmp/audit-db.md

Alla fine, combina tutto in /tmp/AUDIT-REPORT.md con priorità Alta/Media/Bassa e stima effort di fix."

    cd "$ROOT"
    exec claude --dangerously-skip-permissions --print "$AUDIT_PROMPT"
    ;;

  # ── Monitor token ────────────────────────────────────────────
  monitor)
    echo "  Avvio token monitor (Ctrl+C per uscire)..."
    exec node "$ROOT/scripts/token-monitor.js"
    ;;

  # ── Test all ────────────────────────────────────────────────
  test)
    echo "  Esecuzione test-all.sh..."
    cd "$ROOT"
    exec bash test-all.sh
    ;;

  *)
    echo "Modalità non riconosciuta: $MODE"
    echo ""
    echo "Uso: ./launch.sh [modalità]"
    echo ""
    echo "  solo      — Sessione singola Claude Code"
    echo "  team      — Orchestratore + 3 agenti paralleli"
    echo "  frontend  — Agente frontend isolato (worktree)"
    echo "  backend   — Agente backend isolato (worktree)"
    echo "  db        — Agente database isolato (worktree)"
    echo "  audit     — Bug detection automatico su tutto il codebase"
    echo "  monitor   — Token monitor in tempo reale"
    echo "  test      — Esegui test-all.sh (31 test)"
    exit 1
    ;;
esac
