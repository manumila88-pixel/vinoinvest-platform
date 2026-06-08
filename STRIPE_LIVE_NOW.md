# URGENTE: Attiva Stripe Live Mode

> Senza Stripe live mode non puoi incassare nessun pagamento reale.
> Tempo stimato: 10-20 minuti.

---

## Step 1 — Completa verifica account Stripe (5-10 min)

1. Vai su **https://dashboard.stripe.com**
2. Accedi con il tuo account Stripe
3. Clicca sull'avviso in alto "Completa la verifica" (se presente)
4. Inserisci: dati personali, codice fiscale/P.IVA, IBAN per i pagamenti
5. Aspetta conferma (di solito immediata, max 24h)

---

## Step 2 — Copia la chiave API Live

1. Nel menu Stripe: **Sviluppatori → Chiavi API**
2. Assicurati di essere in modalità **Live** (toggle in alto a destra)
3. Copia `sk_live_...` (Chiave segreta)
4. Copia anche `pk_live_...` (Chiave pubblicabile) — serve per il frontend

---

## Step 3 — Configura webhook Stripe Live

1. Nel menu Stripe: **Sviluppatori → Webhook**
2. Clicca **Aggiungi endpoint**
3. URL: `https://vinoinvest-backend-2.onrender.com/api/payments/webhook`
4. Seleziona eventi:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Clicca **Aggiungi endpoint**
6. Copia il **Webhook signing secret** (`whsec_...`)

---

## Step 4 — Aggiorna variabili su Render.com

1. Vai su **https://render.com** → Dashboard
2. Seleziona il servizio **vinoinvest-backend-2**
3. Clicca **Environment**
4. Aggiorna/aggiungi queste variabili:

```
STRIPE_SECRET_KEY=sk_live_...     ← dalla Step 2
STRIPE_WEBHOOK_SECRET=whsec_...   ← dalla Step 3
STRIPE_PUBLISHABLE_KEY=pk_live_.. ← dalla Step 2 (opzionale per backend)
```

5. Clicca **Save Changes**
6. Il servizio si riavvia automaticamente (30-60 secondi)

---

## Step 5 — Aggiorna frontend su Vercel

1. Vai su **https://vercel.com** → Progetto vinoinvest-platform
2. **Settings → Environment Variables**
3. Aggiorna:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```
4. Rideploya: **Deployments → Redeploy**

---

## Step 6 — Test finale

1. Vai su vinoinvest-platform.vercel.app/pricing
2. Clicca su un piano e completa il pagamento con una carta reale
3. Controlla nel dashboard Stripe → Pagamenti che il pagamento appaia come **Riuscito**
4. Controlla che il webhook sia ricevuto correttamente (Stripe → Webhook → Log)

---

## Checklist

- [ ] Account Stripe verificato
- [ ] `sk_live_...` copiata e aggiornata su Render
- [ ] Webhook configurato su URL Render con `whsec_...`
- [ ] Frontend aggiornato con `pk_live_...` su Vercel
- [ ] Primo pagamento test riuscito

---

**Il primo pagamento reale è a portata di mano. Non rimandare.**

Supporto Stripe: https://support.stripe.com/
