/**
 * React Query hooks for Process (Level 2) entities
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProcesses,
  getProcess,
  createProcess,
  updateProcess,
  deleteProcess,
} from '../../../lib/api/process.api'
import type {
  Process,
  CreateProcessDto,
  UpdateProcessDto,
  ProcessListParams,
} from '../types/process.types'

const QUERY_KEYS = {
  all: ['processes'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params?: ProcessListParams) =>
    [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

/**
 * Hook to fetch all processes with optional filters
 */
export function useProcesses(params?: ProcessListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.list(params),
    queryFn: () => getProcesses(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch a single process by ID
 */
export function useProcess(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id!),
    queryFn: () => getProcess(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to create a new process
 */
export function useCreateProcess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProcessDto) => createProcess(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(data.id) })
      toast.success('Processus créé avec succès')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la création du processus',
      )
    },
  })
}

/**
 * Hook to update an existing process
 */
export function useUpdateProcess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessDto }) =>
      updateProcess(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(data.id) })
      toast.success('Processus mis à jour avec succès')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la mise à jour du processus',
      )
    },
  })
}

/**
 * Hook to delete a process
 */
export function useDeleteProcess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProcess(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(id) })
      toast.success('Processus supprimé avec succès')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erreur lors de la suppression du processus',
      )
    },
  })
}

