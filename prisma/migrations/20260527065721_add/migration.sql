-- AlterTable
ALTER TABLE "environments" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
