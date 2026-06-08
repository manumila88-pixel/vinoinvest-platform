import { Router } from "express";
import { getVintageScore, getRegionVintageRange, getAllRegionsForYear, getRegionList, getVintageScoreFromDB, seedAllVintageScores } from "../services/vintageClimateService.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/vintage/regions — list all tracked regions
router.get("/regions", (_req, res) => {
  res.json(getRegionList());
});

// GET /api/vintage/score?region=bordeaux&year=2015
router.get("/score", async (req, res) => {
  const { region, year } = req.query;
  if (!region || !year) return res.status(400).json({ error: "region and year required" });
  const result = await getVintageScore(region.toLowerCase(), parseInt(year));
  if (!result) return res.status(404).json({ error: "no data for this region/year" });
  res.json(result);
});

// GET /api/vintage/region/:key — full range 2010-present
router.get("/region/:key", async (req, res) => {
  const { key } = req.params;
  const fromYear = parseInt(req.query.from) || 2010;
  const data = await getRegionVintageRange(key.toLowerCase(), fromYear);
  if (!data.length) return res.status(404).json({ error: "region not found" });
  res.json({ region: key, vintages: data });
});

// GET /api/vintage/year/:year — all regions for a given year
router.get("/year/:year", async (req, res) => {
  const year = parseInt(req.params.year);
  if (isNaN(year)) return res.status(400).json({ error: "invalid year" });
  const data = await getAllRegionsForYear(year);
  res.json({ year, regions: data });
});

// GET /api/vintage/scores — all persisted scores from DB, optional ?region= filter
router.get("/scores", async (req, res) => {
  const { region } = req.query;
  // Import pool lazily from the service (accessed via getVintageScoreFromDB pattern)
  // We re-use a direct approach: pull from DB via a small helper
  try {
    const { _getPool } = await import("../services/vintageClimateService.js");
    const pool = _getPool ? _getPool() : null;
    if (!pool) return res.status(503).json({ error: "DB not available" });

    let query = "SELECT * FROM vintage_scores";
    const params = [];
    if (region) {
      query += " WHERE LOWER(region) = LOWER($1)";
      params.push(region);
    }
    query += " ORDER BY region, year";

    const { rows } = await pool.query(query, params);
    res.json(rows.map(r => ({
      region: r.region,
      year: r.year,
      score: parseFloat(r.score),
      label: r.score >= 95 ? "Eccezionale" : r.score >= 88 ? "Ottima" : r.score >= 78 ? "Buona" : r.score >= 65 ? "Discreta" : r.score >= 50 ? "Media" : "Difficile",
      temp_mean: r.temp_avg !== null ? parseFloat(r.temp_avg) : null,
      rain_total: r.rain_total !== null ? parseFloat(r.rain_total) : null,
      source: r.data_source,
      computed_at: r.computed_at,
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/vintage/scores/:region/:year — single score from DB (falls back to live fetch)
router.get("/scores/:region/:year", async (req, res) => {
  const { region } = req.params;
  const year = parseInt(req.params.year);
  if (isNaN(year)) return res.status(400).json({ error: "invalid year" });

  // Try DB first
  const fromDB = await getVintageScoreFromDB(region, year);
  if (fromDB) return res.json(fromDB);

  // Fall back to live fetch (will also persist to DB via getVintageScore)
  const live = await getVintageScore(region.toLowerCase(), year);
  if (!live) return res.status(404).json({ error: "no data for this region/year" });
  res.json(live);
});

// POST /api/vintage/seed — admin-only: trigger full seed of all regions × years
router.post("/seed", requireAdmin, async (req, res) => {
  res.json({ ok: true, message: "Vintage scores seed started in background. This may take several minutes.", started_at: new Date().toISOString() });
  seedAllVintageScores()
    .then(r => console.log("[vintage/seed] done:", r))
    .catch(e => console.error("[vintage/seed] error:", e.message));
});

export default router;
