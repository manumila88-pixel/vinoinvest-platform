import React, { useState, useEffect, useRef } from "react";

const STEPS = [
  {
    id: "search",
    selector: ".hero-search-input, .searchInput",
    title: "🔍 Cerca vini",
    text: "Digita nome, produttore o regione. La ricerca copre 50.000+ vini con suggerimenti in tempo reale.",
    placement: "bottom",
  },
  {
    id: "winecard",
    selector: ".wineCard",
    title: "📊 Wine Card",
    text: "Ogni card mostra prezzo, AI Score, segnale Buy/Sell e badge di rischio. Clicca per aprire il dettaglio con grafico prezzi.",
    placement: "right",
  },
  {
    id: "score",
    selector: ".score-label",
    title: "🤖 AI Score",
    text: "Punteggio 0-100: considera rating critico, annata, produttore e trend. Score > 80 = elevato potenziale d'investimento.",
    placement: "left",
  },
  {
    id: "portfolio",
    selector: "[data-tour='portfolio-tab'], .sidebar button",
    title: "💼 Portfolio",
    text: "Sezione Portfolio: traccia ROI, P&L, diversificazione e analisi AI. Aggiungi vini con un click.",
    placement: "right",
    fallbackText: "Clicca su 'Portfolio' nel menu laterale per vedere le tue posizioni e ricevere analisi AI.",
  },
  {
    id: "chat",
    selector: "[title='AI Wine Advisor']",
    title: "🤖 AI Advisor",
    text: "Il bottone 🍷 in basso a destra apre il consulente AI. Chiedi consigli, analisi del portfolio, notizie di mercato e molto altro.",
    placement: "top",
  },
];

function getElementRect(selector) {
  const candidates = Array.from(document.querySelectorAll(selector));
  const el = candidates.find(e => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  if (!el) return null;
  return { rect: el.getBoundingClientRect(), el };
}

function Highlight({ rect, padding = 8 }) {
  if (!rect) return null;
  const { top, left, width, height } = rect;
  return (
    <div
      style={{
        position: "fixed",
        top: top - padding,
        left: left - padding,
        width: width + padding * 2,
        height: height + padding * 2,
        borderRadius: "var(--vi-radius-md)",
        border: "2px solid var(--vi-accent)",
        boxShadow: "0 0 0 4000px rgba(2,6,23,0.82), 0 0 24px rgba(201,162,39,0.5)",
        pointerEvents: "none",
        zIndex: 10001,
        animation: "tourPulse 1.8s ease-in-out infinite",
        transition: "all 0.35s ease",
      }}
    />
  );
}

function Tooltip({ rect, step, stepIndex, totalSteps, onNext, onPrev, onSkip, placement }) {
  const TIP_W = 280;
  const TIP_H = 160;
  const PAD = 16;

  let top = 0, left = 0;
  if (rect) {
    const { top: rt, left: rl, width: rw, height: rh } = rect;
    const vw = window.innerWidth, vh = window.innerHeight;
    if (placement === "bottom") {
      top = rt + rh + PAD;
      left = Math.max(PAD, Math.min(rl + rw / 2 - TIP_W / 2, vw - TIP_W - PAD));
    } else if (placement === "top") {
      top = rt - TIP_H - PAD;
      left = Math.max(PAD, Math.min(rl + rw / 2 - TIP_W / 2, vw - TIP_W - PAD));
    } else if (placement === "right") {
      top = Math.max(PAD, Math.min(rt + rh / 2 - TIP_H / 2, vh - TIP_H - PAD));
      left = Math.min(rl + rw + PAD, vw - TIP_W - PAD);
    } else {
      top = Math.max(PAD, Math.min(rt + rh / 2 - TIP_H / 2, vh - TIP_H - PAD));
      left = Math.max(PAD, rl - TIP_W - PAD);
    }
    // Clamp to viewport
    top = Math.max(PAD, Math.min(top, vh - TIP_H - PAD));
    left = Math.max(PAD, Math.min(left, vw - TIP_W - PAD));
  } else {
    // Centered fallback
    top = window.innerHeight / 2 - TIP_H / 2;
    left = window.innerWidth / 2 - TIP_W / 2;
  }

  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="vi-card" style={{
      position: "fixed", top, left, width: TIP_W, zIndex: 10002,
      background: "var(--vi-bg)",
      borderRadius: "var(--vi-radius-md)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,162,39,0.1)",
      padding: 18,
      animation: "tourTooltipIn 0.22s ease-out",
    }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= stepIndex ? "var(--vi-accent)" : "var(--vi-border)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--vi-text)", marginBottom: 8, lineHeight: 1.3 }}>
        {step.title}
      </div>
      <div style={{ fontSize: 12, color: "var(--vi-text-dim)", lineHeight: 1.6, marginBottom: 14 }}>
        {rect ? step.text : (step.fallbackText || step.text)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={onSkip}
          style={{ background: "none", border: "none", color: "#3a5a7a", cursor: "pointer", fontSize: 12 }}
        >
          Salta tour
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          {stepIndex > 0 && (
            <button
              onClick={onPrev}
              aria-label="Previous step"
              style={{
                padding: "6px 14px", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)",
                background: "transparent", color: "var(--vi-text-dim)", cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}
            >←</button>
          )}
          <button
            onClick={onNext}
            style={{
              padding: "6px 16px", borderRadius: "var(--vi-radius-sm)", border: "none",
              background: isLast ? `linear-gradient(135deg,var(--vi-positive),#16a34a)` : `linear-gradient(135deg,#9b1c4a,var(--vi-accent))`,
              color: isLast ? "#000" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700,
            }}
          >
            {isLast ? "Fine ✓" : "Avanti →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const TOUR_KEY = "vino_tour_v1";
export function isTourCompleted() { return localStorage.getItem(TOUR_KEY) === "true"; }
export function resetTour() { localStorage.removeItem(TOUR_KEY); }

export default function GuidedTour({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const rafRef = useRef(null);

  const step = STEPS[stepIndex];

  // Track element position (handles scroll/resize)
  useEffect(() => {
    function update() {
      const found = getElementRect(step.selector);
      setTargetRect(found ? found.rect : null);
      // Scroll element into view
      if (found) {
        found.el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    }
    update();
    rafRef.current = setInterval(update, 500);
    return () => clearInterval(rafRef.current);
  }, [stepIndex, step.selector]);

  function next() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(s => s + 1);
    } else {
      localStorage.setItem(TOUR_KEY, "true");
      onComplete?.();
    }
  }
  function prev() { setStepIndex(s => Math.max(0, s - 1)); }
  function skip() { localStorage.setItem(TOUR_KEY, "true"); onComplete?.(); }

  return (
    <>
      {/* Dark overlay (pointer-events on overlay, not highlight) */}
      <div
        onClick={skip}
        style={{
          position: "fixed", inset: 0, zIndex: 10000,
          pointerEvents: "auto",
        }}
      />
      <Highlight rect={targetRect} />
      <Tooltip
        rect={targetRect}
        step={step}
        stepIndex={stepIndex}
        totalSteps={STEPS.length}
        onNext={next}
        onPrev={prev}
        onSkip={skip}
        placement={step.placement}
      />
      <style>{`
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 4000px rgba(2,6,23,0.82), 0 0 24px rgba(201,162,39,0.4); }
          50%       { box-shadow: 0 0 0 4000px rgba(2,6,23,0.82), 0 0 36px rgba(201,162,39,0.7); }
        }
        @keyframes tourTooltipIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
