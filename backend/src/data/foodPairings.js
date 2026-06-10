// Food pairing data — extended map of wine categories to food suggestions
// Used by GET /api/pairing/:wineId

export const PAIRINGS = {
  bordeaux_red: {
    category: "Bordeaux Rosso",
    foods: [
      { name: "Agnello al forno", icon: "🍖", notes: "Abbinamento classico con Médoc e Saint-Julien" },
      { name: "Costata di manzo", icon: "🥩", notes: "La tannicità del Cabernet bilancia il grasso" },
      { name: "Selvaggina (cinghiale, cervo)", icon: "🦌", notes: "Ideale con Pomerol e Saint-Émilion" },
      { name: "Anatra all'arancia", icon: "🦆", notes: "Il frutto del Merlot completa le note agrumate" },
      { name: "Formaggi stagionati (Comté, Cheddar)", icon: "🧀", notes: "Formaggi duri a pasta semigrassa" },
      { name: "Funghi porcini in umido", icon: "🍄", notes: "Le note terrose del Cabernet esaltano i funghi" },
    ],
    avoid: ["Pesce delicato", "Asparagi", "Carciofi crudi"],
    servingTemp: "16–18°C",
    decantingTime: "45–90 min per vini giovani",
  },

  burgundy_red: {
    category: "Borgogna Rosso (Pinot Noir)",
    foods: [
      { name: "Faraona al tegame", icon: "🍗", notes: "La delicatezza del Pinot si abbina a carni bianche pregiate" },
      { name: "Salmone alla griglia", icon: "🐟", notes: "Pinot Noir leggero con salmone — abbinamento moderno" },
      { name: "Risotto ai funghi", icon: "🍚", notes: "Cremosità del risotto e seta del Pinot" },
      { name: "Piccione arrosto", icon: "🕊️", notes: "Selvaggina da penna ideale per Grand Cru" },
      { name: "Formaggi a crosta fiorita (Brie, Camembert)", icon: "🧀", notes: "Classico abbinamento francese" },
      { name: "Tartufo nero", icon: "🖤", notes: "Note umami con Gevrey-Chambertin e Vosne-Romanée" },
    ],
    avoid: ["Salse pesanti", "Curry", "Piatti molto piccanti"],
    servingTemp: "14–16°C",
    decantingTime: "20–30 min per Grand Cru maturi",
  },

  champagne: {
    category: "Champagne e Spumanti",
    foods: [
      { name: "Caviale beluga o osetra", icon: "🐟", notes: "Abbinamento di lusso per eccellenza" },
      { name: "Ostriche fresche", icon: "🦪", notes: "La salinità delle ostriche e l'acidità dello Champagne" },
      { name: "Salmone affumicato", icon: "🍣", notes: "Leggero affumicato con Blanc de Blancs" },
      { name: "Sushi e sashimi", icon: "🍱", notes: "Abbinamento moderno con Champagne dosage zero" },
      { name: "Frittura di paranza", icon: "🦐", notes: "Il perlage pulisce il grasso della frittura" },
      { name: "Risotto allo zafferano", icon: "🍚", notes: "Rosé Champagne con risotto Milanese" },
      { name: "Popcorn al tartufo", icon: "🍿", notes: "Snack di lusso perfetto per aperitivo" },
    ],
    avoid: ["Carni rosse pesanti", "Salse piccanti", "Curry"],
    servingTemp: "6–8°C",
    decantingTime: "Non necessario",
  },

  barolo_barbaresco: {
    category: "Barolo e Barbaresco (Nebbiolo)",
    foods: [
      { name: "Brasato al Barolo", icon: "🍖", notes: "L'abbinamento regionale per eccellenza" },
      { name: "Tartufo bianco d'Alba", icon: "⚪", notes: "Nebbiolo e tartufo bianco — coppia sacra" },
      { name: "Pasta al ragù di selvaggina", icon: "🍝", notes: "Pappardelle con cinghiale o lepre" },
      { name: "Costata di manzo fassona", icon: "🥩", notes: "La razza Piemontese con Barolo giovane" },
      { name: "Castelmagno e Gorgonzola", icon: "🧀", notes: "Formaggi piemontesi con tannini del Nebbiolo" },
      { name: "Risotto al Barolo", icon: "🍚", notes: "Risotto con midollo e vino rosso" },
    ],
    avoid: ["Pesce", "Piatti delicati", "Verdure crude"],
    servingTemp: "17–19°C",
    decantingTime: "60–120 min — indispensabile per vini giovani",
  },

  super_tuscan: {
    category: "Super Toscani",
    foods: [
      { name: "Bistecca alla Fiorentina", icon: "🥩", notes: "Abbinamento toscano per eccellenza" },
      { name: "Cinghiale in umido", icon: "🐗", notes: "Selvaggina con Sassicaia o Tignanello" },
      { name: "Pecorino di Pienza stagionato", icon: "🧀", notes: "Formaggi toscani con tannini del Sangiovese" },
      { name: "Tagliatelle al ragù di chianina", icon: "🍝", notes: "Pasta fresca con carne pregiata" },
      { name: "Agnello scottadito", icon: "🍖", notes: "Costolette d'agnello alla brace" },
      { name: "Porcini trifolati", icon: "🍄", notes: "Funghi con note speziate del Merlot" },
    ],
    avoid: ["Pesce crudo", "Piatti molto acidi", "Formaggi freschi delicati"],
    servingTemp: "17–18°C",
    decantingTime: "60 min per vini giovani (<10 anni)",
  },

  sauternes: {
    category: "Sauternes e Vini Dolci",
    foods: [
      { name: "Foie gras di anatra", icon: "🦆", notes: "Il classico abbinamento Sauternes-foie gras" },
      { name: "Roquefort e formaggi erborinati", icon: "🧀", notes: "Dolcezza vs salinità — contrasto perfetto" },
      { name: "Crème brûlée", icon: "🍮", notes: "Dessert al cucchiaio con Sauternes dolce" },
      { name: "Pasticceria alla mandorla", icon: "🥐", notes: "Crostate di frutta secca e miele" },
      { name: "Melone prosciutto", icon: "🍈", notes: "Antipasto fresco con Sauternes ghiacciato" },
      { name: "Gamberi al curry (Thai)", icon: "🍤", notes: "La dolcezza bilancia la piccantezza" },
    ],
    avoid: ["Piatti salati o amari", "Carni rosse"],
    servingTemp: "6–8°C",
    decantingTime: "Non necessario",
  },

  riesling: {
    category: "Riesling (Alsazia, Mosella, Renania)",
    foods: [
      { name: "Fegato d'oca (foie gras caldo)", icon: "🦆", notes: "Riesling Spätlese con foie gras" },
      { name: "Sushi e sashimi", icon: "🍣", notes: "Acidità e purezza del Riesling con pesce crudo" },
      { name: "Gamberi tigre alla griglia", icon: "🦐", notes: "Crostacei con Riesling secco" },
      { name: "Maiale ai frutti di bosco", icon: "🐷", notes: "Il Riesling Auslese esalta l'agrodolce" },
      { name: "Formaggi di capra (Chèvre)", icon: "🧀", notes: "Acidità del Riesling con latticini freschi" },
      { name: "Cucina tailandese e vietnamita", icon: "🍜", notes: "Spezie esotiche con Riesling off-dry" },
    ],
    avoid: ["Carni rosse pesanti", "Salse molto grasse"],
    servingTemp: "8–10°C",
    decantingTime: "Non necessario",
  },

  napa_cabernet: {
    category: "Napa Valley Cabernet Sauvignon",
    foods: [
      { name: "Prime Rib (ribeye) americano", icon: "🥩", notes: "Il grande classico Napa-steak house" },
      { name: "Spalla di agnello slow roast", icon: "🍖", notes: "Carni succulente con Cab Napa potente" },
      { name: "Cheddar invecchiato 24 mesi", icon: "🧀", notes: "Formaggi grassi e sapidi" },
      { name: "Hamburger gourmet wagyu", icon: "🍔", notes: "Abbinamento informale ma eccellente" },
      { name: "Costine di manzo al BBQ", icon: "🍖", notes: "Salsa barbecue complessa con Cab maturo" },
      { name: "Dark chocolate (85%)", icon: "🍫", notes: "Cioccolato fondente con Napa invecchiato" },
    ],
    avoid: ["Pesce delicato", "Verdure crude", "Piatti acidi"],
    servingTemp: "17–18°C",
    decantingTime: "60–90 min per vini giovani",
  },

  port: {
    category: "Porto e Vini Liquorosi",
    foods: [
      { name: "Stilton e formaggi erborinati", icon: "🧀", notes: "Abbinamento classico inglese" },
      { name: "Torta di noci e miele", icon: "🥜", notes: "Dessert secco con Tawny Port" },
      { name: "Cioccolato fondente 70%", icon: "🍫", notes: "Vintage Port con cioccolato amaro" },
      { name: "Crema catalana", icon: "🍮", notes: "Dessert al cucchiaio con LBV Port" },
      { name: "Fichi caramellati e mandorle", icon: "🌰", notes: "Frutta secca con Ruby Port giovane" },
      { name: "Prugne sciroppate al brandy", icon: "🍑", notes: "Accompagnamento insolito ma riuscito" },
    ],
    avoid: ["Piatti salati principali", "Pasta asciutta", "Carni rosse al sangue"],
    servingTemp: "16–18°C (Vintage), 12–14°C (Tawny)",
    decantingTime: "Vintage Port: 2–4h",
  },

  amarone: {
    category: "Amarone della Valpolicella",
    foods: [
      { name: "Brasato all'Amarone", icon: "🍖", notes: "L'abbinamento regionale più celebre" },
      { name: "Stinco di maiale al forno", icon: "🐷", notes: "Carni succulente e concentrate" },
      { name: "Gorgonzola piccante", icon: "🧀", notes: "Erborinato con vino appassito" },
      { name: "Pasta con ragù di cervo", icon: "🍝", notes: "Selvaggina con Amarone maturo" },
      { name: "Tartufo nero (Norcia)", icon: "🖤", notes: "Note umami con l'appassimento" },
      { name: "Cioccolato fondente e caffè", icon: "🍫", notes: "Chiusura pasto con Amarone dolce" },
    ],
    avoid: ["Piatti delicati", "Pesce", "Verdure crude"],
    servingTemp: "18–20°C",
    decantingTime: "90–120 min — indispensabile",
  },

  default: {
    category: "Vino Fine",
    foods: [
      { name: "Carni rosse alla griglia", icon: "🥩", notes: "Abbinamento universale per vini strutturati" },
      { name: "Formaggi stagionati", icon: "🧀", notes: "Sapidità che esalta l'acidità del vino" },
      { name: "Pasta con ragù ricco", icon: "🍝", notes: "Abbinamento tradizionale italiano" },
      { name: "Funghi trifolati", icon: "🍄", notes: "Note umami con vini di corpo" },
    ],
    avoid: ["Piatti molto acidi", "Aceto"],
    servingTemp: "15–18°C",
    decantingTime: "30–60 min consigliato",
  },
};

// Map wine name keywords → pairing category
export const WINE_TO_PAIRING = {
  bordeaux_red: [
    "cabernet sauvignon", "merlot", "bordeaux", "margaux", "pauillac",
    "saint-julien", "saint julien", "saint-emilion", "saint emilion",
    "pomerol", "pessac", "graves", "médoc", "medoc", "haut-medoc",
    "lafite", "mouton", "latour", "haut-brion", "petrus", "le pin",
    "lynch-bages", "cos d'estournel", "leoville", "cheval blanc",
  ],
  burgundy_red: [
    "pinot noir", "bourgogne", "burgundy", "gevrey", "chambertin",
    "vosne", "romanée", "romanee", "nuits-saint-georges", "pommard",
    "volnay", "musigny", "richebourg", "la tache", "clos de vougeot",
    "drc", "leroy", "rousseau", "roumier", "domaine",
  ],
  champagne: [
    "champagne", "spumante", "prosecco", "cava", "crémant", "cremant",
    "dom perignon", "krug", "cristal", "bollinger", "taittinger",
    "blanc de blancs", "blanc de noirs", "brut", "extra brut", "rosé",
  ],
  barolo_barbaresco: [
    "barolo", "barbaresco", "nebbiolo", "langhe", "conterno",
    "giacosa", "gaja", "vietti", "sandrone", "monfortino",
    "falletto", "brunate", "cannubi", "rocche",
  ],
  super_tuscan: [
    "sassicaia", "ornellaia", "tignanello", "solaia", "masseto",
    "super tuscan", "bolgheri", "sangiovese", "brunello", "chianti",
    "morellino", "vino nobile", "montepulciano", "antinori",
  ],
  sauternes: [
    "sauternes", "barsac", "yquem", "rieussec", "climens",
    "semillon", "sémillon", "eiswein", "trockenbeerenauslese", "tba",
    "tokaj", "tokay", "aszú", "aszu",
  ],
  riesling: [
    "riesling", "moselle", "mosel", "rheingau", "pfalz", "alsace",
    "alsazia", "egon muller", "müller", "loosen", "jj prum", "keller",
    "kabinett", "spätlese", "auslese",
  ],
  napa_cabernet: [
    "napa", "screaming eagle", "harlan", "opus one", "stag's leap",
    "ridge", "caymus", "far niente", "dominus", "shafer",
    "california", "sonoma",
  ],
  port: [
    "porto", "port", "vintage port", "lbv", "tawny", "ruby",
    "quinta do noval", "graham", "taylor", "fonseca", "niepoort",
    "symington", "cockburn",
  ],
  amarone: [
    "amarone", "valpolicella", "allegrini", "quintarelli", "masi",
    "bertani", "zenato", "ripasso", "recioto",
  ],
};

// Lookup: given a wine name, return the matching PAIRINGS category key
export function getPairingCategory(wineName = "") {
  const lower = wineName.toLowerCase();
  for (const [category, keywords] of Object.entries(WINE_TO_PAIRING)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "default";
}

export function getPairingData(wineName = "") {
  const cat = getPairingCategory(wineName);
  return PAIRINGS[cat];
}
