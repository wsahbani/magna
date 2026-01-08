import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Heading2, BodySmall, Caption, cn } from '@repo/ui';

interface FipAccordionSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  count?: number;
  completionPercentage?: number;
  onToggle?: (expanded: boolean) => void;
  className?: string;
}

/**
 * Composant accordéon réutilisable pour les sections de la FIP
 * Sauvegarde l'état d'expansion dans le localStorage
 */
export function FipAccordionSection({
  id,
  title,
  icon,
  children,
  defaultExpanded = false,
  count,
  completionPercentage,
  onToggle,
  className,
}: FipAccordionSectionProps) {
  const storageKey = `fip-accordion-${id}`;
  
  // Récupérer l'état depuis localStorage ou utiliser la valeur par défaut
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? saved === 'true' : defaultExpanded;
    }
    return defaultExpanded;
  });

  // Sauvegarder l'état dans localStorage quand il change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(isExpanded));
    }
    onToggle?.(isExpanded);
  }, [isExpanded, storageKey, onToggle]);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const getCompletionColor = (percentage?: number) => {
    if (!percentage) return 'bg-gray-200';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden', className)}>
      <button
        onClick={toggleExpanded}
        className={cn(
          'w-full flex items-center gap-4 px-6 py-4 transition-all duration-200',
          'hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
          isExpanded && 'bg-gradient-to-r from-orange-50/50 to-transparent border-b border-gray-200'
        )}
        aria-expanded={isExpanded}
        aria-controls={`fip-section-${id}`}
      >
        <ChevronDown
          className={cn(
            'w-5 h-5 text-orange-500 transition-transform duration-300 flex-shrink-0',
            isExpanded ? 'rotate-0' : '-rotate-90'
          )}
        />
        
        {icon && (
          <span className="text-orange-600 flex-shrink-0 w-6 h-6 flex items-center justify-center">
            {icon}
          </span>
        )}

        <div className="flex-1 text-left min-w-0">
          <span className="text-base font-semibold text-gray-900 truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">{/* Badge de complétude */}
          {completionPercentage !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className={cn('h-full transition-all duration-500 rounded-full', getCompletionColor(completionPercentage))}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <Caption className="text-gray-600 text-xs font-bold min-w-[3rem] text-right">
                {completionPercentage}%
              </Caption>
            </div>
          )}

          {/* Badge de compteur */}
          {count !== undefined && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full shadow-sm">
              {count}
            </span>
          )}
        </div>
      </button>

      {/* Contenu de la section */}
      <div
        id={`fip-section-${id}`}
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isExpanded ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isExpanded}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

