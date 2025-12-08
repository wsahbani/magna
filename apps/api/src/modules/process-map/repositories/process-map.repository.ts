import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessMap, Prisma } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class ProcessMapRepository extends BaseRepository<ProcessMap> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  get model() {
    return this.prisma.processMap;
  }

  /**
   * Find ProcessMap by code
   */
  async findByCode(code: string): Promise<ProcessMap | null> {
    return this.model.findUnique({
      where: { code },
    });
  }

  /**
   * Find ProcessMap by ID with full details
   */
  async findByIdWithDetails(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        processes: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
            type: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        flowDiagram: {
          include: {
            _count: {
              select: {
                nodes: true,
                edges: true,
              },
            },
          },
        },
        _count: {
          select: {
            processes: true,
            comments: true,
            documents: true,
            tags: true,
          },
        },
      },
    });
  }

  /**
   * Find ProcessMaps by workspace
   */
  async findByWorkspace(workspaceId: string, options?: Prisma.ProcessMapFindManyArgs) {
    return this.model.findMany({
      where: {
        workspaceId,
        ...options?.where,
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            processes: true,
            comments: true,
            documents: true,
            tags: true,
          },
        },
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Find all ProcessMaps without workspace filter
   */
  async findAll(options?: Prisma.ProcessMapFindManyArgs) {
    return this.model.findMany({
      where: options?.where,
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            processes: true,
            comments: true,
            documents: true,
            tags: true,
          },
        },
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Count ProcessMaps
   */
  async count(where?: Prisma.ProcessMapWhereInput): Promise<number> {
    return this.model.count({ where });
  }
}

