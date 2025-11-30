import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SipocDiagram } from '../entities/sipoc.entity';

@Injectable()
export class SipocDiagramRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    createdBy?: string;
    processId?: string;
  }): Promise<SipocDiagram[]> {
    return this.prisma.sipocDiagram.findMany({
      where: {
        ...(filters?.createdBy && { createdBy: filters.createdBy }),
        ...(filters?.processId && { processId: filters.processId }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findById(sipoc_id: string): Promise<SipocDiagram | null> {
    return this.prisma.sipocDiagram.findUnique({
      where: { sipoc_id },
      include: {
        elements: {
          orderBy: { position: 'asc' },
        },
        connections: true,
        tags: {
          include: {
            tag: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    process_owner?: string;
    department?: string;
    is_template?: boolean;
    createdBy: string;
    processId?: string;
  }): Promise<SipocDiagram> {
    return this.prisma.sipocDiagram.create({
      data: {
        title: data.title,
        description: data.description,
        process_owner: data.process_owner,
        department: data.department,
        is_template: data.is_template || false,
        createdBy: data.createdBy,
        processId: data.processId,
      },
    });
  }

  async update(
    sipoc_id: string,
    data: {
      title?: string;
      description?: string;
      process_owner?: string;
      department?: string;
      status?: string;
      is_template?: boolean;
      processId?: string;
    },
  ): Promise<SipocDiagram> {
    return this.prisma.sipocDiagram.update({
      where: { sipoc_id },
      data,
    });
  }

  async delete(sipoc_id: string): Promise<SipocDiagram> {
    return this.prisma.sipocDiagram.delete({
      where: { sipoc_id },
    });
  }

  async findByProcessId(processId: string): Promise<SipocDiagram> {
    return this.prisma.sipocDiagram.findFirst({
      where: { processId },
      include: {
        elements: {
          orderBy: { position: 'asc' },
        },
        connections: true,
      },
    });
  }

  async findByIds(sipocIds: string[]): Promise<Array<{ sipoc_id: string; title: string }>> {
    return this.prisma.sipocDiagram.findMany({
      where: {
        sipoc_id: {
          in: sipocIds,
        },
      },
      select: {
        sipoc_id: true,
        title: true,
      },
    });
  }
}
