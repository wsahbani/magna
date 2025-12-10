import { Module, forwardRef } from '@nestjs/common';
import { ProcedureService } from './services/procedure.service';
import { ProcedureValidationService } from './services/procedure-validation.service';
import { DiagramService } from './services/diagram.service';
import { ProcedureFlowService } from './services/procedure-flow.service';
import { ProcedureController } from './procedure.controller';
import { ProcedureRepository } from './repositories/procedure.repository';
import { PrismaModule } from '../../database/prisma.module';
import { ProcessModule } from '../process/process.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ProcessModule)],
  controllers: [ProcedureController],
  providers: [
    ProcedureService,
    ProcedureValidationService,
    DiagramService,
    ProcedureFlowService,
    ProcedureRepository,
  ],
  exports: [
    ProcedureService,
    ProcedureValidationService,
    DiagramService,
    ProcedureFlowService,
    ProcedureRepository,
  ],
})
export class ProcedureModule {}

