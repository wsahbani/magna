import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProcedureService } from './services/procedure.service';
import { ProcedureFlowService } from './services/procedure-flow.service';
import { ProcedureValidationService } from './services/procedure-validation.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { SaveProcedureFlowDto } from './dto/save-procedure-flow.dto';
import { CreateDiagramNodeDto } from './dto/create-diagram-node.dto';
import { CreateDiagramEdgeDto } from './dto/create-diagram-edge.dto';
import { CreateDiagramLaneDto } from './dto/create-diagram-lane.dto';
import { CreateValidationRequestDto } from '../process/dto/create-validation-request.dto';
import { ApproveValidationDto } from '../process/dto/approve-validation.dto';
import { RejectValidationDto } from '../process/dto/reject-validation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/auth.interface';

@ApiTags('procedures')
@ApiBearerAuth()
@Controller('procedures')
@UseGuards(JwtAuthGuard)
export class ProcedureController {
  constructor(
    private readonly procedureService: ProcedureService,
    private readonly flowService: ProcedureFlowService,
    private readonly validationService: ProcedureValidationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateProcedureDto) {
    return this.procedureService.create(createDto);
  }

  @Get()
  findAll(
    @Query('processId') processId?: string,
    @Request() req?: any,
  ) {
    const userId = req?.user?.userId || req?.user?.sub;
    const isAdmin = req?.user?.isAdmin || false;
    return this.procedureService.findAll(processId, userId, isAdmin);
  }

  // ====================================
  // FLOW DIAGRAM ENDPOINTS
  // Must be defined BEFORE generic :id routes to avoid route conflicts
  // ====================================

  @Post(':id/flow/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save FlowDiagram for Procedure (Level 3)' })
  @ApiParam({ name: 'id', description: 'Procedure ID' })
  @ApiResponse({
    status: 200,
    description: 'FlowDiagram saved successfully',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found' })
  saveFlow(
    @Param('id') id: string,
    @Body() saveFlowDto: SaveProcedureFlowDto | Omit<SaveProcedureFlowDto, 'procedureId'>,
    @Request() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub || 'system';
    // Use procedureId from param if not provided in body, otherwise use body's procedureId
    const finalDto: SaveProcedureFlowDto = {
      ...saveFlowDto,
      procedureId: (saveFlowDto as SaveProcedureFlowDto).procedureId || id,
    };
    return this.flowService.saveFlow(finalDto, userId);
  }

  @Get(':id/flow')
  @ApiOperation({ summary: 'Get FlowDiagram for Procedure (Level 3)' })
  @ApiParam({ name: 'id', description: 'Procedure ID' })
  @ApiResponse({
    status: 200,
    description: 'FlowDiagram data',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found' })
  getFlow(@Param('id') id: string) {
    return this.flowService.getFlow(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.procedureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProcedureDto) {
    return this.procedureService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.procedureService.remove(id);
  }

  // Nodes
  @Get(':id/nodes')
  async getNodes(@Param('id') id: string) {
    const procedure = await this.procedureService.findOne(id);
    return procedure.flowDiagram?.nodes || [];
  }

  @Post(':id/nodes')
  @HttpCode(HttpStatus.CREATED)
  createNode(
    @Param('id') id: string,
    @Body() dto: CreateDiagramNodeDto,
    @CurrentUser() user: any,
  ) {
    const userId = (user as any)?.userId || 'system';
    return this.procedureService.createNode(id, dto, userId);
  }

  @Patch(':id/nodes/:nodeId')
  updateNode(
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
    @Body() dto: Partial<CreateDiagramNodeDto>,
  ) {
    return this.procedureService.updateNode(id, nodeId, dto);
  }

  @Delete(':id/nodes/:nodeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteNode(@Param('id') id: string, @Param('nodeId') nodeId: string) {
    return this.procedureService.deleteNode(id, nodeId);
  }

  // Edges
  @Get(':id/edges')
  async getEdges(@Param('id') id: string) {
    const procedure = await this.procedureService.findOne(id);
    return procedure.flowDiagram?.edges || [];
  }

  @Post(':id/edges')
  @HttpCode(HttpStatus.CREATED)
  createEdge(@Param('id') id: string, @Body() dto: CreateDiagramEdgeDto) {
    return this.procedureService.createEdge(id, dto);
  }

  @Patch(':id/edges/:edgeId')
  updateEdge(
    @Param('id') id: string,
    @Param('edgeId') edgeId: string,
    @Body() dto: Partial<CreateDiagramEdgeDto>,
  ) {
    return this.procedureService.updateEdge(id, edgeId, dto);
  }

  @Delete(':id/edges/:edgeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEdge(@Param('id') id: string, @Param('edgeId') edgeId: string) {
    return this.procedureService.deleteEdge(id, edgeId);
  }

  // Lanes (DEPRECATED - not supported in new model)
  @Get(':id/lanes')
  async getLanes(@Param('id') id: string) {
    // Lanes are not supported in the new FlowDiagram model
    return [];
  }

  @Post(':id/lanes')
  @HttpCode(HttpStatus.CREATED)
  createLane(@Param('id') id: string, @Body() dto: CreateDiagramLaneDto) {
    return this.procedureService.createLane(id, dto);
  }

  @Patch(':id/lanes/:laneId')
  updateLane(
    @Param('id') id: string,
    @Param('laneId') laneId: string,
    @Body() dto: Partial<CreateDiagramLaneDto>,
  ) {
    return this.procedureService.updateLane(id, laneId, dto);
  }

  @Delete(':id/lanes/:laneId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteLane(@Param('id') id: string, @Param('laneId') laneId: string) {
    return this.procedureService.deleteLane(id, laneId);
  }

  // Validation & Publishing
  @Get(':id/validate')
  @ApiOperation({ summary: 'Validate procedure diagram structure' })
  @ApiParam({ name: 'id', description: 'Procedure ID' })
  @ApiResponse({
    status: 200,
    description: 'Validation result',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found' })
  async getValidation(@Param('id') id: string) {
    return this.validationService.validateProcedure(id);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  approve(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const userId = (user as any)?.userId;
    if (!userId) {
      throw new Error('User authentication required');
    }
    return this.procedureService.validate(id, userId);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  publish(@Param('id') id: string) {
    return this.procedureService.publish(id);
  }

  // Versions
  @Get(':id/versions')
  getVersions(@Param('id') id: string) {
    return this.procedureService.getVersions(id);
  }

  @Post(':id/versions')
  @HttpCode(HttpStatus.CREATED)
  createVersion(
    @Param('id') id: string,
    @Body('changeLog') changeLog?: string,
    @CurrentUser() user?: any,
  ) {
    const userId = user ? (user as any)?.userId : undefined;
    return this.procedureService.createVersion(id, changeLog, userId);
  }

  // ====================================
  // VALIDATION ENDPOINTS
  // ====================================

  @Post(':id/validation/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request validation for a Procedure' })
  @ApiParam({ name: 'id', description: 'Procedure ID' })
  @ApiResponse({
    status: 201,
    description: 'Validation requests created successfully',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  requestValidation(
    @Param('id') procedureId: string,
    @Body() createValidationDto: CreateValidationRequestDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return this.validationService.requestValidation(
      procedureId,
      createValidationDto.validatorIds,
      userId,
    );
  }

  @Get(':id/validation')
  @ApiOperation({ summary: 'Get all validation requests for a Procedure' })
  @ApiParam({ name: 'id', description: 'Procedure ID' })
  @ApiResponse({
    status: 200,
    description: 'List of validation requests',
  })
  @ApiResponse({ status: 404, description: 'Procedure not found' })
  getValidationRequests(@Param('id') procedureId: string) {
    return this.validationService.getValidationRequests(procedureId);
  }

  @Post('validation/:requestId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a validation request' })
  @ApiParam({ name: 'requestId', description: 'Validation Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Validation request approved successfully',
  })
  @ApiResponse({ status: 404, description: 'Validation request not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  approveValidation(
    @Param('requestId') requestId: string,
    @Body() approveDto: ApproveValidationDto,
    @Request() req: any,
  ) {
    const validatorId = req.user?.userId || req.user?.sub;
    if (!validatorId) {
      throw new BadRequestException('User authentication required');
    }
    return this.validationService.approveValidation(
      requestId,
      validatorId,
      approveDto,
    );
  }

  @Post('validation/:requestId/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a validation request' })
  @ApiParam({ name: 'requestId', description: 'Validation Request ID' })
  @ApiResponse({
    status: 200,
    description: 'Validation request rejected successfully',
  })
  @ApiResponse({ status: 404, description: 'Validation request not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  rejectValidation(
    @Param('requestId') requestId: string,
    @Body() rejectDto: RejectValidationDto,
    @Request() req: any,
  ) {
    const validatorId = req.user?.userId || req.user?.sub;
    if (!validatorId) {
      throw new BadRequestException('User authentication required');
    }
    return this.validationService.rejectValidation(
      requestId,
      validatorId,
      rejectDto,
    );
  }

  @Get('validation/pending')
  @ApiOperation({ summary: 'Get all pending validation requests for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of pending validation requests',
  })
  getPendingValidations(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return this.validationService.getPendingValidationsForUser(userId);
  }
}

