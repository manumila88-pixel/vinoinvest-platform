#!/usr/bin/env node
/**
 * Enriches Academy premium module slides with dense professional content.
 * Uses Claude Haiku API to generate 150+ word slide bodies for courses 21-30.
 * Run: ANTHROPIC_API_KEY=sk-ant-... node src/scripts/enrichAcademyContent.js
 *
 * Output: enrichedModules.json — paste into premiumModules.js slides fields
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY not set. Run: ANTHROPIC_API_KEY=sk-ant-... node src/scripts/enrichAcademyContent.js");
  process.exit(1);
}

const client = new Anthropic({ apiKey: API_KEY });

async function enrichSlide(moduleTitle, slideTitle, currentBody, courseContext) {
  const prompt = `Sei un esperto di fine wine investing che scrive per wealth manager professionisti che pagano €19.99/mese per un corso B2B.

Scrivi il corpo di questa slide in modo professionale e denso. 150-180 parole.
Include: dati quantitativi reali (prezzi, percentuali, anni), case study brevissimo, framework operativo.
Tono: consulente esperto che parla a un professionista competente. No intro generiche.

Corso: ${courseContext}
Modulo: ${moduleTitle}
Titolo slide: ${slideTitle}
Testo attuale: ${currentBody}

Rispondi SOLO con il testo della slide (150-180 parole). Niente titolo, niente prefazione.`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  return msg.content[0].text.trim();
}

async function enrichDeepDive(moduleTitle, currentDd, courseContext) {
  const prompt = `Sei un esperto di fine wine investing. Scrivi un approfondimento professionale per wealth manager.
800-1000 parole. Stile ghost. Include: dati Liv-ex reali, case study con €€€ precisi, framework operativo immediato, 2-3 esempi concreti.
Tono: esperto che parla a un professionista che paga €19.99/mese. No intro generiche.

Corso: ${courseContext}
Modulo: ${moduleTitle}
Testo attuale (da espandere): ${currentDd}

Rispondi SOLO con il testo (800-1000 parole).`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  return msg.content[0].text.trim();
}

// Read current premiumModules.js to extract module titles and slides
// This script processes modules from courses 21-30 only
const COURSE_CONTEXTS = {
  21: "Servire Clienti HNW e Family Office",
  22: "Analytics B2B Avanzati",
  23: "Compliance e Regolamentazione",
  24: "Mercati Internazionali",
  25: "Wine Fund Management",
  26: "ESG e Sostenibilità nel Vino",
  27: "Masterclass con Dati Reali",
  28: "Automazione e AI nel Wine Investing",
  29: "Costruire un Business nel Wine Investment",
  30: "Certificazione Professionale Finale",
};

// Input: array of { courseId, moduleTitle, slides: [{ title, body }], deepDive }
// Output: enriched version
async function enrichModule(courseId, moduleTitle, slides, deepDive) {
  console.log(`  Enriching: ${moduleTitle} (course ${courseId})`);
  const ctx = COURSE_CONTEXTS[courseId] || `Corso ${courseId}`;

  const enrichedSlides = [];
  for (const slide of slides) {
    if (slide.body && slide.body.split(" ").length >= 120) {
      // Already rich enough
      enrichedSlides.push(slide);
      continue;
    }
    try {
      const enrichedBody = await enrichSlide(moduleTitle, slide.title, slide.body, ctx);
      enrichedSlides.push({ title: slide.title, body: enrichedBody });
      await new Promise(r => setTimeout(r, 200)); // rate limit
    } catch (e) {
      console.warn(`    Failed to enrich slide "${slide.title}": ${e.message}`);
      enrichedSlides.push(slide);
    }
  }

  let enrichedDd = deepDive;
  if (deepDive && deepDive.split(" ").length < 500) {
    try {
      enrichedDd = await enrichDeepDive(moduleTitle, deepDive, ctx);
    } catch (e) {
      console.warn(`    Failed to enrich deepDive: ${e.message}`);
    }
  }

  return { slides: enrichedSlides, deepDive: enrichedDd };
}

// Main: reads modules from JSON input or processes a specific course
async function main() {
  const inputFile = process.argv[2] || null;
  const targetCourse = parseInt(process.argv[3]) || null;

  if (!inputFile) {
    console.log(`
Usage: node enrichAcademyContent.js <modules.json> [courseId]

modules.json format:
[
  {
    "courseId": 21,
    "moduleTitle": "Anatomia del Cliente HNW",
    "slides": [{ "title": "Definizione HNW", "body": "..." }, ...],
    "deepDive": "..."
  },
  ...
]

Output: enrichedModules.json — replace slides/deepDive in premiumModules.js
    `);
    process.exit(0);
  }

  const modules = JSON.parse(readFileSync(inputFile, "utf-8"));
  const toProcess = targetCourse ? modules.filter(m => m.courseId === targetCourse) : modules;

  console.log(`Processing ${toProcess.length} modules...`);

  const results = [];
  for (const mod of toProcess) {
    const enriched = await enrichModule(mod.courseId, mod.moduleTitle, mod.slides, mod.deepDive);
    results.push({ ...mod, ...enriched });
  }

  const outPath = path.join(__dirname, "enrichedModules.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nDone! Results saved to ${outPath}`);
  console.log("Copy the enriched slides/deepDive back into premiumModules.js");
}

main().catch(console.error);
