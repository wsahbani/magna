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
} from '@nestjs/common';
import { ProcedureService } from './services/procedure.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { CreateDiagramNodeDto } from './dto/create-diagram-node.dto';
import { CreateDiagramEdgeDto } from './dto/create-diagram-edge.dto';
import { CreateDiagramLaneDto } from './dto/create-diagram-lane.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/auth.interface';
import { ProcedureValidationService } from './services/procedure-validation.service';

@Controller('procedures')
@UseGuards(JwtAuthGuard)
export class ProcedureController {
  constructor(
    private readonly procedureService: ProcedureService,
    private readonly validationService: ProcedureValidationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateProcedureDto) {
    return this.procedureService.create(createDto);
  }

  @Get()
  findAll(@Query('processId') processId?: string) {
    return this.procedureService.findAll(processId);
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
}

