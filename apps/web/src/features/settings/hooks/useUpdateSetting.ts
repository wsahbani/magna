import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settingsApi';
import { settingsKeys } from './useSettings';
import { toast } from 'sonner';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string | null }) =>
      settingsApi.update(key, { value }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      toast.success('Paramètre mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.list('app') });
      toast.success('Logo mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
    },
  });
}
