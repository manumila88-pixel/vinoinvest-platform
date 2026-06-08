import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COURSES, PREMIUM_COURSES, BADGES, XP_RULES } from "../data/academyContent";

const BG = "#0b1220";
const PROGRESS_KEY = "vino_academy_v1";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}

export default function AcademyCourse() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const all = [...COURSES, ...PREMIUM_COURSES];
  const course = all.find(c => c.slug === slug);
  const [progress] = useState(loadProgress);

  if (!course) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
          <div style={{ fontSize: 20, marginBottom: 16 }}>Corso non trovato</div>
          <button onClick={() => navigate("/academy")} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>← Torna all'Academy</button>
        </div>
      </div>
    );
  }

  const isLocked = course.price && !course.free;
  const lessons = course.lessons || [];
  const completedCount = lessons.filter(l => progress[l.id]?.done).length;
  const pct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "rgba(11,18,32,0.95)", borderBottom: "1px solid rgba(201,162,39,0.2)", padding: "16px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}>←</button>
          <span style={{ fontWeight: 700, color: "#C9A227" }}>🎓 Academy</span>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0" }}>{course.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
        {/* Course Hero */}
        <div style={{ background: "#1a2535", borderRadius: 20, padding: 32, marginBottom: 32, display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ fontSize: 64 }}>{course.icon}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, background: "rgba(201,162,39,0.15)", color: "#C9A227", borderRadius: 4, padding: "2px 8px" }}>{course.level}</span>
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", color: "#64748b", borderRadius: 4, padding: "2px 8px" }}>⏱ {course.duration} min totali</span>
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", color: "#64748b", borderRadius: 4, padding: "2px 8px" }}>{lessons.length} lezioni</span>
              {!isLocked && <span style={{ fontSize: 12, background: "rgba(74,222,128,0.15)", color: "#4ade80", borderRadius: 4, padding: "2px 8px" }}>Gratis</span>}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{course.title}</h1>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{course.description}</p>

            {/* Progress */}
            {lessons.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                  <span>Progresso</span>
                  <span>{completedCount}/{lessons.length} lezioni • {pct}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #C9A227, #f59e0b)", borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Locked State */}
        {isLocked ? (
          <LockedCourse course={course} />
        ) : (
          <LessonList lessons={lessons} progress={progress} courseSlug={slug} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

function LessonList({ lessons, progress, courseSlug, navigate }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>LEZIONI</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lessons.map((lesson, idx) => {
          const done = progress[lesson.id]?.done;
          const score = progress[lesson.id]?.score;
          const isFirst = idx === 0;
          const prevDone = idx === 0 || progress[lessons[idx - 1]?.id]?.done;

          return (
            <div key={lesson.id} onClick={() => navigate(`/academy/lesson/${lesson.id}`)} style={{ background: "#1a2535", borderRadius: 12, padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, border: `1px solid ${done ? "rgba(201,162,39,0.3)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A227"}
              onMouseLeave={e => e.currentTarget.style.borderColor = done ? "rgba(201,162,39,0.3)" : "rgba(255,255,255,0.06)"}
            >
              {/* Status Icon */}
              <div style={{ width: 40, height: 40, borderRadius: 20, background: done ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                {done ? "✅" : `${idx + 1}`}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{lesson.title}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>⏱ {lesson.duration} min • {lesson.slides?.length || 8} slide</div>
              </div>

              {done && score !== undefined && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: score >= 60 ? "#4ade80" : "#f87171" }}>Quiz: {score}%</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>+{XP_RULES.lessonComplete} XP</div>
                </div>
              )}

              <div style={{ color: "#475569", fontSize: 18 }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LockedCourse({ course }) {
  return (
    <div style={{ background: "#1a2535", borderRadius: 20, padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Corso Premium</div>
      <div style={{ color: "#94a3b8", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
        Questo corso fa parte del piano {course.planId === "ACADEMY_INVESTOR" ? "Investor" : "Professional"}.
        Sblocca l'accesso a tutti i corsi del percorso per €{course.price}/mese.
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 20px", textAlign: "left", minWidth: 200 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>INCLUSO NEL PIANO</div>
          <div style={{ fontWeight: 700, color: "#C9A227" }}>€{course.price}/mese</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>o €{Math.round(course.price * 9.6)}/anno (-20%)</div>
        </div>
        <button style={{ background: "#C9A227", border: "none", borderRadius: 12, padding: "14px 28px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 16, alignSelf: "center" }}
          onClick={() => window.location.href = "/pricing"}>
          Sblocca ora →
        </button>
      </div>
    </div>
  );
}
