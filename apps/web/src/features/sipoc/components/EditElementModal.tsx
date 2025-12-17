import React, { useState, useEffect } from 'react';
import { SipocElement } from '../types/sipoc.types';
import { getElementTypeLabel } from '../utils/sipoc-helpers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Label, Input, Textarea, BodySmall } from '@repo/ui';

interface EditElementModalProps {
  element: SipocElement;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<SipocElement>) => void;
}

export const EditElementModal: React.FC<EditElementModalProps> = ({
  element,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: element.title,
    description: element.description || '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: element.title,
        description: element.description || '',
      });
    }
  }, [isOpen, element]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      return;
    }
    
    onSave({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
    });
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form to original values
      setFormData({
        title: element.title,
        description: element.description || '',
      });
      onClose();
    }
  };

  const handleCancelClick = () => {
    // Reset form to original values
    setFormData({
      title: element.title,
      description: element.description || '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Modifier {getElementTypeLabel(element.type)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Entrez le titre de l'élément"
                  required
                  autoFocus
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {!formData.title.trim() && (
                  <BodySmall className="text-red-600">Le titre est requis</BodySmall>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ajoutez une description détaillée (optionnel)"
                  rows={4}
                  className="focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
                <BodySmall className="text-gray-600">
                  {formData.description.length} caractères
                </BodySmall>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Enregistrer les modifications
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
};
