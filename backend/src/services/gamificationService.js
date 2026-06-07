/**
 * Gamification Service — points, badges, leaderboard.
 * Uses DB table `user_gamification` or in-memory fallback.
 */

let pool = null;
export function setGamificationPool(p) { pool = p; }

const BADGES = {
  novice:       { id: "novice",       name: "Sommelier Novizio",   icon: "🍷", points: 0,    desc: "Benvenuto in VinoInvest" },
  first_wine:   { id: "first_wine",   name: "Primo Acquisto",      icon: "🎯", points: 50,   desc: "Aggiunto il primo vino al portfolio" },
  portfolio_5:  { id: "portfolio_5",  name: "Collezionista",       icon: "🗃️", points: 100,  desc: "5 vini in portfolio" },
  portfolio_10: { id: "portfolio_10", name: "Investitore",         icon: "📈", points: 200,  desc: "10 vini in portfolio" },
  value_10k:    { id: "value_10k",    name: "Portfolio €10k",      icon: "💎", points: 500,  desc: "Portfolio supera €10.000" },
  value_50k:    { id: "value_50k",    name: "Portfolio €50k",      icon: "🏆", points: 1500, desc: "Portfolio supera €50.000" },
  diversified:  { id: "diversified",  name: "Diversificato",       icon: "🌍", points: 150,  desc: "Vini da 3+ regioni diverse" },
  expert:       { id: "expert",       name: "Esperto",             icon: "⭐", points: 500,  desc: "500 punti raggiunti" },
  master:       { id: "master",       name: "Master",              icon: "👑", points: 1000, desc: "1000 punti raggiunti" },
  legend:       { id: "legend",       name: "Leggenda",            icon: "🌟", points: 5000, desc: "5000 punti raggiunti" },
  login_streak: { id: "login_streak", name: "Fedele",              icon: "🔥", points: 50,   desc: "7 giorni di login consecutivi" },
  watchlist:    { id: "watchlist",    name: "Scout",               icon: "👀", points: 30,   desc: "10 vini in watchlist" },
};

const POINT_EVENTS = {
  daily_login:    10,
  add_portfolio:  50,
  add_watchlist:  10,
  share:          20,
  review:         30,
  referral:       100,
  portfolio_5k:   200,
};

// In-memory store when no DB
const memStore = new Map();

async function getUserData(userId) {
  if (pool) {
    try {
      const r = await pool.query(
        "SELECT * FROM user_gamification WHERE user_id = $1",
        [userId]
      );
      if (r.rows[0]) return r.rows[0];
    } catch { /* fallthrough */ }
  }
  return memStore.get(userId) || { user_id: userId, points: 0, badges: "[]", level: "Novizio", streak: 0, last_login: null };
}

async function saveUserData(data) {
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO user_gamification(user_id, points, badges, level, streak, last_login)
         VALUES($1,$2,$3,$4,$5,$6)
         ON CONFLICT(user_id) DO UPDATE SET
           points=EXCLUDED.points, badges=EXCLUDED.badges,
           level=EXCLUDED.level, streak=EXCLUDED.streak,
           last_login=EXCLUDED.last_login`,
        [data.user_id, data.points, JSON.stringify(data.badges_arr || []), data.level, data.streak, data.last_login]
      );
    } catch { /* fallthrough */ }
  }
  memStore.set(data.user_id, data);
}

function getLevel(points) {
  if (points >= 5000) return "Leggenda";
  if (points >= 1000) return "Master";
  if (points >= 500)  return "Esperto";
  if (points >= 100)  return "Collezionista";
  return "Novizio";
}

export async function awardPoints(userId, event) {
  const pts = POINT_EVENTS[event] || 0;
  if (!pts) return null;

  const data = await getUserData(userId);
  const prev = Number(data.points) || 0;
  const newPoints = prev + pts;
  const badges = JSON.parse(data.badges || data.badges_arr ? JSON.stringify(data.badges_arr || []) : "[]");

  // Check milestone badges
  const newBadges = [];
  if (prev === 0 && newPoints >= 0 && !badges.includes("novice"))   { badges.push("novice");   newBadges.push(BADGES.novice); }
  if (newPoints >= 500 && !badges.includes("expert"))               { badges.push("expert");   newBadges.push(BADGES.expert); }
  if (newPoints >= 1000 && !badges.includes("master"))              { badges.push("master");   newBadges.push(BADGES.master); }
  if (newPoints >= 5000 && !badges.includes("legend"))              { badges.push("legend");   newBadges.push(BADGES.legend); }
  if (event === "add_portfolio" && !badges.includes("first_wine"))  { badges.push("first_wine"); newBadges.push(BADGES.first_wine); }
  if (event === "add_watchlist") {
    if (!badges.includes("watchlist")) { badges.push("watchlist"); newBadges.push(BADGES.watchlist); }
  }

  const updated = {
    user_id: userId,
    points: newPoints,
    badges_arr: badges,
    level: getLevel(newPoints),
    streak: data.streak || 0,
    last_login: event === "daily_login" ? new Date().toISOString() : data.last_login,
  };
  await saveUserData(updated);

  return { points: newPoints, earned: pts, level: updated.level, newBadges };
}

export async function getUserStats(userId) {
  const data = await getUserData(userId);
  const points = Number(data.points) || 0;
  const badges = JSON.parse(data.badges || data.badges_arr ? JSON.stringify(data.badges_arr || []) : "[]");
  return {
    userId,
    points,
    level: getLevel(points),
    badges: badges.map(id => BADGES[id]).filter(Boolean),
    streak: data.streak || 0,
    nextLevel: getNextLevelInfo(points),
  };
}

function getNextLevelInfo(points) {
  const thresholds = [{ level: "Collezionista", pts: 100 }, { level: "Esperto", pts: 500 }, { level: "Master", pts: 1000 }, { level: "Leggenda", pts: 5000 }];
  const next = thresholds.find(t => t.pts > points);
  if (!next) return null;
  return { level: next.level, pointsNeeded: next.pts - points, targetPoints: next.pts };
}

export async function getLeaderboard(limit = 10) {
  if (pool) {
    try {
      const r = await pool.query(
        "SELECT user_id, points, level, badges FROM user_gamification ORDER BY points DESC LIMIT $1",
        [limit]
      );
      return r.rows;
    } catch { /* fallthrough */ }
  }
  return Array.from(memStore.values())
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, limit);
}

export function getAllBadges() {
  return Object.values(BADGES);
}

export async function initGamificationTable() {
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_gamification (
        user_id TEXT PRIMARY KEY,
        points INTEGER DEFAULT 0,
        badges TEXT DEFAULT '[]',
        level TEXT DEFAULT 'Novizio',
        streak INTEGER DEFAULT 0,
        last_login TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_gamification_points ON user_gamification(points DESC)`).catch(() => {});
  } catch (e) {
    console.warn("[gamification] Table init:", e.message);
  }
}
