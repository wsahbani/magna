import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProcessRepository } from '../repositories/process.repository';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto } from '../dto/update-process.dto';
import { ProcessQueryDto } from '../dto/process-query.dto';
import { ProcessEntity } from '../entities/process.entity';
import { ProcessStatus, ProcessType } from '@prisma/client';
import { SipocService } from '../../sipoc/services/sipoc.service';
import { FipService } from '../../fip/services/fip.service';
import { ProcessMetadataService } from './process-metadata.service';
import { CreateProcessActorDto } from '../dto/create-process-actor.dto';
import { CreateProcessIODto } from '../dto/create-process-io.dto';
import { CreateIndicatorDto } from '../dto/create-indicator.dto';
import { CreateRiskDto } from '../dto/create-risk.dto';
import { CreateLinkedDocumentDto } from '../dto/create-linked-document.dto';

@Injectable()
export class ProcessService {
  private readonly logger = new Logger(ProcessService.name);

  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly prisma: PrismaService,
    private readonly sipocService: SipocService,
    private readonly fipService: FipService,
    private readonly metadataService: ProcessMetadataService,
  ) {}

  async create(createProcessDto: CreateProcessDto, userId: string): Promise<ProcessEntity> {
    this.logger.log(`Creating new process: ${createProcessDto.title}`);
    
    if (!userId) {
      throw new Error('User ID is required to create a process');
    }

    // Validate required fields
    if (!createProcessDto.processMapId) {
      throw new Error('processMapId is required to create a process');
    }
    if (!createProcessDto.workspaceId) {
      throw new Error('workspaceId is required to create a process');
    }
    if (!createProcessDto.code) {
      throw new Error('code is required to create a process');
    }

    // Check if processMap exists
    const processMap = await this.prisma.processMap.findUnique({
      where: { id: createProcessDto.processMapId },
    });
    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID "${createProcessDto.processMapId}" not found`);
    }

    // Check if code already exists in this processMap
    const existingProcess = await this.processRepository.findByCodeAndProcessMap(
      createProcessDto.code,
      createProcessDto.processMapId,
    );
    if (existingProcess) {
      throw new Error(`Process with code "${createProcessDto.code}" already exists in this ProcessMap`);
    }
    
    const processType = createProcessDto.type || ProcessType.FLOW;
    
    const processData: any = {
      title: createProcessDto.title,
      description: createProcessDto.description,
      code: createProcessDto.code,
      type: processType,
      processMapId: createProcessDto.processMapId,
      workspaceId: createProcessDto.workspaceId,
      departmentId: createProcessDto.departmentId,
      createdById: userId,
      status: ProcessStatus.DRAFT,
      objectif: createProcessDto.objectif,
      perimetre: createProcessDto.perimetre,
      finalite: createProcessDto.finalite,
      priority: createProcessDto.priority,
      confidentiality: createProcessDto.confidentiality,
      reviewFrequency: createProcessDto.reviewFrequency,
    };

    const createdProcess = await this.prisma.$transaction(async (tx) => {
      // Create process
      const process = await tx.process.create({
        data: processData,
      });

      // Automatically create a FlowDiagram for this Process (level 2)
      await tx.flowDiagram.create({
        data: {
          level: 2,
          processId: process.id,
          processId_ref: process.id,
        },
      });

      return process;
    });

    this.logger.log(`Process created successfully: ${createdProcess.id}`);

    // If process type is SIPOC, create a corresponding SIPOC diagram
    if (processType === ProcessType.SIPOC) {
      this.logger.log(`Creating SIPOC diagram for process: ${createdProcess.id}`);
      try {
        await this.sipocService.createDiagram(
          {
            title: createProcessDto.title,
            description: createProcessDto.description,
            process_owner: createProcessDto.authorName,
            status: 'draft',
            version: 1,
            processId: createdProcess.id,
          },
          userId,
        );
        this.logger.log(`SIPOC diagram created successfully for process: ${createdProcess.id}`);
      } catch (error) {
        this.logger.error(`Failed to create SIPOC diagram for process: ${createdProcess.id}`, error);
        // Don't fail the process creation if SIPOC creation fails
      }
    }

    // Create FIP (Fiche Identité Processus) for all process types
    this.logger.log(`Creating FIP for process: ${createdProcess.id}`);
    try {
      await this.fipService.create(
        {
          processId: createdProcess.id,
          status: 'draft',
          objectives: createProcessDto.objectives || '',
          scope: createProcessDto.applicationScope || '',
          indicators: [],
          stakeholders: [],
          risks: [],
          opportunities: [],
          resources: [],
          performanceTargets: [],
        },
        userId,
      );
      this.logger.log(`FIP created successfully for process: ${createdProcess.id}`);
    } catch (error) {
      this.logger.error(`Failed to create FIP for process: ${createdProcess.id}`, error);
      // Don't fail the process creation if FIP creation fails
    }

    return createdProcess;
  }

  async findById(id: string): Promise<ProcessEntity | null> {
    return this.processRepository.findById(id);
  }

  async findByIdWithRelations(id: string): Promise<any> {
    return this.processRepository.findByIdWithRelations(id);
  }

  async findAll(query: ProcessQueryDto): Promise<any> {
    return this.processRepository.findProcessesWithFilters(query);
  }

  async update(id: string, updateProcessDto: UpdateProcessDto): Promise<ProcessEntity> {
    this.logger.log(`Updating process: ${id}`);

    const existingProcess = await this.processRepository.findById(id);
    if (!existingProcess) {
      throw new NotFoundException('Process not found');
    }

    const updatedProcess = await this.processRepository.update(id, updateProcessDto);
    this.logger.log(`Process updated successfully: ${id}`);
    return updatedProcess;
  }

  async remove(id: string): Promise<ProcessEntity> {
    this.logger.log(`Deleting process: ${id}`);

    const existingProcess = await this.processRepository.findById(id);
    if (!existingProcess) {
      throw new NotFoundException('Process not found');
    }

    const deletedProcess = await this.processRepository.delete(id);
    this.logger.log(`Process deleted successfully: ${id}`);
    return deletedProcess;
  }

  async updateStatus(id: string, status: ProcessStatus): Promise<ProcessEntity> {
    this.logger.log(`Updating process status: ${id} to ${status}`);
    return this.processRepository.updateStatus(id, status);
  }

  async getProcessesByProcessMap(processMapId: string): Promise<any[]> {
    return this.processRepository.findProcessesByProcessMap(processMapId);
  }

  async getProcessHierarchy(processMapId: string): Promise<any> {
    return this.processRepository.getProcessHierarchy(processMapId);
  }

  // ====================================
  // METADATA METHODS (delegated to ProcessMetadataService)
  // ====================================

  // Actors
  async getActors(processId: string) {
    return this.metadataService.getActors(processId);
  }

  async createActor(processId: string, dto: CreateProcessActorDto) {
    return this.metadataService.createActor(processId, dto);
  }

  async updateActor(
    processId: string,
    actorId: string,
    dto: Partial<CreateProcessActorDto>,
  ) {
    return this.metadataService.updateActor(processId, actorId, dto);
  }

  async deleteActor(processId: string, actorId: string) {
    return this.metadataService.deleteActor(processId, actorId);
  }

  // Inputs/Outputs
  async getInputs(processId: string) {
    return this.metadataService.getInputs(processId);
  }

  async getOutputs(processId: string) {
    return this.metadataService.getOutputs(processId);
  }

  async createIO(processId: string, dto: CreateProcessIODto) {
    return this.metadataService.createIO(processId, dto);
  }

  async updateIO(
    processId: string,
    ioId: string,
    dto: Partial<CreateProcessIODto>,
  ) {
    return this.metadataService.updateIO(processId, ioId, dto);
  }

  async deleteIO(processId: string, ioId: string) {
    return this.metadataService.deleteIO(processId, ioId);
  }

  // Indicators
  async getIndicators(processId: string) {
    return this.metadataService.getIndicators(processId);
  }

  async createIndicator(processId: string, dto: CreateIndicatorDto) {
    return this.metadataService.createIndicator(processId, dto);
  }

  async updateIndicator(
    processId: string,
    indicatorId: string,
    dto: Partial<CreateIndicatorDto>,
  ) {
    return this.metadataService.updateIndicator(processId, indicatorId, dto);
  }

  async deleteIndicator(processId: string, indicatorId: string) {
    return this.metadataService.deleteIndicator(processId, indicatorId);
  }

  // Risks
  async getRisks(processId: string) {
    return this.metadataService.getRisks(processId);
  }

  async createRisk(processId: string, dto: CreateRiskDto) {
    return this.metadataService.createRisk(processId, dto);
  }

  async updateRisk(
    processId: string,
    riskId: string,
    dto: Partial<CreateRiskDto>,
  ) {
    return this.metadataService.updateRisk(processId, riskId, dto);
  }

  async deleteRisk(processId: string, riskId: string) {
    return this.metadataService.deleteRisk(processId, riskId);
  }

  // Documents
  async getDocuments(processId: string) {
    return this.metadataService.getDocuments(processId);
  }

  async createDocument(processId: string, dto: CreateLinkedDocumentDto) {
    return this.metadataService.createDocument(processId, dto);
  }

  async updateDocument(
    processId: string,
    documentId: string,
    dto: Partial<CreateLinkedDocumentDto>,
  ) {
    return this.metadataService.updateDocument(processId, documentId, dto);
  }

  async deleteDocument(processId: string, documentId: string) {
    return this.metadataService.deleteDocument(processId, documentId);
  }
}
