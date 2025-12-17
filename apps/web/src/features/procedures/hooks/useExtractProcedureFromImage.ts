/**
 * React Query hooks for extracting Procedure from image with AI
 */

import { useMutation } from '@tanstack/react-query';
import { extractProcedureFromImage, type ExtractProcedureFromImageRequest } from '../../../lib/api/ai.api';
import { toast } from 'sonner';

/**
 * Hook pour extraire une Procedure depuis une image avec IA vision
 */
export function useExtractProcedureFromImage() {
  return useMutation({
    mutationFn: (request: ExtractProcedureFromImageRequest) => extractProcedureFromImage(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'extraction depuis l'image: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Procedure extraite avec succès depuis l\'image');
    },
  });
}

