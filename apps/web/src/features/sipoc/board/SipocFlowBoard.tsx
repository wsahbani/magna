import React, { useState, useMemo, useCallback } from 'react';
import { SipocElement, ElementType, SipocDiagram } from '../types/sipoc.types';
import { SipocFlowRow } from './SipocFlowRow';
import { Button, BodySmall, Caption } from '@repo/ui';
import { Plus, Inbox } from 'lucide-react';

interface SipocFlowBoardProps {
  sipocId: string;
  elements: SipocElement[];
  availableSipocs: SipocDiagram[];
  onElementUpdate: (elementId: string, updates: Partial<SipocElement>) => void;
  onElementDelete: (elementId: string) => void;
  onElementReorder: (type: ElementType, reorderedElements: SipocElement[]) => void;
  onAddElement: (flowId: string, type: ElementType) => void;
  onAddFlow: () => void;
  onCreateRelation: (sourceElementId: string, targetSipocId: string, targetElementId: string, description?: string) => void;
  isEditable?: boolean;
}

interface FlowGroup {
  flowId: string;
  elements: SipocElement[];
  position: number;
}

export const SipocFlowBoard: React.FC<SipocFlowBoardProps> = ({
  sipocId,
  elements,
  availableSipocs,
  onElementUpdate,
  onElementDelete,
  onElementReorder,
  onAddElement,
  onAddFlow,
  onCreateRelation,
  isEditable = true,
}) => {
  const [draggedFlowId, setDraggedFlowId] = useState<string | null>(null);

  // Group elements by flow_id with optimized memoization
  const flowGroups: FlowGroup[] = useMemo(() => {
    const flowMap = new Map<string, SipocElement[]>();
    
    elements.forEach((element) => {
      const flowId = element.flow_id || 'default';
      if (!flowMap.has(flowId)) {
        flowMap.set(flowId, []);
      }
      flowMap.get(flowId)!.push(element);
    });

    // Convert to array and sort by globalOrder
    const flows = Array.from(flowMap.entries()).map(([flowId, flowElements]) => {
      const minGlobalOrder = Math.min(...flowElements.map(el => el.globalOrder || 0));
      return {
        flowId,
        elements: flowElements,
        position: minGlobalOrder,
      };
    });

    return flows.sort((a, b) => a.position - b.position);
  }, [elements]);

  const handleDragStart = useCallback((flowId: string) => {
    setDraggedFlowId(flowId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((targetFlowId: string) => {
    if (!draggedFlowId || draggedFlowId === targetFlowId) {
      setDraggedFlowId(null);
      return;
    }

    const sourceIndex = flowGroups.findIndex(f => f.flowId === draggedFlowId);
    const targetIndex = flowGroups.findIndex(f => f.flowId === targetFlowId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedFlowId(null);
      return;
    }

    // Reorder flows by updating globalOrder of all elements in affected flows
    const reordered = [...flowGroups];
    const [removed] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    // Update globalOrder for all elements
    reordered.forEach((flow, flowIndex) => {
      flow.elements.forEach((element) => {
        onElementUpdate(element.id, { globalOrder: flowIndex });
      });
    });

    setDraggedFlowId(null);
  }, [draggedFlowId, flowGroups, onElementUpdate]);

  const handleDragEnd = useCallback(() => {
    setDraggedFlowId(null);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-auto">
      {/* Header Row - Sticky */}
      <div className="sticky top-0 z-20 flex gap-4 px-6 py-3 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="w-12 shrink-0"></div> {/* Drag handle space */}
        <Caption className="flex-1 min-w-[200px] font-semibold text-gray-900 uppercase tracking-wide text-center">Fournisseurs</Caption>
        <Caption className="flex-1 min-w-[200px] font-semibold text-gray-900 uppercase tracking-wide text-center">Entrées</Caption>
        <Caption className="flex-1 min-w-[200px] font-semibold text-orange-600 uppercase tracking-wide text-center">Processus</Caption>
        <Caption className="flex-1 min-w-[200px] font-semibold text-gray-900 uppercase tracking-wide text-center">Sorties</Caption>
        <Caption className="flex-1 min-w-[200px] font-semibold text-gray-900 uppercase tracking-wide text-center">Clients</Caption>
      </div>

      {/* Flow Rows */}
      <div className="flex-1 px-6 py-4 space-y-4">
        {flowGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <Inbox className="w-12 h-12 text-gray-400 mb-3" />
            <BodySmall className="font-medium text-gray-900 mb-1">Aucun flux pour le moment</BodySmall>
            <Caption className="text-gray-600 mb-4">Cliquez sur "Ajouter un flux" ci-dessous pour créer votre premier flux SIPOC</Caption>
            {isEditable && (
              <Button onClick={onAddFlow} size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un flux
              </Button>
            )}
          </div>
        ) : (
          flowGroups.map((flow) => (
            <div
              key={flow.flowId}
              draggable={isEditable}
              onDragStart={() => handleDragStart(flow.flowId)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(flow.flowId)}
              onDragEnd={handleDragEnd}
              className={`transition-all ${
                draggedFlowId === flow.flowId 
                  ? 'opacity-50 scale-[0.98]' 
                  : 'hover:shadow-md'
              }`}
            >
              <SipocFlowRow
                flowId={flow.flowId}
                elements={flow.elements}
                currentSipocId={sipocId}
                availableSipocs={availableSipocs}
                onElementUpdate={onElementUpdate}
                onElementDelete={onElementDelete}
                onElementReorder={onElementReorder}
                onAddElement={(type) => onAddElement(flow.flowId, type)}
                onCreateRelation={onCreateRelation}
                isEditable={isEditable}
              />
            </div>
          ))
        )}
      </div>

      {/* Add Flow Button - Only show if there are existing flows */}
      {isEditable && flowGroups.length > 0 && (
        <div className="px-6 pb-6 pt-2">
          <Button
            onClick={onAddFlow}
            variant="outline"
            className="w-full border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un flux
          </Button>
        </div>
      )}
    </div>
  );
};
