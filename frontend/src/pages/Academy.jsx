import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { COURSES, PREMIUM_COURSES, PATHWAYS, ASSESSMENT_QUESTIONS, LEVELS, XP_RULES, BADGES } from "../data/academyContent";

const BG = "#0b1220";
const PROGRESS_KEY = "vino_academy_v1";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}

function getTotalXP(progress) {
  return Object.values(progress).reduce((sum, l) => sum + (l.xp || 0), 0);
}

function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

function getCourseProgress(courseId, progress) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return 0;
  const done = course.lessons.filter(l => progress[l.id]?.done).length;
  return Math.round((done / course.lessons.length) * 100);
}

export default function Academy() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadProgress);
  const [tab, setTab] = useState("home");
  const [filter, setFilter] = useState("tutti");
  const [assessmentStep, setAssessmentStep] = useState(null);
  const [assessAnswers, setAssessAnswers] = useState([]);
  const [suggestedPathway, setSuggestedPathway] = useState(null);

  const xp = getTotalXP(progress);
  const level = getLevel(xp);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const xpToNext = nextLevel ? nextLevel.minXP - xp : 0;
  const levelPct = nextLevel ? Math.round(((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100) : 100;

  const completedCourses = COURSES.filter(c =>
    c.lessons.every(l => progress[l.id]?.done)
  );

  function handleAssessAnswer(pathwayId) {
    const next = [...assessAnswers, pathwayId];
    setAssessAnswers(next);
    if (next.length === ASSESSMENT_QUESTIONS.length) {
      const counts = {};
      next.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
      const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setSuggestedPathway(best);
      setAssessmentStep("result");
    } else {
      setAssessmentStep(assessmentStep + 1);
    }
  }

  const allCourses = tab === "premium"
    ? PREMIUM_COURSES
    : COURSES.filter(c => filter === "tutti" || c.pathway === filter);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      <Helmet>
        <title>Academy Wine Investment | VinoInvest</title>
        <meta name="description" content="20 moduli completi su investimento in vino: Bordeaux, Borgogna, En Primeur, Aste, Liv-ex, Fiscalità e casi studio reali. Certificato verificabile incluso." />
        <meta property="og:title" content="Academy Wine Investment | VinoInvest" />
        <meta property="og:description" content="Il corso più completo su investimento in vino. 20 moduli, certificato, dati reali Liv-ex." />
        <link rel="canonical" href="https://vinoinvest-platform.vercel.app/academy" />
      </Helmet>
      {/* Header */}
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>🎓 Academy</span>
        </div>
        {/* XP Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>{level.icon} {level.name}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{xp} XP {nextLevel ? `• ${xpToNext} al prossimo` : "• MAX"}</div>
          </div>
          <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
            <div style={{ width: `${levelPct}%`, height: "100%", background: "linear-gradient(90deg, #C9A227, #f59e0b)", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* Assessment Banner */}
        {!localStorage.getItem("vino_assessment_done") && assessmentStep === null && (
          <div style={{ background: "linear-gradient(135deg, #722F37 0%, #1a2535 100%)", borderRadius: 16, padding: 24, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Non sai da dove iniziare?</div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>Fai il test di 5 domande e ti consigliamo il percorso giusto per te.</div>
            </div>
            <button onClick={() => setAssessmentStep(0)} style={{ background: "#C9A227", color: "#0b1220", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Inizia Test →
            </button>
          </div>
        )}

        {/* Assessment Modal */}
        {assessmentStep !== null && assessmentStep !== "result" && (
          <AssessmentModal
            step={assessmentStep}
            question={ASSESSMENT_QUESTIONS[assessmentStep]}
            total={ASSESSMENT_QUESTIONS.length}
            onAnswer={handleAssessAnswer}
            onClose={() => setAssessmentStep(null)}
          />
        )}

        {assessmentStep === "result" && suggestedPathway && (
          <AssessmentResult
            pathway={PATHWAYS.find(p => p.id === suggestedPathway)}
            onClose={() => {
              localStorage.setItem("vino_assessment_done", "1");
              setAssessmentStep(null);
            }}
            onStart={(slug) => {
              localStorage.setItem("vino_assessment_done", "1");
              setAssessmentStep(null);
              navigate(`/academy/course/${slug}`);
            }}
          />
        )}

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Corsi completati", value: completedCourses.length, icon: "🏆" },
            { label: "XP totali", value: xp, icon: "⚡" },
            { label: "Livello", value: `${level.icon} ${level.name}`, icon: null },
            { label: "Badge", value: Object.keys(BADGES).filter(id => progress[`badge_${id}`]).length, icon: "🎖️" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#1a2535", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon || ""}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A227" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pathways */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginBottom: 12 }}>PERCORSI</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {PATHWAYS.map(pw => {
              const pwCourses = COURSES.filter(c => pw.courses.includes(c.id));
              const pwDone = pwCourses.filter(c => c.lessons.every(l => progress[l.id]?.done)).length;
              return (
                <div key={pw.id} onClick={() => setFilter(pw.id === "tutti" ? "tutti" : pw.id)} style={{ background: "#1a2535", border: `1px solid ${filter === pw.id ? pw.color : "transparent"}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "border-color 0.2s" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{pw.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: pw.color }}>{pw.label}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>{pw.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                    <span>{pwDone}/{pwCourses.length} corsi</span>
                    <span style={{ color: pw.free ? "#4ade80" : "#f59e0b" }}>{pw.free ? "Gratis" : `€${pw.price}/mo`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["free", "Corsi Gratuiti (10)"], ["premium", "Premium (20)"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#C9A227" : "#1a2535", color: tab === t ? "#0b1220" : "#94a3b8", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              {label}
            </button>
          ))}
          {/* Filter */}
          {tab === "free" && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {["tutti", "curioso", "appassionato", "investitore"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(201,162,39,0.2)" : "transparent", color: filter === f ? "#C9A227" : "#64748b", border: `1px solid ${filter === f ? "#C9A227" : "rgba(255,255,255,0.1)"}`, borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13, textTransform: "capitalize" }}>
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {allCourses.map(course => (
            <CourseCard key={course.id} course={course} progress={progress} onClick={() => navigate(`/academy/course/${course.slug}`)} />
          ))}
        </div>

        {/* Badges */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginBottom: 12 }}>BADGE</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {Object.entries(BADGES).map(([id, b]) => {
              const earned = progress[`badge_${id}`];
              return (
                <div key={id} style={{ background: earned ? "rgba(201,162,39,0.15)" : "#1a2535", border: `1px solid ${earned ? "#C9A227" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "10px 14px", opacity: earned ? 1 : 0.5, textAlign: "center", minWidth: 120 }}>
                  <div style={{ fontSize: 28 }}>{b.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: earned ? "#C9A227" : "#64748b" }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function CourseCard({ course, progress, onClick }) {
  const pct = COURSES.find(c => c.id === course.id) ? getCourseProgressLocal(course, progress) : null;
  const isLocked = course.price && !course.free;

  return (
    <div onClick={onClick} style={{ background: "#1a2535", borderRadius: 14, padding: 20, cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.15s, border-color 0.15s", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A227"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
    >
      {isLocked && (
        <div style={{ position: "absolute", top: 12, right: 12, fontSize: 18 }}>🔒</div>
      )}
      <div style={{ fontSize: 32, marginBottom: 10 }}>{course.icon}</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 11, background: "rgba(201,162,39,0.15)", color: "#C9A227", borderRadius: 4, padding: "2px 7px" }}>{course.level || "Intermedio"}</span>
        <span style={{ fontSize: 11, background: "rgba(255,255,255,0.06)", color: "#64748b", borderRadius: 4, padding: "2px 7px" }}>⏱ {course.duration}min</span>
        {course.free !== false && <span style={{ fontSize: 11, background: "rgba(74,222,128,0.15)", color: "#4ade80", borderRadius: 4, padding: "2px 7px" }}>Gratis</span>}
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{course.title}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12, lineHeight: 1.5 }}>{course.description}</div>
      {pct !== null && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginBottom: 4 }}>
            <span>Progresso</span><span>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "#C9A227", borderRadius: 2, transition: "width 0.5s" }} />
          </div>
        </div>
      )}
      {isLocked && (
        <div style={{ marginTop: 12, fontSize: 13, color: "#f59e0b" }}>€{course.price}/mese → Sblocca</div>
      )}
    </div>
  );
}

function getCourseProgressLocal(course, progress) {
  if (!course.lessons) return 0;
  const done = course.lessons.filter(l => progress[l.id]?.done).length;
  return Math.round((done / course.lessons.length) * 100);
}

function AssessmentModal({ step, question, total, onAnswer, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1a2535", borderRadius: 20, padding: 32, maxWidth: 520, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>Domanda {step + 1} di {total}</span>
          <button onClick={onClose} aria-label="Close quiz" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 24 }}>
          <div style={{ width: `${((step) / total) * 100}%`, height: "100%", background: "#C9A227", borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{question.q}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.opts.map((opt, i) => (
            <button key={i} onClick={() => onAnswer(question.pathway[i])} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", textAlign: "left", color: "#e2e8f0", cursor: "pointer", fontSize: 14, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,162,39,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >{opt}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssessmentResult({ pathway, onClose, onStart }) {
  if (!pathway) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1a2535", borderRadius: 20, padding: 32, maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{pathway.icon}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: pathway.color, marginBottom: 8 }}>Percorso {pathway.label}</div>
        <div style={{ color: "#94a3b8", marginBottom: 24 }}>{pathway.desc}</div>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Badge obiettivo:</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>🏅 {pathway.badge}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 12, color: "#94a3b8", cursor: "pointer" }}>Esplora altro</button>
          <button onClick={() => {
            const firstCourse = COURSES.find(c => pathway.courses.includes(c.id));
            if (firstCourse) onStart(firstCourse.slug);
            else onClose();
          }} style={{ flex: 2, background: "#C9A227", border: "none", borderRadius: 10, padding: 12, fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>
            Inizia il percorso →
          </button>
        </div>
      </div>
    </div>
  );
}
