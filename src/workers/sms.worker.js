import prisma from "../config/prisma.js";
import { sendSmsProvider } from "../services/sendSms.service.js";
import logger from "../utils/logger.js";

const WORKER_ID = `sms-worker-${process.pid}`;

// run every 5 seconds
export const smsWorker = async () => {
  try {
    // 1. FIND & LOCK JOB ATOMICALLY IN TRANSACTION
    const job = await prisma.$transaction(async (tx) => {
      // 1.1. GET PENDING JOB

      const found = await tx.smsQueue.findFirst({
        where: {
          status: "PENDING",
          OR: [
            { locked_at: null },
            { locked_at: { lt: new Date(Date.now() - 60 * 1000) } },
          ],
        },
        select: {
          id: true,
          status: true,
          priority: true,
          priority_value: true,
          recipient: true,
          message: true,
          project_id: true,
          environment_id: true,
          mode: true,
          attempts: true,
          max_attempts: true,
        },
        orderBy: [{ priority_value: "desc" }, { created_at: "asc" }],
      });

      if (!found) return null;

      // 2. ATOMIC LOCK — prevents double-claiming
      const locked = await tx.smsQueue.updateMany({
        where: {
          id: found.id,
          status: "PENDING",
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

    if (!job) {
      console.log("No pending jobs");
      return;
    }

    console.log("Processing job", job.id);

    // 3. GET ALL ACTIVE PROVIDERS IN SORT ORDER (for fallback)

    const getServiceTypeID = await prisma.ServiceType.findFirst({
      where: {
        slug: "sms",
        name: "SMS",
      },
      select: {
        public_id: true,
      },
    });

    const providers = await prisma.environmentServiceProvider.findMany({
      where: {
        environment_id: job.environment_id,
        service_type_id: getServiceTypeID.public_id,
        mode: job.mode,
        is_active: true,
      },
      select: {
        id: true,
        provider_id: true,
        provider_slug: true,
        mode: true,
        credentials: true,
        sort_order: true,
      },
      orderBy: [{ sort_order: "asc" }],
    });
    console.log(providers, "providers");
    // 4. IF NO ACTIVE PROVIDERS — FAIL ALL JOBS WITH SAME ENV + PROJECT + MODE
    if (!providers.length) {
      await prisma.smsQueue.updateMany({
        where: {
          environment_id: job.environment_id,
          project_id: job.project_id,
          mode: job.mode,
          status: "PROCESSING" || "PENDING", // only touch PENDING jobs
        },
        data: {
          status: "FAILED",
          error_message: "No active provider found",
          locked_at: null,
          locked_by: null,
        },
      });
      return;
    }

    // 5. TRY EACH PROVIDER IN SORT ORDER UNTIL ONE SUCCEEDS
    let sent = false;

    for (const provider of providers) {
      try {
        const result = await sendSmsProvider({
          to: job.recipient,
          message: job.message,
          provider: {
            credentials: provider.credentials,
            provider_slug: provider.provider_slug,
          },
        });

        await prisma.smsQueue.update({
          where: { id: job.id },
          data: {
            status: "SENT",
            sent_at: new Date(),
            processed_at: new Date(),
            response_payload: result,
            provider_id: provider.id, // track which provider actually sent
            locked_at: null,
            locked_by: null,
            provider_id: provider.provider_id,
          },
        });

        sent = true;
        break; // success — stop trying other providers
      } catch (providerError) {
        // warn and continue to next provider in sort order
        console.warn(`Provider ${provider.id} failed:`, providerError.message);
      }
    }

    // 6. ALL PROVIDERS FAILED — RETRY OR MARK FAILED
    if (!sent) {
      const shouldRetry = job.attempts + 1 < job.max_attempts;

      await prisma.smsQueue.update({
        where: { id: job.id },
        data: {
          attempts: job.attempts + 1,
          status: shouldRetry ? "PENDING" : "FAILED",
          error_message: "All providers failed",
          locked_at: null,
          locked_by: null,
        },
      });
    }
  } catch (error) {
    console.error("SMS Worker Error:", error.message);
  }

  logger.verbose("SMS Worker is running...");
};
