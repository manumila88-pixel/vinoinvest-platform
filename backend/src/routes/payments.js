import express from "express";
import crypto from "crypto";
import Stripe from "stripe";
import { pool } from "../db/pool.js";

const router = express.Router();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" }) : null;

// Prezzi ufficiali per piano — il client NON decide l'importo (PayPal/crypto)
const PLAN_PRICES = {
  basic:        { monthly: 9,    annual: 86 },
  pro:          { monthly: 29,   annual: 278 },
  professional: { monthly: 500,  annual: 4800 },
  enterprise:   { monthly: 2000, annual: 19200 },
};

function isValidPlanAmount(plan, amount) {
  const p = PLAN_PRICES[plan];
  if (!p) return false;
  const n = Number(amount);
  return n === p.monthly || n === p.annual;
}

// ── Schema: subscriptions + audit log eventi ────────────────────────────────
let tablesReady = null;
function ensureTables() {
  if (!pool) return Promise.reject(new Error("DATABASE_URL not configured"));
  if (!tablesReady) {
    tablesReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          user_email TEXT PRIMARY KEY,
          plan TEXT NOT NULL,
          stripe_customer_id TEXT,
          stripe_session_id TEXT,
          stripe_subscription_id TEXT,
          status TEXT DEFAULT 'active',
          provider TEXT DEFAULT 'stripe',
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT`);
      await pool.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'`);
      await pool.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'stripe'`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(stripe_customer_id)`);
      // Audit log + idempotenza: ogni evento webhook viene registrato una sola volta
      await pool.query(`
        CREATE TABLE IF NOT EXISTS payment_events (
          id TEXT PRIMARY KEY,
          provider TEXT NOT NULL,
          type TEXT NOT NULL,
          customer_id TEXT,
          user_email TEXT,
          outcome TEXT,
          payload JSONB,
          received_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS paypal_orders (
          order_id TEXT PRIMARY KEY,
          plan TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          user_email TEXT,
          captured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
    })().catch((e) => { tablesReady = null; throw e; });
  }
  return tablesReady;
}

// Registra l'evento; ritorna false se già processato (idempotenza)
async function recordEvent(id, provider, type, customerId, email, outcome, payload) {
  const r = await pool.query(
    `INSERT INTO payment_events (id, provider, type, customer_id, user_email, outcome, payload)
     VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING RETURNING id`,
    [id, provider, type, customerId || null, email || null, outcome, payload ? JSON.stringify(payload) : null]
  );
  return r.rows.length > 0;
}

async function activateSubscription({ email, plan, customerId, sessionId, subscriptionId, provider = "stripe" }) {
  await pool.query(
    `INSERT INTO subscriptions (user_email, plan, stripe_customer_id, stripe_session_id, stripe_subscription_id, status, provider, active)
     VALUES ($1,$2,$3,$4,$5,'active',$6,true)
     ON CONFLICT (user_email) DO UPDATE SET
       plan = EXCLUDED.plan,
       stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
       stripe_session_id = COALESCE(EXCLUDED.stripe_session_id, subscriptions.stripe_session_id),
       stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id),
       status = 'active',
       provider = EXCLUDED.provider,
       active = true,
       updated_at = NOW()`,
    [email, plan, customerId || null, sessionId || null, subscriptionId || null, provider]
  );
}

// Expose test mode status
router.get("/stripe/mode", (req, res) => {
  const isTest = STRIPE_KEY.startsWith("sk_test_") || !STRIPE_KEY;
  res.json({ testMode: isTest, configured: !!STRIPE_KEY });
});

// ── Stripe: create checkout session ────────────────────────────────────────
router.post("/stripe/create-checkout", async (req, res) => {
  try {
    if (!STRIPE_KEY) return res.status(503).json({ error: "Pagamenti non configurati." });
    const { priceId, email, plan } = req.body;
    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return res.status(400).json({ error: "priceId non valido." });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Email non valida." });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      client_reference_id: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/pricing?success=1&plan=${encodeURIComponent(plan || "")}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=1`,
      metadata: { plan: plan || "pro", user_email: email },
      // Propaga il piano sulla subscription: gli eventi invoice/subscription lo vedono
      subscription_data: { metadata: { plan: plan || "pro", user_email: email } },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] create-checkout:", err.message);
    res.status(500).json({ error: "Errore nella creazione del checkout. Riprova." });
  }
});

// ── Stripe: webhook ─────────────────────────────────────────────────────────
// Copre TUTTO il ciclo di vita: attivazione, rinnovo, pagamento fallito
// (carta scaduta/insufficiente), aggiornamento stato, cancellazione.
// Idempotente (payment_events.id = event.id). In caso di errore DB risponde
// 500 così Stripe RITENTA la consegna invece di perdere l'evento.

// Stati Stripe subscription → accesso attivo?
// past_due resta attivo: Stripe ritenta l'addebito per giorni prima di chiudere.
const ACTIVE_STATUSES = ["active", "trialing", "past_due"];

async function syncSubscriptionFromStripe(sub) {
  const status = sub.status;
  const active = ACTIVE_STATUSES.includes(status);
  const plan = sub.metadata?.plan;
  const r = await pool.query(
    `UPDATE subscriptions SET
       active = $2,
       status = $3,
       plan = COALESCE($4, plan),
       stripe_subscription_id = $5,
       updated_at = NOW()
     WHERE stripe_customer_id = $1 OR stripe_subscription_id = $5
     RETURNING user_email`,
    [sub.customer, active, status, plan || null, sub.id]
  );
  return r.rows[0]?.user_email || null;
}

router.post("/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !stripe) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET o STRIPE_SECRET_KEY mancante — webhook rifiutato (fail closed)");
    return res.status(500).json({ error: "Webhook non configurato." });
  }

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error("[stripe] Firma webhook non valida:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    await ensureTables();

    // Idempotenza: se l'evento è già stato registrato, non riprocessare
    const obj = event.data.object;
    const emailHint = obj.customer_email || obj.customer_details?.email || obj.metadata?.user_email || null;
    const isNew = await recordEvent(event.id, "stripe", event.type, obj.customer || null, emailHint, "received", null);
    if (!isNew) {
      console.log(`[stripe] Evento duplicato ignorato: ${event.id} (${event.type})`);
      return res.json({ received: true, duplicate: true });
    }

    let outcome = "ignored";

    switch (event.type) {
      // Pagamento iniziale riuscito → attiva abbonamento
      case "checkout.session.completed": {
        const session = obj;
        const email = session.customer_email || session.customer_details?.email;
        const plan = session.metadata?.plan || "pro";
        if (!email) {
          console.error(`[stripe] checkout.session.completed senza email (session ${session.id})`);
          outcome = "error_no_email";
          break;
        }
        await activateSubscription({
          email,
          plan,
          customerId: session.customer,
          sessionId: session.id,
          subscriptionId: session.subscription,
        });
        outcome = `activated:${plan}`;
        console.log(`[stripe] Abbonamento attivato: ${email} → ${plan}`);
        break;
      }

      // Rinnovo riuscito → conferma attivo
      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = obj;
        const r = await pool.query(
          `UPDATE subscriptions SET active = true, status = 'active', updated_at = NOW()
           WHERE stripe_customer_id = $1 OR user_email = $2 RETURNING user_email`,
          [invoice.customer, invoice.customer_email || ""]
        );
        outcome = r.rows.length ? `renewed:${r.rows[0].user_email}` : "renewal_no_match";
        console.log(`[stripe] Rinnovo registrato per customer ${invoice.customer} (${outcome})`);
        break;
      }

      // Pagamento fallito (carta scaduta, fondi insufficienti) → past_due.
      // L'accesso resta attivo finché Stripe ritenta; la chiusura definitiva
      // arriva con customer.subscription.updated (unpaid/canceled) o .deleted.
      case "invoice.payment_failed": {
        const invoice = obj;
        const r = await pool.query(
          `UPDATE subscriptions SET status = 'past_due', updated_at = NOW()
           WHERE stripe_customer_id = $1 OR user_email = $2 RETURNING user_email`,
          [invoice.customer, invoice.customer_email || ""]
        );
        outcome = r.rows.length ? `past_due:${r.rows[0].user_email}` : "payment_failed_no_match";
        console.warn(`[stripe] Pagamento FALLITO per customer ${invoice.customer} (${outcome})`);
        break;
      }

      // Cambio stato (upgrade/downgrade, cancel_at_period_end, unpaid...)
      case "customer.subscription.updated": {
        const email = await syncSubscriptionFromStripe(obj);
        outcome = email ? `synced:${obj.status}:${email}` : "update_no_match";
        console.log(`[stripe] Subscription aggiornata: ${obj.id} → ${obj.status} (${outcome})`);
        break;
      }

      // Cancellazione definitiva → downgrade a free
      case "customer.subscription.deleted": {
        const sub = obj;
        const r = await pool.query(
          `UPDATE subscriptions SET active = false, status = 'canceled', updated_at = NOW()
           WHERE stripe_customer_id = $1 OR stripe_subscription_id = $2 RETURNING user_email`,
          [sub.customer, sub.id]
        );
        outcome = r.rows.length ? `canceled:${r.rows[0].user_email}` : "cancel_no_match";
        console.log(`[stripe] Abbonamento cancellato: customer ${sub.customer} (${outcome})`);
        break;
      }

      default:
        console.log(`[stripe] Evento non gestito: ${event.type}`);
    }

    await pool.query(`UPDATE payment_events SET outcome = $2 WHERE id = $1`, [event.id, outcome]).catch(() => {});
    res.json({ received: true });
  } catch (e) {
    // 500 → Stripe ritenta la consegna: l'evento non va perso
    console.error(`[stripe] Errore processando ${event.type} (${event.id}):`, e.message);
    res.status(500).json({ error: "Processing error" });
  }
});

// ── PayPal: get OAuth token ─────────────────────────────────────────────────
async function getPayPalToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
  const resp = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error("PayPal OAuth failed");
  return data.access_token;
}

// ── PayPal: create order ────────────────────────────────────────────────────
// L'importo viene validato contro il listino server-side: il client non può
// pagare €0.01 per un piano enterprise.
router.post("/paypal/create-order", async (req, res) => {
  try {
    const { amount, currency = "EUR", plan, email } = req.body;
    if (!isValidPlanAmount(plan, amount)) {
      return res.status(400).json({ error: "Piano o importo non valido." });
    }
    const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
    const token = await getPayPalToken();
    const resp = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: currency, value: String(Number(amount)) }, description: `VinoInvest ${plan}` }],
      }),
    });
    const order = await resp.json();
    if (!order.id) throw new Error(order.message || "PayPal order creation failed");

    // Memorizza piano/importo per l'attivazione al capture
    await ensureTables();
    await pool.query(
      `INSERT INTO paypal_orders (order_id, plan, amount, user_email) VALUES ($1,$2,$3,$4)
       ON CONFLICT (order_id) DO NOTHING`,
      [order.id, plan, Number(amount), email || null]
    );

    res.json({ id: order.id });
  } catch (err) {
    console.error("[paypal] create order:", err.message);
    res.status(500).json({ error: "Errore nella creazione dell'ordine PayPal. Riprova." });
  }
});

// ── PayPal: capture order ───────────────────────────────────────────────────
// A capture COMPLETED attiva l'abbonamento nel DB (prima non succedeva nulla:
// l'utente pagava ma restava free).
router.post("/paypal/capture-order", async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== "string") return res.status(400).json({ error: "orderId richiesto." });
    const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
    const token = await getPayPalToken();
    const resp = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const capture = await resp.json();

    if (capture.status === "COMPLETED") {
      try {
        await ensureTables();
        const r = await pool.query(`SELECT plan, user_email FROM paypal_orders WHERE order_id = $1`, [orderId]);
        const plan = r.rows[0]?.plan;
        const email = r.rows[0]?.user_email || capture.payer?.email_address;
        if (plan && email) {
          await activateSubscription({ email, plan, provider: "paypal" });
          await pool.query(`UPDATE paypal_orders SET captured = true WHERE order_id = $1`, [orderId]);
          await recordEvent(`paypal_${orderId}`, "paypal", "capture.completed", null, email, `activated:${plan}`, null);
          console.log(`[paypal] Abbonamento attivato: ${email} → ${plan}`);
        } else {
          console.error(`[paypal] Capture COMPLETED ma piano/email mancanti per ordine ${orderId}`);
        }
      } catch (e) {
        console.error("[paypal] Attivazione abbonamento fallita:", e.message);
      }
    }

    res.json(capture);
  } catch (err) {
    console.error("[paypal] capture:", err.message);
    res.status(500).json({ error: "Errore nella conferma del pagamento PayPal. Riprova." });
  }
});

// ── NOWPayments: create invoice ─────────────────────────────────────────────
router.post("/crypto/create-invoice", async (req, res) => {
  try {
    const { amount, plan, email } = req.body;
    if (!isValidPlanAmount(plan, amount)) {
      return res.status(400).json({ error: "Piano o importo non valido." });
    }
    if (!email || !String(email).includes("@")) {
      return res.status(400).json({ error: "Email non valida." });
    }
    const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NOWPAYMENTS_API_KEY || "",
      },
      body: JSON.stringify({
        price_amount: Number(amount),
        price_currency: "EUR",
        order_id: `${plan}|${email}`,
        order_description: `Abbonamento ${plan} — VinoInvest`,
        ipn_callback_url: `${process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com"}/api/payments/crypto/ipn`,
        success_url: `${process.env.FRONTEND_URL}/pricing?success=1&plan=${encodeURIComponent(plan)}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=1`,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || "NOWPayments error");
    res.json({ invoice_url: data.invoice_url, id: data.id });
  } catch (err) {
    console.error("[crypto] create invoice:", err.message);
    res.status(500).json({ error: "Errore nella creazione della fattura crypto. Riprova." });
  }
});

// ── NOWPayments: IPN callback ───────────────────────────────────────────────
// Prima mancava del tutto: i pagamenti crypto non attivavano mai l'abbonamento.
// Verifica HMAC-SHA512 con NOWPAYMENTS_IPN_SECRET (da impostare su Render).
router.post("/crypto/ipn", async (req, res) => {
  try {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      console.error("[crypto] NOWPAYMENTS_IPN_SECRET mancante — IPN rifiutato (fail closed)");
      return res.status(500).json({ error: "IPN not configured" });
    }
    const sig = req.headers["x-nowpayments-sig"];
    const sorted = JSON.stringify(req.body, Object.keys(req.body).sort());
    const expected = crypto.createHmac("sha512", secret).update(sorted).digest("hex");
    if (!sig || sig !== expected) {
      console.error("[crypto] Firma IPN non valida");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { payment_status, order_id, payment_id } = req.body;
    if (payment_status === "finished" && order_id) {
      const [plan, email] = String(order_id).split("|");
      if (PLAN_PRICES[plan] && email && email.includes("@")) {
        await ensureTables();
        await activateSubscription({ email, plan, provider: "crypto" });
        await recordEvent(`nowpay_${payment_id}`, "crypto", "payment.finished", null, email, `activated:${plan}`, null);
        console.log(`[crypto] Abbonamento attivato: ${email} → ${plan}`);
      }
    } else {
      console.log(`[crypto] IPN ricevuto: ${payment_status} (${payment_id})`);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error("[crypto] IPN error:", e.message);
    res.status(500).json({ error: "Processing error" });
  }
});

// Alias used by AcademyCourse.jsx: POST /api/payments/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    if (!STRIPE_KEY) return res.status(503).json({ error: "Pagamenti non configurati." });
    const { priceId, email, successUrl, cancelUrl, plan } = req.body;
    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return res.status(400).json({ error: "priceId non valido." });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      client_reference_id: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${process.env.FRONTEND_URL}/academy?subscribed=1`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/academy`,
      metadata: { plan: plan || "academy", user_email: email || "" },
      subscription_data: { metadata: { plan: plan || "academy", user_email: email || "" } },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] create-checkout-session:", err.message);
    res.status(500).json({ error: "Errore nella creazione del checkout. Riprova." });
  }
});

export default router;
