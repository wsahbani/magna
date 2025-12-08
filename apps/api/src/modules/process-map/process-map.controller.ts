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
import { ProcessMapService } from './services/process-map.service';
import { ProcessMapFlowService } from './services/process-map-flow.service';
import { CreateProcessMapDto } from './dto/create-process-map.dto';
import { UpdateProcessMapDto } from './dto/update-process-map.dto';
import { SaveProcessMapFlowDto } from './dto/save-process-map-flow.dto';
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
  ) {
    const pageNum = page && !isNaN(parseInt(page, 10)) ? parseInt(page, 10) : 1;
    const limitNum = limit && !isNaN(parseInt(limit, 10)) ? parseInt(limit, 10) : 20;
    return this.processMapService.findAll(workspaceId, pageNum, limitNum);
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
}

