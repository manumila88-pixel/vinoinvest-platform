import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
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

    try {

      const ordersRes = await fetch(`${API}/api/orders`);
      const ordersData = await ordersRes.json();

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else {
        setOrders([]);
      }

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

    loadData();

  }

  const totalMarket = wines.reduce(
    (sum, wine) => sum + Number(wine.currentPrice || 0),
    0
  );

  const chartData = wines.map(wine => ({
    name: wine.name,
    value: wine.currentPrice
  }));

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

          <button>Dashboard</button>
          <button className="active">Market</button>
          <button>Analysis</button>
          <button>Partners</button>
          <button>Wine</button>

        </aside>

        <section className="content">

          <section className="hero">

            <div className="heroText">

              <h1>
                Piattaforma pronta per dati reali,
                storico, stime e ordini sicuri.
              </h1>

              <p>
                Backend collegato. Database attivo.
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

          <section className="chartPanel">

            <h2>Market Performance</h2>

            <div className="chartBox">

              {chartData.map(item => (

                <div
                  key={item.name}
                  style={{
                    marginBottom: "22px"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px"
                    }}
                  >

                    <span>{item.name}</span>

                    <span>
                      € {item.value}
                    </span>

                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "14px",
                      background: "#1c1207",
                      borderRadius: "20px",
                      overflow: "hidden"
                    }}
                  >

                    <div
                      style={{
                        width: `${item.value / 12}%`,
                        height: "100%",
                        background: "#c9a227"
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </section>

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

        </section>

      </main>

    </div>

  );

}

createRoot(
  document.getElementById("root")
).render(<App />);