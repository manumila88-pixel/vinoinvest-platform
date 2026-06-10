/**
 * Vintage quality scores by region and year.
 * Scale: 0-100 (based on consensus from Wine Advocate, Wine Spectator, Decanter, Vinous)
 * Used for: WineBottle3DModal vintage badge, AI Score calculation, investment guidance.
 *
 * Legend:
 *   95-100: Exceptional / Legendary — buy and hold 10+ years
 *   90-94:  Excellent — strong investment potential
 *   85-89:  Very Good — solid buy
 *   80-84:  Good — selective buying
 *   75-79:  Average — avoid for investment
 *   <75:    Poor/Off — do not buy for investment
 */

export const VINTAGE_SCORES = {

  // ── BORDEAUX (Médoc & Pomerol) ──────────────────────────────────────────────
  bordeaux: {
    2024: 88, 2023: 91, 2022: 97, 2021: 88, 2020: 94,
    2019: 99, 2018: 97, 2017: 84, 2016: 98, 2015: 97,
    2014: 87, 2013: 79, 2012: 83, 2011: 85, 2010: 99,
    2009: 98, 2008: 86, 2007: 80, 2006: 87, 2005: 99,
    2004: 84, 2003: 89, 2002: 83, 2001: 86, 2000: 100,
    1999: 82, 1998: 89, 1997: 80, 1996: 93, 1995: 93,
    1990: 100, 1989: 98, 1988: 91, 1986: 93, 1985: 90,
    1983: 89, 1982: 100, 1978: 89, 1970: 93, 1966: 91,
    1961: 100, 1959: 99, 1953: 97, 1945: 100,
  },

  // ── SAINT-ÉMILION & POMEROL ─────────────────────────────────────────────────
  saint_emilion: {
    2022: 96, 2021: 90, 2020: 95, 2019: 98, 2018: 96,
    2016: 96, 2015: 96, 2012: 91, 2010: 97, 2009: 99,
    2008: 89, 2005: 97, 2001: 91, 2000: 99, 1998: 95,
    1995: 92, 1990: 99, 1989: 96, 1982: 98,
  },

  // ── BORGOGNA ROSSO (Pinot Noir — Côte de Nuits) ────────────────────────────
  burgundy_red: {
    2024: 87, 2023: 90, 2022: 97, 2021: 94, 2020: 96,
    2019: 97, 2018: 90, 2017: 88, 2016: 90, 2015: 95,
    2014: 92, 2013: 86, 2012: 93, 2011: 85, 2010: 95,
    2009: 93, 2008: 89, 2007: 86, 2006: 86, 2005: 98,
    2004: 84, 2003: 87, 2002: 96, 2001: 84, 2000: 86,
    1999: 96, 1996: 99, 1995: 92, 1993: 93, 1990: 99,
    1989: 88, 1988: 93, 1985: 97, 1980: 82, 1978: 96,
  },

  // ── BORGOGNA BIANCO (Chardonnay — Côte de Beaune) ─────────────────────────
  burgundy_white: {
    2024: 88, 2023: 90, 2022: 95, 2021: 96, 2020: 97,
    2019: 96, 2018: 88, 2017: 93, 2016: 89, 2015: 90,
    2014: 96, 2013: 85, 2012: 93, 2011: 88, 2010: 96,
    2009: 92, 2008: 91, 2007: 89, 2006: 86, 2005: 96,
    2004: 87, 2002: 95, 1996: 97, 1995: 96, 1992: 94,
    1990: 97, 1989: 90, 1986: 92, 1985: 93,
  },

  // ── BAROLO & BARBARESCO (Nebbiolo — Piemonte) ──────────────────────────────
  barolo: {
    2023: 89, 2022: 90, 2021: 97, 2020: 89, 2019: 94,
    2018: 88, 2017: 87, 2016: 98, 2015: 91, 2014: 85,
    2013: 97, 2012: 92, 2011: 90, 2010: 98, 2009: 86,
    2008: 91, 2007: 90, 2006: 92, 2005: 88, 2004: 94,
    2003: 85, 2001: 99, 2000: 89, 1999: 96, 1998: 89,
    1997: 94, 1996: 97, 1995: 85, 1990: 99, 1989: 97,
    1988: 92, 1985: 97, 1982: 95, 1978: 98, 1971: 98,
  },

  // ── BRUNELLO DI MONTALCINO (Sangiovese Grosso) ─────────────────────────────
  brunello: {
    2021: 95, 2020: 90, 2019: 95, 2018: 92, 2017: 82,
    2016: 98, 2015: 96, 2014: 82, 2013: 96, 2012: 90,
    2011: 88, 2010: 99, 2009: 87, 2008: 89, 2007: 98,
    2006: 97, 2004: 99, 2001: 98, 1999: 97, 1997: 96,
    1995: 91, 1990: 99, 1988: 98, 1985: 97,
  },

  // ── CHIANTI CLASSICO & SUPER TUSCANS ───────────────────────────────────────
  tuscany: {
    2021: 94, 2020: 92, 2019: 96, 2018: 93, 2017: 84,
    2016: 97, 2015: 96, 2014: 82, 2013: 95, 2012: 88,
    2011: 88, 2010: 98, 2009: 88, 2008: 90, 2007: 95,
    2006: 95, 2004: 97, 2001: 97, 1999: 96, 1997: 98,
    1995: 90, 1990: 99, 1988: 97, 1985: 95,
  },

  // ── CHAMPAGNE (Vintage) ────────────────────────────────────────────────────
  champagne: {
    2020: 93, 2019: 90, 2018: 92, 2017: 86, 2016: 94,
    2015: 93, 2014: 89, 2013: 85, 2012: 96, 2008: 99,
    2007: 88, 2006: 88, 2004: 91, 2002: 99, 2000: 89,
    1999: 86, 1998: 88, 1996: 99, 1995: 93, 1990: 99,
    1989: 95, 1988: 96, 1985: 93, 1982: 99, 1979: 95,
    1976: 90, 1975: 86, 1971: 95, 1966: 97, 1964: 99,
    1961: 99, 1959: 99, 1955: 97, 1952: 97, 1947: 99,
  },

  // ── RHÔNE VALLEY (Syrah / GSM) ─────────────────────────────────────────────
  rhone: {
    2022: 93, 2021: 86, 2020: 88, 2019: 94, 2018: 91,
    2017: 90, 2016: 94, 2015: 96, 2014: 86, 2013: 87,
    2012: 93, 2011: 87, 2010: 98, 2009: 99, 2008: 88,
    2007: 94, 2006: 90, 2005: 97, 2001: 95, 2000: 90,
    1999: 95, 1998: 98, 1995: 93, 1990: 100, 1989: 99,
    1988: 98, 1985: 97, 1983: 94, 1978: 99,
  },

  // ── NAPA VALLEY (Cabernet Sauvignon) ───────────────────────────────────────
  napa: {
    2022: 90, 2021: 96, 2020: 89, 2019: 97, 2018: 95,
    2017: 84, 2016: 98, 2015: 96, 2014: 97, 2013: 97,
    2012: 95, 2011: 89, 2010: 94, 2009: 94, 2008: 91,
    2007: 95, 2006: 91, 2005: 97, 2004: 97, 2003: 90,
    2002: 91, 2001: 93, 1999: 91, 1997: 98, 1996: 92,
    1995: 96, 1994: 97, 1993: 89, 1992: 89, 1991: 98,
    1990: 94, 1987: 97, 1986: 90, 1985: 93, 1984: 86,
    1978: 97, 1974: 97, 1973: 90, 1970: 96,
  },

  // ── ALSACE (Riesling) ──────────────────────────────────────────────────────
  alsace: {
    2021: 91, 2020: 94, 2019: 93, 2018: 95, 2017: 93,
    2016: 88, 2015: 93, 2014: 88, 2013: 88, 2012: 89,
    2011: 91, 2010: 94, 2009: 96, 2008: 90, 2007: 91,
    2006: 87, 2005: 96, 2002: 96, 2001: 90, 2000: 85,
    1999: 90, 1998: 89, 1997: 93, 1996: 93, 1995: 95,
    1990: 98, 1989: 98, 1988: 96, 1985: 94, 1983: 99,
  },

  // ── MOSELLA (Riesling — Germany) ───────────────────────────────────────────
  mosel: {
    2021: 90, 2020: 90, 2019: 97, 2018: 94, 2017: 92,
    2016: 90, 2015: 94, 2014: 89, 2013: 88, 2012: 90,
    2011: 91, 2010: 93, 2009: 99, 2008: 89, 2007: 93,
    2006: 85, 2005: 96, 2004: 87, 2003: 92, 2002: 89,
    2001: 93, 1999: 87, 1997: 97, 1994: 93, 1990: 97,
    1989: 92, 1988: 93, 1985: 89, 1983: 99, 1976: 97,
    1971: 99, 1969: 90, 1967: 99, 1964: 93, 1959: 100,
  },

  // ── AUSTRALIA (Barossa / Penfolds Grange) ──────────────────────────────────
  australia: {
    2021: 92, 2020: 88, 2019: 94, 2018: 93, 2017: 90,
    2016: 94, 2015: 91, 2014: 91, 2013: 93, 2012: 89,
    2010: 97, 2008: 90, 2006: 94, 2004: 96, 2002: 96,
    2001: 91, 1998: 96, 1996: 93, 1994: 96, 1991: 96,
    1990: 98, 1988: 93, 1986: 99, 1980: 95, 1976: 95,
  },

  // ── PORTO (Vintage Port) ───────────────────────────────────────────────────
  port: {
    2021: 91, 2020: 90, 2017: 97, 2016: 95, 2011: 99,
    2009: 93, 2007: 97, 2003: 96, 2000: 99, 1997: 98,
    1994: 98, 1992: 96, 1991: 97, 1987: 96, 1985: 95,
    1983: 97, 1977: 99, 1975: 89, 1970: 99, 1966: 97,
    1963: 100, 1960: 90, 1955: 97, 1948: 99, 1945: 100,
    1935: 99, 1927: 100,
  },

  // ── SAUTERNES ─────────────────────────────────────────────────────────────
  sauternes: {
    2022: 90, 2021: 86, 2020: 94, 2019: 92, 2018: 88,
    2017: 97, 2016: 92, 2015: 93, 2014: 93, 2013: 90,
    2011: 93, 2010: 97, 2009: 99, 2007: 99, 2005: 96,
    2003: 94, 2001: 99, 1999: 94, 1997: 97, 1996: 89,
    1995: 96, 1990: 99, 1989: 99, 1988: 99, 1986: 95,
    1983: 97, 1982: 87, 1976: 93, 1975: 96, 1971: 97,
    1967: 100, 1962: 96, 1959: 100, 1955: 94, 1945: 100,
  },

  // ── SPAIN (Ribera del Duero / Priorat) ─────────────────────────────────────
  spain: {
    2022: 93, 2021: 90, 2020: 95, 2019: 92, 2018: 93,
    2017: 86, 2016: 97, 2015: 95, 2014: 87, 2013: 88,
    2012: 89, 2011: 92, 2010: 93, 2009: 91, 2007: 93,
    2005: 96, 2004: 93, 2001: 92, 1999: 98, 1998: 95,
    1996: 91, 1994: 98, 1991: 96, 1989: 92, 1986: 91,
  },

  // ── ARGENTINA (Mendoza — Malbec) ───────────────────────────────────────────
  argentina: {
    2021: 91, 2020: 90, 2019: 92, 2018: 88, 2017: 91,
    2016: 90, 2015: 93, 2014: 90, 2013: 94, 2012: 92,
    2010: 95, 2009: 93, 2007: 92, 2006: 91,
  },

};

/**
 * Get vintage score for a given wine name and year.
 * Falls back to generic score if region not matched.
 */
export function getVintageScore(wineName = "", year = null) {
  if (!year) return null;
  const y = parseInt(year, 10);
  if (isNaN(y)) return null;

  const lower = wineName.toLowerCase();

  // Region matching — most specific first
  if (lower.includes("barolo") || lower.includes("barbaresco") || lower.includes("langhe")) {
    return VINTAGE_SCORES.barolo[y] ?? null;
  }
  if (lower.includes("brunello") || lower.includes("montalcino")) {
    return VINTAGE_SCORES.brunello[y] ?? null;
  }
  if (lower.includes("sassicaia") || lower.includes("ornellaia") || lower.includes("tignanello")
    || lower.includes("bolgheri") || lower.includes("chianti") || lower.includes("toscana")
    || lower.includes("supertuscan") || lower.includes("super tuscan")) {
    return VINTAGE_SCORES.tuscany[y] ?? null;
  }
  if (lower.includes("amarone") || lower.includes("valpolicella")) {
    return VINTAGE_SCORES.tuscany[y] ?? null; // use tuscany as proxy
  }
  if (lower.includes("sauternes") || lower.includes("yquem") || lower.includes("barsac")) {
    return VINTAGE_SCORES.sauternes[y] ?? null;
  }
  if (lower.includes("champagne") || lower.includes("dom perignon") || lower.includes("krug")
    || lower.includes("cristal") || lower.includes("bollinger") || lower.includes("taittinger")) {
    return VINTAGE_SCORES.champagne[y] ?? null;
  }
  if (lower.includes("burgundy") || lower.includes("bourgogne") || lower.includes("borgogna")
    || lower.includes("romanée") || lower.includes("romanee") || lower.includes("chambertin")
    || lower.includes("musigny") || lower.includes("vosne") || lower.includes("nuits")
    || lower.includes("pommard") || lower.includes("volnay") || lower.includes("gevrey")
    || lower.includes("chablis") || lower.includes("meursault") || lower.includes("montrachet")
    || lower.includes("puligny") || lower.includes("chassagne")) {
    return (lower.includes("rouge") || lower.includes("pinot"))
      ? VINTAGE_SCORES.burgundy_red[y] ?? null
      : VINTAGE_SCORES.burgundy_white[y] ?? VINTAGE_SCORES.burgundy_red[y] ?? null;
  }
  if (lower.includes("bordeaux") || lower.includes("pauillac") || lower.includes("margaux")
    || lower.includes("saint-julien") || lower.includes("saint julien") || lower.includes("médoc")
    || lower.includes("medoc") || lower.includes("haut-brion") || lower.includes("haut brion")
    || lower.includes("lafite") || lower.includes("mouton") || lower.includes("latour")
    || lower.includes("petrus") || lower.includes("pétrus") || lower.includes("le pin")) {
    if (lower.includes("saint-emilion") || lower.includes("saint emilion")
      || lower.includes("pomerol") || lower.includes("cheval blanc")) {
      return VINTAGE_SCORES.saint_emilion[y] ?? VINTAGE_SCORES.bordeaux[y] ?? null;
    }
    return VINTAGE_SCORES.bordeaux[y] ?? null;
  }
  if (lower.includes("rhone") || lower.includes("rhône") || lower.includes("hermitage")
    || lower.includes("chateauneuf") || lower.includes("châteauneuf") || lower.includes("gigondas")
    || lower.includes("cote rotie") || lower.includes("côte rôtie")) {
    return VINTAGE_SCORES.rhone[y] ?? null;
  }
  if (lower.includes("alsace") || lower.includes("alsazia") || lower.includes("weinbach")
    || lower.includes("zind") || lower.includes("trimbach") || lower.includes("hugel")) {
    return VINTAGE_SCORES.alsace[y] ?? null;
  }
  if (lower.includes("mosel") || lower.includes("mosella") || lower.includes("saar")
    || lower.includes("egon") || lower.includes("müller") || lower.includes("muller")
    || lower.includes("loosen") || lower.includes("prum") || lower.includes("prüm")
    || lower.includes("schaefer") || lower.includes("keller")) {
    return VINTAGE_SCORES.mosel[y] ?? null;
  }
  if (lower.includes("napa") || lower.includes("screaming eagle") || lower.includes("harlan")
    || lower.includes("opus one") || lower.includes("caymus") || lower.includes("stag")
    || lower.includes("ridge") || lower.includes("california") || lower.includes("sonoma")) {
    return VINTAGE_SCORES.napa[y] ?? null;
  }
  if (lower.includes("penfolds") || lower.includes("grange") || lower.includes("australia")
    || lower.includes("barossa") || lower.includes("hunter valley")) {
    return VINTAGE_SCORES.australia[y] ?? null;
  }
  if (lower.includes("port") || lower.includes("porto") || lower.includes("tawny")
    || lower.includes("quinta") || lower.includes("taylor") || lower.includes("graham")
    || lower.includes("fonseca") || lower.includes("niepoort")) {
    return VINTAGE_SCORES.port[y] ?? null;
  }
  if (lower.includes("rioja") || lower.includes("ribera") || lower.includes("priorat")
    || lower.includes("vega sicilia") || lower.includes("pingus") || lower.includes("alvaro palacios")) {
    return VINTAGE_SCORES.spain[y] ?? null;
  }
  if (lower.includes("malbec") || lower.includes("mendoza") || lower.includes("catena")
    || lower.includes("achaval") || lower.includes("zuccardi")) {
    return VINTAGE_SCORES.argentina[y] ?? null;
  }

  // Generic fallback — use Bordeaux as proxy (most well-documented)
  return VINTAGE_SCORES.bordeaux[y] ?? null;
}

/**
 * Get a label for a vintage score.
 */
export function getVintageLabel(score) {
  if (score === null || score === undefined) return null;
  if (score >= 95) return "Legendary";
  if (score >= 90) return "Excellent";
  if (score >= 85) return "Very Good";
  if (score >= 80) return "Good";
  if (score >= 75) return "Average";
  return "Below Average";
}

/**
 * Get investment recommendation based on vintage score.
 */
export function getVintageInvestmentNote(score) {
  if (score === null || score === undefined) return null;
  if (score >= 97) return "Exceptional vintage — top investment priority";
  if (score >= 93) return "Excellent vintage — strong buy for aged wines";
  if (score >= 88) return "Very good vintage — selective buying";
  if (score >= 83) return "Good vintage — hold existing positions";
  if (score >= 78) return "Average vintage — avoid for pure investment";
  return "Below average — do not buy for investment purposes";
}
