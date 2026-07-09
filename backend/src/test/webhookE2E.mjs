/**
 * Test E2E webhook Stripe — richiede server locale attivo (PORT=3399) e
 * STRIPE_WEBHOOK_SECRET in .env. Firma eventi finti con generateTestHeaderString
 * e verifica il ciclo completo: attivazione → idempotenza → payment_failed →
 * rinnovo → unpaid (downgrade) → cancellazione.
 * Uso: node src/test/webhookE2E.mjs
 * Poi rimuovere da subscriptions/payment_events le righe e2e-test-webhook@ / evt_e2e_%.
 * NON gira in CI (richiede server + DB).
 */
import "dotenv/config";
import Stripe from "stripe";

const secret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", { apiVersion: "2023-10-16" });
const URL = "http://localhost:3399/api/payments/stripe/webhook";
const EMAIL = "e2e-test-webhook@vinoinvest-test.local";

async function send(event) {
  const payload = JSON.stringify(event);
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret });
  const r = await fetch(URL, { method: "POST", headers: { "Content-Type": "application/json", "stripe-signature": sig }, body: payload });
  return { status: r.status, body: await r.json() };
}

const base = (id, type, object) => ({ id, object: "event", type, data: { object }, created: Math.floor(Date.now() / 1000) });

// 1. checkout completato → attivazione
console.log("1 checkout.session.completed:", await send(base("evt_e2e_1", "checkout.session.completed", {
  id: "cs_e2e_1", customer: "cus_e2e_1", customer_email: EMAIL, subscription: "sub_e2e_1", metadata: { plan: "pro" },
})));

// 2. duplicato → idempotenza
console.log("2 duplicato:", await send(base("evt_e2e_1", "checkout.session.completed", {
  id: "cs_e2e_1", customer: "cus_e2e_1", customer_email: EMAIL, subscription: "sub_e2e_1", metadata: { plan: "pro" },
})));

const check = async (label) => {
  const r = await fetch(`http://localhost:3399/api/subscriptions/status?email=${EMAIL}`);
  console.log(label, await r.json());
};
await check("   stato dopo attivazione:");

const acc = await fetch(`http://localhost:3399/api/academy/access?email=${EMAIL}&courseLevel=professional`);
console.log("   accesso corso pro:", await acc.json());

// 3. pagamento fallito → past_due (accesso resta durante i retry Stripe)
console.log("3 invoice.payment_failed:", await send(base("evt_e2e_2", "invoice.payment_failed", {
  id: "in_e2e_1", customer: "cus_e2e_1", customer_email: EMAIL,
})));
await check("   stato dopo failed:");

// 4. rinnovo riuscito → di nuovo active
console.log("4 invoice.payment_succeeded:", await send(base("evt_e2e_3", "invoice.payment_succeeded", {
  id: "in_e2e_2", customer: "cus_e2e_1", customer_email: EMAIL,
})));
await check("   stato dopo rinnovo:");

// 5. subscription.updated con status unpaid → downgrade
console.log("5 subscription.updated(unpaid):", await send(base("evt_e2e_4", "customer.subscription.updated", {
  id: "sub_e2e_1", customer: "cus_e2e_1", status: "unpaid", metadata: { plan: "pro" },
})));
await check("   stato dopo unpaid:");

// 6. riattivo e poi cancello definitivamente
await send(base("evt_e2e_5", "customer.subscription.updated", { id: "sub_e2e_1", customer: "cus_e2e_1", status: "active", metadata: { plan: "pro" } }));
console.log("6 subscription.deleted:", await send(base("evt_e2e_6", "customer.subscription.deleted", {
  id: "sub_e2e_1", customer: "cus_e2e_1", status: "canceled",
})));
await check("   stato dopo cancellazione:");
const acc2 = await fetch(`http://localhost:3399/api/academy/access?email=${EMAIL}&courseLevel=professional`);
console.log("   accesso corso dopo cancellazione:", await acc2.json());
