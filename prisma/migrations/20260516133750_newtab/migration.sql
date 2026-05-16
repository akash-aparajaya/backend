-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ApiKeyMode" AS ENUM ('SANDBOX', 'LIVE');

-- CreateTable
CREATE TABLE "service_types" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
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
    "required_credential_schema" JSONB NOT NULL,
    "base_endpoint" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environment_lists" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "environment_lists_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "environment_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
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
    "credentials" JSONB NOT NULL,
    "endpoint" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environment_service_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_logs" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "environment_service_provider_id" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "provider_slug" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "request_data" JSONB,
    "response_data" JSONB,
    "error" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retried_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_logs_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "service_types_public_id_key" ON "service_types"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_name_key" ON "service_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_slug_key" ON "service_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "providers_public_id_key" ON "providers"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "environment_lists_public_id_key" ON "environment_lists"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_lists_name_key" ON "environment_lists"("name");

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
CREATE UNIQUE INDEX "environment_service_providers_environment_id_service_type_i_key" ON "environment_service_providers"("environment_id", "service_type_id", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_logs_public_id_key" ON "request_logs"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_public_id_key" ON "api_keys"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_api_key_key" ON "api_keys"("api_key");

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
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_environment_service_provider_id_fkey" FOREIGN KEY ("environment_service_provider_id") REFERENCES "environment_service_providers"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "environments"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;
