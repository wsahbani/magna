import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ProcessService } from './services/process.service';
import { FlowService } from './services/flow.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { ProcessQueryDto } from './dto/process-query.dto';
import { SaveFlowDto, UpdateFlowLayoutDto } from './dto/save-flow.dto';
import { ProcessStatus } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/auth.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProcessActorDto } from './dto/create-process-actor.dto';
import { CreateProcessIODto } from './dto/create-process-io.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { CreateRiskDto } from './dto/create-risk.dto';
import { CreateLinkedDocumentDto } from './dto/create-linked-document.dto';
import { DiagramService } from '../procedure/services/diagram.service';
import { CreateDiagramNodeDto } from '../procedure/dto/create-diagram-node.dto';
import { CreateDiagramEdgeDto } from '../procedure/dto/create-diagram-edge.dto';
import { CreateDiagramLaneDto } from '../procedure/dto/create-diagram-lane.dto';

@Controller('processes')
@UseGuards(JwtAuthGuard)
export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly flowService: FlowService,
    private readonly diagramService: DiagramService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProcessDto: CreateProcessDto,
    @CurrentUser() user: any,
  ) {
    // JwtStrategy.validate returns { userId, email, ... } not { sub, ... }
    const userId = (user as any)?.userId;
    if (!userId) {
      throw new Error('User authentication required');
    }
    return this.processService.create(createProcessDto, userId);
  }

  @Get()
  async findAll(@Query() query: ProcessQueryDto) {
    return this.processService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.processService.findByIdWithRelations(id);
  }

  @Get(':id/hierarchy')
  async getHierarchy(@Param('id') id: string) {
    return this.processService.getProcessHierarchy(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProcessDto: UpdateProcessDto,
  ) {
    return this.processService.update(id, updateProcessDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProcessStatus,
  ) {
    return this.processService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.processService.remove(id);
  }

  // ====================================
  // FLOW DIAGRAM ENDPOINTS
  // ====================================

  @Post('flow/save')
  @HttpCode(HttpStatus.OK)
  async saveFlow(
    @Body() saveFlowDto: SaveFlowDto,
    @CurrentUser() user: any,
  ) {
    const userId = (user as any)?.userId;
    if (!userId) {
      throw new Error('User authentication required');
    }
    return this.flowService.saveFlow(saveFlowDto, userId);
  }

  @Get(':id/flow')
  async getFlow(@Param('id') id: string) {
    return this.flowService.getFlow(id);
  }

  @Patch(':id/flow/layout')
  async updateFlowLayout(
    @Param('id') id: string,
    @Body() layoutDto: UpdateFlowLayoutDto,
  ) {
    return this.flowService.updateLayout(id, layoutDto);
  }

  // ====================================
  // PROCESS METADATA ENDPOINTS
  // ====================================

  // Actors
  @Get(':id/actors')
  async getActors(@Param('id') id: string) {
    return this.processService.getActors(id);
  }

  @Post(':id/actors')
  @HttpCode(HttpStatus.CREATED)
  async createActor(
    @Param('id') id: string,
    @Body() dto: CreateProcessActorDto,
  ) {
    return this.processService.createActor(id, dto);
  }

  @Patch(':id/actors/:actorId')
  async updateActor(
    @Param('id') id: string,
    @Param('actorId') actorId: string,
    @Body() dto: Partial<CreateProcessActorDto>,
  ) {
    return this.processService.updateActor(id, actorId, dto);
  }

  @Delete(':id/actors/:actorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteActor(
    @Param('id') id: string,
    @Param('actorId') actorId: string,
  ) {
    return this.processService.deleteActor(id, actorId);
  }

  // Inputs
  @Get(':id/inputs')
  async getInputs(@Param('id') id: string) {
    return this.processService.getInputs(id);
  }

  // Outputs
  @Get(':id/outputs')
  async getOutputs(@Param('id') id: string) {
    return this.processService.getOutputs(id);
  }

  // IO (unified endpoint)
  @Post(':id/ios')
  @HttpCode(HttpStatus.CREATED)
  async createIO(@Param('id') id: string, @Body() dto: CreateProcessIODto) {
    return this.processService.createIO(id, dto);
  }

  @Patch(':id/ios/:ioId')
  async updateIO(
    @Param('id') id: string,
    @Param('ioId') ioId: string,
    @Body() dto: Partial<CreateProcessIODto>,
  ) {
    return this.processService.updateIO(id, ioId, dto);
  }

  @Delete(':id/ios/:ioId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIO(@Param('id') id: string, @Param('ioId') ioId: string) {
    return this.processService.deleteIO(id, ioId);
  }

  // Indicators
  @Get(':id/indicators')
  async getIndicators(@Param('id') id: string) {
    return this.processService.getIndicators(id);
  }

  @Post(':id/indicators')
  @HttpCode(HttpStatus.CREATED)
  async createIndicator(@Param('id') id: string, @Body() dto: CreateIndicatorDto) {
    return this.processService.createIndicator(id, dto);
  }

  @Patch(':id/indicators/:indicatorId')
  async updateIndicator(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
    @Body() dto: Partial<CreateIndicatorDto>,
  ) {
    return this.processService.updateIndicator(id, indicatorId, dto);
  }

  @Delete(':id/indicators/:indicatorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIndicator(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
  ) {
    return this.processService.deleteIndicator(id, indicatorId);
  }

  // Risks
  @Get(':id/risks')
  async getRisks(@Param('id') id: string) {
    return this.processService.getRisks(id);
  }

  @Post(':id/risks')
  @HttpCode(HttpStatus.CREATED)
  async createRisk(@Param('id') id: string, @Body() dto: CreateRiskDto) {
    return this.processService.createRisk(id, dto);
  }

  @Patch(':id/risks/:riskId')
  async updateRisk(
    @Param('id') id: string,
    @Param('riskId') riskId: string,
    @Body() dto: Partial<CreateRiskDto>,
  ) {
    return this.processService.updateRisk(id, riskId, dto);
  }

  @Delete(':id/risks/:riskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRisk(@Param('id') id: string, @Param('riskId') riskId: string) {
    return this.processService.deleteRisk(id, riskId);
  }

  // Documents
  @Get(':id/documents')
  async getDocuments(@Param('id') id: string) {
    return this.processService.getDocuments(id);
  }

  @Post(':id/documents')
  @HttpCode(HttpStatus.CREATED)
  async createDocument(@Param('id') id: string, @Body() dto: CreateLinkedDocumentDto) {
    return this.processService.createDocument(id, dto);
  }

  @Patch(':id/documents/:documentId')
  async updateDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Body() dto: Partial<CreateLinkedDocumentDto>,
  ) {
    return this.processService.updateDocument(id, documentId, dto);
  }

  @Delete(':id/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
  ) {
    return this.processService.deleteDocument(id, documentId);
  }
}