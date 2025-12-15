/**
 * AI Service Interfaces
 * Définit les interfaces pour les services IA
 */

export interface AIGenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIGenerateResponse {
  content: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  cached?: boolean;
}

export interface ProcessMapContext {
  workspaceId: string;
  workspaceName?: string;
  departmentId?: string;
  departmentName?: string;
  existingProcessMaps?: Array<{
    title: string;
    description?: string;
  }>;
}

export interface GeneratedProcessMapStructure {
  title: string;
  description: string;
  groups: Array<{
    name: string;
    description: string;
    position?: {
      x: number;
      y: number;
    };
    dimensions?: {
      width: number;
      height: number;
    };
    processes: Array<{
      type: 'mainProcess' | 'supportProcess' | 'managementProcess';
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
  }>;
}

