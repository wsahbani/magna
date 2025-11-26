import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { SipocConnectionService } from '../services/sipoc-connection.service';
import { CreateSipocConnectionDto } from '../dto/create-sipoc-connection.dto';

@Controller('sipoc-connections')
export class SipocConnectionController {
  constructor(private readonly sipocConnectionService: SipocConnectionService) {}

  @Post()
  async createConnection(@Body() createDto: CreateSipocConnectionDto) {
    return this.sipocConnectionService.createConnection(createDto);
  }

  @Get('element/:elementId')
  async getConnectionsByElement(@Param('elementId') elementId: string) {
    return this.sipocConnectionService.findConnectionsByElement(elementId);
  }

  @Get('version/:versionId')
  async getConnectionsByVersion(@Param('versionId') versionId: string) {
    return this.sipocConnectionService.findConnectionsByVersion(versionId);
  }

  @Get(':connectionId')
  async getConnectionById(@Param('connectionId') connectionId: string) {
    return this.sipocConnectionService.findById(connectionId);
  }

  @Delete(':connectionId')
  async deleteConnection(@Param('connectionId') connectionId: string) {
    return this.sipocConnectionService.deleteConnection(connectionId);
  }
}
