/**
 * React Query hooks for diagram elements (nodes, edges, lanes)
 * Supports MacroProcess, Process, and Procedure levels
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { diagramApi } from '../../../lib/api/diagram.api'
import type { DiagramLevel } from '../../../lib/api/diagram.api'
import type {
  CreateDiagramNodeDto,
  CreateDiagramEdgeDto,
  CreateDiagramLaneDto,
} from '../../procedures/types/procedure.types'

// Query keys
export const diagramKeys = {
  all: ['diagram'] as const,
  level: (level: DiagramLevel, levelId: string) =>
    [...diagramKeys.all, level, levelId] as const,
  nodes: (level: DiagramLevel, levelId: string) =>
    [...diagramKeys.level(level, levelId), 'nodes'] as const,
  edges: (level: DiagramLevel, levelId: string) =>
    [...diagramKeys.level(level, levelId), 'edges'] as const,
  lanes: (level: DiagramLevel, levelId: string) =>
    [...diagramKeys.level(level, levelId), 'lanes'] as const,
}

/**
 * Get nodes for a level
 */
export const useDiagramNodes = (
  level: DiagramLevel,
  levelId: string | undefined,
) => {
  return useQuery({
    queryKey: diagramKeys.nodes(level, levelId!),
    queryFn: () => diagramApi.getNodes(level, levelId!),
    enabled: !!levelId,
  })
}

/**
 * Get edges for a level
 */
export const useDiagramEdges = (
  level: DiagramLevel,
  levelId: string | undefined,
) => {
  return useQuery({
    queryKey: diagramKeys.edges(level, levelId!),
    queryFn: () => diagramApi.getEdges(level, levelId!),
    enabled: !!levelId,
  })
}

/**
 * Get lanes for a level
 */
export const useDiagramLanes = (
  level: DiagramLevel,
  levelId: string | undefined,
) => {
  return useQuery({
    queryKey: diagramKeys.lanes(level, levelId!),
    queryFn: () => diagramApi.getLanes(level, levelId!),
    enabled: !!levelId,
  })
}

/**
 * Create node mutation
 */
export const useCreateDiagramNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      data,
    }: {
      level: DiagramLevel
      levelId: string
      data: CreateDiagramNodeDto
    }) => diagramApi.createNode(level, levelId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.nodes(variables.level, variables.levelId),
      })
      queryClient.invalidateQueries({
        queryKey: diagramKeys.level(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Update node mutation
 */
export const useUpdateDiagramNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      nodeId,
      data,
    }: {
      level: DiagramLevel
      levelId: string
      nodeId: string
      data: Partial<CreateDiagramNodeDto>
    }) => diagramApi.updateNode(level, levelId, nodeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.nodes(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Delete node mutation
 */
export const useDeleteDiagramNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      nodeId,
    }: {
      level: DiagramLevel
      levelId: string
      nodeId: string
    }) => diagramApi.deleteNode(level, levelId, nodeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.nodes(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Create edge mutation
 */
export const useCreateDiagramEdge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      data,
    }: {
      level: DiagramLevel
      levelId: string
      data: CreateDiagramEdgeDto
    }) => diagramApi.createEdge(level, levelId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.edges(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Update edge mutation
 */
export const useUpdateDiagramEdge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      edgeId,
      data,
    }: {
      level: DiagramLevel
      levelId: string
      edgeId: string
      data: Partial<CreateDiagramEdgeDto>
    }) => diagramApi.updateEdge(level, levelId, edgeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.edges(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Delete edge mutation
 */
export const useDeleteDiagramEdge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      edgeId,
    }: {
      level: DiagramLevel
      levelId: string
      edgeId: string
    }) => diagramApi.deleteEdge(level, levelId, edgeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.edges(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Create lane mutation
 */
export const useCreateDiagramLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      data,
    }: {
      level: DiagramLevel
      levelId: string
      data: CreateDiagramLaneDto
    }) => diagramApi.createLane(level, levelId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.lanes(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Update lane mutation
 */
export const useUpdateDiagramLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      laneId,
      data,
    }: {
      level: DiagramLevel
      levelId: string
      laneId: string
      data: Partial<CreateDiagramLaneDto>
    }) => diagramApi.updateLane(level, levelId, laneId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.lanes(variables.level, variables.levelId),
      })
    },
  })
}

/**
 * Delete lane mutation
 */
export const useDeleteDiagramLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      level,
      levelId,
      laneId,
    }: {
      level: DiagramLevel
      levelId: string
      laneId: string
    }) => diagramApi.deleteLane(level, levelId, laneId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: diagramKeys.lanes(variables.level, variables.levelId),
      })
    },
  })
}

