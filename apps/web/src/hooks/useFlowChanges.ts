import { useRef, useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'
import { FlowAction } from '../services/flowService'

/**
 * Extended Node/Edge with action tracking
 */
export interface NodeWithAction extends Node {
  action?: FlowAction
}

export interface EdgeWithAction extends Edge {
  action?: FlowAction
}

/**
 * Hook to track flow changes (add/edit/delete)
 */
export function useFlowChanges() {
  const initialNodesRef = useRef<Set<string>>(new Set())
  const initialEdgesRef = useRef<Set<string>>(new Set())
  const isInitializedRef = useRef(false)

  /**
   * Initialize tracking with loaded nodes/edges
   */
  const initializeTracking = useCallback((nodes: Node[], edges: Edge[]) => {
    initialNodesRef.current = new Set(nodes.map(n => n.id))
    initialEdgesRef.current = new Set(edges.map(e => e.id))
    isInitializedRef.current = true
  }, [])

  /**
   * Reset tracking (clear history)
   */
  const resetTracking = useCallback(() => {
    initialNodesRef.current.clear()
    initialEdgesRef.current.clear()
    isInitializedRef.current = false
  }, [])

  /**
   * Add action metadata to nodes based on changes
   */
  const addNodeActions = useCallback((nodes: Node[]): NodeWithAction[] => {
    if (!isInitializedRef.current) {
      // First save - all nodes are new
      return nodes.map(node => ({ ...node, action: FlowAction.ADD }))
    }

    return nodes.map(node => {
      const isExisting = initialNodesRef.current.has(node.id)
      return {
        ...node,
        action: isExisting ? FlowAction.EDIT : FlowAction.ADD
      }
    })
  }, [])

  /**
   * Add action metadata to edges based on changes
   */
  const addEdgeActions = useCallback((edges: Edge[]): EdgeWithAction[] => {
    if (!isInitializedRef.current) {
      // First save - all edges are new
      return edges.map(edge => ({ ...edge, action: FlowAction.ADD }))
    }

    return edges.map(edge => {
      const isExisting = initialEdgesRef.current.has(edge.id)
      return {
        ...edge,
        action: isExisting ? FlowAction.EDIT : FlowAction.ADD
      }
    })
  }, [])

  /**
   * Get deleted nodes (existed before but not in current list)
   * Returns minimal node objects with only ID and DELETE action
   */
  const getDeletedNodes = useCallback((currentNodes: Node[]): NodeWithAction[] => {
    if (!isInitializedRef.current) return []

    const currentNodeIds = new Set(currentNodes.map(n => n.id))
    const deletedNodeIds = Array.from(initialNodesRef.current).filter(
      id => !currentNodeIds.has(id)
    )

    // Return minimal node objects - only ID and action are needed for deletion
    return deletedNodeIds.map(id => ({
      id,
      type: 'deleted', // Type required by Node interface but not used for deletion
      position: { x: 0, y: 0 }, // Position required by Node interface but not used
      data: { label: 'Deleted' }, // Data required by Node interface but not used
      action: FlowAction.DELETE,
    } as NodeWithAction))
  }, [])

  /**
   * Get deleted edges (existed before but not in current list)
   * Returns minimal edge objects with only ID and DELETE action
   */
  const getDeletedEdges = useCallback((currentEdges: Edge[]): EdgeWithAction[] => {
    if (!isInitializedRef.current) return []

    const currentEdgeIds = new Set(currentEdges.map(e => e.id))
    const deletedEdgeIds = Array.from(initialEdgesRef.current).filter(
      id => !currentEdgeIds.has(id)
    )

    // Return minimal edge objects - only ID and action are needed for deletion
    return deletedEdgeIds.map(id => ({
      id,
      source: 'deleted', // Source required by Edge interface but not used for deletion
      target: 'deleted', // Target required by Edge interface but not used for deletion
      action: FlowAction.DELETE,
    } as EdgeWithAction))
  }, [])

  return {
    initializeTracking,
    resetTracking,
    addNodeActions,
    addEdgeActions,
    getDeletedNodes,
    getDeletedEdges,
    isInitialized: isInitializedRef.current,
  }
}
