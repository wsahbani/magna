/**
 * SIPOC Import Modal
 * 3-Phase workflow: Upload → Preview → Save
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@repo/ui';
import { Button } from '@repo/ui';
import { Heading3, Body, BodySmall, Caption } from '@repo/ui';
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
} from 'lucide-react';
import {
  parseExcelFile,
  isValidExcelFile,
  formatFileSize,
  convertToSipocElements,
  type ParsedSipocRow,
  type SipocElementImport,
} from '../utils/excel-parser';
import { ElementType } from '../types/sipoc.types';
import { ExcelPreviewTable } from './ExcelPreviewTable';
import { sipocApi } from '../../../services/sipocApi';

interface SipocImportModalProps {
  open: boolean;
  onClose: () => void;
  sipocId: string;
  onImportComplete: () => void;
}

type ImportPhase = 'upload' | 'preview' | 'saving';

export const SipocImportModal = ({
  open,
  onClose,
  sipocId,
  onImportComplete,
}: SipocImportModalProps) => {
  // Phase management
  const [phase, setPhase] = useState<ImportPhase>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload phase state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Preview phase state
  const [parsedRows, setParsedRows] = useState<ParsedSipocRow[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [editableElements, setEditableElements] = useState<SipocElementImport[]>(
    []
  );

  // Stats
  const stats = useMemo(() => {
    const counts = {
      suppliers: 0,
      inputs: 0,
      processes: 0,
      outputs: 0,
      customers: 0,
    };

    editableElements.forEach((el) => {
      if (el.type === ElementType.supplier) counts.suppliers++;
      if (el.type === ElementType.input) counts.inputs++;
      if (el.type === ElementType.process) counts.processes++;
      if (el.type === ElementType.output) counts.outputs++;
      if (el.type === ElementType.customer) counts.customers++;
    });

    return counts;
  }, [editableElements]);

  // Reset modal state
  const resetModal = useCallback(() => {
    setPhase('upload');
    setSelectedFile(null);
    setIsDragging(false);
    setIsParsingFile(false);
    setParseError(null);
    setParsedRows([]);
    setParseWarnings([]);
    setEditableElements([]);
  }, []);

  // Handle modal close
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      resetModal();
      onClose();
    }
  }, [resetModal, onClose]);

  const handleCancelClick = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  // File selection
  const handleFileSelect = useCallback((file: File) => {
    if (!isValidExcelFile(file)) {
      setParseError(
        'Format de fichier non valide. Formats acceptés : .xlsx, .xls, .ods'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setParseError('Fichier trop volumineux. Taille maximale : 10 MB');
      return;
    }

    setSelectedFile(file);
    setParseError(null);
  }, []);

  // Drag and drop handlers
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
    [handleFileSelect]
  );

  // Parse file and move to preview
  const handleParseFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsParsingFile(true);
    setParseError(null);

    try {
      const result = await parseExcelFile(selectedFile);

      if (result.errors.length > 0) {
        setParseError(result.errors.join('. '));
        setIsParsingFile(false);
        return;
      }

      setParsedRows(result.rows);
      setParseWarnings(result.warnings);

      const elements = convertToSipocElements(result.rows);
      setEditableElements(elements);

      setPhase('preview');
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Erreur lors de l'analyse du fichier"
      );
    } finally {
      setIsParsingFile(false);
    }
  }, [selectedFile]);

  // Update a specific cell in a row
  const handleCellUpdate = useCallback(
    (rowIndex: number, columnType: 'suppliers' | 'inputs' | 'processes' | 'outputs' | 'customers', cellIndex: number, newValue: string) => {
      setParsedRows((prev) => {
        const updated = [...prev];
        if (updated[rowIndex]) {
          const cells = [...updated[rowIndex][columnType]];
          cells[cellIndex] = newValue.trim();
          updated[rowIndex] = { ...updated[rowIndex], [columnType]: cells };
        }
        return updated;
      });

      // Reconvert to elements
      const elements = convertToSipocElements(parsedRows);
      setEditableElements(elements);
    },
    [parsedRows]
  );

  // Delete a specific cell from a row
  const handleCellDelete = useCallback(
    (rowIndex: number, columnType: 'suppliers' | 'inputs' | 'processes' | 'outputs' | 'customers', cellIndex: number) => {
      setParsedRows((prev) => {
        const updated = [...prev];
        if (updated[rowIndex]) {
          const cells = [...updated[rowIndex][columnType]];
          cells.splice(cellIndex, 1);
          updated[rowIndex] = { ...updated[rowIndex], [columnType]: cells };
        }
        return updated;
      });

      // Reconvert to elements
      const elements = convertToSipocElements(parsedRows);
      setEditableElements(elements);
    },
    [parsedRows]
  );

  // Update entire row
  const handleRowUpdate = useCallback((rowIndex: number, updatedRow: ParsedSipocRow) => {
    setParsedRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = updatedRow;
      return updated;
    });

    // Reconvert to elements
    const elements = convertToSipocElements(parsedRows);
    setEditableElements(elements);
  }, [parsedRows]);

  // Delete entire row
  const handleRowDelete = useCallback((rowIndex: number) => {
    setParsedRows((prev) => prev.filter((_, i) => i !== rowIndex));
    
    // Reconvert to elements
    const updatedRows = parsedRows.filter((_, i) => i !== rowIndex);
    const elements = convertToSipocElements(updatedRows);
    setEditableElements(elements);
  }, [parsedRows]);

  // Save to database - Create processes row by row with all SIPOC elements
  const handleSave = useCallback(async () => {
    setPhase('saving');
    
    try {
      // Group elements by flowId (each flow = 1 process + its SIPOC elements)
      const flowsMap = new Map<string, SipocElementImport[]>();
      editableElements.forEach((el) => {
        if (!flowsMap.has(el.flowId)) {
          flowsMap.set(el.flowId, []);
        }
        flowsMap.get(el.flowId)!.push(el);
      });

      let totalCreated = 0;

      // Process each flow one by one
      for (const [flowId, elements] of flowsMap.entries()) {
        // Find the process element (should be only one per flow)
        const processElement = elements.find((el) => el.type === ElementType.process);
        
        if (!processElement) {
          console.warn(`No process found for flow ${flowId}, skipping...`);
          continue;
        }

        // 1. Create the process element first (pivot of the flow)
        await sipocApi.createElement({
          sipoc_id: sipocId,
          type: processElement.type,
          title: processElement.title,
          description: processElement.description,
          position: processElement.globalOrder,
          flow_id: flowId, // UUID unique for this flow
        });
        totalCreated++;
        console.log(`✅ Created process: "${processElement.title}" (flow: ${flowId})`);

        // 2. Create all other SIPOC elements for this flow
        const otherElements = elements.filter((el) => el.type !== ElementType.process);
        
        for (const element of otherElements) {
          await sipocApi.createElement({
            sipoc_id: sipocId,
            type: element.type,
            title: element.title,
            description: element.description,
            position: element.position,
            flow_id: flowId, // Same flow_id as the process
          });
          totalCreated++;
          console.log(`  ↳ Created ${element.type}: "${element.title}"`);
        }

        console.log(`✅ Flow completed: ${elements.length} elements created`);
      }

      console.log(`🎉 Import completed! Created ${totalCreated} elements across ${flowsMap.size} flows`);
      
      onImportComplete();
      handleCancelClick();
    } catch (error) {
      console.error('Error during import:', error);
      setPhase('preview');
      alert('Erreur lors de l\'import. Veuillez réessayer.');
    }
  }, [editableElements, sipocId, onImportComplete, handleCancelClick]);

  // Render content based on phase
  const renderContent = () => {
    switch (phase) {
      case 'upload':
        return (
          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 hover:border-orange-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <Heading3 className="mb-2">
                Glissez-déposez votre fichier Excel ici
              </Heading3>
              <Body className="text-gray-500 mb-4">ou</Body>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.ods"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <Button 
                variant="secondary" 
                size="sm" 
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Sélectionner un fichier
              </Button>
              <Caption className="text-gray-400 mt-4">
                Formats acceptés : .xlsx, .xls, .ods (max 10 MB)
              </Caption>
            </div>

            {/* Selected file info */}
            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <Body className="font-medium">{selectedFile.name}</Body>
                    <Caption className="text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </Caption>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Parse error */}
            {parseError && (
              <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <BodySmall className="text-red-800 font-medium">
                    Erreur
                  </BodySmall>
                  <Caption className="text-red-700">{parseError}</Caption>
                </div>
              </div>
            )}

            {/* Format instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <BodySmall className="text-blue-900 font-medium mb-2">
                Format attendu
              </BodySmall>
              <Caption className="text-blue-800">
                Votre fichier Excel doit contenir 5 colonnes : Fournisseurs,
                Entrées, Processus, Sorties, Clients. Plusieurs éléments par
                cellule peuvent être séparés par des sauts de ligne ou des
                points-virgules.
              </Caption>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-5 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <Body className="font-bold text-purple-700">
                  {stats.suppliers}
                </Body>
                <Caption className="text-purple-600">Fournisseurs</Caption>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <Body className="font-bold text-blue-700">{stats.inputs}</Body>
                <Caption className="text-blue-600">Entrées</Caption>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <Body className="font-bold text-orange-700">
                  {stats.processes}
                </Body>
                <Caption className="text-orange-600">Processus</Caption>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <Body className="font-bold text-green-700">{stats.outputs}</Body>
                <Caption className="text-green-600">Sorties</Caption>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg text-center">
                <Body className="font-bold text-pink-700">
                  {stats.customers}
                </Body>
                <Caption className="text-pink-600">Clients</Caption>
              </div>
            </div>

            {/* Warnings */}
            {parseWarnings.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <BodySmall className="text-yellow-900 font-medium mb-2">
                  Avertissements
                </BodySmall>
                <ul className="space-y-1">
                  {parseWarnings.map((warning, i) => (
                    <li key={i}>
                      <Caption className="text-yellow-800">{warning}</Caption>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Excel Preview Table - Editable */}
            <div className="max-h-[500px] overflow-auto">
              <ExcelPreviewTable
                rows={parsedRows}
                onRowUpdate={handleRowUpdate}
                onRowDelete={handleRowDelete}
                onCellUpdate={handleCellUpdate}
                onCellDelete={handleCellDelete}
              />
            </div>
          </div>
        );

      case 'saving':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4" />
            <Body className="text-gray-600">Enregistrement en cours...</Body>
          </div>
        );

      default:
        return null;
    }
  };

  // Render footer based on phase
  const renderFooter = () => {
    switch (phase) {
      case 'upload':
        return (
          <>
            <Button variant="ghost" onClick={handleCancelClick}>
              Annuler
            </Button>
            <Button
              onClick={handleParseFile}
              disabled={!selectedFile || isParsingFile}
            >
              {isParsingFile ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyse...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Analyser le fichier
                </>
              )}
            </Button>
          </>
        );

      case 'preview':
        return (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setPhase('upload');
                setSelectedFile(null);
              }}
            >
              Retour
            </Button>
            <Button
              onClick={handleSave}
              disabled={editableElements.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Importer {editableElements.length} élément(s)
            </Button>
          </>
        );

      case 'saving':
        return null;

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importer depuis Excel</DialogTitle>
          <DialogDescription>
            {phase === 'upload' &&
              'Sélectionnez un fichier Excel contenant vos données SIPOC'}
            {phase === 'preview' &&
              'Vérifiez et modifiez les données avant importation'}
            {phase === 'saving' && 'Enregistrement des données...'}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        {phase !== 'saving' && (
          <DialogFooter>
            {renderFooter()}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
