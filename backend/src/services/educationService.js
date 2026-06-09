import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let _data = null;

function loadData() {
  if (_data) return _data;
  const filePath = join(__dirname, "../data/wine-education.json");
  _data = JSON.parse(readFileSync(filePath, "utf8"));
  return _data;
}

export function getModules() {
  const { modules } = loadData();
  return modules.map(({ id, slug, title, titleEn, difficulty, estimatedMinutes, summary }) => ({
    id,
    slug,
    title,
    titleEn,
    difficulty,
    estimatedMinutes,
    summary,
  }));
}

export function getModuleById(moduleId) {
  const { modules } = loadData();
  return modules.find((m) => m.id === moduleId || m.slug === moduleId) || null;
}

export function getChecklistForWine(options = {}) {
  const { moduleId = "authenticity" } = options;
  const module = getModuleById(moduleId);
  if (!module) return null;

  const result = { moduleId: module.id, title: module.title };

  if (module.topics) {
    result.topics = module.topics.map((t) => ({
      id: t.id,
      title: t.title,
      icon: t.icon,
      checklist: t.checklist,
      redFlags: t.redFlags,
    }));
  } else if (module.steps) {
    result.steps = module.steps.map((s) => ({
      id: s.id,
      order: s.order,
      title: s.title,
      icon: s.icon,
      questions: s.questions,
    }));
  }

  return result;
}

export function getQuickTips(category = null) {
  const { quickTips } = loadData();
  if (category) return quickTips.filter((t) => t.category === category);
  return quickTips;
}

export function getAntiCounterfeitTopics() {
  const module = getModuleById("authenticity");
  if (!module || !module.topics) return [];
  return module.topics.map(({ id, title, icon, description, redFlags, tips }) => ({
    id, title, icon, description, redFlags, tips,
  }));
}

export function getPreInvestmentChecklist() {
  const module = getModuleById("pre-investment");
  if (!module) return null;
  return { id: module.id, title: module.title, summary: module.summary, steps: module.steps };
}

export function getGlossaryTerms(search = null) {
  const module = getModuleById("reading-wine-docs");
  if (!module || !module.terms) return [];
  const terms = module.terms;
  if (!search) return terms;
  const q = search.toLowerCase();
  return terms.filter(
    (t) =>
      t.abbrev.toLowerCase().includes(q) ||
      t.full.toLowerCase().includes(q) ||
      t.it.toLowerCase().includes(q)
  );
}

export function getRegionalGuide() {
  const module = getModuleById("regional-guide");
  if (!module) return null;
  return { id: module.id, title: module.title, summary: module.summary, regions: module.regions };
}

export function getStorageRequirements() {
  const module = getModuleById("storage");
  if (!module) return null;
  return {
    id: module.id,
    title: module.title,
    summary: module.summary,
    parameters: module.parameters,
    professionalStorage: module.professionalStorage,
  };
}

export function getCommonMistakes() {
  const module = getModuleById("common-mistakes");
  if (!module) return null;
  return { id: module.id, title: module.title, summary: module.summary, mistakes: module.mistakes };
}

export function getEducationTopicsForKnowledgeBase() {
  const { modules } = loadData();
  return modules.map((m) => ({
    name: m.titleEn,
    nameIt: m.title,
    description: m.summary,
    slug: m.slug,
    difficulty: m.difficulty,
    estimatedMinutes: m.estimatedMinutes,
  }));
}
