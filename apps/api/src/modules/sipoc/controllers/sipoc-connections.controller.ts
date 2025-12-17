import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SipocService } from '../services/sipoc.service';
import { CreateConnectionDto } from '../dto/create-connection.dto';

@Controller('sipoc/:sipocId/connections')
export class SipocConnectionsController {
  constructor(private readonly sipocService: SipocService) {}

  @Get()
  async findAll(@Param('sipocId') sipocId: string) {
    return this.sipocService.findConnections(sipocId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createConnectionDto: CreateConnectionDto) {
    return this.sipocService.createConnection(createConnectionDto);
  }

  @Delete(':connectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('connectionId') connectionId: string) {
    await this.sipocService.deleteConnection(connectionId);
  }
}
