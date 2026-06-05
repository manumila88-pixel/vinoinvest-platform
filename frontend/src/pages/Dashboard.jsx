import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function DashboardB2B() {
  const [data, setData] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/dashboard/analytics`).then(r => r.json()),
      fetch(`${API}/api/rates`).then(r => r.json()),
    ])
      .then(([analytics, ratesData]) => { setData(analytics); setRates(ratesData); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#475569", padding: 40 }}>Caricamento dashboard...</div>;

  const card = (label, value, sub) => (
    <div className="statCard" key={label}>
      <small>{label}</small>
      <h2 style={{ fontSize: 28 }}>{value}</h2>
      {sub && <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{sub}</p>}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Dashboard B2B</h2>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Analytics in tempo reale · aggiornati ogni 6 ore</p>

      {rates && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {Object.entries(rates.rates || {}).map(([cur, rate]) => (
            <span key={cur} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, background: "#0c1a2e", color: "#60a5fa", border: "1px solid #1e3a5f" }}>
              1 EUR = {rate.toFixed(4)} {cur}
            </span>
          ))}
          {rates.updated && <span style={{ fontSize: 11, color: "#334155", alignSelf: "center" }}>aggiornato {new Date(rates.updated).toLocaleTimeString("it-IT")}</span>}
        </div>
      )}

      <div className="statsGrid" style={{ marginBottom: 32 }}>
        {data && [
          card("Volume scambi", `€ ${(data.totalVolume || 0).toLocaleString("it-IT")}`),
          card("Ordini totali", data.totalOrders || 0),
          card("ROI medio", `${data.avgRoi || 0}%`),
          card("Alert attivi", data.activeAlerts || 0, "prezzi monitorati"),
        ]}
      </div>

      {data?.topWines?.length > 0 && (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Vini più scambiati</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.topWines.map((w, i) => (
              <div key={w.wineId} style={{
                background: "#0b1220", border: "1px solid #1f2937", borderRadius: 14,
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#c9a227", minWidth: 28 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{w.wineName || w.wineId}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                    {w.orders} ordini · Vol. €{w.volume.toLocaleString("it-IT")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: w.avgRoi >= 0 ? "#4ade80" : "#f87171" }}>
                    {w.avgRoi >= 0 ? "+" : ""}{w.avgRoi}% ROI
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(!data?.topWines?.length) && (
        <div style={{ color: "#334155", fontSize: 14, marginTop: 24, padding: 24, border: "1px dashed #1e293b", borderRadius: 12, textAlign: "center" }}>
          Nessun dato di trading ancora — gli ordini appariranno qui.
        </div>
      )}
    </div>
  );
}
