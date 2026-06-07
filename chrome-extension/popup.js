const API = "https://vinoinvest-backend-2.onrender.com";

const searchInput = document.getElementById("wine-search");
const searchBtn = document.getElementById("search-btn");
const resultDiv = document.getElementById("result");
const wineNameEl = document.getElementById("wine-name");
const scoreEl = document.getElementById("score-val");
const signalEl = document.getElementById("signal-badge");
const viewLink = document.getElementById("view-link");

const SIGNAL_COLORS = {
  "Strong Buy": { bg: "rgba(22,163,74,0.15)", color: "#22c55e", border: "rgba(22,163,74,0.3)" },
  "Buy": { bg: "rgba(34,197,94,0.1)", color: "#86efac", border: "rgba(34,197,94,0.2)" },
  "Hold": { bg: "rgba(201,162,39,0.15)", color: "#C9A227", border: "rgba(201,162,39,0.3)" },
  "Monitor": { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "rgba(148,163,184,0.2)" },
  "Reduce": { bg: "rgba(249,115,22,0.1)", color: "#fb923c", border: "rgba(249,115,22,0.2)" },
  "Sell": { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.2)" },
};

async function searchWine(query) {
  if (!query || query.trim().length < 2) return;

  searchBtn.textContent = "⏳ Loading...";
  searchBtn.disabled = true;

  try {
    const res = await fetch(`${API}/api/ai-score?wine=${encodeURIComponent(query)}&source=extension`);
    const data = await res.json();

    const score = data.score || data.investment_score || 0;
    const signal = data.signal || (score >= 75 ? "Buy" : score >= 55 ? "Hold" : "Monitor");
    const colors = SIGNAL_COLORS[signal] || SIGNAL_COLORS.Hold;

    wineNameEl.textContent = query;
    scoreEl.textContent = score;
    scoreEl.style.color = score >= 75 ? "#C9A227" : score >= 55 ? "#94a3b8" : "#f87171";
    signalEl.textContent = signal;
    Object.assign(signalEl.style, { background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` });
    viewLink.href = `https://vinoinvest-platform.vercel.app/?search=${encodeURIComponent(query)}`;

    resultDiv.style.display = "block";
  } catch (e) {
    wineNameEl.textContent = "Error loading score";
    resultDiv.style.display = "block";
  }

  searchBtn.textContent = "🔍 Get AI Score";
  searchBtn.disabled = false;
}

searchBtn.addEventListener("click", () => searchWine(searchInput.value.trim()));
searchInput.addEventListener("keydown", e => { if (e.key === "Enter") searchWine(searchInput.value.trim()); });

// Auto-detect wine from current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || "";
  if (url.includes("wine-searcher.com") || url.includes("vivino.com") || url.includes("tannico.it")) {
    chrome.scripting?.executeScript?.({
      target: { tabId: tabs[0].id },
      func: () => {
        const h1 = document.querySelector("h1");
        return h1?.textContent?.trim() || null;
      },
    }).then(results => {
      const wine = results?.[0]?.result;
      if (wine && wine.length > 2) {
        searchInput.value = wine;
        searchWine(wine);
      }
    }).catch(() => {});
  }
});
