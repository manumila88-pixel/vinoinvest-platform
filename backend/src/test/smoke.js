/**
 * Smoke test — validates all backend JS files parse without syntax errors.
 * Runs in CI via `npm test`. No DB or network required.
 */
import { execFileSync } from "child_process";
import { readdirSync, statSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..");

let pass = 0;
let fail = 0;

function walkJs(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "test") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walkJs(full); continue; }
    if (!entry.endsWith(".js")) continue;
    try {
      execFileSync(process.execPath, ["--check", full], { stdio: "pipe" });
      pass++;
    } catch (e) {
      console.error(`  ✗ SYNTAX ERROR: ${full}`);
      console.error(e.stderr?.toString()?.trim());
      fail++;
    }
  }
}

console.log("── Backend smoke test ──");
walkJs(SRC);

const serverSrc = readFileSync(join(SRC, "server.js"), "utf8");
const structural = [
  ["enrichmentJob registered in server.js", serverSrc.includes("enrichmentJob")],
  ["priceEstimate route registered",         serverSrc.includes("priceEstimateRouter")],
  ["alertsChecker registered",               serverSrc.includes("alertsChecker")],
  ["Sentry configured",                      serverSrc.includes("Sentry.init")],
];

for (const [label, ok] of structural) {
  if (ok) { console.log(`  ✓ ${label}`); pass++; }
  else     { console.error(`  ✗ ${label}`); fail++; }
}

console.log(`\n  ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
