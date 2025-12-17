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
}

export interface GeneratedProcessStructure {
  title: string;
  description: string;
  procedures: Array<{
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
  events?: Array<{
    type: 'startEvent' | 'endEvent' | 'intermediateEvent';
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
    type: 'exclusiveGateway' | 'parallelGateway' | 'inclusiveGateway';
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
}

