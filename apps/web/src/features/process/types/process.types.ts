/**
 * Process (Level 2) Type Definitions
 */

import { ProcessStatus, ProcessType, ProcessPriority, ConfidentialityLevel } from './enums'

export interface Process {
  id: string
  title: string
  code: string
  description?: string
  type: ProcessType
  status: ProcessStatus
  processMapId: string
  workspaceId: string
  departmentId?: string
  objectif?: string
  perimetre?: string
  finalite?: string
  priority?: ProcessPriority
  confidentiality?: ConfidentialityLevel
  reviewFrequency?: number
  createdById: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  archivedAt?: string
  nextReviewDate?: string
  approvalDate?: string
  procedures?: ProcedureSummary[]
  flowDiagram?: FlowDiagramSummary
  processMap?: ProcessMapSummary
  workspace?: WorkspaceSummary
  department?: DepartmentSummary
  createdBy?: UserSummary
  _count?: {
    procedures: number
    actors: number
    processIOs: number
    comments: number
    documents: number
    tags: number
  }
}

export interface ProcedureSummary {
  id: string
  title: string
  code: string
  status: string
}

export interface FlowDiagramSummary {
  id: string
  level: number
  nodesCount?: number
  edgesCount?: number
}

export interface ProcessMapSummary {
  id: string
  title: string
  code: string
}

export interface WorkspaceSummary {
  id: string
  name: string
  code: string
}

export interface DepartmentSummary {
  id: string
  name: string
  code: string
}

export interface UserSummary {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface CreateProcessDto {
  title: string
  code: string
  description?: string
  processMapId: string
  workspaceId: string
  departmentId?: string
  type?: ProcessType
  status?: ProcessStatus
  objectif?: string
  perimetre?: string
  finalite?: string
  priority?: ProcessPriority
  confidentiality?: ConfidentialityLevel
  reviewFrequency?: number
}

export interface UpdateProcessDto {
  title?: string
  code?: string
  description?: string
  processMapId?: string
  workspaceId?: string
  departmentId?: string
  type?: ProcessType
  status?: ProcessStatus
  objectif?: string
  perimetre?: string
  finalite?: string
  priority?: ProcessPriority
  confidentiality?: ConfidentialityLevel
  reviewFrequency?: number
}

export interface ProcessListParams {
  processMapId?: string
  workspaceId?: string
  page?: number
  limit?: number
  search?: string
  status?: ProcessStatus
  type?: ProcessType
}

export interface ProcessListResponse {
  data: Process[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

