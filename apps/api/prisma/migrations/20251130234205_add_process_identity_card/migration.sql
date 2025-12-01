-- CreateTable
CREATE TABLE "process_identity_cards" (
    "fip_id" TEXT NOT NULL,
    "documentId" UUID NOT NULL,
    "processId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "objectives" TEXT,
    "scope" TEXT,
    "indicators" JSONB,
    "stakeholders" JSONB,
    "risks" JSONB,
    "opportunities" JSONB,
    "resources" JSONB,
    "performanceTargets" JSONB,

    CONSTRAINT "process_identity_cards_pkey" PRIMARY KEY ("fip_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "process_identity_cards_documentId_key" ON "process_identity_cards"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "process_identity_cards_processId_key" ON "process_identity_cards"("processId");

-- CreateIndex
CREATE INDEX "process_identity_cards_processId_idx" ON "process_identity_cards"("processId");

-- CreateIndex
CREATE INDEX "process_identity_cards_status_idx" ON "process_identity_cards"("status");

-- AddForeignKey
ALTER TABLE "process_identity_cards" ADD CONSTRAINT "process_identity_cards_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_identity_cards" ADD CONSTRAINT "process_identity_cards_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

