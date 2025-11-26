import { Module } from '@nestjs/common';
import { ProcessService } from './services/process.service';
import { FlowService } from './services/flow.service';
import { ProcessController } from './process.controller';
import { ProcessRepository } from './repositories/process.repository';
import { PrismaService } from '../../database/prisma.service';
import { SipocModule } from '../sipoc/sipoc.module';

@Module({
  imports: [SipocModule],
  controllers: [ProcessController],
  providers: [ProcessService, FlowService, ProcessRepository, PrismaService],
  exports: [ProcessService, FlowService, ProcessRepository],
})
export class ProcessModule {}