// URL pubblico del sito (frontend) — UNICA fonte di verità nel codice backend.
// Al lancio del dominio: setta SITE_URL su Render oppure esegui
//   node scripts/set-site-url.js <nuovo-url>
// che aggiorna anche questo fallback. Vedi STATO_PROGETTO.md → "CAMBIO DOMINIO".
export const SITE_URL = (process.env.SITE_URL || "https://vinoinvest-platform.vercel.app").replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
