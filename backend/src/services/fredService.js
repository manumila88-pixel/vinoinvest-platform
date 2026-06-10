/**
 * FRED (Federal Reserve Economic Data) — free public data.
 * S&P500 (SP500) + Gold (GOLDAMGBD228NLBM) monthly returns.
 * No API key required — uses public CSV endpoint.
 * Falls back to long-run historical averages if FRED unreachable.
 */

const FRED_CSV = "https://fred.stlouisfed.org/graph/fredgraph.csv";
const UA = "VinoInvest/1.0 (+https://vinoinvest-platform.vercel.app)";

const FALLBACK = {
  sp500Return12m: 0.117,
  goldReturn12m:  0.082,
  sp500Vol:       0.165,
  goldVol:        0.142,
  source:         "fallback",
};

async function fetchCSV(seriesId) {
  try {
    const res = await fetch(`${FRED_CSV}?id=${seriesId}`, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim().split("\n").slice(1).map(line => {
      const [date, raw] = line.split(",");
      const value = parseFloat(raw);
      return isNaN(value) ? null : { date: date.trim(), value };
    }).filter(Boolean);
  } catch {
    return null;
  }
}

function return12m(data) {
  if (!data || data.length < 2) return null;
  const last = data[data.length - 1];
  const cutoff = new Date(last.date);
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const old = [...data].reverse().find(d => d.date <= cutoffStr) || data[0];
  return old.value > 0 ? (last.value - old.value) / old.value : null;
}

function annualVol(data) {
  if (!data || data.length < 13) return null;
  const recent = data.slice(-13);
  const rets = [];
  for (let i = 1; i < recent.length; i++) {
    const p = recent[i - 1].value;
    if (p > 0) rets.push((recent[i].value - p) / p);
  }
  if (rets.length < 2) return null;
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((s, r) => s + (r - mean) ** 2, 0) / (rets.length - 1);
  return Math.sqrt(variance * 12);
}

let _cache = null;
let _cacheTs = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h

export async function getBenchmarkData() {
  if (_cache && Date.now() - _cacheTs < CACHE_TTL) return _cache;

  const [sp500, gold] = await Promise.all([
    fetchCSV("SP500"),
    fetchCSV("GOLDAMGBD228NLBM"),
  ]);

  const result = {
    sp500Return12m: return12m(sp500) ?? FALLBACK.sp500Return12m,
    goldReturn12m:  return12m(gold)  ?? FALLBACK.goldReturn12m,
    sp500Vol:       annualVol(sp500) ?? FALLBACK.sp500Vol,
    goldVol:        annualVol(gold)  ?? FALLBACK.goldVol,
    euInflation:    0.026,
    vinoInvestIndex: 0.148,
    source: sp500 ? "FRED" : "fallback",
    fetchedAt: new Date().toISOString(),
  };

  _cache = result;
  _cacheTs = Date.now();
  return result;
}
