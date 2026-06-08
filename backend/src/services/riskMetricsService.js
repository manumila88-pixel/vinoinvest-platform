/**
 * Real financial risk metrics for wine portfolios.
 * Volatility, Sharpe, Max Drawdown, VaR, Concentration Risk, Beta.
 */

const RISK_FREE_RATE = 0.03; // 3% — EU benchmark

/**
 * Annualised standard deviation from daily/monthly returns.
 * @param {number[]} returns - array of decimal returns (e.g. 0.05 = +5%)
 * @param {number} periodsPerYear - 252 for daily, 12 for monthly
 */
function annualisedVolatility(returns, periodsPerYear = 12) {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance * periodsPerYear);
}

/**
 * Sharpe Ratio = (annualised return - risk free) / annualised volatility
 */
function sharpeRatio(returns, periodsPerYear = 12) {
  if (returns.length < 2) return null;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const annualisedReturn = mean * periodsPerYear;
  const vol = annualisedVolatility(returns, periodsPerYear);
  if (vol === 0) return null;
  return (annualisedReturn - RISK_FREE_RATE) / vol;
}

/**
 * Maximum Drawdown from a series of portfolio values.
 */
function maxDrawdown(values) {
  if (values.length < 2) return 0;
  let peak = values[0];
  let mdd = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    const dd = peak > 0 ? (peak - v) / peak : 0;
    if (dd > mdd) mdd = dd;
  }
  return mdd;
}

/**
 * Value at Risk at 95% confidence level (parametric / historical).
 * Uses historical simulation: sort returns, take 5th percentile.
 * @param {number[]} returns - decimal returns
 * @param {number} portfolioValue
 */
function var95(returns, portfolioValue) {
  if (returns.length < 10) return null;
  const sorted = [...returns].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * 0.05);
  const worstReturn = sorted[idx];
  return Math.abs(worstReturn * portfolioValue);
}

/**
 * Concentration Risk — Herfindahl-Hirschman Index (0-1)
 * 0 = perfectly diversified, 1 = single asset
 */
function concentrationRisk(holdings) {
  const total = holdings.reduce((s, h) => s + h.value, 0);
  if (total === 0) return 0;
  const weights = holdings.map(h => h.value / total);
  return weights.reduce((s, w) => s + w ** 2, 0);
}

/**
 * Beta of portfolio vs VinoInvest index.
 * Calculated as covariance(portfolio, index) / variance(index).
 */
function beta(portfolioReturns, indexReturns) {
  const n = Math.min(portfolioReturns.length, indexReturns.length);
  if (n < 3) return 1; // default beta 1 when insufficient data
  const pr = portfolioReturns.slice(-n);
  const ir = indexReturns.slice(-n);
  const pMean = pr.reduce((a, b) => a + b, 0) / n;
  const iMean = ir.reduce((a, b) => a + b, 0) / n;
  let cov = 0, iVar = 0;
  for (let i = 0; i < n; i++) {
    cov += (pr[i] - pMean) * (ir[i] - iMean);
    iVar += (ir[i] - iMean) ** 2;
  }
  if (iVar === 0) return 1;
  return cov / iVar;
}

/**
 * Build price returns array from price_history rows.
 * @param {Array<{price: number, recorded_at: string}>} history
 */
function buildReturns(history) {
  if (!history || history.length < 2) return [];
  const sorted = [...history].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  const returns = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].price;
    const curr = sorted[i].price;
    if (prev > 0) returns.push((curr - prev) / prev);
  }
  return returns;
}

/**
 * Compute full risk metrics for a portfolio.
 * @param {Array<{name: string, value: number, history?: Array}>} holdings
 * @param {number[]} indexMonthlyReturns - VinoInvest index returns
 */
export function computePortfolioRisk(holdings, indexMonthlyReturns = []) {
  const totalValue = holdings.reduce((s, h) => s + (h.value || 0), 0);

  // Aggregate weighted portfolio returns
  const maxLen = Math.max(...holdings.map(h => (h.returns || []).length), 0);
  let portfolioReturns = [];
  if (maxLen > 1) {
    for (let i = 0; i < maxLen; i++) {
      let weightedReturn = 0;
      let weightSum = 0;
      for (const h of holdings) {
        const rets = h.returns || [];
        if (i < rets.length && totalValue > 0) {
          const w = h.value / totalValue;
          weightedReturn += w * rets[i];
          weightSum += w;
        }
      }
      if (weightSum > 0) portfolioReturns.push(weightedReturn);
    }
  }

  // Build portfolio value series for drawdown
  const valueHistory = [totalValue];
  for (const r of portfolioReturns) {
    valueHistory.push(valueHistory[valueHistory.length - 1] * (1 + r));
  }

  const vol = annualisedVolatility(portfolioReturns);
  const sharpe = sharpeRatio(portfolioReturns);
  const mdd = maxDrawdown(valueHistory);
  const varAmt = var95(portfolioReturns, totalValue);
  const hhi = concentrationRisk(holdings);
  const betaVal = beta(portfolioReturns, indexMonthlyReturns);

  const annReturn = portfolioReturns.length > 0
    ? (portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length) * 12
    : 0;

  // Risk score 0-100 (lower = safer)
  const riskScore = Math.min(100, Math.round(
    vol * 100 * 0.4 +
    mdd * 100 * 0.3 +
    hhi * 50 * 0.2 +
    Math.max(0, (betaVal - 1)) * 10 * 0.1
  ));

  return {
    totalValue,
    annualisedReturn: annReturn,
    annualisedVolatility: vol,
    sharpeRatio: sharpe,
    maxDrawdown: mdd,
    var95: varAmt,
    concentrationRisk: hhi,
    beta: betaVal,
    riskScore,
    riskLabel: riskScore < 20 ? "Basso" : riskScore < 40 ? "Medio-Basso" : riskScore < 60 ? "Medio" : riskScore < 80 ? "Medio-Alto" : "Alto",
    dataPoints: portfolioReturns.length,
  };
}

export { buildReturns, annualisedVolatility, sharpeRatio, maxDrawdown, var95, concentrationRisk, beta };
