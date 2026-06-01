-- AlterTable
ALTER TABLE "environment_service_providers" ADD COLUMN     "last_error_message" TEXT,
ADD COLUMN     "last_failed_at" TIMESTAMP(3);
