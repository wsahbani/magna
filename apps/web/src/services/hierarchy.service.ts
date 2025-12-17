/**
 * Node Hierarchy Store
 * 
 * Manages parent-child relationships, grouping, and hierarchical operations
 * Follows clean architecture with separation of concerns
 */

import { Node, XYPosition } from '@xyflow/react'
import {
  HierarchicalNode,
  NodeHierarchyData,
  NodeGroup,
  HierarchyValidation,
  MoveNodesResult,
  HierarchyStats,
  HIERARCHY_CONSTANTS,
  isGroupNode,
  hasParent,
  hasChildren,
  getNodeLevel,
} from '../types/node-hierarchy'

/**
 * Hierarchy Service
 * Business logic for hierarchy operations
 */
export class HierarchyService {
  /**
   * Validate hierarchy constraints
   */
  static validateHierarchy(
    nodes: Node[],
    parentId: string | null,
    childId: string
  ): HierarchyValidation {
    const errors: string[] = []
    const warnings: string[] = []

    // Check for self-reference
    if (parentId === childId) {
      errors.push('A node cannot be its own parent')
    }

    // Check for circular dependency
    if (parentId && this.wouldCreateCircular(nodes, parentId, childId)) {
      errors.push('This would create a circular dependency')
    }

    // Check max depth
    const childNode = nodes.find((n) => n.id === childId)
    const parentNode = parentId ? nodes.find((n) => n.id === parentId) : null
    
    if (parentNode) {
      const parentLevel = getNodeLevel(parentNode)
      if (parentLevel >= HIERARCHY_CONSTANTS.MAX_DEPTH) {
        errors.push(`Maximum nesting depth (${HIERARCHY_CONSTANTS.MAX_DEPTH}) exceeded`)
      }
    }

    // Check if child has existing children (warning)
    if (childNode && hasChildren(childNode)) {
      warnings.push('Moving this node will also move all its children')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Check if adding parent-child relationship would create circular dependency
   */
  private static wouldCreateCircular(
    nodes: Node[],
    potentialParentId: string,
    childId: string
  ): boolean {
    const visited = new Set<string>()
    let currentId: string | undefined = potentialParentId

    while (currentId) {
      if (currentId === childId) {
        return true // Circular dependency detected
      }

      if (visited.has(currentId)) {
        return false // Already checked this path
      }

      visited.add(currentId)
      const currentNode = nodes.find((n) => n.id === currentId)
      currentId = (currentNode?.data as NodeHierarchyData)?.parentId || undefined
    }

    return false
  }

  /**
   * Get all descendants of a node (recursive)
   */
  static getDescendants(nodes: Node[], nodeId: string): Node[] {
    const descendants: Node[] = []
    const node = nodes.find((n) => n.id === nodeId)

    if (!node) return descendants

    const childIds = (node.data as NodeHierarchyData)?.childIds || []

    for (const childId of childIds) {
      const child = nodes.find((n) => n.id === childId)
      if (child) {
        descendants.push(child)
        // Recursively get descendants
        descendants.push(...this.getDescendants(nodes, childId))
      }
    }

    return descendants
  }

  /**
   * Get all ancestors of a node
   */
  static getAncestors(nodes: Node[], nodeId: string): Node[] {
    const ancestors: Node[] = []
    let currentId: string | undefined = nodeId

    while (currentId) {
      const currentNode = nodes.find((n) => n.id === currentId)
      const parentId = (currentNode?.data as NodeHierarchyData)?.parentId

      if (parentId) {
        const parent = nodes.find((n) => n.id === parentId)
        if (parent) {
          ancestors.push(parent)
          currentId = parentId
        } else {
          break
        }
      } else {
        break
      }
    }

    return ancestors
  }

  /**
   * Get siblings of a node
   */
  static getSiblings(nodes: Node[], nodeId: string): Node[] {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return []

    const parentId = (node.data as NodeHierarchyData)?.parentId

    if (!parentId) {
      // Return all root-level nodes except this one
      return nodes.filter(
        (n) => n.id !== nodeId && !(n.data as NodeHierarchyData)?.parentId
      )
    }

    // Return all children of the same parent except this one
    const parent = nodes.find((n) => n.id === parentId)
    if (!parent) return []

    const siblingIds = ((parent.data as NodeHierarchyData)?.childIds || []).filter(
      (id) => id !== nodeId
    )

    return nodes.filter((n) => siblingIds.includes(n.id))
  }

  /**
   * Calculate hierarchy level for a node
   */
  static calculateLevel(nodes: Node[], nodeId: string): number {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return 0

    const parentId = (node.data as NodeHierarchyData)?.parentId
    if (!parentId) return 0

    return 1 + this.calculateLevel(nodes, parentId)
  }

  /**
   * Get hierarchy statistics
   */
  static getHierarchyStats(nodes: Node[]): HierarchyStats {
    const rootNodes = nodes.filter((n) => !hasParent(n))
    const groupNodes = nodes.filter(isGroupNode)
    
    let maxDepth = 0
    let totalChildren = 0
    let parentsWithChildren = 0

    for (const node of nodes) {
      const level = getNodeLevel(node)
      if (level > maxDepth) maxDepth = level

      const childIds = (node.data as NodeHierarchyData)?.childIds || []
      if (childIds.length > 0) {
        totalChildren += childIds.length
        parentsWithChildren++
      }
    }

    return {
      totalNodes: nodes.length,
      rootNodes: rootNodes.length,
      groupNodes: groupNodes.length,
      maxDepth,
      averageChildrenPerParent: parentsWithChildren > 0 
        ? totalChildren / parentsWithChildren 
        : 0,
    }
  }

  /**
   * Build a tree structure from flat nodes
   */
  static buildTree(nodes: Node[]): Map<string, Node[]> {
    const tree = new Map<string, Node[]>()

    for (const node of nodes) {
      const parentId = (node.data as NodeHierarchyData)?.parentId || 'root'
      
      if (!tree.has(parentId)) {
        tree.set(parentId, [])
      }
      
      tree.get(parentId)!.push(node)
    }

    return tree
  }

  /**
   * Calculate new position for children when parent moves
   */
  static calculateChildPositions(
    parentOldPos: XYPosition,
    parentNewPos: XYPosition,
    children: Node[]
  ): Map<string, XYPosition> {
    const delta = {
      x: parentNewPos.x - parentOldPos.x,
      y: parentNewPos.y - parentOldPos.y,
    }

    const newPositions = new Map<string, XYPosition>()

    for (const child of children) {
      newPositions.set(child.id, {
        x: child.position.x + delta.x,
        y: child.position.y + delta.y,
      })
    }

    return newPositions
  }
}

/**
 * Hierarchy Operations
 * CRUD operations for parent-child relationships
 */
export class HierarchyOperations {
  /**
   * Set parent for a node
   */
  static setParent(
    nodes: Node[],
    childId: string,
    newParentId: string | null
  ): Node[] {
    const validation = HierarchyService.validateHierarchy(nodes, newParentId, childId)
    
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    const childNode = nodes.find((n) => n.id === childId)
    if (!childNode) {
      throw new Error(`Child node ${childId} not found`)
    }

    const oldParentId = (childNode.data as NodeHierarchyData)?.parentId

    // Calculate new level
    const newLevel = newParentId 
      ? HierarchyService.calculateLevel(nodes, newParentId) + 1
      : 0

    // Update all descendants' levels
    const descendants = HierarchyService.getDescendants(nodes, childId)
    const levelDelta = newLevel - getNodeLevel(childNode)

    return nodes.map((node) => {
      // Update child node
      if (node.id === childId) {
        return {
          ...node,
          data: {
            ...node.data,
            parentId: newParentId,
            level: newLevel,
          },
        }
      }

      // Update old parent (remove from childIds)
      if (node.id === oldParentId) {
        const childIds = ((node.data as NodeHierarchyData)?.childIds || []).filter(
          (id) => id !== childId
        )
        return {
          ...node,
          data: {
            ...node.data,
            childIds,
          },
        }
      }

      // Update new parent (add to childIds)
      if (node.id === newParentId) {
        const childIds = (node.data as NodeHierarchyData)?.childIds || []
        if (!childIds.includes(childId)) {
          return {
            ...node,
            data: {
              ...node.data,
              childIds: [...childIds, childId],
            },
          }
        }
      }

      // Update descendants' levels
      if (descendants.find((d) => d.id === node.id)) {
        return {
          ...node,
          data: {
            ...node.data,
            level: getNodeLevel(node) + levelDelta,
          },
        }
      }

      return node
    })
  }

  /**
   * Remove parent from a node
   */
  static removeParent(nodes: Node[], childId: string): Node[] {
    return this.setParent(nodes, childId, null)
  }

  /**
   * Create a group node
   */
  static createGroup(
    nodes: Node[],
    group: NodeGroup,
    position: XYPosition
  ): Node[] {
    const groupNode: HierarchicalNode = {
      id: group.id,
      type: 'group',
      position,
      data: {
        label: group.label,
        isGroup: true,
        groupType: group.type,
        childIds: group.nodeIds,
        level: 0,
        collapsed: group.collapsed || false,
        metadata: {
          color: group.color,
          ...group.metadata,
        },
      },
    }

    // Add group node and update children
    const updatedNodes = [...nodes, groupNode]

    // Set parent for all nodes in the group
    let result = updatedNodes
    for (const nodeId of group.nodeIds) {
      result = this.setParent(result, nodeId, group.id)
    }

    return result
  }

  /**
   * Move multiple nodes together (batch operation)
   */
  static moveNodesToParent(
    nodes: Node[],
    nodeIds: string[],
    newParentId: string | null
  ): MoveNodesResult {
    try {
      let updatedNodes = nodes

      for (const nodeId of nodeIds) {
        // Validate before moving
        const validation = HierarchyService.validateHierarchy(
          updatedNodes,
          newParentId,
          nodeId
        )

        if (!validation.isValid) {
          return {
            success: false,
            movedNodes: [],
            updatedNodes: nodes,
            error: validation.errors[0],
          }
        }

        updatedNodes = this.setParent(updatedNodes, nodeId, newParentId)
      }

      return {
        success: true,
        movedNodes: nodeIds,
        updatedNodes: updatedNodes as HierarchicalNode[],
      }
    } catch (error) {
      return {
        success: false,
        movedNodes: [],
        updatedNodes: nodes as HierarchicalNode[],
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Collapse/expand a group node
   */
  static toggleCollapse(nodes: Node[], groupId: string): Node[] {
    return nodes.map((node) => {
      if (node.id === groupId && isGroupNode(node)) {
        return {
          ...node,
          data: {
            ...node.data,
            collapsed: !(node.data as NodeHierarchyData)?.collapsed,
          },
        }
      }
      return node
    })
  }

  /**
   * Get all nodes that should move with a parent (children recursively)
   */
  static getNodesMovingWithParent(nodes: Node[], parentId: string): string[] {
    const result: string[] = [parentId]
    const descendants = HierarchyService.getDescendants(nodes, parentId)
    
    for (const descendant of descendants) {
      result.push(descendant.id)
    }

    return result
  }
}

/**
 * Export singleton service instance
 */
export const hierarchyService = HierarchyService
export const hierarchyOperations = HierarchyOperations
