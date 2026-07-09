#!/usr/bin/env node
/**
 * CAMBIO DOMINIO IN UN COMANDO.
 *
 *   node scripts/set-site-url.js https://vinoinvest.com
 *
 * Sostituisce il vecchio URL base con quello nuovo in:
 *   - tutti i file statici serviti (frontend/public/**: sitemap, robots.txt,
 *     pagine /vini/*.html, llms.txt, widget.js, security.txt, ...)
 *   - frontend/index.html (canonical, og, JSON-LD, hreflang)
 *   - i fallback nel codice (frontend/src/lib/constants.js, backend/src/config/site.js,
 *     scripts di generazione) — gli env VITE_SITE_URL (Vercel) e SITE_URL (Render)
 *     hanno comunque la precedenza a runtime.
 *   - chrome-extension e script di utilità.
 *
 * Il vecchio URL viene letto dal fallback in frontend/src/lib/constants.js,
 * quindi lo script è idempotente e riusabile per switch futuri.
 * Dopo l'esecuzione: vedi la checklist stampata in fondo (env, deploy, GSC).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");

const newUrl = (process.argv[2] || "").replace(/\/$/, "");
if (!/^https?:\/\/[^/\s]+$/.test(newUrl)) {
  console.error("Uso: node scripts/set-site-url.js https://nuovo-dominio.com");
  process.exit(1);
}

// Il vecchio URL è il fallback attuale in constants.js (fonte di verità)
const constantsPath = join(ROOT, "frontend/src/lib/constants.js");
const constantsSrc = readFileSync(constantsPath, "utf8");
const m = constantsSrc.match(/VITE_SITE_URL \|\| "(https?:\/\/[^"]+)"/);
if (!m) {
  console.error("Impossibile leggere l'URL corrente da frontend/src/lib/constants.js");
  process.exit(1);
}
const oldUrl = m[1].replace(/\/$/, "");
const oldHost = oldUrl.replace(/^https?:\/\//, "");
const newHost = newUrl.replace(/^https?:\/\//, "");

if (oldUrl === newUrl) {
  console.log(`L'URL è già ${newUrl} — niente da fare.`);
  process.exit(0);
}

const TEXT_EXT = new Set([".html", ".xml", ".txt", ".js", ".mjs", ".jsx", ".json", ".webmanifest", ".css", ".svg", ".md", ".sh"]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".claude", "dist", ".vite"]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (TEXT_EXT.has(extname(name)) || name === "robots.txt") acc.push(p);
  }
  return acc;
}

// File da riscrivere: tutto il servito statico + fallback nel codice + extra
const targets = [
  ...walk(join(ROOT, "frontend/public")),
  join(ROOT, "frontend/index.html"),
  constantsPath,
  join(ROOT, "backend/src/config/site.js"),
  join(ROOT, "scripts/generate-wine-pages.js"),
  join(ROOT, "scripts/ping-sitemaps.js"),
  join(ROOT, "frontend/scripts/gen-blog-data.mjs"),
  join(ROOT, "orchestrator.sh"),
  join(ROOT, "test-all.sh"),
  ...(existsSync(join(ROOT, "chrome-extension")) ? walk(join(ROOT, "chrome-extension")) : []),
];

let changedFiles = 0, changedOccurrences = 0;
for (const p of targets) {
  if (!existsSync(p)) continue;
  const src = readFileSync(p, "utf8");
  // prima l'URL completo, poi l'host nudo rimasto (es. testo in PDF/email)
  const out = src.split(oldUrl).join(newUrl).split(oldHost).join(newHost);
  if (out !== src) {
    const n = src.split(oldUrl).length - 1 + (src.split(oldUrl).join(newUrl).split(oldHost).length - 1);
    writeFileSync(p, out, "utf8");
    changedFiles++;
    changedOccurrences += n;
    console.log(`  ✏️  ${p.replace(ROOT + "/", "")} (${n})`);
  }
}

console.log(`\n✅ ${oldUrl} → ${newUrl}`);
console.log(`   ${changedOccurrences} occorrenze in ${changedFiles} file.\n`);
console.log(`CHECKLIST POST-SWITCH (vedi STATO_PROGETTO.md → CAMBIO DOMINIO):`);
console.log(`  1. Vercel  → env VITE_SITE_URL=${newUrl} + aggiungi dominio al progetto`);
console.log(`  2. Render  → env SITE_URL=${newUrl} (backend: link nelle email/PDF)`);
console.log(`  3. CORS: il vecchio dominio Vercel resta in allowlist (backend/src/server.js)`);
console.log(`  4. Commit + push → redeploy automatico`);
console.log(`  5. Google Search Console: verifica dominio + invia ${newUrl}/sitemap.xml`);
