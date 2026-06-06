import { useState, useRef, useEffect, useCallback, memo } from "react";
import i18n from "../i18n";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";
const STORAGE_KEY = "vi_chat_history";
const MAX_STORED = 40;

const QUICK_SUGGESTIONS = [
  { icon: "🔍", label: "Analizza il mio portfolio" },
  { icon: "💰", label: "Cosa compro con €5.000?" },
  { icon: "📈", label: "Top 10 opportunità oggi" },
  { icon: "🍷", label: "Miglior Barolo da investimento" },
  { icon: "📰", label: "News mercato vino" },
];

const TOOL_LABELS = {
  get_wine_price_history: "📊 Storico prezzi",
  get_market_news: "📰 Notizie mercato",
  search_wines: "🔍 Ricerca vini",
  calculate_portfolio_metrics: "📋 Metriche portfolio",
  get_exchange_rates: "💱 Tassi di cambio",
  get_top_opportunities: "💎 Opportunità AI",
};

function parseMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#C9A227;text-decoration:underline">$1</a>')
    .replace(/\n/g, "<br/>");
}

const WineRecommendationCard = memo(function WineRecommendationCard({ wine, onAdd }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
      background: "rgba(5,10,20,0.7)", border: "1px solid rgba(201,162,39,0.2)",
      borderRadius: 10, marginTop: 6, cursor: "pointer",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.2)"}
    >
      <div style={{ fontSize: 22, flexShrink: 0 }}>🍷</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{wine.name}</div>
        <div style={{ fontSize: 10, color: "#64748b" }}>{wine.producer || wine.region} · {wine.vintage || ""}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#C9A227", fontWeight: 700 }}>€{wine.price}</span>
          {wine.score && <span style={{ fontSize: 10, color: "#4ade80" }}>⭐ {wine.score}/100</span>}
          {wine.risk && <span style={{ fontSize: 9, color: "#94a3b8", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 4, padding: "1px 5px" }}>{wine.risk}</span>}
        </div>
      </div>
      <button
        onClick={() => onAdd && onAdd(wine)}
        style={{ fontSize: 9, padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(201,162,39,0.4)", background: "rgba(201,162,39,0.1)", color: "#C9A227", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
      >+ Portfolio</button>
    </div>
  );
});

const ResourceLinks = memo(function ResourceLinks({ links }) {
  if (!links?.length) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
      {links.map(l => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", textDecoration: "none", background: "rgba(96,165,250,0.05)", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(96,165,250,0.05)"}
        >
          ↗ {l.label}
        </a>
      ))}
    </div>
  );
});

function loadStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveHistory(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_STORED)));
  } catch {}
}

export default function AgentChat({ holdings = [], onAddToPortfolio, compact = false }) {
  const [messages, setMessages] = useState(() => {
    const stored = loadStoredHistory();
    if (stored?.length) return stored;
    return [{
      role: "assistant",
      content: "Ciao! 🍷 Sono il tuo **AI Wine Advisor**.\n\nPosso analizzare il tuo portfolio, trovare opportunità, rispondere a domande sul mercato del vino e molto altro. Come posso aiutarti oggi?",
      suggestedWines: [],
      resourceLinks: [],
      toolsUsed: [],
    }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          sessionId,
          holdings: holdings.map(h => ({ name: h.name, quantity: h.quantity, purchasePrice: h.purchasePrice, currentPrice: h.currentPrice, currentValue: h.currentValue, roi: h.roi, type: h.type })),
          lang: i18n.language?.slice(0, 2) || "it",
        }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response || "Risposta non disponibile.",
        suggestedWines: data.suggestedWines || [],
        resourceLinks: data.resourceLinks || [],
        toolsUsed: data.toolsUsed || [],
        mode: data.mode,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: err.name === "TimeoutError" ? "⏱ Timeout — il server sta partendo. Riprova tra 15 secondi." : `Errore di connessione. Verifica la rete.`,
        suggestedWines: [],
        resourceLinks: [{ url: "https://www.wine-searcher.com", label: "wine-searcher.com" }],
        toolsUsed: [],
        error: true,
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, sessionId, holdings]);

  function clearChat() {
    const initial = [{ role: "assistant", content: "Chat resettata. Come posso aiutarti?", suggestedWines: [], resourceLinks: [], toolsUsed: [] }];
    setMessages(initial);
    localStorage.removeItem(STORAGE_KEY);
  }

  function exportPDF() {
    const lines = messages.map(m => `[${m.role === "user" ? "TU" : "AI"}] ${m.content}`).join("\n\n");
    const blob = new Blob([`VinoInvest AI Chat Export\n${"=".repeat(40)}\n\n${lines}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vinoinvest-chat.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  const showSuggestions = messages.length <= 1;
  const maxH = compact ? 420 : 600;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: maxH, background: "rgba(2,6,23,0.6)", borderRadius: compact ? 16 : 0, border: compact ? "1px solid rgba(30,41,59,0.7)" : "none" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(30,41,59,0.5)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#9b1c4a,#C9A227)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🍷</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Playfair Display',serif" }}>AI Wine Advisor</div>
            <div style={{ fontSize: 10, color: "#4ade80" }}>● Online</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={exportPDF} title="Esporta chat" style={{ fontSize: 11, padding: "3px 9px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.6)", background: "transparent", color: "#64748b", cursor: "pointer" }}>↓ Export</button>
          <button onClick={clearChat} title="Nuova chat" style={{ fontSize: 11, padding: "3px 9px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.6)", background: "transparent", color: "#64748b", cursor: "pointer" }}>✕ Reset</button>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
              {msg.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#9b1c4a,#C9A227)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 2 }}>🍷</div>
              )}
              <div style={{ maxWidth: compact ? "88%" : "78%" }}>
                {/* Tool badges */}
                {msg.toolsUsed?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
                    {[...new Set(msg.toolsUsed)].map(t => (
                      <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 999, background: "rgba(201,162,39,0.1)", color: "#C9A227", border: "1px solid rgba(201,162,39,0.2)" }}>
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
                    : msg.error ? "rgba(127,29,29,0.4)" : "rgba(11,18,32,0.9)",
                  border: msg.role === "assistant" ? `1px solid ${msg.error ? "rgba(239,68,68,0.3)" : "rgba(30,41,59,0.8)"}` : "none",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: msg.role === "user" ? "#0a0a0a" : "#e2e8f0",
                  wordBreak: "break-word",
                }}>
                  <div dangerouslySetInnerHTML={{ __html: parseMd(msg.content) }} />
                </div>
                {/* Resource links */}
                <ResourceLinks links={msg.resourceLinks} />
              </div>
              {msg.role === "user" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginTop: 2, color: "#C9A227", fontWeight: 700 }}>Tu</div>
              )}
            </div>
            {/* Wine recommendations */}
            {msg.role === "assistant" && msg.suggestedWines?.length > 0 && (
              <div style={{ marginLeft: 36, marginTop: 4 }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>💎 Vini consigliati</div>
                {msg.suggestedWines.slice(0, compact ? 2 : 4).map(w => (
                  <WineRecommendationCard key={w.id || w.name} wine={w} onAdd={onAddToPortfolio} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#9b1c4a,#C9A227)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🍷</div>
            <div style={{ padding: "10px 16px", borderRadius: "4px 18px 18px 18px", background: "rgba(11,18,32,0.9)", border: "1px solid rgba(30,41,59,0.8)" }}>
              <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9A227", display: "inline-block", animation: `vi-pulse 1.2s ${d * 0.2}s ease-in-out infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {showSuggestions && (
        <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
          {QUICK_SUGGESTIONS.map(s => (
            <button key={s.label} onClick={() => sendMessage(s.label)}
              style={{ fontSize: 11, padding: "5px 11px", borderRadius: 999, border: "1px solid rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.07)", color: "#C9A227", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "background 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,162,39,0.15)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,162,39,0.07)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "8px 12px 10px", borderTop: "1px solid rgba(30,41,59,0.4)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Scrivi un messaggio... (Invio per inviare)"
            rows={compact ? 1 : 2}
            style={{ flex: 1, padding: "9px 12px", borderRadius: 12, border: "1px solid rgba(30,41,59,0.8)", background: "rgba(11,18,32,0.9)", color: "#e2e8f0", fontSize: "max(14px,16px)", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5, transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "rgba(201,162,39,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(30,41,59,0.8)"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ padding: "0 16px", borderRadius: 12, border: "none", background: loading || !input.trim() ? "rgba(201,162,39,0.15)" : "linear-gradient(135deg,#C9A227,#a07820)", color: loading || !input.trim() ? "#64748b" : "#000", fontWeight: 800, cursor: loading || !input.trim() ? "default" : "pointer", fontSize: 20, transition: "all 0.15s", flexShrink: 0 }}
          >↑</button>
        </div>
        <p style={{ fontSize: 9, color: "#334155", margin: "5px 0 0", textAlign: "center" }}>
          AI Advisor · non costituisce consulenza finanziaria · dati di mercato reali
        </p>
      </div>

      <style>{`
        @keyframes vi-pulse {
          0%, 80%, 100% { opacity: 0.15; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
