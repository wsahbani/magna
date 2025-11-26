import { useState } from 'react';
import { Plus, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
} from '@repo/ui';
import { Heading3, Body, BodySmall } from '@repo/ui';
import { useCreateSipocVersion, useDuplicateSipocVersion } from '../hooks/useSipocVersion';
import { CreateSipocVersionDto } from '../types/sipoc.types';

interface CreateVersionModalProps {
  sipocId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (versionId: string) => void;
  duplicateFromVersionId?: string; // Si fourni, duplique cette version
}

export const CreateVersionModal = ({
  sipocId,
  isOpen,
  onClose,
  onSuccess,
  duplicateFromVersionId,
}: CreateVersionModalProps) => {
  const [formData, setFormData] = useState<CreateSipocVersionDto>({
    title: '',
    description: '',
    changesLog: '',
  });

  const createMutation = useCreateSipocVersion();
  const duplicateMutation = useDuplicateSipocVersion();

  const isDuplicate = !!duplicateFromVersionId;
  const mutation = isDuplicate ? duplicateMutation : createMutation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isDuplicate) {
        const result = await duplicateMutation.mutateAsync({
          sipocId,
          versionId: duplicateFromVersionId,
          dto: formData,
        });
        onSuccess?.(result.id);
      } else {
        const result = await createMutation.mutateAsync({
          sipocId,
          dto: formData,
        });
        onSuccess?.(result.id);
      }

      setFormData({ title: '', description: '', changesLog: '' });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la version:', error);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', changesLog: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              {isDuplicate ? (
                <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              ) : (
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              )}
              <Heading3>
                {isDuplicate ? 'Dupliquer la version' : 'Créer une nouvelle version'}
              </Heading3>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Version 2.0 - Amélioration du processus"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Description des changements apportés dans cette version..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-20 sm:min-h-24 px-3 py-2 text-xs sm:text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="changesLog">Journal des modifications</Label>
            <textarea
              id="changesLog"
              placeholder="Liste des modifications effectuées..."
              value={formData.changesLog}
              onChange={(e) => setFormData({ ...formData, changesLog: e.target.value })}
              className="w-full min-h-16 sm:min-h-20 px-3 py-2 text-xs sm:text-sm lg:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              rows={3}
            />
          </div>

          {isDuplicate && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
              <BodySmall className="text-blue-800">
                💡 Cette version sera une copie complète de la version sélectionnée avec tous ses
                éléments et connexions.
              </BodySmall>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !formData.title.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {mutation.isPending
                ? 'Création...'
                : isDuplicate
                  ? 'Dupliquer'
                  : 'Créer la version'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
