import express from "express";
import Stripe from "stripe";
import coinbase from "coinbase-commerce-node";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });

const { Client, resources } = coinbase;
const { Charge } = resources;

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
    console.log("Subscription activated:", session.customer_email, session.metadata?.plan);
    // TODO: upsert into Supabase subscriptions table
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

// ── Coinbase Commerce: create charge ────────────────────────────────────────
router.post("/coinbase/create-charge", async (req, res) => {
  try {
    Client.init(process.env.COINBASE_COMMERCE_API_KEY || "");
    const { amount, plan, email } = req.body;
    const charge = await Charge.create({
      name: `VinoInvest ${plan}`,
      description: `Abbonamento ${plan} — VinoInvest`,
      local_price: { amount: String(amount), currency: "EUR" },
      pricing_type: "fixed_price",
      metadata: { plan, email },
      redirect_url: `${process.env.FRONTEND_URL}/pricing?success=1&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=1`,
    });
    res.json({ hosted_url: charge.hosted_url, id: charge.id });
  } catch (err) {
    console.error("Coinbase charge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
