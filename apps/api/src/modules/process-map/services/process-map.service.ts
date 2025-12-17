import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ProcessMapRepository } from '../repositories/process-map.repository';
import { CreateProcessMapDto } from '../dto/create-process-map.dto';
import { UpdateProcessMapDto } from '../dto/update-process-map.dto';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessStatus } from '@prisma/client';

@Injectable()
export class ProcessMapService {
  private readonly logger = new Logger(ProcessMapService.name);

  constructor(
    private readonly processMapRepository: ProcessMapRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a new ProcessMap
   * Automatically creates a FlowDiagram (level=1) for the ProcessMap
   */
  async create(createProcessMapDto: CreateProcessMapDto, userId: string) {
    // Check if code already exists
    const existing = await this.processMapRepository.findByCode(
      createProcessMapDto.code,
    );
    if (existing) {
      throw new ConflictException(
        `ProcessMap with code "${createProcessMapDto.code}" already exists`,
      );
    }

    // Validate workspace exists
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: createProcessMapDto.workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID "${createProcessMapDto.workspaceId}" not found`,
      );
    }

    // Validate department exists if provided
    if (createProcessMapDto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: createProcessMapDto.departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID "${createProcessMapDto.departmentId}" not found`,
        );
      }
    }

    // Validate userId exists or use fallback
    let validUserId = userId;
    if (userId && userId !== 'system') {
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!userExists) {
        // Try to find a system user or any user as fallback
        const systemUser = await this.prisma.user.findFirst({
          where: { email: 'system@magna.local' },
          select: { id: true },
        });
        if (systemUser) {
          validUserId = systemUser.id;
        } else {
          // If no system user, get the first available user
          const firstUser = await this.prisma.user.findFirst({
            select: { id: true },
          });
          if (firstUser) {
            validUserId = firstUser.id;
          } else {
            throw new NotFoundException(
              'No user found in database. Please create at least one user.',
            );
          }
        }
        this.logger.warn(
          `User ${userId} not found, using fallback: ${validUserId}`,
        );
      }
    } else {
      // If userId is 'system' or empty, try to find system user or any user
      const systemUser = await this.prisma.user.findFirst({
        where: { email: 'system@magna.local' },
        select: { id: true },
      });
      if (systemUser) {
        validUserId = systemUser.id;
      } else {
        // If no system user, get the first available user
        const firstUser = await this.prisma.user.findFirst({
          select: { id: true },
        });
        if (firstUser) {
          validUserId = firstUser.id;
        } else {
          throw new NotFoundException(
            'No user found in database. Please create at least one user.',
          );
        }
      }
    }

    // Create ProcessMap and FlowDiagram in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create ProcessMap
      const processMap = await tx.processMap.create({
        data: {
          title: createProcessMapDto.title,
          code: createProcessMapDto.code,
          description: createProcessMapDto.description,
          status: createProcessMapDto.status || ProcessStatus.DRAFT,
          workspaceId: createProcessMapDto.workspaceId,
          departmentId: createProcessMapDto.departmentId,
          createdById: validUserId,
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
        },
      });

      // Create FlowDiagram (level=1) automatically
      await tx.flowDiagram.create({
        data: {
          level: 1,
          processId: processMap.id, // Generic field for unique constraint
          processMapId: processMap.id, // Specific relation field
        },
      });

      return processMap;
    });
  }

  /**
   * Find all ProcessMaps with pagination
   */
  async findAll(workspaceId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = workspaceId ? { workspaceId } : {};

    const [data, total] = await Promise.all([
      workspaceId
        ? this.processMapRepository.findByWorkspace(workspaceId, {
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          })
        : this.processMapRepository.findAll({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
      this.processMapRepository.count(where),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find ProcessMap by ID
   */
  async findOne(id: string) {
    const processMap = await this.processMapRepository.findByIdWithDetails(id);

    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID "${id}" not found`);
    }

    return processMap;
  }

  /**
   * Update ProcessMap
   */
  async update(id: string, updateProcessMapDto: UpdateProcessMapDto) {
    const processMap = await this.processMapRepository.findById(id);

    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID "${id}" not found`);
    }

    // Check code uniqueness if being updated
    if (updateProcessMapDto.code && updateProcessMapDto.code !== processMap.code) {
      const existing = await this.processMapRepository.findByCode(
        updateProcessMapDto.code,
      );
      if (existing) {
        throw new ConflictException(
          `ProcessMap with code "${updateProcessMapDto.code}" already exists`,
        );
      }
    }

    // Validate workspace exists if being updated
    if (updateProcessMapDto.workspaceId) {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: updateProcessMapDto.workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException(
          `Workspace with ID "${updateProcessMapDto.workspaceId}" not found`,
        );
      }
    }

    // Validate department exists if being updated
    if (updateProcessMapDto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: updateProcessMapDto.departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID "${updateProcessMapDto.departmentId}" not found`,
        );
      }
    }

    return this.processMapRepository.update(id, {
      title: updateProcessMapDto.title,
      code: updateProcessMapDto.code,
      description: updateProcessMapDto.description,
      status: updateProcessMapDto.status,
      workspaceId: updateProcessMapDto.workspaceId,
      departmentId: updateProcessMapDto.departmentId,
    });
  }

  /**
   * Delete ProcessMap
   */
  async remove(id: string) {
    const processMap = await this.processMapRepository.findById(id);

    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID "${id}" not found`);
    }

    // Check if ProcessMap has processes
    const processesCount = await this.prisma.process.count({
      where: { processMapId: id },
    });

    if (processesCount > 0) {
      throw new BadRequestException(
        'Cannot delete ProcessMap with associated processes. Please delete or reassign processes first.',
      );
    }

    return this.processMapRepository.delete(id);
  }

  /**
   * Get ProcessMap processes
   */
  async getProcesses(id: string) {
    const processMap = await this.processMapRepository.findById(id);

    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID "${id}" not found`);
    }

    return this.prisma.process.findMany({
      where: { processMapId: id },
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

