/**
 * React Query hooks for ProcessMap FlowDiagram
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { processMapApi } from '../../../lib/api/process-map.api';
import { toast } from 'sonner';
import type { Node, Edge } from '@xyflow/react';
import type { FlowResponse } from '../types/flow-diagram.types';

// Query keys
export const processMapFlowKeys = {
  all: ['process-map-flow'] as const,
  detail: (processMapId: string) => [...processMapFlowKeys.all, processMapId] as const,
};

/**
 * Get FlowDiagram for ProcessMap
 */
export const useProcessMapFlow = (processMapId: string | undefined) => {
  return useQuery<FlowResponse>({
    queryKey: processMapFlowKeys.detail(processMapId!),
    queryFn: () => processMapApi.getFlow(processMapId!),
    enabled: !!processMapId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Save FlowDiagram for ProcessMap
 */
export const useSaveProcessMapFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      processMapId,
      nodes,
      edges,
    }: {
      processMapId: string;
      nodes: Node[];
      edges: Edge[];
    }) => {
      // Transform ReactFlow nodes/edges to SaveNodeDto/SaveEdgeDto format
      const saveNodes = nodes.map((node) => {
        // Get width/height from top level (NodeResizer updates these) or fallback to data
        const width = node.width ?? node.data?.width ?? undefined;
        const height = node.height ?? node.data?.height ?? undefined;
        
        // Use parentId at top level (ReactFlow standard), fallback to parentNode for backward compatibility
        const parentId = (node as any).parentId || (node as any).parentNode;
        
        return {
          id: node.id,
          type: node.type || 'process',
          label: node.data?.label || node.data?.title || '',
          positionX: node.position.x,
          positionY: node.position.y,
          width,
          height,
          description: node.data?.description,
          parentId, // Send parentId at top level
          data: {
            ...node.data,
            // Ensure width/height are also in data for consistency
            width: width ?? node.data?.width,
            height: height ?? node.data?.height,
            // Store parentNodeId in data for persistence (backend expects this)
            parentNodeId: parentId,
          },
        };
      });

      const saveEdges = edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'smoothstep',
        label: edge.label,
        animated: edge.animated,
        style: edge.style,
        data: edge.data,
      }));

      return processMapApi.saveFlow(processMapId, saveNodes, saveEdges);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: processMapFlowKeys.detail(variables.processMapId),
      });
      queryClient.invalidateQueries({
        queryKey: ['process-maps'],
      });
      toast.success('Diagramme sauvegardé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la sauvegarde: ${error.message}`);
    },
  });
};

