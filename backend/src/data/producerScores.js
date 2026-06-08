// Producer reputation scores (0-100) based on auction history, critic consensus, market position
// Sources: Wine Spectator rankings, Liv-ex annual reports, Robert Parker database
export const PRODUCER_SCORES = {
  // Bordeaux — First Growths
  "Petrus": 98, "Pétrus": 98,
  "Chateau Petrus": 98, "Château Pétrus": 98,
  "Romanee-Conti": 100, "Romanée-Conti": 100,
  "DRC": 100, "Domaine de la Romanee-Conti": 100,
  "Chateau Margaux": 95, "Château Margaux": 95,
  "Chateau Latour": 96, "Château Latour": 96,
  "Chateau Lafite": 95, "Château Lafite": 95,
  "Chateau Lafite Rothschild": 95, "Château Lafite Rothschild": 95,
  "Mouton Rothschild": 94, "Château Mouton Rothschild": 94,
  "Chateau Haut-Brion": 95, "Château Haut-Brion": 95,
  "Haut-Brion": 95,

  // Bordeaux — Second Growths
  "Chateau Leoville Las Cases": 93, "Château Léoville Las Cases": 93,
  "Chateau Palmer": 92, "Château Palmer": 92,
  "Chateau Pichon Baron": 90, "Château Pichon Baron": 90,
  "Chateau Ducru-Beaucaillou": 91, "Château Ducru-Beaucaillou": 91,
  "Chateau Cos d'Estournel": 92, "Château Cos d'Estournel": 92,
  "Chateau Leoville Barton": 90, "Château Léoville Barton": 90,
  "Chateau Pichon Longueville Comtesse": 91,
  "Chateau Lynch-Bages": 90, "Château Lynch-Bages": 90,
  "Cheval Blanc": 97, "Château Cheval Blanc": 97,
  "Ausone": 96, "Château Ausone": 96,
  "Le Pin": 97,
  "Lafleur": 96, "Château Lafleur": 96,
  "Vieux Chateau Certan": 92,
  "Conseillante": 90, "Château La Conseillante": 90,
  "L'Evangile": 89, "Château L'Évangile": 89,

  // Burgundy — Domaines
  "Leroy": 97, "Domaine Leroy": 97,
  "Rousseau": 96, "Domaine Rousseau": 96, "Armand Rousseau": 96,
  "Roumier": 97, "Domaine Roumier": 97, "Georges Roumier": 97,
  "Mugnier": 95, "Domaine Mugnier": 95, "J.F. Mugnier": 95,
  "Coche-Dury": 96, "Domaine Coche-Dury": 96,
  "Leflaive": 94, "Domaine Leflaive": 94,
  "Ramonet": 93, "Domaine Ramonet": 93,
  "Bonneau du Martray": 93,
  "Dujac": 92, "Domaine Dujac": 92,
  "Ponsot": 91, "Domaine Ponsot": 91,
  "Comte Vogue": 95, "Domaine Comte de Vogüé": 95,
  "Trapet": 88, "Domaine Trapet": 88,
  "Yvon Metras": 87, "Domaine Yvon Métras": 87,

  // Champagne — Prestige
  "Dom Perignon": 92, "Dom Pérignon": 92,
  "Krug": 93,
  "Salon": 95,
  "Cristal": 91, "Louis Roederer": 88,
  "Bollinger": 88,
  "Pol Roger": 87,
  "Taittinger": 83,
  "Moet Chandon": 79, "Moët & Chandon": 79,
  "Veuve Clicquot": 82,
  "Jacques Selosse": 94,

  // Italy — Super Tuscans + DOCG
  "Sassicaia": 91, "Tenuta San Guido": 91,
  "Masseto": 93,
  "Ornellaia": 91,
  "Tignanello": 88, "Antinori": 83,
  "Gaja": 90,
  "Giacomo Conterno": 95,
  "Bruno Giacosa": 93,
  "Bartolo Mascarello": 94,
  "Giuseppe Rinaldi": 92,
  "Aldo Conterno": 91,
  "Barolo Chinato": 76,
  "Biondi Santi": 92,
  "Soldera": 95,
  "Il Poggione": 84,
  "Livio Sassetti": 83,
  "Banfi": 74,
  "Frescobaldi": 77,
  "Masi": 72,
  "Zonin": 45,
  "Riunite": 38,

  // Rhône Valley
  "Guigal": 88, "E. Guigal": 88,
  "Chapoutier": 85,
  "Jaboulet": 82,
  "Chave": 94, "Jean-Louis Chave": 94,
  "Pegau": 90, "Domaine du Pégau": 90,
  "Rayas": 96, "Chateau Rayas": 96,
  "Bonneau": 95, "Henri Bonneau": 95,
  "Vieux Telegraphe": 91, "Vieux Télégraphe": 91,
  "Beaucastel": 90, "Château Beaucastel": 90,

  // Napa Valley
  "Screaming Eagle": 99,
  "Harlan Estate": 97,
  "Opus One": 90,
  "Caymus": 84,
  "Ridge": 88, "Ridge Vineyards": 88,
  "Heitz": 85,
  "Stag's Leap": 86,
  "Silver Oak": 80,
  "Beringer": 75,
  "Robert Mondavi": 78,

  // Australia
  "Penfolds": 88,
  "Henschke": 89,
  "Torbreck": 83,
  "Two Hands": 79,
  "Mollydooker": 76,

  // Spain
  "Vega Sicilia": 94, "Vega-Sicilia": 94,
  "Pingus": 97,
  "Alvaro Palacios": 92,
  "Protos": 74,
  "Torres": 72,

  // Defaults by tier
  "default_premier_cru": 88,
  "default_grand_cru": 92,
  "default_premium": 75,
  "default_standard": 55,
  "default_basic": 40,
};

// Lookup with fuzzy matching
export function getProducerScore(producerName) {
  if (!producerName) return PRODUCER_SCORES.default_standard;
  const clean = producerName.trim();
  // Exact match
  if (PRODUCER_SCORES[clean] !== undefined) return PRODUCER_SCORES[clean];
  // Case-insensitive match
  const lower = clean.toLowerCase();
  for (const [key, score] of Object.entries(PRODUCER_SCORES)) {
    if (key.toLowerCase() === lower) return score;
  }
  // Partial match (producer name contains a key)
  for (const [key, score] of Object.entries(PRODUCER_SCORES)) {
    if (key.startsWith("default_")) continue;
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return score;
  }
  return PRODUCER_SCORES.default_standard;
}

// Deterministic noise per wine id (0-1, no randomness per call)
export function seededNoise(id, salt = 0) {
  let h = salt;
  const str = String(id);
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return ((h >>> 0) / 0xffffffff);
}
