/**
 * useHierarchicalDrag Hook
 * 
 * Manages drag behavior for nodes with parent-child relationships
 * When dragging a parent node, all children move together
 */

import { useCallback, useRef } from 'react'
import { Node, NodeChange, XYPosition } from '@xyflow/react'
import { NodeHierarchyData } from '../types/node-hierarchy'
import { HierarchyService } from '../services/hierarchy.service'

export interface UseHierarchicalDragOptions {
  nodes: Node[]
  onNodesChange: (changes: NodeChange[]) => void
  enabled?: boolean
}

export interface DragState {
  isDragging: boolean
  draggedNodeId: string | null
  affectedNodeIds: string[]
  initialPositions: Map<string, XYPosition>
}

export function useHierarchicalDrag({
  nodes,
  onNodesChange,
  enabled = true,
}: UseHierarchicalDragOptions) {
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    draggedNodeId: null,
    affectedNodeIds: [],
    initialPositions: new Map(),
  })

  /**
   * Start drag - capture all descendants
   */
  const handleNodeDragStart = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (!enabled) return

      // Get all descendants that should move with this node
      const descendants = HierarchyService.getDescendants(nodes, node.id)
      const affectedNodeIds = [node.id, ...descendants.map((d) => d.id)]

      // Store initial positions
      const initialPositions = new Map<string, XYPosition>()
      affectedNodeIds.forEach((id) => {
        const n = nodes.find((node) => node.id === id)
        if (n) {
          initialPositions.set(id, { ...n.position })
        }
      })

      dragStateRef.current = {
        isDragging: true,
        draggedNodeId: node.id,
        affectedNodeIds,
        initialPositions,
      }
    },
    [nodes, enabled]
  )

  /**
   * During drag - move all children relative to parent
   */
  const handleNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (!enabled || !dragStateRef.current.isDragging) return

      const { draggedNodeId, affectedNodeIds, initialPositions } = dragStateRef.current

      if (node.id !== draggedNodeId) return

      // Calculate delta from initial position
      const initialPos = initialPositions.get(draggedNodeId)
      if (!initialPos) return

      const delta = {
        x: node.position.x - initialPos.x,
        y: node.position.y - initialPos.y,
      }

      // Update all affected nodes (except the one being dragged - ReactFlow handles that)
      const changes: NodeChange[] = affectedNodeIds
        .filter((id) => id !== draggedNodeId)
        .map((id) => {
          const initialNodePos = initialPositions.get(id)
          if (!initialNodePos) return null

          return {
            id,
            type: 'position' as const,
            position: {
              x: initialNodePos.x + delta.x,
              y: initialNodePos.y + delta.y,
            },
          }
        })
        .filter((change) => change !== null) as NodeChange[]

      if (changes.length > 0) {
        onNodesChange(changes)
      }
    },
    [enabled, onNodesChange]
  )

  /**
   * End drag - reset state
   */
  const handleNodeDragStop = useCallback(() => {
    if (!enabled) return

    dragStateRef.current = {
      isDragging: false,
      draggedNodeId: null,
      affectedNodeIds: [],
      initialPositions: new Map(),
    }
  }, [enabled])

  return {
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
    dragState: dragStateRef.current,
  }
}

/**
 * useMultiSelection Hook
 * 
 * Manages multi-selection of nodes
 * Supports Ctrl/Cmd + Click and box selection
 */
export interface UseMultiSelectionOptions {
  nodes: Node[]
  onSelectionChange?: (selectedNodes: Node[]) => void
}

export function useMultiSelection({
  nodes,
  onSelectionChange,
}: UseMultiSelectionOptions) {
  const selectionRef = useRef<string[]>([])

  /**
   * Handle node selection with modifier keys
   */
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Check for multi-select modifier (Ctrl/Cmd)
      const isMultiSelect = event.ctrlKey || event.metaKey

      let newSelection: string[]

      if (isMultiSelect) {
        // Toggle selection
        if (selectionRef.current.includes(node.id)) {
          newSelection = selectionRef.current.filter((id) => id !== node.id)
        } else {
          newSelection = [...selectionRef.current, node.id]
        }
      } else {
        // Single selection
        newSelection = [node.id]
      }

      selectionRef.current = newSelection

      // Notify parent
      if (onSelectionChange) {
        const selectedNodes = nodes.filter((n) => newSelection.includes(n.id))
        onSelectionChange(selectedNodes)
      }
    },
    [nodes, onSelectionChange]
  )

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    selectionRef.current = []
    if (onSelectionChange) {
      onSelectionChange([])
    }
  }, [onSelectionChange])

  /**
   * Get selected node IDs
   */
  const getSelectedNodeIds = useCallback(() => {
    return [...selectionRef.current]
  }, [])

  /**
   * Check if node is selected
   */
  const isNodeSelected = useCallback((nodeId: string) => {
    return selectionRef.current.includes(nodeId)
  }, [])

  return {
    handleNodeClick,
    clearSelection,
    getSelectedNodeIds,
    isNodeSelected,
  }
}

/**
 * useGroupOperations Hook
 * 
 * Helper methods for common group operations
 */
export interface UseGroupOperationsOptions {
  createGroup: (nodeIds: string[], label: string, position: XYPosition) => void
  moveNodesToGroup: (nodeIds: string[], groupId: string | null) => boolean
  ungroupNodes: (groupId: string) => void
}

export function useGroupOperations(
  nodes: Node[],
  operations: UseGroupOperationsOptions
) {
  /**
   * Create group from selected nodes
   */
  const createGroupFromSelection = useCallback(
    (selectedNodeIds: string[], label: string) => {
      if (selectedNodeIds.length === 0) return

      // Calculate center position of selected nodes
      const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id))
      
      if (selectedNodes.length === 0) return

      const avgX =
        selectedNodes.reduce((sum, n) => sum + n.position.x, 0) /
        selectedNodes.length
      const avgY =
        selectedNodes.reduce((sum, n) => sum + n.position.y, 0) /
        selectedNodes.length

      // Create group centered on selected nodes
      operations.createGroup(selectedNodeIds, label, { x: avgX - 100, y: avgY - 75 })
    },
    [nodes, operations]
  )

  /**
   * Ungroup all nodes in a group
   */
  const ungroupNodes = useCallback(
    (groupId: string) => {
      const groupNode = nodes.find((n) => n.id === groupId)
      if (!groupNode) return

      const childIds = (groupNode.data as NodeHierarchyData)?.childIds || []

      // Remove parent from all children
      childIds.forEach((childId) => {
        operations.moveNodesToGroup([childId], null)
      })
    },
    [nodes, operations]
  )

  return {
    createGroupFromSelection,
    ungroupNodes,
  }
}
