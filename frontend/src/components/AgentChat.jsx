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

function Sparkline({ trend }) {
  if (!trend) return null;
  const isUp = trend === "Crescita" || trend === "bullish" || trend === "up";
  const isDown = trend === "Calo" || trend === "bearish" || trend === "down";
  const color = isUp ? "var(--vi-positive)" : isDown ? "var(--vi-negative)" : "var(--vi-accent)";
  const path = isUp ? "M2,10 L6,7 L10,5 L14,4 L18,2" : isDown ? "M2,2 L6,5 L10,7 L14,8 L18,10" : "M2,6 L6,5 L10,6 L14,5 L18,6";
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" style={{ verticalAlign: "middle" }}>
      <polyline points={path.replace(/[ML]/g, "").trim()}
        fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function parseMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-size:11px;font-family:monospace">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--vi-accent);text-decoration:underline">$1</a>')
    .replace(/^#{1,3}\s+(.+)$/gm, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

const WineRecommendationCard = memo(function WineRecommendationCard({ wine, onAdd, onViewDetail }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
        background: "var(--vi-surface)", border: "1px solid var(--vi-accent-glow)",
        borderRadius: "var(--vi-radius-sm)", marginTop: 6, cursor: "pointer",
        transition: `border-color var(--vi-dur) var(--vi-ease)`,
      }}
      onClick={() => onViewDetail && onViewDetail(wine)}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--vi-accent-glow)"}
    >
      <div style={{ fontSize: 22, flexShrink: 0 }}>🍷</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vi-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{wine.name}</div>
        <div style={{ fontSize: 10, color: "#64748b" }}>{wine.producer || wine.region} · {wine.vintage || ""}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--vi-accent)", fontWeight: 700 }}>€{wine.price}</span>
          {wine.score && <span style={{ fontSize: 10, color: "var(--vi-positive)" }}>⭐ {wine.score}/100</span>}
          {wine.risk && <span style={{ fontSize: 9, color: "var(--vi-text-dim)", border: "1px solid var(--vi-border)", borderRadius: 4, padding: "1px 5px" }}>{wine.risk}</span>}
          {wine.trend && <Sparkline trend={wine.trend} />}
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onAdd && onAdd(wine); }}
        style={{ fontSize: 9, padding: "4px 8px", borderRadius: "var(--vi-radius-sm)", border: "1px solid rgba(201,162,39,0.4)", background: "rgba(201,162,39,0.1)", color: "var(--vi-accent)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
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
          style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", textDecoration: "none", background: "rgba(96,165,250,0.05)", transition: `background var(--vi-dur-fast) var(--vi-ease)` }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(96,165,250,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(96,165,250,0.05)"}
        >
          ↗ {l.label}
        </a>
      ))}
    </div>
  );
});

const FollowUpChips = memo(function FollowUpChips({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8, marginLeft: 36 }}>
      {suggestions.map(s => (
        <button key={s} onClick={() => onSelect(s)}
          style={{ fontSize: 10, padding: "3px 10px", borderRadius: "var(--vi-radius-full)", border: "1px solid var(--vi-accent-glow)", background: "rgba(201,162,39,0.05)", color: "var(--vi-text-dim)", cursor: "pointer", transition: `all var(--vi-dur-fast) var(--vi-ease)` }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,162,39,0.12)"; e.currentTarget.style.color = "var(--vi-accent)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,162,39,0.05)"; e.currentTarget.style.color = "var(--vi-text-dim)"; e.currentTarget.style.borderColor = "var(--vi-accent-glow)"; }}
        >
          {s}
        </button>
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

export default function AgentChat({ holdings = [], onAddToPortfolio, onViewWine, compact = false, initialMessage = "", onInitialMessageSent }) {
  const storedHistory = loadStoredHistory();
  const hasHistory = storedHistory?.length > 1;

  const [messages, setMessages] = useState(() => {
    if (storedHistory?.length) return storedHistory;
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
  const [showContinueBanner, setShowContinueBanner] = useState(hasHistory);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (initialMessage?.trim()) {
      sendMessage(initialMessage);
      onInitialMessageSent?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    setShowContinueBanner(false);
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
        followUpSuggestions: data.followUpSuggestions || [],
        intent: data.intent,
        mode: data.mode,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: err.name === "TimeoutError" ? "⏱ Timeout — server is starting up. Retry in 15 seconds." : "Connection error. Check your network.",
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
    setShowContinueBanner(false);
    localStorage.removeItem(STORAGE_KEY);
  }

  function exportChat() {
    const lines = messages.map(m => `[${m.role === "user" ? "TU" : "AI Wine Advisor"}]\n${m.content}`).join("\n\n---\n\n");
    const header = `VinoInvest AI Chat Export\n${"=".repeat(40)}\nData: ${new Date().toLocaleDateString("it")}\n\n`;
    const footer = `\n\n${"=".repeat(40)}\n⚠️ Non costituisce consulenza finanziaria.\n© VinoInvest`;
    const blob = new Blob([header + lines + footer], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `vinoinvest-chat-${new Date().toISOString().slice(0, 10)}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  function shareChat() {
    const text = messages.filter(m => m.role === "user").map(m => m.content).slice(-3).join(" | ");
    const url = `${window.location.origin}?ai=${encodeURIComponent(text.slice(0, 100))}`;
    if (navigator.share) {
      navigator.share({ title: "VinoInvest AI Chat", text: "Analisi vino da VinoInvest AI", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Link copiato!")).catch(() => {});
    }
  }

  const showSuggestions = messages.length <= 1;
  const maxH = compact ? 420 : 600;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: maxH, background: "var(--vi-surface)", borderRadius: compact ? "var(--vi-radius-md)" : 0, border: compact ? "1px solid var(--vi-border)" : "none" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid var(--vi-border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#9b1c4a,var(--vi-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🍷</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vi-text)", fontFamily: "var(--vi-font-display)" }}>AI Wine Advisor</div>
            <div style={{ fontSize: 10, color: "var(--vi-positive)" }}>● Online</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={shareChat} title="Condividi" style={{ fontSize: 11, padding: "3px 9px", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)", background: "transparent", color: "#64748b", cursor: "pointer" }}>⎘ Share</button>
          <button onClick={exportChat} title="Esporta chat" style={{ fontSize: 11, padding: "3px 9px", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)", background: "transparent", color: "#64748b", cursor: "pointer" }}>↓ Export</button>
          <button onClick={clearChat} title="Nuova chat" style={{ fontSize: 11, padding: "3px 9px", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)", background: "transparent", color: "#64748b", cursor: "pointer" }}>✕ Reset</button>
        </div>
      </div>

      {/* Continue banner */}
      {showContinueBanner && (
        <div style={{ padding: "6px 14px", background: "rgba(201,162,39,0.06)", borderBottom: "1px solid var(--vi-accent-glow)", fontSize: 11, color: "var(--vi-accent)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span>💬 Stai continuando la conversazione precedente</span>
          <button onClick={clearChat} style={{ fontSize: 10, color: "#64748b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Nuova chat</button>
        </div>
      )}

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
              {msg.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#9b1c4a,var(--vi-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 2 }}>🍷</div>
              )}
              <div style={{ maxWidth: compact ? "88%" : "78%" }}>
                {/* Tool badges */}
                {msg.toolsUsed?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
                    {[...new Set(msg.toolsUsed)].map(t => (
                      <span key={t} style={{ fontSize: 9, padding: "2px 7px", borderRadius: "var(--vi-radius-full)", background: "rgba(201,162,39,0.1)", color: "var(--vi-accent)", border: "1px solid var(--vi-accent-glow)" }}>
                        {TOOL_LABELS[t] || t}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg,var(--vi-accent),#a07820)"
                    : msg.error ? "rgba(127,29,29,0.4)" : "var(--vi-surface)",
                  border: msg.role === "assistant" ? `1px solid ${msg.error ? "rgba(239,68,68,0.3)" : "var(--vi-border)"}` : "none",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: msg.role === "user" ? "#0a0a0a" : "var(--vi-text)",
                  wordBreak: "break-word",
                }}>
                  <div dangerouslySetInnerHTML={{ __html: parseMd(msg.content) }} />
                </div>
                {/* Resource links */}
                <ResourceLinks links={msg.resourceLinks} />
              </div>
              {msg.role === "user" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,162,39,0.2)", border: "1px solid rgba(201,162,39,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginTop: 2, color: "var(--vi-accent)", fontWeight: 700 }}>Tu</div>
              )}
            </div>
            {/* Wine recommendations */}
            {msg.role === "assistant" && msg.suggestedWines?.length > 0 && (
              <div style={{ marginLeft: 36, marginTop: 4 }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>💎 Vini consigliati</div>
                {msg.suggestedWines.slice(0, compact ? 2 : 4).map(w => (
                  <WineRecommendationCard key={w.id || w.name} wine={w} onAdd={onAddToPortfolio} onViewDetail={onViewWine} />
                ))}
              </div>
            )}
            {/* Follow-up suggestions — only for latest assistant message */}
            {msg.role === "assistant" && msg.followUpSuggestions?.length > 0 && i === messages.length - 1 && !loading && (
              <FollowUpChips suggestions={msg.followUpSuggestions} onSelect={sendMessage} />
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#9b1c4a,var(--vi-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🍷</div>
            <div style={{ padding: "10px 16px", borderRadius: "4px 18px 18px 18px", background: "var(--vi-surface)", border: "1px solid var(--vi-border)" }}>
              <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--vi-accent)", display: "inline-block", animation: `vi-pulse 1.2s ${d * 0.2}s ease-in-out infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions (only when conversation starts) */}
      {showSuggestions && (
        <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
          {QUICK_SUGGESTIONS.map(s => (
            <button key={s.label} onClick={() => sendMessage(s.label)}
              style={{ fontSize: 11, padding: "5px 11px", borderRadius: "var(--vi-radius-full)", border: "1px solid rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.07)", color: "var(--vi-accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: `background var(--vi-dur-fast) var(--vi-ease), border-color var(--vi-dur-fast) var(--vi-ease)` }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,162,39,0.15)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,162,39,0.07)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "8px 12px 10px", borderTop: "1px solid var(--vi-border)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Scrivi un messaggio... (Invio per inviare)"
            rows={compact ? 1 : 2}
            style={{ flex: 1, padding: "9px 12px", borderRadius: "var(--vi-radius-md)", border: "1px solid var(--vi-border)", background: "var(--vi-surface)", color: "var(--vi-text)", fontSize: "max(14px,16px)", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5, transition: `border-color var(--vi-dur) var(--vi-ease)` }}
            onFocus={e => e.target.style.borderColor = "rgba(201,162,39,0.4)"}
            onBlur={e => e.target.style.borderColor = "var(--vi-border)"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            style={{ padding: "0 16px", borderRadius: "var(--vi-radius-md)", border: "none", background: loading || !input.trim() ? "rgba(201,162,39,0.15)" : "linear-gradient(135deg,var(--vi-accent),#a07820)", color: loading || !input.trim() ? "#64748b" : "#000", fontWeight: 800, cursor: loading || !input.trim() ? "default" : "pointer", fontSize: 20, transition: `all var(--vi-dur-fast) var(--vi-ease)`, flexShrink: 0 }}
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
