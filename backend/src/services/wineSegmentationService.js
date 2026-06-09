/**
 * Wine Segmentation Service
 * B2B: price > €500, AI Score > 85, risk low/medium — for wealth managers / family offices
 * B2C: price €50-500, AI Score > 70 — for private investors
 */

const B2B_RISK_ALLOW = ['basso', 'bassa', 'low', 'medium', 'medio', 'media'];

function getPrice(w) {
  return parseFloat(w.currentPrice || w.current_price || 0);
}

function getScore(w) {
  return parseInt(w.investmentScore || w.investment_score || 0);
}

function getRisk(w) {
  return (w.risk || '').toLowerCase().trim();
}

export function segmentWines(wines, segment) {
  if (!segment || segment === 'all') return wines;

  if (segment === 'b2b') {
    return wines.filter(w => {
      const price = getPrice(w);
      const score = getScore(w);
      return price >= 300 && score >= 80;
    });
  }

  if (segment === 'b2c') {
    return wines.filter(w => {
      const price = getPrice(w);
      const score = getScore(w);
      return price >= 50 && price <= 500 && score > 70;
    });
  }

  return wines;
}

export function getSegmentStats(wines) {
  const b2b = segmentWines(wines, 'b2b');
  const b2c = segmentWines(wines, 'b2c');

  return {
    total: wines.length,
    b2b: {
      count: b2b.length,
      avgScore: b2b.length ? Math.round(b2b.reduce((s, w) => s + getScore(w), 0) / b2b.length) : 0,
      avgPrice: b2b.length ? Math.round(b2b.reduce((s, w) => s + getPrice(w), 0) / b2b.length) : 0,
    },
    b2c: {
      count: b2c.length,
      avgScore: b2c.length ? Math.round(b2c.reduce((s, w) => s + getScore(w), 0) / b2c.length) : 0,
      avgPrice: b2c.length ? Math.round(b2c.reduce((s, w) => s + getPrice(w), 0) / b2c.length) : 0,
    },
  };
}
