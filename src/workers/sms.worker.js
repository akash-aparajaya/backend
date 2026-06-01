import prisma from "../config/prisma.js";
import { sendSmsProvider } from "../services/sendSms.service.js";
import logger from "../utils/logger.js";

const WORKER_ID = `sms-worker-${process.pid}`;

export const smsWorker = async () => {
  try {
    // =====================================================
    // 1. FIND & LOCK NEXT PENDING SMS JOB
    // =====================================================

    const job = await prisma.$transaction(async (tx) => {
      const found = await tx.smsQueue.findFirst({
        where: {
          status: "PENDING",

          OR: [
            {
              locked_at: null,
            },
            {
              locked_at: {
                lt: new Date(Date.now() - 60 * 1000), // stale lock recovery
              },
            },
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

        orderBy: [
          {
            priority_value: "desc",
          },
          {
            created_at: "asc",
          },
        ],
      });

      if (!found) {
        return null;
      }

      // =====================================================
      // 2. LOCK JOB (PREVENT DOUBLE PROCESSING)
      // =====================================================

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

      if (locked.count === 0) {
        return null;
      }

      return found;
    });

    // =====================================================
    // NO JOBS AVAILABLE
    // =====================================================

    if (!job) {
      //logger.info("No pending SMS jobs");
      return;
    }

    logger.info(`Processing SMS Job: ${job.id}`);

    // =====================================================
    // 3. GET SMS SERVICE TYPE
    // =====================================================

    const serviceType = await prisma.serviceType.findFirst({
      where: {
        slug: "sms",
        name: "SMS",
        is_active: true,
      },

      select: {
        public_id: true,
      },
    });

    if (!serviceType) {
      throw new Error("SMS Service Type not found");
    }

    // =====================================================
    // 4. GET ACTIVE PROVIDERS
    // SORT ORDER = FAILOVER PRIORITY
    // =====================================================

    const providers = await prisma.environmentServiceProvider.findMany({
      where: {
        environment_id: job.environment_id,
        service_type_id: serviceType.public_id,
        mode: job.mode,
        is_active: true,
      },

      select: {
        id: true,
        public_id: true,
        provider_id: true,
        provider_slug: true,
        credentials: true,
        sort_order: true,
      },

      orderBy: [
        {
          sort_order: "asc",
        },
      ],
    });

    logger.info("SMS Providers:", providers);

    // =====================================================
    // 5. NO PROVIDERS FOUND
    // FAIL ALL RELATED JOBS
    // =====================================================

    if (!providers.length) {
      await prisma.smsQueue.updateMany({
        where: {
          environment_id: job.environment_id,
          project_id: job.project_id,
          mode: job.mode,

          status: {
            in: ["PENDING", "PROCESSING"],
          },
        },

        data: {
          status: "FAILED",
          error_message: "No active SMS provider found",

          locked_at: null,
          locked_by: null,

          processed_at: new Date(),
        },
      });

      return;
    }

    // =====================================================
    // 6. TRY PROVIDERS IN SORT ORDER
    // =====================================================

    let sent = false;

    for (const provider of providers) {
      try {
        logger.info(
          `Trying Provider: ${provider.provider_slug} | Order: ${provider.sort_order}`,
        );

        const result = await sendSmsProvider({
          to: job.recipient,
          message: job.message,

          provider: {
            provider_slug: provider.provider_slug,
            credentials: provider.credentials,
          },
        });

        // =====================================================
        // SUCCESS
        // =====================================================

        await prisma.smsQueue.update({
          where: {
            id: job.id,
          },

          data: {
            status: "SENT",

            sent_at: new Date(),
            processed_at: new Date(),

            response_payload: result,

            provider_id: provider.provider_id,

            locked_at: null,
            locked_by: null,
          },
        });

        logger.info(`SMS sent successfully using ${provider.provider_slug}`);

        sent = true;

        break;
      } catch (providerError) {
        logger.warn(
          `Provider ${provider.provider_slug} failed: ${providerError.message}`,
        );
        await prisma.environmentServiceProvider.update({
          where: {
            id: provider.id,
            public_id: provider.public_id,
          },
          data: {
            last_error_message: providerError.message,
            last_failed_at: new Date(),
            is_active: false, // deactivate provider after failure
          },
        });

        // continue to next provider
      }
    }

    // =====================================================
    // 7. ALL PROVIDERS FAILED
    // =====================================================

    if (!sent) {
      const nextAttempt = job.attempts + 1;

      const shouldRetry = nextAttempt < job.max_attempts;

      await prisma.smsQueue.update({
        where: {
          id: job.id,
        },

        data: {
          attempts: nextAttempt,

          status: shouldRetry ? "PENDING" : "FAILED",

          error_message: "All SMS providers failed",

          processed_at: shouldRetry ? null : new Date(),

          locked_at: null,
          locked_by: null,
        },
      });

      logger.info(
        shouldRetry
          ? `SMS Job ${job.id} returned to queue for retry`
          : `SMS Job ${job.id} marked FAILED`,
      );
    }
  } catch (error) {
    console.error("SMS Worker Error:", error);
    logger.error(`SMS Worker Error: ${error.message}`);
  }

  logger.verbose("SMS Worker is running...");
};
