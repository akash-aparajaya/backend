/*
  Warnings:

  - Added the required column `prefix` to the `ApiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKeys" ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "last_used_at" TIMESTAMP(3),
ADD COLUMN     "prefix" TEXT NOT NULL;
