import { useCallback } from 'react'
import { useFlowStore } from '../flowStore'
import { Node, XYPosition } from '@xyflow/react'

/**
 * Custom hook for common flow operations
 * Provides convenient methods for managing the flow
 */
export const useFlowOperations = () => {
  const {
    nodes,
    edges,
    selectedNodes,
    selectedEdges,
    isDirty,
    addNode,
    updateNode,
    updateNodeStyle,
    deleteNode,
    deleteNodes,
    duplicateNode,
    addEdge,
    updateEdge,
    deleteEdge,
    deleteEdges,
    clearSelection,
  } = useFlowStore()

  /**
   * Add a new node at a specific position with default data
   */
  const createNode = useCallback((
    type: string,
    position: XYPosition,
    data?: Record<string, any>
  ) => {
    const defaultLabels: Record<string, string> = {
      startEvent: 'Start',
      endEvent: 'End',
      task: 'Task',
      gateway: 'Gateway',
      process: 'Process',
      userTask: 'User Task',
      serviceTask: 'Service Task',
      database: 'Database',
      apiCall: 'API Call',
      conditional: 'Conditional',
    }

    return addNode({
      type,
      position,
      data: {
        label: defaultLabels[type] || 'Node',
        description: '',
        ...data,
      },
    })
  }, [addNode])

  /**
   * Duplicate selected nodes
   */
  const duplicateSelected = useCallback(() => {
    const duplicatedNodes = selectedNodes
      .map((node) => duplicateNode(node.id))
      .filter(Boolean) as Node[]
    
    return duplicatedNodes
  }, [selectedNodes, duplicateNode])

  /**
   * Delete selected nodes and edges
   */
  const deleteSelected = useCallback(() => {
    if (selectedNodes.length > 0) {
      deleteNodes(selectedNodes.map((n) => n.id))
    }
    if (selectedEdges.length > 0) {
      deleteEdges(selectedEdges.map((e) => e.id))
    }
    clearSelection()
  }, [selectedNodes, selectedEdges, deleteNodes, deleteEdges, clearSelection])

  /**
   * Check if there are any selected elements
   */
  const hasSelection = selectedNodes.length > 0 || selectedEdges.length > 0

  /**
   * Get single selected node (or null if multiple/none selected)
   */
  const singleSelectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null

  /**
   * Get single selected edge (or null if multiple/none selected)
   */
  const singleSelectedEdge = selectedEdges.length === 1 ? selectedEdges[0] : null

  /**
   * Update style for selected nodes
   */
  const updateSelectedNodesStyle = useCallback((style: Record<string, any>) => {
    selectedNodes.forEach((node) => {
      updateNodeStyle(node.id, style)
    })
  }, [selectedNodes, updateNodeStyle])

  /**
   * Align selected nodes
   */
  const alignNodes = useCallback((direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedNodes.length < 2) return

    const positions = selectedNodes.map((node) => node.position)
    
    let targetValue: number
    
    switch (direction) {
      case 'left':
        targetValue = Math.min(...positions.map((p) => p.x))
        selectedNodes.forEach((node) => {
          updateNode(node.id, { position: { ...node.position, x: targetValue } } as any)
        })
        break
      case 'right':
        targetValue = Math.max(...positions.map((p) => p.x))
        selectedNodes.forEach((node) => {
          updateNode(node.id, { position: { ...node.position, x: targetValue } } as any)
        })
        break
      case 'top':
        targetValue = Math.min(...positions.map((p) => p.y))
        selectedNodes.forEach((node) => {
          updateNode(node.id, { position: { ...node.position, y: targetValue } } as any)
        })
        break
      case 'bottom':
        targetValue = Math.max(...positions.map((p) => p.y))
        selectedNodes.forEach((node) => {
          updateNode(node.id, { position: { ...node.position, y: targetValue } } as any)
        })
        break
      case 'center':
        const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length
        selectedNodes.forEach((node) => {
          updateNode(node.id, { position: { ...node.position, x: avgX } } as any)
        })
        break
      case 'middle':
        const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length
        selectedNodes.forEach((node) => {
          updateNode(node.id, { position: { ...node.position, y: avgY } } as any)
        })
        break
    }
  }, [selectedNodes, updateNode])

  /**
   * Distribute nodes evenly
   */
  const distributeNodes = useCallback((direction: 'horizontal' | 'vertical') => {
    if (selectedNodes.length < 3) return

    const sortedNodes = [...selectedNodes].sort((a, b) => 
      direction === 'horizontal' 
        ? a.position.x - b.position.x 
        : a.position.y - b.position.y
    )

    const first = sortedNodes[0].position
    const last = sortedNodes[sortedNodes.length - 1].position
    const span = direction === 'horizontal' 
      ? last.x - first.x 
      : last.y - first.y
    const spacing = span / (sortedNodes.length - 1)

    sortedNodes.forEach((node, index) => {
      if (index === 0 || index === sortedNodes.length - 1) return
      
      if (direction === 'horizontal') {
        updateNode(node.id, { 
          position: { ...node.position, x: first.x + spacing * index } 
        } as any)
      } else {
        updateNode(node.id, { 
          position: { ...node.position, y: first.y + spacing * index } 
        } as any)
      }
    })
  }, [selectedNodes, updateNode])

  /**
   * Export flow data
   */
  const exportFlow = useCallback(() => {
    return {
      nodes,
      edges,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    }
  }, [nodes, edges])

  /**
   * Get flow statistics
   */
  const getFlowStats = useCallback(() => {
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type || 'default'] = (acc[node.type || 'default'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes,
      hasUnsavedChanges: isDirty,
    }
  }, [nodes, edges, isDirty])

  return {
    // State
    nodes,
    edges,
    selectedNodes,
    selectedEdges,
    isDirty,
    hasSelection,
    singleSelectedNode,
    singleSelectedEdge,
    
    // Node operations
    createNode,
    updateNode,
    updateNodeStyle,
    deleteNode,
    duplicateNode,
    duplicateSelected,
    
    // Edge operations
    addEdge,
    updateEdge,
    deleteEdge,
    
    // Selection operations
    deleteSelected,
    clearSelection,
    
    // Layout operations
    alignNodes,
    distributeNodes,
    updateSelectedNodesStyle,
    
    // Utility
    exportFlow,
    getFlowStats,
  }
}
