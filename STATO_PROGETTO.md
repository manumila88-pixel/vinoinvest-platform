# STATO_PROGETTO — VinoInvest (memoria permanente)

> Questo file è il CERVELLO del progetto. Non si perde niente perché è scritto qui.
> REGOLA: ogni agente lo LEGGE all'inizio e lo AGGIORNA alla fine di ogni sessione.
> Ultimo aggiornamento: 7 luglio 2026 (sessione SEO / preparazione cambio dominio)

---

## 1. VISIONE (non cambia)
- VinoInvest = "il Bloomberg del vino". Obiettivo: diventare l'AUTORITÀ / l'indice
  di riferimento globale per l'investimento in vino.
- L'autorità si costruisce sull'AFFIDABILITÀ DEI DATI, non sull'estetica né su promesse.
- Vendiamo SISTEMI e MECCANISMI, mai promesse di rendimento. Diamo la mappa, non la
  destinazione. L'utente decide.
- Modello: subscription-only (no vendita diretta vino → evita licenze MiFID II).
- Target: B2C (investitori individuali) + B2B (wealth manager, family office) + Cantine.

## 2. PRINCIPI DI LAVORO (non cambiano)
- **VERIFICA SEMPRE**: "l'agente dice fatto" ≠ fatto. Fatto = Manoel lo vede sul sito
  live, in incognito. Questa regola ha salvato il progetto più volte.
- **UNA COSA ALLA VOLTA**: una fase, verifica, poi la successiva. Mai "tutto insieme"
  (porta al caos: vedi 401 multi-terminale, agent che si pestano i file).
- **ZERO DATI INVENTATI**: mai numeri/rendimenti/prezzi/casi storici inventati o fonti
  false. Solo meccanismo + dati reali dal DB + rimando a fonti vere (liv-ex.com).
- **NIENTE MERGE CIECHI** su main. build/v2 resta sempre fuori. Merge solo con OK di Manoel.
- **UN TERMINALE per i lavori di precisione**. Login stabile PRIMA di aprire altri terminali.
- Parallelismo massiccio (swarm) SOLO per file indipendenti (es. articoli blog), mai
  su codice condiviso.

## 3. STATO TECNICO
- Frontend React 18 + Vite su Vercel (vinoinvest-platform.vercel.app)
- Backend Node/Express su Render · PostgreSQL Render · Supabase auth
- Repo: manumila88-pixel/vinoinvest-platform · locale: ~/Downloads/vinoinvest-platform-ready
- Admin: manumila88@gmail.com

## 4. FATTO E VERIFICATO (live)
- [x] AI Score VARIA davvero (83/87/82/90/91/93...) — non più 88 a tutti. VERIFICATO.
- [x] Dati inventati RIMOSSI dall'Academy (+13.6%, Sharpe, CAGR, fonti false) —
      merge b7b3a8a su main, VERIFICATO sulla slide "Liv-ex 100 vs altri asset".
      Ora mostra meccanismo + "dati reali su liv-ex.com".
- [x] Navigazione (commit ad93df6): pulsante indietro/home, disclaimer, /blog con
      indice, no più Cmd+R all'avvio — VERIFICATO ("funziona tutto").
- [x] Vista B2B si attiva: header PRO blu, sidebar Market Intelligence/Clienti/Report,
      KPI, toggle "Visualizza come B2C". Dashboard B2B visivamente ottima.
- [x] Quiz e Academy si aprono, modal vino non si chiude da solo.

### Sessione 29 giugno 2026 (branch fix/overnight-fixes, commit 738c9a6)
- [x] Market Intelligence crash (schermo nero):
      VERIFICATO via build — 1385 moduli compilano clean, zero errori.
      Aggiunto DarkErrorBoundary inline (sfondo scuro anche in caso di crash,
      non più schermo bianco). Lettura user da localStorage ora sincrona
      (no più flash "Contenuto bloccato" per utenti B2B al primo render).
      Dati INSTITUTIONAL_MOVERS, UPCOMING_AUCTIONS, EN_PRIMEUR_CALENDAR etichettati
      "dati illustrativi". Disclaimer footer con link a liv-ex.com.
      NON VERIFICATO in browser live — Manoel deve aprire /market-intelligence
      in incognito (sia da URL diretto che dal link B2B sidebar) e confermare.

- [x] Typo live-ex.com → liv-ex.com:
      VERIFICATO con grep — 0 occorrenze rimaste.
      Corretti 18 in premiumContent.js e 1 in academyVideos.js.

- [x] Box "Liv-ex Indices" dashboard:
      Titolo "Simulated Liv-ex Indices" già presente (sezione-sub).
      Colore subtitle migliorato (#3a5a7a→#5a82a6, più leggibile).
      Aggiunto footnote "Valori calcolati su base simulata a scopo illustrativo"
      con link a liv-ex.com, visibile quando la sezione è espansa.

- [x] Mobile/responsive home (375px, 390px, 414px):
      SESSIONE 1: aggiunto @media (max-width: 375px) — ma non era sufficiente perché
      il @768px a fine file sovrascriveva tutto.
      SESSIONE 2 (commit 16f5e5a): trovata la causa radice — .main { display: flex }
      con sidebar position:fixed su iOS Safari mantiene 220px flex space → content
      solo 170px → metà sinistra dello schermo.
      FIX: .main { display: block } + .content { width: 100%; max-width: 100% } nel
      blocco @768px. Verificato con Chrome headless (layout test HTML) a 390/375/414px:
      KPI cards "Mercato Globale", "Valore Portfolio", "ROI" riempiono TUTTA la larghezza.
      LandingPage hero: aggiunto width:100% + wordBreak su h2, stats bar constrained
      con min(100%,480px). Titolo "Premier Grand Cru Classé" non più tagliato.
      REPORT dettagliato in content/REPORT.md.
      DA VERIFICARE su iPhone reale (logged-in dashboard).

- [x] Route scan completa:
      Build production: 1385 moduli, zero errori, zero warning critici.
      Tutti i file lazy-loaded esistono. Scan manuale su 11 pagine ad alto rischio:
      WineryDashboard, ClientDetail, OrgDashboard, WineryProfile, VintageStory,
      B2BGuide, WineCompare, SharePortfolio, AuctionTracker, EnPrimeur, MarketSentiment
      — tutti OK (i 2 "issue" segnalati dall'agente Explore erano falsi positivi,
      già protetti da guard nel codice esistente).
      Blog (BlogIndex, BlogPost): OK con error handling + loading state.

- [ ] NON FATTO: lanci Vercel / test live — il branch fix/overnight-fixes NON è
      su main. Manoel deve fare il merge dopo aver verificato.

### Sessione 7 luglio 2026 (SEO — preparazione cambio dominio)
- [x] **URL base centralizzato**: zero occorrenze hardcoded di
      vinoinvest-platform.vercel.app nel codice sorgente.
      · Frontend: `frontend/src/lib/constants.js` → `SITE_URL` (env `VITE_SITE_URL`,
        con fallback). Tutte le pagine/componenti importano da lì.
      · Backend: `backend/src/config/site.js` → `SITE_URL` (env `SITE_URL`, con
        fallback). Email, PDF, bot Telegram, export importano da lì.
        Eccezione voluta: in `backend/src/server.js` la allowlist CORS mantiene il
        letterale vercel.app + SITE_URL (il vecchio dominio deve restare funzionante).
      · Script di generazione (`scripts/generate-wine-pages.js`,
        `scripts/ping-sitemaps.js`, `frontend/scripts/gen-blog-data.mjs`): leggono
        `SITE_URL` da env con fallback.
      · File statici (sitemap, robots, 238 pagine /vini/, llms.txt, widget.js):
        riscritti in blocco da `scripts/set-site-url.js` (vedi sezione CAMBIO DOMINIO).
      VERIFICATO: grep pulito su frontend/src e backend/src; roundtrip
      set-site-url.js (vercel→vinoinvest.com→vercel) = stato identico byte a byte.
- [x] **Sitemap sistemate e VALIDATE con xmllint (tutte e 5)**:
      · FIX namespace rotto in sitemap-blog.xml (`sitemap/9/0.1` → `0.9`) — prima
        era XML invalido per Google (bug anche nel generatore, corretto).
      · `sitemap.xml` = index canonico con TUTTE e 3 le figlie (static 35 URL,
        wines 238 URL, blog 99 URL = 372 totali); `sitemap-index.xml` identico
        per retrocompatibilità. Prima il blog NON era referenziato né da
        sitemap.xml né da robots.txt.
      · robots.txt ora punta al solo index `sitemap.xml`.
      · NOTA REALTÀ: le pagine vino statiche sono 238, non ~50k. Il limite di
        50.000 URL per file sitemap è lontano; la segmentazione esiste già
        (static/wines/blog) e il generatore andrà splittato solo sopra i 50k.
- [x] **Schema.org verificato con validatore locale** (`scripts/validate-schema.mjs`,
      eseguibile sempre: campione 20 pagine vino + homepage + 5 articoli → 0 errori).
      FIX applicati:
      · RIMOSSI dati inventati dagli schema (violavano "ZERO DATI INVENTATI" e le
        policy Google recensioni): aggregateRating 847/312 su ogni pagina vino,
        rating 4.8/312 in homepage, offerCount "12" fittizio.
      · Canonical pagine vino ora self-referencing (`/vini/x.html`): prima puntava
        a `/vini/x` che via rewrite Vercel serve la SPA, non la pagina → Google
        avrebbe scartato l'indicizzazione delle 238 pagine.
      · hreflang finti rimossi (pagine vino: 10 lingue inesistenti; homepage:
        40 → 12 lingue realmente presenti in src/locales/).
      · Homepage: publisher logo puntava a /logo.png inesistente → icon-512.png.
- [x] **og:image creata** (`frontend/public/og-image.jpg`, 1200×630, navy+oro):
      era referenziata da homepage/App.jsx ma NON ESISTEVA (link social senza
      anteprima). Generata con `scripts/generate-og-image.mjs` (zero dipendenze).
      È un placeholder pulito: sostituibile con una grafica firmata quando c'è.
      Aggiunta og:image/twitter:image anche alle 238 pagine vino (prima assente).
- [x] **Blog SEO**: BlogPost.jsx ora emette canonical, Open Graph completo,
      twitter card e Article JSON-LD via Helmet; BlogIndex.jsx canonical + og.
      (Nota: essendo SPA, i tag sono client-side — Google li vede, gli scraper
      social più vecchi no. Eventuale prerendering è decisione post-lancio.)
- [x] Build frontend verificata (vite build ok), sintassi backend verificata
      (node --check su tutti i file toccati).

### Sessione 7-8 luglio 2026 (CONTENUTI — audit anti-fabbricazione + legali)
- [x] **Audit anti-fabbricazione completo** su 99 articoli blog + tutti i file dati
      Academy (premiumModules, premiumModulesConsumer, premiumModulesB2B/B2B_b,
      academyContent, premiumContent, academyVideos, courseDeepDive) + pagine
      statiche (Learn, Annate, Methodology, AuctionTracker, Glossary, CaseStudies,
      faq.js, awards.js). Swarm di 10 agenti + completamento manuale (gli agenti
      hanno colpito il limite sessione a metà; NOTA: le prime edit degli agenti
      blog erano state sovrascritte dal roundtrip set-site-url.js della sessione
      SEO parallela — riapplicate e verificate su disco).
      · Blog: 15 articoli corretti (statistiche non fondate → qualitativo, esempi
        prezzo→prezzo rimossi, errori fattuali: classificazione 1855/Mouton 1973,
        DOCa Ribera del Duero, refuso "Ribiera", regola 3 anni successione →
        coacervo generico). 84 articoli già puliti dalle sessioni precedenti.
      · Academy: rimossi/qualitativizzati "premio 200-400%", "+180%/+150%",
        finta "analisi 2023 su 3.200 vini bio", numeri GSIA errati, Lafite
        £7.000→£10.000, Burgundy Index +87%, DRC La Tâche £28k→£52k, case study
        con esiti precisi inventati (churn -40%, rinnovo 94% vs 71%, Pétrus 2022
        +52.9%) → "Scenario illustrativo". Le masterclass "dal vivo su opportunità
        reale" ora dichiarate "caso illustrativo/posizione simulata". Mantenuti:
        formule didattiche (Sharpe/CAGR/MOIC/XIRR), scenari ipotetici espliciti,
        costi operativi indicativi, fatti storici verificabili.
      · Pagine: Methodology senza finti studi ("correlazione 0.72", "68%", "340%"
        → qualitativo, esempi "ipotetici"); Annate growth "+22%"→etichette
        qualitative; Learn senza traiettorie prezzo inventate; Glossary ROI senza
        "8-10% annuo"; AuctionTracker con disclaimer "illustrative sample data";
        faq senza "allocazione consigliata" (→ esempio non-raccomandazione) né
        stat 2008; awards.js: tolto Sassicaia da Antinori.
      · VERIFICA: grep pattern (+X%, CAGR, Sharpe, "secondo il report", Liv-ex
        20XX, Knight Frank, guadagnerai/garantito) = 0 residui problematici;
        import syntax OK; vite build OK. content/blog risincronizzato con
        frontend/public/blog (+ rename pinot-noir per matchare il manifest).
- [x] **Zero promesse di rendimento**: scansione dedicata su blog + pagine +
      componenti. Unica occorrenza "rendimento garantito" rimasta è un'opzione
      volutamente SBAGLIATA di un quiz (Learn.jsx) — legittima.
- [x] **Bozze legali complete IT+EN** in `legal/`: privacy GDPR (basi giuridiche,
      responsabili Supabase/Render/Vercel/Stripe/PayPal/Resend, trasferimenti
      extra-UE, diritti 15-22, Garante), cookie policy (solo cookie tecnici reali,
      chiave vino_cookie_consent_v1), ToS con disclaimer prominente (no consulenza
      finanziaria, no promesse di rendimento, solo strumenti informativi, vini
      non-MiFID II). Placeholder [NOME TITOLARE]/[INDIRIZZO]/[EMAIL CONTATTO]/ecc.
      da compilare + revisione legale PRIMA della pubblicazione.
- [x] **Cookie banner**: esiste già (CookieBanner.jsx) ed è conforme — nessun
      codice necessario. Incoerenze delle pagine legali JSX documentate in
      HANDOFF.md (sezione "Agente Contenuti → Agente 1") per l'allineamento.
- [ ] DA FARE (Manoel): compilare placeholder legali + revisione avvocato;
      verificare con commercialista fiscalita-vino (quadro RW, "6 anni") e
      successione; decidere su Umami (policy lo dichiara ma è spento).

## 5. APERTO / DA FARE (in ordine di priorità)
- [ ] **[VERIFICA MANUALE RICHIESTA]** Market Intelligence: aprire /market-intelligence
      in incognito (sia da URL diretto che dal link sidebar B2B). Se ancora nero →
      aprire DevTools Console e riportare l'errore esatto. Fix applicato ma non testato live.
- [ ] **[VERIFICA MANUALE RICHIESTA]** Mobile home 375px/390px: aprire app su iPhone
      reale (logged-in) — verificare che "Mercato Globale", "Valore Portfolio", "ROI"
      riempiano tutta la larghezza, niente colonna vuota a destra.
- [ ] **[MERGE PENDENTE]** Branch fix/overnight-fixes pronto per review. Dopo verifica
      manuale dei punti sopra → merge su main → push → Vercel deploy automatico.
- [ ] Market: solo 4 colonne → aumentare + personalizzazione colonne visibili.
- [ ] Slide Academy troppo piccole/minimaliste → ingrandire.
- [ ] Email test: non arrivano + mittente deve essere "VinoInvest".
- [ ] Pulizia: node_modules è nel repo per errore → sistemare .gitignore.

## 6. DECISIONI PRESE (per non ridiscuterle)
- Dati reali Liv-ex/Wine-Searcher (~€500/mese): NON ora. Dopo il lancio, quando
  ci sono investitori e budget. È IL salto verso l'autorità vera, ma è dopo.
- Interfaccia 3D / "design da €20k": NO per ora. Bloomberg non ha 3D; l'autorità è
  dati+chiarezza+zero bug, non scenografia. Eventualmente molto dopo il lancio.
- AI Score: formula trasparente che mostra il breakdown (scelto vs AI vino-per-vino).
- Quiz profilazione: saltabile, doppio asse (come pensi × cosa vuoi).

## 7. FASI FUTURE (dal PROCESSO_VINOINVEST.md)
Fase 1 B2B sblocco (fatto) → Fase 2 tre utenti (B2C/B2B/Cantine) → Fase 3 dashboard
personalizzabile → Fase 4 pubblicare 99 articoli + blog → Fase 5 mail B2C/B2B →
Fase Infra (chiavi Render, dominio vinoinvest.com, dati reali).

## 8. INFRA MANUALE (Manoel, mai chiavi in chat)
- [ ] Chiavi su Render: STRIPE_WEBHOOK_SECRET, ANTHROPIC_API_KEY, RESEND_API_KEY
- [ ] Dominio vinoinvest.com → procedura pronta, vedi sezione 9

## 9. CAMBIO DOMINIO = UNA VARIABILE (procedura al lancio di vinoinvest.com)

> Preparato il 7 luglio 2026. Il passaggio NON è una migrazione: è un comando
> + due variabili d'ambiente. Tutto il resto è già centralizzato.

### 9a. Il punto esatto dove cambiare valore
```bash
node scripts/set-site-url.js https://vinoinvest.com
```
Questo unico comando riscrive il vecchio URL col nuovo in TUTTI i file statici
(sitemap, robots.txt, 238 pagine /vini/, index.html, llms.txt, widget.js,
security.txt, chrome-extension) E nei fallback del codice. È idempotente e
riusabile (legge l'URL corrente dal fallback di `frontend/src/lib/constants.js`).

Poi le due env (hanno la precedenza sui fallback a runtime):
1. **Vercel** → Settings → Environment Variables → `VITE_SITE_URL=https://vinoinvest.com`
2. **Render** → Environment → `SITE_URL=https://vinoinvest.com` (link in email/PDF/bot)

Infine: aggiungi il dominio al progetto Vercel (Settings → Domains →
vinoinvest.com; Vercel fa redirect 308 automatico dal dominio .vercel.app),
commit + push (deploy automatico).

### 9b. Checklist Google Search Console (Manoel, ~15 min)
1. [ ] https://search.google.com/search-console → "Aggiungi proprietà" →
       tipo **Dominio** → `vinoinvest.com`
2. [ ] Verifica via record DNS TXT: GSC mostra una stringa
       `google-site-verification=...` → aggiungila come record TXT dal pannello
       DNS del registrar (dove hai comprato il dominio). Propagazione: da minuti
       a qualche ora. Poi clicca "Verifica".
3. [ ] Sitemap → "Aggiungi nuova sitemap" → invia `sitemap.xml`
       (è l'index: Google scopre da sé static + wines + blog. Non serve
       inviare le figlie una a una.)
4. [ ] Se la vecchia proprietà GSC su vinoinvest-platform.vercel.app esiste:
       usa "Cambio di indirizzo" (Impostazioni → Cambio di indirizzo) per
       trasferire i segnali al nuovo dominio.
5. [ ] Controlla dopo 2-3 giorni: Copertura → le 372 pagine devono comparire
       in "Scansionate". Le pagine /vini/*.html devono risultare "Indicizzate"
       (canonical ora self-referencing, il blocco storico è stato rimosso).
6. [ ] Bing: https://www.bing.com/webmasters → importa direttamente la proprietà
       da GSC (2 click), oppure esegui `node scripts/ping-sitemaps.js`.

### 9c. Cosa NON serve toccare
- vercel.json (rewrites/headers indipendenti dal dominio)
- CORS backend: la allowlist tiene già vercel.app + SITE_URL insieme
- Supabase redirect URLs: ⚠️ unica eccezione manuale — aggiungi
  `https://vinoinvest.com` in Supabase → Authentication → URL Configuration
  (Site URL + Redirect URLs), altrimenti login Google/reset password
  reindirizzano al vecchio dominio.
- Stripe: il webhook punta al backend Render, non al frontend → nessun cambio.

### 9d. Strumenti SEO permanenti aggiunti in questa sessione
- `scripts/set-site-url.js <url>` — switch dominio in un comando (roundtrip-safe)
- `scripts/validate-schema.mjs [N]` — validazione locale schema.org + canonical +
  og su N pagine vino campionate + homepage + 5 articoli blog. Da rilanciare
  dopo ogni rigenerazione delle pagine.
- `scripts/generate-og-image.mjs` — rigenera l'og-image placeholder
- `xmllint --noout frontend/public/sitemap*.xml` — validazione XML sitemap
