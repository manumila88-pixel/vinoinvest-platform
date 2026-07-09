import express from "express";
import pg from "pg";
import crypto from "crypto";
import { ADMIN_EMAIL, checkCourseAccess, optionalAuth } from "../middleware/auth.js";
import {
  getModules,
  getModuleById,
  getChecklistForWine,
  getQuickTips,
  getAntiCounterfeitTopics,
  getPreInvestmentChecklist,
  getGlossaryTerms,
  getRegionalGuide,
  getStorageRequirements,
  getCommonMistakes,
} from "../services/educationService.js";

const router = express.Router();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function initAcademyTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS academy_progress (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        course_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        done BOOLEAN DEFAULT false,
        quiz_score INTEGER DEFAULT 0,
        xp_earned INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, lesson_id)
      );
      CREATE TABLE IF NOT EXISTS academy_certificates (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        course_id INTEGER NOT NULL,
        code VARCHAR(32) UNIQUE NOT NULL,
        user_name VARCHAR(255),
        issued_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_academy_progress_user ON academy_progress(user_id);
      CREATE INDEX IF NOT EXISTS idx_academy_cert_code ON academy_certificates(code);
    `);
    // Add missing columns if table was created without them
    await pool.query(`ALTER TABLE academy_progress ADD COLUMN IF NOT EXISTS done BOOLEAN DEFAULT false`);
  } catch (e) {
    console.error("Academy tables init:", e.message);
  }
}
initAcademyTables();

// GET /api/academy/access?email=&courseLevel=  — check if user can access a course tier
// Se arriva un Bearer token valido, l'email viene presa dal token (non dal query
// param, che è client-controlled). Il fallback ?email= resta per compatibilità
// col frontend attuale che non invia il token su questa chiamata.
router.get("/access", optionalAuth, async (req, res) => {
  const email = req.user?.email || req.query.email;
  const { courseLevel } = req.query;
  if (!email) return res.json({ hasAccess: false });
  try {
    const hasAccess = await checkCourseAccess(email, courseLevel || "investor", pool);
    res.json({ hasAccess, isAdmin: email === ADMIN_EMAIL });
  } catch (e) {
    res.json({ hasAccess: false });
  }
});

// GET /api/academy/progress/:userId
router.get("/progress/:userId", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT course_id, lesson_id, done, quiz_score, xp_earned, completed_at FROM academy_progress WHERE user_id = $1",
      [req.params.userId]
    );
    res.json({ progress: r.rows });
  } catch (e) {
    console.error("[academy]", e.message);
    res.status(500).json({ error: "Errore interno. Riprova." });
  }
});

// POST /api/academy/progress
router.post("/progress", async (req, res) => {
  try {
    const { userId, courseId, lessonId, quizScore, xpEarned } = req.body;
    if (!userId || !courseId || !lessonId) return res.status(400).json({ error: "Missing fields" });
    await pool.query(`
      INSERT INTO academy_progress (user_id, course_id, lesson_id, done, quiz_score, xp_earned, completed_at)
      VALUES ($1, $2, $3, true, $4, $5, NOW())
      ON CONFLICT (user_id, lesson_id) DO UPDATE
        SET done = true,
            quiz_score = GREATEST(academy_progress.quiz_score, $4),
            xp_earned = $5, completed_at = NOW()
    `, [userId, courseId, lessonId, quizScore || 0, xpEarned || 0]);
    res.json({ ok: true });
  } catch (e) {
    console.error("[academy]", e.message);
    res.status(500).json({ error: "Errore interno. Riprova." });
  }
});

// POST /api/academy/certificate
router.post("/certificate", async (req, res) => {
  try {
    const { userId, courseId, userName } = req.body;
    if (!userId || !courseId) return res.status(400).json({ error: "Missing fields" });
    const existing = await pool.query(
      "SELECT code FROM academy_certificates WHERE user_id = $1 AND course_id = $2",
      [userId, courseId]
    );
    if (existing.rows.length > 0) return res.json({ code: existing.rows[0].code });
    const code = crypto.randomBytes(16).toString("hex");
    await pool.query(
      "INSERT INTO academy_certificates (user_id, course_id, code, user_name) VALUES ($1, $2, $3, $4)",
      [userId, courseId, code, userName || "Studente"]
    );

    // Behavioral email trigger: course_complete
    pool.query(`SELECT email, first_name FROM users WHERE id = $1`, [userId])
      .then(async ({ rows: u }) => {
        if (u[0]?.email) {
          const { triggerBehavioralEmail } = await import("../services/emailFlowService.js");
          triggerBehavioralEmail(userId, u[0].email, u[0].first_name, "b2c", "course_completed", { courseName: courseId }).catch(() => {});
        }
      }).catch(() => {});

    res.json({ code });
  } catch (e) {
    console.error("[academy]", e.message);
    res.status(500).json({ error: "Errore interno. Riprova." });
  }
});

// GET /api/academy/verify/:code
router.get("/verify/:code", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM academy_certificates WHERE code = $1", [req.params.code]);
    if (!r.rows.length) return res.status(404).json({ valid: false });
    res.json({ valid: true, certificate: r.rows[0] });
  } catch (e) {
    console.error("[academy]", e.message);
    res.status(500).json({ error: "Errore interno. Riprova." });
  }
});

// ─── Educational endpoints (Agent E §2) ─────────────────────────────────────
// All endpoints are read-only, no DB access, no market data.

// GET /api/academy/education/modules  — list all educational modules
router.get("/education/modules", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json({ modules: getModules() });
});

// GET /api/academy/education/module/:moduleId  — full module content
router.get("/education/module/:moduleId", (req, res) => {
  const module = getModuleById(req.params.moduleId);
  if (!module) return res.status(404).json({ error: "Module not found" });
  res.set("Cache-Control", "public, max-age=3600");
  res.json({ module });
});

// GET /api/academy/education/checklist?module=authenticity  — visual checklist
router.get("/education/checklist", (req, res) => {
  const moduleId = req.query.module || "authenticity";
  const checklist = getChecklistForWine({ moduleId });
  if (!checklist) return res.status(404).json({ error: "Module not found" });
  res.set("Cache-Control", "public, max-age=3600");
  res.json(checklist);
});

// GET /api/academy/education/quick-tips?category=authenticity  — quick tip cards
router.get("/education/quick-tips", (req, res) => {
  const { category } = req.query;
  res.set("Cache-Control", "public, max-age=3600");
  res.json({ tips: getQuickTips(category || null) });
});

// GET /api/academy/education/anti-fake  — anti-counterfeit topic cards
router.get("/education/anti-fake", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json({ topics: getAntiCounterfeitTopics() });
});

// GET /api/academy/education/pre-investment  — investment checklist
router.get("/education/pre-investment", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json(getPreInvestmentChecklist());
});

// GET /api/academy/education/glossary?q=OWC  — glossary terms (optional search)
router.get("/education/glossary", (req, res) => {
  res.set("Cache-Control", "public, max-age=86400");
  res.json({ terms: getGlossaryTerms(req.query.q || null) });
});

// GET /api/academy/education/regions  — regional investment guide
router.get("/education/regions", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json(getRegionalGuide());
});

// GET /api/academy/education/storage  — storage requirements
router.get("/education/storage", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json(getStorageRequirements());
});

// GET /api/academy/education/common-mistakes  — 10 common mistakes
router.get("/education/common-mistakes", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json(getCommonMistakes());
});

export default router;
