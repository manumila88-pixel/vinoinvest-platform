# VinoInvest — Launch Checklist

## Backend (Render)

- [ ] Set `STRIPE_SECRET_KEY` to live key (starts with `sk_live_`)
- [ ] Set `RESEND_API_KEY` for transactional emails
- [ ] Set `ADMIN_SECRET` for CLI admin access while Supabase is not configured
- [ ] Set `SUPABASE_URL` + `SUPABASE_ANON_KEY` for token auth
- [ ] Set `ANTHROPIC_API_KEY` for AI Score (falls back to algorithmic score)
- [ ] Set `TELEGRAM_BOT_TOKEN` if Telegram alerts are wanted
- [ ] Verify `DATABASE_URL` is pointing to production DB
- [ ] Verify `/api/health/detailed` returns `{"status":"healthy"}`

## Frontend (Vercel)

- [ ] Set `VITE_BACKEND_URL` = `https://vinoinvest-backend-2.onrender.com`
- [ ] Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- [ ] Set `VITE_STRIPE_PUBLISHABLE_KEY` to live key (starts with `pk_live_`)
- [ ] Enable Umami analytics: set `data-website-id` in `index.html`
- [ ] Verify `/cookies` page works

## Monitoring

- [ ] UptimeRobot: add monitor for `https://vinoinvest-backend-2.onrender.com/api/health`
  - Type: HTTP(s), interval: 5 min, alert on non-200
- [ ] UptimeRobot: add monitor for `https://vinoinvest-platform.vercel.app`
- [ ] Sentry (optional): `npm install @sentry/react` + init in App.jsx
- [ ] Set up alert email in UptimeRobot → `manumila88@gmail.com`

## Pre-launch

- [ ] Run security test: `curl -X POST /api/auth/login -d '{"email":"x","password":"x OR 1=1"}'` → expect 401, not 200
- [ ] Verify Stripe webhook endpoint is active in Stripe dashboard
- [ ] Check CORS: `Origin: https://evil.com` → expect 403
- [ ] Verify rate limit: 10+ rapid requests to `/api/auth/login` → expect 429
- [ ] Check admin guard: unauthenticated GET `/api/admin/stats` → expect 401/503
- [ ] Verify portfolio shows no demo orders when logged in (query fixed)
- [ ] Check exit-intent popup appears on first desktop visit (mouseleave)
- [ ] Verify `/disclaimer`, `/terms`, `/privacy`, `/cookies` routes all load

## SEO

- [ ] Submit sitemap to Google Search Console: `https://vinoinvest-backend-2.onrender.com/api/sitemap.xml`
- [ ] Verify robots.txt at `https://vinoinvest-platform.vercel.app/robots.txt`
- [ ] Check OG image loads: `https://vinoinvest-platform.vercel.app/og-image.jpg`

## Legal

- [ ] Review `/terms` with a lawyer before launch (Italian law, Milan jurisdiction)
- [ ] Review `/privacy` GDPR compliance (Art. 15-22)
- [ ] Ensure `/disclaimer` financial disclaimer is displayed on all pages ✅ (implemented)

## Post-launch

- [ ] Monitor Sentry for JS errors in first 48h
- [ ] Check newsletter subscribe rate from exit-intent popup
- [ ] Verify social proof counters show real DB values
- [ ] Monitor Stripe test mode warning disappears after live keys are set
