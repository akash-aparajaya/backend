-- AlterTable
ALTER TABLE "EmailQueue" ADD COLUMN     "priority_value" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "WhatsAppQueue" ADD COLUMN     "priority_value" INTEGER NOT NULL DEFAULT 2;
