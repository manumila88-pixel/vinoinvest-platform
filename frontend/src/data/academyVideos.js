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
  c13_04: { embedUrl: null, searchQuery: "en primeur top chateaux allocation waiting list LVMH" },
  c13_05: { embedUrl: null, searchQuery: "burgundy en primeur pre-arrival mailing list domaine" },
  // Corso 14 – Autenticità e Provenienza
  c14_01: { embedUrl: null, searchQuery: "fine wine counterfeit fraud rudy kurniawan documentary" },
  c14_02: { embedUrl: null, searchQuery: "wine bottle authentication physical inspection technique" },
  c14_03: { embedUrl: null, searchQuery: "wine label capsule cork inspection vintage verification" },
  c14_04: { embedUrl: null, searchQuery: "wine provenance chain of custody documentation auction house" },
  c14_05: { embedUrl: null, searchQuery: "wine authentication technology QR code blockchain RFID" },
  // Corso 15 – Tax e Legale
  c15_01: { embedUrl: null, searchQuery: "wine investment tax capital gains Italy Europe guide" },
  c15_02: { embedUrl: null, searchQuery: "wine wasting asset UK capital gains tax exemption" },
  c15_03: { embedUrl: null, searchQuery: "wine VAT importation Europe duty-paid in bond bonded" },
  c15_04: { embedUrl: null, searchQuery: "wine inheritance estate planning succession tax minimization" },
  c15_05: { embedUrl: null, searchQuery: "wine investment company structure vehicle tax efficient" },
  // Corso 16 – Mercato Secondario
  c16_01: { embedUrl: null, searchQuery: "fine wine secondary market auction exchange live-ex guide" },
  c16_02: { embedUrl: null, searchQuery: "liv-ex wine exchange how to use professional trading" },
  c16_03: { embedUrl: null, searchQuery: "wine auction Christie's Hart Davis Hart bidding guide tips" },
  c16_04: { embedUrl: null, searchQuery: "wine exchange platform Cavex WineBid Acker Merrall how to" },
  c16_05: { embedUrl: null, searchQuery: "wine market making bid ask spread liquidity fine wine" },
  // Corso 17 – Data Analytics
  c17_01: { embedUrl: null, searchQuery: "fine wine data sources liv-ex wine searcher prices analysis" },
  c17_02: { embedUrl: null, searchQuery: "python wine portfolio analytics pandas matplotlib tutorial" },
  c17_03: { embedUrl: null, searchQuery: "wine data visualization tableau power BI dashboard tutorial" },
  c17_04: { embedUrl: null, searchQuery: "wine market correlation analysis stock market gold inflation" },
  c17_05: { embedUrl: null, searchQuery: "predictive model wine price vintage quality weather data" },
  // Corso 18 – Case Study: 0 → €1M
  c18_01: { embedUrl: null, searchQuery: "fine wine investment case study portfolio 0 to 1 million" },
  c18_02: { embedUrl: null, searchQuery: "wine portfolio building strategy selecting first cases to buy" },
  c18_03: { embedUrl: null, searchQuery: "wine investment timing when to buy bordeaux futures en primeur" },
  c18_04: { embedUrl: null, searchQuery: "wine investment selling strategy auction vs private sale timing" },
  c18_05: { embedUrl: null, searchQuery: "lessons learned fine wine investment mistakes case study analysis" },
  // Corso 19 – Cantina e Storage
  c19_01: { embedUrl: null, searchQuery: "wine cellar investment storage temperature humidity guide" },
  c19_02: { embedUrl: null, searchQuery: "professional wine storage bonded warehouse London Paris" },
  c19_03: { embedUrl: null, searchQuery: "wine storage costs underground cellar vs warehouse comparison" },
  c19_04: { embedUrl: null, searchQuery: "wine insurance cellar coverage Lloyd's specialist policy" },
  c19_05: { embedUrl: null, searchQuery: "wine inventory management software cellar tracker professional" },
  // Corso 20 – Workshop Hands-On
  c20_01: { embedUrl: null, searchQuery: "wine investment portfolio workshop certification professional" },
  c20_02: { embedUrl: null, searchQuery: "wine tasting professional scoring parker points guide blind" },
  c20_03: { embedUrl: null, searchQuery: "wine investment spreadsheet model valuation DCF approach" },
  c20_04: { embedUrl: null, searchQuery: "live wine auction bidding Christie's Sotheby's Hart Davis Hart" },
  c20_05: { embedUrl: null, searchQuery: "wine portfolio review optimize rebalancing case study" },
  // Corso 21 – HNW & Family Office
  c21_01: { embedUrl: null, searchQuery: "wealth management HNW family office wine alternative investment" },
  c21_02: { embedUrl: null, searchQuery: "family office alternative assets wine art whisky allocation" },
  c21_03: { embedUrl: null, searchQuery: "UHNW high net worth wine collection management estate planning" },
  c21_04: { embedUrl: null, searchQuery: "wine investment due diligence provenance verification HNW" },
  c21_05: { embedUrl: null, searchQuery: "wine gifting philanthropy charity auction UHNW estate strategy" },
  // Corso 22 – Analytics & KPI
  c22_01: { embedUrl: null, searchQuery: "wine investment analytics dashboard KPI reporting professional" },
  c22_02: { embedUrl: null, searchQuery: "liv-ex wine index data analysis Python pandas tutorial" },
  c22_03: { embedUrl: null, searchQuery: "wine price forecasting regression model machine learning" },
  c22_04: { embedUrl: null, searchQuery: "wine investment portfolio sharpe ratio risk adjusted return" },
  c22_05: { embedUrl: null, searchQuery: "wine market data API integration wine-searcher liv-ex" },
  // Corso 23 – Regolamentazione & Compliance
  c23_01: { embedUrl: null, searchQuery: "wine investment regulation compliance MiFID alternative assets" },
  c23_02: { embedUrl: null, searchQuery: "EU alternative investment fund managers directive AIFMD wine" },
  c23_03: { embedUrl: null, searchQuery: "wine import export regulations customs duties international" },
  c23_04: { embedUrl: null, searchQuery: "wine anti-money laundering AML compliance due diligence" },
  c23_05: { embedUrl: null, searchQuery: "wine investment platform regulation FCA SEC registration guide" },
  // Corso 24 – Mercati Internazionali
  c24_01: { embedUrl: null, searchQuery: "fine wine international markets Asia Hong Kong China investment" },
  c24_02: { embedUrl: null, searchQuery: "Hong Kong wine auction market Sotheby's Christie's Bonhams" },
  c24_03: { embedUrl: null, searchQuery: "China wine consumption luxury market bordeaux burgundy growth" },
  c24_04: { embedUrl: null, searchQuery: "Singapore wine trading hub bonded warehouse Asia market" },
  c24_05: { embedUrl: null, searchQuery: "Japan wine culture investment sake vs wine market comparison" },
  // Corso 25 – Fund Management
  c25_01: { embedUrl: null, searchQuery: "wine investment fund management structure performance track record" },
  c25_02: { embedUrl: null, searchQuery: "wine fund structure Cayman BVI LP setup fees management carry" },
  c25_03: { embedUrl: null, searchQuery: "wine investment fund performance attribution Bordeaux index" },
  c25_04: { embedUrl: null, searchQuery: "wine fund investor relations reporting quarterly NAV" },
  c25_05: { embedUrl: null, searchQuery: "wine fund liquidity management redemption terms gates" },
  // Corso 26 – ESG & Sostenibilità
  c26_01: { embedUrl: null, searchQuery: "sustainable wine ESG biodynamic investment returns" },
  c26_02: { embedUrl: null, searchQuery: "biodynamic wine Burgundy Alsace Rudolf Steiner certification" },
  c26_03: { embedUrl: null, searchQuery: "organic wine certification European Union label investment value" },
  c26_04: { embedUrl: null, searchQuery: "carbon neutral winery sustainability report B Corp wine" },
  c26_05: { embedUrl: null, searchQuery: "climate change wine investment risk Bordeaux vintage shift" },
  // Corso 27 – Masterclass Live
  c27_01: { embedUrl: null, searchQuery: "fine wine live market data masterclass professional analysis" },
  c27_02: { embedUrl: null, searchQuery: "bordeaux first growths tasting masterclass Latour Margaux" },
  c27_03: { embedUrl: null, searchQuery: "Burgundy Grand Cru masterclass DRC Leroy Rousseau tasting" },
  c27_04: { embedUrl: null, searchQuery: "Champagne prestige cuvee Dom Perignon Krug Cristal masterclass" },
  c27_05: { embedUrl: null, searchQuery: "Italy Super Tuscan masterclass Sassicaia Ornellaia Masseto" },
  // Corso 28 – AI & Tecnologia
  c28_01: { embedUrl: null, searchQuery: "AI machine learning wine price prediction portfolio automation" },
  c28_02: { embedUrl: null, searchQuery: "natural language processing wine reviews score prediction NLP" },
  c28_03: { embedUrl: null, searchQuery: "wine recommendation engine collaborative filtering algorithm" },
  c28_04: { embedUrl: null, searchQuery: "blockchain wine provenance NFT authentication supply chain" },
  c28_05: { embedUrl: null, searchQuery: "wine data scraping API price aggregation technical guide" },
  // Corso 29 – Business del Vino
  c29_01: { embedUrl: null, searchQuery: "wine investment advisory business model client acquisition" },
  c29_02: { embedUrl: null, searchQuery: "wine merchant business plan revenue model margins" },
  c29_03: { embedUrl: null, searchQuery: "wine investment platform startup SaaS business model" },
  c29_04: { embedUrl: null, searchQuery: "wine négociant business Bordeaux place de bordeaux access" },
  c29_05: { embedUrl: null, searchQuery: "wine brand building marketing luxury positioning strategy" },
  // Corso 30 – Certificazione Finale
  c30_01: { embedUrl: null, searchQuery: "wine investment professional certification exam preparation" },
  c30_02: { embedUrl: null, searchQuery: "WSET Level 4 Diploma wine investment module exam guide" },
  c30_03: { embedUrl: null, searchQuery: "wine investment competency framework professional assessment" },
  c30_04: { embedUrl: null, searchQuery: "continuing education wine investment CFA equivalent CPD hours" },
  c30_05: { embedUrl: null, searchQuery: "wine investment advisor career path salary portfolio manager" },
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
