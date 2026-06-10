/**
 * Wine region reference data.
 * Used by AI advisor, region analysis, and investment scoring.
 */

export const WINE_REGIONS = [
  // ── FRANCE ─────────────────────────────────────────────────────────────────
  {
    id: "bordeaux",
    name: "Bordeaux",
    country: "France",
    flag: "🇫🇷",
    icon: "🏰",
    investmentRating: 95,
    liquidityRating: 98,
    ageabilityYears: "20-50",
    keyGrapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"],
    topProducers: ["Pétrus", "Château Margaux", "Château Latour", "Château Lafite Rothschild", "Château Mouton Rothschild", "Château Haut-Brion", "Le Pin"],
    priceRange: { entry: 30, mid: 200, premium: 500, icon: 2000 },
    marketSize: "Largest fine wine market",
    classification: "1855 Classification (5 Premiers Crus Classés)",
    bestVintages: [2019, 2016, 2015, 2010, 2009, 2005, 2000, 1982],
    investmentNote: "Most liquid fine wine market. Ideal for entry-level investors. Correcting from 2022 peak.",
    subRegions: ["Pauillac", "Saint-Julien", "Margaux", "Saint-Émilion", "Pomerol", "Pessac-Léognan"],
  },

  {
    id: "burgundy",
    name: "Burgundy (Bourgogne)",
    country: "France",
    flag: "🇫🇷",
    icon: "🍇",
    investmentRating: 99,
    liquidityRating: 90,
    ageabilityYears: "10-30",
    keyGrapes: ["Pinot Noir", "Chardonnay"],
    topProducers: ["Domaine de la Romanée-Conti", "Domaine Leroy", "Armand Rousseau", "Georges Roumier", "Domaine Leflaive"],
    priceRange: { entry: 40, mid: 300, premium: 2000, icon: 30000 },
    marketSize: "High value, limited supply",
    classification: "By vineyard (Grand Cru > Premier Cru > Village)",
    bestVintages: [2022, 2021, 2020, 2019, 2015, 2010, 2005, 2002, 1999, 1996],
    investmentNote: "Highest prestige. DRC and Leroy command 10-30K€/bottle. Strong Asian demand. Less liquid than Bordeaux.",
    subRegions: ["Côte de Nuits", "Côte de Beaune", "Chablis", "Mâconnais", "Côte Chalonnaise"],
  },

  {
    id: "champagne",
    name: "Champagne",
    country: "France",
    flag: "🇫🇷",
    icon: "🥂",
    investmentRating: 85,
    liquidityRating: 92,
    ageabilityYears: "5-25",
    keyGrapes: ["Chardonnay", "Pinot Noir", "Pinot Meunier"],
    topProducers: ["Dom Pérignon", "Krug", "Cristal (Roederer)", "Salon", "Jacques Selosse", "Bollinger"],
    priceRange: { entry: 50, mid: 150, premium: 400, icon: 1500 },
    marketSize: "Global luxury market",
    classification: "Prestige Cuvée / Vintage / Non-Vintage",
    bestVintages: [2012, 2008, 2002, 1996, 1990, 1988, 1982],
    investmentNote: "Prestige cuvées (DP, Krug, Cristal) offer stability. Vintage Champagne ages 20-30 years. Good corporate gifting market.",
    subRegions: ["Montagne de Reims", "Côte des Blancs", "Vallée de la Marne"],
  },

  {
    id: "rhone",
    name: "Rhône Valley",
    country: "France",
    flag: "🇫🇷",
    icon: "🌿",
    investmentRating: 82,
    liquidityRating: 80,
    ageabilityYears: "10-30",
    keyGrapes: ["Syrah", "Grenache", "Mourvèdre", "Viognier"],
    topProducers: ["Jean-Louis Chave", "Château Rayas", "Henri Bonneau", "Chapoutier", "Guigal"],
    priceRange: { entry: 30, mid: 100, premium: 500, icon: 5000 },
    marketSize: "Niche but growing",
    classification: "Hermitage, Côte-Rôtie, Châteauneuf-du-Pape",
    bestVintages: [2010, 2009, 2005, 2001, 1999, 1998, 1990, 1989, 1978],
    investmentNote: "Undervalued relative to Burgundy. Château Rayas and Chave Hermitage have cult following. 2009/2010 exceptional.",
    subRegions: ["Hermitage", "Côte-Rôtie", "Châteauneuf-du-Pape", "Gigondas", "Crozes-Hermitage"],
  },

  {
    id: "alsace",
    name: "Alsace",
    country: "France",
    flag: "🇫🇷",
    icon: "🏡",
    investmentRating: 75,
    liquidityRating: 65,
    ageabilityYears: "15-50",
    keyGrapes: ["Riesling", "Gewurztraminer", "Pinot Gris", "Muscat"],
    topProducers: ["Domaine Weinbach", "Zind-Humbrecht", "Trimbach", "Marcel Deiss", "Hugel"],
    priceRange: { entry: 20, mid: 70, premium: 200, icon: 800 },
    marketSize: "Niche",
    classification: "Grand Cru (51 vineyards)",
    bestVintages: [2018, 2015, 2009, 2007, 2005, 2001, 1990, 1989, 1983],
    investmentNote: "Exceptional longevity, especially SGN and VT. Limited investment liquidity. More for connoisseurs than pure investors.",
    subRegions: ["Ribeauvillé", "Riquewihr", "Andlau", "Guebwiller"],
  },

  // ── ITALY ───────────────────────────────────────────────────────────────────
  {
    id: "piemonte",
    name: "Piemonte (Barolo & Barbaresco)",
    country: "Italy",
    flag: "🇮🇹",
    icon: "🏔️",
    investmentRating: 93,
    liquidityRating: 82,
    ageabilityYears: "15-40",
    keyGrapes: ["Nebbiolo", "Barbera", "Dolcetto"],
    topProducers: ["Giacomo Conterno", "Bruno Giacosa", "Gaja", "Vietti", "Bartolo Mascarello", "Sandrone"],
    priceRange: { entry: 35, mid: 120, premium: 400, icon: 2000 },
    marketSize: "Growing rapidly",
    classification: "DOCG Barolo / Barbaresco + Cru system",
    bestVintages: [2021, 2016, 2013, 2010, 2001, 1999, 1996, 1990, 1989, 1978, 1971],
    investmentNote: "Rising star. 'The new Burgundy' for many experts. Monfortino and Giacosa Falletto have exceptional upside. Excellent value vs French peers.",
    subRegions: ["La Morra", "Barolo", "Castiglione Falletto", "Serralunga d'Alba", "Treiso"],
  },

  {
    id: "toscana",
    name: "Toscana (Brunello & Super Tuscans)",
    country: "Italy",
    flag: "🇮🇹",
    icon: "☀️",
    investmentRating: 90,
    liquidityRating: 88,
    ageabilityYears: "15-30",
    keyGrapes: ["Sangiovese", "Cabernet Sauvignon", "Merlot"],
    topProducers: ["Sassicaia", "Ornellaia", "Masseto", "Antinori", "Biondi-Santi", "Giacomo Tachis"],
    priceRange: { entry: 40, mid: 150, premium: 500, icon: 5000 },
    marketSize: "Large and liquid",
    classification: "DOCG Brunello di Montalcino / Chianti Classico + IGT Super Tuscans",
    bestVintages: [2019, 2016, 2015, 2010, 2007, 2004, 2001, 1997, 1990, 1985],
    investmentNote: "Sassicaia most internationally liquid. Brunello from Biondi-Santi/Casanova di Neri exceptional upside. Strong USA market.",
    subRegions: ["Bolgheri", "Montalcino", "Chianti Classico", "Montepulciano", "Morellino di Scansano"],
  },

  {
    id: "valpolicella",
    name: "Veneto (Amarone)",
    country: "Italy",
    flag: "🇮🇹",
    icon: "🍷",
    investmentRating: 75,
    liquidityRating: 70,
    ageabilityYears: "15-25",
    keyGrapes: ["Corvina", "Molinara", "Rondinella"],
    topProducers: ["Quintarelli", "Dal Forno Romano", "Allegrini", "Masi"],
    priceRange: { entry: 30, mid: 80, premium: 300, icon: 3000 },
    marketSize: "Niche",
    classification: "DOCG Amarone della Valpolicella",
    bestVintages: [2015, 2012, 2011, 2008, 2006, 2004, 2001, 1997, 1988],
    investmentNote: "Quintarelli is the trophy wine — extremely rare. Dal Forno Romano: exceptional quality. Limited investment liquidity overall.",
    subRegions: ["Classico", "Valpantena", "Est"],
  },

  // ── GERMANY ─────────────────────────────────────────────────────────────────
  {
    id: "mosel",
    name: "Mosel (Riesling)",
    country: "Germany",
    flag: "🇩🇪",
    icon: "🏘️",
    investmentRating: 88,
    liquidityRating: 72,
    ageabilityYears: "20-100",
    keyGrapes: ["Riesling"],
    topProducers: ["Egon Müller", "J.J. Prüm", "Willi Schaefer", "Dönnhoff", "Keller"],
    priceRange: { entry: 25, mid: 100, premium: 500, icon: 20000 },
    marketSize: "Niche with cult following",
    classification: "VDP system (Grosse Lage, Grosses Gewächs)",
    bestVintages: [2019, 2015, 2009, 2007, 2005, 2003, 1997, 1990, 1983, 1971, 1959],
    investmentNote: "Egon Müller TBA/Auslese: among the rarest wines in the world (€5-20K). Exceptional longevity (50-100+ years). Niche but passionate collector base.",
    subRegions: ["Saar", "Ruwer", "Mittelmosel"],
  },

  // ── SPAIN ───────────────────────────────────────────────────────────────────
  {
    id: "ribera_del_duero",
    name: "Ribera del Duero & Rioja",
    country: "Spain",
    flag: "🇪🇸",
    icon: "🌞",
    investmentRating: 82,
    liquidityRating: 78,
    ageabilityYears: "15-30",
    keyGrapes: ["Tempranillo", "Garnacha", "Cariñena"],
    topProducers: ["Vega Sicilia", "Pingus", "Álvaro Palacios", "López de Heredia", "Artadi"],
    priceRange: { entry: 20, mid: 80, premium: 400, icon: 3000 },
    marketSize: "Growing internationally",
    classification: "DOC Rioja Gran Reserva / Ribera del Duero",
    bestVintages: [2020, 2016, 2015, 2012, 2005, 2001, 1999, 1996, 1994],
    investmentNote: "Vega Sicilia Único: the most collectible Spanish wine. Pingus from Dominio de Pingus growing fast. Good value vs French peers.",
    subRegions: ["Ribera del Duero", "Rioja Alta", "Priorat", "Bierzo"],
  },

  // ── USA ─────────────────────────────────────────────────────────────────────
  {
    id: "napa_valley",
    name: "Napa Valley (California)",
    country: "USA",
    flag: "🇺🇸",
    icon: "🌉",
    investmentRating: 90,
    liquidityRating: 88,
    ageabilityYears: "15-30",
    keyGrapes: ["Cabernet Sauvignon", "Merlot", "Chardonnay", "Pinot Noir"],
    topProducers: ["Screaming Eagle", "Harlan Estate", "Opus One", "Shafer", "Dominus", "Darioush"],
    priceRange: { entry: 50, mid: 200, premium: 600, icon: 5000 },
    marketSize: "Strong USA demand",
    classification: "AVA system (Oakville, Stags Leap, Rutherford...)",
    bestVintages: [2021, 2019, 2016, 2015, 2014, 2013, 2012, 2005, 1997, 1994, 1991],
    investmentNote: "Screaming Eagle and Harlan Estate are trophies. Best US investment wines. Strong domestic demand = good liquidity in USA auctions.",
    subRegions: ["Oakville", "Rutherford", "Stags Leap District", "Howell Mountain", "Mount Veeder"],
  },

  {
    id: "oregon",
    name: "Oregon (Willamette Valley)",
    country: "USA",
    flag: "🇺🇸",
    icon: "🌲",
    investmentRating: 72,
    liquidityRating: 65,
    ageabilityYears: "10-20",
    keyGrapes: ["Pinot Noir", "Chardonnay"],
    topProducers: ["Domaine Drouhin Oregon", "Eyrie Vineyards", "Ponzi", "Adelsheim"],
    priceRange: { entry: 25, mid: 80, premium: 200, icon: 600 },
    marketSize: "Emerging",
    classification: "AVA system",
    bestVintages: [2020, 2018, 2014, 2012, 2008, 2002],
    investmentNote: "Climate change benefits Oregon. Burgundy-trained producers moving here. Limited track record but strong upside. Better as drinker than investment currently.",
    subRegions: ["Dundee Hills", "Chehalem Mountains", "Ribbon Ridge", "Eola-Amity Hills"],
  },

  // ── AUSTRALIA ───────────────────────────────────────────────────────────────
  {
    id: "australia",
    name: "Australia (Barossa / Eden Valley)",
    country: "Australia",
    flag: "🇦🇺",
    icon: "🦘",
    investmentRating: 80,
    liquidityRating: 75,
    ageabilityYears: "15-40",
    keyGrapes: ["Shiraz", "Cabernet Sauvignon", "Riesling"],
    topProducers: ["Penfolds", "Henschke", "Torbreck", "Giaconda"],
    priceRange: { entry: 30, mid: 100, premium: 400, icon: 2000 },
    marketSize: "Strong Asia demand",
    classification: "No official classification. GI system",
    bestVintages: [2019, 2016, 2010, 2006, 2004, 2002, 2001, 1990, 1986],
    investmentNote: "Penfolds Grange is the national trophy — most internationally recognized. Henschke Hill of Grace exceptional. Strong Asian market (especially China) when open.",
    subRegions: ["Barossa Valley", "Eden Valley", "Clare Valley", "McLaren Vale", "Coonawarra"],
  },

  // ── PORTUGAL ────────────────────────────────────────────────────────────────
  {
    id: "douro",
    name: "Douro (Port Wine)",
    country: "Portugal",
    flag: "🇵🇹",
    icon: "🏺",
    investmentRating: 80,
    liquidityRating: 70,
    ageabilityYears: "20-80",
    keyGrapes: ["Touriga Nacional", "Touriga Franca", "Tinta Roriz", "Tinta Barroca"],
    topProducers: ["Quinta do Noval", "Graham's", "Taylor's", "Fonseca", "Niepoort", "Quinta do Vesuvio"],
    priceRange: { entry: 30, mid: 80, premium: 300, icon: 5000 },
    marketSize: "Niche",
    classification: "Vintage Port / LBV / Tawny",
    bestVintages: [2017, 2016, 2011, 2007, 2003, 2000, 1997, 1994, 1977, 1963, 1945],
    investmentNote: "Quinta do Noval Nacional: rarest Port (200 bottles/year). Vintage Ports age 50+ years. Niche but passionate collector base. UK auction market well-developed.",
    subRegions: ["Cima Corgo", "Baixo Corgo", "Douro Superior"],
  },

  // ── ARGENTINA ───────────────────────────────────────────────────────────────
  {
    id: "mendoza",
    name: "Mendoza (Argentina)",
    country: "Argentina",
    flag: "🇦🇷",
    icon: "🏔️",
    investmentRating: 73,
    liquidityRating: 68,
    ageabilityYears: "10-20",
    keyGrapes: ["Malbec", "Cabernet Sauvignon", "Torrontés"],
    topProducers: ["Catena Zapata", "Achaval Ferrer", "Zuccardi", "Clos de los Siete"],
    priceRange: { entry: 15, mid: 60, premium: 200, icon: 800 },
    marketSize: "Emerging",
    classification: "DOC Luján de Cuyo / GI system",
    bestVintages: [2021, 2017, 2015, 2013, 2010, 2007],
    investmentNote: "Catena Adrianna vineyard wines are emerging cult wines — already receiving Parker 100. Limited international track record. Good value play.",
    subRegions: ["Luján de Cuyo", "Maipú", "Valle de Uco"],
  },
];

/** Get region data by ID */
export function getRegion(id) {
  return WINE_REGIONS.find(r => r.id === id) ?? null;
}

/** Match a wine name to a region */
export function matchRegion(wineName = "", producerName = "") {
  const lower = `${wineName} ${producerName}`.toLowerCase();

  if (lower.includes("barolo") || lower.includes("barbaresco") || lower.includes("conterno")
    || lower.includes("giacosa") || lower.includes("vietti") || lower.includes("sandrone")
    || lower.includes("gaja") || lower.includes("mascarello")) {
    return getRegion("piemonte");
  }
  if (lower.includes("brunello") || lower.includes("sassicaia") || lower.includes("ornellaia")
    || lower.includes("tignanello") || lower.includes("masseto") || lower.includes("bolgheri")
    || lower.includes("chianti") || lower.includes("antinori") || lower.includes("toscana")
    || lower.includes("biondi-santi")) {
    return getRegion("toscana");
  }
  if (lower.includes("amarone") || lower.includes("valpolicella") || lower.includes("quintarelli")
    || lower.includes("dal forno")) {
    return getRegion("valpolicella");
  }
  if (lower.includes("champagne") || lower.includes("dom perignon") || lower.includes("krug")
    || lower.includes("cristal") || lower.includes("bollinger") || lower.includes("salon")) {
    return getRegion("champagne");
  }
  if (lower.includes("burgundy") || lower.includes("bourgogne") || lower.includes("romanée")
    || lower.includes("chambertin") || lower.includes("musigny") || lower.includes("vosne")
    || lower.includes("gevrey") || lower.includes("leroy") || lower.includes("rousseau")
    || lower.includes("roumier") || lower.includes("meursault") || lower.includes("montrachet")) {
    return getRegion("burgundy");
  }
  if (lower.includes("bordeaux") || lower.includes("pauillac") || lower.includes("margaux")
    || lower.includes("saint-julien") || lower.includes("médoc") || lower.includes("petrus")
    || lower.includes("haut-brion") || lower.includes("lafite") || lower.includes("mouton")
    || lower.includes("latour") || lower.includes("le pin") || lower.includes("cheval blanc")) {
    return getRegion("bordeaux");
  }
  if (lower.includes("rhone") || lower.includes("rhône") || lower.includes("hermitage")
    || lower.includes("chateauneuf") || lower.includes("cote rotie") || lower.includes("chave")
    || lower.includes("chapoutier") || lower.includes("guigal")) {
    return getRegion("rhone");
  }
  if (lower.includes("mosel") || lower.includes("egon müller") || lower.includes("egon muller")
    || lower.includes("scharzhofberger") || lower.includes("jj prum") || lower.includes("loosen")
    || lower.includes("dönnhoff") || lower.includes("keller riesling")) {
    return getRegion("mosel");
  }
  if (lower.includes("alsace") || lower.includes("alsazia") || lower.includes("weinbach")
    || lower.includes("zind") || lower.includes("trimbach")) {
    return getRegion("alsace");
  }
  if (lower.includes("napa") || lower.includes("screaming eagle") || lower.includes("harlan")
    || lower.includes("opus one") || lower.includes("caymus") || lower.includes("shafer")
    || lower.includes("california") || lower.includes("dominus")) {
    return getRegion("napa_valley");
  }
  if (lower.includes("penfolds") || lower.includes("grange") || lower.includes("henschke")
    || lower.includes("australia") || lower.includes("barossa")) {
    return getRegion("australia");
  }
  if (lower.includes("port") || lower.includes("porto") || lower.includes("quinta")
    || lower.includes("taylor") || lower.includes("graham") || lower.includes("niepoort")
    || lower.includes("fonseca") || lower.includes("douro")) {
    return getRegion("douro");
  }
  if (lower.includes("rioja") || lower.includes("ribera") || lower.includes("vega sicilia")
    || lower.includes("pingus") || lower.includes("palacios") || lower.includes("tempranillo")) {
    return getRegion("ribera_del_duero");
  }
  if (lower.includes("mendoza") || lower.includes("malbec") || lower.includes("catena")
    || lower.includes("argentina") || lower.includes("achaval")) {
    return getRegion("mendoza");
  }
  if (lower.includes("oregon") || lower.includes("willamette") || lower.includes("drouhin")) {
    return getRegion("oregon");
  }

  // Default to Bordeaux as the reference region
  return getRegion("bordeaux");
}

export default WINE_REGIONS;
