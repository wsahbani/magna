/**
 * React Query hooks for Procedure FlowDiagram (Level 3)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getProcedureFlow, saveProcedureFlow } from '../../../lib/api/procedure.api'
import type { ProcedureFlowDiagram } from '../types/flow-diagram.types'
import type { Node, Edge } from '@xyflow/react'

export const procedureFlowKeys = {
  all: ['procedure-flows'] as const,
  detail: (procedureId: string) => ['procedure-flows', procedureId] as const,
}

/**
 * Hook to fetch flow diagram for a procedure
 */
export function useProcedureFlow(procedureId: string | undefined) {
  return useQuery({
    queryKey: procedureFlowKeys.detail(procedureId!),
    queryFn: () => getProcedureFlow(procedureId!),
    enabled: !!procedureId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to save flow diagram for a procedure
 */
export function useSaveProcedureFlow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      nodes,
      edges,
      flowDirection,
    }: {
      procedureId: string
      nodes: Node[]
      edges: Edge[]
      flowDirection?: 'horizontal' | 'vertical'
    }) => {
      // Transform ReactFlow nodes/edges to SaveNodeDto/SaveEdgeDto format
      const saveNodes = nodes.map((node) => {
        // Get width/height from top level (NodeResizer updates these) or fallback to data
        const width = node.width ?? node.data?.width ?? undefined
        const height = node.height ?? node.data?.height ?? undefined
        
        // Get parentId from node level (same level as data, type, position)
        const parentId = (node as any).parentId || (node as any).parentNode
        
        // For pool nodes, ensure lanes are saved in data.lanes
        const nodeData = { ...node.data };
        if ((node.type === 'pool' || node.type === 'swimlane') && nodeData.lanes) {
          // Lanes are already in data.lanes, just ensure they're properly structured
          nodeData.lanes = nodeData.lanes;
        }
        
        return {
          id: node.id,
          type: node.type || 'action',
          label: node.data?.label || node.data?.title || '',
          positionX: node.position.x,
          positionY: node.position.y,
          width,
          height,
          description: node.data?.description,
          // parentId should be at the same level as data, type, position
          parentId: parentId,
          data: {
            ...nodeData,
            // Ensure width/height are also in data for consistency
            width: width ?? node.data?.width,
            height: height ?? node.data?.height,
            // Store parentNodeId in data for persistence (backward compatibility)
            parentNodeId: parentId,
            // Swimlane specific properties
            orientation: node.data?.orientation,
            // Lanes are stored in data.lanes for pool nodes
            lanes: (node.type === 'pool' || node.type === 'swimlane') ? nodeData.lanes : undefined,
            // Legacy properties (for backward compatibility)
            order: node.data?.order,
            collapsed: node.data?.collapsed,
            poolId: node.data?.poolId,
            // laneId is critical for node-lane attachment
            laneId: node.data?.laneId,
            color: node.data?.color,
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

      return saveProcedureFlow(procedureId, saveNodes, saveEdges, flowDirection)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureFlowKeys.detail(variables.procedureId),
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

