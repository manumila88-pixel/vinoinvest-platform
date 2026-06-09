# AGENT D — BUILD v2 COMPLETE

Branch: build/v2

## Files modified / created

| File | Action | Summary |
|------|--------|---------|
| `backend/src/services/freeDataService.js` | Modified | Added `getBottleImage()` (Open Food Facts CC0) + `getWikimediaImage()` (Wikipedia pageimages API) |
| `backend/src/services/enrichmentService.js` | Created | Full enrichment orchestrator: Wikidata + Wikipedia + Open Food Facts + Open-Meteo |
| `backend/src/jobs/enrichmentJob.js` | Created | Nightly cron (03:15) — enriches 100 wines/run, rate-limited at 1.5s/wine |

## What it does

### `enrichmentService.js`
For each wine record:
1. **Producer info** — Wikidata SPARQL (country, founding year, description) + Wikipedia (extract, URL, thumbnail)
2. **Wikimedia Commons** fallback if no Wikipedia thumbnail
3. **Wine metadata** — Wikidata wine entity (region, grape variety, country)
4. **Bottle image** — Open Food Facts CC0 search by `${producer} ${wineName}`; stores first `image_front_url`
5. **Vintage climate score** — Open-Meteo historical weather → `vintageClimateService.getVintageScore()` with region inferred from wine/producer name

Stores all enrichment in `wine_enrichment` table (1:1 with wines). Idempotent: ON CONFLICT DO UPDATE. Re-enriches after 30 days.

### Region inference
Patterns cover: Barolo, Tuscany, Bordeaux, Burgundy, Champagne, Rioja, Douro, Napa, Mendoza, Mosel, Priorat.

### `enrichmentJob.js`
- Cron: `15 3 * * *` (daily 03:15)
- Processes: 100 wines per run, 1.5s delay between each → ~2.5 min total
- Creates `wine_enrichment` and `vintage_scores` tables if absent
- Logs stats on completion

## Sources used (all free/legal)

| Source | Type | ToS |
|--------|------|-----|
| Wikipedia REST API | Free, open | [ToS OK](https://www.mediawiki.org/wiki/REST_API) |
| Wikidata SPARQL | Free, CC0 | [ToS OK](https://www.wikidata.org/wiki/Wikidata:Data_access) |
| Wikimedia pageimages API | Free, open | [ToS OK](https://www.mediawiki.org/wiki/API:Main_page) |
| Open Food Facts | Free, CC0 | [ToS OK](https://world.openfoodfacts.org/terms-of-use) |
| Open-Meteo archive | Free, non-commercial | [ToS OK](https://open-meteo.com/en/terms) |
| ECB Data Portal | Free, open | [ToS OK](https://data.ecb.europa.eu/terms-and-conditions) |

No paid API. No scraping. No ToS violations.

## Dependencies NOT installed

None needed — all HTTP done with native `fetch`. `node-cron` and `node-cache` already in package.json.

## ⚠️ ONE manual step required (coordinator)

Add to `backend/src/server.js` (after line 40 where priceUpdater is imported):

```js
import "./jobs/enrichmentJob.js";
```

Without this line the nightly cron does NOT run. The job creates its table on startup — no migration needed.

## Bundle delta

Backend only — no frontend bundle impact.
