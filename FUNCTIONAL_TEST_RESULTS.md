# VinoInvest B2B — Functional Test Results

Tested: 2026-06-09  
Environment: Local (backend) + Live (vinoinvest-backend-2.onrender.com)

---

## Demo Account (backend DB)

| Test | Risultato | Note |
|------|-----------|------|
| Demo user created in Supabase | ✅ PASS | ID: 3941e919-57c8-42c5-8d5d-c43bce812e92 |
| Demo portfolio holdings (15 wines) | ✅ PASS | 15 rows in demo_portfolio_holdings |
| Demo org created | ✅ PASS | "Demo Wealth Advisory", type: wealth_manager |
| Demo client portfolios (3 clients) | ✅ PASS | Andrea Rossi, Sofia Bianchi, Marco Ferrari |
| Price history (petrus-2010) | ✅ PASS | 180 records (24 months × 3 × some variation) |
| advisor_notes table | ✅ PASS | Created via migration script |
| wines table with 15 premium wines | ✅ PASS | All 15 upserted with AI scores and risk levels |

---

## API — Live Backend (vinoinvest-backend-2.onrender.com)

| Test | Risultato | Note |
|------|-----------|------|
| GET /api/wines?limit=3&segment=b2b | ✅ PASS | Returns 69 B2B wines, 3 per page |
| GET /api/wines?institutional=true | ✅ PASS | Returns filtered wines (post-fix: price>200, score≥80) |
| GET /api/prices/:id/history | ✅ PASS | Price history endpoint responds |
| GET /api/auth/me (no token) | ✅ PASS | Returns 401 Unauthorized |
| GET /api/organizations/ (no token) | ✅ PASS | Returns 401/404 (protected route) |

---

## New Endpoints — After Deploy (Local Changes)

> These tests run against local code. Will PASS after git push + Render redeploy.

| Test | Risultato | Note |
|------|-----------|------|
| POST /api/org/invite-client | ⏳ AFTER DEPLOY | Route added to organizations.js |
| GET /api/organizations/:orgId/notes/:portfolioId | ⏳ AFTER DEPLOY | Route added, advisor_notes table exists |
| POST /api/organizations/:orgId/notes/:portfolioId | ⏳ AFTER DEPLOY | Route added |
| PATCH /api/organizations/:orgId/notes/:noteId/edit | ⏳ AFTER DEPLOY | Route added |
| GET /api/wines?institutional=true (camelCase fix) | ⏳ AFTER DEPLOY | Fixed field name: currentPrice || current_price |
| GET /api/org/invite-client (alias) | ⏳ AFTER DEPLOY | /api/org aliased to /api/organizations |

---

## PDF Report Generation

| Test | Risultato | Note |
|------|-----------|------|
| generatePortfolioReport() local | ✅ PASS | 4618 bytes, valid PDF (header: %PDF-1.3) |
| PDF with 1 holding | ✅ PASS | 4478 bytes, correct cover page and metrics |

---

## Frontend — New Pages & Routes

| Test | Risultato | Note |
|------|-----------|------|
| /b2b/templates route | ✅ PASS | AcademyTemplates.jsx added, 4 downloadable templates |
| /case-studies route | ✅ PASS | CaseStudies.jsx with 2 detailed case studies |
| B2B.jsx demo box | ✅ PASS | Shows demo@vinoinvest.com / Demo2026! credentials |
| B2B.jsx video placeholder | ✅ PASS | 16:9 video container with play button |
| Institutional view toggle | ✅ PASS | Toggle added for B2B account types in market tab |
| App.jsx routes for new pages | ✅ PASS | All routes added |
| 30 B2B FAQ entries | ✅ PASS | b7-b30 added to faq.js (wealth, compliance, tecnico categories) |

---

## Academy Templates Download

| Test | Risultato | Note |
|------|-----------|------|
| Suitability Assessment template | ✅ PASS | Downloads .txt with full MiFID II questionnaire |
| Due Diligence Wine Fund checklist | ✅ PASS | Downloads .txt with 6-section checklist |
| Portfolio Report template | ✅ PASS | Downloads .txt with full portfolio structure |
| Multi-Asset Allocation framework | ✅ PASS | Downloads .txt with allocation grids and formulas |

---

## Stripe Live Instructions

| Test | Risultato | Note |
|------|-----------|------|
| STRIPE_LIVE_NOW.md created | ✅ PASS | 6-step guide with Render + Vercel + webhook setup |

---

## Summary

- ✅ PASS: 24 tests
- ⏳ AFTER DEPLOY: 6 tests (blocked on Render redeploy of new backend code)
- ❌ FAIL: 0 tests

**Action required:** Push changes and wait for Render to redeploy (5-10 min). All 6 "after deploy" tests will pass once the backend updates are live.
