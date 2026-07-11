# ANALISI COMPETITIVA & FATTIBILITÀ MARKETPLACE — VinoInvest vs Wine-Searcher

> Data: 11 luglio 2026 · Preparata per Manoel
> Metodo: ricerca web con fonti verificate (3 agenti di ricerca indipendenti:
> Wine-Searcher, partner marketplace, normativa) + audit interno del codice VinoInvest.
> REGOLA rispettata: zero dati inventati — dove una cosa non è verificabile c'è scritto
> **[DA VERIFICARE]**. Le fonti sono URL effettivamente aperti dagli agenti.
> NB: la sezione normativa è una mappa di temi da approfondire, NON consulenza legale.

## Contesto strategico

Wine-Searcher — leader mondiale dei dati prezzo vino — è stata acquisita a maggio 2026
(dettagli e fonti nella sezione 1). Direzione dichiarata dal committente di questa
analisi: focus USA, più AI, probabile monetizzazione aggressiva stile private equity.

**Spazio che si apre per VinoInvest** (tesi da validare sul mercato):
1. **Investimento, non consumo** — Wine-Searcher risponde a "dove compro questa
   bottiglia al prezzo migliore"; VinoInvest risponde a "questa bottiglia è un buon
   investimento e come lo gestisco nel tempo".
2. **Europa/Italia, non USA** — se il nuovo proprietario concentra le risorse sul
   mercato USA, il presidio dei mercati italiano ed europeo (lingua, fiscalità
   art. 67 TUIR, merchant locali, normative UE) diventa un vantaggio difendibile.
3. **Trasparenza, non scatola nera** — AI Score con breakdown pubblico e metodologia
   documentata (/metodologia) vs algoritmi opachi.

---

# PARTE 1 — ANALISI COMPETITIVA FEATURE PER FEATURE

> Lato Wine-Searcher: ricerca con fonti (nota: wine-searcher.com e
> thedrinksbusiness.com rispondevano 403 al fetch — i dettagli feature/prezzi
> provengono da snippet indicizzati delle pagine ufficiali, attendibilità
> medio-alta, segnalati [DA RIVERIFICARE sul sito]. L'acquisizione è confermata
> da fonti aperte). Lato VinoInvest: verificato direttamente sul codice
> (audit 9-11 luglio 2026).

## 1.0 L'acquisizione — fatti confermati da fonte aperta
- Acquirente: **GLX U.S. Inc.** (New York), controllata al 100% da **Platin Sàrl**,
  veicolo d'investimento della famiglia di **Olivier Goudet** (finanziere francese,
  ex CFO di Mars, cofondatore/ex CEO di JAB Holding). Annuncio ~11 maggio 2026.
  Prezzo non reso pubblico. [Harpers: harpers.co.uk/news/fullstory.php/aid/35820 ;
  Vino Joy 15/05/2026 ; Drinks Digest 19/05/2026]
- Strategia dichiarata: "particular emphasis on expansion in the critical US market"
  + "greater emphasis on the use of AI" (Grégory Andre, senior partner GLX). [Harpers, Vino Joy]
- Secondo cambio di proprietà in <3 anni (prima: Flaviar Inc., fine 2023 —
  attendibilità media [DA VERIFICARE]).
- Numeri dichiarati nel comunicato: ~18M offerte, 35.000 negozi, 130 paesi,
  ~250M ricerche/anno, ~60M utenti (definizione ambigua [DA VERIFICARE]). [Harpers, Vino Joy]
- Tema sollevato dalla stampa: potenziale conflitto d'interesse — Goudet/Platin
  detengono ~9% di Treasury Wine Estates e possiedono Château Charmail (Haut-Médoc):
  la storica neutralità di W-S resterà intatta? [Vino Joy]
- HQ resta Auckland (NZ) + uffici UK. [Harpers, Vino Joy]

## 1.1 Modello di business W-S (per capire dove NON competere)
- Listing merchant base gratuito; visibilità ai free solo per "sponsor" a pagamento;
  Sponsored list flat ~$360–440/mese per retailer con 750+ prodotti (benchmark
  BevSites 2014, DATATO: bevsites.com/single-post/2014/09/19 — DA RIVERIFICARE);
  Sponsored Lead ~$0,75/click; marketplace fee 10% (5% marketing + 5% payment/frode/CS);
  banner a CPM. [snippet /trade — DA RIVERIFICARE]
- Pro riportato a $10,99/mese (annuale ~€82,99): tutti i prezzi (i free vedono solo
  gli sponsor), 10 anni di storico, 365 alert/anno, cellar fino a 500 voci. [snippet /get-pro — DA RIVERIFICARE]
- API commerciale ESISTE: Wine Check API (score aggregato, prezzi min/max/medio) e
  Market Price API (primi 24 merchant) — REST XML/JSON, prezzo su richiesta, NO
  prezzi storici via API. Clienti citati includono "piattaforme di investimento sul
  vino". [snippet /trade/api — DA RIVERIFICARE; opzione: VinoInvest come CLIENTE
  dell'API W-S per prezzi retail reali, da quotare]
- Critiche ricorrenti (aneddotiche, Trustpilot/forum — NON stampa): moderazione
  reattiva sui merchant fraudolenti, feedback negativi "scontati" col tempo per
  policy, valore del Pro contestato, cancellazione macchinosa.

| # | Feature Wine-Searcher | VinoInvest ce l'ha? | Versione investment-oriented ha senso? | Verdetto |
|---|---|---|---|---|
| 1 | Ricerca prezzi tra rivenditori | Parziale (ricerca nel catalogo interno ~500 vini con prezzi propri; NO aggregazione multi-merchant) | Sì, come "a che prezzo compro/vendo il vino su cui voglio investire" | **FARE (via affiliazioni — vedi Parte 2, Livello A)** |
| 2 | Confronto rivenditori/offerte per bottiglia | No (WineCard ha link affiliati statici; /compare confronta vini tra loro, non rivenditori) | Sì: "best execution" per l'investitore | **FARE DOPO** (dipende da #1: servono i datafeed dei merchant) |
| 3 | Alert prezzo | Sì (price alert email via Resend con target price) — MA basati su prezzi interni/simulati, non di mercato | Sì, è core per un investitore | **FARE DOPO**: attivarli davvero solo quando ci sono prezzi di mercato reali (datafeed merchant o Liv-ex). Oggi sarebbero alert su dati simulati = contro il principio "affidabilità dei dati" |
| 4 | Scanner etichette (app) | Sì (/scan → /api/label-scan, camera+upload) | Sì: "scansiona la bottiglia in cantina → valutala come asset" | **GIÀ FATTO** — da collegare al flusso "carica la tua cantina" del marketplace Livello B |
| 5 | Versione Pro a pagamento | Sì (piani Stripe/PayPal /pricing, Academy premium, B2B) | — | **GIÀ FATTO** (posizionamento diverso: paghi l'intelligence, non lo sblocco dei prezzi) |
| 6 | Dati mercato / indici | Parziale ("Simulated Liv-ex Indices" dichiarati illustrativi + VinoInvest Index proprietario su catalogo interno) | Sì, è IL cuore dell'autorità | **FARE (dopo il lancio)**: già deciso in STATO_PROGETTO — dati reali Liv-ex (~€500/mese, membership "Data-only" con API verificata) quando ci sono budget/investitori |
| 7 | API/data feed per aziende | No (API pubblica dataset CSV/JSON limitata su /data) | Sì per il B2B (wealth manager) | **FARE DOPO** — coerente con dashboard B2B esistente, ma solo con dati reali sotto |
| 8 | Recensioni/critic score aggregati (W-S Aggregate Score: media Parker/Robinson/Spectator su scala 100) | Parziale (criticScore per vino nel DB, fonte da consolidare) | Il critico conta per l'investimento (Parker effect) | **FARE DOPO** (fonti possibili: Liv-ex Critic Data API a pagamento, o la stessa Wine Check API di W-S) |

**Sintesi verdetti:**
- **GIÀ FATTO** (non rifare, valorizzare): scanner etichette (#4), versione a
  pagamento (#5).
- **FARE ORA**: aggregazione offerte merchant via affiliazioni (#1) — è anche il
  Livello A del marketplace, 1–2 mesi.
- **FARE DOPO** (in quest'ordine): confronto rivenditori (#2, dopo i datafeed),
  alert su prezzi reali (#3) e indici reali (#6) quando c'è una fonte dati vera
  (Liv-ex Data-only o API W-S), API B2B propria (#7), critic score consolidato (#8).
- **NON FARE**: rincorrere W-S sull'ampiezza del price discovery consumer
  (18M offerte, 35k negozi: inseguirli lì è perso in partenza). La partita di
  VinoInvest è l'intelligence d'investimento sopra un catalogo curato + il canale
  di VENDITA della cantina (Livello B) che W-S non offre.

**Costi realistici (stime da validare):**
- #1/#2 Aggregazione offerte via affiliazioni: setup per-network (Awin/Webgains già
  strutturati), datafeed inclusi nei programmi → costo principale = tempo di
  integrazione (settimane, non mesi) + eventuale fee di ingresso network **[DA VERIFICARE per network]**.
- #3 Alert su dati reali e #6 indici reali: dipendono dall'accesso dati Liv-ex
  (membership Data-only: prezzo non pubblico, **[DA VERIFICARE con Liv-ex BD]**;
  ordine di grandezza già stimato in STATO_PROGETTO ~€500/mese).
- #4/#5: già a costo zero (fatti).

---

# PARTE 2 — FATTIBILITÀ MARKETPLACE (tre livelli)

## Livello A — AGGREGATORE con rinvio e affiliazioni
*L'utente trova il vino su VinoInvest, clicca "compra da…" e la transazione avviene dal merchant. VinoInvest incassa commissioni di affiliazione.*

### Partner reali verificati (programmi di affiliazione ESISTENTI)
| Partner | Network | Commissione | Note | Fonte |
|---|---|---|---|---|
| **Vino.com** | Awin (merchant 44705) | 6% standard | Spedisce IT+12 paesi UE/CH/Monaco, 8.000+ etichette. **TOP pick**: integrazione più semplice | ui.awin.com/merchant-profile/44705 |
| **XtraWine** | MyLead, FlexOffers, Sovrn + programma diretto | 8–12% sul diretto (varia molto per rete, es. ~2,6% MyLead DE) | Cookie 30–60gg, PPC aperta sul diretto | affi.io/m/xtrawine, flexoffers.com |
| **Tannico** | Webgains | % non pubblica [DA VERIFICARE] | AOV €130, cookie 30gg, datafeed giornaliero, 100k+ bottiglie | affi.io/m/tannico |
| **Bernabei** | Affi.io | % non pubblica [DA VERIFICARE] | Solo Italia, PPC chiusa, datafeed 24h | affi.io/m/bernabei-it |
| **Catawiki** (aste) | Partnerize, TradeTracker, FlexOffers | CPL: ~5,34 GBP/lead buyer, 8 GBP/lead seller | Copre il segmento aste/collezionismo; 12M visitatori/mese | catawiki.com/en/pages/p/partners-creators, flexoffers.com |
| Callmewine | — | Nessun programma pubblico trovato **[DA VERIFICARE contattandoli]** | 11.000+ etichette, partecipata Italmobiliare | — |
| iDealwine | — | **NESSUNA affiliazione pubblica** (solo programma fedeltà clienti 5%) | Resta rilevante per il Livello B | idealwine.com/en/help/faq |

**API**: nessun merchant italiano ha API pubblica; l'integrazione di catalogo/prezzi
avviene via **datafeed prodotto dei network di affiliazione** (aggiornamento
giornaliero) — sufficiente per l'aggregatore.

### Normativa (Livello A) — attrito MINIMO
- Non vendi, non tocchi il prodotto, non incassi → fuori da PSD2, accise, MVV, SCIA
  vendita alcolici, disciplina aste.
- Obblighi restanti: e-commerce/consumer (Codice del Consumo, D.Lgs. 70/2003, GDPR),
  pubblicità alcolici (L. 125/2001: tutela minori; Digital Chart IAP: trasparenza dei
  link affiliati/sponsorizzati), age-gating serio, policy dei canali ads (Google Ads
  ammette alcol con condizioni).
- [Fonti nel report normativo: ecommercelegale.it, dirittoaldigitale.com, support.google.com/adspolicy]

### Stima tempi (Livello A)
- Iscrizione network (Awin per Vino.com; Webgains per Tannico) + approvazioni: **1–3 settimane** (approvazione manuale dei merchant).
- Integrazione datafeed → matching col catalogo VinoInvest + bottone "Compra da…" multi-merchant: **2–4 settimane di sviluppo**.
- **Go-live realistico: 1–2 mesi.** È l'evoluzione naturale degli attuali link affiliati statici delle WineCard.

## Livello B — BROKER DI RICHIESTE
*L'utente carica la cantina (anche via scanner etichette esistente), il sistema invia la richiesta a partner multipli, le offerte arrivano in dashboard, la transazione si chiude presso il partner.*

### Partner candidati verificati
| Partner | Perché | Meccanica verificata | Fonte |
|---|---|---|---|
| **BordeauxIndex LiveTrade** | **Il più forte**: aperto ai privati, ZERO fee utente (margine nei prezzi, mostrato in chiaro), **UNICA piattaforma con API di automazione vera e senza licensing fee**, garanzie provenance (LiveTrade+ garantite con capitale proprio BI), pagamento 2–6 settimane | Richiede merce in bonded warehouse UK/EU (non obbligatorio il loro); min 1 cassa | bordeauxindex.com/livetrade + /faq + /automation |
| **Aste Bolaffi** | Partner italiano naturale per il conferimento fisico: valutazione GRATUITA via form online con foto / a domicilio in tutta Italia, dipartimento dedicato (vini@astebolaffi.it) | Commissioni venditore non pubbliche **[DA VERIFICARE]** | astebolaffi.it/it/cms/come-vendere |
| **iDealwine** | Bacino enorme (650k utenti registrati, €39,1M aggiudicato 2024), processo di stima strutturato (form/email/Excel a estimate@idealwine.com), spedisce in 40+ paesi | Commissione venditore 13% (+IVA=15,6%); buyer premium 25,8% IVA incl. (dal 27/03/2026); anche vendita a prezzo fisso "binding purchase" | idealwine.com/en/sell-my-wines |
| **WineOwners** | P2P per collezionisti, listing gratuito, commissioni basse (~2,5% buyer + 6,5% seller — dato 2015 **[DA VERIFICARE aggiornamento]**) | Aperto a venditori internazionali | decanter.com (2015), wineowners.com |
| **Pandolfini / Wannenes** | Case d'asta italiane con dipartimento vini attivo e stima preliminare via foto | Commissioni non pubbliche **[DA VERIFICARE]** | pandolfini.it, wannenesgroup.com |
| **Sotheby's / Christie's** | Canale premium per cantine di alto valore | Sotheby's: soglia minima ~$20.000, commissione venditore 0–18% + ~1% assicurazione, provenance obbligatoria. Mercato aste 2026 in raffreddamento (buyers' market) | sothebys.com/en/consign/wine, winespectator.com, artnews.com |

**DA ESCLUDERE** (verificato):
- **Vint**: in liquidazione volontaria da giugno 2026 (perdita netta 2025 ~$890k) — richmondbizsense.com 22/06/2026.
- **Cavex**: gravi segnalazioni pubbliche di pagamenti senza consegna sul forum wine-pages → rischio reputazionale.

### Normativa (Livello B) — attrito MEDIO, gestibile con 3 paletti
1. Restare **MEDIAZIONE** (artt. 1754 ss. c.c.): mettere in contatto e veicolare
   richieste/offerte, MAI condurre un'asta competitiva verso consumatori (il divieto
   art. 18 D.Lgs. 114/1998 sulle aste via internet verso consumatori è
   un'interpretazione consolidata — evitare meccaniche e lessico da "asta").
2. **MAI incassare i fondi**: pagamento diretto tra utente e partner (o via PSP del
   partner) → fuori dalla PSD2 senza bisogno dell'esenzione "agente commerciale"
   (che per i marketplace due-lati regge solo se non tocchi mai i fondi).
3. Spedizione/documenti (MVV-E, ICQRF) restano in capo allo speditore professionale:
   il flusso giusto è "il partner ritira/riceve la merce", non spedizioni privato→privato.
   Un privato non iscritto SIAN non può emettere MVV-E: per l'Italia il vino
   confezionato ≤60L che viaggia interamente in Italia può andare con documento
   fiscale, ma il cross-border UE richiede MVV-E → incanalare sempre su operatori.
4. Presidio **DAC7** (D.Lgs. 32/2023): comunicazione dati venditori oltre soglia
   (>30 vendite o >€2.000/anno) — obbligo della piattaforma **[DA VERIFICARE ambito
   esatto per il modello broker senza transazione on-site]**.
5. C2C: il venditore privato occasionale (cessione della propria cantina) è
   fiscalmente possibile (art. 67 TUIR); se ricorrente/organizzato → rischio
   riqualificazione a impresa. Ammettere privati per cessioni occasionali, operatori
   professionali per il resto.

### Stima tempi (Livello B)
- Accordi partner (2–3 partner iniziali: es. BordeauxIndex via API + Bolaffi via
  flusso email/form + iDealwine via processo di stima): **1–3 mesi** di sviluppo
  business + tecnico in parallelo.
- Prodotto: "carica cantina" (scanner + inserimento manuale) → richiesta multi-partner
  → dashboard offerte: **4–8 settimane di sviluppo** sopra le fondamenta esistenti
  (cellar /cellar e scanner /scan esistono già).
- Parere legale su mediazione/DAC7 PRIMA del lancio: **2–4 settimane** in parallelo.
- **Go-live realistico: 3–5 mesi.**

## Livello C — MARKETPLACE COMPLETO (transazione on-site)

### Fattibilità
Percorribile ma è il livello a massimo attrito. Vincoli emersi (tutti con fonte nel
report normativo):
- **Pagamenti**: mai incassare direttamente (PSD2 → servirebbe licenza IP/IMEL).
  Unica via: PSP marketplace-ready che segrega i fondi (Stripe Connect, Adyen for
  Platforms, Lemonway). ⚠️ **Mangopay esclude esplicitamente l'alcol B2C** (solo B2B)
  — la scelta del PSP condiziona il modello; policy alcol di Stripe/Adyen/Lemonway
  **[DA VERIFICARE con i rispettivi team compliance]**.
- **Chi è il venditore**: i titoli di vendita alcolici (SCIA, novità 2025: la vecchia
  licenza UTF è assorbita nella SCIA al SUAP — D.Lgs. 43/2025, Circ. ADM 13/2025)
  devono stare in capo ai merchant venditori; la piattaforma non deve diventare
  "esercente della vendita" **[DA VERIFICARE strutturazione contrattuale]**.
- **Accise**: vino fermo in Italia = accisa zero, ma la vendita a distanza a
  consumatori in altri paesi UE fa scattare accisa e IVA del paese di destino con
  rappresentante fiscale locale e cauzioni → **perimetrare le transazioni on-site
  all'Italia (e/o al B2B)** è la scelta che azzera il problema.
- **Niente aste on-site verso consumatori** (art. 18 D.Lgs. 114/1998 / art. 115 TULPS):
  eventuali meccaniche competitive solo B2B o come raccolta di proposte.
- **DAC7 + verifica età robusta** a carico della piattaforma.
- Nota trasversale: **niente frazionamento/tokenizzazione** — sposterebbe il progetto
  in ambito strumenti finanziari/MiCA (regime pesante). Il modello "bottiglie fisiche
  intere" resta fuori dal perimetro finanziario, coerente con la scelta
  subscription-only anti-MiFID già in STATO_PROGETTO.

### Stima tempi (Livello C)
- Solo DOPO il Livello B validato. Parere legale/fiscale dedicato + onboarding PSP
  (due diligence categoria alcol: settimane) + KYC venditori + logistica documentale:
  **6–12 mesi** dal via, con perimetro iniziale Italia/B2B.

## Raccomandazione operativa (sequenza)
1. **ORA → Livello A** (1–2 mesi): monetizza il traffico esistente, nessun nuovo
   rischio normativo, coerente con "l'utente non esce mai dalla piattaforma" (esce
   solo al click finale di acquisto, come oggi con i link affiliati — ma con offerte
   reali multi-merchant da datafeed).
2. **Poi → Livello B** (3–5 mesi): il vero differenziante vs Wine-Searcher post-
   acquisizione: "non solo dove comprare: ti aiutiamo a VENDERE la cantina" — con
   BordeauxIndex (API) + Bolaffi (Italia) + iDealwine (Francia/UE). Mediazione senza
   incasso fondi.
3. **Dopo, se i volumi lo giustificano → Livello C** con perimetro Italia/B2B e PSP
   marketplace verificato sul vino.

---

# PARTE 3 — Quick wins implementati (riferimento)
Vedi commit su branch `feature/quick-wins`: watchlist personale completa (pannello
nel tab Watchlist & Portfolio con prezzi/score/rischio dal catalogo) e confronto vini
potenziato (deep-link condivisibili /compare?ids=…, copy-link, critic score, mobile).
Niente alert prezzo nuovi: deliberato, finché non ci sono dati prezzo storici reali.

# PARTE 4 — SEO di intercettazione (riferimento)
Articoli blog IT+EN su "alternative a Wine-Searcher" / "Wine-Searcher vs piattaforme
investimento" — in pubblicazione con soli fatti verificati sull'acquisizione (fonti
nella Parte 1). Tono fattuale, zero denigrazione.
