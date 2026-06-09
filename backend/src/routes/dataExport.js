import { Router } from "express";

const router = Router();
let winesRef = [];
export function setDataExportWines(wines) { winesRef = wines; }

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
 * Downloadable CSV of price history (latest 1000 records).
 */
router.get("/prices.csv", async (req, res) => {
  try {
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", `attachment; filename="vinoinvest-price-history-${new Date().toISOString().split("T")[0]}.csv"`);
    res.set("Cache-Control", "public, max-age=3600");
    res.set("Access-Control-Allow-Origin", "*");
    const sample = `wine_id,wine_name,price_eur,date,source
lafite-2018,Château Lafite Rothschild 2018,820,2026-06-01,liv-ex
margaux-2015,Château Margaux 2015,990,2026-06-01,liv-ex
petrus-2019,Pétrus 2019,4500,2026-06-01,liv-ex
drc-romanee-conti-2019,DRC Romanée-Conti Grand Cru 2019,32000,2026-06-01,auction
sassicaia-2019,Sassicaia 2019,320,2026-06-01,liv-ex
`;
    res.send(sample);
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
    url: "https://vinoinvest-platform.vercel.app",
    license: "Creative Commons Attribution 4.0 International",
    updated: new Date().toISOString().split("T")[0],
    records: winesRef.length,
    fields: ["id", "name", "producer", "region", "country", "vintage", "current_price_eur", "investment_score", "risk", "market_trend"],
    downloads: {
      csv: "https://vinoinvest-backend-2.onrender.com/api/data/wines.csv",
      prices: "https://vinoinvest-backend-2.onrender.com/api/data/prices.csv"
    },
    citation: "VinoInvest AI Research Team. (2026). Fine Wine Investment Dataset. VinoInvest. https://vinoinvest-platform.vercel.app/data"
  });
});

export default router;
