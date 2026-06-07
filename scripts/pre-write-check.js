#!/usr/bin/env node
// scripts/pre-write-check.js — PreToolCall hook: blocks writes to critical files
// Invoked by .claude/settings.json PreToolCall Write hook
// Exit 0 = allow, Exit 1 = block

const BLOCKED_PATTERNS = [
  /^\.env$/,
  /^\.env\./,
  /\/\.env$/,
  /\/\.env\./,
  /backend\/\.env$/,
  /frontend\/\.env$/,
  /frontend\/\.env\.local$/,
  /\.env\.production$/,
  /\.env\.staging$/,
];

const WARN_PATTERNS = [
  /package\.json$/,
  /vite\.config\.(js|ts)$/,
  /tsconfig\.json$/,
];

const filePath = process.argv[2] || process.env.CLAUDE_TOOL_INPUT_PATH || "";

if (!filePath) {
  // No path provided — allow
  process.exit(0);
}

for (const pattern of BLOCKED_PATTERNS) {
  if (pattern.test(filePath)) {
    console.error(`[pre-write-check] BLOCKED: ${filePath}`);
    console.error(`  Questo file contiene secrets o è protetto.`);
    console.error(`  Modifica manualmente se necessario.`);
    process.exit(1);
  }
}

for (const pattern of WARN_PATTERNS) {
  if (pattern.test(filePath)) {
    console.warn(`[pre-write-check] WARN: modifica di file critico — ${filePath}`);
    // Allow but log
  }
}

// Allow
process.exit(0);
