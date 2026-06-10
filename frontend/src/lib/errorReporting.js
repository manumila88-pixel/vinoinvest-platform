// Sentry is optional — only active when VITE_SENTRY_DSN is set and @sentry/react installed.
let Sentry = null;
let _initialized = false;

async function loadSentry() {
  if (Sentry) return Sentry;
  try {
    Sentry = await import("@sentry/react");
  } catch {
    Sentry = null;
  }
  return Sentry;
}

export async function init() {
  const dsn = import.meta.env?.VITE_SENTRY_DSN;
  if (_initialized || !dsn) return;
  const sdk = await loadSentry();
  if (!sdk) return;
  _initialized = true;
  sdk.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.5,
    integrations: [sdk.browserTracingIntegration()],
  });
}

export function reportError(error, context = {}) {
  if (import.meta.env.DEV) console.error("[errorReporting]", error, context);
  if (_initialized && Sentry) Sentry.captureException(error, { extra: context });
}

export function reportMessage(message, level = "info") {
  if (import.meta.env.DEV) (console[level] ?? console.log)("[errorReporting]", message);
  if (_initialized && Sentry) Sentry.captureMessage(message, level);
}
