import React, { useState, useEffect, useMemo } from 'react';
import { Button, Heading2, Heading3, BodySmall, Caption, Card, CardHeader, CardContent, CardFooter, Label, ValidatedInput, Textarea, Badge } from '@repo/ui';
import {
  ProcessIdentityCard,
  FipIndicator,
  FipStakeholder,
  FipRisk,
  FipOpportunity,
  FipResource,
  FipPerformanceTarget,
  UpdateFipDto,
} from '../types/fip.types';
import { Plus, Trash2, Save, Target, MapPin, BarChart3, Users, AlertTriangle, Lightbulb, Briefcase, TrendingUp, AlertCircle, Info, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { FipAccordionSection } from './FipAccordionSection';
import { calculateFipSectionCompletions } from '../utils/fipHelpers';
import { validateFipData, getFieldError, validateField, ValidationError } from '../utils/validation';
import { SipocElement } from '../../sipoc/types/sipoc.types';
import { SipocElementsList } from './SipocElementsList';
import { SipocElementEditModal } from './SipocElementEditModal';
import { SipocElementDeleteModal } from './SipocElementDeleteModal';
import { useNavigate } from '@tanstack/react-router';

interface FipFormProps {
  fip: ProcessIdentityCard | null;
  onSave: (data: UpdateFipDto) => Promise<void>;
  isSaving?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: UpdateFipDto) => void;
  sipocElements?: SipocElement[];
  canEditSipoc?: boolean;
  processId: string;
  sipocLoading?: boolean;
  sipocError?: string;
  refetchSipoc?: () => void;
}

export const FipForm: React.FC<FipFormProps> = ({
  fip,
  onSave,
  isSaving = false,
  isEditable = true,
  onDataChange,
  sipocElements = [],
  canEditSipoc = false,
  processId,
  sipocLoading = false,
  sipocError,
  refetchSipoc,
}) => {
  const navigate = useNavigate();
  const [elementToEdit, setElementToEdit] = useState<SipocElement | null>(null);
  const [elementToDelete, setElementToDelete] = useState<SipocElement | null>(null);
  
  const [formData, setFormData] = useState<UpdateFipDto>(() => ({
    objectives: fip?.objectives || '',
    scope: fip?.scope || '',
    indicators: (Array.isArray(fip?.indicators) ? fip.indicators : []) || [],
    stakeholders: (Array.isArray(fip?.stakeholders) ? fip.stakeholders : []) || [],
    risks: (Array.isArray(fip?.risks) ? fip.risks : []) || [],
    opportunities: (Array.isArray(fip?.opportunities) ? fip.opportunities : []) || [],
    resources: (Array.isArray(fip?.resources) ? fip.resources : []) || [],
    performanceTargets: (Array.isArray(fip?.performanceTargets) ? fip.performanceTargets : []) || [],
  }));

  // Update form data when FIP changes
  useEffect(() => {
    if (fip) {
      setFormData({
        objectives: fip.objectives || '',
        scope: fip.scope || '',
        indicators: (Array.isArray(fip.indicators) ? fip.indicators : []) || [],
        stakeholders: (Array.isArray(fip.stakeholders) ? fip.stakeholders : []) || [],
        risks: (Array.isArray(fip.risks) ? fip.risks : []) || [],
        opportunities: (Array.isArray(fip.opportunities) ? fip.opportunities : []) || [],
        resources: (Array.isArray(fip.resources) ? fip.resources : []) || [],
        performanceTargets: (Array.isArray(fip.performanceTargets) ? fip.performanceTargets : []) || [],
      });
    }
  }, [fip]);

  // Notify parent of data changes for auto-save
  useEffect(() => {
    onDataChange?.(formData);
  }, [formData, onDataChange]);

  const handleSave = async () => {
    await onSave(formData);
  };

  const addIndicator = () => {
    setFormData((prev) => ({
      ...prev,
      indicators: [
        ...(prev.indicators || []),
        {
          name: '',
          description: '',
          unit: '',
          targetValue: 0,
          currentValue: 0,
          frequency: 'monthly',
          responsible: '',
        },
      ],
    }));
  };

  const removeIndicator = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      indicators: prev.indicators?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateIndicator = (index: number, field: keyof FipIndicator, value: any) => {
    setFormData((prev) => {
      const indicators = [...(prev.indicators || [])];
      indicators[index] = { ...indicators[index], [field]: value };
      return { ...prev, indicators };
    });
  };

  const addStakeholder = () => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: [
        ...(prev.stakeholders || []),
        { name: '', role: '', responsibility: '', contact: '' },
      ],
    }));
  };

  const removeStakeholder = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateStakeholder = (
    index: number,
    field: keyof FipStakeholder,
    value: string,
  ) => {
    setFormData((prev) => {
      const stakeholders = [...(prev.stakeholders || [])];
      stakeholders[index] = { ...stakeholders[index], [field]: value };
      return { ...prev, stakeholders };
    });
  };

  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      risks: [
        ...(prev.risks || []),
        { description: '', probability: 'medium', impact: 'medium', mitigation: '' },
      ],
    }));
  };

  const removeRisk = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      risks: prev.risks?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateRisk = (index: number, field: keyof FipRisk, value: any) => {
    setFormData((prev) => {
      const risks = [...(prev.risks || [])];
      risks[index] = { ...risks[index], [field]: value };
      return { ...prev, risks };
    });
  };

  const addOpportunity = () => {
    setFormData((prev) => ({
      ...prev,
      opportunities: [
        ...(prev.opportunities || []),
        { description: '', potential: '', actionPlan: '' },
      ],
    }));
  };

  const removeOpportunity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      opportunities: prev.opportunities?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateOpportunity = (index: number, field: keyof FipOpportunity, value: string) => {
    setFormData((prev) => {
      const opportunities = [...(prev.opportunities || [])];
      opportunities[index] = { ...opportunities[index], [field]: value };
      return { ...prev, opportunities };
    });
  };

  const addResource = () => {
    setFormData((prev) => ({
      ...prev,
      resources: [
        ...(prev.resources || []),
        { type: 'human', description: '', quantity: '', cost: 0 },
      ],
    }));
  };

  const removeResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateResource = (index: number, field: keyof FipResource, value: any) => {
    setFormData((prev) => {
      const resources = [...(prev.resources || [])];
      resources[index] = { ...resources[index], [field]: value };
      return { ...prev, resources };
    });
  };

  const addPerformanceTarget = () => {
    setFormData((prev) => ({
      ...prev,
      performanceTargets: [
        ...(prev.performanceTargets || []),
        { indicator: '', target: 0, deadline: '', responsible: '' },
      ],
    }));
  };

  const removePerformanceTarget = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      performanceTargets: prev.performanceTargets?.filter((_, i) => i !== index) || [],
    }));
  };

  const updatePerformanceTarget = (
    index: number,
    field: keyof FipPerformanceTarget,
    value: any,
  ) => {
    setFormData((prev) => {
      const performanceTargets = [...(prev.performanceTargets || [])];
      performanceTargets[index] = { ...performanceTargets[index], [field]: value };
      return { ...prev, performanceTargets };
    });
  };

  // Calculer les pourcentages de complétude
  const completions = useMemo(() => calculateFipSectionCompletions(formData), [formData]);

  // Validation en temps réel
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Valider les données quand elles changent
  useEffect(() => {
    const result = validateFipData(formData);
    setValidationErrors(result.errors);
  }, [formData]);

  // Fonction pour obtenir l'erreur d'un champ
  const getError = (field: string): string | undefined => {
    if (!touchedFields.has(field)) return undefined;
    return getFieldError(field, validationErrors);
  };

  // Fonction pour marquer un champ comme touché
  const markFieldTouched = (field: string) => {
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  // Fonction pour obtenir les classes CSS d'un champ selon sa validation
  const getFieldClasses = (field: string, baseClasses: string = 'p-2 border rounded-md'): string => {
    const error = getError(field);
    if (error) {
      return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500`;
    }
    if (touchedFields.has(field)) {
      return `${baseClasses} border-green-300 focus:ring-green-500 focus:border-green-500`;
    }
    return `${baseClasses} border-gray-300 focus:ring-orange-500 focus:border-orange-500`;
  };

  if (!fip) {
    return (
      <div className="flex items-center justify-center h-64">
        <BodySmall className="text-gray-500">Aucune FIP trouvée</BodySmall>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200">
      {/* Paper Document Container */}
      <div className="space-y-6 p-8">
      {/* SIPOC Data Section */}
      <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/30 to-transparent shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <Heading3 className="text-lg font-bold text-gray-900">Données SIPOC</Heading3>
                <Caption className="text-gray-600">Éléments du diagramme SIPOC</Caption>
              </div>
            </div>
            <div className="group relative">
              <Info className="w-5 h-5 text-gray-400 cursor-help hover:text-orange-600 transition-colors" />
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10">
                <p className="font-semibold mb-1">À propos des données SIPOC</p>
                <p>Ces données proviennent directement du diagramme SIPOC et sont mises à jour automatiquement.</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">

        {/* Loading State */}
        {sipocLoading && (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-3"></div>
            <BodySmall className="text-gray-600">Chargement des éléments SIPOC...</BodySmall>
          </div>
        )}

        {/* Error State */}
        {!sipocLoading && sipocError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <BodySmall className="text-red-900 font-medium mb-1">
                  Impossible de charger les éléments SIPOC
                </BodySmall>
                <Caption className="text-red-700">{sipocError}</Caption>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetchSipoc?.()}
                className="flex-shrink-0"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!sipocLoading && !sipocError && sipocElements.length === 0 && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Caption className="text-gray-500 mb-4">Aucun élément SIPOC trouvé</Caption>
            <Button
              size="sm"
              onClick={() => navigate({ to: `/processes/sipoc/${processId}` })}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Créer des éléments dans SIPOC
            </Button>
          </div>
        )}

        {/* SIPOC Elements List */}
        {!sipocLoading && !sipocError && sipocElements.length > 0 && (
          <SipocElementsList
            elements={sipocElements}
            canEdit={canEditSipoc}
            onEdit={setElementToEdit}
            onDelete={setElementToDelete}
            isLoading={sipocLoading}
          />
        )}
        </CardContent>
      </Card>

      {/* Objectifs */}
      <FipAccordionSection
        id="objectives"
        title="Objectifs"
        icon={<Target className="w-5 h-5" />}
        completionPercentage={completions.objectives}
        defaultExpanded={true}
      >
        <div className="space-y-2">
          <Label htmlFor="objectives" className="text-xs font-medium text-gray-900">
            Décrivez les objectifs stratégiques du processus
          </Label>
          <Textarea
            id="objectives"
            rows={5}
            value={formData.objectives || ''}
            onChange={(e) => {
              setFormData({ ...formData, objectives: e.target.value });
              markFieldTouched('objectives');
            }}
            onBlur={() => markFieldTouched('objectives')}
            disabled={!isEditable}
            placeholder="Ex: Améliorer la satisfaction client de 20%, réduire les délais de traitement..."
            className="resize-none"
          />
          {getError('objectives') && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{getError('objectives')}</span>
            </div>
          )}
        </div>
      </FipAccordionSection>

      {/* Périmètre */}
      <FipAccordionSection
        id="scope"
        title="Périmètre"
        icon={<MapPin className="w-5 h-5" />}
        completionPercentage={completions.scope}
      >
        <div className="space-y-2">
          <Label htmlFor="scope" className="text-xs font-medium text-gray-900">
            Définissez le périmètre d'application
          </Label>
          <Textarea
            id="scope"
            rows={4}
            value={formData.scope || ''}
            onChange={(e) => {
              setFormData({ ...formData, scope: e.target.value });
              markFieldTouched('scope');
            }}
            onBlur={() => markFieldTouched('scope')}
            disabled={!isEditable}
            placeholder="Ex: Départements concernés, zones géographiques, types de produits..."
            className="resize-none"
          />
          {getError('scope') && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{getError('scope')}</span>
            </div>
          )}
        </div>
      </FipAccordionSection>

      {/* Indicateurs */}
      <FipAccordionSection
        id="indicators"
        title="Indicateurs de Performance"
        icon={<BarChart3 className="w-5 h-5" />}
        count={formData.indicators?.length || 0}
        completionPercentage={completions.indicators}
      >
        <div className="flex items-center justify-between mb-5">
          <BodySmall className="text-gray-600 font-medium">
            {formData.indicators?.length || 0} indicateur{(formData.indicators?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addIndicator} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un indicateur
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {formData.indicators?.map((indicator, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      #{index + 1}
                    </Badge>
                    <Heading3 className="text-base font-semibold text-gray-900">
                      {indicator.name || `Indicateur ${index + 1}`}
                    </Heading3>
                  </div>
                  {isEditable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeIndicator(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <Caption className="font-semibold text-gray-700 uppercase tracking-wide">Informations de base</Caption>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`indicator-name-${index}`} className="text-xs font-medium">
                        Nom de l'indicateur <span className="text-red-500">*</span>
                      </Label>
                      <ValidatedInput
                        id={`indicator-name-${index}`}
                        type="text"
                        placeholder="Ex: Taux de satisfaction"
                        value={indicator.name}
                        showCheckmark={!!indicator.name && !getError(`indicators[${index}].name`)}
                        onChange={(e) => {
                          updateIndicator(index, 'name', e.target.value);
                          markFieldTouched(`indicators[${index}].name`);
                        }}
                        onBlur={() => markFieldTouched(`indicators[${index}].name`)}
                        disabled={!isEditable}
                        className={getError(`indicators[${index}].name`) ? 'border-red-300' : ''}
                      />
                      {getError(`indicators[${index}].name`) && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{getError(`indicators[${index}].name`)}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`indicator-unit-${index}`} className="text-xs font-medium">
                        Unité de mesure
                      </Label>
                      <ValidatedInput
                        id={`indicator-unit-${index}`}
                        type="text"
                        placeholder="Ex: %, jours, unités"
                        value={indicator.unit || ''}
                        showCheckmark={!!indicator.unit}
                        onChange={(e) => {
                          updateIndicator(index, 'unit', e.target.value);
                          markFieldTouched(`indicators[${index}].unit`);
                        }}
                        onBlur={() => markFieldTouched(`indicators[${index}].unit`)}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`indicator-description-${index}`} className="text-xs font-medium">
                      Description
                    </Label>
                    <Textarea
                      id={`indicator-description-${index}`}
                      rows={2}
                      placeholder="Décrivez l'indicateur et sa méthode de calcul..."
                      value={indicator.description || ''}
                      onChange={(e) => updateIndicator(index, 'description', e.target.value)}
                      disabled={!isEditable}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="bg-amber-50 rounded-lg p-4 space-y-4">
                  <Caption className="font-semibold text-amber-900 uppercase tracking-wide">Valeurs & Objectifs</Caption>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`indicator-current-${index}`} className="text-xs font-medium">
                        Valeur actuelle <span className="text-red-500">*</span>
                      </Label>
                      <ValidatedInput
                        id={`indicator-current-${index}`}
                        type="number"
                        placeholder="0"
                        value={indicator.currentValue || ''}
                        showCheckmark={indicator.currentValue !== null && indicator.currentValue !== undefined}
                        onChange={(e) => {
                          updateIndicator(index, 'currentValue', parseFloat(e.target.value) || 0);
                          markFieldTouched(`indicators[${index}].currentValue`);
                        }}
                        onBlur={() => markFieldTouched(`indicators[${index}].currentValue`)}
                        disabled={!isEditable}
                        className={getError(`indicators[${index}].currentValue`) ? 'border-red-300' : ''}
                      />
                      {getError(`indicators[${index}].currentValue`) && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{getError(`indicators[${index}].currentValue`)}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`indicator-target-${index}`} className="text-xs font-medium">
                        Valeur cible <span className="text-red-500">*</span>
                      </Label>
                      <ValidatedInput
                        id={`indicator-target-${index}`}
                        type="number"
                        placeholder="0"
                        value={indicator.targetValue || ''}
                        showCheckmark={indicator.targetValue !== null && indicator.targetValue !== undefined}
                        onChange={(e) => {
                          updateIndicator(index, 'targetValue', parseFloat(e.target.value) || 0);
                          markFieldTouched(`indicators[${index}].targetValue`);
                        }}
                        onBlur={() => markFieldTouched(`indicators[${index}].targetValue`)}
                        disabled={!isEditable}
                        className={getError(`indicators[${index}].targetValue`) ? 'border-red-300' : ''}
                      />
                      {getError(`indicators[${index}].targetValue`) && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{getError(`indicators[${index}].targetValue`)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                <div className="bg-green-50 rounded-lg p-4 space-y-4">
                  <Caption className="font-semibold text-green-900 uppercase tracking-wide">Suivi</Caption>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`indicator-frequency-${index}`} className="text-xs font-medium">
                        Fréquence de mesure
                      </Label>
                      <select
                        id={`indicator-frequency-${index}`}
                        className="w-full h-11 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={indicator.frequency || 'monthly'}
                        onChange={(e) => updateIndicator(index, 'frequency', e.target.value)}
                        disabled={!isEditable}
                      >
                        <option value="daily">Quotidien</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuel</option>
                        <option value="quarterly">Trimestriel</option>
                        <option value="yearly">Annuel</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`indicator-responsible-${index}`} className="text-xs font-medium">
                        Responsable
                      </Label>
                      <ValidatedInput
                        id={`indicator-responsible-${index}`}
                        type="text"
                        placeholder="Nom du responsable"
                        value={indicator.responsible || ''}
                        showCheckmark={!!indicator.responsible}
                        onChange={(e) => updateIndicator(index, 'responsible', e.target.value)}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FipAccordionSection>

      {/* Acteurs */}
      <FipAccordionSection
        id="stakeholders"
        title="Acteurs et Responsabilités"
        icon={<Users className="w-5 h-5" />}
        count={formData.stakeholders?.length || 0}
        completionPercentage={completions.stakeholders}
      >
        <div className="flex items-center justify-between mb-5">
          <BodySmall className="text-gray-600 font-medium">
            {formData.stakeholders?.length || 0} acteur{(formData.stakeholders?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addStakeholder} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un acteur
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {formData.stakeholders?.map((stakeholder, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      #{index + 1}
                    </Badge>
                    <Heading3 className="text-base font-semibold text-gray-900">
                      {stakeholder.name || `Acteur ${index + 1}`}
                    </Heading3>
                  </div>
                  {isEditable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeStakeholder(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`stakeholder-name-${index}`} className="text-xs font-medium">
                      Nom complet
                    </Label>
                    <ValidatedInput
                      id={`stakeholder-name-${index}`}
                      type="text"
                      placeholder="Ex: Jean Dupont"
                      value={stakeholder.name}
                      showCheckmark={!!stakeholder.name}
                      onChange={(e) => updateStakeholder(index, 'name', e.target.value)}
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stakeholder-role-${index}`} className="text-xs font-medium">
                      Rôle
                    </Label>
                    <ValidatedInput
                      id={`stakeholder-role-${index}`}
                      type="text"
                      placeholder="Ex: Chef de projet"
                      value={stakeholder.role}
                      showCheckmark={!!stakeholder.role}
                      onChange={(e) => updateStakeholder(index, 'role', e.target.value)}
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stakeholder-responsibility-${index}`} className="text-xs font-medium">
                      Responsabilité
                    </Label>
                    <ValidatedInput
                      id={`stakeholder-responsibility-${index}`}
                      type="text"
                      placeholder="Ex: Validation des livrables"
                      value={stakeholder.responsibility || ''}
                      showCheckmark={!!stakeholder.responsibility}
                      onChange={(e) => updateStakeholder(index, 'responsibility', e.target.value)}
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stakeholder-contact-${index}`} className="text-xs font-medium">
                      Contact
                    </Label>
                    <ValidatedInput
                      id={`stakeholder-contact-${index}`}
                      type="text"
                      placeholder="Email ou téléphone"
                      value={stakeholder.contact || ''}
                      showCheckmark={!!stakeholder.contact}
                      onChange={(e) => updateStakeholder(index, 'contact', e.target.value)}
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FipAccordionSection>

      {/* Risques */}
      <FipAccordionSection
        id="risks"
        title="Risques"
        icon={<AlertTriangle className="w-5 h-5" />}
        count={formData.risks?.length || 0}
        completionPercentage={completions.risks}
      >
        <div className="flex items-center justify-between mb-3">
          <BodySmall className="text-gray-600">
            {formData.risks?.length || 0} risque{(formData.risks?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addRisk}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {formData.risks?.map((risk, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Caption className="font-semibold">Risque {index + 1}</Caption>
                {isEditable && (
                  <Button size="sm" variant="outline" onClick={() => removeRisk(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <textarea
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Description du risque"
                value={risk.description}
                onChange={(e) => updateRisk(index, 'description', e.target.value)}
                disabled={!isEditable}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="p-2 border border-gray-300 rounded-md"
                  value={risk.probability || 'medium'}
                  onChange={(e) => updateRisk(index, 'probability', e.target.value)}
                  disabled={!isEditable}
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
                <select
                  className="p-2 border border-gray-300 rounded-md"
                  value={risk.impact || 'medium'}
                  onChange={(e) => updateRisk(index, 'impact', e.target.value)}
                  disabled={!isEditable}
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Élevé</option>
                </select>
              </div>
              <textarea
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Mesures de mitigation"
                value={risk.mitigation || ''}
                onChange={(e) => updateRisk(index, 'mitigation', e.target.value)}
                disabled={!isEditable}
              />
            </div>
          ))}
        </div>
      </FipAccordionSection>

      {/* Opportunités */}
      <FipAccordionSection
        id="opportunities"
        title="Opportunités"
        icon={<Lightbulb className="w-5 h-5" />}
        count={formData.opportunities?.length || 0}
        completionPercentage={completions.opportunities}
      >
        <div className="flex items-center justify-between mb-3">
          <BodySmall className="text-gray-600">
            {formData.opportunities?.length || 0} opportunité{(formData.opportunities?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addOpportunity}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {formData.opportunities?.map((opportunity, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Caption className="font-semibold">Opportunité {index + 1}</Caption>
                {isEditable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeOpportunity(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <textarea
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Description de l'opportunité"
                value={opportunity.description}
                onChange={(e) =>
                  updateOpportunity(index, 'description', e.target.value)
                }
                disabled={!isEditable}
              />
              <textarea
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Potentiel"
                value={opportunity.potential || ''}
                onChange={(e) => updateOpportunity(index, 'potential', e.target.value)}
                disabled={!isEditable}
              />
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Plan d'action"
                value={opportunity.actionPlan || ''}
                onChange={(e) =>
                  updateOpportunity(index, 'actionPlan', e.target.value)
                }
                disabled={!isEditable}
              />
            </div>
          ))}
        </div>
      </FipAccordionSection>

      {/* Ressources */}
      <FipAccordionSection
        id="resources"
        title="Ressources"
        icon={<Briefcase className="w-5 h-5" />}
        count={formData.resources?.length || 0}
        completionPercentage={completions.resources}
      >
        <div className="flex items-center justify-between mb-3">
          <BodySmall className="text-gray-600">
            {formData.resources?.length || 0} ressource{(formData.resources?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addResource}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {formData.resources?.map((resource, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Caption className="font-semibold">Ressource {index + 1}</Caption>
                {isEditable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeResource(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="p-2 border border-gray-300 rounded-md"
                  value={resource.type}
                  onChange={(e) => updateResource(index, 'type', e.target.value)}
                  disabled={!isEditable}
                >
                  <option value="human">Humaine</option>
                  <option value="material">Matérielle</option>
                  <option value="financial">Financière</option>
                  <option value="technical">Technique</option>
                </select>
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Quantité"
                  value={resource.quantity || ''}
                  onChange={(e) => updateResource(index, 'quantity', e.target.value)}
                  disabled={!isEditable}
                />
                <textarea
                  className="col-span-2 p-2 border border-gray-300 rounded-md"
                  rows={2}
                  placeholder="Description"
                  value={resource.description}
                  onChange={(e) => updateResource(index, 'description', e.target.value)}
                  disabled={!isEditable}
                />
                <input
                  type="number"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Coût"
                  value={resource.cost || ''}
                  onChange={(e) =>
                    updateResource(index, 'cost', parseFloat(e.target.value))
                  }
                  disabled={!isEditable}
                />
              </div>
            </div>
          ))}
        </div>
      </FipAccordionSection>

      {/* Cibles de Performance */}
      <FipAccordionSection
        id="performance-targets"
        title="Cibles de Performance"
        icon={<TrendingUp className="w-5 h-5" />}
        count={formData.performanceTargets?.length || 0}
        completionPercentage={completions.performanceTargets}
      >
        <div className="flex items-center justify-between mb-3">
          <BodySmall className="text-gray-600">
            {formData.performanceTargets?.length || 0} cible{(formData.performanceTargets?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addPerformanceTarget}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {formData.performanceTargets?.map((target, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Caption className="font-semibold">Cible {index + 1}</Caption>
                {isEditable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removePerformanceTarget(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Indicateur"
                  value={target.indicator}
                  onChange={(e) =>
                    updatePerformanceTarget(index, 'indicator', e.target.value)
                  }
                  disabled={!isEditable}
                />
                <input
                  type="number"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Cible"
                  value={target.target || ''}
                  onChange={(e) =>
                    updatePerformanceTarget(index, 'target', parseFloat(e.target.value))
                  }
                  disabled={!isEditable}
                />
                <input
                  type="date"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Échéance"
                  value={target.deadline || ''}
                  onChange={(e) =>
                    updatePerformanceTarget(index, 'deadline', e.target.value)
                  }
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Responsable"
                  value={target.responsible || ''}
                  onChange={(e) =>
                    updatePerformanceTarget(index, 'responsible', e.target.value)
                  }
                  disabled={!isEditable}
                />
              </div>
            </div>
          ))}
        </div>
      </FipAccordionSection>

      {/* Save Button - Sticky Footer */}
      {isEditable && (
        <div className="sticky bottom-0 -mx-8 -mb-8 mt-8 border-t bg-white px-8 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Modifications en cours</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-gray-300"
              >
                Annuler les modifications
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-orange-600 hover:bg-orange-700 px-6"
                size="default"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer la FIP
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* SIPOC Element Edit Modal */}
      {elementToEdit && (
        <SipocElementEditModal
          element={elementToEdit}
          isOpen={!!elementToEdit}
          onClose={() => setElementToEdit(null)}
          processId={processId}
        />
      )}

      {/* SIPOC Element Delete Modal */}
      {elementToDelete && (
        <SipocElementDeleteModal
          element={elementToDelete}
          isOpen={!!elementToEdit}
          onClose={() => setElementToDelete(null)}
          processId={processId}
        />
      )}
    </div>
  );
};

