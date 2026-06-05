import { useState, useEffect } from "react";
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const TooltipContent = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const avg = payload.find(p => p.dataKey === "avg");
  const min = payload.find(p => p.dataKey === "min");
  const band = payload.find(p => p.dataKey === "band");
  const maxVal = min && band ? Math.round(Number(min.value) + Number(band.value)) : null;
  return (
    <div style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
      <p style={{ color: "#64748b", marginBottom: 6 }}>{label}</p>
      {avg && <p style={{ color: "#722F37", fontWeight: 700 }}>Media: € {avg.value}</p>}
      {min && maxVal && (
        <p style={{ color: "#475569" }}>Range: € {min.value} – € {maxVal}</p>
      )}
    </div>
  );
};

export default function PriceHistoryChart({ wineId, currentPrice = null, height = 200 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wineId) { setLoading(false); return; }
    const price = currentPrice || 100;
    const qs = `?currentPrice=${price}`;
    fetch(`${API}/api/prices/${encodeURIComponent(wineId)}/history${qs}`)
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
          const sorted = prices.slice().sort((a, b) => a - b);
          const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
          const min = Math.round(sorted[0]);
          const max = Math.round(sorted[sorted.length - 1]);
          return {
            month: new Date(month + "-01").toLocaleDateString("it-IT", { month: "short", year: "2-digit" }),
            avg,
            min,
            band: max - min,
          };
        });
        setData(chartData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wineId, currentPrice]);

  if (loading) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{
          width: 14, height: 14, borderRadius: "50%",
          border: "2px solid #334155", borderTopColor: "#722F37",
          display: "inline-block", animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 12 }}>
        Storico prezzi non ancora disponibile
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceRangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#722F37" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#722F37" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#131d2e" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" stroke="#1e293b" tick={{ fontSize: 9, fill: "#64748b" }} />
          <YAxis stroke="#1e293b" tick={{ fontSize: 9, fill: "#64748b" }} tickFormatter={v => `€${v}`} width={52} />
          <Tooltip content={<TooltipContent />} />
          {/* Stacked areas: transparent baseline up to min, then shaded band to max */}
          <Area type="monotone" dataKey="min" stackId="band" stroke="none" fill="transparent" legendType="none" />
          <Area type="monotone" dataKey="band" stackId="band" stroke="none" fill="url(#priceRangeGrad)" legendType="none" />
          <Line
            type="monotone" dataKey="avg" stroke="#722F37" strokeWidth={2}
            dot={false} activeDot={{ r: 4, fill: "#722F37", stroke: "#c9a227", strokeWidth: 1.5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
