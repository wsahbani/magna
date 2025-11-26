/**
 * Process Type Definitions
 */

export enum ProcessLevel {
  FLOW = 1,
  SIPOC = 2,
  BPMN = 3,
}

export enum ProcessStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum NodeType {
  START_EVENT = 'START_EVENT',
  END_EVENT = 'END_EVENT',
  TASK = 'TASK',
  GATEWAY = 'GATEWAY',
  SUBPROCESS = 'SUBPROCESS',
}

export enum ProcessType {
  FLOW = 'FLOW',
  SIPOC = 'SIPOC',
  BPMN = 'BPMN',
  FORM = 'FORM',
  CHECKLIST = 'CHECKLIST',
}

export interface Process {
  id: string
  name: string
  description?: string
  code: string
  level: ProcessLevel
  type: ProcessType
  status: ProcessStatus
  version: string
  isActive: boolean
  workspaceId?: string
  parentId?: string
  createdById: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  parent?: Process
  children?: Process[]
  workspace?: {
    id: string
    name: string
    code: string
  }
  creator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  _count?: {
    children: number
    nodes: number
    edges: number
    versions: number
  }
}

export interface ProcessNode {
  id: string
  processId: string
  type: NodeType
  label: string
  description?: string
  roleId?: string
  position: {
    x: number
    y: number
  }
  data?: any
  role?: {
    id: string
    name: string
    color?: string
  }
}

export interface ProcessEdge {
  id: string
  processId: string
  sourceNodeId: string
  targetNodeId: string
  label?: string
  condition?: string
}

export interface ProcessVersion {
  id: string
  processId: string
  version: string
  status: ProcessStatus
  isDraft: boolean
  createdById: string
  createdAt: string
  publishedAt?: string
}

export interface CreateProcessDto {
  name: string
  description?: string
  code: string
  level: ProcessLevel
  workspaceId?: string
  parentId?: string
}

export interface UpdateProcessDto {
  name?: string
  description?: string
  code?: string
  level?: ProcessLevel
  workspaceId?: string
  parentId?: string
}

export interface UpdateProcessStatusDto {
  status: ProcessStatus
}

export interface ProcessListParams {
  page?: number
  limit?: number
  search?: string
  level?: ProcessLevel
  status?: ProcessStatus
  workspaceId?: string
  parentId?: string
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

// XyFlow Node Types
export interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    roleId?: string
    roleName?: string
    roleColor?: string
  }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
  type?: string
  animated?: boolean
}
