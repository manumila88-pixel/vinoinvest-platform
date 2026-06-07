/**
 * CurrencyService — live exchange rates from ECB + conversion utilities.
 * No API key. Supports EUR, USD, GBP, CHF, JPY, CNY, AUD, CAD, HKD, SGD.
 */
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 21600 }); // 6h

const CURRENCIES = ["USD", "GBP", "CHF", "JPY", "CNY", "AUD", "CAD", "HKD", "SGD"];

const FALLBACK_RATES = {
  EUR: 1, USD: 1.08, GBP: 0.86, CHF: 0.97, JPY: 163.5,
  CNY: 7.82, AUD: 1.64, CAD: 1.47, HKD: 8.42, SGD: 1.44,
};

const CURRENCY_SYMBOLS = {
  EUR: "€", USD: "$", GBP: "£", CHF: "Fr", JPY: "¥",
  CNY: "¥", AUD: "A$", CAD: "C$", HKD: "HK$", SGD: "S$",
};

const CURRENCY_NAMES = {
  EUR: "Euro", USD: "Dollaro USA", GBP: "Sterlina", CHF: "Franco Svizzero",
  JPY: "Yen", CNY: "Yuan", AUD: "Dollaro Australiano",
  CAD: "Dollaro Canadese", HKD: "Dollaro Hong Kong", SGD: "Dollaro Singapore",
};

async function fetchECBRates() {
  const keys = CURRENCIES.join("+");
  const url = `https://data-api.ecb.europa.eu/service/data/EXR/D.${keys}.EUR.SP00.A?format=jsondata&startPeriod=${recentDate()}&detail=dataonly`;

  const r = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "VinoInvest/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`ECB EXR ${r.status}`);
  const data = await r.json();

  const seriesList = data.dataSets?.[0]?.series;
  const dimensions = data.structure?.dimensions?.series;
  if (!seriesList || !dimensions) throw new Error("ECB parse error");

  // Find currency dimension index
  const currDim = dimensions.find(d => d.id === "CURRENCY");
  if (!currDim) throw new Error("no CURRENCY dim");

  const rates = { EUR: 1 };
  for (const [seriesKey, seriesData] of Object.entries(seriesList)) {
    const parts = seriesKey.split(":");
    const currIdx = parseInt(parts[1]);
    const currCode = currDim.values?.[currIdx]?.id;
    if (!currCode) continue;
    // Get last observation
    const obs = Object.values(seriesData.observations || {});
    if (!obs.length) continue;
    const lastVal = obs[obs.length - 1]?.[0];
    if (lastVal && !isNaN(lastVal)) rates[currCode] = parseFloat(lastVal);
  }
  return rates;
}

function recentDate() {
  const d = new Date();
  d.setDate(d.getDate() - 7); // go back 7 days to ensure we get a trading day
  return d.toISOString().slice(0, 10);
}

export async function getRates() {
  const hit = cache.get("ecb_rates");
  if (hit) return hit;

  try {
    const rates = await fetchECBRates();
    cache.set("ecb_rates", rates);
    console.log("[currencyService] Rates fetched from ECB:", Object.keys(rates).join(", "));
    return rates;
  } catch (err) {
    console.warn("[currencyService] ECB failed, using fallback:", err.message);
    cache.set("ecb_rates", FALLBACK_RATES, 1800);
    return FALLBACK_RATES;
  }
}

export async function convertPrice(priceEUR, targetCurrency) {
  if (targetCurrency === "EUR") return priceEUR;
  const rates = await getRates();
  const rate = rates[targetCurrency];
  if (!rate) return priceEUR;
  return +(priceEUR * rate).toFixed(2);
}

export async function convertAll(priceEUR) {
  const rates = await getRates();
  const result = {};
  for (const [code, rate] of Object.entries(rates)) {
    result[code] = {
      amount: +(priceEUR * rate).toFixed(2),
      symbol: CURRENCY_SYMBOLS[code] || code,
      name: CURRENCY_NAMES[code] || code,
      rate,
    };
  }
  return result;
}

export function getSymbol(currency) {
  return CURRENCY_SYMBOLS[currency] || currency;
}

export function getCurrencyList() {
  return ["EUR", ...CURRENCIES].map(c => ({
    code: c, symbol: CURRENCY_SYMBOLS[c], name: CURRENCY_NAMES[c],
  }));
}
