# VinoInvest — BUILD CONTRACT v2 (5 agenti)

> Letto UNA VOLTA da ogni agente. Prerequisito: il redesign è già su `main`.
> Obiettivo: dati reali (gratis/legali) + parte educativa + stime prezzo + performance + affidabilità.
> Lavoro parallelo SENZA collisioni: ogni agente possiede file diversi.

---

## 0. REGOLE INVIOLABILI (tutti)

1. SOLO fonti dati gratuite e LEGALI. VIETATO scraping non autorizzato, backdoor, aggirare
   login o ToS di Liv-ex/Wine-Searcher/altri. Se una fonte richiede pagamento o viola i ToS,
   NON usarla: scrivilo nel DONE file e fermati.
2. NESSUN agente installa nuove dipendenze senza segnalarlo nel DONE file (non installare e basta).
3. NON rompere: auth Supabase, pagamenti, ricerca paginata, Recharts, il redesign appena fatto.
4. I dati di mercato dei prezzi NON sono reali finché non si pagano le API. Qualsiasi prezzo
   calcolato va etichettato come STIMA (usa SourceBadge + pagina Transparency esistenti). Mai
   spacciare una stima per prezzo reale.
5. Tocca SOLO i file della tua sezione (§2). Non aprire i file di altri agenti.
6. git: branch unico `build/v2`. Ogni agente committa SOLO i propri file (mai `git add -A`).
   Commit atomici, messaggi inglese `feat(scope): ...`. Niente push su main: merge finale = utente.
7. A fine lavoro ognuno scrive `AGENT_<lettera>_V2_DONE.md`: file toccati, cosa fa, fonti usate,
   eventuali dipendenze NON installate, delta bundle se frontend.

---

## 1. STEP 0 (lo fa SOLO Agent D, è veloce)
Agent D crea il branch: `git checkout main && git pull && git checkout -b build/v2`, fa un commit
vuoto `chore: start build/v2` e pusha il branch. Scrive "BRANCH READY" in AGENT_D_V2_DONE.md.
Appena pronto, gli altri fanno `git checkout build/v2` e partono.

---

## 2. PROPRIETÀ DEI FILE (disgiunta)

### Agent D — Data enrichment (arricchisce le 50k schede vino)
Backend, servizi dati. OWNS:
- `backend/src/services/freeDataService.js`, `priceAggregator.js`, `rssNewsService.js`,
  `vintageClimateService.js`, `currencyService.js`
- `backend/src/jobs/` (i cron che aggiornano i dati)
- eventuale nuovo `backend/src/services/enrichmentService.js`
COSA: per ogni vino, arricchire da fonti GRATIS già usate (Wikidata/Wikipedia produttore,
Wikimedia Commons + Open Food Facts immagini reali bottiglie, Open-Meteo qualità annata,
BCE valute/inflazione, RSS notizie). Salvare in DB i campi mancanti. Idempotente, con cache,
rate-limit gentile verso le fonti. Nessun dato a pagamento.

### Agent E — Parte educativa / anti-fake (la differenza vera)
Backend contenuti + endpoint. OWNS:
- `backend/src/routes/academy.js`, `knowledgeBase.js`
- nuovo `backend/src/services/educationService.js`
- nuovo `backend/src/data/wine-education.json` (contenuti)
COSA: strutturare contenuto educativo dai temi dei corsi Academy: "come riconoscere un vino
autentico vs fake" (etichetta, capsula, sughero, livello, provenienza), "cosa guardare prima
di investire", checklist visive. Esporli via API per collegarli alle schede vino. Solo
conoscenza, nessun dato di mercato. Niente affermazioni mediche/legali, taglio educativo.

### Agent F — Motore di STIMA prezzo (legale, etichettato)
Backend logica. OWNS:
- `backend/src/services/aiScoreService.js`, `vinoInvestIndex.js`, `riskMetrics.js`
- nuovo `backend/src/services/priceEstimateService.js`
COSA: modello di stima del valore indicativo da segnali GRATIS/legali (qualità annata,
punteggi critici da fonti gratuite, eventuali aste pubblicate pubblicamente, i 100 check/giorno
gratis di Wine-Searcher SE l'utente fornirà una key — altrimenti niente). OGNI output marcato
"stima" con livello di confidenza. Mai presentato come prezzo reale di mercato.

### Agent G — Performance frontend
Frontend, build. OWNS:
- `frontend/vite.config.js`, `frontend/src/main.jsx` (solo per lazy/route splitting)
- lazy-loading delle pagine/route, ottimizzazione immagini (WebP, lazy, dimensioni),
  code-splitting, riduzione bundle
- NON toccare la logica dei componenti né il redesign: solo come/quando vengono caricati.
COSA: ridurre tempo di primo caricamento e peso. Misura bundle prima/dopo. Niente nuove librerie
senza segnalarlo.

### Agent H — Affidabilità & UX di base
Frontend/infra config. OWNS:
- nuovo `frontend/src/lib/errorReporting.js` (placeholder Sentry, SENZA chiave, pronto da attivare)
- `.github/workflows/` (CI che gira test-all.sh / build su ogni push)
- stati di loading/empty/error mancanti SOLO in pagine non assegnate ad altri (coordina via DONE file)
COSA: rete di sicurezza. Sentry predisposto ma spento (si attiva con chiave poi). CI che blocca
i push rotti. Nessuna chiave/segreto nel codice.

---

## 3. COSE CHE FA L'UTENTE (non gli agenti)
- Chiavi env su Render/Vercel (Stripe webhook secret = gratis; Anthropic, Sentry, Wine-Searcher = dopo).
- Piano Render a pagamento, dominio, Search Console = quando deciderà di pagare.

## 4. FINE
Ognuno scrive il proprio DONE file. Merge finale `build/v2 → main` lo fa l'utente.
Conflitti attesi: ZERO (file disgiunti). Se due agenti scoprono di voler lo stesso file,
si fermano e lo segnalano nel DONE file invece di forzare.
