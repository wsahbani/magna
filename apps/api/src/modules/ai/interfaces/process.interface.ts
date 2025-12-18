/**
 * Process AI Service Interfaces
 * Définit les interfaces pour les services IA de Process (niveau 2)
 */

export interface ProcessContext {
  processMapId: string;
  processMapName?: string;
  workspaceId: string;
  workspaceName?: string;
  departmentId?: string;
  departmentName?: string;
  existingProcessIds?: string[];
  flowDirection?: 'horizontal' | 'vertical';
}

export interface GeneratedProcessStructure {
  title: string;
  description: string;
  procedures: Array<{
    id?: string;
    label: string;
    description: string;
    position?: {
      x: number;
      y: number;
    };
    dimensions?: {
      width: number;
      height: number;
    };
  }>;
  tasks?: Array<{
    id?: string;
    type: 'task' | 'userTask' | 'serviceTask' | 'manualTask' | 'scriptTask';
    label: string;
    description?: string;
    position?: {
      x: number;
      y: number;
    };
    dimensions?: {
      width: number;
      height: number;
    };
  }>;
  events?: Array<{
    id?: string;
    type: 'startEvent' | 'endEvent' | 'intermediateEvent' | 'timerEvent' | 'messageEvent';
    label: string;
    description?: string;
    position?: {
      x: number;
      y: number;
    };
    dimensions?: {
      width: number;
      height: number;
    };
  }>;
  gateways?: Array<{
    id?: string;
    type: 'gateway' | 'exclusiveGateway' | 'parallelGateway' | 'inclusiveGateway' | 'eventBasedGateway';
    label?: string;
    description?: string;
    position?: {
      x: number;
      y: number;
    };
    dimensions?: {
      width: number;
      height: number;
    };
  }>;
  edges?: Array<{
    source: string;
    target: string;
    label?: string;
    type?: string;
  }>;
}

