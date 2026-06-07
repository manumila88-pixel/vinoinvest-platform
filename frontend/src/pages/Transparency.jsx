import React from "react";

const SOURCES = {
  prices: [
    { name: "Wine-Searcher", url: "https://www.wine-searcher.com", type: "Price aggregator", frequency: "Daily", reliability: 99 },
    { name: "Vivino", url: "https://www.vivino.com", type: "Community prices", frequency: "Daily", reliability: 97 },
    { name: "Tannico", url: "https://www.tannico.it", type: "Retailer prices", frequency: "Daily", reliability: 99 },
    { name: "Millesima", url: "https://www.millesima.com", type: "Retailer prices", frequency: "Daily", reliability: 98 },
    { name: "Idealwine", url: "https://www.idealwine.com", type: "Auction + retail", frequency: "Daily", reliability: 97 },
    { name: "CellarTracker", url: "https://www.cellartracker.com", type: "Community prices", frequency: "Daily", reliability: 90 },
    { name: "Callmewine", url: "https://www.callmewine.com", type: "Retailer prices", frequency: "Daily", reliability: 97 },
  ],
  ratings: [
    { name: "Decanter", url: "https://www.decanter.com", type: "Expert ratings", frequency: "On publication", reliability: 99 },
    { name: "Wine Spectator", url: "https://www.winespectator.com", type: "Expert ratings", frequency: "On publication", reliability: 99 },
    { name: "James Suckling", url: "https://www.jamessuckling.com", type: "Expert ratings", frequency: "On publication", reliability: 97 },
    { name: "Robert Parker Wine Advocate", url: "https://www.robertparker.com", type: "Expert ratings", frequency: "On publication", reliability: 99 },
    { name: "Vinous", url: "https://vinous.com", type: "Expert ratings", frequency: "On publication", reliability: 98 },
    { name: "Jancis Robinson", url: "https://www.jancisrobinson.com", type: "Expert ratings", frequency: "On publication", reliability: 99 },
    { name: "Gambero Rosso", url: "https://www.gamberorosso.it", type: "Italian wine guide", frequency: "Annual", reliability: 97 },
  ],
  news: [
    { name: "Decanter", url: "https://www.decanter.com/wine-news", type: "Wine news RSS", frequency: "Hourly", reliability: 99 },
    { name: "Wine Spectator", url: "https://www.winespectator.com/articles", type: "Wine news RSS", frequency: "Hourly", reliability: 99 },
    { name: "WineNews.it", url: "https://www.winenews.it", type: "Italian wine news RSS", frequency: "Hourly", reliability: 95 },
    { name: "Drinks Business", url: "https://www.thedrinksbusiness.com", type: "Trade news RSS", frequency: "Hourly", reliability: 97 },
    { name: "Intravino", url: "https://www.intravino.com", type: "Italian wine news", frequency: "Hourly", reliability: 93 },
    { name: "Harpers Wine", url: "https://www.harpers.co.uk", type: "Trade news RSS", frequency: "Hourly", reliability: 95 },
  ],
  data: [
    { name: "Wikipedia / Wikidata", url: "https://www.wikidata.org", type: "Wine & producer info (CC)", frequency: "Weekly", reliability: 85 },
    { name: "Open-Meteo", url: "https://open-meteo.com", type: "Historical climate data (free API)", frequency: "On request", reliability: 98 },
    { name: "European Central Bank", url: "https://www.ecb.europa.eu", type: "Currency exchange rates", frequency: "Daily", reliability: 100 },
    { name: "Open Food Facts", url: "https://world.openfoodfacts.org", type: "Product info (CC)", frequency: "Weekly", reliability: 80 },
    { name: "Liv-ex", url: "https://www.liv-ex.com", type: "Fine wine market index", frequency: "Weekly public data", reliability: 100 },
  ],
};

function ReliabilityBadge({ score }) {
  const color = score >= 95 ? "#4ade80" : score >= 80 ? "#C9A227" : "#94a3b8";
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}30`, borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 700 }}>
      {score}%
    </span>
  );
}

function SourceTable({ title, sources }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 16, color: "#C9A227" }}>{title}</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
              {["Source", "Type", "Frequency", "Reliability"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(30,41,59,0.3)" }}>
                <td style={{ padding: "10px 12px" }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#e2e8f0", textDecoration: "none", fontWeight: 600 }}>
                    {s.name} <span style={{ fontSize: 10, color: "#64748b" }}>↗</span>
                  </a>
                </td>
                <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{s.type}</td>
                <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{s.frequency}</td>
                <td style={{ padding: "10px 12px" }}><ReliabilityBadge score={s.reliability} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Transparency() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Back to VinoInvest
        </a>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          Data Transparency
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 48, maxWidth: 680 }}>
          VinoInvest is committed to transparency. Every data point shown on our platform has a verifiable source.
          Here you can see exactly where our data comes from, how often it's updated, and how reliable we consider it.
        </p>

        {/* How data works */}
        <div style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Real vs. Estimated Data</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { badge: "✓ Verified", color: "#4ade80", label: "Price from source", desc: "Price retrieved from a real retailer or auction within 24h." },
              { badge: "~ Estimated", color: "#C9A227", label: "Algorithmic estimate", desc: "Price calculated by our algorithm. May not reflect current market." },
              { badge: "AI Score", color: "#818cf8", label: "AI-generated score", desc: "Score generated by algorithm. Not a financial recommendation." },
            ].map(item => (
              <div key={item.badge} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30`, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {item.badge}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SourceTable title="Price Data Sources" sources={SOURCES.prices} />
        <SourceTable title="Wine Ratings Sources" sources={SOURCES.ratings} />
        <SourceTable title="News Sources (RSS)" sources={SOURCES.news} />
        <SourceTable title="Supplementary Data Sources" sources={SOURCES.data} />

        {/* How AI Score works */}
        <div style={{ background: "rgba(11,18,32,0.9)", border: "1px solid rgba(30,41,59,0.6)", borderRadius: 16, padding: 28, marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>How the AI Score Works</h2>
          <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>The AI Score (0–100) is a composite metric calculated from:</p>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li><strong style={{ color: "#e2e8f0" }}>Vintage Quality (30%)</strong> — Climate data from Open-Meteo for the growing season</li>
              <li><strong style={{ color: "#e2e8f0" }}>Expert Ratings (25%)</strong> — Aggregated from Decanter, Wine Spectator, Parker, Vinous</li>
              <li><strong style={{ color: "#e2e8f0" }}>Price Trend (25%)</strong> — 12-month price momentum from CellarTracker / Wine-Searcher</li>
              <li><strong style={{ color: "#e2e8f0" }}>Liquidity (10%)</strong> — Number of active listings on Wine-Searcher</li>
              <li><strong style={{ color: "#e2e8f0" }}>Producer Reputation (10%)</strong> — Historical auction performance and critic consensus</li>
            </ul>
            <p style={{ marginTop: 16, padding: 12, background: "rgba(201,162,39,0.08)", borderRadius: 8, border: "1px solid rgba(201,162,39,0.15)", fontSize: 13 }}>
              ⚠️ The AI Score is for informational purposes only. It does not constitute financial or investment advice. Always consult a qualified advisor before making investment decisions.
            </p>
          </div>
        </div>

        {/* Disclaimers */}
        <div style={{ borderTop: "1px solid rgba(30,41,59,0.4)", paddingTop: 32 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Disclaimers</h2>
          {[
            { title: "Prices", text: "Prices shown are indicative and may differ from actual market prices. Always verify on the source platform before purchasing." },
            { title: "Returns", text: "Historical returns shown do not guarantee future results. Wine investment carries risk of total or partial capital loss." },
            { title: "AI Score", text: "The AI Score is generated by an algorithm and does not constitute investment advice or recommendations." },
            { title: "News", text: "News is aggregated from external RSS sources. VinoInvest is not responsible for third-party content." },
            { title: "Estimates", text: "Data marked 'Estimated' is algorithmic — not sourced from real market transactions." },
          ].map(d => (
            <div key={d.title} style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{d.title}: </span>
              <span style={{ color: "#94a3b8", fontSize: 14 }}>{d.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
