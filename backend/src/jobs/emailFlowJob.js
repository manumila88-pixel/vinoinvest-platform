/**
 * Email Flow Job — hourly cron for 180-day sequences
 * Runs every hour, checks inactive users daily at 09:00
 */
import cron from "node-cron";
import { processScheduledFlows, checkInactiveUsers } from "../services/emailFlowService.js";

// Every hour: process scheduled flow emails
cron.schedule("0 * * * *", async () => {
  await processScheduledFlows();
});

// Daily at 09:00: check for inactive users (7-day trigger)
cron.schedule("0 9 * * *", async () => {
  await checkInactiveUsers();
}, { timezone: "Europe/Rome" });

console.log("[emailFlowJob] Registered — hourly flow + daily inactive check at 09:00 CET");
