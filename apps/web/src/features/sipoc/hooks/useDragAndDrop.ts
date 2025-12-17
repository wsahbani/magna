import { useState, useCallback } from 'react';
import { SipocElement } from '../types/sipoc.types';
import { reorderElements } from '../utils/sipoc-helpers';

interface DragState {
  draggedElement: SipocElement | null;
  draggedIndex: number | null;
}

export const useDragAndDrop = (
  elements: SipocElement[],
  onReorder: (reorderedElements: SipocElement[]) => void
) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedElement: null,
    draggedIndex: null,
  });

  const handleDragStart = useCallback(
    (element: SipocElement, index: number) => {
      setDragState({ draggedElement: element, draggedIndex: index });
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (dragState.draggedIndex === null || dragState.draggedIndex === targetIndex) {
        setDragState({ draggedElement: null, draggedIndex: null });
        return;
      }

      const reordered = reorderElements(elements, dragState.draggedIndex, targetIndex);
      onReorder(reordered);
      setDragState({ draggedElement: null, draggedIndex: null });
    },
    [dragState, elements, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ draggedElement: null, draggedIndex: null });
  }, []);

  return {
    draggedElement: dragState.draggedElement,
    draggedIndex: dragState.draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};
