import { Procedure, FlowNode, FlowEdge } from '@prisma/client';

export type ProcedureEntity = Procedure;

export type ProcedureWithRelations = Procedure & {
  process?: {
    id: string;
    title: string;
    code: string;
  };
  flowDiagram?: {
    id: string;
    level: number;
    nodes?: FlowNode[];
    edges?: FlowEdge[];
  };
  _count?: {
    comments: number;
    documents: number;
    means: number;
    tags: number;
  };
};

