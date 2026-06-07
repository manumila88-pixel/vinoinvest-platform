#!/usr/bin/env node
// .claude/hooks/pre-write-guard.js
// Hook PreToolCall: blocca scrittura su file critici prima che avvenga

const path = require('path');
const filePath = process.argv[2] || '';
const base = path.basename(filePath);
const norm = filePath.replace(/\\/g, '/');

const BLOCKED_EXACT = [
  '.env', '.env.local', '.env.production', '.env.staging', '.env.test',
  'package.json', 'package-lock.json',
  'vite.config.js', 'vite.config.ts',
  'vercel.json',
];

const BLOCKED_PATTERNS = [
  /\.env\..+/,
  /secrets?\//,
  /private\//,
  /\.pem$/,
  /\.key$/,
  /\.cert$/,
];

if (BLOCKED_EXACT.includes(base)) {
  process.stderr.write(`[GUARD] BLOCKED: tentativo di scrivere "${filePath}" — file critico protetto\n`);
  process.exit(1);
}

for (const p of BLOCKED_PATTERNS) {
  if (p.test(norm)) {
    process.stderr.write(`[GUARD] BLOCKED: pattern protetto (${p}) — file: "${filePath}"\n`);
    process.exit(1);
  }
}

process.exit(0);
