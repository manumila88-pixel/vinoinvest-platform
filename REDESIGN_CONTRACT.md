# VinoInvest — REDESIGN CONTRACT (multi-agent)
Obiettivo: restyle visivo globale premium/futuristico (barra qualita: Linear, Stripe, Vercel). Performance e stabilita prima di tutto. Lavoro parallelo SENZA collisioni di file.

## 0. REGOLE INVIOLABILI (tutti gli agenti)
1. NON rompere ne rimuovere: Recharts (ComposedChart con width fisso, mai ResponsiveContainer), ricerca vini paginata server-side, auth Supabase, flussi di pagamento.
2. NON reintrodurre Three.js o librerie 3D. Animazioni solo CSS/transform.
3. NESSUN agente installa nuove dipendenze. package.json e lockfile CONGELATI. Se pensi serva una libreria, scrivilo nel DONE file, non installarla.
4. Modifiche SOLO estetiche: cambia stile (classi, CSS, markup di presentazione), MAI logica, state, chiamate API, struttura dati.
5. Bundle non deve crescere in modo significativo. Misura con npm run build a fine lavoro e riporta il delta nel DONE file.
6. Accessibilita: contrasto AA, rispetta prefers-reduced-motion, focus states visibili. Mobile fluido a 480px e 768px.
7. Tocca SOLO i file della tua sezione (§3). Non aprire i file di altri agenti. NON toccare i18n.js, lib/, backend.
8. Usa la skill design-taste-frontend. Per pagine esistenti usa redesign-existing-projects (audit prima di modificare).

## 1. GIT
Branch unico condiviso: redesign/global. Ogni agente committa SOLO i propri file (mai git add -A). Un commit atomico per file, messaggio inglese feat(ui): ... . Niente push su main durante il lavoro. Merge finale ordine A -> B -> C, lo fa l'utente.

## 2. DESIGN TOKENS — nomi CONGELATI
Agent A li mette in frontend/src/styles/tokens.css. B e C li USANO con var(--...), non li ridefiniscono. COLORI: NON inventarli, estrarre la palette gia in uso nel progetto e usarla con questi nomi.
Variabili: --vi-bg --vi-bg-elev --vi-surface --vi-border --vi-text --vi-text-dim --vi-accent --vi-accent-2 --vi-accent-glow --vi-positive --vi-negative
--vi-font-sans --vi-font-display --vi-fs-xs --vi-fs-sm --vi-fs-base --vi-fs-lg --vi-fs-xl --vi-fs-2xl --vi-fs-3xl
--vi-radius-sm --vi-radius-md --vi-radius-lg --vi-radius-full
--vi-elev-1 --vi-elev-2 --vi-glow
--vi-dur-fast(120ms) --vi-dur(200ms) --vi-dur-slow(360ms) --vi-ease(cubic-bezier(.22,1,.36,1)) --vi-ease-spring(cubic-bezier(.34,1.56,.64,1))
Classi utility CONGELATE (Agent A le crea in frontend/src/styles/utilities.css; B e C applicano solo i className): .vi-interactive (hover lift + glow), .vi-btn (bottone premium), .vi-card (superficie+bordo+raggio), .vi-reveal (entrata morbida allo scroll, off con reduced-motion).

## 3. PROPRIETA FILE (disgiunta, nessuna sovrapposizione)
AGENT A (foundation + marketing): frontend/src/styles/tokens.css, frontend/src/styles/utilities.css, import nell'entry (main.jsx o index.css), LandingPage.jsx, pages/B2B.jsx Pricing.jsx Learn.jsx PressKit.jsx Transparency.jsx EnPrimeur.jsx AuctionTracker.jsx ReferralPage.jsx SharePortfolio.jsx
AGENT B (shell + componenti condivisi): App.jsx, components/ WineCard.jsx VirtualWineGrid.jsx PaymentModal.jsx PurchaseModal.jsx OnboardingModal.jsx GuidedTour.jsx HelpBot.jsx AgentChat.jsx Toast.jsx SkeletonCard.jsx CookieBanner.jsx ErrorBoundary.jsx ThemeToggle.jsx LangSelector.jsx CurrencySelector.jsx VoiceInterface.jsx SocialProof.jsx WineBottle3DModal.jsx SourceBadge.jsx
AGENT C (data viz + pagine dati): components/ PriceHistoryChart.jsx VintageScore.jsx InvestmentCalculator.jsx WinePriceCompare.jsx Bottle3D.jsx, pages/ Dashboard.jsx MarketIndex.jsx MarketSentiment.jsx WineCellar.jsx WineJournal.jsx InvestmentGoals.jsx LabelScanner.jsx NotificationSettings.jsx. Sui grafici Recharts cambia SOLO colori/tooltip/griglia, logica intatta. Sulle griglie dati niente animazioni che rallentano lo scroll.

## 4. STEP 0 (solo Agent A)
A crea tokens.css + utilities.css (colori estratti da quelli esistenti), li importa nell'entry, git checkout -b redesign/global, commit feat(ui): design tokens foundation. Poi scrive STEP 0 COMPLETE in AGENT_A_DONE.md e si ferma. Appena fatto, B e C partono.

## 5. FINE
Ognuno scrive AGENT_A/B/C_DONE.md con: file modificati, delta bundle (prima/dopo build), variabili/classi mancanti, dipendenze che pensava servissero (NON installate). Il merge lo fa l'utente, ordine A -> B -> C.
