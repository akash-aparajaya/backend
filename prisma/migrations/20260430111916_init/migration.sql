/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `environmentServiceId` on the `environment_service_providers` table. All the data in the column will be lost.
  - You are about to drop the `environment_services` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[environmentId,serviceTypeId,providerId]` on the table `environment_service_providers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `environmentId` to the `environment_service_providers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceTypeId` to the `environment_service_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'VIEWER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "environment_service_providers" DROP CONSTRAINT "environment_service_providers_environmentServiceId_fkey";

-- DropForeignKey
ALTER TABLE "environment_services" DROP CONSTRAINT "environment_services_environmentId_fkey";

-- DropForeignKey
ALTER TABLE "environment_services" DROP CONSTRAINT "environment_services_serviceTypeId_fkey";

-- DropIndex
DROP INDEX "environment_service_providers_environmentServiceId_provider_key";

-- AlterTable
ALTER TABLE "environment_service_providers" DROP COLUMN "environmentServiceId",
ADD COLUMN     "environmentId" TEXT NOT NULL,
ADD COLUMN     "serviceTypeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "environment_services";

-- CreateIndex
CREATE UNIQUE INDEX "environment_service_providers_environmentId_serviceTypeId_p_key" ON "environment_service_providers"("environmentId", "serviceTypeId", "providerId");

-- AddForeignKey
ALTER TABLE "environment_service_providers" ADD CONSTRAINT "environment_service_providers_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "environments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_service_providers" ADD CONSTRAINT "environment_service_providers_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "service_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
