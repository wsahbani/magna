import { useState } from 'react';
import { GitBranch, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, Button } from '@repo/ui';
import { Heading2, Heading3, Body, BodySmall } from '@repo/ui';
import { SipocVersionSelector } from './SipocVersionSelector';
import { CreateVersionModal } from './CreateVersionModal';
import { SipocVersionHistory } from './SipocVersionHistory';
import { SipocVersionActions } from './SipocVersionActions';
import { useSipocVersion, useSipocVersions } from '../hooks/useSipocVersion';
import { SipocStatus } from '../types/sipoc.types';

interface SipocVersionManagerProps {
  sipocId: string;
  onVersionChange?: (versionId: string) => void;
  className?: string;
}

export const SipocVersionManager = ({
  sipocId,
  onVersionChange,
  className,
}: SipocVersionManagerProps) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [duplicateFromVersionId, setDuplicateFromVersionId] = useState<string>();

  const { data: versions } = useSipocVersions(sipocId);
  const { data: selectedVersion, isLoading: isLoadingVersion } = useSipocVersion(
    sipocId,
    selectedVersionId
  );

  // Sélectionner automatiquement la version draft ou publiée
  const defaultVersion = versions?.find(
    (v) => v.status === SipocStatus.DRAFT || v.status === SipocStatus.PUBLISHED
  );

  const currentVersionId = selectedVersionId || defaultVersion?.id;

  const handleVersionChange = (versionId: string) => {
    setSelectedVersionId(versionId);
    onVersionChange?.(versionId);
  };

  const handleCreateVersion = () => {
    setDuplicateFromVersionId(undefined);
    setCreateModalOpen(true);
  };

  const handleDuplicateVersion = () => {
    if (selectedVersion) {
      setDuplicateFromVersionId(selectedVersion.id);
      setCreateModalOpen(true);
    }
  };

  const handleVersionCreated = (versionId: string) => {
    setSelectedVersionId(versionId);
    onVersionChange?.(versionId);
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* En-tête avec sélecteur de version */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              <Heading2>Gestion des Versions</Heading2>
            </div>
            <Button
              onClick={handleCreateVersion}
              className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Version
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">
                <BodySmall className="font-medium text-gray-700">Version actuelle</BodySmall>
              </label>
              <SipocVersionSelector
                sipocId={sipocId}
                selectedVersionId={currentVersionId}
                onVersionChange={handleVersionChange}
              />
            </div>

            {/* Informations sur la version sélectionnée */}
            {selectedVersion && (
              <div className="border-t pt-4 space-y-3">
                <div>
                  <Heading3 className="mb-2">Détails de la version</Heading3>
                  <div className="space-y-2">
                    {selectedVersion.title && (
                      <div>
                        <BodySmall className="font-medium text-gray-700">Titre :</BodySmall>
                        <Body>{selectedVersion.title}</Body>
                      </div>
                    )}
                    {selectedVersion.description && (
                      <div>
                        <BodySmall className="font-medium text-gray-700">
                          Description :
                        </BodySmall>
                        <Body className="text-gray-600">{selectedVersion.description}</Body>
                      </div>
                    )}
                    {selectedVersion.changesLog && (
                      <div>
                        <BodySmall className="font-medium text-gray-700">
                          Modifications :
                        </BodySmall>
                        <Body className="text-gray-600 whitespace-pre-wrap">
                          {selectedVersion.changesLog}
                        </Body>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-500">
                      <span>
                        Créée le{' '}
                        {new Date(selectedVersion.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {selectedVersion.releasedAt && (
                        <span>
                          Publiée le{' '}
                          {new Date(selectedVersion.releasedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      {selectedVersion.elements && (
                        <span>{selectedVersion.elements.length} éléments</span>
                      )}
                      {selectedVersion.connections && (
                        <span>{selectedVersion.connections.length} connexions</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions de version */}
                <SipocVersionActions
                  sipocId={sipocId}
                  version={selectedVersion}
                  onDuplicate={handleDuplicateVersion}
                />
              </div>
            )}

            {/* Chargement */}
            {isLoadingVersion && (
              <div className="border-t pt-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historique des versions */}
      {selectedVersion?.history && selectedVersion.history.length > 0 && (
        <SipocVersionHistory history={selectedVersion.history} />
      )}

      {/* Modal de création/duplication de version */}
      <CreateVersionModal
        sipocId={sipocId}
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setDuplicateFromVersionId(undefined);
        }}
        onSuccess={handleVersionCreated}
        duplicateFromVersionId={duplicateFromVersionId}
      />
    </div>
  );
};
