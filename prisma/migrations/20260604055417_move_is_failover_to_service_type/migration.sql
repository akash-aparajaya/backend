/*
  Warnings:

  - You are about to drop the column `is_failover` on the `environment_service_providers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "environment_service_providers" DROP COLUMN "is_failover";

-- AlterTable
ALTER TABLE "service_types" ADD COLUMN     "is_failover" BOOLEAN NOT NULL DEFAULT true;
