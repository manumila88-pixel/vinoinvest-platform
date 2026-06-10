// PostHog analytics — no-op when VITE_POSTHOG_KEY is not set
const KEY = import.meta.env?.VITE_POSTHOG_KEY;
const HOST = import.meta.env?.VITE_POSTHOG_HOST || "https://app.posthog.com";

let ph = null;

export async function initAnalytics() {
  if (!KEY || ph) return;
  try {
    const { default: posthog } = await import("posthog-js");
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      persistence: "localStorage",
    });
    ph = posthog;
  } catch {
    // posthog-js not installed — silent skip
  }
}

export function track(event, properties = {}) {
  ph?.capture(event, properties);
}

export function identifyUser(userId, traits = {}) {
  ph?.identify(userId, traits);
}

export function resetUser() {
  ph?.reset();
}
