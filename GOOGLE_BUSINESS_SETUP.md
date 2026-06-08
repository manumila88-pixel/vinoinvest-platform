# Google Business Profile — VinoInvest Setup Guide

## Goal

Create a verified Google Business Profile so VinoInvest appears in Google's Knowledge Panel, Maps, and local search results. This directly improves brand credibility and SEO authority.

---

## Step 1: Create the Profile

1. Go to **https://business.google.com**
2. Click **"Manage now"** or **"Add your business to Google"**
3. Sign in with the Google account you want to own the profile (use manumila88@gmail.com or a dedicated business account)

---

## Step 2: Enter Business Details

Fill in the following exactly as shown:

| Field | Value |
|-------|-------|
| Business name | `VinoInvest` |
| Category (primary) | `Financial technology company` |
| Category (secondary) | `Software company` |
| Website | `https://vinoinvest-platform.vercel.app` (update to `https://vinoinvest.com` when domain is live) |
| Phone | Add if available — improves verification trust |
| Address | Use your registered business address; if fully online, select "I deliver goods and services to my customers" and hide the address |

**Business Description (500 chars max):**
```
The Bloomberg Terminal for Fine Wine Investment. Real-time prices, AI scores, and portfolio tracking for fine wine investors and wealth managers. Track thousands of investment-grade wines, monitor price history, and discover high-potential bottles before the market moves.
```

---

## Step 3: Verification

Google requires ownership verification. For an online-only business use one of:

### Option A — Postcard (most common)
1. Select "Mail me my code"
2. Google sends a 5-digit code to your business address (5–14 days)
3. Return to business.google.com and enter the code under **"Verify location"**

### Option B — Phone/SMS (if offered)
1. Select "Call me" or "Text me"
2. Enter the code immediately when received

### Option C — Google Search Console (fastest if already verified)
1. First verify vinoinvest-platform.vercel.app in **https://search.google.com/search-console**
2. Add property → Domain or URL prefix → Verify via DNS or HTML tag
3. Back in Business Profile: select "Verify via Search Console" — Google links the two automatically
4. This is the recommended path since Search Console should already be set up for SEO

---

## Step 4: Optimize the Profile for Knowledge Panel

A Knowledge Panel appears on branded searches like "VinoInvest" when Google has enough confidence signals. Maximize signals by:

### Add Photos
- Upload a logo (minimum 720×720 px, PNG/JPG)
- Upload a cover image (1080×608 px) — use a screenshot of the platform dashboard
- Upload product screenshots under "Products" section

### Add Products/Services
1. Go to **Products** tab
2. Add:
   - **VinoInvest Pro** — Real-time wine price tracking and AI investment scores for professional investors
   - **VinoInvest Academy** — Educational content on fine wine investment strategies
   - **Portfolio Tracker** — Track your wine portfolio value and performance over time

### Add Business Hours
- Even for an online platform, set "Open 24 hours" or specify support hours

### Write Posts
- After verification, go to **Posts** tab
- Publish a launch post: "VinoInvest is live — the Bloomberg Terminal for fine wine. Track real-time prices on 10,000+ investment-grade wines."
- Posts appear in search results and support Knowledge Panel formation

---

## Step 5: Link to Website for SEO Benefit

### Add Organization Schema to the site
Ensure `frontend/index.html` contains the Organization schema (should already be present from prior SEO work):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VinoInvest",
  "url": "https://vinoinvest-platform.vercel.app",
  "sameAs": [
    "https://business.google.com/YOUR_PROFILE_ID"
  ]
}
```

The `sameAs` field explicitly tells Google to link your website to the Business Profile — this is the strongest signal for Knowledge Panel creation.

### Claim on Google Maps
If the business has any physical presence (even a registered office), add it to Google Maps separately via the same Business Profile dashboard.

---

## Step 6: Monitor and Maintain

- **URL to your profile**: `https://business.google.com/u/0/dashboard`
- **Public profile URL**: `https://g.page/YOURSLUG` (assigned after verification)
- Review responses, post updates monthly, add new photos quarterly
- Respond to any user questions in the Q&A section

---

## SEO Benefits Summary

| Action | SEO Benefit |
|--------|------------|
| Verified profile | Knowledge Panel on branded searches |
| Schema `sameAs` link | Confirms entity to Google's Knowledge Graph |
| Photos and posts | Higher click-through on search results |
| Products listed | Appears in Google Shopping signals |
| Search Console link | Cross-validates site ownership to Google |

---

## Timeline

- Day 1: Create profile, fill all details, submit for verification
- Day 5–14: Receive postcard or verify via Search Console (instant)
- Day 1–3 after verification: Profile goes live
- Week 2–4: Knowledge Panel may start appearing on branded searches
- Month 2–3: Full Knowledge Panel with photos, description, and links
