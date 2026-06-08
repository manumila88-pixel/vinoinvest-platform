# Stripe Live Mode Setup — VinoInvest

## Overview

VinoInvest uses Stripe for subscription payments. Currently running in **test mode**.
Follow these steps to switch to **live mode** and accept real payments.

---

## Step 1: Activate Stripe Account

1. Log in at https://dashboard.stripe.com
2. Complete account activation:
   - Business information (legal name, address)
   - Bank account for payouts
   - Tax information (Partita IVA for Italian businesses)
3. Submit for review — usually approved in 1–2 business days

---

## Step 2: Create Live Products & Price IDs

In Stripe Dashboard → **Products** → **Add product**:

| Plan | Price (Monthly) | Price (Annual) | 
|------|----------------|----------------|
| Investor | €9.99/month | €95.99/year |
| Professional | €29.99/month | €287.99/year |
| Academy Investor | €9.99/month | €95.99/year |
| Academy Pro | €19.99/month | €191.99/year |

After creating, copy the `price_XXXX` IDs.

---

## Step 3: Update Price IDs in Code

Edit `frontend/src/pages/Pricing.jsx` — replace test price IDs:

```js
// Replace these test IDs with live IDs from Step 2
const PLANS = [
  {
    id: "investor",
    stripePriceMonthly: "price_LIVE_MONTHLY_ID",
    stripePriceAnnual: "price_LIVE_ANNUAL_ID",
    ...
  },
  ...
];
```

Also update `frontend/src/pages/AcademyCourse.jsx`:
```js
const ACADEMY_PLANS = {
  ACADEMY_INVESTOR: { monthly: "price_LIVE_ACADEMY_INVESTOR", annual: "price_LIVE_ACADEMY_ANNUAL", ... },
  ACADEMY_PRO:      { monthly: "price_LIVE_ACADEMY_PRO", annual: "price_LIVE_ACADEMY_PRO_ANNUAL", ... },
};
```

---

## Step 4: Update Environment Variables

### On Render (Backend)

1. Go to Render Dashboard → **vinoinvest-backend** → **Environment**
2. Update:
   ```
   STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXX
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX (from Step 5)
   ```

### On Vercel (Frontend)

1. Go to Vercel Dashboard → **vinoinvest-platform** → **Settings** → **Environment Variables**
2. Update or add:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXX
   ```

---

## Step 5: Set Up Live Webhooks

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://vinoinvest-backend-2.onrender.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing secret** (`whsec_...`) → set as `STRIPE_WEBHOOK_SECRET`

---

## Step 6: Test Live Mode

Before going fully live, test with a real card:
```bash
# Check Stripe mode endpoint
curl https://vinoinvest-backend-2.onrender.com/api/payments/stripe/mode
# Should return: {"mode":"live","publishable_key":"pk_live_..."}
```

Make a real purchase of €1 minimum (or use Stripe's test live cards).

---

## Step 7: Set Up Stripe Tax (Optional but Recommended)

1. Stripe Dashboard → **Tax** → Enable
2. Configure:
   - VAT for EU customers (IVA 22% for Italy)
   - Tax registration for countries you operate in

---

## Step 8: PayPal Live Mode

Also update in Render environment:
```
PAYPAL_CLIENT_ID=<live client ID from developer.paypal.com>
PAYPAL_CLIENT_SECRET=<live secret>
PAYPAL_MODE=live  (currently: sandbox)
```

---

## Checklist

- [ ] Stripe account activated with bank details
- [ ] Live products and price IDs created
- [ ] Frontend price IDs updated in Pricing.jsx and AcademyCourse.jsx  
- [ ] `STRIPE_SECRET_KEY` updated to `sk_live_...` on Render
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` updated to `pk_live_...` on Vercel
- [ ] Webhook endpoint created with correct events
- [ ] `STRIPE_WEBHOOK_SECRET` updated with `whsec_...`
- [ ] Test purchase completed successfully
- [ ] PayPal updated to live mode

---

## Key URLs

| Resource | URL |
|----------|-----|
| Stripe Dashboard | https://dashboard.stripe.com |
| Render (Backend) | https://dashboard.render.com |
| Vercel (Frontend) | https://vercel.com/dashboard |
| Webhook tester | https://dashboard.stripe.com/webhooks |
