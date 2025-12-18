/**
 * AI API Client
 * Client pour les appels API IA
 */

import { get, post, apiClient } from '../base-api';

export interface GenerateProcessMapRequest {
  description: string;
  workspaceId: string;
  departmentId?: string;
  title?: string;
}

export interface GeneratedProcessMapStructure {
  title: string;
  description: string;
  groups: Array<{
    name: string;
    description: string;
    processes: Array<{
      type: 'mainProcess' | 'supportProcess' | 'managementProcess';
      label: string;
      description: string;
    }>;
  }>;
}

export interface GenerateProcessMapResponse {
  structure: GeneratedProcessMapStructure;
  estimatedCost: number;
  cached: boolean;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
}

/**
 * Génère une carte de processus à partir d'une description
 */
export async function generateProcessMap(
  request: GenerateProcessMapRequest,
): Promise<GenerateProcessMapResponse> {
  return post<GenerateProcessMapResponse>('/ai/process-map/generate', request);
}

/**
 * Crée une ProcessMap complète à partir d'une structure générée par IA
 */
export async function createProcessMapFromAI(
  structure: GeneratedProcessMapStructure,
  workspaceId: string,
  departmentId?: string,
  code?: string,
): Promise<any> {
  return post<any>('/ai/process-map/create', {
    structure,
    workspaceId,
    departmentId,
    code,
  });
}

/**
 * Récupère les statistiques du cache IA
 */
export async function getAICacheStats(): Promise<{ size: number; maxSize: number }> {
  return get<{ size: number; maxSize: number }>('/ai/cache/stats');
}

export interface ExtractProcessMapFromImageRequest {
  image: File;
  processMapId: string;
  replaceExisting?: boolean;
  description?: string;
}

export interface ExtractProcessMapFromImageResponse {
  success: boolean;
  message: string;
  data: {
    structure: GeneratedProcessMapStructure;
    nodesCreated: number;
    groupsCreated: number;
    processesCreated: number;
  };
}

/**
 * Extrait une ProcessMap depuis une image avec IA vision
 */
export async function extractProcessMapFromImage(
  request: ExtractProcessMapFromImageRequest,
): Promise<ExtractProcessMapFromImageResponse> {
  const formData = new FormData();
  formData.append('image', request.image);
  formData.append('processMapId', request.processMapId);
  if (request.replaceExisting !== undefined) {
    formData.append('replaceExisting', request.replaceExisting.toString());
  }
  if (request.description) {
    formData.append('description', request.description);
  }

  // Utiliser l'API client avec FormData
  const response = await apiClient.post<ExtractProcessMapFromImageResponse>(
    '/ai/process-map/extract-from-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

// ==================== Process (Level 2) AI ====================

export interface GenerateProcessRequest {
  description: string;
  processMapId: string;
  workspaceId?: string;
  departmentId?: string;
  flowDirection?: 'horizontal' | 'vertical';
}

export interface GeneratedProcessStructure {
  title: string;
  description: string;
  procedures: Array<{
    id?: string;
    label: string;
    description: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  tasks?: Array<{
    id?: string;
    type: 'task' | 'userTask' | 'serviceTask' | 'manualTask' | 'scriptTask';
    label: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  events?: Array<{
    id?: string;
    type: 'startEvent' | 'endEvent' | 'intermediateEvent' | 'timerEvent' | 'messageEvent';
    label: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  gateways?: Array<{
    id?: string;
    type: 'exclusiveGateway' | 'parallelGateway' | 'inclusiveGateway' | 'eventBasedGateway';
    label?: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  edges?: Array<{
    source: string;
    target: string;
    label?: string;
    type?: string;
  }>;
}

export interface GenerateProcessResponse {
  structure: GeneratedProcessStructure;
  estimatedCost: number;
  cached: boolean;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface CreateProcessFromAIRequest {
  structure: GeneratedProcessStructure;
  processMapId: string;
  workspaceId?: string;
  departmentId?: string;
  code?: string;
  flowDirection?: 'horizontal' | 'vertical';
}

export interface ExtractProcessFromImageRequest {
  image: File;
  processId: string;
  replaceExisting?: boolean;
  description?: string;
}

export interface ExtractProcessFromImageResponse {
  success: boolean;
  message: string;
  data: {
    structure: GeneratedProcessStructure;
    nodesCreated: number;
    proceduresCreated: number;
    tasksCreated: number;
    eventsCreated: number;
    gatewaysCreated: number;
  };
}

/**
 * Génère un processus à partir d'une description
 */
export async function generateProcess(
  request: GenerateProcessRequest,
): Promise<GenerateProcessResponse> {
  return post<GenerateProcessResponse>('/ai/process/generate', request);
}

/**
 * Crée un Process complet à partir d'une structure générée par IA
 */
export async function createProcessFromAI(
  request: CreateProcessFromAIRequest,
): Promise<any> {
  return post<any>('/ai/process/create', request);
}

/**
 * Extrait un Process depuis une image avec IA vision
 */
export async function extractProcessFromImage(
  request: ExtractProcessFromImageRequest,
): Promise<ExtractProcessFromImageResponse> {
  const formData = new FormData();
  formData.append('image', request.image);
  formData.append('processId', request.processId);
  if (request.replaceExisting !== undefined) {
    formData.append('replaceExisting', request.replaceExisting.toString());
  }
  if (request.description) {
    formData.append('description', request.description);
  }

  const response = await apiClient.post<ExtractProcessFromImageResponse>(
    '/ai/process/extract-from-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

// ==================== Procedure (Level 3) AI ====================

export interface GenerateProcedureRequest {
  description: string;
  processId: string;
  workspaceId?: string;
  departmentId?: string;
}

export interface GeneratedProcedureStructure {
  title: string;
  description: string;
  startEvents?: Array<{
    type: 'startEvent' | 'timerStartEvent' | 'messageStartEvent' | 'signalStartEvent' | 'errorStartEvent';
    label: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  endEvents?: Array<{
    type: 'endEvent' | 'messageEndEvent' | 'errorEndEvent' | 'cancelEndEvent' | 'terminateEndEvent';
    label: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  intermediateEvents?: Array<{
    type: 'intermediateEvent' | 'timerEvent' | 'messageEvent' | 'signalEvent' | 'errorEvent';
    label: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  tasks?: Array<{
    type: 'task' | 'userTask' | 'serviceTask' | 'manualTask' | 'scriptTask';
    label: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
  gateways?: Array<{
    type: 'exclusiveGateway' | 'parallelGateway' | 'inclusiveGateway' | 'eventBasedGateway';
    label?: string;
    description?: string;
    position?: { x: number; y: number };
    dimensions?: { width: number; height: number };
  }>;
}

export interface GenerateProcedureResponse {
  structure: GeneratedProcedureStructure;
  estimatedCost: number;
  cached: boolean;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface CreateProcedureFromAIRequest {
  structure: GeneratedProcedureStructure;
  processId: string;
  workspaceId?: string;
  departmentId?: string;
  code?: string;
}

export interface ExtractProcedureFromImageRequest {
  image: File;
  procedureId: string;
  replaceExisting?: boolean;
  description?: string;
}

export interface ExtractProcedureFromImageResponse {
  success: boolean;
  message: string;
  data: {
    structure: GeneratedProcedureStructure;
    nodesCreated: number;
    startEventsCreated: number;
    endEventsCreated: number;
    intermediateEventsCreated: number;
    tasksCreated: number;
    gatewaysCreated: number;
  };
}

/**
 * Génère une procédure à partir d'une description
 */
export async function generateProcedure(
  request: GenerateProcedureRequest,
): Promise<GenerateProcedureResponse> {
  return post<GenerateProcedureResponse>('/ai/procedure/generate', request);
}

/**
 * Crée une Procedure complète à partir d'une structure générée par IA
 */
export async function createProcedureFromAI(
  request: CreateProcedureFromAIRequest,
): Promise<any> {
  return post<any>('/ai/procedure/create', request);
}

/**
 * Extrait une Procedure depuis une image avec IA vision
 */
export async function extractProcedureFromImage(
  request: ExtractProcedureFromImageRequest,
): Promise<ExtractProcedureFromImageResponse> {
  const formData = new FormData();
  formData.append('image', request.image);
  formData.append('procedureId', request.procedureId);
  if (request.replaceExisting !== undefined) {
    formData.append('replaceExisting', request.replaceExisting.toString());
  }
  if (request.description) {
    formData.append('description', request.description);
  }

  const response = await apiClient.post<ExtractProcedureFromImageResponse>(
    '/ai/procedure/extract-from-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

