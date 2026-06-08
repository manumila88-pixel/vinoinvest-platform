import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COURSES, XP_RULES } from "../data/academyContent";

const BG = "#0b1220";
const PROGRESS_KEY = "vino_academy_v1";
const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}

export default function AcademyLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // Find lesson + course
  let lesson = null, course = null;
  for (const c of COURSES) {
    const l = c.lessons?.find(l => l.id === parseInt(lessonId));
    if (l) { lesson = l; course = c; break; }
  }

  const [phase, setPhase] = useState("slides"); // slides | content | quiz | result
  const [slideIdx, setSlideIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [progress, setProgress] = useState(loadProgress);

  if (!lesson || !course) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
          <div style={{ fontSize: 18, marginBottom: 16 }}>Lezione non trovata</div>
          <button onClick={() => navigate("/academy")} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>← Academy</button>
        </div>
      </div>
    );
  }

  const slides = lesson.slides || [];
  const quiz = lesson.quiz || [];
  const lessonIdx = course.lessons.findIndex(l => l.id === lesson.id);
  const nextLesson = course.lessons[lessonIdx + 1];

  async function completeLesson(quizScore) {
    const xp = XP_RULES.lessonComplete + (quizScore === 100 ? XP_RULES.quizPerfect : 0);
    setXpEarned(xp);

    const newProgress = {
      ...progress,
      [lesson.id]: { done: true, score: quizScore, xp, date: new Date().toISOString() }
    };
    saveProgress(newProgress);
    setProgress(newProgress);

    // Check course complete
    const allDone = course.lessons.every(l => newProgress[l.id]?.done);
    if (allDone) {
      newProgress[`badge_${course.id}`] = true;
      saveProgress(newProgress);
      setProgress(newProgress);
    }

    // Sync to backend if user is logged in
    const userId = localStorage.getItem("vino_user_id");
    if (userId) {
      try {
        await fetch(`${API}/api/academy/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId: course.id, lessonId: lesson.id, quizScore, xpEarned: xp }),
        });
      } catch {}
    }
  }

  function handleQuizSubmit() {
    if (Object.keys(quizAnswers).length < quiz.length) return;
    const correct = quiz.filter((q, i) => quizAnswers[i] === q.ans).length;
    const score = Math.round((correct / quiz.length) * 100);
    setSubmitted(true);
    completeLesson(score);
  }

  const quizScore = submitted
    ? Math.round((quiz.filter((q, i) => quizAnswers[i] === q.ans).length / quiz.length) * 100)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "rgba(11,18,32,0.95)", borderBottom: "1px solid rgba(201,162,39,0.2)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(`/academy/course/${course.slug}`)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}>←</button>
          <span style={{ color: "#64748b", fontSize: 13 }}>{course.icon} {course.title} ›</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{lesson.title}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["slides", "content", "quiz"].map((p, i) => (
              <button key={p} onClick={() => setPhase(p)} style={{ background: phase === p ? "#C9A227" : "rgba(255,255,255,0.06)", color: phase === p ? "#0b1220" : "#94a3b8", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                {["📺 Slide", "📖 Testo", "❓ Quiz"][i]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px" }}>

        {/* SLIDE PLAYER */}
        {phase === "slides" && (
          <SlidePlayer slides={slides} slideIdx={slideIdx} setSlideIdx={setSlideIdx} onFinish={() => setPhase("content")} lesson={lesson} />
        )}

        {/* CONTENT */}
        {phase === "content" && (
          <ContentView lesson={lesson} onNext={() => setPhase("quiz")} />
        )}

        {/* QUIZ */}
        {phase === "quiz" && !submitted && (
          <QuizView quiz={quiz} answers={quizAnswers} setAnswers={setQuizAnswers} onSubmit={handleQuizSubmit} />
        )}

        {/* RESULT */}
        {phase === "quiz" && submitted && (
          <QuizResult score={quizScore} quiz={quiz} answers={quizAnswers} xpEarned={xpEarned} lesson={lesson} course={course} nextLesson={nextLesson} navigate={navigate} progress={progress} />
        )}
      </div>
    </div>
  );
}

// ── Slide Player ──────────────────────────────────────────────────────────────
function SlidePlayer({ slides, slideIdx, setSlideIdx, onFinish, lesson }) {
  const slide = slides[slideIdx];
  const total = slides.length;
  const isLast = slideIdx === total - 1;

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setSlideIdx(i)} style={{ flex: 1, height: 4, background: i <= slideIdx ? "#C9A227" : "rgba(255,255,255,0.08)", borderRadius: 2, cursor: "pointer", transition: "background 0.2s" }} />
        ))}
      </div>

      {/* Slide Card */}
      <div style={{ background: "#1a2535", borderRadius: 20, padding: "48px 40px", minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{slide?.icon}</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16, color: "#C9A227" }}>{slide?.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#cbd5e1", maxWidth: 600, whiteSpace: "pre-line" }}>{slide?.body}</p>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} disabled={slideIdx === 0} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "10px 20px", color: slideIdx === 0 ? "#475569" : "#e2e8f0", cursor: slideIdx === 0 ? "default" : "pointer" }}>
          ← Precedente
        </button>
        <span style={{ fontSize: 13, color: "#64748b" }}>{slideIdx + 1} / {total}</span>
        {isLast ? (
          <button onClick={onFinish} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>
            Leggi il testo →
          </button>
        ) : (
          <button onClick={() => setSlideIdx(slideIdx + 1)} style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, padding: "10px 20px", color: "#C9A227", cursor: "pointer" }}>
            Avanti →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Content View ──────────────────────────────────────────────────────────────
function ContentView({ lesson, onNext }) {
  return (
    <div>
      <div style={{ background: "#1a2535", borderRadius: 20, padding: 32, marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#C9A227" }}>📖 {lesson.title}</h2>
        <div style={{ fontSize: 15, lineHeight: 1.9, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
          {lesson.content}
        </div>
      </div>

      {/* Exercise */}
      {lesson.exercise && (
        <div style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#C9A227", marginBottom: 8 }}>🎯 ESERCIZIO PRATICO</div>
          <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>{lesson.exercise}</div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onNext} style={{ background: "#C9A227", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 15 }}>
          Vai al Quiz →
        </button>
      </div>
    </div>
  );
}

// ── Quiz View ──────────────────────────────────────────────────────────────────
function QuizView({ quiz, answers, setAnswers, onSubmit }) {
  const allAnswered = Object.keys(answers).length === quiz.length;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#C9A227" }}>❓ Quiz</h2>
        <div style={{ fontSize: 13, color: "#64748b" }}>Rispondi a tutte le domande per completare la lezione. Minimo 60% per superare.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {quiz.map((q, qi) => (
          <div key={qi} style={{ background: "#1a2535", borderRadius: 16, padding: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>
              <span style={{ color: "#64748b", marginRight: 8 }}>{qi + 1}.</span>{q.q}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.opts.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))} style={{
                  background: answers[qi] === oi ? "rgba(201,162,39,0.2)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${answers[qi] === oi ? "#C9A227" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10, padding: "11px 16px", textAlign: "left", color: "#e2e8f0", cursor: "pointer", fontSize: 14, transition: "all 0.15s"
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onSubmit} disabled={!allAnswered} style={{ background: allAnswered ? "#C9A227" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, color: allAnswered ? "#0b1220" : "#475569", cursor: allAnswered ? "pointer" : "default", fontSize: 15 }}>
          Consegna Quiz →
        </button>
      </div>
    </div>
  );
}

// ── Quiz Result ───────────────────────────────────────────────────────────────
function QuizResult({ score, quiz, answers, xpEarned, lesson, course, nextLesson, navigate, progress }) {
  const passed = score >= 60;

  return (
    <div>
      {/* Score Card */}
      <div style={{ background: passed ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${passed ? "#4ade80" : "#f87171"}`, borderRadius: 20, padding: 32, textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{passed ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: passed ? "#4ade80" : "#f87171", marginBottom: 8 }}>{score}%</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{passed ? "Superato!" : "Riprova!"}</div>
        <div style={{ color: "#94a3b8", marginBottom: 16 }}>{passed ? `Hai guadagnato ${xpEarned} XP` : "Devi ottenere almeno il 60% per completare la lezione."}</div>
        {!passed && (
          <button onClick={() => window.location.reload()} style={{ background: "#C9A227", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>
            Riprova
          </button>
        )}
      </div>

      {/* Answer Review */}
      <div style={{ background: "#1a2535", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>REVISIONE RISPOSTE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {quiz.map((q, qi) => {
            const isCorrect = answers[qi] === q.ans;
            return (
              <div key={qi} style={{ borderLeft: `3px solid ${isCorrect ? "#4ade80" : "#f87171"}`, paddingLeft: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{q.q}</div>
                <div style={{ fontSize: 13, color: isCorrect ? "#4ade80" : "#f87171", marginBottom: 4 }}>
                  {isCorrect ? "✅ Corretto" : `❌ La tua risposta: ${q.opts[answers[qi]]}`}
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: 13, color: "#4ade80" }}>✅ Risposta corretta: {q.opts[q.ans]}</div>
                )}
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, fontStyle: "italic" }}>{q.exp}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      {passed && (
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={() => navigate(`/academy/course/${course.slug}`)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "12px 20px", color: "#94a3b8", cursor: "pointer" }}>
            ← Torna al Corso
          </button>
          {nextLesson ? (
            <button onClick={() => navigate(`/academy/lesson/${nextLesson.id}`)} style={{ background: "#C9A227", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>
              Lezione {lesson.order + 1}: {nextLesson.title} →
            </button>
          ) : (
            <button onClick={() => navigate(`/academy/course/${course.slug}`)} style={{ background: "#C9A227", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>
              🎓 Corso completato! →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
