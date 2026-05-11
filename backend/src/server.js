import express from "express";
import cors from "cors";

import { pool } from "./db/pool.js";
import { initDatabase } from "./db/init.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "VinoInvest backend PRO online"
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true
  });
});

app.get("/api/market/wines", async (req, res) => {

  const result = await pool.query(`
    SELECT
      id,
      name,
      region,
      current_price AS "currentPrice",
      risk,
      source
    FROM wines
    ORDER BY name ASC
  `);

  res.json(result.rows);

});

app.post("/api/orders", async (req, res) => {

  const {
    wineId,
    quantity
  } = req.body;

  await pool.query(`
    INSERT INTO orders (
      wine_id,
      quantity
    )
    VALUES ($1, $2)
  `, [wineId, quantity]);

  res.json({
    ok: true,
    message: "Ordine salvato nel database"
  });

});

app.get("/api/orders", async (req, res) => {

  const result = await pool.query(`
    SELECT *
    FROM orders
    ORDER BY created_at DESC
  `);

  res.json(result.rows);

});

initDatabase()
  .then(() => {

    app.listen(PORT, () => {

      console.log(`
        VinoInvest backend PRO running
        on port ${PORT}
      `);

    });

  })
  .catch((err) => {

    console.error(err);

  });