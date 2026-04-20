import { Worker } from "bullmq";
import prisma from "../config/prisma.js";
import { sendSMS } from "../services/twilio.service.js";
import { redisConnection } from "../config/redis.js";

export const smsWorker = new Worker( "smsQueue", async (job) => {
    
    const { to, message, projectId } = job.data;
// console.log("Processing SMS job:", job.id, "Data:", job.data);
    try {
      const result = await sendSMS({ to, message });

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
    connection: redisConnection, // USE SINGLE CONNECTION
  }
);