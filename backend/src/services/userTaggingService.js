/**
 * User Tagging Service — behavioral segmentation
 * Analyzes user behavior hourly and assigns/updates tags.
 * Tags drive homepage personalization, email tone, push, and upgrade CTAs.
 *
 * Tags:
 *   high_value_interest   — views wines >€500
 *   b2b_interest          — reads B2B articles
 *   education_focused     — completes Academy courses
 *   active_investor       — portfolio >5 wines
 *   price_sensitive       — many active alerts
 *   mobile_first          — primarily accesses via mobile
 *   social_sharer         — shares portfolio
 *   calculator_user       — uses investment calculator
 */

import cron from "node-cron";

let pool = null;
export function setUserTaggingPool(p) { pool = p; }

// ── DB ────────────────────────────────────────────────────────────────────────

export async function ensureUserTagTables() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_tags (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      tag VARCHAR(50) NOT NULL,
      score INTEGER DEFAULT 1,
      first_seen TIMESTAMPTZ DEFAULT NOW(),
      last_seen TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, tag)
    )
  `).catch(() => {});

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_events (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      metadata JSONB DEFAULT '{}',
      occurred_at TIMESTAMPTZ DEFAULT NOW()
    )
  `).catch(() => {});

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ut_user ON user_tags(user_id)`).catch(() => {});
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ut_tag ON user_tags(tag)`).catch(() => {});
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ue_user_type ON user_events(user_id, event_type)`).catch(() => {});
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_ue_occurred ON user_events(occurred_at)`).catch(() => {});

  console.log("[userTagging] Tables ready");
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

async function q(sql, params = []) {
  try { return await pool.query(sql, params); }
  catch (_) { return { rows: [], rowCount: 0 }; }
}

async function upsertTag(userId, tag, delta = 1) {
  await q(`
    INSERT INTO user_tags (user_id, tag, score, first_seen, last_seen)
    VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (user_id, tag) DO UPDATE
      SET score = user_tags.score + $3,
          last_seen = NOW()
  `, [userId, tag, delta]);
}

async function removeTag(userId, tag) {
  await q(`DELETE FROM user_tags WHERE user_id=$1 AND tag=$2`, [userId, tag]);
}

// ── TAG ANALYZERS ─────────────────────────────────────────────────────────────

async function analyzeHighValueInterest(userId) {
  // User viewed wines priced >€500 in last 30 days
  const { rows } = await q(`
    SELECT COUNT(*) FROM user_events ue
    JOIN wines w ON w.id = (ue.metadata->>'wine_id')
    WHERE ue.user_id = $1
      AND ue.event_type = 'wine_view'
      AND ue.occurred_at > NOW() - INTERVAL '30 days'
      AND w.current_price > 500
  `, [userId]);

  const count = parseInt(rows[0]?.count || 0);
  if (count >= 3) await upsertTag(userId, 'high_value_interest', count);
  else await removeTag(userId, 'high_value_interest');
}

async function analyzeB2BInterest(userId) {
  const { rows } = await q(`
    SELECT COUNT(*) FROM user_events
    WHERE user_id = $1
      AND event_type IN ('blog_view', 'article_read')
      AND metadata->>'persona' IN ('wealth', 'cantina')
      AND occurred_at > NOW() - INTERVAL '30 days'
  `, [userId]);

  const count = parseInt(rows[0]?.count || 0);
  if (count >= 2) await upsertTag(userId, 'b2b_interest', count);
  else await removeTag(userId, 'b2b_interest');
}

async function analyzeEducationFocused(userId) {
  const { rows } = await q(`
    SELECT COUNT(*) FROM user_events
    WHERE user_id = $1
      AND event_type IN ('course_started', 'course_completed', 'module_completed')
      AND occurred_at > NOW() - INTERVAL '60 days'
  `, [userId]);

  const count = parseInt(rows[0]?.count || 0);
  if (count >= 2) await upsertTag(userId, 'education_focused', count);
  else await removeTag(userId, 'education_focused');
}

async function analyzeActiveInvestor(userId) {
  const { rows } = await q(
    `SELECT COUNT(*) FROM orders WHERE user_id = $1`,
    [userId]
  );
  const count = parseInt(rows[0]?.count || 0);
  if (count >= 5) await upsertTag(userId, 'active_investor', count);
  else await removeTag(userId, 'active_investor');
}

async function analyzePriceSensitive(userId) {
  const { rows } = await q(`
    SELECT COUNT(*) FROM user_events
    WHERE user_id = $1
      AND event_type IN ('alert_set', 'alert_triggered')
      AND occurred_at > NOW() - INTERVAL '30 days'
  `, [userId]);

  const count = parseInt(rows[0]?.count || 0);
  if (count >= 5) await upsertTag(userId, 'price_sensitive', count);
  else await removeTag(userId, 'price_sensitive');
}

async function analyzeMobileFirst(userId) {
  const { rows } = await q(`
    SELECT
      SUM(CASE WHEN metadata->>'device' = 'mobile' THEN 1 ELSE 0 END) AS mobile,
      COUNT(*) AS total
    FROM user_events
    WHERE user_id = $1
      AND occurred_at > NOW() - INTERVAL '30 days'
      AND metadata->>'device' IS NOT NULL
  `, [userId]);

  const mobile = parseInt(rows[0]?.mobile || 0);
  const total = parseInt(rows[0]?.total || 0);
  if (total > 0 && mobile / total >= 0.6) await upsertTag(userId, 'mobile_first', mobile);
  else await removeTag(userId, 'mobile_first');
}

async function analyzeSocialSharer(userId) {
  const { rows } = await q(`
    SELECT COUNT(*) FROM user_events
    WHERE user_id = $1
      AND event_type = 'portfolio_shared'
      AND occurred_at > NOW() - INTERVAL '90 days'
  `, [userId]);

  const count = parseInt(rows[0]?.count || 0);
  if (count >= 1) await upsertTag(userId, 'social_sharer', count);
  else await removeTag(userId, 'social_sharer');
}

async function analyzeCalculatorUser(userId) {
  const { rows } = await q(`
    SELECT COUNT(*) FROM user_events
    WHERE user_id = $1
      AND event_type = 'calculator_used'
      AND occurred_at > NOW() - INTERVAL '30 days'
  `, [userId]);

  const count = parseInt(rows[0]?.count || 0);
  if (count >= 2) await upsertTag(userId, 'calculator_user', count);
  else await removeTag(userId, 'calculator_user');
}

// ── CORE LOOP ─────────────────────────────────────────────────────────────────

export async function analyzeUserTags(userId) {
  if (!pool) return;
  await Promise.allSettled([
    analyzeHighValueInterest(userId),
    analyzeB2BInterest(userId),
    analyzeEducationFocused(userId),
    analyzeActiveInvestor(userId),
    analyzePriceSensitive(userId),
    analyzeMobileFirst(userId),
    analyzeSocialSharer(userId),
    analyzeCalculatorUser(userId),
  ]);
}

export async function runHourlyTagging() {
  if (!pool) return;
  try {
    const { rows: users } = await q(`
      SELECT DISTINCT user_id FROM user_events
      WHERE occurred_at > NOW() - INTERVAL '2 hours'
    `);

    let processed = 0;
    for (const { user_id } of users) {
      await analyzeUserTags(user_id);
      processed++;
    }

    if (processed > 0) {
      console.log(`[userTagging] Tagged ${processed} active users`);
    }
  } catch (e) {
    console.error("[userTagging] runHourlyTagging:", e.message);
  }
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

export async function getUserTags(userId) {
  if (!pool) return [];
  const { rows } = await q(
    `SELECT tag, score, last_seen FROM user_tags WHERE user_id=$1 ORDER BY score DESC`,
    [userId]
  );
  return rows;
}

export async function recordEvent(userId, eventType, metadata = {}) {
  if (!pool) return;
  await q(
    `INSERT INTO user_events (user_id, event_type, metadata) VALUES ($1,$2,$3)`,
    [userId, eventType, JSON.stringify(metadata)]
  );
}

export function getPersonalizationContext(tags) {
  const tagSet = new Set(tags.map(t => t.tag));

  return {
    showHighValueWines: tagSet.has('high_value_interest'),
    showB2BContent: tagSet.has('b2b_interest'),
    showAcademyCTA: tagSet.has('education_focused'),
    showPortfolioTips: tagSet.has('active_investor'),
    showPriceAlerts: tagSet.has('price_sensitive'),
    preferMobileLayout: tagSet.has('mobile_first'),
    showShareButton: tagSet.has('social_sharer'),
    showCalculator: tagSet.has('calculator_user'),

    emailTone: tagSet.has('b2b_interest') || tagSet.has('active_investor') ? 'professional' : 'friendly',
    upgradeUrgency: tagSet.has('active_investor') && tagSet.has('high_value_interest') ? 'high' : 'normal',
    suggestedNotification: tagSet.has('price_sensitive') ? 'instant' : tagSet.has('education_focused') ? 'weekly' : 'daily',
  };
}

// ── CRON ──────────────────────────────────────────────────────────────────────

export function startUserTaggingCron() {
  cron.schedule("0 * * * *", runHourlyTagging, { timezone: "Europe/Rome" });
  console.log("[userTagging] Hourly cron scheduled");
}
