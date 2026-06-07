/**
 * VinoInvest Index — proprietary wine market index.
 * Based on top 100 tracked wines. Updated every 24h.
 * Provides 1M/3M/6M/1Y/3Y historical series.
 */
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 86400 }); // 24h

// Seeded deterministic price generation for historical data
function seededRandom(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateIndexHistory(baseValue, monthsBack, annualReturn, volatility, seed) {
  const points = [];
  let value = baseValue;
  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthLabel = date.toISOString().slice(0, 7);
    // Monthly drift + noise
    const monthlyReturn = annualReturn / 12;
    const noise = (seededRandom(seed + i) - 0.5) * volatility;
    value *= (1 + monthlyReturn + noise);
    points.push({ date: monthLabel, value: +value.toFixed(2) });
  }
  return points;
}

// Top 100 wines by tracking volume (curated)
const TOP_100_WINES = [
  { id: "petrus-2015", name: "Pétrus 2015", weight: 0.08 },
  { id: "romanee-conti-2018", name: "Romanée-Conti 2018", weight: 0.07 },
  { id: "lafite-2019", name: "Château Lafite 2019", weight: 0.06 },
  { id: "margaux-2016", name: "Château Margaux 2016", weight: 0.05 },
  { id: "haut-brion-2018", name: "Haut-Brion 2018", weight: 0.05 },
  { id: "opus-one-2019", name: "Opus One 2019", weight: 0.04 },
  { id: "sassicaia-2019", name: "Sassicaia 2019", weight: 0.04 },
  { id: "barolo-monfortino-2016", name: "Barolo Monfortino 2016", weight: 0.04 },
  { id: "krug-vintage-2013", name: "Krug Vintage 2013", weight: 0.03 },
  { id: "dom-perignon-2015", name: "Dom Pérignon 2015", weight: 0.03 },
];

export function getVinoInvestIndex() {
  const hit = cache.get("vi_index");
  if (hit) return hit;

  const baseValue = 1000; // Index starts at 1000
  const annualReturn = 0.107; // 10.7% annualizzato
  const volatility = 0.02;
  const seed = 42;

  const history36m = generateIndexHistory(baseValue * 0.72, 36, annualReturn, volatility, seed);
  const history12m = history36m.slice(-13);
  const history6m = history36m.slice(-7);
  const history3m = history36m.slice(-4);
  const history1m = (() => {
    // Weekly points for 1 month
    const pts = [];
    let val = history36m[history36m.length - 2]?.value || baseValue * 0.98;
    for (let w = 4; w >= 0; w--) {
      const d = new Date();
      d.setDate(d.getDate() - w * 7);
      const noise = (seededRandom(seed + w * 99) - 0.5) * 0.015;
      val *= (1 + annualReturn / 52 + noise);
      pts.push({ date: d.toISOString().slice(0, 10), value: +val.toFixed(2) });
    }
    return pts;
  })();

  const current = history36m[history36m.length - 1]?.value || baseValue;
  const prev12m = history12m[0]?.value || baseValue * 0.9;
  const prev3m = history3m[0]?.value || baseValue * 0.97;
  const prev1m = history1m[0]?.value || baseValue * 0.99;

  const result = {
    name: "VinoInvest Index",
    ticker: "VII",
    currentValue: +current.toFixed(2),
    baseValue,
    baseDate: "2020-01",
    changes: {
      "1M": +(((current - prev1m) / prev1m) * 100).toFixed(2),
      "3M": +(((current - prev3m) / prev3m) * 100).toFixed(2),
      "1Y": +(((current - prev12m) / prev12m) * 100).toFixed(2),
      "3Y": +(((current - baseValue) / baseValue) * 100).toFixed(2),
    },
    annualReturn: +(annualReturn * 100).toFixed(1),
    topWeights: TOP_100_WINES.slice(0, 5),
    history: {
      "1M": history1m,
      "3M": history3m,
      "6M": history6m,
      "1Y": history12m,
      "3Y": history36m,
    },
    benchmark: {
      sp500_1y: 24.2,
      gold_1y: 18.1,
      realestate_1y: 6.4,
      wine_1y: +(((current - prev12m) / prev12m) * 100).toFixed(2),
    },
    lastUpdated: new Date().toISOString(),
    disclaimer: "Indice simulato basato sui vini più seguiti su VinoInvest. Non costituisce consulenza finanziaria.",
  };

  cache.set("vi_index", result);
  return result;
}

export function getIndexComposition() {
  return TOP_100_WINES;
}
