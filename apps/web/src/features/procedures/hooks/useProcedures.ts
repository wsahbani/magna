/**
 * React Query hooks for procedure data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { procedureApi } from '../../../lib/api/procedure.api'
import type {
  CreateProcedureDto,
  UpdateProcedureDto,
  CreateDiagramNodeDto,
  CreateDiagramEdgeDto,
  CreateDiagramLaneDto,
} from '../types/procedure.types'

// Query keys
export const procedureKeys = {
  all: ['procedures'] as const,
  lists: () => [...procedureKeys.all, 'list'] as const,
  list: (processId?: string) =>
    [...procedureKeys.lists(), processId] as const,
  details: () => [...procedureKeys.all, 'detail'] as const,
  detail: (id: string) => [...procedureKeys.details(), id] as const,
  nodes: (id: string) => [...procedureKeys.detail(id), 'nodes'] as const,
  edges: (id: string) => [...procedureKeys.detail(id), 'edges'] as const,
  lanes: (id: string) => [...procedureKeys.detail(id), 'lanes'] as const,
  versions: (id: string) => [...procedureKeys.detail(id), 'versions'] as const,
  validation: (id: string) =>
    [...procedureKeys.detail(id), 'validation'] as const,
}

/**
 * Get all procedures
 */
export const useProcedures = (processId?: string) => {
  return useQuery({
    queryKey: procedureKeys.list(processId),
    queryFn: () => procedureApi.getProcedures(processId),
  })
}

/**
 * Get procedure by ID
 */
export const useProcedure = (id: string | undefined) => {
  return useQuery({
    queryKey: procedureKeys.detail(id!),
    queryFn: () => procedureApi.getProcedureById(id!),
    enabled: !!id,
  })
}

/**
 * Get procedure nodes
 */
export const useProcedureNodes = (procedureId: string | undefined) => {
  return useQuery({
    queryKey: procedureKeys.nodes(procedureId!),
    queryFn: () => procedureApi.getNodes(procedureId!),
    enabled: !!procedureId,
  })
}

/**
 * Get procedure edges
 */
export const useProcedureEdges = (procedureId: string | undefined) => {
  return useQuery({
    queryKey: procedureKeys.edges(procedureId!),
    queryFn: () => procedureApi.getEdges(procedureId!),
    enabled: !!procedureId,
  })
}

/**
 * Get procedure lanes
 */
export const useProcedureLanes = (procedureId: string | undefined) => {
  return useQuery({
    queryKey: procedureKeys.lanes(procedureId!),
    queryFn: () => procedureApi.getLanes(procedureId!),
    enabled: !!procedureId,
  })
}

/**
 * Get procedure versions
 */
export const useProcedureVersions = (procedureId: string | undefined) => {
  return useQuery({
    queryKey: procedureKeys.versions(procedureId!),
    queryFn: () => procedureApi.getVersions(procedureId!),
    enabled: !!procedureId,
  })
}

/**
 * Get procedure validation
 */
export const useProcedureValidation = (procedureId: string | undefined) => {
  return useQuery({
    queryKey: procedureKeys.validation(procedureId!),
    queryFn: () => procedureApi.validateProcedure(procedureId!),
    enabled: !!procedureId,
  })
}

/**
 * Create procedure mutation
 */
export const useCreateProcedure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProcedureDto) =>
      procedureApi.createProcedure(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.list(variables.processId),
      })
    },
  })
}

/**
 * Update procedure mutation
 */
export const useUpdateProcedure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcedureDto }) =>
      procedureApi.updateProcedure(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: procedureKeys.lists() })
    },
  })
}

/**
 * Delete procedure mutation
 */
export const useDeleteProcedure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => procedureApi.deleteProcedure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: procedureKeys.lists() })
    },
  })
}

/**
 * Create node mutation
 */
export const useCreateNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      data,
    }: {
      procedureId: string
      data: CreateDiagramNodeDto
    }) => procedureApi.createNode(procedureId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.nodes(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Update node mutation
 */
export const useUpdateNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      nodeId,
      data,
    }: {
      procedureId: string
      nodeId: string
      data: Partial<CreateDiagramNodeDto>
    }) => procedureApi.updateNode(procedureId, nodeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.nodes(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Delete node mutation
 */
export const useDeleteNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      nodeId,
    }: {
      procedureId: string
      nodeId: string
    }) => procedureApi.deleteNode(procedureId, nodeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.nodes(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Create edge mutation
 */
export const useCreateEdge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      data,
    }: {
      procedureId: string
      data: CreateDiagramEdgeDto
    }) => procedureApi.createEdge(procedureId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.edges(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Update edge mutation
 */
export const useUpdateEdge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      edgeId,
      data,
    }: {
      procedureId: string
      edgeId: string
      data: Partial<CreateDiagramEdgeDto>
    }) => procedureApi.updateEdge(procedureId, edgeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.edges(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Delete edge mutation
 */
export const useDeleteEdge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      edgeId,
    }: {
      procedureId: string
      edgeId: string
    }) => procedureApi.deleteEdge(procedureId, edgeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.edges(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Create lane mutation
 */
export const useCreateLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      data,
    }: {
      procedureId: string
      data: CreateDiagramLaneDto
    }) => procedureApi.createLane(procedureId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.lanes(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Update lane mutation
 */
export const useUpdateLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      laneId,
      data,
    }: {
      procedureId: string
      laneId: string
      data: Partial<CreateDiagramLaneDto>
    }) => procedureApi.updateLane(procedureId, laneId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.lanes(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Delete lane mutation
 */
export const useDeleteLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      laneId,
    }: {
      procedureId: string
      laneId: string
    }) => procedureApi.deleteLane(procedureId, laneId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.lanes(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

/**
 * Validate procedure mutation
 */
export const useValidateProcedure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (procedureId: string) =>
      procedureApi.validateProcedure(procedureId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.validation(variables),
      })
    },
  })
}

/**
 * Publish procedure mutation
 */
export const usePublishProcedure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (procedureId: string) =>
      procedureApi.publishProcedure(procedureId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables),
      })
      queryClient.invalidateQueries({ queryKey: procedureKeys.lists() })
    },
  })
}

/**
 * Create version mutation
 */
export const useCreateVersion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      procedureId,
      changeLog,
    }: {
      procedureId: string
      changeLog?: string
    }) => procedureApi.createVersion(procedureId, changeLog),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: procedureKeys.versions(variables.procedureId),
      })
      queryClient.invalidateQueries({
        queryKey: procedureKeys.detail(variables.procedureId),
      })
    },
  })
}

