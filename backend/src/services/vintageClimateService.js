/**
 * VintageClimateService — Open-Meteo historical weather → vintage quality score.
 * No API key required. Free forever.
 * Score 0-100 for each wine region × year from 2000 to present.
 */
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400 * 30 }); // 30 days (historical data doesn't change)

const REGIONS = {
  bordeaux:    { lat: 44.8,   lon: -0.5,    label: "Bordeaux",   country: "FR" },
  burgundy:    { lat: 47.0,   lon: 4.8,     label: "Bourgogne",  country: "FR" },
  barolo:      { lat: 44.6,   lon: 7.9,     label: "Barolo",     country: "IT" },
  chianti:     { lat: 43.4,   lon: 11.2,    label: "Chianti",    country: "IT" },
  champagne:   { lat: 49.0,   lon: 4.0,     label: "Champagne",  country: "FR" },
  rioja:       { lat: 42.4,   lon: -2.4,    label: "Rioja",      country: "ES" },
  douro:       { lat: 41.1,   lon: -7.5,    label: "Douro",      country: "PT" },
  napa:        { lat: 38.5,   lon: -122.4,  label: "Napa Valley",country: "US" },
  mendoza:     { lat: -32.8,  lon: -68.8,   label: "Mendoza",    country: "AR" },
  tuscany:     { lat: 43.7,   lon: 11.0,    label: "Toscana",    country: "IT" },
  mosel:       { lat: 49.9,   lon: 7.1,     label: "Mosella",    country: "DE" },
  priorat:     { lat: 41.2,   lon: 0.7,     label: "Priorat",    country: "ES" },
};

// Ideal conditions per region (growing season Apr-Oct)
const IDEAL = {
  default: {
    temp_mean:     22,   // °C ideal mean max
    temp_range:    [18, 26], // acceptable range
    rain_total:    350,  // mm ideal total
    rain_range:    [200, 500],
  },
  champagne: { temp_mean: 17, temp_range: [14, 21], rain_total: 400, rain_range: [300, 550] },
  mosel:     { temp_mean: 18, temp_range: [15, 22], rain_total: 380, rain_range: [280, 500] },
  mendoza:   { temp_mean: 24, temp_range: [20, 29], rain_total: 200, rain_range: [100, 350] },
  napa:      { temp_mean: 25, temp_range: [20, 30], rain_total: 150, rain_range: [50, 250] },
};

function getIdeal(regionKey) {
  return IDEAL[regionKey] || IDEAL.default;
}

function scoreVintage(tempMean, rainTotal, regionKey) {
  const ideal = getIdeal(regionKey);
  let score = 100;

  // Temperature penalty
  const tempDiff = Math.abs(tempMean - ideal.temp_mean);
  if (tempDiff > 0) score -= Math.min(30, tempDiff * 3.5);

  // Rainfall penalty
  const [rainMin, rainMax] = ideal.rain_range;
  if (rainTotal < rainMin) score -= Math.min(25, (rainMin - rainTotal) / 10);
  else if (rainTotal > rainMax) score -= Math.min(25, (rainTotal - rainMax) / 15);

  // Extreme heat penalty (>35°C consistently bad for all regions)
  if (tempMean > 30) score -= (tempMean - 30) * 4;
  if (tempMean < 10) score -= 30;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function vintageLabel(score) {
  if (score >= 95) return "Eccezionale";
  if (score >= 88) return "Ottima";
  if (score >= 78) return "Buona";
  if (score >= 65) return "Discreta";
  if (score >= 50) return "Media";
  return "Difficile";
}

async function fetchOpenMeteo(lat, lon, year) {
  const startDate = `${year}-04-01`;
  const endDate = `${year}-10-31`;
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;

  const r = await fetch(url, {
    headers: { "User-Agent": "VinoInvest/1.0" },
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`Open-Meteo ${r.status}`);
  return r.json();
}

export async function getVintageScore(regionKey, year) {
  const region = REGIONS[regionKey];
  if (!region) return null;
  const currentYear = new Date().getFullYear();
  if (year < 2000 || year > currentYear - 1) return null; // only complete seasons

  const cacheKey = `vs_${regionKey}_${year}`;
  const hit = cache.get(cacheKey);
  if (hit !== undefined) return hit;

  try {
    const data = await fetchOpenMeteo(region.lat, region.lon, year);
    const temps = data.daily?.temperature_2m_max || [];
    const rains = data.daily?.precipitation_sum || [];

    if (!temps.length) throw new Error("no data");

    const tempMean = temps.reduce((a, b) => a + (b || 0), 0) / temps.length;
    const rainTotal = rains.reduce((a, b) => a + (b || 0), 0);

    const score = scoreVintage(tempMean, rainTotal, regionKey);
    const result = {
      region: region.label,
      year,
      score,
      label: vintageLabel(score),
      temp_mean: +tempMean.toFixed(1),
      rain_total: +rainTotal.toFixed(0),
      source: "Open-Meteo (archive)",
    };

    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[vintageClimate] ${regionKey} ${year}:`, err.message);
    cache.set(cacheKey, null);
    return null;
  }
}

export async function getRegionVintageRange(regionKey, fromYear = 2010) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = fromYear; y < currentYear; y++) years.push(y);

  const results = await Promise.allSettled(years.map(y => getVintageScore(regionKey, y)));
  return results
    .map((r, i) => r.status === "fulfilled" ? r.value : null)
    .filter(Boolean)
    .sort((a, b) => a.year - b.year);
}

export async function getAllRegionsForYear(year) {
  const keys = Object.keys(REGIONS);
  const results = await Promise.allSettled(keys.map(k => getVintageScore(k, year)));
  return keys
    .map((k, i) => results[i].status === "fulfilled" ? results[i].value : null)
    .filter(Boolean);
}

export function getRegionList() {
  return Object.entries(REGIONS).map(([key, r]) => ({ key, ...r }));
}
