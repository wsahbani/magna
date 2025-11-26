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

@Controller('processes')
@UseGuards(JwtAuthGuard)
export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly flowService: FlowService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProcessDto: CreateProcessDto,
    @CurrentUser() user: JwtPayload,
  ) {

    return this.processService.create(createProcessDto, user.sub);
  }

  @Get()
  async findAll(@Query() query: ProcessQueryDto) {
    return this.processService.findAll(query);
  }

  @Get('roots')
  async getRootProcesses() {
    return this.processService.getRootProcesses();
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
    @CurrentUser() user: JwtPayload,
  ) {
    return this.flowService.saveFlow(saveFlowDto, user.sub);
  }

  @Get(':id/flow')
  async getFlow(
    @Param('id') id: string,
    @Query('version') version?: string,
  ) {
    const versionNumber = version ? parseInt(version, 10) : undefined;
    return this.flowService.getFlow(id, versionNumber);
  }

  @Patch(':id/flow/layout')
  async updateFlowLayout(
    @Param('id') id: string,
    @Body() layoutDto: UpdateFlowLayoutDto,
  ) {
    return this.flowService.updateLayout(id, layoutDto);
  }
}