import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./i18n";
import { useTranslation } from "react-i18next";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart } from "recharts";
import PriceHistoryChart from "./components/PriceHistoryChart";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider, useToast } from "./components/Toast";
import { fetchWithRetry } from "./lib/fetchWithRetry";
import { authFetch } from "./lib/authFetch";
import LandingPage from "./LandingPage";
import { supabase } from "./lib/supabase";
import WineBottle3DModal from "./WineBottle3DModal";
import Pricing from "./pages/Pricing";
import B2BPage from "./pages/B2B";
import DashboardB2B from "./pages/Dashboard";
import WinePriceCompare from "./components/WinePriceCompare";
import LangSelector from "./components/LangSelector";
import AgentChat from "./components/AgentChat";
import PurchaseModal from "./components/PurchaseModal";
import WineCard from "./components/WineCard";
import VirtualWineGrid from "./components/VirtualWineGrid";
import OnboardingModal, { isOnboardingCompleted, resetOnboarding } from "./components/OnboardingModal";
import HelpBot from "./components/HelpBot";
import GuidedTour, { isTourCompleted, resetTour } from "./components/GuidedTour";
import InfoTooltip from "./components/InfoTooltip";
import CookieBanner from "./components/CookieBanner";
import CurrencySelector, { CurrencyProvider, usePrice } from "./components/CurrencySelector";
import VintageScore from "./components/VintageScore";
import InvestmentCalculator from "./components/InvestmentCalculator";
import Learn from "./pages/Learn";
import MarketIndex from "./pages/MarketIndex";
import WineCellar from "./pages/WineCellar";
import WineJournal from "./pages/WineJournal";
import LabelScannerPage from "./pages/LabelScanner";
import ReferralPage from "./pages/ReferralPage";
import SharePortfolio from "./pages/SharePortfolio";
import EnPrimeur from "./pages/EnPrimeur";
import AuctionTracker from "./pages/AuctionTracker";
import PressKit from "./pages/PressKit";
import MarketSentiment from "./pages/MarketSentiment";
import InvestmentGoals from "./pages/InvestmentGoals";
import Transparency from "./pages/Transparency";
import NotificationSettings from "./pages/NotificationSettings";
import Academy from "./pages/Academy";
import AcademyCourse from "./pages/AcademyCourse";
import AcademyLesson from "./pages/AcademyLesson";
import AcademyVerify from "./pages/AcademyVerify";
import AcademyModule from "./pages/AcademyModule";
import AdminDashboard from "./pages/AdminDashboard";
import ThemeToggle from "./components/ThemeToggle";
import VoiceInterface from "./components/VoiceInterface";
import { getSavedTheme, applyTheme } from "./lib/theme";
import "./style.css";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// ── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="wineCard" style={{ pointerEvents: "none" }}>
      <div className="skeleton skeleton-image" />
      <div className="wineCard-body">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-subtitle" />
        <div className="skeleton skeleton-price" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}

// ── News Card ────────────────────────────────────────────────────────────────
// ── AI Portfolio Analysis Component ─────────────────────────────────────────
function AIPortfolioAnalysis({ holdings, totalValue, totalInvested, userId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/ai/portfolio-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, holdings, totalValue, totalInvested }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const signalColor = { "Strong Buy": "#4ade80", "Buy": "#86efac", "Hold": "#C9A227", "Reduce": "#fb923c", "Sell": "#f87171" };

  return (
    <div style={{ marginBottom: 32, background: "rgba(11,18,32,0.85)", border: "1px solid rgba(31,41,55,0.7)", borderRadius: 18, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, margin: 0 }}>AI Analysis del tuo Portfolio</h3>
          <p style={{ fontSize: 12, color: "#3a5a7a", marginTop: 3 }}>Analisi Claude AI basata sulle tue posizioni reali</p>
        </div>
        <button className="btn-primary" style={{ width: "auto", padding: "9px 18px", fontSize: 12 }} onClick={runAnalysis} disabled={loading}>
          {loading ? "Analisi in corso..." : analysis ? "Aggiorna" : "Analizza Portfolio"}
        </button>
      </div>

      {!analysis && !loading && (
        <div style={{ fontSize: 13, color: "#3a5a7a", textAlign: "center", padding: 16, border: "1px dashed rgba(30,41,59,0.5)", borderRadius: 10 }}>
          Clicca "Analizza Portfolio" per ricevere raccomandazioni AI personalizzate su {holdings.length} vini.
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#3a5a7a", padding: 16 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #3a5a7a", borderTopColor: "#C9A227", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
          L'AI sta analizzando il tuo portfolio...
        </div>
      )}

      {analysis && (
        <div>
          {/* Summary row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Segnale", value: analysis.overallSignal, color: signalColor[analysis.overallSignal] || "#C9A227" },
              { label: "Risk Score", value: `${analysis.riskScore}/10`, color: analysis.riskScore > 6 ? "#f87171" : "#4ade80" },
              { label: "Diversificazione", value: `${analysis.diversificationScore}/10`, color: "#60a5fa" },
              { label: "Outlook", value: analysis.marketOutlook, color: analysis.marketOutlook === "Bullish" ? "#4ade80" : analysis.marketOutlook === "Bearish" ? "#f87171" : "#C9A227" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(5,10,20,0.6)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(30,41,59,0.6)" }}>
                <div style={{ fontSize: 10, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Summary text */}
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, lineHeight: 1.65 }}>{analysis.summary}</p>

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Raccomandazioni</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {analysis.recommendations.slice(0, 5).map(r => (
                  <div key={r.wineId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(5,10,20,0.5)", borderRadius: 10, border: "1px solid rgba(30,41,59,0.5)" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5, background: r.action === "Sell" ? "rgba(69,10,10,0.6)" : r.action === "Buy More" ? "rgba(5,46,22,0.6)" : "rgba(12,26,46,0.6)", color: r.action === "Sell" ? "#f87171" : r.action === "Buy More" ? "#4ade80" : "#C9A227", whiteSpace: "nowrap" }}>{r.action}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{holdings.find(h => h.id === r.wineId)?.name || r.wineId}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{r.reason}</div>
                    </div>
                    {r.urgency === "High" && <span style={{ fontSize: 10, color: "#fb923c", fontWeight: 700 }}>URGENTE</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concerns */}
          {analysis.concerns?.length > 0 && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(69,10,10,0.2)", borderRadius: 10, border: "1px solid rgba(153,27,27,0.3)" }}>
              <p style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 6 }}>Rischi identificati</p>
              {analysis.concerns.map((c, i) => <p key={i} style={{ fontSize: 12, color: "#94a3b8" }}>• {c}</p>)}
            </div>
          )}

          {analysis.fallback && <p style={{ fontSize: 10, color: "#1e3050", marginTop: 10 }}>* Analisi algoritmica (ANTHROPIC_API_KEY non configurato sul server)</p>}
        </div>
      )}
    </div>
  );
}

function NewsCard({ article }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const categoryColors = {
    market: { bg: "rgba(12,26,46,0.8)", color: "#60a5fa", border: "rgba(30,58,95,0.5)" },
    investment: { bg: "rgba(5,30,5,0.8)", color: "#4ade80", border: "rgba(22,101,52,0.5)" },
    critic: { bg: "rgba(30,10,0,0.8)", color: "#fb923c", border: "rgba(154,52,18,0.5)" },
    auction: { bg: "rgba(20,5,30,0.8)", color: "#c084fc", border: "rgba(88,28,135,0.5)" },
    technology: { bg: "rgba(5,20,30,0.8)", color: "#38bdf8", border: "rgba(14,116,144,0.5)" },
  };
  const cat = categoryColors[article.category] || categoryColors.market;

  return (
    <div className="news-card fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <div className="news-source">{article.source?.name || "Wine Intelligence"}</div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {article.category || "market"}
        </span>
      </div>
      <h3>{article.title}</h3>
      {article.description && <p>{article.description}</p>}
      <div className="news-meta">
        <span>{timeAgo(article.publishedAt)}</span>
        {article.url && article.url !== "#" ? (
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read more →</a>
        ) : (
          <span style={{ color: "#1e3050" }}>—</span>
        )}
      </div>
    </div>
  );
}

// ── Market Watch ─────────────────────────────────────────────────────────────
const LIVEX_INDICES = [
  { name: "Liv-ex 100", base: 358.2 },
  { name: "Fine Wine 50", base: 512.6 },
  { name: "Burgundy 150", base: 1248.4 },
  { name: "Bordeaux 500", base: 287.9 },
  { name: "Italy 100",   base: 445.3 },
  { name: "Champagne",   base: 196.8 },
];

function MarketWatch() {
  const indices = useMemo(() => {
    const seed = Math.floor(Date.now() / (1000 * 3600 * 4));
    return LIVEX_INDICES.map((idx, i) => {
      const x = Math.sin(seed + i * 7.3) * 10000;
      const r = x - Math.floor(x);
      const changePct = ((r - 0.44) * 5).toFixed(2);
      const value = (idx.base * (1 + Number(changePct) / 100)).toFixed(1);
      return { ...idx, value: Number(value), changePct: Number(changePct) };
    });
  }, []);

  return (
    <div className="market-watch">
      <h3>Market Watch · Simulated Liv-ex Indices</h3>
      <div className="market-indices">
        {indices.map(idx => (
          <div key={idx.name} className="market-index">
            <div className="market-index-name">{idx.name}</div>
            <div className="market-index-value">{idx.value.toLocaleString()}</div>
            <div className={`market-index-change ${idx.changePct >= 0 ? "up" : "down"}`}>
              {idx.changePct >= 0 ? "▲" : "▼"} {Math.abs(idx.changePct)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Portfolio Sparkline ───────────────────────────────────────────────────────
function PortfolioSparkline({ wineId, purchasePrice, currentPrice }) {
  const sparkData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const t = i / 5;
      const base = purchasePrice + (currentPrice - purchasePrice) * t;
      const noise = base * 0.012 * (i % 2 === 0 ? 1 : -1);
      return { v: Math.round(base + noise) };
    });
  }, [wineId, purchasePrice, currentPrice]);

  const color = currentPrice >= purchasePrice ? "#4ade80" : "#f87171";
  return (
    <LineChart width={80} height={30} data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
    </LineChart>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setVisible(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 100, left: 16, right: 16, zIndex: 8888,
      background: "#0f172a", border: "1px solid rgba(201,162,39,0.4)", borderRadius: 14,
      padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      maxWidth: 400, margin: "0 auto",
    }}>
      <span style={{ fontSize: 28 }}>📱</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>Install VinoInvest</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>Add to home screen for quick access</div>
      </div>
      <button onClick={async () => { deferredPrompt?.prompt(); setVisible(false); }} style={{ background: "#C9A227", color: "#020617", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Install</button>
      <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, padding: 0 }}>×</button>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const ADMIN_EMAIL = "manumila88@gmail.com";
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const isAdmin = userEmail === ADMIN_EMAIL;
  const [accountType, setAccountType] = useState("b2c");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [chatInitMsg, setChatInitMsg] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [modalWine, setModalWine] = useState(null);
  const [purchaseWine, setPurchaseWine] = useState(null);
  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [marketWines, setMarketWines] = useState([]);
  const [marketPage, setMarketPage] = useState(1);
  const [marketSearch, setMarketSearch] = useState("");
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketHasMore, setMarketHasMore] = useState(true);
  const marketSentinelRef = useRef(null);
  const mLoadingRef = useRef(false);
  const mHasMoreRef = useRef(true);
  const mPageRef = useRef(1);
  const mSearchRef = useRef("");
  const mDebounceRef = useRef(null);
  const [portfolio, setPortfolio] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedWine, setSelectedWine] = useState(null);
  const [aiScores, setAiScores] = useState({});
  const fetchedAIRef = useRef(new Set());
  const aiQueueRef = useRef([]);
  const aiBusyRef = useRef(false);
  const [alerts, setAlerts] = useState([]);
  const [alertInputs, setAlertInputs] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [budget, setBudget] = useState(10000);
  const [risk, setRisk] = useState("medio");
  const [years, setYears] = useState(5);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [backendWaking, setBackendWaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const analysisChartRef = useRef(null);
  const [analysisChartW, setAnalysisChartW] = useState(600);
  const portfolioChartRef = useRef(null);
  const [portfolioChartW, setPortfolioChartW] = useState(600);
  const marketGridRef = useRef(null);
  const [marketGridW, setMarketGridW] = useState(900);
  const [floatChatOpen, setFloatChatOpen] = useState(false);
  const [floatUnread, setFloatUnread] = useState(0);

  // ── Premium features state ───────────────────────────────────────────────
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsFilter, setNewsFilter] = useState("all");
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [trending, setTrending] = useState([]);
  const [heroSearch, setHeroSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const heroSearchRef = useRef(null);
  const suggestDebounceRef = useRef(null);
  const [proactiveWines, setProactiveWines] = useState([]);
  const [proactiveTrigger, setProactiveTrigger] = useState(null); // wine that triggered "similar"

  // ── ESC key closes overlays ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setFloatChatOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Offline detection ────────────────────────────────────────────────────
  useEffect(() => {
    const go = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online", go);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", go); window.removeEventListener("offline", off); };
  }, []);

  // ── Backend wakeup ping (Render free tier cold start) ────────────────────
  useEffect(() => {
    const start = Date.now();
    setBackendWaking(true);
    fetch(`${API}/api/health`, { signal: AbortSignal.timeout(8000) })
      .then(() => setBackendWaking(false))
      .catch(() => {
        // Server may be sleeping — keep banner visible, retry once after 6s
        setTimeout(() => {
          fetch(`${API}/api/health`, { signal: AbortSignal.timeout(15000) })
            .finally(() => setBackendWaking(false));
        }, 6000);
      });
  }, []);

  // ── Chart + market grid responsive widths ───────────────────────────────
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        if (e.target === analysisChartRef.current) setAnalysisChartW(e.contentRect.width || 600);
        if (e.target === portfolioChartRef.current) setPortfolioChartW(e.contentRect.width || 600);
        if (e.target === marketGridRef.current) setMarketGridW(e.contentRect.width || 900);
      }
    });
    if (analysisChartRef.current) obs.observe(analysisChartRef.current);
    if (portfolioChartRef.current) obs.observe(portfolioChartRef.current);
    if (marketGridRef.current) obs.observe(marketGridRef.current);
    return () => obs.disconnect();
  }, [tab]);

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session) {
        const { data: ud } = await supabase.from("users").select("account_type").eq("id", session.user.id).single();
        const type = ud?.account_type || "b2c";
        setUserEmail(session.user.email);
        setAccountType(type);
        setIsLoggedIn(true);
        localStorage.setItem("vino_user", JSON.stringify({ email: session.user.email, account_type: type }));
        localStorage.setItem("vino_user_id", session.user.id);
        if (!isOnboardingCompleted(type)) setTimeout(() => setShowOnboarding(true), 600);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUserEmail("");
        setAccountType("b2c");
        localStorage.removeItem("vino_user");
        localStorage.removeItem("vino_user_id");
      }
      // Mark auth check done after INITIAL_SESSION (fired even when no session)
      if (event === "INITIAL_SESSION") setAuthChecked(true);
    });
    // Safety fallback: if INITIAL_SESSION never fires (placeholder keys), unblock UI
    const fallback = setTimeout(() => setAuthChecked(true), 1500);
    return () => { subscription.unsubscribe(); clearTimeout(fallback); };
  }, []);

  useEffect(() => { if (isLoggedIn) { loadData(); loadTrending(); } }, [isLoggedIn]);

  async function loadData() {
    try {
      const uid = getUserId();
      const [winesRes, ordersRes] = await Promise.all([
        fetch(`${API}/api/market/wines`),
        fetch(`${API}/api/orders?userId=${encodeURIComponent(uid)}`),
      ]);
      setWines(await winesRes.json());
      const od = await ordersRes.json();
      setOrders(Array.isArray(od) ? od : []);
    } catch (e) { console.error(e); }
  }

  async function loadMarketWines(search, page, append) {
    if (mLoadingRef.current) return;
    mLoadingRef.current = true;
    setMarketLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      const res = await fetch(`${API}/api/wines?${params}`);
      const data = await res.json();
      setMarketWines(prev => append ? [...prev, ...data.results] : data.results);
      setMarketPage(data.page);
      mPageRef.current = data.page;
      setMarketHasMore(data.hasMore);
      mHasMoreRef.current = data.hasMore;
    } catch (e) { console.error(e); }
    finally { mLoadingRef.current = false; setMarketLoading(false); }
  }

  function handleMarketSearch(value) {
    setMarketSearch(value);
    mSearchRef.current = value;
    clearTimeout(mDebounceRef.current);
    mDebounceRef.current = setTimeout(() => {
      mHasMoreRef.current = true;
      loadMarketWines(value, 1, false);
    }, 400);
  }

  useEffect(() => {
    if (tab === "market" && marketWines.length === 0 && !mLoadingRef.current) {
      loadMarketWines("", 1, false);
    }
  }, [tab]);

  useEffect(() => {
    const sentinel = marketSentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !mLoadingRef.current && mHasMoreRef.current) {
        loadMarketWines(mSearchRef.current, mPageRef.current + 1, true);
      }
    }, { rootMargin: "400px" });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [tab, marketWines]);

  // ── Hero search with autocomplete ────────────────────────────────────────
  function handleHeroSearch(value) {
    setHeroSearch(value);
    clearTimeout(suggestDebounceRef.current);
    if (!value.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    suggestDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/wines?search=${encodeURIComponent(value)}&limit=6`);
        const data = await res.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch {}
    }, 300);
  }

  function selectSuggestion(wine) {
    setHeroSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setMarketSearch(wine.name);
    mSearchRef.current = wine.name;
    setTab("market");
    setTimeout(() => loadMarketWines(wine.name, 1, false), 100);
  }

  useEffect(() => {
    function clickOutside(e) {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // ── News ─────────────────────────────────────────────────────────────────
  async function loadNews(country = "all") {
    setNewsLoading(true);
    try {
      const lang = i18n.language?.slice(0, 2) || "en";
      const res = await fetch(`${API}/api/news?country=${country}&lang=${lang}`);
      const data = await res.json();
      setNews(data.articles || []);
    } catch { setNews([]); }
    setNewsLoading(false);
  }

  useEffect(() => {
    if (tab === "news") loadNews(newsFilter);
    if (tab === "blog") loadBlogPosts();
  }, [tab, i18n.language]);

  async function loadBlogPosts() {
    setBlogLoading(true);
    try {
      const lang = i18n.language?.slice(0, 2) || "it";
      const res = await fetch(`${API}/api/blog?lang=${lang}`);
      const data = await res.json();
      setBlogPosts(data.posts || []);
    } catch { setBlogPosts([]); }
    setBlogLoading(false);
  }

  function handleNewsFilter(country) {
    setNewsFilter(country);
    loadNews(country);
  }

  // ── Trending ─────────────────────────────────────────────────────────────
  async function loadTrending() {
    try {
      const res = await fetch(`${API}/api/trending`);
      const data = await res.json();
      setTrending(data.wines || []);
    } catch {}
  }

  // ── Chart ────────────────────────────────────────────────────────────────
  async function loadChart(wineId, currentPrice) {
    setChartData([]);
    try {
      const res = await fetch(`${API}/api/prices/${encodeURIComponent(wineId)}/history?currentPrice=${currentPrice || 100}&timeframe=1y`);
      const data = await res.json();
      const byMonth = {};
      (data.history || []).forEach(item => {
        const month = new Date(item.recorded_at).toISOString().slice(0, 7);
        byMonth[month] = Number(item.price);
      });
      setChartData(Object.entries(byMonth).map(([date, price]) => ({ date, price })));
    } catch (e) { console.error(e); }
  }

  async function generatePortfolio() {
    try {
      const res = await fetch(`${API}/api/portfolio-builder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, risk, horizonYears: years }),
      });
      setPortfolio(await res.json());
    } catch (e) { console.error(e); }
  }

  // AI Score: throttled queue — max 1 call per 200ms, prevents API flooding
  async function processAIQueue() {
    if (aiBusyRef.current) return;
    aiBusyRef.current = true;
    while (aiQueueRef.current.length > 0) {
      const wine = aiQueueRef.current.shift();
      try {
        const res = await fetchWithRetry(`${API}/api/ai-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: wine.id, name: wine.name, producer: wine.producer, vintage: wine.vintage, region: wine.region, country: wine.country, criticScore: wine.criticScore || wine.investmentScore, marketTrend: wine.marketTrend, risk: wine.risk, currentPrice: wine.currentPrice }),
        }, 1);
        if (res.ok) {
          const data = await res.json();
          setAiScores(prev => ({ ...prev, [wine.id]: data }));
        }
      } catch {}
      await new Promise(r => setTimeout(r, 200));
    }
    aiBusyRef.current = false;
  }

  function queueAIScore(wine) {
    if (fetchedAIRef.current.has(wine.id)) return;
    fetchedAIRef.current.add(wine.id);
    aiQueueRef.current.push(wine);
    processAIQueue();
  }

  useEffect(() => {
    if (marketWines.length === 0) return;
    marketWines.forEach(wine => queueAIScore(wine));
  }, [marketWines]);

  function getUserId() {
    const stored = localStorage.getItem("vino_user");
    if (stored) { try { return JSON.parse(stored).email || "anonymous"; } catch {} }
    let id = localStorage.getItem("vino_device_id");
    if (!id) { id = "device_" + Math.random().toString(36).slice(2); localStorage.setItem("vino_device_id", id); }
    return id;
  }

  async function loadAlerts() {
    const uid = getUserId();
    try {
      const res = await fetch(`${API}/api/alerts/${encodeURIComponent(uid)}`);
      if (res.ok) setAlerts(await res.json());
    } catch {}
  }

  const createAlert = useCallback(async (wine) => {
    const target = parseFloat(alertInputs[wine.id]);
    if (!target || target <= 0) return;
    const uid = getUserId();
    try {
      const res = await fetch(`${API}/api/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, wineId: wine.id, wineName: wine.name, targetPrice: target, direction: "below" }),
      });
      if (res.ok) { setAlertInputs(prev => ({ ...prev, [wine.id]: "" })); await loadAlerts(); }
    } catch {}
  }, [alertInputs]);

  const deleteAlert = useCallback(async (alertId) => {
    try {
      await fetch(`${API}/api/alerts/${alertId}`, { method: "DELETE" });
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch {}
  }, []);

  async function loadNotifications() {
    const uid = getUserId();
    try {
      const res = await fetch(`${API}/api/notifications/${encodeURIComponent(uid)}`);
      if (res.ok) setNotifications(await res.json());
    } catch {}
  }

  async function markAllRead() {
    const uid = getUserId();
    try {
      await fetch(`${API}/api/notifications/read-all/${encodeURIComponent(uid)}`, { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    loadAlerts();
    loadNotifications();
    const poll = setInterval(loadNotifications, 30000);
    return () => clearInterval(poll);
  }, [isLoggedIn]);

  // Browser push notification when new unread arrives
  const prevUnreadRef = useRef(0);
  useEffect(() => {
    const current = notifications.filter(n => !n.read).length;
    if (current > prevUnreadRef.current && prevUnreadRef.current !== 0) {
      if (Notification.permission === "granted") {
        new Notification("VinoInvest", { body: `${current - prevUnreadRef.current} new price alert${current - prevUnreadRef.current > 1 ? "s" : ""}`, icon: "/favicon.ico" });
      }
    }
    prevUnreadRef.current = current;
  }, [notifications]);

  async function buyWine(wineId, purchasePrice) {
    try {
      const res = await authFetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wineId, quantity: 1, purchasePrice, userId: getUserId() }),
      });
      if (res.ok) {
        toast("Posizione aggiunta al portfolio", "success");
        loadData();
      } else {
        toast("Errore nell'aggiungere la posizione", "error");
      }
    } catch {
      toast("Errore di rete", "error");
    }
  }

  const toggleWatchlist = useCallback((wine) => {
    const wineId = wine.id;
    if (watchlist.includes(wineId)) {
      setWatchlist(prev => prev.filter(id => id !== wineId));
      setSelectedWine(null);
      setChartData([]);
    } else {
      setWatchlist(prev => [...prev, wineId]);
      setSelectedWine(wine);
      loadChart(wineId, wine.currentPrice);
    }
  }, [watchlist]);

  const handleAlertInputChange = useCallback((wineId, value) => {
    setAlertInputs(prev => ({ ...prev, [wineId]: value }));
  }, []);

  const handleImageClick = useCallback((wine) => {
    setModalWine(wine);
    // Proactive: load similar wines in background
    fetch(`${API}/api/agent/similar/${encodeURIComponent(wine.id)}`)
      .then(r => r.ok ? r.json() : { wines: [] })
      .then(d => { if (d.wines?.length) { setProactiveWines(d.wines); setProactiveTrigger(wine.name); } })
      .catch(() => {});
  }, []);

  const handleAddToPortfolio = useCallback((wine) => {
    setPurchaseWine(wine);
  }, []);

  // ── 3D tilt handlers ─────────────────────────────────────────────────────
  const onCardTilt = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rx = ((cy - y) / cy) * 7;
    const ry = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  }, []);

  const onCardTiltReset = useCallback((e) => {
    e.currentTarget.style.transform = "";
  }, []);

  const totalMarket = useMemo(
    () => wines.reduce((sum, wine) => sum + Number(wine.currentPrice || 0), 0),
    [wines]
  );

  const holdings = useMemo(() => orders.map(order => {
    const wineId = order.wine_id || order.wineId;
    const wine = wines.find(w => w.id === wineId);
    const quantity = Number(order.quantity || 1);
    const purchasePrice = Number(order.purchasePrice || 0);
    const currentPrice = Number(order.currentMarketPrice) || Number(wine?.currentPrice || 0);
    if (!purchasePrice && !currentPrice) return null;
    const invested = purchasePrice * quantity;
    const currentValue = currentPrice * quantity;
    const profit = currentValue - invested;
    const roi = invested > 0 ? ((profit / invested) * 100).toFixed(2) : 0;
    return { id: wineId, name: order.wineName || wine?.name || wineId, quantity, purchasePrice, currentPrice, invested, currentValue, profit, roi };
  }).filter(Boolean), [orders, wines]);

  const portfolioValue = useMemo(() => holdings.reduce((sum, item) => sum + item.currentValue, 0), [holdings]);
  const totalInvested = useMemo(() => holdings.reduce((sum, item) => sum + item.invested, 0), [holdings]);
  const totalProfit = portfolioValue - totalInvested;
  const portfolioROI = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(2) : 0;

  const growthData = useMemo(() => {
    const startMonth = new Date();
    startMonth.setMonth(startMonth.getMonth() - 11);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(startMonth);
      d.setMonth(d.getMonth() + i);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        value: Math.round(portfolioValue * (0.912 + i * 0.0073)),
      };
    });
  }, [portfolioValue]);

  // Stable props object for VirtualWineGrid — must be before the early return (hook rules)
  const cardProps = useMemo(() => ({
    aiScores,
    alerts,
    alertInputs,
    watchlist,
    onImageClick: handleImageClick,
    onAddToPortfolio: handleAddToPortfolio,
    onToggleWatchlist: toggleWatchlist,
    onCardTilt,
    onCardTiltReset,
    onCreateAlert: createAlert,
    onAlertInputChange: handleAlertInputChange,
    onDeleteAlert: deleteAlert,
  }), [aiScores, alerts, alertInputs, watchlist, handleImageClick, handleAddToPortfolio, toggleWatchlist, onCardTilt, onCardTiltReset, createAlert, handleAlertInputChange, deleteAlert]);

  // Spinner while Supabase checks existing session (prevents flash of landing page)
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, border: "3px solid rgba(201,162,39,0.2)", borderTopColor: "#C9A227", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: "#C9A227", fontFamily: "Inter, sans-serif", fontSize: 14, letterSpacing: "0.05em" }}>VinoInvest</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <LandingPage
        onLogin={({ user, account_type }) => {
          setUserEmail(user.email);
          setAccountType(account_type);
          setIsLoggedIn(true);
          localStorage.setItem("vino_user", JSON.stringify({ email: user.email, account_type }));
          localStorage.setItem("vino_user_id", user.id);
          if (!isOnboardingCompleted(account_type)) setTimeout(() => setShowOnboarding(true), 600);
        }}
      />
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app">
      {/* ── Offline banner ───────────────────────────────────────────────── */}
      {backendWaking && (
        <div style={{ background: "#1c1400", color: "#C9A227", padding: "8px 20px", fontSize: 12, fontWeight: 600, textAlign: "center", zIndex: 999, borderBottom: "1px solid rgba(201,162,39,0.2)" }}>
          {t("auth.serverStarting")}
        </div>
      )}
      {isOffline && (
        <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "8px 20px", fontSize: 13, fontWeight: 600, textAlign: "center", zIndex: 999 }}>
          {t("auth.offline")}
        </div>
      )}
      {/* ── Glassmorphism Header ─────────────────────────────────────────── */}
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">☰</button>
          <div className="logo">🍷 Vino<span>Invest</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="badge">global wine intelligence</div>
          <button
            onClick={() => { resetOnboarding(); setShowOnboarding(true); }}
            title="Riapri guida"
            style={{ padding: "5px 10px", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 8, background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "'Inter',Arial,sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#C9A227"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
          >📖 Guida</button>
          <button
            onClick={() => { resetTour(); setShowTour(true); }}
            title="Fai il tour guidato"
            style={{ padding: "5px 10px", border: "1px solid rgba(30,58,95,0.5)", borderRadius: 8, background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "'Inter',Arial,sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(30,58,95,0.5)"; }}
          >🗺 Tour</button>
          <button
            onClick={() => setShowCalculator(true)}
            title="Investment Calculator"
            style={{ padding: "5px 10px", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 8, background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "'Inter',Arial,sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)"; }}
          >🧮 Calc</button>
          <button
            onClick={() => navigate("/academy")}
            title="Wine Investment Academy"
            style={{ padding: "5px 10px", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "'Inter',Arial,sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"; }}
          >🎓 Academy</button>
          <button
            onClick={() => navigate("/market-index")}
            title="VinoInvest Index"
            style={{ padding: "5px 10px", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 8, background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "'Inter',Arial,sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#C9A227"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
          >📊 Index</button>
          <a href="/scan" title="Scan wine label" style={{ padding: "6px 10px", border: "1px solid rgba(30,41,59,0.7)", borderRadius: 8, background: "transparent", color: "#4a6a8a", fontSize: 15, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center" }}>📷</a>
          <CurrencySelector />
          <LangSelector />
          {userEmail && <span style={{ fontSize: 12, color: "#3a5a7a" }}>{userEmail}</span>}
          {isAdmin && (
            <a href="/admin" style={{ fontSize: 10, color: "#C9A227", border: "1px solid rgba(201,162,39,0.5)", borderRadius: 4, padding: "2px 8px", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.08em", textDecoration: "none", background: "rgba(201,162,39,0.08)" }}>
              ADMIN
            </a>
          )}
          {accountType && !isAdmin && (
            <span style={{ fontSize: 10, color: "#C9A227", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 4, padding: "2px 7px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
              {accountType}
            </span>
          )}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setTab("notifications"); markAllRead(); }}
              style={{ padding: "6px 10px", border: "1px solid rgba(30,41,59,0.7)", borderRadius: 8, background: "transparent", color: "#4a6a8a", fontSize: 15, cursor: "pointer", position: "relative", transition: "border-color 0.2s" }}
            >🔔
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", borderRadius: "50%", fontSize: 9, width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            style={{ padding: "6px 14px", border: "1px solid rgba(30,41,59,0.7)", borderRadius: 8, background: "transparent", color: "#4a6a8a", fontSize: 12, cursor: "pointer", fontFamily: "'Inter', Arial, sans-serif", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; e.currentTarget.style.color = "#C9A227"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(30,41,59,0.7)"; e.currentTarget.style.color = "#4a6a8a"; }}
          >{t("auth.signOut")}</button>
        </div>
      </header>

      <main className="main">
        {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
        <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {[
            { id: "dashboard",  label: "Dashboard" },
            { id: "market",     label: t("nav.market") },
            { id: "news",       label: t("nav.news") },
            { id: "blog",       label: t("nav.blog") },
            { id: "analysis",   label: t("nav.analysis") },
            { id: "myportfolio",label: t("nav.portfolio") },
            { id: "portfolio",  label: t("nav.portfolioAI") },
          ].map(({ id, label }) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => { setTab(id); setSidebarOpen(false); }}>{label}</button>
          ))}
          {accountType === "cantina" && (
            <button className={tab === "b2b" ? "active" : ""} onClick={() => { setTab("b2b"); setSidebarOpen(false); }}>{t("nav.b2b")}</button>
          )}
          <button
            className={tab === "notifications" ? "active" : ""}
            onClick={() => { setTab("notifications"); markAllRead(); setSidebarOpen(false); }}
            style={{ position: "relative" }}
          >
            🔔 {t("nav.alerts")}{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
          <button onClick={() => { navigate("/pricing"); setSidebarOpen(false); }} style={{ marginTop: "auto" }}>{t("nav.pricing")}</button>
        </aside>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <section className="content">
          <ErrorBoundary>
          {/* ── Dashboard ─────────────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <>
              <section className="hero">
                <h1>Global Wine Investment Platform</h1>
                <p>AI portfolio builder, wine intelligence, analytics and worldwide search.</p>

                {/* Universal Search */}
                <div ref={heroSearchRef} className="hero-search-wrapper">
                  <input
                    className="hero-search-input"
                    placeholder={t("hero.searchPlaceholder")}
                    value={heroSearch}
                    onChange={e => handleHeroSearch(e.target.value)}
                    onFocus={() => heroSearch && setShowSuggestions(true)}
                  />
                  <span className="hero-search-icon">🔍</span>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                      {suggestions.map(w => (
                        <div key={w.id} className="suggestion-item" onClick={() => selectSuggestion(w)}>
                          <span className="suggestion-name">{w.name}</span>
                          <span className="suggestion-detail">{w.producer} · {w.vintage}</span>
                          <span className="suggestion-type">{w.region ? w.region.split(",")[0] : "Wine"}</span>
                          <span className="suggestion-price">€{w.currentPrice}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="statsGrid">
                {[
                  { label: t("stats.globalMarket"), value: `€ ${totalMarket.toFixed(0)}` },
                  { label: t("stats.portfolioValue"), value: `€ ${portfolioValue.toFixed(0)}` },
                  { label: t("stats.invested"), value: `€ ${totalInvested.toFixed(0)}` },
                  { label: t("stats.profitLoss"), value: `€ ${totalProfit.toFixed(0)}` },
                  { label: t("stats.roi"), value: `${portfolioROI}%` },
                  { label: t("stats.watchlist"), value: watchlist.length },
                ].map((s, i) => (
                  <div key={i} className="statCard fade-up">
                    <small>{s.label}</small>
                    <h2>{s.value}</h2>
                  </div>
                ))}
              </section>

              {/* Two-column: Trending + Market Watch */}
              <div className="dashboard-cols">
                {/* Trending Wines */}
                <div>
                  <div className="section-header">
                    <div>
                      <div className="section-title">Trending Wines</div>
                      <div className="section-sub">Top movers in the last 24h</div>
                    </div>
                    <button
                      onClick={loadTrending}
                      style={{ fontSize: 11, color: "#C9A227", background: "none", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'Inter', Arial, sans-serif" }}
                    >Refresh</button>
                  </div>
                  <div className="trending-list">
                    {trending.length === 0
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="trending-item" style={{ minHeight: 52 }}>
                            <div className="skeleton" style={{ width: "100%", height: 20, borderRadius: 6 }} />
                          </div>
                        ))
                      : trending.map((w, i) => (
                          <div
                            key={w.id || i}
                            className="trending-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => { setMarketSearch(w.name); mSearchRef.current = w.name; setTab("market"); setTimeout(() => loadMarketWines(w.name, 1, false), 100); }}
                          >
                            <span className="trending-rank">{i + 1}</span>
                            <div className="trending-info">
                              <div className="trending-name">{w.name}</div>
                              <div className="trending-region">{w.producer} · {w.region}</div>
                            </div>
                            <span className={`trending-change ${w.change >= 0 ? "up" : "down"}`}>
                              {w.change >= 0 ? "+" : ""}{w.change}%
                            </span>
                          </div>
                        ))
                    }
                  </div>
                </div>

                {/* Market Watch */}
                <MarketWatch />
              </div>
            </>
          )}

          {/* ── Market ──────────────────────────────────────────────────────── */}
          {tab === "market" && (
            <>
              <input
                className="searchInput"
                placeholder={t("market.searchPlaceholder")}
                value={marketSearch}
                onChange={e => handleMarketSearch(e.target.value)}
              />
              <div ref={marketGridRef} style={{ width: "100%" }}>
                {marketLoading && marketWines.length === 0 ? (
                  <section className="marketGrid">
                    {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                  </section>
                ) : marketWines.length > 0 ? (
                  <VirtualWineGrid
                    wines={marketWines}
                    containerWidth={marketGridW || 900}
                    listHeight={Math.min(880, window.innerHeight - 160)}
                    cardProps={cardProps}
                    sentinelRef={marketSentinelRef}
                  />
                ) : null}
                {marketLoading && marketWines.length > 0 && (
                  <div style={{ textAlign: "center", padding: "20px", color: "#3a5a7a", fontSize: 12 }}>{t("market.loadingMore")}</div>
                )}
                {!marketLoading && marketWines.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px", color: "#3a5a7a", fontSize: 14 }}>{t("market.noWines")}</div>
                )}
              </div>

              {/* ── Proactive AI: "Simili a..." ─────────────────────────── */}
              {proactiveWines.length > 0 && proactiveTrigger && (
                <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(11,18,32,0.7)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#C9A227" }}>🍷 L'AI suggerisce anche...</span>
                      <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>Simili a {proactiveTrigger}</span>
                    </div>
                    <button onClick={() => { setProactiveWines([]); setProactiveTrigger(null); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {proactiveWines.slice(0, 4).map(w => (
                      <div key={w.id} onClick={() => setModalWine(w)} style={{ flex: "1 1 180px", minWidth: 150, maxWidth: 220, padding: "10px 12px", background: "rgba(5,10,20,0.8)", border: "1px solid rgba(30,41,59,0.6)", borderRadius: 10, cursor: "pointer", transition: "border-color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(30,41,59,0.6)"}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>{w.region} · {w.vintage || ""}</div>
                        <div style={{ marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "#C9A227", fontWeight: 700 }}>€{w.price}</span>
                          {w.score && <span style={{ fontSize: 10, color: "#4ade80" }}>⭐{w.score}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Wine News ─────────────────────────────────────────────────── */}
          {tab === "news" && (
            <section>
              <div className="hero" style={{ marginBottom: 20 }}>
                <h1>Wine News</h1>
                <p>Latest intelligence from global fine wine markets</p>
              </div>
              <div className="news-filters">
                {[
                  { key: "all", label: "All Markets" },
                  { key: "IT",  label: "🇮🇹 Italy" },
                  { key: "FR",  label: "🇫🇷 France" },
                  { key: "US",  label: "🇺🇸 USA" },
                  { key: "AU",  label: "🇦🇺 Australia" },
                  { key: "ZA",  label: "🇿🇦 South Africa" },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`news-filter-btn ${newsFilter === f.key ? "active" : ""}`}
                    onClick={() => handleNewsFilter(f.key)}
                  >{f.label}</button>
                ))}
              </div>
              {newsLoading ? (
                <div className="news-grid">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(31,41,55,0.6)", borderRadius: 16, padding: 18, minHeight: 160 }}>
                      <div className="skeleton" style={{ width: "40%", height: 10, marginBottom: 9 }} />
                      <div className="skeleton" style={{ width: "90%", height: 14, marginBottom: 5 }} />
                      <div className="skeleton" style={{ width: "75%", height: 14, marginBottom: 12 }} />
                      <div className="skeleton" style={{ width: "100%", height: 11, marginBottom: 4 }} />
                      <div className="skeleton" style={{ width: "100%", height: 11, marginBottom: 4 }} />
                      <div className="skeleton" style={{ width: "60%", height: 11 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="news-grid">
                  {news.map((article, i) => <NewsCard key={article.id || i} article={article} />)}
                  {news.length === 0 && (
                    <div style={{ color: "#3a5a7a", padding: 24, gridColumn: "1/-1", textAlign: "center" }}>No news available for this filter.</div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── Blog AI ───────────────────────────────────────────────────── */}
          {tab === "blog" && (
            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, margin: 0 }}>Wine Investment Blog</h2>
                  <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Articoli generati dall'AI · aggiornati ogni 24h</p>
                </div>
                {selectedPost && (
                  <button onClick={() => setSelectedPost(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.6)", background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer" }}>← Tutti gli articoli</button>
                )}
              </div>

              {blogLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#3a5a7a", padding: 24 }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #3a5a7a", borderTopColor: "#C9A227", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  Generazione articoli AI in corso...
                </div>
              )}

              {selectedPost ? (
                /* ── Full post view ─── */
                <article style={{ maxWidth: 720 }}>
                  <div style={{ fontSize: 11, color: "#C9A227", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{selectedPost.category} · {selectedPost.readTime} di lettura</div>
                  <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, lineHeight: 1.25, marginBottom: 12 }}>{selectedPost.title}</h1>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 24 }}>
                    {selectedPost.author} · {new Date(selectedPost.publishedAt).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <div style={{ borderLeft: "3px solid #C9A227", paddingLeft: 16, marginBottom: 24, color: "#94a3b8", fontSize: 14, fontStyle: "italic" }}>{selectedPost.excerpt}</div>
                  {(selectedPost.content || "").split("\n\n").map((para, i) => (
                    <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: "#cbd5e1", marginBottom: 18 }}>{para}</p>
                  ))}
                  <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 12 }}>
                    <p style={{ fontSize: 13, color: "#C9A227", fontWeight: 700, marginBottom: 6 }}>Inizia a investire</p>
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Usa l'AI Score di VinoInvest per trovare le migliori opportunità di investimento.</p>
                    <button className="btn-primary" style={{ width: "auto", padding: "10px 20px" }} onClick={() => { setSelectedPost(null); setTab("market"); }}>Esplora il Mercato →</button>
                  </div>
                </article>
              ) : (
                /* ── Post grid ─── */
                <div className="news-grid">
                  {blogPosts.map(post => (
                    <div
                      key={post.id}
                      className="news-card fade-up"
                      onClick={() => setSelectedPost(post)}
                      style={{ cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#C9A227", textTransform: "uppercase", letterSpacing: "0.1em" }}>{post.category}</span>
                        <span style={{ fontSize: 10, color: "#3a5a7a" }}>{post.readTime}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, lineHeight: 1.4, marginBottom: 10, color: "#e2e8f0" }}>{post.title}</h3>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#3a5a7a" }}>
                        <span>{post.author}</span>
                        <span style={{ color: "#C9A227", fontWeight: 600 }}>Leggi →</span>
                      </div>
                    </div>
                  ))}
                  {!blogLoading && blogPosts.length === 0 && (
                    <div style={{ color: "#3a5a7a", padding: 24, gridColumn: "1/-1", textAlign: "center" }}>Nessun articolo disponibile.</div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── Analysis ──────────────────────────────────────────────────── */}
          {tab === "analysis" && (
            <section className="chartPanel">
              <h2>Watchlist Analysis</h2>
              {!selectedWine && <p>Add wines to watchlist from Market section.</p>}
              {selectedWine && (
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, marginBottom: 8 }}>{selectedWine.name}</h3>
                  <p>Current Price: € {selectedWine.currentPrice}</p>
                  <p>Investment Score: {selectedWine.investmentScore}</p>
                </div>
              )}
              <div className="chartBox" ref={analysisChartRef}>
                <LineChart data={chartData} width={analysisChartW || 600} height={340}>
                  <CartesianGrid stroke="#0f1a2e" />
                  <XAxis dataKey="date" stroke="#3a5a7a" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#3a5a7a" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="price" stroke="#C9A227" strokeWidth={3} dot={false} />
                </LineChart>
              </div>
            </section>
          )}

          {/* ── My Portfolio ──────────────────────────────────────────────── */}
          {tab === "myportfolio" && (
            <section className="ordersPanel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ margin: 0 }}>My Portfolio</h2>
                {holdings.length > 0 && (
                  <button
                    className="btn-primary"
                    style={{ width: "auto", padding: "9px 18px", fontSize: 12 }}
                    onClick={() => {
                      const rows = [
                        ["Wine", "Bottles", "Buy Price (€)", "Current Price (€)", "Invested (€)", "Value (€)", "Profit/Loss (€)", "ROI (%)"],
                        ...holdings.map(h => [h.name, h.quantity, h.purchasePrice, h.currentPrice, h.invested.toFixed(2), h.currentValue.toFixed(2), h.profit.toFixed(2), h.roi]),
                        ["TOTAL", "", "", "", totalInvested.toFixed(2), portfolioValue.toFixed(2), totalProfit.toFixed(2), portfolioROI],
                      ];
                      const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
                      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a"); a.href = url; a.download = "vinoinvest_portfolio.csv"; a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >Export CSV</button>
                )}
              </div>
              {holdings.length === 0 && <p style={{ color: "#3a5a7a" }}>No positions yet. Go to Market and add a position.</p>}
              {holdings.length > 0 && (
                <>
                  <div className="statsGrid" style={{ marginBottom: 28 }}>
                    {[
                      { label: "Portfolio Value", value: `€ ${portfolioValue.toFixed(0)}` },
                      { label: "Total Invested", value: `€ ${totalInvested.toFixed(0)}` },
                      { label: "Profit / Loss", value: `€ ${totalProfit.toFixed(0)}`, color: totalProfit >= 0 ? "#4caf50" : "#e53935" },
                      { label: "ROI", value: `${portfolioROI}%`, color: Number(portfolioROI) >= 0 ? "#4caf50" : "#e53935" },
                    ].map((s, i) => (
                      <div key={i} className="statCard">
                        <small>{s.label}</small>
                        <h2 style={s.color ? { color: s.color } : {}}>{s.value}</h2>
                      </div>
                    ))}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #0f1a2e", color: "#3a5a7a" }}>
                        {["Wine", "Bottles", "Buy Price", "Current", "Invested", "Value", "P/L", "ROI", "6M Trend", "1Y Est.", "5Y Est.", "10Y Est."].map(h => (
                          <th key={h} style={{ textAlign: h === "Wine" ? "left" : "right", padding: "9px 8px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((h, i) => {
                        const est1y = (h.currentValue * 1.08).toFixed(0);
                        const est5y = (h.currentValue * Math.pow(1.08, 5)).toFixed(0);
                        const est10y = (h.currentValue * Math.pow(1.08, 10)).toFixed(0);
                        return (
                          <tr key={h.id} style={{ borderBottom: "1px solid #0a1220", background: i % 2 === 0 ? "transparent" : "rgba(11,18,32,0.5)" }}>
                            <td style={{ padding: "11px 8px", fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif" }}>{h.name}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px" }}>{h.quantity}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px" }}>€ {h.purchasePrice}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px" }}>€ {h.currentPrice}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px" }}>€ {h.invested.toFixed(0)}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px" }}>€ {h.currentValue.toFixed(0)}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: h.profit >= 0 ? "#4caf50" : "#e53935" }}>{h.profit >= 0 ? "+" : ""}€ {h.profit.toFixed(0)}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: h.roi >= 0 ? "#4caf50" : "#e53935" }}>
                              <InfoTooltip tip={`ROI = (Valore attuale − Prezzo pagato) ÷ Prezzo pagato × 100\nP&L: ${h.profit >= 0 ? "+" : ""}€${h.profit.toFixed(0)}`} placement="top">
                                <span style={{ cursor: "help" }}>{h.roi >= 0 ? "+" : ""}{h.roi}%</span>
                              </InfoTooltip>
                            </td>
                            <td style={{ textAlign: "center", padding: "4px 8px", verticalAlign: "middle" }}>
                              <PortfolioSparkline wineId={h.id} purchasePrice={h.purchasePrice} currentPrice={h.currentPrice} />
                            </td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: "#C9A227" }}>€ {est1y}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: "#C9A227" }}>€ {est5y}</td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: "#C9A227" }}>€ {est10y}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ marginTop: 36, marginBottom: 18 }} ref={portfolioChartRef}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, marginBottom: 14, color: "#C9A227" }}>Portfolio Growth</h3>
                    <LineChart data={growthData} width={portfolioChartW || 600} height={280}>
                      <CartesianGrid stroke="#0a1220" />
                      <XAxis dataKey="date" stroke="#3a5a7a" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#3a5a7a" tick={{ fontSize: 10 }} tickFormatter={v => "€" + v} />
                      <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 8 }} formatter={v => ["€" + v, "Portfolio"]} />
                      <Line type="monotone" dataKey="value" stroke="#C9A227" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </div>
                  <p style={{ marginTop: 14, fontSize: 11, color: "#1e3050" }}>* Estimated values based on 8% average annual growth (wine market historical average)</p>

                  {/* ── Diversification breakdown ─────────────────────────── */}
                  <div style={{ marginTop: 36 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, marginBottom: 16, color: "#C9A227" }}>Diversification</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* By type */}
                      <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(31,41,55,0.7)", borderRadius: 14, padding: 18 }}>
                        <p style={{ fontSize: 11, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>By Type</p>
                        {Object.entries(
                          holdings.reduce((acc, h) => {
                            const type = wines.find(w => w.id === h.id)?.type || "Other";
                            acc[type] = (acc[type] || 0) + h.currentValue;
                            return acc;
                          }, {})
                        ).sort(([,a],[,b]) => b - a).map(([type, val]) => {
                          const pct = portfolioValue > 0 ? ((val / portfolioValue) * 100).toFixed(1) : 0;
                          return (
                            <div key={type} style={{ marginBottom: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: "#94a3b8" }}>{type}</span>
                                <span style={{ fontSize: 12, color: "#C9A227", fontWeight: 700 }}>{pct}%</span>
                              </div>
                              <div style={{ height: 4, background: "rgba(30,41,59,0.8)", borderRadius: 2 }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#C9A227,#e0b82d)", borderRadius: 2 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* By position size */}
                      <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(31,41,55,0.7)", borderRadius: 14, padding: 18 }}>
                        <p style={{ fontSize: 11, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700 }}>By Wine</p>
                        {[...holdings].sort((a, b) => b.currentValue - a.currentValue).slice(0, 5).map(h => {
                          const pct = portfolioValue > 0 ? ((h.currentValue / portfolioValue) * 100).toFixed(1) : 0;
                          return (
                            <div key={h.id} style={{ marginBottom: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: "#94a3b8", maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.name}</span>
                                <span style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700 }}>{pct}%</span>
                              </div>
                              <div style={{ height: 4, background: "rgba(30,41,59,0.8)", borderRadius: 2 }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#60a5fa,#38bdf8)", borderRadius: 2 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Portfolio AI ───────────────────────────────────────────────── */}
          {tab === "portfolio" && (
            <section className="ordersPanel">
              {/* ── AI Chat Advisor ────────────────────────────────────────── */}
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>AI Wine Advisor</h2>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>Chatta con il tuo consulente AI — analisi portafoglio, notizie mercato, opportunità.</p>
                <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.7)", borderRadius: 16, overflow: "hidden" }}>
                  <AgentChat holdings={holdings} onAddToPortfolio={handleAddToPortfolio} />
                </div>
              </div>

              {/* ── AI Analysis of existing portfolio ─────────────────────── */}
              {holdings.length > 0 && <AIPortfolioAnalysis holdings={holdings} totalValue={portfolioValue} totalInvested={totalInvested} userId={userEmail} />}

              <h2 style={{ marginTop: holdings.length > 0 ? 36 : 0 }}>AI Portfolio Builder</h2>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 18 }}>Genera un portfolio ottimizzato dall'AI in base al tuo budget, rischio e orizzonte temporale.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="searchInput" placeholder="Budget (€)" style={{ maxWidth: 160 }} />
                <select value={risk} onChange={e => setRisk(e.target.value)} className="searchInput" style={{ maxWidth: 180 }}>
                  <option value="basso">Low Risk</option>
                  <option value="medio">Medium Risk</option>
                  <option value="alto">High Risk</option>
                </select>
                <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="searchInput" placeholder="Years" style={{ maxWidth: 120 }} />
                <button className="btn-primary" style={{ width: "auto", padding: "12px 24px" }} onClick={generatePortfolio}>Generate Portfolio</button>
              </div>
              {portfolio && (
                <>
                  <div className="statsGrid">
                    <div className="statCard"><small>Expected ROI</small><h2>{portfolio.expectedROI}%</h2></div>
                    <div className="statCard"><small>Expected Profit</small><h2>€ {portfolio.expectedProfit}</h2></div>
                    <div className="statCard"><small>Expected Value</small><h2>€ {portfolio.expectedValue}</h2></div>
                  </div>
                  <div style={{ marginTop: 28 }}>
                    {portfolio.allocation.map(item => (
                      <div key={item.wineId} className="wineCard" style={{ marginBottom: 14, flexDirection: "row", alignItems: "center", padding: 18 }}>
                        <div className="wineCard-body" style={{ padding: 0 }}>
                          <h2>{item.wineName}</h2>
                          <p className="wineCard-producer">{item.region}</p>
                          <p style={{ fontSize: 12, color: "#3a5a7a" }}>Signal: <span style={{ color: "#C9A227" }}>{item.signal}</span> · AI Score: {item.aiScore}</p>
                          <p style={{ fontSize: 12, color: "#3a5a7a" }}>Bottles: {item.estimatedBottles} · Allocation: <span style={{ color: "#e2e8f0" }}>€ {item.allocatedAmount}</span></p>
                          <p style={{ fontSize: 12, color: "#3a5a7a" }}>Estimated Return: <span style={{ color: "#4ade80" }}>€ {item.estimatedReturn}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {tab === "b2b" && <DashboardB2B />}

          {/* ── Notifications ─────────────────────────────────────────────── */}
          {tab === "notifications" && (
            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 800, margin: 0 }}>Notifications</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  {Notification.permission !== "granted" && "Notification" in window && (
                    <button
                      onClick={async () => {
                        const perm = await Notification.requestPermission();
                        if (perm === "granted") toast(t("notifications.pushEnabled"), "success");
                      }}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(201,162,39,0.3)", background: "rgba(201,162,39,0.1)", color: "#C9A227", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >🔔 Enable Push</button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.5)", background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer" }}>Mark all read</button>
                  )}
                </div>
              </div>
              {notifications.length === 0 ? (
                <div style={{ color: "#1e3050", fontSize: 13, padding: 24, border: "1px dashed rgba(30,41,59,0.5)", borderRadius: 12, textAlign: "center" }}>
                  No notifications yet. Set a price alert in the Market section.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      style={{ background: n.read ? "rgba(11,18,32,0.8)" : "rgba(12,26,46,0.9)", border: `1px solid ${n.read ? "rgba(31,41,55,0.5)" : "rgba(30,58,95,0.7)"}`, borderRadius: 12, padding: "13px 17px", display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#60a5fa", flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13 }}>{n.message}</div>
                        <div style={{ fontSize: 10, color: "#1e3050", marginTop: 3 }}>{new Date(n.created_at).toLocaleString("it-IT")}</div>
                      </div>
                      {!n.read && (
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`${API}/api/notifications/${n.id}/read`, { method: "PUT" });
                              setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                            } catch {}
                          }}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(30,41,59,0.5)", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer" }}
                        >✓</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          </ErrorBoundary>
        </section>
      </main>

      {modalWine && (
        <ErrorBoundary>
          <WineBottle3DModal wine={modalWine} onClose={() => setModalWine(null)} />
        </ErrorBoundary>
      )}

      {purchaseWine && (
        <PurchaseModal
          wine={purchaseWine}
          onClose={() => setPurchaseWine(null)}
          onImport={() => { loadData(); setPurchaseWine(null); }}
        />
      )}

      {/* ── HelpBot FAQ ─────────────────────────────────────────────────── */}
      <HelpBot
        onAskAI={(msg) => {
          setChatInitMsg(msg);
          setFloatChatOpen(true);
          setFloatUnread(0);
        }}
      />

      {/* ── Floating AI Chat Button ──────────────────────────────────────── */}
      <button
        onClick={() => { setFloatChatOpen(o => !o); setFloatUnread(0); }}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9000,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg,#9b1c4a,#C9A227)",
          border: "none", cursor: "pointer", fontSize: 24,
          boxShadow: "0 4px 24px rgba(201,162,39,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(201,162,39,0.6)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,162,39,0.4)"; }}
        title="AI Wine Advisor"
      >
        {floatChatOpen ? "✕" : "🍷"}
        {floatUnread > 0 && !floatChatOpen && (
          <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: "50%", fontSize: 10, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, border: "2px solid #020617" }}>
            {floatUnread}
          </span>
        )}
      </button>

      {/* ── Floating Chat Overlay ────────────────────────────────────────── */}
      {floatChatOpen && (
        <>
          <div
            onClick={() => setFloatChatOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 8999, background: "transparent" }}
          />
          <div style={{
            position: "fixed", bottom: 96, right: 28, zIndex: 9001,
            width: "min(420px, calc(100vw - 32px))",
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,162,39,0.2)",
            animation: "floatIn 0.2s ease-out",
          }}>
            <AgentChat
              holdings={holdings}
              onAddToPortfolio={handleAddToPortfolio}
              compact={true}
              initialMessage={chatInitMsg}
              onInitialMessageSent={() => setChatInitMsg("")}
            />
          </div>
        </>
      )}

      {/* ── Onboarding Modal ────────────────────────────────────────────── */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} accountType={accountType} />
      )}

      {/* ── Guided Tour ─────────────────────────────────────────────────── */}
      {showTour && (
        <GuidedTour onComplete={() => setShowTour(false)} />
      )}

      {/* ── Investment Calculator ────────────────────────────────────────── */}
      {showCalculator && <InvestmentCalculator onClose={() => setShowCalculator(false)} />}

      {/* ── Cookie Banner GDPR ──────────────────────────────────────────── */}
      <CookieBanner />

      {/* ── PWA Install Banner ──────────────────────────────────────────── */}
      <PWAInstallBanner />

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(30,41,59,0.4)", padding: "20px 24px",
        textAlign: "center", fontSize: 10, color: "#475569",
        lineHeight: 1.8, background: "rgba(2,6,23,0.8)",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 12px", marginBottom: 8, fontSize: 11 }}>
          {[
            { label: "Cellar", href: "/cellar" }, { label: "Journal", href: "/journal" },
            { label: "Goals", href: "/goals" }, { label: "En Primeur", href: "/en-primeur" },
            { label: "Auctions", href: "/auctions" }, { label: "Sentiment", href: "/sentiment" },
            { label: "Referral", href: "/referral" }, { label: "Press", href: "/press" },
            { label: "Transparency", href: "/transparency" },
          ].map(l => <a key={l.href} href={l.href} style={{ color: "#475569", textDecoration: "none" }}>{l.label}</a>)}
        </div>
        <div style={{ marginBottom: 6 }}>
          Dati forniti da:{" "}
          {[
            { n: "Wine-Searcher", u: "https://www.wine-searcher.com" },
            { n: "CellarTracker", u: "https://www.cellartracker.com" },
            { n: "Decanter", u: "https://www.decanter.com" },
            { n: "Liv-ex", u: "https://www.liv-ex.com" },
            { n: "Open-Meteo", u: "https://open-meteo.com" },
            { n: "Wikipedia", u: "https://www.wikipedia.org" },
            { n: "ECB", u: "https://www.ecb.europa.eu" },
          ].map((s, i) => (
            <span key={s.n}>
              {i > 0 && " · "}
              <a href={s.u} target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "none" }}>{s.n} ↗</a>
            </span>
          ))}
        </div>
        VinoInvest fornisce dati e analisi a scopo informativo.{" "}
        <strong style={{ color: "#64748b" }}>Non costituisce consulenza finanziaria.</strong>{" "}
        I prezzi mostrati sono indicativi. Investire nel vino comporta rischi.
        I rendimenti passati non garantiscono rendimenti futuri.{" "}
        <span style={{ color: "#334155" }}>
          © {new Date().getFullYear()} VinoInvest ·{" "}
          <a href="/transparency" style={{ color: "#475569", textDecoration: "none" }}>Trasparenza dati</a>{" · "}
          <a href="mailto:manumila88@gmail.com" style={{ color: "#475569", textDecoration: "none" }}>Contatti</a>
        </span>
      </footer>

      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
      <CurrencyProvider>
        <Routes>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/b2b" element={<B2BPage />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/market-index" element={<MarketIndex />} />
          <Route path="/cellar" element={<WineCellar />} />
          <Route path="/journal" element={<WineJournal />} />
          <Route path="/scan" element={<LabelScannerPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/share/:id" element={<SharePortfolio />} />
          <Route path="/share" element={<SharePortfolio />} />
          <Route path="/en-primeur" element={<EnPrimeur />} />
          <Route path="/auctions" element={<AuctionTracker />} />
          <Route path="/press" element={<PressKit />} />
          <Route path="/sentiment" element={<MarketSentiment />} />
          <Route path="/goals" element={<InvestmentGoals />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/course/:slug" element={<AcademyCourse />} />
          <Route path="/academy/lesson/:lessonId" element={<AcademyLesson />} />
          <Route path="/academy/module/:moduleId" element={<AcademyModule />} />
          <Route path="/verify/:code" element={<AcademyVerify />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<App />} />
        </Routes>
      </CurrencyProvider>
    </ToastProvider>
  </BrowserRouter>
);
