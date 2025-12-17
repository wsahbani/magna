import React from 'react';
import { ElementType, SipocElement } from '../types/sipoc.types';

import { getElementTypeLabel, getElementTypeColor } from '../utils/sipoc-helpers';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { SortableElementCard } from './SortableElementCard';

interface SipocFlowColumnProps {
  type: ElementType;
  elements: SipocElement[];
  onElementUpdate: (elementId: string, updates: Partial<SipocElement>) => void;
  onElementDelete: (elementId: string) => void;
  onElementReorder: (reorderedElements: SipocElement[]) => void;
  onAddElement: () => void;
  isEditable?: boolean;
}

export const SipocFlowColumn: React.FC<SipocFlowColumnProps> = ({
  type,
  elements,
  onElementUpdate,
  onElementDelete,
  onElementReorder,
  onAddElement,
  isEditable = true,
}) => {
  const { draggedIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useDragAndDrop(elements, onElementReorder);

  const colorClass = getElementTypeColor(type);
  const label = getElementTypeLabel(type);

  return (
    <div className="flex-1 min-w-[250px]">
      <div className={`border-2 rounded-lg p-4 ${colorClass} h-full flex flex-col`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{label}</h3>
          {isEditable && (
            <button
              onClick={onAddElement}
              className="px-3 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
            >
              + Add
            </button>
          )}
        </div>

        {/* Elements List - Vertical stacking */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {elements.length === 0 ? (
            <div className="text-gray-400 text-sm italic text-center py-4 w-full">
              No items yet
            </div>
          ) : (
            elements.map((element, index) => (
              <SortableElementCard
                key={element.id}
                element={element}
                index={index}
                isDragging={draggedIndex === index}
                onDragStart={(e: React.DragEvent) => {
                  handleDragStart(element, index);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                onUpdate={(updates: Partial<SipocElement>) => onElementUpdate(element.id, updates)}
                onDelete={() => onElementDelete(element.id)}
                isEditable={isEditable}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
