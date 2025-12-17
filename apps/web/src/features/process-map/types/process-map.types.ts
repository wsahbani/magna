/**
 * ProcessMap Type Definitions
 */

import { ProcessStatus } from './enums'

export interface ProcessMap {
  id: string
  title: string
  code: string
  description?: string
  status: ProcessStatus
  workspaceId: string
  departmentId?: string
  createdById: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  archivedAt?: string
  processes?: ProcessSummary[]
  flowDiagram?: FlowDiagramSummary
  workspace?: WorkspaceSummary
  department?: DepartmentSummary
  createdBy?: UserSummary
  _count?: {
    processes: number
    comments: number
    documents: number
    tags: number
  }
}

export interface ProcessSummary {
  id: string
  title: string
  code: string
  status: ProcessStatus
  type?: string
}

export interface FlowDiagramSummary {
  id: string
  level: number
  nodesCount?: number
  edgesCount?: number
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

export interface CreateProcessMapDto {
  title: string
  code: string
  description?: string
  workspaceId: string
  departmentId?: string
  status?: ProcessStatus
}

export interface UpdateProcessMapDto {
  title?: string
  code?: string
  description?: string
  workspaceId?: string
  departmentId?: string
  status?: ProcessStatus
}

export interface ProcessMapListParams {
  workspaceId?: string
  page?: number
  limit?: number
  search?: string
  status?: ProcessStatus
}

export interface ProcessMapListResponse {
  data: ProcessMap[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

