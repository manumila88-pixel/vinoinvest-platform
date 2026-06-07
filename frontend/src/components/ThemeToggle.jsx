import React, { useState, useEffect } from "react";
import { getSavedTheme, applyTheme } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => { applyTheme(theme); }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 16,
        lineHeight: 1,
        color: "var(--text-primary, #e2e8f0)",
        transition: "background 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
