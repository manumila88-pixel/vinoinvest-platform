// VinoInvest Extension — Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log("[VinoInvest] Extension installed");
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "addToWatchlist") {
    // Store wine in chrome.storage for later sync
    chrome.storage.local.get(["watchlist"], (result) => {
      const watchlist = result.watchlist || [];
      if (!watchlist.includes(message.wineId)) {
        watchlist.push(message.wineId);
        chrome.storage.local.set({ watchlist });
      }
    });
    sendResponse({ ok: true });
  }
  return true;
});
