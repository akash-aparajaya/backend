-- CreateTable
CREATE TABLE "api_documentations" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "service_type_id" TEXT NOT NULL,
    "provider_id" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "header" TEXT,
    "input" TEXT,
    "output" TEXT,
    "headers" JSONB,
    "body" JSONB,
    "response" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "modified_by" TEXT,

    CONSTRAINT "api_documentations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_documentations_public_id_key" ON "api_documentations"("public_id");

-- CreateIndex
CREATE INDEX "api_documentations_service_type_id_idx" ON "api_documentations"("service_type_id");

-- CreateIndex
CREATE INDEX "api_documentations_provider_id_idx" ON "api_documentations"("provider_id");

-- CreateIndex
CREATE INDEX "api_documentations_is_active_idx" ON "api_documentations"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "api_documentations_service_type_id_provider_id_name_key" ON "api_documentations"("service_type_id", "provider_id", "name");

-- AddForeignKey
ALTER TABLE "api_documentations" ADD CONSTRAINT "api_documentations_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_types"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_documentations" ADD CONSTRAINT "api_documentations_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("public_id") ON DELETE SET NULL ON UPDATE CASCADE;
