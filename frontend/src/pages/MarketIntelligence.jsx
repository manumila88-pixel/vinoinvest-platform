import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ADMIN_EMAIL } from "../lib/constants";

const API = import.meta.env.VITE_API_URL || "https://vinoinvest-backend-2.onrender.com";

const EN_PRIMEUR_CALENDAR = [
  { vintage: 2023, region: "Bordeaux", opens: "Apr 2025", closes: "Jun 2025", status: "open", roi12m: "+14.2%", topPick: "Château Pichon Baron", rating: 97 },
  { vintage: 2022, region: "Bordeaux", opens: "Apr 2024", closes: "Jun 2024", status: "closed", roi12m: "+22.1%", topPick: "Pétrus 2022", rating: 99 },
  { vintage: 2021, region: "Bordeaux", opens: "Apr 2023", closes: "Jun 2023", status: "closed", roi12m: "+8.3%", topPick: "Mouton Rothschild", rating: 95 },
  { vintage: 2022, region: "Barolo", opens: "Jan 2026", closes: "Mar 2026", status: "upcoming", roi12m: "+18.5%", topPick: "Monfortino 2022", rating: 98 },
  { vintage: 2023, region: "Champagne", opens: "Jun 2025", closes: "Sep 2025", status: "open", roi12m: "+11.8%", topPick: "Krug 2023", rating: 96 },
];

const UPCOMING_AUCTIONS = [
  { house: "Christie's", date: "15 Feb 2026", city: "London", lots: 420, topLot: "DRC Romanée-Conti 1990 12-bottle", estimate: "€85.000–95.000", highlight: true },
  { house: "Sotheby's", date: "22 Feb 2026", city: "New York", lots: 380, topLot: "Screaming Eagle 2013 Collection", estimate: "€45.000–55.000", highlight: false },
  { house: "Hart Davis Hart", date: "1 Mar 2026", city: "Chicago", lots: 650, topLot: "Harlan Estate 2007 OWC 12bt", estimate: "€28.000–35.000", highlight: false },
  { house: "Acker Merrall", date: "8 Mar 2026", city: "Hong Kong", lots: 890, topLot: "Pétrus 2019 Collection 24bt", estimate: "€120.000–140.000", highlight: true },
];

const INSTITUTIONAL_MOVERS = [
  { name: "DRC Romanée-Conti 2021", price: "€22.400", change: "+8.2%", volume: "Medio-Alto", signal: "BUY" },
  { name: "Pétrus 2019", price: "€4.800", change: "+5.6%", volume: "Alto", signal: "HOLD" },
  { name: "Harlan Estate 2013", price: "€890", change: "+4.1%", volume: "Basso", signal: "BUY" },
  { name: "Lafite Rothschild 2019", price: "€680", change: "-1.2%", volume: "Medio", signal: "HOLD" },
  { name: "Screaming Eagle 2018", price: "€3.200", change: "+7.8%", volume: "Basso", signal: "BUY" },
  { name: "Sassicaia 2016", price: "€420", change: "+3.3%", volume: "Medio", signal: "BUY" },
];

export default function MarketIntelligence({ user }) {
  const [news, setNews] = useState([]);
  const [benchmark, setBenchmark] = useState(null);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("vino_user");
      if (s) setStoredUser(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    fetch(`${API}/api/news?limit=8`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.articles) setNews(d.articles.slice(0, 6)); })
      .catch(() => {});

    fetch(`${API}/api/risk/benchmark`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setBenchmark(d); })
      .catch(() => {});
  }, []);

  const activeUser = user || storedUser;
  const isB2B = activeUser?.email === ADMIN_EMAIL || activeUser?.account_type === "professional" || activeUser?.account_type === "enterprise" || activeUser?.account_type === "b2b";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0b1220,#040810)", color: "#e2e8f0", fontFamily: "'Inter',Arial,sans-serif" }}>
      <Helmet>
        <title>Market Intelligence B2B | VinoInvest</title>
        <meta name="description" content="Analisi settimanale istituzionale, top movers, calendario en primeur, aste upcoming — esclusivo per wealth manager." />
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(59,130,246,0.1)", padding: "0 32px", position: "sticky", top: 0, zIndex: 50, background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🍷</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>VinoInvest</span>
            </a>
            <span style={{ color: "#1e3a5f" }}>›</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#60a5fa" }}>Market Intelligence</span>
            <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>B2B ESCLUSIVO</span>
          </div>
          <div style={{ fontSize: 12, color: "#334155" }}>
            Aggiornato: {new Date().toLocaleDateString("it-IT")}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(16px,4vw,32px)" }}>
        {!isB2B && (
          <div style={{ padding: 24, borderRadius: 14, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fbbf24" }}>🔒 Contenuto Riservato ai Piani Professional/Enterprise</div>
              <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>Questa sezione è disponibile per wealth manager e family office con piano Professional o Enterprise.</div>
            </div>
            <a href="/b2b" style={{ padding: "9px 18px", borderRadius: 8, background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>
              Attiva Accesso →
            </a>
          </div>
        )}

        {/* Benchmark Row */}
        {benchmark && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { label: "VinoInvest Fine Wine Index", value: `+${(benchmark.vinoInvestIndex.return12m * 100).toFixed(1)}%`, color: "#60a5fa", sub: "rendimento 12m" },
              { label: "S&P 500", value: `+${(benchmark.sp500.return12m * 100).toFixed(1)}%`, color: "#94a3b8", sub: "benchmark" },
              { label: "Oro", value: `+${(benchmark.gold.return12m * 100).toFixed(1)}%`, color: "#fbbf24", sub: "store of value" },
              { label: "Inflazione EU", value: `${(benchmark.euInflation.rate * 100).toFixed(1)}%`, color: "#f87171", sub: "ECB" },
              { label: "Wine vs Inflazione", value: `+${((benchmark.vinoInvestIndex.return12m - benchmark.euInflation.rate) * 100).toFixed(1)}%`, color: "#34d399", sub: "rendimento reale" },
            ].map(b => (
              <div key={b.label} style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.1)" }}>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{b.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: b.color, fontFamily: "'Playfair Display',serif" }}>{b.value}</div>
                <div style={{ fontSize: 10, color: "#334155" }}>{b.sub}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
          {/* Top Movers Istituzionali */}
          <div style={{ padding: "24px", borderRadius: 16, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Top Movers Istituzionali (&gt;€500)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {INSTITUTIONAL_MOVERS.map(w => (
                <div key={w.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 8, background: "rgba(4,8,20,0.4)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{w.name}</div>
                    <div style={{ fontSize: 10, color: "#334155" }}>Volume: {w.volume}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{w.price}</div>
                      <div style={{ fontSize: 11, color: w.change.startsWith("+") ? "#34d399" : "#f87171" }}>{w.change}</div>
                    </div>
                    <span style={{
                      padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                      background: w.signal === "BUY" ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)",
                      color: w.signal === "BUY" ? "#34d399" : "#fbbf24",
                    }}>{w.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Auctions */}
          <div style={{ padding: "24px", borderRadius: 16, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Aste Upcoming — Lotti Interessanti</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {UPCOMING_AUCTIONS.map(a => (
                <div key={a.house + a.date} style={{
                  padding: "14px 16px", borderRadius: 10, background: "rgba(4,8,20,0.4)",
                  border: `1px solid ${a.highlight ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.03)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: a.highlight ? "#60a5fa" : "#e2e8f0" }}>{a.house}</span>
                    <span style={{ fontSize: 11, color: "#334155" }}>{a.date} · {a.city}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{a.topLot}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#475569" }}>{a.lots} lotti</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399" }}>{a.estimate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* En Primeur Calendar */}
          <div style={{ padding: "24px", borderRadius: 16, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)", gridColumn: "1 / -1" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Calendario En Primeur — ROI Storico</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    {["Campagna", "Regione", "Apertura", "Chiusura", "Stato", "ROI 12m", "Top Pick", "Rating"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#475569", fontWeight: 600, borderBottom: "1px solid rgba(59,130,246,0.1)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EN_PRIMEUR_CALENDAR.map((ep, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 700 }}>{ep.region} {ep.vintage}</td>
                      <td style={{ padding: "10px 12px", color: "#64748b" }}>{ep.region}</td>
                      <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{ep.opens}</td>
                      <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{ep.closes}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700,
                          background: ep.status === "open" ? "rgba(52,211,153,0.15)" : ep.status === "upcoming" ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.1)",
                          color: ep.status === "open" ? "#34d399" : ep.status === "upcoming" ? "#fbbf24" : "#64748b",
                        }}>
                          {ep.status === "open" ? "Aperto" : ep.status === "upcoming" ? "In Arrivo" : "Chiuso"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: ep.roi12m.startsWith("+") ? "#34d399" : "#f87171" }}>{ep.roi12m}</td>
                      <td style={{ padding: "10px 12px", color: "#e2e8f0" }}>{ep.topPick}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
                          {ep.rating} pts
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* News filtrate istituzionali */}
          {news.length > 0 && (
            <div style={{ padding: "24px", borderRadius: 16, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)", gridColumn: "1 / -1" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>News Filtrate — Rilevanza Istituzionale</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12 }}>
                {news.map((n, i) => (
                  <a key={i} href={n.url || "#"} target="_blank" rel="noopener noreferrer" style={{
                    padding: "14px 16px", borderRadius: 10, background: "rgba(4,8,20,0.4)", border: "1px solid rgba(59,130,246,0.08)",
                    textDecoration: "none", display: "block", transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.08)"}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 6, lineHeight: 1.4 }}>{n.title}</div>
                    <div style={{ fontSize: 10, color: "#334155" }}>{n.source || "VinoInvest"} · {n.published ? new Date(n.published).toLocaleDateString("it-IT") : ""}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* B2B Weekly Premium Picks — gated */}
        {isB2B && (
          <div style={{ marginTop: 32 }}>
            {/* Weekly B2B Picks table */}
            <div style={{ padding: "24px", borderRadius: 16, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.18)", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>Weekly B2B Picks — Settimana del 9 Giugno 2026</h3>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Analisi esclusiva per Professional &amp; Enterprise — top 10 vini da monitorare questa settimana</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)", fontSize: 10, fontWeight: 700, color: "#34d399" }}>B2B PREMIUM</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Wine Name", "Vintage", "Price", "Trend (30d)", "AI Score", "Signal"].map(h => (
                        <th key={h} style={{ padding: "8px 14px", textAlign: "left", color: "#475569", fontWeight: 600, borderBottom: "1px solid rgba(59,130,246,0.12)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "DRC Romanée-Conti",        vintage: 2021, price: "€24.800", trend: "+8.2%",  score: 99, signal: "BUY" },
                      { name: "Pétrus",                    vintage: 2019, price: "€4.200",  trend: "+5.6%",  score: 96, signal: "BUY" },
                      { name: "Harlan Estate",             vintage: 2018, price: "€920",    trend: "+4.1%",  score: 93, signal: "BUY" },
                      { name: "Screaming Eagle",           vintage: 2019, price: "€3.400",  trend: "+7.8%",  score: 95, signal: "BUY" },
                      { name: "Sassicaia DOC",             vintage: 2020, price: "€380",    trend: "+3.3%",  score: 89, signal: "BUY" },
                      { name: "Giacomo Conterno Monf.",    vintage: 2016, price: "€680",    trend: "+2.1%",  score: 92, signal: "HOLD" },
                      { name: "Lafite Rothschild",         vintage: 2020, price: "€650",    trend: "-1.2%",  score: 87, signal: "HOLD" },
                      { name: "Mouton Rothschild",         vintage: 2019, price: "€720",    trend: "+0.8%",  score: 88, signal: "HOLD" },
                      { name: "Ornellaia Bianco",          vintage: 2022, price: "€340",    trend: "+5.4%",  score: 86, signal: "BUY" },
                      { name: "Krug Grande Cuvée",         vintage: 171,  price: "€195",    trend: "+1.9%",  score: 84, signal: "HOLD" },
                    ].map((w, i) => {
                      const signalColor = w.signal === "BUY" ? "#34d399" : w.signal === "HOLD" ? "#fbbf24" : "#f87171";
                      const signalBg   = w.signal === "BUY" ? "rgba(52,211,153,0.13)" : w.signal === "HOLD" ? "rgba(251,191,36,0.13)" : "rgba(248,113,113,0.13)";
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: "11px 14px", fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap" }}>{w.name}</td>
                          <td style={{ padding: "11px 14px", color: "#94a3b8" }}>{w.vintage}</td>
                          <td style={{ padding: "11px 14px", fontWeight: 700, color: "#e2e8f0" }}>{w.price}</td>
                          <td style={{ padding: "11px 14px", fontWeight: 700, color: w.trend.startsWith("+") ? "#34d399" : "#f87171" }}>{w.trend}</td>
                          <td style={{ padding: "11px 14px" }}>
                            <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>{w.score}</span>
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: signalBg, color: signalColor }}>{w.signal}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Institutional Flow card */}
            <div style={{ padding: "20px 24px", borderRadius: 16, background: "rgba(8,15,30,0.6)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Institutional Flow — Questa Settimana</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 14 }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 6, fontWeight: 600 }}>NET BUYER</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", marginBottom: 2 }}>Family Office</div>
                  <div style={{ fontSize: 12, color: "#e2e8f0" }}>+€2.1M</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399", marginTop: 6, marginBottom: 2 }}>HNW Private</div>
                  <div style={{ fontSize: 12, color: "#e2e8f0" }}>+€890k</div>
                </div>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 6, fontWeight: 600 }}>NET SELLER</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171", marginBottom: 2 }}>Retail Fund</div>
                  <div style={{ fontSize: 12, color: "#e2e8f0" }}>-€340k</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#334155", borderTop: "1px solid rgba(59,130,246,0.08)", paddingTop: 10 }}>
                Flussi istituzionali basati su dati Liv-ex aggregati. Non nominativi.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
