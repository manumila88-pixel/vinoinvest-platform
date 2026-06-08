const THEME_KEY = "vino_theme";

export function getSavedTheme() {
  return "dark";
}

export function applyTheme(_theme) {
  document.documentElement.setAttribute("data-theme", "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#C9A227");
  try { localStorage.setItem(THEME_KEY, "dark"); } catch (_) {}
}
