import React, { useState, useRef, useCallback } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function LabelScanner({ onResult, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | streaming | scanning | result | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setPhase("streaming");
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (e) {
      setError("Camera access denied. Please allow camera permissions.");
      setPhase("error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    stopCamera();
    analyzeLabel(dataUrl);
  }, [stopCamera]);

  async function analyzeLabel(imageBase64) {
    setPhase("scanning");
    setError(null);
    try {
      const res = await fetch(`${API}/api/label-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: imageBase64 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Scan failed");
      }
      const data = await res.json();
      setResult(data);
      setPhase("result");
    } catch (e) {
      setError(e.message || "Could not analyze label");
      setPhase("error");
    }
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPreview(ev.target.result);
      analyzeLabel(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function reset() {
    setPhase("idle");
    setResult(null);
    setError(null);
    setPreview(null);
  }

  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);

  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: 480 }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(30,41,59,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: 0 }}>📸 Label Scanner</h3>
          <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Powered by Claude Vision AI</p>
        </div>
        {onClose && <button onClick={() => { stopCamera(); onClose(); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20 }}>×</button>}
      </div>

      <div style={{ padding: 20 }}>
        {/* Idle state */}
        {phase === "idle" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🍷</div>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Point your camera at a wine label or upload a photo.<br />Our AI will identify the wine instantly.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {isMobile && (
                <button onClick={startCamera} style={{ padding: "12px", background: "#C9A227", color: "#020617", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                  📷 Open Camera
                </button>
              )}
              <label style={{ padding: "12px", background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 14, textAlign: "center", display: "block" }}>
                📁 Upload Photo
                <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
              </label>
            </div>
          </div>
        )}

        {/* Camera streaming */}
        {phase === "streaming" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 16, background: "#000" }}>
              <video ref={videoRef} playsInline muted style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }} />
              {/* Overlay guide */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: 200, height: 120, border: "2px solid #C9A227", borderRadius: 8, opacity: 0.7 }} />
              </div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 16 }}>Center the wine label in the frame</p>
            <button onClick={capturePhoto} style={{ padding: "14px 32px", background: "#C9A227", color: "#020617", border: "none", borderRadius: 30, fontWeight: 700, cursor: "pointer", fontSize: 16 }}>
              📸 Capture
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {/* Scanning */}
        {phase === "scanning" && (
          <div style={{ textAlign: "center", padding: 24 }}>
            {preview && <img src={preview} alt="Captured" style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 10, marginBottom: 16, opacity: 0.6 }} />}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#C9A227" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(201,162,39,0.3)", borderTopColor: "#C9A227", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 14 }}>AI analysing label...</span>
            </div>
            <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>Claude Vision is reading the label</p>
          </div>
        )}

        {/* Result */}
        {phase === "result" && result && (
          <div>
            {preview && <img src={preview} alt="Label" style={{ width: "100%", maxHeight: 140, objectFit: "contain", borderRadius: 10, marginBottom: 16 }} />}
            <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 13 }}>✓ Label identified</span>
                <span style={{ fontSize: 11, color: "#64748b" }}>Confidence: {result.confidence}%</span>
              </div>
              {[
                { label: "Wine", value: result.wine_name },
                { label: "Producer", value: result.producer },
                { label: "Vintage", value: result.vintage },
                { label: "Region", value: result.region },
                { label: "Type", value: result.type },
                { label: "Country", value: result.country },
              ].map(f => f.value && (
                <div key={f.label} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#64748b", minWidth: 60 }}>{f.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{f.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={reset} style={{ flex: 1, padding: 10, background: "rgba(30,41,59,0.5)", color: "#94a3b8", border: "1px solid rgba(30,41,59,0.6)", borderRadius: 8, cursor: "pointer" }}>
                Scan Another
              </button>
              {result.search_query && (
                <a
                  href={`/?search=${encodeURIComponent(result.search_query)}`}
                  onClick={() => onResult?.(result)}
                  style={{ flex: 2, padding: 10, background: "#C9A227", color: "#020617", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  Find in Database →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <p style={{ color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</p>
            <button onClick={reset} style={{ padding: "10px 24px", background: "#C9A227", color: "#020617", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
