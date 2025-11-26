import { useState } from 'react';
import { Send, Archive, Copy, Trash2 } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
} from '@repo/ui';
import { Heading3, Body, BodySmall } from '@repo/ui';
import {
  usePublishSipocVersion,
  useArchiveSipocVersion,
  useDeleteSipocVersion,
} from '../hooks/useSipocVersion';
import { SipocStatus, SipocVersion } from '../types/sipoc.types';

interface SipocVersionActionsProps {
  sipocId: string;
  version: SipocVersion;
  onDuplicate?: () => void;
  className?: string;
}

export const SipocVersionActions = ({
  sipocId,
  version,
  onDuplicate,
  className,
}: SipocVersionActionsProps) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changesLog, setChangesLog] = useState('');

  const publishMutation = usePublishSipocVersion();
  const archiveMutation = useArchiveSipocVersion();
  const deleteMutation = useDeleteSipocVersion();

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync({
        sipocId,
        versionId: version.id,
        dto: { changesLog },
      });
      setPublishDialogOpen(false);
      setChangesLog('');
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync({
        sipocId,
        versionId: version.id,
      });
      setArchiveDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        sipocId,
        versionId: version.id,
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const canPublish = version.status === SipocStatus.DRAFT;
  const canArchive = version.status === SipocStatus.PUBLISHED;
  const canDelete = version.status === SipocStatus.DRAFT;
  const canDuplicate = version.status === SipocStatus.PUBLISHED;

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Publier */}
        {canPublish && (
          <Button
            onClick={() => setPublishDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Publier
          </Button>
        )}

        {/* Dupliquer */}
        {canDuplicate && onDuplicate && (
          <Button onClick={onDuplicate} variant="outline" size="sm">
            <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Dupliquer
          </Button>
        )}

        {/* Archiver */}
        {canArchive && (
          <Button
            onClick={() => setArchiveDialogOpen(true)}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-700"
          >
            <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Archiver
          </Button>
        )}

        {/* Supprimer */}
        {canDelete && (
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Supprimer
          </Button>
        )}
      </div>

      {/* Dialog de publication */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Heading3>Publier la version {version.version}</Heading3>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Body className="text-gray-700">
              Vous êtes sur le point de publier cette version. Elle deviendra la version active du
              diagramme SIPOC.
            </Body>

            <div className="space-y-2">
              <Label htmlFor="publish-changelog">
                Journal des modifications (optionnel)
              </Label>
              <textarea
                id="publish-changelog"
                placeholder="Décrivez les changements de cette version..."
                value={changesLog}
                onChange={(e) => setChangesLog(e.target.value)}
                className="w-full min-h-20 sm:min-h-24 px-3 py-2 text-xs sm:text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                rows={4}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-3 sm:p-4">
              <BodySmall className="text-green-800">
                ✓ Cette version sera marquée comme publiée
                <br />
                ✓ L'ancienne version publiée sera automatiquement archivée
              </BodySmall>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {publishMutation.isPending ? 'Publication...' : 'Publier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'archivage */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Heading3>Archiver la version {version.version}</Heading3>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Body className="text-gray-700">
              Vous êtes sur le point d'archiver cette version. Elle ne sera plus active mais restera
              consultable.
            </Body>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 sm:p-4">
              <BodySmall className="text-yellow-800">
                ⚠️ Cette action désactivera la version publiée actuelle
              </BodySmall>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {archiveMutation.isPending ? 'Archivage...' : 'Archiver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Heading3>Supprimer la version {version.version}</Heading3>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Body className="text-gray-700">
              Vous êtes sur le point de supprimer définitivement cette version. Cette action est
              irréversible.
            </Body>

            <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
              <BodySmall className="text-red-800">
                ⚠️ Tous les éléments et connexions de cette version seront supprimés
                <br />⚠️ Cette action ne peut pas être annulée
              </BodySmall>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
