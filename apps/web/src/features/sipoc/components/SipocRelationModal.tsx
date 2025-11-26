import React, { useState, useMemo } from 'react';
import { SipocElement, SipocDiagram, ElementType } from '../types/sipoc.types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter, 
  Button, 
  Label, 
  Input,
  BodySmall,
  Caption 
} from '@repo/ui';
import { Search, ArrowRight, Link2, AlertCircle } from 'lucide-react';

interface SipocRelationModalProps {
  element: SipocElement;
  currentSipocId: string;
  availableSipocs: SipocDiagram[];
  isOpen: boolean;
  onClose: () => void;
  onCreateRelation: (targetSipocId: string, targetElementId: string, description?: string) => void;
}

// Logique de suggestions basée sur le type d'élément
const getTargetElementTypes = (sourceType: ElementType): ElementType[] => {
  const suggestions: Record<ElementType, ElementType[]> = {
    [ElementType.supplier]: [ElementType.input],
    [ElementType.input]: [ElementType.process],
    [ElementType.process]: [ElementType.output],
    [ElementType.output]: [ElementType.customer],
    [ElementType.customer]: [], // Fin de chaîne
  };
  return suggestions[sourceType] || [];
};

const getTypeLabel = (type: ElementType): string => {
  const labels: Record<ElementType, string> = {
    [ElementType.supplier]: 'Fournisseur',
    [ElementType.input]: 'Entrée',
    [ElementType.process]: 'Processus',
    [ElementType.output]: 'Sortie',
    [ElementType.customer]: 'Client',
  };
  return labels[type];
};

export const SipocRelationModal: React.FC<SipocRelationModalProps> = ({
  element,
  currentSipocId,
  availableSipocs,
  isOpen,
  onClose,
  onCreateRelation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSipoc, setSelectedSipoc] = useState<SipocDiagram | null>(null);
  const [selectedElement, setSelectedElement] = useState<SipocElement | null>(null);
  const [description, setDescription] = useState('');

  // Types d'éléments suggérés pour la relation
  const targetTypes = useMemo(() => getTargetElementTypes(element.type), [element.type]);

  // Filtrer les SIPOC disponibles (exclure le SIPOC courant)
  const filteredSipocs = useMemo(() => {
    return availableSipocs
      .filter(sipoc => sipoc.sipoc_id !== currentSipocId)
      .filter(sipoc => 
        searchTerm === '' || 
        sipoc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sipoc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [availableSipocs, currentSipocId, searchTerm]);

  // Éléments suggérés du SIPOC sélectionné
  const suggestedElements = useMemo(() => {
    if (!selectedSipoc) return [];
    
    return selectedSipoc.sipocElements?.filter(el => 
      targetTypes.includes(el.type)
    ) || [];
  }, [selectedSipoc, targetTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSipoc || !selectedElement) {
      return;
    }
    
    onCreateRelation(selectedSipoc.sipoc_id, selectedElement.id, description.trim() || undefined);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedSipoc(null);
    setSelectedElement(null);
    setDescription('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset();
      onClose();
    }
  };

  const handleCancelClick = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-orange-600" />
            Créer une relation SIPOC
          </DialogTitle>
          <BodySmall className="text-gray-600 mt-2">
            Élément source : <span className="font-medium text-gray-900">{element.title}</span>
            {' '}({getTypeLabel(element.type)})
          </BodySmall>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6 pt-6">
              
              {/* Info sur les types suggérés */}
              {targetTypes.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <BodySmall className="text-blue-900 font-medium">
                        Types d'éléments suggérés
                      </BodySmall>
                      <Caption className="text-blue-700 mt-1">
                        Pour un {getTypeLabel(element.type)}, connectez-vous à : {targetTypes.map(getTypeLabel).join(', ')}
                      </Caption>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 1: Sélection du SIPOC */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                    1
                  </span>
                  Sélectionner un diagramme SIPOC cible
                </Label>
                
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un diagramme SIPOC..."
                    className="pl-10"
                  />
                </div>

                {/* Liste des SIPOC */}
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredSipocs.length === 0 ? (
                    <div className="p-8 text-center">
                      <BodySmall className="text-gray-500">
                        Aucun diagramme SIPOC disponible
                      </BodySmall>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredSipocs.map((sipoc) => (
                        <button
                          key={sipoc.sipoc_id}
                          type="button"
                          onClick={() => {
                            setSelectedSipoc(sipoc);
                            setSelectedElement(null); // Reset element selection
                          }}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                            selectedSipoc?.sipoc_id === sipoc.sipoc_id 
                              ? 'bg-orange-50 border-l-4 border-orange-600' 
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <BodySmall className="font-medium text-gray-900 truncate">
                                {sipoc.title}
                              </BodySmall>
                              {sipoc.description && (
                                <Caption className="text-gray-600 mt-1 line-clamp-2">
                                  {sipoc.description}
                                </Caption>
                              )}
                              <Caption className="text-gray-500 mt-1">
                                {sipoc.sipocElements?.length || 0} éléments
                              </Caption>
                            </div>
                            {selectedSipoc?.sipoc_id === sipoc.sipoc_id && (
                              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Étape 2: Sélection de l'élément cible */}
              {selectedSipoc && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                      2
                    </span>
                    Sélectionner un élément cible
                  </Label>

                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {suggestedElements.length === 0 ? (
                      <div className="p-8 text-center">
                        <BodySmall className="text-gray-500">
                          Aucun élément suggéré disponible
                        </BodySmall>
                        <Caption className="text-gray-400 mt-1">
                          Types recherchés : {targetTypes.map(getTypeLabel).join(', ')}
                        </Caption>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {suggestedElements.map((el) => (
                          <button
                            key={el.id}
                            type="button"
                            onClick={() => setSelectedElement(el)}
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                              selectedElement?.id === el.id 
                                ? 'bg-orange-50 border-l-4 border-orange-600' 
                                : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <BodySmall className="font-medium text-gray-900">
                                    {el.title}
                                  </BodySmall>
                                  <Caption className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                    {getTypeLabel(el.type)}
                                  </Caption>
                                </div>
                                {el.description && (
                                  <Caption className="text-gray-600 mt-1 line-clamp-2">
                                    {el.description}
                                  </Caption>
                                )}
                              </div>
                              {selectedElement?.id === el.id && (
                                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 3: Description optionnelle */}
              {selectedElement && (
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                      3
                    </span>
                    Description de la relation (optionnel)
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Transfert de données, Validation requise..."
                    className="focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}

              {/* Aperçu de la relation */}
              {selectedSipoc && selectedElement && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <Caption className="text-gray-700 font-medium mb-3">Aperçu de la relation</Caption>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white border border-gray-200 rounded p-3">
                      <Caption className="text-gray-500 mb-1">{getTypeLabel(element.type)}</Caption>
                      <BodySmall className="font-medium text-gray-900 truncate">
                        {element.title}
                      </BodySmall>
                    </div>
                    <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="flex-1 bg-white border border-gray-200 rounded p-3">
                      <Caption className="text-gray-500 mb-1">{getTypeLabel(selectedElement.type)}</Caption>
                      <BodySmall className="font-medium text-gray-900 truncate">
                        {selectedElement.title}
                      </BodySmall>
                    </div>
                  </div>
                  {description && (
                    <Caption className="text-gray-600 mt-3">
                      <span className="font-medium">Description :</span> {description}
                    </Caption>
                  )}
                </div>
              )}
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
              disabled={!selectedSipoc || !selectedElement}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Créer la relation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
