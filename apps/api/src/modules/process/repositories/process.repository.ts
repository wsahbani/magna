import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Process, Prisma } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class ProcessRepository extends BaseRepository<Process> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  get model() {
    return this.prisma.process;
  }

  /**
   * Find Process by code within a ProcessMap
   */
  async findByCode(processMapId: string, code: string): Promise<Process | null> {
    return this.model.findUnique({
      where: {
        processMapId_code: {
          processMapId,
          code,
        },
      },
    });
  }

  /**
   * Find Process by ID with full details
   */
  async findByIdWithDetails(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        processMap: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
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
        procedures: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
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
            procedures: true,
            actors: true,
            processIOs: true,
            comments: true,
            documents: true,
            tags: true,
          },
        },
      },
    });
  }

  /**
   * Find Processes by ProcessMap
   */
  async findByProcessMap(
    processMapId: string,
    options?: Prisma.ProcessFindManyArgs,
  ) {
    return this.model.findMany({
      where: {
        processMapId,
        ...options?.where,
      },
      include: {
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
            procedures: true,
          },
        },
        ...options?.include,
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Find Processes by workspace
   */
  async findByWorkspace(
    workspaceId: string,
    options?: Prisma.ProcessFindManyArgs,
  ) {
    return this.model.findMany({
      where: {
        workspaceId,
        ...options?.where,
      },
      include: {
        processMap: {
          select: {
            id: true,
            title: true,
            code: true,
          },
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
            procedures: true,
          },
        },
        ...options?.include,
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Find all Processes without workspace filter
   */
  async findAll(options?: Prisma.ProcessFindManyArgs) {
    return this.model.findMany({
      include: {
        processMap: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            code: true,
          },
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
            procedures: true,
          },
        },
        ...options?.include,
      },
      orderBy: options?.orderBy || { createdAt: 'desc' },
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Count Processes
   */
  async count(where?: Prisma.ProcessWhereInput): Promise<number> {
    return this.model.count({ where });
  }
}
