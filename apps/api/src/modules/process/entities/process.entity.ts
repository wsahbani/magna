import { Process, ProcessStatus, ProcessType, ProcessPriority, ConfidentialityLevel } from '@prisma/client';

export type ProcessEntity = Process;

export interface ProcessWithRelations extends ProcessEntity {
  parent?: {
    id: string;
    name: string;
    type: ProcessType;
  };
  children?: {
    id: string;
    name: string;
    type: ProcessType;
    level: number;
  }[];
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
  };
  versions?: any[];
  currentDraft?: any;
  currentPublished?: any;
  _count?: {
    comments: number;
    assignments: number;
    versions: number;
    children?: number;
  };
}