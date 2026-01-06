import React, { useState, useMemo } from 'react';
import { Button, BodySmall, Caption } from '@repo/ui';
import { Edit2, Trash2, Users, FileInput, FileOutput, Building2 } from 'lucide-react';
import { FipAccordionSection } from './FipAccordionSection';
import { SipocElement, ElementType } from '../../sipoc/types/sipoc.types';

interface SipocElementsListProps {
  elements: SipocElement[];
  canEdit: boolean;
  onEdit: (element: SipocElement) => void;
  onDelete: (element: SipocElement) => void;
  isLoading?: boolean;
}

const ELEMENT_TYPE_CONFIG = {
  [ElementType.supplier]: {
    label: 'Fournisseurs',
    icon: <Building2 className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    badgeColor: 'bg-purple-50 text-purple-700',
  },
  [ElementType.input]: {
    label: 'Entrées',
    icon: <FileInput className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    badgeColor: 'bg-blue-50 text-blue-700',
  },
  [ElementType.output]: {
    label: 'Sorties',
    icon: <FileOutput className="w-5 h-5" />,
    color: 'bg-green-100 text-green-800 border-green-300',
    badgeColor: 'bg-green-50 text-green-700',
  },
  [ElementType.customer]: {
    label: 'Clients',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    badgeColor: 'bg-pink-50 text-pink-700',
  },
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3 border-b border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-4 py-3 border-b border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-4 py-3 border-b border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </td>
    <td className="px-4 py-3 border-b border-gray-100">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-4 py-3 border-b border-gray-100 text-right">
      <div className="flex justify-end gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

const ElementRow: React.FC<{
  element: SipocElement;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ element, canEdit, onEdit, onDelete }) => {
  const config = ELEMENT_TYPE_CONFIG[element.type as ElementType];
  const truncatedDescription =
    element.description && element.description.length > 50
      ? `${element.description.substring(0, 50)}...`
      : element.description;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 border-b border-gray-100">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3 border-b border-gray-100">
        <BodySmall className="font-medium text-gray-900">{element.title}</BodySmall>
      </td>
      <td className="px-4 py-3 border-b border-gray-100">
        <BodySmall className="text-gray-600">
          {truncatedDescription || '-'}
        </BodySmall>
      </td>
      <td className="px-4 py-3 border-b border-gray-100">
        <BodySmall className="text-gray-600">
          {element.contactInfo || '-'}
        </BodySmall>
      </td>
      <td className="px-4 py-3 border-b border-gray-100 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            disabled={!canEdit}
            title={
              canEdit
                ? 'Modifier'
                : 'Seul le créateur du SIPOC peut modifier ces éléments'
            }
            className={`p-2 rounded transition-colors ${
              canEdit
                ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={!canEdit}
            title={
              canEdit
                ? 'Supprimer'
                : 'Seul le créateur du SIPOC peut modifier ces éléments'
            }
            className={`p-2 rounded transition-colors ${
              canEdit
                ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const SipocElementsList: React.FC<SipocElementsListProps> = ({
  elements,
  canEdit,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [openSections, setOpenSections] = useState<Set<ElementType>>(
    new Set([ElementType.supplier, ElementType.input, ElementType.output, ElementType.customer])
  );

  const elementsByType = useMemo(() => {
    return {
      [ElementType.supplier]: elements
        .filter((el) => el.type === ElementType.supplier)
        .sort((a, b) => a.position - b.position),
      [ElementType.input]: elements
        .filter((el) => el.type === ElementType.input)
        .sort((a, b) => a.position - b.position),
      [ElementType.output]: elements
        .filter((el) => el.type === ElementType.output)
        .sort((a, b) => a.position - b.position),
      [ElementType.customer]: elements
        .filter((el) => el.type === ElementType.customer)
        .sort((a, b) => a.position - b.position),
    };
  }, [elements]);

  const renderSection = (type: ElementType) => {
    const config = ELEMENT_TYPE_CONFIG[type];
    const sectionElements = elementsByType[type];

    return (
      <FipAccordionSection
        key={type}
        id={`sipoc-${type}`}
        title={config.label}
        icon={config.icon}
        count={sectionElements.length}
        defaultExpanded={true}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : sectionElements.length > 0 ? (
                sectionElements.map((element) => (
                  <ElementRow
                    key={element.id}
                    element={element}
                    canEdit={canEdit}
                    onEdit={() => onEdit(element)}
                    onDelete={() => onDelete(element)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <Caption className="text-gray-400 italic">Aucun élément</Caption>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FipAccordionSection>
    );
  };

  return (
    <div className="space-y-4">
      {renderSection(ElementType.supplier)}
      {renderSection(ElementType.input)}
      {renderSection(ElementType.output)}
      {renderSection(ElementType.customer)}
    </div>
  );
};
