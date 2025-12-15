/**
 * React Query hooks for AI Process generation
 */

import { useMutation } from '@tanstack/react-query';
import { generateProcess } from '../../../lib/api/ai.api';
import type { GenerateProcessRequest, GenerateProcessResponse } from '../../../lib/api/ai.api';
import { toast } from 'sonner';

/**
 * Hook pour générer un Process avec IA
 */
export function useAIGenerateProcess() {
  return useMutation({
    mutationFn: (request: GenerateProcessRequest) => generateProcess(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de la génération IA: ${error.message}`);
    },
  });
}

