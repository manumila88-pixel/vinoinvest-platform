// Academy video config — embedUrl: null shows elegant placeholder with YouTube search link
const ACADEMY_MODULE_VIDEOS = {
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
