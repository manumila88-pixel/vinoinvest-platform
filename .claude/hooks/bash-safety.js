#!/usr/bin/env node
// .claude/hooks/bash-safety.js
// Hook PreToolCall: blocca comandi bash distruttivi

const cmd = (process.argv[2] || '').toLowerCase().trim();

const BLOCKED = [
  /rm\s+-rf\s+\//,
  /rm\s+-rf\s+~/,
  /rm\s+-rf\s+\.git/,
  /git\s+push\s+--force\s+origin\s+main/,
  /git\s+push\s+-f\s+origin\s+main/,
  /drop\s+table/i,
  /delete\s+from\s+\w+\s+where\s+1\s*=\s*1/i,
  /truncate\s+table/i,
  /curl\s+.*\|\s*(?:bash|sh)/,
  /wget\s+.*\|\s*(?:bash|sh)/,
  /sudo\s+rm/,
  /chmod\s+777/,
];

for (const pattern of BLOCKED) {
  if (pattern.test(cmd)) {
    process.stderr.write(`[SAFETY] BLOCKED: comando pericoloso bloccato\n  Cmd: ${cmd.slice(0, 120)}\n`);
    process.exit(1);
  }
}

process.exit(0);
