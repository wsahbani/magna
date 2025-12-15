/**
 * AI Generate Modal Component
 * Modal pour générer une ProcessMap avec IA
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/ui';
import { Button } from '@repo/ui/components/ui/button';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Loader2, Sparkles, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { useAIGenerateProcessMap } from '../hooks/useAIGenerateProcessMap';
import { useWorkspaces } from '../../workspaces/hooks/useWorkspaces';
import type { GeneratedProcessMapStructure } from '../../../lib/api/ai.api';
import { BodySmall, Caption } from '@repo/ui';

interface AIGenerateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: string;
  departmentId?: string;
  onSuccess: (response: {
    structure: GeneratedProcessMapStructure;
    estimatedCost: number;
    cached: boolean;
    tokensUsed: { prompt: number; completion: number; total: number };
    workspaceId?: string;
  }) => void;
}

export function AIGenerateModal({
  open,
  onOpenChange,
  workspaceId: initialWorkspaceId,
  departmentId,
  onSuccess,
}: AIGenerateModalProps) {
  const [description, setDescription] = useState('');
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId || '');
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const workspaces = workspacesData?.data || [];
  const generateMutation = useAIGenerateProcessMap();

  const handleGenerate = async () => {
    if (!description.trim() || !workspaceId) {
      return;
    }

    try {
      const response = await generateMutation.mutateAsync({
        description: description.trim(),
        workspaceId,
        departmentId,
      });
      // Passer le workspaceId avec la réponse
      onSuccess({
        ...response,
        workspaceId, // Ajouter workspaceId à la réponse
      });
      setDescription('');
      setWorkspaceId(initialWorkspaceId || '');
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCancel = () => {
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            Générer avec IA
          </DialogTitle>
          <DialogDescription>
            Décrivez la carte de processus que vous souhaitez créer. L'IA générera automatiquement
            la structure avec groupes et processus.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Workspace Selection */}
          <div className="space-y-2">
            <Label htmlFor="workspaceId" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              Workspace <span className="text-red-500">*</span>
            </Label>
            <Select
              value={workspaceId}
              onValueChange={setWorkspaceId}
              disabled={isLoadingWorkspaces}
            >
              <SelectTrigger id="workspaceId">
                <SelectValue placeholder={isLoadingWorkspaces ? 'Chargement...' : 'Sélectionner un workspace'} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] z-[150]" position="popper">
                {workspaces.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    {isLoadingWorkspaces ? 'Chargement...' : 'Aucun workspace disponible'}
                  </div>
                ) : (
                  workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name} ({workspace.code})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description de la carte de processus</Label>
            <Textarea
              id="description"
              placeholder="Exemple: Carte des processus RH avec recrutement, formation, paie et relations sociales"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <Caption className="text-gray-500">
              Soyez aussi précis que possible pour obtenir de meilleurs résultats
            </Caption>
          </div>

          {generateMutation.isError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <BodySmall className="text-red-800 font-medium">Erreur de génération</BodySmall>
                <BodySmall className="text-red-600">
                  {generateMutation.error instanceof Error
                    ? generateMutation.error.message
                    : 'Une erreur est survenue lors de la génération'}
                </BodySmall>
              </div>
            </div>
          )}

          {generateMutation.isSuccess && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <BodySmall className="text-green-800 font-medium">Génération réussie</BodySmall>
                <BodySmall className="text-green-600">
                  {generateMutation.data.cached
                    ? 'Résultat récupéré du cache'
                    : 'Structure générée avec succès'}
                </BodySmall>
              </div>
            </div>
          )}

          {generateMutation.data && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <BodySmall className="text-blue-800">
                Coût estimé: ${generateMutation.data.estimatedCost.toFixed(4)} | Tokens:{' '}
                {generateMutation.data.tokensUsed.total}
              </BodySmall>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={generateMutation.isPending}>
            Annuler
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!description.trim() || !workspaceId || generateMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

