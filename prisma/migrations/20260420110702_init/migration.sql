/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,type]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_apiKey_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "apiKey";

-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "apiKeyId" TEXT;

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "lastFour" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_projectId_idx" ON "ApiKey"("projectId");

-- CreateIndex
CREATE INDEX "ApiKey_serviceType_idx" ON "ApiKey"("serviceType");

-- CreateIndex
CREATE INDEX "RequestLog_projectId_idx" ON "RequestLog"("projectId");

-- CreateIndex
CREATE INDEX "RequestLog_serviceType_idx" ON "RequestLog"("serviceType");

-- CreateIndex
CREATE INDEX "RequestLog_createdAt_idx" ON "RequestLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Service_projectId_type_key" ON "Service"("projectId", "type");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
