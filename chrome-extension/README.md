# VinoInvest Chrome Extension

## Installation (Developer Mode)

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this `chrome-extension/` folder

## Publishing to Chrome Web Store

1. Zip the `chrome-extension/` folder: `zip -r vinoinvest-extension.zip chrome-extension/`
2. Go to https://chrome.google.com/webstore/devconsole
3. Pay one-time $5 developer fee
4. Upload the zip, fill in store listing
5. Submit for review (usually 1-3 days)

## Features

- **AI Score overlay** on Wine-Searcher, Vivino, Tannico, Millesima, Idealwine
- **Quick search** from the popup
- **Direct links** to portfolio, cellar, alerts on VinoInvest
- Auto-detects wine name from current page

## Icons

Add PNG icons to `icons/` directory:
- `icon16.png` — 16×16px
- `icon48.png` — 48×48px  
- `icon128.png` — 128×128px

Use the 🍷 emoji rendered on `#020617` background.
