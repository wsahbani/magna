import { Process, ProcessStatus, ProcessType, ProcessPriority, ConfidentialityLevel } from '@prisma/client';

export type ProcessEntity = Process;

export interface ProcessWithRelations extends ProcessEntity {
  processMap?: {
    id: string;
    title: string;
    code: string;
  };
  procedures?: {
    id: string;
    title: string;
    code: string;
    status: string;
  }[];
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
  };
  flowDiagram?: {
    id: string;
    level: number;
    nodes?: { id: string }[];
    edges?: { id: string }[];
  };
  _count?: {
    procedures: number;
    comments: number;
    assignments: number;
    actors: number;
    processIOs: number;
    processIndicators: number;
    processRisks: number;
  };
}