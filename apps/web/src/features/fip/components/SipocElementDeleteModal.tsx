import React from 'react';
import { Button, Heading2, BodySmall } from '@repo/ui';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { SipocElement } from '../../sipoc/types/sipoc.types';
import { useDeleteSipocElement } from '../../sipoc/hooks/useSipoc';
import { useQueryClient } from '@tanstack/react-query';
import { sipocKeys } from '../../sipoc/hooks/useSipoc';
import { toast } from 'sonner';

interface SipocElementDeleteModalProps {
  element: SipocElement | null;
  isOpen: boolean;
  onClose: () => void;
  processId: string;
}

export const SipocElementDeleteModal: React.FC<SipocElementDeleteModalProps> = ({
  element,
  isOpen,
  onClose,
  processId,
}) => {
  const deleteElement = useDeleteSipocElement();
  const queryClient = useQueryClient();

  const handleClose = () => {
    if (!deleteElement.isPending) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (!element) return;

    try {
      await deleteElement.mutateAsync({
        sipocId: element.sipoc_id,
        elementId: element.id,
      });

      // Invalidate both SIPOC and FIP queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sipocKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['fip', 'byProcess', processId] }),
      ]);

      toast.success('Élément SIPOC supprimé avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'élément');
      console.error('Failed to delete SIPOC element:', error);
    }
  };

  if (!isOpen || !element) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <Heading2 className="text-xl font-semibold text-gray-900">
              Supprimer cet élément du SIPOC ?
            </Heading2>
          </div>
          <button
            onClick={handleClose}
            disabled={deleteElement.isPending}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <BodySmall className="text-gray-600">
            Cette action supprimera également l'élément <strong>"{element.title}"</strong> du
            diagramme SIPOC.
          </BodySmall>
          <BodySmall className="text-gray-600">Continuer ?</BodySmall>

          {/* Element Info */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <BodySmall className="font-medium text-gray-900 mb-1">
              {element.title}
            </BodySmall>
            {element.description && (
              <BodySmall className="text-gray-600 text-sm">
                {element.description}
              </BodySmall>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleteElement.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleteElement.isPending}
            className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
          >
            {deleteElement.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
