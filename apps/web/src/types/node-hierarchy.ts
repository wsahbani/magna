/**
 * Node Hierarchy Types
 * 
 * Defines parent-child relationships between nodes
 * Enables grouping, categorization, and hierarchical process organization
 */

import { Node } from '@xyflow/react'

/**
 * Extended node data with hierarchy support
 */
export interface NodeHierarchyData {
  label?: string
  description?: string
  
  // Hierarchy properties
  parentId?: string | null          // ID of parent node (null = root level)
  childIds?: string[]                // Array of child node IDs
  level?: number                     // Depth in hierarchy (0 = root)
  collapsed?: boolean                // Whether children are collapsed/hidden
  
  // Grouping properties
  isGroup?: boolean                  // Whether this node is a group/category
  groupType?: 'category' | 'subprocess' | 'container' | 'custom'
  
  // Metadata
  metadata?: {
    color?: string                   // Custom color for group
    icon?: string                    // Custom icon identifier
    expanded?: boolean               // UI state for expanded/collapsed
    [key: string]: any               // Additional custom properties
  }
  
  // Original data fields
  [key: string]: any
}

/**
 * Node with hierarchy support
 */
export interface HierarchicalNode extends Omit<Node, 'data'> {
  data: NodeHierarchyData
}

/**
 * Hierarchy relationship
 */
export interface NodeRelationship {
  parentId: string
  childId: string
  order?: number                     // Order within parent's children
}

/**
 * Group configuration
 */
export interface NodeGroup {
  id: string
  label: string
  type: 'category' | 'subprocess' | 'container' | 'custom'
  nodeIds: string[]                  // Nodes in this group
  parentGroupId?: string             // Nested groups support
  collapsed?: boolean
  color?: string
  metadata?: Record<string, any>
}

/**
 * Hierarchy validation result
 */
export interface HierarchyValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Move operation result
 */
export interface MoveNodesResult {
  success: boolean
  movedNodes: string[]
  updatedNodes: HierarchicalNode[]
  error?: string
}

/**
 * Hierarchy statistics
 */
export interface HierarchyStats {
  totalNodes: number
  rootNodes: number                  // Nodes with no parent
  groupNodes: number                 // Nodes marked as groups
  maxDepth: number                   // Maximum hierarchy depth
  averageChildrenPerParent: number
}

/**
 * Drag and drop context
 */
export interface DragContext {
  draggedNodeIds: string[]           // Currently dragged nodes
  relatedNodeIds: string[]           // Related nodes (children, connected)
  offset?: { x: number; y: number }  // Drag offset
}

/**
 * Batch operation for hierarchy changes
 */
export interface HierarchyBatchOperation {
  type: 'add' | 'remove' | 'move' | 'update'
  nodeId: string
  newParentId?: string | null
  previousParentId?: string | null
  data?: Partial<NodeHierarchyData>
}

/**
 * Constants
 */
export const HIERARCHY_CONSTANTS = {
  MAX_DEPTH: 10,                     // Maximum nesting level
  ROOT_LEVEL: 0,                     // Root level value
  DEFAULT_GROUP_TYPE: 'category' as const,
} as const

/**
 * Helper type guards
 */
export const isGroupNode = (node: Node): boolean => {
  return !!(node.data as NodeHierarchyData)?.isGroup
}

export const hasParent = (node: Node): boolean => {
  return !!(node.data as NodeHierarchyData)?.parentId
}

export const hasChildren = (node: Node): boolean => {
  const childIds = (node.data as NodeHierarchyData)?.childIds
  return !!(childIds && childIds.length > 0)
}

export const getNodeLevel = (node: Node): number => {
  return (node.data as NodeHierarchyData)?.level ?? 0
}

/**
 * Export all types
 */
export type {
  Node as ReactFlowNode,
  NodeHierarchyData as HierarchyData,
}
