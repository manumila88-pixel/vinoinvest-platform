# Google Search Console Setup — VinoInvest

## Step 1: Add Property

1. Go to https://search.google.com/search-console/welcome
2. Click **Add property** → choose **URL prefix**
3. Enter: `https://vinoinvest-platform.vercel.app`
4. Click **Continue**

## Step 2: Verify Ownership (HTML Tag Method — Fastest)

1. Choose **HTML tag** verification method
2. Copy the meta tag, e.g.:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXX" />
   ```
3. Add it to `frontend/index.html` inside `<head>`:
   ```html
   <head>
     ...
     <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   </head>
   ```
4. Deploy: `git add frontend/index.html && git commit -m "chore(seo): add Google Search Console verification" && git push`
5. Wait ~2 min for Vercel to redeploy, then click **Verify** in Search Console

## Step 3: Submit Sitemap

1. In Search Console → **Sitemaps** → **Add a new sitemap**
2. Enter: `sitemap.xml`
3. Full URL: `https://vinoinvest-platform.vercel.app/sitemap.xml`
4. Click **Submit**

The sitemap is already generated at `/sitemap.xml` (see `vercel.json` rewrites or `frontend/public/sitemap.xml`).

## Step 4: Verify Core Pages Are Indexed

In Search Console → **URL Inspection**, check:
- `https://vinoinvest-platform.vercel.app/`
- `https://vinoinvest-platform.vercel.app/academy`
- `https://vinoinvest-platform.vercel.app/pricing`
- `https://vinoinvest-platform.vercel.app/market-index`
- `https://vinoinvest-platform.vercel.app/landing`

For each, click **Request Indexing**.

## Step 5: Connect to Google Analytics (Optional)

1. Create a GA4 property at https://analytics.google.com
2. Get the Measurement ID: `G-XXXXXXXXXX`
3. Add to `frontend/index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## Step 6: Robots.txt

Already configured at `https://vinoinvest-platform.vercel.app/robots.txt`.

Check it includes:
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://vinoinvest-platform.vercel.app/sitemap.xml
```

## Expected Timeline

- Property verified: immediate
- Pages crawled: 3–7 days
- Appearing in search: 2–4 weeks
- Rank stabilization: 6–12 weeks

## Key URLs

| Resource | URL |
|----------|-----|
| Search Console | https://search.google.com/search-console |
| Sitemap | https://vinoinvest-platform.vercel.app/sitemap.xml |
| Robots.txt | https://vinoinvest-platform.vercel.app/robots.txt |

---

# Google OAuth Setup — VinoInvest (Supabase Auth)

## Step A: Google Cloud Console

1. https://console.cloud.google.com → nuovo progetto **VinoInvest**
2. API e Servizi → Credenziali → **ID client OAuth 2.0** (Applicazione web)
3. URI di reindirizzamento autorizzati:
   ```
   https://xghuyfgftvrhnmuezbbz.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```
4. Copia **Client ID** e **Client Secret**

## Step B: Supabase Dashboard

1. https://app.supabase.com → progetto `xghuyfgftvrhnmuezbbz`
2. Authentication → Providers → **Google** → Enable
3. Incolla Client ID e Client Secret → Salva

## Step C: Variabili d'ambiente

**`frontend/.env.local`:**
```env
VITE_SUPABASE_URL=https://xghuyfgftvrhnmuezbbz.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_BACKEND_URL=https://vinoinvest-backend-2.onrender.com
```

**`backend/.env`:**
```env
SUPABASE_URL=https://xghuyfgftvrhnmuezbbz.supabase.co
SUPABASE_ANON_KEY=<anon_key>
ADMIN_SECRET=<random_secret_for_fallback>
```

## Step D: Admin bypass (senza Supabase configurato)

```bash
curl -H "x-admin-secret: <ADMIN_SECRET>" \
  https://vinoinvest-backend-2.onrender.com/api/admin/stats
```

L'email `manumila88@gmail.com` ha accesso admin automatico via `ADMIN_EMAIL` in `backend/src/middleware/auth.js`.
