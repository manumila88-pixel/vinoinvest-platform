import Anthropic from "@anthropic-ai/sdk";

// Lazy-init client — avoids crash when API key is missing at startup
let _client = null;
function getClient() {
  if (!_client && process.env.ANTHROPIC_API_KEY) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// ── Tool definitions ───────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "get_wine_price_history",
    description: "Get price history for a specific wine over a given timeframe",
    input_schema: {
      type: "object",
      properties: {
        wineId: { type: "string", description: "Wine ID (e.g., 'lafite-2018')" },
        timeframe: { type: "string", enum: ["1m", "3m", "6m", "1y", "3y", "5y"] },
      },
      required: ["wineId"],
    },
  },
  {
    name: "get_market_news",
    description: "Get latest fine wine market news and analysis",
    input_schema: {
      type: "object",
      properties: {
        country: { type: "string", enum: ["all", "FR", "IT", "US", "AU", "ZA"] },
        category: { type: "string", enum: ["all", "auction", "critic", "investment", "market"] },
      },
    },
  },
  {
    name: "search_wines",
    description: "Search for wines matching specific criteria",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        limit: { type: "number" },
      },
      required: ["query"],
    },
  },
  {
    name: "calculate_portfolio_metrics",
    description: "Calculate ROI, diversification score, and risk metrics",
    input_schema: {
      type: "object",
      properties: {
        holdings: {
          type: "array",
          items: { type: "object", properties: { name: { type: "string" }, quantity: { type: "number" }, purchasePrice: { type: "number" }, currentPrice: { type: "number" } } },
        },
      },
      required: ["holdings"],
    },
  },
  {
    name: "get_exchange_rates",
    description: "Get current EUR exchange rates",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_top_opportunities",
    description: "Get top wine investment opportunities",
    input_schema: {
      type: "object",
      properties: {
        riskLevel: { type: "string", enum: ["basso", "medio", "alto"] },
        budget: { type: "number" },
      },
    },
  },
];

// ── Tool execution ─────────────────────────────────────────────────────────
export async function executeTool(name, input, { allWines, API_URL, searchWinesFromDB }) {
  switch (name) {
    case "get_wine_price_history": {
      try {
        const r = await fetch(`${API_URL}/api/prices/${encodeURIComponent(input.wineId)}/history?currentPrice=100&timeframe=${input.timeframe || "1y"}`, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        const pts = d.history || [];
        if (!pts.length) return { error: "No price history available" };
        const prices = pts.map(p => Number(p.price));
        const first = prices[0], last = prices[prices.length - 1];
        return { wineId: input.wineId, timeframe: input.timeframe || "1y", points: pts.length, startPrice: first, endPrice: last, changePercent: ((last - first) / first * 100).toFixed(1), minPrice: Math.min(...prices), maxPrice: Math.max(...prices), source: d.source };
      } catch (e) { return { error: e.message }; }
    }
    case "get_market_news": {
      try {
        const params = new URLSearchParams();
        if (input.country && input.country !== "all") params.set("country", input.country);
        if (input.category && input.category !== "all") params.set("category", input.category);
        const r = await fetch(`${API_URL}/api/news?${params}`, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return { articles: (d.articles || []).slice(0, 5).map(a => ({ title: a.title, description: a.description?.slice(0, 180), source: a.source?.name, date: a.publishedAt, category: a.category })), source: d.source };
      } catch (e) { return { error: e.message }; }
    }
    case "search_wines": {
      const limit = input.limit || 5;
      const q = (input.query || "").toLowerCase();
      // Try DB first for live data, fall back to in-memory catalog
      if (searchWinesFromDB) {
        try {
          const dbResults = await searchWinesFromDB(q, limit);
          if (dbResults.length > 0) {
            return { results: dbResults.map(w => ({ id: w.id, name: w.name, producer: w.producer, region: w.region, vintage: w.vintage, price: w.current_price, score: w.investment_score, risk: w.risk, type: w.type })), total: dbResults.length, source: "db" };
          }
        } catch {}
      }
      const results = allWines
        .filter(w => `${w.name} ${w.producer} ${w.region} ${w.type || ""} ${w.variety || ""}`.toLowerCase().includes(q))
        .slice(0, limit)
        .map(w => ({ id: w.id, name: w.name, producer: w.producer, region: w.region, vintage: w.vintage, price: w.currentPrice || w.current_price, score: w.investmentScore || w.investment_score, risk: w.risk, type: w.type }));
      return { results, total: results.length, source: "memory" };
    }
    case "calculate_portfolio_metrics": {
      const h = input.holdings || [];
      const totalInvested = h.reduce((s, x) => s + (x.purchasePrice || 0) * (x.quantity || 1), 0);
      const totalValue = h.reduce((s, x) => s + (x.currentPrice || 0) * (x.quantity || 1), 0);
      const roi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested * 100).toFixed(1) : 0;
      const byType = {};
      h.forEach(x => { byType[x.type || "Rosso"] = (byType[x.type || "Rosso"] || 0) + 1; });
      return { totalInvested: Math.round(totalInvested), totalValue: Math.round(totalValue), totalProfit: Math.round(totalValue - totalInvested), roi: Number(roi), diversificationScore: Math.min(10, Math.round(Object.keys(byType).length * 2 + h.length * 0.5)), positions: h.length, avgBottlePrice: h.length > 0 ? Math.round(h.reduce((s, x) => s + (x.currentPrice || 0), 0) / h.length) : 0, topPerformer: h.sort((a, b) => ((b.currentPrice || 0) - (b.purchasePrice || 0)) - ((a.currentPrice || 0) - (a.purchasePrice || 0)))[0]?.name || "—", byType };
    }
    case "get_exchange_rates": {
      try {
        const r = await fetch(`${API_URL}/api/rates`, { signal: AbortSignal.timeout(8000) });
        const d = await r.json();
        return { rates: d.rates, base: "EUR", updated: d.updated };
      } catch (e) { return { error: e.message }; }
    }
    case "get_top_opportunities": {
      const budget = input.budget || Infinity;
      const risk = input.riskLevel || "medio";
      const wines = allWines
        .filter(w => {
          const price = w.currentPrice || w.current_price || 0;
          const wRisk = (w.risk || "").toLowerCase();
          const matchRisk = risk === "medio" ? (wRisk === "medio" || wRisk === "basso") : wRisk === risk;
          return price > 0 && price <= budget && matchRisk;
        })
        .sort((a, b) => (b.investmentScore || b.investment_score || 0) - (a.investmentScore || a.investment_score || 0))
        .slice(0, 8)
        .map(w => ({ id: w.id, name: w.name, producer: w.producer, region: w.region, vintage: w.vintage, price: w.currentPrice || w.current_price, score: w.investmentScore || w.investment_score, risk: w.risk, trend: w.marketTrend || w.market_trend }));
      return { opportunities: wines, count: wines.length, criteria: { risk, maxBudget: budget } };
    }
    default: return { error: `Unknown tool: ${name}` };
  }
}

// ── Authoritative external resources ──────────────────────────────────────
const RESOURCES = {
  news: ["https://www.decanter.com", "https://www.jancisrobinson.com"],
  prices: ["https://www.wine-searcher.com", "https://www.vivino.com"],
  auctions: ["https://www.sothebys.com/en/departments/wine", "https://www.christies.com/departments/wine-9-1.aspx"],
  ratings: ["https://www.robertparker.com", "https://www.winespectator.com"],
  education: ["https://www.wset.org", "https://www.guildsomm.com"],
  market: ["https://www.liv-ex.com"],
};

function buildResourceLinks(categories = ["news", "prices"]) {
  const links = [];
  categories.forEach(cat => {
    (RESOURCES[cat] || []).forEach(url => {
      const domain = url.replace("https://www.", "").replace("https://", "").split("/")[0];
      links.push({ url, label: domain });
    });
  });
  return links;
}

// ── Intent detection for algorithmic fallback ──────────────────────────────
function detectIntent(message) {
  const m = message.toLowerCase();
  if (/budget|compro|acquis|invest|spend|acheter|kaufen|€|eur/i.test(m)) return "budget";
  if (/portfolio|portafolio|portafoglio|analyse|analizza|holdings|posizioni/i.test(m)) return "portfolio";
  if (/vendo|sell|vendere|reduce|uscire|liquidare/i.test(m)) return "sell";
  if (/news|notizie|mercato|market|oggi|today|settimana|semaine|woche/i.test(m)) return "news";
  if (/simil|like|comme|ähnlich|come.*château|tipo.*vino/i.test(m)) return "similar";
  if (/barolo|borgogna|bordeaux|champagne|toscana|tuscany|napa|rioja/i.test(m)) return "region";
  if (/cos.*è|what.*is|come.*funziona|how.*work|qu.*est|was.*ist|educaz/i.test(m)) return "education";
  if (/top|best|miglior|meilleur|beste|opportunit/i.test(m)) return "opportunities";
  return "general";
}

function extractBudget(message) {
  const m = message.match(/(\d[\d.,]*)\s*(k|000)?\s*euro|€\s*(\d[\d.,]*)(k)?/i);
  if (!m) return null;
  let n = parseFloat((m[1] || m[3] || "0").replace(",", "."));
  if (m[2]?.toLowerCase() === "k" || m[4]?.toLowerCase() === "k") n *= 1000;
  return n > 0 ? n : null;
}

function extractSearchTerm(message) {
  const patterns = [/miglior\s+(\w+)/i, /best\s+(\w+)/i, /simil[ei]\s+a\s+(.+?)(?:\?|$)/i, /like\s+(.+?)(?:\?|$)/i, /(\w+)\s+da\s+investimento/i, /trovami\s+(.+?)(?:\?|$)/i];
  for (const p of patterns) {
    const m = message.match(p);
    if (m) return m[1].trim();
  }
  return message.replace(/[?!.]/g, "").trim().split(" ").slice(0, 3).join(" ");
}

// Multilingual response templates
const T = {
  it: {
    greeting: "Ciao",
    budget_intro: (b) => `Con un budget di **€${b.toLocaleString("it")}** ecco le mie migliori raccomandazioni:`,
    opport_intro: "Ecco le **top opportunità di investimento** basate su AI Score e trend di mercato:",
    news_intro: "Ultime **notizie dal mercato del vino**:",
    portfolio_intro: (n) => `Analisi del tuo **portfolio** (${n} posizioni):`,
    no_portfolio: "Non hai ancora posizioni nel portfolio. Inizia esplorando il mercato!",
    education_intro: "**Investire nel vino: Guida rapida**",
    resources: "📚 Risorse autorevoli:",
    wine_label: (w) => `**${w.name}** (${w.vintage || ""}) — €${w.price} | Score: ${w.score}/100`,
  },
  en: {
    greeting: "Hi",
    budget_intro: (b) => `With a budget of **€${b.toLocaleString("en")}** here are my top recommendations:`,
    opport_intro: "Here are the **top investment opportunities** based on AI Score and market trends:",
    news_intro: "Latest **wine market news**:",
    portfolio_intro: (n) => `Analysis of your **portfolio** (${n} positions):`,
    no_portfolio: "You have no portfolio positions yet. Start by exploring the market!",
    education_intro: "**Wine Investment: Quick Guide**",
    resources: "📚 Authoritative resources:",
    wine_label: (w) => `**${w.name}** (${w.vintage || ""}) — €${w.price} | Score: ${w.score}/100`,
  },
  fr: {
    greeting: "Bonjour",
    budget_intro: (b) => `Avec un budget de **€${b.toLocaleString("fr")}** voici mes meilleures recommandations:`,
    opport_intro: "Voici les **meilleures opportunités d'investissement** basées sur le score IA et les tendances:",
    news_intro: "Dernières **actualités du marché du vin**:",
    portfolio_intro: (n) => `Analyse de votre **portefeuille** (${n} positions):`,
    no_portfolio: "Vous n'avez pas encore de positions. Commencez par explorer le marché!",
    education_intro: "**Investir dans le vin: Guide rapide**",
    resources: "📚 Ressources fiables:",
    wine_label: (w) => `**${w.name}** (${w.vintage || ""}) — €${w.price} | Score: ${w.score}/100`,
  },
  de: {
    greeting: "Hallo",
    budget_intro: (b) => `Mit einem Budget von **€${b.toLocaleString("de")}** sind hier meine Top-Empfehlungen:`,
    opport_intro: "Hier sind die **Top-Investitionsmöglichkeiten** basierend auf KI-Score und Markttrends:",
    news_intro: "Neueste **Weinmarktnachrichten**:",
    portfolio_intro: (n) => `Analyse Ihres **Portfolios** (${n} Positionen):`,
    no_portfolio: "Sie haben noch keine Portfolio-Positionen. Erkunden Sie den Markt!",
    education_intro: "**Weinanlage: Kurzanleitung**",
    resources: "📚 Zuverlässige Quellen:",
    wine_label: (w) => `**${w.name}** (${w.vintage || ""}) — €${w.price} | Score: ${w.score}/100`,
  },
  es: {
    greeting: "Hola",
    budget_intro: (b) => `Con un presupuesto de **€${b.toLocaleString("es")}** aquí están mis mejores recomendaciones:`,
    opport_intro: "Estas son las **mejores oportunidades de inversión** basadas en puntuación IA y tendencias:",
    news_intro: "Últimas **noticias del mercado del vino**:",
    portfolio_intro: (n) => `Análisis de su **cartera** (${n} posiciones):`,
    no_portfolio: "Aún no tiene posiciones en la cartera. ¡Empiece explorando el mercado!",
    education_intro: "**Invertir en vino: Guía rápida**",
    resources: "📚 Recursos autorizados:",
    wine_label: (w) => `**${w.name}** (${w.vintage || ""}) — €${w.price} | Score: ${w.score}/100`,
  },
};

function getLang(lang) {
  const l = (lang || "it").slice(0, 2).toLowerCase();
  return T[l] || T.it;
}

// ── Algorithmic agent (no API key needed) ─────────────────────────────────
async function runAlgorithmicAgent({ message, conversationHistory, holdings, allWines, searchWinesFromDB, API_URL, lang }) {
  const t = getLang(lang);
  const intent = detectIntent(message);
  const budget = extractBudget(message);
  const searchTerm = extractSearchTerm(message);

  let responseText = "";
  let suggestedWines = [];
  let resourceLinks = [];
  let toolsUsed = [];

  switch (intent) {
    case "budget": {
      const maxBudget = budget || 1000;
      const result = await executeTool("get_top_opportunities", { riskLevel: "medio", budget: maxBudget }, { allWines, API_URL });
      toolsUsed.push("get_top_opportunities");
      const opps = result.opportunities || [];

      // Build basket: greedily add wines until sum would exceed budget
      let runningTotal = 0;
      const basket = [];
      for (const w of opps) {
        const price = w.price || 0;
        if (price > 0 && runningTotal + price <= maxBudget) {
          basket.push(w);
          runningTotal += price;
        }
        if (basket.length >= 5) break;
      }
      suggestedWines = basket;

      if (!basket.length) {
        responseText = `${t.budget_intro(maxBudget)}\n\nNessun vino trovato nel range. Prova ad aumentare il budget.`;
      } else {
        const lines = basket.map((w, i) => `${i + 1}. ${t.wine_label(w)}\n   📍 ${w.region || ""} | ⚖️ Rischio: ${w.risk || "Medio"} | 📈 ${w.trend || "Stable"}`);
        responseText = `${t.budget_intro(maxBudget)}\n\n${lines.join("\n\n")}`;
        responseText += `\n\n💰 **Totale: €${runningTotal.toFixed(0)} / Budget: €${maxBudget.toLocaleString("it")}** (${basket.length} vini, ${(maxBudget - runningTotal).toFixed(0)}€ di riserva)`;
      }
      resourceLinks = buildResourceLinks(["prices", "market"]);
      break;
    }

    case "portfolio": {
      if (!holdings.length) {
        responseText = t.no_portfolio;
        const result = await executeTool("get_top_opportunities", { riskLevel: "medio" }, { allWines, API_URL });
        toolsUsed.push("get_top_opportunities");
        suggestedWines = (result.opportunities || []).slice(0, 4);
        resourceLinks = buildResourceLinks(["prices", "education"]);
        break;
      }
      const metrics = await executeTool("calculate_portfolio_metrics", { holdings }, { allWines, API_URL });
      toolsUsed.push("calculate_portfolio_metrics");
      const roiColor = metrics.roi > 0 ? "📈" : "📉";
      responseText = `${t.portfolio_intro(holdings.length)}\n\n`;
      responseText += `💰 **Valore totale**: €${metrics.totalValue.toLocaleString()}\n`;
      responseText += `💵 **Investito**: €${metrics.totalInvested.toLocaleString()}\n`;
      responseText += `${roiColor} **ROI**: ${metrics.roi}% (${metrics.totalProfit >= 0 ? "+" : ""}€${metrics.totalProfit.toLocaleString()})\n`;
      responseText += `🎯 **Diversificazione**: ${metrics.diversificationScore}/10\n`;
      responseText += `⭐ **Top performer**: ${metrics.topPerformer}\n\n`;
      if (metrics.diversificationScore < 5) {
        responseText += `⚠️ **Suggerimento**: Diversificazione bassa (${metrics.diversificationScore}/10). Considera di aggiungere vini da regioni diverse.\n`;
      }
      if (metrics.roi < 0) {
        responseText += `💡 **Nota**: ROI negativo potrebbe essere temporaneo. Il mercato del vino fine ha orizzonti di 3-7 anni.\n`;
      } else if (metrics.roi > 15) {
        responseText += `🎉 **Ottimo ROI!** Considera di consolidare parte dei profitti vendendo le posizioni più performanti.\n`;
      }
      // Get top opportunities for rebalancing
      const opps = await executeTool("get_top_opportunities", { riskLevel: "medio" }, { allWines, API_URL });
      toolsUsed.push("get_top_opportunities");
      suggestedWines = (opps.opportunities || []).slice(0, 3);
      resourceLinks = buildResourceLinks(["market", "auctions"]);
      break;
    }

    case "news": {
      const newsResult = await executeTool("get_market_news", { country: "all", category: "all" }, { allWines, API_URL });
      toolsUsed.push("get_market_news");
      const articles = newsResult.articles || [];
      responseText = `${t.news_intro}\n\n`;
      articles.forEach((a, i) => {
        responseText += `**${i + 1}. ${a.title}**\n${a.description || ""}\n📰 ${a.source || "Fonte"}\n\n`;
      });
      if (!articles.length) responseText += "Nessuna notizia disponibile al momento.";
      const opps = await executeTool("get_top_opportunities", { riskLevel: "medio" }, { allWines, API_URL });
      toolsUsed.push("get_top_opportunities");
      suggestedWines = (opps.opportunities || []).slice(0, 3);
      resourceLinks = buildResourceLinks(["news", "market"]);
      break;
    }

    case "similar":
    case "region": {
      const searchResult = await executeTool("search_wines", { query: searchTerm, limit: 6 }, { allWines, API_URL, searchWinesFromDB });
      toolsUsed.push("search_wines");
      suggestedWines = searchResult.results || [];
      if (!suggestedWines.length) {
        responseText = `Non ho trovato vini corrispondenti a "${searchTerm}". Prova con un termine diverso.`;
      } else {
        const lines = suggestedWines.map((w, i) => `${i + 1}. ${t.wine_label(w)}\n   📍 ${w.region || ""} | ⚖️ ${w.risk || "Medio"}`);
        responseText = `Ecco i vini trovati per **"${searchTerm}"**:\n\n${lines.join("\n\n")}`;
      }
      resourceLinks = buildResourceLinks(["prices", "ratings"]);
      break;
    }

    case "education": {
      responseText = `${t.education_intro}\n\n`;
      responseText += `**Perché investire nel vino?**\n`;
      responseText += `Il vino pregiato ha mostrato rendimenti medi dell'8-12% annuo negli ultimi 30 anni (Liv-ex Fine Wine 100). Caratteristiche chiave:\n\n`;
      responseText += `🔹 **Decorrelazione**: Non correlato con azioni e obbligazioni\n`;
      responseText += `🔹 **Scarsità**: Produzioni limitate, valore cresce nel tempo\n`;
      responseText += `🔹 **Liquidità**: Mercato secondario attivo (Sotheby's, Christie's, Liv-ex)\n`;
      responseText += `🔹 **AI Score**: Usa l'AI Score VinoInvest (0-100) per valutare ogni vino\n\n`;
      responseText += `**Come iniziare:**\n`;
      responseText += `1. Budget minimo consigliato: €2.000-5.000\n`;
      responseText += `2. Diversifica su 5-10 vini diversi\n`;
      responseText += `3. Focus su: Bordeaux, Borgogna, Super Tuscans, Barolo\n`;
      responseText += `4. Orizzonte temporale: 5-10 anni\n`;
      responseText += `5. Conserva in cantina professionale (temperatura 12-14°C)\n`;
      const opps = await executeTool("get_top_opportunities", { riskLevel: "basso" }, { allWines, API_URL });
      toolsUsed.push("get_top_opportunities");
      suggestedWines = (opps.opportunities || []).slice(0, 4);
      resourceLinks = buildResourceLinks(["education", "market", "ratings"]);
      break;
    }

    case "sell": {
      if (holdings.length) {
        const metrics = await executeTool("calculate_portfolio_metrics", { holdings }, { allWines, API_URL });
        toolsUsed.push("calculate_portfolio_metrics");
        responseText = `**Analisi vendita portfolio**\n\n`;
        responseText += `ROI attuale: **${metrics.roi}%**\n\n`;
        if (metrics.roi > 20) {
          responseText += `📈 ROI eccellente (${metrics.roi}%). **Considera di vendere** parte delle posizioni più performanti per consolidare i profitti.\n`;
        } else if (metrics.roi > 10) {
          responseText += `✅ Buon ROI (${metrics.roi}%). Mantieni le posizioni se l'orizzonte temporale è ancora lungo (2+ anni).\n`;
        } else {
          responseText += `⚠️ ROI basso (${metrics.roi}%). **Non vendere ora** — il vino pregiato richiede 5-7 anni per maturare il rendimento pieno.\n`;
        }
        responseText += `\n💡 **Regola generale**: Vendi quando hai raggiunto il 15-20%+ di ROI o all'avvicinarsi della finestra di bevibilità ottimale.`;
      } else {
        responseText = "Non hai posizioni nel portfolio. Aggiungi vini al portfolio per ricevere analisi di vendita.";
      }
      resourceLinks = buildResourceLinks(["auctions", "market"]);
      break;
    }

    case "opportunities":
    default: {
      const result = await executeTool("get_top_opportunities", { riskLevel: "medio" }, { allWines, API_URL });
      toolsUsed.push("get_top_opportunities");
      const opps = result.opportunities || [];
      suggestedWines = opps.slice(0, 5);
      const lines = opps.slice(0, 5).map((w, i) => `${i + 1}. ${t.wine_label(w)}\n   📍 ${w.region || ""} | ⚖️ ${w.risk || "Medio"} | 📈 ${w.trend || "Stable"}`);
      responseText = `${t.opport_intro}\n\n${lines.join("\n\n")}`;
      responseText += "\n\n💡 I top vini per AI Score sono generalmente quelli con la miglior combinazione di rendimento storico, scarsità e domanda di mercato.";
      resourceLinks = buildResourceLinks(["prices", "news", "ratings"]);
      break;
    }
  }

  // Append resource links
  if (resourceLinks.length) {
    responseText += `\n\n${t.resources}\n${resourceLinks.map(r => `🔗 [${r.label}](${r.url})`).join("  ·  ")}`;
  }

  return {
    response: responseText,
    suggestedWines,
    resourceLinks,
    toolsUsed,
    conversationHistory: [...(conversationHistory || []).slice(-8), { role: "user", content: message }, { role: "assistant", content: responseText }],
    mode: "algorithmic",
  };
}

// ── Claude-powered agent ───────────────────────────────────────────────────
async function runClaudeAgent({ message, conversationHistory, holdings, allWines, searchWinesFromDB, API_URL, lang }) {
  const client = getClient();
  const systemPrompt = `You are VinoInvest AI Agent, an expert fine wine investment advisor with access to real-time market data and tools.

CURRENT USER PORTFOLIO (${holdings.length} wines):
${holdings.length > 0
    ? holdings.map(h => `- ${h.name}: ${h.quantity}btl @ €${h.purchasePrice} → €${h.currentPrice} (ROI: ${h.roi}%)`).join("\n") + `\nTotal: €${holdings.reduce((s, h) => s + (h.currentValue || 0), 0).toFixed(0)}`
    : "No portfolio positions yet."}

RESOURCES TO CITE when relevant:
- News: decanter.com, jancisrobinson.com
- Prices: wine-searcher.com, vivino.com
- Auctions: sothebys.com, christies.com
- Ratings: robertparker.com, winespectator.com
- Market: liv-ex.com

Always respond in the user's language (language hint: ${lang || "it"}).
Be concise (max 300 words), actionable, and always use real data from tools.
Format with markdown bold and emoji for readability.
Always end with 2-3 relevant resource links.`;

  const messages = [...(conversationHistory || []), { role: "user", content: message }];
  const toolsUsed = [];
  let finalResponse = "";
  let suggestedWines = [];

  for (let step = 0; step < 6; step++) {
    const resp = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    });

    if (resp.stop_reason === "end_turn") {
      finalResponse = resp.content.filter(b => b.type === "text").map(b => b.text).join("");
      messages.push({ role: "assistant", content: resp.content });
      break;
    }

    if (resp.stop_reason === "tool_use") {
      messages.push({ role: "assistant", content: resp.content });
      const toolResults = [];
      for (const block of resp.content) {
        if (block.type !== "tool_use") continue;
        toolsUsed.push(block.name);
        const result = await executeTool(block.name, block.input, { allWines, API_URL, searchWinesFromDB });
        // Extract wine suggestions from tool results
        if (block.name === "search_wines") suggestedWines = result.results || [];
        if (block.name === "get_top_opportunities") suggestedWines = result.opportunities || [];
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(result) });
      }
      messages.push({ role: "user", content: toolResults });
    } else break;
  }

  return {
    response: finalResponse,
    suggestedWines: suggestedWines.slice(0, 5),
    resourceLinks: buildResourceLinks(["news", "prices", "market"]),
    toolsUsed,
    conversationHistory: messages.slice(-10),
    mode: "claude",
  };
}

const DISCLAIMER = "\n\n---\n⚠️ Analisi informativa. Non è consulenza finanziaria.";

// ── Public API ─────────────────────────────────────────────────────────────
export async function runAgent({ message, conversationHistory = [], holdings = [], allWines = [], searchWinesFromDB, API_URL = "https://vinoinvest-backend-2.onrender.com", lang = "it" }) {
  let result;
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      result = await runClaudeAgent({ message, conversationHistory, holdings, allWines, searchWinesFromDB, API_URL, lang });
    } catch (err) {
      console.error("[agent] Claude API error, falling back to algorithmic:", err.message);
    }
  }
  if (!result) result = await runAlgorithmicAgent({ message, conversationHistory, holdings, allWines, searchWinesFromDB, API_URL, lang });
  if (result.response) result.response += DISCLAIMER;
  return result;
}

export { buildResourceLinks };
