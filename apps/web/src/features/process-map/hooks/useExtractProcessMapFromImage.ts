/**
 * React Query hooks for extracting ProcessMap from image with AI
 */

import { useMutation } from '@tanstack/react-query';
import { extractProcessMapFromImage, type ExtractProcessMapFromImageRequest } from '../../../lib/api/ai.api';
import { toast } from 'sonner';

/**
 * Hook pour extraire une ProcessMap depuis une image avec IA vision
 */
export function useExtractProcessMapFromImage() {
  return useMutation({
    mutationFn: (request: ExtractProcessMapFromImageRequest) => extractProcessMapFromImage(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'extraction depuis l'image: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('ProcessMap extraite avec succès depuis l\'image');
    },
  });
}

