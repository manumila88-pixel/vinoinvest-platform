# STATO_PROGETTO — VinoInvest (memoria permanente)

> Questo file è il CERVELLO del progetto. Non si perde niente perché è scritto qui.
> REGOLA: ogni agente lo LEGGE all'inizio e lo AGGIORNA alla fine di ogni sessione.
> Ultimo aggiornamento: 29 giugno 2026 (sessione notturna autonoma)

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

- [x] Mobile/responsive home (375px e 414px):
      Aggiunto breakpoint @media (max-width: 375px) con: hero font 17px,
      padding content 10px, stats grid gap 6px, market-indices single-column,
      .next-step-widget stack verticale su schermi molto stretti, search input 14px.
      Aggiunta classe .next-step-widget al componente in App.jsx.
      NON VERIFICATO visivamente — Manoel deve aprire home su telefono reale o
      DevTools a 375px e 414px per confermare.

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

## 5. APERTO / DA FARE (in ordine di priorità)
- [ ] **[VERIFICA MANUALE RICHIESTA]** Market Intelligence: aprire /market-intelligence
      in incognito (sia da URL diretto che dal link sidebar B2B). Se ancora nero →
      aprire DevTools Console e riportare l'errore esatto. Fix applicato ma non testato live.
- [ ] **[VERIFICA MANUALE RICHIESTA]** Mobile home 375px: aprire su telefono reale o
      DevTools a 375px — verificare che NextStepWidget si impili, stats card leggibili,
      no overflow orizzontale.
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
- [ ] Dominio vinoinvest.com
