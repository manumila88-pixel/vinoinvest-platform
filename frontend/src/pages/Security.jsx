import { useEffect } from "react";

export default function Security() {
  useEffect(() => {
    document.title = "Security & Bug Bounty | VinoInvest";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "VinoInvest security policy, responsible disclosure, and bug bounty program. Report vulnerabilities and earn recognition."
    );
  }, []);

  const owaspItems = [
    { id: "A01", name: "Broken Access Control", status: "✅ Mitigato", color: "#4ade80", notes: "Middleware requireAuth/requireAdmin su tutte le route protette" },
    { id: "A02", name: "Cryptographic Failures", status: "✅ Mitigato", color: "#4ade80", notes: "HTTPS forzato, HSTS preload, JWT Supabase" },
    { id: "A03", name: "Injection", status: "✅ Mitigato", color: "#4ade80", notes: "Query parametrizzate PostgreSQL, validazione input" },
    { id: "A04", name: "Insecure Design", status: "✅ Mitigato", color: "#4ade80", notes: "Rate limiting, CORS whitelist, CSP headers" },
    { id: "A05", name: "Security Misconfiguration", status: "✅ Mitigato", color: "#4ade80", notes: "helmet.js, vercel.json security headers (A+)" },
    { id: "A06", name: "Vulnerable Components", status: "⚠️ Monitorato", color: "#fbbf24", notes: "npm audit eseguito regolarmente" },
    { id: "A07", name: "Authentication Failures", status: "✅ Mitigato", color: "#4ade80", notes: "Supabase Auth, JWT con scadenza, nessun password storage" },
    { id: "A08", name: "Software & Data Integrity", status: "✅ Mitigato", color: "#4ade80", notes: "SRI su asset CDN, build reproducibili" },
    { id: "A09", name: "Security Logging", status: "⚠️ Parziale", color: "#fbbf24", notes: "Express request logging, Sentry in configurazione" },
    { id: "A10", name: "SSRF", status: "✅ Mitigato", color: "#4ade80", notes: "Chiamate API esterne solo verso URL allowlisted" },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem", color: "#e2e8f0" }}>
      <nav style={{ fontSize: ".85rem", color: "#64748b", marginBottom: "1.5rem" }}>
        <a href="/" style={{ color: "#C9A227", textDecoration: "none" }}>Home</a> {" › "}
        <span>Sicurezza & Bug Bounty</span>
      </nav>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#f8fafc", marginBottom: ".75rem" }}>
        🔐 Sicurezza & Bug Bounty
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem", lineHeight: 1.7 }}>
        La sicurezza dei dati degli utenti è la nostra priorità assoluta. Se scopri una vulnerabilità,
        ti invitiamo a segnalarla responsabilmente. Riconosciamo e premiamo i ricercatori etici.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Come Segnalare una Vulnerabilità
        </h2>
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "1.25rem" }}>
          <ol style={{ color: "#94a3b8", lineHeight: 2.2, paddingLeft: "1.25rem", fontSize: ".95rem" }}>
            <li>Invia un'email a <strong style={{ color: "#C9A227" }}>security@vinoinvest.com</strong> con oggetto "[Security] Vulnerability Report"</li>
            <li>Descrivi la vulnerabilità con tutti i dettagli di riproduzione</li>
            <li>Non esfiltrare, modificare o eliminare dati reali</li>
            <li>Non eseguire attacchi DoS o flood</li>
            <li>Concedici 90 giorni prima di qualsiasi divulgazione pubblica</li>
          </ol>
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Premi Bug Bounty
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {[
            { level: "Critico (RCE, SQL Injection, Auth Bypass)", reward: "€500 – €2.000", color: "#ef4444" },
            { level: "Alto (XSS, IDOR, SSRF)", reward: "€100 – €500", color: "#f97316" },
            { level: "Medio (CSRF, Info Disclosure)", reward: "€25 – €100", color: "#fbbf24" },
            { level: "Basso (Best Practice Issues)", reward: "Hall of Fame", color: "#4ade80" },
          ].map(b => (
            <div key={b.level} style={{ background: "#111827", border: `1px solid ${b.color}30`, borderRadius: 8, padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: b.color, marginBottom: ".5rem" }}>{b.reward}</div>
              <div style={{ fontSize: ".8rem", color: "#64748b", lineHeight: 1.4 }}>{b.level}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Scope
        </h2>
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "1.25rem" }}>
          <p style={{ color: "#4ade80", fontSize: ".9rem", marginBottom: ".5rem" }}>✅ In scope:</p>
          <ul style={{ color: "#94a3b8", fontSize: ".9rem", lineHeight: 2, paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            <li>vinoinvest-platform.vercel.app</li>
            <li>vinoinvest-backend-2.onrender.com</li>
            <li>API pubbliche (/api/v1/*)</li>
          </ul>
          <p style={{ color: "#ef4444", fontSize: ".9rem", marginBottom: ".5rem" }}>❌ Out of scope:</p>
          <ul style={{ color: "#94a3b8", fontSize: ".9rem", lineHeight: 2, paddingLeft: "1.25rem" }}>
            <li>Attacchi DoS/DDoS</li>
            <li>Social engineering e phishing</li>
            <li>Servizi di terze parti (Supabase, Render, Vercel)</li>
            <li>Vulnerabilità senza impatto dimostrabile</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          OWASP Top 10 — Status Attuale
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
          {owaspItems.map(item => (
            <div key={item.id} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: ".75rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "#475569", fontSize: ".8rem", fontFamily: "monospace", minWidth: 35 }}>{item.id}</span>
              <span style={{ flex: 1, color: "#cbd5e1", fontSize: ".9rem" }}>{item.name}</span>
              <span style={{ color: item.color, fontSize: ".85rem", fontWeight: 600, whiteSpace: "nowrap" }}>{item.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem", borderBottom: "1px solid #1e293b", paddingBottom: ".5rem" }}>
          Security Headers
        </h2>
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "1.25rem", fontFamily: "monospace", fontSize: ".8rem", color: "#94a3b8", lineHeight: 2 }}>
          {[
            ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
            ["X-Frame-Options", "SAMEORIGIN"],
            ["X-Content-Type-Options", "nosniff"],
            ["X-XSS-Protection", "1; mode=block"],
            ["Referrer-Policy", "strict-origin-when-cross-origin"],
            ["Permissions-Policy", "camera=(self), geolocation=(), payment=(self)"],
            ["Content-Security-Policy", "default-src 'self'; ..."],
          ].map(([k, v]) => (
            <div key={k}>
              <span style={{ color: "#C9A227" }}>{k}</span>
              <span style={{ color: "#475569" }}>: </span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
