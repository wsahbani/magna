import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { procedureApi } from '../../../lib/api/procedure.api';

const QUERY_KEYS = {
  all: ['procedureValidations'] as const,
  requests: (procedureId: string) => [...QUERY_KEYS.all, 'requests', procedureId] as const,
  pending: (userId: string) => [...QUERY_KEYS.all, 'pending', userId] as const,
};

export function useProcedureValidationRequests(procedureId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.requests(procedureId),
    queryFn: () => procedureApi.getValidationRequests(procedureId),
    enabled: !!procedureId,
  });
}

export function usePendingProcedureValidations(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.pending(userId),
    queryFn: () => procedureApi.getPendingValidations(),
    enabled: !!userId,
  });
}

export function useRequestProcedureValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      procedureId,
      data,
    }: {
      procedureId: string;
      data: { validatorIds: string[]; comment?: string };
    }) => procedureApi.requestValidation(procedureId, data),
    onSuccess: (_, { procedureId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests(procedureId) });
      queryClient.invalidateQueries({ queryKey: ['procedures'] }); // Invalidate procedure list to update status
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

export function useApproveProcedureValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: { comment?: string } }) =>
      procedureApi.approveValidation(requestId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests(data.procedureId || data.procedure?.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pending(data.validatorId) });
      queryClient.invalidateQueries({ queryKey: ['procedures'] }); // Invalidate procedure list to update status
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

export function useRejectProcedureValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: { comment: string } }) =>
      procedureApi.rejectValidation(requestId, data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests(data.procedureId || data.procedure?.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pending(data.validatorId) });
      queryClient.invalidateQueries({ queryKey: ['procedures'] }); // Invalidate procedure list to update status
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

