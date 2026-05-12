import React, {
  useEffect,
  useState
} from "react";

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

const API =
  "https://vinoinvest-backend-2.onrender.com";

const colors = [
  "#c9a227",
  "#00c2ff",
  "#00ff88",
  "#ff4d6d",
  "#a855f7",
  "#f97316"
];

function App() {

  const [tab, setTab] =
    useState("dashboard");

  const [wines, setWines] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [watchlist, setWatchlist] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [portfolio, setPortfolio] =
    useState(null);

  const [budget, setBudget] =
    useState(10000);

  const [risk, setRisk] =
    useState("medio");

  const [years, setYears] =
    useState(5);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    const winesRes =
      await fetch(
        `${API}/api/market/wines`
      );

    const winesData =
      await winesRes.json();

    setWines(winesData);

    try {

      const ordersRes =
        await fetch(
          `${API}/api/orders`
        );

      const ordersData =
        await ordersRes.json();

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );

    } catch {

      setOrders([]);

    }

  }

  async function searchWine(value) {

    setSearch(value);

    if (!value.trim()) {

      setSearchResults([]);

      return;

    }

    try {

      const res =
        await fetch(
          `${API}/api/global-search?q=${value}`
        );

      const data =
        await res.json();

      setSearchResults(
        data.results || []
      );

    } catch (error) {

      console.error(error);

      setSearchResults([]);

    }

  }

  async function generatePortfolio() {

    try {

      const res =
        await fetch(
          `${API}/api/portfolio-builder`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              budget,

              risk,

              horizonYears:
                years

            })

          }
        );

      const data =
        await res.json();

      setPortfolio(data);

    } catch (error) {

      console.error(error);

    }

  }

  async function buyWine(wineId) {

    await fetch(`${API}/api/orders`, {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        wineId,
        quantity: 1
      })

    });

    loadData();

    alert("Ordine creato");

  }

  function toggleWatchlist(wineId) {

    if (
      watchlist.includes(wineId)
    ) {

      setWatchlist(
        watchlist.filter(
          id => id !== wineId
        )
      );

    } else {

      setWatchlist([
        ...watchlist,
        wineId
      ]);

    }

  }

  const totalMarket =
    wines.reduce(

      (sum, wine) =>
        sum +
        Number(
          wine.currentPrice || 0
        ),

      0
    );

  const holdings =
    orders.reduce((acc, order) => {

      const wine =
        wines.find(
          w =>
            w.id ===
            (order.wine_id ||
              order.wineId)
        );

      if (!wine) return acc;

      const existing =
        acc.find(
          item =>
            item.id === wine.id
        );

      if (existing) {

        existing.quantity +=
          Number(
            order.quantity || 1
          );

      } else {

        acc.push({

          id: wine.id,

          name: wine.name,

          quantity:
            Number(
              order.quantity || 1
            ),

          totalValue:
            Number(
              wine.currentPrice || 0
            ) *
            Number(
              order.quantity || 1
            )

        });

      }

      return acc;

    }, []);

  const portfolioValue =
    holdings.reduce(

      (sum, item) =>
        sum + item.totalValue,

      0
    );

  const chartData = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun"
  ].map((date, index) => {

    const row = { date };

    watchlist.forEach(wineId => {

      const wine =
        wines.find(
          w => w.id === wineId
        );

      if (!wine) return;

      const factors = [
        0.72,
        0.78,
        0.84,
        0.9,
        0.96,
        1
      ];

      row[wineId] =
        Math.round(
          wine.currentPrice *
          factors[index]
        );

    });

    return row;

  });

  return (

    <div className="app">

      <header className="header">

        <div className="logo">

          🍷 Vino
          <span>Invest</span>

        </div>

        <div className="badge">
          global wine intelligence
        </div>

      </header>

      <main className="main">

        <aside className="sidebar">

          <button
            className={
              tab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className={
              tab === "market"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("market")
            }
          >
            Market
          </button>

          <button
            className={
              tab === "analysis"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("analysis")
            }
          >
            Analysis
          </button>

          <button
            className={
              tab === "portfolio"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("portfolio")
            }
          >
            Portfolio AI
          </button>

        </aside>

        <section className="content">

          {tab === "dashboard" && (

            <>

              <section className="hero">

                <div className="heroText">

                  <h1>
                    Global Wine
                    Investment Platform
                  </h1>

                  <p>
                    AI portfolio builder,
                    wine intelligence,
                    analytics and
                    worldwide search.
                  </p>

                </div>

              </section>

              <section className="statsGrid">

                <div className="statCard">

                  <small>
                    Global Market
                  </small>

                  <h2>
                    €
                    {" "}
                    {totalMarket}
                  </h2>

                </div>

                <div className="statCard">

                  <small>
                    Portfolio
                  </small>

                  <h2>
                    €
                    {" "}
                    {portfolioValue}
                  </h2>

                </div>

                <div className="statCard">

                  <small>
                    Watchlist
                  </small>

                  <h2>
                    {watchlist.length}
                  </h2>

                </div>

              </section>

            </>

          )}

          {tab === "market" && (

            <>

              <input

                className="searchInput"

                placeholder="
                Search any wine worldwide...
                "

                value={search}

                onChange={e =>
                  searchWine(
                    e.target.value
                  )
                }

              />

              <section className="marketGrid">

                {searchResults.map(wine => (

                  <div
                    className="wineCard"
                    key={wine.id}
                  >

                    <h2>
                      {wine.name}
                    </h2>

                    <p>
                      {wine.producer}
                    </p>

                    <p>
                      €
                      {" "}
                      {wine.currentPrice}
                    </p>

                    <p>
                      AI Score:
                      {" "}
                      {
                        wine.analysis?.aiScore
                      }
                    </p>

                    <p>
                      Signal:
                      {" "}
                      {
                        wine.analysis?.signal
                      }
                    </p>

                    <button
                      onClick={() =>
                        buyWine(wine.id)
                      }
                    >
                      Add Position
                    </button>

                    <button
                      onClick={() =>
                        toggleWatchlist(
                          wine.id
                        )
                      }
                    >

                      {watchlist.includes(
                        wine.id
                      )

                        ? "Remove Watchlist"

                        : "Add Watchlist"}

                    </button>

                  </div>

                ))}

              </section>

            </>

          )}

          {tab === "analysis" && (

            <section className="chartPanel">

              <h2>
                Watchlist Analysis
              </h2>

              {watchlist.length === 0 && (

                <p>
                  Add wines to watchlist
                  from Market section.
                </p>

              )}

              <div className="chartBox">

                <ResponsiveContainer
                  width="100%"
                  height={560}
                >

                  <LineChart
                    data={chartData}
                  >

                    <CartesianGrid
                      stroke="#1f1f1f"
                    />

                    <XAxis
                      dataKey="date"
                      stroke="#888"
                    />

                    <YAxis
                      stroke="#888"
                    />

                    <Tooltip />

                    <Legend />

                    {watchlist.map(
                      (
                        wineId,
                        index
                      ) => {

                        const wine =
                          wines.find(
                            w =>
                              w.id ===
                              wineId
                          );

                        return (

                          <Line
                            key={wineId}
                            type="monotone"
                            dataKey={wineId}
                            name={
                              wine?.name
                            }
                            stroke={
                              colors[
                                index %
                                colors.length
                              ]
                            }
                            strokeWidth={4}
                            dot={false}
                          />

                        );

                      }
                    )}

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </section>

          )}

          {tab === "portfolio" && (

            <section className="ordersPanel">

              <h2>
                AI Portfolio Builder
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 20,
                  flexWrap: "wrap"
                }}
              >

                <input

                  type="number"

                  value={budget}

                  onChange={e =>
                    setBudget(
                      Number(e.target.value)
                    )
                  }

                  className="searchInput"

                />

                <select

                  value={risk}

                  onChange={e =>
                    setRisk(e.target.value)
                  }

                  className="searchInput"

                >

                  <option value="basso">
                    Low Risk
                  </option>

                  <option value="medio">
                    Medium Risk
                  </option>

                  <option value="alto">
                    High Risk
                  </option>

                </select>

                <input

                  type="number"

                  value={years}

                  onChange={e =>
                    setYears(
                      Number(e.target.value)
                    )
                  }

                  className="searchInput"

                />

                <button
                  onClick={
                    generatePortfolio
                  }
                >
                  Generate Portfolio
                </button>

              </div>

              {portfolio && (

                <>

                  <div className="statsGrid">

                    <div className="statCard">

                      <small>
                        Expected ROI
                      </small>

                      <h2>
                        {
                          portfolio.expectedROI
                        }%
                      </h2>

                    </div>

                    <div className="statCard">

                      <small>
                        Expected Profit
                      </small>

                      <h2>
                        €
                        {" "}
                        {
                          portfolio.expectedProfit
                        }
                      </h2>

                    </div>

                    <div className="statCard">

                      <small>
                        Expected Value
                      </small>

                      <h2>
                        €
                        {" "}
                        {
                          portfolio.expectedValue
                        }
                      </h2>

                    </div>

                  </div>

                  <div
                    style={{
                      marginTop: 30
                    }}
                  >

                    {portfolio.allocation.map(
                      item => (

                        <div
                          key={item.wineId}
                          className="wineCard"
                        >

                          <h2>
                            {item.wineName}
                          </h2>

                          <p>
                            {item.region}
                          </p>

                          <p>
                            Signal:
                            {" "}
                            {item.signal}
                          </p>

                          <p>
                            AI Score:
                            {" "}
                            {item.aiScore}
                          </p>

                          <p>
                            Bottles:
                            {" "}
                            {
                              item.estimatedBottles
                            }
                          </p>

                          <p>
                            Allocation:
                            {" "}
                            €
                            {" "}
                            {
                              item.allocatedAmount
                            }
                          </p>

                          <p>
                            Estimated Return:
                            {" "}
                            €
                            {" "}
                            {
                              item.estimatedReturn
                            }
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </>

              )}

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