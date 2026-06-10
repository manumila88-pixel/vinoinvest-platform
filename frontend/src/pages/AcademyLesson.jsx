import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area } from "recharts";
import { COURSES, XP_RULES } from "../data/academyContent";
import { useTranslation } from "react-i18next";

const BG = "#0b1220";
const GOLD = "#C9A227";
const PROGRESS_KEY = "vino_academy_v1";
const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// ── Media config per lezione ──────────────────────────────────────────────────
const LESSON_MEDIA = {
  // Corso 1 — Fondamenti
  101: { hero: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1400", heroCredit: "Val d'Orcia, Toscana", mapType: null,    wineSearch: "Barolo",  videoQuery: "come+si+fa+il+vino+dalla+vigna+alla+bottiglia",  scorecard: { name: "Barolo DOCG", producer: "Giacomo Conterno", region: "Serralunga d'Alba, Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 } },
  102: { hero: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400", heroCredit: "Vigneti delle Langhe, Piemonte", mapType: "italy", wineSearch: "Barolo",  videoQuery: "nebbiolo+grape+barolo+wine+explained",              scorecard: { name: "Barolo Monfortino Riserva", producer: "G. Conterno", region: "Langhe, Piemonte", score: 99, risk: 30, liquidity: 60, growth: 90 } },
  103: { hero: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=1400", heroCredit: "Vignobles de Bordeaux, Francia", mapType: null,    wineSearch: "Sassicaia", videoQuery: "come+si+legge+etichetta+vino+DOCG+DOC",            scorecard: { name: "Sassicaia DOC", producer: "Tenuta San Guido", region: "Bolgheri, Toscana", score: 96, risk: 25, liquidity: 70, growth: 75 } },
  104: { hero: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=1400", heroCredit: "Région Champagne, Francia", mapType: null,    wineSearch: "Champagne", videoQuery: "champagne+production+method+champenoise",          scorecard: { name: "Dom Pérignon Vintage", producer: "Moët & Chandon", region: "Épernay, Champagne", score: 97, risk: 20, liquidity: 80, growth: 70 } },
  105: { hero: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400", heroCredit: "Vigneti delle Langhe, Piemonte", mapType: null,    wineSearch: "Barolo",  videoQuery: "wine+investment+guide+fine+wine+portfolio",       scorecard: { name: "Barolo DOCG", producer: "G. Conterno", region: "Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 } },
  // Corso 2 — Regioni
  201: { hero: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=1400", heroCredit: "Médoc, Bordeaux, Francia", mapType: "france", wineSearch: "Lafite",   videoQuery: "bordeaux+wine+region+documentary+premiers+crus",   scorecard: { name: "Château Lafite-Rothschild", producer: "Domaines Barons de Rothschild", region: "Pauillac, Bordeaux", score: 98, risk: 15, liquidity: 95, growth: 65 } },
  202: { hero: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400", heroCredit: "Langhe, Piemonte", mapType: "italy",  wineSearch: "Barolo",  videoQuery: "barolo+brunello+montalcino+italian+wine+investment",  scorecard: { name: "Barolo Monfortino Riserva", producer: "Giacomo Conterno", region: "Serralunga d'Alba", score: 99, risk: 30, liquidity: 60, growth: 90 } },
  203: { hero: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1400", heroCredit: "Napa Valley, California", mapType: null,    wineSearch: "Opus One", videoQuery: "napa+valley+wine+screaming+eagle+opus+one",        scorecard: { name: "Screaming Eagle", producer: "Screaming Eagle Winery", region: "Napa Valley, California", score: 100, risk: 20, liquidity: 75, growth: 80 } },
  204: { hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400", heroCredit: "Côte de Nuits, Borgogna", mapType: "france", wineSearch: "Romanee Conti", videoQuery: "romanee+conti+wine+most+expensive+world",            scorecard: { name: "Romanée-Conti GC", producer: "DRC", region: "Vosne-Romanée, Borgogna", score: 100, risk: 10, liquidity: 40, growth: 95 } },
  205: { hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400", heroCredit: "Côte de Nuits, Borgogna", mapType: null,    wineSearch: "Barolo",  videoQuery: "fine+wine+investment+returns+portfolio+2024",       scorecard: { name: "Barolo DOCG", producer: "G. Conterno", region: "Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 } },
  // Corso 3 — Degustazione
  301: { hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400", heroCredit: "Côte de Nuits, Borgogna", mapType: null,    wineSearch: "Barolo",  videoQuery: "wine+visual+analysis+color+professional+tasting",  scorecard: { name: "Barolo DOCG", producer: "G. Conterno", region: "Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 } },
  302: { hero: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1400", heroCredit: "Toscana, Italia", mapType: null,    wineSearch: "Brunello", videoQuery: "wine+aroma+nose+professional+sommelier+technique",   scorecard: { name: "Brunello di Montalcino", producer: "Biondi-Santi", region: "Montalcino, Toscana", score: 97, risk: 25, liquidity: 65, growth: 85 } },
  303: { hero: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=1400", heroCredit: "Médoc, Bordeaux, Francia", mapType: null,    wineSearch: "Margaux", videoQuery: "wine+tasting+palate+structure+tannins+acidity+body", scorecard: { name: "Château Margaux", producer: "Margaux Estate", region: "Margaux, Bordeaux", score: 98, risk: 15, liquidity: 90, growth: 70 } },
  304: { hero: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400", heroCredit: "Piemonte, Italia", mapType: null,    wineSearch: "Barolo",  videoQuery: "WSET+wine+tasting+note+professional+scoring+method",  scorecard: { name: "Barolo DOCG", producer: "G. Conterno", region: "Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 } },
  305: { hero: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1400", heroCredit: "Toscana, Italia", mapType: null,    wineSearch: "Barolo",  videoQuery: "wine+professional+certification+sommelier+WSET+AIS",  scorecard: { name: "Barolo DOCG", producer: "G. Conterno", region: "Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 } },
};

// Default media for lessons without specific config
function getMedia(lessonId) {
  return LESSON_MEDIA[lessonId] || {
    hero: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400",
    heroCredit: "Vigna, Italia",
    mapType: null, wineSearch: "Barolo", videoQuery: "wine+investment+guide",
    scorecard: { name: "Barolo DOCG", producer: "G. Conterno", region: "Piemonte", score: 98, risk: 35, liquidity: 55, growth: 85 },
  };
}

// ── Region comparison data (static, sourced from Liv-ex public reports) ──────
const REGION_COMPARISON = [
  { region: "Borgogna", roi5y: 38, roi10y: 112, liquidity: 55 },
  { region: "Champagne", roi5y: 22, roi10y: 68, liquidity: 78 },
  { region: "Barolo/Barbaresco", roi5y: 18, roi10y: 95, liquidity: 58 },
  { region: "Bordeaux", roi5y: 8, roi10y: 42, liquidity: 95 },
  { region: "Super Tuscans", roi5y: 14, roi10y: 75, liquidity: 62 },
  { region: "Napa Cult", roi5y: 12, roi10y: 55, liquidity: 68 },
];

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadProgress() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; } }
function saveProgress(p) { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {} }

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AcademyLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "it";
  const [bannerDismissed, setBannerDismissed] = useState(false);

  let lesson = null, course = null;
  for (const c of COURSES) {
    const l = c.lessons?.find(l => l.id === parseInt(lessonId));
    if (l) { lesson = l; course = c; break; }
  }

  const displayLessonTitle = lesson?.translations?.[lang]?.title || lesson?.title;
  const displayCourseTitle = course?.translations?.[lang]?.title || course?.title;

  const [quizAnswers, setQuizAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [progress, setProgress] = useState(loadProgress);
  const [wineData, setWineData] = useState(null);
  const [wineId, setWineId] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);

  const media = lesson ? getMedia(lesson.id) : getMedia(0);

  // Fetch wine for charts
  useEffect(() => {
    if (!media.wineSearch) return;
    fetch(`${API}/api/wines?search=${encodeURIComponent(media.wineSearch)}&limit=1`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const wine = d?.results?.[0] || d?.wines?.[0];
        if (wine) { setWineId(wine.id); setWineData(wine); }
      }).catch(() => {});
  }, [media.wineSearch]);

  if (!lesson || !course) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
          <div style={{ fontSize: 18, marginBottom: 16 }}>Lezione non trovata</div>
          <button onClick={() => navigate("/academy")} style={{ background: GOLD, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>← Academy</button>
        </div>
      </div>
    );
  }

  const slides = lesson.slides || [];
  const quiz = lesson.quiz || [];
  const lessonIdx = course.lessons.findIndex(l => l.id === lesson.id);
  const prevLesson = course.lessons[lessonIdx - 1];
  const nextLesson = course.lessons[lessonIdx + 1];

  async function completeLesson(quizScore) {
    const xp = XP_RULES.lessonComplete + (quizScore === 100 ? XP_RULES.quizPerfect : 0);
    setXpEarned(xp);
    const newProgress = { ...progress, [lesson.id]: { done: true, score: quizScore, xp, date: new Date().toISOString() } };
    const allDone = course.lessons.every(l => newProgress[l.id]?.done);
    if (allDone) newProgress[`badge_${course.id}`] = true;
    saveProgress(newProgress);
    setProgress(newProgress);
    const userId = localStorage.getItem("vino_user_id");
    if (userId) {
      try { await fetch(`${API}/api/academy/progress`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, courseId: course.id, lessonId: lesson.id, quizScore, xpEarned: xp }) }); } catch {}
    }
  }

  function handleQuizSubmit() {
    if (Object.keys(quizAnswers).length < quiz.length) return;
    const correct = quiz.filter((q, i) => quizAnswers[i] === q.ans).length;
    const score = Math.round((correct / quiz.length) * 100);
    setSubmitted(true);
    completeLesson(score);
  }

  const quizScore = submitted ? Math.round((quiz.filter((q, i) => quizAnswers[i] === q.ans).length / quiz.length) * 100) : 0;
  const courseProgress = Math.round(((lessonIdx) / course.lessons.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>

      {/* ── Sticky Header ──────────────────────────────────────────────── */}
      <div style={{ background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,162,39,0.15)", padding: "12px 24px", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 13 }}>
            <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", fontWeight: 700, fontSize: 14, padding: 0 }}>VinoInvest</button>
            <span style={{ color: "#475569" }}>›</span>
            <button onClick={() => navigate("/academy")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>Academy</button>
            <span style={{ color: "#475569" }}>›</span>
            <button onClick={() => navigate(`/academy/course/${course.slug}`)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>{course.icon} {course.title}</button>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{displayLessonTitle}</span>
          </div>
          {/* Course progress bar */}
          <div style={{ marginTop: 8, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
            <div style={{ width: `${courseProgress}%`, height: "100%", background: GOLD, borderRadius: 1, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      {/* ── HERO IMAGE ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
        <img src={media.hero} alt={media.heroCredit} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} loading="lazy" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(11,18,32,0.2) 0%, rgba(11,18,32,0.85) 100%)" }} />
        <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, background: "rgba(201,162,39,0.25)", color: GOLD, borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>LEZIONE {lesson.order}</span>
            <span style={{ fontSize: 11, background: "rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 20, padding: "3px 10px" }}>⏱ {lesson.duration} min</span>
            <span style={{ fontSize: 11, background: "rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 20, padding: "3px 10px" }}>{slides.length} slide</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{displayLessonTitle}</h1>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>© {media.heroCredit} — Unsplash</div>
        </div>
      </div>

      {/* ── CONTENT BODY ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>

        {lang !== "it" && !bannerDismissed && (
          <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "10px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, color: "#713f12", fontSize: 13, fontWeight: 500 }}>
            <span>Contenuto disponibile in italiano — <strong>Translation coming soon</strong></span>
            <button onClick={() => setBannerDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a16207", fontSize: 18, lineHeight: 1, padding: "0 4px", flexShrink: 0 }} aria-label="Dismiss">×</button>
          </div>
        )}

        {/* ── SEZIONE 1: SLIDE VISIVE ─────────────────────────────────── */}
        <SectionLabel label="SLIDE DELLA LEZIONE" icon="📺" />
        <SlidesSection slides={slides} />

        {/* ── SEZIONE 2: GRAFICI DATI REALI ──────────────────────────── */}
        <SectionLabel label="DATI DI MERCATO REALI" icon="📊" />
        <ChartsSection wineId={wineId} wineData={wineData} media={media} />

        {/* ── SEZIONE 3: MAPPA INTERATTIVA ───────────────────────────── */}
        {media.mapType && (
          <>
            <SectionLabel label="MAPPA DELLE REGIONI" icon="🗺️" />
            <MapSection mapType={media.mapType} activeRegion={activeRegion} setActiveRegion={setActiveRegion} />
          </>
        )}

        {/* ── SEZIONE 4: VIDEO ────────────────────────────────────────── */}
        <SectionLabel label="VIDEO DI APPROFONDIMENTO" icon="🎬" />
        <VideoSection videoQuery={media.videoQuery} lessonTitle={lesson.title} />

        {/* ── SEZIONE 5: TESTO APPROFONDIMENTO ───────────────────────── */}
        <SectionLabel label="APPROFONDIMENTO" icon="📖" />
        <ContentSection lesson={lesson} />

        {/* ── SEZIONE 6: SCORECARD VINO ──────────────────────────────── */}
        <SectionLabel label="SCHEDA VINO DI RIFERIMENTO" icon="🍷" />
        <ScorecardSection scorecard={media.scorecard} />

        {/* ── SEZIONE 7: ESERCIZIO PRATICO ───────────────────────────── */}
        {lesson.exercise && (
          <>
            <SectionLabel label="ESERCIZIO PRATICO" icon="🎯" />
            <ExerciseSection exercise={lesson.exercise} />
          </>
        )}

        {/* ── SEZIONE 8: QUIZ ────────────────────────────────────────── */}
        <SectionLabel label="QUIZ DI VERIFICA" icon="❓" />
        {!submitted ? (
          <QuizSection quiz={quiz} answers={quizAnswers} setAnswers={setQuizAnswers} onSubmit={handleQuizSubmit} />
        ) : (
          <QuizResult score={quizScore} quiz={quiz} answers={quizAnswers} xpEarned={xpEarned} passed={quizScore >= 60} onRetry={() => { setQuizAnswers({}); setSubmitted(false); }} />
        )}

        {/* ── FOOTER NAV ─────────────────────────────────────────────── */}
        <LessonNavFooter prevLesson={prevLesson} nextLesson={nextLesson} course={course} navigate={navigate} submitted={submitted} passed={quizScore >= 60} />

      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionLabel({ label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, marginTop: 36 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#64748b" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ── SLIDE PLAYER ──────────────────────────────────────────────────────────────
function SlidesSection({ slides }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const total = slides.length;

  const colors = ["#722F37","#1e40af","#065f46","#7c2d12","#4a044e","#0c4a6e","#431407","#1a2535"];

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Slide dots */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ flex: 1, height: 3, background: i <= idx ? GOLD : "rgba(255,255,255,0.07)", border: "none", borderRadius: 2, cursor: "pointer", padding: 0, transition: "background 0.2s" }} />
        ))}
      </div>

      {/* Slide card with color accent */}
      <div style={{ background: `linear-gradient(135deg, ${colors[idx % colors.length]} 0%, #1a2535 100%)`, borderRadius: 20, padding: "48px 40px 40px", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", marginBottom: 16, border: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
        {/* Decorative circle */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ fontSize: 60, marginBottom: 20, position: "relative" }}>{slide?.icon}</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 10, position: "relative" }}>SLIDE {idx + 1} DI {total}</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 18, color: "#fff", position: "relative", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{slide?.title}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,0.82)", maxWidth: 640, whiteSpace: "pre-line", position: "relative" }}>{slide?.body}</p>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "9px 18px", color: idx === 0 ? "#334155" : "#e2e8f0", cursor: idx === 0 ? "default" : "pointer", fontSize: 14 }}>
          ← Precedente
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? GOLD : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.2s" }} />
          ))}
        </div>
        {idx < total - 1 ? (
          <button onClick={() => setIdx(idx + 1)} style={{ background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, padding: "9px 18px", color: GOLD, cursor: "pointer", fontSize: 14 }}>
            Avanti →
          </button>
        ) : (
          <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 10, padding: "9px 18px", color: "#4ade80", fontSize: 13, fontWeight: 600 }}>
            ✓ Slide completate
          </div>
        )}
      </div>
    </div>
  );
}

// ── CHARTS SECTION ────────────────────────────────────────────────────────────
function ChartsSection({ wineId, wineData, media }) {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wineId) { setLoading(false); return; }
    fetch(`${API}/api/prices/${encodeURIComponent(wineId)}/history?currentPrice=${wineData?.current_price || 300}&timeframe=5y`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.history) return;
        const byYear = {};
        d.history.forEach(p => {
          const y = new Date(p.recorded_at).getFullYear();
          if (!byYear[y]) byYear[y] = [];
          byYear[y].push(Number(p.price));
        });
        const chart = Object.entries(byYear).map(([y, prices]) => ({
          anno: y, prezzo: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
        })).sort((a, b) => a.anno - b.anno);
        setPriceHistory(chart);
      }).catch(() => {}).finally(() => setLoading(false));
  }, [wineId, wineData]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16, marginBottom: 8 }}>
      {/* Price history chart */}
      <div style={{ background: "#1a2535", borderRadius: 16, padding: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: "#e2e8f0" }}>
          📈 {media.scorecard?.name || "Vino di Riferimento"} — Storico Prezzi
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Fonte: VinoInvest DB / Liv-ex</div>
        {loading ? (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>Caricamento dati...</div>
        ) : priceHistory.length > 1 ? (
          <div style={{ overflowX: "auto" }}>
            <ComposedChart width={380} height={180} data={priceHistory} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="anno" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickFormatter={v => `€${v}`} />
              <Tooltip contentStyle={{ background: "#1a2535", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, color: "#e2e8f0" }} formatter={(v) => [`€${v}`, "Prezzo medio"]} />
              <Area type="monotone" dataKey="prezzo" fill="rgba(201,162,39,0.15)" stroke={GOLD} strokeWidth={2} />
            </ComposedChart>
          </div>
        ) : (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 13 }}>Dati non disponibili per questo vino</div>
        )}
      </div>

      {/* Region comparison chart */}
      <div style={{ background: "#1a2535", borderRadius: 16, padding: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: "#e2e8f0" }}>🌍 ROI Regioni — 5 Anni</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Fonte: Liv-ex Fine Wine 100 Index 2024</div>
        <div style={{ overflowX: "auto" }}>
          <ComposedChart width={380} height={180} data={REGION_COMPARISON} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="region" width={130} tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "#1a2535", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, color: "#e2e8f0" }} formatter={(v) => [`${v}%`, "ROI 5 anni"]} />
            <Bar dataKey="roi5y" fill={GOLD} radius={[0, 4, 4, 0]} />
          </ComposedChart>
        </div>
      </div>
    </div>
  );
}

// ── INTERACTIVE SVG MAP ───────────────────────────────────────────────────────
const FRANCE_REGIONS = [
  { id: "bordeaux",   name: "Bordeaux",  x: 145, y: 260, w: 70, h: 60, color: "#722F37", wines: "Lafite, Mouton, Pétrus, Haut-Brion",     desc: "45% del mercato fine wine mondiale" },
  { id: "bourgogne",  name: "Borgogna",  x: 310, y: 200, w: 50, h: 90, color: "#1e40af", wines: "DRC, Leroy, Rousseau, Dujac",            desc: "+35% in 5 anni — mercato in esplosione" },
  { id: "champagne",  name: "Champagne", x: 330, y: 100, w: 70, h: 55, color: "#065f46", wines: "Dom Pérignon, Krug, Cristal, Bollinger",  desc: "+22% in 5 anni — domanda asiatica forte" },
  { id: "rhone",      name: "Rodano",    x: 310, y: 300, w: 45, h: 70, color: "#7c2d12", wines: "Châteauneuf-du-Pape, Hermitage",          desc: "Mercato di nicchia, qualità alta" },
  { id: "alsace",     name: "Alsazia",   x: 390, y: 150, w: 30, h: 70, color: "#4a044e", wines: "Trimbach, Hugel, Zind-Humbrecht",         desc: "Riesling da investimento, prezzi bassi" },
];

const ITALY_REGIONS = [
  { id: "piemonte",   name: "Piemonte",  x: 80,  y: 80,  w: 85, h: 70, color: "#722F37", wines: "Barolo, Barbaresco, Gaja, G. Conterno",  desc: "Nebbiolo: +18% in 10 anni su Liv-ex" },
  { id: "toscana",    name: "Toscana",   x: 130, y: 200, w: 90, h: 80, color: "#1e40af", wines: "Brunello, Sassicaia, Ornellaia, Masseto", desc: "Super Tuscans: riconoscimento globale" },
  { id: "veneto",     name: "Veneto",    x: 200, y: 80,  w: 80, h: 65, color: "#065f46", wines: "Amarone, Bertani, Quintarelli",           desc: "Amarone: mercato stabile, crescita lenta" },
  { id: "sicilia",    name: "Sicilia",   x: 160, y: 390, w: 90, h: 55, color: "#7c2d12", wines: "Etna DOC, Cornelissen, Passopisciaro",    desc: "Mercato emergente — prezzi ancora accessibili" },
];

function MapSection({ mapType, activeRegion, setActiveRegion }) {
  const regions = mapType === "france" ? FRANCE_REGIONS : ITALY_REGIONS;
  const active = regions.find(r => r.id === activeRegion);

  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: 24, marginBottom: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Regioni vinicole — {mapType === "france" ? "Francia" : "Italia"}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Clicca su una regione per i dettagli</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        {/* SVG Map */}
        <svg viewBox="0 0 500 480" style={{ width: "100%", maxWidth: 320, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
          {/* Background */}
          <rect x="0" y="0" width="500" height="480" fill="rgba(11,18,32,0.5)" rx="12" />
          {/* Country outline hint */}
          <text x="250" y="440" textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="80" fontWeight="900">{mapType === "france" ? "FR" : "IT"}</text>
          {/* Region blocks */}
          {regions.map(r => (
            <g key={r.id} onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)} style={{ cursor: "pointer" }}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="8" fill={activeRegion === r.id ? r.color : `${r.color}88`} stroke={activeRegion === r.id ? "#fff" : r.color} strokeWidth={activeRegion === r.id ? 2 : 1} style={{ transition: "all 0.2s" }} />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="11" fontWeight="700">{r.name}</text>
            </g>
          ))}
        </svg>
        {/* Info panel */}
        <div>
          {active ? (
            <div style={{ background: `${active.color}22`, border: `1px solid ${active.color}55`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 6 }}>{active.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>📈 {active.desc}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 6 }}>Produttori chiave:</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}>{active.wines}</div>
            </div>
          ) : (
            <div style={{ color: "#475569", fontSize: 14, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👆</div>
              Clicca su una regione per vedere produttori, trend e note di investimento
            </div>
          )}
          {/* Region list */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {regions.map(r => (
              <button key={r.id} onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)} style={{ background: activeRegion === r.id ? `${r.color}33` : "rgba(255,255,255,0.04)", border: `1px solid ${activeRegion === r.id ? r.color : "rgba(255,255,255,0.07)"}`, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: r.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: activeRegion === r.id ? 700 : 400 }}>{r.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── VIDEO SECTION ─────────────────────────────────────────────────────────────
function VideoSection({ videoQuery, lessonTitle }) {
  const ytUrl = `https://www.youtube.com/results?search_query=${videoQuery}`;
  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: 24, marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 80, height: 56, background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 28 }}>▶️</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{lessonTitle}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Video educativi selezionati su YouTube. Contenuto gratuito da canali verificati (Wine Folly, Decanter, WSET).</div>
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: 8, padding: "8px 16px", color: "#f87171", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            ▶ Guarda su YouTube →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── CONTENT SECTION (Ghost style) ────────────────────────────────────────────
function ContentSection({ lesson }) {
  const paragraphs = lesson.content?.split('\n\n').filter(Boolean) || [];
  return (
    <div style={{ background: "#1a2535", borderRadius: 16, padding: 32, marginBottom: 8 }}>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ fontSize: 15, lineHeight: 1.9, color: "#cbd5e1", marginBottom: 20, fontFamily: "Georgia, serif" }}>{para}</p>
      ))}
    </div>
  );
}

// ── WINE SCORECARD ────────────────────────────────────────────────────────────
function ScoreGauge({ value, label, color }) {
  const r = 26, cx = 32, cy = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">{value}</text>
      </svg>
      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ScorecardSection({ scorecard }) {
  if (!scorecard) return null;
  const riskColor = scorecard.risk < 30 ? "#4ade80" : scorecard.risk < 60 ? "#f59e0b" : "#f87171";
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(114,47,55,0.2) 0%, #1a2535 100%)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 16, padding: 24, marginBottom: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🍷</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{scorecard.name}</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>{scorecard.producer}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>📍 {scorecard.region}</div>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <ScoreGauge value={scorecard.score} label="AI Score" color={GOLD} />
          <ScoreGauge value={100 - scorecard.risk} label="Basso Rischio" color="#4ade80" />
          <ScoreGauge value={scorecard.liquidity} label="Liquidità" color="#60a5fa" />
          <ScoreGauge value={scorecard.growth} label="Crescita" color="#a78bfa" />
        </div>
        <div style={{ flex: "0 0 auto", background: "rgba(201,162,39,0.1)", borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>PUNTEGGIO CRITICA</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: GOLD }}>{scorecard.score}/100</div>
          <div style={{ fontSize: 11, color: scorecard.score >= 97 ? "#4ade80" : "#f59e0b" }}>{scorecard.score >= 97 ? "★ Eccezionale" : "★★ Eccellente"}</div>
        </div>
      </div>
    </div>
  );
}

// ── EXERCISE SECTION ──────────────────────────────────────────────────────────
function ExerciseSection({ exercise }) {
  return (
    <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 14, padding: 22, marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 10, letterSpacing: "0.05em" }}>PRATICA IMMEDIATA SU VINOINVEST</div>
      <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8 }}>{exercise}</div>
      <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 8, padding: "8px 14px", color: GOLD, textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
        Apri VinoInvest →
      </a>
    </div>
  );
}

// ── QUIZ SECTION ──────────────────────────────────────────────────────────────
function QuizSection({ quiz, answers, setAnswers, onSubmit }) {
  const allAnswered = Object.keys(answers).length === quiz.length;
  return (
    <div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Rispondi a tutte le domande. Minimo 60% per completare la lezione e guadagnare XP.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {quiz.map((q, qi) => (
          <div key={qi} style={{ background: "#1a2535", borderRadius: 14, padding: 22, border: answers[qi] !== undefined ? "1px solid rgba(201,162,39,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>
              <span style={{ color: GOLD, marginRight: 8 }}>{qi + 1}.</span>{q.q}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.opts.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))} style={{ background: answers[qi] === oi ? "rgba(201,162,39,0.18)" : "rgba(255,255,255,0.03)", border: `2px solid ${answers[qi] === oi ? GOLD : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "11px 16px", textAlign: "left", color: answers[qi] === oi ? "#fff" : "#94a3b8", cursor: "pointer", fontSize: 14, transition: "all 0.15s", fontWeight: answers[qi] === oi ? 600 : 400 }}>
                  <span style={{ color: GOLD, marginRight: 8, fontWeight: 700 }}>{["A","B","C","D"][oi]}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "#475569" }}>{Object.keys(answers).length}/{quiz.length} risposte</div>
        <button onClick={onSubmit} disabled={!allAnswered} style={{ background: allAnswered ? GOLD : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, color: allAnswered ? "#0b1220" : "#475569", cursor: allAnswered ? "pointer" : "default", fontSize: 15 }}>
          Consegna Quiz →
        </button>
      </div>
    </div>
  );
}

// ── QUIZ RESULT ───────────────────────────────────────────────────────────────
function QuizResult({ score, quiz, answers, xpEarned, passed, onRetry }) {
  return (
    <div>
      <div style={{ background: passed ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${passed ? "#4ade80" : "#f87171"}`, borderRadius: 18, padding: 32, textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{passed ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 44, fontWeight: 900, color: passed ? "#4ade80" : "#f87171", marginBottom: 8 }}>{score}%</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{passed ? "Lezione completata!" : "Non ancora sufficiente"}</div>
        <div style={{ color: "#94a3b8", marginBottom: passed ? 0 : 20 }}>
          {passed ? `+${xpEarned} XP guadagnati. Continua al prossimo passo.` : "Rileggi il contenuto e riprova. Ci vuole il 60% per completare."}
        </div>
        {!passed && <button onClick={onRetry} style={{ background: GOLD, border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, color: "#0b1220", cursor: "pointer" }}>Riprova</button>}
      </div>
      {/* Revisione */}
      <div style={{ background: "#1a2535", borderRadius: 14, padding: 24 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, color: "#94a3b8", fontSize: 12, letterSpacing: "0.05em" }}>REVISIONE RISPOSTE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {quiz.map((q, qi) => {
            const correct = answers[qi] === q.ans;
            return (
              <div key={qi} style={{ borderLeft: `3px solid ${correct ? "#4ade80" : "#f87171"}`, paddingLeft: 16, paddingBottom: 4 }}>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>{q.q}</div>
                {!correct && <div style={{ fontSize: 13, color: "#f87171", marginBottom: 3 }}>✗ Risposta tua: {q.opts[answers[qi]]}</div>}
                <div style={{ fontSize: 13, color: "#4ade80", marginBottom: 6 }}>✓ Corretta: {q.opts[q.ans]}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>{q.exp}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LESSON NAV FOOTER ─────────────────────────────────────────────────────────
function LessonNavFooter({ prevLesson, nextLesson, course, navigate, submitted, passed }) {
  return (
    <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => navigate("/academy")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px", color: "#64748b", cursor: "pointer", fontSize: 13 }}>
          🎓 Academy
        </button>
        <button onClick={() => navigate(`/academy/course/${course.slug}`)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
          ← {course.title}
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {prevLesson && (
          <button onClick={() => navigate(`/academy/lesson/${prevLesson.id}`)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 16px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
            ← Lez. {prevLesson.order}
          </button>
        )}
        {nextLesson ? (
          <button onClick={() => navigate(`/academy/lesson/${nextLesson.id}`)} disabled={submitted && !passed} style={{ background: GOLD, border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 14 }}>
            Lez. {nextLesson.order}: {nextLesson.title} →
          </button>
        ) : (
          <button onClick={() => navigate(`/academy/course/${course.slug}`)} style={{ background: "#4ade80", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 14 }}>
            🏆 Corso Completato! →
          </button>
        )}
      </div>
    </div>
  );
}
