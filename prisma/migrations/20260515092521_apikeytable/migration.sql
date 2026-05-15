-- CreateEnum
CREATE TYPE "ApiKeyMode" AS ENUM ('SANDBOX', 'LIVE');

-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "mode" "ApiKeyMode" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_api_key_key" ON "ApiKeys"("api_key");
