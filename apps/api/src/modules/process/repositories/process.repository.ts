import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessEntity, ProcessWithRelations } from '../entities/process.entity';
import { ProcessQueryDto } from '../dto/process-query.dto';
import { PaginatedResponse } from '../../../common/dto/pagination.dto';
import { ProcessStatus } from '@prisma/client';

@Injectable()
export class ProcessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ProcessEntity | null> {
    return this.prisma.process.findUnique({
      where: { id },
    });
  }

  async findByIdWithRelations(id: string): Promise<ProcessWithRelations | null> {
    return this.prisma.process.findUnique({
      where: { id },
      include: {
        processMap: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        procedures: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
          },
          take: 10,
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
          },
        },
        flowDiagram: {
          select: {
            id: true,
            level: true,
            nodes: { select: { id: true } },
            edges: { select: { id: true } },
          },
        },
        _count: {
          select: {
            procedures: true,
            comments: true,
            assignments: true,
            actors: true,
            processIOs: true,
            processIndicators: true,
            processRisks: true,
          },
        },
      },
    });
  }

  async findProcessesWithFilters(
    query: ProcessQueryDto,
  ): Promise<PaginatedResponse<any>> {
    const where: any = {};
    
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.processMapId) where.processMapId = query.processMapId;
    if (query.createdById) where.createdById = query.createdById;
    if (query.workspaceId) where.workspaceId = query.workspaceId;
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const include = {
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          email: true,
        },
      },
      processMap: {
        select: {
          id: true,
          title: true,
          code: true,
        },
      },
      _count: {
        select: {
          procedures: true,
          comments: true,
          assignments: true,
        },
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.process.findMany({
        where,
        include,
        skip: query.skip,
        take: query.take,
        orderBy: query.sortBy
          ? { [query.sortBy]: query.sortOrder }
          : { createdAt: 'desc' },
      }),
      this.prisma.process.count({ where }),
    ]);

    return new PaginatedResponse(data, total, query.page, query.limit);
  }

  async findByCodeAndProcessMap(code: string, processMapId: string): Promise<ProcessEntity | null> {
    return this.prisma.process.findUnique({
      where: {
        processMapId_code: {
          processMapId,
          code,
        },
      },
    });
  }

  async findProcessesByProcessMap(processMapId: string): Promise<any[]> {
    return this.prisma.process.findMany({
      where: {
        processMapId,
      },
      include: {
        procedures: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
          },
        },
        _count: {
          select: {
            procedures: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  async create(data: any): Promise<ProcessEntity> {
    return this.prisma.process.create({ data });
  }

  async update(id: string, data: any): Promise<ProcessEntity> {
    return this.prisma.process.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ProcessEntity> {
    return this.prisma.process.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: ProcessStatus): Promise<ProcessEntity> {
    const updateData: any = {
      status,
    };

    if (status === ProcessStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }
    if (status === ProcessStatus.ARCHIVED) {
      updateData.archivedAt = new Date();
    }

    return this.prisma.process.update({
      where: { id },
      data: updateData,
    });
  }

  async getProcessHierarchy(processMapId: string): Promise<any> {
    return this.prisma.processMap.findUnique({
      where: { id: processMapId },
      include: {
        processes: {
          include: {
            procedures: {
              select: {
                id: true,
                title: true,
                code: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.process.count({
      where: { id },
    });
    return count > 0;
  }
}
