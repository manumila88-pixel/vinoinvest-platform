import React, { useEffect, useState, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import "./i18n";
import { onCLS, onLCP, onINP, onTTFB } from "web-vitals";
import { useTranslation } from "react-i18next";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart } from "recharts";
import PriceHistoryChart from "./components/PriceHistoryChart";
import ErrorBoundary from "./components/ErrorBoundary";
import { init as initErrorReporting } from "./lib/errorReporting";
import { ToastProvider, useToast } from "./components/Toast";
import { fetchWithRetry } from "./lib/fetchWithRetry";
import { authFetch } from "./lib/authFetch";
import LandingPage from "./LandingPage";
import { supabase } from "./lib/supabase";
import WinePriceCompare from "./components/WinePriceCompare";
import LangSelector from "./components/LangSelector";
import WineCard from "./components/WineCard";
import MarketColumnsPanel from "./components/MarketColumnsPanel";
import DashboardCustomizer from "./components/DashboardCustomizer";
import { useUserPrefs } from "./hooks/useUserPrefs";
import OnboardingModal, { isOnboardingCompleted, resetOnboarding } from "./components/OnboardingModal";
import GuidedTour, { isTourCompleted, resetTour } from "./components/GuidedTour";
import InfoTooltip from "./components/InfoTooltip";
import CookieBanner from "./components/CookieBanner";
import DisclaimerBar from "./components/DisclaimerBar";
import CurrencySelector, { CurrencyProvider, usePrice } from "./components/CurrencySelector";
import VintageScore from "./components/VintageScore";
import InvestmentCalculator from "./components/InvestmentCalculator";
const WineBottle3DModal = lazy(() => import("./WineBottle3DModal"));
const AgentChat = lazy(() => import("./components/AgentChat"));
const PurchaseModal = lazy(() => import("./components/PurchaseModal"));
const HelpBot = lazy(() => import("./components/HelpBot"));
const Pricing = lazy(() => import("./pages/Pricing"));
const B2BPage = lazy(() => import("./pages/B2B"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const DashboardB2B = lazy(() => import("./pages/Dashboard"));
const Learn = lazy(() => import("./pages/Learn"));
const MarketIndex = lazy(() => import("./pages/MarketIndex"));
const WineCellar = lazy(() => import("./pages/WineCellar"));
const WineJournal = lazy(() => import("./pages/WineJournal"));
const LabelScannerPage = lazy(() => import("./pages/LabelScanner"));
const ReferralPage = lazy(() => import("./pages/ReferralPage"));
const SharePortfolio = lazy(() => import("./pages/SharePortfolio"));
const EnPrimeur = lazy(() => import("./pages/EnPrimeur"));
const AuctionTracker = lazy(() => import("./pages/AuctionTracker"));
const PressKit = lazy(() => import("./pages/PressKit"));
const MarketSentiment = lazy(() => import("./pages/MarketSentiment"));
const InvestmentGoals = lazy(() => import("./pages/InvestmentGoals"));
const Transparency = lazy(() => import("./pages/Transparency"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const Academy = lazy(() => import("./pages/Academy"));
const AcademyCourse = lazy(() => import("./pages/AcademyCourse"));
const AcademyLesson = lazy(() => import("./pages/AcademyLesson"));
const AcademyVerify = lazy(() => import("./pages/AcademyVerify"));
const AcademyModule = lazy(() => import("./pages/AcademyModule"));
const AcademyTemplates = lazy(() => import("./pages/AcademyTemplates"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminEmailDashboard = lazy(() => import("./pages/AdminEmailDashboard"));
const PrivacySettings = lazy(() => import("./pages/PrivacySettings"));
const Terms = lazy(() => import("./pages/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Cookies = lazy(() => import("./pages/Cookies"));
const AboutPage = lazy(() => import("./pages/About"));
const Regioni = lazy(() => import("./pages/Regioni"));
const Produttori = lazy(() => import("./pages/Produttori"));
const Annate = lazy(() => import("./pages/Annate"));
const MarketProducers = lazy(() => import("./pages/MarketProducers"));
const Methodology = lazy(() => import("./pages/Methodology"));
const Glossary = lazy(() => import("./pages/Glossary"));
const SecurityPage = lazy(() => import("./pages/Security"));
const DataDownload = lazy(() => import("./pages/DataDownload"));
const OrgDashboard = lazy(() => import("./pages/OrgDashboard"));
const ClientDetail = lazy(() => import("./pages/ClientDetail"));
const MarketIntelligence = lazy(() => import("./pages/MarketIntelligence"));
const B2BOnboarding = lazy(() => import("./pages/B2BOnboarding"));
const DataSources = lazy(() => import("./pages/DataSources"));
const B2BGuide = lazy(() => import("./pages/B2BGuide"));
const ComeComprare = lazy(() => import("./pages/ComeComprare"));
const WineCompare = lazy(() => import("./pages/WineCompare"));
const WineryDashboard = lazy(() => import("./pages/WineryDashboard"));
const WineryProfile = lazy(() => import("./pages/WineryProfile"));
const VintageStory = lazy(() => import("./pages/VintageStory"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
import ThemeToggle from "./components/ThemeToggle";
import CommandPalette from "./components/CommandPalette";
import VoiceInterface from "./components/VoiceInterface";
import MarketFilters, { DEFAULT_FILTERS } from "./components/MarketFilters";
const WinePyramid = lazy(() => import("./components/WinePyramid"));
const PortfolioDonut = lazy(() => import("./components/PortfolioDonut"));
const PlatformGuide = lazy(() => import("./pages/PlatformGuide"));
import ExitIntentPopup from "./components/ExitIntentPopup";
import ProactiveBriefing from "./components/ProactiveBriefing";
import { getSavedTheme, applyTheme } from "./lib/theme";
import { API, ADMIN_EMAIL as ADMIN_EMAIL_CONST } from "./lib/constants";
import { initAnalytics, track, identifyUser, resetUser } from "./lib/analytics";
import "./styles/tokens.css";
import "./styles/utilities.css";
import "./style.css";

// ── Wine type inference from name/producer ───────────────────────────────────
function deriveWineType(wine) {
  if (wine?.type && wine.type !== "Other") return wine.type;
  const name = (wine?.name || "").toLowerCase();
  const producer = (wine?.producer || "").toLowerCase();
  const combined = `${name} ${producer}`;
  if (/champagne|cava|prosecco|crémant|spumante|franciacorta|sekt|sparkling/.test(combined)) return "Sparkling";
  if (/port|porto|madeira|sherry|marsala|vin doux|banyuls|passito|amarone/.test(combined)) return "Fortified";
  if (/sauternes|tokaji|riesling|gewürz|auslese|trockenbeer|ice wine/.test(combined) && /sweet|dessert|spätlese/.test(combined)) return "Dessert";
  if (/blanc|blanco|bianco|white|chardonnay|sauvignon|pinot gris|viognier|riesling|soave|chablis|meursault|pouilly/.test(combined)) return "White";
  if (/rosé|rosado|rosato/.test(combined)) return "Rosé";
  if (/barolo|barbaresco|brunello|amarone|chianti|bordeaux|burgundy|pomerol|pauillac|saint-émilion|rioja|priorat|malbec|pinot noir|syrah|shiraz|cabernet|merlot|sangiovese|nebbiolo|tempranillo|rouge|rosso|tinto|red/.test(combined)) return "Red";
  return "Red"; // default for fine wine
}

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

  const signalColor = { "Strong Buy": "var(--vi-positive)", "Buy": "#86efac", "Hold": "var(--vi-accent)", "Reduce": "#fb923c", "Sell": "var(--vi-negative)" };

  return (
    <div style={{ marginBottom: 32, background: "var(--vi-surface)", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius-lg)", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: 18, fontWeight: 700, margin: 0 }}>AI Portfolio Analysis</h3>
          <p style={{ fontSize: 12, color: "#3a5a7a", marginTop: 3 }}>Claude AI analysis based on your real positions</p>
        </div>
        <button className="btn-primary" style={{ width: "auto", padding: "9px 18px", fontSize: 12 }} onClick={runAnalysis} disabled={loading}>
          {loading ? "Analyzing..." : analysis ? "Refresh" : "Analyze Portfolio"}
        </button>
      </div>

      {!analysis && !loading && (
        <div style={{ fontSize: 13, color: "#3a5a7a", textAlign: "center", padding: 16, border: "1px dashed rgba(30,41,59,0.5)", borderRadius: 10 }}>
          Click "Analyze Portfolio" to get personalized AI recommendations on {holdings.length} wines.
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#3a5a7a", padding: 16 }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #3a5a7a", borderTopColor: "var(--vi-accent)", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
          AI is analyzing your portfolio...
        </div>
      )}

      {analysis && (
        <div>
          {/* Summary row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Segnale", value: analysis.overallSignal, color: signalColor[analysis.overallSignal] || "var(--vi-accent)" },
              { label: "Risk Score", value: `${analysis.riskScore}/10`, color: analysis.riskScore > 6 ? "var(--vi-negative)" : "var(--vi-positive)" },
              { label: "Diversificazione", value: `${analysis.diversificationScore}/10`, color: "#60a5fa" },
              { label: "Outlook", value: analysis.marketOutlook, color: analysis.marketOutlook === "Bullish" ? "var(--vi-positive)" : analysis.marketOutlook === "Bearish" ? "var(--vi-negative)" : "var(--vi-accent)" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--vi-surface)", borderRadius: "var(--vi-radius-md)", padding: "12px 14px", border: "1px solid var(--vi-border)" }}>
                <div style={{ fontSize: 10, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Summary text */}
          <p style={{ fontSize: 13, color: "var(--vi-text-dim)", marginBottom: 16, lineHeight: 1.65 }}>{analysis.summary}</p>

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#3a5a7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Raccomandazioni</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {analysis.recommendations.slice(0, 5).map(r => (
                  <div key={r.wineId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--vi-surface)", borderRadius: "var(--vi-radius-sm)", border: "1px solid var(--vi-border)" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--vi-radius-sm)", background: r.action === "Sell" ? "rgba(69,10,10,0.6)" : r.action === "Buy More" ? "rgba(5,46,22,0.6)" : "rgba(12,26,46,0.6)", color: r.action === "Sell" ? "var(--vi-negative)" : r.action === "Buy More" ? "var(--vi-positive)" : "var(--vi-accent)", whiteSpace: "nowrap" }}>{r.action}</span>
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
              <p style={{ fontSize: 11, color: "var(--vi-negative)", fontWeight: 700, marginBottom: 6 }}>Rischi identificati</p>
              {analysis.concerns.map((c, i) => <p key={i} style={{ fontSize: 12, color: "var(--vi-text-dim)" }}>• {c}</p>)}
            </div>
          )}

          {analysis.fallback && <p style={{ fontSize: 10, color: "#1e3050", marginTop: 10 }}>{t('analysis.algorithmicNote')}</p>}
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

  const color = currentPrice >= purchasePrice ? "var(--vi-positive)" : "var(--vi-negative)";
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
      background: "var(--vi-bg-elev)", border: "1px solid rgba(201,162,39,0.4)", borderRadius: "var(--vi-radius-md)",
      padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      maxWidth: 400, margin: "0 auto",
    }}>
      <span style={{ fontSize: 28 }}>📱</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>Install VinoInvest</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>Add to home screen for quick access</div>
      </div>
      <button onClick={async () => { deferredPrompt?.prompt(); setVisible(false); }} style={{ background: "var(--vi-accent)", color: "#020617", border: "none", borderRadius: "var(--vi-radius-sm)", padding: "7px 14px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Install</button>
      <button onClick={() => setVisible(false)} aria-label="Dismiss" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, padding: 0 }}>×</button>
    </div>
  );
}

function PasswordRecoveryModal({ onClose }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError("Le password non corrispondono."); return; }
    if (password.length < 8) { setError("La password deve avere almeno 8 caratteri."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setDone(true);
    setTimeout(() => onClose(), 2000);
  }

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#111827", borderRadius: 20, width: "100%", maxWidth: 380, border: "1px solid rgba(201,162,39,0.25)", padding: "28px 28px 32px", fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#C9A227", marginBottom: 8 }}>VinoInvest</div>
        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#e2e8f0" }}>Password aggiornata!</div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Reindirizzamento in corso...</div>
          </div>
        ) : (
          <>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#e2e8f0", marginBottom: 4 }}>Imposta nuova password</div>
            <div style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Scegli una password sicura di almeno 8 caratteri.</div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="password" placeholder="Nuova password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none" }} />
              <input type="password" placeholder="Conferma password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none" }} />
              {error && <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid #f87171", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#f87171" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ background: "#C9A227", border: "none", borderRadius: 12, padding: "12px", fontWeight: 800, color: "#0b1220", cursor: loading ? "default" : "pointer", fontSize: 15, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Salvataggio..." : "Salva nuova password →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function NextStepWidget({ watchlist, orders, portfolio, onGoMarket, onGoPortfolio, navigate }) {
  const GOLD = "#C9A227";
  const hasWatchlist = watchlist && watchlist.length > 0;
  const hasOrders = orders && orders.length > 0;
  const hasPortfolio = portfolio && portfolio.length > 0;

  let step = null;
  if (!hasWatchlist) {
    step = {
      icon: "🔍",
      title: "Inizia con la watchlist",
      desc: "Aggiungi vini alla tua watchlist per seguire i prezzi e ricevere alert.",
      cta: "Esplora il mercato →",
      action: onGoMarket,
    };
  } else if (!hasOrders && !hasPortfolio) {
    step = {
      icon: "💰",
      title: "Fai il tuo primo investimento",
      desc: `Hai ${watchlist.length} vini in watchlist. Inizia a investire per costruire il tuo portfolio.`,
      cta: "Vai al mercato →",
      action: onGoMarket,
    };
  } else if (hasPortfolio || hasOrders) {
    const progressKey = "vino_academy_progress";
    const progress = (() => { try { return JSON.parse(localStorage.getItem(progressKey) || "{}"); } catch { return {}; } })();
    const done = Object.keys(progress).length;
    if (done === 0) {
      step = {
        icon: "🎓",
        title: "Impara a investire nel vino",
        desc: "Hai già un portfolio. Ora approfondisci con l'Academy per prendere decisioni migliori.",
        cta: "Vai all'Academy →",
        action: () => navigate("/academy"),
      };
    }
  }

  if (!step) return null;

  return (
    <div style={{ margin: "16px 0 20px", background: `linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.03) 100%)`, border: `1px solid rgba(201,162,39,0.22)`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 28 }}>{step.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 3 }}>{step.title}</div>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{step.desc}</div>
      </div>
      <button onClick={step.action} style={{ flexShrink: 0, background: GOLD, border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 12, fontFamily: "inherit", whiteSpace: "nowrap" }}>
        {step.cta}
      </button>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const ADMIN_EMAIL = ADMIN_EMAIL_CONST;
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const isAdmin = userEmail === ADMIN_EMAIL;
  const [accountType, setAccountType] = useState("b2c");

  // User personalization preferences (columns, section order, notes, saved filters)
  const {
    columns: userColumns,
    toggleColumn,
    sections: userSections,
    toggleSection,
    moveSectionUp,
    moveSectionDown,
    notes: wineNotes,
    setNote: setWineNote,
    savedFilters,
    saveFilter,
    deleteFilter,
    resetAllPrefs,
  } = useUserPrefs();
  const [institutionalView, setInstitutionalView] = useState(false);
  const [viewMode, setViewMode] = useState("b2c"); // 'b2c' | 'b2b' | 'cantina'
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [chatInitMsg, setChatInitMsg] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [modalWine, setModalWine] = useState(null);
  const [purchaseWine, setPurchaseWine] = useState(null);
  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vino_watchlist") || "[]"); } catch { return []; }
  });
  const [recommendedWines, setRecommendedWines] = useState([]);
  const [recommendedBasedOn, setRecommendedBasedOn] = useState([]);
  const [investorWines, setInvestorWines] = useState([]);
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
  const mAbortRef = useRef(null);
  const [marketFilters, setMarketFilters] = useState(DEFAULT_FILTERS);
  const mFiltersRef = useRef(DEFAULT_FILTERS);
  const [marketTotal, setMarketTotal] = useState(null);
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
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

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
  const [benchmarkData, setBenchmarkData] = useState(null);

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
    let retryInterval = null;
    setBackendWaking(true);

    function ping() {
      fetch(`${API}/api/health`, { signal: AbortSignal.timeout(12000) })
        .then(() => {
          setBackendWaking(false);
          if (retryInterval) { clearInterval(retryInterval); retryInterval = null; }
        })
        .catch(() => {});
    }

    ping();
    retryInterval = setInterval(ping, 10000);

    return () => { if (retryInterval) clearInterval(retryInterval); };
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
        const B2B_ACCOUNT_TYPES = ["b2b", "wealth_manager", "cantina", "family_office"];
        const B2B_PROF_TYPES = ["b2b", "wealth_manager", "family_office"];
        if (type === "cantina") setViewMode("cantina");
        else if (B2B_PROF_TYPES.includes(type)) setViewMode("b2b");
        else setViewMode("b2c");
        localStorage.setItem("vino_user", JSON.stringify({ email: session.user.email, account_type: type }));
        localStorage.setItem("vino_user_id", session.user.id);
        if (!isOnboardingCompleted(type)) setTimeout(() => setShowOnboarding(true), 600);
        // Load persisted watchlist from backend, update localStorage as source of truth
        fetch(`${API}/api/watchlist/${session.user.id}`)
          .then(r => r.ok ? r.json() : [])
          .then(ids => {
            if (Array.isArray(ids) && ids.length) {
              setWatchlist(ids);
              try { localStorage.setItem("vino_watchlist", JSON.stringify(ids)); } catch {}
            }
          })
          .catch(() => {});
        identifyUser(session.user.id, { email: session.user.email, account_type: type });
        if (event === "SIGNED_IN") track("user_login", { method: "email" });
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUserEmail("");
        setAccountType("b2c");
        setWatchlist([]);
        resetUser();
        try { localStorage.removeItem("vino_watchlist"); } catch {}
        localStorage.removeItem("vino_user");
        localStorage.removeItem("vino_user_id");
      }
      if (event === "PASSWORD_RECOVERY") {
        setAuthChecked(true);
        setShowPasswordRecovery(true);
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

  async function loadMarketWines(search, page, append, filtersOverride) {
    if (mLoadingRef.current && !append) return;
    if (mAbortRef.current) { mAbortRef.current.abort(); }
    mAbortRef.current = new AbortController();
    mLoadingRef.current = true;
    setMarketLoading(true);
    try {
      const f = filtersOverride !== undefined ? filtersOverride : mFiltersRef.current;
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      const isB2BUser = accountType && ["b2b", "wealth_manager", "cantina", "family_office"].includes(accountType);
      const seg = isB2BUser ? "b2b" : "";
      if (seg) params.set("segment", seg);
      if (institutionalView && isB2BUser) params.set("institutional", "true");
      if (f.type) params.set("type", f.type);
      const effectivePriceMin = viewMode === "b2b" ? Math.max(f.priceMin, 200) : f.priceMin;
      if (effectivePriceMin > 0) params.set("priceMin", effectivePriceMin);
      if (f.priceMax < 10000) params.set("priceMax", f.priceMax);
      if (f.scoreMin > 0) params.set("scoreMin", f.scoreMin);
      if (f.scoreMax < 100) params.set("scoreMax", f.scoreMax);
      if (f.vintageMin > 1990) params.set("vintageMin", f.vintageMin);
      if (f.vintageMax < 2024) params.set("vintageMax", f.vintageMax);
      if (f.risk) params.set("risk", f.risk);
      if (f.region) params.set("region", f.region);
      if (f.grape) params.set("grape", f.grape);
      const res = await fetch(`${API}/api/wines?${params}`, { signal: mAbortRef.current.signal });
      const data = await res.json();
      setMarketWines(prev => append ? [...prev, ...data.results] : data.results);
      setMarketPage(data.page);
      mPageRef.current = data.page;
      setMarketHasMore(data.hasMore);
      mHasMoreRef.current = data.hasMore;
      if (data.total != null) setMarketTotal(data.total);
    } catch (e) { if (e.name !== "AbortError") console.error(e); }
    finally { mLoadingRef.current = false; setMarketLoading(false); }
  }

  function handleMarketFiltersChange(newFilters) {
    setMarketFilters(newFilters);
    mFiltersRef.current = newFilters;
    mHasMoreRef.current = true;
    loadMarketWines(mSearchRef.current, 1, false, newFilters);
  }

  function handleMarketFiltersReset() {
    setMarketFilters(DEFAULT_FILTERS);
    mFiltersRef.current = DEFAULT_FILTERS;
    mHasMoreRef.current = true;
    loadMarketWines(mSearchRef.current, 1, false, DEFAULT_FILTERS);
  }

  function handleMarketSearch(value) {
    setMarketSearch(value);
    mSearchRef.current = value;
    clearTimeout(mDebounceRef.current);
    mDebounceRef.current = setTimeout(() => {
      mHasMoreRef.current = true;
      loadMarketWines(value, 1, false);
    }, 300);
  }

  useEffect(() => {
    if (tab === "market" && marketWines.length === 0 && !mLoadingRef.current) {
      loadMarketWines("", 1, false);
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== "market" || !userEmail) return;
    fetch(`${API}/api/wines/recommended?userId=${encodeURIComponent(localStorage.getItem("vino_user_id") || userEmail)}&limit=6`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.wines?.length) {
          setRecommendedWines(d.wines);
          setRecommendedBasedOn(d.basedOn || []);
        }
      }).catch(() => {});
  }, [tab, userEmail, watchlist.length]);

  useEffect(() => {
    if (tab !== "market") return;
    fetch(`${API}/api/wines?limit=6&scoreMin=85&sort=score`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.results?.length) setInvestorWines(d.results); })
      .catch(() => {});
  }, [tab]);

  // Re-load market wines when account type resolves from Supabase (fixes B2B filter race condition)
  useEffect(() => {
    const B2B_TYPES = ["b2b", "wealth_manager", "cantina", "family_office"];
    if (tab === "market" && B2B_TYPES.includes(accountType)) {
      mHasMoreRef.current = true;
      loadMarketWines(mSearchRef.current, 1, false);
    }
  }, [accountType]);

  useEffect(() => {
    if (tab === "market") {
      mHasMoreRef.current = true;
      loadMarketWines(mSearchRef.current, 1, false);
    }
  }, [institutionalView]);

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

  useEffect(() => {
    if (tab === "myportfolio" && !benchmarkData) {
      fetch(`${API}/api/risk/benchmark`)
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setBenchmarkData(d); })
        .catch(() => {});
    }
  }, [tab]);

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
        toast("Error adding position", "error");
      }
    } catch {
      toast("Network error", "error");
    }
  }

  const toggleWatchlist = useCallback((wine) => {
    const wineId = wine.id;
    const userId = localStorage.getItem("vino_user_id");
    if (watchlist.includes(wineId)) {
      const next = watchlist.filter(id => id !== wineId);
      setWatchlist(next);
      try { localStorage.setItem("vino_watchlist", JSON.stringify(next)); } catch {}
      setSelectedWine(null);
      setChartData([]);
      if (userId) fetch(`${API}/api/watchlist/${userId}/${wineId}`, { method: "DELETE" }).catch(() => {});
    } else {
      const next = [...watchlist, wineId];
      setWatchlist(next);
      try { localStorage.setItem("vino_watchlist", JSON.stringify(next)); } catch {}
      setSelectedWine(wine);
      loadChart(wineId, wine.currentPrice);
      track("watchlist_add", { wine_id: wineId, wine_name: wine.name });
      if (userId) fetch(`${API}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, wineId, wineName: wine.name }),
      }).catch(() => {});
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
    track("portfolio_add_intent", { wine_id: wine.id, wine_name: wine.name, price: wine.currentPrice });
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
      <div style={{ minHeight: "100vh", background: "var(--vi-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 48, height: 48, border: "3px solid var(--vi-accent-glow)", borderTopColor: "var(--vi-accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: "var(--vi-accent)", fontFamily: "var(--vi-font-sans)", fontSize: 14, letterSpacing: "0.05em" }}>VinoInvest</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
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
        {showPasswordRecovery && <PasswordRecoveryModal onClose={() => setShowPasswordRecovery(false)} />}
      </>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabMeta = {
    dashboard: { title: "Portfolio Dashboard | VinoInvest", desc: "Monitor your fine wine portfolio with AI Score, price charts and real-time alerts." },
    market: { title: "Investment Wine Market | VinoInvest", desc: "Explore 50,000+ investment wines with Liv-ex historical prices, AI Score and advanced filters." },
    blog: { title: "Wine Investment Blog | VinoInvest", desc: "Guides, analysis and strategies for investing in fine wine. Updated weekly." },
    analysis: { title: "AI Portfolio Analysis | VinoInvest", desc: "Intelligent analysis of your wine portfolio with personalized AI recommendations." },
    myportfolio: { title: "Your Wine Portfolio | VinoInvest", desc: "Manage and value your cellar with real-time prices and historical performance." },
    portfolio: { title: "Your Wine Portfolio | VinoInvest", desc: "Manage and value your cellar with real-time prices and historical performance." },
    b2b: { title: "B2B Solutions for Wealth Managers | VinoInvest", desc: "Professional dashboard for wealth managers, family offices and financial advisors." },
  };
  const currentMeta = modalWine
    ? { title: `${modalWine.name} ${modalWine.vintage || ""} - Prezzo ${modalWine.current_price || modalWine.price || ""} EUR | VinoInvest`.replace(/\s+/g, " ").trim(), desc: `${modalWine.name}: AI Score ${modalWine.investment_score || modalWine.aiScore || "N/A"}/100. Storico prezzi, dove comprare. Produttore: ${modalWine.producer || ""}.` }
    : (tabMeta[tab] || { title: "VinoInvest — Piattaforma Intelligente per Investire in Vino", desc: "AI Score su 50.000+ vini. Portfolio tracker, prezzi storici Liv-ex, Academy 20 moduli." });

  return (
    <div className="app">
      <Helmet>
        <title>{currentMeta.title}</title>
        <meta name="description" content={currentMeta.desc} />
        <meta property="og:title" content={currentMeta.title} />
        <meta property="og:description" content={currentMeta.desc} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VinoInvest" />
        <meta property="og:image" content="https://vinoinvest-platform.vercel.app/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentMeta.title} />
        <meta name="twitter:description" content={currentMeta.desc} />
        <meta name="twitter:image" content="https://vinoinvest-platform.vercel.app/og-image.jpg" />
        <link rel="canonical" href={`https://vinoinvest-platform.vercel.app${tab !== "dashboard" ? `/${tab}` : ""}`} />
      </Helmet>
      {/* ── Offline banner ───────────────────────────────────────────────── */}
      {backendWaking && (
        <div style={{ background: "#1c1400", color: "var(--vi-accent)", padding: "8px 20px", fontSize: 12, fontWeight: 600, textAlign: "center", zIndex: 999, borderBottom: "1px solid rgba(201,162,39,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid var(--vi-accent)", borderTopColor: "transparent", display: "inline-block", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
          ⏳ {t("auth.serverStarting")}
        </div>
      )}
      {isOffline && (
        <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "8px 20px", fontSize: 13, fontWeight: 600, textAlign: "center", zIndex: 999 }}>
          {t("auth.offline")}
        </div>
      )}
      {/* ── Glassmorphism Header ─────────────────────────────────────────── */}
      <header className="header" style={
        viewMode === "cantina" ? { borderBottom: "1px solid rgba(217,119,6,0.25)", background: "rgba(2,6,23,0.97)" } :
        viewMode === "b2b"     ? { borderBottom: "1px solid rgba(96,165,250,0.25)",  background: "rgba(2,6,23,0.97)" } : {}
      }>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">☰</button>
          {viewMode === "b2b" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="logo" style={{ color: "#60a5fa" }}>🍷 Vino<span style={{ color: "#60a5fa" }}>Invest</span></div>
              <span style={{ fontSize: 10, color: "#60a5fa", border: "1px solid rgba(96,165,250,0.5)", borderRadius: 4, padding: "1px 7px", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", background: "rgba(96,165,250,0.1)" }}>{t("b2b.badge")}</span>
              <span style={{ fontSize: 11, color: "#3a5a7a", fontWeight: 600 }}>{t("b2b.headerTitle")}</span>
            </div>
          ) : viewMode === "cantina" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="logo" style={{ color: "#d97706" }}>🍷 Vino<span style={{ color: "#d97706" }}>Invest</span></div>
              <span style={{ fontSize: 10, color: "#d97706", border: "1px solid rgba(217,119,6,0.5)", borderRadius: 4, padding: "1px 7px", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", background: "rgba(217,119,6,0.1)" }}>CANTINA</span>
            </div>
          ) : (
            <div className="logo">🍷 Vino<span>Invest</span></div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {viewMode === "b2b" ? (
            <div className="badge" style={{ background: "rgba(96,165,250,0.1)", borderColor: "rgba(96,165,250,0.3)", color: "#60a5fa" }}>professional</div>
          ) : viewMode === "cantina" ? (
            <div className="badge" style={{ background: "rgba(217,119,6,0.1)", borderColor: "rgba(217,119,6,0.3)", color: "#d97706" }}>produttore</div>
          ) : (
            <div className="badge">global wine intelligence</div>
          )}
          {/* Admin view toggle (3-way cycle): b2c → b2b → cantina → b2c */}
          {isAdmin && (
            <button
              onClick={() => setViewMode(m => m === "b2c" ? "b2b" : m === "b2b" ? "cantina" : "b2c")}
              style={{ padding: "5px 10px", border: `1px solid ${viewMode === "b2b" ? "rgba(96,165,250,0.4)" : viewMode === "cantina" ? "rgba(217,119,6,0.4)" : "rgba(201,162,39,0.3)"}`, borderRadius: "var(--vi-radius-sm)", background: "transparent", color: viewMode === "b2b" ? "#60a5fa" : viewMode === "cantina" ? "#d97706" : "var(--vi-accent)", fontSize: 10, cursor: "pointer", fontFamily: "var(--vi-font-sans)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}
            >{viewMode === "b2c" ? "⇄ B2B" : viewMode === "b2b" ? "⇄ Cantina" : "↩ B2C"}</button>
          )}
          <button
            onClick={() => { resetOnboarding(); setShowOnboarding(true); }}
            title="Riapri guida" aria-label="Riapri guida introduttiva"
            style={{ padding: "5px 10px", border: "1px solid rgba(201,162,39,0.25)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "var(--vi-font-sans)", transition: `all var(--vi-dur) var(--vi-ease)` }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--vi-accent)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
          >📖 Guida</button>
          <button
            onClick={() => { resetTour(); setShowTour(true); }}
            title="Fai il tour guidato" aria-label="Inizia tour guidato della piattaforma"
            style={{ padding: "5px 10px", border: "1px solid rgba(30,58,95,0.5)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "var(--vi-font-sans)", transition: `all var(--vi-dur) var(--vi-ease)` }}
            onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(30,58,95,0.5)"; }}
          >🗺 Tour</button>
          <button
            onClick={() => setShowCalculator(true)}
            title="Investment Calculator" aria-label="Apri calcolatore investimento"
            style={{ padding: "5px 10px", border: "1px solid rgba(96,165,250,0.25)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "var(--vi-font-sans)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)"; }}
          >🧮 {t('nav.calculator')}</button>
          <button
            onClick={() => navigate("/academy")}
            title="Wine Investment Academy" aria-label="Vai all'Academy vino"
            style={{ padding: "5px 10px", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "var(--vi-font-sans)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--vi-positive)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)"; }}
          >🎓 {t('nav.academy')}</button>
          <button
            onClick={() => navigate("/market-index")}
            title="VinoInvest Index" aria-label="Vai al VinoInvest Market Index"
            style={{ padding: "5px 10px", border: "1px solid rgba(201,162,39,0.25)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#3a5a7a", fontSize: 11, cursor: "pointer", fontFamily: "var(--vi-font-sans)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--vi-accent)"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#3a5a7a"; e.currentTarget.style.borderColor = "rgba(201,162,39,0.25)"; }}
          >📊 {t('nav.index')}</button>
          <a href="/scan" title="Scan wine label" aria-label="Scansiona etichetta vino" style={{ padding: "6px 10px", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#4a6a8a", fontSize: 11, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", fontWeight: 600 }}>Scan</a>
          <CurrencySelector />
          <ThemeToggle />
          <LangSelector />
          {userEmail && <span style={{ fontSize: 12, color: "#3a5a7a" }}>{userEmail}</span>}
          {isAdmin && (
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <a href="/admin" style={{ fontSize: 10, color: "var(--vi-accent)", border: "1px solid rgba(201,162,39,0.5)", borderRadius: 4, padding: "2px 8px", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.08em", textDecoration: "none", background: "rgba(201,162,39,0.08)" }}>
                ADMIN
              </a>
              <span style={{ fontSize: 9, color: "#475569", fontStyle: "italic" }}>(full access)</span>
            </span>
          )}
          {accountType && !isAdmin && (() => {
            const B2B_TYPES = ["b2b", "wealth_manager", "cantina", "family_office"];
            const isB2BAccount = B2B_TYPES.includes(accountType);
            const isEnterpriseAccount = accountType === "enterprise";
            if (isEnterpriseAccount) return (
              <span style={{ fontSize: 10, color: "#a78bfa", border: "1px solid rgba(167,139,250,0.6)", borderRadius: 4, padding: "2px 9px", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", background: "rgba(167,139,250,0.12)", boxShadow: "0 0 8px rgba(167,139,250,0.2)" }}>
                ENTERPRISE
              </span>
            );
            if (isB2BAccount) return (
              <span style={{ fontSize: 10, color: "#60a5fa", border: "1px solid rgba(96,165,250,0.6)", borderRadius: 4, padding: "2px 9px", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.1em", background: "rgba(96,165,250,0.12)", boxShadow: "0 0 8px rgba(96,165,250,0.2)" }}>
                B2B
              </span>
            );
            return null;
          })()}
          <div style={{ position: "relative" }}>
            <button
              aria-label={`Notifiche${unreadCount > 0 ? ` (${unreadCount} non lette)` : ""}`}
              onClick={() => setShowNotifDropdown(o => !o)}
              style={{ padding: "6px 10px", border: "1px solid rgba(30,41,59,0.7)", borderRadius: 8, background: "transparent", color: "#4a6a8a", fontSize: 15, cursor: "pointer", position: "relative", transition: "border-color 0.2s" }}
            >🔔
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", borderRadius: "50%", fontSize: 9, width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifDropdown && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowNotifDropdown(false)} />
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 300, width: 320, maxHeight: 400, overflowY: "auto", background: "var(--vi-bg)", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius-md)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", padding: "12px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 10px", borderBottom: "1px solid var(--vi-border)" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--vi-text)" }}>{t("notifications.title")}</span>
                    {unreadCount > 0 && (
                      <button onClick={() => { markAllRead(); }} style={{ background: "none", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", padding: 0 }}>{t("notifications.markAllRead")}</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "24px 16px", textAlign: "center", color: "#3a5a7a", fontSize: 13 }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>🔕</div>
                      {t('notifications.noNotifications')}
                    </div>
                  ) : (
                    notifications.slice(0, 8).map(n => (
                      <div
                        key={n.id}
                        style={{ padding: "10px 16px", display: "flex", gap: 10, alignItems: "flex-start", background: n.read ? "transparent" : "rgba(12,26,46,0.6)", borderBottom: "1px solid var(--vi-border)", cursor: "pointer" }}
                        onClick={async () => {
                          if (!n.read) {
                            try { await fetch(`${API}/api/notifications/${n.id}/read`, { method: "PUT" }); } catch {}
                            setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                          }
                        }}
                      >
                        {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", flexShrink: 0, marginTop: 4 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: "var(--vi-text)", lineHeight: 1.4 }}>{n.message}</div>
                          <div style={{ fontSize: 10, color: "#3a5a7a", marginTop: 3 }}>{new Date(n.created_at).toLocaleString("it-IT")}</div>
                        </div>
                      </div>
                    ))
                  )}
                  <div style={{ padding: "8px 16px 4px" }}>
                    <button onClick={() => { setShowNotifDropdown(false); setTab("notifications"); }} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 12, cursor: "pointer", padding: 0 }}>{t("notifications.title")} →</button>
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            style={{ padding: "6px 14px", border: "1px solid var(--vi-border)", borderRadius: "var(--vi-radius-sm)", background: "transparent", color: "#4a6a8a", fontSize: 12, cursor: "pointer", fontFamily: "var(--vi-font-sans)", transition: `border-color var(--vi-dur) var(--vi-ease), color var(--vi-dur) var(--vi-ease)` }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,162,39,0.4)"; e.currentTarget.style.color = "var(--vi-accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--vi-border)"; e.currentTarget.style.color = "#4a6a8a"; }}
          >{t("auth.signOut")}</button>
        </div>
      </header>

      <main className="main" id="main-content">
        {/* ── Mobile sidebar overlay ───────────────────────────────────────── */}
        <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} style={(() => {
          if (viewMode === "cantina") return { borderTop: "3px solid rgba(217,119,6,0.7)" };
          if (viewMode === "b2b") return { borderTop: "3px solid rgba(96,165,250,0.7)" };
          if (isAdmin) return { borderTop: "3px solid rgba(201,162,39,0.7)" };
          if (accountType === "enterprise") return { borderTop: "3px solid rgba(167,139,250,0.7)" };
          return {};
        })()}>

          {/* ── B2C navigation ────────────────────────────────────── */}
          {viewMode === "b2c" && (() => {
            const secVis = (id) => { const s = userSections.find(s => s.id === id); return !s || s.visible; };
            const B2C_NAV = {
              dashboard:   () => secVis("dashboard")   && <button key="dashboard"   className={tab === "dashboard"   ? "active" : ""} onClick={() => { setTab("dashboard");   setSidebarOpen(false); }}>🏠 Dashboard</button>,
              market:      () => secVis("market")      && <button key="market"      className={tab === "market"      ? "active" : ""} onClick={() => { setTab("market");      setSidebarOpen(false); }}>🔍 {t("nav.market")}</button>,
              myportfolio: () => secVis("myportfolio") && <button key="myportfolio" className={tab === "myportfolio" ? "active" : ""} onClick={() => { setTab("myportfolio"); setSidebarOpen(false); }}>📦 Watchlist &amp; Portfolio</button>,
              portfolio:   () => secVis("portfolio")   && <button key="portfolio"   className={tab === "portfolio"   ? "active" : ""} onClick={() => { setTab("portfolio");   setSidebarOpen(false); }}>🤖 {t("nav.portfolioAI")}</button>,
              academy:     () => secVis("academy")     && <button key="academy"     onClick={() => { navigate("/academy"); setSidebarOpen(false); }}>🎓 Academy</button>,
              cellar:      () => secVis("cellar")      && <button key="cellar"      onClick={() => { navigate("/cellar"); setSidebarOpen(false); }}>🍾 Cantina</button>,
              journal:     () => secVis("journal")     && <button key="journal"     onClick={() => { navigate("/journal"); setSidebarOpen(false); }}>📓 Diario</button>,
              goals:       () => secVis("goals")       && <button key="goals"       onClick={() => { navigate("/goals"); setSidebarOpen(false); }}>🎯 Obiettivi</button>,
            };
            return <>
              {userSections.map(s => B2C_NAV[s.id] ? B2C_NAV[s.id]() : null)}
              <button className={tab === "analysis" ? "active" : ""} onClick={() => { setTab("analysis"); setSidebarOpen(false); }}>📈 {t("nav.analysis")}</button>
              <button className={tab === "news"     ? "active" : ""} onClick={() => { setTab("news");     setSidebarOpen(false); }}>📰 {t("nav.news")}</button>
              <button className={tab === "blog"     ? "active" : ""} onClick={() => { setTab("blog");     setSidebarOpen(false); }}>📖 {t("nav.blog")}</button>
              {["b2b", "wealth_manager", "cantina", "family_office"].includes(accountType) && (
                <button className={tab === "b2b" ? "active" : ""} onClick={() => { setTab("b2b"); setSidebarOpen(false); }}>{t("nav.b2b")}</button>
              )}
              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <DashboardCustomizer
                  sections={userSections}
                  onToggle={toggleSection}
                  onMoveUp={moveSectionUp}
                  onMoveDown={moveSectionDown}
                  onReset={resetAllPrefs}
                />
              </div>
            </>;
          })()}

          {/* ── B2B navigation ────────────────────────────────────── */}
          {viewMode === "b2b" && <>
            <button className={tab === "dashboard"   ? "active" : ""} onClick={() => { setTab("dashboard");   setSidebarOpen(false); }} style={{ color: "#60a5fa" }}>🏦 Dashboard PRO</button>
            <div style={{ height: 1, background: "rgba(96,165,250,0.12)", margin: "4px 0" }} />
            <button onClick={() => { navigate("/market-intelligence"); setSidebarOpen(false); }} style={{ color: "#60a5fa" }}>📊 {t("b2b.marketIntelligence")}</button>
            <button onClick={() => { navigate("/org-dashboard"); setSidebarOpen(false); }} style={{ color: "#60a5fa" }}>👥 {t("b2b.clientsNav")}</button>
            <button onClick={() => { navigate("/org-dashboard"); setSidebarOpen(false); }} style={{ color: "#60a5fa" }}>📄 {t("b2b.reports")}</button>
            <div style={{ height: 1, background: "rgba(96,165,250,0.12)", margin: "4px 0" }} />
            <button className={tab === "market"      ? "active" : ""} onClick={() => { setTab("market");      setSidebarOpen(false); }}>🔍 {t("nav.market")}</button>
            <button className={tab === "portfolio"   ? "active" : ""} onClick={() => { setTab("portfolio");   setSidebarOpen(false); }}>🤖 {t("nav.portfolioAI")}</button>
            <button className={tab === "myportfolio" ? "active" : ""} onClick={() => { setTab("myportfolio"); setSidebarOpen(false); }}>📦 {t("nav.portfolio")}</button>
            <button onClick={() => { navigate("/academy"); setSidebarOpen(false); }}>🎓 B2B Academy</button>
          </>}

          {/* ── CANTINA navigation ────────────────────────────────── */}
          {viewMode === "cantina" && <>
            <button className={tab === "dashboard"   ? "active" : ""} onClick={() => { setTab("dashboard");   setSidebarOpen(false); }} style={{ color: "#d97706" }}>🏡 Dashboard</button>
            <div style={{ height: 1, background: "rgba(217,119,6,0.15)", margin: "4px 0" }} />
            <button onClick={() => { navigate("/winery"); setSidebarOpen(false); }} style={{ color: "#d97706" }}>🍷 I Miei Vini</button>
            <button onClick={() => { navigate("/winery/profile"); setSidebarOpen(false); }} style={{ color: "#d97706" }}>👤 Profilo Cantina</button>
            <button onClick={() => { navigate("/winery/vintage-story"); setSidebarOpen(false); }} style={{ color: "#d97706" }}>📖 Racconto Annata</button>
            <div style={{ height: 1, background: "rgba(217,119,6,0.15)", margin: "4px 0" }} />
            <button className={tab === "market"      ? "active" : ""} onClick={() => { setTab("market");      setSidebarOpen(false); }}>🌍 Mercato Globale</button>
            <button className={tab === "analysis"    ? "active" : ""} onClick={() => { setTab("analysis");    setSidebarOpen(false); }}>📈 Analytics</button>
          </>}

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
          {/* ── B2B Dashboard ────────────────────────────────────────────── */}
          {tab === "dashboard" && viewMode === "b2b" && (
            <div style={{ padding: "24px 0 0" }}>
              <section style={{ background: "linear-gradient(135deg, rgba(96,165,250,0.08) 0%, rgba(59,130,246,0.04) 100%)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", margin: 0, fontFamily: "var(--vi-font-display)" }}>{t("b2b.headerTitle")}</h1>
                  <span style={{ fontSize: 10, color: "#60a5fa", border: "1px solid rgba(96,165,250,0.4)", borderRadius: 4, padding: "2px 8px", fontWeight: 800, textTransform: "uppercase" }}>{t("b2b.badge")}</span>
                </div>
                <p style={{ color: "#3a5a7a", fontSize: 13, margin: 0 }}>Wine investment intelligence for wealth managers, family offices and institutional advisors.</p>
                <div ref={heroSearchRef} className="hero-search-wrapper" style={{ marginTop: 20 }}>
                  <input className="hero-search-input" placeholder={t("hero.searchPlaceholder")} value={heroSearch} onChange={e => handleHeroSearch(e.target.value)} onFocus={() => heroSearch && setShowSuggestions(true)} />
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

              <section className="statsGrid" style={{ marginBottom: 24 }}>
                {[
                  { label: t("b2b.aum"),         value: `€ ${portfolioValue.toFixed(0)}` },
                  { label: t("b2b.clients"),      value: "—", link: "/org-dashboard" },
                  { label: t("b2b.performance"),  value: `${portfolioROI}%` },
                  { label: t("stats.invested"),   value: `€ ${totalInvested.toFixed(0)}` },
                  { label: t("stats.profitLoss"), value: `€ ${totalProfit.toFixed(0)}` },
                  { label: t("stats.watchlist"),  value: watchlist.length },
                ].map((s, i) => (
                  <div key={i} className="statCard fade-up" style={{ borderTop: "2px solid rgba(96,165,250,0.2)", cursor: s.link ? "pointer" : "default" }} onClick={() => s.link && navigate(s.link)}>
                    <small>{s.label}</small>
                    <h2 style={{ color: "#60a5fa" }}>{s.value}</h2>
                  </div>
                ))}
              </section>

              <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { icon: "📊", title: t("b2b.marketIntelligence"), desc: "En primeur, auctions, movers", href: "/market-intelligence" },
                  { icon: "👥", title: t("b2b.clientsNav"),         desc: "Client portfolios and CRM",   href: "/org-dashboard" },
                  { icon: "📄", title: t("b2b.reports"),            desc: "PDF, CSV, audit log",         href: "/org-dashboard" },
                  { icon: "🎓", title: "B2B Academy",               desc: "HNW/UHNW curriculum",          href: "/academy" },
                ].map((a) => (
                  <button key={a.title} onClick={() => navigate(a.href)}
                    style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 12, padding: "16px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(96,165,250,0.1)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.35)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(96,165,250,0.04)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.15)"; }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#60a5fa", marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: "#3a5a7a" }}>{a.desc}</div>
                  </button>
                ))}
              </section>

              <div style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#3a5a7a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#60a5fa" }}>💎</span>
                {t("b2b.premiumOnly")}
                <button onClick={() => setTab("market")} style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  {t("nav.market")} →
                </button>
              </div>
            </div>
          )}

          {/* ── Dashboard CANTINA ──────────────────────────────────────────── */}
          {tab === "dashboard" && viewMode === "cantina" && (
            <ErrorBoundary>
              <Suspense fallback={<div style={{ padding: 24, color: "#64748b" }}>Carico dashboard cantina…</div>}>
                <WineryDashboard />
              </Suspense>
            </ErrorBoundary>
          )}

          {/* ── Dashboard B2C ─────────────────────────────────────────────── */}
          {tab === "dashboard" && viewMode !== "b2b" && viewMode !== "cantina" && (
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

              {/* ── Prossimo passo (B2C guided path) ───────────────── */}
              <NextStepWidget
                watchlist={watchlist}
                orders={orders}
                portfolio={portfolio}
                onGoMarket={() => setTab("market")}
                onGoPortfolio={() => setTab("myportfolio")}
                navigate={navigate}
              />

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
                      style={{ fontSize: 11, color: "var(--vi-accent)", background: "none", border: "1px solid rgba(201,162,39,0.25)", borderRadius: "var(--vi-radius-sm)", padding: "4px 10px", cursor: "pointer", fontFamily: "var(--vi-font-sans)" }}
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
            <ErrorBoundary>
            <>
              {/* Wine Investment Pyramid */}
              <Suspense fallback={null}>
                <div style={{ marginBottom: 28 }}>
                  <WinePyramid
                    onSelectTier={tier => {
                      if (tier) {
                        const priceMap = { ultra: { priceMin: 2000, priceMax: 10000 }, premium: { priceMin: 500, priceMax: 2000 }, entry: { priceMin: 100, priceMax: 500 } };
                        const range = priceMap[tier.id] || {};
                        handleMarketFiltersChange({ ...DEFAULT_FILTERS, ...range });
                      } else {
                        handleMarketFiltersReset();
                      }
                    }}
                  />
                </div>
              </Suspense>
              <label htmlFor="market-search" className="visually-hidden">Cerca vini</label>
              <input
                id="market-search"
                className="searchInput"
                aria-label="Cerca vini nel mercato"
                placeholder={t("market.searchPlaceholder")}
                value={marketSearch}
                onChange={e => handleMarketSearch(e.target.value)}
              />
              <div style={{ marginTop: 10 }}>
                <MarketFilters
                  filters={marketFilters}
                  onChange={handleMarketFiltersChange}
                  onReset={handleMarketFiltersReset}
                  resultCount={marketTotal}
                />
              </div>

              {/* ── Personalizzazione colonne + filtri salvati ─────── */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                <MarketColumnsPanel
                  columns={userColumns}
                  onToggle={toggleColumn}
                  onReset={() => resetAllPrefs()}
                />
                <button
                  onClick={() => {
                    const name = prompt("Nome del filtro salvato:");
                    if (name?.trim()) saveFilter(name.trim(), { ...marketFilters, search: marketSearch });
                  }}
                  style={{ fontSize: 11, fontWeight: 600, color: "#4a6a8a", background: "rgba(8,15,30,0.5)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
                  title="Salva ricerca e filtri correnti"
                >
                  + Salva filtri
                </button>
                {savedFilters.length > 0 && savedFilters.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 8, padding: "3px 10px 3px 12px", fontSize: 11, color: "#C9A227", cursor: "pointer", whiteSpace: "nowrap" }}>
                    <span onClick={() => { handleMarketFiltersChange({ ...marketFilters, ...f.filters }); if (f.filters.search) handleMarketSearch(f.filters.search); }} style={{ cursor: "pointer" }}>
                      {f.name}
                    </span>
                    <button onClick={() => deleteFilter(f.id)} style={{ background: "none", border: "none", color: "#475569", fontSize: 13, cursor: "pointer", padding: "0 2px", lineHeight: 1 }} title="Elimina filtro">×</button>
                  </div>
                ))}
              </div>

              {accountType && ["b2b", "wealth_manager", "cantina", "family_office"].includes(accountType) && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <button
                    onClick={() => setInstitutionalView(v => !v)}
                    style={{
                      padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                      fontSize: 12, fontWeight: 600,
                      background: institutionalView ? "rgba(201,162,39,0.15)" : "rgba(8,15,30,0.6)",
                      border: institutionalView ? "1px solid rgba(201,162,39,0.5)" : "1px solid rgba(30,41,59,0.4)",
                      color: institutionalView ? "#C9A227" : "#4a6a8a",
                      transition: "all 0.15s",
                    }}
                  >
                    {institutionalView ? "Vista Istituzionale" : "Vista Completa"}
                  </button>
                  {institutionalView && (
                    <span style={{ fontSize: 11, color: "#C9A227", opacity: 0.7 }}>
                      Prezzo {">"}€200 · Score 80+ · Rischio Basso/Medio
                    </span>
                  )}
                </div>
              )}
              {viewMode === "b2b" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#3a5a7a" }}>
                  <span style={{ color: "#60a5fa" }}>💎</span>
                  {t("b2b.premiumOnly")} — Professional view active
                </div>
              )}
              {recommendedWines.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#C9A227" }}>
                      ✨ Recommended for You
                    </h3>
                    {recommendedBasedOn.length > 0 && (
                      <span style={{ fontSize: 11, color: "#3a5a7a" }}>
                        Based on {recommendedBasedOn.join(", ")}
                      </span>
                    )}
                  </div>
                  <section className="marketGrid">
                    {recommendedWines.map(wine => (
                      <WineCard
                        key={`rec-${wine.id}`}
                        wine={wine}
                        aiScore={cardProps.aiScores[wine.id]}
                        alerts={cardProps.alerts.filter(a => a.wine_id === wine.id && a.active)}
                        alertInput={cardProps.alertInputs[wine.id]}
                        inWatchlist={cardProps.watchlist.includes(wine.id)}
                        onImageClick={cardProps.onImageClick}
                        onAddToPortfolio={cardProps.onAddToPortfolio}
                        onToggleWatchlist={cardProps.onToggleWatchlist}
                        onCardTilt={cardProps.onCardTilt}
                        onCardTiltReset={cardProps.onCardTiltReset}
                        onCreateAlert={cardProps.onCreateAlert}
                        onAlertInputChange={cardProps.onAlertInputChange}
                        onDeleteAlert={cardProps.onDeleteAlert}
                        visibleColumns={userColumns}
                        note={wineNotes[wine.id] || ""}
                        onNoteChange={setWineNote}
                      />
                    ))}
                  </section>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(30,41,59,0.4)", margin: "20px 0 16px" }} />
                </div>
              )}

              {/* ── Trending questa settimana ─────────────────────────── */}
              {trending.length > 0 && !marketSearch && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#4a9eff" }}>
                      📈 Trending questa settimana
                    </h3>
                    <span style={{ fontSize: 11, color: "#3a5a7a" }}>nella tua regione</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {trending.slice(0, 5).map((w, i) => (
                      <button
                        key={w.id || i}
                        onClick={() => { setMarketSearch(w.name); mSearchRef.current = w.name; loadMarketWines(w.name, 1, false); }}
                        style={{
                          padding: "8px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                          background: "rgba(74,158,255,0.06)", border: "1px solid rgba(74,158,255,0.2)",
                          transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#4a9eff", minWidth: 16 }}>#{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Playfair Display', Georgia, serif" }}>{w.name}</div>
                          <div style={{ fontSize: 10, color: "#64748b" }}>{w.producer}</div>
                        </div>
                        {w.change != null && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: w.change >= 0 ? "#4ade80" : "#f87171", marginLeft: "auto" }}>
                            {w.change >= 0 ? "+" : ""}{w.change}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(30,41,59,0.3)", margin: "20px 0 16px" }} />
                </div>
              )}

              {/* ── Gli investitori guardano anche questi ──────────────── */}
              {investorWines.length > 0 && !marketSearch && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#a78bfa" }}>
                      👁 Gli investitori guardano anche questi
                    </h3>
                    <span style={{ fontSize: 11, color: "#3a5a7a" }}>AI Score 85+</span>
                  </div>
                  <section className="marketGrid">
                    {investorWines.map(wine => (
                      <WineCard
                        key={`inv-${wine.id}`}
                        wine={wine}
                        aiScore={cardProps.aiScores[wine.id]}
                        alerts={cardProps.alerts.filter(a => a.wine_id === wine.id && a.active)}
                        alertInput={cardProps.alertInputs[wine.id]}
                        inWatchlist={cardProps.watchlist.includes(wine.id)}
                        onImageClick={cardProps.onImageClick}
                        onAddToPortfolio={cardProps.onAddToPortfolio}
                        onToggleWatchlist={cardProps.onToggleWatchlist}
                        onCardTilt={cardProps.onCardTilt}
                        onCardTiltReset={cardProps.onCardTiltReset}
                        onCreateAlert={cardProps.onCreateAlert}
                        onAlertInputChange={cardProps.onAlertInputChange}
                        onDeleteAlert={cardProps.onDeleteAlert}
                        visibleColumns={userColumns}
                        note={wineNotes[wine.id] || ""}
                        onNoteChange={setWineNote}
                      />
                    ))}
                  </section>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(30,41,59,0.3)", margin: "20px 0 16px" }} />
                </div>
              )}

              <div ref={marketGridRef} style={{ width: "100%" }}>
                {marketLoading && marketWines.length === 0 ? (
                  <section className="marketGrid">
                    {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                  </section>
                ) : marketWines.length > 0 ? (
                  <>
                    <section className="marketGrid">
                      {marketWines.map(wine => (
                        <WineCard
                          key={wine.id}
                          wine={wine}
                          aiScore={cardProps.aiScores[wine.id]}
                          alerts={cardProps.alerts.filter(a => a.wine_id === wine.id && a.active)}
                          alertInput={cardProps.alertInputs[wine.id]}
                          inWatchlist={cardProps.watchlist.includes(wine.id)}
                          onImageClick={cardProps.onImageClick}
                          onAddToPortfolio={cardProps.onAddToPortfolio}
                          onToggleWatchlist={cardProps.onToggleWatchlist}
                          onCardTilt={cardProps.onCardTilt}
                          onCardTiltReset={cardProps.onCardTiltReset}
                          onCreateAlert={cardProps.onCreateAlert}
                          onAlertInputChange={cardProps.onAlertInputChange}
                          onDeleteAlert={cardProps.onDeleteAlert}
                          visibleColumns={userColumns}
                          note={wineNotes[wine.id] || ""}
                          onNoteChange={setWineNote}
                        />
                      ))}
                    </section>
                    <div ref={marketSentinelRef} style={{ height: 1 }} />
                  </>
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
                    <button onClick={() => { setProactiveWines([]); setProactiveTrigger(null); }} aria-label="Close suggestions" style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14 }}>✕</button>
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
            </ErrorBoundary>
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
                  Generating AI articles...
                </div>
              )}

              {selectedPost ? (
                /* ── Full post view ─── */
                <article style={{ maxWidth: 720 }}>
                  <div style={{ fontSize: 11, color: "#C9A227", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{selectedPost.category} · {selectedPost.readTime} read</div>
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
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>{t('market.aiScoreHint')}</p>
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
                        <span style={{ color: "#C9A227", fontWeight: 600 }}>Read →</span>
                      </div>
                    </div>
                  ))}
                  {!blogLoading && blogPosts.length === 0 && (
                    <div style={{ color: "#3a5a7a", padding: 24, gridColumn: "1/-1", textAlign: "center" }}>No articles available.</div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── Analysis ──────────────────────────────────────────────────── */}
          {tab === "analysis" && (
            <section className="chartPanel">
              <h2>{t('watchlist.title')}</h2>
              {!selectedWine && <p>{t('watchlist.empty')}</p>}
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
            <ErrorBoundary>
            <section className="ordersPanel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ margin: 0 }}>{t('portfolio.title')}</h2>
                {holdings.length > 0 && (
                  <div style={{ display: "flex", gap: 8 }}>
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
                    <button
                      className="btn-primary"
                      style={{ width: "auto", padding: "9px 18px", fontSize: 12, background: "rgba(201,162,39,0.15)", border: "1px solid rgba(201,162,39,0.4)", color: "#C9A227" }}
                      onClick={async () => {
                        const { jsPDF } = await import("jspdf");
                        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
                        const gold = [201, 162, 39];
                        const dark = [11, 18, 32];
                        // Header
                        doc.setFillColor(...dark);
                        doc.rect(0, 0, 297, 297, "F");
                        doc.setFontSize(22); doc.setTextColor(...gold); doc.setFont("helvetica", "bold");
                        doc.text("VinoInvest", 14, 18);
                        doc.setFontSize(11); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
                        doc.text(`Portfolio Report — ${new Date().toLocaleDateString("en-GB")}`, 14, 26);
                        doc.text(`${userEmail}`, 14, 32);
                        // KPIs
                        doc.setFontSize(10); doc.setTextColor(...gold); doc.setFont("helvetica", "bold");
                        const kpis = [
                          ["Portfolio Value", `€${portfolioValue.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`],
                          ["Total Invested", `€${totalInvested.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`],
                          ["Total P&L", `€${totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`],
                          ["ROI", `${portfolioROI}%`],
                          ["Positions", `${holdings.length}`],
                        ];
                        kpis.forEach(([label, val], i) => {
                          const x = 14 + i * 56;
                          doc.setFillColor(30, 41, 59);
                          doc.roundedRect(x, 38, 52, 18, 2, 2, "F");
                          doc.setFontSize(7); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
                          doc.text(label, x + 4, 44);
                          doc.setFontSize(11); doc.setTextColor(...gold); doc.setFont("helvetica", "bold");
                          doc.text(val, x + 4, 52);
                        });
                        // Table header
                        const cols = [80, 18, 28, 28, 28, 28, 26, 18];
                        const headers = ["Wine", "Qty", "Buy €", "Current €", "Invested €", "Value €", "P&L €", "ROI %"];
                        let y = 66;
                        doc.setFillColor(30, 41, 59); doc.rect(14, y - 5, 269, 8, "F");
                        let x = 14;
                        headers.forEach((h, i) => {
                          doc.setFontSize(8); doc.setTextColor(...gold); doc.setFont("helvetica", "bold");
                          doc.text(h, x + 1, y); x += cols[i];
                        });
                        y += 6;
                        holdings.forEach((h, idx) => {
                          if (idx % 2 === 0) { doc.setFillColor(15, 23, 42); doc.rect(14, y - 4, 269, 7, "F"); }
                          x = 14;
                          const row = [
                            h.name.length > 35 ? h.name.substring(0, 35) + "…" : h.name,
                            String(h.quantity),
                            `€${Number(h.purchasePrice).toLocaleString("it-IT", { maximumFractionDigits: 0 })}`,
                            `€${Number(h.currentPrice).toLocaleString("it-IT", { maximumFractionDigits: 0 })}`,
                            `€${h.invested.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`,
                            `€${h.currentValue.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`,
                            `${h.profit >= 0 ? "+" : ""}€${h.profit.toLocaleString("it-IT", { maximumFractionDigits: 0 })}`,
                            `${h.roi}%`,
                          ];
                          row.forEach((cell, i) => {
                            doc.setFontSize(7.5); doc.setFont("helvetica", "normal");
                            doc.setTextColor(i === 6 ? (h.profit >= 0 ? 74 : 248) : 226, i === 6 ? (h.profit >= 0 ? 222 : 113) : 232, i === 6 ? (h.profit >= 0 ? 128 : 113) : 240);
                            doc.text(cell, x + 1, y); x += cols[i];
                          });
                          y += 7;
                          if (y > 185) { doc.addPage(); doc.setFillColor(...dark); doc.rect(0, 0, 297, 210, "F"); y = 20; }
                        });
                        // Footer
                        doc.setFontSize(7); doc.setTextColor(71, 85, 105);
                        doc.text("Generated by VinoInvest · vinoinvest-platform.vercel.app · Data sources: Wine-Searcher, CellarTracker, Liv-ex", 14, 200);
                        doc.text("⚠ Past performance does not guarantee future results. Not financial advice.", 14, 205);
                        doc.save(`vinoinvest-portfolio-${new Date().toISOString().split("T")[0]}.pdf`);
                        track("portfolio_export_pdf", { holdings_count: holdings.length });
                      }}
                    >Export PDF</button>
                  </div>
                )}
              </div>
              {holdings.length === 0 && (() => {
                const DEMO_HOLDINGS = [
                  { id: "lafite-2019", name: "Château Lafite Rothschild 2019", purchasePrice: 780, currentPrice: 920, quantity: 3, invested: 2340, currentValue: 2760, profit: 420, roi: "+17.9" },
                  { id: "barolo-giacomo-2018", name: "Barolo Giacomo Conterno 2018", purchasePrice: 210, currentPrice: 265, quantity: 6, invested: 1260, currentValue: 1590, profit: 330, roi: "+26.2" },
                  { id: "dom-perignon-2015", name: "Dom Pérignon 2015", purchasePrice: 175, currentPrice: 195, quantity: 12, invested: 2100, currentValue: 2340, profit: 240, roi: "+11.4" },
                ];
                const demoValue = DEMO_HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
                const demoInvested = DEMO_HOLDINGS.reduce((s, h) => s + h.invested, 0);
                const demoROI = (((demoValue - demoInvested) / demoInvested) * 100).toFixed(1);
                return (
                  <div>
                    {/* DEMO banner */}
                    <div style={{ background: "linear-gradient(135deg,rgba(234,179,8,0.18),rgba(234,179,8,0.06))", border: "2px solid rgba(234,179,8,0.5)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>📊</span>
                        <span style={{ fontSize: 13, color: "#fef08a", fontWeight: 600 }}>{t('portfolio.demo')}</span>
                      </div>
                      <button onClick={() => setTab("market")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, color: "#0b1220", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>{t('portfolio.addFirstWine')}</button>
                    </div>
                    {/* Demo stats */}
                    <div className="statsGrid" style={{ marginBottom: 28 }}>
                      {[
                        { label: "Demo Portfolio Value", value: `€ ${demoValue.toLocaleString()}` },
                        { label: "Total Invested (demo)", value: `€ ${demoInvested.toLocaleString()}` },
                        { label: "Demo Profit", value: `+€ ${(demoValue - demoInvested).toLocaleString()}`, color: "#4caf50" },
                        { label: "Demo ROI", value: `+${demoROI}%`, color: "#4caf50" },
                      ].map((s, i) => (
                        <div key={i} className="statCard">
                          <small>{s.label}</small>
                          <h2 style={s.color ? { color: s.color } : {}}>{s.value}</h2>
                        </div>
                      ))}
                    </div>
                    {/* Demo table */}
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, opacity: 0.7 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #0f1a2e", color: "#3a5a7a" }}>
                            {["Wine", "Bottles", "Buy Price", "Current", "Value", "ROI"].map(h => (
                              <th key={h} style={{ textAlign: h === "Wine" ? "left" : "right", padding: "9px 8px", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {DEMO_HOLDINGS.map((h, i) => (
                            <tr key={h.id} style={{ borderBottom: "1px solid #0a1220", background: i % 2 === 0 ? "transparent" : "rgba(11,18,32,0.5)" }}>
                              <td style={{ padding: "11px 8px", fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif" }}>
                                {h.name}
                                <span style={{ marginLeft: 8, fontSize: 9, background: "rgba(201,162,39,0.15)", color: "#C9A227", borderRadius: 3, padding: "1px 5px", fontFamily: "Inter, sans-serif" }}>DEMO</span>
                              </td>
                              <td style={{ textAlign: "right", padding: "11px 8px" }}>{h.quantity}</td>
                              <td style={{ textAlign: "right", padding: "11px 8px" }}>€{h.purchasePrice}</td>
                              <td style={{ textAlign: "right", padding: "11px 8px" }}>€{h.currentPrice}</td>
                              <td style={{ textAlign: "right", padding: "11px 8px" }}>€{h.currentValue.toLocaleString()}</td>
                              <td style={{ textAlign: "right", padding: "11px 8px", color: "#4caf50" }}>{h.roi}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
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
                            <td style={{ textAlign: "right", padding: "11px 8px", color: "#C9A227" }}>€ {est1y}*</td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: "#C9A227" }}>€ {est5y}*</td>
                            <td style={{ textAlign: "right", padding: "11px 8px", color: "#C9A227" }}>€ {est10y}*</td>
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
                  <p style={{ marginTop: 14, fontSize: 11, color: "#1e3050" }}>* Stima basata su crescita media annua storica 8% (fonte: Liv-ex 100, 2001–2024). I rendimenti passati non garantiscono risultati futuri. Non costituisce consulenza finanziaria. <a href="/disclaimer" style={{ color: "#334155" }}>Disclaimer →</a></p>

                  {/* ── Benchmark comparison ──────────────────────────────── */}
                  {benchmarkData && (
                    <div style={{ marginTop: 36 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, marginBottom: 4, color: "#C9A227" }}>Benchmark vs Asset Classes</h3>
                      <p style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 16 }}>Rendimento 12 mesi — confronto storico indicativo</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                        {[
                          { label: "Fine Wine", key: "vinoInvestIndex", color: "#C9A227", value: (benchmarkData.vinoInvestIndex?.return12m * 100).toFixed(1) },
                          { label: "S&P 500", key: "sp500", color: "#60a5fa", value: (benchmarkData.sp500?.return12m * 100).toFixed(1) },
                          { label: "Gold", key: "gold", color: "#fbbf24", value: (benchmarkData.gold?.return12m * 100).toFixed(1) },
                          { label: "EU Inflation", key: "euInflation", color: "#f87171", value: (benchmarkData.euInflation?.rate * 100).toFixed(1) },
                        ].map(b => {
                          const pct = parseFloat(b.value);
                          const maxPct = 20;
                          const barW = Math.min(100, Math.max(4, (pct / maxPct) * 100));
                          return (
                            <div key={b.key} style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(31,41,55,0.7)", borderRadius: 12, padding: "14px 16px" }}>
                              <div style={{ fontSize: 11, color: "#3a5a7a", marginBottom: 6 }}>{b.label}</div>
                              <div style={{ fontSize: 22, fontWeight: 800, color: b.color, fontVariantNumeric: "tabular-nums", marginBottom: 10 }}>+{b.value}%</div>
                              <div style={{ height: 4, background: "rgba(30,41,59,0.7)", borderRadius: 2 }}>
                                <div style={{ height: 4, width: `${barW}%`, background: b.color, borderRadius: 2, opacity: 0.8 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p style={{ marginTop: 8, fontSize: 10, color: "#1e3050" }}>Fonte: Liv-ex 100, FRED/S&P500, FRED/Gold, ECB. Dati indicativi.</p>
                    </div>
                  )}

                  {/* ── Diversification breakdown ─────────────────────────── */}
                  <div style={{ marginTop: 36 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, marginBottom: 16, color: "#C9A227" }}>Diversification</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* By type — animated donut */}
                      <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(31,41,55,0.7)", borderRadius: 14, padding: 18 }}>
                        <Suspense fallback={<div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#3a5a7a", fontSize: 12 }}>Caricamento...</div>}>
                          <PortfolioDonut
                            label="Per Tipo"
                            totalValue={portfolioValue}
                            data={Object.entries(
                              holdings.reduce((acc, h) => {
                                const wineData = wines.find(w => w.id === h.id);
                                const type = deriveWineType(wineData || { name: h.name });
                                acc[type] = (acc[type] || 0) + h.currentValue;
                                return acc;
                              }, {})
                            ).sort(([,a],[,b]) => b - a).map(([label, value]) => ({ label, value }))}
                          />
                        </Suspense>
                      </div>
                      {/* By wine — animated donut */}
                      <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(31,41,55,0.7)", borderRadius: 14, padding: 18 }}>
                        <Suspense fallback={<div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#3a5a7a", fontSize: 12 }}>Caricamento...</div>}>
                          <PortfolioDonut
                            label="Per Vino (Top 5)"
                            totalValue={portfolioValue}
                            data={[...holdings].sort((a, b) => b.currentValue - a.currentValue).slice(0, 5).map(h => ({
                              label: h.name,
                              value: h.currentValue,
                              roi: Number(h.roi),
                            }))}
                          />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
            </ErrorBoundary>
          )}

          {/* ── Portfolio AI ───────────────────────────────────────────────── */}
          {tab === "portfolio" && (
            <ErrorBoundary>
            <section className="ordersPanel">
              {/* ── AI Chat Advisor ────────────────────────────────────────── */}
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>AI Wine Advisor</h2>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>{t('chat.agentHint')}</p>
                <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(30,41,59,0.7)", borderRadius: 16, overflow: "hidden" }}>
                  <Suspense fallback={<div style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#3a5a7a", fontSize: 13 }}>Loading...</div>}>
                    <AgentChat holdings={holdings} onAddToPortfolio={handleAddToPortfolio} />
                  </Suspense>
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
                          <p style={{ fontSize: 12, color: "#3a5a7a" }}>Signal: <span style={{ color: "#C9A227" }}>{item.signal}</span> <span style={{ fontSize: 10, color: "#475569" }}>(informativo)</span> · AI Score: {item.aiScore}</p>
                          <p style={{ fontSize: 12, color: "#3a5a7a" }}>Bottles: {item.estimatedBottles} · Allocation: <span style={{ color: "#e2e8f0" }}>€ {item.allocatedAmount}</span></p>
                          <p style={{ fontSize: 12, color: "#3a5a7a" }}>Estimated Return: <span style={{ color: "#4ade80" }}>€ {item.estimatedReturn}*</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
            </ErrorBoundary>
          )}

          {tab === "b2b" && <ErrorBoundary><Suspense fallback={null}><DashboardB2B /></Suspense></ErrorBoundary>}

          {/* ── Notifications ─────────────────────────────────────────────── */}
          {tab === "notifications" && (
            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 800, margin: 0 }}>{t('notifications.title')}</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  {Notification.permission !== "granted" && "Notification" in window && (
                    <button
                      onClick={async () => {
                        const perm = await Notification.requestPermission();
                        if (perm === "granted") toast(t("notifications.pushEnabled"), "success");
                      }}
                      style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(201,162,39,0.3)", background: "rgba(201,162,39,0.1)", color: "#C9A227", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >{t('notifications.enablePush')}</button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={markAllRead} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(30,41,59,0.5)", background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer" }}>{t('notifications.markAllRead')}</button>
                  )}
                </div>
              </div>
              {notifications.length === 0 ? (
                <div style={{ color: "#1e3050", fontSize: 13, padding: 24, border: "1px dashed rgba(30,41,59,0.5)", borderRadius: 12, textAlign: "center" }}>
                  {t('notifications.noNotifications')}
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
        </section>
      </main>

      {modalWine && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <WineBottle3DModal wine={modalWine} onClose={() => setModalWine(null)} />
          </Suspense>
        </ErrorBoundary>
      )}

      {purchaseWine && (
        <Suspense fallback={null}>
          <PurchaseModal
            wine={purchaseWine}
            onClose={() => setPurchaseWine(null)}
            onImport={() => { loadData(); setPurchaseWine(null); }}
          />
        </Suspense>
      )}

      {/* ── HelpBot FAQ ─────────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <HelpBot
          onAskAI={(msg) => {
            setChatInitMsg(msg);
            setFloatChatOpen(true);
            setFloatUnread(0);
          }}
        />
      </Suspense>

      {/* ── Floating AI Chat Button ──────────────────────────────────────── */}
      <button
        aria-label={floatChatOpen ? "Chiudi chat AI" : "Apri chat AI"}
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
            <ErrorBoundary>
              <Suspense fallback={<div style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#3a5a7a", fontSize: 13 }}>Loading...</div>}>
                <AgentChat
                  holdings={holdings}
                  onAddToPortfolio={handleAddToPortfolio}
                  compact={true}
                  initialMessage={chatInitMsg}
                  onInitialMessageSent={() => setChatInitMsg("")}
                />
              </Suspense>
            </ErrorBoundary>
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

      {/* ── Password Recovery Modal ─────────────────────────────────────── */}
      {showPasswordRecovery && <PasswordRecoveryModal onClose={() => setShowPasswordRecovery(false)} />}

      {/* ── Disclaimer Bar finanziario ──────────────────────────────────── */}
      <DisclaimerBar />

      {/* ── Command Palette (⌘K) ───────────────────────────────────────── */}
      <CommandPalette onSelectWine={(wine) => {
        setModalWine(wine);
      }} />

      {/* ── Cookie Banner GDPR ──────────────────────────────────────────── */}
      <CookieBanner />

      {/* ── Exit Intent Popup ───────────────────────────────────────────── */}
      <ExitIntentPopup userEmail={userEmail} />

      {/* ── Proactive AI Briefing ───────────────────────────────────────── */}
      <ProactiveBriefing
        userId={userEmail}
        holdings={portfolio?.wines || []}
        marketWines={wines || []}
        onViewPortfolio={() => setTab("portfolio")}
      />

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
        <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 12, lineHeight: 1.6, color: "#94a3b8" }}>
          <strong style={{ color: "#C9A227" }}>⚠️ Disclaimer:</strong> VinoInvest provides data and analysis for informational purposes only. This does not constitute financial advice, investment recommendation or solicitation to purchase. Past returns do not guarantee future results. Investing in wine involves risk of capital loss. Prices shown are algorithmic estimates unless otherwise indicated. <a href="/disclaimer" style={{ color: "#C9A227" }}>Read full disclaimer →</a>
        </div>
        <span style={{ color: "#334155" }}>
          © {new Date().getFullYear()} VinoInvest ·{" "}
          <a href="/terms" style={{ color: "#475569", textDecoration: "none" }}>Terms</a>{" · "}
          <a href="/privacy" style={{ color: "#475569", textDecoration: "none" }}>Privacy</a>{" · "}
          <a href="/cookies" style={{ color: "#475569", textDecoration: "none" }}>Cookies</a>{" · "}
          <a href="/disclaimer" style={{ color: "#475569", textDecoration: "none" }}>Disclaimer</a>{" · "}
          <a href="/transparency" style={{ color: "#475569", textDecoration: "none" }}>Trasparenza</a>{" · "}
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

// Init analytics
initAnalytics();

// Web Vitals reporting — sends to console in dev, to analytics in production
function reportWebVitals(metric) {
  if (import.meta.env.DEV) {
    console.log(`[WebVital] ${metric.name}:`, metric.value.toFixed(1), metric.rating);
    return;
  }
  // Send to backend analytics endpoint (fire-and-forget)
  try {
    navigator.sendBeacon?.(`${API}/api/analytics/vitals`, JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    }));
  } catch (_) {}
}

onCLS(reportWebVitals);
onLCP(reportWebVitals);
onINP(reportWebVitals);
onTTFB(reportWebVitals);

initErrorReporting();
applyTheme(getSavedTheme());

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
  <BrowserRouter>
    <ToastProvider>
      <CurrencyProvider>
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0b1220", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A227", fontSize: 14 }}>Loading...</div>}>
        <Routes>
          <Route path="/landing" element={<LandingPage onLogin={({ user, account_type }) => { window.location.href = "/"; }} />} />
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
          <Route path="/b2b/templates" element={<AcademyTemplates />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/verify/:code" element={<AcademyVerify />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/email" element={<AdminEmailDashboard />} />
          <Route path="/settings/privacy" element={<PrivacySettings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/regioni" element={<Regioni />} />
          <Route path="/produttori" element={<Produttori />} />
          <Route path="/annate" element={<Annate />} />
          <Route path="/market/producers" element={<MarketProducers />} />
          <Route path="/market/producers/:name" element={<MarketProducers />} />
          <Route path="/metodologia" element={<Methodology />} />
          <Route path="/glossario" element={<Glossary />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/data" element={<DataDownload />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/come-comprare" element={<ComeComprare />} />
          <Route path="/guide/piattaforme" element={<PlatformGuide />} />
          <Route path="/b2b/guide/:slug" element={<B2BGuide />} />
          <Route path="/org-dashboard" element={<OrgDashboard />} />
          <Route path="/clients/:clientId" element={<ClientDetail />} />
          <Route path="/market-intelligence" element={<MarketIntelligence />} />
          <Route path="/b2b-onboarding" element={<B2BOnboarding />} />
          <Route path="/compare" element={<WineCompare />} />
          <Route path="/winery" element={<WineryDashboard />} />
          <Route path="/winery/profile" element={<WineryProfile />} />
          <Route path="/winery/vintage-story" element={<VintageStory />} />
          <Route path="/cantina/:producerName" element={<WineryProfile />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<App />} />
        </Routes>
        </Suspense>
      </CurrencyProvider>
    </ToastProvider>
  </BrowserRouter>
  </HelmetProvider>
);
