// VinoInvest Chrome Extension — Content Script
// Injects AI Score overlay on wine detail pages

const API = "https://vinoinvest-backend-2.onrender.com";
const STORAGE_KEY = "vi_token";

function extractWineName() {
  const host = window.location.hostname;

  if (host.includes("wine-searcher")) {
    const h1 = document.querySelector("h1.wine-name, h1[class*='wine'], .wine-name-display, h1");
    return h1?.textContent?.trim() || null;
  }

  if (host.includes("vivino")) {
    const el = document.querySelector("[class*='wine-basic-info__name'], h1.name");
    return el?.textContent?.trim() || null;
  }

  if (host.includes("tannico") || host.includes("millesima") || host.includes("idealwine")) {
    const h1 = document.querySelector("h1");
    return h1?.textContent?.trim() || null;
  }

  return null;
}

function extractVintage() {
  const text = document.title + " " + window.location.href;
  const match = text.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  return match?.[1] || null;
}

function createOverlay(wine, data) {
  const existing = document.getElementById("vi-overlay");
  if (existing) existing.remove();

  const score = data.score || data.investment_score || 0;
  const signal = data.signal || (score >= 75 ? "Buy" : score >= 55 ? "Hold" : "Monitor");
  const signalColors = { "Strong Buy": "#16a34a", "Buy": "#22c55e", "Hold": "#C9A227", "Monitor": "#94a3b8", "Reduce": "#f97316", "Sell": "#ef4444" };
  const signalColor = signalColors[signal] || "#C9A227";

  const overlay = document.createElement("div");
  overlay.id = "vi-overlay";
  overlay.innerHTML = `
    <div class="vi-header">
      <span class="vi-logo">🍷 Vino<strong style="color:#C9A227">Invest</strong></span>
      <button class="vi-close" id="vi-close">×</button>
    </div>
    <div class="vi-body">
      <div class="vi-wine-name">${wine}</div>
      <div class="vi-score-row">
        <div class="vi-score">
          <div class="vi-score-num" style="color:${score >= 75 ? '#C9A227' : score >= 55 ? '#94a3b8' : '#f87171'}">${score}</div>
          <div class="vi-score-label">AI Score</div>
        </div>
        <div class="vi-signal" style="background:${signalColor}20;border:1px solid ${signalColor}50;color:${signalColor}">${signal}</div>
      </div>
      ${data.trend_30d ? `<div class="vi-stat">30d trend: <strong style="color:${data.trend_30d > 0 ? '#22c55e' : '#ef4444'}">${data.trend_30d > 0 ? '+' : ''}${data.trend_30d.toFixed(1)}%</strong></div>` : ""}
      <div class="vi-actions">
        <a href="https://vinoinvest-platform.vercel.app/?search=${encodeURIComponent(wine)}" target="_blank" class="vi-btn-primary">View on VinoInvest</a>
        <button class="vi-btn-secondary" id="vi-watchlist">+ Watchlist</button>
      </div>
      <div class="vi-source">AI Score: <a href="https://vinoinvest-platform.vercel.app/transparency" target="_blank">VinoInvest algorithm ↗</a></div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("vi-close")?.addEventListener("click", () => overlay.remove());
  document.getElementById("vi-watchlist")?.addEventListener("click", () => {
    const btn = document.getElementById("vi-watchlist");
    btn.textContent = "✓ Added!";
    btn.disabled = true;
  });
}

async function fetchAIScore(wineName) {
  try {
    const res = await fetch(`${API}/api/ai-score?wine=${encodeURIComponent(wineName)}&source=extension`, {
      headers: { "X-Extension": "1" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function init() {
  const wine = extractWineName();
  if (!wine || wine.length < 3) return;

  // Wait a bit for page to fully render
  await new Promise(r => setTimeout(r, 1500));

  const data = await fetchAIScore(wine);
  if (!data) return;

  createOverlay(wine, data);
}

init();

// Re-run on SPA navigation (for Vivino etc.)
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(init, 1000);
  }
});
observer.observe(document.body, { childList: true, subtree: true });
