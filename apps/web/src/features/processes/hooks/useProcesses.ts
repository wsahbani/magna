/**
 * React Query hooks for process data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { processApi } from '../../../lib/api/process.api'
import type {
  CreateProcessDto,
  UpdateProcessDto,
  UpdateProcessStatusDto,
  ProcessListParams,
} from '../types/process.types'

// Query keys
export const processKeys = {
  all: ['processes'] as const,
  lists: () => [...processKeys.all, 'list'] as const,
  list: (params?: ProcessListParams) => [...processKeys.lists(), params] as const,
  roots: () => [...processKeys.all, 'roots'] as const,
  details: () => [...processKeys.all, 'detail'] as const,
  detail: (id: string) => [...processKeys.details(), id] as const,
  hierarchy: (id: string) => [...processKeys.detail(id), 'hierarchy'] as const,
}

/**
 * Get all processes with pagination
 */
export const useProcesses = (params?: ProcessListParams) => {
  return useQuery({
    queryKey: processKeys.list(params),
    queryFn: () => processApi.getProcesses(params),
  })
}

/**
 * Get root processes
 */
export const useRootProcesses = () => {
  return useQuery({
    queryKey: processKeys.roots(),
    queryFn: () => processApi.getRootProcesses(),
  })
}

/**
 * Get process by ID
 */
export const useProcess = (id: string | undefined) => {
  return useQuery({
    queryKey: processKeys.detail(id!),
    queryFn: () => processApi.getProcessById(id!),
    enabled: !!id,
  })
}

/**
 * Get process hierarchy
 */
export const useProcessHierarchy = (id: string | undefined) => {
  return useQuery({
    queryKey: processKeys.hierarchy(id!),
    queryFn: () => processApi.getProcessHierarchy(id!),
    enabled: !!id,
  })
}

/**
 * Create process mutation
 */
export const useCreateProcess = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProcessDto) => processApi.createProcess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processKeys.lists() })
      queryClient.invalidateQueries({ queryKey: processKeys.roots() })
    },
  })
}

/**
 * Update process mutation
 */
export const useUpdateProcess = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessDto }) =>
      processApi.updateProcess(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: processKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: processKeys.lists() })
    },
  })
}

/**
 * Update process status mutation
 */
export const useUpdateProcessStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessStatusDto }) =>
      processApi.updateProcessStatus(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: processKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: processKeys.lists() })
    },
  })
}

/**
 * Delete process mutation
 */
export const useDeleteProcess = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => processApi.deleteProcess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processKeys.lists() })
      queryClient.invalidateQueries({ queryKey: processKeys.roots() })
    },
  })
}
