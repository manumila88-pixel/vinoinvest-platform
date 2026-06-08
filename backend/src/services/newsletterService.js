/**
 * Newsletter Service — weekly automated digest
 * Runs every Monday at 08:00 via node-cron
 */
import { sendPersonalizedNewsDigest } from "./emailService.js";
import { fetchRSSNews } from "./rssNewsService.js";

let pool;
let allWines = [];

export const setNewsletterPool = (p) => { pool = p; };
export const setNewsletterWines = (w) => { allWines = w; };

let cronJob = null;

export async function startNewsletterCron() {
  try {
    const cron = await import("node-cron");

    // Every Monday at 08:00
    cronJob = cron.schedule("0 8 * * 1", async () => {
      await runWeeklyNewsletter();
    }, { timezone: "Europe/Rome" });

    console.log("[newsletter] Weekly cron scheduled — Mondays 08:00 CET");
  } catch (e) {
    console.warn("[newsletter] node-cron not available:", e.message);
  }
}

export async function runWeeklyNewsletter() {
  if (!pool) {
    console.warn("[newsletter] No DB pool — skipping");
    return;
  }

  console.log("[newsletter] Starting weekly digest run...");

  try {
    // Fetch recent news
    const news = await fetchRSSNews().catch(() => []);
    const recentNews = Array.isArray(news) ? news.slice(0, 20) : [];

    // Get subscribed users
    const { rows: users } = await pool.query(`
      SELECT id, email, first_name, preferred_regions, preferred_types,
             notification_frequency, email_subscribed, language
      FROM users
      WHERE email_subscribed = true
        AND notification_frequency IN ('weekly', 'daily')
      LIMIT 1000
    `).catch(() => ({ rows: [] }));

    console.log(`[newsletter] Sending to ${users.length} users`);

    let sent = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Rate limit: max 1 email/day per user
        const { rows: recentEmails } = await pool.query(
          "SELECT id FROM email_events WHERE user_id = $1 AND sent_at > NOW() - INTERVAL '20 hours' LIMIT 1",
          [user.id]
        ).catch(() => ({ rows: [] }));

        if (recentEmails.length > 0) continue; // already sent today

        await sendPersonalizedNewsDigest(user, allWines, recentNews);

        // Log event
        await pool.query(
          "INSERT INTO email_events (user_id, email_type, sent_at) VALUES ($1, 'weekly_digest', NOW())",
          [user.id]
        ).catch(() => {});

        sent++;

        // Throttle: 10 emails/second max to avoid Resend rate limits
        if (sent % 10 === 0) await new Promise(r => setTimeout(r, 1000));

      } catch (userErr) {
        errors++;
        console.error("[newsletter] Error for user", user.email, userErr.message);
      }
    }

    console.log(`[newsletter] Weekly digest complete: ${sent} sent, ${errors} errors`);
    return { sent, errors };

  } catch (e) {
    console.error("[newsletter] Fatal error:", e.message);
    return { sent: 0, errors: 1 };
  }
}

// Re-engagement emails for inactive users (30+ days)
export async function runReEngagementCampaign() {
  if (!pool) return;

  try {
    const { rows: inactive } = await pool.query(`
      SELECT u.id, u.email, u.first_name
      FROM users u
      WHERE u.email_subscribed = true
        AND (u.last_login IS NULL OR u.last_login < NOW() - INTERVAL '30 days')
        AND NOT EXISTS (
          SELECT 1 FROM email_events ee
          WHERE ee.user_id = u.id
            AND ee.email_type = 're_engagement'
            AND ee.sent_at > NOW() - INTERVAL '15 days'
        )
      LIMIT 100
    `).catch(() => ({ rows: [] }));

    for (const user of inactive) {
      const firstName = user.first_name || user.email?.split("@")[0] || "Wine lover";
      const { sendEmail } = await import("./emailService.js");

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
          <div style="font-family:Georgia,serif;font-size:24px;font-weight:900;color:#020617;margin-bottom:16px">
            Vino<span style="color:#C9A227">Invest</span>
          </div>
          <h2>We miss you, ${firstName}! 🍷</h2>
          <p>It's been a while since you last visited VinoInvest. Here's what's new in the fine wine market:</p>
          <ul style="margin:16px 0;padding-left:20px">
            <li>Barolo 2019 prices up 12% this quarter</li>
            <li>New AI scoring system with 25% more accuracy</li>
            <li>Wine Cellar feature now live</li>
            <li>50,000+ wines tracked with real-time prices</li>
          </ul>
          <a href="https://vinoinvest-platform.vercel.app" style="display:inline-block;padding:12px 24px;background:#C9A227;color:#020617;border-radius:8px;font-weight:700;text-decoration:none">
            Come Back to VinoInvest →
          </a>
          <p style="font-size:11px;color:#888;margin-top:24px">
            <a href="https://vinoinvest-platform.vercel.app/unsubscribe?email=${encodeURIComponent(user.email)}">Unsubscribe</a>
            · VinoInvest · Milan, Italy
          </p>
        </div>
      `;

      await sendEmail(user.email, `${firstName}, see what's new in fine wine investing 🍷`, html).catch(() => {});

      await pool.query(
        "INSERT INTO email_events (user_id, email_type, sent_at) VALUES ($1, 're_engagement', NOW())",
        [user.id]
      ).catch(() => {});
    }

    console.log(`[newsletter] Re-engagement: ${inactive.length} emails sent`);
  } catch (e) {
    console.error("[newsletter] Re-engagement error:", e.message);
  }
}
