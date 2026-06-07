/**
 * VinoInvest Telegram Bot
 * Requires: TELEGRAM_BOT_TOKEN in .env
 * Create bot at: https://t.me/BotFather → /newbot
 *
 * Commands:
 * /start     — Welcome + feature list
 * /price     — Get wine price estimate
 * /score     — AI Score for a wine
 * /vintage   — Vintage quality score
 * /news      — Latest 3 news
 * /help      — Command list
 */
import TelegramBot from "node-telegram-bot-api";

let bot = null;
let allWinesRef = [];
let indexFn = null;
let newsFn = null;

export function initTelegramBot(wines, getIndex, getNews) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("[telegramBot] TELEGRAM_BOT_TOKEN not set — bot disabled. Set it to enable.");
    return;
  }

  allWinesRef = wines;
  indexFn = getIndex;
  newsFn = getNews;

  bot = new TelegramBot(token, { polling: true });
  console.log("[telegramBot] Bot started (polling)");

  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `🍷 *Benvenuto su VinoInvest Bot!*

Sono il tuo assistente per investimenti in vino pregiato.

*Comandi disponibili:*
/price Château Margaux 2015 — Prezzo stimato
/score Petrus 2010 — AI Score
/vintage bordeaux 2015 — Score annata climatica
/news — Ultime notizie
/index — VinoInvest Index
/help — Aiuto

🌐 Visita: vinoinvest-platform.vercel.app`, { parse_mode: "Markdown" });
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `📚 *Comandi VinoInvest Bot*

/price [nome vino] [annata] — Prezzo corrente stimato
/score [nome vino] [annata] — AI Investment Score (0-100)
/vintage [regione] [anno] — Qualità annata climatica
/news — Ultime 3 notizie mercato
/index — VinoInvest Index attuale

*Esempi:*
/price Barolo Monfortino 2016
/score Sassicaia 2019
/vintage bordeaux 2015
/vintage barolo 2019

📱 App completa: vinoinvest-platform.vercel.app`, { parse_mode: "Markdown" });
  });

  bot.onText(/\/price (.+)/, async (msg, match) => {
    const query = match[1].trim().toLowerCase();
    const wine = findWine(query);
    if (!wine) {
      return bot.sendMessage(msg.chat.id, `❌ Vino non trovato: "${match[1]}"\n\nProva con il nome completo: /price Château Lafite 2019`);
    }
    const score = wine.investmentScore || wine.investment_score || 75;
    const signal = score >= 85 ? "🟢 Strong Buy" : score >= 70 ? "🔵 Buy" : score >= 55 ? "🟡 Hold" : "🔴 Sell";
    bot.sendMessage(msg.chat.id,
      `🍾 *${wine.name}* ${wine.vintage ? wine.vintage : ""}

💰 Prezzo attuale: *€${wine.currentPrice || wine.current_price}*
📊 AI Score: *${score}/100*
${signal}
🏭 ${wine.producer || ""}
📍 ${wine.region || ""} ${wine.country ? `(${wine.country})` : ""}

🔗 [Vedi su Wine-Searcher](https://www.wine-searcher.com/find/${encodeURIComponent(wine.name)}/${wine.vintage || ""}?utm_source=vinoinvest_bot)
📱 [Analisi completa](https://vinoinvest-platform.vercel.app)`, { parse_mode: "Markdown", disable_web_page_preview: true });
  });

  bot.onText(/\/score (.+)/, async (msg, match) => {
    const wine = findWine(match[1].trim().toLowerCase());
    if (!wine) return bot.sendMessage(msg.chat.id, `❌ Vino non trovato: "${match[1]}"`);

    const score = wine.investmentScore || wine.investment_score || 75;
    const bars = "█".repeat(Math.round(score / 10)) + "░".repeat(10 - Math.round(score / 10));
    const signal = score >= 85 ? "🟢 STRONG BUY" : score >= 70 ? "🔵 BUY" : score >= 55 ? "🟡 HOLD" : "🔴 SELL";

    bot.sendMessage(msg.chat.id,
      `📈 *AI Score — ${wine.name}*

Score: *${score}/100*
${bars}

Segnale: ${signal}
Rischio: ${wine.risk || "Medio"}
Trend: ${wine.marketTrend || wine.market_trend || "Stabile"}

💡 Score calcolato su: rating critico, annata, produttore, trend di mercato e rischio.
📱 [Portfolio completo](https://vinoinvest-platform.vercel.app)`, { parse_mode: "Markdown" });
  });

  bot.onText(/\/vintage (\w+) (\d{4})/, async (msg, match) => {
    const region = match[1].toLowerCase();
    const year = parseInt(match[2]);
    try {
      const r = await fetch(`http://localhost:${process.env.PORT || 3000}/api/vintage/score?region=${region}&year=${year}`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);

      const bars = "█".repeat(Math.round(data.score / 10)) + "░".repeat(10 - Math.round(data.score / 10));
      bot.sendMessage(msg.chat.id,
        `🌡️ *Annata ${year} — ${data.region}*

Score: *${data.score}/100* — ${data.label}
${bars}

🌡️ Temperatura media: ${data.temp_mean}°C
🌧️ Pioggia stagione: ${data.rain_total}mm
📊 Fonte: Open-Meteo (dati reali)`, { parse_mode: "Markdown" });
    } catch {
      bot.sendMessage(msg.chat.id, `⚠️ Dati non disponibili per ${region} ${year}.\n\nRegioni disponibili: bordeaux, burgundy, barolo, chianti, champagne, rioja, napa, mendoza`);
    }
  });

  bot.onText(/\/news/, async (msg) => {
    try {
      if (newsFn) {
        const articles = await newsFn();
        if (articles?.length) {
          const text = articles.slice(0, 3).map((a, i) =>
            `${i + 1}. *${a.title?.slice(0, 80)}*\n   ${a.source?.name || ""} · ${new Date(a.publishedAt).toLocaleDateString("it-IT")}\n   ${a.url !== "#" ? `[Leggi →](${a.url})` : ""}`
          ).join("\n\n");
          return bot.sendMessage(msg.chat.id, `📰 *Ultime notizie vino:*\n\n${text}`, { parse_mode: "Markdown", disable_web_page_preview: true });
        }
      }
    } catch { /* fallthrough */ }
    bot.sendMessage(msg.chat.id, "📰 Notizie temporaneamente non disponibili. Riprova tra qualche minuto.");
  });

  bot.onText(/\/index/, (msg) => {
    try {
      const idx = indexFn ? indexFn() : null;
      if (!idx) return bot.sendMessage(msg.chat.id, "📊 Index temporaneamente non disponibile.");
      bot.sendMessage(msg.chat.id,
        `📊 *VinoInvest Index (VII)*

Valore attuale: *${idx.currentValue}*

Variazioni:
• 1 mese:  ${idx.changes["1M"] > 0 ? "+" : ""}${idx.changes["1M"]}%
• 3 mesi:  ${idx.changes["3M"] > 0 ? "+" : ""}${idx.changes["3M"]}%
• 1 anno:  ${idx.changes["1Y"] > 0 ? "+" : ""}${idx.changes["1Y"]}%

vs benchmark (1 anno):
• S&P 500: +${idx.benchmark.sp500_1y}%
• Oro: +${idx.benchmark.gold_1y}%
• Vino: ${idx.changes["1Y"] > 0 ? "+" : ""}${idx.changes["1Y"]}%

📱 [Grafico completo](https://vinoinvest-platform.vercel.app)`, { parse_mode: "Markdown" });
    } catch {
      bot.sendMessage(msg.chat.id, "📊 Index temporaneamente non disponibile.");
    }
  });

  bot.on("polling_error", (err) => {
    if (!err.message?.includes("ETELEGRAM")) {
      console.error("[telegramBot] polling error:", err.message);
    }
  });
}

function findWine(query) {
  if (!allWinesRef.length) return null;
  const q = query.toLowerCase();
  return allWinesRef.find(w =>
    (w.name || "").toLowerCase().includes(q) ||
    q.includes((w.name || "").toLowerCase().slice(0, 6))
  ) || allWinesRef.find(w =>
    (w.producer || "").toLowerCase().includes(q.split(" ")[0])
  ) || null;
}

export function sendAlertToUser(chatId, message) {
  if (!bot || !chatId) return;
  bot.sendMessage(chatId, message, { parse_mode: "Markdown" }).catch(() => {});
}
