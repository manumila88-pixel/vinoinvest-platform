import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const KEY = "vino_disclaimer_bar_dismissed";

export default function DisclaimerBar() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(() => {
    try { return !!sessionStorage.getItem(KEY); } catch { return false; }
  });

  if (dismissed) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9000,
      background: "rgba(15,23,42,0.97)", borderTop: "1px solid rgba(201,162,39,0.25)",
      backdropFilter: "blur(8px)", padding: "7px 16px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 11, color: "#64748b", flex: 1, lineHeight: 1.4 }}>
        <strong style={{ color: "#C9A227" }}>⚠️</strong>{" "}
        {t("disclaimer.text")}{" "}
        <a href="/disclaimer" style={{ color: "#C9A227", textDecoration: "none" }}>{t("disclaimer.link")}</a>
      </span>
      <button
        onClick={() => {
          try { sessionStorage.setItem(KEY, "1"); } catch {}
          setDismissed(true);
        }}
        style={{
          background: "none", border: "none", color: "#475569", cursor: "pointer",
          fontSize: 16, lineHeight: 1, padding: "2px 4px", flexShrink: 0,
        }}
        aria-label="Chiudi avvertenza"
      >
        ×
      </button>
    </div>
  );
}
