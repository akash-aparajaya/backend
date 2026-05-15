/*
  Warnings:

  - You are about to drop the column `apiKeyHash` on the `environments` table. All the data in the column will be lost.
  - You are about to drop the column `apiKeyLastFour` on the `environments` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `environments` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `environments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `environments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `environment_name` to the `environments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "environments_apiKeyHash_key";

-- DropIndex
DROP INDEX "environments_projectId_slug_key";

-- AlterTable
ALTER TABLE "environments" DROP COLUMN "apiKeyHash",
DROP COLUMN "apiKeyLastFour",
DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "environment_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "environments_projectId_key" ON "environments"("projectId");
