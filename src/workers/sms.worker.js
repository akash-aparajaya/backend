// import { Worker } from "bullmq";
// import prisma from "../config/prisma.js";
// import { sendSMS } from "../services/twilio.service.js";
// import logger from "../utils/logger.js";
// import { redisConnection } from "../config/redis.js";

// logger.verbose("💬 SMS Worker started");

// export const smsWorker = new Worker(
//   "smsQueue",
//   async (job) => {
//     try {
//       logger.debug("📩 Job received");

//       const { to, message, projectId } = job.data;

//       const result = await sendSMS({ to, message });

//       logger.debug("✅ SMS sent successfully");

//       await prisma.requestLog.create({
//         data: {
//           projectId,
//           serviceType: "SMS",
//           status: "SUCCESS",
//           requestData: job.data,
//           responseData: result,
//           apiKeyId: job.data.apiKeyId || null,
//         },
//       });

//       return result;
//     } catch (error) {
//       logger.error("❌ Failed to send SMS:", error);
//       await prisma.requestLog.create({
//         data: {
//           projectId,
//           serviceType: "SMS",
//           status: "FAILED",
//           requestData: job.data,
//           error: error.message,
//           apiKeyId: job.data.apiKeyId || null,
//         },
//       });

//       throw error;
//     }
//   },
//   {
//     connection: redisConnection, 
//   },
// );

import prisma from "../config/prisma.js";
// import { sendSmsProvider } from "../providers/sms.provider.js";

const WORKER_ID = `sms-worker-${process.pid}`;

// run every 5 seconds
export const smsWorker = async () => {
  try {
    const job = await prisma.$transaction(async (tx) => {
      // 1. FIND ONE JOB
      const found = await tx.smsQueue.findFirst({
        where: {
          status: "PENDING",
          OR: [
            { locked_at: null },
            { locked_at: { lt: new Date(Date.now() - 60 * 1000) } },
          ],
        },
        orderBy: [
          { priority: "desc" },
          { created_at: "asc" },
        ],
      });

      if (!found) return console.log("No job found");

      // 2. ATOMIC LOCK (IMPORTANT FIX)
      const locked = await tx.smsQueue.updateMany({
        where: {
          id: found.id,
          status: "PENDING", // ensures no double claim
        },
        data: {
          status: "PROCESSING",
          locked_at: new Date(),
          locked_by: WORKER_ID,
        },
      });

      if (locked.count === 0) return null;

      return found;
    });

    if (!job) return;

    try {
      const result = await sendSmsProvider({
        to: job.recipient,
        message: job.message,
        provider_id: job.provider_id,
        mode: job.mode,
      });

      await prisma.smsQueue.update({
        where: { id: job.id },
        data: {
          status: "SENT",
          sent_at: new Date(),
          processed_at: new Date(),
          response_payload: result,
          locked_at: null,
          locked_by: null,
        },
      });
    } catch (sendError) {
      const shouldRetry =
        job.attempts + 1 < job.max_attempts;

      await prisma.smsQueue.update({
        where: { id: job.id },
        data: {
          attempts: job.attempts + 1,
          status: shouldRetry ? "PENDING" : "FAILED",
          error_message: sendError.message,
          locked_at: null,
          locked_by: null,
        },
      });
    }
  } catch (error) {
    console.error("SMS Worker Error:", error.message);
  }

  console.log("SMS Worker is running...");
};