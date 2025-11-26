import { useQuery } from '@tanstack/react-query';
import { sipocApi } from '../../lib/api/sipoc.api';

export interface SimilarElement {
  element: {
    id: string;
    title: string;
    description: string;
    type: string;
    sipoc_id: string;
  };
  sipoc: {
    sipoc_id: string;
    title: string;
  };
  similarityScore: number;
  matchType: 'exact' | 'contains' | 'partial' | 'word_match';
}

export const useSimilarElements = (
  sipocId: string,
  title: string,
  threshold: number = 0.3,
) => {
  return useQuery({
    queryKey: ['similar-elements', sipocId, title, threshold],
    queryFn: () => sipocApi.findSimilarElements(sipocId, title, threshold),
    enabled: !!title && title.length > 0 && !!sipocId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
  });
};
