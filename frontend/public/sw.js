// VinoInvest Service Worker — offline cache strategy
const CACHE_VERSION = "vino-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE    = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
];

const API_CACHE_PATTERNS = [
  /\/api\/wines$/,
  /\/api\/market\/index/,
  /\/api\/currency\/rates/,
  /\/api\/news/,
  /\/api\/stats\/public/,
  /\/api\/rates/,
];

const API_BYPASS_PATTERNS = [
  /\/api\/auth/,
  /\/api\/payments/,
  /\/api\/orders/,
  /\/api\/agent/,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC_CACHE && k !== API_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== "GET") return;

  // Skip auth/payment API
  if (API_BYPASS_PATTERNS.some(p => p.test(url.pathname))) return;

  // API: stale-while-revalidate
  if (API_CACHE_PATTERNS.some(p => p.test(url.pathname))) {
    e.respondWith(
      caches.open(API_CACHE).then(async cache => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => null);

        return cached || await fetchPromise;
      })
    );
    return;
  }

  // Static: cache-first
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok && res.type !== "opaque") {
          caches.open(STATIC_CACHE).then(c => c.put(request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (request.destination === "document") return caches.match("/offline.html");
        return caches.match("/index.html");
      });
    })
  );
});

// Push notification handler
self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  const title = data.title || "VinoInvest Alert";
  const options = {
    body: data.body || "Aggiornamento disponibile",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: { url: data.url || "/" },
    actions: data.actions || [],
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(clients.openWindow(url));
});
