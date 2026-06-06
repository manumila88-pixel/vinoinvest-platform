import { useState, useRef, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

const SUGGESTIONS = [
  "Analizza il mio portafoglio e dimmi come migliorarlo",
  "Quali sono le migliori opportunità di investimento oggi?",
  "Come sta andando il mercato del vino francese?",
  "Qual è il rischio del mio portafoglio attuale?",
];

const TOOL_LABELS = {
  get_wine_price_history: "Analisi storico prezzi",
  get_market_news: "Notizie di mercato",
  search_wines: "Ricerca vini",
  calculate_portfolio_metrics: "Calcolo metriche portafoglio",
  get_exchange_rates: "Tassi di cambio",
  get_top_opportunities: "Opportunità di investimento",
};

export default function AgentChat({ holdings = [] }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ciao! Sono il tuo advisor AI per investimenti in vino. Posso analizzare il tuo portafoglio, trovare opportunità di mercato e rispondere alle tue domande. Come posso aiutarti?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const portfolioHoldings = holdings.map(h => ({
      name: h.name,
      quantity: h.quantity,
      purchasePrice: h.purchasePrice,
      currentPrice: h.currentPrice,
      currentValue: h.currentValue,
      roi: h.roi,
    }));

    try {
      const res = await fetch(`${API}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId, holdings: portfolioHoldings }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        toolsUsed: data.toolsUsed || [],
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Errore: ${err.message === "The operation was aborted." ? "Timeout — riprova tra poco." : err.message}`,
        error: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, sessionId, holdings]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 520 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 4px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#a07820)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 4 }}>
                AI
              </div>
            )}
            <div style={{ maxWidth: "78%" }}>
              {/* Tool badges */}
              {msg.toolsUsed?.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                  {[...new Set(msg.toolsUsed)].map(t => (
                    <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.2)" }}>
                      {TOOL_LABELS[t] || t}
                    </span>
                  ))}
                </div>
              )}
              <div style={{
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg,#C9A227,#a07820)"
                  : msg.error ? "rgba(239,68,68,0.1)" : "rgba(15,23,42,0.9)",
                border: msg.role === "assistant" ? `1px solid ${msg.error ? "rgba(239,68,68,0.3)" : "rgba(30,41,59,0.8)"}` : "none",
                fontSize: 14,
                lineHeight: 1.6,
                color: msg.role === "user" ? "#000" : msg.error ? "#f87171" : "#e2e8f0",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#C9A227,#a07820)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>AI</div>
            <div style={{ padding: "10px 16px", borderRadius: "4px 18px 18px 18px", background: "rgba(15,23,42,0.9)", border: "1px solid rgba(30,41,59,0.8)" }}>
              <span style={{ display: "inline-flex", gap: 4 }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A227", animation: `pulse 1.2s ${d * 0.2}s infinite`, display: "inline-block" }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips (only when conversation is short) */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10, padding: "0 4px" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 999, border: "1px solid rgba(201,162,39,0.3)", background: "rgba(201,162,39,0.07)", color: "#C9A227", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", gap: 8, padding: "8px 4px 0" }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Chiedi all'AI advisor... (Invio per inviare)"
          rows={2}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(30,41,59,0.8)",
            background: "rgba(11,18,32,0.9)",
            color: "#e2e8f0",
            fontSize: 14,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: "0 18px",
            borderRadius: 12,
            border: "none",
            background: loading || !input.trim() ? "rgba(201,162,39,0.2)" : "linear-gradient(135deg,#C9A227,#a07820)",
            color: loading || !input.trim() ? "#64748b" : "#000",
            fontWeight: 700,
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: 18,
            transition: "all 0.15s",
          }}
        >
          &#8593;
        </button>
      </div>
      <p style={{ fontSize: 10, color: "#334155", margin: "6px 4px 0", textAlign: "center" }}>
        AI Advisor usa dati reali di mercato. Non costituisce consulenza finanziaria.
      </p>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
