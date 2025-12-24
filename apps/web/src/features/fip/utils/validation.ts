import {
  FipIndicator,
  FipStakeholder,
  FipRisk,
  FipOpportunity,
  FipResource,
  FipPerformanceTarget,
  UpdateFipDto,
} from '../types/fip.types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Valide un email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un indicateur
 */
function validateIndicator(indicator: FipIndicator, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!indicator.name || indicator.name.trim().length === 0) {
    errors.push({
      field: `indicators[${index}].name`,
      message: 'Le nom de l\'indicateur est requis',
    });
  }

  if (indicator.targetValue !== undefined && indicator.targetValue < 0) {
    errors.push({
      field: `indicators[${index}].targetValue`,
      message: 'La valeur cible doit être positive',
    });
  }

  if (indicator.currentValue !== undefined && indicator.currentValue < 0) {
    errors.push({
      field: `indicators[${index}].currentValue`,
      message: 'La valeur actuelle doit être positive',
    });
  }

  return errors;
}

/**
 * Valide un acteur
 */
function validateStakeholder(stakeholder: FipStakeholder, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!stakeholder.name || stakeholder.name.trim().length === 0) {
    errors.push({
      field: `stakeholders[${index}].name`,
      message: 'Le nom de l\'acteur est requis',
    });
  }

  if (!stakeholder.role || stakeholder.role.trim().length === 0) {
    errors.push({
      field: `stakeholders[${index}].role`,
      message: 'Le rôle de l\'acteur est requis',
    });
  }

  if (stakeholder.contact && !isValidEmail(stakeholder.contact) && !stakeholder.contact.match(/^\+?[\d\s-()]+$/)) {
    errors.push({
      field: `stakeholders[${index}].contact`,
      message: 'Le contact doit être un email valide ou un numéro de téléphone',
    });
  }

  return errors;
}

/**
 * Valide un risque
 */
function validateRisk(risk: FipRisk, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!risk.description || risk.description.trim().length === 0) {
    errors.push({
      field: `risks[${index}].description`,
      message: 'La description du risque est requise',
    });
  }

  return errors;
}

/**
 * Valide une opportunité
 */
function validateOpportunity(opportunity: FipOpportunity, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!opportunity.description || opportunity.description.trim().length === 0) {
    errors.push({
      field: `opportunities[${index}].description`,
      message: 'La description de l\'opportunité est requise',
    });
  }

  return errors;
}

/**
 * Valide une ressource
 */
function validateResource(resource: FipResource, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!resource.description || resource.description.trim().length === 0) {
    errors.push({
      field: `resources[${index}].description`,
      message: 'La description de la ressource est requise',
    });
  }

  if (resource.cost !== undefined && resource.cost < 0) {
    errors.push({
      field: `resources[${index}].cost`,
      message: 'Le coût doit être positif',
    });
  }

  return errors;
}

/**
 * Valide une cible de performance
 */
function validatePerformanceTarget(target: FipPerformanceTarget, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!target.indicator || target.indicator.trim().length === 0) {
    errors.push({
      field: `performanceTargets[${index}].indicator`,
      message: 'L\'indicateur est requis',
    });
  }

  if (target.target === undefined || target.target === null || target.target < 0) {
    errors.push({
      field: `performanceTargets[${index}].target`,
      message: 'La cible doit être un nombre positif',
    });
  }

  if (target.deadline) {
    const deadlineDate = new Date(target.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push({
        field: `performanceTargets[${index}].deadline`,
        message: 'La date d\'échéance doit être valide',
      });
    }
  }

  return errors;
}

/**
 * Valide les données complètes de la FIP
 */
export function validateFipData(data: UpdateFipDto): ValidationResult {
  const errors: ValidationError[] = [];

  // Valider les indicateurs
  if (data.indicators) {
    data.indicators.forEach((indicator, index) => {
      errors.push(...validateIndicator(indicator, index));
    });
  }

  // Valider les acteurs
  if (data.stakeholders) {
    data.stakeholders.forEach((stakeholder, index) => {
      errors.push(...validateStakeholder(stakeholder, index));
    });
  }

  // Valider les risques
  if (data.risks) {
    data.risks.forEach((risk, index) => {
      errors.push(...validateRisk(risk, index));
    });
  }

  // Valider les opportunités
  if (data.opportunities) {
    data.opportunities.forEach((opportunity, index) => {
      errors.push(...validateOpportunity(opportunity, index));
    });
  }

  // Valider les ressources
  if (data.resources) {
    data.resources.forEach((resource, index) => {
      errors.push(...validateResource(resource, index));
    });
  }

  // Valider les cibles de performance
  if (data.performanceTargets) {
    data.performanceTargets.forEach((target, index) => {
      errors.push(...validatePerformanceTarget(target, index));
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide un champ spécifique
 */
export function validateField(field: string, value: any): ValidationError | null {
  // Validation des emails
  if (field.includes('contact') && value && typeof value === 'string') {
    if (!isValidEmail(value) && !value.match(/^\+?[\d\s-()]+$/)) {
      return {
        field,
        message: 'Le contact doit être un email valide ou un numéro de téléphone',
      };
    }
  }

  // Validation des nombres positifs
  if (typeof value === 'number' && value < 0) {
    return {
      field,
      message: 'La valeur doit être positive',
    };
  }

  // Validation des dates
  if (field.includes('deadline') && value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        field,
        message: 'La date doit être valide',
      };
    }
  }

  return null;
}

/**
 * Obtient le message d'erreur pour un champ spécifique
 */
export function getFieldError(field: string, errors: ValidationError[]): string | undefined {
  const error = errors.find((e) => e.field === field);
  return error?.message;
}

