/**
 * DetailSidebar Component
 * Sidebar réutilisable pour afficher les détails d'un processus (ProcessMap, Process, Procedure)
 */

import { ReactNode } from 'react';
import { Body, BodySmall, Caption } from '@repo/ui';

export interface MetadataItem {
  label: string;
  value: ReactNode;
  colSpan?: number; // Pour les items qui prennent plusieurs colonnes
}

export interface DetailSection {
  title?: string;
  icon?: ReactNode;
  content: ReactNode;
}

export interface DetailSidebarProps {
  /**
   * Titre principal de la sidebar
   */
  title?: string;

  /**
   * Description optionnelle
   */
  description?: string;

  /**
   * Métadonnées à afficher (code, statut, type, etc.)
   */
  metadata?: MetadataItem[];

  /**
   * Sections supplémentaires (validation, description, etc.)
   */
  sections?: DetailSection[];

  /**
   * Classe CSS additionnelle
   */
  className?: string;
}

export function DetailSidebar({
  title,
  description,
  metadata = [],
  sections = [],
  className = '',
}: DetailSidebarProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          {title && (
            <Body className="font-semibold text-gray-900 mb-1">{title}</Body>
          )}
          {description && (
            <BodySmall className="text-gray-600">{description}</BodySmall>
          )}
        </div>
      )}

      {/* Metadata Section */}
      {metadata.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Informations générales
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {metadata.map((item, index) => (
              <div
                key={index}
                className={item.colSpan ? `col-span-${item.colSpan}` : ''}
              >
                <Caption className="text-gray-500 mb-0.5">{item.label}</Caption>
                <BodySmall className="font-semibold text-gray-900">{item.value}</BodySmall>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
          {section.title && (
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {section.icon && <span className="text-orange-600 text-sm">{section.icon}</span>}
              {section.title}
            </h3>
          )}
          {section.content}
        </div>
      ))}
    </div>
  );
}

