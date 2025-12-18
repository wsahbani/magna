import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { processMapApi } from '../../../lib/api/process-map.api';

const QUERY_KEYS = {
  all: ['processMapValidations'] as const,
  requests: (processMapId: string) => [...QUERY_KEYS.all, 'requests', processMapId] as const,
  pending: (userId: string) => [...QUERY_KEYS.all, 'pending', userId] as const,
};

export function useProcessMapValidationRequests(processMapId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.requests(processMapId),
    queryFn: () => processMapApi.getValidationRequests(processMapId),
    enabled: !!processMapId,
  });
}

export function usePendingProcessMapValidations(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.pending(userId),
    queryFn: () => processMapApi.getPendingValidations(),
    enabled: !!userId,
  });
}

export function useRequestProcessMapValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      processMapId,
      data,
    }: {
      processMapId: string;
      data: { validatorIds: string[]; comment?: string };
    }) => processMapApi.requestValidation(processMapId, data),
    onSuccess: (_, { processMapId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests(processMapId) });
      queryClient.invalidateQueries({ queryKey: ['processMaps'] }); // Invalidate process map list to update status
      toast.success('Demande de validation envoyée avec succès');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Erreur lors de l\'envoi de la demande de validation',
      );
    },
  });
}

export function useApproveProcessMapValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: { comment?: string } }) =>
      processMapApi.approveValidation(requestId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests(data.processMapId || data.processMap?.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pending(data.validatorId) });
      queryClient.invalidateQueries({ queryKey: ['processMaps'] }); // Invalidate process map list to update status
      toast.success('Demande de validation approuvée');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Erreur lors de l\'approbation de la demande de validation',
      );
    },
  });
}

export function useRejectProcessMapValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: { comment: string } }) =>
      processMapApi.rejectValidation(requestId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests(data.processMapId || data.processMap?.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pending(data.validatorId) });
      queryClient.invalidateQueries({ queryKey: ['processMaps'] }); // Invalidate process map list to update status
      toast.success('Demande de validation rejetée');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Erreur lors du rejet de la demande de validation',
      );
    },
  });
}

