/**
 * Demo request handler — sends email notification + auto-confirmation.
 */
import { Router } from "express";
import { sendWelcomeEmail } from "../services/emailService.js";
import { SITE_URL, SITE_HOST } from "../config/site.js";

async function sendEmail({ to, subject, html }) {
  const nodemailer = await import("nodemailer").catch(() => null);
  if (!nodemailer) return;
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.sendgrid.net",
    port: 587,
    auth: { user: process.env.SMTP_USER || "apikey", pass: process.env.SENDGRID_API_KEY || process.env.SMTP_PASS || "" },
  });
  await transporter.sendMail({ from: process.env.FROM_EMAIL || "noreply@vinoinvest.com", to, subject, html });
}

const router = Router();
let _pool = null;
export function setDemoPool(pool) { _pool = pool; }

async function ensureDemoTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS demo_requests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT NOT NULL,
      role TEXT,
      aum_estimate TEXT,
      message TEXT,
      source TEXT DEFAULT 'b2b',
      status TEXT DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

router.post("/", async (req, res) => {
  const { name, company, email, role, aum_estimate, message, source } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email required" });

  try {
    if (_pool) {
      await ensureDemoTable(_pool);
      await _pool.query(
        `INSERT INTO demo_requests(name,company,email,role,aum_estimate,message,source)
         VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [name, company, email, role, aum_estimate, message, source || "b2b"]
      );
    }

    // Notify sales team
    await sendEmail({
      to: "manumila88@gmail.com",
      subject: `[VinoInvest] Nuova Demo Request — ${company || name}`,
      html: `
        <h2>Nuova richiesta demo</h2>
        <table>
          <tr><td><strong>Nome:</strong></td><td>${name}</td></tr>
          <tr><td><strong>Azienda:</strong></td><td>${company || "—"}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Ruolo:</strong></td><td>${role || "—"}</td></tr>
          <tr><td><strong>AUM Wine Stimato:</strong></td><td>${aum_estimate || "—"}</td></tr>
          <tr><td><strong>Messaggio:</strong></td><td>${message || "—"}</td></tr>
          <tr><td><strong>Fonte:</strong></td><td>${source || "b2b"}</td></tr>
        </table>
        <p><a href="${SITE_URL}/b2b">Apri dashboard B2B</a></p>
      `,
    }).catch(() => {});

    // Auto-confirmation to prospect
    await sendEmail({
      to: email,
      subject: "VinoInvest — Richiesta demo ricevuta",
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0b1220;color:#e2e8f0;padding:40px;border-radius:16px">
          <div style="font-size:28px;font-weight:700;margin-bottom:8px;color:#60a5fa">🍷 VinoInvest</div>
          <h2 style="color:#e2e8f0;margin-top:0">Ciao ${name},</h2>
          <p style="color:#94a3b8;line-height:1.7">
            Abbiamo ricevuto la tua richiesta di demo. Il nostro team ti contatterà entro <strong style="color:#60a5fa">24 ore lavorative</strong>.
          </p>
          <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:24px;margin:24px 0">
            <p style="color:#94a3b8;margin:0 0 12px;font-size:14px"><strong style="color:#e2e8f0">Cosa aspettarti dalla demo:</strong></p>
            <ul style="color:#94a3b8;font-size:14px;line-height:2;padding-left:20px;margin:0">
              <li>Tour personalizzato della dashboard B2B</li>
              <li>Configurazione portfolio clienti</li>
              <li>Demo report PDF professionale</li>
              <li>Integrazione API e export Bloomberg</li>
              <li>Pricing personalizzato per la tua organizzazione</li>
            </ul>
          </div>
          <p style="color:#475569;font-size:13px">
            Nel frattempo, puoi esplorare la piattaforma consumer su
            <a href="${SITE_URL}" style="color:#60a5fa">${SITE_HOST}</a>
          </p>
          <hr style="border-color:rgba(59,130,246,0.1);margin:24px 0">
          <p style="color:#1e3a5f;font-size:12px">VinoInvest · Il Bloomberg Terminal per il Fine Wine · sales@vinoinvest.com</p>
        </div>
      `,
    }).catch(() => {});

    res.json({ ok: true, message: "Demo request received. We'll contact you within 24h." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Follow-up check (cron or manual trigger)
router.get("/pending", async (req, res) => {
  if (!_pool) return res.json([]);
  try {
    await ensureDemoTable(_pool);
    const { rows } = await _pool.query(
      `SELECT * FROM demo_requests WHERE status='new' AND created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
