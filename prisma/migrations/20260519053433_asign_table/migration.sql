/*
  Warnings:

  - You are about to drop the `environment_lists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `provider_name` to the `environment_service_providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "environment_service_providers" ADD COLUMN     "provider_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "environment_lists";

-- CreateTable
CREATE TABLE "environment_employees" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environment_employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "environment_employees_public_id_key" ON "environment_employees"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_employees_environment_id_user_id_project_id_key" ON "environment_employees"("environment_id", "user_id", "project_id");

-- AddForeignKey
ALTER TABLE "environment_employees" ADD CONSTRAINT "environment_employees_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_employees" ADD CONSTRAINT "environment_employees_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_employees" ADD CONSTRAINT "environment_employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;
