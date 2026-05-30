import cron from "node-cron";
import { smsWorker } from "../workers/sms.worker.js";

const cronFlags = {
  sms: false,
  email: false,
  cleanup: false,
};

export const smsCron = () => {
  cron.schedule("*/3 * * * * *", async () => {
    if (cronFlags.sms) return;

    cronFlags.sms = true;

    try {
      console.log("Running SMS Worker...");
      await smsWorker();
    } catch (error) {
      console.error("SMS Cron Error:", error);
    } finally {
      cronFlags.sms = false;
    }
  });
};
