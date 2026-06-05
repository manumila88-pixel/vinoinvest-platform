import { useState, useCallback, useEffect, createContext, useContext } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = "info", ms = 3200) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), ms);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: "12px 20px",
            background: t.type === "success" ? "#052e16" : t.type === "error" ? "#2d0606" : "#0b1220",
            border: `1px solid ${t.type === "success" ? "#166534" : t.type === "error" ? "#7f1d1d" : "#1e3a5f"}`,
            borderRadius: 12,
            color: t.type === "success" ? "#4ade80" : t.type === "error" ? "#f87171" : "#93c5fd",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            animation: "fadeInUp 0.25s ease",
            pointerEvents: "auto",
            maxWidth: 320,
          }}>
            {t.type === "success" ? "✓ " : t.type === "error" ? "✗ " : "• "}{t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
