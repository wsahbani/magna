/**
 * React Query hooks for extracting Process from image with AI
 */

import { useMutation } from '@tanstack/react-query';
import { extractProcessFromImage, type ExtractProcessFromImageRequest } from '../../../lib/api/ai.api';
import { toast } from 'sonner';

/**
 * Hook pour extraire un Process depuis une image avec IA vision
 */
export function useExtractProcessFromImage() {
  return useMutation({
    mutationFn: (request: ExtractProcessFromImageRequest) => extractProcessFromImage(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'extraction depuis l'image: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Process extrait avec succès depuis l\'image');
    },
  });
}

