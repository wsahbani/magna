/**
 * React Query hooks for ProcessMap data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { processMapApi } from '../../../lib/api/process-map.api'
import type {
  CreateProcessMapDto,
  UpdateProcessMapDto,
  ProcessMapListParams,
} from '../types/process-map.types'
import { toast } from 'sonner'

// Query keys
export const processMapKeys = {
  all: ['process-maps'] as const,
  lists: () => [...processMapKeys.all, 'list'] as const,
  list: (params?: ProcessMapListParams) => [...processMapKeys.lists(), params] as const,
  details: () => [...processMapKeys.all, 'detail'] as const,
  detail: (id: string) => [...processMapKeys.details(), id] as const,
  processes: (id: string) => [...processMapKeys.detail(id), 'processes'] as const,
}

/**
 * Get all ProcessMaps with pagination
 */
export const useProcessMaps = (params?: ProcessMapListParams) => {
  return useQuery({
    queryKey: processMapKeys.list(params),
    queryFn: () => processMapApi.getAll(params),
  })
}

/**
 * Get ProcessMap by ID
 */
export const useProcessMap = (id: string | undefined) => {
  return useQuery({
    queryKey: processMapKeys.detail(id!),
    queryFn: () => processMapApi.getById(id!),
    enabled: !!id,
  })
}

/**
 * Get ProcessMap processes
 */
export const useProcessMapProcesses = (id: string | undefined) => {
  return useQuery({
    queryKey: processMapKeys.processes(id!),
    queryFn: () => processMapApi.getProcesses(id!),
    enabled: !!id,
  })
}

/**
 * Create ProcessMap mutation
 */
export const useCreateProcessMap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProcessMapDto) => processMapApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processMapKeys.lists() })
      toast.success('Carte des processus créée avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création')
    },
  })
}

/**
 * Update ProcessMap mutation
 */
export const useUpdateProcessMap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessMapDto }) =>
      processMapApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: processMapKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: processMapKeys.lists() })
      toast.success('Carte des processus mise à jour avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour')
    },
  })
}

/**
 * Delete ProcessMap mutation
 */
export const useDeleteProcessMap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => processMapApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: processMapKeys.lists() })
      toast.success('Carte des processus supprimée avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression')
    },
  })
}

