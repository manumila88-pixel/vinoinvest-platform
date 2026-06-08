/**
 * Curated list of real, well-known wine awards for famous producers.
 * Used to display award badges in the WineBottle3DModal.
 *
 * Fields:
 *   producer       — producer name (used for matching)
 *   wine_keywords  — array of keywords that appear in the wine name (used for matching)
 *   award          — short award label
 *   year           — award year (number)
 *   emoji          — decorative emoji for the badge
 */
export const AWARDS = [
  // ── Gambero Rosso Tre Bicchieri ────────────────────────────────────────
  {
    producer: "Antinori",
    wine_keywords: ["sassicaia", "solaia", "tignanello"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Antinori",
    wine_keywords: ["tignanello"],
    award: "Tre Bicchieri",
    year: 2023,
    emoji: "🏆",
  },
  {
    producer: "Antinori",
    wine_keywords: ["solaia"],
    award: "Tre Bicchieri",
    year: 2022,
    emoji: "🏆",
  },
  {
    producer: "Sassicaia",
    wine_keywords: ["sassicaia"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Sassicaia",
    wine_keywords: ["sassicaia"],
    award: "Tre Bicchieri",
    year: 2023,
    emoji: "🏆",
  },
  {
    producer: "Gaja",
    wine_keywords: ["barbaresco", "sori tildin", "costa russi", "sori san lorenzo"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Gaja",
    wine_keywords: ["barbaresco", "barolo"],
    award: "Tre Bicchieri",
    year: 2023,
    emoji: "🏆",
  },
  {
    producer: "Gaja",
    wine_keywords: ["barbaresco"],
    award: "Tre Bicchieri",
    year: 2022,
    emoji: "🏆",
  },
  {
    producer: "Barolo",
    wine_keywords: ["brunate", "cannubi", "cerequio"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Giacomo Conterno",
    wine_keywords: ["barolo", "monfortino", "cascina francia"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Giacomo Conterno",
    wine_keywords: ["barolo", "monfortino"],
    award: "Tre Bicchieri",
    year: 2023,
    emoji: "🏆",
  },
  {
    producer: "Bruno Giacosa",
    wine_keywords: ["barolo", "barbaresco", "falletto", "rocche"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Bruno Giacosa",
    wine_keywords: ["barolo", "barbaresco"],
    award: "Tre Bicchieri",
    year: 2022,
    emoji: "🏆",
  },
  {
    producer: "Ornellaia",
    wine_keywords: ["ornellaia", "masseto"],
    award: "Tre Bicchieri",
    year: 2024,
    emoji: "🏆",
  },
  {
    producer: "Ornellaia",
    wine_keywords: ["ornellaia"],
    award: "Tre Bicchieri",
    year: 2023,
    emoji: "🏆",
  },
  // ── Decanter World Wine Awards Platinum ───────────────────────────────
  {
    producer: "Pétrus",
    wine_keywords: ["petrus", "pétrus"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Château Lafite Rothschild",
    wine_keywords: ["lafite", "lafite rothschild"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Château Mouton Rothschild",
    wine_keywords: ["mouton", "mouton rothschild"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Château Margaux",
    wine_keywords: ["margaux"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Château Latour",
    wine_keywords: ["latour"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Opus One",
    wine_keywords: ["opus one", "opus"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Sassicaia",
    wine_keywords: ["sassicaia"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Screaming Eagle",
    wine_keywords: ["screaming eagle"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  {
    producer: "Harlan Estate",
    wine_keywords: ["harlan"],
    award: "Decanter Platinum",
    year: 2024,
    emoji: "🥇",
  },
  // ── Wine Spectator Top 100 ─────────────────────────────────────────────
  {
    producer: "Opus One",
    wine_keywords: ["opus one", "opus"],
    award: "Wine Spectator Top 100",
    year: 2024,
    emoji: "🍷",
  },
  {
    producer: "Ornellaia",
    wine_keywords: ["ornellaia"],
    award: "Wine Spectator Top 100",
    year: 2024,
    emoji: "🍷",
  },
  {
    producer: "Sassicaia",
    wine_keywords: ["sassicaia"],
    award: "Wine Spectator Top 100",
    year: 2023,
    emoji: "🍷",
  },
  {
    producer: "Giacomo Conterno",
    wine_keywords: ["barolo", "monfortino"],
    award: "Wine Spectator Top 100",
    year: 2023,
    emoji: "🍷",
  },
  {
    producer: "Château Mouton Rothschild",
    wine_keywords: ["mouton", "mouton rothschild"],
    award: "Wine Spectator Top 100",
    year: 2023,
    emoji: "🍷",
  },
  {
    producer: "Penfolds",
    wine_keywords: ["grange"],
    award: "Wine Spectator Top 100",
    year: 2024,
    emoji: "🍷",
  },
  {
    producer: "Domaine de la Romanée-Conti",
    wine_keywords: ["romanee-conti", "romanée-conti", "drc", "romanee conti"],
    award: "Wine Spectator Top 100",
    year: 2024,
    emoji: "🍷",
  },
  // ── James Suckling 100 points ──────────────────────────────────────────
  {
    producer: "Pétrus",
    wine_keywords: ["petrus", "pétrus"],
    award: "JS 100 pts",
    year: 2022,
    emoji: "💯",
  },
  {
    producer: "Pétrus",
    wine_keywords: ["petrus", "pétrus"],
    award: "JS 100 pts",
    year: 2021,
    emoji: "💯",
  },
  {
    producer: "Château Margaux",
    wine_keywords: ["margaux"],
    award: "JS 100 pts",
    year: 2022,
    emoji: "💯",
  },
  {
    producer: "Château Lafite Rothschild",
    wine_keywords: ["lafite", "lafite rothschild"],
    award: "JS 100 pts",
    year: 2022,
    emoji: "💯",
  },
  {
    producer: "Sassicaia",
    wine_keywords: ["sassicaia"],
    award: "JS 100 pts",
    year: 2021,
    emoji: "💯",
  },
  {
    producer: "Ornellaia",
    wine_keywords: ["ornellaia"],
    award: "JS 100 pts",
    year: 2021,
    emoji: "💯",
  },
  {
    producer: "Screaming Eagle",
    wine_keywords: ["screaming eagle"],
    award: "JS 100 pts",
    year: 2022,
    emoji: "💯",
  },
  {
    producer: "Harlan Estate",
    wine_keywords: ["harlan"],
    award: "JS 100 pts",
    year: 2021,
    emoji: "💯",
  },
  {
    producer: "Opus One",
    wine_keywords: ["opus one", "opus"],
    award: "JS 100 pts",
    year: 2022,
    emoji: "💯",
  },
  // ── Robert Parker 100 points ──────────────────────────────────────────
  {
    producer: "Pétrus",
    wine_keywords: ["petrus", "pétrus"],
    award: "RP 100 pts",
    year: 2021,
    emoji: "⭐",
  },
  {
    producer: "Château Mouton Rothschild",
    wine_keywords: ["mouton", "mouton rothschild"],
    award: "RP 100 pts",
    year: 2000,
    emoji: "⭐",
  },
  {
    producer: "Château Margaux",
    wine_keywords: ["margaux"],
    award: "RP 100 pts",
    year: 2015,
    emoji: "⭐",
  },
  {
    producer: "Screaming Eagle",
    wine_keywords: ["screaming eagle"],
    award: "RP 100 pts",
    year: 2019,
    emoji: "⭐",
  },
  {
    producer: "Harlan Estate",
    wine_keywords: ["harlan"],
    award: "RP 100 pts",
    year: 2013,
    emoji: "⭐",
  },
  {
    producer: "Domaine de la Romanée-Conti",
    wine_keywords: ["romanee-conti", "romanée-conti", "drc", "romanee conti"],
    award: "RP 100 pts",
    year: 2019,
    emoji: "⭐",
  },
  {
    producer: "Giacomo Conterno",
    wine_keywords: ["barolo", "monfortino"],
    award: "RP 100 pts",
    year: 2016,
    emoji: "⭐",
  },
  {
    producer: "Gaja",
    wine_keywords: ["barbaresco", "sori tildin"],
    award: "RP 100 pts",
    year: 2016,
    emoji: "⭐",
  },
];

/**
 * Returns awards that match a given wine name and producer.
 * Matching is case-insensitive partial string matching.
 *
 * @param {string} wineName     — wine.name from the DB
 * @param {string} producerName — wine.producer from the DB
 * @returns {Array}             — array of matching award objects (deduplicated by award+year)
 */
export function getWineAwards(wineName = "", producerName = "") {
  const nameLower = wineName.toLowerCase();
  const producerLower = producerName.toLowerCase();

  const matches = AWARDS.filter((entry) => {
    const entryProducerLower = entry.producer.toLowerCase();

    // Producer match: entry producer is contained in wine producer, or vice-versa
    const producerMatch =
      producerLower.includes(entryProducerLower) ||
      entryProducerLower.includes(producerLower);

    // Keyword match: at least one keyword appears in the wine name
    const keywordMatch = entry.wine_keywords.some((kw) =>
      nameLower.includes(kw.toLowerCase())
    );

    return producerMatch && keywordMatch;
  });

  // Deduplicate by award + year combo (same award from different keyword paths)
  const seen = new Set();
  return matches.filter((entry) => {
    const key = `${entry.award}|${entry.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
