/**
 * Wine critics reference data.
 * Used by AI advisor to explain scoring systems and weigh critic consensus.
 */

export const CRITICS = [
  {
    id: "parker",
    name: "Robert Parker",
    publication: "Wine Advocate",
    website: "robertparker.com",
    scale: "50-100",
    influence: 99,
    activeYears: "1978-2019",
    specialty: ["Bordeaux", "Rhône", "Italy", "California"],
    style: "Hedonistic, power-forward, approachable tannins",
    notes: "Invented the 100-point scale. His retirement in 2019 fragmented the market. A 100/100 from Parker could double prices overnight.",
    currentStatus: "Retired. WA now has multiple critics: Neal Martin, William Kelley, Jeb Dunnuck.",
    marketImpact: "Still very high for historical scores. New RP/WA scores carry ~60% of pre-2019 impact.",
  },
  {
    id: "jancis",
    name: "Jancis Robinson",
    publication: "JancisRobinson.com",
    website: "jancisrobinson.com",
    scale: "12-20 (European style) or 88-97 equiv",
    influence: 90,
    activeYears: "1979-present",
    specialty: ["Burgundy", "Bordeaux", "Germany", "All Europe"],
    style: "Elegant, terroir-focused, intellectual, palate for restraint",
    notes: "Britain's most respected wine writer. MW credential. Highly trusted by European collectors and sommeliers.",
    currentStatus: "Active",
    marketImpact: "Strongest in UK, European and Asian sommelier community. Less impact on US auction prices.",
  },
  {
    id: "james_suckling",
    name: "James Suckling",
    publication: "JamesSuckling.com",
    website: "jamessuckling.com",
    scale: "85-100",
    influence: 82,
    activeYears: "1985-present",
    specialty: ["Bordeaux", "Italy", "Spain", "Napa", "Tuscany"],
    style: "Generous scores, accessible writing, digital-first approach",
    notes: "Formerly of Wine Spectator. Now independent. Known for high average scores. Strong social media presence with 1M+ followers.",
    currentStatus: "Active",
    marketImpact: "High in Italy (Tuscany especially), growing in Asia. Less respected by traditional auction houses.",
  },
  {
    id: "decanter",
    name: "Decanter",
    publication: "Decanter Magazine",
    website: "decanter.com",
    scale: "92-100 (Platinum), 90-91 (Gold), 87-89 (Silver)",
    influence: 88,
    activeYears: "1975-present",
    specialty: ["All regions", "UK wine trade focus"],
    style: "Panel-based, traditional British wine trade perspective",
    notes: "Decanter World Wine Awards (DWWA) is the world's largest wine competition. Decanter scores carry weight in UK, Australia, and emerging markets.",
    currentStatus: "Active",
    marketImpact: "Strong in UK. Decanter 97-100 Platinum can trigger price moves in mid-tier wines.",
  },
  {
    id: "wine_spectator",
    name: "Wine Spectator",
    publication: "Wine Spectator",
    website: "winespectator.com",
    scale: "50-100",
    influence: 83,
    activeYears: "1976-present",
    specialty: ["California", "Bordeaux", "Italy", "Spain"],
    style: "Traditional American palate, broad coverage",
    notes: "Annual 'Top 100 Wines' list is extremely influential. WS 100 of the Year = immediate sellout and price surge. Key critics: James Laube (CA), Bruce Sanderson (Burgundy).",
    currentStatus: "Active",
    marketImpact: "Very high in USA market. Moderate in Europe. Top 100 placement dramatically increases retail demand.",
  },
  {
    id: "vinous",
    name: "Antonio Galloni / Vinous",
    publication: "Vinous",
    website: "vinous.com",
    scale: "50-100",
    influence: 85,
    activeYears: "2013-present (Galloni: 2006)",
    specialty: ["Burgundy", "Italy", "Piedmont", "Champagne", "Loire"],
    style: "Nuanced, analytical, strong terroir focus, excellent Burgundy coverage",
    notes: "Galloni left Wine Advocate in 2013 to found Vinous. Now considered the #1 source for Burgundy and Italian wine ratings post-Parker.",
    currentStatus: "Active",
    marketImpact: "Very high for Burgundy (stronger than WA post-2019), Italy, and Champagne. Growing Bordeaux influence.",
  },
  {
    id: "burghound",
    name: "Allen Meadows",
    publication: "Burghound",
    website: "burghound.com",
    scale: "84-100",
    influence: 79,
    activeYears: "2000-present",
    specialty: ["Burgundy exclusively"],
    style: "Ultra-detailed, terroir-obsessed, traditional Burgundy palate",
    notes: "The single most trusted source specifically for Burgundy investors. If you're buying Burgundy for investment, Burghound scores matter more than any other critic for that region.",
    currentStatus: "Active",
    marketImpact: "Extremely high within the Burgundy collector market. Outside Burgundy: minimal.",
  },
  {
    id: "gambero_rosso",
    name: "Gambero Rosso",
    publication: "Gambero Rosso Guida Vini",
    website: "gamberorosso.it",
    scale: "Tre Bicchieri (top), Due Bicchieri, Un Bicchiere",
    influence: 75,
    activeYears: "1987-present",
    specialty: ["Italian wines exclusively"],
    style: "Italian palate, traditional vs modern, broad regional coverage",
    notes: "The most important Italian wine guide. Tre Bicchieri ('Three Glasses') is the top award. ~500 wines receive it each year. Essential for Italian wine market context.",
    currentStatus: "Active",
    marketImpact: "Important within Italy and for Italian wine importers. Limited direct impact on international auction prices.",
  },
  {
    id: "wineenthusiast",
    name: "Wine Enthusiast",
    publication: "Wine Enthusiast Magazine",
    website: "winemag.com",
    scale: "80-100",
    influence: 70,
    activeYears: "1988-present",
    specialty: ["All regions, USA focus"],
    style: "Consumer-friendly, accessible, broad market coverage",
    notes: "Top 100 Wines list annually significant. Known for Italian and Iberian coverage. Growing digital influence with 2M+ subscribers.",
    currentStatus: "Active",
    marketImpact: "Moderate. Drives consumer awareness more than auction prices.",
  },
  {
    id: "jeb_dunnuck",
    name: "Jeb Dunnuck",
    publication: "JebDunnuck.com / Wine Advocate",
    website: "jebdunnuck.com",
    scale: "85-100",
    influence: 78,
    activeYears: "2015-present",
    specialty: ["Rhône", "California", "Bordeaux", "Spain"],
    style: "Parker-esque power palate, generous, accessible",
    notes: "Parker's successor for Rhône and California coverage. Now partly at Wine Advocate. Very active on social media. High Rhône influence.",
    currentStatus: "Active",
    marketImpact: "High for Rhône. Growing for California cult wines.",
  },
];

// ── Scoring Equivalencies ────────────────────────────────────────────────────
export const SCORE_GUIDE = {
  "100": { label: "Legendary", investment: "Trofeo assoluto — prezzo da collezione", collectibility: 100 },
  "99": { label: "Extraordinary", investment: "Blue chip investment — altissima domanda", collectibility: 97 },
  "98": { label: "Outstanding+", investment: "Eccellente — apprezzamento garantito", collectibility: 94 },
  "97": { label: "Outstanding", investment: "Top investment grade", collectibility: 91 },
  "96": { label: "Superb", investment: "Very strong buy — grande potenziale", collectibility: 87 },
  "95": { label: "Excellent", investment: "Strong buy", collectibility: 83 },
  "94": { label: "Highly Recommended", investment: "Buy — buon rapporto qualità/prezzo", collectibility: 78 },
  "93": { label: "Recommended+", investment: "Buy — selezionare con cura", collectibility: 73 },
  "92": { label: "Recommended", investment: "Buy su produttori top, hold su altri", collectibility: 68 },
  "91": { label: "Very Good", investment: "Hold — mercato limitato", collectibility: 62 },
  "90": { label: "Good", investment: "Hold — solo se a prezzo giusto", collectibility: 55 },
  "89": { label: "Above Average", investment: "Avoid per investimento puro", collectibility: 45 },
  "88": { label: "Average", investment: "Non consigliato", collectibility: 35 },
};

// ── Critic Score to Investment Weight ─────────────────────────────────────────
export const CRITIC_WEIGHTS = {
  bordeaux: { parker: 0.28, vinous: 0.22, wine_spectator: 0.18, decanter: 0.15, jancis: 0.17 },
  burgundy: { vinous: 0.30, burghound: 0.28, jancis: 0.22, decanter: 0.12, parker: 0.08 },
  piemonte: { vinous: 0.30, gambero_rosso: 0.22, james_suckling: 0.18, decanter: 0.15, wine_enthusiast: 0.15 },
  toscana: { james_suckling: 0.28, vinous: 0.22, gambero_rosso: 0.20, decanter: 0.15, wine_spectator: 0.15 },
  champagne: { decanter: 0.28, vinous: 0.24, jancis: 0.22, wine_spectator: 0.15, parker: 0.11 },
  rhone: { jeb_dunnuck: 0.30, parker: 0.26, vinous: 0.20, decanter: 0.14, wine_spectator: 0.10 },
  california: { wine_spectator: 0.28, james_suckling: 0.22, jeb_dunnuck: 0.20, parker: 0.18, vinous: 0.12 },
  italy_other: { gambero_rosso: 0.28, james_suckling: 0.24, wine_enthusiast: 0.18, decanter: 0.18, vinous: 0.12 },
  spain: { decanter: 0.28, james_suckling: 0.24, wine_spectator: 0.20, jancis: 0.15, vinous: 0.13 },
  germany: { jancis: 0.30, decanter: 0.26, wine_spectator: 0.20, vinous: 0.14, parker: 0.10 },
};

/** Get the most relevant critics for a given region */
export function getCriticsForRegion(region = "bordeaux") {
  const weights = CRITIC_WEIGHTS[region] ?? CRITIC_WEIGHTS.bordeaux;
  return Object.entries(weights)
    .sort(([, a], [, b]) => b - a)
    .map(([id, weight]) => {
      const critic = CRITICS.find(c => c.id === id);
      return { ...critic, weightForRegion: weight };
    });
}

/** Convert a raw score to investment context */
export function interpretScore(score) {
  const key = String(Math.round(score));
  return SCORE_GUIDE[key] ?? SCORE_GUIDE["90"];
}

export default CRITICS;
