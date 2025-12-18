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
import { ProcessMapService } from './services/process-map.service';
import { ProcessMapFlowService } from './services/process-map-flow.service';
import { ProcessMapValidationService } from './services/process-map-validation.service';
import { CreateProcessMapDto } from './dto/create-process-map.dto';
import { UpdateProcessMapDto } from './dto/update-process-map.dto';
import { SaveProcessMapFlowDto } from './dto/save-process-map-flow.dto';
import { CreateValidationRequestDto } from '../process/dto/create-validation-request.dto';
import { ApproveValidationDto } from '../process/dto/approve-validation.dto';
import { RejectValidationDto } from '../process/dto/reject-validation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcessMapEntity } from './entities/process-map.entity';

@ApiTags('process-maps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('process-maps')
export class ProcessMapController {
  constructor(
    private readonly processMapService: ProcessMapService,
    private readonly flowService: ProcessMapFlowService,
    private readonly validationService: ProcessMapValidationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ProcessMap' })
  @ApiResponse({
    status: 201,
    description: 'ProcessMap created successfully',
    type: ProcessMapEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'ProcessMap code already exists' })
  create(@Body() createProcessMapDto: CreateProcessMapDto, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.processMapService.create(createProcessMapDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ProcessMaps with pagination' })
  @ApiQuery({ name: 'workspaceId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of ProcessMaps',
  })
  findAll(
    @Query('workspaceId') workspaceId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Request() req?: any,
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 20;
    const userId = req?.user?.userId || req?.user?.sub;
    const isAdmin = req?.user?.isAdmin || false;
    return this.processMapService.findAll(workspaceId, pageNum, limitNum, userId, isAdmin);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ProcessMap by ID' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'ProcessMap details',
    type: ProcessMapEntity,
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  findOne(@Param('id') id: string) {
    return this.processMapService.findOne(id);
  }

  @Get(':id/processes')
  @ApiOperation({ summary: 'Get ProcessMap processes' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'List of processes in the ProcessMap',
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  getProcesses(@Param('id') id: string) {
    return this.processMapService.getProcesses(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ProcessMap' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'ProcessMap updated successfully',
    type: ProcessMapEntity,
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  @ApiResponse({ status: 409, description: 'ProcessMap code already exists' })
  update(
    @Param('id') id: string,
    @Body() updateProcessMapDto: UpdateProcessMapDto,
  ) {
    return this.processMapService.update(id, updateProcessMapDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete ProcessMap' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'ProcessMap deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete ProcessMap with associated processes',
  })
  remove(@Param('id') id: string) {
    return this.processMapService.remove(id);
  }

  // ====================================
  // FLOW DIAGRAM ENDPOINTS
  // ====================================

  @Get(':id/flow')
  @ApiOperation({ summary: 'Get FlowDiagram for ProcessMap' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'FlowDiagram data',
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  getFlow(@Param('id') id: string) {
    return this.flowService.getFlow(id);
  }

  @Post(':id/flow/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save FlowDiagram for ProcessMap' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'FlowDiagram saved successfully',
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  saveFlow(
    @Param('id') id: string,
    @Body() saveFlowDto: SaveProcessMapFlowDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.flowService.saveFlow(
      {
        ...saveFlowDto,
        processMapId: id,
      },
      userId,
    );
  }

  // ====================================
  // VALIDATION ENDPOINTS
  // ====================================

  @Post(':id/validation/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request validation for a ProcessMap' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 201,
    description: 'Validation requests created successfully',
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  requestValidation(
    @Param('id') processMapId: string,
    @Body() createValidationDto: CreateValidationRequestDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    if (!userId) {
      throw new BadRequestException('User authentication required');
    }
    return this.validationService.requestValidation(
      processMapId,
      createValidationDto.validatorIds,
      userId,
    );
  }

  @Get(':id/validation')
  @ApiOperation({ summary: 'Get all validation requests for a ProcessMap' })
  @ApiParam({ name: 'id', description: 'ProcessMap ID' })
  @ApiResponse({
    status: 200,
    description: 'List of validation requests',
  })
  @ApiResponse({ status: 404, description: 'ProcessMap not found' })
  getValidationRequests(@Param('id') processMapId: string) {
    return this.validationService.getValidationRequests(processMapId);
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

