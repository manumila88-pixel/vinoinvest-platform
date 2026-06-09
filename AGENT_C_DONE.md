# AGENT_C_DONE

Agent C completed. All files in §3 of the contract have been tokenized and committed on branch `redesign/global`.

## Files modified (10 commits)

| File | Commit | Changes |
|------|--------|---------|
| `frontend/src/components/PriceHistoryChart.jsx` | 817e359 | Colors, tooltip, grid, timeframe buttons |
| `frontend/src/components/VintageScore.jsx` | b24c654 | Score colors, climate spans, emoji removed |
| `frontend/src/components/InvestmentCalculator.jsx` | 0b0ef7c | Risk profiles, modal bg, Recharts colors, range inputs |
| `frontend/src/components/WinePriceCompare.jsx` | 9e0ab44 | Collapsed button, spinner, price rows, numeric fields |
| `frontend/src/components/Bottle3D.jsx` | 0f112a7 | Container bg (SVG presentation attrs kept as hex) |
| `frontend/src/pages/Dashboard.jsx` | fc80bdf | Tabs, currency badges, wine list, table, form |
| `frontend/src/pages/MarketIndex.jsx` | 3f4b1b7 | Header, chart, performance cards, benchmark, composition |
| `frontend/src/pages/MarketSentiment.jsx` | 765f9c7 | Gauge colors, region cards, news dots, emoji replaced |
| `frontend/src/pages/WineCellar.jsx` | 2f8b0ec | Slot colors, stats, shelf, list items, modals |
| `frontend/src/pages/WineJournal.jsx` | a3b49e7 | StarRating, entry cards, filter chips, modal |
| `frontend/src/pages/InvestmentGoals.jsx` | f041345 | ProgressBar, goal cards, detail tiles, add modal |
| `frontend/src/pages/LabelScanner.jsx` | b9db065 | Container, states (idle/scan/result/error), buttons |
| `frontend/src/pages/NotificationSettings.jsx` | d7d513c | Loading, toggle, push, frequency, regions, price inputs |

## Token coverage

All `--vi-*` tokens applied where a matching hex existed:
- `--vi-bg`, `--vi-bg-elev`, `--vi-surface`, `--vi-border`
- `--vi-text`, `--vi-text-dim`
- `--vi-accent`, `--vi-positive`, `--vi-negative`
- `--vi-font-display`, `--vi-font-sans`
- `fontVariantNumeric: "tabular-nums"` on all numeric data cells

## Intentional non-substitutions

- `#818cf8` (purple) — WineCellar "Unique Wines" stat, NotificationSettings wine type chips: kept as semantic brand color
- `#60a5fa` (blue) — WineCellar "young" bottle status: kept as semantic indicator
- `#fb923c` (orange) — MarketSentiment Barossa/Rioja region: kept, no token exists
- `#86efac`, `#fb923c` in VintageScore intermediate steps: kept, no tokens exist
- `#722F37` wine burgundy in PriceHistoryChart area fill: kept, no token exists
- `#fbbf24`, `#a78bfa` benchmark colors in MarketIndex: kept, intentional differentiation
- SVG presentation attributes (`fill=`, `stroke=` in Bottle3D, GaugeMeter SVG text) — CSS vars don't work in SVG presentation attributes, only in `style=""` attributes; kept as hex

## Emoji removals

Decorative emoji removed from headings: `🍾`, `📖`, `🎯`, `⚙️`, `📊` (×2), `💡`.
Functional display emoji replaced with styled geometric indicators:
- `🍷` → gold square `<span>` with `borderRadius: 6, background: rgba(201,162,39,0.15)`
- `⚠️` → styled circle with `border: 2px solid var(--vi-negative)`
- `🎯` → styled circle with `border: 2px solid var(--vi-accent)`, inner `◎`
- `📁` → text only ("Upload Photo")
- News item `📈/📰` → colored dot `<span>` (positive / text-dim)

## Recharts constraint respected

On all charts (PriceHistoryChart, InvestmentCalculator, MarketIndex):
- Changed ONLY: `stroke`/`fill` colors, `CartesianGrid stroke`, `Tooltip contentStyle/itemStyle/labelStyle`
- Never touched: data logic, axis formatters, chart dimensions, `ComposedChart width`
- `ResponsiveContainer` was not present — constraint upheld

## No new dependencies

`package.json` and lockfile untouched. All changes are pure CSS-var substitutions in inline JSX styles.
