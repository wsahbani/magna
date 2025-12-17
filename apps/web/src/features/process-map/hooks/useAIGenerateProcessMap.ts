/**
 * React Query hooks for AI ProcessMap generation
 */

import { useMutation } from '@tanstack/react-query';
import { generateProcessMap } from '../../../lib/api/ai.api';
import type { GenerateProcessMapRequest } from '../../../lib/api/ai.api';
import { toast } from 'sonner';

/**
 * Hook pour générer une ProcessMap avec IA
 */
export function useAIGenerateProcessMap() {
  return useMutation({
    mutationFn: (request: GenerateProcessMapRequest) => generateProcessMap(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de la génération IA: ${error.message}`);
    },
  });
}

