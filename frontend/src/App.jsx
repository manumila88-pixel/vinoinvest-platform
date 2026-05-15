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
  CartesianGrid
} from "recharts";

import "./style.css";

const API =
  "https://vinoinvest-backend-2.onrender.com";

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

  const [chartData, setChartData] =
    useState([]);

  const [selectedWine, setSelectedWine] =
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

    try {

      const winesRes =
        await fetch(
          `${API}/api/market/wines`
        );

      const winesData =
        await winesRes.json();

      setWines(winesData);

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

    } catch (error) {

      console.error(error);

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

  async function loadChart(
    wineId
  ) {

    try {

      const res =
        await fetch(
          `${API}/api/price-history/${wineId}`
        );

      const data =
        await res.json();

      const formatted =
        data.points.map(
          item => ({

            date:
              item.date.slice(0, 4),

            price:
              item.price

          })
        );

      setChartData(
        formatted
      );

    } catch (error) {

      console.error(error);

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

  async function buyWine(wineId, purchasePrice) {

    await fetch(
      `${API}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wineId,
          quantity: 1,
          purchasePrice
        })
      }
    );

    loadData();

    alert(
      "Position added"
    );

  }

  async function toggleWatchlist(
    wine
  ) {

    const wineId =
      wine.id;

    if (
      watchlist.includes(wineId)
    ) {

      setWatchlist(
        watchlist.filter(
          id => id !== wineId
        )
      );

      setSelectedWine(null);

      setChartData([]);

    } else {

      setWatchlist([
        ...watchlist,
        wineId
      ]);

      setSelectedWine(wine);

      loadChart(wineId);

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
  orders
    .map(order => {

      const wine =
        wines.find(
          w =>
            w.id ===
            (
              order.wine_id ||
              order.wineId
            )
        );

      if (!wine) {
        return null;
      }

      const quantity =
        Number(
          order.quantity || 1
        );

      const purchasePrice =
        Number(
          order.purchasePrice || 0
        );

      const currentPrice =
  Number(order.currentMarketPrice) ||
  Number(wine.currentPrice || 0);

      const invested =
        purchasePrice *
        quantity;

      const currentValue =
        currentPrice *
        quantity;

      const profit =
        currentValue -
        invested;

      const roi =
        invested > 0

          ? (
              (
                profit /
                invested
              ) * 100
            ).toFixed(2)

          : 0;

      return {

        id:
          wine.id,

        name:
          wine.name,

        quantity,

        purchasePrice,

        currentPrice,

        invested,

        currentValue,

        profit,

        roi,

        purchaseDate:
          order.purchaseDate

      };

    })
    .filter(Boolean);

  const portfolioValue =
  holdings.reduce(
    (sum, item) =>
      sum +
      item.currentValue,
    0
  );

const totalInvested =
  holdings.reduce(

    (sum, item) =>
      sum +
      item.invested,

    0

  );

const totalProfit =
  portfolioValue -
  totalInvested;

const portfolioROI =
  totalInvested > 0

    ? (
        (
          totalProfit /
          totalInvested
        ) * 100
      ).toFixed(2)

    : 0;

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
    tab === "myportfolio"
      ? "active"
      : ""
  }
  onClick={() =>
    setTab("myportfolio")
  }
>
  My Portfolio
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
      {totalMarket.toFixed(0)}
    </h2>

  </div>

  <div className="statCard">

    <small>
      Portfolio Value
    </small>

    <h2>
      €
      {" "}
      {portfolioValue.toFixed(0)}
    </h2>

  </div>

  <div className="statCard">

    <small>
      Invested
    </small>

    <h2>
      €
      {" "}
      {totalInvested.toFixed(0)}
    </h2>

  </div>

  <div className="statCard">

    <small>
      Profit / Loss
    </small>

    <h2>
      €
      {" "}
      {totalProfit.toFixed(0)}
    </h2>

  </div>

  <div className="statCard">

  <small>
    ROI
  </small>

  <h2>
    {portfolioROI}%
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

                {searchResults.map(
                  wine => (

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
                        {wine.region}
                        {" · "}
                        {wine.country}
                      </p>

                      <p>
                        €
                        {" "}
                        {
                          wine.currentPrice
                        }
                      </p>

                      <p>
                        AI Score:
                        {" "}
                        {
                          wine.analysis
                            ?.aiScore
                        }
                      </p>

                      <p>
                        Signal:
                        {" "}
                        {
                          wine.analysis
                            ?.signal
                        }
                      </p>

                      <p>
                        Estimated Return:
                        {" "}
                        €
                        {" "}
                        {
                          wine.estimatedReturn || 0
                        }
                      </p>

                      <p>
                        Trust Level:
                        {" "}
                        {
                          wine.analysis
                            ?.trustLevel || "High"
                        }
                      </p>

                      <p>
                        Risk:
                        {" "}
                        {wine.risk}
                      </p>

                      <p>
                        Trend:
                        {" "}
                        {wine.marketTrend}
                      </p>

                      <button
                        onClick={() => buyWine(wine.id, wine.currentPrice)}
                      >
                        Add Position
                      </button>

                      <button
                        onClick={() =>
                          toggleWatchlist(
                            wine
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

                  )
                )}

              </section>

            </>

          )}

          {tab === "analysis" && (

            <section className="chartPanel">

              <h2>
                Watchlist Analysis
              </h2>

              {!selectedWine && (

                <p>
                  Add wines to
                  watchlist from
                  Market section.
                </p>

              )}

              {selectedWine && (

                <div
                  style={{
                    marginBottom: 30
                  }}
                >

                  <h3
                    style={{
                      fontSize: 28,
                      marginBottom: 10
                    }}
                  >

                    {
                      selectedWine.name
                    }

                  </h3>

                  <p>
                    Current Price:
                    {" "}
                    €
                    {" "}
                    {
                      selectedWine.currentPrice
                    }
                  </p>

                  <p>
                    Investment Score:
                    {" "}
                    {
                      selectedWine
                        .investmentScore
                    }
                  </p>

                </div>

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

                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#c9a227"
                      strokeWidth={4}
                      dot={true}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </section>

          )}

{tab === "myportfolio" && (
  <section className="ordersPanel">

    <h2 style={{ marginBottom: 24 }}>My Portfolio</h2>

    {holdings.length === 0 && (
      <p style={{ color: "#888" }}>
        No positions yet. Go to Market and add a position.
      </p>
    )}

    {holdings.length > 0 && (
      <>
        <div className="statsGrid" style={{ marginBottom: 32 }}>
          <div className="statCard">
            <small>Portfolio Value</small>
            <h2>€ {portfolioValue.toFixed(0)}</h2>
          </div>
          <div className="statCard">
            <small>Total Invested</small>
            <h2>€ {totalInvested.toFixed(0)}</h2>
          </div>
          <div className="statCard">
            <small>Profit / Loss</small>
            <h2 style={{ color: totalProfit >= 0 ? "#4caf50" : "#e53935" }}>
              € {totalProfit.toFixed(0)}
            </h2>
          </div>
          <div className="statCard">
            <small>ROI</small>
            <h2 style={{ color: portfolioROI >= 0 ? "#4caf50" : "#e53935" }}>
              {portfolioROI}%
            </h2>
          </div>
        </div>

        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14
        }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333", color: "#888" }}>
              <th style={{ textAlign: "left", padding: "10px 8px" }}>Wine</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>Bottles</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>Buy Price</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>Current</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>Invested</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>Value</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>P/L</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>ROI</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>1Y Est.</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>5Y Est.</th>
              <th style={{ textAlign: "right", padding: "10px 8px" }}>10Y Est.</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => {
              const est1y  = (h.currentValue * 1.08).toFixed(0);
              const est5y  = (h.currentValue * Math.pow(1.08, 5)).toFixed(0);
              const est10y = (h.currentValue * Math.pow(1.08, 10)).toFixed(0);
              return (
                <tr key={h.id} style={{
                  borderBottom: "1px solid #1a1a1a",
                  background: i % 2 === 0 ? "transparent" : "#0d0d0d"
                }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>{h.name}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px" }}>{h.quantity}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px" }}>€ {h.purchasePrice}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px" }}>€ {h.currentPrice}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px" }}>€ {h.invested.toFixed(0)}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px" }}>€ {h.currentValue.toFixed(0)}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px",
                    color: h.profit >= 0 ? "#4caf50" : "#e53935" }}>
                    {h.profit >= 0 ? "+" : ""}€ {h.profit.toFixed(0)}
                  </td>
                  <td style={{ textAlign: "right", padding: "12px 8px",
                    color: h.roi >= 0 ? "#4caf50" : "#e53935" }}>
                    {h.roi >= 0 ? "+" : ""}{h.roi}%
                  </td>
                  <td style={{ textAlign: "right", padding: "12px 8px", color: "#c9a227" }}>€ {est1y}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px", color: "#c9a227" }}>€ {est5y}</td>
                  <td style={{ textAlign: "right", padding: "12px 8px", color: "#c9a227" }}>€ {est10y}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

<div style={{ marginTop: 40, marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: "#c9a227" }}>
            Portfolio Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={(() => {
                const months = [];
                const now = new Date();
                for (let i = 11; i >= 0; i--) {
                  const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                  const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
                  const factor = 1 - (i * 0.008);
                  months.push({
                    date: label,
                    value: Math.round(portfolioValue * factor)
                  });
                }
                return months;
              })()}
            >
              <CartesianGrid stroke="#1a1a1a" />
              <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fontSize: 11 }} tickFormatter={v => `€${v}`} />
              <Tooltip formatter={v => [`€${v}`, "Portfolio"]} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#c9a227"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "#555" }}>
          * Estimated values based on 8% average annual growth (wine market historical avera...
          
        <p style={{ marginTop: 16, fontSize: 12, color: "#555" }}>
          * Estimated values based on 8% average annual growth (wine market historical average)
        </p>
      </>
    )}

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
                      Number(
                        e.target.value
                      )
                    )
                  }

                  className="searchInput"

                />

                <select

                  value={risk}

                  onChange={e =>
                    setRisk(
                      e.target.value
                    )
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
                      Number(
                        e.target.value
                      )
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
                          portfolio
                            .expectedROI
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
                          portfolio
                            .expectedProfit
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
                          portfolio
                            .expectedValue
                        }
                      </h2>

                    </div>

                  </div>

                  <div
                    style={{
                      marginTop: 30
                    }}
                  >

                    {portfolio
                      .allocation.map(
                        item => (

                          <div
                            key={
                              item.wineId
                            }
                            className="wineCard"
                          >

                            <h2>
                              {
                                item.wineName
                              }
                            </h2>

                            <p>
                              {
                                item.region
                              }
                            </p>

                            <p>
                              Signal:
                              {" "}
                              {
                                item.signal
                              }
                            </p>

                            <p>
                              AI Score:
                              {" "}
                              {
                                item.aiScore
                              }
                            </p>

                            <p>
                              Bottles:
                              {" "}
                              {
                                item
                                  .estimatedBottles
                              }
                            </p>

                            <p>
                              Allocation:
                              {" "}
                              €
                              {" "}
                              {
                                item
                                  .allocatedAmount
                              }
                            </p>

                            <p>
                              Estimated Return:
                              {" "}
                              €
                              {" "}
                              {
                                item
                                  .estimatedReturn
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