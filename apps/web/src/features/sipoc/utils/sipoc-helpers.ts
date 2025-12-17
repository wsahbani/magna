import { SipocElement, ElementType } from '../types/sipoc.types';

/**
 * Reorders elements within a column after drag-drop
 */
export const reorderElements = (
  elements: SipocElement[],
  startIndex: number,
  endIndex: number
): SipocElement[] => {
  const result = Array.from(elements);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // Update positions
  return result.map((element, index) => ({
    ...element,
    position: index,
  }));
};

/**
 * Groups elements by their type (column)
 */
export const groupElementsByType = (
  elements: SipocElement[]
): Record<ElementType, SipocElement[]> => {
  const grouped: Record<ElementType, SipocElement[]> = {
    [ElementType.supplier]: [],
    [ElementType.input]: [],
    [ElementType.process]: [],
    [ElementType.output]: [],
    [ElementType.customer]: [],
  };

  elements.forEach((element) => {
    grouped[element.type].push(element);
  });

  // Sort by position within each group
  Object.keys(grouped).forEach((key) => {
    grouped[key as ElementType].sort((a, b) => a.position - b.position);
  });

  return grouped;
};

/**
 * Gets the label for an element type
 */
export const getElementTypeLabel = (type: ElementType): string => {
  const labels: Record<ElementType, string> = {
    [ElementType.supplier]: 'Supplier',
    [ElementType.input]: 'Input',
    [ElementType.process]: 'Process',
    [ElementType.output]: 'Output',
    [ElementType.customer]: 'Customer',
  };
  return labels[type];
};

/**
 * Gets the color class for an element type
 */
export const getElementTypeColor = (type: ElementType): string => {
  const colors: Record<ElementType, string> = {
    [ElementType.supplier]: 'bg-blue-50 border-blue-200',
    [ElementType.input]: 'bg-green-50 border-green-200',
    [ElementType.process]: 'bg-purple-50 border-purple-200',
    [ElementType.output]: 'bg-orange-50 border-orange-200',
    [ElementType.customer]: 'bg-pink-50 border-pink-200',
  };
  return colors[type];
};

/**
 * Validates element connections
 */
export const validateConnections = (
  fromType: ElementType,
  toType: ElementType
): boolean => {
  const validConnections: Record<ElementType, ElementType[]> = {
    [ElementType.supplier]: [ElementType.input],
    [ElementType.input]: [ElementType.process],
    [ElementType.process]: [ElementType.output],
    [ElementType.output]: [ElementType.customer],
    [ElementType.customer]: [],
  };

  return validConnections[fromType]?.includes(toType) ?? false;
};
