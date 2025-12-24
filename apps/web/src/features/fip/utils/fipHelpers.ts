import {
  FipIndicator,
  FipStakeholder,
  FipRisk,
  FipOpportunity,
  FipResource,
  FipPerformanceTarget,
  UpdateFipDto,
} from '../types/fip.types';

/**
 * Calcule le pourcentage de complétude d'un champ texte
 */
function calculateTextCompletion(text?: string): number {
  if (!text || text.trim().length === 0) return 0;
  return 100;
}

/**
 * Calcule le pourcentage de complétude d'un indicateur
 */
function calculateIndicatorCompletion(indicator: FipIndicator): number {
  let filledFields = 0;
  const totalFields = 6; // name, description, unit, targetValue, currentValue, frequency, responsible

  if (indicator.name?.trim()) filledFields++;
  if (indicator.description?.trim()) filledFields++;
  if (indicator.unit?.trim()) filledFields++;
  if (indicator.targetValue !== undefined && indicator.targetValue !== null) filledFields++;
  if (indicator.currentValue !== undefined && indicator.currentValue !== null) filledFields++;
  if (indicator.frequency) filledFields++;
  if (indicator.responsible?.trim()) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calcule le pourcentage de complétude d'un acteur
 */
function calculateStakeholderCompletion(stakeholder: FipStakeholder): number {
  let filledFields = 0;
  const totalFields = 4; // name, role, responsibility, contact

  if (stakeholder.name?.trim()) filledFields++;
  if (stakeholder.role?.trim()) filledFields++;
  if (stakeholder.responsibility?.trim()) filledFields++;
  if (stakeholder.contact?.trim()) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calcule le pourcentage de complétude d'un risque
 */
function calculateRiskCompletion(risk: FipRisk): number {
  let filledFields = 0;
  const totalFields = 4; // description, probability, impact, mitigation

  if (risk.description?.trim()) filledFields++;
  if (risk.probability) filledFields++;
  if (risk.impact) filledFields++;
  if (risk.mitigation?.trim()) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calcule le pourcentage de complétude d'une opportunité
 */
function calculateOpportunityCompletion(opportunity: FipOpportunity): number {
  let filledFields = 0;
  const totalFields = 3; // description, potential, actionPlan

  if (opportunity.description?.trim()) filledFields++;
  if (opportunity.potential?.trim()) filledFields++;
  if (opportunity.actionPlan?.trim()) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calcule le pourcentage de complétude d'une ressource
 */
function calculateResourceCompletion(resource: FipResource): number {
  let filledFields = 0;
  const totalFields = 4; // type, description, quantity, cost

  if (resource.type) filledFields++;
  if (resource.description?.trim()) filledFields++;
  if (resource.quantity?.trim()) filledFields++;
  if (resource.cost !== undefined && resource.cost !== null) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calcule le pourcentage de complétude d'une cible de performance
 */
function calculatePerformanceTargetCompletion(target: FipPerformanceTarget): number {
  let filledFields = 0;
  const totalFields = 4; // indicator, target, deadline, responsible

  if (target.indicator?.trim()) filledFields++;
  if (target.target !== undefined && target.target !== null) filledFields++;
  if (target.deadline?.trim()) filledFields++;
  if (target.responsible?.trim()) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calcule le pourcentage de complétude moyen d'une section de liste
 */
function calculateListSectionCompletion<T>(
  items: T[] | undefined,
  calculateItemCompletion: (item: T) => number
): number {
  if (!items || items.length === 0) return 0;

  const totalCompletion = items.reduce((sum, item) => sum + calculateItemCompletion(item), 0);
  return Math.round(totalCompletion / items.length);
}

/**
 * Calcule le pourcentage de complétude de chaque section de la FIP
 */
export function calculateFipSectionCompletions(formData: UpdateFipDto) {
  return {
    objectives: calculateTextCompletion(formData.objectives),
    scope: calculateTextCompletion(formData.scope),
    indicators: calculateListSectionCompletion(
      formData.indicators,
      calculateIndicatorCompletion
    ),
    stakeholders: calculateListSectionCompletion(
      formData.stakeholders,
      calculateStakeholderCompletion
    ),
    risks: calculateListSectionCompletion(formData.risks, calculateRiskCompletion),
    opportunities: calculateListSectionCompletion(
      formData.opportunities,
      calculateOpportunityCompletion
    ),
    resources: calculateListSectionCompletion(
      formData.resources,
      calculateResourceCompletion
    ),
    performanceTargets: calculateListSectionCompletion(
      formData.performanceTargets,
      calculatePerformanceTargetCompletion
    ),
  };
}

/**
 * Calcule le pourcentage de complétude global de la FIP
 */
export function calculateFipOverallCompletion(formData: UpdateFipDto): number {
  const completions = calculateFipSectionCompletions(formData);
  const sections = [
    completions.objectives,
    completions.scope,
    completions.indicators,
    completions.stakeholders,
    completions.risks,
    completions.opportunities,
    completions.resources,
    completions.performanceTargets,
  ];

  const total = sections.reduce((sum, completion) => sum + completion, 0);
  return Math.round(total / sections.length);
}

