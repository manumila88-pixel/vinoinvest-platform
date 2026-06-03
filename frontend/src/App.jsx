import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import LandingPage from "./LandingPage";
import { supabase } from "./lib/supabase";
import WineBottle3D from "./WineBottle3D";
import WineBottle3DModal from "./WineBottle3DModal";
import "./style.css";

const API = "https://vinoinvest-backend-2.onrender.com";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accountType, setAccountType] = useState("b2c");
  const [tab, setTab] = useState("dashboard");
  const [modalWine, setModalWine] = useState(null);
  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedWine, setSelectedWine] = useState(null);
  const [budget, setBudget] = useState(10000);
  const [risk, setRisk] = useState("medio");
  const [years, setYears] = useState(5);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION" && session) {
        const { data: userData } = await supabase.from("users").select("account_type").eq("id", session.user.id).single();
        const type = userData?.account_type || "b2c";
        setUserEmail(session.user.email);
        setAccountType(type);
        setIsLoggedIn(true);
        localStorage.setItem("vino_user", JSON.stringify({ email: session.user.email, account_type: type }));
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUserEmail("");
        setAccountType("b2c");
        localStorage.removeItem("vino_user");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (isLoggedIn) loadData(); }, [isLoggedIn]);

  async function loadData() {
    try {
      const winesRes = await fetch(`${API}/api/market/wines`);
      const winesData = await winesRes.json();
      setWines(winesData);
      const ordersRes = await fetch(`${API}/api/orders`);
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) { console.error(error); }
  }

  async function searchWine(value) {
    setSearch(value);
    if (!value.trim()) { setSearchResults([]); return; }
    try {
      const res = await fetch(`${API}/api/global-search?q=${value}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) { console.error(error); setSearchResults([]); }
  }

  async function loadChart(wineId) {
    try {
      const res = await fetch(`${API}/api/price-history/${wineId}`);
      const data = await res.json();
      setChartData(data.points.map(item => ({ date: item.date.slice(0, 4), price: item.price })));
    } catch (error) { console.error(error); }
  }

  async function generatePortfolio() {
    try {
      const res = await fetch(`${API}/api/portfolio-builder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, risk, horizonYears: years })
      });
      const data = await res.json();
      setPortfolio(data);
    } catch (error) { console.error(error); }
  }

  async function buyWine(wineId, purchasePrice) {
    await fetch(`${API}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId, quantity: 1, purchasePrice })
    });
    loadData();
    alert("Position added");
  }

  async function toggleWatchlist(wine) {
    const wineId = wine.id;
    if (watchlist.includes(wineId)) {
      setWatchlist(watchlist.filter(id => id !== wineId));
      setSelectedWine(null);
      setChartData([]);
    } else {
      setWatchlist([...watchlist, wineId]);
      setSelectedWine(wine);
      loadChart(wineId);
    }
  }

  const totalMarket = wines.reduce((sum, wine) => sum + Number(wine.currentPrice || 0), 0);

  const holdings = orders.map(order => {
    const wine = wines.find(w => w.id === (order.wine_id || order.wineId));
    if (!wine) return null;
    const quantity = Number(order.quantity || 1);
    const purchasePrice = Number(order.purchasePrice || 0);
    const currentPrice = Number(order.currentMarketPrice) || Number(wine.currentPrice || 0);
    const invested = purchasePrice * quantity;
    const currentValue = currentPrice * quantity;
    const profit = currentValue - invested;
    const roi = invested > 0 ? ((profit / invested) * 100).toFixed(2) : 0;
    return { id: wine.id, name: wine.name, quantity, purchasePrice, currentPrice, invested, currentValue, profit, roi };
  }).filter(Boolean);

  const portfolioValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvested = holdings.reduce((sum, item) => sum + item.invested, 0);
  const totalProfit = portfolioValue - totalInvested;
  const portfolioROI = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;

  const growthData = [
    { date: "Jun 25", value: Math.round(portfolioValue * 0.912) },
    { date: "Jul 25", value: Math.round(portfolioValue * 0.920) },
    { date: "Aug 25", value: Math.round(portfolioValue * 0.928) },
    { date: "Sep 25", value: Math.round(portfolioValue * 0.936) },
    { date: "Oct 25", value: Math.round(portfolioValue * 0.944) },
    { date: "Nov 25", value: Math.round(portfolioValue * 0.952) },
    { date: "Dec 25", value: Math.round(portfolioValue * 0.960) },
    { date: "Jan 26", value: Math.round(portfolioValue * 0.968) },
    { date: "Feb 26", value: Math.round(portfolioValue * 0.976) },
    { date: "Mar 26", value: Math.round(portfolioValue * 0.984) },
    { date: "Apr 26", value: Math.round(portfolioValue * 0.992) },
    { date: "May 26", value: Math.round(portfolioValue * 1.000) }
  ];

  if (!isLoggedIn) {
    return (
      <LandingPage
        onLogin={({ user, account_type }) => {
          setUserEmail(user.email);
          setAccountType(account_type);
          setIsLoggedIn(true);
          localStorage.setItem("vino_user", JSON.stringify({ email: user.email, account_type }));
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🍷 Vino<span>Invest</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="badge">global wine intelligence</div>
          {userEmail && <span style={{ fontSize: 13, color: "#475569" }}>{userEmail}</span>}
          {accountType && <span style={{ fontSize: 11, color: "#c9a227", border: "1px solid #c9a22744", borderRadius: 4, padding: "2px 7px", textTransform: "uppercase" }}>{accountType}</span>}
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            style={{ padding: "6px 16px", border: "1px solid #1e293b", borderRadius: 8, background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="main">
        <aside className="sidebar">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
          <button className={tab === "market" ? "active" : ""} onClick={() => setTab("market")}>Market</button>
          <button className={tab === "analysis" ? "active" : ""} onClick={() => setTab("analysis")}>Analysis</button>
          <button className={tab === "myportfolio" ? "active" : ""} onClick={() => setTab("myportfolio")}>My Portfolio</button>
          <button className={tab === "portfolio" ? "active" : ""} onClick={() => setTab("portfolio")}>Portfolio AI</button>
        </aside>
        <section className="content">
          {tab === "dashboard" && (
            <>
              <section className="hero">
                <div className="heroText">
                  <h1>Global Wine Investment Platform</h1>
                  <p>AI portfolio builder, wine intelligence, analytics and worldwide search.</p>
                </div>
              </section>
              <section className="statsGrid">
                <div className="statCard"><small>Global Market</small><h2>€ {totalMarket.toFixed(0)}</h2></div>
                <div className="statCard"><small>Portfolio Value</small><h2>€ {portfolioValue.toFixed(0)}</h2></div>
                <div className="statCard"><small>Invested</small><h2>€ {totalInvested.toFixed(0)}</h2></div>
                <div className="statCard"><small>Profit / Loss</small><h2>€ {totalProfit.toFixed(0)}</h2></div>
                <div className="statCard"><small>ROI</small><h2>{portfolioROI}%</h2></div>
                <div className="statCard"><small>Watchlist</small><h2>{watchlist.length}</h2></div>
              </section>
            </>
          )}
          {tab === "market" && (
            <>
              <input className="searchInput" placeholder="Search any wine worldwide..." value={search} onChange={e => searchWine(e.target.value)} />
              <section className="marketGrid">
                {searchResults.map(wine => (
                  <div className="wineCard" key={wine.id}>
                    <div className="wineCard-image" onClick={() => setModalWine(wine)}>
                      <WineBottle3D wine={wine} />
                      <span className="bottle-hint">3D</span>
                    </div>
                    <div className="wineCard-body">
                      <div className="wineCard-badges">
                        <span className={"badge-risk " + (wine.risk || "medio").toLowerCase()}>{wine.risk || "Medio"}</span>
                        {wine.marketTrend && <span className="badge-trend">{wine.marketTrend}</span>}
                      </div>
                      <h2>{wine.name}</h2>
                      <p className="wineCard-producer">{wine.producer} · {wine.vintage || ""}</p>
                      <div className="wineCard-score">
                        <span className="score-label">{wine.analysis && wine.analysis.aiScore ? wine.analysis.aiScore : wine.investmentScore || "—"}</span>
                        <div className="score-bar"><div className="score-fill" style={{width: (wine.analysis && wine.analysis.aiScore ? wine.analysis.aiScore : wine.investmentScore || 75) + "%"}}></div></div>
                        <span style={{fontSize:11,color:"#475569"}}>AI Score</span>
                      </div>
                      <div className="wineCard-price">
                        <span className="price-main">€ {wine.currentPrice}</span>
                        <span className="price-label">/ bottle</span>
                      </div>
                      <div className="wineCard-actions">
                        {wine.platforms && (
                          <div style={{marginBottom:12,width:"100%"}}>
                            <p style={{fontSize:11,color:"#475569",marginBottom:6,textTransform:"uppercase"}}>Compare Prices</p>
                            {wine.platforms.map(p => (
                              <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #0f1923"}}>
                                <span style={{fontSize:12,color:"#94a3b8"}}>{p.logo} {p.name}</span>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <span style={{fontSize:13,fontWeight:700}}>€ {p.price}</span>
                                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,padding:"2px 7px",background:"#c9a227",color:"black",borderRadius:5,fontWeight:700,textDecoration:"none"}}>Buy</a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button className="btn-primary" onClick={() => buyWine(wine.id, wine.currentPrice)}>+ Add to Portfolio</button>
                        <button className={"btn-secondary " + (watchlist.includes(wine.id) ? "active" : "")} onClick={() => toggleWatchlist(wine)}>
                          {watchlist.includes(wine.id) ? "★" : "☆"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}
          {tab === "analysis" && (
            <section className="chartPanel">
              <h2>Watchlist Analysis</h2>
              {!selectedWine && <p>Add wines to watchlist from Market section.</p>}
              {selectedWine && (
                <div style={{marginBottom:30}}>
                  <h3 style={{fontSize:28,marginBottom:10}}>{selectedWine.name}</h3>
                  <p>Current Price: € {selectedWine.currentPrice}</p>
                  <p>Investment Score: {selectedWine.investmentScore}</p>
                </div>
              )}
              <div className="chartBox">
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#1f1f1f" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#c9a227" strokeWidth={4} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
          {tab === "myportfolio" && (
            <section className="ordersPanel">
              <h2 style={{marginBottom:24}}>My Portfolio</h2>
              {holdings.length === 0 && <p style={{color:"#888"}}>No positions yet. Go to Market and add a position.</p>}
              {holdings.length > 0 && (
                <>
                  <div className="statsGrid" style={{marginBottom:32}}>
                    <div className="statCard"><small>Portfolio Value</small><h2>€ {portfolioValue.toFixed(0)}</h2></div>
                    <div className="statCard"><small>Total Invested</small><h2>€ {totalInvested.toFixed(0)}</h2></div>
                    <div className="statCard"><small>Profit / Loss</small><h2 style={{color:totalProfit>=0?"#4caf50":"#e53935"}}>€ {totalProfit.toFixed(0)}</h2></div>
                    <div className="statCard"><small>ROI</small><h2 style={{color:portfolioROI>=0?"#4caf50":"#e53935"}}>{portfolioROI}%</h2></div>
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid #333",color:"#888"}}>
                        <th style={{textAlign:"left",padding:"10px 8px"}}>Wine</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>Bottles</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>Buy Price</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>Current</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>Invested</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>Value</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>P/L</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>ROI</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>1Y Est.</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>5Y Est.</th>
                        <th style={{textAlign:"right",padding:"10px 8px"}}>10Y Est.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((h,i) => {
                        const est1y = (h.currentValue*1.08).toFixed(0);
                        const est5y = (h.currentValue*Math.pow(1.08,5)).toFixed(0);
                        const est10y = (h.currentValue*Math.pow(1.08,10)).toFixed(0);
                        return (
                          <tr key={h.id} style={{borderBottom:"1px solid #1a1a1a",background:i%2===0?"transparent":"#0d0d0d"}}>
                            <td style={{padding:"12px 8px",fontWeight:500}}>{h.name}</td>
                            <td style={{textAlign:"right",padding:"12px 8px"}}>{h.quantity}</td>
                            <td style={{textAlign:"right",padding:"12px 8px"}}>€ {h.purchasePrice}</td>
                            <td style={{textAlign:"right",padding:"12px 8px"}}>€ {h.currentPrice}</td>
                            <td style={{textAlign:"right",padding:"12px 8px"}}>€ {h.invested.toFixed(0)}</td>
                            <td style={{textAlign:"right",padding:"12px 8px"}}>€ {h.currentValue.toFixed(0)}</td>
                            <td style={{textAlign:"right",padding:"12px 8px",color:h.profit>=0?"#4caf50":"#e53935"}}>{h.profit>=0?"+":""}€ {h.profit.toFixed(0)}</td>
                            <td style={{textAlign:"right",padding:"12px 8px",color:h.roi>=0?"#4caf50":"#e53935"}}>{h.roi>=0?"+":""}{h.roi}%</td>
                            <td style={{textAlign:"right",padding:"12px 8px",color:"#c9a227"}}>€ {est1y}</td>
                            <td style={{textAlign:"right",padding:"12px 8px",color:"#c9a227"}}>€ {est5y}</td>
                            <td style={{textAlign:"right",padding:"12px 8px",color:"#c9a227"}}>€ {est10y}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{marginTop:40,marginBottom:20,width:"100%"}}>
                    <h3 style={{fontSize:18,marginBottom:16,color:"#c9a227"}}>Portfolio Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={growthData}>
                        <CartesianGrid stroke="#1a1a1a" />
                        <XAxis dataKey="date" stroke="#555" tick={{fontSize:11}} />
                        <YAxis stroke="#555" tick={{fontSize:11}} tickFormatter={v => "€"+v} />
                        <Tooltip formatter={v => ["€"+v,"Portfolio"]} />
                        <Line type="monotone" dataKey="value" stroke="#c9a227" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p style={{marginTop:16,fontSize:12,color:"#555"}}>* Estimated values based on 8% average annual growth (wine market historical average)</p>
                </>
              )}
            </section>
          )}
          {tab === "portfolio" && (
            <section className="ordersPanel">
              <h2>AI Portfolio Builder</h2>
              <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
                <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="searchInput" />
                <select value={risk} onChange={e => setRisk(e.target.value)} className="searchInput">
                  <option value="basso">Low Risk</option>
                  <option value="medio">Medium Risk</option>
                  <option value="alto">High Risk</option>
                </select>
                <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="searchInput" />
                <button onClick={generatePortfolio}>Generate Portfolio</button>
              </div>
              {portfolio && (
                <>
                  <div className="statsGrid">
                    <div className="statCard"><small>Expected ROI</small><h2>{portfolio.expectedROI}%</h2></div>
                    <div className="statCard"><small>Expected Profit</small><h2>€ {portfolio.expectedProfit}</h2></div>
                    <div className="statCard"><small>Expected Value</small><h2>€ {portfolio.expectedValue}</h2></div>
                  </div>
                  <div style={{marginTop:30}}>
                    {portfolio.allocation.map(item => (
                      <div key={item.wineId} className="wineCard" style={{marginBottom:16}}>
                        <div className="wineCard-body">
                          <h2>{item.wineName}</h2>
                          <p className="wineCard-producer">{item.region}</p>
                          <p>Signal: {item.signal} · AI Score: {item.aiScore}</p>
                          <p>Bottles: {item.estimatedBottles} · Allocation: € {item.allocatedAmount}</p>
                          <p>Estimated Return: € {item.estimatedReturn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}
        </section>
      </main>

      {modalWine && (
        <WineBottle3DModal wine={modalWine} onClose={() => setModalWine(null)} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
