/**
 * React Query hooks for AI Procedure generation
 */

import { useMutation } from '@tanstack/react-query';
import { generateProcedure } from '../../../lib/api/ai.api';
import type { GenerateProcedureRequest, GenerateProcedureResponse } from '../../../lib/api/ai.api';
import { toast } from 'sonner';

/**
 * Hook pour générer une Procedure avec IA
 */
export function useAIGenerateProcedure() {
  return useMutation({
    mutationFn: (request: GenerateProcedureRequest) => generateProcedure(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de la génération IA: ${error.message}`);
    },
  });
}

