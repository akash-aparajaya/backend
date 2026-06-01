import cron from "node-cron";
import { smsWorker } from "../workers/sms.worker.js";
import { emailWorker } from "../workers/email.worker.js";
// import { whatsappWorker } from "../workers/whatsapp.worker.js";
 import { cleanupWorker } from "../workers/cleanup.worker.js";

const cronFlags = {
  sms: false,
  email: false,
  whatsapp: false,
  cleanup: false,
};

// =====================================================
// SMS CRON
// =====================================================

export const smsCron = () => {
  cron.schedule("* * * * * *", async () => {
    if (cronFlags.sms) return;

    cronFlags.sms = true;

    try {
      await smsWorker();
    } catch (error) {
      console.error("SMS Cron Error:", error);
    } finally {
      cronFlags.sms = false;
    }
  });

  console.log("✅ SMS Cron Started");
};

// =====================================================
// EMAIL CRON
// =====================================================

export const emailCron = () => {
  cron.schedule("* * * * * *", async () => {
    if (cronFlags.email) return;

    cronFlags.email = true;

    try {
      await emailWorker();
    } catch (error) {
      console.error("Email Cron Error:", error);
    } finally {
      cronFlags.email = false;
    }
  });

  console.log("✅ Email Cron Started");
};

// =====================================================
// WHATSAPP CRON (Future)
// =====================================================

// export const whatsappCron = () => {
//   cron.schedule("* * * * * *", async () => {
//     if (cronFlags.whatsapp) return;

//     cronFlags.whatsapp = true;

//     try {
//       await whatsappWorker();
//     } catch (error) {
//       console.error("WhatsApp Cron Error:", error);
//     } finally {
//       cronFlags.whatsapp = false;
//     }
//   });

//   console.log("✅ WhatsApp Cron Started");
// };

// =====================================================
// CLEANUP CRON (Daily Midnight)
// =====================================================

export const cleanupCron = () => {
  cron.schedule("0 0 * * *", async () => {
    if (cronFlags.cleanup) {
      console.log("⛔ Cleanup already running, skipping...");
      return;
    }

    cronFlags.cleanup = true;

    console.log("🧹 Cleanup Cron Started");

    try {
      await cleanupWorker();
      console.log("✅ Cleanup Cron Completed");
    } catch (error) {
      console.error("❌ Cleanup Cron Error:", error);
    } finally {
      cronFlags.cleanup = false;
    }
  });

  console.log("🚀 Cleanup Cron Initialized");
};
