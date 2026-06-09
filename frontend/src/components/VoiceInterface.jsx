import React, { useState, useRef, useEffect } from "react";

const SUPPORTED = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

export default function VoiceInterface({ onTranscript, disabled = false }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported] = useState(SUPPORTED);
  const recRef = useRef(null);

  useEffect(() => () => recRef.current?.abort(), []);

  function startListening() {
    if (!supported || listening) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recRef.current = rec;

    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = navigator.language || "en-US";
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => { setListening(false); recRef.current = null; };
    rec.onerror = () => { setListening(false); recRef.current = null; };

    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        onTranscript?.(t);
        setTranscript("");
        if (navigator.vibrate) navigator.vibrate(50);
      }
    };

    rec.start();
  }

  function stopListening() {
    recRef.current?.stop();
    setListening(false);
  }

  if (!supported) return null;

  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <button
        onClick={listening ? stopListening : startListening}
        disabled={disabled}
        title={listening ? "Stop listening" : "Voice input"}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        style={{
          width: 40, height: 40,
          borderRadius: "50%",
          border: `2px solid ${listening ? "#ef4444" : "rgba(201,162,39,0.4)"}`,
          background: listening ? "rgba(239,68,68,0.15)" : "rgba(201,162,39,0.08)",
          color: listening ? "#ef4444" : "#C9A227",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
          transition: "all 0.2s",
          position: "relative",
          animation: listening ? "pulse 1.2s ease-in-out infinite" : "none",
        }}
      >
        🎙️
        {listening && (
          <span style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: "2px solid rgba(239,68,68,0.4)",
            animation: "ripple 1s linear infinite",
            pointerEvents: "none",
          }} />
        )}
      </button>

      {transcript && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0f172a",
          border: "1px solid rgba(201,162,39,0.2)",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 12,
          color: "#e2e8f0",
          whiteSpace: "nowrap",
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          zIndex: 9999,
          pointerEvents: "none",
        }}>
          {transcript}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes ripple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.5);opacity:0} }
      `}</style>
    </div>
  );
}

// TTS helper — speak text using Web Speech API
export function speakText(text, lang = navigator.language || "en-US") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 1.0;
  utt.pitch = 1.0;
  window.speechSynthesis.speak(utt);
}
