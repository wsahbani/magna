import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIClientService } from './services/ai-client.service';
import { ProcessMapAIService } from './services/process-map-ai.service';
import { ProcessMapImageExtractionService } from './services/process-map-image-extraction.service';
import { ProcessAIService } from './services/process-ai.service';
import { ProcessImageExtractionService } from './services/process-image-extraction.service';
import { ProcedureAIService } from './services/procedure-ai.service';
import { ProcedureImageExtractionService } from './services/procedure-image-extraction.service';
import { AICacheService } from './services/ai-cache.service';
import { PrismaService } from '../../database/prisma.service';
import { ProcessMapModule } from '../process-map/process-map.module';
import { ProcessModule } from '../process/process.module';
import { ProcedureModule } from '../procedure/procedure.module';

@Module({
  imports: [ProcessMapModule, ProcessModule, ProcedureModule],
  controllers: [AIController],
  providers: [
    AIClientService,
    ProcessMapAIService,
    ProcessMapImageExtractionService,
    ProcessAIService,
    ProcessImageExtractionService,
    ProcedureAIService,
    ProcedureImageExtractionService,
    AICacheService,
    PrismaService,
  ],
  exports: [
    ProcessMapAIService,
    ProcessMapImageExtractionService,
    ProcessAIService,
    ProcessImageExtractionService,
    ProcedureAIService,
    ProcedureImageExtractionService,
    AICacheService,
  ],
})
export class AIModule {}

