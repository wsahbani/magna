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
        parent: true,
        children: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
          },
        },
        versions: {
          take: 5,
          orderBy: { version: 'desc' },
        },
        currentDraft: true,
        currentPublished: true,
        _count: {
          select: {
            comments: true,
            assignments: true,
            versions: true,
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
    if (query.level) where.level = query.level;
    if (query.parentId) where.parentId = query.parentId;
    if (query.createdById) where.createdById = query.createdById;
    if (query.workspaceId) where.workspaceId = query.workspaceId
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { authorName: { contains: query.search, mode: 'insensitive' } },
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
      parent: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      _count: {
        select: {
          children: true,
          versions: true,
          comments: true,
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

  async findByNameAndVersion(name: string, version: number): Promise<ProcessEntity | null> {
    return this.prisma.process.findFirst({
      where: { name, version },
    });
  }

  async findRootProcesses(): Promise<any[]> {
    return this.prisma.process.findMany({
      where: {
        parentId: null,
        level: 1,
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            type: true,
            level: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
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
    return this.prisma.process.update({
      where: { id },
      data: {
        status,
        modifiedAt: new Date(),
        ...(status === ProcessStatus.PUBLISHED && { publishedAt: new Date() }),
        ...(status === ProcessStatus.ARCHIVED && { archivedAt: new Date() }),
      },
    });
  }

  async getProcessHierarchy(rootId: string): Promise<ProcessWithRelations | null> {
    return this.prisma.process.findUnique({
      where: { id: rootId },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true, // Support up to 4 levels deep
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