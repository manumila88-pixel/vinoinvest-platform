#!/usr/bin/env node
// scripts/token-monitor.js — Real-time token usage monitor for Claude Code sessions
// Usage: node scripts/token-monitor.js
// Exit: Ctrl+C

import { readFileSync, readdirSync, statSync, watchFile } from "fs";
import { join, homedir } from "path";

const LOGS_DIR = join(homedir(), ".claude", "logs");
const REFRESH_MS = 3000;

const PRICING = {
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "claude-opus-4-8":   { input: 15.0, output: 75.0 },
  "claude-haiku-4-5":  { input: 0.25, output: 1.25 },
};

function clearLine() { process.stdout.write("\r\x1b[K"); }
function moveCursor(n) { process.stdout.write(`\x1b[${n}A`); }

function readLatestSession() {
  let files;
  try {
    files = readdirSync(LOGS_DIR)
      .filter(f => f.endsWith(".jsonl"))
      .map(f => ({ name: f, mtime: statSync(join(LOGS_DIR, f)).mtime }))
      .sort((a, b) => b.mtime - a.mtime);
  } catch {
    return null;
  }

  if (!files.length) return null;
  const latest = files[0];

  let lines;
  try {
    lines = readFileSync(join(LOGS_DIR, latest.name), "utf8")
      .split("\n")
      .filter(Boolean);
  } catch {
    return null;
  }

  let totalInput = 0, totalOutput = 0, totalCache = 0;
  let model = "claude-sonnet-4-6";
  let turns = 0;
  let lastActivity = null;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      if (entry.model) model = entry.model;

      // OpenAI-style usage
      if (entry.usage) {
        totalInput  += entry.usage.input_tokens  || entry.usage.prompt_tokens     || 0;
        totalOutput += entry.usage.output_tokens || entry.usage.completion_tokens || 0;
        totalCache  += entry.usage.cache_read_input_tokens || 0;
        turns++;
        if (entry.created_at || entry.timestamp) {
          lastActivity = new Date((entry.created_at || entry.timestamp) * 1000 || entry.timestamp);
        }
      }
    } catch { /* skip malformed lines */ }
  }

  const pricing = PRICING[model] || PRICING["claude-sonnet-4-6"];
  const costInput  = (totalInput  / 1_000_000) * pricing.input;
  const costOutput = (totalOutput / 1_000_000) * pricing.output;
  const costCache  = (totalCache  / 1_000_000) * (pricing.input * 0.1); // cache reads at 10%
  const totalCost  = costInput + costOutput + costCache;

  return {
    file: latest.name,
    model,
    turns,
    totalInput,
    totalOutput,
    totalCache,
    costInput,
    costOutput,
    totalCost,
    lastActivity,
  };
}

function bar(value, max, width = 20) {
  const filled = Math.round((value / Math.max(max, 1)) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

let prevLines = 0;
let baseline = null;

function render() {
  const data = readLatestSession();

  if (!data) {
    if (prevLines) { moveCursor(prevLines); }
    const lines = [
      "┌─────────────────────────────────────────┐",
      "│  Claude Code — Token Monitor             │",
      "│  Nessun log trovato in ~/.claude/logs/   │",
      "│  Avvia una sessione Claude Code prima.   │",
      "└─────────────────────────────────────────┘",
    ];
    process.stdout.write(lines.join("\n") + "\n");
    prevLines = lines.length;
    return;
  }

  if (!baseline) baseline = { input: data.totalInput, output: data.totalOutput, cost: data.totalCost };

  const sessionInput  = data.totalInput  - baseline.input;
  const sessionOutput = data.totalOutput - baseline.output;
  const sessionCost   = data.totalCost   - baseline.cost;

  const maxTokens = 200_000;
  const contextPct = Math.min(100, Math.round((data.totalInput / maxTokens) * 100));

  const now = new Date();
  const timeStr = now.toLocaleTimeString("it-IT");
  const activity = data.lastActivity
    ? `${Math.round((now - data.lastActivity) / 1000)}s fa`
    : "—";

  const lines = [
    "┌─────────────────────────────────────────────────┐",
    `│  Claude Code — Token Monitor  [${timeStr}]     │`,
    `│  Sessione: ${data.file.slice(0, 36).padEnd(36)} │`,
    `│  Modello:  ${data.model.padEnd(36)} │`,
    "├─────────────────────────────────────────────────┤",
    `│  Input tokens  : ${fmt(data.totalInput).padStart(7)} ${bar(data.totalInput, maxTokens)}     │`,
    `│  Output tokens : ${fmt(data.totalOutput).padStart(7)} ${bar(data.totalOutput, 50000)}     │`,
    `│  Cache read    : ${fmt(data.totalCache).padStart(7)}                         │`,
    `│  Turns         : ${String(data.turns).padStart(7)}                         │`,
    "├─────────────────────────────────────────────────┤",
    `│  Contesto usato: ${String(contextPct).padStart(3)}%  [${bar(contextPct, 100, 30)}]  │`,
    "├─────────────────────────────────────────────────┤",
    `│  Costo sessione: $${data.totalCost.toFixed(4).padStart(8)}                      │`,
    `│    ↳ input     : $${data.costInput.toFixed(4).padStart(8)}                      │`,
    `│    ↳ output    : $${data.costOutput.toFixed(4).padStart(8)}                      │`,
    `│  Dal monitor   : $${sessionCost.toFixed(4).padStart(8)} (↑${fmt(sessionInput)} in / ↑${fmt(sessionOutput)} out) │`,
    "├─────────────────────────────────────────────────┤",
    `│  Ultima attività: ${activity.padEnd(29)} │`,
    "└─────────────────────────────────────────────────┘",
    "  Aggiornamento ogni 3s — Ctrl+C per uscire",
  ];

  if (prevLines) moveCursor(prevLines);
  process.stdout.write(lines.join("\n") + "\n");
  prevLines = lines.length;
}

console.clear();
console.log("  Avvio token monitor...\n");
render();
setInterval(render, REFRESH_MS);

process.on("SIGINT", () => {
  console.log("\n\n  Monitor terminato.\n");
  process.exit(0);
});
