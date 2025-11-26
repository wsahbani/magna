import { Lightbulb, ExternalLink, TrendingUp } from 'lucide-react';
import { Card } from '@repo/ui';
import { Caption, BodySmall } from '@repo/ui';
import { SimilarElement, useSimilarElements } from '../../../hooks/sipoc/useSimilarElements';


interface SipocSimilarSuggestionsProps {
  sipocId: string;
  elementTitle: string;
  threshold?: number;
  onSuggestionClick?: (suggestion: SimilarElement) => void;
}

const matchTypeConfig = {
  exact: { label: 'Correspondance exacte', color: 'text-green-600', bg: 'bg-green-50' },
  contains: { label: 'Contient', color: 'text-blue-600', bg: 'bg-blue-50' },
  word_match: { label: 'Mots similaires', color: 'text-orange-600', bg: 'bg-orange-50' },
  partial: { label: 'Partielle', color: 'text-gray-600', bg: 'bg-gray-50' },
};

export function SipocSimilarSuggestions({
  sipocId,
  elementTitle,
  threshold = 0.3,
  onSuggestionClick,
}: SipocSimilarSuggestionsProps) {
  const { data: suggestions, isLoading, error } = useSimilarElements(sipocId, elementTitle, threshold);

  if (isLoading) {
    return (
      <Card className="p-4 border-dashed border-gray-300">
        <div className="flex items-center gap-2 text-gray-500">
          <Lightbulb className="w-4 h-4 animate-pulse" />
          <BodySmall>Recherche de suggestions similaires...</BodySmall>
        </div>
      </Card>
    );
  }

  if (error) {
    return null; // Fail silently
  }

  if (!suggestions || suggestions.length === 0) {
    return null; // Don't show anything if no suggestions
  }

  return (
    <Card className="p-4 border-orange-200 bg-orange-50/30">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-orange-600" />
        <BodySmall className="font-semibold text-orange-900">
          Suggestions IA ({suggestions.length})
        </BodySmall>
      </div>

      <div className="space-y-2">
        {suggestions.slice(0, 5).map((suggestion :SimilarElement , index :number) => {
          const matchConfig = matchTypeConfig[suggestion.matchType];
          const scorePercentage = Math.round(suggestion.similarityScore * 100);

          return (
            <button
              key={`${suggestion.element.id}-${index}`}
              onClick={() => onSuggestionClick?.(suggestion)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-white transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BodySmall className="font-medium text-gray-900 truncate">
                      {suggestion.element.title}
                    </BodySmall>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>

                  {suggestion.element.description && (
                    <Caption className="text-gray-600 line-clamp-2 mb-2">
                      {suggestion.element.description}
                    </Caption>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${matchConfig.bg} ${matchConfig.color}`}>
                      {matchConfig.label}
                    </span>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <Caption>{scorePercentage}%</Caption>
                    </div>

                    <Caption className="text-gray-500 truncate">
                      de {suggestion.sipoc.title}
                    </Caption>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {suggestions.length > 5 && (
        <Caption className="text-gray-500 text-center mt-2">
          +{suggestions.length - 5} autres suggestions
        </Caption>
      )}
    </Card>
  );
}
