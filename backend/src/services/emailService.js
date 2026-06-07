/**
 * Email Service — sends personalized emails via Resend
 * https://resend.com (free tier: 3,000/month)
 */
import { getPersonalizedContent, generatePersonalizedIntro } from "./personalizationEngine.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "VinoInvest <noreply@vinoinvest.com>";
const BASE_URL = "https://vinoinvest-platform.vercel.app";

async function sendEmail(to, subject, html, text) {
  if (!RESEND_API_KEY) {
    console.warn("[emailService] RESEND_API_KEY not set — email not sent");
    return { ok: false, reason: "no_api_key" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " "),
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("[emailService] Resend error:", data);
    return { ok: false, error: data };
  }
  return { ok: true, id: data.id };
}

function buildEmailLayout(content, unsubscribeUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VinoInvest</title>
<style>
  body { margin:0; padding:0; background:#f4f4f4; font-family:Arial,sans-serif; color:#1a1a2e; }
  .wrapper { max-width:600px; margin:0 auto; background:#fff; }
  .header { background:#020617; padding:24px 32px; }
  .logo { font-family:Georgia,serif; font-size:26px; font-weight:900; color:#fff; }
  .logo span { color:#C9A227; }
  .body { padding:32px; }
  .footer { background:#f8f4ef; padding:20px 32px; text-align:center; font-size:11px; color:#888; border-top:1px solid #e5e7eb; }
  .btn { display:inline-block; padding:12px 24px; background:#C9A227; color:#020617 !important; border-radius:8px; text-decoration:none; font-weight:700; font-size:14px; }
  .section { margin:24px 0; padding:20px; background:#f8f9fa; border-radius:10px; }
  .news-item { border-left:3px solid #C9A227; padding:12px 16px; margin:12px 0; background:#fff; border-radius:0 8px 8px 0; }
  .wine-card { display:flex; align-items:center; gap:16px; padding:16px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; margin:10px 0; }
  .score-badge { background:#020617; color:#C9A227; border-radius:6px; padding:4px 8px; font-size:12px; font-weight:700; }
  .disclaimer { font-size:11px; color:#aaa; margin-top:16px; padding:12px; background:#f8f4ef; border-radius:6px; }
  a { color:#C9A227; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="logo">Vino<span>Invest</span></div>
    <div style="font-size:12px;color:#64748b;margin-top:4px;">Fine Wine Intelligence Platform</div>
  </div>
  <div class="body">
    ${content}
    <div class="disclaimer">
      ⚠️ This email is for informational purposes only. It does not constitute financial or investment advice.
      Past performance does not guarantee future results. Wine investment carries risk.
    </div>
  </div>
  <div class="footer">
    <p>You're receiving this because you're registered on VinoInvest.</p>
    <p>
      <a href="${BASE_URL}/settings/notifications">Manage preferences</a> ·
      <a href="${unsubscribeUrl || BASE_URL + '/unsubscribe'}">Unsubscribe</a>
    </p>
    <p>VinoInvest · Milan, Italy · © ${new Date().getFullYear()}</p>
    <p>Data sources: Wine-Searcher · CellarTracker · Decanter · Liv-ex · Open-Meteo · ECB</p>
    <p>
      <a href="${BASE_URL}/transparency">Data transparency</a> ·
      <a href="${BASE_URL}/press">Press kit</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

export async function sendWelcomeEmail(user) {
  const firstName = user.first_name || user.email?.split("@")[0] || "Wine enthusiast";
  const content = `
    <h2 style="font-family:Georgia,serif;color:#020617;">Welcome to VinoInvest, ${firstName}! 🍷</h2>
    <p>You've just joined the most advanced fine wine investment platform. Here's what you can do right now:</p>
    <div class="section">
      <p><strong>1. 🔍 Explore 50,000+ wines</strong> with AI-powered investment scores</p>
      <p><strong>2. 📊 Build your portfolio</strong> and track performance in real time</p>
      <p><strong>3. 🔔 Set price alerts</strong> for wines you're watching</p>
      <p><strong>4. 🍾 Manage your cellar</strong> with drink window tracking</p>
    </div>
    <p style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}" class="btn">Start Exploring →</a>
    </p>
    <p style="color:#888;font-size:13px;">
      Data sources used: <a href="https://www.wine-searcher.com">Wine-Searcher ↗</a> ·
      <a href="https://www.cellartracker.com">CellarTracker ↗</a> ·
      <a href="https://www.decanter.com">Decanter ↗</a>
    </p>
  `;

  return sendEmail(
    user.email,
    `Welcome to VinoInvest, ${firstName}! 🍷`,
    buildEmailLayout(content, `${BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}`)
  );
}

export async function sendPriceAlertEmail(user, wine, alert, currentPrice) {
  const firstName = user.first_name || user.email?.split("@")[0] || "Investor";
  const change = alert.target_price > 0
    ? (((currentPrice - alert.target_price) / alert.target_price) * 100).toFixed(1)
    : "–";

  const content = `
    <h2 style="font-family:Georgia,serif;">🎯 Price Alert Triggered!</h2>
    <p>Hi ${firstName}, your alert for <strong>${wine.name || wine.wineName}</strong> has been triggered.</p>
    <div class="section">
      <p>🍷 <strong>${wine.name || alert.wine_id}</strong> (${wine.vintage || ""})</p>
      <p>💰 Current price: <strong>€${currentPrice.toLocaleString()}</strong></p>
      <p>🎯 Your alert target: €${parseFloat(alert.target_price).toLocaleString()}</p>
      ${change !== "–" ? `<p>📊 Change: <strong style="color:${parseFloat(change) <= 0 ? '#16a34a' : '#dc2626'}">${change}%</strong></p>` : ""}
      <p>🤖 AI Score: <span class="score-badge">${wine.investmentScore || "–"}/100</span></p>
    </div>
    <p>
      <a href="${BASE_URL}/?search=${encodeURIComponent(wine.name || alert.wine_id)}" class="btn">View on VinoInvest →</a>
      &nbsp;
      <a href="https://www.wine-searcher.com/find/${encodeURIComponent((wine.name || "").replace(/\s+/g, "-"))}" style="color:#C9A227">Check on Wine-Searcher ↗</a>
    </p>
    <p style="font-size:12px;color:#888;">Price source: Wine-Searcher · <a href="https://www.wine-searcher.com">wine-searcher.com ↗</a></p>
  `;

  return sendEmail(
    user.email,
    `🎯 Alert: ${wine.name || alert.wine_id} reached €${currentPrice}`,
    buildEmailLayout(content, `${BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}`)
  );
}

export async function sendPortfolioWeeklyEmail(user, portfolioData) {
  const { totalValue, totalInvested, roi, topWine, worstWine } = portfolioData;
  const firstName = user.first_name || user.email?.split("@")[0] || "Investor";
  const roiColor = roi >= 0 ? "#16a34a" : "#dc2626";

  const content = `
    <h2 style="font-family:Georgia,serif;">📊 Your Weekly Portfolio Update</h2>
    <p>Hi ${firstName}, here's your wine portfolio summary for this week.</p>
    <div class="section">
      <p>💼 <strong>Portfolio Value:</strong> €${Math.round(totalValue).toLocaleString()}</p>
      <p>📈 <strong>Total Return:</strong> <span style="color:${roiColor};font-weight:700">${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%</span></p>
      ${topWine ? `<p>🏆 <strong>Top Performer:</strong> ${topWine.wineName}</p>` : ""}
      ${worstWine ? `<p>⚠️ <strong>Watch List:</strong> ${worstWine.wineName}</p>` : ""}
    </div>
    <p style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}/?section=portfolio" class="btn">View Full Portfolio →</a>
    </p>
    <p style="font-size:12px;color:#888;">
      Portfolio values calculated using prices from:
      <a href="https://www.wine-searcher.com">Wine-Searcher ↗</a> ·
      <a href="https://www.cellartracker.com">CellarTracker ↗</a>
    </p>
    <p style="font-size:11px;color:#aaa;">* Estimated values based on available market data. Not a guarantee of sale price.</p>
  `;

  return sendEmail(
    user.email,
    `Your VinoInvest portfolio this week: €${Math.round(totalValue).toLocaleString()} (${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%)`,
    buildEmailLayout(content, `${BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}`)
  );
}

export async function sendPersonalizedNewsDigest(user, allWines, recentNews) {
  const personalized = await getPersonalizedContent(user.id, allWines, recentNews);
  const intro = generatePersonalizedIntro(personalized);
  const firstName = personalized.firstName || "Wine enthusiast";

  const newsHtml = personalized.relevantNews.slice(0, 3).map(n => `
    <div class="news-item">
      <div style="font-weight:700;font-size:14px;margin-bottom:4px;">
        <a href="${n.link || "#"}" target="_blank" rel="noopener">${n.title}</a>
      </div>
      <div style="font-size:12px;color:#888;">
        ${n.source || "Wine News"} · ${n.pubDate ? new Date(n.pubDate).toLocaleDateString("en-GB") : ""}
        · <a href="${n.link || "#"}" target="_blank" rel="noopener">Read full article ↗</a>
      </div>
    </div>
  `).join("") || "<p style='color:#888'>No relevant news found for your interests this week.</p>";

  const winesHtml = personalized.recommendedWines.slice(0, 2).map(w => `
    <div class="wine-card">
      <div style="flex:1">
        <div style="font-weight:700">${w.name || w.wineName}</div>
        <div style="font-size:12px;color:#888;">${w.producer || ""} ${w.vintage || ""}</div>
        <div style="margin-top:6px">
          <span class="score-badge">AI Score: ${w.investmentScore || "?"}/100</span>
          <span style="margin-left:8px;color:${w.marketTrend === "up" ? "#16a34a" : "#888"};font-size:12px;">${w.marketTrend === "up" ? "📈 Trending" : ""}</span>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700;font-size:16px;">€${parseFloat(w.currentPrice || 0).toLocaleString()}</div>
        <a href="${BASE_URL}/?search=${encodeURIComponent(w.name || w.wineName || "")}" style="font-size:11px">View →</a>
      </div>
    </div>
  `).join("");

  const content = `
    <h2 style="font-family:Georgia,serif;">Your Wine Intelligence Digest 🍷</h2>
    <p>${intro}</p>

    <h3 style="color:#C9A227;margin-top:24px;">📰 News Selected for You</h3>
    ${newsHtml}

    ${winesHtml ? `<h3 style="color:#C9A227;margin-top:24px;">🍷 Wines You Might Like</h3>${winesHtml}` : ""}

    ${personalized.portfolio.value > 0 ? `
    <div class="section" style="background:#f0f8f0;">
      <h4 style="margin:0 0 8px">📊 Your Portfolio</h4>
      <p>Value: <strong>€${Math.round(personalized.portfolio.value).toLocaleString()}</strong>
      · Return: <strong style="color:${parseFloat(personalized.portfolio.roi) >= 0 ? '#16a34a' : '#dc2626'}">${personalized.portfolio.roi >= 0 ? "+" : ""}${personalized.portfolio.roi}%</strong></p>
      <a href="${BASE_URL}/?section=portfolio" class="btn" style="margin-top:8px;display:inline-block">View Portfolio →</a>
    </div>
    ` : ""}

    <p style="text-align:center;margin:24px 0;">
      <a href="${BASE_URL}" class="btn">Explore All Wines →</a>
    </p>
    <p style="font-size:12px;color:#888;">
      News sources: <a href="https://www.decanter.com">Decanter ↗</a> · <a href="https://www.winespectator.com">Wine Spectator ↗</a> · <a href="https://www.winenews.it">WineNews.it ↗</a><br>
      Price data: <a href="https://www.wine-searcher.com">Wine-Searcher ↗</a> · <a href="https://www.cellartracker.com">CellarTracker ↗</a>
    </p>
  `;

  return sendEmail(
    user.email,
    `${firstName}, ${personalized.relevantNews[0]?.title?.slice(0, 60) || "Your weekly wine market digest"} 🍷`,
    buildEmailLayout(content, `${BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}`)
  );
}
