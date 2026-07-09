import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SITE_URL } from "../lib/constants";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function DataDownload() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Dataset & Download | VinoInvest — Open Wine Data";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Scarica i dataset aperti di VinoInvest: prezzi storici, AI Score e dati di mercato per oltre 500 vini pregiati in formato CSV e JSON."
    );
  }, []);

  const datasets = [
    {
      name: "Wine Investment Dataset",
      desc: "500+ vini con prezzi, AI Score, regione, annata e trend di mercato.",
      format: "CSV",
      url: `${BACKEND}/api/data/wines.csv`,
      size: "~45 KB",
      updated: "Giornaliero",
      license: "CC BY 4.0",
    },
    {
      name: "Price History Sample",
      desc: "Campione di storico prezzi su Liv-ex e aste per vini selezionati.",
      format: "CSV",
      url: `${BACKEND}/api/data/prices.csv`,
      size: "~20 KB",
      updated: "Settimanale",
      license: "CC BY 4.0",
    },
    {
      name: "Dataset Metadata",
      desc: "Metadati strutturati del dataset: campi, fonti, licenza e citazione.",
      format: "JSON",
      url: `${BACKEND}/api/data/metadata.json`,
      size: "~2 KB",
      updated: "Mensile",
      license: "CC BY 4.0",
    },
    {
      name: "Knowledge Base",
      desc: "Knowledge base strutturata per AI e motori di ricerca su wine investment.",
      format: "JSON-LD",
      url: `${BACKEND}/api/knowledge-base`,
      size: "~8 KB",
      updated: "Mensile",
      license: "CC BY 4.0",
    },
  ];

  const citation = `VinoInvest AI Research Team. (2026). Fine Wine Investment Dataset. VinoInvest.
URL: ${SITE_URL}/data
Accessed: ${new Date().toISOString().split("T")[0]}`;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", color: "#e2e8f0" }}>
      <nav style={{ fontSize: ".85rem", color: "#64748b", marginBottom: "1.5rem" }}>
        <a href="/" style={{ color: "#C9A227", textDecoration: "none" }}>Home</a> {" › "}
        <span>Dataset & Download</span>
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: ".75rem" }}>
        📊 Dataset Aperti Wine Investment
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem", lineHeight: 1.7, fontSize: "1rem" }}>
        VinoInvest pubblica dataset aperti (licenza CC BY 4.0) con dati di mercato, prezzi e AI Score
        per il vino pregiato. Ideali per ricercatori, sviluppatori e analisti finanziari.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Download Dataset
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {datasets.map(ds => (
            <div key={ds.name} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "1.25rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 700, marginBottom: ".3rem" }}>{ds.name}</h3>
                <p style={{ color: "#64748b", fontSize: ".85rem", marginBottom: ".5rem" }}>{ds.desc}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: ".8rem", flexWrap: "wrap" }}>
                  <span style={{ color: "#475569" }}>Format: <strong style={{ color: "#93c5fd" }}>{ds.format}</strong></span>
                  <span style={{ color: "#475569" }}>Size: <strong style={{ color: "#cbd5e1" }}>{ds.size}</strong></span>
                  <span style={{ color: "#475569" }}>Aggiornamento: <strong style={{ color: "#cbd5e1" }}>{ds.updated}</strong></span>
                  <span style={{ color: "#475569" }}>Licenza: <strong style={{ color: "#4ade80" }}>{ds.license}</strong></span>
                </div>
              </div>
              <a
                href={ds.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg,#C9A227,#a07d1a)",
                  color: "#020617", fontWeight: 700, padding: ".6rem 1.2rem",
                  borderRadius: 8, textDecoration: "none", fontSize: ".9rem",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                ⬇ Download
              </a>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          API REST Pubblica
        </h2>
        <p style={{ color: "#94a3b8", fontSize: ".9rem", marginBottom: "1rem" }}>
          Accedi ai dati programmaticamente tramite la nostra API pubblica.
          Documentazione completa su <a href="/api/docs" style={{ color: "#C9A227" }}>Swagger UI →</a>
        </p>
        <div style={{ background: "#0f172a", borderRadius: 8, padding: "1rem", fontFamily: "monospace", fontSize: ".85rem", color: "#94a3b8" }}>
          <div style={{ color: "#64748b", marginBottom: ".5rem" }}># Esempio: lista vini</div>
          <div><span style={{ color: "#4ade80" }}>GET</span> {BACKEND}/api/v1/wines?limit=50</div>
          <div style={{ marginTop: ".5rem", color: "#64748b" }}># Storico prezzi</div>
          <div><span style={{ color: "#4ade80" }}>GET</span> {BACKEND}/api/prices/lafite-2018/history</div>
          <div style={{ marginTop: ".5rem", color: "#64748b" }}># Download CSV</div>
          <div><span style={{ color: "#4ade80" }}>GET</span> {BACKEND}/api/data/wines.csv</div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Come Citare VinoInvest
        </h2>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "1rem", fontFamily: "monospace", fontSize: ".85rem", color: "#94a3b8", whiteSpace: "pre-line" }}>
          {citation}
        </div>
        <div style={{ marginTop: "1rem", background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: "1rem", fontSize: ".85rem" }}>
          <strong style={{ color: "#C9A227" }}>Licenza:</strong>
          <span style={{ color: "#94a3b8", marginLeft: ".5rem" }}>
            Creative Commons Attribution 4.0 International (CC BY 4.0).
            Puoi usare, condividere e adattare questi dati liberamente, con attribuzione a VinoInvest.
          </span>
        </div>
      </section>
    </div>
  );
}
