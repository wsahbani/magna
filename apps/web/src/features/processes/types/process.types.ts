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
  macroId?: string // Nouveau : relation vers MacroProcess
  code: string
  title: string // Nouveau : titre Qualigram
  name: string // Conservé pour compatibilité
  description?: string
  objectif?: string // Nouveau
  perimetre?: string // Nouveau
  finalite?: string // Nouveau
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
  approvalDate?: string // Nouveau
  nextReviewDate?: string // Nouveau
  reviewFrequency?: number // Nouveau
  parent?: Process
  children?: Process[]
  macro?: {
    id: string
    name: string
    code: string
    color?: string
  }
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
    actors: number
    processIOs: number
    processIndicators: number
    processRisks: number
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
  data?: Record<string, unknown>
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
  macroId?: string // Nouveau
  code: string
  title: string // Nouveau
  name?: string // Conservé pour compatibilité
  description?: string
  objectif?: string // Nouveau
  perimetre?: string // Nouveau
  finalite?: string // Nouveau
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
  macroId?: string // Nouveau : filtre par MacroProcess
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

// Nouveaux types pour les métadonnées Qualigram
export interface ProcessActor {
  id: string
  processId: string
  name: string
  type: 'ROLE' | 'DEPARTMENT' | 'EXTERNAL' | 'SYSTEM'
  role?: string
  responsibilities?: string
  order: number
}

export interface ProcessIO {
  id: string
  processId: string
  name: string
  description?: string
  type?: string
  isInput: boolean
  order: number
}

export interface Indicator {
  id: string
  processId: string
  name: string
  description?: string
  formula?: string
  target?: string
  frequency?: string
  unit?: string
  order: number
}

export interface Risk {
  id: string
  processId: string
  description: string
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  probability?: number
  impact?: number
  mitigation?: string
  owner?: string
  order: number
}

export interface LinkedDocument {
  id: string
  processId?: string
  procedureId?: string
  name: string
  reference?: string
  type: 'INPUT' | 'OUTPUT' | 'REFERENCE' | 'TEMPLATE' | 'RECORD'
  url?: string
  filePath?: string
  version?: string
  order: number
  createdAt: string
  updatedAt: string
}
