import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");

// ── Design tokens ─────────────────────────────────────────────────────────────
const DARK     = "#0B1220";
const GOLD     = "#C9A227";
const GRAY     = "#6B7280";
const LIGHT    = "#F8F9FA";
const WHITE    = "#FFFFFF";
const GREEN    = "#10B981";
const RED      = "#EF4444";
const BORDER   = "#E5E7EB";
const TEAL     = "#1E3A5F";

const PAGE_W = 595.28;       // A4 pts
const PAGE_H = 841.89;
const ML = 50;
const MR = 50;
const CONTENT_W = PAGE_W - ML - MR;

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n, decimals = 2) {
  return Number(n || 0).toLocaleString("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function pct(n, sign = false) {
  const v = (Number(n || 0) * 100).toFixed(1);
  return sign && n >= 0 ? `+${v}%` : `${v}%`;
}

function colHex(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function _sectionTitle(doc, text, y) {
  doc.fillColor(DARK).font("Helvetica-Bold").fontSize(12).text(text, ML, y);
  doc.rect(ML, y + 16, 32, 2).fill(GOLD);
}

function _footer(doc, pageNum, totalPages, orgName) {
  const fy = PAGE_H - 32;
  doc.rect(0, fy, PAGE_W, 32).fill(DARK);
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(8).text("VinoInvest", ML, fy + 10);
  doc.fillColor(WHITE).font("Helvetica").fontSize(7)
    .text("vinoinvest-platform.vercel.app", ML, fy + 20);
  if (orgName) {
    doc.fillColor(GRAY).font("Helvetica").fontSize(7)
      .text(`Prepared by ${orgName}`, 0, fy + 10, { width: PAGE_W - ML, align: "right" });
  }
  doc.fillColor(GRAY).font("Helvetica").fontSize(7)
    .text(`Page ${pageNum}${totalPages ? ` of ${totalPages}` : ""}`, 0, fy + 20, { width: PAGE_W - ML, align: "right" });
}

function _confidential(doc) {
  doc.save();
  doc.rotate(-45, { origin: [PAGE_W / 2, PAGE_H / 2] });
  doc.fillColor(BORDER).font("Helvetica-Bold").fontSize(60).opacity(0.06)
    .text("CONFIDENTIAL", 0, PAGE_H / 2 - 30, { align: "center", width: PAGE_W });
  doc.restore();
}

function _metricBox(doc, x, y, w, h, label, value, valueColor = DARK, sub = null) {
  doc.rect(x, y, w, h).fill(LIGHT);
  doc.fillColor(GRAY).font("Helvetica").fontSize(8).text(label, x + 8, y + 10, { width: w - 16, align: "center" });
  doc.fillColor(valueColor).font("Helvetica-Bold").fontSize(16)
    .text(value, x + 8, y + 24, { width: w - 16, align: "center" });
  if (sub) {
    doc.fillColor(GRAY).font("Helvetica").fontSize(7)
      .text(sub, x + 8, y + h - 14, { width: w - 16, align: "center" });
  }
}

function _sparkline(doc, x, y, w, h, values) {
  if (!values || values.length < 2) {
    doc.strokeColor(BORDER).lineWidth(0.5).moveTo(x, y + h / 2).lineTo(x + w, y + h / 2).stroke();
    return;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max === min ? 1 : max - min;
  const pts = values.map((v, i) => ({
    px: x + (i / (values.length - 1)) * w,
    py: y + h - ((v - min) / range) * h,
  }));
  const lastRoi = (values[values.length - 1] - values[0]) / (values[0] || 1);
  const lineColor = lastRoi >= 0 ? GREEN : RED;

  // Area fill
  doc.save();
  doc.moveTo(x, y + h);
  doc.lineTo(pts[0].px, pts[0].py);
  for (let i = 1; i < pts.length; i++) doc.lineTo(pts[i].px, pts[i].py);
  doc.lineTo(x + w, y + h).closePath();
  doc.fillOpacity(0.12).fillColor(lineColor).fill();
  doc.restore();

  // Line
  doc.save();
  doc.moveTo(pts[0].px, pts[0].py);
  for (let i = 1; i < pts.length; i++) doc.lineTo(pts[i].px, pts[i].py);
  doc.fillOpacity(1).strokeColor(lineColor).lineWidth(1.5).stroke();
  doc.restore();
}

function _riskGauge(doc, x, y, w, riskScore) {
  // Horizontal bar gauge: green → amber → red, with needle marker
  const h = 18;
  const segW = w / 3;

  // Segments
  [[GREEN, 0], ["#F59E0B", 1], [RED, 2]].forEach(([color, i]) => {
    doc.rect(x + i * segW, y, segW, h).fillOpacity(0.75).fillColor(color).fill();
  });
  doc.fillOpacity(1);

  // Border
  doc.rect(x, y, w, h).strokeColor(BORDER).lineWidth(0.5).stroke();

  // Needle
  const markerX = x + Math.min(0.99, Math.max(0.01, riskScore / 100)) * w;
  doc.moveTo(markerX, y - 7)
    .lineTo(markerX - 5, y - 1)
    .lineTo(markerX + 5, y - 1)
    .closePath()
    .fillColor(DARK).fill();
  doc.moveTo(markerX, y + h).lineTo(markerX, y + h + 4)
    .strokeColor(DARK).lineWidth(1.5).stroke();

  // Labels
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(6.5);
  doc.text("LOW",  x + 4,          y + 5, { width: segW - 8, align: "center" });
  doc.text("MED",  x + segW + 4,   y + 5, { width: segW - 8, align: "center" });
  doc.text("HIGH", x + segW*2 + 4, y + 5, { width: segW - 8, align: "center" });

  // Score badge
  const badgeColor = riskScore < 34 ? GREEN : riskScore < 67 ? "#F59E0B" : RED;
  doc.rect(x + w + 8, y, 42, h).fill(badgeColor);
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(13)
    .text(String(riskScore), x + w + 8, y + 1, { width: 42, align: "center" });
  doc.fillColor(GRAY).font("Helvetica").fontSize(6.5)
    .text("/ 100", x + w + 8, y + h + 3, { width: 42, align: "center" });
}

function _tableRow(doc, cols, y, rowH, isHeader = false, isEven = false) {
  if (isHeader) {
    doc.rect(ML, y, CONTENT_W, rowH).fill(DARK);
  } else {
    doc.rect(ML, y, CONTENT_W, rowH).fill(isEven ? WHITE : LIGHT);
  }
  let xOff = ML;
  for (const { text, width, align = "center", color, font } of cols) {
    const tColor = color || (isHeader ? WHITE : DARK);
    const tFont = font || (isHeader ? "Helvetica-Bold" : "Helvetica");
    doc.fillColor(tColor).font(tFont).fontSize(isHeader ? 8 : 7.5)
      .text(text, xOff + 4, y + (isHeader ? 6 : 5), { width: width - 8, align, ellipsis: true });
    xOff += width;
  }
}

// ── COVER PAGE ────────────────────────────────────────────────────────────────

function _drawCover(doc, { clientName, orgName, orgBrandColor, advisorName, reportTitle, generatedAt, reportType }) {
  const brandColor = orgBrandColor || TEAL;

  // Header band
  doc.rect(0, 0, PAGE_W, 260).fill(brandColor);

  // Gold accent line
  doc.rect(0, 260, PAGE_W, 3).fill(GOLD);

  // VinoInvest wordmark
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(36)
    .text("VinoInvest", 0, 55, { align: "center", width: PAGE_W });

  doc.fillColor(WHITE).font("Helvetica").fontSize(13)
    .text("Fine Wine Investment Intelligence", 0, 102, { align: "center", width: PAGE_W });

  // Separator
  doc.rect(PAGE_W / 2 - 30, 126, 60, 1).fill(GOLD);

  // Report type badge
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(11)
    .text(reportTitle || "PORTFOLIO REPORT", 0, 144, { align: "center", width: PAGE_W });

  // Logo placeholder for org
  const logoBoxX = ML;
  const logoBoxY = 290;
  doc.rect(logoBoxX, logoBoxY, 100, 50).fill(LIGHT);
  doc.rect(logoBoxX, logoBoxY, 100, 50).stroke(BORDER);
  doc.fillColor(GRAY).font("Helvetica").fontSize(7)
    .text(orgName || "Organization", logoBoxX, logoBoxY + 21, { width: 100, align: "center" });

  // Client details
  const detailsX = ML + 120;
  doc.fillColor(GRAY).font("Helvetica").fontSize(9).text("Client", detailsX, logoBoxY + 4);
  doc.fillColor(DARK).font("Helvetica-Bold").fontSize(13)
    .text(clientName || "—", detailsX, logoBoxY + 17, { width: CONTENT_W - 120 });

  if (advisorName) {
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
      .text(`Advisor: ${advisorName}`, detailsX, logoBoxY + 37);
  }

  // Date
  const dateStr = new Date(generatedAt || Date.now())
    .toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
  doc.fillColor(GRAY).font("Helvetica").fontSize(9)
    .text(`Report Date: ${dateStr}`, 0, logoBoxY + 72, { align: "right", width: PAGE_W - MR });

  // Confidential stamp
  doc.rect(ML, logoBoxY + 100, CONTENT_W, 1).fill(BORDER);
  doc.rect(ML, logoBoxY + 115, CONTENT_W, 22).fill("#FEF3C7");
  doc.fillColor("#92400E").font("Helvetica-Bold").fontSize(9)
    .text("STRICTLY CONFIDENTIAL — For the named recipient only. Not for redistribution.", ML + 8, logoBoxY + 122, { width: CONTENT_W - 16 });

  // Report type badge at bottom
  if (reportType) {
    doc.rect(ML, 500, CONTENT_W, 28).fill(LIGHT);
    doc.fillColor(brandColor).font("Helvetica-Bold").fontSize(10)
      .text(reportType, ML + 8, 510, { width: CONTENT_W - 16 });
  }
}

// ── MAIN EXPORT: generateClientReport ─────────────────────────────────────────

/**
 * @param {object} p
 * @param {object} p.client      — { name, email, kyc_status, notes }
 * @param {object} p.org         — { name, logo_url, brand_color }
 * @param {string} p.advisorName
 * @param {Array}  p.holdings    — [{ wine_name, vintage, quantity, buy_price, current_price, price_history: number[] }]
 * @param {object} p.risk        — computePortfolioRisk result
 * @param {object} p.benchmarks  — getBenchmarkData result
 * @param {object} p.compliance  — { suitability, auditLog, advisorNotes }
 * @returns {Promise<Buffer>}
 */
export async function generateClientReport({
  client,
  org,
  advisorName,
  holdings = [],
  risk = {},
  benchmarks = {},
  compliance = {},
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: ML, right: MR },
      bufferPages: true,
      autoFirstPage: false,
    });
    const chunks = [];
    doc.on("data", c => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const genAt = new Date().toISOString();
    let pageNum = 0;

    function newPage() {
      pageNum++;
      doc.addPage();
      _confidential(doc);
      return pageNum;
    }

    // ── Page 1: Cover ──────────────────────────────────────────────────────
    doc.addPage();
    pageNum = 1;
    _drawCover(doc, {
      clientName: client?.name || "—",
      orgName: org?.name,
      orgBrandColor: org?.brand_color,
      advisorName,
      reportTitle: "CLIENT PORTFOLIO REPORT",
      generatedAt: genAt,
      reportType: `AI Score • Risk Analytics • Benchmark Comparison • Compliance`,
    });
    _footer(doc, 1, null, org?.name);

    // ── Page 2: Executive Summary ──────────────────────────────────────────
    newPage();
    let y = 50;

    _sectionTitle(doc, "Executive Summary", y);
    y += 30;

    const totalValue = risk.totalValue || holdings.reduce((s, h) => s + (h.current_price || 0) * (h.quantity || 1), 0);
    const totalCost  = holdings.reduce((s, h) => s + (h.buy_price || 0) * (h.quantity || 1), 0);
    const portfolioROI = totalCost > 0 ? (totalValue - totalCost) / totalCost : 0;
    const annRet = risk.annualisedReturn || 0;
    const roiColor = portfolioROI >= 0 ? GREEN : RED;

    // Metric boxes row 1
    const boxH = 65;
    const boxW = CONTENT_W / 3;
    _metricBox(doc, ML,           y, boxW - 4, boxH, "Total Portfolio Value", `€ ${fmt(totalValue)}`, DARK);
    _metricBox(doc, ML + boxW,    y, boxW - 4, boxH, "Total ROI",             pct(portfolioROI, true), roiColor);
    _metricBox(doc, ML + boxW*2,  y, boxW - 4, boxH, "Annualised Return",     pct(annRet, true), annRet >= 0 ? GREEN : RED);
    y += boxH + 8;

    // Metric boxes row 2
    const sharpe = risk.sharpeRatio;
    const mdd    = risk.maxDrawdown;
    const vol    = risk.annualisedVolatility;
    _metricBox(doc, ML,           y, boxW - 4, boxH, "Sharpe Ratio",   sharpe != null ? fmt(sharpe, 2) : "—", sharpe != null && sharpe > 1 ? GREEN : sharpe != null && sharpe < 0 ? RED : DARK);
    _metricBox(doc, ML + boxW,    y, boxW - 4, boxH, "Max Drawdown",   mdd != null ? pct(mdd) : "—", mdd != null && mdd > 0.15 ? RED : DARK);
    _metricBox(doc, ML + boxW*2,  y, boxW - 4, boxH, "Volatility p.a.", vol != null ? pct(vol) : "—", DARK);
    y += boxH + 16;

    // Performance narrative
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 8;
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10).text("Performance Overview", ML, y);
    y += 16;

    const sp500Ret = benchmarks.sp500Return12m || 0.117;
    const vinoRet  = benchmarks.vinoInvestIndex || 0.148;
    const inflRet  = benchmarks.euInflation || 0.026;
    const vsInfl   = annRet - inflRet;
    const vsSP500  = annRet - sp500Ret;

    const narrative =
      `Portfolio managed for ${client?.name || "client"} by ${advisorName || org?.name || "advisor"}. ` +
      `Total AUM: €${fmt(totalValue)} across ${holdings.length} wine position${holdings.length !== 1 ? "s" : ""}. ` +
      `Portfolio ROI since inception: ${pct(portfolioROI, true)}. ` +
      `${annRet !== 0 ? `Annualised return of ${pct(annRet, true)} is ${vsSP500 >= 0 ? "+" : ""}${(vsSP500 * 100).toFixed(1)}pp vs S&P500 and ` +
      `${vsInfl >= 0 ? "+" : ""}${(vsInfl * 100).toFixed(1)}pp vs EU inflation. ` : ""}` +
      `Risk profile: ${risk.riskLabel || "—"} (score ${risk.riskScore ?? "—"}/100). ` +
      `KYC status: ${client?.kyc_status || "pending"}.`;

    doc.fillColor(GRAY).font("Helvetica").fontSize(9).text(narrative, ML, y, { width: CONTENT_W, lineGap: 2 });
    y = doc.y + 12;

    // Holdings summary table
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 8;
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10).text("Portfolio Composition", ML, y);
    y += 16;

    const topHoldings = [...holdings]
      .sort((a, b) => (b.current_price * b.quantity) - (a.current_price * a.quantity))
      .slice(0, 6);

    const summaryColW = [CONTENT_W * 0.38, CONTENT_W * 0.12, CONTENT_W * 0.15, CONTENT_W * 0.15, CONTENT_W * 0.1, CONTENT_W * 0.1];
    _tableRow(doc, [
      { text: "Wine",            width: summaryColW[0], align: "left" },
      { text: "Vintage",         width: summaryColW[1] },
      { text: "Cost",            width: summaryColW[2] },
      { text: "Current Value",   width: summaryColW[3] },
      { text: "ROI",             width: summaryColW[4] },
      { text: "Weight",          width: summaryColW[5] },
    ], y, 22, true);
    y += 22;

    topHoldings.forEach((h, idx) => {
      const cost = (h.buy_price || 0) * (h.quantity || 1);
      const curr = (h.current_price || 0) * (h.quantity || 1);
      const roi  = cost > 0 ? (curr - cost) / cost : 0;
      const wt   = totalValue > 0 ? curr / totalValue : 0;
      _tableRow(doc, [
        { text: h.wine_name || "—",    width: summaryColW[0], align: "left", color: DARK },
        { text: String(h.vintage || "—"), width: summaryColW[1], color: GRAY },
        { text: `€ ${fmt(cost, 0)}`,   width: summaryColW[2] },
        { text: `€ ${fmt(curr, 0)}`,   width: summaryColW[3] },
        { text: pct(roi, true),        width: summaryColW[4], color: roi >= 0 ? GREEN : RED },
        { text: pct(wt),               width: summaryColW[5], color: GRAY },
      ], y, 18, false, idx % 2 === 0);
      y += 18;
    });

    if (holdings.length > 6) {
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(7.5)
        .text(`+ ${holdings.length - 6} more position${holdings.length - 6 > 1 ? "s" : ""} — see full holdings page.`, ML, y + 4);
    }

    _footer(doc, pageNum, null, org?.name);

    // ── Page 3: Holdings with Sparklines ──────────────────────────────────
    newPage();
    y = 50;
    _sectionTitle(doc, "Holdings Detail — With Price Sparklines", y);
    y += 30;

    const colW = [CONTENT_W * 0.30, 45, 30, 62, 62, 45, 55, CONTENT_W * 0.15];
    _tableRow(doc, [
      { text: "Wine",            width: colW[0], align: "left" },
      { text: "Vintage",         width: colW[1] },
      { text: "Qty",             width: colW[2] },
      { text: "Buy Price",       width: colW[3] },
      { text: "Current",         width: colW[4] },
      { text: "ROI",             width: colW[5] },
      { text: "AI Score",        width: colW[6] },
      { text: "Sparkline",       width: colW[7] },
    ], y, 22, true);
    y += 22;

    holdings.forEach((h, idx) => {
      const rowH = 24;
      if (y + rowH > PAGE_H - 60) {
        _footer(doc, pageNum, null, org?.name);
        newPage();
        y = 50;
        _tableRow(doc, [
          { text: "Wine",       width: colW[0], align: "left" },
          { text: "Vintage",    width: colW[1] },
          { text: "Qty",        width: colW[2] },
          { text: "Buy Price",  width: colW[3] },
          { text: "Current",    width: colW[4] },
          { text: "ROI",        width: colW[5] },
          { text: "AI Score",   width: colW[6] },
          { text: "Sparkline",  width: colW[7] },
        ], y, 22, true);
        y += 22;
      }

      const cost = (h.buy_price || 0);
      const curr = (h.current_price || 0);
      const roi  = cost > 0 ? (curr - cost) / cost : 0;
      const isEven = idx % 2 === 0;

      doc.rect(ML, y, CONTENT_W, rowH).fill(isEven ? WHITE : LIGHT);
      let xOff = ML;
      const cells = [
        { text: h.wine_name || "—", w: colW[0], align: "left", color: DARK, font: "Helvetica-Bold" },
        { text: String(h.vintage || "—"), w: colW[1], align: "center", color: GRAY },
        { text: String(h.quantity || 1), w: colW[2], align: "center" },
        { text: `€ ${fmt(cost, 0)}`, w: colW[3], align: "center" },
        { text: `€ ${fmt(curr, 0)}`, w: colW[4], align: "center" },
        { text: pct(roi, true), w: colW[5], align: "center", color: roi >= 0 ? GREEN : RED },
        { text: String(h.ai_score ?? "—"), w: colW[6], align: "center", color: (h.ai_score || 0) >= 80 ? GREEN : DARK },
      ];
      cells.forEach(c => {
        doc.fillColor(c.color || DARK).font(c.font || "Helvetica").fontSize(7.5)
          .text(c.text, xOff + 3, y + 7, { width: c.w - 6, align: c.align, ellipsis: true });
        xOff += c.w;
      });

      // Sparkline
      const sparkH = rowH - 6;
      const sparkW = colW[7] - 10;
      const sparkX = xOff + 5;
      const sparkY = y + 3;
      const hist = h.price_history;
      _sparkline(doc, sparkX, sparkY, sparkW, sparkH, hist && hist.length >= 2 ? hist : null);
      y += rowH;
    });

    if (holdings.length === 0) {
      doc.rect(ML, y, CONTENT_W, 30).fill(LIGHT);
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(9)
        .text("No holdings found.", ML, y + 10, { width: CONTENT_W, align: "center" });
    }

    _footer(doc, pageNum, null, org?.name);

    // ── Page 4: Risk Analytics ─────────────────────────────────────────────
    newPage();
    y = 50;
    _sectionTitle(doc, "Risk Analytics", y);
    y += 30;

    // Risk gauge bar
    const gaugeW = CONTENT_W * 0.45;
    _riskGauge(doc, ML, y, gaugeW, risk.riskScore ?? 50);
    y += 38;

    // Risk metrics table (full width)
    const riskTableX = ML;
    const riskTableW = CONTENT_W;
    const metricsRows = [
      ["Metric",              "Value",            "Interpretation",          ""],
      ["Volatility p.a.",     vol != null ? pct(vol) : "—",       vol != null ? (vol < 0.1 ? "Low" : vol < 0.2 ? "Moderate" : "High") : "—", ""],
      ["Sharpe Ratio",        sharpe != null ? fmt(sharpe) : "—", sharpe != null ? (sharpe > 1.5 ? "Excellent" : sharpe > 1 ? "Good" : sharpe > 0 ? "Acceptable" : "Poor") : "—", ""],
      ["Max Drawdown",        mdd != null ? pct(mdd) : "—",      mdd != null ? (mdd < 0.05 ? "Low" : mdd < 0.15 ? "Moderate" : "High") : "—", ""],
      ["VaR 95% (1 month)",   risk.var95 != null ? `€ ${fmt(risk.var95, 0)}` : "—", "Monthly worst-case loss",     ""],
      ["Beta vs Index",       risk.beta != null ? fmt(risk.beta) : "—",  risk.beta != null ? (risk.beta < 0.8 ? "Defensive" : risk.beta < 1.2 ? "Market" : "Aggressive") : "—", ""],
      ["Concentration (HHI)", risk.concentrationRisk != null ? fmt(risk.concentrationRisk, 3) : "—", risk.concentrationRisk != null ? (risk.concentrationRisk < 0.15 ? "Diversified" : risk.concentrationRisk < 0.25 ? "Moderate" : "Concentrated") : "—", ""],
    ];

    const rcW = [riskTableW * 0.35, riskTableW * 0.22, riskTableW * 0.28, riskTableW * 0.15];
    let ry = y;
    metricsRows.forEach((row, ri) => {
      const isH = ri === 0;
      doc.rect(riskTableX, ry, riskTableW, 20).fill(isH ? DARK : ri % 2 === 0 ? LIGHT : WHITE);
      let rx = riskTableX;
      row.forEach((cell, ci) => {
        doc.fillColor(isH ? WHITE : ci === 1 ? DARK : GRAY)
          .font(isH || ci === 0 ? "Helvetica-Bold" : "Helvetica")
          .fontSize(isH ? 8 : 7.5)
          .text(cell, rx + 4, ry + 5, { width: rcW[ci] - 8, align: ci === 0 ? "left" : "center" });
        rx += rcW[ci];
      });
      ry += 20;
    });

    y = ry + 10;

    // Benchmark comparison
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 10;
    _sectionTitle(doc, "Benchmark Comparison (12-month Returns)", y);
    y += 28;

    const bmHeaders = ["Asset Class",    "12m Return",   "Volatility p.a.", "Source"];
    const bmColW    = [CONTENT_W * 0.35, CONTENT_W * 0.2, CONTENT_W * 0.25, CONTENT_W * 0.2];
    const bmRows    = [
      ["This Portfolio",          annRet,               vol ?? 0,                    "VinoInvest"],
      ["VinoInvest Index (VII)",  vinoRet,              0.12,                        "VinoInvest"],
      ["S&P 500",                 sp500Ret,             benchmarks.sp500Vol ?? 0.165,"FRED"],
      ["Gold (XAU/USD)",          benchmarks.goldReturn12m ?? 0.082, benchmarks.goldVol ?? 0.142, "FRED"],
      ["EU Inflation (HICP)",     inflRet,              null,                        "ECB"],
    ];

    doc.rect(ML, y, CONTENT_W, 20).fill(DARK);
    let bx = ML;
    bmHeaders.forEach((h2, i) => {
      doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(8)
        .text(h2, bx + 4, y + 5, { width: bmColW[i] - 8, align: i === 0 ? "left" : "center" });
      bx += bmColW[i];
    });
    y += 20;

    bmRows.forEach((row, ri) => {
      const [name, ret, vol2, src] = row;
      doc.rect(ML, y, CONTENT_W, 20).fill(ri % 2 === 0 ? LIGHT : WHITE);
      // Highlight "This Portfolio" row
      if (ri === 0) doc.rect(ML, y, 3, 20).fill(GOLD);
      bx = ML;
      const retStr   = ret !== null  ? pct(ret, true) : "—";
      const volStr   = vol2 !== null ? pct(vol2) : "—";
      const retColor = ret !== null  ? (ret >= 0 ? GREEN : RED) : GRAY;
      [
        { text: name,   align: "left", color: ri === 0 ? DARK : DARK, font: ri === 0 ? "Helvetica-Bold" : "Helvetica" },
        { text: retStr, align: "center", color: retColor },
        { text: volStr, align: "center", color: GRAY },
        { text: String(src), align: "center", color: GRAY },
      ].forEach((c, ci) => {
        doc.fillColor(c.color).font(c.font || "Helvetica").fontSize(7.5)
          .text(c.text, bx + (ci === 0 ? 7 : 4), y + 5, { width: bmColW[ci] - 8, align: c.align });
        bx += bmColW[ci];
      });
      y += 20;
    });

    y += 8;
    doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(7)
      .text("* Past performance does not guarantee future results. Benchmark data: FRED St. Louis Fed, ECB. " +
        (benchmarks.source === "FRED" ? `Live data fetched ${new Date(benchmarks.fetchedAt).toLocaleDateString()}.` : "Fallback to long-run averages."),
        ML, y, { width: CONTENT_W });

    _footer(doc, pageNum, null, org?.name);

    // ── Page 5: Compliance ─────────────────────────────────────────────────
    newPage();
    y = 50;
    _sectionTitle(doc, "Compliance & Suitability", y);
    y += 30;

    // Suitability assessment
    const suit = compliance?.suitability;
    if (suit) {
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10).text("Suitability Assessment", ML, y);
      y += 18;

      const suitFields = [
        ["Risk Tolerance",      suit.risk_tolerance || "—"],
        ["Investment Horizon",  suit.investment_horizon ? `${suit.investment_horizon} years` : "—"],
        ["Experience Level",    suit.experience_level || "—"],
        ["Total AUM",           suit.aum_total ? `€ ${fmt(suit.aum_total, 0)}` : "—"],
        ["Wine Allocation",     suit.wine_allocation_pct ? `${Number(suit.wine_allocation_pct).toFixed(1)}%` : "—"],
        ["KYC Status",          client?.kyc_status || "pending"],
        ["Digitally Signed",    suit.signed_at ? new Date(suit.signed_at).toLocaleDateString() : "Not signed"],
        ["Advisor",             advisorName || "—"],
      ];

      const sfW = CONTENT_W / 2 - 4;
      suitFields.forEach(([label, value], i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const sx = ML + col * (sfW + 8);
        const sy = y + row * 20;
        doc.rect(sx, sy, sfW, 18).fill(i % 4 < 2 ? LIGHT : WHITE);
        doc.fillColor(GRAY).font("Helvetica").fontSize(7.5).text(label + ":", sx + 6, sy + 4);
        doc.fillColor(DARK).font("Helvetica-Bold").fontSize(7.5)
          .text(value, sx + 100, sy + 4, { width: sfW - 110 });
      });
      y += Math.ceil(suitFields.length / 2) * 20 + 12;

      if (suit.signature_data) {
        doc.rect(ML, y, CONTENT_W, 26).fill(LIGHT);
        doc.fillColor(GRAY).font("Helvetica").fontSize(7)
          .text("Digital signature present — stored securely.", ML + 8, y + 9, { width: CONTENT_W - 16 });
        doc.rect(ML + CONTENT_W - 80, y + 4, 72, 18).fill(GREEN);
        doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(8)
          .text("✓ SIGNED", ML + CONTENT_W - 76, y + 8, { width: 68, align: "center" });
        y += 34;
      }
    } else {
      doc.rect(ML, y, CONTENT_W, 24).fill(LIGHT);
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(9)
        .text("No suitability assessment on file.", ML, y + 7, { width: CONTENT_W, align: "center" });
      y += 32;
    }

    // Recommendation / Advisor Notes
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 10;
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10).text("Recommendation Log (Advisor Notes)", ML, y);
    y += 18;

    const notes = compliance?.advisorNotes || [];
    if (notes.length > 0) {
      const colNW = [CONTENT_W * 0.2, CONTENT_W * 0.65, CONTENT_W * 0.15];
      doc.rect(ML, y, CONTENT_W, 18).fill(DARK);
      ["Date", "Note", "Privacy"].forEach((h3, i) => {
        doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(7.5)
          .text(h3, ML + colNW.slice(0, i).reduce((a, b) => a + b, 0) + 4, y + 4, { width: colNW[i] - 8 });
      });
      y += 18;

      notes.slice(0, 8).forEach((note, ni) => {
        const rowH2 = 22;
        if (y + rowH2 > PAGE_H - 60) {
          _footer(doc, pageNum, null, org?.name);
          newPage();
          y = 50;
        }
        doc.rect(ML, y, CONTENT_W, rowH2).fill(ni % 2 === 0 ? LIGHT : WHITE);
        const dateStr2 = new Date(note.created_at).toLocaleDateString("en-GB");
        [dateStr2, note.note || "—", note.is_private ? "Private" : "Shared"].forEach((cell, ci) => {
          const cx2 = ML + colNW.slice(0, ci).reduce((a, b) => a + b, 0) + 4;
          doc.fillColor(ci === 2 ? (note.is_private ? "#92400E" : GREEN) : DARK)
            .font("Helvetica").fontSize(7.5)
            .text(cell, cx2, y + 7, { width: colNW[ci] - 8, ellipsis: true });
        });
        y += rowH2;
      });
      if (notes.length > 8) {
        doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(7)
          .text(`+ ${notes.length - 8} additional notes in full audit export.`, ML, y + 4);
        y += 16;
      }
    } else {
      doc.rect(ML, y, CONTENT_W, 22).fill(LIGHT);
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(9)
        .text("No advisor notes recorded.", ML, y + 7, { width: CONTENT_W, align: "center" });
      y += 30;
    }

    // Audit Trail
    y += 4;
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 10;
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10).text("Audit Trail", ML, y);
    y += 18;

    const auditRows = compliance?.auditLog || [];
    if (auditRows.length > 0) {
      const auditColW = [CONTENT_W * 0.22, CONTENT_W * 0.28, CONTENT_W * 0.3, CONTENT_W * 0.2];
      doc.rect(ML, y, CONTENT_W, 18).fill(DARK);
      ["Timestamp", "Action", "Resource", "User"].forEach((h4, i) => {
        doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(7)
          .text(h4, ML + auditColW.slice(0, i).reduce((a, b) => a + b, 0) + 4, y + 4, { width: auditColW[i] - 8 });
      });
      y += 18;

      auditRows.slice(0, 10).forEach((entry, ei) => {
        const rowH3 = 18;
        if (y + rowH3 > PAGE_H - 60) return; // skip overflow
        doc.rect(ML, y, CONTENT_W, rowH3).fill(ei % 2 === 0 ? LIGHT : WHITE);
        const ts = new Date(entry.ts).toLocaleString("en-GB");
        [ts, entry.action || "—", entry.resource || "—", (entry.user_id || "—").slice(0, 12)].forEach((cell, ci) => {
          const cx3 = ML + auditColW.slice(0, ci).reduce((a, b) => a + b, 0) + 4;
          doc.fillColor(GRAY).font("Helvetica").fontSize(6.5)
            .text(cell, cx3, y + 5, { width: auditColW[ci] - 8, ellipsis: true });
        });
        y += rowH3;
      });

      if (auditRows.length > 10) {
        doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(7)
          .text(`Full audit trail (${auditRows.length} entries) available via CSV export.`, ML, y + 4);
      }
    } else {
      doc.rect(ML, y, CONTENT_W, 22).fill(LIGHT);
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(9)
        .text("No audit entries found.", ML, y + 7, { width: CONTENT_W, align: "center" });
    }

    _footer(doc, pageNum, null, org?.name);

    // ── Last Page: Legal Disclaimer ────────────────────────────────────────
    newPage();
    y = 50;

    doc.rect(ML, y, CONTENT_W, 2).fill(GOLD);
    y += 12;
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(13).text("Important Disclosures", ML, y);
    y += 22;

    const disclaimers = [
      {
        title: "Investment Risk Warning",
        body: "This document is for informational purposes only and does not constitute investment advice, a solicitation, or an offer to buy or sell any financial instrument. Investing in fine wine carries significant risks, including the possible loss of part or all of the capital invested. Past performance is not indicative of future results. Wine valuations are inherently subjective and illiquid."
      },
      {
        title: "Regulatory Status",
        body: "VinoInvest is a data and analytics platform. It is not a regulated investment firm, broker, or financial advisor. This report has been prepared by the named organization acting in its professional capacity. Users should seek independent regulated financial advice before making investment decisions."
      },
      {
        title: "Data Sources & Accuracy",
        body: `Market data sourced from Liv-ex (estimated), CellarTracker, Wine-Searcher, and VinoInvest proprietary algorithms. Benchmark data from FRED (St. Louis Fed) and ECB. ${benchmarks.source === "FRED" ? `Benchmark data last updated ${new Date(benchmarks.fetchedAt).toLocaleDateString()}.` : "Benchmark figures are long-run historical averages."} VinoInvest does not guarantee the accuracy or completeness of this data.`
      },
      {
        title: "Confidentiality",
        body: "This document is strictly confidential and intended solely for the named recipient. Reproduction, distribution, or transmission of this document, in whole or in part, without the express written consent of the preparing organisation is prohibited."
      },
    ];

    for (const d of disclaimers) {
      if (y > PAGE_H - 100) { _footer(doc, pageNum, null, org?.name); newPage(); y = 50; }
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(9).text(d.title, ML, y);
      y += 14;
      doc.fillColor(GRAY).font("Helvetica").fontSize(8)
        .text(d.body, ML, y, { width: CONTENT_W, align: "justify", lineGap: 1 });
      y = doc.y + 12;
    }

    // Final report footer
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 10;
    doc.fillColor(GRAY).font("Helvetica").fontSize(7.5)
      .text(`Report generated: ${new Date(genAt).toLocaleString("en-GB")} | VinoInvest v1.0 | ${org?.name || "VinoInvest"}`, ML, y, { width: CONTENT_W });

    _footer(doc, pageNum, null, org?.name);

    doc.end();
  });
}

// ── generateOrgReport ─────────────────────────────────────────────────────────

/**
 * Aggregate report for an entire organization.
 * @param {object} p
 * @param {object} p.org      — { name, brand_color }
 * @param {Array}  p.clients  — client_portfolios rows
 * @param {object} p.benchmarks
 * @param {Array}  p.auditLog — recent org-level audit entries
 * @returns {Promise<Buffer>}
 */
export async function generateOrgReport({ org, clients = [], benchmarks = {}, auditLog = [] }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: ML, right: MR },
      bufferPages: true,
      autoFirstPage: false,
    });
    const chunks = [];
    doc.on("data", c => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const genAt = new Date().toISOString();
    let pageNum = 0;

    function newPage() {
      pageNum++;
      doc.addPage();
      _confidential(doc);
      return pageNum;
    }

    // ── Cover ──────────────────────────────────────────────────────────────
    doc.addPage();
    pageNum = 1;
    _drawCover(doc, {
      clientName: org?.name || "Organization",
      orgName: org?.name,
      orgBrandColor: org?.brand_color,
      advisorName: null,
      reportTitle: "ORGANIZATION AGGREGATE REPORT",
      generatedAt: genAt,
      reportType: `AUM Overview • ${clients.length} Clients • Benchmark Comparison • Audit Trail`,
    });
    _footer(doc, 1, null, org?.name);

    // ── Page 2: Aggregate Summary ──────────────────────────────────────────
    newPage();
    let y = 50;
    _sectionTitle(doc, "Organization Overview", y);
    y += 30;

    const totalAUM = clients.reduce((s, c) => s + Number(c.aum_wine || 0), 0);
    const activeClients  = clients.filter(c => c.kyc_status !== "rejected").length;
    const kycApproved    = clients.filter(c => c.kyc_status === "approved").length;
    const avgAUM = clients.length > 0 ? totalAUM / clients.length : 0;

    const boxH2 = 65;
    const bW2 = CONTENT_W / 4;
    _metricBox(doc, ML,         y, bW2 - 4, boxH2, "Total AUM",       `€ ${fmt(totalAUM, 0)}`, DARK);
    _metricBox(doc, ML + bW2,   y, bW2 - 4, boxH2, "Total Clients",   String(clients.length), DARK);
    _metricBox(doc, ML + bW2*2, y, bW2 - 4, boxH2, "KYC Approved",    `${kycApproved}/${clients.length}`, kycApproved === clients.length ? GREEN : "#F59E0B");
    _metricBox(doc, ML + bW2*3, y, bW2 - 4, boxH2, "Avg AUM/Client",  `€ ${fmt(avgAUM, 0)}`, DARK);
    y += boxH2 + 20;

    // Client table
    _sectionTitle(doc, "Client Portfolio Summary", y);
    y += 28;

    const clW = [CONTENT_W * 0.30, CONTENT_W * 0.22, CONTENT_W * 0.15, CONTENT_W * 0.15, CONTENT_W * 0.18];
    _tableRow(doc, [
      { text: "Client",         width: clW[0], align: "left" },
      { text: "Email",          width: clW[1] },
      { text: "AUM (Wine)",     width: clW[2] },
      { text: "KYC Status",     width: clW[3] },
      { text: "Next Review",    width: clW[4] },
    ], y, 22, true);
    y += 22;

    clients.forEach((c, ci) => {
      if (y + 18 > PAGE_H - 60) {
        _footer(doc, pageNum, null, org?.name);
        newPage();
        y = 50;
        _tableRow(doc, [
          { text: "Client",     width: clW[0], align: "left" },
          { text: "Email",      width: clW[1] },
          { text: "AUM",        width: clW[2] },
          { text: "KYC",        width: clW[3] },
          { text: "Next Review",width: clW[4] },
        ], y, 22, true);
        y += 22;
      }

      const kyc = c.kyc_status || "pending";
      const kycColor = kyc === "approved" ? GREEN : kyc === "rejected" ? RED : "#F59E0B";
      const nextRev = c.next_review ? new Date(c.next_review).toLocaleDateString("en-GB") : "—";

      _tableRow(doc, [
        { text: c.client_name || "—",  width: clW[0], align: "left", color: DARK, font: "Helvetica-Bold" },
        { text: c.client_email || "—", width: clW[1], color: GRAY },
        { text: `€ ${fmt(c.aum_wine || 0, 0)}`, width: clW[2] },
        { text: kyc.toUpperCase(),     width: clW[3], color: kycColor },
        { text: nextRev,               width: clW[4], color: GRAY },
      ], y, 18, false, ci % 2 === 0);
      y += 18;
    });

    y += 16;

    // Benchmark section
    doc.rect(ML, y, CONTENT_W, 1).fill(BORDER);
    y += 10;
    _sectionTitle(doc, "Market Benchmarks (12-month)", y);
    y += 28;

    const sp500Ret2 = benchmarks.sp500Return12m || 0.117;
    const goldRet2  = benchmarks.goldReturn12m || 0.082;
    const infl2     = benchmarks.euInflation || 0.026;
    const vino2     = benchmarks.vinoInvestIndex || 0.148;

    const bmData = [
      { name: "VinoInvest Index (VII)", ret: vino2,    vol: 0.12,                    src: "VinoInvest", highlight: true },
      { name: "S&P 500",               ret: sp500Ret2, vol: benchmarks.sp500Vol || 0.165, src: "FRED" },
      { name: "Gold (XAU/USD)",        ret: goldRet2,  vol: benchmarks.goldVol || 0.142,  src: "FRED" },
      { name: "EU Inflation (HICP)",   ret: infl2,     vol: null,                    src: "ECB" },
    ];

    const bm2ColW = [CONTENT_W * 0.40, CONTENT_W * 0.18, CONTENT_W * 0.22, CONTENT_W * 0.20];
    doc.rect(ML, y, CONTENT_W, 20).fill(DARK);
    let bx2 = ML;
    ["Asset Class", "12m Return", "Volatility", "Source"].forEach((h5, i) => {
      doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(8)
        .text(h5, bx2 + 4, y + 5, { width: bm2ColW[i] - 8, align: i === 0 ? "left" : "center" });
      bx2 += bm2ColW[i];
    });
    y += 20;

    bmData.forEach((bm, bi) => {
      doc.rect(ML, y, CONTENT_W, 20).fill(bi % 2 === 0 ? LIGHT : WHITE);
      if (bm.highlight) doc.rect(ML, y, 3, 20).fill(GOLD);
      bx2 = ML;
      [
        { text: bm.name,                 align: "left",   color: DARK, font: bm.highlight ? "Helvetica-Bold" : "Helvetica" },
        { text: pct(bm.ret, true),       align: "center", color: bm.ret >= 0 ? GREEN : RED },
        { text: bm.vol != null ? pct(bm.vol) : "—", align: "center", color: GRAY },
        { text: bm.src,                  align: "center", color: GRAY },
      ].forEach((c, ci) => {
        doc.fillColor(c.color).font(c.font || "Helvetica").fontSize(7.5)
          .text(c.text, bx2 + (ci === 0 ? 7 : 4), y + 5, { width: bm2ColW[ci] - 8, align: c.align });
        bx2 += bm2ColW[ci];
      });
      y += 20;
    });

    y += 8;
    doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(7)
      .text(`Benchmark data: ${benchmarks.source === "FRED" ? `FRED St. Louis Fed (${new Date(benchmarks.fetchedAt).toLocaleDateString()})` : "long-run historical averages"}. Past performance does not guarantee future results.`,
        ML, y, { width: CONTENT_W });

    _footer(doc, pageNum, null, org?.name);

    // ── Page 3: Audit Log ──────────────────────────────────────────────────
    newPage();
    y = 50;
    _sectionTitle(doc, "Organization Audit Trail", y);
    y += 28;

    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
      .text(`Total audit entries: ${auditLog.length}. Showing most recent 30.`, ML, y);
    y += 16;

    const auColW = [CONTENT_W * 0.22, CONTENT_W * 0.25, CONTENT_W * 0.28, CONTENT_W * 0.25];
    doc.rect(ML, y, CONTENT_W, 20).fill(DARK);
    let ax = ML;
    ["Timestamp", "Action", "Resource", "User / IP"].forEach((h6, i) => {
      doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(7.5)
        .text(h6, ax + 4, y + 5, { width: auColW[i] - 8 });
      ax += auColW[i];
    });
    y += 20;

    auditLog.slice(0, 30).forEach((entry, ei) => {
      if (y + 16 > PAGE_H - 60) {
        _footer(doc, pageNum, null, org?.name);
        newPage();
        y = 50;
      }
      doc.rect(ML, y, CONTENT_W, 16).fill(ei % 2 === 0 ? LIGHT : WHITE);
      ax = ML;
      const ts2 = new Date(entry.ts).toLocaleString("en-GB");
      [ts2, entry.action || "—", entry.resource || "—", `${(entry.user_id || "—").slice(0, 12)} ${entry.ip ? `/ ${entry.ip}` : ""}`.trim()]
        .forEach((cell, ci) => {
          doc.fillColor(GRAY).font("Helvetica").fontSize(6.5)
            .text(cell, ax + 4, y + 4, { width: auColW[ci] - 8, ellipsis: true });
          ax += auColW[ci];
        });
      y += 16;
    });

    y += 12;

    // Disclaimer
    doc.rect(ML, y, CONTENT_W, 1).fill(GOLD);
    y += 10;
    doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(7.5)
      .text("This document is strictly confidential. It is for the named organization only. " +
        "Not for redistribution. VinoInvest is a data platform, not a regulated investment advisor. " +
        `Report generated: ${new Date(genAt).toLocaleString("en-GB")}.`,
        ML, y, { width: CONTENT_W, align: "justify" });

    _footer(doc, pageNum, null, org?.name);
    doc.end();
  });
}

// ── Backward-compatible export (original simple report) ───────────────────────

export async function generatePortfolioReport(userId, portfolioData) {
  const { holdings = [], totalValue = 0, roi = 0 } = portfolioData;

  const syntheticHoldings = holdings.map(h => ({
    wine_name: h.wine_name,
    vintage: h.vintage,
    quantity: h.quantity,
    buy_price: h.buy_price,
    current_price: h.current_price,
    price_history: null,
    ai_score: null,
  }));

  return generateClientReport({
    client: { name: `User ${userId}`, kyc_status: "n/a" },
    org: { name: "VinoInvest", brand_color: TEAL },
    advisorName: "VinoInvest Platform",
    holdings: syntheticHoldings,
    risk: {
      totalValue,
      annualisedReturn: roi / 100,
      riskScore: 45,
      riskLabel: "Medio",
    },
    benchmarks: { sp500Return12m: 0.117, goldReturn12m: 0.082, euInflation: 0.026, vinoInvestIndex: 0.148, source: "fallback" },
    compliance: {},
  });
}
