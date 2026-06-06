#!/usr/bin/env bash
# test-all.sh — VinoInvest full system test
# Usage: ./test-all.sh [backend-url]
# Default: tests against production backend

set -euo pipefail

API="${1:-https://vinoinvest-backend-2.onrender.com}"
PASS=0; FAIL=0

check() {
  local label="$1"; shift
  local expected_status="${1}"; shift
  local url="$1"; shift
  local extra_args=("$@")

  local out; out=$(curl -s -o /dev/null -w "%{http_code}" "${extra_args[@]}" "$url" 2>/dev/null)
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
  local out; out=$(curl -s "$url" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print($jq_filter)" 2>/dev/null || echo "ERROR")
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

# ── Count wines with images ──────────────────────────────
echo "── Data Quality ──"
WINES_JSON=$(curl -s "$API/api/wines?limit=50" 2>/dev/null)
TOTAL=$(python3 -c "import sys,json; d=json.loads('$WINES_JSON'.replace(\"'\",\"'\")); print(d.get('total',0))" 2>/dev/null || echo "0")
echo "  ℹ️   Total wines: $TOTAL"

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
