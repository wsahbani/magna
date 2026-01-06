import React, { useState, useEffect } from 'react';
import { Button, Heading2, BodySmall, Caption } from '@repo/ui';
import { X, Loader2 } from 'lucide-react';
import { SipocElement, ElementType } from '../../sipoc/types/sipoc.types';
import { useUpdateSipocElement } from '../../sipoc/hooks/useSipoc';
import { useQueryClient } from '@tanstack/react-query';
import { sipocKeys } from '../../sipoc/hooks/useSipoc';
import { toast } from 'sonner';

interface SipocElementEditModalProps {
  element: SipocElement;
  isOpen: boolean;
  onClose: () => void;
  processId: string;
}

export const SipocElementEditModal: React.FC<SipocElementEditModalProps> = ({
  element,
  isOpen,
  onClose,
  processId,
}) => {
  const [title, setTitle] = useState(element.title);
  const [description, setDescription] = useState(element.description || '');
  const [contactInfo, setContactInfo] = useState(element.contactInfo || '');
  const [titleTouched, setTitleTouched] = useState(false);

  const updateElement = useUpdateSipocElement();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setTitle(element.title);
      setDescription(element.description || '');
      setContactInfo(element.contactInfo || '');
      setTitleTouched(false);
    }
  }, [isOpen, element]);

  const handleClose = () => {
    if (!updateElement.isPending) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      setTitleTouched(true);
      return;
    }

    try {
      await updateElement.mutateAsync({
        sipocId: element.sipoc_id,
        elementId: element.id,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          contactInfo: contactInfo.trim() || undefined,
        },
      });

      // Invalidate both SIPOC and FIP queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sipocKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['fip', 'byProcess', processId] }),
      ]);

      toast.success('Élément SIPOC modifié avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'élément');
      console.error('Failed to update SIPOC element:', error);
    }
  };

  const showContactInfo =
    element.type === ElementType.supplier || element.type === ElementType.customer;

  const isTitleInvalid = titleTouched && title.trim() === '';
  const isSaveDisabled = title.trim() === '' || updateElement.isPending;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Heading2 className="text-xl font-semibold text-gray-900">
            Modifier l'élément SIPOC
          </Heading2>
          <button
            onClick={handleClose}
            disabled={updateElement.isPending}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-2">
              <BodySmall className="font-medium text-gray-700">
                Titre <span className="text-red-500">*</span>
              </BodySmall>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTitleTouched(true)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                isTitleInvalid
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="Entrez le titre de l'élément"
              disabled={updateElement.isPending}
            />
            {isTitleInvalid && (
              <Caption className="text-red-600 mt-1">Le titre est obligatoire</Caption>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2">
              <BodySmall className="font-medium text-gray-700">Description</BodySmall>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500"
              placeholder="Entrez une description (optionnel)"
              disabled={updateElement.isPending}
            />
          </div>

          {/* Contact Info (only for Supplier/Customer) */}
          {showContactInfo && (
            <div>
              <label htmlFor="contactInfo" className="block mb-2">
                <BodySmall className="font-medium text-gray-700">Contact</BodySmall>
              </label>
              <input
                id="contactInfo"
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Email, téléphone ou autres informations de contact"
                disabled={updateElement.isPending}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateElement.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSaveDisabled}
              className="min-w-[100px]"
            >
              {updateElement.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
