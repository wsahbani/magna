/**
 * Image Extraction Modal Component
 * Modal pour uploader une image et extraire une Procedure avec IA vision
 */

import { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui';
import { Button } from '@repo/ui/components/ui/button';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Label } from '@repo/ui/components/ui/label';
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useExtractProcedureFromImage } from '../hooks/useExtractProcedureFromImage';
import { Body, BodySmall, Caption } from '@repo/ui';

interface ImageExtractionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedureId: string;
  existingNodesCount: number;
  onSuccess: (result: {
    nodesCreated: number;
    startEventsCreated: number;
    endEventsCreated: number;
    intermediateEventsCreated: number;
    tasksCreated: number;
    gatewaysCreated: number;
    replaceExisting: boolean;
  }) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'];

export function ImageExtractionModal({
  open,
  onOpenChange,
  procedureId,
  existingNodesCount,
  onSuccess,
}: ImageExtractionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extractMutation = useExtractProcedureFromImage();
  const [replaceExisting, setReplaceExisting] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Format d'image non supporté. Formats acceptés: PNG, JPG, WEBP, GIF, BMP, SVG`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Fichier trop volumineux. Taille maximale: 5 MB`;
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [validateFile],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleExtract = useCallback(async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setError(null);

    try {
      const result = await extractMutation.mutateAsync({
        image: selectedFile,
        procedureId,
        replaceExisting,
        description: description.trim() || undefined,
      });

      onSuccess({
        nodesCreated: result.data.nodesCreated,
        startEventsCreated: result.data.startEventsCreated,
        endEventsCreated: result.data.endEventsCreated,
        intermediateEventsCreated: result.data.intermediateEventsCreated,
        tasksCreated: result.data.tasksCreated,
        gatewaysCreated: result.data.gatewaysCreated,
        replaceExisting,
      });

      // Reset
      setSelectedFile(null);
      setPreview(null);
      setDescription('');
      setReplaceExisting(false);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  }, [selectedFile, procedureId, replaceExisting, description, extractMutation, onSuccess, onOpenChange]);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
    setError(null);
    setReplaceExisting(false);
    onOpenChange(false);
  }, [onOpenChange]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            Extraire depuis une image
          </DialogTitle>
          <DialogDescription>
            Uploadez une image contenant un diagramme BPMN. L'IA analysera l'image et extraira automatiquement les événements, tâches et gateways.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload Zone */}
          <div className="space-y-2">
            <Label>Image du diagramme BPMN</Label>
            {!selectedFile ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <Body className="text-gray-600 mb-2">
                  Glissez-déposez une image ici ou cliquez pour sélectionner
                </Body>
                <BodySmall className="text-gray-500">
                  Formats acceptés: PNG, JPG, WEBP, GIF, BMP, SVG (max 5 MB)
                </BodySmall>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_TYPES.join(',')}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative border border-gray-200 rounded-lg p-4">
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {preview && (
                  <div className="space-y-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg border border-gray-200"
                    />
                    <BodySmall className="text-center text-gray-600">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </BodySmall>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description optionnelle */}
          <div className="space-y-2">
            <Label htmlFor="description">Description optionnelle (pour aider l'IA)</Label>
            <Textarea
              id="description"
              placeholder="Exemple: Procédure de validation de commande avec vérification stock et paiement"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Caption className="text-gray-500">
              Fournissez un contexte supplémentaire pour améliorer la précision de l'extraction
            </Caption>
          </div>

          {/* Replace existing nodes option */}
          {existingNodesCount > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                Remplacer les {existingNodesCount} node(s) existant(s)
              </Label>
              <Caption className="text-gray-500">
                Si coché, tous les nodes existants seront supprimés et remplacés par ceux extraits de l'image
              </Caption>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <BodySmall className="text-red-800 font-medium">Erreur</BodySmall>
                <BodySmall className="text-red-600">{error}</BodySmall>
              </div>
            </div>
          )}

          {/* Success display */}
          {extractMutation.isSuccess && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <BodySmall className="text-green-800 font-medium">Extraction réussie</BodySmall>
                <BodySmall className="text-green-600">
                  {extractMutation.data.data.startEventsCreated} événement(s) de début,{' '}
                  {extractMutation.data.data.endEventsCreated} événement(s) de fin,{' '}
                  {extractMutation.data.data.intermediateEventsCreated} événement(s) intermédiaire(s),{' '}
                  {extractMutation.data.data.tasksCreated} tâche(s),{' '}
                  {extractMutation.data.data.gatewaysCreated} passerelle(s) extraits
                </BodySmall>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={extractMutation.isPending}>
            Annuler
          </Button>
          <Button
            onClick={handleExtract}
            disabled={!selectedFile || extractMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {extractMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                Extraire
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

