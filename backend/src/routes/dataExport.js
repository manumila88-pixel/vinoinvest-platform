import { Router } from "express";
import { SITE_URL } from "../config/site.js";

const router = Router();
let winesRef = [];
let poolRef = null;
export function setDataExportWines(wines) { winesRef = wines; }
export function setDataExportPool(pool) { poolRef = pool; }

/**
 * GET /api/data/wines.csv
 * Downloadable CSV of wine investment data.
 */
router.get("/wines.csv", (_req, res) => {
  const wines = winesRef.slice(0, 500);
  const header = "id,name,producer,region,country,vintage,current_price_eur,investment_score,risk,market_trend,type\n";
  const rows = wines.map(w => {
    const fields = [
      w.id || "",
      `"${(w.name || "").replace(/"/g, '""')}"`,
      `"${(w.producer || "").replace(/"/g, '""')}"`,
      `"${(w.region || "").replace(/"/g, '""')}"`,
      `"${(w.country || w.region || "").replace(/"/g, '""')}"`,
      w.vintage || "",
      w.currentPrice ?? w.current_price ?? "",
      w.investmentScore ?? w.investment_score ?? w.criticScore ?? "",
      `"${w.risk || ""}"`,
      `"${w.marketTrend ?? w.market_trend ?? ""}"`,
      `"${w.type || ""}"`
    ];
    return fields.join(",");
  }).join("\n");

  res.set("Content-Type", "text/csv; charset=utf-8");
  res.set("Content-Disposition", `attachment; filename="vinoinvest-wine-data-${new Date().toISOString().split("T")[0]}.csv"`);
  res.set("Cache-Control", "public, max-age=3600");
  res.set("Access-Control-Allow-Origin", "*");
  res.send(header + rows);
});

/**
 * GET /api/data/prices.csv
 * Downloadable CSV of price history (latest 1000 records from DB).
 */
router.get("/prices.csv", async (req, res) => {
  try {
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", `attachment; filename="vinoinvest-price-history-${new Date().toISOString().split("T")[0]}.csv"`);
    res.set("Cache-Control", "public, max-age=3600");
    res.set("Access-Control-Allow-Origin", "*");

    let rows = [];
    if (poolRef) {
      const result = await poolRef.query(`
        SELECT ph.wine_id, w.name AS wine_name, ph.price AS price_eur,
               ph.recorded_at::date AS date, ph.source
        FROM price_history ph
        LEFT JOIN wines w ON w.id::text = ph.wine_id::text
        ORDER BY ph.recorded_at DESC
        LIMIT 1000
      `).catch(() => ({ rows: [] }));
      rows = result.rows;
    }

    const header = "wine_id,wine_name,price_eur,date,source\n";
    const csv = rows.map(r => [
      `"${(r.wine_id || "").toString().replace(/"/g, '""')}"`,
      `"${(r.wine_name || "").replace(/"/g, '""')}"`,
      r.price_eur ?? "",
      r.date || "",
      `"${(r.source || "").replace(/"/g, '""')}"`,
    ].join(",")).join("\n");

    res.send(header + csv);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/data/metadata.json
 * Metadata about the dataset.
 */
router.get("/metadata.json", (_req, res) => {
  res.set("Cache-Control", "public, max-age=86400");
  res.set("Access-Control-Allow-Origin", "*");
  res.json({
    name: "VinoInvest Wine Investment Dataset",
    description: "Open dataset of fine wine investment metrics, prices, and AI scores.",
    url: SITE_URL,
    license: "Creative Commons Attribution 4.0 International",
    updated: new Date().toISOString().split("T")[0],
    records: winesRef.length,
    fields: ["id", "name", "producer", "region", "country", "vintage", "current_price_eur", "investment_score", "risk", "market_trend"],
    downloads: {
      csv: `${process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com"}/api/data/wines.csv`,
      prices: `${process.env.BACKEND_URL || "https://vinoinvest-backend-2.onrender.com"}/api/data/prices.csv`,
    },
    citation: `VinoInvest AI Research Team. (2026). Fine Wine Investment Dataset. VinoInvest. ${SITE_URL}/data`
  });
});

export default router;
