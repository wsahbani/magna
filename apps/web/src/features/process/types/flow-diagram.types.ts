/**
 * Flow Diagram Types for Process (Level 2)
 */

import { FlowNodeType } from './enums'

export interface FlowDiagram {
  processId: string
  diagramId: string | null
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    procedureId?: string
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

export interface FlowEdge {
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

export interface SaveNodeDto {
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

export interface SaveEdgeDto {
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

export interface SaveProcessFlowDto {
  processId: string
  nodes: SaveNodeDto[]
  edges: SaveEdgeDto[]
  changesLog?: string
}

