import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProcessService } from './services/process.service';
import { ProcessFlowService } from './services/process-flow.service';
import { ProcessValidationService } from './services/process-validation.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessFlowDto } from './dto/save-process-flow.dto';
import { CreateValidationRequestDto } from './dto/create-validation-request.dto';
import { ApproveValidationDto } from './dto/approve-validation.dto';
import { RejectValidationDto } from './dto/reject-validation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcessEntity } from './entities/process.entity';

@ApiTags('processes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('processes')
export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly flowService: ProcessFlowService,
    private readonly validationService: ProcessValidationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Process (Level 2)' })
  @ApiResponse({
    status: 201,
    description: 'Process created successfully',
    type: ProcessEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Process code already exists in ProcessMap' })
  create(@Body() createProcessDto: CreateProcessDto, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.processService.create(createProcessDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Processes with pagination' })
  @ApiQuery({ name: 'processMapId', required: false, type: String })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of Processes',
  })
  findAll(
    @Request() req: any,
    @Query('processMapId') processMapId?: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,

  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 20;
    const userId = req.user?.id || req.user?.sub;
    const isAdmin = req.user?.isAdmin || false;
    return this.processService.findAll(processMapId, workspaceId, pageNum, limitNum, userId, isAdmin);
  }

  // ====================================
  // FLOW DIAGRAM ENDPOINTS
  // Must be defined BEFORE generic :id routes to avoid route conflicts
  // ====================================

 
  @Post(':id/flow/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save FlowDiagram for Process (Level 2)' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 200,
    description: 'FlowDiagram saved successfully',
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  saveFlow(
    @Param('id') id: string,
    @Body() saveFlowDto: SaveProcessFlowDto | Omit<SaveProcessFlowDto, 'processId'>,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub || 'system';
    // Use processId from param if not provided in body, otherwise use body's processId
    const finalDto: SaveProcessFlowDto = {
      ...saveFlowDto,
      processId: (saveFlowDto as SaveProcessFlowDto).processId || id,
    };
    return this.flowService.saveFlow(finalDto, userId);
  }
  @Get(':id/flow')
  @ApiOperation({ summary: 'Get FlowDiagram for Process (Level 2)' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 200,
    description: 'FlowDiagram data',
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  getFlow(@Param('id') id: string) {
    return this.flowService.getFlow(id);
  }

 

  @Patch(':id')
  @ApiOperation({ summary: 'Update Process' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 200,
    description: 'Process updated successfully',
    type: ProcessEntity,
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  @ApiResponse({ status: 409, description: 'Process code already exists' })
  update(
    @Param('id') id: string,
    @Body() updateProcessDto: UpdateProcessDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub || 'system';
    return this.processService.update(id, updateProcessDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Process' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 200,
    description: 'Process deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  remove(@Param('id') id: string) {
    return this.processService.remove(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Process by ID' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 200,
    description: 'Process details',
    type: ProcessEntity,
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  findOne(@Param('id') id: string) {
    return this.processService.findOne(id);
  }

  // ====================================
  // VALIDATION ENDPOINTS
  // ====================================

  @Post(':id/validation/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request validation for a process' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 201,
    description: 'Validation requests created successfully',
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  requestValidation(
    @Param('id') processId: string,
    @Body() createValidationDto: CreateValidationRequestDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return this.validationService.requestValidation(
      processId,
      createValidationDto.validatorIds,
      userId,
    );
  }

  @Get(':id/validation')
  @ApiOperation({ summary: 'Get all validation requests for a process' })
  @ApiParam({ name: 'id', description: 'Process ID' })
  @ApiResponse({
    status: 200,
    description: 'List of validation requests',
  })
  @ApiResponse({ status: 404, description: 'Process not found' })
  getValidationRequests(@Param('id') processId: string) {
    return this.validationService.getValidationRequests(processId);
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
    return this.validationService.rejectValidation(
      requestId,
      validatorId,
      rejectDto,
    );
  }

  @Get('validation/pending')
  @ApiOperation({ summary: 'Get pending validation requests for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of pending validation requests',
  })
  getPendingValidations(@Request() req: any) {
    const validatorId = req.user?.userId || req.user?.sub;
    return this.validationService.getPendingValidationsForUser(validatorId);
  }
}
