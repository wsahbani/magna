import { Module, forwardRef } from '@nestjs/common';
import { ProcessService } from './services/process.service';
import { FlowService } from './services/flow.service';
import { ProcessMetadataService } from './services/process-metadata.service';
import { ProcessController } from './process.controller';
import { ProcessRepository } from './repositories/process.repository';
import { PrismaService } from '../../database/prisma.service';
import { SipocModule } from '../sipoc/sipoc.module';
import { FipModule } from '../fip/fip.module';
import { ProcedureModule } from '../procedure/procedure.module';

@Module({
  imports: [SipocModule, FipModule, forwardRef(() => ProcedureModule)],
  controllers: [ProcessController],
  providers: [
    ProcessService,
    FlowService,
    ProcessMetadataService,
    ProcessRepository,
    PrismaService,
  ],
  exports: [
    ProcessService,
    FlowService,
    ProcessMetadataService,
    ProcessRepository,
  ],
})
export class ProcessModule {}