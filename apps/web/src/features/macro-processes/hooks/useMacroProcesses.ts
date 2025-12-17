/**
 * React Query hooks for macro process data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { macroProcessApi } from '../../../lib/api/macro-process.api'
import type {
  CreateMacroProcessDto,
  UpdateMacroProcessDto,
  MacroProcessListParams,
  ReorderMacroProcessDto,
} from '../types/macro-process.types'

// Query keys
export const macroProcessKeys = {
  all: ['macro-processes'] as const,
  lists: () => [...macroProcessKeys.all, 'list'] as const,
  list: (params?: MacroProcessListParams) =>
    [...macroProcessKeys.lists(), params] as const,
  details: () => [...macroProcessKeys.all, 'detail'] as const,
  detail: (id: string) => [...macroProcessKeys.details(), id] as const,
}

/**
 * Get all macro processes with pagination
 */
export const useMacroProcesses = (params?: MacroProcessListParams) => {
  return useQuery({
    queryKey: macroProcessKeys.list(params),
    queryFn: () => macroProcessApi.getMacroProcesses(params),
  })
}

/**
 * Get macro process by ID
 */
export const useMacroProcess = (id: string | undefined) => {
  return useQuery({
    queryKey: macroProcessKeys.detail(id!),
    queryFn: () => macroProcessApi.getMacroProcessById(id!),
    enabled: !!id,
  })
}

/**
 * Create macro process mutation
 */
export const useCreateMacroProcess = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMacroProcessDto) =>
      macroProcessApi.createMacroProcess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: macroProcessKeys.lists() })
    },
  })
}

/**
 * Update macro process mutation
 */
export const useUpdateMacroProcess = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateMacroProcessDto
    }) => macroProcessApi.updateMacroProcess(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: macroProcessKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: macroProcessKeys.lists() })
    },
  })
}

/**
 * Delete macro process mutation
 */
export const useDeleteMacroProcess = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => macroProcessApi.deleteMacroProcess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: macroProcessKeys.lists() })
    },
  })
}

/**
 * Reorder macro processes mutation
 */
export const useReorderMacroProcesses = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReorderMacroProcessDto) =>
      macroProcessApi.reorderMacroProcesses(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: macroProcessKeys.lists() })
    },
  })
}

