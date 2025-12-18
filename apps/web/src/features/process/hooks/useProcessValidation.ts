/**
 * React Query hooks for Process Validation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  requestProcessValidation,
  getProcessValidationRequests,
  approveValidation,
  rejectValidation,
  getPendingValidations,
} from '../../../lib/api/process.api'

const VALIDATION_QUERY_KEYS = {
  all: ['process-validation'] as const,
  requests: (processId: string) =>
    [...VALIDATION_QUERY_KEYS.all, 'requests', processId] as const,
  pending: () => [...VALIDATION_QUERY_KEYS.all, 'pending'] as const,
}

/**
 * Hook to get validation requests for a process
 */
export function useProcessValidationRequests(processId: string | undefined) {
  return useQuery({
    queryKey: VALIDATION_QUERY_KEYS.requests(processId!),
    queryFn: () => getProcessValidationRequests(processId!),
    enabled: !!processId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to get pending validation requests for current user
 */
export function usePendingValidations() {
  return useQuery({
    queryKey: VALIDATION_QUERY_KEYS.pending(),
    queryFn: () => getPendingValidations(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook to request validation for a process
 */
export function useRequestValidation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      processId,
      validatorIds,
    }: {
      processId: string
      validatorIds: string[]
    }) => requestProcessValidation(processId, validatorIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: VALIDATION_QUERY_KEYS.requests(variables.processId),
      })
      queryClient.invalidateQueries({
        queryKey: VALIDATION_QUERY_KEYS.pending(),
      })
      toast.success('Demande de validation envoyée avec succès')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Erreur lors de l\'envoi de la demande de validation',
      )
    },
  })
}

/**
 * Hook to approve a validation request
 */
export function useApproveValidation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      comment,
    }: {
      requestId: string
      comment?: string
    }) => approveValidation(requestId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VALIDATION_QUERY_KEYS.all,
      })
      toast.success('Validation approuvée avec succès')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Erreur lors de l\'approbation de la validation',
      )
    },
  })
}

/**
 * Hook to reject a validation request
 */
export function useRejectValidation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      comment,
    }: {
      requestId: string
      comment: string
    }) => rejectValidation(requestId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: VALIDATION_QUERY_KEYS.all,
      })
      toast.success('Validation rejetée')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Erreur lors du rejet de la validation',
      )
    },
  })
}

