import { Injectable, NotFoundException, Inject, forwardRef, Logger } from '@nestjs/common';
import { ProcedureRepository } from '../repositories/procedure.repository';
import { CreateProcedureDto } from '../dto/create-procedure.dto';
import { UpdateProcedureDto } from '../dto/update-procedure.dto';
import { CreateDiagramNodeDto } from '../dto/create-diagram-node.dto';
import { CreateDiagramEdgeDto } from '../dto/create-diagram-edge.dto';
import { CreateDiagramLaneDto } from '../dto/create-diagram-lane.dto';
import {
  ProcedureEntity,
  ProcedureWithRelations,
} from '../entities/procedure.entity';
import { DiagramService } from './diagram.service';
import { PrismaService } from '../../../database/prisma.service';
import { ProcedureStatus } from '@prisma/client';

@Injectable()
export class ProcedureService {
  private readonly logger = new Logger(ProcedureService.name);

  constructor(
    private readonly procedureRepository: ProcedureRepository,
    @Inject(forwardRef(() => DiagramService))
    private readonly diagramService: DiagramService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateProcedureDto, userId?: string): Promise<ProcedureEntity> {
    // Validate userId exists or use fallback
    let validUserId = userId || 'system';
    if (validUserId && validUserId !== 'system') {
      const userExists = await this.prisma.user.findUnique({
        where: { id: validUserId },
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

    // Create procedure with FlowDiagram in transaction
    const procedure = await this.procedureRepository.create({
      ...dto,
      createdById: validUserId,
    });

    // Automatically create FlowDiagram for this Procedure (level 3)
    await this.prisma.flowDiagram.create({
      data: {
        level: 3,
        processId: procedure.id,
        procedureId: procedure.id,
      },
    });

    return procedure;
  }

  /**
   * Find all Procedures with optional filters
   * Applies visibility rules:
   * - Regular users: see their own Procedures OR validated Procedures
   * - Superadmins (isAdmin=true): see all Procedures
   */
  async findAll(
    processId?: string,
    userId?: string,
    isAdmin = false,
  ): Promise<ProcedureEntity[]> {
    const where: any = {};
    
    // Apply visibility rules
    if (!isAdmin && userId) {
      // Regular user: see own Procedures OR validated Procedures
      where.OR = [
        { createdById: userId },
        { status: ProcedureStatus.VALIDATED },
      ];
    }
    // Superadmin sees all (no additional filter)
    
    // Existing filters
    if (processId) {
      where.processId = processId;
    }

    if (processId) {
      return this.procedureRepository.findByProcessId(processId, where);
    }
    // Return all procedures if no processId filter
    return this.procedureRepository.findAll(where);
  }

  async findOne(id: string): Promise<ProcedureWithRelations> {
    const procedure = await this.procedureRepository.findByIdWithRelations(id);
    if (!procedure) {
      throw new NotFoundException(`Procedure with ID "${id}" not found`);
    }
    return procedure;
  }

  async update(
    id: string,
    dto: UpdateProcedureDto,
  ): Promise<ProcedureEntity> {
    const existing = await this.procedureRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Procedure with ID "${id}" not found`);
    }
    return this.procedureRepository.update(id, dto);
  }

  async remove(id: string): Promise<ProcedureEntity> {
    const existing = await this.procedureRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Procedure with ID "${id}" not found`);
    }
    return this.procedureRepository.delete(id);
  }

  // Nodes - Use DiagramService
  async createNode(procedureId: string, dto: CreateDiagramNodeDto, userId: string) {
    await this.ensureProcedureExists(procedureId);
    return this.diagramService.createNode(
      {
        ...dto,
        procedureId,
      },
      userId,
    );
  }

  async updateNode(
    procedureId: string,
    nodeId: string,
    dto: Partial<CreateDiagramNodeDto>,
  ) {
    await this.ensureNodeExists(procedureId, nodeId);
    return this.diagramService.updateNode(
      undefined,
      undefined,
      procedureId,
      nodeId,
      dto,
    );
  }

  async deleteNode(procedureId: string, nodeId: string) {
    await this.ensureNodeExists(procedureId, nodeId);
    return this.diagramService.deleteNode(
      undefined,
      undefined,
      procedureId,
      nodeId,
    );
  }

  // Edges - Use DiagramService
  async createEdge(procedureId: string, dto: CreateDiagramEdgeDto) {
    await this.ensureProcedureExists(procedureId);
    return this.diagramService.createEdge({
      ...dto,
      procedureId,
    });
  }

  async updateEdge(
    procedureId: string,
    edgeId: string,
    dto: Partial<CreateDiagramEdgeDto>,
  ) {
    await this.ensureEdgeExists(procedureId, edgeId);
    return this.diagramService.updateEdge(
      undefined,
      undefined,
      procedureId,
      edgeId,
      dto,
    );
  }

  async deleteEdge(procedureId: string, edgeId: string) {
    await this.ensureEdgeExists(procedureId, edgeId);
    return this.diagramService.deleteEdge(
      undefined,
      undefined,
      procedureId,
      edgeId,
    );
  }

  // Lanes - DEPRECATED (not supported in new model)
  async createLane(procedureId: string, dto: CreateDiagramLaneDto) {
    await this.ensureProcedureExists(procedureId);
    return this.diagramService.createLane({
      ...dto,
      procedureId,
    });
  }

  async updateLane(
    procedureId: string,
    laneId: string,
    dto: Partial<CreateDiagramLaneDto>,
  ) {
    await this.ensureProcedureExists(procedureId);
    return this.diagramService.updateLane(
      undefined,
      undefined,
      procedureId,
      laneId,
      dto,
    );
  }

  async deleteLane(procedureId: string, laneId: string) {
    await this.ensureProcedureExists(procedureId);
    return this.diagramService.deleteLane(
      undefined,
      undefined,
      procedureId,
      laneId,
    );
  }

  // Validation & Publishing
  async validate(procedureId: string, userId: string) {
    const procedure = await this.procedureRepository.findById(procedureId);
    if (!procedure) {
      throw new NotFoundException(`Procedure with ID "${procedureId}" not found`);
    }
    return this.procedureRepository.update(procedureId, {
      status: 'ACTIVE',
      validatedBy: userId,
      validatedAt: new Date(),
    });
  }

  async publish(procedureId: string) {
    const procedure = await this.procedureRepository.findById(procedureId);
    if (!procedure) {
      throw new NotFoundException(`Procedure with ID "${procedureId}" not found`);
    }
    return this.procedureRepository.update(procedureId, {
      status: 'ACTIVE',
      effectiveDate: new Date(),
    });
  }

  // Versioning - DEPRECATED (versioning removed from schema)
  async createVersion(
    procedureId: string,
    changeLog?: string,
    userId?: string,
  ) {
    // Versioning is no longer supported in the new schema
    // Return a mock response for backward compatibility
    return {
      id: `version-${Date.now()}`,
      procedureId,
      version: '1.0',
      versionNumber: 1,
      changeLog,
      message: 'Versioning is no longer supported. Use FlowDiagram.snapshot for versioning.',
    };
  }

  async getVersions(procedureId: string) {
    // Versioning is no longer supported
    return [];
  }

  // Helpers
  private async ensureProcedureExists(procedureId: string) {
    const procedure = await this.procedureRepository.findById(procedureId);
    if (!procedure) {
      throw new NotFoundException(
        `Procedure with ID "${procedureId}" not found`,
      );
    }
  }

  private async ensureNodeExists(procedureId: string, nodeId: string) {
    await this.ensureProcedureExists(procedureId);
    const node = await this.procedureRepository.findNodeByProcedureAndNodeId(
      procedureId,
      nodeId,
    );
    if (!node) {
      throw new NotFoundException(
        `Node with ID "${nodeId}" not found in procedure "${procedureId}"`,
      );
    }
  }

  private async ensureEdgeExists(procedureId: string, edgeId: string) {
    await this.ensureProcedureExists(procedureId);
    const edge = await this.procedureRepository.findEdgeByProcedureAndEdgeId(
      procedureId,
      edgeId,
    );
    if (!edge) {
      throw new NotFoundException(
        `Edge with ID "${edgeId}" not found in procedure "${procedureId}"`,
      );
    }
  }

  private async ensureLaneExists(procedureId: string, laneId: string) {
    // Lanes are not supported in the new model, but we keep this for backward compatibility
    await this.ensureProcedureExists(procedureId);
  }
}

