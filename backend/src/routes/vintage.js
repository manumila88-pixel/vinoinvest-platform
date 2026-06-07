import { Router } from "express";
import { getVintageScore, getRegionVintageRange, getAllRegionsForYear, getRegionList } from "../services/vintageClimateService.js";

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

export default router;
