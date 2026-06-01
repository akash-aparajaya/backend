import prisma from "../config/prisma.js";

/* -----------------------------
   ⚙️ CONFIGURATION
------------------------------ */
const BATCH_SIZE = 500;

const RETENTION_DAYS = 30;
const STUCK_MINUTES = 10;
const MAX_FAILED_RETRY = 5;

/* -----------------------------
   ⏳ HELPERS
------------------------------ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getDateBeforeDays = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const getDateBeforeMinutes = (min) =>
  new Date(Date.now() - min * 60 * 1000);

/* -----------------------------
   🧹 BATCH DELETE ENGINE
------------------------------ */
const deleteInBatches = async (model, where, label) => {
  while (true) {
    const records = await model.findMany({
      where,
      take: BATCH_SIZE,
      select: { id: true },
    });

    // 🟢 No more data → stop
    if (records.length === 0) {
      console.log(`🟡 ${label}: nothing to clean`);
      break;
    }

    await model.deleteMany({
      where: {
        id: { in: records.map((r) => r.id) },
      },
    });

    console.log(`🧹 ${label}: deleted ${records.length}`);

    await sleep(150);
  }
};

/* -----------------------------
   🚀 CLEANUP WORKER
------------------------------ */
export const cleanupWorker = async () => {
  console.log("🔄 Cleanup worker started...");

  try {
    /* -----------------------------
       📧 EMAIL CLEANUP
    ------------------------------ */
    await deleteInBatches(
      prisma.emailQueue,
      {
        status: "SENT",
        created_at: {
          lt: getDateBeforeDays(RETENTION_DAYS),
        },
      },
      "Email cleanup"
    );

    /* -----------------------------
       📩 SMS CLEANUP
    ------------------------------ */
    await deleteInBatches(
      prisma.smsQueue,
      {
        status: "SENT",
        created_at: {
          lt: getDateBeforeDays(RETENTION_DAYS),
        },
      },
      "SMS cleanup"
    );

    /* -----------------------------
       🔁 RESET STUCK JOBS
    ------------------------------ */
    const resetStuck = await prisma.emailQueue.updateMany({
      where: {
        status: "PROCESSING",
        locked_at: {
          lt: getDateBeforeMinutes(STUCK_MINUTES),
        },
      },
      data: {
        status: "PENDING",
        locked_at: null,
      },
    });

    console.log(`🔁 Reset stuck jobs: ${resetStuck.count}`);

    /* -----------------------------
       ❌ DELETE FAILED JOBS
    ------------------------------ */
    const deletedFailed = await prisma.emailQueue.deleteMany({
      where: {
        status: "FAILED",
        retry_count: {
          gte: MAX_FAILED_RETRY,
        },
      },
    });

    console.log(`❌ Deleted failed jobs: ${deletedFailed.count}`);

    console.log("✅ Cleanup worker finished successfully");
  } catch (error) {
    console.error("❌ Cleanup worker error:", error);
  }
};