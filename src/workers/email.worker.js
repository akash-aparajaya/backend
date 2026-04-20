import { Worker } from "bullmq";
import prisma from "../config/prisma.js";
import { sendEmail } from "../services/email.service.js";
import { redisConnection } from "../config/redis.js";

export const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, message, projectId } = job.data;

    try {
      const result = await sendEmail({ to, subject, message });

      await prisma.requestLog.create({
        data: {
          projectId,
          serviceType: "EMAIL",
          status: "SUCCESS",
          requestData: job.data,
          responseData: result,
        },
      });

      return result;
    } catch (error) {
      await prisma.requestLog.create({
        data: {
          projectId,
          serviceType: "EMAIL",
          status: "FAILED",
          requestData: job.data,
          error: error.message,
        },
      });

      throw error;
    }
  },
  {
    connection: redisConnection,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  }
);