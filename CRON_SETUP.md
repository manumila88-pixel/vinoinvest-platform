# Render Backend Keep-Alive — Setup Guide

Render free tier sleeps after 15 minutes of inactivity.
Use **cron-job.org** (free) to ping `/api/health` every 10 minutes.

## Setup Steps

1. Go to [cron-job.org](https://cron-job.org) and create a free account.

2. Click **Create cron job** and fill in:

   | Field | Value |
   |-------|-------|
   | Title | VinoInvest Keep-Alive |
   | URL | `https://vinoinvest-backend-2.onrender.com/api/health` |
   | Schedule | Every **10 minutes** |
   | Request method | GET |
   | Expected HTTP status | 200 |

3. Save and enable the job.

## Verification

After enabling, wait 10 minutes and check the job log in cron-job.org.
You should see `200 OK` responses with body `{"status":"ok","ts":...}`.

## Alternative: UptimeRobot

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free tier: 50 monitors).
2. Add HTTP(S) monitor:
   - URL: `https://vinoinvest-backend-2.onrender.com/api/health`
   - Interval: 5 minutes
3. This also gives you downtime alerts by email.

## Notes

- The health endpoint is `GET /api/health` → responds `{"status":"ok","ts":<unix_ms>}`
- Frontend also pings `/api/health` on load and shows a banner if the backend is cold-starting
- For production, consider upgrading to Render Starter ($7/month) which does not sleep
