import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Node, Edge } from '@xyflow/react'
import { FlowService, SaveFlowResponse, LoadFlowResponse } from '../services/flowService'
import { useCallback, useRef } from 'react'

/**
 * Hook for saving flow diagrams
 * Supports incremental saves with ADD/EDIT/DELETE actions
 */
export const useSaveFlow = () => {
  const queryClient = useQueryClient()

  return useMutation<
    SaveFlowResponse, 
    Error, 
    { 
      processId: string
      nodes: Node[]
      edges: Edge[]
      changesLog?: string
      deletedNodes?: Node[]
      deletedEdges?: Edge[]
    }
  >({
    mutationFn: ({ processId, nodes, edges, changesLog, deletedNodes, deletedEdges }) => 
      FlowService.saveFlow(processId, nodes, edges, changesLog, deletedNodes, deletedEdges),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch flow data
      queryClient.invalidateQueries({ 
        queryKey: ['flow', variables.processId] 
      })
    },
    onError: (error) => {
      console.error('Failed to save flow:', error)
    }
  })
}

/**
 * Hook for loading flow diagrams
 */
export const useLoadFlow = (processId: string | null, version?: number) => {
  return useQuery<LoadFlowResponse, Error>({
    queryKey: ['flow', processId, version],
    queryFn: () => {
      if (!processId) throw new Error('Process ID is required')
      return FlowService.loadFlow(processId, version)
    },
    enabled: !!processId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}

/**
 * Hook for auto-saving flow diagrams with debouncing
 */
export const useAutoSaveFlow = (processId: string | null, delay = 2000) => {
  const queryClient = useQueryClient()
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  const mutationRef = useRef<ReturnType<typeof useMutation> | null>(null)

  const mutation = useMutation<SaveFlowResponse, Error, { nodes: Node[]; edges: Edge[] }>({
    mutationFn: ({ nodes, edges }) => {
      if (!processId) throw new Error('Process ID is required')
      return FlowService.saveFlow(processId, nodes, edges, 'Auto-save')
    },
    onSuccess: (_data, variables) => {
      // Update cache silently
      queryClient.invalidateQueries({ queryKey: ['flow', processId] })
    },
    onError: (error) => {
      console.error('Auto-save failed:', error)
    }
  })

  // Store mutation in ref to avoid dependency issues
  mutationRef.current = mutation

  const autoSave = useCallback((nodes: Node[], edges: Edge[]) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }

    // Debounced save
    saveTimeoutRef.current = window.setTimeout(() => {
      if (processId && mutationRef.current) {
        mutationRef.current.mutate({ nodes, edges })
      }
    }, delay)
  }, [processId, delay])

  return {
    autoSave,
    isAutoSaving: mutation.isPending,
    autoSaveError: mutation.error,
    lastAutoSave: mutation.data
  }
}

/**
 * Hook for creating process with flow
 */
export const useCreateProcessWithFlow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      processData,
      nodes,
      edges
    }: {
      processData: {
        name: string
        description?: string
        level: number
        parentId?: string
      }
      nodes: Node[]
      edges: Edge[]
    }) => FlowService.createProcessWithFlow(processData, nodes, edges),
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // Invalidate processes list
      queryClient.invalidateQueries({ queryKey: ['processes'] })
    }
  })
}

/**
 * Hook for flow validation
 */
export const useValidateFlow = () => {
  return useMutation({
    mutationFn: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) =>
      FlowService.validateFlow(nodes, edges),
    onError: (error) => {
      console.error('Flow validation failed:', error)
    }
  })
}

/**
 * Hook for flow export
 */
export const useExportFlow = () => {
  return useMutation({
    mutationFn: ({ 
      processVersionId, 
      format 
    }: { 
      processVersionId: string
      format?: 'json' | 'png' | 'svg' | 'pdf' 
    }) => FlowService.exportFlow(processVersionId, format),
    onSuccess: (data, variables) => {
      // If it's a blob (image/pdf), trigger download
      if (data instanceof Blob) {
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `flow-diagram.${variables.format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    },
    onError: (error) => {
      console.error('Export failed:', error)
    }
  })
}

/**
 * Hook for getting flow history
 */
export const useFlowHistory = (processVersionId: string | null) => {
  return useQuery({
    queryKey: ['flowHistory', processVersionId],
    queryFn: () => {
      if (!processVersionId) throw new Error('Process version ID is required')
      return FlowService.getFlowHistory(processVersionId)
    },
    enabled: !!processVersionId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}