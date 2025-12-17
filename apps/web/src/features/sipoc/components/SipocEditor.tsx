import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSipocStore } from '../store/sipocStore';
import { useSipocDiagrams, useCreateSipocConnection } from '../hooks/useSipoc';
import { SipocFlowBoard } from '../board/SipocFlowBoard';
import { SipocImportModal } from './SipocImportModal';
import { Button, Heading2, BodySmall, Caption } from '@repo/ui';
import { ElementType, SipocElement } from '../types/sipoc.types';
import { exportSipocToPdf } from '../utils/sipoc-pdf-export';
import { 
  Save, 
  Send, 
  Clock, 
  User, 
  Building2,
  AlertCircle,
  Loader2,
  FileDown,
  FileText,
  ClipboardList
} from 'lucide-react';

interface SipocEditorProps {
  sipocId: string;
  onSave?: () => void;
  onPublish?: () => void;
}

export const SipocEditor: React.FC<SipocEditorProps> = ({ 
  sipocId, 
  onSave,
  onPublish 
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const {
    diagrams,
    elements,
    // connections, // Available for future connection features
    fetchDiagram,
    fetchElements,
    fetchConnections,
    createElement,
    updateElement,
    deleteElement,
    isLoading,
    error,
  } = useSipocStore();

  const diagram = diagrams[sipocId];

  // Fetch all SIPOC diagrams for connection suggestions
  const { data: availableSipocs = [] } = useSipocDiagrams();

  // Create connection mutation
  const createConnectionMutation = useCreateSipocConnection();

  // Fetch data on mount
  useEffect(() => {
    if (sipocId) {
      fetchDiagram(sipocId);
      fetchElements(sipocId);
      fetchConnections(sipocId);
    }
  }, [sipocId, fetchDiagram, fetchElements, fetchConnections]);

  // Memoized filtered data
  const diagramElements = useMemo(
    () => Object.values(elements).filter((el) => el.sipoc_id === sipocId),
    [elements, sipocId]
  );

  // Note: diagramConnections available for future features
  // const diagramConnections = useMemo(
  //   () => Object.values(connections).filter(
  //     (conn) => conn.source_sipoc_id === sipocId || conn.target_sipoc_id === sipocId
  //   ),
  //   [connections, sipocId]
  // );

  // Action handlers with error handling
  const handleAddFlow = useCallback(async () => {
    try {
      const flowId = crypto.randomUUID();
      const globalOrder = Math.max(0, ...diagramElements.map(el => el.globalOrder || 0)) + 1;

      await createElement({
        sipoc_id: sipocId,
        type: ElementType.supplier,
        title: 'Nouveau fournisseur',
        description: '',
        position: 0,
        globalOrder,
        flow_id: flowId,
      });
      
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to add flow:', err);
    }
  }, [sipocId, diagramElements, createElement]);

  const handleAddElement = useCallback(async (flowId: string, type: ElementType) => {
    try {
      const flowElements = diagramElements.filter(el => el.flow_id === flowId);
      const globalOrder = flowElements[0]?.globalOrder || 0;
      const maxPosition = Math.max(
        0,
        ...flowElements.filter((el) => el.type === type).map((el) => el.position)
      );

      const typeLabels: Record<ElementType, string> = {
        [ElementType.supplier]: 'Nouveau fournisseur',
        [ElementType.input]: 'Nouvelle entrée',
        [ElementType.process]: 'Nouveau processus',
        [ElementType.output]: 'Nouvelle sortie',
        [ElementType.customer]: 'Nouveau client',
      };

      await createElement({
        sipoc_id: sipocId,
        type,
        title: typeLabels[type],
        description: '',
        position: maxPosition + 1,
        globalOrder,
        flow_id: flowId,
      });
      
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to add element:', err);
    }
  }, [sipocId, diagramElements, createElement]);

  const handleElementUpdate = useCallback(async (elementId: string, updates: Partial<SipocElement>) => {
    try {
      await updateElement(sipocId, elementId, updates);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to update element:', err);
    }
  }, [sipocId, updateElement]);

  // Handle relation creation
  const handleCreateRelation = useCallback(async (
    sourceElementId: string,
    targetSipocId: string,
    targetElementId: string,
    description?: string
  ) => {
    try {
      await createConnectionMutation.mutateAsync({
        sourceElementId,
        targetElementId,
        sourceSipocId: sipocId,
        targetSipocId,
        description,
      });
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Failed to create relation:', error);
    }
  }, [createConnectionMutation, sipocId]);

  const handleElementDelete = useCallback(async (elementId: string) => {
    try {
      await deleteElement(sipocId, elementId);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to delete element:', err);
    }
  }, [sipocId, deleteElement]);

  const handleElementReorder = useCallback(async (_type: ElementType, reorderedElements: SipocElement[]) => {
    try {
      for (const element of reorderedElements) {
        await updateElement(sipocId, element.id, { position: element.position });
      }
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to reorder elements:', err);
    }
  }, [sipocId, updateElement]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave?.();
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  const handlePublish = useCallback(async () => {
    try {
      await onPublish?.();
    } catch (err) {
      console.error('Failed to publish:', err);
    }
  }, [onPublish]);

  // Handle import completion
  const handleImportComplete = useCallback(() => {
    // Refresh elements after import
    fetchElements(sipocId);
    setHasUnsavedChanges(true);
  }, [fetchElements, sipocId]);

  // Handle PDF export
  const handleExportPdf = useCallback(async () => {
    if (!diagram) {
      return;
    }

    setIsExportingPdf(true);
    try {
      await exportSipocToPdf({
        diagram,
        elements: diagramElements,
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      // Error is already handled in the export function
    } finally {
      setIsExportingPdf(false);
    }
  }, [diagram, diagramElements]);

  // Handle FIP navigation
  const handleViewFip = useCallback(() => {
    if (diagram?.processId) {
      navigate({ to: '/processes/$processId/fip', params: { processId: diagram.processId } });
    }
  }, [diagram, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <BodySmall className="text-gray-600">Chargement du diagramme SIPOC...</BodySmall>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <Heading2 className="text-gray-900">Une erreur s'est produite</Heading2>
          <BodySmall className="text-red-600">{error}</BodySmall>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!diagram) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-gray-600" />
          </div>
          <Heading2 className="text-gray-900">Diagramme introuvable</Heading2>
          <BodySmall>Le diagramme SIPOC que vous recherchez n'existe pas ou a été supprimé.</BodySmall>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.history.back()}
            className="mt-2"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  // Status badge styling with French labels
  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-green-100 text-green-700',
      archived: 'bg-orange-100 text-orange-700',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Brouillon',
      published: 'Publié',
      archived: 'Archivé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          {/* Title and actions row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Heading2 className="truncate">{diagram.title}</Heading2>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(diagram.status)}`}>
                  {getStatusLabel(diagram.status)}
                </span>
              </div>
              {diagram.description && (
                <BodySmall className="text-gray-600 line-clamp-2">
                  {diagram.description}
                </BodySmall>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {hasUnsavedChanges && (
                <Caption className="text-orange-600 mr-2">Modifications non enregistrées</Caption>
              )}
              {diagram.processId && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewFip}
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Voir FIP
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Export...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter PDF
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
                disabled={diagram.status === 'published'}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
              <Button 
                size="sm"
                onClick={handlePublish}
                disabled={diagram.status === 'published'}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Publier
              </Button>
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            {diagram.process_owner && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <Caption>{diagram.process_owner}</Caption>
              </div>
            )}
            {diagram.department && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <Caption>{diagram.department}</Caption>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <Caption>
                Mis à jour le {new Date(diagram.updatedAt).toLocaleDateString('fr-FR', { 
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Caption>
            </div>
            <Caption className="ml-auto">Version {diagram.version}</Caption>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <SipocFlowBoard
          sipocId={sipocId}
          elements={diagramElements}
          availableSipocs={availableSipocs}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onElementReorder={handleElementReorder}
          onAddElement={handleAddElement}
          onAddFlow={handleAddFlow}
          onCreateRelation={handleCreateRelation}
          isEditable={diagram.status !== 'published'}
        />
      </main>

      {/* Import Modal */}
      <SipocImportModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        sipocId={sipocId}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};
