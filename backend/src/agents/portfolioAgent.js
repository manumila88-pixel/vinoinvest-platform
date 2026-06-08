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
  // Comparison (must check before budget/region to avoid false matches)
  if (/vs\.?|versus|contro|rispetto|confronta|differ[ae]|meglio.*o.*|or.*better|compared?|s&p|sp500|azioni|stock/i.test(m)) return "confronto";
  // Practical how-to
  if (/dove.*compra|where.*buy|come.*conserv|how.*store|autenticità|authentic|fals[oa]|fake|cantina professionale|temperatura|umidità|cellar/i.test(m)) return "pratico";
  // Market trends
  if (/trend|crescon|growing|cala|declin|2025|2026|regione.*meglio|region.*best|liv-?ex|andamento/i.test(m)) return "mercato";
  // En primeur
  if (/en primeur|primeur|futures|barrel|botte|annata/i.test(m)) return "enprimeur";
  // Budget allocation
  if (/budget|compro|acquis|spend|acheter|kaufen|€|eur/i.test(m) && !/invest.*vs|vs.*invest/i.test(m)) return "budget";
  // Portfolio analysis
  if (/portfolio|portafolio|portafoglio|analiz|holdings|posizioni|diversific/i.test(m)) return "portfolio";
  // Sell timing
  if (/vendo|sell|vendere|reduce|uscire|liquidare|quando.*vend/i.test(m)) return "sell";
  // News
  if (/news|notizie|oggi|today|settimana|week|ultimo|latest|cosa.*successo/i.test(m)) return "news";
  // Search / similar
  if (/simil|like|comme|ähnlich|come.*château|tipo.*vino|trovami|find.*wine|cerca/i.test(m)) return "similar";
  // Regional
  if (/barolo|borgogna|bordeaux|champagne|toscana|tuscany|napa|rioja|brunello|amarone|prosecco|champagne/i.test(m) && !/vs|versus|contro/i.test(m)) return "region";
  // Education
  if (/cos.*è|what.*is|come.*funziona|how.*work|qu.*est|was.*ist|educaz|spiega|explain|significa|meaning/i.test(m)) return "education";
  // Top / opportunities
  if (/top|best|miglior|meilleur|beste|opportunit/i.test(m)) return "opportunities";
  // General market question
  if (/mercato|market|economy|economia/i.test(m)) return "mercato";
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

    case "confronto": {
      // Comparison questions: Barolo vs Bordeaux, wine vs S&P500, etc.
      const isVsMarket = /s&p|sp500|azioni|stock|bond|immobil|real estate|gold|oro/i.test(message);
      if (isVsMarket) {
        responseText = `**Vino Fine vs Mercati Finanziari**\n\n`;
        responseText += `📊 **Rendimenti storici (annualizzati, 20 anni)**\n`;
        responseText += `🍷 Liv-ex Fine Wine 100: **+8-12%/anno**\n`;
        responseText += `📈 S&P 500: **+10-11%/anno**\n`;
        responseText += `🏠 Immobiliare IT: **+3-5%/anno**\n`;
        responseText += `🥇 Oro: **+7-8%/anno**\n\n`;
        responseText += `**Vantaggi del vino come asset:**\n`;
        responseText += `✅ **Bassa correlazione** con azioni (beta ~0.2) — protegge in crash azionari\n`;
        responseText += `✅ **Asset fisico** — non può andare a zero\n`;
        responseText += `✅ **Scarsità crescente** — le bottiglie si consumano, l'offerta cala\n`;
        responseText += `✅ **Fiscalità favorevole** — in Italia, plusvalenze vino non sono soggette a capital gain ordinario (Art. 67 TUIR, verifica con commercialista)\n\n`;
        responseText += `**Svantaggi:**\n`;
        responseText += `⚠️ Illiquidità (orizzonte 5-10 anni)\n`;
        responseText += `⚠️ Costi conservazione (€5-15/cassa/anno)\n`;
        responseText += `⚠️ Rischio autenticità\n\n`;
        responseText += `💡 **Conclusione**: Il vino funziona meglio come **diversificatore** (10-20% del portfolio totale), non sostituto del mercato azionario.`;
      } else {
        // Wine vs wine comparison — extract the two terms
        const parts = message.match(/(\w[\w\s]*?)\s+vs\.?\s+([\w\s]+)/i);
        const [wine1, wine2] = parts ? [parts[1].trim(), parts[2].trim()] : [searchTerm, "bordeaux"];
        const [r1, r2] = await Promise.all([
          executeTool("search_wines", { query: wine1, limit: 3 }, { allWines, API_URL, searchWinesFromDB }),
          executeTool("search_wines", { query: wine2, limit: 3 }, { allWines, API_URL, searchWinesFromDB }),
        ]);
        toolsUsed.push("search_wines", "search_wines");
        const w1 = (r1.results || [])[0];
        const w2 = (r2.results || [])[0];
        responseText = `**Confronto: ${wine1.toUpperCase()} vs ${wine2.toUpperCase()}**\n\n`;
        if (w1) responseText += `🍷 **${w1.name}** — €${w1.price} | Score: ${w1.score}/100 | Rischio: ${w1.risk}\n`;
        if (w2) responseText += `🍾 **${w2.name}** — €${w2.price} | Score: ${w2.score}/100 | Rischio: ${w2.risk}\n\n`;
        responseText += `**Differenze chiave:**\n`;
        responseText += `📍 ${wine1}: Regione diversa, stile diverso, mercato target diverso\n`;
        responseText += `📍 ${wine2}: Liquidità mercato secondario, domanda globale\n\n`;
        responseText += `💡 Per un confronto preciso, cerca i due vini nella sezione **Mercato** e confronta i grafici storici.`;
        suggestedWines = [...(r1.results || []).slice(0, 2), ...(r2.results || []).slice(0, 2)];
      }
      resourceLinks = buildResourceLinks(["market", "ratings", "prices"]);
      break;
    }

    case "pratico": {
      const isPratico_conserva = /conserv|store|cantina|temperature|umidità|cellar/i.test(message);
      const isPratico_auth = /autenticità|authentic|fals|fake|verifica/i.test(message);
      const isPratico_buy = /dove.*compra|where.*buy|compro.*dove/i.test(message);
      if (isPratico_conserva) {
        responseText = `**Come conservare il vino da investimento**\n\n`;
        responseText += `🌡️ **Temperatura**: 12-14°C costante (mai sopra 18°C)\n`;
        responseText += `💧 **Umidità**: 70-80% (tappo non si secca, etichette intatte)\n`;
        responseText += `🌑 **Luce**: assenza totale di luce UV\n`;
        responseText += `📳 **Vibrazioni**: zero (no vicino a macchinari)\n`;
        responseText += `🍾 **Posizione**: orizzontale per vini con tappo in sughero\n\n`;
        responseText += `**Opzioni:**\n`;
        responseText += `1. **Cantina professionale** (Octavian, Cru, EuroCave Pro) — €5-15/cassa/anno\n`;
        responseText += `2. **Armadio climatizzato** — da €800 per uso casalingo\n`;
        responseText += `3. **Cantina privata** — investimento maggiore, controllo totale\n\n`;
        responseText += `⚠️ **Regola d'oro**: Se non puoi garantire 12-14°C costanti, usa una cantina professionale. Un vino mal conservato perde il 50-100% del valore.`;
      } else if (isPratico_auth) {
        responseText = `**Come verificare l'autenticità di un vino**\n\n`;
        responseText += `🔍 **Metodi principali:**\n`;
        responseText += `1. **Etichetta**: Verifica font, colori, stampa rispetto a bottiglie note. Usa community WineSearcher\n`;
        responseText += `2. **Capsula**: I grandi Châteaux usano capsule specifiche per annata\n`;
        responseText += `3. **Livello del vino**: Deve essere normale. Livello basso = possibile problema\n`;
        responseText += `4. **Provenienza**: Richiedi sempre la catena di custodia (provenance)\n`;
        responseText += `5. **Scanner etichetta**: Usa la funzione **Scanner** di VinoInvest per identificazione rapida\n\n`;
        responseText += `**Servizi certificati:**\n`;
        responseText += `- Vinfolio (certificazione USA)\n`;
        responseText += `- Farr Vintners (UK)\n`;
        responseText += `- Berry Bros & Rudd (UK)\n\n`;
        responseText += `⚠️ Acquista solo da rivenditori certificati o case d'asta di primo piano.`;
      } else if (isPratico_buy) {
        const opps = await executeTool("get_top_opportunities", { riskLevel: "medio" }, { allWines, API_URL });
        toolsUsed.push("get_top_opportunities");
        suggestedWines = (opps.opportunities || []).slice(0, 4);
        responseText = `**Dove comprare vino da investimento**\n\n`;
        responseText += `🏪 **Marketplace online:**\n`;
        responseText += `- **Wine-Searcher**: confronto prezzi globale\n`;
        responseText += `- **Vivino**: community + prezzi\n`;
        responseText += `- **Idealwine**: aste online, ottimo per Borgogna\n\n`;
        responseText += `🏛️ **Case d'asta tradizionali:**\n`;
        responseText += `- Sotheby's Wine, Christie's — grandi bottiglie e lotti\n`;
        responseText += `- Acker, Hart Davis Hart — americane, ottimi prezzi\n\n`;
        responseText += `🇮🇹 **In Italia:**\n`;
        responseText += `- Serena Wines, Tannico (consumer)\n`;
        responseText += `- Winemaker — aste\n\n`;
        responseText += `💡 **Su VinoInvest**: Acquista direttamente dalla piattaforma con prezzi aggiornati e investimento tracciato nel tuo portfolio.`;
      } else {
        responseText = `**Guida pratica all'investimento nel vino**\n\n`;
        responseText += `Ho diverse guide pratiche. Chiedimi:\n`;
        responseText += `🏪 "Dove comprare vino da investimento"\n`;
        responseText += `🌡️ "Come conservare il vino"\n`;
        responseText += `🔍 "Come verificare l'autenticità"\n`;
        responseText += `📋 "Come iniziare con €5.000"\n`;
        responseText += `⚖️ "Fiscalità del vino in Italia"\n`;
      }
      resourceLinks = buildResourceLinks(["prices", "education", "auctions"]);
      break;
    }

    case "mercato": {
      const newsResult = await executeTool("get_market_news", { country: "all", category: "market" }, { allWines, API_URL });
      toolsUsed.push("get_market_news");
      const articles = newsResult.articles || [];
      responseText = `**Andamento del Mercato del Vino Fine**\n\n`;
      responseText += `📊 **Tendenze 2025-2026:**\n`;
      responseText += `📈 **Borgogna (Bourgogne)**: domanda asiatica forte, prezzi in crescita +15% YoY\n`;
      responseText += `📈 **Super Tuscans (IT)**: Sassicaia, Masseto — interesse crescente, buona liquidità\n`;
      responseText += `📈 **Barolo/Barbaresco**: mercato in espansione, ancora valutazioni ragionevoli\n`;
      responseText += `📉 **Bordeaux classico**: correzione -5-10% da picco 2022, occasioni su annate secondarie\n`;
      responseText += `➡️ **Champagne**: stabile dopo rally 2021-2022\n\n`;
      if (articles.length) {
        responseText += `📰 **Ultime notizie:**\n`;
        articles.slice(0, 3).forEach(a => {
          responseText += `• **${a.title}** — ${a.source || "fonte"}\n`;
        });
        responseText += "\n";
      }
      responseText += `🔍 **Indice Liv-ex Fine Wine 100**: monitora le 100 bottiglie più scambiate. Usa come benchmark.\n`;
      responseText += `💡 Le regioni con miglior rapporto qualità/prezzo nel 2026: **Barolo**, **Ribera del Duero**, **Côte-Rôtie**.`;
      const opps = await executeTool("get_top_opportunities", { riskLevel: "medio" }, { allWines, API_URL });
      toolsUsed.push("get_top_opportunities");
      suggestedWines = (opps.opportunities || []).slice(0, 4);
      resourceLinks = buildResourceLinks(["market", "news", "prices"]);
      break;
    }

    case "enprimeur": {
      responseText = `**En Primeur: Come funziona**\n\n`;
      responseText += `En Primeur è il sistema di acquisto di vini **prima dell'imbottigliamento** (in botte), tipicamente 18-24 mesi prima della commercializzazione.\n\n`;
      responseText += `📅 **Calendario tipico (Bordeaux):**\n`;
      responseText += `- **Marzo-Aprile**: degustazioni barrel sample da critici\n`;
      responseText += `- **Aprile-Giugno**: finestra di vendita En Primeur\n`;
      responseText += `- **18-24 mesi dopo**: bottling e consegna\n\n`;
      responseText += `**Vantaggi:**\n`;
      responseText += `✅ Prezzo spesso inferiore al mercato secondario\n`;
      responseText += `✅ Accesso a vini rari (allocazioni limitate)\n`;
      responseText += `✅ Provenance perfetta (primo acquirente)\n\n`;
      responseText += `**Rischi:**\n`;
      responseText += `⚠️ Devi immobilizzare il capitale 2+ anni\n`;
      responseText += `⚠️ Possibile che il mercato secondario scenda\n`;
      responseText += `⚠️ Rischio produttore/merchant\n\n`;
      responseText += `**Annate da seguire (2026):**\n`;
      responseText += `Bordeaux 2024 · Borgogna 2023 · Barolo 2022\n\n`;
      responseText += `📆 Usa il **Tracker En Primeur** di VinoInvest per seguire tutte le finestre di apertura.`;
      resourceLinks = buildResourceLinks(["education", "market", "auctions"]);
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
  const portfolioTotal = holdings.reduce((s, h) => s + (h.currentValue || 0), 0);
  const systemPrompt = `You are VinoInvest AI Agent, an expert fine wine investment advisor with deep knowledge of:
- Investment strategy: ROI, timing, diversification, portfolio construction
- Market data: Bordeaux, Burgundy, Tuscany, Barolo, Champagne, Rhône trends
- Education: en primeur, Liv-ex, TUIR Art.67 tax law, authentication, storage
- Comparisons: wine vs S&P500, Barolo vs Bordeaux, region analysis
- Practical: where to buy, how to store (12-14°C, 70% humidity), authentication
- News: latest market movements, critic scores, auction results

CURRENT USER PORTFOLIO (${holdings.length} wines):
${holdings.length > 0
    ? holdings.map(h => `- ${h.name}: ${h.quantity}btl @ €${h.purchasePrice} → €${h.currentPrice} (ROI: ${h.roi}%)`).join("\n") + `\nTotal: €${portfolioTotal.toFixed(0)}`
    : "No portfolio positions yet."}

CATEGORY EXPERTISE:
- investimento: ROI, quando comprare/vendere, budget allocation
- mercato: tendenze 2025-2026, regioni in crescita, Liv-ex benchmark
- educativo: en primeur, Liv-ex, fiscalità, come funziona il mercato
- portfolio: analisi ROI, diversificazione, rebalancing
- ricerca: trovare vini specifici, confronto annate
- confronto: wine A vs B, vino vs S&P500, confronto regioni
- notizie: ultime news, aste, punteggi critici
- pratico: dove comprare, come conservare, autenticità

RESOURCES TO CITE when relevant:
- News/ratings: decanter.com, jancisrobinson.com, winespectator.com, robertparker.com
- Prices: wine-searcher.com, vivino.com
- Auctions: sothebys.com, christies.com, idealwine.com
- Market: liv-ex.com

Always respond in the user's language (language hint: ${lang || "it"}).
Be concise (max 350 words), actionable, use real data from tools.
Format with markdown bold and emoji for readability.
Always end with a suggestion for next action on VinoInvest platform.
Include 2-3 relevant resource links.
End with: "---\n⚠️ Analisi informativa. Non costituisce consulenza finanziaria."`;


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

const DISCLAIMER = "\n\n---\n⚠️ Analisi informativa. Non costituisce consulenza finanziaria.";

// ── Proactive suggestions based on context ────────────────────────────────
export function getFollowUpSuggestions(intent, lang = "it") {
  const suggestions = {
    budget: ["Analizza il mio portfolio", "Mostra i rischi di questi vini", "Come diversifico meglio?"],
    portfolio: ["Quando dovrei vendere?", "Mostrami opportunità di rebalancing", "Confronta il mio ROI con S&P500"],
    news: ["Quali vini beneficiano di questi trend?", "Top opportunità oggi", "Analizza il mio portfolio"],
    confronto: ["Mostrami il grafico storico prezzi", "Cosa compro con €5.000?", "Top Barolo da investimento"],
    pratico: ["Dove compro questi vini?", "Come verifico l'autenticità?", "Quanto costa conservare?"],
    mercato: ["Top vini per questo mercato", "Quali regioni crescono di più?", "Analizza il mio portfolio"],
    enprimeur: ["Bordeaux 2024 en primeur", "Come accedo alle allocazioni?", "Rischi dell'en primeur"],
    education: ["Come inizio con €5.000?", "Top vini per principianti", "En primeur: come funziona?"],
    sell: ["Quando vendere il mio top performer?", "Dove vendere?", "Quanto posso realizzare?"],
    similar: ["Confronta questi vini", "Aggiungi al portfolio", "Storico prezzi"],
    region: ["Top vini di questa regione", "Confronto con altre regioni", "Annate migliori"],
    opportunities: ["Come compro questi vini?", "Analizza il mio portfolio", "Trend mercato 2026"],
    general: ["Top 10 opportunità oggi", "Analizza il mio portfolio", "News mercato vino"],
  };
  return (suggestions[intent] || suggestions.general).slice(0, 3);
}

// ── Public API ─────────────────────────────────────────────────────────────
export async function runAgent({ message, conversationHistory = [], holdings = [], allWines = [], searchWinesFromDB, API_URL = "https://vinoinvest-backend-2.onrender.com", lang = "it" }) {
  let result;
  const intent = detectIntent(message);
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      result = await runClaudeAgent({ message, conversationHistory, holdings, allWines, searchWinesFromDB, API_URL, lang });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[agent] Claude API error, falling back to algorithmic:", err.message);
    }
  }
  if (!result) result = await runAlgorithmicAgent({ message, conversationHistory, holdings, allWines, searchWinesFromDB, API_URL, lang });
  if (result.response && !result.response.includes("Non costituisce consulenza")) result.response += DISCLAIMER;
  result.followUpSuggestions = getFollowUpSuggestions(intent, lang);
  result.intent = intent;
  return result;
}

export { buildResourceLinks };
