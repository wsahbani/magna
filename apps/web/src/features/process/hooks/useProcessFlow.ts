/**
 * React Query hooks for Process FlowDiagram (Level 2)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getProcessFlow, saveProcessFlow } from '../../../lib/api/process.api'
import type { FlowDiagram } from '../types/flow-diagram.types'
import type { Node, Edge } from '@xyflow/react'

const QUERY_KEYS = {
  all: ['process-flows'] as const,
  flow: (processId: string) => [...QUERY_KEYS.all, processId] as const,
}

/**
 * Hook to fetch flow diagram for a process
 */
export function useProcessFlow(processId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.flow(processId!),
    queryFn: () => getProcessFlow(processId!),
    enabled: !!processId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to save flow diagram for a process
 */
export function useSaveProcessFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      processId,
      nodes,
      edges,
    }: {
      processId: string
      nodes: Node[]
      edges: Edge[]
    }) => {
      // Transform ReactFlow nodes/edges to SaveNodeDto/SaveEdgeDto format
      const saveNodes = nodes.map((node) => {
        // Get width/height from top level (NodeResizer updates these) or fallback to data
        const width = node.width ?? node.data?.width ?? undefined
        const height = node.height ?? node.data?.height ?? undefined
        
        return {
          id: node.id,
          type: node.type || 'action',
          label: node.data?.label || node.data?.title || '',
          positionX: node.position.x,
          positionY: node.position.y,
          width,
          height,
          description: node.data?.description,
          data: {
            ...node.data,
            // Ensure width/height are also in data for consistency
            width: width ?? node.data?.width,
            height: height ?? node.data?.height,
            parentNode: node.parentNode, // Store parentNode
          },
        }
      })

      const saveEdges = edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep',
        label: edge.label,
        animated: edge.animated,
        style: edge.style,
        data: edge.data,
      }))

      return saveProcessFlow(processId, saveNodes, saveEdges)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.flow(variables.processId),
      })
      toast.success('Diagramme sauvegardé avec succès')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la sauvegarde du diagramme',
      )
    },
  })
}

