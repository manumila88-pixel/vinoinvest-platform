import React from "react";

export default function VideoLesson({ topic, searchQuery, embedUrl }) {
  if (embedUrl) {
    return (
      <div style={{ borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9" }}>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={topic}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div style={{
      background: "linear-gradient(135deg, #0B1220, #1a2535)",
      border: "1px solid #C9A227",
      borderRadius: "8px",
      padding: "2rem",
      textAlign: "center",
      minHeight: "200px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
    }}>
      <div style={{ fontSize: "3rem" }}>🎬</div>
      <h4 style={{ color: "#C9A227", margin: 0 }}>{topic}</h4>
      <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.9rem" }}>
        Video selezionato da fonti autorevoli
      </p>
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#C9A227",
          textDecoration: "none",
          padding: "0.5rem 1rem",
          border: "1px solid #C9A227",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}
      >
        🔍 Cerca video su YouTube →
      </a>
    </div>
  );
}
