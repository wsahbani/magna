import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProcessActorDto } from '../dto/create-process-actor.dto';
import { CreateProcessIODto } from '../dto/create-process-io.dto';
import { CreateIndicatorDto } from '../dto/create-indicator.dto';
import { CreateRiskDto } from '../dto/create-risk.dto';
import { CreateLinkedDocumentDto } from '../dto/create-linked-document.dto';

@Injectable()
export class ProcessMetadataService {
  constructor(private readonly prisma: PrismaService) {}

  // ====================================
  // ACTEURS
  // ====================================

  async getActors(processId: string) {
    await this.ensureProcessExists(processId);
    return this.prisma.processActor.findMany({
      where: { processId },
      orderBy: { order: 'asc' },
    });
  }

  async createActor(processId: string, dto: CreateProcessActorDto) {
    await this.ensureProcessExists(processId);
    return this.prisma.processActor.create({
      data: {
        ...dto,
        processId,
        order: dto.order ?? 0,
      },
    });
  }

  async updateActor(
    processId: string,
    actorId: string,
    dto: Partial<CreateProcessActorDto>,
  ) {
    await this.ensureActorExists(processId, actorId);
    return this.prisma.processActor.update({
      where: { id: actorId },
      data: dto,
    });
  }

  async deleteActor(processId: string, actorId: string) {
    await this.ensureActorExists(processId, actorId);
    return this.prisma.processActor.delete({
      where: { id: actorId },
    });
  }

  // ====================================
  // INPUTS / OUTPUTS
  // ====================================

  async getInputs(processId: string) {
    await this.ensureProcessExists(processId);
    return this.prisma.processIO.findMany({
      where: { processId, isInput: true },
      orderBy: { order: 'asc' },
    });
  }

  async getOutputs(processId: string) {
    await this.ensureProcessExists(processId);
    return this.prisma.processIO.findMany({
      where: { processId, isInput: false },
      orderBy: { order: 'asc' },
    });
  }

  async createIO(processId: string, dto: CreateProcessIODto) {
    await this.ensureProcessExists(processId);
    return this.prisma.processIO.create({
      data: {
        ...dto,
        processId,
        order: dto.order ?? 0,
      },
    });
  }

  async updateIO(
    processId: string,
    ioId: string,
    dto: Partial<CreateProcessIODto>,
  ) {
    await this.ensureIOExists(processId, ioId);
    return this.prisma.processIO.update({
      where: { id: ioId },
      data: dto,
    });
  }

  async deleteIO(processId: string, ioId: string) {
    await this.ensureIOExists(processId, ioId);
    return this.prisma.processIO.delete({
      where: { id: ioId },
    });
  }

  // ====================================
  // INDICATEURS
  // ====================================

  async getIndicators(processId: string) {
    await this.ensureProcessExists(processId);
    return this.prisma.indicator.findMany({
      where: { processId },
      orderBy: { order: 'asc' },
    });
  }

  async createIndicator(processId: string, dto: CreateIndicatorDto) {
    await this.ensureProcessExists(processId);
    return this.prisma.indicator.create({
      data: {
        ...dto,
        processId,
        order: dto.order ?? 0,
      },
    });
  }

  async updateIndicator(
    processId: string,
    indicatorId: string,
    dto: Partial<CreateIndicatorDto>,
  ) {
    await this.ensureIndicatorExists(processId, indicatorId);
    return this.prisma.indicator.update({
      where: { id: indicatorId },
      data: dto,
    });
  }

  async deleteIndicator(processId: string, indicatorId: string) {
    await this.ensureIndicatorExists(processId, indicatorId);
    return this.prisma.indicator.delete({
      where: { id: indicatorId },
    });
  }

  // ====================================
  // RISQUES
  // ====================================

  async getRisks(processId: string) {
    await this.ensureProcessExists(processId);
    return this.prisma.risk.findMany({
      where: { processId },
      orderBy: { order: 'asc' },
    });
  }

  async createRisk(processId: string, dto: CreateRiskDto) {
    await this.ensureProcessExists(processId);
    return this.prisma.risk.create({
      data: {
        ...dto,
        processId,
        order: dto.order ?? 0,
      },
    });
  }

  async updateRisk(
    processId: string,
    riskId: string,
    dto: Partial<CreateRiskDto>,
  ) {
    await this.ensureRiskExists(processId, riskId);
    return this.prisma.risk.update({
      where: { id: riskId },
      data: dto,
    });
  }

  async deleteRisk(processId: string, riskId: string) {
    await this.ensureRiskExists(processId, riskId);
    return this.prisma.risk.delete({
      where: { id: riskId },
    });
  }

  // ====================================
  // DOCUMENTS LIÉS
  // ====================================

  async getDocuments(processId: string) {
    await this.ensureProcessExists(processId);
    return this.prisma.linkedDocument.findMany({
      where: { processId },
      orderBy: { order: 'asc' },
    });
  }

  async createDocument(processId: string, dto: CreateLinkedDocumentDto) {
    await this.ensureProcessExists(processId);
    return this.prisma.linkedDocument.create({
      data: {
        ...dto,
        processId,
        order: dto.order ?? 0,
      },
    });
  }

  async updateDocument(
    processId: string,
    documentId: string,
    dto: Partial<CreateLinkedDocumentDto>,
  ) {
    await this.ensureDocumentExists(processId, documentId);
    return this.prisma.linkedDocument.update({
      where: { id: documentId },
      data: dto,
    });
  }

  async deleteDocument(processId: string, documentId: string) {
    await this.ensureDocumentExists(processId, documentId);
    return this.prisma.linkedDocument.delete({
      where: { id: documentId },
    });
  }

  // ====================================
  // HELPERS
  // ====================================

  private async ensureProcessExists(processId: string) {
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
    });
    if (!process) {
      throw new NotFoundException(`Process with ID "${processId}" not found`);
    }
  }

  private async ensureActorExists(processId: string, actorId: string) {
    await this.ensureProcessExists(processId);
    const actor = await this.prisma.processActor.findFirst({
      where: { id: actorId, processId },
    });
    if (!actor) {
      throw new NotFoundException(
        `Actor with ID "${actorId}" not found in process "${processId}"`,
      );
    }
  }

  private async ensureIOExists(processId: string, ioId: string) {
    await this.ensureProcessExists(processId);
    const io = await this.prisma.processIO.findFirst({
      where: { id: ioId, processId },
    });
    if (!io) {
      throw new NotFoundException(
        `IO with ID "${ioId}" not found in process "${processId}"`,
      );
    }
  }

  private async ensureIndicatorExists(processId: string, indicatorId: string) {
    await this.ensureProcessExists(processId);
    const indicator = await this.prisma.indicator.findFirst({
      where: { id: indicatorId, processId },
    });
    if (!indicator) {
      throw new NotFoundException(
        `Indicator with ID "${indicatorId}" not found in process "${processId}"`,
      );
    }
  }

  private async ensureRiskExists(processId: string, riskId: string) {
    await this.ensureProcessExists(processId);
    const risk = await this.prisma.risk.findFirst({
      where: { id: riskId, processId },
    });
    if (!risk) {
      throw new NotFoundException(
        `Risk with ID "${riskId}" not found in process "${processId}"`,
      );
    }
  }

  private async ensureDocumentExists(processId: string, documentId: string) {
    await this.ensureProcessExists(processId);
    const document = await this.prisma.linkedDocument.findFirst({
      where: { id: documentId, processId },
    });
    if (!document) {
      throw new NotFoundException(
        `Document with ID "${documentId}" not found in process "${processId}"`,
      );
    }
  }
}

