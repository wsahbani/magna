-- CreateEnum
CREATE TYPE "workspace_types" AS ENUM ('GROUPE', 'ENTITY', 'DIRECTION', 'DEPARTMENT', 'TEAM');

-- CreateEnum
CREATE TYPE "workspace_roles" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'REVIEWER', 'VIEWER');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('INTERNE', 'EXTERNE');

-- CreateEnum
CREATE TYPE "process_priorities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "confidentiality_levels" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL');

-- CreateEnum
CREATE TYPE "ProcessType" AS ENUM ('FLOW', 'SIPOC', 'BPMN');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "node_types" AS ENUM ('START_EVENT', 'END_EVENT', 'INTERMEDIATE_EVENT', 'TASK', 'USER_TASK', 'SERVICE_TASK', 'SCRIPT_TASK', 'SEND_TASK', 'RECEIVE_TASK', 'MANUAL_TASK', 'BUSINESS_RULE_TASK', 'SUBPROCESS', 'CALL_ACTIVITY', 'EXCLUSIVE_GATEWAY', 'INCLUSIVE_GATEWAY', 'PARALLEL_GATEWAY', 'EVENT_GATEWAY', 'COMPLEX_GATEWAY', 'DATA_OBJECT', 'DATA_STORE', 'POOL', 'LANE', 'TEXT_ANNOTATION', 'GROUP', 'DEBUT', 'FIN', 'INSTRUCTION', 'SOUS_PROCEDURE', 'MACRO_INSTRUCTION', 'INSTRUCTION_COLLAB', 'ACTION_AMONT', 'ACTION_AVAL', 'DOCUMENT_REF', 'MOYEN_REF', 'INPUT_NODE', 'OUTPUT_NODE', 'CUSTOM_NODE');

-- CreateEnum
CREATE TYPE "edge_types" AS ENUM ('SEQUENCE_FLOW', 'CONDITIONAL_FLOW', 'DEFAULT_FLOW', 'MESSAGE_FLOW', 'ASSOCIATION', 'DATA_ASSOCIATION', 'PARALLEL_FLOW', 'EXCLUSIVE_FLOW', 'INCLUSIVE_FLOW', 'SEQUENCE', 'CONDITION', 'MESSAGE', 'CONTROL_FLOW', 'DATA_FLOW', 'RESOURCE_FLOW');

-- CreateEnum
CREATE TYPE "handle_positions" AS ENUM ('TOP', 'RIGHT', 'BOTTOM', 'LEFT');

-- CreateEnum
CREATE TYPE "icon_positions" AS ENUM ('LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'CENTER');

-- CreateEnum
CREATE TYPE "node_status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'ERROR', 'WARNING');

-- CreateEnum
CREATE TYPE "path_types" AS ENUM ('STRAIGHT', 'SMOOTH_STEP', 'STEP', 'BEZIER', 'SIMPLE_BEZIER');

-- CreateEnum
CREATE TYPE "edge_status" AS ENUM ('ACTIVE', 'INACTIVE', 'CONDITIONAL', 'COMPLETED');

-- CreateEnum
CREATE TYPE "layout_directions" AS ENUM ('LEFT_TO_RIGHT', 'RIGHT_TO_LEFT', 'TOP_TO_BOTTOM', 'BOTTOM_TO_TOP');

-- CreateEnum
CREATE TYPE "minimap_positions" AS ENUM ('TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT');

-- CreateEnum
CREATE TYPE "controls_positions" AS ENUM ('TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT');

-- CreateEnum
CREATE TYPE "background_types" AS ENUM ('DOTS', 'LINES', 'CROSS', 'NONE');

-- CreateEnum
CREATE TYPE "ConstraintType" AS ENUM ('DELAI', 'QUANTITY', 'COST');

-- CreateEnum
CREATE TYPE "ControlType" AS ENUM ('HYGIENE', 'ENVIRONNEMENT', 'QUALITE', 'SECURITE', 'REGLEMENTAIRE');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "audit_actions" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT');

-- CreateEnum
CREATE TYPE "notification_types" AS ENUM ('PROCESS_CREATED', 'PROCESS_UPDATED', 'PROCESS_PUBLISHED', 'PROCESS_ARCHIVED', 'APPROVAL_REQUESTED', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED', 'COMMENT_ADDED', 'ASSIGNMENT_CREATED', 'REVIEW_DUE', 'WORKSPACE_INVITATION');

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "type" "workspace_types" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "role" "workspace_roles" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_settings" (
    "id" TEXT NOT NULL,
    "allowExternalUsers" BOOLEAN NOT NULL DEFAULT false,
    "requireApproval" BOOLEAN NOT NULL DEFAULT true,
    "maxProcessLevels" INTEGER NOT NULL DEFAULT 4,
    "customFields" JSONB,
    "notificationSettings" JSONB,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "workspace_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedPassword" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetToken" TEXT,
    "resetTokenExp" TIMESTAMP(3),
    "departmentId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "unitId" TEXT,
    "color" TEXT,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProcessType" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "ProcessStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" "process_priorities" NOT NULL DEFAULT 'MEDIUM',
    "confidentiality" "confidentiality_levels" NOT NULL DEFAULT 'INTERNAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "parentId" TEXT,
    "workspaceId" TEXT NOT NULL,
    "departmentId" TEXT,
    "authorName" TEXT,
    "validatorName" TEXT,
    "approverName" TEXT,
    "applicationScope" TEXT,
    "objectives" TEXT,
    "resources" TEXT,
    "indicators" TEXT,
    "risks" TEXT,
    "improvements" TEXT,
    "documentationLinks" TEXT,
    "customFields" JSONB,
    "createdById" TEXT NOT NULL,
    "currentDraftId" TEXT,
    "currentPublishedId" TEXT,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_versions" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ProcessStatus" NOT NULL,
    "releasedAt" TIMESTAMP(3),
    "changesLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nodes" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "type" "node_types" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "width" DOUBLE PRECISION DEFAULT 120,
    "height" DOUBLE PRECISION DEFAULT 80,
    "zIndex" INTEGER DEFAULT 1,
    "sourcePosition" "handle_positions" DEFAULT 'RIGHT',
    "targetPosition" "handle_positions" DEFAULT 'LEFT',
    "isConnectable" BOOLEAN NOT NULL DEFAULT true,
    "isDraggable" BOOLEAN NOT NULL DEFAULT true,
    "isSelectable" BOOLEAN NOT NULL DEFAULT true,
    "style" JSONB,
    "className" TEXT,
    "backgroundColor" TEXT,
    "borderColor" TEXT,
    "borderWidth" INTEGER DEFAULT 1,
    "borderRadius" INTEGER DEFAULT 4,
    "fontSize" INTEGER DEFAULT 12,
    "fontColor" TEXT DEFAULT '#000000',
    "fontWeight" TEXT DEFAULT 'normal',
    "opacity" DOUBLE PRECISION DEFAULT 1.0,
    "icon" TEXT,
    "iconPosition" "icon_positions" DEFAULT 'LEFT',
    "iconSize" INTEGER DEFAULT 16,
    "iconColor" TEXT,
    "hoverStyle" JSONB,
    "selectedStyle" JSONB,
    "errorStyle" JSONB,
    "animation" TEXT,
    "animationDuration" INTEGER DEFAULT 1000,
    "transition" TEXT,
    "roleId" TEXT,
    "subProcessId" TEXT,
    "isMacro" BOOLEAN NOT NULL DEFAULT false,
    "isCollaborative" BOOLEAN NOT NULL DEFAULT false,
    "linkedDocumentId" TEXT,
    "linkedInstructionId" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "validationRules" JSONB,
    "businessRules" JSONB,
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "slaTime" INTEGER,
    "status" "node_status" NOT NULL DEFAULT 'ACTIVE',
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB,
    "metadata" JSONB,
    "tags" TEXT[],
    "parentNodeId" TEXT,
    "groupId" TEXT,
    "layerId" TEXT,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edges" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "type" "edge_types" NOT NULL DEFAULT 'SEQUENCE_FLOW',
    "label" TEXT,
    "animated" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "style" JSONB,
    "className" TEXT,
    "strokeColor" TEXT DEFAULT '#b1b1b7',
    "strokeWidth" DOUBLE PRECISION DEFAULT 1.5,
    "strokeDasharray" TEXT,
    "markerStart" TEXT,
    "markerEnd" TEXT DEFAULT 'arrowclosed',
    "markerSize" INTEGER DEFAULT 20,
    "labelStyle" JSONB,
    "labelShowBg" BOOLEAN NOT NULL DEFAULT true,
    "labelBgStyle" JSONB,
    "labelBgPadding" JSONB,
    "labelBgBorderRadius" INTEGER DEFAULT 2,
    "pathType" "path_types" NOT NULL DEFAULT 'SMOOTH_STEP',
    "sourceHandle" TEXT,
    "targetHandle" TEXT,
    "condition" TEXT,
    "isAnd" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER DEFAULT 0,
    "probability" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "estimatedTime" INTEGER,
    "actualTime" INTEGER,
    "status" "edge_status" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "tags" TEXT[],

    CONSTRAINT "edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_layouts" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "viewportX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "viewportY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "viewportZoom" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "layoutDirection" "layout_directions" NOT NULL DEFAULT 'LEFT_TO_RIGHT',
    "nodeSpacing" INTEGER NOT NULL DEFAULT 50,
    "rankSpacing" INTEGER NOT NULL DEFAULT 100,
    "snapToGrid" BOOLEAN NOT NULL DEFAULT true,
    "gridSize" INTEGER NOT NULL DEFAULT 20,
    "showGrid" BOOLEAN NOT NULL DEFAULT true,
    "showMinimap" BOOLEAN NOT NULL DEFAULT true,
    "minimapPosition" "minimap_positions" NOT NULL DEFAULT 'BOTTOM_RIGHT',
    "showControls" BOOLEAN NOT NULL DEFAULT true,
    "controlsPosition" "controls_positions" NOT NULL DEFAULT 'BOTTOM_LEFT',
    "backgroundType" "background_types" NOT NULL DEFAULT 'DOTS',
    "backgroundColor" TEXT DEFAULT '#fafafa',
    "autoLayout" BOOLEAN NOT NULL DEFAULT false,
    "layoutAlgorithm" TEXT DEFAULT 'dagre',
    "customSettings" JSONB,

    CONSTRAINT "process_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "nodeType" "node_types" NOT NULL,
    "defaultStyle" JSONB NOT NULL,
    "defaultSize" JSONB NOT NULL,
    "icon" TEXT,
    "thumbnail" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "node_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nodeStyles" JSONB NOT NULL,
    "edgeStyles" JSONB NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#1976d2',
    "secondaryColor" TEXT NOT NULL DEFAULT '#dc004e',
    "successColor" TEXT NOT NULL DEFAULT '#388e3c',
    "errorColor" TEXT NOT NULL DEFAULT '#d32f2f',
    "warningColor" TEXT NOT NULL DEFAULT '#f57c00',
    "fontFamily" TEXT NOT NULL DEFAULT '''Roboto'', sans-serif',
    "fontSize" JSONB NOT NULL,
    "spacing" JSONB NOT NULL,
    "borderRadius" JSONB NOT NULL,
    "workspaceId" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paniers" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "sourceRole" TEXT,
    "targetRole" TEXT,
    "isInput" BOOLEAN NOT NULL DEFAULT false,
    "isOutput" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "paniers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_inputs" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceRole" TEXT NOT NULL,

    CONSTRAINT "process_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_outputs" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,

    CONSTRAINT "process_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constraints" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "type" "ConstraintType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "constraints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "control_indicators" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "type" "ControlType" NOT NULL,

    CONSTRAINT "control_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "processId" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "means" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "processId" TEXT,

    CONSTRAINT "means_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "processId" TEXT,
    "nodeId" TEXT,
    "parentId" TEXT,
    "resolvedById" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_requests" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processId" TEXT,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_confirmations" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_assignments" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "process_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "process_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProcessType" NOT NULL,
    "level" INTEGER NOT NULL,
    "template" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "process_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "audit_actions" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "notification_types" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "processId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProcessToProcessTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_code_key" ON "workspaces"("code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_workspaceId_code_key" ON "departments"("workspaceId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_userId_workspaceId_key" ON "workspace_members"("userId", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_settings_workspaceId_key" ON "workspace_settings"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "processes_currentDraftId_key" ON "processes"("currentDraftId");

-- CreateIndex
CREATE UNIQUE INDEX "processes_currentPublishedId_key" ON "processes"("currentPublishedId");

-- CreateIndex
CREATE INDEX "processes_workspaceId_status_idx" ON "processes"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "processes_departmentId_idx" ON "processes"("departmentId");

-- CreateIndex
CREATE INDEX "processes_type_level_idx" ON "processes"("type", "level");

-- CreateIndex
CREATE UNIQUE INDEX "processes_workspaceId_name_version_key" ON "processes"("workspaceId", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "process_versions_processId_version_key" ON "process_versions"("processId", "version");

-- CreateIndex
CREATE INDEX "nodes_versionId_idx" ON "nodes"("versionId");

-- CreateIndex
CREATE INDEX "nodes_type_idx" ON "nodes"("type");

-- CreateIndex
CREATE INDEX "nodes_status_idx" ON "nodes"("status");

-- CreateIndex
CREATE INDEX "nodes_groupId_idx" ON "nodes"("groupId");

-- CreateIndex
CREATE INDEX "edges_versionId_idx" ON "edges"("versionId");

-- CreateIndex
CREATE INDEX "edges_type_idx" ON "edges"("type");

-- CreateIndex
CREATE INDEX "edges_status_idx" ON "edges"("status");

-- CreateIndex
CREATE UNIQUE INDEX "edges_versionId_fromId_toId_key" ON "edges"("versionId", "fromId", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "process_layouts_versionId_key" ON "process_layouts"("versionId");

-- CreateIndex
CREATE INDEX "node_templates_category_idx" ON "node_templates"("category");

-- CreateIndex
CREATE INDEX "node_templates_nodeType_idx" ON "node_templates"("nodeType");

-- CreateIndex
CREATE UNIQUE INDEX "node_templates_workspaceId_name_key" ON "node_templates"("workspaceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "process_themes_workspaceId_name_key" ON "process_themes"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "comments_processId_idx" ON "comments"("processId");

-- CreateIndex
CREATE INDEX "comments_nodeId_idx" ON "comments"("nodeId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "approval_requests_versionId_userId_key" ON "approval_requests"("versionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_confirmations_versionId_userId_key" ON "reading_confirmations"("versionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "process_assignments_processId_userId_roleId_key" ON "process_assignments"("processId", "userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "process_tags_workspaceId_name_key" ON "process_tags"("workspaceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "process_templates_workspaceId_name_key" ON "process_templates"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "_ProcessToProcessTag_AB_unique" ON "_ProcessToProcessTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProcessToProcessTag_B_index" ON "_ProcessToProcessTag"("B");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_currentDraftId_fkey" FOREIGN KEY ("currentDraftId") REFERENCES "process_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_currentPublishedId_fkey" FOREIGN KEY ("currentPublishedId") REFERENCES "process_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_versions" ADD CONSTRAINT "process_versions_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "process_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_subProcessId_fkey" FOREIGN KEY ("subProcessId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_linkedDocumentId_fkey" FOREIGN KEY ("linkedDocumentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_linkedInstructionId_fkey" FOREIGN KEY ("linkedInstructionId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_parentNodeId_fkey" FOREIGN KEY ("parentNodeId") REFERENCES "nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "process_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_toId_fkey" FOREIGN KEY ("toId") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_layouts" ADD CONSTRAINT "process_layouts_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "process_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_templates" ADD CONSTRAINT "node_templates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_templates" ADD CONSTRAINT "node_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_themes" ADD CONSTRAINT "process_themes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paniers" ADD CONSTRAINT "paniers_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "process_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_inputs" ADD CONSTRAINT "process_inputs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_outputs" ADD CONSTRAINT "process_outputs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constraints" ADD CONSTRAINT "constraints_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_indicators" ADD CONSTRAINT "control_indicators_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "means" ADD CONSTRAINT "means_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "process_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_confirmations" ADD CONSTRAINT "reading_confirmations_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "process_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_confirmations" ADD CONSTRAINT "reading_confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_assignments" ADD CONSTRAINT "process_assignments_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_assignments" ADD CONSTRAINT "process_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_assignments" ADD CONSTRAINT "process_assignments_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_tags" ADD CONSTRAINT "process_tags_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_templates" ADD CONSTRAINT "process_templates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_templates" ADD CONSTRAINT "process_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcessToProcessTag" ADD CONSTRAINT "_ProcessToProcessTag_A_fkey" FOREIGN KEY ("A") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcessToProcessTag" ADD CONSTRAINT "_ProcessToProcessTag_B_fkey" FOREIGN KEY ("B") REFERENCES "process_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
