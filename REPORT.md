# REPORT: fix/academy-blog-numeri-inventati

**Data:** 2026-06-15  
**Branch:** `fix/academy-blog-numeri-inventati`  
**Obiettivo:** Rimozione di tutti i numeri/percentuali inventati, rendimenti specifici e citazioni di fonti non verificabili dai contenuti Academy e Blog.

---

## Regola applicata

> Solo dove un dato viene REALMENTE dal nostro DB può restare.  
> Tutto il resto: spiegare il MECCANISMO senza sparare numeri precisi non verificabili.

Sostituzioni sistematiche:
- **Percentuali di rendimento inventate** → descrizione qualitativa del meccanismo
- **`Fonte: Liv-ex Annual Report 2024`** su performance specifiche → rimosso / redirect a Liv-ex come fonte primaria
- **Casi studio con prezzi fabricati** → `ESEMPIO ILLUSTRATIVO (ipotetico)` oppure rimosso
- **Domande quiz su cifre specifiche** → domande sul meccanismo sottostante

---

## File modificati

### 1. `frontend/src/data/premiumContent.js`
**Moduli:** rs_01 – rs_20 (20 moduli totali)

**Rimosso:**
- `+13.6%/anno` (vino vs oro/S&P500) — era attribuito a "Fonte: Liv-ex Annual Report 2024"
- `+9.8%` (oro), `+8.1%` (S&P500) — dati inventati attribuiti a Liv-ex
- `+187% vs +62%` Liv-ex 1000 vs S&P500 su 10 anni
- `+124% in 10 anni`, `+218% in 15 anni` — rendimenti storici fabricati
- `Fonte: Liv-ex Annual Report 2024` — citazione falsa ricorrente su 8+ slide
- Case study con prezzi di acquisto/vendita specifici → `roi: "Esempio illustrativo"`
- `hero.stat` con percentuali di rendimento → descrizioni qualitative
- Quiz: domande "qual è il rendimento medio del vino (+X%)?" → domande sul meccanismo

---

### 2. `frontend/src/data/academyContent.js`
**~40 modifiche**

**Rimosso:**
- `+12% medio annuo 10 anni`, `+18% top domaine`, `+8% solido` — rendimenti inventati
- `+22% negli ultimi 5 anni` (Champagne) — fabricato
- Case study Barolo Monfortino: `€120 → €420, ROI +250%` → meccanismo
- `+35% Borgogna in 5 anni`, `+18% crescita` — rimosso
- Quiz con `+1.400%`, `+600%+`, `+180%+`, `+200%+` come opzioni di risposta → riformulate

---

### 3. `frontend/src/data/premiumModulesConsumer.js`
**~35+ modifiche, 58 label "Esempio illustrativo (ipotetico)" aggiunte**

**Rimosso:**
- Caso studio Philip Moulin con rendimenti specifici — rimosso
- Numeri Bank of China Wealth Management — rimosso
- Probabilità Monte Carlo: `91.3%`, `84.7%` → qualitativo
- Traiettorie prezzi: d'Yquem, Tokaj, Egon Müller, Avignonesi con £/€ specifici → rimosso
- `Cult Wines 13.7% vs 9.8%` — confronto rendimento inventato → rimosso
- `rendimento atteso 10-14%/y` (Borgogna entry level) → "liquidità crescente sul mercato secondario"
- `Fonte: Liv-ex Annual Report 2024` come fonte per performance → rimosso o redirect

---

### 4. `frontend/src/data/premiumModules.js`
**File da 3543 righe — pulizia completa**

**Rimosso:**
- `11.4%/anno` return claim con Sharpe miglioramento `18-22%`
- Allocazione tangency portfolio `12-18%` con correlazione `0.3` e dev. standard `12% vs 18% S&P500`
- Slide B2B duplicata con stessi numeri fabricati
- China boom-bust con numeri specifici
- Best trades decade: Pétrus 2000, DRC RC 2005, Sassicaia 2015 con traiettorie £ specifiche → rimosso

---

### 5. `frontend/src/data/premiumModulesB2B.js`
**25 modifiche**

**Rimosso (slide core B2B):**
```
"Dati chiave per il 2024 (fonte: Liv-ex, Knight Frank Wealth Report):
  Liv-ex 100 = +8.7% lordo / Liv-ex 1000 = +9.1% lordo
  Volatilità 6-8% / Sharpe 0.6-0.8 / Correlazione +0.15 / Drawdown -12%"
```
→ Meccanismo strutturale + redirect a Liv-ex Market Intelligence come fonte primaria

- Factor Analysis premium inventati: `+2.8%`, `+3.2%`, `+4.1%`, `+2.1%` → meccanismi

---

### 6. `frontend/src/data/premiumModulesB2B_b.js`
**8 modifiche**

**Rimosso:**
- `CAGR 6.8%` — rendimento specifico senza fonte verificabile
- Case study Margaux 2015: `£12.500 → £16.200` con factor scores inventati
- `rendimento atteso 6-8%` — range inventato

---

### 7. `frontend/src/data/faq.js`

**Rimosso:**
- `DRC Romanée-Conti 2000 costava €2.000 → oggi €30.000 (+1.400%)` → qualitativo
- `Krug Vintage e Dom Pérignon si apprezzano del 5-8% annuo` → qualitativo
- `Salon ha reso oltre il 15% annuo nell'ultimo decennio` → qualitativo

---

### 8. `frontend/src/pages/CaseStudies.jsx`

**Rimosso:**
- `+14.2%` return con riga benchmark, Sharpe 1.2, Alpha row
- `+13.6%` return con Sharpe 1.4, max drawdown `-6.2%`
- Disclaimer: `"Dati storici verificati"` → `"Scenario illustrativo — dati non verificati"`

---

### 9. `frontend/src/pages/Learn.jsx`

**Rimosso:**
- `"Knight Frank Luxury Investment Index mostra rendimenti medi del 10-12% annuo"` → meccanismo decorrelazione
- `"Liv-ex Fine Wine 100: +127% in 10 anni (2014-2024)"` → riferimento a Liv-ex senza cifre fabricate
- Quiz Q3: domanda sul numero Knight Frank → domanda sul meccanismo

---

### 10. `frontend/src/pages/Methodology.jsx`

**Rimosso:**
- Esempio score: `"(Liv-ex +14.2% 12m, volume above avg → 92)"` → `"(trend di mercato positivo, volume above avg → 92)"`
- Tabella accuracy con righe inventate: `83.1%`, `85.7%`, `82.5%`, `84.8%`, `85.9%` → `"[dati interni]"`

---

### 11. `frontend/src/pages/AcademyTemplates.jsx`

**Rimosso:**
- `"Liv-ex 1000 CAGR 2004–2024: ~10% p.a. lordo (fonte: Liv-ex)"` → `"ESEMPIO ILLUSTRATIVO"` con placeholder `X%`
- Esempio Sharpe con `9.2% annuo` → placeholder `X%/Y%/Z%` con label `ESEMPIO ILLUSTRATIVO`

---

## Articoli Blog (99 articoli) — PULITI

Tutti i 99 articoli blog sono stati scansionati. I match trovati erano esclusivamente:
- Percentuali di conservazione fisica (temperatura, umidità)
- Range di commissioni d'asta (tipici del settore, non rendimenti inventati)
- Nessun rendimento storico inventato, nessuna "Fonte: Liv-ex Annual Report" per performance

**Esito: nessuna modifica necessaria agli articoli blog.**

---

## Cosa è stato mantenuto

- Citazioni accademiche verificabili: Masset & Henderson (2010, Journal of Wine Economics), Markowitz (1952), Merton (1972), Sharpe (1994)
- Descrizioni operative del settore (fee structure auction house, soglie KYC, fiscalità)
- Riferimenti a Liv-ex come piattaforma dove verificare i dati, senza citare cifre specifiche come nostre
- Dati dal nostro DB (prezzi correnti, investment score algoritmico) — indicati come tali

---

## Principio guida post-fix

> Il vino è storicamente un asset decorrelato dai mercati azionari e a bassa volatilità **per ragioni strutturali** (offerta anelastica, domanda crescente, invecchiamento). Per dati di performance specifici, l'utente viene indirizzato a fonti primarie verificabili: Liv-ex.com, IWSR, letteratura accademica peer-reviewed.
