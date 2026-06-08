#!/usr/bin/env node
/**
 * Weekly sitemap ping script.
 * Notifies search engines of sitemap updates.
 * Run manually or schedule with cron:
 *   0 8 * * 1 node /path/to/scripts/ping-sitemaps.js
 */

import https from "https";
import http from "http";

const SITEMAPS = [
  "https://vinoinvest-platform.vercel.app/sitemap.xml",
  "https://vinoinvest-platform.vercel.app/sitemap-static.xml",
  "https://vinoinvest-platform.vercel.app/sitemap-wines.xml",
];

// Bing supports GET pings; Google deprecated their ping endpoint in 2023
// but IndexNow is the modern alternative for Bing/Yandex
const BING_PING = "https://www.bing.com/ping?sitemap=";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";

async function get(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, res => {
      resolve({ status: res.statusCode, url });
    }).on("error", reject);
  });
}

async function pingBing(sitemap) {
  const url = BING_PING + encodeURIComponent(sitemap);
  try {
    const r = await get(url);
    console.log(`[Bing] ${r.status === 200 ? "✅" : "⚠️"} ${sitemap}`);
  } catch (e) {
    console.warn(`[Bing] ❌ ${sitemap} — ${e.message}`);
  }
}

async function pingIndexNow() {
  if (!INDEXNOW_KEY) {
    console.log("[IndexNow] Skipped — INDEXNOW_KEY not set");
    return;
  }
  // IndexNow bulk submission
  const body = JSON.stringify({
    host: "vinoinvest-platform.vercel.app",
    key: INDEXNOW_KEY,
    keyLocation: `https://vinoinvest-platform.vercel.app/${INDEXNOW_KEY}.txt`,
    urlList: SITEMAPS,
  });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: "api.indexnow.org",
      path: "/indexnow",
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
    }, res => {
      console.log(`[IndexNow] ${res.statusCode === 200 ? "✅" : "⚠️"} status ${res.statusCode}`);
      resolve();
    });
    req.on("error", e => { console.warn("[IndexNow] ❌", e.message); resolve(); });
    req.write(body);
    req.end();
  });
}

console.log(`[ping-sitemaps] Running — ${new Date().toISOString()}`);

for (const sm of SITEMAPS) await pingBing(sm);
await pingIndexNow();

console.log("[ping-sitemaps] Done.");
