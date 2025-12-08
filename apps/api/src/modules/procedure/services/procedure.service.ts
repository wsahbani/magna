import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
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

@Injectable()
export class ProcedureService {
  constructor(
    private readonly procedureRepository: ProcedureRepository,
    @Inject(forwardRef(() => DiagramService))
    private readonly diagramService: DiagramService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateProcedureDto, userId?: string): Promise<ProcedureEntity> {
    // Create procedure with FlowDiagram in transaction
    const procedure = await this.procedureRepository.create({
      ...dto,
      createdById: userId || 'system', // TODO: Get from context
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

  async findAll(processId?: string): Promise<ProcedureEntity[]> {
    if (processId) {
      return this.procedureRepository.findByProcessId(processId);
    }
    return [];
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

