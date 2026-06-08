import { Router } from "express";

const router = Router();

/**
 * GET /api/security
 * Security policy and bug bounty information.
 */
router.get("/", (_req, res) => {
  res.set("Cache-Control", "public, max-age=86400");
  res.json({
    securityPolicy: {
      version: "1.0",
      url: "https://vinoinvest-platform.vercel.app/security",
      contact: "security@vinoinvest.com",
      pgp: null,
      preferredLanguages: ["it", "en"],
      canonical: "https://vinoinvest-platform.vercel.app/.well-known/security.txt"
    },
    bugBounty: {
      scope: [
        "https://vinoinvest-platform.vercel.app",
        "https://vinoinvest-backend-2.onrender.com"
      ],
      outOfScope: [
        "Denial of Service (DoS/DDoS)",
        "Social engineering attacks",
        "Physical security",
        "Third-party services"
      ],
      rewards: {
        critical: "€500 - €2000",
        high: "€100 - €500",
        medium: "€25 - €100",
        low: "Recognition in Hall of Fame"
      },
      reportingGuidelines: [
        "Do not exfiltrate, modify, or delete data",
        "Do not perform DoS attacks",
        "Provide detailed reproduction steps",
        "Allow 90 days before public disclosure"
      ]
    },
    owasp: {
      lastAudit: "2026-06-09",
      categories: [
        { id: "A01", name: "Broken Access Control", status: "✅ Mitigated", notes: "requireAuth/requireAdmin middleware on all protected routes" },
        { id: "A02", name: "Cryptographic Failures", status: "✅ Mitigated", notes: "HTTPS enforced, HSTS preload, Supabase JWT" },
        { id: "A03", name: "Injection", status: "✅ Mitigated", notes: "Parameterized queries, input validation" },
        { id: "A04", name: "Insecure Design", status: "✅ Mitigated", notes: "Rate limiting, CORS whitelist, CSP headers" },
        { id: "A05", name: "Security Misconfiguration", status: "✅ Mitigated", notes: "helmet.js, vercel.json security headers" },
        { id: "A06", name: "Vulnerable Components", status: "⚠️ Monitor", notes: "npm audit run regularly" },
        { id: "A07", name: "Authentication Failures", status: "✅ Mitigated", notes: "Supabase Auth, JWT expiry, no password storage" },
        { id: "A08", name: "Software and Data Integrity", status: "✅ Mitigated", notes: "Subresource Integrity on CDN assets" },
        { id: "A09", name: "Security Logging", status: "⚠️ Partial", notes: "Express request logging, Sentry pending" },
        { id: "A10", name: "SSRF", status: "✅ Mitigated", notes: "External API calls use fixed allowlisted URLs" }
      ]
    },
    headers: {
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "Content-Security-Policy": "default-src 'self'; ...",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  });
});

export default router;
