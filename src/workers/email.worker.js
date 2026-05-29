// import { Worker } from "bullmq";
// import prisma from "../config/prisma.js";
// import { sendEmail } from "../services/email.service.js";
// import { redisConnection } from "../config/redis.js";
// import logger from "../utils/logger.js";

// logger.verbose("📧 Email Worker started");

// export const emailWorker = new Worker(
//   "emailQueue",
//   async (job) => {
//     const data = job?.data;

//     try {
     
//       logger.debug("📩 Job received");

//       const { to, subject, message, projectId } = data;

//       const result = await sendEmail({ to, subject, message });

//       logger.debug("✅ Email sent successfully");

//       await prisma.requestLog.create({
//         data: {
//           projectId,
//           serviceType: "EMAIL",
//           status: "SUCCESS",
//           requestData: data,
//           responseData: result,
//           apiKeyId: job.data.apiKeyId || null,
//         },
//       });

//       return result;
//     } catch (error) {
//       logger.error("❌ Email job failed", error);

//       try {
//         await prisma.requestLog.create({
//           data: {
//             projectId: data?.projectId,
//             serviceType: "EMAIL",
//             status: "FAILED",
//             requestData: data,
//             error: error.message,
//             apiKeyId: job.data.apiKeyId || null,
//           },
//         });
//       } catch (dbErr) {
//         logger.error("❌ DB logging failed", dbErr);
//       }

//       throw error;
//     }
//   },
//   {
//     connection: redisConnection,
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 2000,
//     },
//   }
// );
