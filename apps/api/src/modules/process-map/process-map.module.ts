import { Module } from '@nestjs/common';
import { ProcessMapService } from './services/process-map.service';
import { ProcessMapController } from './process-map.controller';
import { ProcessMapRepository } from './repositories/process-map.repository';
import { ProcessMapFlowService } from './services/process-map-flow.service';
import { PrismaService } from '../../database/prisma.service';
import { ProcessModule } from '../process/process.module';
import { ProcedureModule } from '../procedure/procedure.module';

@Module({
  imports: [ProcessModule, ProcedureModule],
  controllers: [ProcessMapController],
  providers: [ProcessMapService, ProcessMapRepository, ProcessMapFlowService, PrismaService],
  exports: [ProcessMapService, ProcessMapRepository, ProcessMapFlowService],
})
export class ProcessMapModule {}

