/**
 * Flow Diagram Types for Procedure (Level 3)
 */

export interface ProcedureFlowDiagram {
  procedureId: string
  diagramId: string | null
  nodes: ProcedureFlowNode[]
  edges: ProcedureFlowEdge[]
  flowDirection?: 'HORIZONTAL' | 'VERTICAL'
}

/**
 * Swimlane Types
 */
export type SwimlaneOrientation = 'vertical' | 'horizontal'

/**
 * Lane Data - stored in pool.data.lanes
 */
export interface LaneData {
  id: string
  label: string
  size: number // height for horizontal, width for vertical
  color?: string
  collapsed?: boolean
}

/**
 * Pool Node Data - contains lanes in data.lanes array
 */
export interface PoolNodeData {
  label?: string
  orientation: SwimlaneOrientation
  lanes: LaneData[] // Lanes are stored here, not as separate nodes
  color?: string
  // Callbacks for the SwimlaneNode component
  onLabelChange?: (label: string) => void
  onToggleOrientation?: (poolId: string) => void
  onAddLane?: (poolId: string) => void
  onRemoveLane?: (poolId: string, laneId: string) => void
  onLaneResize?: (poolId: string, laneId: string, size: number) => void
  onLaneLabelChange?: (poolId: string, laneId: string, label: string) => void
  [key: string]: any
}

export interface LaneNodeData {
  label: string // Actor name, role, or department
  orientation: SwimlaneOrientation
  width?: number
  height?: number
  color?: string
  order: number
  collapsed?: boolean
  poolId?: string // ID of parent pool
  [key: string]: any
}

export interface ProcedureFlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    width?: number
    height?: number
    zIndex?: number
    parentNodeId?: string
    groupId?: string
    sourcePosition?: string
    targetPosition?: string
    isConnectable?: boolean
    isDraggable?: boolean
    isSelectable?: boolean
    style?: Record<string, any>
    // Swimlane specific
    orientation?: SwimlaneOrientation
    order?: number
    collapsed?: boolean
    poolId?: string
    laneId?: string
    [key: string]: any
  }
  width?: number
  height?: number
  parentNode?: string
  extent?: 'parent'
}

export interface ProcedureFlowEdge {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  animated?: boolean
  style?: Record<string, any>
  data?: {
    condition?: string
    [key: string]: any
  }
}

export interface SaveProcedureNodeDto {
  id: string
  type: string
  label: string
  positionX: number
  positionY: number
  width?: number
  height?: number
  description?: string
  parentNodeId?: string
  groupId?: string
  sourcePosition?: string
  targetPosition?: string
  isConnectable?: boolean
  isDraggable?: boolean
  isSelectable?: boolean
  zIndex?: number
  style?: Record<string, any>
  data?: {
    parentNode?: string
    [key: string]: any
  }
}

export interface SaveProcedureEdgeDto {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  animated?: boolean
  style?: Record<string, any>
  sourceHandle?: string
  targetHandle?: string
  pathType?: string
  data?: {
    condition?: string
    [key: string]: any
  }
}

export interface SaveProcedureFlowDto {
  procedureId: string
  nodes: SaveProcedureNodeDto[]
  edges: SaveProcedureEdgeDto[]
  changesLog?: string
  flowDirection?: 'HORIZONTAL' | 'VERTICAL'
}

