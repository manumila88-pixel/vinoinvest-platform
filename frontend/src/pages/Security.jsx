import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_HOST } from "../lib/constants";

const OWASP = [
  { id: "A01", name: "Broken Access Control", status: "Mitigato", color: "#34d399", notes: "requireAuth / requireAdmin middleware su tutte le route protette. Role-based access per org members." },
  { id: "A02", name: "Cryptographic Failures", status: "Mitigato", color: "#34d399", notes: "HTTPS forzato (Render + Vercel). HSTS max-age=63072000 preload. JWT Supabase con scadenza. Nessun segreto in frontend." },
  { id: "A03", name: "Injection", status: "Mitigato", color: "#34d399", notes: "Query parametrizzate PostgreSQL su tutti gli endpoint. Validazione input su boundary esterne. Nessuna query string building." },
  { id: "A04", name: "Insecure Design", status: "Mitigato", color: "#34d399", notes: "Rate limiting globale (200 req/15min) e AI-specific (20 req/min). CORS whitelist. CSP headers restrictive." },
  { id: "A05", name: "Security Misconfiguration", status: "Mitigato", color: "#34d399", notes: "helmet.js con CSP, HSTS, X-Frame-Options. Vercel deployment con headers A+ su securityheaders.com." },
  { id: "A06", name: "Vulnerable Components", status: "Monitorato", color: "#fbbf24", notes: "npm audit eseguito ad ogni deploy. Dependabot attivo su GitHub. Aggiornamenti settimanali dipendenze critiche." },
  { id: "A07", name: "Authentication Failures", status: "Mitigato", color: "#34d399", notes: "Supabase Auth con JWT, refresh token rotation, nessun password storage proprio. Session management delegato a Supabase." },
  { id: "A08", name: "Software & Data Integrity", status: "Mitigato", color: "#34d399", notes: "SRI su asset CDN. Build riproducibili con lockfile. Nessun eval() o dynamic import non controllato." },
  { id: "A09", name: "Security Logging & Monitoring", status: "Parziale", color: "#fbbf24", notes: "Audit log per azioni critiche B2B. Express request logging. Sentry error tracking. Alerting su errori 5xx." },
  { id: "A10", name: "SSRF", status: "Mitigato", color: "#34d399", notes: "Chiamate API esterne solo verso URL allowlisted. Nessun proxy di URL arbitrari. Validazione origin su fetch external." },
];

const HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), geolocation=(), payment=(self), microphone=()" },
  { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https:; connect-src 'self' https:" },
];

const BOUNTY = [
  { level: "Critico", examples: "RCE, SQL Injection, Auth Bypass, IDOR mass", reward: "€500 – €2.000", color: "#ef4444" },
  { level: "Alto", examples: "XSS stored, privilege escalation, SSRF", reward: "€100 – €500", color: "#f97316" },
  { level: "Medio", examples: "CSRF, informazioni sensibili, misconfiguration", reward: "€25 – €100", color: "#fbbf24" },
  { level: "Basso", examples: "Best practice, rate limit bypass, verbose errors", reward: "Hall of Fame", color: "#4ade80" },
];

export default function Security() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Helmet>
        <title>Sicurezza & Bug Bounty | VinoInvest — Security Policy Professionale</title>
        <meta name="description" content="VinoInvest security policy: OWASP Top 10 compliance, GDPR, bug bounty program, security headers. Report vulnerabilità responsabilmente." />
        <link rel="canonical" href={`${SITE_URL}/security`} />
      </Helmet>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,18,32,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e3050", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", fontSize: 19, fontWeight: 800, cursor: "pointer" }}>VinoInvest</button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => navigate("/metodologia")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Metodologia</button>
          <button onClick={() => navigate("/data-sources")} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>Fonti dati</button>
          <button onClick={() => navigate("/b2b")} style={{ background: "#C9A227", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0b1220", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>B2B Professional</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "72px 24px 80px" }}>

        <nav style={{ fontSize: 12, color: "#64748b", marginBottom: 32 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#C9A227", cursor: "pointer", padding: 0, fontSize: 12 }}>Home</button>
          <span style={{ margin: "0 6px" }}>›</span>
          <span>Sicurezza & Bug Bounty</span>
        </nav>

        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-block", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontSize: 11, color: "#34d399", letterSpacing: 2 }}>
            SECURITY POLICY
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>
            Sicurezza & Bug Bounty
          </h1>
          <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            La sicurezza degli utenti è la nostra priorità assoluta. Programma di bug bounty attivo,
            OWASP Top 10 compliance dichiarata, GDPR compliant.
          </p>
        </div>

        {/* Come segnalare */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Come segnalare una vulnerabilità</h2>
          <div style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 14, padding: "28px" }}>
            <ol style={{ color: "#94a3b8", lineHeight: 2.4, paddingLeft: 24, fontSize: 14, margin: 0 }}>
              <li>Invia email a <a href="mailto:security@vinoinvest.com" style={{ color: "#C9A227", textDecoration: "none" }}>security@vinoinvest.com</a> con oggetto "[Security] Vulnerability Report"</li>
              <li>Includi: descrizione dettagliata, steps to reproduce, impatto potenziale, prova di concept (se disponibile)</li>
              <li>Non esfiltrare, modificare o cancellare dati reali di altri utenti</li>
              <li>Non eseguire attacchi DoS, flooding o social engineering</li>
              <li>Rispettiamo il principio di responsible disclosure: 90 giorni prima di qualsiasi pubblicazione</li>
              <li>Risponderemo entro 5 giorni lavorativi con una valutazione iniziale</li>
            </ol>
          </div>
        </section>

        {/* Bug Bounty */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Premi Bug Bounty</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {BOUNTY.map(b => (
              <div key={b.level} style={{ background: "#0f1c2e", border: `1px solid ${b.color}25`, borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: b.color, marginBottom: 8 }}>{b.reward}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{b.level}</div>
                <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>{b.examples}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Scope */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Scope</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#0f1c2e", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399", marginBottom: 12 }}>✓ In scope</div>
              {[SITE_HOST, "vinoinvest-backend-2.onrender.com", "API pubbliche (/api/v1/*)", "Endpoint autenticati (/api/organizations/*, /api/client-portfolios/*)"].map(s => (
                <div key={s} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, paddingLeft: 12 }}>{s}</div>
              ))}
            </div>
            <div style={{ background: "#0f1c2e", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 12 }}>✗ Out of scope</div>
              {["Attacchi DoS/DDoS", "Social engineering e phishing", "Servizi terze parti (Supabase, Render, Vercel)", "Vulnerabilità senza impatto dimostrabile", "Automated scanning senza notifica preventiva"].map(s => (
                <div key={s} style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, paddingLeft: 12 }}>{s}</div>
              ))}
            </div>
          </div>
        </section>

        {/* OWASP */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>OWASP Top 10 — Status attuale</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {OWASP.map(item => (
              <div key={item.id} style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ color: "#334155", fontSize: 11, fontFamily: "monospace", minWidth: 32 }}>{item.id}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>{item.name}</span>
                  <span style={{
                    background: `${item.color}15`, border: `1px solid ${item.color}30`,
                    color: item.color, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                  }}>{item.status}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.6, paddingLeft: 44 }}>{item.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Headers */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Security Headers</h2>
          <div style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 12, padding: "24px", fontFamily: "'Courier New', Courier, monospace", fontSize: 12, color: "#94a3b8", lineHeight: 2.2, overflowX: "auto" }}>
            {HEADERS.map(h => (
              <div key={h.key}>
                <span style={{ color: "#C9A227" }}>{h.key}</span>
                <span style={{ color: "#334155" }}>: </span>
                <span style={{ color: "#64748b" }}>{h.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* GDPR */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>GDPR & Data Protection</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Base giuridica del trattamento", body: "Contratto (art. 6(1)(b) GDPR) per i dati necessari al servizio. Consenso esplicito (art. 6(1)(a)) per newsletter e marketing. Interesse legittimo (art. 6(1)(f)) per sicurezza e fraud prevention." },
              { title: "Data Retention", body: "Dati account: per tutta la durata del contratto + 2 anni. Log di audit: 7 anni (standard MiFID II per clienti B2B). Newsletter preferences: fino a revoca consenso. Dati anonimi aggregati: illimitato." },
              { title: "Diritti degli interessati", body: "Puoi esercitare i diritti di accesso, rettifica, cancellazione, portabilità e opposizione scrivendo a manumila88@gmail.com. Risposta garantita entro 30 giorni. Cancellazione account disponibile nelle impostazioni profilo." },
              { title: "Trasferimenti internazionali", body: "Dati ospitati su Render (USA — Standard Contractual Clauses) e Vercel (USA — SCC). Supabase su EU region per conformità. Nessun trasferimento verso paesi senza adeguata protezione." },
              { title: "Data Breach Notification", body: "In caso di violazione con rischio per gli interessati, notifica all'Autorità Garante entro 72 ore e agli utenti coinvolti senza ingiustificato ritardo, come previsto dall'art. 33-34 GDPR." },
            ].map(item => (
              <div key={item.title} style={{ background: "#0f1c2e", border: "1px solid #1e3050", borderRadius: 12, padding: "18px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#60a5fa", marginBottom: 8 }}>{item.title}</div>
                <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SSL / Infrastructure */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Infrastruttura di sicurezza</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { title: "SSL/TLS", desc: "TLS 1.2+ obbligatorio. Certificati Let's Encrypt con rinnovo automatico.", color: "#34d399" },
              { title: "HSTS Preload", desc: "Iscritti alla lista HSTS preload dei browser. max-age 2 anni + subdomains.", color: "#34d399" },
              { title: "Database", desc: "PostgreSQL su Render con connessioni cifrate SSL. Nessun accesso pubblico diretto.", color: "#34d399" },
              { title: "Secrets Management", desc: "Variabili d'ambiente su Vercel/Render. Nessun segreto nel codice o in repo.", color: "#34d399" },
              { title: "Rate Limiting", desc: "200 req/15min globale. 20 req/min per endpoint AI (costo API). IP-based.", color: "#fbbf24" },
              { title: "Backup", desc: "Backup automatico DB ogni 24 ore. Retention 7 giorni su Render free tier.", color: "#fbbf24" },
            ].map(item => (
              <div key={item.title} style={{ background: "#0f1c2e", border: `1px solid ${item.color}20`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 8 }}>{item.title}</div>
                <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contatto */}
        <div style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 12 }}>Per segnalazioni di sicurezza e domande GDPR:</p>
          <a href="mailto:security@vinoinvest.com" style={{ color: "#34d399", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>security@vinoinvest.com</a>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 8 }}>PGP fingerprint disponibile su richiesta — risposta entro 5 giorni lavorativi</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "24px", borderTop: "1px solid #1e3050", textAlign: "center", color: "#334155", fontSize: 12 }}>
        <div style={{ marginBottom: 12, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Privacy", "/privacy"], ["Termini", "/terms"], ["Metodologia", "/metodologia"], ["Fonti dati", "/data-sources"], ["B2B", "/b2b"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div>© 2026 VinoInvest. Tutti i diritti riservati.</div>
      </footer>
    </div>
  );
}
