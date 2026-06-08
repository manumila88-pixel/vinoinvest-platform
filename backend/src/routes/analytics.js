import { Router } from "express";

const router = Router();

// In-memory circular buffer for Web Vitals metrics (last 1000)
const vitalsBuffer = [];
const MAX_VITALS = 1000;

/**
 * POST /api/analytics/vitals
 * Receives Core Web Vitals from the frontend.
 */
router.post("/vitals", (req, res) => {
  const { name, value, rating, id, navigationType } = req.body;
  if (!name || value === undefined) return res.status(400).json({ error: "Missing name or value" });

  vitalsBuffer.push({ name, value, rating, id, navigationType, ts: Date.now() });
  if (vitalsBuffer.length > MAX_VITALS) vitalsBuffer.shift();

  res.json({ ok: true });
});

/**
 * GET /api/analytics/vitals/summary
 * Returns average Web Vitals (admin use).
 */
router.get("/vitals/summary", (_req, res) => {
  if (vitalsBuffer.length === 0) return res.json({ count: 0, metrics: {} });

  const grouped = {};
  for (const v of vitalsBuffer) {
    if (!grouped[v.name]) grouped[v.name] = { values: [], good: 0, needsImprovement: 0, poor: 0 };
    grouped[v.name].values.push(v.value);
    if (v.rating === "good") grouped[v.name].good++;
    else if (v.rating === "needs-improvement") grouped[v.name].needsImprovement++;
    else grouped[v.name].poor++;
  }

  const metrics = {};
  for (const [name, data] of Object.entries(grouped)) {
    const sorted = [...data.values].sort((a, b) => a - b);
    metrics[name] = {
      p50: sorted[Math.floor(sorted.length * 0.5)]?.toFixed(1),
      p75: sorted[Math.floor(sorted.length * 0.75)]?.toFixed(1),
      p95: sorted[Math.floor(sorted.length * 0.95)]?.toFixed(1),
      count: data.values.length,
      goodPct: ((data.good / data.values.length) * 100).toFixed(0) + "%",
    };
  }

  res.json({ count: vitalsBuffer.length, metrics });
});

export default router;
