// Academy video config — embedUrl: null shows elegant placeholder with YouTube search link
const ACADEMY_MODULE_VIDEOS = {
  // Corso 12 – Portfolio Construction
  c12_01: { embedUrl: null, searchQuery: "wine portfolio diversification modern portfolio theory MPT" },
  c12_02: { embedUrl: null, searchQuery: "efficient frontier portfolio optimization fine wine" },
  c12_03: { embedUrl: null, searchQuery: "bordeaux burgundy italy wine investment comparison regions" },
  c12_04: { embedUrl: null, searchQuery: "wine vintage chart investment value bordeaux burgundy" },
  c12_05: { embedUrl: null, searchQuery: "wine producer reputation pricing power blue chip investment" },
  c12_06: { embedUrl: null, searchQuery: "champagne investment prestige cuvee dom perignon krug cristal" },
  c12_07: { embedUrl: null, searchQuery: "rhone super tuscans napa valley emerging wine markets" },
  c12_08: { embedUrl: null, searchQuery: "fine wine exit strategy auction house christies sothebys" },
  c12_09: { embedUrl: null, searchQuery: "sauternes chateau d'yquem investment sweet wine" },
  c12_10: { embedUrl: null, searchQuery: "wine portfolio building 5000 to 500000 euros roadmap" },
  // Corso 13 – En Primeur Avanzato
  c13_01: { embedUrl: null, searchQuery: "bordeaux en primeur how it works campaign spring" },
  c13_02: { embedUrl: null, searchQuery: "en primeur pricing value assessment secondaire market" },
  c13_03: { embedUrl: null, searchQuery: "place de bordeaux negociants system distribution wine" },
  // Corso 14 – Autenticità e Provenienza
  c14_01: { embedUrl: null, searchQuery: "fine wine counterfeit fraud rudy kurniawan documentary" },
  c14_02: { embedUrl: null, searchQuery: "wine bottle authentication physical inspection technique" },
  // Corso 15 – Tax e Legale
  c15_01: { embedUrl: null, searchQuery: "wine investment tax capital gains Italy Europe guide" },
  c15_02: { embedUrl: null, searchQuery: "wine wasting asset UK capital gains tax exemption" },
  // Corso 16 – Mercato Secondario
  c16_01: { embedUrl: null, searchQuery: "fine wine secondary market auction exchange live-ex guide" },
  c16_02: { embedUrl: null, searchQuery: "liv-ex wine exchange how to use professional trading" },
  // Corso 17 – Data Analytics
  c17_01: { embedUrl: null, searchQuery: "fine wine data sources liv-ex wine searcher prices analysis" },
  c17_02: { embedUrl: null, searchQuery: "python wine portfolio analytics pandas matplotlib tutorial" },
  // Corso 18–30 (query generali per topic)
  c18_01: { embedUrl: null, searchQuery: "fine wine investment case study portfolio 0 to 1 million" },
  c19_01: { embedUrl: null, searchQuery: "wine cellar investment storage temperature humidity guide" },
  c20_01: { embedUrl: null, searchQuery: "wine investment portfolio workshop certification professional" },
  c21_01: { embedUrl: null, searchQuery: "wealth management HNW family office wine alternative investment" },
  c22_01: { embedUrl: null, searchQuery: "wine investment analytics dashboard KPI reporting professional" },
  c23_01: { embedUrl: null, searchQuery: "wine investment regulation compliance MiFID alternative assets" },
  c24_01: { embedUrl: null, searchQuery: "fine wine international markets Asia Hong Kong China investment" },
  c25_01: { embedUrl: null, searchQuery: "wine investment fund management structure performance track record" },
  c26_01: { embedUrl: null, searchQuery: "sustainable wine ESG biodynamic investment returns" },
  c27_01: { embedUrl: null, searchQuery: "fine wine live market data masterclass professional analysis" },
  c28_01: { embedUrl: null, searchQuery: "AI machine learning wine price prediction portfolio automation" },
  c29_01: { embedUrl: null, searchQuery: "wine investment advisory business model client acquisition" },
  c30_01: { embedUrl: null, searchQuery: "wine investment professional certification exam preparation" },
  // Corso 11 – Rendimenti Storici
  rs_01: { embedUrl: null, searchQuery: "fine wine investment returns historical liv-ex 100 index" },
  rs_02: { embedUrl: null, searchQuery: "bordeaux first growths wine investment lafite mouton pauillac" },
  rs_03: { embedUrl: null, searchQuery: "burgundy romanee conti DRC wine investment grand cru" },
  rs_04: { embedUrl: null, searchQuery: "barolo brunello sassicaia italian fine wine investment" },
  rs_05: { embedUrl: null, searchQuery: "champagne vintage investment cristal krug dom perignon" },
  rs_06: { embedUrl: null, searchQuery: "chateau d'yquem sauternes tokaj sweet wine investment" },
  rs_07: { embedUrl: null, searchQuery: "rhone valley hermitage chateauneuf du pape wine investment" },
  rs_08: { embedUrl: null, searchQuery: "napa valley argentina barossa new world fine wine investment" },
  rs_09: { embedUrl: null, searchQuery: "bordeaux en primeur wine futures how it works guide" },
  rs_10: { embedUrl: null, searchQuery: "christies sothebys wine auction guide how to sell buy" },
  rs_11: { embedUrl: null, searchQuery: "liv-ex wine index bordeaux 500 burgundy 150 explained" },
  rs_12: { embedUrl: null, searchQuery: "fine wine stock market correlation alternative investment portfolio" },
  rs_13: { embedUrl: null, searchQuery: "fine wine seasonality when to buy sell best time" },
  rs_14: { embedUrl: null, searchQuery: "wine cellar storage costs hidden fees investment returns" },
  rs_15: { embedUrl: null, searchQuery: "fine wine exit strategy sell auction maximize price" },
  rs_16: { embedUrl: null, searchQuery: "wine investment tax capital gains UK Italy USA guide" },
  rs_17: { embedUrl: null, searchQuery: "wine portfolio construction management 2010 2024 strategy" },
  rs_18: { embedUrl: null, searchQuery: "petrus romanee conti sassicaia wine returns 1000 percent case study" },
  rs_19: { embedUrl: null, searchQuery: "fine wine investment mistakes to avoid beginners guide" },
  rs_20: { embedUrl: null, searchQuery: "build wine investment portfolio beginner step by step guide" },
};

export function getModuleVideo(moduleId) {
  return ACADEMY_MODULE_VIDEOS[moduleId] || {
    embedUrl: null,
    searchQuery: "fine wine investment guide",
  };
}

export default ACADEMY_MODULE_VIDEOS;
