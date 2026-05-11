import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

import "./style.css";

const API = "https://vinoinvest-backend.onrender.com";

const colors = [
  "#c9a227",
  "#00c2ff",
  "#00ff88",
  "#ff4d6d",
  "#a855f7",
  "#f97316",
  "#22c55e",
  "#eab308"
];

function App() {
  const [tab, setTab] = useState("dashboard");
  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedWines, setSelectedWines] = useState([]);
  const [histories, setHistories] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadHistories();
  }, [selectedWines]);

  async function loadData() {
    const winesRes = await fetch(`${API}/api/market/wines`);
    const winesData = await winesRes.json();

    setWines(winesData);
    setSelectedWines(winesData.slice(0, 3).map(wine => wine.id));

    try {
      const ordersRes = await fetch(`${API}/api/orders`);
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch {
      setOrders([]);
    }
  }

  async function loadHistories() {
    const output = {};

    for (const wineId of selectedWines) {
      const res = await fetch(`${API}/api/market/wines/${wineId}`);
      const data = await res.json();
      output[wineId] = data.history || [];
    }

    setHistories(output);
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

  function toggleWine(wineId) {
    if (selectedWines.includes(wineId)) {
      setSelectedWines(selectedWines.filter(id => id !== wineId));
    } else {
      setSelectedWines([...selectedWines, wineId]);
    }
  }

  const totalMarket = wines.reduce(
    (sum, wine) => sum + Number(wine.currentPrice || 0),
    0
  );

  const allDates = Array.from(
    new Set(
      Object.values(histories)
        .flat()
        .map(item => item.date)
    )
  ).sort();

  const chartData = allDates.map(date => {
    const row = { date };

    selectedWines.forEach(wineId => {
      const point = histories[wineId]?.find(item => item.date === date);
      row[wineId] = point ? point.price : null;
    });

    return row;
  });

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
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button className={tab === "market" ? "active" : ""} onClick={() => setTab("market")}>Market</button>
          <button className={tab === "analysis" ? "active" : ""} onClick={() => setTab("analysis")}>Analysis</button>
          <button className={tab === "partners" ? "active" : ""} onClick={() => setTab("partners")}>Partners</button>
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
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
                    Ogni utente potrà scegliere quali vini seguire.
                    Le API reali aggiungeranno tutto il mercato.
                  </p>
                </div>
              </section>

              <section className="statsGrid">
                <div className="statCard">
                  <small>Mercato totale</small>
                  <h2>€ {totalMarket}</h2>
                </div>

                <div className="statCard">
                  <small>Asset monitorati</small>
                  <h2>{wines.length}</h2>
                </div>

                <div className="statCard">
                  <small>Ordini registrati</small>
                  <h2>{orders.length}</h2>
                </div>
              </section>
            </>
          )}

          {tab === "market" && (
            <section className="marketGrid">
              {wines.map(wine => (
                <div className="wineCard" key={wine.id}>
                  <h2>{wine.name}</h2>
                  <p>{wine.region}</p>
                  <h3>€ {wine.currentPrice}</h3>

                  <div className="tags">
                    <span>{wine.risk}</span>
                    <span>{wine.source}</span>
                  </div>

                  <button onClick={() => buyWine(wine.id)}>
                    Compra
                  </button>
                </div>
              ))}
            </section>
          )}

          {tab === "analysis" && (
            <section className="chartPanel">
              <h2>Wine Watchlist</h2>

              <p style={{ color: "#aaa", marginBottom: "24px" }}>
                Scegli i vini da confrontare nel tempo.
              </p>

              <div className="marketGrid" style={{ marginBottom: "40px" }}>
                {wines.map(wine => (
                  <div className="wineCard" key={wine.id}>
                    <h2>{wine.name}</h2>
                    <p>{wine.region}</p>

                    <button onClick={() => toggleWine(wine.id)}>
                      {selectedWines.includes(wine.id)
                        ? "Rimuovi dal grafico"
                        : "Aggiungi al grafico"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="chartBox">
                <ResponsiveContainer width="100%" height={520}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#1f1f1f" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Legend />

                    {selectedWines.map((wineId, index) => {
                      const wine = wines.find(item => item.id === wineId);

                      return (
                        <Line
                          key={wineId}
                          type="monotone"
                          dataKey={wineId}
                          name={wine?.name || wineId}
                          stroke={colors[index % colors.length]}
                          strokeWidth={4}
                          dot={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {tab === "partners" && (
            <section className="chartPanel">
              <h2>Partner API</h2>

              <div className="marketGrid">
                <div className="wineCard">
                  <h2>Liv-ex</h2>
                  <p>Market data provider.</p>
                </div>

                <div className="wineCard">
                  <h2>Wine Searcher</h2>
                  <p>Global wine pricing.</p>
                </div>

                <div className="wineCard">
                  <h2>Sotheby's Wine</h2>
                  <p>Auction data.</p>
                </div>
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
                <div className="orderRow" key={order.id || index}>
                  <strong>{order.wine_id || order.wineId}</strong>
                  <span>quantità: {order.quantity}</span>
                </div>
              ))}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);