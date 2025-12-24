import React, { useState, useEffect, useMemo } from 'react';
import { Button, Heading2, BodySmall, Caption } from '@repo/ui';
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
import { Plus, Trash2, Save, Target, MapPin, BarChart3, Users, AlertTriangle, Lightbulb, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { FipAccordionSection } from './FipAccordionSection';
import { calculateFipSectionCompletions } from '../utils/fipHelpers';
import { validateFipData, getFieldError, validateField, ValidationError } from '../utils/validation';

interface FipFormProps {
  fip: ProcessIdentityCard | null;
  onSave: (data: UpdateFipDto) => Promise<void>;
  isSaving?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: UpdateFipDto) => void;
}

export const FipForm: React.FC<FipFormProps> = ({
  fip,
  onSave,
  isSaving = false,
  isEditable = true,
  onDataChange,
}) => {
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
    <div className="space-y-4">
      {/* Objectifs */}
      <FipAccordionSection
        id="objectives"
        title="Objectifs"
        icon={<Target className="w-5 h-5" />}
        completionPercentage={completions.objectives}
        defaultExpanded={true}
      >
        <textarea
          className={getFieldClasses('objectives', 'w-full p-3 rounded-md focus:ring-2')}
          rows={4}
          value={formData.objectives || ''}
          onChange={(e) => {
            setFormData({ ...formData, objectives: e.target.value });
            markFieldTouched('objectives');
          }}
          onBlur={() => markFieldTouched('objectives')}
          disabled={!isEditable}
          placeholder="Décrivez les objectifs du processus..."
        />
        {getError('objectives') && (
          <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{getError('objectives')}</span>
          </div>
        )}
      </FipAccordionSection>

      {/* Périmètre */}
      <FipAccordionSection
        id="scope"
        title="Périmètre"
        icon={<MapPin className="w-5 h-5" />}
        completionPercentage={completions.scope}
      >
        <textarea
          className={getFieldClasses('scope', 'w-full p-3 rounded-md focus:ring-2')}
          rows={3}
          value={formData.scope || ''}
          onChange={(e) => {
            setFormData({ ...formData, scope: e.target.value });
            markFieldTouched('scope');
          }}
          onBlur={() => markFieldTouched('scope')}
          disabled={!isEditable}
          placeholder="Définissez le périmètre d'application..."
        />
        {getError('scope') && (
          <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{getError('scope')}</span>
          </div>
        )}
      </FipAccordionSection>

      {/* Indicateurs */}
      <FipAccordionSection
        id="indicators"
        title="Indicateurs de Performance"
        icon={<BarChart3 className="w-5 h-5" />}
        count={formData.indicators?.length || 0}
        completionPercentage={completions.indicators}
      >
        <div className="flex items-center justify-between mb-3">
          <BodySmall className="text-gray-600">
            {formData.indicators?.length || 0} indicateur{(formData.indicators?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addIndicator}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {formData.indicators?.map((indicator, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Caption className="font-semibold">Indicateur {index + 1}</Caption>
                {isEditable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeIndicator(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    className={getFieldClasses(`indicators[${index}].name`)}
                    placeholder="Nom de l'indicateur"
                    value={indicator.name}
                    onChange={(e) => {
                      updateIndicator(index, 'name', e.target.value);
                      markFieldTouched(`indicators[${index}].name`);
                    }}
                    onBlur={() => markFieldTouched(`indicators[${index}].name`)}
                    disabled={!isEditable}
                  />
                  {getError(`indicators[${index}].name`) && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{getError(`indicators[${index}].name`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    className={getFieldClasses(`indicators[${index}].unit`)}
                    placeholder="Unité"
                    value={indicator.unit || ''}
                    onChange={(e) => {
                      updateIndicator(index, 'unit', e.target.value);
                      markFieldTouched(`indicators[${index}].unit`);
                    }}
                    onBlur={() => markFieldTouched(`indicators[${index}].unit`)}
                    disabled={!isEditable}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className={getFieldClasses(`indicators[${index}].targetValue`)}
                    placeholder="Valeur cible"
                    value={indicator.targetValue || ''}
                    onChange={(e) => {
                      updateIndicator(index, 'targetValue', parseFloat(e.target.value) || 0);
                      markFieldTouched(`indicators[${index}].targetValue`);
                    }}
                    onBlur={() => markFieldTouched(`indicators[${index}].targetValue`)}
                    disabled={!isEditable}
                  />
                  {getError(`indicators[${index}].targetValue`) && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{getError(`indicators[${index}].targetValue`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    className={getFieldClasses(`indicators[${index}].currentValue`)}
                    placeholder="Valeur actuelle"
                    value={indicator.currentValue || ''}
                    onChange={(e) => {
                      updateIndicator(index, 'currentValue', parseFloat(e.target.value) || 0);
                      markFieldTouched(`indicators[${index}].currentValue`);
                    }}
                    onBlur={() => markFieldTouched(`indicators[${index}].currentValue`)}
                    disabled={!isEditable}
                  />
                  {getError(`indicators[${index}].currentValue`) && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{getError(`indicators[${index}].currentValue`)}</span>
                    </div>
                  )}
                </div>
                <select
                  className="p-2 border border-gray-300 rounded-md"
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
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Responsable"
                  value={indicator.responsible || ''}
                  onChange={(e) => updateIndicator(index, 'responsible', e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <textarea
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Description"
                value={indicator.description || ''}
                onChange={(e) => updateIndicator(index, 'description', e.target.value)}
                disabled={!isEditable}
              />
            </div>
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
        <div className="flex items-center justify-between mb-3">
          <BodySmall className="text-gray-600">
            {formData.stakeholders?.length || 0} acteur{(formData.stakeholders?.length || 0) !== 1 ? 's' : ''}
          </BodySmall>
          {isEditable && (
            <Button size="sm" onClick={addStakeholder}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {formData.stakeholders?.map((stakeholder, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Caption className="font-semibold">Acteur {index + 1}</Caption>
                {isEditable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeStakeholder(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Nom"
                  value={stakeholder.name}
                  onChange={(e) => updateStakeholder(index, 'name', e.target.value)}
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Rôle"
                  value={stakeholder.role}
                  onChange={(e) => updateStakeholder(index, 'role', e.target.value)}
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Responsabilité"
                  value={stakeholder.responsibility || ''}
                  onChange={(e) =>
                    updateStakeholder(index, 'responsibility', e.target.value)
                  }
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md"
                  placeholder="Contact"
                  value={stakeholder.contact || ''}
                  onChange={(e) => updateStakeholder(index, 'contact', e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            </div>
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

      {/* Save Button */}
      {isEditable && (
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      )}
    </div>
  );
};

