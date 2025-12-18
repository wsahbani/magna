-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "process_validation_requests" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "status" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_validation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_validation_requests_processId_validatorId_key" ON "process_validation_requests"("processId", "validatorId");

-- CreateIndex
CREATE INDEX "process_validation_requests_processId_idx" ON "process_validation_requests"("processId");

-- CreateIndex
CREATE INDEX "process_validation_requests_validatorId_idx" ON "process_validation_requests"("validatorId");

-- CreateIndex
CREATE INDEX "process_validation_requests_status_idx" ON "process_validation_requests"("status");

-- AddForeignKey
ALTER TABLE "process_validation_requests" ADD CONSTRAINT "process_validation_requests_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_validation_requests" ADD CONSTRAINT "process_validation_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_validation_requests" ADD CONSTRAINT "process_validation_requests_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

