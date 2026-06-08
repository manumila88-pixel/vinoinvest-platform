import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COURSES, PREMIUM_COURSES, BADGES, XP_RULES } from "../data/academyContent";
import AuthModal from "../components/AuthModal";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// Stripe price IDs for Academy plans
const ACADEMY_PLANS = {
  ACADEMY_INVESTOR: { monthly: "price_1Tec4l15Hu1SBgIFa0PwZQvq", annual: "price_1TecAi15Hu1SBgIFmZfb4ZLU", label: "Academy Investor", price: 9.99, annual_price: 95.99 },
  ACADEMY_PRO:      { monthly: "price_1Tec9R15Hu1SBgIFH99EfNSL", annual: "price_1TecAi15Hu1SBgIFmZfb4ZLU", label: "Academy Professional", price: 19.99, annual_price: 191.99 },
};

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
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 13 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
          <span style={{ color: "#475569" }}>›</span>
          <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>🎓 Academy</button>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{course.icon} {course.title}</span>
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
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const plan = ACADEMY_PLANS[course.planId] || ACADEMY_PLANS.ACADEMY_INVESTOR;
  const navigate = useNavigate();

  async function handleCheckout() {
    const user = JSON.parse(localStorage.getItem("vino_user") || "{}");
    if (!user.email) { setShowAuth(true); return; }
    setLoading(true);
    try {
      const priceId = annual ? plan.annual : plan.monthly;
      const res = await fetch(`${BACKEND}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: user.email, successUrl: window.location.href + "?subscribed=1", cancelUrl: window.location.href }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch { alert("Errore checkout. Riprova."); }
    setLoading(false);
  }

  return (
    <>
    {showAuth && <AuthModal reason="Accedi per sbloccare i corsi premium" onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />}
    <div style={{ background: "#1a2535", borderRadius: 20, padding: 40, textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Corso Premium</div>
      <div style={{ color: "#94a3b8", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.6 }}>
        Questo corso fa parte del piano <strong style={{ color: "#C9A227" }}>{plan.label}</strong>.<br />
        Sblocca 10 corsi avanzati per €{plan.price}/mese.
      </div>

      {/* Toggle mensile/annuale */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 14, color: annual ? "#64748b" : "#e2e8f0" }}>Mensile</span>
        <div onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, background: annual ? "#C9A227" : "rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
          <div style={{ width: 18, height: 18, background: "#fff", borderRadius: 9, position: "absolute", top: 3, left: annual ? 23 : 3, transition: "left 0.2s" }} />
        </div>
        <span style={{ fontSize: 14, color: annual ? "#e2e8f0" : "#64748b" }}>Annuale <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 700 }}>-20%</span></span>
      </div>

      {/* Pricing card */}
      <div style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 16, padding: "20px 28px", display: "inline-block", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#C9A227" }}>€{annual ? plan.annual_price : plan.price}</div>
        <div style={{ fontSize: 14, color: "#94a3b8" }}>/{annual ? "anno" : "mese"} — {plan.label}</div>
        {annual && <div style={{ fontSize: 12, color: "#4ade80", marginTop: 4 }}>Risparmio €{Math.round(plan.price * 12 - plan.annual_price)} rispetto al mensile</div>}
      </div>

      {/* What's included */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 28, textAlign: "left" }}>
        {["10 corsi avanzati video + slide", "Quiz e certificato inclusi", "Mappe e grafici dati reali", "Accesso a vita ai contenuti acquistati", "Supporto email prioritario"].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14, color: "#94a3b8" }}>
            <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>{f}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/pricing")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 20px", color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>
          Tutti i piani →
        </button>
        <button onClick={handleCheckout} disabled={loading} style={{ background: "#C9A227", border: "none", borderRadius: 12, padding: "14px 32px", fontWeight: 800, color: "#0b1220", cursor: loading ? "default" : "pointer", fontSize: 16, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Reindirizzamento..." : `Sblocca — €${annual ? plan.annual_price : plan.price}/${annual ? "anno" : "mese"} →`}
        </button>
      </div>
    </div>
    </>
  );
}
