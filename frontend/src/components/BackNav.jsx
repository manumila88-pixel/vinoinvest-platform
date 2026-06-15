import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackNav({ title, backTo }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 200,
      background: "rgba(11,18,32,0.97)", borderBottom: "1px solid rgba(30,41,59,0.6)",
      backdropFilter: "blur(10px)", padding: "0 20px", height: 46,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <button
        onClick={() => backTo ? navigate(backTo) : navigate(-1)}
        style={{ background: "none", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 6, color: "#C9A227", cursor: "pointer", fontSize: 12, padding: "3px 10px", fontFamily: "inherit" }}
      >← Indietro</button>
      <button
        onClick={() => navigate("/")}
        style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", fontWeight: 700, fontSize: 13, padding: 0, fontFamily: "inherit" }}
      >VinoInvest</button>
      {title && <>
        <span style={{ color: "#334155", fontSize: 12 }}>›</span>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>{title}</span>
      </>}
    </div>
  );
}
