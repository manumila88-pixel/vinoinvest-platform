import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = "https://vinoinvest-backend.onrender.com";
function App() {
  const [tab, setTab] = useState("dashboard");
  const [wines, setWines] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedWine, setSelectedWine] = useState(null);
  const [orderResult, setOrderResult] = useState("");

  useEffect(() => {
    fetch(`${API}/api/market/wines`)
      .then(r => r.json())
      .then(setWines)
      .catch(() => setWines([]));
  }, []);

  async function runAnalysis() {
    const res = await fetch(`${API}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget: 25000, horizonYears: 7, risk: "medio" })
    });
    setAnalysis(await res.json());
  }

  async function openWine(id) {
    const res = await fetch(`${API}/api/market/wines/${id}`);
    setSelectedWine(await res.json());
    setTab("wine");
  }

  async function buyDemo(wine) {
    const res = await fetch(`${API}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ side: "BUY", wineId: wine.id, quantity: 1, maxPrice: wine.currentPrice })
    });
    const data = await res.json();
    setOrderResult(data.message || data.error);
  }

  return (
    <div>
      <header>
        <div className="logo">🍷 Vino<span>Invest</span> Platform</div>
        <div className="badge">real-data ready</div>
      </header>

      <main>
        <aside>
          {["dashboard","market","analysis","partners","wine"].map(x => (
            <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>
              {x}
            </button>
          ))}
        </aside>

        <section>
          {tab === "dashboard" && (
            <>
              <div className="hero">
                <h1>Piattaforma pronta per dati reali, storico, stime e ordini sicuri.</h1>
                <p>Ora il frontend parla con un backend. Il backend può collegarsi a Liv-ex e partner ufficiali.</p>
              </div>

              <div className="grid">
                <div className="card"><small>Mercato</small><strong>{wines.length} asset</strong></div>
                <div className="card"><small>Fonte</small><strong>Demo / API ready</strong></div>
                <div className="card"><small>Ordini</small><strong>Simulati</strong></div>
              </div>
            </>
          )}

          {tab === "market" && (
            <div className="cards">
              {wines.map(w => (
                <div className="card" key={w.id}>
                  <h3>{w.name}</h3>
                  <p>{w.region}</p>
                  <p>Prezzo stimato: € {w.currentPrice}</p>
                  <p>Rischio: {w.risk}</p>
                  <button onClick={() => openWine(w.id)}>Apri storico</button>
                  <button onClick={() => buyDemo(w)}>Compra demo</button>
                </div>
              ))}
              {orderResult && <div className="notice">{orderResult}</div>}
            </div>
          )}

          {tab === "analysis" && (
            <div className="card">
              <h2>Analisi investimento</h2>
              <button onClick={runAnalysis}>Esegui analisi</button>
              {analysis && (
                <>
                  <p>{analysis.summary}</p>
                  <h3>Allocazione</h3>
                  {analysis.suggestedAllocation.map(a => <p key={a.category}>{a.category}: {a.weight}%</p>)}
                  <h3>Migliori asset</h3>
                  {analysis.topWines.map(w => <p key={w.id}>{w.name}: CAGR demo {w.cagr}%</p>)}
                </>
              )}
            </div>
          )}

          {tab === "partners" && (
            <div className="card">
              <h2>Integrazioni reali</h2>
              <p><b>Liv-ex:</b> predisposto per Market Price, Auction Data e automazione.</p>
              <p><b>Vinovest / Cult Wines:</b> usare come partner o link finché non rilasciano accesso API.</p>
              <p><b>Ordini:</b> reali solo tramite API partner ufficiale. Mai scraping o bot.</p>
            </div>
          )}

          {tab === "wine" && selectedWine && (
            <div className="card">
              <h2>{selectedWine.name}</h2>
              <p>Fonte Liv-ex: {selectedWine.livex?.source || "configurata"}</p>
              <h3>Storico prezzi</h3>
              {selectedWine.history.map(p => <p key={p.date}>{p.date}: € {p.price}</p>)}
              <h3>Stima futura</h3>
              {selectedWine.forecast.map(f => <p key={f.year}>{f.year}: € {f.estimatedPrice} — CAGR {f.cagr}%</p>)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
