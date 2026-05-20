/*
  Warnings:

  - A unique constraint covering the columns `[environment_id,service_type_id,provider_id,mode]` on the table `environment_service_providers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "environment_service_providers_environment_id_service_type_i_key";

-- AlterTable
ALTER TABLE "environment_service_providers" ALTER COLUMN "mode" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "environment_service_providers_environment_id_service_type_i_key" ON "environment_service_providers"("environment_id", "service_type_id", "provider_id", "mode");
