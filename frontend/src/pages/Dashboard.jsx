import { useEffect, useState } from "react";
import { authFetch } from "../lib/authFetch";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

function printReport(data, rates) {
  const win = window.open("", "_blank");
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>VinoInvest B2B Report</title>
      <style>
        body { font-family: Arial, sans-serif; color: #111; padding: 32px; }
        h1 { font-size: 24px; margin-bottom: 4px; }
        h2 { font-size: 16px; margin: 24px 0 8px; }
        .meta { color: #555; font-size: 12px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #f1f5f9; text-align: left; padding: 8px; font-size: 11px; text-transform: uppercase; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
        .stat { display: inline-block; margin-right: 32px; }
        .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
        .stat-value { font-size: 22px; font-weight: 700; }
        @media print { @page { margin: 1cm; } }
      </style>
    </head>
    <body>
      <h1>VinoInvest — B2B Report</h1>
      <div class="meta">Generato: ${new Date().toLocaleString("it-IT")} | Dati aggiornati ogni 6 ore</div>

      <div>
        <div class="stat"><div class="stat-label">Volume Scambi</div><div class="stat-value">€ ${(data?.totalVolume || 0).toLocaleString("it-IT")}</div></div>
        <div class="stat"><div class="stat-label">Ordini Totali</div><div class="stat-value">${data?.totalOrders || 0}</div></div>
        <div class="stat"><div class="stat-label">ROI Medio</div><div class="stat-value">${data?.avgRoi || 0}%</div></div>
        <div class="stat"><div class="stat-label">Alert Attivi</div><div class="stat-value">${data?.activeAlerts || 0}</div></div>
      </div>

      <h2>Top Vini</h2>
      <table>
        <tr><th>#</th><th>Vino</th><th>Ordini</th><th>Volume</th><th>ROI Medio</th></tr>
        ${(data?.topWines || []).map((w, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${w.wineName || w.wineId}</td>
            <td>${w.orders}</td>
            <td>€ ${w.volume.toLocaleString("it-IT")}</td>
            <td style="color:${w.avgRoi >= 0 ? "green" : "red"}">${w.avgRoi >= 0 ? "+" : ""}${w.avgRoi}%</td>
          </tr>
        `).join("")}
      </table>

      ${rates ? `
      <h2>Tassi di Cambio</h2>
      <table>
        <tr><th>Valuta</th><th>1 EUR =</th></tr>
        ${Object.entries(rates.rates || {}).map(([cur, rate]) => `<tr><td>${cur}</td><td>${rate.toFixed(4)}</td></tr>`).join("")}
      </table>` : ""}

      <script>window.onload = () => { window.print(); }</script>
    </body>
    </html>
  `);
  win.document.close();
}

export default function DashboardB2B() {
  const [data, setData] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");

  // Wine management form state
  const [wineForm, setWineForm] = useState({ name: "", producer: "", vintage: "", region: "", price: "", type: "Rosso" });
  const [wineFormMsg, setWineFormMsg] = useState(null);
  const [submittingWine, setSubmittingWine] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/dashboard/analytics`).then(r => r.json()),
      fetch(`${API}/api/rates`).then(r => r.json()),
    ])
      .then(([analytics, ratesData]) => { setData(analytics); setRates(ratesData); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--vi-text-dim)", padding: 40 }}>Caricamento dashboard...</div>;

  const card = (label, value, sub) => (
    <div className="statCard" key={label}>
      <small>{label}</small>
      <h2 style={{ fontSize: 28 }}>{value}</h2>
      {sub && <p style={{ fontSize: 11, color: "var(--vi-text-dim)", marginTop: 4 }}>{sub}</p>}
    </div>
  );

  const TABS = [
    { id: "analytics", label: "Analytics" },
    { id: "wines", label: "Gestione Vini" },
    { id: "clients", label: "Clienti" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Dashboard B2B</h2>
          <p style={{ color: "var(--vi-text-dim)", fontSize: 13, marginTop: 4 }}>Analytics · Gestione · Clienti</p>
        </div>
        <button
          onClick={() => printReport(data, rates)}
          style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(201,162,39,0.3)", background: "rgba(201,162,39,0.1)", color: "var(--vi-accent)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
        >Stampa / PDF</button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: "1px solid rgba(30,41,59,0.5)", paddingBottom: 0 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ padding: "8px 16px", borderRadius: "8px 8px 0 0", border: "none", background: activeTab === t.id ? "rgba(201,162,39,0.12)" : "transparent", color: activeTab === t.id ? "var(--vi-accent)" : "var(--vi-text-dim)", fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500, cursor: "pointer", borderBottom: activeTab === t.id ? `2px solid var(--vi-accent)` : "2px solid transparent" }}
          >{t.label}</button>
        ))}
      </div>

      {/* ── Analytics tab ─────────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <>
          {rates && (
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {Object.entries(rates.rates || {}).map(([cur, rate]) => (
                <span key={cur} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, background: "var(--vi-bg-elev)", color: "var(--vi-text-dim)", border: "1px solid var(--vi-border)" }}>
                  1 EUR = {rate.toFixed(4)} {cur}
                </span>
              ))}
              {rates.updated && <span style={{ fontSize: 11, color: "#334155", alignSelf: "center" }}>agg. {new Date(rates.updated).toLocaleTimeString("it-IT")}</span>}
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

          {data?.topWines?.length > 0 ? (
            <>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Vini più scambiati</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.topWines.map((w, i) => (
                  <div key={w.wineId} style={{ background: "var(--vi-bg)", border: "1px solid var(--vi-border)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--vi-accent)", minWidth: 28, fontVariantNumeric: "tabular-nums" }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{w.wineName || w.wineId}</div>
                      <div style={{ fontSize: 11, color: "var(--vi-text-dim)", marginTop: 2 }}>{w.orders} ordini · Vol. €{w.volume.toLocaleString("it-IT")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: w.avgRoi >= 0 ? "var(--vi-positive)" : "var(--vi-negative)", fontVariantNumeric: "tabular-nums" }}>{w.avgRoi >= 0 ? "+" : ""}{w.avgRoi}% ROI</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: "#334155", fontSize: 14, marginTop: 24, padding: 24, border: "1px dashed #1e293b", borderRadius: 12, textAlign: "center" }}>
              No trading data yet — orders will appear here.
            </div>
          )}
        </>
      )}

      {/* ── Wine management tab ────────────────────────────────────────── */}
      {activeTab === "wines" && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Aggiungi / Modifica Vino</h3>
          <div style={{ background: "var(--vi-surface)", border: "1px solid var(--vi-border)", borderRadius: 16, padding: 24, maxWidth: 560 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[
                { key: "name", label: "Nome vino", placeholder: "Château Lafite Rothschild 2020" },
                { key: "producer", label: "Produttore", placeholder: "Lafite Rothschild" },
                { key: "vintage", label: "Annata", placeholder: "2020" },
                { key: "region", label: "Regione", placeholder: "Bordeaux" },
                { key: "price", label: "Prezzo (€)", placeholder: "850" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "var(--vi-text-dim)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                  <input
                    value={wineForm[key]}
                    onChange={e => setWineForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="searchInput"
                    style={{ margin: 0, width: "100%" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tipo</label>
                <select value={wineForm.type} onChange={e => setWineForm(p => ({ ...p, type: e.target.value }))} className="searchInput" style={{ margin: 0, width: "100%" }}>
                  {["Rosso", "Bianco", "Rosé", "Bollicine"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <button
              className="btn-primary"
              style={{ width: "100%", padding: "12px" }}
              disabled={submittingWine}
              onClick={async () => {
                if (!wineForm.name || !wineForm.price) return setWineFormMsg({ type: "error", text: "Nome e prezzo obbligatori" });
                setSubmittingWine(true);
                try {
                  const res = await authFetch(`${API}/api/wines`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: wineForm.name,
                      producer: wineForm.producer,
                      vintage: Number(wineForm.vintage) || null,
                      region: wineForm.region,
                      current_price: Number(wineForm.price),
                      type: wineForm.type,
                    }),
                  });
                  if (res.ok) {
                    setWineFormMsg({ type: "success", text: "Vino aggiunto con successo!" });
                    setWineForm({ name: "", producer: "", vintage: "", region: "", price: "", type: "Rosso" });
                  } else {
                    setWineFormMsg({ type: "error", text: "Errore: " + res.status });
                  }
                } catch (e) {
                  setWineFormMsg({ type: "error", text: "Network error" });
                }
                setSubmittingWine(false);
              }}
            >{submittingWine ? "Saving..." : "Add wine"}</button>
            {wineFormMsg && (
              <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, fontSize: 13, background: wineFormMsg.type === "success" ? "rgba(5,46,22,0.5)" : "rgba(69,10,10,0.5)", color: wineFormMsg.type === "success" ? "var(--vi-positive)" : "var(--vi-negative)" }}>
                {wineFormMsg.text}
              </div>
            )}
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: "#334155" }}>
            Per gestire i vini nel database, usa l'endpoint <code style={{ color: "#60a5fa" }}>POST /api/wines</code>. Il form aggiunge a wines.json tramite API.
          </p>
        </div>
      )}

      {/* ── Clients tab ───────────────────────────────────────────────── */}
      {activeTab === "clients" && (
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Lista Clienti</h3>
          {data?.topWines?.length ? (
            <div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                Clienti derivati dagli ordini nel database. Dati aggregati per privacy.
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--vi-border)", color: "var(--vi-text-dim)" }}>
                    {["Vino più ordinato", "Ordini totali", "Volume (€)", "ROI medio"].map(h => (
                      <th key={h} style={{ padding: "9px 12px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.topWines.map((w, i) => (
                    <tr key={w.wineId} style={{ borderBottom: "1px solid var(--vi-bg)", background: i % 2 ? "rgba(11,18,32,0.5)" : "transparent" }}>
                      <td style={{ padding: "11px 12px", fontWeight: 600 }}>{w.wineName || w.wineId}</td>
                      <td style={{ padding: "11px 12px", color: "var(--vi-text-dim)", fontVariantNumeric: "tabular-nums" }}>{w.orders}</td>
                      <td style={{ padding: "11px 12px", color: "var(--vi-accent)", fontVariantNumeric: "tabular-nums" }}>€ {w.volume.toLocaleString("it-IT")}</td>
                      <td style={{ padding: "11px 12px", color: w.avgRoi >= 0 ? "var(--vi-positive)" : "var(--vi-negative)", fontVariantNumeric: "tabular-nums" }}>{w.avgRoi >= 0 ? "+" : ""}{w.avgRoi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: "#334155", fontSize: 14, padding: 24, border: "1px dashed #1e293b", borderRadius: 12, textAlign: "center" }}>
              No clients yet — data will appear when the first orders arrive.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
