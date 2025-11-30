/**
 * React Query hooks for SIPOC data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sipocApi, CreateSipocDto, UpdateSipocDto } from '../../../lib/api/sipoc.api'

// Query keys
export const sipocKeys = {
  all: ['sipoc'] as const,
  lists: () => [...sipocKeys.all, 'list'] as const,
  list: (params?: { userId?: string; status?: string; processId?: string }) =>
    [...sipocKeys.lists(), params] as const,
  details: () => [...sipocKeys.all, 'detail'] as const,
  detail: (id: string) => [...sipocKeys.details(), id] as const,
  byProcess: (processId: string) => [...sipocKeys.all, 'process', processId] as const,
  connections: {
    all: ['sipoc-connections'] as const,
    byElement: (elementId: string) => [...sipocKeys.connections.all, 'element', elementId] as const,
    bySipoc: (sipocId: string) => [...sipocKeys.connections.all, 'sipoc', sipocId] as const,
  },
}

/**
 * Get all SIPOC diagrams with optional filters
 */
export const useSipocDiagrams = (params?: {
  userId?: string
  status?: string
  processId?: string
}) => {
  return useQuery({
    queryKey: sipocKeys.list(params),
    queryFn: () => sipocApi.getSipocDiagrams(params),
  })
}

/**
 * Get SIPOC diagrams by process ID
 */
export const useSipocDiagramsByProcessId = (processId: string | undefined) => {
  return useQuery({
    queryKey: sipocKeys.byProcess(processId!),
    queryFn: () => sipocApi.getSipocDiagramsByProcessId(processId!),
    enabled: !!processId,
  })
}

/**
 * Get SIPOC diagram by ID
 */
export const useSipocDiagram = (id: string | undefined) => {
  return useQuery({
    queryKey: sipocKeys.detail(id!),
    queryFn: () => sipocApi.getSipocDiagramById(id!),
    enabled: !!id,
  })
}

/**
 * Create SIPOC diagram mutation
 */
export const useCreateSipocDiagram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, userId }: { data: CreateSipocDto; userId: string }) =>
      sipocApi.createSipocDiagram(data, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sipocKeys.lists() })
    },
  })
}

/**
 * Update SIPOC diagram mutation
 */
export const useUpdateSipocDiagram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSipocDto }) =>
      sipocApi.updateSipocDiagram(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: sipocKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: sipocKeys.lists() })
    },
  })
}

/**
 * Delete SIPOC diagram mutation
 */
export const useDeleteSipocDiagram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => sipocApi.deleteSipocDiagram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sipocKeys.lists() })
    },
  })
}

// ====================================
// SIPOC CONNECTIONS HOOKS
// ====================================

/**
 * Create SIPOC connection mutation
 */
export const useCreateSipocConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sipocApi.createConnection,
    onSuccess: (_data, variables) => {
      // Invalidate connections for both source and target elements
      queryClient.invalidateQueries({ 
        queryKey: sipocKeys.connections.byElement(variables.sourceElementId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: sipocKeys.connections.byElement(variables.targetElementId) 
      })
      // Invalidate connections for both SIPOCs
      queryClient.invalidateQueries({ 
        queryKey: sipocKeys.connections.bySipoc(variables.sourceSipocId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: sipocKeys.connections.bySipoc(variables.targetSipocId) 
      })
    },
  })
}

/**
 * Get connections by element ID
 */
export const useSipocConnectionsByElement = (elementId: string | undefined) => {
  return useQuery({
    queryKey: sipocKeys.connections.byElement(elementId!),
    queryFn: () => sipocApi.getConnectionsByElement(elementId!),
    enabled: !!elementId,
  })
}

/**
 * Get connections by SIPOC ID
 */
export const useSipocConnectionsBySipoc = (sipocId: string | undefined) => {
  return useQuery({
    queryKey: sipocKeys.connections.bySipoc(sipocId!),
    queryFn: () => sipocApi.getConnectionsBySipoc(sipocId!),
    enabled: !!sipocId,
  })
}

/**
 * Delete SIPOC connection mutation
 */
export const useDeleteSipocConnection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (connectionId: string) => sipocApi.deleteConnection(connectionId),
    onSuccess: () => {
      // Invalidate all connection queries
      queryClient.invalidateQueries({ queryKey: sipocKeys.connections.all })
    },
  })
}

// ====================================
// SIPOC ELEMENTS - SIMILAR SEARCH
// ====================================

/**
 * Find similar SIPOC elements based on title
 * Uses AI-powered similarity matching to suggest related elements
 */
export const useSimilarElements = (
  sipocId: string | undefined,
  title: string | undefined,
  threshold: number = 0.3
) => {
  return useQuery({
    queryKey: ['sipoc', 'similar-elements', sipocId, title, threshold],
    queryFn: () => sipocApi.findSimilarElements(sipocId!, title!, threshold),
    enabled: !!sipocId && !!title && title.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
  })
}
