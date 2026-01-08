/**
 * AddMultipleProcessesModal Component
 * Modal dialog for adding multiple processes to a domain group at once
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/ui/dialog';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Plus, Activity, Building2 } from 'lucide-react';

interface AddMultipleProcessesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (count: number, nodeType: 'mainProcess' | 'domainGroup') => void;
  initialCount?: number;
}

export function AddMultipleProcessesModal({
  open,
  onOpenChange,
  onConfirm,
  initialCount = 1,
}: AddMultipleProcessesModalProps) {
  const [count, setCount] = useState(initialCount);
  const [nodeType, setNodeType] = useState<'mainProcess' | 'domainGroup'>('mainProcess');
  const [error, setError] = useState<string | null>(null);

  // Reset count and nodeType when modal opens
  useEffect(() => {
    if (open) {
      setCount(initialCount);
      setNodeType('mainProcess');
      setError(null);
    }
  }, [open, initialCount]);

  const handleConfirm = () => {
    // Validation
    if (count < 1) {
      setError('Le nombre doit être au moins 1');
      return;
    }
    if (count > 50) {
      setError('Le nombre maximum est 50');
      return;
    }

    onConfirm(count, nodeType);
    onOpenChange(false);
  };

  const handleCountChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setCount(numValue);
      setError(null);
    } else if (value === '') {
      setCount(0);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-600" />
            Ajouter plusieurs processus
          </DialogTitle>
          <DialogDescription>
            Créez plusieurs processus en une seule fois dans ce groupe de domaine.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>
              Type de nœud
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNodeType('mainProcess')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  nodeType === 'mainProcess'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <Activity className={`w-6 h-6 ${nodeType === 'mainProcess' ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className="text-sm font-medium">Processus Principal</span>
                {nodeType === 'mainProcess' && (
                  <span className="text-xs text-orange-600 font-semibold">✓ Sélectionné</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setNodeType('domainGroup')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  nodeType === 'domainGroup'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <Building2 className={`w-6 h-6 ${nodeType === 'domainGroup' ? 'text-orange-600' : 'text-gray-600'}`} />
                <span className="text-sm font-medium">Groupe de Domaine</span>
                {nodeType === 'domainGroup' && (
                  <span className="text-xs text-orange-600 font-semibold">✓ Sélectionné</span>
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="processCount">
              Nombre de nœuds à créer
            </Label>
            <Input
              id="processCount"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
              placeholder="Ex: 5"
              className="w-full"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <p className="text-xs text-gray-500">
              {nodeType === 'mainProcess' 
                ? 'Les processus seront automatiquement disposés dans le groupe.' 
                : 'Les groupes de domaine seront automatiquement disposés dans le groupe parent.'}
              {' '}Maximum : 50 nœuds.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-orange-600 hover:bg-orange-700"
            disabled={count < 1 || count > 50}
          >
            Créer {count} {nodeType === 'mainProcess' ? 'processus' : 'groupes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
