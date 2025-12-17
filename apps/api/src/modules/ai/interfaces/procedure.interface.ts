/**
 * Procedure AI Service Interfaces
 * Définit les interfaces pour les services IA de Procedure (niveau 3)
 */

export interface ProcedureContext {
  processId: string;
  processName?: string;
  workspaceId: string;
  workspaceName?: string;
  departmentId?: string;
  departmentName?: string;
  existingProcedureIds?: string[];
}

export interface GeneratedProcedureStructure {
  title: string;
  description: string;
  startEvents?: Array<{
    type: 'startEvent' | 'timerStartEvent' | 'messageStartEvent' | 'signalStartEvent' | 'errorStartEvent';
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
  endEvents?: Array<{
    type: 'endEvent' | 'messageEndEvent' | 'errorEndEvent' | 'cancelEndEvent' | 'terminateEndEvent';
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
  intermediateEvents?: Array<{
    type: 'intermediateEvent' | 'timerEvent' | 'messageEvent' | 'signalEvent' | 'errorEvent';
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
  tasks?: Array<{
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
  gateways?: Array<{
    type: 'exclusiveGateway' | 'parallelGateway' | 'inclusiveGateway' | 'eventBasedGateway';
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

