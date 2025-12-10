/**
 * Flow Diagram Types for Procedure (Level 3)
 */

import { FlowNodeType } from '../../process/types/enums'

export interface ProcedureFlowDiagram {
  procedureId: string
  diagramId: string | null
  nodes: ProcedureFlowNode[]
  edges: ProcedureFlowEdge[]
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
}

