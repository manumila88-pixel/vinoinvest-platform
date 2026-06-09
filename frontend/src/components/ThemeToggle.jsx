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
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="vi-interactive"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "var(--vi-radius-sm)",
        padding: "6px 10px",
        cursor: "pointer",
        fontSize: 16,
        lineHeight: 1,
        color: "var(--vi-text)",
        transition: "background var(--vi-dur) var(--vi-ease)",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
