import { useEffect, useCallback, RefObject } from 'react'
import { Node, Edge } from '@xyflow/react'

interface UseFlowAutoSaveProps {
  enableAutoSave: boolean
  isLoaded: boolean
  processVersionId: string | null
  nodesRef: RefObject<Node[]>
  edgesRef: RefObject<Edge[]>
  autoSave: (nodes: Node[], edges: Edge[]) => void
  saveFlowMutation: {
    isSuccess: boolean
    data?: { message?: string }
    error?: Error
  }
  autoSaveError: Error | null
  onSaveSuccess?: (message: string) => void
  onSaveError?: (error: Error) => void
}

/**
 * Hook to handle auto-save functionality
 */
export function useFlowAutoSave({
  enableAutoSave,
  isLoaded,
  processVersionId,
  nodesRef,
  edgesRef,
  autoSave,
  saveFlowMutation,
  autoSaveError,
  onSaveSuccess,
  onSaveError,
}: UseFlowAutoSaveProps) {
  // Auto-save when nodes or edges change
  useEffect(() => {
    if (enableAutoSave && isLoaded && processVersionId && (nodesRef.current.length > 0 || edgesRef.current.length > 0)) {
      autoSave(nodesRef.current, edgesRef.current)
    }
  }, [nodesRef.current, edgesRef.current, enableAutoSave, isLoaded, processVersionId, autoSave])
  
  // Handle save success feedback
  useEffect(() => {
    if (saveFlowMutation.isSuccess && saveFlowMutation.data) {
      onSaveSuccess?.(saveFlowMutation.data.message)
    }
  }, [saveFlowMutation.isSuccess, saveFlowMutation.data, onSaveSuccess])
  
  // Handle save errors
  useEffect(() => {
    if (saveFlowMutation.error) {
      onSaveError?.(saveFlowMutation.error)
    }
  }, [saveFlowMutation.error, onSaveError])
  
  // Handle auto-save errors
  useEffect(() => {
    if (autoSaveError) {
      console.warn('Auto-save failed:', autoSaveError)
      onSaveError?.(autoSaveError)
    }
  }, [autoSaveError, onSaveError])
}

/**
 * Hook to provide manual save function
 */
interface SaveFlowMutation {
  mutateAsync: (data: { processVersionId: string; nodes: Node[]; edges: Edge[] }) => Promise<{ message?: string }>
}

export function useManualSave(
  processVersionId: string | null,
  nodes: Node[],
  edges: Edge[],
  saveFlowMutation: SaveFlowMutation,
  onSave?: (nodes: Node[], edges: Edge[]) => void,
  onSaveSuccess?: (message: string) => void,
  onSaveError?: (error: Error) => void
) {
  const handleManualSave = useCallback(async () => {
    if (!processVersionId) {
      onSave?.(nodes, edges)
      return
    }

    try {
      await saveFlowMutation.mutateAsync({
        processVersionId,
        nodes,
        edges
      })
      onSaveSuccess?.('Flow saved successfully!')
    } catch (error) {
      console.error('Manual save failed:', error)
      onSaveError?.(error as Error)
    }
  }, [processVersionId, nodes, edges, saveFlowMutation, onSave, onSaveSuccess, onSaveError])

  return handleManualSave
}
