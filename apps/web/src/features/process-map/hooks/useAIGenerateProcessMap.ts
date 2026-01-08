/**
 * React Query hooks for AI ProcessMap generation
 */

import { useMutation } from '@tanstack/react-query';
import { generateProcessMap, analyzeProcessMapImage } from '../../../lib/api/ai.api';
import type { GenerateProcessMapRequest, AnalyzeProcessMapImageRequest } from '../../../lib/api/ai.api';
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

/**
 * Hook pour analyser une image et détecter les processus (sans créer de nodes)
 */
export function useAIAnalyzeProcessMapImage() {
  return useMutation({
    mutationFn: (request: AnalyzeProcessMapImageRequest) => analyzeProcessMapImage(request),
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'analyse de l'image: ${error.message}`);
    },
  });
}

