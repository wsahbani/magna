/**
 * FlowDiagram Type Definitions
 * Types for FlowDiagram, FlowNode, and FlowEdge used in ReactFlow
 */

import { FlowNodeType } from './enums'
import { Node, Edge } from '@xyflow/react'

export interface FlowDiagram {
  id: string
  level: number // 1=ProcessMap, 2=Process, 3=Procedure
  entityId: string // ID of ProcessMap, Process, or Procedure
  nodes: FlowNode[]
  edges: FlowEdge[]
  snapshot?: any
  createdAt: string
  updatedAt: string
}

export interface FlowNode {
  id: string
  diagramId: string
  rfId: string // ReactFlow ID
  type: FlowNodeType
  label?: string
  position: {
    x: number
    y: number
  }
  data?: any
  entityType?: string // PROCESS, PROCEDURE, STEP
  referencedEntityId?: string // ID of Process/Procedure created
  createdAt: string
  updatedAt: string
}

export interface FlowEdge {
  id: string
  diagramId: string
  rfId: string // ReactFlow ID
  sourceRfId: string // rfId of source FlowNode
  targetRfId: string // rfId of target FlowNode
  label?: string
  condition?: string
  data?: any
  createdAt: string
  updatedAt: string
}

/**
 * ReactFlow Node/Edge types for ProcessMap FlowDiagram (level 1)
 * Nodes represent Process entities (level 2)
 */
export interface ProcessMapFlowNode extends Node {
  type: 'process'
  data: {
    processId?: string // ID of the Process entity
    processCode?: string
    processTitle?: string
    description?: string
  }
}

export interface ProcessMapFlowEdge extends Edge {
  type?: 'smoothstep' | 'straight' | 'step'
  label?: string
  condition?: string
}

/**
 * Save Flow DTOs
 */
export interface SaveFlowDto {
  processMapId?: string // For level 1
  processId?: string // For level 2
  procedureId?: string // For level 3
  nodes: SaveNodeDto[]
  edges: SaveEdgeDto[]
  flowDirection?: 'HORIZONTAL' | 'VERTICAL'
}

export interface SaveNodeDto {
  id?: string // rfId
  type: string
  label?: string
  positionX: number
  positionY: number
  width?: number
  height?: number
  data?: any
  description?: string
  action?: 'create' | 'update' | 'delete'
}

export interface SaveEdgeDto {
  id?: string // rfId
  source: string // rfId of source node
  target: string // rfId of target node
  type?: string
  label?: string
  condition?: string
  animated?: boolean
  style?: any
  data?: any
  action?: 'create' | 'update' | 'delete'
}

/**
 * Flow Response from API
 */
export interface FlowResponse {
  processMapId?: string
  processId?: string
  procedureId?: string
  diagramId: string | null
  nodes: Node[]
  edges: Edge[]
  flowDirection?: 'HORIZONTAL' | 'VERTICAL'
}

