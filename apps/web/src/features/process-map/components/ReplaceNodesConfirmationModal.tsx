/**
 * Replace Nodes Confirmation Modal
 * Modal de confirmation pour remplacer les nodes existants
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@repo/ui';
import { Button } from '@repo/ui/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Body, BodySmall } from '@repo/ui';

interface ReplaceNodesConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingNodesCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReplaceNodesConfirmationModal({
  open,
  onOpenChange,
  existingNodesCount,
  onConfirm,
  onCancel,
}: ReplaceNodesConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Nodes existants détectés
          </DialogTitle>
          <DialogDescription>
            Cette carte des processus contient déjà {existingNodesCount} node(s).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Body className="text-gray-700 mb-2">
            Que souhaitez-vous faire avec les nouveaux nodes extraits de l'image ?
          </Body>
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <BodySmall className="text-orange-800">
              <strong>Remplacer</strong> : Tous les nodes existants seront supprimés et remplacés par ceux extraits de l'image.
            </BodySmall>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} className="bg-orange-600 hover:bg-orange-700">
            Remplacer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

