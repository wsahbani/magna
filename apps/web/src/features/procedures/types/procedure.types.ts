export interface Procedure {
  id: string
  processId: string
  title: string
  code: string
  description?: string
  objective?: string
  scope?: string
  status: 'DRAFT' | 'IN_REVIEW' | 'VALIDATED' | 'PUBLISHED' | 'ARCHIVED' | 'OBSOLETE'
  validatedBy?: string
  validatedAt?: string
  effectiveDate?: string
  expirationDate?: string
  createdById?: string
  createdAt: string
  updatedAt: string
  process?: {
    id: string
    title: string
    code: string
  }
  _count?: {
    nodes: number
    edges: number
    lanes: number
    versions: number
  }
}

export interface ProcedureWithRelations extends Procedure {
  nodes?: DiagramNode[]
  edges?: DiagramEdge[]
  lanes?: DiagramLane[]
}

export interface DiagramNode {
  id: string
  // Support multi-niveaux - un seul doit être défini
  macroProcessId?: string  // Niveau 1
  processId?: string      // Niveau 2
  procedureId?: string    // Niveau 3
  // Référence vers l'entité créée (si nœud représente Process ou Procedure)
  referencedEntityId?: string   // ID du Process ou Procedure créé
  referencedEntityType?: string  // 'PROCESS' ou 'PROCEDURE'
  nodeId: string // Frontend identifier
  type: QualigramNodeType
  label: string
  description?: string
  positionX: number
  positionY: number
  width?: number
  height?: number
  laneId?: string
  duration?: number
  dueDate?: string
  responsible?: string
  accountable?: string
  consulted?: string
  informed?: string
  data?: Record<string, unknown>
  style?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface DiagramEdge {
  id: string
  // Support multi-niveaux - un seul doit être défini
  macroProcessId?: string  // Niveau 1
  processId?: string       // Niveau 2
  procedureId?: string     // Niveau 3
  edgeId: string // Frontend identifier
  sourceId: string
  targetId: string
  type: QualigramEdgeType
  label?: string
  condition?: string
  animated?: boolean
  style?: Record<string, unknown>
  data?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface DiagramLane {
  id: string
  // Support multi-niveaux - un seul doit être défini
  macroProcessId?: string  // Niveau 1
  processId?: string       // Niveau 2
  procedureId?: string     // Niveau 3
  laneId: string // Frontend identifier
  name: string
  color?: string
  order: number
  height?: number
  collapsed?: boolean
  data?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ProcedureVersion {
  id: string
  procedureId: string
  version: string
  versionNumber: number
  changeLog?: string
  status: string
  nodesSnapshot: DiagramNode[]
  edgesSnapshot: DiagramEdge[]
  lanesSnapshot: DiagramLane[]
  metadata?: Record<string, unknown>
  validatedBy?: string
  validator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  validatedAt?: string
  createdAt: string
}

export type QualigramNodeType =
  | 'START'
  | 'END'
  | 'ACTIVITY'
  | 'DECISION'
  | 'SUBPROCESS'
  | 'DOCUMENT'
  | 'COMMENT'
  | 'CONNECTOR'
  | 'GATEWAY_AND'
  | 'GATEWAY_OR'
  | 'GATEWAY_XOR'
  | 'EVENT_TIMER'
  | 'EVENT_MESSAGE'
  | 'PROCESS_NODE'    // Représente un Process dans un MacroProcess
  | 'PROCEDURE_NODE'  // Représente une Procedure dans un Process

export type QualigramEdgeType = 'SEQUENCE' | 'CONDITIONAL' | 'DEFAULT' | 'MESSAGE'

export interface CreateProcedureDto {
  processId: string
  title: string
  code: string
  workspaceId: string
  departmentId?: string
  description?: string
  objective?: string
  scope?: string
}

export interface UpdateProcedureDto {
  title?: string
  code?: string
  description?: string
  objective?: string
  scope?: string
}

export interface CreateDiagramNodeDto {
  // Support multi-niveaux - un seul doit être défini
  macroProcessId?: string  // Niveau 1
  processId?: string       // Niveau 2
  procedureId?: string     // Niveau 3
  nodeId: string
  type: QualigramNodeType
  label: string
  description?: string
  positionX: number
  positionY: number
  width?: number
  height?: number
  laneId?: string
  duration?: number
  responsible?: string
  accountable?: string
  consulted?: string
  informed?: string
  data?: Record<string, unknown>
  style?: Record<string, unknown>
}

export interface CreateDiagramEdgeDto {
  // Support multi-niveaux - un seul doit être défini
  macroProcessId?: string  // Niveau 1
  processId?: string       // Niveau 2
  procedureId?: string     // Niveau 3
  edgeId: string
  sourceId: string
  targetId: string
  type?: QualigramEdgeType
  label?: string
  condition?: string
  animated?: boolean
  style?: Record<string, unknown>
  data?: Record<string, unknown>
}

export interface CreateDiagramLaneDto {
  // Support multi-niveaux - un seul doit être défini
  macroProcessId?: string  // Niveau 1
  processId?: string       // Niveau 2
  procedureId?: string    // Niveau 3
  laneId: string
  name: string
  color?: string
  order?: number
  height?: number
  collapsed?: boolean
  data?: Record<string, unknown>
}

export interface ValidationResult {
  isValid: boolean
  errors: Array<{
    code: string
    message: string
    nodeId?: string
    edgeId?: string
    laneId?: string
  }>
  warnings: Array<{
    code: string
    message: string
    nodeId?: string
    edgeId?: string
  }>
}

