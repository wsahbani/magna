-- AlterEnum
ALTER TYPE "ProcedureStatus" ADD VALUE 'IN_REVIEW';
ALTER TYPE "ProcedureStatus" ADD VALUE 'VALIDATED';

-- CreateTable
CREATE TABLE "process_map_validation_requests" (
    "id" TEXT NOT NULL,
    "processMapId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "status" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_map_validation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedure_validation_requests" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "status" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procedure_validation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_map_validation_requests_processMapId_validatorId_key" ON "process_map_validation_requests"("processMapId", "validatorId");

-- CreateIndex
CREATE INDEX "process_map_validation_requests_processMapId_idx" ON "process_map_validation_requests"("processMapId");

-- CreateIndex
CREATE INDEX "process_map_validation_requests_validatorId_idx" ON "process_map_validation_requests"("validatorId");

-- CreateIndex
CREATE INDEX "process_map_validation_requests_status_idx" ON "process_map_validation_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "procedure_validation_requests_procedureId_validatorId_key" ON "procedure_validation_requests"("procedureId", "validatorId");

-- CreateIndex
CREATE INDEX "procedure_validation_requests_procedureId_idx" ON "procedure_validation_requests"("procedureId");

-- CreateIndex
CREATE INDEX "procedure_validation_requests_validatorId_idx" ON "procedure_validation_requests"("validatorId");

-- CreateIndex
CREATE INDEX "procedure_validation_requests_status_idx" ON "procedure_validation_requests"("status");

-- AddForeignKey
ALTER TABLE "process_map_validation_requests" ADD CONSTRAINT "process_map_validation_requests_processMapId_fkey" FOREIGN KEY ("processMapId") REFERENCES "process_maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_map_validation_requests" ADD CONSTRAINT "process_map_validation_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_map_validation_requests" ADD CONSTRAINT "process_map_validation_requests_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_validation_requests" ADD CONSTRAINT "procedure_validation_requests_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "procedures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_validation_requests" ADD CONSTRAINT "procedure_validation_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_validation_requests" ADD CONSTRAINT "procedure_validation_requests_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

