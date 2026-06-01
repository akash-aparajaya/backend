import prisma from "../config/prisma.js";
import { sendEmailProvider } from "../services/sendEmail.service.js";
import logger from "../utils/logger.js";

const WORKER_ID = `email-worker-${process.pid}`;

// ============================================================================
// EMAIL WORKER
// ============================================================================

export const emailWorker = async () => {
  try {
    // ==========================================================================
    // 1. FIND & LOCK ONE JOB ATOMICALLY
    // ==========================================================================

    const job = await prisma.$transaction(async (tx) => {
      const found = await tx.emailQueue.findFirst({
        where: {
          status: "PENDING",

          // only process jobs that are due
          scheduled_at: {
            lte: new Date(),
          },

          // lock recovery
          OR: [
            {
              locked_at: null,
            },
            {
              locked_at: {
                lt: new Date(Date.now() - 60 * 1000),
              },
            },
          ],
        },

        select: {
          id: true,
          public_id: true,

          recipient: true,
          subject: true,
          message: true,

          priority: true,
          priority_value: true,

          project_id: true,
          environment_id: true,
          provider_id: true,

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

      if (!found) return null;

      // ======================================================================
      // ATOMIC LOCK
      // ======================================================================

      const locked = await tx.emailQueue.updateMany({
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

    // ==========================================================================
    // NO JOB FOUND
    // ==========================================================================

    if (!job) {
      return;
    }

    logger.info(`Processing Email Job: ${job.public_id}`);

    // ==========================================================================
    // 2. GET EMAIL SERVICE TYPE
    // ==========================================================================

    const serviceType = await prisma.serviceType.findFirst({
      where: {
        slug: "email",
        is_active: true,
      },

      select: {
        public_id: true,
      },
    });

    if (!serviceType) {
      console.error("Email service type not found");

      await prisma.emailQueue.update({
        where: {
          id: job.id,
        },

        data: {
          status: "FAILED",
          error_message: "Email service type not found",
          processed_at: new Date(),
          locked_at: null,
          locked_by: null,
        },
      });

      return;
    }

    // ==========================================================================
    // 3. GET ACTIVE PROVIDERS IN SORT ORDER
    // ==========================================================================

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

        mode: true,

        credentials: true,

        sort_order: true,
      },

      orderBy: [
        {
          sort_order: "asc",
        },
      ],
    });

    // ==========================================================================
    // 4. NO PROVIDERS CONFIGURED
    // ==========================================================================

    if (!providers.length) {
      await prisma.emailQueue.updateMany({
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

          error_message: "No active email provider found",

          processed_at: new Date(),

          locked_at: null,

          locked_by: null,
        },
      });

      return;
    }

    // ==========================================================================
    // 5. TRY PROVIDERS IN SORT ORDER
    // ==========================================================================

    let sent = false;

    let lastProviderError = null;

    let failedProvider = null;

    for (const provider of providers) {
      try {
        logger.info(
          `Trying provider: ${provider.provider_slug} (sort: ${provider.sort_order})`,
        );

        const result = await sendEmailProvider({
          to: job.recipient,

          subject: job.subject,

          message: job.message,

          provider: {
            provider_slug: provider.provider_slug,

            credentials: provider.credentials,
          },
        });

        // ====================================================================
        // SUCCESS
        // ====================================================================

        await prisma.emailQueue.update({
          where: {
            id: job.id,
          },

          data: {
            status: "SENT",

            sent_at: new Date(),

            processed_at: new Date(),

            response_payload:
              typeof result === "object"
                ? JSON.parse(JSON.stringify(result))
                : result,

            provider_id: provider.provider_id,

            locked_at: null,

            locked_by: null,
          },
        });

        sent = true;

        logger.info(`Email sent successfully using ${provider.provider_slug}`);

        break;
      } catch (providerError) {
        failedProvider = provider.provider_slug;

        lastProviderError = providerError.message;

        logger.warn(
          `id ${provider.public_id} - Provider ${provider.provider_slug} failed: ${providerError.message}`,
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

    // ==========================================================================
    // 6. ALL PROVIDERS FAILED
    // ==========================================================================

    if (!sent) {
      const shouldRetry = job.attempts + 1 < job.max_attempts;

      await prisma.emailQueue.update({
        where: {
          id: job.id,
        },

        data: {
          attempts: job.attempts + 1,

          status: shouldRetry ? "PENDING" : "FAILED",

          error_message: lastProviderError || "All email providers failed",

          processed_at: !shouldRetry ? new Date() : null,

          response_payload: {
            failed_provider: failedProvider,
          },

          locked_at: null,

          locked_by: null,
        },
      });

      logger.warn(
        shouldRetry
          ? `Email job ${job.public_id} scheduled for retry`
          : `Email job ${job.public_id} permanently failed`,
      );
    }
  } catch (error) {
    console.error("Email Worker Error:", error);

    logger.error(`Email Worker Error: ${error.message}`);
  }

  logger.verbose("Email Worker is running...");
};
