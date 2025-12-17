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
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessFlowDto } from './dto/save-process-flow.dto';
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
    @Query('processMapId') processMapId?: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 20;
    return this.processService.findAll(processMapId, workspaceId, pageNum, limitNum);
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
    const userId = req.user?.id || req.user?.sub || 'system';
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
    const userId = req.user?.id || req.user?.sub || 'system';
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
}
