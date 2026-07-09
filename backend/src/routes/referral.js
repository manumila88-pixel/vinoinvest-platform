import express from "express";
import { requireAuth } from "../middleware/auth.js";
import crypto from "crypto";
import { SITE_URL } from "../config/site.js";

const router = express.Router();
let pool;
export const setReferralPool = (p) => { pool = p; };

function generateCode(userId) {
  return "VI" + crypto.createHash("sha256").update(userId + "vino2026").digest("hex").slice(0, 8).toUpperCase();
}

// GET /api/referral/my — get or create user's referral code
router.get("/my", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!pool) return res.json({ code: generateCode(userId), uses: 0, referrals: [] });

    // Get or create code
    let { rows } = await pool.query("SELECT * FROM referral_codes WHERE user_id = $1", [userId]);
    if (!rows.length) {
      const code = generateCode(userId);
      ({ rows } = await pool.query(
        "INSERT INTO referral_codes (user_id, code) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET code = EXCLUDED.code RETURNING *",
        [userId, code]
      ));
    }
    const ref = rows[0];

    // Get conversions
    const { rows: convRows } = await pool.query(
      "SELECT * FROM referral_conversions WHERE referrer_user_id = $1 ORDER BY converted_at DESC LIMIT 20",
      [userId]
    );

    res.json({
      code: ref.code,
      uses: ref.uses,
      conversions: convRows.length,
      referrals: convRows,
      share_url: `${SITE_URL}/?ref=${ref.code}`,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/referral/convert — register referral conversion
router.post("/convert", requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !pool) return res.json({ ok: false });

    const { rows } = await pool.query("SELECT * FROM referral_codes WHERE code = $1", [code]);
    if (!rows.length) return res.json({ ok: false, message: "Code not found" });

    const referrer = rows[0];
    if (referrer.user_id === req.user.id) return res.json({ ok: false, message: "Cannot refer yourself" });

    await pool.query(
      "INSERT INTO referral_conversions (referrer_user_id, referred_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [referrer.user_id, req.user.id]
    ).catch(() => {});

    await pool.query("UPDATE referral_codes SET uses = uses + 1 WHERE code = $1", [code]).catch(() => {});

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/referral/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    if (!pool) return res.json({ leaderboard: [] });

    const { rows } = await pool.query(`
      SELECT rc.user_id, rc.code, rc.uses,
             COUNT(rconv.id) as conversions
      FROM referral_codes rc
      LEFT JOIN referral_conversions rconv ON rconv.referrer_user_id = rc.user_id
      GROUP BY rc.user_id, rc.code, rc.uses
      ORDER BY conversions DESC, rc.uses DESC
      LIMIT 10
    `);

    res.json({ leaderboard: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
