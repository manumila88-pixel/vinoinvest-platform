# /market-intelligence — Black Screen Root Cause Report

**Date:** 2026-06-24 | **Status:** FIXED ✅

## Causa esatta del crash

**File:** `frontend/src/pages/MarketIntelligence.jsx`, riga 225

L'endpoint `/api/news` restituisce `source` come **oggetto** `{"name": "Wine Enthusiast"}`, non come stringa.  
Il componente lo rendeva direttamente: `{n.source || "VinoInvest"}` → React lancia `Objects are not valid as a React child`.

Il throw avviene **durante il render** (non durante il lazy load). Senza `<ErrorBoundary>` sulla route, React smonta l'intero albero → `#root` vuoto → **schermo nero**.

### Fix applicati

1. **`MarketIntelligence.jsx` riga 225**: `n.source` → `n.source?.name`, `n.published` → `n.publishedAt`
2. **`App.jsx` riga 2784**: route avvolta con `<ErrorBoundary><Suspense>` — la pagina non sarà mai più nera

### Test
- `GET /api/news?limit=8` → confermato: `source` è oggetto `{name}` ✅
- `GET /api/risk/benchmark` → risposta corretta ✅
- Build Vite → 0 errori, 10.39s ✅
- Navigazione da B2B sidebar → funziona ✅
- URL diretto `/market-intelligence` → funziona ✅

---

# VinoInvest Content Generation Report

**Data di generazione:** 14 giugno 2026  
**Articoli generati:** 99  
**Stato:** Completato

## Sommario Esecutivo

Questo report documenta la generazione completa di 99 articoli SEO-ottimizzati sul tema dell'investimento in vino fine, creati per supportare la strategia di content marketing della piattaforma VinoInvest. Gli articoli coprono tutte le principali aree di interesse per investitori in vino: regioni vinicole premium, strategie di investimento, conservazione, fiscalità, mercato secondario, annate, e molto altro.

---

## Articoli per Categoria

### Bordeaux (6 articoli)
1. Come Investire nei Vini di Bordeaux: Guida per Principianti — investire-bordeaux-guida-principianti.md
2. La Classificazione del 1855 di Bordeaux: Perché Conta per gli Investitori — classificazione-1855-bordeaux-investimento.md
3. Pomerol e Saint-Émilion: La Riva Destra di Bordeaux per Investitori — pomerol-saint-emilion-riva-destra-bordeaux.md
5. I Cinque First Growth di Bordeaux: Lafite, Latour, Mouton, Margaux, Haut-Brion — five-first-growths-bordeaux-analisi.md
6. Médoc vs Riva Destra di Bordeaux: Quale Zona Scegliere — medoc-vs-riva-destra-bordeaux-confronto.md

### Borgogna (6 articoli)
7. Investire nei Vini di Borgogna: Guida Completa — investire-vini-borgogna-guida-completa.md
8. Grand Cru vs Premier Cru di Borgogna: Differenze per Investitori — grand-cru-premier-cru-borgogna-differenze.md
9. La Scarsità di Borgogna come Fattore di Investimento — scarsita-borgogna-fattore-investimento.md
10. Domaine vs Négociant in Borgogna: Chi Scegliere per Investire — domaine-vs-negociant-borgogna.md
11. Côte de Nuits: La Zona più Pregiata di Borgogna per Investire — cote-de-nuits-investimento.md
12. Perché il Pinot Noir di Borgogna è il Vitigno da Investimento per Eccellenza — pinot-noir-borgogna-re-investimento.md

### Champagne (5 articoli)
13. Investire in Champagne: Guida Completa per Principianti — investire-champagne-guida-principianti.md
14. Prestige Cuvée di Champagne: Le Etichette da Collezione — prestige-cuvee-champagne-investimento.md
15. Millésimé Champagne: Come Scegliere le Annate da Collezione — millesime-champagne-annate-collezione.md
16. Il Mercato Secondario dello Champagne: Come Funziona — mercato-secondario-champagne.md
17. Le Grandi Maison di Champagne: Quale Scegliere per Investire — grandi-marche-champagne-investimento.md

### Italia (9 articoli)
18. Barolo come Investimento: Guida Completa al Re dei Vini Italiani — barolo-investimento-guida-completa.md
19. Brunello di Montalcino: Il Vino da Investimento Italiano per Eccellenza — brunello-montalcino-investimento.md
20. Amarone della Valpolicella: Un'Alternativa per Investire in Vino Italiano — amarone-valpolicella-investimento.md
21. Sassicaia e i Supertuscans: Come Investire nei Vini Toscani d'Élite — sassicaia-supertuscan-investimento.md
22. Barolo vs Brunello: Quale Scegliere per il Tuo Portfolio Vinicolo — barolo-vs-brunello-confronto-investimento.md
23. Masseto e i Vini Ultra-Premium Italiani: Il Segmento dei Collezionisti — masseto-vini-ultra-premium-italiani.md
92. La Toscana come Regione Vinicola da Investimento — toscana-regione-vinicola-investimento.md
93. IGT vs DOCG: Come le Classificazioni Italiane Impattano il Valore del Vino — igt-vs-docg-classificazioni-valore.md
94. La Sicilia Vinicola come Mercato Emergente per Investitori — sicilia-vino-mercato-emergente.md

### Mercato (7 articoli)
24. Come Funziona il Mercato Secondario del Vino Fine — mercato-secondario-vino-fine-come-funziona.md
25. Wine Exchanges: Dove si Compra e Vende Vino da Investimento — wine-exchanges-dove-vendere-vino.md
26. Come Valutare un Vino Prima di Acquistarlo come Investimento — come-valutare-vino-investimento.md
27. Indici di Mercato del Vino Fine: Cosa Sono e Come Usarli — indici-mercato-vino-fine.md
28. La Correlazione tra Punteggi dei Critici e Valore del Vino — punteggi-critici-vino-valore.md
29. Wine Advocate, Decanter, Wine Spectator: Le Guide di Riferimento per Investitori — guide-riferimento-vino-investimento.md
30. Aste di Vino: Christie's, Sotheby's e Hart Davis Hart per Investitori — aste-vino-christies-sothebys.md

### Conservazione (6 articoli)
31. Come Conservare il Vino da Investimento: Guida Pratica — conservare-vino-investimento.md
32. Cantine Professionali vs Private: Pro e Contro per il Vino da Investimento — cantine-professionali-vs-private.md
33. Temperatura, Umidità e Luce: I Nemici del Vino da Investimento — temperatura-umidita-luce-vino.md
34. Provenance e Catena di Custodia: Perché la Storia del Vino Conta — provenance-catena-custodia-vino.md
35. Etichette e Capsule: Come la Condizione Fisica Impatta il Valore — condizione-fisica-bottiglia-etichetta.md
36. Trasporto Sicuro del Vino Fine: Cosa Sapere Prima di Spedire — trasporto-sicuro-vino-fine.md

### Strategia (11 articoli)
37. Come Diversificare un Portfolio di Vini da Investimento — diversificazione-portfolio-vinicolo.md
38. Buy and Hold vs Trading Attivo nel Mercato del Vino — buy-hold-vs-trading-vino.md
39. Come Costruire un Portfolio di Vini da Investimento da Zero — costruire-portfolio-vini-investimento.md
40. Investimento in Vino: Orizzonti Temporali Realistici — orizzonti-temporali-investimento-vino.md
41. Budget Minimo per Iniziare a Investire in Vino — budget-minimo-investimento-vino.md
42. I 10 Errori Classici dell'Investitore in Vino Principiante — errori-classici-investitore-vino.md
95. Analisi Fondamentale del Vino da Investimento: Un Framework — analisi-fondamentale-vino-investimento.md
96. I Cicli del Mercato del Vino Fine: Come Riconoscerli — cicli-mercato-vino-fine.md
97. Come Creare un Piano di Investimento Vinicolo su 12 Mesi — wine-investment-plan-12-mesi.md
98. Rapporto Rischio-Rendimento nel Vino: Come Valutarlo Correttamente — rapporto-rischio-rendimento-vino.md
99. Wine Broker: Cosa Fanno, Quando Servirsi e Come Sceglierli — wine-broker-cosa-fanno-come-sceglierli.md

### Fiscalità (5 articoli)
43. Fiscalità del Vino da Investimento in Italia: Cosa Sapere — fiscalita-vino-investimento-italia.md
44. IVA e Vino da Investimento: Come Funziona per gli Investitori — iva-vino-investitori.md
45. Successione e Donazione di Collezioni di Vino: Aspetti Legali — successione-donazione-vino-collezione.md
46. Aspetti Legali dell'Acquisto di Vino En Primeur — aspetti-legali-en-primeur.md
47. Tax Planning per Collezionisti di Vino: Strategie Legali — tax-planning-collezionisti-vino.md

### Rischi (5 articoli)
48. I Principali Rischi dell'Investimento in Vino che Devi Conoscere — rischi-principali-investimento-vino.md
49. Vino Contraffatto: Come Riconoscerlo e Proteggersi — vino-contraffatto-riconoscerlo.md
50. Liquidità del Mercato Vinicolo: Cosa Aspettarsi Davvero — liquidita-mercato-vinicolo.md
51. Market Timing nel Vino: Perché è Quasi Impossibile Farlo Bene — market-timing-vino-difficile.md
52. Climate Change e Impatto sui Vini da Investimento — climate-change-vino-investimento.md

### Annate (6 articoli)
53. Come Leggere una Guida alle Annate di Vino per Investire — come-leggere-guida-annate-vino.md
54. Annate Eccezionali vs Ordinarie: Come Distinguerle per Investire — annate-eccezionali-vs-ordinarie.md
55. Il Ruolo del Clima nella Qualità delle Annate di Vino — clima-qualita-annate-vino.md
56. Le Annate di Borgogna: Pattern Storici e Cosa Cercare — caratteristiche-annate-borgogna.md
57. Le Annate di Barolo: Come Valutare la Struttura e il Potenziale — caratteristiche-annate-barolo.md
58. Potenziale di Invecchiamento: Come Capire per Quanto un Vino Migliorerà — invecchiamento-vino-potenziale.md

### Regioni (6 articoli)
59. Vini di Culto della California come Investimento: Screaming Eagle e oltre — vini-culto-california-investimento.md
60. Porto Vintage: Il Vino da Investimento Dimenticato dai più — porto-vintage-investimento.md
61. Investire in Vini Spagnoli: Rioja e Ribera del Duero — vini-spagnoli-investimento-rioja.md
62. Penfolds Grange e i Vini Australiani Premium come Investimento — penfolds-grange-australia-investimento.md
63. Riesling Tedesco: Il Mercato dei Collezionisti e degli Investitori — riesling-tedesco-collezionisti.md
64. Il Piemonte Vinicolo per Investitori Internazionali: Oltre il Barolo — piemonte-investitori-internazionali.md

### En Primeur (6 articoli)
4. En Primeur a Bordeaux: Come Comprare Vino Ancora in Botte — en-primeur-bordeaux-come-funziona.md
65. En Primeur: Il Processo Completo dall'Acquisto alla Consegna — en-primeur-processo-completo.md
66. Vantaggi e Rischi dell'Acquisto En Primeur: Analisi Completa — vantaggi-rischi-en-primeur.md
67. Come Selezionare i Châteaux in una Campagna En Primeur — selezionare-chateau-en-primeur.md
68. Il Prezzo di Uscita En Primeur: Come si Forma e Cosa Significa — prezzo-uscita-en-primeur-dinamiche.md
69. Négociants e Merchants En Primeur: Chi Sono e Come Sceglierli — negociants-merchants-en-primeur.md

### Tendenze (5 articoli)
70. Il Ruolo dell'Asia nel Mercato del Vino Fine: Cina e oltre — asia-mercato-vino-fine.md
71. NFT e Blockchain nel Mercato del Vino: Realtà o Hype? — blockchain-nft-vino-realta-hype.md
72. Vino Naturale e Biodinamico come Investimento: Vale la Pena? — vino-naturale-biodinamico-investimento.md
73. Wine Investment Funds: Come Funzionano e Chi Dovrebbe Usarli — wine-investment-funds-come-funzionano.md
74. Il Futuro del Mercato del Vino da Investimento: Tendenze e Prospettive — futuro-mercato-vino-investimento.md

### Principianti (5 articoli)
75. Investimento in Vino: Da Dove Cominciare nel 2024 — investimento-vino-da-dove-cominciare.md
76. Come Aprire un Conto su una Wine Exchange: Guida Passo Passo — aprire-conto-wine-exchange.md
77. Glossario del Vino da Investimento: Termini Essenziali che Devi Conoscere — glossario-vino-investimento.md
78. Le Prime Bottiglie per un Portfolio Vinicolo: Come Scegliere — prime-bottiglie-portfolio-vinicolo.md
79. Collezionismo vs Investimento nel Vino: Differenze che Cambiano Tutto — collezionismo-vs-investimento-vino.md

### Confronti (4 articoli)
80. Vino vs Oro come Investimento Alternativo: Confronto Completo — vino-vs-oro-investimento-alternativo.md
81. Vino vs Whisky come Asset Alternativo: Quale Scegliere? — vino-vs-whisky-asset-alternativo.md
82. Vino vs Arte come Investimento Alternativo: Pro e Contro — vino-vs-arte-investimento.md
83. ETF Vinicoli vs Possesso Fisico: Due Modi di Investire nel Vino — etf-vinicoli-vs-possesso-fisico.md

### Tecnico (5 articoli)
84. Come Leggere un'Etichetta di Vino da Investimento — leggere-etichetta-vino-investimento.md
85. Formati Bottiglia: Perché Magnum e Jeroboam Valgono di Più — formati-bottiglia-magnum-investimento.md
86. Capsule e Sigilli: Cosa Rivelano sulla Storia della Bottiglia — capsule-sigilli-storia-bottiglia.md
87. Come Verificare l'Autenticità di una Bottiglia di Vino Fine — verifica-autenticita-vino.md
88. Fill Level e Ullage: Come la Quantità di Vino Impatta il Valore — fill-level-ullage-vino.md

### Uscita (3 articoli)
89. Come Uscire da un Investimento in Vino: Strategie di Liquidazione — come-uscire-investimento-vino.md
90. Come Trovare Compratori per la Tua Collezione di Vino Fine — trovare-compratori-vino.md
91. Quando Vendere: I Segnali di Mercato da Monitorare — quando-vendere-segnali-mercato.md

---

## Strategia SEO Implementata

Gli articoli seguono una strategia SEO multi-livello:

1. **Intent Matching**: Articoli informativi ("Come investire"), commerciali ("Quale scegliere"), e transazionali ("Aprire conto")

2. **Long-Tail Keywords**: Utilizzo di frasi specifiche (3-7 parole) con alta conversione: "Come investire nei vini di Bordeaux per principianti"

3. **Semantic Clustering**: Raggruppamento per temi correlati (Bordeaux, Borgogna, Portfolio)

4. **Internal Linking**: Struttura per facilitare cross-linking tra articoli (Es: articoli su "Conservazione" linkeranno a "Fiscalità" e "Rischi")

5. **User Journey**: Progressione naturale da principiante (Glossario, Prime bottiglie) a esperto (Fiscalità, En Primeur, Tax Planning)

---

## Integrazione in Blog/CMS

### Struttura Directory Consigliata

```
/blog/
├── /bordeaux/        # 6 articoli
├── /borgogna/        # 6 articoli
├── /champagne/       # 5 articoli
├── /italia/          # 9 articoli
├── /mercato/         # 7 articoli
├── /conservazione/   # 6 articoli
├── /strategia/       # 11 articoli
├── /fiscalita/       # 5 articoli
├── /rischi/          # 5 articoli
├── /annate/          # 6 articoli
├── /regioni/         # 6 articoli
├── /en-primeur/      # 6 articoli
├── /tendenze/        # 5 articoli
├── /principianti/    # 5 articoli
├── /confronti/       # 4 articoli
├── /tecnico/         # 5 articoli
└── /uscita/          # 3 articoli
```

### Metadati Frontmatter per Ogni Articolo

```
---
title: "Come Investire nei Vini di Bordeaux"
slug: "investire-bordeaux-guida-principianti"
category: "Bordeaux"
date: "2026-06-14"
readTime: 8
description: "Guida completa all'investimento in vini di Bordeaux"
keywords: ["Bordeaux investimento", "vini Bordeaux"]
relatedArticles: ["classificazione-1855-bordeaux-investimento"]
---
```

### Implementazione CMS

1. **Next.js/MDX**: Importare articoli in `/pages/blog/[category]/[slug].jsx` con generazione sitemap dinamico
2. **Headless CMS (Sanity/Contentful)**: Creare documento "BlogPost" e bulk import
3. **PostgreSQL**: Tabella `blog_posts` con query API `GET /api/blog/[slug]`

### Elementi SEO per Articolo

- Title tag: Keyword principale all'inizio (max 60 caratteri)
- Meta description: 155-160 caratteri con CTA
- Slug: Keyword-rich, lowercase (3-5 parole)
- Headings: H1 (titolo), H2/H3 per sottosezioni
- Introduzione: Risponde alla domanda nei primi 100-150 parole
- Internal links: 3-5 link naturali a articoli correlati
- Schema markup: JSON-LD BlogPosting con autore, data, immagine

### Analytics & Monitoring

**KPI Target (6 mesi):**
- 10,000-15,000 visitatori unici/mese
- Bounce rate < 40%
- Avg. time on page > 3 minuti
- 200-300 registrazioni/mese da blog
- Posizionamento top 10 per 60% keywords principali

---

## Calendario di Pubblicazione Consigliato

**Fase 1 (Settimane 1-2)**: 20 articoli cornerstone (Bordeaux, Borgogna, Champagne, Italia, Portfolio, Mercato)

**Fase 2 (Settimane 3-8)**: 50 articoli supporting (3-4/settimana) con focus su internal linking

**Fase 3 (Settimane 9-12)**: Ultimi 29 articoli e completamento della rete di cross-linking

**Fase 4 (Mensile)**: Manutenzione con aggiornamenti dati di mercato e 4-8 nuovi articoli/mese

---

## ROI Stimato

- **Content investment**: 99 articoli completi + setup CMS (60 ore)
- **6-12 mesi**: 10,000-15,000 visitatori/mese, 200-300 registrazioni/mese
- **Conversione clienti**: 50-100 clienti paganti equivalenti/mese
- **ROI**: 300-500% nel primo anno (valore medio cliente: €2,000-5,000/anno)

---

**Report completato:** 14 giugno 2026 | **99 articoli generati e pronti per l'integrazione**

---

# Mobile Responsive Fix Report — 29 giugno 2026

**Branch:** fix/overnight-fixes | **Status:** FIXED ✅

## Causa Radice

Il dashboard (vista loggata) mostrava il contenuto nella **metà sinistra** dello schermo su iPhone:

- `.main { display: flex }` applicato a tutti i breakpoint incluso mobile
- `.sidebar` aveva `position: fixed; transform: translateX(-100%)` su mobile (nascosta)
- **Problema**: in alcuni browser (Safari iOS) il flex item con `position: fixed` mantiene lo spazio allocato nel flex layout → 220px sidebar + contenuto = solo 170px su viewport 390px
- Risultato: KPI card ("Mercato Globale", "Valore Portfolio", "ROI") strette nella metà sinistra

## Fix Applicati

### 1. style.css — @media (max-width: 768px)

```css
/* PRIMA */
.content { padding: 14px 12px; }
.main { min-height: calc(100vh - 72px); }

/* DOPO */
.main { display: block; min-height: calc(100vh - 72px); }
.content { padding: 14px 12px; width: 100%; max-width: 100%; box-sizing: border-box; }
```

`display: block` su `.main` elimina il flex layout su mobile → `.content` prende automaticamente il 100% della larghezza.

### 2. LandingPage.jsx — Hero title e stats bar

- `h2` titolo: aggiunto `width: "100%"`, `wordBreak: "break-word"`, ridotto clamp min 28→22px
- `p` sottotitolo: aggiunto `width: "100%"`
- Stats bar: aggiunto `width: "min(100%, 480px)"`, `maxWidth: "calc(100vw - 32px)"`, `flex: "1 1 0"` con `minWidth: 0` per distribuzione uniforme

## Test Screenshot (Chrome headless)

### 390px (iPhone 14 Pro)
- **Dashboard layout test**: Contenuto riempie TUTTA la larghezza 390px ✓
- KPI cards: 2 colonne, entrambe visibili ✓
- "Mercato Globale", "Valore Portfolio", "ROI", "Watchlist" leggibili ✓
- Nessuno spazio vuoto a destra ✓
- **LandingPage**: Titolo "Premier Grand Cru Classé" completo ✓, stats bar visibile ✓

### 375px (iPhone SE)
- Contenuto dashboard piena larghezza 375px ✓
- Cards 2 colonne compatte ma leggibili ✓
- Titolo hero visualizzato correttamente ✓

### 414px (iPhone XS Max)
- Dashboard e LandingPage perfetti ✓
- Cards con buon respiro orizzontale ✓

## Cosa NON è stato toccato

- Label "Simulated/algorithmic estimates" — invariate ✓
- Label "Simulated Liv-ex Indices" — invariate ✓
- Disclaimer footer Market Intelligence — invariato ✓
- Funzionalità esistenti — invariate ✓

## Da verificare (Manoel su iPhone reale)

1. Aprire app da iPhone → dashboard loggato → verificare card a piena larghezza
2. Aprire landing page → hero carousel → verificare titolo completo
3. Confermare NO colonna vuota a destra in nessuna sezione