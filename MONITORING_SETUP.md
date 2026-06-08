# VinoInvest — Monitoring Setup Guide

> Zero-cost monitoring stack for production: UptimeRobot (uptime) + Sentry (errors)

---

## 1. UptimeRobot — Uptime & Alerting (Free)

**Sign up**: https://uptimerobot.com (free plan: 50 monitors, 5min intervals)

### Monitors to create

| Monitor Name | URL | Type | Alert Threshold |
|---|---|---|---|
| VinoInvest Frontend | `https://vinoinvest-platform.vercel.app/` | HTTPS | 2 failures |
| Backend Health | `https://vinoinvest-backend-2.onrender.com/api/health` | HTTPS (keyword: `"status":"ok"`) | 2 failures |
| Backend Wines API | `https://vinoinvest-backend-2.onrender.com/api/wines?limit=1` | HTTPS | 3 failures |
| Backend Trending | `https://vinoinvest-backend-2.onrender.com/api/trending` | HTTPS | 3 failures |
| Sitemap | `https://vinoinvest-platform.vercel.app/sitemap.xml` | HTTPS | 3 failures |

### Alert contacts
1. **Email**: manumila88@gmail.com
2. **Slack** (optional): Create webhook via Slack App settings → Integrations

### Setup steps
```
1. Login to uptimerobot.com
2. Click "Add New Monitor"
3. Type: HTTP(s)
4. Friendly name: "VinoInvest Backend Health"
5. URL: https://vinoinvest-backend-2.onrender.com/api/health
6. Monitoring Interval: 5 minutes
7. Alert contacts: add your email
8. Keyword monitoring: tick "Alert when keyword not exists", keyword: "ok"
9. Save. Repeat for all URLs above.
```

### Status page (public)
Create a public status page at `status.uptimerobot.com/<your-page-slug>` — share with users.

---

## 2. Sentry — Error Tracking (Free: 5k errors/month)

**Sign up**: https://sentry.io (free Hobby plan)

### Frontend (React)

```bash
cd frontend
npm install @sentry/react
```

Add to `frontend/src/main.jsx` (before React renders):
```js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
  ],
  tracesSampleRate: 0.1,      // 10% of transactions
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
  release: "vinoinvest@1.0.0",
});
```

Wrap App with error boundary in `main.jsx`:
```jsx
<Sentry.ErrorBoundary fallback={<p>Un errore imprevisto. Ricarica la pagina.</p>}>
  <App />
</Sentry.ErrorBoundary>
```

Add DSN to Vercel env vars:
```
VITE_SENTRY_DSN = https://xxxx@oyyy.ingest.sentry.io/zzzz
```

### Backend (Node.js/Express)

```bash
cd backend
npm install @sentry/node
```

Add to top of `backend/src/server.js` (before any middleware):
```js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.05,
  environment: process.env.NODE_ENV || "production",
  release: "vinoinvest-backend@1.0.0",
});
app.use(Sentry.Handlers.requestHandler());
// ... existing middleware ...
app.use(Sentry.Handlers.errorHandler()); // after all routes
```

Add to Render env vars:
```
SENTRY_DSN = https://xxxx@oyyy.ingest.sentry.io/zzzz
```

---

## 3. Vercel Analytics (Built-in — Zero config)

Enable in Vercel dashboard:
```
Project → Analytics → Enable
```

Tracks: Core Web Vitals (LCP, FID, CLS), page views, unique visitors.

---

## 4. Log monitoring

Backend logs are on Render dashboard:
- URL: https://dashboard.render.com → vinoinvest-backend-2 → Logs
- Filter for: `ERROR`, `WARN`, `[aiScore]`, `[trending]`

Frontend JS errors appear in:
- Vercel Functions logs (if SSR)
- Browser console (user-side)
- Sentry (after setup above)

---

## 5. Alerts summary

| Alert | Tool | Channel | Trigger |
|---|---|---|---|
| Backend down | UptimeRobot | Email | 2 consecutive failures |
| Frontend down | UptimeRobot | Email | 2 consecutive failures |
| JS error spike | Sentry | Email | >10 new issues/hour |
| Slow response | UptimeRobot | Email | Response >5s |
| Core Web Vitals degraded | Vercel Analytics | Dashboard | Weekly review |

---

## 6. Health check endpoint

The backend exposes `GET /api/health` which returns:
```json
{ "status": "ok", "uptime": 12345, "timestamp": "2026-06-08T..." }
```

UptimeRobot keyword check: `"status":"ok"`

---

*Last updated: 2026-06-08*
