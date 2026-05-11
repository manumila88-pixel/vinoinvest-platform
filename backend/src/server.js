import express from "express";
import cors from "cors";

import wines from "./data/wines.json" assert { type: "json" };

const app = express();

app.use(cors());
app.use(express.json());

const orders = [];

app.get("/", (req, res) => {

  res.json({
    ok: true,
    platform: "VinoInvest API"
  });

});

app.get("/api/market/wines", (req, res) => {

  res.json(wines);

});

app.get("/api/market/wines/:id", (req, res) => {

  const wine = wines.find(
    item => item.id === req.params.id
  );

  if (!wine) {

    return res.status(404).json({
      error: "Wine not found"
    });

  }

  const history = [
    { date: "Jan", price: wine.currentPrice * 0.72 },
    { date: "Feb", price: wine.currentPrice * 0.76 },
    { date: "Mar", price: wine.currentPrice * 0.81 },
    { date: "Apr", price: wine.currentPrice * 0.88 },
    { date: "May", price: wine.currentPrice * 0.94 },
    { date: "Jun", price: wine.currentPrice }
  ];

  res.json({
    ...wine,
    history
  });

});

app.get("/api/orders", (req, res) => {

  res.json(orders);

});

app.post("/api/orders", (req, res) => {

  const order = {
    id: Date.now(),
    wine_id: req.body.wineId,
    quantity: req.body.quantity
  };

  orders.push(order);

  res.json({
    success: true,
    order
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `VinoInvest backend running on port ${PORT}`
  );

});