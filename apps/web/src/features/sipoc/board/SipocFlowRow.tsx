import React, { useState, useMemo, useCallback } from 'react';
import { ElementType, SipocElement, SipocDiagram, SipocConnection } from '../types/sipoc.types';
import { groupElementsByType } from '../utils/sipoc-helpers';
import { EditElementModal } from '../components/EditElementModal';
import { SipocRelationModal } from '../components/SipocRelationModal';
import { BodySmall, Caption } from '@repo/ui';
import { Pencil, Trash2, GripVertical, Plus, Link2, Lightbulb, TrendingUp, ExternalLink, Loader2, ChevronDown, ArrowRight, X } from 'lucide-react';
import { useSimilarElements, useSipocConnectionsByElement, useSipocConnectionsBySipoc, useDeleteSipocConnection } from '../hooks/useSipoc';
import type { SimilarElement } from '../../../hooks/sipoc/useSimilarElements';
import { useNavigate } from '@tanstack/react-router';

// Suggestion Dropdown Component
interface SuggestionDropdownProps {
  element: SipocElement;
  currentSipocId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSuggestionClick: (suggestion: SimilarElement) => void;
  matchTypeConfig: Record<string, { label: string; color: string; bg: string }>;
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  element,
  currentSipocId,
  isExpanded,
  onToggle,
  onSuggestionClick,
  matchTypeConfig,
}) => {
  const { data: suggestions, isLoading } = useSimilarElements(
    currentSipocId,
    element?.title,
    0.3
  );

  // Don't show if no suggestions available
  if (!isLoading && (!suggestions || suggestions.length === 0)) {
    return null;
  }

  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-1.5 px-2 py-1 text-xs rounded hover:bg-orange-50 transition-colors group"
      >
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3 h-3 text-orange-500" />
          <Caption className="font-medium text-orange-700 group-hover:text-orange-800">
            {isLoading ? 'Chargement...' : `${suggestions?.length || 0} suggestions IA`}
          </Caption>
        </div>
        {!isLoading && suggestions && suggestions.length > 0 && (
          <ChevronDown
            className={`w-3 h-3 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {isExpanded && !isLoading && suggestions && suggestions.length > 0 && (
        <div className="mt-1 space-y-1 max-h-64 overflow-y-auto">
          {suggestions.slice(0, 5).map((suggestion: SimilarElement, index: number) => {
            const matchConfig = matchTypeConfig[suggestion.matchType];
            const scorePercentage = Math.round(suggestion.similarityScore * 100);

            return (
              <button
                key={`${suggestion.element.id}-${index}`}
                onClick={() => onSuggestionClick(suggestion)}
                className="w-full text-left p-2 rounded border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all group/item"
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <Caption className="font-medium text-gray-900 truncate flex-1">
                    {suggestion.element?.title}
                  </Caption>
                  <ExternalLink className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span
                    className={`px-1.5 py-0.5 rounded ${matchConfig.bg} ${matchConfig.color} font-medium`}
                  >
                    {matchConfig.label}
                  </span>
                  <div className="flex items-center gap-0.5 text-gray-500">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>{scorePercentage}%</span>
                  </div>
                  <span className="text-gray-500 truncate">
                    de {suggestion.sipoc?.title}
                  </span>
                </div>
              </button>
            );
          })}
          {suggestions.length > 5 && (
            <Caption className="text-gray-500 text-center py-1">
              +{suggestions.length - 5} autres
            </Caption>
          )}
        </div>
      )}

      {isExpanded && isLoading && (
        <div className="flex items-center justify-center py-3">
          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
        </div>
      )}
    </div>
  );
};

// Connection Links Component
interface ConnectionLinksProps {
  targetSipocs: Array<{ sipocId: string; title: string; count: number; connectionIds: string[] }>;
  connectionsCount: number;
  onDeleteConnection: (connectionId: string, sipocTitle: string) => void;
}

const ConnectionLinks: React.FC<ConnectionLinksProps> = ({ targetSipocs, connectionsCount, onDeleteConnection }) => {
  const navigate = useNavigate();

  if (!targetSipocs || targetSipocs.length === 0) {
    return null;
  }


  return (
    <div className="mt-2 pt-2 border-t border-blue-100">
      <Caption className="text-blue-700 font-medium mb-1 text-[10px] uppercase tracking-wide">
        Connexions ({connectionsCount})
      </Caption>
      <div className="space-y-1">
        {targetSipocs.map(({ sipocId, title, count, connectionIds }) => (
          <div
            key={sipocId}
            className="w-full flex items-center gap-1 group/link"
          >
            <button
              onClick={() => navigate({ to: '/sipoc', search: {} as any })}
              className="flex-1 flex items-center gap-1.5 px-2 py-1 text-xs rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all"
            >
              <Link2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <Caption className="text-blue-900 truncate flex-1 text-left">
                {title}
              </Caption>
              {count > 1 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-200 text-blue-800 text-[10px] font-semibold">
                  {count}
                </span>
              )}
              <ArrowRight className="w-3 h-3 text-blue-400 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // If multiple connections to same SIPOC, delete the first one
                onDeleteConnection(connectionIds[0], title);
              }}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover/link:opacity-100 flex-shrink-0"
              title="Supprimer la connexion"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SipocFlowRowProps {
  flowId: string;
  elements: SipocElement[];
  currentSipocId: string;
  availableSipocs: SipocDiagram[];
  onElementUpdate: (elementId: string, updates: Partial<SipocElement>) => void;
  onElementDelete: (elementId: string) => void;
  onElementReorder: (type: ElementType, reorderedElements: SipocElement[]) => void;
  onAddElement: (type: ElementType) => void;
  onCreateRelation: (sourceElementId: string, targetSipocId: string, targetElementId: string, description?: string) => void;
  isEditable?: boolean;
}

export const SipocFlowRow: React.FC<SipocFlowRowProps> = ({
  elements,
  currentSipocId,
  availableSipocs,
  onElementUpdate,
  onElementDelete,
  onElementReorder,
  onAddElement,
  onCreateRelation,
  isEditable = true,
}) => {
  const [editingElement, setEditingElement] = useState<SipocElement | null>(null);
  const [relationElement, setRelationElement] = useState<SipocElement | null>(null);
  const [expandedSuggestions, setExpandedSuggestions] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    type: ElementType | null;
    draggedIndex: number | null;
  }>({
    type: null,
    draggedIndex: null,
  });
  
  const groupedElements = useMemo(
    () => groupElementsByType(elements),
    [elements]
  );

  // Delete connection mutation
  const deleteConnectionMutation = useDeleteSipocConnection();

  const handleDeleteConnection = useCallback((connectionId: string, sipocTitle: string) => {
    if (window.confirm(`Supprimer la connexion avec "${sipocTitle}" ?`)) {
      deleteConnectionMutation.mutate(connectionId);
    }
  }, [deleteConnectionMutation]);

  // Get all connections for this SIPOC in one query
  const { data: allConnections } = useSipocConnectionsBySipoc(currentSipocId);
  
  // Create a map of elementId -> connections
  const connectionsMap = useMemo(() => {
    const map = new Map<string, SipocConnection[]>();
    
    if (allConnections) {
      elements.forEach(element => {
        const elementConnections = (allConnections as SipocConnection[]).filter(
          conn => conn.source_element_id === element.id || conn.target_element_id === element.id
        );
        if (elementConnections.length > 0) {
          map.set(element.id, elementConnections);
        }
      });
    }
    
    return map;
  }, [allConnections, elements]);

  // Create a map of elementId -> targetSipocs (pre-calculated to avoid useMemo in child component)
  const targetSipocsMap = useMemo(() => {
    const map = new Map<string, Array<{ sipocId: string; title: string; count: number; connectionIds: string[] }>>();
    
    elements.forEach(element => {
      const connections = connectionsMap.get(element.id);
      if (!connections || connections.length === 0) {
        return;
      }

      const sipocMap = new Map<string, { sipocId: string; title: string; count: number; connectionIds: string[] }>();
      
      connections.forEach((conn: SipocConnection) => {
        const targetSipocId = conn.source_element_id === element.id 
          ? conn.target_sipoc_id 
          : conn.source_sipoc_id;
        
        if (targetSipocId) {
          const sipoc = availableSipocs.find(s => s.sipoc_id === targetSipocId);
          if (sipoc) {
            const existing = sipocMap.get(targetSipocId);
            if (existing) {
              existing.count++;
              existing.connectionIds.push(conn.connection_id);
            } else {
              sipocMap.set(targetSipocId, {
                sipocId: targetSipocId,
                title: sipoc.title,
                count: 1,
                connectionIds: [conn.connection_id],
              });
            }
          }
        }
      });
      
      const targetSipocs = Array.from(sipocMap.values());
      if (targetSipocs.length > 0) {
        map.set(element.id, targetSipocs);
      }
    });
    
    return map;
  }, [connectionsMap, elements, availableSipocs]);

  const columnOrder = useMemo<ElementType[]>(
    () => [
      ElementType.supplier,
      ElementType.input,
      ElementType.process,
      ElementType.output,
      ElementType.customer,
    ],
    []
  );

  const handleDragStart = useCallback((type: ElementType, index: number) => {
    setDragState({ type, draggedIndex: index });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((type: ElementType, targetIndex: number) => {
    if (dragState.type !== type || dragState.draggedIndex === null || dragState.draggedIndex === targetIndex) {
      setDragState({ type: null, draggedIndex: null });
      return;
    }

    const typeElements = [...groupedElements[type]];
    const [removed] = typeElements.splice(dragState.draggedIndex, 1);
    typeElements.splice(targetIndex, 0, removed);

    // Update positions
    const reordered = typeElements.map((el, idx) => ({
      ...el,
      position: idx,
    }));

    onElementReorder(type, reordered);
    setDragState({ type: null, draggedIndex: null });
  }, [dragState, groupedElements, onElementReorder]);

  const handleDragEnd = useCallback(() => {
    setDragState({ type: null, draggedIndex: null });
  }, []);

  const handleDelete = useCallback((elementId: string, elementTitle: string) => {
    if (window.confirm(`Supprimer "${elementTitle}" ?`)) {
      onElementDelete(elementId);
    }
  }, [onElementDelete]);

  // Translation helper for element types
  const getTypeLabel = (type: ElementType): string => {
    const labels: Record<ElementType, string> = {
      [ElementType.supplier]: 'fournisseur',
      [ElementType.input]: 'entrée',
      [ElementType.process]: 'processus',
      [ElementType.output]: 'sortie',
      [ElementType.customer]: 'client',
    };
    return labels[type];
  };

  const handleSuggestionClick = useCallback((suggestion: SimilarElement, sourceElementId: string) => {
    console.log('suggestion', suggestion);
    // Create relation with suggested element
    onCreateRelation(
      sourceElementId,
      suggestion.element.sipoc_id,
      suggestion.element.id,
      `Connexion suggérée par IA (${Math.round(suggestion.similarityScore * 100)}% similarité)`
    );
    setExpandedSuggestions(null);
  }, [onCreateRelation]);

  const matchTypeConfig = {
    exact: { label: 'Exact', color: 'text-green-600', bg: 'bg-green-50' },
    contains: { label: 'Contient', color: 'text-blue-600', bg: 'bg-blue-50' },
    word_match: { label: 'Similaire', color: 'text-orange-600', bg: 'bg-orange-50' },
    partial: { label: 'Partiel', color: 'text-gray-600', bg: 'bg-gray-50' },
  };

  return (
    <div className="flex gap-4 items-stretch bg-white border border-gray-200 rounded-lg p-4 transition-shadow">
      {/* Drag Handle */}
      <div className="w-12 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-orange-600 transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* SIPOC Columns */}
      {columnOrder.map((type) => {
        const typeElements = groupedElements[type];
        
        // Color coding for each type with orange accent for process
        const columnColors: Record<ElementType, string> = {
          [ElementType.supplier]: 'bg-gray-50 border-gray-200',
          [ElementType.input]: 'bg-gray-50 border-gray-200',
          [ElementType.process]: 'bg-orange-50 border-orange-200',
          [ElementType.output]: 'bg-gray-50 border-gray-200',
          [ElementType.customer]: 'bg-gray-50 border-gray-200',
        };

        return (
          <div key={type} className="flex-1 min-w-[200px]">
            <div className={`border-2 rounded-md p-3 ${columnColors[type]} min-h-[120px] relative pb-12 transition-colors`}>
              <div className="space-y-2">
                {/* Existing Elements */}
                {typeElements.map((element, index) => (
                  <div 
                    key={element.id} 
                    draggable={isEditable}
                    onDragStart={() => handleDragStart(type, index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(type, index)}
                    onDragEnd={handleDragEnd}
                    className={`group border-l-4 ${
                      type === ElementType.process ? 'border-l-orange-500' : 'border-l-gray-400'
                    } border border-gray-200 rounded-r-md p-2.5 bg-white hover:shadow-sm hover:border-gray-300 transition-all ${
                      isEditable ? 'cursor-grab active:cursor-grabbing' : ''
                    } ${
                      dragState.type === type && dragState.draggedIndex === index ? 'opacity-40 scale-95' : ''
                    }`}
                  >
                    {/* Title and Actions */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <BodySmall className="font-medium text-gray-900 flex-1 line-clamp-2">
                        {element.title}
                      </BodySmall>
                      {isEditable && (
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => setRelationElement(element)}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            title="Créer une relation SIPOC"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingElement(element)}
                            className="p-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                            title="Modifier l'élément"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(element.id, element.title)}
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Supprimer l'élément"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {element.description && (
                      <Caption className="text-gray-600 line-clamp-2">{element.description}</Caption>
                    )}

                    {/* Connection Links Section */}
                    <ConnectionLinks 
                      targetSipocs={targetSipocsMap.get(element.id) || []}
                      connectionsCount={connectionsMap.get(element.id)?.length || 0}
                      onDeleteConnection={handleDeleteConnection}
                    />

                    {/* AI Suggestions Section */}
                    <SuggestionDropdown
                      element={element}
                      currentSipocId={currentSipocId}
                      isExpanded={expandedSuggestions === element.id}
                      onToggle={() => setExpandedSuggestions(expandedSuggestions === element.id ? null : element.id)}
                      onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, element.id)}
                      matchTypeConfig={matchTypeConfig}
                    />
                  </div>
                ))}

                {/* Add Button */}
                {isEditable && (
                  // For process type, only show add button if no elements exist
                  (type !== ElementType.process || typeElements.length === 0) && (
                    <button
                      onClick={() => onAddElement(type)}
                      className="absolute bottom-2 left-2 right-2 border border-dashed border-gray-300 rounded-md p-1.5 text-gray-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-1.5 bg-white group"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <Caption className="font-medium capitalize group-hover:text-orange-600">
                        Ajouter {getTypeLabel(type)}
                      </Caption>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Edit Modal */}
      {editingElement && (
        <EditElementModal
          element={editingElement}
          isOpen={!!editingElement}
          onClose={() => setEditingElement(null)}
          onSave={(updates) => {
            onElementUpdate(editingElement.id, updates);
            setEditingElement(null);
          }}
        />
      )}

      {/* Relation Modal */}
      {relationElement && (
        <SipocRelationModal
          element={relationElement}
          currentSipocId={currentSipocId}
          availableSipocs={availableSipocs}
          isOpen={!!relationElement}
          onClose={() => setRelationElement(null)}
          onCreateRelation={(targetSipocId, targetElementId, description) => {
            onCreateRelation(relationElement.id, targetSipocId, targetElementId, description);
            setRelationElement(null);
          }}
        />
      )}
    </div>
  );
};
