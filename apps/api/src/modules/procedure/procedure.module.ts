import { Module, forwardRef } from '@nestjs/common';
import { ProcedureService } from './services/procedure.service';
import { ProcedureValidationService } from './services/procedure-validation.service';
import { DiagramService } from './services/diagram.service';
import { ProcedureController } from './procedure.controller';
import { ProcedureRepository } from './repositories/procedure.repository';
import { PrismaService } from '../../database/prisma.service';
import { ProcessModule } from '../process/process.module';

@Module({
  imports: [forwardRef(() => ProcessModule)],
  controllers: [ProcedureController],
  providers: [
    ProcedureService,
    ProcedureValidationService,
    DiagramService,
    ProcedureRepository,
    PrismaService,
  ],
  exports: [
    ProcedureService,
    ProcedureValidationService,
    DiagramService,
    ProcedureRepository,
  ],
})
export class ProcedureModule {}

