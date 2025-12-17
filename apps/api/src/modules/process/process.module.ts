import { Module, forwardRef } from '@nestjs/common';
import { ProcessController } from './process.controller';
import { ProcessService } from './services/process.service';
import { ProcessFlowService } from './services/process-flow.service';
import { ProcessRepository } from './repositories/process.repository';
import { PrismaModule } from '../../database/prisma.module';
import { ProcedureModule } from '../procedure/procedure.module';
import { SipocModule } from '../sipoc/sipoc.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ProcedureModule), SipocModule],
  controllers: [ProcessController],
  providers: [ProcessService, ProcessFlowService, ProcessRepository],
  exports: [ProcessService, ProcessFlowService, ProcessRepository],
})
export class ProcessModule {}
