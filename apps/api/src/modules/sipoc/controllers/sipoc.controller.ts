import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SipocService } from '../services/sipoc.service';
import { CreateSipocDto } from '../dto/create-sipoc.dto';
import { UpdateSipocDto } from '../dto/update-sipoc.dto';

@Controller('sipoc')
export class SipocController {
  constructor(private readonly sipocService: SipocService) {}

  @Get()
  async findAll(
    @Query('userId') userId: string,
    @Query('status') status?: string,
    @Query('processId') processId?: string,
  ) {
    return this.sipocService.findAllDiagrams(userId, { status, processId });
  }

  @Get('process/:processId')
  async findByProcessId(@Param('processId') processId: string) {
    return this.sipocService.findDiagramsByProcessId(processId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sipocService.findDiagramById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSipocDto: CreateSipocDto,
    @Query('userId') userId: string,
  ) {
    return this.sipocService.createDiagram(createSipocDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSipocDto: UpdateSipocDto,
  ) {
    return this.sipocService.updateDiagram(id, updateSipocDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.sipocService.deleteDiagram(id);
  }
}
