const THEME_KEY = "vino_theme";

export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) {}
  return "dark";
}

export function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0b1220" : "#f8fafc");
  try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}

  // CSS variables for light mode override
  const root = document.documentElement;
  if (isDark) {
    root.style.removeProperty("--bg-primary");
    root.style.removeProperty("--bg-secondary");
    root.style.removeProperty("--text-primary");
    root.style.removeProperty("--text-secondary");
    root.style.removeProperty("--border-color");
    root.style.removeProperty("--card-bg");
  } else {
    root.style.setProperty("--bg-primary", "#f8fafc");
    root.style.setProperty("--bg-secondary", "#ffffff");
    root.style.setProperty("--text-primary", "#0f172a");
    root.style.setProperty("--text-secondary", "#475569");
    root.style.setProperty("--border-color", "rgba(15,23,42,0.1)");
    root.style.setProperty("--card-bg", "rgba(255,255,255,0.9)");
    // Override body background for light mode
    document.body.style.background = "#f0f4f8";
    document.body.style.color = "#0f172a";
  }
  if (isDark) {
    document.body.style.removeProperty("background");
    document.body.style.removeProperty("color");
  }
}
