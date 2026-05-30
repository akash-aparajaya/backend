-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ApiKeyMode" AS ENUM ('SANDBOX', 'LIVE');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'RETRY');

-- CreateEnum
CREATE TYPE "PrioritySegment" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('OTP', 'TRANSACTION', 'MARKETING');

-- CreateTable
CREATE TABLE "service_types" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "service_base_endpoint" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "service_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "service_type_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "base_endpoint" TEXT NOT NULL,
    "required_credential_schema" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "phone_number" TEXT,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "reset_token" TEXT,
    "reset_token_expiry" TIMESTAMP(3),
    "refresh_token_hash" TEXT,
    "refresh_token_expires_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "environment_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environment_service_providers" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "service_type_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_name" TEXT NOT NULL,
    "mode" "ApiKeyMode" NOT NULL,
    "credentials" JSONB NOT NULL,
    "provider_slug" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environment_service_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "note" TEXT,
    "api_key" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "mode" "ApiKeyMode" NOT NULL,
    "expires_in_days" INTEGER,
    "expires_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "SmsQueue" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT,
    "environment_id" TEXT,
    "provider_id" TEXT,
    "mode" "ApiKeyMode" NOT NULL,
    "type" "MessageType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "template_name" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "PrioritySegment" NOT NULL DEFAULT 'MEDIUM',
    "priority_value" INTEGER NOT NULL DEFAULT 2,
    "idempotency_key" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "scheduled_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "locked_at" TIMESTAMP(3),
    "locked_by" TEXT,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailQueue" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT,
    "environment_id" TEXT,
    "provider_id" TEXT,
    "mode" TEXT,
    "type" "MessageType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "template_name" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "PrioritySegment" NOT NULL DEFAULT 'MEDIUM',
    "idempotency_key" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 2,
    "scheduled_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "locked_at" TIMESTAMP(3),
    "locked_by" TEXT,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppQueue" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT,
    "environment_id" TEXT,
    "provider_id" TEXT,
    "mode" TEXT,
    "type" "MessageType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "template_name" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "PrioritySegment" NOT NULL DEFAULT 'MEDIUM',
    "idempotency_key" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 2,
    "scheduled_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "locked_at" TIMESTAMP(3),
    "locked_by" TEXT,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_types_public_id_key" ON "service_types"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_slug_key" ON "service_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_name_key" ON "service_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "providers_public_id_key" ON "providers"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_id_key" ON "users"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_public_id_key" ON "projects"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "environments_public_id_key" ON "environments"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_service_providers_public_id_key" ON "environment_service_providers"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_service_providers_environment_id_service_type_i_key" ON "environment_service_providers"("environment_id", "service_type_id", "provider_id", "mode", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_public_id_key" ON "api_keys"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_api_key_key" ON "api_keys"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "environment_employees_public_id_key" ON "environment_employees"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_employees_environment_id_user_id_project_id_key" ON "environment_employees"("environment_id", "user_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "SmsQueue_public_id_key" ON "SmsQueue"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "SmsQueue_idempotency_key_key" ON "SmsQueue"("idempotency_key");

-- CreateIndex
CREATE INDEX "SmsQueue_status_idx" ON "SmsQueue"("status");

-- CreateIndex
CREATE INDEX "SmsQueue_scheduled_at_idx" ON "SmsQueue"("scheduled_at");

-- CreateIndex
CREATE INDEX "SmsQueue_locked_at_idx" ON "SmsQueue"("locked_at");

-- CreateIndex
CREATE INDEX "SmsQueue_project_id_idx" ON "SmsQueue"("project_id");

-- CreateIndex
CREATE INDEX "SmsQueue_provider_id_idx" ON "SmsQueue"("provider_id");

-- CreateIndex
CREATE INDEX "SmsQueue_environment_id_idx" ON "SmsQueue"("environment_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmailQueue_public_id_key" ON "EmailQueue"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmailQueue_idempotency_key_key" ON "EmailQueue"("idempotency_key");

-- CreateIndex
CREATE INDEX "EmailQueue_status_idx" ON "EmailQueue"("status");

-- CreateIndex
CREATE INDEX "EmailQueue_scheduled_at_idx" ON "EmailQueue"("scheduled_at");

-- CreateIndex
CREATE INDEX "EmailQueue_locked_at_idx" ON "EmailQueue"("locked_at");

-- CreateIndex
CREATE INDEX "EmailQueue_project_id_idx" ON "EmailQueue"("project_id");

-- CreateIndex
CREATE INDEX "EmailQueue_provider_id_idx" ON "EmailQueue"("provider_id");

-- CreateIndex
CREATE INDEX "EmailQueue_environment_id_idx" ON "EmailQueue"("environment_id");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppQueue_public_id_key" ON "WhatsAppQueue"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppQueue_idempotency_key_key" ON "WhatsAppQueue"("idempotency_key");

-- CreateIndex
CREATE INDEX "WhatsAppQueue_status_idx" ON "WhatsAppQueue"("status");

-- CreateIndex
CREATE INDEX "WhatsAppQueue_scheduled_at_idx" ON "WhatsAppQueue"("scheduled_at");

-- CreateIndex
CREATE INDEX "WhatsAppQueue_locked_at_idx" ON "WhatsAppQueue"("locked_at");

-- CreateIndex
CREATE INDEX "WhatsAppQueue_project_id_idx" ON "WhatsAppQueue"("project_id");

-- CreateIndex
CREATE INDEX "WhatsAppQueue_provider_id_idx" ON "WhatsAppQueue"("provider_id");

-- CreateIndex
CREATE INDEX "WhatsAppQueue_environment_id_idx" ON "WhatsAppQueue"("environment_id");

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_service_providers" ADD CONSTRAINT "environment_service_providers_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_service_providers" ADD CONSTRAINT "environment_service_providers_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_service_providers" ADD CONSTRAINT "environment_service_providers_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_employees" ADD CONSTRAINT "environment_employees_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_employees" ADD CONSTRAINT "environment_employees_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_employees" ADD CONSTRAINT "environment_employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsQueue" ADD CONSTRAINT "SmsQueue_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsQueue" ADD CONSTRAINT "SmsQueue_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsQueue" ADD CONSTRAINT "SmsQueue_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailQueue" ADD CONSTRAINT "EmailQueue_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailQueue" ADD CONSTRAINT "EmailQueue_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailQueue" ADD CONSTRAINT "EmailQueue_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppQueue" ADD CONSTRAINT "WhatsAppQueue_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppQueue" ADD CONSTRAINT "WhatsAppQueue_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppQueue" ADD CONSTRAINT "WhatsAppQueue_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;
