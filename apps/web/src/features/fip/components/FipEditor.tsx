import React, { useEffect, useState, useCallback } from 'react';
import { useFipStore } from '../store/fipStore';
import { useFipByProcess, useCreateFip, useUpdateFip } from '../hooks/useFip';
import { FipForm } from './FipForm';
import { FipView } from './FipView';
import { FipDocumentView } from './FipDocumentView';
import { FipPdfDocument } from './FipPdfDocument';
import { Button, Heading2, Heading1, BodySmall, Caption, Badge } from '@repo/ui';
import { ProcessIdentityCard, UpdateFipDto } from '../types/fip.types';
import { AlertCircle, Loader2, Plus, Edit, X, FileText, Calendar, User, Download } from 'lucide-react';
import { useSipocDiagramsByProcessId, useSipocElements } from '../../sipoc/hooks/useSipoc';
import { useAuth } from '../../auth/context/AuthContext';
import { pdf } from '@react-pdf/renderer';

interface FipEditorProps {
  processId: string;
  onSave?: () => void;
}

export const FipEditor: React.FC<FipEditorProps> = ({ processId, onSave }) => {
  const [formData, setFormData] = useState<UpdateFipDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    fips,
    fetchFipByProcess,
    createFip,
    updateFip,
    isLoading,
    error,
  } = useFipStore();

  const { data: fipData, refetch } = useFipByProcess(processId);
  const createFipMutation = useCreateFip();
  const updateFipMutation = useUpdateFip();

  // Fetch SIPOC data and check ownership
  const { user } = useAuth();
  const { data: sipocDiagram, isLoading: sipocLoading, error: sipocError, refetch: refetchSipoc } = useSipocDiagramsByProcessId(processId);
  const { data: sipocElements, isLoading: sipocElementsLoading } = useSipocElements(sipocDiagram?.sipoc_id);

  // Check if current user can edit SIPOC
  const canEditSipoc = true;//?.createdBy === user?.id;

  // Get FIP from store or query
  const fip = fipData || (processId ? Object.values(fips).find((f) => f.processId === processId) : null);

  // Fetch FIP on mount
  useEffect(() => {
    if (processId) {
      fetchFipByProcess(processId);
    }
  }, [processId, fetchFipByProcess]);

  const handleSave = useCallback(
    async (data: UpdateFipDto) => {
      if (!fip) {
        // Create new FIP
        try {
          await createFipMutation.mutateAsync({
            processId,
            ...data,
          });
          await refetch();
          onSave?.();
        } catch (err) {
          console.error('Failed to create FIP:', err);
          throw err;
        }
      } else {
        // Update existing FIP
        try {
          await updateFipMutation.mutateAsync({
            fipId: fip.fip_id,
            data,
          });
          await refetch();
          onSave?.();
        } catch (err) {
          console.error('Failed to update FIP:', err);
          throw err;
        }
      }
    },
    [fip, processId, createFipMutation, updateFipMutation, refetch, onSave],
  );

  // Auto-save is disabled - users must manually save using the save button

  const handleCreateFip = useCallback(async () => {
    try {
      await createFipMutation.mutateAsync({
        processId,
        objectives: '',
        scope: '',
        indicators: [],
        stakeholders: [],
        risks: [],
        opportunities: [],
        resources: [],
        performanceTargets: [],
      });
      await refetch();
    } catch (err) {
      console.error('Failed to create FIP:', err);
    }
  }, [processId, createFipMutation, refetch]);

  const handleDownloadPdf = useCallback(async () => {
    if (!fip) return;
    
    try {
      // Generate PDF blob
      const blob = await pdf(
        <FipPdfDocument fip={fip} sipocElements={sipocElements || []} sipocDiagram={sipocDiagram} />
      ).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FIP_${fip.process?.name || 'Document'}_${new Date().toLocaleDateString('fr-FR')}.pdf`;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  }, [fip, sipocElements, sipocDiagram]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <BodySmall className="text-gray-600">Chargement de la FIP...</BodySmall>
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

  // No FIP found - show create option
  if (!fip) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3 max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-gray-600" />
          </div>
          <Heading2 className="text-gray-900">Aucune FIP trouvée</Heading2>
          <BodySmall>
            Aucune Fiche d'Identité de Processus n'existe pour ce processus. Créez-en une pour
            commencer.
          </BodySmall>
          <Button
            onClick={handleCreateFip}
            disabled={createFipMutation.isPending}
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            {createFipMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Créer une FIP
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Document Header */}
      <header className="border-b bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Document Title & Icon */}
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Heading1 className="text-2xl font-bold text-gray-900">Fiche d'Identité de Processus</Heading1>
                  <Badge
                    className={`px-3 py-1 text-sm font-semibold ${
                      fip.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                        : fip.status === 'archived'
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {fip.status === 'published'
                      ? 'Publié'
                      : fip.status === 'archived'
                        ? 'Archivé'
                        : 'Brouillon'}
                  </Badge>
                </div>
                {fip.process && (
                  <Heading2 className="text-lg text-gray-700 font-medium">
                    {fip.process.name}
                  </Heading2>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
              {fip.status !== 'published' && (
                <Button
                  variant={isEditMode ? 'outline' : 'default'}
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={isEditMode ? '' : 'bg-orange-600 hover:bg-orange-700'}
                >
                  {isEditMode ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Document Metadata */}
          <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Créé le {new Date(fip.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Modifié le {new Date(fip.updatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Paper Document Layout */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="transition-all duration-300">
            {isEditMode ? (
              <FipForm
                fip={fip}
                onSave={handleSave}
                isSaving={false}
                isEditable={true}
                onDataChange={undefined}
                sipocElements={sipocElements || []}
                canEditSipoc={canEditSipoc}
                processId={processId}
                sipocLoading={sipocLoading || sipocElementsLoading}
                sipocError={sipocError ? String(sipocError) : undefined}
                refetchSipoc={refetchSipoc}
              />
            ) : (
              <FipDocumentView 
                fip={fip} 
                sipocElements={sipocElements || []}
                sipocDiagram={sipocDiagram}
                sipocLoading={sipocLoading || sipocElementsLoading}
                processId={processId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

