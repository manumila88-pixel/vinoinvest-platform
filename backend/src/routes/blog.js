import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

let blogCache = null;
let blogCacheTime = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

const FALLBACK_POSTS = [
  {
    id: 1,
    title: "Come Investire in Vino nel 2026: Guida Completa",
    slug: "come-investire-in-vino-2026",
    excerpt: "Il vino pregiato ha consegnato rendimenti medi del 12% annuo negli ultimi 10 anni. Scopri come costruire un portfolio di fine wine con un budget a partire da €5.000.",
    content: "Investire in vino pregiato è diventato una delle strategie di diversificazione più apprezzate da investitori privati e istituzionali. A differenza degli asset finanziari tradizionali, il vino offre una correlazione bassa con i mercati azionari e una domanda strutturalmente crescente da Asia e Stati Uniti.\n\nLa chiave è selezionare vini con alte probabilità di apprezzamento: annate eccezionali di produttori iconici come Pétrus, DRC, Sassicaia o Lafite. L'AI Score di VinoInvest analizza oltre 15 variabili per identificare le opportunità più interessanti.\n\nPer iniziare, un portafoglio minimale di €10.000 dovrebbe essere così strutturato: 40% Bordeaux (Lafite, Mouton, Pétrus), 30% Borgogna (DRC, Méo-Camuzet), 20% Italia (Sassicaia, Masseto), 10% Champagne (Dom Pérignon, Krug).",
    category: "Guida",
    author: "VinoInvest AI",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Barolo 2021: Perché Questa Annata Vale il Doppio",
    slug: "barolo-2021-annata-eccezionale",
    excerpt: "Con punteggi da 97 a 100 dai maggiori critici, il Barolo 2021 si candida come miglior annata del decennio. Ecco i produttori da non perdere.",
    content: "Il 2021 ha regalato al Piemonte condizioni climatiche eccezionali: estate calda ma non torrida, settembre freddo e soleggiato. Il risultato è un'annata di straordinaria eleganza e longevità.\n\nI top scorer: Giacomo Conterno Monfortino (99 punti), Bartolo Mascarello (98 punti), Bruno Giacosa (98 punti). Le quotazioni attuali sono ancora accessibili rispetto al potenziale 2030-2035.\n\nL'AI Score di VinoInvest assegna ai Barolo 2021 una media di 94/100, con segnale Strong Buy per i produttori di punta.",
    category: "Analisi",
    author: "VinoInvest AI",
    publishedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    readTime: "5 min",
  },
  {
    id: 3,
    title: "Bordeaux vs Borgogna: Quale Investe Meglio nel 2026?",
    slug: "bordeaux-vs-borgogna-2026",
    excerpt: "Due regioni, due filosofie di investimento. Analisi completa di rischio/rendimento, liquidità e outlook per i prossimi 5 anni.",
    content: "Bordeaux offre liquidità superiore grazie al mercato Liv-ex, prezzi più accessibili per entry-level e una catena di distribuzione globale. La Borgogna offre rendimenti maggiori ma minore liquidità e quantità estremamente limitate.\n\nPer un portfolio di €50.000: 60% Bordeaux per liquidità e diversificazione, 30% Borgogna per rendimento, 10% wildcard (Barolo, Napa, Champagne).\n\nL'indice Liv-ex Fine Wine 100 mostra Bordeaux in ripresa (+3.2% YTD), mentre la Borgogna consolida dopo la correzione 2024.",
    category: "Confronto",
    author: "VinoInvest AI",
    publishedAt: new Date().toISOString(),
    readTime: "6 min",
  },
];

async function generateBlogPosts() {
  if (!process.env.ANTHROPIC_API_KEY) return FALLBACK_POSTS;

  const topics = [
    "Come investire in vino pregiato per principianti nel 2026",
    "Top 5 vini con il miglior potenziale di apprezzamento quest'anno",
    "Bordeaux vs Borgogna: analisi investimento 2026",
  ];

  const posts = [];
  for (let i = 0; i < topics.length; i++) {
    try {
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [{
          role: "user",
          content: `Scrivi un articolo blog professionale in italiano per VinoInvest, piattaforma di investimento vino AI.

Titolo/tema: "${topics[i]}"

Rispondi con JSON (no markdown):
{
  "title": "titolo SEO ottimizzato",
  "slug": "url-friendly-slug",
  "excerpt": "riassunto 1-2 frasi",
  "content": "articolo 3-4 paragrafi, tono professionale, dati concreti",
  "category": "Guida|Analisi|Mercato|Tendenze",
  "readTime": "X min"
}`,
        }],
      });

      const text = msg.content[0]?.text?.trim() || "";
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}") + 1;
      if (jsonStart >= 0) {
        const post = JSON.parse(text.slice(jsonStart, jsonEnd));
        posts.push({
          ...post,
          id: i + 1,
          author: "VinoInvest AI",
          publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
        });
      }
    } catch (e) {
      console.error(`[blog] Error generating post ${i}:`, e.message);
      posts.push(FALLBACK_POSTS[i]);
    }
    // Delay between requests to avoid rate limiting
    if (i < topics.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  return posts.length > 0 ? posts : FALLBACK_POSTS;
}

// GET /api/blog
router.get("/", async (req, res) => {
  if (!blogCache || Date.now() - blogCacheTime > CACHE_TTL) {
    blogCache = await generateBlogPosts();
    blogCacheTime = Date.now();
  }
  res.json({ posts: blogCache, total: blogCache.length, generated: !blogCache[0]?.fallback });
});

// GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  if (!blogCache || Date.now() - blogCacheTime > CACHE_TTL) {
    blogCache = await generateBlogPosts();
    blogCacheTime = Date.now();
  }
  const post = blogCache.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

export default router;
