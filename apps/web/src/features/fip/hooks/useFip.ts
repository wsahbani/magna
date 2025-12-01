import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fipApi } from '../../../services/fipApi';
import {
  ProcessIdentityCard,
  CreateFipDto,
  UpdateFipDto,
} from '../types/fip.types';

/**
 * Hook to fetch FIP by ID
 */
export function useFip(fipId: string | null) {
  return useQuery({
    queryKey: ['fip', fipId],
    queryFn: () => {
      if (!fipId) throw new Error('FIP ID is required');
      return fipApi.getFipById(fipId);
    },
    enabled: !!fipId,
  });
}

/**
 * Hook to fetch FIP by Process ID
 */
export function useFipByProcess(processId: string | null) {
  return useQuery({
    queryKey: ['fip', 'process', processId],
    queryFn: () => {
      if (!processId) throw new Error('Process ID is required');
      return fipApi.getFipByProcessId(processId);
    },
    enabled: !!processId,
  });
}

/**
 * Hook to create a new FIP
 */
export function useCreateFip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFipDto) => fipApi.createFip(data),
    onSuccess: (fip) => {
      queryClient.invalidateQueries({ queryKey: ['fip'] });
      queryClient.setQueryData(['fip', fip.fip_id], fip);
      queryClient.setQueryData(['fip', 'process', fip.processId], fip);
    },
  });
}

/**
 * Hook to update an existing FIP
 */
export function useUpdateFip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fipId, data }: { fipId: string; data: UpdateFipDto }) =>
      fipApi.updateFip(fipId, data),
    onSuccess: (fip) => {
      queryClient.invalidateQueries({ queryKey: ['fip'] });
      queryClient.setQueryData(['fip', fip.fip_id], fip);
      queryClient.setQueryData(['fip', 'process', fip.processId], fip);
    },
  });
}

/**
 * Hook to delete a FIP
 */
export function useDeleteFip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fipId: string) => fipApi.deleteFip(fipId),
    onSuccess: (_, fipId) => {
      queryClient.invalidateQueries({ queryKey: ['fip'] });
      queryClient.removeQueries({ queryKey: ['fip', fipId] });
    },
  });
}

