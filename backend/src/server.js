import express from "express";
import cors from "cors";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wines = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data", "wines.json"),
    "utf-8"
  )
);

let orders = [];

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "vinoinvest-backend"
  });
});

app.get("/api/market/wines", (req, res) => {
  res.json(wines);
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {

  const order = {
    id: Date.now(),
    wineId: req.body.wineId,
    quantity: req.body.quantity || 1
  };

  orders.push(order);

  res.json({
    success: true,
    order
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});