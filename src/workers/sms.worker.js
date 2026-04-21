import { Worker } from "bullmq";
import prisma from "../config/prisma.js";
import { sendSMS } from "../services/twilio.service.js";
import logger from "../utils/logger.js";
import { redisConnection } from "../config/redis.js";

logger.verbose("💬 SMS Worker started");

export const smsWorker = new Worker(
  "smsQueue",
  async (job) => {
    try {
      logger.debug("📩 Job received");

      const { to, message, projectId } = job.data;

      const result = await sendSMS({ to, message });

      logger.debug("✅ SMS sent successfully");

      await prisma.requestLog.create({
        data: {
          projectId,
          serviceType: "SMS",
          status: "SUCCESS",
          requestData: job.data,
          responseData: result,
          apiKeyId: job.data.apiKeyId || null,
        },
      });

      return result;
    } catch (error) {
      logger.error("❌ Failed to send SMS:", error);
      await prisma.requestLog.create({
        data: {
          projectId,
          serviceType: "SMS",
          status: "FAILED",
          requestData: job.data,
          error: error.message,
          apiKeyId: job.data.apiKeyId || null,
        },
      });

      throw error;
    }
  },
  {
    connection: redisConnection, 
  },
);