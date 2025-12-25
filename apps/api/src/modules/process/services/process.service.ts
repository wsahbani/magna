import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ProcessRepository } from '../repositories/process.repository';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto } from '../dto/update-process.dto';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessStatus, ProcessType } from '@prisma/client';
import { SipocService } from '../../sipoc/services/sipoc.service';

@Injectable()
export class ProcessService {
  private readonly logger = new Logger(ProcessService.name);

  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly prisma: PrismaService,
    private readonly sipocService: SipocService,
  ) {}

  /**
   * Create a new Process
   * Automatically creates a FlowDiagram (level=2) for the Process
   */
  async create(createProcessDto: CreateProcessDto, userId: string) {
    // Validate ProcessMap exists if provided
    if (createProcessDto.processMapId) {
      const processMap = await this.prisma.processMap.findUnique({
        where: { id: createProcessDto.processMapId },
      });
      if (!processMap) {
        throw new NotFoundException(
          `ProcessMap with ID "${createProcessDto.processMapId}" not found`,
        );
      }

      // Check if code already exists within the ProcessMap
      const existing = await this.processRepository.findByCode(
        createProcessDto.processMapId,
        createProcessDto.code,
      );
      if (existing) {
        throw new ConflictException(
          `Process with code "${createProcessDto.code}" already exists in this ProcessMap`,
        );
      }
    }

    // Validate workspace exists
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: createProcessDto.workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID "${createProcessDto.workspaceId}" not found`,
      );
    }

    // Validate department exists if provided
    if (createProcessDto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: createProcessDto.departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID "${createProcessDto.departmentId}" not found`,
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

    // Create Process and FlowDiagram in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create Process
      const process = await tx.process.create({
        data: {
          title: createProcessDto.title,
          code: createProcessDto.code,
          description: createProcessDto.description,
          type: createProcessDto.type || ProcessType.FLOW,
          status: createProcessDto.status || ProcessStatus.DRAFT,
          processMapId: createProcessDto.processMapId,
          workspaceId: createProcessDto.workspaceId,
          departmentId: createProcessDto.departmentId,
          objectif: createProcessDto.objectif,
          perimetre: createProcessDto.perimetre,
          finalite: createProcessDto.finalite,
          priority: createProcessDto.priority,
          confidentiality: createProcessDto.confidentiality,
          reviewFrequency: createProcessDto.reviewFrequency,
          createdById: validUserId,
        },
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
        },
      });

      // Create diagram conditionally based on Process type
      if (process.type === ProcessType.FLOW) {
        // Create FlowDiagram (level=2) for FLOW type
        await tx.flowDiagram.create({
          data: {
            level: 2,
            processId: process.id, // Generic field for unique constraint
            processId_ref: process.id, // Specific relation to Process
          },
        });
      } else if (process.type === ProcessType.SIPOC) {
        // Create SipocDiagram for SIPOC type (in the same transaction)
        try {
          await tx.sipocDiagram.create({
            data: {
              title: process.title,
              description: process.description || undefined,
              processId: process.id,
              process_owner: undefined, // Can be set later
              department: process.departmentId || undefined,
              createdBy: validUserId,
              status: 'draft',
              is_template: false,
            },
          });
          this.logger.log(`SipocDiagram created successfully for Process ${process.id}`);
        } catch (error) {
          // Log error and rethrow to fail the transaction
          // This ensures data consistency: if SipocDiagram creation fails, Process creation should also fail
          this.logger.error(
            `Failed to create SipocDiagram for Process ${process.id}:`,
            error,
          );
          throw error;
        }
      }

      // Create FIP (Fiche d'Identité de Processus) automatically
      try {
        await tx.processIdentityCard.create({
          data: {
            processId: process.id,
            createdBy: validUserId,
            status: 'draft',
            objectives: createProcessDto.objectif || null,
            scope: createProcessDto.perimetre || null,
            indicators: null,
            stakeholders: null,
            risks: null,
            opportunities: null,
            resources: null,
            performanceTargets: null,
          },
        });
        this.logger.log(`FIP created successfully for Process ${process.id}`);
      } catch (error) {
        // Log error and rethrow to fail the transaction
        // This ensures data consistency: if FIP creation fails, Process creation should also fail
        this.logger.error(
          `Failed to create FIP for Process ${process.id}:`,
          error,
        );
        throw error;
      }

      // Récupérer le Process avec tous les détails en utilisant le client de transaction
      // Utiliser tx au lieu de this.processRepository pour voir les changements dans la transaction
      return tx.process.findUnique({
        where: { id: process.id },
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
    });
  }

  /**
   * Find all Processes with pagination
   * Applies visibility rules:
   * - Regular users: see their own processes OR validated/published processes
   * - Superadmins (isAdmin=true): see all processes
   */
  async findAll(
    processMapId?: string,
    workspaceId?: string,
    page = 1,
    limit = 20,
    userId?: string,
    isAdmin = false,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Apply visibility rules
    if (!isAdmin && userId) {
      // Regular user: see own processes OR validated/published processes
      where.OR = [
        { createdById: userId },
        { status: ProcessStatus.VALIDATED },
        { status: ProcessStatus.PUBLISHED },
      ];
    }
    // Superadmin sees all (no additional filter)
    
    // Existing filters
    if (processMapId) {
      where.processMapId = processMapId;
    }
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    const [data, total] = await Promise.all([
      workspaceId
        ? this.processRepository.findByWorkspace(workspaceId, {
            where,
            skip,
            take: limit,
          })
        : processMapId
          ? this.processRepository.findByProcessMap(processMapId, {
              where,
              skip,
              take: limit,
            })
          : this.processRepository.findAll({
              where,
              skip,
              take: limit,
            }),
      this.processRepository.count(where),
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
   * Find Process by ID
   */
  async findOne(id: string) {
    const process = await this.processRepository.findByIdWithDetails(id);
    if (!process) {
      throw new NotFoundException(`Process with ID "${id}" not found`);
    }
    return process;
  }

  /**
   * Update Process
   */
  async update(id: string, updateProcessDto: UpdateProcessDto, userId: string) {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new NotFoundException(`Process with ID "${id}" not found`);
    }

    // Validate ProcessMap exists if being updated
    if (updateProcessDto.processMapId) {
      const processMap = await this.prisma.processMap.findUnique({
        where: { id: updateProcessDto.processMapId },
      });
      if (!processMap) {
        throw new NotFoundException(
          `ProcessMap with ID "${updateProcessDto.processMapId}" not found`,
        );
      }

      // Check if code already exists in the new ProcessMap
      if (updateProcessDto.code && updateProcessDto.code !== process.code) {
        const existing = await this.processRepository.findByCode(
          updateProcessDto.processMapId,
          updateProcessDto.code,
        );
        if (existing) {
          throw new ConflictException(
            `Process with code "${updateProcessDto.code}" already exists in this ProcessMap`,
          );
        }
      }
    } else if (updateProcessDto.code && updateProcessDto.code !== process.code && process.processMapId) {
      // Check if code already exists in the current ProcessMap (only if process has a parent)
      const existing = await this.processRepository.findByCode(
        process.processMapId,
        updateProcessDto.code,
      );
      if (existing) {
        throw new ConflictException(
          `Process with code "${updateProcessDto.code}" already exists in this ProcessMap`,
        );
      }
    }

    // Validate workspace exists if being updated
    if (updateProcessDto.workspaceId) {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: updateProcessDto.workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException(
          `Workspace with ID "${updateProcessDto.workspaceId}" not found`,
        );
      }
    }

    // Validate department exists if being updated
    if (updateProcessDto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: updateProcessDto.departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID "${updateProcessDto.departmentId}" not found`,
        );
      }
    }

    // Update Process
    const updatedProcess = await this.processRepository.update(id, {
      ...updateProcessDto,
    });

    return this.processRepository.findByIdWithDetails(updatedProcess.id);
  }

  /**
   * Delete Process
   */
  async remove(id: string) {
    const process = await this.processRepository.findById(id);
    if (!process) {
      throw new NotFoundException(`Process with ID "${id}" not found`);
    }

    // Delete Process (FlowDiagram will be cascade deleted)
    await this.processRepository.delete(id);

    return { message: 'Process deleted successfully' };
  }
}
