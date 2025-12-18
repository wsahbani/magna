/**
 * AI Generate Process Modal Component
 * Modal pour générer un Process avec IA
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
import { Loader2, Sparkles, CheckCircle2, AlertCircle, MapPin, ArrowRight, ArrowDown } from 'lucide-react';
import { useAIGenerateProcess } from '../hooks/useAIGenerateProcess';
import { useProcessMaps } from '../../process-map/hooks/useProcessMaps';
import type { GeneratedProcessStructure } from '../../../lib/api/ai.api';
import { BodySmall, Caption } from '@repo/ui';

interface AIGenerateProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processMapId?: string;
  workspaceId?: string;
  departmentId?: string;
  onSuccess: (response: {
    structure: GeneratedProcessStructure;
    estimatedCost: number;
    cached: boolean;
    tokensUsed: { prompt: number; completion: number; total: number };
    processMapId?: string;
    workspaceId?: string;
    flowDirection?: 'horizontal' | 'vertical';
  }) => void;
}

export function AIGenerateProcessModal({
  open,
  onOpenChange,
  processMapId: initialProcessMapId,
  workspaceId: initialWorkspaceId,
  departmentId,
  onSuccess,
}: AIGenerateProcessModalProps) {
  const [description, setDescription] = useState('');
  const [processMapId, setProcessMapId] = useState(initialProcessMapId || '');
  const [flowDirection, setFlowDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const { data: processMapsData, isLoading: isLoadingProcessMaps } = useProcessMaps({
    workspaceId: initialWorkspaceId,
  });
  const processMaps = processMapsData?.data || [];
  const generateMutation = useAIGenerateProcess();

  const handleGenerate = async () => {
    if (!description.trim() || !processMapId) {
      return;
    }

    try {
      const response = await generateMutation.mutateAsync({
        description: description.trim(),
        processMapId,
        workspaceId: initialWorkspaceId,
        departmentId,
        flowDirection,
      });
      // Passer le processMapId, workspaceId et flowDirection avec la réponse
      onSuccess({
        ...response,
        processMapId,
        workspaceId: initialWorkspaceId,
        flowDirection,
      });
      setDescription('');
      setProcessMapId(initialProcessMapId || '');
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleCancel = () => {
    setDescription('');
    setFlowDirection('horizontal');
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
            Décrivez le processus que vous souhaitez créer. L'IA générera automatiquement
            la structure avec procédures, tâches, événements et passerelles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ProcessMap Selection */}
          <div className="space-y-2">
            <Label htmlFor="processMapId" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-600" />
              Carte des processus <span className="text-red-500">*</span>
            </Label>
            <Select
              value={processMapId}
              onValueChange={setProcessMapId}
              disabled={isLoadingProcessMaps || !!initialProcessMapId}
            >
              <SelectTrigger id="processMapId">
                <SelectValue
                  placeholder={
                    isLoadingProcessMaps
                      ? 'Chargement...'
                      : initialProcessMapId
                        ? 'Carte sélectionnée'
                        : 'Sélectionner une carte des processus'
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] z-[150]" position="popper">
                {processMaps.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    {isLoadingProcessMaps
                      ? 'Chargement...'
                      : 'Aucune carte des processus disponible'}
                  </div>
                ) : (
                  processMaps.map((processMap) => (
                    <SelectItem key={processMap.id} value={processMap.id}>
                      {processMap.title} ({processMap.code})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {initialProcessMapId && (
              <Caption className="text-gray-500">
                La carte des processus est prédéfinie depuis le contexte
              </Caption>
            )}
          </div>

          {/* Flow Direction Selection */}
          <div className="space-y-2">
            <Label htmlFor="flowDirection" className="flex items-center gap-2">
              {flowDirection === 'horizontal' ? (
                <ArrowRight className="h-4 w-4 text-orange-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-orange-600" />
              )}
              Direction du flow
            </Label>
            <Select value={flowDirection} onValueChange={(value: 'horizontal' | 'vertical') => setFlowDirection(value)}>
              <SelectTrigger id="flowDirection">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[150]" position="popper">
                <SelectItem value="horizontal">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Horizontal (de gauche à droite)
                  </div>
                </SelectItem>
                <SelectItem value="vertical">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4" />
                    Vertical (de haut en bas)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Caption className="text-gray-500">
              {flowDirection === 'horizontal'
                ? 'Le flow sera généré de gauche à droite'
                : 'Le flow sera généré de haut en bas'}
            </Caption>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du processus</Label>
            <Textarea
              id="description"
              placeholder="Exemple: Processus de recrutement avec publication d'offre, réception de CV, sélection, entretiens et embauche"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <Caption className="text-gray-500">
              Soyez aussi précis que possible pour obtenir de meilleurs résultats. L'IA générera
              automatiquement les procédures, tâches spécialisées (userTask, serviceTask, etc.),
              événements (timerEvent, messageEvent) et passerelles appropriées.
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
            disabled={!description.trim() || !processMapId || generateMutation.isPending}
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

