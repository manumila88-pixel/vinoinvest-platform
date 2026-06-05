import { useState, useEffect, useRef } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function PriceHistoryChart({ wineId, currentPrice = null, height = 200 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(460);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      if (w > 50) setWidth(w - 10);
    }
  }, []);

  useEffect(() => {
    if (!wineId) { setLoading(false); return; }
    const price = currentPrice || 100;
    fetch(`${API}/api/prices/${encodeURIComponent(wineId)}/history?currentPrice=${price}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const points = d?.history || [];
        const byMonth = {};
        points.forEach(p => {
          const month = p.recorded_at.slice(0, 7);
          if (!byMonth[month]) byMonth[month] = [];
          byMonth[month].push(Number(p.price));
        });
        const chartData = Object.entries(byMonth).map(([month, prices]) => {
          const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
          const min = Math.round(Math.min(...prices));
          const max = Math.round(Math.max(...prices));
          return {
            month: new Date(month + "-01").toLocaleDateString("it-IT", { month: "short", year: "2-digit" }),
            avg, min, band: max - min
          };
        });
        setData(chartData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wineId, currentPrice]);

  if (loading) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 12 }}>Caricamento...</div>;
  if (!data.length) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 12 }}>Dati non disponibili</div>;

  return (
    <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
      <ComposedChart width={width} height={height} data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#64748b" }} />
        <YAxis tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={v => "€"+v} width={45} />
        <Tooltip formatter={(v, n) => ["€"+v, n === "avg" ? "Media" : n]} contentStyle={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }} />
        <Area type="monotone" dataKey="min" stackId="1" stroke="none" fill="transparent" />
        <Area type="monotone" dataKey="band" stackId="1" stroke="none" fill="#722F37" fillOpacity={0.15} />
        <Line type="monotone" dataKey="avg" stroke="#722F37" strokeWidth={2} dot={false} />
      </ComposedChart>
    </div>
  );
}
