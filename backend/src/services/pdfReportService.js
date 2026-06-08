import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");

// Colors
const GOLD = "#C9A227";
const DARK = "#1A1A2E";
const GRAY = "#666666";
const LIGHT_GRAY = "#F5F5F5";
const WHITE = "#FFFFFF";
const GREEN = "#27AE60";
const RED = "#E74C3C";

/**
 * Generate a PDF portfolio report for a given user.
 *
 * @param {string} userId
 * @param {{ userId: string, holdings: Array<{ wine_name: string, vintage: string|number, quantity: number, buy_price: number, current_price: number }>, totalValue: number, roi: number, generatedAt: string }} portfolioData
 * @returns {Promise<Buffer>}
 */
export async function generatePortfolioReport(userId, portfolioData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margins: { top: 50, bottom: 50, left: 50, right: 50 } });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const PAGE_W = doc.page.width;
    const CONTENT_W = PAGE_W - 100; // margins 50px each side

    // ─── COVER PAGE ──────────────────────────────────────────────────────────
    // Dark background header band
    doc.rect(0, 0, PAGE_W, 220).fill(DARK);

    // Decorative gold bar
    doc.rect(0, 220, PAGE_W, 4).fill(GOLD);

    // VinoInvest title
    doc.fillColor(GOLD)
      .font("Helvetica-Bold")
      .fontSize(42)
      .text("VinoInvest", 50, 60, { align: "center" });

    // Subtitle
    doc.fillColor(WHITE)
      .font("Helvetica")
      .fontSize(16)
      .text("Portfolio Report", 50, 115, { align: "center" });

    // Tagline
    doc.fillColor(GOLD)
      .font("Helvetica-Oblique")
      .fontSize(11)
      .text("Fine Wine Investment Intelligence", 50, 145, { align: "center" });

    // Date and user info
    const dateStr = portfolioData.generatedAt
      ? new Date(portfolioData.generatedAt).toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })
      : new Date().toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" });

    doc.fillColor(GRAY)
      .font("Helvetica")
      .fontSize(10)
      .text(`Generato il: ${dateStr}`, 50, 240, { align: "right" });

    doc.fillColor(DARK)
      .font("Helvetica")
      .fontSize(10)
      .text(`Utente: ${portfolioData.userId || userId}`, 50, 258, { align: "right" });

    // ─── EXECUTIVE SUMMARY ───────────────────────────────────────────────────
    doc.moveDown(3);
    const summaryTop = 300;

    // Section title
    _sectionTitle(doc, "Sommario Esecutivo", summaryTop);

    // Summary box
    const boxTop = summaryTop + 28;
    doc.rect(50, boxTop, CONTENT_W, 100).fill(LIGHT_GRAY);

    const totalValue = portfolioData.totalValue || 0;
    const roi = portfolioData.roi || 0;
    const roiColor = roi >= 0 ? GREEN : RED;
    const roiSign = roi >= 0 ? "+" : "";
    const sp500 = -1; // benchmark placeholder

    // Metric blocks inside the summary box
    const metrics = [
      { label: "Valore Totale Portfolio", value: `€ ${_formatNum(totalValue)}`, color: DARK },
      { label: "ROI Periodo", value: `${roiSign}${roi.toFixed(2)}%`, color: roiColor },
      { label: "Benchmark S&P500 (YTD)", value: `${sp500}%`, color: RED },
    ];

    const colW = CONTENT_W / metrics.length;
    metrics.forEach((m, i) => {
      const x = 50 + i * colW;
      doc.fillColor(GRAY).font("Helvetica").fontSize(9).text(m.label, x + 10, boxTop + 14, { width: colW - 20, align: "center" });
      doc.fillColor(m.color).font("Helvetica-Bold").fontSize(18).text(m.value, x + 10, boxTop + 32, { width: colW - 20, align: "center" });
    });

    // Note on period
    doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(8)
      .text("* ROI calcolato dal prezzo di acquisto al prezzo corrente di mercato.", 50, boxTop + 78, { width: CONTENT_W });

    // ─── PORTFOLIO HOLDINGS TABLE ─────────────────────────────────────────────
    const tableTop = boxTop + 120;
    _sectionTitle(doc, "Posizioni in Portfolio", tableTop);

    const headers = ["Vino", "Annata", "Qtà", "Prezzo Acq.", "Prezzo Att.", "ROI%"];
    const colWidths = [Math.round(CONTENT_W * 0.32), 55, 35, 75, 75, 55];
    const tableDataTop = tableTop + 28;

    // Table header
    doc.rect(50, tableDataTop, CONTENT_W, 22).fill(DARK);
    let xPos = 50;
    headers.forEach((h, i) => {
      doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(9)
        .text(h, xPos + 4, tableDataTop + 6, { width: colWidths[i] - 4, align: i === 0 ? "left" : "center" });
      xPos += colWidths[i];
    });

    // Table rows
    const holdings = Array.isArray(portfolioData.holdings) ? portfolioData.holdings : [];
    let rowTop = tableDataTop + 22;

    holdings.forEach((h, idx) => {
      const isEven = idx % 2 === 0;
      doc.rect(50, rowTop, CONTENT_W, 20).fill(isEven ? WHITE : "#F0F0F0");

      const rowRoi = h.buy_price > 0
        ? ((h.current_price - h.buy_price) / h.buy_price) * 100
        : 0;
      const rowRoiStr = (rowRoi >= 0 ? "+" : "") + rowRoi.toFixed(1) + "%";
      const rowRoiColor = rowRoi >= 0 ? GREEN : RED;

      const cells = [
        { val: h.wine_name || "—", align: "left", color: DARK },
        { val: String(h.vintage || "—"), align: "center", color: GRAY },
        { val: String(h.quantity || 0), align: "center", color: DARK },
        { val: `€ ${_formatNum(h.buy_price || 0)}`, align: "center", color: DARK },
        { val: `€ ${_formatNum(h.current_price || 0)}`, align: "center", color: DARK },
        { val: rowRoiStr, align: "center", color: rowRoiColor },
      ];

      xPos = 50;
      cells.forEach((c, i) => {
        doc.fillColor(c.color).font("Helvetica").fontSize(8)
          .text(c.val, xPos + 4, rowTop + 5, { width: colWidths[i] - 8, align: c.align });
        xPos += colWidths[i];
      });

      rowTop += 20;

      // Add new page if we're running out of space
      if (rowTop > doc.page.height - 150) {
        doc.addPage();
        rowTop = 60;
      }
    });

    if (holdings.length === 0) {
      doc.rect(50, rowTop, CONTENT_W, 30).fill(LIGHT_GRAY);
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(10)
        .text("Nessuna posizione disponibile.", 50, rowTop + 9, { width: CONTENT_W, align: "center" });
      rowTop += 30;
    }

    // ─── RECOMMENDATIONS ─────────────────────────────────────────────────────
    // Ensure we have enough space; add page if needed
    if (rowTop > doc.page.height - 230) {
      doc.addPage();
      rowTop = 50;
    }

    const recTop = rowTop + 20;
    _sectionTitle(doc, "Raccomandazioni", recTop);

    // Top 3 da vendere
    const sellTop = recTop + 28;
    doc.rect(50, sellTop, CONTENT_W / 2 - 8, 22).fill(RED);
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(10)
      .text("Top 3 da Vendere", 54, sellTop + 6, { width: CONTENT_W / 2 - 16 });

    const sellHoldings = [...holdings]
      .filter(h => h.buy_price > 0)
      .map(h => ({ ...h, roi: ((h.current_price - h.buy_price) / h.buy_price) * 100 }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 3);

    let sellY = sellTop + 26;
    if (sellHoldings.length === 0) {
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(9)
        .text("Dati insufficienti.", 54, sellY + 4, { width: CONTENT_W / 2 - 16 });
      sellY += 20;
    } else {
      sellHoldings.forEach((h, i) => {
        doc.fillColor(DARK).font("Helvetica").fontSize(9)
          .text(`${i + 1}. ${h.wine_name} (+${h.roi.toFixed(1)}%)`, 54, sellY, { width: CONTENT_W / 2 - 16 });
        sellY += 16;
      });
    }

    // Top 3 opportunità
    const buyX = 50 + CONTENT_W / 2 + 8;
    doc.rect(buyX, sellTop, CONTENT_W / 2 - 8, 22).fill(GREEN);
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(10)
      .text("Top 3 Opportunità", buyX + 4, sellTop + 6, { width: CONTENT_W / 2 - 16 });

    const buyHoldings = [...holdings]
      .filter(h => h.buy_price > 0)
      .map(h => ({ ...h, roi: ((h.current_price - h.buy_price) / h.buy_price) * 100 }))
      .sort((a, b) => a.roi - b.roi)
      .slice(0, 3);

    let buyY = sellTop + 26;
    if (buyHoldings.length === 0) {
      doc.fillColor(GRAY).font("Helvetica-Oblique").fontSize(9)
        .text("Dati insufficienti.", buyX + 4, buyY + 4, { width: CONTENT_W / 2 - 16 });
      buyY += 20;
    } else {
      buyHoldings.forEach((h, i) => {
        doc.fillColor(DARK).font("Helvetica").fontSize(9)
          .text(`${i + 1}. ${h.wine_name} (${h.roi.toFixed(1)}%)`, buyX + 4, buyY, { width: CONTENT_W / 2 - 16 });
        buyY += 16;
      });
    }

    // ─── LEGAL DISCLAIMER ────────────────────────────────────────────────────
    const disclaimerTop = Math.max(sellY, buyY) + 30;
    const safeDisclaimerTop = disclaimerTop > doc.page.height - 80 ? (() => { doc.addPage(); return 50; })() : disclaimerTop;

    doc.rect(50, safeDisclaimerTop, CONTENT_W, 2).fill(GOLD);

    doc.fillColor(GRAY)
      .font("Helvetica-Oblique")
      .fontSize(8)
      .text(
        "Disclaimer: Questo documento è a scopo informativo. Non costituisce consulenza finanziaria né sollecitazione all'investimento. " +
        "I rendimenti passati non garantiscono quelli futuri. Investire in vino comporta rischi, inclusa la perdita parziale o totale del capitale investito. " +
        "VinoInvest non è un intermediario finanziario autorizzato.",
        50,
        safeDisclaimerTop + 8,
        { width: CONTENT_W, align: "justify" }
      );

    // Footer
    const footerY = doc.page.height - 35;
    doc.rect(0, footerY, PAGE_W, 35).fill(DARK);
    doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9)
      .text("VinoInvest", 50, footerY + 11);
    doc.fillColor(WHITE).font("Helvetica").fontSize(8)
      .text("vinoinvest-platform.vercel.app", 50, footerY + 22);
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
      .text(`© ${new Date().getFullYear()} VinoInvest`, 0, footerY + 16, { align: "right", width: PAGE_W - 50 });

    doc.end();
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _sectionTitle(doc, title, y) {
  doc.fillColor(DARK).font("Helvetica-Bold").fontSize(13).text(title, 50, y);
  doc.rect(50, y + 18, 40, 2).fill(GOLD);
}

function _formatNum(n) {
  return Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
