import { useState, useEffect, useRef } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const TIMEFRAMES = ["1w", "1m", "3m", "6m", "1y", "3y", "5y", "10y", "max"];

export default function PriceHistoryChart({ wineId, currentPrice = null, height = 200 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1y");
  const [availability, setAvailability] = useState({});
  const [source, setSource] = useState("estimated");
  const [width, setWidth] = useState(460);
  const containerRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width || 0;
      if (w > 50) setWidth(Math.floor(w) - 10);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!wineId) { setLoading(false); return; }

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    const price = currentPrice || 100;
    fetch(`${API}/api/prices/${encodeURIComponent(wineId)}/history?currentPrice=${price}&timeframe=${timeframe}`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        setSource(d.source || "estimated");
        setAvailability(d.availability || {});

        const granularity = timeframe === "1w" ? "day" : timeframe === "1m" ? "day" : "month";
        const points = d?.history || [];
        const byBucket = {};
        points.forEach(p => {
          const dt = new Date(p.recorded_at);
          const key = granularity === "day"
            ? dt.toISOString().slice(0, 10)
            : dt.toISOString().slice(0, 7);
          if (!byBucket[key]) byBucket[key] = [];
          byBucket[key].push(Number(p.price));
        });

        const chartData = Object.entries(byBucket).map(([key, prices]) => {
          const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
          const min = Math.round(Math.min(...prices));
          const max = Math.round(Math.max(...prices));
          const label = granularity === "day"
            ? new Date(key).toLocaleDateString("it-IT", { day: "numeric", month: "short" })
            : new Date(key + "-01").toLocaleDateString("it-IT", { month: "short", year: "2-digit" });
          return { label, avg, min, band: max - min };
        });

        setData(chartData);
        setLoading(false);
      })
      .catch(e => { if (e.name !== "AbortError") setLoading(false); });

    return () => ctrl.abort();
  }, [wineId, currentPrice, timeframe]);

  const sourceLabel = source === "db" ? "Dati reali" : source === "estimated" ? "Dati stimati" : "Misti";
  const sourceColor = source === "db" ? "#4ade80" : "#C9A227";

  if (loading) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 12 }}>Caricamento...</div>;
  if (!data.length) return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 12 }}>Dati non disponibili</div>;

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {/* Timeframe buttons */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
        {TIMEFRAMES.filter(tf => availability[tf] !== false).map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            style={{
              padding: "3px 8px",
              borderRadius: 6,
              border: `1px solid ${timeframe === tf ? "#C9A227" : "rgba(30,41,59,0.7)"}`,
              background: timeframe === tf ? "rgba(201,162,39,0.15)" : "transparent",
              color: timeframe === tf ? "#C9A227" : "#475569",
              fontSize: 10,
              fontWeight: timeframe === tf ? 700 : 500,
              cursor: "pointer",
              fontFamily: "'Inter', Arial, sans-serif",
            }}
          >{tf.toUpperCase()}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 10, color: sourceColor, fontWeight: 600, border: `1px solid ${sourceColor}30`, padding: "2px 7px", borderRadius: 4 }}>
          {sourceLabel}
        </span>
      </div>

      {/* Chart */}
      <div style={{ overflowX: "auto" }}>
        <ComposedChart width={width} height={height} data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={v => "€"+v} width={45} />
          <Tooltip
            formatter={(v, n) => ["€"+v, n === "avg" ? "Media" : n === "min" ? "Min" : "Banda"]}
            contentStyle={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Area type="monotone" dataKey="min" stackId="1" stroke="none" fill="transparent" />
          <Area type="monotone" dataKey="band" stackId="1" stroke="none" fill="#722F37" fillOpacity={0.15} />
          <Line type="monotone" dataKey="avg" stroke="#722F37" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#C9A227" }} />
        </ComposedChart>
      </div>
    </div>
  );
}
