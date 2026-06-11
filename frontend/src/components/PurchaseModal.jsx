import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const PLATFORM_COLORS = {
  "wine-searcher": "#c9a227",
  "vivino": "#aa2244",
  "millesima": "#1a4f8a",
  "tannico": "#6b2c3e",
  "idealwine": "#2d5a1b",
  "callmewine": "#3b2d8f",
  "wine-com": "#9b2335",
};

export default function PurchaseModal({ wine, onClose, onImport }) {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("buy"); // "buy" | "import"
  const [importForm, setImportForm] = useState({ platform: "", price: "", quantity: 1, purchaseDate: new Date().toISOString().slice(0, 10) });
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/purchase/options/${encodeURIComponent(wine.id)}`)
      .then(r => r.json())
      .then(d => setPlatforms(d.platforms || []))
      .catch(() => setPlatforms([]))
      .finally(() => setLoading(false));
  }, [wine.id]);

  const trackClick = (platform) => {
    fetch(`${API}/api/purchase/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wineId: wine.id, platform }),
    }).catch(() => {});
  };

  const handleImport = async () => {
    if (!importForm.price || !importForm.quantity) return setImportMsg({ type: "error", text: "Prezzo e quantità obbligatori" });
    setImporting(true);
    try {
      const _u = JSON.parse(localStorage.getItem("vino_user") || "{}");
      const userId = _u.email || localStorage.getItem("vino_device_id") || "anonymous";
      const res = await fetch(`${API}/api/purchase/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, wineId: wine.id, ...importForm, price: Number(importForm.price), quantity: Number(importForm.quantity) }),
      });
      const d = await res.json();
      if (res.ok) {
        setImportMsg({ type: "success", text: `${wine.name} aggiunto al portfolio!` });
        setTimeout(() => { onImport?.(d); onClose(); }, 1500);
      } else {
        setImportMsg({ type: "error", text: d.error || "Error" });
      }
    } catch (e) {
      setImportMsg({ type: "error", text: "Network error" });
    }
    setImporting(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }} onClick={onClose}>
      <div className="vi-card" style={{ background: "var(--vi-bg)", borderColor: "rgba(201,162,39,0.3)", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 28 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--vi-text)", margin: 0 }}>{wine.name}</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{wine.producer} {wine.vintage && `· ${wine.vintage}`}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Wine image + price */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
          {wine.imageUrl && (
            <img src={wine.imageUrl} alt={wine.name} loading="lazy" style={{ width: 64, height: 96, objectFit: "cover", borderRadius: "var(--vi-radius-sm)" }} onError={e => e.currentTarget.style.display = "none"} />
          )}
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--vi-accent)" }}>€ {(wine.currentPrice || 0).toLocaleString("it-IT")}</div>
            <div style={{ fontSize: 12, color: "var(--vi-positive)", marginTop: 2 }}>AI Score: {wine.investmentScore || "—"}/100</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Risk: {wine.risk || "—"}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--vi-border)", paddingBottom: 0 }}>
          {[{ id: "buy", label: "Dove acquistare" }, { id: "import", label: "Già acquistato" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", border: "none", background: "none", color: tab === t.id ? "var(--vi-accent)" : "#475569", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", borderBottom: tab === t.id ? "2px solid var(--vi-accent)" : "2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Buy tab */}
        {tab === "buy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div style={{ color: "#475569", textAlign: "center", padding: 20 }}>{t('purchase.loadingPlatforms')}</div>
            ) : platforms.map(p => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => trackClick(p.id)}
                className="vi-interactive"
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: "var(--vi-radius-md)", background: "var(--vi-surface)", border: `1px solid ${PLATFORM_COLORS[p.id] || "var(--vi-border)"}22`, textDecoration: "none", transition: `all var(--vi-dur) var(--vi-ease)` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = PLATFORM_COLORS[p.id] || "var(--vi-accent)"; e.currentTarget.style.background = "rgba(201,162,39,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${PLATFORM_COLORS[p.id] || "var(--vi-border)"}22`; e.currentTarget.style.background = "var(--vi-surface)"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "var(--vi-radius-sm)", background: `${PLATFORM_COLORS[p.id] || "#334155"}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {p.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--vi-text)" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{p.description}</div>
                </div>
                <span style={{ color: "var(--vi-accent)", fontSize: 18 }}>→</span>
              </a>
            ))}
            <p style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 8 }}>
              {t('purchase.affiliateNote')}
            </p>
          </div>
        )}

        {/* Import tab */}
        {tab === "import" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 13, color: "#64748b" }}>{t('purchase.addExisting')}</p>

            {[
              { key: "platform", label: "Platform", type: "select", options: ["wine-searcher", "vivino", "millesima", "tannico", "idealwine", "callmewine", "wine-com", "altro"] },
              { key: "price", label: t('purchase.pricePaid'), type: "number", placeholder: "820" },
              { key: "quantity", label: "Bottles", type: "number", placeholder: "1" },
              { key: "purchaseDate", label: t('purchase.purchaseDate'), type: "date" },
            ].map(({ key, label, type, placeholder, options }) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                {type === "select" ? (
                  <select value={importForm[key]} onChange={e => setImportForm(p => ({ ...p, [key]: e.target.value }))} className="searchInput" style={{ margin: 0, width: "100%" }}>
                    <option value="">Select...</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} value={importForm[key]} onChange={e => setImportForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="searchInput" style={{ margin: 0, width: "100%" }} />
                )}
              </div>
            ))}

            {importMsg && (
              <div style={{ padding: "8px 12px", borderRadius: "var(--vi-radius-sm)", fontSize: 13, background: importMsg.type === "success" ? "rgba(5,46,22,0.5)" : "rgba(69,10,10,0.5)", color: importMsg.type === "success" ? "var(--vi-positive)" : "var(--vi-negative)" }}>
                {importMsg.text}
              </div>
            )}

            <button onClick={handleImport} disabled={importing} className="btn-primary" style={{ padding: "12px", width: "100%" }}>
              {importing ? "Salvataggio..." : "Aggiungi al portfolio"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
