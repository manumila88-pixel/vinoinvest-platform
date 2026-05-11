import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import "./style.css";

const API = "https://vinoinvest-backend.onrender.com";

function App() {

  const [tab, setTab] = useState("dashboard");

  const [wines, setWines] = useState([]);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const winesRes = await fetch(`${API}/api/market/wines`);
    const winesData = await winesRes.json();

    setWines(winesData);

    try {

      const ordersRes = await fetch(`${API}/api/orders`);
      const ordersData = await ordersRes.json();

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      }

    } catch {}

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

    alert("Ordine creato");

  }

  const totalMarket = wines.reduce(
    (sum, wine) => sum + Number(wine.currentPrice || 0),
    0
  );

  return (

    <div className="app">

      <header className="header">

        <div className="logo">
          🍷 Vino<span>Invest</span> Platform
        </div>

        <div className="badge">
          real-data ready
        </div>

      </header>

      <main className="main">

        <aside className="sidebar">

          <button
            className={tab === "dashboard" ? "active" : ""}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={tab === "market" ? "active" : ""}
            onClick={() => setTab("market")}
          >
            Market
          </button>

          <button
            className={tab === "analysis" ? "active" : ""}
            onClick={() => setTab("analysis")}
          >
            Analysis
          </button>

          <button
            className={tab === "partners" ? "active" : ""}
            onClick={() => setTab("partners")}
          >
            Partners
          </button>

          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>

        </aside>

        <section className="content">

          {tab === "dashboard" && (

            <>

              <section className="hero">

                <div className="heroText">

                  <h1>
                    Piattaforma pronta per dati reali,
                    storico, stime e ordini sicuri.
                  </h1>

                  <p>
                    Backend collegato.
                    Database attivo.
                    Sistema pronto per API reali.
                  </p>

                </div>

              </section>

              <section className="statsGrid">

                <div className="statCard">

                  <small>Mercato totale</small>

                  <h2>
                    € {totalMarket}
                  </h2>

                </div>

                <div className="statCard">

                  <small>Asset monitorati</small>

                  <h2>
                    {wines.length}
                  </h2>

                </div>

                <div className="statCard">

                  <small>Ordini registrati</small>

                  <h2>
                    {orders.length}
                  </h2>

                </div>

              </section>

            </>

          )}

          {tab === "market" && (

            <section className="marketGrid">

              {wines.map(wine => (

                <div
                  className="wineCard"
                  key={wine.id}
                >

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

          )}

          {tab === "analysis" && (

            <section className="chartPanel">

              <h2>Market Performance</h2>

              <div className="chartBox">

                <ResponsiveContainer width="100%" height={500}>

                  <AreaChart
                    data={[
                      { month: "Jan", value: 1800 },
                      { month: "Feb", value: 2100 },
                      { month: "Mar", value: 2400 },
                      { month: "Apr", value: 2300 },
                      { month: "May", value: 2600 },
                      { month: "Jun", value: 2910 }
                    ]}
                  >

                    <defs>

                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#c9a227"
                          stopOpacity={0.8}
                        />

                        <stop
                          offset="95%"
                          stopColor="#c9a227"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>

                    <XAxis
                      dataKey="month"
                      stroke="#999"
                    />

                    <YAxis
                      stroke="#999"
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#c9a227"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={4}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </section>

          )}

          {tab === "partners" && (

            <section className="chartPanel">

              <h2>Partner API</h2>

              <div className="wineCard">

                <h2>Liv-ex</h2>

                <p>
                  Market data provider
                </p>

              </div>

              <div className="wineCard">

                <h2>Wine Searcher</h2>

                <p>
                  Global wine pricing
                </p>

              </div>

              <div className="wineCard">

                <h2>Sotheby's Wine</h2>

                <p>
                  Auction data
                </p>

              </div>

            </section>

          )}

          {tab === "orders" && (

            <section className="ordersPanel">

              <h2>Ordini Live</h2>

              {orders.length === 0 && (
                <p>Nessun ordine registrato.</p>
              )}

              {orders.map((order, index) => (

                <div
                  className="orderRow"
                  key={index}
                >

                  <strong>
                    {order.wine_id || order.wineId}
                  </strong>

                  <span>
                    quantità:
                    {" "}
                    {order.quantity}
                  </span>

                </div>

              ))}

            </section>

          )}

        </section>

      </main>

    </div>

  );

}

createRoot(
  document.getElementById("root")
).render(<App />);