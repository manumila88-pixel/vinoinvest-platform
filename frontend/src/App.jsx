import React, { useEffect, useState } from "react";

import { createRoot } from "react-dom/client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import "./style.css";

const API = "https://vinoinvest-backend.onrender.com";

function App() {

  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    const winesRes = await fetch(`${API}/api/market/wines`);
    const winesData = await winesRes.json();

    setWines(winesData);

    const ordersRes = await fetch(`${API}/api/orders`);
    const ordersData = await ordersRes.json();

    setOrders(ordersData);

  }

  async function buyWine(wineId) {

    await fetch(`${API}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wineId,
        quantity: 1
      })
    });

    loadData();

  }

  const chartData = wines.map((wine, index) => ({
    name: wine.name.slice(0, 12),
    value: wine.currentPrice,
    index
  }));

  return (

    <div className="app">

      <header className="header">

        <div>

          <h1>🍷 VinoInvest PRO</h1>

          <p>
            Fine Wine Investment Intelligence
          </p>

        </div>

      </header>

      <main className="main">

        <section className="hero">

          <div className="heroCard">

            <h2>Mercato Fine Wine</h2>

            <h1>
              € {
                wines.reduce(
                  (sum, wine) => sum + Number(wine.currentPrice || 0),
                  0
                )
              }
            </h1>

            <p>
              valore totale monitorato
            </p>

          </div>

          <div className="heroCard">

            <h2>Ordini Totali</h2>

            <h1>{orders.length}</h1>

            <p>
              ordini registrati nel database
            </p>

          </div>

        </section>

        <section className="chartPanel">

          <h2>Market Performance</h2>

          <div className="chartBox">

            <ResponsiveContainer width="100%" height={400}>

              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#c9a227"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </section>

        <section className="marketGrid">

          {wines.map(wine => (

            <div className="wineCard" key={wine.id}>

              <h2>{wine.name}</h2>

              <p>{wine.region}</p>

              <h3>
                € {wine.currentPrice}
              </h3>

              <div className="tags">

                <span>{wine.risk}</span>

                <span>{wine.source}</span>

              </div>

              <button
                onClick={() => buyWine(wine.id)}
              >
                Compra
              </button>

            </div>

          ))}

        </section>

        <section className="ordersPanel">

          <h2>Ordini Live</h2>

          {orders.map(order => (

            <div
              className="orderRow"
              key={order.id}
            >

              <div>

                <strong>{order.wine_id}</strong>

              </div>

              <div>

                quantità:
                {" "}
                {order.quantity}

              </div>

            </div>

          ))}

        </section>

      </main>

    </div>

  );

}

createRoot(
  document.getElementById("root")
).render(<App />);