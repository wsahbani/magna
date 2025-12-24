/**
 * DetailFlowViewer Component
 * Wrapper pour afficher le flow diagramme en mode lecture seule dans les pages de détail
 */

import { ReactNode } from 'react';

export interface DetailFlowViewerProps {
  /**
   * Composant FlowDiagram à afficher
   */
  children: ReactNode;

  /**
   * Hauteur du viewer (défaut: calc(100vh - 12rem))
   */
  height?: string;

  /**
   * Classe CSS additionnelle
   */
  className?: string;
}

export function DetailFlowViewer({
  children,
  height = 'calc(100vh - 12rem)',
  className = '',
}: DetailFlowViewerProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      style={{ height }}
    >
      {children}
    </div>
  );
}

