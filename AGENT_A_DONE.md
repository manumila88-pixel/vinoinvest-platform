# AGENT A — STEP 0 COMPLETE

Branch: redesign/global

## Files committed

- `frontend/src/styles/tokens.css` — design tokens, colors extracted from actual project palette
- `frontend/src/styles/utilities.css` — utility classes (.vi-interactive, .vi-btn, .vi-card, .vi-reveal)
- `frontend/src/App.jsx` — imports tokens.css + utilities.css at lines 85-86
- `REDESIGN_CONTRACT.md` — committed to repo
- `frontend/src/pages/AuctionTracker.jsx` — tokens applied (no hardcoded colors)
- `frontend/src/pages/EnPrimeur.jsx` — tokens applied
- `frontend/src/pages/PressKit.jsx` — tokens applied (color palette reference uses #C9A227)
- `frontend/src/pages/ReferralPage.jsx` — tokens applied
- `frontend/src/pages/Transparency.jsx` — tokens applied
- `frontend/src/pages/SharePortfolio.jsx` — tokens applied

## Palette source of truth (extracted from style.css + App.jsx grep)

| Token | Value | Source |
|-------|-------|--------|
| `--vi-bg` | `#0b1220` | `--bg-base` dark |
| `--vi-bg-elev` | `#0f172a` | `--input-bg` (rgba 15,23,42) |
| `--vi-surface` | `rgba(11,18,32,0.85)` | `--bg-card` dark |
| `--vi-border` | `rgba(30,41,59,0.6)` | `--border-color` dark |
| `--vi-text` | `#e2e8f0` | `--text-primary` dark |
| `--vi-text-dim` | `#94a3b8` | `--text-secondary` dark |
| `--vi-accent` | `#C9A227` | `--gold` dark (64 usages) |
| `--vi-accent-2` | `#e0b82d` | gradient end in style.css:137 |
| `--vi-accent-glow` | `rgba(201,162,39,0.2)` | `--gold-dim` boosted |

Light theme tokens also defined under `[data-theme="light"]`.

## Bundle delta

No new dependencies added. No new imports beyond tokens.css + utilities.css.
Existing `style.css` remains in place (tokens complement, not replace).

## Dependencies NOT installed

None needed for foundation.

## Notes for Agent B and C

- Consume tokens with `var(--vi-*)`, never redefine.
- Use `.vi-btn`, `.vi-card`, `.vi-interactive`, `.vi-reveal` — never recreate.
- Light theme: override `[data-theme="light"]` already in tokens.css.
- `--vi-accent` = `#C9A227` gold, `--vi-accent-2` = `#e0b82d` lighter gold for hover.
