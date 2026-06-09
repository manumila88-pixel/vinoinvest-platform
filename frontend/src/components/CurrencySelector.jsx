import React, { useState, useEffect, createContext, useContext } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const CurrencyContext = createContext({ currency: "EUR", rates: {}, symbol: "€" });

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem("vino_currency") || "EUR");
  const [rates, setRates] = useState({ EUR: 1 });

  useEffect(() => {
    fetch(`${API}/api/currency/rates`)
      .then(r => r.json())
      .then(d => { if (d.rates) setRates(d.rates); })
      .catch(() => {});
  }, []);

  function changeCurrency(code) {
    setCurrency(code);
    localStorage.setItem("vino_currency", code);
  }

  const symbols = { EUR: "€", USD: "$", GBP: "£", CHF: "Fr", JPY: "¥", CNY: "¥", AUD: "A$", CAD: "C$", HKD: "HK$", SGD: "S$" };
  const symbol = symbols[currency] || currency;

  return (
    <CurrencyContext.Provider value={{ currency, rates, symbol, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function usePrice(priceEUR) {
  const { currency, rates, symbol } = useCurrency();
  if (!priceEUR || isNaN(priceEUR)) return { formatted: "—", value: 0, symbol };
  const rate = rates[currency] || 1;
  const value = +(priceEUR * rate).toFixed(2);
  const formatted = currency === "JPY" || currency === "CNY" || currency === "HKD"
    ? `${symbol}${Math.round(value).toLocaleString()}`
    : `${symbol}${value.toLocaleString("it-IT")}`;
  return { formatted, value, symbol };
}

export function PriceDisplay({ priceEUR, style }) {
  const { formatted } = usePrice(priceEUR);
  return <span style={style}>{formatted}</span>;
}

const CURRENCIES = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "USD" },
  { code: "GBP", symbol: "£", name: "GBP" },
  { code: "CHF", symbol: "Fr", name: "CHF" },
  { code: "JPY", symbol: "¥", name: "JPY" },
  { code: "CNY", symbol: "¥", name: "CNY" },
  { code: "AUD", symbol: "A$", name: "AUD" },
  { code: "HKD", symbol: "HK$", name: "HKD" },
  { code: "SGD", symbol: "S$", name: "SGD" },
];

export default function CurrencySelector() {
  const { currency, changeCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const current = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "var(--vi-surface)", border: "1px solid var(--vi-border)",
          color: "var(--vi-text-dim)", borderRadius: "var(--vi-radius-sm)", padding: "5px 10px", cursor: "pointer",
          fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
        }}
        title="Cambia valuta"
      >
        {current.symbol} {current.code} ▾
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 1000,
          background: "var(--vi-bg)", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius-sm)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", minWidth: 140, overflow: "hidden",
        }}>
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => { changeCurrency(c.code); setOpen(false); }}
              style={{
                width: "100%", padding: "8px 14px", border: "none", cursor: "pointer",
                background: c.code === currency ? "rgba(201,162,39,0.15)" : "transparent",
                color: c.code === currency ? "var(--vi-accent)" : "var(--vi-text-dim)", textAlign: "left",
                fontSize: 12, fontFamily: "inherit", display: "flex", gap: 8,
              }}
            >
              <span style={{ width: 24, fontWeight: 700 }}>{c.symbol}</span>
              <span>{c.code}</span>
              <span style={{ color: "#475569", marginLeft: "auto" }}>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
