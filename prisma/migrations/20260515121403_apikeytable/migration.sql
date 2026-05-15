/*
  Warnings:

  - Added the required column `project_id` to the `ApiKeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKeys" ADD COLUMN     "project_id" TEXT NOT NULL;
