# REPORT — Blog Statico: 99 Articoli pubblicati a /blog e /blog/:slug

**Branch:** `feat/blog-static-pages-v2`
**Commit:** `116fbb7`
**Data:** 2026-06-15

---

## Verifica contenuto (pre-pubblicazione)

**7 articoli controllati** (focus Strategia/Portfolio + Confronti):

| Articolo | Numeri trovati | Giudizio |
|----------|---------------|----------|
| `rapporto-rischio-rendimento-vino` | Nessuno | ✅ OK |
| `wine-investment-plan-12-mesi` | Nessuno | ✅ OK |
| `costruire-portfolio-vini-investimento` | "crescite superiori all'inflazione" (qualitativo) | ✅ OK |
| `diversificazione-portfolio-vinicolo` | Nessuno | ✅ OK |
| `orizzonti-temporali-investimento-vino` | Range temporali 3-5/5-15 anni (range generici) | ✅ OK |
| `vino-vs-oro-investimento-alternativo` | Nessuno | ✅ OK |
| `etf-vinicoli-vs-possesso-fisico` | "100-500 euro" threshold ETF, TER qualitativo | ✅ OK |

**Rendimenti percentuali inventati: 0** — nessun articolo riporta "X% annuo" o performance storiche specifiche non documentate.

### 2 file corretti (problemi pre-esistenti)

| File | Problema | Fix |
|------|---------|-----|
| `content/blog/climate-change-vino-investimento.md` | Era uno stub placeholder (nessun contenuto) | Sostituito con la versione completa dalla root del progetto |
| `content/blog/grandi-marche-champagne-investimento.md` | Contenuto corretto ma frontmatter mancante (title, slug, meta_description) | Sostituito con la versione corretta dalla root del progetto |

---

## Cosa è stato costruito

### Architettura

```
content/blog/          <- fonte autoritativa (99 .md)
    |
    v
scripts/gen-blog-data.mjs   <- prebuild script (Node.js)
    |          |           |
    v          v           v
blogManifest.js    public/blog/*.md    public/sitemap-blog.xml
(metadata index)   (serviti da Vercel) (99 URL per Google)
```

### File creati

| File | Dimensione chunk | Cosa fa |
|------|-----------------|---------|
| `scripts/gen-blog-data.mjs` | — | Prebuild: legge content/blog/, genera manifest + copia .md in public/ + sitemap |
| `src/data/blogManifest.js` | nel chunk blog | Array 99 articoli: slug, title, desc, category, reading_time, keywords, audience |
| `src/pages/BlogIndex.jsx` | chunk blog 97kB | Indice /blog: search, filtro categoria (chip), filtro B2C/B2B, grid card |
| `src/pages/BlogPost.jsx` | chunk blog | Articolo /blog/:slug: fetch .md, render via marked, correlati, CTA |
| `public/blog/*.md` (99 file) | ~130kB totale | Markdown serviti staticamente per BlogPost |
| `public/sitemap-blog.xml` | — | 99 URL con lastmod, changefreq monthly, priority 0.7 |

### File modificati

| File | Modifica |
|------|---------|
| `package.json` | build e dev scripts eseguono `gen-blog-data.mjs` prima di vite |
| `vite.config.js` | chunk group `blog` (BlogIndex + BlogPost + marked + blogManifest) |
| `src/App.jsx` | lazy imports BlogIndex + BlogPost; route `/blog` e `/blog/:slug` |
| `public/sitemap-index.xml` | Aggiunto reference a `sitemap-blog.xml` |
| `src/style.css` | CSS `.blog-content` per h1-h3, p, ul, blockquote, a, hr, code |

---

## SEO per ogni articolo (/blog/:slug)

```html
<title>{title} | VinoInvest Blog</title>
<meta name="description" content="{meta_description}" />
<meta name="keywords" content="{keywords}" />
<meta property="og:title" content="{title}" />
<meta property="og:type" content="article" />
<link rel="canonical" href="https://vinoinvest-platform.vercel.app/blog/{slug}" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": ...,
  "description": ...,
  "author": {"@type": "Organization", "name": "VinoInvest"},
  "publisher": {"@type": "Organization", "name": "VinoInvest"},
  "keywords": ...,
  "articleSection": ...,
  "mainEntityOfPage": {"@type": "WebPage", "@id": "..."}
}
</script>
```

---

## Categorizzazione B2C / B2B

| Audience | Categorie | Count |
|----------|-----------|-------|
| `b2b` | Fiscalità, En Primeur, Uscita | 14 articoli |
| `b2c` | Principianti | 5 articoli |
| `both` | Strategia, Rischi, Regioni, Annate, Borgogna, Bordeaux, Champagne, Mercato, Tecnico, Italia, Confronti, Tendenze | 80 articoli |

Nel BlogIndex, il toggle audience:
- "Tutti gli articoli" → mostra 99
- "Investitore individuale" → nasconde i 14 b2b
- "Professionale / B2B" → nasconde i 5 b2c

---

## Categorie per conteggio (17 totali)

```
Strategia 11 · Italia 9 · Mercato 7 · En Primeur 6 · Conservazione 6
Borgogna 6 · Annate 6 · Regioni 6 · Tendenze 5 · Tecnico 5
Principianti 5 · Fiscalità 5 · Bordeaux 5 · Rischi 4 · Confronti 4
Champagne 4 · Uscita 3
```

---

## Build verifica

```
✓ 0 errori, 0 warning critici
✓ blog-BGgt-W2v.js: 97 kB (gzip 27 kB) — lazy chunk
✓ 99 articoli in public/blog/
✓ sitemap-blog.xml con 99 URL
✓ Build completata in 2.42s
```

---

## Nota architetturale

Questo branch (`feat/blog-static-pages-v2`) include anche le feature dei branch precedenti (user-types, personalization) poiché si basa sulla stessa history. Il diff specifico del blog è il commit `116fbb7`.

Il blog statico coesiste con il feed AI-generated nel tab "Blog" dell'app: sono sistemi separati. Il tab in-app usa `/api/blog` (DB), le route `/blog` e `/blog/:slug` servono i markdown statici.

---

## Pubblicazione su Vercel

```
1. Mergia feat/blog-static-pages-v2 → main
2. Vercel: build command = "node scripts/gen-blog-data.mjs && vite build"
3. Il manifest si rigenera ad ogni deploy
4. I .md sono in dist/blog/ (copiati da public/)
```
