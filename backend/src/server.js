import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const wines = [

  {
    id: "lafite",
    name: "Château Lafite Rothschild 2018",
    region: "Bordeaux",
    currentPrice: 820,
    risk: "Medium",
    source: "Liv-ex",

    history: [
      { date: "Jan", price: 720 },
      { date: "Feb", price: 740 },
      { date: "Mar", price: 760 },
      { date: "Apr", price: 790 },
      { date: "May", price: 810 },
      { date: "Jun", price: 820 }
    ]
  },

  {
    id: "sassicaia",
    name: "Sassicaia 2016",
    region: "Toscana",
    currentPrice: 510,
    risk: "Low",
    source: "Wine Searcher",

    history: [
      { date: "Jan", price: 430 },
      { date: "Feb", price: 460 },
      { date: "Mar", price: 480 },
      { date: "Apr", price: 500 },
      { date: "May", price: 520 },
      { date: "Jun", price: 510 }
    ]
  },

  {
    id: "barolo",
    name: "Barolo Monfortino 2016",
    region: "Piemonte",
    currentPrice: 1150,
    risk: "High",
    source: "Sotheby's",

    history: [
      { date: "Jan", price: 980 },
      { date: "Feb", price: 1000 },
      { date: "Mar", price: 1020 },
      { date: "Apr", price: 1080 },
      { date: "May", price: 1120 },
      { date: "Jun", price: 1150 }
    ]
  },

  {
    id: "dom",
    name: "Dom Pérignon P2 2004",
    region: "Champagne",
    currentPrice: 430,
    risk: "Medium",
    source: "Liv-ex",

    history: [
      { date: "Jan", price: 350 },
      { date: "Feb", price: 370 },
      { date: "Mar", price: 390 },
      { date: "Apr", price: 410 },
      { date: "May", price: 420 },
      { date: "Jun", price: 430 }
    ]
  }

];

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

  res.json(wine);

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