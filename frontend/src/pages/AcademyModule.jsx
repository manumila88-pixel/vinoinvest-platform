import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QUIZ_PASS_THRESHOLD, ADMIN_EMAIL } from "../lib/constants";
import VideoLesson from "../components/VideoLesson";
import { getModuleVideo } from "../data/academyVideos";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const BG = "#0b1220";
const GOLD = "#C9A227";
const PROGRESS_KEY = "vino_module_progress_v1";

function loadModuleProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
}

function saveModuleProgress(moduleId, score, passed) {
  const p = loadModuleProgress();
  p[moduleId] = { score, passed, completedAt: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("vino_user") || "{}"); } catch { return {}; }
}

// ── Slide Viewer ───────────────────────────────────────────────────────────────
function SlideViewer({ slides }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: 0, overflow: "hidden", marginBottom: 28 }}>
      <div style={{ background: "rgba(201,162,39,0.06)", borderBottom: "1px solid rgba(201,162,39,0.12)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#C9A227", fontWeight: 700 }}>SLIDES</span>
        <span style={{ fontSize: 12, color: "#475569" }}>{idx + 1} / {slides.length}</span>
      </div>
      <div style={{ padding: "28px 32px", minHeight: 140 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{slide.title}</div>
        <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{slide.body}</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.04)", justifyContent: "space-between" }}>
        <button disabled={idx === 0} onClick={() => setIdx(i => i - 1)}
          style={{ background: idx === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 16px", color: idx === 0 ? "#2d3748" : "#94a3b8", cursor: idx === 0 ? "default" : "pointer", fontSize: 13 }}>
          ← Precedente
        </button>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width: 7, height: 7, borderRadius: "50%", background: i === idx ? GOLD : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "background 0.15s" }} />
          ))}
        </div>
        <button disabled={idx === slides.length - 1} onClick={() => setIdx(i => i + 1)}
          style={{ background: idx === slides.length - 1 ? "rgba(255,255,255,0.03)" : "#C9A227", border: "none", borderRadius: 8, padding: "8px 16px", color: idx === slides.length - 1 ? "#2d3748" : "#0b1220", cursor: idx === slides.length - 1 ? "default" : "pointer", fontSize: 13, fontWeight: 700 }}>
          Successivo →
        </button>
      </div>
    </div>
  );
}

// ── Quiz Section ───────────────────────────────────────────────────────────────
function QuizSection({ quiz, moduleId, onPass }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const progress = loadModuleProgress();
  const alreadyPassed = progress[moduleId]?.passed;

  if (alreadyPassed) {
    return (
      <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: 4 }}>Modulo completato — {progress[moduleId].score}%</div>
        <div style={{ fontSize: 13, color: "#64748b" }}>Hai già superato il quiz con successo.</div>
      </div>
    );
  }

  function handleSubmit() {
    let correct = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const pct = Math.round((correct / quiz.length) * 100);
    setScore(pct);
    setSubmitted(true);
    const passed = pct >= QUIZ_PASS_THRESHOLD;
    saveModuleProgress(moduleId, pct, passed);
    if (passed) onPass(pct);
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  const allAnswered = Object.keys(answers).length === quiz.length;
  const passed = submitted && score >= QUIZ_PASS_THRESHOLD;

  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 20 }}>📝</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Quiz di Verifica</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Punteggio minimo: {QUIZ_PASS_THRESHOLD}% — {quiz.length} domande</div>
        </div>
      </div>

      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ color: GOLD, marginRight: 8 }}>{qi + 1}.</span>{q.q}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, oi) => {
              let bg = "rgba(255,255,255,0.04)";
              let border = "1px solid rgba(255,255,255,0.07)";
              let color = "#e2e8f0";
              if (submitted) {
                if (oi === q.correct) { bg = "rgba(74,222,128,0.12)"; border = "1px solid rgba(74,222,128,0.3)"; color = "#4ade80"; }
                else if (oi === answers[qi] && oi !== q.correct) { bg = "rgba(239,68,68,0.12)"; border = "1px solid rgba(239,68,68,0.3)"; color = "#f87171"; }
              } else if (answers[qi] === oi) {
                bg = "rgba(201,162,39,0.12)"; border = `1px solid rgba(201,162,39,0.4)`; color = GOLD;
              }
              return (
                <div key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                  style={{ background: bg, border, borderRadius: 10, padding: "11px 16px", cursor: submitted ? "default" : "pointer", transition: "all 0.15s", display: "flex", gap: 10, alignItems: "center", color, fontSize: 14 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${answers[qi] === oi && !submitted ? GOLD : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700 }}>
                    {submitted && oi === q.correct ? "✓" : submitted && oi === answers[qi] && oi !== q.correct ? "✗" : String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit} disabled={!allAnswered}
          style={{ width: "100%", padding: "14px 0", background: allAnswered ? GOLD : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, fontWeight: 800, color: allAnswered ? "#0b1220" : "#2d3748", cursor: allAnswered ? "pointer" : "default", fontSize: 15, transition: "all 0.15s" }}>
          Invia risposte
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{passed ? "🏆" : "😔"}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: passed ? "#4ade80" : "#f87171", marginBottom: 6 }}>{score}%</div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16 }}>
            {passed ? `Ottimo! Hai superato il quiz. Il prossimo modulo è sbloccato.` : `Necessario ${QUIZ_PASS_THRESHOLD}% per sbloccare il modulo successivo. Riprova.`}
          </div>
          {!passed && (
            <button onClick={retry} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 24px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
              Riprova il quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Case Study Card ────────────────────────────────────────────────────────────
function CaseStudyCard({ cs }) {
  return (
    <div style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.12)", borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{cs.wine}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{cs.year_buy} → {cs.year_sell} · Acquisto: €{cs.buy}/bt → Vendita: €{cs.sell}/bt</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#4ade80" }}>{cs.roi}</div>
      </div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 10, lineHeight: 1.6 }}>{cs.note}</div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ emoji, title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AcademyModule() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "it";
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [premiumLoaded, setPremiumLoaded] = useState(false);
  const [module, setModule] = useState(null);
  const [allModules, setAllModules] = useState([]);
  const topRef = useRef(null);

  const user = getStoredUser();
  const isAdmin = user.email === ADMIN_EMAIL;

  const progress = loadModuleProgress();
  const alreadyDone = progress[moduleId]?.passed;

  useEffect(() => {
    import("../data/premiumContent").then(async m => {
      const mod = await m.getModuleById(moduleId);
      setModule(mod);
      if (mod) setAllModules(await m.getModulesForCourse(mod.courseId));
      setPremiumLoaded(true);
    }).catch(() => setPremiumLoaded(true)); // chunk load failure → "Modulo non trovato" screen instead of infinite spinner
  }, [moduleId]);

  useEffect(() => {
    if (alreadyDone || isAdmin) setQuizPassed(true);
  }, [alreadyDone, isAdmin]);

  useEffect(() => {
    if (module && !contentRevealed) {
      const t = setTimeout(() => setContentRevealed(true), 150);
      return () => clearTimeout(t);
    }
  }, [module, contentRevealed]);

  if (!premiumLoaded) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${GOLD}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ fontSize: 14, color: "#64748b" }}>Caricamento modulo...</div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
          <div style={{ fontSize: 18, marginBottom: 16 }}>Modulo non trovato</div>
          <button onClick={() => navigate("/academy")} style={{ background: GOLD, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: BG, cursor: "pointer" }}>← Academy</button>
        </div>
      </div>
    );
  }
  const prevModule = allModules[module.index - 1] || null;
  const nextModule = allModules[module.index + 1] || null;
  const nextUnlocked = quizPassed || isAdmin || !nextModule;

  function handleQuizPass(score) {
    setQuizPassed(true);
    // Save to backend if user is logged in
    const userId = localStorage.getItem("vino_user_id");
    if (userId) {
      fetch(`${API}/api/academy/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId: module.courseId, lessonId: module.id, quizScore: score, xpEarned: 50 }),
      }).catch(() => {});
    }
  }

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Sticky header */}
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 13, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
            <span style={{ color: "#475569" }}>›</span>
            <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>Academy</button>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Modulo {module.index + 1}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>{module.index + 1} / {allModules.length}</span>
            {isAdmin && <span style={{ fontSize: 10, background: "rgba(201,162,39,0.15)", color: GOLD, borderRadius: 3, padding: "1px 6px", fontWeight: 700 }}>ADMIN</span>}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#1a2535" }}>
        <div style={{ height: "100%", width: `${((module.index + (quizPassed ? 1 : 0)) / allModules.length) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, #f59e0b)`, transition: "width 0.5s" }} />
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 16px" }}>
        {lang !== "it" && !bannerDismissed && (
          <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "10px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, color: "#713f12", fontSize: 13, fontWeight: 500 }}>
            <span>Contenuto disponibile in italiano — <strong>Translation coming soon</strong></span>
            <button onClick={() => setBannerDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a16207", fontSize: 18, lineHeight: 1, padding: "0 4px", flexShrink: 0 }} aria-label="Dismiss">×</button>
          </div>
        )}
        {/* SECTION 1: Hero */}
        <div style={{ background: "#1a2535", borderRadius: 20, padding: "32px 36px", marginBottom: 32, borderLeft: `4px solid ${GOLD}` }}>
          <div style={{ fontSize: 11, color: GOLD, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10 }}>
            MODULO {module.index + 1} DI {allModules.length} · {module.duration} MIN
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.3, marginBottom: 16 }}>{module.title}</h1>
          <div style={{ background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 12, padding: "14px 18px", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>{module.hero.stat}</div>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>{module.hero.context}</p>
        </div>

        {/* SECTION 2: Obiettivi */}
        <Section emoji="🎯" title="Obiettivi di Apprendimento">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 10 }}>
            {module.objectives.map((obj, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#1a2535", borderRadius: 10, padding: "12px 14px", fontSize: 14 }}>
                <span style={{ color: "#4ade80", flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ color: "#94a3b8" }}>{obj}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* SECTION 3: Contesto */}
        <Section emoji="📖" title="Contesto">
          <div style={{ background: "#1a2535", borderRadius: 14, padding: "20px 24px", fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>
            {module.context}
          </div>
        </Section>

        {/* SECTION 4: Slides */}
        <Section emoji="🗂" title="Slides">
          <SlideViewer slides={module.slides} />
        </Section>

        {/* SECTION 5: Grafico / Map SVG */}
        {module.mapSvg && (
          <Section emoji="📊" title="Dati & Grafico">
            <div style={{ background: "#1a2535", borderRadius: 14, overflow: "hidden" }}
              dangerouslySetInnerHTML={{ __html: module.mapSvg }} />
          </Section>
        )}

        {/* SECTION 6: Video Lezione */}
        <Section emoji="🎬" title="Video Lezione">
          {(() => {
            const vid = getModuleVideo(moduleId);
            return (
              <VideoLesson
                embedUrl={module.youtube || vid.embedUrl}
                topic={module.title}
                searchQuery={vid.searchQuery}
              />
            );
          })()}
        </Section>

        {/* SECTION 7: Approfondimento 600+ words */}
        <Section emoji="🔬" title="Approfondimento">
          <div style={{ background: "#1a2535", borderRadius: 14, padding: "24px 28px" }}>
            {module.deepDive.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, marginBottom: i < module.deepDive.split("\n\n").length - 1 ? 16 : 0 }}>{para}</p>
            ))}
          </div>
        </Section>

        {/* SECTION 8: Casi Studio */}
        {module.caseStudies?.length > 0 && (
          <Section emoji="📈" title="Casi Studio Reali">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {module.caseStudies.map((cs, i) => <CaseStudyCard key={i} cs={cs} />)}
            </div>
          </Section>
        )}

        {/* SECTION 9: Tecniche */}
        {module.techniques?.length > 0 && (
          <Section emoji="⚙️" title="Tecniche di Investimento">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {module.techniques.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", background: "#1a2535", borderRadius: 10, fontSize: 14 }}>
                  <span style={{ color: GOLD, fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: "#94a3b8" }}>{t}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* SECTION 10: Esercizio Pratico */}
        {module.exercise?.steps?.length > 0 && (
          <Section emoji="✏️" title={`Esercizio Pratico: ${module.exercise.title}`}>
            <div style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.12)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {module.exercise.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14 }}>
                    <span style={{ background: GOLD, color: BG, width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: 12 }}>{i + 1}</span>
                    <span style={{ color: "#94a3b8", lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* SECTION 11: Punti Chiave */}
        {module.keyPoints?.length > 0 && (
          <Section emoji="💡" title="Punti Chiave">
            <div style={{ background: "#1a2535", borderRadius: 14, padding: "20px 24px" }}>
              {module.keyPoints.map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < module.keyPoints.length - 1 ? 12 : 0, fontSize: 14 }}>
                  <span style={{ color: GOLD, flexShrink: 0, fontWeight: 700 }}>→</span>
                  <span style={{ color: "#e2e8f0", lineHeight: 1.6 }}>{pt}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* SECTION 12: Collegamento Moduli */}
        <Section emoji="🔗" title="Dove Siamo nel Percorso">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {allModules.slice(0, 10).map((m, i) => {
              const done = progress[m.id]?.passed;
              const isCurrent = m.id === moduleId;
              return (
                <div key={m.id} style={{ width: 32, height: 32, borderRadius: "50%", background: isCurrent ? GOLD : done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)", border: `2px solid ${isCurrent ? GOLD : done ? "#4ade80" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isCurrent ? BG : done ? "#4ade80" : "#475569", cursor: done || isAdmin ? "pointer" : "default" }}
                  onClick={() => (done || isAdmin) && m.id !== moduleId && navigate(`/academy/module/${m.id}`)}>
                  {done && !isCurrent ? "✓" : i + 1}
                </div>
              );
            })}
            {allModules.length > 10 && <span style={{ fontSize: 12, color: "#475569" }}>+{allModules.length - 10}</span>}
          </div>
        </Section>

        {/* SECTION 13: Quiz */}
        <Section emoji="📝" title="Quiz di Verifica">
          <QuizSection quiz={module.quiz} moduleId={moduleId} onPass={handleQuizPass} />
        </Section>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginTop: 40, flexWrap: "wrap" }}>
          {prevModule ? (
            <button onClick={() => navigate(`/academy/module/${prevModule.id}`)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 20px", color: "#94a3b8", cursor: "pointer", fontSize: 14, flex: 1, minWidth: 160 }}>
              ← {prevModule.title.substring(0, 40)}{prevModule.title.length > 40 ? "..." : ""}
            </button>
          ) : <div style={{ flex: 1 }} />}

          {nextModule && (
            <button disabled={!nextUnlocked} onClick={() => nextUnlocked && navigate(`/academy/module/${nextModule.id}`)}
              style={{ background: nextUnlocked ? GOLD : "rgba(255,255,255,0.04)", border: nextUnlocked ? "none" : "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 20px", color: nextUnlocked ? BG : "#2d3748", cursor: nextUnlocked ? "pointer" : "not-allowed", fontSize: 14, fontWeight: nextUnlocked ? 800 : 400, flex: 1, minWidth: 160 }}>
              {nextUnlocked ? `${nextModule.title.substring(0, 35)}${nextModule.title.length > 35 ? "..." : ""} →` : `🔒 Supera il quiz per sbloccare →`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
