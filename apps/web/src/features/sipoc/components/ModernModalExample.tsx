/**
 * Exemple de Modal avec Style Moderne
 * Démo du nouveau style de formulaire basé sur le design system
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  ValidatedInput,
  ValidatedSelect,
  SelectItem,
} from '@repo/ui';

interface ModernModalExampleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernModalExample = ({ isOpen, onClose }: ModernModalExampleProps) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
  });

  const isValid = formData.field1 && formData.field3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Exemple de Modal Moderne
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Ligne 1: 3 colonnes */}
          <div className="grid grid-cols-3 gap-4">
            {/* Champ 1 - Requis avec Select */}
            <div className="space-y-2">
              <Label htmlFor="field1" className="text-sm font-medium text-gray-900">
                Champ 1 <span className="text-red-500">*</span>
              </Label>
              <ValidatedSelect
                id="field1"
                value={formData.field1}
                onValueChange={(value) => setFormData({ ...formData, field1: value })}
                placeholder="Choisissez une option"
              >
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </ValidatedSelect>
            </div>

            {/* Champ 2 - Optionnel avec Select */}
            <div className="space-y-2">
              <Label htmlFor="field2" className="text-sm font-medium text-gray-900">
                Champ 2
              </Label>
              <ValidatedSelect
                id="field2"
                value={formData.field2}
                onValueChange={(value) => setFormData({ ...formData, field2: value })}
                placeholder="Choisissez une zone"
              >
                <SelectItem value="zone1">Zone Nord</SelectItem>
                <SelectItem value="zone2">Zone Sud</SelectItem>
                <SelectItem value="zone3">Zone Est</SelectItem>
              </ValidatedSelect>
            </div>

            {/* Champ 3 - Requis avec Select */}
            <div className="space-y-2">
              <Label htmlFor="field3" className="text-sm font-medium text-gray-900">
                Type <span className="text-red-500">*</span>
              </Label>
              <ValidatedSelect
                id="field3"
                value={formData.field3}
                onValueChange={(value) => setFormData({ ...formData, field3: value })}
                placeholder="Type"
              >
                <SelectItem value="type1">Type A</SelectItem>
                <SelectItem value="type2">Type B</SelectItem>
                <SelectItem value="type3">Type C</SelectItem>
              </ValidatedSelect>
            </div>
          </div>

          {/* Ligne 2: 2 colonnes */}
          <div className="grid grid-cols-2 gap-4">
            {/* Champ 4 - Input avec validation */}
            <div className="space-y-2">
              <Label htmlFor="field4" className="text-sm font-medium text-gray-900">
                Référence
              </Label>
              <ValidatedInput
                id="field4"
                type="text"
                placeholder="Référence"
                value={formData.field4}
                onChange={(e) => setFormData({ ...formData, field4: e.target.value })}
              />
            </div>

            {/* Champ 5 - Select avec validation */}
            <div className="space-y-2">
              <Label htmlFor="field5" className="text-sm font-medium text-gray-900">
                Promotion
              </Label>
              <ValidatedSelect
                id="field5"
                value={formData.field5}
                onValueChange={(value) => setFormData({ ...formData, field5: value })}
                placeholder="Choisissez une promotion"
              >
                <SelectItem value="promo1">Promotion 2024-Q1</SelectItem>
                <SelectItem value="promo2">Promotion 2024-Q2</SelectItem>
                <SelectItem value="promo3">Promotion Spéciale</SelectItem>
              </ValidatedSelect>
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-900 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!isValid}
            onClick={handleSubmit}
            className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
