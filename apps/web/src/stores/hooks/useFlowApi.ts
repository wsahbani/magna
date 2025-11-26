import { useCallback } from 'react'
import { useFlowStore } from '../flowStore'
import { Node, Edge } from '@xyflow/react'

/**
 * Flow data structure for API communication
 */
export interface FlowData {
  nodes: Node[]
  edges: Edge[]
  version?: string
  metadata?: Record<string, any>
}

/**
 * Custom hook for API integration with the flow store
 * Provides methods to sync flow data with the backend
 */
export const useFlowApi = () => {
  const {
    nodes,
    edges,
    processId,
    isDirty,
    loadFlow,
    markAsSaved,
    clearFlow,
  } = useFlowStore()

  /**
   * Save flow to API
   */
  const saveFlow = useCallback(async () => {
    if (!processId) {
      throw new Error('No process ID set')
    }

    try {
      const flowData: FlowData = {
        nodes,
        edges,
        version: '1.0.0',
        metadata: {
          updatedAt: new Date().toISOString(),
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
      }

      // TODO: Replace with actual API call
      // const response = await api.updateProcessDiagram(processId, flowData)
      console.log('Saving flow to API:', { processId, flowData })
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      markAsSaved()
      
      return { success: true, data: flowData }
    } catch (error) {
      console.error('Failed to save flow:', error)
      throw error
    }
  }, [nodes, edges, processId, markAsSaved])

  /**
   * Load flow from API
   */
  const loadFlowFromApi = useCallback(async (processId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.getProcessDiagram(processId)
      console.log('Loading flow from API:', { processId })
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // TODO: Get actual data from API
      const flowData: FlowData = {
        nodes: [],
        edges: [],
      }
      
      loadFlow(flowData.nodes, flowData.edges, processId)
      
      return { success: true, data: flowData }
    } catch (error) {
      console.error('Failed to load flow:', error)
      throw error
    }
  }, [loadFlow])

  /**
   * Auto-save flow (debounced)
   */
  const autoSave = useCallback(async () => {
    if (!isDirty || !processId) {
      return
    }

    try {
      await saveFlow()
      console.log('Auto-saved flow')
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }, [isDirty, processId, saveFlow])

  /**
   * Export flow as JSON
   */
  const exportFlowAsJson = useCallback(() => {
    const flowData: FlowData = {
      nodes,
      edges,
      version: '1.0.0',
      metadata: {
        exportedAt: new Date().toISOString(),
        processId,
      },
    }

    const jsonString = JSON.stringify(flowData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `flow-${processId || 'untitled'}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [nodes, edges, processId])

  /**
   * Import flow from JSON
   */
  const importFlowFromJson = useCallback((jsonString: string) => {
    try {
      const flowData: FlowData = JSON.parse(jsonString)
      
      if (!flowData.nodes || !flowData.edges) {
        throw new Error('Invalid flow data format')
      }

      loadFlow(flowData.nodes, flowData.edges, processId || undefined)
      
      return { success: true, data: flowData }
    } catch (error) {
      console.error('Failed to import flow:', error)
      throw error
    }
  }, [loadFlow, processId])

  /**
   * Create a new version of the flow
   */
  const createFlowVersion = useCallback(async () => {
    if (!processId) {
      throw new Error('No process ID set')
    }

    try {
      const flowData: FlowData = {
        nodes,
        edges,
        version: '1.0.0',
        metadata: {
          createdAt: new Date().toISOString(),
          parentProcessId: processId,
        },
      }

      // TODO: Replace with actual API call to create version
      console.log('Creating flow version:', { processId, flowData })
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      return { success: true, versionId: `version_${Date.now()}` }
    } catch (error) {
      console.error('Failed to create flow version:', error)
      throw error
    }
  }, [nodes, edges, processId])

  /**
   * Validate flow before saving
   */
  const validateFlow = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>()
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    const disconnectedNodes = nodes.filter((node) => 
      node.type !== 'startEvent' && 
      node.type !== 'endEvent' && 
      !connectedNodeIds.has(node.id)
    )

    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} disconnected node(s) found`)
    }

    // Check for start and end events
    const hasStartEvent = nodes.some((node) => node.type === 'startEvent')
    const hasEndEvent = nodes.some((node) => node.type === 'endEvent')

    if (!hasStartEvent) {
      errors.push('Flow must have at least one Start Event')
    }

    if (!hasEndEvent) {
      errors.push('Flow must have at least one End Event')
    }

    // Check for invalid connections
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode) {
        errors.push(`Invalid connection: ${edge.id}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }, [nodes, edges])

  return {
    // State
    processId,
    isDirty,
    hasUnsavedChanges: isDirty,
    
    // API operations
    saveFlow,
    loadFlowFromApi,
    autoSave,
    
    // Import/Export
    exportFlowAsJson,
    importFlowFromJson,
    
    // Versioning
    createFlowVersion,
    
    // Validation
    validateFlow,
    
    // Utility
    clearFlow,
  }
}
