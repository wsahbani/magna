import React, { useEffect, useState, useCallback } from 'react';
import { useFipStore } from '../store/fipStore';
import { useFipByProcess, useCreateFip, useUpdateFip } from '../hooks/useFip';
import { FipForm } from './FipForm';
import { FipView } from './FipView';
import { Button, Heading2, BodySmall, Caption } from '@repo/ui';
import { ProcessIdentityCard, UpdateFipDto } from '../types/fip.types';
import { AlertCircle, Loader2, Plus, Edit, X } from 'lucide-react';

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Heading2 className="truncate">Fiche d'Identité de Processus</Heading2>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    fip.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : fip.status === 'archived'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {fip.status === 'published'
                    ? 'Publié'
                    : fip.status === 'archived'
                      ? 'Archivé'
                      : 'Brouillon'}
                </span>
              </div>
              {fip.process && (
                <BodySmall className="text-gray-600">
                  Processus: {fip.process.name}
                </BodySmall>
              )}
            </div>
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Edit/View toggle */}
              {fip.status !== 'published' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="flex items-center gap-2"
                >
                  {isEditMode ? (
                    <>
                      <X className="w-4 h-4" />
                      Annuler
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Modifier
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <div
          className={`transition-opacity duration-300 ${
            isEditMode ? 'opacity-100' : 'opacity-100'
          }`}
        >
          {isEditMode ? (
            <FipForm
              fip={fip}
              onSave={handleSave}
              isSaving={false}
              isEditable={true}
              onDataChange={undefined}
            />
          ) : (
            <FipView fip={fip} />
          )}
        </div>
      </main>
    </div>
  );
};

