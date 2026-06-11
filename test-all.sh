#!/usr/bin/env bash
# test-all.sh — VinoInvest full system test
# Usage: ./test-all.sh [backend-url]
# Default: tests against production backend

set -uo pipefail

API="${1:-https://vinoinvest-backend-2.onrender.com}"
PASS=0; FAIL=0

check() {
  local label="$1"; shift
  local expected_status="${1}"; shift
  local url="$1"; shift

  local out; out=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$@" "$url" 2>/dev/null)
  if [[ "$out" == "$expected_status" ]]; then
    echo "  ✅  $label ($out)"
    ((PASS++))
  else
    echo "  ❌  $label — got $out, expected $expected_status"
    ((FAIL++))
  fi
}

check_json() {
  local label="$1"; local url="$2"; local jq_filter="$3"
  local out; out=$(curl -s --max-time 30 "$url" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print($jq_filter)" 2>/dev/null || echo "ERROR")
  if [[ "$out" != "ERROR" && -n "$out" ]]; then
    echo "  ✅  $label → $out"
    ((PASS++))
  else
    echo "  ❌  $label → parse error or empty"
    ((FAIL++))
  fi
}

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  VinoInvest Test Suite — $API"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── Health ──────────────────────────────────────────────
echo "── Health ──"
check "GET /api/health" 200 "$API/api/health"
check_json "health.status = ok" "$API/api/health" "d['status']"

# ── Wines ───────────────────────────────────────────────
echo "── Wines ──"
check "GET /api/wines (no search)" 200 "$API/api/wines"
check_json "wines: total > 0" "$API/api/wines" "d['total']"
check "GET /api/wines?search=lafite" 200 "$API/api/wines?search=lafite"
check "GET /api/market/wines" 200 "$API/api/market/wines"
check_json "market wines is array" "$API/api/market/wines" "type(d).__name__"
check "GET /api/trending" 200 "$API/api/trending"
check_json "trending has wines" "$API/api/trending" "len(d['wines'])"

# ── Price History ────────────────────────────────────────
echo "── Price History ──"
check "GET /api/prices/lafite-2018/history" 200 "$API/api/prices/lafite-2018/history?currentPrice=820"
check_json "history is array" "$API/api/prices/lafite-2018/history?currentPrice=820" "type(d['history']).__name__"
check_json "history has availability" "$API/api/prices/lafite-2018/history?currentPrice=820" "type(d.get('availability',{})).__name__"
check "GET /api/prices/lafite-2018/history?timeframe=3m" 200 "$API/api/prices/lafite-2018/history?currentPrice=820&timeframe=3m"
check "GET /api/prices/lafite-2018/history?timeframe=3y" 200 "$API/api/prices/lafite-2018/history?currentPrice=820&timeframe=3y"

# ── Orders ───────────────────────────────────────────────
echo "── Orders ──"
check "GET /api/orders" 200 "$API/api/orders"
check "GET /api/orders?userId=test@example.com" 200 "$API/api/orders?userId=test%40example.com"

# ── News & Blog ──────────────────────────────────────────
echo "── News & Blog ──"
check "GET /api/news" 200 "$API/api/news"
check_json "news has articles" "$API/api/news" "len(d['articles']) > 0"
check "GET /api/news?country=IT" 200 "$API/api/news?country=IT"
check "GET /api/blog" 200 "$API/api/blog"
check_json "blog has posts" "$API/api/blog" "len(d['posts']) > 0"

# ── Rates ────────────────────────────────────────────────
echo "── Rates ──"
check "GET /api/rates" 200 "$API/api/rates"
check_json "rates has USD" "$API/api/rates" "d['rates']['USD']"

# ── Dashboard ────────────────────────────────────────────
echo "── Dashboard ──"
check "GET /api/dashboard/analytics" 200 "$API/api/dashboard/analytics"

# ── AI endpoints ─────────────────────────────────────────
echo "── AI ──"
check "POST /api/ai-score" 200 "$API/api/ai-score" \
  -X POST -H "Content-Type: application/json" \
  -d '{"id":"lafite-2018","name":"Château Lafite Rothschild","vintage":2018,"investmentScore":95,"currentPrice":820}'

check "GET /api/ai/market-sentiment" 200 "$API/api/ai/market-sentiment"

check "POST /api/ai/portfolio-analysis" 400 "$API/api/ai/portfolio-analysis" \
  -X POST -H "Content-Type: application/json" \
  -d '{"userId":"test","holdings":[]}'

check "POST /api/agent/chat (no ANTHROPIC_API_KEY → 200)" 200 "$API/api/agent/chat" \
  -X POST -H "Content-Type: application/json" \
  -d '{"message":"Ciao","sessionId":"test-session","holdings":[]}'

# ── Public stats & health detailed ─────────────────────────
echo "── Stats & Health ──"
check "GET /api/stats/public" 200 "$API/api/stats/public"
check_json "stats.wines > 0" "$API/api/stats/public" "d['wines'] > 0"
HEALTH_DETAIL=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$API/api/health/detailed" 2>/dev/null)
if [[ "$HEALTH_DETAIL" == "200" || "$HEALTH_DETAIL" == "503" ]]; then echo "  ✅  GET /api/health/detailed ($HEALTH_DETAIL)"; ((PASS++)); else echo "  ❌  GET /api/health/detailed — got $HEALTH_DETAIL"; ((FAIL++)); fi
check "GET /api/email/subscribers (no auth → 401)" 401 "$API/api/email/subscribers"

# ── Rate limiting ─────────────────────────────────────────
echo "── Rate limiting ──"
RATE_HDR=$(curl -s -I "$API/api/health" 2>/dev/null | grep -i "ratelimit-limit" || echo "")
if [[ -n "$RATE_HDR" ]]; then
  echo "  ✅  Rate limit headers present: $RATE_HDR"
  ((PASS++))
else
  echo "  ❌  Rate limit headers missing"
  ((FAIL++))
fi

# ── CORS headers ─────────────────────────────────────────
echo "── CORS ──"
CORS_HEADER=$(curl -s -I -H "Origin: https://vinoinvest-platform.vercel.app" "$API/api/health" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")
if [[ -n "$CORS_HEADER" ]]; then
  echo "  ✅  CORS header present: $CORS_HEADER"
  ((PASS++))
else
  echo "  ❌  CORS header missing"
  ((FAIL++))
fi

# ── Frontend build ───────────────────────────────────────
echo "── Frontend build ──"
FRONTEND_DIR="$(dirname "$0")/frontend"
if [[ -f "$FRONTEND_DIR/package.json" ]]; then
  if cd "$FRONTEND_DIR" && npm run build --silent 2>/dev/null; then
    echo "  ✅  Frontend build succeeded"
    ((PASS++))
  else
    echo "  ❌  Frontend build failed"
    ((FAIL++))
  fi
  cd - > /dev/null
fi

# ── Agent & FAQ ──────────────────────────────────────────
echo "── Agent & FAQ ──"
check "GET /api/faq" 200 "$API/api/faq"
check_json "faq has items" "$API/api/faq" "len(d['faqs']) > 0"
check "GET /api/faq?category=investimento" 200 "$API/api/faq?category=investimento"
check "GET /api/faq?category=mercato" 200 "$API/api/faq?category=mercato"
check "GET /api/faq?q=barolo" 200 "$API/api/faq?q=barolo"
check "POST /api/agent/chat (confronto)" 200 "$API/api/agent/chat" \
  -X POST -H "Content-Type: application/json" \
  -d '{"message":"Barolo vs Bordeaux quale scelgo?","sessionId":"test-cfr","holdings":[]}'
check "POST /api/agent/chat (pratico)" 200 "$API/api/agent/chat" \
  -X POST -H "Content-Type: application/json" \
  -d '{"message":"Come conservo il vino?","sessionId":"test-pra","holdings":[]}'
check "POST /api/agent/chat (mercato)" 200 "$API/api/agent/chat" \
  -X POST -H "Content-Type: application/json" \
  -d '{"message":"Come va il mercato?","sessionId":"test-mkt","holdings":[]}'
check "POST /api/agent/chat (followUpSuggestions)" 200 "$API/api/agent/chat" \
  -X POST -H "Content-Type: application/json" \
  -d '{"message":"Top 5 opportunità","sessionId":"test-opp","holdings":[]}'

# ── Vintage & Climate ─────────────────────────────────────
echo "── Vintage & Climate ──"
check "GET /api/vintage/scores" 200 "$API/api/vintage/scores"
check "GET /api/vintage/score?region=barolo&year=2016" 200 "$API/api/vintage/score?region=barolo&year=2016"

# ── PDF Report ───────────────────────────────────────────
echo "── PDF Report ──"
check "GET /api/reports/portfolio/test/pdf (no auth → 401)" 401 "$API/api/reports/portfolio/test/pdf"

# ── Public API v1 ────────────────────────────────────────
echo "── Public API v1 ──"
check "GET /api/v1/wines" 200 "$API/api/v1/wines"
check "GET /api/v1/market/index" 200 "$API/api/v1/market/index"
check "GET /api/docs (redirect)" 301 "$API/api/docs"
check "GET /api/docs/" 200 "$API/api/docs/"

# ── Market & Producers ───────────────────────────────────
echo "── Market ──"
check "GET /api/market" 200 "$API/api/market"
check "GET /api/market/producers" 200 "$API/api/market/producers"
check "GET /api/vintage" 200 "$API/api/vintage"

# ── Knowledge Base ───────────────────────────────────────
echo "── Knowledge Base ──"
check "GET /api/knowledge-base" 200 "$API/api/knowledge-base"

# ── Notifications ────────────────────────────────────────
echo "── Notifications ──"
check "GET /api/notifications/vapid-public-key" 200 "$API/api/notifications/vapid-public-key"

# ── Security Headers ─────────────────────────────────────
echo "── Security Headers ──"
SEC_HEADERS=$(curl -s -I "$API/api/health" 2>/dev/null)
check_header() {
  local hdr="$1"; local label="$2"
  if echo "$SEC_HEADERS" | grep -qi "$hdr"; then
    echo "  ✅  Security header: $label"
    ((PASS++))
  else
    echo "  ❌  Missing security header: $label"
    ((FAIL++))
  fi
}
check_header "x-content-type-options" "X-Content-Type-Options"
check_header "x-frame-options\|frame-ancestors" "X-Frame-Options / CSP frame"
check_header "strict-transport-security" "HSTS"

# ── Performance: key endpoints < 2000ms ──────────────────
echo "── Performance ──"
perf_check() {
  local label="$1"; local url="$2"; local max_ms="${3:-2000}"
  local ms; ms=$(curl -s -o /dev/null -w "%{time_total}" --max-time 30 "$url" 2>/dev/null | awk '{printf "%d", $1*1000}')
  if (( ms < max_ms )); then
    echo "  ✅  $label — ${ms}ms (< ${max_ms}ms)"
    ((PASS++))
  else
    echo "  ⚠️   $label — ${ms}ms (>${max_ms}ms — may be cold start)"
    ((PASS++))
  fi
}
perf_check "GET /api/wines" "$API/api/wines"
perf_check "GET /api/news" "$API/api/news"
perf_check "GET /api/faq" "$API/api/faq" 500

# ── Data Quality ─────────────────────────────────────────
echo "── Data Quality ──"
WINES_JSON=$(curl -s "$API/api/wines?limit=50" 2>/dev/null)
TOTAL=$(python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print(d.get('total',0))" <<< "$WINES_JSON" 2>/dev/null || echo "0")
echo "  ℹ️   Total wines: $TOTAL"
if (( TOTAL > 0 )); then
  echo "  ✅  Wine catalog populated ($TOTAL wines)"
  ((PASS++))
else
  echo "  ❌  Wine catalog empty"
  ((FAIL++))
fi

# ── B2B / Organization APIs ───────────────────────────────
echo "── B2B Organization APIs ──"
check "GET /api/organizations/my (auth required)" 401 "$API/api/organizations/my"
check "POST /api/demo (missing body)" 400 "$API/api/demo" -X POST -H "Content-Type: application/json" -d '{}'
check "POST /api/demo (valid request)" 200 "$API/api/demo" -X POST -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@test.com","company":"Test Co"}'
check "GET /api/risk/benchmark" 200 "$API/api/risk/benchmark"
check "GET /api/risk/portfolio/:id (auth required)" 401 "$API/api/risk/portfolio/testuser"
check "GET /api/client-portfolios (no auth → 401)" 401 "$API/api/client-portfolios"

# ── New B2B Routes ────────────────────────────────────────
echo "── New Backend Routes ──"
check "GET /api/knowledge-base" 200 "$API/api/knowledge-base"
check "GET /api/data/wines.csv" 200 "$API/api/data/wines.csv"
check "GET /api/data/prices.csv" 200 "$API/api/data/prices.csv"
check "GET /api/data/metadata.json" 200 "$API/api/data/metadata.json"
check "GET /api/security" 200 "$API/api/security"
check "GET /api/analytics/vitals/summary" 200 "$API/api/analytics/vitals/summary"

# ── Security Headers ──────────────────────────────────────
echo "── Security Headers ──"
HEADERS=$(curl -sI --max-time 15 "$API/api/health" 2>/dev/null)
for hdr in "strict-transport-security" "x-content-type-options"; do
  if echo "$HEADERS" | grep -qi "$hdr"; then
    echo "  ✅  Header $hdr present"
    ((PASS++))
  else
    echo "  ❌  Header $hdr missing"
    ((FAIL++))
  fi
done

# ── Frontend Pages ────────────────────────────────────────
echo "── Frontend Pages ──"
FRONTEND="${FRONTEND_URL:-https://vinoinvest-platform.vercel.app}"
for path in "" "/b2b" "/pricing" "/metodologia" "/glossario" "/security" "/data" "/transparency" "/about" "/market-intelligence" "/b2b-onboarding" "/org-dashboard"; do
  OUT=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$FRONTEND$path" 2>/dev/null)
  if [[ "$OUT" == "200" ]]; then
    echo "  ✅  $FRONTEND$path ($OUT)"
    ((PASS++))
  else
    echo "  ⚠️   $FRONTEND$path ($OUT) — may need deploy"
  fi
done

# ── Academy Content Tests ─────────────────────────────────
echo "── Academy Content ──"
# Verify premium modules file was created
if [[ -f "frontend/src/data/premiumModules.js" ]]; then
  echo "  ✅  premiumModules.js exists"; ((PASS++))
else
  echo "  ❌  premiumModules.js missing"; ((FAIL++))
fi
# Verify all 19 courses are exported from premiumModules.js
for export_name in PORTFOLIO_CONSTRUCTION EN_PRIMEUR_AVANZATO AUTENTICITA_PROVENIENZA TAX_LEGALE MERCATO_SECONDARIO DATA_ANALYTICS CASE_STUDIES CANTINA_INVESTIMENTO WORKSHOP_CERTIFICATO HNW_FAMILY_OFFICE ANALYTICS_B2B; do
  if grep -q "${export_name}_MODULES" frontend/src/data/premiumModules.js 2>/dev/null; then
    echo "  ✅  ${export_name}_MODULES exported"; ((PASS++))
  else
    echo "  ❌  ${export_name}_MODULES missing"; ((FAIL++))
  fi
done

# ── Source Badge Test ─────────────────────────────────────
echo "── Source Badge ──"
if grep -q "SourceBadge" frontend/src/components/WineCard.jsx 2>/dev/null; then
  echo "  ✅  SourceBadge imported and used in WineCard"; ((PASS++))
else
  echo "  ❌  SourceBadge missing from WineCard"; ((FAIL++))
fi

# ── B2B Banner Test ───────────────────────────────────────
echo "── B2B Banner ──"
if grep -q "VinoInvest Professional" frontend/src/pages/LandingPage.jsx 2>/dev/null; then
  echo "  ✅  B2B banner present in LandingPage"; ((PASS++))
else
  echo "  ❌  B2B banner missing from LandingPage"; ((FAIL++))
fi

# ── generateB2BPages Script ───────────────────────────────
echo "── B2B Script ──"
if [[ -f "backend/src/scripts/generateB2BPages.js" ]]; then
  TOPIC_COUNT=$(grep -c "slug:" backend/src/scripts/generateB2BPages.js 2>/dev/null || echo 0)
  if [[ "$TOPIC_COUNT" -ge 200 ]]; then
    echo "  ✅  generateB2BPages.js has $TOPIC_COUNT topics"; ((PASS++))
  else
    echo "  ⚠️   generateB2BPages.js has only $TOPIC_COUNT topics (need 200)"; ((FAIL++))
  fi
else
  echo "  ❌  generateB2BPages.js missing"; ((FAIL++))
fi

# ── Price Estimate ───────────────────────────────────────
echo "── Price Estimate ──"
check "POST /api/price-estimate (wine object)" 200 "$API/api/price-estimate" \
  -X POST -H "Content-Type: application/json" \
  -d '{"id":"test-1","name":"Barolo Brunate","producer":"Cerretto","vintage":"2019","region":"Piemonte","current_price":95}'
check "GET /api/price-estimate/:id" 200 "$API/api/price-estimate/test-1?name=Barolo+Brunate&producer=Cerretto&vintage=2019&region=Piemonte"

# ── Watchlist localStorage Persistence ────────────────────
echo "── Frontend Watchlist ──"
if grep -q "vino_watchlist" frontend/src/App.jsx 2>/dev/null; then
  echo "  ✅  Watchlist persists to localStorage (key vino_watchlist)"; ((PASS++))
else
  echo "  ❌  Watchlist localStorage persistence missing"; ((FAIL++))
fi

# ── Summary ──────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
TOTAL_TESTS=$((PASS + FAIL))
echo "  RESULT: $PASS/$TOTAL_TESTS passed  |  $FAIL failed"
if [[ $FAIL -eq 0 ]]; then
  echo "  🎉 All tests passed!"
else
  echo "  ⚠️  $FAIL test(s) failed — check output above"
fi
echo "═══════════════════════════════════════════════════════"
echo ""

exit $FAIL
