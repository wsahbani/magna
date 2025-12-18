import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  ProcedureEntity,
  ProcedureWithRelations,
} from '../entities/procedure.entity';
import { ProcedureStatus } from '@prisma/client';

@Injectable()
export class ProcedureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProcedureEntity | null> {
    return this.prisma.procedure.findUnique({
      where: { id },
    });
  }

  async findByIdWithRelations(
    id: string,
  ): Promise<ProcedureWithRelations | null> {
    return this.prisma.procedure.findUnique({
      where: { id },
      include: {
        process: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        flowDiagram: {
          include: {
            nodes: {
              orderBy: { createdAt: 'asc' },
            },
            edges: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            documents: true,
            means: true,
            tags: true,
          },
        },
      },
    }) as Promise<ProcedureWithRelations | null>;
  }

  async findByProcessId(processId: string, where?: any): Promise<ProcedureEntity[]> {
    const whereClause = where ? { ...where, processId } : { processId };
    return this.prisma.procedure.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        process: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        _count: {
          select: {
            comments: true,
            documents: true,
            means: true,
            tags: true,
          },
        },
      },
    });
  }

  async findAll(where?: any): Promise<ProcedureEntity[]> {
    return this.prisma.procedure.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        process: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        _count: {
          select: {
            comments: true,
            documents: true,
            means: true,
            tags: true,
          },
        },
      },
    });
  }

  async create(data: {
    processId: string;
    title: string;
    code: string;
    workspaceId: string;
    departmentId?: string;
    description?: string;
    objective?: string;
    scope?: string;
    createdById: string; // Required in schema
  }): Promise<ProcedureEntity> {
    return this.prisma.procedure.create({
      data: {
        ...data,
        status: ProcedureStatus.DRAFT,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      code?: string;
      description?: string;
      objective?: string;
      scope?: string;
      status?: ProcedureStatus;
      validatedBy?: string;
      validatedAt?: Date;
      effectiveDate?: Date;
      expirationDate?: Date;
    },
  ): Promise<ProcedureEntity> {
    return this.prisma.procedure.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ProcedureEntity> {
    return this.prisma.procedure.delete({
      where: { id },
    });
  }

  // FlowNodes (using FlowDiagram)
  async findNodeByProcedureAndNodeId(
    procedureId: string,
    nodeId: string,
  ): Promise<any> {
    const flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        procedureId,
        level: 3,
      },
    });

    if (!flowDiagram) {
      return null;
    }

    return this.prisma.flowNode.findFirst({
      where: {
        diagramId: flowDiagram.id,
        rfId: nodeId,
      },
    });
  }

  async findEdgeByProcedureAndEdgeId(
    procedureId: string,
    edgeId: string,
  ): Promise<any> {
    const flowDiagram = await this.prisma.flowDiagram.findFirst({
      where: {
        procedureId,
        level: 3,
      },
    });

    if (!flowDiagram) {
      return null;
    }

    return this.prisma.flowEdge.findFirst({
      where: {
        diagramId: flowDiagram.id,
        rfId: edgeId,
      },
    });
  }
}

