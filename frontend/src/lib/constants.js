export const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
export const ADMIN_EMAIL = "manumila88@gmail.com";
export const QUIZ_PASS_THRESHOLD = 70;

// URL pubblico del sito — UNICA fonte di verità nel codice frontend.
// Al lancio del dominio: setta VITE_SITE_URL su Vercel oppure esegui
//   node scripts/set-site-url.js <nuovo-url>
// che aggiorna anche questo fallback. Vedi STATO_PROGETTO.md → "CAMBIO DOMINIO".
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://vinoinvest-platform.vercel.app").replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const APP_URL = SITE_URL;
