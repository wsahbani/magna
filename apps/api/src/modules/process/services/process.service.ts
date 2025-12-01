import { Injectable, Logger } from '@nestjs/common';
import { ProcessRepository } from '../repositories/process.repository';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto } from '../dto/update-process.dto';
import { ProcessQueryDto } from '../dto/process-query.dto';
import { ProcessEntity } from '../entities/process.entity';
import { ProcessStatus, ProcessType } from '@prisma/client';
import { SipocService } from '../../sipoc/services/sipoc.service';
import { FipService } from '../../fip/services/fip.service';

@Injectable()
export class ProcessService {
  private readonly logger = new Logger(ProcessService.name);

  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly prisma: PrismaService,
    private readonly sipocService: SipocService,
    private readonly fipService: FipService,
  ) {}

  /**
   * Map level to ProcessType
   * Level 1 = FLOW, Level 2 = SIPOC, Level 3 = BPMN
   */
  private mapLevelToType(level: number): ProcessType {
    switch (level) {
      case 1:
        return ProcessType.FLOW;
      case 2:
        return ProcessType.SIPOC;
      case 3:
        return ProcessType.BPMN;
      default:
        return ProcessType.FLOW;
    }
  }

  async create(createProcessDto: CreateProcessDto, userId: string): Promise<ProcessEntity> {
    this.logger.log(`Creating new process: ${createProcessDto.name}`);
    console.log(createProcessDto)
    const { workspaceId, ...dataWithoutWorkspaceId } = createProcessDto;
    const processType = this.mapLevelToType(createProcessDto.level);
    
    const processData = {
      ...dataWithoutWorkspaceId,
      type: processType,
      workspace : {
          connect :{
            id : workspaceId
          }
      },
      createdBy: {
          connect: {
              id: userId
          }
      },
      version: 1,
      status: ProcessStatus.DRAFT,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    // Remove code field as it's not in the schema
    const { code, ...dataWithoutCode } = processData as any;

    const createdProcess = await this.processRepository.create(dataWithoutCode);
    this.logger.log(`Process created successfully: ${createdProcess.id}`);

    // If process type is SIPOC, create a corresponding SIPOC diagram
    if (processType === ProcessType.SIPOC) {
      this.logger.log(`Creating SIPOC diagram for process: ${createdProcess.id}`);
      try {
        await this.sipocService.createDiagram(
          {
            title: createProcessDto.name,
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
      throw new Error('Process not found');
    }

    const updateData = {
      ...updateProcessDto,
      modifiedAt: new Date(),
    };

    const updatedProcess = await this.processRepository.update(id, updateData);
    this.logger.log(`Process updated successfully: ${id}`);
    return updatedProcess;
  }

  async remove(id: string): Promise<ProcessEntity> {
    this.logger.log(`Deleting process: ${id}`);

    const existingProcess = await this.processRepository.findById(id);
    if (!existingProcess) {
      throw new Error('Process not found');
    }

    const deletedProcess = await this.processRepository.delete(id);
    this.logger.log(`Process deleted successfully: ${id}`);
    return deletedProcess;
  }

  async updateStatus(id: string, status: ProcessStatus): Promise<ProcessEntity> {
    this.logger.log(`Updating process status: ${id} to ${status}`);
    return this.processRepository.updateStatus(id, status);
  }

  async getRootProcesses(): Promise<any[]> {
    return this.processRepository.findRootProcesses();
  }

  async getProcessHierarchy(rootId: string): Promise<any> {
    return this.processRepository.getProcessHierarchy(rootId);
  }
}