import React, { useState } from 'react';
import { SipocElement, ElementType } from '../types/sipoc.types';
import { useSipocStore } from '../store/sipocStore';
import { useSimilarElements } from '../hooks/useSipoc';
import { Button } from '@repo/ui';
import { Card } from '@repo/ui';
import {
  Pencil,
  Trash2,
  Save,
  X,
  Zap,
  ChevronDown,
  Star,
  ExternalLink,
  Loader2,
  Link2,
} from 'lucide-react';

import { cn } from '@repo/ui/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@repo/ui/components/ui/dropdown-menu';

interface SipocElementCardProps {
  element: SipocElement;
  sipocId: string;
  className?: string;
}

const ELEMENT_TYPE_BADGE_COLORS: Record<ElementType, string> = {
  [ElementType.supplier]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ElementType.input]: 'bg-green-100 text-green-800 border-green-200',
  [ElementType.process]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ElementType.output]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ElementType.customer]: 'bg-pink-100 text-pink-800 border-pink-200',
};

export const SipocElementCard: React.FC<SipocElementCardProps> = ({
  element,
  sipocId,
  className,
}) => {
  const { updateElement, deleteElement } = useSipocStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(element.title);
  const [description, setDescription] = useState(element.description);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get similar elements with AI-powered suggestions
  const { data: similarElements, isLoading: loadingSimilar } = useSimilarElements(
    sipocId,
    element.title,
    0.3 // similarity threshold
  );

  console.log('Similar Elements:', similarElements);

  const handleSave = async () => {
    await updateElement(sipocId, element.id, { title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(element.title);
    setDescription(element.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      await deleteElement(sipocId, element.id);
    }
  };

  const handleQuickConnect = (similarElement: any) => {
    // TODO: Create connection between current element and similar element
    console.log('Quick connect:', element, '→', similarElement);
    setDropdownOpen(false);
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return 'Exact';
      case 'contains':
        return 'Contient';
      case 'partial':
        return 'Partiel';
      case 'word_match':
        return 'Mot';
      default:
        return '';
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${className || ''}`}>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm font-medium"
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm resize-none"
            rows={3}
            placeholder="Description"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm">{element.title}</h4>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          </div>
          {element.description && (
            <p className="text-xs text-gray-600 line-clamp-3 mb-2">
              {element.description}
            </p>
          )}

          {/* Smart Suggestions Dropdown */}
          <div className="mt-2 mb-2">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors w-full justify-center">
                  <Zap className="h-3 w-3" />
                  <span className="font-medium">Suggestions IA</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-xs flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-blue-600" />
                  Éléments similaires suggérés
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {loadingSimilar ? (
                  <div className="p-4 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-blue-500" />
                    <p className="text-xs text-gray-500 mt-2">Recherche en cours...</p>
                  </div>
                ) : similarElements && similarElements.length > 0 ? (
                  <>
                    {similarElements.slice(0, 5).map((item: any) => (
                      <DropdownMenuItem
                        key={item.element.id}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-blue-50"
                        onClick={() => handleQuickConnect(item)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                            {item.element.title}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            <span
                              className={cn(
                                'text-xs font-semibold',
                                getSimilarityColor(item.similarityScore)
                              )}
                            >
                              {Math.round(item.similarityScore * 100)}%
                            </span>
                            <span
                              className={cn(
                                'text-[10px] px-1.5 py-0.5 rounded border font-medium',
                                ELEMENT_TYPE_BADGE_COLORS[item.element.type as ElementType]
                              )}
                            >
                              {item.element.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600 w-full">
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate flex-1">{item.sipoc.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                            {getMatchTypeLabel(item.matchType)}
                          </span>
                        </div>

                        {item.element.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 w-full">
                            {item.element.description}
                          </p>
                        )}
                      </DropdownMenuItem>
                    ))}

                    {similarElements.length > 5 && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="px-3 py-2 text-center">
                          <p className="text-xs text-gray-500">
                            +{similarElements.length - 5} autres éléments similaires
                          </p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-gray-500">
                      Aucun élément similaire trouvé
                    </p>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {element.contactInfo && (
            <p className="text-xs text-gray-500 mt-1">📧 {element.contactInfo}</p>
          )}
          {element.responsibleRole && (
            <p className="text-xs text-gray-500 mt-1">👤 {element.responsibleRole}</p>
          )}
          {element.duration && (
            <p className="text-xs text-gray-500 mt-1">⏱️ {element.duration}</p>
          )}
        </div>
      )}
    </Card>
  );
};
