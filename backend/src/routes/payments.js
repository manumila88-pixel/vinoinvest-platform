import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });

// ── Stripe: create checkout session ────────────────────────────────────────
router.post("/stripe/create-checkout", async (req, res) => {
  try {
    const { priceId, email, plan } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/pricing?success=1&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=1`,
      metadata: { plan },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Stripe: webhook ─────────────────────────────────────────────────────────
router.post("/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email;
    const plan = session.metadata?.plan || "pro";
    console.log("[stripe] checkout.session.completed:", email, plan);

    try {
      const { pool } = await import("../db/pool.js");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          user_email TEXT PRIMARY KEY,
          plan TEXT NOT NULL,
          stripe_customer_id TEXT,
          stripe_session_id TEXT,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      await pool.query(
        `INSERT INTO subscriptions (user_email, plan, stripe_customer_id, stripe_session_id)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_email) DO UPDATE SET
           plan = EXCLUDED.plan,
           stripe_session_id = EXCLUDED.stripe_session_id,
           active = true,
           updated_at = NOW()`,
        [email, plan, session.customer || null, session.id]
      );
      console.log("[stripe] Subscription saved:", email, plan);
    } catch (e) {
      console.error("[stripe] DB write failed:", e.message);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    try {
      const { pool } = await import("../db/pool.js");
      await pool.query(
        `UPDATE subscriptions SET active = false, updated_at = NOW()
         WHERE stripe_customer_id = $1`,
        [sub.customer]
      );
      console.log("[stripe] Subscription deactivated:", sub.customer);
    } catch (e) {
      console.error("[stripe] Deactivate failed:", e.message);
    }
  }

  res.json({ received: true });
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
  return data.access_token;
}

// ── PayPal: create order ────────────────────────────────────────────────────
router.post("/paypal/create-order", async (req, res) => {
  try {
    const { amount, currency = "EUR", plan } = req.body;
    const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
    const token = await getPayPalToken();
    const resp = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: currency, value: String(amount) }, description: `VinoInvest ${plan}` }],
      }),
    });
    const order = await resp.json();
    res.json({ id: order.id });
  } catch (err) {
    console.error("PayPal create order error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── PayPal: capture order ───────────────────────────────────────────────────
router.post("/paypal/capture-order", async (req, res) => {
  try {
    const { orderId } = req.body;
    const base = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
    const token = await getPayPalToken();
    const resp = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const capture = await resp.json();
    res.json(capture);
  } catch (err) {
    console.error("PayPal capture error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── NOWPayments: create invoice ─────────────────────────────────────────────
router.post("/crypto/create-invoice", async (req, res) => {
  try {
    const { amount, plan, email } = req.body;
    const resp = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NOWPAYMENTS_API_KEY || "",
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "EUR",
        order_description: `Abbonamento ${plan} — VinoInvest`,
        success_url: `${process.env.FRONTEND_URL}/pricing?success=1&plan=${plan}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=1`,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || "NOWPayments error");
    res.json({ invoice_url: data.invoice_url, id: data.id });
  } catch (err) {
    console.error("NOWPayments invoice error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
