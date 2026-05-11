import React, { useEffect, useMemo, useState } from "react";
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

const API = "https://vinoinvest-backend-2.onrender.com";

const colors = [
  "#c9a227",
  "#00c2ff",
  "#00ff88",
  "#ff4d6d",
  "#a855f7",
  "#f97316",
  "#22c55e",
  "#eab308",
  "#ec4899",
  "#38bdf8",
  "#facc15",
  "#4ade80"
];

function App() {
  const [tab, setTab] = useState("dashboard");
  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const winesRes = await fetch(`${API}/api/market/wines`);
    const winesData = await winesRes.json();

    setWines(winesData);

    if (watchlist.length === 0 && winesData.length > 0) {
      setWatchlist(winesData.slice(0, 4).map(wine => wine.id));
    }

    try {
      const ordersRes = await fetch(`${API}/api/orders`);
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch {
      setOrders([]);
    }
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

    await loadData();
    alert("Ordine creato");
  }

  function toggleWatchlist(wineId) {
    if (watchlist.includes(wineId)) {
      setWatchlist(watchlist.filter(id => id !== wineId));
    } else {
      setWatchlist([...watchlist, wineId]);
    }
  }

  const filteredWines = useMemo(() => {
    return wines.filter(wine => {
      const text = `${wine.name} ${wine.producer || ""} ${wine.region || ""} ${wine.country || ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [wines, search]);

  const totalMarket = wines.reduce(
    (sum, wine) => sum + Number(wine.currentPrice || 0),
    0
  );

  const holdings = orders.reduce((acc, order) => {
    const wineId = order.wine_id || order.wineId;
    const wine = wines.find(w => w.id === wineId);

    if (!wine) return acc;

    const existing = acc.find(item => item.id === wine.id);

    if (existing) {
      existing.quantity += Number(order.quantity || 1);
      existing.totalValue = existing.quantity * Number(wine.currentPrice || 0);
    } else {
      acc.push({
        id: wine.id,
        name: wine.name,
        quantity: Number(order.quantity || 1),
        currentPrice: Number(wine.currentPrice || 0),
        totalValue: Number(wine.currentPrice || 0) * Number(order.quantity || 1)
      });
    }

    return acc;
  }, []);

  const portfolioValue = holdings.reduce(
    (sum, item) => sum + Number(item.totalValue || 0),
    0
  );

  const chartData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((date, index) => {
    const row = { date };

    watchlist.forEach(wineId => {
      const wine = wines.find(w => w.id === wineId);
      if (!wine) return;

      const base = Number(wine.currentPrice || 0);
      const factors = [0.72, 0.78, 0.84, 0.9, 0.96, 1];
      row[wineId] = Math.round(base * factors[index]);
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
          AI market ready
        </div>
      </header>

      <main className="main">
        <aside className="sidebar">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
            Dashboard
          </button>

          <button className={tab === "market" ? "active" : ""} onClick={() => setTab("market")}>
            Market
          </button>

          <button className={tab === "analysis" ? "active" : ""} onClick={() => setTab("analysis")}>
            Analysis
          </button>

          <button className={tab === "portfolio" ? "active" : ""} onClick={() => setTab("portfolio")}>
            Portfolio
          </button>

          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
            Orders
          </button>
        </aside>

        <section className="content">
          {tab === "dashboard" && (
            <>
              <section className="hero">
                <div className="heroText">
                  <h1>Fine Wine Intelligence Platform</h1>
                  <p>
                    Monitoraggio vini, storico prezzi, watchlist, portfolio e analisi premium.
                  </p>
                </div>
              </section>

              <section className="statsGrid">
                <div className="statCard">
                  <small>Mercato totale</small>
                  <h2>€ {totalMarket}</h2>
                </div>

                <div className="statCard">
                  <small>Portfolio Value</small>
                  <h2>€ {portfolioValue}</h2>
                </div>

                <div className="statCard">
                  <small>Vini monitorati</small>
                  <h2>{wines.length}</h2>
                </div>
              </section>
            </>
          )}

          {tab === "market" && (
            <>
              <input
                className="searchInput"
                placeholder="Cerca vino, produttore, regione o paese..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <section className="marketGrid">
                {filteredWines.map(wine => (
                  <div className="wineCard" key={wine.id}>
                    <h2>{wine.name}</h2>

                    <p>{wine.producer}</p>
                    <p>{wine.region} · {wine.country} · {wine.vintage}</p>

                    <h3>€ {wine.currentPrice}</h3>

                    <div className="tags">
                      <span>{wine.risk}</span>
                      <span>{wine.liquidity}</span>
                      <span>{wine.marketTrend}</span>
                      <span>Score {wine.investmentScore}</span>
                    </div>

                    <button onClick={() => buyWine(wine.id)}>
                      Compra
                    </button>

                    <button onClick={() => toggleWatchlist(wine.id)}>
                      {watchlist.includes(wine.id)
                        ? "Rimuovi Watchlist"
                        : "Aggiungi Watchlist"}
                    </button>
                  </div>
                ))}
              </section>
            </>
          )}

          {tab === "analysis" && (
            <section className="chartPanel">
              <h2>Wine Market Watchlist</h2>

              <p style={{ color: "#9ca3af", marginBottom: 24, fontSize: 18 }}>
                Seleziona i vini dal tab Market e confrontali nel tempo.
              </p>

              <div className="chartBox">
                <ResponsiveContainer width="100%" height={560}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#1f1f1f" />

                    <XAxis dataKey="date" stroke="#888" />

                    <YAxis stroke="#888" />

                    <Tooltip />

                    <Legend />

                    {watchlist.map((wineId, index) => {
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

          {tab === "portfolio" && (
            <section className="ordersPanel">
              <h2>Portfolio Holdings</h2>

              {holdings.length === 0 && (
                <p>Nessun asset acquistato.</p>
              )}

              {holdings.map(item => (
                <div className="orderRow" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>quantità: {item.quantity}</p>
                  </div>

                  <div>
                    <strong>€ {item.totalValue}</strong>
                  </div>
                </div>
              ))}
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