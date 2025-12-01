import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FipService } from '../services/fip.service';
import { CreateFipDto } from '../dto/create-fip.dto';
import { UpdateFipDto } from '../dto/update-fip.dto';
import { ProcessIdentityCard } from '../entities/fip.entity';

@Controller('fip')
export class FipController {
  constructor(private readonly fipService: FipService) {}



  @Get('process/:processId')
  async findByProcessId(
    @Param('processId') processId: string,
  ): Promise<ProcessIdentityCard | null> {
    return this.fipService.findByProcessId(processId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createFipDto: CreateFipDto,
    @Request() req: any,
  ): Promise<ProcessIdentityCard> {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.fipService.create(createFipDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFipDto: UpdateFipDto,
  ): Promise<ProcessIdentityCard> {
    return this.fipService.update(id, updateFipDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.fipService.delete(id);
  }
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProcessIdentityCard> {
    return this.fipService.findById(id);
  }
}

