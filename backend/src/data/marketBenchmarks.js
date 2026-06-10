/**
 * Fine wine market benchmarks and historical index data.
 * Used by AI advisor for market context and portfolio analysis.
 */

// ── Liv-ex Indices (approximate annual values, normalized 2010=100) ──────────
export const LIVEX_INDICES = {
  "Fine Wine 100": {
    description: "100 most actively traded fine wines globally",
    composition: "Bordeaux 50%, Burgundy 20%, Italy 10%, Champagne 10%, Rest 10%",
    data: {
      2010: 100, 2011: 104, 2012: 98, 2013: 97, 2014: 98,
      2015: 101, 2016: 105, 2017: 112, 2018: 120, 2019: 125,
      2020: 127, 2021: 147, 2022: 165, 2023: 152, 2024: 148,
    },
    annualizedReturn10yr: 0.081,
    sharpeRatio: 0.72,
    maxDrawdown: -0.18,
    correlationSP500: 0.12,
    correlationGold: 0.08,
  },
  "Burgundy 150": {
    description: "150 most actively traded Burgundy wines",
    composition: "Côte de Nuits 70%, Côte de Beaune 25%, Chablis 5%",
    data: {
      2010: 100, 2011: 112, 2012: 109, 2013: 110, 2014: 114,
      2015: 122, 2016: 130, 2017: 148, 2018: 168, 2019: 187,
      2020: 198, 2021: 250, 2022: 298, 2023: 290, 2024: 285,
    },
    annualizedReturn10yr: 0.109,
    sharpeRatio: 0.88,
    maxDrawdown: -0.12,
    correlationSP500: 0.08,
    correlationGold: 0.05,
  },
  "Bordeaux 500": {
    description: "500 most actively traded Bordeaux wines",
    composition: "Pauillac 25%, Saint-Julien 15%, Margaux 15%, Pomerol 15%, Others 30%",
    data: {
      2010: 100, 2011: 100, 2012: 92, 2013: 88, 2014: 90,
      2015: 94, 2016: 99, 2017: 105, 2018: 112, 2019: 116,
      2020: 118, 2021: 132, 2022: 148, 2023: 138, 2024: 133,
    },
    annualizedReturn10yr: 0.058,
    sharpeRatio: 0.45,
    maxDrawdown: -0.22,
    correlationSP500: 0.15,
    correlationGold: 0.10,
  },
  "Champagne 50": {
    description: "50 most actively traded Champagne wines",
    composition: "Prestige cuvée 80%, Vintage 20%",
    data: {
      2010: 100, 2011: 102, 2012: 101, 2013: 103, 2014: 105,
      2015: 109, 2016: 112, 2017: 116, 2018: 122, 2019: 128,
      2020: 131, 2021: 142, 2022: 155, 2023: 150, 2024: 148,
    },
    annualizedReturn10yr: 0.079,
    sharpeRatio: 0.82,
    maxDrawdown: -0.06,
    correlationSP500: 0.05,
    correlationGold: 0.02,
  },
  "Italy 100": {
    description: "100 most actively traded Italian wines",
    composition: "Piemonte 35%, Toscana 45%, Veneto 10%, Others 10%",
    data: {
      2010: 100, 2011: 106, 2012: 104, 2013: 108, 2014: 113,
      2015: 118, 2016: 126, 2017: 136, 2018: 148, 2019: 158,
      2020: 162, 2021: 187, 2022: 210, 2023: 205, 2024: 200,
    },
    annualizedReturn10yr: 0.094,
    sharpeRatio: 0.79,
    maxDrawdown: -0.08,
    correlationSP500: 0.09,
    correlationGold: 0.06,
  },
};

// ── Asset Class Returns Comparison ───────────────────────────────────────────
export const ASSET_RETURNS = {
  "Fine Wine (Liv-ex 100)": {
    "5yr_annualized": 0.078,
    "10yr_annualized": 0.081,
    "20yr_annualized": 0.089,
    volatility: 0.089,
    maxDrawdown: -0.18,
    liquidityDays: 30,
    minInvestment: 2000,
    taxEfficiency: "High (wasting asset in UK, collectible in IT)",
    storageRequired: true,
  },
  "S&P 500 (Total Return)": {
    "5yr_annualized": 0.133,
    "10yr_annualized": 0.128,
    "20yr_annualized": 0.096,
    volatility: 0.168,
    maxDrawdown: -0.34,
    liquidityDays: 0,
    minInvestment: 1,
    taxEfficiency: "Medium",
    storageRequired: false,
  },
  "Gold": {
    "5yr_annualized": 0.124,
    "10yr_annualized": 0.064,
    "20yr_annualized": 0.077,
    volatility: 0.148,
    maxDrawdown: -0.26,
    liquidityDays: 0,
    minInvestment: 50,
    taxEfficiency: "Low",
    storageRequired: false,
  },
  "MSCI World": {
    "5yr_annualized": 0.116,
    "10yr_annualized": 0.113,
    "20yr_annualized": 0.084,
    volatility: 0.154,
    maxDrawdown: -0.33,
    liquidityDays: 0,
    minInvestment: 1,
    taxEfficiency: "Medium",
    storageRequired: false,
  },
  "Real Estate (REIT Global)": {
    "5yr_annualized": 0.037,
    "10yr_annualized": 0.074,
    "20yr_annualized": 0.089,
    volatility: 0.188,
    maxDrawdown: -0.41,
    liquidityDays: 3,
    minInvestment: 100,
    taxEfficiency: "Medium",
    storageRequired: false,
  },
  "Whisky (Rare Whisky 101)": {
    "5yr_annualized": 0.069,
    "10yr_annualized": 0.118,
    "20yr_annualized": 0.142,
    volatility: 0.245,
    maxDrawdown: -0.35,
    liquidityDays: 60,
    minInvestment: 500,
    taxEfficiency: "High (wasting asset UK)",
    storageRequired: true,
  },
  "Art (Artprice Global)": {
    "5yr_annualized": 0.042,
    "10yr_annualized": 0.069,
    "20yr_annualized": 0.082,
    volatility: 0.198,
    maxDrawdown: -0.28,
    liquidityDays: 90,
    minInvestment: 1000,
    taxEfficiency: "Medium",
    storageRequired: true,
  },
  "EUR 10yr Government Bond": {
    "5yr_annualized": 0.012,
    "10yr_annualized": 0.016,
    "20yr_annualized": 0.024,
    volatility: 0.048,
    maxDrawdown: -0.16,
    liquidityDays: 0,
    minInvestment: 1,
    taxEfficiency: "Low",
    storageRequired: false,
  },
};

// ── Wine Market Events & Milestones ──────────────────────────────────────────
export const MARKET_EVENTS = [
  { year: 2003, event: "Exceptional Bordeaux vintage (100pts Pétrus, Sassicaia)", impact: "Bullish" },
  { year: 2004, event: "Launch of the Liv-ex Fine Wine 100 index", impact: "Neutral — structural" },
  { year: 2009, event: "Post-crisis recovery — Asian demand surge begins", impact: "Bullish" },
  { year: 2010, event: "Exceptional vintage: Bordeaux 2009 en primeur, DRC 2010 legendary", impact: "Bullish" },
  { year: 2011, event: "China wine import boom — Bordeaux peaks, bubble fears", impact: "Euphoric" },
  { year: 2012, event: "Bordeaux correction — Chinese anti-corruption campaign", impact: "Bearish" },
  { year: 2013, event: "Market bottoms, rotation to Burgundy begins", impact: "Neutral/Bullish Burg" },
  { year: 2016, event: "Brexit impacts GBP — UK buyers gain advantage", impact: "Complex" },
  { year: 2018, event: "Parker retires as primary critic, market diversifies", impact: "Structural" },
  { year: 2019, event: "US tariffs on French wine (25%) — temporary trade war", impact: "Bearish EU" },
  { year: 2020, event: "COVID-19: restaurants close, at-home consumption spikes", impact: "Mixed" },
  { year: 2021, event: "Post-COVID demand spike — supply constrained, prices surge", impact: "Strongly Bullish" },
  { year: 2022, event: "Inflation hedging demand + post-lockdown spending. All-time high.", impact: "Peak" },
  { year: 2023, event: "Rate hikes hit alternatives. Bordeaux corrects 15-20% from peak.", impact: "Bearish correction" },
  { year: 2024, event: "Stabilization. Italy and Champagne outperform. Bordeaux bottoming.", impact: "Neutral/Selective" },
  { year: 2025, event: "Rate cuts expected to revive alternatives demand. Barolo bull case building.", impact: "Cautiously Bullish" },
];

// ── En Primeur Campaign Results (key data points) ─────────────────────────────
export const EN_PRIMEUR_HISTORY = {
  2022: {
    vintage_quality: 93,
    market_verdict: "Overpriced. Châteaux opened too high vs 2019 comparables.",
    best_buys: ["Carmes Haut-Brion", "Vieux Château Certan", "Cos d'Estournel"],
    avoid: ["Lafite 2022 (release > secondary market)"],
    release_premium_to_secondary: 1.15,
  },
  2021: {
    vintage_quality: 88,
    market_verdict: "Fair pricing, good entry for mid-tier châteaux.",
    best_buys: ["Leoville Las Cases", "Ducru-Beaucaillou", "Pichon Baron"],
    avoid: [],
    release_premium_to_secondary: 0.95,
  },
  2020: {
    vintage_quality: 95,
    market_verdict: "Excellent vintage, fairly priced. Strong long-term proposition.",
    best_buys: ["Petrus 2020", "Margaux 2020", "Cos d'Estournel 2020", "Pontet-Canet"],
    avoid: [],
    release_premium_to_secondary: 0.92,
  },
  2019: {
    vintage_quality: 98,
    market_verdict: "Great vintage, prices initially fair. Now strong secondary market.",
    best_buys: ["Latour 2019", "Pavie 2019", "Figeac 2019"],
    avoid: [],
    release_premium_to_secondary: 0.85,
  },
  2016: {
    vintage_quality: 99,
    market_verdict: "Exceptional. One of the greatest Bordeaux decades. Prices justified.",
    best_buys: ["Mouton 2016", "Haut-Brion 2016", "Cheval Blanc 2016"],
    avoid: [],
    release_premium_to_secondary: 0.78,
  },
  2015: {
    vintage_quality: 97,
    market_verdict: "Near-perfect across the board. Good value vs 2016.",
    best_buys: ["Margaux 2015", "Latour 2015", "Leoville Barton 2015"],
    avoid: [],
    release_premium_to_secondary: 0.80,
  },
  2010: {
    vintage_quality: 100,
    market_verdict: "The decade's best. Released at fair prices, now 3x.",
    best_buys: ["Any Premier Cru 2010", "Pontet-Canet 2010", "Pichon Comtesse 2010"],
    avoid: [],
    release_premium_to_secondary: 0.38,
  },
};

// ── Annual Returns by Region (estimated, not guaranteed) ─────────────────────
export const REGION_RETURNS = {
  burgundy_grand_cru: { avg5yr: 0.142, avg10yr: 0.168, volatility: "Medium", liquidity: "Medium" },
  bordeaux_premier_cru: { avg5yr: 0.062, avg10yr: 0.078, volatility: "Low", liquidity: "High" },
  barolo_barbaresco: { avg5yr: 0.118, avg10yr: 0.132, volatility: "Medium", liquidity: "Medium" },
  champagne_prestige: { avg5yr: 0.072, avg10yr: 0.079, volatility: "Low", liquidity: "High" },
  super_tuscans: { avg5yr: 0.085, avg10yr: 0.092, volatility: "Low-Medium", liquidity: "Medium-High" },
  napa_cult: { avg5yr: 0.094, avg10yr: 0.108, volatility: "Medium", liquidity: "Medium" },
  rhone_north: { avg5yr: 0.068, avg10yr: 0.082, volatility: "Low-Medium", liquidity: "Low" },
  germany_mosel: { avg5yr: 0.048, avg10yr: 0.062, volatility: "Low", liquidity: "Low" },
  spain_premium: { avg5yr: 0.076, avg10yr: 0.088, volatility: "Medium", liquidity: "Low-Medium" },
  australia_premium: { avg5yr: 0.058, avg10yr: 0.072, volatility: "Medium", liquidity: "Medium" },
  champagne_grower: { avg5yr: 0.112, avg10yr: 0.128, volatility: "High", liquidity: "Low" },
  etna_sicily: { avg5yr: 0.138, avg10yr: 0.145, volatility: "High", liquidity: "Low" },
};

// ── Helper: Get Sharpe Ratio Estimate for Portfolio ───────────────────────────
export function estimatePortfolioReturn(regions) {
  if (!regions || regions.length === 0) return { avgReturn: 0.08, volatility: 0.09 };
  const returns = regions.map(r => REGION_RETURNS[r]?.avg10yr ?? 0.08);
  const vols = regions.map(r => {
    const v = REGION_RETURNS[r]?.volatility ?? "Medium";
    if (v === "Low") return 0.06;
    if (v === "Low-Medium") return 0.08;
    if (v === "Medium") return 0.10;
    if (v === "Medium-High") return 0.12;
    return 0.15;
  });
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const avgVol = vols.reduce((a, b) => a + b, 0) / vols.length;
  const diversificationBenefit = regions.length > 3 ? 0.85 : 1.0;
  return { avgReturn, volatility: avgVol * diversificationBenefit };
}

/** Get current market mood based on latest index data */
export function getMarketMood() {
  const fw100 = LIVEX_INDICES["Fine Wine 100"].data;
  const years = Object.keys(fw100).map(Number).sort((a, b) => b - a);
  const latest = fw100[years[0]];
  const prev = fw100[years[1]];
  const change = (latest - prev) / prev;
  if (change > 0.05) return { mood: "Bullish", change, description: "Fine wine market trending up. Good time to hold." };
  if (change < -0.05) return { mood: "Bearish", change, description: "Fine wine market correcting. Look for entry opportunities." };
  return { mood: "Neutral", change, description: "Fine wine market stable. Selective buying recommended." };
}

export default { LIVEX_INDICES, ASSET_RETURNS, MARKET_EVENTS, EN_PRIMEUR_HISTORY, REGION_RETURNS };
