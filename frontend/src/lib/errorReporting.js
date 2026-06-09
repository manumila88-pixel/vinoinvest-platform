// Sentry placeholder — NO key required now. Activate later:
//   1. npm install @sentry/react
//   2. Set VITE_SENTRY_DSN in .env.local / Vercel env vars
//   3. Uncomment the Sentry blocks below

const DSN = typeof import.meta !== "undefined" ? import.meta.env?.VITE_SENTRY_DSN : undefined;

let _initialized = false;

/**
 * Call once in main.jsx before rendering.
 * Does nothing until VITE_SENTRY_DSN is set.
 */
export function init() {
  if (_initialized || !DSN) return;
  _initialized = true;

  // --- Activate Sentry when @sentry/react is installed ---
  // import * as Sentry from "@sentry/react";
  // Sentry.init({
  //   dsn: DSN,
  //   environment: import.meta.env.MODE,
  //   release: import.meta.env.VITE_APP_VERSION,
  //   tracesSampleRate: 0.1,
  //   replaysSessionSampleRate: 0.0,
  //   replaysOnErrorSampleRate: 0.5,
  //   integrations: [Sentry.browserTracingIntegration()],
  // });
  // -------------------------------------------------------

  if (import.meta.env.DEV) {
    console.info("[errorReporting] DSN found — install @sentry/react to activate Sentry");
  }
}

/**
 * Report an exception. Falls back to console.error when Sentry is inactive.
 * @param {Error|unknown} error
 * @param {Record<string,unknown>} [context]
 */
export function reportError(error, context = {}) {
  if (import.meta.env.DEV) {
    console.error("[errorReporting]", error, context);
  }
  // if (_initialized) Sentry.captureException(error, { extra: context });
}

/**
 * Report an informational message or warning.
 * @param {string} message
 * @param {"info"|"warning"|"error"} [level]
 */
export function reportMessage(message, level = "info") {
  if (import.meta.env.DEV) {
    (console[level] ?? console.log)("[errorReporting]", message);
  }
  // if (_initialized) Sentry.captureMessage(message, level);
}
